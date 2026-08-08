# 北天 hanko — construction, cuts, and the scarcity rule

The seal ships **final**, not as a candidate (Razim, 2026-08-07: "push it like it's final").
Authored 2026-08-08. Governing references: design-skill [01-brand](../../.agents/skills/hokuten-design-director/references/01-brand.md)
(motif system, palette), [04-page-anatomy](../../.agents/skills/hokuten-design-director/references/04-page-anatomy.md)
(the three placements), [CONTRAST.md](CONTRAST.md) (every ratio quoted below).

---

## 1. What ships

| File | Fill | Reads on | Consumed by |
|---|---|---|---|
| `site/public/brand/hanko-gold.svg` | `#B8902E` | dark surfaces | `THEME_PRESENTATION.gold.hanko` **and** `.hankoMonochromeOnDark` |
| `site/public/brand/hanko-blue.svg` | `#2F4FA3` | light surfaces | `THEME_PRESENTATION.blue.hanko` |
| `site/public/brand/hanko-blue-on-dark.svg` | `#7E96D0` | indigo/dark surfaces | `THEME_PRESENTATION.blue.hankoMonochromeOnDark` |
| `site/public/brand/favicon-gold.svg` | `#B8902E` | browser tab (Theme G) | `THEME_PRESENTATION.gold.favicon` |
| `site/public/brand/favicon-blue.svg` | `#2F4FA3` | browser tab (Theme B) | `THEME_PRESENTATION.blue.favicon` |
| `site/public/favicon.ico` | gold, transparent | legacy tab / bookmark | served at `/favicon.ico` |
| `site/public/brand/apple-touch-icon.png` | gold on `#16181B` | iOS home screen | `metadata.icons.apple` |

The two binaries are built by `site/scripts/hanko-build.ts` — `cd site && npx tsx scripts/hanko-build.ts`.
Deterministic: verified byte-identical across consecutive runs.

Every file is hand-authored path geometry on `viewBox="0 0 100 100"`, no `<style>` block, no filter,
no `<text>`. Literal hex is permitted here because these are standalone `public/*.svg` assets, not
components — the token law applies to code, and nothing in `site/` hardcodes these values.

---

## 2. The characters are paths, and the construction was verified

There is no CJK webfont on this site. A `<text>`-based hanko would resolve to a different glyph on
every machine, and to **nothing at all** inside `og-gen.ts` (sharp/librsvg has no CJK fallback) or
inside a favicon raster. So both characters are vector outlines.

Getting the character right is a brand defect if missed, so the skeletons were not drawn from memory.
Real outlines for 北 (U+5317) and 天 (U+5929) were extracted from three macOS system faces —
Songti (serif), Hiragino Sans GB, STHeiti Medium — with `fontTools`, rendered over a 10×10
proportional grid, and read off. Hiragino Sans GB is the proportional base.

**北** — two halves, correctly asymmetric:
- *Left*: a full-height stem carrying two arms that project to **its left** — a level horizontal at
  the upper third, and a rising stroke (提) below it. The stem runs past that lower arm to the foot.
- *Right* (匕): a left-falling diagonal (撇) entering from the upper right and crossing a vertical
  at roughly 35–40% height, over a vertical that turns right at the foot and lifts into a hook
  (竖弯钩).

**天** — the trap here is 夫 and 失:
- The **upper horizontal is shorter than the lower** (48.4 vs 64 units in our drawing). This is the
  single most load-bearing proportion in the character.
- A stem descends through both bars and **stops at the lower bar** — it does not protrude below it.
  A stem that continues past the lower bar is 夫, a different character.
- Below the lower bar, the 人 base: a left-falling stroke and a right-falling stroke leaving the
  centre.

### Why the skeleton is kaisho and the execution is tensho

The brief calls for "squared, blocky tensho-flavoured seal script". This is deliberately
*flavoured*, not literal. Genuine 篆書 北 is two facing human figures and bears almost no
resemblance to the modern character; a literal seal-script cut would be unreadable to the team, to
the audience, and to anyone who searches the name. So: **modern (kaisho) skeleton, seal-script
execution** — uniform slab strokes, squared terminals, right-angled turns, counters opened to fill
the field, strong horizontals. The 提 of 北 keeps a shallow rise rather than being flattened to a
horizontal, because flattening it costs the character its handedness.

Stroke terminals carry a 0.2–0.5 unit skew (e.g. the left stem is `29.4 → 36.2` at the top and
`29.2 → 35.9` at the foot). That is enough to keep the mark off a perfect grid without reading as
sloppy at 200px.

### Composition: stacked, not side by side

北 sits above 天. Two characters side by side in a square seal are traditionally read **right to
left**, which would make the mark say "Tenhoku". Stacked top-to-bottom reads 北天 under every
convention, old and modern. Each character is drawn directly into its final 64 × 29–32 unit box —
not designed square and then squashed — so horizontals and verticals carry the same ~6-unit weight
instead of the fat-vertical/thin-horizontal artefact a non-uniform scale produces.

---

## 3. The border is geometry, not a filter

The worn edge is six filled slabs with hand-set vertices. It is **not** `feTurbulence` +
`feDisplacementMap`: an SVG filter forces a rasterisation pass at every paint, and at 16–48px the
displacement is larger than the strokes it is displacing, so a filtered border disintegrates exactly
where the mark is used most.

Wear inventory, all authored:
- a break in the **right** edge (y 38 → 49.5) — the stone chipped through;
- a second, higher break in the **left** edge (y 62 → 71.5);
- a notch bitten out of the **underside** of the bottom bar around x 57–62;
- a **chipped bottom-right corner** (the outer corner is cut diagonally, 96.3,91.4 → 91.2,96.2);
- an outer top edge that bows up ~1 unit at mid-span, and per-edge thickness variation of ~0.4 units.

The top-left corner is left crisp on purpose: one intact corner is what makes the other three read as
damage rather than as a style.

---

## 4. Colour, per theme, measured

| Cut | Fill | Ground | Ratio |
|---|---|---|---|
| gold | `#B8902E` | `--dark #16181B` | **5.99:1** |
| gold | `#B8902E` | `--black #000000` | **7.07:1** |
| gold | `#B8902E` | `--paper #F7F4ED` | 2.71:1 — **do not place gold on light** |
| blue | `#2F4FA3` | cool `--paper #F7F8F5` | **7.12:1** |
| blue | `#2F4FA3` | indigo `--dark #12172B` | 2.34:1 — **use the on-dark cut instead** |
| blue on dark | `#7E96D0` | indigo `--dark #12172B` | **6.05:1** |

All three on-page placements in Theme G sit on dark surfaces (footer, `#method`'s star-grain panel,
the OG black panel), which is why `THEME_PRESENTATION.gold.hankoMonochromeOnDark` correctly points at
the same file as `.hanko`. Theme B needs the split, and `lib/theme.ts` already wires it.

The stamp is decorative everywhere (`alt=""` + `aria-hidden`, and the brand name is present as real
text beside it in every placement), so WCAG contrast is not *binding* on it. These ratios are about
the mark being visible, and about the gold-on-light number being a standing trap.

---

## 5. The small cut, and the 24px floor

`favicon-*.svg` is a **separate drawing**, not the seal scaled down. It carries **北 alone** at
roughly 1.7× the stroke weight (10 units against 6), with counters opened and the border wear reduced
to a single left-edge break.

This is not a preference, it is a measured floor. Rasterising the full stacked seal:

| Size | Result |
|---|---|
| 16px | smudge — the two characters merge into one texture |
| 20px | the stack separates; individual strokes do not |
| **24px** | **floor** — 北 and 天 are distinguishable |
| 32px | both characters legible |
| 48px | crisp; this is the footer size |

**Rule: never render `hanko-*.svg` below 24px.** Below that the mark is noise wearing a border. The
`#method` micro-label accent must be ≥24px, ideally 28–32px; if the label's optical size demands
something smaller, use the small cut, not a shrunken seal.

Reducing to a single character for the icon set is a standard mark reduction, and 北 is the brand's
first character. It is legible at 16px, which the full seal is not.

---

## 6. The binaries

`site/scripts/hanko-build.ts` rasterises **from the gold small cut**, because `app/layout.tsx` and
`lib/seo.ts` declare one `.ico` and one apple-touch icon unconditionally — there is no per-theme
variant of either. Theme B still gets its colour through `favicon-blue.svg`, which every browser
released this decade prefers over the `.ico`.

- **`favicon.ico`, 16/32/48, transparent.** sharp cannot write ICO — `sharp.format.ico` is
  `undefined`; libvips treats ICO as decode-only. Checked, not assumed. The container is therefore
  assembled by hand in `buildIco()`: a 6-byte `ICONDIR`, one 16-byte `ICONDIRENTRY` per size, then
  PNG payloads. PNG-compressed entries are the Vista+ form and are read by every current browser.
  Independently verified with `file(1)`: *"MS Windows icon resource - 3 icons"*. Transparent because
  it has to sit on both a light and a dark tab strip.
- **`apple-touch-icon.png`, 180×180, opaque.** iOS composites a transparent home-screen icon onto
  black and then applies its own superellipse mask, so a transparent PNG reads as a dirty rectangle.
  The seal is stamped on `--dark #16181B` at a 12% inset so the corner mask never clips the border,
  and the alpha channel is dropped (`channels=3, alpha=false`, verified by reading the file back).

### Removed: `site/app/favicon.ico`

The M0 scaffold left `create-next-app`'s default favicon in place — decoded and confirmed to be the
white triangle in a black circle. In the App Router that file is a metadata **route** at
`/favicon.ico`, so it shadows `public/favicon.ico`. It was deleted; without that, the site ships the
Vercel logo as its favicon.

---

## 7. Scarcity rule — exactly three placements, and there is no fourth

Ratified in ref 04 and enforced by the closed `StampPlacement` union in `components/atoms/Stamp.tsx`.

| # | Placement | Component | Size | Notes |
|---|---|---|---|---|
| ① | Footer, beside the wordmark | `<StampPressIn placement="footer" />` | ~48px | one-time press-in reveal, `hankoPressVariants` (scale 1.06 → 1), static under reduced motion |
| ② | `#method` chapter micro-label accent | `<Stamp placement="method" />` | ≥24px | see the floor in §5 |
| ③ | OG image corner | composited by `scripts/og-gen.ts` | 92px | not a React render |

Plus the favicon, which is an asset and not this component.

**A seal used four times is a pattern, and a pattern is not a seal.** No section stamps, no bullet
glyphs, no loading indicator, no watermark, no repeat in the nav or on cards — the north-star /
compass-point glyph (ref 01, motif system) is what covers those jobs. Adding a placement means
editing the `StampPlacement` union on purpose, and it is a design decision for Razim, not a fix.

QA: `grep -rn "<Stamp" site/app site/components` must return **≤ 3** call sites.

---

## 8. Open follow-ups

- [ ] **`scripts/og-gen.ts` must be re-run.** It executed before the seal existed and skipped the
      corner stamp with a warning; the bottom-right corner of both `og-gold.png` and `og-blue.png` is
      currently bare — placement ③ is missing from the shipped cards. One command:
      `cd site && npx tsx scripts/og-gen.ts`. The script is seeded (LCG) so everything else in the
      card re-renders byte-identically.
- [ ] Consider a `pnpm` script alias for `hanko-build` in `site/package.json` (not owned by this
      workstream; the assets are committed, so the script is only needed when the seal changes).
- [ ] Team review after the internal comparison of the two theme URLs — the seal may be reworked, per
      the standing decision that it ships full-strength now and is revisited later.
