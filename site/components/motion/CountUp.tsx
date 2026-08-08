/**
 * CountUp — stat numeral count-up. Progressive enhancement ONLY.
 * Governed by .agents/skills/hokuten-design-director/references/05-motion.md
 * ("Stat numerals may count up… but must render final values server-side
 * first") and 07-audit.md ("stat counters that show 0/placeholder without JS"
 * is a listed P0 tell — the Sarhan "$0 B+" failure).
 *
 * The final string is what renders on the server and what stays in the DOM if
 * anything at all goes wrong: no JS, reduced motion, data-saver, kill switch,
 * an unparseable value. Nothing here ever produces a placeholder.
 *
 * Feed it the exact display string from content (`$200M+`, `836K+`, `12`, `3×`)
 * — never a raw number. The prefix and suffix are held constant for the whole
 * animation, so `$` and `M+` cannot flicker.
 *
 * Values are counted from 60% of the target (ref 05: never from 0), floored so
 * the integer digit count never shrinks — `12` counts 10→12, not 7→12. That
 * plus tabular-nums keeps the glyph box a fixed width for the whole run.
 */

"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { EASE, IN_VIEW, motionAllowed } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Ref 05: "mono-stable, 800ms". Not in the DUR ramp — this is the one value. */
const COUNT_DURATION_S = 0.8;
/** Ref 05: "from 60% of value — never from 0". */
const START_FRACTION = 0.6;

type Parsed = {
  prefix: string;
  suffix: string;
  target: number;
  start: number;
  decimals: number;
  grouped: boolean;
};

/** `$200M+` → prefix `$`, digits `200`, suffix `M+` */
const NUMERAL = /^([^\d]*)(\d[\d,]*(?:\.\d+)?)([\s\S]*)$/;

function parse(raw: string): Parsed | null {
  const match = NUMERAL.exec(raw);
  if (!match) return null;

  const [, prefix, digits, suffix] = match;
  const grouped = digits.includes(",");
  const plain = digits.replace(/,/g, "");
  const target = Number(plain);
  if (!Number.isFinite(target) || target <= 0) return null;

  const dot = plain.indexOf(".");
  const decimals = dot === -1 ? 0 : plain.length - dot - 1;

  // Floor at the smallest number with the same integer digit count, so the
  // rendered width never changes mid-count.
  const digitFloor = 10 ** (String(Math.trunc(target)).length - 1);
  const start = Math.max(target * START_FRACTION, digitFloor);

  return { prefix, suffix, target, start, decimals, grouped };
}

function render(parsed: Parsed, n: number): string {
  const body = parsed.grouped
    ? n.toLocaleString("en-US", {
        minimumFractionDigits: parsed.decimals,
        maximumFractionDigits: parsed.decimals,
      })
    : n.toFixed(parsed.decimals);
  return parsed.prefix + body + parsed.suffix;
}

export type CountUpProps = {
  /** The exact final display string. Rendered server-side, verbatim. */
  value: string;
  className?: string;
};

export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();
  const inView = useInView(ref, IN_VIEW);
  const played = useRef(false);

  useEffect(() => {
    if (!inView || played.current) return;
    if (!motionAllowed(prefersReduced)) return;

    const el = ref.current;
    if (!el) return;

    const parsed = parse(value);
    if (!parsed) return; // unparseable — leave the server value alone

    played.current = true;

    const controls = animate(parsed.start, parsed.target, {
      duration: COUNT_DURATION_S,
      ease: EASE.out,
      onUpdate: (n) => {
        el.textContent = render(parsed, n);
      },
      // Land on the authored string, not on a re-formatted approximation.
      onComplete: () => {
        el.textContent = value;
      },
    });

    return () => {
      controls.stop();
      el.textContent = value;
    };
  }, [inView, prefersReduced, value]);

  return (
    <span ref={ref} data-countup className={cn("tabular", className)}>
      {value}
    </span>
  );
}
