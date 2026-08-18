# Website → Monday intake contract

**Status:** `provisional` — becomes `approved` when Dino confirms the write target and returns the column map (§5). Build (P10) proceeds against this contract in dry-run mode until then.
**Date:** 2026-08-17 · **Owner:** Razim · **Sources:** `02 - RAZIM DEPLOYMENT SETTINGS REQUIRED - v2` ("Protected intake"), `01 - START HERE - v2` §2 ("Forms, privacy and accessibility"), `HOKUTEN MONDAY CRM GUIDE - v1.0` (Boards 1–2, "The rules", "Safety rails"). Exact workspace/board IDs are deliberately **not** repeated here — they live in the deployment-settings document and in Vercel env vars only.

## 0. Why this document exists

Two of Dino's 2026-08-17 documents disagree about where a website submission lands, and the deployment doc names fields the CRM board does not have. Implementing either literally would either put unverified strangers into the mass-campaign board or create columns nobody asked for. This contract resolves both **without inventing anything**, and lists exactly what Dino (or his agents) must confirm.

| Deployment Settings v2 says | CRM Guide v1.0 says |
|---|---|
| "The protected route **defaults to the verified Contacts board**." | "Contacts — the single source of truth… **nothing unverified is allowed to sit in Contacts**." "A new person you're not sure about goes into **Unverified Leads**." "Graduating someone to Contacts is a **licensed-broker move**." "Mass email campaigns run from Contacts." |
| "`MONDAY_COLUMN_MAP_JSON` — map submission_type, source, page, name, company, email, phone, property, market, keys, brand, timeline, comments, consent fields, timestamp, and UTM values." | Contacts columns (complete list per the guide): Name · First Name · Last Name · People · Email · Phone · Company / Title · LinkedIn URL · Secondary Email/Phone · Primary Contact · Type · Relationship Category · Cadence · Role/Tag · Properties Mentioned · Last Contacted · Relationship Notes · Historical Notes · (auto) Days Since Last Contacted · Time Zone. **No** source / submission-type / property / market / keys / brand / timeline / comments / consent / timestamp / UTM columns. |
| "Create/update the contact." | "**Email is the primary key.** Before creating anyone, anywhere: search the email first." "Dedupe by email against Contacts BEFORE creating anyone here." |

## 1. The contract (default unless Dino edits it)

1. **Write target = `Unverified Leads`, group `New / Unverified`.** Never Contacts. The Contacts board is **read** for dedupe and receives at most an *Update* (comment) on an existing item — never a new item, never a column change. Rationale: the guide's structural rule beats the settings doc's "defaults to"; the settings doc itself says the route "defaults", i.e. is configurable.
2. **Never invent.** No new boards, groups, columns, labels, views or automations. The route writes only to column IDs present in `MONDAY_COLUMN_MAP_JSON`; every mutation is sent with `create_labels_if_missing: false`. A field with no mapped column, or a status/dropdown value that does not already exist as a label, goes into the item's **Update** and the **Relationship Notes** line instead. Column types are read from the API at first use; a type mismatch refuses the write and alerts.
3. **Dedupe by email before any create.** Search `Contacts` and `Unverified Leads` (and read-only `Buyer Leads`) by the Email column.
   - Found in **Contacts** → no new item. Post an Update on that item; alert. Do **not** touch Cadence, Group, People, Last Contacted or any column.
   - Found in **Unverified Leads** → post an Update on that item; do not create a second.
   - Not found → create in `Unverified Leads` / `New / Unverified`.
   - Same phone, different email → create, and say "possible duplicate (phone)" in the Update — never merge (guide: "preserve both records and flag it").
4. **Field mapping — existing columns only** (site field → Monday column):

   | Site field | Monday column (Unverified Leads = clone of Contacts) | Rule |
   |---|---|---|
   | `name` | **Name** (item name) + **First Name** + **Last Name** | split on the last space; single token → First = token, Last = "" |
   | `email` | **Email** | lower-cased, trimmed; the dedupe key |
   | `phone` | **Phone** | E.164; feeds the auto Time Zone column — that is the guide's intent |
   | `company` *(new optional field)* | **Company / Title** | company only; title blank |
   | — | **Type** | the existing label **`Lead`** exactly (guide: "Lead — still proving out") |
   | `hotel_name`, `city`, `state` | **Properties Mentioned** | `"<hotel_name> — <City>, <ST>"` |
   | `keys`, `brand`, `timeline`, `comments`, source, page, consent yes/no *(new optional fields)* | **Relationship Notes** — prepend one line in the guide's own format | `YYYYMMDD WEB: BOV request via thehokutengroup.com — <hotel>, <City, ST>; keys <n>; brand <x>; timeline <y>; SMS consent <yes/no>; comments: <z>` |
   | UTM (`utm_source/medium/campaign/term/content`), referrer, page path, submission id, server timestamp (UTC + Pacific), consent disclosure text + consent timestamp, user-agent (truncated) | **Update** (comment) on the item — a fixed structured block | never a column |
   | — | People, Relationship Category, Cadence, Role/Tag, Last Contacted, LinkedIn, Secondary Email/Phone, Primary Contact, Historical Notes | **never written** by the website. Last Contacted is a *team* touch, not a form submission. |
5. **No Deals, no Buyer Leads writes.** "Wants BOV → becomes a Deal" is a human decision with three preconditions and Managing-Director same-day review (guide, Board 4). The intake **alert** makes every submission same-day visible; humans create the Deal or move the person to Buyer Leads. A listing inquiry (if the site adds that CTA) uses the same route with the note prefix `Listing inquiry — <listing>`; humans move it.
6. **Consent is server-recorded** (Deployment Settings v2): SMS consent unchecked by default; a mobile number is required only if consent is ticked; the server writes yes/no, the disclosure text and its own timestamp; caller-supplied consent/timestamps are ignored. `submission_type` is fixed server-side to `BOV request` and appears in the Notes line and the Update.
7. **Success semantics.** The visitor sees success only after Monday returns an item id or update id, **or** the fallback email webhook confirms delivery. Anything else = failure state on the form + alert webhook. Monday failure + email success = success (visitor) + alert (team).
8. **Safety rails.** Config is rejected unless workspace and board IDs match the exact expected values (the route also verifies each board's workspace via the API on first use); the token exists only as a Vercel env var; edge/Vercel-Firewall rate limit on the route plus the in-function backstop; `ALLOWED_ORIGINS` enforced; honeypot field; payload size cap; every write logged with the Monday item id for the reversal trail ("an incorrect write already happened: stop, preserve the trail, notify, reverse only as a documented correction").
9. **`INTAKE_DRY_RUN=1`** builds and logs the exact mutation without sending — the mode the route ships in until §5 is answered and the test plan (§6) has run.

## 2. Env vars the route reads (names per Deployment Settings v2, plus three)

`MONDAY_API_TOKEN` · `MONDAY_WORKSPACE_ID` · `MONDAY_CONTACTS_BOARD_ID` (read + Update-on-existing only) · **`MONDAY_UNVERIFIED_BOARD_ID`** (write target) · **`MONDAY_INTAKE_GROUP_ID`** (`New / Unverified`) · `MONDAY_COLUMN_MAP_JSON` · `FALLBACK_EMAIL_WEBHOOK_URL` · `INTAKE_ALERT_WEBHOOK_URL` · `ALLOWED_ORIGINS` · **`INTAKE_DRY_RUN`**.

`MONDAY_COLUMN_MAP_JSON` template (IDs are Monday column ids on the **Unverified Leads** board; identical ids on Contacts because the boards are structural clones — verify, don't assume):

```json
{
  "name_first": "<column_id>",
  "name_last": "<column_id>",
  "email": "<column_id>",
  "phone": "<column_id>",
  "company": "<column_id>",
  "type": { "id": "<column_id>", "lead_label": "Lead" },
  "properties_mentioned": "<column_id>",
  "relationship_notes": "<column_id>"
}
```

Anything not in this map is written to the Update, never to a column.

## 3. Form fields (site side)

Existing, unchanged: `name`, `hotel_name`, `city`, `state`, `phone` (optional unless SMS consent), `email`, `sms_consent`, honeypot. **Added as optional** to satisfy Deployment Settings v2 / START HERE v2 §2: `company`, `keys`, `brand`, `timeline`, `comments`. Captured silently server-side: page path, referrer, UTM values, submission id, timestamps. Frozen: the SMS consent label and behaviour (`content/compliance.ts`), the "no agency relationship" statement (added per v2).

## 4. What the website will never do to the CRM

Create/rename/delete boards, groups, columns, labels, views, automations · write to Contacts except an Update on an existing item · set People, Cadence, Relationship Category, Role/Tag, Last Contacted · create Deals or Buyer Leads · merge records · write to the SHG Archive, the legacy "CRM" workspace, or the Japan workspace.

## 5. What Dino (or his agents) must confirm — configuration, not code

1. **Write target** — `Unverified Leads / New / Unverified` (recommended) or insist on Contacts (against the CRM guide; say so explicitly if so).
2. **Board and group IDs** for Unverified Leads and its `New / Unverified` group.
3. **Column IDs** for the eight columns in the template above, on Unverified Leads (and confirm they are identical on Contacts).
4. **The exact existing label text** for Type = Lead (or the label to use).
5. **People** — leave unassigned (recommended) or assign to a named person.
6. **Fallback email address** for the email webhook and the **alert destination** (email/Slack/WhatsApp) — both tested.
7. **API token** — from an account with member access to the workspace, or permission for Razim to mint one. With a token, Razim can pull items 2–4 himself read-only in minutes; Dino then only confirms item 1 and 4.
8. **Test allowance** (§6): one clearly named test item in `Unverified Leads / Not a Fit`, deleted after; or approve dry-run-only sign-off.

## 6. Test plan (staged, before `INTAKE_DRY_RUN` is turned off)

Deployment Settings v2's nine: validation · SMS-without-phone rejection · client consent-field tampering ignored · bot field · rate limit · Monday success · Monday failure + email success · total failure · alert delivery. Plus dedupe: existing Contacts email → Update only, no item · existing Unverified email → Update only · new email → item in `New / Unverified` · same phone/different email → item + "possible duplicate" note. Every write during testing uses the name prefix `WEBSITE TEST — delete me`; all test items are deleted and the deletions logged.

## 7. Change control

The map is config: adding a column later is Dino adding it in Monday and Razim adding one line to `MONDAY_COLUMN_MAP_JSON` — no code change, no redeploy of logic. The route never writes to a column it has not been told about.
