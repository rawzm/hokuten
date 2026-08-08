"use client";

/**
 * components/calculator/CalculatorResult.tsx — step 03: the estimate.
 *
 * Anatomy ported from docs/port/01-calculator.md §B.4 (index.html:1025-1081):
 * value range → "How we got there" chips → "Where you sit" bars → "What this
 * means for you" → "What happens next" → CTAs. Every number and every formatted
 * string arrives ready-made on `ValuationResult`; nothing is computed here.
 *
 * TYPOGRAPHY (the P1 gate that governs this panel). The value range is the
 * section's stat moment, so it is set in FRAUNCES — Display 2, Light 300,
 * tabular figures. Setting a stat numeral in mono is a P1 breach (ref 03:
 * "Stat numerals: Display 1/2 in Fraunces with mono caption beneath — never mono
 * for the big numeral"). The supporting figures — RevPAR, NOI/key, value/key,
 * cap rate, the bar values — ARE deal data and therefore mono + tabular.
 *
 * RICH TEXT. Three ADVICE bodies carry <strong>/<em>. They are developer-authored
 * constants in lib/valuation.ts, but they still do not go through
 * dangerouslySetInnerHTML — `renderInlineMarkup` turns those two tags into React
 * nodes and drops anything else, so the render path cannot become an injection
 * sink if a future body is ever templated.
 *
 * INSIGHT COUNT. The engine slices to two (index.html:1590) and substitutes a
 * single fallback paragraph when nothing fires, so this band renders ONE OR TWO
 * advice paragraphs — never three, never zero — plus exactly one CTA line.
 *
 * CALENDLY. `CALENDLY_URL` is `blocked: calendly-url` and currently null, so the
 * tertiary CTA renders as a real anchor to #bov and NOTHING is requested from
 * assets.calendly.com. When a URL lands, the widget is injected on the first
 * click and never before. The source appended `hide_gdpr_banner=1`
 * (index.html:1921); that is deliberately NOT carried over — suppressing a third
 * party's consent prompt is a decision nobody has made.
 */

import * as React from "react";
import { AlertCircle, Check } from "lucide-react";

import { MicroLabel } from "@/components/atoms/MicroLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CALCULATOR_DISCLAIMER } from "@/content/compliance";
import { CALENDLY_FALLBACK, CALENDLY_URL, CONTACT } from "@/content/site";
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
    <div className="flex flex-col gap-6">
      {/* ---- the number ------------------------------------------------- */}
      <div className="flex flex-col gap-3">
        <h3 id={headingId} className="font-sans text-body font-normal text-fg-muted">
          {heading}
        </h3>

        <p className="font-display text-display2 font-light tabular text-accent-text">
          {result.display.range}
        </p>

        {/* CALCULATOR_DISCLAIMER is frozen compliance copy — imported, never retyped. */}
        <p className="font-sans text-data text-fg-muted">{CALCULATOR_DISCLAIMER.resultHonest}</p>

        <p className="font-sans text-data text-fg-meta">
          {CALCULATOR_DISCLAIMER.resultContext}
          {result.usedDefaults ? (
            <>
              {" "}
              {/* Colour steps meta → muted; never italic (see `flush()`). */}
              <em className="not-italic text-fg-muted">{CALCULATOR_DISCLAIMER.usedDefaults}</em>
            </>
          ) : null}
          {result.usedNoiOverride ? (
            <>
              {" "}
              <em className="not-italic text-fg-muted">{CALCULATOR_DISCLAIMER.usedNoiOverride}</em>
            </>
          ) : null}
        </p>
      </div>

      {/* ---- how we got there ------------------------------------------- */}
      <Band label={BAND_HOW}>
        <dl className="grid gap-5 sm:grid-cols-2">
          {CHIP_META.map((meta, i) => (
            <div key={meta.key} className="flex flex-col">
              <dt className="micro-label">{meta.key}</dt>
              <dd className="mt-2 font-mono text-body font-medium tabular text-fg">{chips[i]}</dd>
              <dd className="mt-1 font-sans text-data text-fg-meta">{meta.gloss}</dd>
            </div>
          ))}
        </dl>
      </Band>

      {/* ---- where you sit ---------------------------------------------- */}
      <Band label={BAND_WHERE} sub={CALCULATOR_DISCLAIMER.benchmarkBandScope}>
        <BenchmarkBars rows={bars} />
      </Band>

      {/* ---- what this means for you ------------------------------------ */}
      <Band label={BAND_MEANS}>
        <div className="flex flex-col gap-3">
          {result.topAdvice.map((entry, i) => (
            <p
              key={entry.code ?? `advice-${i}`}
              className="font-sans text-body text-fg-muted"
            >
              {renderInlineMarkup(entry.html, entry.code ?? `advice-${i}`)}
            </p>
          ))}
          <p className="font-sans text-body font-medium text-fg">{result.ctaLine}</p>
        </div>
      </Band>

      {/* ---- what happens next ------------------------------------------ */}
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

      {/* ---- CTAs -------------------------------------------------------- */}
      <div className="flex flex-col gap-4 hairline-t pt-6">
        <Button asChild className="w-full">
          <a href="#bov">{PRIMARY_CTA}</a>
        </Button>

        <EmailCapture onSendEstimate={onSendEstimate} />

        <TertiaryCta prefill={result.prefill} />

        <button
          type="button"
          onClick={onStartOver}
          className="min-h-11 self-start font-sans text-body text-fg-muted underline decoration-1 underline-offset-4 transition-colors duration-fast ease-out hover:text-accent-text"
        >
          {START_OVER}
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pieces                                                                     */
/* -------------------------------------------------------------------------- */

function Band({
  label,
  sub,
  children,
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="hairline-t pt-5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <MicroLabel as="p">{label}</MicroLabel>
        {sub ? <span className="font-sans text-data text-fg-meta">{sub}</span> : null}
      </div>
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
            <AlertCircle
              aria-hidden="true"
              strokeWidth={1.5}
              className="mt-0.5 size-4 shrink-0"
            />
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
    </form>
  );
}
