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
 *         aspect"), then emits PNG+AVIF sized for each tier's render-height
 *         ceiling (D12 below).
 * PART 3  A contact sheet, `_identity-sheet.jpg`, showing every prepared
 *         asset at its real (1x) CSS render height against the grounds it
 *         will actually sit on.
 *
 * Idempotent: every output is a pure function of the CONFIG below + the
 * Ref/site masters, so re-running reproduces the same files (PNG bytes are
 * deterministic; AVIF encoding may vary by a handful of bytes across libvips
 * builds, which is fine — nothing here hashes the output).
 *
 * ── D12 (Razim, 2026-08-10, DESIGN REVISIT 2 §5.2) — badges grew, lockups did
 * not ─────────────────────────────────────────────────────────────────────
 * The five CoStar badges now render ONLY inside the Trust Metrics evidence
 * wall (`StatsSection.tsx` + `QuarterlyBanners.tsx`), at roughly 90–112px
 * (annual) / 64–84px (quarterly) CSS render height on wide desktop — up from
 * a single flat 40px target everywhere. PART 2 below is the part of this
 * script that changed. PART 1 (header lockups, D1) is untouched: this
 * round's brief is explicit that the lockup derivatives "are correct and in
 * use." The one shared helper both parts call, `renderAtHeight`, gained an
 * optional `allowEnlargement` parameter — every existing PART 1 call site
 * omits it, so it defaults to `true` and PART 1's resize call is
 * `withoutEnlargement: false`, byte-for-byte the same argument this script
 * always passed there. Only the new PART 2 call sites pass
 * `allowEnlargement: false`, for a reason specific to badges: at the new,
 * much taller render ceiling, a couple of the five source masters do not
 * carry enough native resolution to supply a genuine 2x retina raster (see
 * the per-badge sizing note below `BADGES`) — `withoutEnlargement: true`
 * makes sharp cap the output at the master's own real resolution instead of
 * upscaling (blurring) past it, which would otherwise silently violate the
 * "never alter the artwork" badge-usage rule this file's header already
 * commits to.
 *
 * ── 2026-08-17 (LAUNCH-IMPLEMENTATION §2.4/§4 A2, R14, X16) — three changes
 * ─────────────────────────────────────────────────────────────────────────
 * 1. NEW PART 0: the sticky header's mark is now a LINEAR-proportioned
 *    derivative of the kit's linear master (R14), not the stacked-proportion
 *    crop of `Ref/site/logo-yellow.jpg` PART 1 makes. The linear master is
 *    3.75:1; the stacked crop is 1.33:1, so what shipped before was a stacked
 *    mark wedged into a linear slot. PART 1 still runs — the stacked crop is
 *    what the footer brand cluster and the Trust identity anchor consume —
 *    but it is no longer the header's asset.
 *
 * 2. X16, a real bug, fixed: `lockup-gold@2x.png` was 117x88 while
 *    `lockup-gold.png` was 176x132 — the "retina" file was SMALLER than the
 *    base, on both theme pairs. The cause was this file's own density scheme:
 *    it baked the 3x and the 2x of ONE 44px CSS render and named the 3x with
 *    no suffix and the 2x `@2x`, so anything that read the suffix literally
 *    got a LOWER-resolution image for a HIGHER-DPR screen. The scheme is
 *    replaced outright — see LOCKUP_SOURCE_DENSITY / RETINA_MULTIPLE.
 *
 * 3. PART 2 (badges) is PARKED, not deleted. Its five sources under
 *    `Ref/site/` were deleted this round (F39/A29 — they are CoStar email
 *    signatures, one of them a README-excluded prior-firm asset that must
 *    never render), and the approved Winner Badge re-intake into
 *    `public/awards/` is portion P15's, not this script's. A missing badge
 *    source is therefore SKIPPED with a note instead of throwing, and this
 *    script writes nothing into `public/awards/` when the sources are absent.
 *    Re-pointing `BADGES` at `Ref/awards/` is P15's call to make, in P15's
 *    own pass — do not do it here just because the files exist.
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
/** R17/P17: the kit lockup masters the build consumes are copied into tracked
 *  `Ref/brand-kit/`, so this script never reaches into the gitignored
 *  `full-brand-toolkit/`. */
const refBrandKitDir = path.join(repoRoot, "Ref", "brand-kit");
const brandDir = path.join(siteRoot, "public", "brand");
const awardsDir = path.join(siteRoot, "public", "awards");

/* ===========================================================================
   CONFIG
   =========================================================================== */

/** CSS render height for the stacked lockup (D1: "header render height ~44px").
 *  This is now the FOOTER/Trust figure, not the header's — the header reads
 *  the linear derivative PART 0 bakes. Left at 44 deliberately: raising it
 *  would change `lockup-{gold,blue}.png`'s shipped dimensions, which
 *  StatsSection.tsx's layout note reasons about by number. */
const LOCKUP_RENDER_HEIGHT = 44;

/* ── Density scheme — REPLACED 2026-08-17 (X16) ────────────────────────────
 * The old scheme baked the 3x and the 2x of one CSS render and named the 3x
 * with no suffix, so `lockup-gold@2x.png` (117x88) was SMALLER than
 * `lockup-gold.png` (176x132). Two rules now, and they are the whole scheme:
 *
 *   <base>.png / .avif      The SOURCE next/image resizes from at request
 *                           time. Baked at LOCKUP_SOURCE_DENSITY x the
 *                           surface's CSS render height so a DPR-3 client
 *                           never upscales it. This keeps the existing
 *                           convention — every `themePresentation` path in
 *                           lib/theme.ts points at an unsuffixed file, and
 *                           that file is the high-resolution one.
 *   <base>@2x.png / .avif   EXACTLY twice the base file's emitted pixel
 *                           dimensions, for any consumer that reads the
 *                           density suffix literally. Derived by doubling the
 *                           base's own width AND height (renderExact), not by
 *                           a second independent height computation — so
 *                           "exactly 2x" is arithmetic, not a rounding
 *                           coincidence that a future edit could break.
 * ------------------------------------------------------------------------- */
const LOCKUP_SOURCE_DENSITY = 3;
const RETINA_MULTIPLE = 2;

/**
 * D26 (DESIGN-REVISIT-3.md, Razim, 2026-08-10) — the menu overlay's brand panel
 * and Trust's identity anchor render the theme lockup centred at roughly
 * 260–320px CSS height, "big enough the content inside the logo is visible."
 * The header derivatives above are baked for a 44px render (132px raster at
 * 3x) and visibly soften well before 320px. This is a SEPARATE, larger baked
 * render from the same trimmed source — not another density step in
 * `LOCKUP_DENSITIES` above, which stays scoped to the 44px nav render only.
 * 320 CSS px x 2 = a 640px-tall raster: a genuine 2x retina asset at the top
 * of the render band, never upscaled past what's baked. */
const LOCKUP_XL_CSS_HEIGHT = 320;
const LOCKUP_XL_DENSITY = 2;

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

/* ===========================================================================
   PART 0 CONFIG — the sticky header's linear lockup (R14 / A2)
   =========================================================================== */

/** CSS render height of the header mark. SiteNav.tsx renders
 *  `<Wordmark variant="brand" height={52} mobileHeight={48} />`, so 52 is the
 *  ceiling and the raster is baked against it. Read from the component, not
 *  from D1's older "~44px" figure, which D18 superseded. */
const HEADER_LOCKUP_CSS_HEIGHT = 52;

/**
 * True artwork bounding box of the kit's LINEAR lockup, in the 3762x1184
 * canvas the three `_on_*` exports share: [left, top, width, height].
 *
 * VERIFIED, not guessed, by a per-pixel scan of all three siblings against
 * their own ground colour:
 *   ..._on_White.png    ground #FFFFFF  -> x 137..3573, y 116..1031  (3437x916)
 *   ..._on_Ivory.png    ground #E2DCCC  -> x 137..3573, y 116..1031  (3437x916)
 *   ..._on_Charcoal.png ground #1A1C1F  -> x 146..2724, y 125..1031  (2579x907)
 *
 * The White and Ivory cuts agree to the pixel, and the transparent master's
 * own alpha bbox is 3437x916 as well, so 3437x916 IS the artwork. The
 * Charcoal cut disagrees for one reason only — see LINEAR_CHARCOAL_DEFECT.
 * Using the shared rect (rather than a per-file trim heuristic) keeps every
 * variant below at the identical 3.752 aspect and identical optical margins.
 */
const LINEAR_CROP: [number, number, number, number] = [137, 116, 3437, 916];

/**
 * ⚠ DEFECT IN THE KIT MASTER — READ BEFORE TRUSTING THE PRIMARY OUTPUT.
 *
 * `KW_Commercial_Linear_TheHokutenGroup_Gold_on_Charcoal.png` sets the word
 * COMMERCIAL in #1A1C1F on a #1A1C1F ground. It is not dark-on-dark-and-hard-
 * to-read; it is INVISIBLE — a 400x600px sample of that region returns 17,872
 * pixels of exactly (26,28,31) and nothing else but sub-3-unit antialiasing.
 * The dark-ground knockout that the STACKED on-charcoal cut applies (a white
 * plaque behind COMMERCIAL) was not applied to the linear cut.
 *
 * Consequence: the R14-specified derivative renders as [KW box] + [empty
 * charcoal] + [THE HOKUTEN GROUP], i.e. a KW COMMERCIAL lockup with the word
 * "Commercial" missing. Recolouring it would be altering the KW mark, which
 * the brand rules forbid outright, so this script does not.
 *
 * R14 is implemented as written — `lockup-linear-header.*` IS the on-charcoal
 * cut — and the on-WHITE cut is baked alongside as `lockup-linear-header-
 * onwhite.*` so the swap is a one-line path change in lib/theme.ts if Razim
 * rules that a lockup missing a word cannot ship. Neither file is wired to
 * anything by this script; wiring is lib/theme.ts's owner's call.
 */
const LINEAR_CHARCOAL_DEFECT = true;

type HeaderLockupSpec = {
  key: string;
  src: string;
  outBase: string;
  /** Shared verified rect; see LINEAR_CROP. */
  crop: [number, number, number, number];
  note: string;
};

const HEADER_LOCKUPS: HeaderLockupSpec[] = [
  {
    key: "linear-header",
    src: path.join(refBrandKitDir, "KW_Commercial_Linear_TheHokutenGroup_Gold_on_Charcoal.png"),
    outBase: path.join(brandDir, "lockup-linear-header"),
    crop: LINEAR_CROP,
    note: "R14 primary — on-charcoal. Ground is #1A1C1F, identical to --dark, so it sits seamlessly on a .surface-dark bar. SEE LINEAR_CHARCOAL_DEFECT: COMMERCIAL does not render in this cut.",
  },
  {
    key: "linear-header-onwhite",
    src: path.join(refBrandKitDir, "KW_Commercial_Linear_TheHokutenGroup_Gold_on_White.png"),
    outBase: path.join(brandDir, "lockup-linear-header-onwhite"),
    crop: LINEAR_CROP,
    note: "Swap-ready alternate — the same artwork at the same rect on the white ground, where all three words render. Needs a light plaque behind it in a dark bar (the footer already has that pattern in MARK_CHIP).",
  },
];

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

/**
 * CSS render-height CEILING per badge tier (D12 §5.2: "annual badges may
 * grow to roughly 90–112px rendered height on wide desktop; Quarterly
 * badges roughly 64–84px"). The components render at a responsive
 * `clamp()` that never exceeds these numbers, so baking the raster at the
 * ceiling — not the floor — means no viewport ever asks the browser to
 * upscale a served file past what it actually contains.
 */
const ANNUAL_RENDER_HEIGHT = 112;
const QUARTERLY_RENDER_HEIGHT = 84;
/** Retina target. `allowEnlargement: false` below caps this back to a
 *  badge's real source ceiling on the two files that can't supply a true 2x
 *  raster at the new heights — see the per-file sizing note under BADGES. */
const BADGE_DENSITY = 2;
/**
 * Two separate budgets, not one: the PNG is the negotiation SOURCE next/image
 * resizes/re-encodes from at request time (per this file's existing "Sizing"
 * comment on the two components) — a browser only ever downloads it directly
 * as the last-resort fallback for the vanishingly few clients with no AVIF/
 * WebP support. AVIF is what a normal modern browser actually fetches, so it
 * carries the real perf budget; verified at these new D12 dimensions, the
 * three quarterly PNGs land 98–150KB (natural for a 747×168 flat-color
 * banner re-encoded at compressionLevel 9) while every AVIF sibling stays
 * 7–16KB — confirm both numbers in this script's own console report before
 * assuming either.
 */
const BADGE_PNG_MAX_BYTES = 160 * 1024;
const BADGE_AVIF_MAX_BYTES = 24 * 1024;

type BadgeSpec = {
  key: string;
  src: string;
  outBase: string;
  /** D12: which evidence-tier clamp this badge renders at (StatsSection.tsx /
   *  QuarterlyBanners.tsx) — annual (black/gold family) or quarterly (blue
   *  family). Drives which of the two render-height ceilings above applies. */
  tier: "annual" | "quarterly";
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
 *
 * D12 render-ceiling headroom, per file (this is what decides whether
 * `allowEnlargement: false` actually caps anything below):
 *   quarterly masters are the full 1200x270 source (crop: null) — at
 *     QUARTERLY_RENDER_HEIGHT×BADGE_DENSITY = 84×2 = 168px target, 270px of
 *     real source height clears it with room to spare. True 2x retina ships.
 *   annual masters crop to 581x135 — HEIGHT IS UNCHANGED BY THE CROP (only
 *     columns are trimmed), so 135px is the real ceiling. Target would be
 *     ANNUAL_RENDER_HEIGHT×BADGE_DENSITY = 112×2 = 224px, which exceeds it —
 *     `allowEnlargement: false` caps the shipped raster at the source's own
 *     135px instead (≈1.2x of the 112px CSS ceiling, not a full 2x, but a
 *     real ~1.7x resolution gain over this file's PREVIOUS 80px derivative,
 *     with zero upscaling). Confirm the actual shipped height in this
 *     script's own console report before assuming a number.
 */
const BADGES: BadgeSpec[] = [
  {
    key: "powerbroker-q3-2025",
    src: path.join(refSiteDir, "powerbroker-q3-2025.png"),
    outBase: path.join(awardsDir, "powerbroker-q3-2025"),
    tier: "quarterly",
    crop: null,
  },
  {
    key: "powerbroker-q1-2026",
    src: path.join(refSiteDir, "powerbroker-q1-2026.png"),
    outBase: path.join(awardsDir, "powerbroker-q1-2026"),
    tier: "quarterly",
    crop: null,
  },
  {
    key: "powerbroker-q2-2026",
    src: path.join(refSiteDir, "powerbroker-q2-2026.png"),
    outBase: path.join(awardsDir, "powerbroker-q2-2026"),
    tier: "quarterly",
    crop: null,
  },
  {
    key: "costar-top-broker-2025",
    src: path.join(refSiteDir, "US_2025Annual_TopBroker.png"),
    outBase: path.join(awardsDir, "costar-top-broker-2025"),
    tier: "annual",
    crop: [19, 0, 581, 135],
  },
  {
    key: "costar-top-firm-2025",
    src: path.join(refSiteDir, "US_2025Annual_TopFirm.png"),
    outBase: path.join(awardsDir, "costar-top-firm-2025"),
    tier: "annual",
    crop: [19, 0, 581, 135],
  },
];

const CONTACT_SHEET_OUT = path.join(brandDir, "_identity-sheet.jpg");
/** Floor width — the sheet grows past this if a row's real content needs
 *  more room (computed in `buildContactSheet`, never hardcoded past this). */
const SHEET_MIN_WIDTH = 1200;
const SHEET_PAD = 48;
const SHEET_LIGHT_GROUND = "#FBF9F3"; // --paper, gold theme (L2, 2026-08-17 retuned it off the retired Theme-G paper). Blue theme's is #F7F8F5 — close enough to stand in for "a light paper ground", singular, per the brief
const SHEET_DARK_GROUND = "#1A1C1F"; // --dark, both themes (L2, 2026-08-17 retuned it off the retired Theme-G charcoal)
const SHEET_SWATCH_GROUND = "#EDE7D8"; // --rule (guide cream) for the badge row, distinct from both lockup panels so it reads as its own section

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
 *  AVIF. Returns both encoded buffers and the final intrinsic dimensions.
 *
 *  `allowEnlargement` (D12): every PART 1 (lockup) call site omits this, so
 *  it defaults to `true` and produces the exact `withoutEnlargement: false`
 *  argument this function always passed — PART 1's output is unaffected byte-
 *  for-byte. PART 2 (badges) passes `false` explicitly so a badge whose
 *  source can't supply the requested density is capped at its own real
 *  resolution rather than upscaled/blurred past it. */
async function renderAtHeight(
  source: Buffer,
  cssHeight: number,
  density: number,
  options: { allowEnlargement?: boolean } = {},
): Promise<{ png: Buffer; avif: Buffer; width: number; height: number }> {
  const { allowEnlargement = true } = options;
  const targetHeight = Math.round(cssHeight * density);
  const resized = sharp(source).resize({
    height: targetHeight,
    fit: "inside",
    withoutEnlargement: !allowEnlargement,
  });
  const png = await resized.clone().png({ compressionLevel: 9 }).toBuffer();
  const meta = await sharp(png).metadata();
  const avif = await resized.clone().avif({ quality: 68, effort: 6 }).toBuffer();
  return { png, avif, width: meta.width ?? 0, height: meta.height ?? targetHeight };
}

/**
 * Resize a source buffer to an EXACT pixel box and encode PNG + AVIF.
 *
 * `fit: "fill"` is deliberate and is not a distortion risk at the only call
 * site: the box passed in is the base render's own emitted width and height
 * multiplied by the same integer, so the requested aspect is bit-for-bit the
 * base's aspect. "fill" is what makes the output dimensions an assertion
 * rather than a hope — `fit: "inside"` would let a rounding step land on
 * 2x-minus-one-pixel, which is exactly the class of bug X16 was.
 */
async function renderExact(
  source: Buffer,
  width: number,
  height: number,
): Promise<{ png: Buffer; avif: Buffer; width: number; height: number }> {
  const resized = sharp(source).resize({ width, height, fit: "fill" });
  const png = await resized.clone().png({ compressionLevel: 9 }).toBuffer();
  const meta = await sharp(png).metadata();
  const avif = await resized.clone().avif({ quality: 68, effort: 6 }).toBuffer();
  if (meta.width !== width || meta.height !== height) {
    throw new Error(`renderExact produced ${meta.width}x${meta.height}, asked for ${width}x${height}`);
  }
  return { png, avif, width, height };
}

/** Write one PNG+AVIF pair and log both, returning their byte sizes. */
function writePair(
  outBase: string,
  suffix: string,
  render: { png: Buffer; avif: Buffer; width: number; height: number },
): { pngBytes: number; avifBytes: number } {
  const pngPath = `${outBase}${suffix}.png`;
  const avifPath = `${outBase}${suffix}.avif`;
  fs.writeFileSync(pngPath, render.png);
  fs.writeFileSync(avifPath, render.avif);
  for (const f of [pngPath, avifPath]) {
    console.log(`  ${path.relative(siteRoot, f).padEnd(42)} ${render.width}x${render.height}  (${fmtKB(bytes(f))})`);
  }
  return { pngBytes: bytes(pngPath), avifBytes: bytes(avifPath) };
}

type HeaderLockupResult = {
  key: string;
  sourceWidth: number;
  sourceHeight: number;
  croppedWidth: number;
  croppedHeight: number;
  aspect: number;
  base: { width: number; height: number; pngBytes: number; avifBytes: number };
  retina: { width: number; height: number; pngBytes: number; avifBytes: number };
};

type LockupResult = {
  key: string;
  trimmedWidth: number;
  trimmedHeight: number;
  aspect: number;
  renders: { density: number; width: number; height: number; pngBytes: number; avifBytes: number }[];
  /** D26 — the large menu/Trust identity-anchor derivative (`lockup-<key>-xl.*`). */
  xl: { width: number; height: number; pngBytes: number; avifBytes: number };
};

type BadgeResult = {
  key: string;
  tier: "annual" | "quarterly";
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
   PART 0 — the header's linear lockup (R14 / A2)
   =========================================================================== */

async function prepHeaderLockups(): Promise<HeaderLockupResult[]> {
  ensureDir(brandDir);
  const results: HeaderLockupResult[] = [];

  for (const spec of HEADER_LOCKUPS) {
    if (!fs.existsSync(spec.src)) {
      throw new Error(`Missing header-lockup source: ${path.relative(repoRoot, spec.src)}`);
    }
    const meta = await sharp(spec.src).metadata();
    const [left, top, width, height] = spec.crop;
    if ((meta.width ?? 0) < left + width || (meta.height ?? 0) < top + height) {
      throw new Error(
        `LINEAR_CROP ${spec.crop.join(",")} does not fit ${meta.width}x${meta.height} in ${path.basename(spec.src)}`,
      );
    }
    const cropped = await sharp(spec.src).extract({ left, top, width, height }).png().toBuffer();

    const base = await renderAtHeight(cropped, HEADER_LOCKUP_CSS_HEIGHT, LOCKUP_SOURCE_DENSITY);
    const baseBytes = writePair(spec.outBase, "", base);

    const retina = await renderExact(cropped, base.width * RETINA_MULTIPLE, base.height * RETINA_MULTIPLE);
    const retinaBytes = writePair(spec.outBase, `@${RETINA_MULTIPLE}x`, retina);

    console.log(`     ${spec.note}`);

    results.push({
      key: spec.key,
      sourceWidth: meta.width ?? 0,
      sourceHeight: meta.height ?? 0,
      croppedWidth: width,
      croppedHeight: height,
      aspect: width / height,
      base: { width: base.width, height: base.height, ...baseBytes },
      retina: { width: retina.width, height: retina.height, ...retinaBytes },
    });
  }

  return results;
}

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

    // X16: base first (the next/image source), then a genuine 2x of THAT file.
    const renders: LockupResult["renders"] = [];
    const base = await renderAtHeight(trimmed.buffer, LOCKUP_RENDER_HEIGHT, LOCKUP_SOURCE_DENSITY);
    const baseBytes = writePair(spec.outBase, "", base);
    renders.push({ density: LOCKUP_SOURCE_DENSITY, width: base.width, height: base.height, ...baseBytes });

    const retina = await renderExact(
      trimmed.buffer,
      base.width * RETINA_MULTIPLE,
      base.height * RETINA_MULTIPLE,
    );
    const retinaBytes = writePair(spec.outBase, `@${RETINA_MULTIPLE}x`, retina);
    renders.push({
      density: LOCKUP_SOURCE_DENSITY * RETINA_MULTIPLE,
      width: retina.width,
      height: retina.height,
      ...retinaBytes,
    });

    // D26 — the XL menu/Trust identity-anchor derivative. Same trimmed
    // source, same treatment, just a taller bake — see LOCKUP_XL_CSS_HEIGHT.
    const xlRender = await renderAtHeight(trimmed.buffer, LOCKUP_XL_CSS_HEIGHT, LOCKUP_XL_DENSITY);
    const xlPngPath = `${spec.outBase}-xl.png`;
    const xlAvifPath = `${spec.outBase}-xl.avif`;
    fs.writeFileSync(xlPngPath, xlRender.png);
    fs.writeFileSync(xlAvifPath, xlRender.avif);
    console.log(
      `  ${path.relative(siteRoot, xlPngPath).padEnd(34)} ${xlRender.width}x${xlRender.height}  (${fmtKB(bytes(xlPngPath))})`,
    );
    console.log(
      `  ${path.relative(siteRoot, xlAvifPath).padEnd(34)} ${xlRender.width}x${xlRender.height}  (${fmtKB(bytes(xlAvifPath))})`,
    );

    results.push({
      key: spec.key,
      trimmedWidth: trimmed.width,
      trimmedHeight: trimmed.height,
      aspect,
      renders,
      xl: {
        width: xlRender.width,
        height: xlRender.height,
        pngBytes: bytes(xlPngPath),
        avifBytes: bytes(xlAvifPath),
      },
    });
  }

  return results;
}

/* ===========================================================================
   PART 2 — CoStar badges
   =========================================================================== */

async function prepBadges(): Promise<BadgeResult[]> {
  const results: BadgeResult[] = [];

  // PARKED, not deleted — see the 2026-08-17 note in this file's header. The
  // five `Ref/site/` sources were removed by F39/A29 and the approved Winner
  // Badge re-intake belongs to portion P15. A missing source is a skip, not a
  // crash, and `public/awards/` is not even created when nothing will be
  // written into it: another agent owns that directory this round.
  const present = BADGES.filter((spec) => fs.existsSync(spec.src));
  const absent = BADGES.filter((spec) => !fs.existsSync(spec.src));
  for (const spec of absent) {
    console.log(`  SKIP ${spec.key.padEnd(28)} source absent: ${path.relative(repoRoot, spec.src)}`);
  }
  if (present.length === 0) {
    console.log("  no badge sources on disk — PART 2 wrote nothing (P15 owns public/awards/ this round)");
    return results;
  }
  ensureDir(awardsDir);

  for (const spec of present) {
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

    const targetHeight = spec.tier === "annual" ? ANNUAL_RENDER_HEIGHT : QUARTERLY_RENDER_HEIGHT;
    const { png, avif, width, height } = await renderAtHeight(workingBuffer, targetHeight, BADGE_DENSITY, {
      allowEnlargement: false,
    });
    const pngPath = `${spec.outBase}.png`;
    const avifPath = `${spec.outBase}.avif`;
    fs.writeFileSync(pngPath, png);
    fs.writeFileSync(avifPath, avif);

    const pngBytes = bytes(pngPath);
    const avifBytes = bytes(avifPath);
    const pngOver = pngBytes > BADGE_PNG_MAX_BYTES;
    const avifOver = avifBytes > BADGE_AVIF_MAX_BYTES;
    const overBudget = pngOver || avifOver;

    console.log(
      `  ${path.relative(siteRoot, pngPath).padEnd(38)} ${width}x${height}  (${fmtKB(pngBytes)})${pngOver ? `  OVER ${Math.round(BADGE_PNG_MAX_BYTES / 1024)}KB PNG BUDGET` : ""}`,
    );
    console.log(
      `  ${path.relative(siteRoot, avifPath).padEnd(38)} ${width}x${height}  (${fmtKB(avifBytes)})${avifOver ? `  OVER ${Math.round(BADGE_AVIF_MAX_BYTES / 1024)}KB AVIF BUDGET` : ""}`,
    );

    results.push({
      key: spec.key,
      tier: spec.tier,
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

async function buildContactSheet(
  headers: HeaderLockupResult[],
  lockups: LockupResult[],
  badges: BadgeResult[],
): Promise<void> {
  // Re-render each lockup at its literal 1x / 44px CSS height for the sheet —
  // this is what "real 44px render height" looks like with no DPR scaling.
  const lockupOnes: { key: string; png: Buffer; width: number; height: number }[] = [];
  for (const spec of LOCKUPS) {
    const trimmed = await trimToBoundingBox(spec.src, spec.trimBackground, spec.trimThreshold);
    const { png, width, height } = await renderAtHeight(trimmed.buffer, LOCKUP_RENDER_HEIGHT, 1);
    lockupOnes.push({ key: spec.key, png, width, height });
  }

  // PART 0 — the header's linear derivatives, at their literal 1x CSS height,
  // on the charcoal bar they actually sit in. This row is the whole point of
  // the sheet this round: it is where the on-charcoal master's missing
  // COMMERCIAL is visible at a glance (LINEAR_CHARCOAL_DEFECT).
  const headerOnes: { key: string; png: Buffer; width: number; height: number }[] = [];
  for (const spec of HEADER_LOCKUPS) {
    const [left, top, width, height] = spec.crop;
    const cropped = await sharp(spec.src).extract({ left, top, width, height }).png().toBuffer();
    const r = await renderAtHeight(cropped, HEADER_LOCKUP_CSS_HEIGHT, 1);
    headerOnes.push({ key: spec.key, png: r.png, width: r.width, height: r.height });
  }

  const badgeOnes: { key: string; png: Buffer; width: number; height: number }[] = [];
  for (const spec of BADGES.filter((b) => fs.existsSync(b.src))) {
    let working = sharp(spec.src);
    if (spec.crop) {
      const [left, top, width, height] = spec.crop;
      working = working.extract({ left, top, width, height });
    }
    const buf = await working.png().toBuffer();
    const targetHeight = spec.tier === "annual" ? ANNUAL_RENDER_HEIGHT : QUARTERLY_RENDER_HEIGHT;
    const { png, width, height } = await renderAtHeight(buf, targetHeight, 1, { allowEnlargement: false });
    badgeOnes.push({ key: spec.key, png, width, height });
  }

  // D26 — the XL lockup derivatives, re-rendered here at their literal 1x /
  // 320px CSS height for the sheet, same "no DPR scaling" convention as the
  // two 44px lockup panels above.
  const lockupXlOnes: { key: string; png: Buffer; width: number; height: number }[] = [];
  for (const spec of LOCKUPS) {
    const trimmed = await trimToBoundingBox(spec.src, spec.trimBackground, spec.trimThreshold);
    const { png, width, height } = await renderAtHeight(trimmed.buffer, LOCKUP_XL_CSS_HEIGHT, 1);
    lockupXlOnes.push({ key: spec.key, png, width, height });
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

  const headerCaptions = headerOnes.map((h) => `lockup-${h.key}  ${h.width}x${h.height}px`);
  const headerLayout = layoutRow(
    headerOnes.map((h, i) => ({ width: h.width, caption: headerCaptions[i] })),
    16,
  );
  const lockupCaptions = lockupOnes.map((l) => `lockup-${l.key}  ${l.width}x${l.height}px`);
  const badgeCaptions = badgeOnes.map((b) => `${b.key}  ${b.width}x${b.height}px`);
  const lockupXlCaptions = lockupXlOnes.map((l) => `lockup-${l.key}-xl  ${l.width}x${l.height}px`);
  const lockupLayout = layoutRow(
    lockupOnes.map((l, i) => ({ width: l.width, caption: lockupCaptions[i] })),
    16,
  );
  const badgeLayout = layoutRow(
    badgeOnes.map((b, i) => ({ width: b.width, caption: badgeCaptions[i] })),
    14,
  );
  const lockupXlLayout = layoutRow(
    lockupXlOnes.map((l, i) => ({ width: l.width, caption: lockupXlCaptions[i] })),
    16,
  );

  const sheetWidth = Math.max(
    SHEET_MIN_WIDTH,
    headerLayout.rowWidth,
    lockupLayout.rowWidth,
    badgeLayout.rowWidth,
    lockupXlLayout.rowWidth,
  );

  /** Tallest item in a row, or 0 for an empty row — `Math.max()` with no
   *  arguments is -Infinity, which would poison every downstream height the
   *  moment PART 2 is parked. */
  const rowHeight = (items: { height: number }[]) =>
    items.length === 0 ? 0 : Math.max(...items.map((i) => i.height)) + captionH;

  const headerRowH = rowHeight(headerOnes);
  const lockupRowH = rowHeight(lockupOnes);
  const badgeRowH = rowHeight(badgeOnes);
  const lockupXlRowH = rowHeight(lockupXlOnes);

  const panel0H = SHEET_PAD * 2 + panelLabelH + headerRowH;
  const panel1H = SHEET_PAD * 2 + panelLabelH + lockupRowH;
  const panel2H = panel1H;
  // Panel 3 collapses to nothing when the badge sources are absent.
  const panel3H = badgeOnes.length === 0 ? 0 : SHEET_PAD * 2 + panelLabelH + badgeRowH;
  const panel4H = SHEET_PAD * 2 + panelLabelH + lockupXlRowH;

  const totalH = panel0H + panel1H + panel2H + panel3H + panel4H;

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

  // Panel 0 — the header bar. Charcoal ground, the two linear derivatives at
  // their real 52px CSS render height.
  await panel(
    SHEET_DARK_GROUND,
    `HEADER BAR — ${SHEET_DARK_GROUND}  ·  linear lockups @ real ${HEADER_LOCKUP_CSS_HEIGHT}px CSS height (1x)`,
    "#F5F1E8",
    panel0H,
    y,
  );
  {
    const rowY = y + SHEET_PAD + panelLabelH;
    headerOnes.forEach((h, i) => {
      composites.push({ input: h.png, left: headerLayout.x[i], top: rowY });
      composites.push({
        input: labelSvg(headerCaptions[i], 520, "#D0C9BC", 16),
        left: headerLayout.x[i],
        top: rowY + h.height + 4,
      });
    });
  }
  y += panel0H;

  // Panel 1 — light paper ground, both lockups.
  await panel(SHEET_LIGHT_GROUND, `LIGHT GROUND — ${SHEET_LIGHT_GROUND}  ·  stacked lockups @ real ${LOCKUP_RENDER_HEIGHT}px CSS height (1x)`, "#1A1C1F", panel1H, y);
  {
    const rowY = y + SHEET_PAD + panelLabelH;
    lockupOnes.forEach((l, i) => {
      composites.push({ input: l.png, left: lockupLayout.x[i], top: rowY });
      composites.push({
        input: labelSvg(lockupCaptions[i], 400, "#4A4D52", 16),
        left: lockupLayout.x[i],
        top: rowY + l.height + 4,
      });
    });
  }
  y += panel1H;

  // Panel 2 — dark ground, both lockups.
  await panel(SHEET_DARK_GROUND, `DARK GROUND — ${SHEET_DARK_GROUND}  ·  stacked lockups @ real ${LOCKUP_RENDER_HEIGHT}px CSS height (1x)`, "#F5F1E8", panel2H, y);
  {
    const rowY = y + SHEET_PAD + panelLabelH;
    lockupOnes.forEach((l, i) => {
      composites.push({ input: l.png, left: lockupLayout.x[i], top: rowY });
      composites.push({
        input: labelSvg(lockupCaptions[i], 400, "#D0C9BC", 16),
        left: lockupLayout.x[i],
        top: rowY + l.height + 4,
      });
    });
  }
  y += panel2H;

  // Panel 3 — badges row. Omitted entirely when PART 2 is parked.
  if (badgeOnes.length > 0) {
    await panel(
      SHEET_SWATCH_GROUND,
      `AWARD BADGES  ·  D12 tier ceilings, 1x — annual ${ANNUAL_RENDER_HEIGHT}px / quarterly ${QUARTERLY_RENDER_HEIGHT}px`,
      "#1A1C1F",
      panel3H,
      y,
    );
    const rowY = y + SHEET_PAD + panelLabelH;
    badgeOnes.forEach((b, i) => {
      composites.push({ input: b.png, left: badgeLayout.x[i], top: rowY });
      composites.push({
        input: labelSvg(badgeCaptions[i], 400, "#4A4D52", 14),
        left: badgeLayout.x[i],
        top: rowY + b.height + 4,
      });
    });
    y += panel3H;
  }

  // Panel 4 — D26 XL lockup derivatives, light ground (the menu brand panel
  // and Trust's identity anchor both sit on a paper/theme-surface ground —
  // see MenuOverlay's own header for the surface choice), real 320px CSS
  // height (1x), no DPR scaling.
  await panel(
    SHEET_LIGHT_GROUND,
    `XL LOCKUP (D26 menu/Trust identity anchor) — real ${LOCKUP_XL_CSS_HEIGHT}px CSS height (1x)`,
    "#1A1C1F",
    panel4H,
    y,
  );
  {
    const rowY = y + SHEET_PAD + panelLabelH;
    lockupXlOnes.forEach((l, i) => {
      composites.push({ input: l.png, left: lockupXlLayout.x[i], top: rowY });
      composites.push({
        input: labelSvg(lockupXlCaptions[i], 400, "#4A4D52", 16),
        left: lockupXlLayout.x[i],
        top: rowY + l.height + 4,
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
  for (const spec of HEADER_LOCKUPS) {
    const [left, top, width, height] = spec.crop;
    const cropped = await sharp(spec.src).extract({ left, top, width, height }).png().toBuffer();
    const { png } = await renderAtHeight(cropped, HEADER_LOCKUP_CSS_HEIGHT, 1);
    const p = path.join(outDir, `${spec.key}-${HEADER_LOCKUP_CSS_HEIGHT}px.png`);
    fs.writeFileSync(p, png);
    out.push({ key: spec.key, path: p });
  }
  for (const spec of LOCKUPS) {
    const trimmed = await trimToBoundingBox(spec.src, spec.trimBackground, spec.trimThreshold);
    const { png } = await renderAtHeight(trimmed.buffer, LOCKUP_RENDER_HEIGHT, 1);
    const p = path.join(outDir, `${spec.key}-${LOCKUP_RENDER_HEIGHT}px.png`);
    fs.writeFileSync(p, png);
    out.push({ key: spec.key, path: p });
  }
  return out;
}

/* ===========================================================================
   main
   =========================================================================== */

async function main(): Promise<void> {
  console.log("PART 0 — header linear lockups (R14 / A2)");
  const headers = await prepHeaderLockups();

  console.log("\nPART 1 — stacked lockups (D1: footer brand cluster + Trust anchor)");
  const lockups = await prepLockups();

  console.log("\nPART 2 — CoStar award badges (D3)");
  const badges = await prepBadges();

  console.log("\nlegibility-check renders (1x, for manual read — not shipped UI assets)");
  const legibility = await legibilityRenders();
  for (const l of legibility) console.log(`  ${l.path}`);

  console.log("\nPART 3 — contact sheet");
  await buildContactSheet(headers, lockups, badges);

  console.log("\n── summary ──────────────────────────────────────────────────────────────");
  for (const h of headers) {
    const exact =
      h.retina.width === h.base.width * RETINA_MULTIPLE && h.retina.height === h.base.height * RETINA_MULTIPLE;
    console.log(
      `  lockup-${h.key}: source ${h.sourceWidth}x${h.sourceHeight} -> crop ${h.croppedWidth}x${h.croppedHeight} (aspect ${h.aspect.toFixed(4)}) -> base ${h.base.width}x${h.base.height} @${LOCKUP_SOURCE_DENSITY}x of ${HEADER_LOCKUP_CSS_HEIGHT}px CSS, @2x ${h.retina.width}x${h.retina.height} [${exact ? "exactly 2x base" : "** NOT 2x **"}]  png=${fmtKB(h.base.pngBytes)}/${fmtKB(h.retina.pngBytes)} avif=${fmtKB(h.base.avifBytes)}/${fmtKB(h.retina.avifBytes)}`,
    );
  }
  if (LINEAR_CHARCOAL_DEFECT) {
    console.log(
      "  ** lockup-linear-header (the R14 primary) is cut from a master whose COMMERCIAL is #1A1C1F on #1A1C1F and therefore does not render. See LINEAR_CHARCOAL_DEFECT. **",
    );
  }
  for (const l of lockups) {
    const base = l.renders[0];
    const retina = l.renders[1];
    const exact = retina.width === base.width * RETINA_MULTIPLE && retina.height === base.height * RETINA_MULTIPLE;
    console.log(
      `  lockup-${l.key}: trimmed ${l.trimmedWidth}x${l.trimmedHeight}  aspect ${l.aspect.toFixed(4)}  → at ${LOCKUP_RENDER_HEIGHT}px CSS height, width ≈ ${Math.round(LOCKUP_RENDER_HEIGHT * l.aspect)}px`,
    );
    console.log(
      `  lockup-${l.key}: base ${base.width}x${base.height} (@${LOCKUP_SOURCE_DENSITY}x), @2x ${retina.width}x${retina.height} [${exact ? "exactly 2x base" : "** NOT 2x **"}]`,
    );
    console.log(
      `  lockup-${l.key}-xl: ${l.xl.width}x${l.xl.height} (D26, ~${LOCKUP_XL_CSS_HEIGHT}px CSS height x${LOCKUP_XL_DENSITY})  png=${fmtKB(l.xl.pngBytes)} avif=${fmtKB(l.xl.avifBytes)}`,
    );
  }
  for (const b of badges) {
    const ceiling = b.tier === "annual" ? ANNUAL_RENDER_HEIGHT : QUARTERLY_RENDER_HEIGHT;
    const achievedDensity = (b.height / ceiling).toFixed(2);
    console.log(
      `  ${b.key} [${b.tier}]: source ${b.sourceWidth}x${b.sourceHeight} → cropped ${b.croppedWidth}x${b.croppedHeight} → shipped ${b.width}x${b.height} (target ceiling ${ceiling}px CSS × ${BADGE_DENSITY} → achieved ${achievedDensity}x density)  png=${fmtKB(b.pngBytes)} avif=${fmtKB(b.avifBytes)}${b.overBudget ? "  ** OVER BUDGET **" : ""}`,
    );
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
