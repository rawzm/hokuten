# PHASE 1 — Landing Page Implementation Plan

**Status:** `approved` (Razim, 2026-08-07) · **Owner:** Razim · **Target:** thehokutengroup.com on Vercel
**Companions:** [PROJECT-MEMORY.md](../PROJECT-MEMORY.md) (decisions) · design skill `.agents/skills/hokuten-design-director/` (all visual/motion/content rules) · [BRAINSTORM.md](../BRAINSTORM.md) (out-of-scope ideas)

---

## 0. Verified facts (inputs this plan relies on)

- Port source repo: `~/Documents/Dino/dino-sites/kwc-dinomonteverde/` (git → `rawzm/dino-KWC`, live at kwc-dinomonteverde.com). Static hand-coded site; all features verified in source 2026-08-07.
- Calculator: pure client-side `CONFIG`/`TYPICAL`/`OCC_BAND`/`ADR_BAND`/`REVPAR_BAND`/`ADVICE` objects + `calculate()` in `index.html` (~line 1350). No external data. Portable as-is.
- FRED proxy: `api/ticker-data.js` — series DGS10, SOFR, DPRIME, DFEDTARU, DFEDTARL; env `FRED_API_KEY` (Vercel dashboard); cache `s-maxage=3600, stale-while-revalidate=86400`; always-200 degradable response `{updated, items:[{label, value, date}]}`.
- Listings feed (Phase 2, not now): `GET https://a100arms.com/api/public/kwc-listings` — public, CORS `*`, no auth; `{success, data:[…], count}`; Listed-stage only; top-level field allowlist; never expose `a100_DealSnapshot`; Crexi-link trust check; ~30 req/min/IP; 5-min client cache. Current feed is Dino-scoped — Hokuten needs its own feed variant later (a100 backend is Razim-owned).
- Seed content (closings ×6 with photos, listings ×5 with Crexi URLs, methodology, reach stats, bio, compliance text) itemized in design-skill reference 06 and §5 below; asset files confirmed present in the kwc repo.
- Brand assets: `The_Hokuten_Group_Brand_Addon_2/` — palette + lockups verified; website gold `#B8902E` mandated; linear-on-charcoal lockup is defective (do not use).
- Domain purchased (GoDaddy, Dino's account, 2026-08-06): thehokutengroup — kwc-dinomonteverde.com will point at it later. GoDaddy account has MFA (password-rotation item closed 2026-08-07).
- GitHub repo created by Razim (2026-08-07): `https://github.com/rawzm/hokuten.git` — workspace root pushes here. Vercel project also opened by Razim; connect it to the repo with Root Directory = `site` once M0 scaffolds.
- Content source of record for all ported copy/data/assets: the kwc source code at `~/Documents/Dino` (read-only) — always refer to source directly, not to summaries.

## 1. Hard guardrails — do not change

- Calculator math, defaults, band values, advice rules: byte-equivalent port. Unit tests lock outputs before any restyle.
- Compliance blocks verbatim: brokerage-of-record disclosure on every page; TCPA/SMS consent text; calculator disclaimer. See design-skill reference 06.
- HOKUTEN spelling; Hokuten-first branding; KW mark footer-only.
- `FRED_API_KEY` server-side env only. New Web3Forms access key for Hokuten (don't reuse Dino's). No Vercel CLI against anyone else's account.
- No public launch until KW / Forward Wilshire papers the name (memory open item). Preview deployments password-protected until then.
- No Sarhan branding. `chat-context.md` never committed.

## 2. Locked decisions

| Decision | Value |
|---|---|
| App location | `site/` subfolder; git repo at workspace root → `github.com/rawzm/hokuten` (main); Vercel Root Directory = `site` |
| Stack | Next.js (App Router, TS) · Tailwind v4 · `motion/react` · Lenis (desktop only) · shadcn/ui primitives restyled · `next/font` |
| Fonts | Fraunces / Inter / IBM Plex Mono (self-hosted; Canela upgrade path noted in skill ref 01) |
| Rendering | Fully static (SSG) landing route + one dynamic API route (ticker). No DB, no auth, no CMS in Phase 1 |
| Content | Typed modules in `site/content/*.ts` (see §5 contracts) |
| Page model | Single landing route `/` with anchor sections (+ `/privacy`, `/sms-terms`); Phase 3 splits routes |
| Hero | ASCII-art canvas per skill refs 01/05; default subject: NYC (Brooklyn closing / Manhattan skyline); chassis supports swappable art |
| Analytics | Vercel Analytics + Speed Insights (kwc had none) |
| Forms | Web3Forms (new key) + Calendly (team URL TBD → `blocked: calendly-url` until Dino provides; fallback to `#bov` built in) |

## 3. Milestones

### M0 — Repo & scaffold
~~git init~~ Done 2026-08-07: repo initialized at workspace root, `.gitignore` (chat-context.md, .env*, .vercel, node_modules, .DS_Store), pushed to `rawzm/hokuten` main. Remaining: `create-next-app` in `site/` (TS, App Router, Tailwind); fonts via `next/font`; tokens into `globals.css` `@theme` from skill ref 01; `site/lib/motion.ts` tokens; shadcn/ui init + restyle Button/Input/Select/Dialog/Accordion; connect Razim's existing Vercel project to the repo (Root Directory = `site`, password-protected previews).
**Exit:** deployed preview showing tokened type/color specimens.

### M1 — Content modules & assets
Copy from kwc repo: 6 closing photos, hero video (if reused), `us-cities.min.json`, KW footer mark; export brand lockups → `site/public/brand/`; source franchise-logo vectors per PHASE-1-EXECUTION §4.3 (license manifest required). Author `content/{closings,listings,team,stats,methodology,mandates,faq}.ts` per §5. Port `privacy` + `sms-terms` pages with brand-string rules from skill ref 06.
**Exit:** all seed content typed, no `any`, QA greps pass.

### M2 — Sections (order = build order)
Nav + numbered menu overlay → `#stats` → `#brands` (franchise-flag marquee) → `#closings` → `#listings` (static seed + empty state) → `#method` (dark chapter) → `#doors` → `#mandates` (condensed capital & mandates, dark) → `#team` (provisional generic bios per skill ref 06 — Dino verbatim from source; Razim/William in the same format, pending team's real bios) → `#faq` → footer + compliance. Each section: spec via design skill `spec` verb → `approved` → build → `audit`.
**Exit:** full page scrolls with placeholder hero; JS-off pass shows all content.

### M3 — ASCII hero
`site/scripts/ascii-gen.ts` build-time generator (photo → luminance grid → brand charset + seam row); static frame export for mobile/reduced-motion/noscript; canvas component with proximity shimmer, IntersectionObserver gating, dirty-rect redraws, 12ms kill switch (full spec: skill ref 05).
**Exit:** 60fps under 4× CPU throttle; static fallbacks verified; Razim approves the art.

### M4 — Calculator port
`site/lib/valuation.ts`: typed frozen `CONFIG`/`TYPICAL`/`OCC_BAND`/`ADR_BAND`/`REVPAR_BAND`/`ADVICE` + pure `calculate()`. Unit tests (vitest): golden cases locked against kwc outputs (each property type × tier, adjuster combos, NOI override, occ clamp, $50K/$5K rounding, cap floor 4.5%). Then the 3-step wizard UI per skill ref 04 (`data-fmt` formatters as controlled-input utils, ⓘ popovers, RevPAR preview, typical-figures autofill, benchmark bars, insights, email capture payload, Calendly prefill via typed estimate state).
**Exit:** tests green; side-by-side manual check vs live kwc calculator on 5 scenarios.

### M5 — Ticker + forms
`app/api/ticker-data/route.ts` port (same series, env, cache, degradable 200s); fixed bottom ticker bar (CSS marquee per skill ref 05, height-reserved, reduced-motion static). BOV form port (city picker lazy-load, intl-tel E.164, honeypot, TCPA block, new Web3Forms key, inline success). Consent modal per skill ref 04 (shake + vibrate, explicit dismiss only).
**Exit:** live rates on preview; test submissions arrive; modal behavior matches Razim's spec.

### M6 — Performance, a11y, QA
Perf gates (skill ref 05): LCP <2.5s, CLS <0.02, INP <200ms, landing JS ≤180KB gzip, Lighthouse mobile ≥90/≥95. Full `audit` verb pass (P0s = fail); QA grep script (skill ref 07); keyboard/JS-off/reduced-motion/viewport passes; vibecoded-design-tells + no-ai-slop sweeps; SEO: metadata, OG image (cover recipe), JSON-LD (`RealEstateAgent` + `Person` per broker), sitemap, robots.
**Exit:** AUDIT_LOG.md entry with verdict `pass`.

### M7 — Launch gate
DNS: thehokutengroup.com → Vercel (Dino's GoDaddy; DNS-only change, no builder). Keep password protection until the paperwork gate clears, then remove; kwc-dinomonteverde.com redirect is Dino's call later. PROJECT-MEMORY.md launch entry.

## 4. Section specs

Authoritative anatomy: design-skill reference 04 (nav, 13 sections incl. `#brands` + `#mandates` added 2026-08-07, modals, footer, mobile rules). Specs are written per-section during M2–M5 with the skill's `spec` verb and live in `docs/design/specs/`. Execution detail for the implementing agent: [PHASE-1-EXECUTION.md](PHASE-1-EXECUTION.md).

## 5. Data contracts (`site/content/`, `site/lib/types.ts`)

```ts
// Aligned to the a100arms public-feed allowlist so Phase 2 is a data-source swap.
type Listing = {
  id: string;                 // Monday item id (feed) or slug (static)
  name: string;
  city: string; stateCode: string;
  roomCount?: number;         // meta line: "City, ST · service · N keys"
  serviceLevel?: string; brand?: string;
  price?: string;             // display string "$11.00M"; undefined/"$0" → "Price on Request" (feed's exact string — render as-is)
  displayCapRate?: string;    // render only if a positive number parses
  status: 'exclusive' | 'off-market' | 'in-contract' | 'closed' | 'listed'; // 'listed' renders the EXCLUSIVE badge (feed is Listed-stage only)
  crexiUrl?: string;          // must pass ^https://(www\.)?crexi\.com/
  photo: string;              // /public path (static) or photoUrl (feed)
};
type Closing = { name: string; location: string; keys?: number; segment: string;
  metrics: string;            // mono line: "96% LP/SP · 74 days" | "Confidential · $227K/key"
  price: string; photo: string; note?: string };  // note: "JV / equity capital arranged"
type TeamMember = { name: string; role: string; bio: string | { status: 'blocked: bios-needed' };
  email: string; phone?: string; dre?: string; photo: string };
type Stat = { value: string; label: string; detail?: string }; // "3×", "CoStar Power Broker", "Q3 '25 · Q1 '26 · Q2 '26"
type Mandate = { headline: string; criteria: string; source: 'kwc-marketplace' }; // #mandates cards — claims must have verified-current rows in skill ref 06
```

Seed rows (verbatim from kwc source — full table in skill ref 06): closings Carte $61.49M / Renaissance Reno $50.1M / Last Hotel $13.2M / HIE Brooklyn $20.0M / Radisson McAllen $14.0M / Rohnert Park $14.0M; listings The Lodge at Split Rock Resort, Pocono Mountain Hotel and Spa, Developer Inn Highway Kissimmee, Developer Inn Downtown Orlando, Baymont Jacksonville Airport (display names + Crexi URLs must come from the `CREXI_LINKS` map / Crexi listings, not shorthand); stats $200M+ / 12 / 836K+ / 3× CoStar.

## 6. Calculator port spec (reference)

Model: `RevPAR = ADR × occ`; rooms revenue `keys × ADR × 365 × occ`; total revenue `÷ roomsToTotal[type]` (0.62–0.96); `NOI = total × noiMargin[type]` (0.28–0.40) unless user NOI override; value range `NOI ÷ capBand[type][tier]` with additive bps adjusters — renovation −50/0/+75, ground lease +100, brand −25/+25, F&B>25% +25 — cap floored at 4.5% (high ≥ low+0.5%); totals rounded to $50K, per-key display to $5K. Steps, fields, ids, validation, defaults (74% / $198 / tier `TYPICAL` table), benchmark bands, and the 9-rule `ADVICE` engine port exactly as documented in the source (`index.html` calculator IIFE). UI restyle only.

## 7. Ticker spec (reference)

Route handler port of `api/ticker-data.js`: FRED `series/observations`, `sort_order=desc&limit=12`, first non-`"."` value, format `X.XX%`; labels 10-Yr Treasury · SOFR · Prime Rate · Fed Funds Upper/Lower; missing key → `200 {updated:null, items:[], error:"missing_key"}`; client renders dashes on any failure. New FRED key provisioned for Hokuten's Vercel project (free at fred.stlouisfed.org).

## 8. Definition of done (Phase 1)

- [ ] All M0–M7 exits met; AUDIT_LOG verdict `pass`; perf gates green on Vercel preview (mobile)
- [ ] Calculator unit tests lock kwc parity; 5-scenario manual cross-check recorded
- [ ] JS-off, keyboard-only, reduced-motion, iPhone SE/laptop/27" passes clean
- [ ] Compliance: disclosure on every page; TCPA block byte-exact; privacy + sms-terms live
- [ ] No `pending-verification` claim rendered; team section ships provisional generic bios (skill ref 06) until real ones land
- [ ] QA greps clean (hakuten/B8943D/sarhan/secrets); repo private; previews password-protected
- [ ] PROJECT-MEMORY.md updated; launch blocked-on-paperwork status recorded

## 9. Phase 2 preview (not in scope)

Hokuten-scoped a100arms feed — recipe verified against the a100 codebase (`/Users/razim/D/DePaul/SHG/A100arms/website/`, 2026-08-07): clone two files, `src/app/api/public/kwc-listings/route.ts` → `hokuten-listings/route.ts` and `src/lib/kwcListings.ts` → `hokutenListings.ts`; change only the `KWC_BROKER_NAME` team-filter constant (see the Team-column filter in `kwcListings.ts` — the a100 repo is the authority) and the CORS origin allowlist (add Hokuten apex+www, keep `Vary: Origin`); keep the `Listed`+`Onboarded` gates and the allowlist projection byte-identical. Photos: `src/lib/listingPhotoSync.ts` is Dino-scoped — widen its predicate or feed returns `photoUrl: undefined`. Consumer needs zero credentials. **This work is performed inside the a100arms project under its own repo/rules (Razim-owned backend) — never from this workspace; A100arms remains read-only here.** Also Phase 2+: live listings swap, Calendly team URL, real bios, testimonials permission run, ~$1B narrative verification, marketplace port. Parking lot: BRAINSTORM.md.
