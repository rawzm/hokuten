"use client";

/**
 * Stamp — the hanko seal. Governed by hokuten-design-director ref 01 (Brand),
 * ref 04 (Footer / #method), ref 05 (Motion), ref 07 (P0 a11y).
 *
 * ┌── SCARCITY RULE — READ BEFORE ADDING ONE ──────────────────────────────┐
 * │ Exactly THREE on-page stamp placements exist sitewide (ref 04):        │
 * │   ① footer  — ~48px beside the stacked lockup, with the press-in       │
 * │   ② method  — accent on the `#method` chapter micro-label              │
 * │   ③ og      — corner of the OG image                                   │
 * │ Plus the favicon, which is an asset, not this component.               │
 * │ THERE IS NO FOURTH. A seal used four times is a pattern, and a pattern │
 * │ is not a seal. The `placement` prop is required and closed so a new    │
 * │ placement cannot be added without editing this union on purpose.       │
 * │ QA: `grep -rn "<Stamp" site/app site/components` must return ≤ 3 sites.│
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * ── Asset ─────────────────────────────────────────────────────────────────
 * The SVG comes from the theme presentation record (`@/lib/theme`), so Theme G
 * gets /brand/hanko-gold.svg and Theme B gets /brand/hanko-blue.svg from the
 * same code. Those files are produced by the brand-asset workflow. Until they
 * land, `onError` makes the component render NOTHING rather than a broken-image
 * glyph — a missing seal is invisible, never wrong.
 * Plain `<img>`, not `next/image`: the default loader refuses to optimise SVG
 * anyway, so `next/image` would add machinery and no bytes saved.
 *
 * ── Accessibility ─────────────────────────────────────────────────────────
 * Decorative in every placement: `alt=""` + `aria-hidden`. The brand name is
 * already present as real text everywhere the stamp appears (the footer lockup,
 * the #method micro-label), so nothing is lost when it is skipped or missing.
 *
 * ── Why "use client" ──────────────────────────────────────────────────────
 * Both requirements need the DOM: `onError` degradation, and `useReducedMotion`
 * for the press-in. React's directive is module-scoped, so a single file cannot
 * hold one Server export and one client export. Both exports are plain markup
 * with no context or heavy imports; `Stamp` still renders in the SSR HTML and
 * is correct with JS off.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { hankoPressVariants, IN_VIEW, motionAllowed } from "@/lib/motion";
import { themePresentation } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** The three legal placements. Adding a member is a design decision, not a fix. */
export type StampPlacement = "footer" | "method" | "og";

export type StampProps = {
  placement: StampPlacement;
  /** Rendered square, in px. 48 is the footer size (ref 04). */
  size?: number;
  /** Use the on-dark monochrome cut of the seal. */
  onDark?: boolean;
  className?: string;
};

const DEFAULT_SIZE = 48;

function hankoSrc(onDark: boolean): string {
  return onDark ? themePresentation.hankoMonochromeOnDark : themePresentation.hanko;
}

/**
 * The seal, static. Default export — this is what the OG corner and the
 * `#method` micro-label use, and what the footer falls back to.
 */
export default function Stamp({
  placement,
  size = DEFAULT_SIZE,
  onDark = false,
  className,
}: StampProps) {
  const [missing, setMissing] = useState(false);

  if (missing) return null;

  return (
    // The default next/image loader passes SVG through unoptimised regardless,
    // so <Image> would buy machinery and zero bytes here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={hankoSrc(onDark)}
      alt=""
      aria-hidden="true"
      data-stamp={placement}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      draggable={false}
      decoding="async"
      loading="lazy"
      onError={() => setMissing(true)}
      className={cn("rounded-none select-none", className)}
    />
  );
}

/**
 * The seal, pressed in once: scale 1.06 to 1 with an opacity reveal, fired the
 * first time it enters the viewport (`hankoPressVariants`, DUR.base, EASE.out).
 * Footer placement only.
 *
 * Reduced motion and the global kill switch get the designed static state: the
 * seal is simply already pressed — present, full opacity, no movement.
 *
 * The reveal is opt-in at mount and never fights the first paint:
 *  · Server and first client render are identical (`initial={false}`, animate
 *    "visible"), so there is no hydration mismatch and no JS-off blank.
 *  · One `getBoundingClientRect` read on mount. If the seal is already on
 *    screen we skip the reveal entirely rather than flash it out and back.
 */
export function StampPressIn({
  placement,
  size = DEFAULT_SIZE,
  onDark = false,
  className,
}: StampProps) {
  const ref = useRef<HTMLImageElement>(null);
  const inView = useInView(ref, IN_VIEW);
  const prefersReduced = useReducedMotion();
  const [missing, setMissing] = useState(false);
  const [revealArmed, setRevealArmed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!motionAllowed(prefersReduced)) return;
    const rect = node.getBoundingClientRect();
    const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
    if (onScreen) return;
    setRevealArmed(true);
  }, [prefersReduced]);

  if (missing) return null;

  return (
    <motion.img
      ref={ref}
      src={hankoSrc(onDark)}
      alt=""
      aria-hidden="true"
      data-stamp={placement}
      data-animated
      width={size}
      height={size}
      style={{ width: size, height: size }}
      draggable={false}
      decoding="async"
      loading="lazy"
      onError={() => setMissing(true)}
      className={cn("rounded-none select-none", className)}
      variants={hankoPressVariants}
      initial={false}
      animate={revealArmed && !inView ? "hidden" : "visible"}
    />
  );
}

// Named export for consistency — every component here is importable by name.
export { Stamp };
