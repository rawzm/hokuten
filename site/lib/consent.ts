/**
 * lib/consent.ts — the privacy-choice record, its storage, and its enforcement.
 *
 * Governed by design-skill reference 04 → "Modals" (the consent bar is Razim's
 * filename spec: bottom-centre bar, Customise / Reject All / Accept All, outside
 * click refuses to dismiss) and reference 07 P0 ("consent modal closable by
 * outside click" is a ship-blocking failure).
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS SITE ACTUALLY DOES — the whole basis for the copy below
 * ---------------------------------------------------------------------------
 * Audited on 2026-08-08 against site/app/layout.tsx, site/lib/web3forms.ts and
 * site/components/forms/*:
 *
 *   • NO COOKIE IS SET. Not one, first- or third-party. There is no advertising
 *     tag, no consent-management vendor, no cross-site pixel, no session cookie.
 *   • The only client-side storage is the record written by this file:
 *     one localStorage key holding the visitor's own answer.
 *   • Measurement is @vercel/analytics + @vercel/speed-insights — both cookieless
 *     and aggregate (page visits, Web Vitals). Nothing else is instrumented.
 *   • Personal data leaves the browser exactly once: when the visitor presses
 *     send on the BOV form, and only the fields they filled in.
 *   • `/data/us-cities.min.json` is self-hosted; the city picker calls no
 *     third-party API.
 *
 * The copy in `CONSENT_COPY` describes that list and nothing else. It is
 * deliberately NOT a generic cookie banner: this notice may not claim to manage
 * cookies that do not exist, or to control tooling the site does not load. If a
 * cookie, tag or vendor is ever added, this file's audit paragraph, the copy,
 * `CONSENT_VERSION` and the category list must all change together — bumping the
 * version is what re-prompts everyone who already answered.
 *
 * NOT LEGAL ADVICE and not a compliance artefact: the binding text is the
 * /privacy route. This is the honest plain-language summary that sits in front
 * of it.
 */

import { LEGAL_ROUTES } from "@/content/site";

/* -------------------------------------------------------------------------- */
/*  Record shape + storage                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Bump when the categories, the tooling behind them, or the copy's factual
 * claims change. A stored record from an older version is treated as absent, so
 * the bar re-prompts rather than silently carrying a stale answer forward.
 */
export const CONSENT_VERSION = 1;

/** Single key. Namespaced so it cannot collide with anything else on the origin. */
export const CONSENT_STORAGE_KEY = "hokuten.consent";

/** How the answer was given. Kept because "reject all" and "custom, all off" are different acts. */
export type ConsentVia = "accept-all" | "reject-all" | "custom";

/**
 * The toggleable part of the answer.
 *
 * There is exactly one switch because there is exactly one non-essential thing
 * happening. Do not add speculative categories — an unused category is a claim
 * about behaviour that does not exist.
 */
export type ConsentChoice = {
  /** Cookieless, aggregate page-visit and page-speed counts. */
  measurement: boolean;
};

/** What is persisted. `essential` is not stored: it is not optional and never varies. */
export type ConsentRecord = ConsentChoice & {
  version: number;
  /** ISO 8601 UTC, `new Date().toISOString()`. */
  decidedAt: string;
  via: ConsentVia;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Narrow an unknown parsed blob to a current-version record. Anything else is `null`. */
function parseRecord(raw: string | null): ConsentRecord | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(parsed)) return null;
  if (parsed.version !== CONSENT_VERSION) return null;
  if (typeof parsed.measurement !== "boolean") return null;
  if (typeof parsed.decidedAt !== "string") return null;
  const via = parsed.via;
  if (via !== "accept-all" && via !== "reject-all" && via !== "custom") return null;
  return {
    version: CONSENT_VERSION,
    measurement: parsed.measurement,
    decidedAt: parsed.decidedAt,
    via,
  };
}

/**
 * Read the stored answer.
 *
 * Returns `null` on the server, when nothing is stored, when storage is
 * unavailable (Safari private mode, storage blocked), when the JSON is corrupt,
 * and when the stored version is stale. Every one of those means "ask again",
 * which is the safe direction.
 */
export function getConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    return parseRecord(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

/**
 * Record an answer, enforce it immediately, and notify subscribers.
 *
 * Enforcement is not deferred to a reload: `applyConsent` runs before the
 * listeners fire, so by the time any UI re-renders, measurement is already in
 * the state the record describes.
 *
 * Returns the record even if persistence failed — the answer still governs this
 * page view; it just will not survive a reload, and the visitor is asked again.
 */
export function setConsent(choice: ConsentChoice, via: ConsentVia): ConsentRecord {
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    measurement: choice.measurement,
    decidedAt: new Date().toISOString(),
    via,
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch {
      /* Storage unavailable. The choice still applies for this page view. */
    }
  }

  applyConsent(record);
  notify();
  return record;
}

/** Drop the stored answer (policy change, "ask me again", tests). */
export function clearConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* nothing to do */
  }
  applyConsent(null);
  notify();
}

/* -------------------------------------------------------------------------- */
/*  Subscription — same-tab and cross-tab                                      */
/* -------------------------------------------------------------------------- */

const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

/**
 * Subscribe to answer changes. Fires for `setConsent`/`clearConsent` in this tab
 * and for the same calls in another tab of the same origin (the `storage`
 * event), so two open tabs cannot disagree about the answer.
 */
export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== CONSENT_STORAGE_KEY) return;
    applyConsent(getConsent());
    listener();
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

/* -------------------------------------------------------------------------- */
/*  Enforcement — making "Reject all" mean something                           */
/* -------------------------------------------------------------------------- */

/**
 * Live measurement state, read by the guard installed below.
 *
 * Default `true` before any answer, which is exactly what the copy says: the
 * cookieless counts are already running, and declining stops them. Flipping this
 * default to `false` would be a product decision (it suppresses analytics for
 * every visitor who never answers) and would need the copy rewritten with it.
 */
let measurementGranted = true;
let guardInstalled = false;

/**
 * Vercel's two SDKs expose the same queue shape: a global function that either
 * pushes `[action, payload]` onto a queue for the not-yet-loaded script, or —
 * once the script has loaded — handles the action directly. Registering
 * `beforeSend` through it and returning `null` cancels the event before it is
 * sent. Verified against @vercel/analytics 2.0.1 (`src/queue.ts`, `src/generic.ts`
 * → `inject`) and @vercel/speed-insights 2.0.0 (same two files).
 *
 * The globals are reached through a local structural type rather than a
 * `declare global` block: augmenting `Window` from here would fight the
 * declarations the two packages already ship.
 */
type VercelQueueGlobals = {
  va?: (...args: unknown[]) => void;
  vaq?: unknown[][];
  si?: (...args: unknown[]) => void;
  siq?: unknown[][];
};

/**
 * Recreate the SDK's own `initQueue` when it has not run yet, then register.
 * Both SDKs guard their `initQueue` with `if (window.va) return;` /
 * `if (window.si) return;`, so seeding the queue first is safe in either
 * mount order and never produces a second queue.
 */
function registerBeforeSend(
  scope: VercelQueueGlobals,
  fnKey: "va" | "si",
  queueKey: "vaq" | "siq",
  handler: () => null | undefined,
): void {
  if (!scope[fnKey]) {
    scope[fnKey] = (...args: unknown[]) => {
      const queue = (scope[queueKey] ??= []);
      queue.push(args);
    };
  }
  scope[fnKey]?.("beforeSend", handler);
}

/**
 * Install the measurement guard exactly once per document.
 *
 * The handler closes over `measurementGranted` rather than over a snapshot, so a
 * later "Reject all" takes effect on the very next event without re-registering.
 */
function installMeasurementGuard(): void {
  if (guardInstalled || typeof window === "undefined") return;
  guardInstalled = true;

  const scope = window as unknown as VercelQueueGlobals;
  const gate = () => (measurementGranted ? undefined : null);

  registerBeforeSend(scope, "va", "vaq", gate);
  registerBeforeSend(scope, "si", "siq", gate);
}

/**
 * Make the record true of the running page.
 *
 * `null` (no answer yet) leaves measurement in its default state — see
 * `measurementGranted`. Calling this repeatedly is safe and cheap.
 */
export function applyConsent(record: ConsentRecord | null): void {
  measurementGranted = record ? record.measurement : true;
  installMeasurementGuard();
}

/** Is cookieless measurement permitted right now? */
export function measurementAllowed(): boolean {
  return measurementGranted;
}

/* -------------------------------------------------------------------------- */
/*  Copy                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The bar's copy deck.
 *
 * It lives here rather than in `site/content/` only because this agent does not
 * own `site/content/` — see the handover note in the build report. Move it to
 * `content/consent.ts` when that directory is next touched; nothing but
 * `ConsentModal` reads it.
 *
 * Voice check (ref 06): numbers-first, discreet, states the fact then stops. No
 * banned words ("unlock", "seamless", "Learn more", "Get started", "Submit"), no
 * exclamation marks, and no sentence that softens what is measured.
 */
export const CONSENT_COPY = {
  /** Bracketed mono index device. Rendered through <MicroLabel>. */
  microLabel: "Privacy",

  /** Serif title. The single italic accent word is `records` (ref 03: exactly one). */
  title: { before: "What this site ", accent: "records", after: "." },

  body:
    "No cookies are set here — no advertising tag, no cross-site tracking, no third-party profile. Two things happen instead: your answer below is kept in this browser so we do not ask again, and page visits and load times are counted anonymously, without cookies. The valuation form sends only what you type into it, only when you press send.",

  /** Shown when the bar refuses to dismiss. Announced politely; also visible. */
  refusalNotice: "A choice is required. Use Customise, Reject all, or Accept all.",

  actions: {
    customise: "Customise",
    reject: "Reject all",
    accept: "Accept all",
    save: "Save choices",
  },

  /** Introduces the expanded panel. */
  panelIntro: "Two categories, both listed in full.",

  categories: {
    essential: {
      name: "Strictly necessary",
      /** Rendered beside a checked, disabled control. */
      detail:
        "The answer you give here, stored in this browser's local storage so the notice does not return on every visit. That is the entire category — no cookie is set and nothing about it leaves your device.",
      lockedNote: "Always on",
    },
    measurement: {
      name: "Anonymous measurement",
      detail:
        "Cookieless page-visit and page-speed counts (Vercel Analytics and Speed Insights). Aggregate only: no cookie, no cross-site profile, no advertising use, nothing sold or shared. They are running now; declining stops them in this browser.",
    },
  },

  /** Sits under the actions. The binding text is the policy, not this notice. */
  policy: {
    lead: "The full detail is in the ",
    label: "Privacy Policy",
    href: LEGAL_ROUTES.privacy,
    tail: ".",
  },
} as const;
