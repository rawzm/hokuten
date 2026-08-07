# PHASE 1 — EXECUTION BRIEF

**Addressed to: the implementing agent (OPUS-5).** This brief is self-contained but NOT standalone — the repo's rule system is law. You build the complete Phase 1 landing experience for THE HOKUTEN GROUP: a luxury, enterprise-grade, hospitality-focused investment-sales platform.
**Status:** `approved` (Razim, 2026-08-07) · **Companions:** [PHASE-1-IMPLEMENTATION.md](PHASE-1-IMPLEMENTATION.md) (milestones/contracts — still authoritative) · design skill `.agents/skills/hokuten-design-director/` (all design law) · [PROJECT-MEMORY.md](../PROJECT-MEMORY.md) · [AGENTS.md](../AGENTS.md)

---

## 0. How you work (orchestration mandate)

- Run this as **multiple Workflow-tool orchestrations with as many concurrent agents as the machine allows** — Razim's explicit instruction. Do not build serially. The playbook in §10 names the workflows; compose more if useful.
- Read order before ANY work: `AGENTS.md` → `PROJECT-MEMORY.md` → `hokuten-design-director/SKILL.md` (+ the references its verbs load) → `PHASE-1-IMPLEMENTATION.md` → this brief.
- Every section ships through the skill's pipeline: `spec` → build → `audit` (P0 = fail). Append audits to `docs/design/AUDIT_LOG.md`.
- After each milestone: dated entry in `PROJECT-MEMORY.md`, commit to `main` (author rawzm, **no Co-Authored-By/AI trailers — hard rule**), push.
- Verify framework APIs against `node_modules` docs (Next 16 / Tailwind v4 / React 19 are not your training data). Ask Razim only for things no agent can resolve (accounts, approvals).

## 1. Recon already completed — do NOT redo

Trust these; re-verification wastes budget. Sources are on disk.

| Fact | Value / location |
|---|---|
| Port source (all content, copy, math, compliance text, photos) | `~/Documents/Dino/dino-sites/kwc-dinomonteverde/` — READ-ONLY |
| Calculator logic | `index.html` ~line 1350: `CONFIG`/`TYPICAL`/`OCC_BAND`/`ADR_BAND`/`REVPAR_BAND`/`ADVICE` + `calculate()`; frozen port, spec in PHASE-1-IMPLEMENTATION §6 |
| FRED proxy | `api/ticker-data.js`: DGS10/SOFR/DPRIME/DFEDTARU/DFEDTARL, env `FRED_API_KEY`, `s-maxage=3600, stale-while-revalidate=86400`, always-200 degradable |
| Closings/listings/stats/methodology seed data | Skill ref 06 + PHASE-1-IMPLEMENTATION §5 (verified against source 2026-08-07) |
| Compliance verbatim blocks | Skill ref 06 (two-sentence brokerage disclosure; TCPA block; calculator disclaimer) — byte-exact, never paraphrase |
| Brand palette/lockups | Skill ref 01. Website gold `#B8902E`. Linear-lockup-on-charcoal is defective — never use |
| a100arms | Public feed contract + live-design digest in skill ref 02 ("Own properties"); feed integration is **Phase 2 — do not build**; reference a100 only as the "PRIVATE ACCESS" channel |
| Privacy/terms source | `privacy.html` + `sms-terms.html` in the kwc repo — port as placeholders (§8.3) |
| Repo/hosting | `github.com/rawzm/hokuten` main; Vercel project exists (Razim's); Root Directory = `site`; previews password-protected until launch gate clears |

## 2. Design thesis — the blend

Three registers, deliberately combined. Every screen must read all three:

1. **HOKUTEN heritage** (the soul): 北天 "northern sky." ASCII/dither art of real hotels, hanko seal, star-grain dark panels, serif display voice. Classical subject, digital sieve.
2. **Enterprise investment platform** (the spine): mono tabular data, cap rates, LP/SP ratios, live treasury ticker, staged-disclosure badges, numbered index everywhere (`[ 01 — TRACK RECORD ]`). A Crexi/CoStar user must feel *at home*, just upgraded.
3. **Hospitality warmth** (the skin): warm paper canvas, ivory hairlines, real hotel photography (B&W→color), franchise-flag familiarity, generous whitespace, unhurried motion.

Rule of thumb per viewport: one heritage art object + one data proof + warm chrome. If a screen has zero mono data, it's drifting to brochure; if it has zero warmth, it's drifting to terminal.

## 3. Typography program (Razim: "very important")

Three faces, self-hosted via `next/font`, defined in Tailwind v4 `@theme` (filmfully convention — tokens in `globals.css`, no tailwind.config):

| Face | Weights/styles loaded | Voice |
|---|---|---|
| **Fraunces** (variable, opsz — one roman + one italic file) | Light 300, Regular 400, **Italic 300/400** | Display. High-contrast serif, tight leading (1.02–1.1) |
| **Inter** (variable — one file, weights via axis) | 400, 500, 600 | UI/body. Never bolder than 600 |
| **IBM Plex Mono** | 400, 500 (two files max) | Data + micro-labels. Always `tabular-nums` |

**Styling hierarchy — use the full palette of weight/style/size, deliberately:**
- *Slim*: Fraunces Light 300 is the default display weight — luxury reads light, not bold. Stat numerals: Light 300, negative tracking (−0.02em) at large sizes (SPR pattern).
- *Italic*: exactly **one italic accent word per headline** (Horizonte/R&P device) — Fraunces Italic, same size/weight as its line. Never italicize UI or data.
- *Bold*: Inter 600 for CTAs, nav-active, form labels; Fraunces 400 (never 600+) when a display line needs a firmer step. Mono 500 for emphasized data values.
- *Tracked caps*: two flavors — brand line (Inter caps, `tracking-[0.35em]`, gold) and micro-labels (mono caps, `tracking-[0.14em]`, bracketed index `[ 01 — … ]`).
- *Two-tone emphasis* (Moltgage ref): within dark-section paragraphs, key phrases `--paper`, rest `--paper`/64 — weight stays constant, color carries emphasis.
- Ramp + per-section size discipline (2–4 sizes) is in skill ref 03 — it is a P1 gate. Mobile sizes are specified there; body never below 16px (P0).

## 4. Signature art program

### 4.1 ASCII hero (the site's one signature effect)
Build `site/scripts/ascii-gen.ts` (build-time, never client-computed):
1. Input: B&W hotel photograph (default: NYC — the Brooklyn closing photo `slide9_brooklyn.jpg` from the kwc repo, or a licensed Manhattan skyline; chassis must accept swappable art).
2. Luminance-map to the brand charset ramp (dark→light): `HOKUTEN` letters + `北天ホクテン` + digits + `・.:-=+*#` (skill ref 05 has the full spec).
3. Emit: (a) glyph-grid JSON for the canvas, (b) a pre-rendered static PNG/SVG frame (mobile/reduced-motion/noscript fallback), (c) a **seam row** where characters resolve legibly into `THE HOKUTEN GROUP` in the art's lower third.
4. Canvas component: single `<canvas>`, DPR≤2, drawn once; pointer-proximity gold shimmer (120px radius, 400ms decay); rAF only while hovered AND in-viewport; dirty-rect redraws; ≤4ms/frame; 12ms×30-frame kill switch → freeze static. `aria-hidden` + adjacent visually-hidden description.
Colors: gold `--gold` + ivory characters on `--black` panel. This effect owns the hero — nothing else animates on that screen except the reveal.

### 4.2 Hanko seal — ship FINAL, not subtle (Razim 2026-08-07: "push it like it's final")
Design a gold square seal-stamp: 北天 in seal-script-style strokes inside a worn square border (authentic hanko texture — slightly imperfect edge, not a sterile rounded-rect). Deliver: favicon set (ico/svg/apple-touch), OG-image corner stamp, footer seal (~48px beside the wordmark), section stamps where 04-anatomy places them, and a subtle press-in animation on first footer reveal (scale 1.06→1, opacity, `DUR.base`). Full strength everywhere the anatomy names it; the team reworks post-review if needed.

### 4.3 Supporting art
- `#method` dark chapter: white engraved line-art of a hotel facade (Golden-Gate-wireframe ref translated) — generate or hand-trace an owned photo into single-stroke SVG; star-grain + hairline orbital arcs behind (≤8% opacity). Clarification: the anti-slop ban on AI-generated imagery applies to *photography*; commissioned/generated line-art illustration is permitted.
- Photography: only track-record hotels from the kwc repo; grayscale at rest → color on hover/tap.
- Franchise logos (`#brands`): prefer public-domain simple-text-logo vectors (Wikimedia "PD-textlogo" category); record source + license per logo in an asset manifest and `docs/PLACEHOLDERS.md`; usage is nominative/referential only (grayscale, uniform optical height, `--meta` tone, ref-06 disclaimer, never adjacent to the Hokuten lockup). If a mark is only available under press-kit/non-free terms, flag it for Razim/counsel instead of shipping it. Target set: Wyndham, Choice, Best Western, IHG, Radisson, Sonesta, Hilton, Marriott, Hyatt (+ "& independents" text mark). Marquee spec in 04-anatomy `#brands`.

## 5. Page build — 13 sections

Authoritative anatomy: skill ref 04 (hero → stats → brands → closings → listings → calculator → method → doors → mandates → team → faq → bov → footer+ticker). Per-section specs get written with the skill's `spec` verb into `docs/design/specs/` before building. Non-obvious build notes:

- **Nav**: paper + `backdrop-blur` after 24px scroll; dark variant over hero (detect via sentinel, not scroll math). Menu overlay = 8-item numbered serif index (anchors mapped in ref 04), focus-trapped, Esc closes, body scroll locked.
- **`#stats`**: server-render final values (JS-off must show real numbers — Sarhan's "$0 B+" is the anti-pattern); count-up enhancement from 60% of value, once, `useInView`.
- **`#closings` / `#listings` cards**: fixed-height metadata slots so tiles never reflow (filmfully pattern); hover per skill ref 05 — photo grayscale→color (`filter`) + scale ≤1.02 at `DUR.base`/`EASE.out`, ring shifts to hairline gold at 40%; never translate cards, no spring/bounce.
- **`#calculator`**: the wizard is the most complex UI — build it as controlled React over the frozen `lib/valuation.ts`; keep kwc's ⓘ popovers, live RevPAR preview, typical-figures autofill, benchmark bars, insights (top-2 by priority), email capture, Calendly prefill. Restyle only.
- **`#mandates`**: dark; 3–4 mandate cards from verified kwc marketplace content; `PRIVATE ACCESS →` ghost CTA → a100arms.com/signup; discretion copy line.
- **`#bov` form**: port field-for-field (city picker lazy-loads `us-cities.min.json` on first focus; intl-tel E.164; honeypot; TCPA block + ISO consent timestamp; new Web3Forms key from env). Inline success, never navigate.
- **Ticker**: height-reserved fixed bar (zero CLS), CSS marquee 45s, pause on hover/focus, static under reduced-motion, dashes on API failure.
- **Consent modal**: bottom-center bar; outside click ⇒ 300ms shake + `navigator.vibrate(50)` — never closes; explicit buttons only (Razim's filename spec).
- Route-level `PageTransition` via `app/template.tsx` (filmfully governance): opacity fade + small rise at `DUR.base`/`EASE.out` — token values only; if the transitions.dev vendoring adds a distance token, register it in skill ref 05's table first. Two easings total sitewide.

## 6. Interaction & mobile

Full inventory and rules: skill refs 04 (mobile rules) + 05 (motion). Non-negotiables restated: transform/opacity only; reveals fire once; ≤2 easings; every animated component gated by `useReducedMotion()` AND the global CSS kill-switch; no hover-only information (touch uses `tapped` toggle); 44px targets; Lenis desktop-pointer only; 60fps under 4× CPU throttle.
Breakpoints: **375 floor (iPhone SE — a mandated QA viewport)**, 640, 768, 1024, 1280, 1440+. Mobile hero = static ASCII frame full-bleed with centered stack (Aurelian mobile ref); marquees thinner; menu = circular hamburger → numbered overlay.

## 7. Data & engineering

Contracts, seed rows, ticker spec, calculator port + golden vitest cases: PHASE-1-IMPLEMENTATION §5–§7 — unchanged, follow exactly. Structure: `site/` app (App Router, TS strict, pnpm), `content/*.ts` typed modules, `lib/valuation.ts` frozen config + pure functions, `lib/motion.ts` tokens, `app/api/ticker-data/route.ts`. SEO: per-page metadata, OG image via cover recipe (black panel, gold rule, stacked hierarchy, hanko corner stamp), JSON-LD `RealEstateAgent` + `Person` per broker, sitemap, robots. Analytics: Vercel Analytics + Speed Insights. Env vars (Vercel dashboard, never committed): `FRED_API_KEY`, `NEXT_PUBLIC_WEB3FORMS_KEY` (public-class), Calendly URL constant `blocked: calendly-url` with `#bov` fallback wired.

## 8. Compliance pack (Larchmont, CA sponsoring brokerage — all four bind)

### 8.1 Accessibility — WCAG 2.1 AA, treated as law
Razim's cited standard: DOJ's ADA rule on web accessibility (ada.gov fact sheet, April 2024 final rule) mandates **WCAG 2.1 Level AA**. That rule formally binds Title II entities, but we adopt it as our binding standard because (a) Title III readiness, and (b) **California Unruh Act** incorporates ADA violations with statutory damages per visit — CA is among the highest web-accessibility-litigation states (and the highest for state-court Unruh web claims), and our sponsor sits in Larchmont. Concretely, beyond the gates in skill ref 07:
- Semantic landmarks (`header/nav/main/section[aria-labelledby]/footer`), one `h1`, skip-to-content link first in DOM.
- Focus: visible 2px gold ring everywhere; menu overlay + consent modal focus-trapped with correct restore; anchor nav moves focus to the target heading.
- Contrast ≥4.5:1 all text (verify gold-on-dark and `--meta`-on-paper specifically; adjust tone, not the brand hex, where it fails at small sizes).
- Hero video (if used): no audio, `muted playsinline`, pause control; ASCII canvas `aria-hidden` with text alternative.
- Forms: visible labels, `aria-describedby` errors in `--brick` + icon (not color alone), `autocomplete` attributes, error summary focus on submit failure.
- Marquees (`#brands`, ticker): pause on hover AND focus, static under reduced-motion, `aria-label`ed containers, content not conveyed by motion alone.
- Add `/accessibility` statement page (placeholder template, §8.3) linked in footer.
- Test: axe-core clean on every route; full keyboard pass; VoiceOver spot-check on hero/calculator/form; Lighthouse a11y ≥95 is a P0 gate.

### 8.2 CA DRE advertising (B&P §10140.6, §10159.5–7)
- Every page: the byte-exact two-sentence disclosure (skill ref 06). Dino's name never appears in a broker capacity without his DRE # nearby (team card includes it).
- ⚠️ **Team-name flag (surface to Razim, do not resolve yourself):** CA team names must generally include the surname of a licensed team member; "The Hokuten Group" contains none, so it likely requires DRE fictitious-business-name/team-name registration through the responsible broker (Forward Wilshire). This is part of the existing "KW/Forward Wilshire papers the name" launch gate in PROJECT-MEMORY — the site stays password-protected until cleared. Note it in PLACEHOLDERS.md.
- No performance guarantees, no unlicensed-activity language (Razim's card avoids brokerage verbs — "Buyer Relations & Platform Technology").

### 8.3 Privacy & terms — port kwc as placeholders
- Port `privacy.html` → `/privacy` and `sms-terms.html` → `/sms-terms` from the kwc repo **verbatim**. Permitted substitutions: currently **NONE** — keep all legal-entity strings (Forward Wilshire dba KW Larchmont, DRE #s, the registered 10DLC brand string) byte-exact; only strings Razim explicitly lists later may change. Wrap every section needing counsel/enrichment in a visible-in-code marker: `{/* PLACEHOLDER:counsel — <what's needed> */}`.
- CalOPPA (binds any commercial site collecting CA residents' PII — we do, via forms): conspicuous Privacy Policy link in footer; policy lists PII categories collected, third parties (Web3Forms, Calendly, Vercel Analytics, FRED passthrough-none), update process + effective date, and a Do-Not-Track / GPC disclosure line (placeholder text OK, marker required).
- CCPA/CPRA: thresholds likely not met — include a short "California Privacy Rights" placeholder section anyway with the marker, so counsel enriches rather than retrofits.
- Consent modal (already specced) + TCPA/10DLC block byte-exact; registered 10DLC brand string stays identical until a Hokuten brand is registered.
- Maintain `docs/PLACEHOLDERS.md`: a register of every `PLACEHOLDER:` marker — file, line-anchor, what's needed, owner. DoD requires it complete and current.

### 8.4 Trademarks
`#brands` rules in skill refs 01 + 06: grayscale, uniform, "flags we transact across" framing, disclaimer microcopy, never "partners/clients", never adjacent to the Hokuten lockup.

## 9. Reference DNA (use these codebases, they are on disk)

- **filmfully** (`~/Documents/Salman-ind/filmfully`): Tailwind v4 `@theme` token-sheet pattern; motion governance (route-level PageTransition, two easings, `useReducedMotion()` in every animated component); fixed-height card slots; `.rail-mask` edge fades; vendored `transitions.dev` skill + `skills-lock.json` — **vendor the same skill into this repo** and map our DUR/EASE onto its token scale.
- **SPR prototype** (`~/Documents/SPR/prototype`): data-dense hierarchy (two-tier type: tiny tracked caps labels over large tabular numerals with negative tracking); single presentation-token record per status enum (build `STATUS_PRESENTATION` for listing badges); 60fps interactive-graphic hygiene (memoized shapes, ref-written readouts, data-attribute CSS states) — apply to the ASCII canvas; 1px-borders-over-shadows.
- **Hustl** (`~/Documents/Hustl`): the audit/gate discipline this repo's skill already clones — follow it, don't re-derive.
- **kwc** (`~/Documents/Dino/dino-sites/kwc-dinomonteverde`): the conversion machine + micro-interactions (copy-email flash, touch-reveal, iOS anti-zoom) — port faithfully.
- **a100arms** (live digest in skill ref 02; codebase `/Users/razim/D/DePaul/SHG/A100arms/website/` read-only): echo its data idioms, not its terminal skin — mono `tabular-nums` deal data; the pipe-delimited meta line (`State | Scale | Keys`); price/cap formatting vocabulary reused verbatim (`$5.25M`, `$350K`, `"N.NN% Cap"`, fallback exactly `"Price on Request"`) so future feed consumption renders without re-formatting; status-chip semantics (restyled to skill ref 03's badge: mono uppercase in a hairline pill, gold/ink — no glow dots); band vocabulary for any off-market teaser (`$10-20M`, `101-150 keys`, `7%+ cap`); its house entrance curve is our `EASE.out` (`cubic-bezier(0.22,1,0.36,1)`, fade + rise, fire-once) — same discipline. Do NOT copy: VS-Code dark chrome, 9px badge stacks, anything from `a100_DealSnapshot`/APNs/feasibility/tier labels. Feed work is Phase 2 — do not build.

## 10. Orchestration playbook (Workflow-tool runs)

- **W1 — Scaffold & system** (~4 agents): scaffold `site/` · fonts+`@theme` tokens+signature utilities · shadcn primitives restyle · motion tokens + transitions.dev vendoring. Verify: token-specimen page audit.
- **W2 — Art program** (~4 agents, parallel with W1 tail): ascii-gen script + frames · canvas component · hanko seal set · engraved line-art + star-grain. Verify: perf harness (throttled frame-times) + Razim-visible art preview page.
- **W3 — Sections fan-out** (the big one; ~10–13 builders + verifiers): pipeline per section — spec-writer → builder (worktree isolation per section to avoid conflicts) → design-audit agent (skill `audit` verb) → a11y agent (axe + keyboard). No barrier: sections verify as they finish.
- **W4 — Calculator** (~4 agents): `lib/valuation.ts` frozen port · golden-test writer (locks outputs to kwc for every type×tier + adjusters + rounding) · wizard UI · side-by-side cross-check agent vs live kwc on 5 scenarios.
- **W5 — Data/forms/routes** (~4 agents): ticker route + bar · BOV form + consent modal · privacy/sms-terms/accessibility placeholder pages + PLACEHOLDERS.md · SEO/OG/JSON-LD.
- **W6 — Adversarial ship gate** (~6 agents): full audit sweep (P0 gates) · perf (LCP/CLS/INP/bundle/60fps) · a11y (axe + Lighthouse ≥95) · content-fidelity vs kwc source · compliance checklist vs §8 · anti-AI-slop + vibecoded-tells pass. All must pass; findings loop back to fixes, re-run until clean, then a dry run of skill ref 07's QA grep script.
Between workflows, commit + push + memory entry. Use `budget`-aware loops if a token target is set.

## 11. Definition of done & demo script

DoD = PHASE-1-IMPLEMENTATION §8, plus: PLACEHOLDERS.md complete; compliance §8 checklist green (for the §8.2 team-name item, green = flag surfaced to Razim + logged in PLACEHOLDERS.md — resolution stays with the launch gate); hanko + ASCII shipped full-strength; `#brands` + `#mandates` live.
**Demo prerequisite:** the FRED API key and new Web3Forms key must be provisioned by Razim (PROJECT-MEMORY open items) — request them at kickoff, not at demo time; both features degrade gracefully until then.
**Demo script (what the preview must show Razim's team):** load thehokutengroup preview on a phone and a laptop → ASCII hero resolves, seam row reads THE HOKUTEN GROUP, shimmer follows the pointer → scroll: stats count up, flags drift by, closings show real numbers, listing cards link to Crexi → run the calculator on a 120-key select-service suburban hotel and get the same range kwc gives → watch the live 10-Yr rate in the ticker → click outside the consent modal and watch it refuse with a shake → submit a test BOV and receive the email → tab through the entire page without a mouse.

## 12. Out of scope — do NOT build (tempting rabbit holes)

Full marketplace page (Phase 3) · a100arms feed integration or any Firebase (Phase 2) · Monday CRM anything · blog/journal · JP language toggle (Japan desk is Phase 3; the 北天 motif ships, the locale does not) · auth/portal/"Private Access" gating beyond an outbound link · CMS/admin UI · liquid-dom / threecn (quarantined) · WebGL of any kind · per-broker profile routes · testimonials (permissions unresolved) · the ~$1B Sarhan-era narrative (unverified).
