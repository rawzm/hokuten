> **✓ Re-verified current — Design Revisit round (2026-08-08/09).** Checked
> against `site/components/sections/StatsSection.tsx`'s own header comment on
> 2026-08-09 (not skimmed): the IA and component plan below still hold —
> this section was not structurally rebuilt. Two things worth knowing before
> building or auditing against it: (1) a real clipping bug Razim found (stat
> numerals cut off under the sticky nav) was diagnosed and fixed this round —
> see the file's own "DESIGN REVISIT 1 — CLIPPING BUG, DIAGNOSED AND FIXED"
> section for the root cause and fix, not re-derived here; (2) a **local,
> deliberate D8 divergence**: the numeral weight is bumped up from
> `StatNumeral`'s own `font-light` default (the file's header calls this out
> explicitly as "a deliberate LOCAL divergence, not drift"). D3's CoStar
> badge placements (`docs/DESIGN-REVISIT.md` §4.4 — three quarterly banners +
> two Annual badges) were not confirmed as landed inside this specific file
> during this pass; verify directly if auditing D3.

# `#stats` — Trust metrics band

## Section / Route

`#stats` · single-page landing, second section in document order (after `#hero`, before `#brands`). Owner: `site/components/sections/StatsSection.tsx`. Content: `site/content/stats.ts` (already authored, `verified-current` — never retyped here).

## Status

`approved` — building to this spec now.

## Intent

The first data proof after the hero. Four aggregate numbers restate the hero's implicit promise in instrument terms before the detailed `#closings` "Track Record" chapter does it deal-by-deal. Per [04-page-anatomy.md](../../../.agents/skills/hokuten-design-director/references/04-page-anatomy.md) → `#stats`: "Fraunces numerals, mono captions, hairline separators." Per the brief: "instrument-grade, not a marketing stat strip" — no centered hero-style counter carousel, no glow, no adjectives. The four numbers are the whole argument; copy chrome stays out of the way.

## IA

1. `SectionHeader` — unindexed micro-label `[ TRUST METRICS ]` (no chapter number: `#stats`/`#brands`/`#mandates` are bands, not numbered chapters — only `#closings`-style chapters carry a numeral per ref 04) + `h2` headline, one italic word, no sub-line.
2. A 4-item list, each item: numeral (server-rendered final value, count-up as enhancement) → mono caption → optional mono detail line. Order matches the existing `StatNumeral` atom's own render order (value, caption, detail) for site-wide consistency.
3. Every item carries a hairline rule above it (`hairline-t`) — the "hairline separators" the anatomy doc calls for, applied uniformly regardless of grid position (this is a direct translation of the kwc `.trust-strip`'s `.trust-stat { border-top: 0.5px solid var(--gold) }` rule, per `docs/port/03-deals.md` §D.1 — translated to `--hairline`, not `--accent`: a separator is structure, not brand color, and ref 03 reserves accent for CTAs/badges/one italic word/thin *accent* rules specifically called out as such, not general-purpose dividers).

## Component plan

`StatsSection` (Server Component; no `"use client"` — the only client code inside is the *already-existing* `Reveal` and `CountUp`, both imported, neither reimplemented).

```
<section id="stats" aria-labelledby="stats-heading" class="surface-paper section-pad">
  <div class="container-hk">
    <Reveal>
      <SectionHeader id="stats-heading" label="Trust metrics" headline="Before the story, the *math*." />
    </Reveal>
    <Reveal as="ul" stagger role="list">
      <Reveal.Item as="li"> × 4, one per site/content/stats.ts entry
        <numeral>   — CountUp value={stat.value}
        <caption>   — micro-label utility, stat.label
        <detail?>   — DataLine (parts variant when it splits on " · ", else joined) — only 2 of 4 stats carry one
      </Reveal.Item>
    </Reveal>
  </div>
</section>
```

**StatNumeral / CountUp composition — a deliberate deviation from calling `<StatNumeral countUp>`, documented so it isn't mistaken for a missed import:**

`StatNumeral`'s `value` prop is `string` — it renders `{value}` as plain text and cannot host a child component, so `<CountUp>` (a full React component) cannot be passed into it. `StatNumeral`'s `countUp` flag only adds inert `data-countup`/`data-countup-value` attributes for an external enhancer; no such enhancer exists anywhere in the repo (confirmed by grep — the only two hits are the atom's own doc comment and `CountUp.tsx`'s unrelated internal marker), so setting that flag today would ship dead attributes with no animation, failing the brief's explicit instruction to animate "via the existing CountUp." `CountUp` is already the complete, correct instrument: it server-renders the final string verbatim (satisfies the P0 gate on its own, independent of `StatNumeral`), then enhances from 60% of value once in view, gated on `useReducedMotion()` + `motionAllowed()`. Its internals (`parse`/`render`) are not exported, so there is no way to reuse its algorithm without rendering the component itself.

Resolution: `StatsSection` renders each stat's chrome inline, reusing `StatNumeral`'s own numeral className recipe verbatim (`block font-display font-light text-display2`; `tabular` is added by `CountUp` itself) plus the same `micro-label` / `data-line text-fg-muted` utilities `StatNumeral` uses for caption/detail — i.e. it composes the same design tokens `StatNumeral` composes, swapping only the numeral's leaf node for `<CountUp>`. `StatNumeral` itself is not imported into this file. Flag for whoever owns `components/atoms/`: `StatNumeral` could take an optional `valueSlot?: ReactNode` (rendered instead of `{value}` when present, still requiring a `value` string for the accessible/no-JS fallback) to remove this duplication in a future pass.

**Detail-line wrapping** (`site/content/stats.ts` rendering contract): the CoStar detail is three `" · "`-joined quarter groups that must never break mid-quarter on a narrow cell. `DataLine`'s `parts` variant already does exactly this (each value `whitespace-nowrap`, breakable space only after the separator) — reused as-is via a tiny local helper that splits the pre-joined `detail` string on `" · "` and picks `DataLine`'s `parts` variant when that yields >1 group, `joined` otherwise (the "12" stat's detail is one long sentence with no `" · "` in it and must wrap normally, not go `nowrap`).

## States

- **Default / JS disabled**: identical DOM — every numeral is real server-rendered text (`$200M+`, `12`, `836K+`, `3×`). This is the P0 case (ref 07: "stat counters that show 0/placeholder without JS" is a named fail). No loading, no skeleton — content is static and always present.
- **In view, motion allowed**: each numeral counts up from 60% of its value to the final value once, `duration-base`-adjacent 800ms (`CountUp`'s own fixed `COUNT_DURATION_S`, not a `DUR` token — that value is owned by `CountUp.tsx`, not restated here), `ease-out`. Section content fades/rises in once (`Reveal`, `duration-reveal`/`ease-out`), items stagger at the `STAGGER` token.
- **Reduced motion / `motionAllowed() === false`**: no count-up (final value renders immediately, already true since it's the server value), no fade/rise — `Reveal`'s `armed` path only fires when `motionAllowed` is true, so anything already in the initial viewport, and everything once reduced-motion is set, simply appears in its final state. No missing/blank state exists at any point.
- **Print**: `@media print` in globals.css already flips `.surface-paper` to a white/black-text pair sitewide — no section-specific print rule needed.

## Motion

- Section entrance: `Reveal` (default, non-stagger) around the header; `Reveal` with `stagger` around the 4-item list, items as `Reveal.Item`. Both existing primitives, not reimplemented. 4 children — under the 6-child stagger cap (ref 05 / `STAGGER_MAX_CHILDREN`).
- Numeral count-up: `CountUp`, per-instance `useInView` (`once: true, amount: 0.2` via `IN_VIEW`), from 60% of target, floored to hold digit width, `tabular` nums so the box never resizes mid-count.
- No hover state on this section — nothing here is interactive.

## Accessibility

- `<section id="stats" aria-labelledby="stats-heading">`, heading id matches.
- `<ul role="list">` — `role="list"` is defensive: Tailwind's preflight sets `list-style: none`, which strips the implicit list role in Safari/VoiceOver; `role="list"` restores it. `<li>` items need no additional role.
- Each stat item reads in a natural order for assistive tech: value, then what it measures, then its qualifier — e.g. "$200M+, Aggregate volume" / "3×, CoStar Power Broker, Q3 '25 · Q1 '26 · Q2 '26" (quarter separators are `aria-hidden`, the values themselves are not).
- No color-only meaning; no interactive elements to focus-trap or mis-order; heading level `h2` (site has exactly one `h1`, owned by the hero).
- `tabular-nums` throughout (`tabular` utility on the numeral via `CountUp`, `data-line` on captions/details) — the count-up animation cannot shift line width or reflow neighboring text.

## Acceptance criteria

- [ ] All four values (`$200M+`, `12`, `836K+`, `3×`) and both detail lines (`11 hotel-asset transactions + 1 hotel-management-company M&A`; `Q3 '25 · Q1 '26 · Q2 '26`) come from `@/content/stats` — none retyped, none invented.
- [ ] Values are present in the server-rendered HTML with JavaScript disabled (P0 — the named Sarhan "$0 B+" anti-pattern does not occur here).
- [ ] Numerals are `font-display` (Fraunces) `font-light`, never `font-mono` (P1 gate — "stat numerals set in mono (they're serif)").
- [ ] Captions are `micro-label` (mono, uppercase, tracked).
- [ ] CoStar quarters render as three distinct groups that never break mid-quarter on a 375px viewport.
- [ ] Every stat item carries a `hairline-t` rule; no invented hex/px — colors via `--hairline` token (through the `hairline-t` utility and the section's `.surface-paper` scope), sizes via `text-display2` / `text-micro` / `text-data` tokens.
- [ ] Grid: 1-up ≤639px, 2-up 640–1023px, 4-up ≥1024px (ref: "4-up desktop → 2-up tablet → whatever keeps numerals legible at 375px").
- [ ] Count-up fires once, from 60% of value, only when `motionAllowed()` is true; reduced-motion shows the static final value with no animation and no missing state.
- [ ] No `<StatNumeral>` import (composition note above) — flagged to the atoms owner, not silently worked around.
- [ ] `npx tsc --noEmit --incremental false` clean for `StatsSection.tsx`.
