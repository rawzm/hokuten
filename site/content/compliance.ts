/**
 * FROZEN COMPLIANCE STRINGS — the canonical copy in this application.
 *
 * Source: docs/port/02-compliance.md §1, §2, §3, §4.3 (byte-exact extracts of
 * ~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html and sms-terms.html),
 * reconciled against .agents/skills/hokuten-design-director/references/06-content-and-proof.md
 * ("Compliance text"), which is canonical wherever the two disagree.
 * Verified byte-for-byte against the read-only kwc source on 2026-08-08
 * (index.html:920, :1047, :1140, :1174, :1175, :1199, :1200, :1203, :1564-1570;
 * sms-terms.html:87-114).
 *
 * Evidence status: `verified-current` — every string below is a verbatim port of a
 * shipped legal/compliance block, not a new claim.
 *
 * ---------------------------------------------------------------------------
 * THESE STRINGS ARE FROZEN. Permitted substitutions are currently NONE.
 *
 * No paraphrase, no punctuation "cleanup", no em-dash → hyphen, no smart quotes,
 * no `&` ↔ `&amp;` swap, no Prettier reflow inside a literal. Nothing else in the
 * app may retype these strings — import them from here.
 *
 * Changing one requires a dated PROJECT-MEMORY.md decision. Anything naming
 * "Dino Monteverde" or carrying `CA DRE #01948432` is additionally gated on the
 * KW / Forward Wilshire paperwork gate, and everything under SMS_CONSENT is gated
 * on a re-filed A2P 10DLC / TCR campaign registration under the Hokuten brand
 * (`blocked: paperwork-gate`, `blocked: 10dlc-registration`).
 * ---------------------------------------------------------------------------
 */

/* -------------------------------------------------------------------------- */
/*  Named entities and licences                                               */
/* -------------------------------------------------------------------------- */

/** Brokerage of record. index.html:1151. `dba` is lowercase; there is no comma after "Inc". */
export const BROKERAGE_OF_RECORD =
  "Forward Wilshire Inc dba Keller Williams Larchmont";

/** The brokerage's licence. Travels with Forward Wilshire. index.html:1140. */
export const DRE_BROKERAGE = "CA DRE #01870534";

/**
 * Dino Monteverde's personal salesperson licence. index.html:1140.
 * Renders because Dino is an agent of record on this site (ref 06 team roster);
 * if that ever stops being true this line comes out — see port pack §5.1.
 */
export const DRE_SALESPERSON = "CA DRE #01948432";

/* -------------------------------------------------------------------------- */
/*  1 — Brokerage-of-record disclosure (footer, every page)                    */
/* -------------------------------------------------------------------------- */

/**
 * The two-sentence disclosure. Render the two elements with a hard line break
 * between them (the source uses `<br>` / `<br/>`); joining them with a single
 * space is the equally valid inline form used on the legal pages.
 *
 * Ref 06 "Compliance text" and docs/port/02-compliance.md §1.1 agree byte-for-byte.
 */
export const BROKERAGE_DISCLOSURE = [
  "Brokerage services are provided through Forward Wilshire Inc dba Keller Williams Larchmont (CA DRE #01870534).",
  "Dino Monteverde, CA DRE #01948432.",
] as const satisfies readonly [string, string];

/* -------------------------------------------------------------------------- */
/*  2 — SMS / TCPA consent block (BOV form)                                    */
/* -------------------------------------------------------------------------- */

/** Hidden audit-trail field name. index.html:1174. Submit verbatim. */
export const SMS_CONSENT_TEXT_FIELD = "sms_consent_text";

/** Hidden audit-trail field name. index.html:1175. Submit verbatim. */
export const CONSENT_TIMESTAMP_FIELD = "consent_timestamp";

/**
 * Opt-in evidence stamp. `new Date().toISOString()` — ISO 8601 extended, always
 * UTC, millisecond precision, `Z` suffix: `YYYY-MM-DDTHH:mm:ss.sssZ`.
 * index.html:2241.
 *
 * Port rule R4: stamp on EVERY submit, before the payload is built, regardless of
 * whether the consent box is checked. Do not make this conditional.
 */
export function consentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * The full TCPA / A2P 10DLC consent block.
 *
 * Behavioural invariants that are themselves compliance requirements (port rule R3):
 * the checkbox renders UNCHECKED, is NOT `required`, is scoped to SMS only, is
 * separate from form submission, the whole label is the click target, and the two
 * policy links open in a new tab (`rel="noopener"`) so form state survives.
 */
export const SMS_CONSENT = {
  /**
   * The registered A2P 10DLC / TCR campaign brand. sms-terms.html:87-114.
   * Registered messages prefix it with a colon and a space
   * (`Dino Monteverde (KW Commercial): …`). It must stay identical across the
   * sample messages, the consent checkbox, and the SMS/privacy body copy — it is
   * what the registry vetted. The registered sample messages themselves live in
   * the /sms-terms route (docs/port/06-legal-pages.md P-12).
   */
  brand: "Dino Monteverde (KW Commercial)",

  /** Registered keywords. All three must be honoured by the messaging provider. */
  keywords: ["STOP", "HELP", "START"],

  /** Visible checkbox field name. index.html:1199. */
  checkboxField: "sms_consent",

  /** Submitted only when the box is checked. index.html:1199. */
  checkboxValue:
    "I consent to receive SMS text messages from Dino Monteverde (KW Commercial).",

  /**
   * The rendered visible label / fine print, as one string. index.html:1200.
   * (`&amp;` in the source resolves to a single `&` here.) Carries all seven
   * mandatory 10DLC elements: programme identity, message type, purpose scope,
   * frequency, cost, opt-out + help, and non-condition.
   */
  label:
    "I agree to receive informational and conversational SMS text messages from Dino Monteverde (KW Commercial) about my hotel valuation and related real-estate matters. Message frequency varies (up to 6 msgs/month). Message & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of any purchase or of receiving a valuation. This is separate from the valuation request above and is optional.",

  /**
   * The same label split at the source's `<strong>` boundary so the form can
   * render the emphasis without an HTML string. Concatenating the three parts
   * reproduces `label` exactly.
   */
  labelSegments: {
    before:
      "I agree to receive informational and conversational SMS text messages from ",
    emphasis: "Dino Monteverde",
    after:
      " (KW Commercial) about my hotel valuation and related real-estate matters. Message frequency varies (up to 6 msgs/month). Message & data rates may apply. Reply STOP to opt out, HELP for help. Consent is not a condition of any purchase or of receiving a valuation. This is separate from the valuation request above and is optional.",
  },

  /**
   * SMS opt-in audit trail (records consent context per 10DLC/TCR).
   * Hidden field `sms_consent_text`. index.html:1174.
   * The ampersand is a RAW `&` on the wire — never `&amp;`.
   */
  consentText:
    "Up to 6 msgs/month. Msg & data rates may apply. Reply STOP to cancel, HELP for help. Consent not a condition of purchase.",

  /** Hidden audit-trail field names the form must submit. */
  hiddenFields: {
    consentText: SMS_CONSENT_TEXT_FIELD,
    timestamp: CONSENT_TIMESTAMP_FIELD,
  },

  /**
   * Consent links row. index.html:1203. Rendered text:
   * "See our Privacy Policy and SMS Terms & Conditions."
   * Composed as segments so the row ships without an HTML string; both links
   * open in a new tab with `rel="noopener"`.
   */
  links: {
    lead: "See our ",
    privacyLabel: "Privacy Policy",
    privacyHref: "/privacy",
    separator: " and ",
    smsLabel: "SMS Terms & Conditions",
    smsHref: "/sms-terms",
    tail: ".",
  },

  /** Compliance, not styling. Port rule R3 — a refactor that flips either is a TCPA regression. */
  behaviour: {
    checkedByDefault: false,
    required: false,
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  3 — Calculator disclaimers                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Three distinct disclaimers, not one (port rule R5).
 *
 * `canonical` is the shared opening sentence — the source calls it out as
 * "Canonical disclaimer language" at index.html:1564. `methodologyNote` and
 * `resultHonest` + `resultContext` share it and then DIVERGE: the methodology
 * note ends "…pricing recommendation. Request a written BOV below." while the
 * result panel joins with an em dash and lowercases the verb,
 * "…pricing recommendation — request a written BOV below." Do not unify them.
 *
 * `benchmarkBandScope` is a third, unrelated disclaimer with no terminal period.
 * Do not add one, do not fold it into the others, do not drop it.
 */
export const CALCULATOR_DISCLAIMER = {
  /** The frozen sentence. index.html:920, :1566. */
  canonical:
    "Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value.",

  /** Methodology note beside the calculator, full string. index.html:920. */
  methodologyNote:
    "Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value. A full BOV includes verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation. Request a written BOV below.",

  /** Result panel, line 1 (`#resHonest`). index.html:1566. */
  resultHonest:
    "Indicative range only — based on the figures provided and generalized market assumptions, not a Broker Opinion of Value.",

  /** Result panel, line 2 (`#resContext`). index.html:1568. Note the em-dash join. */
  resultContext:
    "A full BOV includes verified comps backed by CoStar and RCA, market analysis, and a pricing recommendation — request a written BOV below.",

  /** Appended to `resultContext`, italic, only when the tier defaults were used. index.html:1569. */
  usedDefaults:
    "This range uses typical figures for your market tier; your real numbers will sharpen it.",

  /**
   * Appended to `resultContext`, italic, only when the user supplied actual NOI.
   * index.html:1570. Shares the `usedNoiOverride` condition with the `*` on the
   * NOI/key figure (index.html:1560) — the two must never desynchronise, and the
   * source has no `* = …` legend. Do not invent one.
   */
  usedNoiOverride:
    "Using your actual NOI — the most accurate input you can give us.",

  /**
   * Benchmark-band scope note, shown inside the "Where you sit" band label.
   * index.html:1047. Opens with an em dash + one space; NO terminal period.
   * This is the only on-screen text telling the visitor the bars are not local comps.
   */
  benchmarkBandScope:
    "— broad national reference for this type, not your local comp set",
} as const;

/* -------------------------------------------------------------------------- */
/*  4 — Trademark microcopy (#brands marquee)                                  */
/* -------------------------------------------------------------------------- */

/**
 * Renders in `type.micro` beneath the franchise-flag marquee.
 * Source: ref 06 "Verified claims register" → trademark microcopy line.
 * The marquee's own label must read "flags we transact across" — never
 * "partners", never "clients".
 */
export const TRADEMARK_MICROCOPY =
  "All trademarks are the property of their respective owners and are shown to indicate franchise systems within which we broker transactions. No affiliation or endorsement is implied.";

/* -------------------------------------------------------------------------- */
/*  5 — KW Commercial compliance mark                                          */
/* -------------------------------------------------------------------------- */

/**
 * The KW Commercial raster mark. Hokuten-first branding: this mark appears ONLY
 * in the footer, beside the verbatim disclosure — never in the header.
 * Alt text is frozen byte-exact (index.html:820, marketplace.html:184).
 * The mark keeps its own original colours in BOTH themes (skill ref 01).
 */
export const KW_COMMERCIAL_MARK = {
  src: "/brand/kw-commercial.png",
  alt: "Keller Williams Commercial",
} as const;
