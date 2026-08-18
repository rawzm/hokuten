# Ref/brand-kit — KW Commercial / THE HOKUTEN GROUP lockup masters

Staged **2026-08-17** by portion **P17** (plan §2.4 / §7 P17 / F39 / R17). Source material only.
`site/scripts/identity-prep.ts` reads its lockup sources from **here**, not from the gitignored
`full-brand-toolkit/`.

**Origin (private delivery, not in the repo):** `Media/Company Social Media Kit/01_Logo_Lockups/`
(8 PNG + 2 SVG), plus the two kit cuts the outreach kit ships
(`03 - OUTREACH PROFILE SIGNATURE AND DEAL CARD KIT - REV6/assets/`).
The same 10 lockups are tracked read-only at the repo root under `The_Hokuten_Group_Brand_Addon_2/01_Logo_Lockups/`.

## Facts that change how these are used

- **There is no vector logo anywhere in the corpus.** Both `.svg` files are **raster-embed wrappers** —
  a base64 PNG inside an `<svg>` shell, zero `fill=` / `stop-color=` attributes. Treat them as PNGs and
  **never attempt to recolour them.**
- The rasters are baked in **kit gold `#B8943D`**, not the website gold. Per L2 rasters keep their baked
  gold; the ~2-unit delta beside a website-gold rule is accepted and logged (X4, P13).
- `*_on_Ivory.png` grounds sample to `#E2DCCC`, not the guide ivory — matters if one is ever placed on
  `--surface-deep`.
- **Deployment gate G4/G1:** these lockups may sit in the repo and render on the `noindex` production
  deployment for Dino's review, but **not on the public site** before KW / Forward Wilshire papers the
  Hokuten name.

## Inventory

| File | Dims |
|---|---|
| `KW_Commercial_Linear_TheHokutenGroup_Gold_Transparent.png` | 3600×1022 |
| `KW_Commercial_Linear_TheHokutenGroup_Gold_on_Charcoal.png` | 3762×1184 |
| `KW_Commercial_Linear_TheHokutenGroup_Gold_on_Ivory.png` | 3762×1184 |
| `KW_Commercial_Linear_TheHokutenGroup_Gold_on_White.png` | 3762×1184 |
| `KW_Commercial_Stacked_TheHokutenGroup_Gold_Transparent.png` | 2400×1836 |
| `KW_Commercial_Stacked_TheHokutenGroup_Gold_on_Charcoal.png` | 2692×2128 |
| `KW_Commercial_Stacked_TheHokutenGroup_Gold_on_Ivory.png` | 2692×2128 |
| `KW_Commercial_Stacked_TheHokutenGroup_Gold_on_White.png` | 2692×2128 |
| `KW_Commercial_Linear_TheHokutenGroup_Gold_Transparent.svg` | raster-embed wrapper |
| `KW_Commercial_Stacked_TheHokutenGroup_Gold_Transparent.svg` | raster-embed wrapper |
| `KW Commercial - The Hokuten Group - Website Lockup.png` | 3600×1022 — **byte-identical** to `…Linear_…Gold_Transparent.png` |
| `KW Commercial - The Hokuten Group - Stacked Lockup.png` | 2400×1836 — **byte-identical** to `…Stacked_…Gold_Transparent.png` |

The two outreach-kit cuts are duplicates of the transparent lockups under kit filenames; they are kept
because the plan names them as the build's source paths.

**Header mark:** the sticky header uses a new derivative of the **linear on-charcoal** cut (R14 Option 2).
A real-text brand line stays adjacent, visually-hidden is acceptable (D1).
