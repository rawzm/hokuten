/**
 * Button — the site's single CTA primitive (pill / ghost / mono link).
 * Governed by hokuten-design-director reference 03 "Components" + 05 "Hovers".
 *
 * ── D-VOCAB / R2 (Razim, 2026-08-17) — the primary CTA is OUTLINED ─────────
 * Brand Design Guide v1.3 (line 29): "hairline rules and outlined boxes —
 * never filled buttons, never rounded card grids, never drop shadows."
 * `docs/LAUNCH-IMPLEMENTATION.md` §1.2 resolves the collision with the
 * approved filled-gold pill as R2, adopted with one carve-out: the primary
 * CTA becomes a hairline-OUTLINED gold box — 1px accent border, TRANSPARENT
 * ground, accent label — and a gold GROUND appears only on `:hover`/`:active`.
 * That is the guide's own outlined-box language, and the hover fill is the
 * carve-out the decision names, not a relapse into a filled button.
 * Two consequences worth stating out loud:
 *   • The pill is gone. R2 also minimises radii toward 0, so `primary` and
 *     `ghost` are square boxes on the `--radius-card` TOKEN — which the token
 *     layer resolved to `0` in the same pass. This file names the token
 *     (`rounded-card`), never a px value, so whatever the token layer sets
 *     flows straight through. `--radius-pill` survives for CIRCULAR
 *     primitives only (icon buttons, the LIVE dot, the loader rail); it is
 *     explicitly NOT a licence to bring a pill CTA back.
 *   • `primary` no longer needs a light-vs-dark compound at all. The resting
 *     colours are `--accent-text` (surface-scoped: `--accent-ink` on light,
 *     `--accent-on-dark` on dark), which CSS inheritance resolves against the
 *     NEAREST `.surface-*` scope — unlike the old `[.surface-dark_&]`
 *     descendant selectors, which matched ANY ancestor and are exactly what
 *     the `tone` escape hatch existed to work around. `tone` is kept for
 *     source compatibility and for the genuinely-pinned case, but `auto` is
 *     now correct in every nesting, including a light island inside a dark
 *     chapter.
 * Contrast (docs/design/CONTRAST.md): the border and label are `--accent-text`
 * — 5.27:1 on paper / 4.83 ivory / 5.55 card / 5.47 on --dark — NOT the raw
 * `--accent`, which is 2.96:1 on paper and would put a sub-3:1 boundary on a
 * light ground (WCAG 1.4.11). See this component's report for the deviation
 * note. The hover pair is the already-documented `--accent` + `--on-accent`
 * (5.47:1); no new colour pair is invented here, so nothing needs recomputing.
 *
 * Design rules encoded here:
 * - One primary per viewport (ref 03). The COMPONENT cannot enforce that —
 *   the section that composes it must. If a viewport needs two actions, the
 *   second is `ghost`, the third is `link`.
 * - Hover shifts background/border/colour only, at DUR.fast. Never a size
 *   change, never a transform (ref 05).
 * - Every size clears the 44px tap-target gate (ref 07 P0). `md` (44px) and
 *   `lg` (52px) clear it on box height alone; `sm` (36px visual) and `link`
 *   (tight mono type) reach it with a transparent `::before` hit expander,
 *   which is part of the button for hit-testing but paints nothing. The
 *   outlined primary does not change any of this: Tailwind's preflight sets
 *   `box-sizing: border-box`, so the new 1px border is drawn INSIDE the
 *   min-height, and 44/52px stay 44/52px.
 * - Focus ring comes from the base layer in globals.css (2px var(--focus)).
 *   Never add `outline-none` here.
 * - Motion is CSS `transition-colors` only, so the global reduced-motion block
 *   in globals.css is the designed static state (colour still changes, it just
 *   changes instantly). No `useReducedMotion()` hook is needed and none is
 *   added — a hook would force "use client" onto every page that renders a
 *   CTA and eat the 180KB landing-route JS budget.
 */

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Transparent hit expander. Written out in full at each use site as well as
 * here — Tailwind v4 scans raw source text, so every candidate must appear as
 * a complete literal token somewhere in the file.
 */
const HIT_EXPANDER = "before:absolute before:content-[''] before:inset-x-0";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 text-center",
    "font-sans text-body font-medium leading-snug",
    "cursor-pointer select-none touch-manipulation",
    // The only animated properties: colour + border colour. DUR.fast, EASE.out.
    "transition-colors duration-fast ease-out",
    // Disabled: native for <button>, aria-disabled for asChild anchors.
    "disabled:pointer-events-none disabled:opacity-55",
    "aria-disabled:pointer-events-none aria-disabled:opacity-55",
  ],
  {
    variants: {
      /**
       * All three variants are now outlined boxes on surface-relative tokens
       * (--fg, --hairline, --accent-text), which CSS inheritance resolves
       * against the NEAREST .surface-* scope. `primary`'s compound below only
       * exists to serve the `tone` escape hatch; `auto` is correct everywhere.
       */
      variant: {
        // R2: outlined gold box. Ground stays transparent until hover/active.
        primary: "rounded-card border bg-transparent",
        ghost:
          "rounded-card border border-hairline bg-transparent text-fg hover:border-accent-text",
        link: [
          "rounded-none text-accent-text",
          // Underline draws in from the left on hover/focus: scaleX only, so
          // this is a transform animation, never a layout one (ref 05).
          "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-current",
          "after:origin-left after:scale-x-0",
          "after:transition-transform after:duration-fast after:ease-out",
          "hover:after:scale-x-100 focus-visible:after:scale-x-100",
          // Touch devices get the underline permanently — no hover-only
          // affordance (ref 07 P0).
          "[@media(hover:none)]:after:scale-x-100",
        ],
      },
      /** Geometry only. Typography lives in the base + the `link` compound. */
      size: {
        // 36px box + 4px top/bottom expander = 44px hit area.
        sm: `min-h-9 px-4 py-1.5 ${HIT_EXPANDER} before:-inset-y-1`,
        md: "min-h-11 px-6 py-2",
        lg: "min-h-13 px-8 py-2.5",
      },
      /**
       * ESCAPE HATCH ONLY. Leave this alone (`auto`) in normal use.
       * R2 removed the `[.surface-dark_&]` descendant selectors that used to
       * make `auto` guess wrong inside a light island nested in a dark
       * chapter: the outlined primary reads `--accent-text`, which inherits
       * from the NEAREST `.surface-*` scope, so `auto` is now correct in
       * every nesting. `light`/`dark` survive for the one remaining case —
       * pinning a CTA's accent to a ground it does not actually sit on
       * (e.g. a control rendered into a portal or a fixed overlay whose
       * painted ground is not its DOM ancestor).
       */
      tone: {
        auto: "",
        light: "",
        dark: "",
      },
    },
    compoundVariants: [
      /* ---- primary, auto: outlined gold, gold ground on hover/active -----
         The resting border and label are BOTH --accent-text, so the outline
         and the word it frames are one colour — the guide's "outlined box".
         --accent-text is surface-scoped, so this single class list is correct
         on paper, ivory, card, --dark and --black without any descendant
         selector. Hover/active fill with the documented --accent/--on-accent
         pair (5.47:1); `active` repeats hover rather than inventing a third
         colour pair that would need its own contrast row.                  */
      {
        variant: "primary",
        tone: "auto",
        class: [
          "border-accent-text text-accent-text",
          "hover:border-accent hover:bg-accent hover:text-on-accent",
          "active:border-accent active:bg-accent active:text-on-accent",
        ],
      },
      /* ---- primary, pinned light -----------------------------------------
         ESCAPE HATCH. Pins the light-ground accent (--accent-ink, 5.27:1 on
         paper) regardless of the nearest surface scope.                    */
      {
        variant: "primary",
        tone: "light",
        class: [
          "border-accent-ink text-accent-ink",
          "hover:border-accent hover:bg-accent hover:text-on-accent",
          "active:border-accent active:bg-accent active:text-on-accent",
        ],
      },
      /* ---- primary, pinned dark ------------------------------------------
         ESCAPE HATCH. Pins the dark-ground accent (--accent-on-dark = the
         guide gold itself, 5.47:1 on --dark / 6.73:1 on --black).          */
      {
        variant: "primary",
        tone: "dark",
        class: [
          "border-accent-on-dark text-accent-on-dark",
          "hover:border-accent hover:bg-accent hover:text-on-accent",
          "active:border-accent active:bg-accent active:text-on-accent",
        ],
      },
      /* ---- link: tertiary mono micro, geometry independent of `size` ----- */
      {
        variant: "link",
        class: [
          "min-h-0 px-0 py-1",
          "font-mono text-micro font-normal uppercase",
          // 15px type + 8px padding + 24px expander ≈ 47px hit area.
          `${HIT_EXPANDER} before:-inset-y-3 before:-inset-x-2`,
        ],
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      tone: "auto",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the child element instead of a <button> (links, Next <Link>). */
  asChild?: boolean;
  /**
   * In-flight state. Renders a Lucide loader glyph PLUS a polite live-region
   * status string — the glyph alone would be information carried by motion,
   * which fails under reduced motion and for screen readers.
   */
  loading?: boolean;
  /** Announced while `loading`. Override with the specific action. */
  loadingLabel?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    tone,
    asChild = false,
    loading = false,
    loadingLabel = "Working…",
    disabled,
    type,
    children,
    ...props
  },
  ref,
) {
  const isDisabled = disabled === true || loading;
  const classes = cn(buttonVariants({ variant, size, tone }), className);

  /* An ARRAY, never a fragment: Radix's Slot finds <Slottable> by walking
     React.Children of its direct children, and a Fragment would hide it. */
  const inner = [
    loading ? (
      <LoaderCircle
        key="hk-button-loader"
        aria-hidden="true"
        strokeWidth={1.5}
        className="size-4 shrink-0 animate-spin"
      />
    ) : null,
    asChild ? (
      <Slottable key="hk-button-children">{children}</Slottable>
    ) : (
      <React.Fragment key="hk-button-children">{children}</React.Fragment>
    ),
    loading ? (
      <span key="hk-button-status" role="status" aria-live="polite" className="visually-hidden">
        {loadingLabel}
      </span>
    ) : null,
  ];

  if (asChild) {
    return (
      <Slot
        ref={ref as React.Ref<HTMLElement>}
        className={classes}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        {...(props as React.HTMLAttributes<HTMLElement>)}
      >
        {inner}
      </Slot>
    );
  }

  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {inner}
    </button>
  );
});

export { Button, buttonVariants };
