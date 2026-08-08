# `#doors` — The Owner / The Investor

Section · Status: `approved`

## Intent

Two audiences read the same landing page for opposite reasons: an owner deciding
whether to sell, an investor deciding whether to buy. `#doors` is the page's
routing moment — it hands each audience its own promise and its own next step
without making either one feel like a detour through the other's content.
Ref 04 names it "The Owner / The Investor," equal weight, hairline divider,
mobile stack. The acceptance bar (this agent's brief): a reader lands on this
section and finds their door within the section's own footprint — no hunting,
no scrolling past the other audience's copy to find theirs.

Content: `site/content/doors.ts` (`doors[0]` = Owner, `doors[1]` = Investor —
the array's own fixed order, matching ref 04's title order). Every promise in
that file is already traced to kwc source lines and the evidence-gate row for
the 48-hour BOV; this spec adds no new factual claims.

## Content-law note (why the section carries a short original headline)

`doors.ts` supplies per-door copy (`label`, `headline`, `body`, CTAs) but no
section-level editorial line — by design, per its own doc comment, which
describes only the per-door micro-label device. The section shell contract
still requires one `SectionHeader` + `h2`. Two options were weighed:

1. Assemble the h2 from existing strings only (e.g. joining the two
   `door.label` values).
2. Write a short, original, non-factual eyebrow line, same as every other
   section's editorial headline (see `SectionHeader`'s own doc-comment
   example, `"Twelve closings, one *method*."`, which is invented copy, not a
   content-file field).

Went with (2) — the content law's "never retype a legal string, a price, a
stat, or a bio" targets **facts**; a wayfinding headline with zero numbers,
zero claims, and zero adjectives isn't one of those. Went with a WORD choice
audit instead: the italic word must not favor a door. "Team," "owner," and
"investor" all risked reading as promotion of one side, so this spec uses
**"house"** — hospitality-appropriate, neutral to both audiences, ties to the
"everyone under one house" framing in PROJECT-MEMORY §"name represents
everyone." The micro-label eyebrow, separately, IS a verbatim quote of ref
04's own section title ("The Owner / The Investor," `04-page-anatomy.md:22`)
— that one is sourced, not authored.

## IA

```
<section id="doors" aria-labelledby="doors-heading" class="surface-paper section-pad">
  <div class="container-hk">
    <Reveal>
      <SectionHeader id="doors-heading"
        label="The Owner / The Investor"      (unindexed micro-label — quotes ref 04's title)
        headline="Two doors, one *house*." />  (h2, one italic word, zero claims)
    </Reveal>

    <Reveal delay={0.1} className="mt-12 flex flex-col md:mt-16 md:flex-row md:items-stretch">
      <DoorPanel door={doors[0]} primary />        <!-- The Owner -->
      <div aria-hidden="true" class="divider" />    <!-- hairline, orientation flips at md -->
      <DoorPanel door={doors[1]} primary={false} /> <!-- The Investor -->
    </Reveal>
  </div>
</section>
```

`DoorPanel` (private to this file, not exported):

```
<div class="flex-1">
  <MicroLabel as="p" index={door.index}>{door.label}</MicroLabel>   [ 01 — THE OWNER ]
  <h3 class="font-display font-light text-heading">{door.headline}</h3>
  <AccentRule width="sm" class="mt-4" />
  <p class="mt-6 max-w-[46ch] text-body text-fg-muted">{door.body}</p>
  <div class="mt-8 flex flex-wrap items-center gap-4">
    <Button asChild variant={primary ? "primary" : "ghost"}>
      <a href={door.cta.href}>{door.cta.label}</a>
    </Button>
    {door.secondaryCta && (
      <Button asChild variant="link">
        <a href={door.secondaryCta.href} target="_blank" rel="noopener">
          {door.secondaryCta.label}
          <ArrowUpRight aria-hidden />
          <span class="visually-hidden"> (opens in new tab)</span>
        </a>
      </Button>
    )}
  </div>
</div>
```

## Component plan

New file only: `site/components/sections/DoorsSection.tsx`, default export
`DoorsSection` (Server Component — no `"use client"`; `Reveal` carries its own
client boundary, the section doesn't need one). One private helper,
`DoorPanel`, in the same file.

Reused, not duplicated: `SectionHeader`, `MicroLabel`, `AccentRule`, `Button`
(ui), `Reveal` (motion). No `CardShell` — this is a split panel, not a card
grid; no `PhotoFrame`/`Badge`/`DataLine` — nothing here is a photo, a status,
or deal data.

Icon: `ArrowUpRight` from `lucide-react`, 16px (`size-4`, the smallest
iconography-rule size — ref 03 permits only 16/20/24), `strokeWidth={1.5}`,
`aria-hidden`, paired with a `visually-hidden` "(opens in new tab)" suffix so
the external destination is announced without a second visible affordance.

## Primary-CTA decision (site rule: one primary per viewport)

Owner's CTA (`Request a written BOV`) is `variant="primary"` (ink pill on
this light surface). Investor's CTA (`See current listings`) is
`variant="ghost"`; the a100 Arms invite is `variant="link"` (tertiary mono).
Justification: the BOV is the page's primary conversion — it's the hero's
primary CTA and the nav's pill CTA elsewhere on the page, so Owner carrying
the one primary here is consistent sitewide, not a local judgment call. This
does NOT contradict "equal visual weight": that requirement governs the
panels' layout (identical padding, identical type scale, identical structural
slots via `flex-1` on both — literally equal width), not the CTA tier, which
the site rule fixes independently for every viewport on the page.

## States

Static content, no data states (no loading/empty/error — nothing here is
fetched). CTA hover/focus/disabled states are inherited from `Button`
unmodified; nothing in this section overrides them. No hover-only
information exists — both CTAs are always visible.

## Motion

- `SectionHeader` wrapped in one `<Reveal>` (opacity 0→1 + `DIST.rise`,
  `DUR.reveal`, `EASE.out`, fires once at 20% intersection — all from
  `Reveal`'s defaults, nothing bespoke). Matches the sitewide pattern already
  in `FaqSection.tsx`.
- The panel row (Owner + divider + Investor) is wrapped in a **second**
  `<Reveal delay={0.1}>`, **not** `stagger` (the 0.1s offset and `mt-12
  md:mt-16` spacing also match `FaqSection.tsx`, so header→body sequencing
  reads the same across sections). Deliberate: `Reveal`'s stagger mode would
  animate Owner in before Investor, which visually establishes an order
  between them — a direct hit against "neither may read as primary." A single
  shared fade/rise treats the pair as one unit arriving together.
- Divider is inert — a static hairline, no motion of its own; it rides along
  inside the row's `Reveal` without a separate `Reveal.Item` (only required
  when the parent is in `stagger` mode, which this one isn't).
- Reduced motion / motion-off: handled entirely by `Reveal`'s existing
  gate (`useReducedMotion()` + `motionAllowed()`) — no additional state to
  design; final layout is identical, motion is simply skipped.

## Accessibility

- `<section id="doors" aria-labelledby="doors-heading">`; `doors-heading` is
  the `h2` id `SectionHeader` renders — the section's only heading at that
  level (page h1 stays the hero's).
- Each door gets its own `h3` (`door.headline`) preceded by its own
  `MicroLabel` bracket device (`[ 01 — THE OWNER ]` / `[ 02 — THE INVESTOR ]`)
  — a normal, navigable heading outline (h2 → h3, h3), not a second landmark.
- Divider: `aria-hidden="true"`, plain `<div>` — same reasoning as
  `AccentRule`'s own doc comment: it carries no information a sighted user
  gets that a screen-reader user doesn't, and it isn't a thematic break, so
  it is not an `<hr>`.
- External CTA (`a100 Arms`): `target="_blank" rel="noopener"` (matches the
  convention already documented in `content/nav.ts`'s `MenuUtilities`
  comment) + visible `ArrowUpRight` + visually-hidden "(opens in new tab)".
- Every CTA clears the 44px tap target via `Button`'s own geometry (`primary`/
  `ghost` default to `size="md"`, 44px box; `link` reaches 44px via its hit
  expander) — nothing added here, nothing to verify beyond using the
  primitive as built.
- Focus rings: the global `:focus-visible` rule in `globals.css` — not
  touched, not suppressed.
- Body copy is `text-body` (16px floor) — no smaller size used anywhere in
  this section.
- No hover-only affordance; touch devices get identical CTAs to pointer
  devices (`Button` has no hover-only content).

## Acceptance criteria

1. `<section id="doors" aria-labelledby="doors-heading">` with `surface-paper`
   on its own root class list, `section-pad`, and a `container-hk` inner wrap.
2. Exactly one `h2` in this section (`SectionHeader`'s), exactly two `h3`s
   (one per door), zero `h1`.
3. Both `h3`s and both `MicroLabel` brackets render `door.headline` /
   `door.index` + `door.label` verbatim from `@/content/doors` — no door copy
   literal-strings live in the component file.
4. Hairline divider present, `aria-hidden`, horizontal on mobile
   (`w-full h-px`) and vertical from `md:` up (`md:w-px md:h-auto`), via
   `bg-hairline` (no raw hex/gray/blue Tailwind palette class anywhere in the
   file — token law P0 gate).
5. Exactly one `Button variant="primary"` in the whole section (Owner's BOV
   CTA); Investor's own CTA is `variant="ghost"`; the a100 CTA is
   `variant="link"` with the external attributes above.
6. Both `DoorPanel`s are `flex-1` siblings in the same flex row (equal width
   by construction, not by eyeballing) — the concrete, checkable form of
   "equal visual weight."
7. `<Reveal>` (imported from `@/components/motion/Reveal`) is the only motion
   mechanism used; no hand-rolled `motion/react` usage; panel row is
   explicitly non-`stagger` (see Motion section for why).
8. `npx tsc --noEmit --incremental false` from `site/` reports zero errors in
   `DoorsSection.tsx`.
9. No image/`next/image` usage in this section — text-and-CTA only, keeping
   the section's DOM light so both doors have the best realistic chance of
   sharing a single mobile viewport; noted as a design lever, not a hard
   runtime gate (a static component can't force viewport math for every
   device).
