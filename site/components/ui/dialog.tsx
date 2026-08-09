"use client";

/**
 * components/ui/dialog.tsx — Dialog / modal primitive (Radix), restyled to
 * Hokuten tokens.
 *
 * Governed by design-skill references 03 (surfaces, hairlines, radii, shadows),
 * 04 → Modals (the consent modal is NON-dismissible: outside click and Esc play
 * a 300ms shake + haptic, they never close it — P0 audit gate in ref 07) and
 * 05 (motion: transform/opacity only, two easings, designed reduced-motion
 * state).
 *
 * Focus trap, focus restore, scroll lock and `aria-labelledby` /
 * `aria-describedby` wiring all come from Radix and are deliberately left
 * intact — verified against @radix-ui/react-dialog 1.1.23:
 *   • DialogContentModal sets `trapFocus` and restores focus to the trigger in
 *     `onCloseAutoFocus` (never override that handler here).
 *   • DialogContent sets `aria-labelledby` only when a <DialogTitle> is present
 *     and `aria-describedby` only when a <DialogDescription> is present, so a
 *     title-less dialog degrades cleanly. Always render a DialogTitle — use
 *     `className="visually-hidden"` when the design has no visible one.
 *
 * Open/close is animated with motion/react (AnimatePresence + forceMount)
 * rather than CSS: Radix's Presence waits on CSS *animations*, and new keyframes
 * may not be added outside app/globals.css. Only opacity + translateY move.
 *
 * D7 LazyMotion (2026-08-08): the two `motion.div`s below are `m.div` — the
 * tree-shakeable "motion/react-m" export, fed by the `<LazyMotion
 * features={domAnimation}>` provider in app/layout.tsx. That provider was
 * placed there, wrapping ConsentProvider (and therefore ConsentModal, which
 * renders THIS component), specifically because it must — verified against
 * framer-motion 13.0.0 — a `m.*` element with no <LazyMotion> ancestor never
 * resolves a renderer and never mounts a visualElement. `AnimatePresence`
 * stays imported from "motion/react": it is not exported from
 * "motion/react-m" at all (framer-motion/m only exports flat tag
 * components — confirmed by reading its .d.ts) and per framer-motion's own
 * docs it works underneath LazyMotion regardless of import source.
 */

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, useReducedMotion, type MotionProps } from "motion/react";
import * as m from "motion/react-m";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { DIST, DUR, DUR_MS, EASE, motionAllowed } from "@/lib/motion";

/* -------------------------------------------------------------------------- */
/*  Root                                                                       */
/* -------------------------------------------------------------------------- */

type DialogContextValue = {
  open: boolean;
  /** false = consent-modal mode: outside click / Esc shake instead of closing */
  dismissible: boolean;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext(consumer: string): DialogContextValue {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error(`<${consumer}> must be rendered inside <Dialog>.`);
  }
  return context;
}

export interface DialogProps
  extends Omit<React.ComponentProps<typeof DialogPrimitive.Root>, "children"> {
  children?: React.ReactNode;
  /**
   * When false the dialog refuses to close on outside click or Esc: it plays a
   * 300ms shake (or, under reduced motion, briefly rings its action buttons)
   * and fires a 50ms haptic where supported. Only explicit buttons close it.
   * Required by the consent-modal spec (ref 04 → Modals).
   */
  dismissible?: boolean;
}

function Dialog({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  dismissible = true,
  modal = true,
  ...props
}: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const context = React.useMemo<DialogContextValue>(
    () => ({ open, dismissible }),
    [open, dismissible],
  );

  return (
    <DialogContext.Provider value={context}>
      <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange} modal={modal} {...props}>
        {children}
      </DialogPrimitive.Root>
    </DialogContext.Provider>
  );
}

const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */

/** Where the panel sits. "bottom" is the consent bar (ref 04 → Modals). */
type DialogPlacement = "center" | "bottom";

const PLACEMENT: Record<DialogPlacement, string> = {
  center: "items-center justify-center p-4 sm:p-6",
  bottom: "items-end justify-center p-4 sm:p-6",
};

/** idle → shake (motion allowed) | attention (reduced motion / motion off) */
type RefusalFeedback = "idle" | "shake" | "attention";

export interface DialogContentProps
  extends React.ComponentProps<typeof DialogPrimitive.Content> {
  placement?: DialogPlacement;
  /** Render the X close control. Defaults to the dialog's `dismissible` mode. */
  showClose?: boolean;
  closeLabel?: string;
  /** Class applied to the fixed positioning layer, not the panel. */
  positionerClassName?: string;
}

function DialogContent({
  className,
  children,
  placement = "center",
  showClose,
  closeLabel = "Close",
  positionerClassName,
  onEscapeKeyDown,
  onInteractOutside,
  ...props
}: DialogContentProps) {
  const { open, dismissible } = useDialogContext("DialogContent");
  const prefersReducedMotion = useReducedMotion();
  const [feedback, setFeedback] = React.useState<RefusalFeedback>("idle");

  // Safe to read at render time: everything below lives inside a Radix Portal,
  // which returns null until it has mounted on the client — so this never runs
  // during SSR or the hydration pass and cannot desync the markup.
  const animate = motionAllowed(prefersReducedMotion);

  /** Refuse to close: haptic + shake, or the designed static ring instead. */
  const refuse = React.useCallback(() => {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(50);
    }
    setFeedback((current) => {
      if (current !== "idle") return current; // already playing — don't restart
      return motionAllowed(prefersReducedMotion) ? "shake" : "attention";
    });
  }, [prefersReducedMotion]);

  React.useEffect(() => {
    if (feedback === "idle") return;
    const hold = feedback === "shake" ? DUR_MS.base : DUR_MS.slow;
    const timer = window.setTimeout(() => setFeedback("idle"), hold);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const overlayMotion: MotionProps = animate
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: DUR.base, ease: EASE.inOut },
      }
    : { initial: false };

  const panelMotion: MotionProps = animate
    ? {
        initial: { opacity: 0, y: DIST.page },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: DIST.page },
        transition: { duration: DUR.base, ease: EASE.inOut },
      }
    : { initial: false };

  const withClose = showClose ?? dismissible;

  return (
    <AnimatePresence>
      {open ? (
        <DialogPrimitive.Portal forceMount>
          <DialogPrimitive.Overlay asChild forceMount>
            {/* Scrim is ink-tinted, never a gray: bg-ink/60 compiles to
                color-mix(… var(--ink) 60%, transparent) in both themes. */}
            <m.div className="fixed inset-0 z-50 bg-ink/60" {...overlayMotion} />
          </DialogPrimitive.Overlay>

          {/* Positioning layer. Kept separate from the panel so motion owns the
              panel transform outright — a Tailwind centring transform utility
              would be overwritten by the animated inline transform. */}
          <div
            className={cn(
              "pointer-events-none fixed inset-0 z-50 flex",
              PLACEMENT[placement],
              positionerClassName,
            )}
          >
            <DialogPrimitive.Content
              asChild
              forceMount
              onEscapeKeyDown={(event) => {
                onEscapeKeyDown?.(event);
                if (event.defaultPrevented) return;
                if (!dismissible) {
                  event.preventDefault();
                  refuse();
                }
              }}
              onInteractOutside={(event) => {
                onInteractOutside?.(event);
                if (event.defaultPrevented) return;
                if (!dismissible) {
                  event.preventDefault();
                  refuse();
                }
              }}
              {...props}
            >
              <m.div
                data-animated=""
                data-shake={feedback === "shake" ? "true" : undefined}
                data-attention={feedback === "attention" ? "true" : undefined}
                className={cn(
                  "surface-card pointer-events-auto relative w-full max-w-lg rounded-card p-6 sm:p-8",
                  "hairline shadow-overlay",
                  "max-h-[calc(100dvh-2rem)] overflow-y-auto",
                  // Refusal, motion path: the shared hk-shake keyframes.
                  "data-[shake=true]:animate-shake",
                  // Refusal, reduced-motion path: a designed static state — the
                  // action buttons take the focus ring for DUR.slow instead.
                  "data-[attention=true]:[&_button]:outline-2",
                  "data-[attention=true]:[&_button]:outline-offset-2",
                  "data-[attention=true]:[&_button]:outline-focus",
                  className,
                )}
                {...panelMotion}
              >
                {children}
                {withClose ? (
                  <DialogPrimitive.Close
                    aria-label={closeLabel}
                    className={cn(
                      "absolute right-2 top-2 grid size-11 place-items-center rounded-card",
                      "text-fg-meta hover:text-fg",
                    )}
                  >
                    <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  </DialogPrimitive.Close>
                ) : null}
              </m.div>
            </DialogPrimitive.Content>
          </div>
        </DialogPrimitive.Portal>
      ) : null}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*  Layout + typography slots                                                  */
/* -------------------------------------------------------------------------- */

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 pr-10", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("font-display text-heading font-light text-fg", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-body text-fg-muted", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
