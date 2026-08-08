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
 * Zero CLS: the content is server-rendered, so the viewport has its full height
 * on first paint. If the row can be empty on first paint (the ticker before its
 * data resolves), pass a min-height on `className` — e.g. the ticker's
 * `min-h-[var(--ticker-h)]`.
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
  /** Classes for the clipping viewport (height, surface, hairlines, padding). */
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
      className={cn("relative w-full overflow-hidden", edgeFade && "rail-mask", className)}
    >
      <div
        data-marquee
        className={cn("flex w-max will-change-transform", SPEED_CLASS[speed])}
      >
        <div className={half}>{children}</div>
        {/* The clone is scenery: `inert` keeps it out of the tab order and the
            accessibility tree, so nothing is announced or focusable twice. */}
        <div data-marquee-clone inert aria-hidden="true" className={half}>
          {children}
        </div>
      </div>
    </div>
  );
}
