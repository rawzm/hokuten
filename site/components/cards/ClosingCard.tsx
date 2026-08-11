/**
 * components/cards/ClosingCard.tsx — one retired "SOLD" ticket in the
 * `#closings` track record.
 *
 * Governed by docs/DESIGN-REVISIT-2.md D13 + §5.3–5.4 (this wave's spec:
 * landscape ticket, dedicated money slot, SOLD colour-reveal REVERSAL),
 * docs/DESIGN-REVISIT.md §2 D4/§4.5 (the original boarding-pass anatomy this
 * evolves), hokuten-design-director ref 04 (`#closings`), ref 06 (Copy
 * patterns → data lines, "Confidential"), ref 07 (the 5-second CRE gate).
 * Built on the shared `Ticket` chassis (components/cards/Ticket.tsx) — read
 * that file's header before touching this one; every no-reflow / focus /
 * hover / SOLD-reveal rule already lives there. This is the retired sibling
 * of `ListingCard`: same chassis, same visual system, the OTHER state.
 *
 * Server Component — PhotoFrame's touch tap-reveal handler is the only
 * client boundary in the tree, same as before.
 *
 * ── THIS WAVE (Design Revisit 2, 2026-08-10): the `price` migration ────────
 * Ticket.tsx's own "Migration" note leaves a NEXT-WAVE TODO for whoever
 * rebuilds this file: move the price-valued entry OUT of `metrics` and into
 * the dedicated `price` prop, so it renders as `text-heading` + `text-money`
 * — visibly larger than every facts-grid value, per D13/D20's four-level
 * hierarchy ("price is THE DOMINANT DATA MOMENT... visibly larger than
 * terms, keys and cap rate"). The previous version of this file put price
 * INSIDE the `metrics` array with a manually-applied `text-accent-text`
 * class — that both under-sized it (same `text-data` tier as every other
 * fact) and mis-coloured it (`--accent-text` is the BRAND accent, not the
 * reserved money token; D13/D6.5 restrict `--money`/`text-money` to
 * monetary primary values specifically so it never doubles as a generic
 * accent). This version does neither: `closing.price` goes straight into
 * `<Ticket price={…}>`, which owns the `text-money` treatment entirely — no
 * colour class is applied here at all. `metrics` now carries exactly one
 * entry, "Terms", unchanged in content and formatting from before.
 *
 * ── Why no `serial` — a deliberate omission, not a missed slot ─────────────
 * Ticket's four-level hierarchy names the micro tier "serial/status" (a
 * slash, not "and") — EITHER satisfies it. This section already renders a
 * micro-tier element for every ticket: the "Sold" `overprint` stamp
 * (`font-mono`, `text-micro`, tracked caps, uppercase — the exact same
 * recipe `micro-label` uses) sitting on the header photo. That is this
 * ticket's status voice; adding `serial="RECORD 0N"` on top would be a
 * second micro element doing the same job Ticket's own type table forbids
 * ("no decorative fifth size" — two micro moments read as one tier restated
 * twice, not two tiers).
 * There is also a real geometry reason, worth recording precisely because
 * Ticket.tsx is a file this agent cannot edit: at the `lg:` landscape
 * breakpoint, Ticket's own fixed per-slot reservations (title `min-h-
 * [2.4em]` ≈ 67px at the section's rendered `text-heading` size, meta
 * `min-h-[3.2em]` ≈ 51px, price `min-h-[3.25rem]` = 52px, metrics `min-h-24`
 * = 96px, plus `lg:p-7` padding = 56px) already sum to a ~342px floor per
 * ticket row regardless of content — independent of anything this file
 * does. Two rows of that floor (~685px) plus `SectionHeader`'s own minimum
 * footprint and `section-pad-tight`'s fixed bottom padding leave the
 * section already close to §5.3's 784px/1440×900 budget (see
 * `ClosingsSection.tsx`'s header for the full arithmetic and the honest
 * flag on it). Adding a `serial` line — a real, additional ~23px on every
 * one of the six tickets — was evaluated and rejected specifically because
 * the fit budget has no room for it here, not because the device is wrong
 * in general (`ListingCard`'s own tickets can afford it more easily, one
 * fewer reserved slot's worth of room).
 *
 * ── SOLD colour reveal — implemented entirely by `Ticket`, nothing to add
 *    here ───────────────────────────────────────────────────────────────────
 * D13 reverses Revisit 1's "always muted" rule: sold photography is
 * grayscale at rest and reveals full colour on hover, `:focus-within`, and
 * the existing touch-reveal action, with the `overprint` stamp staying
 * visible in both states. `Ticket`'s `retired` prop already implements the
 * hover/keyboard-focus grayscale↔colour toggle by targeting the header
 * `<img>` directly (verified by reading `Ticket.tsx` — see its own "Retired"
 * header note), and its `overprint` slot already renders in its own stacked
 * layer above the photo's filter chain, so nothing about the reveal itself
 * needed touching in this file — `retired` (already passed below) is the
 * whole contract.
 * One real, disclosed gap: `:focus-within` can only ever fire on an element
 * that CONTAINS a focusable child, and per the next note this ticket has
 * none — so the "reveals on keyboard focus" leg of D13 is inert for
 * closings specifically, not broken. This is not a missing keyboard
 * affordance: the colour reveal is pure decoration (PhotoFrame's own header
 * doc: "nothing is ever communicated by the colour state... touch users who
 * never trigger `tapped` lose zero information"), so no keyboard user is
 * denied any information by a hover-only-reachable reveal on a card with no
 * focusable target to begin with.
 *
 * ── Why `overprint` renders desaturated, not "accent-toned" ─────────────────
 * `Ticket`'s `retired` prop wraps the header photo in a `grayscale` filter
 * at rest (verified by reading Ticket.tsx directly). The "Sold" stamp sits
 * over that same photo in its own layer, so it reads as an ink stamp on a
 * filed document rather than a marketing accent — the restrained,
 * hanko-adjacent outcome the brand voice asks for, not a bug to work around.
 *
 * ── Why "Sold" carries its own `bg-paper` seat ──────────────────────────────
 * The stamp sits directly on an arbitrary, uncontrolled photo (six different
 * hotels, six different colour fields) with no surface scope between it and
 * the photo (`Ticket`'s header wrapper is deliberately background-less).
 * Bare `overprint` text with no fill risks vanishing against a light sky or
 * a light facade. `ListingCard` already solved the identical "chip legible
 * over any photo" problem for its status badge with `bg-paper`; this reuses
 * that exact, proven pattern.
 *
 * ── Splitting `closing.metrics` — sanctioned by an existing sitewide
 *    pattern, not a new liberty ───────────────────────────────────────────
 * `content/closings.ts`'s header calls `metrics` "the two-slot mono line
 * ONLY" — it is genuinely two values joined with " · ", not one atomic
 * string. `StatsSection`'s `StatDetail` already splits `stat.detail` on the
 * exact same separator for the exact same reason: keep each value
 * `whitespace-nowrap` while letting the LINE wrap between them in a narrow
 * grid cell. This file does the identical split and feeds it to the
 * existing `DataLine` atom's `parts` variant — no value is reformatted,
 * reordered, or invented; only the CSS presentation of an already-joined
 * string changes. The two values still render as ONE "Terms" row (one
 * label, one value built from nowrap parts) — this file does NOT invent a
 * second, per-value label, because the two slots' semantics vary per
 * closing (ratio+days, $/key, lease terms, "Confidential") and synthesising
 * a label per slot would put words in the data the source never supplied.
 *
 * ── No card destination in Phase 1 (carried forward, unchanged) ────────────
 * D13 keeps this rule explicitly: "a closing stays NON-LINKING unless a
 * future evidence-approved destination is added." `Ticket` therefore renders
 * with no `href`, so the title is plain text and there is no `stub` action
 * row. The accent hover ring still needs to fire on hover per ref 05 even
 * without a link — `Ticket` only adds that class when `href` is set, so it
 * is forced on here via `className`, identical to the pre-Revisit-2 version.
 *
 * Every string, price and photo below comes from `content/closings.ts` —
 * never retyped. A missing field renders "Confidential" (already baked into
 * the source strings), never "N/A", never an invented number.
 */

import { cn, metaLine } from "@/lib/utils";
import type { Closing } from "@/lib/types";
import Ticket, { type TicketMetric } from "@/components/cards/Ticket";
import PhotoFrame from "@/components/atoms/PhotoFrame";
import { DataLine } from "@/components/atoms/DataLine";

export type ClosingCardProps = {
  closing: Closing;
  className?: string;
};

/** Matches ListingCard's ticket header (D5 artwork manifest's "card" variant
 *  is 3:2) so every ticket in the site's two grids shares one photo aspect. */
const HEADER_ASPECT = "3/2" as const;
const HEADER_SIZES = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

export default function ClosingCard({ closing, className }: ClosingCardProps) {
  const meta = metaLine([
    closing.location,
    closing.keys ? `${closing.keys} keys` : undefined,
    closing.segment,
    closing.note,
  ]);

  // "the two-slot mono line ONLY" (content/closings.ts) — split on its own
  // documented separator, never reformatted. See file header.
  const metricsParts = closing.metrics.split(" · ");

  // Terms only — price now goes straight into Ticket's dedicated `price`
  // prop below (D13's four-level hierarchy: price is the money moment, not
  // a facts-grid row). See file header "the `price` migration" note.
  const metrics: TicketMetric[] = [
    {
      label: "Terms",
      value: (
        <DataLine
          as="span"
          parts={metricsParts}
          variant={metricsParts.length > 1 ? "parts" : "joined"}
        />
      ),
    },
  ];

  return (
    <Ticket
      as="article"
      titleAs="h3"
      header={
        <PhotoFrame
          src={closing.photo}
          alt={closing.photoAlt}
          aspect={HEADER_ASPECT}
          sizes={HEADER_SIZES}
        />
      }
      overprint={<span className="overprint bg-paper px-3 py-1">Sold</span>}
      retired
      title={closing.name}
      meta={meta}
      price={closing.price}
      metrics={metrics}
      className={cn(
        // Ticket only adds this ring on hover when `href` is set; closing
        // tiles are hrefless by design (see file header) and ref 05 still
        // calls for the ring on hover.
        "hover:border-accent-text/40",
        className,
      )}
    />
  );
}

// Named export for consistency — every component here is importable by name.
export { ClosingCard };
