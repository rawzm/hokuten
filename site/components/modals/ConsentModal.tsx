"use client";

/**
 * components/modals/ConsentModal.tsx — the privacy-choice bar.
 *
 * Spec of record: design-skill reference 04 → "Modals" (Razim's filename spec) —
 * "bottom-center rounded bar; serif title, sans body; actions Customise / Reject
 * All / Accept All. Outside click does NOT dismiss — dialog plays a 300ms shake
 * and `navigator.vibrate(50)` where supported; only explicit buttons close it.
 * Focus-trapped, Esc allowed after first interaction, `role="dialog"` +
 * labelled." Reference 07 lists "consent modal closable by outside click" as a
 * P0 ship-blocker.
 *
 * WHERE EACH RULE IS IMPLEMENTED
 * ------------------------------
 * The refusal itself lives in `components/ui/dialog.tsx`, which already exposes
 * `dismissible={false}`: it preventDefaults the close, fires `navigator.vibrate(50)`,
 * and plays the shared `animate-shake` keyframes (transform only, 300ms). Under
 * reduced motion it swaps the shake for a designed static state — the action row
 * takes the focus ring for `DUR.slow`. This file adds the third half of that
 * static state: a live-region message saying a choice is required, which is
 * announced in BOTH motion modes because a screen-reader user never perceived
 * the shake either.
 *
 * `dismissible` stays `false` for the whole life of the bar, so an outside click
 * can never close it. Esc is handled here instead: before the visitor has
 * touched anything it falls through to the same refusal; after a first
 * interaction this component preventDefaults Radix's own close (so the refusal
 * path stays out of it) and closes the bar itself, leaving NO record stored — so
 * the next visit asks again. That is the literal reading of "Esc allowed after
 * first interaction" without weakening "only explicit buttons close it".
 *
 * Copy comes from `CONSENT_COPY` in lib/consent.ts and is not retyped here.
 */

import * as React from "react";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { CONSENT_COPY, type ConsentChoice, type ConsentVia } from "@/lib/consent";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ConsentModalProps {
  open: boolean;
  /** An explicit answer. Always one of the three actions, or the panel's save. */
  onDecide: (choice: ConsentChoice, via: ConsentVia) => void;
  /** Esc after a first interaction. Stores nothing — the bar returns next visit. */
  onDismiss: () => void;
}

/** Empty until the bar refuses to close. `n` forces a re-announcement on repeats. */
type Notice = { text: string; n: number };

export function ConsentModal({ open, onDecide, onDismiss }: ConsentModalProps) {
  const panelId = React.useId();
  const [expanded, setExpanded] = React.useState(false);
  const [measurement, setMeasurement] = React.useState(true);
  const [notice, setNotice] = React.useState<Notice>({ text: "", n: 0 });

  /**
   * A ref, not state: Radix's Esc handler runs from a document-level listener in
   * the same event as React's onKeyDown, so a state update would not have been
   * committed yet and the handler would read a stale `false`.
   */
  const interacted = React.useRef(false);

  const announceRefusal = React.useCallback(() => {
    setNotice((current) => ({ text: CONSENT_COPY.refusalNotice, n: current.n + 1 }));
  }, []);

  const markInteracted = React.useCallback((event: React.SyntheticEvent) => {
    // Esc is the thing being gated — it must not also be what unlocks itself.
    if ("key" in event.nativeEvent && (event.nativeEvent as KeyboardEvent).key === "Escape") {
      return;
    }
    interacted.current = true;
  }, []);

  const decide = React.useCallback(
    (choice: ConsentChoice, via: ConsentVia) => {
      onDecide(choice, via);
    },
    [onDecide],
  );

  return (
    <Dialog open={open} dismissible={false}>
      <DialogContent
        placement="bottom"
        showClose={false}
        /* Clears the persistent bottom ticker (--ticker-h / --ticker-h-mobile)
           so the bar never sits on top of the live rate feed. */
        positionerClassName="pb-[calc(var(--ticker-h-mobile)+1rem)] sm:pb-[calc(var(--ticker-h)+1.5rem)]"
        className="max-w-3xl"
        onEscapeKeyDown={(event) => {
          if (!interacted.current) {
            // Fall through: ui/dialog.tsx refuses, shakes, and vibrates.
            announceRefusal();
            return;
          }
          // Take the close away from Radix so its refusal branch is skipped,
          // then close from here without recording an answer.
          event.preventDefault();
          onDismiss();
        }}
        onInteractOutside={() => {
          // Never preventDefault here — the refusal in ui/dialog.tsx is the P0
          // behaviour. This only adds the assistive-tech half of it.
          announceRefusal();
        }}
      >
        <div onPointerDown={markInteracted} onKeyDown={markInteracted}>
          <DialogHeader className="pr-0">
            <MicroLabel as="p">{CONSENT_COPY.microLabel}</MicroLabel>
            <DialogTitle>
              {CONSENT_COPY.title.before}
              <em className="italic">{CONSENT_COPY.title.accent}</em>
              {CONSENT_COPY.title.after}
            </DialogTitle>
            <DialogDescription className="max-w-[68ch]">{CONSENT_COPY.body}</DialogDescription>
          </DialogHeader>

          {expanded ? (
            <div id={panelId} className="mt-6 hairline-t pt-6">
              <p className="font-sans text-data text-fg-meta">{CONSENT_COPY.panelIntro}</p>

              <div className="mt-4 flex flex-col gap-5">
                <CheckboxField
                  id={`${panelId}-essential`}
                  checked
                  disabled
                  labelClassName="text-data"
                >
                  <span className="block font-sans text-body font-semibold text-fg">
                    {CONSENT_COPY.categories.essential.name}
                    <span className="micro-label ml-3 align-middle">
                      {CONSENT_COPY.categories.essential.lockedNote}
                    </span>
                  </span>
                  <span className="mt-1 block">
                    {CONSENT_COPY.categories.essential.detail}
                  </span>
                </CheckboxField>

                <CheckboxField
                  id={`${panelId}-measurement`}
                  checked={measurement}
                  onCheckedChange={(next) => setMeasurement(next === true)}
                  labelClassName="text-data"
                >
                  <span className="block font-sans text-body font-semibold text-fg">
                    {CONSENT_COPY.categories.measurement.name}
                  </span>
                  <span className="mt-1 block">
                    {CONSENT_COPY.categories.measurement.detail}
                  </span>
                </CheckboxField>
              </div>

              <Button
                type="button"
                variant="primary"
                size="md"
                className="mt-6"
                onClick={() => decide({ measurement }, "custom")}
              >
                {CONSENT_COPY.actions.save}
              </Button>
            </div>
          ) : null}

          {/* Always mounted so the first refusal is announced, not just the
              second. Empty renders to nothing and takes no vertical space. */}
          <p
            role="status"
            aria-live="polite"
            className={cn("flex items-start gap-1.5 font-sans text-data text-fg", notice.text && "mt-6")}
          >
            {notice.text ? (
              <React.Fragment key={notice.n}>
                <AlertCircle
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="mt-0.5 size-4 shrink-0"
                />
                <span>{notice.text}</span>
              </React.Fragment>
            ) : null}
          </p>

          <DialogFooter className="mt-6 gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="link"
              aria-expanded={expanded}
              aria-controls={expanded ? panelId : undefined}
              onClick={() => setExpanded((value) => !value)}
            >
              {CONSENT_COPY.actions.customise}
            </Button>

            {/* Reject and Accept carry identical weight on purpose: making the
                accepting action louder than the declining one is the dark
                pattern this bar exists to avoid. Neither is `primary`; inside
                the expanded panel, "Save choices" is the one primary. */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                onClick={() => decide({ measurement: false }, "reject-all")}
              >
                {CONSENT_COPY.actions.reject}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => decide({ measurement: true }, "accept-all")}
              >
                {CONSENT_COPY.actions.accept}
              </Button>
            </div>
          </DialogFooter>

          <p className="mt-4 font-sans text-data text-fg-meta">
            {CONSENT_COPY.policy.lead}
            <a
              href={CONSENT_COPY.policy.href}
              className="text-accent-text underline underline-offset-4"
            >
              {CONSENT_COPY.policy.label}
            </a>
            {CONSENT_COPY.policy.tail}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
