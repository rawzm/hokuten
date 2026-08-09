/**
 * components/awards/QuarterlyBanners.tsx — the three CoStar Power Broker
 * "Quarterly Deals" winner banners, rendered as evidence beneath the `#stats`
 * "3×" numeral. New this round (DESIGN-REVISIT.md §4.4, D3).
 *
 * Evidence gate (ref 06, "Verified claims register"): "CoStar Power Broker
 * Quarterly Deals | Q3 2025 · Q1 2026 · Q2 2026 | `verified-current`" already
 * has a row — this component renders an EXISTING registered claim's badge
 * assets, it does not introduce a new one. The two 2025 ANNUAL badges
 * (`costar-top-broker-2025` / `costar-top-firm-2025`) are a separate,
 * separately-registered claim assigned to a different agent's `#closings`
 * recognition strip — deliberately absent here so neither moment is congested
 * (task brief §2). Do not add them to this file.
 *
 * ── These are official third-party marks: rendered as-is, never a link ─────
 * No recolour, no crop, no coloured backing chip, no aspect-ratio change —
 * any of those breaks CoStar's badge usage terms. `next/image` is used
 * directly (not `PhotoFrame`): `PhotoFrame`'s `photo-reveal` grayscale→colour
 * hover treatment and its `rounded-none`/`aspect-*` cropping are both built
 * for HOTEL PHOTOGRAPHY, and applying either to a vendor badge would violate
 * "render as-is" on the first hover. These badges are not inside an `<a>` —
 * they are evidence, not navigation (task brief: "NOT links").
 *
 * ── The honest inconsistency, and the deliberate treatment for it ──────────
 * The three source files are NOT visually matched: `powerbroker-q3-2025.png`
 * is CoStar's solid dark-blue banner layout (WINNER badge lower-left); the
 * two 2026 files are CoStar's later light-blue banner layout (WINNER upper-
 * right). Left to sit bare in a row, three differently-coloured, differently-
 * laid-out rectangles read as three mismatched fragments, not one body of
 * evidence. The fix does not touch a single pixel of any badge (forbidden
 * above) — each one instead sits on an identical neutral "seat": a hairline-
 * bordered, `bg-card` (fixed near-white, independent of `.surface-paper`'s
 * warm ivory in either theme), `rounded-card`, evenly-padded chip carrying
 * the `--shadow-chip` token globals.css already reserves for exactly this
 * case ("the seat they sit on when a chip needs a surface behind it"). Equal
 * padding + an identical mount around three identically-sized (see below)
 * images gives the row one consistent unit of "evidence chip," repeated
 * three times — the mismatch between the badges themselves reads as three
 * different real-world quarters, not as a layout defect.
 *
 * ── Sizing ───────────────────────────────────────────────────────────────
 * All three delivered rasters (`public/awards/powerbroker-q{3-2025,1-2026,
 * 2-2026}.png` + `.avif`) are identically 356×80px (verified with `sips`,
 * 2026-08-09) — a clean 2× multiple of a 178×40 display size, so a single
 * width/height pair renders all three pixel-uniform with headroom for
 * retina, matching the task brief's own math (source 1200×270 native ⇒ 40px
 * tall ⇒ ~178px wide). `next/image` is pointed at the `.png`; per
 * `content/artwork.ts`'s own documented reasoning for its `getArt()`
 * resolver, Next's built-in optimizer negotiates AVIF/WebP from that source
 * at request time, so the sibling `.avif` files need no separate `<picture>`
 * wiring here.
 */

import Image from "next/image";
import { cn } from "@/lib/utils";

/** Every delivered banner is this exact native size (verified with `sips`). */
const BANNER_SOURCE_WIDTH = 356;
const BANNER_SOURCE_HEIGHT = 80;

/** Uniform render size — ~40px tall, per the task brief's own math. Exactly
 *  half the source, so retina screens get a crisp 2× fetch. */
const BANNER_WIDTH = Math.round(BANNER_SOURCE_WIDTH / 2);
const BANNER_HEIGHT = Math.round(BANNER_SOURCE_HEIGHT / 2);

type QuarterlyBanner = {
  quarter: string;
  src: string;
  /** Real alt text naming the award — never the treatment. */
  alt: string;
};

/**
 * The three registered wins (ref 06). Filenames and quarter labels here are
 * the asset paths themselves, not a restated claim — the underlying figures
 * (`stat.value`/`stat.detail` for the "CoStar Power Broker" row) still come
 * from `@/content/stats` wherever they render as text; this table exists
 * only to pair each already-registered win with its own badge image.
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

export function QuarterlyBanners({ className }: QuarterlyBannersProps) {
  return (
    <ul
      role="list"
      aria-label="CoStar Power Broker, Quarterly Deals wins"
      className={cn("flex flex-wrap items-center gap-4 sm:gap-5", className)}
    >
      {QUARTERLY_BANNERS.map((banner) => (
        <li
          key={banner.quarter}
          className="hairline rounded-card bg-card px-4 py-3 shadow-[var(--shadow-chip)]"
        >
          <Image
            src={banner.src}
            alt={banner.alt}
            width={BANNER_WIDTH}
            height={BANNER_HEIGHT}
            sizes={`${BANNER_WIDTH}px`}
            draggable={false}
          />
        </li>
      ))}
    </ul>
  );
}
