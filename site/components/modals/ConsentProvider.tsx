"use client";

/**
 * components/modals/ConsentProvider.tsx — mounts the privacy bar once and holds
 * the answer for the rest of the app.
 *
 * FIRST PAINT
 * -----------
 * Nothing is read from storage during render. `ready` starts `false`, so the
 * server HTML and the first client render are byte-identical and contain no bar
 * at all — there is no hydration mismatch to suppress and no storage access on
 * the critical path. The single `useEffect` below runs after first paint, reads
 * the stored answer, enforces it, and only then decides whether to show the bar.
 * The bar therefore arrives a frame late by design; blocking paint on a
 * localStorage read to avoid that would be the wrong trade.
 *
 * ENFORCEMENT ORDER
 * -----------------
 * `applyConsent` registers the measurement guard through the two Vercel SDK
 * queues (see lib/consent.ts). Both SDKs inject a `defer`red script from their
 * own effects, and both seed their queue only if it does not already exist, so
 * this effect lands in the queue before the script drains it regardless of which
 * component's effect runs first.
 *
 * MOUNT IT ONCE. Two providers would mean two bars and two guards; the second
 * `useConsent()` consumer would silently read the wrong one.
 */

import * as React from "react";

import {
  applyConsent,
  getConsent,
  setConsent,
  subscribeConsent,
  type ConsentChoice,
  type ConsentRecord,
  type ConsentVia,
} from "@/lib/consent";
import { ConsentModal } from "./ConsentModal";

export interface ConsentContextValue {
  /** The stored answer, or `null` when the visitor has not answered yet. */
  record: ConsentRecord | null;
  /** False until the after-paint read has happened. Nothing is known before it. */
  ready: boolean;
  /** Convenience: cookieless measurement permitted right now. */
  measurement: boolean;
  /** Record an answer and close the bar. */
  decide: (choice: ConsentChoice, via: ConsentVia) => void;
  /** Show the bar again — wire a footer "Privacy choices" control to this. */
  reopen: () => void;
}

const ConsentContext = React.createContext<ConsentContextValue | null>(null);

/**
 * Read the consent state. Returns `null` outside the provider rather than
 * throwing, so a component can be rendered in isolation (tests, a Phase 3 route
 * that does not mount the provider) without exploding.
 */
export function useConsent(): ConsentContextValue | null {
  return React.useContext(ConsentContext);
}

export interface ConsentProviderProps {
  /** Optional: the provider works as a leaf too. Children pass straight through. */
  children?: React.ReactNode;
}

export function ConsentProvider({ children }: ConsentProviderProps) {
  const [ready, setReady] = React.useState(false);
  const [record, setRecord] = React.useState<ConsentRecord | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const stored = getConsent();
    applyConsent(stored);
    setRecord(stored);
    setReady(true);
    setOpen(stored === null);

    // Another tab answering (or clearing) must not leave this tab disagreeing.
    return subscribeConsent(() => {
      const next = getConsent();
      setRecord(next);
      if (next !== null) setOpen(false);
    });
  }, []);

  const decide = React.useCallback((choice: ConsentChoice, via: ConsentVia) => {
    setRecord(setConsent(choice, via));
    setOpen(false);
  }, []);

  const reopen = React.useCallback(() => setOpen(true), []);

  const value = React.useMemo<ConsentContextValue>(
    () => ({
      record,
      ready,
      measurement: record ? record.measurement : true,
      decide,
      reopen,
    }),
    [record, ready, decide, reopen],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {ready && open ? (
        <ConsentModal
          open
          onDecide={decide}
          /* Esc after a first interaction: close, store nothing, ask again
             next visit. See the header note in ConsentModal. */
          onDismiss={() => setOpen(false)}
        />
      ) : null}
    </ConsentContext.Provider>
  );
}
