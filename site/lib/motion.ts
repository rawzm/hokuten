/**
 * Motion tokens — implementation of record for
 * .agents/skills/hokuten-design-director/references/05-motion.md
 *
 * Doctrine: motion signals weight, not spectacle. Transform/opacity/filter/
 * clip-path only. Reveals fire once. Exactly TWO easings sitewide. No bounce
 * or overshoot anywhere — this is a finance/trust surface.
 *
 * These values mirror the CSS custom properties in app/globals.css. If one
 * changes, change both (and log it in PROJECT-MEMORY.md).
 */

export const DUR = {
  /** Hovers, focus rings, badge states */
  fast: 0.15,
  /** UI transitions, accordion, modal shake */
  base: 0.3,
  /** Section entrance reveals */
  reveal: 0.6,
  /** Hero art settle only */
  slow: 0.9,
} as const;

export const DUR_MS = {
  fast: 150,
  base: 300,
  reveal: 600,
  slow: 900,
} as const;

export const EASE = {
  /** Reveals, most things — the a100/house entrance curve */
  out: [0.22, 1, 0.36, 1],
  /** Overlay open/close, cross-fades */
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const EASE_CSS = {
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;

/** Card grids, stepper items — max 6 children (P2 gate) */
export const STAGGER = 0.07;
export const STAGGER_MAX_CHILDREN = 6;

/** Distance tokens. A new distance must be registered here first (ref 05). */
export const DIST = {
  /** Standard section/element reveal rise */
  rise: 16,
  /** Route-level page transition rise */
  page: 8,
} as const;

/* ---------------------------------------------------------------------------
   Variants — the only reveal patterns on the site.
   Every consumer must ALSO gate on useReducedMotion() (P0 gate).
   --------------------------------------------------------------------------- */

/** opacity 0→1 + translateY 16px→0, DUR.reveal, EASE.out, fires once at 20% */
export const revealVariants = {
  hidden: { opacity: 0, y: DIST.rise },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.reveal, ease: EASE.out },
  },
} as const;

/** Container that staggers up to 6 children */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER },
  },
} as const;

/** Route-level page transition (app/template.tsx) */
export const pageVariants = {
  hidden: { opacity: 0, y: DIST.page },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE.out },
  },
} as const;

/** Hanko press-in: scale 1.06→1 + opacity, one time, on first footer reveal */
export const hankoPressVariants = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DUR.base, ease: EASE.out },
  },
} as const;

/** Static equivalents used when prefers-reduced-motion is set. */
export const staticVariants = {
  hidden: { opacity: 1, y: 0, scale: 1 },
  visible: { opacity: 1, y: 0, scale: 1 },
} as const;

/** IntersectionObserver / useInView settings for entrance reveals. */
export const IN_VIEW = { once: true, amount: 0.2 } as const;

/* ---------------------------------------------------------------------------
   Hero canvas performance budget (ref 05)
   --------------------------------------------------------------------------- */
export const HERO_BUDGET = {
  /** Pointer-proximity shimmer radius, px */
  shimmerRadius: 120,
  /** Shimmer decay, ms */
  shimmerDecay: 400,
  /** Probability a glyph inside the radius shimmers */
  shimmerProbability: 0.2,
  /** Max device pixel ratio the canvas renders at */
  maxDpr: 2,
  /** Target script time per frame, ms */
  frameBudgetMs: 4,
  /** Kill switch: freeze to static after N consecutive frames over the limit */
  killFrameMs: 12,
  killConsecutiveFrames: 30,
  /** Ambient morph loop */
  loopMaxFrames: 36,
  loopFps: 24,
} as const;

/**
 * Resolve whether motion should run at all. Call from a client component that
 * already has `useReducedMotion()` from motion/react; this adds the global
 * kill switch and the data-saver signal.
 */
export function motionAllowed(prefersReduced: boolean | null): boolean {
  if (prefersReduced) return false;
  if (typeof document !== "undefined") {
    if (document.documentElement.dataset.motion === "off") return false;
  }
  if (typeof navigator !== "undefined") {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return false;
  }
  return true;
}

/** Freeze all registered motion for the rest of the session (hero kill switch). */
export function freezeMotion(): void {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.motion = "off";
  }
}
