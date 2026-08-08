/**
 * Input — single-line form control.
 * Governed by hokuten-design-director reference 03 "Components → Forms"
 * ("--card fields on paper, 16px+ inputs, visible 2px focus ring, labels
 * always present") and reference 07 P0 gates.
 *
 * Notes that are load-bearing:
 * - `bg-field` resolves to --card on every light scope and to a 7%-lifted dark
 *   in .surface-dark / .surface-black, so one class is correct on all five
 *   surfaces in both themes.
 * - Font size is 16px (`text-body`); the base layer in globals.css also pins
 *   `font-size: max(1rem, var(--text-body))` on input/select/textarea for the
 *   iOS anti-zoom rule. Do not shrink it.
 * - The focus ring is the global `outline: 2px solid var(--focus)` from the
 *   base layer. This component deliberately sets no focus styles at all.
 * - Error styling keys off `aria-invalid="true"`, which <Field> sets. On dark
 *   scopes raw --brick is only 2.75:1 against --dark, so the border mixes 45%
 *   toward --paper there (6.5:1). See the note in field.tsx.
 */

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Shared shell for Input and Textarea. Exported so textarea.tsx cannot drift
 * from it. Written as complete literal class tokens — Tailwind v4 scans raw
 * source text, so these must never be assembled from fragments.
 */
export const FIELD_SHELL = [
  "w-full rounded-card border border-hairline bg-field",
  "font-sans text-body text-fg placeholder:text-fg-meta",
  "px-4 transition-colors duration-fast ease-out",
  "disabled:cursor-not-allowed disabled:opacity-55",
  "aria-[invalid=true]:border-brick",
  "[.surface-dark_&]:aria-[invalid=true]:border-[color-mix(in_srgb,var(--brick)_55%,var(--paper))]",
  "[.surface-black_&]:aria-[invalid=true]:border-[color-mix(in_srgb,var(--brick)_55%,var(--paper))]",
].join(" ");

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      /* min-h-11 = 44px: the tap-target floor (ref 07 P0). */
      className={cn(FIELD_SHELL, "min-h-11 py-2", className)}
      {...props}
    />
  );
});

export { Input };
