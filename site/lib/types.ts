/**
 * Content contracts — PHASE-1-IMPLEMENTATION.md §5.
 *
 * These types are aligned to the a100arms public-feed allowlist so Phase 2 is a
 * data-source swap, not a rewrite. Do not widen a field or add a rendering-only
 * property without a dated PROJECT-MEMORY.md entry.
 *
 * Never read or type snapshot-class feed fields (a100_DealSnapshot,
 * rawMondayData) — they leak internal data and are prohibited here.
 */

import type { ListingStatus } from "./status";

export type { ListingStatus };

/** A property currently for sale. Phase 1 = static seed; Phase 2 = live feed. */
export type Listing = {
  /** Monday item id (feed) or slug (static seed) */
  id: string;
  name: string;
  city: string;
  stateCode: string;
  /** meta line: "City, ST · service level · N keys" */
  roomCount?: number;
  serviceLevel?: string;
  brand?: string;
  /** display string, e.g. "$11.00M". undefined / "$0" → "Price on Request" (the feed's exact string) */
  price?: string;
  /** render only if a positive number parses */
  displayCapRate?: string;
  /** 'listed' renders the EXCLUSIVE badge — the feed is Listed-stage only */
  status: ListingStatus;
  /** must pass ^https://(www\.)?crexi\.com/ */
  crexiUrl?: string;
  /** /public path (static) or photoUrl (feed) */
  photo: string;
  /** alt text describes the hotel, not the treatment */
  photoAlt: string;
};

/** A closed transaction in the track record. */
export type Closing = {
  name: string;
  location: string;
  keys?: number;
  segment: string;
  /** mono line: "96% LP/SP · 74 days" | "Confidential · $227K/key" */
  metrics: string;
  price: string;
  photo: string;
  photoAlt: string;
  /** e.g. "JV / equity capital arranged" */
  note?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  /** provisional bios carry zero numbers, awards, or license claims */
  bio: string;
  /** `provisional` where the title is unconfirmed internally */
  titleStatus?: "approved" | "provisional";
  email: string;
  phone?: string;
  /** CA DRE number — required wherever the person appears in a broker capacity */
  dre?: string;
  photo?: string;
  photoAlt?: string;
};

export type Stat = {
  /** e.g. "$200M+", "12", "836K+", "3×" */
  value: string;
  label: string;
  /** e.g. "Q3 '25 · Q1 '26 · Q2 '26" */
  detail?: string;
};

/** #mandates cards — every claim needs a verified-current row in skill ref 06. */
export type Mandate = {
  headline: string;
  criteria: string;
  source: "kwc-marketplace";
};

/** #method vertical stepper. */
export type MethodStep = {
  index: string;
  title: string;
  body: string;
};

/** #method reach-stats row. */
export type ReachStat = {
  value: string;
  label: string;
};

/** #faq accordion. */
export type FaqItem = {
  question: string;
  answer: string;
};

/** #brands marquee entry. See content/brands.ts for the trademark rules. */
export type FranchiseFlag = {
  name: string;
  /** vector path under /public/logos/ when a free-licensed mark was sourced */
  logo?: string;
  /** provenance + licence for every sourced mark (asset manifest requirement) */
  licence?: string;
  source?: string;
};

/** Anchor navigation. */
export type NavLink = {
  label: string;
  href: string;
};

/** Numbered menu-overlay index. */
export type MenuItem = {
  index: string;
  label: string;
  href: string;
};
