"use client";

/**
 * components/ui/select.tsx — the calculator's dropdowns (Radix), restyled to
 * Hokuten tokens. Governed by design-skill references 03 (form fields: --card
 * on paper, 2px radius, hairline border, 16px+ text for the iOS anti-zoom rule)
 * and 07 (44px targets, visible focus, keyboard reach).
 *
 * The trigger reads as an Input: same height, hairline, radius and field
 * background, so a Select and an Input can sit in the same row of the
 * calculator without a seam. The focus ring comes from the base layer in
 * globals.css — never removed here.
 *
 * Motion: only the chevron rotates (transform) and colours cross-fade, both
 * gated on reduced motion / the global kill switch. Content mounts instantly;
 * an option list is information, not spectacle (ref 05).
 */

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { motionAllowed } from "@/lib/motion";

const NO_OP_SUBSCRIBE = () => () => {};

/** See accordion.tsx for why the snapshot is optimistic on the server. */
function useTransitionsEnabled(): boolean {
  const prefersReducedMotion = useReducedMotion();
  const getSnapshot = React.useCallback(
    () => motionAllowed(prefersReducedMotion),
    [prefersReducedMotion],
  );
  return React.useSyncExternalStore(NO_OP_SUBSCRIBE, getSnapshot, () => true);
}

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  const transitions = useTransitionsEnabled();

  return (
    <SelectPrimitive.Trigger
      className={cn(
        "group flex min-h-11 w-full items-center justify-between gap-3 rounded-card px-3 py-2",
        "border border-hairline bg-field",
        "text-body text-fg data-[placeholder]:text-fg-meta",
        transitions ? "transition-colors duration-fast ease-out" : "transition-none",
        "hover:border-accent-text",
        "disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-fg-meta",
            "group-data-[state=open]:rotate-180",
            transitions ? "transition-transform duration-fast ease-out" : "transition-none",
          )}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn("flex h-6 items-center justify-center text-fg-meta", className)}
      {...props}
    >
      <ChevronUp className="size-4" strokeWidth={1.5} aria-hidden="true" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn("flex h-6 items-center justify-center text-fg-meta", className)}
      {...props}
    >
      <ChevronDown className="size-4" strokeWidth={1.5} aria-hidden="true" />
    </SelectPrimitive.ScrollDownButton>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={sideOffset}
        className={cn(
          "surface-card z-50 overflow-hidden rounded-card",
          "hairline shadow-overlay",
          // Radix exposes these two only in `popper` position.
          position === "popper" &&
            "max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)]",
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label className={cn("micro-label px-3 py-2", className)} {...props} />;
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex min-h-11 w-full cursor-default select-none items-center rounded-card",
        "py-2 pl-3 pr-9 text-body text-fg",
        "data-[highlighted]:bg-accent-chip data-[highlighted]:text-ink",
        "data-[disabled]:pointer-events-none data-[disabled]:text-fg-meta",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-3 grid size-4 place-items-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4 text-accent-text" strokeWidth={1.5} aria-hidden="true" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator className={cn("my-1 hairline-t", className)} {...props} />;
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
