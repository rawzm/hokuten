/**
 * Label — always visible, never a placeholder.
 * Governed by hokuten-design-director reference 03 "Components → Forms"
 * ("labels always present (no placeholder-as-label)") and reference 07 P0.
 *
 * The required marker is a text asterisk plus a visually-hidden "(required)"
 * string, so the requirement is never carried by a glyph alone. It is tinted
 * with `text-accent-text` (AA on every surface in both themes) rather than
 * --brick, which reference 01 reserves for form ERRORS and which fails AA on
 * dark surfaces.
 */

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  /** Renders the asterisk + screen-reader "(required)". */
  required?: boolean;
}

const Label = React.forwardRef<React.ComponentRef<typeof LabelPrimitive.Root>, LabelProps>(
  function Label({ className, required = false, children, ...props }, ref) {
    return (
      <LabelPrimitive.Root
        ref={ref}
        className={cn("block font-sans text-body font-semibold leading-snug text-fg", className)}
        {...props}
      >
        {children}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-1 text-accent-text">
              *
            </span>
            <span className="visually-hidden"> (required)</span>
          </>
        ) : null}
      </LabelPrimitive.Root>
    );
  },
);

export { Label };
