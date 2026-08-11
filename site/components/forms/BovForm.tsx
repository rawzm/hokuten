"use client";

/**
 * components/forms/BovForm.tsx — the Broker Opinion of Value request form.
 *
 * Ported from ~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html:1158-1215
 * (markup) and :2188-2266 (validation + submit) via
 * docs/port/05-forms-and-ticker.md §A. Section spec: design-skill reference 04 →
 * `#bov`. Compliance strings: content/compliance.ts, which is frozen.
 *
 * THE FIELD NAMES ARE A CONTRACT
 * ------------------------------
 * `name`, `hotel_name`, `city`, `state`, `phone`, `email`, `sms_consent`,
 * `sms_consent_text`, `consent_timestamp` and `botcheck` are parsed by name at
 * the destination inbox. Renaming one does not error — the lead just arrives
 * blank. They are all produced by `buildBovPayload` in lib/web3forms.ts and are
 * not spelled out again here.
 *
 * TCPA / A2P 10DLC
 * ----------------
 * The consent label, its checkbox value, the hidden audit-trail string and the
 * ISO timestamp are imported from content/compliance.ts verbatim. The box ships
 * UNCHECKED and is never `required`; `consent_timestamp` is stamped on EVERY
 * submit whether or not it is ticked (port rule R4). Paraphrasing any of it is a
 * P0 compliance failure, so nothing in this file retypes it.
 *
 * WHEN THE ACCESS KEY IS MISSING
 * ------------------------------
 * `NEXT_PUBLIC_WEB3FORMS_KEY` is not provisioned yet. The form still renders in
 * full and stays completely keyboard- and screen-reader-operable — every label,
 * every validation message, the city picker and the phone control all work. Only
 * the send button is disabled, with a plain explanation of why and a mailto
 * fallback that carries the same information the POST would have carried, so
 * nothing typed is wasted. It never silently no-ops and never fakes a success.
 *
 * SUCCESS IS INLINE. The form never navigates away (ref 04 → `#bov`).
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
import { CityPicker, type CitySelection } from "./CityPicker";
import {
  EMPTY_PHONE,
  PhoneField,
  isPlausibleE164,
  toE164,
  type PhoneValue,
} from "./PhoneField";
import { SMS_CONSENT } from "@/content/compliance";
import { CONTACT } from "@/content/site";
import { bovPromise } from "@/content/methodology";
import {
  bovMailtoHref,
  buildBovPayload,
  isWeb3FormsConfigured,
  submitWeb3Forms,
  web3formsKey,
} from "@/lib/web3forms";

/* -------------------------------------------------------------------------- */
/*  Copy deck                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Ported strings carry their source line. The four marked NET-NEW have no
 * counterpart in the source (it leaned on native `required` bubbles for the two
 * text fields, and its unconfigured-key message was written for a developer, not
 * a hotel owner). This deck belongs in `site/content/bov.ts` — it lives here only
 * because this agent does not own `site/content/`. See the build report.
 */
const COPY = {
  labels: {
    name: "Name",
    hotelName: "Hotel name",
    city: "City, State",
    phone: "Phone",
    email: "Email",
  },
  placeholders: {
    /** index.html:1176 */
    name: "Your name",
    /** index.html:1177 */
    hotelName: "Property name",
    /** index.html:1195 */
    email: "name@company.com",
  },
  hints: {
    phone: "Optional.",
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
    /** index.html:2208 */
    emailRequired: "Email is required.",
    /** index.html:2209 */
    emailInvalid: "Enter a valid email address.",
  },
  status: {
    /** index.html:2225 */
    validationFailed: "Please fix the highlighted fields.",
    /** index.html:2237, U+2026 */
    sending: "Sending…",
    /** index.html:2253, first sentence. The promise itself is imported. */
    successLead: "Thank you — your request is in.",
    /** index.html:2258, team inbox substituted (docs/port/05 §A.6 VOICE). */
    rejected: `Something went wrong. Please email ${CONTACT.email} directly.`,
    /** index.html:2263, same substitution. */
    network: `Network error. Please email ${CONTACT.email} directly.`,
  },
  /** NET-NEW — visitor-facing replacement for index.html:2233. */
  unconfigured:
    "Sending from this page is not connected yet. Email the same details instead and it reaches the same place.",
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

/* -------------------------------------------------------------------------- */
/*  Validation                                                                 */
/* -------------------------------------------------------------------------- */

type FieldKey = "name" | "hotelName" | "city" | "phone" | "email";
type Errors = Partial<Record<FieldKey, string>>;

function validateName(value: string): string | undefined {
  return value.trim() ? undefined : COPY.errors.name;
}

function validateHotelName(value: string): string | undefined {
  return value.trim() ? undefined : COPY.errors.hotelName;
}

function validateCity(value: CitySelection | null): string | undefined {
  return value ? undefined : COPY.errors.city;
}

/** Optional field: blank is valid and clears the error (index.html:2199). */
function validatePhone(value: PhoneValue): string | undefined {
  if (!value.national.trim()) return undefined;
  return isPlausibleE164(toE164(value.country, value.national)) ? undefined : COPY.errors.phone;
}

function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return COPY.errors.emailRequired;
  return EMAIL_PATTERN.test(trimmed) ? undefined : COPY.errors.emailInvalid;
}

/** DOM order, so the summary reads in the order the fields appear. */
const FIELD_ORDER: readonly FieldKey[] = ["name", "hotelName", "city", "phone", "email"];

type SubmitState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "failed"; message: string };

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export interface BovFormProps {
  className?: string;
}

export function BovForm({ className }: BovFormProps) {
  const uid = React.useId();
  const fieldId = (key: FieldKey | "sms" | "unconfigured") => `${uid}-${key}`;

  const [name, setName] = React.useState("");
  const [hotelName, setHotelName] = React.useState("");
  const [city, setCity] = React.useState<CitySelection | null>(null);
  const [phone, setPhone] = React.useState<PhoneValue>(EMPTY_PHONE);
  const [email, setEmail] = React.useState("");
  const [smsConsent, setSmsConsent] = React.useState(false);

  const [errors, setErrors] = React.useState<Errors>({});
  const [showSummary, setShowSummary] = React.useState(false);
  const [state, setState] = React.useState<SubmitState>({ kind: "idle" });

  const honeypotRef = React.useRef<HTMLInputElement>(null);
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const successRef = React.useRef<HTMLDivElement>(null);

  /* Inlined at build time by Next; identical on the server and in the browser,
     so this is safe to read during render. */
  const configured = isWeb3FormsConfigured();

  /** Re-validate a field only once it is already in error (index.html:2211). */
  const revalidate = React.useCallback(
    (key: FieldKey, error: string | undefined) => {
      setErrors((current) => {
        if (!current[key]) return current;
        if (current[key] === error) return current;
        const next = { ...current };
        if (error) next[key] = error;
        else delete next[key];
        return next;
      });
    },
    [],
  );

  const setError = React.useCallback((key: FieldKey, error: string | undefined) => {
    setErrors((current) => {
      if (current[key] === error) return current;
      const next = { ...current };
      if (error) next[key] = error;
      else delete next[key];
      return next;
    });
  }, []);

  const mailtoHref = bovMailtoHref({
    name,
    hotelName,
    city: city?.city,
    state: city?.state,
    phone: toE164(phone.country, phone.national),
    email,
    smsConsent,
  });

  const focusField = (key: FieldKey) => {
    document.getElementById(fieldId(key))?.focus();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.kind === "sending") return;

    /* Every validator runs — no short-circuit — so one pass paints every
       error, exactly as the source did (index.html:2214-2222). */
    const next: Errors = {};
    const nameError = validateName(name);
    const hotelError = validateHotelName(hotelName);
    const cityError = validateCity(city);
    const phoneError = validatePhone(phone);
    const emailError = validateEmail(email);
    if (nameError) next.name = nameError;
    if (hotelError) next.hotelName = hotelError;
    if (cityError) next.city = cityError;
    if (phoneError) next.phone = phoneError;
    if (emailError) next.email = emailError;

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

    const key = web3formsKey();
    if (!key) {
      // Unreachable while the button is disabled, but never fake a success.
      setState({ kind: "failed", message: COPY.unconfigured });
      return;
    }

    setState({ kind: "sending" });

    const payload = buildBovPayload(
      {
        name,
        hotelName,
        city: city ? city.city : "",
        state: city ? city.state : "",
        phone: toE164(phone.country, phone.national),
        email,
        smsConsent,
        botcheck: honeypotRef.current?.checked ?? false,
      },
      key,
    );

    const result = await submitWeb3Forms(payload);

    if (result.ok) {
      setName("");
      setHotelName("");
      setCity(null);
      setPhone(EMPTY_PHONE);
      setEmail("");
      setSmsConsent(false);
      setErrors({});
      setShowSummary(false);
      setState({ kind: "sent" });
      window.requestAnimationFrame(() => successRef.current?.focus());
      return;
    }

    setState({
      kind: "failed",
      message:
        result.reason === "network"
          ? COPY.status.network
          : result.reason === "unconfigured"
            ? COPY.unconfigured
            : COPY.status.rejected,
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
          inline display:none, out of the tab order, autocomplete off. `botcheck`
          is Web3Forms' own convention; renaming it breaks their server-side
          rejection. A visually-hidden class would not do: the technique is the
          point, since a bot reads the computed style. */}
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

      <Field
        id={fieldId("name")}
        label={COPY.labels.name}
        required
        error={errors.name}
      >
        {(control) => (
          <Input
            {...control}
            type="text"
            autoComplete="name"
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
            autoComplete="organization"
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
        hint={COPY.hints.phone}
        error={errors.phone}
      >
        {(control) => (
          <PhoneField
            {...control}
            value={phone}
            onChange={(next) => {
              setPhone(next);
              // index.html:2185 — a country change clears the error and re-checks.
              revalidate("phone", validatePhone(next));
            }}
            onBlur={() => setError("phone", validatePhone(phone))}
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

      {/* SMS consent — byte-exact from content/compliance.ts. Unchecked, never
          required, scoped to SMS only, separate from the request above. */}
      <div className="sm:col-span-2">
        <CheckboxField
          id={fieldId("sms")}
          checked={smsConsent}
          onCheckedChange={(next) => setSmsConsent(next === true)}
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

      {!configured ? (
        <p
          id={fieldId("unconfigured")}
          className="sm:col-span-2 flex items-start gap-2 font-sans text-data text-fg-muted"
        >
          <AlertCircle aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
          <span>{COPY.unconfigured}</span>
        </p>
      ) : null}

      <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          size="lg"
          loading={sending}
          loadingLabel={COPY.status.sending}
          disabled={!configured}
          aria-describedby={configured ? undefined : fieldId("unconfigured")}
        >
          {COPY.actions.submit}
        </Button>

        {/* Always available while sending is unavailable, and offered again after
            a failure. Carries every value already typed. */}
        {!configured || state.kind === "failed" ? (
          <Button asChild variant="ghost" size="lg">
            <a href={mailtoHref}>{COPY.actions.mailto}</a>
          </Button>
        ) : null}
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
