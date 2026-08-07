# 05 — Motion

## Table Of Contents
Doctrine · Tokens · Reveals · ASCII hero · Ticker · Hovers · Smooth scroll · Performance gates

## Doctrine

Motion signals weight, not spectacle. Slow-and-few reads expensive; busy reads cheap.
Animate only `transform`, `opacity`, `filter`, `clip-path`. Never layout properties.
Entrance reveals fire once per element per page load.
No bounce/overshoot easing anywhere — this is a finance/trust surface.
Every effect has a designed `prefers-reduced-motion` state (static, not missing).
One signature effect per viewport; the ASCII hero is the site's signature.

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

Library: `motion/react` for component reveals; raw rAF for the hero canvas; CSS keyframes for the ticker marquee. No GSAP unless a Phase 3 need proves it.

## Reveals

Pattern: opacity 0→1 + translateY 16px→0, `DUR.reveal`, `EASE.out`, triggered at 20% viewport intersection, once.
Stat numerals may count up (mono-stable, 800ms, from 60% of value — never from 0) but must render final values server-side first — the Sarhan "$0 B+" failure is the anti-pattern: JS-off must show real numbers.
Headline italic accent word may ink-in via clip-path once, hero only.

## ASCII hero (signature effect)

Asset: character grid pre-generated at build time from a B&W hotel photograph (script in `site/scripts/ascii-gen.ts`) — never computed client-side from the image.
Charset ramp (dark→light): `HOKUTEN` letters + `北天ホクテン` + digits + `・.:-=+*#` mapped by luminance; seam row resolves into `THE HOKUTEN GROUP`.
Render: single `<canvas>`, drawn once; DPR-capped at 2; `aria-hidden` with an adjacent visually-hidden description; static `<img>` fallback (same frame) via `<noscript>` and for reduced-motion/touch/small viewports.
Interaction (pointer devices only): pointer-proximity glyph shimmer — within a 120px radius, characters swap one luminance step and gold-tint at 20% probability; decays over 400ms.
Budget: rAF loop runs only while pointer is over the canvas AND canvas is in viewport (IntersectionObserver-gated); dirty-rectangle redraws only (never full-canvas per frame); target ≤4ms script per frame; zero allocations in the loop (pre-allocated glyph buffers).
Kill switch: if frame time exceeds 12ms for 30 consecutive frames, freeze to static and stop the loop for the session.

## Ticker (`#ticker`, fixed bottom)

CSS `@keyframes` translateX marquee, content duplicated for seamless loop, 45s cycle, `will-change: transform`, pauses on hover/focus, disabled under reduced-motion (shows static first N items).
Data fetch once on load; failure keeps dash placeholders — the bar never breaks or jumps (reserve its height; zero CLS).

## Hovers

Cards: photo grayscale→color (`filter`, `DUR.base`) + 1.02 scale max; never translate cards.
Buttons: background/border shift `DUR.fast`; no size change.
Links: gold underline draw-in `DUR.fast`.
Touch: hover states replaced by the `tapped` toggle class (kwc pattern); no information may be hover-only.

## Smooth scroll

Lenis on desktop pointer devices only; native scroll on touch and under reduced-motion.
Anchor navigation respects `scroll-margin-top: 88px`; focus moves to the target section heading (a11y).
No scroll-jacking, no scroll-linked pinning in Phase 1.

## Performance gates (fail the build if violated)

- 60fps during scroll and hero interaction on a mid-tier device (4× CPU throttle in DevTools as proxy).
- LCP < 2.5s, CLS < 0.02, INP < 200ms on Vercel preview (mobile).
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95.
- JS shipped to client for the landing route ≤ 180KB gzip (fonts/images excluded); Calendly/intl-tel-input/us-cities lazy-load on interaction only.
- Fonts: ≤2 files per family, `display: swap`, subset; no CDN font requests.
- No `useEffect`-driven layout thrash; measure once, animate transforms.
