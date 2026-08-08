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

## Dual-theme program (decision 2026-08-07)

Phase 1 ships TWO complete theme variants — same content, same anatomy, massively different color key — as two Vercel preview links for team comparison:
- **Theme G — "Kit Gold"**: the palette below as-is. Dark heritage hero (cover-panel black, gold/ivory ASCII). Production default on `main`.
- **Theme B — "Hokuten Blue"**: the blue ramp below; 北天 "northern sky" rendered literally. Light volumetric hero on the Coronal plate chassis (see [02-reference-digest.md](02-reference-digest.md) → Coronal video). Lives on branch `theme-blue` via `NEXT_PUBLIC_HOKUTEN_THEME=blue` (branch-scoped Vercel env), zero code diff from main.
Mechanics: components consume **semantic tokens only** (`--accent`, `--accent-dim`, `--accent-wash`, `--accent-chip`, canvas/dark tokens). Themes bind them. Every gold rule in this file reads as an `--accent` rule; "gold is scarce" = "accent is scarce" in both themes.
Theme B branding: rebuild the THE HOKUTEN GROUP tracked-caps line, hanko seal, and OG/cover recipe in Hokuten Blue (SVG/text rebuild — never recolor the KW kit rasters). The KW Commercial footer compliance mark keeps its own original colors in BOTH themes, isolated on its own surface.

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

**Hokuten Blue ramp (Theme B)** — anchors sampled from the Coronal reference video (`Ref/Praveen_Kumar_-_New_Health_Tech_Branding_Exploration_tZBENZ.mp4`); executor verifies by sampling extracted frames and may fine-tune ±5% lightness, logging final values here:

| Role | Token binding | Hex | Use |
|---|---|---|---|
| Hokuten Blue | `--accent` (Theme B) | `#2F4FA3` | CTAs, accent words, badges, rules — everywhere Theme G uses gold |
| Blue deep | `--accent-deep` | `#1F3C8C` | Dense art strokes, hover states, dark-section accent |
| Blue mid | `--accent-dim` | `#7E96D0` | Art mid-tones, secondary accents |
| Blue wash | `--accent-wash` | `#C9D4EE` | Art light wash, tinted fills |
| Blue chip | `--accent-chip` | `#DCE3F7` | Pill/chip backgrounds (Coronal "SYNAPTIC MATCH" pattern) with `--accent` text |
| Cool paper | `--paper` (Theme B) | `#F7F8F5` | Canvas cools slightly; Theme G keeps `#F7F4ED` |
| Indigo dark | `--dark` (Theme B) | `#12172B` | Dark sections shift indigo; hero panel may stay `#000` or use this |

Theme G binds: `--accent = #B8902E`, `--accent-dim = #C9A04A`, `--accent-wash = #E2DCCC`, `--accent-chip = #EFE9DA`.

## Accessible tones (added 2026-08-08 — measured, not chosen)

The brand hexes above are correct as brand values but several fail WCAG AA as *text*. PHASE-1-EXECUTION §8.1 authorises exactly this remedy: "adjust tone, not the brand hex, where it fails at small sizes." These are the adjusted tones; contrast was computed, not estimated (`docs/design/CONTRAST.md` holds the script and the full matrix).

| Token | Hex | Why it exists | Measured |
|---|---|---|---|
| `--accent-ink` (Theme G) | `#816520` | Gold **as text on light**. `#B8902E` on `--paper` is **2.71:1** — it fails AA for every text size and even the 3:1 UI threshold, so gold text on paper was never shippable. Same hue (42.6°) and saturation (0.600) as `#B8902E`, darkened only. | 5.01:1 on `--paper` · 4.54:1 on `--surface-deep` · 5.50:1 on `--card` |
| `--accent-on-dark` (Theme G) | `#B8902E` | Gold **as text on dark** needs no adjustment — this is the brand hex unchanged. | 5.99:1 on `--dark` · 7.07:1 on `--black` |
| `--accent-ink` (Theme B) | `#2F4FA3` | Hokuten Blue passes on light unadjusted. | 7.12:1 on cool `--paper` · 7.59:1 on `--card` |
| `--accent-on-dark` (Theme B) | `#7E96D0` | `#2F4FA3` on indigo `#12172B` is **2.34:1**. The blue-mid step carries on-dark text instead. | 6.05:1 on `--dark` |
| `--on-accent` | `#16181B` (G) / `#F7F8F5` (B) | Text on an `--accent` fill (the primary pill). Black on blue is 2.77:1, so the two themes need opposite polarities. | 5.99:1 (G) · 7.12:1 (B) |
| `--meta` | `#6E6862` | Tertiary/caption **text**. The brand ivory-gray `#8B8680` is **3.29:1** on `--paper` and fails. | 5.01:1 on `--paper` · 4.54:1 on `--surface-deep` |
| `--meta-soft` | `#8B8680` | The original brand ivory-gray, retained — **decorative only, never text**. | n/a |

On-dark secondary/tertiary text is `color-mix(in srgb, var(--paper) 64%, var(--dark))` and `52%` respectively (7.2:1 and 5.2:1 in both themes). Ref 03's "paper at 40%" measures **3.59:1** and must not be used for text.

Implementation: `site/app/globals.css` binds all of these per theme, and the `.surface-*` scope classes select the right one automatically — components write `text-accent-text` / `text-fg-meta` and are correct on every surface in both themes.

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
