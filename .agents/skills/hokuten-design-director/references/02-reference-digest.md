# 02 — Reference Digest

## Table Of Contents
How to digest · Inspiration sites · Ref-folder images · Own properties (kwc, Sarhan) · GitHub stars

## How to digest

Every reference gets four lines: Borrow / Avoid / Hokuten translation / Acceptance check.
Translate inspiration into principles; never clone a reference.
`Ref/` images and inspiration sites are source material only — no production import of their assets.

## Inspiration sites (hand-picked by Razim, 2026-08-06)

### stoneinvestment.fr/en — luxury RE, Mauritius
- Borrow: gold-on-ink restraint; named experts with faces; diligence-grade FAQ; numbered full-screen menu (01–07 serif index, warm photo panel, EN/FR + currency utilities, ghost "PRIVATE ACCESS →" button).
- Avoid: WhatsApp-first contact (wrong market).
- Hokuten translation: the numbered menu overlay is our nav pattern; "PRIVATE ACCESS" maps to the a100 Arms off-market channel; FAQ answers 1031/NDA/off-market questions.
- Acceptance check: menu items are real routes/anchors; FAQ contains ≥5 genuine diligence questions.

### hutstuf.com — cabin hospitality (GSAP + ScrollTrigger + Swiper)
- Borrow: inventory card grid with rich hovers (photo/name/price anatomy = listing card); warm off-white ground (maps to our `--paper`); press-logo trust band.
- Avoid: booking-widget clutter above the fold.
- Hokuten translation: listing cards = photo (B&W→color), serif name, mono data row (price · keys · cap), status badge, Crexi link.
- Acceptance check: a Crexi user understands the card in <3 seconds.

### living.paisana.studio — "New Luxury" studio (GSAP + Lenis)
- Borrow: manifesto-as-hero (one authoritative sentence before imagery); Lenis + reveal cadence — slow equals expensive.
- Avoid: full-serif body (hurts scanability for data).
- Hokuten translation: one-sentence manifesto over the ASCII hero; serif is display-only.
- Acceptance check: hero communicates who/what in one sentence with zero scroll.

### horizonte-village.com — Awwwards SOTD (Canela + Apercu Mono, Lenis)
- Borrow: cream + slate luxury palette logic; serif + mono pairing for data; *italic accent word* headline device; scroll pacing.
- Avoid: percentage preloader; its 6.6/10 accessibility score.
- Hokuten translation: our paper/ink/gold equivalent; italic device limited to one word per headline; no preloader ever.
- Acceptance check: keyboard-only pass works; LCP < 2.5s.

### mira-international.com — UAE brokerage ("Crexi with taste")
- Borrow: trust architecture — metrics band, timeline, authority logos, FAQ, per-card contact CTA; status badges ("Exclusive").
- Avoid: carousel-heavy hero; sheer page length.
- Hokuten translation: this is the familiarity layer for 40+ CoStar users — the skeleton they already understand, dressed in the Horizonte/Stone language. Badges: `EXCLUSIVE · OFF-MARKET · IN CONTRACT · CLOSED`.
- Acceptance check: a LoopNet user finds price, keys, cap, and contact without learning anything new.

### ridgewayandpryce.com — hotel brokerage (the direct analog)
- Borrow: dual-door "The Hotelier / The Investor" split; LUXURY/UPSCALE/LIFESTYLE tier modules; discretion-and-process copy ("Brilliantly Simple").
- Avoid: Webflow-plain flatness — it proves the category can be dressed up; that's our opening.
- Hokuten translation: "The Owner / The Investor" doors; tiers map to Full-Service / Select-Service / Boutique-Resort.
- Acceptance check: both audiences find their door within one viewport of the hero.

## Ref-folder images (`Ref/`, 14 files) — synthesis

- Borrow: "heritage through a digital sieve" — classical subjects in ASCII/dither/engraving; low density, one idea per screen; index numbers everywhere (01–07 menus, numbered steps, page footers); dimmed-gray copy with selective white emphasis; small-caps value rail on hero edge; fixed chassis with swappable hero art (runcycle proof); split photo + dark panel; wireframe line-art on black for dark chapters (Golden Gate ref → hotel engraving); oversized stat numerals on grain cards (Moltgage "20x" ref); Aurelian dark hero (star grain, hairline arcs, right-rail caps values) compresses cleanly to mobile.
- Avoid: applying texture to UI chrome — texture lives in imagery only.
- Hokuten translation: hero = ASCII hotel on cover-panel black with gold/ivory characters; methodology = dark chapter with engraved hotel line-art + vertical stepper; stats = serif numerals + mono captions.
- Acceptance check: chrome is textureless; exactly one textured art object per viewport.
- The consent-modal filename is a spec (see [04-page-anatomy.md](04-page-anatomy.md) → Modals).

## Own properties

### kwc-dinomonteverde.com (port source — code at `~/Documents/Dino/dino-sites/kwc-dinomonteverde/`)
- Borrow: everything functional — calculator, ticker, BOV funnel, closing cards with LP/SP·days·price mono lines, methodology, touch-reveal B&W photos, iOS 16px-input anti-zoom, `scroll-margin-top` anchor offsets, copy-email "Copied" flash, reduced-motion fallbacks. Its token DNA (warm surfaces, ink, serif/sans/mono trio) validates ours.
- Avoid: single-page-only SEO ceiling; hardcoded Monday-id→Crexi map; Dino-singular voice.
- Hokuten translation: same conversion machine, team-first voice, new brand skin, structured for later route split.
- Acceptance check: every kwc feature has a home in the Hokuten anatomy before we call parity.

### a100arms.com (live study 2026-08-07 — the Private Access channel; Razim owns the backend)
- Borrow: staged-disclosure grammar (dot + mono micro-label status: Listed / Off Market / Pre-Listing / Listed on Crexi; each stage owns one hue); locked-state anatomy (icon-in-tinted-ring + "Sign CA to Unlock" + honest fallback copy "Price on Request"); persona-lane section with per-lane accent; discretion copy voice ("Private by default", "Access and disclosure happen in stages"); mono-everywhere for deal data; the public-feed allowlist discipline (top-level fields only, `listingStage === "Listed"` only, never `a100_DealSnapshot`, never `rawMondayData`).
- Avoid: VS Code Dark+ chrome (#1e1e1e/#569cd6 dark-app theme — Hokuten is warm paper, dark is a section not a theme); JetBrains Mono as body voice; glassmorphism white/5 layering; emoji in logs/UI; app-density modals and 10px type; the marketing page's white/#111 section alternation.
- Hokuten translation: reference a100 only as the confidential "PRIVATE ACCESS →" channel (ghost CTA per Stone digest) — never name-drop its product UI, screenshots, tiers, or match scores on the public site; listing-card status badges reuse a100's stage semantics but restyled in Hokuten tokens (mono caps + gold/ink, no colored dots required); off-market teaser rows show only allowlisted fields and link out to `a100arms.com/signup`; deep links `a100arms.com/?propertyId=<id>`.
- Acceptance check: Hokuten pages contain zero a100 UI colors/fonts; every a100 mention reads as a private channel, not a product tour; renderer consumes only the allowlisted top-level fields; no photoUrl assumed until the photo-sync job ships (feed still has none as of 2026-08-07; feed now 9 properties — 5 Listed / 4 Off Market, apiVersion 3.5, plus new top-level `askingPrice`, `crexiLink`, `mondayStatus`, `hasSoftQuote`, `hasSponsorSoftQuote`, and a `rawMondayData` array on Listed rows that leaks internal names — treat as snapshot-class, never read).

### sarhanhotelgroup.com (cautionary reference)
- Borrow: services taxonomy (1031, refinance, buyer rep, JV/capital markets); testimonials pattern; ~$1B track-record narrative (evidence-gate before use).
- Avoid: stats broken without JS ("$0 B+"); names/awards baked into images (zero SEO/a11y); Crexi-widget-only inventory; stale news; template feel.
- Hokuten translation: real HTML text for everything; testimonials with named humans; blog only if we commit to cadence (Phase 4).
- Acceptance check: view-source shows every stat, name, and award as text.

## GitHub stars (rawzm) — approved for use
shadcn/ui (restyled primitives) · transitions.dev (motion recipes reference) · vibecoded-design-tells + no-ai-slop (QA gates in [07-audit.md](07-audit.md)) · designparser-mcp (dev-time checks) · mapcn (Phase 3 markets map) · coss (taste reference).
Quarantined study-only until a spike passes: liquid-dom, threecn.
