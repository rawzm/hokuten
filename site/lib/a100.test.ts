/**
 * lib/a100.test.ts — the acceptance suite for the a100 public-listings proxy.
 *
 * Every test here maps to a line of docs/LAUNCH-IMPLEMENTATION.md §3.5 or its
 * P11 row in §7. §3.5 names the deliberate tests: "all three approved records,
 * a non-approved record, an a100 source-feed failure, image/link validation,
 * cache behaviour, and production same-origin delivery." P11's acceptance adds:
 * "Only the 3 approved IDs return; public-field whitelist enforced; broader
 * response never reaches browser storage; source-failure path tested; shares
 * P7's fourth-record acceptance check."
 *
 * Same-origin delivery is a property of the route file (no CORS header, no
 * client fetch) and of the QA grep, not of a unit test; everything else is
 * below.
 *
 * NO NETWORK. `fetch` is injected, so the failure, timeout, malformed and cache
 * paths are exercised deterministically. `vitest.config.ts` runs this in the
 * `node` environment with the `@/` alias mirrored from tsconfig.
 *
 * Fixtures are real: the fourth record is The Lodge at Split Rock Resort with
 * its verbatim Monday item id from the kwc `CREXI_LINKS` map
 * (docs/port/03-deals.md §B.3) — i.e. exactly the kind of record the live feed
 * still carries and §3.5 removes from the site.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  A100_CACHE_DEGRADED,
  A100_CACHE_FRESH,
  A100_MAX_SOURCE_CHARS,
  A100_REVALIDATE_SECONDS,
  A100_SOURCE_URL_ENV,
  APPROVED_LISTINGS,
  isAllowedCrexiUrl,
  isAllowedImageUrl,
  loadPublicListings,
  normalizeIdentityName,
  PUBLIC_LISTING_FIELDS,
  resolveApproved,
  selectApprovedListings,
  type A100LogEvent,
} from "@/lib/a100";

/* ------------------------------- harness ---------------------------------- */

const SOURCE = "https://a100arms.com/api/public/kwc-listings";

type FetchCall = { url: string; init: RequestInit | undefined };

function stubFetch(handler: () => Promise<Response>): {
  impl: typeof fetch;
  calls: FetchCall[];
} {
  const calls: FetchCall[] = [];
  const impl = ((input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init });
    return handler();
  }) as typeof fetch;
  return { impl, calls };
}

function jsonResponse(body: unknown, status = 200): Response {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return new Response(text, { status, headers: { "content-type": "application/json" } });
}

function respondWith(body: unknown, status = 200) {
  return stubFetch(async () => jsonResponse(body, status));
}

function rejectWith(error: Error) {
  return stubFetch(async () => {
    throw error;
  });
}

function named(name: string, message = "stub failure"): Error {
  const error = new Error(message);
  error.name = name;
  return error;
}

/** Collects log events so nothing reaches the console and drops are assertable. */
function recorder(): { log: (event: A100LogEvent) => void; events: A100LogEvent[] } {
  const events: A100LogEvent[] = [];
  return { log: (event) => void events.push(event), events };
}

/** The documented upstream envelope: { success, data, count } (§B.2). */
function feed(...rows: unknown[]): unknown {
  return { success: true, data: rows, count: rows.length };
}

/* ------------------------------- fixtures --------------------------------- */

/**
 * Approved #1. Deliberately carries the feed's OLDER name — §3.5: "The write-up
 * doc calls it 'The Yulee Gateway' ... the allowlist wins."
 */
const FLORIDA_GATEWAY = {
  id: "9200000001",
  name: "The Yulee Gateway",
  city: "Yulee",
  stateCode: "FL",
  service: "Full Service",
  rooms: "156 rooms",
  roomCount: 156,
  price: "$3,750,000",
  cap: "8.10%",
  crexiLink: "https://www.crexi.com/properties/2629907/florida-the-florida-gateway",
  listingStage: "Listed",
};

/** Approved #2. */
const CY_FAIR = {
  id: "9200000002",
  name: "Quality Suites Houston NW Cy-Fair",
  city: "Cypress",
  stateCode: "TX",
  service: "Select Service",
  brand: "Quality Suites",
  rooms: "54 rooms",
  roomCount: 54,
  price: "$3,600,000",
  listingStage: "Listed",
};

/** Approved #3 — the only one whose Monday item id is pinned in the allowlist. */
const POCONO = {
  id: "10846884635",
  name: "Pocono Mountain Hotel and Spa",
  city: "Gouldsboro",
  stateCode: "PA",
  crexiLink:
    "https://www.crexi.com/properties/2301818/pennsylvania-pocono-mountain-hotel-and-spa",
  listingStage: "Listed",
};

/** THE FOURTH RECORD. Real, live, and removed from the site by §3.5. */
const SPLIT_ROCK = {
  id: "9119549004",
  name: "The Lodge at Split Rock Resort",
  city: "Lake Harmony",
  stateCode: "PA",
  price: "$11,000,000",
  crexiLink:
    "https://www.crexi.com/properties/1936508/pennsylvania-the-lodge-at-split-rock-resort",
  listingStage: "Listed",
};

const ALL_THREE = feed(FLORIDA_GATEWAY, CY_FAIR, POCONO);

/* --------------------------- env isolation -------------------------------- */

const originalSource = process.env[A100_SOURCE_URL_ENV];

beforeEach(() => {
  delete process.env[A100_SOURCE_URL_ENV];
});

afterEach(() => {
  if (originalSource === undefined) delete process.env[A100_SOURCE_URL_ENV];
  else process.env[A100_SOURCE_URL_ENV] = originalSource;
});

/* ------------------------------ the allowlist ------------------------------ */

describe("the allowlist is exactly three", () => {
  it("holds the three properties §3.5 approves, and nothing else", () => {
    expect(APPROVED_LISTINGS).toHaveLength(3);
    expect(APPROVED_LISTINGS.map((entry) => entry.name)).toEqual([
      "The Florida Gateway",
      "Quality Suites Houston NW Cy-Fair",
      "Pocono Mountain Hotel & Spa",
    ]);
  });

  it("passes all three approved records", () => {
    const { status, listings, drops } = selectApprovedListings(ALL_THREE);

    expect(status).toBe("ok");
    expect(drops).toEqual([]);
    expect(listings).toHaveLength(3);
    expect(listings.map((listing) => listing.id)).toEqual([
      "the-florida-gateway",
      "quality-suites-houston-nw-cy-fair",
      "pocono-mountain-hotel-and-spa",
    ]);
  });

  it("returns them in allowlist order however the feed orders them", () => {
    const shuffled = selectApprovedListings(feed(POCONO, CY_FAIR, FLORIDA_GATEWAY));

    expect(shuffled.listings.map((listing) => listing.id)).toEqual([
      "the-florida-gateway",
      "quality-suites-houston-nw-cy-fair",
      "pocono-mountain-hotel-and-spa",
    ]);
  });

  it("drops a non-approved fourth record, and never returns it", () => {
    const { listings, drops } = selectApprovedListings(
      feed(FLORIDA_GATEWAY, CY_FAIR, POCONO, SPLIT_ROCK),
    );

    expect(listings).toHaveLength(3);
    expect(drops).toEqual([{ reason: "not_approved", sourceId: "9119549004" }]);
    expect(JSON.stringify(listings)).not.toContain("Split Rock");
    expect(JSON.stringify(listings)).not.toContain("9119549004");
  });

  it("drops a fourth record even when it is the ONLY record", () => {
    const { status, listings, drops } = selectApprovedListings(feed(SPLIT_ROCK));

    expect(status).toBe("ok");
    expect(listings).toEqual([]);
    expect(drops).toEqual([{ reason: "not_approved", sourceId: "9119549004" }]);
  });

  it("logs every dropped record, by id and reason only", async () => {
    const { log, events } = recorder();
    const { impl } = respondWith(feed(POCONO, SPLIT_ROCK));

    const { payload } = await loadPublicListings({
      sourceUrl: SOURCE,
      fetchImpl: impl,
      logger: log,
    });

    expect(payload.count).toBe(1);
    expect(events).toContainEqual({
      kind: "drop",
      reason: "not_approved",
      sourceId: "9119549004",
    });
    // The feed's own name for a dropped record is never logged.
    expect(JSON.stringify(events)).not.toContain("Split Rock");
  });

  it("drops a record whose stage is not Listed", () => {
    const { listings, drops } = selectApprovedListings(
      feed({ ...POCONO, listingStage: "Onboarded" }),
    );

    expect(listings).toEqual([]);
    expect(drops).toEqual([{ reason: "not_listed", sourceId: "10846884635" }]);
  });

  it("allows a record with no stage field at all (the source's own filter)", () => {
    const noStage: Record<string, unknown> = { ...POCONO };
    delete noStage.listingStage;
    const { listings } = selectApprovedListings(feed(noStage));

    expect(listings).toHaveLength(1);
  });

  it("drops a second record claiming a slot that is already filled", () => {
    const { listings, drops } = selectApprovedListings(
      feed(POCONO, { ...POCONO, id: "10846884635", price: "$1" }),
    );

    expect(listings).toHaveLength(1);
    expect(drops).toEqual([{ reason: "duplicate", sourceId: "10846884635" }]);
  });

  it("drops a non-object row instead of throwing", () => {
    const { status, listings, drops } = selectApprovedListings(feed("nope", null, 7, POCONO));

    expect(status).toBe("ok");
    expect(listings).toHaveLength(1);
    expect(drops).toEqual([
      { reason: "malformed_record", sourceId: null },
      { reason: "malformed_record", sourceId: null },
      { reason: "malformed_record", sourceId: null },
    ]);
  });
});

describe("identity resolution", () => {
  it("matches a pinned Monday item id", () => {
    expect(resolveApproved({ id: "10846884635", name: "anything at all" })?.slug).toBe(
      "pocono-mountain-hotel-and-spa",
    );
  });

  it("matches an unpinned entry by an exact name alias", () => {
    expect(resolveApproved({ id: "9200000001", name: "The Yulee Gateway" })?.slug).toBe(
      "the-florida-gateway",
    );
    expect(resolveApproved({ id: null, name: "The Florida Gateway" })?.slug).toBe(
      "the-florida-gateway",
    );
  });

  it("does NOT let a name match override a pinned id", () => {
    // Pocono's id is known, so a record arriving under a different id cannot
    // claim that slot by calling itself Pocono.
    expect(resolveApproved({ id: "9119549004", name: "Pocono Mountain Hotel & Spa" })).toBeNull();
  });

  it("refuses anything else", () => {
    expect(resolveApproved({ id: "9119549004", name: "The Lodge at Split Rock Resort" })).toBeNull();
    expect(resolveApproved({ id: "", name: "" })).toBeNull();
    expect(resolveApproved({ name: 42 })).toBeNull();
    expect(resolveApproved({ name: "Quality Suites" })).toBeNull();
  });

  it("normalises punctuation and case but is not fuzzy", () => {
    expect(normalizeIdentityName("Pocono Mountain Hotel & Spa")).toBe(
      "pocono mountain hotel and spa",
    );
    expect(normalizeIdentityName("  QUALITY   SUITES  Houston NW Cy-Fair ")).toBe(
      "quality suites houston nw cy fair",
    );
    expect(normalizeIdentityName(undefined)).toBe("");
    // Not a substring match: a longer name is a different property.
    expect(resolveApproved({ name: "Pocono Mountain Hotel & Spa Annex" })).toBeNull();
  });
});

/* --------------------------- the field whitelist --------------------------- */

describe("the public-field whitelist", () => {
  const HOSTILE = {
    ...POCONO,
    // Snapshot-class fields lib/types.ts explicitly forbids reading.
    a100_DealSnapshot: { noi: 1_250_000, bov: "$14.2M", sellerEmail: "owner@example.com" },
    rawMondayData: { columns: ["confidential"] },
    // Plus the sort of thing a feed change could add tomorrow.
    internalNotes: "lender payoff 4.1M",
    ownerPhone: "+15550000000",
    noi: 1_250_000,
  };

  it("emits only whitelisted keys", () => {
    const { listings } = selectApprovedListings(feed(HOSTILE));
    const [listing] = listings;

    expect(listing).toBeDefined();
    for (const key of Object.keys(listing)) {
      expect(PUBLIC_LISTING_FIELDS as readonly string[]).toContain(key);
    }
  });

  it("strips every extra field, including the snapshot class", () => {
    const { listings } = selectApprovedListings(feed(HOSTILE));
    const serialized = JSON.stringify(listings);

    for (const leak of [
      "a100_DealSnapshot",
      "rawMondayData",
      "internalNotes",
      "ownerPhone",
      "noi",
      "sellerEmail",
      "lender payoff",
      "14.2M",
    ]) {
      expect(serialized).not.toContain(leak);
    }
  });

  it("never emits the upstream Monday item id", () => {
    const { listings } = selectApprovedListings(ALL_THREE);
    const serialized = JSON.stringify(listings);

    expect(serialized).not.toContain("10846884635");
    expect(serialized).not.toContain("9200000001");
    expect(listings.map((listing) => listing.id)).toEqual(
      APPROVED_LISTINGS.map((entry) => entry.slug),
    );
  });

  it("serves name, city and state from our table, not the feed", () => {
    const { listings } = selectApprovedListings(
      feed(
        { ...FLORIDA_GATEWAY, city: "Somewhere Else", stateCode: "ZZ" },
        { ...POCONO, name: "Pocono Mountain Hotel and Spa" },
      ),
    );

    expect(listings[0]).toMatchObject({
      id: "the-florida-gateway",
      name: "The Florida Gateway",
      city: "Yulee",
      stateCode: "FL",
      status: "listed",
    });
    expect(listings[1].name).toBe("Pocono Mountain Hotel & Spa");
  });

  it("keeps the volatile facts the feed is allowed to supply", () => {
    const { listings } = selectApprovedListings(feed(FLORIDA_GATEWAY, CY_FAIR));

    expect(listings[0]).toMatchObject({
      roomCount: 156,
      serviceLevel: "Full Service",
      price: "$3,750,000",
      displayCapRate: "8.10%",
      crexiUrl:
        "https://www.crexi.com/properties/2629907/florida-the-florida-gateway",
    });
    expect(listings[1]).toMatchObject({ brand: "Quality Suites", roomCount: 54 });
  });

  it("omits a field rather than emitting a bad value", () => {
    const { listings } = selectApprovedListings(
      feed({
        ...POCONO,
        price: "$0",
        cap: "0.00%",
        roomCount: "54",
        service: "",
        brand: "x".repeat(200),
      }),
    );
    const [listing] = listings;

    // lib/types.ts: "$0" -> Price on Request; cap renders only if positive.
    expect(listing).not.toHaveProperty("price");
    expect(listing).not.toHaveProperty("displayCapRate");
    expect(listing).not.toHaveProperty("roomCount");
    expect(listing).not.toHaveProperty("serviceLevel");
    expect(listing).not.toHaveProperty("brand");
  });

  it("strips control characters and refuses markup in a text field", () => {
    const bell = String.fromCharCode(7);
    const { listings } = selectApprovedListings(
      feed({ ...POCONO, service: `Full${bell} Service`, brand: "<script>x</script>" }),
    );

    expect(listings[0].serviceLevel).toBe("Full Service");
    expect(listings[0]).not.toHaveProperty("brand");
  });
});

/* ------------------------ image and link validation ------------------------ */

describe("link validation", () => {
  it("accepts only crexi.com over https", () => {
    expect(isAllowedCrexiUrl("https://www.crexi.com/properties/2301818/x")).toBe(true);
    expect(isAllowedCrexiUrl("https://crexi.com/properties/2301818/x")).toBe(true);

    expect(isAllowedCrexiUrl("http://www.crexi.com/properties/2301818/x")).toBe(false);
    expect(isAllowedCrexiUrl("https://a100arms.com/deals/2301818")).toBe(false);
    expect(isAllowedCrexiUrl("https://crexi.com.example.net/properties/1")).toBe(false);
    expect(isAllowedCrexiUrl("https://evil.example/?u=https://www.crexi.com/")).toBe(false);
    expect(isAllowedCrexiUrl("https://user:pass@www.crexi.com/properties/1")).toBe(false);
    expect(isAllowedCrexiUrl("javascript:alert(1)")).toBe(false);
    expect(isAllowedCrexiUrl("/properties/2301818")).toBe(false);
    expect(isAllowedCrexiUrl(null)).toBe(false);
  });

  it("drops a card's link rather than letting it resolve to a100 Arms", () => {
    const { listings } = selectApprovedListings(
      feed({ ...POCONO, crexiLink: "https://a100arms.com/deals/10846884635" }),
    );

    expect(listings).toHaveLength(1);
    expect(listings[0]).not.toHaveProperty("crexiUrl");
  });
});

describe("image validation", () => {
  it("accepts only an allowlisted host over https", () => {
    expect(isAllowedImageUrl("https://a100arms.com/media/pocono.jpg")).toBe(true);
    expect(isAllowedImageUrl("https://www.a100arms.com/media/pocono.jpg")).toBe(true);

    expect(isAllowedImageUrl("http://a100arms.com/media/pocono.jpg")).toBe(false);
    expect(isAllowedImageUrl("https://a100arms.com.example.net/media/pocono.jpg")).toBe(false);
    expect(isAllowedImageUrl("https://cdn.example.com/pocono.jpg")).toBe(false);
    expect(isAllowedImageUrl("data:image/png;base64,AAAA")).toBe(false);
    expect(isAllowedImageUrl("https://cdn.example.com/pocono.jpg", ["cdn.example.com"])).toBe(true);
  });

  it("keeps an allowlisted photo and drops one from anywhere else", () => {
    const { listings } = selectApprovedListings(
      feed(
        { ...FLORIDA_GATEWAY, photoUrl: "https://a100arms.com/media/gateway.jpg" },
        { ...POCONO, photoUrl: "https://cdn.example.com/pocono.jpg" },
      ),
    );

    expect(listings[0].photo).toBe("https://a100arms.com/media/gateway.jpg");
    expect(listings[1]).not.toHaveProperty("photo");
  });

  it("reads the feed's alternative photo keys", () => {
    const { listings } = selectApprovedListings(
      feed({ ...POCONO, imageUrl: "https://a100arms.com/media/pocono.jpg" }),
    );

    expect(listings[0].photo).toBe("https://a100arms.com/media/pocono.jpg");
  });

  it("trusts the configured source host too, so moving the endpoint keeps photos", async () => {
    const { impl } = respondWith(
      feed({ ...POCONO, photoUrl: "https://feed.a100arms.com/media/pocono.jpg" }),
    );
    const { log } = recorder();

    const { payload } = await loadPublicListings({
      sourceUrl: "https://feed.a100arms.com/api/public/kwc-listings",
      fetchImpl: impl,
      logger: log,
    });

    expect(payload.listings[0].photo).toBe("https://feed.a100arms.com/media/pocono.jpg");
  });
});

/* ------------------------------ configuration ------------------------------ */

describe("configuration", () => {
  it("returns a well-formed empty payload when the env var is unset", async () => {
    const { log, events } = recorder();

    const { payload, cacheControl } = await loadPublicListings({ logger: log });

    expect(payload).toEqual({
      status: "not_configured",
      updated: null,
      count: 0,
      listings: [],
    });
    expect(cacheControl).toBe(A100_CACHE_DEGRADED);
    expect(events).toEqual([
      { kind: "status", status: "not_configured", detail: undefined },
    ]);
  });

  it("reads the source URL from the env var", async () => {
    process.env[A100_SOURCE_URL_ENV] = SOURCE;
    const { impl, calls } = respondWith(ALL_THREE);
    const { log } = recorder();

    const { payload } = await loadPublicListings({ fetchImpl: impl, logger: log });

    expect(calls[0].url).toBe(SOURCE);
    expect(payload.status).toBe("ok");
    expect(payload.count).toBe(3);
  });

  it("treats a blank env var exactly like an unset one", async () => {
    process.env[A100_SOURCE_URL_ENV] = "   ";
    const { impl, calls } = respondWith(ALL_THREE);
    const { log } = recorder();

    const { payload } = await loadPublicListings({ fetchImpl: impl, logger: log });

    expect(payload.status).toBe("not_configured");
    expect(calls).toHaveLength(0);
  });

  it("refuses a non-https or unparseable source instead of fetching it", async () => {
    const { log } = recorder();

    for (const bad of ["http://a100arms.com/api/public/kwc-listings", "not a url"]) {
      const { impl, calls } = respondWith(ALL_THREE);
      const { payload } = await loadPublicListings({
        sourceUrl: bad,
        fetchImpl: impl,
        logger: log,
      });

      expect(payload.status).toBe("source_misconfigured");
      expect(calls).toHaveLength(0);
    }
  });
});

/* ---------------------------- upstream failure ----------------------------- */

describe("upstream failure paths are distinct", () => {
  it("classifies a non-2xx answer", async () => {
    const { log, events } = recorder();
    const { impl } = respondWith({ success: false }, 503);

    const { payload, cacheControl } = await loadPublicListings({
      sourceUrl: SOURCE,
      fetchImpl: impl,
      logger: log,
    });

    expect(payload.status).toBe("upstream_unavailable");
    expect(payload.listings).toEqual([]);
    expect(cacheControl).toBe(A100_CACHE_DEGRADED);
    expect(events).toContainEqual({
      kind: "status",
      status: "upstream_unavailable",
      detail: "HTTP_503",
    });
  });

  it("classifies a timeout", async () => {
    const { log, events } = recorder();
    const { impl } = rejectWith(named("TimeoutError"));

    const { payload } = await loadPublicListings({
      sourceUrl: SOURCE,
      fetchImpl: impl,
      logger: log,
      timeoutMs: 1_500,
    });

    expect(payload.status).toBe("upstream_timeout");
    expect(events).toContainEqual({
      kind: "status",
      status: "upstream_timeout",
      detail: "1500ms",
    });
  });

  it("classifies a transport failure", async () => {
    const { log } = recorder();
    const { impl } = rejectWith(named("TypeError", "fetch failed"));

    const { payload } = await loadPublicListings({
      sourceUrl: SOURCE,
      fetchImpl: impl,
      logger: log,
    });

    expect(payload.status).toBe("upstream_unreachable");
  });

  it("classifies the endpoint reporting its own failure", async () => {
    const { log } = recorder();
    const { impl } = respondWith({ success: false, data: [], count: 0 });

    const { payload } = await loadPublicListings({
      sourceUrl: SOURCE,
      fetchImpl: impl,
      logger: log,
    });

    expect(payload.status).toBe("source_error");
  });

  it("never throws, whatever the upstream does", async () => {
    const { log } = recorder();

    await expect(
      loadPublicListings({
        sourceUrl: SOURCE,
        fetchImpl: rejectWith(named("Error", "boom")).impl,
        logger: log,
      }),
    ).resolves.toBeDefined();
  });
});

/* ---------------------------- malformed payloads --------------------------- */

describe("malformed payloads", () => {
  it("rejects a body that is not JSON", async () => {
    const { log, events } = recorder();
    const { impl } = respondWith("<!doctype html><title>a100</title>");

    const { payload } = await loadPublicListings({
      sourceUrl: SOURCE,
      fetchImpl: impl,
      logger: log,
    });

    expect(payload.status).toBe("malformed_source");
    expect(payload.listings).toEqual([]);
    expect(events).toContainEqual({
      kind: "status",
      status: "malformed_source",
      detail: "unparseable json",
    });
  });

  it("rejects JSON with no data array", async () => {
    const { log } = recorder();

    for (const body of [{ success: true, data: {} }, { success: true }, 42, null]) {
      const { impl } = respondWith(body);
      const { payload } = await loadPublicListings({
        sourceUrl: SOURCE,
        fetchImpl: impl,
        logger: log,
      });

      expect(payload.status).toBe("malformed_source");
      expect(payload.count).toBe(0);
    }
  });

  it("rejects an oversized body before parsing it", async () => {
    const { log, events } = recorder();
    const { impl } = respondWith("a".repeat(A100_MAX_SOURCE_CHARS + 1));

    const { payload } = await loadPublicListings({
      sourceUrl: SOURCE,
      fetchImpl: impl,
      logger: log,
    });

    expect(payload.status).toBe("malformed_source");
    expect(events).toContainEqual({
      kind: "status",
      status: "malformed_source",
      detail: "oversize",
    });
  });

  it("tolerates a bare array envelope", () => {
    const { status, listings } = selectApprovedListings([POCONO]);

    expect(status).toBe("ok");
    expect(listings).toHaveLength(1);
  });
});

/* -------------------------------- caching ---------------------------------- */

describe("caching", () => {
  it("asks for an explicit revalidate window on the upstream fetch", async () => {
    const { impl, calls } = respondWith(ALL_THREE);
    const { log } = recorder();

    await loadPublicListings({ sourceUrl: SOURCE, fetchImpl: impl, logger: log });

    expect(calls).toHaveLength(1);
    expect(calls[0].init?.next).toEqual({ revalidate: A100_REVALIDATE_SECONDS });
    expect(calls[0].init?.signal).toBeDefined();
    expect(calls[0].init?.headers).toEqual({ Accept: "application/json" });
  });

  it("caches a good answer at the edge and never caches a degraded one", async () => {
    const { log } = recorder();

    const good = await loadPublicListings({
      sourceUrl: SOURCE,
      fetchImpl: respondWith(ALL_THREE).impl,
      logger: log,
    });
    const bad = await loadPublicListings({
      sourceUrl: SOURCE,
      fetchImpl: respondWith({ success: true, data: [] }, 500).impl,
      logger: log,
    });

    expect(good.cacheControl).toBe(A100_CACHE_FRESH);
    expect(A100_CACHE_FRESH).toContain(`s-maxage=${A100_REVALIDATE_SECONDS}`);
    expect(bad.cacheControl).toBe(A100_CACHE_DEGRADED);
  });

  it("stamps the answer with the time it was assembled", async () => {
    const { log } = recorder();
    const { impl } = respondWith(ALL_THREE);

    const { payload } = await loadPublicListings({
      sourceUrl: SOURCE,
      fetchImpl: impl,
      logger: log,
      now: () => new Date("2026-08-17T12:00:00.000Z"),
    });

    expect(payload.updated).toBe("2026-08-17T12:00:00.000Z");
  });
});
