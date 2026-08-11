# DESIGN REVISIT 2 — FULL-VIEWPORT EXPERIENCE

**Addressed to: the implementing agent.** Razim reviewed the current landing page on 2026-08-10 and issued a second, screenshot-led design revisit covering the viewport system, hero, proof, deal tickets, calculator, loader, menu, identity, ticker, hierarchy, and mobile behavior. This document is the complete, pre-resolved execution order.

**Status:** `approved` (Razim, 2026-08-10, written direction with annotated screenshots) · **Base:** [DESIGN-REVISIT.md](DESIGN-REVISIT.md), which remains binding wherever this brief is silent · **Scope:** landing route only · **Companions:** [PHASE-1-IMPLEMENTATION.md](PHASE-1-IMPLEMENTATION.md), [PROJECT-MEMORY.md](../PROJECT-MEMORY.md), and `.agents/skills/hokuten-design-director/`

**Kickoff for the executor:** *“Read `docs/DESIGN-REVISIT-2.md` end to end, complete W0, and execute the waves in dependency order. Do not reopen the decisions below unless implementation evidence exposes a real blocker.”*

---

## 0. Outcome and authority

The finished landing page reads as twelve deliberate screens:

1. Hero, including its franchise-brand rail
2. Trust metrics
3. `01 — Track record`
4. `02 — Hotels for sale`
5. `03 — Valuation`
6. `04 — Method`
7. `05 — Doors`
8. `06 — Mandates`
9. `07 — Team`
10. `08 — FAQ`
11. `09 — Request a written BOV`
12. Footer

On an adequately sized desktop, each boundary settles like a page. On mobile, touch devices, short viewports, 200% zoom, and reduced-motion configurations, the same content remains a normal, naturally scrolling document. The requested experience is a page rhythm, not a wheel trap.

This brief explicitly supersedes the following Design Revisit 1 decisions:

- D3’s split CoStar placement: **all five CoStar awards now belong in Trust Metrics** and nowhere else.
- D5’s single static hero image: the hero becomes an art-directed slideshow with one restrained mosaic transition.
- D5’s glyph-mosaic-only menu panel: the menu may use a supplied full-color real hotel photograph or approved full-color Hokuten glyph artwork; it may not use stock imagery or a CSS grayscale treatment.
- D6’s “fit-to-viewport but free scrolling” desktop behavior: qualifying desktops now use native scroll snap, with the safety exceptions specified in §3.
- D6’s calculator `scroll-well`: **the valuation section has no internal section scrollbar**.
- D4’s sold-card rule that kept imagery muted on hover: sold photography is grayscale at rest and reveals full color on hover, keyboard focus, and the existing touch-reveal action.
- The earlier reference-digest rule “no preloader ever”: Razim has explicitly requested a short, branded first-visit/hard-refresh loader.

Everything else remains law: spelling, theme tokens, the theme-matched header lockup plus real text, exactly one footer compliance mark, evidence-gated claims, frozen calculator math/defaults/`CONFIG`, byte-exact disclosure and TCPA copy, no stock photography, no public deploy before the paperwork gate, and no direct production imports from `Ref/`.

There are no open design questions in this work order. Missing replacement images do not block chassis work: the current approved art remains the interim source until Razim drops new, manifest-listed crops.

## 1. What is wrong now — implementation evidence

| Finding | Evidence in the current build | Root cause | Required correction |
|---|---|---|---|
| The wide browser is used like a narrow center column. | Annotated hero and Trust screenshots; `site/app/globals.css` fixes `.container-hk` to `--container: 1200px` and `.container-wide` to `1440px`. | Section grids inherit editorial text widths instead of a viewport-scale stage. | Add a max-width-free stage shell with fluid gutters; constrain prose locally, not the entire composition. |
| The hero crop changes unpredictably. | `Hero.tsx` renders a flexible-height band with `Image fill` + `object-cover`; the current wide source and the rendered box do not share a stable ratio. | The art band absorbs leftover height, so its aspect ratio changes with viewport and headline wrapping. | Give each breakpoint a declared display ratio and an art-directed crop with the same ratio. |
| The brand rail is visually small and ends with unwanted copy. | `BrandsSection.tsx` renders chips at 36/52px and appends `INDEPENDENTS_MARK`. | The previous pass optimized for a compact first viewport. | Increase optical chip size and remove the independent mark completely. |
| Trust Metrics feels sparse rather than proven. | Current screenshot leaves a large empty lower field; quarterly and annual awards are split across two sections and mounted in bordered “seats.” | Proof is fragmented and the evidence assets are visually minimized. | Consolidate the verified metrics, theme lockup, and all five official award rasters into one evidence wall with no badge frames. |
| Track Record still reads as a normal card grid. | The shared `Ticket` has notches and a shadow, but vertical cards, modest prices, and subtle structure dominate the read. | Ticket anatomy was added to an existing card proportion rather than made the layout concept. | Recompose both deal grids as landscape premium tickets on desktop, with a real stub/seam hierarchy and major green price. |
| Valuation contains a scrollbar inside the section. | `Calculator.tsx` applies `lg:scroll-well`, `max-h-[56svh]`, and internal overflow to the result. | Three steps leave too much result content in one panel. | Use five steps and split estimate from strategy; let exceptional short/zoomed layouts grow the document, never a section well. |
| The market-reference card is visually disconnected. | `ContextRail.tsx` is a plain bordered data surface with no selected-option image. | It predates the shared ticket system. | Rebuild it as the compact ticket variant and map its image/data to the selected property type. |
| The menu shows a normal scrollbar and an inset modal edge. | `MenuOverlay.tsx` uses `overflow-y-auto`; the screenshot shows outer gaps and a tall single-column index. | Nine large rows plus utilities exceed the panel, and generic dialog geometry still leaks through. | True `fixed inset-0` full bleed; two-column desktop index; no overflow at standard sizes; accessible short-height fallback only. |
| The ticker’s LIVE label moves and the loop eventually exposes a gap or appears stopped. | `TickerClient.tsx` places `TICKER_LEAD` inside the moving half; the generic marquee assumes one item set is wider than the viewport and pauses through generic focus rules. | On very wide screens one half can be shorter than the rail; the seam becomes visible. | Keep LIVE fixed, size the repeated half from measurements, and expose an explicit pause control. |
| Typography is tasteful but too even. | The screenshots show similar visual weight across headlines, card values, supporting copy, and labels. | Too many elements rely on the same mid-size/regular treatment. | Establish a four-level hierarchy per section and let display, body, data, and micro voices do distinct jobs. |

The route order in `site/app/page.tsx` is already correct: hero + Trust + nine numbered sections + footer. Do not invent, remove, or renumber a section.

### Request coverage map

| Razim’s request | Locked response in this brief |
|---|---|
| 1 — Use the full screen; larger bottom brands; no independents; hero slideshow and crop size | D9, D11, D21; §§4.1 and 5.1 |
| 2 — Remove dead space; authentic Trust proof; awards in Trust; page-like section scrolling | D10, D12; §§3 and 5.2–5.8 |
| 3 — No valuation scrollbar; add one or two steps | D14 selects exactly two additional steps (five total); §5.5 |
| 4 — Real premium ticket design; green price; SOLD color reveal; CRM later | D13; §§5.3–5.4 |
| 5 — Market Reference matches tickets and shows selected-option imagery | D15; §§4.3 and 5.5 |
| 6 — First-visit/hard-refresh logo loader with progress rail | D16; §6.3 |
| 7 — Full-bleed, scrollbar-free standard menu; logo; color art; crop size | D17; §§4.2 and 6.2 |
| 8 — Brand lockup in Trust and correct footer lockup | D12 and D18; §§5.2 and 5.8 |
| 9 — Larger header lockup using the toolbar height | D18; §6.1 |
| 10 — Fixed LIVE + blinking green dot + endless FRED rail | D19; §6.4 |
| 11 — Stronger typographic hierarchy and responsive finish | D20; all §5 section specs and W6 |

## 2. Pre-resolved decisions

### D9 — The stage is fluid; text measures are local

- Introduce a `stage-shell` utility with `width: 100%`, no global max width, and a fluid inline gutter token.
- Target gutters: approximately 20px on small screens, 32–48px on tablets, and 48–72px on wide desktops. Implement with a tokenized `clamp()`, not per-component numbers.
- Use `stage-shell` for hero copy, Trust, deal grids, calculator, Method, Doors, Mandates, Team, FAQ, BOV, nav, and footer composition.
- Keep readable prose at `60–75ch`, forms at an intentional field measure, and headings at their designed measure inside that stage. “Full width” does not mean 180-character paragraphs.
- Full-bleed image/surface bands touch both viewport edges. Cards and metrics fill the stage rather than stopping at 1200px.
- Retain `container-hk` only for legal/editorial pages or intentionally narrow prose outside this landing route.

### D10 — Desktop paging is native CSS snap, never scroll-jacking

- The home page owns a route-scoped paged mode. Do not apply it to legal routes or future detail pages.
- Qualifying mode: desktop/fine-pointer layout with at least 1024px width and 760px height, with `prefers-reduced-motion: no-preference`.
- In qualifying mode, the scrolling root uses `scroll-snap-type: y mandatory` and `scroll-padding-top` equal to sticky-nav clearance. Every screen in §0 uses `scroll-snap-align: start` and `scroll-snap-stop: always`.
- A screen uses `min-height`, never a fixed `height`; if its truthful content is taller than the available viewport, the document scrolls through it before snapping at the next boundary. No content is clipped to preserve the illusion.
- At 1440×900 and above, Track Record, Listings, Valuation, and the remaining normal-content panels must actually fit without interior scrolling.
- Disable mandatory snap for touch/coarse-pointer devices, viewports below the thresholds, 200% zoom layouts that no longer fit, and reduced-motion mode. Those users get normal flow.
- Remove or gate Lenis on this route while paged mode is active. No wheel/touch listeners, delta thresholds, `preventDefault`, custom scroll queues, or synthetic section jumps are permitted.
- Anchor links, Page Up/Down, Space, keyboard focus, browser find, and history restoration remain native. Explicit anchor movement may be smooth only when motion is allowed.

### D11 — The hero is an art-directed slideshow with one mosaic transition

- The server-rendered first slide remains the LCP image. It is a real `<picture>`/`next/image`, not a canvas snapshot and not hidden until hydration.
- Recommended editorial set: 3 slides; supported maximum: 5. More than 5 weakens the cover and raises bandwidth.
- Autoplay interval: about 7 seconds. Transition: 720–800ms.
- The transition is a deterministic mosaic reveal made from a transient grid of approximately 40 CSS tiles. Tiles resolve in a quiet diagonal/constellation cadence; no glitch noise, chromatic aberration, bounce, or rapid strobe.
- Build with DOM/CSS and the existing motion stack. No WebGL, GSAP, slider package, or return of `AsciiCanvas`.
- Only the transition layer contains tiles, and it unmounts after the transition. The resting hero is one image layer, not dozens of permanent nodes.
- Add previous/next controls, a compact current/total indicator, and directly selectable dots or tabs. Targets are at least 44px. Controls sit on a deliberate high-contrast seat at the art edge.
- Pause autoplay while the hero is offscreen, the tab is hidden, the user hovers/focuses the slideshow, or the user has manually paused it. Resume without resetting the current slide.
- Reduced motion or Save-Data: render the first slide as static; no autoplay and no mosaic. Manual selection may use an instant swap or a simple opacity change.
- Preload only slide 1. Decode/preload slide 2 after the critical path; load later slides just ahead of use.
- Auto-advancing changes are not announced repeatedly to assistive technology. Manual changes update a polite status string.

### D12 — Trust is one proof wall

- Keep the existing verified public numbers; do not inflate the language or add unregistered awards, clients, transactions, rankings, testimonials, or logos.
- Add the theme-matched KW/Hokuten lockup as the identity anchor, with a real-text brand string in the DOM.
- Place all five verified CoStar assets here:
  - Upper evidence tier: `2025 Annual Top Broker` and `2025 Annual Top Firm`, largest.
  - Lower evidence tier: Q3 2025, Q1 2026, and Q2 2026 Quarterly Deals winners.
- Render the official rasters as supplied: no border, white seat, radius, shadow, recolor, crop into the artwork, link, or CSS filter. Transparent whitespace may be trimmed only by the repeatable preparation script.
- Preserve the distinction between the black/gold annual family and blue quarterly family through two rows and micro-labels, not through boxes.
- Remove `RecognitionStrip` from `#closings`. No CoStar award is repeated elsewhere on the landing page.
- Keep sufficient visual separation between the Hokuten lockup and CoStar evidence so the layout does not imply CoStar affiliation or endorsement beyond the registered awards.

### D13 — Listings and closings share a premium physical ticket system

- Desktop ticket orientation becomes landscape: an image zone and content/stub zone separated by a perforated seam with real notches. Mobile/tablet stack into the vertical ticket variant.
- Use a subtle second cardstock layer or offset backing plane plus the existing ink-tinted resting shadow to provide dimension. The card never “floats upward” on hover.
- Price is the dominant data moment: IBM Plex Mono, tabular figures, semibold, `text-money`, bound to the approved financial-positive token. It must be visibly larger than terms/keys/cap rate.
- Keep a four-level card hierarchy: micro serial/status; serif property title; large mono price; body/meta and compact mono facts. Do not add decorative type sizes.
- A restrained serial such as `RECORD 01` or `OFFERING 02` may be derived from the real array index. Do not invent deal IDs, ticket numbers, seats, gates, barcodes, QR codes, “admit one,” or airline/event facts.
- Keep price, keys, cap rate, LP/SP, and days formatted from existing source helpers/content. Missing data is omitted or retains the already-approved “Confidential” behavior; never write `N/A` or fabricate a value.
- Closing/SOLD tickets: image grayscale at rest, full source color on hover, `:focus-within`, and the current touch-reveal action. The SOLD overprint remains visible in both states and no information exists only in the color reveal.
- Listing tickets: full color when a CRM photo exists. Until CRM integration, use the approved glyph-art placeholder/interface; never use a fake property photo. Preserve the trusted Crexi URL boundary and mail fallback.
- Desktop Track Record uses a 3×2 grid; Hotels for Sale uses a centered 3+2 composition. At widths that cannot support a readable landscape ticket, reduce columns before reducing type.
- Establish a stable listing-media adapter now so the future CRM photo changes data, not component anatomy.

### D14 — Valuation becomes five steps; math remains frozen

The new step sequence is:

1. **Asset** — property type, room count, brand affiliation, condition.
2. **Market** — market tier, ZIP/city selection, ground-lease status, F&B operation.
3. **Performance** — occupancy, ADR, RevPAR, optional NOI override, market-typical helpers and their existing explanation behavior.
4. **Estimate** — value range, primary benchmark visualization, “how we got there,” and live-rate footnote.
5. **Strategy** — “what this means,” “what happens next,” written-BOV/email action, disclaimers, and start over.

Rules:

- This is an information-architecture change only. Calculator formulas, constants, defaults, autofill/backfill, caps, validation, popovers, insights, result wording, disclaimers, and rate inputs remain byte/behavior identical unless this brief explicitly changes their placement.
- The section contains no `scroll-well`, fixed result height, masked overflow, nested scrollbar, or sticky subpanel.
- At normal desktop sizes, each active step and the market-reference ticket fit inside the section’s panel. At short height/zoom, the section grows and the document scrolls naturally.
- Stepper shows `STEP X OF 5`. Backward navigation is always allowed; forward jumping is allowed only when prerequisite fields are valid. Moving steps places focus at the new step heading without scrolling it under the nav.
- The right rail remains in the same grid slot on every step, so the page does not jump.

### D15 — Market Reference is the compact ticket variant

- Rebuild `ContextRail` on the same visual primitives as the listing/closing ticket: backing plane, resting shadow, perforation/notches, micro labels, structured mono values, and an image header.
- The image maps to the selected property type. A later, more specific verified selection may update it, but the property-type image is the guaranteed baseline.
- Use only real approved artwork/photography from the typed manifest. Where a type lacks a supplied image, retain the designed glyph-art fallback and a tracked placeholder; never fill the gap with stock or generated photography.
- The photo’s alt names the depicted hotel/property type, not the mosaic technique.
- Selected assumptions, low/typical/high bands, and cap-band content update in place without changing the card’s external dimensions.
- Green is reserved for currency/financial-positive values. Occupancy, cap-rate, and reference labels stay in the normal data/brand palette.
- Desktop reference-photo source target: 3:2, 1600×1067 ideal, 1200×800 minimum. Existing approved art may be cropped through the asset pipeline until dedicated files arrive.

### D16 — The loader is brief, branded, and conditional

- Show on the first visit in a browser session and on a real reload/hard refresh.
- Do not show on soft in-page navigation, anchor movement, back/forward cache restoration, or every section snap.
- Prevent a flash of underlying content with a tiny before-hydration state flag. The loader must always release body scroll in success, timeout, and error paths.
- Use the correct theme lockup: gold lockup for Theme G, blue lockup for Theme B. The real-text brand name remains available to assistive technology.
- Composition: one centered lockup, a thin progress track below, quiet theme surface, no percent number, no Apple logo/UI copying, no taglines competing with the mark.
- Progress reflects readiness milestones where available: fonts ready and first hero image decoded. It may ease through an indeterminate middle but cannot pretend to expose an exact network percentage.
- Target duration: minimum about 550–650ms so it reads intentionally; normal completion under 1.4s; hard cap 2s; exit around 300ms. The loader may never push LCP beyond the route gate.
- Reduced motion: no sliding/chasing animation; show a static filled segment and a short opacity exit. Forced-colors keeps a visible outline/track.

### D17 — Menu is a true full-bleed screen

- Dialog surface is `fixed inset-0`, `100dvh`, `100vw`, zero outer margin/padding/border/radius, with no visible sliver of the page at top or left.
- Desktop: full-color image at roughly 40% width, navigation surface at roughly 60%. They are non-overlapping grid children.
- Add the theme-matched lockup at the top-right of the navigation panel. Keep a real-text fallback. Close stays a 44px+ control at the opposite top corner.
- The image renders in full source color with no grayscale filter. It must be real approved hotel imagery or approved Hokuten glyph artwork—never stock.
- Arrange the nine numbered destinations in two columns on standard desktop: 01–05 then 06–09. Keep numbers in a separate mono gutter and labels in serif display. This is what removes the unnecessary normal-case scrollbar.
- Utilities and private-access/contact actions pin to the bottom row. They never overlap the menu index.
- Normal acceptance viewports have `scrollHeight === clientHeight` for the overlay. Short-height, landscape-mobile, and 200%-zoom layouts retain an accessible document/dialog overflow fallback rather than clipping destinations; a system scrollbar in that exceptional mode is preferable to inaccessible content.
- Mobile uses one dark navigation panel with a separate full-color wide art band, one-column links at a responsive display size, logo/close row, and natural fallback overflow only when needed.
- Preserve focus trap, Escape close, close-button semantics, focus restoration, inert background, and body scroll lock.

### D18 — Identity sizing is corrected in all three placements

- Header: increase desktop nav to approximately 72px and render the lockup about 52px high; mobile nav approximately 64px with a 46–48px lockup. Let the mark use the vertical space while keeping an 8–10px safety inset.
- The adjacent real-text brand line may become visually hidden at widths where the lockup and controls would collide; it is never removed from the DOM.
- Trust: use a larger editorial lockup as specified in D12.
- Footer: theme G uses the prepared gold lockup and Theme B uses the prepared blue lockup, with exactly one KW-bearing compliance mark instance. Keep the verbatim disclosure and qualifier. Do not add a second brand image to satisfy this request.

### D19 — LIVE is fixed; the rate rail is mathematically continuous

- Split `TickerClient` into a fixed status block and a clipped moving viewport.
- The status block is the left-most element and reads `LIVE`, with a green status dot. The dot is decorative; the accessible label is “Live market data.”
- Blink is a slow opacity pulse, not a size pulse. In reduced motion it remains steadily green.
- Do not repeat LIVE inside the moving content.
- Measure the moving viewport and one metric-set width with `ResizeObserver`. Repeat the metric set inside each half until one half is wider than the viewport plus one seam gap; duplicate that complete half; animate by exactly one half-width.
- Duration is derived from distance at a stable visual speed, so adding repetitions does not speed the text up. Recalculate on resize and font readiness without snapping visibly.
- Add a compact pause/resume control to satisfy moving-content accessibility. Hover may pause temporarily; keyboard focus alone must not leave the ticker accidentally frozen forever.
- Soak-test for at least ten minutes and through multiple resizes at 1920, 2560, and 3840 widths: no blank rail, pause, jump, or accumulating seam.
- Keep FRED behavior intact: same server-only secret, endpoint, five labels, fallback dashes, validation, and request cadence. This is a rendering repair, not more polling.

### D20 — Hierarchy becomes explicit, not louder everywhere

Use no more than four visible type sizes in a section:

| Level | Voice | Job |
|---|---|---|
| Display | Fraunces 300/500, one italic accent maximum | Hero and section proposition |
| Heading/value | Fraunces for names; IBM Plex Mono semibold for price/stat | Property title, price, primary result, stat |
| Body/data | Inter body; IBM Plex Mono tabular data | Explanation, metadata, metrics, form values |
| Micro | IBM Plex Mono tracked caps | Section indices, labels, evidence families, step state |

- Section headlines get clearer size contrast from supporting copy.
- Price/result numbers use weight, face, color, and whitespace as the emphasis—never all-caps or another decorative font.
- Use Inter 600 selectively for actions and key conclusions. Fraunces never exceeds 500.
- Preserve one italic accent per headline maximum.
- Keep body copy readable and calm; do not shrink explanatory/legal copy to make a page fit.

### D21 — Asset intake is automated but `Ref/` is never a runtime source

Razim may drop crops into the exact folders below. The executor adds a repeatable preparation script and typed manifest. Development/build preparation exports responsive AVIF/WebP/JPEG copies into `site/public/`; components read only the public manifest. No browser route, Next image loader, import, or deployed bundle reads `Ref/` directly.

Unmanifested files are ignored. A missing breakpoint emits a build/prep warning and uses the documented fallback; it never silently changes the crop.

## 3. Responsive panel system

### 3.1 Chassis

- Add a route marker such as `data-page="home"` and a shared `page-panel` class to the twelve screen roots.
- Compute usable screen height from `100svh - nav - ticker`. Continue reserving ticker clearance so content never sits behind it.
- Hero owns the brand rail inside the first panel. Refactor `BrandsMarquee` so it can render as a landmark inside the hero without a second snap target or a brittle hard-coded `--brands-h` subtraction.
- Each panel’s internal grid vertically centers or distributes content within its usable height at qualifying desktop sizes.
- Alternate surfaces intentionally; never add spacer bands between page panels. One boundary rule is enough when adjacent panels share a surface.
- Footer is the twelfth panel on desktop and a natural footer on mobile. Its legal content remains complete and readable.

### 3.2 Fit tiers

| Environment | Behavior |
|---|---|
| ≥1440×900, fine pointer | Mandatory native snap; all standard panels fit one usable screen. |
| 1024–1439 wide or 760–899 high | Native snap may remain, but any truthful tall panel grows and scrolls in the document before the next boundary. |
| <1024 wide, coarse pointer, <760 high, reduced motion, or zoomed reflow | Normal document flow; no mandatory snap and no viewport-height lock. |
| Print | No snap, sticky/fixed chrome, loader, slideshow controls, or clipped overflow. All content prints in source order. |

### 3.3 Anchor and focus behavior

- Every section keeps its current stable ID.
- Anchor activation lands the section heading below the nav, then moves focus using the shared anchor-focus helper.
- Opening/closing the menu does not change the underlying section position.
- Calculator step focus stays within `#calculator`; it does not cause a second page snap.
- Browser history and back/forward restore the natural location; do not force hero on mount.

## 4. Asset delivery specifications

### 4.1 Hero slides — put masters in `Ref/hero/`

Each slide is one numbered triplet:

```text
Ref/hero/01-descriptive-name.desktop.jpg
Ref/hero/01-descriptive-name.tablet.jpg
Ref/hero/01-descriptive-name.mobile.jpg
```

PNG or TIFF masters are also accepted; keep the same suffix convention. Do not bake type, logos, buttons, or gradients into the crop.

| Crop | Exact ideal canvas | Minimum | Display ratio | Composition guidance |
|---|---:|---:|---:|---|
| Desktop | **3200×800px** | 2400×600px | **4:1** | Keep the key building/subject inside the center 70% width and center 80% height; no essential signage or face in the outer 15%. |
| Tablet | **2048×896px** | 1600×700px | **16:7** | Recompose, do not merely center-crop the desktop file; protect the vertical subject and skyline. |
| Mobile | **1600×1200px** | 1200×900px | **4:3** | Keep the key subject inside the center 60% width; assume UI controls occupy a lower corner. |

These ratios are the answer to the current cropping defect. The implemented image box must use the matching ratio at each breakpoint; `object-position` may make small focal adjustments recorded in the manifest, but may not rescue a fundamentally wrong crop.

Manifest row per slide:

- stable ID and numeric order;
- theme eligibility (`gold`, `blue`, or both);
- three public derivatives;
- concise alt text describing the scene;
- focal point only if required;
- status `approved | blocked: missing-crop`.

Preparation requirements:

- Generate responsive AVIF, WebP, and JPEG at sensible intermediate widths.
- Reserve intrinsic dimensions for zero CLS.
- First-slide AVIF budget: approximately 350KB at the largest served size; later slides approximately 250KB each where image detail allows.
- Only slide 1 uses high fetch priority.
- Keep current approved hero art as slide 1 until a complete new triplet exists.

### 4.2 Menu image — put masters in `Ref/menu/`

```text
Ref/menu/menu.desktop.jpg
Ref/menu/menu.mobile.jpg
```

| Crop | Exact ideal canvas | Minimum | Display ratio | Composition guidance |
|---|---:|---:|---:|---|
| Desktop portrait panel | **1800×2400px** | 1200×1600px | **3:4** | Full-color subject centered; keep essential detail out of the top-left 112×112px close-control zone. |
| Mobile art band | **2400×1000px** | 1600×667px | **12:5** | Recompose as a wide band; do not rely on the portrait crop. Keep the subject away from logo/close safe zones. |

The image bleeds to every edge of its grid cell. No border, inset, rounded corner, default dialog padding, monochrome filter, or dark veil is applied unless a small tokenized gradient is needed solely for control contrast.

### 4.3 Calculator reference images

- Reuse approved artwork through `content/artwork.ts` first.
- Dedicated future crops: 1600×1067px (3:2) ideal, 1200×800px minimum, one per property type.
- Store new masters under `Ref/calculator/`; export to `site/public/calculator/`.
- Track missing limited-service/extended-stay or other type-specific assets in `docs/PLACEHOLDERS.md` rather than substituting stock.

## 5. Section specifications

### 5.1 Hero + brand rail — Screen 1

**Job:** Establish category, conviction, visual identity, and brand breadth in one composed cover.

**Desktop composition:**

1. Sticky nav on its own surface.
2. Full-width 4:1 slideshow art band.
3. Wide headline/action row using the stage shell: proposition takes the dominant left zone; supporting line and dual CTAs occupy the right zone.
4. Brand rail inside the same page panel.

**Brand rail changes:**

- Increase chips to approximately 64px optical height on wide desktop, 52–56px on tablet, and 42–44px on mobile.
- Remove `& INDEPENDENTS`/`INDEPENDENTS_MARK` from markup and content ownership; ship only supplied franchise chips.
- Preserve the evidence-gated “flags we transact across” framing and byte-exact trademark disclaimer.
- Maintain a continuous logo loop with enough repetitions to cover ultrawide screens; use the same measured-half principle as the rate ticker.
- Keep the band light in both themes because the supplied chips contain baked light-ground shadows.

**Acceptance:** exact crop at all three breakpoints; no headline/card max-width bottleneck; no control overlap; no horizontal overflow; static usable hero with JavaScript disabled; reduced-motion static slide; first panel ends exactly at the Trust boundary on qualifying desktop.

### 5.2 Trust Metrics — Screen 2

**Job:** Make the brokerage feel proven before the visitor reaches inventory.

**Composition:**

- Top row: `[ TRUST METRICS ]`, existing headline, and a larger theme-matched group lockup.
- Middle row: the four verified numerical facts in an evenly weighted, full-stage rail. Use large Fraunces numerals, mono labels, and controlled detail wrapping.
- Evidence field: Annual pair large and centered; Quarterly trio immediately below. No badge wrappers.
- Use whitespace inside the composition, not as a blank lower half. Vertically distribute the three rows across the usable screen.

**Asset scale target:** Annual badges may grow to roughly 90–112px rendered height on wide desktop; Quarterly badges roughly 64–84px. Use responsive `clamp()` and source-detail checks rather than hard-coding these as universal sizes.

**Acceptance:** all five awards visible without scrolling at 1440×900; no award in Track Record; no frame/border/shadow/rounded seat; correct lockup per theme; all claims correspond to `verified-current` register rows.

### 5.3 `01 — Track record` — Screen 3

**Job:** Turn six selected closings into unmistakable proof tickets.

**Composition:** compact section header above a 3×2 landscape-ticket grid. Remove the recognition strip completely. Use the full stage so the six tickets gain width without forcing tiny content.

**Ticket facts:** property image, SOLD overprint, property name, location/segment/keys/note where present, price, and the exact terms line. Price receives the money treatment; terms stay normal mono.

**Interaction:** grayscale at rest → full color on hover/focus/touch reveal; accent focus/ring; no lift. A closing remains non-linking unless a future evidence-approved destination is added.

**Acceptance:** six tickets fit at 1440×900 without internal or horizontal scroll; every current source string remains; printed tickets remain legible; no CoStar badge remains.

### 5.4 `02 — Hotels for sale` — Screen 4

**Job:** Present live inventory in the same premium system while retaining familiar Crexi scan order.

**Composition:** compact header; first row of three tickets; second row of two centered tickets with the same width as row one. Do not stretch the last two into oversized cards.

**Ticket facts:** status, property name/location/brand/service level, large price if supplied, keys and cap rate if supplied, trusted Crexi action or email fallback.

**Photo contract:** full-color CRM media when available. Today’s missing photos remain an explicit, designed glyph-art state. Add an adapter that can accept the later CRM media URL/alt/focal data without changing `Ticket`.

**Acceptance:** a Crexi user locates status, price, keys/cap when present, and contact route in five seconds; no fabricated number/photo; trusted-link tests remain green.

### 5.5 `03 — Valuation` — Screen 5

**Job:** Turn a dense calculator into a paced five-scene advisory experience.

**Desktop composition:** horizontal five-step stepper at top; active step in a broad left workspace; compact Market Reference ticket in a stable right rail. Controls/action row stays visible without a nested well.

**Mobile composition:** stepper becomes a compact horizontally labeled/numbered progress control; active fields stack; Market Reference renders as a compact ticket after the active fields and before the primary action. It remains present on every step but is not sticky.

**Acceptance:** no internal section scrollbar at any normal target viewport; five-step keyboard flow; no lost fields/popovers/copy; math parity and disclaimer-equality tests unchanged; relevant reference image updates after property type selection; zero layout shift on step change.

### 5.6 `04 — Method` through `08 — FAQ` — Screens 6–10

These sections keep their current information and interaction models. The work is spatial, hierarchical, and responsive:

- Move each to `stage-shell` and give it one purposeful screen composition rather than a narrow column surrounded by dead space.
- Method: balance artwork/process steps across the width; keep the dark chapter and real reach/process facts.
- Doors: enlarge the two audience choices into a true left/right decision screen; mobile stacks naturally.
- Mandates: distribute service mandates as a deliberate grid with one hierarchy, not sparse floating copy.
- Team: use the width for credible role/contact hierarchy while keeping missing portraits visibly provisional; never invent bios/credentials.
- FAQ: two-zone layout with index/context and accordion; expanded answers may make this a truthful tall panel, in which case the document scrolls naturally. Never constrain answers in a well.
- Preserve all current accessibility wiring, section IDs, content ownership, claims status, and placeholder notices.

**Acceptance:** at 1440×900 each default/collapsed state fits one screen; expanding FAQ cannot clip or trap; mobile is normal flow; no new public claim.

### 5.7 `09 — Request a written BOV` — Screen 11

- Keep the existing landscape intent but use the full stage: value proposition/context left, form grid right.
- Preserve every field, validation state, privacy link, TCPA block, consent behavior, success/error state, and canonical copy.
- Legal text is never reduced below its current accessible size to force fit.
- No nested scroll region. A short/zoomed viewport grows the page.

### 5.8 Footer — Screen 12

- Vertically center a composed footer screen on qualifying desktop rather than leaving a tiny band after the last snap.
- Use a wide link/contact grid with a compact legal block and one correct theme lockup.
- Preserve exactly one KW compliance-mark instance and the verbatim disclosure/qualifier.
- Keep ticker clearance. On mobile the footer returns to natural content height.

## 6. Global component work

### 6.1 Nav

- Apply `stage-shell` so the header uses the available width.
- Increase nav/lockup dimensions per D18.
- Keep desktop anchor links and BOV CTA; collapse responsibly before overlap.
- Preserve current active-section tracking and reserved-width technique.
- Confirm the logo never touches top/bottom or forces the CTA/menu trigger out of bounds at 320–390px widths.

### 6.2 Menu overlay

- Replace generic dialog sizing/overflow classes at the overlay boundary; retain dialog semantics/primitives.
- Create explicit top, index, and utility rows so vertical budgeting is deterministic.
- Use the supplied art-direction pair from §4.2.
- Verify no outer gap at device-pixel zooms in Chromium, Safari, and Firefox.

### 6.3 Loader

- Add a small client island plus the minimum pre-hydration state initializer.
- Ensure session/reload detection uses `sessionStorage` and Navigation Timing defensively; storage denial must fail open to the site.
- Hero loads underneath the overlay. Do not delay the image request until loader completion.
- Test cleanup by forcing font/image decode rejection and timer cap.

### 6.4 Ticker and brand marquees

- Extract a shared measured-loop primitive only if it keeps the ticker and brand-specific semantics separate.
- Clones are `aria-hidden` and inert. The accessible DOM announces one logical set.
- Animation starts only after valid dimensions exist; server HTML still contains a readable first set.
- No resting `will-change`; apply it only while animation is active if profiling proves it useful.

### 6.5 Financial-positive color

- Bind the approved `--money-positive` light and on-dark tones in `globals.css`; exact values live only in design reference 01 and that CSS file.
- Expose a semantic `text-money` utility/surface binding.
- Use it for prices and directly monetary primary results only. It is not a generic success green, theme accent, button color, border color, or decorative motif.
- Bind `--live-positive` separately for the ticker dot; do not reuse a bright status dot as body text.
- Re-run contrast in both themes and forced-colors mode.

## 7. Implementation waves and dependencies

### W0 — Governance and baseline (`approved` → `building`)

1. Re-read AGENTS, PROJECT-MEMORY, this brief, Design Revisit 1, and skill refs 01/03/04/05/06/07.
2. Update skill refs 01/03/04/05/07 with dated D9–D21 supersessions so automated audits test the new law. Ref 06 changes only if a claim changes; current award rows are already verified.
3. Update `docs/AGENT-BRIEF.md`, `docs/PLACEHOLDERS.md`, and any stale page-order comments.
4. Capture baseline screenshots and measurements in both themes at 375×812, 768×1024, 1440×900, 1920×1080, and 2560×1440.
5. Record current build/test/bundle numbers before code changes.

**Gate:** no implementation subtask starts against contradictory rules.

### W1 — Foundation chassis

1. Add stage/snap/panel utilities and route scoping.
2. Remove/gate landing-page Lenis in paged mode.
3. Refactor hero/brand ownership into one panel without duplicate landmarks.
4. Convert every section root and footer to the panel/stage contract.
5. Enlarge nav identity and verify anchor/focus behavior.
6. Build financial/live tokens and contrast tests.

**Gate:** an unstyled or minimally restyled page snaps correctly on qualifying desktop, flows normally on mobile/reduced-motion, and has no clipping or nested section scroll.

### W2 — Asset pipeline, hero, Trust

These can proceed in parallel after W1 contracts are stable.

**Asset track**

- Add `hero-prep` and menu-prep tasks, typed manifests, warnings, formats, budgets, and public outputs.
- Intake current assets as fallback; do not wait for new crops.

**Hero track**

- Build server-first slideshow, controls, mosaic tiles, pause logic, visibility gating, preload strategy, and fallbacks.
- Resize brand chips/remove independent text/repair measured loop.

**Trust track**

- Consolidate award components and prepare higher-resolution public derivatives.
- Build proof-wall layout and move annual assets out of Track Record.

**Gate:** hero LCP remains real image; all five awards appear only in Trust; hero/Trust fit at 1440×900; both themes screenshot clean.

### W3 — Navigation overlay, loader, ticker

1. Rebuild full-bleed menu and art direction.
2. Add conditional loader and failure-safe cleanup.
3. Rebuild ticker status/loop/pause control.
4. Soak ticker and test loader condition matrix.

**Gate:** no normal-case menu scrollbar/gap; loader never sticks; ticker loops for ten minutes at ultrawide sizes.

### W4 — Shared ticket system

1. Evolve `Ticket.tsx` into responsive landscape/vertical variants.
2. Implement backing plane, vertical/horizontal perforation, notch geometry, hierarchy, and money style.
3. Update closing/listing cards and grids.
4. Add sold color reveal for pointer, keyboard, and touch.
5. Preserve Crexi trust, source formatting, print, and no-photo behavior.

**Gate:** both sections fit 1440×900, all source values match, no fake ticket data exists, and focus/print states pass.

### W5 — Five-step calculator

Depends on the W4 ticket chassis.

1. Repartition fields/results into D14’s five steps without altering state semantics.
2. Convert ContextRail to the compact ticket and add manifest-based image mapping.
3. Remove result `scroll-well` and every fixed-height/mask dependency.
4. Add focus/step gating and responsive layouts.
5. Run frozen-math parity after every structural change.

**Gate:** all calculator tests green; field/popover/copy audit green; no nested section scrollbar; step/result screenshots in both themes.

### W6 — Remaining panels and hierarchy sweep

1. Recompose Method, Doors, Mandates, Team, FAQ, BOV, and Footer on the stage.
2. Apply D20 hierarchy consistently.
3. Test expanded/validation/success/error states, not only pristine screenshots.
4. Remove dead utility classes/components/imports made obsolete by the rebuild.

### W7 — Adversarial audit and handoff

1. Run the design skill’s audit; fix every P0 and P1 that affects this scope.
2. Run build, typecheck, full test suite, bundle measurement, asset-size check, and QA greps.
3. Screenshot both themes at all mandatory sizes plus one short-height and one ultrawide case.
4. Test keyboard only, screen reader landmarks/names, 200% zoom, reduced motion, Save-Data, forced colors, print, JS disabled first paint, slow network, and reload/back-forward states.
5. Append `docs/design/AUDIT_LOG.md`, refresh PLACEHOLDERS/RESUME, and write the dated PROJECT-MEMORY ship entry before push.

## 8. File-level work map

| Area | Primary files | Notes |
|---|---|---|
| Stage/snap | `site/app/globals.css`, `site/app/page.tsx`, section roots, `SmoothScroll.tsx` | Route-scoped native behavior; no wheel handler. |
| Hero | `site/components/hero/Hero.tsx`, new `HeroSlideshow.tsx`, `site/content/heroSlides.ts`, prep script | Keep first slide server rendered. |
| Brands | `BrandsSection.tsx`, `content/brands.ts`, `Marquee.tsx` | Remove independents; enlarge; measured repeat. |
| Trust/awards | `StatsSection.tsx`, `QuarterlyBanners.tsx`, `RecognitionStrip.tsx` or replacement, award prep | One proof wall; no badge seats. |
| Tickets | `Ticket.tsx`, `ClosingCard.tsx`, `ListingCard.tsx`, both section grids | Shared responsive chassis. |
| Calculator | `Calculator.tsx`, `CalculatorSteps.tsx`, `CalculatorResult.tsx`, `ContextRail.tsx`, related tests | UI repartition only; math frozen. |
| Loader | new `BrandLoader.tsx`, root/layout bootstrap as narrowly needed | Conditional and failure-safe. |
| Menu | `MenuOverlay.tsx`, dialog overrides only where scoped, menu manifest | Full bleed and two-column desktop. |
| Identity | `SiteNav.tsx`, `Wordmark.tsx`, `SiteFooter.tsx`, `theme.ts` | Three placements; footer count stays one. |
| Ticker | `TickerClient.tsx`, `TickerBar.tsx`, `Marquee.tsx` or measured-loop primitive, ticker tests | Fixed LIVE, measured continuous half. |
| Governance | design refs, AGENT-BRIEF, PLACEHOLDERS, AUDIT_LOG, PROJECT-MEMORY | Date every supersession/ship entry. |

## 9. Verification matrix

### 9.1 Visual targets

Capture full panel and full-page evidence in both themes:

- 375×812 and 390×844 mobile;
- 768×1024 tablet;
- 1280×800 short desktop;
- 1440×900 standard desktop;
- 1920×1080 wide desktop;
- 2560×1440 ultrawide.

At minimum, capture hero slides 1 and 2, Trust, one closing rest/hover, one listing, all five calculator steps, menu, loader, ticker, expanded FAQ, BOV validation, and footer.

### 9.2 Functional checks

- Page order is hero → Trust → 01–09 → footer.
- Qualifying desktop settles at each boundary with no gesture interception.
- Mobile/reduced motion uses natural flow.
- Anchor/menu/focus navigation lands below nav and remains reversible.
- Hero controls work with mouse, touch, keyboard, and assistive names.
- Loader matrix: first session yes; reload yes; soft nav no; bfcache/back-forward no; timeout releases.
- Ticker: LIVE fixed; dot green; five metrics retain behavior; two-plus complete cycles and ten-minute soak never expose blank space.
- Calculator: five steps; all original fields; no nested scrollbar; frozen math/defaults unchanged.
- Menu: no normal-case scroll or outer gap; all nine links and utilities reachable; exceptional overflow works.
- Sold images reveal color on hover/focus/touch; listing media adapter handles missing/real photos.

### 9.3 Evidence and content checks

- Exactly five CoStar assets appear, all in Trust, each once.
- No CoStar asset appears in Track Record.
- Trust numbers and award claims remain `verified-current`.
- No `& INDEPENDENTS` visible string or independent-mark node remains.
- Footer contains exactly one KW compliance mark and canonical disclosure/qualifier.
- Calculator disclosures and TCPA strings pass equality/byte checks.
- No new stat, credential, award, testimonial, partner/client implication, or fake ticket datum was added.

### 9.4 Accessibility and motion

- WCAG AA contrast for money green on every used surface; status dot meets non-text contrast.
- Focus order follows visual order; all custom controls have 44px targets.
- No autoplay announcement spam; both slideshow and ticker expose pause behavior.
- Reduced motion disables snap animation, slideshow autoplay/mosaic, blinking, and ornamental reveals without hiding content.
- 200% zoom exposes no clipped menu, calculator, legal copy, or ticket data.
- Print resets snap/fixed/reveal/filter behavior and prints real content.

### 9.5 Performance

- LCP <2.5s, CLS <0.02, INP <200ms on the landing route.
- Critical-path JS ≤200KB gzip and full landing route ≤340KB gzip unless a new dated decision explicitly re-bases the existing D7 gate.
- Loader + slideshow do not delay the first hero request.
- No new trendy/animation library.
- Mosaic nodes exist only during transition; no persistent rAF loop.
- Public image outputs meet budgets; no master from `Ref/` enters a runtime chunk.

### 9.6 QA greps/assertions

- No `scroll-well`/section `overflow-y-auto` in Calculator.
- Menu generic dialog inset/max-width classes do not survive at the overlay root.
- `RecognitionStrip` is not imported by Closings.
- LIVE occurs once in the ticker’s accessible logical row and outside the animated half.
- No production import/path begins with `Ref/`.
- No hard-coded color is added outside reference 01 and `globals.css`.
- No `Hakuten`, Sarhan branding, fake QR/barcode/seat/gate copy, or duplicate KW footer mark.

## 10. Definition of done

This revisit is `shipped` only when:

- D9–D21 are implemented and the governing references carry dated supersessions.
- The twelve-screen order and qualifying-desktop snap experience work without wheel interception.
- New asset drops can be prepared from the documented folders without a component refactor, while production remains isolated from `Ref/`.
- Hero, Trust, two ticket grids, five-step calculator, loader, menu, ticker, identity placements, hierarchy, remaining panels, and mobile fallbacks all meet their acceptance checks.
- All tests/build/typecheck/performance gates pass; the design audit has no P0; screenshot evidence exists in both themes; QA greps are clean.
- PROJECT-MEMORY, AUDIT_LOG, PLACEHOLDERS, and RESUME are current before push.
- No public deploy is performed until the existing KW / Forward Wilshire paperwork gate is cleared.
