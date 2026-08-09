/**
 * brand-chips — prepares Razim's 16 supplied 3D glass squircle brand chips
 * for the `#brands` marquee (DESIGN-REVISIT.md §3.7, D2).
 *
 * Source masters: `Ref/hotel-brands/*.png` — each a single glossy dimensional
 * squircle chip, centred on a near-white ground, 1672x941 (three of the
 * sixteen ship at 1672x940; dimensions are read per-file, never assumed).
 *
 * Run:  cd site && npx tsx scripts/brand-chips.ts
 *
 * ── The prep, in order ───────────────────────────────────────────────────
 *  1. Detect content against the near-white ground — a background model
 *     fit per file from patches sampled all around the border, never
 *     hardcoded 255 (the ground measures ~253-254, and several masters
 *     carry a faint, non-bilinear vignette across it).
 *  2. Keep the chip's own gloss edge and soft cast shadow — that IS the 3D
 *     dimension. The bbox must include the shadow, not clip it.
 *  3. Crop with a uniform margin, knock the surround to transparent.
 *  4. Normalize every chip onto the same square canvas at a consistent
 *     OPTICAL weight — scale to match the chip body's own height (not the
 *     shadow-inclusive bbox), so a wide-and-short mark (Omni, Auberge, Four
 *     Seasons, Extended Stay America) doesn't read larger than a compact
 *     square one (Marriott, Hyatt) just because its bounding box is wider.
 *  5. Emit 208x208 PNG (<40KB) + AVIF (well under) per chip, transparent.
 *  6. Emit a 4-across contact sheet for at-a-glance QA.
 *
 * ── Why a fitted quadratic background, not one global colour ──────────────
 * The ground is not perfectly flat — several masters (Hyatt, Accor, Best
 * Western, Aloft) carry a measurable vignette (up to ~22 units of Euclidean
 * RGB distance corner-to-corner), and it isn't simply bilinear: it reads
 * closer to radial (brightest near centre) on at least Hyatt. Diffing every
 * pixel against one flat "the background is X" constant would either miss
 * real content (threshold high enough to tolerate the vignette) or misread
 * the vignette itself as content (threshold low). A first pass tried a
 * bilinear interpolation of just the four corner patches; on Hyatt it
 * mispredicted the flat background along the bottom-centre edge by ~18
 * units — enough to render as a faint but visible pale smudge once
 * composited over a dark surface, even though that patch is genuinely flat
 * paper (confirmed: identical RGB to every other clean sample in the file).
 * `fitBackgroundModel` instead least-squares-fits one quadratic surface per
 * RGB channel from 48 patches spread around the full border (12 per edge,
 * not just the 4 corners), which tracks a radial-ish vignette correctly and
 * leaves only genuine content (chip + shadow) as a large residual — verified
 * by direct comparison against the bilinear model's error before the switch.
 *
 * ── Why flood-fill from the border, not a per-pixel threshold bbox ────────
 * A naive "any pixel farther than T from background" bbox is fragile to
 * lone noisy pixels anywhere in the frame (dithering, compression grain) —
 * one stray pixel near a far corner blows the bbox out to the image edge.
 * Flood-filling the background IN from the border, stopping at T_FILL, fixes
 * this: a stray noise pixel that isn't CONNECTED to the border through other
 * sub-threshold pixels can't expand the bbox. Flood-fill is used ONLY to
 * decide the crop window — never for per-pixel alpha (see next).
 *
 * ── Why alpha is a smooth ramp on diff, not the flood-fill mask ────────────
 * An earlier version of this script set alpha from the binary flood-fill
 * mask directly (0 outside, 255 inside), feathered with a blur. Several
 * masters (Hyatt, Best Western, G6, Omni, Loews, Auberge, Aloft) render a
 * faint specular REFLECTION on the ground beneath the shadow, in addition to
 * the shadow itself — and unlike the shadow's smooth falloff, the
 * reflection's diff-from-background is noisy and non-monotonic (it hovers
 * near the flood threshold, patch to patch). Flood-fill connectivity turned
 * that noise into isolated islands of hard alpha=255 — a visible white smudge
 * under the chip on a dark marquee strip. The fix: alpha is now a direct,
 * continuous function of `diff` (`alphaFromDiff`, ramped between T_ALPHA_LO
 * and T_ALPHA_HI) with no binary/connectivity step in it at all, so a patch
 * that's only slightly brighter than the ground gets a correspondingly faint
 * partial alpha instead of snapping to fully opaque. Every chip in this set
 * has a *coloured* rim and highlight (tinted by the chip's own hue, never
 * pure white), so nothing legitimate needs the old highlight-protection —
 * confirmed by inspection, not assumed (see the per-chip QA note in main()).
 *
 * ── Why the alpha feather is still done in premultiplied space ─────────────
 * Even with a smooth ramp, a crisp graphic edge (the chip's side, where
 * there's no shadow at all) can still cross the ramp in 1-2 source px.
 * Blurring alpha alone there (RGB left untouched) would fringe: a
 * half-transparent pixel whose *stored* RGB is still near-white background
 * colour reads, once composited over a dark marquee strip, as a light halo.
 * Premultiplying RGB by alpha before the blur, then dividing back out after,
 * blurs the actual "how much ink is here" quantity instead — the standard
 * fix, and the one that keeps this pipeline halo-free (verified per-chip
 * below and reported honestly if it isn't).
 *
 * Deterministic: same inputs, byte-identical outputs. Safe to re-run.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp, { type OverlayOptions } from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "..");
const repoRoot = path.resolve(siteRoot, "..");

const SOURCE_DIR = path.join(repoRoot, "Ref", "hotel-brands");
const OUTPUT_DIR = path.join(siteRoot, "public", "logos");
const CONTACT_SHEET_PATH = path.join(OUTPUT_DIR, "_contact-sheet.jpg");

// ── Declared input list — add a 17th chip by adding one row here ──────────
interface ChipSource {
  readonly file: string;
  readonly slug: string;
  readonly label: string;
}

const CHIPS: readonly ChipSource[] = [
  { file: "ChatGPT Image Aug 8, 2026, 03_44_31 PM.png", slug: "marriott", label: "Marriott" },
  { file: "ChatGPT Image Aug 8, 2026, 03_44_34 PM.png", slug: "hyatt", label: "Hyatt" },
  { file: "ChatGPT Image Aug 8, 2026, 03_44_36 PM.png", slug: "hilton", label: "Hilton" },
  { file: "ChatGPT Image Aug 8, 2026, 03_44_38 PM.png", slug: "ihg", label: "IHG" },
  { file: "ChatGPT Image Aug 8, 2026, 03_44_40 PM.png", slug: "wyndham", label: "Wyndham" },
  {
    file: "ChatGPT Image Aug 8, 2026, 03_44_42 PM.png",
    slug: "_hold-amber-mark",
    label: "UNIDENTIFIED",
  },
  { file: "ChatGPT Image Aug 8, 2026, 03_44_44 PM.png", slug: "accor", label: "Accor" },
  { file: "ChatGPT Image Aug 8, 2026, 03_44_46 PM.png", slug: "best-western", label: "Best Western" },
  { file: "ChatGPT Image Aug 8, 2026, 03_44_48 PM.png", slug: "sonesta", label: "Sonesta" },
  {
    file: "ChatGPT Image Aug 8, 2026, 03_44_50 PM.png",
    slug: "extended-stay-america",
    label: "Extended Stay America",
  },
  {
    file: "ChatGPT Image Aug 8, 2026, 03_44_53 PM.png",
    slug: "g6-hospitality",
    label: "G6 Hospitality",
  },
  { file: "ChatGPT Image Aug 8, 2026, 03_44_56 PM.png", slug: "omni", label: "Omni Hotels" },
  { file: "ChatGPT Image Aug 8, 2026, 03_44_58 PM.png", slug: "loews", label: "Loews Hotels & Resorts" },
  {
    file: "ChatGPT Image Aug 8, 2026, 03_45_06 PM.png",
    slug: "auberge",
    label: "Auberge Resorts Collection",
  },
  { file: "ChatGPT Image Aug 8, 2026, 03_45_13 PM.png", slug: "four-seasons", label: "Four Seasons" },
  { file: "ChatGPT Image Aug 8, 2026, 04_04_00 PM.png", slug: "aloft", label: "Aloft Hotels" },
];

// ── Tunables ────────────────────────────────────────────────────────────
/** 2x raster for a ~52px marquee render slot (DESIGN-REVISIT §3.7 step 5). */
const CANVAS_SIZE = 208;
/**
 * Background flood-fill threshold (Euclidean RGB distance from the fitted
 * quadratic background model, `fitBackgroundModel`). Measured across all 16
 * masters: clean-background residual noise tops out ~5.5; the vignette-heavy
 * masters (Hyatt, Accor, Best Western, Aloft) still land under 8 once the
 * quadratic correction is applied. Real shadow signal crosses into double
 * digits within a few px of the chip. 14 sits with margin above the noise
 * floor while still catching the shadow's faint tail as it fades to the
 * ground.
 */
const T_FILL = 14;
/**
 * "Definitely the solid chip" threshold — used ONLY to measure the glass
 * body's own height for optical-weight scaling, never for the alpha
 * knockout. High enough that no background or shadow pixel in any of the
 * 16 masters reaches it (chip colour is saturated; shadow is a soft grey
 * tint that stays well below this even at its darkest, right at the rim).
 */
const T_BODY = 60;
/**
 * Alpha ramp bounds (Euclidean RGB diff -> 0..255 alpha), see file header
 * "Why alpha is a smooth ramp on diff". T_ALPHA_LO sits just above the
 * measured clean-background noise ceiling (~5.5-8) so flat ground is fully
 * transparent; T_ALPHA_HI is comfortably below any saturated chip colour
 * (typically 100-400+) but high enough that the shadow's visually "solid"
 * zone right at the chip's rim reaches full opacity, not just its faint tail.
 */
const T_ALPHA_LO = 8;
const T_ALPHA_HI = 50;
const MARGIN_FRACTION = 0.05;
const MARGIN_MIN_PX = 16;
/** Native-res blur radius for the premultiplied alpha feather (anti-aliasing only). */
const FEATHER_SIGMA = 2.2;
/** Chip body occupies this fraction of the canvas height at 1x optical weight. */
const TARGET_BODY_FRACTION = 0.74;
/** Safety clamp so a wide chip (Auberge/Aloft ~1.27 aspect) never spills past the square canvas. */
const MAX_CONTENT_WIDTH = 196;
/** Body centre sits slightly above canvas centre — more room below for the shadow tail than above. */
const VERTICAL_ANCHOR_FRACTION = 0.47;
const PNG_BUDGET_BYTES = 40 * 1024;
const AVIF_BUDGET_BYTES = 40 * 1024;

// ── Geometry helpers ────────────────────────────────────────────────────
interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface Bbox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function bboxWidth(b: Bbox): number {
  return b.maxX - b.minX + 1;
}
function bboxHeight(b: Bbox): number {
  return b.maxY - b.minY + 1;
}
function bboxCenterX(b: Bbox): number {
  return (b.minX + b.maxX) / 2;
}
function bboxCenterY(b: Bbox): number {
  return (b.minY + b.maxY) / 2;
}

function samplePatchMean(
  data: Buffer,
  width: number,
  height: number,
  channels: number,
  x0: number,
  y0: number,
  size: number,
): Rgb {
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let n = 0;
  for (let y = y0; y < y0 + size && y < height; y += 1) {
    for (let x = x0; x < x0 + size && x < width; x += 1) {
      const idx = (y * width + x) * channels;
      sumR += data[idx];
      sumG += data[idx + 1];
      sumB += data[idx + 2];
      n += 1;
    }
  }
  return { r: sumR / n, g: sumG / n, b: sumB / n };
}

/**
 * Solves the 6x6 normal-equations system for `fitQuadraticBackground` via
 * Gaussian elimination with partial pivoting. Small and dense — no library
 * needed.
 */
function solve6x6(a: number[][], rhs: number[]): number[] {
  const n = 6;
  const m = a.map((row, i) => [...row, rhs[i]]);
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let r = col + 1; r < n; r += 1) {
      if (Math.abs(m[r][col]) > Math.abs(m[pivot][col])) pivot = r;
    }
    [m[col], m[pivot]] = [m[pivot], m[col]];
    for (let r = 0; r < n; r += 1) {
      if (r === col) continue;
      const factor = m[r][col] / m[col][col];
      for (let c = col; c <= n; c += 1) m[r][c] -= factor * m[col][c];
    }
  }
  return m.map((row, i) => row[n] / row[i]);
}

/** Quadratic surface a + b·x + c·y + d·xy + e·x² + f·y², fit per RGB channel. */
type QuadCoef = readonly [number, number, number, number, number, number];
interface BackgroundModel {
  r: QuadCoef;
  g: QuadCoef;
  b: QuadCoef;
}

function fitChannelQuadratic(points: { x: number; y: number; v: number }[]): QuadCoef {
  const a: number[][] = Array.from({ length: 6 }, () => Array(6).fill(0));
  const rhs = Array(6).fill(0);
  for (const p of points) {
    const phi = [1, p.x, p.y, p.x * p.y, p.x * p.x, p.y * p.y];
    for (let i = 0; i < 6; i += 1) {
      for (let j = 0; j < 6; j += 1) a[i][j] += phi[i] * phi[j];
      rhs[i] += phi[i] * p.v;
    }
  }
  const c = solve6x6(a, rhs);
  return [c[0], c[1], c[2], c[3], c[4], c[5]];
}

/**
 * Fits the near-white ground as a quadratic surface per channel, sampled
 * from many patches around the full border — not just the four corners.
 *
 * A plain bilinear fit from 4 corners assumes the ground darkens/lightens
 * as a saddle between them. Several masters (Hyatt, Accor, Best Western,
 * Aloft) don't — their vignette is closer to radial, brightest near centre —
 * and a 4-corner bilinear model systematically MISPREDICTS the background
 * along the mid-edges as a result. Measured on Hyatt: at the bottom-centre,
 * genuinely flat background (RGB 253,253,253, matching every other clean
 * patch in the file) diffed at ~18 against the bilinear model — high enough
 * to read as faint content and register as a visible pale smudge once
 * composited over a dark surface, even though nothing is actually there.
 * The quadratic surface (fit from 12 patches per edge, 48 total) predicts
 * that same point within ~3-7, back in line with the file's real noise
 * floor — confirmed by direct comparison before this model replaced the
 * bilinear one.
 */
function fitBackgroundModel(
  data: Buffer,
  width: number,
  height: number,
  channels: number,
): BackgroundModel {
  const patch = 8;
  const inset = 4;
  const samplesPerEdge = 12;
  const rPts: { x: number; y: number; v: number }[] = [];
  const gPts: { x: number; y: number; v: number }[] = [];
  const bPts: { x: number; y: number; v: number }[] = [];

  const addSample = (x0: number, y0: number): void => {
    const mean = samplePatchMean(data, width, height, channels, x0, y0, patch);
    const cx = x0 + patch / 2;
    const cy = y0 + patch / 2;
    rPts.push({ x: cx, y: cy, v: mean.r });
    gPts.push({ x: cx, y: cy, v: mean.g });
    bPts.push({ x: cx, y: cy, v: mean.b });
  };

  for (let i = 0; i < samplesPerEdge; i += 1) {
    const t = i / (samplesPerEdge - 1);
    addSample(Math.round(t * (width - patch)), inset);
    addSample(Math.round(t * (width - patch)), height - patch - inset);
    addSample(inset, Math.round(t * (height - patch)));
    addSample(width - patch - inset, Math.round(t * (height - patch)));
  }

  return { r: fitChannelQuadratic(rPts), g: fitChannelQuadratic(gPts), b: fitChannelQuadratic(bPts) };
}

function evalBackground(model: BackgroundModel, x: number, y: number): Rgb {
  const phi = [1, x, y, x * y, x * x, y * y];
  const dot = (c: QuadCoef): number => phi.reduce((s, p, i) => s + p * c[i], 0);
  return { r: dot(model.r), g: dot(model.g), b: dot(model.b) };
}

/**
 * Single pass: builds the per-pixel diff-from-local-background field and,
 * as a byproduct, the "definitely solid chip" bbox at T_BODY.
 */
function computeDiffFieldAndBody(
  data: Buffer,
  width: number,
  height: number,
  channels: number,
  bg: BackgroundModel,
): { diff: Float32Array; bodyBbox: Bbox | null } {
  const diff = new Float32Array(width * height);
  let minX = width;
  let maxX = -1;
  let minY = height;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const ref = evalBackground(bg, x, y);
      const idx = y * width + x;
      const pxIdx = idx * channels;
      const dr = data[pxIdx] - ref.r;
      const dg = data[pxIdx + 1] - ref.g;
      const db = data[pxIdx + 2] - ref.b;
      const d = Math.sqrt(dr * dr + dg * dg + db * db);
      diff[idx] = d;
      if (d >= T_BODY) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  return { diff, bodyBbox: maxX >= 0 ? { minX, maxX, minY, maxY } : null };
}

/**
 * Flood-fills the background IN from the border wherever diff < threshold.
 * Returns a mask (1 = background, 0 = foreground — chip, shadow, or a
 * protected interior highlight the flood never reached).
 */
function floodFillBackground(
  width: number,
  height: number,
  diff: Float32Array,
  threshold: number,
): Uint8Array {
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let qHead = 0;
  let qTail = 0;

  const tryPush = (x: number, y: number): void => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    if (diff[idx] >= threshold) return;
    visited[idx] = 1;
    queue[qTail] = idx;
    qTail += 1;
  };

  for (let x = 0; x < width; x += 1) {
    tryPush(x, 0);
    tryPush(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    tryPush(0, y);
    tryPush(width - 1, y);
  }

  while (qHead < qTail) {
    const idx = queue[qHead];
    qHead += 1;
    const x = idx % width;
    const y = (idx / width) | 0;
    tryPush(x - 1, y);
    tryPush(x + 1, y);
    tryPush(x, y - 1);
    tryPush(x, y + 1);
  }

  return visited;
}

function boundingBoxOfForeground(width: number, height: number, bgMask: Uint8Array): Bbox | null {
  let minX = width;
  let maxX = -1;
  let minY = height;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!bgMask[y * width + x]) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return maxX >= 0 ? { minX, maxX, minY, maxY } : null;
}

/**
 * Continuous alpha from a diff value — see file header "Why alpha is a
 * smooth ramp on diff". Deliberately has no connectivity/flood-fill
 * component: a pixel's opacity depends only on how far its own colour sits
 * from the local background estimate, never on its neighbours.
 */
function alphaFromDiff(diffValue: number): number {
  if (diffValue <= T_ALPHA_LO) return 0;
  if (diffValue >= T_ALPHA_HI) return 255;
  return Math.round((255 * (diffValue - T_ALPHA_LO)) / (T_ALPHA_HI - T_ALPHA_LO));
}

/**
 * Premultiplied-alpha feather: blurs "how much ink" rather than RGB and
 * alpha independently, so the anti-aliased edge never fringes light or dark
 * against whatever it's later composited over. See file header.
 */
async function featherAlphaHaloFree(rgba: Buffer, width: number, height: number): Promise<Buffer> {
  const n = width * height;
  const premult = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i += 1) {
    const a = rgba[i * 4 + 3];
    premult[i * 4] = Math.round((rgba[i * 4] * a) / 255);
    premult[i * 4 + 1] = Math.round((rgba[i * 4 + 1] * a) / 255);
    premult[i * 4 + 2] = Math.round((rgba[i * 4 + 2] * a) / 255);
    premult[i * 4 + 3] = a;
  }

  const blurred = await sharp(premult, { raw: { width, height, channels: 4 } })
    .blur(FEATHER_SIGMA)
    .raw()
    .toBuffer();

  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i += 1) {
    const a = blurred[i * 4 + 3];
    if (a === 0) {
      out[i * 4] = 0;
      out[i * 4 + 1] = 0;
      out[i * 4 + 2] = 0;
      out[i * 4 + 3] = 0;
    } else {
      out[i * 4] = Math.min(255, Math.round((blurred[i * 4] * 255) / a));
      out[i * 4 + 1] = Math.min(255, Math.round((blurred[i * 4 + 1] * 255) / a));
      out[i * 4 + 2] = Math.min(255, Math.round((blurred[i * 4 + 2] * 255) / a));
      out[i * 4 + 3] = a;
    }
  }
  return out;
}

/** Encodes a PNG under budget, falling back to palette quantization if truecolor doesn't fit. */
async function encodePngUnderBudget(
  raw: Buffer,
  width: number,
  height: number,
): Promise<{ buffer: Buffer; usedPalette: boolean; colors: number | null }> {
  const truecolor = await sharp(raw, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
    .toBuffer();
  if (truecolor.length <= PNG_BUDGET_BYTES) {
    return { buffer: truecolor, usedPalette: false, colors: null };
  }

  for (const colors of [256, 128, 64, 32]) {
    const paletted = await sharp(raw, { raw: { width, height, channels: 4 } })
      .png({ compressionLevel: 9, palette: true, colors, dither: 1 })
      .toBuffer();
    if (paletted.length <= PNG_BUDGET_BYTES) {
      return { buffer: paletted, usedPalette: true, colors };
    }
  }

  // Smallest attempt, even if still over budget — caller reports the miss honestly.
  const smallest = await sharp(raw, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9, palette: true, colors: 32, dither: 1 })
    .toBuffer();
  return { buffer: smallest, usedPalette: true, colors: 32 };
}

async function encodeAvifUnderBudget(raw: Buffer, width: number, height: number): Promise<Buffer> {
  for (const quality of [60, 50, 40, 30, 22]) {
    const buf = await sharp(raw, { raw: { width, height, channels: 4 } })
      .avif({ quality, effort: 6 })
      .toBuffer();
    if (buf.length <= AVIF_BUDGET_BYTES) return buf;
  }
  return sharp(raw, { raw: { width, height, channels: 4 } }).avif({ quality: 22, effort: 6 }).toBuffer();
}

// ── Per-chip result, reported back to the caller for verification ─────────
interface ChipResult {
  slug: string;
  label: string;
  pngPath: string;
  avifPath: string;
  pngBytes: number;
  avifBytes: number;
  usedPalette: boolean;
  width: number;
  height: number;
  hasAlpha: boolean;
  isSquare: boolean;
  bodyHeightPx: number;
  scale: number;
  cropWidth: number;
  cropHeight: number;
  pngPreview: Buffer;
}

async function buildChip(chip: ChipSource): Promise<ChipResult> {
  const srcPath = path.join(SOURCE_DIR, chip.file);
  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const bg = fitBackgroundModel(data, width, height, channels);

  const { diff, bodyBbox } = computeDiffFieldAndBody(data, width, height, channels, bg);
  if (!bodyBbox) {
    throw new Error(`${chip.slug}: no chip body detected above T_BODY=${T_BODY} — inspect the source`);
  }

  const bgMask = floodFillBackground(width, height, diff, T_FILL);
  const fgBbox = boundingBoxOfForeground(width, height, bgMask);
  if (!fgBbox) {
    throw new Error(`${chip.slug}: flood fill found no foreground — T_FILL=${T_FILL} may be too low`);
  }

  const margin = Math.max(
    MARGIN_MIN_PX,
    Math.round(Math.max(bboxWidth(fgBbox), bboxHeight(fgBbox)) * MARGIN_FRACTION),
  );
  const cropX0 = Math.max(0, fgBbox.minX - margin);
  const cropY0 = Math.max(0, fgBbox.minY - margin);
  const cropX1 = Math.min(width - 1, fgBbox.maxX + margin);
  const cropY1 = Math.min(height - 1, fgBbox.maxY + margin);
  const cropW = cropX1 - cropX0 + 1;
  const cropH = cropY1 - cropY0 + 1;

  // Build the cropped RGBA — alpha is the smooth diff ramp (alphaFromDiff),
  // not the flood-fill mask; the mask above was only ever for the bbox.
  const rampedRgba = Buffer.alloc(cropW * cropH * 4);
  for (let y = 0; y < cropH; y += 1) {
    for (let x = 0; x < cropW; x += 1) {
      const sx = cropX0 + x;
      const sy = cropY0 + y;
      const srcIdx = sy * width + sx;
      const srcPxIdx = srcIdx * channels;
      const dstIdx = (y * cropW + x) * 4;
      rampedRgba[dstIdx] = data[srcPxIdx];
      rampedRgba[dstIdx + 1] = data[srcPxIdx + 1];
      rampedRgba[dstIdx + 2] = data[srcPxIdx + 2];
      rampedRgba[dstIdx + 3] = alphaFromDiff(diff[srcIdx]);
    }
  }

  const featheredRgba = await featherAlphaHaloFree(rampedRgba, cropW, cropH);

  // Optical-weight scale: match the chip BODY's height, clamp so a wide
  // chip BODY never spills past the square canvas. The clamp is checked
  // against the body's own width, not the shadow-inclusive crop width —
  // a compact chip can carry a shadow that spreads far sideways (Hyatt's
  // does, nearly canvas-edge to canvas-edge) without the chip itself being
  // wide, and that shadow spread must never shrink the chip. The scaled
  // crop is free to run past the canvas edge; it gets trimmed to the visible
  // canvas window below (libvips' composite refuses an overlay larger than
  // its base, so this can't be left to composite itself), which is harmless
  // because the shadow is already fading to transparent out there.
  const bodyHeightPx = bboxHeight(bodyBbox);
  const bodyWidthPx = bboxWidth(bodyBbox);
  const targetBodyPx = CANVAS_SIZE * TARGET_BODY_FRACTION;
  let scale = targetBodyPx / bodyHeightPx;
  const bodyWidthAtScale = bodyWidthPx * scale;
  if (bodyWidthAtScale > MAX_CONTENT_WIDTH) {
    scale = MAX_CONTENT_WIDTH / bodyWidthPx;
  }

  const resizedW = Math.max(1, Math.round(cropW * scale));
  const resizedH = Math.max(1, Math.round(cropH * scale));
  const resizedRgba = await sharp(featheredRgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .resize(resizedW, resizedH, { kernel: "lanczos3" })
    .raw()
    .toBuffer();

  // Body centre, in the resized frame, is what gets anchored on the canvas.
  const bodyCenterXCrop = bboxCenterX(bodyBbox) - cropX0;
  const bodyCenterYCrop = bboxCenterY(bodyBbox) - cropY0;
  const bodyCenterXResized = bodyCenterXCrop * scale;
  const bodyCenterYResized = bodyCenterYCrop * scale;

  const offsetX = Math.round(CANVAS_SIZE / 2 - bodyCenterXResized);
  const offsetY = Math.round(CANVAS_SIZE * VERTICAL_ANCHOR_FRACTION - bodyCenterYResized);

  // libvips' composite requires the overlay to fit within the base canvas
  // (it errors, it does not clip) — so trim the resized image to exactly the
  // window that will land inside [0, CANVAS_SIZE) x [0, CANVAS_SIZE) first.
  // This also correctly handles a negative offset (body anchored such that
  // part of the shadow falls left/above the canvas) by skipping into the
  // resized image rather than starting at its origin.
  const extractLeft = Math.max(0, -offsetX);
  const extractTop = Math.max(0, -offsetY);
  const extractWidth = Math.max(
    1,
    Math.min(resizedW - extractLeft, CANVAS_SIZE - Math.max(0, offsetX)),
  );
  const extractHeight = Math.max(
    1,
    Math.min(resizedH - extractTop, CANVAS_SIZE - Math.max(0, offsetY)),
  );
  const placeLeft = Math.max(0, offsetX);
  const placeTop = Math.max(0, offsetY);

  const visibleRgba = await sharp(resizedRgba, { raw: { width: resizedW, height: resizedH, channels: 4 } })
    .extract({ left: extractLeft, top: extractTop, width: extractWidth, height: extractHeight })
    .raw()
    .toBuffer();

  const canvasRaw = await sharp({
    create: { width: CANVAS_SIZE, height: CANVAS_SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      {
        input: visibleRgba,
        raw: { width: extractWidth, height: extractHeight, channels: 4 },
        left: placeLeft,
        top: placeTop,
      },
    ])
    .raw()
    .toBuffer();

  const png = await encodePngUnderBudget(canvasRaw, CANVAS_SIZE, CANVAS_SIZE);
  const avif = await encodeAvifUnderBudget(canvasRaw, CANVAS_SIZE, CANVAS_SIZE);

  const pngPath = path.join(OUTPUT_DIR, `${chip.slug}.png`);
  const avifPath = path.join(OUTPUT_DIR, `${chip.slug}.avif`);
  await writeFile(pngPath, png.buffer);
  await writeFile(avifPath, avif);

  const verify = await sharp(pngPath).metadata();

  return {
    slug: chip.slug,
    label: chip.label,
    pngPath,
    avifPath,
    pngBytes: png.buffer.length,
    avifBytes: avif.length,
    usedPalette: png.usedPalette,
    width: verify.width ?? 0,
    height: verify.height ?? 0,
    hasAlpha: verify.hasAlpha ?? false,
    isSquare: verify.width === verify.height,
    bodyHeightPx,
    scale,
    cropWidth: cropW,
    cropHeight: cropH,
    pngPreview: png.buffer,
  };
}

async function buildContactSheet(results: readonly ChipResult[]): Promise<void> {
  const COLS = 4;
  const rows = Math.ceil(results.length / COLS);
  const TILE = CANVAS_SIZE;
  const GUTTER = 24;
  const LABEL_H = 24;
  const cellW = TILE + GUTTER;
  const cellH = TILE + 10 + LABEL_H;
  const sheetW = COLS * cellW + GUTTER;
  const sheetH = rows * cellH + GUTTER;

  // Neutral mid-grey backdrop: light enough to reveal a white halo, dark
  // enough that black chips (Four Seasons, Omni) still read against it.
  const SHEET_BG = { r: 92, g: 92, b: 96 };

  const composites: OverlayOptions[] = [];
  for (let i = 0; i < results.length; i += 1) {
    const r = results[i];
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const left = GUTTER + col * cellW;
    const top = GUTTER + row * cellH;
    composites.push({ input: r.pngPreview, left, top });

    const labelSvg = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${LABEL_H}">` +
        `<text x="${TILE / 2}" y="${LABEL_H - 7}" text-anchor="middle" ` +
        `font-family="Menlo, Consolas, monospace" font-size="13" fill="#f2f2f0">${escapeXml(
          r.slug,
        )}</text></svg>`,
    );
    composites.push({ input: labelSvg, left, top: top + TILE + 8 });
  }

  await sharp({
    create: { width: sheetW, height: sheetH, channels: 3, background: SHEET_BG },
  })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toFile(CONTACT_SHEET_PATH);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function main(): Promise<void> {
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Fail fast, with a clear message, if a slug-mapped source file went missing.
  for (const chip of CHIPS) {
    const p = path.join(SOURCE_DIR, chip.file);
    try {
      await readFile(p);
    } catch {
      throw new Error(`${chip.slug}: source not found at ${p}`);
    }
  }

  const results: ChipResult[] = [];
  for (const chip of CHIPS) {
    const r = await buildChip(chip);
    results.push(r);
    const pngFlag = r.pngBytes > PNG_BUDGET_BYTES ? "  *** OVER PNG BUDGET ***" : "";
    const avifFlag = r.avifBytes > AVIF_BUDGET_BYTES ? "  *** OVER AVIF BUDGET ***" : "";
    console.log(
      `[${chip.slug.padEnd(24)}] ${r.width}x${r.height}  png=${String(r.pngBytes).padStart(6)}B` +
        `${r.usedPalette ? " (palette)" : "          "}  avif=${String(r.avifBytes).padStart(6)}B` +
        `  alpha=${r.hasAlpha ? "yes" : "NO "}  square=${r.isSquare ? "yes" : "NO "}` +
        `  bodyH=${r.bodyHeightPx}px  scale=${r.scale.toFixed(3)}  crop=${r.cropWidth}x${r.cropHeight}` +
        `${pngFlag}${avifFlag}`,
    );
  }

  await buildContactSheet(results);
  const sheetMeta = await sharp(CONTACT_SHEET_PATH).metadata();
  console.log(
    `\n[_contact-sheet.jpg] ${sheetMeta.width}x${sheetMeta.height} (${(
      await readFile(CONTACT_SHEET_PATH)
    ).length} bytes)`,
  );

  // ── Summary / gate check ──────────────────────────────────────────────
  const overPng = results.filter((r) => r.pngBytes > PNG_BUDGET_BYTES);
  const overAvif = results.filter((r) => r.avifBytes > AVIF_BUDGET_BYTES);
  const notSquare = results.filter((r) => !r.isSquare);
  const noAlpha = results.filter((r) => !r.hasAlpha);
  const paletteFallback = results.filter((r) => r.usedPalette);

  console.log(`\n${results.length}/${CHIPS.length} chips built.`);
  if (overPng.length) console.log(`OVER PNG BUDGET: ${overPng.map((r) => r.slug).join(", ")}`);
  if (overAvif.length) console.log(`OVER AVIF BUDGET: ${overAvif.map((r) => r.slug).join(", ")}`);
  if (notSquare.length) console.log(`NOT SQUARE: ${notSquare.map((r) => r.slug).join(", ")}`);
  if (noAlpha.length) console.log(`NO ALPHA CHANNEL: ${noAlpha.map((r) => r.slug).join(", ")}`);
  if (paletteFallback.length) {
    console.log(`Palette-quantized to fit budget: ${paletteFallback.map((r) => r.slug).join(", ")}`);
  }
  if (!overPng.length && !overAvif.length && !notSquare.length && !noAlpha.length) {
    console.log("All gates green: square, alpha present, under byte budget.");
  }

  console.log(
    `\n_hold-amber-mark is prepared but UNIDENTIFIED — do not wire it into the marquee ` +
      `until it is named (see DESIGN-REVISIT.md §slug map).`,
  );
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
