/**
 * components/awards/QuarterlyBanners.tsx — all five CoStar evidence rasters
 * for the `#stats` Trust Metrics proof wall: the two 2025 Annual badges
 * (`AnnualBadges`) and the three Quarterly Deals banners (`QuarterlyBanners`).
 *
 * Governed by docs/DESIGN-REVISIT-2.md D12/§5.2 ("Trust is one proof wall"),
 * hokuten-design-director ref 06 (Verified claims register). Both exports
 * are Server Components — zero client JS.
 *
 * ── DESIGN REVISIT 2 (2026-08-10) — consolidation, supersedes D3 ───────────
 * D3 (Design Revisit 1) split these five badges across two sections: three
 * Quarterly banners here in `#stats`, two Annual badges in a separate
 * `RecognitionStrip` mounted inside `#closings`. D12 explicitly supersedes
 * that split: "all five CoStar awards now belong in Trust Metrics and
 * nowhere else." `RecognitionStrip.tsx` is deleted (this agent's file, per
 * task brief) and its two Annual badges move into this file as a new
 * `AnnualBadges` export, sitting beside the `QuarterlyBanners` export that
 * already lived here — one file for the whole evidence family, imported
 * twice by `StatsSection.tsx`. `ClosingsSection.tsx` still imports the now-
 * deleted `RecognitionStrip` — that import must be removed by whoever owns
 * that file (reported in this agent's return value; `ClosingsSection.tsx`
 * is out of this agent's assigned-files scope).
 *
 * Evidence gate (ref 06, "Verified claims register"): all five rows already
 * exist and are `verified-current` — this file renders five EXISTING
 * registered claims' badge assets; it introduces no new claim.
 *
 * ── These are official third-party marks: rendered as-is, never a link ─────
 * No recolour, no crop into the artwork, no coloured backing chip, no
 * aspect-ratio change, no border/radius/shadow/"seat" — any of those breaks
 * CoStar's badge usage terms. D12 is explicit that the previous bordered
 * `bg-card` + `shadow-chip` "seat" IS the defect this round corrects: these
 * five images now render bare, distinguished from each other only by two
 * ROWS and MICRO-LABELS (the family split below), never by a box. Neither
 * export wraps its `<li>` in an `<a>` — evidence, not navigation.
 *
 * ── Sizing (D12 §5.2; RETUNED D27, 2026-08-10 evening) ──────────────────────
 * D3's flat "~40px everywhere" target is gone. Each tier renders at a
 * responsive CSS `clamp()` — never a hard-coded universal size — that grows
 * on wide desktop and holds a smaller floor below `lg`, so neither family
 * ever risks overflowing a narrow viewport:
 *   Annual (black/gold family):  h-16 (64px) below `lg`,
 *     clamp(5.625rem, 3.5rem + 4vw, 7rem) — 90–112px — at `lg` and above.
 *   Quarterly (blue family):     h-12 (48px) below `lg`,
 *     clamp(4rem, 3rem + 2.75vw, 5.25rem) — 64–84px — at `lg` and above.
 * Neither tier's own MIN/MAX bound moved — 112px/84px were already the D12
 * ceiling, "approved" from day one. What D27 changes is the `vw`
 * coefficient (the middle, PREFERRED-value term), i.e. how fast each tier
 * climbs toward that already-approved ceiling.
 *
 * **D27 (Razim, 2026-08-10 evening) — "a lot of empty spaces… if fit to the
 * screen then fine."** The D12-era coefficients (`3rem + 3vw` / `2rem +
 * 2vw`) were tuned so the ceiling landed around 1920–2560px — this file's
 * own prior note recorded that AT THE EXPLICIT 1440×900 ACCEPTANCE TARGET
 * both tiers sat near their FLOOR (annual ≈91px, quarterly clamped to the
 * 64px floor outright) — i.e. exactly the dead lower field Razim flagged.
 * The fix is not a new ceiling (112px/84px stay the approved cap, unchanged
 * — still bare rasters, still no upscale past source resolution per the
 * `identity-prep.ts` note below) but a STEEPER climb: `3.5rem + 4vw` reaches
 * the 112px annual cap at exactly 1400px viewport width; `3rem + 2.75vw`
 * reaches the 84px quarterly cap at exactly 1309px. Both are therefore AT
 * their full ceiling by 1440×900 — "toward the top of the range," per the
 * D27 brief, not merely eventually-at-4K. At `lg` (1024px, the tightest
 * width this tier ever renders at): annual ≈97px, quarterly ≈76px — both
 * comfortably inside the original 90–112px / 64–84px bounds, so the D12
 * floor-side promise ("neither family ever risks overflowing a narrow
 * viewport") is unchanged; only the desktop-side growth rate moved.
 * `StatsSection.tsx` (this file's sole caller) re-budgets its own row
 * spacing against these larger evidence-field rasters — see that file's own
 * D27 note for the full `#stats` fit math at 1440×900.
 * `identity-prep.ts` was extended (D12, this agent) to emit each tier's
 * raster at its own render-height CEILING so no viewport ever asks the
 * browser to upscale a served file:
 *   Quarterly masters (full 1200×270 source): true 2x retina at the 84px
 *     ceiling → shipped 747×168 (verified via the script's own console
 *     report, 2026-08-10).
 *   Annual masters (581×135 after the existing letterbox crop — crop is
 *     UNCHANGED, only the render target grew): the source cannot supply a
 *     full 2x raster at the 112px ceiling (that would need 224px; the crop
 *     is 135px tall) — `allowEnlargement: false` in the script caps the
 *     shipped raster at the source's own 581×135 rather than upscale past
 *     it. That is a real ~1.7x resolution gain over the old 40px-target
 *     derivative (was 80px tall), at ~1.21x effective density against the
 *     112px ceiling, with zero enlargement/blur.
 * `next/image` points at each `.png`; per `content/artwork.ts`'s documented
 * `getArt()` reasoning, Next's optimizer negotiates AVIF/WebP from that
 * source at request time, so the sibling `.avif` files need no separate
 * `<picture>` wiring here (same reasoning this file already carried for
 * the Quarterly trio pre-consolidation).
 * The intrinsic `width`/`height` passed to `next/image` are each raster's
 * REAL shipped pixel size (747×168 / 581×135) — required for CLS-zero
 * `next/image`, and distinct from the CSS `h-*`/`clamp()` classes that
 * control the actually-rendered box; only `w-auto` is set alongside
 * `h-*`, so the browser derives width from the intrinsic aspect ratio
 * rather than from a second, independently-specified number that could
 * silently drift from it.
 */

import Image from "next/image";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Shared render-size classes — the D12 §5.2 clamp per tier (see file header).
   Applied to next/image's className: h-* (mobile/tablet floor) + lg:h-[clamp]
   (wide-desktop ceiling), always paired with w-auto so width follows the
   image's own intrinsic aspect ratio rather than a second hard-coded number.
   --------------------------------------------------------------------------- */
const ANNUAL_SIZE_CLASSES = "h-16 w-auto shrink-0 lg:h-[clamp(5.625rem,3.5rem+4vw,7rem)]";
const QUARTERLY_SIZE_CLASSES = "h-12 w-auto shrink-0 lg:h-[clamp(4rem,3rem+2.75vw,5.25rem)]";

/* ---------------------------------------------------------------------------
   AnnualBadges — the two 2025 Annual Awards badges (black/gold family).
   --------------------------------------------------------------------------- */

/** Every delivered Annual raster is this exact shipped size (identity-prep.ts
 *  console report, 2026-08-10 — see file header "Sizing" note). */
const ANNUAL_WIDTH = 581;
const ANNUAL_HEIGHT = 135;

type AnnualBadge = {
  id: string;
  src: string;
  /** Real alt text naming the award — never the treatment. */
  alt: string;
};

/** The two registered Annual wins (ref 06). Filenames are the asset paths
 *  themselves, not a restated claim. */
const ANNUAL_BADGES: AnnualBadge[] = [
  {
    id: "top-broker",
    src: "/awards/costar-top-broker-2025.png",
    alt: "CoStar Power Broker Award, 2025 Annual Awards, Winner: Top Broker",
  },
  {
    id: "top-firm",
    src: "/awards/costar-top-firm-2025.png",
    alt: "CoStar Power Broker Award, 2025 Annual Awards, Winner: Top Firm",
  },
];

export type AnnualBadgesProps = {
  className?: string;
};

/** D12: "Annual pair large and centered." */
export function AnnualBadges({ className }: AnnualBadgesProps) {
  return (
    <ul
      role="list"
      aria-label="CoStar Power Broker, 2025 Annual Award wins"
      className={cn("flex flex-wrap items-center justify-center gap-8 sm:gap-10", className)}
    >
      {ANNUAL_BADGES.map((badge) => (
        <li key={badge.id}>
          <Image
            src={badge.src}
            alt={badge.alt}
            width={ANNUAL_WIDTH}
            height={ANNUAL_HEIGHT}
            sizes="(min-width: 1280px) 480px, (min-width: 640px) 380px, 280px"
            draggable={false}
            className={ANNUAL_SIZE_CLASSES}
          />
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------------------
   QuarterlyBanners — the three Quarterly Deals banners (blue family).
   --------------------------------------------------------------------------- */

/** Every delivered Quarterly raster is this exact shipped size
 *  (identity-prep.ts console report, 2026-08-10). */
const QUARTERLY_WIDTH = 747;
const QUARTERLY_HEIGHT = 168;

type QuarterlyBanner = {
  quarter: string;
  src: string;
  /** Real alt text naming the award — never the treatment. */
  alt: string;
};

/**
 * The three registered Quarterly wins (ref 06). Filenames and quarter labels
 * here are the asset paths themselves, not a restated claim — the underlying
 * figures (`stat.value`/`stat.detail` for the "CoStar Power Broker" row)
 * still come from `@/content/stats` wherever they render as text; this table
 * exists only to pair each already-registered win with its own badge image.
 */
const QUARTERLY_BANNERS: QuarterlyBanner[] = [
  {
    quarter: "Q3 2025",
    src: "/awards/powerbroker-q3-2025.png",
    alt: "CoStar Power Broker, Quarterly Deals winner, Q3 2025",
  },
  {
    quarter: "Q1 2026",
    src: "/awards/powerbroker-q1-2026.png",
    alt: "CoStar Power Broker, Quarterly Deals winner, Q1 2026",
  },
  {
    quarter: "Q2 2026",
    src: "/awards/powerbroker-q2-2026.png",
    alt: "CoStar Power Broker, Quarterly Deals winner, Q2 2026",
  },
];

export type QuarterlyBannersProps = {
  className?: string;
};

/** D12: "Quarterly trio immediately below" the Annual pair. */
export function QuarterlyBanners({ className }: QuarterlyBannersProps) {
  return (
    <ul
      role="list"
      aria-label="CoStar Power Broker, Quarterly Deals wins"
      className={cn("flex flex-wrap items-center justify-center gap-5 sm:gap-6", className)}
    >
      {QUARTERLY_BANNERS.map((banner) => (
        <li key={banner.quarter}>
          <Image
            src={banner.src}
            alt={banner.alt}
            width={QUARTERLY_WIDTH}
            height={QUARTERLY_HEIGHT}
            sizes="(min-width: 1280px) 380px, (min-width: 640px) 300px, 220px"
            draggable={false}
            className={QUARTERLY_SIZE_CLASSES}
          />
        </li>
      ))}
    </ul>
  );
}
