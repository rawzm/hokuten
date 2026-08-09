/**
 * components/cards/ClosingCard.tsx — one retired "SOLD" ticket in the
 * `#closings` track record.
 *
 * Governed by docs/DESIGN-REVISIT.md §2 D4, §4.5 (closings-specific anatomy:
 * "Closings (SOLD): visually 'retired' ticket — muted/grayscale header, a
 * CLOSED/SOLD overprint stamp ... hanko-adjacent, not a cheesy red rubber
 * stamp ... metrics grid showing the proof line (LP/SP · days · price)"),
 * hokuten-design-director ref 04 (`#closings`), ref 06 (Copy patterns → data
 * lines, "Confidential"), ref 07 (the 5-second CRE gate). Rebuilt onto the
 * shared `Ticket` chassis (components/cards/Ticket.tsx) — read that file's
 * header before touching this one; every no-reflow / focus / hover rule
 * already lives there. This is the retired sibling of `ListingCard`: same
 * chassis, same visual system, the OTHER state ("two card types read as one
 * system in two states" — task brief).
 *
 * Server Component — PhotoFrame's touch tap-reveal handler is the only
 * client boundary in the tree, same as before.
 *
 * ── What moved, D4 → the new ticket anatomy ─────────────────────────────────
 *   `<Badge status="closed" />` (CardShell's bottom badge row) → RETIRED. The
 *     "closed" signal now lives entirely in the header band: `retired` grays
 *     the photo (`Ticket` forces this at the wrapper level, so it holds
 *     regardless of `PhotoFrame`'s own hover state) plus a "Sold" `overprint`
 *     stamp positioned bottom-right on the photo (`Ticket`'s `overprint`
 *     slot). A separate status chip would be redundant once the stamp
 *     exists, and the brief's own framing — "these numbers are the entire
 *     reason the section exists" — argues for less chrome below the tear
 *     line, not more.
 *   One joined `data` line (metrics string + accent price span) → a real
 *     TWO-ROW structured grid (`Ticket`'s `metrics` prop): "Price" first,
 *     per the sitewide 5-second-gate convention `ListingCard` established
 *     ("price is always the FIRST metric"), "Terms" second.
 *
 * ── Why `overprint` renders desaturated, not "accent-toned" ─────────────────
 * `Ticket`'s `retired` prop wraps BOTH the header photo AND the `overprint`
 * slot in one `grayscale` filter (verified by reading Ticket.tsx directly,
 * not assumed from its doc comment — the two children share one wrapper
 * div, see its lines ~193-200). That is `Ticket`'s fixed behaviour and this
 * file cannot opt out of it without editing a file outside this assignment.
 * The result reads as an ink stamp on a filed document rather than a
 * marketing accent — arguably the MORE restrained, hanko-adjacent outcome
 * the brief actually asks for ("must NOT read as a cheesy red rubber
 * stamp... restraint is the whole point") — so this is treated as a feature
 * of the shared chassis, not a bug to work around.
 *
 * ── Why "Sold" carries its own `bg-paper` seat ──────────────────────────────
 * The stamp sits directly on an arbitrary, uncontrolled photo (six different
 * hotels, six different colour fields) with no surface scope between it and
 * the photo (`Ticket`'s header wrapper is deliberately background-less — see
 * Ticket.tsx's own header comment on why). Bare `overprint` text with no
 * fill risks vanishing against a light sky or a light facade. `ListingCard`
 * already solved the identical "chip legible over any photo" problem for
 * its status badge with `bg-paper`; this reuses that exact, proven pattern
 * rather than inventing a new one.
 *
 * ── Splitting `closing.metrics` — sanctioned by an existing sitewide
 *    pattern, not a new liberty ───────────────────────────────────────────
 * `content/closings.ts`'s header calls `metrics` "the two-slot mono line
 * ONLY" — it is genuinely two values joined with " · ", not one atomic
 * string. `StatsSection`'s `StatDetail` already splits `stat.detail` on the
 * exact same separator for the exact same reason: keep each value
 * `whitespace-nowrap` while letting the LINE wrap between them in a narrow
 * grid cell (the ticket's metrics grid is two columns, so each cell is
 * roughly half the card's width — real risk for a 20-character string like
 * "96% LP/SP · 74 days"). This file does the identical split and feeds it
 * to the existing `DataLine` atom's `parts` variant — no value is
 * reformatted, reordered, or invented; only the CSS presentation of an
 * already-joined string changes. The two values still render as ONE "Terms"
 * row (one label, one value built from nowrap parts) — this file does NOT
 * invent a second, per-value label (e.g. splitting "96% LP/SP · 74 days"
 * into a fabricated "LP/SP" row and a fabricated "Days" row), because the
 * two slots' semantics vary per closing (ratio+days, $/key, lease terms,
 * "Confidential") and synthesising a label per slot would put words in the
 * data the source never supplied.
 *
 * ── No card destination in Phase 1 (carried forward, unchanged) ────────────
 * Ref 04's `#closings` spec lists no click-through target for a closing tile
 * (unlike `#listings`, which explicitly links to Crexi) — these are proof,
 * not inventory, and the kwc source's closing-grid link was Dino-personal
 * and flagged "do not ship" in the port pack. `Ticket` therefore renders
 * with no `href`, so the title is plain text and there is no `stub` action
 * row. The accent hover ring still needs to fire on hover per ref 05 even
 * without a link — `Ticket` only adds that class when `href` is set, so it
 * is forced on here via `className`, identical to how the pre-ticket
 * `CardShell` version of this file did it.
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

  const metrics: TicketMetric[] = [
    {
      label: "Price",
      value: <span className="text-accent-text">{closing.price}</span>,
    },
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
