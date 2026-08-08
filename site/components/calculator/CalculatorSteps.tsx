"use client";

/**
 * components/calculator/CalculatorSteps.tsx — steps 01 and 02 of the valuation
 * wizard: every input, its exact default, its live formatter, and its ⓘ.
 *
 * Field inventory ported field-for-field from docs/port/01-calculator.md §B.2
 * and §B.3 (source: index.html:932-1022). Option lists, defaults, placeholders,
 * inputmode, autocomplete and maxlength are all the source's; the option label
 * strings themselves are imported from lib/valuation.ts so they exist in exactly
 * one place.
 *
 * STATE SHAPE. Like the source, the form holds the raw <option> DISPLAY STRING
 * for every select, not the CONFIG key. Three reasons:
 *   1. `BRAND_OPTIONS` and `CONDITION_OPTIONS` each contain two labels that
 *      resolve to the SAME key ("Soft-brand / lifestyle" → `branded`, "15+ yrs /
 *      renovation (PIP) due" → `over8`). Keying a <Select> by CONFIG value would
 *      collide and make one option unselectable.
 *   2. The F&B row's visibility rule is a strict string comparison against two
 *      literal labels (index.html:1670) — a direct port needs the label.
 *   3. The lead prefill carries the raw display strings (index.html:1606-1608).
 * The CONFIG keys are derived with the exported shims (`typeKey`, `tierKey`,
 * `brandKeyCfg`, `condKeyCfg`, `groundLeaseFromLabel`) at calculation time.
 *
 * FORMATTERS. `formatNumericField` / `blurNumericField` are the frozen port of
 * the source's `data-fmt` behaviour (index.html:1413-1463). The source assigned
 * `el.value` directly, which parks the caret at the end of the field on every
 * keystroke. `NumericInput` runs the same transform but counts the digits before
 * the caret and puts it back where the typist left it — same output, no fight.
 *
 * A11Y. The source nested the ⓘ <button> inside the <label>; here the trigger is
 * a SIBLING of the label (nested interactive elements are a P0 failure). The `$`
 * and `%` adornments are aria-hidden decoration, so the unit is restated as a
 * visually-hidden suffix on the label — the accessible name gains the unit
 * without a single visible string changing.
 */

import * as React from "react";
import { AlertCircle, Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BRAND_OPTIONS,
  CONDITION_OPTIONS,
  FIELD_FORMATS,
  LAND_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  TIER_OPTIONS,
  blurNumericField,
  formatNumericField,
  parseNumericField,
  type FieldFormat,
} from "@/lib/valuation";
import { cn } from "@/lib/utils";

import { InfoPopover, type CalculatorTipId } from "./InfoPopover";

/* -------------------------------------------------------------------------- */
/*  Form shape + seeded defaults (index.html:936-1013)                         */
/* -------------------------------------------------------------------------- */

export type CalculatorForm = {
  /** #cType — raw <option> label. */
  propertyType: string;
  /** #cKeys — `data-fmt="int"`. The only required field. */
  keys: string;
  /** #cTier — raw <option> label. */
  tier: string;
  /** #cBrandFlag — raw <option> label. */
  brand: string;
  /** #cMarket — free text; only a /\d{5}/ match is ever read. */
  market: string;
  /** #cCond — raw <option> label. */
  condition: string;
  /** #cGround — raw <option> label. */
  land: string;
  /** #cFb — `data-fmt="pct"`. */
  fb: string;
  /** #cNoi — `data-fmt="money"`. */
  noi: string;
  /** #cOcc — `data-fmt="pct"`. */
  occ: string;
  /** #cAdr — `data-fmt="money"`. */
  adr: string;
};

/**
 * The `selected` option / `value` attribute of every field in the source.
 * Indexes are used rather than retyped strings so a label edit in
 * lib/valuation.ts can never desynchronise the default.
 */
export const INITIAL_FORM: CalculatorForm = {
  propertyType: PROPERTY_TYPE_OPTIONS[2].label, // Full-Service   (index.html:940)
  keys: "88", //                                                   (index.html:946)
  tier: TIER_OPTIONS[2].label, //               Standard / suburban (index.html:955)
  brand: BRAND_OPTIONS[0].label, //             Branded (franchise) (index.html:961)
  market: "", //                                                   (index.html:967)
  condition: CONDITION_OPTIONS[1].label, //     4–8 yrs (baseline)  (index.html:977)
  land: LAND_OPTIONS[0].label, //               Fee Simple          (index.html:985)
  fb: "", //                                                       (index.html:993)
  noi: "", //                                                      (index.html:997)
  occ: "74", //                                                    (index.html:1012)
  adr: "198", //                                                   (index.html:1013)
};

/** index.html:934, :1009. Step 3 has no head in the source; its result label serves. */
export const STEP_TITLES = {
  1: "First, the basics.",
  2: "Now, how's it doing?",
  3: "Here's where the market would likely start",
} as const;

/** index.html:1670 — a strict equality test against two literal labels, not a regex. */
export function showsFoodAndBeverage(propertyTypeLabel: string): boolean {
  return (
    propertyTypeLabel === PROPERTY_TYPE_OPTIONS[2].label ||
    propertyTypeLabel === PROPERTY_TYPE_OPTIONS[3].label
  );
}

/* -------------------------------------------------------------------------- */
/*  Field shell — label row + control + error                                  */
/* -------------------------------------------------------------------------- */

type FieldControl = {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
};

type FieldShellProps = {
  id: string;
  label: React.ReactNode;
  /** Appended to the accessible name only, e.g. "in percent". */
  unit?: string;
  tip?: CalculatorTipId;
  error?: string | null;
  children: (control: FieldControl) => React.ReactNode;
};

function FieldShell({ id, label, unit, tip, error, children }: FieldShellProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      {/* min-h-11 keeps every label row on the same rhythm whether or not it
          carries a 44px ⓘ trigger. */}
      <div className="flex min-h-11 items-center gap-1">
        <Label htmlFor={id} className="flex-1">
          {label}
          {unit ? <span className="visually-hidden">{unit}</span> : null}
        </Label>
        {tip ? <InfoPopover tip={tip} /> : null}
      </div>

      {children({
        id,
        "aria-describedby": error ? errorId : undefined,
        "aria-invalid": error ? true : undefined,
      })}

      {/* Icon + text + role="alert" — colour alone is a P0 fail (ref 07). */}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-1.5 font-sans text-data text-brick"
        >
          <AlertCircle aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Select field                                                               */
/* -------------------------------------------------------------------------- */

type OptionList = readonly { readonly label: string }[];

type SelectFieldProps = {
  id: string;
  label: string;
  tip: CalculatorTipId;
  options: OptionList;
  value: string;
  onValueChange: (next: string) => void;
};

function SelectField({ id, label, tip, options, value, onValueChange }: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} tip={tip}>
      {(control) => (
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger id={control.id} aria-describedby={control["aria-describedby"]}>
            <SelectValue className="min-w-0 truncate text-start" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.label} value={option.label}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FieldShell>
  );
}

/* -------------------------------------------------------------------------- */
/*  Numeric input — the ported data-fmt behaviour, caret-safe                  */
/* -------------------------------------------------------------------------- */

/** The characters `clean()` keeps (index.html:1425). */
const SIGNIFICANT = /[0-9.]/;

/** How many digits/dots sit before the caret in the raw text. */
function countSignificant(value: string, caret: number): number {
  let count = 0;
  const end = Math.min(caret, value.length);
  for (let i = 0; i < end; i += 1) {
    if (SIGNIFICANT.test(value[i])) count += 1;
  }
  return count;
}

/** Where the caret goes in the formatted text to sit after the same digit. */
function caretAfterSignificant(value: string, count: number): number {
  if (count <= 0) return 0;
  let seen = 0;
  for (let i = 0; i < value.length; i += 1) {
    if (SIGNIFICANT.test(value[i])) {
      seen += 1;
      if (seen === count) return i + 1;
    }
  }
  return value.length;
}

type NumericInputProps = {
  control: FieldControl;
  value: string;
  onValueChange: (next: string) => void;
  format: FieldFormat;
  inputMode: "numeric" | "decimal";
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  /** Decorative `$` prefix or `%` suffix rendered inside the box. */
  adornment?: "currency" | "percent";
};

function NumericInput({
  control,
  value,
  onValueChange,
  format,
  inputMode,
  placeholder,
  inputRef,
  adornment,
}: NumericInputProps) {
  const fallbackRef = React.useRef<HTMLInputElement>(null);
  const ref = inputRef ?? fallbackRef;
  const pendingCaret = React.useRef<number | null>(null);
  const options = FIELD_FORMATS[format];

  // Runs after every commit; the guard makes it a no-op unless a keystroke
  // asked for the caret back. Layout effect, so the caret never visibly jumps.
  React.useLayoutEffect(() => {
    const element = ref.current;
    const caret = pendingCaret.current;
    if (!element || caret === null) return;
    pendingCaret.current = null;
    element.setSelectionRange(caret, caret);
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const element = event.currentTarget;
    const raw = element.value;
    const significant = countSignificant(raw, element.selectionStart ?? raw.length);
    const next = formatNumericField(raw, options);
    const caret = caretAfterSignificant(next, significant);

    if (next === value) {
      /* React bails out when the next state is identical, so no re-render would
         land and the DOM would keep the characters the formatter rejected
         (typing "a" into "88" leaves "88a"). Write the field back by hand. */
      element.value = next;
      element.setSelectionRange(caret, caret);
      return;
    }

    pendingCaret.current = caret;
    onValueChange(next);
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    // index.html:1456-1461 — trim a trailing dot, then re-format.
    onValueChange(blurNumericField(event.currentTarget.value, options));
  }

  const field = (
    <Input
      ref={ref}
      id={control.id}
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      inputMode={inputMode}
      autoComplete="off"
      placeholder={placeholder}
      aria-describedby={control["aria-describedby"]}
      aria-invalid={control["aria-invalid"]}
      className={cn(
        // Deal data is mono + tabular (P1 gate); tabular also stops the digits
        // shuffling sideways as commas are inserted mid-typing.
        "font-mono tabular",
        adornment === "currency" && "pl-8",
        adornment === "percent" && "pr-9",
      )}
    />
  );

  if (!adornment) return field;

  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 font-mono text-fg-meta",
          adornment === "currency" ? "left-4" : "right-4",
        )}
      >
        {adornment === "currency" ? "$" : "%"}
      </span>
      {field}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 01 — "First, the basics."                                             */
/* -------------------------------------------------------------------------- */

export type StepOneProps = {
  headingId: string;
  form: CalculatorForm;
  onChange: (patch: Partial<CalculatorForm>) => void;
  keysError: string | null;
  keysRef: React.RefObject<HTMLInputElement | null>;
  onContinue: () => void;
};

export function StepOne({
  headingId,
  form,
  onChange,
  keysError,
  keysRef,
  onContinue,
}: StepOneProps) {
  const showFb = showsFoodAndBeverage(form.propertyType);

  return (
    /* A real <form> so Enter advances the step from any field — the source's
       buttons were bare click handlers and swallowed the keyboard path. */
    <form
      noValidate
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        onContinue();
      }}
    >
      <StepHead
        headingId={headingId}
        title={STEP_TITLES[1]}
        sub={"No financials yet — just what kind of hotel it is."}
      />

      <div className="flex flex-col gap-5">
        <SelectField
          id="calc-type"
          label="Property Type"
          tip="propertyType"
          options={PROPERTY_TYPE_OPTIONS}
          value={form.propertyType}
          onValueChange={(propertyType) => onChange({ propertyType })}
        />

        <FieldShell id="calc-keys" label="Keys" tip="keys" error={keysError}>
          {(control) => (
            <NumericInput
              control={control}
              value={form.keys}
              onValueChange={(keys) => onChange({ keys })}
              format="int"
              inputMode="numeric"
              inputRef={keysRef}
            />
          )}
        </FieldShell>

        <SelectField
          id="calc-tier"
          label="Where is it?"
          tip="tier"
          options={TIER_OPTIONS}
          value={form.tier}
          onValueChange={(tier) => onChange({ tier })}
        />

        <SelectField
          id="calc-brand"
          label="Brand"
          tip="brand"
          options={BRAND_OPTIONS}
          value={form.brand}
          onValueChange={(brand) => onChange({ brand })}
        />

        <FieldShell
          id="calc-market"
          label={
            <>
              {"ZIP code "}
              <span className="font-normal text-fg-meta">{"— optional"}</span>
            </>
          }
        >
          {(control) => (
            <Input
              id={control.id}
              type="text"
              value={form.market}
              onChange={(event) => onChange({ market: event.currentTarget.value })}
              placeholder="5-digit ZIP"
              inputMode="numeric"
              maxLength={5}
              autoComplete="postal-code"
              className="font-mono tabular"
            />
          )}
        </FieldShell>
      </div>

      {/* index.html:969-971 — closed by default, native <details> so it works
          with no JS and needs no focus management of its own. */}
      <details className="group hairline-t pt-2">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-sans text-body text-fg [&::-webkit-details-marker]:hidden">
          <span>
            {"Refine my estimate "}
            <span className="text-fg-meta">{"(optional)"}</span>
          </span>
          <PlusMinus />
        </summary>

        <div className="mt-4 flex flex-col gap-5">
          <SelectField
            id="calc-cond"
            label="Condition / last renovation"
            tip="condition"
            options={CONDITION_OPTIONS}
            value={form.condition}
            onValueChange={(condition) => onChange({ condition })}
          />

          <SelectField
            id="calc-ground"
            label="Land"
            tip="land"
            options={LAND_OPTIONS}
            value={form.land}
            onValueChange={(land) => onChange({ land })}
          />

          {/* index.html:991 — the row exists only for Full-Service and
              Resort / Boutique. NOTE (source defect D3, ported deliberately):
              a value entered here KEEPS applying its +25bps after the row is
              hidden by a property-type change. Changing that changes shipped
              numbers, so it needs a dated PROJECT-MEMORY decision. */}
          {showFb ? (
            <FieldShell
              id="calc-fb"
              label={"F&B as % of revenue"}
              unit=" in percent"
              tip="fb"
            >
              {(control) => (
                <NumericInput
                  control={control}
                  value={form.fb}
                  onValueChange={(fb) => onChange({ fb })}
                  format="pct"
                  inputMode="decimal"
                  placeholder="optional"
                  adornment="percent"
                />
              )}
            </FieldShell>
          ) : null}

          <FieldShell
            id="calc-noi"
            label="I know my actual NOI"
            unit=" in US dollars"
            tip="noi"
          >
            {(control) => (
              <NumericInput
                control={control}
                value={form.noi}
                onValueChange={(noi) => onChange({ noi })}
                format="money"
                inputMode="decimal"
                placeholder="annual, optional"
                adornment="currency"
              />
            )}
          </FieldShell>
        </div>
      </details>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="w-full sm:w-auto">
          Continue
        </Button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 02 — "Now, how's it doing?"                                           */
/* -------------------------------------------------------------------------- */

export type StepTwoProps = {
  headingId: string;
  form: CalculatorForm;
  onChange: (patch: Partial<CalculatorForm>) => void;
  autofillNote: string | null;
  onAutofill: () => void;
  onBack: () => void;
  onCalculate: () => void;
};

export function StepTwo({
  headingId,
  form,
  onChange,
  autofillNote,
  onAutofill,
  onBack,
  onCalculate,
}: StepTwoProps) {
  /* index.html:1647-1652 — the live preview, recomputed on every keystroke. */
  const occ = parseNumericField(form.occ) / 100;
  const adr = parseNumericField(form.adr);
  const showRevpar = occ > 0 && adr > 0;

  return (
    <form
      noValidate
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
    >
      <StepHead
        headingId={headingId}
        title={STEP_TITLES[2]}
        sub={"Your last 12 months. Estimates are fine — we'll show you a range."}
      />

      {/* index.html:1010 — the inline ⓘ sits beside the term it explains. */}
      <p className="flex flex-wrap items-center gap-1 font-sans text-body text-fg-muted">
        <span>
          {"These are your "}
          <strong className="font-medium text-fg">TTM</strong>
        </span>
        <InfoPopover tip="ttm" />
        <span>{"numbers — your most recent 12 months."}</span>
      </p>

      <div className="flex flex-col gap-5">
        <FieldShell
          id="calc-occ"
          label="Occupancy (TTM)"
          unit=" in percent"
          tip="occupancy"
        >
          {(control) => (
            <NumericInput
              control={control}
              value={form.occ}
              onValueChange={(value) => onChange({ occ: value })}
              format="pct"
              inputMode="decimal"
              adornment="percent"
            />
          )}
        </FieldShell>

        <FieldShell id="calc-adr" label="ADR (TTM)" unit=" in US dollars" tip="adr">
          {(control) => (
            <NumericInput
              control={control}
              value={form.adr}
              onValueChange={(value) => onChange({ adr: value })}
              format="money"
              inputMode="decimal"
              adornment="currency"
            />
          )}
        </FieldShell>
      </div>

      {/* Height reserved so the row appearing/disappearing never moves the nav
          (index.html:483 did the same with min-height: 16px). Deliberately NOT
          a live region: announcing on every keystroke is noise. */}
      <p className="min-h-6 font-mono text-data tabular text-fg">
        {showRevpar ? (
          <>
            {"RevPAR ≈ "}
            <strong className="font-medium">{"$" + Math.round(adr * occ)}</strong>
            <span className="ml-2 font-sans text-data text-fg-meta">
              {"(ADR × occupancy — the number buyers anchor on)"}
            </span>
          </>
        ) : null}
      </p>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={onAutofill}
          className="flex min-h-11 items-center text-start font-sans text-body text-fg-muted underline decoration-1 underline-offset-4 transition-colors duration-fast ease-out hover:text-accent-text"
        >
          {"I'm not sure of my exact numbers — use typical figures"}
        </button>
        <p role="status" aria-live="polite" className="min-h-6 font-sans text-data text-fg-meta">
          {autofillNote}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="ghost" onClick={onBack} className="w-full sm:w-auto">
          Back
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          Calculate
        </Button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                                */
/* -------------------------------------------------------------------------- */

/**
 * The step head. Hierarchy comes from VOICE (Fraunces 400 against Inter body),
 * not from a fifth type size — ref 03 caps a section at four and the section
 * already spends them on display2 / body / data / micro.
 */
function StepHead({
  headingId,
  title,
  sub,
}: {
  headingId: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <h3 id={headingId} className="font-display text-body font-normal text-fg">
        {title}
      </h3>
      <p className="font-sans text-body text-fg-muted">{sub}</p>
    </div>
  );
}

/**
 * The disclosure marker. The source drew "+ " / "– " with CSS `content`
 * (index.html:475-481); ref 03 is Lucide-only, so the glyphs become a Lucide
 * Plus/Minus pair swapped by the `[open]` state. No motion, nothing to gate.
 */
function PlusMinus() {
  return (
    <>
      <Plus
        aria-hidden="true"
        strokeWidth={1.5}
        className="size-4 shrink-0 text-fg-meta group-open:hidden"
      />
      <Minus
        aria-hidden="true"
        strokeWidth={1.5}
        className="hidden size-4 shrink-0 text-fg-meta group-open:block"
      />
    </>
  );
}
