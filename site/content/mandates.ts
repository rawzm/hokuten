/**
 * `#mandates` — Capital & Standing Mandates (dark section, ref 04 §`#mandates`).
 *
 * SOURCE: docs/port/07-mandates.md §7 "SHIP LIST", extracted verbatim from
 * ~/Documents/Dino/dino-sites/kwc-dinomonteverde/marketplace.html (READ-ONLY).
 * Inline citations are marketplace.html line numbers.
 *
 * EVIDENCE: all four cards have a `verified-current` row in design-skill
 * reference 06's claims register. Nothing else from marketplace.html ships in
 * Phase 1 — the other six standing requirements and all nine Featured
 * Opportunities have no register row (port pack 07 §7.1 and flag F-08), and the
 * page's affiliation footer stack, kwc kit gold, and person-branded meta are all
 * hard-flagged (F-01 to F-04, F-12). Do not add a card without a register row.
 *
 * CHARACTER FIDELITY (port pack 07, verified by codepoint — do not normalize):
 * headline dashes in cards 1 and 3 are EM DASH U+2014; `8x–10x` in card 4 is
 * EN DASH U+2013; criteria separators are MIDDLE DOT U+00B7; the CTA arrow is
 * U+2192. Source escapes `&amp;`; here the character is a literal `&`.
 */

import type { Mandate } from "@/lib/types";

export const mandates = [
  {
    // marketplace.html:222-223 · register: "Japanese fund, US portfolio build, $2M–$300M per asset"
    headline: "Japanese Fund — US Hotel Portfolio Build",
    criteria:
      "Location and class agnostic · $2M up to $300M · Third-party valuation required before presentation",
    source: "kwc-marketplace",
  },
  {
    // marketplace.html:227-228 · register: "$1B+ family-office JV capital, luxury/mixed-use, $50M project min"
    // The "beverage-industry" descriptor is intentionally dropped: port pack 07 flag F-05
    // rules it counterparty-narrowing. The register row clears only "$1B+ family-office JV capital".
    headline: "Luxury Hotel & Mixed-Use JV Search",
    criteria:
      "$1B+ into luxury hotel and mixed-use development on a Co-GP basis · Sole requirement: sponsor owns land free and clear · Project minimum $50M",
    source: "kwc-marketplace",
  },
  {
    // marketplace.html:242-247 · register: "select-service portfolio criteria ($200M+, RevPAR ~$100)"
    // Cap band (line 248) omitted — flag F-06, not itemized in the register row.
    // Flag names Hilton/Hyatt/Marriott (line 245) omitted — flag F-07, third-party marks.
    // Flag F-16: this card's `$200M+` is buy-side capital, NOT the aggregate-volume stat.
    headline: "Select-Service & Above — $200M+",
    criteria:
      "Investment group targeting select-service and above; portfolios welcome · RevPAR ~$100, unencumbered by management",
    source: "kwc-marketplace",
  },
  {
    // marketplace.html:277-278 · register: "management-company acquisitions, 8x–10x EBITDA"
    // Declared case change (port pack 07 §7): source reads ", with offers in the 8x–10x
    // EBITDA range." — lifting the clause to the head of a `·` segment capitalizes "Offers".
    headline: "Hotel Management Company Acquisition",
    criteria:
      "Buyers seeking further management-company acquisitions · Offers in the 8x–10x EBITDA range",
    source: "kwc-marketplace",
  },
] satisfies Mandate[];

/**
 * Deck line under the section header — marketplace.html:217, verbatim.
 * Already team-voice in the source; ports with zero surgery and asserts no
 * unverified fact (port pack 07 §5.1, "recommended `#mandates` deck line").
 */
export const mandatesDeck =
  "Mandates we are working directly. Third-party valuation is required before any asset is presented.";

/**
 * Closing discretion line — Hokuten-authored, ref 04 §`#mandates`.
 * Not a kwc string; it makes no factual claim. Renders beside the ghost CTA.
 */
export const mandatesDiscretion = "Access and disclosure happen in stages.";

/** Ghost CTA closing the section — ref 04 §`#mandates`. Arrow is U+2192. */
export const mandatesCta = {
  label: "PRIVATE ACCESS →",
  href: "https://a100arms.com/signup",
  external: true,
} as const;
