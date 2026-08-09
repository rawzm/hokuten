"use client";

/**
 * components/calculator/CalculatorResult.tsx — step 03: the estimate,
 * rebuilt as a DASHBOARD (DESIGN-REVISIT §4.6, D6/D7/D8, 2026-08-09).
 *
 * Anatomy ported from docs/port/01-calculator.md §B.4 (index.html:1025-1081):
 * value range → "How we got there" chips → "Where you sit" bars → "What this
 * means for you" → "What happens next" → CTAs. Every number and every formatted
 * string arrives ready-made on `ValuationResult`; nothing is computed here.
 *
 * ── WHAT CHANGED, AND WHY ───────────────────────────────────────────────────
 * The old panel was a vertical stack of five bands: the number, then chips,
 * then bars, then two prose bands, then the CTAs. On a fit-to-viewport section
 * that reads like a form confirmation and buries the payoff. It is now one
 * dashboard object plus two supporting rows:
 *
 *   ┌ dashboard card (surface-card, hairline, one object) ────────────────┐
 *   │ ROW 1 · the finding            │ ROW 1 · the evidence beside it     │
 *   │   [ here's where the market… ] │  [ where you sit ] + scope note    │
 *   │   $22.6M – $26.2M   (display2) │  Occupancy / RevPAR benchmark bars │
 *   │   both disclaimers             │                                    │
 *   ├────────────────────────────────┴────────────────────────────────────┤
 *   │ ROW 2 · [ how we got there ] — four metric chips, 4-across at xl    │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │ ROW 3 · live-rate footnote (10-Yr Treasury · SOFR), height reserved │
 *   └─────────────────────────────────────────────────────────────────────┘
 *   then: [ what this means for you ] | [ what happens next ]   (two-up)
 *   then: primary CTA + tertiary + start over | email capture   (two-up)
 *
 * The benchmark bars are PROMOTED into the dashboard — evidence beside the
 * number, not an appendix under it. Nothing was dropped to make room: every
 * band label, gloss, disclaimer, advice body, CTA and status string in §B.4
 * still renders (see the fidelity checklist at the foot of this comment).
 *
 * ── WHY THE SIDE-BY-SIDE STARTS AT `xl`, NOT `lg` ───────────────────────────
 * Measured, not guessed. The step column is narrowed by the shell's constant
 * 17rem ContextRail, so at a 1024px viewport it is ~576px wide. `text-display2`
 * resolves to ~53px there, and the widest realistic range string
 * ("$122.6M – $126.2M") needs ~440px of Fraunces at that size — more than half
 * the column. Splitting at `lg` would wrap the payoff figure onto two lines at
 * exactly the width where it matters most. So the dashboard's first row is one
 * column up to 1279px and two columns from 1280px, where the step column is
 * ~832px and the figure has ~445px of its own. Below `lg` nothing is forced —
 * mobile keeps natural flow (D6).
 *
 * ── ZERO CLS ────────────────────────────────────────────────────────────────
 * Three reserved slots, no measurement anywhere:
 *   1. The live-rate footnote row is always in the DOM at `min-h-11`; only its
 *      CONTENTS are conditional. Rates arriving late fill a box that already
 *      exists (and when they never arrive, nothing pretends to be data — no
 *      dash-filled skeleton, per the brief).
 *   2. The email-capture status line keeps its `min-h-6`, so idle → sending →
 *      sent never moves the CTAs.
 *   3. Everything else is static markup whose height depends only on strings
 *      that are present at first paint.
 *
 * ── TYPOGRAPHY (D8) ─────────────────────────────────────────────────────────
 * Four sizes, four jobs: `display2` (the range only) · `body` (prose, metric
 * values, buttons) · `data` (disclaimers, glosses, bar figures, status) ·
 * `micro` (every label). The range is the strongest step in the section and
 * takes Fraunces **500** — D8 explicitly raises the display ceiling from 300 to
 * 500 (never 600+) where a line needs a firmer step, and this is that line.
 * Setting a stat numeral in mono is still a P1 breach (ref 03), so the range
 * stays Fraunces with `tabular` figures; the supporting figures — RevPAR,
 * NOI/key, value/key, cap rate, the bar values, the live rates — ARE deal data
 * and are therefore mono + tabular. The result label steps DOWN to the mono
 * caps micro-voice so the figure has nothing to compete with.
 *
 * ── RICH TEXT ───────────────────────────────────────────────────────────────
 * Three ADVICE bodies carry <strong>/<em>. They are developer-authored
 * constants in lib/valuation.ts, but they still do not go through
 * dangerouslySetInnerHTML — `renderInlineMarkup` turns those two tags into React
 * nodes and drops anything else, so the render path cannot become an injection
 * sink if a future body is ever templated.
 *
 * ── INSIGHT COUNT ───────────────────────────────────────────────────────────
 * The engine slices to two (index.html:1590) and substitutes a single fallback
 * paragraph when nothing fires, so this band renders ONE OR TWO advice
 * paragraphs — never three, never zero — plus exactly one CTA line.
 *
 * ── LIVE RATES: ONE MECHANISM, NOT A SECOND ONE ─────────────────────────────
 * The footnote reuses the ticker's existing contract end to end — same route
 * (`TICKER_ENDPOINT`), same label table (`TICKER_SERIES`), same defensive
 * parser (`readTickerValues`), same lead chip (`TICKER_LEAD`), same
 * `X.XX%`-only admission rule. It adds NO polling loop and NO interval: the
 * request is a module-scoped single-flight promise, so however many times this
 * panel mounts, unmounts and remounts across a session it issues at most one
 * GET. The FRED key is not referenced here — not the value, not even the env
 * var's name, so ref 07's secret-scan grep stays clean on this file. It is read
 * in exactly one place on the site: `app/api/ticker-data/route.ts`, server-side.
 *
 * REPORTED, NOT SILENTLY FIXED: `TickerClient` owns an identical fetch in its
 * own `useEffect`, so a page that renders both the bar and this footnote makes
 * two requests rather than one. The fix is one file this agent does not own —
 * hoist `loadTickerValues()` below into `lib/ticker.ts` and have `TickerClient`
 * await the same shared promise. Until then the second request is a warm CDN
 * hit (`s-maxage=3600` on the route) and never touches FRED.
 *
 * ── CALENDLY ────────────────────────────────────────────────────────────────
 * `CALENDLY_URL` is `blocked: calendly-url` and currently null, so the tertiary
 * CTA renders as a real anchor to #bov and NOTHING is requested from
 * assets.calendly.com. When a URL lands, the widget is injected on the first
 * click and never before. The source appended `hide_gdpr_banner=1`
 * (index.html:1921); that is deliberately NOT carried over — suppressing a third
 * party's consent prompt is a decision nobody has made.
 *
 * ── CONTENT-FIDELITY CHECKLIST (docs/port/01-calculator.md §B.4, re-verified
 *    2026-08-09 after the redesign) ─────────────────────────────────────────
 *   §B.4.1 result label (STEP_TITLES[3], passed in as `heading`) · #resRange ·
 *          #resHonest · #resContext + BOTH conditional caveats  ✓
 *   §B.4.2 band label "How we got there" · all four chips in fixed order with
 *          byte-exact keys and glosses · the `*` on NOI/key (carried inside the
 *          frozen `display.noiPerKey`)  ✓
 *   §B.4.3 band label "Where you sit" + the scope sub, still adjacent  ✓
 *   §B.4.4 band label "What this means for you" · 1–2 advice bodies · exactly
 *          one CTA line  ✓
 *   §B.4.5 band label "What happens next" · intro · all four list items  ✓
 *   §B.4.6 primary CTA → #bov  ✓
 *   §B.4.7 email label · placeholder · autocomplete/inputmode · "Send it" /
 *          "Sent" · all six status strings · focus-on-invalid  ✓
 *   §B.4.8 Calendly CTA · "Start over"  ✓
 *   §B.5   both calculator disclaimers (resultHonest + resultContext) render on
 *          this panel; the third occurrence (methodologyNote) is
 *          CalculatorSection's and is untouched  ✓
 * ADDED this round (DESIGN-REVISIT §5.5, ship-gate): `PRIVACY_NOTICE_LINK`
 * under the email field — the capture collected an address and linked to no
 * policy. The constant already exists in content/compliance.ts and names this
 * component in its docstring; nothing is authored here.
 */

import * as React from "react";
import { AlertCircle, Check } from "lucide-react";

import { MicroLabel } from "@/components/atoms/MicroLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CALCULATOR_DISCLAIMER, PRIVACY_NOTICE_LINK } from "@/content/compliance";
import { CALENDLY_FALLBACK, CALENDLY_URL, CONTACT } from "@/content/site";
import {
  TICKER_ENDPOINT,
  TICKER_LEAD,
  TICKER_SERIES,
  readTickerValues,
  type TickerSeriesId,
} from "@/lib/ticker";
import type { Web3FormsResult } from "@/lib/web3forms";
import {
  formatOccBandSub,
  formatRevparBandSub,
  type ValuationPrefill,
  type ValuationResult,
} from "@/lib/valuation";

import { BenchmarkBars, type BenchmarkRow } from "./BenchmarkBars";

/* -------------------------------------------------------------------------- */
/*  Ported copy (index.html:1035-1081)                                         */
/* -------------------------------------------------------------------------- */

const BAND_HOW = "How we got there"; //           index.html:1036
const BAND_WHERE = "Where you sit"; //            index.html:1046
const BAND_MEANS = "What this means for you"; //  index.html:1053
const BAND_NEXT = "What happens next"; //         index.html:1059

const NEXT_INTRO = "A written BOV, fully confidential, no obligation. Here's what it covers:";

/** index.html:1061-1065 — static, already team-first, ports unchanged. */
const NEXT_ITEMS = [
  "We pressure-test this estimate against your real numbers and a true comp set, then tell you straight if the range should be higher or lower.",
  "We walk through your specific value levers: rate, occupancy, brand, capital needs, and timing.",
  "You get a clearer number and a read on the market, whether you sell this year, in five, or never.",
  "No listing agreement, no pressure to sell. If now isn't the time, we'll tell you that too.",
] as const;

/** index.html:1034-1043 — fixed order, exact glosses. */
const CHIP_META = [
  { key: "RevPAR", gloss: "revenue per available room — what buyers anchor on" },
  { key: "NOI / key / yr", gloss: "income left after operating costs" },
  { key: "Value / key", gloss: "per-room value range" },
  { key: "Cap rate", gloss: "the going price of income (lower = higher value)" },
] as const;

const PRIMARY_CTA = "Request a written BOV"; //                          index.html:1069
const EMAIL_LABEL = "Email me this estimate + the comp set we'd use"; // index.html:1073
const EMAIL_SEND = "Send it"; //                                        index.html:1076
const EMAIL_SENT = "Sent"; //                                           index.html:2012
/** index.html:1080. The source's trailing "→" is dropped: ref 07 P1 bans text-glyph arrows outside mono micro-labels. */
const CALENDLY_CTA = "Prefer a call? Book 15 minutes";
const START_OVER = "Start over"; //                                     index.html:1081

/** index.html:1967 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Status copy. The three source strings that named Dino personally are
 * team-first here per docs/port/01-calculator.md §0.3 [VOICE], and the inbox is
 * imported from content/site.ts rather than retyped.
 */
const EMAIL_STATUS = {
  invalid: "Please enter a valid email.", //                        index.html:1967
  sending: "Sending…", //                                           index.html:1978
  ok: "Done — we'll send your estimate and comp set shortly.", //    index.html:2011 [VOICE]
  unconfigured: `Email isn't connected yet — please send your details to ${CONTACT.email}.`, // :1995 [VOICE]
  rejected: `Couldn't send — please email ${CONTACT.email}.`, //     index.html:2015 [VOICE]
  network: `Network error — please email ${CONTACT.email}.`, //      index.html:2021 [VOICE]
} as const;

/* -------------------------------------------------------------------------- */
/*  Inline rich text — <strong> and <em> only                                  */
/* -------------------------------------------------------------------------- */

const INLINE_TAG = /<(\/?)(strong|em)>/g;

/**
 * Turn an ADVICE body into React nodes. Only `<strong>` and `<em>` are
 * recognised; every other angle-bracket run is emitted as literal text, so
 * nothing can smuggle markup through.
 *
 * `<strong>` uses the two-tone emphasis device (PHASE-1-EXECUTION §3): the body
 * sits in --fg-muted and emphasised phrases step to --fg, so colour carries the
 * emphasis and the weight barely moves.
 */
function renderInlineMarkup(html: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let open: "strong" | "em" | null = null;
  let cursor = 0;
  let buffer = "";
  let index = 0;

  const flush = () => {
    if (!buffer) return;
    const key = `${keyPrefix}-${index}`;
    index += 1;
    if (open === "strong") {
      nodes.push(
        <strong key={key} className="font-medium text-fg">
          {buffer}
        </strong>,
      );
    } else if (open === "em") {
      nodes.push(
        // Weight, not italic (2026-08-08 coherence audit): the typography
        // program never italicises UI copy, and `next/font` loads Inter with
        // no italic file — `italic` here would render a synthesized oblique.
        // `<em>` keeps the semantics; `<strong>` above stays one step louder
        // by also taking `text-fg`, so the two levels remain distinguishable.
        <em key={key} className="not-italic font-medium">
          {buffer}
        </em>,
      );
    } else {
      nodes.push(<React.Fragment key={key}>{buffer}</React.Fragment>);
    }
    buffer = "";
  };

  for (const match of html.matchAll(INLINE_TAG)) {
    const at = match.index ?? 0;
    buffer += html.slice(cursor, at);
    flush();
    open = match[1] === "/" ? null : (match[2] as "strong" | "em");
    cursor = at + match[0].length;
  }
  buffer += html.slice(cursor);
  flush();

  return nodes;
}

/* -------------------------------------------------------------------------- */
/*  Live rates — the ticker's own mechanism, single-flight, no polling         */
/* -------------------------------------------------------------------------- */

/**
 * The two series the footnote carries (DESIGN-REVISIT §4.6: "live ticker rates
 * (10-Yr, SOFR) as a footnote row"). Addressed by FRED series id and resolved
 * against `TICKER_SERIES`, so the display labels — `10-Yr Treasury`, capital Y,
 * lowercase r — are imported, never retyped, and reordering the ticker's table
 * reorders this row with it.
 */
const FOOTNOTE_SERIES_IDS: readonly TickerSeriesId[] = ["DGS10", "SOFR"];

const FOOTNOTE_SERIES = TICKER_SERIES.filter((series) =>
  FOOTNOTE_SERIES_IDS.includes(series.id),
);

/**
 * Module-scoped single flight. One GET for the lifetime of the document no
 * matter how many times step 3 is entered, left and re-entered — there is no
 * interval, no retry and no revalidation. Every failure shape resolves to an
 * empty map, which the caller reads as "render nothing".
 *
 * Deliberately NOT abortable: the promise is shared, so aborting it on one
 * consumer's unmount would poison it for the next one.
 */
let tickerLoad: Promise<ReadonlyMap<string, string>> | null = null;

function loadTickerValues(): Promise<ReadonlyMap<string, string>> {
  if (!tickerLoad) {
    tickerLoad = fetch(TICKER_ENDPOINT, { headers: { Accept: "application/json" } })
      .then((response) => (response.ok ? (response.json() as Promise<unknown>) : null))
      .then(readTickerValues)
      .catch(() => new Map<string, string>());
  }
  return tickerLoad;
}

type FootnoteRate = { id: TickerSeriesId; label: string; value: string };

/**
 * The whole client surface of the footnote: one state cell, one effect, no
 * timers. Kept in its own component so a late payload re-renders 40px of the
 * dashboard rather than the entire result panel.
 */
function LiveRateFootnote() {
  const [rates, setRates] = React.useState<ReadonlyMap<string, string> | null>(null);

  React.useEffect(() => {
    let live = true;
    void loadTickerValues().then((values) => {
      // An empty map means missing_key / fetch_failed / garbage. Staying null
      // keeps the row empty rather than re-rendering to the identical thing.
      if (live && values.size > 0) setRates(values);
    });
    return () => {
      live = false;
    };
  }, []);

  const rows: FootnoteRate[] = [];
  if (rates) {
    for (const series of FOOTNOTE_SERIES) {
      const value = rates.get(series.label);
      if (value) rows.push({ id: series.id, label: series.label, value });
    }
  }

  return (
    /* The box exists from first paint (`min-h-11`); only its contents are
       conditional. Rates arriving late therefore shift nothing, and rates that
       never arrive show nothing — no dash-filled skeleton pretending to data. */
    <div className="hairline-t flex min-h-11 flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2 lg:px-5">
      {rows.length > 0 ? (
        <>
          <MicroLabel as="p" className="font-medium">
            {TICKER_LEAD}
          </MicroLabel>
          <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            {rows.map((rate) => (
              <div key={rate.id} className="flex items-baseline gap-2">
                <dt className="micro-label">{rate.label}</dt>
                <dd className="data-line font-medium text-accent-text">{rate.value}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Calendly (lazy, and only if a URL is ever provisioned)                     */
/* -------------------------------------------------------------------------- */

type CalendlyGlobal = {
  initPopupWidget: (options: {
    url: string;
    prefill?: { customAnswers?: Record<string, string> };
  }) => void;
};

const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";
const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js";

let calendlyLoad: Promise<void> | null = null;

/** Injects the widget assets once, on the first click. Never at import time. */
function loadCalendly(): Promise<void> {
  if (calendlyLoad) return calendlyLoad;

  calendlyLoad = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${CALENDLY_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CALENDLY_CSS;
      document.head.append(link);
    }
    const script = document.createElement("script");
    script.src = CALENDLY_JS;
    script.async = true;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject(new Error("calendly-blocked")));
    document.head.append(script);
  });

  return calendlyLoad;
}

/** index.html:1923-1928 — one custom answer, segments dropped when empty. */
function calendlyAnswer(prefill: ValuationPrefill): string {
  return (
    `Self-estimated ${prefill.range} (${prefill.summary})` +
    (prefill.revpar ? ` · RevPAR ${prefill.revpar}` : "") +
    (prefill.noiPerKey ? ` · NOI ${prefill.noiPerKey}` : "") +
    (prefill.capRangeUsed ? ` · cap ${prefill.capRangeUsed}` : "") +
    (prefill.topAdvice ? ` · ${prefill.topAdvice}` : "")
  );
}

/* -------------------------------------------------------------------------- */
/*  Result                                                                     */
/* -------------------------------------------------------------------------- */

export type CalculatorResultProps = {
  headingId: string;
  heading: string;
  result: ValuationResult;
  /** Builds nothing itself — the parent owns the payload and the transport. */
  onSendEstimate: (email: string) => Promise<Web3FormsResult>;
  onStartOver: () => void;
};

export function CalculatorResult({
  headingId,
  heading,
  result,
  onSendEstimate,
  onStartOver,
}: CalculatorResultProps) {
  const chips = [
    result.display.revpar,
    result.display.noiPerKey,
    result.display.perKey,
    result.display.capRange,
  ];

  const bars: BenchmarkRow[] = [
    {
      id: "calc-bar-occ",
      label: "Occupancy",
      value: `${result.occupancyPct}%`,
      pct: result.occBandPct,
      sub: formatOccBandSub(result.occBand),
    },
    {
      id: "calc-bar-revpar",
      label: "RevPAR",
      value: result.display.revpar,
      pct: result.revparBandPct,
      sub: formatRevparBandSub(result.revparBand),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* ================= THE DASHBOARD ================================== */}
      <div className="surface-card hairline rounded-card overflow-hidden">
        {/* ---- row 1: the finding, and the evidence beside it ------------ */}
        {/* `gap-px` over a hairline ground draws the dividers: one rule in
            both orientations, correct on every surface, no per-edge classes. */}
        <div className="grid gap-px bg-hairline xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* the number */}
          <div className="flex flex-col gap-2 bg-surface p-4 lg:p-5">
            {/* §B.4.1 `.result-label`. D8 steps it DOWN into the mono caps
                micro-voice so the figure below owns the cell outright. */}
            <h3 id={headingId} className="micro-label font-medium">
              {heading}
            </h3>

            <p className="font-display text-display2 font-medium tabular text-accent-text">
              {result.display.range}
            </p>

            {/* CALCULATOR_DISCLAIMER is frozen compliance copy — imported, never retyped. */}
            <p className="font-sans text-data text-fg-muted">
              {CALCULATOR_DISCLAIMER.resultHonest}
            </p>

            <p className="font-sans text-data text-fg-meta">
              {CALCULATOR_DISCLAIMER.resultContext}
              {result.usedDefaults ? (
                <>
                  {" "}
                  {/* Colour steps meta → muted; never italic (see `flush()`). */}
                  <em className="not-italic text-fg-muted">
                    {CALCULATOR_DISCLAIMER.usedDefaults}
                  </em>
                </>
              ) : null}
              {result.usedNoiOverride ? (
                <>
                  {" "}
                  <em className="not-italic text-fg-muted">
                    {CALCULATOR_DISCLAIMER.usedNoiOverride}
                  </em>
                </>
              ) : null}
            </p>
          </div>

          {/* where you sit — promoted out of its old stacked band */}
          <div className="flex flex-col gap-3 bg-surface p-4 lg:p-5">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <MicroLabel as="p" className="font-medium">
                {BAND_WHERE}
              </MicroLabel>
              {/* The only on-screen text saying these are not local comps. */}
              <span className="font-sans text-data text-fg-meta">
                {CALCULATOR_DISCLAIMER.benchmarkBandScope}
              </span>
            </div>

            <BenchmarkBars rows={bars} />
          </div>
        </div>

        {/* ---- row 2: how we got there, as a metric strip ---------------- */}
        <div className="hairline-t p-4 lg:p-5">
          <MicroLabel as="p" className="font-medium">
            {BAND_HOW}
          </MicroLabel>

          <dl className="mt-3 grid gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
            {CHIP_META.map((meta, i) => (
              <div key={meta.key} className="flex flex-col gap-1">
                <dt className="micro-label">{meta.key}</dt>
                <dd className="font-mono text-body font-medium tabular text-fg">{chips[i]}</dd>
                <dd className="font-sans text-data text-fg-meta">{meta.gloss}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---- row 3: the live-rate footnote ----------------------------- */}
        <LiveRateFootnote />
      </div>

      {/* ================= THE READING ==================================== */}
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
        {/* what this means for you */}
        <Band label={BAND_MEANS}>
          <div className="flex flex-col gap-3">
            {result.topAdvice.map((entry, i) => (
              <p key={entry.code ?? `advice-${i}`} className="font-sans text-body text-fg-muted">
                {renderInlineMarkup(entry.html, entry.code ?? `advice-${i}`)}
              </p>
            ))}
            <p className="font-sans text-body font-medium text-fg">{result.ctaLine}</p>
          </div>
        </Band>

        {/* what happens next */}
        <Band label={BAND_NEXT}>
          <p className="font-sans text-body text-fg-muted">{NEXT_INTRO}</p>
          <ul className="mt-3 flex list-none flex-col gap-3">
            {NEXT_ITEMS.map((item) => (
              <li key={item} className="flex gap-3 font-sans text-body text-fg-muted">
                <span aria-hidden="true" className="text-fg-meta">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Band>
      </div>

      {/* ================= THE ACTIONS ==================================== */}
      <div className="hairline-t grid gap-5 pt-5 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col items-start gap-3">
          <Button asChild className="w-full">
            <a href="#bov">{PRIMARY_CTA}</a>
          </Button>

          <TertiaryCta prefill={result.prefill} />

          <button
            type="button"
            onClick={onStartOver}
            className="min-h-11 font-sans text-body text-fg-muted underline decoration-1 underline-offset-4 transition-colors duration-fast ease-out hover:text-accent-text"
          >
            {START_OVER}
          </button>
        </div>

        <EmailCapture onSendEstimate={onSendEstimate} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pieces                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The two prose bands under the dashboard. The `sub` slot the old version
 * carried is gone: its only user was the benchmark scope note, which now sits
 * beside its band label INSIDE the dashboard's bars cell (same adjacency the
 * source had at index.html:1047, different container).
 */
function Band({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="hairline-t pt-5">
      <MicroLabel as="p" className="font-medium">
        {label}
      </MicroLabel>
      <div className="mt-4">{children}</div>
    </div>
  );
}

/**
 * Underlined tertiary link. Written as one literal string and never passed
 * through `cn()`: tailwind-merge treats `text-body` (size) and `text-fg-muted`
 * (colour) as the same group and would silently drop one.
 */
const TERTIARY_LINK =
  "inline-flex min-h-11 items-center self-start font-sans text-body text-fg-muted underline decoration-1 underline-offset-4 transition-colors duration-fast ease-out hover:text-accent-text";

/** The tertiary CTA. An anchor while CALENDLY_URL is blocked — never a dead button. */
function TertiaryCta({ prefill }: { prefill: ValuationPrefill }) {
  // Captured locally: narrowing an imported binding does not survive into the
  // nested closure below, because TS treats module imports as mutable.
  const calendlyUrl = CALENDLY_URL;
  if (!calendlyUrl) {
    return (
      <a href={CALENDLY_FALLBACK} className={TERTIARY_LINK}>
        {CALENDLY_CTA}
      </a>
    );
  }

  const open = async () => {
    try {
      await loadCalendly();
    } catch {
      window.location.hash = CALENDLY_FALLBACK;
      return;
    }
    const calendly = (window as unknown as { Calendly?: CalendlyGlobal }).Calendly;
    if (!calendly) {
      window.location.hash = CALENDLY_FALLBACK;
      return;
    }
    calendly.initPopupWidget({
      url: calendlyUrl,
      prefill: { customAnswers: { a1: calendlyAnswer(prefill) } },
    });
  };

  return (
    <button type="button" onClick={open} className={TERTIARY_LINK}>
      {CALENDLY_CTA}
    </button>
  );
}

type EmailState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

function EmailCapture({
  onSendEstimate,
}: {
  onSendEstimate: (email: string) => Promise<Web3FormsResult>;
}) {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<EmailState>({ kind: "idle" });
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputId = "calc-email";
  const statusId = "calc-email-status";

  const sent = state.kind === "ok";
  const sending = state.kind === "sending";
  const errorMessage = state.kind === "error" ? state.message : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sent || sending) return;

    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      // index.html:1968 — reject, focus the field, leave the button enabled.
      setState({ kind: "error", message: EMAIL_STATUS.invalid });
      inputRef.current?.focus();
      return;
    }

    setState({ kind: "sending" });
    const outcome = await onSendEstimate(value);
    if (outcome.ok) {
      setState({ kind: "ok" });
      return;
    }
    setState({ kind: "error", message: EMAIL_STATUS[outcome.reason] });
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Label htmlFor={inputId}>{EMAIL_LABEL}</Label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          ref={inputRef}
          id={inputId}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          placeholder="you@company.com"
          autoComplete="email"
          inputMode="email"
          disabled={sent}
          aria-describedby={statusId}
          aria-invalid={errorMessage ? true : undefined}
          className="sm:flex-1"
        />
        {/* Deliberately NOT <Button loading> — that renders its own polite live
            region, which would announce alongside the ported "Sending…" status
            below. One announcement, not two. */}
        <Button type="submit" variant="ghost" disabled={sent || sending} className="sm:w-auto">
          {sent ? EMAIL_SENT : EMAIL_SEND}
        </Button>
      </div>

      {/* Height reserved so the row never moves the CTAs beneath it. Written as
          a template literal, not cn(): tailwind-merge would drop `text-data`. */}
      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className={`flex min-h-6 items-start gap-1.5 font-sans text-data ${
          errorMessage ? "text-brick" : "text-fg-muted"
        }`}
      >
        {errorMessage ? (
          <>
            <AlertCircle aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
            <span>{errorMessage}</span>
          </>
        ) : null}
        {sending ? <span>{EMAIL_STATUS.sending}</span> : null}
        {sent ? (
          <>
            <Check aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-4 shrink-0" />
            <span>{EMAIL_STATUS.ok}</span>
          </>
        ) : null}
      </p>

      {/*
        DESIGN-REVISIT §5.5 — the capture takes a contact detail and, until now,
        linked to no policy. Composed from PRIVACY_NOTICE_LINK, never authored
        here. `target="_blank" rel="noopener"` so a half-typed form survives the
        click; `py-3` expands the anchor's hit box to ~44px WITHOUT changing the
        line box, the same trick ui/button.tsx uses for its small sizes.
      */}
      <p className="font-sans text-data text-fg-meta">
        {PRIVACY_NOTICE_LINK.lead}
        <a
          href={PRIVACY_NOTICE_LINK.href}
          target="_blank"
          rel="noopener"
          className="py-3 text-accent-text underline underline-offset-4"
        >
          {PRIVACY_NOTICE_LINK.label}
        </a>
        {PRIVACY_NOTICE_LINK.tail}
      </p>
    </form>
  );
}
