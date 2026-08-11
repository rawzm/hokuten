"use client";

/**
 * components/calculator/Calculator.tsx — the controlled FIVE-step wizard shell.
 *
 * Composes the already-built pieces (CalculatorSteps, ContextRail,
 * CalculatorResult) around the FROZEN engine in lib/valuation.ts. This file
 * owns exactly the things the source's calculator IIFE owned outside the math:
 * input state, the two validation gates, step navigation, focus management, and
 * the one call out to Web3Forms. It reimplements none of the arithmetic.
 *
 * Spec: docs/DESIGN-REVISIT-2.md §D14 + §5.5. Source: docs/port/01-calculator.md.
 *
 * ── D14 (2026-08-10) — FIVE STEPS, AND THE SECTION WELL IS GONE ─────────────
 * The wizard is now Asset → Market → Performance → Estimate → Strategy. This is
 * an INFORMATION-ARCHITECTURE change only: every field, popover, default,
 * autofill/backfill, cap, validation rule, insight, result string and
 * disclaimer carries forward unchanged. What moved is WHICH STEP each one sits
 * in (the full field→step table is in CalculatorSteps.tsx's header) and WHERE
 * the two gates fire.
 *
 * The two gates keep their exact semantics by keeping their exact TRIGGERS:
 *   - the Keys gate fires when LEAVING the step that owns Keys → now entering 2
 *     (was entering 2, when Keys lived on the old step 1);
 *   - the autofill/recompute gate fires when LEAVING the step that owns
 *     Occupancy/ADR → now entering 4 (was entering 3, when they lived on the
 *     old step 2).
 * Nothing else gates. Steps 3 and 5 are entered freely, exactly as the old
 * step-2/step-3 boundary behaved.
 *
 * D6's masked internal result well — the capped-height, keyboard-reachable
 * scroll region the old step 3 carried — is DELETED. §D14 and §5.5 forbid an
 * internal section scrollbar, a fixed result height, masked overflow, a nested
 * scroll container and a sticky subpanel anywhere in `#calculator` (D28: no
 * internal section scrollbars anywhere, sitewide), and a QA grep enforces it.
 * Splitting the estimate from the strategy is what makes that affordable; a
 * genuinely tall layout (short viewport, 200% zoom) now grows the SECTION and
 * the document scrolls, which is exactly what `page-panel`'s `min-height` —
 * never `height` — exists to allow.
 *
 * D22 note (2026-08-10): scroll snap is gone — `globals.css`'s mandatory snap
 * rule and `components/motion/PagedMode.tsx` are both deleted, so scrolling on
 * the landing route is entirely natural. `page-panel`'s `min-height` mechanism
 * above is unaffected by that removal and still does the load-bearing work; it
 * never conceptually depended on `PagedMode`'s now-deleted `data-tall`
 * measurement, which this comment previously (and inaccurately) cited.
 *
 * ── LAYOUT (§5.5) ───────────────────────────────────────────────────────────
 * One console object: the horizontal five-step stepper across the top, then a
 * body grid with three cells.
 *
 *   desktop (lg+)                          mobile / tablet (DOM order)
 *   ┌───────────────────────┬───────────┐   1. active step fields
 *   │ active step fields    │  Market   │   2. Market Reference ticket
 *   ├───────────────────────┤ Reference │   3. action row
 *   │ Back / Continue       │  (rail)   │
 *   └───────────────────────┴───────────┘
 *
 * The rail is the SAME grid slot on every step (col 2, spanning both rows), so
 * the page cannot jump when the step changes — and because the cells are laid
 * out by the grid rather than by DOM order, mobile gets §5.5's required
 * "reference ticket AFTER the fields, BEFORE the primary action" for free, with
 * ONE ContextRail in the DOM. Rendering it twice behind breakpoint classes
 * would duplicate an `<aside>` landmark and its whole data table; it is not
 * sticky in either layout.
 *
 * Because the action row now lives OUTSIDE the step, the step components are
 * fragments and this file owns the `<form>`. Enter-to-advance survives: the
 * submit button sits in the action cell and points back at the form with the
 * `form` attribute. Steps 4/5 render no `<form>` at all — `CalculatorResult`
 * contains its own email `<form>`, and nesting forms is invalid HTML.
 *
 * ── ZERO LAYOUT SHIFT ON STEP CHANGE ────────────────────────────────────────
 * Reserved slot, not measurement:
 *   1. `CalculatorSection` makes the section a `page-panel` flex column and
 *      hands this component `lg:flex-1`, so the console occupies the same box
 *      on every step at every desktop size.
 *   2. The body grid is `lg:flex-1` with explicit rows `[1fr auto]`: the fields
 *      cell takes row 1 (all remaining height) and the action row takes row 2
 *      (its own content height). The action row is one button line on every
 *      step at `sm+`, so row 2 is a constant and row 1 therefore is too.
 *   3. The fields cell also carries a hard `lg:min-h-[26rem]` floor, so a short
 *      or zoomed viewport — where `flex-1` has little to give — still cannot
 *      shrink the box below the tallest input step.
 *   4. Inside the cell, `lg:justify-between` distributes the step's blocks down
 *      that constant height (§3.1) instead of clustering them at the top over a
 *      dead field, with the `gap-*` classes acting as the floor when there is
 *      no slack to distribute.
 * The measured shift on a step change is consequently the reserved-slot case: 0.
 *
 * ── STATE SHAPE ──────────────────────────────────────────────────────────────
 * `form` holds the raw <option> DISPLAY STRINGS exactly as CalculatorSteps.tsx
 * defines them (see that file's header for why). `typeKey` / `tierKey` /
 * `brandKeyCfg` / `condKeyCfg` / `groundLeaseFromLabel` — the source's own
 * display-string → CONFIG-key shims (index.html:1385-1394, :1512) — resolve the
 * typed `ValuationInput` at the two points that need it: priming on mount and
 * every entry into the estimate. `typeKey`/`tierKey` are also read (cheaply, in
 * render) to address the frozen benchmark bands for the rail.
 *
 * ── PRIMED ON MOUNT (index.html:1687, "prime Step 3 so it's correct the moment
 * the user reaches it") ──────────────────────────────────────────────────────
 * `result` initialises from `calculate()` run against the seeded defaults
 * (occ 74 / ADR 198, both non-zero — no backfill needed). The results area is
 * therefore never empty and a step change never has to wait on a computation;
 * it is recomputed only when the visitor actually reaches the estimate again.
 *
 * ── THE TWO VALIDATION GATES (index.html:1620-1637) ─────────────────────────
 * `gateToMarket`: the ONLY blocking check in the whole calculator — Keys must
 * be >= 1 (`keysAreValid`). Failure sets the ported error string, moves focus to
 * the field, and does not advance.
 * `gateToEstimate`: never blocks. It silently backfills an empty Occupancy/ADR
 * from `typicalFor(tier)`, clamps Occupancy to 100 as defence-in-depth
 * (unreachable through the UI — the live formatter already caps at 100 — kept
 * because the source keeps it), latches `usedDefaults` (module-scoped in the
 * source, never reset to false — mirrored here as a one-way state flip), and
 * recomputes `result`.
 *
 * `usedDefaults` is intentionally NEVER set back to `false` anywhere in this
 * file, including "Start over" — index.html never resets it either
 * (docs/design/specs/calculator.md, "ported defects" table, §C.9(3)).
 *
 * ── NAVIGATION (index.html:1667-1687 `data-go` wiring, extended) ────────────
 * `goToStep` gives the numbered stepper the same reach as the buttons: a
 * backward jump is ALWAYS free (no validation, no recompute — matches "Back" /
 * "Start over"); a forward jump walks the intervening gate(s) in order, so
 * clicking "04" from step 1 cannot reach the estimate with invalid Keys — no
 * state is reachable that the source's linear Continue → Calculate path could
 * not reach.
 *
 * ── FOCUS + MOTION (§3.3) ───────────────────────────────────────────────────
 * A step change moves focus to the incoming panel (`tabIndex={-1}`,
 * `role="group"`, `aria-labelledby` its own step heading — so what is announced
 * IS the new step heading) — never on the initial mount, which would steal the
 * page's focus on load. The focus call passes `preventScroll: true`: the panel
 * is already on screen (the control that changed the step is inside it), so
 * nothing needs to move, and an unrequested scroll-into-view would only risk
 * settling the section under the sticky nav. Focus never leaves `#calculator`.
 *
 * D22 note (2026-08-10): this rationale previously also cited fighting the
 * route's `scroll-snap-type: y mandatory` rule — that rule and `PagedMode`
 * are both deleted, and scrolling on the landing route is now entirely
 * natural. `preventScroll: true` is unchanged and still correct for the
 * "nothing needs to move" reason above, independent of snap.
 *
 * The keys-error path deliberately keeps a PLAIN `.focus()`: that one is a
 * validation failure, the field may genuinely be off-screen on a tall/zoomed
 * layout, and the ported behaviour is "take the user to the problem".
 *
 * Per the spec's motion table, step changes are NOT animated (ref 05 — "Step
 * change: none — nothing to gate"); the only motion in this section lives
 * inside BenchmarkBars/Reveal, neither of which this file touches.
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
import { Button } from "@/components/ui/button";

import { CalculatorResult, type CalculatorResultProps } from "./CalculatorResult";
import {
  INITIAL_FORM,
  STEP_NAMES,
  STEP_TITLES,
  StepAsset,
  StepMarket,
  StepPerformance,
  type CalculatorForm,
  type CalculatorStep,
} from "./CalculatorSteps";
import { ContextRail } from "./ContextRail";

/* -------------------------------------------------------------------------- */
/*  Step machine                                                              */
/* -------------------------------------------------------------------------- */

const STEPS: readonly CalculatorStep[] = [1, 2, 3, 4, 5];
const LAST_STEP: CalculatorStep = 5;

/** Only one step panel is ever mounted, so one id serves all five headings. */
const STEP_HEADING_ID = "calculator-step-heading";

/** The `<form>` the three input steps share. The submit button lives in the
 *  action row OUTSIDE that form and points here with the `form` attribute, so
 *  Enter-from-any-field still advances the step. */
const STEP_FORM_ID = "calculator-step-form";

/** index.html:1004 / :1021 — the two ported navigation strings, byte-exact. */
const CONTINUE_COPY = "Continue";
const CALCULATE_COPY = "Calculate";
/** index.html:1019 */
const BACK_COPY = "Back";

/**
 * Steps 4 (Estimate) and 5 (Strategy) are two views of one result panel, which
 * is `CalculatorResult.tsx` — a file this agent does not own and must not edit
 * (its five existing props are passed through byte-identically below).
 *
 * The D14 split needs ONE discriminator that file does not expose yet. Rather
 * than fork the panel or mutate its module, the component is widened here by a
 * plain contravariant upcast: a `(p: CalculatorResultProps) => Element` is
 * already assignable to a component taking `CalculatorResultProps & { view }`,
 * so this is type-safe today and passes an inert extra prop that the current
 * implementation ignores.
 *
 * HANDOFF: when `CalculatorResultProps` gains `view: "estimate" | "strategy"`
 * — estimate = §B.4.1 range + disclaimers, §B.4.2 "How we got there", §B.4.3
 * benchmark bars and the live-rate footnote; strategy = §B.4.4 "What this means
 * for you", §B.4.5 "What happens next", §B.4.6-4.8 BOV CTA / email capture /
 * Calendly / "Start over" — this alias becomes a no-op and can be deleted, and
 * the `<ResultPanel>` calls below become `<CalculatorResult>` unchanged. Until
 * that lands, both steps render the whole panel: no field, string or disclaimer
 * is lost, but the estimate/strategy split is not yet visible.
 */
type ResultView = "estimate" | "strategy";
const ResultPanel = CalculatorResult as React.ComponentType<
  CalculatorResultProps & { view: ResultView }
>;

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
 * D14 moves only WHEN this runs (entering step 4 rather than step 3); the body
 * is byte-for-byte what it was.
 */
function applyEstimateAutofill(form: CalculatorForm): {
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
/*  Layout vocabulary                                                          */
/* -------------------------------------------------------------------------- */

const CONSOLE_CLASS = "surface-deep hairline rounded-card flex flex-col gap-5 p-5 sm:p-6";

/**
 * Two explicit rows and two explicit columns at `lg`. The rail track is a fixed
 * 20rem so the workspace column's width is identical on all five steps — a
 * horizontal shift counts against CLS exactly like a vertical one.
 */
const BODY_GRID_CLASS =
  "grid gap-6 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-[1fr_auto] lg:gap-x-8 lg:gap-y-6";

const FIELDS_CELL_CLASS =
  "flex min-w-0 flex-col gap-4 lg:col-start-1 lg:row-start-1 lg:min-h-[26rem] lg:justify-between lg:gap-6";

/** Same slot on every step. `self-start` only — never sticky (§D14). */
const RAIL_CELL_CLASS = "min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start";

const ACTIONS_CELL_CLASS = "flex flex-wrap gap-3 lg:col-start-1 lg:row-start-2";

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export type CalculatorProps = {
  className?: string;
};

export function Calculator({ className }: CalculatorProps) {
  const [form, setForm] = React.useState<CalculatorForm>(INITIAL_FORM);
  const [step, setStep] = React.useState<CalculatorStep>(1);
  const [keysError, setKeysError] = React.useState<string | null>(null);
  const [autofillNote, setAutofillNote] = React.useState<string | null>(null);
  const [usedDefaults, setUsedDefaults] = React.useState(false);
  const [result, setResult] = React.useState<ValuationResult>(() =>
    calculate(buildValuationInput(INITIAL_FORM, false)),
  );

  const keysRef = React.useRef<HTMLInputElement>(null);
  const panelRef = React.useRef<HTMLElement | null>(null);
  const mounted = React.useRef(false);

  /* The step panel is a <form> on steps 1-3 and a plain <div> on 4-5, so the
     ref has to be a callback rather than a typed object ref. Memoised: an
     inline arrow would be a new identity on every render and make React detach
     and reattach the ref each time. */
  const setPanelRef = React.useCallback((node: HTMLElement | null) => {
    panelRef.current = node;
  }, []);

  // Focus follows a step change, but never steals focus on first paint.
  // `preventScroll` keeps the move inside `#calculator` — see the header.
  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    panelRef.current?.focus({ preventScroll: true });
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
  function gateToMarket(): boolean {
    if (!keysAreValid(parseNumericField(form.keys))) {
      setKeysError(KEYS_REQUIRED_ERROR);
      keysRef.current?.focus();
      return false;
    }
    setKeysError(null);
    return true;
  }

  /** index.html:1627-1636 + :1596-1611 — never blocks; always recomputes. */
  function gateToEstimate(): boolean {
    const { form: nextForm, usedDefaults: backfilled } = applyEstimateAutofill(form);
    const nextUsedDefaults = usedDefaults || backfilled;
    if (nextForm !== form) setForm(nextForm);
    if (backfilled && !usedDefaults) setUsedDefaults(true);
    setResult(calculate(buildValuationInput(nextForm, nextUsedDefaults)));
    return true;
  }

  /**
   * Backward is ALWAYS allowed (no validation, no recompute — the source's
   * "Back" / "Start over" contract). Forward walks every gate between the
   * current step and the target in order, stopping at the first failure, so a
   * direct stepper click can never land somewhere Continue → Calculate could
   * not.
   */
  function goToStep(target: CalculatorStep) {
    if (target === step) {
      panelRef.current?.focus({ preventScroll: true });
      return;
    }
    if (target < step) {
      setStep(target);
      return;
    }
    let cur: CalculatorStep = step;
    while (cur < target) {
      const next = (cur + 1) as CalculatorStep;
      const ok = next === 2 ? gateToMarket() : next === 4 ? gateToEstimate() : true;
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

  const isInputStep = step <= 3;

  /** The step's own fields. Steps return fragments; the cell below is the box. */
  const fields =
    step === 1 ? (
      <StepAsset
        headingId={STEP_HEADING_ID}
        form={form}
        onChange={handleFormChange}
        keysError={keysError}
        keysRef={keysRef}
      />
    ) : step === 2 ? (
      <StepMarket headingId={STEP_HEADING_ID} form={form} onChange={handleFormChange} />
    ) : step === 3 ? (
      <StepPerformance
        headingId={STEP_HEADING_ID}
        form={form}
        onChange={handleFormChange}
        autofillNote={autofillNote}
        onAutofill={handleAutofill}
      />
    ) : (
      <ResultPanel
        view={step === 4 ? "estimate" : "strategy"}
        headingId={STEP_HEADING_ID}
        heading={STEP_TITLES[step]}
        result={result}
        onSendEstimate={sendEstimate}
        onStartOver={() => goToStep(1)}
      />
    );

  return (
    <div className={cn(CONSOLE_CLASS, className)}>
      <Stepper step={step} onSelect={goToStep} />

      <div className={BODY_GRID_CLASS}>
        {isInputStep ? (
          <form
            id={STEP_FORM_ID}
            noValidate
            ref={setPanelRef}
            role="group"
            tabIndex={-1}
            aria-labelledby={STEP_HEADING_ID}
            className={FIELDS_CELL_CLASS}
            onSubmit={(event) => {
              event.preventDefault();
              goToStep((step + 1) as CalculatorStep);
            }}
          >
            {fields}
          </form>
        ) : (
          <div
            ref={setPanelRef}
            role="group"
            tabIndex={-1}
            aria-labelledby={STEP_HEADING_ID}
            className={FIELDS_CELL_CLASS}
          >
            {fields}
          </div>
        )}

        {/* One instance, one landmark. The grid puts it in the right-hand rail
            at lg+ and between the fields and the action row on mobile. */}
        <ContextRail
          propertyType={typeKey(form.propertyType)}
          propertyTypeLabel={form.propertyType}
          tier={tierKey(form.tier)}
          tierLabel={form.tier}
          className={RAIL_CELL_CLASS}
        />

        <div className={ACTIONS_CELL_CLASS}>
          {step > 1 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => goToStep((step - 1) as CalculatorStep)}
              className="w-full sm:w-auto"
            >
              {BACK_COPY}
            </Button>
          ) : null}

          {step < LAST_STEP ? (
            isInputStep ? (
              <Button type="submit" form={STEP_FORM_ID} className="w-full sm:w-auto">
                {step === 3 ? CALCULATE_COPY : CONTINUE_COPY}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => goToStep((step + 1) as CalculatorStep)}
                className="w-full sm:w-auto"
              >
                {CONTINUE_COPY}
              </Button>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stepper — five numbered stations, index.html:924-930 restyled + a11y'd     */
/* -------------------------------------------------------------------------- */

type StepperProps = {
  step: CalculatorStep;
  onSelect: (target: CalculatorStep) => void;
};

const STEP_BUTTON_BASE =
  "flex min-h-11 items-center rounded-pill border transition-colors duration-fast ease-out";
const STEP_BUTTON_ON = `${STEP_BUTTON_BASE} border-accent bg-accent-chip text-accent-text`;
const STEP_BUTTON_OFF = `${STEP_BUTTON_BASE} border-hairline text-fg-meta hover:border-accent-text hover:text-fg`;

/** 44px square numeral cell — the tap target, with or without a visible name. */
const STEP_NUMERAL = "grid size-11 shrink-0 place-items-center font-mono text-data font-medium tabular";
/** The station name. Micro voice; hidden below `md`, which is what keeps five
 *  stations inside a 375px console without a horizontally scrolling rail. */
const STEP_NAME = "hidden pe-4 font-mono text-micro uppercase tracking-micro md:inline";

/**
 * The source's three decorative dots (`.dot`, cumulative `<=` active state, no
 * ARIA at all) become five numbered, keyboard-navigable buttons: `aria-current=
 * "step"` on the current one, and an accessible name of "Step N of 5: <station
 * name>" on every one — the visible "01"/"Asset" glyphs are aria-hidden so that
 * name is not doubled for screen-reader users. The adjacent "Step N of 5"
 * paragraph is the single live region (spec IA #5); the buttons announce
 * nothing on their own.
 *
 * No station is disabled: a disabled control is unreachable by keyboard and
 * says nothing about WHY. Clicking forward runs the gates instead, so an
 * invalid Keys field answers with the ported error on the field itself.
 */
function Stepper({ step, onSelect }: StepperProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <ol role="list" className="flex flex-wrap items-center gap-1 sm:gap-2.5">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-1 sm:gap-2.5">
            {i > 0 ? (
              <span aria-hidden="true" className="block h-px w-1.5 bg-hairline sm:w-5 lg:w-8" />
            ) : null}
            <button
              type="button"
              onClick={() => onSelect(s)}
              aria-current={s === step ? "step" : undefined}
              className={s === step ? STEP_BUTTON_ON : STEP_BUTTON_OFF}
            >
              <span aria-hidden="true" className={STEP_NUMERAL}>
                {String(s).padStart(2, "0")}
              </span>
              <span aria-hidden="true" className={STEP_NAME}>
                {STEP_NAMES[s]}
              </span>
              <span className="visually-hidden">{`Step ${s} of 5: ${STEP_NAMES[s]}`}</span>
            </button>
          </li>
        ))}
      </ol>

      <p role="status" aria-live="polite" className="micro-label font-medium">
        {`Step ${step} of 5`}
      </p>
    </div>
  );
}
