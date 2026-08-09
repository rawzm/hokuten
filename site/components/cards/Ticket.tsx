/**
 * Ticket — the shared deal-ticket chassis for `#listings` and `#closings`.
 *
 * Governed by docs/DESIGN-REVISIT.md §2 D4 and §4.5 (the anatomy spec this
 * file implements verbatim), hokuten-design-director ref 03 (Surfaces,
 * Radius, the ticket component spec), ref 05 (Hovers — "hover lifts nothing"
 * is the one documented exception the resting `--shadow-ticket*` shadow
 * carves out of "1px borders over shadows"), ref 07 (P0 focus, the 5-second
 * CRE gate).
 *
 * ── Sibling to CardShell, not a wrapper around it (one-sentence justification
 *    the task brief asked for) ──────────────────────────────────────────────
 * CardShell's single content region (photo → title/meta/data/badge, all in
 * one padded div) has no seam to hang a perforated tear line + punched
 * notches on, and D4 explicitly retires the always-on hairline border CardShell
 * relies on in favour of the resting shadow doing that job for tickets only —
 * fighting both of those constraints inside CardShell's existing shape would
 * cost more than restating its proven mechanisms (no-reflow slots, single
 * link target, focus delegation) in a chassis whose DOM shape actually fits
 * a boarding pass. CardShell itself is UNTOUCHED — TeamCard (another agent's
 * file, right now) keeps behaving exactly as before.
 *
 * ── Why the ticket ROOT paints no background of its own ─────────────────────
 * The `ticket-notch` utility (globals.css) masks real transparent holes in
 * whatever element it is applied to, "so the section surface shows through —
 * a painted circle in the surface colour would break the moment a ticket sat
 * on a different surface" (utility's own header comment). A hole only reveals
 * the true page background if NOTHING between the masked element and the page
 * paints a competing background at that point. So the mask goes on a
 * dedicated ~28px tear-line band — not on the whole card — and the ROOT
 * itself stays background-less (only `ticket`'s shadow + `rounded-card` +
 * `overflow-hidden` for the corner clip). The header band and the stub each
 * carry their OWN `.surface-*` scope (photo is opaque either way; the stub's
 * text needs the scope for its `--fg`/`--fg-muted`/`--accent-text` vars
 * regardless). Three flush, background-owning bands stacked inside a
 * background-less, shadow-and-radius-owning root read as one dimensional
 * object with two real punched notches at the seam — never a painted circle
 * that would go wrong on a differently-coloured section.
 *
 * ── The no-reflow contract, carried forward from CardShell ──────────────────
 * A ticket with three metrics and a ticket with none must be the same height:
 *   header   — carries its own fixed aspect (the caller's PhotoFrame `aspect`
 *              prop); Ticket does not impose one, matching CardShell.
 *   title    — 2 lines reserved (min-h 2.4em @ 1.2 line-height), clamped to 2.
 *   meta     — 2 lines reserved (min-h 3.2em @ 1.6), clamped to 2. Reservation
 *              happens even when empty; pass `reserveMeta={false}` only when
 *              NO ticket in the grid uses the slot.
 *   metrics  — reserved for two rows (min-h 6rem) regardless of item count —
 *              a lone metric (e.g. only price on file) spans both grid
 *              columns instead of leaving a half-empty row.
 *   badges / stub — bottom-pinned together via `mt-auto`, same as CardShell's
 *              data+badge pinning.
 *
 * ── One link target (identical mechanism to CardShell) ──────────────────────
 * When `href` is given, a real `<a>` wraps the title and stretches over the
 * WHOLE ticket via `::after` (the `<a>` itself needn't be positioned — its
 * nearest positioned ancestor is this Root, which carries `relative isolate`,
 * exactly like CardShell). Screen readers get one link named by the title;
 * pointers get the whole tile, including the header photo and the two
 * punched notches (the notches carry no paint, so the invisible overlay
 * still activates the link there — decorative, not a second hit target).
 * Any second real interactive element (the `stub` slot's mailto button on an
 * untrusted-link ticket) must carry `relative z-2` to sit above that overlay,
 * same convention as CardShell.
 *
 * ── Focus ring on the whole ticket, not just the title ──────────────────────
 * `has-[a:focus-visible]` delegates the ring to Root, identical to CardShell.
 * D4 drops CardShell's always-on hairline border for tickets (the shadow does
 * that job now), but the hover/focus ring still needs a border to shift
 * COLOUR into without a layout shift — so Root carries `border
 * border-transparent` at rest (0 visual weight, same 1px box) and transitions
 * only `border-color`, never `border-width`.
 *
 * ── Retired state (for the sibling agent's ClosingCard) ──────────────────────
 * `retired` forces `grayscale` on the header WRAPPER (a parent-level CSS
 * filter applies to the fully rendered subtree, so it holds regardless of
 * whatever hover/reveal state the caller's own PhotoFrame is in — no need to
 * also flip PhotoFrame's `reveal` prop). Pair it with the `overprint` slot
 * (render the caller's stamp text with the existing `overprint` utility
 * class from globals.css — NOT the `<Stamp>`/hanko component, which is
 * scarcity-gated to exactly three sitewide placements and does not include
 * this one) for the "CLOSED/SOLD" mark. `overprint` is positioned bottom-right
 * inside the header band, pointer-events-none (the utility class already sets
 * that), so it never competes with the link overlay's hit-testing.
 *
 * ── `onDark` ──────────────────────────────────────────────────────────────
 * Neither current grid sits on a dark surface yet, but the token pair exists
 * for exactly this (`--shadow-ticket` / `--shadow-ticket-dark`) — expose it
 * now rather than have the next placement invent a local override.
 *
 * Server Component — no client JS of its own. The header/photo the caller
 * passes in (PhotoFrame) carries the only client boundary, same as CardShell.
 */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** One `{label, value}` pair in the structured grid below the tear line. */
export type TicketMetric = {
  /** Tiny-caps label, e.g. "Price", "Keys", "Cap rate", "LP/SP", "Days". */
  label: string;
  /** Bold mono value. Pass the ALREADY-FORMATTED string/number — Ticket does
   *  not reformat deal data (content law: import formatters, never re-derive). */
  value: ReactNode;
};

export type TicketProps = {
  /** Photo (PhotoFrame, carrying its own fixed aspect) or a designed surface
   *  where no photo exists. Required — every ticket has a header band. */
  header: ReactNode;
  /** Stamp content for the retired state — e.g. `<span className="overprint px-3 py-1">SOLD</span>`.
   *  Positioned bottom-right inside the header band, pointer-events-none. */
  overprint?: ReactNode;
  /** Hotel name. Becomes the link's accessible name when `href` is set. */
  title: ReactNode;
  /** Sans caption line — "Lake Harmony, PA · Full-Service". */
  meta?: ReactNode;
  /** The structured label/value grid below the tear line. A single entry
   *  spans both columns rather than leaving a half-empty row. */
  metrics?: TicketMetric[];
  /** Freeform badge row, rendered above the stub action. */
  badges?: ReactNode;
  /** The stub action row (e.g. "View on Crexi" + icon, or a real mailto CTA
   *  when the ticket isn't itself a link) — divided from the metrics/badges
   *  above it by a hairline, sitting at the very bottom of the stub. */
  stub?: ReactNode;
  href?: string;
  /** Opens in a new tab with a spoken warning. Use for Crexi / off-site deals. */
  external?: boolean;
  /** Retired/SOLD visual state: forces the header band to grayscale
   *  regardless of hover. Pair with `overprint`. */
  retired?: boolean;
  /** Swaps in `--shadow-ticket-dark` for a ticket that sits on `.surface-dark`
   *  / `.surface-black`. Neither current grid needs this yet. */
  onDark?: boolean;
  /** Stub body surface. `card` on a paper/deep section, `paper` on a deep band. */
  surface?: "card" | "paper";
  /** Heading level — keep the document outline honest inside its section. */
  titleAs?: "h2" | "h3" | "h4";
  /** Element role. `li` when the grid is a real list. */
  as?: "article" | "li" | "div";
  reserveMeta?: boolean;
  reserveMetrics?: boolean;
  className?: string;
};

export default function Ticket({
  header,
  overprint,
  title,
  meta,
  metrics,
  badges,
  stub,
  href,
  external = false,
  retired = false,
  onDark = false,
  surface = "card",
  titleAs: Heading = "h3",
  as: Root = "article",
  reserveMeta = true,
  reserveMetrics = true,
  className,
}: TicketProps) {
  const showMeta = reserveMeta || meta !== undefined;
  const showMetrics = reserveMetrics || (metrics !== undefined && metrics.length > 0);
  const surfaceClass = surface === "paper" ? "surface-paper" : "surface-card";
  const soleMetric = metrics?.length === 1;

  return (
    <Root
      className={cn(
        // `card-hit` is the marker `photo-reveal` (inside the caller's
        // PhotoFrame) hovers off, same contract as CardShell.
        "card-hit group relative isolate flex h-full flex-col",
        "ticket rounded-card overflow-hidden",
        onDark && "ticket-dark",
        // D4: no always-on hairline for tickets — the resting shadow carries
        // the boundary. The border is present-but-transparent at rest so the
        // hover/focus colour shift never triggers a layout shift.
        "border border-transparent transition-colors duration-base ease-out",
        href && "hover:border-accent-text/40",
        "has-[a:focus-visible]:border-accent-text/40",
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus",
        className,
      )}
    >
      {/* Header band — own opaque content (photo or designed surface).
          `retired` desaturates the WHOLE rendered subtree via a parent
          filter, regardless of the child PhotoFrame's own hover state. */}
      <div className={cn("relative shrink-0 overflow-hidden rounded-none", retired && "grayscale")}>
        {header}
        {overprint ? (
          <div className="pointer-events-none absolute inset-0 z-1 flex items-end justify-end p-4">
            {overprint}
          </div>
        ) : null}
      </div>

      {/* Tear line — the ONLY element the punch mask applies to, so the two
          notches reveal the true section surface behind the (background-less)
          Root rather than a same-colour "hole" that would go invisible. */}
      <div className={cn(surfaceClass, "ticket-perf ticket-notch h-7 shrink-0")} aria-hidden="true" />

      {/* Stub — the ticket's own surface scope lives here, since this is
          where every text slot that needs --fg/--fg-muted/--accent-text sits. */}
      <div className={cn(surfaceClass, "flex flex-1 flex-col p-6")}>
        <Heading className="font-display text-heading text-fg line-clamp-2 min-h-[2.4em]">
          {href ? (
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
              // Ring suppressed here — the larger ring around the whole
              // ticket (has-[a:focus-visible] above) is the one that shows.
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
          {showMetrics ? (
            <dl className="grid min-h-24 grid-cols-2 gap-x-4 gap-y-3">
              {metrics?.map((metric, index) => (
                <div
                  key={`${metric.label}-${index}`}
                  className={cn("flex flex-col gap-1", soleMetric && "col-span-2")}
                >
                  <dt className="micro-label">{metric.label}</dt>
                  <dd className="data-line font-medium text-fg">{metric.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {badges ? <div className="mt-4 flex flex-wrap items-center gap-2">{badges}</div> : null}

          {stub ? (
            <div className="hairline-t mt-4 flex items-center justify-between gap-3 pt-4">{stub}</div>
          ) : null}
        </div>
      </div>
    </Root>
  );
}

// Named export for consistency — every component here is importable by name.
export { Ticket };
