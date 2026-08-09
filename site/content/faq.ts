/**
 * `#faq` — Diligence FAQ accordion (paper, ref 04 §`#faq`).
 *
 * SOURCE: docs/port/04-copy.md §10 is a RAW-MATERIAL HARVEST, not a port — the
 * kwc source has no FAQ section (zero matches for `faq` / `frequently asked`,
 * no FAQPage JSON-LD). These questions are therefore AUTHORED, which makes the
 * evidence gate binding on every sentence below. Each answer is assembled only
 * from (a) sentences the kwc source actually says, cited by index.html line, or
 * (b) rows in design-skill reference 06's verified claims register, or (c) US
 * statute, in the single case of the 1031 clocks.
 *
 * PLACEHOLDERS: where the source is silent, the answer says less rather than
 * more and carries a bracketed PLACEHOLDER:confirm marker instead of an
 * invention. Five markers ship here — NDA mechanics, the a100 Arms vetting bar,
 * qualified-intermediary coordination, fee/engagement terms, and the
 * KW / Forward Wilshire paperwork gate. None of them may render as live public
 * copy; resolve each before `#faq` goes public.
 *
 * NOT ASSERTED ANYWHERE BELOW, deliberately:
 *   · the 180-day listing term / two 90-day cycles (index.html:1095) — a
 *     contractual timeframe with no register row, and port pack 04 §10b warns
 *     specifically against conflating its "180 days" with the 1031 clock;
 *   · any commission rate, retainer, exclusivity or cancellation term — the
 *     source states none (port pack 04 §10e, "the biggest hole on the page");
 *   · any NDA workflow — the source's only NDA reference is `lender NDAs` as a
 *     deal category (index.html:1223).
 *
 * COMPLIANCE: the brokerage disclosure in the last answer is no longer retyped
 * here — it is IMPORTED from content/compliance.ts, the single owner of that
 * string (ship-gate finding, DESIGN-REVISIT §5.3). The two copies were diffed
 * character by character before the swap and were byte-identical over all 145
 * characters, with no non-ASCII codepoints on either side, so this change is
 * refactor-only: the rendered answer is unchanged. Never retype it back.
 */

import { BROKERAGE_DISCLOSURE } from "@/content/compliance";
import type { FaqItem } from "@/lib/types";

/**
 * The disclosure as one inline sentence pair. content/compliance.ts documents
 * this join: the source uses a hard line break between the two elements in the
 * footer, and a single space in the inline form used on the legal pages. An FAQ
 * answer is a plain string, so the inline form is the correct one here.
 */
const DISCLOSURE_INLINE = BROKERAGE_DISCLOSURE.join(" ");

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
  {
    // index.html:1060 ("fully confidential"), :1100 (public launch vs. controlled
    // confidential process). The source defines no buyer-side NDA workflow — see
    // port pack 04 §10a gap note. Do not fill that gap from imagination.
    question: "Is my inquiry confidential, and can you run a quiet process?",
    answer:
      "Yes to both. Every inquiry and every written BOV is confidential. The default launch is public — CoStar, LoopNet and Crexi, supported by direct database distribution and owner outreach — unless the seller's circumstances require a controlled confidential process, in which case we run one instead. [PLACEHOLDER:confirm — buyer-side NDA mechanics: who signs, at what stage of a confidential process, and what information is gated behind it]",
  },
  {
    // index.html:1222-1223 verbatim, :1225 (signup destination), :1868 (empty state).
    // The source never defines the vetting bar — port pack 04 §10c open question.
    question: "How do I get access to off-market deals?",
    answer:
      "a100 Arms is our invite-only platform for vetted hotel investors: deals that require confidentiality — partnership wind-downs, lender NDAs, ownership transitions where public listing would damage value. Request an invite and we review it. [PLACEHOLDER:confirm — the vetting bar for a100 Arms access: proof of funds, stated mandate, minimum check size]",
  },
  {
    // The 45/180-day clocks are federal statute (IRC §1031), not a company claim.
    // The kwc source says nothing about 1031 exchanges at all (port pack 04 §10b),
    // so everything operational is held back behind the marker.
    question: "Can you work with a 1031 exchange?",
    answer:
      "The statutory clocks are fixed: 45 days from the closing of the relinquished property to identify replacement property, and 180 days to close it. They run concurrently, not back to back. We are brokers, not tax counsel — exchange structure, qualified-intermediary selection, and tax treatment stay with your CPA and your QI. [PLACEHOLDER:confirm — how we coordinate with a buyer's or seller's qualified intermediary, and whether we name referral relationships]",
  },
  {
    // index.html:1165 ("No cost, no obligation."), :1060, :1065, :1099 ("Delivered
    // before the listing agreement."). Everything else about fees is unsourced —
    // port pack 04 §10e: `blocked: needs fee/engagement terms from Razim`.
    question: "What does a valuation cost, and when does an engagement start?",
    answer:
      "The written BOV is no cost and no obligation, and it is delivered before the listing agreement — asking for a number does not start an engagement, and no listing agreement follows automatically. [PLACEHOLDER:confirm — commission structure, marketing-cost allocation, listing term and exclusivity, and cancellation terms; the source site states none of these]",
  },
  {
    // Disclosure sentences IMPORTED from content/compliance.ts, which owns them
    // (kwc index.html:1140, :1241, :1249 — the same string 7 times across 4 files).
    //
    // The coverage sentence is a deliberate NARROWING of index.html:1152, not a
    // port of it: the source line ("Nationwide referral network and formal
    // partner-brokerage relationships in every U.S. state…") is now exported
    // byte-exact as compliance.ts `OUT_OF_STATE_QUALIFIER` for the footer, and
    // asserting "every U.S. state" inside an FAQ answer would widen a coverage
    // claim that has no register row yet. Keep the narrower wording here until
    // ref 06 carries the row; then this becomes a one-line swap, not a rewrite.
    //
    // The whole block is gated on the KW / Forward Wilshire paperwork item
    // tracked in PROJECT-MEMORY.md.
    question: "Who is the brokerage of record, and can you work outside California?",
    answer: `${DISCLOSURE_INLINE} Out-of-California engagements run through formal partner-brokerage relationships, and Forward Wilshire is brokerage of record for all listings. [PLACEHOLDER:confirm — the KW / Forward Wilshire paperwork gate must clear before this answer ships publicly under the Hokuten name, and whether the named licensee is a team block or Dino individually]`,
  },
] satisfies FaqItem[];
