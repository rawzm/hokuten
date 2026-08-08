# PLACEHOLDERS — the Phase 1 open-items register

This file is the single register of every unresolved item on the Hokuten
platform: every in-code `PLACEHOLDER:` marker, every `blocked:` constant,
every `provisional` or `pending-verification` claim, plus the specific items
PHASE-1-EXECUTION §8 (the compliance pack) and PROJECT-MEMORY.md §5 (open
items) name by hand. It is a Definition-of-Done requirement
(PHASE-1-EXECUTION §8.3, §11: "Maintain `docs/PLACEHOLDERS.md` … DoD requires
it complete and current") — Phase 1 is not done while a row here is open and
unlogged. This file does not resolve anything itself; it makes every open
item greppable in one place so nothing ships silently.

Every row below was gathered from a real grep hit, a real code comment, or a
named item in PROJECT-MEMORY.md / PHASE-1-EXECUTION.md / a design spec — the
File/anchor column is always a real `path:line`. Nothing here is invented.

Owner: **Razim** · **Dino** · **counsel** · **executor** (the implementing
agent/engineer for a technical-verification task).
Status: **`blocked: <reason>`** (needs an external input before it can move)
· **`provisional`** (a value or decision exists but is not yet ratified/final)
· **`pending-verification`** (a claim that must clear the evidence gate — ref
06 — before it may render as live copy).

---

## 1. `/privacy` — CalOPPA / CCPA / controller-entity items

| # | Area | File / anchor | What is needed | Owner | Status |
|---|---|---|---|---|---|
| 1 | Privacy — metadata | `site/app/privacy/page.tsx:56` | Route `<title>`/description still name Dino Monteverde only; update to The Hokuten Group once the KW / Forward Wilshire naming gate clears | Razim | `blocked: paperwork-gate` |
| 2 | Privacy — controller entity | `site/app/privacy/page.tsx:205` | Confirm whether The Hokuten Group / Forward Wilshire should be named as controller in place of "Dino Monteverde (KW Commercial)" | counsel | `blocked: paperwork-gate` |
| 3 | Privacy — PII categories | `site/app/privacy/page.tsx:210` | Full CalOPPA enumeration of PII categories collected (identifiers, commercial/property info, internet activity, geolocation-by-city, inferences) mapped to each collection point (BOV form, consent modal, calculator inputs, analytics); current prose is a partial list | counsel | `pending-verification` |
| 4 | Privacy — 10DLC brand string | `site/app/privacy/page.tsx:219` | Registered campaign brand "Dino Monteverde (KW Commercial)" cannot be rebranded without a new TCR campaign registration first | Razim / Dino | `blocked: 10dlc-registration` |
| 5 | Privacy — calculator email-capture notice | `site/app/privacy/page.tsx:220` | Decide whether a privacy notice must appear beside the "email me this estimate" field at the point of collection (kwc `index.html:1071-1079` shipped with none) and whether §12 must describe that collection | counsel | `pending-verification` |
| 6 | Privacy — third-party/processor list | `site/app/privacy/page.tsx:235` | Name the third parties that receive data (Web3Forms, Calendly, Vercel, FRED) and confirm each processor's role and CPRA sale/share characterization; current §5 is a provisional list | counsel | `pending-verification` |
| 7 | Privacy — retention periods | `site/app/privacy/page.tsx:240` | Concrete retention periods per data category (form submissions, SMS consent records, analytics); current sentence is unquantified | counsel | `pending-verification` |
| 8 | Privacy — contact channel | `site/app/privacy/page.tsx:249` | Confirm whether a dedicated privacy/DSAR address is required in addition to `dino.monteverde@kw.com`, and whether a postal address must be listed | counsel | `pending-verification` |
| 9 | Privacy — update process / effective date | `site/app/privacy/page.tsx:271` | Describe the update-notification process; reset "Last updated: June 4, 2026" (frozen kwc date) to a new effective date | counsel | `pending-verification` |
| 10 | Privacy — DNT / GPC disclosure | `site/app/privacy/page.tsx:276` | CalOPPA §22575(b)(5) Do-Not-Track + Global Privacy Control disclosure; a provisional draft exists at `docs/port/06-legal-pages.md:530` but must be confirmed against actual analytics behavior | counsel | `pending-verification` |
| 11 | Privacy — CCPA/CPRA rights section | `site/app/privacy/page.tsx:281` | Full "California Privacy Rights" section: know/delete/correct/opt-out rights, non-discrimination, two request channels, verification method (thresholds likely not met today, ship anyway per §8.3) | counsel | `pending-verification` |
| 12 | Privacy — processors actually in use | `site/app/privacy/page.tsx:286` | Confirm each named provider is actually live at launch and remove any that is not — Calendly is not yet provisioned (`CALENDLY_URL` is `null`) and Web3Forms has no access key yet | Razim | `blocked: calendly-url` + `blocked: web3forms-key` |
| 13 | Privacy — Calendly consent-prompt suppression | `site/app/privacy/page.tsx:287` | The kwc source suppresses Calendly's own consent prompt (`hide_gdpr_banner=1`, source `index.html:1922`); decide what this policy must disclose about Calendly's own data collection if the Hokuten site keeps that parameter (see row 42, C3) | counsel / Razim | `pending-verification` |

## 2. `/sms-terms` — 10DLC / TCR items

| # | Area | File / anchor | What is needed | Owner | Status |
|---|---|---|---|---|---|
| 14 | SMS Terms — metadata | `site/app/sms-terms/page.tsx:52` | Route `<title>`/description still names Dino Monteverde only; same gate as row 1 | Razim | `blocked: paperwork-gate` |
| 15 | SMS Terms — sample messages | `site/app/sms-terms/page.tsx:158` | The five A2P 10DLC registered sample messages (source `sms-terms.html:87-114`) are frozen byte-exact until a Hokuten 10DLC campaign is registered with TCR | Razim / Dino (TCR filing) | `blocked: 10dlc-registration` |
| 16 | SMS Terms — program owner / effective date | `site/app/sms-terms/page.tsx:196` | Campaign is registered to "Dino Monteverde (KW Commercial)"; needs new brand registration + new effective date once a Hokuten campaign is registered | Razim / Dino (TCR) + counsel | `blocked: 10dlc-registration` |
| 17 | SMS Terms — carrier disclaimer currency | `site/app/sms-terms/page.tsx:239` | Confirm the mobile-data-sharing disclaimer (duplicated here and in Privacy §4) still matches current carrier/TCR requirements at Hokuten launch | counsel | `pending-verification` |

## 3. `/accessibility` — statement accuracy

| # | Area | File / anchor | What is needed | Owner | Status |
|---|---|---|---|---|---|
| 18 | Accessibility — conformance wording | `site/app/accessibility/page.tsx:136` | Confirm the "aims to conform" wording (no conformance claim, no VPAT) is what the sponsoring brokerage wants on the record, and whether Forward Wilshire needs its own a11y contact/policy reference | counsel | `pending-verification` |
| 19 | Accessibility — §2 mechanism claims | `site/app/accessibility/page.tsx:141` | Every item in §2 was verified by reading `globals.css`/`layout.tsx` on 2026-08-08 only; re-verify against shipped pages before this route goes public | executor | `pending-verification` |
| 20 | Accessibility — internal repo-path citation | `site/app/accessibility/page.tsx:142` | §2 cites the repo path `docs/design/CONTRAST.md`, acceptable while internal-only; replace with a plain description or public link before public launch | executor | `blocked: paperwork-gate` |
| 21 | Accessibility — §3 audit not yet run | `site/app/accessibility/page.tsx:153` | §3 states the build standard, not a per-page audit result; audit each shipped page against the nine listed items before public launch, then promote verified items into §2 | executor | `pending-verification` |
| 22 | Accessibility — testing-plan claims | `site/app/accessibility/page.tsx:159` | Confirm axe-core, keyboard pass, VoiceOver spot-check and Lighthouse ≥95 have actually been run, on which routes, on what date, before this page is public; drop any check not yet run | executor | `pending-verification` |
| 23 | Accessibility — reporting commitment | `site/app/accessibility/page.tsx:170` | Set a response-time commitment for accessibility reports and confirm whether a dedicated a11y contact address is needed beyond `dino.monteverde@kw.com`; no commitment ships today because none has been agreed | Razim | `blocked: needs Razim decision` |

## 4. `#faq` — Diligence FAQ content markers

Five `[PLACEHOLDER:confirm — …]` markers ship in `site/content/faq.ts`; `FaqSection.tsx` renders each as an unmissable block (hairline border, `text-brick`, `AlertTriangle`, `data-placeholder-confirm="true"`) per the 2026-08-08 build decision. **None may render as live public copy.**

| # | Area | File / anchor | What is needed | Owner | Status |
|---|---|---|---|---|---|
| 24 | FAQ — NDA mechanics | `site/content/faq.ts:56` | Buyer-side NDA mechanics: who signs, at what stage of a confidential process, what information is gated behind it | Razim | `blocked: needs process definition` |
| 25 | FAQ — a100 Arms vetting bar | `site/content/faq.ts:63` | The vetting bar for a100 Arms access: proof of funds, stated mandate, minimum check size | Razim | `blocked: needs vetting criteria` |
| 26 | FAQ — QI coordination | `site/content/faq.ts:71` | How Hokuten coordinates with a buyer's/seller's qualified intermediary, and whether referral relationships are named | Razim | `blocked: needs input` |
| 27 | FAQ — fee/engagement terms | `site/content/faq.ts:79` | Commission structure, marketing-cost allocation, listing term and exclusivity, cancellation terms — the kwc source states none of these | Razim | `blocked: needs fee/engagement terms from Razim` |
| 28 | FAQ — brokerage-of-record answer | `site/content/faq.ts:88` | The KW / Forward Wilshire paperwork gate must clear before this answer ships publicly under the Hokuten name; also confirm whether the named licensee is a team block or Dino individually | Razim / Dino | `blocked: paperwork-gate` |

## 5. Unprovisioned constants / launch switches (`blocked:` in code)

| # | Area | File / anchor | What is needed | Owner | Status |
|---|---|---|---|---|---|
| 29 | Calendly URL | `site/content/site.ts:156-164`; consumed at `site/components/calculator/CalculatorResult.tsx:28`, `docs/design/specs/calculator.md:19` | Team Calendly URL not provisioned; every caller degrades to `#bov` (`CALENDLY_FALLBACK`) until set | Razim / Dino | `blocked: calendly-url` |
| 30 | Live domain | `site/content/site.ts:172-183`; `site/lib/seo.ts:42-113` | "thehokutengroup.com" is assumed, not confirmed; `SITE_DOMAIN` stays `null` (origin resolves from Vercel host meanwhile) until DNS is cut over | Razim | `blocked: domain-unconfirmed` |
| 31 | Web3Forms access key | `site/lib/web3forms.ts:23`; `site/.env.example:29-31` | `NEXT_PUBLIC_WEB3FORMS_KEY` is unprovisioned; do NOT reuse the kwc key. Until set, BOV/calculator forms render but submission shows a designed "temporarily unavailable" state + mailto fallback | Razim | `blocked: a NEW Hokuten Web3Forms key must be provisioned` |
| 32 | Public-indexing launch switch | `site/lib/seo.ts:130-146` | `INDEXING_ENABLED` is hardwired `false` (emits `noindex,nofollow` + a robots-disallow-all sitemap). Flip only after (a) the paperwork gate closes with a dated PROJECT-MEMORY decision and (b) `SITE_DOMAIN` (row 30) is set — in that order | Razim | `blocked: paperwork-gate` |
| 33 | SMS/TCPA compliance block re-registration | `site/content/compliance.ts:22-27` | Every string naming "Dino Monteverde" or carrying `CA DRE #01948432` is frozen in shape; its value changes only via Razim's OK + the paperwork gate + (for SMS strings) a re-filed A2P 10DLC/TCR registration | Razim / Dino | `blocked: paperwork-gate` + `blocked: 10dlc-registration` |

## 6. CA DRE / compliance-pack items named by PHASE-1-EXECUTION §8

| # | Area | File / anchor | What is needed | Owner | Status |
|---|---|---|---|---|---|
| 34 | CA DRE team-name registration | `docs/PHASE-1-EXECUTION.md:138` (§8.2); posture in PROJECT-MEMORY.md 2026-08-07 "DRE team-name posture" | "The Hokuten Group" contains no licensee surname → likely needs CA DRE fictitious-business-name/team-name registration through Forward Wilshire. Razim's approved posture: use the name as-is while the site is internal-only, not marketed; registration stays inside the pre-marketing paperwork gate. **Do not resolve this row yourself** — log-and-hold is the approved state | Razim (via Forward Wilshire) | `blocked: paperwork-gate` |
| 35 | Franchise-logo vector licensing | `docs/design/LOGO-MANIFEST.md` §3, §"If counsel later clears vectors" | Phase 1 ships all nine `#brands` marks as text-only (no vector shipped, `site/public/logos/` intentionally empty). Best Western and IHG have the only genuinely type-only candidates found, flagged to counsel — file URLs and licence tags already logged so no re-research is needed if counsel wants to pursue a vector | counsel | `pending-verification` |

## 7. Evidence-gate claims — `pending-verification` / `prohibited` (ref 06 register)

| # | Area | File / anchor | What is needed | Owner | Status |
|---|---|---|---|---|---|
| 36 | Sarhan-era "~$1B" narrative | `.agents/skills/hokuten-design-director/references/06-content-and-proof.md:37`; PROJECT-MEMORY.md §5 | Group-level "~$1B total hotel sales" claim needs Dino's sign-off + framing away from the Sarhan brand before it may render anywhere | Dino | `pending-verification` |
| 37 | Sarhan-era testimonials | `.agents/skills/hokuten-design-director/references/06-content-and-proof.md:38`; PROJECT-MEMORY.md §5 | Caliber / Whispering Pines / Juniper testimonials — permission + attribution unresolved; currently omitted everywhere, including the FAQ and `#method` | Dino | `pending-verification` |

## 8. Team roster

| # | Area | File / anchor | What is needed | Owner | Status |
|---|---|---|---|---|---|
| 38 | Real team bios | `site/content/team.ts:59-82` | Razim, William, and Jae/Donna ship provisional generic bios (zero numbers, awards, or license claims) per the 2026-08-07 decision; replace with real bios via the evidence gate when available | Razim / team | `provisional` |
| 39 | Razim / William title confirmation | `site/content/team.ts:63,71` (`titleStatus: "provisional"`); PROJECT-MEMORY.md §5 | Titles "Buyer Relations & Platform Technology" (Razim) and "Associate · Hospitality Investment Sales" (William) are unconfirmed internally | Razim | `provisional` |
| 40 | Team member email addresses | `site/content/team.ts:29-33` (contract-gap note) | Only Dino has a sourced email address; Razim/William/Jae&Donna ship `email: ""` by contract — inventing an address is forbidden. `TeamMember.email` should become optional (`email?: string`) to match; reported as a type-contract gap, not fixed here | Razim / executor | `provisional` |

## 9. Listing photography

| # | Area | File / anchor | What is needed | Owner | Status |
|---|---|---|---|---|---|
| 41 | Missing listing photography | `site/content/listings.ts:31-35` (rationale), `:69,84,98,112,126` (all five `photo` fields) | The kwc source repo contains only closing photos, none of the five active listings. Reusing a closing photo would misrepresent the asset, so every `#listings` card points at `site/public/art/listing-placeholder.svg` until real photography is sourced | Dino / Razim | `provisional` |

## 10. Calculator — decisions needing ratification (`docs/design/specs/calculator.md`)

Section is built and shipping; these are logged deviations/decisions awaiting Razim's sign-off, not build blockers.

| # | Area | File / anchor | What is needed | Owner | Status |
|---|---|---|---|---|---|
| 42 | Calculator C1 — intro copy | `docs/design/specs/calculator.md:144` | "…range **from comp data** in under 60 seconds" (source) shipped as "…range in under 60 seconds" — the model is generalized-assumptions, not comp-derived, and the disclaimer four lines below says so. Needs a ref 06 register row or Razim's sign-off on the three-word cut | Razim | `provisional` |
| 43 | Calculator C2 — email-capture copy voice | `docs/design/specs/calculator.md:146` | `"Done — Dino will send…"` rewritten team-first to `"Done — we'll send your estimate and comp set shortly."`; failure copy points at `CONTACT.email`. Flag for sign-off per port-pack VOICE rule | Razim | `provisional` |
| 44 | Calculator C3 — Calendly consent-prompt param | `docs/design/specs/calculator.md:122,148` | Source appends `hide_gdpr_banner=1` to the Calendly URL, suppressing Calendly's own consent prompt. **Not carried over** — reported, not ported, because suppressing a third party's consent UI is a privacy decision nobody has made. See row 13 for the matching Privacy-policy question | Razim | `pending-verification` |
| 45 | Calculator D3 — ported cap-rate defect | `docs/design/specs/calculator.md:134` | A hidden F&B % value still widens the cap rate by 25bps after switching from `Full-Service` to `Limited-Service` (enter it, then change service level — the adjustment survives). Kept as-is per the port-pack rule ("flag, do not silently fix"); fixing it changes shipped numbers and needs a dated PROJECT-MEMORY.md decision under the calculator-frozen guardrail | Razim | `provisional` |

## 11. Motion-recipe token registrations (`docs/design/MOTION-RECIPES.md`)

Governs future component work only — no shipped section currently depends on an unregistered token, so this does not block Phase 1's shipped sections, but it blocks building any of the nine recipes below to spec.

| # | Area | File / anchor | What is needed | Owner | Status |
|---|---|---|---|---|---|
| 46 | Motion — scale/distance/blur token gaps | `docs/design/MOTION-RECIPES.md` rows 04, 05, 06, 07, 09, 14, 17, 18 | Nine translated recipes (text-state swap, menu dropdown, modal open/close, panel reveal, icon swap, skeleton loader, tooltip, texts-reveal) each need a `DIST.*`/`scale`/`blur` token registered in `site/lib/motion.ts` before they can ship — the curves and durations already map cleanly, only the distance/scale/blur values are missing from the token scale | Razim (design-director decision) | `blocked: register token first` |
| 47 | Motion — accordion `grid-template-rows` conflict | `docs/design/MOTION-RECIPES.md` row 21, `#Open token registrations` | Ref 05 assigns `DUR.base` to accordion expand, but the panel-height animation requires `grid-template-rows` — a layout property motion law forbids. Needs a design-director decision resolving the conflict (e.g., an approved layout-property exception, or a transform-based substitute) | Razim (design-director decision) | `blocked: design-director decision` |

---

## How to clear a row

1. **`blocked: <reason>`** — the row needs an input only its Owner can supply (a URL, a key, a signed paperwork gate, a decision only Razim/Dino/counsel can make). Once supplied: update the source constant/marker in the file named in the anchor column, delete the row here (or strike it through with the clearing date), and add a dated PROJECT-MEMORY.md entry per the memory protocol — never clear a row silently.
2. **`provisional`** — a value or decision already exists but is not yet ratified as final. Clearing it means the Owner confirms it explicitly (in chat, in PROJECT-MEMORY, or by editing the source content), the code/content is updated in place, and the row's status flips to done in the same commit that removes the `provisional` marker from the source.
3. **`pending-verification`** — a claim that must clear the evidence gate (design-skill reference 06) before it may render as live copy. Clearing it means adding a `verified-current` (or `verified-dated`) row to reference 06's claims register with real evidence, then updating the content to match — never by relaxing the gate.
4. In every case: grep for the exact anchor after clearing to confirm the marker is actually gone (`PLACEHOLDER:`, `blocked:`, `provisional`, `pending-verification`), then remove or strike the row in this file in the same change. This file is only trustworthy if a cleared item is provably gone from the code, not just from this table.
