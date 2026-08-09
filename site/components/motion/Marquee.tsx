/**
 * Marquee — the CSS-keyframes rail used by both `#brands` (40s) and the
 * `#ticker` (45s). Governed by
 * .agents/skills/hokuten-design-director/references/05-motion.md (Ticker) and
 * 04-page-anatomy.md (`#brands`).
 *
 * Deliberately NOT a client component. It ships zero JavaScript: the loop is a
 * CSS keyframe (`--animate-marquee` / `--animate-marquee-brands` in
 * globals.css) and every behaviour it needs already lives in the token sheet —
 *
 *   [data-marquee-viewport]:hover / :focus-within  → pauses the track (WCAG 2.2.2)
 *   @media (prefers-reduced-motion) [data-marquee] → animation + transform off
 *   @media (prefers-reduced-motion) [data-marquee-clone] → display: none
 *   :root[data-motion="off"] [data-marquee]        → global kill switch
 *
 * so under reduced motion the row holds its first frame, static and readable,
 * and the duplicate never leaves a gap. It composes into client components
 * normally; keeping it a Server Component protects the 180KB landing budget.
 *
 * ── Why the viewport is `tabIndex={0}` (WCAG 2.2.2, Level A) ────────────────
 * Both rails auto-start, loop for longer than 5s (40s brands / 45s ticker) and
 * sit in parallel with other content, so 2.2.2 requires a pause mechanism for
 * EVERY user — not only for the reduced-motion cohort. The token sheet's pause
 * rule is `:hover, :focus-within`, and neither rail contains a single focusable
 * descendant (`#brands` renders `<span>` marks, `#ticker` renders `<span>`
 * label/value pairs), so before this attribute existed `:focus-within` could
 * never match and the mechanism was pointer-only. Making the labelled
 * `role="group"` viewport itself focusable is the standard focusable-region
 * technique: it is announced by its `aria-label`, takes the global 2px
 * focus-visible ring from globals.css's `[tabindex]` selector, pauses the track
 * for as long as it holds focus, and traps nothing. It is also what
 * `app/accessibility/page.tsx` already tells the public is implemented.
 * A visible pause/play control would be a stronger remedy; that is a design
 * decision, not a fix an audit may take on its own.
 *
 * Zero CLS: the content is server-rendered, so the viewport has its full height
 * on first paint. If the row can be empty on first paint (the ticker before its
 * data resolves), pass a min-height on `className` — e.g. the ticker's
 * `min-h-[var(--ticker-h)]`.
 *
 * ── `will-change` is scoped to "actually animating", not declared at rest ──
 * Ship-gate finding (2026-08-08), fixed here: `will-change: transform` was
 * unconditional on `[data-marquee]`, which pins EVERY marquee on the page
 * (brands + ticker) into its own compositor layer for the whole session, even
 * while paused (hover/focus-within) or fully stopped (reduced motion / the
 * `data-motion="off"` kill switch) — real memory for an effect that, once
 * paused or stopped, is not running. This is a Server Component with zero JS,
 * so the scoping has to be pure CSS: arbitrary Tailwind variants reference the
 * same `[data-marquee-viewport]:hover`/`:focus-within` ancestor selectors
 * globals.css already keys its own pause rule off, plus `motion-reduce:` (the
 * `@media (prefers-reduced-motion: reduce)` core variant) and the
 * `:root[data-motion="off"]` kill switch. All four collapse `will-change`
 * back to `auto` in exactly the states where the transform is not moving;
 * `will-change-transform` only actually holds while the animation is
 * genuinely running. Verified by compiling this file's classes through
 * `@tailwindcss/postcss` directly (no `pnpm build`/`pnpm dev`) and inspecting
 * the emitted selectors before shipping this change.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** 45s for the ticker, 40s for the brands strip — both defined in globals.css. */
export type MarqueeSpeed = "ticker" | "brands";

const SPEED_CLASS: Record<MarqueeSpeed, string> = {
  ticker: "animate-marquee",
  brands: "animate-marquee-brands",
};

export type MarqueeProps = {
  /** One row of content. Rendered twice for the seamless -50% loop. */
  children: ReactNode;
  /** Which cycle length to run. */
  speed?: MarqueeSpeed;
  /** Accessible name for the rail, e.g. "Franchise flags we transact across". */
  label: string;
  /** Soft-fade the left and right edges with `rail-mask`. */
  edgeFade?: boolean;
  /** Classes for the viewport (height, surface, hairlines, padding). */
  className?: string;
  /** Classes for the moving track (gap between items, vertical alignment). */
  trackClassName?: string;
};

export function Marquee({
  children,
  speed = "ticker",
  label,
  edgeFade = true,
  className,
  trackClassName,
}: MarqueeProps) {
  // One half of the track. Both halves are identical and `shrink-0`, so the
  // track is exactly 2x the content and translating -50% lands seamlessly.
  const half = cn("flex shrink-0 items-center", trackClassName);

  return (
    <div
      data-marquee-viewport
      role="group"
      aria-label={label}
      /* The pause mechanism's only keyboard/AT entry point — see file header. */
      tabIndex={0}
      className={cn("relative w-full", className)}
    >
      {/* The clipper, and the ONLY element that may carry `rail-mask`.
          A CSS mask applies to an element's whole rendering — its outline
          included — so leaving the edge fade on the focusable viewport above
          would fade that element's own `:focus-visible` ring out at both ends
          and leave the focus indicator half-invisible. Clipping and masking
          therefore live one level in, where nothing is ever focused. */}
      <div className={cn("w-full overflow-hidden", edgeFade && "rail-mask")}>
        <div
          data-marquee
          className={cn(
            "flex w-max will-change-transform",
            // Collapse back to `auto` in every state where the transform is
            // not actually moving — see file header "`will-change` is
            // scoped" note. `_` stands in for the space Tailwind can't carry
            // inside a class token; each compiles to a real descendant
            // selector rooted at `[data-marquee-viewport]` or `:root`.
            "motion-reduce:will-change-auto",
            "[[data-marquee-viewport]:hover_&]:will-change-auto",
            "[[data-marquee-viewport]:focus-within_&]:will-change-auto",
            "[:root[data-motion=off]_&]:will-change-auto",
            SPEED_CLASS[speed],
          )}
        >
          <div className={half}>{children}</div>
          {/* The clone is scenery: `inert` keeps it out of the tab order and the
              accessibility tree, so nothing is announced or focusable twice. */}
          <div data-marquee-clone inert aria-hidden="true" className={half}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
