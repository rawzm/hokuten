# LAUNCH IMPLEMENTATION — Theme G lock + Dino's 2026-08-17 brand kit

## 0. Header

| | |
|---|---|
| **Status** | `approved` — Razim, 2026-08-17. Every §8 recommendation is adopted as the decision and every §8.1 "needs Dino" item carries a documented default. **One standing exception:** the **cutover gate** — the build is pushed to production now, but removing `noindex`, pointing `thehokutengroup.com` and the 301 from `kwc-dinomonteverde.com` stay gated on the paperwork gates (`CLAUDE.md` hard guardrail, §6.4). (R8 — Razim's licence status — was resolved the same evening: see §3.9 / R8.) |
| **Date** | 2026-08-17 |
| **Owner** | Razim (Mohamed Razim Meeran) |
| **Scope** | `site/` landing route + legal routes, brand tokens, launch config — plus the non-website outreach-kit and business-card fixes in P18. Calculator math/`CONFIG` untouched. |
| **Brand spelling** | HOKUTEN. Never "Hakuten" in any artifact this doc produces. |
| **Precedence** | Dino's newest document supersedes older ones (L13). For the website: `V2` > `FINAL` > `EDITS` > `ADDON` README. `KIT` governs the non-website finish list and the gates. `GUIDE` v1.3 governs design over all of them, by its own rule. |

> **Razim — read in this order (5 minutes):** §0.4 (which build ships — **resolved**, `site/` ships) → §1 **L13/L14/L15** (precedence rule · Opus-only build · push now, cutover gated) → §8 (the seventeen decisions, all taken — R8 included) → §8.1 (the twenty-one defaults taken so nothing waits on Dino pre-build) → §7 (the eighteen portions, the wave plan, and the wave-1 launch manifest). Everything else is reference for the build fleet.

### 0.1 Sources read (every file behind a claim in this document)

**Dino's 2026-08-17 delivery** (paths relative to `full-brand-toolkit/` unless noted):

| Id | Path | What it governs |
|---|---|---|
| `GUIDE` | `00 - HOKUTEN BRAND DESIGN GUIDE - v1.3 - 2026-08-17.docx` (txt extraction read) | Design doctrine of record — faces, palette, vocabulary, logo rule, two-fields rule |
| `V2` | `HANDOFF - 01 - START HERE - HOKUTEN WEBSITE AND LAUNCH MASTER - v2 - 2026-08-17` (txt + PDF twins) | Master website + launch directive; roster, awards, listings allowlist, forms, gates |
| `HANDOFF-02` | `HANDOFF - 02 - RAZIM DEPLOYMENT SETTINGS REQUIRED - v2 - 2026-08-17` | Env vars, Monday intake, analytics, WhatsApp, 301, rate limit |
| `HANDOFF-03` | `HANDOFF - 03 - COSTAR AWARD BADGE REVIEW - v2 - 2026-08-17` | Badge layout law, 4+1 award split, alt/caption rule |
| `FINAL` | `HOKUTEN_RAZIM_FINAL_HANDOFF.md` | Taglines, section order, team plan, 17-asset list, NOINDEX mechanic |
| `KIT` | `00 - RAZIM PRE-LAUNCH KIT - START HERE - 2026-08-17.txt` | The finish list + the three go-live gates |
| `EDITS` | `06 - RAZIM AUG-5 SITE EDIT SHEET .../RAZIM_HOKUTEN_EDITS.md` (superseded in part) | **Still controlling:** §8 deals scrub + provenance line, and the three go-live gates |
| `PROFILE` | `06 - .../HOKUTEN_COMPANY_PROFILE.md` (corrected 2026-08-17, partially) | Company boilerplate, tagline, LinkedIn fields |
| `ROLES` | `05 - HOKUTEN ROLE GUIDES - ONE PAGE PER SEAT - v1.0 - 2026-08-17` | Exact six-seat titles |
| `MANUAL` | `HOKUTEN WORK MANUAL - READ ONLY REFERENCE - v1.0 - 2026-08-17` | Forbidden descriptors, public-data rule, manual-send rule |
| `PLAYBOOK` | `HOKUTEN WORK PLAYBOOK - v1.0 - 2026-08-17` | "If it isn't in the register, it doesn't get said" |
| `AGREEMENTS` | `01/02/03/07/08/09 - *.docx` (Japan `04`/`05`/`06` ignored per Dino) | Entity facts, licensed-activity limits |
| `ADDON` | `The_Hokuten_Group_Brand_Addon_2/README.txt` + `01_Logo_Lockups/` (10 files) + `02_Covers/` | Kit gold, lockup masters |
| `MEDIA` | `Media (1).zip` → `Media/` (headshots, CoStar awards, social posts, YouTube) | Headshots, badges, listing facts |
| `OUTREACH` | `03 - OUTREACH PROFILE SIGNATURE AND DEAL CARD KIT - REV6 (1).zip` | Card visual language, six vCards/signatures, deal-card template |
| `HEADSHOT` | `razim-headshot-bw.jpeg`, `razim-headshot-color.jpeg` (1254×1254) | Razim's new preferred headshot |
| `CHAT` | `chat-context.md` (repo root, **gitignored/private**) + WhatsApp screenshots | Verbal decisions 2026-08-16 → 2026-08-17 — paraphrased only, never quoted (convention stated in WHATS-LEFT.md, "Evidence convention") |

**Repo sources:** `CLAUDE.md`/`AGENTS.md` · `PROJECT-MEMORY.md` (§1–4) · `docs/DESIGN-REVISIT-3.md` · `docs/DESIGN-REVISIT-2.md` · `docs/PHASE-1-IMPLEMENTATION.md` · `docs/PLACEHOLDERS.md` · `docs/RESUME.md` · `docs/design/CONTRAST.md` + `contrast.mjs` · `.agents/skills/hokuten-design-director/references/01–07` · the `site/` tree (files cited inline with `path:line`).

### 0.2 How this doc relates to the existing plan documents

- **`docs/DESIGN-REVISIT-3.md`** (`approved`, Razim, 2026-08-10) built the chassis this document dresses. D22–D29 stand: no scroll snap, real hero triplets, chromeless slideshow, one-screen hero, centred menu lockup, filled Trust panel, no internal scrolling, **horizontal overflow is a hard release gate**. Nothing in this document reopens D22–D29. Where a vocabulary change here (§2.3) touches a Revisit-3 surface, it is additive styling inside the same chassis.
- **`docs/PHASE-1-IMPLEMENTATION.md`** remains the scope-of-record for what the site *is*. This document is a delta on top of it: brand-system retune + Dino's locked content + launch configuration. Nothing here adds a new Phase-1 feature.
- **`PROJECT-MEMORY.md`** — this document is not itself a decision. Each row of §1 that Razim approves becomes one dated PROJECT-MEMORY entry (newest first) before the first push, per the memory protocol. Four of them (**L2 palette**, **L3 faces**, **L8 listings pipeline**, **D-VOCAB**) explicitly supersede standing entries and must say so in the entry text.
- **Working-tree state the build fleet will hit on day one.** All 17 tracked files under `The_Hokuten_Group_Brand_Addon_2/` (10 lockups, 6 covers, `README.txt`) are **deleted in the working tree**, and `full-brand-toolkit/` — from which §2.4 and §4 source every brand master — is **untracked**. `CLAUDE.md`'s guardrail still names the now-missing `The_Hokuten_Group_Brand_Addon_2/` as the read-only brand-master location. **Resolved by R17:** restore the tracked tree, gitignore `full-brand-toolkit/`, and copy the source assets the build actually needs into tracked `Ref/` subfolders. First portion to run: **P17**.
- **This plan ships `site/` as production — resolved, not assumed** (§0.4, L13 · L15). `V2` §1 lines 7/9 are superseded by Razim's build-owner decision of 2026-08-17; the supersession is written into PROJECT-MEMORY in P13.

### 0.3 Summary

Dino shipped a complete brand and launch package on 2026-08-17 and asked Razim to take the site live. This document turns that package into a build plan. The work is five things at once: (1) retune the site's design tokens to the Brand Design Guide v1.3 — Cormorant Garamond / Inter / JetBrains Mono, the guide's gold and paper/ivory/cream values, with all AA-derived tokens recomputed; (2) lock Theme G as the only reachable theme and park Theme B in place; (3) apply Dino's locked content — hero copy, section order, the four-plus-one CoStar award split, the deals scrub and provenance line, the three-listing allowlist, and a six-seat team roster; (4) stand up the launch configuration — server-side Monday intake, consent-aware analytics, the public-listing proxy, and the noindex/301/DNS sequence; and (5) fix the two non-website deliverables Dino handed over, the deal-card template mark and his physical business card (P18). Every decision the plan needed is taken: §8 adopts all seventeen recommendations, §8.1 replaces every "needs Dino" ask with a documented default, and the two design conflicts (**D-FIELD**, **D-VOCAB**) are resolved as R1 and R2.

**The shape of the run changed with those decisions.** The build is no longer sequenced behind a round of questions to Dino: it is built, pushed to the Vercel **production** deployment (still `noindex`/`nofollow`), and Dino reviews and iterates there. Only the **cutover** — dropping `noindex`, pointing `thehokutengroup.com`, and the 301 — waits on the paperwork gates in §6.1.

### 0.4 Which build ships — **RESOLVED** (L13 · X0 · D15)

**`site/` — the Next.js app in this repo, Theme G — ships as production.** Razim, as build owner, decided this on 2026-08-17. It is not an open question and it is not an ask to Dino; Dino reviews the production URL and iterates from there.

What that supersedes, kept here as the record of what was overridden:

> `V2` §1 line 7 — *"Use the current kwc-dinomonteverde.com website as the production design and functionality base. Keep its general layout, visual style, calculator, navigation, and user flow."*
> `V2` §1 line 9 — *"Razim's separate hokuten.vercel.app build is reference material only. It is not the production base and must remain noindex and unlinked."*
> `V2` §11 line 137 — *"Duplicate the current KWC project into a private Hokuten preview."* `HANDOFF-02` likewise instructs editing "the consent-aware configuration block near the end of index.html" — an HTML-pack instruction, not a Next.js one.

Both `V2` lines are recorded as **superseded by Razim's decision of 2026-08-17**, written into PROJECT-MEMORY in P13 alongside the `HANDOFF-02` note that its `index.html` instructions are translated to their Next.js equivalents (§5). The **noindex** half of `V2` §1 line 9 survives the supersession and stays in force until the cutover gate clears (§6.4) — what changed is which codebase is production, not when the site becomes public.

Every portion in §7 and all of WHATS-LEFT §A read on this premise, so nothing below it is conditional any more.

---

## 1. Decisions locked

| Id | Decision | Source | Status |
|---|---|---|---|
| **L1** | **Theme G is the production theme.** Theme B is parked: its `[data-theme="blue"]` block, `THEME_PRESENTATION.blue`, and every `IS_BLUE` branch stay in code but are unreachable — `lib/theme.ts` `DEFAULT_THEME` stays `"gold"`, no user-facing switch is added, and the `theme-blue` branch stops being fast-forwarded. **No deletion in this pass.** | Razim, 2026-08-17 (A1) | `approved` |
| **L2** | **Palette = Brand Design Guide v1.3 tokens verbatim**, with derived tokens recomputed to AA and recorded in `docs/design/CONTRAST.md`. `--gold #B08D3F`, `--gold-dim #C8A552`, dark-field ink `#F5F1E8` / `#D0C9BC`, light-field ink `#1A1C1F`, paper `#FBF9F3`, ivory `#F4EFE3`, cream `#EDE7D8`, charcoal `#1A1C1F` (pixel-sampled from the kit's `*_on_Charcoal.png` lockups). **This supersedes the "website gold `#B8902E`" guardrail** in `CLAUDE.md` and PROJECT-MEMORY §3. Kit gold `#B8943D` stays inside rasters. | `GUIDE` lines 19–21; Razim instructed that the site colour match Dino's brand kit (team chat, 2026-08-16 23:26); **approved by Razim 2026-08-17 as R3 Option 1**; corroborated by `MANUAL` §13 line 679, which independently prints Hokuten Gold `#B08D3F` | `approved` — Razim took R3 Option 1 with the override understood: it changes a `CLAUDE.md` hard guardrail, and the source analysis reached the opposite conclusion (finding 01 §B: *"the website's gold is `#B8902E`"*, calling `#B08D3F` "stale, aspirational, or describing a different launch package"). The supersession of the `#B8902E` guardrail is therefore **approved**, and `CLAUDE.md`'s gold line plus the dated PROJECT-MEMORY entry are written in **P13** before the push |
| **L3** | **Type = Cormorant Garamond (display) / Inter (body) / JetBrains Mono (labels & data)** via `next/font/google`, replacing Fraunces and IBM Plex Mono. Ramp retuned for Cormorant; mono labels uppercase, tracked 0.18–0.32em; the italic gold tail becomes a reusable display utility. | `GUIDE` lines 10–16; **independently corroborated by the kwc port source** (`~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html` declares `--serif: 'Cormorant Garamond'…`, `--sans: 'Inter'…`, `--mono: 'JetBrains Mono'…` — the same three faces, so this is not a new system, it is the kwc lineage the guide describes); **approved by Razim 2026-08-17 as R13** | `approved` — it **overturns an approved standing decision** (PROJECT-MEMORY 2026-08-10, Revisit 2: "Typography keeps Fraunces/Inter/IBM Plex Mono…") and a design-skill non-negotiable (`SKILL.md:74`). Both supersessions are **approved** and are written in **P13** (F32); without them the skill's own `audit` verb flags the shipped faces P0 and the definition of done cannot be met |
| **L4** | **Logo rule.** The square STACKED badge is the client-facing mark. `GUIDE` line 35 is explicit that the LINEAR lockup is *"variety only — internal papers or tight horizontal strips where the badge cannot fit. **Never primary on client-facing work.**"* The authorisation for a linear header is therefore **not** the guide but `V2` §1 line 8, which orders the linear KW Commercial / Hokuten lockup in the navigation bar and a **white** bar behind it because that lockup carries dark lettering. Resolution: **linear in the sticky header, sourced from the 3600×1022 linear master** (today's header derivative is a 1.33-aspect *stacked* crop — §2.4, A2); **stacked** in the menu overlay, the Trust identity anchor and the footer; **stacked** on the OG card; **Hanko/glyph** on favicon and apple-touch (a lockup is illegible at 16px — the favicon is out of the stacked/linear question entirely). A real-text brand line stays adjacent (visually-hidden acceptable) per D1. Footer keeps exactly ONE KW Commercial compliance mark. | `GUIDE` lines 34–36; `V2` §1 line 8; `CLAUDE.md` D1 (2026-08-08) | `approved` — the nav **surface** is decided as **R14 Option 2**: dark bar + the on-charcoal linear lockup, recorded as a deviation from `V2` §1 line 8 (§2.4) |
| **L5** | **Dino's content decisions govern copy and the order of the sections he names.** Named order: Hero+Trust → Closed Deals → Active Listings → Valuation Calculator → Process Timeline → BOV/Contact → Team → A100 Arms. The site's unnamed sections (brand rail, Doors, Mandates, FAQ) keep their place relative to the nearest named section. Exact final order in §3.2. | `FINAL` "SECTION ORDER (EXACT SEQUENCE)"; A6 | `approved` |
| **L6** | **Awards per Claims Register v1.1.** Four dated INDIVIDUAL awards — 2025 Annual Top Broker; Quarterly Deals Q3 2025, Q1 2026, Q2 2026 — plus **2025 Annual Top Firm as prior-firm/TEAM recognition only, in its own block, after the individual strip, never merged, never counted as an individual award. Never "5×". Never "Annual 2026."** Badge artwork is used unmodified (no crop, recolor, redraw, combine). Caption wording changes in the register first. | `V2` §2/§3; `KIT` finish list; `HANDOFF-03`; `EDITS` banner | `approved` |
| **L7** | **Deals scrub.** Zero occurrences of Sarhan / Mheni / Schulman in shipped copy. Keep all six closing cards' facts unchanged. **William Betancourt's credits stay.** Both case-study credit lines read `Deal team: Dino Monteverde · William Betancourt`. Provenance fine print under Recent Closings, verbatim: *"Selected transactions completed by Dino Monteverde, 2022–2026, including transactions completed at prior affiliations."* | `EDITS` §8.1–8.4 (explicitly STILL CONTROLLING) | `approved` |
| **L8** | **Active-listing allowlist is exactly three:** The Florida Gateway (Yulee, FL) · Quality Suites Houston NW Cy-Fair · Pocono Mountain Hotel & Spa. **No other feed record may render.** **Render contract:** `content/listings.ts` stays the rendered source of truth; `/api/public-listings` is the additive same-origin proxy with a 3-ID allowlist and a public-field whitelist, and a fourth record from the source feed is dropped, logged, and never rendered. Introducing the a100 feed at all **supersedes** PROJECT-MEMORY 2026-08-07 ("Phase 1 listings/closed/content = static… Later phases integrate the a100arms.com API") — that supersession is written in F33. | `V2` §2 bullets 6–7 | `approved` |
| **L9** | **Cutover gates (all three still open as of the newest source doc).** (1) Forward Wilshire files "The Hokuten Group" as a fictitious business name with DRE. (2) Broker email approving the name **and** the Managing Director title. (3) DRE/licence numbers for William and Razim before either is named on first-point-of-contact marketing. **These gate the cutover only** (§6.4) — `noindex` removal, the `thehokutengroup.com` DNS change and the 301. They do **not** gate the build or the push to the production deployment (L15). | `EDITS` go-live gates; `KIT` finish list; `V2` §2/§11; `CLAUDE.md` hard guardrail (paperwork gate) | `blocked: cutover gate` |
| **L10** | **Calculator math, defaults, and cap-rate `CONFIG` stay frozen.** `site/lib/valuation.test.ts` (1,445 lines, golden-parity) must stay green and untouched. | `CLAUDE.md` hard guardrail; `V2` §1 "keep its calculator" | `approved` |
| **L11** | **Deployment: GitHub → Vercel only.** Never CLI-deploy. Local Vercel CLI is config-only, `--scope hokuten1`, project `hokuten`. Preview stays noindex, nofollow, unlinked. | `CLAUDE.md`; `V2` §11 | `approved` |
| **L12** | **Forbidden descriptor:** the team is a *hotel brokerage and advisory team*. **Never "hotel investment platform."** No public market-data claim beyond formula-only/hypothetical unless separately cleared in writing. | `MANUAL` §13 line 677; §10 lines 542, 552–555 | `approved` |
| **L13** | **Precedence rule: Dino's newest document supersedes the older ones.** Verified chronology (WhatsApp screenshot timestamps + zip file stamps): `FINAL` sent 2026-08-16 23:15 → the `RAZIM HANDOFF` zip (`V2`, `HANDOFF-02`, `HANDOFF-03`, files stamped 2026-08-16 23:26) sent 23:44 → `KIT` later that night, dated 2026-08-17. **For the website: `V2` > `FINAL` > `EDITS` > `ADDON` README.** Where `V2` is silent, the next-newest speaks — section order comes from `FINAL` (L5) because `V2` never states one. `KIT` governs the non-website finish list and the gates and itself defers to `V2` for the site. **`GUIDE` v1.3 governs design over all of them**, by its own rule. This rule is what resolves X0 and X1 without a round-trip to Dino. | Razim, 2026-08-17 (precedence rule); chronology verified against the WhatsApp screenshot and the delivered zip timestamps (team chat, 2026-08-16 23:15 / 23:44) | `approved` |
| **L14** | **Opus 5 only.** Builders **and** reviewers are Opus 5, and the orchestrating main loop is Opus 5. **No Sonnet subagents, no Haiku subagents, no Fable subagents.** The four `/implement-plan` guardrails stay in force unchanged: launch approval per wave · no main-loop fallback · ~7-minute per-model usage telemetry · file-based handoff under `.tmp/delegation/<run>/`. Recovery ladder is respawn-at-Opus → second Opus attempt → pause and report options. | Razim, 2026-08-17; `~/.claude/skills/implement-plan/SKILL.md` (its "Sonnet builds" default is overridden for this run) | `approved` |
| **L15** | **Push to production now; cutover is the gated step.** No pre-build questions go to Dino: every open ask carries a documented default (§8.1), the site is built and pushed to `main` → the Vercel **production** deployment at `hokuten.vercel.app` (still `noindex`, `nofollow`), and Dino reviews and iterates **there**. "Push to production" is a normal portion boundary (§6.3). **The one thing that stays gated is the cutover** — removing `noindex`, pointing `thehokutengroup.com`, and the 301 from `kwc-dinomonteverde.com` — which waits on L9/G1–G8 (§6.4). Razim did not lift that guardrail and this document does not either. | Razim, 2026-08-17; `CLAUDE.md` hard guardrail ("Do not deploy publicly under the Hokuten name until the KW / Forward Wilshire paperwork gate clears") | `approved` |

### 1.1 D-FIELD — dark field vs. the approved chassis · **RESOLVED (R1: Alternative A)**

**The conflict.** **Two** independent sources — not one — order a dark field:

> `GUIDE` line 24: *"DARK field — near-black charcoal, ivory text, gold accents: the website and the offering memoranda… Nothing else in the company goes dark."*
> `V2` §1 line 8: *"Use the dark Hokuten system across the home page, marketplace, privacy page, and SMS terms: charcoal/black backgrounds, ivory text, restrained gold accents. Keep the white navigation bar because the approved linear KW Commercial / Hokuten lockup contains dark lettering."*

The second is from the master launch directive, names four routes, and adds a nav requirement the site does not meet. The site as approved and shipped is a **paper-first chassis with dark chapters**: `--paper #f7f4ed` is the page ground (`globals.css:240`), `.surface-dark` / `.surface-black` carry the hero (`--hero-ground: #000000`, `globals.css:261`) and selected chapters — and its nav resolves to `surface-dark` whenever the hero surface is black (`components/sections/SiteNav.tsx:282`), the opposite of the white bar `V2` mandates.

**Decision — Alternative A (keep the chassis, retune every token).** Approved by Razim, 2026-08-17 (R1). Keep the approved Theme G chassis exactly as Revisits 1–3 built it — paper page, dark hero, dark chapters — and retune every token to the guide's exact values (§2.1). Both fields the guide names are already present on the page; what changes is that they now use the guide's hexes instead of the site's older ones.

Rationale, in order of weight — **stated against the stronger evidence above, not around it**:
1. Both fields the guide names are already on the page: the hero and selected chapters are the dark system, the connective tissue is light. `V2` line 8's *reason* for the dark system (charcoal grounds, ivory text, restrained gold) is satisfied on the surfaces that carry the argument; what Alternative A declines is inverting the connective tissue.
2. Dino saw the yellow-theme screenshots (team chat, 2026-08-16 evening) and objected to *the specific gold*, not to the field. The correction he asked for is a colour, and §2.1 delivers it exactly.
3. Three approved design revisits (`docs/DESIGN-REVISIT.md`, `-2`, `-3`) built and measured this chassis, including the one-screen panel budgets and the D29 overflow gate. A field inversion re-opens every one of those measurements.
4. Dino asked Razim to go live (team chat, 2026-08-17 morning). A full inversion is not a launch-week change.
5. The guide itself says to match "the website preview in the launch package and the existing offering memoranda" — the built references. Razim's built reference *is* this site.

**Recording the deviation is mandatory.** With A chosen, `V2` §1 line 8 is a *deviation from a locked master directive*, not a resolved conflict. Per L15 it is **not** an ask to Dino: it is written into PROJECT-MEMORY (P13) as a dated deviation naming all four routes, and Dino sees the result on the production URL and iterates.

**Alternative B — full dark field (not taken; sized here so it can be scheduled as a post-launch revisit).** Scope: invert `.surface-paper`/`.surface-deep`/`.surface-card` bindings site-wide; re-derive every light-field contrast pair (~40 pairs in `CONTRAST.md`); regenerate every raster in `site/public/` whose ground is paper (8 generator scripts, §2.5 P7); re-check the franchise-chip rail, which is a **measured constraint** pinned to a light band because the supplied chips carry baked shadows (`DESIGN-REVISIT-3.md` D25); re-check money-green and brick-error tokens on dark; re-shoot the artwork ramp (`--art-light`/`--art-ground`); re-run panel-fit and overflow gates at five widths. Estimate: a full revisit wave, not a portion of this one.

**Navigation surface — decided (R14, Option 2).** `V2` line 8 requires a **white** nav bar so the dark lettering inside the linear lockup stays legible; today `SiteNav` resolves to `surface-dark` over a dark hero and carries a theme-matched gold mark. The three candidates were:
1. **White bar + linear-on-white lockup** (`KW_Commercial_Linear_…_on_White.png`) — follows `V2` literally; costs the nav's transparency over the black hero.
2. **Dark bar + linear-on-charcoal lockup** (`KW_Commercial_Linear_TheHokutenGroup_Gold_on_Charcoal.png`, via a prepared derivative) — keeps today's chassis and solves the legibility problem `V2` was actually worried about; a stated deviation from `V2` line 8.
3. Dark bar + the current gold derivative — **not defensible**: it is the deviation *and* keeps a stacked-proportion crop in a linear slot (A2).

**Decision: Option 2** (Razim, 2026-08-17). The on-charcoal linear master is prepared into the header derivative in P3, and the deviation from `V2` §1 line 8 is logged in PROJECT-MEMORY (P13) with the legibility rationale. Dino sees it on production.

### 1.2 D-VOCAB — guide vocabulary vs. approved D4 component law · **RESOLVED (R2)**

**The conflict.** `GUIDE` lines 27–32 mandate: *"Hairline rules and outlined boxes — never filled buttons, never rounded card grids, never drop shadows."* Two Razim-approved decisions collide with it:

| Approved law | Guide requirement | Collision |
|---|---|---|
| D4 deal tickets — perforation/notch chassis with a resting shadow (`components/cards/Ticket.tsx`, `CardShell.tsx`) | "never rounded card grids, never drop shadows" | Resting shadow + ticket radii |
| Filled gold CTA pill (`content/nav.ts:73-76` `navCta`, hero primary CTA) | "never filled buttons" | Filled primary button |

**Decision (Razim, 2026-08-17 — adopted exactly as recommended):**

| Move | Action |
|---|---|
| Gold mono kicker + thin gold rule above a Cormorant headline | **Adopt.** `SectionHeader.tsx` + `MicroLabel.tsx` gain a 1px `--accent` rule under the kicker. |
| Italic gold tail closing a display line | **Adopt.** New `.display-tail` utility (§2.2). Applied to the hero `h1` and to every section headline that has a natural tail. |
| Stat tiles: thin gold rule on top / mono caps label / Cormorant number beneath | **Adopt.** `StatNumeral.tsx` + `StatsSection.tsx`. |
| Two-digit gold numerals (01, 02, 03) with a short bold lead + one supporting sentence | **Adopt** in `#method` (already 01–05) and `MicroLabel`'s index device. |
| One idea per screen, wide margins, left-aligned, nothing centred except a closing line | **Already true** — the twelve-screen chassis is exactly this. No change. |
| "Never filled buttons" | **Adopt with a carve-out.** Primary CTAs become **hairline-outlined gold** (1px `--accent` border, transparent ground, `--accent-text` label, gold ground only on hover/active). This is the guide's own outlined-box language and is a small, reversible change. |
| "Never drop shadows" | **Adopt.** Ticket resting `box-shadow` drops to a 1px hairline; hover/focus elevation becomes a hairline colour shift, not a shadow. Perforation/notch geometry — the thing that makes a ticket read as a ticket — **stays**. |
| "Never rounded card grids" | **Adopt with a floor.** Radii minimised toward 0; keep only the ≤2px radius the ticket notch geometry needs to render cleanly. |

All three carve-outs are approved as written: outlined primary CTAs · ticket resting shadow → hairline with the perforation/notch geometry intact · radii ≤2px. Built in **P4**.

---

## 2. Brand system translation

### 2.1 Token table — current → new

Nearly every hex on the site lives in `site/app/globals.css` lines 170–288. **Three verified exceptions the palette swap must also reach**, all outside that range: the eight generator scripts (§2.5 F12–F14); `site/lib/theme.ts:88` `themeColor: "#16181B"` — the retired Theme-G charcoal, consumed by `app/layout.tsx`'s `viewport.themeColor`, so browser chrome would keep the old value after the swap (`:107` carries Theme B's `#F7F8F5` and stays parked); and `globals.css:917-922`, six hexes in the print block. Contrast values below are computed WCAG 2.1 ratios against the **new** grounds; all must be re-produced by `docs/design/contrast.mjs` and pasted into `docs/design/CONTRAST.md` before the portion is accepted.

#### Shared neutrals (`:root`)

| Token | Current (file:line) | New | Source | Contrast note |
|---|---|---|---|---|
| `--ink` | `#1a1c1f` — `globals.css:170` | `#1A1C1F` (unchanged) | `GUIDE` "ink on light" | 16.22:1 on new paper · 14.88 on ivory · 13.84 on cream — PASS. The guide's light-field ink and the sampled lockup charcoal are the same value; this token already matches the guide exactly. |
| `--ink-muted` | `#4a4d52` — `:171` | `#4a4d52` (unchanged) | site-derived | 8.06:1 on new paper — PASS |
| `--meta` | `#6e6862` — `:172` | `#6e6862` (unchanged) | site-derived | 5.22:1 on new paper (was 5.01 on old paper) · 4.79 on new `--surface-deep` — PASS |
| `--meta-soft` | `#8b8680` — `:173` | unchanged | site-derived | DECORATIVE ONLY — never text. Re-verify it still fails, so nobody promotes it. |
| `--card` | `#ffffff` — `:174` | `#FFFFFF` (unchanged) | — | — |
| `--black` | `#000000` — `:175` | unchanged | — | — |
| `--brick` | `#a33b2c` — `:176` | unchanged | site-derived | 6.20:1 on new paper — PASS. `GUIDE` line 22: "Red appears only to mark an unverified or failing status item" — form errors qualify; no other red anywhere. |
| **NEW** `--ink-dark-field` | *(does not exist — dark scopes derive from `--paper`)* | `#F5F1E8` | `GUIDE` line 20 `--ink` | 15.15:1 on `--dark` · 18.63 on black — PASS |
| **NEW** `--ink-dark-muted` | *(does not exist)* | `#D0C9BC` | `GUIDE` line 20 `--ink-muted` | 10.38:1 on `--dark` · 12.76 on black — PASS |
| `--money-on-light` | `#1f6a4a` — `:188` | unchanged | site-derived | 6.20:1 on new paper — PASS |
| `--money-on-dark` | `#58a66e` — `:189` | unchanged | site-derived | 5.77:1 on new `--dark` · 7.09 on black — PASS |

> **Naming collision to respect.** The guide calls its *dark-field* ink `--ink`; the site's `--ink` is the *light-field* ink. Do **not** rename the site token — it already equals the guide's "ink on light" value. Introduce the two new `--ink-dark-*` tokens instead and bind them in the dark scopes (§2.1.3).

#### Theme G accent + fields (`:root, [data-theme="gold"]`, `globals.css:238-263`)

| Token | Current (line) | New | Source | Contrast / what to recompute |
|---|---|---|---|---|
| `--paper` | `#f7f4ed` (`:240`) | `#FBF9F3` | `GUIDE` paper | Page ground. Re-run every `*-on-paper` pair. |
| `--surface-deep` | `#efe9da` (`:241`) | `#F4EFE3` | `GUIDE` ivory | **Watch:** the new paper→deep step is subtler than today's. If the deep band reads flat in review, cream `#EDE7D8` is the only in-family alternative — but **it is not a drop-in**: `--meta` `#6e6862` lands at **4.46:1** on cream (below the AA floor) and `--accent-ink` `#7E652D` at exactly **4.50:1** (zero headroom). Taking that option requires re-deriving `--meta` for that ground first and recording it in `CONTRAST.md`. Never invent a hex outside the guide family without a recorded derivation. |
| `--rule` | `#e2dccc` (`:242`) | `#EDE7D8` | `GUIDE` cream | Hairline only, non-text. |
| `--dark` | `#16181b` (`:243`) | `#1A1C1F` | Pixel-sampled from **both** `KW_Commercial_*_on_Charcoal.png` files (Stacked + Linear), exact | The dark chapter ground and the charcoal the lockups are cut against — they now match exactly, which is why the on-Charcoal lockup variants will sit seamlessly. |
| `--accent` | `#b8902e` (`:247`) | `#B08D3F` | `GUIDE` line 19 | 5.47:1 on `--dark`, 6.73 on black. **FAILS as text on light (2.96 on paper)** — same failure mode the current token has; that is what `--accent-ink` exists for. |
| `--accent-dim` | `#c9a04a` (`:248`) | `#C8A552` | `GUIDE` line 19 `--gold-dim` | 7.29:1 on `--dark` · 8.96 on black — PASS |
| `--accent-deep` | `#816520` (`:249`) | `#675325` | **Derived** — `#B08D3F` hue/sat held, lightness dropped to 7:1 on paper | 7.02:1 on paper. Dense art strokes, pressed states. |
| `--accent-ink` | `#816520` (`:250`) | `#7E652D` | **Derived** — `#B08D3F` hue/sat held, darkened to the AA floor on the worst light ground | 5.27 paper · 4.83 ivory · **4.50 cream** · 5.55 card — PASS on all four. This is the accent-as-text-on-light token. |
| `--accent-on-dark` | `#b8902e` (`:251`) | `#B08D3F` | = `--accent` | 5.47:1 on `--dark` · 6.73 on black — PASS as text. No separate lightened value needed. |
| `--accent-wash` | `#e2dccc` (`:252`) | `#EDE7D8` | `GUIDE` cream | Decorative fill. |
| `--accent-chip` | `#efe9da` (`:253`) | `#F4EFE3` | `GUIDE` ivory | Decorative fill. |
| `--on-accent` | `#16181b` (`:254`) | `#1A1C1F` | = `--dark` | 5.47:1 on an `--accent` fill — PASS. (Paper-on-gold is 2.96 — **never** put light text on a gold fill.) |
| `--art-ink` | `#b8902e` (`:256`) | `#B08D3F` | = `--accent` | Regenerate every raster (§2.5 P7). |
| `--art-mid` | `#c9a04a` (`:257`) | `#C8A552` | = `--accent-dim` | Regenerate. |
| `--art-light` | `#f7f4ed` (`:258`) | `#FBF9F3` | = `--paper` | Regenerate. |
| `--art-ground` | `#000000` (`:259`) | unchanged | — | — |
| `--hero-ground` | `#000000` (`:261`) | unchanged | — | — |
| `--hero-fg` | `#f7f4ed` (`:262`) | `#F5F1E8` | `GUIDE` dark-field ink | 18.63:1 on black — PASS |

#### Surface-scope rebinding (`globals.css:290-363`)

`.surface-dark` and `.surface-black` currently derive their foreground from `--paper` by `color-mix`. Rebind them to the guide's dark-field values:

| Scope var | Current | New | Ratio |
|---|---|---|---|
| `.surface-dark --fg` | `var(--paper)` | `var(--ink-dark-field)` `#F5F1E8` | 15.15:1 |
| `.surface-dark --fg-muted` | `color-mix(… --paper 64%, --dark)` | `var(--ink-dark-muted)` `#D0C9BC` | 10.38:1 |
| `.surface-dark --fg-meta` | `color-mix(… --paper 52%, --dark)` | `color-mix(in srgb, var(--ink-dark-field) 52%, var(--dark))` → `#8C8B88` | 5.01:1 — PASS |
| `.surface-dark --hairline` | `color-mix(… --paper 14%, transparent)` | `color-mix(in srgb, var(--ink-dark-field) 14%, transparent)` | decorative |
| `.surface-dark --field` | `color-mix(… --paper 7%, --dark)` | `color-mix(in srgb, var(--ink-dark-field) 7%, var(--dark))` → `#292B2D` | field ground |
| `.surface-black` | same four rules against `--black` | same substitution | `--fg-meta` → `#7F7D79`, 5.11:1 — PASS |

Light scopes (`.surface-paper`, `.surface-deep`, `.surface-card`) need **no** structural change — they already read `--ink` / `--ink-muted` / `--meta` / `--accent-ink`, all of which pass against **paper, ivory and card**. They do **not** all pass against cream; see the `--surface-deep` row.

#### Theme B (parked)

`[data-theme="blue"]` (`globals.css:266-288`) is **not retuned**. Leave the block byte-identical and add a one-line comment: *"PARKED 2026-08-17 (L1). Unreachable — `DEFAULT_THEME` is gold and no switch exists. Not retuned to Brand Guide v1.3."* Same note in `lib/theme.ts` above `THEME_PRESENTATION.blue`.

#### Recompute procedure (binding)

1. Edit the hardcoded constants in `docs/design/contrast.mjs` to match the new hexes exactly (the script keeps its own copies — they must be edited in sync or the transcript lies).
2. `node docs/design/contrast.mjs` from repo root.
3. Paste the full transcript into `docs/design/CONTRAST.md`, replacing the previous one, and add a dated header line naming Brand Guide v1.3 as the source.
4. Any pair that FAILs is fixed by deriving a new token the documented way — same hue and saturation, lightness moved until ≥4.5:1 (≥3:1 for large text/UI) — and the derivation is recorded in CONTRAST.md's "token decisions" section. **No FAIL ships.**

### 2.2 Typography

#### Faces (`site/app/layout.tsx:1-89`)

| Role | Current | New | CSS var |
|---|---|---|---|
| Display | `Fraunces` with `axes: ["opsz"]` (`layout.tsx:70-76`) | `Cormorant_Garamond` | `--font-cormorant` |
| Body | `Inter` (`:78-82`) | `Inter` — unchanged | `--font-inter` |
| Mono | `IBM_Plex_Mono`, `weight: ["400","500"]` (`:84-89`) | `JetBrains_Mono` | `--font-jetbrains` |

**Verified against this repo's installed `next@16.3.0`** (`node_modules/next/dist/compiled/@next/font/dist/google/font-data.json`):

- `Cormorant Garamond` — weights `300,400,500,600,700,variable`; styles `normal,italic`; **axes: `wght` only (300–700). There is no `opsz` axis.** The `axes: ["opsz"]` line **must be deleted** or the build throws.
- `JetBrains Mono` — weights `100…800,variable`; styles `normal,italic`; axis `wght` only.

Target config (2 font files per family, which is what ref-05's perf gate requires):

```ts
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],   // italic is load-bearing: the gold tail
  display: "swap",
  variable: "--font-cormorant",
});                               // omit `weight` → variable font, 2 files

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});                               // omit `weight` → variable font, 1 file
```

Fallback: if `next/font` refuses the variable form for either family, pin `weight: ["300","400"]` (Cormorant) / `weight: ["400","500"]` (JetBrains), accept 4 + 2 files, and record the ref-05 exception in `PLACEHOLDERS.md`. Update the `<html className>` join at `layout.tsx:177` to the new variable names.

`globals.css:21-23` becomes:

```css
--font-display: var(--font-cormorant), Georgia, "Times New Roman", serif;
--font-sans: var(--font-inter), Arial, Helvetica, sans-serif;
--font-mono: var(--font-jetbrains), ui-monospace, SFMono-Regular, Menlo, monospace;
```

Georgia stays as Cormorant's declared fallback — the guide relies on that declaration to justify the Word-document substitution, so it must not be dropped.

#### Ramp retune, step by step

Cormorant Garamond has a **smaller x-height, narrower set-width, and lighter default colour** than Fraunces. Two consequences: display steps must go **up**, and Cormorant must **never** carry body copy. `globals.css:27-39` carries a standing D8 warning that `--text-display0`'s ceiling is bound to the hero headline's exact character count in `heroContent.ts` — a font swap invalidates that measurement. **Re-measure, do not guess.**

| Step | Current | Retune direction | Guidance |
|---|---|---|---|
| `--text-display0` (hero h1, one element per page) | `clamp(2.75rem, 1.4rem + 4.6vw, 4.75rem)` / lh `0.98` / ls `-0.03em` | **Raise the ceiling ~10–15%; loosen line-height; relax tracking** | Start `clamp(3rem, 1.5rem + 5vw, 5.5rem)`, lh `1.05`, ls `-0.015em`. Cormorant Light at display size wants air, not the tight optical set Fraunces took. Then **measure the hero at 1440×900 and 1920×1080** — it must still land on exactly one usable screen (`100svh − nav − ticker`) per D25. If the headline wraps past two lines, drop the ceiling, never the leading. |
| `--text-display1` (section headlines) | `clamp(2.5rem, 1.2rem + 5.6vw, 6rem)` / lh `1.02` / ls `-0.02em` | Raise floor, keep ceiling, loosen | `clamp(2.75rem, 1.3rem + 5.6vw, 6rem)`, lh `1.08`, ls `-0.01em`. Weight 300. |
| `--text-display2` | `clamp(2rem, 1.25rem + 3.2vw, 3.5rem)` / lh `1.06` | Raise slightly, loosen | `clamp(2.125rem, 1.3rem + 3.3vw, 3.75rem)`, lh `1.12`, ls `-0.01em`. |
| `--text-heading` | `clamp(1.375rem, 1.2rem + 0.75vw, 1.75rem)` / lh `1.2` | **Raise a step and use weight 400+** | `clamp(1.5rem, 1.25rem + 0.9vw, 1.9rem)`, lh `1.25`. At this size Cormorant 300 goes thin — the base `h1–h4 { font-weight: 300 }` rule at `globals.css:455-462` must become **weight 300 for display0–display2 only; 400 at `--text-heading` and below.** |
| `--text-body-lg` / `--text-body` / `--text-data` | Inter — unchanged | **No change** | The guide is explicit: Cormorant is display only, "never use it for body copy at small sizes; it goes thin and disappears." |
| `--text-micro` | `0.6875rem` / ls `0.14em` | **Tracking up** | Size unchanged. Letter-spacing → `0.18em` (the guide's floor). |
| `--tracking-micro` | `0.14em` | `0.18em` | Guide floor for mono labels. |
| **NEW** `--tracking-label` | — | `0.24em` | The common kicker/eyebrow value; matches the outreach kit's measured 0.20–0.26em range. |
| **NEW** `--tracking-wide` | — | `0.32em` | Guide ceiling. Compliance microtype, footer labels. |
| `--tracking-brand` | `0.35em` | unchanged | Tracked-caps brand line, headers/footers only. Above the guide's label range by design — it is a wordmark, not a label. |

**Mono law (JetBrains Mono):** every letterspaced label — kickers, eyebrows, stat labels, footers, compliance microtype, chip text, deal-data lines — is JetBrains Mono, **always uppercase, always tracked 0.18–0.32em.** The guide names substituting a spaced sans here as "the single most common way a deliverable drifts off-brand." Audit target: no `--font-sans` on any uppercase tracked label.

#### The italic gold tail utility

`GUIDE` line 14: *"the last phrase of a display line set in Cormorant ITALIC and in gold ('Quality Suites Cy-Fair.')."* Today the site italicises **one accent word mid-sentence** (e.g. `heroContent.ts:96-100`). The guide's move is the **trailing phrase**.

```css
/* globals.css §5 — the signature display move. Cormorant italic + accent,
   on the LAST phrase of a display line. One per headline, never mid-clause. */
.display-tail {
  font-style: italic;
  color: var(--accent-text);   /* resolves per surface: --accent-ink on light,
                                  --accent-on-dark on dark. Never raw --accent. */
}
```

Applied to: the hero `h1` and every section headline that has a natural tail (§3.2 lists which do). Headlines whose accent genuinely sits mid-sentence keep the existing mid-word italic — do not force a tail where the sentence has none.

### 2.3 Vocabulary → component mapping

| Guide move | Component / file | What changes | Why |
|---|---|---|---|
| Gold mono kicker + thin gold rule above a Cormorant headline | `components/atoms/SectionHeader.tsx`, `components/atoms/MicroLabel.tsx` | Kicker → JetBrains Mono uppercase at `--tracking-label`, colour `--accent-text`; add a 1px `--accent-text` rule between kicker and headline, inset to the text column | `GUIDE` line 27 |
| Italic gold tail | `heroContent.ts` + every `SectionHeader` headline | `.display-tail` on the trailing phrase | `GUIDE` line 14, 28 |
| Stat tiles: thin gold rule on top / mono caps label / Cormorant number | `components/atoms/StatNumeral.tsx`, `components/sections/StatsSection.tsx` | Add a top hairline in `--accent-text`; label → mono caps `--tracking-label`; numeral → Cormorant (already display face) | `GUIDE` line 30 |
| Two-digit gold numerals with a bold lead + one supporting sentence | `components/sections/MethodSection.tsx`, `MicroLabel.tsx` | Step numerals `01`–`05` render large, Cormorant, `--accent-text` | `GUIDE` line 32 |
| Hairline rules and outlined boxes | `components/ui/button.tsx`, `content/nav.ts` `navCta`, `Hero.tsx` CTAs | Primary CTA → 1px `--accent` outline, transparent ground, `--accent-text` label; gold ground only on hover/active (**D-VOCAB carve-out**) | `GUIDE` line 29 |
| Never drop shadows | `components/cards/Ticket.tsx`, `CardShell.tsx`; `globals.css:79-90` shadow tokens | Resting `box-shadow` → 1px hairline; hover/focus elevation → hairline colour shift (**D-VOCAB**) | `GUIDE` line 29 |
| Never rounded card grids | `globals.css:74-76` radii | Radii minimised toward 0; keep only the ≤2px the ticket notch needs (**D-VOCAB**) | `GUIDE` line 29 |
| One idea per screen, wide margins, left-aligned | `app/page.tsx` twelve-screen chassis | **No change** — already compliant | `GUIDE` line 31 |
| Gold is the only accent; red only for failing status | `globals.css` `--brick` | **No change** — brick is form-error only; verify no other red renders | `GUIDE` line 22 |
| Perforation / notch ticket chassis | `Ticket.tsx` | **Stays.** It is the D4-approved identity of the deal card; only shadow and radius change. | Razim D4 |
| Franchise-chip rail on a light band | `BrandsSection.tsx` | **Stays.** Measured constraint — the supplied chips carry baked shadows. Do not revisit. | `DESIGN-REVISIT-3.md` D25 |
| Hero slideshow, chromeless, automatic | `HeroSlideshow.tsx` | **Stays** (D24) | `DESIGN-REVISIT-3.md` |
| No internal scrolling; one screen per panel | all sections | **Stays** (D28) — re-measure after the type swap, since Cormorant changes every headline's height | `DESIGN-REVISIT-3.md` |

### 2.4 Logo usage per surface

Masters (all read-only; export copies into `site/public/`). **Per R17/P17 the two lockup PNGs the build consumes are also copied into tracked `Ref/brand-kit/`**, so `identity-prep.ts` reads from `Ref/` rather than from the gitignored `full-brand-toolkit/`:

| Master | Path | Dims |
|---|---|---|
| Stacked, transparent | `full-brand-toolkit/The_Hokuten_Group_Brand_Addon_2/01_Logo_Lockups/KW_Commercial_Stacked_TheHokutenGroup_Gold_Transparent.png` | 2400×1836 |
| Stacked, on charcoal | `…/KW_Commercial_Stacked_TheHokutenGroup_Gold_on_Charcoal.png` | 2692×2128 |
| Stacked, on white | `…/KW_Commercial_Stacked_TheHokutenGroup_Gold_on_White.png` | 2692×2128 |
| Linear, transparent | `…/KW_Commercial_Linear_TheHokutenGroup_Gold_Transparent.png` | 3600×1022 |
| Linear, on charcoal | `…/KW_Commercial_Linear_TheHokutenGroup_Gold_on_Charcoal.png` | 3762×1184 |
| Theme-G identity master | `Ref/site/logo-yellow.jpg` | 917×758 |

> `01_Logo_Lockups/` holds **8 PNGs + 2 SVGs**, not ten PNGs. The two `.svg` lockups are **raster-embed wrappers** — a base64 PNG inside an `<svg>` shell, zero `fill=`/`stop-color=` attributes. There is **no vector logo anywhere in the corpus.** Treat them as PNGs; never attempt to recolour them. All eight PNGs pixel-sample to `#B8943D`; the `*_on_Ivory.png` ground samples to `#E2DCCC` — the site's *current* `--rule`/`--accent-wash`, not the guide's ivory `#F4EFE3`, which matters if an on-ivory lockup is ever placed on `--surface-deep`.
> **Deployment gate (G4).** The `ADDON` README gates these lockups on **G1**: they may not render on the **public** site before KW / Forward Wilshire papers The Hokuten Group name (§6.1). They may sit in the repo and render on the `noindex` production deployment for Dino's review — that is the distinction L15 draws.
> The rasters are baked in **kit gold `#B8943D`**, not the new `#B08D3F`. Per L2 that is accepted (rasters keep their baked gold), but it is a visible ~2-unit hue/value difference beside a `#B08D3F` rule. Recorded in §9 X4 and in P13; per D14 Dino eyeballs the delta on the production deployment.

| Surface | Mark | Source → site path | Render size | Notes |
|---|---|---|---|---|
| Sticky header (`SiteNav.tsx`) | **Linear, on-charcoal variant** (R14 Option 2) | **New derivative from `KW_Commercial_Linear_TheHokutenGroup_Gold_on_Charcoal.png` (3762×1184)** → `public/brand/lockup-linear-header.{png,avif}` + `@2x` | ~40–44px tall in a 72px bar | **What ships today is not linear.** `public/brand/lockup-gold.png` is 176×132 (1.33 aspect) derived from `Ref/site/logo-yellow.jpg` (917×758) — stacked proportion in a linear slot. The real linear master is 3600×1022 (3.52 aspect); `public/brand/lockup-linear-gold.svg` already exists in the repo, unreferenced. Update `scripts/identity-prep.ts`'s source path. **Real-text brand line stays adjacent** (visually-hidden acceptable) per D1. **Bug to fix in the same pass:** `lockup-gold@2x.png` is 117×88, *smaller* than the 1× — the `@2x` derivative is backwards. |
| Nav **surface** | **Dark bar — unchanged** | — | — | **Decided: R14 Option 2.** `V2` §1 line 8 requires a white bar so the linear lockup's dark lettering stays legible; `SiteNav.tsx:282` resolves to `surface-dark` over the black hero and stays that way, with the **on-charcoal** linear cut solving the legibility problem instead. Recorded as a deviation from `V2` §1 line 8 in P13. |
| Menu overlay | **Stacked**, centred, large | `public/brand/lockup-gold-xl.png` (854×640, already generated) | ≈260–320px tall desktop | D26 already ships this. Verify the baked "KW COMMERCIAL / THE HOKUTEN GROUP" lettering is legible at render size. |
| Trust Metrics identity anchor | **Stacked** | `lockup-gold-xl.png` | per D27 | One badge, small and quiet — `GUIDE` line 36: "never a repeating banner." |
| Footer compliance mark | KW Commercial mark, **exactly one instance sitewide** | `public/brand/kw-commercial.png` (225×225), `KW_COMPLIANCE_MARK` at `content/compliance.ts:287-288`, alt `"Keller Williams Commercial"` | small | Guardrail: the 2026-08-08 audit found it rendering twice — the duplicate is a bug. Plus the verbatim disclosure line, byte-exact. |
| Footer brand lockup | **Stacked**, theme-matched | `public/brand/lockup-stacked-gold.png` (2400×1836 — byte-identical to the kit master) | ~120–160px | Distinct from the KW compliance mark above; do not merge them. |
| OG card (1200×630) | **Stacked** on the dark field | regenerate `public/og/og-gold.png` via `scripts/og-gen.ts` | 1200×630 | `og-gen.ts:272,274` hardcode `#B8902E` — must become `#B08D3F` and the script re-run. |
| Favicon | Hanko/glyph mark (**not** a lockup — neither lockup is legible at 16px) | `public/brand/favicon-gold.svg` | 16/32 | Regenerate via `scripts/hanko-build.ts` (hardcoded hexes). |
| Apple touch icon | Hanko/glyph mark | `public/brand/apple-touch-icon.png` (180×180) | 180×180 | Regenerate. |
| Deal cards / listing cards | **No lockup.** | — | — | `GUIDE` line 36: one badge per cover/divider, never repeating. |

#### Name, kanji, and tagline (`GUIDE` line 37)

> *"Name — The Hokuten Group; 北天 is an accent mark only, never a replacement. Tagline: True north for hotel owners."*

- **Kanji rule — binding, and the site has a lot of surface here.** The whole hero art system is a 「北天」 glyph mosaic and `components/brand/KanjiAccent.tsx` is shipped. The check: **no headline, brand line, wordmark, `<title>`, OG string or nav mark renders 北天 in place of the English name.** Glyph-mosaic artwork is decorative; wherever it appears, the English name reads adjacent in real text. Add this to the design-skill audit as a named check (F32) and to §7.3 as a grep over `content/` + `components/brand/`.
- **Tagline — decided (R15).** *"True north for hotel owners"* is the guide's and `PROFILE`'s tagline; `V2` never uses it, and `EDITS` carried it only as an *optional* footer line. **It ships as the footer brand line** — a mono kicker beneath the footer lockup, tracked uppercase, `--accent-ink` on the footer ground — and **nowhere else on the site**: not the hero, not a headline, not metadata, not the OG card. Specified in §3.11 and grep-enforced in §7.3.
- **Identity assets follow `MANUAL` §14, including the text-replacement rule — no homemade variants.** The outreach kit's hand-built CSS "KW" box is exactly what that rule forbids (WHATS-LEFT B1).

### 2.5 Files to change (S / M / L)

Sizes: **S** ≤ ~30 lines · **M** a focused rewrite of one file/component · **L** multi-file or measurement-dependent.

**Citation rule for content files.** Line numbers below are re-derived against HEAD (`4a79e56`) and re-verified at build time. Where a row names an exported symbol, **the symbol is authoritative and the line is a convenience** — content files drift, and these are the strings the plan calls byte-exact.

| # | File(s) | Change | Size |
|---|---|---|---|
| F1 | `site/app/layout.tsx:1-2, 70-89, 177` | Font imports → Cormorant Garamond + JetBrains Mono; **delete `axes: ["opsz"]`**; rewire `<html className>` | **S** |
| F2 | `site/app/globals.css:21-23` | Font-var bindings | **S** |
| F3 | `site/app/globals.css:25-72` | Type ramp retune + new tracking tokens | **M** (measurement-dependent → **L** with the hero re-measure) |
| F4 | `site/app/globals.css:168-190` | New `--ink-dark-field` / `--ink-dark-muted` | **S** |
| F5 | `site/app/globals.css:238-263` | Theme G palette → Brand Guide v1.3 values + derived tokens | **M** |
| F6 | `site/app/globals.css:266-288` | Theme B parked comment only (no value change) | **S** |
| F7 | `site/app/globals.css:290-363` | Dark/black scope `--fg`/`--fg-muted`/`--fg-meta`/`--hairline`/`--field` rebinding | **S** |
| F8 | `site/app/globals.css:74-90` (radii + shadow tokens) and `:455-462` (heading weight) | Radii → minimal; shadow tokens → hairline; heading weight split (300 display / 400 heading). **Ownership:** `:455-462` belongs to **P1**; `:74-90` belongs to **P4**, which is the portion whose acceptance asserts "no shadow at rest, radii ≤2px" | **M** |
| F9 | `site/app/globals.css` §5 | New `.display-tail` utility | **S** |
| F10 | `docs/design/contrast.mjs` + `docs/design/CONTRAST.md` | Update hardcoded hexes, re-run, paste transcript | **M** |
| F11 | `site/lib/theme.ts:88`, parked-theme comments | **Value change:** `THEME_PRESENTATION.gold.themeColor` `"#16181B"` → `"#1A1C1F"` (it drives `viewport.themeColor` in `app/layout.tsx`, i.e. browser chrome). Leave `:107` (Theme B `#F7F8F5`) untouched per L1. Add parked-theme comments; verify `DEFAULT_THEME = "gold"`; no deletion | **S** |
| F12 | `site/scripts/ascii-gen.ts:44, 145, 273-280, 802-803` | `MEASURE_FONT_STACK` "IBM Plex Mono" → "JetBrains Mono"; gold ramp `#B8902E`→`#B08D3F`, `#C9A04A`→`#C8A552`, `#F7F4ED`→`#FBF9F3`; **re-run** | **M** |
| F13 | `site/scripts/og-gen.ts:272-276` | **Four values, not two:** `accent` (`:272`) and `subSecondary` (`:274`) `#B8902E` → `#B08D3F`; `subPrimary` (`:273`) `#F7F4ED` → `#F5F1E8` (dark-field ink — the card ground is `#000000`); `grain` (`:276`) `#F7F4ED` → `#F5F1E8`. Re-run | **S** |
| F14 | `site/scripts/{hanko-build,identity-prep,brand-chips,artwork-prep}.ts` | Local theme-hex copies → new palette; **re-run each**; regenerate every affected `public/` raster. `hero-prep.ts` is **conditional** — re-run only if the artwork ramp changed (A8). `menu-prep.ts` is **parked**: D26 replaced the photo panel with the lockup, so no re-run (A10). `identity-prep.ts` also re-points the header mark at the linear master (A2) | **L** |
| F15 | `site/components/atoms/{SectionHeader,MicroLabel,StatNumeral,AccentRule}.tsx` | Kicker rule, mono tracking, stat-tile top rule, gold numerals | **M** |
| F16 | `site/components/cards/{Ticket,CardShell,ClosingCard,ListingCard,TeamCard}.tsx` | Shadow → hairline; radii minimised; keep notch geometry | **M** |
| F17 | `site/components/ui/button.tsx`, `content/nav.ts:73-76`, `components/hero/Hero.tsx` | Outlined-gold primary CTA | **M** |
| F18 | `site/app/page.tsx:69-82` (section JSX) | Section reorder (§3.2). Imports (`:27-44`) and route metadata (`:46-49`) do not move | **S** |
| F19 | `site/content/nav.ts:59-92` | `navLinks` + `menuItems` reorder and renumber to match | **S** |
| F20 | `site/components/sections/*.tsx` header comments + `MicroLabel index` props | Renumber 01–09 to the new order | **M** |
| F21 | `site/components/hero/heroContent.ts:94-104` | Hero copy → Dino's locked strings (§3.1) — **blocked on D1** (tagline conflict, X1) | **S** |
| F22 | `site/content/stats.ts:29-47` + `components/sections/StatsSection.tsx:279-345` | Stat rows + the locked $200M+ hedge + award wording (§3.3). **Three coupled code changes, all in this row — they cannot be split across portions:** (1) the label string `Closed transactions` **stays** (`app/layout.tsx:111-126` composes `METADATA_DESCRIPTION` via `statValue("Closed transactions")`, which **throws by design** if the label is missing); (2) `StatsSection.tsx` must render the Quarterly block and the `costarpowerbrokers.com` link **unconditionally** — today both hang off `costarStat` (`:282`, `:342`), so removing the `3×` row silently deletes them; (3) the tile grid `lg:grid-cols-4` (`:316`) → `lg:grid-cols-3` | **M** |
| F23 | `site/components/awards/QuarterlyBanners.tsx` | **Split** `AnnualBadges` — four individual awards in one strip, Top Firm in its own separately-labelled prior-firm/team block; per-badge alt text | **M** |
| F24 | `site/content/closings.ts` + `components/sections/ClosingsSection.tsx` | Deal-team credit lines on The Last Hotel + Radisson McAllen; provenance fine print under the grid | **M** |
| F25 | `site/content/listings.ts:58-138` (`listings`), `:54-56` (`listingsEmptyState`) | Replace the 5 listings with the 3-property allowlist (§3.5). The Florida Gateway street number ships `provisional` until D18 clears it | **M** |
| F26 | `site/content/team.ts` + `components/sections/TeamSection.tsx` + `TeamCard.tsx` | Six-seat roster, `featured` flag, compact roster row, exact titles, headshots (§3.9) | **L** |
| F27 | `site/content/faq.ts` | Resolve or remove the five `[PLACEHOLDER:confirm]` answers — **none may ship** | **M** |
| F28 | `site/components/forms/BovForm.tsx`, `lib/web3forms.ts`, **new** `app/api/contact-intake/route.ts` | Replace the browser-only Web3Forms path with the server-side Monday intake (§3.7) | **L** |
| F29 | **new** `site/app/api/public-listings/route.ts` | Same-origin proxy, 3-ID allowlist, public-field whitelist (§3.5) | **L** |
| F30 | `site/lib/seo.ts:146` (`INDEXING_ENABLED`), `site/content/site.ts:187` (`SITE_DOMAIN`), `site/app/layout.tsx:163` (`robots`), `site/app/page.tsx:46-49` (route metadata) | Launch flip — **two** noindex mechanisms must both move (§3.13) | **M** |
| F31 | `site/content/site.ts`, `app/layout.tsx:139-164` | Title/description/OG per §3.14 | **S** |
| F32 | `docs/PLACEHOLDERS.md`, `docs/RESUME.md`, `docs/design/AUDIT_LOG.md`, skill refs 01/03/04/06/07, **and `.agents/skills/hokuten-design-director/SKILL.md:71,74`** | Dated supersessions for the palette (`SKILL.md:71` still says `#B8902E`), faces (`:74` still says Fraunces/IBM Plex Mono), vocabulary, section order, award split, and the kanji accent-only check. **Plus new `verified-current` evidence-gate rows in ref 06** for: every listing fact in §3.5/B12, the revised stat rows and the $200M+ hedge, the 4+1 award wording and per-badge alt text, each seat's licence line, and image rights for the six closing photographs. Without these the design skill's own `audit` verb flags the shipped palette, faces and claims as P0 | **L** |
| F33 | `PROJECT-MEMORY.md` | Dated entries for L1, L2 (supersedes the `#B8902E` guardrail), **L3 (supersedes the 2026-08-10 Fraunces/IBM Plex Mono decision)**, L4, L5, **L8 (supersedes the 2026-08-07 static-content decision)**, D-FIELD (including the `V2` §1 line 8 deviation, if A is chosen) and D-VOCAB | **S** |
| F34 | `CLAUDE.md` / `AGENTS.md` hard-guardrail block | Update the "Website gold `#B8902E`" line to `#B08D3F` **with the dated supersession noted inline** (gated on R3). In the same edit, fix the brand-master path: the guardrail points at `The_Hokuten_Group_Brand_Addon_2/`, whose 17 tracked files are deleted in the working tree; masters now live under `full-brand-toolkit/` | **S** |
| F35 | **new** — placement decided in §3.11 (footer legal row, adjacent to the a100 invite in `#doors` if Razim prefers) | **WhatsApp invite + disclosure.** There is **zero** WhatsApp reference anywhere in `site/` today — `V2` §11 step 8 is unbuilt work, not a done item. Add the invite link and the verbatim `V2` §9 disclosure beside it | **M** |
| F36 | `site/content/site.ts:168` `CALENDLY_URL` | `null` → `https://calendly.com/dino-monteverde-kw` (`V2` §8 line 119, verified). Clears `PLACEHOLDERS.md` #29; `CalculatorResult.tsx`'s scheduling CTA stops degrading to `#bov`. The deliberate omission of `hide_gdpr_banner=1` (#44) still stands | **S** |
| F37 | **new** consent-aware measurement config block + event emitters across sections | Four vendor-ID slots (`ga4MeasurementId`, `googleAdsId`, `metaPixelId`, `linkedInPartnerId`), gated on the existing `lib/consent.ts` / `ConsentProvider` plumbing; event emission points per §5.2. **Nothing analytics-shaped exists in `site/` today** — no tags, no `gtag`/`dataLayer`, no event calls | **L** |
| F38 | `site/public/awards/*.{png,avif}` (all five) + `components/awards/QuarterlyBanners.tsx:173-176` | **Award-asset re-intake — the shipped files are the wrong artwork** (§3.3). Replace all five with the approved Winner Badges at native aspect, then re-spec `QUARTERLY_WIDTH/HEIGHT` and the strip layout, which are hardcoded to the banner geometry | **L** |
| F39 | `The_Hokuten_Group_Brand_Addon_2/` (17 deleted tracked files), `full-brand-toolkit/` (untracked), `.gitignore`, `Ref/{awards,team,brand-kit,listings}/`, `Ref/site/` | **Repo hygiene — decided (R17).** `git checkout -- The_Hokuten_Group_Brand_Addon_2/` restores the 17 masters (the `full-brand-toolkit/` copy is identical); **gitignore `full-brand-toolkit/`** — it is Dino's full private delivery, agreements included; **copy** the build's source assets into tracked `Ref/awards/`, `Ref/team/`, `Ref/brand-kit/`, `Ref/listings/` so prep scripts read from `Ref/` per convention; delete the CoStar email-signature derivatives under `Ref/site/` so they cannot be re-intaked; update `CLAUDE.md`'s brand-master path. **No agreements, manuals or chat artefacts enter the repo.** | **M** |

---

## 3. Content & copy changes

Every verbatim string below carries its source id. Strings marked **frozen** are byte-exact ports and must not be paraphrased.

### 3.1 Hero

Current (`site/components/hero/heroContent.ts:94-104`):

- eyebrow — `"Hospitality investment sales — nationwide"`
- h1 — `"Every listing gets a number we can "` + *`defend`* + `", not one we guess."` *(an authored replacement, not a port)*
- sub — `"A written BOV in 48 hours, on receipt of your T-12, STR, and PIP."`
- CTA primary — `"Request a written BOV"` → `#bov` *(shared object with `content/nav.ts:73-76` — hero and nav can never diverge)*
- CTA ghost — `"See the track record"` → `#closings`

**New — decided (R4/D1; X1 resolved by the precedence rule, L13):**

| Slot | String | Source |
|---|---|---|
| Eyebrow (mono, tracked, gold) | `Hospitality investment sales — nationwide` | site, unchanged — consistent with `V2` positioning. **Check against the canonical coverage sentence (§3.11):** "nationwide" is acceptable only as a market statement; the site must nowhere imply blanket brokerage authority in every jurisdiction |
| H1 (Cormorant, italic gold tail on the last phrase) | `Hotel brokerage and advisory, coast to coast — ` + *`with systems in place.`* | `V2` §3 "Approved website positioning → Hero", line 47 |
| Sub (Inter, prose measure) | `Human-led hotel brokerage supported by source-controlled underwriting, licensed comparable-sale research, structured buyer qualification, documented owner reporting, AI-assisted research, document review, and controlled workflow automation.` | `V2` §3 line 48 (`FINAL`'s Option A is the same text minus "document review,") |
| CTA support line (mono micro, beside the primary CTA) | `Written BOV within 48 hours of receiving the T-12, STR report, franchise / PIP information, and other material property data.` | `content/methodology.ts:43-44` `bovPromise` — **frozen**, already imported in four places |
| CTA primary (outlined gold per D-VOCAB) | `Request a written BOV` → `#bov` | site, unchanged |
| CTA ghost | `See the track record` → `#closings` | site, unchanged |

**Not shipped:** `FINAL`'s primary tagline `"The signal underneath every hotel transaction"` and secondary headline `"Hotel brokerage and advisory, coast to coast, from Asia to the Americas"` — see X1 (tagline conflict) and X2 ("from Asia to the Americas" has **no** backing in any register: the Japan programme is pilot-only and its approved one-line public description is an **unfilled placeholder** in `AGREEMENTS` 04 §5). Shipping "Asia to the Americas" would fail the evidence gate.

**Build note:** the sub is ~40 words. It renders at `--text-body-lg` inside a prose measure, not at display size. After the copy and font swap, re-measure the hero at 1440×900 and 1920×1080 — it must still land on exactly one usable screen (D25). If it does not, the sub is the row that flexes, never the headline size.

### 3.2 Final section order

**Current** (`site/app/page.tsx:69-82`): Hero (brand rail nested, D2) → Stats → `01` Closings → `02` Listings → `03` Calculator → `04` Method → `05` Doors → `06` Mandates → `07` Team → `08` FAQ → `09` BOV → Footer.

**Dino's named order** (`FINAL`, uncontested — `V2` never addresses section sequence): Hero+Trust Stats → Closed Deals → Active Listings → Valuation Calculator → Process Timeline → BOV/Contact → Team → A100 Arms.

**New order (recommended):**

| Screen | Component | `id` | Index | Named by Dino as | Rationale for unnamed sections |
|---|---|---|---|---|---|
| 1 | `<Hero />` (renders `<BrandsMarquee id="brands">` internally, D2) | `hero`, `brands` | — | 1. Hero | Brand rail stays nested — rendering `<BrandsSection />` standalone would create two `id="brands"` landmarks (`page.tsx:16-19`) |
| 2 | `<StatsSection />` | `stats` | — | 1. Trust Stats | Unchanged |
| 3 | `<ClosingsSection />` | `closings` | `01` | 2. Closed Deals & Experience | Unchanged |
| 4 | `<ListingsSection />` | `listings` | `02` | 3. Active Listings | Unchanged |
| 5 | `<CalculatorSection />` | `calculator` | `03` | 4. Valuation Calculator | Unchanged |
| 6 | `<MethodSection />` | `method` | `04` | 5. Process Timeline | Unchanged |
| 7 | `<FaqSection />` | `faq` | `05` | — | **Moves up.** Nearest named section is BOV/Contact — diligence questions immediately precede the ask |
| 8 | `<BovSection />` | `bov` | `06` | 6. BOV Form / Contact | **Moves up** from position 11 |
| 9 | `<TeamSection />` | `team` | `07` | 7. Team | **Moves down** one |
| 10 | `<DoorsSection />` | `doors` | `08` | 8. A100 Arms (part 1) | **Moves down.** `#doors` is where the a100 Arms invite lives (`content/doors.ts:61-68`) |
| 11 | `<MandatesSection />` | `mandates` | `09` | 8. A100 Arms (part 2) | **Moves down.** Capital & mandates closes on the a100 Arms channel (`content/mandates.ts:78`) |
| 12 | `<SiteFooter />` | — | — | Footer | Unchanged |

**Consequence, accepted (R5):** the page no longer ends on the BOV ask. Dino's sequence puts Team and A100 Arms after the form; that is a conversion trade Razim took on 2026-08-17 in favour of the stated order. The alternative — `<BovSection />` last with FAQ `05`, Team `06`, Doors `07`, Mandates `08`, BOV `09` — was not taken; it preserves the closing ask but breaks Dino's stated order for two named sections.

**Mechanical consequences of any reorder:**
- `app/page.tsx:69-82` JSX reorder only — imports (`:27-44`) and route metadata (`:46-49`) do not move.
- `content/nav.ts` `navLinks` (`:59-66`) and `menuItems` (`:87-...`) must be reordered and **renumbered** to match; the 01–09 sequence is shared between the menu overlay and every section's own `MicroLabel index` (`content/nav.ts:11-38` documents the 2026-08-08 renumbering that fixed a prior double-numbering conflict — do not reintroduce it).
- Each section file's header comment states a fixed screen number; update them alongside.
- Anchors are id-based, so `scroll-margin-top` and the anchor-focus handler are unaffected.

### 3.3 Trust stats + awards

**Stat rows** — current `site/content/stats.ts:29-47`:

| Value | Label | Detail |
|---|---|---|
| `$200M+` | Aggregate volume | — |
| `12` | Closed transactions | "11 hotel-asset transactions + 1 hotel-management-company M&A" |
| `836K+` | Total square feet | — |
| `3×` | CoStar Power Broker | "Q3 '25 · Q1 '26 · Q2 '26" |

**New:**

| Value | Label | Detail | Source |
|---|---|---|---|
| `$200M+` | Aggregate volume | keep — **label string frozen**, `app/layout.tsx` reads it | `V2` §3 line 49 |
| `12` | **`Closed transactions`** — label string unchanged | `11 hotel-asset transactions + 1 hotel-management-company M&A` | site, `verified-current`. **Do not rename.** `app/layout.tsx:111-126` composes the root metadata description via `statValue("Closed transactions")` and that helper **throws** when the label is missing, so a rename red-builds the site. If the visible wording must change, change the rendered string, not the key |
| `836K+` | Total square feet | — | `EDITS` §10 / `PROFILE` §7 — **flag X6**, absent from `V2` |
| — | **`3×` tile is REMOVED** | — | L6: any numeral compression of the award set is exactly what `V2` §3 warns against ("do not… combine the five source records into a personal award count") |

**Two code consequences of removing the `3×` row — both must land in the same portion (F22):**
1. `StatsSection.tsx:282` does `stats.find(s => s.label === "CoStar Power Broker")` and `:342` renders the block as `costarStat ? (…) : null`. Delete the row and `costarStat` is `undefined`, which **silently removes the three Quarterly badges and the `Verify at costarpowerbrokers.com →` link** — both of which §6.2 then requires to be present. Refactor the block to render unconditionally.
2. The tile grid is `lg:grid-cols-4` (`:316`); three tiles in four columns. Re-spec to `lg:grid-cols-3`.

**Locked hedge — must render verbatim beneath the stat row** (`V2` §3 line 49, repeated in six places across `V2`; the *single most repeated directive in the corpus*; also printed on Dino's own profile card):

> Dino Monteverde's career experience includes $200M+ in aggregate transaction volume across 12 hotel and hospitality transactions, including hotel sales, a joint-venture refinance partnership, and the sale of a hotel management company involving 40+ management contracts. This experience includes current and prior affiliations and is not presented as 12 hotel sales personally closed by Dino or as Hokuten-only production.

Never compress to "12 closed hotel sales."

**Award presentation — the 4 + 1 split.** Approved dated wording, verbatim (`V2` §2 bullet 2, restated in §3 lines 55–57):

> Dino Monteverde's recent CoStar Power Broker recognition includes the 2025 Annual Top Broker award and Quarterly Deals wins for Q3 2025, Q1 2026, and Q2 2026.

Second block, separately attributed — **the full source string, including the qualifier the shorter form drops**:

> The 2025 Annual Top Firm recognition is attributed separately to the prior firm/team — never counted as an individual award.

**Three-way source variance, logged as X21.** `V2` line 23 (above) · `V2` line 57: *"is prior-firm/team recognition and must be attributed separately. Do not convert it into a personal award…"* · `KIT` line 30: *"presented ONLY as Hokuten TEAM recognition"* — which **must not be used**: Hokuten did not exist in 2025, so framing a 2025 award as Hokuten team recognition is a false claim. Ship `V2` line 23 verbatim. **Per D17 the register was never delivered, so `V2` §2's quoted approved wording IS the caption source** — the register check becomes a post-push verification item (G7), not a build blocker.

**Layout** (`HANDOFF-03`): four individual badges as a four-column desktop / two-column tablet-phone strip; the Top Firm graphic **after** it, in its own prior-firm/team recognition block with its own caption and alt text. QA-passed at 1440×1050 and 390×844.

**Placement — decided by default (X22 · D16).** `HANDOFF-03` places the four individual badges *"in the Dino team section."* The site consolidates all five CoStar assets into `#stats` per D12 (Revisit 2: "Trust Metrics becomes the single proof wall"), and §7.3 hard-enforces "no CoStar asset outside `#stats`." **Default taken:** all five stay in `#stats` — the four individual Winner Badges as the strip, the 2025 Annual Top Firm in its own prior-firm/team block immediately after them. It is a recorded deviation from `HANDOFF-03` decision #6, which reserves final placement and size to Dino; he sees it on production and iterates (§8.1 D16).

**Badge files — P0: the five assets shipping today are the wrong artwork.**

The plan's earlier reading that "all five already ship, unmodified" does not survive measurement. What is in `site/public/awards/` are resized **CoStar email-signature banners**, not the Winner Badges the CoStar README approves for website use:

| Shipped file | Dims in repo | Intake source | Source dims | What it actually is |
|---|---|---|---|---|
| `costar-top-broker-2025.png` | 581×135 | `Ref/site/US_2025Annual_TopBroker.png` | 600×135 | Annual Top Broker **email signature** |
| `costar-top-firm-2025.png` | 581×135 | `Ref/site/US_2025Annual_TopFirm.png` (SHA-256 `94af4db4…68dd04`) | 600×135 | The **excluded prior-firm** Top Firm email signature |
| `powerbroker-q3-2025.png` | 747×168 | `Ref/site/powerbroker-q3-2025.png` | 1200×270 | Q3 2025 **email signature** |
| `powerbroker-q1-2026.png` | 747×168 | `Ref/site/powerbroker-q1-2026.png` | 1200×270 | Q1 2026 **email signature** |
| `powerbroker-q2-2026.png` | 747×168 | `Ref/site/powerbroker-q2-2026.png` | 1200×270 | Q2 2026 **email signature** |

The approved Winner Badges are **355×333** (Annual) and **784×784** (Quarterly) — near-square medallions. A 581×135 output cannot be derived from a 355×333 source, and 600×135 → 581×135 is itself a non-uniform resize. So three README rules are broken at once: the badges are modified; the email-signature formats are marked *"Not for website use"*; and `costar-top-firm-2025.png` is byte-for-byte the one asset the README singles out — *"Reference Only – Prior Firm … never use as an individual Dino or KWC/Hokuten award"* — the file this very section elsewhere calls "never on the site." Its SHA-256 matches exactly.

**Remediation (F38, portion P15):**

1. Re-intake from the Social Media Kit zip, unmodified, at native aspect: `Dino Monteverde - CoStar 2025 Annual Top Broker - Winner Badge.png` (355×333) · `… 2025 Q3 Quarterly Deals - Winner Badge.png` (784×784) · `… 2026 Q1 …` (784×784) · `… 2026 Q2 …` (784×784) · `US_2025Annual_TopFirm_WinnerBadge.png` (355×333, present only in the Social Media Kit zip, **not** in `Media (1).zip`).
2. Replace all five `public/awards/*.{png,avif}` files. No crop, no recolor, no redraw, no overwrite of the originals.
3. Delete the email-signature derivatives from `Ref/site/` and from the repo (F39) so they cannot be picked up again.
4. **Re-spec the layout.** `components/awards/QuarterlyBanners.tsx:173-176` hardcodes `QUARTERLY_WIDTH/HEIGHT` to 747×168 banner geometry. Near-square medallions do not drop into banner slots; the four-column strip and the Top Firm block both need new sizing.
5. **Artwork identity — default taken (D16).** `HANDOFF-03` decision #6 covers placement and size, not file identity — and `HANDOFF-03` line 10 names the README-excluded signature file as the Top Firm "source of record", directly against the CoStar README (registered as **X23**). **The README wins on usage:** all five shipped files are the Social Media Kit **Winner Badges** at native aspect, with `US_2025Annual_TopFirm_WinnerBadge.png` as the Top Firm graphic. It is not dropped, and the deviation from `HANDOFF-03` line 10 is recorded in P13.

**Alt text and captions — the D17 fallback.** The register was never delivered, so `V2` §2's quoted approved wording is the caption source and **alt text equals the caption text**. The strings below are the working set; they are reconciled against register v1.1 when it arrives (G7, post-push).

| Slot | File after re-intake | Alt text (**reconstruction**, not a quote) |
|---|---|---|
| Individual 1 | `/awards/costar-top-broker-2025.*` | `CoStar Power Broker Award — 2025 Annual Awards — Winner, Top Broker` |
| Individual 2 | `/awards/powerbroker-q3-2025.*` | `CoStar Power Broker Award — Quarterly Deals — Winner, Q3 2025` |
| Individual 3 | `/awards/powerbroker-q1-2026.*` | `CoStar Power Broker Award — Quarterly Deals — Winner, Q1 2026` |
| Individual 4 | `/awards/powerbroker-q2-2026.*` | `CoStar Power Broker Award — Quarterly Deals — Winner, Q2 2026` |
| Team block | `/awards/costar-top-firm-2025.*` | `CoStar Power Broker Award — 2025 Annual Awards — Winner, Top Firm. Prior-firm and team recognition; not an individual award.` |

> **These five strings are reconstructions from `HANDOFF-03`'s description, not quotes.** `HANDOFF-03` is explicit that the Claims & Coverage Register "is the only wording source — if a caption needs to change, it changes in the register first," and the register was never delivered (X10). **Per D17 they ship anyway, sourced from `V2` §2's approved wording**, with a `verified-current` register row in skill ref 06 that records the fallback and names the register check as outstanding (G7). Re-checking them against register v1.1 is a post-push item, not a build blocker.
>
> `components/awards/QuarterlyBanners.tsx` currently exports `AnnualBadges` rendering top-broker **and** top-firm together — splitting that into an individual strip and a separate team block remains a P0 fix, alongside the asset replacement.
>
> Dino's chat ask (2026-08-17, ~1:06 AM) to add the Top Firm 2025 badge is **not** satisfied by what ships today: the file present is the excluded prior-firm signature. Say so when reporting back.
>
> **Verified by direct visual read of all seven badge/graphic files:** none prints a firm name, none prints "5×", all print the correct period. Any "5×" or firm-name risk lives entirely in the copy written around them.
>
> Badge artwork is used **unmodified** — no crop, recolor, redraw, combine, or overwrite. Badges do not link. The one legitimacy link, added per D27, is the mono micro line `Verify at costarpowerbrokers.com →` → `https://www.costarpowerbrokers.com/`, `target="_blank" rel="noopener noreferrer"`.

### 3.4 Closings (`#closings`)

**Which six** — already correct. The site's six (`site/content/closings.ts:32-104`) match Dino's six property-photo filenames one-for-one (`FINAL` "Property Photos"):

| Site card | Dino's filename | Price | Keys |
|---|---|---|---|
| Carte Hotel — San Diego, CA | `carte.jpg` | $61.49M | — |
| Renaissance Reno Downtown — Reno, NV | `renaissance.jpg` | $50.1M | 214 |
| The Last Hotel — Saint Louis, MO | `cover_lasthotel.jpg` | $13.2M | 142 |
| Holiday Inn Express Brooklyn — Sunset Park, NY | `slide9_brooklyn.jpg` | $20.0M | 88 |
| Radisson McAllen — McAllen, TX | `slide10_mcallen.jpg` | $14.0M | — |
| Budget Inn & Rodeway Inn — Rohnert Park, CA | `slide12_rohnert.jpg` | $14.0M | — |

**Keep all facts unchanged — but verify every one before it stays public.** Two instructions apply, and the newer one adds an affirmative duty the earlier one does not:

> `EDITS` §8.3: *"Do not renumber or thin the grid without Dino's word."*
> `V2` §2 bullet 4 (line 25, `locked`): *"Verify every closing-card figure — price, timing, LP/SP, key count, and role — against the Claims & Coverage Register before it remains public. Remove any unsupported field. The closings signal lines are locked as published on the live site."*

So the six cards are not "no verification needed": every price, day count, LP/SP ratio, key count and role on them must be checked against register v1.1, and any field the register does not support is **removed** (not edited, not softened). That collides with **X10** — the full register was never delivered — so **the closing cards cannot be signed off until it arrives (D17).** The file's documented formatting quirks are deliberate ports — inconsistent decimal precision ($50.1M vs $61.49M), "Confidential" as a proud stand-in for a withheld ratio (never "N/A"), the one normalisation "142 rooms" → `keys: 142`. The same verification duty applies to the listing facts in §3.5, which come from July-dated social copy rather than the register.

**Scrub — already clean, must stay clean.** Grep confirms **zero** `Sarhan` / `Mheni` / `Schulman` in `site/content/` or any deal/team data; all seven `site/` `Sarhan` hits are guardrail comments (`content/compliance.ts:85`, `components/sections/StatsSection.tsx:7`, `components/brand/Wordmark.tsx:9,51`, `components/nav/MenuOverlay.tsx:341`, `components/motion/CountUp.tsx:6`, `lib/theme.ts:62`). Target after this pass remains **zero hits in rendered copy**.

**Add — William's credits** (`EDITS` §8.1, still controlling). The two site case studies that PROFILE §6 ties to William are **The Last Hotel, St. Louis ($13.2M)** and **Radisson McAllen ($14.0M)**. Both cards gain, verbatim:

> Deal team: Dino Monteverde · William Betancourt

**Add — provenance fine print**, verbatim, at the bottom of the Recent Closings section (`EDITS` §8.4, still controlling):

> Selected transactions completed by Dino Monteverde, 2022–2026, including transactions completed at prior affiliations.

Rationale from the source: "the deals are advertised as Dino's transaction experience, not as closings of The Hokuten Group (which did not exist when they closed)."

**Renaissance Reno card — default taken (D4):** `EDITS` §8 carries an unresolved owner decision, "☐ keep ☐ pull." **The card stays** and ships as-is; if Dino wants it pulled he says so on the production review (§8.1 D4).

**Photos:** six real files already in `site/public/hotels/` — `carte-san-diego.jpg` 1024×767 · `hie-brooklyn.jpg` 3840×2560 · `last-hotel-st-louis.jpg` 1024×710 · `radisson-mcallen.jpg` 1280×960 · `renaissance-reno.jpg` 1199×630 · `rohnert-park.jpg` 968×607. No layout change required — but **no source or permission is recorded for any of them**, and the claims register has rows for the closing figures and none for the photography. The Knowledge Handbook names the website directly:

> *"Booking- or review-site images: do not reuse them unless the owner, photographer, platform license, or written permission grants the intended use. Public visibility alone does not clear an image for a BOV, OM, website, or social post."* (`HANDBOOK` HB:264)

Add a claims-register row per photo (source · licence or written permission · date) and a §6.2 checklist line. The same requirement attaches to the replacement listing photography Dino owes (A23 / WHATS-LEFT C13) — it arrives **with** provenance or it does not ship.

### 3.5 Active listings (`#listings`)

**Current** — five listings (`site/content/listings.ts:58-138`): The Lodge at Split Rock Resort · Pocono Mountain Hotel and Spa · Developer Inn Highway (Kissimmee) · Developer Inn Downtown Orlando · Baymont by Wyndham Jacksonville Airport.

**New — exactly three (`V2` §2 bullet 6, allowlist).** Only one of today's five survives:

| # | Name | Location | Facts available now | Source |
|---|---|---|---|---|
| 1 | **The Florida Gateway** | 852374 US Highway 17, Yulee, FL 32097 (Jacksonville MSA) — **`provisional`, see D18: the street number as printed reads like a digit-concatenation typo and is flagged for verification in the source itself; confirm against the Crexi record (2629907) or the county record before publishing** | 156 keys · $3,750,000 · ±7.45 acres · ~85,000 SF of improvements · closed since 2019, offered as-is · built ~1980 / renovated ~2015 · active FL 4COP liquor licence + active wastewater-treatment licence · "Florida's first I-95 exit — Exit 380 at US-17" · Wildlight/ENCPA growth corridor | `MEDIA` `Yulee_Gateway_Social_Posts_July2026.md` + flyer creative |
| 2 | **Quality Suites Houston NW Cy-Fair** | 17550 NW Freeway (US-290), Houston TX (Cypress / Houston NW) | 54 keys · $3,600,000 (~$66.7K/key) · Choice-flagged select-service · full PIP completed 2024 · 2026 YTD RevPAR +30% YoY · delivered free and clear at closing | `MEDIA` `QS_CyFair_Social_Posts_July2026.md` |
| 3 | **Pocono Mountain Hotel & Spa** | 38 Lehigh Road, Gouldsboro, PA 18424 | already on the site — Crexi id 2301818 | `listings.ts`, `AGREEMENTS` 50-mile sweep |

**Canonical name:** **The Florida Gateway.** The write-up doc calls it "The Yulee Gateway"; the flyer creative and `V2`'s allowlist both say "The Florida Gateway." The allowlist wins.

**Crexi links.** The Florida Gateway → `https://www.crexi.com/properties/2629907/florida-the-florida-gateway` (recovered from a LinkedIn screenshot Dino forwarded, team chat 2026-08-17 16:04 — it exists in no text source). **Quality Suites Cy-Fair's Crexi URL is not present in any source. Default taken (D7):** a P7 worker web-searches Crexi for the Quality Suites Houston NW Cy-Fair record (17550 NW Freeway) and verifies the record matches the write-up before wiring the link; **if it cannot be verified, that card ships with no Crexi link.** No other card is affected.

**Must NOT appear anywhere on the site** (source docs mark these confidential/unverified):
- QS Cy-Fair: the `$2.85M` figure or any value range; lender name, note payoff, any debt figure; ownership entity or acquisition basis; net-to-seller math; the words "loss", "losing money", "negative income". Approved substitute framing, verbatim: *"current performance sits below the historical baseline; the gap is operationally driven and fixable."*
- Yulee: the "Costco anecdote" — explicitly unverified, stays behind the CA in the OM.

**Photography.** All ten listing flyers in `MEDIA/Social Media Posts Photos/` carry **Sarhan Hotel Group** branding and the legacy `kwc-dinomonteverde.com` contact block — none can ship (CLAUDE.md hard guardrail). No unbranded Hokuten property photography exists anywhere in the delivery. Listing cards keep the `beachfront-aerial` artwork placement as the honest interim (`listings.ts:31-35`, `PLACEHOLDERS.md:114` row 41) until raw photos are supplied.

**Currency.** Both write-ups are dated 2026-07-17 — one month stale. **Default taken (D8):** all three allowlist listings are treated as **active** — the 2026-08-17 50-mile owner sweep Dino distributed is built around exactly these three properties, which is the freshest evidence available that they are live. Prices publish on that basis; Dino confirms or corrects on the production review.

**Delivery mechanism** (`V2` §2 bullet 7, `HANDOFF-02`). **Render contract, decided (L8):** `content/listings.ts` is the rendered source of truth for the three cards; the proxy is additive. A record the proxy returns that is not one of the three approved IDs is dropped, logged server-side, and never rendered — P7 and P11 share that acceptance check. Deploy `/api/public-listings` with the site. It fetches the a100 public source **server-side**, returns only the three approved listing IDs plus a small public-field whitelist, and prevents the broader response from reaching browser storage. **Never point browser code back at the a100 endpoint.** Deliberately test: all three approved records, a non-approved record, an a100 source-feed failure, image/link validation, cache behaviour, and production same-origin delivery.

**Marketplace — the site has no such route.** `V2` §2 bullet 8 ("the marketplace remains an intake-only page") and `V2` §1 line 8 (which names marketplace as one of four routes carrying the dark system) both describe the kwc site. `site/app` contains `/`, `/privacy`, `/sms-terms`, `/accessibility` only. The a100 Arms invite in `#doors` currently performs the equivalent function. **Decided (R16 / D19): `#doors` carries the marketplace intent** and no `/marketplace` route is built for launch. The deviation from a named directive in the master document is **recorded in PROJECT-MEMORY (P13)**, not left silent, and a real intake-only route is scoped as post-launch work if Dino wants one.

Empty-state copy stays: `"No public listings right now — request off-market access"` (`listings.ts:57-58`).

### 3.6 Valuation calculator (`#calculator`)

**No content or math change.** `V2` §1 says keep the kwc calculator; `CLAUDE.md` freezes the math, defaults, and cap-rate `CONFIG`; `site/lib/valuation.test.ts` is a 1,445-line golden-parity suite that must stay green.

What *does* change: the tokens and faces it renders in (§2.1–2.2), the outlined-CTA treatment (D-VOCAB), and the option-tile shape contract already approved in Revisit 3. Two standing constraints carry through: the calculator disclaimer is **frozen** — *"Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value."* (`CALCULATOR_DISCLAIMER`, `content/compliance.ts:227` / `:235`) — and `MANUAL` §10 requires public market data to be formula-only/hypothetical, which the calculator already satisfies. Known cap-rate defect (F&B % sticking after a service-level switch) stays as-is per the frozen-calculator rule (`PLACEHOLDERS.md` #42–45). Calculator engagement events are in the analytics vocabulary (§5).

### 3.7 BOV / contact (`#bov`)

**Current:** `components/forms/BovForm.tsx` posts to Web3Forms (`lib/web3forms.ts:38` `https://api.web3forms.com/submit`); `NEXT_PUBLIC_WEB3FORMS_KEY` is unprovisioned, so the submit button is disabled with a `mailto:` fallback (`BovForm.tsx:148-149`).

**New (`V2` §2 bullets 1–8, `HANDOFF-02`):** replace the browser-only Web3Forms path with a **server-side intake endpoint using protected credentials**. Create/update the contact in the Keller Williams Commercial Monday workspace only. **Never expose a Monday token in browser code.**

**Endpoint:** `POST /api/contact-intake` (the route `HANDOFF-02` names for the rate-limit rule). `FINAL`'s `/api/bov/intake` was a placeholder and is superseded.

**Field capture, authoritative list (`V2` §2 line 31):** `source=Website`, `page`, UTM data, **server-controlled** `submission_type` (fixed to `BOV request`), `name`, `company`, `email`, `phone`, `property`, `market`, `keys`, `brand`, `timeline`, `comments`, consent status, and timestamp when consent is affirmative.

**Mapping against today's form** (`BovForm.tsx:13-17`, `lib/web3forms.ts:15-18` — renaming any existing field name silently breaks the lead, it does not error):

| V2 field | Today | Action |
|---|---|---|
| name | `name` | keep |
| property | `hotel_name` | map |
| market | `city` + `state` (via `CityPicker`) | map |
| phone | `phone` (`PhoneField`, optional) | keep |
| email | `email` | keep |
| consent status / timestamp | `sms_consent`, `sms_consent_text`, `consent_timestamp` | **server-recorded only** (below) |
| — | `botcheck` honeypot (`:371-372`) | keep |
| company, keys, brand, timeline, comments | — | **add** |
| source, page, UTM, submission_type | — | **add, server-set** |

**Behaviour rules (all locked):**
- Success appears **only after confirmed receipt**. A submission is successful only when either Monday **or** the tested email fallback confirms receipt.
- Monitored email fallback + failure alert; **deliberately test the failure path in staging.**
- SMS consent stays **unchecked by default**; require a mobile number if selected; the **server**, not the browser, records yes/no and creates the disclosure/timestamp only for "yes" — caller-supplied disclosure/timestamps are ignored.
- Add a plain-language statement that submitting a form does not create an agency relationship.
- Edge/Vercel Firewall rate limit on `/api/contact-intake`; the in-function limiter is only a best-effort backstop (serverless instances do not share memory).
- BOV-interest leads reach the Managing Director **same-day** (`MANUAL` line 65) — the alert webhook is how that SLA is met.
- Deliberately test: validation · SMS-without-phone rejection · client consent-field tampering · bot field · rate limits · Monday success · Monday failure + email success · total failure · alert delivery.

**Frozen strings that stay byte-exact:** the SMS consent checkbox label (`content/compliance.ts:146`), the 10DLC registered brand string `"Dino Monteverde (KW Commercial)"` (`content/compliance.ts:136` — frozen until a Hokuten campaign is re-registered with TCR), and the section's pitch paragraph (`BovSection.tsx:132-152`, verbatim from `index.html:1211`).

### 3.8 Method (`#method`)

**No copy change.** Five steps (`content/methodology.ts:38-73`) satisfy `FINAL`'s "5-step timeline visual." The framing paragraph is a **frozen** contractual port (180 days / two 90-day cycles / Day-30 and Day-60 reads / Day-90 seller decision). `bovPromise` is frozen and imported in four places. Reach stats (~400K / ~60K / 1,500 / 30K) are `verified-current`.

Design-only: two-digit gold Cormorant numerals for `01`–`05` (§2.3), and the D28 fit budget must be re-measured after the type swap — `#method` was the worst offender at 1.57 screens (1,234px against a 784px budget at 1440×900) and Razim specifically called it "lengthy."

### 3.9 Team (`#team`)

**Current** (`site/content/team.ts:47-…`, export `team`): four rows — Dino (real photo, DRE, email); Razim, William, and a combined "Jae Hun Jeong & Donna Grace Yangyang" row, all provisional, `email: ""`, rendering `GlyphPlate` instead of a portrait. Dino's role string is **"Senior Associate · Hospitality Investment Sales"** — superseded.

**New — a data-driven six-seat roster in `content/team.ts` with a `featured` flag.** Featured seats render full cards with bio and portrait; the other three render as a compact roster row (name / title / headshot).

| Seat | Name as printed | Title on site — exact | `featured` | Licence line | Headshot |
|---|---|---|---|---|---|
| 1 | Dino Monteverde | **Managing Director** *(site, team section, and cards render "Managing Director"; "Founder & Managing Director" is the LinkedIn headline and short-bio form)* | ✅ | `CA DRE #01948432` · brokerage `CA DRE #01870534` | `/team/dino-monteverde.jpg` (919×1149, ships today) |
| 2 | Mohamed Razim Meeran | **Founding Team Member \| Director** (R9) | ✅ | **none — by decision (R8 resolved 2026-08-17).** Razim is currently licensed (Illinois #475.213653) but is pausing that membership soon and will perform no licensed acts under his own name — lead qualification, LOI and PSA work run under Dino's licence and supervision. The site therefore never renders a licence number for him, so nothing goes stale at the pause; title only, like Marlon's. | new — Razim's prepped headshot from `full-brand-toolkit/razim-headshot-color.jpeg` / `-bw.jpeg` (P8 prep: grayscale, flat white ground, canonical crop) |
| 3 | William Betancourt | **Founding Team Member \| Director · Florida** | ✅ | `Florida BK3200675` (active through 2028-03-31) — **ships** (D9); Dino rules on what satisfies G3 before cutover | canonical uniform set — **card renders without a portrait until C17 clears** |
| 4 | Donna Yangyang | Administrative Assistant & Transaction Support | ⬜ roster row | none — no licensed-activity claim | canonical uniform set |
| 5 | **Jae Hun Jeong** | Administrative Assistant & Transaction Support | ⬜ roster row | none | canonical uniform set |
| 6 | Marlon Guzman | Team Member \| Southern California | ⬜ roster row | **none — no active-broker, active-licensee, or licensed-service claim** | canonical uniform set |

> **`V2` §6:** "The founding team members are Dino Monteverde, William Betancourt, and Mohamed Razim Meeran. **No other team member is described as a founder, founding partner, or founding team member.**"
>
> **Name: "Jae Hun Jeong" — no "Q" anywhere.** Two sources, not one: `ROLES` line 51 (a delivered document the plan already names as the authority for exact seat titles) prints "Jae Hun Jeong" with no middle initial, and his vCard reads `N: Jeong;Jae Hun`. Dino confirmed the same in team chat (2026-08-17 00:43). `V2` §6 prints "Jae Hun Q. Jeong" — same author, same date, disagreeing with itself (**X24**). **Use "Jae Hun Jeong".** Verified: zero `"Q"` tokens near "Jae" in the current codebase — keep it that way.
>
> **Donna's surname is `Yangyang`** (one word, per her vCard `N: Yangyang;Donna`). The site currently renders "Donna Grace Yangyang" — align to `Donna Yangyang`.
>
> **Marlon:** the official CA DRE record reviewed 2026-08-12 shows salesperson 02086279, expiry 2027-06-10, status *Licensed NBA / No Current Responsible Broker*. His card therefore makes no licence claim at all.
>
> **Contact routing — name the destination.** The outreach kit's approved routing is explicit: Donna, Jae and Marlon have *"no direct business contact field; all inquiries route through Dino Monteverde."* Say that, not "through the team." `email: ""` stays the contract; the renderer treats an empty string as "no contact channel" and never builds an empty `mailto:`. **Never invent a contact detail** (`AGREEMENTS` 01 §5, 09 §5).
>
> **Published-address conflict (X25).** `MANUAL` §4 prints working emails and direct numbers for the seats (`dyangyang@kw.com`, `jaehun.jeong@kw.com`, `razim@kw.com`, Marlon TBD), while the outreach kit's vCards state that a public email is **"not yet approved"** for Razim and William. The site adopts `email: ""` for all non-Dino seats — the conservative reading — but the conflict is logged rather than silently resolved.
>
> **The featured/roster split is documented, not assumed.** `FINAL` lines 38-41: *"TEAM SECTION — 3 team members with bios (Dino, Razim, William) — Bios to be provided by Dino · NO hiring card (removed) · Other team members: Can add later or as links to profiles."* That is exactly this split, marked as a locked decision. `FINAL` predates `V2`'s six-seat roster, and the reconciliation is **decided (R7/D6): the other three seats render as compact roster rows**, not omitted and not linked out.

**Bios.** Received so far: **Donna Yangyang's** (supplied by Donna via Razim, 2026-08-17 — verbatim in Appendix B13, with the ≤45-word roster cut). Still owed: Dino's, William's, Jae Hun Jeong's, Marlon's, and Razim's own (a draft for Razim to approve is in B14). **Rendering rule (decided):** featured cards carry a full bio (≤120 words); roster-row cards carry a short bio (≤45 words) beneath name/title — Donna's roster cut ships now, the other two roster seats show name/title only until their text arrives. Until the featured bios land, they use `V2` §6's approved role paragraphs verbatim (approved copy, not placeholders):
- Dino — team lead: sellers, listings, BOVs and valuations, pricing, top relationships, campaigns, DNC decisions, access, and final approvals.
- William — Florida coverage and operational deal execution, including buyer conversations, tours, transaction milestones, LOI and purchase-and-sale workflows, and coordination through closing.
- Razim — automation and web development, and training for the team's tech tools: CRM workflows, integrations, data quality, enrichment, dashboards, and the technology supporting a100 Arms.

**Hiring card:** removed and stays removed (`FINAL` Change 4 — "Do not replace with anything"). Verified: zero `hiring` / `Join Our Team` hits anywhere in `site/`.

**Headshots.** The canonical set (`MEDIA/Headshots/Canonical Uniform 2026-08-12/`) is a **near-matched** batch, not a uniform one: flat pure-white background, tight head-and-shoulders crop, true grayscale, dark suit / white shirt / dark tie, soft shadowless studio light, direct gaze — but **two of six differ in aspect**. Donna, Marlon, William and Razim's pending files are 1122×1402 (0.800); Dino's is 1117×1408 (0.793, already re-cropped to 0.800 in the shipped `public/team/dino-monteverde.jpg`); **Jae Hun's is 1086×1448 (0.750)** and cannot reach 0.80 without cropping a file the plan otherwise treats as final. Ship them at one *rendered* aspect via `object-fit: cover` on a flat-white ground, and either accept the render-side crop on Jae's portrait or get a re-crop approved by Dino and Jae.

**Subject approval is a per-seat gate, not a formality.** The team's own convention says so: Razim's canonical files are named `SUBJECT APPROVAL PENDING` and his vCard note reads "headshot remains subject-approval pending." And in team chat (2026-08-17 16:07–16:16) William objected that he had not given permission for his image to be AI-processed; Dino replied the processing only de-pixelated it and invited anyone to supply a new photo. **No headshot publishes without the subject's recorded approval** — which makes William's card blocked on two things at once, his own sign-off and his Hokuten-vs-SHG decision (WHATS-LEFT C16/C17). Five seats are otherwise complete (Dino, Donna, Jae Hun, Marlon, William). **Razim is the one incomplete slot** — his two same-size files are marked `SUBJECT APPROVAL PENDING` and a third is a 300×400 `ORIGINAL TEMP` placeholder. Razim's new preferred headshot (`full-brand-toolkit/razim-headshot-bw.jpeg`, 1254×1254) needs two operations to match: **(1) background flattened to pure non-gradient white** (it currently carries a slight radial vignette) and **(2) re-crop from 1:1 to ~0.80 aspect (≈1122×1402)** with the team's tighter headroom and shoulder line. Razim owns this (team chat, 2026-08-17 16:07).

### 3.10 A100 Arms

Dino's section 8. The site expresses it across two existing sections rather than one — keep that and place them last (§3.2):

- `#doors` "The Investor" door, verbatim in team voice (`content/doors.ts:61`): *"Current listings are public and link straight to Crexi. Everything that requires confidentiality moves through a100 Arms, our invite-only platform for vetted hotel investors — partnership wind-downs, lender NDAs, ownership transitions where public listing would damage value."* CTA `Request invite to a100 Arms` → `https://a100arms.com/signup`.
- `#mandates` — four `verified-current` mandate rows, closing on the same a100 Arms signup link (`content/mandates.ts:78`).

**Casing is `a100 Arms`, always** (enforced at `content/doors.ts:20-21`). Corroborated by `V2` §4 line 65 and `PROFILE` §1 (co-founded by Dino Monteverde, Razim Meeran, William Betancourt). Do not add a product tour, a100 UI colours/fonts, screenshots, tiers, or match scores (`MandatesSection.tsx:20-21`).

### 3.11 Footer / compliance / legal

**All frozen — byte-exact ports, no paraphrase** (`site/content/compliance.ts`):

Anchors below are re-derived at HEAD (`4a79e56`); **the exported symbol is authoritative**, the line is a convenience.

- Brokerage disclosure — `BROKERAGE_DISCLOSURE` (`:61-62`, hard line break between the sentences):
  > Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534).
  > Dino Monteverde, CA DRE #01948432.
- Out-of-state qualifier — `OUT_OF_STATE_QUALIFIER` (`:95`): *"Nationwide referral network and formal partner-brokerage relationships in every U.S. state for out-of-California engagements. Brokerage of record for all listings."* **See the coverage-sentence check below — this is the one frozen string that may have to change.**
- Trademark microcopy for `#brands` — `TRADEMARK_MICROCOPY` (`:273-274`).
- SMS consent label (`:146`) and the 10DLC brand string (`:136`).
- Copyright — `copyrightLine()` (`content/site.ts:64`): `© 2026 THE HOKUTEN GROUP. All rights reserved.`
- **Exactly ONE** KW Commercial compliance mark, footer only, never the header — `KW_COMPLIANCE_MARK` (`:287-288`).

**Add — footer brand line (R15), the tagline's only placement on the site:**

> True north for hotel owners

Rendered as a mono kicker immediately beneath the footer stacked lockup — uppercase, tracked 0.18–0.32em per §2.2, `--accent-ink` on the footer ground so it passes AA on light and `--accent-on-dark` if the footer resolves dark. It is a brand line, not a claim: it carries no number, no coverage assertion and no award reference, so it needs no register row. **Exactly one instance site-wide** (§7.3 grep gate) — it does not go in the hero, a headline, `<title>`, the meta description or the OG card.

**The governing coverage language — `MANUAL` §2, the CANONICAL COVERAGE AND AUTHORITY SENTENCE, verbatim:**

> Through Dino Monteverde, William Betancourt, Mohamed Razim Meeran, their applicable Keller Williams market centers, and approved cooperating relationships, The Hokuten Group coordinates appropriately licensed hotel work throughout the United States and its territories, including Midwest markets; each assignment is accepted and documented for its property and jurisdiction, while the Japan lane remains a relationship-and-referral collaboration through qualified local professionals and never implies Hokuten brokerage authority in Japan.
>
> A title, home-state license, network relationship, or geographic label never creates authority in another jurisdiction.

This is the manual's controlling public coverage claim, and it caps authority deliberately: coverage exists **per assignment, per jurisdiction, through named people and cooperating relationships**. Two consequences the plan must carry:

1. **`OUT_OF_STATE_QUALIFIER` — default taken (X26, D20).** "Formal partner-brokerage relationships in **every U.S. state**" is exactly the blanket-coverage phrasing the canonical sentence is written to prevent. **The frozen port is kept byte-exact** — it is a `CLAUDE.md` guardrail string and no builder edits it on judgement — and it is flagged for Dino as a post-push compliance item. If he rules the register does not support the every-state claim, the string changes on his word, as a dated decision, after the push.
2. **No Japan or Asia coverage implication ships at all.** §3.14 bans the tagline phrase "from Asia to the Americas"; this bans the *implication* as well — no map, no "Asia-Pacific", no bilingual coverage line, nothing that reads as Hokuten brokerage authority in Japan.

**Add — WhatsApp disclosure**, verbatim (`V2` §9 line 126), beside the public community link:

> WhatsApp may display your phone number and profile information to other community participants. Membership is vetted and subject to community rules.

**WhatsApp invite — unbuilt work, not a done item (F35, P16).** There is **zero** WhatsApp reference anywhere in `site/`: no `chat.whatsapp` string, nothing in `content/compliance.ts` or any content file, no link component. `HANDOFF-02`'s phrase about the website source already using the URL refers to Dino's shipped HTML pack, not this app; `V2` §11 step 8 makes *"add the verified WhatsApp invite URL and phone-visibility/vetting disclosure"* an explicit implementation step.

- **Link:** `https://chat.whatsapp.com/Jk5rP0D1ad4J68SnGo8KJG`. The former `CyEa…` invite is historical and **must not be restored.**
- **Placement (decided):** the footer legal row, with the disclosure above rendered immediately adjacent — same visual block, never a link on its own.
- **Pre-release check (`HANDOFF-03`):** confirm the link opens the intended community from **both desktop and mobile** before release; record the result in §6.2.
- §5.2's analytics vocabulary includes a WhatsApp click event, which cannot fire until this link exists.

**Do not swap** the frozen brokerage disclosure for `PROFILE` §8's compliance line (*"The Hokuten Group is a real estate team at Forward Wilshire Inc dba Keller Williams Larchmont, CA DRE #01870534. Dino Monteverde CA DRE #01948432."*) — the two are substantively identical and the site's version is a byte-exact port under the compliance-block guardrail. Logged as X8.

**Paperwork-gate-blocked rows — legal routes *and* two trademark exposures.** `PLACEHOLDERS.md` marks all of these `blocked: paperwork-gate`, and the plan must carry the second pair as well as the first:

- **Legal routes** (`/privacy`, `/sms-terms`, `/accessibility`): controller-entity naming, SMS brand re-registration, accessibility internal-path citation — rows #1–2, #14–16, #20.
- **#35 — franchise-chip trademark / trade-dress clearance.** Fifteen shipped chip PNGs at `#brands` are Razim's own rendered approximations of franchisor marks. Not cleared by counsel; Razim accepted an internal-only interim posture, which is not a substitute for clearance before a public launch.
- **#35a — glyph-mosaic artwork, third-party signage.** Several supplied artwork masters depict real, legible third-party hotel signage. The clearest exposure is the **hero LCP slide**, whose alt text names real Marriott signage (`content/heroSlides.ts:137`) — `docs/RESUME.md` flags this as the first time a franchisor brand appears in hero imagery and marks it "flag for business review."

Both #35 and #35a are gate items in §6.1 and Dino asks in §8.1 (**D21**). The site does not go public with two uncleared third-party trademark exposures on its first screen and its brand rail.

### 3.12 FAQ (`#faq`)

**P0.** Five of seven answers carry live `[PLACEHOLDER:confirm — …]` markers that render as an unmissable red/alert block (`content/faq.ts:67, 74, 82, 90, 107`; convention documented at `:13-18`; `FaqSection.tsx`; `PLACEHOLDERS.md` #24–28). **None may go public.**

**Decision (D3): all five are CUT for launch.** Only fully-answered FAQs render. This is a **cut, not a wait** — P9 is a deletion portion that runs in wave 3 with everything else, and each question is re-added verbatim when Dino supplies the answer.

| # | Question | Placeholder subject | Resolution |
|---|---|---|---|
| 3 | Is my inquiry confidential, and can you run a quiet process? | buyer-side NDA mechanics — who signs, at what stage, what is gated | **Cut** (re-add on Dino's answer) |
| 4 | How do I get access to off-market deals? | the a100 Arms vetting bar — proof of funds, mandate, minimum check size | **Cut** (re-add on Dino's answer) |
| 5 | Can you work with a 1031 exchange? | QI coordination / referral relationships | **Cut** (re-add on Dino's answer) |
| 6 | What does a valuation cost, and when does an engagement start? | fee/engagement terms — commission, marketing-cost allocation, listing term/exclusivity, cancellation | **Cut** (re-add on Dino's answer) |
| 7 | Who is the brokerage of record, and can you work outside California? | KW / Forward Wilshire paperwork gate; team block vs. Dino individually | **Cut** — the answer is gate-dependent (L9(1)); re-add at cutover once the FBN filing and broker email exist |

Questions 1 and 2 are clean and stay, so `#faq` ships with two answered questions. Shipping a marker is not an option, and a section with two honest answers is better than one with five red blocks. The five cut questions and their subjects stay recorded here so nothing is lost.

### 3.13 Metadata / SEO / noindex

| Field | Current | New |
|---|---|---|
| Root title default (`layout.tsx:139-164`) | `The Hokuten Group — Hospitality Investment Sales` | unchanged |
| `/` title (`page.tsx:46-49`, `content/site.ts:55` `SITE_TITLE`) | `THE HOKUTEN GROUP — Hospitality Investment Sales` | unchanged |
| `/` description (`content/site.ts:58-60` `SITE_DESCRIPTION`, verbatim kwc `og:description` port) | `Hospitality investment sales across the United States. Data-grounded pricing. Disciplined open-market execution. Closed deals.` | unchanged — **recommended.** `V2` §1 says keep the kwc base, and the two candidate replacements conflict with each other (X3) |
| Root description (`METADATA_DESCRIPTION`, computed from `content/stats.ts`) | `Hospitality investment sales, nationwide. $200M+ closed across 12 hospitality transactions. Written BOV in 48 hours on receipt of T-12, STR, and PIP.` | **Amend** — "$200M+ closed across 12 hospitality transactions" edges toward the forbidden compression. Change to `$200M+ in aggregate transaction volume across 12 hotel and hospitality transactions.` |
| OG / Twitter | same title/description; `summary_large_image` | unchanged; regenerate `og-gold.png` for the new palette |
| `icons.icon` | `themePresentation.favicon` | unchanged; regenerate for the new palette |
| Structured data (`components/seo/JsonLd.tsx`) | server-rendered schema.org | verify the org name, brokerage-of-record, and award statements match L6 |

**NOINDEX — two mechanisms, both must move at CUTOVER (§6.4), never at a push (§6.3):**

1. `site/lib/seo.ts:146` — `export const INDEXING_ENABLED: boolean = false;` drives `app/robots.ts`, `app/sitemap.ts`, and `robotsMeta()`.
2. `site/app/layout.tsx:163` — `robots: { index: false, follow: false }` hardcoded in root metadata, **independent of `INDEXING_ENABLED`**. `app/page.tsx:46-49` sets only `title`/`description`, so Next merges the parent's `robots` down onto `/`.

**Cutover order (P12, gated):** set `SITE_DOMAIN` in `content/site.ts:187` (today `null`, fallback `hokuten.vercel.app`) **first**, at DNS cutover → flip `INDEXING_ENABLED` → remove/override the layout `robots` object (or add `robots: robotsMeta()` to `page.tsx`'s metadata) → verify the rendered `<meta name="robots">` on `/`, `/privacy`, `/sms-terms`, `/accessibility` → confirm `robots.txt` emits `Allow: /` + `Disallow: /api/` + a `Sitemap:` line.

`V2` §11 sequences this as **step 14**, after step 13 ("Complete the Launch Decision Checklist and obtain Dino's approval"). The production deployment stays `noindex`/`nofollow` until then. **Deliberate exposure (R11):** `hokuten.vercel.app` is left publicly reachable — no Vercel Deployment Protection — because Dino has to be able to review it (`PLACEHOLDERS.md:167` row 58). Anyone with the link can see it, franchise chips and CoStar badges included; that is a separate, accepted exposure from the indexing gate, and it is why D21's clearances sit on the cutover gate rather than the build.

### 3.14 Copy that must NOT ship

| String | Why | Source |
|---|---|---|
| `5×` / "five-time" CoStar | Claims Register v1.1 forbids it; `PROFILE` §5 and its footnote still carry it despite the doc's own correction banner | `KIT`, `EDITS` banner, X5 |
| "Annual 2026" | No such award exists — the only Annual award is 2025 | `KIT` |
| "12 closed hotel sales" | Forbidden compression of the $200M+/12 claim | `V2` §3 |
| "hotel investment platform" | Forbidden descriptor | `MANUAL` §13 line 677 |
| "from Asia to the Americas" | No approved public Japan/Asia description exists — the placeholder in the Japan agreement is unfilled | X2 |
| "Sarhan" / "Mheni" / "Schulman" | Deals scrub, and the Sarhan brand guardrail | `EDITS` §8, `CLAUDE.md` |
| "Hakuten" | Brand spelling guardrail | `CLAUDE.md` |
| Any KW **corporate** award (Forbes etc.) | `prohibited` in the claims register — not the team's awards | ref 06 |
| Sarhan-era "~$1B total hotel sales" and the three Sarhan testimonials | `pending-verification` — permission unresolved | ref 06 |
| QS Cy-Fair `$2.85M`, debt/lender/owner details; the Yulee "Costco anecdote" | Explicitly confidential / explicitly unverified | §3.5 |
| "presented ONLY as Hokuten TEAM recognition" (of the 2025 Top Firm award) | `KIT`'s phrasing; Hokuten did not exist in 2025, so it would be a false claim | X21 |

**Never-ship strings, for the QA greps in §7.3.** These are *search targets*, not copy — they deliberately do not appear in the Appendix B paste bank:

- NEVER: `5×` · `5x` · `five-time CoStar` · `Annual 2026`
- NEVER: `12 closed hotel sales`
- NEVER: `hotel investment platform`
- NEVER: `from Asia to the Americas`
- NEVER: `Sarhan` · `Mheni` · `Schulman` · `sarhanhotelgroup.com` (guardrail comments in code excepted)
- NEVER: `Hakuten` — the brand is **HOKUTEN**

### 3.15 About / operating model — **decided (D10)**

Two blocks of approved-verbatim copy are collected in this plan and had nowhere to land:

1. **`V2` §5's four-paragraph Company About bio** (`locked, verbatim`), currently treated in X3 only as a metadata-description question. The site has **no About or company-bio surface** among its twelve screens, and `KIT`'s finish list carries an open item: *"Company profile copy applied to site + LinkedIn company page + directories."*
2. **`V2` §3 line 51's operating-model paragraph** (Appendix B6) — approved copy with no section, no F-row and no portion.

**Decision (D10, default taken 2026-08-17):**

- **`V2` §3 line 51's operating-model paragraph (Appendix B6) becomes the `#method` section intro.** It is short, approved verbatim, and describes exactly what that section shows. It gets an F-row and rides in P5/P6.
- **No separate About surface ships.** The four-paragraph `V2` §5 Company About is **not** pasted anywhere on the site: the two candidate blocks conflict (X3) and `PROFILE` §§5–6 are dead (D11), so the site keeps its existing `SITE_DESCRIPTION` (a byte-exact kwc port) and `KIT`'s "company profile copy applied to site + LinkedIn + directories" finish-list item is satisfied **off-site** (LinkedIn company page + directories, WHATS-LEFT B5).
- Dino sees the `#method` intro on the production URL. If he wants a full About surface, it is scoped as post-push work, not a launch blocker.

---

## 4. Asset plan

| # | Source | → site path | Dims / format | Prep step | Status |
|---|---|---|---|---|---|
| A1 | `01_Logo_Lockups/KW_Commercial_Stacked_..._Transparent.png` | `public/brand/lockup-stacked-gold.png` | 2400×1836 PNG | already byte-identical in repo | ✅ present |
| A2 | **`01_Logo_Lockups/KW_Commercial_Linear_TheHokutenGroup_Gold_on_{Charcoal,White}.png`** (3762×1184 / 3600×1022 transparent) | `public/brand/lockup-linear-header.{png,avif}` + `@2x` | ~176×50 / **@2x ≥352×100** | `scripts/identity-prep.ts` — **re-point the source** (today it derives from `Ref/site/logo-yellow.jpg`, 917×758, producing a 176×132 *stacked-proportion* mark in a linear slot) and **fix the backwards `@2x`** (117×88 today, smaller than the 1×). Variant chosen by R14. `public/brand/lockup-linear-gold.svg` already exists, unreferenced — wire it or replace it | ❌ **wrong mark shipping** |
| A3 | `Ref/site/logo-yellow.jpg` | `public/brand/lockup-gold-xl.{png,avif}` | 854×640 | `identity-prep.ts` | ✅ present |
| A4 | generated | `public/brand/favicon-gold.svg` | SVG | `scripts/hanko-build.ts` — **re-run for the new palette** | 🔁 regenerate |
| A5 | generated | `public/brand/apple-touch-icon.png` | 180×180 | `hanko-build.ts` / `identity-prep.ts` — re-run | 🔁 regenerate |
| A6 | generated | `public/og/og-gold.png` | 1200×630 | `scripts/og-gen.ts` — update `#B8902E`→`#B08D3F` at `:272,:274`, re-run | 🔁 regenerate |
| A7 | generated | ASCII/glyph art under `public/` | SVG/PNG | `scripts/ascii-gen.ts` — update gold ramp **and** `MEASURE_FONT_STACK` to JetBrains Mono, re-run | 🔁 regenerate |
| A8 | `Ref/hero/` (9 files, D23) | `public/hero/*` (67 derivatives) | 4:1 / 16:7 / 4:3 | `scripts/hero-prep.ts` — re-run only if the artwork ramp changed | ✅ present, `interim-resolution` |
| A9 | supplied chips | `public/brands/*` | — | `scripts/brand-chips.ts` — re-run if chip ground shifts | ⚠️ check |
| A10 | menu art masters | `public/menu/*` | — | `scripts/menu-prep.ts` — **parked** (D26 replaced the photo panel with the lockup); no re-run needed | parked |
| A11 | glyph-mosaic masters | `public/art/*` | — | `scripts/artwork-prep.ts` — re-run for the new art ramp | 🔁 regenerate |
| A12 | **Shipping now:** `Ref/site/US_2025Annual_TopBroker.png` (600×135 email signature). **Must become:** `Dino Monteverde - CoStar 2025 Annual Top Broker - Winner Badge.png` (355×333, Social Media Kit) | `public/awards/costar-top-broker-2025.{png,avif}` | 581×135 today → **355×333 native** | Re-intake unmodified; re-spec the slot (F38) | ❌ **wrong asset shipping** |
| A13 | **Shipping now:** `Ref/site/powerbroker-q3-2025.png` (1200×270 email signature). **Must become:** `… 2025 Q3 Quarterly Deals - Winner Badge.png` (784×784) | `public/awards/powerbroker-q3-2025.*` | 747×168 today → **784×784 native** | Re-intake unmodified (F38) | ❌ wrong asset |
| A14 | **Shipping now:** `Ref/site/powerbroker-q1-2026.png` (1200×270). **Must become:** `… 2026 Q1 Quarterly Deals - Winner Badge.png` (784×784) | `public/awards/powerbroker-q1-2026.*` | 747×168 → **784×784** | Re-intake unmodified (F38) | ❌ wrong asset |
| A15 | **Shipping now:** `Ref/site/powerbroker-q2-2026.png` (1200×270). **Must become:** `… 2026 Q2 Quarterly Deals - Winner Badge.png` (784×784) | `public/awards/powerbroker-q2-2026.*` | 747×168 → **784×784** | Re-intake unmodified (F38) | ❌ wrong asset |
| A16 | **Shipping now:** `Ref/site/US_2025Annual_TopFirm.png`, SHA-256 `94af4db4…68dd04` — **the README-excluded prior-firm email signature** (identical bytes to the file A28 forbids). **Must become:** `US_2025Annual_TopFirm_WinnerBadge.png` (355×333, Social Media Kit zip only — absent from `Media (1).zip`). **Per D16 it is replaced, not dropped** | `public/awards/costar-top-firm-2025.*` | 581×135 → **355×333 native** | Re-intake unmodified; separate block only (F38) | ❌ **P0 — excluded asset live** |
| A17 | `Canonical Uniform 2026-08-12/Dino Monteverde Headshot B&W.png` | `public/team/dino-monteverde.jpg` | 919×1149 today; source 1117×1408 | already shipping | ✅ present |
| A18 | `Canonical Uniform .../William Betancourt Headshot B&W.png` | `public/team/william-betancourt.jpg` | 1122×1402 (0.800) → resize to the team's render size | sharp resize; **`blocked: subject approval` (C17)** — his card renders without a portrait until he signs off (§3.9) | ❌ **missing on site** |
| A19 | `Canonical Uniform .../Donna Yangyang Headshot B&W.png` | `public/team/donna-yangyang.jpg` | 1122×1402 | resize | ❌ missing |
| A20 | `Canonical Uniform .../Jae Hun Jeong Headshot B&W.png` | `public/team/jae-hun-jeong.jpg` | 1086×1448 (**0.750 — the odd one out**) | resize; reach the rendered aspect via `object-fit: cover`, or get a re-crop approved by Dino and Jae | ❌ missing |
| A21 | `Canonical Uniform .../Marlon Guzman Headshot B&W.png` | `public/team/marlon-guzman.jpg` | 1122×1402 | resize | ❌ missing |
| A22 | `full-brand-toolkit/razim-headshot-bw.jpeg` | `public/team/razim-meeran.jpg` | 1254×1254 → ≈1122×1402 | **flatten background to pure white; re-crop 1:1 → 0.80 aspect** to match the canonical set | ❌ **Razim owns** |
| A23 | — | listing photography for the 3 allowlist properties | — | none exists unbranded — Sarhan-branded flyers cannot be used | ❌ **Dino owes** |
| A24 | — | closing-property photos | — | six already ship in `public/hotels/` — **but no source, licence or permission is recorded for any of them** (`HANDBOOK` HB:264, §3.4). Add a claims-register row per photo before launch | ⚠️ **rights unrecorded** |
| A25 | — | hero video + poster | 1920×1080 / mp4 / webm | **D5: no hero video ships** — the approved slideshow is the hero. The only video in the delivery is Sarhan-branded-era | n/a — not launch scope |
| A26 | `02_Covers/LinkedIn_Cover_1584x396_HOKUTEN.png` etc. | — | — | **not site assets** — social aspect ratios; reference only for OG treatment | n/a |
| A27 | `MEDIA/Social Media Posts Photos/*` (10 flyers) | — | — | **BLOCKED** — Sarhan Hotel Group branding + legacy domain | ❌ unusable |
| A28 | `Reference Only - Prior Firm - …Email Signature.png` | — | — | **NEVER on the site** (README-excluded). **It is on the site today**, as a 581×135 resize at `public/awards/costar-top-firm-2025.png` — see A16 | ❌ **excluded asset live** |
| A29 | `Ref/site/{US_2025Annual_TopBroker,US_2025Annual_TopFirm,powerbroker-q1-2026,powerbroker-q2-2026,powerbroker-q3-2025}.png` | — | — | **Delete after A12–A16 are re-intaken** (F39) so the email-signature banners cannot be picked up again | ❌ to remove |

**Missing-asset register with owners — every row now has a default (§8.1)**

**Source convention (R17/P17):** the assets the prep scripts read are **copied into tracked `Ref/` subfolders** — `Ref/awards/` (the five Winner Badges), `Ref/team/` (the canonical uniform B&W headshots including Razim's new one), `Ref/brand-kit/` (the two kit lockup PNGs), `Ref/listings/` (listing social images). The `Media`/Social-Media-Kit paths named in the table above are the **origins**; scripts point at `Ref/`.

| Gap | Owner | Default that ships |
|---|---|---|
| Razim's canonical headshot (white flatten + 4:5 re-crop) | **Razim** | Prep it in P17/P8. Until it exists his card renders without a portrait — the same rule as William's |
| Unbranded property photography for the 3 allowlist listings | **Dino** | **D12** — honest interim artwork ships; swapped when photos arrive with provenance |
| Hero video vs. poster-only | **Dino** | **D5** — slideshow ships, no hero video |
| Crexi URL for Quality Suites Cy-Fair | **Dino** | **D7** — a P7 worker verifies the Crexi record; if unverifiable that card ships with no Crexi link |
| Confirmation all three listings are still active | **Dino** | **D8** — all three treated as active on the strength of the 2026-08-17 50-mile sweep |
| Five FAQ answers | **Dino** | **D3** — the five questions are **cut**; re-added when he answers |
| Renaissance Reno keep/pull | **Dino** | **D4** — the card stays |
| Bios + headshots for the roster seats | Donna → **Razim** (already emailed) | `V2` §6 role paragraphs cover the interim |
| The four Winner Badge PNGs + `US_2025Annual_TopFirm_WinnerBadge.png` | **Razim** (files are in the delivery) | **P0, buildable now** — re-intake all five into `Ref/awards/` and `public/awards/` (P15). The excluded prior-firm signature is live today and must go |
| Which award artwork Dino approved | **Dino** | **D16** — Social Media Kit Winner Badges at native aspect, all five in `#stats`, Top Firm in its own prior-firm/team block |
| Claims & Coverage Register v1.1 | **Dino** | **D17** — `V2` §2's approved wording is the caption source and alt text equals caption text; closing figures stay the frozen kwc port. Reconciled against the register post-push (G7) |
| William's recorded approval of his published headshot | **William** → Razim | **`blocked: subject approval` (C17)** — his card ships without a portrait; unchanged by any default here |
| Image-rights record for the six closing photographs | **Dino / Razim** | Required before the push — a `verified-current` row per photo in skill ref 06 (§6.2) |

---

## 5. Deployment settings

All keys verbatim from `HANDOFF-02`, which states in its own front matter: *"Exact IDs below are intentional — this is the one document where they belong."* So the split is:

- **Given verbatim and to be used exactly:** `MONDAY_WORKSPACE_ID`, `MONDAY_CONTACTS_BOARD_ID`, `ALLOWED_ORIGINS`.
- **Exist in no source document — Razim provisions, Dino verifies:** the Monday API token, the column map, and the two webhook destinations.

### 5.1 Protected intake (Monday)

> **Binding contract for the intake route: [docs/MONDAY-INTAKE-CONTRACT.md](MONDAY-INTAKE-CONTRACT.md)** (2026-08-17). It resolves the conflict between Deployment Settings v2 ("defaults to the Contacts board") and the CRM Guide ("nothing unverified sits in Contacts"): the website **creates only in Unverified Leads / New-Unverified**, reads Contacts for email dedupe (Update-only on an existing item), never writes Buyer Leads or Deals, never creates columns/labels (`create_labels_if_missing:false`), and ships in `INTAKE_DRY_RUN` until Dino returns the schema. The schema request Dino's agents answer is the private `.tmp/private/WEBSITE-MONDAY-INTAKE-SCHEMA-REQUEST-FOR-DINO-2026-08-17.{md,docx}` (it carries the exact IDs; this repo does not). P10's acceptance criteria are the contract's §1 and §6.
>
> **What the Monday token is for (Razim asked, 2026-08-17).** It is Dino's requirement, not the site's invention: `HANDOFF-02` "Protected intake" and `V2` §2 "Forms, privacy and accessibility" require the BOV/contact form to write server-side into the **Keller Williams Commercial | The Hokuten Group** Monday workspace (ID `16861284`), Contacts board `18425213989` — "never expose a Monday token in browser code", success only after confirmed receipt. `MONDAY_API_TOKEN` is a personal API token from any account with member access to that workspace (Monday → avatar → Developers → My access tokens; or an admin-created integration user), stored only as a Vercel env var. Razim is a co-approver of that workspace per the CRM guide, so he can likely mint it himself; otherwise Dino does. **Not needed for waves 1–2** — it gates P10 (wave 3) only, and until it is set the intake route falls back to the tested email webhook. The `Japan | The Hokuten Group` workspace is explicitly NOT an intake target.

| Key | Value | Note |
|---|---|---|
| `MONDAY_WORKSPACE_ID` | `16861284` | "Use only the live Keller Williams Commercial \| The Hokuten Group Monday workspace, exact ID 16861284." |
| `MONDAY_CONTACTS_BOARD_ID` | `18425213989` | "The protected route defaults to the verified Contacts board, exact ID 18425213989." **The server route must reject a configuration that does not match both exact IDs; never choose a write target by board name alone.** |
| `MONDAY_API_TOKEN` | *(unset)* | "set in Vercel; never place it in browser code." |
| `MONDAY_COLUMN_MAP_JSON` | *(unset)* | "set after verifying the current KWC Contacts column IDs." Map `submission_type, source, page, name, company, email, phone, property, market, keys, brand, timeline, comments, consent fields, timestamp,` and UTM values. **The server fixes `submission_type` as `BOV request`.** |
| `FALLBACK_EMAIL_WEBHOOK_URL` | *(unset)* | "a tested server-side email-delivery webhook. A submission is successful only when either Monday or this email fallback confirms receipt." |
| `INTAKE_ALERT_WEBHOOK_URL` | *(unset)* | "a tested alert destination for Monday-routing or total-delivery failures." |
| `ALLOWED_ORIGINS` | `https://thehokutengroup.com,https://www.thehokutengroup.com` | "allow only the exact private preview origin during staging." |

**Legacy workspaces:** the old CRM workspace and its boards are retired; the SHG Archive stays read-only reference; the Ntxhi/Willy workspaces are slated for deletion by Dino. **New since 2026-08-17: the `Japan | The Hokuten Group` workspace is live for the Japan lane — it is NOT an intake target; the website writes only to the KWC Contacts board above.**

**Rate limit:** configure an edge/Vercel Firewall rule for `/api/contact-intake`; the included in-function limit is only a best-effort backstop because serverless instances do not share memory.

### 5.2 Analytics and advertising measurement

In the consent-aware configuration block, replace the null values **only with verified production IDs**: `ga4MeasurementId` · `googleAdsId` · `metaPixelId` · `linkedInPartnerId`. **Do not invent IDs.**

Event vocabulary to implement: page views, traffic/campaign source, scroll depth, phone, email, WhatsApp, Crexi/listing clicks, calculator view/start/result, Calendly, and form start/attempt/success/failure.

**This is unbuilt work with an owner and a portion (F37, P14).** The site has consent plumbing (`lib/consent.ts`, `ConsentProvider`) and **nothing else**: no GA4, Ads, Meta or LinkedIn tag, no `gtag`/`dataLayer`, no event emission anywhere in `components/` or `content/`, and no analytics env var. `V2` §2 bullet 6 makes consent-aware measurement a stop/go gate item and `V2` §11 step 9 requires the real IDs to be inserted and the consent flows tested — so "IDs left null" is a *deliberate trade*, not a default. Two acceptable outcomes, and the plan must pick one before P14 runs:

- **Ship measurement:** P14 builds the config block, the four vendor-ID slots, the per-section event emitters and the five consent-flow tests (accept · reject · custom · revisit · withdrawal).
- **Defer measurement:** record explicitly that the site launches with every vendor ID null, that nothing is transmitted or stored, and that **no first-party-collection or vendor-reporting claim may be made anywhere** until IDs are installed and tested.

Advertising tags stay blocked until the visitor grants advertising consent. With every vendor ID null, no measurement is transmitted or stored — **launch may proceed without measurement**, but do not claim first-party collection or vendor reporting until verified IDs are installed and tested. Test accept, reject, custom choice, revisit, and withdrawal through Privacy choices.

### 5.3 Existing site env vars

| Key | Where | State |
|---|---|---|
| `FRED_API_KEY` | `site/app/api/ticker-data/route.ts:172` | server-side only, already set — **never** a `NEXT_PUBLIC_*` var. **Verify it is present in the Production environment, not just Preview** — the ticker is a live third-party dependency and it is smoke-tested on the deployment at every push (§6.3) and on the production domain at cutover (§6.4) |
| `NEXT_PUBLIC_HOKUTEN_THEME` | `site/lib/theme.ts` | `gold` on Production + Preview + Development. `blue` stays branch-scoped to `theme-blue` (Preview) — **stop fast-forwarding that branch** per L1 |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | `site/lib/web3forms.ts` | **retired** by §3.7 — remove after `/api/contact-intake` lands |
| `SITE_DOMAIN` | `site/content/site.ts:187` | `null` → `thehokutengroup.com` at cutover |
| `CALENDLY_URL` | `site/content/site.ts:168` | `null` → `https://calendly.com/dino-monteverde-kw` (`V2` §8 line 119, verified). Clears `PLACEHOLDERS.md` #29; the `hide_gdpr_banner=1` omission (#44) stands |
| `ga4MeasurementId` · `googleAdsId` · `metaPixelId` · `linkedInPartnerId` | consent-aware config block (F37) | all unset — see §5.2 |

### 5.4 Vercel / DNS

- Deploys go through **GitHub → Vercel only**. Never CLI-deploy. Local CLI is config-only: `vercel whoami` first, `--scope hokuten1` on every command, team `hokuten1`, project `hokuten`.
- Keep every staging page **noindex, nofollow, and unlinked**.
- Preserve all nameservers and Google Workspace **MX / TXT / SPF / DKIM / DMARC** records. Change only the required GoDaddy records.
- Save the current KWC source/deployment and the complete DNS record set as **rollback evidence** before touching anything.
- After the new site passes production QA, configure a **one-hop, path- and query-preserving HTTP 301** from `kwc-dinomonteverde.com` to the matching `thehokutengroup.com` path. **Do not retain a separate old-site landing page.**
- Keep rollback available for **30 days**; monitor forms, redirects, SSL, 404s, indexing, and email for at least **72 hours**.

---

## 6. Gates + runbook — push to production now, cutover gated

**The two-step launch (L15).** The build is pushed to the Vercel **production** deployment (`hokuten.vercel.app`, `noindex`/`nofollow`) as a normal portion boundary, and Dino reviews and iterates there. The **cutover** — dropping `noindex`, pointing `thehokutengroup.com`, and the 301 from `kwc-dinomonteverde.com` — is the gated launch-day step and waits on §6.1. Nothing in this document lifts that guardrail.

### 6.1 Cutover gates (all open — L9 plus the five this plan adds)

**These gate the cutover only.** They do not gate the build, the merge to `main`, or the push to the production deployment while it stays `noindex`. `CLAUDE.md`'s hard guardrail — no public deploy under the Hokuten name until the KW / Forward Wilshire paperwork clears — is what they enforce.

| # | Gate | Owner | Evidence required |
|---|---|---|---|
| G1 | Forward Wilshire files "The Hokuten Group" as a fictitious business name with DRE. The name contains no licensee surname, so **the broker files it — a written "approved" alone does not cover it.** | Dino / broker | Filed FBN record |
| G2 | Broker email approving the **name** and the **Managing Director** title | Dino | The email itself |
| G3 | DRE/licence numbers for William and Razim **before either is named on first-point-of-contact marketing** | Dino / Razim | Current lookup PDFs or screenshots in the compliance file. **Ambiguity (X7):** `V2` already discloses FL `BK3200675` and IL `#475.213653`; `EDITS`/`KIT` still frame the gate as CA-DRE-shaped, which neither holds. **Default taken (D9):** William ships with "Florida BK3200675"; Razim's card carries no licence number and no licensed-activity claim until he states his status (R8). Dino rules on what satisfies the gate before cutover. |

Plus, from `V2` §2, before cutover: supervising-broker approval of the exact footer, the Hokuten name, the KW lockup, and the redirect · E&O coverage and insured-name relationship confirmed · CoStar/trademark usage guidance confirmed by Razim as deployment owner · Dino approves the final badge placement and size · the **Launch Decision Checklist** completed with Dino's approval (an external document not in the reviewed set — see X10).

**Additional gate items this plan adds, each evidenced before `noindex` comes off:**

| # | Gate | Owner | Evidence required |
|---|---|---|---|
| G4 | **Lockup deployment.** The `ADDON` README gates the KW/Hokuten lockups on G1 — they may not render **publicly** before the name is papered. On the `noindex` production deployment they render for review | Dino / broker | Same evidence as G1 |
| G5 | **#35 — franchise-chip trademark / trade-dress clearance** for the 15 rendered chips at `#brands`. **D21: the chips and the artwork stay** (Razim's 2026-08-10 decision) — clearance gates the cutover, not the build | counsel, via Dino | Written clearance or a decision to pull the rail |
| G6 | **#35a — third-party signage in the glyph-mosaic artwork**, including the Marriott signage named in the hero LCP slide's alt text (`heroSlides.ts:137`) | counsel, via Dino | Written clearance, or replace the affected masters |
| G7 | **Claims & Coverage Register v1.1 delivered**, and every award caption, alt string, closing-card figure and listing fact checked against it. **D17: it was not delivered, so the build proceeds on the documented fallback** — `V2` §2's quoted approved wording is the caption source, alt text equals caption text, and the closing-card figures stay as the frozen kwc port Dino authored. The check against the register happens when the register arrives | Dino | The register itself + a checked-off pass |
| G8 | **Subject approval per published headshot** | each subject → Razim | Recorded approval, per seat. Unchanged: no headshot renders on a publicly reachable URL — production deployment included — without it. William's portrait waits on C17; until then his card renders without a portrait |

### 6.2 Pre-push checklist (everything not gate-dependent)

**Definition of done (`CLAUDE.md`) — every user-visible change:** spec `approved` → built to tokens → design-skill `audit` passes with **no P0** → perf gates green (skill ref 05) → QA greps pass (skill ref 07) → dated PROJECT-MEMORY entry written.

Merged with Dino's list. Every box below is buildable and verifiable **now** — none of it waits on a gate.

- [ ] All §2 token and face changes landed; `docs/design/CONTRAST.md` re-run and re-pasted, **zero FAILs**
- [ ] Every generator script updated and re-run; no stale raster carrying the old gold
- [ ] Section order + renumbering applied; `nav.ts` matches; no duplicate index
- [ ] Hero copy = `V2`'s locked strings (R4); hero measures **exactly one usable screen** at 1440×900 and 1920×1080 (D25)
- [ ] **Award assets are the approved Winner Badges** — all five re-intaken unmodified at native aspect, the README-excluded prior-firm signature absent from `public/` and `Ref/`
- [ ] Award split correct: 4 individual + 1 separately-labelled prior-firm/team block; badges unmodified and non-linking; the `costarpowerbrokers.com` verification link and the three Quarterly badges still render after the `3×` row is removed (R6)
- [ ] **Award captions and alt text come from `V2` §2's quoted approved wording** (D17 fallback); alt text equals caption text; a `verified-current` register row records the fallback and names the register check as outstanding
- [ ] **Closing-card figures ship as the frozen kwc port** (D17) — no figure invented, no figure edited; the register check is recorded as a post-push verification item for Dino
- [ ] **Every new public claim has a dated `verified-current` row in skill ref 06**: listing facts, revised stats and the $200M+ hedge, award wording, each seat's licence line, image rights for the six closing photographs
- [ ] **Image rights recorded** for all published photography (source · licence or written permission)
- [ ] **Each published headshot has the subject's recorded approval** (G8) — William's card renders without a portrait until C17 clears
- [ ] **WhatsApp invite + adjacent disclosure live**; link confirmed to open the intended community from **desktop and mobile**
- [ ] **Coverage language**: the frozen `OUT_OF_STATE_QUALIFIER` port ships byte-exact (D20) and is flagged for Dino post-push; no new blanket-authority claim anywhere; no Japan/Asia coverage implication (D2)
- [ ] **Kanji check**: no headline, brand line, wordmark, `<title>` or OG string renders 北天 in place of the English name
- [ ] Deals scrub verified: `grep -rin "sarhan\|mheni\|schulman"` → **0** in shipped copy; provenance line present; both William credit lines present
- [ ] Listings = exactly 3 allowlisted properties; `/api/public-listings` proxy live and tested (3 approved, 1 non-approved, source failure, image/link validation, cache, same-origin)
- [ ] `/api/contact-intake` live; all nine deliberate tests pass; success only on confirmed receipt; SMS consent server-recorded
- [ ] **Zero `[PLACEHOLDER:confirm]` markers render anywhere** (P0) — the five unanswered FAQs are **cut**, not deferred (D3)
- [ ] Team = six seats, exact titles, "Jae Hun Jeong" with no "Q", Donna Yangyang; featured Dino / Razim / William with bios, Donna / Jae Hun / Marlon as the compact roster row (R7); no licence claim for Donna/Jae/Marlon; **Razim's card carries no licence number** (R8)
- [ ] Calculator parity suite green (128/128); `tsc --noEmit` clean; `pnpm build` green
- [ ] D29 horizontal-overflow gate green at 375 / 768 / 1440 / 1920 / 2560
- [ ] Panel-fit measured; no section carries `scroll-well` / `overflow-y-auto` / a fixed content height (D28)
- [ ] Mobile responsiveness, cross-browser, no 404s or broken links
- [ ] All forms tested (BOV + calculator email capture)
- [ ] Analytics IDs installed and the five consent flows tested (accept · reject · custom · revisit · withdrawal) **or** consciously left null with the "no first-party-collection / no vendor-reporting claim" note recorded (§5.2)
- [ ] Privacy / accessibility / SSL / metadata / social card / sitemap / robots / schema QA complete
- [ ] **NOINDEX still in place** — both mechanisms (`lib/seo.ts:146` and `app/layout.tsx:163`), verified on all four routes
- [ ] Dated PROJECT-MEMORY entries written for every approved decision, newest first, including the supersessions in P13

### 6.3 Push to production

A normal portion boundary, not launch day. Razim personally performs it (MANUAL-SEND RULE, §6.4).

1. Merge the wave's work to `main`. **GitHub → Vercel auto-deploys. Never CLI-deploy.**
2. Confirm the deployment is the **production** one for project `hokuten` (team `hokuten1`) and resolves at `hokuten.vercel.app`.
3. Verify `noindex` on the live deployment: rendered `<meta name="robots">` on `/`, `/privacy`, `/sms-terms`, `/accessibility`, plus `robots.txt`. **`SITE_DOMAIN` stays `null`; `INDEXING_ENABLED` stays `false`.** Deployment Protection stays **off** — Dino has to be able to open the URL (R11).
4. Runtime smoke test on the deployment: `/api/public-listings`, `/api/ticker-data` (confirm `FRED_API_KEY` is set in Production), `/api/contact-intake` — evidence recorded (`HANDOFF-03` decision #8).
5. Send Dino the URL and the short list of recorded deviations he has not seen: the paper/dark-hero chassis (R1 · `V2` §1 line 8), the dark nav bar with the on-charcoal linear lockup (R14), `#doors` carrying the marketplace intent (R16), the `#stats` badge consolidation (D16), the five cut FAQs (D3), and the gold delta between the `#B08D3F` CSS and the `#B8943D` rasters (D14).
6. Iterate on his feedback in place. Repeat 1–5 per wave; nothing here needs re-approval from a gate.

### 6.4 Cutover (gated)

> **DNS is Razim's, at the very end.** Razim adds the Vercel-issued records at GoDaddy for `thehokutengroup.com` (~10 minutes) once everything is final — while **preserving the existing Google Workspace MX/TXT/SPF/DKIM/DMARC records untouched** (`HANDOFF-02`). The 301 from `kwc-dinomonteverde.com` is configured on that domain separately (Dino's), one hop, path- and query-preserving.

> **MANUAL-SEND RULE (`MANUAL` line 696), binding on every step in §6.3 and §6.4:** *"AI and automation may research, organize, compare, and draft. They never autonomously negotiate, promise, send, publish, import, merge, pay, sign, change a live account, or create a Deal. The authorized human reviews context and personally performs the live action."* **Razim personally performs every push, deploy, DNS change, Vercel configuration, Search Console submission and account action.** Agents produce diffs and evidence; they do not touch Vercel, GoDaddy, Search Console, Monday or any live account.

**Do not start until every one of these is evidenced:**

- [ ] **G1–G8 evidenced**; Launch Decision Checklist completed with Dino's approval
- [ ] **#35 and #35a clearances evidenced** (G5, G6) — or the chip rail / affected artwork pulled
- [ ] **Claims & Coverage Register v1.1 received**, and every award caption, alt string, closing-card figure and listing fact checked against it (G7) — the D17 fallback is reconciled here
- [ ] **`V2` §12's three-signature approval block completed** — Dino approval (name + date) · supervising broker/compliance (name + date) · Razim production QA complete (name + date). All three are blank in the source; one signature is not the block
- [ ] **Razim's licence status stated** (R8) and G3 ruled on by Dino
- [ ] Rollback evidence saved (current KWC source/deployment + full DNS record set)

Then, in order:

1. Add the domain to Vercel; change only the required GoDaddy records; preserve nameservers and all mail records.
2. Set `SITE_DOMAIN = "thehokutengroup.com"` (`content/site.ts:187`).
3. Flip `INDEXING_ENABLED = true` (`lib/seo.ts:146`) **and** clear the hardcoded `robots` object (`app/layout.tsx:163`) — both, or the site publishes a permissive `robots.txt` while every page still says noindex.
4. Push to `main`; GitHub → Vercel auto-deploys. **Never CLI-deploy.**
5. Verify the site loads at `https://thehokutengroup.com`; verify rendered `<meta name="robots">` on all four routes; verify `robots.txt` and `sitemap.xml`.
6. Re-run the production-runtime smoke test on the production **domain** (`HANDOFF-03` decision #8).
7. Submit the sitemap to Search Console; update Google Business Profile and structured data.
8. Test every form on production.
9. Configure the one-hop, path- and query-preserving 301 from `kwc-dinomonteverde.com`. No separate old-site landing page.
10. Tell Dino it is live — he does the official launch announcement (his ask, team chat 2026-08-17 16:20).

### 6.5 Post-cutover

- Monitor forms, redirects, SSL, 404s, indexing, and email for **≥72 hours**. Keep rollback available **30 days**.
- Swap in assets as they arrive: unbranded listing photography (D12 interim artwork retires), hero video/poster if Dino ever chooses one (D5 ships the slideshow), roster bios/headshots.
- Re-add the five cut FAQs (D3) as Dino supplies answers.
- Update LinkedIn personal + company pages, CoStar, LoopNet, Crexi, Buildout, Google Business Profile, Facebook, Instagram, X, WhatsApp Business, email signatures, and any active directory — replacing legacy SHG or KWC-only descriptions, old URLs, old social cards, and stale transaction/award counts. **`PROFILE` §8's LinkedIn "Website" field still points at `kwc-dinomonteverde.com` — fix it.**
- **Never create a credibility gap** where a Hokuten email or website sends an SHG-branded OM or legacy KWC-only material (`V2` §9).
- Recurring cadence (not a launch blocker): Campaign A — Hotel News + Current Listings, 2nd Monday; Campaign B — Current Listings + Marketplace Needs, 4th Monday. Regular marketing updates and reporting resume at the beginning of September 2026.
- Write the dated PROJECT-MEMORY entry.

---

## 7. Work breakdown for `/implement-plan`

**Opus 5 builds, Opus 5 reviews, and the orchestrating main loop is Opus 5 (L14).** **Sonnet is not used on this run** — not for builders, not for Explore. No Haiku subagents, no Fable subagents. Portions are ordered by dependency; agent counts assume one file-owner per agent to avoid write collisions.

**Four constraints on how this runs — all mandatory:**

1. **Launch approval per wave.** No fleet launches without an approved launch manifest (how many agents, which models) for that wave. Nothing deploys silently. The wave-1 manifest is below.
2. **No main-loop fallback.** A failed or stalled portion is recovered by respawning the same portion at Opus 5 → a second Opus 5 attempt with a pointer to the partial work → pausing and reporting options. The main loop doing the work is never one of the options. (The skill's generic sonnet→opus escalation rung does not apply here: the ladder starts and stays at Opus.)
3. **Usage telemetry.** A per-model usage snapshot is posted roughly every 7 minutes, with deltas and the Fable share, so spend spikes surface early.
4. **Detail flows through files, not context.** Inter-agent handoff lives under `.tmp/delegation/<run>/`; the main loop spends tokens on judgement and gating, not on code or bulk reading.

**Nothing here is a live action.** Per the `MANUAL` MANUAL-SEND RULE, agents produce diffs, measurements and evidence only. Razim personally performs every push, deploy, DNS change, Vercel/GoDaddy configuration and account change (§6.3, §6.4).

**Every portion's decisions are pre-resolved.** `CLAUDE.md`'s decision protocol — *"pre-resolve decisions in plans before implementing; a plan with open questions is not ready to execute"* — is satisfied: §8 takes every decision and §8.1 supplies a default for every item that used to wait on Dino. The `Gated on` column is now **dependencies and inputs**, not open questions. Only P12 carries a true gate.

| Id | Portion | Scope / files | Acceptance checks | Agents | Gated on |
|---|---|---|---|---|---|
| **P17** | **Repo hygiene** | `git checkout -- The_Hokuten_Group_Brand_Addon_2/`; `.gitignore` for `full-brand-toolkit/`; `Ref/awards/`, `Ref/team/`, `Ref/brand-kit/`, `Ref/listings/`; `CLAUDE.md` path (F39) | All 17 tracked brand-master files restored (the copy inside `full-brand-toolkit/` is byte-identical, so the checkout is safe); `full-brand-toolkit/` gitignored; the five CoStar Winner Badges, the canonical uniform B&W headshots including Razim's new one, the two kit lockup PNGs and the listing social images are **copied** into the tracked `Ref/` subfolders so prep scripts read from `Ref/` per convention; **zero agreements, manuals or chat artefacts enter the repo**; `CLAUDE.md`'s brand-master path matches reality | 1 opus build · 1 opus review | none — **R17 decided** |
| **P1** | **Faces + ramp** | `app/layout.tsx` (F1), `globals.css:21-23,25-72` (F2, F3), `.display-tail` (F9), heading-weight split (`globals.css:455-462`, F8 part 2) | `pnpm build` green with `axes` removed; `tsc` clean; 2 font files per family; hero re-measured to exactly one usable screen at 1440×900 + 1920×1080; no mono label below 0.18em tracking | 1 opus build · 1 opus review | **P17**; R13 approved (supersessions land in P13) |
| **P2** | **Palette + contrast** | `globals.css:168-190, 238-288, 290-363` (F4–F7), `docs/design/contrast.mjs` + `CONTRAST.md` (F10), `lib/theme.ts:88` + parked comments (F11) | `node docs/design/contrast.mjs` → **zero FAIL**; CONTRAST.md transcript matches the run; **no raw hex outside `globals.css`, skill ref 01, and the eight generator scripts enumerated in F12–F14** — run as an actual grep, which is what would have caught `lib/theme.ts:88`; `themeColor` updated; Theme B block byte-unchanged | 1 opus · 1 opus review | **P17**; R1 + R3 Option 1 approved (`--accent #B08D3F`, `--accent-dim #C8A552`) |
| **P3** | **Raster regeneration** | `scripts/{ascii-gen,og-gen,hanko-build,identity-prep,brand-chips,artwork-prep}.ts` (F12–F14) + re-runs; `hero-prep` only if the ramp changed; `menu-prep` parked | Every regenerated asset carries `#B08D3F`/`#C8A552`/`#FBF9F3`; **no `#F7F4ED` or `#B8902E` survives in any regenerated raster**; `ascii-gen` measures against JetBrains Mono; **the header mark is a linear-proportioned derivative of `KW_Commercial_Linear_TheHokutenGroup_Gold_on_Charcoal.png`** (R14) and `@2x` is ≥2× the 1× | 1 opus · 1 opus review | **P2**. Note the schedule risk in §9 X27 — a KW ruling against gold re-runs all of this |
| **P4** | **Vocabulary components** | `atoms/{SectionHeader,MicroLabel,StatNumeral,AccentRule}.tsx` (F15), `cards/*` (F16), `ui/button.tsx` + `nav.ts` CTA + `Hero.tsx` (F17), **`globals.css:74-90` radii + shadow tokens (F8 part 1)** | No `box-shadow` on any card at rest; radii ≤2px; primary CTA is outlined; every kicker is mono uppercase with a gold rule; ticket notch geometry intact | 2 opus (atoms / cards+CTA) · 1 opus review | **P1, P2**; R2 approved |
| **P5** | **Section order + renumber** | `app/page.tsx:69-82` (F18), `content/nav.ts` (F19), section header comments + `MicroLabel index` (F20), `#method` intro slot for B6 (D10) | Order matches §3.2 (`FINAL`'s order per L13; Team and A100 after the BOV ask, R5); `navLinks` and `menuItems` match; indices 01–09 unique and unbroken; every anchor resolves; menu overlay has no normal-case scrollbar | 1 opus · 1 opus review | none — R5 approved |
| **P16** | **WhatsApp invite + disclosure** | footer legal row (F35) | Invite link renders with the verbatim `V2` §9 disclosure immediately adjacent; the `CyEa…` invite appears nowhere; link confirmed to open the intended community from desktop **and** mobile | 1 opus · 1 opus review | none |
| **P15** | **Award-asset re-intake** | `public/awards/*` (all five), `Ref/site/*` deletions, `QuarterlyBanners.tsx:173-176` (F38) | All five files are the approved Winner Badges **from the Social Media Kit at native aspect** (D16), unmodified; SHA-256 of each shipped file matches its Social Media Kit original; the README-excluded prior-firm signature is absent from `public/` and `Ref/`; the strip and the Top Firm block are re-specced for near-square medallions | 1 opus · 1 opus review | **P17** (`Ref/awards/`); D16 default taken |
| **P18** | **Outreach kit + business card fixes** *(non-website)* | **No repo files.** Works in a scratch copy of `full-brand-toolkit/`; output to `.tmp/delegation/<run>/deliverables/` | (a) **Deal card:** the CSS `.brand-mark` (a gold box with the literal text "KW", `styles.css:44-56`) is replaced with an `<img>` of the real stacked lockup already sitting unused in the kit's `assets/KW Commercial - The Hokuten Group - Stacked Lockup.png`; "Hokuten Deal Card Template - Dark" re-exported at 1200×1500 and 2400×3000 retina (headless Chrome/Playwright if present on the machine; otherwise deliver the fixed HTML plus exact export instructions). (b) **Dino's physical card:** front title → **Managing Director**, back domain → **thehokutengroup.com**, in `DINO MONTEVERDE - PHYSICAL BUSINESS CARD - {FRONT,BACK} - EDITABLE.svg`; both 300-DPI proofs and `- PRINT READY.pdf` regenerated (rsvg/cairosvg/Chrome — whatever exists; else deliver the SVG fix + instructions). (c) **Profile cards, short signatures, Apple contact cards ship as delivered.** **Acceptance:** deal card shows the stacked lockup and no literal-text mark; card proofs read Managing Director / thehokutengroup.com; PDF is 3.5×2.0in + 0.125in bleed, 300 DPI | 1 opus build · 1 opus review | none — Dino handed the deal-card fix to Razim (team chat, 2026-08-16 23:24) |
| **P6** | **Content — hero, stats, awards, closings** | `heroContent.ts` (F21), `content/stats.ts` + `StatsSection.tsx` (F22), `awards/QuarterlyBanners.tsx` (F23), `content/closings.ts` + `ClosingsSection.tsx` (F24) | Hero strings byte-match §3.1 (`V2`'s headline per R4; **nothing from `FINAL`'s "signal underneath…" or "from Asia to the Americas" ships**, D2); the locked $200M+ hedge renders verbatim; `836K+ SF` kept (R10); 4+1 split with the **full** Top Firm qualifier, all five in `#stats` with Top Firm in its own prior-firm/team block after the four individual badges (D16); **the Quarterly badges and the `costarpowerbrokers.com` link still render after the `3×` row is removed** (R6); the `Closed transactions` label key is unchanged (or `app/layout.tsx:111-126` changes in the same portion); grid is `lg:grid-cols-3`; provenance line and both William credit lines present; Renaissance Reno card kept (D4); **captions and alt text come from `V2` §2's approved wording, closing figures stay the frozen kwc port** (D17) | 2 opus (hero+stats / awards+closings) · 1 opus review | **P15**, **P5** |
| **P7** | **Content — listings + a100 + metadata** | `content/listings.ts` (F25), `content/site.ts` + `layout.tsx` metadata (F31), `CALENDLY_URL` (F36), doors/mandates placement | Exactly 3 listings, all three treated as active (D8), and a fourth proxy record is dropped and logged; canonical name "The Florida Gateway"; **a worker verifies the Yulee street number against Crexi 2629907 or the county record — if unverifiable the card shows city/state only** (D18); **a worker web-searches the Cy-Fair Crexi record (17550 NW Freeway) and verifies it matches — if unverifiable that card ships with no Crexi link** (D7); zero confidential facts; description amended per §3.13; Calendly CTA no longer degrades to `#bov`; `#doors` carries the marketplace intent and the deviation is recorded (R16/D19) | 1 opus · 1 opus review | **P5** |
| **P8** | **Team roster** | `content/team.ts`, `TeamSection.tsx`, `TeamCard.tsx` (F26) + headshot prep A17–A22 | Six seats, exact titles; **featured Dino / Razim / William with bios; Donna Yangyang / Jae Hun Jeong / Marlon Guzman as the compact roster row** (R7); Razim's title is "Founding Team Member \| Director" (R9); "Jae Hun Jeong" with zero "Q"; no licence claim on Donna/Jae/Marlon; **William ships with "Florida BK3200675"** (D9); **Razim's card carries no licence number and no licensed-activity claim** (R8 default); routing states Dino Monteverde as the destination; no empty `mailto:`; **portraits render at one CSS aspect via `object-fit: cover` on flat white (the sources are not uniform — Jae Hun is 0.750)**; **no headshot publishes without recorded subject approval — William's card renders without a portrait until C17 clears** | 1 opus · 1 opus review | **P17** (`Ref/team/`); **G8** per seat |
| **P9** | **FAQ cut** | `content/faq.ts` (F27) | **Zero `[PLACEHOLDER:confirm]` markers render.** The five unanswered questions are **deleted**, not deferred (D3); questions 1 and 2 remain; the cut questions and their subjects stay recorded in §3.12 for re-adding when Dino answers | 1 opus · 1 opus review | none — D3 is a cut |
| **P10** | **Server intake** | new `app/api/contact-intake/route.ts`, `BovForm.tsx`, retire `lib/web3forms.ts` (F28) | All nine deliberate tests pass; workspace/board IDs hard-validated; token never in browser bundle; success only on confirmed receipt; server-recorded SMS consent; agency-relationship statement present | **Contract: `docs/MONDAY-INTAKE-CONTRACT.md` §1–§6** — write target Unverified Leads/New-Unverified only; dedupe by email across Contacts + Unverified Leads; existing columns only, `create_labels_if_missing:false`; unmapped fields → Relationship Notes line (guide format) + Update; no Deals/Buyer Leads writes; ships in `INTAKE_DRY_RUN=1` until the schema/column map is returned; test items named `WEBSITE TEST — delete me` and deleted. Form gains optional `company/keys/brand/timeline/comments` (v2 §2). | 1 opus · 1 opus review | Monday token + column map + both webhook URLs from Razim (§5.1) |
| **P11** | **Listings proxy** | new `app/api/public-listings/route.ts` (F29) | Only the 3 approved IDs return; public-field whitelist enforced; broader response never reaches browser storage; source-failure path tested; shares P7's fourth-record acceptance check | 1 opus · 1 opus review | a100 source endpoint access |
| **P14** | **Consent-aware measurement** | config block + per-section event emitters (F37) | Four vendor-ID slots wired to the existing consent plumbing; every event in §5.2 emits from a named point; advertising tags stay blocked until advertising consent; five consent flows tested (accept · reject · custom · revisit · withdrawal) | 1 opus · 1 opus review | Verified production IDs from Razim — **or** the documented decision to defer (§5.2) |
| **P12** | **Cutover flip + config** | `lib/seo.ts:146`, `content/site.ts:187`, `layout.tsx:163`, `page.tsx:46-49` metadata (F30); Vercel env; DNS/301 | Both noindex mechanisms move together; rendered `<meta name="robots">` verified on all four routes; `robots.txt`/`sitemap.xml` correct; 301 is one hop and path/query-preserving | 1 opus · 1 opus review | **`blocked: cutover gate`** — L9 / G1–G8 every gate evidenced (§6.4). The only genuinely gated portion in the plan |
| **P13** | **Docs + memory** | `PLACEHOLDERS.md`, `RESUME.md`, `AUDIT_LOG.md`, skill refs 01/03/04/06/07 **and `SKILL.md:71,74`** (F32); `PROJECT-MEMORY.md` (F33); `CLAUDE.md` gold line + brand-master path (F34) | Every superseded rule carries a dated note; PROJECT-MEMORY entries exist for L1, L2, L3, L4, L5, L8, L13, L14, L15, D-FIELD, D-VOCAB; **the `#B8902E` guardrail line in `CLAUDE.md` is changed here, with its supersession recorded** (R3, approved); the Fraunces/IBM Plex Mono supersession is recorded (R13); the recorded deviations from `V2` are written — §1 line 8 chassis (R1) and nav surface (R14), the marketplace/`#doors` reading (R16), `V2` §1 lines 7/9 build-base (§0.4); new `verified-current` register rows exist for every claim listed in F32 plus the D17 caption fallback | 1 opus · 1 opus review | Runs last so it records what actually shipped |

### 7.1 Wave plan and sequencing

| Wave | Portions | Why together |
|---|---|---|
| **W1** | **P17 first, then P1 + P2 + P5 + P16** | P17 puts the brand masters and `Ref/` sources on disk that every later portion reads. P1/P2 are the token layer, P5 is structural, P16 is independent. |
| **W2** | **P3 + P4 + P15 + P18** | Everything downstream of the token layer: rasters, component vocabulary, award artwork. P18 is non-website and touches no repo file, so it parallelises for free. |
| **W3** | **P6 + P7 + P8 + P9 + P10 + P11** | All content and both API routes. P9 is a cut, so it no longer waits on anyone. |
| **W4** | **P14, then P12 (cutover, gated), then P13** | Measurement, the gated flip, then the documentation of what shipped. |

**Push to production (§6.3) happens at the end of each wave**, not only at the end of W3 — Dino reviews as early as W1 if the deployment is coherent.

```
W1  P17 (repo hygiene) ─► P1 (faces) ─┐
                          P2 (palette) ┴─► [push]
                          P5 (order) ───┤
                          P16 (WhatsApp)┘
W2  P3 (rasters) ◄─ P2 ─┐
    P4 (vocabulary) ◄─ P1+P2 ─┼─► [push]
    P15 (award assets) ──────┤
    P18 (outreach kit, no repo files) ┘
W3  P6 (hero/stats/awards/closings) ◄─ P15 ─┐
    P7, P8 (content, parallel) ─────────────┼─► FULL GATE ─► [push]
    P9 (FAQ cut) ───────────────────────────┤
    P10, P11 (APIs, parallel) ──────────────┘
W4  P14 (measurement) ─► P12 (cutover — blocked: cutover gate, §6.4) ─► P13 (docs + memory)
```

**`globals.css` ownership, decided:** P1 and P2 both touch it, so **P2 owns the file**. P1's agent produces a patch against P2's tree and hands it over through `.tmp/delegation/<run>/`; P2's owner applies it. No two agents write `globals.css`. P3 strictly follows P2. P4 owns `globals.css:74-90` only after P2 has landed. P15 precedes P6 (the award split cannot be laid out against artwork that is about to change shape). P6/P7/P8 are independent of each other. P12 runs last and only after every gate in §6.1 is evidenced.

### 7.2 Wave-1 launch manifest

Present this verbatim and wait for approval before spawning anything. Waves 2–4 each get their own manifest at their own boundary.

```
LAUNCH MANIFEST — wave 1/4: repo hygiene + token layer + structure
- 1× Opus 5 builder — P17 repo hygiene (runs first, alone: it moves files every other portion reads)
- 4× Opus 5 builders — P1 faces+ramp · P2 palette+contrast (owns globals.css) · P5 section order+renumber · P16 WhatsApp invite+disclosure
- 1× Opus 5 reviewer — after P17 returns, then again after the four builders return
- 1× Opus 5 Explore — cross-cutting searches at the gate (raw-hex sweep, anchor/index integrity, invite-link uniqueness)
- Running in parallel: 1, then 4 | est. duration: n/a (first wave — pace known after this one)
- No Sonnet, no Haiku, no Fable subagents (L14). Recovery ladder: respawn at Opus → second Opus attempt → pause and report.
Approve, trim, or re-scope?
```

### 7.3 Verification gates (run at every portion boundary; the full set before each push)

| Gate | Command / method | Pass condition |
|---|---|---|
| Build | `pnpm build` from `site/` | green |
| Types | `npx tsc --noEmit --incremental false` | clean |
| Tests | `npx vitest run` from `site/` | 128/128; `lib/valuation.test.ts` untouched |
| Contrast | `node docs/design/contrast.mjs` (repo root) → paste into `CONTRAST.md` | **zero FAIL** |
| QA grep — scrub | `grep -rin "sarhan\|mheni\|schulman" site/` | zero hits in rendered copy (guardrail comments allowed) |
| QA grep — spelling | `grep -rn "Hakuten" site/` | zero outside guardrail comments and the repo path |
| QA grep — awards | `grep -rn "5×\|5x\|Annual 2026\|five-time" site/` | zero (the only legitimate multiplier on the site is the mandates EBITDA range "8x–10x") |
| QA grep — name | `grep -rn "Jae" site/ \| grep -i "\"Q\"\|Q\."` | zero |
| QA grep — descriptor | `grep -rin "investment platform" site/` | zero |
| QA grep — placeholders | `grep -rn "PLACEHOLDER:confirm" site/content/` | zero |
| QA grep — internal scroll | `grep -rn "scroll-well\|overflow-y-auto" site/components/sections/` | zero (D28) |
| QA grep — compliance mark | count `/brand/kw-commercial.png` renders | exactly one, footer only |
| QA grep — CoStar placement | no CoStar asset outside `#stats` | pass — this enforces the site's D12 consolidation and the D16 default (all five in `#stats`, Top Firm in its own prior-firm/team block). The deviation from `HANDOFF-03`'s "Dino team section" placement is **recorded** in P13, not silent |
| Award asset identity | `shasum -a 256 site/public/awards/*.png` vs. the Social Media Kit originals | every shipped award raster matches an approved Winner Badge at its native aspect |
| QA grep — kanji rule | `grep -rn "北天" site/content site/components/brand` | zero occurrences where 北天 stands in for the English name |
| QA grep — WhatsApp | `grep -rn "chat.whatsapp" site/` | exactly one invite, the `Jk5rP0…` link; zero `CyEa` |
| QA grep — footer brand line | `grep -rn "True north" site/` | exactly one, the footer mono kicker beneath the footer lockup (R15); zero elsewhere |
| Overflow gate (D29, hard release gate) | headless: `document.documentElement.scrollWidth === clientWidth` at **375 / 768 / 1440 / 1920 / 2560** | equal at every width |
| Panel fit (D28) | headless measurement of all twelve panels at 1440×900 (one screen = 784px) | **No regression against the 2026-08-10 baseline** — method 1.57 · listings 1.50 · calculator 1.30 · closings 1.10 · team 1.09 · hero 1.03; panels already at ≤1.0 stay ≤1.0. PROJECT-MEMORY records D28 as a density preference, not a functional bug, now that snap is gone — closing the gap is separate scheduled work, **not** a launch gate. Truthful expanded-FAQ overflow still legal |
| Screenshots | Theme G at **375 / 768 / 1440 / 1920**, saved to the session scratch directory (never committed) | one per width; kill the server immediately after |
| Perf / CWV | skill ref 05 budgets; route was 316.8KB gz | no regression; LCP slide is `01-marriott` |
| Design audit | `hokuten-design-director` `audit` verb | **no P0** |
| Noindex (every push, §6.3) | rendered `<meta name="robots">` on `/`, `/privacy`, `/sms-terms`, `/accessibility` + `robots.txt` | `noindex, nofollow` on all four until the cutover gate clears |

**Verification constraint (Razim's standing instruction, `DESIGN-REVISIT-3.md` §"Verification constraint"):** no long-running dev servers, no prolonged local review. Allowed: `pnpm build`, `tsc`, `vitest`, QA greps, asset scripts, and **one transient headless pass** for the overflow/fit/screenshot gates — then `kill` the server. Razim reviews on the Vercel URLs.

---

## 8. Decisions taken — Razim, 2026-08-17

Every recommendation this document made is adopted as the decision. **One item stays open and it is a fact, not a choice: R8.** Each row names the source that carried the recommendation, so the reasoning survives the decision.

| # | Decision | Basis / source |
|---|---|---|
| **R1** | **D-FIELD → Alternative A.** Keep the paper-page / dark-hero / dark-chapter chassis and retune every token to `GUIDE` v1.3's exact values. The deviation from `V2` §1 line 8 is **recorded in PROJECT-MEMORY** (P13), not routed to Dino as an ask — he sees it on production (D16 becomes "recorded deviation", L15). Alternative B (full dark field) is sized in §1.1 as a post-launch revisit. | §1.1; `GUIDE` line 24 and `V2` §1 line 8 both order a dark field; three approved design revisits built and measured the current chassis; Razim, 2026-08-17 |
| **R2** | **D-VOCAB → adopt as recommended.** Primary CTAs become hairline-outlined gold. Ticket resting `box-shadow` → 1px hairline; **perforation/notch geometry stays**. Radii minimised to the ≤2px the notch needs. | §1.2; `GUIDE` lines 27–32 vs. approved D4 component law; Razim, 2026-08-17 |
| **R3** | **Palette → Option 1.** `--accent #B08D3F`, `--accent-dim #C8A552`; **rasters stay `#B8943D`**. **The supersession of the `CLAUDE.md` "website gold `#B8902E`" hard guardrail is APPROVED** and is written in **P13** — the `CLAUDE.md` line change and the dated PROJECT-MEMORY entry land there. | `GUIDE` v1.3 line 19 (design doctrine of record), `MANUAL` §13 line 679, and Razim's own instruction to match Dino's kit (team chat, 2026-08-16 23:26). Decided **against** finding 01 §B, which argued for keeping `#B8902E`, and against the kwc port source, which runs the raster gold `#B8943D`/`#C9A04A` — both are recorded in X4 so the override is visible. Option 2 (`#B8943D` everywhere) was the documented alternative and was not taken |
| **R4** | **Hero headline → `V2`'s:** *"Hotel brokerage and advisory, coast to coast — with systems in place."* **Nothing from `FINAL` ships** — not "The signal underneath every hotel transaction", not "from Asia to the Americas". | The precedence rule (L13): `V2` is newer than `FINAL` and both `EDITS` and `KIT` treat it as current. Resolves X1 without an ask |
| **R5** | **Section order → Dino's, from `FINAL`.** Team and A100 Arms come **after** the BOV ask, exactly as §3.2 lays out. | `FINAL` "SECTION ORDER (EXACT SEQUENCE)"; `V2` states no order, so per L13 the next-newest document speaks |
| **R6** | **Remove the `3×` CoStar stat tile.** The approved sentence plus the five badges carry the claim. | `V2` §3 explicitly warns against numeral compression of the award set |
| **R7** | **Team split:** featured **Dino / Razim / William** with bios; **Donna Yangyang / Jae Hun Jeong / Marlon Guzman** as the compact roster row. | `FINAL` lines 38–41 ("3 team members with bios — Dino, Razim, William… Other team members: Can add later or as links to profiles"); the treatment of seats 4–6 is the compact row |
| **R8** | **Razim's licence status — RESOLVED (Razim, 2026-08-17).** He is currently licensed (Illinois #475.213653) and is pausing that membership soon; he will not perform licensed acts under his own name (no agreements in his name; lead qualification and LOI/PSA drafting run under Dino's licence). **Decision:** the site renders **title only, no licence number, no licensed-activity claim** for Razim from day one — so his card is correct before and after the pause. Consequences: `07` Schedule A should drop him (or carry an end date); his agreements use the non-licensed services framing; `V2` §6 line 80's licence line is not copied to the site. | Razim, 2026-08-17; `V2` §6 line 80; `AGREEMENTS` 07 Schedule A; X7/G3 |
| **R9** | **Razim's public title → "Founding Team Member \| Director."** | `V2` §6 + `ROLES` + his vCard, all later and more specific than `MANUAL` §4's "Associate" (X9). Dino reconciles the Work Manual post-push |
| **R10** | **Keep `836K+ SF`.** | It is `verified-current` in the site's own claims register (skill ref 06). `V2` states no square-footage figure, which per L13 means it does not contradict it (X6) |
| **R11** | **Leave `hokuten.vercel.app` publicly reachable.** No Vercel Deployment Protection — **Dino has to be able to open it** (L15). `noindex`/`nofollow` stays until cutover. | `V2` §11's "noindex, nofollow, and unlinked" is met in the letter; the spirit is traded deliberately for reviewability. Razim, 2026-08-17 |
| **R12** | **Park Theme B.** Its `[data-theme="blue"]` block, `THEME_PRESENTATION.blue` and every `IS_BLUE` branch stay in code but unreachable; not retuned; no deletion this pass. | L1; and on schedule grounds — `IS_BLUE` (`lib/theme.ts:30`) is a dead export consumed by zero files, and the ~fourteen components reading `themePresentation` are surface-agnostic, so deletion is small but still not launch-week work |
| **R13** | **Type → the guide's three faces** (Cormorant Garamond / Inter / JetBrains Mono), replacing Fraunces and IBM Plex Mono. **Both supersessions are written in P13** — PROJECT-MEMORY 2026-08-10 (Revisit 2) and the design-skill non-negotiable at `SKILL.md:74`. | `GUIDE` lines 10–16, corroborated by the kwc port source declaring the same three faces. Without the supersessions the skill's `audit` verb flags the shipped faces P0 and the definition of done cannot be met |
| **R14** | **Nav surface → Option 2: dark bar + the on-charcoal LINEAR lockup.** `KW_Commercial_Linear_TheHokutenGroup_Gold_on_Charcoal.png` becomes the prepared header derivative (P3). Logged as a **recorded deviation from `V2` §1 line 8** with the legibility rationale (P13). | §1.1; `V2` line 8 asks for a white bar because the linear lockup carries dark lettering — the on-charcoal cut solves that problem without inverting the chassis. `SiteNav.tsx:282` already resolves to `surface-dark` over the black hero |
| **R15** | **Ship "True north for hotel owners" as the footer brand line** — a mono kicker beneath the footer lockup. **Nowhere else on the site.** | `GUIDE` line 37 and `PROFILE` carry it; `V2` never uses it, so it gets exactly one restrained placement rather than being dropped or spread. Grep-enforced in §7.3 |
| **R16** | **`#doors` carries the marketplace intent.** No separate marketplace route is built; the deviation from `V2` §2 bullet 8 / §1 line 8 is **recorded** (P13). | The a100 Arms invite in `#doors` already performs the intake function `V2` describes. Scoping a real marketplace route is post-launch work |
| **R17** | **Repo hygiene → restore + gitignore + `Ref/` copies.** `git checkout -- The_Hokuten_Group_Brand_Addon_2/` restores the 17 tracked masters (the copy inside `full-brand-toolkit/` is identical, so nothing is lost); **`full-brand-toolkit/` is gitignored**; and the source assets the build needs — the five CoStar Winner Badges, the canonical uniform B&W headshots including Razim's new one, the two kit lockup PNGs, the listing social images — are **copied into tracked `Ref/` subfolders** (`Ref/awards/`, `Ref/team/`, `Ref/brand-kit/`, `Ref/listings/`) so prep scripts read from `Ref/` per convention. **No agreements, no manuals, no chat artefacts enter the repo.** | `CLAUDE.md` (brand masters are read-only at the repo root; `Ref/` is source material for prep); `full-brand-toolkit/` is Dino's full private delivery, agreements included. Built as **P17**, the first portion of wave 1 |

## 8.1 Defaults taken — Dino iterates on production

**No pre-build questions go to Dino (L15).** Every item that previously read "needs Dino" now carries a documented default, the site is built and pushed to the production deployment, and Dino reviews and iterates there. Each row names what ships if he says nothing.

| # | Item | Default taken | Where it lands |
|---|---|---|---|
| **D1** | Hero tagline (X1) | **`V2`'s headline ships** — *"Hotel brokerage and advisory, coast to coast — with systems in place."* Per the precedence rule (L13/R4) | P6, §3.1 |
| **D2** | "From Asia to the Americas" (X2) | **Does not ship.** No approved public description of the Japan relationship exists — the one-line description in the Japan collaboration agreement is an unfilled placeholder | §3.14 never-ship list; grep-enforced |
| **D3** | Five `[PLACEHOLDER:confirm]` FAQs | **CUT for launch.** Only fully-answered FAQs render; `#faq` ships with questions 1 and 2. Each cut question is re-added verbatim when Dino supplies an answer. **P9 is a cut, not a wait** | P9, §3.12 |
| **D4** | Renaissance Reno closing card | **Stays.** Ships as-is; Dino pulls it on the production review if he wants it gone | P6, §3.4 |
| **D5** | Hero video vs. poster | **Slideshow ships; no hero video.** The approved chromeless slideshow (D24) is already built and measured | no change |
| **D6** | Team featured/roster split | **As R7** — Dino / Razim / William featured with bios; Donna / Jae Hun / Marlon as the compact roster row | P8, §3.9 |
| **D7** | Crexi URL for Quality Suites Cy-Fair | **A P7 worker web-searches Crexi for the Quality Suites Houston NW Cy-Fair record (17550 NW Freeway) and verifies the record matches the write-up.** If it cannot be verified, **that card ships with no Crexi link** | P7, §3.5 |
| **D8** | Are all three allowlist listings still active? | **All three are treated as active.** The 2026-08-17 50-mile owner sweep Dino distributed is built around exactly these three properties — the freshest evidence available. Prices publish on that basis | P7, §3.5 |
| **D9** | Gate G3 / licence numbers (X7) | **William ships with "Florida BK3200675." Razim per R8** — no number, no licensed-activity claim. Dino rules on what satisfies G3 before cutover, not before the build | P8; G3 in §6.1 |
| **D10** | Company About copy (X3) | **`V2` §3 line 51's operating-model paragraph becomes the `#method` intro (§3.15). No separate About surface ships**, and no company bio is pasted; `KIT`'s finish-list item is satisfied off-site (LinkedIn + directories) | P5/P6, §3.15 |
| **D11** | `PROFILE` §5–6 + footnote ("5× CoStar", "Annual 2025 & 2026") | **Treated as dead.** Nothing is pasted from those blocks anywhere, on the site or off it | §3.14; WHATS-LEFT B5 |
| **D12** | Unbranded property photography | **Interim artwork ships**, swapped when real photos arrive with provenance. Every listing flyer in the delivery is Sarhan-branded and unusable | P7, §4 |
| **D13** | Broker approval evidence, E&O, Launch Decision Checklist | **Cutover gate only (L15).** These block §6.4, not the build or the push | §6.1 G1/G2, §6.4 |
| **D14** | Kit gold vs. website gold side by side (X4) | **Option 1 ships** (`#B08D3F` CSS, `#B8943D` rasters). Dino eyeballs the delta on production and says if it bothers him | P2/P3; §2.1 |
| **D15** | Which build ships (X0) | **Resolved (§0.4).** `site/` ships as production, by Razim's build-owner decision. Not a question for Dino | §0.4, L13 |
| **D16** | Award artwork identity and placement (X22, X23) | **The five Winner Badges from the Social Media Kit, unmodified, at native aspect** (P15). **All five in `#stats`**; the four individual badges as the strip, **2025 Annual Top Firm in its own prior-firm/team block after them**. The deviation from `HANDOFF-03`'s "Dino team section" placement is recorded, not silent | P15/P6, §3.3 |
| **D17** | Claims & Coverage Register v1.1 (X10) | **Not delivered, so: `V2` §2's quoted approved wording IS the caption source; alt text = caption text; closing-card figures stay the frozen kwc port (Dino authored them); listing facts come from Dino's July write-ups plus the sweep.** This stays a **post-push verification item** for Dino — when the register arrives, every caption, alt string, closing figure and listing fact is checked against it (G7) | P6/P15, §3.3–§3.5; G7 |
| **D18** | The Florida Gateway street number | **A P7 worker verifies "852374 US Highway 17" against Crexi 2629907 or the county record.** If unverifiable, **the card shows city and state only** | P7, §3.5 |
| **D19** | Marketplace route (R16) | **`#doors` carries the intent**; the deviation is recorded (P13). A real marketplace route is post-launch scope | P7, P13 |
| **D20** | Coverage language (X26) | **Keep the frozen `OUT_OF_STATE_QUALIFIER` port byte-exact** — it is a guardrail string and no builder edits it on judgement. **Flagged for Dino post-push**; if the register does not support the every-state claim, the string changes on his word as a dated decision | §3.11; WHATS-LEFT C-row |
| **D21** | Trademark clearances (G5, G6) | **The 15 franchise chips and the glyph-mosaic artwork stay** (Razim's 2026-08-10 decision). Clearance is listed under the **cutover gate**, so they render on the `noindex` production deployment and are pulled only if counsel says so before cutover | §6.1 G5/G6 |

---

## 9. Discrepancies register

| # | Discrepancy | Sources in conflict | Recommendation |
|---|---|---|---|
| **X0** | **RESOLVED.** *Which build is production.* `V2` §1 line 7: *"Use the current kwc-dinomonteverde.com website as the production design and functionality base."* Line 9: *"Razim's separate hokuten.vercel.app build is reference material only. It is not the production base and must remain noindex and unlinked."* §11 line 137: *"Duplicate the current KWC project into a private Hokuten preview."* `HANDOFF-02` assumes an `index.html`. Against that: Dino asked Razim to take *this* site live (team chat, 2026-08-17). | `V2`/`HANDOFF-02` vs. the working premise of this plan | **Resolved by the build owner (§0.4, L13).** `site/` ships as production; `V2` §1 lines 7/9 are recorded as superseded in PROJECT-MEMORY (P13), and `HANDOFF-02`'s `index.html` instructions are translated to their Next.js equivalents (§5). The **noindex** half of line 9 survives and holds until the cutover gate (§6.4). Not an ask to Dino. |
| **X1** | **RESOLVED.** *Hero tagline.* `FINAL` (2026-08-17): "The signal underneath every hotel transaction" + secondary "…coast to coast, from Asia to the Americas," framed as ✓ DECISIONS LOCKED IN. `V2` §3 (same date, framed as "Final direction"): "Hotel brokerage and advisory, coast to coast — with systems in place" — the exact string `FINAL`'s Change 1 instructs deleting. Neither marks the other superseded. | `FINAL` vs `V2` | **Resolved by the precedence rule (L13).** The verified chronology puts `V2` after `FINAL` (`FINAL` sent 2026-08-16 23:15; the `RAZIM HANDOFF` zip carrying `V2` sent 23:44, files stamped 23:26), so **`V2`'s headline ships and nothing from `FINAL` does** (R4, D1, D2). |
| **X2** | **"From Asia to the Americas."** Zero occurrences in the Handbook, Playbook, Role Guides, or CRM Guide. The Japan programme is pilot-only, introduction-liaison-only, no licensed acts, and its approved one-line public description is an **unfilled placeholder**. | `FINAL` vs `AGREEMENTS` 04, `PLAYBOOK`, `HANDBOOK` | **Do not ship.** Fails the evidence gate and the "if it isn't in the register, it doesn't get said" rule. |
| **X3** | **Two "approved verbatim" company bios.** `V2` §5 gives a four-paragraph About with no kanji and no tagline. `PROFILE` §§2–4 give a one-liner, a ~60-word boilerplate, and a ~150-word About, all built on 北天 / "True north for hotel owners," each headed "use verbatim on the site." | `V2` vs `PROFILE` | **Resolved (D10).** Keep the site's existing `SITE_DESCRIPTION` (a byte-exact kwc port). **Neither disputed bio is pasted:** `V2` §3 line 51's operating-model paragraph becomes the `#method` intro and no About surface ships (§3.15). `PROFILE` §§2–4 are not used at all, since §§5–6 of the same document are dead (X5/D11). |
| **X4** | **Gold, six ways — and a seventh document weighs in.** `GUIDE` line 19: `#B08D3F`. Brand-Addon README: "kit gold `#B8943D` (covers + lockups). Website gold stays `#B8902E`." Live `globals.css:247`: `#b8902e`. All **eight** lockup PNGs pixel-sample to exactly `#B8943D`. The outreach kit uses a fifth and sixth value (`#c6a04a`, `#c7a34a`). **The kwc port source (`~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html`) declares `--gold: #B8943D` / `--gold-dim: #C9A04A` — Dino's live site runs the raster gold.** **`MANUAL` §13 line 679 independently prints "Hokuten Gold `#B08D3F`" — corroborating L2 — while giving charcoal as `#2B2B2B`, a seventh value that conflicts with the `#1A1C1F` this plan adopts** (and which is pixel-sampled from the on-charcoal lockups, so the sampled value wins). | `GUIDE` vs README vs shipped CSS vs sampled pixels vs `MANUAL` §13 | **Decided (R3 Option 1, approved 2026-08-17):** **CSS takes `#B08D3F`** — Option 2 (`#B8943D` everywhere) was the documented alternative and was not taken; **rasters keep `#B8943D`**; **charcoal stays `#1A1C1F`** because it is measured from the artwork the lockups are cut against; the outreach-kit golds are that kit's own bespoke system and are not site law. Every value is recorded in P13, including the supersession of the `#B8902E` guardrail. Dino eyeballs the gold delta on production (D14). |
| **X5** | **`PROFILE` self-contradicts.** Its "CORRECTED 2026-08-17" banner reached §1's identity block but **not** §5's founder bio (still "5× CoStar Power Broker Award," "Annual 2025 & 2026"), §6's roster copy (still "Senior Broker-Associate"/"Broker-Associate" with blank `CA DRE #______`), or the closing footnote. Anyone pasting "verbatim" per the doc's own instruction ships the wrong award count and wrong titles. | `PROFILE` internal | Treat `PROFILE` §§5–6 and its footnote as **dead** (D11) — nothing is pasted from them on-site or off. A corrected reissue is a post-push ask, not a build dependency. |
| **X6** | **`836K+ SF`.** Appears only in `EDITS` §10 and `PROFILE` §7. `V2` never states a square-footage figure — and `EDITS`'s own banner scopes "still controlling" to §8, the provenance line, and the three gates, not §10. | `EDITS`/`PROFILE` vs `V2` | **Keep** (R10) — it is `verified-current` in the site's register. Reconfirmation with Dino is a post-push item. |
| **X7** | **Gate G3 may be unsatisfiable as written.** `EDITS` and `KIT` gate William and Razim on "DRE numbers" and the CA B&P §10140.6 rule ("any licensee named on first-point-of-contact marketing must appear with their license ID"). `V2` discloses **Florida** `BK3200675` and **Illinois** `#475.213653` — neither is a California DRE number. Separately: the Market Center agreement lists "Razim Meeran ([state / license #])" as a **covered licensee** with a blank slot, while the team chat premise is that Razim is unlicensed. | `EDITS`/`KIT` vs `V2` vs `AGREEMENTS` 07 vs `CHAT` | Do not name Razim with a licence claim until he confirms his own status (R8) and Dino rules on the gate (D9). William ships with FL `BK3200675` once Dino approves the profile. |
| **X8** | **Two footer compliance sentences.** The site's frozen port (`compliance.ts:59-62`) vs. `PROFILE` §8's "The Hokuten Group is a real estate team at Forward Wilshire Inc dba Keller Williams Larchmont…". Substantively identical. | site vs `PROFILE` | Keep the frozen port. Compliance blocks are byte-exact ports by guardrail. |
| **X9** | **Razim's public title.** `V2` §6 + `ROLES` + vCard: "Founding Team Member \| Director." `MANUAL` §4 lines 78–80: outward/public title is **"Associate"** only, with "Director · Illinois 475.213653" as the internal role. | `V2`/`ROLES` vs `MANUAL` | Ship `V2`'s (R9). Reconciling the Work Manual is a post-push ask. |
| **X10** | **Four external governing documents are referenced but were not in the delivery**: the Launch Decision Checklist (the actual go/no-go sheet), the full Claims & Coverage Register v1.1 (only its correction summary is echoed), the badge review's exact alt-text strings, and the `website-preview/` staged HTML `HANDOFF-03` describes. | `V2`, `HANDOFF-03`, `KIT` | Request all four from Dino before the final gate. §3.3's alt strings are **reconstructions** from `HANDOFF-03`'s description, not quotes — they must be checked against the register, which "is the only wording source." |
| **X11** | **Listing property name.** Write-up doc: "The Yulee Gateway." Flyer creative and `V2`'s allowlist: "The Florida Gateway." | `MEDIA` internal | **The Florida Gateway** — the allowlist wins. |
| **X12** | **17-asset list sums to 16.** `FINAL` enumerates 6 property photos + 3 team portraits + 3 hero files + 4 branding files = 16, under a header stating "Total: 17 files." | `FINAL` internal | A source arithmetic error. Reproduced, not silently "fixed." Immaterial — the six closing photos and the branding assets already ship. |
| **X13** | **Dino's title, three ways.** Digital kit and `V2`: "Managing Director" (site/cards) / "Founder & Managing Director" (LinkedIn). Physical business-card front proof: "SENIOR ASSOCIATE." The card's own README flags a third variant. | `V2`/`HANDOFF-02` vs the print proof | Site is unambiguous: **Managing Director**. `HANDOFF-02` declares the conflict closed. The **print proof is corrected before the order — that fix is now P18(b)**, and it is tracked in WHATS-LEFT B4. |
| **X14** | **Business-card back proof prints `kwc-dinomonteverde.com`** — the superseded domain. | print proof vs outreach kit README | Non-website fix before printing. |
| **X15** | **`EDITS` §11's closing QA paragraph still says "award lines read 5×"** — contradicting the same document's own banner. | `EDITS` internal | The banner wins. Use §11's grep method, ignore its award clause. |
| **X16** | **Backwards `@2x` brand assets.** `lockup-gold@2x.png` is 117×88 while `lockup-gold.png` is 176×132; same pattern on the blue pair. | repo | Regenerate via `identity-prep.ts` (A2). A real bug, unrelated to this brief but caught in it. |
| **X17** | **Two independent noindex mechanisms** (`lib/seo.ts:146` and `app/layout.tsx:163`) with no single grep-able source of truth. | repo | Both move together at **cutover**, never at push (§3.13, §6.4). P12 owns them. Consider unifying `layout.tsx` to read `robotsMeta()` so the next person cannot miss one. |
| **X18** | **`content/artwork.ts`'s `hero.gold`/`hero.blue` placements are dead code** — `heroSlides.ts` is the hero source of truth since D23. | repo | Add the retirement comment `DESIGN-REVISIT-3.md` D23 already asked for. |
| **X19** | **The site's shipped H1 is an authored replacement**, not a port and not one of Dino's two candidates. | repo vs `V2`/`FINAL` | Replaced by §3.1 per L5 (Dino's decisions govern copy). Worth naming explicitly when reporting to Razim — a headline he approved is being retired. |
| **X20** | **Only one of the site's five current listings survives the allowlist.** Four cards are deleted and two properties are added — a bigger content change than "update the listings." | repo vs `V2` §2 | Flagged so it is scheduled as real work (P7), not a data tweak. |
| **X21** | **Top Firm attribution, three phrasings.** `V2` line 23: "attributed separately to the prior firm/team — **never counted as an individual award**." `V2` line 57: "is prior-firm/team recognition and must be attributed separately. Do not convert it into a personal award…" `KIT` line 30: "presented **ONLY as Hokuten TEAM recognition**." | `V2` internal vs `KIT` | Ship `V2` line 23 **in full**, including the qualifier. **`KIT`'s phrasing must not be used** — Hokuten did not exist in 2025, so calling a 2025 award Hokuten team recognition is a false claim. Per D17 the caption source is `V2` §2's quoted approved wording, and the register check is a post-push verification item (G7). |
| **X22** | **Badge placement.** `HANDOFF-03`: the four individual badges live "in the Dino team section" as a four-card strip. The site: all five CoStar assets consolidated into `#stats` per D12 (Revisit 2, "Trust Metrics becomes the single proof wall"), and §7.3 gates "no CoStar asset outside `#stats`." | `HANDOFF-03` vs D12 / the shipped chassis | **Default taken (D16):** keep the `#stats` consolidation — one proof wall reads stronger, and D12 is approved design law — with the four individual badges as the strip and Top Firm in its own prior-firm/team block after them. `HANDOFF-03` decision #6 reserves final placement to Dino, so the deviation is **recorded in P13**, not left to a QA gate to enforce silently. |
| **X23** | **The Top Firm "source of record" contradiction.** `HANDOFF-03` line 10 names `2025 Annual Top Firm Email Signature Power Broker.png` as a Top Firm source of record; the CoStar README labels that exact file "Reference Only – Prior Firm… never use as an individual Dino or KWC/Hokuten award" and excludes it from the website package. A resized copy of it is **live on the site today**. | `HANDOFF-03` vs the CoStar README | The README wins on usage; `HANDOFF-03` is citing provenance, not blessing deployment. **Default taken (D16): replace it with `US_2025Annual_TopFirm_WinnerBadge.png`** at native aspect (P15). The Top Firm graphic is not dropped. |
| **X24** | **"Jae Hun Q. Jeong" vs "Jae Hun Jeong."** `V2` §6 prints the middle initial; `ROLES` line 51 and his vCard do not — same author, same date. | `V2` vs `ROLES` | Ship "Jae Hun Jeong" (§3.9). Document evidence, not only chat, now supports it. |
| **X25** | **Published contact details.** `MANUAL` §4 prints working emails and direct numbers for the seats; the outreach kit's vCards state that a public email is "not yet approved" for Razim and William, and that Donna/Jae/Marlon have no direct contact field at all. | `MANUAL` vs `OUTREACH` | Site adopts `email: ""` for every non-Dino seat and routes inquiries to Dino Monteverde — the conservative reading, and the default that ships. Reconciling the Work Manual is a post-push ask. |
| **X26** | **Coverage claim vs. the canonical coverage sentence.** `MANUAL` §2 caps authority per assignment and per jurisdiction and warns that "a title, home-state license, network relationship, or geographic label never creates authority in another jurisdiction." The site's frozen `OUT_OF_STATE_QUALIFIER` (`compliance.ts:95`) claims partner-brokerage relationships "in every U.S. state." | `MANUAL` §2 vs the frozen compliance port | Reconcile before launch (D20). A frozen string does not get edited by a builder — either the register supports it or Dino changes it. |
| **X27** | **KW's approval of the gold KW Commercial mark — an open external dependency with the largest rework exposure in the plan.** Dino raised the gold treatment with the CEO of Keller Williams Commercial, noted the KW logo itself cannot be altered, and said the mark reverts to red if KW objects (team chat, 2026-08-16 evening). | KW (external) vs. the whole gold system | **Schedule risk, not a design question.** A reversal invalidates the theme-matched gold header lockup, the gold OG card, the favicon, and every raster P3 regenerates, and re-opens the palette derivation. Track it in WHATS-LEFT §C. P3 runs in wave 2 on the approved gold; if KW's answer is expected within the wave, hold P3 to the end of it rather than regenerating twice. This is the one risk the push-to-production model does not reduce. |
| **X28** | **Two listing pipelines.** `PLAYBOOK` PB:120 describes listings reaching the website via a **Crexi plugin feed**; `V2` §2 bullet 7 and this plan build a same-origin **a100 proxy**. Both documents are dated 2026-08-17. | `PLAYBOOK` vs `V2` | `V2` is the website directive and wins for the build. Flag it so the build owner is not surprised by a Crexi plugin appearing later, and so nobody wires both. |
| **X29** | **Document-fallback typography read as web law.** `MANUAL` §13 line 681 states "Georgia headings · Arial/Helvetica or Calibri body" — the Word-document fallback stack, not the web system. It contradicts L3's Cormorant/Inter/JetBrains. | `MANUAL` §13 vs `GUIDE` lines 10–16 | `GUIDE` controls design; `MANUAL` §13's row describes documents. Georgia stays as Cormorant's declared CSS fallback (§2.2), which is exactly how the two reconcile. |

---

## Appendix A — Source index

| Id | Path | Date | Authority |
|---|---|---|---|
| `GUIDE` | `full-brand-toolkit/00 - HOKUTEN BRAND DESIGN GUIDE - v1.3 - 2026-08-17.docx` | 2026-08-17 | **Design doctrine of record.** "On any conflict about WORDS, the Claims & Coverage Register controls; on any conflict about DESIGN, this guide controls." |
| `V2` | `full-brand-toolkit/… HANDOFF - 01 - START HERE - HOKUTEN WEBSITE AND LAUNCH MASTER - v2` | 2026-08-17 | **Master website/launch directive.** Treated as current by `EDITS` and `KIT`. |
| `HANDOFF-02` | `… HANDOFF - 02 - RAZIM DEPLOYMENT SETTINGS REQUIRED - v2` | 2026-08-17 | Deployment configuration of record |
| `HANDOFF-03` | `… HANDOFF - 03 - COSTAR AWARD BADGE REVIEW - v2` | 2026-08-17 | Badge layout/wording of record |
| `FINAL` | `full-brand-toolkit/HOKUTEN_RAZIM_FINAL_HANDOFF.md` | 2026-08-17 | Section order (uncontested); tagline (contested, X1) |
| `KIT` | `full-brand-toolkit/00 - RAZIM PRE-LAUNCH KIT - START HERE - 2026-08-17.txt` | 2026-08-17 | Finish list + the three gates; newest snapshot of gate status |
| `EDITS` | `… /RAZIM_HOKUTEN_EDITS.md` | 2026-08-05, banner 2026-08-17 | **Superseded in part.** Still controlling: §8 deals scrub + provenance line, and the three go-live gates |
| `PROFILE` | `… /HOKUTEN_COMPANY_PROFILE.md` | 2026-08-05, partially corrected 2026-08-17 | Company copy — **§§5–6 and footnote are dead** (X5) |
| `ROLES` | `full-brand-toolkit/05 - HOKUTEN ROLE GUIDES - ONE PAGE PER SEAT - v1.0` | 2026-08-17 | Exact six-seat titles |
| `MANUAL` | `full-brand-toolkit/HOKUTEN WORK MANUAL - READ ONLY REFERENCE - v1.0` | 2026-08-17 | Forbidden descriptor; public-data rule; manual-send rule |
| `PLAYBOOK` | `full-brand-toolkit/HOKUTEN WORK PLAYBOOK - v1.0` | 2026-08-17 | "If it isn't in the register, it doesn't get said" |
| `HANDBOOK` | `full-brand-toolkit/03 - HOKUTEN KNOWLEDGE HANDBOOK - v1.0` | 2026-08-17 | Verification rules |
| `AGREEMENTS` | `full-brand-toolkit/{01,02,03,07,08,09} - *.docx` (Japan 04/05/06 ignored per Dino) | 2026-08-17 | Entity facts; licensed-activity limits; 50-mile sweep listings |
| `ADDON` | `full-brand-toolkit/The_Hokuten_Group_Brand_Addon_2/{README.txt,01_Logo_Lockups,02_Covers}` | 2026-08-05 | Kit gold; lockup masters |
| `MEDIA` | `full-brand-toolkit/Media (1).zip` → `Media/` | 2026-08-16 | Headshots; CoStar awards; listing facts; social creative |
| `OUTREACH` | `full-brand-toolkit/03 - OUTREACH PROFILE SIGNATURE AND DEAL CARD KIT - REV6 (1).zip` | REV6 | Card visual language; six vCards + signatures; deal-card template |
| — | `READ ME - TEAM CAPABILITIES BOOK v3.4.pdf` (18pp, 8MB) | 2026-08-17 | **Delivered but not read for this document.** A light-field deliverable under the guide's standing ruling; tracked in WHATS-LEFT §B. Nothing in this plan depends on it — which is itself a gap to close before launch messaging. |
| `CHAT` | `chat-context.md` (repo root, **private, gitignored**) + WhatsApp screenshots | 2026-08-16 → 17 | Verbal decisions. **Paraphrase only — never quote in a repo artifact.** |
| — | `CLAUDE.md` / `AGENTS.md` | living | Hard guardrails |
| — | `PROJECT-MEMORY.md` | living | Standing decisions + dated log |
| — | `docs/DESIGN-REVISIT.md`, `-2`, `-3` | 2026-08-08 / -10 | Approved design law D1–D29 |
| — | `docs/PHASE-1-IMPLEMENTATION.md`, `docs/PLACEHOLDERS.md`, `docs/RESUME.md` | living | Scope; open placeholders; build handoff |
| — | `.agents/skills/hokuten-design-director/references/01–07` | living | Tokens, anatomy, motion, claims register, audit, perf gates |
| — | `docs/design/CONTRAST.md` + `contrast.mjs` | living | WCAG transcript of record |

---

## Appendix B — Verbatim copy bank

**Every string below is pasted, never retyped. Anything not in this bank and not already frozen in `site/content/` needs a source before it ships.** Never-ship strings are deliberately **not** in this appendix — they live in §3.14, unfenced, so nothing paste-shaped in here is a trap.

### B1 · Hero

```
Hospitality investment sales — nationwide
```
```
Hotel brokerage and advisory, coast to coast — with systems in place.
```
*(italic gold tail on `with systems in place.`)*
```
Human-led hotel brokerage supported by source-controlled underwriting, licensed comparable-sale research, structured buyer qualification, documented owner reporting, AI-assisted research, document review, and controlled workflow automation.
```
```
Request a written BOV
```
```
See the track record
```

### B2 · Trust stats — the locked hedge (`V2` §3 line 49)

```
Dino Monteverde's career experience includes $200M+ in aggregate transaction volume across 12 hotel and hospitality transactions, including hotel sales, a joint-venture refinance partnership, and the sale of a hotel management company involving 40+ management contracts. This experience includes current and prior affiliations and is not presented as 12 hotel sales personally closed by Dino or as Hokuten-only production.
```

### B3 · CoStar — approved dated wording (`V2` §2 bullet 2 / §3)

```
Dino Monteverde's recent CoStar Power Broker recognition includes the 2025 Annual Top Broker award and Quarterly Deals wins for Q3 2025, Q1 2026, and Q2 2026.
```
```
The 2025 Annual Top Firm recognition is attributed separately to the prior firm/team — never counted as an individual award.
```
*(`V2` line 23, complete. The shorter form drops the compliance-protective qualifier. Ships on the D17 fallback — `V2` §2's approved wording is the caption source; re-checked against register v1.1 post-push. See X10, X21, D17.)*
```
Verify at costarpowerbrokers.com →
```

### B4 · Closings (`EDITS` §8.1, §8.4)

```
Deal team: Dino Monteverde · William Betancourt
```
```
Selected transactions completed by Dino Monteverde, 2022–2026, including transactions completed at prior affiliations.
```

### B5 · Method — frozen ports (`content/methodology.ts`)

```
Written BOV within 48 hours of receiving the T-12, STR report, franchise / PIP information, and other material property data.
```
```
The listing term is 180 days, structured as two 90-day cycles. The first 90 days are the front-loaded campaign and diagnostic period, with market reads at Days 30 and 60. At Day 90, if the hotel is not under contract, the seller decides: accept a live offer, reprice and authorize a second 90-day cycle, or conclude the engagement. A qualified offer can move to LOI, diligence, and close at any time.
```

### B6 · Operating model (`V2` §3 line 51) — surface decided in §3.15 (`#method` intro, recommended)

```
The Hokuten model combines an owner-operator lens, direct relationship work, evidence-based valuation, disciplined prospecting, source verification, and modern systems. AI assists research and document review, while controlled automation supports routing, follow-up, reporting, and quality control. Licensed professionals retain responsibility for valuation, pricing, advice, communications, and client decisions.
```

### B7 · Team role paragraphs (`V2` §6, approved)

```
Dino Monteverde — Founder & Managing Director. Team lead: sellers, listings, BOVs and valuations, pricing, top relationships, campaigns, DNC decisions, access, and final approvals. Site and cards render the title as Managing Director.
```
```
William Betancourt — Founding Team Member | Director · Florida. William supports Florida coverage and operational deal execution, including buyer conversations, tours, transaction milestones, LOI and purchase-and-sale workflows, and coordination through closing. Display Florida BK3200675 after final profile approval.
```
```
Mohamed Razim Meeran — Founding Team Member | Director. Razim owns automation and web development, and training for the team's tech tools — CRM workflows, integrations, data quality, enrichment, dashboards, and the technology supporting a100 Arms. 312.459.0546 · Illinois License #475.213653.
```
```
Donna Yangyang — Administrative Assistant & Transaction Support. Donna supports administrative coordination, recordkeeping, research, marketing organization, scheduling, transaction timelines, and preparing materials for review. She has served as Dino Monteverde's administrative assistant for the past four years and brings practical familiarity with the team's hotel-business workflow. Her public profile does not describe her as a title analyst or assign licensed brokerage activity.
```
```
Jae Hun Jeong — Administrative Assistant & Transaction Support. Jae supports lead qualification, recordkeeping, transaction timelines, diligence and materials organization, broker–buyer–seller scheduling, and preparing files for licensed-broker review. A U.S. Navy veteran with eight years of service, he also brings six years of field-service experience across commercial and residential properties, with strengths in inspection, client relations, facilities upkeep, organization, and clear communication. Licensed activity remains with the appropriate licensed broker.
```
```
Marlon Guzman — Team Member | Southern California. Marlon is a current non-founding team member learning the Hokuten system before taking on smaller assignments.
```
*(Marlon's card makes no active-broker, active-licensee, or licensed-service claim.)*

### B8 · Roster policy (`V2` §6)

```
The current public launch roster is Dino Monteverde, William Betancourt, Mohamed Razim Meeran, Donna Yangyang, Jae Hun Jeong, and Marlon Guzman. The founding team members are Dino Monteverde, William Betancourt, and Mohamed Razim Meeran. No other team member is described as a founder, founding partner, or founding team member.
```
*(This source prints "Jae Hun Q. Jeong". `ROLES` line 51 and his vCard print "Jae Hun Jeong", and Dino confirmed the same — ship without the "Q". See §3.9, X24.)*

### B9 · Compliance — frozen (`site/content/compliance.ts`)

```
Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534).
Dino Monteverde, CA DRE #01948432.
```
```
Nationwide referral network and formal partner-brokerage relationships in every U.S. state for out-of-California engagements. Brokerage of record for all listings.
```
*(Frozen today, but **not cleared**: the every-state claim has to be reconciled against the canonical coverage sentence below before launch — X26, D20. Do not paste it into new surfaces meanwhile.)*

**The governing coverage language — `MANUAL` §2, CANONICAL COVERAGE AND AUTHORITY SENTENCE:**
```
Through Dino Monteverde, William Betancourt, Mohamed Razim Meeran, their applicable Keller Williams market centers, and approved cooperating relationships, The Hokuten Group coordinates appropriately licensed hotel work throughout the United States and its territories, including Midwest markets; each assignment is accepted and documented for its property and jurisdiction, while the Japan lane remains a relationship-and-referral collaboration through qualified local professionals and never implies Hokuten brokerage authority in Japan.
```
```
A title, home-state license, network relationship, or geographic label never creates authority in another jurisdiction.
```
```
Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value.
```
```
All trademarks are the property of their respective owners and are shown to indicate franchise systems within which we broker transactions. No affiliation or endorsement is implied.
```
```
© 2026 THE HOKUTEN GROUP. All rights reserved.
```

### B10 · WhatsApp disclosure (`V2` §9 line 126)

```
WhatsApp may display your phone number and profile information to other community participants. Membership is vetted and subject to community rules.
```

Controlling invite — **not yet present anywhere in `site/`; F35/P16 adds it.** The former `CyEa…` invite must not be restored:
```
https://chat.whatsapp.com/Jk5rP0D1ad4J68SnGo8KJG
```

### B11 · Verified public links (`V2` §8 line 119)

*The Calendly link below is wired by F36 — `content/site.ts:168` `CALENDLY_URL` is `null` today, so every scheduling CTA degrades to `#bov`. The Florida Gateway Crexi URL was recovered from a screenshot Dino forwarded; the Cy-Fair equivalent has no source (D7).*

```
https://www.linkedin.com/in/dinomonteverde
https://www.crexi.com/profile/dino-monteverde-dinomon
https://calendly.com/dino-monteverde-kw
https://www.crexi.com/properties/2629907/florida-the-florida-gateway
https://www.costarpowerbrokers.com/
https://a100arms.com/signup
```

### B12 · Listing facts

**The Florida Gateway** — 852374 US Highway 17 *(`provisional` — the street number reads like a digit-concatenation typo and the source flags it for verification; confirm before publishing, D18)*, Yulee, FL 32097 · Jacksonville MSA · 156 keys · $3,750,000 · ±7.45 acres · ~85,000 SF of improvements · closed since 2019, offered as-is · built ~1980 / renovated ~2015 · active Florida 4COP liquor licence · active wastewater-treatment licence · Florida's first I-95 exit — Exit 380 at US-17 · Wildlight / ENCPA growth corridor.

**Quality Suites Houston NW Cy-Fair** — 17550 NW Freeway (US-290), Houston, TX · Cypress / Houston NW · 54 keys · $3,600,000 · Choice-flagged select-service · full PIP completed 2024 · 2026 YTD RevPAR +30% year over year · delivered free and clear at closing.

**Pocono Mountain Hotel & Spa** — 38 Lehigh Road, Gouldsboro, PA 18424.

Approved substitute framing for QS Cy-Fair performance (never "loss," "losing money," "negative income"):
```
current performance sits below the historical baseline; the gap is operationally driven and fixable
```

*(There is no B13. The never-ship list lives in §3.14, deliberately outside this paste bank.)*

---

*End of document. Status: `approved` (Razim, 2026-08-17) — with the two standing exceptions named in §0: **R8**, Razim's own licence status, and the **cutover gate** in §6.4.*

### B13 · Donna Yangyang — bio (supplied by Donna via Razim, 2026-08-17)

Verbatim, for `content/team.ts` `bio` (full) — a personal-history statement, not a Team coverage claim (the "all 50 states" phrase describes her research background; it is not the Team's brokerage-authority sentence, which stays governed by `MANUAL` §2):

> With experience dating back to 2005, she is a U.S. real estate researcher and title analyst with more than two decades of experience working with property records and title research. Over the years, she has developed a strong understanding of real estate documentation and due diligence across all 50 states.
> Her areas of expertise include title examination and abstracting, current ownership and mortgage searches, vacant land due diligence, tax sale and foreclosure title research, and surplus funds and excess proceeds recovery. She is known for being thorough, resourceful, and attentive to the details that matter.
> For the past four years, she has also served as an administrative assistant to Dino Monteverde, where she has gained valuable hands-on knowledge of the hotel business. This experience has broadened her professional background and strengthened the organizational, research, and administrative skills she brings to every project.

Roster cut (≤45 words, `bioShort`) — every phrase is hers, only compressed:

> U.S. real estate researcher and title analyst since 2005 — title examination and abstracting, ownership and mortgage searches, tax-sale and foreclosure title research across all 50 states. Administrative assistant to Dino Monteverde for the past four years, with hands-on knowledge of the hotel business.

### B14 · Mohamed Razim Meeran — draft bio (needs Razim's word before it ships)

Built only from `V2` §6 line 80 and Razim's own description of his seat (2026-08-17); no licence claim, no licensed-activity claim:

> Razim leads The Hokuten Group's systems: the website, CRM workflows and integrations, data quality and enrichment, dashboards, and the technology behind a100 Arms. He moves qualified buyer and owner conversations to the next step and supports LOI and purchase-and-sale workflows under Dino Monteverde's direction, and trains the team on its tools.

Roster/short form (≤45 words): *Leads the team's website, CRM and automation systems and the technology behind a100 Arms; moves qualified conversations to the next step and supports LOI and PSA workflows under Dino Monteverde's direction.*
