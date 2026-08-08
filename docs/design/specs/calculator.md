# Spec — `#calculator` (Hotel Worth Calculator)

**Section/Route:** `#calculator` (landing page, section 6 of 13 per ref 04)
**Status:** `provisional` — implemented as specified; three copy/behaviour items below need Razim's ratification (C1, C2, C3).
**Date:** 2026-08-08

**Intent:** An owner arrives sceptical and anonymous, answers ten questions in under a minute, and leaves with a number they believe, a plain-language read on *why* it is that number, and one obvious next move — without ever being asked who they are.

---

## Sources of truth

| What | Where | Rule |
|---|---|---|
| Math, config, defaults, bands, advice, formatters | `site/lib/valuation.ts` | **FROZEN.** The UI holds input state and renders `ValuationResult`. It reimplements nothing. |
| Field inventory, option lists, popover copy, step titles, results anatomy | `docs/port/01-calculator.md` §B | Ported field-for-field. |
| Disclaimers, benchmark scope note | `site/content/compliance.ts` → `CALCULATOR_DISCLAIMER` | Byte-exact, imported, never retyped. |
| Lead submission | `site/lib/web3forms.ts` | One payload builder, one transport. No second `fetch`. |
| Scheduling destination | `site/content/site.ts` → `CALENDLY_URL` / `CALENDLY_FALLBACK` | `blocked: calendly-url`. Degrades to `#bov`. |

---

## IA (content slots, in order)

**Left column — intro (Server Component, zero JS)**

1. Micro-label `[ 03 — VALUATION ]`
2. `h2` — "What's your hotel *worth*?" (one italic accent word: `worth`)
3. Sub — "Get a confidential range in under 60 seconds. No email required to see the result." (**C1** — see Decisions)
4. Methodology note — `CALCULATOR_DISCLAIMER.methodologyNote`, verbatim

**Right column — the wizard panel (`.surface-deep`, hairline, `rounded-card`) — client island**

5. Stepper row: `01 · 02 · 03` (mono, buttons) + "Step N of 3" (live region)
6. Step panel (`role="group"`, `tabIndex={-1}`, `aria-labelledby` its own `h3`)

**Step 01 — "First, the basics."**
Property Type (select, ⓘ) · Keys (int, ⓘ, **the only required field**) · Where is it? (select, ⓘ) · Brand (select, ⓘ) · ZIP code — optional (text, maxLength 5) · `<details>` "Refine my estimate (optional)": Condition / last renovation (select, ⓘ) · Land (select, ⓘ) · F&B as % of revenue (pct, ⓘ — **only when type is `Full-Service` or `Resort / Boutique`**) · I know my actual NOI (money, ⓘ) · nav: `Continue`

**Step 02 — "Now, how's it doing?"**
TTM note with inline ⓘ · Occupancy (TTM) (pct, ⓘ, default `74`) · ADR (TTM) (money, ⓘ, default `198`) · live RevPAR preview (height-reserved) · "I'm not sure of my exact numbers — use typical figures" + note (height-reserved) · nav: `Back` · `Calculate`

**Step 03 — results**
`h3` "Here's where the market would likely start" · **value range (Fraunces, display2)** · `resultHonest` · `resultContext` (+ conditional italic caveats) · band `[ HOW WE GOT THERE ]` → 4 metric chips (RevPAR · NOI/key/yr · Value/key · Cap rate) · band `[ WHERE YOU SIT ]` + scope disclaimer + 2 benchmark bars · band `[ WHAT THIS MEANS FOR YOU ]` → **1–2 advice paragraphs + exactly 1 CTA line** · band `[ WHAT HAPPENS NEXT ]` + 4 bullets · primary CTA "Request a written BOV" → `#bov` · email capture "Email me this estimate + the comp set we'd use" · tertiary "Prefer a call? Book 15 minutes" · "Start over"

---

## Component plan

| Component | Tokens | Content source |
|---|---|---|
| `sections/CalculatorSection.tsx` (server) | `.surface-paper` `section-pad` `container-hk` `text-display2` `text-body` | `SectionHeader`, `CALCULATOR_DISCLAIMER.methodologyNote` |
| `calculator/Calculator.tsx` (client island) | `.surface-deep` `hairline` `rounded-card` `text-data` `micro-label` | `lib/valuation` exports; `lib/web3forms` |
| `calculator/CalculatorSteps.tsx` | `bg-field` `border-hairline` `min-h-11` `font-mono` `tabular` `text-brick` | `PROPERTY_TYPE_OPTIONS` / `TIER_OPTIONS` / `BRAND_OPTIONS` / `CONDITION_OPTIONS` / `LAND_OPTIONS`, `KEYS_REQUIRED_ERROR`, `TYPICAL_FIGURES_NOTE` |
| `calculator/CalculatorResult.tsx` | `font-display font-light text-display2 tabular` (range) · `font-mono text-body font-medium tabular` (chips) · `text-accent-text` | `ValuationResult.display` / `.topAdvice` / `.ctaLine` / `.prefill`; `CALCULATOR_DISCLAIMER` |
| `calculator/BenchmarkBars.tsx` | `bg-hairline` track · `bg-accent` fill · `duration-base` `ease-out` | `ValuationResult.occBandPct` / `.revparBandPct` + `formatOccBandSub` / `formatRevparBandSub` |
| `calculator/InfoPopover.tsx` | `ui/popover.tsx` (`PopoverInfoTrigger` = 44px, `PopoverContent` = `.surface-card` + `hairline` + `shadow-overlay`) | 11 verbatim popover strings, rendered as React nodes |

**Type sizes used (4 — ref 03 cap respected):** `display2` (section h2 + result range) · `body` (all reading copy, labels, buttons; step heads use `font-display` at 400 for a firmer step rather than a fifth size) · `data` (annotations, glosses, band subs, chip stepper) · `micro` (micro-labels, band labels).

**Accent budget:** result range (`text-accent-text`), current-step underline (2px), benchmark bar fills, hairline rules. Primary CTA is an ink pill on light, so accent never competes with it. Well under 5% of the viewport.

---

## States

| Slot | Default | Interaction | Error | Empty | Reduced motion |
|---|---|---|---|---|---|
| Step panel | Step 01, seeded defaults (`Full-Service`, `88`, `Standard / suburban`, `Branded (franchise)`, `4–8 yrs (baseline)`, `Fee Simple`, `74`, `198`) | Forward moves run the source's gates; backward moves run nothing | — | — | Instant (no step transition animation at all) |
| Keys | `88` | live `int` formatter, comma grouping, caret preserved | `KEYS_REQUIRED_ERROR` inline: `role="alert"` + `AlertCircle` + `text-brick`, focus moves to the input | — | n/a |
| Occupancy / ADR | `74` / `198` | live `pct` (hard cap 100) / `money` formatters | never blocks — empty backfills from `typicalFor(tier)` and latches `usedDefaults` | — | n/a |
| F&B row | hidden | revealed only for `Full-Service` / `Resort / Boutique` | — | — | n/a |
| Live RevPAR | empty at 0 occ or 0 ADR | recomputes per keystroke | — | height reserved (`min-h-6`) | n/a |
| Autofill note | empty | fills on click, `role="status"` | — | height reserved | n/a |
| Result | **primed on mount** from the seeded defaults (source `index.html:1686`) — never an empty `—` | recomputed only on entering step 03 | — | cannot be empty | no entrance animation |
| Benchmark bars | `scaleX` set from `pctBar` | `transition-transform duration-base ease-out` on recalculation only | — | 0 % fill is a legitimate state (clamped) | `transition-none` |
| Email capture | empty | `Sending…` → `Done — we'll send…` (input disabled, button reads `Sent`) | invalid / unconfigured / rejected / network — each with its own copy, an icon, and `text-brick` | height-reserved status row | n/a |
| Calendly CTA | **`CALENDLY_URL === null`** → renders as an `<a href="#bov">`, no widget script requested | when provisioned: `<button>` that lazy-injects the widget on first click | falls back to `#bov` if the script is blocked | — | n/a |

---

## Motion

| What | Token | Trigger | Gate |
|---|---|---|---|
| Section entrance | `revealVariants` via `Reveal` (opacity + 16px rise, `DUR.reveal`, `EASE.out`, once at 20 %) | in-view | `Reveal` gates on `useReducedMotion()` + `motionAllowed()` |
| Benchmark bar fill | `transform: scaleX()` — **never `width`** — `duration-base` / `ease-out` | value change | `useReducedMotion()` + `motionAllowed()` via `useSyncExternalStore`; `transition-none` when off |
| Select chevron / details chevron | `transition-transform duration-fast ease-out` | open state | global reduced-motion block in `globals.css` |
| Step change | **none** | — | nothing to gate |
| Popover | **none** (`ui/popover.tsx` is deliberately un-animated) | — | n/a |

No layout property is animated anywhere in this section.

---

## Accessibility

- `<section id="calculator" aria-labelledby="calculator-heading">`; the `h2` owns that id. Step heads are `h3`.
- **The ⓘ trigger is a sibling of the `<label>`, never a child** — the source nested a `<button>` inside `<label>`, which is a nested-interactive-element failure. Each trigger is 44 × 44px with a specific `aria-label` ("What ADR means", "What TTM means", …) rather than the source's ten identical "What's this?" names.
- Stepper: `<ol>` of buttons; current carries `aria-current="step"`; each button's accessible name is "Step N of 3: <step title>". Backward navigation is free; forward navigation runs the same validation gates as `Continue` / `Calculate`, so no state is reachable that the source could not reach.
- Step change moves focus to the step panel (`tabIndex={-1}`, `aria-labelledby` its `h3`) so focus is never orphaned on a button that has just unmounted; "Step N of 3" is a `role="status" aria-live="polite"` region.
- Keys error: `aria-invalid`, `aria-describedby`, `role="alert"`, a Lucide `AlertCircle` **and** `text-brick` — never colour alone — plus focus moved to the field.
- Benchmark track: `role="meter"`, `aria-valuemin=0` / `aria-valuemax=100` / `aria-valuenow`, `aria-labelledby` the row's label + value, `aria-describedby` the typical-band sub. The fill span is `aria-hidden`.
- Units that only exist as a visual adornment (`$`, `%`) are `aria-hidden` and restated as a visually-hidden suffix on the label ("in percent", "in US dollars"), so the accessible name is complete without changing a single visible string.
- All inputs are 16px (`text-body`) — iOS anti-zoom; all controls clear 44px; the focus ring is the global 2px `var(--focus)` and is removed nowhere.
- All numerals are `tabular-nums` (inputs, chips, bars, stepper) so nothing jitters as values update.
- Live RevPAR is **not** a live region: announcing on every keystroke is noise. It is a static `<p>` adjacent to the fields it derives from.
- Contrast: `--meta` 5.01:1 on `--paper`; `--accent-ink` 4.54:1 on `--surface-deep` (range figure is large text, needs 3:1); `--brick` 5.93:1 on light. Panel is a light surface in both themes, so no dark-surface `--brick` mix is needed here.

---

## Deviations from the source, and why

| # | Source | Hokuten | Reason |
|---|---|---|---|
| D-a | `<button class="calc-info">` nested inside `<label>` | trigger is a label sibling | nested interactive elements (P0 a11y) |
| D-b | ten identical `aria-label="What's this?"` | one specific label per trigger | duplicate accessible names (P0 a11y) |
| D-c | dots, decorative, no ARIA | numbered mono stepper, keyboard navigable, `aria-current` | ref 04 mandate + a11y |
| D-d | bar fill animated by `width` (in fact un-animated) | `transform: scaleX()` | motion law: never a layout property |
| D-e | `innerHTML` for advice / context / bars | React nodes via a 2-tag (`<strong>`, `<em>`) renderer | no `dangerouslySetInnerHTML` |
| D-f | `#resHonest` / `#resContext` string literals | imported from `CALCULATOR_DISCLAIMER` | content law: never retype a legal string |
| D-g | Calendly URL gets `hide_gdpr_banner=1` appended | **not carried over** | suppressing a third party's consent prompt is a privacy decision nobody has made — see **C3** |
| D-h | "Prefer a call? Book 15 minutes →" | trailing `→` dropped | ref 07 P1: no text-glyph arrows outside mono micro-labels |
| D-i | serif italic advice paragraphs, gold `<strong>` | Inter body, two-tone emphasis (`<strong>` → `text-fg` at 500, rest `text-fg-muted`) | italic is reserved for the single headline accent word; the two-tone device carries emphasis |
| D-j | lead payload omits ground lease, F&B and NOI | three additive keys `ground_lease`, `fb_pct`, `noi_annual` | port pack §C.9(7) — three inputs that moved the number never reached the inbox. Additive only; no existing key renamed |
| D-k | `window.__kwcEstimate` global | `ValuationResult.prefill`, never mirrored onto `window` | port pack §C.9(2) |

---

## Ported defects — kept deliberately, flagged for decision

| # | Behaviour | Status |
|---|---|---|
| D3 | A hidden F&B value still widens the cap by 25 bps (enter 40 % on Full-Service, switch to Limited-Service — the adjustment survives) | **ported as-is.** Fixing it changes shipped numbers; the port pack says flag, do not silently fix. Needs a dated PROJECT-MEMORY decision. |
| §C.9(3) | "Start over" navigates to step 01 and resets **nothing**; `usedDefaults` stays latched for the session | **ported as-is.** The copy promises more than the behaviour delivers — P2 copy fix proposed, not taken. |
| §B.4.2 | The `*` on NOI/key has no on-page legend; only the `usedNoiOverride` caveat sentence explains it | ported as-is (`content/compliance.ts` explicitly says "the source has no `* = …` legend. Do not invent one") |
| §B.2.6.3 | The F&B popover says a high mix "lowers the income margin we assume"; the code widens the **cap rate** | ported verbatim (ref 06 sanctions popover copy verbatim). Copy fix logged as P2. |
| D1/D2 | `keys = 0` produces `$InfinityK` / `$NaNK` | unreachable: forward navigation always runs the keys gate first, and `keys` cannot be edited from step 03 |

---

## Decisions needing ratification

**C1 — "from comp data" removed from the intro sub.** The source reads "Get a confidential range from comp data in under 60 seconds." The port pack (§B.6) proves the model is *"GENERALIZED industry assumptions … NOT transaction-derived"*, and the disclaimer we render four lines below says exactly that. Shipping "from comp data" would be a capability claim with no register row and an on-page contradiction — a P0 evidence-gate failure. Three words deleted; everything else byte-identical. **Needs a register row or Razim's sign-off.**

**C2 — email-capture status copy is team-first.** `"Done — Dino will send…"` → `"Done — we'll send your estimate and comp set shortly."`; failure branches point at `CONTACT.email` (imported, not retyped). Per port pack §0.3 **[VOICE]**.

**C3 — `hide_gdpr_banner=1` dropped from the Calendly URL.** Reported, not ported. If the team wants it back it is a privacy decision with a paper trail, not a default.

---

## Acceptance criteria

- [ ] `#calculator` renders on `.surface-paper` with `section-pad` + `container-hk`, `aria-labelledby` pointing at its own `h2`, and micro-label `[ 03 — VALUATION ]`.
- [ ] With JS enabled and no interaction, step 03 already holds `$22.6M – $26.2M` / `$147` / `$23,037` / `$255K – $295K` / `7.8% – 9.0%` (golden case G1) — the on-load prime, so the results area is never empty and never shifts.
- [ ] Every field from port pack §B is present with its exact default, `inputMode`, `autoComplete`, `maxLength` and placeholder; every option list is byte-exact and in source order; all 11 ⓘ popovers carry their verbatim copy.
- [ ] Typing `1,2,3,4` into Keys leaves the caret where the user put it (no jump to end); typing `999` into Occupancy rewrites to `100` on the keystroke; typing letters anywhere is silently dropped without desyncing the field.
- [ ] The F&B row appears only for `Full-Service` and `Resort / Boutique`.
- [ ] `Continue` with an empty Keys field shows "How many rentable rooms does the hotel have?" with an icon, moves focus to the field, and does not advance.
- [ ] Clearing Occupancy and pressing `Calculate` backfills the tier's typical figure and the result context gains the italic "This range uses typical figures…" caveat.
- [ ] Entering an NOI puts a `*` on the NOI/key chip **and** adds the italic "Using your actual NOI…" caveat — the two never appear apart.
- [ ] The "Where you sit" band renders `— broad national reference for this type, not your local comp set` byte-exact.
- [ ] The insights band shows **one or two** advice paragraphs plus **exactly one** CTA line — never three advice paragraphs, never zero.
- [ ] The value range is set in Fraunces (`font-display`), not mono; RevPAR / NOI / key / value-per-key / cap rate **are** mono and tabular.
- [ ] Tertiary CTA is an `<a href="#bov">` while `CALENDLY_URL` is null, and the network panel shows **zero** requests to `assets.calendly.com`.
- [ ] "Email me this estimate" with an unprovisioned key shows the honest unconfigured message with the team inbox — never a fake success.
- [ ] Keyboard only: Tab reaches the stepper, every field, every ⓘ, every button; Esc closes a popover and returns focus to its trigger; each step change lands focus inside the new step.
- [ ] `prefers-reduced-motion: reduce`: steps change instantly, bars snap, nothing animates; every state is designed, none is missing.
- [ ] 375 px (iPhone SE): single column, no horizontal scroll, all controls ≥44 px, all inputs ≥16px, the value range does not clip.
- [ ] `grep -rn "#B8902E\|#B8943D\|rgb(\|gray-\|slate-\|zinc-" site/components/calculator site/components/sections/CalculatorSection.tsx` returns nothing.
- [ ] `npx tsc --noEmit` clean.
