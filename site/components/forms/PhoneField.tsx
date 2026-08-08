"use client";

/**
 * components/forms/PhoneField.tsx — international phone entry, normalised to E.164.
 *
 * WHY THIS IS NOT intl-tel-input
 * ------------------------------
 * The source (index.html:2134-2186, docs/port/05-forms-and-ticker.md §C) used
 * `intl-tel-input@25.11.2` pulled from jsDelivr at runtime. That package is NOT
 * installed in this repo and installing it is out of scope for this build, so
 * this component reproduces the OUTCOME the source cared about — a country
 * selector defaulting to the US, a national-number field, and an E.164 string on
 * the wire — on the primitives we already ship.
 *
 * What is preserved: `initialCountry: "us"`, a separate dial-code control beside
 * the national number, an optional field where empty is valid, blur validation,
 * the error clearing on country change, and `getNumber()`'s E.164 output format.
 *
 * What is deliberately NOT reproduced, because it needs the library's per-country
 * metadata and inventing it would be worse than omitting it:
 *   • `strictMode` per-country maximum lengths,
 *   • `autoPlaceholder: "aggressive"` example numbers,
 *   • `formatOnDisplay` / as-you-type national formatting,
 *   • `isValidNumber()` per-country validity.
 * Validation therefore falls back to the SOURCE'S OWN fallback rule — the branch
 * that ran whenever `utils.js` had not loaded (index.html:2205) — widened to the
 * ITU E.164 envelope: 7 to 15 digits including the country code. That rejects
 * obvious junk and never rejects an unusual-but-valid number, which is the
 * required direction of error for a lead form.
 *
 * Because the normalisation is ours rather than a vetted library's, the resolved
 * E.164 string is shown back to the visitor under the field. If our rules get a
 * number wrong, the person who owns the number can see it and fix it.
 *
 * Country names come from `Intl.DisplayNames` rather than a bundled name table:
 * ~240 names would be dead weight in a 180 KB budget, and the platform already
 * has them. They are only ever read inside the dropdown, which Radix renders on
 * the client only — so no hydration mismatch is possible from a locale
 * difference between the server and the browser.
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

/* -------------------------------------------------------------------------- */
/*  Country / dial-code table                                                  */
/* -------------------------------------------------------------------------- */

/**
 * ISO 3166-1 alpha-2 → ITU E.164 country calling code, without the `+`.
 * Codes only; names are resolved at runtime. Territories that share a code with
 * their parent (GG/IM/JE on 44, the NANP set on 1) are listed separately so the
 * visitor can pick the place they are actually in.
 */
const DIAL_CODES: readonly (readonly [string, string])[] = [
  ["AD", "376"], ["AE", "971"], ["AF", "93"], ["AG", "1"], ["AI", "1"], ["AL", "355"],
  ["AM", "374"], ["AO", "244"], ["AR", "54"], ["AS", "1"], ["AT", "43"], ["AU", "61"],
  ["AW", "297"], ["AX", "358"], ["AZ", "994"], ["BA", "387"], ["BB", "1"], ["BD", "880"],
  ["BE", "32"], ["BF", "226"], ["BG", "359"], ["BH", "973"], ["BI", "257"], ["BJ", "229"],
  ["BL", "590"], ["BM", "1"], ["BN", "673"], ["BO", "591"], ["BQ", "599"], ["BR", "55"],
  ["BS", "1"], ["BT", "975"], ["BW", "267"], ["BY", "375"], ["BZ", "501"], ["CA", "1"],
  ["CC", "61"], ["CD", "243"], ["CF", "236"], ["CG", "242"], ["CH", "41"], ["CI", "225"],
  ["CK", "682"], ["CL", "56"], ["CM", "237"], ["CN", "86"], ["CO", "57"], ["CR", "506"],
  ["CU", "53"], ["CV", "238"], ["CW", "599"], ["CX", "61"], ["CY", "357"], ["CZ", "420"],
  ["DE", "49"], ["DJ", "253"], ["DK", "45"], ["DM", "1"], ["DO", "1"], ["DZ", "213"],
  ["EC", "593"], ["EE", "372"], ["EG", "20"], ["EH", "212"], ["ER", "291"], ["ES", "34"],
  ["ET", "251"], ["FI", "358"], ["FJ", "679"], ["FK", "500"], ["FM", "691"], ["FO", "298"],
  ["FR", "33"], ["GA", "241"], ["GB", "44"], ["GD", "1"], ["GE", "995"], ["GF", "594"],
  ["GG", "44"], ["GH", "233"], ["GI", "350"], ["GL", "299"], ["GM", "220"], ["GN", "224"],
  ["GP", "590"], ["GQ", "240"], ["GR", "30"], ["GT", "502"], ["GU", "1"], ["GW", "245"],
  ["GY", "592"], ["HK", "852"], ["HN", "504"], ["HR", "385"], ["HT", "509"], ["HU", "36"],
  ["ID", "62"], ["IE", "353"], ["IL", "972"], ["IM", "44"], ["IN", "91"], ["IO", "246"],
  ["IQ", "964"], ["IR", "98"], ["IS", "354"], ["IT", "39"], ["JE", "44"], ["JM", "1"],
  ["JO", "962"], ["JP", "81"], ["KE", "254"], ["KG", "996"], ["KH", "855"], ["KI", "686"],
  ["KM", "269"], ["KN", "1"], ["KP", "850"], ["KR", "82"], ["KW", "965"], ["KY", "1"],
  ["KZ", "7"], ["LA", "856"], ["LB", "961"], ["LC", "1"], ["LI", "423"], ["LK", "94"],
  ["LR", "231"], ["LS", "266"], ["LT", "370"], ["LU", "352"], ["LV", "371"], ["LY", "218"],
  ["MA", "212"], ["MC", "377"], ["MD", "373"], ["ME", "382"], ["MF", "590"], ["MG", "261"],
  ["MH", "692"], ["MK", "389"], ["ML", "223"], ["MM", "95"], ["MN", "976"], ["MO", "853"],
  ["MP", "1"], ["MQ", "596"], ["MR", "222"], ["MS", "1"], ["MT", "356"], ["MU", "230"],
  ["MV", "960"], ["MW", "265"], ["MX", "52"], ["MY", "60"], ["MZ", "258"], ["NA", "264"],
  ["NC", "687"], ["NE", "227"], ["NF", "672"], ["NG", "234"], ["NI", "505"], ["NL", "31"],
  ["NO", "47"], ["NP", "977"], ["NR", "674"], ["NU", "683"], ["NZ", "64"], ["OM", "968"],
  ["PA", "507"], ["PE", "51"], ["PF", "689"], ["PG", "675"], ["PH", "63"], ["PK", "92"],
  ["PL", "48"], ["PM", "508"], ["PR", "1"], ["PS", "970"], ["PT", "351"], ["PW", "680"],
  ["PY", "595"], ["QA", "974"], ["RE", "262"], ["RO", "40"], ["RS", "381"], ["RU", "7"],
  ["RW", "250"], ["SA", "966"], ["SB", "677"], ["SC", "248"], ["SD", "249"], ["SE", "46"],
  ["SG", "65"], ["SH", "290"], ["SI", "386"], ["SJ", "47"], ["SK", "421"], ["SL", "232"],
  ["SM", "378"], ["SN", "221"], ["SO", "252"], ["SR", "597"], ["SS", "211"], ["ST", "239"],
  ["SV", "503"], ["SX", "1"], ["SY", "963"], ["SZ", "268"], ["TC", "1"], ["TD", "235"],
  ["TG", "228"], ["TH", "66"], ["TJ", "992"], ["TK", "690"], ["TL", "670"], ["TM", "993"],
  ["TN", "216"], ["TO", "676"], ["TR", "90"], ["TT", "1"], ["TV", "688"], ["TW", "886"],
  ["TZ", "255"], ["UA", "380"], ["UG", "256"], ["US", "1"], ["UY", "598"], ["UZ", "998"],
  ["VA", "39"], ["VC", "1"], ["VE", "58"], ["VG", "1"], ["VI", "1"], ["VN", "84"],
  ["VU", "678"], ["WF", "681"], ["WS", "685"], ["XK", "383"], ["YE", "967"], ["YT", "262"],
  ["ZA", "27"], ["ZM", "260"], ["ZW", "263"],
];

/** index.html:2153 — `initialCountry: "us"`. */
export const DEFAULT_COUNTRY = "US";

const DIAL_BY_ISO: Readonly<Record<string, string>> = Object.fromEntries(DIAL_CODES);

/** `Intl.DisplayNames` has no entry for the user-assigned Kosovo code. */
const NAME_OVERRIDES: Readonly<Record<string, string>> = { XK: "Kosovo" };

export type Country = { iso: string; dial: string; name: string };

let countryCache: Country[] | null = null;

/** Built once per process, sorted by English display name. */
export function countries(): Country[] {
  if (countryCache) return countryCache;

  let display: Intl.DisplayNames | null = null;
  try {
    display = new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    display = null;
  }

  countryCache = DIAL_CODES.map(([iso, dial]) => ({
    iso,
    dial,
    name: NAME_OVERRIDES[iso] ?? display?.of(iso) ?? iso,
  })).sort((a, b) => a.name.localeCompare(b.name, "en"));

  return countryCache;
}

export function dialCode(iso: string): string {
  return DIAL_BY_ISO[iso] ?? "";
}

/* -------------------------------------------------------------------------- */
/*  Normalisation                                                              */
/* -------------------------------------------------------------------------- */

/**
 * The three countries whose national numbers KEEP the leading zero — dropping it
 * would corrupt a valid number (Rome is +39 06 …, not +39 6 …). Everywhere else
 * the leading zero is a trunk prefix and is dropped, which is what the library
 * did. If a fourth case turns up, add it here rather than removing the rule.
 */
const KEEP_TRUNK_ZERO = new Set(["IT", "SM", "VA"]);

/** ITU-T E.164 envelope, including the country code. */
export const E164_MIN_DIGITS = 7;
export const E164_MAX_DIGITS = 15;

/**
 * National input + selected country → E.164 (`+16507206995`), or `""` when the
 * field is blank. Never throws.
 *
 * Rules, all deliberately narrow:
 *   1. A value the visitor typed with a leading `+` is treated as already
 *      international and used as-is — the selector is not allowed to corrupt a
 *      pasted number.
 *   2. Otherwise leading zeros are trunk prefixes and are dropped, except for
 *      the countries in KEEP_TRUNK_ZERO.
 *   3. NANP only: an 11-digit string starting with `1` is a country code, never
 *      an area code (no NANP area code begins with 1), so the `1` is dropped
 *      before the dial code is prefixed.
 */
export function toE164(iso: string, raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("+")) {
    const digits = trimmed.replace(/\D/g, "");
    return digits ? `+${digits}` : "";
  }

  const dial = dialCode(iso);
  let national = trimmed.replace(/\D/g, "");
  if (!national) return "";

  if (!KEEP_TRUNK_ZERO.has(iso)) national = national.replace(/^0+/, "");
  if (dial === "1" && national.length === 11 && national.startsWith("1")) {
    national = national.slice(1);
  }
  if (!national) return "";

  return `+${dial}${national}`;
}

/** Conservative length check on the whole E.164 string. */
export function isPlausibleE164(e164: string): boolean {
  const digits = e164.replace(/\D/g, "");
  return digits.length >= E164_MIN_DIGITS && digits.length <= E164_MAX_DIGITS;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export type PhoneValue = {
  /** ISO 3166-1 alpha-2. */
  country: string;
  /** Exactly what the visitor typed, unformatted. */
  national: string;
};

export const EMPTY_PHONE: PhoneValue = { country: DEFAULT_COUNTRY, national: "" };

const COPY = {
  countryLabel: "Country calling code",
  /** index.html:1194 markup placeholder, before the library overwrote it. */
  placeholder: "Phone number",
  /** Prefixes the resolved E.164 string shown back to the visitor. */
  preview: "Sent as",
} as const;

export interface PhoneFieldProps {
  /** From <Field>'s render prop — lands on the national-number input. */
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true | undefined;
  required?: true | undefined;
  value: PhoneValue;
  onChange: (next: PhoneValue) => void;
  /** Blur validation, matching index.html:2183. */
  onBlur?: () => void;
  className?: string;
}

export function PhoneField({
  id,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  required,
  value,
  onChange,
  onBlur,
  className,
}: PhoneFieldProps) {
  const list = countries();
  const previewId = `${id}-e164`;
  const e164 = toE164(value.country, value.national);

  const description = [describedBy, e164 ? previewId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-start gap-2">
        <Select
          value={value.country}
          onValueChange={(iso) => onChange({ ...value, country: iso })}
        >
          <SelectTrigger aria-label={COPY.countryLabel} className="w-auto shrink-0 basis-32">
            <span className="data-line">
              {value.country} +{dialCode(value.country)}
            </span>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {list.map((country) => (
              <SelectItem key={country.iso} value={country.iso}>
                <span className="flex w-full items-baseline gap-4">
                  <span>{country.name}</span>
                  <span className="data-line ml-auto text-fg-meta">+{country.dial}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          id={id}
          type="tel"
          inputMode="tel"
          /* Paired with a separate country control, `tel-national` is the
             correct WHATWG token — `tel` would ask the browser for the full
             international string and duplicate the dial code. */
          autoComplete="tel-national"
          placeholder={COPY.placeholder}
          aria-describedby={description}
          aria-invalid={invalid}
          required={required}
          value={value.national}
          onChange={(event) => onChange({ ...value, national: event.target.value })}
          onBlur={onBlur}
          className="min-w-40 flex-1"
        />
      </div>

      {e164 ? (
        <p id={previewId} className={cn("data-line mt-2 text-fg-meta")}>
          {COPY.preview} {e164}
        </p>
      ) : null}
    </div>
  );
}
