"use client";

/**
 * components/ui/popover.tsx — the calculator's educational ⓘ popovers (Radix),
 * restyled to Hokuten tokens. Governed by design-skill references 03 (surfaces,
 * hairlines, shadows, Lucide iconography) and 07 (44px targets, keyboard reach,
 * no hover-only information).
 *
 * Deliberately un-animated: an explanatory popover carries information, so it
 * appears at once on every device and under every motion setting. Nothing here
 * transitions, which is why this file needs no reduced-motion gate (ref 05).
 *
 * Behaviour verified against @radix-ui/react-popover 1.1.23: the trigger is a
 * real <button> (Enter / Space open it), Esc closes, focus returns to the
 * trigger, and outside pointer-down dismisses. None of that is overridden here.
 */

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;
const PopoverClose = PopoverPrimitive.Close;

export interface PopoverInfoTriggerProps
  extends Omit<React.ComponentProps<typeof PopoverPrimitive.Trigger>, "children"> {
  /**
   * What this popover explains, as a sentence a screen-reader user can act on —
   * e.g. "What cap rate means". Becomes the button's accessible name; the icon
   * itself is decorative.
   */
  label: string;
}

/** 44px hit area, 16px Lucide Info glyph. The only trigger the calculator uses. */
function PopoverInfoTrigger({ className, label, ...props }: PopoverInfoTriggerProps) {
  return (
    <PopoverPrimitive.Trigger
      aria-label={label}
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-card",
        "text-fg-meta hover:text-accent-text data-[state=open]:text-accent-text",
        className,
      )}
      {...props}
    >
      <Info className="size-4" strokeWidth={1.5} aria-hidden="true" />
    </PopoverPrimitive.Trigger>
  );
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 8,
  collisionPadding = 16,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          "surface-card z-50 w-[min(300px,calc(100vw-2rem))] rounded-card p-4",
          "hairline shadow-overlay",
          "text-body text-fg",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

/** Optional mono kicker inside a popover, e.g. [ CAP RATE ]. */
function PopoverLabel({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("micro-label mb-2", className)} {...props} />;
}

export {
  Popover,
  PopoverTrigger,
  PopoverInfoTrigger,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverLabel,
};
