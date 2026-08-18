/**
 * Ticket — the shared deal-ticket chassis for `#listings` and `#closings`.
 *
 * Governed by docs/DESIGN-REVISIT-2.md D13 + §5.3–5.4 (this file's spec —
 * landscape/vertical orientation, backing plane, vertical seam, four-level
 * hierarchy, serial, SOLD colour-reveal reversal), D20 (the four-level type
 * system this component enforces), docs/DESIGN-REVISIT.md §2 D4 and §4.5 (the
 * original boarding-pass anatomy this evolves), hokuten-design-director ref 03
 * (Surfaces, Radius), ref 05 (Hovers — "hover lifts nothing"), ref 07 (P0
 * focus, the 5-second CRE gate).
 *
 * ── D-VOCAB / R2 (Razim, 2026-08-17) — the resting shadow is GONE ──────────
 * Brand Design Guide v1.3 (line 29): "hairline rules and outlined boxes —
 * never filled buttons, never rounded card grids, never drop shadows."
 * `docs/LAUNCH-IMPLEMENTATION.md` §1.2 resolves the collision with D4/D13 as
 * R2: the ticket's resting `box-shadow` — BOTH layers, the ink-tinted drop
 * shadow AND D13's `4px 4px 0 0` offset backing plane, since a backing plane
 * implemented as a shadow layer is still a shadow — becomes a single 1px
 * hairline, and hover/focus "elevation" becomes a hairline COLOUR shift.
 * What R2 explicitly does NOT touch, and what therefore stays byte-identical
 * below: the perforation, the two punched notches, the tear line and the
 * landscape/vertical seam flip. That geometry is what makes a ticket read as
 * a ticket; it is the approved D4 signature and is not up for renegotiation.
 * Radii stay on the `--radius-card` TOKEN — never a px literal here. The token
 * layer resolved it to `0` in the same pass, and that is safe for this
 * chassis: the notches are radial-gradient MASKS on the seam strip, not a
 * border-radius, so they render identically at any radius. R2's reserved
 * `--radius-notch` (2px) exists for the case where that ever stops being
 * true; nothing in this file consumes it today, and nothing should start
 * without a dated decision.
 *
 * THIS WAVE (Design Revisit 2, 2026-08-10): Ticket is the ONLY file this
 * agent owns. ClosingCard, ListingCard, both section grids and ContextRail
 * are rebuilt ON TOP of the contract below by other agents next wave — they
 * are NOT touched here, and until they migrate, they keep compiling against
 * the OLD `metrics`-only shape (see "Migration" below) because every new prop
 * is additive and optional.
 *
 * ── Sibling to CardShell, not a wrapper around it (still true) ──────────────
 * CardShell itself is UNTOUCHED — TeamCard keeps behaving exactly as before.
 * See CardShell.tsx for its own contract; this file restates the mechanisms
 * (no-reflow slots, single link target, focus delegation) it shares with
 * CardShell, because a boarding-pass DOM shape does not fit inside
 * CardShell's single content region.
 *
 * ── TWO ELEMENTS, not one: Root (position/stacking only) + the card surface
 *    (everything visual) ───────────────────────────────────────────────────
 * The split ORIGINALLY existed because a box cannot both clip its own
 * children (`overflow-hidden`, needed so the header photo's hover-scale never
 * escapes the card shape) and let an offset shadow layer peek past that same
 * clip. R2 deleted the shadow, so that particular reason is retired — but the
 * two elements stay, for three reasons that never depended on it: Root is the
 * `card-hit group` marker every photo-reveal rule hovers off and must sit
 * ABOVE the clip; Root is the polymorphic `as` element (`li` must not paint a
 * card of its own); and the clip still has to be a separate box from the one
 * that draws the focus ring, which paints OUTSIDE its border box.
 *   Root          `<article>`/`<li>`/`<div>` (the `as` prop) — position/stacking
 *                 host only. `flex h-full flex-col` so a single normal-flow
 *                 child fills it (and so `as="li"` never shows a bullet).
 *                 Carries NO border, radius, shadow, overflow or caller
 *                 `className` — nothing here is meant to be styled directly.
 *   card surface  the one child of Root. `h-full w-full`, `rounded-card`,
 *                 `overflow-hidden` (the clip), the resting hairline and the
 *                 hover/focus colour-shift + focus-ring chain, and caller
 *                 `className`. It carries NO `style` and NO `box-shadow` at
 *                 all. This is where header/seam/content actually live and
 *                 where `lg:flex-row` flips the card from the mobile column
 *                 into the desktop row.
 *
 * ── Dimension: ONE resting hairline, and a hover that shifts its colour ────
 * D13 asked for "a subtle second cardstock layer or offset backing plane
 * behind the ticket, plus the existing ink-tinted resting shadow… the card
 * NEVER lifts, floats or translates on hover." R2 (2026-08-17) supersedes the
 * first half of that sentence and keeps the second: both shadow layers are
 * removed, and the chassis is now stated by a single 1px hairline —
 *   rest       `border border-hairline`  — surface-relative, so it is cream on
 *              paper/ivory/card and a 14% light rule on the dark chapters,
 *              resolved by CSS inheritance from the SECTION's `.surface-*`
 *              scope (the card surface deliberately paints no scope of its
 *              own; the seam and the content zone do).
 *   hover/focus `border-accent-text/40` — a COLOUR shift on the same 1px box.
 * `border-width` never changes, only `border-color`, and `transition-colors`
 * is the only transition — so the card still never lifts, floats, translates
 * or springs, and the reduced-motion block in globals.css already has its
 * designed static state (the colour still changes, it just changes instantly).
 * This is the identical rest/hover law `CardShell` already uses, so the two
 * card families on the page now read as ONE system rather than two.
 * DO NOT reintroduce `box-shadow` here, in any layer, under any name —
 * "backing plane", "cardstock", "offset" — it is the same property and the
 * same guide violation.
 *
 * ── The vertical seam — NEW mechanism, because `ticket-perf`/`ticket-notch`
 *    (globals.css, not owned by this file) only ever drew the horizontal
 *    case ──────────────────────────────────────────────────────────────────
 * Desktop is landscape (D13 item 1): image zone and content/stub zone side by
 * side, divided by a VERTICAL perforation. The shared utilities hard-code a
 * horizontal tear line (`border-top` + notches punched at the element's own
 * left/right edges) — correct for the mobile/tablet stacked case, wrong for
 * the desktop row. Rather than fork a second `Ticket`-like component (the
 * brief explicitly forbids that), the ONE seam element carries responsive
 * Tailwind classes that flip its own geometry at `lg:` (1024px — the same
 * desktop threshold `page-panel`/`stage-shell` already use sitewide):
 *   base (<1024px):  h-7 w-full, border-TOP dashed, notches punched at the
 *                     strip's own LEFT/RIGHT edges (`--hk-notch-h`) — this is
 *                     `ticket-perf`/`ticket-notch`'s exact geometry,
 *                     reimplemented with native Tailwind utilities (see next
 *                     paragraph for why) rather than those two classes.
 *   lg: (>=1024px):   h-full w-7, border-top zeroed, border-LEFT dashed,
 *                     notches punched at the strip's own TOP/BOTTOM edges
 *                     (`--hk-notch-v`) — the new vertical case.
 * Verified against a real Tailwind v4.3 compile (not assumed): a later
 * `lg:`-scoped declaration for the SAME property, on the SAME element,
 * reliably overrides the base declaration at >=1024px, because Tailwind
 * nests the `@media` block after the base rule inside one generated rule —
 * ordinary "last declaration for a matched property wins" cascade, not a
 * specificity fight. That is what makes flipping `border-top` -> `border-
 * left` and swapping the whole `mask-image` safe without `!important`.
 * Why NOT just apply `ticket-perf ticket-notch` at the base and override
 * them at `lg:`: `ticket-notch`'s mask-image is a FIXED value baked into
 * that utility; overriding `mask-image` at `lg:` on the class that already
 * sets it unprefixed works (see above), but overriding `border-top` (a
 * shorthand) with `border-left` while the base rule set the shorthand
 * directly reads far less clearly than two small, symmetrical Tailwind
 * declarations — so this file reimplements the ~4 lines of geometry itself
 * with native utilities and reserves the two shared classes for nothing,
 * keeping the actual notch MASK (the part worth sharing) driven by two CSS
 * custom properties (`--hk-notch-h`/`--hk-notch-v`, defined once in `style`,
 * selected responsively via `[mask-image:var(--hk-notch-h)]` /
 * `lg:[mask-image:var(--hk-notch-v)]`) instead of two fully-duplicated DOM
 * nodes toggled by `hidden`/`lg:hidden`. The gradients use the CSS colour
 * KEYWORDS `black`/`transparent`, never a hex literal — mask alpha stops are
 * not colour in the design-token sense (globals.css's own `ticket-notch`
 * uses a hex literal for the identical reason), but this file has no
 * globals.css exemption to point an auditor at, so it stays keyword-only and
 * never trips a hex-string grep.
 * NEW UTILITY WORTH ADDING to globals.css, reported per the task brief rather
 * than added here (this file does not own globals.css): a `ticket-notch-v`
 * utility mirroring `ticket-notch` with the gradient positions swapped to
 * `50% 0` / `50% 100%`, so a future consumer gets the vertical case as a
 * one-word class instead of the local CSS-variable mechanism above.
 *
 * ── Four-level hierarchy (D20), exactly — no fifth size ──────────────────────
 *   micro   `serial` (optional) — mono tracked caps, e.g. "RECORD 01" /
 *           "OFFERING 02". Rendered ABOVE the title in both orientations.
 *           THIS FILE NEVER GENERATES THE NUMBER. A caller derives it from
 *           the real, already-rendered array index
 *           (`closings.map((c, i) => <ClosingCard … serial={`RECORD
 *           ${String(i + 1).padStart(2, "0")}`} />)`) — Ticket only renders
 *           whatever `ReactNode` it is handed. Never a deal ID, ticket
 *           number, seat, gate, barcode, QR code, "admit one," or any
 *           airline/event fact — that is a QA grep (§9.6) this component
 *           cannot itself fail, because it has no serial-number logic to get
 *           wrong; it is purely a slot.
 *   title   `title` (required) — Fraunces, `text-heading`, unchanged from
 *           the previous version.
 *   price   `price` (optional, reserved) — THE money moment. `text-heading`
 *           (the SAME size step as the title — D20's own table files price
 *           and name under one "Heading/value" tier, differentiated by
 *           typeface, not size) plus `text-money` (mono, tabular, 600,
 *           `--money`). A small `micro-label` caption (`priceLabel`, default
 *           `"Price"`) sits above it so a future non-listing consumer (D15's
 *           Market Reference ticket, e.g. an "Est. value" band) can relabel
 *           the same slot truthfully. Already visibly larger than every
 *           facts-grid value (`text-data`, ~14–15px) without inventing a
 *           fifth type size.
 *   facts   `metrics` (optional, reserved) — UNCHANGED shape/rendering from
 *           the previous version (see "Migration" below for why the prop
 *           name did not change). Keys, cap rate, LP/SP, days, terms —
 *           `text-data` compact mono grid. NEVER the primary price again.
 *
 * ── Migration: `metrics` keeps its old name and shape on purpose ───────────
 * The previous version of this file let callers put price INSIDE `metrics`
 * (`ClosingCard`/`ListingCard` both do this today). This version adds a
 * dedicated `price` slot instead of repurposing `metrics`, and does NOT
 * rename `metrics`/`TicketMetric` — a rename would be a source-breaking
 * change to two files this agent is explicitly not allowed to touch
 * ("WRITE ONLY YOUR ASSIGNED FILES"), and TypeScript's excess-property
 * checking on inline JSX props means a rename would fail `ClosingCard.tsx`
 * and `ListingCard.tsx`'s typecheck immediately. Until the next wave migrates
 * them: both cards keep compiling and rendering exactly as they do today
 * (price still inside the small mono facts grid, not yet promoted to the
 * money moment) — a correct, inert transitional state, not a regression.
 * NEXT-WAVE TODO for whoever rebuilds `ClosingCard`/`ListingCard`: move the
 * `price`-valued entry OUT of each `metrics` array and into the new `price`
 * prop, and add `serial` from the grid's real `.map()` index — otherwise the
 * four-level hierarchy this file now enforces never actually reaches the
 * page.
 *
 * ── Retired (SOLD) colour-reveal — REVERSED from the previous version,
 *    and now fully self-contained ───────────────────────────────────────────
 * D13/Revisit 2 (2026-08-10) explicitly reverses Revisit 1: "sold photography
 * is grayscale at rest and reveals full color on hover, keyboard focus, and
 * the existing touch-reveal action." The PREVIOUS version of this file forced
 * an unconditional `grayscale` filter on the header WRAPPER whenever
 * `retired` was true — permanently re-desaturating the image regardless of
 * hover, because a PARENT filter composites on top of whatever the CHILD's
 * own filter already rendered and cannot "undo" a desaturation the child
 * already applied. (This also meant retired tickets printed in grayscale,
 * contradicting this very stylesheet's own print rule — "Sold tickets print
 * in full colour, not the grayscale rest state" — since print only resets
 * `.photo-reveal`/`[data-reveal-photo]`, never a bare `.grayscale` utility. A
 * latent bug this rewrite incidentally fixes.)
 * This version targets the `<img>` DIRECTLY (`[&_img]:…`, a descendant
 * selector on the header wrapper) instead of layering a competing parent
 * filter, so retired's grayscale-at-rest/colour-on-reveal is a real override
 * of the photo's own filter value, not a second filter fighting the first —
 * and it no longer depends on the caller's `PhotoFrame` `reveal` prop being
 * left at its default:
 *   retired && "[&_img]:grayscale"              // rest: force grayscale
 *   retired && "group-hover:[&_img]:grayscale-0" // pointer hover: full colour
 * `.group` is Root's own `card-hit group` class (Tailwind's `group-hover:`
 * compiles inside `@media (hover: hover)`, verified against a real compile —
 * it will not stick on tap the way a bare `:hover` can). Touch reveal needs
 * NO extra rule here: `PhotoFrame`'s own `.tapped` class carries `!important`
 * (`@utility tapped` in globals.css) specifically so nothing else in the
 * cascade, including this file's overrides, can out-rank it — the existing
 * touch-reveal action already works unmodified.
 * Keyboard focus is the one gap even PhotoFrame's own `photo-reveal` utility
 * never covered (it only ever wired `:hover`), so this file adds it ONCE,
 * unconditionally, for every ticket's header photo — retired or not, since a
 * keyboard user deserves the same reveal a mouse user gets on any ticket,
 * not only a sold one:
 *   "group-focus-within:[&_img]:grayscale-0"
 * The SOLD `overprint` stamp keeps rendering unconditionally off its OWN
 * `overprint` prop (not gated by `retired` — a caller could theoretically
 * want one without the other) and stays visible through both the grayscale
 * and colour states, because it lives in its own stacked layer over the
 * photo, never inside the photo's own filter chain.
 *
 * ── Landscape image zone: filling the row's real height, not the photo's
 *    own aspect box ─────────────────────────────────────────────────────────
 * The header slot is `ReactNode` — usually a `PhotoFrame` carrying its own
 * `aspect` (e.g. `3/2`). That fixed aspect is exactly right for the mobile
 * stacked band, but wrong for the desktop row: the row's height is set by
 * the CONTENT column (title + price + facts + stub, reliably taller than a
 * `3/2` crop at the image column's width), so a photo that insists on its
 * own aspect ratio would leave visible surface-coloured space under it
 * instead of bleeding the image zone edge-to-edge. `aspect-ratio` only
 * constrains a box when at least one of width/height is `auto` — so at
 * `lg:`, the header wrapper forces the header's FIRST rendered child (the
 * `PhotoFrame` box) to `aspect-auto` + explicit `h-full w-full`, which makes
 * both dimensions definite and removes `aspect-ratio` from the sizing
 * decision entirely; `PhotoFrame`'s own `<Image fill>` already renders at
 * `h-full w-full` of THAT box regardless of aspect (unchanged, verified by
 * reading `PhotoFrame.tsx`), so the whole chain — wrapper -> PhotoFrame's
 * div -> the image — ends up filling the true row height. This is a
 * documented CONTRACT, not a coincidence: **the header's first rendered
 * element must be the fixed-aspect photo/placeholder frame.** A status badge
 * or other overlay must render AFTER it, absolutely positioned — exactly
 * what `ListingCard` already does (`{headerPhoto}<div className="absolute
 * left-3 top-3 …">`), so no existing caller needs to change for this to
 * work. At <1024px the override is `lg:`-scoped and never applies, so the
 * mobile band keeps its exact current `3/2` behaviour, unchanged.
 *
 * ── Focus ring: mask does not clip it (confirmed, per the task brief) ──────
 * The notch mask is scoped to the ~28px seam strip alone, never to the card
 * surface element that carries `has-[a:focus-visible]:outline-*`. `outline`
 * paints OUTSIDE that element's own border box (`outline-offset-2`) as an
 * entirely separate layer from any child's `mask-image` — a mask on an
 * unrelated descendant cannot clip an outline drawn around a DIFFERENT
 * (ancestor) box. Verified by reading the two mechanisms independently, not
 * assumed: nothing in this file makes the card-surface element itself
 * `mask`-ed, only the seam strip is.
 *
 * ── The no-reflow contract, extended with `price` ───────────────────────────
 * A ticket with three facts and one with none must be the same height, and
 * now so must a ticket with a price and one without:
 *   header   — carries its own fixed aspect at <1024px (the caller's
 *              PhotoFrame `aspect` prop); Ticket does not impose one.
 *   title    — 2 lines reserved (min-h 2.4em @ 1.2 line-height), clamped.
 *   meta     — 2 lines reserved (min-h 3.2em @ 1.6), clamped. Reservation
 *              happens even when empty; pass `reserveMeta={false}` only when
 *              NO ticket in the grid uses the slot.
 *   price    — reserved (min-h ~3.25rem) whenever `reservePrice` (default
 *              true), even for a ticket that omits `price` itself — the
 *              label+value pair only RENDERS when `price !== undefined`
 *              (never a dangling "Price" caption over nothing), but the
 *              space stays reserved so mixed grids stay level. Pass
 *              `reservePrice={false}` only when no ticket in the grid ever
 *              supplies one.
 *   metrics  — reserved for two rows (min-h 6rem) regardless of item count.
 *   badges / stub — bottom-pinned together via `mt-auto`, unchanged.
 *
 * ── One link target (unchanged mechanism, now living on the card surface
 *    element instead of Root) ────────────────────────────────────────────────
 * When `href` is given, a real `<a>` wraps the title and stretches over the
 * WHOLE card via `::after`. Its nearest positioned ancestor is now the card
 * surface `<div>` (which carries `relative isolate`) rather than Root — the
 * two are the same size (the surface is `h-full w-full` of Root), so this is
 * a purely structural change with no visible or behavioural difference.
 * Screen readers get one link named by the title; pointers get the whole
 * tile. Any second real interactive element (the `stub` slot's mailto button)
 * must carry `relative z-2` to sit above that overlay, unchanged.
 *
 * ── Focus ring on the whole ticket, not just the title (unchanged) ─────────
 * `has-[a:focus-visible]` on the card surface delegates the ring to the
 * whole visible card. D4/D13 dropped the always-on hairline in favour of the
 * resting shadow doing that job; R2 reverses that trade — the hairline is
 * back on at rest and IS the chassis — so the surface carries `border
 * border-hairline` and transitions only `border-color`, never `border-width`.
 *
 * ── `onDark` — REMOVED by R2, deliberately not left as a dead prop ──────────
 * The prop existed for exactly one purpose: selecting `--shadow-ticket-dark`
 * over `--shadow-ticket`. With no shadow there is nothing for it to select,
 * and the replacement hairline needs no equivalent — `--hairline` is
 * surface-scoped and already resolves correctly on `.surface-dark` /
 * `.surface-black` by inheritance. No caller ever passed it (verified by
 * grep across `components/`, `app/`, `content/`, `lib/`), so removing it is
 * not a source-breaking change. A dark-surface ticket needs no prop at all.
 *
 * Server Component — no client JS of its own. The header/photo the caller
 * passes in (PhotoFrame) carries the only client boundary, same as CardShell.
 */

import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/** One `{label, value}` pair in the structured facts grid below the seam.
 *  NEVER the primary price going forward — that is the dedicated `price`
 *  prop. Name/shape kept for source compatibility; see "Migration" above. */
export type TicketMetric = {
  /** Tiny-caps label, e.g. "Keys", "Cap rate", "LP/SP", "Days", "Terms". */
  label: string;
  /** Bold mono value. Pass the ALREADY-FORMATTED string/number — Ticket does
   *  not reformat deal data (content law: import formatters, never re-derive). */
  value: ReactNode;
};

export type TicketProps = {
  /** Photo (PhotoFrame, carrying its own fixed aspect) or a designed surface
   *  where no photo exists — the no-photo state is a caller concern (e.g.
   *  `content/artwork.ts`'s glyph-art placement), Ticket only renders
   *  whatever it is given. Required — every ticket has a header band.
   *  CONTRACT: the first rendered child must be the fixed-aspect frame; any
   *  status badge/overlay must come after it in DOM order, absolutely
   *  positioned (see the landscape image-zone note above). */
  header: ReactNode;
  /** Stamp content for the retired state — e.g. `<span className="overprint bg-paper px-3 py-1">SOLD</span>`.
   *  Positioned bottom-right inside the header band, pointer-events-none.
   *  Renders whenever this prop is supplied, independent of `retired`. */
  overprint?: ReactNode;
  /** Restrained micro-caps record/offering serial, e.g. "RECORD 01". MUST be
   *  derived by the caller from the real, already-rendered array index —
   *  Ticket has no serial-generation logic of its own and never invents a
   *  deal ID, ticket number, seat, gate, barcode, QR code, "admit one," or
   *  any airline/event fact. Rendered above the title in both orientations. */
  serial?: ReactNode;
  /** Hotel name. Becomes the link's accessible name when `href` is set. */
  title: ReactNode;
  /** Sans caption line — "Lake Harmony, PA · Full-Service". */
  meta?: ReactNode;
  /** THE money moment (D13/D20): `text-heading` + `text-money`, visibly
   *  larger than every facts-grid value. Pass the ALREADY-FORMATTED string
   *  (e.g. `displayPrice(listing.price)`, which already returns the
   *  approved "Price on Request" fallback) — Ticket does not reformat or
   *  invent a value. Omit entirely (not `reservePrice={false}`) only for a
   *  ticket variant that genuinely has no price-shaped figure. */
  price?: ReactNode;
  /** Micro-caps caption above `price`. Default `"Price"` — override for a
   *  non-listing consumer (e.g. a future "Est. value" reference ticket). */
  priceLabel?: string;
  /** The structured facts grid below the seam — keys, cap rate, LP/SP, days,
   *  terms. A single entry spans both columns rather than leaving a
   *  half-empty row. NEVER the primary price (see "Migration" above). */
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
  /** Retired/SOLD visual state: photo is grayscale at rest, full colour on
   *  pointer hover, keyboard focus-within and the existing touch-reveal
   *  action (D13 — reverses Revisit 1's "always muted" rule). Pair with
   *  `overprint` for the SOLD stamp, which stays visible in both states. */
  retired?: boolean;
  /** Stub body surface. `card` on a paper/deep section, `paper` on a deep band. */
  surface?: "card" | "paper";
  /** Heading level — keep the document outline honest inside its section. */
  titleAs?: "h2" | "h3" | "h4";
  /** Element role. `li` when the grid is a real list. */
  as?: "article" | "li" | "div";
  reserveMeta?: boolean;
  reserveMetrics?: boolean;
  /** Reserves the price slot's height even when `price` is omitted, so a
   *  grid mixing priced and unpriced tickets stays level. Default true. */
  reservePrice?: boolean;
  className?: string;
};

/* ---------------------------------------------------------------------------
 * The seam's notch masks — two orientations of the same idea. See the file
 * header's "vertical seam" note for why this lives here (CSS custom
 * properties, switched responsively via the seam element's own className)
 * instead of either editing globals.css or duplicating the seam into two DOM
 * nodes. Colour KEYWORDS only (`black`/`transparent`), never a hex literal —
 * see the same note.
 * ------------------------------------------------------------------------- */
const NOTCH_MASK_HORIZONTAL =
  "radial-gradient(14px 14px at 0 50%, transparent 13px, black 13.5px), " +
  "radial-gradient(14px 14px at 100% 50%, transparent 13px, black 13.5px)";
const NOTCH_MASK_VERTICAL =
  "radial-gradient(14px 14px at 50% 0, transparent 13px, black 13.5px), " +
  "radial-gradient(14px 14px at 50% 100%, transparent 13px, black 13.5px)";

const seamStyle = {
  "--hk-notch-h": NOTCH_MASK_HORIZONTAL,
  "--hk-notch-v": NOTCH_MASK_VERTICAL,
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
} as CSSProperties;

export default function Ticket({
  header,
  overprint,
  serial,
  title,
  meta,
  price,
  priceLabel = "Price",
  metrics,
  badges,
  stub,
  href,
  external = false,
  retired = false,
  surface = "card",
  titleAs: Heading = "h3",
  as: Root = "article",
  reserveMeta = true,
  reserveMetrics = true,
  reservePrice = true,
  className,
}: TicketProps) {
  const showMeta = reserveMeta || meta !== undefined;
  const showMetrics = reserveMetrics || (metrics !== undefined && metrics.length > 0);
  const showPrice = reservePrice || price !== undefined;
  const surfaceClass = surface === "paper" ? "surface-paper" : "surface-card";
  const soleMetric = metrics?.length === 1;

  return (
    <Root className="card-hit group relative isolate flex h-full flex-col">
      {/* The card surface — everything visual lives here. `lg:flex-row` is
          the landscape switch (D13 item 1): mobile/tablet stay the existing
          column (header / seam / content stacked); desktop >=1024px becomes
          a row (image zone / seam / content-stub zone side by side). Same
          three children, same DOM order, in both cases. */}
      <div
        className={cn(
          "relative isolate flex h-full w-full flex-col overflow-hidden rounded-card",
          "lg:flex-row",
          // R2 (D-VOCAB): the chassis is a 1px hairline, never a shadow. Only
          // `border-color` animates — the card still never lifts or moves.
          "border border-hairline transition-colors duration-base ease-out",
          href && "hover:border-accent-text/40",
          "has-[a:focus-visible]:border-accent-text/40",
          "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus",
          className,
        )}
      >
        {/* Header band — own opaque content (photo or designed surface).
            At <1024px this keeps the caller's own PhotoFrame aspect ratio
            (unchanged). At >=1024px it becomes the landscape image zone: a
            fixed ~40% column, full row height — see file header "Landscape
            image zone" note for the aspect-ratio override contract. */}
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-none",
            "lg:h-full lg:w-auto lg:shrink-0 lg:grow-0 lg:basis-2/5",
            "lg:[&>:first-child]:aspect-auto lg:[&>:first-child]:h-full lg:[&>:first-child]:w-full",
            // Keyboard-focus colour-reveal parity, every ticket (see file
            // header "Retired" note for why this targets `img` directly).
            "group-focus-within:[&_img]:grayscale-0",
            retired && ["[&_img]:grayscale", "group-hover:[&_img]:grayscale-0"],
          )}
        >
          {header}
          {overprint ? (
            <div className="pointer-events-none absolute inset-0 z-1 flex items-end justify-end p-4">
              {overprint}
            </div>
          ) : null}
        </div>

        {/* Seam — the perforated tear line. Horizontal (border-top, notches
            on the strip's own left/right edges) below 1024px; vertical
            (border-left, notches on the strip's own top/bottom edges) at
            >=1024px. Same element, same two CSS-variable masks, switched by
            the `lg:` classes below — see file header "vertical seam" note.

            UNCHANGED BY R2 — every value here is byte-identical to the
            pre-R2 build. Two measured consequences of R2 that a design
            reviewer with a real render should rule on, recorded here rather
            than "fixed" by inventing geometry this file was told to preserve:

            1. The card surface's hairline now PAINTS, where it used to be
               `border-transparent`. A mask on this strip cannot remove a
               border painted by its PARENT, and the parent's
               `overflow-hidden` clips to the padding box, so the strip cannot
               overhang and cover it either. Result: a 1px hairline runs
               across the mouth of each notch, so the bite reads as a void
               just inside the card edge rather than a bite out of it.
            2. The notch void shows the SECTION ground through the card. With
               the resting shadow gone, that is `--paper` (#fbf9f3) against a
               `--card` (#ffffff) interior — a ~2% tonal step. The shadow used
               to be most of what made the punch legible.

            If a render says the notch has lost its read, the fix is to move
            the hairline OFF the card surface and onto the three zones (header
            `border-x border-t`, this strip `border-x`, content
            `border-x border-b`, all flipped at `lg:`): a mask DOES remove the
            masked element's own border, so the bite comes back clean. That
            costs ~15 responsive lines plus an arbitrary
            `[border-top-style:dashed]` (Tailwind has no per-side border-style
            utility) and changes corner joins — real work, and not something
            to do blind. Do NOT instead reintroduce a shadow. */}
        <div
          aria-hidden="true"
          style={seamStyle}
          className={cn(
            surfaceClass,
            "h-7 w-full shrink-0 border-t border-dashed",
            "lg:h-full lg:w-7 lg:shrink-0 lg:grow-0 lg:border-t-0 lg:border-l",
            "[-webkit-mask-image:var(--hk-notch-h)] [mask-image:var(--hk-notch-h)]",
            "lg:[-webkit-mask-image:var(--hk-notch-v)] lg:[mask-image:var(--hk-notch-v)]",
          )}
        />

        {/* Content/stub zone — the ticket's own surface scope lives here,
            since this is where every text slot that needs
            --fg/--fg-muted/--accent-text sits. Reading order top to bottom
            IS the four-level hierarchy: micro serial -> serif title -> mono
            money price -> compact mono facts. */}
        <div className={cn(surfaceClass, "flex flex-1 flex-col p-6 lg:p-7")}>
          {serial ? <p className="micro-label mb-2">{serial}</p> : null}

          <Heading className="font-display text-heading text-fg line-clamp-2 min-h-[2.4em]">
            {href ? (
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
                // Ring suppressed here — the larger ring around the whole
                // card (has-[a:focus-visible] above) is the one that shows.
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

          {showPrice ? (
            <div className="mt-3 min-h-[3.25rem]">
              {price !== undefined ? (
                <>
                  <p className="micro-label">{priceLabel}</p>
                  <p className="text-heading text-money leading-none">{price}</p>
                </>
              ) : null}
            </div>
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
      </div>
    </Root>
  );
}

// Named export for consistency — every component here is importable by name.
export { Ticket };
