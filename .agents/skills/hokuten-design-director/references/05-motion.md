# 05 — Motion

## Table Of Contents
Doctrine · Tokens · Reveals · ASCII hero (retired) · Hero slideshow · Loader · Ticker · Hovers · Smooth scroll / scroll snap · Performance gates

## Doctrine

Motion signals weight, not spectacle. Slow-and-few reads expensive; busy reads cheap.
Animate only `transform`, `opacity`, `filter`, `clip-path`. Never layout properties.
Entrance reveals fire once per element per page load.
No bounce/overshoot easing anywhere — this is a finance/trust surface.
Every effect has a designed `prefers-reduced-motion` state (static, not missing).
One signature effect per viewport; the supplied 「北天」 glyph-mosaic artwork is now the site's signature (D5, 2026-08-08 — supersedes the ASCII hero canvas; see §ASCII hero below, retired).

**D11 (2026-08-10) — the signature is now a small slideshow, still one system.** The hero art rotating through 3–5 slides with one mosaic-tile transition (§Hero slideshow below) still counts as the page's *one* signature effect, not two — the transition is the single motion system; the slides themselves are static content, same as the retired rule's single frame was. Do not read D11 as licence to add a second effect to the hero viewport.

**D10 (2026-08-10) clarification — native scroll snap is not exempted from, nor does it violate, the no-scroll-jacking law.** It is the browser's own `scroll-snap-type` mechanism: no wheel/touch listener, no delta threshold, no `preventDefault`, no synthetic jump, no custom scroll queue. Full mechanism: [03-visual-system.md](03-visual-system.md) → "Native paging supersedes free scroll on qualifying desktop."

## Tokens (implementation of record: `site/lib/motion.ts`)

| Token | Value | Use |
|---|---|---|
| `DUR.fast` | 150ms | Hovers, focus rings, badge states |
| `DUR.base` | 300ms | UI transitions, accordion, modal shake |
| `DUR.reveal` | 600ms | Section entrance reveals |
| `DUR.slow` | 900ms | Hero art settle only |
| `EASE.out` | cubic-bezier(0.22, 1, 0.36, 1) | Reveals, most things |
| `EASE.inOut` | cubic-bezier(0.65, 0, 0.35, 1) | Overlay open/close, cross-fades |
| `STAGGER` | 70ms | Card grids, stepper items, max 6 children |

Library: `motion/react-m` via `LazyMotion` + `domAnimation` for component reveals — **not** the full `motion/react` import (D7, 2026-08-08: mandatory, not optional; the full import ships the unused drag/layout feature set for ~17KB gzip nothing on this page uses, and `domAnimation` covers every reveal/hover/transition token below). CSS keyframes for the ticker marquee. No GSAP unless a Phase 3 need proves it. (The hero canvas's raw rAF loop is retired — see §ASCII hero below, D5.)

## Reveals

Pattern: opacity 0→1 + translateY 16px→0, `DUR.reveal`, `EASE.out`, triggered at 20% viewport intersection, once.
Stat numerals may count up (mono-stable, 800ms, from 60% of value — never from 0) but must render final values server-side first — the Sarhan "$0 B+" failure is the anti-pattern: JS-off must show real numbers.
Headline italic accent word may ink-in via clip-path once, hero only.

## ASCII hero (signature effect) — RETIRED FROM THE PAGE (D5, 2026-08-08)

The canvas/shimmer/morph-loop system in this section no longer ships on any route — it's superseded by Razim-supplied 「北天」 glyph-mosaic artwork, a static optimized image (ref 03 §Imagery). The spec below stays as a historical record, and because the generator script (`site/scripts/ascii-gen.ts`) and its JSON assets remain in the repo, uninvested — nothing here is deleted, but nothing here should be built against or referenced as current behavior. The retirement is also a JS-budget win: see §Performance gates below (D7 bonus).

Asset: character grid pre-generated at build time from a B&W hotel photograph (script in `site/scripts/ascii-gen.ts`) — never computed client-side from the image.
Charset ramp (dark→light): `HOKUTEN` letters + `北天ホクテン` + digits + `・.:-=+*#` mapped by luminance; seam row resolves into `THE HOKUTEN GROUP`.
Render: single `<canvas>`, drawn once; DPR-capped at 2; `aria-hidden` with an adjacent visually-hidden description; static `<img>` fallback (same frame) via `<noscript>` and for reduced-motion/touch/small viewports.
Interaction (pointer devices only): pointer-proximity glyph shimmer — within a 120px radius, characters swap one luminance step and gold-tint at 20% probability; decays over 400ms.
Budget: rAF loop runs only while pointer is over the canvas AND canvas is in viewport (IntersectionObserver-gated); dirty-rectangle redraws only (never full-canvas per frame); target ≤4ms script per frame; zero allocations in the loop (pre-allocated glyph buffers).
Kill switch: if frame time exceeds 12ms for 30 consecutive frames, freeze to static and stop the loop for the session.

## Ambient art loop (the "gif" — Coronal pattern, both themes) — RETIRED FROM THE PAGE (D5, 2026-08-08)

Same status as §ASCII hero above: this frame-sequence morph system does not ship. Kept as historical record only.

The hero art may morph slowly like the Coronal reference: a pre-rendered frame sequence (24–36 frames, ≤12s loop, ≤24fps), generated by `ascii-gen.ts` as glyph-grid keyframes with interpolated dissolves — never computed live.
Delivery: canvas playback of pre-loaded glyph frames (preferred — shares the hero canvas + shimmer layer) or a muted looping `<video>` (WebM+H264, `playsinline`, no audio) if canvas playback can't hold 60fps chrome.
Budget: playback only in-viewport; paused off-screen; static first frame on mobile, reduced-motion, and data-saver; loop file/frames ≤1.5MB total.
The loop is ambient — no content meaning; chrome and copy never move with it. Counts as the hero's one signature effect (shimmer + loop = one system, not two).

## Hero slideshow (signature effect, current) — new 2026-08-10 (D11, Design Revisit 2)

Replaces both retired systems above as the hero's actual shipping motion. Full placement context: [04-page-anatomy.md](04-page-anatomy.md) → `#hero` row 2.

- **Slide count:** 3 recommended, 5 supported maximum. More than 5 weakens the cover and raises bandwidth — do not build past the cap even if more art arrives.
- **Autoplay:** ~7s interval per slide.
- **Transition:** a deterministic **mosaic reveal** — a transient grid of **~40 CSS tiles**, resolving in a quiet diagonal/constellation cadence, **720–800ms** total. No glitch noise, chromatic aberration, bounce, or rapid strobe — this is still a finance/trust surface, the doctrine above is unchanged. The tile layer exists only during the transition and **unmounts immediately after** — the resting hero is one image layer, not a permanent grid of nodes. Build with DOM/CSS and the existing motion stack (`motion/react-m` + `LazyMotion`/`domAnimation`, per ref 05 §Tokens) — no WebGL, no GSAP, no slider package, and specifically **no return of `AsciiCanvas`**.
- **Controls:** previous/next, a compact current/total indicator, directly selectable dots/tabs — all ≥44px targets, seated on a deliberate high-contrast plinth at the art's edge (never floating with no seat).
- **Pause conditions:** the hero is offscreen, the tab is hidden, the user hovers or focuses the slideshow, or the user has manually paused it. Resume never resets the current slide.
- **Reduced motion / Save-Data:** slide 1 renders static; no autoplay, no mosaic. Manual slide selection may use an instant swap or a simple opacity cross-fade instead of the tile transition.
- **Loading:** only slide 1 preloads (it is the LCP element, `priority`, real `next/image`/`<picture>` — never a canvas snapshot, never hidden pending hydration). Slide 2 decodes after the critical path; later slides load just ahead of use.
- **Announcements:** auto-advancing changes are **not** announced repeatedly to assistive technology (that would be a live-region spam anti-pattern). A manual change (clicking a control) updates one polite status string once.
- **Performance:** the mosaic tile nodes exist only for the ~750ms transition window — no persistent `rAF` loop, no resting compositor layer once the transition ends. This is the D11-era equivalent of the retired ASCII canvas's frame budget discipline below, at a fraction of the cost.

## Loader — new 2026-08-10 (D16, Design Revisit 2)

Full placement/behavior spec: [04-page-anatomy.md](04-page-anatomy.md) → Loader. Motion-specific detail only, here:

- **Duration:** minimum ~550–650ms (reads as intentional, not a flicker), normal completion under 1.4s, **hard cap 2s** (release unconditionally, success or not), exit transition ~300ms.
- **Progress motion:** eases through an indeterminate middle when real readiness signals (fonts, first hero image decode) are the only inputs — it may never fabricate an exact percentage readout as if it were tracking real network bytes.
- **Reduced motion:** no sliding/chasing bar animation — show a static filled segment, and let only the exit use a short opacity change.
- **Forced colors:** keep a visible outline/track (the loader must not disappear into the canvas under forced-colors mode).
- **Never blocks the LCP gate:** the loader's own presence must not push the route's hero image request or its LCP timing past the site's standing budget (§Performance gates below) — it wraps the existing load, it does not sit in front of it.

## Ticker (`#ticker`, fixed bottom) — LIVE fixed + measured continuous loop, superseded 2026-08-10 (D19, Design Revisit 2)

**Superseded.** The 45s-cycle, single-duplicated-content marquee below (kept for the record) is the source of two live defects Razim's screenshots showed: the `LIVE` label moving inside the animated content, and — on very wide screens — one repeated half occasionally landing shorter than the viewport, exposing a blank seam or reading as "stopped."

**Current spec:**
- **Fixed status block, left-most, outside the animated half.** Reads `LIVE` with a green status dot. The dot is decorative; the accessible label is "Live market data." Blink is a **slow opacity pulse**, never a size pulse; under reduced motion it holds steady green rather than pulsing. `LIVE` occurs exactly **once**, in this fixed block — never repeated inside the moving content.
- **Clipped moving viewport**, everything after the status block. The metric set is measured with `ResizeObserver` — the viewport width and one metric-set's rendered width — and the set repeats inside each "half" until that half is wider than the viewport plus one seam gap; the complete half is then duplicated once (clones `aria-hidden` + inert; the accessible DOM announces one logical set). Animation moves by exactly one half-width, so the loop is seamless regardless of screen width.
- **Duration is derived from distance at a stable visual speed** — adding more repetitions (to cover an ultrawide screen) does not speed the text up. Recalculate on resize and on font-readiness without a visible snap.
- **Pause control:** a compact, always-available pause/resume control (moving-content accessibility requirement, WCAG 2.2.2). Hover may pause temporarily; keyboard focus alone must never leave the ticker accidentally frozen forever — only the explicit control or an intentional hover does that.
- **Soak requirement:** verified for at least ten minutes and across multiple resizes at 1920/2560/3840 widths — no blank rail, no pause-that-doesn't-resume, no jump, no accumulating seam gap over time.
- **FRED data behavior is unchanged:** same server-only secret, same endpoint, five labels, fallback dashes on failure, same validation, same request cadence. This is a rendering repair only, never more polling.
- `will-change: transform` applies only while the animation is actually running, not as a permanent resting declaration (same discipline as `photo-reveal`, ref 03/07).

**Superseded (pre-2026-08-10, kept for the record):** CSS `@keyframes` translateX marquee, content duplicated once for a seamless loop, 45s fixed cycle, `will-change: transform` unconditionally, pauses on hover/focus, disabled under reduced-motion (shows static first N items). Data fetch once on load; failure keeps dash placeholders — the bar never breaks or jumps (reserve its height; zero CLS) — this data-fetch behavior is the one part of the old spec that carries forward unchanged under D19.

## Hovers

Cards: photo grayscale→color (`filter`, `DUR.base`) + 1.02 scale max; never translate cards.
Buttons: background/border shift `DUR.fast`; no size change.
Links: gold underline draw-in `DUR.fast`.
Touch: hover states replaced by the `tapped` toggle class (kwc pattern); no information may be hover-only.

**SOLD tickets rejoin the hover-reveal set — superseded 2026-08-10 (D13, Design Revisit 2, reverses D4).** D4 (2026-08-08) had deliberately exempted closed/SOLD tickets from "grayscale→color on hover" — "the ticket is visually retired… there is nothing left to transact." That exemption is now retired: **SOLD ticket header bands are grayscale at rest and reveal full source color on hover, `:focus-within`, and the existing touch-`tapped` action — identical to every other card.** The `overprint` SOLD stamp stays visible in both states (it never was information gated behind the reveal, and D13 restates that explicitly — ref 03 → Deal-ticket component).

## Smooth scroll / scroll snap

**Superseded 2026-08-10 (D10, Design Revisit 2).** "Lenis on desktop pointer devices only" below is retired specifically **on the landing route** while its route-scoped paged mode is qualifying (ref 03 → "Native paging supersedes free scroll on qualifying desktop"). Lenis is removed or gated off on that route so it cannot fight the browser's own `scroll-snap-type: y mandatory` — the two systems drive the same scroll position and must not both try to own it. Lenis's prior job (a fine-pointer easing feel on desktop) is superseded by the native snap's own settle behavior wherever paged mode qualifies; outside the qualifying tier (touch, <1024×760, reduced motion, zoomed reflow) the page is native scroll exactly as it always was — nothing to gate there, since Lenis never ran on those devices anyway. Legal/editorial routes are untouched by any of this — Lenis's original scope on those pages is unchanged.

Anchor navigation respects `scroll-margin-top: var(--nav-h)` (**D18, 2026-08-10: 72px desktop / 64px mobile**, was 68px/60px under D6, which was itself down from 88px); focus moves to the target section heading (a11y). Explicit anchor movement (a nav link, a CTA routed through `<AnchorLink>`) may still animate smoothly, but only when `prefers-reduced-motion: no-preference` — this is unchanged.

No scroll-jacking, no scroll-linked pinning — unchanged, and explicitly re-confirmed by D10 itself: native `scroll-snap-type` is not scroll-jacking (see Doctrine above). There is no wheel/touch listener, no delta threshold, no `preventDefault`, no synthetic jump, no custom scroll queue anywhere on the landing route, snap or no snap.

**D6 clarification (2026-08-08), narrowed 2026-08-10 (D14):** the paragraph below described the calculator's step-3 density fix as internal native overflow. **That specific caller is retired** — `#calculator` now has five steps and no internal section scrollbar under any circumstance (ref 03/04). The general principle survives for other genuinely exceptional cases (documented: the menu overlay's short-height/200%-zoom accessible fallback, D17): this bans *hijacking* the page's scroll — wheel/touch input redirected to drive something other than native scroll position. It does **not** ban native internal overflow inside a single section where content genuinely exceeds the viewport in one of those documented exceptional cases — that's the `scroll-well` utility (ref 03 §Spacing & layout): ordinary `overflow-y: auto`, keyboard-reachable, `overscroll-behavior: contain`, with a mask-fade as the visible affordance that more content follows. The page's own scroll position is never touched; only that one well scrolls itself.

## Performance gates (fail the build if violated)

- 60fps during scroll and hero interaction on a mid-tier device (4× CPU throttle in DevTools as proxy).
- **LCP < 2.5s, CLS < 0.02, INP < 200ms on Vercel preview (mobile) — unchanged by D7.**
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95.

**D7 (2026-08-08) — JS budget re-based.** The old single figure — landing route ≤180KB gzip — is retired: it was measured unreachable. Actual first-load was **272KB gzip against a 129KB gzip framework floor** (Next.js + React + the unavoidable runtime beneath it), so 180KB was never achievable without cutting something load-bearing. Replaced with two numbers:
  - **Critical-path JS ≤ 200KB gzip** — hero + nav + stats-interactive only: what has to run before the visitor can read and act on the first viewport.
  - **Full landing-route JS ≤ 340KB gzip** — everything the route ships, including code that arrives later via dynamic import.

  Two mechanisms are **mandatory**, not optional, to hit these:
  1. `LazyMotion` + `domAnimation`, importing `motion/react-m` instead of `motion/react` everywhere reveals/hovers/transitions are built (§Tokens above) — drops ~17KB gzip by excluding the drag/layout feature set nothing on this page uses.
  2. **Dynamic imports** for `Calculator`, the BOV form, `MenuOverlay`, and `ConsentModal` — none of the four belong on the hero's critical path; they load on interaction or route-need, not on first paint.

  **D7 bonus:** retiring the ASCII canvas + its JSON (§ASCII hero, D5) removes ~200KB gzip of asset fetch plus the playback JS from the hero path entirely. Recount actual budgets against the two numbers above once the supplied-artwork swap lands, and record the new measured figure here.
- Calendly/intl-tel-input/us-cities lazy-load on interaction only (unchanged).
- Fonts: ≤2 files per family, `display: swap`, subset; no CDN font requests.
- No `useEffect`-driven layout thrash; measure once, animate transforms.

**New gates, 2026-08-10 (Design Revisit 2):**
- Hero slide 1 stays the real LCP element (`next/image`, `priority`, real `<picture>`/`<img>`) on every route load — a loader or a slideshow controller sitting in front of that request, delaying its decode, or substituting a canvas/placeholder is a P0 (ref 07).
- Mosaic-transition tile nodes exist only for the ~750ms transition window; no persistent `requestAnimationFrame` loop and no resting compositor layer from the hero slideshow once a transition completes.
- The loader's hard 2s cap is unconditional — success, timeout, or error path all release it; it may never contribute to the route's measured LCP beyond that cap.
- The ticker's continuous-loop `ResizeObserver` measurement work happens once per resize/font-ready event, not on a polling interval — recomputing on every animation frame is a performance-gate violation, not just a style preference.
