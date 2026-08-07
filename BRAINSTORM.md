# BRAINSTORM — The Hokuten Group Platform

> Idea parking lot + roadmap. Nothing here is a commitment until it moves into [PROJECT-MEMORY.md](PROJECT-MEMORY.md) as a dated decision.
> Status vocabulary: `parked | exploring | approved | building | shipped | rejected`

---

## 1. Roadmap (phases)

| Phase | Scope | Status |
|---|---|---|
| **1 — Landing page** | Next.js site on Vercel: ASCII hero, track record, listings (static seed), valuation calculator port, FRED ticker, methodology, team, BOV funnel. See [docs/PHASE-1-IMPLEMENTATION.md](docs/PHASE-1-IMPLEMENTATION.md) | `approved` |
| **2 — Live data** | a100arms public feed for listings (Hokuten-scoped feed variant needed — current one is Dino-scoped "team contains Dino Monteverde"), photo sync, Monday CRM stays upstream | `parked` |
| **3 — Depth pages** | Split single page into indexed routes (/listings, /track-record, /valuation, /team/[broker], /marketplace), per-broker profiles, marketplace bulletin port | `parked` |
| **4 — Content engine** | Market insights / rate commentary journal (pairs with FRED ticker), newsletter on the clean database (chat 2026-08-06: "cleanest database ASAP"), automated BOV intake | `parked` |
| **5 — Portal** | "Private Access" gated area (a100 Arms tie-in or native): off-market teasers behind NDA/e-sign flow | `parked` |

## 2. Hero concepts (ASCII / signature art)

- `approved` **"Heritage through a digital sieve"** — the Ref-folder aesthetic: a tier-1 city hotel rendered as an ASCII/dither character grid on the dark cover-panel (black/charcoal, gold+ivory characters), clean editorial chrome around it.
- `approved` **Brand-glyph charset** — the character ramp isn't generic: it's built from `HOKUTEN`, `北天` / `ホクテン`, digits, and `・.:-=+*#`. One seam row resolves legibly into `THE HOKUTEN GROUP` (Razim's "numbers hidden in the drawing" idea, made ours).
- `exploring` **Subject** — default: NYC hotel/skyline (we closed Holiday Inn Express Brooklyn — real proof, relatable). Chassis supports swappable art (the runcycle pattern from Ref): SD Carte Hotel variant, Reno variant, Niseko/Hakuba variant for the Japan desk.
- `exploring` razim-co archive concept, ready-made: "a hotel silhouette dissolves into a transaction graph."
- `parked` Seasonal/daily art rotation (four runcycle-style variants prove the chassis).

## 3. Hokuten identity (Japanese / Northern Sky / FF)

- `approved` **North star, not video game** — the FF Order of the Northern Sky nod stays sub-visual: a small north-star / compass-point glyph as the site's mark accent, star-grain texture on dark sections (Aurelian ref). No game imagery — audience is 50-something hotel owners.
- `exploring` **北天 hanko seal** — a gold square seal-stamp glyph (favicon, section stamps, OG image corner). Classy, ownable, explains the name in one mark.
- `exploring` "Northern Sky" as copy motif: "We navigate by fixed points: data, discretion, closed deals."
- `exploring` **Japan desk is real business, not theming** — marketplace already carries a Japanese fund ($2M–$300M mandate), onsen resort land mandates, Niseko ~$73M + Hakuba ¥3.3B deals, and Dino's LLC is Mitsukaido Holdings. A JP-flagged section (later a /japan route, EN/JP toggle like StoneInvestment's EN/FR) is differentiation no other US hotel brokerage has.
- `parked` Tasteful easter egg for Dino: konami-code → the Order of the Northern Sky wiki link in a console message. Zero UI cost.

## 4. Design ideas (from research, hand-picked refs honored)

- `approved` StoneInvestment numbered full-screen menu (01–07 serif index + warm photo panel + "PRIVATE ACCESS" ghost button) — the single most on-brief ref.
- `approved` Ridgeway & Pryce dual-door: **The Owner / The Investor** split panel routing sellers vs buyers.
- `approved` Consent/inquiry modal per Razim's filename spec: outside click does NOT close — dialog shakes (+`navigator.vibrate` where supported); only explicit buttons dismiss.
- `approved` Mono deal-data everywhere (cap rate, keys, ADR, $/key) — reads "financial-grade" to CoStar users.
- `approved` Trust architecture (Mira skeleton): metrics band, CoStar Power Broker strip, named humans with faces, diligence-grade FAQ (1031, NDA process, off-market access).
- `exploring` Dark "process chapter" with white engraved line-art of a hotel + vertical stepper (Golden-Gate-wireframe ref) for the 5-phase methodology.
- `exploring` Stat moments: oversized numerals on grain cards ("$200M+", "12", "836K+ SF") with dimmed/white two-tone captions (Moltgage ref).
- `parked` Liquid-glass sticky nav (`liquid-dom` star) — **study-only quarantine** until a perf/a11y spike passes (house rule).
- `parked` threecn 3D scene reskin — same quarantine; ASCII canvas is the signature effect, one per viewport.
- `parked` mapcn "markets we cover" map (Phase 3).

## 5. Copy / positioning seeds

- `exploring` Manifesto hero, one sentence (Paisana pattern). Candidates:
  - "The signal underneath every hotel transaction." (kwc — proven, but Dino's; Hokuten needs its own)
  - "Fixed points in a moving market."
  - "Hotel deals, navigated by the northern sky." (maybe too on-the-nose)
- `approved` Numbers-first, evidence-gated voice (kwc DNA): every claim traceable — $200M+ / 12 transactions / 836K+ SF / 3× CoStar Power Broker. No "experience you can count on" fluff (Sarhan's mistake).
- `approved` Written-BOV-first conversion (demote calls): "Request a written BOV" is the persistent CTA; 48-hour BOV promise conditioned on T-12/STR/PIP receipt.
- `exploring` Team story: "Three brokers, two continents, one book of record." Bios pending (Dino asked 2026-08-06).

## 6. Tech ideas

- `approved` Stars to use now: **shadcn/ui** (restyled primitives), **transitions.dev** (recipes as reference), **vibecoded-design-tells** + **no-ai-slop** (QA gates), **designparser-mcp** (dev-time design checks).
- `exploring` Calculator upgrades (Phase 2+): URL-shareable estimate state, PDF "estimate letter" export, per-market cap-rate presets fed by real comps, live 10-Yr spread note next to cap-rate output (ties ticker to calculator).
- `exploring` OG image generator (per-listing cards via @vercel/og, cover-recipe layout: black panel, gold rule, stacked hierarchy).
- `parked` LoneWolf / e-sign / VoiceDrop integrations (ops stack, not website — chat 2026-08-06).
- `parked` Self-hosted analytics (kwc has none; add Vercel Analytics + a privacy-clean option later).

## 7. Rejected (with reasons)

- `rejected` KW SmartSites / GoDaddy builder ("not custom enough… for resi peons" — William, 2026-08-06 chat).
- `rejected` Crexi-widget-only inventory (Sarhan's approach — invisible to crawlers, off-brand).
- `rejected` Long preloader / scroll-jacking (Horizonte's 6.6/10 a11y score; 40+ audience).
- `rejected` Pure-black/pure-white palette, centered-gradient AI-slop hero, stock photography.

---
*Add ideas under the right section with a status tag. Date entries when they change status. Promote `approved` items into PROJECT-MEMORY.md decisions.*
