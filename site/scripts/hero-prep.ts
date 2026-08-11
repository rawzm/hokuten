/**
 * hero-prep — the hero slideshow's master-intake + responsive derivative pipeline.
 *
 *   run from site/:  npx tsx scripts/hero-prep.ts
 *
 * DESIGN-REVISIT-2.md §4.1 (spec) + D21 (Ref/ is never a runtime source; a repeatable
 * script + typed manifest is the only way art moves from Ref/ into site/public/) +
 * DESIGN-REVISIT-3.md D23 (2026-08-10 — Razim's real hero triplets, this file's
 * current SLIDE_SLOTS data edit, replacing the interim 「北天」 crops used before).
 *
 * ── What this script does, in priority order ────────────────────────────────
 * For each configured slide slot (SLIDE_SLOTS below) and each of its three display
 * breakpoints (desktop 4:1 · tablet 16:7 · mobile 4:3), independently:
 *
 *   1. PREFERRED — look for a real, complete `Ref/hero/NN-id.<breakpoint>.<ext>`
 *      file (jpg/jpeg/png/tif/tiff), exactly the naming §4.1 specifies. If present,
 *      use it. This is real, art-directed photography for that exact breakpoint.
 *   2. FALLBACK — if that specific breakpoint's file is missing, crop it from the
 *      slot's `interim` master in `Ref/artwork/` (an already-approved 「北天」
 *      glyph-mosaic piece) instead. THIS NEVER SILENTLY CHANGES WHICH breakpoint
 *      used which source: the per-breakpoint choice is recorded in the manifest
 *      (`source: "triplet" | "interim-artwork"`) and in `content/heroSlides.ts`.
 *
 * Resolution is PER BREAKPOINT, not per slide — per D21 "a missing breakpoint uses
 * the documented fallback and never silently changes the crop." If Razim drops a
 * desktop-only file for a slide, the desktop breakpoint goes real immediately and
 * tablet/mobile keep using the interim crop, with no code change required.
 *
 * ── D23 (DESIGN-REVISIT-3.md, Razim, 2026-08-10 evening) — real triplets landed ──
 * Razim delivered all nine `Ref/hero/` files today, correctly named, exact display
 * ratios per the table in `Ref/hero/README.md` / DESIGN-REVISIT-3.md §D23:
 * `01-marriott`, `02-luxury`, `03-resort`, each with a `.desktop`/`.tablet`/
 * `.mobile` file. Every breakpoint of every slide below now resolves via the
 * PREFERRED path (`source: "triplet"`) — the interim-artwork FALLBACK path is not
 * exercised by a normal run of this script today at all.
 *
 * `SLIDE_SLOTS[].interim` is still populated below (the `SlideSlot` type requires
 * it, and D21's per-breakpoint-independent-resolution contract means a future
 * partial re-delivery — e.g. one corrupted file replaced later — should not have
 * to wait on a script edit to keep working): each slot's `interim` points at the
 * same 「北天」 `Ref/artwork/` master its predecessor interim-era slide used, kept
 * ONLY as a dead-code safety net. If a fresh `_manifest.json` ever reports
 * `source: "interim-artwork"` for any of these three slides, that means the
 * matching `Ref/hero/` file went missing — not a normal state today.
 *
 * The delivered files are real photography with the site's own 「北天」
 * glyph-mosaic treatment already baked in by Razim before hand-off. This script
 * does not apply, verify, or care about that treatment — it only crops/resizes/
 * encodes whatever pixels it is handed, exactly as it did for the pure-glyph
 * interim masters before them. Component-facing `alt` text (this file's
 * `SLIDE_SLOTS[].alt` and the authoritative copy in `content/heroSlides.ts`)
 * describes the photographed SCENE (the hotel, the setting, the time of day) —
 * never the treatment, per the alt-text law both files' headers restate.
 *
 * ── Below spec, knowingly ──────────────────────────────────────────────────────
 * All nine masters sit below the §4.1 IDEAL canvas for their ratio (1536–1672px
 * wide vs the 3200/2048/1600 ideals) — modestly soft above roughly the source's
 * own native width once served past it. Some (not all) breakpoints clear the
 * §4.1 MINIMUM; some don't, and it varies per slide because the three masters'
 * native widths differ (1536px for `01-marriott` vs 1672px for `02-luxury`/
 * `03-resort`). Razim shipped this knowingly (DESIGN-REVISIT-3.md §D23: "never
 * upscale... they will be modestly soft above ~1672px viewport width"). The
 * authoritative per-breakpoint numbers are this run's own console warnings and
 * `_manifest.json`'s `belowSpecMinimum`/`belowSpecIdeal` flags — deliberately not
 * restated as hardcoded numbers here, so this header can't drift stale the next
 * time the masters change.
 *
 * ── Slide order / LCP / theme eligibility ───────────────────────────────────────
 * Slide 1 (`01-marriott`) is the LCP image in both themes (D23). All three ship
 * `theme: "both"` — Razim: "use that in both theme sites."
 *
 * ── Crop strategy ─────────────────────────────────────────────────────────────
 * Real `Ref/hero/` triplets are trusted as already art-directed per breakpoint
 * (see the resolver logic below: `cropMode = "centre"` for a discovered triplet
 * file is a centre-cover safety net that guarantees the exact declared ratio, not
 * a second creative crop on top of Razim's own). No manual focal overrides apply
 * to any of the three current slides — every breakpoint's source file is already
 * the correct aspect-ready crop.
 *
 * ── Never upscale ─────────────────────────────────────────────────────────────
 * Same rule and same `maxWidthForAspect` mechanism as `artwork-prep.ts`: a
 * requested width above what the crop window can supply (without upscaling) is
 * skipped and logged, never silently swapped for a softer crop.
 *
 * ── Encoding ───────────────────────────────────────────────────────────────────
 * AVIF effort is 4, not 9 — `artwork-prep.ts` measured effort 9 at ~10x the cost
 * for a low-single-digit-percent size gain on this same class of source (the
 * repeated 「北天」 glyph is high-frequency content). Matched here verbatim.
 * The D23 real triplets still carry that same baked-in glyph-mosaic treatment
 * (see this file's header), so AVIF and JPEG stay at
 * `chromaSubsampling: '4:4:4'` and WebP at `smartSubsample: true` for the same
 * reason as the interim-era masters: 4:2:0 visibly mushes the repeated kanji
 * glyph texture. One encoder path serves both source classes without a
 * source-type branch.
 *
 * Budgets (§4.1): slide 1 (order 1) ~350KB AVIF at its single largest served
 * pixel width across all three breakpoints; every other image ~250KB. JPEG is
 * emitted only at each breakpoint's own largest surviving width (universal
 * `<picture>` fallback), matching `artwork-prep.ts`'s established convention —
 * not at every intermediate width.
 *
 * MEASURED RESULT (2026-08-10 D23 run, real triplets): AVIF landed inside
 * budget on every single one of the 27 generated AVIF outputs across all
 * three slides — slide 1's largest-overall (desktop-1440, the only file that
 * gets the 350KB slide-1 allowance) is 159KB, and the busiest default-budget
 * tier (mobile-1200, order 1) is 248KB against 250KB, the closest any AVIF
 * came to its ceiling. WebP and, on two tiers, JPEG could NOT reach the
 * 250KB default budget at floor quality on the busiest largest-width outputs
 * — 6 WebP + 2 JPEG instances landed over budget (see this run's own console
 * output / `_manifest.json` `overBudget` flags for the authoritative list;
 * not restated here as a fixed count so this header can't drift stale next
 * run). Same root cause `artwork-prep.ts` documents for this source class:
 * VP8/baseline-JPEG handle the repeated-glyph high-frequency texture worse
 * per byte than AV1. `<picture>` lists AVIF first, so this is a real but
 * low-severity, already-understood gap — do not chase it by lowering
 * `WEBP_FLOOR_Q`/`JPG_FLOOR_Q` further.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

type SharpPipeline = ReturnType<typeof sharp>;

/* ============================================================================
   1. Breakpoints — the three display ratios, exact per §4.1
   ============================================================================ */

type Breakpoint = "desktop" | "tablet" | "mobile";
const BREAKPOINTS: Breakpoint[] = ["desktop", "tablet", "mobile"];

const ASPECT: Record<Breakpoint, number> = {
  desktop: 3200 / 800, // 4:1
  tablet: 2048 / 896, // 16:7
  mobile: 1600 / 1200, // 4:3
};

const IDEAL: Record<Breakpoint, { w: number; h: number }> = {
  desktop: { w: 3200, h: 800 },
  tablet: { w: 2048, h: 896 },
  mobile: { w: 1600, h: 1200 },
};

const MINIMUM: Record<Breakpoint, { w: number; h: number }> = {
  desktop: { w: 2400, h: 600 },
  tablet: { w: 1600, h: 700 },
  mobile: { w: 1200, h: 900 },
};

/** Sensible intermediate widths per breakpoint. Deliberately INCLUDES each
 *  breakpoint's own §4.1 minimum and ideal width as explicit checkpoints, so a
 *  crop that can't reach spec produces a clear, named skip warning rather than
 *  quietly never being asked for that size. */
const REQUEST_WIDTHS: Record<Breakpoint, number[]> = {
  desktop: [640, 1024, 1440, 1920, 2400, 3200],
  tablet: [768, 1024, 1600, 2048],
  mobile: [480, 750, 1050, 1200, 1600],
};

/* ============================================================================
   2. Crop geometry — identical mechanism to artwork-prep.ts
   ============================================================================ */

type CropMode = "centre" | "attention" | { fx: number; fy: number };

function maxWidthForAspect(srcW: number, srcH: number, aspect: number): number {
  if (srcW / srcH > aspect) return Math.floor(srcH * aspect);
  return srcW;
}

function manualCropRect(
  srcW: number,
  srcH: number,
  aspect: number,
  fx: number,
  fy: number,
): { left: number; top: number; width: number; height: number } {
  let cropW: number;
  let cropH: number;
  if (srcW / srcH > aspect) {
    cropH = srcH;
    cropW = Math.floor(srcH * aspect);
  } else {
    cropW = srcW;
    cropH = Math.floor(srcW / aspect);
  }
  let left = Math.round(fx * srcW - cropW / 2);
  let top = Math.round(fy * srcH - cropH / 2);
  left = Math.min(Math.max(left, 0), srcW - cropW);
  top = Math.min(Math.max(top, 0), srcH - cropH);
  return { left, top, width: cropW, height: cropH };
}

function describeCrop(mode: CropMode): string {
  if (mode === "centre" || mode === "attention") return mode;
  return `manual(fx=${mode.fx.toFixed(2)},fy=${mode.fy.toFixed(2)})`;
}

function buildResized(
  srcPath: string,
  srcW: number,
  srcH: number,
  aspect: number,
  mode: CropMode,
  targetW: number,
  targetH: number,
): SharpPipeline {
  const base = sharp(srcPath).flatten({ background: { r: 255, g: 255, b: 255 } });
  if (mode === "centre") {
    return base.resize(targetW, targetH, { fit: "cover", position: "centre" });
  }
  if (mode === "attention") {
    return base.resize(targetW, targetH, { fit: "cover", position: sharp.strategy.attention });
  }
  const rect = manualCropRect(srcW, srcH, aspect, mode.fx, mode.fy);
  return base.extract(rect).resize(targetW, targetH, { fit: "fill" });
}

/* ============================================================================
   3. Slide slots — the ONE place a new slide or a real triplet gets registered
   ============================================================================ */

interface InterimSource {
  /** Filename as delivered in Ref/artwork/ (read-only master). */
  masterFile: string;
  masterSubject: string;
  crop: Record<Breakpoint, CropMode>;
  /** Small object-position hints for the SERVED image, recorded into
   *  content/heroSlides.ts alongside the crop — independent of the crop math
   *  above (that already produces a pixel-exact ratio); this is a belt-and-
   *  braces nudge for a consuming component that renders the image slightly
   *  off-ratio (e.g. a fluid intermediate viewport). Fractions of the SERVED
   *  (already-cropped) image, 0..1. Omit for a plain centre bias. */
  focalPoint?: Partial<Record<Breakpoint, { x: number; y: number }>>;
}

interface SlideSlot {
  /** Stable kebab id. Also the expected Ref/hero/NN-id.* prefix (NN = order,
   *  zero-padded) for the preferred real-triplet source. */
  id: string;
  order: number;
  theme: "gold" | "blue" | "both";
  /** Describes the SCENE, never the glyph-mosaic treatment (alt-text law). */
  alt: string;
  interim: InterimSource;
}

/**
 * THE SLOT REGISTRY. Adding a fourth/fifth slide (D11 supports up to 5) is a
 * one-entry addition here — never a script refactor. Landing a real Ref/hero
 * triplet for an EXISTING slide requires NO edit here at all: just drop the
 * three files with the exact `Ref/hero/${pad(order)}-${id}.<bp>.<ext>` names
 * and re-run the script; the interim block below simply stops being used for
 * whichever breakpoints now have a real file.
 *
 * D23 (2026-08-10): all three slots below now have a complete real
 * `Ref/hero/` triplet, so every `interim` block is dead code today — a
 * type-required safety net only (see this file's header). `alt` describes
 * the photographed SCENE, written by looking at every one of the nine
 * delivered files (desktop/tablet/mobile, all three slides) with the Read
 * tool, never the 「北天」 glyph-mosaic treatment baked into them.
 */
const SLIDE_SLOTS: SlideSlot[] = [
  {
    id: "marriott",
    order: 1,
    theme: "both",
    alt: 'A Marriott hotel tower seen from below at a corner angle, its cream façade and rows of guestroom windows rising into a clear blue midday sky, palm trees at the edge of frame and the Marriott "M" logo and signage near the roofline.',
    interim: {
      // Dead-code safety net (see file header) — the old beachfront-aerial
      // interim slide this slot succeeds, kept only so the type is satisfied
      // if a future partial re-delivery ever leaves a breakpoint unresolved.
      masterFile: "ChatGPT Image Aug 8, 2026, 03_25_21 PM.png",
      masterSubject: "Beachfront aerial, ocean, beach, white towers (unused fallback)",
      crop: { desktop: "centre", tablet: "centre", mobile: "centre" },
    },
  },
  {
    id: "luxury",
    order: 2,
    theme: "both",
    alt: "A grand resort's palm-lined arrival court at dusk, twin colonnaded wings with green domed roofs flanking a paved promenade toward a lit entrance, warm illuminated windows against a soft sunset sky.",
    interim: {
      // Dead-code safety net — the old full-service-sunset interim slide.
      masterFile: "ChatGPT Image Aug 8, 2026, 03_22_12 PM.png",
      masterSubject: "Full-service block at sunset (unused fallback)",
      crop: { desktop: "centre", tablet: "centre", mobile: "centre" },
    },
  },
  {
    id: "resort",
    order: 3,
    theme: "both",
    alt: "A resort's lagoon-style pool deck at midday, palm trees and shaded loungers along the water's edge, swimmers in the pool, and a curved oceanfront hotel tower rising behind the palms under a clear blue sky.",
    interim: {
      // Dead-code safety net — the old grand-resort-arrival interim slide.
      masterFile: "ChatGPT Image Aug 8, 2026, 03_27_00 PM.png",
      masterSubject: "Grand resort arrival court at sunset (unused fallback)",
      crop: { desktop: "centre", tablet: "centre", mobile: "centre" },
    },
  },
];

/* ============================================================================
   4. Encoding budgets
   ============================================================================ */

const BUDGET_SLIDE1_LARGEST_AVIF = 350 * 1024;
const BUDGET_DEFAULT = 250 * 1024;

const AVIF_START_Q = 62;
const AVIF_FLOOR_Q = 32;
const AVIF_STEP = 6;

const WEBP_START_Q = 78;
const WEBP_FLOOR_Q = 34;
const WEBP_STEP = 8;

const JPG_START_Q = 82;
const JPG_FLOOR_Q = 38;
const JPG_STEP = 8;

interface Encoded {
  buf: Buffer;
  quality: number;
  overBudget: boolean;
}

async function encodeAvif(pipeline: SharpPipeline, budget: number): Promise<Encoded> {
  let q = AVIF_START_Q;
  let buf = await pipeline.clone().avif({ quality: q, effort: 4, chromaSubsampling: "4:4:4" }).toBuffer();
  while (buf.length > budget && q > AVIF_FLOOR_Q) {
    q = Math.max(AVIF_FLOOR_Q, q - AVIF_STEP);
    buf = await pipeline.clone().avif({ quality: q, effort: 4, chromaSubsampling: "4:4:4" }).toBuffer();
    if (q === AVIF_FLOOR_Q) break;
  }
  return { buf, quality: q, overBudget: buf.length > budget };
}

async function encodeWebp(pipeline: SharpPipeline, budget: number): Promise<Encoded> {
  let q = WEBP_START_Q;
  let buf = await pipeline.clone().webp({ quality: q, effort: 4, smartSubsample: true }).toBuffer();
  while (buf.length > budget && q > WEBP_FLOOR_Q) {
    q = Math.max(WEBP_FLOOR_Q, q - WEBP_STEP);
    buf = await pipeline.clone().webp({ quality: q, effort: 4, smartSubsample: true }).toBuffer();
    if (q === WEBP_FLOOR_Q) break;
  }
  return { buf, quality: q, overBudget: buf.length > budget };
}

async function encodeJpg(pipeline: SharpPipeline, budget: number): Promise<Encoded> {
  let q = JPG_START_Q;
  let buf = await pipeline.clone().jpeg({ quality: q, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer();
  while (buf.length > budget && q > JPG_FLOOR_Q) {
    q = Math.max(JPG_FLOOR_Q, q - JPG_STEP);
    buf = await pipeline.clone().jpeg({ quality: q, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer();
    if (q === JPG_FLOOR_Q) break;
  }
  return { buf, quality: q, overBudget: buf.length > budget };
}

/* ============================================================================
   5. Directory resolution + Ref/hero triplet discovery
   ============================================================================ */

function resolveDirs(): { siteRoot: string; refHeroDir: string; refArtworkDir: string; outDir: string } {
  const siteRoot = process.cwd();
  if (!fs.existsSync(path.join(siteRoot, "package.json")) || !fs.existsSync(path.join(siteRoot, "app", "globals.css"))) {
    throw new Error(`run this from site/ — cwd is ${siteRoot}`);
  }
  const repoRoot = path.resolve(siteRoot, "..");
  const refHeroDir = path.join(repoRoot, "Ref", "hero");
  const refArtworkDir = path.join(repoRoot, "Ref", "artwork");
  if (!fs.existsSync(refArtworkDir)) {
    throw new Error(`missing masters directory: ${refArtworkDir}`);
  }
  const outDir = path.join(siteRoot, "public", "hero");
  return { siteRoot, refHeroDir, refArtworkDir, outDir };
}

type DiscoveredTriplet = Partial<Record<Breakpoint, string>>;

const TRIPLET_RE = /^(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.(desktop|tablet|mobile)\.(jpe?g|png|tiff?|)$/i;

/** Scans Ref/hero/ for `NN-id.<breakpoint>.<ext>` files per §4.1. Missing
 *  directory is not an error — it means nothing has been delivered yet. */
function discoverRefHeroTriplets(refHeroDir: string): { triplets: Map<string, DiscoveredTriplet>; unmatched: string[] } {
  const triplets = new Map<string, DiscoveredTriplet>();
  const unmatched: string[] = [];
  if (!fs.existsSync(refHeroDir)) return { triplets, unmatched };
  for (const file of fs.readdirSync(refHeroDir)) {
    if (file.startsWith(".")) continue;
    const m = file.match(TRIPLET_RE);
    if (!m) {
      unmatched.push(file);
      continue;
    }
    const [, order, name, bpRaw] = m;
    const key = `${order}-${name.toLowerCase()}`;
    const bp = bpRaw.toLowerCase() as Breakpoint;
    const entry = triplets.get(key) ?? {};
    entry[bp] = path.join(refHeroDir, file);
    triplets.set(key, entry);
  }
  return { triplets, unmatched };
}

/* ============================================================================
   6. Manifest types
   ============================================================================ */

type SourceKind = "triplet" | "interim-artwork";

interface FileEntry {
  slideId: string;
  breakpoint: Breakpoint;
  width: number;
  height: number;
  format: "avif" | "webp" | "jpg";
  path: string; // repo-relative, e.g. public/hero/marriott-desktop-1440.avif
  bytes: number;
  quality: number;
  budgetKB: number;
  overBudget: boolean;
}

interface BreakpointReport {
  breakpoint: Breakpoint;
  source: SourceKind;
  sourceDescription: string;
  cropMode: string;
  requestedWidths: number[];
  generatedWidths: number[];
  skippedWidths: { width: number; shortfallPx: number }[];
  maxWidthForCrop: number;
  belowSpecMinimum: boolean;
  belowSpecIdeal: boolean;
}

interface SlideReport {
  id: string;
  order: number;
  theme: string;
  isInterim: boolean;
  status: "approved" | "blocked: missing-crop";
  breakpoints: BreakpointReport[];
}

/* ============================================================================
   7. Contact sheet
   ============================================================================ */

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function buildContactSheet(
  outPath: string,
  items: { label: string; srcPath: string; srcW: number; srcH: number; aspect: number; cropMode: CropMode; source: SourceKind }[],
): Promise<void> {
  const COLS = 3;
  const CELL_W = 340;
  const PAD = 24;
  const LABEL_H = 56;
  const TITLE_H = 60;

  const thumbs = await Promise.all(
    items.map(async (it) => {
      const h = Math.round(CELL_W / it.aspect);
      const pipeline = buildResized(it.srcPath, it.srcW, it.srcH, it.aspect, it.cropMode, CELL_W, h);
      const buf = await pipeline.png().toBuffer();
      return { ...it, w: CELL_W, h, buf };
    }),
  );

  const rows: (typeof thumbs)[] = [];
  for (let i = 0; i < thumbs.length; i += COLS) rows.push(thumbs.slice(i, i + COLS));

  let y = TITLE_H + PAD;
  const placed: { it: (typeof thumbs)[number]; x: number; y: number }[] = [];
  for (const row of rows) {
    const rowH = Math.max(...row.map((it) => it.h));
    row.forEach((it, ci) => {
      const x = PAD + ci * (CELL_W + PAD);
      placed.push({ it, x, y: y + (rowH - it.h) });
    });
    y += rowH + LABEL_H + PAD;
  }

  const sheetW = PAD + COLS * (CELL_W + PAD);
  const sheetH = y + PAD;

  let images = "";
  let labels = "";
  for (const p of placed) {
    const b64 = p.it.buf.toString("base64");
    images += `<image x="${p.x}" y="${p.y}" width="${p.it.w}" height="${p.it.h}" href="data:image/png;base64,${b64}" preserveAspectRatio="none"/>`;
    const ly = p.y + p.it.h + 20;
    labels += `<text x="${p.x}" y="${ly}" font-family="monospace" font-size="13" font-weight="bold" fill="#1a1a1a">${escapeXml(p.it.label)}</text>`;
    labels += `<text x="${p.x}" y="${ly + 17}" font-family="monospace" font-size="11" fill="#5a5a5a">${p.it.source} · crop=${escapeXml(describeCrop(p.it.cropMode))}</text>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}">
    <rect width="100%" height="100%" fill="#f4f1ea"/>
    <text x="${PAD}" y="36" font-family="monospace" font-size="20" font-weight="bold" fill="#1a1a1a">HOKUTEN hero slideshow — contact sheet</text>
    ${images}
    ${labels}
  </svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(outPath);
}

/* ============================================================================
   8. Main
   ============================================================================ */

async function main(): Promise<void> {
  const { siteRoot, refHeroDir, refArtworkDir, outDir } = resolveDirs();
  fs.mkdirSync(outDir, { recursive: true });

  const { triplets, unmatched } = discoverRefHeroTriplets(refHeroDir);
  const warnings: string[] = [];

  if (!fs.existsSync(refHeroDir)) {
    warnings.push(`Ref/hero/ does not exist — every slide uses its interim-artwork fallback. This is expected today (2026-08-10); create the folder and drop NN-id.<breakpoint>.<ext> triplets to go real.`);
    console.log(`  ! ${warnings[warnings.length - 1]}`);
  } else if (triplets.size === 0) {
    warnings.push(`Ref/hero/ exists but contains no matching NN-id.<breakpoint>.<ext> files — every slide uses its interim-artwork fallback.`);
    console.log(`  ! ${warnings[warnings.length - 1]}`);
  }
  for (const u of unmatched) {
    warnings.push(`Ref/hero/${u} does not match the NN-descriptive-name.<breakpoint>.<ext> naming convention (§4.1) — ignored (D21: unmanifested files are ignored).`);
    console.log(`  ! ${warnings[warnings.length - 1]}`);
  }

  // Cache sharp metadata reads by absolute path (interim masters are reused
  // across all three breakpoints of a slide).
  const metaCache = new Map<string, { width: number; height: number }>();
  async function readMeta(p: string): Promise<{ width: number; height: number }> {
    const cached = metaCache.get(p);
    if (cached) return cached;
    const meta = await sharp(p).metadata();
    if (!meta.width || !meta.height) throw new Error(`unreadable dimensions: ${p}`);
    const out = { width: meta.width, height: meta.height };
    metaCache.set(p, out);
    return out;
  }

  const files: FileEntry[] = [];
  const slideReports: SlideReport[] = [];
  const contactItems: { label: string; srcPath: string; srcW: number; srcH: number; aspect: number; cropMode: CropMode; source: SourceKind }[] = [];

  for (const slot of SLIDE_SLOTS) {
    const tripletKey = `${String(slot.order).padStart(2, "0")}-${slot.id}`;
    const discovered = triplets.get(tripletKey);

    console.log(`\n=== slide ${slot.order} — ${slot.id} (theme: ${slot.theme}) ===`);

    const breakpointReports: BreakpointReport[] = [];
    let slideHasUsableBreakpoint = false;

    // First pass: resolve source + max width per breakpoint, so the largest
    // width across the WHOLE slide is known before any budgeted encode runs.
    const resolved: {
      bp: Breakpoint;
      srcPath: string;
      srcW: number;
      srcH: number;
      cropMode: CropMode;
      source: SourceKind;
      sourceDescription: string;
      maxW: number;
      generated: number[];
      skipped: { width: number; shortfallPx: number }[];
    }[] = [];

    for (const bp of BREAKPOINTS) {
      const aspect = ASPECT[bp];
      let srcPath: string;
      let source: SourceKind;
      let sourceDescription: string;
      let cropMode: CropMode;

      const realFile = discovered?.[bp];
      if (realFile) {
        srcPath = realFile;
        source = "triplet";
        sourceDescription = `Ref/hero/${path.basename(realFile)}`;
        cropMode = "centre"; // trust the already-art-directed real crop; centre-cover guarantees exact ratio
      } else {
        srcPath = path.join(refArtworkDir, slot.interim.masterFile);
        if (!fs.existsSync(srcPath)) throw new Error(`missing interim master: ${srcPath}`);
        source = "interim-artwork";
        sourceDescription = `Ref/artwork/${slot.interim.masterFile} (${slot.interim.masterSubject})`;
        cropMode = slot.interim.crop[bp];
      }

      const meta = await readMeta(srcPath);
      const maxW = maxWidthForAspect(meta.width, meta.height, aspect);
      const widths = REQUEST_WIDTHS[bp];
      const generated = widths.filter((w) => w <= maxW);
      const skipped = widths.filter((w) => w > maxW).map((w) => ({ width: w, shortfallPx: w - maxW }));

      resolved.push({ bp, srcPath, srcW: meta.width, srcH: meta.height, cropMode, source, sourceDescription, maxW, generated, skipped });
    }

    const overallLargestWidth = Math.max(0, ...resolved.flatMap((r) => r.generated));

    for (const r of resolved) {
      const { bp, srcPath, srcW, srcH, cropMode, source, sourceDescription, maxW, generated, skipped } = r;
      const aspect = ASPECT[bp];

      for (const s of skipped) {
        const msg = `${slot.id}/${bp}: SKIP width ${s.width} — this crop's ceiling is ${maxW}px (source ${srcW}x${srcH}, ${source}); upscaling refused. Shortfall ${s.shortfallPx}px.`;
        warnings.push(msg);
        console.warn(`  ! ${msg}`);
      }

      const belowSpecMinimum = maxW < MINIMUM[bp].w;
      const belowSpecIdeal = maxW < IDEAL[bp].w;
      if (belowSpecMinimum) {
        const msg = `${slot.id}/${bp}: interim crop ceiling ${maxW}px is BELOW the §4.1 minimum ${MINIMUM[bp].w}px (shortfall ${MINIMUM[bp].w - maxW}px). Expected per Razim's 2026-08-10 interim-slide decision — swap in a real Ref/hero triplet to clear this.`;
        warnings.push(msg);
        console.warn(`  ! ${msg}`);
      } else if (belowSpecIdeal) {
        const msg = `${slot.id}/${bp}: interim crop ceiling ${maxW}px meets the §4.1 minimum but is below the ideal ${IDEAL[bp].w}px (shortfall ${IDEAL[bp].w - maxW}px).`;
        warnings.push(msg);
        console.log(`  i ${msg}`);
      }

      breakpointReports.push({
        breakpoint: bp,
        source,
        sourceDescription,
        cropMode: describeCrop(cropMode),
        requestedWidths: REQUEST_WIDTHS[bp],
        generatedWidths: generated,
        skippedWidths: skipped,
        maxWidthForCrop: maxW,
        belowSpecMinimum,
        belowSpecIdeal,
      });

      if (generated.length === 0) {
        const msg = `${slot.id}/${bp}: NO widths survive — source too small for this ratio entirely.`;
        warnings.push(msg);
        console.error(`  ! ${msg}`);
        continue;
      }
      slideHasUsableBreakpoint = slideHasUsableBreakpoint || true;

      contactItems.push({ label: `${slot.id} / ${bp}`, srcPath, srcW, srcH, aspect, cropMode, source });

      const largestForBp = Math.max(...generated);
      console.log(`  [${bp}] source=${source} crop=${describeCrop(cropMode)} ceiling=${maxW}px`);

      for (const w of generated) {
        const h = Math.round(w / aspect);
        const pipeline = buildResized(srcPath, srcW, srcH, aspect, cropMode, w, h);
        const isLargestForBp = w === largestForBp;
        const isSlide1LargestOverall = slot.order === 1 && w === overallLargestWidth;
        const avifBudget = isSlide1LargestOverall ? BUDGET_SLIDE1_LARGEST_AVIF : BUDGET_DEFAULT;

        const avif = await encodeAvif(pipeline, avifBudget);
        const avifPath = path.join(outDir, `${slot.id}-${bp}-${w}.avif`);
        fs.writeFileSync(avifPath, avif.buf);
        files.push({
          slideId: slot.id,
          breakpoint: bp,
          width: w,
          height: h,
          format: "avif",
          path: `public/hero/${path.basename(avifPath)}`,
          bytes: avif.buf.length,
          quality: avif.quality,
          budgetKB: Math.round(avifBudget / 1024),
          overBudget: avif.overBudget,
        });

        const webp = await encodeWebp(pipeline, BUDGET_DEFAULT);
        const webpPath = path.join(outDir, `${slot.id}-${bp}-${w}.webp`);
        fs.writeFileSync(webpPath, webp.buf);
        files.push({
          slideId: slot.id,
          breakpoint: bp,
          width: w,
          height: h,
          format: "webp",
          path: `public/hero/${path.basename(webpPath)}`,
          bytes: webp.buf.length,
          quality: webp.quality,
          budgetKB: Math.round(BUDGET_DEFAULT / 1024),
          overBudget: webp.overBudget,
        });

        let jpgNote = "";
        if (isLargestForBp) {
          const jpg = await encodeJpg(pipeline, BUDGET_DEFAULT);
          const jpgPath = path.join(outDir, `${slot.id}-${bp}-${w}.jpg`);
          fs.writeFileSync(jpgPath, jpg.buf);
          files.push({
            slideId: slot.id,
            breakpoint: bp,
            width: w,
            height: h,
            format: "jpg",
            path: `public/hero/${path.basename(jpgPath)}`,
            bytes: jpg.buf.length,
            quality: jpg.quality,
            budgetKB: Math.round(BUDGET_DEFAULT / 1024),
            overBudget: jpg.overBudget,
          });
          jpgNote = `  jpg ${(jpg.buf.length / 1024).toFixed(0)}KB(q${jpg.quality})${jpg.overBudget ? " OVER-BUDGET" : ""}`;
          if (jpg.overBudget) warnings.push(`${slot.id}-${bp}-${w}.jpg over budget: ${(jpg.buf.length / 1024).toFixed(0)}KB > ${BUDGET_DEFAULT / 1024}KB at floor quality ${JPG_FLOOR_Q}.`);
        }

        const avifNote = `avif ${(avif.buf.length / 1024).toFixed(0)}KB(q${avif.quality})${avif.overBudget ? " OVER-BUDGET" : ""}${isSlide1LargestOverall ? " [slide-1 largest, 350KB budget]" : ""}`;
        const webpNote = `webp ${(webp.buf.length / 1024).toFixed(0)}KB(q${webp.quality})${webp.overBudget ? " OVER-BUDGET" : ""}`;
        console.log(`    ${w}x${h}  ${avifNote}  ${webpNote}${jpgNote}`);
        if (avif.overBudget) warnings.push(`${slot.id}-${bp}-${w}.avif over budget: ${(avif.buf.length / 1024).toFixed(0)}KB > ${avifBudget / 1024}KB at floor quality ${AVIF_FLOOR_Q}.`);
        if (webp.overBudget) warnings.push(`${slot.id}-${bp}-${w}.webp over budget: ${(webp.buf.length / 1024).toFixed(0)}KB > ${BUDGET_DEFAULT / 1024}KB at floor quality ${WEBP_FLOOR_Q}.`);
      }
    }

    slideReports.push({
      id: slot.id,
      order: slot.order,
      theme: slot.theme,
      isInterim: breakpointReports.some((b) => b.source === "interim-artwork"),
      status: slideHasUsableBreakpoint ? "approved" : "blocked: missing-crop",
      breakpoints: breakpointReports,
    });
  }

  // Largest output per slide+breakpoint, for explicit CLS-0 dimensions downstream.
  const largest: Record<string, { width: number; height: number; path: string }> = {};
  for (const f of files) {
    const key = `${f.slideId}:${f.breakpoint}`;
    const cur = largest[key];
    if (!cur || f.width > cur.width) largest[key] = { width: f.width, height: f.height, path: f.path };
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    budgets: { slide1LargestAvifKB: BUDGET_SLIDE1_LARGEST_AVIF / 1024, defaultKB: BUDGET_DEFAULT / 1024 },
    refHeroExists: fs.existsSync(refHeroDir),
    tripletsDiscovered: [...triplets.keys()],
    slides: slideReports,
    files,
    largest,
  };

  fs.writeFileSync(path.join(outDir, "_manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  await buildContactSheet(path.join(outDir, "_contact-sheet.jpg"), contactItems);

  console.log(`\n${files.length} files written to ${path.relative(siteRoot, outDir)}/`);
  console.log(`manifest: ${path.relative(siteRoot, path.join(outDir, "_manifest.json"))}`);
  console.log(`contact sheet: ${path.relative(siteRoot, path.join(outDir, "_contact-sheet.jpg"))}`);

  if (warnings.length > 0) {
    console.log(`\n${warnings.length} warning(s) — see above for each in context.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
