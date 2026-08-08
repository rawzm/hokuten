"use client";

/**
 * components/ui/checkbox.tsx — the SMS-consent control (Radix), restyled to
 * Hokuten tokens. Governed by design-skill references 03 (form fields, accent
 * as action colour, Lucide iconography), 06 (the TCPA / SMS consent copy is a
 * byte-exact port — this file styles the control, never the wording) and 07
 * (44px targets, visible focus, label always present).
 *
 * Geometry: the visual box is 20px, but the Radix root — which is the real
 * <button> — is a 44px square, so the touch target passes the P0 gate without a
 * separate hit-area hack. `<CheckboxField>` pairs it with a real <label
 * htmlFor>; a button is a labelable element, so the full label text (however
 * many lines the TCPA block runs to) toggles the box.
 *
 * Motion: colour only, gated on reduced motion / the global kill switch. The
 * check itself appears instantly — state is information (ref 05).
 */

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { motionAllowed } from "@/lib/motion";

/** See accordion.tsx for why this starts optimistic and settles in an effect. */
function useTransitionsEnabled(): boolean {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = React.useState(true);

  React.useEffect(() => {
    setEnabled(motionAllowed(prefersReducedMotion));
  }, [prefersReducedMotion]);

  return enabled;
}

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const transitions = useTransitionsEnabled();

  return (
    <CheckboxPrimitive.Root
      className={cn(
        "group grid size-11 shrink-0 place-items-center rounded-card",
        "disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "grid size-5 place-items-center rounded-card border border-hairline bg-field",
          transitions ? "transition-colors duration-fast ease-out" : "transition-none",
          "group-hover:border-accent-text",
          "group-data-[state=checked]:border-accent group-data-[state=checked]:bg-accent",
          "group-data-[state=indeterminate]:border-accent group-data-[state=indeterminate]:bg-accent",
        )}
      >
        <CheckboxPrimitive.Indicator className="grid place-items-center text-on-accent">
          <Check
            className="size-4 group-data-[state=indeterminate]:hidden"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <Minus
            className="hidden size-4 group-data-[state=indeterminate]:block"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </CheckboxPrimitive.Indicator>
      </span>
    </CheckboxPrimitive.Root>
  );
}

export interface CheckboxFieldProps
  extends Omit<React.ComponentProps<typeof CheckboxPrimitive.Root>, "id" | "children"> {
  /** Required: ties the control to its <label> and to any aria-describedby. */
  id: string;
  /** Label content. Render the consent copy verbatim — never paraphrase it. */
  children: React.ReactNode;
  /** Class for the wrapping row, not the control. */
  className?: string;
  /** Class for the label text. */
  labelClassName?: string;
}

/**
 * Checkbox + real label, laid out so both halves clear 44px and long consent
 * copy wraps against the box rather than under it.
 */
function CheckboxField({
  id,
  children,
  className,
  labelClassName,
  ...props
}: CheckboxFieldProps) {
  return (
    <div className={cn("flex items-start gap-2", className)}>
      <Checkbox id={id} {...props} />
      <label
        htmlFor={id}
        className={cn(
          "min-h-11 flex-1 cursor-pointer py-2 text-body text-fg-muted",
          labelClassName,
        )}
      >
        {children}
      </label>
    </div>
  );
}

export { Checkbox, CheckboxField };
