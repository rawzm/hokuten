# 04 — Page Anatomy (Phase 1 landing chassis)

## Table Of Contents
Nav · Section order · Per-section spec · Modals · Footer · Mobile rules

Single page, anchor navigation, structured so each section can graduate to its own route in Phase 3 (each section = one component + one content module).

**Revised 2026-08-08 — Design Revisit 1.** Razim reviewed both live theme URLs and issued a full revisit (full order: `docs/DESIGN-REVISIT.md`; decisions D1–D8 in its §2). Every change below is dated and marked **superseded**, not deleted — the prior anatomy stays visible immediately next to what replaces it, per the project's memory protocol.

## Nav

Sticky top bar, `--nav-h` (68px desktop / 60px mobile — D6, compressed from 88px 2026-08-08).

**Superseded 2026-08-08 (D1 + D6).** Original: "paper with blur on scroll (dark variant over hero): Hokuten wordmark left." **The nav is now a clean, opaque surface bar on every section including the hero** — the dark-over-hero variant retires entirely. It no longer needs to recede into a transparent/dark state on the hero screen, because the art band now sits BELOW the nav in the hero's row order (see `#hero` below), not behind it.

**Current spec:**
- **Left** — the theme-matched KW/Hokuten lockup (D1: blue lockup on Theme B, gold on Theme G; asset spec + the adjacent real-text brand line requirement: [01-brand.md](01-brand.md) → Lockups & usage), height-stable ~40–48px.
- **Center** — anchor links: Listings · Track Record · Valuation · Method · Team.
- **Right** — accent pill CTA "Request a written BOV" → `#bov`, routed through the shared `<AnchorLink>` focus-handling island (a11y carry-over: nav already moves focus to the target heading on click; the hero's own CTAs didn't, until this fix).

**Menu (mobile + desktop overflow) — rebuilt 2026-08-08 (the Stone anatomy, properly this time).** The previous build shipped a P0 defect (Razim's screenshot): the photo panel overlapped the index. Full-screen overlay, two columns on desktop:
- **Left ~1/3** — supplied 「北天」 glyph-mosaic art panel, portrait crop. Interim until a piece is placed here: a designed dark surface carrying one `<KanjiAccent>` — never a raw photo ([01-brand.md](01-brand.md) → Motif system).
- **Right ~2/3** — `.surface-dark` (indigo in Theme B), the serif numbered index: small mono numbers in a left gutter column, generous vertical rhythm between rows, hover = accent underline draw-in + the number brightens to full accent. One `<KanjiAccent>` sits behind the index (the section's one-per-section allotment). Utilities pinned to the bottom row: phone · email · `PRIVATE ACCESS →` ghost link to a100 Arms. Close `X`, ≥44px tap target.
- Focus trap, focus restore on close, `Esc` to close, body-scroll lock — unchanged from the existing build; these were not the defective part.
- **Mobile**: collapses to a single dark panel — the art panel becomes a thin band across the top (not a full left column), index and utilities stack full-width below it.

**Menu index — renumbered 2026-08-08 to match the canonical section sequence.** This retires the menu's own independent numbering, which conflicted with the section micro-labels (the menu listed Listings before Track Record while the page renders Track Record first, and it omitted `#doors` and `#faq` entirely). The menu index is now the **same nine rows** as "Section index" below, same order, same numbers. `#hero` is not a row — opening the overlay assumes you're already on the page, and the close `X` returns you to where you were, not to a numbered destination.

`01 Track Record → #closings · 02 Listings → #listings · 03 Valuation → #calculator · 04 Method → #method · 05 The Owner / The Investor → #doors · 06 Mandates → #mandates · 07 Team → #team · 08 Diligence FAQ → #faq · 09 Contact → #bov`

(Every label above is the section's own real, already-shipped `SectionHeader` label or an existing nav string — nothing here is newly invented copy: "Track Record"/"Listings"/"Valuation"/"Method"/"Mandates"/"Team"/"Contact" already exist in the pre-revisit `content/nav.ts`; "The Owner / The Investor" is `DoorsSection.tsx`'s own `SectionHeader` label; "Diligence FAQ" is `FaqSection.tsx`'s own `SectionHeader` label. `content/nav.ts` — not this file — owns the literal array; this is the spec it must be edited to match.)

## Section order

**Section index — canonical, 2026-08-08 (audit decision, confirmed against the already-shipped `index="0N"` props on every section component).** The numbered micro-label sequence is `[ 01 ]` `#closings` through `[ 09 ]` `#bov` — nine numbered sections. Writing it out in full so no future agent has to guess:

1. `#hero` — full-bleed glyph-mosaic hero. **`#brands` now renders as row 4 inside this section's own viewport** (D2 — see `#hero` below), not as an independently-scrolled section. The `#brands` anchor id is kept on that row so existing nav/anchor references still resolve; it is a child of `#hero` in the DOM, not a sibling landmark. No micro-label number.
2. `#stats` — trust metrics band + CoStar badge row (see `#stats` below). No micro-label number.
3. `[ 01 ]` `#closings` — Recently Closed (track record)
4. `[ 02 ]` `#listings` — Hotels for Sale
5. `[ 03 ]` `#calculator` — Hotel Worth Calculator
6. `[ 04 ]` `#method` — How We Run a Sale (dark chapter)
7. `[ 05 ]` `#doors` — The Owner / The Investor
8. `[ 06 ]` `#mandates` — Capital & Standing Mandates (dark)
9. `[ 07 ]` `#team` — The Principals
10. `[ 08 ]` `#faq` — Diligence FAQ
11. `[ 09 ]` `#bov` — BOV request form
12. Footer (compact band, D6) + persistent `#ticker` (fixed bottom)

The menu overlay's index (see "Nav" above) mirrors rows 3–11 exactly — same numbers, same order, same destinations. That correspondence is what "renumbered to match" means.

## Per-section spec

**Density, D6 (2026-08-08) — applies to every section below, not repeated per section.** Every desktop section targets fit-to-viewport (`section-fit` utility, ≈100svh minus nav/ticker — `--screen-fit` in `globals.css`). Section padding compresses sitewide (`section-pad`, already compressed 2026-08-08; use `section-pad-tight` where a section carries dense content or sits adjacent to a same-surface neighbour). Two adjacent sections on the same surface share **one** gutter, not two (`section-join` on the second of the pair) — no dead bands between sections. Mobile is exempt everywhere: natural document flow, no fit-to-viewport constraint. Where a section's content genuinely exceeds the viewport (documented case: `#calculator` step 3), it scrolls **inside** the section via native overflow (`scroll-well` utility, with its visible fade affordance) — never a hijacked wheel event (ref 05's no-scroll-jacking rule is unchanged). The footer's own D6 compaction is at "Footer," below.

### `#hero` — rebuilt 2026-08-08 (D1 / D2 / D5 / D6 / D8, Razim live review)

**Superseded anatomy (2026-08-07, kept for the record — do not rebuild this).** Dark `--black` panel; micro-label eyebrow + Display-1 manifesto + sub + dual CTAs + a right-edge value rail, all layered over/beside an ASCII hotel canvas whose seam row resolved into THE HOKUTEN GROUP in the art's lower third, engineered as disjoint copy/art boxes across two theme-specific chassis (`HeroCoverPanel.tsx` Theme G, `HeroPlate.tsx` Theme B, switched by `Hero.tsx`). Defect that triggered the rebuild: the art rendered as a small block, not the signature moment it was meant to be.

**Current anatomy — the runcycle chassis** (`Ref/HOYskIPaMAEwBLK.jpeg` + `Ref/HOYsosgaYAAt2xu.jpeg`, translated, never cloned). One `100svh` screen on desktop, four stacked rows, **the same chassis in both themes** — the Theme B "small-plate" layout (`HeroPlate.tsx`'s registration-mark/knockout-card treatment wrapped around the art itself) retires; `Hero.tsx`'s per-theme chassis switch collapses to one shared row structure with theme-bound colour only.

1. **Row 1 — nav.** Clean, opaque surface nav bar, not overlaid on the art (see "Nav" above).
2. **Row 2 — art band, ~55–60svh, full-bleed edge to edge.** The supplied 「北天」 glyph-mosaic artwork ([01-brand.md](01-brand.md) → Motif system), rendered as a **static** optimized `next/image` with `priority` — this is the page's **LCP element**; a static image here is a straightforward LCP win over the retired canvas. The art carries its own source-photo colours in both themes; the theme governs the chrome around it, not the art's palette (a Theme B piece may bias toward the ramp in [01-brand.md](01-brand.md) → Hokuten Blue ramp, but is not required to match the UI accent). Interim until a theme's file lands: the existing static ASCII frame (`AsciiStatic`), full-bleed at the same ~55–60svh band, so rows 2/3/4 ship now and the art swap is a `content/artwork.ts` data edit, never a layout change. Alt text describes the depicted hotel/scene, not "artwork" or "hero image."
3. **Row 3 — headline row, on the surface, BELOW the art.** Split layout (runcycle's split): **left** — a small micro-label eyebrow (kept: `heroContent.ts` already carries real, non-invented copy for it — "Hospitality investment sales — nationwide" — dropping it would be discarding real content for no stated reason) stacked directly above the Display manifesto (`--text-display0`, D8's hero-only step above Display-1; one sentence, exactly one *italic* accent word, Fraunces Light). This is the page's one `<h1>`. **right** — one-line sub + dual CTAs (primary "Request a written BOV" → `#bov`, ghost "See the track record" → `#closings`), both routed through the shared `<AnchorLink>` focus-handling island. **The right-edge small-caps value rail (Discretion / Data / Execution / Closed deals) from the old anatomy is DROPPED** — row 3 is now a two-column split, not a three-slot layered composition, and the rail's information is already carried by `#stats` immediately below and by the ticket cards' data grids further down the page; keeping it here doubled the message. (`heroContent.ts`'s `rail` field becomes unused by this rewrite — flag to whoever owns that file; this doc does not edit content.)
4. **Row 4 — the `#brands` chip marquee, closing the viewport (D2).** Real-colour brand chips per [01-brand.md](01-brand.md) → Motif system, looping marquee, the asterisked micro-disclaimer rendered tiny (`text-micro`) directly beneath the row. This is why `#brands` is no longer a separately-scrolled section (see "Section order" above) — it is the anatomy's closing beat for the first screen, the job the runcycle reference's logo bar does.

**Chrome surface (resolving an ambiguity the brief leaves implicit):** rows 1, 3 and 4 render on the site's normal **light surface** (`.surface-paper`), in **both** themes — this is the only reading consistent with the brief's own permission below, since `plate-frame` (registration marks) is documented in [03-visual-system.md](03-visual-system.md) as "light chrome only, never on dark," and the brief explicitly allows Theme B to keep registration marks on these rows. The old full-panel `--black`/`--dark` hero backdrop retires; the only dark or saturated colour on this screen comes from the art band itself (row 2), not from the surrounding chrome. Both themes now differ only in accent colour and (optionally) which artwork variant renders in row 2 — not in overall darkness.

**Mobile:** art band compresses to **~40svh**; rows 3–4 stack (eyebrow + headline, then sub + CTAs, then the brands loop) in natural document flow — no fit-to-viewport constraint (D6 exempts mobile everywhere).

**Theme B chrome exception:** Theme B may keep plate-chrome accents — hairline frames + corner registration marks (Coronal chassis, [03-visual-system.md](03-visual-system.md)) — on the **surface rows only (1, 3, 4)**. **Never on the art band (row 2)** — the art is full-bleed and edge-to-edge in both themes now; registration marks on it would reintroduce the small-plate look this rebuild retires.

Accessibility: the art band is `aria-hidden` with an adjacent visually-hidden description of the depicted scene (the art is decorative relative to the page's actual content — the headline and CTAs); the hero still owns the page's one `<h1>` (the manifesto line in row 3).

### `#stats` (paper) — CoStar badges added 2026-08-08 (D3)

Four stat moments: `$200M+` aggregate volume · `12` closed transactions · `836K+` SF · `3×` CoStar Power Broker (Q3 '25 · Q1 '26 · Q2 '26). Fraunces numerals, mono captions, hairline separators. All values from [06-content-and-proof.md](06-content-and-proof.md) — never retype.

**Real badges, not typographic claims (D3).** The `3×` CoStar Power Broker numeral stays as the anchor stat, but the three actual **quarterly banner images** (`powerbroker-q3-2025.png` / `powerbroker-q1-2026.png` / `powerbroker-q2-2026.png`, masters in `Ref/site/`, exported to `site/public/awards/`) render as evidence beneath it — a clean row, **uniform height, evenly spaced, linked to nothing** (proof images, not navigation). This is also the fix for the numeral-row-clipped-under-sticky-nav defect Razim's screenshot showed: re-verify the `#stats` numerals are never clipped under the nav at any breakpoint once the badge row is added beneath them.
**Two 2025 Annual badges placed ELSEWHERE, not here** — `US_2025Annual_TopBroker.png` and `US_2025Annual_TopFirm.png` do not join this row (three quarterly banners + two annual banners in one strip is congested). Recommended placement: a slim recognition strip in `#closings`' header area, or beside the `#team` section header — either is acceptable; whichever section owns the placement records it here in a follow-up edit. Register rows for both new claims live in [06-content-and-proof.md](06-content-and-proof.md) (owned by another agent this round).

### `#brands` — rewritten 2026-08-08 (D2, Razim live review)

**Now lives inside `#hero`'s first viewport** as row 4 (see `#hero` above), not as an independently-scrolled section — this entry documents the band's own spec; its position on the page is `#hero` row 4.

**Superseded (2026-08-07, kept for the record):** grayscale text/flat-mark treatment, ~28px desktop / 22px mobile optical height, `--meta`-toned, standalone `<section>` between `#stats` and `#closings`, "quiet familiarity, not a partner wall."

**Current spec:** continuous horizontal chip marquee — real supplied brand chips (16 in `Ref/hotel-brands/`; provenance in `docs/design/LOGO-MANIFEST.md`), **in full colour**, covering the chain scales we transact — economy through **luxury** (the delivered set includes Ritz-Carlton, widening the coverage claim past the original "economy through upper-upscale" wording; [06-content-and-proof.md](06-content-and-proof.md)'s register row must read "economy through luxury" to match what actually ships). CSS `translateX` loop like the ticker (≈40s, `--animate-marquee-brands`, duplicated content, pause on hover/focus, static row under reduced-motion). Uniform optical chip height **44–52px desktop / 36px mobile** (up from 28px — these are dimensional glass-chip renders, not flat marks, and only read correctly at the larger size; sharp prep spec: [01-brand.md](01-brand.md) → Motif system). Generous letterbox spacing between chips. Micro-label above, unchanged: `[ FLAGS WE TRANSACT ACROSS ]`. Trademark disclaimer microcopy beneath — byte-exact text from [06-content-and-proof.md](06-content-and-proof.md), but rendering changes: `text-micro`, reduced emphasis, **one line with a leading asterisk**, not a paragraph block. Chips never desaturate or change on hover — colour is the point now; the band still reads as dimensional flags, not a partner wall. Framing unchanged: "flags we transact across," never "partners" or "clients." The counsel flag for public launch is unchanged and tracked in `docs/PLACEHOLDERS.md` — the site is internal-only, so Razim accepts the interim posture of shipping real marks now.

### `#closings` (paper) — card system rewritten 2026-08-08 (D4, deal-ticket)

Micro-label `[ 01 — TRACK RECORD ]`; Display-2 header. Content from `site/content/closings.ts`, unchanged.

**Superseded card spec (2026-08-07, kept for the record):** flat `CardShell` tile — photo (B&W→colour), serif hotel name, meta line, mono metrics line, CLOSED badge, hairline border.

**Current — the deal-ticket system** (boarding-pass anatomy, translated, never cloned — reference is a chat-provided screenshot, inspiration only). Shared anatomy for **both** `#closings` and `#listings`, built on the existing `CardShell` chassis (its fixed-slot, no-reflow contract is unchanged — photo/title/meta/data/badge slots stay reserved) with the ticket treatment layered on top via the `ticket` / `ticket-perf` / `ticket-notch` / `overprint` utilities already in `globals.css`:
- **Colour header band** — the real listing/closing photo, full-bleed at the top of the card; where no photo exists, a solid surface band carrying a small hanko punch (not the full seal) instead of a photo.
- **Perforated tear line** between the header band and the data stub — CSS dashed border (`ticket-perf`) plus two punched notches (`ticket-notch`, radial-gradient masks that knock an actual hole through to the section surface behind the card — never a painted circle, which would break the moment the card sat on a different surface).
- **Structured label/value grid** below the tear line — tiny caps labels (`micro-label` voice) over **bold mono values** (`text-data`, mono 500 — price, keys, cap rate, LP/SP, days). This renders inside `CardShell`'s existing `data` slot; the grid is a layout inside that slot, not a new slot.
- **Resting shadow, ink-tinted** — `shadow-ticket` (light surfaces) / `shadow-ticket-dark` (dark surfaces), via the `ticket` utility. This is D4's one exception to "1px borders over shadows" (ref 03), and it is a *resting* dimension only.
- **Hover lifts NOTHING** — no translate, no shadow change (ref 05 is unchanged: cards never translate). Hover stays the existing pattern: photo grayscale→colour reveal + the hairline ring shifting to accent at 40%.
- Card radius `rounded-card`, fixed-height slots (`CardShell`'s no-reflow contract still governs), keyboard focus ring on the **whole ticket** (`CardShell`'s `has-[a:focus-visible]` pattern already does this — carries forward unchanged), legible when printed (ref 07's print gate is unchanged: no shadow/notch trick may swallow content in print CSS).

**`#closings` (SOLD) ticket, specifically:**
- Header band renders **muted/grayscale at rest** — the ticket is visually "retired," so it does not get `#listings`' hover-driven colour reveal (there is nothing left to transact).
- A **CLOSED/SOLD overprint** — the `overprint` utility (rotated hairline stamp mark, hanko-adjacent) — sits across the header band. **Never a red rubber-stamp cliché.**
- The data grid carries the proof line: **LP/SP · days · price** — the existing `closing.metrics` + `closing.price` fields, unchanged content contract (`content/closings.ts` is not touched by this rewrite).
- 5-second read for a Crexi user (ref 07): LP/SP, days, price and the CLOSED state must all be visible without interaction.

### `#listings` (surface-deep band) — card system rewritten 2026-08-08 (D4, deal-ticket)

Header + "Powered by our confidential channel" subline, unchanged. Content from `site/content/listings.ts` (static seed in Phase 1; Phase 2 swaps to a live feed with an identical card contract) — unchanged.

**Current — full-colour ticket** (same shared anatomy as `#closings` above). Header band is the real listing photo in full colour (never muted at rest — these are live, transactable), **EXCLUSIVE badge as the ticket's "class" chip** where the listing carries it, **cap-rate chip only when positive** (rule unchanged), and the stub action reads **"View on Crexi →"**, rendered inside the ticket's stub/tear area rather than as a generic card-level link label — the whole ticket remains the one link target (`CardShell`'s single-hit-area contract; trust-checked external Crexi URL, unchanged). Designed placeholder art (never stock, never a generic grey box) where a listing photo is missing — a `Ref/artwork`-sourced crop per [01-brand.md](01-brand.md)'s glyph-mosaic system; intake manifest and the "Listing placeholder" row: `docs/DESIGN-REVISIT.md` §3. Empty state unchanged: "No public listings right now — request off-market access" → a100 Arms.

### `#calculator` (paper)

Port of the kwc 3-step wizard, restyled to tokens: step dots → numbered mono stepper (01 · 02 · 03); educational ⓘ popovers kept; live RevPAR preview kept; results bands kept (value range, "How we got there" chips, benchmark bars, insights, next steps). Result CTAs: written BOV primary, email-me-this secondary, Calendly tertiary. Logic is untouched port of `CONFIG`/`TYPICAL`/`ADVICE` (see Phase 1 plan §6) — design may not alter math or defaults.
Landscape redesign (property-type/market-tier tiles, live context rail, D6/D8 pass): full spec in `docs/DESIGN-REVISIT.md` §4.6 and §3.8 (option-tile shape contract) — out of this file's scope this round; not touched here.

### `#method` (dark chapter, `--dark`)

White engraved line-art of a hotel (star-grain background); a small gold hanko stamp accents the chapter's micro-label (one of the three fixed stamp placements — see Footer). Vertical stepper with underline active state: 01 BOV → 02 Listing & Marketing → 03 Buyer Vetting → 04 LOI & Negotiation → 05 Close (60–90 days post-LOI). Reach stats row in mono (400K CoStar reach · 60K owners · 1,500 relationships · 30K SMS). 180-day / two-90-day-cycle framing paragraph.
Art swap (engraving → supplied glyph-mosaic, dark-ground variant) per D5: full spec `docs/DESIGN-REVISIT.md` §4.7 — not touched here.

### `#doors` (paper, split panel)

Left "The Owner": sell-side promise (written BOV in 48h on T-12/STR/PIP receipt) → `#bov`. Right "The Investor": buy-side promise (vetted deal flow, off-market access) → `#listings` + a100 signup. Equal visual weight; hairline divider.

### `#mandates` (dark, `--dark`) — Capital & Standing Mandates

Condensed marketplace (decision 2026-08-07): micro-label `[ CAPITAL & MANDATES ]`, Display-2 header, then 3–4 mandate cards from verified kwc marketplace content — e.g. Japanese fund building a US portfolio ($2M–$300M per asset) · $1B+ family-office JV capital (luxury/mixed-use, $50M project min) · select-service portfolio mandates · management-company acquisitions (8x–10x EBITDA). Cards: hairline border on dark, serif headline, mono criteria row, no logos, no names beyond what kwc publishes. Close with the ghost `PRIVATE ACCESS →` CTA to a100 Arms signup + one line of discretion copy ("Access and disclosure happen in stages."). Full marketplace page remains Phase 3.

### `#team` (paper)

TeamCards: portrait (B&W→color), name, role, two-line bio, mono contact row (email copy-to-clipboard with "Copied" flash · phone). Dino (Senior Associate — bio verbatim from kwc), Razim, William; Jae & Donna listed as operations. Use the provisional generic bio set in [06-content-and-proof.md](06-content-and-proof.md) (decision 2026-08-07); real bios replace them via the evidence gate.

### `#faq` (paper)

Accordion, ≥5 real diligence questions: confidentiality/NDA process, 1031 timelines, off-market access, BOV requirements (T-12/STR/PIP), fees/engagement, license/brokerage structure.

### `#bov` (surface-deep)

Port of kwc BOV form: name, hotel name, searchable City/State picker (us-cities dataset), intl phone (E.164), email, honeypot, SMS-consent checkbox with TCPA text + ISO consent timestamp → Web3Forms (new Hokuten access key). Success state inline; never navigate away.
Landscape redesign (pitch/context left w/ `<KanjiAccent>`, fields in a 2-col grid right) per D6: full spec `docs/DESIGN-REVISIT.md` §4.9 — not touched here.

## Modals

Consent/inquiry modal (Razim's filename spec): bottom-center rounded bar; serif title, sans body; actions Customise / Reject All / Accept All. Outside click does NOT dismiss — dialog plays a 300ms shake and `navigator.vibrate(50)` where supported; only explicit buttons close it. Focus-trapped, Esc allowed after first interaction, `role="dialog"` + labelled.
Calendly popup: lazy-loaded on first CTA click only; graceful fallback to `#bov` when blocked.

## Footer (dark)

Columns: Quick Links · For Owners · For Buyers; a100 Arms invite link; privacy + SMS terms + accessibility statement; stacked gold lockup small; compliance disclosure verbatim (canonical block via [01-brand.md](01-brand.md) → ref 06); tracked-caps brand line.
Hanko stamp placements (exactly three on-page, plus favicon + OG corner): ① footer, ~48px beside the wordmark with the one-time press-in reveal; ② `#method` chapter micro-label accent; ③ OG image corner. No other stamps — scarcity keeps it a seal, not a pattern.

**Compact, 2026-08-08 (D6).** Collapse to a tight band: one row of link columns at small type, lockup + hanko small on the left, the byte-exact disclosure + legal links + brand line in a dense stack. Target **≤ ~40% of the current footer height**. With the theme lockup now also in the header ([01-brand.md](01-brand.md) → D1), the footer needs only **ONE** KW-compliance-mark instance — if it currently renders twice, that is a defect to fix here, not a second intentional placement. Ticker clearance stays.

## Mobile rules

Centered single-column stacks (Aurelian mobile ref); nav collapses to circular hamburger → numbered overlay; ticker remains but thinner (32px) and pausable; tap targets ≥44px; no hover-dependent information anywhere (B&W→color uses tap toggle).
Hero art on mobile: compresses to **~40svh** and always renders as a static image (see `#hero` above — the art is a static `next/image` on every viewport now, not just on mobile/reduced-motion as the pre-2026-08-08 ASCII-canvas anatomy required).
