# `#listings` — Hotels for Sale

## Section / Route

Landing page, section 5 of 13 (ref 04 §Section order). Anchor `#listings`, single-page Phase 1; graduates to its own route in Phase 3 per ref 04's chassis note. Sits between `#closings` (track record, proof of past performance) and `#calculator` (the owner-side tool) — this section is the buyer-side proof: what a CRE investor can act on today.

## Status

`approved` — every open question below is pre-resolved; nothing blocks implementation.

## Intent

**The gate (ref 07, verbatim): a LoopNet/Crexi user finds price, keys, cap rate and how to contact within 5 seconds.** This section is judged against that literally, not against how it looks in isolation. Everything else — the empty state, the placeholder art, the trust boundary on outbound links — exists to serve that gate honestly when the underlying data doesn't have an answer, rather than hiding the gap.

Design posture: enterprise-platform register leads here (mono price, tabular data, hairline badges) with heritage/hospitality warmth carried only by the section's warm surface and the intentional placeholder art — this is the one section of the three registers (ref AGENT-BRIEF "Design thesis") where a CRE professional most needs to feel "at home, just upgraded," so data density wins over ornament.

## Content sources (do not retype)

- `site/content/listings.ts` — `listings` (5-row static seed, Phase 1), `isTrustedCrexiUrl()`, `listingsEmptyState`.
- `site/lib/types.ts` — `Listing`.
- `site/lib/status.ts` — `STATUS_PRESENTATION` (all 5 seed rows are `status: "listed"` → renders the EXCLUSIVE badge; this is intentional, ref 04 §`#listings` + `status.ts`'s own comment: "the a100 public feed is Listed-stage only, so a feed row's `listed` IS our exclusive mandate").
- `site/lib/utils.ts` — `displayPrice`, `displayCapRate`, `metaLine`.
- `site/content/site.ts` — `A100_ARMS_SIGNUP_URL`, `CONTACT` (mailto fallback for the untrusted-link degrade path).

### Content gap — flagged, not invented

Ref 04 §`#listings` specifies two fixed copy fragments verbatim that have no home in `site/content/listings.ts` (a file this agent does not own): the section headline and the sub-line "Powered by our confidential channel." Per the established pattern elsewhere (`content/doors.ts`'s `headline`/`body`, `content/mandates.ts`'s `mandatesDeck`/`mandatesDiscretion`), section-chrome copy like this normally gets a named export in the section's content file. Since that file is out of scope here, the headline and sub-line are authored as local constants at the top of `ListingsSection.tsx` with a citation comment, not invented — the sub-line is ref-04 verbatim and the headline is new copy in the established voice (sentence-case, one italic word, no banned words). **Recommendation for the content owner:** promote `LISTINGS_HEADLINE` / `LISTINGS_SUB` into `content/listings.ts` when that file is next touched, so the section stops carrying literal copy.

## IA

```
<section id="listings" aria-labelledby="listings-heading" class="surface-deep section-pad">
  <div class="container-hk">
    <SectionHeader id="listings-heading"
      index="02" label="Hotels for sale"
      headline="On the market, handled *quietly*."
      sub="Powered by our confidential channel." />

    [populated]                              [empty]
    <ul class="grid ...">                    <div class="empty-state surface-card hairline">
      <li> <ListingCard/> </li> × 5             <Lock/>
      ...                                        <p>{listingsEmptyState}</p>
    </ul>                                        <Button → a100 Arms signup>
                                               </div>
  </div>
</section>
```

**Micro-label index — decision, locked.** Ref 04 gives `#closings` the explicit bracket text `[ 01 — TRACK RECORD ]` but says nothing verbatim for `#listings`. Since `#listings` is the very next chaptered section in page order and ref 04's brand-line/menu-overlay numbering is a *separate* sequence from the in-page chapter index (the overlay assigns Listings `02`/Track Record `03`, while the in-page device inverts that — closings is chapter `01`), this section continues the in-page chapter sequence at **`02`**, with label text **"Hotels for sale"** (already the exact phrase used for this anchor in `content/site.ts`'s footer nav — `{ label: "Hotels for sale", href: anchor("listings") }` — so the micro-label and the footer link now share one vocabulary instead of inventing a second phrase for the same destination).

## Component plan

### `ListingCard` (`site/components/cards/ListingCard.tsx`)

Composes `CardShell` — no new chassis, no new radius/surface tokens.

| CardShell slot | Content | Notes |
|---|---|---|
| `photo` | `PhotoFrame` — `src={listing.photo}` `alt={listing.photoAlt}` `aspect="4/3"` `sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"` | See "Photo aspect" below for why `4/3`, not the placeholder SVG's native 5:4. |
| `title` | `listing.name`, plus a `visually-hidden` " — view listing on Crexi" span when the card is a live link | `CardShell` already appends its own " (opens in a new tab)" when `external` — the extra span satisfies "an accessible name saying where it goes," not just that it opens a tab. |
| `meta` | `metaLine([locationLabel, listing.brand, listing.serviceLevel, keysLabel])` | `locationLabel` = `"{city}, {stateCode}"` when `city` is non-empty, else `stateCode` alone (matches the content file's own "never invent a municipality" rule). `keysLabel` = `"{roomCount} keys"` when `roomCount` is set. `brand` slots in between location and service level — the two seed rows that carry it (`Developer Inn Highway` / `Developer Inn Downtown Orlando`) need it visible somewhere, and `CardShell`'s slots don't have a dedicated place for it. All four parts are optional; `metaLine` drops whatever is absent, matching Phase 1's actual data (no seed row has `roomCount` or `serviceLevel` yet). |
| `data` | `<span class="font-medium text-fg">{displayPrice(listing.price)}</span>` | The chassis' own `data` wrapper defaults to `text-fg-meta` (muted) — overridden to `text-fg` + `font-medium` here because price is the single highest-priority number on the card (the 5-second gate names it first) and AGENT-BRIEF's typography law reserves mono 500 for exactly this: "emphasised data values." No other card in the (not-yet-built) grid needs this override; it's local to `ListingCard`, not a `CardShell` change. |
| `badge` | Cap-rate chip (`Badge label={displayCapRate(...)}`) **only when it returns non-null** → status `Badge` (`STATUS_PRESENTATION`, always renders) → contact-route link (see below), only in the degrade case | Order matches ref 04's read order: price → cap → status → contact. |
| `href` / `external` | `listing.crexiUrl` / `true` **only when** `isTrustedCrexiUrl(listing.crexiUrl)` passes | See "Crexi trust boundary." |

**Crexi trust boundary.** `isTrustedCrexiUrl()` (from `content/listings.ts`, the ported kwc guard) runs before any anchor is ever emitted. Two failure shapes exist in the `Listing` type even though none of the 5 seed rows hit them today: `crexiUrl` absent, or present but not `crexi.com`. Both degrade identically — the card renders `CardShell` **without `href`** (title becomes plain text, no whole-card `<a>`, no hover-ring affordance) and the badge row gains a real contact route instead of a dead or mismatched link: a `Button variant="link" asChild` wrapping a genuine `mailto:` anchor (`CONTACT.emailHref` from `content/site.ts`), labelled "Email us about this listing" with a `visually-hidden` suffix spelling out the address for screen-reader users who skip visual context. This is never a placeholder state — it's a fully real, always-correct action regardless of what's wrong with the source data.

**Photo aspect — decision, locked.** `site/public/art/listing-placeholder.svg` is authored at a 500×400 viewBox (5:4, ratio 1.25) — its own header comment says so — but `PhotoFrame`'s registered `PhotoAspect` union (`3/2 · 4/3 · 16/9 · 1/1 · 4/5 · 3/4`) has no 5:4 entry, and this agent does not own that file to add one. `4/3` (ratio 1.333) is the closest registered ratio and crops least (≈12.5px off the top and bottom of the 400px-tall viewBox at `object-cover`, versus ≈50px off each side at `1/1`) — the crop lands on the decorative hairline frame's top/bottom edge, never on the glyph or the "PHOTO ON REQUEST" label, both of which stay fully intact. This keeps the placeholder reading as an intentional plate, not a broken image.

**Type contract (Phase 2 boundary, ref AGENT-BRIEF "Phase 2 swaps to a live feed with an identical card contract").** `ListingCardProps = { listing: Listing; className?: string }`. `Listing` is the single typed prop; a Phase 2 data-source swap (static seed → a100arms feed) only needs to produce values conforming to this same type — the card itself, `displayPrice`/`displayCapRate`/`metaLine`, and the trust check are all already feed-shaped (ref `content/listings.ts`'s own header comment on this).

### `ListingsSection` (`site/components/sections/ListingsSection.tsx`)

- Root: `<section id="listings" aria-labelledby="listings-heading">` with `surface-deep section-pad` on the root and `container-hk` on an inner wrapper (section-shell contract).
- `SectionHeader` — `index="02"`, `label="Hotels for sale"`, `headline="On the market, handled *quietly*."`, `sub="Powered by our confidential channel."` (see Content gap above for the sub-line's citation).
- **Populated state** (`listings.length > 0`, true for all of Phase 1): `<Reveal as="ul" stagger>` wrapping the grid, one `<Reveal.Item as="li">` per `ListingCard` (5 children ≤ the 6-child stagger cap, ref 05). Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8` — 1-up mobile, 2-up ≥640px, 3-up ≥1024px (ref 03's card-grid rule; 5 cards resolve to a 3+2 last row, which is allowed — no filler card invented to force a rectangle).
- **Empty state** (`listings.length === 0`, P1 gate — "must be designed, not absent"): a single `<Reveal>` wraps a centered `surface-card hairline rounded-card` panel — `Lock` (lucide-react, `aria-hidden`, `strokeWidth={1.5}`, `size-6`, `text-fg-muted`) → the imported `listingsEmptyState` string verbatim, set at `text-heading font-display` (elevated above body copy so the empty state reads as a designed moment, not an apology) → `Button variant="primary" asChild` wrapping an external anchor to `A100_ARMS_SIGNUP_URL` labelled "Request invite to a100 Arms" (the exact phrase already used in `footerColumns` and `mandates.ts`, so the CTA vocabulary stays single-sourced across the site) with `target="_blank" rel="noopener noreferrer"` and a `visually-hidden` "(opens in a new tab)" suffix.
- No client boundary of its own — `ListingsSection` is a Server Component; `Reveal` and `PhotoFrame` (inside `ListingCard`) already carry the only client-side code, per the AGENT-BRIEF's "push the client boundary down" rule.

## States

| State | Behaviour |
|---|---|
| Populated, trusted Crexi link | Whole card is one `<a>` (via `CardShell`'s `::after` overlay); hover: photo grayscale→colour + scale 1.02, hairline → accent at 40%. |
| Populated, no trusted link | Plain (non-linking) tile; visible mono "Email us about this listing" link inside the badge row is the only interactive element. |
| Positive cap rate parses | Chip renders (`"7.25% Cap"` shape) ahead of the status badge. |
| No cap rate / cap ≤ 0 / unparseable | No chip — `displayCapRate()` returns `null`, nothing renders in its place (no dash, no "N/A"). |
| Price present and > 0 | `displayPrice()` renders the formatted string as authored. |
| Price absent / "$0" / blank | Renders exactly `"Price on Request"` (`PRICE_ON_REQUEST`) — never "N/A", never blank. |
| Zero listings | Designed empty-state panel (see IA), not an absent section. |
| Reduced motion / `motionAllowed() === false` | `Reveal` renders every element in its final visible state immediately (no fade/rise); `PhotoFrame`'s grayscale→colour hover still applies (it's a `filter` transition gated by `(hover: hover)`, not part of the reveal system) but the hover itself has no motion-sensitivity concern — it's an instant style change already, ref 05 only requires the *entrance* to have a static equivalent. |
| Touch device | `PhotoFrame`'s `tapped` toggle stands in for hover; no information is hover-only (both badges and price are always visible, not hover-revealed). |

## Motion

- Entrance: `Reveal`/`Reveal.Item` only — `opacity 0→1 + translateY 16px→0`, `DUR.reveal` (600ms), `EASE.out`, fires once at 20% viewport intersection (ref 05 tokens, no local redeclaration). Stagger `STAGGER` (70ms) across the 5 cards, under the 6-child cap.
- Hover: exactly the `CardShell`/`photo-reveal` contract already built — grayscale→colour + scale ≤1.02 at `duration-base`/`ease-out`; hairline → accent-text at 40%. This spec introduces no new hover behaviour.
- Nothing here animates a layout property; nothing translates a card; no bounce/overshoot easing is introduced (only `EASE.out`/`EASE.inOut` exist sitewide, and this section uses `EASE.out` exclusively).

## Accessibility

- `<section id="listings" aria-labelledby="listings-heading">`, heading id supplied by `SectionHeader`'s own `id` prop.
- Card grid is a real list: `<ul>` / `<li>` (via `Reveal as="ul"` / `Reveal.Item as="li"`), `CardShell` renders its default `<article>` inside each `<li>`.
- One link target per linking card (`CardShell`'s own contract) — title text is the accessible name; the Crexi-linking variant appends a `visually-hidden` clause naming the destination ("— view listing on Crexi") ahead of `CardShell`'s own "(opens in a new tab)" suffix. `rel="noopener noreferrer"` comes from `CardShell`'s `external` branch — not re-implemented here.
- Non-linking degrade case: a real `<a href="mailto:...">`, not a styled `<span>` — keyboard-reachable, in the tab order, 44px hit area via `Button`'s `link` variant hit-expander.
- Cap-rate and status badges are text inside a hairline pill — never colour-only. Status accent (EXCLUSIVE) uses `--accent-text`, which is a text-contrast-safe token (`accent-ink`/`accent-on-dark`), not the raw `--accent` brand value.
- Empty-state `Lock` icon is `aria-hidden="true"` — the adjacent `listingsEmptyState` text already carries the same information in words, so no separate visually-hidden description is needed (ref 04's "decorative art needs an adjacent description" rule is satisfied by the text that's already there, not duplicated).
- Focus: no custom focus handling anywhere in this section — the base-layer 2px `--focus` ring (globals.css) and `CardShell`'s `has-[a:focus-visible]` card-level ring do the entire job; nothing sets `outline-none` without an equivalent replacement.
- Photo `alt` text is `listing.photoAlt` verbatim from content — already written to describe the hotel, not the placeholder treatment (content file's own header comment confirms this was deliberate).
- Print (ref 07 gate: "owners print listings"): no `data-print-hide` on this section; cards remain legible on the `@media print` palette flip already defined in `globals.css` (no section-local override needed).

## Acceptance criteria

1. On a fresh load, for each of the 5 seed listings, a reader can identify price, location, and (if present) cap rate within a glance — no seed row has a cap rate, so "cap-rate chip only when positive" is exercised as "chip absent" for all 5 in Phase 1, and that must render as *nothing*, not a placeholder.
2. All 5 cards render `"Price on Request"` (no seed row sets `price`), styled in `text-fg` mono, not the chassis' default muted tone.
3. All 5 cards render the `EXCLUSIVE` badge (`status: "listed"`), accent-coloured per `STATUS_PRESENTATION`.
4. All 5 cards are live links to their `crexiUrl` (all 5 pass `isTrustedCrexiUrl()`), open in a new tab, `rel="noopener noreferrer"`, and their accessible name states the destination.
5. If a future/Phase-2 row fails the trust check or omits `crexiUrl`, the rendered card has no `<a>` wrapping its title, shows a real `mailto:` contact link instead, and never shows a broken or `crexi.com`-mismatched href.
6. Grid is `1 / 2 / 3`-up at `<640 / ≥640 / ≥1024`px; no 6th "filler" card is invented to square off the 5-item grid.
7. `npx tsc --noEmit --incremental false` from `site/` is clean for `ListingsSection.tsx` and `ListingCard.tsx`.
8. Zero hex/`rgb()`/Tailwind-default-palette colour literals in either file — every colour is a semantic token from the table in AGENT-BRIEF / ref 03.
9. `listings.length === 0` renders the designed empty-state panel (never an empty page gap), sourcing `listingsEmptyState` verbatim and linking to `A100_ARMS_SIGNUP_URL`.
10. Reduced motion: all 5 cards (and the empty-state panel, if shown) are visible immediately, no opacity-0 flash, no re-firing reveal on repeated scroll.
