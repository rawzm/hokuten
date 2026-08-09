> ## ⚠️ PARTIALLY SUPERSEDED — D4 ticket cards, Design Revisit round (2026-08-08/09)
>
> Verified against `site/components/cards/ClosingCard.tsx` and
> `site/components/cards/Ticket.tsx` on 2026-08-09, not skimmed. **The IA
> block and `CardShell`-based component plan below describe a chassis that
> has been rebuilt.** `docs/DESIGN-REVISIT.md` §2 D4 and §4.5: closing cards
> are now the "retired" state of the shared `Ticket` chassis
> (`components/cards/Ticket.tsx`), not `CardShell` + `PhotoFrame` + `Badge`.
> Per `ClosingCard.tsx`'s own header ("What moved, D4 → the new ticket
> anatomy"):
> - **`<Badge status="closed" />` is RETIRED.** The "closed" signal now lives
>   entirely in the header band: `Ticket`'s `retired` prop grays the photo
>   (regardless of hover state) and adds a "Sold" `overprint` stamp
>   positioned bottom-right on the photo — hanko-adjacent, deliberately not a
>   "cheesy red rubber stamp" (D4's own wording). This spec's line "`badge`
>   `<Badge status="closed" />` → 'CLOSED'" no longer describes shipped code.
> - The single joined `data` line (metrics string + accent price span) became
>   a real **two-row structured metrics grid** (`Ticket`'s `metrics` prop):
>   Price first (matching `ListingCard`'s "price is always first" convention),
>   Terms (the LP/SP/days string) second.
> - The resting ink-tinted `--shadow-ticket-dark`/`--shadow-ticket` shadow
>   (D4) is new — this section's own "No shadow lift" framing (§"States",
>   "no translate, no shadow, no size change") is now half-superseded: **no
>   shadow change on hover** still holds, but a resting shadow is now present
>   at all times (not absent, as this file implies) — "never translate a
>   card" is unchanged and still binds.
> - Header aspect changed from this file's 4:3 to the artwork manifest's
>   fixed 3:2 "card" variant, shared with `closings.accent`
>   (`content/artwork.ts`).
>
> **Still accurate, not touched by D4:** the Intent, the "no click-through
> target" decision and its reasoning, the grid breakpoints, the print rules,
> and the accessibility section's substance (re-verify the exact DOM shape
> against `Ticket.tsx`, not `CardShell.tsx` — the underlying elements
> changed). `ClosingCard.tsx`'s own header comment is more current than the
> component-plan/IA blocks below for anything about the visual chassis.

# `#closings` — Recently Closed (Track Record)

Status: **approved**

## Intent

Ref 04 §`#closings`: "Micro-label `[ 01 — TRACK RECORD ]`; Display-2 header. 6
ClosingCards: photo (B&W→color), serif hotel name, meta line (location · keys
· segment), mono metrics line (LP/SP % · days · price; 'Confidential' where
applicable), CLOSED badge." This is the site's proof section — the heritage
register (real hotel photography, serif names) and the enterprise register
(mono tabular deal data) both read in the same viewport, per the sitewide
design thesis. All six closings are `verified-current` (ref 06 claims
register, "Closings (6) — deal figures") — nothing here is retyped or
invented; content comes verbatim from `site/content/closings.ts`.

Unlike `#faq`, ref 04 gives `#closings` an explicit numbered micro-label
(`[ 01 — TRACK RECORD ]`), confirmed again in ref 06's copy-patterns example.
No index-collision risk to resolve here.

## IA

```
<section id="closings" aria-labelledby="closings-heading" class="surface-paper section-pad">
  <div class="container-hk">
    <SectionHeader>                          -- single Reveal (no stagger)
      MicroLabel  [ 01 — TRACK RECORD ]
      h2#closings-heading  Display-2, one italic word
    <Reveal as="ul" stagger>                  -- 6 children = ref 05 stagger cap, exact
      6 × <Reveal.Item as="li">
            <ClosingCard>
              CardShell (as="article", surface="card", titleAs="h3", no href)
                photo  PhotoFrame  aspect="4/3"  (port doc: closings = 4:3, listings = 5:4 — do not conflate)
                title  hotel name, plain text (no click-through target — ref 04 gives listings a
                       Crexi link but says nothing of the sort for closings; these are proof, not inventory)
                meta   metaLine([location, `${keys} keys`?, segment, note])
                data   metrics string (fg-meta, inherited) + price (accent-text, font-medium)
                badge  <Badge status="closed" />  →  "CLOSED"
  </div>
</section>
```

## Component plan

- `SectionHeader` (atom, unmodified) — `id="closings-heading"`, `index="01"`,
  `label="Track record"`, headline `"12 closed transactions — *six* shown in
  full."` (one italic word: *six*; the "12" cites the already-verified
  aggregate stat, not a new claim). No `sub` — ref 04 lists none for this
  section and inventing one would be uncited voice-copy.
- `ClosingCard` (new, owned) composes `CardShell` (read, unmodified) +
  `PhotoFrame` + `Badge`. No new atom/primitive needed.
- `Reveal` / `Reveal.Item` (motion, unmodified) — stagger container holding
  exactly 6 items, at the ref 05 cap (no dev warning).

## States

- **Default**: photo grayscale, hairline card border, mono metrics in
  `--fg-meta`, price in `--accent-text` at mono weight 500.
- **Hover** (pointer, `hover: hover`): photo → colour + `scale(1.02)`
  (`photo-reveal`, `duration-base`/`ease-out`); card hairline → accent at 40%
  opacity. No translate, no shadow, no size change (ref 05). Applied via an
  explicit `hover:border-accent-text/40` class on `ClosingCard` rather than
  relying on `CardShell`'s `href &&` gate, because these cards carry no link —
  see "No click-through target" below.
- **Touch / tapped**: `PhotoFrame`'s own tap toggle (kwc parity) reveals
  colour without navigation; unaffected by the missing `href`.
- **Focus**: none — no focusable element inside a hrefless card. `CardShell`'s
  `has-[a:focus-visible]` rules are simply inert here, not a regression.
- **Reduced motion**: hover/tap colour-reveal transitions collapse to instant
  (global `prefers-reduced-motion` block in `globals.css`); the section
  `Reveal` renders its final visible state — see Motion.
- **Print**: `img { filter: none !important }` (globals.css §8) restores
  colour photography on the printed page; `.surface-card` stays white in both
  screen and print. Grid degrades to `print:grid-cols-1` (added here, a
  Tailwind print-variant utility on a file this section owns — no shared token
  file touched) so a printed copy reads as a clean single-column list rather
  than three cramped columns; each card gets `print:break-inside-avoid` so a
  tile never splits across a page break.

## No click-through target (decision)

Ref 04's `#closings` bullet lists no destination for a closing tile — contrast
with `#listings`, which explicitly says "card links to Crexi." The port pack
(`docs/port/03-deals.md` §A.0) flags the old site's closing-grid "View all"
link as Dino-personal and **not to ship**. Closed deals are proof, not
inventory a visitor can act on, so `ClosingCard` renders `CardShell` without
`href`: the title is plain text, not a link. This preserves the hover/photo
affordance (gated on the always-present `card-hit` marker class, not on
`href`) while shipping zero invented navigation.

## Accessibility

- `<section id="closings" aria-labelledby="closings-heading">` → `SectionHeader`'s
  own `h2` carries the matching id.
- Every closing is a real `<li>` inside a `<ul>` (`Reveal`/`Reveal.Item` as
  `ul`/`li`) — a screen reader announces "list of 6 items," matching the "6
  ClosingCards" the design calls for.
- No hover-only information: the colour reveal is decoration only (per
  `PhotoFrame`'s own contract) and touch gets the identical `tapped` toggle:
  nothing about a closing's data depends on hover state.
- `Badge`'s CLOSED label and the mono metrics/price line are always-rendered
  text, not colour-only or icon-only signals.
- Photo `alt` text (from `content/closings.ts`) describes each hotel, not the
  grayscale/colour treatment — verified by reading the content file's own
  values.
- Body/meta/data type never drops below the 16px floor (`text-body`,
  `text-data` ramp tokens only — no new sizes introduced).

## Motion

Two motion layers, both existing tokens, nothing new:
1. `SectionHeader` sits inside no explicit `Reveal` of its own in this
   file — it is the first stagger-free element; ref 05 doesn't require every
   sub-element to be independently wrapped, and adding a second reveal here
   for a two-line header would be motion for its own sake. (If a future audit
   wants the header to reveal independently of the grid, wrap it in its own
   `<Reveal>` — not done here to keep one clear reveal boundary per section.)
2. `<Reveal as="ul" stagger>` — `STAGGER_CONTAINER` timing (`STAGGER` = 70ms
   per child) around exactly 6 `<Reveal.Item as="li">` children, each using the
   standard reveal variant: `opacity 0→1` + `translateY 16px→0`,
   `duration-reveal` (600ms), `ease-out`, fires once at 20% viewport
   intersection. Card-internal hover/tap transitions are `duration-base`
   (300ms) `ease-out`, per `photo-reveal`/`CardShell`'s existing CSS — nothing
   reimplemented.

**Known cross-cutting risk (not fixed here, out of this section's owned
files):** `Reveal`'s "armed" elements start at `opacity: 0` client-side before
their `IntersectionObserver` fires. `globals.css`'s `@media print` block does
not reset motion-armed opacity, so a user who prints before scrolling every
section into view could print blank space where an un-revealed section would
have been. This applies to every `Reveal`-wrapped section sitewide, not
uniquely to `#closings`; flagging for whichever agent owns `Reveal.tsx` /
`globals.css`'s print block, per "report needed changes instead" (AGENT
BRIEF → Engineering).

## Acceptance criteria

- [ ] All 6 closings render from `@/content/closings`, one per `<li>`, no
      retyped copy — name, location, keys, segment, note, metrics, price all
      read directly off the `Closing` object.
- [ ] Rohnert Park (`Two-property portfolio`, no keys, no note) and Carte
      Hotel (`JV / equity capital arranged` note, the longest meta line at 69
      characters) both fit `CardShell`'s fixed 2-line meta reservation without
      visually breaking the tile grid — verified by word-wrap arithmetic
      against the `metaLine()` single-space middot separator (shorter than the
      kwc source's double-space convention, so more headroom, not less).
  - [ ] Confidential slot (HIE Brooklyn: `"Confidential · $227K/key"`) renders
        verbatim, no synthetic "—" inserted for the missing day count.
- [ ] `CLOSED` badge renders via `<Badge status="closed" />` reading
      `STATUS_PRESENTATION` — no hardcoded label string in `ClosingCard`.
- [ ] Grid is 1-up mobile → 2-up `md:` (≥768px, card width stays ≥320px at
      that step) → 3-up `lg:` (≥1024px), per ref 03's card-grid rule.
- [ ] Hover: photo grayscale→colour + `scale(1.02)`, ring → hairline accent
      40%, no translate, no shadow — verified against `photo-reveal` /
      `CardShell` source, not re-implemented.
- [ ] Stagger caps at exactly 6 children (no dev-console warning).
- [ ] No hex/`rgb()`/Tailwind-default-palette colour anywhere in
      `ClosingsSection.tsx` / `ClosingCard.tsx` — every visual value is an
      existing token/utility (`surface-paper`, `surface-card`, `section-pad`,
      `container-hk`, `text-accent-text`, `text-fg-meta`, `data-line`,
      `font-medium`, `rounded-card`, `hairline`).
- [ ] `<section aria-labelledby>` points at the section's own `h2`.
- [ ] `npx tsc --noEmit --incremental false` clean for both owned files.
