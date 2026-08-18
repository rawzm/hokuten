# 03 — Visual System

## Table Of Contents
Color roles · Type ramp · Spacing & layout · Surfaces & borders · Deal-ticket component · Imagery · Iconography · Components

Hex values live only in [01-brand.md](01-brand.md); implementation of record is `site/app/globals.css` (Tailwind v4 `@theme`). Rules here use token names.
**Dual-theme rule (2026-08-07): components consume semantic tokens (`--accent`, `--accent-dim`, `--accent-wash`, `--accent-chip`, `--paper`, `--dark`) — never `--gold`/blue hexes directly.** Theme G (gold) and Theme B (Hokuten Blue) bind them per 01-brand.md; `NEXT_PUBLIC_HOKUTEN_THEME` selects at build. Every "gold" rule below reads as an "accent" rule. Theme B additions: plate sections may carry hairline frames + corner registration marks (Coronal chassis) — light chrome only, never on dark.

## Color roles

| Role | Light sections | Dark sections |
|---|---|---|
| Canvas | `--paper` | `--dark` (hero panel: `--black`) |
| Primary text | `--ink` | `--paper` |
| Secondary text | `--ink-muted` | `--paper` at 64% |
| Meta/captions | `--meta` | `--paper` at 40% |
| Accent / CTA | `--gold` | `--gold` (hover `--gold-dim`) |
| Hairlines | `--rule` | `--paper` at 14% |
| Cards | `--card` or `--surface-deep` | `--dark` +4% lightness, never gray |
| Errors | `--brick` | `--brick` |

Semantic rules: gold = action/exclusivity only; never decorative fills. Success/pending states in forms use ink-weight and mono copy, not new colors.

## Type ramp (max 4 sizes per section)

> **Faces superseded 2026-08-17 (L3 / R13, Razim).** Every "Fraunces" below now reads **Cormorant Garamond**, and every "IBM Plex Mono" reads **JetBrains Mono**; Inter is unchanged. Prior program, kept visible: ~~Fraunces (display) / Inter / IBM Plex Mono (data)~~, approved 2026-08-10. Source: Brand Design Guide v1.3 lines 10–16, corroborated by the kwc port source, which declares the same three faces. **The sizes moved with the faces, they were not substituted like-for-like:** Cormorant has a smaller x-height, a narrower set-width and a lighter colour, so display steps go **up**, leading **loosens**, and the display weight floor stays Light 300 (600+ still banned sitewide). Mono labels are uppercase, tracked **0.18–0.32em** — no label below 0.18em. The implementation of record is `site/app/globals.css`; where a number here and a token there disagree, the CSS is what ships and this table is what needs fixing.

> **New display utility, 2026-08-17 (R2, guide line 14/28):** `.display-tail` — the italic gold tail closing a display line. It is a reusable utility, applied to the hero `<h1>` and to every section headline with a natural tail; it is the same one-italic-accent device this ramp already governs, given a name and a colour.

**D8 (2026-08-08) — typography contrast pass.** The page read too uniform; hierarchy is now amplified deliberately, not just enlarged. What changed:
- New `type.display0` step, one size above Display 1 — see table. **The hero `<h1>` only, one element per page.** It replaces Display 1 in that single slot; it never stacks alongside Display 1 in the same section (doesn't count against the 4-size ceiling below for that reason).
- Fraunces stays **Light 300 as the default** display weight, but may step to **500** for a deliberate contrast moment. **600+ stays banned, sitewide, no exception.**
- **Inter 600 is sanctioned** wherever a UI/data moment earns it (CTAs, nav-active, form labels, a firm data callout) — this is not a blanket bold-up of body copy.
- Italic accents may appear on more than one headline per page now; the one-per-headline discipline itself is unchanged — each headline still carries exactly one italic word, same size/weight as its line.
- The mono/caps micro-voice (`type.micro`, `micro-label`, `data-line`) gets heavier use for labels and data moments that want to read as enterprise-platform, not brochure.

The goal is **"pop with hierarchy," not louder everything** — reach for weight/color/spacing before size, same as always.

| Role | Token | Size (desktop / mobile) | Voice, weight, case |
|---|---|---|---|
| Display 0 | `type.display0` | clamp 48–132px / responsive (`--text-display0`, leading 0.94, tracking -0.035em) | Fraunces Light, sentence case. **Hero `<h1>` only.** (D8) |
| Display 1 | `type.display1` | clamp 56–96px / 40px | Fraunces Light, tight leading (1.02), sentence case + one *italic* word |
| Display 2 | `type.display2` | 40–56px / 32px | Fraunces Light–Regular |
| Heading | `type.heading` | 24–28px / 22px | Fraunces Regular or Inter Semibold |
| Body large | `type.bodyLg` | 18–20px | Inter Regular, leading 1.6 |
| Body | `type.body` | 16px | Inter Regular — floor for reading text |
| Data | `type.data` | 14–15px | IBM Plex Mono, `font-variant-numeric: tabular-nums` |
| Micro-label | `type.micro` | 11–12px | IBM Plex Mono, uppercase, tracking 0.14em, bracketed index device |

Tracked brand line: uppercase Inter, tracking 0.35em, gold — headers/footers only.
Stat numerals: Display 1/2 in Fraunces with mono caption beneath (never mono for the big numeral).
Hierarchy moves: weight, color (ink→muted→meta), spacing, then size — adding a fifth size to a section is a P1.

### The four-level hierarchy device (D20, 2026-08-10 — Design Revisit 2)

D8 (above) amplified contrast within the existing token ramp; D20 adds a naming device on top of it so every section's four-size budget is spent the same way, not ad hoc. This does not add tokens or relax the 4-size ceiling — it groups the ramp above into four **jobs**, and every section picks its four sizes by filling these jobs, not by reaching for whichever token looks good:

| Level | Voice | Job |
|---|---|---|
| Display | Fraunces 300/500, one italic accent maximum | Hero and section proposition — `type.display0`/`display1`/`display2` |
| Heading/value | Fraunces for names; IBM Plex Mono semibold for price/stat | Property title, ticket price, primary valuation result, stat numeral — `type.heading`, or `data-line`/`text-money` at large size |
| Body/data | Inter body; IBM Plex Mono tabular data | Explanation, metadata, metrics, form values — `type.bodyLg`/`body`/`data` |
| Micro | IBM Plex Mono tracked caps | Section indices, labels, evidence-family captions, step state — `type.micro`/`micro-label` |

Confirms, does not relax, three standing rules this round amplified further: **Fraunces never exceeds 500** (600+ stays banned sitewide, no exception — unchanged since D8); **exactly one italic accent word per headline maximum** (unchanged count; D8 only widened *where* headlines may carry one); **Inter 600 is for actions and key conclusions**, used selectively, never a blanket body bold-up. Price/result numbers earn emphasis from weight, face, colour (the `text-money` binding, ref 01) and whitespace — never from all-caps or a decorative font substitution. Explanatory and legal copy is never shrunk below its accessible size just to make a section fit its four-level budget or its `section-fit` height (D14/§Spacing below) — if content doesn't fit, the panel grows and the document scrolls, the type never shrinks past its floor.

## Spacing & layout

Base unit 4px; component rhythm in 8s (8/16/24/32/48).

**D6 (2026-08-08) — compressed rhythm.** The old 96–160px desktop / 64–96px mobile section padding is retired — it produced dead bands between sections and made fit-to-viewport unreachable. Current values are `@utility` classes in `globals.css`; use the utility, never a hand-rolled `padding-block`:

| Utility | Value | Use |
|---|---|---|
| `section-pad` | `clamp(2.5rem, 1.25rem + 4vw, 5.5rem)` — 40px mobile → 88px desktop | Default section rhythm, replaces the old fixed range |
| `section-pad-tight` | `clamp(1.75rem, 1rem + 2.5vw, 3rem)` — 28px → 48px | Content-dense sections (calculator, BOV) or a section sitting adjacent to a same-surface neighbour |
| `section-join` | `padding-block-start: 0` | Put on the *second* of two adjacent same-surface sections so they share one gutter instead of stacking two — the D6 "no dead band" rule, made concrete |
| `section-fit` | `min-height: var(--screen-fit)` at ≥64rem (desktop only — mobile keeps natural flow, always) | Every desktop section targets fit-to-viewport. `min-height`, not `height`: content that genuinely overflows still scrolls the page rather than clipping |
| `scroll-well` | `overflow-y: auto` + bottom mask-fade, `overscroll-behavior: contain` | **Superseded out of the calculator, 2026-08-10 (D14, Design Revisit 2).** The valuation section now has **no internal section scrollbar under any circumstance** — five steps replace three (below) specifically so step 3's density is solved by layout, never by a nested well. `scroll-well` itself is not deleted from `globals.css`: it remains available for a genuine exceptional-viewport fallback elsewhere (documented case: the menu overlay's short-height/200%-zoom accessible fallback, D17/ref 04 → Menu overlay) — but "the calculator" is no longer a caller. A `scroll-well`, a masked overflow, a fixed result height, or a sticky subpanel anywhere inside `#calculator` is a P0 finding, not a style choice (ref 07) |

`--screen-fit: calc(100svh - var(--nav-h) - var(--ticker-h))` is the viewport budget `section-fit` targets.

### The stage supersedes the container — D9 (2026-08-10, Design Revisit 2)

**Superseded.** "Container: max-width 1200px content, 1440px for full-bleed art; gutters 24px mobile / 48px desktop" (immediately below, kept for the record) described the landing route's own shell. It no longer does.

**Current.** The landing route composes at **viewport scale**, not inside a 1200px editorial column. `stage-shell` (`width: 100%`, no max-width, `padding-inline: var(--gutter)`) is the shell for hero copy, Trust, both deal-ticket grids, the calculator, Method, Doors, Mandates, Team, FAQ, BOV, nav and footer. `--gutter` is one fluid token (`clamp()`, not a per-component number): roughly 20px on small screens, 32–48px on tablet, 48–72px on wide desktop, capped so an ultrawide screen doesn't grow an absurd margin. Full-bleed image/surface bands still touch both viewport edges; cards and metrics fill the stage instead of stopping at 1200px. **"Full width" is not licence for 180-character paragraphs** — prose is still constrained locally (`max-w-[68ch]` on a paragraph, a form's own field measure, a heading's own designed measure) inside the wide stage, never by throttling the whole composition.

`container-hk`/`container-wide` (below) are **not deprecated — they're scoped**. They remain correct for legal/editorial routes (`/privacy`, `/sms-terms`, `/accessibility`) and any deliberately narrow prose block *outside* the landing route. Reaching for `container-hk` to wrap a landing-route section is now the defect, not the fix.

Container (legal/editorial routes and narrow prose only): max-width 1200px content, 1440px for full-bleed art; gutters 24px mobile / 48px desktop.
Grid: 12-col desktop, 4-col mobile. Listing/closing cards: 3-up desktop, 1-up mobile (2-up only ≥640px if cards stay ≥320px wide) at natural-flow widths; on the landing route's `stage-shell`, D13's landscape ticket grids below (3×2 Track Record, 3+2 Hotels for Sale) supersede this generic rule specifically for those two sections.
Anchor offset: `scroll-margin-top: var(--nav-h)` on all section ids (sticky nav height). **D18 (2026-08-10): `--nav-h` is now 72px, not 68px** (`--nav-h-mobile` 64px, not 60px) — the D1 header lockup needed the taller toolbar to render at its corrected ~52px/~46–48px size (ref 01 → Lockups & usage). Supersedes D6's 68px/60px figure, which itself had superseded the original 88px/— nav.
Density: one idea per screen; if a viewport contains two competing focal points, cut one.

### Native paging — **RETIRED 2026-08-10 evening (D22, Design Revisit 3)**

> **Read this before the block below.** D10's route-scoped native scroll snap is **removed from the codebase**, on Razim's verdict on a live render: *"messy and not properly navigating… buggy overall."* The snap CSS block, the `PagedMode` measurement island and the Lenis paged-mode gate were all deleted; `data-page="home"` survives only as an unused route hook. **Scrolling is natural at every width, on every route.** What D10 established and D22 **kept**: the twelve `page-panel` screen compositions (min-height, centred/distributed content), the `stage-shell` layout, the print resets that reference `.page-panel`, and `scroll-margin-top` anchor clearance. The page still reads as twelve deliberate screens — it just scrolls freely between them. Panel over-height is therefore a **density preference, not breakage** (D28): an over-height panel simply scrolls. The whole D10 block is retained below as the record of what was tried and why it was reversed; **do not rebuild it.** (Corrected 2026-08-17 — this file still described snap as live seven days after it was removed.)

#### D10 — superseded, kept for the record (2026-08-10, Design Revisit 2)

**Superseded.** D6's "fit-to-viewport but free scrolling" — every desktop section merely *targeted* one screen's height while the document scrolled through the stack unassisted — is retired on the landing route specifically. Legal/editorial routes and any future detail page are untouched.

**Was current for one day (2026-08-10 → 2026-08-10 evening); retired by D22 — do not rebuild.** On a qualifying desktop (**≥1024px wide, ≥760px tall, fine pointer, `prefers-reduced-motion: no-preference`** — all four, together), the landing route's scrolling root carries `scroll-snap-type: y mandatory` with `scroll-padding-top` equal to the nav's clearance, scoped via `:root:has(main[data-page="home"])` so it never leaks onto another route. Every one of the twelve screens in §Section order (ref 04) carries `page-panel` (`min-height: var(--screen-fit)` at ≥64rem) plus `scroll-snap-align: start` / `scroll-snap-stop: always`. `min-height`, never `height` — a panel whose truthful content genuinely exceeds the viewport (an expanded FAQ, a zoomed layout) still **grows and the document scrolls through it** before the next boundary; nothing is ever clipped to preserve the illusion of a page. A tiny measurement-only client island sets `data-tall="true"` on any panel it measures taller than the usable screen, and that one attribute drops the panel out of the mandatory snap set (see the mechanism note in `globals.css` §6b) — this is what resolves the real conflict between "mandatory snap" and "a panel taller than the viewport must still be reachable in the middle."

**This is not scroll-jacking, and the distinction is load-bearing, not cosmetic.** There is no wheel listener, no touch listener, no delta threshold, no `preventDefault`, no custom scroll queue, no synthetic jump — it is the browser's own native snap implementation. Page Up/Down, Space, keyboard focus, browser find, anchor links and history restoration all keep working exactly as they do on any other page. Ref 05's no-scroll-jacking law is unchanged by D10; D10 is how a page satisfies "reads like deliberate screens" without ever touching a gesture.

Outside the qualifying tier — touch/coarse-pointer devices, <1024px wide or <760px tall, 200%-zoom/reflow layouts that no longer fit, and reduced-motion — mandatory snap is disabled entirely and the page is a normal, naturally scrolling document. Print also disables it unconditionally (no snap, no sticky/fixed chrome, no clipped overflow; everything prints in source order — `globals.css` §8).

## Surfaces & borders

Hairlines everywhere structure is needed: 1px `--rule` (light) — no drop-shadow-based layout.
Shadows: only on floating elements (menu overlay, modal, sticky ticker), soft and ink-tinted, never gray-blur halos.

**Superseded 2026-08-17 (R2, D-VOCAB).** The guide's *"never drop shadows"* (line 29) is adopted: the deal ticket's **resting `box-shadow` becomes a 1px hairline**, and hover/focus elevation becomes a hairline colour shift, not a shadow lift. **The perforation/notch geometry stays** — it is the D4-approved identity of the deal card and is untouched. Radii minimise toward 0, keeping only the ≤2px the notch needs to render cleanly (so `r.card` is a ceiling now, not a default). `--shadow-ticket`/`--shadow-ticket-dark` are retired as resting values; `--shadow-chip` survives only as a mounting surface for the baked-shadow brand chips. Prior rule, kept visible:

**D4 (2026-08-08) — the one documented exception to "1px borders over shadows."** Deal-ticket cards (listings/closings — §Deal-ticket component below) carry a **resting** ink-tinted shadow: `--shadow-ticket` on light surfaces, `--shadow-ticket-dark` on dark, applied via the `ticket` / `ticket-dark` utilities. Nothing else in the card system gets this treatment — every other card stays hairline-bordered, no shadow. Rules that bind on the exception exactly as everywhere else:
- Still **never a gray blur halo** — both tokens are ink-tinted (`rgb(26 28 31 / …)` light, `rgb(0 0 0 / …)` dark), not a generic drop-shadow gray.
- **The shadow does not change on hover.** The dimension sits at rest; hover reveals photo color + an accent ring (ref 05 §Hovers) — never a shadow lift, never a translate.
- `--shadow-chip` is a distinct, smaller token: the seat a brand chip sits on when it needs a surface behind it (D2). Chips already carry their own rendered gloss/shadow inside the raster — this is not a second card-shadow exception, just a mounting surface.

Radius — **narrowed 2026-08-17 (R2)**: `r.none` 0 for images/art; `r.card` **≤2px** for cards/inputs (a ceiling, not a default — minimise toward 0, keep only what the ticket notch needs); `r.pill` 999px survives for **badges only**. Prior rule, kept visible: ~~"`r.pill` 999px for CTAs/badges only"~~ — CTAs are no longer pills (see Components → Buttons).
Dark sections may carry star-grain + hairline orbital arcs (imagery layer, max opacity 8%); light sections carry no texture.

## Deal-ticket component (D4, 2026-08-08; landscape + full-colour SOLD reveal superseded 2026-08-10, D13)

Listing/closing cards are dimensional "deal tickets" — a boarding-pass anatomy translated to deal data, never cloned (source digest in `02-reference-digest.md`). Built from the `ticket` family of chassis utilities in `globals.css`.

**Orientation — superseded 2026-08-10 (D13, Design Revisit 2).** D4 shipped a portrait/vertical card (photo stacked over the data stub). **Desktop ticket orientation is now landscape**: an image zone and a content/stub zone sit side by side, separated by the perforated seam (below) running vertically instead of horizontally, with real notches on that seam. Mobile/tablet keep the vertical stack — the vertical variant D4 originally shipped survives as the small-viewport form, it just stops being the only form. A subtle second cardstock layer or offset backing plane (a thin second rectangle set slightly behind/beside the main card) adds to the existing resting ink-tinted shadow for extra dimension — **the card still never "floats upward" on hover**; the added plane is a resting-state device, not a hover effect.

**Anatomy, top to bottom (vertical) / left to right (landscape):**
1. **Header/image band** — the real listing/closing photo, or a solid surface with a hanko punch where no photo exists. Carries the ticket's color.
2. **Tear line** — `ticket-perf`: a 1px dashed `--hairline` rule marking the seam between the image zone and the data stub (runs vertically in the landscape orientation, horizontally in the vertical one).
3. **Notches** — `ticket-notch`: two 14px half-circle punches centered on the tear line, cut with a `radial-gradient` mask (not a painted circle), so the section surface genuinely shows through — this is what lets the same ticket sit on any surface color without a seam.
4. **Label/value grid** — tiny caps `micro-label`s over **bold mono `data-line` values** (keys, cap rate, LP/SP, days on market). Labels never outweigh values. **Price is the one exception to "mono `data-line`" — superseded 2026-08-10 (D13):** the price is the ticket's dominant data moment and now binds to `text-money` (IBM Plex Mono, tabular, semibold, the approved financial-positive token — ref 01), set **visibly larger** than the surrounding terms/keys/cap-rate values, not merely bold like the rest of the grid. Nothing else in the grid uses `text-money` — occupancy, cap rate, LP/SP stay in the normal ink/data palette (ref 01's money-scope rule, D13/D19).
5. **Body** — the `ticket` utility: `radius-card` + the resting shadow (`ticket-dark` adds `--shadow-ticket-dark` on dark surfaces). This is the D4 shadow exception from §Surfaces & borders above — nothing else in the card system carries it.

**Card-level micro-copy — locked, 2026-08-10 (D13).** A restrained serial such as `RECORD 01` or `OFFERING 02` may be derived from the real array index, in the `micro-label` voice. **Never** invent a deal ID, ticket number, seat, gate, barcode, QR code, "admit one," or any other airline/event-ticket fact — the boarding-pass reference lends anatomy, never travel-document content (ref 02's digest already banned the QR code specifically; this extends the same ban to every other travel-document field). Missing source data is omitted or keeps the already-approved "Confidential" behavior; never write `N/A` or fabricate a value.

**Two variants:**
- **Listings (ACTIVE)** — full-color ticket. EXCLUSIVE badge doubles as the "class" chip, cap-rate chip present, the stub carries the Crexi link as its action ("View on Crexi →"). Full color when a CRM photo exists; until CRM integration, the approved glyph-art placeholder/interface fills the gap — never a fake property photo standing in as if it were real. A stable listing-media adapter is the contract point: swapping in a future CRM photo URL/alt/focal changes data, not `Ticket`'s anatomy.
- **Closings (SOLD)** — a visually "retired" ticket carrying an `overprint` stamp — a hairline rotated CLOSED/SOLD mark, hanko-adjacent in spirit, **never a red rubber-stamp cliché**, and it stays visible in every interaction state (never information that exists only in the color reveal). `overprint` reads `--accent-text`, so it's correct on both themes and on dark with no separate override needed. Metrics grid shows the proof line (LP/SP · days · price).
  **Hover reveal — superseded 2026-08-10 (D13, reverses D4).** D4's rule ("the ticket is visually 'retired'… it does not get `#listings`' hover-driven colour reveal — there is nothing left to transact") is retired. **The SOLD header band is now grayscale at rest and reveals full source color on hover, keyboard `:focus-within`, and the existing touch-reveal action** — the same interaction contract as every other card, no longer a special case. The overprint stamp stays legible in both the grayscale and the revealed-color state.

**Interaction:** hover/focus = photo color reveal + accent ring shift, exactly like every other card (ref 05 §Hovers) — **no translate, no shadow change, no scale beyond the existing 1.02 card cap.** The ticket's dimension lives entirely in the resting shadow (plus D13's optional backing plane, which is also a resting-state device).

**Grid composition — superseded 2026-08-10 (D13).** Desktop Track Record is a **3×2** landscape-ticket grid (six tickets); Hotels for Sale is a **centered 3+2** composition — a first row of three, a second row of two centered at the same card width as row one, never stretched into oversized cards to fill the row. At widths that cannot support a readable landscape ticket, **reduce columns before reducing type** — the four-level hierarchy budget (§Type ramp above) never shrinks to make an extra column fit.

**Compact variant — new 2026-08-10 (D15).** `ContextRail` (the calculator's market-reference panel) is rebuilt on this same chassis — backing plane, resting shadow, perforation/notches, micro labels, structured mono values, an image header mapped to the selected property type — at a smaller footprint than the full listing/closing ticket. It is the third `Ticket` consumer, not a fourth card system; anything that changes the shared chassis affects all three.

**Still binding, unchanged by D4/D13:** fixed-height card slots, keyboard focus ring on the whole ticket (not just the inner link), 5-second Crexi-user legibility (ref 07), print legibility (owners print things), 3-up/1-up as the *generic* card rule for everything that is not one of these two ticket grids (§Spacing & layout above).

## Imagery

Real hotels from the track record only; no stock, no AI-generated *photography* (the ban covers photography presented as real — fabricated properties, fake people, stock-looking scenes; commissioned/generated single-stroke line-art illustration, e.g. the `#method` engraving, was already permitted).
Cards: grayscale at rest → color on hover; touch devices use the kwc `tapped` toggle pattern.

**D5 (2026-08-08) — signature art is now supplied, not generated.** The site's signature image treatment is a **「北天」 glyph-mosaic**: typographic halftone whose sole rendering primitive is the repeated text unit 「北天」, depth carried by glyph scale/spacing/density/weight/overlap/color/contrast, source-photo colors preserved. Razim produces each piece himself via a controlled img2img prompt and delivers finished image files — **this repo does not generate this art.** Our job is intake, sharp-pipeline preparation (AVIF/WebP/JPEG via `next/image`, responsive `sizes`, explicit dimensions, hero gets `priority`), and placement, tracked in `content/artwork.ts` (placement → asset path + alt + status). Anti-AI-slop clarification (full text in ref 07): the ban covers fake *photography* presented as real; Razim-approved stylized glyph-mosaic art is the house treatment and passes cleanly — it is never mistaken for a photograph. Alt text describes the depicted subject (the hotel, the scene), never the treatment.
**Retired from the page:** `AsciiCanvas`, the build-time character-grid pipeline, and the 24–36-frame morph/shimmer loop specced in ref 05 — superseded by the supplied artwork above. The generator script and JSON assets stay in the repo, uninvested; nothing is deleted. A placement without a delivered piece yet renders its designed interim surface (never a stock photo, never a blank hole) per `docs/PLACEHOLDERS.md`.
**`<KanjiAccent>` — unchanged, still ours to build.** A *different* thing from the artwork above: a reusable background motif, our own SVG (reuse the hanko glyph geometry, never a `<text>` element), huge outlined/low-opacity 北/天 glyphs placed like the existing OrbitalArcs pattern. Rules (hex/palette context in [01-brand.md](01-brand.md)): absolute positioning, `aria-hidden="true"`, `pointer-events: none`, opacity ceiling `--kanji-opacity-dark` (0.08) / `--kanji-opacity-light` (0.06) — past these values it competes with type instead of sitting behind it — **one instance per section maximum**. Ships in the menu overlay, calculator, BOV, and anywhere a side accent is needed.
Every image through `next/image` with explicit dimensions; hero art gets `priority`; alt text describes the hotel, not the treatment.

**Hero becomes a slideshow — superseded 2026-08-10 (D11, Design Revisit 2).** The hero's supplied artwork is no longer one static frame; it is a small art-directed rotation (3 slides recommended, 5 supported max) with a deterministic CSS mosaic transition between them. Slide 1 stays the real, server-rendered, `priority` LCP image exactly as the single-image rule already required — the new rule only adds slides 2+ and the transition, it does not relax the LCP discipline. Full spec: ref 01 → Motif system ("Hero art becomes a slideshow") and [05-motion.md](05-motion.md) → Hero slideshow.

**Menu art may be a real photo — superseded 2026-08-10 (D17, Design Revisit 2).** The menu's left art panel may now be **either** a supplied full-color real hotel photograph **or** approved 「北天」 glyph-mosaic artwork — never stock, and never a CSS grayscale treatment of either. Full spec: ref 01 → Motif system.

**Sold-card grayscale→color reveal — reversed for closings, 2026-08-10 (D13).** "Cards: grayscale at rest → color on hover" above already described listings; it now also describes closings/SOLD tickets, which D4 had deliberately exempted. See §Deal-ticket component above.

**Asset pipeline discipline — new 2026-08-10 (D21).** Razim drops masters into the exact `Ref/hero/`, `Ref/menu/`, `Ref/calculator/` (and the existing `Ref/artwork/`, `Ref/hotel-brands/`, `Ref/site/`) folders; a repeatable preparation script exports responsive AVIF/WebP/JPEG derivatives into `site/public/`, and every component reads only the public manifest — never `Ref/` directly, in any browser route, image loader, import, or deployed bundle. This is a QA grep (ref 07), not just a convention. An unmanifested file is ignored; a missing breakpoint emits a build/prep warning and uses the documented fallback — it never silently changes the crop. This generalizes the D5 discipline already established for `content/artwork.ts` to the hero/menu/calculator asset tracks.

## Iconography

Lucide only, 1.5px stroke, 16/20/24 sizes, `--ink-muted` default. No emoji, no text arrows (→ allowed inside mono micro-labels only, as type not icon).
North-star glyph is an SVG asset, not an icon-font hack.

## Components (build order)

Tokens → primitives (shadcn/ui restyled: Button, Input, Select, Dialog, Accordion) → site atoms (MicroLabel, StatNumeral, GoldRule, Badge) → cards (ListingCard, ClosingCard, TeamCard — ListingCard/ClosingCard build on the `ticket`/`ticket-perf`/`ticket-notch`/`overprint` chassis, §Deal-ticket component above; D4, 2026-08-08) → sections → page.

**New this round, 2026-08-10 (Design Revisit 2).** `ContextRail` moves from a standalone bordered surface into the `ticket` chassis (D15 — see §Deal-ticket component's "Compact variant" above), so it is now a card-tier component, not a section-tier one. A new `BrandLoader` client island joins the primitive layer (conditional first-visit/reload branded loader, D16 — full spec [04-page-anatomy.md](04-page-anatomy.md) and [05-motion.md](05-motion.md)). The hero gains a `HeroSlideshow` client island wrapping the existing static-image contract (D11). `MenuOverlay` is a rebuild, not a new component, but its overlay-boundary sizing classes are fully replaced per D17 (ref 04 → Nav).
Buttons — **superseded 2026-08-17 (R2, guide line 29 "never filled buttons")**: primary = **hairline-outlined gold** — 1px `--accent` border, transparent ground, `--accent-text` label, gold ground only on hover/active; secondary = hairline ghost; tertiary = mono underline link. One primary per viewport. Prior rule, kept visible: ~~"primary = gold pill on dark / ink pill on light… secondary = hairline ghost pill"~~. The carve-out is deliberate and small: the guide's own outlined-box language, and reversible in one token if Dino wants the fill back.
Badges: mono uppercase 11px in hairline pill — `EXCLUSIVE · OFF-MARKET · IN CONTRACT · CLOSED` (+ gold text for EXCLUSIVE/OFF-MARKET).
Forms: `--card` fields on paper, 16px+ inputs (iOS anti-zoom), visible focus ring in gold at 2px, labels always present (no placeholder-as-label).
