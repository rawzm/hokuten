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
- [ ] Provision: new Web3Forms access key + new FRED API key (into Razim's Vercel project) + team Calendly URL (`blocked: calendly-url`)
- [ ] Connect Vercel project to `rawzm/hokuten` with Root Directory = `site` (after M0 scaffold)
- [ ] Confirm exact live domain (thehokutengroup.com assumed) + Vercel DNS on Dino's GoDaddy
- [ ] Phase 2: Hokuten-scoped a100arms public feed (Razim owns backend; mirror kwc-listings allowlist + photo-sync spec)
- [ ] Monday CRM: decide what (if anything) syncs to the site vs. stays internal
- [ ] Sarhan-era "~$1B" narrative + testimonials: Dino sign-off + permissions before use (`pending-verification`)
- [ ] 北天 hanko seal mark: build candidate, get Razim approval (`exploring`)
- [ ] ~~Rotate the GoDaddy password shared in chat~~ closed 2026-08-07 — account has MFA
- [ ] Optional: rename `~/Documents/Hakuten` folder → Hokuten someday (breaks open sessions; low priority)
