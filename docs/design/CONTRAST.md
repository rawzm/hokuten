# CONTRAST — measured, not asserted

Every colour pair the Hokuten site ships was computed against WCAG 2.1 relative
luminance, in both themes. WCAG 2.1 Level AA is treated as binding law here
(PHASE-1-EXECUTION §8.1: DOJ's April 2024 ADA web rule, plus CA Unruh statutory
exposure and a Larchmont sponsoring brokerage).

Re-run after ANY palette change — it is the evidence behind the P0 contrast gate:

    node docs/design/contrast.mjs

Thresholds: 4.5:1 normal text · 3:1 large text and UI components.

Three token decisions came out of this run and are recorded in skill ref 01
(Accessible tones) and PROJECT-MEMORY 2026-08-08:

- `--accent-ink #816520` — brand gold `#B8902E` is 2.71:1 on `--paper`, so gold
  text on light was never shippable. Same hue and saturation, darkened.
- `--meta #6E6862` — brand ivory-gray `#8B8680` is 3.29:1 and fails as text;
  it survives as `--meta-soft`, decorative only.
- On-dark secondary/tertiary text is `color-mix` at 64% / 52% paper. Ref 03's
  "paper at 40%" measures 3.59:1 and must not be used for text.

Anything marked FAIL below is documented as unusable-for-text and is not bound to
a text token in `site/app/globals.css`.

## Full matrix

```
=== THEME G — Kit Gold ===
PASS  15.55:1  ink on paper  (#1A1C1F on #F7F4ED, need 4.5)
PASS  7.73:1  ink-muted on paper  (#4A4D52 on #F7F4ED, need 4.5)
FAIL  3.29:1  meta #8B8680 on paper (ref01 value)  (#8B8680 on #F7F4ED, need 4.5)
PASS  5.01:1  meta #6E6862 on paper (proposed)  (#6E6862 on #F7F4ED, need 4.5)
PASS  4.54:1  meta #6E6862 on surface-deep  (#6E6862 on #EFE9DA, need 4.5)
FAIL  2.71:1  gold #B8902E on paper  (#B8902E on #F7F4ED, need 4.5)
PASS  4.60:1  accent-ink #8A6A1C on paper  (#8A6A1C on #F7F4ED, need 4.5)
PASS  5.05:1  accent-ink #8A6A1C on card white  (#8A6A1C on #FFFFFF, need 4.5)
FAIL  4.17:1  accent-ink #8A6A1C on surface-deep  (#8A6A1C on #EFE9DA, need 4.5)
PASS  4.60:1  accent-ink #8A6A1C on paper (UI 3:1)  (#8A6A1C on #F7F4ED, need 3)
PASS  5.99:1  gold on dark  (#B8902E on #16181B, need 4.5)
PASS  7.07:1  gold on black  (#B8902E on #000000, need 4.5)
PASS  7.29:1  gold-dim hover on dark  (#C9A04A on #16181B, need 4.5)
PASS  5.99:1  on-accent #16181B on gold pill  (#16181B on #B8902E, need 4.5)
PASS  16.19:1  paper on dark  (#F7F4ED on #16181B, need 4.5)
   mix64 = #a6a5a1  mix52 = #8b8a88
PASS  7.22:1  paper@64% on dark  (#a6a5a1 on #16181B, need 4.5)
PASS  5.16:1  paper@52% on dark  (#8b8a88 on #16181B, need 4.5)
FAIL  3.59:1  paper@40% on dark (ref03 value)  (#70706f on #16181B, need 4.5)
PASS  5.94:1  brick on paper  (#A33B2C on #F7F4ED, need 4.5)
PASS  6.52:1  brick on card  (#A33B2C on #FFFFFF, need 4.5)

=== THEME B — Hokuten Blue ===
PASS  7.12:1  blue #2F4FA3 on cool paper  (#2F4FA3 on #F7F8F5, need 4.5)
PASS  7.59:1  blue #2F4FA3 on card white  (#2F4FA3 on #FFFFFF, need 4.5)
PASS  5.92:1  blue #2F4FA3 on chip #DCE3F7  (#2F4FA3 on #DCE3F7, need 4.5)
PASS  5.11:1  blue #2F4FA3 on wash #C9D4EE  (#2F4FA3 on #C9D4EE, need 4.5)
FAIL  2.34:1  blue #2F4FA3 on indigo dark  (#2F4FA3 on #12172B, need 4.5)
PASS  6.05:1  blue-mid #7E96D0 on indigo dark  (#7E96D0 on #12172B, need 4.5)
PASS  9.46:1  blue-deep #1F3C8C on cool paper  (#1F3C8C on #F7F8F5, need 4.5)
PASS  7.12:1  on-accent #F7F8F5 on blue pill  (#F7F8F5 on #2F4FA3, need 4.5)
PASS  16.02:1  ink on cool paper  (#1A1C1F on #F7F8F5, need 4.5)
PASS  7.96:1  ink-muted on cool paper  (#4A4D52 on #F7F8F5, need 4.5)
PASS  5.16:1  meta #6E6862 on cool paper  (#6E6862 on #F7F8F5, need 4.5)
   mix64 = #a5a7ac  mix52 = #898c94
PASS  7.37:1  coolpaper@64% on indigo  (#a5a7ac on #12172B, need 4.5)
PASS  5.28:1  coolpaper@52% on indigo  (#898c94 on #12172B, need 4.5)
PASS  16.65:1  coolpaper on indigo  (#F7F8F5 on #12172B, need 4.5)
PASS  6.79:1  blue-deep #1F3C8C as art stroke vs wash  (#1F3C8C on #C9D4EE, need 3)
```
