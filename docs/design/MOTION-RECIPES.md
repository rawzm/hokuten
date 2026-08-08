<!-- MOTION-RECIPES.md — the transitions.dev recipe catalogue, vendored into this repo and
     translated onto Hokuten motion tokens. Governed by
     .agents/skills/hokuten-design-director/references/05-motion.md (ref 05).
     Token implementation of record: site/lib/motion.ts + site/app/globals.css.
     Vendoring pin: site/lib/skills-lock.json. Precedent: filmfully/skills-lock.json. -->

# Motion recipes — transitions.dev, translated onto Hokuten tokens

Status: **provisional** (three rows need a design-director decision — see [Open token registrations](#open-token-registrations)).
Vendored 2026-08-08. Source catalogue: `transitions.dev` (21 recipes), as distributed in the
`transitions-dev` agent skill.

This file exists because of the house rule in `AGENTS.md`: **references are translated, never cloned.**
The upstream catalogue is a general-purpose CSS motion library tuned for consumer product UI. Roughly
half of it is illegal on this surface. This document is the adjudication: every recipe, what it maps to
in our token scale, and whether it may ship.

**Do not paste an upstream snippet into `site/`.** Read the verdict, then build the "Ships as" column
out of `@/lib/motion` exports and the `globals.css` duration/easing utilities.

---

## Verdict table

Verdicts are on the recipe **as published upstream**. The "Ships as" column is the Hokuten translation
an implementing agent should actually build.

| # | Recipe | Our token mapping | Verdict | Why |
|---|---|---|---|---|
| 01 | Card resize | — | **rejected** | Animates `width` / `height`. Ref 05: transform / opacity / filter / clip-path only, never a layout property. |
| 02 | Number pop-in | `STAGGER` 70ms matches; nothing else does | **rejected** | Ease `(0.34, 1.45, 0.64, 1)` overshoots. Ref 05: no bounce / overshoot anywhere. Our stat pattern is the SSR-first count-up. |
| 03 | Notification badge | — | **rejected** | Bounce ease `(0.34, 1.36, 0.64, 1)` plus a third close curve `(0.4, 0, 0.2, 1)`. Two rules: no overshoot, exactly two easings. |
| 04 | Text states swap | `DUR.fast` + `EASE.inOut` | **blocked: register distance token first** | Needs a 4px rise and a 2px blur. Registered distances are `DIST.rise` 16 and `DIST.page` 8 only; no blur token exists. |
| 05 | Menu dropdown | `DUR.base` open / `DUR.fast` close + `EASE.inOut` | **blocked: register scale token first** | Needs `scale(0.97)` in and `scale(0.99)` out. Scale is not tokenized. Curve and durations map cleanly. |
| 06 | Modal open / close | `DUR.base` open / `DUR.fast` close + `EASE.inOut` | **blocked: register scale token first** | Needs `scale(0.96)`. Same gap as 05. Ref 05 assigns `EASE.inOut` to overlay open/close, so the curve is settled. |
| 07 | Panel reveal | `DUR.reveal` + `EASE.out` | **blocked: register distance token first** | Ships a 100px translateY and a 2px blur. `DIST.rise` is 16px; 100px is six times our reveal grammar. |
| 08 | Page side-by-side | `DIST.page` 8px · `DUR.base` · `EASE.out` | **allowed** | Exact match to `pageVariants` once the 3px blur is dropped. Their `--distance-base` 8px *is* our `DIST.page`. |
| 09 | Icon swap | `DUR.fast` + `EASE.inOut` | **blocked: register scale token first** | Needs `scale(0.25)` and a 2px blur. The opacity cross-fade underneath is legal today. |
| 10 | Success check | — | **rejected** | Bob ease `(0.34, 1.35, 0.64, 1)` overshoots; 80deg rotate, 40px travel, 10px blur are all unregistered. Celebration register is wrong for a finance surface. |
| 11 | Avatar group hover | — | **rejected** | Return ease `(0.34, 3.85, 0.64, 1)` is an extreme spring. Also translates items on hover — ref 05 Hovers: never translate cards. |
| 12 | Error state shake | `--animate-shake` (`hk-shake`, `DUR.base`, `EASE.inOut`) | **allowed** | Already implemented in `globals.css` and already specified by ref 04 (consent modal, 300ms shake). Use ours, not theirs. |
| 13 | Input clear with dissolve | — | **rejected** | 1000ms exceeds `DUR.slow` (900ms, reserved for hero art settle). Per-frame rAF on a form field breaks the INP and JS budgets. Literal rgba glow violates token law. |
| 14 | Skeleton loader and reveal | `DUR.base` + `EASE.inOut` | **blocked: register blur token first** | Cross-fade needs a 2px blur; the pulse loop is separately rejected (a looping attention-getter on a trust surface). |
| 15 | Shimmer text | — | **rejected** | Animates `background-position` — outside the four allowed properties. Infinite loop competes with the hero signature. Ships literal hex colours. |
| 16 | Tabs sliding | — | **rejected** | Animates `width`. Layout property. The transform-only substitute is legal — see the detail entry. |
| 17 | Tooltip open / close | `DUR.fast` + `EASE.inOut` | **blocked: register scale token first** | Needs `scale(0.98)` and an 80ms appear delay that sits off our duration scale. |
| 18 | Texts reveal | `revealVariants` + `staggerContainer` | **blocked: register distance token first** | Ships 12px travel, 3px blur, 40ms stagger, 500ms. Ours are 16px / 600ms / 70ms. Same idea, none of the numbers. |
| 19 | Card hover tilt | — | **rejected** | 3D tilt to 14deg with a cursor-tracked glare: literal rgba whites, 1000ms return, `touch-action: none` on a scrollable card, and a second signature effect competing with the ASCII hero. |
| 20 | Plus to menu morph | — | **rejected** | Animates `width` / `height` / `border-radius`, and the open ease `(0.34, 1.25, 0.64, 1)` overshoots. Two rules. |
| 21 | Accordion expand | chevron flip → `DUR.base` + `EASE.out` | **blocked: design-director decision on `grid-template-rows`** | The chevron `scaleY(-1)` flip is legal and worth keeping. The panel animates `grid-template-rows` — a layout property — but ref 05 names an accordion under `DUR.base`. Genuine conflict; see [Open token registrations](#open-token-registrations). |

Tally: **2 allowed · 9 blocked · 10 rejected.**

---

## How a verdict was reached

Four adjudication rules, applied in order. They are written down so the reasoning can be checked rather
than trusted.

1. **Substitutable defaults are swapped, not rejected.** An upstream recipe that merely *defaults* to a
   keyword ease (`ease-out`, `ease-in-out`) is re-pointed at our nearest same-usage token. A recipe whose
   character *depends* on a third curve — the badge pop, the avatar spring, the success bob, the morph
   open — is rejected, because removing the curve removes the recipe.
2. **Property law is absolute.** `transform`, `opacity`, `filter`, `clip-path`. Anything animating `width`,
   `height`, `grid-template-rows`, `background-position`, or `stroke-dashoffset` is rejected on the
   property alone, regardless of how good it looks.
   *Clarification, provisional:* ref 05's Hovers section says "Buttons: background / border shift `DUR.fast`"
   and "Links: gold underline draw-in `DUR.fast`", so **colour transitions** (`color`, `background-color`,
   `border-color`) are permitted at `DUR.fast` even though colour is not one of the four. Confirm with the
   design director before relying on this beyond hover states.
3. **Magnitudes must be registered.** A duration must be one of `DUR.fast` 150 / `DUR.base` 300 /
   `DUR.reveal` 600 / `DUR.slow` 900. A distance must be `DIST.rise` 16px or `DIST.page` 8px. Anything else
   is `blocked: register <kind> token first` — blocked, not rejected: the recipe is fine, the number is not
   ours yet. Registration happens in `site/lib/motion.ts` plus a dated `PROJECT-MEMORY.md` entry, never
   inline in a component.
4. **Budget and register.** A recipe that survives 1–3 can still be rejected for exceeding the landing-route
   JS budget, for running a per-frame loop outside the hero, or for speaking in the wrong register. One
   signature effect per viewport, and the ASCII hero is the site's signature.

---

## Token conversion table

Everything upstream, mapped to what we actually have. Match on **usage**, not on the raw number — the
upstream skill's own `transitions refine` verb works the same way.

### Durations

| Upstream | Value | Their usage | Ours |
|---|---|---|---|
| `--duration-stagger` | 40ms | per-item stagger | `STAGGER` = 70ms (max 6 children) |
| `--duration-micro` | 80ms | delay, shake segment | no token — use `0` or `DUR.fast` |
| `--duration-quick` | 150ms | modal / dropdown close, text swap | `DUR.fast` (exact match) |
| `--duration-fast` | 250ms | icon swap, dropdown / modal open, page slide | `DUR.base` 300ms |
| `--duration-medium` | 350ms | panel close, toast close | `DUR.base` 300ms |
| `--duration-slow` | 400ms | panel open, skeleton reveal | `DUR.base` 300ms, or `DUR.reveal` 600ms for a section entrance |
| `--duration-very-slow` | 500ms | emphasis, text reveal | `DUR.reveal` 600ms |
| — | 1000ms+ | input clear, tilt return | **no mapping.** `DUR.slow` 900ms is hero art settle only |

### Easings

| Upstream | Value | Ours |
|---|---|---|
| `--ease-smooth-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | `EASE.out` — **byte-identical to our house curve.** Most of the catalogue already runs on it |
| `--ease-in-out` | `ease-in-out` keyword | `EASE.inOut` = `cubic-bezier(0.65, 0, 0.35, 1)` — ours is sharper at both ends |
| `--ease-out` | `ease-out` keyword | `EASE.out` |
| `--ease-linear` | `linear` | Registered for **continuous constant-velocity loops only** — the `#ticker` marquee and the `#brands` logo band, both already declared in `globals.css`. Never for a transition |
| `--ease-bounce` | `cubic-bezier(0.34, 1.36, 0.64, 1)` | **no mapping — rejected** |
| `--ease-bounce-strong` | `cubic-bezier(0.34, 3.85, 0.64, 1)` | **no mapping — rejected** |

### Distances

| Upstream | Value | Ours |
|---|---|---|
| `--distance-micro` | 4px | unregistered |
| `--distance-small` | 6px | unregistered |
| `--distance-base` | 8px | `DIST.page` (exact match) |
| `--distance-medium` | 12px | unregistered — the nearest registered value is `DIST.rise` 16px |
| `--distance-large` | 30px | unregistered |
| — | 16px | `DIST.rise` — upstream has no equivalent; this is ours |

### Scales, blur, rotation

Not tokenized. Two scale magnitudes are registered **by use** in `lib/motion.ts` and ref 05: `1.02`
(card photo hover ceiling) and `1.06` (`hankoPressVariants`). Every other scale — `0.96`, `0.97`, `0.98`,
`0.99`, `0.25`, `1.05` — is unregistered. No blur magnitude and no rotation magnitude is registered at all.
This is why nine recipes are blocked rather than allowed: the shape is fine, the numbers are not ours yet.

---

## Recipes that ship today

### 08 — Page side-by-side → route transition

Already built. `pageVariants` in `site/lib/motion.ts` is this recipe: opacity plus `DIST.page` 8px at
`DUR.base` on `EASE.out`. Upstream's `--page-slide-distance: 8px` and `--page-slide-ease` are our exact
values, which is a useful confirmation that the house curve is not eccentric.

Stripped to reach the verdict: the 3px cross-blur (no blur token), and the absolute `inset: 0` two-page
stack (our route transition is a single template, not a side-by-side pair).

```tsx
// app/template.tsx pattern — already the shipped implementation
import { motion, useReducedMotion } from "motion/react";
import { pageVariants, staticVariants, motionAllowed } from "@/lib/motion";

const reduced = useReducedMotion();
const variants = motionAllowed(reduced) ? pageVariants : staticVariants;
```

Reduced motion: `staticVariants` — the page is simply there, at full opacity, no offset. A designed static
state, not a missing one.

### 12 — Error state shake → form and modal rejection

Already built, and already specified twice: `--animate-shake` / `@keyframes hk-shake` in `globals.css`
(`DUR.base`, `EASE.inOut`, damped `translate3d` oscillation), and ref 04's consent modal, which plays a
300ms shake plus `navigator.vibrate(50)` when an outside click tries to dismiss it.

Use ours. Upstream's 6px / 4px stops and its four-segment `A, A, B, B` timing are not our numbers, and its
percentage stops are baked literals that drift the moment anyone retunes a segment.

An oscillating keyframe about a rest position is **not** the same thing as an overshooting bezier: the
curve between stops is still `EASE.inOut`, and the element ends where it started. That distinction is what
keeps this recipe inside the no-bounce rule, and it is the only oscillating motion on the site.

What upstream gets right and we should copy: keeping the shake class orthogonal to the error class, so the
shake can replay (remove → reflow → re-add) without flickering the error treatment off and on.

Accessibility, non-negotiable and stronger than upstream's version:

- The shake is decoration. The error itself is text plus a Lucide icon, wired with `aria-describedby`.
  Never colour alone, never motion alone.
- `text-brick` is the error colour token. It carries the icon, not the meaning.
- Under reduced motion the shake does not run; the error treatment appears immediately and completely.
- Upstream's 3000ms auto-revert is **rejected for forms** — an error that erases itself is an error a
  screen-reader user may never reach. Errors persist until the field changes.

---

## Recipes blocked on a token registration

Each of these is a good pattern wearing the wrong numbers. The "ships today" line is the legal subset that
needs no new token; the "needs" line is what a registration would buy.

### 04 — Text states swap

Upstream: 4px rise plus 2px blur plus opacity, at 150ms.
Ships today: opacity-only cross-fade at `DUR.fast` on `EASE.inOut`. Enough for "Send" becoming "Sent".
Needs: a 4px micro-distance token, and a blur scale.
Note: upstream's three-phase JS (exit → swap `textContent` → reflow → enter) mutates text under the reader.
Announce the change with a live region or swap the whole labelled control instead.

### 05 — Menu dropdown · 06 — Modal open / close

Upstream: `scale(0.97)` / `scale(0.96)` growing to 1, plus opacity, on `EASE.out` at 250ms open and 150ms
close.
Ships today: opacity cross-fade at `DUR.base` in, `DUR.fast` out, on `EASE.inOut` — ref 05 assigns
`EASE.inOut` to overlay open / close specifically, so the curve here is settled and the upstream default is
overridden rather than substituted.
Needs: an overlay scale token. Recommendation when it is registered: one value, nearer `0.98` than `0.96` —
we are opening a document, not launching a card.

Both surfaces exist in ref 04: the full-screen numbered nav overlay, and the consent modal. Beyond the
curve, the parts that matter are not motion at all — focus trap, focus restore on close, `role="dialog"`
with a label, Esc handling, and body scroll lock. Upstream ships none of that. It also relies on a
`setTimeout` to strip the closing class; if you keep that pattern, clear the timer on unmount.

### 07 — Panel reveal · 18 — Texts reveal

Both are our `revealVariants` with different numbers. Upstream: 100px and 12px travel, 2–3px blur, 40ms
stagger, 400–500ms.
Ships today: `revealVariants` + `staggerContainer` — `DIST.rise` 16px and opacity, `DUR.reveal` 600ms,
`EASE.out`, `STAGGER` 70ms, max 6 children, fired once at `IN_VIEW` (20% intersection).
Needs: a blur token, if we ever want the cross-blur. We probably do not — blur on text is a legibility cost
paid for a texture nobody asked for.

```tsx
import { motion, useReducedMotion } from "motion/react";
import { revealVariants, staggerContainer, staticVariants, IN_VIEW, motionAllowed } from "@/lib/motion";

const reduced = useReducedMotion();
const on = motionAllowed(reduced);

<motion.div variants={on ? staggerContainer : staticVariants} initial="hidden" whileInView="visible" viewport={IN_VIEW}>
  <motion.h2 variants={on ? revealVariants : staticVariants}>…</motion.h2>
</motion.div>
```

Upstream's decoupled exit — a flat opacity fade with no Y-return, so dismissing does not replay the reveal
backwards — is a genuinely good idea. It does not apply here: our reveals fire once per page load and have
no exit. Keep it in mind for the nav overlay, which does close.

### 09 — Icon swap

Upstream: cross-fade with `scale(0.25)` and a 2px blur at 250ms.
Ships today: opacity-only cross-fade at `DUR.fast` on `EASE.inOut` — both Lucide icons stacked in one grid
cell so the button never resizes.
Needs: a scale token if we want the pop. We do not; `scale(0.25)` is a consumer-app gesture.
Where: the nav menu trigger, `Menu` becoming `X`. The button keeps one accessible name and one
`aria-expanded` — the icon is `aria-hidden`, so nothing about the swap is announced twice.

### 14 — Skeleton loader and reveal

Upstream: pulse loop, then a cross-fade with a 2px cross-blur at 400ms.
Ships today: opacity-only cross-fade at `DUR.base` on `EASE.inOut`, from the `#ticker`'s dash placeholders
to live FRED values. Height is reserved, so the swap costs zero CLS — ref 05's ticker rule.
Needs: a blur token for the cross-blur.
Rejected outright: the pulse. A looping placeholder pulse is a busy signal on a surface whose whole thesis
is that quiet reads expensive. Dashes that turn into numbers say the same thing without the throb.
Upstream's `.is-resetting` snap-back — kill transitions, reflow, restore — is the right way to replay a
loading state without animating in reverse, if we ever need it.

### 17 — Tooltip open / close

Upstream: opacity plus `scale(0.98)`, 150ms in after an 80ms delay, 50ms out, `ease-out`, literal hex
background and foreground, three stacked rgba shadows.
Ships today: opacity-only at `DUR.fast` on `EASE.inOut`, no delay, colours from the surface scope
(`bg-card` / `text-fg` / `border-hairline`), elevation from `shadow-overlay`, corner from `rounded-card`.
Needs: a scale token, and a decision on whether an appear-delay is worth a token at all.
Upstream gets one thing importantly right: the **wrap** is the hover target, not the trigger, so the pointer
can drift onto the tooltip without flicker. Keep that.
Accessibility, and this is the part that decides whether a tooltip may exist at all: no hover-only
information. Touch users get no tooltip. If the content matters, it is body copy or a `<label>`, not a
tooltip. `aria-describedby` on the trigger, `role="tooltip"` on the bubble, and it must open on
`:focus-visible` as well as hover. The trigger still needs a 44px tap target.

### 21 — Accordion expand — needs a decision

This one is a genuine conflict inside ref 05, not a missing number, and `#faq` cannot be built until it is
resolved.

- Ref 05 Tokens: "`DUR.base` — UI transitions, **accordion**, modal shake." An accordion is expected.
- Ref 05 Doctrine: "Animate only `transform`, `opacity`, `filter`, `clip-path`. Never layout properties."
- Upstream animates `grid-template-rows: 0fr ↔ 1fr`. It is a layout property. It is also the only technique
  that animates content of unknown height without JS measurement *and* collapses the space beneath it.
- `clip-path: inset()` obeys the property law but does not collapse layout space, so the section below
  would not move up. It is not a substitute; it is a different effect.

Two ways out, for the design director to pick — this is not an implementing agent's call:

- **(a)** Register `grid-template-rows` `0fr ↔ 1fr` as the single sanctioned layout-property exception,
  scoped to disclosure panels, at `DUR.base` on `EASE.out`. Honest framing: it is a single-track
  interpolation, cheap as layout goes, but it is still layout on every frame.
- **(b)** Ship `#faq` as an instant show / hide with an opacity fade on the panel contents only. No height
  animation, nothing to violate. Least motion, zero risk, and consistent with slow-and-few.

**Allowed regardless of that choice:** the chevron. Upstream flips it with `transform: scaleY(-1)` instead
of morphing the SVG `d` path, because CSS `d:` interpolation is Chromium-only and silently dead on mobile
Safari and Firefox. The flip passes through a flat line at the midpoint — visually the same gesture — and
works everywhere. It needs a path symmetric about the viewBox centre and `vector-effect: non-scaling-stroke`
so the stroke does not thicken mid-flip. At `DUR.base` on `EASE.out` this is transform-only and legal today.
It is the single most useful thing in the upstream catalogue.

Also worth carrying over: padding belongs on the panel's inner element, never on the `0fr` track — padding
on the track leaves a residual strip and the panel never fully closes.

---

## Rejected recipes

Recorded so nobody re-litigates them, and so the reason survives the person who wrote it.

| # | Recipe | Rule violated | If we need the job done |
|---|---|---|---|
| 01 | Card resize | Layout property (`width` / `height`) | Do not resize. Cross-fade two fixed states, or accept the reflow with no animation |
| 02 | Number pop-in | Overshoot ease | Ref 05's stat pattern: SSR the final value, then count up mono-stable over 800ms from 60% of value — never from zero. The Sarhan "$0 B+" failure is the anti-pattern; JS-off must show real numbers |
| 03 | Notification badge | Overshoot ease + a third curve | Static badge. `bg-accent-chip` with `text-accent-ink`, `rounded-pill`. It does not need to arrive |
| 10 | Success check | Overshoot ease; unregistered rotate / distance / blur; wrong register | `#bov` success is an inline state change: a Lucide `Check`, a sentence, opacity cross-fade at `DUR.base` on `EASE.inOut`. Ref 04 requires the success state inline — never navigate away |
| 11 | Avatar group hover | Extreme spring; translates items on hover | Ref 05 Hovers: photo grayscale to colour via `filter` at `DUR.base`, 1.02 scale ceiling, never translate. `photo-reveal` already does this, with `.tapped` for touch |
| 13 | Input clear with dissolve | 1000ms exceeds the scale; per-frame rAF outside the hero; literal rgba; hides input glyphs from the field | Clear the field. A `<button>` with an accessible name, and the value is gone |
| 15 | Shimmer text | Animates `background-position`; infinite loop; literal hex | If a wait needs marking, mark it in words. The ticker never breaks or jumps; it holds dash placeholders |
| 16 | Tabs sliding | Animates `width` | The transform-only substitute **is** legal: a hairline indicator moved with `translateX` and sized with `scaleX` from measured `offsetLeft` / `offsetWidth`, at `DUR.base` on `EASE.out`. Write the first position with transitions suspended (set, reflow, restore) or it slides in from zero on first paint. Real `role="tablist"` semantics, arrow-key roving focus |
| 19 | Card hover tilt | Literal rgba glare; 1000ms return; `touch-action: none` on a scrollable card; a second signature effect | Listing and closing cards use `photo-reveal` and a hairline. Ref 03: hairlines carry structure, never drop shadows, never 3D |
| 20 | Plus to menu morph | Layout properties (`width` / `height` / `border-radius`) + overshoot open ease | The nav overlay opens as an overlay. It does not grow out of its own button |

---

## Open token registrations

Three decisions block nine recipes. Each needs a dated `PROJECT-MEMORY.md` entry and, where it is a
magnitude, a new export in `site/lib/motion.ts` mirrored into `globals.css`. None of them may be decided
inline in a component.

1. **Overlay scale token** — unblocks 05, 06, 09, 17. One magnitude, proposed `0.98`. Registering `0.96`
   would import a consumer-app pop we have no use for.
2. **Blur scale** — unblocks 04, 07, 14, 18. Proposed: do not register it. Cross-blur is texture, it costs
   legibility on text and paint time on large surfaces, and every recipe that wants it reads correctly
   without it. Recorded here so the question is closed rather than open.
3. **Accordion technique for `#faq`** — recipe 21, options (a) and (b) above. This one is on the critical
   path for Phase 1.

A fourth, smaller question if anyone wants recipe 04 at full fidelity: a 4px micro-distance token. Same
recommendation as blur — decline it, and let the text cross-fade in place.

---

## Provenance

- **Upstream catalogue:** `transitions.dev`, 21 recipes, distributed as the `transitions-dev` agent skill
  (`SKILL.md` + 21 numbered reference files + `_root.css`).
- **Vendoring precedent:** `filmfully` (`/Users/razim/Documents/Salman-ind/filmfully`), which vendors the
  skill verbatim into `.agents/skills/transitions-dev/` and pins it in a repo-root `skills-lock.json`
  carrying `source`, `sourceType`, `skillPath`, and `computedHash`.
- **How this repo differs, and why:** filmfully vendors the tree unchanged. We vendor a **translation** —
  one document, adjudicated against ref 05 — because `AGENTS.md` requires that references be translated,
  never cloned, and because more than half the catalogue is illegal under token, motion, and accessibility
  law here. Copying `_root.css` into `globals.css` would inject six easings, five distances, four scales,
  three blurs, and a dozen literal colours straight through the P0 token gate.
- **Pin:** `site/lib/skills-lock.json`, mirroring filmfully's lock shape. Ours records a `sha256` over this
  document, since there is no verbatim upstream file in this repo to hash. Filmfully's own `computedHash`
  does not match the `sha256` of the `SKILL.md` sitting next to it — it is an installer-recorded upstream
  hash — so it was transcribed for provenance and explicitly marked unverified rather than reproduced as if
  it were ours.
- **Governing references:** `05-motion.md` (doctrine and tokens), `03-visual-system.md` (hairlines, radii,
  shadows), `04-page-anatomy.md` (which surfaces exist), `07-audit.md` (the P0 gate these verdicts feed).

## Maintenance

Re-run this adjudication when the upstream catalogue adds recipes, when `DUR` / `EASE` / `DIST` change in
`site/lib/motion.ts`, or when any of the three open registrations is decided. Editing this file changes its
hash — update `computedHash` in `site/lib/skills-lock.json` in the same commit, and log the change in
`PROJECT-MEMORY.md`.
