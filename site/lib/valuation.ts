/**
 * FROZEN PORT — changes require a dated PROJECT-MEMORY.md decision.
 *
 * The hotel valuation engine, ported byte-for-byte in behaviour from the kwc
 * site's calculator IIFE.
 *
 * Source of record (read-only, never edited from this repo):
 *   ~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html
 *     :1350-1355  section comment + IIFE open
 *     :1356-1375  CONFIG
 *     :1376-1382  TYPICAL
 *     :1384-1394  typeKey / tierKey / brandKeyCfg / condKeyCfg
 *     :1396       roundTo
 *     :1398-1402  OCC_BAND / ADR_BAND / REVPAR_BAND
 *     :1403-1405  clamp / esc / usedDefaults
 *     :1413-1463  num / groupInt / clean / formatField / fmtMap
 *     :1465-1478  money / perKey / dollarsFull / roundTotal / roundKey / pctBar
 *     :1480-1500  ADVICE
 *     :1502-1612  calculate()
 *     :1614-1618  bar()
 *     :1620-1637  validate()
 *     :1639-1644  typicalFor()
 *   Port pack: docs/port/01-calculator.md (§A math, §C TypeScript contract).
 *
 * Rules this file obeys:
 *   - Every number is identical to the source. No unit normalisation, no
 *     "cleanup", no reordering of the ADVICE array (declaration order is the
 *     priority tie-break).
 *   - Arithmetic is performed in the source's exact order so IEEE-754 results
 *     match bit for bit (e.g. 0.075 - 0.0025 -> "7.2%", NOT "7.3%" — see the
 *     float-trap note on capPct()).
 *   - Pure: no DOM, no globals, no side effects. The source read fields via
 *     document.getElementById; this takes a typed ValuationInput instead.
 *
 * Known source defects, ported as-is (docs/port/01-calculator.md §0.5). Do not
 * "fix" them here without a dated PROJECT-MEMORY.md decision:
 *   D1/D2  keys === 0 makes perKeyLow/perKeyHigh Infinity (NOI override) or NaN
 *          (derived NOI) because the per-key divide is unguarded (:1553-1554),
 *          while noiPerKey IS guarded (:1532). Callers must enforce keys >= 1
 *          (the source's validate(2) gate).
 *   D3     A hidden F&B value still moves the cap rate — the source only
 *          display:none's the row. Callers decide whether to zero fbPct when
 *          the row is hidden; the engine applies whatever it is given.
 *   D5     The 4.5% cap floor and the "high >= low + 0.5%" rule are unreachable
 *          with the shipped CONFIG (proof: port pack §C.6). Both are ported
 *          anyway — they are the guardrail if CONFIG is ever retuned.
 *   D6     Per-key values are rounded twice ($1K then $5K for display).
 *          Preserved; do not collapse into one rounding step.
 *   Dead source code deliberately NOT ported: money(), perKey(), esc(),
 *   `var keyClampFired = false` (:1555).
 *
 * Fixed on port (port pack §0.5 D4): the benchmark bands are keyed by the typed
 * PropertyType enum instead of the raw <option> display string. The values are
 * unchanged, and OCC_BAND_BY_LABEL / ADR_BAND_BY_LABEL / REVPAR_BAND_BY_LABEL
 * preserve the original display-string keying for cross-checking.
 */

/* ---------------------------------------------------------------------------
   Runtime freeze helper
   --------------------------------------------------------------------------- */

/** Recursively Object.freeze()s a literal so the frozen port is frozen at runtime too. */
function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.getOwnPropertyNames(value)) {
      deepFreeze((value as Record<string, unknown>)[key]);
    }
  }
  return value;
}

/* ---------------------------------------------------------------------------
   Types
   --------------------------------------------------------------------------- */

/** CONFIG property-type key. `PropertyTypeKey` is the port pack's §C.1 alias. */
export type PropertyType =
  | "limitedService"
  | "selectService"
  | "fullService"
  | "resortBoutique"
  | "extendedStay";
export type PropertyTypeKey = PropertyType;

/** CONFIG market-tier key. `MarketTierKey` is the port pack's §C.1 alias. */
export type Tier = "gateway" | "secondary" | "suburban" | "tertiary";
export type MarketTierKey = Tier;

/** CONFIG renovation/condition key. `ConditionKey` is the port pack's §C.1 alias. */
export type Condition = "under4" | "base4to8" | "over8";
export type ConditionKey = Condition;

/** CONFIG brand key. `BrandKey` is the port pack's §C.1 alias. */
export type BrandTier = "branded" | "independent";
export type BrandKey = BrandTier;

/** CONFIG land key. */
export type Land = "feeSimple" | "groundLease";
export type LandKey = Land;

/** [low, high] as decimals, e.g. [0.0800, 0.0925] === 8.00%-9.25%. */
export type CapBand = readonly [low: number, high: number];

/** [low, mid, high] display band. `mid` is read only by the pricingPower rule. */
export type Benchmark = readonly [low: number, mid: number, high: number];

export interface CalculatorConfig {
  readonly capRates: Readonly<Record<PropertyType, Readonly<Record<Tier, CapBand>>>>;
  readonly noiMargin: Readonly<Record<PropertyType, number>>;
  readonly roomsToTotal: Readonly<Record<PropertyType, number>>;
  readonly renovationAdj: Readonly<Record<Condition, number>>;
  readonly landAdj: Readonly<Record<Land, number>>;
  readonly brandAdj: Readonly<Record<BrandTier, number>>;
  readonly fbThreshold: number;
  readonly fbHighAdj: number;
}

export interface TypicalFigures {
  readonly occupancy: number;
  readonly adr: number;
}
export type TypicalTable = Readonly<Record<Tier, TypicalFigures>>;

export type AdviceCode =
  | "pip"
  | "ground"
  | "revparTop"
  | "revparLow"
  | "pricingPower"
  | "valueAdd"
  | "independent"
  | "smallKeys"
  | "bigKeys";

export type AdvicePriority = 1 | 2 | 3 | 4;

/** The ctx object the source builds at :1579-1580 and hands to every rule. */
export interface AdviceContext {
  /** CONFIG key (the source carried the raw display string here — see D4). */
  readonly type: PropertyType;
  readonly keys: number;
  /** decimal fraction — carried by the source ctx, read by no rule */
  readonly occ: number;
  /** percent number, e.g. 74 */
  readonly occPct: number;
  readonly adr: number;
  readonly revpar: number;
  /** carried by the source ctx, read by no rule */
  readonly tier: Tier;
  /** NOTE: the ctx uses "indep", NOT the BrandTier value "independent". */
  readonly brand: "branded" | "indep";
  readonly cond: "new" | "base" | "old";
  readonly ground: boolean;
  /** OCC_BAND */
  readonly ob: Benchmark;
  /** ADR_BAND */
  readonly ab: Benchmark;
  /** REVPAR_BAND */
  readonly rb: Benchmark;
}

/** A shipped ADVICE rule. */
export interface AdviceRule {
  readonly code: AdviceCode;
  readonly prio: AdvicePriority;
  readonly test: (c: AdviceContext) => boolean;
  /** developer-authored rich text; may contain <strong> / <em> */
  readonly html: string;
}

/** A rendered advice entry. The fallback entry has no code and no prio (:1592). */
export interface AdviceEntry {
  readonly code?: AdviceCode;
  readonly prio?: AdvicePriority;
  readonly html: string;
}

export type CtaVariant = "valueAdd" | "runningWell" | "default";

export interface ValuationInput {
  /** CONFIG key, resolved from the UI select before entering this function. */
  propertyType: PropertyType;
  /** Rentable rooms. Must be >= 1 — the caller enforces this (validate step 2). */
  keys: number;
  /** Occupancy as a PERCENT number, 0-100 (e.g. 74, not 0.74). Not clamped here. */
  occupancyPct: number;
  /** Average Daily Rate in dollars. */
  adr: number;
  tier: Tier;
  brand: BrandTier;
  condition: Condition;
  /** true when the land is ground-leased. */
  groundLease: boolean;
  /** F&B share as a PERCENT number, 0-100. 0 / undefined = not supplied. */
  fbPct?: number;
  /** Annual NOI in dollars. Any value > 0 REPLACES the revenue model. 0 / undefined = derive. */
  noiOverride?: number;
  /** Free text; only a /\d{5}/ match is ever used, and only for the lead summary. */
  marketZipRaw?: string;
  /**
   * Latched true once typical figures were auto-filled. The engine echoes it;
   * it drives one caveat sentence (see resultContextHtml). Source :1405 latches
   * it for the whole session and never resets it.
   */
  usedDefaults?: boolean;
  /**
   * Optional raw <option> display strings for the lead prefill, which the source
   * read straight off the selects (:1602, :1606-1608). Default to the canonical
   * shipped labels below.
   */
  propertyTypeLabel?: string;
  tierLabel?: string;
  conditionLabel?: string;
  brandLabel?: string;
}

export interface ValuationDisplay {
  /** "$22.6M – $26.2M" -> #resRange */
  range: string;
  /** "$147" -> #resRevpar */
  revpar: string;
  /** "$23,037" or "$28,409*" -> #resNoi */
  noiPerKey: string;
  /** "$255K – $295K" -> #resPerKey */
  perKey: string;
  /** "7.8% – 9.0%" -> #resCap */
  capRange: string;
}

/** Was window.__kwcEstimate (:1600-1611). Never mirrored onto window in this port. */
export interface ValuationPrefill {
  /** "$22,550,000 – $26,150,000" */
  range: string;
  /** "Full-Service · 88 keys" [+ " · 90210"] */
  summary: string;
  revpar: string;
  /** "$23,037/key" */
  noiPerKey: string;
  /** "7.8%–9.0%" — en dash with NO spaces (byte-different from display.capRange) */
  capRangeUsed: string;
  marketTier: string;
  condition: string;
  brandFlag: string;
  /** tag-stripped, sliced to 140 chars, no ellipsis appended */
  topAdvice: string;
  insightCodes: readonly AdviceCode[];
}

export interface ValuationResult {
  // --- derived economics ---
  revpar: number;
  /** occupancy as a decimal fraction */
  occ: number;
  /** occupancy echoed as the percent number */
  occupancyPct: number;
  adr: number;
  /** null when the NOI override path is taken */
  roomRevenue: number | null;
  /** null when the NOI override path is taken */
  totalRevenue: number | null;
  noi: number;
  /** 0 when keys <= 0 (the source's only guard, :1532) */
  noiPerKey: number;
  usedNoiOverride: boolean;
  usedDefaults: boolean;

  // --- cap band ---
  /** the band before adjusters */
  baseCapBand: CapBand;
  /** total additive adjustment as a decimal (can be negative) */
  capAdj: number;
  /** the same adjustment in basis points, e.g. -25 */
  capAdjBps: number;
  /** post-adjuster, post-floor */
  capLow: number;
  /** post-adjuster, post-min-spread */
  capHigh: number;
  capFloorFired: boolean;
  capSpreadFired: boolean;

  // --- value ---
  /** unrounded: noi / capHigh */
  valueLow: number;
  /** unrounded: noi / capLow */
  valueHigh: number;
  totalLow: number;
  totalHigh: number;
  /** round((valueLow / keys) / 1000) * 1000 — unguarded divide, see D1/D2 */
  perKeyLow: number;
  perKeyHigh: number;

  // --- benchmarks ---
  /** 0..100, pre-toFixed(0) */
  occBandPct: number;
  /** 0..100, pre-toFixed(0) */
  revparBandPct: number;
  occBand: Benchmark;
  revparBand: Benchmark;
  adrBand: Benchmark;

  // --- insights ---
  /** ALL matches, prio-sorted, declaration-order tie-break */
  firedCodes: readonly AdviceCode[];
  /** the first two fired rules, or [FALLBACK_ADVICE] when none fired */
  topAdvice: readonly AdviceEntry[];
  ctaVariant: CtaVariant;
  /** the CTA copy for ctaVariant */
  ctaLine: string;
  /** the exact ctx the rules were evaluated against */
  adviceContext: AdviceContext;

  // --- strings ---
  display: ValuationDisplay;
  prefill: ValuationPrefill;
  /** the 5-digit ZIP pulled out of marketZipRaw, or "" */
  zip: string;
}

/* ---------------------------------------------------------------------------
   §A.1 CONFIG — index.html:1356-1375
   --------------------------------------------------------------------------- */

export const CONFIG = deepFreeze({
  // Cap-rate bands [low, high] by property type -> market tier. Low cap = higher value.
  capRates: {
    limitedService: { gateway: [0.07, 0.0825], secondary: [0.0775, 0.09], suburban: [0.0825, 0.0975], tertiary: [0.0925, 0.11] },
    selectService: { gateway: [0.0675, 0.08], secondary: [0.075, 0.0875], suburban: [0.08, 0.095], tertiary: [0.09, 0.105] },
    fullService: { gateway: [0.0625, 0.075], secondary: [0.0725, 0.085], suburban: [0.08, 0.0925], tertiary: [0.09, 0.105] },
    resortBoutique: { gateway: [0.06, 0.075], secondary: [0.07, 0.085], suburban: [0.08, 0.095], tertiary: [0.0875, 0.105] },
    extendedStay: { gateway: [0.0675, 0.08], secondary: [0.075, 0.0875], suburban: [0.08, 0.0925], tertiary: [0.0875, 0.1025] },
  },
  // Stabilized NOI as % of total revenue, by property type (used unless actual NOI entered).
  noiMargin: { limitedService: 0.38, selectService: 0.34, fullService: 0.28, resortBoutique: 0.3, extendedStay: 0.4 },
  // Rooms revenue / this = total revenue (full-service/resort earn more non-rooms revenue).
  roomsToTotal: { limitedService: 0.95, selectService: 0.88, fullService: 0.65, resortBoutique: 0.62, extendedStay: 0.96 },
  // Optional refiners — additive bps to BOTH ends of the cap band (positive = lower value).
  renovationAdj: { under4: -0.005, base4to8: 0.0, over8: 0.0075 },
  landAdj: { feeSimple: 0.0, groundLease: 0.01 },
  brandAdj: { branded: -0.0025, independent: 0.0025 },
  fbThreshold: 0.25,
  fbHighAdj: 0.0025,
} as const) satisfies CalculatorConfig;

/** Hard-coded inside calculate() in the source; named here so tests can cite them. */
export const CAP_FLOOR = 0.045;
export const MIN_CAP_SPREAD = 0.005;
export const TOTAL_ROUND_INCREMENT = 50_000;
export const PER_KEY_ROUND_INCREMENT = 1_000;
export const PER_KEY_DISPLAY_INCREMENT = 5_000;
export const SUB_MILLION_ROUND_INCREMENT = 5_000;
export const DAYS_PER_YEAR = 365;

/* ---------------------------------------------------------------------------
   §A.2 TYPICAL — index.html:1376-1382. Keyed by TIER, never by property type.
   --------------------------------------------------------------------------- */

export const TYPICAL = deepFreeze({
  gateway: { occupancy: 0.74, adr: 245 },
  secondary: { occupancy: 0.7, adr: 165 },
  suburban: { occupancy: 0.66, adr: 125 },
  tertiary: { occupancy: 0.58, adr: 95 },
} as const) satisfies TypicalTable;

/* ---------------------------------------------------------------------------
   Enumerations + the shipped <option> labels (index.html:938-942, 949-953,
   961-964, 977-981, 987-989). Byte-exact — the ellipsis is U+2026 and the
   condition dashes are U+2013.
   --------------------------------------------------------------------------- */

export const PROPERTY_TYPES = deepFreeze([
  "limitedService",
  "selectService",
  "fullService",
  "resortBoutique",
  "extendedStay",
] as const) satisfies readonly PropertyType[];

export const TIERS = deepFreeze(["gateway", "secondary", "suburban", "tertiary"] as const) satisfies readonly Tier[];
export const CONDITIONS = deepFreeze(["under4", "base4to8", "over8"] as const) satisfies readonly Condition[];
export const LANDS = deepFreeze(["feeSimple", "groundLease"] as const) satisfies readonly Land[];
export const BRANDS = deepFreeze(["branded", "independent"] as const) satisfies readonly BrandTier[];

/** Every shipped #cType option, in source order. */
export const PROPERTY_TYPE_OPTIONS = deepFreeze([
  { value: "limitedService", label: "Limited-Service" },
  { value: "selectService", label: "Select-Service" },
  { value: "fullService", label: "Full-Service" },
  { value: "resortBoutique", label: "Resort / Boutique" },
  { value: "extendedStay", label: "Extended-Stay" },
] as const) satisfies readonly { value: PropertyType; label: string }[];

/** Every shipped #cTier option, in source order. */
export const TIER_OPTIONS = deepFreeze([
  { value: "gateway", label: "Gateway / urban core (NYC, SF, LA, Miami…)" },
  { value: "secondary", label: "Strong secondary / resort destination" },
  { value: "suburban", label: "Standard / suburban" },
  { value: "tertiary", label: "Tertiary / rural / highway" },
] as const) satisfies readonly { value: Tier; label: string }[];

/** Every shipped #cBrandFlag option. NOTE: soft-brand resolves to `branded`. */
export const BRAND_OPTIONS = deepFreeze([
  { value: "branded", label: "Branded (franchise)" },
  { value: "branded", label: "Soft-brand / lifestyle" },
  { value: "independent", label: "Independent / unbranded" },
] as const) satisfies readonly { value: BrandTier; label: string }[];

/** Every shipped #cCond option. NOTE: two labels resolve to `over8`. */
export const CONDITION_OPTIONS = deepFreeze([
  { value: "under4", label: "Renovated / built in last 3 yrs" },
  { value: "base4to8", label: "4–8 yrs (baseline)" },
  { value: "over8", label: "9–15 yrs" },
  { value: "over8", label: "15+ yrs / renovation (PIP) due" },
] as const) satisfies readonly { value: Condition; label: string }[];

/** Every shipped #cGround option. */
export const LAND_OPTIONS = deepFreeze([
  { value: "feeSimple", label: "Fee Simple (own the land)" },
  { value: "groundLease", label: "Ground lease" },
] as const) satisfies readonly { value: Land; label: string }[];

/**
 * Canonical label per key = the FIRST shipped option label that resolves to it.
 * Used only when a caller does not pass an explicit raw label for the prefill.
 */
export const PROPERTY_TYPE_LABEL = deepFreeze({
  limitedService: "Limited-Service",
  selectService: "Select-Service",
  fullService: "Full-Service",
  resortBoutique: "Resort / Boutique",
  extendedStay: "Extended-Stay",
} as const) satisfies Readonly<Record<PropertyType, string>>;

export const TIER_LABEL = deepFreeze({
  gateway: "Gateway / urban core (NYC, SF, LA, Miami…)",
  secondary: "Strong secondary / resort destination",
  suburban: "Standard / suburban",
  tertiary: "Tertiary / rural / highway",
} as const) satisfies Readonly<Record<Tier, string>>;

export const BRAND_LABEL = deepFreeze({
  branded: "Branded (franchise)",
  independent: "Independent / unbranded",
} as const) satisfies Readonly<Record<BrandTier, string>>;

export const CONDITION_LABEL = deepFreeze({
  under4: "Renovated / built in last 3 yrs",
  base4to8: "4–8 yrs (baseline)",
  over8: "9–15 yrs",
} as const) satisfies Readonly<Record<Condition, string>>;

export const LAND_LABEL = deepFreeze({
  feeSimple: "Fee Simple (own the land)",
  groundLease: "Ground lease",
} as const) satisfies Readonly<Record<Land, string>>;

/* ---------------------------------------------------------------------------
   §A.3 UI display-string -> CONFIG-key maps — index.html:1384-1394.
   Kept as a compatibility shim for URL/query prefill; the typed selects should
   carry the enum value directly.
   --------------------------------------------------------------------------- */

/** index.html:1385-1391 */
export function typeKey(v: string): PropertyType {
  if (/limited/i.test(v)) return "limitedService";
  if (/select/i.test(v)) return "selectService";
  if (/resort|boutique/i.test(v)) return "resortBoutique";
  if (/extended/i.test(v)) return "extendedStay";
  return "fullService";
}

/** index.html:1392 */
export function tierKey(v: string): Tier {
  return /gateway/i.test(v)
    ? "gateway"
    : /secondary|resort dest/i.test(v)
      ? "secondary"
      : /tertiary|rural|highway/i.test(v)
        ? "tertiary"
        : "suburban";
}

/** index.html:1393 — soft-brand maps to the branded band. */
export function brandKeyCfg(v: string): BrandTier {
  return /independent|unbranded/i.test(v) ? "independent" : "branded";
}

/** index.html:1394 — `/9.?15/` matches "9–15" because `.` matches the en dash. */
export function condKeyCfg(v: string): Condition {
  return /last 3|<\s*3|renovated/i.test(v)
    ? "under4"
    : /9.?15/i.test(v) || /15\+|pip/i.test(v)
      ? "over8"
      : "base4to8";
}

/** index.html:1512 — ground was resolved by an inline regex inside calculate(). */
export function groundLeaseFromLabel(v: string): boolean {
  return /ground lease/i.test(v);
}

/** Descriptive aliases for the four source-named shims above. */
export const propertyTypeFromLabel = typeKey;
export const tierFromLabel = tierKey;
export const brandFromLabel = brandKeyCfg;
export const conditionFromLabel = condKeyCfg;

/* ---------------------------------------------------------------------------
   §A.4 Benchmark bands — index.html:1400-1402.
   Display/education only; NOT part of the valuation. Each band is [low, mid, high].
   Re-keyed to the PropertyType enum (port pack D4); the *_BY_LABEL views keep
   the source's display-string keying.
   --------------------------------------------------------------------------- */

export const OCC_BAND = deepFreeze({
  limitedService: [58, 68, 78],
  selectService: [62, 72, 80],
  fullService: [60, 70, 78],
  resortBoutique: [55, 65, 75],
  extendedStay: [70, 78, 85],
} as const) satisfies Readonly<Record<PropertyType, Benchmark>>;

export const ADR_BAND = deepFreeze({
  limitedService: [95, 135, 190],
  selectService: [130, 175, 240],
  fullService: [175, 240, 360],
  resortBoutique: [220, 340, 650],
  extendedStay: [110, 150, 210],
} as const) satisfies Readonly<Record<PropertyType, Benchmark>>;

export const REVPAR_BAND = deepFreeze({
  limitedService: [55, 90, 140],
  selectService: [80, 125, 185],
  fullService: [105, 165, 275],
  resortBoutique: [120, 210, 460],
  extendedStay: [80, 120, 175],
} as const) satisfies Readonly<Record<PropertyType, Benchmark>>;

function bandsByLabel(
  bands: Readonly<Record<PropertyType, Benchmark>>,
): Readonly<Record<string, Benchmark>> {
  const out: Record<string, Benchmark> = {};
  for (const option of PROPERTY_TYPE_OPTIONS) out[option.label] = bands[option.value];
  return deepFreeze(out);
}

/** The source's original keying: OCC_BAND["Full-Service"] etc. */
export const OCC_BAND_BY_LABEL = bandsByLabel(OCC_BAND);
export const ADR_BAND_BY_LABEL = bandsByLabel(ADR_BAND);
export const REVPAR_BAND_BY_LABEL = bandsByLabel(REVPAR_BAND);

/* ---------------------------------------------------------------------------
   §A.5 Helpers, formatters and rounding — index.html:1396, 1403, 1413-1478
   --------------------------------------------------------------------------- */

/** index.html:1396 */
export function roundTo(value: number, increment: number): number {
  return Math.round(value / increment) * increment;
}

/** index.html:1403 */
export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** index.html:1422 — "22550000" -> "22,550,000" */
export function groupInt(intStr: string): string {
  return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * index.html:1418-1421 (`num`). Deliberately lossy: strips everything but digits
 * and dots, then parseFloat. Empty / unparseable -> 0. NEVER returns NaN.
 */
export function parseNumericField(raw: string | number | null | undefined): number {
  const v = parseFloat(String(raw ?? "").replace(/[^0-9.]/g, ""));
  return isNaN(v) ? 0 : v;
}

/** index.html:1424-1433 (`clean`): "digits + at most one dot + at most `dec` decimals". */
export function cleanNumericInput(raw: string, dec: number): string {
  let out = String(raw).replace(/[^0-9.]/g, "");
  const firstDot = out.indexOf(".");
  if (firstDot !== -1) {
    // only the first dot survives
    out = out.slice(0, firstDot + 1) + out.slice(firstDot + 1).replace(/\./g, "");
    if (dec === 0) {
      out = out.slice(0, firstDot); // ints: drop the dot entirely
    } else {
      const p = out.split(".");
      out = p[0] + "." + (p[1] || "").slice(0, dec); // cap decimals
    }
  }
  return out;
}

export interface FieldFormatOptions {
  readonly dec: number;
  readonly max?: number;
}

/** index.html:1448-1452 (`fmtMap`) — the three data-fmt behaviours. */
export const FIELD_FORMATS = deepFreeze({
  int: { dec: 0 },
  money: { dec: 2 },
  pct: { dec: 1, max: 100 },
} as const) satisfies Readonly<Record<string, FieldFormatOptions>>;

export type FieldFormat = keyof typeof FIELD_FORMATS;

/**
 * index.html:1434-1446 (`formatField`), rewritten DOM-free: takes the current
 * field text, returns the text the field should hold. `pct` hard-caps at 100 on
 * every keystroke — occupancy clamp layer 1 (port pack §B.7).
 */
export function formatNumericField(value: string, opts: FieldFormatOptions): string {
  const hadDotEnd = /\.$/.test(value); // preserve a trailing dot mid-typing
  let raw = cleanNumericInput(value, opts.dec);
  if (raw === "" || raw === ".") return raw;
  const n = parseFloat(raw);
  if (isNaN(n)) return "";
  if (opts.max != null && n > opts.max) raw = String(opts.max);
  const parts = raw.split(".");
  const intPart = groupInt(parts[0].replace(/^0+(?=\d)/, "")); // strip leading zeros, group
  let out = intPart || "0";
  if (parts.length > 1 || (hadDotEnd && opts.dec > 0)) out += "." + (parts[1] || "");
  return out;
}

/** index.html:1456-1461 — the blur tidy: trim a trailing dot, then re-format. */
export function blurNumericField(value: string, opts: FieldFormatOptions): string {
  const trimmed = value.replace(/\.$/, "");
  if (trimmed === "") return trimmed;
  return formatNumericField(trimmed, opts);
}

/** index.html:1471 — full comma-grouped dollars, e.g. "$1,000,000". */
export function dollarsFull(v: number): string {
  return "$" + groupInt(String(Math.round(v)));
}

/** index.html:1473-1476 — >= $1M to one decimal "M"; else nearest $5K printed as "K". */
export function roundTotal(v: number): string {
  if (v >= 1e6) return "$" + (Math.round(v / 1e5) / 10).toFixed(1) + "M";
  return "$" + Math.round(v / 5000) * 5 + "K";
}

/** index.html:1477 — nearest $5K printed as "K". Its input is already $1K-rounded (D6). */
export function roundKey(v: number): string {
  return "$" + Math.round(v / 5000) * 5 + "K";
}

/** index.html:1478 — bar fill 0..100 from a [low, mid, high] band. `mid` is not a landmark. */
export function pctBar(val: number, band: Benchmark): number {
  return clamp((val - band[0]) / (band[2] - band[0]), 0, 1) * 100;
}

/**
 * index.html:1562 — a cap decimal as its display percent, one decimal place.
 * FLOAT TRAP, load-bearing: (0.0725 * 100).toFixed(1) === "7.2", not "7.3".
 * The source ships "7.2%"; printing "7.3%" would be a regression, not a fix.
 */
export function capPct(cap: number): string {
  return (cap * 100).toFixed(1);
}

/** display.capRange uses " – " (spaces); prefill.capRangeUsed uses "–" (none). */
export function formatCapRange(low: number, high: number, separator = " – "): string {
  return capPct(low) + "%" + separator + capPct(high) + "%";
}

/** index.html:1575 — the occupancy bar's sub-label, e.g. "60–78% typical". */
export function formatOccBandSub(band: Benchmark): string {
  return band[0] + "–" + band[2] + "% typical";
}

/** index.html:1576 — the RevPAR bar's sub-label, e.g. "$105–$275 typical". */
export function formatRevparBandSub(band: Benchmark): string {
  return "$" + band[0] + "–$" + band[2] + " typical";
}

/* ---------------------------------------------------------------------------
   §A.6 ADVICE — index.html:1480-1500. Declaration order IS the priority
   tie-break; do not reorder. Show the top 2 by priority.
   --------------------------------------------------------------------------- */

export const ADVICE = deepFreeze([
  {
    code: "pip",
    prio: 1,
    test: (c: AdviceContext) => c.cond === "old",
    html: "A near-term renovation (a brand-required <strong>PIP</strong>) is the most common reason a quoted price gets re-traded. Pricing it correctly up front protects your number — this is where a BOV earns its keep.",
  },
  {
    code: "ground",
    prio: 1,
    test: (c: AdviceContext) => c.ground,
    html: "A ground lease can reduce value 15–30% depending on the remaining term — we'd need the lease itself to price it precisely. It's the first thing a buyer will ask about, so it's worth getting ahead of.",
  },
  {
    code: "revparTop",
    prio: 2,
    test: (c: AdviceContext) => c.revpar >= c.rb[2],
    html: "Your RevPAR is in the top tier for this asset type — buyers compete on hotels like this and price them aggressively, at a tighter cap. These are strong, sellable numbers.",
  },
  {
    code: "revparLow",
    prio: 2,
    test: (c: AdviceContext) => c.revpar <= c.rb[0] && c.revpar > 0,
    html: "Your RevPAR is below the typical band for this type — and that gap is upside a value-add buyer will pay to capture. Buyers underwrite the <em>stabilized</em> number, not just today's.",
  },
  {
    code: "pricingPower",
    prio: 3,
    test: (c: AdviceContext) => c.occPct >= c.ob[2] && c.adr <= c.ab[1],
    html: "You're filling rooms but leaving rate on the table — high occupancy with a below-typical ADR often signals unrealized pricing power. Even a modest rate lift drops almost entirely to the bottom line.",
  },
  {
    code: "valueAdd",
    prio: 3,
    test: (c: AdviceContext) => c.occPct <= c.ob[0],
    html: "Soft occupancy is usually demand or distribution upside, not a low ceiling. Buyers price the stabilized occupancy a good operator can reach — a credible path there is worth real money.",
  },
  {
    code: "independent",
    prio: 3,
    test: (c: AdviceContext) => c.brand === "indep",
    html: "Independent hotels typically trade ~50–100bps wider on cap than branded — a well-fitted flag or soft-brand can lift value roughly 8–15%. Almost always worth pricing both ways before you sell as-is.",
  },
  {
    code: "smallKeys",
    prio: 4,
    test: (c: AdviceContext) => c.keys < 60,
    html: "A hotel this size sits in the sweet spot for SBA-financed and owner-operator buyers — a deep, motivated pool that prices differently than the funds chasing larger assets. Targeting the right buyers is often worth more than the headline range.",
  },
  {
    code: "bigKeys",
    prio: 4,
    test: (c: AdviceContext) => c.keys >= 150,
    html: "At this size you're in institutional-buyer territory — larger buyer pools, often tighter pricing. Positioning to the right capital matters.",
  },
] as const) satisfies readonly AdviceRule[];

/** index.html:1592 — rendered when zero rules fire. No `code`, so it never reaches firedCodes. */
export const FALLBACK_ADVICE = deepFreeze({
  html: "Your numbers land in a healthy, sellable range for this asset type — no single red flag, no obvious gap. Hotels like this reward a disciplined, well-run process more than any one pricing trick. The next move is matching the right buyers to your story.",
} as const) satisfies AdviceEntry;

/** index.html:1585-1589 */
export const CTA_LINES = deepFreeze({
  valueAdd: "Your numbers tell a value-add story — let's pressure-test the upside before you list.",
  runningWell: "You're running this well — let's make sure the pricing captures it.",
  default: "Request a written BOV to turn this estimate into a real pricing strategy.",
} as const) satisfies Readonly<Record<CtaVariant, string>>;

/** The fired codes that select the value-add CTA (index.html:1585). */
export const VALUE_ADD_CTA_CODES = deepFreeze(["revparLow", "valueAdd", "independent"] as const) satisfies readonly AdviceCode[];

/* ---------------------------------------------------------------------------
   Canonical result copy — index.html:1565-1570. Exported as pieces so the React
   layer can render nodes instead of innerHTML (port pack §C.9 note 4).
   --------------------------------------------------------------------------- */

export const RESULT_DISCLAIMER =
  "Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value.";

export const RESULT_CONTEXT_BASE =
  "A full BOV includes verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation — request a written BOV below.";

export const RESULT_CONTEXT_DEFAULTS_NOTE =
  "This range uses typical figures for your market tier; your real numbers will sharpen it.";

export const RESULT_CONTEXT_NOI_NOTE = "Using your actual NOI — the most accurate input you can give us.";

/** The only blocking error in the whole calculator (index.html:1623). */
export const KEYS_REQUIRED_ERROR = "How many rentable rooms does the hotel have?";

/** index.html:1663 */
export const TYPICAL_FIGURES_NOTE =
  "Filled with typical figures for your market tier — adjust if you know your own.";

/**
 * index.html:1567-1570, reproduced byte-exact for parity tests. The React layer
 * should compose the three constants above into nodes rather than use this.
 */
export function resultContextHtml(usedDefaults: boolean, usedNoiOverride: boolean): string {
  return (
    RESULT_CONTEXT_BASE +
    (usedDefaults ? " <em>" + RESULT_CONTEXT_DEFAULTS_NOTE + "</em>" : "") +
    (usedNoiOverride ? " <em>" + RESULT_CONTEXT_NOI_NOTE + "</em>" : "")
  );
}

/* ---------------------------------------------------------------------------
   Cap-rate mechanics — index.html:1538-1548
   --------------------------------------------------------------------------- */

export interface CapAdjustmentInput {
  condition: Condition;
  groundLease: boolean;
  brand: BrandTier;
  /** PERCENT number, 0-100 */
  fbPct?: number;
}

/**
 * index.html:1539-1543. Additive bps to BOTH ends of the band. The summation
 * order is load-bearing for float reproducibility: renovation, land, brand, F&B.
 * The source's `|| 0` guards are unnecessary here because the maps are total.
 */
export function capAdjustment(input: CapAdjustmentInput, config: CalculatorConfig = CONFIG): number {
  const fb = (input.fbPct ?? 0) / 100; // the source stored F&B as a decimal
  let adj = 0;
  adj += config.renovationAdj[input.condition];
  adj += config.landAdj[input.groundLease ? "groundLease" : "feeSimple"];
  adj += config.brandAdj[input.brand];
  if (fb > 0 && fb > config.fbThreshold) adj += config.fbHighAdj;
  return adj;
}

export interface CapClampResult {
  capLow: number;
  capHigh: number;
  floorFired: boolean;
  spreadFired: boolean;
}

/**
 * index.html:1547-1548. Floor first, then the minimum spread — the spread rule
 * reads the POST-floor capLow. Neither line can fire with the shipped CONFIG
 * (port pack §C.6); both are ported as the guardrail if CONFIG is retuned.
 */
export function applyCapClamps(capLow: number, capHigh: number): CapClampResult {
  const flooredLow = Math.max(capLow, CAP_FLOOR);
  const spreadHigh = Math.max(capHigh, flooredLow + MIN_CAP_SPREAD);
  return {
    capLow: flooredLow,
    capHigh: spreadHigh,
    floorFired: flooredLow !== capLow,
    spreadFired: spreadHigh !== capHigh,
  };
}

/** The adjusted, clamped low cap for one input combination — the §C.6 invariant probe. */
export function computeAdjustedCapLow(
  propertyType: PropertyType,
  tier: Tier,
  condition: Condition,
  land: Land,
  brand: BrandTier,
  fbPct = 0,
  config: CalculatorConfig = CONFIG,
): number {
  const band = config.capRates[propertyType][tier];
  return band[0] + capAdjustment({ condition, groundLease: land === "groundLease", brand, fbPct }, config);
}

/* ---------------------------------------------------------------------------
   §A.10 typicalFor — index.html:1639-1644
   --------------------------------------------------------------------------- */

/** Typical occupancy (as a PERCENT number) and ADR for a market tier. */
export function typicalFor(tier: Tier, typical: TypicalTable = TYPICAL): { occ: number; adr: number } {
  const v = typical[tier] || typical.suburban;
  return { occ: Math.round(v.occupancy * 100), adr: v.adr };
}

/**
 * index.html:1632 — occupancy clamp layer 2 (validate step 3). Upper bound only;
 * the source never clamps the lower bound.
 */
export function clampOccupancyPct(occPct: number): number {
  return occPct > 100 ? 100 : occPct;
}

/** index.html:1622-1624 — the step-2 gate. */
export function keysAreValid(keys: number): boolean {
  return !(!keys || keys < 1);
}

/** index.html:1515 — the first run of 5 consecutive digits anywhere, else "". */
export function extractZip(raw: string | null | undefined): string {
  return (String(raw ?? "").match(/\d{5}/) || [""])[0];
}

/* ---------------------------------------------------------------------------
   §A.7 calculate() — index.html:1502-1612, DOM removed
   --------------------------------------------------------------------------- */

/** index.html:1599 — strip every tag, then hard-slice to 140 chars. No ellipsis. */
function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export function calculate(input: ValuationInput, config: CalculatorConfig = CONFIG): ValuationResult {
  const propertyType = input.propertyType;
  const keys = input.keys;
  const occPct = input.occupancyPct; // percent number — calculate() does NOT clamp
  const occ = occPct / 100;
  const adr = input.adr;
  const tier = input.tier;
  const brandCfg = input.brand;
  const condCfg = input.condition;
  const ground = input.groundLease;
  const fbPct = (input.fbPct ?? 0) / 100; // as decimal
  const noiOverride = input.noiOverride ?? 0;
  const usedDefaults = input.usedDefaults ?? false;
  const zip = extractZip(input.marketZipRaw);

  // ctx keys used by the insights engine (kept stable) — :1518-1519
  const cond: AdviceContext["cond"] = condCfg === "over8" ? "old" : condCfg === "under4" ? "new" : "base";
  const brand: AdviceContext["brand"] = brandCfg === "independent" ? "indep" : "branded";

  const revpar = adr * occ;

  // 1. NOI — actual if provided, else build it from rooms revenue. :1525-1531
  let noi: number;
  let usedNoiOverride = false;
  let roomRevenue: number | null = null;
  let totalRevenue: number | null = null;
  if (noiOverride > 0) {
    noi = noiOverride;
    usedNoiOverride = true;
  } else {
    roomRevenue = keys * adr * DAYS_PER_YEAR * occ;
    totalRevenue = roomRevenue / config.roomsToTotal[propertyType];
    noi = totalRevenue * config.noiMargin[propertyType];
  }
  const noiPerKey = keys > 0 ? noi / keys : 0; // :1532

  // 2. Base cap band by type + tier. :1535-1536
  const baseCapBand = config.capRates[propertyType][tier];

  // 3. Optional refiner adjusters (additive bps to both ends). :1539-1544
  const capAdj = capAdjustment({ condition: condCfg, groundLease: ground, brand: brandCfg, fbPct: input.fbPct }, config);
  const adjustedLow = baseCapBand[0] + capAdj;
  const adjustedHigh = baseCapBand[1] + capAdj;

  // Floor the cap so adjusters can't drive it absurdly low. :1547-1548
  const clamps = applyCapClamps(adjustedLow, adjustedHigh);
  const capLow = clamps.capLow;
  const capHigh = clamps.capHigh;

  // 4. Value range (low cap -> high value). 5. Per key. :1551-1554
  const valueHigh = noi / capLow;
  const valueLow = noi / capHigh;
  const totalHigh = roundTo(valueHigh, TOTAL_ROUND_INCREMENT);
  const totalLow = roundTo(valueLow, TOTAL_ROUND_INCREMENT);
  // Unguarded divide by keys — D1/D2. Preserved exactly, including the $1K
  // rounding that roundKey() then re-rounds to $5K (D6).
  const perKeyHigh = Math.round(valueHigh / keys / PER_KEY_ROUND_INCREMENT) * PER_KEY_ROUND_INCREMENT;
  const perKeyLow = Math.round(valueLow / keys / PER_KEY_ROUND_INCREMENT) * PER_KEY_ROUND_INCREMENT;

  // Benchmark bars. :1573-1576
  const occBand = OCC_BAND[propertyType];
  const revparBand = REVPAR_BAND[propertyType];
  const adrBand = ADR_BAND[propertyType];
  const occBandPct = pctBar(occPct, occBand);
  const revparBandPct = pctBar(revpar, revparBand);

  // Insights. :1579-1596
  const adviceContext: AdviceContext = {
    type: propertyType,
    keys,
    occ,
    occPct,
    adr,
    revpar,
    tier,
    brand,
    cond,
    ground,
    rb: revparBand,
    ob: occBand,
    ab: adrBand,
  };

  const fired = ADVICE.map((rule, index) => ({ rule, index }))
    .filter(({ rule }) => {
      // The source wrapped each test in try/catch and treated a throw as false.
      try {
        return rule.test(adviceContext);
      } catch {
        return false;
      }
    })
    // Array.prototype.sort is stable, so declaration order breaks prio ties.
    // The explicit index tie-break makes that guarantee independent of engine.
    .sort((a, b) => a.rule.prio - b.rule.prio || a.index - b.index)
    .map(({ rule }) => rule);

  const firedCodes: AdviceCode[] = fired.map((a) => a.code);
  const top: AdviceEntry[] = fired.slice(0, 2);

  const ctaVariant: CtaVariant = firedCodes.some((c) => VALUE_ADD_CTA_CODES.indexOf(c) !== -1)
    ? "valueAdd"
    : firedCodes.indexOf("revparTop") !== -1
      ? "runningWell"
      : "default";

  // Always show at least one substantive read — if no rule fired, give a balanced one. :1591-1593
  const topAdvice: AdviceEntry[] = top.length ? top : [FALLBACK_ADVICE];

  // Prefill for Calendly + Web3Forms (was window.__kwcEstimate). :1599-1611
  const topAdviceText = topAdvice.length ? stripTags(topAdvice[0].html) : "";
  const typeLabel = input.propertyTypeLabel ?? PROPERTY_TYPE_LABEL[propertyType];

  const noiPerKeyDigits = groupInt(String(Math.round(noiPerKey)));
  const revparDisplay = "$" + Math.round(revpar);

  return {
    revpar,
    occ,
    occupancyPct: occPct,
    adr,
    roomRevenue,
    totalRevenue,
    noi,
    noiPerKey,
    usedNoiOverride,
    usedDefaults,

    baseCapBand,
    capAdj,
    capAdjBps: Math.round(capAdj * 10000),
    capLow,
    capHigh,
    capFloorFired: clamps.floorFired,
    capSpreadFired: clamps.spreadFired,

    valueLow,
    valueHigh,
    totalLow,
    totalHigh,
    perKeyLow,
    perKeyHigh,

    occBandPct,
    revparBandPct,
    occBand,
    revparBand,
    adrBand,

    firedCodes,
    topAdvice,
    ctaVariant,
    ctaLine: CTA_LINES[ctaVariant],
    adviceContext,

    display: {
      range: roundTotal(totalLow) + " – " + roundTotal(totalHigh),
      revpar: revparDisplay,
      noiPerKey: usedNoiOverride ? "$" + noiPerKeyDigits + "*" : "$" + noiPerKeyDigits,
      perKey: roundKey(perKeyLow) + " – " + roundKey(perKeyHigh),
      capRange: formatCapRange(capLow, capHigh, " – "),
    },

    prefill: {
      range: dollarsFull(totalLow) + " – " + dollarsFull(totalHigh),
      summary: typeLabel + " · " + Math.round(keys) + " keys" + (zip ? " · " + zip : ""),
      revpar: revparDisplay,
      noiPerKey: "$" + noiPerKeyDigits + "/key",
      capRangeUsed: formatCapRange(capLow, capHigh, "–"),
      marketTier: input.tierLabel ?? TIER_LABEL[tier],
      condition: input.conditionLabel ?? CONDITION_LABEL[condCfg],
      brandFlag: input.brandLabel ?? BRAND_LABEL[brandCfg],
      topAdvice: topAdviceText.slice(0, 140),
      insightCodes: firedCodes,
    },

    zip,
  };
}
