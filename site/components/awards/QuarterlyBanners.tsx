/**
 * components/awards/QuarterlyBanners.tsx — the five CoStar Winner Badge
 * medallions for the `#stats` Trust Metrics proof wall, in the two groups the
 * evidence actually splits into: `IndividualAwardBadges` (the four wins
 * attributed to Dino Monteverde) and `PriorFirmAwardBadge` (the 2025 Annual
 * Top Firm graphic, which is prior-firm/team recognition and never an
 * individual award).
 *
 * Governed by docs/LAUNCH-IMPLEMENTATION.md §3.3 (the 4 + 1 split, D16/D17),
 * docs/DESIGN-REVISIT-2.md D12/§5.2 ("Trust is one proof wall"), and
 * hokuten-design-director ref 06 (Verified claims register). Both exports are
 * Server Components — zero client JS.
 *
 * ── LAUNCH 2026-08-17 — TWO changes land together, and they depend on each
 *    other ────────────────────────────────────────────────────────────────
 *
 * **1. The artwork changed shape (P15/F38).** What shipped before were resized
 * CoStar EMAIL-SIGNATURE banners — 581 × 135 and 747 × 168 letterboxes, which the
 * CoStar README marks "Not for website use", and one of which was the
 * README-excluded prior-firm file. Those are replaced by the approved Social
 * Media Kit **Winner Badges**, which are near-SQUARE medallions:
 *   Annual family (Top Broker, Top Firm) — 355 × 333 (≈1.07:1)
 *   Quarterly family (Q3 2025, Q1 2026, Q2 2026) — 448 × 448 (1:1)
 * Every hard-coded 747 × 168 / 581 × 135 geometry in the previous revision of
 * this file is therefore gone: a medallion cannot be dropped into a banner
 * slot. Intrinsic `width`/`height` are now per-badge (the two families no
 * longer share one number) and are each raster's REAL shipped pixel size, as
 * `next/image` requires for CLS-zero rendering; the CSS `h-*`/`clamp()`
 * classes below control the actually-rendered box, and only `w-auto` is set
 * beside them so the browser derives width from the intrinsic aspect ratio
 * rather than from a second number that could silently drift from it.
 *
 * **2. The grouping changed (§3.3, the 4 + 1 split).** The previous exports
 * were `AnnualBadges` (Top Broker AND Top Firm together) + `QuarterlyBanners`
 * (the three quarters) — a split by GRAPHIC FAMILY that merged an individual
 * award and a prior-firm award into one row, which is exactly the conflation
 * `V2` §2 bullet 2 forbids. The split is now by ATTRIBUTION:
 *   `IndividualAwardBadges` — 2025 Annual Top Broker + the three dated
 *     Quarterly Deals wins, four across on desktop, two across below `lg`.
 *   `PriorFirmAwardBadge` — the 2025 Annual Top Firm graphic ALONE, rendered
 *     AFTER the strip, in its own block, at its own smaller size, with its
 *     own caption (`content/stats.ts`'s `costarPriorFirmCaption`, the
 *     complete `V2` line 23 including the qualifier the short form drops).
 * The two are never merged and the Top Firm graphic is never counted as a
 * fifth individual award. `StatsSection.tsx` composes the captions and the
 * verification link; this file renders artwork only.
 *
 * Evidence gate (ref 06): all five rows already exist and are
 * `verified-current` — this file renders five EXISTING registered claims'
 * badge assets and introduces no new claim. Per D17 the Claims & Coverage
 * Register v1.1 was never delivered, so the alt text below is the plan's
 * §3.3 reconstruction sourced from `V2` §2's approved wording; re-checking it
 * against the register when it arrives is post-push item G7.
 *
 * ── These are official third-party marks: rendered as-is, never a link ─────
 * No recolour, no crop into the artwork, no coloured backing chip, no
 * aspect-ratio change, no border/radius/shadow/"seat" — any of those breaks
 * CoStar's badge usage terms, and D12 is explicit that the old bordered
 * `bg-card` + `shadow-chip` "seat" IS the defect that round corrected. The
 * badges render bare, distinguished only by their two groups and the
 * micro-label/caption text `StatsSection` sets around them, never by a box.
 * Neither export wraps its image in an `<a>` — evidence, not navigation. The
 * one legitimate link (D27) is `StatsSection`'s separate mono text line to
 * the public costarpowerbrokers.com directory.
 *
 * ── Sizing ─────────────────────────────────────────────────────────────────
 * Both groups keep D27's shape — a fixed floor below `lg`, a `clamp()` above
 * it calibrated to reach its ceiling AT the 1440×900 acceptance viewport
 * rather than deep in 4K territory — retuned for square artwork:
 *   Individual strip: 80px below `lg`; clamp(96px … 112px) at `lg`+, the
 *     ceiling reached at exactly 1440px viewport width.
 *   Prior-firm block: 64px below `lg`; clamp(72px … 88px) at `lg`+, same
 *     1440px arrival, deliberately the smaller of the two so the secondary
 *     attribution never out-weighs the four individual wins.
 * Neither ceiling asks the browser to upscale: the served rasters are 333px
 * and 448px tall, i.e. ≥3× the 112px/88px render heights.
 * `next/image` points at each `.png`; per `content/artwork.ts`'s documented
 * `getArt()` reasoning, Next's optimizer negotiates AVIF/WebP from that
 * source at request time, so the sibling `.avif` files need no separate
 * `<picture>` wiring here.
 */

import Image from "next/image";
import { cn } from "@/lib/utils";

/** Rendered box for the four individual wins. `w-auto` beside `h-*` keeps the
 *  browser deriving width from each raster's own intrinsic aspect ratio — the
 *  two families in this strip are 1.07:1 and 1:1, so a single hard-coded width
 *  would distort one of them. Ceiling (7rem) is reached at 1440px viewport
 *  width; see the file header. */
const INDIVIDUAL_SIZE_CLASSES = "h-20 w-auto shrink-0 lg:h-[clamp(6rem,3.54rem+3.85vw,7rem)]";

/** Rendered box for the prior-firm/team graphic — the same 3.85vw slope, a
 *  lower floor and ceiling (72–88px). */
const PRIOR_FIRM_SIZE_CLASSES = "h-16 w-auto shrink-0 lg:h-[clamp(4.5rem,2.04rem+3.85vw,5.5rem)]";

type AwardBadge = {
  id: string;
  src: string;
  /** Real shipped pixel size of the raster at `src` — per badge, because the
   *  Annual (355 × 333) and Quarterly (448 × 448) Winner Badges are not the same
   *  size. Verified against `site/public/awards/` on 2026-08-17. */
  width: number;
  height: number;
  /** Real alt text naming the award and its period — never the treatment.
   *  Plan §3.3's approved table (D17 fallback). */
  alt: string;
};

/* ---------------------------------------------------------------------------
   IndividualAwardBadges — the four wins attributed to Dino Monteverde.
   --------------------------------------------------------------------------- */

/** Order is the approved caption's own order (`content/stats.ts`'s
 *  `costarRecognitionCaption`): the Annual Top Broker award first, then the
 *  three Quarterly Deals wins oldest to newest. */
const INDIVIDUAL_AWARD_BADGES: AwardBadge[] = [
  {
    id: "top-broker-2025",
    src: "/awards/costar-top-broker-2025.png",
    width: 355,
    height: 333,
    alt:
      "CoStar Power Broker Award — 2025 Annual Awards — Winner, Top Broker",
  },
  {
    id: "q3-2025",
    src: "/awards/powerbroker-q3-2025.png",
    width: 448,
    height: 448,
    alt:
      "CoStar Power Broker Award — Quarterly Deals — Winner, Q3 2025",
  },
  {
    id: "q1-2026",
    src: "/awards/powerbroker-q1-2026.png",
    width: 448,
    height: 448,
    alt:
      "CoStar Power Broker Award — Quarterly Deals — Winner, Q1 2026",
  },
  {
    id: "q2-2026",
    src: "/awards/powerbroker-q2-2026.png",
    width: 448,
    height: 448,
    alt:
      "CoStar Power Broker Award — Quarterly Deals — Winner, Q2 2026",
  },
];

/** The 2025 Annual Top Firm graphic. Its alt text carries the attribution
 *  qualifier inline, so a screen-reader user gets it from the image itself
 *  and not only from the visible caption beside it. */
const PRIOR_FIRM_AWARD_BADGE: AwardBadge = {
  id: "top-firm-2025",
  src: "/awards/costar-top-firm-2025.png",
  width: 355,
  height: 333,
  alt:
    "CoStar Power Broker Award — 2025 Annual Awards — Winner, Top Firm. Prior-firm and team recognition; not an individual award.",
};

export type AwardBadgesProps = {
  className?: string;
};

/**
 * §3.3 layout: "four individual badges as a four-column desktop / two-column
 * tablet-phone strip". A grid rather than a wrapping flex row, so the two-up
 * and four-up counts are exact at every width instead of depending on how the
 * medallions happen to wrap.
 */
export function IndividualAwardBadges({ className }: AwardBadgesProps) {
  return (
    <ul
      role="list"
      aria-label="CoStar Power Broker award wins"
      className={cn(
        "grid grid-cols-2 place-items-center gap-6 sm:gap-8 lg:grid-cols-4 lg:gap-10",
        className,
      )}
    >
      {INDIVIDUAL_AWARD_BADGES.map((badge) => (
        <li key={badge.id}>
          <Image
            src={badge.src}
            alt={badge.alt}
            width={badge.width}
            height={badge.height}
            sizes="(min-width: 1024px) 128px, 96px"
            draggable={false}
            className={INDIVIDUAL_SIZE_CLASSES}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * The 2025 Annual Top Firm graphic, alone, in its own block AFTER the strip
 * (§3.3 / D16). Not a list — one item is not a list, and wrapping it in the
 * same `<ul>` device the strip uses is precisely the visual merge the
 * attribution split exists to prevent. `StatsSection` renders
 * `costarPriorFirmCaption` beneath it.
 */
export function PriorFirmAwardBadge({ className }: AwardBadgesProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <Image
        src={PRIOR_FIRM_AWARD_BADGE.src}
        alt={PRIOR_FIRM_AWARD_BADGE.alt}
        width={PRIOR_FIRM_AWARD_BADGE.width}
        height={PRIOR_FIRM_AWARD_BADGE.height}
        sizes="(min-width: 1024px) 96px, 72px"
        draggable={false}
        className={PRIOR_FIRM_SIZE_CLASSES}
      />
    </div>
  );
}
