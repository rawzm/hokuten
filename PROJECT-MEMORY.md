# PROJECT MEMORY — The Hokuten Group Platform

> Living log of every decision, discussion, implementation, and change on the Hokuten platform.
> **Rule: every entry is dated. Newest entries at the top of each section. Never delete history — strike through and supersede.**
> Related docs: [BRAINSTORM.md](BRAINSTORM.md) · [docs/PHASE-1-IMPLEMENTATION.md](docs/PHASE-1-IMPLEMENTATION.md) · [CLAUDE.md](CLAUDE.md)

---

## 1. Project identity

| | |
|---|---|
| **Brand** | THE HOKUTEN GROUP ("Hokuten" = Northern Sky; nod to Final Fantasy's Order of the Northern Sky) |
| **Business** | Hotel / hospitality investment sales brokerage (CRE), nationwide coverage |
| **Tagline stack** | KW COMMERCIAL / THE HOKUTEN GROUP / HOSPITALITY INVESTMENT SALES / NATIONWIDE COVERAGE |
| **Domain** | thehokutengroup (GoDaddy, purchased 2026-08-06 by Dino; kwc-dinomonteverde.com will point to it) |
| **Team** | Dino Monteverde (lead broker), Razim (tech/marketing + buyer handling), William Betancourt (cooperating broker), Jae & Donna (assistants — calling/follow-up) |
| **Entity context** | Dino's LLC: Mitsukaido Holdings LLC. Hokuten name deploys after KW / Forward Wilshire papers it. |
| **Audience** | 40+ hotel buyers/sellers who live on Crexi, LoopNet, CoStar — familiar CRE patterns, elevated to a luxury brand feel |

⚠️ **Spelling**: the brand is **HOKUTEN** (per all logo assets, README, domain). The local folder `~/Documents/Hakuten` is a legacy typo — kept as-is to avoid breaking tooling; everything inside uses Hokuten.

## 2. Standing decisions

| Date | Decision | Why |
|---|---|---|
| 2026-08-07 | Brand spelling is **Hokuten**, not Hakuten | Matches all brand assets, README, and purchased domain (Razim confirmed) |
| 2026-08-07 | **Hokuten-first branding** on the site; KW Commercial as small compliance mark in footer/legal only | Name isn't fully papered yet; easy to swap affiliation; William wants own control |
| 2026-08-07 | Phase 1 listings/closed/content = **static, seeded from Dino's kwc site**. No CMS. Later phases integrate the **a100arms.com API** (where all deals/data live, already wired into the kwc site) + Monday CRM | Deals already live in Monday CRM + a100arms; don't build a parallel static content pipeline for dynamic data |
| 2026-08-06 | Stack: **Next.js on Vercel**; backend (if/when needed) decided at integration time | Razim's call; matches team's tech comfort and 60fps/perf goals |
| 2026-08-06 | Site must include: listings, recently closed, transactions, awards, hotel valuation calculator (port from kwc site), live treasury rates (FRED API) | Feature parity with kwc site, re-skinned to Hokuten luxury standard |
| 2026-08-06 | Design: simple, luxurious, interactive, enterprise-grade; **ASCII-art hero** of a tier-1 city hotel with brand name/symbol hidden in the characters | Razim's direction; inspiration set logged in BRAINSTORM.md |
| 2026-08-06 | Must feel familiar to Crexi/LoopNet/CoStar users (40+) while reading as a luxury brand | Core audience shops on those platforms |

## 3. Brand facts (from `The_Hokuten_Group_Brand_Addon_2/`, addon dated 2026-08-05)

- **Kit gold `#B8943D`** (lockups + covers) · **Website gold `#B8902E`** ← use this one on the web
- Backgrounds: white, ivory, charcoal variants
- Lockup type: Liberation Sans, tracked caps
- Lockups: Stacked + Linear, "THE HOKUTEN GROUP" centered beneath the KW Commercial mark
- Covers pattern: single center axis; THE HOKUTEN GROUP as only large lettering; small subtle sub-lines below a thin gold rule
- Assets: transparent PNG masters (2400w stacked / 3600w linear), SVG placement wrappers, LinkedIn/Facebook/Zoom covers

## 4. Log

### 2026-08-08 — `#hero` built in both theme chassis

New: `site/components/hero/heroContent.ts` (shared copy, one module for both chassis), `HeroCoverPanel.tsx` (Theme G dark cover panel), `HeroPlate.tsx` (Theme B Coronal plate chassis), `Hero.tsx` (the `themePresentation.heroChassis` switch — the only place either chassis is imported), `site/components/art/PlateChrome.tsx` (hairline frame + four registration marks + optional quiet mono caption, light-surfaces-only, extends `globals.css`'s two-corner `plate-frame` utility to all four corners as real DOM nodes). Spec: `docs/design/specs/hero.md`.

**Copy** (new, improved over the interim placeholder in `app/page.tsx`, which is untouched): headline "Every listing gets a number we can *defend*, not one we guess." (one italic word), sub carries the BOV promise WITH its condition ("A written BOV in 48 hours, on receipt of your T-12, STR, and PIP" — `verified-current`, ref 06). No stat digit ($200M+/12/836K+/3×) restated in the hero — `#stats` is the very next section and owns those numbers; duplicating one would be repetition, not proof. Primary CTA is `content/nav.ts`'s own `navCta` object (reused, not retyped), so the hero and the sticky nav can never say two different things for the same button.

**Seam-row/headline collision — resolved structurally, not by percentage math.** The task's hardest constraint (ref 04: the art's seam row — which resolves into THE HOKUTEN GROUP — must never collide with the headline at any viewport) is satisfied by construction: copy and art render as disjoint CSS-grid siblings (stacked, copy-then-art, below `lg`; two columns, copy left / art right, at `lg` and up) in BOTH chassis, never one overlaid on the other. There is no shared coordinate space for a collision to occur in, at 375/768/1440 or anywhere between — verified against the shipped `public/art/ascii-{gold,blue}.json` (`cols=160 rows=64 seamRow=46` = 71.9% down the grid, matching the brief's "72% height" exactly).

**Nav sentinel contract — implemented, not invented.** `docs/design/specs/nav.md` (already authored) and `site/components/sections/SiteNav.tsx` (already built) landed before this task and defined the contract themselves: `<section id="hero">` carries `data-nav-sentinel` (presence-only) + `data-surface={themePresentation.heroSurface === "surface-black" ? "dark" : "light"}`. Both chassis implement that verbatim expression; no second/competing contract was created.

**HeroPlate specifics**: the Coronal "white knockout plate" reuses the already-built `components/brand/Wordmark.tsx` in its `variant="lockup"` mode (its own doc comment names this exact use case) rather than hand-rolling a second wordmark renderer; the mono tag beneath it, "北天 — Northern sky," follows the same "北天 — &lt;gloss&gt;" convention the hanko SVG's own `<title>` already established (translation gloss, not a claim — no evidence-register row needed). The plate's quiet caption, "Study — Holiday Inn Express Brooklyn," names the real photograph the ASCII asset renders (`lib/ascii-types.ts`'s `ASCII_ART_DESCRIPTION`, `content/closings.ts`'s own `name` string for that property) rather than an invented label.

**Motion**: exactly two systems per screen (the brief's "nothing else animates except a single entrance reveal") — `AsciiCanvas`'s own shimmer + ambient loop, plus ONE non-staggered `<Reveal>` around the copy+art block. In practice the `Reveal` fires no animation on a normal load: its own documented logic only arms content that starts below the fold, and the hero is always first in the viewport, so the `h1` is visible in its final state immediately (server HTML + first client render identical). `HeroCoverPanel` deliberately omits `star-grain` — the ASCII canvas is already this screen's one texture; layering a second would read as a competing effect (ref 07 P1).

Verified against this piece's owned files only: `npx tsc --noEmit --incremental false` from `site/` — zero errors project-wide (not just in these files). QA greps (Hakuten spelling, kit-gold `B8943D`, raw hex/`rgb()`/Tailwind-default-palette colour, banned CTA words, emoji) all pass on the five new files. Not independently verified in a browser: exact pixel clearance between the scroll cue and the art's bottom edge at the 375px floor (flagged in `hero.md`'s file-header comments and mitigated with a `bottom-6`/`sm:bottom-8` responsive offset rather than a single fixed value); the value rail's spacing against `PlateChrome`'s right registration marks at 1280–1440px (both chassis use the identical rail-positioning code, so behavior is at least consistent between themes even if unverified in-browser).

### 2026-08-08 — `docs/PLACEHOLDERS.md` register built

New doc: [docs/PLACEHOLDERS.md](docs/PLACEHOLDERS.md) — the Phase 1 open-items register required by PHASE-1-EXECUTION §8.3/§11. 47 rows gathered from real evidence only (no invented work): every `PLACEHOLDER:counsel`/`PLACEHOLDER:a11y`/`PLACEHOLDER:compliance`/`PLACEHOLDER:confirm` marker under `site/app/privacy`, `site/app/sms-terms`, `site/app/accessibility`, and `site/content/faq.ts`; every `blocked:` constant (`CALENDLY_URL`, `SITE_DOMAIN`, `NEXT_PUBLIC_WEB3FORMS_KEY`, `INDEXING_ENABLED`, the SMS/TCPA compliance block); the `pending-verification` rows already logged in design-skill ref 06 (Sarhan-era "~$1B" narrative, Sarhan testimonials); the CA DRE team-name registration flag (§8.2, logged-and-held per Razim's approved posture) and the franchise-logo vector-licensing flag (`docs/design/LOGO-MANIFEST.md` §3); provisional team bios/titles and the missing listing photography (`content/listings.ts`); and two spec-level "needs ratification" clusters not previously centralized — the calculator's C1–C3 decisions + D3 ported defect (`docs/design/specs/calculator.md`) and the nine motion-recipe token-registration gaps + one accordion layout-property conflict (`docs/design/MOTION-RECIPES.md`).

Every row cites a real `path:line` anchor and an Owner (Razim · Dino · counsel · executor). A closing protocol is documented at the foot of the file: clear a row only after grep-confirming the marker is actually gone from the source, in the same change that strikes the row — this file is not itself a resolution mechanism, only a register.

Not resolved by this task, deliberately: no marker was edited, no decision was made on Razim's behalf, and the DRE team-name and Calendly-consent-suppression items were logged exactly as `blocked`/`pending-verification` rather than adjudicated, per the brief's "do not resolve it yourself" instruction on the DRE row.

### 2026-08-08 — `#faq` Diligence FAQ section built

`site/components/sections/FaqSection.tsx` (new) + `docs/design/specs/faq.md` (new). Server Component; renders the 7 questions already authored in `site/content/faq.ts` through the existing `ui/accordion.tsx` (built, not touched) inside two non-stagger `Reveal`s (header, accordion block — `faq.length` = 7 exceeds the 6-child stagger cap in ref 05, so per-row stagger was intentionally not used).

**Placeholder-marker rendering (binding requirement from the task brief).** `content/faq.ts` ships five `[PLACEHOLDER:confirm — …]` markers (NDA mechanics, a100 Arms vetting bar, QI coordination, fee/engagement terms, KW/Forward Wilshire paperwork gate). `FaqSection.tsx` parses each answer and renders every marker as a distinct, unmissable block — hairline border, `text-brick`, `AlertTriangle` icon, fixed mono caption "Placeholder — confirm before launch", `data-placeholder-confirm="true"` for a future pre-deploy grep — never hidden, stripped, or paraphrased. **None of these five may render as live public copy** (per `content/faq.ts`'s own header); this section makes that impossible to miss during review, but does not resolve them.

**Micro-label index decision.** Ref 04 (page anatomy) assigns a numbered micro-label device to `#closings` only (`[ 01 — TRACK RECORD ]`); `#brands`/`#mandates` ship unindexed. No number is assigned to `#faq`, and section-building is running as multiple concurrent agents with no shared index registry — so `#faq` ships **unindexed**, `[ DILIGENCE FAQ ]`, following the `#brands`/`#mandates` precedent rather than guessing a sequence position. Flagged in the spec for revisit once every section's index is assembled by one agent.

Verified against this section's owned files only: `tsc --noEmit --incremental false` from `site/` — zero errors in `FaqSection.tsx` (8 pre-existing errors elsewhere, in `lib/valuation.ts` and `scripts/ascii-gen.ts`, neither owned by this task). QA greps (spelling, kit-gold, Sarhan, secret-shaped strings, raw hex/rgb, Tailwind-default-palette colors, banned CTA words, emoji) all pass on `FaqSection.tsx`.

### 2026-08-08 — Phase 1 execution begins: M0 foundation, dual-theme deploy wiring, port pack

**Orchestration.** Executing [docs/PHASE-1-EXECUTION.md](docs/PHASE-1-EXECUTION.md) as parallel Workflow runs per Razim's max-concurrency instruction. W0 port pack (14 agents) complete; W1 design system, W2 art program, W3 content, W4 calculator, W5 data/forms/routes running concurrently.

**Stack pinned** (verified against `node_modules`, not memory): Next 16.3.0 · React 19.2.8 · Tailwind 4.3.3 · TS 5.9 strict · pnpm 11.9 · motion 13 · lenis 1.3 · vitest 3 (vitest 4 pulls vite 8, whose lightningcss resolution fails on this machine — pinned to 3 deliberately) · sharp 0.34 + tsx for build-time art/OG generation. Fonts via `next/font/google` (fetched at build, self-hosted output, zero runtime CDN requests): Fraunces variable opsz roman+italic = 2 files · Inter variable = 1 · IBM Plex Mono 400/500 = 2. Meets the ≤2-files-per-family gate.

**Dual-theme mechanism (decided, built).** `[data-theme="gold"|"blue"]` on `<html>` from `NEXT_PUBLIC_HOKUTEN_THEME` binds the semantic tokens; on top of that, five **surface scopes** (`.surface-paper / -deep / -card / -dark / -black`) rebind the text, accent and hairline roles for everything inside them. A component writes `text-fg` / `text-accent-text` / `border-hairline` once and is correct on every surface in both themes. This is what makes the semantic-token P0 gate enforceable by grep rather than by review.

**⚠️ Contrast decisions — three brand tones adjusted (measured, not chosen).** PHASE-1-EXECUTION §8.1 authorises "adjust tone, not the brand hex, where it fails at small sizes"; the measurements forced it. Full matrix + re-runnable script: [docs/design/CONTRAST.md](docs/design/CONTRAST.md); tokens recorded in design-skill ref 01 → "Accessible tones".
- Website gold `#B8902E` on `--paper` is **2.71:1** — it fails AA at every text size and even the 3:1 UI threshold. **Gold text on light was never shippable.** New `--accent-ink #816520` (same hue 42.6°, same saturation 0.600, darkened) = 5.01 paper / 4.54 surface-deep / 5.50 card. Gold on dark is unchanged and fine (5.99 on `--dark`, 7.07 on `--black`).
- Brand ivory-gray `--meta #8B8680` is **3.29:1** on paper and fails as text → `--meta` is now `#6E6862` (5.01:1); `#8B8680` survives as `--meta-soft`, **decorative only, never text**.
- Ref 03's "paper at 40%" for on-dark meta text is **3.59:1** and fails → on-dark secondary/tertiary are `color-mix(paper 64% / 52%, dark)` (7.2:1 / 5.2:1, both themes).
- Theme B needs opposite polarities from Theme G in two places: `#2F4FA3` on indigo is 2.34:1 so on-dark accent text is `--accent-dim #7E96D0` (6.05:1); and `--on-accent` is ink in gold but cool-paper in blue (black on blue is 2.77:1).

**Vercel ops** (`vercel whoami` = `razim-kw`, everything scoped `hokuten1`/`hokuten`, no CLI deploys):
- Root Directory set to `site`, framework `nextjs`.
- `NEXT_PUBLIC_HOKUTEN_THEME=gold` on Production + Preview + Development; `=blue` branch-scoped to `theme-blue` (Preview). Registered via the REST API — the CLI's `env add … preview` git-branch prompt bug from 2026-08-07 is still present.
- Branch `theme-blue` created and pushed with **zero code diff** from `main`, as specified. Both URLs now auto-deploy.
- Preview deployments are Vercel-SSO protected (`all_except_custom_domains`) — consistent with internal-only status until the paperwork gate clears.
- `site/.env.example` written (names only, no values); `site/.env.local` pulled and gitignored.

**Port pack** — [docs/port/](docs/port/) 01-calculator · 02-compliance · 03-deals · 04-copy · 05-forms-and-ticker · 06-legal-pages · 07-mandates. Verbatim extracts from the kwc source, each written by one agent then attacked by an independent verifier that re-read the source. Defects the verification caught (a sample of why the second pass was worth it):
- **P0**: a shipped calculator disclaimer (`index.html:1047`, "broad national reference for this type, not your local comp set") had been missed entirely — the extract quoted only an internal code comment. It would have shipped with no on-screen scope disclaimer on the benchmark bars.
- **P1**: the extract's `AdviceContext.brand` type was `"branded" | "independent"`, but the source sets `"indep"` — building to the published contract would have made the independent-hotel ADVICE rule permanently false and silently dropped its CTA branch.
- **P1**: the source suppresses Calendly's own consent prompt (`hide_gdpr_banner=1`, `index.html:1922`) — the extract had claimed zero consent-related code. That is now flagged for the privacy review.
- Plus wrong line citations, a miscounted adjuster enumeration, and three golden cases documented against the wrong economics base.
- ⚠️ The kwc source has a live Web3Forms access key at `index.html:1169`. It is **not** reproduced anywhere in this repo, and per the standing guardrail Hokuten needs its own key regardless.

**Calculator posture**: math, defaults, bands, adjusters, rounding and the ADVICE engine are a frozen port. Golden tests are being derived **from the source by hand**, not from the port — so they cross-check parity rather than restating the implementation.

### 2026-08-07 — FRED key provisioned + executor entry point clarified (night)
- FRED_API_KEY set on the `hokuten` Vercel project (Production/Preview/Development) — retrieved from Dino's project via his agent; same key shared with kwc + a100arms. Value lives in Vercel env only, never in repo/docs. Known gotcha (from kwc): dashboard env changes take effect only on next deploy. Workspace root `vercel link`ed to `hokuten1/hokuten` (.vercel gitignored). Note: `vercel env add ... preview` non-interactive mode loops on a git-branch prompt bug — worked around via the REST API (`POST /v10/projects/:id/env`, target preview).
- **Executor entry point: `docs/PHASE-1-EXECUTION.md` is THE brief OPUS-5 implements.** PHASE-1-IMPLEMENTATION.md stays authoritative for milestones/contracts and is inherited through the brief's read order — never handed to the executor alone.

### 2026-08-07 — Hokuten Blue dual-theme program + Vercel ops (evening)
- **Dual-theme decision (Razim):** ship TWO complete color keys as two live URLs for team comparison — Theme G "Kit Gold" (existing palette, dark heritage hero, `main`/production) and Theme B "**Hokuten Blue**" (northern-sky blue, light Coronal plate-chassis hero, branch `theme-blue` with zero code diff via branch-scoped `NEXT_PUBLIC_HOKUTEN_THEME=blue`). Components consume semantic `--accent*` tokens only; blue rebuilds of wordmark/hanko/OG (KW kit rasters never recolored; KW footer mark keeps original colors in both themes). Blue ramp anchors + program: skill ref 01; Coronal video digested into skill ref 02; ambient morph loop ("ASCII as gif") specced in skill ref 05.
- Source of the blue direction: `Ref/Praveen_Kumar_-_New_Health_Tech_Branding_Exploration_tZBENZ.mp4` (Coronal — morphing indigo dot-matrix art, plate chassis with registration marks, white data card). Razim: "I love it, we need something like this integrated."
- **Vercel verified:** team `Hokuten` (`hokuten1`), project `hokuten` → hokuten.vercel.app, GitHub-linked auto-deploy; CLI authed locally as `razim-kw`. CLI now allowed for link/env/branch config under `--scope hokuten1` only (whoami check first; other teams off-limits) — AGENTS.md guardrail updated. Razim enabled Analytics + Speed Insights on the dashboard; code-side install added to M0.
- **FRED key:** confirmed NOT retrievable from this machine (lives in Dino's Vercel team `dino-kwc`, different org; no local .env anywhere). Open item: Razim pastes it → `site/.env.local` + `vercel env add` (prod+preview). Ticker degrades to dashes meanwhile.
- **DRE team-name posture (Razim):** use the fictitious name as-is for now — site is internal-only to the three of them, not marketed; registration stays in the pre-marketing gate.

### 2026-08-07 — OPUS-5 execution brief authored + three design decisions locked
- **New doc: [docs/PHASE-1-EXECUTION.md](docs/PHASE-1-EXECUTION.md)** — the self-contained handoff brief for the implementing agent (OPUS-5): design thesis (heritage × trading-desk × hospitality), full typography program (weights/italic/slim/tracked-caps usage matrix), signature-art program (ASCII pipeline, hanko, engraved line-art, franchise logos), 13-section build notes, compliance pack (WCAG 2.1 AA per the ADA.gov rule + CA Unruh exposure; CA DRE §10140.6 + team-name registration flag; CalOPPA/CCPA placeholders; trademark rules), reference-DNA map (filmfully/SPR/Hustl/kwc/a100arms), 6-workflow orchestration playbook with max-concurrency mandate, demo script, out-of-scope list.
- Razim's decisions (Q&A): `#brands` franchise-logo marquee (grayscale, floating, economy→upper-upscale flags, trademark microcopy) · 北天 hanko + Japanese accents ship FULL-STRENGTH as final ("push it like it's final") · condensed `#mandates` dark section on the landing (full marketplace stays Phase 3). Anatomy is now 13 sections; menu overlay is 8 items.
- ⚠️ Compliance flag raised: "The Hokuten Group" contains no licensee surname — likely needs CA DRE team-name/fictitious-name registration via Forward Wilshire; folded into the existing launch-paperwork gate.
- Research digested: **filmfully** (`~/Documents/Salman-ind/filmfully` — Tailwind v4 `@theme` token-sheet, motion governance, transitions.dev vendored skill to re-vendor here) · **SPR prototype** (data-dense two-tier type, STATUS_PRESENTATION single-record pattern, 60fps SVG hygiene, agent-briefing format adopted for the exec brief) · **a100arms codebase** (`/Users/razim/D/DePaul/SHG/A100arms/website/` — leak-proof allowlist feed, Phase 2 recipe = clone 2 files + change team-filter constant + CORS allowlist, photo-sync is Dino-scoped at `listingPhotoSync.ts:123`; shared vocabulary adopted: "Price on Request", `"N.NN% Cap"`, band buckets, stage names).
- Privacy/terms decision: port kwc `privacy.html`/`sms-terms.html` verbatim as placeholders with `PLACEHOLDER:counsel` markers + a `docs/PLACEHOLDERS.md` register; add `/accessibility` statement page. Permitted legal-string substitutions: currently NONE (everything byte-exact until Razim lists exceptions).
- **Exec-brief adversarial verification** (2 agents): 18 findings fixed — M2/M1/§5 now carry `#brands` + `#mandates` (+ `Mandate` type + mandate claims added to the verified register); card hover aligned to ref 05 (no spring/translate); breakpoint floor corrected to 375 (iPhone SE); "Price on Request" casing unified to the feed's exact string everywhere; hanko stamp placements fixed at exactly three (footer press-in, `#method` label, OG corner) + favicon; badge anatomy unified (hairline pill, no glow dots); franchise-logo sourcing hardened (PD-textlogo preference, per-logo license manifest, flag non-free marks to counsel); Monday column ID scrubbed from this repo; a100arms Phase 2 work explicitly homed in the a100 repo (read-only here); fonts pinned to variable files (≤2/family); demo prerequisites (FRED + Web3Forms keys) called out for kickoff.

### 2026-08-07 — a100arms.com live-site study digested
- Live design study of a100arms.com (marketing page + app bundles + public feed) appended to design-skill reference 02 under Own properties. Key facts: app is VS Code Dark+ themed (JetBrains Mono body, #569cd6 accent) — deliberately NOT ported; borrow only stage-badge semantics, locked-state anatomy, and discretion copy voice. Feed check 2026-08-07: 9 properties (5 Listed / 4 Off Market), apiVersion 3.5, still no `photoUrl` (photo-sync spec unbuilt); new leak-class field `rawMondayData` on Listed rows — Hokuten renderer must treat it like `a100_DealSnapshot` (never read). Hokuten references a100 only as the confidential "Private Access" channel.

### 2026-08-07 — Repo live + bios decision (later same day)
- Razim: GoDaddy has MFA — password-rotation open item closed (still: never store credentials in repo files).
- Razim created `https://github.com/rawzm/hokuten.git` and opened a Vercel project. Workspace pushed to `main` (repo-local git identity set to `rawzm <mohamedrazim@gmail.com>` — the global "Razim Sarhan" identity deliberately not used on Hokuten commits).
- Bios decision: ship provisional generic bios now — Dino's verbatim from kwc source, Razim/William in the same format with zero unverified claims (set lives in design-skill reference 06); real bios replace them later via the evidence gate. Titles for Razim/William marked `provisional` pending internal confirmation.
- Standing rule reaffirmed: all ported content/copy/data comes directly from the kwc source code at `~/Documents/Dino` (read-only), not from summaries.
- Team is discussing design internally off this pushed snapshot.

### 2026-08-07 — Kickoff research + full docs/rules system authored
- Razim confirmed via Q&A: Hokuten spelling · Hokuten-first branding · Phase 1 static content from kwc site, a100arms API + Monday CRM integration deferred to a later phase.
- **Research sweep completed** (8 agents): both existing sites inventoried; 6 inspiration sites + 14 Ref images digested; brand assets decoded (exact hexes, defective linear-on-charcoal lockup flagged); Hustl/razim-co/expo skill conventions extracted; rawzm GitHub stars cataloged (16); kwc codebase deep-dived (calculator `CONFIG` quoted, FRED proxy, a100arms feed contract, full seed-content inventory). Digests live in design-skill references 02 and 06.
- **Design direction locked**: "heritage through a digital sieve" — ASCII/dither hotel art on clean warm-paper chrome; paper/ink/gold palette anchored to brand + kwc tokens; type = Fraunces / Inter / IBM Plex Mono; motion = weight-not-spectacle (inspiration synthesis: zero WebGL across all six award sites).
- **Locked stack**: Next.js App Router + TS + Tailwind v4 + motion/react + Lenis (desktop only) + shadcn/ui restyled, app in `site/`, Vercel, SSG + one API route. Hero default subject: NYC (Brooklyn closing / Manhattan), swappable-art chassis.
- **Authored**: [AGENTS.md](AGENTS.md) (CLAUDE.md symlinks to it) · `.agents/skills/hokuten-design-director/` (SKILL.md + references 01-brand / 02-reference-digest / 03-visual-system / 04-page-anatomy / 05-motion / 06-content-and-proof / 07-audit; `.claude/skills` + `.cursor/skills` symlink to `.agents/skills`) · `.cursor/rules/` (hokuten-project · hokuten-design · development-workflow) · [docs/PHASE-1-IMPLEMENTATION.md](docs/PHASE-1-IMPLEMENTATION.md) (M0–M7) · [BRAINSTORM.md](BRAINSTORM.md).
- Key port facts recorded: calculator is a frozen-config pure-function port; FRED proxy maps 1:1 to a route handler (`FRED_API_KEY` env); a100arms public feed needs a Hokuten-scoped variant in Phase 2 (current one is Dino-scoped); compliance blocks port byte-exact.
- **Adversarial verification pass run** (4 agents: links/structure, cross-file consistency, factual fidelity vs kwc source, hygiene): all links/symlinks/frontmatter clean, no secrets leaked, calculator/ticker/closings facts match source. 18 findings fixed, notably: compliance disclosure corrected to the byte-exact two-sentence source text (canonical copy lives in design-skill reference 06 only), `#method` added to M2 build order, QA grep script logic repaired (scope, pass/fail output, secrets + post-build bundle checks), menu overlay items mapped to real anchors, INP gate restated everywhere, `verified-dated` ship rule defined.
- ⚠️ Security note: `chat-context.md` contains a plaintext GoDaddy credential — rotate it; never commit that file to git (gitignored when repo is initialized).

### 2026-08-06
- Kickoff (Razim): defined scope — simple luxurious landing page, Next.js/Vercel, feature parity with kwc site (listings, closed, transactions, awards, valuation calculator, FRED treasury rates), ASCII hero concept, 60fps web+mobile, project docs + rules under one hood.
- From team chat: Dino bought the thehokutengroup domain; name represents everyone, not one person ("Northern Sky"); kwc-dinomonteverde.com will redirect; team bios requested; kwc site needs Sarhan Hotel Group scrubbed (Dino's site — out of scope for this workspace; his repo is read-only here).
- Context: team (Razim, Dino, William + Jae, Donna) leaving Sarhan Hotel Group after 2+ years; automation-first operating model; KW accounts remain (Dino, Donna, Jae).

### 2026-08-05
- Brand addon package created (`The_Hokuten_Group_Brand_Addon_2/`): logo lockups + social covers, palette, type conventions.

## 5. Open items

- [ ] Real team bios replace the provisional generic set (skill ref 06); confirm Razim/William titles internally
- [ ] KW / Forward Wilshire paperwork status → gate for public launch under Hokuten name (previews stay password-protected)
- [x] ~~FRED API key~~ provisioned 2026-08-07 — set in the `hokuten` Vercel project (Production + Preview + Development) via CLI/API; same key the kwc site and a100arms share; local dev pulls via `vercel env pull site/.env.local`. Gotcha: env changes require a redeploy to take effect
- [ ] Provision: new Web3Forms access key + team Calendly URL (`blocked: calendly-url`)
- [ ] Vercel: set Root Directory = `site` in project settings once M0 scaffolds (dashboard or CLI)
- [ ] Team review: compare the two theme URLs (gold vs Hokuten Blue) once live → pick the flagship or keep both
- [ ] Confirm exact live domain (thehokutengroup.com assumed) + Vercel DNS on Dino's GoDaddy
- [ ] Phase 2: Hokuten-scoped a100arms public feed (Razim owns backend; mirror kwc-listings allowlist + photo-sync spec)
- [ ] Monday CRM: decide what (if anything) syncs to the site vs. stays internal
- [ ] Sarhan-era "~$1B" narrative + testimonials: Dino sign-off + permissions before use (`pending-verification`)
- [ ] 北天 hanko seal mark: build candidate, get Razim approval (`exploring`)
- [ ] ~~Rotate the GoDaddy password shared in chat~~ closed 2026-08-07 — account has MFA
- [ ] Optional: rename `~/Documents/Hakuten` folder → Hokuten someday (breaks open sessions; low priority)
