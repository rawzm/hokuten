/**
 * CardShell — the fixed-slot card chassis shared by ListingCard, ClosingCard
 * and TeamCard. Governed by hokuten-design-director ref 03 (Surfaces, Radius),
 * ref 04 (#closings / #listings / #team), ref 05 (Hovers), ref 07 (P0 focus).
 *
 * Server Component on purpose: every state it needs is a CSS state. No JS ships
 * for a card grid. (The photo inside is `PhotoFrame`, which is a client module —
 * that boundary is as deep as it goes.)
 *
 * ── The no-reflow contract (the filmfully tile pattern) ────────────────────
 * Tiles in a grid must be identical in height whether a hotel has three metrics
 * or none. So the slots are reserved, not grown:
 *   photo   — carries its own fixed aspect (PhotoFrame `aspect` prop)
 *   title   — 2 lines reserved (min-h 2.4em at line-height 1.2), clamped to 2
 *   meta    — 2 lines reserved (min-h 3.2em at line-height 1.6), clamped to 2
 *   data    — 2 lines reserved (min-h 3.2em); NOT clamped, because truncating
 *             deal data loses information — keep data lines to two
 *   badge   — bottom-pinned with the data slot via `mt-auto`
 * Reservation happens even when the slot is empty; pass `reserveMeta={false}` /
 * `reserveData={false}` only when NO card in that grid uses the slot.
 *
 * ── Hover / focus (ref 05) ─────────────────────────────────────────────────
 * Hovering the card does exactly two things: the photo goes grayscale to colour at
 * scale 1.02 (the `photo-reveal` utility keys off the `card-hit` marker class
 * on this element), and the card's hairline shifts to the accent at 40%.
 * The card NEVER translates, never lifts a shadow, never springs.
 *
 * ── One link target ────────────────────────────────────────────────────────
 * When `href` is given, a real `<a>` wraps the title and stretches over the card
 * via `::after`. Screen readers get one link named by the hotel; pointers get
 * the whole tile. There is no div-with-onClick anywhere in this file.
 * Any genuinely interactive child (a second link, a copy button) must carry
 * `relative z-2` to sit above that overlay — everything else stays beneath it
 * so the card reads as a single hit area.
 *
 * Note: plain `<a>`, not `next/link` — Phase 1 targets are in-page anchors and
 * external deal pages. Swap to `next/link` when sections graduate to routes.
 */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type CardShellProps = {
  /** A `PhotoFrame`. Must carry its own aspect so the slot cannot reflow. */
  photo?: ReactNode;
  /** Hotel or person name. Becomes the link's accessible name when `href` is set. */
  title: ReactNode;
  /** Sans caption line — "Lake Harmony, PA · Full-Service · 450 keys". */
  meta?: ReactNode;
  /** Mono, tabular deal data — price, cap rate, LP/SP, days. */
  data?: ReactNode;
  /** Badge row — EXCLUSIVE · OFF-MARKET · IN CONTRACT · CLOSED. */
  badge?: ReactNode;
  href?: string;
  /** Opens in a new tab with a spoken warning. Use for Crexi / off-site deals. */
  external?: boolean;
  /** Card body surface. `card` on a paper section, `paper` on a deep band. */
  surface?: "card" | "paper";
  /** Heading level — keep the document outline honest inside its section. */
  titleAs?: "h2" | "h3" | "h4";
  /** Element role. `li` when the grid is a real list. */
  as?: "article" | "li" | "div";
  reserveMeta?: boolean;
  reserveData?: boolean;
  className?: string;
};

export default function CardShell({
  photo,
  title,
  meta,
  data,
  badge,
  href,
  external = false,
  surface = "card",
  titleAs: Heading = "h3",
  as: Root = "article",
  reserveMeta = true,
  reserveData = true,
  className,
}: CardShellProps) {
  const showMeta = reserveMeta || meta !== undefined;
  const showData = reserveData || data !== undefined;

  return (
    <Root
      className={cn(
        // `card-hit` is the marker the `photo-reveal` utility hovers off.
        "card-hit group relative isolate flex h-full flex-col",
        "rounded-card border border-hairline",
        surface === "paper" ? "surface-paper" : "surface-card",
        // Colour only. Nothing here moves the card.
        "transition-colors duration-base ease-out",
        href && "hover:border-accent-text/40",
        // The focus ring belongs to the whole tile, not the title text — the
        // inner anchor gives its own ring up (below) and the card takes it on.
        "has-[a:focus-visible]:border-accent-text/40",
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus",
        className,
      )}
    >
      {photo ? <div className="overflow-hidden rounded-none">{photo}</div> : null}

      <div className="flex flex-1 flex-col p-6">
        <Heading className="font-display text-heading text-fg line-clamp-2 min-h-[2.4em]">
          {href ? (
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
              // Ring suppressed here because an equivalent, larger ring is drawn
              // around the entire card by the `has-[a:focus-visible]` rules above.
              className="after:absolute after:inset-0 after:z-1 after:content-[''] focus-visible:outline-none"
            >
              {title}
              {external ? <span className="visually-hidden"> (opens in a new tab)</span> : null}
            </a>
          ) : (
            title
          )}
        </Heading>

        {showMeta ? (
          <p className="text-body text-fg-muted mt-2 line-clamp-2 min-h-[3.2em]">{meta}</p>
        ) : null}

        <div className="mt-auto">
          {showData ? <div className="data-line text-fg-meta mt-4 min-h-[3.2em]">{data}</div> : null}
          {badge ? <div className="mt-4 flex flex-wrap items-center gap-2">{badge}</div> : null}
        </div>
      </div>
    </Root>
  );
}

// Named export for consistency — every component here is importable by name.
export { CardShell };
