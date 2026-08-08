# DESIGN REVISIT 1 — EXECUTION BRIEF

**Addressed to: the implementing agent (OPUS-5).** Razim reviewed both live theme URLs on 2026-08-08 and issued a full design revisit. This brief is the complete, pre-resolved work order. The repo's rule system is still law — but §2 below records the decisions Razim made in this review that **supersede** earlier rules; part of your job is updating those rules so the audits enforce the new direction, not the old one.

**Status:** `approved` (Razim, 2026-08-08, verbal review with screenshots) · **Companions:** [PHASE-1-EXECUTION.md](PHASE-1-EXECUTION.md) (still the base spec where this brief is silent) · [AGENT-BRIEF.md](AGENT-BRIEF.md) (compressed rulebook for subagents) · design skill `.agents/skills/hokuten-design-director/` · [PROJECT-MEMORY.md](../PROJECT-MEMORY.md) · [docs/RESUME.md](RESUME.md) (build-state handoff + session-budget protocol)

**Kickoff for the executor:** *"Read docs/DESIGN-REVISIT.md in the hokuten repo and execute it."*

---

## 0. How you work (carried forward — these were learned the hard way)

- **Multiple Workflow-tool orchestrations, max concurrency** — Razim's standing instruction. But: **integration, page assembly and build-fixing stay in the main loop** (cheap, must be right). Get to a green build early and after every workflow; never let five workflows of unbuilt code pile up.
- **Model economics** (measured, not guessed): ~35–40 Opus agents ≈ one full session budget. Route pattern work (sections, components, restyles) to **Sonnet**; reserve **Opus** for the frozen-math parity, byte-exact compliance text, canvas perf, and adversarial verification. Razim signals at ~87% usage → `TaskStop` everything, commit, refresh `docs/RESUME.md`, push.
- **The RSC lesson**: never attach a subcomponent to a `"use client"` component via `Object.assign` and render it from a Server Component — the property doesn't cross the boundary and React throws "Element type is invalid" with no stack. Named exports only. (Named exports are now the repo convention everywhere.)
- **Screenshot QA is mandatory this round.** Every redesigned section is verified by loading the dev server and screenshotting **both themes × 375 / 768 / 1440** before it's called done. Razim reviews by eye; the last round shipped a broken menu overlay because nobody looked.
- Commit + push after every milestone; fast-forward `theme-blue` (zero code diff) so both URLs track. Dated PROJECT-MEMORY entry before every push. No Co-Authored-By/AI trailers, ever.
- Read order before any work: `AGENTS.md` → `PROJECT-MEMORY.md` → skill refs 01/03/04/05/07 → `docs/AGENT-BRIEF.md` → this brief end to end.

## 1. New reference intake (run the skill's `study` verb first)

Digest each into skill ref 02 (Borrow / Avoid / Hokuten translation / Acceptance check), then build to them:

| Ref | What it is | What we take |
|---|---|---|
| `Ref/HOYskIPaMAEwBLK.jpeg` + `Ref/HOYsosgaYAAt2xu.jpeg` (runcycle.com hero) | Full-bleed **typographic-halftone art band**: classical subject reconstructed in tiny repeated glyphs **with the photograph's colors preserved** — blues stay blue, stone stays warm. Art band sits under a clean white nav, is **truncated** (~55–60vh, not full-screen), headline row sits BELOW the art (large serif display left, small sans sub + two pill CTAs right), and a **logo bar** closes the first viewport. | The hero anatomy, and the look Razim's supplied 「北天」 artwork will have (D5 — we place it, we don't generate it). |
| `Ref/6a4376f2caf5c096658693.jpg` (StoneInvestment menu) | Full-screen overlay: art panel left (~1/3), dark panel right with a generously spaced serif numbered index (01–07, small mono numbers far left of each label), utilities row pinned bottom (location · phone · currency/lang · ghost PRIVATE ACCESS →), close X top-left. | The menu overlay anatomy, executed properly this time. |
| `image.png` (boarding-pass screenshot, provided in chat) | Two-part ticket: color header block, perforation notches, dashed tear line, structured label/value grid in tiny caps + bold values, QR block, punched corners, soft dimensional shadow. | **Inspiration only, never cloned** — the anatomy for the new listing/closing ticket cards, translated to deal data. |
| `Ref/site/` (7 files) | `logo-blue.PNG` + `logo-yellow.jpg`: KW COMMERCIAL / THE HOKUTEN GROUP lockups (blue: Fuji + north-star panel art; gold: classic KW gold). Three CoStar Power Broker Quarterly Deals winner banners (Q3'25, Q1'26, Q2'26) + `US_2025Annual_TopBroker.png` + `US_2025Annual_TopFirm.png`. | Production assets. Razim explicitly overrides the "Ref/ never imports to production" rule **for Ref/site only** — export prepared copies into `site/public/brand/` and `site/public/awards/`; Ref/ keeps the masters. |

## 2. Decisions logged in this review (Razim, 2026-08-08) — update the rules to match

Each of these supersedes prior law. **W0 (first workflow) updates the governing docs** — AGENTS.md, skill refs 01/03/04/05/06/07, AGENT-BRIEF.md — so concurrent audits enforce the new rules. Every supersession gets a dated line in the doc it changes.

1. **D1 — Header logo.** The theme-matched `Ref/site` lockup replaces the text wordmark top-left (blue lockup on Theme B, gold on Theme G). This **supersedes** "no KW lockup in the header / Hokuten-first" (2026-08-07) — remove that P0 from ref 07 and AGENTS.md. Keep real-text brand line adjacent or visually-hidden for SEO/AT (names baked into images stay the Sarhan anti-pattern). Asset prep: trim, knock out the white bg (or mount on a deliberate light chip that works over both nav states), export 2× raster + proper sizes; header render height ~40–48px.
2. **D2 — Brands marquee: real logos, colorful, in the first viewport.** Actual franchise-flag logos (not text marks), **in color**, uniform optical height, looping marquee, covering the full flag set we transact across ($1M–$100M: Wyndham, Choice, Best Western, IHG, Radisson, Sonesta, Hilton, Marriott, Hyatt, + independents note). Supersedes "grayscale only / never colorized" in refs 01/04. Source official press-resource vectors/rasters; keep per-logo provenance in `docs/design/LOGO-MANIFEST.md`; the counsel flag for public launch stays in PLACEHOLDERS (site is internal-only — Razim accepts the interim posture). Trademark disclaimer text stays **byte-exact** but renders tiny: `text-micro` at reduced emphasis with a leading asterisk, one line, not a paragraph block.
3. **D3 — CoStar signatures.** Render the actual CoStar banners, not typographic claims. Add register rows in ref 06 for the two **new** claims (CoStar 2025 Annual Top Broker; 2025 Annual Top Firm) — source: badge assets provided by Razim 2026-08-08, status `verified-current`. Spread placements so nothing is congested (see §4.4).
4. **D4 — Ticket cards.** Listing/closing cards become dimensional "deal tickets" (see §4.5). Supersedes "1px-borders-over-shadows" **for cards only**; shadows stay soft and ink-tinted — never gray-blur halos. Ref 03 gets the ticket component spec.
5. **D5 — 「北天」 glyph-mosaic artwork, SUPPLIED by Razim (corrected same evening).** The signature image treatment is a **typographic halftone / glyph-mosaic reconstruction** whose only rendering primitive is the repeated text unit 「北天」 — depth carried by glyph scale, spacing, density, weight, overlap, color and contrast, source colors preserved (the runcycle look, ours via the kanji). It is **not ASCII and not generated by this repo**: Razim produces the artworks himself with a controlled img2img prompt and delivers finished image files; the executor prepares and places them (§3). The build-time ascii-gen / AsciiCanvas system is **retired from the page** once supplied art lands — the script stays in the repo, but no further investment in it. Rule clarification to log in ref 03: the anti-AI-slop ban covers fake *photography*; Razim-approved img2img **stylized glyph art** is the house treatment. The **北天 background-motif layer** (`<KanjiAccent>`, our own SVG) still ships and is still ours to build.
6. **D6 — Density.** Every desktop section targets **fit-to-viewport** (≈100svh minus nav/ticker). Section padding compresses sitewide; no dead bands between sections; the footer collapses to a compact band. Mobile keeps natural flow. No scroll-jacking (ref 05 still binds): where content genuinely exceeds the viewport (calculator step 3), it scrolls *inside* the section with a visible affordance — native overflow, keyboard-reachable, never hijacked wheel.
7. **D7 — JS budget re-based** (closes the open ship-gate question). Measured reality: 272KB gz first-load; the framework floor alone is 129KB, so ref 05's 180KB is unreachable as written. New gates: **critical-path JS ≤ 200KB gzip** (hero + nav + stats interactive) and **full landing route ≤ 340KB gzip**, achieved via mandatory `LazyMotion`/`domAnimation` + `motion/react-m` (~-17KB, kills the unused drag/layout feature set), and dynamic imports for Calculator, BOV form, MenuOverlay, ConsentModal (none belong in the hero's critical path). LCP <2.5s / CLS <0.02 / INP <200ms stay binding. Update ref 05 + ref 07 with a dated note; PROJECT-MEMORY records the amendment.
8. **D8 — Typography contrast pass.** The current page reads too uniform. Amplify hierarchy deliberately: bigger display steps, firmer bold moments (Inter 600 where it earns it; Fraunces may step 300→500 for contrast — still never 600+), more italic accents *within the one-per-headline discipline*, heavier use of the mono/caps micro-voice for labels and data. Update ref 03's ramp with a dated note. The goal is "pop with hierarchy," not louder everything.

## 3. Art program v2 — supplied 「北天」 glyph-mosaic artwork

**The repo does not generate this art.** Razim produces each piece with a controlled img2img prompt (typographic halftone; sole primitive 「北天」; depth via glyph scale/spacing/density/weight/overlap/color/contrast; source-photo colors preserved) and drops finished files. Your job is intake, preparation, placement — and telling Razim exactly what you need.

1. **Artwork intake manifest.** Maintain it in `content/artwork.ts` — a typed registry mapping placement → asset path + alt + status, so a delivered file is a data edit, not a refactor. Until a piece lands, its placement renders the current interim art (the existing static ASCII frame or a designed surface) and carries `blocked: awaiting-artwork` in `docs/PLACEHOLDERS.md`. Pieces to request from Razim:

   | Piece | Placement | Target shape | Notes |
   |---|---|---|---|
   | Hero band | §4.2, both themes | ~2:1–21:9 landscape, ≥2560px wide | The signature. Source subject: an owned track-record hotel / NYC. Must survive a ~55–60svh crop at all viewports |
   | Menu panel | §4.3 overlay left third | portrait ~3:4, ≥1200px wide | Reads against the dark index panel |
   | Method chapter | §4.7, dark ground | ~4:3 or square, ≥1600px | Replaces the retired engraving; must sit on `--dark`/indigo |
   | Listing placeholder | §4.5 ticket header, no-photo listings | ~3:2, ≥1200px | Replaces the current SVG placeholder |
   | (Optional) BOV/doors accent | §4.9 side panel | flexible | Only if Razim wants one there |

   Drop location for masters: `Ref/site/art/` (production-approved per D1's Ref/site exception); executor optimizes copies into `site/public/art/`.
2. **Preparation.** sharp pipeline per piece: AVIF + WebP + JPEG fallback via `next/image`, responsive `sizes`, explicit dimensions (CLS 0), hero gets `priority` (it is the LCP element — a static image here is *better* for LCP than the old canvas). Budget: hero ≤ ~350KB AVIF at 2560w; others ≤ 250KB. Alt text describes the depicted subject, not the treatment.
3. **Both themes, one artwork.** The art carries its own colors; the theme governs the chrome around it. Verify overlaid UI (nav state, seam of the headline row) stays legible against each piece in both themes — screenshot QA.
4. **What retires**: AsciiCanvas/shimmer/morph-loop off the page (script kept, uninvested); the seam-row requirement (`THE HOKUTEN GROUP` resolving in-art) retires as a build concern — if Razim wants it, it goes in his img2img prompt, not in our pipeline.
5. **`<KanjiAccent>` — still ours.** The reusable 北天 background motif: huge outlined/low-opacity 北/天 glyphs (SVG paths, reuse the hanko glyph geometry, never `<text>`), placed like OrbitalArcs: absolute, aria-hidden, pointer-events-none, ≤8% opacity dark / ≤6% light, one per section max. Use in menu overlay, calculator, BOV, and wherever a side accent is needed. Joins the motif system in ref 01.
6. **D7 bonus**: retiring the canvas + its JSON removes ~200KB gz of asset fetch and the playback JS from the hero path — recount the budgets after the swap and record the new numbers.

## 4. Section-by-section work order

Numbered micro-label sequence `01 #closings … 09 #bov` is now canonical (audit decision 2026-08-08) — keep it; renumber the menu overlay to match (kills the conflicting second index in `content/nav.ts`).

### 4.1 Nav + logo
Theme lockup from D1 top-left, height-stable. Fix from the a11y audit while in here: route the hero CTAs through the shared anchor-focus handler (a tiny `<AnchorLink>` client island, exported once — nav already moves focus, hero doesn't).

### 4.2 Hero — the runcycle anatomy (both themes, one chassis change)
Current defect: the art is a small block bottom-right. Rebuild:
- Row 1: clean nav (surface, not overlaid).
- Row 2: **full-bleed supplied glyph-mosaic artwork, ~55–60svh**, edge to edge — a static optimized image (`next/image`, `priority`; it is the LCP element). Art carries its own colors in both themes; theme governs chrome. Interim until Razim's file lands: the existing static ASCII frame, full-bleed, so the layout ships now and the art swap is a data edit.
- Row 3: headline row on the surface below the art — Display-1 manifesto left (one italic accent word), sub + dual CTAs right (runcycle's split).
- Row 4: **the brands logo loop closes the viewport** (D2) with the asterisked micro-disclaimer beneath it.
- The whole thing = one 100svh screen on desktop. Mobile: art band ~40svh, stacked copy, brands loop below (natural flow).
- Theme B may keep plate-chrome accents (registration marks on the surface rows, not on the art), but the art band itself is now the same anatomy in both themes; retire the small-plate layout.

### 4.3 Menu overlay — Stone anatomy, properly this time
Current build is **broken** (the photo panel overlaps the index — see Razim's screenshot; treat as P0). Rebuild full-screen: left ~1/3 supplied glyph-mosaic art panel (NOT a raw photo; interim = designed dark surface with `<KanjiAccent>` until the piece lands), right panel `.surface-dark` (indigo in Theme B) with the serif numbered index (small mono numbers in a left gutter column, generous vertical rhythm, hover = accent underline + number brightens), `<KanjiAccent>` behind the index, utilities pinned to the bottom row (phone · email · PRIVATE ACCESS → ghost), close X ≥44px. Focus trap/restore/Esc/scroll-lock as already built. Mobile: single dark panel, art collapses to a thin top band.

### 4.4 Stats + CoStar signatures
Keep server-rendered numerals + count-up. Add the **real badges**: the three quarterly banners as a clean row (uniform height, spaced, linked to nothing) replacing the bare "3×" moment — the numeral can stay as the anchor with the banners as evidence beneath. Place the two **2025 Annual** badges elsewhere so nothing crowds — recommended: a slim recognition strip in `#closings`' header area or beside the team section header. Register rows first (D3). Verify the numeral row is never clipped under the sticky nav (Razim's screenshot shows the top of the numerals cut — reproduce, diagnose, fix).

### 4.5 Ticket cards — closings and listings
Replace both card designs with a **deal-ticket system** (boarding-pass translation, ours):
- Shared anatomy: color header band (the real listing/closing photo, or solid surface w/ hanko punch where no photo exists), perforated tear-line (CSS dashed + punched notches via radial-gradient masks), structured label/value grid — tiny caps labels over **bold mono values** (price, keys, cap, LP/SP, days), soft ink-tinted dimensional shadow (D4), rounded-card radius, hover lifts *nothing* (no translate — the dimension is in the resting shadow; hover = photo color reveal + accent ring, as now).
- **Listings (ACTIVE)**: full-color ticket, EXCLUSIVE badge as the "class" chip, cap-rate chip, Crexi link as the stub action ("View on Crexi →" in the stub), designed placeholder art where photos are missing.
- **Closings (SOLD)**: visually "retired" ticket — muted/grayscale header, a **CLOSED/SOLD overprint stamp** (rotated hairline stamp mark, hanko-adjacent, not a cheesy red rubber stamp), metrics grid showing the proof line (LP/SP · days · price).
- Cards must still read in 5 seconds for a Crexi user (ref 07 gate), keep fixed-height slots, keyboard focus ring on the whole ticket, print legibly.

### 4.6 Calculator — from intake form to landscape experience
Full-width redesign, **landscape orientation** (kill the current text-left/form-right portrait split):
- Horizontal stepper across the top (01 · 02 · 03 as now). Each step fills the section **within the viewport** (D6); step 3's density is solved by layout (grid the fields; the results become a dashboard row), not by a long scroll — internal native scroll only if truly unavoidable.
- **Every dropdown becomes selectable option tiles.** Property type = 5 tiles with imagery (chromatic-sieve/line-art thumbnails derived from owned photos or neutral type-icons — **no stock photography**, the ban stands); tier/market, condition, brand, ground lease, F&B = tile/segment groups. Tiles are real radio groups (labels, arrow-key navigation, 44px, checked = accent ring + chip).
- **Make it an experience with real data, not decoration**: the frozen config *is* market data — surface it. A live context rail showing the typical OCC/ADR/RevPAR band for the selected type (from `OCC_BAND`/`ADR_BAND`/`REVPAR_BAND`), the TYPICAL autofill as tappable "market typical" chips, live ticker rates (10-Yr, SOFR) as a footnote row, and the benchmark bars promoted into the step-3 dashboard. All numbers mono tabular; all already-verified data — invent nothing.
- The **math stays frozen**. UI-only. Popovers, RevPAR preview, autofill, insights, disclaimers (both) all survive field-for-field — re-verify against `docs/port/01-calculator.md` §B after the redesign; a dropped field/popover is a content-fidelity P0.
- `<KanjiAccent>` side accent; typography per D8; zero CLS on step changes.

### 4.7 `#method` — art swap + compaction
Retire the engraving. Its slot takes the supplied Method-chapter glyph-mosaic piece (dark-ground variant, per the §3 manifest); interim = `star-grain` + OrbitalArcs + `<KanjiAccent>` alone, which already read well. Keep stepper, reach stats, two-tone paragraph, hanko stamp ②. Compress to fit-viewport.

### 4.8 `#doors`, `#mandates`, `#team`, `#faq` — density pass
Compress padding to the D6 rhythm, apply D8 hierarchy, keep all content and a11y wiring. Team cards may adopt a lighter ticket-adjacent treatment for visual kinship (don't force it). FAQ placeholder notices stay visible (launch gate).

### 4.9 `#bov` [ 09 ] — landscape + fit
Same treatment as the calculator: landscape split (pitch/context left w/ `<KanjiAccent>`, form fields in a 2-col grid right), fits the viewport, TCPA block byte-exact and fully visible (legal text never gets tucked into a scroll well), inline success/error as built.

### 4.10 Footer — compact
Collapse to a tight band: one row of link columns at small type, lockup + hanko small on the left, the byte-exact disclosure + legal links + brand line in a dense stack. Kill the duplicated KW mark (the audit flagged it renders twice) — with D1 putting the lockup in the header, the footer needs only ONE compliance mark instance. Target ≤ ~40% of current height. Ticker clearance stays.

### 4.11 Global rhythm + typography
Sweep every section boundary: adjacent same-surface sections share one padding, `section-pad` compresses (define a `section-pad-tight`), SectionHeader margins tighten, no orphan bands. Apply D8 across all headlines/labels/data moments. Screenshot-verify the full-page scroll in both themes.

## 5. Carried-over ship-gate items (fold into this round, don't lose them)

1. "Nationwide" qualifier: port the source's qualifier line (`index.html:1152`) as a frozen `OUT_OF_STATE_QUALIFIER` in `content/compliance.ts`, render beside the footer disclosure, add the register row. (Compliance P0 from the gate.)
2. `app/layout.tsx` description retypes stats → import from `content/stats.ts`.
3. `content/faq.ts` retypes the disclosure → import `BROKERAGE_DISCLOSURE`.
4. Add a vitest equality test binding the two calculator-disclaimer owners (`content/compliance.ts` ↔ `lib/valuation.ts`).
5. Calculator email capture gets the same privacy link the BOV form carries.
6. `will-change` audit fixes (resting `photo-reveal`, unconditional marquee) + SiteNav active-state font-weight reflow (reserve width; don't swap weights on scroll).
7. "RCA" claim in calculator copy has no register row — add one (source-verifiable) or drop the word.
8. LOGO-MANIFEST + PLACEHOLDERS refresh after D2; `docs/design/AUDIT_LOG.md` entries for every re-audit.

## 6. Definition of done

- Every §4 item built to spec, **screenshot-verified in both themes × 375/768/1440**, with the screenshots' paths listed in the completion report.
- Build green; vitest ≥120 green (calculator parity untouched); both branches pushed; both Vercel URLs verified rendering.
- Re-run the ship-gate audits (tokens/dual-theme, a11y, compliance, content-fidelity, perf vs the **D7** budgets, anti-slop) on the changed surface; findings fixed or escalated; AUDIT_LOG appended.
- Rules updated per §2 with dated supersession notes; PROJECT-MEMORY entry; PLACEHOLDERS current; RESUME.md refreshed.
- Out of scope, unchanged: everything in PHASE-1-EXECUTION §12 (no marketplace, no feed, no CMS, no WebGL, no JP locale — the 北天 motif ships, the locale does not).
