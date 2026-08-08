# `#mandates` — Capital & Standing Mandates

**Section/Route:** `#mandates` (landing page, section 9 of 13 per ref 04 — second dark panel, between `#doors` and `#team`)
**Status:** **approved** (ref 04 §`#mandates`; PHASE-1-EXECUTION §5 "approved" 2026-08-07 already scopes this section's IA — this spec adds implementation-level token detail, not new decisions, except where noted under Decisions below)
**Intent:** A capital source or their advisor scans four real, currently-working mandates in under ten seconds, recognises their own deal in one of them, and leaves through one quiet, deliberately unglamorous channel — never mistaking this for a marketplace product.

## Sources of truth

| What | Where | Rule |
|---|---|---|
| The four mandate cards (headline + criteria) | `site/content/mandates.ts` → `mandates` | **Frozen set.** Every row already carries a `verified-current` entry in skill ref 06. This section may not add a fifth card from any source. |
| Deck line under the header | `site/content/mandates.ts` → `mandatesDeck` | Verbatim kwc port. Rendered as the `SectionHeader` `sub`, never retyped. |
| Discretion line beside the CTA | `site/content/mandates.ts` → `mandatesDiscretion` | Hokuten-authored, makes no factual claim. Verbatim. |
| CTA label + href | `site/content/mandates.ts` → `mandatesCta` | `label` already contains the U+2192 arrow character — rendered as-is, never a Lucide icon. |
| Section headline (`h2`) | Authored in this file (no `mandates.ts` export for it — see Decisions) | "Four mandates we are already *working*." One italic accent word, no new claim beyond the literal card count. |

## IA

```
<section id="mandates" aria-labelledby="mandates-heading" class="surface-dark section-pad">
  <div class="container-hk">
    <SectionHeader>                                  -- Reveal (single, no stagger)
      MicroLabel  [ CAPITAL & MANDATES ]                -- unindexed, see Decisions
      h2#mandates-heading  Display-2, one italic word
      sub  = mandatesDeck (body-lg)
    <mandate card grid>                               -- Reveal (stagger, delay 0.1)
      4 × mandate card (Reveal.Item, article)
        h3  serif headline  (font-display, body-lg)
        DataLine  mono criteria row (data, text-fg-meta)
    <closing row>                                     -- Reveal (single)
      Button ghost  "PRIVATE ACCESS →"  (mono micro label inside the pill)
      p  discretion line  (micro, text-fg-meta)
  </div>
</section>
```

## Decisions (this spec's own calls, not re-litigating ref 04)

1. **Micro-label stays unindexed** — `[ CAPITAL & MANDATES ]`, no leading digit. Matches ref 04's own rendering of this exact label (unindexed, same as `#brands`) and the precedent already set in `docs/design/specs/faq.md` ("`#faq` ships unindexed... section agents build concurrently with no shared index registry"). Same reasoning applies here: assigning myself a sequence number risks colliding with whatever another concurrent section agent picks. Revisit once one agent assembles the final page-wide index.
2. **Card grid is 2-up at `sm:` and holds there — not the listing/closing 3-up rule.** Ref 03's "3-up desktop / 1-up mobile" grid rule is scoped explicitly to "Listing/closing cards" (its own sentence names them). Mandate cards are a different shape: no photo, no fixed aspect, and criteria rows run long ("Investment group targeting select-service and above; portfolios welcome · RevPAR ~$100, unencumbered by management"). Four cards in 3 columns leaves an orphaned single card on its own row; two columns gives each card enough width for its criteria row to wrap sensibly and reads as denser, table-like data — matching this section's brief to read differently from `#method`'s single-column stepper. `grid-cols-1 sm:grid-cols-2`, held through `lg:`/`xl:`.
3. **No `star-grain`, no engraved art object.** Ref 03 makes `star-grain` optional on dark sections ("may carry"); this section's own brief is explicit that it must not read as a second `#method` and must carry "no art object" — `#method` already owns the one engraving + hanko-accented dark chapter on the page. This section is flat `.surface-dark`, hairline-bordered cards, nothing else.
4. **Type-size budget: exactly 4 (ref 03 cap).** `text-micro` (micro-label, CTA label, discretion line), `text-display2` (`h2`), `text-body-lg` (deck-line sub **and** card headlines — the card headline is set `font-display font-normal` at the `body-lg` step rather than opening a fifth `text-heading` size), `text-data` (mono criteria row). No fifth size.
5. **The CTA is a `ghost` pill (ref 03 "secondary = hairline ghost pill", matching ref 04's literal "ghost `PRIVATE ACCESS →`" wording) whose label is set in mono micro-label type, not the button's default sans.** Ref 03 Iconography: "no text arrows (→ allowed inside mono micro-labels only, as type not icon)." The label text already contains U+2192; wrapping it in `font-mono text-micro uppercase tracking-micro` inside the ghost pill satisfies both rules at once — hairline pill shape from `Button variant="ghost"`, arrow-as-type from the mono span around the label. `size="sm"` (36px visual, 44px hit area via the button's built-in expander) keeps the pill proportioned to the small mono label rather than the visually loose 44px box a `body`-scale ghost CTA gets elsewhere.
6. **`DataLine` renders the criteria row as a single already-joined string, not split parts.** Each `criteria` value in `content/mandates.ts` is a byte-exact port with specific dash/middle-dot characters called out in that file's own header comment. Passing `parts={[mandate.criteria]}` (single element) runs it through the same `data-line` utility every other mono row on the site uses without `metaLine` re-joining or altering a single character.

## Component plan

| Component | Tokens | Content source |
|---|---|---|
| `sections/MandatesSection.tsx` (server) | `surface-dark` `section-pad` `container-hk` | new file, this spec |
| `SectionHeader` (existing atom, unmodified) | `text-display2` `text-body-lg` `micro-label` | headline authored here; `sub` = `mandatesDeck` |
| mandate card (inline in this file — not a new shared atom; shape doesn't fit `CardShell`'s photo/meta/badge slots, see below) | `hairline` `rounded-card` `font-display` `text-body-lg` `text-fg` | `mandates[i].headline` |
| `DataLine` (existing atom, unmodified) | `data-line` `text-fg-meta` | `mandates[i].criteria` |
| `Reveal` / `Reveal.Item` (existing motion wrapper, unmodified) | `revealVariants` / `staggerContainer` via `@/lib/motion` | — |
| `Button` (existing primitive, unmodified) `variant="ghost" size="sm" asChild` | `rounded-pill` `border-hairline` `text-fg` | `mandatesCta.label` / `.href` / `.external` |

**Why not `CardShell`:** `CardShell` reserves photo/meta/badge slots and forces a `surface-card`/`surface-paper` fill — built for `ListingCard`/`ClosingCard`/`TeamCard`'s photo-tile shape. Mandate cards have no photo, no meta caption, no badge, and must sit **transparent on the dark surface with only a hairline border** (ref 04's literal spec), not on a lighter card fill. Forcing them through `CardShell` would mean passing `photo`/`meta`/`badge` as unused and fighting the `surface` prop's two fills, neither of which is "hairline border on dark." A four-line inline `<article>` inside this file is not a duplicated primitive; it is a different card shape ref 04 asks for explicitly.

## States

- **Default:** hairline-bordered cards, static. No hover-interactive element inside a card (no `href`, no card-level link — the section's only interactive element is the closing CTA).
- **CTA hover/focus:** `Button` ghost variant's existing `hover:border-accent-text` (color/border only, `duration-fast`); visible 2px focus ring from the base layer, unmodified.
- **Reduced motion / motion killswitch:** both `Reveal`s render their final state immediately — `Reveal`'s own `armed`/measure-once mechanism, nothing new gated here.
- **Content states:** none — this section has no loading/empty/error state; `mandates` is a static compile-time array, never fetched.

## Motion

Two `Reveal` instances: header (single, no stagger) and the closing CTA row (single, no stagger); one `Reveal` with `stagger` wrapping the 4 `Reveal.Item` cards, `delay={0.1}` (matches the `#faq` precedent of a short offset after the header). All from `@/lib/motion`: `opacity 0→1` + `translateY 16px→0`, `duration-reveal` (600ms), `ease-out`, fires once at 20% intersection; stagger `70ms` per card, well under the 6-child cap (4 cards). No animation introduced beyond what `Reveal`/`Reveal.Item` already implement — no new keyframes, no layout-property animation.

## Accessibility

- `<section id="mandates" aria-labelledby="mandates-heading">` → `SectionHeader`'s `h2` carries the matching `id`.
- Card headlines are real `h3`s, keeping the document outline honest under the section's `h2`.
- CTA is a real `<a href="https://a100arms.com/signup">` (via `Button asChild`), not a `<div>` with a click handler; `target="_blank" rel="noopener noreferrer"` plus a `visually-hidden` "(opens in a new tab)" appended inside the link's accessible name (same pattern `CardShell` already uses for external links).
- CTA clears the 44px tap-target gate via `Button`'s built-in hit-expander even at `size="sm"`.
- The `→` character is never announced as a floating symbol in isolation — it is part of the link's one accessible name, "PRIVATE ACCESS →", read as ordinary text by assistive tech (no `aria-hidden` needed on it; it is content, not decoration, per ref 03's "arrow only inside mono micro-labels, as type").
- No colour-only signal anywhere in this section; the hairline border, headline, and criteria row are all always-visible text/structure, not state-dependent.
- Focus ring on the CTA is the sitewide base-layer 2px `--focus` ring — untouched here.

## Acceptance criteria

- [ ] Exactly the 4 mandates from `@/content/mandates` render, in source order, no fifth card added from anywhere.
- [ ] No mandate headline, criteria string, deck line, discretion line, or CTA label is retyped — all imported, all byte-identical to `content/mandates.ts` (including the em/en dash and middle-dot characters that file's header comment calls out).
- [ ] Section headline contains exactly one `*italic*` marker and no banned word (unlock / elevate / seamless / world-class / "experience you can count on" / Learn more / Get started / Submit / exclamation marks).
- [ ] No hex / `rgb()` / Tailwind-default-palette colour anywhere in the file; every visual value is an existing token or utility (`surface-dark`, `section-pad`, `container-hk`, `hairline`, `rounded-card`, `text-display2`, `text-body-lg`, `text-data`, `text-micro`, `font-display`, `font-mono`, `tracking-micro`).
- [ ] No more than 4 distinct type sizes in the section (see Decisions §4).
- [ ] No `star-grain`, no engraved/line-art image, no logo, no counterparty name beyond what `content/mandates.ts` already publishes.
- [ ] Card grid is `grid-cols-1 sm:grid-cols-2` (not 3-up) at every viewport ≥375px; each card stays comfortably ≥320px wide at every breakpoint.
- [ ] CTA renders as a real `<a>` (not a `<div>`/`<button>` faking a link), opens `https://a100arms.com/signup` in a new tab, and its accessible name includes "(opens in a new tab)".
- [ ] The `→` in the CTA renders as literal text inside `font-mono`/`uppercase`/`tracking-micro` styling — never a Lucide/SVG icon.
- [ ] Both `Reveal`s (plus the staggered card group) fire once, gate on reduced motion, and introduce no layout-property animation; stagger group is 4 children (≤6 cap).
- [ ] `<section aria-labelledby="mandates-heading">` points at the section's own `h2`; card headlines are `h3`.
- [ ] `npx tsc --noEmit --incremental false` clean for `MandatesSection.tsx`.
