# RESUME — Phase 1 build handoff

**Kickoff prompt for the next session:** *"Read docs/RESUME.md and continue the Phase 1 build."*

**Last updated:** 2026-08-08, at the session-budget pause (~80% used).
All work below is committed and pushed to `main`. Nothing is uncommitted.

> **Do not try to resume the old workflows.** Workflow resume-from-cache is
> same-session only; after a reset the cache is gone. **Disk state is the
> truth.** Check what exists, then relaunch only what §4 lists as missing.

---

## 1. Budget protocol (agreed with Razim)

- Cost is ~entirely subagents; the main loop is a rounding error. Keep the main
  loop on the strong model for integration and build-fixing.
- Model split that worked: precision work (frozen calculator math, byte-exact
  legal text, canvas perf) on **Opus**; pattern work (sections) on **Sonnet**.
- Razim signals at ~87%. On signal: `TaskStop` every workflow → commit → refresh
  this file → push. That is ~4 calls and leaves ample headroom.
- **Lesson from this session:** ~35 Opus agents ≈ one full session budget. Budget
  roughly **35–40 Opus agents** or **~100 Sonnet agents** per session, and do
  integration in the main loop.

## 2. Suggested plan for the next session

Ordered so the session ends deployable even if it is cut short again.

1. **Assemble + green build first** (main loop, cheap, ~20 min). Write
   `app/page.tsx`, stub anything still missing with a visible `blocked:` block,
   run `pnpm build`, fix to green, push. **Do this before spawning any agent.**
2. **Fill the gaps** (§4) — one Sonnet workflow, ~8 agents.
3. **Re-assemble for real**, rebuild, push `main`, fast-forward `theme-blue`,
   confirm both Vercel deploys.
4. **Ship gate** — one workflow: design audit, a11y (axe + keyboard), perf
   (LCP/CLS/INP/bundle), compliance vs PHASE-1-EXECUTION §8, content fidelity vs
   the kwc source, anti-AI-slop. Run against BOTH theme URLs.
5. `docs/PLACEHOLDERS.md`, `docs/design/AUDIT_LOG.md`, PROJECT-MEMORY entry.

## 3. DONE — on disk and pushed

- **M0 foundation** — Next 16.3 / React 19.2 / Tailwind v4.3 / TS strict / pnpm.
  `app/globals.css` is the token sheet: semantic tokens bound per theme by
  `[data-theme]`, plus five `.surface-*` scopes that rebind text / accent /
  hairline so one component is correct on every surface in both themes.
- **Contrast** — `docs/design/CONTRAST.md` + re-runnable `contrast.mjs`. Three
  brand tones adjusted because they measurably failed AA as text; recorded in
  skill ref 01 → "Accessible tones".
- **Vercel** — Root Directory `site`, framework `nextjs`,
  `NEXT_PUBLIC_HOKUTEN_THEME` = `gold` (prod/preview/dev), `blue` (branch-scoped
  to `theme-blue`). Branch `theme-blue` pushed, zero code diff. Previews are
  SSO-protected; the public launch gate is untouched.
- **Port pack** — `docs/port/` 01–07, each written then attacked by an
  independent verifier against the source.
- **Content** — all 12 typed modules in `site/content/`.
- **Design system** — 10 primitives (`ui/`), 8 atoms (`atoms/`),
  `cards/CardShell`, 5 motion wrappers (`motion/`), `app/template.tsx`.
- **Calculator** — `lib/valuation.ts` (frozen port), `lib/valuation.test.ts`,
  `vitest.config.ts`, and `calculator/` BenchmarkBars · CalculatorResult ·
  CalculatorSteps · InfoPopover.
- **Sections (10 of 11 + cards)** — Stats · Brands · Closings · Listings ·
  Method · Doors · Mandates · Faq · Bov · SiteFooter; ClosingCard, ListingCard.
- **Forms / data** — BovForm, CityPicker, PhoneField; ConsentModal,
  ConsentProvider, `lib/consent.ts`; `app/api/ticker-data/route.ts`,
  `lib/ticker.ts`, TickerBar, TickerClient.
- **Routes** — `/privacy`, `/sms-terms`, `/accessibility`, `legal/LegalPage`,
  `seo/JsonLd`, `robots.ts`, `sitemap.ts`, `lib/seo.ts`, `lib/web3forms.ts`.
- **Art** — `public/art/ascii-{gold,blue}.{json,svg}` (28-frame morph loop,
  406KB gzip of a 1536KB budget; **seam row verified legible**:
  `T H E  H O K U T E N  G R O U P`), `art/AsciiCanvas`, `art/AsciiStatic`,
  `public/og/og-{gold,blue}.png`, wordmark SVGs, and the full 北天 hanko set
  (gold / blue / on-dark, favicons, apple-touch-icon).
- **Docs** — `AGENT-BRIEF.md` (the compressed rulebook every agent reads),
  `design/CONTRAST.md`, `design/HANKO.md`, `design/LOGO-MANIFEST.md`,
  `design/MOTION-RECIPES.md`, and 9 section specs in `design/specs/`.

## 4. MISSING — the next session's work list

Verify against the filesystem before rebuilding anything.

| # | What | Path |
|---|---|---|
| 1 | **Replace the INTERIM page assembly** — `app/page.tsx` currently renders 10 real sections plus a temporary hero and three visible `blocked:` blocks. Delete `InterimHero` and `Blocked`, drop in the real Hero / SiteNav / TeamSection / CalculatorSection. | `app/page.tsx` |
| 2 | Nav + numbered menu overlay | `components/sections/SiteNav.tsx`, `components/nav/MenuOverlay.tsx` |
| 3 | Team section + card | `components/sections/TeamSection.tsx`, `components/cards/TeamCard.tsx` |
| 4 | Both hero chassis + shared copy | `components/hero/{Hero,HeroCoverPanel,HeroPlate,heroContent}.tsx` |
| 5 | Calculator shell + section wrapper | `components/calculator/Calculator.tsx`, `components/sections/CalculatorSection.tsx` |
| 6 | Wordmark component | `components/brand/Wordmark.tsx` |
| 7 | Engraving + dark-section art | `components/art/{HotelEngraving,OrbitalArcs,PlateChrome}.tsx`, `public/art/hotel-engraving.svg` |
| 8 | Specs for nav / method / team / hero | `docs/design/specs/` |
| 9 | Placeholder register + audit log | `docs/PLACEHOLDERS.md`, `docs/design/AUDIT_LOG.md` |
| 10 | Specimen + art preview routes (optional) | `app/specimen/`, `app/art/` |
| 11 | Ship gate — audits, perf, a11y, compliance, content fidelity, anti-slop | — |

## 5. Build status — GREEN

`pnpm build` passes. Zero type errors. Routes prerendered: `/`, `/privacy`,
`/sms-terms`, `/accessibility`, `/robots.txt`, `/sitemap.xml`, plus the dynamic
`/api/ticker-data`. Both `main` (gold) and `theme-blue` (blue) are pushed at the
same commit, so both Vercel URLs build.

All six earlier `tsc` errors are fixed. The one worth remembering:

> **`Reveal.Item` did not survive the RSC boundary.** `Reveal` is a `"use client"`
> component that exported its subcomponent via
> `Object.assign(RevealRoot, { Item })`. A Server Component importing it gets a
> client *reference*, not the function object, so properties hung off it are
> `undefined` — React threw "Element type is invalid" with no useful stack.
> Fixed by exporting `RevealItem` as its own named export. **Never attach a
> subcomponent to a client component with `Object.assign` and render it from a
> Server Component.** Isolated by giving each section its own probe route and
> curling them all: every failing section used `Reveal.Item`, every passing one
> did not — a much faster diagnosis than bisecting the page.

Also fixed: `next.config.ts` now sets `agentRules: false`, because Next 16 was
regenerating `site/AGENTS.md` and `site/CLAUDE.md` on every dev run and
competing with this repo's single rulebook.

## 5b. Known inconsistency to clean up

The section agents were not consistent about default vs named exports —
`ClosingsSection` is default-only, `DoorsSection` / `ListingsSection` /
`SiteFooter` export both. Normalise to named exports in the cleanup pass.

## 6. Coordination issue to fix in one pass

The section agents ran concurrently with no shared index registry, so the
bracketed micro-label numbering (`[ 01 — TRACK RECORD ]`) is **not sequential**
across sections — some shipped unindexed rather than guess. One agent (or the
main loop) must assign the full sequence once every section exists. Ref 04
assigns a number only to `#closings`; decide the rest deliberately.

## 7. Rules that do not change

Read `AGENTS.md` and `docs/AGENT-BRIEF.md`. The load-bearing ones: HOKUTEN never
"Hakuten" · semantic tokens only, no hex in components · both themes must be
correct · calculator math frozen · compliance strings byte-exact ·
`FRED_API_KEY` server-side only · no public deploy until the KW / Forward
Wilshire paperwork gate clears · commits authored as rawzm with **no
Co-Authored-By or AI attribution trailers, ever**.
