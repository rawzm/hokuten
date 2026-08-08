"use client";

/**
 * components/ui/accordion.tsx — disclosure rows for `#faq` (Radix), restyled to
 * Hokuten tokens. Governed by design-skill references 03 (hairline structure,
 * type ramp, Lucide iconography), 04 (`#faq` anatomy) and 05 (motion).
 *
 * ── Why a grid-template-rows transition, and why it is safe ────────────────
 * Ref 05 bans animating layout properties. An accordion has to resolve height
 * from 0 → auto, so this is the one sanctioned exception, implemented the least
 * expensive way available:
 *
 *   • The animated declaration is `grid-template-rows: 0fr → 1fr` on a wrapper
 *     whose single child carries `overflow: hidden; min-height: 0`. Only the
 *     wrapper's row track is re-solved per frame; the answer's own text is laid
 *     out once at its intrinsic size and is then clipped — no per-frame text
 *     re-wrap, which is what makes the naive `height`/`max-height` version
 *     thrash.
 *   • Radix's `--radix-accordion-content-height` var is deliberately NOT used:
 *     its intended companion is a CSS @keyframes pair, and new keyframes may
 *     only be declared in app/globals.css.
 *   • The transition lives on an inner wrapper, never on Radix's Content node.
 *     CollapsibleContentImpl sets `style.transitionDuration = "0s"` on that node
 *     and forces a reflow (getBoundingClientRect) on every state change to
 *     measure it — a transition declared there would be swallowed. Verified in
 *     @radix-ui/react-collapsible 1.1.x.
 *   • `forceMount` keeps the row mounted so the closed → open change is a real
 *     style change (Radix otherwise mounts the panel already-open). Because the
 *     answer then stays in the DOM, the closed state is `visibility: hidden`,
 *     which keeps it out of the accessibility tree and out of the tab order;
 *     visibility is transitioned alongside the rows so it only flips at the end
 *     of a close.
 *   • Reduced motion / global motion kill switch: transitions are dropped
 *     entirely and the row opens instantly — a designed static state.
 */

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { motionAllowed } from "@/lib/motion";

/**
 * True when transitions may run. Starts optimistic so SSR and hydration agree;
 * `prefers-reduced-motion` is already neutralised by globals.css before this
 * settles, and the effect then also honours the JS kill switch / data-saver.
 */
function useTransitionsEnabled(): boolean {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = React.useState(true);

  React.useEffect(() => {
    setEnabled(motionAllowed(prefersReducedMotion));
  }, [prefersReducedMotion]);

  return enabled;
}

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root className={cn("hairline-t", className)} {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("hairline-b", className)} {...props} />;
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const transitions = useTransitionsEnabled();
  const iconMotion = transitions
    ? "transition-[transform,opacity] duration-base ease-in-out"
    : "transition-none";

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex min-h-11 w-full items-start justify-between gap-6 py-5 text-left",
          "font-display text-heading font-light text-fg",
          transitions ? "transition-colors duration-fast ease-out" : "transition-none",
          "hover:text-accent-text",
          className,
        )}
        {...props}
      >
        <span className="flex-1">{children}</span>
        {/* Plus ⇄ Minus quarter-turn swap. Transform + opacity only. */}
        <span
          className="relative mt-1 grid size-6 shrink-0 place-items-center"
          aria-hidden="true"
        >
          <Plus
            className={cn(
              "col-start-1 row-start-1 size-4 text-accent-text",
              "rotate-0 opacity-100",
              "group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-0",
              iconMotion,
            )}
            strokeWidth={1.5}
          />
          <Minus
            className={cn(
              "col-start-1 row-start-1 size-4 text-accent-text",
              "-rotate-90 opacity-0",
              "group-data-[state=open]:rotate-0 group-data-[state=open]:opacity-100",
              iconMotion,
            )}
            strokeWidth={1.5}
          />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  const transitions = useTransitionsEnabled();

  return (
    <AccordionPrimitive.Content forceMount className="group/content" {...props}>
      <div
        data-animated=""
        className={cn(
          "invisible grid grid-rows-[0fr]",
          "group-data-[state=open]/content:visible group-data-[state=open]/content:grid-rows-[1fr]",
          transitions
            ? "transition-[grid-template-rows,visibility] duration-base ease-out"
            : "transition-none",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={cn("max-w-[68ch] pb-6 pr-6 text-body-lg text-fg-muted", className)}>
            {children}
          </div>
        </div>
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
