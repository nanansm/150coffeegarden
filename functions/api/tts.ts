/**
 * POST /api/tts
 *
 * Generates a short, personalized greeting for a guest name using Gemini
 * TTS, caches the WAV in R2, and returns its public CDN URL. Repeat
 * requests for the same (slugified) name are served straight from the R2
 * `head` check — cache hits do not touch the rate limiter or Gemini.
 *
 * Rate limiting rides on the same `AVAILABILITY_KV` binding already used by
 * `functions/api/availability.ts`, keyed per-IP-per-minute, per-IP-per-hour,
 * and a global daily cap, so a single misbehaving client (or a viral booth
 * queue) cannot blow the Gemini budget.
 */

import { R2_PREFIX, validateName, slugify, ttsPrompt, TTS_VOICE, pcmToWav, audioUrl } from '../_lib/tts.mjs';

interface Env {
  TTS_R2: R2Bucket;
  AVAILABILITY_KV: KVNamespace;
  GEMINI_API_KEY: string;
  /**
   * Optional second key from a DIFFERENT Google Cloud project. The free-tier
   * ceiling is counted per project per model, so a second project doubles the
   * daily budget — two keys from one project would share one allowance and
   * buy nothing.
   */
  GEMINI_API_KEY_2?: string;
}

const GEMINI_MODEL = 'gemini-2.5-flash-preview-tts';

const RATE_LIMIT_MINUTE = 5;
const RATE_LIMIT_HOUR = 20;
const RATE_LIMIT_DAY = 500;

function json(payload: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

/**
 * Bump a KV-backed counter and report whether it is already at/over `limit`.
 * Not atomic — KV has no increment primitive — so under heavy concurrent
 * load a couple of extra requests can slip through. Acceptable here: the
 * caps exist to protect the Gemini budget from abuse, not to be exact.
 */
async function checkAndBump(
  kv: KVNamespace,
  key: string,
  limit: number,
  ttlSeconds: number,
): Promise<boolean> {
  const current = Number((await kv.get(key)) || '0');
  if (current >= limit) return false;
  await kv.put(key, String(current + 1), { expirationTtl: ttlSeconds });
  return true;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  // Only accept requests that originate from this same host — the endpoint
  // spends Gemini quota and R2 writes, so it should not be embeddable
  // elsewhere.
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ error: 'forbidden' }, 403);
  }

  let body: { name?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_name' }, 400);
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const validation = validateName(name);
  if (!validation.ok) {
    return json({ error: 'invalid_name' }, 400);
  }

  const slug = slugify(name);
  const key = R2_PREFIX + slug + '.wav';

  // Cache hit: skip rate limiting and Gemini entirely.
  const existing = await env.TTS_R2.head(key);
  if (existing) {
    return json({ url: audioUrl(slug), cached: true }, 200);
  }

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const now = new Date();
  const minuteBucket = Math.floor(now.getTime() / 60000);
  const hourBucket = Math.floor(now.getTime() / 3600000);
  const dayBucket = now.toISOString().slice(0, 10).replace(/-/g, '');

  const withinMinute = await checkAndBump(
    env.AVAILABILITY_KV,
    `tts:ip:${ip}:m:${minuteBucket}`,
    RATE_LIMIT_MINUTE,
    120,
  );
  const withinHour =
    withinMinute &&
    (await checkAndBump(
      env.AVAILABILITY_KV,
      `tts:ip:${ip}:h:${hourBucket}`,
      RATE_LIMIT_HOUR,
      7200,
    ));
  const withinDay =
    withinHour &&
    (await checkAndBump(
      env.AVAILABILITY_KV,
      `tts:global:${dayBucket}`,
      RATE_LIMIT_DAY,
      172800,
    ));

  if (!withinMinute || !withinHour || !withinDay) {
    return json({ error: 'rate_limited' }, 429);
  }

  try {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: ttsPrompt(name) }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: TTS_VOICE } } },
      },
    });

    const keys = [env.GEMINI_API_KEY, env.GEMINI_API_KEY_2].filter(Boolean) as string[];
    if (keys.length === 0) throw new Error('no Gemini key configured');

    // Tried in order, moving on only when a key is out of quota. Anything
    // else — a bad key, a model error — is a real fault and must not be
    // masked by silently retrying on the spare.
    let geminiRes!: Response;
    for (const key of keys) {
      geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
        { method: 'POST', headers: { 'content-type': 'application/json' }, body },
      );
      if (geminiRes.status !== 429) break;
    }

    // Every key exhausted. Answering 502 here would file a spent allowance
    // under "server fault" in the logs; the guest sees the same line either
    // way, but the status is the only place the real reason survives.
    if (geminiRes.status === 429) {
      console.warn('[tts] every Gemini key is out of quota');
      return json({ error: 'rate_limited' }, 429);
    }
    if (!geminiRes.ok) throw new Error(`gemini status ${geminiRes.status}`);

    const geminiJson = await geminiRes.json();
    const base64Audio: unknown =
      geminiJson?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (typeof base64Audio !== 'string' || !base64Audio) {
      throw new Error('gemini response missing inline audio data');
    }

    const binary = atob(base64Audio);
    const pcm = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) pcm[i] = binary.charCodeAt(i);

    const wav = pcmToWav(pcm);

    // Awaited on purpose: the client loads the URL immediately after this
    // response, so `waitUntil` would risk a 404 on first play.
    await env.TTS_R2.put(key, wav, {
      httpMetadata: {
        contentType: 'audio/wav',
        cacheControl: 'public, max-age=31536000, immutable',
      },
    });

    return json({ url: audioUrl(slug), cached: false }, 200);
  } catch (err) {
    console.error('[tts] generation failed:', err);
    return json({ error: 'tts_failed' }, 502);
  }
};
