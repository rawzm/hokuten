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
| 2026-08-17 | **Theme G (gold) is the production theme; the site is retuned to Dino's Brand Design Guide v1.3** — faces Cormorant Garamond / Inter / JetBrains Mono, the guide's gold + paper/ivory/cream/charcoal palette, its logo rule and vocabulary. Theme B is parked, not deleted. Exact hex resolution (guide `#B08D3F` vs raster/kwc `#B8943D`) and the dark-field question are R3 / R1 in docs/LAUNCH-IMPLEMENTATION.md §8 — the `#B8902E` guardrail is superseded only when Razim signs R3. | Razim's direction 2026-08-17 ("going forward with the yellow theme… match the design kit Dino sent — colour, font style, everything"); Dino sent the guide as the brand register (team chat 2026-08-17) and rejected the earlier yellow as not the specific gold |
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

### 2026-08-18 — Post GitHub-link deploy-trigger change committed to `main`

- Made a minimal source-level update and pushed `main` so the Vercel GitHub integration can auto deploy.

### 2026-08-18 — Main-branch deploy handoff completed for Vercel auto-deploy

- Pushed current `main` branch code changes in `site/components/cards/ListingCard.tsx`, `site/components/legal/LegalPage.tsx`, and `site/content/listings.ts` through the GitHub → Vercel auto-deploy path.

### 2026-08-17 — Dino's launch package received; Theme G locked to the brand kit; launch implementation doc written (provisional)

Dino delivered the full pre-launch package on 2026-08-16/17 (Brand Design Guide v1.3, Website & Launch
Master v2, Deployment Settings v2, CoStar Badge Review v2, outreach profile/signature/deal-card kit REV6,
Media zip with canonical headshots + CoStar Social Media Kit + social posts, Work Manual / Playbook /
Handbook / Role Guides / CRM guide, agreements, the 50-mile sweep workbook) and asked Razim to take the
site live. Everything sits under `full-brand-toolkit/` (untracked; the old `The_Hokuten_Group_Brand_Addon_2/`
tree was moved inside it — 17 tracked files show as deleted; resolution is P17 in the plan).

**Razim's decisions this session (recorded verbatim in intent):** go forward with the yellow (Theme G)
theme only; the site's colour must match Dino's design kit; the font style and the rest of the kit's system
too. Theme B is parked in place.

**What was produced** — a 17-agent research pass (12 readers over every delivered file incl. pixel-sampling
the lockup golds and transcribing the WhatsApp screenshot; Opus synthesis; three adversarial critics —
completeness / correctness / policy — 45 findings, all applied):
- [docs/LAUNCH-IMPLEMENTATION.md](docs/LAUNCH-IMPLEMENTATION.md) — status `provisional`. Token table
  current→new with recomputed AA ratios; typography swap Fraunces/IBM Plex Mono → Cormorant Garamond /
  JetBrains Mono (Inter stays); vocabulary→component mapping; logo usage per surface; Dino's locked copy
  and section order; awards per Claims Register v1.1 (4 individual + Top Firm as prior-firm/team, never
  "5×"); deals scrub + provenance line; three-listing allowlist + a100 proxy; six-seat roster; Monday
  intake + consent-aware measurement per Deployment Settings v2; go-live gates + runbook; 17 portions for
  `/implement-plan` (Sonnet builds / Opus reviews) with gates; 17 decisions for Razim (§8), 21 asks for
  Dino (§8.1), 29-row discrepancy register (§9).
- [docs/WHATS-LEFT.md](docs/WHATS-LEFT.md) — everything left from the team chat: website items,
  non-website deliverables Razim owes (deal-card KW mark + outreach kit on the brand register, signatures
  on Mac+iPhone for six seats, business-card proof fixes before print, LinkedIn/directories, headshot prep,
  agreements to sign — Japan ones excluded), items owed to Razim (bios/headshots already sent by Donna,
  KW's ruling on the gold mark, licence numbers / gate G3, the undelivered Claims Register v1.1 and Launch
  Decision Checklist), and items explicitly out of Razim's lane.

**Facts that change the plan (all sourced in the doc):**
- The Brand Design Guide v1.3 fixes the site's faces (Cormorant Garamond / Inter / JetBrains Mono — also
  what Dino's live kwc source declares) and palette (`--gold #B08D3F`, `--gold-dim #C8A552`, ink
  `#F5F1E8`/`#D0C9BC` on dark, `#1A1C1F` on light, paper `#FBF9F3`, ivory `#F4EFE3`, cream `#EDE7D8`).
  Every lockup raster and the kwc CSS run `#B8943D` — R3 offers both, defaults to the guide.
- The Launch Master v2 says the kwc site is the production base and Razim's build is "reference only" —
  contradicted by Dino's chat ask to take Razim's site live. **D15 — Razim settles with Dino before any
  build wave.** The plan is written for `site/` shipping.
- The five CoStar files in `site/public/awards/` are resized email-signature banners, not the Winner
  Badges, and the Top Firm one is byte-identical to the file CoStar's README excludes as prior-firm
  reference-only → re-intake (P15).
- No WhatsApp invite, no analytics, no Calendly URL, no Monday intake exist in the site yet — all are
  directives in v2 and are scheduled as real portions, not "already done".
- Two go-live gates may be unsatisfiable as written (G3 asks for DRE numbers; the disclosed licences are
  FL/IL) — D9 to Dino; Razim's own licence status is R8.

**Guardrail changes pending Razim's signature (not applied yet):** website gold `#B8902E` → guide value
(R3); typography non-negotiable Fraunces/IBM Plex Mono → guide faces (R13); Phase-1 static listings →
a100 proxy (L8); the "Hokuten-first / KW footer-only" wording is already superseded by D1 (2026-08-08).
CLAUDE.md and skill ref 01 are updated in P13 after the signatures, not before.

**Round 2 (same evening) — Razim's decisions, plan status → `approved`:**
- **Precedence rule:** Dino's newest document supersedes older ones. Verified order for the website:
  V2 START HERE / Deployment Settings v2 / Badge Review v2 (sent 2026-08-16 23:44) > FINAL_HANDOFF.md
  (23:15) > RAZIM_HOKUTEN_EDITS (Aug 5) > Brand-Addon README (Aug 5); PRE-LAUNCH KIT (later, Aug 17)
  governs the non-website finish list and gates and defers to V2 for the site; the Brand Design Guide
  v1.3 governs design over all. Where V2 is silent the next-newest speaks (section order = FINAL).
- **Which build ships — resolved by the build owner:** `site/` (Next.js, Theme G) is production. V2 §1
  lines 7/9 ("kwc site is the base, Razim's build is reference only") are superseded 2026-08-17.
- **No pre-build questions to Dino.** Every open item takes the recommended default (recorded in
  docs/LAUNCH-IMPLEMENTATION.md §8/§8.1); the site is built and pushed to the Vercel production URL
  (still noindex); Dino reviews there and changes are iterated. **The public cutover (remove noindex,
  point thehokutengroup.com, 301 from kwc-dinomonteverde.com) stays gated on the paperwork gates** —
  the CLAUDE.md guardrail is not lifted.
- **All §8 recommendations adopted:** keep the paper/dark-hero chassis and retune tokens (recorded
  deviation from V2 §1 line 8); vocabulary carve-outs; gold `#B08D3F`/`#C8A552` (rasters stay
  `#B8943D`) — the `#B8902E` guardrail supersession is now approved and lands in P13; V2 headline;
  Dino's section order; remove the `3×` tile; 3 featured + 3 roster seats; "Founding Team Member |
  Director"; keep 836K+ SF; keep the preview reachable; park Theme B; guide faces (Fraunces/IBM Plex
  Mono supersession approved); dark nav + on-charcoal linear lockup; "True north for hotel owners" as
  the footer brand line; `#doors` carries the marketplace intent; restore the brand-master tree and
  gitignore `full-brand-toolkit/` + `.tmp/` (done this session).
- **R8 resolved (Razim, same evening):** currently licensed in Illinois (#475.213653) but pausing that
  membership soon; no licensed acts under his own name (lead qualification, LOI/PSA work run under Dino's
  licence). Site renders **title only, no licence number** for Razim from day one; agreements use the
  non-licensed services framing; Broker-of-Record Schedule A drops him. Donna's bio received and banked
  (plan Appendix B13); Razim's draft bio (B14) awaits his word.
- **Delegated build is Opus 5 only** (builders and reviewers; the main loop will run as Opus 5). No
  Sonnet, no Haiku, no Fable subagents. Launch-manifest approval per wave, no main-loop fallback, and
  usage telemetry stay in force.
- **New portion P18** — non-website deliverables Dino handed to Razim: deal-card KW mark → stacked
  lockup + re-export; Dino's business-card proof (title → Managing Director, domain →
  thehokutengroup.com) before printing. Profile cards / signatures / vCards ship as delivered; the
  Mac + iPhone install for six seats is a manual per-device task.
- **Agreements:** Razim reviewed 01/02/03/07 (notes + rewording asks + compensation proposal in the
  private, gitignored `.tmp/private/AGREEMENTS-REVIEW-AND-DINO-MESSAGE-2026-08-17.md`). Key finding:
  the Team Commission Agreement (solo 80/20 · team 50/30/10/10 · double-ended 80/10/10) has no line
  for Razim's technology function (he built a100 Arms entirely and built/maintains the kwc, Japan and
  Hokuten sites, unpaid so far); the ask is a 2–3% Technology share from the Team overhead line plus a
  deal-support credit, structured as non-licensed services compensation.

- **Monday intake — contract written (2026-08-17 evening):** Deployment Settings v2 ("defaults to Contacts") conflicts
  with the CRM Guide ("nothing unverified sits in Contacts"; email is the primary key; graduating to Contacts is a
  licensed-broker move) and names fields the Contacts board has no columns for. Resolution in
  [docs/MONDAY-INTAKE-CONTRACT.md](docs/MONDAY-INTAKE-CONTRACT.md): the website creates only in **Unverified
  Leads / New-Unverified**, reads Contacts for dedupe (Update-only on an existing item), never writes Buyer
  Leads/Deals, never invents boards/groups/columns/labels, ships in dry-run until Dino's agents return the
  existing schema (board/group/column IDs, label sets, automations). Schema request for Dino (with the exact
  IDs) is private under `.tmp/private/`. `provisional` until Dino rules on the write target.

**EXECUTED the same evening (2026-08-17, 21:41–23:00) — Opus-5-only delegated run, 8 workflows / ~40 agents.**

Shipped to the working tree and pushed to the Vercel PRODUCTION deployment with `noindex, nofollow`
still in force. Public cutover (remove noindex, point thehokutengroup.com, 301 from
kwc-dinomonteverde.com) remains gated on the paperwork gates — untouched by this run.

**Landed:** P17 repo hygiene + baseline · P1/P2 token layer (Cormorant Garamond / Inter / JetBrains
Mono; `--accent #B08D3F`, `--accent-dim #C8A552`, derived `--accent-ink #7E652D` / `--accent-deep
#675325`, paper `#FBF9F3` / ivory `#F4EFE3` / cream `#EDE7D8` / dark `#1A1C1F`, new `--ink-dark-*`
dark-field bindings) · P5 section order + renumber to Dino's sequence · P16 footer WhatsApp invite +
disclosure, "True north for hotel owners" footer line, Calendly · P15 the five CoStar **Winner
Badges** re-intaken at native aspect (the shipped files had been resized email-signature banners, one
of them the README-excluded prior-firm asset) · P6 hero/stats/awards/closings copy · P7a three-listing
allowlist · P8 six-seat roster · P9 five unanswered FAQs cut · P10 server-side Monday intake
(dry-run default) · P11 a100 public-listings proxy · P3 raster regeneration · P7b/P14 metadata,
single noindex source of truth, consent-aware measurement with null vendor IDs · P13 dated guardrail
supersessions · P4 guide vocabulary (outlined CTAs, hairline tickets, minimised radii) · P18
non-website deliverables.

**Verification at commit:** `pnpm build` PASS (11 routes) · `tsc --noEmit` exit 0 · vitest **228/228**
(the frozen 128-test valuation port byte-identical to HEAD, +100 new intake/proxy tests) ·
`contrast.mjs` **0 FAIL / 51 PASS** (baseline had 5 FAIL; the script also now exits non-zero on
failure — it previously always exited 0, which is how the failures went unnoticed) · QA greps clean
(Hakuten 0 · CyEa 0 · one WhatsApp invite · Sarhan/Mheni/Schulman only in guardrail comments · zero
`PLACEHOLDER:confirm` in `content/`).

**Defects the adversarial reviewers caught before they shipped** (the reason the run used them):
five real intake vulnerabilities — a dedupe silent-miss that would have duplicated CRM people, CRM
record forgery + HTML injection via newline-bearing form fields, email header injection through the
hotel name, PII posted to unvalidated plaintext webhooks, and a rate-limit bypass on a spoofable
header; a forbidden "$200M+ closed across 12 hospitality transactions" compression in the root/OG
description; the banned "Asia to the Americas" phrase surviving in a comment the release grep sweeps;
JSON-LD emitting empty descriptions and bypassing the headshot-approval gate; `SECTION_IDS` still
holding the pre-reorder sequence that the nav scroll-spy derives from.

**Decisions taken during execution (new law, recorded here):**
- **The 2025 Annual Top Firm badge ships** as prior-firm/team recognition in its own block with the
  full qualifier. The CoStar README reads as excluding it from the website package; Dino's later chat
  instruction asked for it explicitly, and newest instruction wins under the precedence rule.
- **The EXCLUSIVE badge came off the two new listings** — both were found publicly listed on LoopNet
  showing other brokers' contacts, so the claim has no `verified-current` evidence. One line to
  restore if Dino confirms exclusivity.
- **Theme B's dark chapter shifts** as a side effect of the shared `.surface-dark` rebinding
  (measured 15.75 / 10.79 / 5.03 — all still AA). Accepted deliberately; Theme B is parked.
- `pnpm build` does **not** type-check `site/scripts/**` under Next 16 — a hard TS error sat there
  while the build reported success. `tsc --noEmit` stays in the gate set permanently.

**Not done — next session:** the horizontal-overflow gate at 375/768/1440/1920/2560, screenshots,
Core Web Vitals and the design-director `audit` verb (all headless work, none run) · the last four
agents' reviewer passes were still finishing at commit time · `lib/web3forms.ts` is dead but not
deleted · `Doors`/`Footer` double gutters after the reorder · `public/art/listing-placeholder.svg`
still carries retired tokens · `identity-prep.ts` PART 2 would throw on re-run (its badge specs point
at `Ref/site/` files P15 deleted) · the hero's one-screen re-measure.


### 2026-08-10 — Design revisit 2 approved (execution brief; implementation pending)

Razim reviewed the current build with annotated desktop screenshots and approved a second comprehensive
design pass. The pre-resolved build order is [docs/DESIGN-REVISIT-2.md](docs/DESIGN-REVISIT-2.md), status
`approved`. This entry records the decisions now; a separate newest-first entry is required when the work
ships.

**Approved direction**
- Replace the landing page’s 1200px-wide center-stage dependency with a fluid full-viewport stage and
  locally constrained prose. The route remains hero → Trust Metrics → numbered sections 01–09 → footer.
- Qualifying desktops use **native CSS mandatory scroll snap** so each section reads as a page. There is
  no wheel/touch interception. Mobile, touch/coarse-pointer, short-height, 200%-zoom/reflow, and
  reduced-motion layouts retain normal document flow; truthful tall content is never clipped.
- Hero becomes a 3–5 image, server-first slideshow with one transient CSS mosaic transition. New masters
  arrive as art-directed desktop/tablet/mobile triplets in `Ref/hero/`; a repeatable script exports
  optimized public copies. `Ref/` remains source-only at runtime.
- Trust Metrics becomes the single proof wall: the theme-matched group lockup, verified metrics, and all
  five verified CoStar assets. Annual awards leave Track Record; award rasters render large/as supplied,
  without UI borders, seats, shadows, recoloring, or links.
- Closing and listing cards become landscape premium deal tickets on desktop. Price is a larger semantic
  money-green data moment. SOLD photography is grayscale at rest and reveals color on hover, focus, and
  the existing touch-reveal action; listing photography remains CRM-ready with an honest interim state.
- Valuation expands from three to five steps and removes the section’s nested result scrollbar. Calculator
  math, constants, defaults, validation, copy, and disclaimers remain frozen. Market Reference becomes the
  compact ticket variant with selected-property imagery.
- A short theme-matched loader is approved for first-session visits and real reloads only, with a progress
  track and hard failure cap. This narrowly supersedes the earlier “no preloader ever” reference rule.
- Menu becomes a true full-bleed screen: full-color art, theme lockup, two-column desktop index, no
  normal-case scrollbar, with an accessible overflow fallback only for short/zoomed layouts. Exact menu
  crops are recorded in the brief.
- Header lockup grows within a slightly taller toolbar; Trust gains a lockup; footer uses the correct
  theme lockup while retaining exactly one KW compliance-mark instance and byte-exact disclosure.
- The FRED bar gets a fixed left-most LIVE label with a green steady/blinking status dot and a measured,
  indefinitely repeating metric rail. Fetch behavior and labels stay unchanged.
- Typography keeps Fraunces/Inter/IBM Plex Mono but gains a strict display → primary value → body/data →
  micro hierarchy. Additional motion is limited to the loader, hero mosaic, sold-photo reveal, and the
  repaired continuous rails.

**Asset crops approved:** hero desktop 3200×800 (4:1), tablet 2048×896 (16:7), mobile 1600×1200
(4:3); menu desktop 1800×2400 (3:4), mobile 2400×1000 (12:5). Missing new crops do not block chassis
implementation; current approved artwork remains the interim source.

### 2026-08-10 (late) — Revisits 2 AND 3 SHIPPED together (session ended at 98% budget)

One push carries the whole of Design Revisit 2 (which had never been committed) plus most of
Revisit 3. Build green · tsc clean · vitest 128/128.

**Revisit 3 — what landed**
- **D22 scroll snap REMOVED.** globals.css §6b retired, `components/motion/PagedMode.tsx` deleted,
  SmoothScroll's paged-mode gate reverted (Lenis is back to its original three gates), the stale
  `--brands-h` token removed. The twelve `page-panel` compositions and `stage-shell` survive — the
  page still reads as twelve screens, it just scrolls naturally. Razim's verdict on snap was
  "messy and not properly navigating… buggy overall."
- **D23 real hero triplets.** Razim's nine files in `Ref/hero/` (01-marriott / 02-luxury /
  03-resort, exact 4:1 / 16:7 / 4:3 ratios) are wired through `hero-prep.ts` → 67 generated
  derivatives → `content/heroSlides.ts`. All three are `theme: "both"`; marriott is the LCP slide.
  The interim artwork slides are gone. Sources are 1536–1672px wide against a 3200px ideal, so they
  soften modestly above ~1672px — accepted, tracked in PLACEHOLDERS.
- **D24 slideshow is fully automatic.** Chevrons, dots, counter and the visible pause button are
  gone. One invisible-until-focused pause button survives for WCAG 2.2.2 (skip-link pattern).
- **D25 hero + chips.** Headline row moved to `stage-shell` as a genuine two-column split (it was a
  centred column with dead margins); chips raised to `clamp(3rem, 2.5rem + 2.6vw, 5rem)` ≈ 48→80px.
- **D26 menu.** Photo panel replaced by the centred theme lockup at ~260–320px, close moved to the
  top-right, top-right lockup removed. New XL derivatives generated (`lockup-{gold,blue}-xl`,
  854×640 / 766×640) and wired through `themePresentation.lockupXl`. `menuArt.ts` and the generated
  `public/menu/` assets stay in the repo, parked.
- **D27 Trust.** Redistributed to fill its screen, and the CoStar verification link to
  `costarpowerbrokers.com` renders beneath the evidence rows. Badges themselves stay non-linking.
- **D29 horizontal overflow — GATE PASSES at 375/768/1440/1920/2560.** Root cause found and fixed
  at source: `DataLine`'s `parts` variant forced `whitespace-nowrap` on EVERY part, and #mandates
  passes a full prose clause through it — a 486px span inside a 245px column pushed the document to
  1616px at a 1440px viewport. Parts longer than 32 chars now wrap; short data tokens keep the
  no-mid-break guarantee. `html { overflow-x: clip }` added as insurance (clip, not hidden — hidden
  would break sticky), reset to `visible` in print.

**What is NOT done — pick this up next session**
1. **D28 panel fit.** Measured at 1440x900 (one screen = 784px): method **1234px (1.57)**,
   listings **1179px (1.50)**, calculator **1022px (1.30)**, closings 860 (1.10), team 858 (1.09),
   hero 806 (1.03). Everything else is exactly 1.0. A targeted fit workflow with exact per-panel
   budgets and measured internals was launched and STOPPED at the 98% mark — its brief is
   reproducible from the internals recorded in DESIGN-REVISIT-3 §1 D28. NOTE: an earlier fit wave
   touched these files but moved the numbers ZERO — verify any change actually re-measures.
   With snap gone this is a density preference, not a functional bug: over-height panels simply
   scroll. Razim specifically called out #method as "lengthy".
2. **Docs not refreshed:** skill refs 03/04/05/07 still describe the snap system as live;
   `docs/PLACEHOLDERS.md` rows 51/52 still describe `Ref/hero/` as empty and the hero as three
   interim slides; ref 06's CoStar rows want a dated note naming the verification link;
   `content/artwork.ts`'s `hero.gold`/`hero.blue` want a retirement comment; AUDIT_LOG not appended.
3. **Not verified this session:** screenshots in either theme; Core Web Vitals; the Theme B build
   (only gold was rendered); the 2560px ultrawide brand/ticker soak.
4. Hero alt text names real Marriott signage — first time a franchisor brand appears in hero
   imagery rather than a chip. Worth a business-side look alongside the existing counsel flag.

### 2026-08-10 (evening) — Design revisit 3 ordered after Razim's localhost review

Razim reviewed the (stale-build) localhost render of Revisit 2 and issued written corrections —
full pre-resolved work order in [docs/DESIGN-REVISIT-3.md](docs/DESIGN-REVISIT-3.md). Headlines:
**D22** scroll snap removed entirely (verdict: buggy) — natural scrolling, panel compositions stay;
**D23** Razim delivered three real hero triplets in `Ref/hero/` (exact 4:1/16:7/4:3 ratios, below
ideal canvas — accepted), used in both themes; **D24** slideshow goes fully automatic, no visible
chrome; **D25** hero fits exactly one screen, headline row spans the stage, chips grow to ~80px;
**D26** menu photo panel replaced by a large centred theme lockup, close moves top-right (needs new
XL lockup derivatives); **D27** Trust fills its screen + gains a costarpowerbrokers.com
verification link; **D28** nothing scrolls internally, Method must truly fit; **D29** horizontal
overflow becomes a hard release gate with `overflow-x: clip` insurance. Implementation handed to
the next agent; Revisit-2 tree is still uncommitted and ships together with these fixes.

### 2026-08-10 — Design revisit 2 ordered; two executor questions answered

Razim issued [docs/DESIGN-REVISIT-2.md](docs/DESIGN-REVISIT-2.md) — a second, screenshot-led revisit
covering the viewport system, hero slideshow, proof wall, deal tickets, five-step calculator, loader,
menu, identity sizing, ticker, hierarchy and mobile behaviour. Status `approved`, landing route only.
It supersedes revisit 1's D3 (split CoStar placement), D5 (single static hero image; glyph-only menu
panel), D6 (free-scrolling fit-to-viewport; calculator scroll-well) and D4 (muted sold imagery), plus
the standing "no preloader ever" rule.

**Two decisions Razim made when the executor asked, 2026-08-10:**

1. **Production stays publicly reachable for now.** The brief's own Definition of Done says "no
   public deploy before the paperwork gate", and `hokuten.vercel.app` is reachable by anyone with the
   link. Razim was offered Vercel Deployment Protection and **chose to leave it open**. The site
   remains `noindex, nofollow` with `robots.txt` disallow, so it is not crawled — but it is viewable,
   including the colour franchise marks, the CoStar badges and artwork containing third-party
   signage. The KW / Forward Wilshire paperwork gate still governs public LAUNCH (domain, promotion,
   indexing); it no longer governs URL reachability. Revisit when counsel reviews the marks.

2. **The hero ships three INTERIM slides cropped from already-approved artwork.** `Ref/hero/`,
   `Ref/menu/` and `Ref/calculator/` were created but are empty — no new crops delivered. §4.1 wants
   a 4:1 desktop crop at 2400x600 minimum; the widest approved master is 1942x809, so an interim 4:1
   crop yields ~1942x486 and will look soft above roughly 1942px of viewport width. Razim accepted
   that in exchange for being able to review the slideshow, the mosaic transition and the controls
   now. Tracked as `blocked: awaiting-crop` in PLACEHOLDERS with the exact target canvases; swapping
   in real triplets is a data edit, not a refactor.

**Implementation note that resolves a genuine conflict in D10.** The brief asks for
`scroll-snap-type: y mandatory` AND for a panel taller than the viewport to scroll through before the
next boundary. Under `mandatory` those conflict: the browser must come to rest on a snap point, so
the middle of a panel taller than the viewport becomes unreachable — an accessibility failure, not a
cosmetic one. Resolved by keeping `mandatory` and taking tall panels OUT of the snap set: a
measurement-only client island sets `data-tall` on any panel exceeding the usable screen and the CSS
drops that panel's `scroll-snap-align`. Still pure native scroll — no wheel listener, no
`preventDefault`, no synthetic jump. Scroll-jacking remains banned.

### 2026-08-09 — Design revisit 1 EXECUTED (D1–D8 shipped, both themes)

Executed [docs/DESIGN-REVISIT.md](docs/DESIGN-REVISIT.md) end to end across five Workflow
orchestrations (30 subagents; Sonnet for pattern work, Opus for frozen-math parity, byte-exact
compliance and content-fidelity audit). Integration, build-fixing and all screenshot QA stayed in
the main loop, per the §0 working rules.

**Shipped**
- **D1** Theme-matched KW/Hokuten lockup is the header mark (44px tall; gold 59×44, blue 53×44),
  with a real-text brand line beside it. Prepared from `Ref/site/` into `site/public/brand/`.
- **D2** `#brands` renders 15 real franchise chips **in colour** at 52px/36px, closing the hero's
  first viewport. Prepared from Razim's 16 supplied 3D glass squircles by a scripted bbox +
  knockout + optical-height normalisation (`site/scripts/brand-chips.ts`).
- **D3** Real CoStar badges render: three quarterly banners in `#stats`, the two 2025 Annual badges
  in a recognition strip in `#closings` so neither moment is congested. Register rows added (ref 06).
- **D4** Listing/closing cards are dimensional deal tickets on a shared `Ticket` chassis — colour
  header band, perforated tear line with real punched notches, tiny-caps/bold-mono metrics grid,
  resting ink-tinted shadow, and a rotated hairline SOLD overprint on the retired state.
- **D5** The hero and section art is Razim's supplied 「北天」 glyph-mosaic, prepared into 92
  responsive AVIF/WebP/JPEG derivatives (`site/scripts/artwork-prep.ts`) behind a typed placement
  manifest (`site/content/artwork.ts`). **AsciiCanvas is retired from the page** — scripts and JSON
  stay in the repo, uninvested. `<KanjiAccent>` (our own SVG motif) ships.
- **D6** Fit-to-viewport rhythm: `--nav-h` 88px → 68px, `section-pad` compressed, plus
  `section-pad-tight` / `section-join` / `section-fit` / `scroll-well`. **Zero dead bands between
  sections, measured.** Footer down to 0.81 screens with exactly one KW compliance mark.
- **D7** Landing route measures **316.8 KB gzip against the new 340 KB budget** (PASS). Calculator,
  BOV form and MenuOverlay are dynamically imported; LazyMotion + `domAnimation` converted.
- **D8** New `text-display0` step (hero h1 only), amplified hierarchy sitewide.
- Calculator rebuilt as a landscape, tile-based experience with a live market-data context rail —
  **math untouched, 128/128 vitest green, field-for-field parity re-verified**.
- Ship-gate carry-overs cleared: `OUT_OF_STATE_QUALIFIER` ported byte-exact from `index.html:1152`
  and rendered under the footer disclosure; `layout.tsx` composes its description from
  `content/stats.ts`; `faq.ts` imports `BROKERAGE_DISCLOSURE`; a vitest block binds the two
  calculator-disclaimer owners; the `will-change` and nav active-state reflow fixes landed.

**Decisions taken during execution (these are new law, not restatements)**
- **The brand-chip marquee renders on a LIGHT surface in both themes.** Verified by compositing the
  real PNGs on every candidate ground: the chips carry baked light-on-white drop shadows, so on a
  dark surface they show grey halo boxes. Light band is also what the runcycle reference does.
- **The hero's nav sentinel reports `data-surface="light"` in both themes.** It used to derive from
  `themePresentation.heroSurface`; correct only while the nav overlaid the hero. Under the runcycle
  anatomy the nav sits *above* the art on the paper page top, and deriving it painted Theme G's nav
  links and menu trigger ivory-on-ivory — invisible controls, no mobile menu at all.
- **`text-display0` capped at 4.75rem, not 8.25rem, and the hero art band is the flexible element.**
  The first pass sized the type from the ramp with no browser to check it: the ~60-character
  manifesto wrapped to four lines in a half-width column and the hero measured 1.78 viewports.
  The art now absorbs the remainder of `--screen-fit - --brands-h`, so the hero is exactly one
  screen at any viewport height. Measured 604px + 180px = 784px of 788px at 1440×900.
- **AVIF encoder effort is 4, not 9**, in `artwork-prep.ts`. At effort 9 the full set took ~50
  minutes; effort 4 takes 6m23s for low-single-digit-percent more bytes, all inside budget.
- Artwork masters stay in `Ref/artwork/` and `Ref/hotel-brands/`; a delivered piece is a one-line
  edit to the script's placement config plus a manifest row.

**Ship-gate findings fixed this round (found by audit, not guessed)**
- P0 — the trademark disclaimer under `#brands` shipped at `text-fg-meta/70` = **2.81:1**, an AA
  failure on a legal string. Opacity modifier removed. Reduced emphasis on legal text comes from
  size and placement, never from dropping below AA.
- P0 — scroll-revealed sections **printed blank**. `Reveal` arms below-fold elements with an inline
  `opacity:0`, and the `@media print` block never reset it, so an owner printing the track record
  without scrolling first got blank paper. Printing listings and closings is an explicit ref 07
  gate. Print block now force-resets, with the deliberate exceptions (visually-hidden text, marquee
  clones) still hidden.
- P0 — Theme B only: `plate-frame`'s −5px registration marks sat on the full-bleed hero container
  and gave the document a 4px horizontal scroll at 375 and 768. Moved to an inset inner wrapper,
  which is also the correct reading of a plate frame.

**Verification**: build green; `tsc` clean; vitest 128/128; landing route 316.8 KB gz; no console
errors, no failed asset requests, no horizontal overflow at 375/768/1440 in **both** themes;
screenshots captured for gold and blue at all three viewports.

**Still needed from Razim** (tracked in [docs/PLACEHOLDERS.md](docs/PLACEHOLDERS.md)): the
extended-stay property square; chips for Radisson and Choice Hotels; a name for the unidentified
amber chip (`site/public/logos/_hold-amber-mark.png`, master `…03_44_42 PM.png`); real photography
for the five active listings; portraits for Razim and William. The counsel flag on third-party marks
and on artwork containing third-party signage stays open until the public-launch gate; the site is
internal-only and Razim accepts the interim posture.

### 2026-08-08 — Design revisit 1 ordered after Razim's live review (evening)

Razim reviewed both theme URLs and issued a full design revisit. **New executor brief: [docs/DESIGN-REVISIT.md](docs/DESIGN-REVISIT.md)** — kickoff: *"Read docs/DESIGN-REVISIT.md in the hokuten repo and execute it."* (For OPUS-5; brief authored by Fable per Razim's model switch.)

**Decisions (Razim, 2026-08-08) — each supersedes prior law; W0 of the revisit updates AGENTS.md + skill refs so audits enforce the new direction:**
- **D1** Header logo = the KW/Hokuten lockups Razim supplied in `Ref/site/` (blue ↔ Theme B, gold ↔ Theme G). ~~No KW lockup in the header~~ (2026-08-07) superseded. `Ref/site/` is production-approved by exception; the rest of Ref/ stays source-material-only.
- **D2** `#brands` = **actual franchise logos, in color**, full $1M–$100M flag set, marquee loop, moved into the hero's first viewport. ~~Grayscale only / never colorized~~ superseded. Disclaimer text stays byte-exact but renders tiny with an asterisk. Counsel flag for public launch remains in PLACEHOLDERS (site is internal-only).
- **D3** Real CoStar banners render (3× Power Broker Quarterly Deals + **new claims**: 2025 Annual Top Broker, 2025 Annual Top Firm — register rows added; source: badge assets provided by Razim 2026-08-08).
- **D4** Listing/closing cards → dimensional **deal-ticket** design (boarding-pass translation; ACTIVE vs SOLD/retired states). Shadows on cards permitted, ink-tinted only.
- **D5** ~~Platform image treatment = 北天 chromatic sieve: color-preserving ASCII art generated by our pipeline~~ **Corrected later same evening (Razim):** the treatment is a **typographic halftone / glyph-mosaic** with 「北天」 as the sole primitive — **not ASCII, and not generated by this repo**. Razim produces each artwork himself via a controlled img2img prompt and supplies finished files; the executor does intake/prep/placement only (manifest in DESIGN-REVISIT §3). AsciiCanvas/shimmer/loop/seam-row retire from the page (script kept, uninvested); anti-AI-slop rule clarified — the ban covers fake photography, Razim-approved stylized glyph art is the house treatment. The `<KanjiAccent>` SVG background motif is still ours to build. The Method engraving is retired (Razim: ugly).
- **D6** Fit-to-viewport sections, compressed rhythm, compact footer. No scroll-jacking; internal native scroll only where unavoidable.
- **D7** JS budget re-based (closes the open ship-gate question): critical path ≤200KB gz, full landing ≤340KB gz, mandatory LazyMotion + code-splitting of Calculator/BOV/Menu/Consent. Measured basis: 272KB actual, 129KB framework floor — ref 05's 180KB was unreachable on this stack.
- **D8** Typography contrast amplified (hierarchy pass; Fraunces may step to 500, never 600+).
- Calculator/BOV become landscape, tile-based interactive experiences — **math stays frozen**, UI only, field-for-field parity re-verified after the redesign.
- New refs for ref 02's `study` verb: runcycle hero (2 screenshots), Stone menu jpg, boarding-pass screenshot.
- **Artwork batch 1 delivered (Razim, 2026-08-08, later):** 5 glyph-mosaic scene pieces in `Ref/artwork/` (HIE entrance dusk · resort/pool · full-service sunset · branded tower · beachfront aerial) — mapped in DESIGN-REVISIT §3 (A5 → Theme G hero, A3 → Theme B hero, A1 → menu/method). 16 brand chips (3D glass squircles: Marriott, Best Western, Ritz-Carlton, et al.) in `Ref/hotel-brands/` — prep spec §3.7; ref 06 `#brands` register row wording widens to "economy through luxury" to match the shipped set. **Theme B artwork palette bias**: dusty blue → pale ivory → warm sand → muted salmon → olive → deep navy/burgundy (record in ref 01). Option-tile shape contract locked (§3.8): property type 1:1 ≥800px; market tier 5:2 ~1600×640; binary options stay text chips. Still wanted from Razim: limited-service + extended-stay squares, 5 active-listing photos, Razim/William portraits.
- Defects from Razim's screenshots: menu overlay photo overlaps the index (P0 — superseded by the menu rebuild); stats numerals may clip under the sticky nav (reproduce + fix).

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
