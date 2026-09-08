/**
 * Builds the printed invitation QR for /e/jcw: a black QR with the 150
 * logogram knocked into the middle.
 *
 * The centre logo is deliberate damage — it covers modules the scanner
 * would otherwise read. Error correction level H tolerates about 30% loss,
 * and the plate below stays near 7% of the symbol area, so the margin is
 * wide. It is still verified by decoding the rendered PNG at the end: a QR
 * that fails only on press is expensive.
 *
 *   node scripts/make-qr.mjs
 *
 * Outputs to assets/qr/.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import sharp from 'sharp';
import jsQR from 'jsqr';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'assets/qr');

const TARGET_URL = 'https://150coffeegarden.com/e/jcw/';

/** Source lockup. Rows 0-480 are the logogram; 519-563 are the wordmark. */
const LOCKUP = path.join(ROOT, 'public/brand/logo-black@2x.webp');
const LOGOGRAM_ROWS = 481;

/** Fraction of the QR's width the logogram spans. */
const LOGO_WIDTH = 0.24;
/** Padding of white around the logogram, as a fraction of the QR's width. */
const PLATE_PAD = 0.025;

/** Raster export size. 2048px prints cleanly well past A4. */
const PNG_SIZE = 2048;

/** Cuts the logogram out of the lockup and trims it to its own ink. */
async function logogramPng() {
  return sharp(LOCKUP)
    .extract({ left: 0, top: 0, width: 640, height: LOGOGRAM_ROWS })
    .trim()
    .png()
    .toBuffer({ resolveWithObject: true });
}

/**
 * Geometry shared by both exports, in the QR's own module units so the SVG
 * and the PNG land the logo in exactly the same place.
 */
function plateGeometry(gridSize, logoMeta) {
  const logoW = gridSize * LOGO_WIDTH;
  const logoH = logoW * (logoMeta.height / logoMeta.width);
  const pad = gridSize * PLATE_PAD;
  const plateW = logoW + pad * 2;
  const plateH = logoH + pad * 2;
  return {
    logoW,
    logoH,
    logoX: (gridSize - logoW) / 2,
    logoY: (gridSize - logoH) / 2,
    plateW,
    plateH,
    plateX: (gridSize - plateW) / 2,
    plateY: (gridSize - plateH) / 2,
    plateR: pad,
  };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const { data: logoBuf, info: logoMeta } = await logogramPng();
  console.log(`logogram: ${logoMeta.width}x${logoMeta.height}`);

  const qrOptions = {
    errorCorrectionLevel: 'H',
    margin: 4, // the quiet zone the spec asks for, in modules
    color: { dark: '#000000ff', light: '#ffffffff' },
  };

  // ── SVG ────────────────────────────────────────────────────────────────
  const svg = await QRCode.toString(TARGET_URL, { ...qrOptions, type: 'svg' });
  const viewBox = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!viewBox) throw new Error('could not read the generated viewBox');
  const grid = Number(viewBox[1]);
  const g = plateGeometry(grid, logoMeta);

  const overlay =
    `<rect x="${g.plateX.toFixed(3)}" y="${g.plateY.toFixed(3)}" ` +
    `width="${g.plateW.toFixed(3)}" height="${g.plateH.toFixed(3)}" ` +
    `rx="${g.plateR.toFixed(3)}" fill="#ffffff"/>` +
    `<image x="${g.logoX.toFixed(3)}" y="${g.logoY.toFixed(3)}" ` +
    `width="${g.logoW.toFixed(3)}" height="${g.logoH.toFixed(3)}" ` +
    `href="data:image/png;base64,${logoBuf.toString('base64')}"/>`;

  const svgOut = svg.replace('</svg>', `${overlay}</svg>`);
  await fs.writeFile(path.join(OUT_DIR, 'jcw-qr.svg'), svgOut);

  // ── PNG ────────────────────────────────────────────────────────────────
  const qrPng = await QRCode.toBuffer(TARGET_URL, { ...qrOptions, type: 'png', width: PNG_SIZE });
  const scale = PNG_SIZE / grid;
  const px = (v) => Math.round(v * scale);

  const plate = await sharp({
    create: {
      width: px(g.plateW),
      height: px(g.plateH),
      channels: 4,
      background: '#ffffff',
    },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${px(g.plateW)}" height="${px(g.plateH)}">` +
            `<rect width="${px(g.plateW)}" height="${px(g.plateH)}" rx="${px(g.plateR)}" fill="#fff"/>` +
            '</svg>',
        ),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();

  const logoScaled = await sharp(logoBuf).resize(px(g.logoW), px(g.logoH), { fit: 'fill' }).png().toBuffer();

  const pngOut = await sharp(qrPng)
    .composite([
      { input: plate, left: px(g.plateX), top: px(g.plateY) },
      { input: logoScaled, left: px(g.logoX), top: px(g.logoY) },
    ])
    .png()
    .toBuffer();

  await fs.writeFile(path.join(OUT_DIR, `jcw-qr-${PNG_SIZE}.png`), pngOut);

  // ── Verify ─────────────────────────────────────────────────────────────
  // Decoded at 512px, roughly what a phone camera resolves at arm's length,
  // rather than at the full export size where anything would read.
  const probeSize = 512;
  const { data: rgba, info } = await sharp(pngOut)
    .resize(probeSize, probeSize)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const decoded = jsQR(new Uint8ClampedArray(rgba), info.width, info.height);

  console.log(`plate covers ${((g.plateW * g.plateH) / (grid * grid) * 100).toFixed(1)}% of the symbol`);
  if (!decoded) {
    console.error('FAILED: the rendered QR did not decode. Shrink LOGO_WIDTH and rerun.');
    process.exitCode = 1;
    return;
  }
  if (decoded.data !== TARGET_URL) {
    console.error(`FAILED: decoded to ${decoded.data}, expected ${TARGET_URL}`);
    process.exitCode = 1;
    return;
  }
  console.log(`verified: decodes to ${decoded.data}`);
  console.log(`wrote ${path.relative(ROOT, OUT_DIR)}/jcw-qr.svg and jcw-qr-${PNG_SIZE}.png`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
