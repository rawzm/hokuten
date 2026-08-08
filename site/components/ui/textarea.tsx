/**
 * Textarea — multi-line form control.
 * Governed by hokuten-design-director reference 03 "Components → Forms".
 *
 * Shares FIELD_SHELL with Input so the two can never drift. Only the box
 * geometry differs: a 120px floor (well clear of the 44px tap-target gate) and
 * vertical-only resize, because horizontal resize breaks the container grid.
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { FIELD_SHELL } from "./input";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rows = 4, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(FIELD_SHELL, "min-h-30 resize-y py-3 leading-relaxed", className)}
      {...props}
    />
  );
});

export { Textarea };
