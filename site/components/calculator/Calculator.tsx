"use client";

/**
 * components/calculator/Calculator.tsx — the controlled 3-step wizard shell.
 *
 * Composes the already-built pieces (CalculatorSteps, ContextRail,
 * CalculatorResult) around the FROZEN engine in lib/valuation.ts. This file
 * owns exactly the things the source's calculator IIFE owned outside the math:
 * input state, the two validation gates, step navigation, focus management, and
 * the one call out to Web3Forms. It reimplements none of the arithmetic.
 *
 * Spec: docs/design/specs/calculator.md. Source: docs/port/01-calculator.md.
 * Redesign: docs/DESIGN-REVISIT.md §4.6.
 *
 * ── LANDSCAPE CHASSIS + ZERO-CLS STEP CHANGES (D6, 2026-08-09) ──────────────
 * The old portrait "text left / form right" split is gone. The console is now
 * one full-width object: a horizontal stepper across the top, then a two-column
 * body — the live step on the left, the market-data `ContextRail` pinned on the
 * right. The rail renders on ALL THREE steps: dropping it on step 3 would
 * re-flow the step column's width mid-wizard, and a horizontal shift counts
 * against CLS exactly like a vertical one.
 *
 * Vertical CLS is solved structurally rather than by measuring:
 *   1. `CalculatorSection` makes the section a flex column with `section-fit`'s
 *      min-height, and hands this component `lg:flex-1`. The console therefore
 *      occupies the same box on every step at every desktop size.
 *   2. Inside it, the step/rail grid is `lg:flex-1`, so the step column's box
 *      is fixed by the console, not by the step's content.
 *   3. Steps 1 and 2 use `mt-auto` on their footer rows, so their buttons park
 *      at the same screen line instead of floating up when the content is short.
 *   4. Step 3 is the only step whose content can exceed the box, so it — and
 *      only it — gets a native `scroll-well`: real `overflow-y: auto` with the
 *      masked fade affordance, `tabIndex={0}` + `role="region"` so a keyboard
 *      user can reach and scroll it. No wheel is ever hijacked (ref 05).
 * The step panel is consequently the same height on step 1, 2 and 3, and the
 * measured shift on a step change is the reserved-slot case: 0.
 *
 * ── STATE SHAPE ──────────────────────────────────────────────────────────────
 * `form` holds the raw <option> DISPLAY STRINGS exactly as CalculatorSteps.tsx
 * defines them (see that file's header for why). `typeKey` / `tierKey` /
 * `brandKeyCfg` / `condKeyCfg` / `groundLeaseFromLabel` — the source's own
 * display-string → CONFIG-key shims (index.html:1385-1394, :1512) — resolve the
 * typed `ValuationInput` at the two points that need it: priming on mount and
 * every entry into step 3. `typeKey`/`tierKey` are also read (cheaply, in
 * render) to address the frozen benchmark bands for the rail.
 *
 * ── PRIMED ON MOUNT (index.html:1687, "prime Step 3 so it's correct the moment
 * the user reaches it") ──────────────────────────────────────────────────────
 * `result` initialises from `calculate()` run against the seeded defaults
 * (occ 74 / ADR 198, both non-zero — no backfill needed). The results area is
 * therefore never empty and a step change never has to wait on a computation;
 * it is recomputed only when the visitor actually reaches step 3 again.
 *
 * ── THE TWO VALIDATION GATES (index.html:1620-1637) ─────────────────────────
 * Entering step 2 (`gateToStepTwo`): the ONLY blocking check in the whole
 * calculator — Keys must be >= 1 (`keysAreValid`). Failure sets the ported
 * error string, moves focus to the field, and does not advance.
 * Entering step 3 (`gateToStepThree`): never blocks. It silently backfills an
 * empty Occupancy/ADR from `typicalFor(tier)`, clamps Occupancy to 100 as
 * defence-in-depth (unreachable through the UI — the live formatter already
 * caps at 100 — kept because the source keeps it), latches `usedDefaults`
 * (module-scoped in the source, never reset to false — mirrored here as a
 * one-way state flip), and recomputes `result`.
 *
 * `usedDefaults` is intentionally NEVER set back to `false` anywhere in this
 * file, including "Start over" — index.html never resets it either
 * (docs/design/specs/calculator.md, "ported defects" table, §C.9(3)).
 *
 * ── NAVIGATION (index.html:1667-1687 `data-go` wiring, extended) ────────────
 * `goToStep` gives the numbered stepper the same reach as the two buttons: a
 * backward jump is free (no validation, no recompute — matches "Back" /
 * "Start over"); a forward jump walks the intervening gate(s) in order, so
 * clicking "03" from step 1 cannot reach step 3 with invalid Keys — no state is
 * reachable that the source's linear Continue → Calculate path could not reach.
 *
 * ── FOCUS + MOTION ───────────────────────────────────────────────────────────
 * A step change moves focus to the incoming panel (`tabIndex={-1}`, `role=
 * "group"`, `aria-labelledby` its own heading) — never on the initial mount,
 * which would steal the page's focus on load. Per the spec's motion table, step
 * changes are NOT animated (`ref 05` — "Step change: none — nothing to gate");
 * the only motion in this section lives inside BenchmarkBars/Reveal, neither of
 * which this file touches.
 *
 * ── THE LEAD PAYLOAD (index.html:1980-2000 + spec deviation D-j) ────────────
 * `buildEstimateFields` reproduces the source's fourteen keys verbatim and adds
 * three more — `ground_lease`, `fb_pct`, `noi_annual` — additively: the source
 * omitted all three from the inbox even though each one moves the number
 * (port pack §B.4.7 flag). No existing key is renamed.
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  KEYS_REQUIRED_ERROR,
  TYPICAL_FIGURES_NOTE,
  brandKeyCfg,
  calculate,
  clampOccupancyPct,
  condKeyCfg,
  groundLeaseFromLabel,
  groupInt,
  keysAreValid,
  parseNumericField,
  tierKey,
  typeKey,
  typicalFor,
  type ValuationInput,
  type ValuationResult,
} from "@/lib/valuation";
import {
  buildValuationLeadPayload,
  submitWeb3Forms,
  web3formsKey,
  type Web3FormsResult,
} from "@/lib/web3forms";

import { CalculatorResult } from "./CalculatorResult";
import {
  INITIAL_FORM,
  STEP_TITLES,
  StepOne,
  StepTwo,
  type CalculatorForm,
} from "./CalculatorSteps";
import { ContextRail } from "./ContextRail";

/* -------------------------------------------------------------------------- */
/*  Step machine                                                              */
/* -------------------------------------------------------------------------- */

type Step = 1 | 2 | 3;
const STEPS: readonly Step[] = [1, 2, 3];

/** Only one step panel is ever mounted, so one id serves all three headings. */
const STEP_HEADING_ID = "calculator-step-heading";

/** Accessible name of step 3's scroll region (ref 07: a scrollable container
 *  must be keyboard-reachable AND named). */
const RESULT_REGION_LABEL = "Your estimate";

/* -------------------------------------------------------------------------- */
/*  Form -> engine input (index.html:1385-1394, :1512 shims)                  */
/* -------------------------------------------------------------------------- */

function buildValuationInput(form: CalculatorForm, usedDefaults: boolean): ValuationInput {
  return {
    propertyType: typeKey(form.propertyType),
    keys: parseNumericField(form.keys),
    occupancyPct: parseNumericField(form.occ),
    adr: parseNumericField(form.adr),
    tier: tierKey(form.tier),
    brand: brandKeyCfg(form.brand),
    condition: condKeyCfg(form.condition),
    // D3, ported deliberately: whatever is in `form.fb` counts, even after the
    // row is hidden by a property-type change — see CalculatorSteps.tsx's own
    // note on the same defect. Nothing here zeroes it based on visibility.
    fbPct: parseNumericField(form.fb),
    noiOverride: parseNumericField(form.noi),
    groundLease: groundLeaseFromLabel(form.land),
    marketZipRaw: form.market,
    usedDefaults,
    // Raw display strings, not the canonical per-key label — index.html read
    // these straight off the selects (:1606-1608), so two option labels that
    // resolve to the same CONFIG key (e.g. the two brand-flag "branded" rows)
    // still surface distinctly in the lead/Calendly prefill.
    propertyTypeLabel: form.propertyType,
    tierLabel: form.tier,
    conditionLabel: form.condition,
    brandLabel: form.brand,
  };
}

/**
 * index.html:1620-1637, the `validate(3)` step — silent backfill, never blocks.
 * Returns the (possibly unchanged) form and whether it backfilled anything.
 */
function applyStepThreeAutofill(form: CalculatorForm): {
  form: CalculatorForm;
  usedDefaults: boolean;
} {
  const typical = typicalFor(tierKey(form.tier));
  let occ = form.occ;
  let adr = form.adr;
  let usedDefaults = false;

  let occNum = parseNumericField(occ);
  if (!occNum) {
    occ = String(typical.occ);
    occNum = typical.occ;
    usedDefaults = true;
  }
  const clampedOcc = clampOccupancyPct(occNum);
  if (clampedOcc !== occNum) occ = String(clampedOcc);

  if (!parseNumericField(adr)) {
    adr = groupInt(String(typical.adr));
    usedDefaults = true;
  }

  if (occ === form.occ && adr === form.adr) return { form, usedDefaults };
  return { form: { ...form, occ, adr }, usedDefaults };
}

/**
 * index.html:1980-2000, verbatim keys, plus the three additive D-j keys. Only
 * the values already on `form` / `result` — nothing is invented.
 */
function buildEstimateFields(form: CalculatorForm, result: ValuationResult): Record<string, string> {
  return {
    property_type: form.propertyType,
    keys: form.keys,
    market: form.market,
    market_tier: form.tier,
    brand_flag: form.brand,
    condition: form.condition,
    occupancy_pct: form.occ,
    adr: `$${form.adr}`,
    revpar: result.prefill.revpar,
    noi_per_key: result.prefill.noiPerKey,
    cap_range: result.prefill.capRangeUsed,
    estimated_range: result.prefill.range,
    summary: result.prefill.summary,
    insights: result.firedCodes.join(", "),
    top_advice: result.prefill.topAdvice,
    // D-j — additive only; the source dropped these three even though each one
    // moves the number (port pack §B.4.7).
    ground_lease: form.land,
    fb_pct: form.fb,
    noi_annual: form.noi,
  };
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export type CalculatorProps = {
  className?: string;
};

export function Calculator({ className }: CalculatorProps) {
  const [form, setForm] = React.useState<CalculatorForm>(INITIAL_FORM);
  const [step, setStep] = React.useState<Step>(1);
  const [keysError, setKeysError] = React.useState<string | null>(null);
  const [autofillNote, setAutofillNote] = React.useState<string | null>(null);
  const [usedDefaults, setUsedDefaults] = React.useState(false);
  const [result, setResult] = React.useState<ValuationResult>(() =>
    calculate(buildValuationInput(INITIAL_FORM, false)),
  );

  const keysRef = React.useRef<HTMLInputElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const mounted = React.useRef(false);

  // Focus follows a step change, but never steals focus on first paint.
  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    panelRef.current?.focus();
  }, [step]);

  function handleFormChange(patch: Partial<CalculatorForm>) {
    setForm((prev) => ({ ...prev, ...patch }));
    if (keysError && patch.keys !== undefined) setKeysError(null);
  }

  /** index.html:1656-1665 — explicit link; overwrites unconditionally, no calculate(). */
  function handleAutofill() {
    const typical = typicalFor(tierKey(form.tier));
    setForm((prev) => ({
      ...prev,
      occ: String(typical.occ),
      adr: groupInt(String(typical.adr)),
    }));
    setUsedDefaults(true);
    setAutofillNote(TYPICAL_FIGURES_NOTE);
  }

  /** index.html:1622-1624 — the only blocking check in the calculator. */
  function gateToStepTwo(): boolean {
    if (!keysAreValid(parseNumericField(form.keys))) {
      setKeysError(KEYS_REQUIRED_ERROR);
      keysRef.current?.focus();
      return false;
    }
    setKeysError(null);
    return true;
  }

  /** index.html:1627-1636 + :1596-1611 — never blocks; always recomputes. */
  function gateToStepThree(): boolean {
    const { form: nextForm, usedDefaults: backfilled } = applyStepThreeAutofill(form);
    const nextUsedDefaults = usedDefaults || backfilled;
    if (nextForm !== form) setForm(nextForm);
    if (backfilled && !usedDefaults) setUsedDefaults(true);
    setResult(calculate(buildValuationInput(nextForm, nextUsedDefaults)));
    return true;
  }

  /**
   * Backward is free (no validation, no recompute — the source's "Back" /
   * "Start over" contract). Forward walks every gate between the current step
   * and the target in order, stopping at the first failure, so a direct
   * stepper click can never land somewhere Continue → Calculate could not.
   */
  function goToStep(target: Step) {
    if (target === step) {
      panelRef.current?.focus();
      return;
    }
    if (target < step) {
      setStep(target);
      return;
    }
    let cur = step;
    while (cur < target) {
      const next = (cur + 1) as Step;
      const ok = next === 2 ? gateToStepTwo() : next === 3 ? gateToStepThree() : true;
      if (!ok) return;
      cur = next;
    }
    setStep(target);
  }

  const sendEstimate = React.useCallback(
    async (email: string): Promise<Web3FormsResult> => {
      const key = web3formsKey();
      if (!key) return { ok: false, reason: "unconfigured" };
      const payload = buildValuationLeadPayload(
        { email, fields: buildEstimateFields(form, result) },
        key,
      );
      return submitWeb3Forms(payload);
    },
    [form, result],
  );

  return (
    <div
      className={cn(
        "surface-deep hairline rounded-card flex flex-col gap-5 p-5 sm:p-6",
        className,
      )}
    >
      <Stepper step={step} onSelect={goToStep} />

      {/* Landscape body. The rail is a constant column on every step — see the
          CLS note in the file header. */}
      <div className="grid gap-6 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-8">
        {/*
          Deliberately NO `min-h-0` here. As a grid item its automatic minimum
          size is its min-content, so steps 1 and 2 push the row (and the whole
          section past `section-fit`'s MINIMUM height) rather than overflowing
          into the disclaimer below. Step 3's inner scroll container has an
          automatic minimum size of 0, so that step alone lets the row settle
          back to the height the flex chassis gives it — which is exactly the
          asymmetry we want.
        */}
        <div ref={panelRef} role="group" tabIndex={-1} aria-labelledby={STEP_HEADING_ID}>
          {step === 1 ? (
            <StepOne
              headingId={STEP_HEADING_ID}
              form={form}
              onChange={handleFormChange}
              keysError={keysError}
              keysRef={keysRef}
              onContinue={() => goToStep(2)}
            />
          ) : step === 2 ? (
            <StepTwo
              headingId={STEP_HEADING_ID}
              form={form}
              onChange={handleFormChange}
              autofillNote={autofillNote}
              onAutofill={handleAutofill}
              onBack={() => goToStep(1)}
              onCalculate={() => goToStep(3)}
            />
          ) : (
            /* The one step whose content genuinely exceeds one screen. Native
               overflow + the masked fade affordance, keyboard-reachable, wheel
               untouched. Mobile keeps natural flow — the cap is lg-only. */
            <div
              role="region"
              aria-label={RESULT_REGION_LABEL}
              tabIndex={0}
              className="lg:scroll-well lg:h-full lg:max-h-[56svh] lg:pe-3"
            >
              <CalculatorResult
                headingId={STEP_HEADING_ID}
                heading={STEP_TITLES[3]}
                result={result}
                onSendEstimate={sendEstimate}
                onStartOver={() => goToStep(1)}
              />
            </div>
          )}
        </div>

        <ContextRail
          propertyType={typeKey(form.propertyType)}
          propertyTypeLabel={form.propertyType}
          tier={tierKey(form.tier)}
          tierLabel={form.tier}
          className="lg:sticky lg:top-6 lg:self-start"
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stepper — numbered mono buttons, index.html:924-930 restyled + a11y'd     */
/* -------------------------------------------------------------------------- */

type StepperProps = {
  step: Step;
  onSelect: (target: Step) => void;
};

const STEP_BUTTON_BASE =
  "flex size-11 items-center justify-center rounded-pill border font-mono text-data font-medium tabular transition-colors duration-fast ease-out";
const STEP_BUTTON_ON = `${STEP_BUTTON_BASE} border-accent bg-accent-chip text-accent-text`;
const STEP_BUTTON_OFF = `${STEP_BUTTON_BASE} border-hairline text-fg-meta hover:border-accent-text hover:text-fg`;

/**
 * The source's three decorative dots (`.dot`, cumulative `<=` active state, no
 * ARIA at all) become numbered, keyboard-navigable buttons: `aria-current=
 * "step"` on the current one, and an accessible name of "Step N of 3: <step
 * title>" on every one — the visible "01"/"02"/"03" glyph is aria-hidden so
 * that name is not doubled for screen-reader users. The adjacent "Step N of 3"
 * paragraph is the single live region (spec IA #5); the buttons announce
 * nothing on their own.
 *
 * D8: the numerals step to mono 500 and the source's middle dot becomes a
 * drawn hairline connector — the stepper now reads as a horizontal track
 * across the top of the console rather than three loose pills.
 */
function Stepper({ step, onSelect }: StepperProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <ol role="list" className="flex items-center gap-3">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            {i > 0 ? (
              <span aria-hidden="true" className="block h-px w-6 bg-hairline sm:w-10" />
            ) : null}
            <button
              type="button"
              onClick={() => onSelect(s)}
              aria-current={s === step ? "step" : undefined}
              className={s === step ? STEP_BUTTON_ON : STEP_BUTTON_OFF}
            >
              <span aria-hidden="true">{String(s).padStart(2, "0")}</span>
              <span className="visually-hidden">{`Step ${s} of 3: ${STEP_TITLES[s]}`}</span>
            </button>
          </li>
        ))}
      </ol>

      <p role="status" aria-live="polite" className="micro-label font-medium">
        {`Step ${step} of 3`}
      </p>
    </div>
  );
}
