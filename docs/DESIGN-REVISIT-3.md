# DESIGN REVISIT 3 — RAZIM'S LOCALHOST REVIEW FIXES

**Addressed to: the implementing agent.** Razim reviewed the Revisit-2 build on localhost on
2026-08-10 (evening) and issued written corrections. This document is the complete, pre-resolved
work order. Execute it top to bottom and push to `main` and `theme-blue`.

**Status:** `approved` (Razim, 2026-08-10, written review against a live render) ·
**Base:** [DESIGN-REVISIT-2.md](DESIGN-REVISIT-2.md), still binding wherever this brief is silent;
[DESIGN-REVISIT.md](DESIGN-REVISIT.md) beneath that. · **Scope:** landing route only.

**Kickoff for the executor:** *"Read docs/DESIGN-REVISIT-3.md end to end and execute it. The
working tree already carries the full uncommitted Revisit-2 implementation — verify it, apply this
brief on top, then commit and push both branches."*

---

## 0. State of the tree you are inheriting — read before changing anything

Revisit 2 (waves A, B and a fit pass — ~21 agents) is **implemented but uncommitted**: ~54 modified
files plus new components, scripts and generated assets. `tsc` was clean and vitest 128/128 at last
check. **The localhost build Razim reviewed was STALE** — it predates several fixes that are already
in the working tree. Do not re-implement something that is already fixed; verify first:

| Complaint from the review | Already fixed in tree? |
|---|---|
| Horizontal scrollbar | **Partly.** The brand-rail measurement probe (the 1800px offender) was wrapped in a 0×0 clipper in `site/components/motion/Marquee.tsx`, and the rebuilt ticker's probe shipped clipped from the start. You must still run the §6 overflow gate — other offenders may exist. |
| Ticker | Rebuilt per D19 in `site/components/ticker/TickerClient.tsx` (fixed LIVE block, measured loop, pause control). Not part of this review's complaints — leave it. |
| Hero slideshow dot targets | Fixed to 44px — now irrelevant, because D24 below removes all visible controls anyway. |
| Six overfull panels | A fit wave touched Closings/Listings/Calculator/Method/Team/Hero. **Unverified** — no measurement ran after it landed. §6 re-measures. |

Everything else in this brief is new work. There are no open design questions. Where this brief
contradicts DESIGN-REVISIT-2, this brief wins and the supersession gets a dated note.

**Verification constraint (Razim's explicit instruction):** do NOT leave dev servers running and do
not do prolonged local review. Allowed: `pnpm build`, `npx tsc --noEmit --incremental false`,
`npx vitest run`, QA greps, asset scripts, and ONE transient headless-browser pass for the §6
overflow/fit gates — after which you `kill` the server immediately. Razim reviews only on the
Vercel production and preview URLs after you push.

## 1. Decisions from this review (Razim, 2026-08-10 evening) — each supersedes prior law

### D22 — Scroll snap is REMOVED; scrolling is natural everywhere

Razim's verdict on the D10 snap system: "messy and not properly navigating… buggy overall."

- Delete the snap CSS: the whole `6b. D10 — route-scoped native scroll snap` block in
  `site/app/globals.css` (the `@media` block containing `scroll-snap-type: y mandatory`,
  `scroll-padding-top`, the `.page-panel` alignment rules and the `data-tall` exemption).
- Delete the measurement island: remove `<PagedMode />` and its import from `site/app/page.tsx`,
  and delete `site/components/motion/PagedMode.tsx`.
- Revert the Lenis paged-mode gate in `site/components/motion/SmoothScroll.tsx`: with snap gone,
  Lenis's original behaviour (desktop fine-pointer smoothing, all its existing gates) is correct
  again on this route. Remove only the paged-mode refusal added this round; keep everything else.
- KEEP the twelve `page-panel` screen compositions (min-height, centred/distributed content) and
  the `stage-shell` layout — the page still reads as twelve deliberate screens; it just scrolls
  freely between them.
- Keep the print resets that reference `.page-panel` (min-height: 0 etc.) — they are still correct.
- `scroll-margin-top` anchor clearance and the shared anchor-focus handler are unchanged.

### D23 — Real hero slides: Razim's three triplets in `Ref/hero/`

Nine files landed 2026-08-10, correctly named, **exact display ratios** (4:1 / 16:7 / 4:3):

| Slide | desktop | tablet | mobile |
|---|---|---|---|
| `01-marriott` | 1536×384 | 1536×672 | 1365×1024 |
| `02-luxury` | 1672×418 | 1672×732 | 1255×941 |
| `03-resort` | 1672×418 | 1672×732 | 1255×941 |

- Update the slide config in `site/scripts/hero-prep.ts` to these three triplets (the script was
  built to prefer complete `Ref/hero/` triplets — this is the data edit it was designed for), run
  it, and verify the output + `_contact-sheet.jpg`.
- Rewrite `site/content/heroSlides.ts` accordingly: new ids (`marriott`, `luxury`, `resort`),
  `theme: "both"` on all three (Razim: "use that in both theme sites"), `source: "triplet"`,
  real intrinsic dimensions from the manifest, and **alt text written by looking at each image**
  (describe the scene — never the treatment). The old interim ids
  (`beachfront-aerial`/`full-service-sunset`/`grand-resort-arrival`) go away; fix every consumer.
- Slide 1 (`01-marriott`) is the LCP image in both themes.
- The files are below the §4.1 ideal canvases (1536–1672px wide vs 3200 ideal), so they will be
  modestly soft above ~1672px viewport width. Razim shipped them knowingly — record it in
  `docs/PLACEHOLDERS.md` as `interim-resolution: re-export same crops at 3200×800 / 2048×896 /
  1600×1200 when convenient`. Never upscale.
- `content/artwork.ts`'s `hero.gold` / `hero.blue` placements are now fully unused — mark them
  retired in that file's comments (do not delete the entries; they document the Revisit-1 era).

### D24 — Hero slideshow: fully automatic, zero visible chrome

- Remove the previous/next chevrons, the dots, the `NN / NN` counter and the visible pause button
  from `site/components/hero/HeroSlideshow.tsx` (the whole visible controls seat, currently marked
  `data-slideshow-controls`).
- Keep: ~7s autoplay, the mosaic transition, pause-while-offscreen/tab-hidden/hovered/focused,
  reduced-motion + Save-Data static first slide, and the polite SR status string.
- WCAG 2.2.2 still requires a pause mechanism for auto-updating content. Ship an
  **invisible-until-focused** pause control: a visually-hidden button that becomes visible on
  keyboard focus (the `skip-link` pattern already in `globals.css` is the model), 44px when
  visible, accessible name reflecting state. Hover-pause covers pointer users; this covers
  keyboard users. No visible chrome otherwise.

### D25 — Hero fills exactly one screen; text spans the stage; chips get bigger

- The hero panel (art band + headline row + brand rail, under the nav) must land **exactly** on one
  usable screen (`100svh − nav − ticker`) at 1440×900 and 1920×1080 — Razim's screenshot shows the
  brand rail spilling under the fold. The art band keeps its declared ratios (4:1 desktop); the
  headline row and rail are the flexible rows. Measure, don't eyeball.
- The headline/action row must span the full `stage-shell` width like every other section —
  in the review screenshot the copy sits in a centred column with huge side margins. Proposition
  dominant left, supporting line + CTAs right (§5.1 anatomy), no `max-w-*` throttle on the row
  itself (prose measure applies to the sub line only).
- Brand chips: raise `CHIP_HEIGHT_CLASS` in `site/components/sections/BrandsSection.tsx`
  (line ~115) from `clamp(2.625rem, 2.3rem + 1.9vw, 4rem)` to
  **`clamp(3rem, 2.5rem + 2.6vw, 5rem)`** (≈48px mobile → 80px wide desktop). The rail stays on a
  light band in both themes (baked chip shadows — measured constraint, do not revisit). Verify the
  taller rail still fits inside the one-screen hero budget; the art band absorbs the difference.

### D26 — Menu overlay: lockup centred and LARGE; close top-right; no photo panel

Razim: "instead [of the Holiday Inn photo] have the brand logo in the middle big enough the content
inside the logo is visible, remove the current logo placement in top right, and have the close
button in top right."

- The left art panel (currently the `menuArt` photo) is replaced by a **quiet brand panel**: the
  theme-matched lockup, centred, rendered large enough that the baked "KW COMMERCIAL / THE HOKUTEN
  GROUP" lettering is comfortably legible — target ≈ 260–320px tall on desktop. Panel surface:
  theme surface (`surface-paper` chrome works in both themes; `<KanjiAccent />` allowed, one max).
- **Asset prerequisite:** the existing `/brand/lockup-*.png` derivatives are only 132px tall
  (prepared for a 44px nav render) and will look soft at 300px. Extend
  `site/scripts/identity-prep.ts` to also emit a large derivative from the `Ref/site/` masters
  (`logo-blue.PNG` 1254×1254, `logo-yellow.jpg` 917×758): `lockup-gold-xl.png` + `.avif` and
  `lockup-blue-xl.png` + `.avif` at ~640px tall (2× a 320px render). Run it. Register the new
  paths in `site/lib/theme.ts` (`lockupXl`) beside the existing `lockup` entries.
- Remove the lockup from the nav panel's top-right row in `site/components/nav/MenuOverlay.tsx`;
  the close button moves to the overlay's **top-right corner** (44px+ target, unchanged label and
  Radix semantics).
- Keep: full-bleed `fixed inset-0` geometry, the two-column 01–09 index, bottom utilities row, the
  focus trap / pendingFocusRef / scroll-lock machinery, `scrollHeight === clientHeight` at normal
  viewports, and the visually-hidden real-text brand line (the name must exist as text — the baked
  lettering being legible does not replace it).
- Mobile: single dark panel; the wide art band is likewise replaced by a compact centred lockup
  band. `site/content/menuArt.ts` and `menu-prep.ts` stay in the repo (Razim may want a photo
  later) but nothing renders from them — note that in both files' headers and in PLACEHOLDERS.
- The `data-nav-sentinel` / underlying-scroll-position contracts are untouched.

### D27 — Trust Metrics: fill the screen; add the CoStar verification link

- The panel has "a lot of empty spaces". Redistribute so the three tiers genuinely fill the usable
  screen at 1440×900: scale the stat numerals up a step, widen the award rasters toward the top of
  their D12 clamp ranges (annual ≈ 112px rendered, quarterly ≈ 84px on wide desktop), and use the
  larger `lockupXl` derivative for the identity anchor. Whitespace lives INSIDE the composition —
  no blank lower field. It must still fit one screen; if it fits, it is done.
- **Add the verification link** beneath the evidence rows, in the mono micro voice:
  `Verify at costarpowerbrokers.com →` linking to `https://www.costarpowerbrokers.com/`
  (`target="_blank"` `rel="noopener noreferrer"`, spoken new-tab warning, 44px target). The badge
  images themselves stay non-linking (D12 unchanged); this one text link is the legitimacy pointer
  Razim asked for. It is a source pointer, not a new claim — no new register row needed; add a
  dated note to the five CoStar rows in skill ref 06 naming the link as the public verification
  source.

### D28 — No internal scrolling anywhere; Method must genuinely fit

- Grep-verify no section carries `scroll-well` / `overflow-y-auto` / a fixed content height
  (calculator gate from D14 now applies to EVERY section).
- Re-measure all twelve panels headlessly (§6). Method was 1234px pre-fit-wave and Razim still
  flagged it: if it exceeds one screen after the fit wave, recompose harder per §5.6 (artwork and
  process steps side-by-side, tighter stepper) until it fits 784px at 1440×900 without losing a
  string. Same standard for any other panel still over budget (listings was the worst offender).
  Truthful overflow (expanded FAQ answers) grows the page — that stays legal; resting states fit.

### D29 — Horizontal overflow is a hard release gate

"There should never be a horizontal scrollbar anywhere."

- After all other work: headless-verify `document.documentElement.scrollWidth ===
  document.documentElement.clientWidth` at 375, 768, 1440, 1920 and 2560 wide, in BOTH themes.
  Fix any offender at its source (unclipped absolute element, probe, `w-max` track, negative
  margin) — do not mask real bugs.
- THEN add the insurance: `overflow-x: clip;` on `html` in `site/app/globals.css` §5 base layer
  (with a comment: `clip`, never `hidden`, so no scroll container is created and position: sticky
  keeps working). This guarantees Razim never sees a horizontal scrollbar even if a future
  regression slips through.

## 2. Execution order

1. **Baseline** — `npx tsc --noEmit --incremental false` + `npx vitest run` on the inherited tree;
   fix nothing yet, just record. Then D22 (snap removal) — it de-risks everything after it.
2. **Assets** — hero-prep with the three triplets (D23); identity-prep XL lockups (D26). Verify
   contact sheets by eye.
3. **Components** — D24 slideshow chrome, D25 hero fit + stage-width text + chips, D26 menu,
   D27 trust. Parallelisable across agents if you orchestrate; file ownership as split above.
4. **Fit + overflow** — D28/D29 measured passes; iterate until green.
5. **Docs** — dated D22–D29 supersessions in skill refs 03/04/05/07 (and the ref-06 note from
   D27); refresh `docs/PLACEHOLDERS.md` (hero resolution note, menu-art parked) and
   `docs/RESUME.md`; append `docs/design/AUDIT_LOG.md`.
6. **Ship** — dated PROJECT-MEMORY entry (newest-first, this review's decisions + measured
   results), commit, push.

## 3. Verification before push

- Build green; `tsc` clean; vitest 128/128 (calculator parity untouched by all of this).
- QA greps: no `scroll-well`/section `overflow-y-auto`; no `& INDEPENDENTS`; no CoStar asset
  outside Trust; exactly one KW footer compliance mark; no production path into `Ref/`; no
  `Hakuten`; no snap CSS or `PagedMode` references left; no visible slideshow chrome markup.
- One transient headless pass (production build, both themes): the §6-style panel measurement
  (all twelve ≤ 1 screen resting at 1440×900), the D29 overflow gate at five widths, and one
  screenshot per theme at 1440×900 saved to the scratchpad for the record. **Kill the server
  immediately after.** No other local review.
- D7 budgets still hold (route was 316.8KB gz; removing slideshow chrome and PagedMode only helps).

## 4. Push protocol (unchanged law — repeat because it is easy to get wrong)

- Dated PROJECT-MEMORY.md entry BEFORE the push. Newest first.
- Commits authored as rawzm. **No Co-Authored-By, no AI attribution trailers — ever.**
- Push `main`, then fast-forward `theme-blue` to the same commit (zero code diff between themes)
  and push it. Never CLI-deploy; GitHub → Vercel auto-deploys both.
- After pushing, confirm both URLs return 200 with the right `data-theme` (curl only):
  production `hokuten.vercel.app` (gold) · preview `hokuten-git-theme-blue-hokuten1.vercel.app`
  (blue). Razim takes review from there.
