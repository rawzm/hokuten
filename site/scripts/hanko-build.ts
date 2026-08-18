/**
 * hanko-build — rasterises the hanko seal's small cut into the two binary
 * icon artifacts the browser and iOS ask for.
 *
 *   site/public/brand/favicon-gold.svg  ─┬─►  site/public/favicon.ico          16 / 32 / 48
 *                                        └─►  site/public/brand/apple-touch-icon.png  180
 *
 * Run:  cd site && npx tsx scripts/hanko-build.ts
 *
 * ── Why the GOLD small cut is the source ─────────────────────────────────────
 * Theme G is the production default (`lib/theme.ts`), and these two files are
 * declared unconditionally in `app/layout.tsx` / `lib/seo.ts` — one `.ico`, one
 * apple-touch icon, no per-theme variant. The per-theme `<link rel="icon">` is
 * the SVG (`themePresentation.favicon`), which every browser released this
 * decade prefers over the `.ico`. So the binaries are gold; Theme B's blue
 * still arrives via `favicon-blue.svg`.
 *
 * It is the SMALL CUT, not `hanko-gold.svg`: the full seal stacks 北天, and two
 * stacked characters inside a border become a smudge at 16px. The small cut
 * carries 北 alone at ~1.7x stroke weight. See docs/design/HANKO.md.
 *
 * ── Why the ICO is assembled here ────────────────────────────────────────────
 * sharp cannot write ICO — `sharp.format.ico` is undefined, ICO is decode-only
 * in libvips. Checked, not assumed. The container is small and fully specified,
 * so `buildIco()` below writes it directly: a 6-byte ICONDIR, one 16-byte
 * ICONDIRENTRY per size, then the PNG payloads. PNG-compressed entries are the
 * Vista+ form and are read by every current browser; this is also what the
 * common `to-ico` / `png-to-ico` packages emit.
 *
 * ── Why apple-touch-icon gets an opaque ground ───────────────────────────────
 * iOS composites a transparent home-screen icon onto black and then applies its
 * own superellipse mask, so a transparent PNG reads as a dirty rectangle. The
 * icon is therefore stamped on `--dark` #1A1C1F (gold on dark = 5.47:1, the
 * measured value in docs/design/CONTRAST.md — L2, 2026-08-17 retuned both the
 * charcoal and the gold, so this ground and that ratio both moved) with a 12%
 * inset so the mask never
 * clips the seal border. The `.ico` stays transparent on purpose — it has to sit
 * on both a light and a dark browser tab strip.
 *
 * Deterministic: same inputs, byte-identical outputs.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "..");
const brandDir = path.join(siteRoot, "public", "brand");
const publicDir = path.join(siteRoot, "public");

const SOURCE = path.join(brandDir, "favicon-gold.svg");
const ICO_OUT = path.join(publicDir, "favicon.ico");
const APPLE_OUT = path.join(brandDir, "apple-touch-icon.png");

/** ICO members. 48 is the Windows shortcut size; 16/32 are the tab sizes. */
const ICO_SIZES = [16, 32, 48] as const;

const APPLE_SIZE = 180;
/** Brand `--dark`. iOS masks the corners, so the seal needs room to breathe. */
const APPLE_GROUND = "#1A1C1F";
const APPLE_INSET = 0.12;

/**
 * Render the SVG at `size`. The high density matters: librsvg rasterises from
 * the SVG's intrinsic 100x100 box, so without it a 180px icon is upscaled from
 * 100px and the border edges go soft.
 */
async function renderSquare(svg: Buffer, size: number): Promise<Buffer> {
  return sharp(svg, { density: Math.max(72, Math.ceil((size / 100) * 72 * 8)) })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
}

/**
 * Assemble an ICO from PNG payloads.
 *
 * ICONDIR   : u16 reserved(0) · u16 type(1 = icon) · u16 count
 * ICONDIRENTRY (16 bytes each):
 *   u8 width · u8 height   (0 means 256)
 *   u8 colorCount(0) · u8 reserved(0)
 *   u16 planes(1) · u16 bitCount(32)
 *   u32 bytesInRes · u32 imageOffset
 */
function buildIco(images: { size: number; png: Buffer }[]): Buffer {
  const count = images.length;
  const headerSize = 6 + count * 16;
  const dir = Buffer.alloc(headerSize);

  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(count, 4);

  let offset = headerSize;
  images.forEach((img, i) => {
    const at = 6 + i * 16;
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, at);
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, at + 1);
    dir.writeUInt8(0, at + 2);
    dir.writeUInt8(0, at + 3);
    dir.writeUInt16LE(1, at + 4);
    dir.writeUInt16LE(32, at + 6);
    dir.writeUInt32LE(img.png.length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += img.png.length;
  });

  return Buffer.concat([dir, ...images.map((i) => i.png)], offset);
}

async function main(): Promise<void> {
  if (!fs.existsSync(SOURCE)) {
    throw new Error(`Missing source seal: ${path.relative(siteRoot, SOURCE)}`);
  }
  const svg = fs.readFileSync(SOURCE);

  // ── favicon.ico ──────────────────────────────────────────────────────────
  const members: { size: number; png: Buffer }[] = [];
  for (const size of ICO_SIZES) {
    members.push({ size, png: await renderSquare(svg, size) });
  }
  fs.writeFileSync(ICO_OUT, buildIco(members));
  console.log(
    `  favicon.ico          ${ICO_SIZES.join(" / ")}  (${fs.statSync(ICO_OUT).size} bytes, PNG payloads)`,
  );

  // ── apple-touch-icon.png ─────────────────────────────────────────────────
  const inner = Math.round(APPLE_SIZE * (1 - APPLE_INSET * 2));
  const seal = await renderSquare(svg, inner);
  const pad = Math.round((APPLE_SIZE - inner) / 2);
  await sharp({
    create: {
      width: APPLE_SIZE,
      height: APPLE_SIZE,
      channels: 4,
      background: APPLE_GROUND,
    },
  })
    .composite([{ input: seal, left: pad, top: pad }])
    // iOS wants no alpha channel at all: flatten composites the seal onto the
    // ground, removeAlpha drops the now-fully-opaque band so the file ships RGB.
    .flatten({ background: APPLE_GROUND })
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toFile(APPLE_OUT);
  console.log(`  apple-touch-icon.png ${APPLE_SIZE}x${APPLE_SIZE}  (${fs.statSync(APPLE_OUT).size} bytes)`);

  // ── read the outputs back and report what is actually on disk ────────────
  const apple = await sharp(APPLE_OUT).metadata();
  console.log(
    `  verify apple-touch:  ${apple.width}x${apple.height} ${apple.format} channels=${apple.channels} alpha=${apple.hasAlpha}`,
  );

  const ico = fs.readFileSync(ICO_OUT);
  const n = ico.readUInt16LE(4);
  const entries: string[] = [];
  for (let i = 0; i < n; i += 1) {
    const at = 6 + i * 16;
    const w = ico.readUInt8(at) || 256;
    const h = ico.readUInt8(at + 1) || 256;
    const len = ico.readUInt32LE(at + 8);
    const off = ico.readUInt32LE(at + 12);
    const payload = ico.subarray(off, off + len);
    const meta = await sharp(payload).metadata();
    entries.push(`${w}x${h}->${meta.width}x${meta.height} ${meta.format} alpha=${meta.hasAlpha}`);
  }
  console.log(`  verify favicon.ico:  ${n} entries — ${entries.join(", ")}`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
