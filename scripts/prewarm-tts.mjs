#!/usr/bin/env node
/**
 * Pre-warm the Jakarta Coffee Week TTS greeting cache.
 *
 * Reads a list of common Indonesian first names, generates a spoken
 * greeting for each via Gemini TTS, and uploads the resulting WAV to R2
 * under the same key the live `/api/tts` endpoint would use — so guests
 * with a common name get an instant cache hit instead of a live
 * generation.
 *
 * Run manually from the repo root:
 *   node scripts/prewarm-tts.mjs [--limit=N] [--dry-run] [--force]
 *
 * No npm dependencies. Uses Node's built-in `fetch` and shells out to
 * `npx wrangler` for R2 reads/writes.
 */

import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

import { R2_PREFIX, slugify, ttsPrompt, TTS_VOICE, pcmToWav, audioUrl } from '../functions/_lib/tts.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

const NAMES_FILE = join(REPO_ROOT, 'scripts', 'data', 'names-id.txt');
const OUT_DIR = join(REPO_ROOT, 'scripts', '.tts-out');
const GEMINI_KEY_FILE = join(homedir(), '.config', 'gemini', 'api-key');
const R2_BUCKET = 'cdn-150web';
const CLOUDFLARE_ACCOUNT_ID = '5f1aab7579746f239c7553d1fb3587a0';
const MODEL = 'gemini-2.5-flash-preview-tts';
const MAX_CONCURRENCY = 3;

// --- CLI flags ---------------------------------------------------------

const args = process.argv.slice(2);
const limitArg = args.find((a) => a.startsWith('--limit='));
const LIMIT = limitArg ? Number.parseInt(limitArg.slice('--limit='.length), 10) : undefined;
const DRY_RUN = args.includes('--dry-run');
const FORCE = args.includes('--force');

// --- Setup ---------------------------------------------------------------

async function loadGeminiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  const raw = await readFile(GEMINI_KEY_FILE, 'utf8');
  const key = raw.trim();
  if (!key) throw new Error(`Empty Gemini key at ${GEMINI_KEY_FILE}`);
  return key;
}

async function loadNames() {
  const raw = await readFile(NAMES_FILE, 'utf8');
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

// --- Wrangler shell-out ---------------------------------------------------

/** Run `npx wrangler <args>`, resolve with { code, stdout, stderr }. Never rejects on non-zero exit. */
function runWrangler(cliArgs) {
  return new Promise((resolve) => {
    const child = spawn('npx', ['wrangler', ...cliArgs], {
      env: { ...process.env, CLOUDFLARE_ACCOUNT_ID },
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('close', (code) => resolve({ code: code ?? 1, stdout, stderr }));
    child.on('error', (err) => resolve({ code: 1, stdout, stderr: String(err) }));
  });
}

/**
 * True if the greeting already exists.
 *
 * Checked over the public CDN rather than `wrangler r2 object get`: that
 * command streams the whole object just to prove it is there, which for a few
 * hundred ~144 KB files means tens of megabytes and one spawned process per
 * name. A HEAD request costs nothing and answers the same question.
 */
async function r2ObjectExists(slug) {
  try {
    const res = await fetch(audioUrl(slug), { method: 'HEAD', cache: 'no-store' });
    return res.ok;
  } catch {
    // Network trouble is not proof of absence, but re-generating is harmless
    // (the upload is idempotent), so fail open and let it be rebuilt.
    return false;
  }
}

async function r2ObjectPut(key, filePath) {
  const { code, stderr } = await runWrangler([
    'r2', 'object', 'put', `${R2_BUCKET}/${key}`,
    '--file', filePath,
    '--remote',
    '--content-type', 'audio/wav',
    '--cache-control', 'public, max-age=31536000, immutable',
  ]);
  if (code !== 0) throw new Error(`wrangler r2 object put failed: ${stderr.trim() || `exit ${code}`}`);
}

// --- Gemini TTS ------------------------------------------------------------

async function generateGreetingWav(name, geminiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${geminiKey}`;
  const body = {
    contents: [
      {
        parts: [
          {
            text: ttsPrompt(name),
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: TTS_VOICE } } },
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Gemini request failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const json = await res.json();
  const b64 = json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!b64) throw new Error('Gemini response missing inlineData.data');

  const pcm = Buffer.from(b64, 'base64');
  return pcmToWav(pcm, 24000, 1);
}

// --- Concurrency pool --------------------------------------------------

async function runPool(items, limit, worker) {
  let cursor = 0;
  async function next() {
    while (cursor < items.length) {
      const i = cursor++;
      await worker(items[i], i);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, () => next());
  await Promise.all(workers);
}

// --- Main ------------------------------------------------------------------

async function main() {
  const geminiKey = DRY_RUN ? null : await loadGeminiKey();
  let names = await loadNames();
  if (LIMIT !== undefined && Number.isFinite(LIMIT)) names = names.slice(0, LIMIT);

  if (!DRY_RUN) await mkdir(OUT_DIR, { recursive: true });

  const skipped = [];
  const created = [];
  const failed = [];

  await runPool(names, MAX_CONCURRENCY, async (name) => {
    const slug = slugify(name);
    const key = `${R2_PREFIX}${slug}.wav`;

    try {
      if (!FORCE) {
        const exists = DRY_RUN ? false : await r2ObjectExists(slug);
        if (exists) {
          skipped.push(name);
          return;
        }
      }

      if (DRY_RUN) {
        console.log(`[dry-run] would generate + upload: ${key}`);
        created.push(name);
        return;
      }

      const wav = await generateGreetingWav(name, geminiKey);
      const tmpPath = join(OUT_DIR, `${slug}.wav`);
      await writeFile(tmpPath, wav);
      await r2ObjectPut(key, tmpPath);
      created.push(name);
      console.log(`ok: ${key}`);
    } catch (err) {
      failed.push({ name, error: err instanceof Error ? err.message : String(err) });
      console.error(`fail: ${name} — ${err instanceof Error ? err.message : err}`);
    }
  });

  console.log('\n--- prewarm-tts summary ---');
  console.log(`skipped (already cached): ${skipped.length}`);
  console.log(`created${DRY_RUN ? ' (dry-run, planned)' : ''}: ${created.length}`);
  console.log(`failed: ${failed.length}`);
  if (failed.length) {
    console.log('failed names:');
    for (const f of failed) console.log(`  - ${f.name}: ${f.error}`);
  }
}

main().catch((err) => {
  console.error('Fatal:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
