"use client";

/**
 * components/forms/BovForm.tsx — the Broker Opinion of Value request form.
 *
 * Ported from ~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html:1158-1215
 * (markup) and :2188-2266 (validation + submit) via
 * docs/port/05-forms-and-ticker.md §A. Section spec: design-skill reference 04 →
 * `#bov`. Compliance strings: content/compliance.ts, which is frozen.
 *
 * ── 2026-08-17, P10 / F28: WEB3FORMS IS GONE FROM THIS FORM ─────────────────
 * The browser no longer posts anywhere but our own origin. `POST
 * /api/contact-intake` (plan §3.7, docs/MONDAY-INTAKE-CONTRACT.md) does the
 * delivery server-side with protected credentials, so:
 *   • no access key, public-class or otherwise, is read here;
 *   • the "sending is not connected yet" disabled state is deleted — the button
 *     is always live, because the endpoint always exists;
 *   • the `mailto:` route stays, promoted to a permanent SECONDARY action
 *     rather than a substitute that only appears when something is broken.
 *
 * THE FIELD NAMES ARE A CONTRACT
 * ------------------------------
 * `name`, `hotel_name`, `city`, `state`, `phone`, `email`, `sms_consent` and
 * `botcheck` are parsed by name downstream. Renaming one does not error — the
 * lead just arrives blank. NOTHING existing was renamed for the new route.
 * `company`, `keys`, `brand`, `timeline`, `comments`, `state_code`, `page`,
 * `referrer` and the five `utm_*` keys are ADDITIONS (`V2` §2 line 31, contract
 * §3). The whole set is declared once in `lib/intake.ts`.
 *
 * TCPA / A2P 10DLC
 * ----------------
 * The consent label, its checkbox value and the audit-trail string are imported
 * from content/compliance.ts verbatim. The box ships UNCHECKED and is never
 * `required`. What CHANGED with the server route (contract §6, plan §3.7): the
 * browser now sends only the yes/no. The disclosure text and the consent
 * timestamp are minted by the SERVER, so a tampered payload cannot manufacture
 * a consent record — and a mobile number becomes required only when the box is
 * ticked. (The `mailto:` fallback still stamps client-side, because on that
 * path the resulting email is the only record there is.)
 *
 * SUCCESS IS INLINE, AND HONEST. The form never navigates away (ref 04 →
 * `#bov`), and it reports success only when the route confirms a receipt — an
 * item id from the CRM or a 2xx from the tested email webhook. A 502 is shown
 * as a failure with the mailto beside it; it is never dressed up as a send.
 *
 * ── DESIGN REVISIT 2 (2026-08-10) — D9's "a form to its own field measure" ──
 * `BovSection.tsx` (this form's only call site) moved from `container-hk`
 * (max-width 1200px) to the full-stage `stage-shell`, so this form's
 * `lg:grid-cols-[2fr_3fr]` right-hand column can be 900–1400px+ wide on a
 * real desktop, not the ~620px it used to get. D9 is explicit that "full
 * width" does not mean the FORM stretches to fill that — the composition may
 * use the stage, but a text input measured at 450–700px wide is not a
 * legible field, it's a UI defect. `lg:max-w-[42rem]` (672px) caps the field
 * grid at essentially the same per-field width the old 1200px layout produced
 * (~300px per field in the `sm:grid-cols-2` rows), so nothing here reads
 * differently sized than before; `lg:ml-auto` anchors that capped block to
 * the RIGHT edge of its (now much wider) grid column so it reads as "the
 * form, deliberately placed at the stage's right edge" rather than stranded
 * in the middle of unused space — the pitch column to its left already hugs
 * the stage's own left gutter, so the two anchor to opposite edges with one
 * breathing gap between them, not a centred island in the middle of a void.
 * Below `lg` the section drops to one column and this form is simply full
 * width, exactly as before — the cap/anchor only fire once the two-column
 * split exists to anchor against.
 * `BovSection.tsx`'s `<BovFormSkeleton>` mirrors this exact class pair so the
 * loading state reserves the identical box and hydration cannot shift it.
 */

import * as React from "react";
import { AlertCircle, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckboxField } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CityPicker, type CitySelection } from "./CityPicker";
import {
  EMPTY_PHONE,
  PhoneField,
  isPlausibleE164,
  toE164,
  type PhoneValue,
} from "./PhoneField";
import { AGENCY_RELATIONSHIP_NOTICE, SMS_CONSENT } from "@/content/compliance";
import { CONTACT, siteDomain } from "@/content/site";
import { bovPromise } from "@/content/methodology";
import {
  INTAKE_ENDPOINT,
  LIMITS,
  bovMailtoHref,
  type IntakeResponse,
} from "@/lib/intake";

/* -------------------------------------------------------------------------- */
/*  Copy deck                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Ported strings carry their source line. The NET-NEW entries have no
 * counterpart in the source (it leaned on native `required` bubbles, and its
 * failure messages were written for a developer, not a hotel owner). This deck
 * belongs in `site/content/bov.ts` — it lives here only because this agent does
 * not own `site/content/`. See the build report.
 */
const COPY = {
  labels: {
    name: "Name",
    hotelName: "Hotel name",
    city: "City, State",
    phone: "Phone",
    email: "Email",
    company: "Company",
    keys: "Keys",
    brand: "Brand or flag",
    timeline: "Timeline",
    comments: "Notes",
  },
  placeholders: {
    /** index.html:1176 */
    name: "Your name",
    /** index.html:1177 */
    hotelName: "Property name",
    /** index.html:1195 */
    email: "name@company.com",
    /** NET-NEW — the four optional fields added by `V2` §2 line 31. */
    company: "Ownership or operating entity",
    keys: "120",
    brand: "Independent, Marriott, Hilton…",
    timeline: "6–12 months",
  },
  hints: {
    phone: "Optional.",
    /** NET-NEW — a mobile number is required only when the SMS box is ticked. */
    phoneForSms: "Required while SMS consent is ticked.",
    optional: "Optional.",
    keys: "Optional. Room count.",
    comments: "Optional. T-12, STR report, franchise or PIP detail helps.",
  },
  errors: {
    /** NET-NEW — the source used the browser's native required bubble. */
    name: "Name is required.",
    /** NET-NEW — as above. */
    hotelName: "Hotel name is required.",
    /** index.html:2221 */
    city: "Please pick a city from the list.",
    /** index.html:2205 — the branch that ran without the library's metadata. */
    phone: "Enter a valid phone number.",
    /** NET-NEW — contract §6 / plan §3.7. */
    phoneForSms: "A mobile number is required when you agree to receive SMS messages.",
    /** index.html:2208 */
    emailRequired: "Email is required.",
    /** index.html:2209 */
    emailInvalid: "Enter a valid email address.",
    /** NET-NEW */
    keys: "Room count must be a whole number.",
    /** NET-NEW */
    tooLong: "This is longer than we can accept.",
  },
  status: {
    /** index.html:2225 */
    validationFailed: "Please fix the highlighted fields.",
    /** index.html:2237, U+2026 */
    sending: "Sending…",
    /** index.html:2253, first sentence. The promise itself is imported. */
    successLead: "Thank you — your request is in.",
    /** NET-NEW — the route could not confirm a receipt. Never dressed up. */
    undelivered: `We could not confirm delivery. Email ${CONTACT.email} with the same details and it reaches the same place.`,
    /** index.html:2263, team inbox substituted (docs/port/05 §A.6 VOICE). */
    network: `Network error. Please email ${CONTACT.email} directly.`,
    /** NET-NEW — the in-function backstop, or the edge rule, said no. */
    rateLimited: "Too many submissions from this address. Try again shortly.",
  },
  actions: {
    /** index.html:1206 */
    submit: "Send valuation request",
    /** NET-NEW */
    mailto: "Email the request",
  },
  /** NET-NEW — heads the error summary. */
  summaryHeading: "Please fix the highlighted fields.",
} as const;

/** index.html:2209 — the source's own regex, unchanged. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Abort a hung request rather than leaving a submit button spinning forever. */
const INTAKE_TIMEOUT_MS = 20_000;

/* -------------------------------------------------------------------------- */
/*  Validation                                                                 */
/* -------------------------------------------------------------------------- */

type FieldKey =
  | "name"
  | "hotelName"
  | "city"
  | "phone"
  | "email"
  | "company"
  | "keys"
  | "brand"
  | "timeline"
  | "comments";

type Errors = Partial<Record<FieldKey, string>>;

/**
 * The server keys its errors by WIRE name (`hotel_name`), the form by control
 * name (`hotelName`). One table, read in both directions, so a server-side
 * rejection lands on the right control instead of in the generic status line.
 */
const WIRE_NAME: Record<FieldKey, string> = {
  name: "name",
  hotelName: "hotel_name",
  city: "city",
  phone: "phone",
  email: "email",
  company: "company",
  keys: "keys",
  brand: "brand",
  timeline: "timeline",
  comments: "comments",
};

const FIELD_BY_WIRE_NAME: Record<string, FieldKey> = Object.fromEntries(
  (Object.keys(WIRE_NAME) as FieldKey[]).map((key) => [WIRE_NAME[key], key]),
);

function validateName(value: string): string | undefined {
  if (!value.trim()) return COPY.errors.name;
  return value.trim().length > LIMITS.name ? COPY.errors.tooLong : undefined;
}

function validateHotelName(value: string): string | undefined {
  if (!value.trim()) return COPY.errors.hotelName;
  return value.trim().length > LIMITS.hotelName ? COPY.errors.tooLong : undefined;
}

function validateCity(value: CitySelection | null): string | undefined {
  return value ? undefined : COPY.errors.city;
}

/**
 * Optional, EXCEPT while the SMS box is ticked (contract §6). Blank with the box
 * unticked is valid and clears the error (index.html:2199).
 */
function validatePhone(value: PhoneValue, smsConsent: boolean): string | undefined {
  const typed = value.national.trim();
  if (!typed) return smsConsent ? COPY.errors.phoneForSms : undefined;
  return isPlausibleE164(toE164(value.country, typed)) ? undefined : COPY.errors.phone;
}

function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return COPY.errors.emailRequired;
  if (trimmed.length > LIMITS.email) return COPY.errors.tooLong;
  return EMAIL_PATTERN.test(trimmed) ? undefined : COPY.errors.emailInvalid;
}

/** Blank is valid. A non-integer is not — the CRM note prints `keys <n>`. */
function validateKeys(value: string): string | undefined {
  const trimmed = value.replace(/[,\s]/g, "");
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  const valid =
    /^\d+$/.test(trimmed) && Number.isInteger(parsed) && parsed >= 1 && parsed <= LIMITS.keysMax;
  return valid ? undefined : COPY.errors.keys;
}

function validateLength(value: string, max: number): string | undefined {
  return value.trim().length > max ? COPY.errors.tooLong : undefined;
}

/** DOM order, so the summary reads in the order the fields appear. */
const FIELD_ORDER: readonly FieldKey[] = [
  "name",
  "hotelName",
  "city",
  "phone",
  "email",
  "company",
  "keys",
  "brand",
  "timeline",
  "comments",
];

type SubmitState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "failed"; message: string };

/* -------------------------------------------------------------------------- */
/*  Silent capture — page, referrer, UTM                                       */
/* -------------------------------------------------------------------------- */

type CapturedContext = {
  page: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
};

const EMPTY_CONTEXT: CapturedContext = {
  page: "",
  referrer: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
};

/**
 * Read once after mount, never rendered, never stored anywhere but this
 * component's own memory, and sent only as part of a submission the visitor
 * pressed send on. Reading it in an effect (not during render) keeps the server
 * and client markup identical, so nothing here can cause a hydration mismatch.
 *
 * It lands in a REF, not in state. Nothing here is rendered — no label, no
 * hidden input, no attribute reads it — so putting it in state would schedule a
 * second render of the entire form to carry a value no pixel depends on. That
 * is precisely the cascade `react-hooks/set-state-in-effect` names, and the
 * cure is not to silence the rule but to stop making it state: a mutable box
 * written after mount and read once, inside the submit handler, is what this
 * actually is. The write happens on mount, long before anyone can finish typing
 * a hotel name, so the value is always present by send time.
 *
 * The values come from the CURRENT url only. Campaign values that arrived on an
 * earlier page in the session are deliberately not resurrected from storage:
 * `lib/consent.ts` states, as an audited fact, that the only thing this site
 * writes to browser storage is the visitor's own privacy answer, and that
 * statement is load-bearing on the /privacy route.
 */
function useCapturedContext(): React.RefObject<CapturedContext> {
  const captured = React.useRef<CapturedContext>(EMPTY_CONTEXT);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const read = (key: string) => (params.get(key) ?? "").slice(0, LIMITS.utm);
    captured.current = {
      page: `${window.location.pathname}${window.location.search}`.slice(0, LIMITS.context),
      referrer: document.referrer.slice(0, LIMITS.context),
      utm_source: read("utm_source"),
      utm_medium: read("utm_medium"),
      utm_campaign: read("utm_campaign"),
      utm_term: read("utm_term"),
      utm_content: read("utm_content"),
    };
  }, []);

  return captured;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export interface BovFormProps {
  className?: string;
}

export function BovForm({ className }: BovFormProps) {
  const uid = React.useId();
  const fieldId = (key: FieldKey | "sms" | "agency") => `${uid}-${key}`;

  const [name, setName] = React.useState("");
  const [hotelName, setHotelName] = React.useState("");
  const [city, setCity] = React.useState<CitySelection | null>(null);
  const [phone, setPhone] = React.useState<PhoneValue>(EMPTY_PHONE);
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [keys, setKeys] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [timeline, setTimeline] = React.useState("");
  const [comments, setComments] = React.useState("");
  const [smsConsent, setSmsConsent] = React.useState(false);

  const [errors, setErrors] = React.useState<Errors>({});
  const [showSummary, setShowSummary] = React.useState(false);
  const [state, setState] = React.useState<SubmitState>({ kind: "idle" });

  const honeypotRef = React.useRef<HTMLInputElement>(null);
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const successRef = React.useRef<HTMLDivElement>(null);

  const capturedContext = useCapturedContext();

  /** Re-validate a field only once it is already in error (index.html:2211). */
  const revalidate = React.useCallback((key: FieldKey, error: string | undefined) => {
    setErrors((current) => {
      if (!current[key]) return current;
      if (current[key] === error) return current;
      const next = { ...current };
      if (error) next[key] = error;
      else delete next[key];
      return next;
    });
  }, []);

  const setError = React.useCallback((key: FieldKey, error: string | undefined) => {
    setErrors((current) => {
      if (current[key] === error) return current;
      const next = { ...current };
      if (error) next[key] = error;
      else delete next[key];
      return next;
    });
  }, []);

  /* Ticking the consent box turns phone from optional into required, so the
     phone row's error and hint must both react to it immediately rather than
     waiting for a submit to surprise the visitor. That reaction belongs to the
     tick — the event that caused it — not to an effect watching `smsConsent`
     after the fact: an effect there re-renders the form a second time for
     something the click already knew (`react-hooks/set-state-in-effect`), and
     it can only ever run late. `toggleSmsConsent` sets the flag and re-runs the
     phone rule under the NEW value in the same handler. It routes through
     `revalidate`, so a phone row that is not already in error stays quiet — a
     visitor ticking the box has not made a mistake yet. */
  const toggleSmsConsent = (next: boolean) => {
    setSmsConsent(next);
    revalidate("phone", validatePhone(phone, next));
  };

  const mailtoHref = bovMailtoHref(
    {
      name,
      hotelName,
      city: city?.city,
      state: city?.state,
      phone: toE164(phone.country, phone.national),
      email,
      company,
      keys,
      brand,
      timeline,
      comments,
      smsConsent,
    },
    siteDomain(),
  );

  const focusField = (key: FieldKey) => {
    document.getElementById(fieldId(key))?.focus();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.kind === "sending") return;

    /* Every validator runs — no short-circuit — so one pass paints every
       error, exactly as the source did (index.html:2214-2222). */
    const next: Errors = {};
    const assign = (key: FieldKey, error: string | undefined) => {
      if (error) next[key] = error;
    };
    assign("name", validateName(name));
    assign("hotelName", validateHotelName(hotelName));
    assign("city", validateCity(city));
    assign("phone", validatePhone(phone, smsConsent));
    assign("email", validateEmail(email));
    assign("company", validateLength(company, LIMITS.company));
    assign("keys", validateKeys(keys));
    assign("brand", validateLength(brand, LIMITS.brand));
    assign("timeline", validateLength(timeline, LIMITS.timeline));
    assign("comments", validateLength(comments, LIMITS.comments));

    setErrors(next);

    if (FIELD_ORDER.some((key) => next[key])) {
      setShowSummary(true);
      setState({ kind: "idle" });
      // Focus the summary, not the first bad field: it names every problem at
      // once and each entry is a link straight to its field.
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setShowSummary(false);
    setState({ kind: "sending" });

    /* The wire payload. `sms_consent` is the ONLY consent key sent — the
       disclosure text and the timestamp are the server's to write (contract §6),
       and sending them from here would be exactly the tampering surface the
       route is designed to ignore. */
    const payload = {
      name: name.trim(),
      hotel_name: hotelName.trim(),
      city: city ? city.city : "",
      state: city ? city.state : "",
      state_code: city ? city.stateCode : "",
      phone: toE164(phone.country, phone.national),
      email: email.trim(),
      company: company.trim(),
      keys: keys.replace(/[,\s]/g, ""),
      brand: brand.trim(),
      timeline: timeline.trim(),
      comments: comments.trim(),
      sms_consent: smsConsent,
      botcheck: honeypotRef.current?.checked ?? false,
      ...capturedContext.current,
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), INTAKE_TIMEOUT_MS);

    let result: IntakeResponse | null = null;
    let transportFailed = false;

    try {
      const response = await fetch(INTAKE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      result = (await response.json()) as IntakeResponse;
    } catch {
      transportFailed = true;
    } finally {
      clearTimeout(timer);
    }

    if (transportFailed || result === null) {
      setState({ kind: "failed", message: COPY.status.network });
      return;
    }

    if (result.ok) {
      setName("");
      setHotelName("");
      setCity(null);
      setPhone(EMPTY_PHONE);
      setEmail("");
      setCompany("");
      setKeys("");
      setBrand("");
      setTimeline("");
      setComments("");
      setSmsConsent(false);
      setErrors({});
      setShowSummary(false);
      setState({ kind: "sent" });
      window.requestAnimationFrame(() => successRef.current?.focus());
      return;
    }

    if (result.error === "validation" && result.fields) {
      const painted: Errors = {};
      for (const [wire, message] of Object.entries(result.fields)) {
        const key = FIELD_BY_WIRE_NAME[wire];
        if (key) painted[key] = message;
      }
      setErrors(painted);
      setShowSummary(Object.keys(painted).length > 0);
      setState(
        Object.keys(painted).length > 0
          ? { kind: "idle" }
          : { kind: "failed", message: COPY.status.undelivered },
      );
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setState({
      kind: "failed",
      message:
        result.error === "rate_limited" ? COPY.status.rateLimited : COPY.status.undelivered,
    });
  };

  const sending = state.kind === "sending";
  /* Derived, never stored: as each field is fixed its row leaves the summary
     instead of the whole block going stale until the next submit. */
  const summaryItems = FIELD_ORDER.filter((key) => errors[key]);

  return (
    <form
      className={cn("grid gap-6 sm:grid-cols-2 lg:ml-auto lg:max-w-[42rem]", className)}
      /* Our own messages, our own icons, our own summary — the native bubbles
         are unstyleable and would fire before any of it. */
      noValidate
      onSubmit={handleSubmit}
    >
      {/* Honeypot — hidden exactly as the source hides it (index.html:1172):
          inline display:none, out of the tab order, autocomplete off. The
          `botcheck` name is kept from the Web3Forms era on purpose: bot toolkits
          already fill it, and `/api/contact-intake` now reads it itself. A
          visually-hidden class would not do: the technique is the point, since a
          bot reads the computed style. */}
      <input
        ref={honeypotRef}
        type="checkbox"
        name="botcheck"
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
        defaultChecked={false}
      />

      {state.kind === "sent" ? (
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          className="sm:col-span-2 hairline rounded-card p-5"
        >
          <p className="flex items-start gap-2 font-sans text-body text-fg">
            <Check aria-hidden="true" strokeWidth={1.5} className="mt-1 size-4 shrink-0" />
            <span>
              {COPY.status.successLead} {bovPromise}
            </span>
          </p>
        </div>
      ) : null}

      {showSummary && summaryItems.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className={cn(
            "sm:col-span-2 rounded-card p-5",
            "border border-brick",
            "[.surface-dark_&]:border-[color-mix(in_srgb,var(--brick)_55%,var(--paper))]",
          )}
        >
          <p className="flex items-start gap-2 font-sans text-body font-semibold text-fg">
            <AlertCircle aria-hidden="true" strokeWidth={1.5} className="mt-1 size-4 shrink-0" />
            <span>{COPY.summaryHeading}</span>
          </p>
          <ul className="mt-3 flex flex-col gap-1">
            {summaryItems.map((key) => (
              <li key={key} className="font-sans text-data">
                <a
                  href={`#${fieldId(key)}`}
                  className="text-accent-text underline underline-offset-4"
                  onClick={(event) => {
                    event.preventDefault();
                    focusField(key);
                  }}
                >
                  {COPY.labels[key]}: {errors[key]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Field id={fieldId("name")} label={COPY.labels.name} required error={errors.name}>
        {(control) => (
          <Input
            {...control}
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name}
            placeholder={COPY.placeholders.name}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              revalidate("name", validateName(event.target.value));
            }}
            onBlur={() => setError("name", validateName(name))}
          />
        )}
      </Field>

      <Field
        id={fieldId("hotelName")}
        label={COPY.labels.hotelName}
        required
        error={errors.hotelName}
      >
        {(control) => (
          <Input
            {...control}
            type="text"
            autoComplete="off"
            maxLength={LIMITS.hotelName}
            placeholder={COPY.placeholders.hotelName}
            value={hotelName}
            onChange={(event) => {
              setHotelName(event.target.value);
              revalidate("hotelName", validateHotelName(event.target.value));
            }}
            onBlur={() => setError("hotelName", validateHotelName(hotelName))}
          />
        )}
      </Field>

      <Field
        id={fieldId("city")}
        label={COPY.labels.city}
        required
        error={errors.city}
        className="sm:col-span-2"
      >
        {(control) => (
          <CityPicker
            {...control}
            value={city}
            onChange={(next) => {
              setCity(next);
              revalidate("city", validateCity(next));
            }}
            onBlur={() => {
              // Only paint the error once it has already been raised — a person
              // tabbing past an untouched field has not made a mistake yet.
              revalidate("city", validateCity(city));
            }}
          />
        )}
      </Field>

      <Field
        id={fieldId("phone")}
        label={COPY.labels.phone}
        hint={smsConsent ? COPY.hints.phoneForSms : COPY.hints.phone}
        error={errors.phone}
      >
        {(control) => (
          <PhoneField
            {...control}
            value={phone}
            onChange={(next) => {
              setPhone(next);
              // index.html:2185 — a country change clears the error and re-checks.
              revalidate("phone", validatePhone(next, smsConsent));
            }}
            onBlur={() => setError("phone", validatePhone(phone, smsConsent))}
          />
        )}
      </Field>

      <Field id={fieldId("email")} label={COPY.labels.email} required error={errors.email}>
        {(control) => (
          <Input
            {...control}
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={LIMITS.email}
            placeholder={COPY.placeholders.email}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              revalidate("email", validateEmail(event.target.value));
            }}
            onBlur={() => setError("email", validateEmail(email))}
          />
        )}
      </Field>

      {/* ── The five optional fields `V2` §2 line 31 asks for. Every one is
          genuinely optional: none is `required`, none blocks a send, and a
          blank one is simply omitted from the CRM note rather than written as
          an empty segment. They sit after the required core so the shortest
          honest path through the form is unchanged. ── */}

      <Field
        id={fieldId("company")}
        label={COPY.labels.company}
        hint={COPY.hints.optional}
        error={errors.company}
      >
        {(control) => (
          <Input
            {...control}
            type="text"
            autoComplete="organization"
            maxLength={LIMITS.company}
            placeholder={COPY.placeholders.company}
            value={company}
            onChange={(event) => {
              setCompany(event.target.value);
              revalidate("company", validateLength(event.target.value, LIMITS.company));
            }}
            onBlur={() => setError("company", validateLength(company, LIMITS.company))}
          />
        )}
      </Field>

      <Field
        id={fieldId("keys")}
        label={COPY.labels.keys}
        hint={COPY.hints.keys}
        error={errors.keys}
      >
        {(control) => (
          <Input
            {...control}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={7}
            placeholder={COPY.placeholders.keys}
            value={keys}
            onChange={(event) => {
              setKeys(event.target.value);
              revalidate("keys", validateKeys(event.target.value));
            }}
            onBlur={() => setError("keys", validateKeys(keys))}
          />
        )}
      </Field>

      <Field
        id={fieldId("brand")}
        label={COPY.labels.brand}
        hint={COPY.hints.optional}
        error={errors.brand}
      >
        {(control) => (
          <Input
            {...control}
            type="text"
            autoComplete="off"
            maxLength={LIMITS.brand}
            placeholder={COPY.placeholders.brand}
            value={brand}
            onChange={(event) => {
              setBrand(event.target.value);
              revalidate("brand", validateLength(event.target.value, LIMITS.brand));
            }}
            onBlur={() => setError("brand", validateLength(brand, LIMITS.brand))}
          />
        )}
      </Field>

      <Field
        id={fieldId("timeline")}
        label={COPY.labels.timeline}
        hint={COPY.hints.optional}
        error={errors.timeline}
      >
        {(control) => (
          <Input
            {...control}
            type="text"
            autoComplete="off"
            maxLength={LIMITS.timeline}
            placeholder={COPY.placeholders.timeline}
            value={timeline}
            onChange={(event) => {
              setTimeline(event.target.value);
              revalidate("timeline", validateLength(event.target.value, LIMITS.timeline));
            }}
            onBlur={() => setError("timeline", validateLength(timeline, LIMITS.timeline))}
          />
        )}
      </Field>

      <Field
        id={fieldId("comments")}
        label={COPY.labels.comments}
        hint={COPY.hints.comments}
        error={errors.comments}
        className="sm:col-span-2"
      >
        {(control) => (
          <Textarea
            {...control}
            maxLength={LIMITS.comments}
            value={comments}
            onChange={(event) => {
              setComments(event.target.value);
              revalidate("comments", validateLength(event.target.value, LIMITS.comments));
            }}
            onBlur={() => setError("comments", validateLength(comments, LIMITS.comments))}
          />
        )}
      </Field>

      {/* SMS consent — byte-exact from content/compliance.ts. Unchecked, never
          required, scoped to SMS only, separate from the request above. Only the
          yes/no crosses the wire; the disclosure text and the timestamp are
          written by the server (contract §6). */}
      <div className="sm:col-span-2">
        <CheckboxField
          id={fieldId("sms")}
          checked={smsConsent}
          onCheckedChange={(next) => toggleSmsConsent(next === true)}
          labelClassName="text-data"
        >
          {SMS_CONSENT.labelSegments.before}
          <strong className="font-semibold text-fg">{SMS_CONSENT.labelSegments.emphasis}</strong>
          {SMS_CONSENT.labelSegments.after}
        </CheckboxField>

        <p className="mt-2 pl-13 font-sans text-data text-fg-meta">
          {SMS_CONSENT.links.lead}
          <a
            href={SMS_CONSENT.links.privacyHref}
            target="_blank"
            rel="noopener"
            className="text-accent-text underline underline-offset-4"
          >
            {SMS_CONSENT.links.privacyLabel}
          </a>
          {SMS_CONSENT.links.separator}
          <a
            href={SMS_CONSENT.links.smsHref}
            target="_blank"
            rel="noopener"
            className="text-accent-text underline underline-offset-4"
          >
            {SMS_CONSENT.links.smsLabel}
          </a>
          {SMS_CONSENT.links.tail}
        </p>
      </div>

      {/* Plain-language agency statement (plan §3.7, `V2` §2). It is wired to
          the submit button with `aria-describedby`, so it is announced as part
          of the act of sending rather than left as decoration, and the same
          string is recorded server-side in the CRM Update — the record shows
          what the visitor was actually shown. */}
      <p
        id={fieldId("agency")}
        className="sm:col-span-2 font-sans text-data text-fg-meta"
      >
        {AGENCY_RELATIONSHIP_NOTICE}
      </p>

      <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          size="lg"
          loading={sending}
          loadingLabel={COPY.status.sending}
          aria-describedby={fieldId("agency")}
        >
          {COPY.actions.submit}
        </Button>

        {/* Permanent secondary action, not a broken-state substitute. Carries
            every value already typed, so choosing it costs nothing. */}
        <Button asChild variant="ghost" size="lg">
          <a href={mailtoHref}>{COPY.actions.mailto}</a>
        </Button>
      </div>

      {/* min-h reserves the line so an appearing message never shifts layout
          (source: `.bov-status { min-height: 20px }`). */}
      <p
        role="status"
        aria-live="polite"
        className="sm:col-span-2 min-h-5 font-sans text-data text-fg-muted"
      >
        {state.kind === "failed" ? state.message : null}
      </p>
    </form>
  );
}
