/**
 * `#doors` — The Owner / The Investor split panel (paper, hairline divider).
 *
 * SOURCE: design-skill reference 04 §`#doors` (structure), with every promise
 * traced to kwc source copy via docs/port/04-copy.md:
 *   · sell-side  — index.html:1165 (48h BOV, conditioned on T-12 / STR / PIP),
 *                  index.html:1099 (comp set, market analysis, pricing
 *                  recommendation; delivered before the listing agreement),
 *                  index.html:1060 ("no obligation").
 *   · buy-side   — index.html:1222-1225 (a100 Arms, invite-only, vetted hotel
 *                  investors, the three confidentiality categories, signup URL),
 *                  index.html:1117 (current public listings).
 *
 * EVIDENCE: the sell-side promise is the `verified-current` "BOV promise" row in
 * design-skill reference 06 — the 48-hour clock starts on RECEIPT of the T-12,
 * STR report and franchise / PIP information, and that condition is load-bearing:
 * never render the 48 hours without it. The buy-side promise is source-verbatim
 * kwc copy, already team-voice ("a100 Arms is our invite-only platform").
 *
 * CASING: the source is inconsistent between `a100 Arms` and `a100 Arms`
 * title-cased (port pack 04 §8). Enforced here as lowercase `a100`.
 *
 * NOTE FOR lib/types.ts: there is no `Door` type in the contract. The type below
 * is declared locally rather than added to lib/types.ts (not this agent's file).
 */

export type Door = {
  /** Bracketed micro-label index — the component renders `[ 01 — THE OWNER ]`. */
  index: string;
  label: string;
  headline: string;
  body: string;
  cta: DoorCta;
  /** Second action; only the investor door carries one (ref 04 §`#doors`). */
  secondaryCta?: DoorCta;
};

export type DoorCta = {
  /** Verb-first and specific (ref 06 copy patterns). Never "Learn more". */
  label: string;
  href: string;
  /** Off-site destinations render with target="_blank" rel="noopener". */
  external?: boolean;
};

export const doors = [
  {
    index: "01",
    label: "The Owner",
    headline: "A written number in 48 hours.",
    body: "Send the T-12, the STR report, and franchise / PIP information. We return a written BOV within 48 hours of receipt — comp set, market analysis, pricing recommendation. No cost, no obligation, and it arrives before the listing agreement.",
    cta: {
      label: "Request a written BOV",
      href: "#bov",
    },
  },
  {
    index: "02",
    label: "The Investor",
    headline: "Vetted deal flow, on and off market.",
    body: "Current listings are public and link straight to Crexi. Everything that requires confidentiality moves through a100 Arms, our invite-only platform for vetted hotel investors — partnership wind-downs, lender NDAs, ownership transitions where public listing would damage value.",
    cta: {
      label: "See current listings",
      href: "#listings",
    },
    secondaryCta: {
      label: "Request invite to a100 Arms",
      href: "https://a100arms.com/signup",
      external: true,
    },
  },
] satisfies Door[];
