/**
 * components/sections/StatsSection.tsx — `#stats`, the trust-metrics band.
 *
 * Governed by design-skill references 03 (Type ramp → stat numerals: Fraunces,
 * never mono), 04 (`#stats`), 05 (Reveals → count-up rules) and 07 (P0: "stat
 * counters that show 0/placeholder without JS" — the Sarhan anti-pattern).
 * Full spec: docs/design/specs/stats.md. Server Component — the only client
 * code that ships is inside the existing `Reveal` and `CountUp`, both reused
 * as-is.
 *
 * ── Why this file does not import `StatNumeral` ─────────────────────────────
 * `StatNumeral`'s `value` prop is typed `string`; it prints `{value}` as plain
 * text and has no slot that can host a component, so `<CountUp>` cannot be
 * passed into it. Its `countUp` flag only marks the numeral with
 * `data-countup`/`data-countup-value` for an external enhancer — no such
 * enhancer exists in the repo (grep confirms the only matches are that doc
 * comment and `CountUp.tsx`'s own unrelated marker), so flipping it on today
 * would ship inert attributes with no animation. `CountUp` is the complete,
 * already-correct instrument the brief calls for ("via the existing CountUp,
 * from 60% of value, once, on useInView, nothing under reduced motion") — it
 * server-renders the final string verbatim (the P0 gate holds on its own) and
 * enhances from there. Its parse/render internals aren't exported, so there is
 * no way to reuse its algorithm short of rendering the component itself.
 *
 * The fix here composes the *same tokens* `StatNumeral` composes — its exact
 * numeral className recipe, plus the `micro-label` / `data-line text-fg-muted`
 * utilities it uses for caption/detail — swapping only the numeral's leaf node
 * for `<CountUp>`. Nothing is duplicated from `StatNumeral` beyond that one
 * unavoidable seam. Flagged for whoever owns `components/atoms/`: an optional
 * `valueSlot?: ReactNode` on `StatNumeral` (rendered instead of `{value}` when
 * present) would remove this seam entirely.
 */

import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { DataLine } from "@/components/atoms/DataLine";
import { SectionHeader } from "@/components/atoms/SectionHeader";
import { stats } from "@/content/stats";

/**
 * Renders a stat's `detail` line. `site/content/stats.ts` pre-joins multi-part
 * details with `" · "` (e.g. the CoStar quarters) — `DataLine`'s `parts`
 * variant re-splits on that separator and holds each group `whitespace-nowrap`
 * so a narrow cell never breaks mid-quarter, while the `"12"` stat's detail (a
 * single sentence, no `" · "` in it) falls through to `joined`, which wraps
 * normally instead of forcing one unbroken nowrap run.
 */
function StatDetail({ detail }: { detail: string }) {
  const parts = detail.split(" · ");
  return (
    <DataLine
      as="span"
      parts={parts}
      variant={parts.length > 1 ? "parts" : "joined"}
      className="mt-2 block text-fg-muted"
    />
  );
}

export function StatsSection() {
  return (
    <section id="stats" aria-labelledby="stats-heading" className="surface-paper section-pad">
      <div className="container-hk">
        <Reveal>
          <SectionHeader
            id="stats-heading"
            label="Trust metrics"
            headline="Before the story, the *math*."
          />
        </Reveal>

        <Reveal
          as="ul"
          stagger
          role="list"
          className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-16 lg:grid-cols-4 lg:gap-x-10"
        >
          {stats.map((stat) => (
            <Reveal.Item as="li" key={stat.label} className="hairline-t pt-6">
              <span className="block font-display font-light text-display2">
                <CountUp value={stat.value} />
              </span>
              <span className="micro-label mt-3 block">{stat.label}</span>
              {stat.detail ? <StatDetail detail={stat.detail} /> : null}
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
