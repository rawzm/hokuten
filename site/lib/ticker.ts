/**
 * lib/ticker.ts — the one contract the ticker route and the ticker bar share.
 *
 * Ported from ~/Documents/Dino/dino-sites/kwc-dinomonteverde/api/ticker-data.js
 * via docs/port/05-forms-and-ticker.md §D. Governed by
 * PHASE-1-IMPLEMENTATION.md §7 and design-skill reference 05 (Ticker).
 *
 * WHY THIS FILE EXISTS
 * In the source, the series/label table lived in the serverless function
 * (api/ticker-data.js:22-28) AND was retyped by hand into the static fallback
 * markup (index.html:1256-1261). Two copies of the same five strings, in the
 * same order, with nothing keeping them in sync. Here there is one table: the
 * route maps FRED series ids onto labels with it, and the bar renders its
 * server-side placeholder row from it. Reordering it reorders both.
 *
 * NO SECRETS HERE. This module is imported by a Client Component, so it ships to
 * the browser. `FRED_API_KEY` is read in exactly one place on the whole site —
 * `app/api/ticker-data/route.ts` — and never leaves the server. Nothing in this
 * file may ever read `process.env`.
 *
 * COPY OWNERSHIP — reported, not silently decided. `TICKER_LEAD` and
 * `TICKER_REGION_LABEL` are user-visible strings and by content law belong in
 * `site/content/`. `site/content/` has no ticker entry and this agent does not
 * own that directory, so they sit here beside the labels they caption. If the
 * content owner adds a ticker block, move all three (lead, region label, series
 * labels) there and re-export from here.
 */

/* -------------------------------------------------------------------------- */
/*  Series table — the order IS the render order (port doc §D.5)               */
/* -------------------------------------------------------------------------- */

/** The five FRED series the bar carries. Ids are FRED's, not ours. */
export type TickerSeriesId = "DGS10" | "SOFR" | "DPRIME" | "DFEDTARU" | "DFEDTARL";

export type TickerSeries = {
  readonly id: TickerSeriesId;
  /** Display label. Byte-exact from the source — `10-Yr Treasury`, capital Y,
      lowercase r. Not "10-Year", not "10Y". */
  readonly label: string;
};

/**
 * api/ticker-data.js:22-28, unchanged in content and order.
 *
 *   DGS10     → 10-Yr Treasury
 *   SOFR      → SOFR
 *   DPRIME    → Prime Rate (Bank Prime Loan Rate)
 *   DFEDTARU  → Fed Funds Upper (target range upper limit)
 *   DFEDTARL  → Fed Funds Lower (target range lower limit)
 */
export const TICKER_SERIES = [
  { id: "DGS10", label: "10-Yr Treasury" },
  { id: "SOFR", label: "SOFR" },
  { id: "DPRIME", label: "Prime Rate" },
  { id: "DFEDTARU", label: "Fed Funds Upper" },
  { id: "DFEDTARL", label: "Fed Funds Lower" },
] as const satisfies readonly TickerSeries[];

/* -------------------------------------------------------------------------- */
/*  Wire format                                                                */
/* -------------------------------------------------------------------------- */

export type TickerItem = {
  /** One of `TICKER_SERIES[n].label`. */
  label: string;
  /** Formatted rate (`4.32%`) or `TICKER_DASH` when the series had no reading. */
  value: string;
  /** FRED observation date (`YYYY-MM-DD`). Carried for debugging; never rendered. */
  date: string | null;
};

/**
 * `missing_key` — `FRED_API_KEY` is not set in this environment.
 * `fetch_failed` — FRED was reachable-but-not, or every series failed.
 * Both are HTTP 200 with an empty `items` array: the visitor sees dashes and no
 * error, which is the whole point of the contract (port doc §D.1).
 */
export type TickerErrorCode = "missing_key" | "fetch_failed";

export type TickerResponse = {
  /** ISO timestamp of the successful read, or null on a degraded response. */
  updated: string | null;
  items: TickerItem[];
  error?: TickerErrorCode;
};

/** App Router path. Extensionless already — the source needed `cleanUrls` for this. */
export const TICKER_ENDPOINT = "/api/ticker-data";

/* -------------------------------------------------------------------------- */
/*  Display vocabulary                                                         */
/* -------------------------------------------------------------------------- */

/**
 * EM DASH (U+2014), the source's placeholder for "no reading". It is the value
 * the bar renders server-side, the value the route substitutes for a null
 * reading, and the value that stays put when the client fetch fails. One glyph
 * wide in a monospace face, so it occupies a value slot without resizing it.
 */
export const TICKER_DASH = "—";

/** Accessible name for the rail. The bar is a named group, not a landmark. */
export const TICKER_REGION_LABEL = "Live market rates";

/**
 * Lead chip words. Rendered through `MicroLabel`, which composes the brackets
 * and the `micro-label` utility uppercases — so this renders `[ LIVE DATA ]`,
 * matching the source's lead chip (index.html:1256) in the house device.
 */
export const TICKER_LEAD = "Live data";

/* -------------------------------------------------------------------------- */
/*  Formatting + validation                                                    */
/* -------------------------------------------------------------------------- */

/**
 * `4.32%` — two decimals plus a literal percent, exactly api/ticker-data.js:58.
 * Server-side on purpose: the client never does arithmetic on a rate, so it can
 * never disagree with the wire value.
 */
export function formatRate(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * The only value shape the bar will render.
 *
 * This is a WIDTH GUARANTEE as much as a validation: the value slot is sized in
 * `ch` for a fixed number of monospace glyphs, so admitting an arbitrary string
 * would let a malformed payload resize the slot and shift every item after it.
 * Anything that does not match keeps its dash. Range covers -999.99% to 999.99%,
 * which is every rate FRED has ever published for these five series and then
 * some.
 */
const RATE_PATTERN = /^-?\d{1,3}\.\d{2}%$/;

export function isDisplayableRate(value: unknown): value is string {
  return typeof value === "string" && RATE_PATTERN.test(value);
}

/**
 * Read a `/api/ticker-data` payload into `label → value`, defensively.
 *
 * The payload comes from our own route, so this is belt-and-braces rather than
 * a trust boundary — but the bar renders whatever it is handed, at a fixed
 * width, on every page of the site. Unknown labels are dropped (so a future
 * series cannot appear un-designed), non-conforming values are dropped (so the
 * slot width holds), and the first reading for a label wins.
 *
 * Returns an empty map for every failure shape — `missing_key`, `fetch_failed`,
 * a non-JSON body, a truncated response. The caller's rule is simply: an empty
 * map means keep the dashes.
 */
export function readTickerValues(payload: unknown): Map<string, string> {
  const values = new Map<string, string>();
  if (typeof payload !== "object" || payload === null) return values;

  const { items } = payload as { items?: unknown };
  if (!Array.isArray(items)) return values;

  const known = new Set<string>(TICKER_SERIES.map((series) => series.label));

  for (const item of items) {
    if (typeof item !== "object" || item === null) continue;
    const { label, value } = item as { label?: unknown; value?: unknown };
    if (typeof label !== "string" || !known.has(label)) continue;
    if (!isDisplayableRate(value)) continue;
    if (!values.has(label)) values.set(label, value);
  }

  return values;
}
