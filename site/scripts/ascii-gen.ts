/**
 * ascii-gen.ts — BUILD-TIME generator for the ASCII hero art (the site's one
 * signature effect). Nothing in here ever runs in the browser.
 *
 * RUN IT (from `site/`, package.json is intentionally NOT edited — another
 * agent owns that file; add `"art:gen"` pointing at the first line below when
 * you touch package.json next):
 *
 *   npx tsx scripts/ascii-gen.ts
 *
 *   # explicit / swappable source:
 *   npx tsx scripts/ascii-gen.ts --in public/hotels/renaissance-reno.jpg \
 *       --out ascii --palette both --cols 160 --frames 28 --fps 4
 *
 * Flags (all optional):
 *   --in <path>       source photo          default public/hotels/hie-brooklyn.jpg
 *   --out <name>      output basename       default "ascii"  -> public/art/<name>-<palette>.{json,svg}
 *   --palette <p>     gold | blue | both    default both
 *   --cols <n>        character columns     default 160
 *   --frames <n>      loop frames (24..36)  default 28
 *   --fps <n>         loop playback rate    default 4   (28 / 4 = 7.0s loop)
 *   --seed <n>        accent placement RNG  default 20260808
 *
 * Spec of record: .agents/skills/hokuten-design-director/references/05-motion.md
 * Contract of record: site/lib/ascii-types.ts
 */

import sharp from "sharp";
import { gzipSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { AsciiArt, AsciiFrame, AsciiPalette } from "../lib/ascii-types";

/* ===========================================================================
   0. Constants + CLI
   =========================================================================== */

const TAU = Math.PI * 2;

/**
 * cellHeight / cellWidth for the mono face.
 *
 * IBM Plex Mono's advance width is 600/1000 em = 0.6em. The art grid pins the
 * line box to 1.0em (a flush terminal grid — glyphs touch vertically, which is
 * what gives the field its density). So a cell is 0.6em wide by 1.0em tall:
 *
 *     charAspect = cellHeight / cellWidth = 1.0 / 0.6 = 1.6667
 *
 * Rows are derived from this so the photograph is NOT vertically squashed:
 *     rows = round((imgH / imgW) * cols / charAspect)
 */
const CHAR_ASPECT = 1 / 0.6; // 1.6667

/** Supersample factor per cell when reading the photo (sub-cell flow quality). */
const SUPERSAMPLE = 3;

/** Auto-levels percentiles (clip the extreme tails before the contrast curve). */
const LEVELS_LOW_PCT = 0.02;
const LEVELS_HIGH_PCT = 0.98;

/** Mild contrast curve — enough to separate the building from the sky, not a threshold. */
const CONTRAST = 1.15;
const GAMMA = 0.92;

/**
 * Floyd–Steinberg error strength. Full 1.0 produces the classic FS "worms";
 * damping to ~0.6 keeps gradients reading as TEXTURE (heritage through a
 * digital sieve) instead of banding, without the crawl.
 */
const DITHER_STRENGTH = 0.62;

/** Ambient loop: peak flow displacement in CELL units, and luminance breathe depth. */
const FLOW_AMPLITUDE = 1.15;
const BREATHE_DEPTH = 0.03;

/** The wordmark that the seam row resolves into. */
const SEAM_TEXT = "THE HOKUTEN GROUP";
const SEAM_LETTER_GAP = 1; // padding cells between letters (keep the art visible between them)
const SEAM_WORD_GAP = 3; // padding cells between words
/**
 * The seam row's padding cells are blanked, plus this many cells of margin each
 * side of the wordmark. Without it the row is not legible: H O K U T E N are all
 * ramp members, so a letter flanked by art glyphs reads as more art. See the
 * comment at the placement site.
 */
const SEAM_QUIET_MARGIN = 2;
const QUIET_GLYPH = " ";
/** Seam row sits at this fraction of the height — comfortably in the lower third. */
const SEAM_ROW_FRACTION = 0.72;

/**
 * Headline safe region, in normalised grid coords. The hero headline occupies
 * the upper-left/centre, so nothing load-bearing (seam row, CJK accents) is
 * allowed inside rows [0, 0.42) x cols [0, 0.62).
 */
const HEADLINE_SAFE = { rowMax: 0.42, colMax: 0.62 };

/**
 * CJK accent layer. 北天ホクテン, placed sparsely as DOUBLE-WIDTH glyphs.
 *
 * WHY THESE ARE NOT RAMP MEMBERS
 * ------------------------------
 * Every CJK glyph in a monospace face is TWO cells wide (East Asian Wide, and
 * IBM Plex Mono has no CJK coverage at all — the browser substitutes a CJK
 * face whose advance is 2x the Latin advance). Put one in the luminance ramp
 * and every subsequent glyph on that row shifts half a cell right, so the
 * whole image shears one row at a time; the seam row stops lining up; and
 * canvas `fillText` per-cell drawing double-draws into its neighbour. The
 * naive "CJK in the charset" approach destroys grid integrity.
 *
 * It is also wrong perceptually: 北 has ~2x the ink of # spread over 2x the
 * area, so it is not a distinct luminance step — it is a *mark*.
 *
 * So the motif ships as a separate ACCENT LAYER: a handful of glyphs recorded
 * in `wide` as [row, col], with the continuation cell (col + 1) written as a
 * space. Renderers that honour `wide` draw one double-width glyph and skip the
 * continuation; renderers that ignore it still get a correctly aligned grid
 * with a small blank. Grid integrity is preserved either way, and 北天 is in
 * the art.
 */
const ACCENT_GLYPHS = ["北", "天", "ホ", "ク", "テ", "ン"];
/** Accents only land in mid-luminance regions — never in a blown highlight or a void. */
const ACCENT_LUM_BAND: [number, number] = [0.3, 0.72];
/** Minimum VISUAL separation between accents, in cell-widths. */
const ACCENT_MIN_DISTANCE = 22;

/**
 * Seam-row luminance bands, per palette (fractions of the bucket range).
 *
 * `lum` drives colour (see ASCII_TONE_STOPS in lib/ascii-types.ts) and LOW lum
 * is the high-contrast end on BOTH grounds: on black the low end is gold
 * against black; on the cool-white plate the low end is deep indigo against
 * white. So the seam letters are pushed BRIGHT on gold and DARK on blue. They
 * still track the local luminance inside the band, which is what makes the
 * wordmark read as emerging from the art rather than stamped over it.
 */
const SEAM_LUM_BAND: Record<AsciiPalette, [number, number]> = {
  gold: [0.62, 0.92],
  blue: [0.06, 0.32],
};

/** Literal fallbacks for the standalone SVG. Mirrors app/globals.css section 2. */
const SVG_FALLBACK: Record<AsciiPalette, Record<string, string>> = {
  gold: { ink: "#B8902E", mid: "#C9A04A", light: "#F7F4ED", ground: "#000000" },
  blue: { ink: "#1F3C8C", mid: "#7E96D0", light: "#C9D4EE", ground: "#F7F8F5" },
};

/** Tone thresholds — MUST stay in sync with ASCII_TONE_STOPS in lib/ascii-types.ts. */
const TONE_STOPS = [0.34, 0.67] as const;

/** Budget from ref 05: both palettes' JSON, combined. */
const BUDGET_BYTES = 1.5 * 1024 * 1024;

type Args = {
  in: string;
  out: string;
  palette: "gold" | "blue" | "both";
  cols: number;
  frames: number;
  fps: number;
  seed: number;
};

function parseArgs(argv: string[]): Args {
  const a: Args = {
    in: "public/hotels/hie-brooklyn.jpg",
    out: "ascii",
    palette: "both",
    cols: 160,
    frames: 28,
    fps: 4,
    seed: 20260808,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const k = argv[i];
    const v = argv[i + 1];
    if (!k.startsWith("--")) continue;
    switch (k.slice(2)) {
      case "in":
        a.in = v;
        i += 1;
        break;
      case "out":
        a.out = v;
        i += 1;
        break;
      case "palette":
        if (v !== "gold" && v !== "blue" && v !== "both") {
          throw new Error(`--palette must be gold | blue | both (got ${v})`);
        }
        a.palette = v;
        i += 1;
        break;
      case "cols":
        a.cols = Number(v);
        i += 1;
        break;
      case "frames":
        a.frames = Number(v);
        i += 1;
        break;
      case "fps":
        a.fps = Number(v);
        i += 1;
        break;
      case "seed":
        a.seed = Number(v);
        i += 1;
        break;
      default:
        throw new Error(`unknown flag ${k}`);
    }
  }
  if (!Number.isInteger(a.cols) || a.cols < 40 || a.cols > 400) {
    throw new Error("--cols must be an integer in [40, 400]");
  }
  if (!Number.isInteger(a.frames) || a.frames < 24 || a.frames > 36) {
    throw new Error("--frames must be an integer in [24, 36] (ref 05 ambient loop spec)");
  }
  if (!(a.fps > 0 && a.fps <= 24)) throw new Error("--fps must be in (0, 24] (ref 05)");
  if (a.frames / a.fps > 12) throw new Error("loop must be <= 12s (ref 05)");
  return a;
}

/* ===========================================================================
   1. Charset — ORDERED BY MEASURED INK COVERAGE
   =========================================================================== */

/**
 * Candidate charset (ref 01 "ASCII/dither art" + ref 05 "Charset ramp"):
 * HOKUTEN letters + digits + `·.:-=+*#`, plus the empty cell.
 *
 * `·` is U+00B7 MIDDLE DOT, not U+30FB KATAKANA MIDDLE DOT. Same reason as the
 * CJK note above: U+30FB is East Asian Wide and would shear the grid.
 *
 * The empty cell is the ramp's zero-coverage anchor. It is what lets the black
 * cover panel actually go black in Theme G (and the cool-white plate actually
 * go white in Theme B) instead of bottoming out in a grey haze of dots.
 */
const CHARSET = [
  " ",
  "·",
  ".",
  ":",
  "-",
  "=",
  "+",
  "*",
  "#",
  "H",
  "O",
  "K",
  "U",
  "T",
  "E",
  "N",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

/**
 * The mono face used for coverage measurement.
 *
 * IBM Plex Mono is delivered by `next/font` as woff2 and is not installed on
 * the build machine, so fontconfig falls through this stack to Menlo — a true
 * monospace with the SAME 0.6em advance. Coverage is only ever used to RANK
 * glyphs, and the rank order of `.:-=+*#`, HOKUTEN and 0-9 is a property of
 * the shapes, not of the face. If IBM Plex Mono is ever installed on the build
 * host, this stack picks it up automatically and the ramp regenerates.
 */
const MEASURE_FONT_STACK = "IBM Plex Mono, Menlo, monospace";
const MEASURE_FONT_SIZE = 100;
/** Nominal cell area at MEASURE_FONT_SIZE: 0.6em advance x 1.0em line box. */
const MEASURE_CELL_AREA = MEASURE_FONT_SIZE * 0.6 * MEASURE_FONT_SIZE;

function xmlEscape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Rasterise one glyph, centred in an oversized box, and return its ink area as
 * a fraction of the nominal cell area. Antialiased coverage is summed as
 * sub-pixel grey, so this is a real area measurement, not a pixel count.
 */
async function measureCoverage(ch: string): Promise<number> {
  const W = 160;
  const H = 220;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="#000"/>
<text x="${W / 2}" y="150" font-family="${MEASURE_FONT_STACK}" font-size="${MEASURE_FONT_SIZE}" fill="#fff" text-anchor="middle" xml:space="preserve">${xmlEscape(ch)}</text>
</svg>`;
  const { data } = await sharp(Buffer.from(svg, "utf8"))
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let sum = 0;
  for (let i = 0; i < data.length; i += 1) sum += data[i];
  return sum / 255 / MEASURE_CELL_AREA;
}

/** Measured coverage for every candidate, ascending. */
async function buildCoverageTable(): Promise<{ ch: string; coverage: number }[]> {
  const rows: { ch: string; coverage: number }[] = [];
  for (const ch of CHARSET) {
    rows.push({ ch, coverage: await measureCoverage(ch) });
  }
  rows.sort((a, b) => a.coverage - b.coverage || a.ch.localeCompare(b.ch));
  return rows;
}

/* ===========================================================================
   2. Luminance field
   =========================================================================== */

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

type Field = {
  data: Float32Array;
  w: number;
  h: number;
};

/**
 * Read the photo as a supersampled greyscale field, auto-levelled and put
 * through a mild contrast curve. `fit: "fill"` is deliberate: the vertical
 * squash it introduces is exactly undone by the 0.6:1 character cell.
 */
async function loadField(inputPath: string, cols: number, rows: number): Promise<Field> {
  const w = cols * SUPERSAMPLE;
  const h = rows * SUPERSAMPLE;
  const { data } = await sharp(inputPath)
    .rotate() // honour EXIF orientation before anything else
    .greyscale()
    .resize({ width: w, height: h, fit: "fill", kernel: "lanczos3" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Auto-levels: 2nd / 98th percentile stretch, so a hazy sky does not eat the ramp.
  const hist = new Uint32Array(256);
  for (let i = 0; i < data.length; i += 1) hist[data[i]] += 1;
  const total = data.length;
  let acc = 0;
  let lo = 0;
  let hi = 255;
  for (let v = 0; v < 256; v += 1) {
    acc += hist[v];
    if (acc >= total * LEVELS_LOW_PCT) {
      lo = v;
      break;
    }
  }
  acc = 0;
  for (let v = 255; v >= 0; v -= 1) {
    acc += hist[v];
    if (acc >= total * (1 - LEVELS_HIGH_PCT)) {
      hi = v;
      break;
    }
  }
  const span = Math.max(1, hi - lo);

  const out = new Float32Array(total);
  for (let i = 0; i < total; i += 1) {
    let v = clamp01((data[i] - lo) / span);
    v = clamp01(0.5 + (v - 0.5) * CONTRAST);
    out[i] = clamp01(Math.pow(v, GAMMA));
  }
  return { data: out, w, h };
}

function sampleBilinear(f: Field, x: number, y: number): number {
  const cx = Math.min(f.w - 1.001, Math.max(0, x));
  const cy = Math.min(f.h - 1.001, Math.max(0, y));
  const x0 = Math.floor(cx);
  const y0 = Math.floor(cy);
  const x1 = Math.min(f.w - 1, x0 + 1);
  const y1 = Math.min(f.h - 1, y0 + 1);
  const fx = cx - x0;
  const fy = cy - y0;
  const a = f.data[y0 * f.w + x0];
  const b = f.data[y0 * f.w + x1];
  const c = f.data[y1 * f.w + x0];
  const d = f.data[y1 * f.w + x1];
  return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy;
}

/* ===========================================================================
   3. Ambient morph — a seamless, low-frequency flow displacement
   =========================================================================== */

/**
 * Every term is a sine of (spatial phase ± loop phase), so the whole field is
 * exactly 2π-periodic: frame `frames` IS frame 0, byte for byte.
 *
 * `swell` = (1 - cos(phase)) / 2 is 0 at phase 0 and 0 again at 2π, so
 * frames[0] is the UNDISTORTED photograph — the honest static frame that the
 * SVG fallback and the reduced-motion state both use. The art breathes out to
 * peak displacement at the half-loop and settles back. Peak displacement is
 * ~1.15 cells: the hotel never stops being the hotel.
 */
function flow(nx: number, ny: number, phase: number): [number, number, number] {
  const swell = (1 - Math.cos(phase)) / 2;
  const A = FLOW_AMPLITUDE * swell;
  const dx =
    A *
    (0.62 * Math.sin(TAU * (0.9 * nx + 0.35 * ny) + phase) +
      0.38 * Math.sin(TAU * (1.7 * ny - 0.45 * nx) + 1.31 - phase));
  const dy =
    A *
    (0.62 * Math.sin(TAU * (1.3 * ny - 0.25 * nx) + 2.11 + phase) +
      0.38 * Math.sin(TAU * (0.8 * nx + 0.6 * ny) + 0.44 + phase));
  const breathe = BREATHE_DEPTH * swell * Math.sin(TAU * (0.55 * nx + 0.4 * ny) + phase);
  return [dx, dy, breathe];
}

/** Resample the field onto the character grid for one loop phase. */
function buildGridField(f: Field, cols: number, rows: number, phase: number): Float32Array {
  const grid = new Float32Array(cols * rows);
  const ss = SUPERSAMPLE;
  const inv = 1 / (ss * ss);
  for (let r = 0; r < rows; r += 1) {
    const ny = r / rows;
    for (let c = 0; c < cols; c += 1) {
      const [dx, dy, breathe] = flow(c / cols, ny, phase);
      const ox = dx * ss;
      const oy = dy * ss;
      let acc = 0;
      for (let j = 0; j < ss; j += 1) {
        for (let i = 0; i < ss; i += 1) {
          acc += sampleBilinear(f, c * ss + i + 0.5 + ox, r * ss + j + 0.5 + oy);
        }
      }
      grid[r * cols + c] = clamp01(acc * inv + breathe);
    }
  }
  return grid;
}

/* ===========================================================================
   4. Dither -> luminance buckets
   =========================================================================== */

/**
 * Serpentine Floyd–Steinberg with damped error, quantising to `levels` buckets.
 *
 * Returns the buckets AND the per-cell threshold offset that produced them
 * (the accumulated diffused error at the moment each cell was quantised).
 *
 * That offset field is the whole trick behind the ambient loop. Re-running FS
 * per frame is chaotic — a 0.01 change in one cell cascades through the error
 * diffusion and re-rolls a third of the grid, which reads as television static,
 * not breathing. So FS runs ONCE, on the undistorted frame 0, and every other
 * frame reuses its offsets as a fixed per-cell threshold (`quantizeWithOffsets`).
 * Frame 0 is bit-identical either way, the FS texture is preserved, and a cell
 * only changes glyph when the image underneath it actually moved.
 */
function ditherToBuckets(
  field: Float32Array,
  cols: number,
  rows: number,
  levels: number,
): Uint8Array {
  const buf = Float32Array.from(field);
  const out = new Uint8Array(cols * rows);
  const offsets = new Float32Array(cols * rows);
  const maxB = levels - 1;
  const push = (r: number, c: number, e: number) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    buf[r * cols + c] += e;
  };
  for (let r = 0; r < rows; r += 1) {
    const ltr = (r & 1) === 0;
    for (let k = 0; k < cols; k += 1) {
      const c = ltr ? k : cols - 1 - k;
      const i = r * cols + c;
      const v = clamp01(buf[i]);
      const b = Math.round(v * maxB);
      out[i] = b;
      offsets[i] = buf[i] - field[i];
      const err = (v - b / maxB) * DITHER_STRENGTH;
      const d = ltr ? 1 : -1;
      push(r, c + d, (err * 7) / 16);
      push(r + 1, c - d, (err * 3) / 16);
      push(r + 1, c, (err * 5) / 16);
      push(r + 1, c + d, (err * 1) / 16);
    }
  }
  return out;
}

/* ===========================================================================
   5. Seam row + CJK accent placement
   =========================================================================== */

type SeamCell = { col: number; ch: string };

/** Lay the wordmark out with padding cells between letters so the art shows through. */
function layoutSeam(cols: number): SeamCell[] {
  const words = SEAM_TEXT.split(" ");
  let width = 0;
  words.forEach((w, i) => {
    width += w.length + (w.length - 1) * SEAM_LETTER_GAP;
    if (i < words.length - 1) width += SEAM_WORD_GAP;
  });
  if (width > cols - 4) throw new Error(`seam text (${width} cells) does not fit in ${cols} cols`);
  const start = Math.round((cols - width) / 2);
  const cells: SeamCell[] = [];
  let x = start;
  words.forEach((w, wi) => {
    for (let i = 0; i < w.length; i += 1) {
      cells.push({ col: x, ch: w[i] });
      x += 1 + (i < w.length - 1 ? SEAM_LETTER_GAP : 0);
    }
    if (wi < words.length - 1) x += SEAM_WORD_GAP;
  });
  return cells;
}

/** Deterministic RNG so the accent layout is reproducible across runs. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function placeAccents(
  buckets: Uint8Array,
  cols: number,
  rows: number,
  levels: number,
  seamRow: number,
  seamCols: Set<number>,
  seed: number,
): [number, number][] {
  const maxB = levels - 1;
  const candidates: [number, number][] = [];
  for (let r = 3; r < rows - 3; r += 1) {
    if (Math.abs(r - seamRow) <= 2) continue; // never in or beside the seam row
    for (let c = 2; c < cols - 3; c += 1) {
      if (r < rows * HEADLINE_SAFE.rowMax && c < cols * HEADLINE_SAFE.colMax) continue;
      if (seamCols.has(c) || seamCols.has(c + 1)) continue;
      const t = buckets[r * cols + c] / maxB;
      const t2 = buckets[r * cols + c + 1] / maxB;
      if (t < ACCENT_LUM_BAND[0] || t > ACCENT_LUM_BAND[1]) continue;
      if (t2 < ACCENT_LUM_BAND[0] || t2 > ACCENT_LUM_BAND[1]) continue;
      candidates.push([r, c]);
    }
  }
  const rnd = mulberry32(seed);
  for (let i = candidates.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
  const chosen: [number, number][] = [];
  for (const [r, c] of candidates) {
    if (chosen.length >= ACCENT_GLYPHS.length) break;
    const ok = chosen.every(([pr, pc]) => {
      // Visual distance: a row step is CHAR_ASPECT times a column step.
      const dv = Math.hypot(c - pc, (r - pr) * CHAR_ASPECT);
      const overlaps = pr === r && Math.abs(c - pc) <= 1;
      return dv >= ACCENT_MIN_DISTANCE && !overlaps;
    });
    if (ok) chosen.push([r, c]);
  }
  // Reading order: top-to-bottom, left-to-right, so 北天ホクテン runs in sequence.
  chosen.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return chosen;
}

/* ===========================================================================
   6. Emit
   =========================================================================== */

function toneIndex(bucket: number, levels: number): 0 | 1 | 2 {
  const t = levels > 1 ? bucket / (levels - 1) : 0;
  if (t < TONE_STOPS[0]) return 0;
  if (t < TONE_STOPS[1]) return 1;
  return 2;
}

type Built = {
  art: AsciiArt;
  /** Per-cell bucket grids per frame, kept for the SVG + verification passes. */
  bucketFrames: Uint8Array[];
  glyphFrames: string[][];
};

function buildArt(opts: {
  palette: AsciiPalette;
  source: string;
  cols: number;
  rows: number;
  levels: number;
  rampAscending: string[];
  bucketFrames: Uint8Array[];
  seamRow: number;
  seam: SeamCell[];
  accents: [number, number][];
  fps: number;
}): Built {
  const {
    palette,
    source,
    cols,
    rows,
    levels,
    rampAscending,
    bucketFrames,
    seamRow,
    seam,
    accents,
    fps,
  } = opts;
  const maxB = levels - 1;

  // gold sits on black -> ramp ascends by ink coverage.
  // blue sits on cool white -> ramp descends by ink coverage.
  // Either way ramp[lum] is the correct glyph and the renderer never inverts.
  const ramp = palette === "gold" ? rampAscending.slice() : rampAscending.slice().reverse();

  const seamBand = SEAM_LUM_BAND[palette];

  // Frozen from frame 0 so the wordmark and the motif layer never breathe.
  const base = bucketFrames[0];
  const seamLumFrozen = new Map<number, number>();
  for (const { col } of seam) {
    const local = base[seamRow * cols + col] / maxB;
    const clamped = Math.min(seamBand[1], Math.max(seamBand[0], local));
    seamLumFrozen.set(col, Math.round(clamped * maxB));
  }
  const accentLumFrozen = new Map<string, number>();
  for (const [r, c] of accents) {
    accentLumFrozen.set(`${r}:${c}`, base[r * cols + c]);
  }
  const accentAt = new Map<string, string>();
  accents.forEach(([r, c], i) => {
    accentAt.set(`${r}:${c}`, ACCENT_GLYPHS[i % ACCENT_GLYPHS.length]);
  });

  const frames: AsciiFrame[] = [];
  const glyphFrames: string[][] = [];
  const bucketOut: Uint8Array[] = [];

  for (const raw of bucketFrames) {
    const buckets = Uint8Array.from(raw);
    const glyphs: string[] = new Array(cols * rows);

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const i = r * cols + c;
        glyphs[i] = ramp[buckets[i]];
      }
    }
    // Seam row. Two steps, and the order matters.
    //
    // 1. QUIET THE GUTTERS FIRST. Seven of the wordmark's letters (H O K U T E N)
    //    are themselves ramp members, so a letter sitting between two art glyphs
    //    is visually indistinguishable from the art — the eye cannot segment the
    //    word. The first generated pass proved it: "GROUP" read (G/R/P are not in
    //    the ramp) and "THE HOKUTEN" vanished. Blanking the padding cells and a
    //    two-cell margin gives each letterform its own counter-space, which is
    //    what makes the row legible at all. The band is one row of 64, so the art
    //    still carries the frame and the wordmark still emerges from it rather
    //    than being stamped over it.
    const quietBucket = Math.max(0, ramp.indexOf(QUIET_GLYPH));
    const seamCols = seam.map((s) => s.col);
    const quietFrom = Math.max(0, Math.min(...seamCols) - SEAM_QUIET_MARGIN);
    const quietTo = Math.min(cols - 1, Math.max(...seamCols) + SEAM_QUIET_MARGIN);
    const letterCols = new Set(seamCols);
    for (let c = quietFrom; c <= quietTo; c += 1) {
      if (letterCols.has(c)) continue;
      const i = seamRow * cols + c;
      glyphs[i] = QUIET_GLYPH;
      buckets[i] = quietBucket;
    }
    // 2. Letters are literal + frozen.
    for (const { col, ch } of seam) {
      const i = seamRow * cols + col;
      glyphs[i] = ch;
      buckets[i] = seamLumFrozen.get(col)!;
    }
    // Accent layer: frozen glyph, frozen luminance, blank continuation cell.
    for (const [r, c] of accents) {
      const i = r * cols + c;
      glyphs[i] = accentAt.get(`${r}:${c}`)!;
      buckets[i] = accentLumFrozen.get(`${r}:${c}`)!;
      const j = r * cols + c + 1;
      glyphs[j] = " ";
      buckets[j] = buckets[i];
    }

    const cellRows: string[] = [];
    const lumRows: string[] = [];
    for (let r = 0; r < rows; r += 1) {
      let cline = "";
      let lline = "";
      for (let c = 0; c < cols; c += 1) {
        const i = r * cols + c;
        cline += glyphs[i];
        lline += buckets[i].toString(36);
      }
      cellRows.push(cline);
      lumRows.push(lline);
    }
    frames.push({ cells: cellRows.join("\n"), lum: lumRows.join("\n") });
    glyphFrames.push(glyphs);
    bucketOut.push(buckets);
  }

  return {
    art: {
      version: 1,
      palette,
      source,
      cols,
      rows,
      charAspect: Number(CHAR_ASPECT.toFixed(4)),
      ramp,
      levels,
      seamRow,
      wide: accents,
      frames,
      fps,
    },
    bucketFrames: bucketOut,
    glyphFrames,
  };
}

/** Static SVG of frames[0] — the mobile / reduced-motion / noscript frame. */
function buildSvg(built: Built): string {
  const { art, bucketFrames, glyphFrames } = built;
  const { cols, rows, levels, palette } = art;
  const FS = 10; // SVG user units
  const ADV = FS * 0.6;
  const LINE = FS;
  const W = cols * ADV;
  const H = rows * LINE;
  const fb = SVG_FALLBACK[palette];

  const buckets = bucketFrames[0];
  const glyphs = glyphFrames[0];
  const wideSet = new Set(art.wide.map(([r, c]) => `${r}:${c}`));
  const contSet = new Set(art.wide.map(([r, c]) => `${r}:${c + 1}`));

  const parts: string[] = [];
  for (let r = 0; r < rows; r += 1) {
    const y = (r * LINE + LINE * 0.8).toFixed(1);
    for (let tone = 0; tone < 3; tone += 1) {
      let line = "";
      for (let c = 0; c < cols; c += 1) {
        const key = `${r}:${c}`;
        const i = r * cols + c;
        if (wideSet.has(key) || contSet.has(key)) {
          line += " ";
          continue;
        }
        line += toneIndex(buckets[i], levels) === tone ? glyphs[i] : " ";
      }
      const first = line.search(/\S/);
      if (first < 0) continue;
      const last = line.replace(/\s+$/, "").length - 1;
      const slice = line.slice(first, last + 1);
      parts.push(
        `<text class="g t${tone}" x="${(first * ADV).toFixed(1)}" y="${y}" textLength="${((last - first + 1) * ADV).toFixed(1)}" lengthAdjust="spacing" xml:space="preserve">${xmlEscape(slice)}</text>`,
      );
    }
  }
  // Double-width accents: their own nodes, forced to exactly two cells.
  for (const [r, c] of art.wide) {
    const i = r * cols + c;
    const tone = toneIndex(buckets[i], levels);
    const y = (r * LINE + LINE * 0.8).toFixed(1);
    parts.push(
      `<text class="w t${tone}" x="${(c * ADV).toFixed(1)}" y="${y}" textLength="${(2 * ADV).toFixed(1)}" lengthAdjust="spacingAndGlyphs" xml:space="preserve">${xmlEscape(glyphs[i])}</text>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" preserveAspectRatio="xMidYMid meet">
<title>THE HOKUTEN GROUP — character-grid hotel study (${palette})</title>
<desc>A photograph of a Hokuten Group hotel closing rendered as a grid of HOKUTEN letters, digits and 北天 accent marks. One line resolves into the words THE HOKUTEN GROUP.</desc>
<style>
/* CSS custom properties resolve from the host document when this file is
   inlined; the literal fallbacks make it correct as a standalone &lt;img&gt;. */
.g,.w{font-size:${FS}px;white-space:pre}
.g{font-family:var(--font-mono,"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace)}
.w{font-family:var(--font-mono,"IBM Plex Mono",ui-monospace),"Hiragino Sans","Noto Sans JP","Yu Gothic",sans-serif}
.t0{fill:var(--art-ink,${fb.ink})}
.t1{fill:var(--art-mid,${fb.mid})}
.t2{fill:var(--art-light,${fb.light})}
</style>
<rect width="${W}" height="${H}" fill="var(--art-ground,${fb.ground})"/>
${parts.join("\n")}
</svg>
`;
}

/* ===========================================================================
   7. Verify
   =========================================================================== */

function verify(art: AsciiArt, seam: SeamCell[], label: string): string[] {
  const notes: string[] = [];
  const fail = (m: string) => {
    throw new Error(`[${label}] ${m}`);
  };

  if (art.levels !== art.ramp.length) fail("levels !== ramp.length");
  if (art.levels > 36) fail("levels > 36 — a base-36 digit cannot address the bucket");
  if (art.seamRow < Math.floor((art.rows * 2) / 3)) fail("seamRow is not in the lower third");
  if (art.seamRow < art.rows * HEADLINE_SAFE.rowMax) {
    fail("seamRow collides with the headline safe region");
  }
  if (art.charAspect <= 1) fail("charAspect must be cellHeight/cellWidth > 1 for a mono cell");

  art.frames.forEach((f, fi) => {
    if (f.cells.length !== f.lum.length) fail(`frame ${fi}: cells.length !== lum.length`);
    const cr = f.cells.split("\n");
    const lr = f.lum.split("\n");
    if (cr.length !== art.rows) fail(`frame ${fi}: ${cr.length} rows, expected ${art.rows}`);
    if (lr.length !== art.rows) fail(`frame ${fi}: lum has ${lr.length} rows`);
    for (let r = 0; r < art.rows; r += 1) {
      if ([...cr[r]].length !== art.cols) fail(`frame ${fi} row ${r}: ${[...cr[r]].length} glyphs`);
      if (lr[r].length !== art.cols) fail(`frame ${fi} row ${r}: lum width ${lr[r].length}`);
    }
    // Seam row reads correctly in EVERY frame.
    const seamLine = cr[art.seamRow];
    const read = seam.map((s) => seamLine[s.col]).join("");
    if (read !== SEAM_TEXT.replace(/ /g, "")) {
      fail(`frame ${fi}: seam row reads "${read}", expected "${SEAM_TEXT.replace(/ /g, "")}"`);
    }
    // Accent continuation cells are blank, and accents are never in the seam row.
    for (const [r, c] of art.wide) {
      if (r === art.seamRow) fail(`frame ${fi}: accent at the seam row`);
      if (cr[r][c + 1] !== " ") fail(`frame ${fi}: continuation cell at ${r},${c + 1} is not blank`);
      if (ACCENT_GLYPHS.indexOf(cr[r][c]) < 0) fail(`frame ${fi}: accent cell at ${r},${c} is not CJK`);
    }
    // The invariant: cells[i] === ramp[lum[i]] everywhere except the documented exceptions.
    const seamCols = new Set(seam.map((s) => s.col));
    const wideKeys = new Set(art.wide.flatMap(([r, c]) => [`${r}:${c}`, `${r}:${c + 1}`]));
    let broken = 0;
    for (let r = 0; r < art.rows; r += 1) {
      for (let c = 0; c < art.cols; c += 1) {
        if (r === art.seamRow && seamCols.has(c)) continue;
        if (wideKeys.has(`${r}:${c}`)) continue;
        if (cr[r][c] !== art.ramp[parseInt(lr[r][c], 36)]) broken += 1;
      }
    }
    if (broken > 0) fail(`frame ${fi}: ${broken} cells break cells[i] === ramp[lum[i]]`);
  });

  // Ambient loop churn — how much of the grid actually changes per frame step.
  let churn = 0;
  for (let i = 1; i < art.frames.length; i += 1) {
    const a = art.frames[i - 1].cells;
    const b = art.frames[i].cells;
    let d = 0;
    for (let k = 0; k < a.length; k += 1) if (a[k] !== b[k]) d += 1;
    churn += d / (art.cols * art.rows);
  }
  notes.push(`mean per-frame cell churn ${((churn / (art.frames.length - 1)) * 100).toFixed(1)}%`);
  return notes;
}

/* ===========================================================================
   8. Main
   =========================================================================== */

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = process.cwd();
  if (!existsSync(path.join(root, "public"))) {
    throw new Error("run this from site/ — public/ was not found in " + root);
  }
  const inputPath = path.resolve(root, args.in);
  if (!existsSync(inputPath)) throw new Error(`source photo not found: ${inputPath}`);

  const meta = await sharp(inputPath).metadata();
  const rotated = (meta.orientation ?? 1) >= 5;
  const imgW = rotated ? meta.height! : meta.width!;
  const imgH = rotated ? meta.width! : meta.height!;

  const cols = args.cols;
  const rows = Math.round((imgH / imgW) * cols / CHAR_ASPECT);

  console.log(`source      ${args.in}  ${imgW}x${imgH}`);
  console.log(`grid        ${cols} x ${rows} cells   charAspect ${CHAR_ASPECT.toFixed(4)}`);
  console.log(
    `loop        ${args.frames} frames @ ${args.fps}fps = ${(args.frames / args.fps).toFixed(1)}s`,
  );

  // --- ramp -----------------------------------------------------------------
  const coverage = await buildCoverageTable();
  const rampAscending = coverage.map((c) => c.ch);
  const levels = rampAscending.length;
  console.log("\nmeasured ink coverage (fraction of a 0.6em x 1.0em cell), ascending:");
  console.log(
    coverage
      .map((c) => `${c.ch === " " ? "␠" : c.ch}=${c.coverage.toFixed(4)}`)
      .join("  "),
  );
  console.log(`ramp        ${levels} levels`);

  // --- luminance + frames ---------------------------------------------------
  const field = await loadField(inputPath, cols, rows);
  const bucketFrames: Uint8Array[] = [];
  for (let f = 0; f < args.frames; f += 1) {
    const phase = (TAU * f) / args.frames;
    bucketFrames.push(ditherToBuckets(buildGridField(field, cols, rows, phase), cols, rows, levels));
  }
  // Seamlessness proof: phase 2π must reproduce frame 0 exactly.
  const wrap = ditherToBuckets(buildGridField(field, cols, rows, TAU), cols, rows, levels);
  for (let i = 0; i < wrap.length; i += 1) {
    if (wrap[i] !== bucketFrames[0][i]) {
      throw new Error(`loop is not seamless: cell ${i} differs at phase 2π`);
    }
  }
  console.log("loop        seamless (phase 2π === frame 0, verified cell-by-cell)");

  // --- seam + accents -------------------------------------------------------
  const seamRow = Math.round(rows * SEAM_ROW_FRACTION);
  const seam = layoutSeam(cols);
  const seamCols = new Set(seam.map((s) => s.col));
  const accents = placeAccents(bucketFrames[0], cols, rows, levels, seamRow, seamCols, args.seed);
  console.log(
    `seam        row ${seamRow}/${rows} (${((seamRow / rows) * 100).toFixed(0)}% down), cols ${seam[0].col}-${seam[seam.length - 1].col}`,
  );
  console.log(
    `accents     ${accents.length} double-width at ${accents.map(([r, c]) => `${r},${c}`).join(" ")}`,
  );
  if (accents.length < ACCENT_GLYPHS.length) {
    console.warn(
      `WARNING: only ${accents.length}/${ACCENT_GLYPHS.length} accent slots satisfied the spacing + luminance constraints`,
    );
  }

  // --- emit -----------------------------------------------------------------
  const outDir = path.join(root, "public", "art");
  await mkdir(outDir, { recursive: true });
  const palettes: AsciiPalette[] =
    args.palette === "both" ? ["gold", "blue"] : [args.palette as AsciiPalette];

  let totalJson = 0;
  let totalGz = 0;
  const report: string[] = [];

  for (const palette of palettes) {
    const built = buildArt({
      palette,
      source: args.in,
      cols,
      rows,
      levels,
      rampAscending,
      bucketFrames,
      seamRow,
      seam,
      accents,
      fps: args.fps,
    });

    const jsonPath = path.join(outDir, `${args.out}-${palette}.json`);
    const svgPath = path.join(outDir, `${args.out}-${palette}.svg`);
    const json = JSON.stringify(built.art);
    const svg = buildSvg(built);
    await writeFile(jsonPath, json, "utf8");
    await writeFile(svgPath, svg, "utf8");

    // Verify what actually landed on disk.
    const reparsed = JSON.parse(json) as AsciiArt;
    const notes = verify(reparsed, seam, palette);

    const jb = Buffer.byteLength(json, "utf8");
    const gz = gzipSync(Buffer.from(json, "utf8")).length;
    const sb = Buffer.byteLength(svg, "utf8");
    totalJson += jb;
    totalGz += gz;
    report.push(
      `${palette.padEnd(5)} json ${(jb / 1024).toFixed(1)}KB (gzip ${(gz / 1024).toFixed(1)}KB)   svg ${(sb / 1024).toFixed(1)}KB   ramp[0]="${reparsed.ramp[0] === " " ? "␠" : reparsed.ramp[0]}" ramp[last]="${reparsed.ramp[levels - 1]}"   ${notes.join(", ")}`,
    );
  }

  console.log("\n--- output ---");
  report.forEach((r) => console.log(r));
  console.log(
    `TOTAL json  ${(totalJson / 1024).toFixed(1)}KB raw / ${(totalGz / 1024).toFixed(1)}KB gzip   budget ${(BUDGET_BYTES / 1024).toFixed(0)}KB`,
  );
  if (totalJson > BUDGET_BYTES) {
    throw new Error(
      `OVER BUDGET by ${((totalJson - BUDGET_BYTES) / 1024).toFixed(1)}KB — drop --frames before dropping --cols (ref 05)`,
    );
  }
  console.log(`headroom    ${((BUDGET_BYTES - totalJson) / 1024).toFixed(1)}KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
