/**
 * menu-prep — the menu overlay's art-panel master-intake + responsive derivative
 * pipeline.
 *
 *   run from site/:  npx tsx scripts/menu-prep.ts
 *
 * DESIGN-REVISIT-2.md §4.2 (spec) + D17 (full-bleed menu, full-color image, real
 * hotel photograph OR approved glyph artwork permitted — never stock, never a
 * grayscale/veil filter) + D21 (Ref/ is never a runtime source).
 *
 * Same two-tier resolution as `hero-prep.ts`, per breakpoint independently:
 *
 *   1. PREFERRED — `Ref/menu/menu.desktop.<ext>` / `Ref/menu/menu.mobile.<ext>`
 *      (jpg/jpeg/png/tif/tiff), exactly the §4.2 naming. If present, used as-is.
 *   2. FALLBACK — a real, approved hotel photograph already shipping on the site
 *      (`site/public/hotels/`), cropped to the two §4.2 ratios.
 *
 * ── Today's actual run (2026-08-10) ──────────────────────────────────────────
 * `Ref/menu/` does not exist yet — nothing has been delivered. Both breakpoints
 * use the interim hotel-photo fallback.
 *
 * ── Master choice ─────────────────────────────────────────────────────────────
 * `site/public/hotels/hie-brooklyn.jpg` — the Holiday Inn Express Brooklyn
 * closing photograph — chosen over the other five for two independent reasons,
 * both verified by opening the file directly (not just checking dimensions):
 *
 *   1. Resolution headroom. It is 3840x2560 — 3-4x every other file in
 *      `public/hotels/` (the rest sit at ~1000-1300px on their long edge). Only
 *      this file can supply BOTH §4.2 ideal canvases (1800x2400 desktop,
 *      2400x1000 mobile) without upscaling:
 *        desktop 3:4 ceiling = floor(2560 * 0.75)  = 1920px  (ideal needs 1800)
 *        mobile 12:5 ceiling = min(3840, ...)       = 3840px  (ideal needs 2400)
 *      Every other candidate's 3:4 ceiling lands between 455-720px — well under
 *      even the §4.2 MINIMUM (1200px) — so this was a resolution cut, not a
 *      taste preference; the other five are simply not usable at spec.
 *   2. Composition. A tall, symmetric-ish street elevation: green Holiday Inn
 *      Express sign + canopy roughly centered over full-height glass, doors
 *      centered beneath. A plain centre crop for both ratios keeps the branded
 *      entrance in frame — verified against the full-resolution file, not a
 *      thumbnail (see CROP below for the exact vertical reasoning).
 *
 * ── Crop ───────────────────────────────────────────────────────────────────────
 * Both breakpoints use a plain "centre" crop — verified, not assumed:
 *   - Desktop 3:4 (height-limited: uses the FULL 2560px height, crops width to
 *     1920 of 3840, i.e. the centered 50%). The sign + canopy + doors sit
 *     roughly centered horizontally in the source, so centre keeps them framed.
 *     The crop's own top-left corner lands on a plain glass/curtain area of the
 *     facade (no signage, no text) — safe under the §4.2 112x112 close-control
 *     zone.
 *   - Mobile 12:5 (width-limited: uses the FULL 3840px width, crops height to
 *     1600 of 2560, centered — rows 480-2080). The HIE sign sits at
 *     approximately y=480-806 of the source, so a CENTERED band starts exactly
 *     at the sign's top edge and extends through the canopy, glass lobby and
 *     most of the entrance doors, cropping only the blank upper curtain-wall
 *     strip and the lower pavement/planter strip — both inessential.
 *
 * ── Encoding ───────────────────────────────────────────────────────────────────
 * This is an ordinary photograph, not glyph-mosaic art — no chroma-subsampling
 * concern the way `artwork-prep.ts`/`hero-prep.ts` have one. AVIF/WebP/JPEG use
 * sharp's normal defaults; AVIF stays at `effort: 4` for the same build-time
 * reason documented in `artwork-prep.ts` (effort 9 measured ~10x slower for a
 * low-single-digit-percent size gain). Budget: 250KB per image (no image here is
 * the page's LCP element, so no larger allowance is needed).
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

type SharpPipeline = ReturnType<typeof sharp>;

/* ============================================================================
   1. Breakpoints — the two display ratios, exact per §4.2
   ============================================================================ */

type Breakpoint = "desktop" | "mobile";
const BREAKPOINTS: Breakpoint[] = ["desktop", "mobile"];

const ASPECT: Record<Breakpoint, number> = {
  desktop: 3 / 4, // portrait panel
  mobile: 12 / 5, // wide band
};

const IDEAL: Record<Breakpoint, { w: number; h: number }> = {
  desktop: { w: 1800, h: 2400 },
  mobile: { w: 2400, h: 1000 },
};

const MINIMUM: Record<Breakpoint, { w: number; h: number }> = {
  desktop: { w: 1200, h: 1600 },
  mobile: { w: 1600, h: 667 },
};

/** Sensible intermediate widths, capped at each breakpoint's §4.2 IDEAL width —
 *  the source has headroom past that (see file header), but serving past the
 *  spec's own design ceiling isn't a "sensible" width, it's wasted bytes. */
const REQUEST_WIDTHS: Record<Breakpoint, number[]> = {
  desktop: [600, 900, 1200, 1800],
  mobile: [800, 1200, 1600, 2400],
};

/* ============================================================================
   2. Crop geometry — identical mechanism to artwork-prep.ts / hero-prep.ts
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
   3. Config — the one place a real Ref/menu drop or a different interim
      photograph gets registered
   ============================================================================ */

interface InterimSource {
  /** Path relative to site/public/ (already a shipped, approved photo). */
  publicPath: string;
  hotelName: string;
  crop: Record<Breakpoint, CropMode>;
}

const INTERIM: InterimSource = {
  publicPath: "hotels/hie-brooklyn.jpg",
  hotelName: "Holiday Inn Express Brooklyn",
  crop: { desktop: "centre", mobile: "centre" },
};

/** Depicts the real hotel, never the treatment (alt-text law). Matches the
 *  established wording in content/closings.ts for the same photograph. */
const ALT = "The Holiday Inn Express Brooklyn entrance canopy and lobby in Sunset Park, its lit green sign and glass doors facing the street.";

/* ============================================================================
   4. Encoding budget
   ============================================================================ */

const BUDGET_DEFAULT = 250 * 1024;

const AVIF_START_Q = 68;
const AVIF_FLOOR_Q = 38;
const AVIF_STEP = 6;

const WEBP_START_Q = 80;
const WEBP_FLOOR_Q = 40;
const WEBP_STEP = 8;

const JPG_START_Q = 84;
const JPG_FLOOR_Q = 45;
const JPG_STEP = 8;

interface Encoded {
  buf: Buffer;
  quality: number;
  overBudget: boolean;
}

async function encodeAvif(pipeline: SharpPipeline, budget: number): Promise<Encoded> {
  let q = AVIF_START_Q;
  let buf = await pipeline.clone().avif({ quality: q, effort: 4 }).toBuffer();
  while (buf.length > budget && q > AVIF_FLOOR_Q) {
    q = Math.max(AVIF_FLOOR_Q, q - AVIF_STEP);
    buf = await pipeline.clone().avif({ quality: q, effort: 4 }).toBuffer();
    if (q === AVIF_FLOOR_Q) break;
  }
  return { buf, quality: q, overBudget: buf.length > budget };
}

async function encodeWebp(pipeline: SharpPipeline, budget: number): Promise<Encoded> {
  let q = WEBP_START_Q;
  let buf = await pipeline.clone().webp({ quality: q, effort: 4 }).toBuffer();
  while (buf.length > budget && q > WEBP_FLOOR_Q) {
    q = Math.max(WEBP_FLOOR_Q, q - WEBP_STEP);
    buf = await pipeline.clone().webp({ quality: q, effort: 4 }).toBuffer();
    if (q === WEBP_FLOOR_Q) break;
  }
  return { buf, quality: q, overBudget: buf.length > budget };
}

async function encodeJpg(pipeline: SharpPipeline, budget: number): Promise<Encoded> {
  let q = JPG_START_Q;
  let buf = await pipeline.clone().jpeg({ quality: q, mozjpeg: true }).toBuffer();
  while (buf.length > budget && q > JPG_FLOOR_Q) {
    q = Math.max(JPG_FLOOR_Q, q - JPG_STEP);
    buf = await pipeline.clone().jpeg({ quality: q, mozjpeg: true }).toBuffer();
    if (q === JPG_FLOOR_Q) break;
  }
  return { buf, quality: q, overBudget: buf.length > budget };
}

/* ============================================================================
   5. Directory resolution + Ref/menu discovery
   ============================================================================ */

function resolveDirs(): { siteRoot: string; refMenuDir: string; publicDir: string; outDir: string } {
  const siteRoot = process.cwd();
  if (!fs.existsSync(path.join(siteRoot, "package.json")) || !fs.existsSync(path.join(siteRoot, "app", "globals.css"))) {
    throw new Error(`run this from site/ — cwd is ${siteRoot}`);
  }
  const repoRoot = path.resolve(siteRoot, "..");
  const refMenuDir = path.join(repoRoot, "Ref", "menu");
  const publicDir = path.join(siteRoot, "public");
  const outDir = path.join(siteRoot, "public", "menu");
  return { siteRoot, refMenuDir, publicDir, outDir };
}

const EXT_RE = /\.(jpe?g|png|tiff?)$/i;

/** Looks for `menu.<breakpoint>.<ext>` in Ref/menu/, exactly the §4.2 naming.
 *  Missing directory/file is not an error — nothing has been delivered yet. */
function findRefMenuFile(refMenuDir: string, bp: Breakpoint): string | null {
  if (!fs.existsSync(refMenuDir)) return null;
  for (const file of fs.readdirSync(refMenuDir)) {
    if (file.startsWith(".")) continue;
    const m = file.match(new RegExp(`^menu\\.${bp}\\.[a-z0-9]+$`, "i"));
    if (m && EXT_RE.test(file)) return path.join(refMenuDir, file);
  }
  return null;
}

/* ============================================================================
   6. Manifest types
   ============================================================================ */

type SourceKind = "ref-menu" | "interim-hotel-photo";

interface FileEntry {
  breakpoint: Breakpoint;
  width: number;
  height: number;
  format: "avif" | "webp" | "jpg";
  path: string;
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
  const COLS = 2;
  const CELL_W = 420;
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
    <text x="${PAD}" y="36" font-family="monospace" font-size="20" font-weight="bold" fill="#1a1a1a">HOKUTEN menu art panel — contact sheet</text>
    ${images}
    ${labels}
  </svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(outPath);
}

/* ============================================================================
   8. Main
   ============================================================================ */

async function main(): Promise<void> {
  const { siteRoot, refMenuDir, publicDir, outDir } = resolveDirs();
  fs.mkdirSync(outDir, { recursive: true });

  const warnings: string[] = [];
  if (!fs.existsSync(refMenuDir)) {
    const msg = `Ref/menu/ does not exist — both breakpoints use the interim hotel-photo fallback. Expected today (2026-08-10); drop menu.desktop.<ext> / menu.mobile.<ext> to go real.`;
    warnings.push(msg);
    console.log(`  ! ${msg}`);
  }

  const interimPath = path.join(publicDir, INTERIM.publicPath);
  if (!fs.existsSync(interimPath)) throw new Error(`missing interim master: ${interimPath}`);
  const interimMeta = await sharp(interimPath).metadata();
  if (!interimMeta.width || !interimMeta.height) throw new Error(`unreadable dimensions: ${interimPath}`);

  const files: FileEntry[] = [];
  const breakpointReports: BreakpointReport[] = [];
  const contactItems: { label: string; srcPath: string; srcW: number; srcH: number; aspect: number; cropMode: CropMode; source: SourceKind }[] = [];

  for (const bp of BREAKPOINTS) {
    const aspect = ASPECT[bp];
    const refFile = findRefMenuFile(refMenuDir, bp);

    let srcPath: string;
    let srcW: number;
    let srcH: number;
    let source: SourceKind;
    let sourceDescription: string;
    let cropMode: CropMode;

    if (refFile) {
      srcPath = refFile;
      const meta = await sharp(refFile).metadata();
      if (!meta.width || !meta.height) throw new Error(`unreadable dimensions: ${refFile}`);
      srcW = meta.width;
      srcH = meta.height;
      source = "ref-menu";
      sourceDescription = `Ref/menu/${path.basename(refFile)}`;
      cropMode = "centre";
    } else {
      srcPath = interimPath;
      srcW = interimMeta.width;
      srcH = interimMeta.height;
      source = "interim-hotel-photo";
      sourceDescription = `public/${INTERIM.publicPath} (${INTERIM.hotelName})`;
      cropMode = INTERIM.crop[bp];
    }

    const maxW = maxWidthForAspect(srcW, srcH, aspect);
    const widths = REQUEST_WIDTHS[bp];
    const generated = widths.filter((w) => w <= maxW);
    const skipped = widths.filter((w) => w > maxW).map((w) => ({ width: w, shortfallPx: w - maxW }));

    console.log(`\n=== menu.${bp} ===  source=${source} crop=${describeCrop(cropMode)} ceiling=${maxW}px (source ${srcW}x${srcH})`);

    for (const s of skipped) {
      const msg = `menu/${bp}: SKIP width ${s.width} — this crop's ceiling is ${maxW}px (source ${srcW}x${srcH}, ${source}); upscaling refused. Shortfall ${s.shortfallPx}px.`;
      warnings.push(msg);
      console.warn(`  ! ${msg}`);
    }

    const belowSpecMinimum = maxW < MINIMUM[bp].w;
    const belowSpecIdeal = maxW < IDEAL[bp].w;
    if (belowSpecMinimum) {
      const msg = `menu/${bp}: crop ceiling ${maxW}px is BELOW the §4.2 minimum ${MINIMUM[bp].w}px (shortfall ${MINIMUM[bp].w - maxW}px).`;
      warnings.push(msg);
      console.warn(`  ! ${msg}`);
    } else if (belowSpecIdeal) {
      const msg = `menu/${bp}: crop ceiling ${maxW}px meets the §4.2 minimum but is below the ideal ${IDEAL[bp].w}px (shortfall ${IDEAL[bp].w - maxW}px).`;
      warnings.push(msg);
      console.log(`  i ${msg}`);
    } else {
      console.log(`  ok — crop ceiling meets or exceeds the §4.2 ideal canvas.`);
    }

    breakpointReports.push({
      breakpoint: bp,
      source,
      sourceDescription,
      cropMode: describeCrop(cropMode),
      requestedWidths: widths,
      generatedWidths: generated,
      skippedWidths: skipped,
      maxWidthForCrop: maxW,
      belowSpecMinimum,
      belowSpecIdeal,
    });

    if (generated.length === 0) {
      const msg = `menu/${bp}: NO widths survive — source too small for this ratio entirely.`;
      warnings.push(msg);
      console.error(`  ! ${msg}`);
      continue;
    }

    contactItems.push({ label: `menu.${bp}`, srcPath, srcW, srcH, aspect, cropMode, source });

    const largestW = Math.max(...generated);
    for (const w of generated) {
      const h = Math.round(w / aspect);
      const pipeline = buildResized(srcPath, srcW, srcH, aspect, cropMode, w, h);
      const isLargest = w === largestW;

      const avif = await encodeAvif(pipeline, BUDGET_DEFAULT);
      const avifPath = path.join(outDir, `menu-${bp}-${w}.avif`);
      fs.writeFileSync(avifPath, avif.buf);
      files.push({ breakpoint: bp, width: w, height: h, format: "avif", path: `public/menu/${path.basename(avifPath)}`, bytes: avif.buf.length, quality: avif.quality, budgetKB: Math.round(BUDGET_DEFAULT / 1024), overBudget: avif.overBudget });

      const webp = await encodeWebp(pipeline, BUDGET_DEFAULT);
      const webpPath = path.join(outDir, `menu-${bp}-${w}.webp`);
      fs.writeFileSync(webpPath, webp.buf);
      files.push({ breakpoint: bp, width: w, height: h, format: "webp", path: `public/menu/${path.basename(webpPath)}`, bytes: webp.buf.length, quality: webp.quality, budgetKB: Math.round(BUDGET_DEFAULT / 1024), overBudget: webp.overBudget });

      let jpgNote = "";
      if (isLargest) {
        const jpg = await encodeJpg(pipeline, BUDGET_DEFAULT);
        const jpgPath = path.join(outDir, `menu-${bp}-${w}.jpg`);
        fs.writeFileSync(jpgPath, jpg.buf);
        files.push({ breakpoint: bp, width: w, height: h, format: "jpg", path: `public/menu/${path.basename(jpgPath)}`, bytes: jpg.buf.length, quality: jpg.quality, budgetKB: Math.round(BUDGET_DEFAULT / 1024), overBudget: jpg.overBudget });
        jpgNote = `  jpg ${(jpg.buf.length / 1024).toFixed(0)}KB(q${jpg.quality})${jpg.overBudget ? " OVER-BUDGET" : ""}`;
        if (jpg.overBudget) warnings.push(`menu-${bp}-${w}.jpg over budget: ${(jpg.buf.length / 1024).toFixed(0)}KB > ${BUDGET_DEFAULT / 1024}KB at floor quality ${JPG_FLOOR_Q}.`);
      }

      console.log(`  ${w}x${h}  avif ${(avif.buf.length / 1024).toFixed(0)}KB(q${avif.quality})${avif.overBudget ? " OVER-BUDGET" : ""}  webp ${(webp.buf.length / 1024).toFixed(0)}KB(q${webp.quality})${webp.overBudget ? " OVER-BUDGET" : ""}${jpgNote}`);
      if (avif.overBudget) warnings.push(`menu-${bp}-${w}.avif over budget: ${(avif.buf.length / 1024).toFixed(0)}KB > ${BUDGET_DEFAULT / 1024}KB at floor quality ${AVIF_FLOOR_Q}.`);
      if (webp.overBudget) warnings.push(`menu-${bp}-${w}.webp over budget: ${(webp.buf.length / 1024).toFixed(0)}KB > ${BUDGET_DEFAULT / 1024}KB at floor quality ${WEBP_FLOOR_Q}.`);
    }
  }

  const largest: Record<string, { width: number; height: number; path: string }> = {};
  for (const f of files) {
    const cur = largest[f.breakpoint];
    if (!cur || f.width > cur.width) largest[f.breakpoint] = { width: f.width, height: f.height, path: f.path };
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    budgetKB: BUDGET_DEFAULT / 1024,
    refMenuExists: fs.existsSync(refMenuDir),
    interim: { publicPath: INTERIM.publicPath, hotelName: INTERIM.hotelName, sourceWidth: interimMeta.width, sourceHeight: interimMeta.height },
    breakpoints: breakpointReports,
    files,
    largest,
    alt: ALT,
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
