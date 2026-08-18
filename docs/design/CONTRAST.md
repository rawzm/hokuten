# CONTRAST — measured, not asserted

**Run 2026-08-17 · source of truth: Dino's Brand Design Guide v1.3**
(adopted as L2 / R3 Option 1, `docs/LAUNCH-IMPLEMENTATION.md` §2.1 — supersedes
the `#B8902E` palette recorded here on 2026-08-08). Transcript below is the
verbatim output of `node docs/design/contrast.mjs` at that revision; the script's
hardcoded hexes and `site/app/globals.css` were edited in the same pass.

Every colour pair the Hokuten site ships was computed against WCAG 2.1 relative
luminance. WCAG 2.1 Level AA is treated as binding law here (PHASE-1-EXECUTION
§8.1: DOJ's April 2024 ADA web rule, plus CA Unruh statutory exposure and a
Larchmont sponsoring brokerage).

Re-run after ANY palette change — it is the evidence behind the P0 contrast gate:

    node docs/design/contrast.mjs

Thresholds: 4.5:1 normal text · 3:1 large text and UI components.
The script exits non-zero if any binding fails, so it can gate a build.

## How to read a line

| Class | Meaning |
|---|---|
| `PASS` / `FAIL` | A pair the site actually **binds** — a foreground token on a ground it is really rendered against. **A single FAIL is a ship-stopper.** |
| `GUARD` | A pair that must **stay below** the floor: the decorative tokens. The line exists so nobody promotes brand gold or ivory-gray to text on the grounds that "nothing failed". A `NOTE` here means the pair has drifted above the floor — not a failure, but the note explaining why it is not text needs rewriting. |
| `CONTINGENCY` | A ground nothing is bound to today, recorded because a documented alternative would bind it. Below-floor here is information, not a failure. |
| `[margin ±x]` | Printed whenever a ratio lands within 0.05 of its threshold. Two decimals rounds 4.4957 to "4.50", and "4.50, need 4.5" reads as a pass — that is exactly how `--accent-ink` on cream was written up as passing in the plan. Verdicts are computed on the raw float; the margin makes the rounding harmless. |

## Token decisions from this run

Recorded here, in skill ref 01 (Accessible tones) and in PROJECT-MEMORY:

- **`--accent-ink #7E652D`** — brand gold `#B08D3F` is **2.96:1** on the new
  paper, so gold text on a light surface was never shippable. Derived by holding
  `#B08D3F`'s hue (41.5°) and saturation (47.4%) and dropping lightness to the AA
  floor on the worst light ground that actually ships: 5.27 paper · 4.83 ivory ·
  5.55 card.
- **`--accent-deep #675325`** — same derivation, lightness dropped to 7:1 on
  paper. Dense art strokes and pressed states, where the extra weight is wanted.
- **`--ink-dark-field #F5F1E8` / `--ink-dark-muted #D0C9BC`** — the guide states
  its dark-field ink outright, so `.surface-dark` / `.surface-black` bind those
  values instead of `color-mix`-ing `--paper` toward the ground. Only the
  tertiary step, the hairline and the field ground are still mixed, and they are
  now mixed **from the dark-field ink** — `#8C8B88` at 5.01:1 on charcoal,
  `#7F7D79` at 5.11:1 on black.
- **`--meta #6E6862`** — unchanged, and it clears the new paper (5.22) and ivory
  (4.79). Brand ivory-gray `#8B8680` is 3.43:1 and survives only as
  `--meta-soft`, decorative, never text.
- **Cream `#EDE7D8` is not a text ground.** It ships as `--rule` and
  `--accent-wash` only. If the paper→ivory step ever reads too flat and cream is
  promoted to `--surface-deep` (the one in-family alternative §2.1 allows), then
  **two** tokens must move with it, because `--meta` lands at 4.46 and
  `--accent-ink` at 4.4957 — both short. The `--accent-ink` replacement is
  pre-derived and measured in the transcript: **`#7A622C`**, same hue, 4.71:1 on
  cream, 5.52 on paper. `--meta` would need its own derivation. **Do not adopt
  cream without doing both.**
- **Charcoal `#1A1C1F` = `--ink`.** The guide's light-field ink and the charcoal
  pixel-sampled from the `*_on_Charcoal.png` lockups are the same value, which is
  why an on-charcoal lockup sits seamlessly on a `.surface-dark` band.
- **Theme B is parked** (L1, 2026-08-17) and was not retuned. Its own palette is
  byte-identical to 2026-08-10; it appears below only because the **surface
  scopes are shared**, so the `--ink-dark-*` rebinding reaches its dark chapter
  too. It still measures clean there (15.75 / 10.79 / 5.03).

Anything marked `GUARD` or `SHORT` below is documented as unusable-for-text and
is bound to no text token in `site/app/globals.css`.

## Full matrix

```
=== THEME G — Brand Guide v1.3 (production, [data-theme="gold"]) ===

-- light scopes — .surface-paper (paper) · .surface-deep (ivory) · .surface-card (white) --
PASS  16.22:1  --ink on --paper  (#1A1C1F on #FBF9F3, need 4.5)
PASS  14.88:1  --ink on --surface-deep (ivory)  (#1A1C1F on #F4EFE3, need 4.5)
PASS  17.08:1  --ink on --card  (#1A1C1F on #FFFFFF, need 4.5)
PASS  8.06:1  --ink-muted on --paper  (#4A4D52 on #FBF9F3, need 4.5)
PASS  7.40:1  --ink-muted on --surface-deep  (#4A4D52 on #F4EFE3, need 4.5)
PASS  8.49:1  --ink-muted on --card  (#4A4D52 on #FFFFFF, need 4.5)
PASS  5.22:1  --meta on --paper  (#6E6862 on #FBF9F3, need 4.5)
PASS  4.79:1  --meta on --surface-deep  (#6E6862 on #F4EFE3, need 4.5)
PASS  5.50:1  --meta on --card  (#6E6862 on #FFFFFF, need 4.5)
PASS  5.27:1  --accent-ink as text on --paper  (#7E652D on #FBF9F3, need 4.5)
PASS  4.83:1  --accent-ink as text on --surface-deep  (#7E652D on #F4EFE3, need 4.5)
PASS  5.55:1  --accent-ink as text on --card  (#7E652D on #FFFFFF, need 4.5)
PASS  5.27:1  --accent-ink as focus ring / UI on --paper  (#7E652D on #FBF9F3, need 3)
PASS  4.83:1  --accent-ink as focus ring / UI on --surface-deep  (#7E652D on #F4EFE3, need 3)
PASS  7.02:1  --accent-deep on --paper (pressed / dense stroke)  (#675325 on #FBF9F3, need 4.5)
PASS  7.39:1  --accent-deep on --card  (#675325 on #FFFFFF, need 4.5)
PASS  6.20:1  --money-on-light on --paper  (#1F6A4A on #FBF9F3, need 4.5)
PASS  6.52:1  --money-on-light on --card (--field)  (#1F6A4A on #FFFFFF, need 4.5)
PASS  6.20:1  --brick form error on --paper  (#A33B2C on #FBF9F3, need 4.5)
PASS  6.52:1  --brick form error on --card (--field)  (#A33B2C on #FFFFFF, need 4.5)

-- dark scopes — .surface-dark (charcoal) · .surface-black --
PASS  15.15:1  --fg = --ink-dark-field on --dark  (#F5F1E8 on #1A1C1F, need 4.5)
PASS  18.63:1  --fg = --ink-dark-field on --black  (#F5F1E8 on #000000, need 4.5)
PASS  10.38:1  --fg-muted = --ink-dark-muted on --dark  (#D0C9BC on #1A1C1F, need 4.5)
PASS  12.76:1  --fg-muted = --ink-dark-muted on --black  (#D0C9BC on #000000, need 4.5)
   color-mix 52% dark = #8C8B88 · 52% black = #7F7D79
PASS  5.01:1  --fg-meta (dark-field ink @52%) on --dark  (#8C8B88 on #1A1C1F, need 4.5)
PASS  5.11:1  --fg-meta (dark-field ink @52%) on --black  (#7F7D79 on #000000, need 4.5)
PASS  5.47:1  --accent-on-dark as text on --dark  (#B08D3F on #1A1C1F, need 4.5)
PASS  6.73:1  --accent-on-dark as text on --black  (#B08D3F on #000000, need 4.5)
PASS  7.29:1  --accent-dim hover / secondary on --dark  (#C8A552 on #1A1C1F, need 4.5)
PASS  8.96:1  --accent-dim hover / secondary on --black  (#C8A552 on #000000, need 4.5)
PASS  5.77:1  --money-on-dark on --dark  (#58A66E on #1A1C1F, need 4.5)
PASS  7.09:1  --money-on-dark on --black  (#58A66E on #000000, need 4.5)
   color-mix 7% dark = #292B2D · 7% black = #111110
PASS  12.61:1  --fg on a dark --field (input ground)  (#F5F1E8 on #292B2D, need 4.5)
PASS  16.76:1  --fg on a black --field  (#F5F1E8 on #111110, need 4.5)
PASS  4.55:1  --accent-text as UI on a dark --field  (#B08D3F on #292B2D, need 3)

-- accent fill and hero --
PASS  5.47:1  --on-accent on an --accent fill (pill / chip)  (#1A1C1F on #B08D3F, need 4.5)
PASS  18.63:1  --hero-fg on --hero-ground  (#F5F1E8 on #000000, need 4.5)

-- guards — these must NOT clear the floor; nothing binds them as text --
GUARD  2.96:1  --accent brand gold as text on --paper  (#B08D3F on #FBF9F3, must stay under 4.5)
GUARD  2.72:1  --accent brand gold as text on --surface-deep  (#B08D3F on #F4EFE3, must stay under 4.5)
GUARD  3.12:1  --accent brand gold as text on --card  (#B08D3F on #FFFFFF, must stay under 4.5)
GUARD  2.23:1  --accent-dim as text on --paper  (#C8A552 on #FBF9F3, must stay under 4.5)
GUARD  2.96:1  --paper as text on an --accent fill (never light-on-gold)  (#FBF9F3 on #B08D3F, must stay under 4.5)
GUARD  3.43:1  --meta-soft ivory-gray as text on --paper  (#8B8680 on #FBF9F3, must stay under 4.5)
GUARD  3.50:1  ref-03's retired 'dark-field ink @40%' on --dark  (#72716F on #1A1C1F, must stay under 4.5)

-- contingency — cream #EDE7D8 is --rule / --accent-wash, NOT a text ground --
CONTINGENCY  13.84:1  --ink on cream  (#1A1C1F on #EDE7D8, would need 4.5) — clears
CONTINGENCY  5.99:1  --accent-deep on cream  (#675325 on #EDE7D8, would need 4.5) — clears
CONTINGENCY  4.46:1  --meta on cream  (#6E6862 on #EDE7D8, would need 4.5) — SHORT  [margin -0.0432]
CONTINGENCY  4.50:1  --accent-ink on cream  (#7E652D on #EDE7D8, would need 4.5) — SHORT  [margin -0.0043]
CONTINGENCY  4.71:1  --accent-ink RE-DERIVED for cream — the one-line fix if cream is adopted  (#7A622C on #EDE7D8, would need 4.5) — clears

=== THEME B — Hokuten Blue (PARKED, unreachable, not retuned) ===

-- light scopes --
PASS  7.12:1  --accent-ink blue on cool paper  (#2F4FA3 on #F7F8F5, need 4.5)
PASS  7.59:1  --accent-ink blue on card white  (#2F4FA3 on #FFFFFF, need 4.5)
PASS  5.92:1  --accent-ink blue on chip  (#2F4FA3 on #DCE3F7, need 4.5)
PASS  5.11:1  --accent-ink blue on wash  (#2F4FA3 on #C9D4EE, need 4.5)
PASS  9.46:1  --accent-deep blue on cool paper  (#1F3C8C on #F7F8F5, need 4.5)
PASS  7.12:1  --on-accent cool paper on a blue fill  (#F7F8F5 on #2F4FA3, need 4.5)
PASS  16.02:1  --ink on cool paper  (#1A1C1F on #F7F8F5, need 4.5)
PASS  7.96:1  --ink-muted on cool paper  (#4A4D52 on #F7F8F5, need 4.5)
PASS  5.16:1  --meta on cool paper  (#6E6862 on #F7F8F5, need 4.5)
PASS  6.79:1  --accent-deep blue as art stroke on wash  (#1F3C8C on #C9D4EE, need 3)

-- dark scope — now inherits the SHARED --ink-dark-* rebinding, not --paper --
PASS  6.05:1  --accent-on-dark blue-mid on indigo  (#7E96D0 on #12172B, need 4.5)
PASS  15.75:1  --fg = --ink-dark-field on indigo  (#F5F1E8 on #12172B, need 4.5)
PASS  10.79:1  --fg-muted = --ink-dark-muted on indigo  (#D0C9BC on #12172B, need 4.5)
   color-mix 52% indigo = #88888D
PASS  5.03:1  --fg-meta (dark-field ink @52%) on indigo  (#88888D on #12172B, need 4.5)

-- guards --
GUARD  2.34:1  --accent blue as text on indigo (why --accent-on-dark exists)  (#2F4FA3 on #12172B, must stay under 4.5)

=== SUMMARY ===
bindings     51 checked · 0 FAIL
guards        8 checked · 0 now clearing the floor (informational)
contingency   5 recorded · unbound grounds
GATE: PASS — zero FAIL.
```
