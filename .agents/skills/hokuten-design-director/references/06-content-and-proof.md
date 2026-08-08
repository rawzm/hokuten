# 06 — Content & Proof

## Table Of Contents
Voice · Evidence gate · Verified claims register · Seed content sources · Compliance text · Copy patterns

## Voice

Numbers-first, discreet, unhurried. Specificity beats flash.
Say the metric, then stop: "$61.49M · 74 days · 96% LP/SP" needs no adjective.
Sentence-case headlines, one evocative word maximum (the italic device carries it).
Never: "experience you can count on", "unlock", "elevate", "seamless", "world-class", exclamation marks.
Team voice is "we"; individual practitioners appear with name + license, not superlatives.
Run finished copy against no-ai-slop patterns before ship ([07-audit.md](07-audit.md)).

## Evidence gate (every public claim)

A claim ships only when this table has a row for it: claim → source → status.
Status vocabulary: `verified-current | verified-dated | pending-verification | prohibited`.
`verified-dated` ships only with its date qualifier rendered in the copy (e.g. "as of Q2 2026"); undated rendering requires `verified-current`.
`pending-verification` claims render as `blocked` placeholders in specs, never as live copy.
Logos/testimonials additionally need written permission noted in PROJECT-MEMORY.md.

## Verified claims register (as of 2026-08-07; source: kwc-dinomonteverde.com + repo)

| Claim | Value | Status |
|---|---|---|
| Aggregate volume | $200M+ | `verified-current` (Dino book of record) |
| Closed transactions | 12 (11 hotel assets + 1 management-co M&A) | `verified-current` |
| Total square feet | 836K+ | `verified-current` |
| CoStar Power Broker Quarterly Deals | Q3 2025 · Q1 2026 · Q2 2026 | `verified-current` |
| Closings (6) — deal figures | Price, LP/SP ratio, days-on-market, $/key and structure notes for Carte $61.49M · Renaissance Reno $50.1M · The Last Hotel $13.2M · HIE Brooklyn $20.0M · Radisson McAllen $14.0M · Rohnert Park $14.0M | `verified-current` — verbatim published copy from the kwc source `#closings` cards (`index.html:872–907`), re-verified byte-for-byte 2026-08-08; same standard as the Dino creds-line row. Decimal precision and the "Confidential"/"Lease → Buy" slot substitutions are the source's own — do not normalize |
| Reach stats | ~400K CoStar investors · ~60K owners voice outreach · 1,500 owner relationships · 30K SMS contacts | `verified-current` (kwc methodology) |
| BOV promise | Written BOV in 48h conditioned on T-12 / STR / PIP receipt | `verified-current` |
| Listing-term structure | 180 days as two 90-day cycles; market reads at Days 30 and 60; Day 90 seller decision (accept / reprice + second cycle / conclude) | `verified-current` (kwc `index.html:1095`, verified against source 2026-08-08) — contractual timeframe: re-confirm against the Hokuten listing agreement at the KW / Forward Wilshire paperwork gate before public launch |
| Average close | 60–90 days post-LOI | `verified-current` (kwc `index.html:1103`, verified against source 2026-08-08; Dino book of record) |
| Listing distribution | Public launch across CoStar, LoopNet, and Crexi + direct database distribution and owner outreach | `verified-current` (kwc `index.html:1100`, verified against source 2026-08-08) — corroborated by the live Crexi listing links and the CoStar Power Broker rows above; re-confirm the subscriptions transfer to Hokuten at the paperwork gate |
| Sarhan-era "~$1B total hotel sales" | — | `pending-verification` — group-level, needs Dino's sign-off + framing away from Sarhan brand |
| Sarhan testimonials (Caliber, Whispering Pines, Juniper) | — | `pending-verification` — permission + attribution unresolved |
| Dino bio (creds line) | verbatim from kwc source `team-creds` | `verified-current` |
| Razim / William / Jae / Donna bios | provisional generic bios below | `verified-current` as written (no unverified claims); replace when real bios land |
| Any KW corporate award (Forbes etc.) | — | `prohibited` — not the team's awards (Sarhan-site anti-pattern) |
| `#brands` marquee ("Flags we transact across") | Marriott, IHG, Radisson, Choice, Wyndham evidenced in closed deals/listings; Hilton, Hyatt, Best Western, Sonesta et al. included as market-coverage statement (decision 2026-08-07) | `verified-current` as a coverage claim — label must say "flags we transact across", never "partners" or "clients" |
| Mandate: Japanese fund, US portfolio build, $2M–$300M per asset | kwc `marketplace.html` "Capital Deploying" | `verified-current` |
| Mandate: $1B+ family-office JV capital, luxury/mixed-use, $50M project min | kwc `marketplace.html` "Capital Deploying" | `verified-current` |
| Mandate: select-service portfolio criteria ($200M+, RevPAR ~$100) | kwc `marketplace.html` standing requirements | `verified-current` |
| Mandate: management-company acquisitions, 8x–10x EBITDA | kwc `marketplace.html` standing requirements | `verified-current` |

Trademark microcopy for `#brands` (render in `type.micro` under the marquee): "All trademarks are the property of their respective owners and are shown to indicate franchise systems within which we broker transactions. No affiliation or endorsement is implied."

## Seed content sources (Phase 1 — static, from the kwc repo)

Repo: `~/Documents/Dino/dino-sites/kwc-dinomonteverde/`.
Closings (6): Carte Hotel San Diego $61.49M · Renaissance Reno $50.1M · The Last Hotel St. Louis $13.2M · Holiday Inn Express Brooklyn $20.0M · Radisson McAllen $14.0M · Rohnert Park portfolio $14.0M — full rows + photos itemized in Phase 1 plan §5; typed in `site/content/closings.ts`.
Listings (5 currently mapped): The Lodge at Split Rock Resort (Lake Harmony, PA) · Pocono Mountain Hotel and Spa · Developer Inn Highway, a Howard Johnson by Wyndham (Kissimmee, FL) · Developer Inn Downtown Orlando, a Baymont by Wyndham · Baymont by Wyndham Jacksonville Airport — display names + Crexi URLs must be taken from the `CREXI_LINKS` map / live Crexi listings, never retyped from shorthand; typed in `site/content/listings.ts`.
Calculator copy: port verbatim (step titles, ⓘ popovers, disclaimer, insights HTML) — it is field-tested; rebrand only names.
Methodology, FAQ raw material, marketplace bulletins: from kwc + Sarhan inventories (marketplace is Phase 3).
Photos, hero video, `us-cities.min.json`: copy from the kwc repo into `site/public/` and `site/content/`.

## Team bios (provisional generic set — decision 2026-08-07; format mirrors kwc `team-creds`)

Dino — name "Dino Monteverde", role "Senior Associate · Hospitality Investment Sales", creds verbatim from source: "$200M+ across 12 hospitality transactions — 11 hotel-asset transactions + 1 hotel-management-company M&A. Three-time CoStar Power Broker Quarterly Deals winner — Q3 2025, Q1 2026, and Q2 2026. USMC veteran. Former hotel owner-operator." Contact: dino.monteverde@kw.com · 650.720.6995.
Razim — name "Mohamed Razim Meeran", role "Buyer Relations & Platform Technology" (`provisional` title — confirm internally), creds: "Buyer-side coverage for incoming hospitality investors. Builds and runs the group's data, marketing, and off-market platform infrastructure." No stats until verified.
William — name "William Betancourt", role "Associate · Hospitality Investment Sales" (`provisional` title — confirm license/title internally), creds: "Buy-side and sell-side transaction coverage across the group's national hospitality mandates." No stats until verified.
Jae & Donna — listed together under "Operations": "Jae Hun Jeong & Donna Grace Yangyang — Outreach, diligence coordination, and client care." No portraits required in Phase 1.
Rule: provisional bios contain zero numbers, awards, or license claims. Real bios replace these verbatim slots and go through the evidence gate.

## Compliance text (verbatim blocks — do not paraphrase)

Brokerage disclosure, every page footer — byte-exact from kwc source (two sentences, line break between them; this file is the canonical copy):
"Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534)."
"Dino Monteverde, CA DRE #01948432."
SMS consent (BOV form): port the kwc TCPA block exactly — up to 6 msgs/month, STOP/HELP, carrier-rates language, `sms_consent_text` + ISO `consent_timestamp` fields; keep the registered 10DLC brand string identical to its registration until a Hokuten brand is registered.
Calculator disclaimer: "Indicative range only — … not a Broker Opinion of Value" line ports verbatim.
Privacy + SMS-terms pages port with brand strings updated only where legally re-registered.

## Copy patterns

Micro-labels: `[ 01 — TRACK RECORD ]` mono uppercase — section index is part of the voice.
Data lines: value · separator dots · unit, mono: `96% LP/SP · 74 days · $61.49M`.
CTAs: verb-first, specific: "Request a written BOV" / "See the track record" / "Email me this estimate" — never "Learn more", "Get started", "Submit".
Confidentiality is a feature: "Confidential" replaces missing numbers proudly, never "N/A".
Price fallback: "$0"/blank → "Price on Request" (the a100 feed's exact string — one vocabulary across both platforms).
