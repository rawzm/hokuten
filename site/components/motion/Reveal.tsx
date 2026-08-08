/**
 * Reveal — the one entrance-reveal wrapper used by every section on the site.
 * Governed by .agents/skills/hokuten-design-director/references/05-motion.md.
 *
 * Pattern (ref 05): opacity 0→1 + translateY 16px→0, DUR.reveal, EASE.out,
 * fires ONCE at 20% viewport intersection. Durations, curves, distances and
 * intersection settings all come from @/lib/motion — nothing is redeclared here.
 *
 * WHY THE SERVER ALWAYS RENDERS THE FINAL STATE
 * ---------------------------------------------
 * The idiomatic `initial="hidden" whileInView="visible"` pattern ships
 * `opacity: 0` in the server HTML. That fails us three ways:
 *   1. LCP — an LCP element painted at opacity 0 does not count as painted
 *      until hydration + IntersectionObserver + 600ms. Ref 05 gates LCP < 2.5s.
 *   2. JS-off / hydration failure leaves whole sections permanently blank.
 *   3. freezeMotion() (the hero kill switch) can flip mid-session; anything
 *      already hidden would never reveal again.
 *
 * So: the element renders in its FINAL state on the server and on the first
 * client render. In a pre-paint layout effect we measure once and "arm" only
 * the elements that start FULLY below the fold — those can be hidden with zero
 * visible flash, and they are exactly the ones a scroll reveal is for. Anything
 * the user can already see simply stays put. This also makes the reduced-motion
 * branch hydration-safe, because useReducedMotion() returns null on the server
 * and the real value on the client's first render.
 *
 * The `armed` variant is the hidden state applied with `duration: 0` — that is
 * the ABSENCE of motion, not a new motion token.
 */

"use client";

import {
  motion,
  useIsomorphicLayoutEffect,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";
import {
  Children,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import {
  IN_VIEW,
  STAGGER,
  STAGGER_MAX_CHILDREN,
  motionAllowed,
  revealVariants,
  staggerContainer,
} from "@/lib/motion";

/* ---------------------------------------------------------------------------
   Variants
   --------------------------------------------------------------------------- */

/** Instant, i.e. no animation at all. Not a duration token. */
const NO_MOTION = { duration: 0 } as const;

/** revealVariants + an `armed` key that snaps to the hidden state. */
const REVEAL = {
  hidden: revealVariants.hidden,
  visible: revealVariants.visible,
  armed: { ...revealVariants.hidden, transition: NO_MOTION },
};

/** staggerContainer + the same `armed` key. The container itself never moves. */
const STAGGER_CONTAINER = {
  hidden: staggerContainer.hidden,
  visible: staggerContainer.visible,
  armed: {},
};

/* ---------------------------------------------------------------------------
   Props
   --------------------------------------------------------------------------- */

/**
 * Elements a reveal may render as. Always pass the tag the layout expects —
 * Reveal never adds a wrapper of its own, so a grid/flex parent keeps working.
 */
export type RevealTag =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "nav"
  | "figure"
  | "figcaption"
  | "ul"
  | "ol"
  | "li"
  | "dl"
  | "dt"
  | "dd"
  | "p"
  | "span"
  | "h2"
  | "h3"
  | "h4";

type MotionPassthrough = Omit<
  HTMLMotionProps<"div">,
  | "variants"
  | "initial"
  | "animate"
  | "whileInView"
  | "viewport"
  | "transition"
  | "children"
  | "ref"
>;

export type RevealProps = MotionPassthrough & {
  children?: ReactNode;
  /** Rendered element. Default `div`. */
  as?: RevealTag;
  /** Extra seconds before this reveal starts. Keep it under 0.2s. */
  delay?: number;
  /**
   * Render a stagger container. Direct children must be `<Reveal.Item>`.
   * Ref 05 caps a stagger group at 6 children.
   */
  stagger?: boolean;
};

export type RevealItemProps = MotionPassthrough & {
  children?: ReactNode;
  as?: RevealTag;
};

/* ---------------------------------------------------------------------------
   Component
   --------------------------------------------------------------------------- */

function RevealRoot({
  children,
  as = "div",
  delay,
  stagger = false,
  ...rest
}: RevealProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);

  // Measure ONCE, before paint (ref 05: no useEffect-driven layout thrash).
  // Every Reveal on the page reads in the same layout-effect pass, so the
  // browser lays out once; the writes are batched React state updates.
  useIsomorphicLayoutEffect(() => {
    if (!motionAllowed(prefersReduced)) return;
    const el = ref.current;
    if (!el) return;
    // Strictly below the fold — nothing the user can see is ever hidden.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setArmed(true);
  }, [prefersReduced]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !stagger) return;
    const count = Children.count(children);
    if (count > STAGGER_MAX_CHILDREN) {
      console.warn(
        `[Reveal] ${count} staggered children — reference 05 caps a stagger group at ${STAGGER_MAX_CHILDREN}. Split the group or drop the stagger.`,
      );
    }
  }, [stagger, children]);

  const variants = useMemo(() => {
    if (stagger) {
      if (!delay) return STAGGER_CONTAINER;
      return {
        ...STAGGER_CONTAINER,
        visible: {
          transition: { staggerChildren: STAGGER, delayChildren: delay },
        },
      };
    }
    if (!delay) return REVEAL;
    return {
      ...REVEAL,
      visible: {
        ...revealVariants.visible,
        // duration + ease still come from the token; only the offset is local.
        transition: { ...revealVariants.visible.transition, delay },
      },
    };
  }, [stagger, delay]);

  // `motion.div` stands in for every DOM tag: the props we use (className,
  // style, variants, viewport, aria-*) are identical across all of them.
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      {...rest}
      ref={ref as Ref<HTMLDivElement>}
      initial={false}
      animate={armed ? "armed" : "visible"}
      whileInView={armed ? "visible" : undefined}
      viewport={armed ? IN_VIEW : undefined}
      variants={variants}
    >
      {children}
    </Tag>
  );
}

/**
 * A staggered child. Must be a direct child of `<Reveal stagger>` — it takes
 * its variant state from that parent and animates nothing on its own.
 */
function RevealItem({ children, as = "div", ...rest }: RevealItemProps) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag {...rest} variants={REVEAL}>
      {children}
    </Tag>
  );
}

RevealRoot.displayName = "Reveal";
RevealItem.displayName = "Reveal.Item";

export const Reveal = Object.assign(RevealRoot, { Item: RevealItem });
