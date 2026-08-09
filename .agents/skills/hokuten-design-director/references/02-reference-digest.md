# 02 — Reference Digest

## Table Of Contents
How to digest · Inspiration sites · Ref-folder images · Design Revisit 1 references (2026-08-08) · Own properties (kwc, Sarhan) · GitHub stars

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

### Coronal video — `Ref/Praveen_Kumar_-_New_Health_Tech_Branding_Exploration_tZBENZ.mp4` (added 2026-08-07; Razim: "I love it, we need something like this integrated")
- Borrow: the **living dot-matrix artwork** — a 12s slowly-morphing indigo halftone cloud/bloom/ring, luminance-layered (wash → mid → deep ink-blue); the **plate chassis** — cool-white poster panel with hairline frame + print registration marks (corner circles/crosses), quiet gray grotesk caption top-left, white knockout plate carrying the wordmark + mono version tag centered over the art; the **data-card grammar** — white rounded card floating on art: micro-label, big black numerals ($4.7M–$8.2M), thin line chart, lavender chip badge with icon, mono taxonomy row (AI · ANALYTICS · PATTERN), blue primary + black secondary buttons; the ensō-like ring study as a standalone brand mark moment.
- Avoid: sci-fi copy voice ("synaptic match", "sever link"); pure cool grays for body text (we keep our ink ramp).
- Hokuten translation: this IS Theme B ("Hokuten Blue" = northern sky, literal). The ASCII/dither art program renders in the blue ramp on the plate chassis for the light hero; the morphing loop becomes our **ambient art loop** (pre-rendered frames, spec in [05-motion.md](05-motion.md)); the data card = the calculator result card and listing-card grammar (chip badge = our status pill with `--accent-chip` bg); registration marks join the light-mode chrome vocabulary (hairline + corner marks on plate sections); the ring study informs a blue ensō treatment of the hanko/north-star mark.
- Acceptance check: Theme B hero reads as a living print-proof plate — art morphs, chrome never moves; card numerals stay black/ink (not blue); registration marks appear only on plate-framed sections.

## Ref-folder images (`Ref/`, 14 files + 1 video) — synthesis

- Borrow: "heritage through a digital sieve" — classical subjects in ASCII/dither/engraving; low density, one idea per screen; index numbers everywhere (01–07 menus, numbered steps, page footers); dimmed-gray copy with selective white emphasis; small-caps value rail on hero edge; fixed chassis with swappable hero art (runcycle proof); split photo + dark panel; wireframe line-art on black for dark chapters (Golden Gate ref → hotel engraving); oversized stat numerals on grain cards (Moltgage "20x" ref); Aurelian dark hero (star grain, hairline arcs, right-rail caps values) compresses cleanly to mobile.
- Avoid: applying texture to UI chrome — texture lives in imagery only.
- Hokuten translation: hero = ASCII hotel on cover-panel black with gold/ivory characters; methodology = dark chapter with engraved hotel line-art + vertical stepper; stats = serif numerals + mono captions.
- Acceptance check: chrome is textureless; exactly one textured art object per viewport.
- The consent-modal filename is a spec (see [04-page-anatomy.md](04-page-anatomy.md) → Modals).

## Design Revisit 1 references (2026-08-08)

Four references studied per Razim's 2026-08-08 live review (`docs/DESIGN-REVISIT.md` §1/§2), digested here per the `study` verb — images opened and read with the Read tool, not written from description alone (three of four; the boarding-pass ticket has no image in this repo, see its entry). All four feed directly into the §4 section rebuilds; do not re-derive their anatomy from memory once §4 work starts — cite this section.

### `Ref/HOYskIPaMAEwBLK.jpeg` + `Ref/HOYsosgaYAAt2xu.jpeg` — runcycle.com hero (the hero chassis reference)

Both files screenshot the same runcycle.com hero at two different art crops/zooms of one underlying scene (a Claude Lorrain–style classical seascape: cypress trees, a marble statue, distant mountains, a temple colonnade), confirming the art is one large asset windowed differently, not two separate pieces.

- **Borrow:** A full-bleed typographic-halftone art band reconstructing the classical photograph in a repeated-glyph screen (tiny characters, not dots) that preserves the source photo's own colors — sky/sea stay blue, stone/columns stay warm gold-tan, foliage stays dark bronze-green. The band sits directly under a plain white nav (small mark left, plain-text links center, one filled pill CTA right — no overlay, chrome never touches the art) and is **truncated well short of full-screen** — roughly the top half of the first viewport, not 100vh. The headline row sits **below** the art on plain white ground: a large two-line serif display headline lower-left, a short sans sub-line + two pill CTAs (filled dark + ghost) stacked in a narrower column to its right — a horizontal split, not stacked centered copy. A hairlined logo strip (7 grayscale wordmarks, evenly spaced, static) closes the first viewport on a thin top rule, reading as a quiet trust band, not a marquee.
- **Avoid:** The product itself is an AI cold-caller — its copy voice ("AI agent that takes all your sales calls", "Install now") is SaaS-installer language, the wrong register entirely for a brokerage; take none of it. Its logo band is flat grayscale wordmarks at small scale — too quiet for what D2 asks of Hokuten's chips (dimensional, color, 44-52px); the runcycle treatment under-serves what we're shipping there.
- **Hokuten translation:** This is the §4.2 hero chassis, verbatim in structure: nav (unoverlaid) → full-bleed supplied 「北天」 glyph-mosaic art band, ~55-60svh, truncated → headline row below the art on the surface (Display-1 manifesto left with one italic accent word, sub + dual CTAs right, runcycle's split) → brands loop closes the 100svh screen (D2's real color chips, not runcycle's flat trust strip — same slot, deliberately heavier weight). The art itself is never runcycle's; it is Razim's supplied glyph-mosaic (D5). The truncation and "chrome below, never over" anatomy are the borrow, not the pixels.
- **Acceptance check:** [ ] Art band is one edge-to-edge `next/image` (`priority`) truncated between 55-60svh desktop, nav renders above it with no overlay, headline row sits on plain surface strictly below the art (never composited on top of it), brands loop is the last element inside the first 100svh screen.

### `Ref/6a4376f2caf5c096658693.jpg` — StoneInvestment menu overlay, anatomy detail (supersedes reliance on the 2026-08-06 site-level digest above for §4.3 rebuild precision)

The site-level `stoneinvestment.fr/en` entry under "Inspiration sites" above already named this pattern in general terms on 2026-08-06. This entry re-digests the actual screenshot at the precision §4.3's rebuild needs, because the shipped build got the anatomy wrong (Razim's screenshot: photo panel overlaps the index — P0).

- **Borrow:** A full-screen two-panel overlay, roughly a 1:2 split. Left third is a photographic art panel (a dark garden-terrace photo bleeding to black at its edges, with a second framed object — a magazine cover — resting lower-left as a still-life accent, not full-bleed). Right two-thirds is a near-black surface carrying the nav index: 7 items, large serif type, warm off-white ink, generous vertical rhythm (rows visibly breathe — well over 1x line-height between them). Each row's number (01-07) sits in a **fixed-width gutter far left of the label**, small mono, visibly dimmer than the label — the numbers read as their own quiet column, not a tight bracketed pair with the word next to it. A utilities row is pinned to the panel's bottom edge: location + phone lower-left, currency/language switcher beside it, a bordered ghost button lower-right ("PRIVATE ACCESS →", hairline rect, no fill, tracked caps + arrow). Close X sits top-left **of the art panel**, small, high-contrast.
- **Avoid:** The art panel is a raw, moody, real photograph — incompatible with Hokuten's D5 rule that the only art primitive is the supplied 「北天」 glyph-mosaic; never drop a raw photo in here. The stacked magazine-cover prop is a print-editorial device, too lifestyle/editorial for a CRE brokerage — skip it entirely, don't invent a Hokuten equivalent.
- **Hokuten translation:** §4.3 rebuild: left ~1/3 = supplied glyph-mosaic art panel (interim, until the piece lands: a designed dark surface + `<KanjiAccent>`, never a raw photo), right ~2/3 = `.surface-dark` (indigo in Theme B) carrying the numbered index. The anatomy fix that matters most: **art panel and index column are two non-overlapping grid children, always** — never a photo with text stacked over it, which is exactly the defect being retired. Number gutter stays a genuinely separate left column, dim mono, clearing the label's left edge by a visible margin — never glued to the word as a bracketed micro-label would be. Utilities row pinned to the dark panel's bottom edge exactly as observed (phone/email left, ghost "PRIVATE ACCESS →" right, mapping to the a100 Arms off-market channel per the existing site-level digest). Close X stays top-left, ≥44px tap target, on the art panel.
- **Acceptance check:** [ ] Art panel and index column render as two non-overlapping grid regions at every viewport ≥768px (the exact P0 being fixed); number gutter measurably clears the label's left edge; utilities row is pinned to the panel's bottom edge, not mid-flow; close X ≥44px, top-left, visible focus ring.

### Boarding-pass ticket — *source: chat screenshot, 2026-08-08, not in repo*

Digested from Razim's verbal/chat description recorded in `docs/DESIGN-REVISIT.md` §1 only — the image itself was shared in chat, not saved to this repo, and was not independently viewed for this digest. Treat every anatomy claim below as second-hand until an actual file lands; do not upgrade it to "verified from image" in any later note.

- **Borrow:** A two-part physical-ticket anatomy — a color header block joined to a body by a perforated tear seam (dashed rule + punched circular notches at the edges). The body is a structured label/value grid: tiny uppercase caps labels over bold values. Corners read as "punched"/die-cut. The whole object casts a soft, dimensional (not flat) shadow. Described elements also include a QR block and an overall boarding-pass/travel-document read.
- **Avoid — explicitly, inspiration only, never cloned:** **No QR code**, anywhere, on any Hokuten ticket — it signals "scan to board," the wrong metaphor for a deal record, and risks a fake-functionality tell (a QR that does nothing). **No airline/travel signifiers of any kind** — no gate/seat/boarding-group fields, no barcode strip, no "BOARDING PASS" language, no origin→destination routing, no illustrated ticket-stub graphic. This reference lends an anatomy (header block / tear seam / label-value grid / dimensional shadow), never a literal boarding-pass reskin. Do not chase a skeuomorphic punched-corner illustration if it reads as gimmicky — the corner motif translates to restrained CSS (mask/shadow), not a die-cut illustration.
- **Hokuten translation (D4, §4.5 — the deal-ticket system):** Header block = the real listing/closing photo, or a solid surface + hanko punch where no photo exists (never a printed-ink color block). Tear line = CSS dashed rule + radial-gradient punch-notch masks at the header/grid seam — the one literal borrow. Data grid = tiny caps labels over bold **mono** values (price, keys, cap rate, LP/SP, days-on-market) — a one-for-one replacement of the boarding-pass's flight/seat/gate fields with real deal data, never decorative filler. No QR block; if a scan affordance is ever wanted it is a separate, later, evidence-gated decision (a real Crexi-link QR, never decorative), not part of this pass. Shadow = `--shadow-ticket` / `--shadow-ticket-dark` tokens, soft and ink-tinted, never a gray blur halo (D4 suspends "1px-borders-over-shadows" for cards only). SOLD/CLOSED tickets get a retired treatment — muted/grayscale header + a rotated hanko-adjacent `overprint` stamp, never a cheesy red rubber stamp.
- **Acceptance check:** [ ] No QR code, no barcode, no gate/seat/boarding-group field, no "BOARDING PASS"-class language anywhere on a shipped ticket; tear seam is CSS dashed rule + mask-based punch notches, not an illustrated graphic; every data-grid value comes from `content/closings.ts`/`content/listings.ts`, never a placeholder field; shadow uses `--shadow-ticket{,-dark}` tokens only.

### `Ref/site/` (7 files) — production identity + award assets, NOT inspiration

**Scope exception, recorded here per Razim's 2026-08-08 instruction:** "Ref/ never imports to production" is overridden for `Ref/site/` only. Prepared copies export into `site/public/brand/` and `site/public/awards/`; `Ref/site/` keeps the masters, untouched. This entry documents what was actually opened so intake/prep is accurate, not a Borrow/Avoid inspiration read — the format below is adapted for that.

- **`logo-blue.PNG`** (1240×1240): the Theme B (Hokuten Blue) header lockup. A deep-navy panel with oversized white serif-slab "KW" caps, a small illustrated scene inset (Mt. Fuji silhouette + cloud bands + a 6-point compass/north-star mark, upper right), inside a thin gold-bordered frame with one chamfered (45°-cut) top-left corner. Below the navy panel: a white bar reading "COMMERCIAL" in navy serif caps flanked by short gold hairline flourishes, then a second white band reading "THE HOKUTEN GROUP" in navy tracked sans caps, closed by a small gold 4-point star centered on the bottom edge.
- **`logo-yellow.jpg`** (925×768): the Theme G (gold) header lockup — the classic KW gold-box mark. A gold-filled chamfered rectangle (same clipped top-left corner) with white serif-slab "KW", "COMMERCIAL" in black serif caps on a white bar beneath the box, and "THE HOKUTEN GROUP" set outside/below the box in gold tracked sans caps on white ground. No illustrated scene — flat classic KW color, visually a different family from the blue lockup, not just a recolor.
- **`powerbroker-q3-2025.png`** (opened; `-q1-2026`/`-q2-2026` share the file-naming template, not individually opened): CoStar's own brand blue ground (vendor color baked into the raster — not a Hokuten token), white CoStar swoosh + wordmark top-left, "POWERBROKER™ QUARTERLY DEALS" in bold white caps beneath it, a lighter-blue chip reading "Q3 2025 DEALS" beside large white "WINNER" caps, an NYC skyline photo bleeding in from the right behind a white diagonal cut.
- **`US_2025Annual_TopBroker.png`** / **`US_2025Annual_TopFirm.png`** (600×130 each): visually a **distinct family** from the quarterly banners — black ground (not CoStar blue), white CoStar mark + "POWER BROKER AWARD" wordmark left, gold "WINNER" + large white "TOP BROKER" / "TOP FIRM" center, a gray "2025 ANNUAL AWARDS" chip beneath the wordmark, the same NYC-skyline-behind-diagonal-cut device right. The black/gold Annual pair and the blue Quarterly trio read as two separate badge tiers at a glance.
- **Avoid:** Do not recolor, re-crop into, or otherwise alter any of these rasters beyond trim/knockout/format-optimize (D1: trim, knock out the surrounding white/near-white ground or mount on a deliberate light chip, export 2× raster + AVIF/WebP). Do not place `logo-blue.PNG`'s illustrated Fuji/north-star scene near the 「北天」 glyph-mosaic art band in the same viewport — two illustrated-device motifs stacked in one screen double up and cheapen both. Do not merge the Quarterly (blue) and Annual (black/gold) families into one uniform row expecting them to read as one system — they are two different vendor templates; §4.4 places them as two distinct moments, not one strip.
- **Hokuten translation:** D1 — `logo-blue.PNG`-derived asset renders on `[data-theme="blue"]`, `logo-yellow.jpg`-derived asset on `[data-theme="gold"]`, ~40-48px render height, real-text "THE HOKUTEN GROUP" (or "KW Commercial · The Hokuten Group") stays adjacent in the DOM (visually-hidden acceptable) — a name baked into a raster never substitutes for real text (the Sarhan anti-pattern this skill already bans). D3 — the 3 Quarterly banners render as one clean evidence row (stats section, §4.4); the 2 Annual banners render as a separate slim recognition strip elsewhere (recommended: `#closings` header area or beside the team section header) so the two families never compete in one glance.
- **Acceptance check:** [ ] Header renders the blue-derived lockup under `[data-theme="blue"]` and the gold-derived lockup under `[data-theme="gold"]` at a stable ~40-48px height with zero CLS; a real-text brand string exists in the DOM adjacent to the lockup, not only inside the raster; the 3 Quarterly and 2 Annual CoStar badges never render in the same row/strip.

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
