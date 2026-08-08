# Logo manifest — `#brands` franchise-flag marquee

Asset manifest required by PHASE-1-EXECUTION §4.3 ("record source + license per logo in an asset manifest") and §8.4 (trademarks).
Audit performed 2026-08-08. Scope: the nine target flags in design-skill ref 04 `#brands` + the "& independents" text mark.

**Outcome: zero vectors shipped. `site/public/logos/` is empty and stays empty until counsel clears it. All nine flags render as brand names set in our own typography.** Rationale in §3; the per-mark evidence is §2.

Honesty rule for this file: every row states what was *actually verified* and what was not. A Wikimedia "PD-textlogo" tag is a volunteer's assertion about US copyright, not a legal determination and not a trademark clearance. Nothing below upgrades a tag into a licence opinion.

---

## 1. Legal posture (restated so no one re-derives it)

Usage in `#brands` is **nominative / referential only** — "flags we transact across". Ref 06's register clears this as a **coverage claim**, nothing more.

- Never "partners", never "clients", never "brands we work with".
- Never implies affiliation, endorsement, or approval.
- Never adjacent to the Hokuten lockup.
- Always grayscale, always uniform optical height.
- The ref 06 trademark microcopy renders beneath the marquee, verbatim, from `site/content/compliance.ts` → `TRADEMARK_MICROCOPY`.

---

## 2. Per-mark audit

Method used on every row: queried the Wikimedia Commons MediaWiki API (`prop=templates|imageinfo|categories|revisions`) for the licence templates, `extmetadata` licence fields and raw file-page wikitext; then downloaded the SVG and rendered it with `rsvg-convert` to inspect what the mark actually contains. "Device" below means an original non-typographic graphic element.

| # | Mark | Vector shipped | Best free-licensed candidate found | Licence tag on that file | Verification actually performed | Decision |
|---|---|---|---|---|---|---|
| 1 | **Wyndham** | **No** | [`File:Wyndham Hotels & Resorts logo.svg`](https://commons.wikimedia.org/wiki/File:Wyndham_Hotels_%26_Resorts_logo.svg) · file: `https://upload.wikimedia.org/wikipedia/commons/f/fa/Wyndham_Hotels_%26_Resorts_logo.svg` | `{{PD-textlogo}}` + `{{Trademarked}}` (Commons) | Tag confirmed via API. Rendered the SVG: mark is "WYNDHAM / HOTELS & RESORTS" **plus a swept arc device** beneath the wordmark. Not type-only. | **Text mark** — PD-textlogo tag contestable on a device mark; not relied on |
| 2 | **Choice Hotels** | **No** | [`File:Choice Hotels logo.svg`](https://commons.wikimedia.org/wiki/File:Choice_Hotels_logo.svg) · file: `https://upload.wikimedia.org/wikipedia/commons/e/e1/Choice_Hotels_logo.svg` | `{{PD-textlogo}}` + `{{Trademarked}}` (Commons) | Tag confirmed via API; file-page wikitext read in full. Rendered: wordmark **plus a two-tone geometric "C" device**. Not type-only. (The older [`File:Choice Hotels Intl Logo.svg`](https://commons.wikimedia.org/wiki/File:Choice_Hotels_Intl_Logo.svg) *is* type-only but is a retired mark — reproducing an obsolete mark is its own accuracy problem.) | **Text mark** |
| 3 | **Best Western** | **No** | [`File:Best Western Hotels & Resorts logo.svg`](https://commons.wikimedia.org/wiki/File:Best_Western_Hotels_%26_Resorts_logo.svg) · file: `https://upload.wikimedia.org/wikipedia/commons/5/57/Best_Western_Hotels_%26_Resorts_logo.svg` | `{{PD-textlogo}}` + `{{Trademarked}}` (Commons) | Tag confirmed via API. Rendered: "BW │ Best Western / Hotels & Resorts" — **type and a rule only, no device**. Commons' stated basis is unusually strong: the 1993 predecessor mark was submitted to the **US Copyright Office, appealed twice, and refused all three times** for lack of artistic creativity; the decision is filed on Commons as [`File:Best Western logo US Copyright Office decision.pdf`](https://commons.wikimedia.org/wiki/File:Best_Western_logo_US_Copyright_Office_decision.pdf), and the current mark is simpler still. No deletion nomination on the file. **I read the Commons file page and the render; I did not read the USCO PDF itself and obtained no legal opinion.** | **Text mark in Phase 1 — flagged to counsel** (strongest of the nine if a vector row is ever wanted) |
| 4 | **IHG** | **No** | [`File:IHG Hotels & Resorts logo.svg`](https://commons.wikimedia.org/wiki/File:IHG_Hotels_%26_Resorts_logo.svg) · file: `https://upload.wikimedia.org/wikipedia/commons/9/93/IHG_Hotels_%26_Resorts_logo.svg` | `{{PD-textlogo}}` + `{{Trademarked}}` (Commons) | Tag confirmed via API. Rendered: "IHG / HOTELS & RESORTS" — **pure type, no device**. Sourced from IHG's own plc asset (`ihgplc.com/assets/images/logos/IHG_Secondary_Horizontal_Logo_Black_RGB.svg`), current mark since 2021-02-05. No deletion nomination. **Copyright tag verified; trademark usage not cleared.** | **Text mark in Phase 1 — flagged to counsel** (second-strongest) |
| 5 | **Radisson** | **No** | [`File:Radisson Hotels logo.svg`](https://commons.wikimedia.org/wiki/File:Radisson_Hotels_logo.svg) · file: `https://upload.wikimedia.org/wikipedia/commons/7/74/Radisson_Hotels_logo.svg` | `{{PD-textlogo}}` + `{{Trademarked}}` (Commons) | Tag confirmed via API. Rendered: **"RH" monogram inside a filled circle device** + "RADISSON / HOTELS". Not type-only. Same for [`File:Radisson Hotel Group logo.svg`](https://commons.wikimedia.org/wiki/File:Radisson_Hotel_Group_logo.svg) ("RHG" roundel). | **Text mark** |
| 6 | **Sonesta** | **No** | **None exists.** No Sonesta logo file on Wikimedia Commons (searched files namespace). The only Wikipedia file is [`File:Sonesta International Hotels logo.png`](https://en.wikipedia.org/wiki/File:Sonesta_International_Hotels_logo.png) on **English Wikipedia, not Commons**. | `{{Non-free logo}}` with a `{{logo fur}}` fair-use rationale scoped to the Sonesta article infobox | Read the enwiki file-page wikitext directly. Explicitly **non-free**; its fair-use rationale covers Wikipedia's own encyclopedic use and confers nothing on us. | **Text mark** — no free vector exists, full stop |
| 7 | **Hilton** | **No** | [`File:Hilton Worldwide logo.svg`](https://commons.wikimedia.org/wiki/File:Hilton_Worldwide_logo.svg) and [`File:HiltonHotelsLogo.svg`](https://commons.wikimedia.org/wiki/File:HiltonHotelsLogo.svg) | Both `{{PD-textlogo}}` + `{{Trademarked}}` (Commons) | Tags confirmed via API. Rendered both: `HiltonHotelsLogo.svg` carries the **"H"-in-oval device**. `Hilton Worldwide logo.svg` is a **potrace auto-trace** (metadata: "Created by potrace 1.13") whose first path draws a **rectangular frame around the wordmark** that is not part of the mark — i.e. an inaccurate reproduction. Neither is a clean, current, type-only Hilton asset. | **Text mark** |
| 8 | **Marriott** | **No** | [`File:Marriott Logo.svg`](https://commons.wikimedia.org/wiki/File:Marriott_Logo.svg) and [`File:Marriott hotels logo14.svg`](https://commons.wikimedia.org/wiki/File:Marriott_hotels_logo14.svg) | Both `{{PD-textlogo}}` (+ `{{Trademark}}` / `{{Trademarked}}`) (Commons) | Tags confirmed via API; wikitext read. `Marriott Logo.svg` is a **2007 upload transferred from de.wikipedia with author "unknown" and source literally "nicht angegeben" (not specified)**, PD claimed under German *Schöpfungshöhe*; it renders the retired "Marriott HOTELS·RESORTS·SUITES" mark with the **stylized M**. `Marriott hotels logo14.svg` renders the **two-stroke "M" device**, credited to Grey NY as designer. Both carry a device; neither has clean provenance. | **Text mark** |
| 9 | **Hyatt** | **No** | [`File:Hyatt Logo.svg`](https://commons.wikimedia.org/wiki/File:Hyatt_Logo.svg) · file: `https://upload.wikimedia.org/wikipedia/commons/9/91/Hyatt_Logo.svg` | `{{PD-textlogo}}` + `{{Trademarked}}` (Commons) | Tag confirmed via API; wikitext read. Rendered: "HYATT" **plus the swept arc device** underlining the wordmark. Not type-only. Provenance is also weak — sourced from a 2011 **Jet Airways** loyalty-programme PDF via the Internet Archive, not from Hyatt. | **Text mark** |
| — | **"& independents"** | n/a | n/a — our own copy | n/a | Not a third-party mark. Exported as `INDEPENDENTS_MARK`, deliberately outside `FranchiseFlag[]` so it can never acquire trademark treatment. | **Ships as written** |

### What was checked and found absent
- No candidate file carried a Creative Commons or other affirmative free licence — every free-ish file relies on `{{PD-textlogo}}` (i.e. "no copyright to license").
- No franchisor press-kit or brand-portal terms were reviewed. Those portals generally condition mark use on a franchise/licensee relationship, which we do not have and must not imply.
- No trademark clearance of any kind was obtained for any of the nine.

---

## 3. Decision and why

Two of the nine (Best Western, IHG) have marks that are genuinely type-only with a well-founded copyright tag. Seven do not: six carry original graphic devices whose PD-textlogo tags are contestable, and Sonesta has no free file at all.

Shipping two vectors beside seven text marks would break ref 04's "uniform optical height" requirement and make the band read as a partner wall favouring two franchisors — precisely the effect the section is designed to avoid ("quiet familiarity, not a partner wall").

There is also a second gate independent of copyright. The marquee **grayscales every mark**. Recolouring a franchisor's logo violates essentially every hotel brand's usage guidelines regardless of copyright status. Setting the brand *name* in our own typography reproduces no mark at all, so that conflict never arises — and nominative use of a word is a materially narrower ask than reproducing a mark's trade dress. The text-mark row is therefore both the safer and the better-composed option.

**Phase 1 ships text marks for all nine.** The vector question is flagged to Razim/counsel, not resolved here (PHASE-1-EXECUTION §4.3: "If a mark is only available under press-kit/non-free terms, flag it for Razim/counsel instead of shipping it").

### If counsel later clears vectors
Rows 3 and 4 are the only ones with usable candidates; the exact file URLs and tags are above, so no re-research is needed. Flipping a row requires **all** of:
1. A dated PROJECT-MEMORY.md decision recording the clearance.
2. `logo`, `licence` and `source` populated on that entry in `site/content/brands.ts` (the `FranchiseFlag` contract requires provenance + licence on every sourced mark).
3. The SVG saved to `site/public/logos/<slug>.svg`.
4. This manifest updated in the same commit.
5. A resolution of the grayscale-vs-brand-guidelines conflict — either counsel accepts it, or that mark renders in its own colours, which ref 01 forbids inside this band. This conflict is the reason a partial clearance may still not be shippable.

---

## 4. Directory state

`site/public/logos/` — **empty, intentionally.** Do not add files to it without a manifest row above and a PROJECT-MEMORY.md entry.
