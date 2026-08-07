# 04 — Page Anatomy (Phase 1 landing chassis)

## Table Of Contents
Nav · Section order · Per-section spec · Modals · Footer · Mobile rules

Single page, anchor navigation, structured so each section can graduate to its own route in Phase 3 (each section = one component + one content module).

## Nav

Sticky top bar, paper with blur on scroll (dark variant over hero): Hokuten wordmark left, anchor links center (Listings · Track Record · Valuation · Method · Team), gold pill CTA right: "Request a written BOV" → `#bov`.
Menu (mobile + desktop overflow): full-screen numbered overlay, StoneInvestment pattern — serif index mapped to real anchors: `01 The Group → #hero · 02 Listings → #listings · 03 Track Record → #closings · 04 Valuation → #calculator · 05 Method → #method · 06 Team → #team · 07 Contact → #bov`; warm hotel photo panel left, footer utilities (phone, email, PRIVATE ACCESS ghost → a100 Arms), close X. Body scroll locked while open.

## Section order

1. `#hero` — ASCII hero (dark)
2. `#stats` — trust metrics band
3. `#closings` — Recently Closed (track record)
4. `#listings` — Hotels for Sale
5. `#calculator` — Hotel Worth Calculator
6. `#method` — How We Run a Sale (dark chapter)
7. `#doors` — The Owner / The Investor
8. `#team` — The Principals
9. `#faq` — Diligence FAQ
10. `#bov` — BOV request form
11. Footer + persistent `#ticker` (fixed bottom)

## Per-section spec

### `#hero` (dark, `--black` panel)
Slots: micro-label eyebrow (`[ HOSPITALITY INVESTMENT SALES — NATIONWIDE ]`), Display-1 manifesto (one sentence, one italic word), one-line sub, dual CTAs (primary "Request a written BOV", ghost "See the track record"), right-edge small-caps value rail (DISCRETION / DATA / EXECUTION / CLOSED DEALS), scroll cue.
Art: ASCII hotel canvas behind/beside copy — the one signature effect on this screen; static art on mobile/reduced-motion.
The seam row resolving into THE HOKUTEN GROUP sits in the art's lower third; must never collide with the headline at any viewport.

### `#stats` (paper)
Four stat moments: `$200M+` aggregate volume · `12` closed transactions · `836K+` SF · `3×` CoStar Power Broker (Q3 '25 · Q1 '26 · Q2 '26). Fraunces numerals, mono captions, hairline separators. All values from [06-content-and-proof.md](06-content-and-proof.md) — never retype.

### `#closings` (paper)
Micro-label `[ 01 — TRACK RECORD ]`; Display-2 header. 6 ClosingCards: photo (B&W→color), serif hotel name, meta line (location · keys · segment), mono metrics line (LP/SP % · days · price; "Confidential" where applicable), CLOSED badge. Content from `site/content/closings.ts`.

### `#listings` (surface-deep band)
Header + "Powered by our confidential channel" subline. ListingCards: photo, name, meta (City, ST · service level · N keys), mono price ("Price on request" when $0/blank), cap rate chip only when positive, badge, card links to Crexi (trust-checked). Empty state: "No public listings right now — request off-market access" → a100 Arms. Phase 1 content: `site/content/listings.ts` (static seed); Phase 2 swaps to live feed with identical card contract.

### `#calculator` (paper)
Port of the kwc 3-step wizard, restyled to tokens: step dots → numbered mono stepper (01 · 02 · 03); educational ⓘ popovers kept; live RevPAR preview kept; results bands kept (value range, "How we got there" chips, benchmark bars, insights, next steps). Result CTAs: written BOV primary, email-me-this secondary, Calendly tertiary. Logic is untouched port of `CONFIG`/`TYPICAL`/`ADVICE` (see Phase 1 plan §6) — design may not alter math or defaults.

### `#method` (dark chapter, `--dark`)
White engraved line-art of a hotel (star-grain background), vertical stepper with underline active state: 01 BOV → 02 Listing & Marketing → 03 Buyer Vetting → 04 LOI & Negotiation → 05 Close (60–90 days post-LOI). Reach stats row in mono (400K CoStar reach · 60K owners · 1,500 relationships · 30K SMS). 180-day / two-90-day-cycle framing paragraph.

### `#doors` (paper, split panel)
Left "The Owner": sell-side promise (written BOV in 48h on T-12/STR/PIP receipt) → `#bov`. Right "The Investor": buy-side promise (vetted deal flow, off-market access) → `#listings` + a100 signup. Equal visual weight; hairline divider.

### `#team` (paper)
TeamCards: portrait (B&W→color), name, role, two-line bio, mono contact row (email copy-to-clipboard with "Copied" flash · phone). Dino (Senior Associate — bio verbatim from kwc), Razim, William; Jae & Donna listed as operations. Use the provisional generic bio set in [06-content-and-proof.md](06-content-and-proof.md) (decision 2026-08-07); real bios replace them via the evidence gate.

### `#faq` (paper)
Accordion, ≥5 real diligence questions: confidentiality/NDA process, 1031 timelines, off-market access, BOV requirements (T-12/STR/PIP), fees/engagement, license/brokerage structure.

### `#bov` (surface-deep)
Port of kwc BOV form: name, hotel name, searchable City/State picker (us-cities dataset), intl phone (E.164), email, honeypot, SMS-consent checkbox with TCPA text + ISO consent timestamp → Web3Forms (new Hokuten access key). Success state inline; never navigate away.

## Modals

Consent/inquiry modal (Razim's filename spec): bottom-center rounded bar; serif title, sans body; actions Customise / Reject All / Accept All. Outside click does NOT dismiss — dialog plays a 300ms shake and `navigator.vibrate(50)` where supported; only explicit buttons close it. Focus-trapped, Esc allowed after first interaction, `role="dialog"` + labelled.
Calendly popup: lazy-loaded on first CTA click only; graceful fallback to `#bov` when blocked.

## Footer (dark)

Columns: Quick Links · For Owners · For Buyers; a100 Arms invite link; privacy + SMS terms; stacked gold lockup small; compliance disclosure verbatim ([01-brand.md](01-brand.md)); tracked-caps brand line.

## Mobile rules

Centered single-column stacks (Aurelian mobile ref); nav collapses to circular hamburger → numbered overlay; ticker remains but thinner (32px) and pausable; hero art becomes static pre-rendered frame; tap targets ≥44px; no hover-dependent information anywhere (B&W→color uses tap toggle).
