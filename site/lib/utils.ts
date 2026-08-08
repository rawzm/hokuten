import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Class-name composer used by every primitive. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ---------------------------------------------------------------------------
   Deal-data formatting vocabulary.
   Shared verbatim with the a100arms public feed so a Phase 2 data-source swap
   renders without re-formatting (PHASE-1-EXECUTION §9).
   --------------------------------------------------------------------------- */

/** The feed's exact fallback string. Render as-is — never "N/A", never "TBD". */
export const PRICE_ON_REQUEST = "Price on Request";

/**
 * A price is displayable only when it parses to a positive number.
 * "$0", "", undefined and unparseable strings all fall back.
 */
export function displayPrice(price?: string | number | null): string {
  if (price === null || price === undefined) return PRICE_ON_REQUEST;
  if (typeof price === "number") {
    return price > 0 ? formatMoneyShort(price) : PRICE_ON_REQUEST;
  }
  const trimmed = price.trim();
  if (!trimmed) return PRICE_ON_REQUEST;
  const numeric = Number(trimmed.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) return PRICE_ON_REQUEST;
  return trimmed;
}

/** 11_000_000 → "$11.00M"; 350_000 → "$350K" */
export function formatMoneyShort(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return PRICE_ON_REQUEST;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value)}`;
}

/** Cap rates render only when a positive number parses. Format: "7.25% Cap". */
export function displayCapRate(cap?: string | number | null): string | null {
  if (cap === null || cap === undefined) return null;
  const numeric =
    typeof cap === "number" ? cap : Number(String(cap).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  return `${numeric.toFixed(2)}% Cap`;
}

/** The pipe-free meta line: "Lake Harmony, PA · Full-Service · 450 keys" */
export function metaLine(parts: Array<string | number | null | undefined>): string {
  return parts
    .filter((p): p is string | number => p !== null && p !== undefined && p !== "")
    .join(" · ");
}
