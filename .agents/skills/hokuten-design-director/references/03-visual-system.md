# 03 — Visual System

## Table Of Contents
Color roles · Type ramp · Spacing & layout · Surfaces & borders · Imagery · Iconography · Components

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

| Role | Token | Size (desktop / mobile) | Voice, weight, case |
|---|---|---|---|
| Display 1 | `type.display1` | clamp 56–96px / 40px | Fraunces Light, tight leading (1.02), sentence case + one *italic* word |
| Display 2 | `type.display2` | 40–56px / 32px | Fraunces Light–Regular |
| Heading | `type.heading` | 24–28px / 22px | Fraunces Regular or Inter Semibold |
| Body large | `type.bodyLg` | 18–20px | Inter Regular, leading 1.6 |
| Body | `type.body` | 16px | Inter Regular — floor for reading text |
| Data | `type.data` | 14–15px | IBM Plex Mono, `font-variant-numeric: tabular-nums` |
| Micro-label | `type.micro` | 11–12px | IBM Plex Mono, uppercase, tracking 0.14em, bracketed index device |

Tracked brand line: uppercase Inter, tracking 0.35em, gold — headers/footers only.
Stat numerals: Display 1/2 in Fraunces with mono caption beneath (never mono for the big numeral).
Hierarchy moves: weight, color (ink→muted→meta), spacing, then size — adding a fifth size is a P1.

## Spacing & layout

Base unit 4px; component rhythm in 8s (8/16/24/32/48).
Section padding: 96–160px desktop, 64–96px mobile.
Container: max-width 1200px content, 1440px for full-bleed art; gutters 24px mobile / 48px desktop.
Grid: 12-col desktop, 4-col mobile. Listing/closing cards: 3-up desktop, 1-up mobile (2-up only ≥640px if cards stay ≥320px wide).
Anchor offset: `scroll-margin-top: 88px` on all section ids (sticky nav height).
Density: one idea per screen; if a viewport contains two competing focal points, cut one.

## Surfaces & borders

Hairlines everywhere structure is needed: 1px `--rule` (light) — no drop-shadow-based layout.
Shadows: only on floating elements (menu overlay, modal, sticky ticker), soft and ink-tinted, never gray-blur halos.
Radius: `r.none` 0 for images/art, `r.card` 2px for cards/inputs, `r.pill` 999px for CTAs/badges only.
Dark sections may carry star-grain + hairline orbital arcs (imagery layer, max opacity 8%); light sections carry no texture.

## Imagery

Real hotels from the track record only; no stock, no AI-generated photography (the ban covers photography — commissioned/generated single-stroke line-art illustration, e.g. the `#method` engraving, is permitted).
Cards: grayscale at rest → color on hover; touch devices use the kwc `tapped` toggle pattern.
Signature art: ASCII/dither renders per [01-brand.md](01-brand.md) motif spec — pre-rendered assets, not runtime filters, except the hero canvas.
Every image through `next/image` with explicit dimensions; hero art gets `priority`; alt text describes the hotel, not the treatment.

## Iconography

Lucide only, 1.5px stroke, 16/20/24 sizes, `--ink-muted` default. No emoji, no text arrows (→ allowed inside mono micro-labels only, as type not icon).
North-star glyph is an SVG asset, not an icon-font hack.

## Components (build order)

Tokens → primitives (shadcn/ui restyled: Button, Input, Select, Dialog, Accordion) → site atoms (MicroLabel, StatNumeral, GoldRule, Badge) → cards (ListingCard, ClosingCard, TeamCard) → sections → page.
Buttons: primary = gold pill on dark / ink pill on light; secondary = hairline ghost pill; tertiary = mono underline link. One primary per viewport.
Badges: mono uppercase 11px in hairline pill — `EXCLUSIVE · OFF-MARKET · IN CONTRACT · CLOSED` (+ gold text for EXCLUSIVE/OFF-MARKET).
Forms: `--card` fields on paper, 16px+ inputs (iOS anti-zoom), visible focus ring in gold at 2px, labels always present (no placeholder-as-label).
