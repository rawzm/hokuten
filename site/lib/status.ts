/**
 * lib/status.ts — the single presentation record for listing status.
 *
 * Governed by design-skill reference 03 (Components → Badges: "mono uppercase
 * 11px in a hairline pill — EXCLUSIVE · OFF-MARKET · IN CONTRACT · CLOSED,
 * accent text for EXCLUSIVE/OFF-MARKET") and the Phase 1 data contract in
 * docs/PHASE-1-IMPLEMENTATION.md §4.
 *
 * SPR-prototype pattern: ONE presentation record per status enum. No other file
 * may branch on a status string — read this table instead. Adding a status means
 * adding one row here and nothing else.
 */

/** The status vocabulary shared with the a100 feed contract. */
export const LISTING_STATUSES = [
  "exclusive",
  "off-market",
  "in-contract",
  "closed",
  "listed",
] as const;

export type ListingStatus = (typeof LISTING_STATUSES)[number];

export type StatusPresentation = {
  /**
   * Badge copy in its authored case. The badge also applies CSS uppercase, so
   * assistive tech reads what is written here — keep it human-readable.
   */
  label: string;
  /**
   * true  → accent text (scarce: exclusivity only, ref 01 "accent is scarce").
   * false → fg-muted, so a CLOSED/IN CONTRACT badge never competes for attention.
   */
  accent: boolean;
};

export const STATUS_PRESENTATION: Record<ListingStatus, StatusPresentation> = {
  exclusive: { label: "EXCLUSIVE", accent: true },
  "off-market": { label: "OFF-MARKET", accent: true },
  "in-contract": { label: "IN CONTRACT", accent: false },
  closed: { label: "CLOSED", accent: false },
  /**
   * The a100 public feed is Listed-stage only, so a feed row's `listed` IS our
   * exclusive mandate. Same badge, one vocabulary across both platforms
   * (PHASE-1-IMPLEMENTATION.md §4 data contract).
   */
  listed: { label: "EXCLUSIVE", accent: true },
};

/**
 * Runtime guard for untrusted input (Phase 2 feed rows). Deliberately does NOT
 * fall back to a default: an unrecognised status must not silently render an
 * exclusivity claim. Callers render no badge when this returns false.
 */
export function isListingStatus(value: unknown): value is ListingStatus {
  return (
    typeof value === "string" && (LISTING_STATUSES as readonly string[]).includes(value)
  );
}

/** Total lookup — the only sanctioned way to read a status's presentation. */
export function statusPresentation(status: ListingStatus): StatusPresentation {
  return STATUS_PRESENTATION[status];
}
