/**
 * Button — the site's single CTA primitive (pill / ghost / mono link).
 * Governed by hokuten-design-director reference 03 "Components" + 05 "Hovers".
 *
 * Design rules encoded here:
 * - One primary per viewport (ref 03). The COMPONENT cannot enforce that —
 *   the section that composes it must. If a viewport needs two actions, the
 *   second is `ghost`, the third is `link`.
 * - Hover shifts background/border only, at DUR.fast. Never a size change,
 *   never a transform (ref 05).
 * - Every size clears the 44px tap-target gate (ref 07 P0). `md` (44px) and
 *   `lg` (52px) clear it on box height alone; `sm` (36px visual) and `link`
 *   (tight mono type) reach it with a transparent `::before` hit expander,
 *   which is part of the button for hit-testing but paints nothing.
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
       * `primary` colours are resolved by the compound variants below so the
       * caller never picks light-vs-dark. `ghost` and `link` need no compound:
       * they consume surface-relative tokens (--fg, --hairline, --accent-text)
       * which CSS inheritance already resolves against the NEAREST .surface-*
       * scope.
       */
      variant: {
        primary: "rounded-pill",
        ghost:
          "rounded-pill border border-hairline bg-transparent text-fg hover:border-accent-text",
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
       * Set it when a light island (.surface-card) is nested inside a dark
       * chapter, or vice versa — the `[.surface-dark_&]` descendant selector
       * matches any ancestor, not the nearest one, so `auto` guesses wrong in
       * that one case.
       */
      tone: {
        auto: "",
        light: "",
        dark: "",
      },
    },
    compoundVariants: [
      /* ---- primary, auto: ink pill on light, accent pill on dark --------- */
      {
        variant: "primary",
        tone: "auto",
        class: [
          "bg-ink text-paper hover:bg-ink-muted",
          "[.surface-dark_&]:bg-accent [.surface-dark_&]:text-on-accent",
          "[.surface-dark_&]:hover:bg-[color-mix(in_srgb,var(--accent)_88%,var(--fg))]",
          "[.surface-black_&]:bg-accent [.surface-black_&]:text-on-accent",
          "[.surface-black_&]:hover:bg-[color-mix(in_srgb,var(--accent)_88%,var(--fg))]",
        ],
      },
      /* ---- primary, pinned light ---------------------------------------- */
      {
        variant: "primary",
        tone: "light",
        class: [
          "bg-ink text-paper hover:bg-ink-muted",
          "[.surface-dark_&]:bg-ink [.surface-dark_&]:text-paper [.surface-dark_&]:hover:bg-ink-muted",
          "[.surface-black_&]:bg-ink [.surface-black_&]:text-paper [.surface-black_&]:hover:bg-ink-muted",
        ],
      },
      /* ---- primary, pinned dark ------------------------------------------
         Hover mixes the accent 12% toward the surface foreground rather than
         hopping to --accent-dim: --accent-dim is a TEXT colour in Theme B and
         drops the on-accent pair to 2.75:1 as a fill. The mix holds 6.89:1
         (Theme G) / 5.33:1 (Theme B). Recomputed values belong in
         docs/design/CONTRAST.md if this ever changes.                       */
      {
        variant: "primary",
        tone: "dark",
        class:
          "bg-accent text-on-accent hover:bg-[color-mix(in_srgb,var(--accent)_88%,var(--fg))]",
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
