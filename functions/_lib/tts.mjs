/**
 * Shared helpers for the Jakarta Coffee Week TTS greeting feature.
 *
 * Pure ESM, no Workers-only APIs (no `caches`, no `crypto.subtle`) — this
 * module is imported both by the Pages Function at `functions/api/tts.ts`
 * and by local Node scripts.
 */

export const R2_PREFIX = 'tts/jcw/';
export const CDN_BASE = 'https://cdn.150coffeegarden.com';

/**
 * Turn a display name into a URL/R2-key-safe slug: lowercase, `a-z0-9-`
 * only, spaces become hyphens, everything else is stripped, capped at 40
 * chars so R2 keys stay short and predictable.
 */
export function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 40);
}

/**
 * Guest-facing name validation. Kept intentionally strict: this string is
 * spoken back by TTS and used to build an R2 key, so anything outside
 * "a couple of words a human would actually type as their name" is
 * rejected up front.
 */
export function validateName(name) {
  if (typeof name !== 'string') return { ok: false, reason: 'empty' };

  const trimmed = name.trim();
  if (!trimmed) return { ok: false, reason: 'empty' };
  if (trimmed.length > 30) return { ok: false, reason: 'too_long' };
  if (!/^[A-Za-z' .-]{2,30}$/.test(trimmed)) return { ok: false, reason: 'bad_chars' };
  if (trimmed.split(/\s+/).length > 2) return { ok: false, reason: 'bad_chars' };
  // The character class above allows punctuation-only input such as "'.",
  // which would slugify to an empty string and write an R2 object at
  // `tts/jcw/.wav`. Require real letters.
  if ((trimmed.match(/[A-Za-z]/g) || []).length < 2) return { ok: false, reason: 'bad_chars' };

  return { ok: true };
}

/**
 * Voice and delivery are pinned here, not at the call sites: the live
 * endpoint and the prewarm script must produce identical audio or the cache
 * would hold two different-sounding greetings under one key.
 *
 * `Callirrhoe` is Google's "easy-going" voice. `Kore` (firm) was tried first
 * and read like an announcement rather than an invitation.
 */
export const TTS_VOICE = 'Callirrhoe';

/** Full prompt for the TTS model: delivery notes first, then the line. */
export function ttsPrompt(name) {
  return (
    'Read this in a relaxed, friendly, conversational way, like inviting a friend. ' +
    'Keep an easy pace and pause naturally after the name and at the dash. ' +
    'Pronounce the Indonesian name naturally. Here is the line: ' +
    greetingText(name)
  );
}

/** Script sent to the TTS model. Placeholder copy for now. */
export function greetingText(name) {
  return `Hello ${name}. Don't forget — we're at Jakarta Coffee Week. Come find us, there's something different waiting for you.`;
}

/**
 * Wrap raw 16-bit PCM (little-endian, signed) in a minimal 44-byte RIFF/WAVE
 * header so browsers can play it directly. No Workers/Node-specific APIs —
 * built on `ArrayBuffer`/`DataView`, which are portable everywhere.
 */
export function pcmToWav(pcmBytes, sampleRate = 24000, channels = 1) {
  const bitsPerSample = 16;
  const blockAlign = channels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcmBytes.length;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const wav = new Uint8Array(buffer);
  wav.set(pcmBytes, 44);
  return wav;
}

/** Public CDN URL for a given slug's cached greeting audio. */
export function audioUrl(slug) {
  return `${CDN_BASE}/${R2_PREFIX}${slug}.wav`;
}
