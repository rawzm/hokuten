# Ref/awards — CoStar Power Broker award masters

Staged **2026-08-17** by portion **P17** (plan `docs/LAUNCH-IMPLEMENTATION.md` §7 P17 / F39 / R17).
Source material only — never referenced directly by `site/`. Prep scripts read from here and write
derivatives into `site/public/awards/`.

**Origin (private delivery, not in the repo):**
`CoStar Power Broker Awards Social Media Kit/` — `2025 Annual Top Broker/`, `2025 Q3 Quarterly Deals/`,
`2026 Q1 Quarterly Deals/`, `2026 Q2 Quarterly Deals/`, `2025 Annual Top Firm/`.
The governing rules doc `README - COSTAR POWER BROKER AWARD MEDIA.md` beside this file is the delivered
CoStar media README, copied verbatim from `Media/CoStar Power Broker Awards/`.

## Rules (from the delivered CoStar README — these win over any other doc)

- **Do not crop, recolor, redraw, combine, or overwrite** these originals. Re-intake unmodified, at
  native aspect (D16).
- **Email-signature and social-graphic formats are not for website use.** None were copied here.
- `Reference Only - Prior Firm - CoStar 2025 Annual Top Firm - Email Signature.png` is **never** used
  as an individual Dino or KWC/HOKUTEN award. It was **deliberately not copied** into this folder.
- The four Dino files are **individual** awards. `US_2025Annual_TopFirm_WinnerBadge.png` is
  **prior-firm / TEAM** recognition and ships in its own block only. Never "5x". Never "Annual 2026".

## Inventory (SHA-256 recorded so P15 can prove the shipped files are unmodified)

| File | Native dims | SHA-256 |
|---|---|---|
| `Dino Monteverde - CoStar 2025 Annual Top Broker - Winner Badge.png` | 355×333 | `19df3a83cb30fa96eacc0abcce237f709932682cdd454d039c2dbed3e16699a6` |
| `Dino Monteverde - CoStar 2025 Q3 Quarterly Deals - Winner Badge.png` | 784×784 | `0f770588922e8c055914cdb6bfca53d730b283aede50aac82b2bf1f9770899eb` |
| `Dino Monteverde - CoStar 2026 Q1 Quarterly Deals - Winner Badge.png` | 784×784 | `c02b22ab0d92b1de63f40a86b0a6c3addc877dac1fb3153e03731a006fdf6681` |
| `Dino Monteverde - CoStar 2026 Q2 Quarterly Deals - Winner Badge.png` | 784×784 | `b19d7bc9e6d5e4778e676a951e501607d165b169bfca39c0a2d99e12d6f9d925` |
| `US_2025Annual_TopFirm_WinnerBadge.png` | 355×333 | `0159a35a1eff15577cdc83a86c4c864d1b93668ce45d71dedaca611defbef8b2` |

The badges are **near-square medallions**, not banners. The five files that shipped in `site/public/awards/`
before 2026-08-17 were 581×135 / 747×168 email-signature derivatives and were the wrong artwork — replaced in
P15 (F38); the matching `QuarterlyBanners.tsx` banner geometry is re-specced separately.

## Shipped derivatives (P15 / F38, 2026-08-17)

`site/public/awards/` now carries these ten files, emitted from the masters above with
`sharp` 0.35.3 using `identity-prep.ts`'s own encoder settings (`png compressionLevel 9`,
`avif quality 68 effort 6`). **Uniform scale only — no crop, no recolor, no redraw, no combine.**
The two Annual masters ship at native pixels (verified pixel-identical to the master by
raw-RGBA SHA-256); the three Quarterly masters ship at a uniform 0.5714× (784→448) so the
PNG stays inside `identity-prep.ts`'s 160KB PNG / 24KB AVIF badge budgets. All five keep a
transparent ground.

| Shipped file | Master | Dims | Scale | Bytes | SHA-256 (shipped) |
|---|---|---|---|---|---|
| `costar-top-broker-2025.png` | `Dino Monteverde - CoStar 2025 Annual Top Broker - Winner Badge.png` | 355×333 | 1.0000 | 23,026 | `ba7999a927b66efaac7b8ec75e41787ecfe49a2b2cba238b5f7424bcbfdf32cc` |
| `costar-top-broker-2025.avif` | ” | 355×333 | 1.0000 | 10,022 | `11c191289f90154380f66f8c324cf28f89c6574c8c3d5a2712208cb1c29a5800` |
| `costar-top-firm-2025.png` | `US_2025Annual_TopFirm_WinnerBadge.png` | 355×333 | 1.0000 | 21,948 | `2d0a6928dbd2f6ab230c54885f608d9ddacc3abc349cab7e29429303ae7088e2` |
| `costar-top-firm-2025.avif` | ” | 355×333 | 1.0000 | 9,789 | `db7b629d8a658c6ce110a0cf3bcce70172c8e71810ab38a668489ccf8e4219e1` |
| `powerbroker-q3-2025.png` | `Dino Monteverde - CoStar 2025 Q3 Quarterly Deals - Winner Badge.png` | 448×448 | 0.5714 | 114,351 | `4c268ef09bf12f9799b0935a9eb3aadfe5695d12d26bd4f66a5ce6c46991c334` |
| `powerbroker-q3-2025.avif` | ” | 448×448 | 0.5714 | 15,639 | `413714d95cd32c80fa2502a74896335ad0c2e0574221cd560bf82a24af79af87` |
| `powerbroker-q1-2026.png` | `Dino Monteverde - CoStar 2026 Q1 Quarterly Deals - Winner Badge.png` | 448×448 | 0.5714 | 71,321 | `aa4a979a0b85d38deb3a490527945ee644d13761d8fa7698592309ae1664a959` |
| `powerbroker-q1-2026.avif` | ” | 448×448 | 0.5714 | 15,427 | `ccd709f96147912fc44db146b6ad69e5425d2d904573797029bc9ef1925ed089` |
| `powerbroker-q2-2026.png` | `Dino Monteverde - CoStar 2026 Q2 Quarterly Deals - Winner Badge.png` | 448×448 | 0.5714 | 71,859 | `bb4c04d1d94176387fe95b6d7761ce831927c0e319c165f43a8dac7921a732e1` |
| `powerbroker-q2-2026.avif` | ” | 448×448 | 0.5714 | 15,236 | `d0062e1a47af956700154b0cec67f897ad4fd69825cf2307fecf5584174001da` |

The five email-signature intakes in `Ref/site/` (including the README-excluded prior-firm
signature, SHA-256 `94af4db4…68dd04`) were deleted in the same pass (A29/F39). Those bytes now
appear nowhere under `site/` or `Ref/`. `site/scripts/identity-prep.ts` PART 2 still points at
the deleted paths and must be re-pointed at this folder before it is run again.
