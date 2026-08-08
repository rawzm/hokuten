/**
 * Route-level page transition.
 * Governed by .agents/skills/hokuten-design-director/references/05-motion.md
 * (opacity + 8px rise, DUR.base, EASE.out — all of it via `pageVariants`).
 *
 * THE FIRST PAINT NEVER ANIMATES — a deliberate choice.
 * ------------------------------------------------------
 * template.tsx wraps every route, including the very first one. Animating the
 * initial load would ship `opacity: 0` in the server HTML for the entire page,
 * which means the LCP element is not "painted" until hydration finishes and a
 * 300ms tween completes. Ref 05 gates LCP < 2.5s on mobile; that is not a gate
 * worth spending on a fade nobody asked for, and a hydration failure would
 * leave the whole document blank.
 *
 * So the first paint renders at full opacity with no transform, and only
 * subsequent client-side navigations get the transition. `firstPaintDone` is
 * module-scoped and written ONLY from an effect, so it is always false during
 * SSR (Next.js reuses module state between requests) and false on the client's
 * first render too — server and client agree, no hydration mismatch.
 *
 * KNOWN CONSTRAINT — position: fixed
 * ----------------------------------
 * While the transition runs, this wrapper carries a transform, which makes it
 * the containing block for any `position: fixed` descendant. At rest motion
 * writes `transform: none`, so there is no effect outside the 300ms window.
 * The fixed `#ticker` and the sticky nav must therefore live in app/layout.tsx,
 * OUTSIDE this template, not inside a route's page.
 */

"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { motionAllowed, pageVariants } from "@/lib/motion";

let firstPaintDone = false;

export default function Template({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();
  const [isFirstPaint] = useState(() => !firstPaintDone);

  useEffect(() => {
    firstPaintDone = true;
  }, []);

  // Reduced motion, the kill switch and data-saver all land on the same
  // designed static state as the first paint: the page is simply there.
  const shouldAnimate = !isFirstPaint && motionAllowed(prefersReduced);

  return (
    <motion.div
      initial={shouldAnimate ? "hidden" : false}
      animate="visible"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
}
