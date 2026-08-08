# PORT PACK 03 — DEALS (Closings, Listings, Stats, Assets)

**Status:** `provisional` — verbatim extraction, not yet claim-verified.
**Source of record (READ-ONLY):** `~/Documents/Dino/dino-sites/kwc-dinomonteverde/index.html` (2290 lines), plus `README.md`, `marketplace.html`, `vercel.json`.
**Extracted:** 2026-08-08.

> **Voice note (applies to every quoted block below).** The source is Dino-singular in its *narrative* copy but the deal cards themselves are already voice-neutral — no "I/my" appears in any closing card, listing card, badge, or stat caption. The only first-person plural already present is in the listings section blurb ("Current public hotel listings represented through Keller Williams Commercial…") and the closings sub-head ("Real transactions, real numbers."). **Nothing in section A/B/C/D requires a voice rewrite** except the section-head microcopy called out inline. Personal attribution that DOES need rewriting for Hokuten is flagged with 🔁.
>
> **Evidence gate.** Every number in sections A and D is a public claim under `CLAUDE.md` → it needs a `verified-current` row in the design skill's claims register (reference 06) before it ships on a Hokuten page. This document records what the old site said; it is **not** verification.
>
> **Sarhan flag.** No Sarhan Hotel Group branding appears anywhere in the deal data (sections A–E). It appears only in `index.html:19, 24, 1145, 1234, 1249` and `marketplace.html:375, 400` — all outside this doc's scope. **Do not carry any of it over.** Occurrences are listed in §F for the record; the strings themselves are not reproduced.
>
> **Secrets.** No API keys appear in any deal code path. The listings feed is explicitly keyless (`index.html:1750` — "no backend, no API key"). Nothing redacted was needed in this document.

---

## A) CLOSINGS — `#closings` (index.html:865–909)

### A.0 Section chrome (verbatim)

`index.html:865–871`

```html
<!-- RECENT CLOSINGS  (edit/add: copy one .closing-card block) -->
<section class="content" id="closings">
  <div class="section-head">
    <div class="section-head-text"><h2>Recent <span class="accent">closings</span>.</h2><p>Real transactions, real numbers.</p></div>
    <a href="https://www.crexi.com/profile/dino-monteverde-dinomon" target="_blank" rel="noopener" class="btn-outline">View all</a>
  </div>
  <div class="closings-grid">
```

🔁 The "View all" href is Dino's personal Crexi profile — Hokuten needs its own destination (team profile or an internal `/closings` page). Flag as **open decision**, do not ship the Dino URL.

Grid: `.closings-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }` (`index.html:341`), → 2 cols at `max-width: 1024px` (`:743`), → 1 col at `max-width: 640px` (`:778`).

---

### A.1 Carte Hotel — `index.html:872–877`

```html
    <div class="closing-card">
      <div class="card-photo"><img src="carte.jpg" alt="Carte Hotel" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><div class="placeholder" style="display:none;"><span>Carte Hotel</span><span style="opacity:.6;">Photo · 4:3</span></div><span class="badge closed">Recently Closed</span></div>
      <div class="card-title"><span class="card-title-text">Carte Hotel</span><span class="card-title-arrow">→</span></div>
      <div class="card-meta">San Diego, CA  ·  Lifestyle full-service  ·  JV / equity capital arranged</div>
      <div class="card-meta-strong"><span>96% LP/SP</span><span class="sep">·</span><span>74 days</span><span class="sep">·</span><span class="price">$61.49M</span></div>
    </div>
```

| Field | Verbatim value |
|---|---|
| Display name | `Carte Hotel` |
| Location line | `San Diego, CA` |
| Keys | *(none stated)* |
| Segment / service level | `Lifestyle full-service` |
| Note | `JV / equity capital arranged` |
| Mono metrics line | `96% LP/SP` · `74 days` · `$61.49M` |
| Price string | `$61.49M` |
| Badge | `Recently Closed` (class `badge closed`) |
| Photo | `carte.jpg` · alt `Carte Hotel` |
| Placeholder fallback | `Carte Hotel` / `Photo · 4:3` |

---

### A.2 Renaissance Reno Downtown — `index.html:878–883`

```html
    <div class="closing-card">
      <div class="card-photo"><img src="renaissance.jpg" alt="Renaissance Reno Downtown" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><div class="placeholder" style="display:none;"><span>Renaissance Reno</span><span style="opacity:.6;">Photo · 4:3</span></div><span class="badge closed">Recently Closed</span></div>
      <div class="card-title"><span class="card-title-text">Renaissance Reno Downtown</span><span class="card-title-arrow">→</span></div>
      <div class="card-meta">Reno, NV  ·  214 keys  ·  Upper-upscale</div>
      <div class="card-meta-strong"><span>91% LP/SP</span><span class="sep">·</span><span>140 days</span><span class="sep">·</span><span class="price">$50.1M</span></div>
    </div>
```

| Field | Verbatim value |
|---|---|
| Display name | `Renaissance Reno Downtown` |
| Location line | `Reno, NV` |
| Keys | `214 keys` |
| Segment / service level | `Upper-upscale` |
| Note | *(none)* |
| Mono metrics line | `91% LP/SP` · `140 days` · `$50.1M` |
| Price string | `$50.1M` |
| Badge | `Recently Closed` |
| Photo | `renaissance.jpg` · alt `Renaissance Reno Downtown` |
| Placeholder fallback | `Renaissance Reno` (**shorter than the card title** — intentional in source) / `Photo · 4:3` |

---

### A.3 The Last Hotel — `index.html:884–889`

```html
    <div class="closing-card">
      <div class="card-photo"><img src="cover_lasthotel.jpg" alt="The Last Hotel"><span class="badge closed">Recently Closed</span></div>
      <div class="card-title"><span class="card-title-text">The Last Hotel</span><span class="card-title-arrow">→</span></div>
      <div class="card-meta">Saint Louis, MO  ·  142 rooms  ·  Boutique</div>
      <div class="card-meta-strong"><span>83% LP/SP</span><span class="sep">·</span><span>92 days</span><span class="sep">·</span><span class="price">$13.2M</span></div>
    </div>
```

| Field | Verbatim value |
|---|---|
| Display name | `The Last Hotel` |
| Location line | `Saint Louis, MO` |
| Keys | `142 rooms` — **note: "rooms", not "keys".** Source is inconsistent (A.3 uses `rooms`, A.2/A.4 use `keys`). Quote as-is; normalizing to "keys" is a **copy decision for Razim**, not a silent fix. |
| Segment / service level | `Boutique` |
| Note | *(none)* |
| Mono metrics line | `83% LP/SP` · `92 days` · `$13.2M` |
| Price string | `$13.2M` |
| Badge | `Recently Closed` |
| Photo | `cover_lasthotel.jpg` · alt `The Last Hotel` |
| Placeholder fallback | *(none — no `onerror` handler, no `.placeholder` div)* |

---

### A.4 Holiday Inn Express Brooklyn — `index.html:890–895`

```html
    <div class="closing-card">
      <div class="card-photo"><img src="slide9_brooklyn.jpg" alt="Holiday Inn Express Brooklyn"><span class="badge closed">Recently Closed</span></div>
      <div class="card-title"><span class="card-title-text">Holiday Inn Express Brooklyn</span><span class="card-title-arrow">→</span></div>
      <div class="card-meta">Sunset Park, NY  ·  88 keys  ·  Select-service</div>
      <div class="card-meta-strong"><span>Confidential</span><span class="sep">·</span><span>$227K/key</span><span class="sep">·</span><span class="price">$20.0M</span></div>
    </div>
```

| Field | Verbatim value |
|---|---|
| Display name | `Holiday Inn Express Brooklyn` |
| Location line | `Sunset Park, NY` |
| Keys | `88 keys` |
| Segment / service level | `Select-service` |
| Note | *(none)* |
| Mono metrics line | `Confidential` · `$227K/key` · `$20.0M` |
| Price string | `$20.0M` |
| Badge | `Recently Closed` |
| Photo | `slide9_brooklyn.jpg` · alt `Holiday Inn Express Brooklyn` |
| Placeholder fallback | *(none)* |

**"Confidential" usage:** exactly **one** occurrence in the closings grid — slot 1 of A.4's metrics line, standing in for the LP/SP ratio. The `$227K/key` figure then occupies slot 2 where the other cards put days-on-market. This is the only card that substitutes a `$/key` metric for a duration metric. Preserve the slot substitution — do not add a synthetic "—" for the missing days.

---

### A.5 Radisson McAllen — `index.html:896–901`

```html
    <div class="closing-card">
      <div class="card-photo"><img src="slide10_mcallen.jpg" alt="Radisson McAllen"><span class="badge closed">Recently Closed</span></div>
      <div class="card-title"><span class="card-title-text">Radisson McAllen</span><span class="card-title-arrow">→</span></div>
      <div class="card-meta">McAllen, TX  ·  Branded full-service</div>
      <div class="card-meta-strong"><span>85% LP/SP</span><span class="sep">·</span><span>10 months</span><span class="sep">·</span><span class="price">$14.0M</span></div>
    </div>
```

| Field | Verbatim value |
|---|---|
| Display name | `Radisson McAllen` |
| Location line | `McAllen, TX` |
| Keys | *(none stated)* |
| Segment / service level | `Branded full-service` |
| Note | *(none)* |
| Mono metrics line | `85% LP/SP` · `10 months` · `$14.0M` |
| Price string | `$14.0M` |
| Badge | `Recently Closed` |
| Photo | `slide10_mcallen.jpg` · alt `Radisson McAllen` |
| Placeholder fallback | *(none)* |

**Duration unit note:** `10 months` — months, not days. A.1/A.2/A.3 use days; A.5 months; A.6 `1 year`. Duration is a free-text string, **not** a number + unit. Type it as `string`.

---

### A.6 Budget Inn & Rodeway Inn — `index.html:902–907`

```html
    <div class="closing-card">
      <div class="card-photo"><img src="slide12_rohnert.jpg" alt="Budget Inn & Rodeway Inn"><span class="badge closed">Recently Closed</span></div>
      <div class="card-title"><span class="card-title-text">Budget Inn & Rodeway Inn</span><span class="card-title-arrow">→</span></div>
      <div class="card-meta">Rohnert Park, CA  ·  Two-property portfolio</div>
      <div class="card-meta-strong"><span>Lease → Buy</span><span class="sep">·</span><span>1 year</span><span class="sep">·</span><span class="price">$14.0M</span></div>
    </div>
```

| Field | Verbatim value |
|---|---|
| Display name | `Budget Inn & Rodeway Inn` |
| Location line | `Rohnert Park, CA` |
| Keys | *(none stated)* |
| Segment / service level | `Two-property portfolio` (portfolio descriptor occupies the segment slot) |
| Note | *(none)* |
| Mono metrics line | `Lease → Buy` · `1 year` · `$14.0M` |
| Price string | `$14.0M` |
| Badge | `Recently Closed` |
| Photo | `slide12_rohnert.jpg` · alt `Budget Inn & Rodeway Inn` |
| Placeholder fallback | *(none)* |

**Character notes:** the title uses a raw `&` (unescaped ampersand in source — valid HTML5, but in JSX/TSX write `Budget Inn & Rodeway Inn` as a plain string, not `&amp;`). `Lease → Buy` uses **U+2192 RIGHTWARDS ARROW** with a space on each side.

---

### A.7 EXACT SEPARATOR CHARACTERS — verified by byte dump

Byte-verified via `od -c` on lines 875, 881, 887, 893, 899, 905:

**Meta line (`.card-meta`) separator** — between location / keys / segment / note:

```
SPACE SPACE U+00B7 SPACE SPACE      →  bytes: 20 20 C2 B7 20 20
```

i.e. the literal JS/TS string `"  ·  "` — **two** ASCII spaces, MIDDLE DOT (·, U+00B7), **two** ASCII spaces. This is byte-identical to the runtime join in the listings renderer (`index.html:1806`: `return parts.join("  ·  ");`), so closings and listings share one separator constant.

**Metrics line (`.card-meta-strong`) separator** — a *markup* separator, not a text one:

```html
<span class="sep">·</span>
```

A bare U+00B7 inside its own span. Spacing is CSS, not whitespace: `.card-meta-strong .sep { color: var(--rule); margin: 0 8px; }` (`index.html:388`). There is **no whitespace at all** between the metric `<span>`s and the `.sep` spans in the source HTML. Reproduce as elements, not as a joined string — otherwise the 8px optical spacing and the muted rule-colour separator are lost.

**Styling contract** (`index.html:387–389`):
```css
  .card-meta-strong { font-family: var(--mono); font-size: 11px; color: var(--ink); margin-top: 8px; letter-spacing: 0.04em; }
  .card-meta-strong .sep { color: var(--rule); margin: 0 8px; }
  .card-meta-strong .price { color: var(--gold); font-weight: 500; }
```
Only the **last** metric carries `class="price"` → gold + weight 500. The other two are default ink. Note the source uses the KIT gold `--gold: #B8943D` (`index.html:50`); **Hokuten web gold is `#B8902E`** per `CLAUDE.md` — use `#B8902E`, do not port the hex.

`.card-meta` reserves two lines so price rows align across a grid row: `.closing-card .card-meta { min-height: 2.6em; }` (`index.html:386`).

---

### A.8 TypeScript table — `Closing[]`

`metrics` is modelled as the ordered 3-tuple the source renders, because slot semantics vary per card (see A.4/A.5/A.6). `note` is only populated where the source has a 4th `.card-meta` segment.

```ts
type Closing = {
  name: string
  location: string
  keys?: string
  segment: string
  metrics: [string, string, string]   // rendered joined by <span class="sep">·</span>
  price: string
  photo: string
  note?: string
}

export const CLOSINGS: Closing[] = [
  {
    name: 'Carte Hotel',
    location: 'San Diego, CA',
    segment: 'Lifestyle full-service',
    metrics: ['96% LP/SP', '74 days', '$61.49M'],
    price: '$61.49M',
    photo: 'carte.jpg',
    note: 'JV / equity capital arranged',
  },
  {
    name: 'Renaissance Reno Downtown',
    location: 'Reno, NV',
    keys: '214 keys',
    segment: 'Upper-upscale',
    metrics: ['91% LP/SP', '140 days', '$50.1M'],
    price: '$50.1M',
    photo: 'renaissance.jpg',
  },
  {
    name: 'The Last Hotel',
    location: 'Saint Louis, MO',
    keys: '142 rooms',            // source says "rooms", not "keys" — verbatim
    segment: 'Boutique',
    metrics: ['83% LP/SP', '92 days', '$13.2M'],
    price: '$13.2M',
    photo: 'cover_lasthotel.jpg',
  },
  {
    name: 'Holiday Inn Express Brooklyn',
    location: 'Sunset Park, NY',
    keys: '88 keys',
    segment: 'Select-service',
    metrics: ['Confidential', '$227K/key', '$20.0M'],
    price: '$20.0M',
    photo: 'slide9_brooklyn.jpg',
  },
  {
    name: 'Radisson McAllen',
    location: 'McAllen, TX',
    segment: 'Branded full-service',
    metrics: ['85% LP/SP', '10 months', '$14.0M'],
    price: '$14.0M',
    photo: 'slide10_mcallen.jpg',
  },
  {
    name: 'Budget Inn & Rodeway Inn',
    location: 'Rohnert Park, CA',
    segment: 'Two-property portfolio',
    metrics: ['Lease → Buy', '1 year', '$14.0M'],   // U+2192 RIGHTWARDS ARROW
    price: '$14.0M',
    photo: 'slide12_rohnert.jpg',
  },
]
```

**Rendering rule:** `.card-meta` text = `[location, keys, segment, note].filter(Boolean).join('  ·  ')` — this reproduces all six cards byte-exactly (A.1 has no `keys` so its order is location · segment · note; A.5/A.6 have neither keys nor note).

Alt text for every closing photo equals the card's `name` — **except A.2**, whose `.placeholder` label is `Renaissance Reno` while `alt` and title are `Renaissance Reno Downtown`.

---

## B) ACTIVE LISTINGS — `#listings` (index.html:1114–1124) + feed renderer (1747–1906)

### ⚠️ Critical finding for the builder

**There is NO static listing data in the source.** The old site hardcodes zero listings. Every field the task asks for — display name, city/state, service level, key count, price string, cap-rate string — arrives **at runtime** from a third-party feed and is never present in the repo. The only listing-identifying data committed to the source is the `CREXI_LINKS` map (5 Monday item ids → 5 Crexi URLs) and its trailing comments.

`README.md:19–20` confirms it: *"The `ACTIVE LISTINGS` section is **no longer hardcoded.**"*

Consequence for Hokuten: either (a) port the feed integration, or (b) hand-author a static listing set. **This is an open decision, not something this document can resolve.** Everything in §B.5 below marked *derived* is inferred from URL slugs and comments — it is **not** verbatim source data and must not ship without verification.

### B.1 Section markup (verbatim) — `index.html:1114–1124`

```html
<!-- ACTIVE LISTINGS  (LIVE — Keller Williams Commercial listings; cards link to Crexi. See the LISTINGS script block) -->
<section class="content" id="listings" style="padding-top: 0;">
  <div class="section-head">
    <div class="section-head-text"><h2>Active <span class="accent">listings</span>.</h2><p>Current public hotel listings represented through Keller Williams Commercial. Open any listing on Crexi for full details and offering materials.</p></div>
    <a href="https://www.crexi.com/profile/dino-monteverde-dinomon" target="_blank" rel="noopener" class="btn-outline">View all listings on Crexi</a>
  </div>
  <!-- Renderer fills this grid. Default state is a graceful loading message; on error it falls back to a static CTA. -->
  <div class="listings-grid" id="listingsGrid">
    <div class="listings-status" id="listingsStatus">Loading current listings…</div>
  </div>
</section>
```

🔁 Sub-head says "represented through Keller Williams Commercial" — Hokuten-first branding means this becomes a Hokuten line with KW Commercial demoted to the footer compliance mark per `CLAUDE.md`. Quote retained above for the record; **do not ship verbatim.**
🔁 "View all listings on Crexi" href is Dino's personal profile — same open decision as A.0.

### B.2 Feed contract + security model (verbatim comment) — `index.html:1747–1765`

```js
  /* ============ ACTIVE LISTINGS → a100 Arms (Dino-only feed) ============
     Data source: a100arms.com syncs the Monday CRM deals board. We read its
     PURPOSE-BUILT public endpoint /api/public/kwc-listings directly from the
     browser — no backend, no API key.

     This endpoint is LEAK-PROOF BY DESIGN (built on the a100 side):
       • Returns ONLY Dino Monteverde's deals (team contains "Dino Monteverde").
       • Returns ONLY Listed + Onboarded deals.
       • Returns ONLY allowlisted public fields — the confidential a100_DealSnapshot
         is never included, so no off-market name / NOI / BOV / seller contact can
         ever reach this site.
       • Includes `photoUrl` once the a100 Drive→Storage photo sync has run.
     Response shape: { success, data: [ ...listings ], count }.

     We keep a light defensive filter client-side too (id present, and if a
     listingStage field is present it must be "Listed") — belt and suspenders.

     PHOTOS: each card uses `photoUrl` when present, else a branded placeholder.
  ============================================================================ */
```

Constants — `index.html:1767–1769, 1781–1782`:

```js
    var FEED_URL   = "https://a100arms.com/api/public/kwc-listings";
    var CREXI_PROFILE = "https://www.crexi.com/profile/dino-monteverde-dinomon";
    var SIGNUP_URL = "https://a100arms.com/signup";
```
```js
    var CACHE_KEY  = "kwc_listings_v2";   // bumped: new endpoint shape
    var CACHE_TTL  = 5 * 60 * 1000;   // 5 min — respects the endpoint's 30 req/min/IP limit
```

Feed field names read by the renderer: `id`, `name`, `city`, `stateCode`, `service`, `brand`, `rooms` (pre-formatted string e.g. `"50 rooms"`), `roomCount` (number), `price` (pre-formatted string), `cap` (pre-formatted string), `crexiLink`, `listingStage`, and photo under any of `photoUrl` / `photoURL` / `imageUrl` / `coverUrl`.

### B.3 FULL `CREXI_LINKS` map — VERBATIM, `index.html:1771–1780`

Reproduced byte-exact including the alignment whitespace and trailing comments:

```js
    // Card links forward to the public Crexi listing, keyed by the feed's
    // Monday item id. Any listing not mapped here falls back to the Crexi
    // profile — public listing cards never point at a100 Arms.
    var CREXI_LINKS = {
      "9119549004":  "https://www.crexi.com/properties/1936508/pennsylvania-the-lodge-at-split-rock-resort",            // The Lodge at Split Rock Resort
      "10846884635": "https://www.crexi.com/properties/2301818/pennsylvania-pocono-mountain-hotel-and-spa",             // Pocono Mountain Hotel and Spa
      "9105456786":  "https://www.crexi.com/properties/2320085/florida-developer-inn-highway-a-howard-johnson-by-wyndham",   // Developer Inn Highway (Kissimmee)
      "9105456863":  "https://www.crexi.com/properties/2348822/florida-developer-inn-downtown-orlando-a-baymont-by-wyndham", // Developer Inn Downtown Orlando
      "9105456898":  "https://www.crexi.com/properties/1995485/florida-baymont-by-wyndham-jacksonville-airport"         // Baymont Jacksonville Airport
    };
```

### B.4 Link-resolution logic — VERBATIM, `index.html:1830–1840`

```js
    function cardHTML(p){
      var id    = p.id;
      var name  = p.name || "Hospitality Asset";
      var photo = photoFor(p);
      // "View details" → the public Crexi listing (feed crexiLink first, then
      // the CREXI_LINKS map); unmapped listings fall back to the Crexi profile.
      // The feed value is only trusted when it really is a crexi.com URL, so a
      // public card can never resolve to a100 Arms.
      var feedLink = typeof p.crexiLink === "string" && /^https:\/\/(www\.)?crexi\.com\//i.test(p.crexiLink)
        ? p.crexiLink : null;
      var deal  = feedLink || CREXI_LINKS[String(id)] || CREXI_PROFILE;
```

**Three-tier precedence, in order:**
1. `p.crexiLink` from the feed — **only if** it matches `/^https:\/\/(www\.)?crexi\.com\//i`. An untrusted or non-Crexi value is discarded (this is the guard that stops a public card ever pointing at a100 Arms).
2. `CREXI_LINKS[String(id)]` — the committed map above. Note `String(id)` : the feed may deliver a numeric id, keys are strings.
3. `CREXI_PROFILE` — `https://www.crexi.com/profile/dino-monteverde-dinomon`.

Card anchor and photo (`index.html:1842–1855`):

```js
      var photoInner = photo
        ? '<img src="' + esc(photo) + '" alt="' + esc(name) + '" loading="lazy" referrerpolicy="no-referrer">'
        : '<div class="placeholder"><span>Property Photo</span></div>';
      return ''
        + '<a class="listing-card" href="' + esc(deal) + '" target="_blank" rel="noopener" style="text-decoration:none; color:inherit; display:block;">'
        +   '<div class="card-photo">'
        +     photoInner
        +     '<span class="badge active">Active</span>'
        +     '<div class="card-photo-overlay"><span class="btn-primary">View details</span></div>'
        +   '</div>'
        +   '<div class="card-title"><span class="card-title-text">' + esc(name) + '</span><span class="card-title-arrow">→</span></div>'
        +   '<div class="card-meta">' + esc(metaLine(p)) + '</div>'
        +   '<div class="listing-price">' + esc(priceText(p)) + (cap ? ' <span class="listing-cap">· ' + esc(cap) + '</span>' : '') + '</div>'
        + '</a>';
```

Defensive filter + empty/error states (`index.html:1858–1878`):

```js
      var listed = (rows || []).filter(function(p){
        return p && p.id && (p.listingStage == null || p.listingStage === "Listed");
      });

      if (!listed.length){
        grid.innerHTML = '<div class="listings-status">No active listings right now — '
          + '<a href="' + SIGNUP_URL + '" target="_blank" rel="noopener">request off-market access</a>.</div>';
        return;
      }
```
```js
    function fail(){
      // Graceful fallback: never leave a broken/empty grid.
      grid.innerHTML = '<div class="listings-status">Listings are temporarily unavailable. '
        + '<a href="' + CREXI_PROFILE + '" target="_blank" rel="noopener">View all listings on Crexi →</a></div>';
    }
```

Three status strings, verbatim:
| State | String |
|---|---|
| Loading (server-rendered default) | `Loading current listings…` (U+2026 ellipsis) |
| Empty | `No active listings right now — request off-market access.` (em dash U+2014; "request off-market access" is the link, trailing `.` outside it, → `https://a100arms.com/signup`) |
| Error | `Listings are temporarily unavailable. View all listings on Crexi →` (link text carries the U+2192 arrow) |

🔁 The empty-state links to `a100arms.com/signup`. Hokuten's off-market channel destination is an **open decision** — do not carry the a100 signup URL over without a call from Razim.

### B.5 Per-listing table

**Verbatim columns:** Monday id, resolved Crexi URL, comment label. **All other columns are *derived* from the URL slug** and are marked so — they are NOT in the source.

| # | Monday id (verbatim) | Comment label (verbatim) | Resolved Crexi URL (verbatim) | City *(derived)* | State *(derived)* | Brand *(derived from slug)* |
|---|---|---|---|---|---|---|
| 1 | `9119549004` | `The Lodge at Split Rock Resort` | `https://www.crexi.com/properties/1936508/pennsylvania-the-lodge-at-split-rock-resort` | — *(slug says Pennsylvania only)* | `PA` | *(independent resort — none in slug)* |
| 2 | `10846884635` | `Pocono Mountain Hotel and Spa` | `https://www.crexi.com/properties/2301818/pennsylvania-pocono-mountain-hotel-and-spa` | — *(Pocono region)* | `PA` | *(none in slug)* |
| 3 | `9105456786` | `Developer Inn Highway (Kissimmee)` | `https://www.crexi.com/properties/2320085/florida-developer-inn-highway-a-howard-johnson-by-wyndham` | `Kissimmee` *(from comment)* | `FL` | `Howard Johnson by Wyndham` |
| 4 | `9105456863` | `Developer Inn Downtown Orlando` | `https://www.crexi.com/properties/2348822/florida-developer-inn-downtown-orlando-a-baymont-by-wyndham` | `Orlando` *(from comment)* | `FL` | `Baymont by Wyndham` |
| 5 | `9105456898` | `Baymont Jacksonville Airport` | `https://www.crexi.com/properties/1995485/florida-baymont-by-wyndham-jacksonville-airport` | `Jacksonville` *(from comment)* | `FL` | `Baymont by Wyndham` |

**Not present in source for ANY listing:** service level, key count, price string, cap-rate string, photo, status other than the hardcoded `Active` badge. All would come from the feed. **Do not invent them.**

Every rendered listing card gets `<span class="badge active">Active</span>` unconditionally (`index.html:1849`) — there is no per-listing status branch in the source. Status therefore maps to `'listed'` for all five.

### B.6 TypeScript table — `Listing[]`

```ts
type Listing = {
  id: string
  name: string
  city: string
  stateCode: string
  roomCount?: number
  serviceLevel?: string
  brand?: string
  price?: string
  displayCapRate?: string
  status: 'exclusive' | 'off-market' | 'in-contract' | 'closed' | 'listed'
  crexiUrl?: string
  photo?: string
}

// SOURCE TRUTH = only `id` + `crexiUrl` + the comment label used as `name`.
// city / stateCode / brand are DERIVED from the Crexi slug — mark provisional,
// verify against Crexi before shipping. roomCount / serviceLevel / price /
// displayCapRate / photo are NOT in the source at all: feed-supplied at runtime.
export const LISTINGS: Listing[] = [
  {
    id: '9119549004',
    name: 'The Lodge at Split Rock Resort',
    city: '',                 // NOT IN SOURCE — slug gives state only
    stateCode: 'PA',          // derived
    status: 'listed',
    crexiUrl: 'https://www.crexi.com/properties/1936508/pennsylvania-the-lodge-at-split-rock-resort',
  },
  {
    id: '10846884635',
    name: 'Pocono Mountain Hotel and Spa',
    city: '',                 // NOT IN SOURCE
    stateCode: 'PA',          // derived
    status: 'listed',
    crexiUrl: 'https://www.crexi.com/properties/2301818/pennsylvania-pocono-mountain-hotel-and-spa',
  },
  {
    id: '9105456786',
    name: 'Developer Inn Highway',
    city: 'Kissimmee',        // derived from source comment "(Kissimmee)"
    stateCode: 'FL',          // derived
    brand: 'Howard Johnson by Wyndham',  // derived from slug
    status: 'listed',
    crexiUrl: 'https://www.crexi.com/properties/2320085/florida-developer-inn-highway-a-howard-johnson-by-wyndham',
  },
  {
    id: '9105456863',
    name: 'Developer Inn Downtown Orlando',
    city: 'Orlando',          // derived
    stateCode: 'FL',          // derived
    brand: 'Baymont by Wyndham',         // derived from slug
    status: 'listed',
    crexiUrl: 'https://www.crexi.com/properties/2348822/florida-developer-inn-downtown-orlando-a-baymont-by-wyndham',
  },
  {
    id: '9105456898',
    name: 'Baymont Jacksonville Airport',
    city: 'Jacksonville',     // derived
    stateCode: 'FL',          // derived
    brand: 'Baymont by Wyndham',         // derived from slug
    status: 'listed',
    crexiUrl: 'https://www.crexi.com/properties/1995485/florida-baymont-by-wyndham-jacksonville-airport',
  },
]

// The committed map, keyed by Monday item id — tier 2 of the resolver below.
// Byte-exact values from index.html:1774–1780.
export const CREXI_LINKS: Record<string, string> = {
  '9119549004':  'https://www.crexi.com/properties/1936508/pennsylvania-the-lodge-at-split-rock-resort',
  '10846884635': 'https://www.crexi.com/properties/2301818/pennsylvania-pocono-mountain-hotel-and-spa',
  '9105456786':  'https://www.crexi.com/properties/2320085/florida-developer-inn-highway-a-howard-johnson-by-wyndham',
  '9105456863':  'https://www.crexi.com/properties/2348822/florida-developer-inn-downtown-orlando-a-baymont-by-wyndham',
  '9105456898':  'https://www.crexi.com/properties/1995485/florida-baymont-by-wyndham-jacksonville-airport',
}

export const CREXI_PROFILE_FALLBACK =
  'https://www.crexi.com/profile/dino-monteverde-dinomon'   // 🔁 Dino-personal — replace for Hokuten

export function resolveCrexiUrl(feedCrexiLink: unknown, id: string | number): string {
  const trusted =
    typeof feedCrexiLink === 'string' && /^https:\/\/(www\.)?crexi\.com\//i.test(feedCrexiLink)
      ? feedCrexiLink
      : null
  return trusted ?? CREXI_LINKS[String(id)] ?? CREXI_PROFILE_FALLBACK
}
```

Listing grid + card CSS (`index.html:553–576`) — aspect ratio differs from closings. Reproduced with the source's own comments and indentation:
```css
  .listings-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  /* loading / empty / error states (renderer-controlled) */
  .listings-status {
    grid-column: 1 / -1; padding: 40px 0; text-align: center;
    font-family: var(--mono); font-size: 10.5px; color: var(--meta);
    letter-spacing: 0.16em; text-transform: uppercase;
  }
  .listings-status a { color: var(--gold); text-decoration: none; border-bottom: 1px solid var(--gold); padding-bottom: 2px; }
  .listing-card { cursor: pointer; }
  .listing-card .card-photo { aspect-ratio: 5 / 4; position: relative; }
  .listing-card .card-photo-overlay {
    position: absolute; inset: 0; background: rgba(26, 28, 31, 0.55);
    display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 240ms;
  }
  .listing-card:hover .card-photo-overlay { opacity: 1; }
  .listing-card:hover .card-photo img { filter: grayscale(0%) contrast(1); }
  .listing-card .card-photo-overlay .btn-primary { background: var(--gold); color: var(--ink); }
  .listing-price { font-family: var(--mono); font-size: 22px; color: var(--gold); font-weight: 500; margin-top: 12px; }
  .listing-cap { font-size: 12px; color: var(--meta); font-weight: 400; letter-spacing: 0.02em; }

  /* touch reveal (mobile / no-hover) */
  .closing-card.tapped .card-photo img,
  .listing-card.tapped .card-photo img { filter: grayscale(0%) contrast(1); }
  .listing-card.tapped .card-photo-overlay { opacity: 1; }
```

The three `.tapped` rules (`index.html:573–576`) are the CSS half of the touch-reveal behaviour whose JS is at `:1735–1745` (§C.7) — they apply to **closings and listings alike**. Port them together or the tap does nothing.

**Closings = `aspect-ratio: 4 / 3`** (`index.html:346`), **listings = `aspect-ratio: 5 / 4`** (`index.html:562`). Not a typo — preserve both.

---

## C) DISPLAY / FORMATTING VOCABULARY

### C.1 Price format

Prices are **pre-formatted strings**, never numbers, on both closings and listings. The site never formats a listing price itself.

`index.html:1809–1814` — VERBATIM:
```js
    function priceText(p){
      // price is pre-formatted, e.g. "$11.00M". Treat $0 / blank as "on request".
      var v = p.price;
      if (!v || /^\$?-?0(\.0+)?\s*M?$/i.test(String(v).trim())) return "Price on request";
      return String(v);
    }
```

| Format | Where it appears | Examples from source |
|---|---|---|
| `$N.NNM` (2dp) | listings feed convention, per the code comment | `$11.00M` |
| `$N.NM` (1dp) | closings, hardcoded | `$50.1M`, `$13.2M`, `$20.0M`, `$14.0M` |
| `$NN.NNM` (2dp) | closings, hardcoded | `$61.49M` |
| `$NNNK/key` | closings per-key metric | `$227K/key` |
| `$NNNK` | **calculator only**, `index.html:1467/1469/1475/1477` | e.g. `$350K` — produced by `"$" + Math.round(v/1e3) + "K"` and `"$" + (Math.round(v/5000)*5) + "K"` |

**Closings decimal precision is inconsistent** (`$50.1M` 1dp vs `$61.49M` 2dp). Verbatim port. Do not normalize.

**`$350K` note:** this exact string does **not** appear in `index.html`. The `$…K` shape comes from the calculator's `money()` / `perKey()` / `roundTotal()` / `roundKey()` helpers (`index.html:1465–1477`) — sub-$1M values render as `$NNNK`, ≥$1M as `$N.NM`. Full detail belongs to the calculator port doc; recorded here only because it establishes the `$K` house style:
```js
    function money(v){
      if (v >= 1e6) return "$" + (v/1e6).toFixed(1) + "M";
      return "$" + Math.round(v/1e3) + "K";
    }
    function perKey(v){ return "$" + Math.round(v/1e3) + "K"; }
```

### C.2 "Price on Request" fallback — exact trigger

String is **`Price on request`** — lowercase `r` on "request". (The task brief wrote "Price on Request"; the source is lowercase. **Source wins.**)

Trigger — either condition:
1. `!v` — `p.price` is falsy: `undefined`, `null`, `""`, `0`.
2. `/^\$?-?0(\.0+)?\s*M?$/i.test(String(v).trim())` — the trimmed string is a zero value, with an optional leading `$`, an optional leading `-`, optional `.0`/`.00`/… decimals, optional whitespace, optional trailing `M`, case-insensitive.

Matches: `0`, `$0`, `-0`, `$0.00`, `$0.0M`, `0M`, `$-0.000 M`. Does **not** match `$0.5M` (`.5` ≠ `.0+`).

### C.3 Cap-rate format + suppression rule

`index.html:1816–1826` — VERBATIM:
```js
    // cap is pre-formatted, e.g. "8%+ Cap" / "0.00% Cap" / "-2.27% Cap".
    // Only show it when it's a meaningful positive figure — a 0% or negative cap
    // reads as broken to a visitor, so we hide it rather than display noise.
    function capText(p){
      var c = p.cap; if (!c) return "";
      var m = String(c).match(/-?\d+(\.\d+)?/);
      if (!m) return "";
      var n = parseFloat(m[0]);
      if (!isFinite(n) || n <= 0) return "";
      return String(c);
    }
```

Format: a pre-formatted string ending in the literal word `Cap`. Documented shapes: `8%+ Cap`, `0.00% Cap`, `-2.27% Cap`.

Suppression: extract the **first** signed decimal via `/-?\d+(\.\d+)?/`; hide (return `""`) when absent, non-finite, `0`, or negative. Only `n > 0` renders.

Rendered inline after the price, prefixed by a space + middot + space (`index.html:1854`):
```js
(cap ? ' <span class="listing-cap">· ' + esc(cap) + '</span>' : '')
```
i.e. literal `" "` then `"· "` inside the span — a **single-space** middot here, unlike the double-space meta separator. Result reads `$11.00M · 8%+ Cap`. Cap text is muted (`--meta`), 12px, next to a 22px gold mono price.

### C.4 Key-count format

`index.html:1794–1807` — VERBATIM:
```js
    // Build a "City, ST" meta line + keys from ONLY top-level fields.
    function metaLine(p){
      // Contract fields: city, stateCode, service, brand, rooms (pre-formatted
      // e.g. "50 rooms"), roomCount (number). Build "City, ST · Service · 50 keys".
      var parts = [];
      var place = [p.city || "", p.stateCode || ""].filter(Boolean).join(", ");
      if (place) parts.push(place);
      var svc = p.service || p.brand;
      if (svc && String(svc).toLowerCase() !== "independant" && String(svc).toLowerCase() !== "independent") parts.push(svc);
      // Prefer the numeric roomCount → "N keys"; fall back to the pre-formatted "rooms" string.
      if (p.roomCount){ parts.push(p.roomCount + " keys"); }
      else if (p.rooms){ parts.push(String(p.rooms).replace(/\brooms?\b/i, "keys")); }
      return parts.join("  ·  ");
    }
```

Rules:
- Place: `[city, stateCode].filter(Boolean).join(", ")` → `City, ST`. Omitted entirely if both blank.
- Service: `p.service || p.brand`. **Dropped** if the lowercased value is `"independant"` or `"independent"` — note the source deliberately handles the **misspelling** `independant` (a Monday CRM data artefact). Keep both checks.
- Keys: numeric `roomCount` → `` `${roomCount} keys` ``. Else the pre-formatted `rooms` string with `/\brooms?\b/i` → `keys` (so `"50 rooms"` → `"50 keys"`, `"1 room"` → `"1 keys"` — an unfixed edge case; reproduce or fix deliberately, don't fix silently).
- Join: `"  ·  "` (double-space middot — same constant as closings, §A.7).

The site's canonical unit word is **keys**, actively rewritten from "rooms" — the one exception being the hardcoded closing A.3 (`142 rooms`), which the renderer never touches.

### C.5 Meta-line separator (canonical)

One constant, both sections: `"  ·  "` = `SPACE SPACE U+00B7 SPACE SPACE`. Byte-verified in §A.7.

Two other middot spacings exist and are **different**:
| Context | Separator | Source |
|---|---|---|
| `.card-meta` (closings + listings) | `"  ·  "` two spaces each side | `index.html:875` etc.; `:1806` |
| `.card-meta-strong` metrics | `<span class="sep">·</span>`, no text whitespace, 8px CSS margins | `index.html:876` etc.; `:388` |
| `.listing-cap` after price | `" "` + `"· "` — single space each side | `index.html:1854` |

### C.6 Badge label set + selection logic

Three CSS variants exist (`index.html:365–372`):
```css
  .badge {
    position: absolute; top: 12px; right: 12px;
    padding: 5px 9px; font-family: var(--mono); font-size: 8.5px;
    letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600;
  }
  .badge.closed { background: var(--ink); color: var(--surface); }
  .badge.active { background: var(--gold); color: var(--ink); }
  .badge.contract { border: 1px solid var(--gold); color: var(--gold); background: transparent; }
```

| Class | Label used in source | Selection logic | Visual |
|---|---|---|---|
| `badge closed` | `Recently Closed` | **Hardcoded** on all 6 closing cards. No branch. | ink bg / surface text |
| `badge active` | `Active` | **Hardcoded** on every rendered listing card (`index.html:1849`). No branch — the feed already returns only `Listed` deals, so status never varies. | gold bg / ink text |
| `badge contract` | **never used** — no label string exists anywhere in the source | Dead style. Reserved for an in-contract state that was styled but never shipped. | gold outline / gold text / transparent |

**There is no badge-picking function anywhere in the source.** Any Hokuten status machine (`exclusive`/`off-market`/`in-contract`) is **new design**, not a port. The `badge contract` styling is the only surviving hint at intent; `'in-contract'` should adopt it.

Labels are authored in **Title Case** and rendered uppercase by CSS (`text-transform: uppercase`) — so the DOM text is `Recently Closed` / `Active` while the pixels read `RECENTLY CLOSED` / `ACTIVE`. Keep the Title Case in data; do the uppercasing in CSS (screen-reader friendly).

### C.7 Other card vocabulary

| Element | Verbatim string | Source |
|---|---|---|
| Card title arrow | `→` (U+2192) in `<span class="card-title-arrow">`, translates 4px on hover | `:874` etc., `:378–379` |
| Listing hover overlay CTA | `View details` | `:1850` |
| Listing photo placeholder | `Property Photo` | `:1844` |
| Closing photo placeholder (A.1/A.2 only) | `<name>` + `Photo · 4:3` (single spaces around this middot) | `:873, :879` |
| Fallback listing name | `Hospitality Asset` (when `p.name` is falsy) | `:1832` |
| Photo treatment | `filter: grayscale(100%) contrast(1.04)` → `grayscale(0%) contrast(1)` on hover, 0.4s | `:352–357` |
| Touch devices | `(hover: none)` → tap toggles `.tapped` to reveal colour; taps on `<a>` pass through | `:1735–1745` |

---

## D) TRUST METRICS / STATS

**There is no `#stats` section.** The metrics live in `.trust-strip` inside the hero (`index.html:857–862`) and are restated in prose in the team bio (`index.html:1137`). A separate, unrelated `.process-reach` block sits in `#methodology` (`index.html:1106–1111`) — included below because it is easily mistaken for the stat set.

### D.1 Hero trust strip — VERBATIM, `index.html:857–862`

```html
  <div class="trust-strip">
    <div class="trust-stat"><div class="label">Aggregate Volume</div><div class="figure">$<span class="accent">200</span>M+</div></div>
    <div class="trust-stat"><div class="label">Closed Transactions</div><div class="figure"><span class="accent">12</span></div></div>
    <div class="trust-stat"><div class="label">Total Square Feet</div><div class="figure">836<span class="accent">K+</span></div></div>
    <div class="trust-stat"><div class="label">CoStar Power Broker</div><div class="figure quarters">Q3&nbsp;'25 · Q1&nbsp;'26 · Q2&nbsp;'26</div></div>
  </div>
```

| # | Caption (verbatim) | Figure (rendered text) | Gold-italic `.accent` span |
|---|---|---|---|
| 1 | `Aggregate Volume` | `$200M+` | `200` |
| 2 | `Closed Transactions` | `12` | `12` (whole figure) |
| 3 | `Total Square Feet` | `836K+` | `K+` |
| 4 | `CoStar Power Broker` | `Q3 '25 · Q1 '26 · Q2 '26` | *(none — plain run)* |

**Stat 4 typography note:** the quarters are joined by ` · ` (single spaces around U+00B7), and each quarter uses a **non-breaking space** (`&nbsp;`, U+00A0) between `Q3` and `'25` so a narrow cell never breaks mid-date. The comment says so explicitly (`index.html:290–292`):
```css
  /* Award quarters are a text run, not a number — smaller, and if the cell is
     too narrow it breaks between quarters (never mid-date, via &nbsp;). */
  .trust-stat .figure.quarters { font-size: 15px; line-height: 1.35; padding-top: 8px; }
```
The `.quarters` modifier drops the figure from 30px to 15px — **it is text, not a number.** The brief's shorthand "3x CoStar" is a *summary*; the site never renders "3x". It renders the three quarters. Port the quarters.

Trust-strip styling (`index.html:266–289`):
```css
  .trust-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 48px;
    max-width: 880px;
    padding-bottom: 80px;
  }
  .trust-stat { border-top: 0.5px solid var(--gold); padding-top: 18px; }
  .trust-stat .label {
    font-family: var(--mono);
    font-size: 9px;
    color: var(--gold);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .trust-stat .figure {
    font-family: var(--serif);
    font-size: 30px;
    font-weight: 500;
    line-height: 1;
    color: var(--ink);
  }
  .trust-stat .figure .accent { font-style: italic; color: var(--gold); }
```
Hero override — dark photo background (`index.html:246–249`): `section.hero .trust-stat .figure { color: #f7f6f2; }`.
Mobile (`index.html:775–777`) — verbatim:
```css
    .trust-strip { grid-template-columns: repeat(2, 1fr); gap: 18px 16px; padding-bottom: 56px; }
    .trust-stat .figure { font-size: 24px; }
    .trust-stat .label { font-size: 8px; letter-spacing: 0.12em; }
```
i.e. 2 columns, `gap: 18px 16px`, `padding-bottom` drops 80px → 56px, figure 30px → 24px, label 9px → 8px with `letter-spacing` 0.18em → 0.12em.

### D.2 Same stats restated in prose — `index.html:1137`

```html
        <div class="team-creds">$200M+ across 12 hospitality transactions — 11 hotel-asset transactions + 1 hotel-management-company M&amp;A. Three-time CoStar Power Broker Quarterly Deals winner — Q3 2025, Q1 2026, and Q2 2026. USMC veteran. Former hotel owner-operator.</div>
```

This is the **only place the "12" is decomposed**: `11 hotel-asset transactions + 1 hotel-management-company M&A`. Any Hokuten claim of "12 closed transactions" must carry that footnote or it overstates hotel-asset count. Also the only place the award is spelled out: `Three-time CoStar Power Broker Quarterly Deals winner` with full years `Q3 2025, Q1 2026, and Q2 2026` (long form here; abbreviated `Q3 '25` in the strip).

🔁 `USMC veteran. Former hotel owner-operator.` is Dino-personal. 🔁 The whole `.team-creds` block is one broker's record — under Hokuten team-first voice it becomes either a team aggregate or a per-person bio field. **Open decision.** The hero strip figures are already voice-neutral and carry over unchanged.

### D.3 Adjacent — `.process-reach` (NOT the trust strip) — `index.html:1106–1111`

```html
  <div class="process-reach">
    <div><div class="figure">~400K</div><div class="desc">Hotel-investor reach — primarily CoStar, supplemented by Crexi distribution and direct outreach.</div></div>
    <div><div class="figure">~60K</div><div class="desc">Hotel owners reached through direct voice outreach.</div></div>
    <div><div class="figure">1,500</div><div class="desc">Direct hotel-owner relationships.</div></div>
    <div><div class="figure">30K</div><div class="desc">SMS-capable contacts.</div></div>
  </div>
```

| Figure | Caption |
|---|---|
| `~400K` | `Hotel-investor reach — primarily CoStar, supplemented by Crexi distribution and direct outreach.` |
| `~60K` | `Hotel owners reached through direct voice outreach.` |
| `1,500` | `Direct hotel-owner relationships.` |
| `30K` | `SMS-capable contacts.` |

Note the tilde-prefixed approximations (`~400K`, `~60K`) — deliberate hedging. Carry the tildes.

### D.4 TypeScript table — `Stat[]`

```ts
type Stat = { value: string; label: string; detail?: string }

export const TRUST_STATS: Stat[] = [
  {
    value: '$200M+',
    label: 'Aggregate Volume',
    // accent span wraps "200"
  },
  {
    value: '12',
    label: 'Closed Transactions',
    detail: '11 hotel-asset transactions + 1 hotel-management-company M&A',
    // accent span wraps the whole figure
  },
  {
    value: '836K+',
    label: 'Total Square Feet',
    // accent span wraps "K+"
  },
  {
    value: "Q3 '25 · Q1 '26 · Q2 '26",   // NBSP inside each quarter
    label: 'CoStar Power Broker',
    detail: 'Three-time CoStar Power Broker Quarterly Deals winner — Q3 2025, Q1 2026, and Q2 2026',
    // rendered with the .quarters modifier: 15px, no accent span
  },
]

export const PROCESS_REACH: Stat[] = [
  { value: '~400K', label: 'Hotel-investor reach — primarily CoStar, supplemented by Crexi distribution and direct outreach.' },
  { value: '~60K',  label: 'Hotel owners reached through direct voice outreach.' },
  { value: '1,500', label: 'Direct hotel-owner relationships.' },
  { value: '30K',   label: 'SMS-capable contacts.' },
]
```

For `PROCESS_REACH` the source has no short caption + long detail split — the whole sentence *is* the caption. Mapped to `label` accordingly.

⚠️ **All eight values above are unverified public claims.** Evidence gate applies: each needs a `verified-current` row before it renders on a Hokuten page.

---

## E) ASSETS

### E.1 Deal photos — all exist in the source repo root

| File | Deal | Declared dims | Intrinsic dims | Alt text (verbatim) | Bytes |
|---|---|---|---|---|---|
| `carte.jpg` | A.1 Carte Hotel | *(none)* | 1024 × 767 | `Carte Hotel` | 177,715 |
| `renaissance.jpg` | A.2 Renaissance Reno Downtown | *(none)* | 1199 × 630 | `Renaissance Reno Downtown` | 137,734 |
| `cover_lasthotel.jpg` | A.3 The Last Hotel | *(none)* | 1024 × 710 | `The Last Hotel` | 317,516 |
| `slide9_brooklyn.jpg` | A.4 Holiday Inn Express Brooklyn | *(none)* | 3840 × 2560 | `Holiday Inn Express Brooklyn` | 1,224,955 ⚠️ |
| `slide10_mcallen.jpg` | A.5 Radisson McAllen | *(none)* | 1280 × 960 | `Radisson McAllen` | 203,375 |
| `slide12_rohnert.jpg` | A.6 Budget Inn & Rodeway Inn | *(none)* | 968 × 607 | `Budget Inn & Rodeway Inn` | 121,749 |

**No `width`/`height` attributes are declared on any image in the source** — a CLS liability. Next.js `<Image>` must supply explicit dimensions; use the intrinsic values above. No `loading="lazy"` on closing images either (only feed-rendered listing images get it, `index.html:1843`).

⚠️ `slide9_brooklyn.jpg` is **1.2 MB at 3840×2560** for a card that renders at ~400px in a 4:3 frame. Must be re-encoded/resized on port. `cover_lasthotel.jpg` (318 KB) is next worst.

All six render behind `filter: grayscale(100%) contrast(1.04)`, colour on hover/tap.

### E.2 Hero video + poster — all exist

`index.html:842–849` — VERBATIM:
```html
<!-- HERO -->
<section class="hero">
  <video class="hero-video" autoplay muted loop playsinline webkit-playsinline preload="auto" poster="poster.jpg" disablepictureinpicture>
    <!-- MP4/H.264 first so iOS Safari (no WebM support) picks a playable source
         immediately and autoplays inline; WebM second for browsers that prefer it. -->
    <source src="hero.mp4" type="video/mp4">
    <source src="hero.webm" type="video/webm">
  </video>
```

| File | Role | Dims | Bytes |
|---|---|---|---|
| `hero.mp4` | first `<source>`, H.264 — **must stay first** for iOS Safari inline autoplay | — | 2,777,992 |
| `hero.webm` | second `<source>` | — | 2,384,228 |
| `poster.jpg` | `poster` attribute **and** the CSS background fallback | 1600 × 900 | 105,636 |

Poster doubles as a CSS background (`index.html:172–174`):
```css
    /* Background video layer; poster.jpg is the fallback behind it.
```
```css
    background: var(--dark) url("poster.jpg") center center / cover no-repeat;
```

Source-order comment is load-bearing (iOS has no WebM) — preserve MP4-first ordering.

Hokuten replaces the hero video with the ASCII hero per the design skill; poster/video assets are recorded for completeness but are **not** expected to port. Confirm before deleting.

### E.3 Non-deal assets referenced on the page

| File | Role | Source line | Dims | Bytes | Alt (verbatim) |
|---|---|---|---|---|---|
| `portrait_final.jpg` | Team portrait 🔁 Dino-personal | `:1133` | 919 × 1149 | 303,502 | `Dino Monteverde` |
| `kw-commercial.png` | Nav brand lockup mark | `:820` (also `marketplace.html:184`) | 225 × 225 | 9,190 | `Keller Williams Commercial` |
| `og-card-v2.jpg` | OG / Twitter card, declared 1200×630 | `:26, :27, :35` | 1200 × 630 | 68,993 | two distinct strings — `:31` + `:36`, see below |
| `favicon-48.png` | `<link rel="icon" sizes="48x48">` | `:37` | 48 × 48 | 3,244 | — |
| `apple-touch-icon.png` | `<link rel="apple-touch-icon">` | `:38` | 180 × 180 | 17,276 | — |

`og-card-v2.jpg` is the **only** asset with declared dimensions (`index.html:29–30`): `<meta property="og:image:width" content="1200">` / `height 630`. It carries **two different alt strings** — the long OG one and a shorter Twitter one. Both are 🔁 Dino-personal and must be rewritten; do not port either verbatim.

`index.html:31` — OG alt:
```html
<meta property="og:image:alt" content="Dino Monteverde — Senior Associate, Hospitality Investment Sales. Keller Williams Commercial · National Hospitality Division. 650.720.6995 · dino.monteverde@kw.com">
```
`index.html:36` — Twitter alt (shorter, truncated after the title; **not** a copy of the OG string):
```html
<meta name="twitter:image:alt" content="Dino Monteverde — Senior Associate, Hospitality Investment Sales.">
```
Both use `—` (U+2014 EM DASH) and the OG one uses `·` (U+00B7) with single spaces. The OG string is the only place on the page where the phone number and email appear inside an image alt — a scrape/PII consideration for the Hokuten rewrite.

### E.4 Files present in the source repo but NOT referenced by any deal code

`us-cities.min.json` (552,845 B — city autocomplete for the BOV form) and `api/ticker-data.js`. Neither is deal data; covered by other port docs.

**Every asset referenced in §E.1–E.3 exists in the source repo root** — no broken references, no remote-hosted deal images. Feed-supplied listing photos (`photoUrl`) are the only remote images and load with `referrerpolicy="no-referrer"` (`index.html:1843`).

---

## F) SARHAN OCCURRENCES — flagged, NOT ported

Per `CLAUDE.md`: no Sarhan Hotel Group branding carries over. Occurrences found, for deletion tracking only (strings not reproduced):

| File:line | Context |
|---|---|
| `index.html:19` | `<meta name="description">` tail |
| `index.html:24` | `og:site_name` |
| `index.html:1145` | `#team` → "The Platform" card `.role` + body + external link to `sarhanhotelgroup.com` (`:1147`) |
| `index.html:1234` | Footer affiliation stack |
| `index.html:1249` | Footer legal line + `sarhanhotelgroup.com` |
| `marketplace.html:375` | Footer affiliation stack |
| `marketplace.html:400` | Footer copyright line |

**None are inside the closings grid, the listings section, the feed renderer, the trust strip, or any asset filename/alt.** Sections A–E are Sarhan-clean.

---

## G) OPEN ITEMS FOR THE BUILDER

1. **`#listings` has no static data.** Port the a100arms feed, or hand-author listings. Blocking decision — see §B.
2. **Crexi destinations are Dino-personal** (profile URL ×3, all 5 property URLs). Needs a Hokuten decision: keep, replace with a Hokuten Crexi profile, or route to internal listing pages.
3. **`a100arms.com/signup` empty-state link** — is a100 Arms still the off-market channel under Hokuten?
4. **Closings `keys` inconsistency** — A.3 says `142 rooms`, A.2/A.4 say `keys`. Normalize or keep verbatim? Copy decision.
5. **Price decimal inconsistency** — `$50.1M` (1dp) vs `$61.49M` (2dp). Normalize or keep verbatim?
6. **Team-voice rewrite** — `.team-creds` (`index.html:1137`) and the `og:image:alt` are single-broker. Deal cards and trust-strip figures need no rewrite.
7. **Evidence gate** — all 8 stat values + all 6 closing price/LP-SP/DOM figures need `verified-current` claims-register rows.
8. **`badge contract` has no label string.** If Hokuten ships `in-contract`, the label is net-new copy.
9. **`slide9_brooklyn.jpg` is 1.2 MB / 3840×2560.** Re-encode before it goes near a perf gate.
10. **Gold hex** — source uses kit gold `#B8943D`; Hokuten web gold is `#B8902E`. Do not copy the source hex into `globals.css`.
