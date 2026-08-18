/**
 * `#faq` — Diligence FAQ accordion (paper, ref 04 §`#faq`).
 *
 * SOURCE: docs/port/04-copy.md §10 is a RAW-MATERIAL HARVEST, not a port — the
 * kwc source has no FAQ section (zero matches for `faq` / `frequently asked`,
 * no FAQPage JSON-LD). These questions are therefore AUTHORED, which makes the
 * evidence gate binding on every sentence below. Each answer is assembled only
 * from (a) sentences the kwc source actually says, cited by index.html line, or
 * (b) rows in design-skill reference 06's verified claims register.
 *
 * 2026-08-17 — FIVE QUESTIONS CUT FOR LAUNCH (decision D3; portion P9 of
 * docs/LAUNCH-IMPLEMENTATION.md §3.12). Five of the seven answers ended in a
 * bracketed confirm-marker where the source was silent, and FaqSection.tsx
 * renders such a marker as an unmissable alert block. None could go public, and
 * D3 is a CUT, not a wait: the five entries are DELETED here and are re-added
 * verbatim when Dino supplies the answers. `#faq` therefore ships with the two
 * fully answered questions below, in their original order.
 *
 * THE FIVE CUT QUESTIONS, verbatim, at their original indices, each with the
 * one thing it was waiting on. The deleted answer text survives in git history
 * (the commit immediately preceding this cut) and its provenance is tabulated
 * in docs/LAUNCH-IMPLEMENTATION.md §3.12, so restoring one is a single edit:
 * paste the entry back at its index, drop the trailing marker, and put the
 * confirmed sentence in its place.
 *
 *   3. "Is my inquiry confidential, and can you run a quiet process?"
 *      — waiting on: buyer-side NDA mechanics — who signs, at what stage of a
 *        confidential process, and what information is gated behind it.
 *   4. "How do I get access to off-market deals?"
 *      — waiting on: the vetting bar for a100 Arms access — proof of funds,
 *        stated mandate, minimum check size.
 *   5. "Can you work with a 1031 exchange?"
 *      — waiting on: how we coordinate with a buyer's or seller's qualified
 *        intermediary, and whether we name referral relationships.
 *   6. "What does a valuation cost, and when does an engagement start?"
 *      — waiting on: fee and engagement terms — commission structure,
 *        marketing-cost allocation, listing term and exclusivity, cancellation.
 *   7. "Who is the brokerage of record, and can you work outside California?"
 *      — waiting on: the KW / Forward Wilshire paperwork gate, and whether the
 *        named licensee is a team block or Dino individually. Re-add at cutover,
 *        once the FBN filing and the broker email exist. That answer opened with
 *        the brokerage disclosure IMPORTED from content/compliance.ts, which is
 *        the single owner of that string (ship-gate finding, DESIGN-REVISIT
 *        §5.3): restore it as `BROKERAGE_DISCLOSURE.join(" ")` — the inline
 *        one-sentence-pair form, since an FAQ answer is a plain string — and
 *        never retype the string itself. Its coverage sentence was also a
 *        deliberate NARROWING of index.html:1152; keep the narrower wording
 *        until ref 06 carries a row for "every U.S. state".
 *
 * NOT ASSERTED ANYWHERE BELOW, deliberately — and still not assertable when the
 * cut questions come back:
 *   · the 180-day listing term / two 90-day cycles (index.html:1095) — a
 *     contractual timeframe with no register row, and port pack 04 §10b warns
 *     specifically against conflating its "180 days" with the 1031 clock;
 *   · any commission rate, retainer, exclusivity or cancellation term — the
 *     source states none (port pack 04 §10e, "the biggest hole on the page");
 *   · any NDA workflow — the source's only NDA reference is `lender NDAs` as a
 *     deal category (index.html:1223).
 */

import type { FaqItem } from "@/lib/types";

export const faq = [
  {
    // index.html:1165 verbatim + :1099 · register: "BOV promise" (`verified-current`).
    // The condition on the 48 hours is load-bearing — never render the clock without it.
    question: "What do you need from me to produce a written BOV?",
    answer:
      "The T-12, the STR report, franchise / PIP information, and other material property data. The initial BOV is delivered within 48 hours after receipt, and covers the comp set, the market analysis, and a pricing recommendation. No cost, no obligation.",
  },
  {
    // index.html:920 and :1568 (canonical disclaimer + full-BOV sentence), :1062.
    question: "How is the calculator estimate different from a written BOV?",
    answer:
      "The calculator returns an indicative range only, based on the figures you provide and generalized market assumptions — not a Broker Opinion of Value. A written BOV is built on verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation, and we pressure-test it against your real numbers.",
  },
] satisfies FaqItem[];
