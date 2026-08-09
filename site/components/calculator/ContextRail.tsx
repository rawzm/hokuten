/**
 * components/calculator/ContextRail.tsx — the calculator's live market-data
 * rail.
 *
 * Spec: docs/DESIGN-REVISIT.md §4.6 — "make it an experience with real data,
 * not decoration: the frozen config *is* market data — surface it. A live
 * context rail showing the typical OCC/ADR/RevPAR band for the selected type."
 *
 * ── EVERY NUMBER HERE IS FROZEN, NOTHING IS INVENTED ────────────────────────
 * The rail reads four things out of lib/valuation.ts and formats them:
 *   OCC_BAND[type]      [low, mid, high]  occupancy percent
 *   ADR_BAND[type]      [low, mid, high]  dollars
 *   REVPAR_BAND[type]   [low, mid, high]  dollars
 *   CONFIG.capRates[type][tier]  [low, high]  the BASE band, pre-adjuster
 * The cap range is printed with the frozen `formatCapRange()` so the string is
 * byte-identical to the one step 3 prints (" – ", en dash, one decimal, and the
 * load-bearing `toFixed` float behaviour). The band table's own `low–high`
 * strings are numeric formatting of frozen integers, not copy.
 *
 * The scope sentence is the existing byte-exact compliance string
 * (`CALCULATOR_DISCLAIMER.benchmarkBandScope`, index.html:1047) — imported,
 * never retyped, and the same sentence step 3 shows over its benchmark bars.
 * It is what stops the rail reading as a local comp set.
 *
 * ── WHY THE BASE CAP BAND IS LABELLED "BASE" ────────────────────────────────
 * `CONFIG.capRates[type][tier]` is the band BEFORE the condition / land /
 * brand / F&B adjusters, so it is not the number step 3 prints. The row is
 * therefore labelled "Base cap band" and sits under the tier it belongs to.
 * It is displayed, never computed with — the engine is untouched.
 *
 * ── A11Y ────────────────────────────────────────────────────────────────────
 * A real `<table>` with a visually-hidden `<caption>` and `scope`d headers: the
 * data is genuinely tabular and a CRE reader gets row/column context for free.
 * The rail is NOT a live region — re-announcing nine figures on every tile
 * click is noise, and nothing here is hover-only or otherwise unavailable.
 *
 * Server-renderable: no hooks, no state, no client APIs. It ships inside the
 * Calculator island only because its parent is a client component.
 */

import { MicroLabel } from "@/components/atoms/MicroLabel";
import { CALCULATOR_DISCLAIMER } from "@/content/compliance";
import {
  ADR_BAND,
  CONFIG,
  OCC_BAND,
  REVPAR_BAND,
  formatCapRange,
  type Benchmark,
  type PropertyType,
  type Tier,
} from "@/lib/valuation";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Formatting — presentation of frozen integers, no arithmetic               */
/* -------------------------------------------------------------------------- */

function pct(value: number): string {
  return `${value}%`;
}

function usd(value: number): string {
  return `$${value}`;
}

type BandRow = {
  key: string;
  label: string;
  band: Benchmark;
  format: (value: number) => string;
};

const COLUMN_HEADS = ["Low", "Typical", "High"] as const;

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export type ContextRailProps = {
  /** CONFIG key for the currently selected property type. */
  propertyType: PropertyType;
  /** The raw display label the visitor actually picked. */
  propertyTypeLabel: string;
  /** CONFIG key for the currently selected market tier. */
  tier: Tier;
  /** The raw display label the visitor actually picked. */
  tierLabel: string;
  className?: string;
};

export function ContextRail({
  propertyType,
  propertyTypeLabel,
  tier,
  tierLabel,
  className,
}: ContextRailProps) {
  const rows: BandRow[] = [
    { key: "occ", label: "Occupancy", band: OCC_BAND[propertyType], format: pct },
    { key: "adr", label: "ADR", band: ADR_BAND[propertyType], format: usd },
    { key: "revpar", label: "RevPAR", band: REVPAR_BAND[propertyType], format: usd },
  ];

  const capBand = CONFIG.capRates[propertyType][tier];

  return (
    <aside
      aria-label="Market reference for the selected property type"
      className={cn("surface-card hairline rounded-card flex flex-col gap-4 p-4", className)}
    >
      <div className="flex flex-col gap-1.5">
        <MicroLabel as="p" className="font-medium">
          Market reference
        </MicroLabel>
        <p className="font-mono text-data font-medium text-fg">{propertyTypeLabel}</p>
      </div>

      <table className="w-full border-collapse">
        <caption className="visually-hidden">
          {`Typical operating bands for ${propertyTypeLabel}: occupancy, ADR and RevPAR, low to high.`}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="visually-hidden">
              Metric
            </th>
            {COLUMN_HEADS.map((head) => (
              <th
                key={head}
                scope="col"
                className="micro-label pb-1.5 text-end font-medium"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="hairline-t">
              <th
                scope="row"
                className="py-2 pe-2 text-start font-sans text-data font-normal text-fg-muted"
              >
                {row.label}
              </th>
              {row.band.map((value, i) => (
                <td
                  key={COLUMN_HEADS[i]}
                  className={
                    i === 1
                      ? "py-2 ps-2 text-end font-mono text-data font-medium tabular text-fg"
                      : "py-2 ps-2 text-end font-mono text-data tabular text-fg-muted"
                  }
                >
                  {row.format(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="hairline-t flex flex-col gap-1 pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <MicroLabel as="p" className="font-medium">
            Base cap band
          </MicroLabel>
          <p className="font-mono text-data font-medium tabular text-accent-text">
            {formatCapRange(capBand[0], capBand[1])}
          </p>
        </div>
        <p className="font-sans text-data text-fg-meta">{tierLabel}</p>
      </div>

      {/* Byte-exact compliance string — the same one step 3 prints. */}
      <p className="hairline-t pt-3 font-sans text-data text-fg-meta">
        {CALCULATOR_DISCLAIMER.benchmarkBandScope}
      </p>
    </aside>
  );
}
