/**
 * components/awards/RecognitionStrip.tsx — the two CoStar 2025 ANNUAL
 * badges (Top Broker, Top Firm), rendered in `#closings`' header area.
 *
 * Governed by docs/DESIGN-REVISIT.md §2 D3, §4.4 ("Place the two 2025 Annual
 * badges elsewhere so nothing crowds — recommended: a slim recognition
 * strip in #closings' header area... spread apart from the three QUARTERLY
 * banners"), hokuten-design-director ref 06 (Verified claims register).
 *
 * ── Evidence gate — checked before writing this file ────────────────────────
 * These two are NEW claims this round; both already have `verified-current`
 * rows in ref 06 (.agents/skills/hokuten-design-director/references/
 * 06-content-and-proof.md, lines 31–32), added 2026-08-08 by another agent
 * per the task brief. This component renders two ALREADY-registered claims,
 * it does not introduce them:
 *   "CoStar 2025 Annual Award — Top Broker | '2025 Annual Awards · Power
 *    Broker Award · Winner: Top Broker' — badge asset
 *    `US_2025Annual_TopBroker.png` | `verified-current`"
 *   "CoStar 2025 Annual Award — Top Firm | '2025 Annual Awards · Power
 *    Broker Award · Winner: Top Firm' — badge asset
 *    `US_2025Annual_TopFirm.png` | `verified-current`"
 * Both rows cite "badge asset supplied by Razim 2026-08-08" as source.
 *
 * ── Sibling to QuarterlyBanners, deliberately not a shared abstraction ──────
 * `components/awards/QuarterlyBanners.tsx` (`#stats`, another agent's file)
 * solves an identical problem — official third-party badges, rendered
 * as-is, needing a neutral seat to read consistently regardless of theme —
 * and this file reuses its exact solution (hairline + `bg-card` +
 * `rounded-card` + the `--shadow-chip` token globals.css reserves for
 * exactly this case) on purpose, so the two badge rows read as ONE evidence
 * vocabulary repeated in two places, not two competing treatments. It stays
 * a separate component, not a shared one: the two are unrelated by design
 * ("spread apart... so neither moment is congested" — a shared component
 * would invite a future edit to render both from one call site), and the
 * badge sets are a visually distinct family (D3: "a distinct vendor badge
 * family (black/gold 'Annual') from the blue 'Quarterly Deals' row above;
 * do not conflate the two in copy or layout").
 *
 * ── These are official third-party marks: rendered as-is, never a link ─────
 * No recolour, no crop, no coloured backing chip ON the badge itself, no
 * aspect-ratio change, not wrapped in an `<a>` — evidence, not navigation,
 * same usage-terms law QuarterlyBanners documents. Both source PNGs are a
 * dark (black/near-black) badge design; the `bg-card` seat (a fixed
 * near-white, independent of `.surface-paper`'s warm-ivory shift between
 * themes) is what keeps them reading correctly against `#closings`' surface
 * in BOTH themes, rather than adjusting the badge itself.
 *
 * ── Sizing ───────────────────────────────────────────────────────────────
 * Both delivered rasters (`public/awards/costar-top-{broker,firm}-2025.png`
 * + `.avif`) are identically 344×80px (verified with `sips`, 2026-08-09) —
 * close to a clean 2× multiple of a 172×40 display size, matching the task
 * brief's own "~40px" target and the sibling QuarterlyBanners' identical
 * math (356×80 → 178×40). `next/image` points at the `.png`; Next's
 * optimizer negotiates AVIF/WebP from that source at request time, so the
 * sibling `.avif` files need no separate `<picture>` wiring — same
 * reasoning as QuarterlyBanners.
 *
 * ── Asset-missing degrade path ──────────────────────────────────────────────
 * Both files were confirmed present on disk (`ls` + `sips`) at the time
 * this component was written (2026-08-09) — this is not the interim case
 * the task brief warned about, so no existence check is added. A Server
 * Component has no reliable way to detect a 404'd `next/image` short of
 * `onError` (a client-only hook — see `Stamp.tsx`'s degrade pattern, which
 * is reserved for assets this repo cannot yet confirm delivered). If a
 * future asset swap ever breaks either path, `next/image` fails loudly
 * (broken-image icon + a build/console warning), which is preferable to
 * silently swallowing a real regression here.
 */

import Image from "next/image";

import { cn } from "@/lib/utils";
import { MicroLabel } from "@/components/atoms/MicroLabel";

/** Every delivered badge is this exact native size (verified with `sips`). */
const BADGE_SOURCE_WIDTH = 344;
const BADGE_SOURCE_HEIGHT = 80;

/** Uniform render size — ~40px tall, per the task brief's own math. Close to
 *  half the source, so retina screens get a crisp, near-2× fetch. */
const BADGE_WIDTH = Math.round(BADGE_SOURCE_WIDTH / 2);
const BADGE_HEIGHT = Math.round(BADGE_SOURCE_HEIGHT / 2);

type AnnualBadge = {
  id: string;
  src: string;
  /** Real alt text naming the award — never the treatment. */
  alt: string;
};

/** The two registered wins (ref 06). Filenames are the asset paths
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

export type RecognitionStripProps = {
  className?: string;
};

export function RecognitionStrip({ className }: RecognitionStripProps) {
  return (
    <div className={cn("flex flex-col items-start gap-3", className)}>
      <MicroLabel as="p">Recognition</MicroLabel>
      <ul
        role="list"
        aria-label="CoStar Power Broker, 2025 Annual Award wins"
        className="flex flex-wrap items-center gap-4 sm:gap-5"
      >
        {ANNUAL_BADGES.map((badge) => (
          <li
            key={badge.id}
            className="hairline rounded-card bg-card px-4 py-3 shadow-[var(--shadow-chip)]"
          >
            <Image
              src={badge.src}
              alt={badge.alt}
              width={BADGE_WIDTH}
              height={BADGE_HEIGHT}
              sizes={`${BADGE_WIDTH}px`}
              draggable={false}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Default retained for call-site convenience (matches ClosingCard/
// ListingCard/Ticket); the named export above is canonical and is what
// ClosingsSection actually imports.
export default RecognitionStrip;
