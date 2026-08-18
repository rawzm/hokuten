/**
 * lib/a100.ts — the a100 Arms public-feed reader behind `/api/public-listings`.
 *
 * GOVERNING DECISION — L8 (docs/LAUNCH-IMPLEMENTATION.md §3.5, "Delivery
 * mechanism", and the L8 row in §1):
 *
 *   "`content/listings.ts` is the rendered source of truth for the three cards;
 *    the proxy is additive. A record the proxy returns that is not one of the
 *    three approved IDs is dropped, logged server-side, and never rendered ...
 *    It fetches the a100 public source SERVER-SIDE, returns only the three
 *    approved listing IDs plus a small public-field whitelist, and prevents the
 *    broader response from reaching browser storage. Never point browser code
 *    back at the a100 endpoint."
 *
 * So: this module runs on the server only. Nothing under `components/` may
 * import it, and no browser code may ever hold the a100 URL. The site keeps
 * rendering `content/listings.ts` — turning this route on is a later, separate
 * decision, which is why the not-configured path is a first-class answer rather
 * than an error.
 *
 * --- The upstream contract, quoted rather than assumed ----------------------
 * docs/port/03-deals.md §B.2 reproduces the kwc source's own comment verbatim
 * (index.html:1747-1765). The endpoint is purpose-built and leak-proof on the
 * a100 side: Dino's deals only, Listed + Onboarded only, allowlisted public
 * fields only, and the confidential `a100_DealSnapshot` is never included.
 *
 *   Response shape: { success, data: [ ...listings ], count }
 *   Record fields read by the kwc renderer: id, name, city, stateCode, service,
 *   brand, rooms, roomCount, price, cap, crexiLink, listingStage, and a photo
 *   under any of photoUrl / photoURL / imageUrl / coverUrl.
 *   Rate limit: 30 req/min/IP (§B.2 constants; the old client cached 5 minutes).
 *
 * We do not trust any of that. "Leak-proof by design" is a property of a system
 * we do not own, so every field below is re-derived, re-typed and re-validated
 * here, and the output object is CONSTRUCTED — never spread from the upstream
 * record. A field that is not in `PUBLIC_LISTING_FIELDS` cannot physically
 * reach the browser, whatever the feed decides to add later.
 *
 * --- Three hard properties of this module -----------------------------------
 * 1. ALLOWLIST OF EXACTLY THREE. `APPROVED_LISTINGS` is the whole world. A
 *    fourth record is dropped, logged (id + reason only), and never returned.
 * 2. IDENTITY COPY IS OURS, NOT THE FEED'S. `name`, `city` and `stateCode` are
 *    served from our own table, so the upstream can never rename a card (this
 *    is also how §3.5's "canonical name: The Florida Gateway" is enforced
 *    against a feed that may still say "The Yulee Gateway"). The feed supplies
 *    only volatile facts — keys, price, cap, Crexi link, photo.
 * 3. THE UPSTREAM ITEM ID NEVER LEAVES THE SERVER. `PublicListing.id` is our
 *    own slug. The Monday item id is used for matching and logging only.
 *
 * --- Why the ids of two of the three are not pinned yet ---------------------
 * `docs/port/03-deals.md` §B.3 carries the verbatim `CREXI_LINKS` map, which is
 * the only committed source of Monday item ids anywhere in this repo. It
 * contains Pocono (`10846884635`) and four listings that §3.5 removes. The
 * Florida Gateway and Quality Suites Cy-Fair are new mandates and their item
 * ids exist in NO source document — P11 is gated on "a100 source endpoint
 * access" precisely because of this. Inventing ids would silently drop the two
 * real records, so identity also resolves by an exact normalised-name alias.
 * When the endpoint is reachable, pin the two ids in `APPROVED_LISTINGS` and
 * the alias path becomes a belt-and-braces fallback. See `resolveApproved` for
 * the precedence rule that stops a name match from overriding a pinned id.
 */

import type { ListingStatus } from "@/lib/status";

/** The ONLY env var this module reads. Server-side; never `NEXT_PUBLIC_*`. */
export const A100_SOURCE_URL_ENV = "A100_PUBLIC_SOURCE_URL";

/**
 * Explicit revalidate window for the upstream fetch (Next Data Cache), in
 * seconds. 300s mirrors the kwc client's own `CACHE_TTL = 5 * 60 * 1000`, which
 * that source comment ties to the endpoint's 30 req/min/IP limit — so the
 * budget is inherited from the endpoint's stated posture, not invented.
 */
export const A100_REVALIDATE_SECONDS = 300;

/** Whole-request upstream budget. A hung a100 must not hold the function open. */
export const A100_TIMEOUT_MS = 6_000;

/**
 * Hard ceiling on the upstream body. Three hotels is a few kB; anything past
 * this is a shape change or a wrong endpoint, and is treated as malformed
 * rather than parsed.
 */
export const A100_MAX_SOURCE_CHARS = 512_000;

/** Edge cache for a good answer: fresh for the revalidate window, stale-servable for an hour. */
export const A100_CACHE_FRESH = `s-maxage=${A100_REVALIDATE_SECONDS}, stale-while-revalidate=3600`;

/**
 * Degraded answers are never cached — a transient a100 outage must not be
 * pinned at the edge for five minutes after a100 recovers. Same reasoning as
 * `app/api/ticker-data/route.ts`.
 */
export const A100_CACHE_DEGRADED = "no-store";

/**
 * Hosts an image URL may come from. EXACT hostname matches only — no suffix
 * matching, so `a100arms.com.example.net` fails. `loadPublicListings` also adds
 * the configured source host, so moving the endpoint does not silently break
 * photos. When a100 confirms its real storage/CDN host, add it HERE and nowhere
 * else; an unlisted host drops the photo, it never drops the listing.
 */
export const A100_IMAGE_HOSTS: readonly string[] = ["a100arms.com", "www.a100arms.com"];

/**
 * Public listing cards may only ever link to Crexi — the ported guard from
 * index.html:1836-1837 (docs/port/03-deals.md §B.4): "The feed value is only
 * trusted when it really is a crexi.com URL, so a public card can never resolve
 * to a100 Arms."
 *
 * Re-implemented here rather than imported from `content/listings.ts`: `lib/`
 * must not depend on `content/`, this guard additionally covers image URLs and
 * rejects embedded credentials, and the render-side guard belongs to the file
 * that renders. The two are deliberate twins — change both or neither.
 */
export const CREXI_HOSTS: readonly string[] = ["crexi.com", "www.crexi.com"];

/** The a100 feed is Listed-stage only; `listed` is our vocabulary for it (lib/status.ts). */
const LISTED: ListingStatus = "listed";

/** Feed stage value that may render. Anything else is dropped (index.html:1858-1860). */
const LISTED_STAGE = "Listed";

/* ----------------------------- the allowlist ------------------------------ */

export type ApprovedListing = {
  /** Our own stable public id. This is what `PublicListing.id` carries. */
  slug: string;
  /** Canonical display name — §3.5. The feed cannot change it. */
  name: string;
  /** Canonical city. */
  city: string;
  /** Canonical USPS state code. */
  stateCode: string;
  /**
   * Known upstream (Monday) item ids. Verbatim from docs/port/03-deals.md §B.3
   * where one exists; empty where no source document carries one — see the file
   * header. NEVER guess a value into this array.
   */
  sourceIds: readonly string[];
  /**
   * Exact `normalizeIdentityName` outputs that identify this property. Every
   * alias here is a name a source document actually uses; nothing speculative.
   */
  nameAliases: readonly string[];
};

/**
 * THE ALLOWLIST — exactly three, per §3.5 / L8 ("No other feed record may
 * render"). Adding a fourth entry is a dated PROJECT-MEMORY decision, not a
 * code change.
 *
 * Output order follows this array, not the feed's, so the payload is stable.
 */
export const APPROVED_LISTINGS: readonly ApprovedListing[] = [
  {
    slug: "the-florida-gateway",
    // §3.5: "The write-up doc calls it 'The Yulee Gateway'; the flyer creative
    // and V2's allowlist both say 'The Florida Gateway.' The allowlist wins."
    name: "The Florida Gateway",
    // City/state only. The street number is `provisional` under D18 and this
    // module publishes no address at all, so D18 cannot leak through the proxy.
    city: "Yulee",
    stateCode: "FL",
    sourceIds: [],
    nameAliases: ["the florida gateway", "florida gateway", "the yulee gateway", "yulee gateway"],
  },
  {
    slug: "quality-suites-houston-nw-cy-fair",
    name: "Quality Suites Houston NW Cy-Fair",
    // §3.5 gives "17550 NW Freeway (US-290), Houston TX (Cypress / Houston NW)".
    // `content/listings.ts` is the rendered truth and independently landed on
    // "Houston"/"TX"; verified identical 2026-08-17. The two must not disagree.
    city: "Houston",
    stateCode: "TX",
    sourceIds: [],
    nameAliases: [
      "quality suites houston nw cy fair",
      "quality suites houston nw cyfair",
      "quality suites houston northwest cy fair",
      "quality suites cy fair",
      "quality suites cyfair",
    ],
  },
  {
    slug: "pocono-mountain-hotel-and-spa",
    name: "Pocono Mountain Hotel & Spa",
    // 38 Lehigh Road, Gouldsboro, PA 18424 (§3.5). City published, street not.
    city: "Gouldsboro",
    stateCode: "PA",
    // Verbatim from the kwc CREXI_LINKS map, docs/port/03-deals.md §B.3.
    sourceIds: ["10846884635"],
    // "&" normalises to "and", so the plan's "&" form and the site's existing
    // "and" form both land on the first alias.
    nameAliases: ["pocono mountain hotel and spa", "pocono mountain hotel spa"],
  },
];

/* --------------------------- public output shape -------------------------- */

/**
 * The field whitelist, as data. `selectApprovedListings` constructs
 * `PublicListing` objects literally — this array exists so the contract is
 * greppable and testable, and so a reviewer can see the entire public surface
 * in one place.
 */
export const PUBLIC_LISTING_FIELDS = [
  "id",
  "name",
  "city",
  "stateCode",
  "status",
  "roomCount",
  "serviceLevel",
  "brand",
  "price",
  "displayCapRate",
  "crexiUrl",
  "photo",
] as const;

export type PublicListingField = (typeof PUBLIC_LISTING_FIELDS)[number];

/**
 * One approved listing, public fields only. Shaped to `lib/types.ts` `Listing`
 * so a future render is a data swap, with two deliberate differences:
 *
 *   - `id` is OUR slug, never the upstream Monday item id (file header, #3).
 *   - no `photoAlt`. Alt text is authored, evidence-gated copy (CLAUDE.md
 *     "Evidence gate"), never feed data. A consumer authors it. Note also that
 *     a returned `photo` is NOT cleared to render: §3.5 records that every
 *     listing photo delivered so far carries Sarhan Hotel Group branding, which
 *     is a CLAUDE.md hard guardrail. Validating the URL says where it may come
 *     from, not that it may ship.
 */
export type PublicListing = {
  id: string;
  name: string;
  city: string;
  stateCode: string;
  status: ListingStatus;
  roomCount?: number;
  serviceLevel?: string;
  brand?: string;
  price?: string;
  displayCapRate?: string;
  crexiUrl?: string;
  photo?: string;
};

/**
 * Why an answer looks the way it does. Every one of these is a 200 with a
 * well-formed body — a consumer that renders `content/listings.ts` (the render
 * contract) must never be handed an exception to reason about.
 *
 *   ok                   - upstream answered, records selected
 *   not_configured       - A100_PUBLIC_SOURCE_URL unset. The DEFAULT today.
 *   source_misconfigured - set, but not a usable https URL
 *   upstream_timeout     - no answer inside A100_TIMEOUT_MS
 *   upstream_unreachable - network/DNS/TLS failure
 *   upstream_unavailable - answered non-2xx
 *   source_error         - answered 200 but reported `success: false`
 *   malformed_source     - unparseable, oversized, or wrong shape
 */
export type PublicListingsStatus =
  | "ok"
  | "not_configured"
  | "source_misconfigured"
  | "upstream_timeout"
  | "upstream_unreachable"
  | "upstream_unavailable"
  | "source_error"
  | "malformed_source";

/** The response body. `count` mirrors the upstream's own `{success,data,count}` idiom. */
export type PublicListingsPayload = {
  status: PublicListingsStatus;
  updated: string | null;
  count: number;
  listings: PublicListing[];
};

/** Why a record was dropped. Logged server-side; never in the response body. */
export type A100DropReason = "malformed_record" | "not_listed" | "not_approved" | "duplicate";

/** A dropped record. `sourceId` only — a feed-supplied name is never logged. */
export type A100Drop = {
  reason: A100DropReason;
  sourceId: string | null;
};

export type A100LogEvent =
  | { kind: "status"; status: PublicListingsStatus; detail?: string }
  | { kind: "drop"; reason: A100DropReason; sourceId: string | null };

export type A100Logger = (event: A100LogEvent) => void;

/* --------------------------- validation helpers --------------------------- */

/** C0 controls + DEL. Escaped, never literal — these must survive a copy/paste. */
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;

/** Combining diacritical marks, stripped after an NFKD fold. */
const COMBINING_MARKS = /[\u0300-\u036F]/g;

/**
 * A short public string, or nothing. Control characters are stripped; angle
 * brackets reject the whole value (React escapes, but a feed value has no
 * business carrying markup and a silent drop beats a rendered oddity).
 */
function publicText(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value.replace(CONTROL_CHARS, "").trim();
  if (!cleaned || cleaned.length > maxLength) return undefined;
  if (cleaned.includes("<") || cleaned.includes(">")) return undefined;
  return cleaned;
}

/** A plausible key count. Rejects 0, negatives, fractions and absurd values. */
function publicRoomCount(value: unknown): number | undefined {
  const parsed = typeof value === "number" ? value : Number.NaN;
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 10_000) return undefined;
  return parsed;
}

/**
 * `lib/types.ts`: "display string, e.g. '$11.00M'. undefined / '$0' -> 'Price on
 * Request'". So a zero price is dropped here and the consumer's existing
 * price-on-request path handles it, exactly as the static seed does.
 */
function publicPrice(value: unknown): string | undefined {
  const text = publicText(value, 32);
  if (!text) return undefined;
  const digits = text.replace(/[^\d.]/g, "");
  if (!digits) return undefined;
  if (!(Number.parseFloat(digits) > 0)) return undefined;
  return text;
}

/** `lib/types.ts`: "render only if a positive number parses". */
function publicCapRate(value: unknown): string | undefined {
  const text = publicText(value, 24);
  if (!text) return undefined;
  const parsed = Number.parseFloat(text.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return text;
}

/** Shared URL hygiene: https only, no embedded credentials, exact host match. */
function validatedUrl(value: unknown, hosts: readonly string[]): string | undefined {
  const text = publicText(value, 512);
  if (!text) return undefined;
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return undefined;
  }
  if (url.protocol !== "https:") return undefined;
  if (url.username || url.password) return undefined;
  if (!hosts.includes(url.hostname.toLowerCase())) return undefined;
  return url.toString();
}

/** The ported "a public card can never resolve to a100 Arms" guard. */
export function isAllowedCrexiUrl(value: unknown): boolean {
  return validatedUrl(value, CREXI_HOSTS) !== undefined;
}

/** Scheme + exact-host allowlist for photography. */
export function isAllowedImageUrl(
  value: unknown,
  hosts: readonly string[] = A100_IMAGE_HOSTS,
): boolean {
  return validatedUrl(value, hosts) !== undefined;
}

/**
 * Identity normalisation for name matching. Case-folded, `&` -> `and`,
 * diacritics stripped, every other non-alphanumeric run collapsed to one space.
 * Deliberately NOT fuzzy: the result is compared for exact equality against a
 * hand-written alias, so this widens formatting tolerance and nothing else.
 */
export function normalizeIdentityName(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Resolve a feed record's identity to an allowlist entry, or null.
 *
 * Precedence, and why:
 *   1. A pinned `sourceIds` match wins outright — an id is an exact key.
 *   2. Otherwise an exact normalised-name alias may match, BUT only for an
 *      entry with no pinned ids. Once we know an entry's real item id, a record
 *      arriving under a DIFFERENT id must not be able to claim that slot by
 *      calling itself the right name.
 * Everything else is not approved.
 */
export function resolveApproved(identity: {
  id?: string | null;
  name?: unknown;
}): ApprovedListing | null {
  const id = typeof identity.id === "string" ? identity.id.trim() : "";
  if (id) {
    for (const entry of APPROVED_LISTINGS) {
      if (entry.sourceIds.includes(id)) return entry;
    }
  }

  const normalized = normalizeIdentityName(identity.name);
  if (!normalized) return null;

  for (const entry of APPROVED_LISTINGS) {
    if (!entry.nameAliases.includes(normalized)) continue;
    if (id && entry.sourceIds.length > 0) return null;
    return entry;
  }

  return null;
}

/* ------------------------------- selection -------------------------------- */

export type SelectOptions = {
  /** Extra image hosts (the configured source host) on top of A100_IMAGE_HOSTS. */
  imageHosts?: readonly string[];
};

export type SelectionResult = {
  status: "ok" | "malformed_source";
  listings: PublicListing[];
  drops: A100Drop[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** The feed's photo key is not stable — §B.2 lists four spellings. */
function readPhoto(record: Record<string, unknown>, hosts: readonly string[]): string | undefined {
  for (const key of ["photoUrl", "photoURL", "imageUrl", "coverUrl"] as const) {
    const candidate = validatedUrl(record[key], hosts);
    if (candidate) return candidate;
  }
  return undefined;
}

function readSourceId(record: Record<string, unknown>): string | null {
  const raw = record.id;
  // The kwc renderer used String(id) because "the feed may deliver a numeric
  // id" (docs/port/03-deals.md §B.4).
  if (typeof raw === "string") return raw.trim() || null;
  if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
  return null;
}

/**
 * Pure, network-free selection: unknown JSON in, whitelisted listings out.
 *
 * This is where the acceptance criteria live, and it is why the fetch is
 * separated from the parse — the fourth-record, whitelist and URL-validation
 * tests need no network and no Next runtime.
 */
export function selectApprovedListings(
  body: unknown,
  options: SelectOptions = {},
): SelectionResult {
  const hosts = [...A100_IMAGE_HOSTS, ...(options.imageHosts ?? [])];
  const drops: A100Drop[] = [];

  // Documented shape is { success, data, count }; a bare array is tolerated
  // because it costs nothing and a feed that drops its envelope should degrade
  // to "works" rather than "malformed".
  const rows = Array.isArray(body) ? body : isRecord(body) ? body.data : undefined;
  if (!Array.isArray(rows)) {
    return { status: "malformed_source", listings: [], drops };
  }

  const selected = new Map<string, PublicListing>();

  for (const row of rows) {
    if (!isRecord(row)) {
      drops.push({ reason: "malformed_record", sourceId: null });
      continue;
    }

    const sourceId = readSourceId(row);

    // index.html:1858-1860: stage — when present — must be "Listed". An absent
    // stage is allowed through by the source's own defensive filter.
    const stage = row.listingStage;
    if (stage !== undefined && stage !== null && stage !== LISTED_STAGE) {
      drops.push({ reason: "not_listed", sourceId });
      continue;
    }

    const approved = resolveApproved({ id: sourceId, name: row.name });
    if (!approved) {
      drops.push({ reason: "not_approved", sourceId });
      continue;
    }
    if (selected.has(approved.slug)) {
      drops.push({ reason: "duplicate", sourceId });
      continue;
    }

    // CONSTRUCTED, never spread. Identity from our table; volatile facts from
    // the feed, each one re-validated. Optional keys are omitted entirely when
    // absent, so an emitted object has no undefined-valued members.
    const roomCount = publicRoomCount(row.roomCount);
    const serviceLevel = publicText(row.service, 40);
    const brand = publicText(row.brand, 60);
    const price = publicPrice(row.price);
    const displayCapRate = publicCapRate(row.cap);
    const crexiUrl = validatedUrl(row.crexiLink, CREXI_HOSTS);
    const photo = readPhoto(row, hosts);

    selected.set(approved.slug, {
      id: approved.slug,
      name: approved.name,
      city: approved.city,
      stateCode: approved.stateCode,
      status: LISTED,
      ...(roomCount !== undefined && { roomCount }),
      ...(serviceLevel !== undefined && { serviceLevel }),
      ...(brand !== undefined && { brand }),
      ...(price !== undefined && { price }),
      ...(displayCapRate !== undefined && { displayCapRate }),
      ...(crexiUrl !== undefined && { crexiUrl }),
      ...(photo !== undefined && { photo }),
    });
  }

  // Allowlist order, not feed order.
  const listings = APPROVED_LISTINGS.map((entry) => selected.get(entry.slug)).filter(
    (listing): listing is PublicListing => listing !== undefined,
  );

  return { status: "ok", listings, drops };
}

/* --------------------------------- load ----------------------------------- */

export type LoadPublicListingsOptions = {
  /** Overrides the env var. `null`/"" behaves exactly like an unset var. */
  sourceUrl?: string | null;
  /** Injected for tests. Resolved at CALL time so Next's patched fetch is used. */
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  revalidateSeconds?: number;
  now?: () => Date;
  logger?: A100Logger;
};

export type PublicListingsResult = {
  payload: PublicListingsPayload;
  /** Value for the response's Cache-Control header. */
  cacheControl: string;
  drops: A100Drop[];
};

/** Never logs the URL: a misconfigured source could carry a token in its query. */
export function defaultLogger(event: A100LogEvent): void {
  if (event.kind === "drop") {
    console.warn(
      `[public-listings] dropped record (${event.reason}) id=${event.sourceId ?? "none"}`,
    );
    return;
  }
  if (event.status === "ok") return;
  console.warn(`[public-listings] ${event.status}${event.detail ? ` (${event.detail})` : ""}`);
}

function emptyPayload(status: PublicListingsStatus): PublicListingsPayload {
  return { status, updated: null, count: 0, listings: [] };
}

function degrade(
  status: PublicListingsStatus,
  logger: A100Logger,
  detail?: string,
): PublicListingsResult {
  logger({ kind: "status", status, detail });
  return { payload: emptyPayload(status), cacheControl: A100_CACHE_DEGRADED, drops: [] };
}

/**
 * Fetch the a100 public source server-side and return the approved three.
 *
 * ALWAYS resolves — every failure is a documented `status`, never a throw. The
 * render contract (L8) is that `content/listings.ts` renders regardless, so an
 * exception here would only ever be noise.
 *
 * CACHING, verified against site/node_modules rather than remembered:
 *   - The route sets `dynamic = "force-dynamic"`, so the segment is pinned to
 *     request time (next/dist/build/utils.js:703).
 *   - That does NOT disable this fetch's own cache entry.
 *     next/dist/server/lib/patch-fetch.js:395 forces `revalidate: 0` under
 *     force-dynamic only when no fetch-level cache config is present:
 *     `noFetchConfigAndForceDynamic = !pageFetchCacheMode &&
 *      !currentFetchCacheConfig && !currentFetchRevalidate &&
 *      workStore.forceDynamic`. An explicit `next.revalidate` makes that false,
 *     and patch-fetch.js:601 consults the incremental cache whenever
 *     `finalRevalidate > 0`. So the upstream body is cached for exactly
 *     `revalidateSeconds`, independently of the route being dynamic.
 *   - `next: { revalidate }` is the supported option in this Next (16.3.0):
 *     next/types/global.d.ts:169-170 augments `RequestInit`, and the
 *     segment-config reference confirms `dynamic`/`revalidate` are removed only
 *     under Cache Components, which site/next.config.ts does not enable.
 */
export async function loadPublicListings(
  options: LoadPublicListingsOptions = {},
): Promise<PublicListingsResult> {
  const logger = options.logger ?? defaultLogger;
  const configured = (options.sourceUrl ?? process.env[A100_SOURCE_URL_ENV] ?? "").trim();

  // Not an error: the plan ships the site with this unset and the three cards
  // rendering from content/listings.ts.
  if (!configured) return degrade("not_configured", logger);

  let source: URL;
  try {
    source = new URL(configured);
  } catch {
    return degrade("source_misconfigured", logger, "unparseable");
  }
  if (source.protocol !== "https:") {
    return degrade("source_misconfigured", logger, "not https");
  }

  const doFetch = options.fetchImpl ?? globalThis.fetch;
  const revalidate = options.revalidateSeconds ?? A100_REVALIDATE_SECONDS;
  const timeoutMs = options.timeoutMs ?? A100_TIMEOUT_MS;

  let response: Response;
  try {
    response = await doFetch(source.toString(), {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { Accept: "application/json" },
      next: { revalidate },
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "unknown";
    // AbortSignal.timeout rejects with TimeoutError; a manual abort is
    // AbortError. Both mean "no answer in budget"; anything else is transport.
    if (name === "TimeoutError" || name === "AbortError") {
      return degrade("upstream_timeout", logger, `${timeoutMs}ms`);
    }
    return degrade("upstream_unreachable", logger, name);
  }

  if (!response.ok) {
    return degrade("upstream_unavailable", logger, `HTTP_${response.status}`);
  }

  // text() then JSON.parse, so "not JSON" is distinguishable from "wrong shape"
  // and the body can be size-capped before it is parsed.
  let raw: string;
  try {
    raw = await response.text();
  } catch (error) {
    const name = error instanceof Error ? error.name : "unknown";
    return degrade("upstream_unreachable", logger, `body:${name}`);
  }
  if (raw.length > A100_MAX_SOURCE_CHARS) {
    return degrade("malformed_source", logger, "oversize");
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return degrade("malformed_source", logger, "unparseable json");
  }

  // The endpoint's own failure channel (§B.2 response shape).
  if (isRecord(body) && body.success === false) {
    return degrade("source_error", logger, "success:false");
  }

  const selection = selectApprovedListings(body, {
    imageHosts: [source.hostname.toLowerCase()],
  });
  for (const drop of selection.drops) {
    logger({ kind: "drop", reason: drop.reason, sourceId: drop.sourceId });
  }

  if (selection.status === "malformed_source") {
    logger({ kind: "status", status: "malformed_source", detail: "no data array" });
    return {
      payload: emptyPayload("malformed_source"),
      cacheControl: A100_CACHE_DEGRADED,
      drops: selection.drops,
    };
  }

  const now = options.now ?? (() => new Date());
  return {
    payload: {
      status: "ok",
      updated: now().toISOString(),
      count: selection.listings.length,
      listings: selection.listings,
    },
    cacheControl: A100_CACHE_FRESH,
    drops: selection.drops,
  };
}
