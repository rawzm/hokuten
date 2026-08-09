/**
 * artwork-prep — 「北天」 glyph-mosaic master intake + responsive derivative pipeline.
 *
 *   run from site/:  npx tsx scripts/artwork-prep.ts
 *
 * Reads Razim's nine supplied glyph-mosaic masters from ../Ref/artwork/ (typographic
 * halftone; the repeated 「北天」 kanji is the rendering primitive; source-photo colors
 * preserved — this script does NOT generate that look, it only crops/encodes it) and
 * emits the responsive derivatives the site places, per DESIGN-REVISIT.md §3:
 *
 *   public/art/<slug>-<variant>-<width>.avif
 *   public/art/<slug>-<variant>-<width>.webp
 *   public/art/<slug>-<variant>-<width>.jpg     (fallback, largest surviving width only)
 *   public/art/_manifest.json                   (files + per-slug/variant largest + blocked)
 *   public/art/_contact-sheet.jpg                (every distinct slug+variant, labelled)
 *
 * ── Config lives at the top ─────────────────────────────────────────────────
 * MASTERS maps the delivered filenames to stable slugs. PLACEMENTS is the full art
 * direction (placement → variant → slug → widths) from DESIGN-REVISIT.md — a newly
 * delivered piece (e.g. the extended-stay tile) is a one-line edit to PLACEMENTS,
 * never a refactor. CROP_OVERRIDES holds manual per-piece focal points for aggressive
 * (tile/portrait) crops where sharp's attention strategy cut the subject badly — filled
 * in after eyeballing _contact-sheet.jpg (see the review note near the bottom of this
 * file for which pieces were overridden and why).
 *
 * ── Never upscale ────────────────────────────────────────────────────────────
 * For a target aspect ratio, the crop window's own pixel size is fixed by the SOURCE's
 * dimensions regardless of which crop strategy (centre / attention / manual) positions
 * it — maxWidthForAspect() computes that ceiling once, and any requested width above it
 * is skipped and logged rather than upscaled. This is the substantive "never upscale"
 * rule; it is stricter than a literal "exceeds the master's raw file width" check
 * because an aggressive portrait/tile crop of a landscape master has an effective
 * resolution well below the master's raw width (e.g. a 1:1 crop of a 1672x941 source
 * tops out at 941px, not 1672px) — see the run report for exactly which requested
 * widths this affected.
 *
 * ── Encoding ─────────────────────────────────────────────────────────────────
 * ENCODER EFFORT (main loop, 2026-08-09): AVIF effort is 4, not 9. At effort 9 this
 * script measured ~1 minute per output width on these masters — roughly 50 minutes
 * for the full set, on the critical path of a build. Effort 4 is ~6x faster for a
 * low-single-digit-percent size cost, and every output still lands inside the §3.2
 * budgets. Raise it again only for a one-off final bake, never for the default run.
 *
 * AVIF + WebP start at quality 62/78 (DESIGN-REVISIT §3.2) and step down only if the
 * budget (350KB hero-largest AVIF, 250KB everything else) is missed. These are
 * high-frequency glyph-mosaic images — 4:2:0 chroma subsampling visibly mushes the
 * kanji — so AVIF and JPEG are forced to `chromaSubsampling: '4:4:4'`; WebP has no
 * equivalent explicit switch in libwebp, so it uses `smartSubsample: true` (its
 * closest high-quality-chroma lever) instead. JPEG fallback (mozjpeg, 4:4:4) is
 * emitted only at each placement's largest surviving width.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/** sharp's default export is `sharp(...) => Sharp` under `export =`; with
 *  esModuleInterop + bundler resolution the `sharp.Sharp` namespace member
 *  doesn't reliably resolve through the default-import binding, so pipeline
 *  values are typed via this alias instead. */
type SharpPipeline = ReturnType<typeof sharp>;

/* ============================================================================
   1. Masters — delivered filename -> stable slug
   ============================================================================ */

interface Master {
  slug: string;
  /** Filename as delivered in Ref/artwork/ (kept verbatim; masters are read-only). */
  file: string;
  subject: string;
}

const MASTERS: Master[] = [
  {
    slug: "hie-dusk",
    file: "ChatGPT Image Aug 8, 2026, 03_19_00 PM.png",
    subject: "Holiday Inn Express entrance at dusk, warm glow, dark ground",
  },
  {
    slug: "resort-tower-pool",
    file: "ChatGPT Image Aug 8, 2026, 03_19_03 PM.png",
    subject: "Curved resort tower, palms, large pool, vivid blue/green",
  },
  {
    slug: "full-service-sunset",
    file: "ChatGPT Image Aug 8, 2026, 03_22_12 PM.png",
    subject: "Full-service block at sunset, dusty blue / salmon / sand sky",
  },
  {
    slug: "marriott-tower",
    file: "ChatGPT Image Aug 8, 2026, 03_23_44 PM.png",
    subject: "Branded full-service tower, warm sand facade, palms",
  },
  {
    slug: "beachfront-aerial",
    file: "ChatGPT Image Aug 8, 2026, 03_25_21 PM.png",
    subject: "Beachfront aerial, ocean, beach, white towers",
  },
  {
    slug: "grand-resort-arrival",
    file: "ChatGPT Image Aug 8, 2026, 03_27_00 PM.png",
    subject: "Grand resort arrival court at sunset, palms, dramatic sky",
  },
  {
    slug: "historic-urban-dawn",
    file: "ChatGPT Image Aug 8, 2026, 03_29_15 PM.png",
    subject: "Historic classical downtown hotel at golden hour, street view",
  },
  {
    slug: "select-service-dusk",
    file: "ChatGPT Image Aug 8, 2026, 04_03_08 PM.png",
    subject: "Modern select-service hotel at dusk, light trails",
  },
  {
    slug: "resort-pool-loungers",
    file: "ChatGPT Image Aug 8, 2026, 04_04_27 PM.png",
    subject: "Resort pool, loungers, lush palms",
  },
];

/* ============================================================================
   2. Variants — aspect ratios (width / height)
   ============================================================================ */

type Variant = "hero" | "portrait" | "chapter" | "card" | "tile" | "wide";

const ASPECT: Record<Variant, number> = {
  hero: 12 / 5, // 2.4:1
  portrait: 3 / 4,
  chapter: 4 / 3,
  card: 3 / 2,
  tile: 1,
  wide: 5 / 2,
};

/* ============================================================================
   3. Crop strategy per variant, with per-piece manual overrides
   ============================================================================ */

type CropMode = "centre" | "attention" | { fx: number; fy: number };

/** hero/wide/card/chapter are landscape crops of landscape masters — centre is right.
 *  tile/portrait are the aggressive crops — lead with sharp's attention strategy. */
const DEFAULT_CROP: Record<Variant, CropMode> = {
  hero: "centre",
  wide: "centre",
  card: "centre",
  chapter: "centre",
  tile: "attention",
  portrait: "attention",
};

/**
 * Manual focal-point overrides, filled in after reading _contact-sheet.jpg.
 * fx/fy are fractions (0..1) of the SOURCE image marking the crop window's centre.
 * Key is `${slug}:${variant}`.
 *
 * Review note (2026-08-09): all tile + portrait attention crops were inspected in
 * the contact sheet. Two were wrong (see the two entries below with their reasons);
 * the rest — tile-selectService, tile-resortBoutique, spare-tile-resort-tower-pool,
 * spare-tile-grand-resort-arrival, and method-chapter (centre, not attention, and
 * already correct) — held their subject in frame and were left on the default.
 * Leave this populated only when a specific piece is confirmed bad; do not
 * pre-emptively override.
 */
const CROP_OVERRIDES: Partial<Record<string, CropMode>> = {
  /* Reviewed against _contact-sheet.jpg by the main loop, 2026-08-09.
     Two of sharp's attention crops picked the wrong subject: */

  // The 3:4 portrait sliced the entrance signage mid-word ("...day Inn Express"),
  // which reads as a rendering error rather than a crop. Centre keeps the sign
  // and the lit entrance whole in the frame.
  "hie-dusk:portrait": { fx: 0.5, fy: 0.5 },

  // The 1:1 attention crop chased the sunrise and left the building itself
  // hugging the right edge — the tile is meant to SAY "full-service", so the
  // building has to be the subject. The facade sits right of centre in the master.
  "historic-urban-dawn:tile": { fx: 0.7, fy: 0.52 },
};

/* ============================================================================
   4. Placements — the art direction (DESIGN-REVISIT.md §3 table)
   ============================================================================ */

interface Placement {
  /** Human label for logs/manifest — matches lib/valuation.ts PropertyType/Tier keys
   *  where applicable so the manifest agent can map straight across. */
  label: string;
  slug: string;
  variant: Variant;
  widths: number[];
}

const PLACEMENTS: Placement[] = [
  // — Hero —
  { label: "hero-theme-g", slug: "beachfront-aerial", variant: "hero", widths: [1024, 1440, 1920] },
  { label: "hero-theme-b", slug: "full-service-sunset", variant: "hero", widths: [1024, 1440, 1672] },

  // — Menu overlay panel —
  { label: "menu-overlay-portrait", slug: "hie-dusk", variant: "portrait", widths: [600, 900, 1200] },

  // — #method chapter —
  { label: "method-chapter", slug: "hie-dusk", variant: "chapter", widths: [800, 1200] },

  // — Card accents —
  { label: "listing-placeholder-card", slug: "beachfront-aerial", variant: "card", widths: [640, 1280] },
  { label: "closings-accent-card", slug: "marriott-tower", variant: "card", widths: [640, 1280] },

  // — Property-type tiles (1:1) — keys match lib/valuation.ts PropertyType —
  { label: "tile-limitedService", slug: "hie-dusk", variant: "tile", widths: [400, 800, 1200] },
  { label: "tile-selectService", slug: "select-service-dusk", variant: "tile", widths: [400, 800, 1200] },
  { label: "tile-fullService", slug: "historic-urban-dawn", variant: "tile", widths: [400, 800, 1200] },
  { label: "tile-resortBoutique", slug: "resort-pool-loungers", variant: "tile", widths: [400, 800, 1200] },
  // tile-extendedStay: NO ARTWORK DELIVERED — intentionally absent. See `BLOCKED` below.

  // — Market-tier panels (5:2) — keys match lib/valuation.ts Tier —
  { label: "wide-gateway", slug: "historic-urban-dawn", variant: "wide", widths: [800, 1600] },
  { label: "wide-secondary", slug: "grand-resort-arrival", variant: "wide", widths: [800, 1600] },
  { label: "wide-suburban", slug: "marriott-tower", variant: "wide", widths: [800, 1600] },
  { label: "wide-tertiary", slug: "select-service-dusk", variant: "wide", widths: [800, 1600] },

  // — Spare / alternates (hero + tile only) —
  { label: "spare-hero-resort-tower-pool", slug: "resort-tower-pool", variant: "hero", widths: [1024, 1440, 1672] },
  { label: "spare-tile-resort-tower-pool", slug: "resort-tower-pool", variant: "tile", widths: [400, 800, 1200] },
  { label: "spare-hero-grand-resort-arrival", slug: "grand-resort-arrival", variant: "hero", widths: [1024, 1440, 1672] },
  { label: "spare-tile-grand-resort-arrival", slug: "grand-resort-arrival", variant: "tile", widths: [400, 800, 1200] },
];

/** Placements that were requested but have no delivered artwork. Not generated —
 *  never faked. Downstream (content/artwork.ts) carries `status: "blocked:
 *  awaiting-artwork"` for these; recorded here too so the manifest is self-describing. */
const BLOCKED: { label: string; reason: string }[] = [
  { label: "tile-extendedStay", reason: "no artwork delivered for extended-stay property type" },
];

/* ============================================================================
   5. Encoding budgets (DESIGN-REVISIT §3.2)
   ============================================================================ */

const BUDGET_HERO_LARGEST_AVIF = 350 * 1024;
const BUDGET_DEFAULT = 250 * 1024;

const AVIF_START_Q = 62;
const AVIF_FLOOR_Q = 32;
const AVIF_STEP = 6;

/**
 * WebP/JPEG floors (2026-08-09 measurement note): AVIF is 100% inside budget on every
 * output in this set — AV1's transform handles this high-frequency repeated-glyph
 * content far better per byte than VP8 (WebP) or classic DCT (JPEG). On the busiest
 * large crops (hero/wide/card at their top width) WebP in particular does not reach
 * 250KB even near its practical quality floor — measured 235-289KB at quality 5 on
 * the worst offenders, i.e. visibly degraded and STILL not fully compliant. Driving
 * the floor that low would mush the kanji on the exact fallback tier (~4% of traffic,
 * browsers without AVIF support) that most needs a readable image. These floors are
 * therefore a real quality floor, not a budget-compliance guarantee: WebP/JPEG on the
 * largest width of hero/wide/card/chapter placements are EXPECTED to land over the
 * 250KB default budget by up to ~55%. avif is unaffected and is the format `<picture>`
 * must list first. See the run report / _manifest.json `overBudget` flags for the
 * exact list — do not lower these floors further to chase the number.
 */
const WEBP_START_Q = 78;
const WEBP_FLOOR_Q = 34;
const WEBP_STEP = 8;

const JPG_START_Q = 82;
const JPG_FLOOR_Q = 38;
const JPG_STEP = 8;

/* ============================================================================
   6. Crop geometry
   ============================================================================ */

/** The pixel width of the crop window a given aspect ratio produces from a source
 *  of srcW x srcH — i.e. the largest output width obtainable WITHOUT upscaling,
 *  independent of which strategy (centre/attention/manual) positions the window. */
function maxWidthForAspect(srcW: number, srcH: number, aspect: number): number {
  if (srcW / srcH > aspect) {
    // source is relatively wider than target — crop uses full height, width shrinks
    return Math.floor(srcH * aspect);
  }
  // source is relatively taller/narrower than target — crop uses full width
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

/** Build a sharp pipeline cropped+resized to exactly targetW x targetH. Source is
 *  re-read from disk (cheap relative to encode time) so each width gets a clean
 *  decode rather than compounding resizes. */
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
   7. Budgeted encoders — start at the spec quality, step down only if oversized
   ============================================================================ */

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

/** libwebp has no explicit 4:4:4 chroma switch like AVIF/JPEG — `smartSubsample` is
 *  its closest lever (high-quality chroma subsampling) and is used here for the
 *  same reason: keep the repeated-glyph fine detail from mushing. */
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
  let buf = await pipeline
    .clone()
    .jpeg({ quality: q, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();
  while (buf.length > budget && q > JPG_FLOOR_Q) {
    q = Math.max(JPG_FLOOR_Q, q - JPG_STEP);
    buf = await pipeline
      .clone()
      .jpeg({ quality: q, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toBuffer();
    if (q === JPG_FLOOR_Q) break;
  }
  return { buf, quality: q, overBudget: buf.length > budget };
}

/* ============================================================================
   8. Manifest types
   ============================================================================ */

interface FileEntry {
  label: string;
  slug: string;
  variant: Variant;
  width: number;
  height: number;
  format: "avif" | "webp" | "jpg";
  path: string; // repo-relative, e.g. public/art/hie-dusk-tile-800.avif
  bytes: number;
  quality: number;
  budgetKB: number;
  overBudget: boolean;
}

interface PlacementReport {
  label: string;
  slug: string;
  variant: Variant;
  cropMode: string;
  requestedWidths: number[];
  generatedWidths: number[];
  skippedWidths: number[];
  maxWidthForCrop: number;
}

/* ============================================================================
   9. Directory resolution
   ============================================================================ */

function resolveDirs(): { siteRoot: string; refArtworkDir: string; outDir: string } {
  const siteRoot = process.cwd();
  if (!fs.existsSync(path.join(siteRoot, "package.json")) || !fs.existsSync(path.join(siteRoot, "app", "globals.css"))) {
    throw new Error(`run this from site/ — cwd is ${siteRoot}`);
  }
  const repoRoot = path.resolve(siteRoot, "..");
  const refArtworkDir = path.join(repoRoot, "Ref", "artwork");
  if (!fs.existsSync(refArtworkDir)) {
    throw new Error(`missing masters directory: ${refArtworkDir}`);
  }
  const outDir = path.join(siteRoot, "public", "art");
  return { siteRoot, refArtworkDir, outDir };
}

/* ============================================================================
   10. Contact sheet
   ============================================================================ */

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function buildContactSheet(
  outPath: string,
  items: { label: string; slug: string; variant: Variant; srcPath: string; srcW: number; srcH: number; aspect: number; cropMode: CropMode }[],
): Promise<void> {
  const COLS = 3;
  const CELL_W = 320;
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
    labels += `<text x="${p.x}" y="${ly + 17}" font-family="monospace" font-size="11" fill="#5a5a5a">${escapeXml(p.it.slug)} · ${p.it.variant} · crop=${escapeXml(describeCrop(p.it.cropMode))}</text>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}">
    <rect width="100%" height="100%" fill="#f4f1ea"/>
    <text x="${PAD}" y="36" font-family="monospace" font-size="20" font-weight="bold" fill="#1a1a1a">HOKUTEN 「北天」 artwork — contact sheet</text>
    ${images}
    ${labels}
  </svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(outPath);
}

/* ============================================================================
   11. Main
   ============================================================================ */

async function main(): Promise<void> {
  const { siteRoot, refArtworkDir, outDir } = resolveDirs();
  fs.mkdirSync(outDir, { recursive: true });

  const masterMeta = new Map<string, { width: number; height: number; path: string; subject: string }>();
  for (const m of MASTERS) {
    const p = path.join(refArtworkDir, m.file);
    if (!fs.existsSync(p)) throw new Error(`missing master: ${p}`);
    const meta = await sharp(p).metadata();
    if (!meta.width || !meta.height) throw new Error(`unreadable dimensions: ${p}`);
    masterMeta.set(m.slug, { width: meta.width, height: meta.height, path: p, subject: m.subject });
  }

  const files: FileEntry[] = [];
  const placementReports: PlacementReport[] = [];
  const warnings: string[] = [];
  const contactItems: { label: string; slug: string; variant: Variant; srcPath: string; srcW: number; srcH: number; aspect: number; cropMode: CropMode }[] = [];

  for (const placement of PLACEMENTS) {
    const meta = masterMeta.get(placement.slug);
    if (!meta) throw new Error(`PLACEMENTS references unknown slug: ${placement.slug}`);

    const aspect = ASPECT[placement.variant];
    const maxW = maxWidthForAspect(meta.width, meta.height, aspect);
    const cropKey = `${placement.slug}:${placement.variant}`;
    const cropMode = CROP_OVERRIDES[cropKey] ?? DEFAULT_CROP[placement.variant];

    const generated = placement.widths.filter((w) => w <= maxW);
    const skipped = placement.widths.filter((w) => w > maxW);

    if (skipped.length > 0) {
      const msg = `${placement.label} (${placement.slug}-${placement.variant}): SKIP widths [${skipped.join(", ")}] — this crop's ceiling is ${maxW}px (source ${meta.width}x${meta.height}); upscaling refused.`;
      warnings.push(msg);
      console.warn(`  ! ${msg}`);
    }

    placementReports.push({
      label: placement.label,
      slug: placement.slug,
      variant: placement.variant,
      cropMode: describeCrop(cropMode),
      requestedWidths: placement.widths,
      generatedWidths: generated,
      skippedWidths: skipped,
      maxWidthForCrop: maxW,
    });

    if (generated.length === 0) {
      warnings.push(`${placement.label}: NO widths survive for this crop — master too small entirely.`);
      continue;
    }

    contactItems.push({
      label: placement.label,
      slug: placement.slug,
      variant: placement.variant,
      srcPath: meta.path,
      srcW: meta.width,
      srcH: meta.height,
      aspect,
      cropMode,
    });

    const isHero = placement.variant === "hero";
    const largestW = Math.max(...generated);

    console.log(`\n${placement.label}  [${placement.slug} -> ${placement.variant}]  crop=${describeCrop(cropMode)}`);

    for (const w of generated) {
      const h = Math.round(w / aspect);
      const pipeline = buildResized(meta.path, meta.width, meta.height, aspect, cropMode, w, h);
      const isLargest = w === largestW;

      const avifBudget = isHero && isLargest ? BUDGET_HERO_LARGEST_AVIF : BUDGET_DEFAULT;
      const avif = await encodeAvif(pipeline, avifBudget);
      const avifPath = path.join(outDir, `${placement.slug}-${placement.variant}-${w}.avif`);
      fs.writeFileSync(avifPath, avif.buf);
      files.push({
        label: placement.label,
        slug: placement.slug,
        variant: placement.variant,
        width: w,
        height: h,
        format: "avif",
        path: `public/art/${path.basename(avifPath)}`,
        bytes: avif.buf.length,
        quality: avif.quality,
        budgetKB: Math.round(avifBudget / 1024),
        overBudget: avif.overBudget,
      });

      const webp = await encodeWebp(pipeline, BUDGET_DEFAULT);
      const webpPath = path.join(outDir, `${placement.slug}-${placement.variant}-${w}.webp`);
      fs.writeFileSync(webpPath, webp.buf);
      files.push({
        label: placement.label,
        slug: placement.slug,
        variant: placement.variant,
        width: w,
        height: h,
        format: "webp",
        path: `public/art/${path.basename(webpPath)}`,
        bytes: webp.buf.length,
        quality: webp.quality,
        budgetKB: Math.round(BUDGET_DEFAULT / 1024),
        overBudget: webp.overBudget,
      });

      let jpgNote = "";
      if (isLargest) {
        const jpg = await encodeJpg(pipeline, BUDGET_DEFAULT);
        const jpgPath = path.join(outDir, `${placement.slug}-${placement.variant}-${w}.jpg`);
        fs.writeFileSync(jpgPath, jpg.buf);
        files.push({
          label: placement.label,
          slug: placement.slug,
          variant: placement.variant,
          width: w,
          height: h,
          format: "jpg",
          path: `public/art/${path.basename(jpgPath)}`,
          bytes: jpg.buf.length,
          quality: jpg.quality,
          budgetKB: Math.round(BUDGET_DEFAULT / 1024),
          overBudget: jpg.overBudget,
        });
        jpgNote = `  jpg ${(jpg.buf.length / 1024).toFixed(0)}KB(q${jpg.quality})${jpg.overBudget ? " OVER-BUDGET" : ""}`;
        if (jpg.overBudget) warnings.push(`${placement.label}-${w}.jpg over budget: ${(jpg.buf.length / 1024).toFixed(0)}KB > ${BUDGET_DEFAULT / 1024}KB at floor quality ${JPG_FLOOR_Q}.`);
      }

      const avifNote = `avif ${(avif.buf.length / 1024).toFixed(0)}KB(q${avif.quality})${avif.overBudget ? " OVER-BUDGET" : ""}`;
      const webpNote = `webp ${(webp.buf.length / 1024).toFixed(0)}KB(q${webp.quality})${webp.overBudget ? " OVER-BUDGET" : ""}`;
      console.log(`  ${w}x${h}  ${avifNote}  ${webpNote}${jpgNote}`);
      if (avif.overBudget) warnings.push(`${placement.label}-${w}.avif over budget: ${(avif.buf.length / 1024).toFixed(0)}KB > ${avifBudget / 1024}KB at floor quality ${AVIF_FLOOR_Q}.`);
      if (webp.overBudget) warnings.push(`${placement.label}-${w}.webp over budget: ${(webp.buf.length / 1024).toFixed(0)}KB > ${BUDGET_DEFAULT / 1024}KB at floor quality ${WEBP_FLOOR_Q}.`);
    }
  }

  // Largest output per slug+variant (for explicit CLS-0 dimensions downstream).
  const largest: Record<string, { width: number; height: number; path: string }> = {};
  for (const f of files) {
    const key = `${f.slug}:${f.variant}`;
    const cur = largest[key];
    if (!cur || f.width > cur.width) {
      largest[key] = { width: f.width, height: f.height, path: f.path };
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    budgets: { heroLargestAvifKB: BUDGET_HERO_LARGEST_AVIF / 1024, defaultKB: BUDGET_DEFAULT / 1024 },
    masters: MASTERS.map((m) => {
      const meta = masterMeta.get(m.slug)!;
      return { slug: m.slug, file: m.file, width: meta.width, height: meta.height, subject: m.subject };
    }),
    placements: placementReports,
    files,
    largest,
    blocked: BLOCKED,
  };

  fs.writeFileSync(path.join(outDir, "_manifest.json"), JSON.stringify(manifest, null, 2), "utf8");

  await buildContactSheet(path.join(outDir, "_contact-sheet.jpg"), contactItems);

  console.log(`\n${files.length} files written to ${path.relative(siteRoot, outDir)}/`);
  console.log(`manifest: ${path.relative(siteRoot, path.join(outDir, "_manifest.json"))}`);
  console.log(`contact sheet: ${path.relative(siteRoot, path.join(outDir, "_contact-sheet.jpg"))}`);

  if (BLOCKED.length > 0) {
    console.log(`\nBLOCKED (no artwork delivered, not faked):`);
    for (const b of BLOCKED) console.log(`  - ${b.label}: ${b.reason}`);
  }

  if (warnings.length > 0) {
    console.log(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.log(`  ! ${w}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
