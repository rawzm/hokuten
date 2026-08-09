> **✓ Re-verified current — Design Revisit round (2026-08-08/09).** Checked
> against `site/components/sections/FaqSection.tsx`'s own header comment on
> 2026-08-09 (not skimmed): that file states outright that "the placeholder
> notices themselves are UNCHANGED by the D6/D8 pass below and stay fully"
> intact — the §"Placeholder-marker handling" section here is unaffected.
> The IA and component plan otherwise still hold; D6 applied a density pass
> (this section joins onto `#team` above it via `section-join` rather than
> its own full `section-pad` — see `FaqSection.tsx`'s header for the surface-
> adjacency reasoning) and D8 applied its typography pass (`font-medium` per
> "mono 500 for emphasised data values" on the placeholder caption per the
> file's own comment). None of this changes the accordion mechanics, the
> `[PLACEHOLDER:confirm — …]` parsing contract, or the acceptance criteria
> below.

# `#faq` — Diligence FAQ

Status: **approved**

## Intent

Ref 04 §`#faq`: "Accordion, ≥5 real diligence questions: confidentiality/NDA
process, 1031 timelines, off-market access, BOV requirements (T-12/STR/PIP),
fees/engagement, license/brokerage structure." Voice target: a 40+ CRE
audience, written like someone who has actually closed deals — numbers-first,
discreet, unhurried, no filler.

`site/content/faq.ts` already ships 7 authored questions covering every
required topic (plus the brokerage-of-record licence answer). This spec
governs presentation only; the copy itself is out of scope for this file (owned
by content, not this section).

## IA

```
<section id="faq" aria-labelledby="faq-heading" class="surface-paper section-pad">
  <div class="container-hk">
    <SectionHeader>                      -- Reveal (single, no stagger)
      MicroLabel  [ DILIGENCE FAQ ]        -- unindexed, see "Micro-label index" below
      h2#faq-heading  Display-2
      sub (one line)
    <Accordion type="single" collapsible>  -- Reveal (single, delay 0.1)
      7 × AccordionItem
        AccordionTrigger  (question, text-heading serif, Plus/Minus)
        AccordionContent
          FaqAnswer
            text segment(s)   -- <p>, inherits text-body-lg/text-fg-muted/68ch
            placeholder notice(s) -- text-brick hairline chip, only when present
</div>
```

## Micro-label index

Ref 04 shows an indexed device only for `#closings` (`[ 01 — TRACK RECORD ]`);
`#brands` and `#mandates` are shown **unindexed** (`[ FLAGS WE TRANSACT
ACROSS ]`, `[ CAPITAL & MANDATES ]`). The doc does not assign a number to
`#faq`, and section agents build concurrently with no shared index registry —
inventing a sequence position here risks colliding with another section's
choice. Decision: **`#faq` ships unindexed** — `[ DILIGENCE FAQ ]` — matching
the `#brands`/`#mandates` precedent. Revisit once all section indices are
assembled on the page and a single agent can assign the final sequence.

## Component plan

- `SectionHeader` (existing atom, unmodified): `id="faq-heading"`, `label="Diligence FAQ"`,
  `headline="The questions a *closer* answers first."` (one italic word: *closer*),
  `sub` names the topic spread without repeating the questions verbatim.
- `Accordion` / `AccordionItem` / `AccordionTrigger` / `AccordionContent` from
  `site/components/ui/accordion.tsx`, **used as-is** — it already implements the
  full-width ≥44px trigger, serif `text-heading` question, Lucide Plus/Minus
  rotation (transform-only), reduced-motion instant open/close, the
  grid-template-rows height trick, and the `max-w-[68ch]` / `text-body-lg` /
  `text-fg-muted` answer treatment. This section does not touch that file.
- `Reveal` (existing motion wrapper) wraps the header once and the accordion
  block once — **not** per-row. `faq.length === 7` exceeds the ref 05 stagger
  cap of 6 children, so a per-item `stagger` would fire a dev warning; two
  single (non-stagger) reveals is the correct, spec-compliant shape.
- New, section-local only (not exported, not a shared atom — reuse would need
  to graduate this to `atoms/` first): `FaqAnswer` and `PlaceholderNotice`.
  `PlaceholderNotice` composes `font-mono text-micro uppercase tracking-micro`
  manually rather than the `micro-label` utility class, because `micro-label`
  bundles its own `color: var(--fg-meta)` which would collide with
  `text-brick` on the same element — same workaround already used in
  `atoms/Badge.tsx` (type tokens on the wrapper, colour on an inner span).

## Placeholder-marker handling (binding — ref: agent task brief)

`content/faq.ts` answers may contain `[PLACEHOLDER:confirm — …]` markers where
the kwc source is silent. Five ship today (NDA mechanics, a100 Arms vetting
bar, QI coordination, fee/engagement terms, KW/Forward Wilshire paperwork
gate). They must never be hidden, stripped, or replaced with invented text —
and must not be mistakable for shipped copy.

`FaqAnswer` parses each answer on `/\[PLACEHOLDER:confirm[\s—-]*([^\]]*)\]/g`,
splitting it into ordinary text segments (rendered as `<p>`, inheriting the
accordion's `text-body-lg`/`text-fg-muted`) and placeholder segments, each
rendered as a `PlaceholderNotice`:

- `hairline` bordered, `rounded-card`, block-level (own row, not inline) —
  impossible to mistake for flowing body copy.
- `text-brick` throughout (the frozen "errors/unresolved" token — ref 03 color
  roles; same token `ui/field.tsx` uses for form errors).
- Lucide `AlertTriangle`, `aria-hidden`, `text-brick`.
- A manually-composed mono caption "Placeholder — confirm before launch" above
  the marker's own text (verbatim, untouched, just relocated out of the
  `[PLACEHOLDER:confirm — …]` wrapper the same way `MicroLabel` composes
  brackets separately from its words — the bracket syntax is presentational
  scaffolding, not content).
- `data-placeholder-confirm="true"` on the row for a future pre-deploy grep
  (ref 07 QA script pattern) to assert zero placeholders remain before public
  launch.

The brokerage/licence answer (last FAQ item) already contains the
`compliance.ts` `BROKERAGE_DISCLOSURE` sentences byte-exact, joined with a
single space per that file's own documented "equally valid inline form" —
verified by inspection, 2026-08-08. This section renders whatever
`content/faq.ts` provides; it does not re-import or re-compose compliance
strings itself (that file is not owned by this section, and the existing
content already satisfies the byte-exact requirement).

## States

- **Closed** (default, all rows): hairline-separated list, Plus icon, no open
  panel mounted-but-hidden (Radix `forceMount` keeps it in DOM at
  `visibility: hidden`, out of tab order — see `accordion.tsx` header comment).
- **Open**: Minus icon, panel expands via `grid-template-rows` 0fr→1fr,
  `duration-base`/`ease-out`. Multiple rows may be open at once — the FAQ uses
  Radix `type="single" collapsible` (one row open at a time, and the open row
  can be closed by re-clicking it) to keep a long diligence list scannable
  rather than letting it grow unbounded.
- **Placeholder present**: the notice row renders unconditionally alongside
  the real answer text — not a toggle state, always visible when open.
- **Reduced motion / motion killswitch**: `accordion.tsx`'s own
  `useTransitionsEnabled()` (gates on `useReducedMotion()` **and**
  `motionAllowed()`) drops all transitions; open/close is instant. Nothing new
  to gate in this file.

## Accessibility

- `<section id="faq" aria-labelledby="faq-heading">` → `SectionHeader`'s `h2`
  carries a matching `id="faq-heading"`.
- Trigger is a real `<button>` (Radix `AccordionPrimitive.Trigger`), `min-h-11`
  (44px), visible on `:focus-visible` via the sitewide base-layer rule — no
  extra work needed here.
- Radix Accordion ships full keyboard support (Tab to a trigger, Enter/Space
  toggles, Arrow Up/Down moves between triggers, Home/End jumps to
  first/last) — verified by reading `@radix-ui/react-accordion`'s composition
  of `Collapsible.Trigger` (a native `<button>`) inside `RovingFocusGroup`;
  nothing in this section overrides that behaviour.
- `AlertTriangle` in `PlaceholderNotice` is `aria-hidden="true"` — the caption
  text "Placeholder — confirm before launch" carries the meaning for assistive
  tech, not the icon.
- No colour-only signal: the placeholder notice is icon **and** caption text
  **and** hairline border **and** distinct block position, not `text-brick`
  alone.

## Motion

Two `Reveal` instances (header, accordion block), default (non-stagger)
variant: `opacity 0→1` + `translateY 16px→0`, `duration-reveal`, `ease-out`,
fires once at 20% viewport intersection — no new motion introduced. Row
open/close motion is entirely `accordion.tsx`'s existing implementation
(grid-template-rows + visibility, `duration-base`/`ease-out`, transform/opacity
adjacent icon swap) — unmodified.

## Acceptance criteria

- [ ] 7 questions render from `@/content/faq`, one per `AccordionItem`, no
      retyped copy.
- [ ] Every `[PLACEHOLDER:confirm — …]` marker in the current content renders
      as a visible `PlaceholderNotice` — none hidden, stripped, or paraphrased.
- [ ] Zero invented facts: this file contributes no new copy beyond the
      section header (headline/sub) and the placeholder's fixed caption.
- [ ] `tsc --noEmit` clean for `FaqSection.tsx`.
- [ ] No hex/`rgb()`/Tailwind-default-palette colour; every visual value is an
      existing token or utility from `globals.css` (`surface-paper`,
      `section-pad`, `container-hk`, `hairline`, `rounded-card`, `text-brick`,
      `text-micro`, `tracking-micro`, `text-data`, `font-mono`).
- [ ] No layout-property animation introduced; both `Reveal`s fire once; row
      transitions gate on reduced-motion (inherited from `accordion.tsx`,
      re-verified by reading that file, not re-implemented).
- [ ] Keyboard-only pass: every trigger reachable and operable, visible focus
      ring on each.
- [ ] `<section aria-labelledby>` points at the section's own `h2`.
