/**
 * components/seo/JsonLd.tsx — schema.org structured data, server-rendered.
 *
 * Server Component. Emits one `<script type="application/ld+json">` containing a
 * `@graph` with three kinds of node:
 *
 *   1. `RealEstateAgent`  — THE HOKUTEN GROUP, the practice itself.
 *   2. `RealEstateAgent`  — Forward Wilshire Inc dba Keller Williams Larchmont,
 *                           the brokerage of record, carrying ITS licence.
 *   3. `Person` × n       — the roster, each with role, and with the CA DRE
 *                           licence only where `content/team.ts` records one.
 *
 * ── Evidence discipline (design ref 06) ──────────────────────────────────
 * Every string below is imported from `@/content/*`. Nothing is retyped, and
 * nothing is asserted that lacks a `verified-current` row in the register:
 *
 *   · NO `aggregateRating`, NO `review`, NO `reviewCount`. The site has no
 *     ratings and the Sarhan-era testimonials are `pending-verification`.
 *   · NO `award`. Every KW corporate award is `prohibited`, and the CoStar
 *     Power Broker rows live in Dino's bio prose where their qualifiers travel
 *     with them — not as a bare `award` string a rich result could strip.
 *   · NO aggregate volume / transaction-count property. Those figures are
 *     `verified-current` as rendered copy with their conditions attached; a
 *     naked schema number loses the conditions.
 *   · NO licence on the Hokuten node. "The Hokuten Group" is a team name under
 *     a sponsoring broker, not a licensee — its DRE team-name registration is
 *     an OPEN item at the KW / Forward Wilshire gate (PHASE-1 §8.2). Asserting
 *     a licence for it would be a DRE advertising problem, not a markup one.
 *     The licence hangs on the brokerage node, where it belongs.
 *
 * ── Escaping ─────────────────────────────────────────────────────────────
 * `JSON.stringify` alone does not escape `<`, so a value containing
 * `</script>` would terminate the block early. `serialize()` escapes `<`, `>`,
 * `&`, U+2028 and U+2029 to their `\uXXXX` forms — still valid JSON, inert as
 * HTML. Content is trusted (it is our own repo), so this is defence in depth
 * rather than the only line of defence.
 *
 * ── Where it renders ─────────────────────────────────────────────────────
 * Mounted by `components/legal/LegalPage.tsx`, so it ships on `/privacy`,
 * `/sms-terms` and `/accessibility`. `app/page.tsx` (owned by another workflow)
 * should render `<JsonLd />` inside its own tree as well — one instance per
 * page, never two.
 */

import {
  BROKERAGE_OF_RECORD,
  DRE_BROKERAGE,
  BROKERAGE_DISCLOSURE,
} from "@/content/compliance";
import { bovPromise } from "@/content/methodology";
import { CONTACT, SITE_DESCRIPTION, SITE_NAME } from "@/content/site";
import { team } from "@/content/team";
import { absoluteUrl, OG_IMAGE } from "@/lib/seo";
import { themePresentation } from "@/lib/theme";

/* -------------------------------------------------------------------------- */
/*  Node identities                                                            */
/* -------------------------------------------------------------------------- */

const ORGANIZATION_ID = absoluteUrl("/#organization");
const BROKERAGE_ID = absoluteUrl("/#brokerage-of-record");
const BOV_SERVICE_ID = absoluteUrl("/#service-bov");

/**
 * The two authored strings in this file. Both are restatements of text that
 * already exists in `SITE_DESCRIPTION` ("Hospitality investment sales across the
 * United States."), cased for schema rather than for display. They assert no
 * metric, coverage guarantee or capability beyond that sentence — in particular
 * NOT the source site's "…in every U.S. state", which `content/site.ts`
 * deliberately does not port.
 */
const SERVICE_TYPE = "Hospitality investment sales";
const AREA_SERVED = "United States";

/** Schema-side label for a CA Department of Real Estate licence number. */
const DRE_IDENTIFIER_LABEL = "California DRE license";

/* -------------------------------------------------------------------------- */
/*  Serialisation                                                              */
/* -------------------------------------------------------------------------- */

function serialize(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/** "Dino Monteverde" → "dino-monteverde". Deterministic, so `@id`s are stable. */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* -------------------------------------------------------------------------- */
/*  Person nodes                                                               */
/* -------------------------------------------------------------------------- */

type JsonLdNode = Record<string, unknown>;

/**
 * `content/team.ts` carries Jae and Donna on ONE card ("Jae Hun Jeong & Donna
 * Grace Yangyang"), because design ref 06 lists them together under Operations.
 * A `Person` node describes one person, so a joint card expands into two nodes
 * that share the role and description recorded for the card. Nothing is invented:
 * both names, the role and the description are read verbatim from the card.
 */
function namesOf(member: (typeof team)[number]): string[] {
  return member.name.split(" & ").map((part) => part.trim());
}

function personNodes(): JsonLdNode[] {
  return team.flatMap((member) =>
    namesOf(member).map((name) => {
      const node: JsonLdNode = {
        "@type": "Person",
        "@id": absoluteUrl(`/#person-${slugify(name)}`),
        name,
        jobTitle: member.role,
        description: member.bio,
        worksFor: { "@id": ORGANIZATION_ID },
      };

      // Empty string is the contract's "no contact channel" (content/team.ts) —
      // never emit an empty `email`, and never invent one.
      if (member.email) node.email = member.email;
      if (member.phone) node.telephone = member.phone;
      if (member.photo) node.image = absoluteUrl(member.photo);

      // Licence only where the roster records one. Everyone else appears with a
      // role and no credential — which is the accurate statement.
      if (member.dre) {
        node.hasCredential = {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "license",
          identifier: {
            "@type": "PropertyValue",
            name: DRE_IDENTIFIER_LABEL,
            value: member.dre,
          },
        };
      }

      return node;
    }),
  );
}

/* -------------------------------------------------------------------------- */
/*  Graph                                                                      */
/* -------------------------------------------------------------------------- */

export function buildGraph(): JsonLdNode {
  const people = personNodes();

  const organization: JsonLdNode = {
    "@type": "RealEstateAgent",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    // The DRE disclosure, verbatim, so the licensed entity behind the practice
    // travels with the markup exactly as it does in the footer.
    disambiguatingDescription: BROKERAGE_DISCLOSURE.join(" "),
    logo: absoluteUrl(themePresentation.wordmark),
    image: absoluteUrl(OG_IMAGE.url),
    email: CONTACT.email,
    telephone: CONTACT.phoneInternational,
    areaServed: { "@type": "Country", name: AREA_SERVED },
    serviceType: SERVICE_TYPE,
    parentOrganization: { "@id": BROKERAGE_ID },
    employee: people.map((person) => ({ "@id": person["@id"] })),
    makesOffer: {
      "@type": "Offer",
      itemOffered: { "@id": BOV_SERVICE_ID },
    },
  };

  const brokerage: JsonLdNode = {
    "@type": "RealEstateAgent",
    "@id": BROKERAGE_ID,
    name: BROKERAGE_OF_RECORD,
    identifier: {
      "@type": "PropertyValue",
      name: DRE_IDENTIFIER_LABEL,
      value: DRE_BROKERAGE,
    },
    subOrganization: { "@id": ORGANIZATION_ID },
  };

  /**
   * One service, described by the one service-level promise that has a
   * `verified-current` register row. `bovPromise` carries its own condition
   * ("…of receiving the T-12, STR report, franchise / PIP information…") and may
   * never be shortened — which is why it is imported whole.
   */
  const bovService: JsonLdNode = {
    "@type": "Service",
    "@id": BOV_SERVICE_ID,
    name: "Broker Opinion of Value",
    description: bovPromise,
    serviceType: SERVICE_TYPE,
    areaServed: { "@type": "Country", name: AREA_SERVED },
    provider: { "@id": ORGANIZATION_ID },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, brokerage, bovService, ...people],
  };
}

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // Serialised by `serialize()`, which escapes `<`, `>` and `&` — a value
      // containing `</script>` cannot break out of the block.
      dangerouslySetInnerHTML={{ __html: serialize(buildGraph()) }}
    />
  );
}

export default JsonLd;
