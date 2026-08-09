# 03 — Visual System

## Table Of Contents
Color roles · Type ramp · Spacing & layout · Surfaces & borders · Deal-ticket component · Imagery · Iconography · Components

Hex values live only in [01-brand.md](01-brand.md); implementation of record is `site/app/globals.css` (Tailwind v4 `@theme`). Rules here use token names.
**Dual-theme rule (2026-08-07): components consume semantic tokens (`--accent`, `--accent-dim`, `--accent-wash`, `--accent-chip`, `--paper`, `--dark`) — never `--gold`/blue hexes directly.** Theme G (gold) and Theme B (Hokuten Blue) bind them per 01-brand.md; `NEXT_PUBLIC_HOKUTEN_THEME` selects at build. Every "gold" rule below reads as an "accent" rule. Theme B additions: plate sections may carry hairline frames + corner registration marks (Coronal chassis) — light chrome only, never on dark.

## Color roles

| Role | Light sections | Dark sections |
|---|---|---|
| Canvas | `--paper` | `--dark` (hero panel: `--black`) |
| Primary text | `--ink` | `--paper` |
| Secondary text | `--ink-muted` | `--paper` at 64% |
| Meta/captions | `--meta` | `--paper` at 40% |
| Accent / CTA | `--gold` | `--gold` (hover `--gold-dim`) |
| Hairlines | `--rule` | `--paper` at 14% |
| Cards | `--card` or `--surface-deep` | `--dark` +4% lightness, never gray |
| Errors | `--brick` | `--brick` |

Semantic rules: gold = action/exclusivity only; never decorative fills. Success/pending states in forms use ink-weight and mono copy, not new colors.

## Type ramp (max 4 sizes per section)

**D8 (2026-08-08) — typography contrast pass.** The page read too uniform; hierarchy is now amplified deliberately, not just enlarged. What changed:
- New `type.display0` step, one size above Display 1 — see table. **The hero `<h1>` only, one element per page.** It replaces Display 1 in that single slot; it never stacks alongside Display 1 in the same section (doesn't count against the 4-size ceiling below for that reason).
- Fraunces stays **Light 300 as the default** display weight, but may step to **500** for a deliberate contrast moment. **600+ stays banned, sitewide, no exception.**
- **Inter 600 is sanctioned** wherever a UI/data moment earns it (CTAs, nav-active, form labels, a firm data callout) — this is not a blanket bold-up of body copy.
- Italic accents may appear on more than one headline per page now; the one-per-headline discipline itself is unchanged — each headline still carries exactly one italic word, same size/weight as its line.
- The mono/caps micro-voice (`type.micro`, `micro-label`, `data-line`) gets heavier use for labels and data moments that want to read as enterprise-platform, not brochure.

The goal is **"pop with hierarchy," not louder everything** — reach for weight/color/spacing before size, same as always.

| Role | Token | Size (desktop / mobile) | Voice, weight, case |
|---|---|---|---|
| Display 0 | `type.display0` | clamp 48–132px / responsive (`--text-display0`, leading 0.94, tracking -0.035em) | Fraunces Light, sentence case. **Hero `<h1>` only.** (D8) |
| Display 1 | `type.display1` | clamp 56–96px / 40px | Fraunces Light, tight leading (1.02), sentence case + one *italic* word |
| Display 2 | `type.display2` | 40–56px / 32px | Fraunces Light–Regular |
| Heading | `type.heading` | 24–28px / 22px | Fraunces Regular or Inter Semibold |
| Body large | `type.bodyLg` | 18–20px | Inter Regular, leading 1.6 |
| Body | `type.body` | 16px | Inter Regular — floor for reading text |
| Data | `type.data` | 14–15px | IBM Plex Mono, `font-variant-numeric: tabular-nums` |
| Micro-label | `type.micro` | 11–12px | IBM Plex Mono, uppercase, tracking 0.14em, bracketed index device |

Tracked brand line: uppercase Inter, tracking 0.35em, gold — headers/footers only.
Stat numerals: Display 1/2 in Fraunces with mono caption beneath (never mono for the big numeral).
Hierarchy moves: weight, color (ink→muted→meta), spacing, then size — adding a fifth size to a section is a P1.

## Spacing & layout

Base unit 4px; component rhythm in 8s (8/16/24/32/48).

**D6 (2026-08-08) — compressed rhythm.** The old 96–160px desktop / 64–96px mobile section padding is retired — it produced dead bands between sections and made fit-to-viewport unreachable. Current values are `@utility` classes in `globals.css`; use the utility, never a hand-rolled `padding-block`:

| Utility | Value | Use |
|---|---|---|
| `section-pad` | `clamp(2.5rem, 1.25rem + 4vw, 5.5rem)` — 40px mobile → 88px desktop | Default section rhythm, replaces the old fixed range |
| `section-pad-tight` | `clamp(1.75rem, 1rem + 2.5vw, 3rem)` — 28px → 48px | Content-dense sections (calculator, BOV) or a section sitting adjacent to a same-surface neighbour |
| `section-join` | `padding-block-start: 0` | Put on the *second* of two adjacent same-surface sections so they share one gutter instead of stacking two — the D6 "no dead band" rule, made concrete |
| `section-fit` | `min-height: var(--screen-fit)` at ≥64rem (desktop only — mobile keeps natural flow, always) | Every desktop section targets fit-to-viewport. `min-height`, not `height`: content that genuinely overflows still scrolls the page rather than clipping |
| `scroll-well` | `overflow-y: auto` + bottom mask-fade, `overscroll-behavior: contain` | Where a section's content genuinely exceeds the viewport (calculator step 3), it scrolls *inside* the section — native overflow, keyboard-reachable, mask-fade as the visible affordance. Not scroll-jacking (ref 05 §Smooth scroll): the page's own scroll is untouched, only this one well scrolls itself |

`--screen-fit: calc(100svh - var(--nav-h) - var(--ticker-h))` is the viewport budget `section-fit` targets.

Container: max-width 1200px content, 1440px for full-bleed art; gutters 24px mobile / 48px desktop.
Grid: 12-col desktop, 4-col mobile. Listing/closing cards: 3-up desktop, 1-up mobile (2-up only ≥640px if cards stay ≥320px wide).
Anchor offset: `scroll-margin-top: var(--nav-h)` on all section ids (sticky nav height). **D6: `--nav-h` is now 68px, not 88px** (`--nav-h-mobile` 60px) — the nav compressed to help fund the fit-to-viewport budget; the D1 header lockup renders 40–44px tall inside it.
Density: one idea per screen; if a viewport contains two competing focal points, cut one.

## Surfaces & borders

Hairlines everywhere structure is needed: 1px `--rule` (light) — no drop-shadow-based layout.
Shadows: only on floating elements (menu overlay, modal, sticky ticker), soft and ink-tinted, never gray-blur halos.

**D4 (2026-08-08) — the one documented exception to "1px borders over shadows."** Deal-ticket cards (listings/closings — §Deal-ticket component below) carry a **resting** ink-tinted shadow: `--shadow-ticket` on light surfaces, `--shadow-ticket-dark` on dark, applied via the `ticket` / `ticket-dark` utilities. Nothing else in the card system gets this treatment — every other card stays hairline-bordered, no shadow. Rules that bind on the exception exactly as everywhere else:
- Still **never a gray blur halo** — both tokens are ink-tinted (`rgb(26 28 31 / …)` light, `rgb(0 0 0 / …)` dark), not a generic drop-shadow gray.
- **The shadow does not change on hover.** The dimension sits at rest; hover reveals photo color + an accent ring (ref 05 §Hovers) — never a shadow lift, never a translate.
- `--shadow-chip` is a distinct, smaller token: the seat a brand chip sits on when it needs a surface behind it (D2). Chips already carry their own rendered gloss/shadow inside the raster — this is not a second card-shadow exception, just a mounting surface.

Radius: `r.none` 0 for images/art, `r.card` 2px for cards/inputs, `r.pill` 999px for CTAs/badges only.
Dark sections may carry star-grain + hairline orbital arcs (imagery layer, max opacity 8%); light sections carry no texture.

## Deal-ticket component (D4, 2026-08-08)

Listing/closing cards are dimensional "deal tickets" — a boarding-pass anatomy translated to deal data, never cloned (source digest in `02-reference-digest.md`). Built from the `ticket` family of chassis utilities in `globals.css`.

**Anatomy, top to bottom:**
1. **Header band** — the real listing/closing photo (grayscale at rest → color on hover, the existing card pattern), or a solid surface with a hanko punch where no photo exists. Carries the ticket's color.
2. **Tear line** — `ticket-perf`: a 1px dashed `--hairline` rule marking where the header band ends and the data stub begins.
3. **Notches** — `ticket-notch`: two 14px half-circle punches centered on the tear line, cut with a `radial-gradient` mask (not a painted circle), so the section surface genuinely shows through — this is what lets the same ticket sit on any surface color without a seam.
4. **Label/value grid** — tiny caps `micro-label`s over **bold mono `data-line` values** (price, keys, cap rate, LP/SP, days on market). Labels never outweigh values.
5. **Body** — the `ticket` utility: `radius-card` + the resting shadow (`ticket-dark` adds `--shadow-ticket-dark` on dark surfaces). This is the D4 shadow exception from §Surfaces & borders above — nothing else in the card system carries it.

**Two variants:**
- **Listings (ACTIVE)** — full-color ticket. EXCLUSIVE badge doubles as the "class" chip, cap-rate chip present, the stub carries the Crexi link as its action ("View on Crexi →"). Designed placeholder art (never stock) where a photo is missing.
- **Closings (SOLD)** — a visually "retired" ticket: muted/grayscale header band, plus an `overprint` stamp — a hairline rotated CLOSED/SOLD mark, hanko-adjacent in spirit, **never a red rubber-stamp cliché**. `overprint` reads `--accent-text`, so it's correct on both themes and on dark with no separate override needed. Metrics grid shows the proof line (LP/SP · days · price).

**Interaction:** hover/focus = photo color reveal + accent ring shift, exactly like every other card (ref 05 §Hovers) — **no translate, no shadow change, no scale beyond the existing 1.02 card cap.** The ticket's dimension lives entirely in the resting shadow.

**Still binding, unchanged by D4:** fixed-height card slots, 3-up desktop / 1-up mobile grid (§Spacing & layout above), keyboard focus ring on the whole ticket (not just the inner link), 5-second Crexi-user legibility (ref 07), print legibility (owners print things).

## Imagery

Real hotels from the track record only; no stock, no AI-generated *photography* (the ban covers photography presented as real — fabricated properties, fake people, stock-looking scenes; commissioned/generated single-stroke line-art illustration, e.g. the `#method` engraving, was already permitted).
Cards: grayscale at rest → color on hover; touch devices use the kwc `tapped` toggle pattern.

**D5 (2026-08-08) — signature art is now supplied, not generated.** The site's signature image treatment is a **「北天」 glyph-mosaic**: typographic halftone whose sole rendering primitive is the repeated text unit 「北天」, depth carried by glyph scale/spacing/density/weight/overlap/color/contrast, source-photo colors preserved. Razim produces each piece himself via a controlled img2img prompt and delivers finished image files — **this repo does not generate this art.** Our job is intake, sharp-pipeline preparation (AVIF/WebP/JPEG via `next/image`, responsive `sizes`, explicit dimensions, hero gets `priority`), and placement, tracked in `content/artwork.ts` (placement → asset path + alt + status). Anti-AI-slop clarification (full text in ref 07): the ban covers fake *photography* presented as real; Razim-approved stylized glyph-mosaic art is the house treatment and passes cleanly — it is never mistaken for a photograph. Alt text describes the depicted subject (the hotel, the scene), never the treatment.
**Retired from the page:** `AsciiCanvas`, the build-time character-grid pipeline, and the 24–36-frame morph/shimmer loop specced in ref 05 — superseded by the supplied artwork above. The generator script and JSON assets stay in the repo, uninvested; nothing is deleted. A placement without a delivered piece yet renders its designed interim surface (never a stock photo, never a blank hole) per `docs/PLACEHOLDERS.md`.
**`<KanjiAccent>` — unchanged, still ours to build.** A *different* thing from the artwork above: a reusable background motif, our own SVG (reuse the hanko glyph geometry, never a `<text>` element), huge outlined/low-opacity 北/天 glyphs placed like the existing OrbitalArcs pattern. Rules (hex/palette context in [01-brand.md](01-brand.md)): absolute positioning, `aria-hidden="true"`, `pointer-events: none`, opacity ceiling `--kanji-opacity-dark` (0.08) / `--kanji-opacity-light` (0.06) — past these values it competes with type instead of sitting behind it — **one instance per section maximum**. Ships in the menu overlay, calculator, BOV, and anywhere a side accent is needed.
Every image through `next/image` with explicit dimensions; hero art gets `priority`; alt text describes the hotel, not the treatment.

## Iconography

Lucide only, 1.5px stroke, 16/20/24 sizes, `--ink-muted` default. No emoji, no text arrows (→ allowed inside mono micro-labels only, as type not icon).
North-star glyph is an SVG asset, not an icon-font hack.

## Components (build order)

Tokens → primitives (shadcn/ui restyled: Button, Input, Select, Dialog, Accordion) → site atoms (MicroLabel, StatNumeral, GoldRule, Badge) → cards (ListingCard, ClosingCard, TeamCard — ListingCard/ClosingCard build on the `ticket`/`ticket-perf`/`ticket-notch`/`overprint` chassis, §Deal-ticket component above; D4, 2026-08-08) → sections → page.
Buttons: primary = gold pill on dark / ink pill on light; secondary = hairline ghost pill; tertiary = mono underline link. One primary per viewport.
Badges: mono uppercase 11px in hairline pill — `EXCLUSIVE · OFF-MARKET · IN CONTRACT · CLOSED` (+ gold text for EXCLUSIVE/OFF-MARKET).
Forms: `--card` fields on paper, 16px+ inputs (iOS anti-zoom), visible focus ring in gold at 2px, labels always present (no placeholder-as-label).
