/**
 * GOLDEN PARITY SUITE for the frozen valuation engine.
 *
 * Every expectation in this file is derived from THE SOURCE OF RECORD:
 *   ~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html
 * — the calculator IIFE at :1355-1687 — read line by line and hand-traced.
 * Nothing here was produced by running `lib/valuation.ts`; the point of the
 * suite is to prove the port matches kwc, not that it agrees with itself.
 *
 * The 25 hand-traced cases in `docs/port/01-calculator.md` §C.7 (G1-G24) are
 * used as the backbone. Before trusting the table wholesale it was independently
 * re-derived from the source: the IIFE's `calculate()` (:1502-1612) plus CONFIG
 * (:1356-1375), the four key maps (:1385-1394), the rounding formatters
 * (:1473-1477), `pctBar` (:1478) and the ADVICE array (:1481-1500) were
 * transcribed verbatim into a throwaway reference and all 25 cases replayed
 * through it. Every range, per-key string, cap string, bar percent and fired
 * list reproduced. Cases spot-checked by longhand arithmetic against the source
 * lines as well: G1, G3 (the 7.2% float trap), G15/G16 (the F&B `>` boundary,
 * :1543), G17 (max adjuster stack + top-2 slice, :1584), G19 (advice priority
 * order), G23/G24 (the clamps at :1547-1548).
 *
 * Source-line citations are on every expectation. `:NNNN` means index.html line
 * NNNN. Where the source ships a defect it is LOCKED here, not fixed — see the
 * "degenerate inputs" block.
 *
 * All en dashes below are U+2013, verified against the source bytes:
 *   :1558 / :1561 / :1562 / :1601 use `" – "` (spaces),
 *   :1605 uses `"–"` (no spaces),
 *   :1602 uses `" · "` (U+00B7).
 */

import { describe, expect, it } from "vitest";

import {
  ADR_BAND,
  ADVICE,
  applyCapClamps,
  BRANDS,
  brandKeyCfg,
  calculate,
  CAP_FLOOR,
  capAdjustment,
  capPct,
  clampOccupancyPct,
  computeAdjustedCapLow,
  condKeyCfg,
  CONDITIONS,
  CONFIG,
  CTA_LINES,
  dollarsFull,
  extractZip,
  FALLBACK_ADVICE,
  formatCapRange,
  formatNumericField,
  groundLeaseFromLabel,
  groupInt,
  keysAreValid,
  LANDS,
  MIN_CAP_SPREAD,
  OCC_BAND,
  parseNumericField,
  pctBar,
  PROPERTY_TYPES,
  REVPAR_BAND,
  RESULT_CONTEXT_BASE,
  RESULT_CONTEXT_DEFAULTS_NOTE,
  RESULT_CONTEXT_NOI_NOTE,
  resultContextHtml,
  roundKey,
  roundTo,
  roundTotal,
  tierKey,
  TIERS,
  typeKey,
  typicalFor,
  type CalculatorConfig,
  type PropertyType,
  type Tier,
  type ValuationInput,
} from "@/lib/valuation";

/* ---------------------------------------------------------------------------
   Fixtures — the shipped seeded defaults (index.html:946 keys=88, :1012 occ=74,
   :1013 adr=198, :941 Full-Service selected, :954 Standard / suburban selected,
   :961 Branded selected, :977 4-8 yrs selected, :985 Fee Simple selected).
   --------------------------------------------------------------------------- */

const SEEDED: ValuationInput = {
  propertyType: "fullService",
  keys: 88,
  occupancyPct: 74,
  adr: 198,
  tier: "suburban",
  brand: "branded",
  condition: "base4to8",
  groundLease: false,
};

const inp = (over: Partial<ValuationInput> = {}): ValuationInput => ({ ...SEEDED, ...over });

/** The source renders bars with `pct.toFixed(0)` (:1616). */
const bar = (pct: number) => pct.toFixed(0);

/* ===========================================================================
   1. FROZEN CONFIG PARITY — index.html:1356-1382
   =========================================================================== */

describe("CONFIG is byte-identical to the source", () => {
  it("ships the 20 cap-rate cells from :1359-1363", () => {
    expect(CONFIG.capRates).toEqual({
      limitedService: { gateway: [0.07, 0.0825], secondary: [0.0775, 0.09], suburban: [0.0825, 0.0975], tertiary: [0.0925, 0.11] },
      selectService: { gateway: [0.0675, 0.08], secondary: [0.075, 0.0875], suburban: [0.08, 0.095], tertiary: [0.09, 0.105] },
      fullService: { gateway: [0.0625, 0.075], secondary: [0.0725, 0.085], suburban: [0.08, 0.0925], tertiary: [0.09, 0.105] },
      resortBoutique: { gateway: [0.06, 0.075], secondary: [0.07, 0.085], suburban: [0.08, 0.095], tertiary: [0.0875, 0.105] },
      extendedStay: { gateway: [0.0675, 0.08], secondary: [0.075, 0.0875], suburban: [0.08, 0.0925], tertiary: [0.0875, 0.1025] },
    });
  });

  it("ships the revenue-model constants from :1366-1374", () => {
    // :1366 noiMargin
    expect(CONFIG.noiMargin).toEqual({ limitedService: 0.38, selectService: 0.34, fullService: 0.28, resortBoutique: 0.3, extendedStay: 0.4 });
    // :1368 roomsToTotal
    expect(CONFIG.roomsToTotal).toEqual({ limitedService: 0.95, selectService: 0.88, fullService: 0.65, resortBoutique: 0.62, extendedStay: 0.96 });
    // :1370-1374 adjusters
    expect(CONFIG.renovationAdj).toEqual({ under4: -0.005, base4to8: 0, over8: 0.0075 });
    expect(CONFIG.landAdj).toEqual({ feeSimple: 0, groundLease: 0.01 });
    expect(CONFIG.brandAdj).toEqual({ branded: -0.0025, independent: 0.0025 });
    expect(CONFIG.fbThreshold).toBe(0.25);
    expect(CONFIG.fbHighAdj).toBe(0.0025);
  });

  it("ships the benchmark bands from :1400-1402", () => {
    expect(OCC_BAND).toEqual({ limitedService: [58, 68, 78], selectService: [62, 72, 80], fullService: [60, 70, 78], resortBoutique: [55, 65, 75], extendedStay: [70, 78, 85] });
    expect(ADR_BAND).toEqual({ limitedService: [95, 135, 190], selectService: [130, 175, 240], fullService: [175, 240, 360], resortBoutique: [220, 340, 650], extendedStay: [110, 150, 210] });
    expect(REVPAR_BAND).toEqual({ limitedService: [55, 90, 140], selectService: [80, 125, 185], fullService: [105, 165, 275], resortBoutique: [120, 210, 460], extendedStay: [80, 120, 175] });
  });

  it("hard-codes the guardrail constants inlined at :1547-1548", () => {
    expect(CAP_FLOOR).toBe(0.045);
    expect(MIN_CAP_SPREAD).toBe(0.005);
  });
});

/* ===========================================================================
   2. EVERY PROPERTY TYPE x EVERY TIER — base band and resulting range
   Source: band lookup :1535-1536, adj :1539-1544, value :1551-1554,
   render :1558/:1561/:1562.
   Probe holds everything but type/tier fixed: NOI override $1,000,000 (:1526),
   100 keys, condition base4to8 (adj 0), fee simple (adj 0), branded (adj
   -0.0025). So capLow = band[0] - 0.0025, capHigh = band[1] - 0.0025,
   valueHigh = 1e6/capLow, valueLow = 1e6/capHigh.
   =========================================================================== */

const CAP_MATRIX: ReadonlyArray<readonly [PropertyType, Tier, readonly [number, number], string, string, string]> = [
  ["limitedService", "gateway", [0.07, 0.0825], "6.8% – 8.0%", "$12.5M – $14.8M", "$125K – $150K"],
  ["limitedService", "secondary", [0.0775, 0.09], "7.5% – 8.8%", "$11.5M – $13.4M", "$115K – $135K"],
  ["limitedService", "suburban", [0.0825, 0.0975], "8.0% – 9.5%", "$10.6M – $12.5M", "$105K – $125K"],
  ["limitedService", "tertiary", [0.0925, 0.11], "9.0% – 10.8%", "$9.3M – $11.1M", "$95K – $110K"],
  ["selectService", "gateway", [0.0675, 0.08], "6.5% – 7.8%", "$12.9M – $15.4M", "$130K – $155K"],
  ["selectService", "secondary", [0.075, 0.0875], "7.2% – 8.5%", "$11.8M – $13.8M", "$120K – $140K"],
  ["selectService", "suburban", [0.08, 0.095], "7.8% – 9.3%", "$10.8M – $12.9M", "$110K – $130K"],
  ["selectService", "tertiary", [0.09, 0.105], "8.8% – 10.3%", "$9.8M – $11.5M", "$100K – $115K"],
  ["fullService", "gateway", [0.0625, 0.075], "6.0% – 7.2%", "$13.8M – $16.7M", "$140K – $165K"],
  ["fullService", "secondary", [0.0725, 0.085], "7.0% – 8.3%", "$12.1M – $14.3M", "$120K – $145K"],
  ["fullService", "suburban", [0.08, 0.0925], "7.8% – 9.0%", "$11.1M – $12.9M", "$110K – $130K"],
  ["fullService", "tertiary", [0.09, 0.105], "8.8% – 10.3%", "$9.8M – $11.5M", "$100K – $115K"],
  ["resortBoutique", "gateway", [0.06, 0.075], "5.8% – 7.2%", "$13.8M – $17.4M", "$140K – $175K"],
  ["resortBoutique", "secondary", [0.07, 0.085], "6.8% – 8.3%", "$12.1M – $14.8M", "$120K – $150K"],
  ["resortBoutique", "suburban", [0.08, 0.095], "7.8% – 9.3%", "$10.8M – $12.9M", "$110K – $130K"],
  ["resortBoutique", "tertiary", [0.0875, 0.105], "8.5% – 10.3%", "$9.8M – $11.8M", "$100K – $120K"],
  ["extendedStay", "gateway", [0.0675, 0.08], "6.5% – 7.8%", "$12.9M – $15.4M", "$130K – $155K"],
  ["extendedStay", "secondary", [0.075, 0.0875], "7.2% – 8.5%", "$11.8M – $13.8M", "$120K – $140K"],
  ["extendedStay", "suburban", [0.08, 0.0925], "7.8% – 9.0%", "$11.1M – $12.9M", "$110K – $130K"],
  ["extendedStay", "tertiary", [0.0875, 0.1025], "8.5% – 10.0%", "$10.0M – $11.8M", "$100K – $120K"],
];

describe("base cap band and resulting range for every property type x tier", () => {
  it.each(CAP_MATRIX)("%s / %s", (propertyType, tier, band, capRange, range, perKey) => {
    const r = calculate(inp({ propertyType, tier, keys: 100, noiOverride: 1_000_000 }));
    expect(r.baseCapBand).toEqual(band); // :1535
    expect(r.capAdj).toBeCloseTo(-0.0025, 12); // :1542 brandAdj.branded, everything else 0
    expect(r.display.capRange).toBe(capRange); // :1562
    expect(r.display.range).toBe(range); // :1558
    expect(r.display.perKey).toBe(perKey); // :1561
  });

  it("covers all 5 types and all 4 tiers", () => {
    expect(new Set(CAP_MATRIX.map((row) => row[0])).size).toBe(PROPERTY_TYPES.length);
    expect(new Set(CAP_MATRIX.map((row) => row[1])).size).toBe(TIERS.length);
    expect(CAP_MATRIX).toHaveLength(20);
  });
});

/* ===========================================================================
   3. THE DERIVED-NOI REVENUE MODEL, per property type — :1528-1531
   G1-G6 from §C.7, each re-traced against the source.
   =========================================================================== */

describe("derived NOI path (G1-G6)", () => {
  it("G1 Full-Service / suburban / seeded defaults", () => {
    const r = calculate(inp());
    // :1521  revpar = 198 * 0.74 = 146.52
    expect(r.revpar).toBeCloseTo(146.52, 9);
    // :1528  88 * 198 = 17,424 ; * 365 = 6,359,760 ; * 0.74 = 4,706,222.4
    expect(r.roomRevenue).toBeCloseTo(4_706_222.4, 6);
    // :1529  / roomsToTotal.fullService 0.65
    expect(r.totalRevenue).toBeCloseTo(7_240_342.153846154, 6);
    // :1530  * noiMargin.fullService 0.28
    expect(r.noi).toBeCloseTo(2_027_295.803076923, 6);
    // :1532  / 88
    expect(r.noiPerKey).toBeCloseTo(23_037.45230769231, 8);
    // :1552  round(22,525,508.92/50,000)=451 -> 22,550,000 ; round(26,158,655.52/50,000)=523
    expect(r.totalLow).toBe(22_550_000);
    expect(r.totalHigh).toBe(26_150_000);
    // :1553-1554  round(255,971.69/1,000)=256 ; round(297,257.45/1,000)=297
    expect(r.perKeyLow).toBe(256_000);
    expect(r.perKeyHigh).toBe(297_000);
    expect(r.display).toEqual({
      range: "$22.6M – $26.2M", // :1558
      revpar: "$147", // :1559  Math.round(146.52)
      noiPerKey: "$23,037", // :1560  no asterisk on the derived path
      perKey: "$255K – $295K", // :1561  256,000/5,000=51.2->51*5 ; 297,000/5,000=59.4->59*5
      capRange: "7.8% – 9.0%", // :1562
    });
    // :1601 / :1602 / :1605  the lead prefill (was window.__kwcEstimate)
    expect(r.prefill.range).toBe("$22,550,000 – $26,150,000");
    expect(r.prefill.summary).toBe("Full-Service · 88 keys");
    expect(r.prefill.noiPerKey).toBe("$23,037/key");
    expect(r.prefill.capRangeUsed).toBe("7.8%–9.0%"); // en dash, NO spaces at :1605
    // :1575-1576  (74-60)/(78-60)=0.7778 ; (146.52-105)/(275-105)=0.2442
    expect(bar(r.occBandPct)).toBe("78");
    expect(bar(r.revparBandPct)).toBe("24");
    expect(r.firedCodes).toEqual([]);
  });

  it("G2 Limited-Service / gateway — noiMargin 0.38, roomsToTotal 0.95", () => {
    const r = calculate(inp({ propertyType: "limitedService", tier: "gateway" }));
    expect(r.totalRevenue).toBeCloseTo(4_953_918.315789474, 6); // :1529  4,706,222.4/0.95
    expect(r.noi).toBeCloseTo(1_882_488.96, 6); // :1530  * 0.38
    expect(r.display.range).toBe("$23.6M – $27.9M");
    expect(r.display.noiPerKey).toBe("$21,392");
    expect(r.display.perKey).toBe("$265K – $315K");
    expect(r.display.capRange).toBe("6.8% – 8.0%"); // 6.75 -> toFixed(1) -> "6.8"
    expect(bar(r.occBandPct)).toBe("80");
    expect(bar(r.revparBandPct)).toBe("100"); // 146.52 >= rb[2] 140 -> pctBar clamps (:1478)
  });

  it("G3 Select-Service / secondary — the canonical 7.2% float trap", () => {
    const r = calculate(inp({ propertyType: "selectService", tier: "secondary", keys: 120, occupancyPct: 70, adr: 165 }));
    expect(r.noi).toBeCloseTo(1_954_575, 6); // :1528-1530  5,058,900/0.88*0.34
    expect(r.display.range).toBe("$23.0M – $27.0M");
    expect(r.display.perKey).toBe("$190K – $225K"); // 192,000/5,000=38.4 -> 38*5
    // :1562  0.075-0.0025 === 0.0725 exactly, but 0.0725*100 === 7.249999999999999
    // so toFixed(1) is "7.2". Printing "7.3" would be a REGRESSION, not a fix.
    expect(r.display.capRange).toBe("7.2% – 8.5%");
    // :1559  165*0.7 === 115.49999999999999 in IEEE-754, so Math.round -> 115, not 116.
    expect(r.display.revpar).toBe("$115");
  });

  it("G4 Resort / Boutique / tertiary — noiMargin 0.30, roomsToTotal 0.62", () => {
    const r = calculate(inp({ propertyType: "resortBoutique", tier: "tertiary", keys: 45, occupancyPct: 58, adr: 95 }));
    expect(r.noi).toBeCloseTo(437_911.6935483871, 6);
    expect(r.display.range).toBe("$4.3M – $5.2M");
    expect(r.display.noiPerKey).toBe("$9,731");
    expect(r.display.perKey).toBe("$95K – $115K"); // 114,000/5,000=22.8 -> 23*5
    expect(r.display.capRange).toBe("8.5% – 10.3%");
    expect(bar(r.occBandPct)).toBe("15");
    expect(bar(r.revparBandPct)).toBe("0"); // 55.1 <= rb[0] 120 -> clamped low
    expect(r.firedCodes).toEqual(["revparLow", "smallKeys"]); // :1488 / :1496
  });

  it("G5 Extended-Stay / suburban — noiMargin 0.40, roomsToTotal 0.96", () => {
    const r = calculate(inp({ propertyType: "extendedStay", keys: 150, occupancyPct: 80, adr: 130 }));
    expect(r.noi).toBeCloseTo(2_372_500, 6);
    expect(r.display.range).toBe("$26.4M – $30.6M");
    expect(r.display.noiPerKey).toBe("$15,817");
    expect(r.display.perKey).toBe("$175K – $205K");
    expect(r.firedCodes).toEqual(["bigKeys"]); // :1498  150 >= 150, the boundary
  });

  it("G6 Full-Service / gateway / institutional — second 7.2% float-trap case", () => {
    const r = calculate(inp({ propertyType: "fullService", tier: "gateway", keys: 200, occupancyPct: 78, adr: 320 }));
    expect(r.noi).toBeCloseTo(7_848_960, 6);
    expect(r.display.range).toBe("$108.3M – $130.8M");
    expect(r.display.noiPerKey).toBe("$39,245");
    expect(r.display.perKey).toBe("$540K – $655K"); // 654,000/5,000=130.8 -> 131*5
    expect(r.display.capRange).toBe("6.0% – 7.2%"); // 0.0625-0.0025 === 0.06 ; 0.075-0.0025 === 0.0725
    expect(bar(r.occBandPct)).toBe("100"); // (78-60)/(78-60) = 1.0
    expect(bar(r.revparBandPct)).toBe("85");
  });
});

/* ===========================================================================
   4. ADJUSTERS IN ISOLATION — :1370-1374 values, :1539-1544 application
   G9-G16 share a Limited-Service base (100 keys, 70% occ, $150 ADR, suburban)
   except G15/G16 which need a Full-Service base for the F&B row (:1672).
   =========================================================================== */

const LS_BASE = inp({ propertyType: "limitedService", keys: 100, occupancyPct: 70, adr: 150, tier: "suburban" });
const FS_FB_BASE = inp({ propertyType: "fullService", keys: 100, occupancyPct: 70, adr: 220, tier: "suburban" });

describe("each adjuster in isolation", () => {
  it("shares one economics base across G9-G14 (noi 1,533,000 / $15,330 per key)", () => {
    const r = calculate({ ...LS_BASE });
    expect(r.noi).toBeCloseTo(1_533_000, 6); // :1528-1530  3,832,500/0.95*0.38
    expect(r.display.noiPerKey).toBe("$15,330");
  });

  it("G9 renovationAdj.under4 = -50 bps (:1370)", () => {
    const r = calculate({ ...LS_BASE, condition: "under4" });
    expect(r.capAdj).toBeCloseTo(-0.0075, 12); // -0.0050 + 0 + (-0.0025)
    expect(r.capAdjBps).toBe(-75);
    expect(r.display.capRange).toBe("7.5% – 9.0%"); // 0.0825-0.0075 === 0.07500000000000001
    expect(r.display.range).toBe("$17.1M – $20.5M");
    expect(r.display.perKey).toBe("$170K – $205K");
    expect(r.firedCodes).toEqual([]);
  });

  it("G10 renovationAdj.over8 = +75 bps (:1370)", () => {
    const r = calculate({ ...LS_BASE, condition: "over8" });
    expect(r.capAdj).toBeCloseTo(0.005, 12); // +0.0075 + 0 + (-0.0025)
    expect(r.display.capRange).toBe("8.8% – 10.3%"); // 8.75 -> toFixed(1) -> "8.8"
    expect(r.display.range).toBe("$15.0M – $17.5M");
    expect(r.display.perKey).toBe("$150K – $175K");
    expect(r.firedCodes).toEqual(["pip"]); // :1482  cond === "old" (:1518)
    expect(r.ctaVariant).toBe("default"); // :1585  pip is NOT in the value-add trio
  });

  it("G10b the `9–15 yrs` label reaches over8 through condKeyCfg's en-dash regex (:1394)", () => {
    // /9.?15/ matches "9–15" because `.` matches the U+2013 en dash.
    expect(condKeyCfg("9–15 yrs")).toBe("over8");
    expect(condKeyCfg("15+ yrs / renovation (PIP) due")).toBe("over8");
    const viaLabel = calculate({ ...LS_BASE, condition: condKeyCfg("9–15 yrs") });
    const viaPip = calculate({ ...LS_BASE, condition: condKeyCfg("15+ yrs / renovation (PIP) due") });
    expect(viaLabel.display).toEqual(viaPip.display); // byte-identical outputs
  });

  it("G11 landAdj.groundLease = +100 bps (:1371)", () => {
    const r = calculate({ ...LS_BASE, groundLease: true });
    expect(r.capAdj).toBeCloseTo(0.0075, 12); // 0 + 0.0100 + (-0.0025)
    expect(r.display.capRange).toBe("9.0% – 10.5%");
    expect(r.display.range).toBe("$14.6M – $17.1M");
    expect(r.display.perKey).toBe("$145K – $170K"); // 146,000/5,000=29.2 -> 29*5
    expect(r.firedCodes).toEqual(["ground"]); // :1484
  });

  it("G11b landAdj.feeSimple = 0 bps (:1371) — the other land value", () => {
    const fee = calculate({ ...LS_BASE, groundLease: false });
    const gl = calculate({ ...LS_BASE, groundLease: true });
    expect(gl.capAdj - fee.capAdj).toBeCloseTo(0.01, 12); // exactly landAdj.groundLease
    expect(fee.adviceContext.ground).toBe(false);
  });

  it("G12 brandAdj.independent = +25 bps (:1372)", () => {
    const r = calculate({ ...LS_BASE, brand: "independent" });
    expect(r.capAdj).toBeCloseTo(0.0025, 12);
    expect(r.display.capRange).toBe("8.5% – 10.0%");
    expect(r.display.range).toBe("$15.4M – $18.1M");
    expect(r.display.perKey).toBe("$155K – $180K"); // 153,000/5,000=30.6 -> 31*5
    // :1519 sets ctx.brand to the string "indep"; :1494 tests `c.brand === "indep"`.
    // If the port had used "independent" here this rule would be permanently dead.
    expect(r.adviceContext.brand).toBe("indep");
    expect(r.firedCodes).toEqual(["independent"]);
    expect(r.ctaVariant).toBe("valueAdd"); // :1585  independent IS in the trio
  });

  it("G13 brandAdj.branded = -25 bps (:1372), the implicit baseline", () => {
    const r = calculate({ ...LS_BASE, brand: "branded" });
    expect(r.capAdj).toBeCloseTo(-0.0025, 12);
    expect(r.display.capRange).toBe("8.0% – 9.5%");
    expect(r.display.range).toBe("$16.2M – $19.2M");
    expect(r.display.perKey).toBe("$160K – $190K");
    expect(r.adviceContext.brand).toBe("branded"); // :1519
    expect(r.firedCodes).toEqual([]);
  });

  it("G14 `Soft-brand / lifestyle` collapses to branded (:1393)", () => {
    // brandKeyCfg only matches /independent|unbranded/i — soft-brand falls through.
    expect(brandKeyCfg("Soft-brand / lifestyle")).toBe("branded");
    expect(brandKeyCfg("Branded (franchise)")).toBe("branded");
    expect(brandKeyCfg("Independent / unbranded")).toBe("independent");
    const soft = calculate({ ...LS_BASE, brand: brandKeyCfg("Soft-brand / lifestyle") });
    expect(soft.display).toEqual(calculate({ ...LS_BASE, brand: "branded" }).display);
  });

  it("G15 F&B ABOVE the threshold fires +25 bps (:1373-1374, :1543)", () => {
    const r = calculate({ ...FS_FB_BASE, brand: "branded", fbPct: 26 });
    expect(r.noi).toBeCloseTo(2_421_353.846153846, 6);
    expect(r.capAdj).toBe(0); // -0.0025 (branded) + 0.0025 (F&B) cancel exactly
    expect(r.display.capRange).toBe("8.0% – 9.3%");
    expect(r.display.range).toBe("$26.2M – $30.3M");
    expect(r.display.noiPerKey).toBe("$24,214");
    expect(r.display.perKey).toBe("$260K – $305K");
  });

  it("G16 F&B AT exactly the 25% threshold does NOT fire — `>` not `>=` (:1543)", () => {
    const r = calculate({ ...FS_FB_BASE, brand: "branded", fbPct: 25 });
    expect(r.capAdj).toBeCloseTo(-0.0025, 12); // 0.25 > 0.25 is false
    expect(r.display.capRange).toBe("7.8% – 9.0%");
    expect(r.display.range).toBe("$26.9M – $31.3M");
    expect(r.display.perKey).toBe("$270K – $310K");
  });

  it("F&B BELOW the threshold does not fire either, and 0 short-circuits on `fbPct > 0`", () => {
    const below = calculate({ ...FS_FB_BASE, brand: "branded", fbPct: 24.9 });
    const none = calculate({ ...FS_FB_BASE, brand: "branded" });
    const zero = calculate({ ...FS_FB_BASE, brand: "branded", fbPct: 0 });
    expect(below.capAdj).toBeCloseTo(-0.0025, 12);
    expect(none.capAdj).toBeCloseTo(-0.0025, 12);
    expect(zero.capAdj).toBeCloseTo(-0.0025, 12);
    // The G15/G16 delta is exactly fbHighAdj and nothing else.
    const at = calculate({ ...FS_FB_BASE, brand: "branded", fbPct: 25 });
    const above = calculate({ ...FS_FB_BASE, brand: "branded", fbPct: 26 });
    expect(above.capAdj - at.capAdj).toBeCloseTo(CONFIG.fbHighAdj, 12);
  });

  it("capAdjustment sums in the source's order: renovation, land, brand, F&B (:1540-1543)", () => {
    expect(capAdjustment({ condition: "base4to8", groundLease: false, brand: "branded" })).toBeCloseTo(-0.0025, 12);
    expect(capAdjustment({ condition: "under4", groundLease: false, brand: "branded" })).toBeCloseTo(-0.0075, 12);
    expect(capAdjustment({ condition: "over8", groundLease: true, brand: "independent", fbPct: 40 })).toBeCloseTo(0.0225, 12);
    expect(capAdjustment({ condition: "over8", groundLease: true, brand: "independent", fbPct: 25 })).toBeCloseTo(0.02, 12);
  });
});

/* ===========================================================================
   5. COMBINATIONS — stacking positively and negatively
   =========================================================================== */

describe("stacked adjusters", () => {
  it("G17 all four positive adjusters = +225 bps, the maximum reachable (:1540-1543)", () => {
    const r = calculate({ ...FS_FB_BASE, condition: "over8", groundLease: true, brand: "independent", fbPct: 40 });
    expect(r.capAdj).toBeCloseTo(0.0225, 12);
    expect(r.capAdjBps).toBe(225);
    // BOTH ends land float-dirty: 0.08+0.0225 === 0.10250000000000001 and
    // 0.0925+0.0225 === 0.11499999999999999 — assert the rendered string (:1562).
    expect(r.display.capRange).toBe("10.3% – 11.5%");
    expect(r.capLow).toBeCloseTo(0.1025, 12);
    expect(r.capHigh).toBeCloseTo(0.115, 12);
    expect(r.display.range).toBe("$21.1M – $23.6M");
    expect(r.display.perKey).toBe("$210K – $235K");
    // :1581-1584  three rules fire, only the first two render.
    expect(r.firedCodes).toEqual(["pip", "ground", "independent"]);
    expect(r.topAdvice.map((a) => a.code)).toEqual(["pip", "ground"]);
    expect(r.ctaVariant).toBe("valueAdd"); // :1585 reads firedCodes, not topAdvice
  });

  it("stacks positively on the widest shipped band (Limited-Service / tertiary)", () => {
    const r = calculate(inp({ propertyType: "limitedService", tier: "tertiary", keys: 70, occupancyPct: 60, adr: 110, condition: "over8", groundLease: true, brand: "independent" }));
    expect(r.capAdj).toBeCloseTo(0.02, 12); // 0.0075 + 0.0100 + 0.0025, no F&B
    expect(r.display.capRange).toBe("11.3% – 13.0%"); // 0.0925+0.02 ; 0.11+0.02
    expect(r.display.range).toBe("$5.2M – $6.0M");
    expect(r.display.perKey).toBe("$75K – $85K"); // 74,000/5,000=14.8->15*5 ; 86,000/5,000=17.2->17*5
    expect(r.firedCodes).toEqual(["pip", "ground", "independent"]);
  });

  it("G18 stacks negatively to the global minimum cap (5.25%) WITHOUT reaching the 4.5% floor", () => {
    const r = calculate(inp({ propertyType: "resortBoutique", tier: "gateway", keys: 80, occupancyPct: 70, adr: 400, condition: "under4", brand: "branded" }));
    // :1362 resortBoutique.gateway = [0.0600, 0.0750], the lowest base low shipped.
    // :1540-1542 most negative reachable adj = -0.0050 + 0 + -0.0025 = -0.0075.
    expect(r.capAdj).toBeCloseTo(-0.0075, 12);
    expect(r.capLow).toBeCloseTo(0.0525, 12);
    expect(r.capLow).toBeGreaterThan(CAP_FLOOR); // :1547 cannot bite
    expect(r.capFloorFired).toBe(false);
    expect(r.capSpreadFired).toBe(false); // :1548  0.0675 >= 0.0525+0.005
    expect(r.display.capRange).toBe("5.3% – 6.8%");
    expect(r.display.range).toBe("$58.6M – $75.4M");
    expect(r.display.noiPerKey).toBe("$49,452");
    expect(r.display.perKey).toBe("$735K – $940K"); // 733,000/5,000=146.6->147*5 ; 942,000/5,000=188.4->188*5
  });
});

/* ===========================================================================
   6. THE CAP FLOOR AND THE "high >= low + 0.5%" RULE — :1547-1548
   Unreachable through calculate() with the shipped CONFIG, so the guardrail is
   asserted directly on the clamp, then propagated through calculate() with a
   deliberately retuned config.
   =========================================================================== */

describe("cap clamps (:1547-1548)", () => {
  it("G23 the 4.5% floor raises capLow, and the raised low then forces the spread", () => {
    // :1547  Math.max(0.0400, 0.045) = 0.045
    // :1548  Math.max(0.0420, 0.045 + 0.005) = 0.05
    const a = applyCapClamps(0.04, 0.042);
    expect(a.capLow).toBe(0.045);
    expect(a.capHigh).toBeCloseTo(0.05, 12);
    expect(a.floorFired).toBe(true);
    expect(a.spreadFired).toBe(true);
    expect(formatCapRange(a.capLow, a.capHigh)).toBe("4.5% – 5.0%");

    const b = applyCapClamps(0.03, 0.046);
    expect(b.capLow).toBe(0.045);
    expect(b.capHigh).toBeCloseTo(0.05, 12);
    expect(b.floorFired).toBe(true);
    expect(b.spreadFired).toBe(true); // the FLOOR is what pushes 0.046 up here
  });

  it("G23c a band already at/above the floor with a wide spread is untouched", () => {
    const c = applyCapClamps(0.045, 0.09);
    expect(c.capLow).toBe(0.045);
    expect(c.capHigh).toBe(0.09);
    expect(c.floorFired).toBe(false); // Math.max(0.045, 0.045) !== a change
    expect(c.spreadFired).toBe(false);
  });

  it("G24 a raw band that violates high >= low + 0.5% is widened, floor untouched", () => {
    // :1548  Math.max(0.0540, 0.0525 + 0.005 = 0.0575) = 0.0575
    const d = applyCapClamps(0.0525, 0.054);
    expect(d.capLow).toBe(0.0525);
    expect(d.capHigh).toBeCloseTo(0.0575, 12);
    expect(d.floorFired).toBe(false);
    expect(d.spreadFired).toBe(true);
    expect(formatCapRange(d.capLow, d.capHigh)).toBe("5.3% – 5.8%");
    expect(d.capHigh - d.capLow).toBeGreaterThanOrEqual(MIN_CAP_SPREAD - 1e-12);
  });

  it("both clamps propagate through calculate() when CONFIG is retuned", () => {
    // The guardrail is dead with the shipped bands (see the invariant test
    // below), so drive it with a retuned capRates cell. Everything else is the
    // shipped config, and the branded -25 bps adj still applies (:1542).
    const retuned: CalculatorConfig = {
      ...CONFIG,
      capRates: { ...CONFIG.capRates, fullService: { ...CONFIG.capRates.fullService, suburban: [0.0225, 0.025] } },
    };
    // raw band after adj: 0.0225-0.0025 = 0.02 ; 0.025-0.0025 = 0.0225
    const r = calculate(inp({ keys: 100, noiOverride: 450_000 }), retuned);
    expect(r.capFloorFired).toBe(true); // :1547
    expect(r.capSpreadFired).toBe(true); // :1548
    expect(r.capLow).toBe(0.045);
    expect(r.capHigh).toBeCloseTo(0.05, 12);
    expect(r.display.capRange).toBe("4.5% – 5.0%");
    // :1551-1552  450,000/0.045 = 10,000,000 ; 450,000/0.05 = 9,000,000
    expect(r.totalHigh).toBe(10_000_000);
    expect(r.totalLow).toBe(9_000_000);
    expect(r.display.range).toBe("$9.0M – $10.0M");

    // spread-only: raw band 0.06 / 0.0625, both above the floor but only 25 bps apart
    const spreadOnly: CalculatorConfig = {
      ...CONFIG,
      capRates: { ...CONFIG.capRates, fullService: { ...CONFIG.capRates.fullService, suburban: [0.0625, 0.065] } },
    };
    const s = calculate(inp({ keys: 100, noiOverride: 450_000 }), spreadOnly);
    expect(s.capFloorFired).toBe(false);
    expect(s.capSpreadFired).toBe(true);
    expect(s.display.capRange).toBe("6.0% – 6.5%"); // 0.06 + 0.005
  });

  it("§C.6 invariant: no shipped band x adjuster combination reaches the floor", () => {
    // Adj is added to BOTH ends (:1544) so the spread is band-invariant; the
    // narrowest shipped spread is 125 bps, far above MIN_CAP_SPREAD.
    let minLow = Infinity;
    let minSpread = Infinity;
    for (const pt of PROPERTY_TYPES) {
      for (const tier of TIERS) {
        const band = CONFIG.capRates[pt][tier];
        for (const condition of CONDITIONS) {
          for (const land of LANDS) {
            for (const brand of BRANDS) {
              for (const fbPct of [0, 40]) {
                const low = computeAdjustedCapLow(pt, tier, condition, land, brand, fbPct);
                expect(low).toBeGreaterThan(CAP_FLOOR);
                minLow = Math.min(minLow, low);
                minSpread = Math.min(minSpread, band[1] - band[0]);
              }
            }
          }
        }
      }
    }
    expect(minLow).toBeCloseTo(0.0525, 12); // resortBoutique.gateway with adj -0.0075
    expect(minSpread).toBeGreaterThan(MIN_CAP_SPREAD);
    expect(minSpread).toBeCloseTo(0.0125, 12);
  });
});

/* ===========================================================================
   7. NOI OVERRIDE vs COMPUTED NOI — :1525-1531
   =========================================================================== */

describe("NOI override bypasses the revenue model", () => {
  it("G7 an override > 0 replaces the whole rooms-revenue chain", () => {
    const r = calculate(inp({ noiOverride: 2_500_000 }));
    expect(r.usedNoiOverride).toBe(true); // :1526
    expect(r.noi).toBe(2_500_000);
    // :1528-1529 are never executed on this branch — no room/total revenue exists.
    expect(r.roomRevenue).toBeNull();
    expect(r.totalRevenue).toBeNull();
    expect(r.noiPerKey).toBeCloseTo(28_409.09090909091, 8); // :1532  2,500,000/88
    expect(r.display.noiPerKey).toBe("$28,409*"); // :1560  trailing asterisk
    expect(r.display.range).toBe("$27.8M – $32.3M");
    expect(r.display.perKey).toBe("$315K – $365K");
    expect(r.display.capRange).toBe("7.8% – 9.0%"); // band/adj identical to G1
    expect(r.display.revpar).toBe("$147"); // :1559  RevPAR still comes from ADR x occ
    // :1567-1570  the override caveat sentence
    expect(resultContextHtml(false, true)).toBe(RESULT_CONTEXT_BASE + " <em>" + RESULT_CONTEXT_NOI_NOTE + "</em>");
  });

  it("the override is completely insensitive to keys / ADR / occupancy / property type", () => {
    const a = calculate(inp({ noiOverride: 2_500_000 }));
    const b = calculate(inp({ noiOverride: 2_500_000, adr: 9_999, occupancyPct: 12, propertyType: "extendedStay" }));
    // extendedStay/suburban is [0.08, 0.0925] — the same band as fullService/suburban,
    // so the whole valuation is identical even though the revenue inputs are not.
    expect(b.noi).toBe(a.noi);
    expect(b.totalLow).toBe(a.totalLow);
    expect(b.totalHigh).toBe(a.totalHigh);
    expect(b.display.range).toBe(a.display.range);
  });

  it("noiOverride of exactly 0 (and undefined) takes the derived path — `> 0` at :1526", () => {
    const zero = calculate(inp({ noiOverride: 0 }));
    const missing = calculate(inp());
    expect(zero.usedNoiOverride).toBe(false);
    expect(zero.roomRevenue).toBeCloseTo(4_706_222.4, 6);
    expect(zero.display.noiPerKey).toBe("$23,037"); // no asterisk
    expect(zero.display).toEqual(missing.display);
  });

  it("usedDefaults is echoed and drives its own caveat (:1405, :1569)", () => {
    expect(calculate(inp()).usedDefaults).toBe(false);
    expect(calculate(inp({ usedDefaults: true })).usedDefaults).toBe(true);
    expect(resultContextHtml(true, false)).toBe(RESULT_CONTEXT_BASE + " <em>" + RESULT_CONTEXT_DEFAULTS_NOTE + "</em>");
    expect(resultContextHtml(false, false)).toBe(RESULT_CONTEXT_BASE);
  });
});

/* ===========================================================================
   8. OCCUPANCY CLAMPING + THE RevPAR IDENTITY — :1440, :1521, :1632
   =========================================================================== */

describe("occupancy clamping and RevPAR", () => {
  it("clamp layer 1: the pct formatter caps at 100 on every keystroke (:1440, :1451)", () => {
    expect(formatNumericField("150", { dec: 1, max: 100 })).toBe("100");
    expect(formatNumericField("100.5", { dec: 1, max: 100 })).toBe("100");
    expect(formatNumericField("1234567", { dec: 1, max: 100 })).toBe("100");
    expect(formatNumericField("99.99", { dec: 1, max: 100 })).toBe("99.9"); // dec:1 truncates
    expect(formatNumericField("0074", { dec: 1, max: 100 })).toBe("74"); // leading zeros stripped (:1442)
  });

  it("clamp layer 2: validate(3) re-clamps above 100 and never clamps the low end (:1632)", () => {
    expect(clampOccupancyPct(150)).toBe(100);
    expect(clampOccupancyPct(100)).toBe(100); // boundary: `> 100`, so 100 passes through
    expect(clampOccupancyPct(99.9)).toBe(99.9);
    expect(clampOccupancyPct(0)).toBe(0);
    expect(clampOccupancyPct(-30)).toBe(-30); // the source has NO lower clamp
  });

  it("G8 a 150% entry clamped to 100 produces the source's numbers", () => {
    const r = calculate(inp({ propertyType: "limitedService", occupancyPct: clampOccupancyPct(150) }));
    expect(r.occupancyPct).toBe(100);
    expect(r.occ).toBe(1); // :1507
    expect(r.revpar).toBe(198); // :1521  198 * 1.0
    expect(r.display.range).toBe("$26.8M – $31.8M");
    expect(r.display.revpar).toBe("$198");
    expect(r.display.noiPerKey).toBe("$28,908");
    expect(r.display.perKey).toBe("$305K – $360K");
    expect(r.display.capRange).toBe("8.0% – 9.5%");
    expect(bar(r.occBandPct)).toBe("100"); // (100-58)/(78-58)=2.1, pctBar clamps (:1478)
    expect(r.firedCodes).toEqual(["revparTop"]);
  });

  it("calculate() itself does NOT clamp — the clamp lives in the UI layer (:1502-1521)", () => {
    const r = calculate(inp({ propertyType: "limitedService", occupancyPct: 150 }));
    expect(r.occupancyPct).toBe(150);
    expect(r.revpar).toBe(297); // 198 * 1.5 — the unclamped value really is used
  });

  it("RevPAR is exactly ADR x (occPct/100) at every probe point (:1521)", () => {
    for (const adr of [0, 60, 95, 125, 165, 198, 245, 320, 400, 1000]) {
      for (const occupancyPct of [0, 25, 50, 58, 66, 70, 74, 88, 100]) {
        const r = calculate(inp({ adr, occupancyPct }));
        expect(r.occ).toBe(occupancyPct / 100); // :1507
        expect(r.revpar).toBe(adr * (occupancyPct / 100)); // :1521, bit-for-bit
      }
    }
  });

  it("pctBar clamps both ends and reads band[0]/band[2] only (:1478)", () => {
    expect(pctBar(50, [55, 90, 140])).toBe(0); // below low -> 0
    expect(pctBar(55, [55, 90, 140])).toBe(0);
    expect(pctBar(140, [55, 90, 140])).toBe(100);
    expect(pctBar(999, [55, 90, 140])).toBe(100);
    expect(pctBar(90, [55, 90, 140])).toBeCloseTo(41.17647058823529, 9); // mid is NOT 50%
  });

  it("G19 negative pctBar clamps to 0 on both bars", () => {
    const r = calculate(inp({ propertyType: "limitedService", tier: "tertiary", keys: 40, occupancyPct: 50, adr: 100 }));
    expect(bar(r.occBandPct)).toBe("0"); // (50-58)/(78-58) = -0.4
    expect(bar(r.revparBandPct)).toBe("0"); // (50-55)/(140-55) < 0
    expect(r.display.range).toBe("$2.7M – $3.3M");
    expect(r.display.noiPerKey).toBe("$7,300");
    expect(r.display.capRange).toBe("9.0% – 10.8%");
  });
});

/* ===========================================================================
   9. ROUNDING — :1396 roundTo, :1473-1476 roundTotal, :1477 roundKey,
   :1552-1554 the call sites. JS Math.round is half-UP (toward +Infinity), NOT
   banker's rounding: that direction is the thing being locked.
   =========================================================================== */

describe("rounding direction", () => {
  it("roundTo(v, 50_000) rounds a dead-half UP (:1396)", () => {
    expect(roundTo(24_999, 50_000)).toBe(0);
    expect(roundTo(25_000, 50_000)).toBe(50_000); // exact half -> up
    expect(roundTo(25_001, 50_000)).toBe(50_000);
    expect(roundTo(74_999, 50_000)).toBe(50_000);
    expect(roundTo(75_000, 50_000)).toBe(100_000); // 1.5 -> 2, not 1 (no banker's)
    expect(roundTo(125_000, 50_000)).toBe(150_000); // 2.5 -> 3, not 2
  });

  it("roundTotal picks the M branch at exactly $1,000,000 and rounds to $0.1M (:1473-1476)", () => {
    expect(roundTotal(999_999)).toBe("$1000K"); // `>= 1e6` is false — latent wart, locked as-is
    expect(roundTotal(1_000_000)).toBe("$1.0M"); // boundary is inclusive
    expect(roundTotal(1_049_999)).toBe("$1.0M");
    expect(roundTotal(1_050_000)).toBe("$1.1M"); // 10.5 -> 11, half UP
    expect(roundTotal(1_150_000)).toBe("$1.2M"); // 11.5 -> 12, half UP (not banker's 12? -> 12)
    expect(roundTotal(22_525_000)).toBe("$22.5M");
    expect(roundTotal(22_550_000)).toBe("$22.6M"); // 225.5 -> 226, half UP
    expect(roundTotal(22_575_000)).toBe("$22.6M");
  });

  it("roundTotal's sub-$1M branch rounds to the nearest $5K, half UP (:1475)", () => {
    expect(roundTotal(0)).toBe("$0K");
    expect(roundTotal(2_499)).toBe("$0K");
    expect(roundTotal(2_500)).toBe("$5K"); // exact half -> up
    expect(roundTotal(7_500)).toBe("$10K"); // 1.5 -> 2
    expect(roundTotal(50_000)).toBe("$50K");
    expect(roundTotal(950_000)).toBe("$950K");
  });

  it("roundKey rounds the already-$1K-rounded per-key value to $5K, half UP (:1477)", () => {
    expect(roundKey(0)).toBe("$0K");
    expect(roundKey(2_000)).toBe("$0K");
    expect(roundKey(2_499)).toBe("$0K");
    expect(roundKey(2_500)).toBe("$5K"); // exact half -> up
    expect(roundKey(2_501)).toBe("$5K");
    expect(roundKey(7_499)).toBe("$5K");
    expect(roundKey(7_500)).toBe("$10K"); // 1.5 -> 2
    expect(roundKey(12_500)).toBe("$15K"); // 2.5 -> 3, not banker's 2
    expect(roundKey(252_500)).toBe("$255K");
    expect(roundKey(256_000)).toBe("$255K"); // G1: 51.2 -> 51
    expect(roundKey(257_500)).toBe("$260K");
  });

  it("the $50K total boundary through calculate(): exact half rounds UP (:1552)", () => {
    // NOI override 2,027,250 / capHigh 0.09 = 22,525,000 EXACTLY — a dead half
    // between 22,500,000 and 22,550,000.
    const on = calculate(inp({ keys: 100, adr: 250, occupancyPct: 70, noiOverride: 2_027_250 }));
    expect(on.valueLow).toBe(22_525_000);
    expect(on.totalLow).toBe(22_550_000); // rounded UP
    expect(on.display.range).toBe("$22.6M – $26.2M");

    const below = calculate(inp({ keys: 100, adr: 250, occupancyPct: 70, noiOverride: 2_027_160 }));
    expect(below.valueLow).toBe(22_524_000);
    expect(below.totalLow).toBe(22_500_000); // rounded DOWN
    expect(below.display.range).toBe("$22.5M – $26.2M");

    const above = calculate(inp({ keys: 100, adr: 250, occupancyPct: 70, noiOverride: 2_027_340 }));
    expect(above.valueLow).toBe(22_526_000);
    expect(above.totalLow).toBe(22_550_000);
  });

  it("the $1K per-key boundary through calculate(): exact half rounds UP (:1554)", () => {
    // NOI override 1,723,500 / 0.09 = 19,150,000 ; / 100 keys = 191,500 -> 191.5
    const on = calculate(inp({ keys: 100, adr: 250, occupancyPct: 70, noiOverride: 1_723_500 }));
    expect(on.valueLow).toBe(19_150_000);
    expect(on.perKeyLow).toBe(192_000); // 191.5 -> 192, half UP
    const below = calculate(inp({ keys: 100, adr: 250, occupancyPct: 70, noiOverride: 1_723_410 }));
    expect(below.perKeyLow).toBe(191_000); // 191.49 -> 191
    const above = calculate(inp({ keys: 100, adr: 250, occupancyPct: 70, noiOverride: 1_723_590 }));
    expect(above.perKeyLow).toBe(192_000); // 191.51 -> 192
    // All three still display "$190K" — the $5K re-round (defect D6) is lossy.
    expect(on.display.perKey).toBe("$190K – $220K");
    expect(below.display.perKey).toBe("$190K – $220K");
    expect(above.display.perKey).toBe("$190K – $220K");
  });

  it("noiPerKey display rounds half UP too (:1560)", () => {
    // 2,027,250 / 100 = 20,272.5 exactly
    expect(calculate(inp({ keys: 100, noiOverride: 2_027_250 })).display.noiPerKey).toBe("$20,273*");
    expect(calculate(inp({ keys: 100, noiOverride: 2_027_160 })).display.noiPerKey).toBe("$20,272*");
  });

  it("a sub-$1M valuation exercises roundTotal's K branch end to end", () => {
    const r = calculate(inp({ propertyType: "limitedService", tier: "tertiary", keys: 10, occupancyPct: 40, adr: 60 }));
    expect(r.totalLow).toBe(350_000);
    expect(r.totalHigh).toBe(400_000);
    expect(r.display.range).toBe("$350K – $400K"); // :1475 branch
    expect(r.display.perKey).toBe("$35K – $40K");
    expect(r.prefill.range).toBe("$350,000 – $400,000"); // :1601 dollarsFull
  });
});

/* ===========================================================================
   10. THE TYPICAL AUTOFILL TABLE — :1377-1382, :1640-1644
   Keyed by MARKET TIER, never by property type.
   =========================================================================== */

describe("typical-figures autofill", () => {
  it("returns the source's tier table as whole-percent occupancy + ADR (:1643)", () => {
    expect(typicalFor("gateway")).toEqual({ occ: 74, adr: 245 });
    expect(typicalFor("secondary")).toEqual({ occ: 70, adr: 165 });
    expect(typicalFor("suburban")).toEqual({ occ: 66, adr: 125 });
    expect(typicalFor("tertiary")).toEqual({ occ: 58, adr: 95 });
  });

  it("keeps the raw decimals from :1378-1381", () => {
    expect(CONFIG.capRates.fullService.suburban).toEqual([0.08, 0.0925]); // sanity: same CONFIG object
    expect(typicalFor("gateway").occ).toBe(Math.round(0.74 * 100)); // 74.00000000000001 -> 74
    expect(typicalFor("suburban").occ).toBe(Math.round(0.66 * 100)); // 65.99999999999999 -> 66
    expect(typicalFor("tertiary").occ).toBe(Math.round(0.58 * 100)); // 57.99999999999999 -> 58
  });

  it("autofilled tier figures feed calculate() unchanged", () => {
    const t = typicalFor("secondary");
    const r = calculate(inp({ propertyType: "selectService", tier: "secondary", keys: 120, occupancyPct: t.occ, adr: t.adr, usedDefaults: true }));
    expect(r.display.range).toBe("$23.0M – $27.0M"); // identical to G3
    expect(r.usedDefaults).toBe(true);
  });
});

/* ===========================================================================
   11. THE ADVICE ENGINE — :1481-1500 rules, :1581-1596 selection
   Rules are filtered in declaration order, sorted by prio (stable), then
   sliced to the first two. `firedCodes` keeps ALL matches; the CTA reads
   firedCodes, not the rendered slice.
   =========================================================================== */

describe("ADVICE engine", () => {
  it("ships all nine rules with the source's codes, priorities and order (:1481-1500)", () => {
    expect(ADVICE.map((a) => a.code)).toEqual(["pip", "ground", "revparTop", "revparLow", "pricingPower", "valueAdd", "independent", "smallKeys", "bigKeys"]);
    expect(ADVICE.map((a) => a.prio)).toEqual([1, 1, 2, 2, 3, 3, 3, 4, 4]);
  });

  it("S1 exactly one rule fires: pip (:1482)", () => {
    const r = calculate({ ...LS_BASE, condition: "over8" });
    expect(r.firedCodes).toEqual(["pip"]);
    expect(r.topAdvice).toHaveLength(1);
    expect(r.topAdvice[0].code).toBe("pip");
    expect(r.ctaLine).toBe(CTA_LINES.default); // :1589
  });

  it("S2 exactly one rule fires: pricingPower — occ >= ob[2] AND adr <= ab[1] (:1490)", () => {
    const r = calculate(inp({ propertyType: "extendedStay", keys: 100, occupancyPct: 88, adr: 140 }));
    // ob[2] = 85, ab[1] = 150 for extendedStay (:1400-1401)
    expect(r.firedCodes).toEqual(["pricingPower"]);
    expect(r.ctaVariant).toBe("default"); // in neither CTA list (:1585-1589)
    expect(r.display.range).toBe("$20.8M – $24.2M");
    expect(r.display.noiPerKey).toBe("$18,737");
  });

  it("S3 revparTop alone -> runningWell CTA (:1486, :1587)", () => {
    const r = calculate(inp({ propertyType: "selectService", tier: "gateway", keys: 100, occupancyPct: 85, adr: 230 }));
    expect(r.firedCodes).toEqual(["revparTop"]); // 195.5 >= rb[2] 185
    expect(r.ctaVariant).toBe("runningWell");
    expect(r.ctaLine).toBe(CTA_LINES.runningWell);
    expect(r.display.range).toBe("$35.6M – $42.4M");
    expect(r.display.perKey).toBe("$355K – $425K");
  });

  it("S4 three fire in prio order 2/3/4, two render (:1582-1584)", () => {
    const r = calculate(inp({ propertyType: "limitedService", tier: "tertiary", keys: 40, occupancyPct: 50, adr: 100 }));
    expect(r.firedCodes).toEqual(["revparLow", "valueAdd", "smallKeys"]);
    expect(r.topAdvice.map((a) => a.code)).toEqual(["revparLow", "valueAdd"]);
    expect(r.topAdvice).toHaveLength(2);
    expect(r.ctaVariant).toBe("valueAdd"); // :1585
  });

  it("S5 six fire, still exactly two render — the cap and the priority order", () => {
    const r = calculate(inp({ propertyType: "resortBoutique", tier: "tertiary", keys: 40, occupancyPct: 50, adr: 100, condition: "over8", groundLease: true, brand: "independent" }));
    // prio 1: pip, ground | prio 2: revparLow | prio 3: valueAdd, independent | prio 4: smallKeys
    expect(r.firedCodes).toEqual(["pip", "ground", "revparLow", "valueAdd", "independent", "smallKeys"]);
    expect(r.topAdvice.map((a) => a.code)).toEqual(["pip", "ground"]); // declaration order breaks the prio-1 tie
    expect(r.topAdvice).toHaveLength(2);
    expect(r.firedCodes.length).toBeGreaterThan(r.topAdvice.length);
    expect(r.ctaVariant).toBe("valueAdd");
    expect(r.display.capRange).toBe("10.8% – 12.5%");
    expect(r.display.range).toBe("$2.9M – $3.3M");
  });

  it("S6 prio 1/3/4 mix — the prio-3 rule outranks the prio-4 one", () => {
    const r = calculate(inp({ propertyType: "extendedStay", keys: 50, occupancyPct: 88, adr: 140, groundLease: true }));
    expect(r.firedCodes).toEqual(["ground", "pricingPower", "smallKeys"]);
    expect(r.topAdvice.map((a) => a.code)).toEqual(["ground", "pricingPower"]);
    expect(r.ctaVariant).toBe("default"); // none of ground/pricingPower/smallKeys is in either CTA list
    expect(r.display.capRange).toBe("8.8% – 10.0%");
    expect(r.display.range).toBe("$9.4M – $10.7M");
  });

  it("S7 the valueAdd CTA branch wins over runningWell even when revparTop fired (:1585-1588)", () => {
    const r = calculate(inp({ propertyType: "limitedService", tier: "gateway", keys: 200, occupancyPct: 80, adr: 200, brand: "independent", marketZipRaw: "Los Angeles 90210" }));
    expect(r.firedCodes).toEqual(["revparTop", "independent", "bigKeys"]);
    expect(r.topAdvice.map((a) => a.code)).toEqual(["revparTop", "independent"]);
    expect(r.ctaVariant).toBe("valueAdd"); // the `.some(...)` ternary is evaluated first
    expect(r.ctaLine).toBe(CTA_LINES.valueAdd);
    // :1541 float contrast with G3/G6: 0.07 + 0.0025 === 0.07250000000000001 -> "7.3",
    // whereas 0.075 - 0.0025 === 0.0725 -> "7.2". Same nominal 7.25%, different strings.
    expect(r.display.capRange).toBe("7.3% – 8.5%");
    expect(r.zip).toBe("90210"); // :1515
    expect(r.prefill.summary).toBe("Limited-Service · 200 keys · 90210"); // :1602
  });

  it("S8 zero rules fire -> the fallback paragraph, no code, default CTA (:1591-1593)", () => {
    const r = calculate(inp({ keys: 100, occupancyPct: 70, adr: 250 }));
    expect(r.firedCodes).toEqual([]);
    expect(r.topAdvice).toHaveLength(1);
    expect(r.topAdvice[0].code).toBeUndefined(); // the fallback has no code (:1592)
    expect(r.topAdvice[0].html).toBe(FALLBACK_ADVICE.html);
    expect(r.ctaVariant).toBe("default");
    expect(r.display.range).toBe("$30.6M – $35.5M");
    expect(bar(r.occBandPct)).toBe("56");
    expect(bar(r.revparBandPct)).toBe("41");
  });

  it("revparLow requires revpar > 0, so a zero-RevPAR hotel does NOT fire it (:1488)", () => {
    const r = calculate(inp({ adr: 0 }));
    expect(r.revpar).toBe(0);
    expect(r.firedCodes).not.toContain("revparLow");
  });

  it("smallKeys / bigKeys boundaries are `< 60` and `>= 150` (:1496, :1498)", () => {
    expect(calculate(inp({ keys: 59 })).firedCodes).toContain("smallKeys");
    expect(calculate(inp({ keys: 60 })).firedCodes).not.toContain("smallKeys");
    expect(calculate(inp({ keys: 149 })).firedCodes).not.toContain("bigKeys");
    expect(calculate(inp({ keys: 150 })).firedCodes).toContain("bigKeys");
  });

  it("prefill.topAdvice is tag-stripped and hard-sliced to 140 chars, no ellipsis (:1599, :1609)", () => {
    const r = calculate({ ...LS_BASE, condition: "over8" });
    expect(r.prefill.topAdvice).toBe("A near-term renovation (a brand-required PIP) is the most common reason a quoted price gets re-traded. Pricing it correctly up front protect");
    expect(r.prefill.topAdvice).toHaveLength(140);
    const fallback = calculate(inp({ keys: 100, occupancyPct: 70, adr: 250 }));
    expect(fallback.prefill.topAdvice).toBe("Your numbers land in a healthy, sellable range for this asset type — no single red flag, no obvious gap. Hotels like this reward a disciplin");
  });

  it("prefill.insightCodes carries the FULL fired list, not the rendered two (:1610)", () => {
    const r = calculate({ ...FS_FB_BASE, condition: "over8", groundLease: true, brand: "independent", fbPct: 40 });
    expect(r.prefill.insightCodes).toEqual(["pip", "ground", "independent"]);
    expect(r.topAdvice).toHaveLength(2);
  });
});

/* ===========================================================================
   12. DEGENERATE INPUTS — the source's ACTUAL behaviour, locked not fixed.
   Defects D1/D2 (docs/port/01-calculator.md §0.5): the per-key divide at
   :1553-1554 is unguarded while :1532 IS guarded.
   =========================================================================== */

describe("degenerate inputs (source defects, locked as-is)", () => {
  it("D2 keys = 0 on the derived path produces NaN per-key and a $NaNK string", () => {
    const r = calculate(inp({ keys: 0 }));
    expect(r.noi).toBe(0); // :1528  0 * 198 * 365 * 0.74 = 0
    expect(r.noiPerKey).toBe(0); // :1532  guarded: keys > 0 ? ... : 0
    expect(r.perKeyLow).toBeNaN(); // :1554  0/0 -> NaN, UNGUARDED
    expect(r.perKeyHigh).toBeNaN(); // :1553
    expect(r.display.perKey).toBe("$NaNK – $NaNK"); // :1561 renders it verbatim
    expect(r.display.range).toBe("$0K – $0K");
    expect(r.display.noiPerKey).toBe("$0");
    expect(r.firedCodes).toContain("smallKeys"); // :1496  0 < 60
  });

  it("D1 keys = 0 with an NOI override produces Infinity per-key and a $InfinityK string", () => {
    const r = calculate(inp({ keys: 0, noiOverride: 2_500_000 }));
    expect(r.noiPerKey).toBe(0); // :1532 guard still applies
    expect(r.perKeyLow).toBe(Infinity); // :1554  2,500,000/0.09/0 -> Infinity
    expect(r.perKeyHigh).toBe(Infinity);
    expect(r.display.perKey).toBe("$InfinityK – $InfinityK");
    expect(r.display.noiPerKey).toBe("$0*"); // guarded to 0, but still asterisked
    expect(r.display.range).toBe("$27.8M – $32.3M"); // totals are unaffected by keys
  });

  it("the caller is what stops D1/D2 — validate(2) rejects keys < 1 (:1622-1624)", () => {
    expect(keysAreValid(0)).toBe(false);
    expect(keysAreValid(0.5)).toBe(false);
    expect(keysAreValid(1)).toBe(true);
    expect(keysAreValid(88)).toBe(true);
    expect(keysAreValid(NaN)).toBe(false); // !NaN is true -> invalid
  });

  it("ADR = 0 collapses the whole valuation to zero without throwing", () => {
    const r = calculate(inp({ adr: 0 }));
    expect(r.revpar).toBe(0);
    expect(r.noi).toBe(0);
    expect(r.valueLow).toBe(0);
    expect(r.display.range).toBe("$0K – $0K");
    expect(r.display.perKey).toBe("$0K – $0K"); // keys is fine here, so 0/88 = 0
    expect(r.display.revpar).toBe("$0");
    expect(r.display.noiPerKey).toBe("$0");
    expect(bar(r.revparBandPct)).toBe("0");
    expect(r.firedCodes).toEqual([]); // revparLow is blocked by its `> 0` guard
  });

  it("occupancy = 0 fires valueAdd and zeroes the model", () => {
    const r = calculate(inp({ occupancyPct: 0 }));
    expect(r.revpar).toBe(0);
    expect(r.display.range).toBe("$0K – $0K");
    expect(bar(r.occBandPct)).toBe("0");
    expect(r.firedCodes).toEqual(["valueAdd"]); // :1492  0 <= ob[0] 60
  });

  it("absurd occupancy is carried straight through calculate() (no upper guard at :1507)", () => {
    const r = calculate(inp({ occupancyPct: 1000 }));
    expect(r.occ).toBe(10);
    expect(r.revpar).toBe(1980);
    expect(bar(r.occBandPct)).toBe("100"); // only pctBar clamps
    expect(r.firedCodes).toContain("revparTop");
  });

  it("missing optional fields default exactly as the source's empty inputs did (:1513-1515)", () => {
    const r = calculate(inp()); // no fbPct, no noiOverride, no marketZipRaw, no usedDefaults
    expect(r.capAdj).toBeCloseTo(-0.0025, 12); // num("")/100 = 0 -> F&B never fires
    expect(r.usedNoiOverride).toBe(false); // num("") = 0, and `0 > 0` is false
    expect(r.zip).toBe("");
    expect(r.prefill.summary).toBe("Full-Service · 88 keys"); // no " · ZIP" suffix
    expect(r.usedDefaults).toBe(false);
  });

  it("D3 an F&B value still moves the cap on a type whose F&B row the UI hides (:1672)", () => {
    // The source only display:none's #fbRow; #cFb keeps its value and :1543 reads it.
    const r = calculate({ ...LS_BASE, fbPct: 40 });
    expect(r.capAdj).toBe(0); // -0.0025 + 0.0025
    expect(r.display.capRange).toBe("8.3% – 9.8%");
    expect(r.display.range).toBe("$15.7M – $18.6M");
  });
});

/* ===========================================================================
   13. UI-STRING KEY MAPS + FORMATTERS — :1385-1394, :1418-1478, :1512, :1515
   =========================================================================== */

describe("display-string to CONFIG-key maps", () => {
  it("typeKey maps every shipped #cType label, defaulting to fullService (:1385-1391)", () => {
    expect(typeKey("Limited-Service")).toBe("limitedService");
    expect(typeKey("Select-Service")).toBe("selectService");
    expect(typeKey("Full-Service")).toBe("fullService");
    expect(typeKey("Resort / Boutique")).toBe("resortBoutique");
    expect(typeKey("Extended-Stay")).toBe("extendedStay");
    expect(typeKey("something else entirely")).toBe("fullService"); // the fallthrough
  });

  it("tierKey maps every shipped #cTier label, defaulting to suburban (:1392)", () => {
    expect(tierKey("Gateway / urban core (NYC, SF, LA, Miami…)")).toBe("gateway");
    expect(tierKey("Strong secondary / resort destination")).toBe("secondary");
    expect(tierKey("Standard / suburban")).toBe("suburban");
    expect(tierKey("Tertiary / rural / highway")).toBe("tertiary");
    expect(tierKey("")).toBe("suburban");
  });

  it("condKeyCfg maps all four #cCond labels onto three keys (:1394)", () => {
    expect(condKeyCfg("Renovated / built in last 3 yrs")).toBe("under4");
    expect(condKeyCfg("4–8 yrs (baseline)")).toBe("base4to8");
    expect(condKeyCfg("9–15 yrs")).toBe("over8");
    expect(condKeyCfg("15+ yrs / renovation (PIP) due")).toBe("over8");
  });

  it("groundLeaseFromLabel reads the #cGround label the way :1512 did", () => {
    expect(groundLeaseFromLabel("Fee Simple (own the land)")).toBe(false);
    expect(groundLeaseFromLabel("Ground lease")).toBe(true);
  });

  it("extractZip takes the first 5 consecutive digits anywhere, else '' (:1515)", () => {
    expect(extractZip("Los Angeles 90210")).toBe("90210");
    expect(extractZip("90210")).toBe("90210");
    expect(extractZip("zip 00501 CA")).toBe("00501");
    expect(extractZip("123456")).toBe("12345"); // first five only
    expect(extractZip("1234")).toBe("");
    expect(extractZip("")).toBe("");
    expect(extractZip(undefined)).toBe("");
  });
});

describe("input parsing and money formatters", () => {
  it("parseNumericField strips everything but digits and dots, never returns NaN (:1418-1421)", () => {
    expect(parseNumericField("")).toBe(0);
    expect(parseNumericField("abc")).toBe(0);
    expect(parseNumericField("1,200")).toBe(1200);
    expect(parseNumericField("$1,000,000")).toBe(1_000_000);
    expect(parseNumericField("12.5%")).toBe(12.5);
    expect(parseNumericField("1.2.3")).toBe(1.2); // parseFloat stops at the second dot
    expect(parseNumericField("-30")).toBe(30); // the minus sign is STRIPPED, not honoured
    expect(parseNumericField(null)).toBe(0);
  });

  it("formatNumericField implements the three data-fmt modes (:1434-1452)", () => {
    expect(formatNumericField("1200", { dec: 0 })).toBe("1,200");
    expect(formatNumericField("012", { dec: 0 })).toBe("12");
    expect(formatNumericField("1.9", { dec: 0 })).toBe("1"); // ints drop the dot (:1429)
    expect(formatNumericField("2500000", { dec: 2 })).toBe("2,500,000");
    expect(formatNumericField("1234.567", { dec: 2 })).toBe("1,234.56"); // truncated, not rounded
    expect(formatNumericField(".5", { dec: 2 })).toBe("0.5");
    expect(formatNumericField("12.", { dec: 1, max: 100 })).toBe("12."); // trailing dot preserved (:1435)
    expect(formatNumericField("", { dec: 1, max: 100 })).toBe("");
  });

  it("groupInt / dollarsFull / capPct match :1422, :1471, :1562", () => {
    expect(groupInt("22550000")).toBe("22,550,000");
    expect(groupInt("999")).toBe("999");
    expect(dollarsFull(22_550_000)).toBe("$22,550,000");
    expect(dollarsFull(0)).toBe("$0");
    expect(capPct(0.0725)).toBe("7.2"); // the float trap, again
    expect(capPct(0.07250000000000001)).toBe("7.3"); // the other float path
    expect(capPct(0.09)).toBe("9.0");
    expect(formatCapRange(0.0775, 0.09)).toBe("7.8% – 9.0%"); // :1562, spaced en dash
    expect(formatCapRange(0.0775, 0.09, "–")).toBe("7.8%–9.0%"); // :1605, unspaced
  });
});
