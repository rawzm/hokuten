# 01 — Brand

## Table Of Contents
Identity · Palette · Typography · Lockups & usage · Motif system · Compliance · Asset locations

## Identity

The brand is THE HOKUTEN GROUP. Hokuten (北天) means "northern sky."
The name honors the team (not one person) and nods to Final Fantasy's Order of the Northern Sky — the nod stays sub-visual, never literal.
Business line: hospitality investment sales, nationwide coverage.
Brand hierarchy on official assets reads: KW COMMERCIAL / THE HOKUTEN GROUP / HOSPITALITY INVESTMENT SALES / NATIONWIDE COVERAGE.
On the website the hierarchy inverts: Hokuten first; KW Commercial is a footer compliance mark only (decision 2026-08-07).
The spelling is HOKUTEN everywhere. "Hakuten" is a typo that survives only in the local folder name.

## Palette (the only place hex values live)

| Role | Token | Hex | Use |
|---|---|---|---|
| Website gold | `--gold` | `#B8902E` | CTAs, accent words, badges, rules on dark. README mandate: "Website gold stays #B8902E" |
| Kit gold | (none) | `#B8943D` | Exists only inside raster lockup/cover files. Never a CSS value. Never adjacent to `--gold` |
| Gold dim | `--gold-dim` | `#C9A04A` | Hover/secondary gold moments on dark (carried from kwc tokens) |
| Ink | `--ink` | `#1A1C1F` | Primary text on light; matches brand charcoal |
| Ink muted | `--ink-muted` | `#4A4D52` | Secondary text on light |
| Meta | `--meta` | `#8B8680` | Tertiary/meta text, captions |
| Paper | `--paper` | `#F7F4ED` | Page canvas (never pure white ground) |
| Surface deep | `--surface-deep` | `#EFE9DA` | Alternate section bands, raised cards |
| Ivory rule | `--rule` | `#E2DCCC` | Hairlines, borders; equals brand ivory background |
| Card white | `--card` | `#FFFFFF` | Cards/inputs sitting on paper |
| Dark | `--dark` | `#16181B` | Dark section surface |
| Panel black | `--black` | `#000000` | Hero/cover panel only (matches cover assets) |
| Brick | `--brick` | `#A33B2C` | Form errors only. Not a brand color |

Light mode is the site; dark is a section treatment (hero, process chapter, footer), not a theme toggle.
Gold is scarce: CTAs, one accent word per headline, badges, thin rules. If gold exceeds ~5% of a viewport, it's wrong.

## Typography

| Voice | Font | Fallback | Use |
|---|---|---|---|
| Display | Fraunces (72pt optical, Light–Regular) | Georgia, serif | H1/H2, menu index, stat numerals. Sentence case with *one italic accent word* |
| UI/Body | Inter | Arial, Helvetica, sans-serif | Body, nav, buttons, forms |
| Data | IBM Plex Mono | ui-monospace | Prices, keys, cap rates, dates, micro-labels, ticker |

All self-hosted via `next/font`. No Google Fonts CDN at runtime.
Tracked-caps brand line (`THE HOKUTEN GROUP` set in text): Inter or Arial-stack, uppercase, `letter-spacing: 0.35em`, gold — mirrors the Liberation Sans lockup treatment.
Micro-label device: mono, uppercase, bracketed index — `[ 01 — TRACK RECORD ]`.
Upgrade path: if Canela is ever licensed, it replaces Fraunces at the display voice only; tokens don't change.

## Lockups & usage

Assets live in `The_Hokuten_Group_Brand_Addon_2/` (masters; copy exports into `site/public/brand/`).
Header: no KW lockup — Hokuten wordmark/hanko only.
Footer: `Stacked_..._Gold_Transparent.png` over `--dark`, small, beside the compliance line.
Known-defective asset: `Linear_..._Gold_on_Charcoal.png` — the charcoal COMMERCIAL wordmark vanishes on charcoal. Never use the linear lockup on dark.
OG image (1200×630): rebuild per the cover recipe — black panel, centered stack, thin gold rule, THE HOKUTEN GROUP as the only large lettering; adapt from `Facebook_Cover_1640x624_HOKUTEN` proportions.

## Motif system

North-star / compass-point glyph: the site mark accent; usable as bullet, section stamp, loading indicator.
北天 hanko seal (gold square seal-stamp): SHIPS in Phase 1 at full strength (decision 2026-08-07: "push it like it's final") — favicon, OG corner stamp, footer seal, section stamps where the anatomy calls for them. Team may rework after internal review; do not build it half-way.
Star-grain texture: faint grain + hairline orbital arcs on dark sections only (Aurelian ref). Never on light chrome.
Franchise-flag marks (Marriott, Hilton, IHG, Wyndham, Choice, Hyatt, Best Western, Radisson, Sonesta…) are third-party trademarks: grayscale only, uniform optical size, inside the `#brands` marquee only, with the trademark disclaimer microcopy from [06-content-and-proof.md](06-content-and-proof.md). Never colorized, never implying endorsement, never adjacent to the Hokuten lockup.
ASCII/dither art: the signature image treatment — charset built from HOKUTEN + 北天/ホクテン + digits + `・.:-=+*#`; one seam row resolves into THE HOKUTEN GROUP. Full spec in [05-motion.md](05-motion.md) and the Phase 1 plan.
Photography: real hotels from the track record, B&W at rest → color on hover/tap (kwc's touch-reveal pattern). No stock.

## Compliance

Footer disclosure, verbatim on every page (until re-papered): use the canonical byte-exact block in [06-content-and-proof.md](06-content-and-proof.md) → Compliance text — never retype it here or anywhere else.
If listings ship under KW license, the KW Commercial mark must be present in the footer.
TCPA/10DLC: SMS-consent language and privacy/sms-terms pages port from kwc with the brand string updated once a Hokuten 10DLC brand is registered — until then keep the registered string exactly as registered.
Gate: the name deploys publicly only after KW / Forward Wilshire papers The Hokuten Group (brand README; track in PROJECT-MEMORY.md open items).
