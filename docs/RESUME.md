# RESUME — build handoff

> **2026-08-17: the launch run.** The site was retuned to Dino's Brand Design Guide v1.3 and loaded with his
> locked launch content, executing [docs/LAUNCH-IMPLEMENTATION.md](LAUNCH-IMPLEMENTATION.md) (`approved`,
> Razim, 2026-08-17). **The authoritative record of what was decided is the top of
> [PROJECT-MEMORY.md](../PROJECT-MEMORY.md) — read that first.** This file is the practical handoff: what
> state the tree is in, what is deliberately still open, and where the next session starts.
>
> The 2026-08-10 handoff that used to open this file is preserved below under "Historical — 2026-08-10".

## What changed in the launch run

Nine things, each with a dated supersession written where the old rule lived — nothing was deleted silently:

| # | Change | Supersedes |
|---|---|---|
| 1 | **Faces** — Cormorant Garamond (display) · Inter (body) · JetBrains Mono (data/labels), with the ramp re-tuned upward and looser, because Cormorant is smaller-x-height, narrower and lighter than what it replaced | the 2026-08-10 Fraunces / IBM Plex Mono decision, and the matching design-skill non-negotiable |
| 2 | **Palette** — `--accent #B08D3F`, `--accent-dim #C8A552`, paper `#FBF9F3`, ivory `#F4EFE3`, cream `#EDE7D8`, charcoal `#1A1C1F`, with every derived tone re-derived and re-measured to zero contrast FAILs | the `#B8902E` website-gold hard guardrail in `AGENTS.md` and skill ref 01 |
| 3 | **Theme G locked, Theme B parked** — parked in place: unreachable, un-retuned, not deleted | the 2026-08-07 two-variant comparison programme, for production |
| 4 | **Section order** — Dino's sequence: `#faq` and `#bov` move up, `#team`/`#doors`/`#mandates` move down behind them | the 2026-08-10 canonical order |
| 5 | **Content** — the 4 + 1 award split with the real Winner Badges; the `3×` stat tile removed; the locked `$200M+` hedge verbatim; the deals-scrub provenance line; three allowlisted listings; a six-seat roster with per-seat licence law | the previous stats/awards/listings/team content |
| 6 | **FAQ cut to two answered questions** — the five `[PLACEHOLDER:confirm]` answers are **deleted, not deferred**, and re-added verbatim when Dino answers | the "≥5 real diligence questions" anatomy rule |
| 7 | **Forms + feeds** — the browser-only Web3Forms path is retired for a server-side `POST /api/contact-intake` into monday.com; `/api/public-listings` is an additive same-origin proxy with a three-ID allowlist | the 2026-08-07 "Phase 1 is static, later phases integrate the API" decision |
| 8 | **Launch config** — Calendly wired, WhatsApp invite + verbatim disclosure in the footer, consent-aware measurement slots, `noindex` unchanged | — |
| 9 | **Repo hygiene** — brand masters restored and tracked; `full-brand-toolkit/` gitignored; build source assets copied into tracked `Ref/{awards,team,brand-kit,listings}/`; the CoStar email-signature derivatives deleted so they cannot be re-intaked | the `AGENTS.md` brand-master path |

**Three deviations from Dino's master directive are recorded, not hidden** — he reviews the production URL and
iterates: the site keeps its **paper-page / dark-hero chassis** rather than the all-dark system his directive names
for four routes (R1); the **nav bar stays dark** with the on-charcoal linear lockup rather than the white bar the
directive specifies (R14, legibility rationale); and **`#doors` carries the marketplace intent** rather than a
separate marketplace route (R16). A fourth is recorded at the placement level: all five CoStar assets stay
consolidated in `#stats` rather than moving to the team section (D16).

## Next session starts here

**1. The open items are in [PLACEHOLDERS.md](PLACEHOLDERS.md) §14** — 17 rows, and they are the real work list.
The ones that block anything are: monday.com credentials + column map (the intake ships dry-run until they arrive),
a100 endpoint access, the four measurement vendor IDs, and the three **cutover** gates. Everything else is a
verification or a decision.

**2. The cutover is the gate, not the push.** The build goes to the Vercel **production** deployment while it still
emits `noindex, nofollow`; that is how Dino reviews. Removing `noindex` — **both** mechanisms, `lib/seo.ts`
`INDEXING_ENABLED` *and* the hardcoded `robots` object in `app/layout.tsx` — plus the DNS change and the 301 wait on
the FBN filing, the broker approval email and the licence-number gates.

**3. Verify on the deployed build, not in the tree:** that the header's linear on-charcoal lockup actually reads at
its render height (row 65 — if the COMMERCIAL wordmark dies on the dark bar, fall back to the stacked mark), the
two-golds delta (row 66), and the panel-fit re-measure — **the type swap moved every headline's height, so the
2026-08-10 D28 numbers are stale by construction** (row 73).

**4. Do not re-litigate the supersessions.** Every one of them is dated and carries the rule it replaced, in
`AGENTS.md`, `.agents/skills/hokuten-design-director/SKILL.md`, skill refs 01/03/04/05/06/07 and
`docs/design/AUDIT_LOG.md`. If a rule looks wrong, add a new dated entry — never edit the old one out.

**Kickoff:** *"Read the top entry of PROJECT-MEMORY.md, then docs/PLACEHOLDERS.md §14, and take the next open row."*

**Last updated:** 2026-08-17, in the launch run's documentation portion.

## Verification constraint (standing, Razim)

No long-running dev servers, no prolonged local review. Allowed: `pnpm build`, `npx tsc --noEmit`, `npx vitest run`,
the QA greps, the asset scripts, and **one transient headless pass** for the overflow/fit/screenshot gates — then
`kill` the server. Razim reviews on the Vercel URLs. Horizontal overflow at 375 / 768 / 1440 / 1920 / 2560 is a
**hard release gate** (D29); the calculator's golden-parity suite is frozen and must stay green and untouched.

---

# Historical — 2026-08-10 handoff (kept for the record)

> **2026-08-10 (late): Design Revisits 2 AND 3 shipped in one push.** Revisit 2 had never been
> committed; it went out together with most of Revisit 3.

**State at that handoff:** build green · `tsc` clean · vitest 128/128 · **no horizontal scrollbar at
375 / 768 / 1440 / 1920 / 2560** (D29 gate passes) · scroll snap removed, scrolling is natural ·
Razim's three real hero triplets live in both themes · `main` and `theme-blue` at the same commit.

**Its "next session" list, and what happened to it:**

1. **D28 panel fit** — still open, now PLACEHOLDERS row 73, and explicitly not a launch gate. Measured at
   1440×900 (one screen = 784px): method 1234px (1.57) · listings 1179px (1.50) · calculator 1022px (1.30) ·
   closings 860px (1.10) · team 858px (1.09) · hero 806px (1.03); every other panel exactly 1.0.
   **Warning that still applies:** an earlier fit wave edited these same files and moved the measured heights by
   ZERO. Re-measure after any change; do not trust a claim that 400px was cut.
2. **"Docs are behind the code"** — **closed 2026-08-17.** Skill refs 03/04/05/07 no longer describe scroll snap as
   live, PLACEHOLDERS rows 51/52 are corrected, ref 06 carries the `costarpowerbrokers.com` verification note, and
   `AUDIT_LOG.md` is appended.
3. **Never verified that session** (dev servers were forbidden): screenshots, Core Web Vitals, the Theme B build, an
   ultrawide soak. Theme B is now parked, so its build is no longer something to verify.
4. **Flag** — the hero alt text names real Marriott signage, the first time a franchisor brand appears in hero
   imagery rather than as a chip. Still worth a business-side look with the counsel flag (PLACEHOLDERS row 35a).

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

## 7. Rules that do not change — **one line corrected 2026-08-17**

Read `AGENTS.md` and `docs/AGENT-BRIEF.md`. The load-bearing ones: HOKUTEN never
"Hakuten" · semantic tokens only, no hex in components · both themes must be
correct · calculator math frozen · compliance strings byte-exact ·
`FRED_API_KEY` server-side only · no public deploy until the KW / Forward
Wilshire paperwork gate clears · commits authored as rawzm with **no
Co-Authored-By or AI attribution trailers, ever**.

**Corrected 2026-08-17:** ~~"both themes must be correct"~~ — Theme B is **parked** (L1/R12). Only Theme G must be
correct; Theme B stays in the tree unreachable and deliberately un-retuned, so its values are not a target and
not current brand law. Everything else in this list stands unchanged. Add to it: **no Monday or other server
token in browser code**, and **no runtime path may begin with `Ref/`** (prep scripts read it at build time only).
