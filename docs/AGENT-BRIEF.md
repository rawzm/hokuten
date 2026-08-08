# AGENT BRIEF — Phase 1 build rules

Every implementing agent reads this file first. It is the compressed form of
[AGENTS.md](../AGENTS.md), [PHASE-1-EXECUTION.md](PHASE-1-EXECUTION.md), and the
`hokuten-design-director` skill. Where this file and a skill reference disagree,
the skill reference wins — go read it.

Repo root `/Users/razim/Documents/Hakuten` · app in `site/`.

## Stack (verified against `site/node_modules` — do not assume from memory)

Next.js 16.3 App Router · React 19.2 · Tailwind v4.3 (no `tailwind.config`; all
tokens live in `@theme` inside `site/app/globals.css`) · TypeScript strict ·
pnpm 11.9 · `motion@13` (`motion/react`) · `lenis` · `lucide-react` · Radix
primitives · `sharp` + `tsx` for build-time art · `vitest@3`.

## Read before writing a line

- `site/app/globals.css` — the token sheet. **Read it end to end.** It is the contract.
- `.agents/skills/hokuten-design-director/references/` — `01-brand` · `03-visual-system` ·
  `04-page-anatomy` (authoritative per-section spec) · `05-motion` · `06-content-and-proof` · `07-audit`
- `docs/PHASE-1-EXECUTION.md` §2 design thesis · §3 typography · §5 section notes · §6 interaction
- `docs/port/` — verbatim extracts of the source of record
- Source of record, **READ-ONLY, never write**: `~/Documents/Dino/dino-sites/kwc-dinomonteverde/`

## What already exists — reuse it, never duplicate it

```
site/lib/          types · status (STATUS_PRESENTATION) · motion (DUR/EASE/revealVariants/IN_VIEW/
                   HERO_BUDGET/motionAllowed/freezeMotion) · theme (THEME/themePresentation) ·
                   utils (cn/displayPrice/displayCapRate/metaLine/PRICE_ON_REQUEST) ·
                   valuation (FROZEN calculator engine) · seo · web3forms · ascii-types
site/content/      closings · listings · team · stats · methodology · mandates · faq · doors ·
                   brands · nav · site · compliance
site/components/ui/     button · input · textarea · label · field · dialog · accordion ·
                        popover · select · checkbox
site/components/atoms/  MicroLabel · SectionHeader · StatNumeral · AccentRule · Badge ·
                        DataLine · PhotoFrame · Stamp
site/components/cards/  CardShell (the fixed-height card chassis)
site/components/motion/ Reveal · Marquee · CountUp · SmoothScroll · CopyButton
site/public/art/        ascii-gold.json · ascii-blue.json · ascii-gold.svg · ascii-blue.svg ·
                        listing-placeholder.svg
site/public/brand/      hokuten-wordmark-{gold,blue}.svg · kw-commercial.png · lockup-stacked-gold.png
site/public/og/         og-gold.png · og-blue.png
site/public/hotels/     carte-san-diego · renaissance-reno · last-hotel-st-louis ·
                        hie-brooklyn · radisson-mcallen · rohnert-park (.jpg)
site/public/team/       dino-monteverde.jpg
site/public/data/       us-cities.min.json (552KB — fetch at runtime, NEVER import)
```

**Always read a file's real exports before importing it.** Never guess a name.

## Design thesis — every screen reads all three registers

1. **Heritage** — ASCII/dither art, hanko seal, star-grain dark panels, serif display voice.
2. **Enterprise platform** — mono tabular data, cap rates, LP/SP ratios, badges, a bracketed
   numbered index on every section. A Crexi/CoStar user must feel at home, just upgraded.
3. **Hospitality warmth** — warm paper canvas, ivory hairlines, real hotel photography, air.

Per viewport: one heritage art object + one data proof + warm chrome. **Zero mono data means
it is drifting to brochure; zero warmth means it is drifting to terminal.**

## Typography program (Razim: "very important")

- Fraunces **Light 300 is the default display weight** — luxury reads light, not bold.
  Stat numerals: Light 300, negative tracking at large sizes.
- **Exactly ONE italic accent word per headline** (Fraunces Italic, same size and weight as
  its line). Never italicise UI or data. `SectionHeader` implements the device — use it.
- Bold = Inter 600 for CTAs / nav-active / form labels; Fraunces 400 (never 600+) when a
  display line needs a firmer step; mono 500 for emphasised data values.
- Tracked caps come in exactly two flavours: `brand-line` (Inter caps 0.35em) and
  `micro-label` (mono caps 0.14em, bracketed index).
- Two-tone emphasis on dark: key phrases `text-fg`, the rest `text-fg-muted` — weight constant,
  colour carries emphasis.
- 2–4 sizes per section (a fifth is P1). Body never below 16px (P0).

## Token law (P0 gate)

**No hex, `rgb()`, or Tailwind default palette colour (`gray-*`, `slate-*`, `blue-*`, `zinc-*`)
in any component.** Hex lives only in `globals.css` and skill ref 01.

Surface scopes — put ONE on a section/card root; everything inside inherits the right text,
accent and hairline: `.surface-paper` `.surface-deep` `.surface-card` `.surface-dark` `.surface-black`

| | |
|---|---|
| Colour | `text-fg` `text-fg-muted` `text-fg-meta` `text-accent-text` `border-hairline` `bg-surface` `bg-field` `bg-accent` `text-on-accent` `bg-accent-chip` `bg-accent-wash` `text-brick` |
| Type | `text-display1/display2/heading/body-lg/body/data/micro` · `font-display/sans/mono` · `tracking-brand/micro` |
| Utilities | `micro-label` `brand-line` `data-line` `tabular` `hairline{,-t,-b,-l}` `rail-mask` `star-grain` (DARK ONLY) `plate-frame` (LIGHT ONLY) `container-hk` `container-wide` `section-pad` `photo-reveal` `visually-hidden` `skip-link` |
| Shape/motion | `rounded-none/-card/-pill` · `duration-fast/base/reveal/slow` · `ease-out/ease-in-out` |

Two themes (`[data-theme="gold"|"blue"]`) ship from ONE codebase — **never assume the accent is
gold.** Accent is scarce: CTAs, one accent word per headline, badges, thin rules. Past ~5% of a
viewport it is wrong.

## Motion law (ref 05)

`transform` / `opacity` / `filter` / `clip-path` only — never a layout property. Reveals fire
ONCE (use the existing `Reveal`; do not hand-roll another). Exactly two easings sitewide. **No
bounce or overshoot** — finance/trust surface. Stagger ≤6 children. Every animated component
gates on `useReducedMotion()` **and** `motionAllowed()` with a **designed static state**, never
a missing one.

Card hover: photo grayscale→colour + scale ≤1.02 at `duration-base`/`ease-out`, ring shifts to a
hairline accent ~40%. **Never translate a card. No spring, no shadow lift.**

## Accessibility law — WCAG 2.1 AA treated as binding (CA Unruh exposure)

- `<section id aria-labelledby>` pointing at its own heading. Exactly one `h1` (the hero owns it).
- 44px tap targets · visible 2px focus ring, never removed · real `<label>` always, never
  placeholder-as-label · errors via `aria-describedby` **and an icon**, never colour alone ·
  error summary focused on submit failure · `autocomplete` attributes.
- No hover-only information (touch uses the `tapped` toggle). Marquees pause on hover **and**
  focus and go static under reduced motion.
- Anchor navigation moves focus to the target heading.
- Lucide icons only. No emoji. No text-glyph arrows in UI (`→` only inside mono micro-labels, as type).
- Decorative art `aria-hidden` **with** an adjacent visually-hidden description.

## Content law

All copy, data and legal strings come from `site/content/`. **Never retype a legal string, a
price, a stat or a bio into a component** — import it. If content is missing something, report
it; do not invent it.

- **Evidence gate**: no claim ships without a `verified-current` row in ref 06. Nothing
  `pending-verification` renders — the Sarhan-era "~$1B" narrative and the Sarhan testimonials
  in particular. KW corporate awards are `prohibited`.
- Voice: numbers-first, discreet, unhurried. Say the metric, then stop. "Confidential" replaces
  a missing number proudly, never "N/A". Price fallback is exactly `"Price on Request"`.
- **BANNED**: unlock · elevate · seamless · world-class · "experience you can count on" ·
  Learn more · Get started · Submit · exclamation marks.
- Brand is **HOKUTEN**. Never "Hakuten" — not in code, comments, alt text or filenames.
  No Sarhan branding anywhere.

## Secrets (P0)

`FRED_API_KEY` is server-side only and may appear **only** under `site/app/api/`. Never in a
client component, never `NEXT_PUBLIC_`, never logged. The only public-class key is
`NEXT_PUBLIC_WEB3FORMS_KEY` — **not yet provisioned**. Never hardcode a key value anywhere,
including comments and examples.

## Responsive

375px floor (iPhone SE is a mandated QA viewport), then 640 / 768 / 1024 / 1280 / 1440+.
Centred single-column stacks on mobile. Cards 3-up desktop / 1-up mobile (2-up ≥640px only if
cards stay ≥320px wide). Everything reachable by scroll and tap — no drag, no long-press, no
gesture knowledge.

## Engineering

- **Server Components by default.** `"use client"` only where interactivity genuinely requires
  it — the landing route budget is **180KB gzip** and you are one of many contributors. Push the
  client boundary down into a small island rather than marking a whole section client.
- TS strict, no `any`. Use `cn()` from `@/lib/utils`.
- Images through `next/image` with explicit dimensions (CLS budget 0.02). Alt describes the
  subject, not the treatment.
- **Do NOT run `pnpm build` or `pnpm dev`** — agents share `.next` and will clobber each other.
  `npx tsc --noEmit --incremental false` and `npx vitest run` from `site/` are fine. Running your
  own generator script with `npx tsx scripts/<file>.ts` is fine.
- Do not install packages.
- **WRITE ONLY YOUR ASSIGNED FILES.** Other agents run concurrently. Never edit `globals.css`,
  `layout.tsx`, `page.tsx`, or anything under `lib/`, `content/`, `ui/`, `atoms/`, `motion/`,
  `cards/` unless it is explicitly assigned to you. Report needed changes instead.

## The calculator is frozen

`site/lib/valuation.ts` is a byte-equivalent port of the source math. Its config, defaults,
bands, adjusters, rounding and ADVICE rules **may not change** without a dated
PROJECT-MEMORY.md decision. Design restyles the UI; design does not touch the math.

## Your return value

Your final text output is a **return value consumed by a program**, not a chat message. Give:
files written · exported props/signatures other agents need · decisions · content gaps ·
anything you assumed about another agent's file · anything you could not do. Be honest about
what you did not verify.
