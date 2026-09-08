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
/**
 * One key per Google Cloud project. The free-tier ceiling is counted per
 * project per model, so each extra project is a genuinely separate daily
 * allowance — two keys from the same project share one and add nothing.
 *
 * NOT `~/.config/gemini/api-key`: that one belongs to another project used
 * by unrelated tooling, and spending its quota here would break that.
 */
const GEMINI_KEY_FILES = [
  join(homedir(), '.config', 'gemini', '150-api-key'),
  join(homedir(), '.config', 'gemini', '150-api-key-2'),
];
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

async function loadGeminiKeys() {
  if (process.env.GEMINI_API_KEY) return [process.env.GEMINI_API_KEY.trim()];

  const keys = [];
  for (const file of GEMINI_KEY_FILES) {
    const raw = await readFile(file, 'utf8').catch(() => '');
    const key = raw.trim();
    if (key) keys.push(key);
  }
  if (keys.length === 0) {
    throw new Error(`No Gemini key found in: ${GEMINI_KEY_FILES.join(', ')}`);
  }
  return keys;
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

/**
 * Keys still believed to have quota. A key that reports a per-day violation
 * is dropped for the rest of the run rather than retried — the allowance
 * does not come back before midnight, and retrying it on every remaining
 * name would waste the whole run waiting.
 */
let liveKeys = [];

async function generateGreetingWav(name) {
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

  let res;
  let lastError = '';
  for (const key of [...liveKeys]) {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) break;

    lastError = await res.text().catch(() => '');
    if (res.status !== 429) {
      throw new Error(`Gemini request failed (${res.status}): ${lastError.slice(0, 300)}`);
    }
    if (lastError.includes('PerDay')) {
      liveKeys = liveKeys.filter((k) => k !== key);
      console.warn(`quota exhausted for one key; ${liveKeys.length} left`);
    }
    // A 429 without `PerDay` is the per-minute ceiling: the next key is
    // still worth trying, and the pool loop paces the rest.
  }

  if (!res || !res.ok) {
    throw new Error(`Gemini out of quota on every key: ${lastError.slice(0, 200)}`);
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
  liveKeys = DRY_RUN ? [] : await loadGeminiKeys();
  if (!DRY_RUN) console.log(`gemini keys loaded: ${liveKeys.length}`);
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

      const wav = await generateGreetingWav(name);
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
