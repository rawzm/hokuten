/**
 * identity-prep — sharp pipeline for the header identity lockups (D1) and the
 * CoStar Power Broker / Annual award badges (D3).
 *
 * Run:  cd site && npx tsx scripts/identity-prep.ts
 *
 * Masters live in Ref/site/ (repo root) and stay untouched. This script only
 * ever WRITES into site/public/brand/ and site/public/awards/ — the D1
 * exception Razim granted to "Ref/ never imports to production", for
 * Ref/site only (docs/DESIGN-REVISIT.md §1).
 *
 * ── What this does ───────────────────────────────────────────────────────
 * PART 1  Lockups. Trims the white surround off each theme's KW COMMERCIAL /
 *         THE HOKUTEN GROUP lockup down to its true bounding box, then emits
 *         2x and 3x PNG+AVIF rasters sized for a 44px CSS render height. The
 *         background is NOT knocked out to transparency — see the header
 *         comment on `LOCKUPS` for why, and the script's final report for the
 *         resulting legibility read at 44px.
 * PART 2  CoStar badges. Trims only genuine flat-color letterbox padding
 *         (verified per-file below — most of these five have NONE, and this
 *         script does not invent a crop that would violate "never alter the
 *         aspect"), then emits 2x PNG+AVIF sized for a 40px CSS render
 *         height.
 * PART 3  A contact sheet, `_identity-sheet.jpg`, showing every prepared
 *         asset at its real (1x) CSS render height against the grounds it
 *         will actually sit on.
 *
 * Idempotent: every output is a pure function of the CONFIG below + the
 * Ref/site masters, so re-running reproduces the same files (PNG bytes are
 * deterministic; AVIF encoding may vary by a handful of bytes across libvips
 * builds, which is fine — nothing here hashes the output).
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "..");
const repoRoot = path.resolve(siteRoot, "..");

const refSiteDir = path.join(repoRoot, "Ref", "site");
const brandDir = path.join(siteRoot, "public", "brand");
const awardsDir = path.join(siteRoot, "public", "awards");

/* ===========================================================================
   CONFIG
   =========================================================================== */

/** CSS render height for the header lockup (D1: "header render height ~44px"). */
const LOCKUP_RENDER_HEIGHT = 44;
/** Densities shipped for the lockup. 3x is the primary/unsuffixed filename
 *  (`lockup-<key>.png`); 2x ships alongside as `lockup-<key>@2x.png`. Next's
 *  image optimizer downsamples from either at request time, so shipping 3x
 *  as the source of truth means a DPR-3 phone never upscales a soft 2x. */
const LOCKUP_DENSITIES = [3, 2] as const;

type LockupSpec = {
  /** Theme key — drives both the output filename and the contact sheet. */
  key: "blue" | "gold";
  src: string;
  /** sharp .trim() background reference. Both sources sit on a white/near-
   *  white ground (verified: no alpha channel in either master). */
  trimBackground: string;
  /** sharp .trim() threshold. Tuned per-file below, verified against a
   *  manual pixel bounding-box scan (see PROJECT-MEMORY / this agent's
   *  return value for the numbers) — do not drop below the verified value or
   *  the trim under-fires and ships extra white margin; don't raise it or it
   *  starts eating the mark's own near-white interior (the white
   *  "COMMERCIAL" / "THE HOKUTEN GROUP" bands). */
  trimThreshold: number;
  outBase: string;
};

/**
 * logo-blue.PNG: the navy panel + white "COMMERCIAL" / "THE HOKUTEN GROUP"
 * bands + terminal gold star all sit inside one chamfered outline — that
 * whole outline is "the mark". sharp's default corner-sampled background
 * ([254,253,255], i.e. already near-white) trims this correctly at a low
 * threshold; verified against a manual per-pixel scan: stable 971x812 across
 * threshold 200-230 (raw scan) / matches sharp trim 971x811 at threshold 15-20.
 *
 * logo-yellow.jpg: a screenshot JPEG. Row 0 only carries a ~1-2px grayish
 * capture artifact ([225,224,218], NOT part of the mark) that a low
 * threshold treats as "different from white" and refuses to trim past — so
 * threshold must clear that artifact's ~30-unit delta from pure white.
 * Verified: threshold 40-50 converges on a stable 670x502, which matches a
 * manual per-pixel bounding-box scan at scan-threshold 200-210 exactly
 * (670x502 / 669x501 — 1px rounding). Below 40 the crop stalls near the
 * original 917-wide frame; above ~50 it is stable, so 45 sits mid-plateau.
 */
const LOCKUPS: LockupSpec[] = [
  {
    key: "blue",
    src: path.join(refSiteDir, "logo-blue.PNG"),
    trimBackground: "#ffffff",
    trimThreshold: 20,
    outBase: path.join(brandDir, "lockup-blue"),
  },
  {
    key: "gold",
    src: path.join(refSiteDir, "logo-yellow.jpg"),
    trimBackground: "#ffffff",
    trimThreshold: 45,
    outBase: path.join(brandDir, "lockup-gold"),
  },
];

/** CSS render height for a badge in its various placements (D3 §4.4). */
const BADGE_RENDER_HEIGHT = 40;
const BADGE_DENSITY = 2;
const BADGE_MAX_BYTES = 60 * 1024;

type BadgeSpec = {
  key: string;
  src: string;
  outBase: string;
  /**
   * Explicit crop rect [left, top, width, height] in SOURCE pixels, for the
   * rare case where the file carries genuine flat-color letterbox padding
   * that is provably NOT part of the artwork (verified below per file).
   * `null` means ship the source untouched — its own full bounding box IS
   * the badge; cropping anything else would be cropping INTO the artwork,
   * which the badge usage terms (and this agent's brief) forbid.
   */
  crop: [number, number, number, number] | null;
};

/**
 * Verified per-file, by a manual per-pixel bounding-box scan against the
 * true background color (not sharp's corner-sampled heuristic, which
 * over-fires on the two gradient banners — see the report below):
 *
 *   powerbroker-q3-2025.png  1200x270  solid-color banner, full bleed
 *                            on all 4 edges. crop: null.
 *   powerbroker-q1-2026.png  1200x270  pale gradient banner, full bleed.
 *                            sharp's default trim() reports 1200x260 (10px
 *                            off top+bottom) but that is gradient-similarity
 *                            noise against the corner-sampled reference, NOT
 *                            a flat padding strip — there is no hard edge.
 *                            Cropping it would be cropping into the artwork.
 *                            crop: null.
 *   powerbroker-q2-2026.png  1200x270  same finding as q1. crop: null.
 *   US_2025Annual_TopBroker.png  600x135  a genuine flat #000000 letterbox
 *                            column, x=[0,18], full height, alpha=255 (opaque
 *                            black, not transparency) — a hard edge, content
 *                            starts cleanly at x=19 and the photo already
 *                            bleeds to the true right edge (x=599). This is
 *                            export padding, not artwork. crop: [19,0,581,135].
 *   US_2025Annual_TopFirm.png    600x135  identical finding. crop: [19,0,581,135].
 */
const BADGES: BadgeSpec[] = [
  {
    key: "powerbroker-q3-2025",
    src: path.join(refSiteDir, "powerbroker-q3-2025.png"),
    outBase: path.join(awardsDir, "powerbroker-q3-2025"),
    crop: null,
  },
  {
    key: "powerbroker-q1-2026",
    src: path.join(refSiteDir, "powerbroker-q1-2026.png"),
    outBase: path.join(awardsDir, "powerbroker-q1-2026"),
    crop: null,
  },
  {
    key: "powerbroker-q2-2026",
    src: path.join(refSiteDir, "powerbroker-q2-2026.png"),
    outBase: path.join(awardsDir, "powerbroker-q2-2026"),
    crop: null,
  },
  {
    key: "costar-top-broker-2025",
    src: path.join(refSiteDir, "US_2025Annual_TopBroker.png"),
    outBase: path.join(awardsDir, "costar-top-broker-2025"),
    crop: [19, 0, 581, 135],
  },
  {
    key: "costar-top-firm-2025",
    src: path.join(refSiteDir, "US_2025Annual_TopFirm.png"),
    outBase: path.join(awardsDir, "costar-top-firm-2025"),
    crop: [19, 0, 581, 135],
  },
];

const CONTACT_SHEET_OUT = path.join(brandDir, "_identity-sheet.jpg");
/** Floor width — the sheet grows past this if a row's real content needs
 *  more room (computed in `buildContactSheet`, never hardcoded past this). */
const SHEET_MIN_WIDTH = 1200;
const SHEET_PAD = 48;
const SHEET_LIGHT_GROUND = "#F7F4ED"; // --paper, gold theme (blue theme's is #F7F8F5 — close enough to stand in for "a light paper ground", singular, per the brief)
const SHEET_DARK_GROUND = "#16181B"; // --dark, both themes
const SHEET_SWATCH_GROUND = "#E4E1D8"; // neutral warm-gray for the badge row, distinct from both lockup panels so it reads as its own section

/* ===========================================================================
   helpers
   =========================================================================== */

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

function bytes(p: string): number {
  return fs.statSync(p).size;
}

function fmtKB(n: number): string {
  return `${(n / 1024).toFixed(1)}KB`;
}

/** Trim a source raster to its true content bounding box. Returns the
 *  trimmed buffer plus its resulting intrinsic dimensions. */
async function trimToBoundingBox(
  src: string,
  background: string,
  threshold: number,
): Promise<{ buffer: Buffer; width: number; height: number }> {
  const buffer = await sharp(src).trim({ background, threshold }).png().toBuffer();
  const meta = await sharp(buffer).metadata();
  if (!meta.width || !meta.height) {
    throw new Error(`trim produced no usable image for ${src}`);
  }
  return { buffer, width: meta.width, height: meta.height };
}

/** Resize a source buffer to an exact CSS-height x density raster,
 *  preserving aspect (width is derived, never forced), then encode PNG +
 *  AVIF. Returns both encoded buffers and the final intrinsic dimensions. */
async function renderAtHeight(
  source: Buffer,
  cssHeight: number,
  density: number,
): Promise<{ png: Buffer; avif: Buffer; width: number; height: number }> {
  const targetHeight = Math.round(cssHeight * density);
  const resized = sharp(source).resize({ height: targetHeight, fit: "inside", withoutEnlargement: false });
  const png = await resized.clone().png({ compressionLevel: 9 }).toBuffer();
  const meta = await sharp(png).metadata();
  const avif = await resized.clone().avif({ quality: 68, effort: 6 }).toBuffer();
  return { png, avif, width: meta.width ?? 0, height: meta.height ?? targetHeight };
}

type LockupResult = {
  key: string;
  trimmedWidth: number;
  trimmedHeight: number;
  aspect: number;
  renders: { density: number; width: number; height: number; pngBytes: number; avifBytes: number }[];
};

type BadgeResult = {
  key: string;
  sourceWidth: number;
  sourceHeight: number;
  croppedWidth: number;
  croppedHeight: number;
  width: number;
  height: number;
  pngBytes: number;
  avifBytes: number;
  overBudget: boolean;
};

/* ===========================================================================
   PART 1 — lockups
   =========================================================================== */

async function prepLockups(): Promise<LockupResult[]> {
  ensureDir(brandDir);
  const results: LockupResult[] = [];

  for (const spec of LOCKUPS) {
    if (!fs.existsSync(spec.src)) {
      throw new Error(`Missing lockup source: ${path.relative(repoRoot, spec.src)}`);
    }
    const trimmed = await trimToBoundingBox(spec.src, spec.trimBackground, spec.trimThreshold);
    const aspect = trimmed.width / trimmed.height;

    const renders: LockupResult["renders"] = [];
    for (const density of LOCKUP_DENSITIES) {
      const { png, avif, width, height } = await renderAtHeight(trimmed.buffer, LOCKUP_RENDER_HEIGHT, density);
      const suffix = density === 3 ? "" : `@${density}x`;
      const pngPath = `${spec.outBase}${suffix}.png`;
      const avifPath = `${spec.outBase}${suffix}.avif`;
      fs.writeFileSync(pngPath, png);
      fs.writeFileSync(avifPath, avif);
      console.log(
        `  ${path.relative(siteRoot, pngPath).padEnd(34)} ${width}x${height}  (${fmtKB(bytes(pngPath))})`,
      );
      console.log(
        `  ${path.relative(siteRoot, avifPath).padEnd(34)} ${width}x${height}  (${fmtKB(bytes(avifPath))})`,
      );
      renders.push({ density, width, height, pngBytes: bytes(pngPath), avifBytes: bytes(avifPath) });
    }

    results.push({ key: spec.key, trimmedWidth: trimmed.width, trimmedHeight: trimmed.height, aspect, renders });
  }

  return results;
}

/* ===========================================================================
   PART 2 — CoStar badges
   =========================================================================== */

async function prepBadges(): Promise<BadgeResult[]> {
  ensureDir(awardsDir);
  const results: BadgeResult[] = [];

  for (const spec of BADGES) {
    if (!fs.existsSync(spec.src)) {
      throw new Error(`Missing badge source: ${path.relative(repoRoot, spec.src)}`);
    }
    const srcMeta = await sharp(spec.src).metadata();
    const sourceWidth = srcMeta.width ?? 0;
    const sourceHeight = srcMeta.height ?? 0;

    let working = sharp(spec.src);
    let croppedWidth = sourceWidth;
    let croppedHeight = sourceHeight;
    if (spec.crop) {
      const [left, top, width, height] = spec.crop;
      working = working.extract({ left, top, width, height });
      croppedWidth = width;
      croppedHeight = height;
    }
    const workingBuffer = await working.png().toBuffer();

    const { png, avif, width, height } = await renderAtHeight(workingBuffer, BADGE_RENDER_HEIGHT, BADGE_DENSITY);
    const pngPath = `${spec.outBase}.png`;
    const avifPath = `${spec.outBase}.avif`;
    fs.writeFileSync(pngPath, png);
    fs.writeFileSync(avifPath, avif);

    const pngBytes = bytes(pngPath);
    const avifBytes = bytes(avifPath);
    const overBudget = pngBytes > BADGE_MAX_BYTES || avifBytes > BADGE_MAX_BYTES;

    console.log(
      `  ${path.relative(siteRoot, pngPath).padEnd(38)} ${width}x${height}  (${fmtKB(pngBytes)})${overBudget && pngBytes > BADGE_MAX_BYTES ? "  OVER 60KB BUDGET" : ""}`,
    );
    console.log(
      `  ${path.relative(siteRoot, avifPath).padEnd(38)} ${width}x${height}  (${fmtKB(avifBytes)})${overBudget && avifBytes > BADGE_MAX_BYTES ? "  OVER 60KB BUDGET" : ""}`,
    );

    results.push({
      key: spec.key,
      sourceWidth,
      sourceHeight,
      croppedWidth,
      croppedHeight,
      width,
      height,
      pngBytes,
      avifBytes,
      overBudget,
    });
  }

  return results;
}

/* ===========================================================================
   PART 3 — contact sheet
   =========================================================================== */

/** A tiny SVG label strip — this is an internal QA artifact, not shipped UI,
 *  so a system-font stack is fine (no brand type rule applies to it). */
/** Crude Helvetica-bold advance-width estimate, just enough to keep caption
 *  strings from overlapping the next item's swatch/caption on the sheet. */
function estimateTextWidth(text: string, fontSize: number): number {
  return Math.ceil(text.length * fontSize * 0.62);
}

function labelSvg(text: string, width: number, color: string, fontSize = 20): Buffer {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${fontSize + 10}">
    <text x="0" y="${fontSize}" font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="600" fill="${color}" letter-spacing="0.5">${text}</text>
  </svg>`;
  return Buffer.from(svg);
}

async function buildContactSheet(lockups: LockupResult[], badges: BadgeResult[]): Promise<void> {
  // Re-render each lockup at its literal 1x / 44px CSS height for the sheet —
  // this is what "real 44px render height" looks like with no DPR scaling.
  const lockupOnes: { key: string; png: Buffer; width: number; height: number }[] = [];
  for (const spec of LOCKUPS) {
    const trimmed = await trimToBoundingBox(spec.src, spec.trimBackground, spec.trimThreshold);
    const { png, width, height } = await renderAtHeight(trimmed.buffer, LOCKUP_RENDER_HEIGHT, 1);
    lockupOnes.push({ key: spec.key, png, width, height });
  }

  const badgeOnes: { key: string; png: Buffer; width: number; height: number }[] = [];
  for (const spec of BADGES) {
    let working = sharp(spec.src);
    if (spec.crop) {
      const [left, top, width, height] = spec.crop;
      working = working.extract({ left, top, width, height });
    }
    const buf = await working.png().toBuffer();
    const { png, width, height } = await renderAtHeight(buf, BADGE_RENDER_HEIGHT, 1);
    badgeOnes.push({ key: spec.key, png, width, height });
  }

  const panelLabelH = 44;
  const captionH = 26;
  const slotGap = 56;

  /** Lay a row of (image, caption) items out left-to-right, each slot sized
   *  to whichever is wider — the swatch or its own caption string — so
   *  captions can never bleed into the next item. Returns the x position
   *  each item's swatch should be drawn at, plus the row's total width. */
  function layoutRow(
    items: { width: number; caption: string }[],
    captionFontSize: number,
  ): { x: number[]; rowWidth: number } {
    const x: number[] = [];
    let cursor = SHEET_PAD;
    for (const item of items) {
      x.push(cursor);
      const slot = Math.max(item.width, estimateTextWidth(item.caption, captionFontSize));
      cursor += slot + slotGap;
    }
    return { x, rowWidth: cursor - slotGap + SHEET_PAD };
  }

  const lockupCaptions = lockupOnes.map((l) => `lockup-${l.key}  ${l.width}x${l.height}px`);
  const badgeCaptions = badgeOnes.map((b) => `${b.key}  ${b.width}x${b.height}px`);
  const lockupLayout = layoutRow(
    lockupOnes.map((l, i) => ({ width: l.width, caption: lockupCaptions[i] })),
    16,
  );
  const badgeLayout = layoutRow(
    badgeOnes.map((b, i) => ({ width: b.width, caption: badgeCaptions[i] })),
    14,
  );

  const sheetWidth = Math.max(SHEET_MIN_WIDTH, lockupLayout.rowWidth, badgeLayout.rowWidth);

  const lockupRowH = Math.max(...lockupOnes.map((l) => l.height)) + captionH;
  const badgeRowH = Math.max(...badgeOnes.map((b) => b.height)) + captionH;

  const panel1H = SHEET_PAD * 2 + panelLabelH + lockupRowH;
  const panel2H = panel1H;
  const panel3H = SHEET_PAD * 2 + panelLabelH + badgeRowH;

  const totalH = panel1H + panel2H + panel3H;

  const composites: { input: Buffer; left: number; top: number }[] = [];
  let y = 0;

  async function panel(ground: string, label: string, labelColor: string, height: number, top: number) {
    composites.push({
      input: await sharp({ create: { width: sheetWidth, height, channels: 3, background: ground } })
        .png()
        .toBuffer(),
      left: 0,
      top,
    });
    composites.push({ input: labelSvg(label, sheetWidth - SHEET_PAD * 2, labelColor, 22), left: SHEET_PAD, top: top + SHEET_PAD });
  }

  // Panel 1 — light paper ground, both lockups.
  await panel(SHEET_LIGHT_GROUND, "LIGHT GROUND — #F7F4ED  ·  header lockups @ real 44px CSS height (1x)", "#1A1C1F", panel1H, y);
  {
    const rowY = y + SHEET_PAD + panelLabelH;
    lockupOnes.forEach((l, i) => {
      composites.push({ input: l.png, left: lockupLayout.x[i], top: rowY });
      composites.push({
        input: labelSvg(lockupCaptions[i], 400, "#4A4A46", 16),
        left: lockupLayout.x[i],
        top: rowY + l.height + 4,
      });
    });
  }
  y += panel1H;

  // Panel 2 — dark ground, both lockups.
  await panel(SHEET_DARK_GROUND, "DARK GROUND — #16181B  ·  header lockups @ real 44px CSS height (1x)", "#F7F4ED", panel2H, y);
  {
    const rowY = y + SHEET_PAD + panelLabelH;
    lockupOnes.forEach((l, i) => {
      composites.push({ input: l.png, left: lockupLayout.x[i], top: rowY });
      composites.push({
        input: labelSvg(lockupCaptions[i], 400, "#C9C4B5", 16),
        left: lockupLayout.x[i],
        top: rowY + l.height + 4,
      });
    });
  }
  y += panel2H;

  // Panel 3 — badges row.
  await panel(SHEET_SWATCH_GROUND, "AWARD BADGES  ·  real 40px CSS render height (1x)", "#1A1C1F", panel3H, y);
  {
    const rowY = y + SHEET_PAD + panelLabelH;
    badgeOnes.forEach((b, i) => {
      composites.push({ input: b.png, left: badgeLayout.x[i], top: rowY });
      composites.push({
        input: labelSvg(badgeCaptions[i], 400, "#4A4A46", 14),
        left: badgeLayout.x[i],
        top: rowY + b.height + 4,
      });
    });
  }

  await sharp({ create: { width: sheetWidth, height: totalH, channels: 3, background: "#000000" } })
    .composite(composites)
    .jpeg({ quality: 92 })
    .toFile(CONTACT_SHEET_OUT);

  console.log(
    `  ${path.relative(siteRoot, CONTACT_SHEET_OUT).padEnd(38)} ${sheetWidth}x${totalH}  (${fmtKB(bytes(CONTACT_SHEET_OUT))})`,
  );
}

/* ===========================================================================
   legibility check — render each lockup at its true 1x/44px CSS height in
   isolation so the report below can look at exactly what a nav bar would.
   Written to the OS temp dir, NOT public/brand/ — these are throwaway QA
   renders for this agent's manual read-back, not a shipped deliverable, and
   public/brand/ is a served directory that should hold only the named
   outputs.
   =========================================================================== */

async function legibilityRenders(): Promise<{ key: string; path: string }[]> {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "identity-prep-legibility-"));
  const out: { key: string; path: string }[] = [];
  for (const spec of LOCKUPS) {
    const trimmed = await trimToBoundingBox(spec.src, spec.trimBackground, spec.trimThreshold);
    const { png } = await renderAtHeight(trimmed.buffer, LOCKUP_RENDER_HEIGHT, 1);
    const p = path.join(outDir, `${spec.key}-44px.png`);
    fs.writeFileSync(p, png);
    out.push({ key: spec.key, path: p });
  }
  return out;
}

/* ===========================================================================
   main
   =========================================================================== */

async function main(): Promise<void> {
  console.log("PART 1 — header lockups (D1)");
  const lockups = await prepLockups();

  console.log("\nPART 2 — CoStar award badges (D3)");
  const badges = await prepBadges();

  console.log("\nlegibility-check renders (1x / 44px, for manual read — not shipped UI assets)");
  const legibility = await legibilityRenders();
  for (const l of legibility) console.log(`  ${path.relative(siteRoot, l.path)}`);

  console.log("\nPART 3 — contact sheet");
  await buildContactSheet(lockups, badges);

  console.log("\n── summary ──────────────────────────────────────────────────────────────");
  for (const l of lockups) {
    const render44 = l.renders.find((r) => r.density === 1) ?? l.renders[l.renders.length - 1];
    console.log(
      `  lockup-${l.key}: trimmed ${l.trimmedWidth}x${l.trimmedHeight}  aspect ${l.aspect.toFixed(4)}  → at 44px CSS height, width ≈ ${Math.round(44 * l.aspect)}px`,
    );
  }
  for (const b of badges) {
    console.log(
      `  ${b.key}: source ${b.sourceWidth}x${b.sourceHeight} → cropped ${b.croppedWidth}x${b.croppedHeight} → shipped ${b.width}x${b.height} (2x/${BADGE_RENDER_HEIGHT}px)  png=${fmtKB(b.pngBytes)} avif=${fmtKB(b.avifBytes)}${b.overBudget ? "  ** OVER BUDGET **" : ""}`,
    );
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
