> ## ⚠️ FULLY SUPERSEDED — Design Revisit round (D2/D5/D6/D7, 2026-08-08/09)
>
> **Everything below describes a chassis that no longer exists.** Verified
> against the filesystem on 2026-08-09: `site/components/hero/HeroCoverPanel.tsx`,
> `HeroPlate.tsx`, and `site/components/art/PlateChrome.tsx` are gone —
> `site/components/hero/` now holds exactly two files, `Hero.tsx` and
> `heroContent.ts`. `<AsciiCanvas>` is retired from the page entirely (D5);
> the ASCII JSON/SVG assets and the generator script stay in the repo,
> uninvested, per `docs/AGENT-BRIEF.md`'s "What already exists" section.
>
> Do not implement or audit against anything in this file. The current
> anatomy — read `docs/DESIGN-REVISIT.md` §4.2 for the work order and
> `site/components/hero/Hero.tsx`'s own header comment for the as-built
> record (both read in full for this note, 2026-08-09) — is, in one
> paragraph: ONE chassis for both themes (no more `HeroCoverPanel`/`HeroPlate`
> split), four rows — nav (not this component's job), a full-bleed supplied
> 「北天」 glyph-mosaic art band (`next/image`, resolved via
> `content/artwork.ts`'s `getArt("hero.gold"|"hero.blue")`, the LCP element),
> a headline row below the art at the new hero-only `text-display0` step
> (D8), and `<BrandsMarquee />` as a **sibling** landmark (not a child of
> `<section id="hero">`) closing the first viewport per D2. The nav
> scroll-sentinel contract this file's §"Nav sentinel contract" documents
> (`data-nav-sentinel` / `data-surface`) is the one piece that carried
> forward unchanged — `Hero.tsx`'s header confirms it is "PRESERVED
> VERBATIM." The "seam row" requirement this file's §"Layout" spent several
> paragraphs resolving no longer exists as a build concern at all (D5 — it is
> now, if wanted, something Razim puts in his own img2img prompt, not
> something this repo's layout math defends against).
>
> `Hero.tsx` was being actively edited by the main loop at the time this note
> was written (2026-08-09) — read that file directly for the current state
> rather than trusting this note's summary as exhaustive.

# Hero — `Hero` / `HeroCoverPanel` / `HeroPlate` / `PlateChrome`

**Section/Route**: `#hero`, section 1 of 13 (ref 04 "Section order"), both theme chassis on the same landing route.
**Status**: approved (self-specified per the task brief's own instructions; no open decision blocks implementation — every design choice below is resolved, not proposed)
**Owner**: `site/components/hero/heroContent.ts`, `HeroCoverPanel.tsx`, `HeroPlate.tsx`, `Hero.tsx`, `site/components/art/PlateChrome.tsx`
**Governs**: ref 04 (`#hero`), ref 02 (Coronal video digest, Paisana/Horizonte/Aurelian digests), ref 03 (type ramp, surfaces, `plate-frame`), ref 05 (ASCII hero, ambient loop, motion doctrine), ref 06 (voice, evidence gate), ref 07 (P0 a11y/perf gates)

## ⚠️ Concurrency note — read before touching any of these files

`docs/design/specs/nav.md` (already authored, `SiteNav.tsx`/`MenuOverlay.tsx` already built) **defines the nav scroll-sentinel contract itself**, because it landed before this hero task started. This spec does **not** invent a second contract — it implements nav's exactly as written: `<section id="hero">` carries `data-nav-sentinel` (presence-only) and `data-surface="dark"|"light"` (`themePresentation.heroSurface === "surface-black" ? "dark" : "light"`), the element already spanning the hero's full block extent. See "Nav sentinel contract" below for the verbatim implementation and what `SiteNav` does with it.

## Intent

The site's one authoritative sentence before imagery (Paisana digest: "manifesto-as-hero"). A visitor must know **who** (a hospitality investment-sales brokerage, nationwide) and **what** (a defensible number, not a guess, delivered as a 48-hour written BOV) with zero scroll, in both theme chassis, without the two builds ever saying different things. The ASCII/dither hotel art is the one signature effect on this screen — heritage register. The mono value rail plus the BOV-condition sub line (T-12/STR/PIP) are the enterprise-platform register operating inside the hero itself, so the screen is not "zero mono data" even before the visitor reaches `#stats`. Warm register comes from the CTA pill + the real, verified BOV promise rather than any texture.

**Why no stat digit ($200M+ / 12 / 836K+ / 3×) appears in the hero copy**: `#stats` is the immediately-following section and owns those four numbers as its entire reason for existing (Fraunces numerals + mono captions, ref 04 `#stats`). Restating one in the hero headline/sub would be duplication, not additional proof, and risks setting a precedent of digits appearing in Fraunces display type here while the site's own type law reserves mono for deal data. The eyebrow (service line) plus the BOV promise (a concrete, conditioned commitment) are judged sufficient "who/what" for the zero-scroll acceptance check — see Acceptance criteria.

## IA

Both chassis render the identical six slots, sourced from ONE content module (`heroContent.ts`) so they cannot drift:

1. Eyebrow micro-label — `Hospitality investment sales — nationwide` (sentence-case source, rendered upper via the `micro-label` utility; bracket device composed by `MicroLabel`).
2. Display-1 headline, one sentence, one italic word — "Every listing gets a number we can *defend*, not one we guess."
3. One-line sub — "A written BOV in 48 hours, on receipt of your T-12, STR, and PIP." (the BOV promise WITH its condition — ref 06 evidence-gate requirement).
4. Dual CTAs — primary "Request a written BOV" → `#bov` (reused verbatim from `content/nav.ts`'s `navCta`, so the hero and the nav CTA can never diverge), ghost "See the track record" → `#closings`.
5. Right-edge small-caps value rail — Discretion / Data / Execution / Closed deals. `lg:` and up only (decorative rhythm device, `aria-hidden`; nothing it conveys is exclusive to it — "closed deals" is the `#closings` section, the other three are abstract brand values already carried by the rest of the page).
6. Scroll cue — real, visible "Scroll" text + `ChevronDown`, a genuine link to `#stats` (not decoration-only).

Chassis-specific additions (NOT shared content, authored locally in each file, since they are chrome/brand mechanics rather than copy):
- **HeroCoverPanel**: none — the dark cover panel has no wordmark of its own on this screen (identity comes from the eyebrow here and the nav wordmark once scrolled/always-visible in the sticky bar).
- **HeroPlate**: the white knockout plate (Hokuten wordmark via `Wordmark variant="lockup"` + mono tag "北天 — Northern sky") and the plate caption "Study — Holiday Inn Express Brooklyn" (names the real photograph the ASCII asset renders — `lib/ascii-types.ts`'s `ASCII_ART_DESCRIPTION`, `content/closings.ts`'s `name` for the same property).

## Component plan

| Component | Tokens used | Source of truth |
|---|---|---|
| `heroContent.ts` | — (data only) | Authored once; imports `navCta` from `content/nav.ts`, `anchor()` from `content/site.ts` |
| `Hero.tsx` | — (switch only) | `themePresentation.heroChassis` (`lib/theme.ts`) |
| `HeroCoverPanel.tsx` | `surface-black`, `text-display1`, `text-body-lg`, `micro-label`, `font-display`/`font-light`, `container-hk`, `section-pad`, `duration-fast`/`ease-out` | `heroContent`, `AsciiCanvas` (palette `gold`), `Reveal`, `Button` |
| `HeroPlate.tsx` | `surface-paper`, same type/layout tokens as above, `rounded-card`, `bg-card`, `shadow-[var(--shadow-overlay)]` | `heroContent`, `AsciiCanvas` (palette `blue`), `PlateChrome`, `Wordmark` (`variant="lockup"`), `Reveal`, `Button` |
| `PlateChrome.tsx` | `hairline`, `rounded-pill`, `border-accent-text`, `micro-label`, `bg-card/90` | Extends `globals.css`'s `plate-frame` utility to four real corner marks (see file header) |

## Layout — the seam-collision resolution (both chassis)

The hardest constraint (ref 04): "the seam row resolving into THE HOKUTEN GROUP ... must never collide with the headline at any viewport." The shipped asset (`public/art/ascii-{gold,blue}.json`, verified by direct read 2026-08-08): `cols=160`, `rows=64`, `seamRow=46` → **71.9% down the grid**, centred columns (per the task brief) 64–96 of 160.

Rather than reserve a percentage band on an overlay and re-verify it against every headline length, **both chassis put the copy and the art in disjoint boxes — never one overlaid on the other**:

- **`< lg` (375, 768)**: single column, DOM/visual order = eyebrow → h1 → sub → CTAs → art (plate or canvas). The reserved region for the art is everything below the last CTA; the reserved region for the headline is everything above it. Zero vertical overlap, so the 71.9%-down seam row — wherever it lands inside the art's own box — can never reach the headline's box.
- **`≥ lg` (1440, and 1024–1439 at the same breakpoint)**: a two-column CSS grid (`grid-cols-1 lg:grid-cols-2`), copy in column 1 (left, source order first), art in column 2 (right). The reserved region for the art is the entire right column; the headline never enters that column's x-range. The seam row lives at 71.9% down the right column only.

This is verified structurally, not by measuring a live render: at all three named viewports the copy and art boxes are non-overlapping DOM siblings inside a grid, so there is no coordinate space in which they could collide, independent of exact headline length or font-loading reflow.

`HeroPlate` additionally never overlays the copy on the art the way a "beside" reading might suggest for HeroCoverPanel — the plate (frame + art + knockout card) is entirely inside its own column, so "chrome never moves while the art morphs" (Coronal acceptance check) holds trivially: nothing chrome-related shares a box with the animating canvas except the plate's own static frame/marks/caption/knockout card, none of which move.

## Nav sentinel contract (implemented, not invented)

Both `HeroCoverPanel` and `HeroPlate` render:

```tsx
<section
  id="hero"
  aria-labelledby="hero-heading"
  data-nav-sentinel
  data-surface={themePresentation.heroSurface === "surface-black" ? "dark" : "light"}
  className="surface-black" /* or surface-paper for HeroPlate */
>
```

Exactly the expression `docs/design/specs/nav.md` names. `SiteNav.tsx` (already built) queries `document.querySelector('[data-nav-sentinel]')`, observes it with an `IntersectionObserver` whose root margin is trimmed by the live `--nav-h`, and reads `data-surface` to choose its own dark/light chrome. Theme G resolves `"dark"`; Theme B resolves `"light"` (and per nav's own spec, "light" is also nav's safe fallback if this attribute is ever missing — Theme B's hero being genuinely light and Theme G's being genuinely dark are both represented correctly here, so the fallback path is never exercised in practice).

## States

- **Default**: as specified. No loading/empty/error state — hero content is static, server-rendered.
- **Reduced motion / data-saver / coarse pointer**: `AsciiCanvas` degrades to its own designed static state (the SVG frame, same art, zero JS) — nothing in either chassis file adds a second reduced-motion branch; there is nothing else animated to gate.
- **JS-off**: h1, sub, CTAs, eyebrow, rail, scroll cue, and the static SVG art are all server-rendered HTML — the page reads and functions identically (CTAs and the scroll cue are real `<a href>` elements).
- **Below-the-fold edge case** (very short viewport / iframe preview): `Reveal`'s own documented behaviour arms the copy+art block and fires the standard fade+rise-in on first intersection; on any normal hero placement (always first in the viewport) this branch never fires and content is visible immediately.

## Motion

Exactly two systems, per the brief's "nothing else animates except a single entrance reveal":

1. `AsciiCanvas`'s own shimmer (120px pointer radius, 400ms decay) + ambient morph loop — owned by that component, unchanged here. The signature effect.
2. ONE `<Reveal>` (no `stagger`) wrapping the copy+art grid as a single block. `DUR.reveal`/`EASE.out`/20% intersection per `lib/motion.ts`, but in practice **fires no animation on a normal page load** — `Reveal.tsx`'s own logic only arms elements that start below the fold, and the hero is always first in the viewport, so both the server HTML and the first client render show the final, fully-visible state. This is what satisfies "the h1 ... server-rendered immediately, never blocked by the canvas."

The scroll cue's colour transition (`duration-fast`/`ease-out` on hover) is a plain CSS `transition-colors`, globally neutralised under `prefers-reduced-motion` by the base-layer rule in `globals.css` — no third motion system, no JS reduced-motion gate needed (same reasoning `Button.tsx` documents for its own hover transition). The scroll cue itself has **no** looping/bouncing animation — a second ambient animation on this screen would violate "one signature effect per viewport."

No `star-grain` on `HeroCoverPanel` (see that file's header for the reasoning: the ASCII canvas is already this screen's texture; a second decorative texture risks reading as a competing effect). No `plate-frame`/`star-grain` mixing on `HeroPlate` — `PlateChrome` is the light-only device, used exactly once, nowhere near a dark surface.

## Accessibility

- `<section id="hero" aria-labelledby="hero-heading">`, `<h1 id="hero-heading">` — the site's one `<h1>` (a11y law).
- CTAs and the scroll cue are real `<a href>` elements, keyboard-reachable, 44px+ tap targets via the shared `Button` component (`size="lg"` = 52px box) and the scroll cue's own padding.
- Decorative art: `AsciiCanvas`/`AsciiStatic` already render `aria-hidden="true"` with an adjacent `visually-hidden` description (`ASCII_ART_DESCRIPTION`) internally — neither chassis adds a second description (would duplicate the announcement).
- Value rail: `aria-hidden="true"` on the whole list — decorative rhythm device, nothing exclusive to it (see IA above).
- `PlateChrome`'s registration marks: `aria-hidden="true"` (four spans, purely decorative). Its caption, when present, is real text (a genuine plate label, not decoration).
- `HeroPlate`'s knockout card: **not** `aria-hidden` — `Wordmark`'s accessible name ("The Hokuten Group") is the only spoken/readable brand-name instance on this screen in Theme B, and the mono tag beneath it is short, real, harmless supplementary text.
- Focus order follows DOM order in both chassis: eyebrow (not focusable) → h1 (not focusable, but is the landmark heading) → sub → primary CTA → ghost CTA → (art, not focusable) → scroll cue. Rail and registration marks are never in the tab order (`aria-hidden`).
- Contrast: `text-fg`/`text-fg-muted` (inherited from `.surface-black`/`.surface-paper`) and `text-fg-meta` (scroll cue, rail) all resolve through the accessible tones recorded in `docs/design/CONTRAST.md` / skill ref 01 "Accessible tones" — no new colour introduced by this spec.

## Acceptance criteria

- [ ] Both chassis render identical copy (eyebrow, headline, sub, CTA labels, rail, scroll-cue label) sourced from `heroContent.ts` — a diff of the two files' rendered text (ignoring markup) is empty except for the Theme-B-only knockout card/caption.
- [ ] At 375, 768, and 1440px, the headline's bounding box and the art's bounding box never overlap (verify by inspecting the grid in DevTools — copy column vs. art column, or copy block vs. art block below it on mobile).
- [ ] `<section id="hero">` carries `data-nav-sentinel` and the correct `data-surface` value in both theme builds (`gold` → `"dark"`, `blue` → `"light"`).
- [ ] Exactly one `<h1>` on the page, with real text content matching `heroContent.headline`, present in view-source (JS off).
- [ ] Primary CTA href is `#bov` and its label matches `content/nav.ts`'s `navCta.label` exactly (no drift).
- [ ] Loading the page with `prefers-reduced-motion: reduce` shows the static SVG art frame immediately, with no shimmer/loop and no console error.
- [ ] Loading the page with JS disabled shows full hero content (headline, sub, both CTAs as working links, static art) with zero blank/placeholder state.
- [ ] `npx tsc --noEmit --incremental false` from `site/` reports no error in any of the five owned files.
- [ ] No hex/`rgb()`/Tailwind default-palette colour class in any of the five files — `grep -nE "text-(gray|slate|zinc|blue)-|#[0-9a-fA-F]{3,6}|rgb\(" site/components/hero/*.tsx site/components/art/PlateChrome.tsx` → no hits (the `shadow-[var(--shadow-overlay)]` and `bg-card/90` values are token references, not raw colours).
- [ ] `grep -rn "Hakuten" site/components/hero site/components/art/PlateChrome.tsx` → no hits.
