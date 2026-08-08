# `#brands` — Franchise-flag marquee

Status: **approved**

## Intent

Ref 04 §`#brands`: a continuous horizontal marquee of the chain scales Hokuten
transacts across — economy through upper-upscale — reading as "quiet
familiarity, not a partner wall." Ref 01 "Motif system" and ref 06's claims
register scope this as a **coverage claim**, not a partnership claim: the
label must read "flags we transact across," never "partners," never
"clients," never "brands we work with" (compliance P0).

`docs/design/LOGO-MANIFEST.md` records the researched, dated decision that
**zero vectors ship in Phase 1** — none of the nine franchisors has a
free-licensed, type-only, current mark, so all nine render as brand **names**
set in Hokuten's own typography, grayscale, uniform optical height. This spec
governs presentation only; the legal reasoning lives in the manifest and in
`site/content/brands.ts`'s header comment, and is out of scope here.

## IA

```
<section id="brands" aria-labelledby="brands-heading"
         class="surface-paper hairline-t hairline-b section-pad">
  <div class="container-hk">                          -- centered column
    h2#brands-heading  micro-label                     -- BRANDS_MICRO_LABEL, verbatim
    Marquee (speed="brands", 40s)                       -- rail-mask, pause hover+focus
      9 × franchise-name mark  (text-heading, uppercase, tracking-micro, --meta)
      1 × "& independents" mark (same treatment)
    p.text-micro.text-fg-meta  TRADEMARK_MICROCOPY      -- verbatim, max-w-[60ch]
</div>
```

## Micro-label index

Matches the precedent already recorded in `docs/design/specs/faq.md`: ref 04
shows an indexed device only for `#closings` (`[ 01 — TRACK RECORD ]`);
`#brands` and `#mandates` are explicitly shown **unindexed**
(`[ FLAGS WE TRANSACT ACROSS ]`, `[ CAPITAL & MANDATES ]`). No number is
invented here.

## Component plan

- **No `SectionHeader`.** This is the one deliberate deviation from the
  sitewide "SectionHeader + h2" section-shell shape, and it is a considered
  decision, not an oversight:
  1. Ref 04's `#brands` entry gives only a micro-label + trademark microcopy —
     unlike `#closings`/`#mandates`/`#faq`, it never calls for a Display-2
     headline, and groups the section visually as a thin "hairline-bordered
     band," not a narrative section.
  2. `site/content/brands.ts` exports no headline string, only
     `BRANDS_MICRO_LABEL` and the re-exported `TRADEMARK_MICROCOPY` — content
     law: nothing is invented that content doesn't supply.
  3. This is the single most explicit compliance-P0 section in the brief (the
     framing itself is the legal control: "must say 'flags we transact
     across', never 'partners' or 'clients'"). Adding a new, uncleared
     headline sentence here — even an innocuous one — reopens exactly the
     claim-drafting risk the frozen `BRANDS_MICRO_LABEL` string exists to
     close off. Minimizing rendered text to the two vetted constants plus the
     brand names themselves keeps the legal surface area to what's already
     been reasoned through in the manifest.
  - The section still satisfies the shell contract's actual requirements — an
    `<section aria-labelledby>` naming its own `h2` — via a plain heading
    styled with the `micro-label` utility directly (not the `MicroLabel`
    atom): `BRANDS_MICRO_LABEL` is already a fully-composed
    `"[ FLAGS WE TRANSACT ACROSS ]"` string, and `MicroLabel` composes its
    *own* brackets around word-only children, so passing the constant through
    the atom would double-bracket it. Rendering the frozen string verbatim in
    a plain `<h2 className="micro-label">` (the same technique the
    project-scaffold `app/page.tsx` already uses for a bracketed label)
    imports it byte-exact with zero derivation logic to get wrong.
- `Marquee` (`site/components/motion/Marquee.tsx`), **unmodified**:
  `speed="brands"` (40s, `animate-marquee-brands`), `label="Franchise flags we
  transact across"` (the rail's accessible name — distinct wording from the
  visible micro-label is fine; both avoid "partners"/"clients"),
  `trackClassName="gap-8 md:gap-12"` for letterbox spacing, `edgeFade` left at
  its default `true` (`rail-mask`). Zero new JavaScript — `Marquee` is a
  Server Component and stays one.
- One row of children, each `franchiseFlags[i].name` and the trailing
  `INDEPENDENTS_MARK`, mapped from `@/content/brands` — `Marquee` duplicates
  the row internally for the seamless loop, so this component renders it
  exactly once.
- Each mark is a `<span>`, not a link — linking to a franchisor's own site
  would read as an implied relationship, which ref 01 forbids.
- `text-heading` is the sizing token for every mark: its clamp
  (`1.375rem → 1.75rem`) resolves to **22px at the mobile floor and 28px at
  the desktop ceiling** — matching ref 04's "~28px desktop / 22px mobile"
  spec exactly, so no arbitrary size is introduced.
- Tracked caps: AGENT-BRIEF.md's typography program allows exactly two
  tracked-caps flavours, `brand-line` and `micro-label`, and reserves
  `brand-line` to "headers/footers only." Rather than invent a third tracking
  value, marks use the `tracking-micro` utility (the same `0.14em` token
  `micro-label` itself uses) combined with `uppercase` directly, in `--meta`
  tone (`text-fg-meta`) — never `--accent`, so nothing here reads as brand
  color. `uppercase` is also what makes "uniform optical height" actually
  true for text marks: capitalizing removes every descender/ascender
  variance between names (no "y", no "h" tail height difference once set in
  caps), so the row reads level the way a real logo row would.
- `font-sans` (Inter): of the three type voices, the sans is the one real
  hotel wordmarks most often resemble (most of the nine are sans logotypes),
  so it reads more like "a row of names standing in for logos" than the
  display serif (reserved for headline/stat-numeral luxury voice) or mono
  (reserved for data) would.

## States

- **Static** (only state — no hover/press interaction is offered on a mark;
  linking or color-shifting on hover would both violate ref 01's "never
  colorized, never implying endorsement").
- **Reduced motion**: `Marquee`'s existing CSS handles this untouched —
  `[data-marquee]` freezes to its first frame, `[data-marquee-clone]` is
  `display: none`, so the row reads as one static, complete list of names,
  not a truncated loop.
- **Hover / focus on the rail**: `Marquee`'s existing
  `[data-marquee-viewport]:hover / :focus-within` pauses the translateX
  animation. No mark inside is itself focusable (no links, no `tabindex`), so
  `:focus-within` has nothing to trigger on today; this is inherited,
  unmodified behaviour, not a gap introduced here.

## Accessibility

- `<section id="brands" aria-labelledby="brands-heading">` names its own
  `<h2 id="brands-heading" className="micro-label">{BRANDS_MICRO_LABEL}</h2>`
  — a real heading contributes to the page's heading outline even though it
  is visually a small-caps eyebrow, exactly as `MicroLabel` is used
  elsewhere.
- `Marquee`'s `role="group" aria-label="Franchise flags we transact across"`
  gives the animated rail its own accessible name, independent of the
  section heading.
- The marks are real DOM text (not an image, not CSS `content`), so no
  information is conveyed by motion alone — a JS-off or reduced-motion visitor
  reads the identical list of names.
- `TRADEMARK_MICROCOPY` renders as plain, always-visible body text (not a
  tooltip, not hover-only) — nothing here is hover-gated information.
- No color-only signal anywhere in this section (there is no signal at all
  beyond "this text names a franchise system").

## Motion

Entirely `Marquee`'s existing, unmodified CSS keyframe
(`--animate-marquee-brands`, 40s, `linear infinite`, `transform` only — no
layout property). This component adds **no** `Reveal` entrance wrapper and
**no** `"use client"` boundary: `Marquee` is deliberately a Server Component
to protect the 180KB landing JS budget, and wrapping it in `Reveal` would
pull in `motion/react` for a section ref 04 never asks to have an entrance
animation, working against that same budget for no spec-mandated benefit.

## Acceptance criteria

- [ ] All nine `franchiseFlags` names + `INDEPENDENTS_MARK` render from
      `@/content/brands`, no retyped copy.
- [ ] `BRANDS_MICRO_LABEL` and `TRADEMARK_MICROCOPY` render verbatim, sourced
      from `@/content/brands` (which re-exports the latter from
      `@/content/compliance` unmodified).
- [ ] Label never reads "partners," "clients," or "brands we work with"
      anywhere in the rendered section.
- [ ] Marks are grayscale (`text-fg-meta`, never `text-accent-text` /
      `bg-accent`), never colorize on `:hover`, never link out.
- [ ] Marquee runs at `speed="brands"` (40s), duplicates via `Marquee`
      unmodified, pauses on hover **and** focus, freezes to a static row
      under `prefers-reduced-motion`.
- [ ] `rail-mask` edge fade present (Marquee's default `edgeFade`).
- [ ] `<section aria-labelledby="brands-heading">` points at the section's
      own `h2`.
- [ ] Mark size uses `text-heading` (no arbitrary px/rem); tracking uses
      `tracking-micro` (no third tracked-caps flavour introduced); color uses
      `text-fg-meta` throughout — no hex, `rgb()`, or Tailwind-default-palette
      color anywhere in the file.
- [ ] Zero new client JavaScript: no `"use client"` directive in this file.
- [ ] `tsc --noEmit` clean for `BrandsSection.tsx`.
