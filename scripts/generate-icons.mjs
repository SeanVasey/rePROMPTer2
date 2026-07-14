// One-off icon generator for rePROMPTer 2.
//
// Rasterizes the canonical vector master (public/icon.svg — 900x900, clean
// continuous red border) into the full favicon + PWA icon set. Re-run with
// `node scripts/generate-icons.mjs` whenever the master SVG changes.
//
//   favicon.ico            -> 16/32/48 (transparent, PNG-in-ICO)
//   icon-16/32/48.png      -> transparent favicons
//   icon-192/512.png       -> transparent PWA icons (purpose "any")
//   icon-512-maskable.png  -> icon at 80% on solid #0a090d (purpose "maskable")
//   apple-icon.png         -> 180x180, flattened onto solid #0a090d (iOS ignores alpha)
//
// The SVG stays the primary <link rel="icon" type="image/svg+xml">.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const SRC = join(pub, "icon.svg");
const BG = "#0a090d"; // brand near-black; used where alpha must be flattened

const svg = await readFile(SRC);

// Render the vector to a transparent PNG buffer at an exact pixel size.
const render = (size) =>
  sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

const out = (name, buf) => writeFile(join(pub, name), buf);

// --- transparent favicons + PWA "any" icons ---
const transparent = { 16: null, 32: null, 48: null, 192: null, 512: null };
for (const size of Object.keys(transparent).map(Number)) {
  transparent[size] = await render(size);
  await out(`icon-${size}.png`, transparent[size]);
}

// --- apple-touch-icon: 180x180 flattened onto solid BG (iOS renders alpha as black) ---
await out(
  "apple-icon.png",
  await sharp(svg, { density: 384 })
    .resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .flatten({ background: BG })
    .png()
    .toBuffer(),
);

// --- maskable 512: icon at 80% (410px) centered on a solid BG square, so the
//     red border survives Android's ~10% mask crop ---
const inner = Math.round(512 * 0.8);
const innerPng = await render(inner);
await out(
  "icon-512-maskable.png",
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: BG },
  })
    .composite([{ input: innerPng, gravity: "center" }])
    .png()
    .toBuffer(),
);

// --- favicon.ico containing 16/32/48 (each stored as an embedded PNG) ---
function buildIco(pngs) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4); // image count

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  const chunks = [];
  pngs.forEach(({ size, data }, i) => {
    const e = 16 * i;
    dir.writeUInt8(size >= 256 ? 0 : size, e + 0); // width (0 => 256)
    dir.writeUInt8(size >= 256 ? 0 : size, e + 1); // height
    dir.writeUInt8(0, e + 2); // palette
    dir.writeUInt8(0, e + 3); // reserved
    dir.writeUInt16LE(1, e + 4); // color planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(data.length, e + 8); // bytes in resource
    dir.writeUInt32LE(offset, e + 12); // offset from file start
    offset += data.length;
    chunks.push(data);
  });
  return Buffer.concat([header, dir, ...chunks]);
}

await out(
  "favicon.ico",
  buildIco([
    { size: 16, data: transparent[16] },
    { size: 32, data: transparent[32] },
    { size: 48, data: transparent[48] },
  ]),
);

console.log("Generated favicon.ico, icon-{16,32,48,192,512}.png, icon-512-maskable.png, apple-icon.png");
