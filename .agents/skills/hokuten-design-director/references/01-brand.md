# 01 — Brand

## Table Of Contents
Identity · Palette · Typography · Lockups & usage · Motif system · Compliance · Asset locations

## Identity

The brand is THE HOKUTEN GROUP. Hokuten (北天) means "northern sky."
The name honors the team (not one person) and nods to Final Fantasy's Order of the Northern Sky — the nod stays sub-visual, never literal.
Business line: hospitality investment sales, nationwide coverage.
Brand hierarchy on official assets reads: KW COMMERCIAL / THE HOKUTEN GROUP / HOSPITALITY INVESTMENT SALES / NATIONWIDE COVERAGE.
On the website the hierarchy inverts: Hokuten first; KW Commercial is a footer compliance mark only (decision 2026-08-07).
The spelling is HOKUTEN everywhere. "Hakuten" is a typo that survives only in the local folder name.

## Dual-theme program (decision 2026-08-07)

Phase 1 ships TWO complete theme variants — same content, same anatomy, massively different color key — as two Vercel preview links for team comparison:
- **Theme G — "Kit Gold"**: the palette below as-is. Dark heritage hero (cover-panel black, gold/ivory ASCII). Production default on `main`.
- **Theme B — "Hokuten Blue"**: the blue ramp below; 北天 "northern sky" rendered literally. Light volumetric hero on the Coronal plate chassis (see [02-reference-digest.md](02-reference-digest.md) → Coronal video). Lives on branch `theme-blue` via `NEXT_PUBLIC_HOKUTEN_THEME=blue` (branch-scoped Vercel env), zero code diff from main.
Mechanics: components consume **semantic tokens only** (`--accent`, `--accent-dim`, `--accent-wash`, `--accent-chip`, canvas/dark tokens). Themes bind them. Every gold rule in this file reads as an `--accent` rule; "gold is scarce" = "accent is scarce" in both themes.
Theme B branding: rebuild the THE HOKUTEN GROUP tracked-caps line, hanko seal, and OG/cover recipe in Hokuten Blue (SVG/text rebuild — never recolor the KW kit rasters). The KW Commercial footer compliance mark keeps its own original colors in BOTH themes, isolated on its own surface.

## Palette (the only place hex values live)

| Role | Token | Hex | Use |
|---|---|---|---|
| Website gold | `--gold` | `#B8902E` | CTAs, accent words, badges, rules on dark. README mandate: "Website gold stays #B8902E" |
| Kit gold | (none) | `#B8943D` | Exists only inside raster lockup/cover files. Never a CSS value. Never adjacent to `--gold` |
| Gold dim | `--gold-dim` | `#C9A04A` | Hover/secondary gold moments on dark (carried from kwc tokens) |
| Ink | `--ink` | `#1A1C1F` | Primary text on light; matches brand charcoal |
| Ink muted | `--ink-muted` | `#4A4D52` | Secondary text on light |
| Meta | `--meta` | `#8B8680` | Tertiary/meta text, captions |
| Paper | `--paper` | `#F7F4ED` | Page canvas (never pure white ground) |
| Surface deep | `--surface-deep` | `#EFE9DA` | Alternate section bands, raised cards |
| Ivory rule | `--rule` | `#E2DCCC` | Hairlines, borders; equals brand ivory background |
| Card white | `--card` | `#FFFFFF` | Cards/inputs sitting on paper |
| Dark | `--dark` | `#16181B` | Dark section surface |
| Panel black | `--black` | `#000000` | Hero/cover panel only (matches cover assets) |
| Brick | `--brick` | `#A33B2C` | Form errors only. Not a brand color |

**Hokuten Blue ramp (Theme B)** — anchors sampled from the Coronal reference video (`Ref/Praveen_Kumar_-_New_Health_Tech_Branding_Exploration_tZBENZ.mp4`); executor verifies by sampling extracted frames and may fine-tune ±5% lightness, logging final values here:

| Role | Token binding | Hex | Use |
|---|---|---|---|
| Hokuten Blue | `--accent` (Theme B) | `#2F4FA3` | CTAs, accent words, badges, rules — everywhere Theme G uses gold |
| Blue deep | `--accent-deep` | `#1F3C8C` | Dense art strokes, hover states, dark-section accent |
| Blue mid | `--accent-dim` | `#7E96D0` | Art mid-tones, secondary accents |
| Blue wash | `--accent-wash` | `#C9D4EE` | Art light wash, tinted fills |
| Blue chip | `--accent-chip` | `#DCE3F7` | Pill/chip backgrounds (Coronal "SYNAPTIC MATCH" pattern) with `--accent` text |
| Cool paper | `--paper` (Theme B) | `#F7F8F5` | Canvas cools slightly; Theme G keeps `#F7F4ED` |
| Indigo dark | `--dark` (Theme B) | `#12172B` | Dark sections shift indigo; hero panel may stay `#000` or use this |

Theme G binds: `--accent = #B8902E`, `--accent-dim = #C9A04A`, `--accent-wash = #E2DCCC`, `--accent-chip = #EFE9DA`.

**Theme B artwork colour bias (Razim, 2026-08-08 — record beside this palette, not inside it).** The supplied 「北天」 glyph-mosaic artwork (see "Motif system" below, and [04-page-anatomy.md](04-page-anatomy.md) → Hero) is not required to match the Theme B UI ramp above — the art carries its own source-photo colours. Pieces Razim renders *for a Theme B placement* bias their img2img colour translation toward a different ramp: **Hokuten blue / dusty blue → pale ivory → warm sand → muted salmon → olive → deep navy/burgundy.** Sophisticated and editorial — never hacker/code-art, never a literal restatement of the UI accent ramp above (the art's job is mood, not token compliance). Per-theme artwork variants are therefore allowed: a placement may carry one shared piece used in both themes, or a gold-biased/blue-biased pair. First delivered piece in this bias: A3 (`Ref/artwork/`, full-service hotel block at sunset, dusty-blue/salmon/sand sky) — the Theme B hero candidate; full intake manifest and the delivered-batch table live in `docs/DESIGN-REVISIT.md` §3 and `content/artwork.ts`.

## Accessible tones (added 2026-08-08 — measured, not chosen)

The brand hexes above are correct as brand values but several fail WCAG AA as *text*. PHASE-1-EXECUTION §8.1 authorises exactly this remedy: "adjust tone, not the brand hex, where it fails at small sizes." These are the adjusted tones; contrast was computed, not estimated (`docs/design/CONTRAST.md` holds the script and the full matrix).

| Token | Hex | Why it exists | Measured |
|---|---|---|---|
| `--accent-ink` (Theme G) | `#816520` | Gold **as text on light**. `#B8902E` on `--paper` is **2.71:1** — it fails AA for every text size and even the 3:1 UI threshold, so gold text on paper was never shippable. Same hue (42.6°) and saturation (0.600) as `#B8902E`, darkened only. | 5.01:1 on `--paper` · 4.54:1 on `--surface-deep` · 5.50:1 on `--card` |
| `--accent-on-dark` (Theme G) | `#B8902E` | Gold **as text on dark** needs no adjustment — this is the brand hex unchanged. | 5.99:1 on `--dark` · 7.07:1 on `--black` |
| `--accent-ink` (Theme B) | `#2F4FA3` | Hokuten Blue passes on light unadjusted. | 7.12:1 on cool `--paper` · 7.59:1 on `--card` |
| `--accent-on-dark` (Theme B) | `#7E96D0` | `#2F4FA3` on indigo `#12172B` is **2.34:1**. The blue-mid step carries on-dark text instead. | 6.05:1 on `--dark` |
| `--on-accent` | `#16181B` (G) / `#F7F8F5` (B) | Text on an `--accent` fill (the primary pill). Black on blue is 2.77:1, so the two themes need opposite polarities. | 5.99:1 (G) · 7.12:1 (B) |
| `--meta` | `#6E6862` | Tertiary/caption **text**. The brand ivory-gray `#8B8680` is **3.29:1** on `--paper` and fails. | 5.01:1 on `--paper` · 4.54:1 on `--surface-deep` |
| `--meta-soft` | `#8B8680` | The original brand ivory-gray, retained — **decorative only, never text**. | n/a |

**Financial/status green exception (approved 2026-08-10; Design Revisit 2 D13/D19).** Razim explicitly requested cash-green prices and a green LIVE indicator. These are semantic proof/data colors, not a third brand accent.

**Binding confirmed live, 2026-08-10 (Design Revisit 2 W0).** `site/app/globals.css` now binds these three hexes exactly as approved — `--money-on-light: #1f6a4a`, `--money-on-dark: #58a66e`, `--live-on-dark: #58a66e` — matching the rows above byte-for-byte. The implemented token names differ from this table's generic role names by design: `--money-on-light`/`--money-on-dark` are the two raw values, and each `.surface-*` scope (§3 of `globals.css`) picks the right one into a single scope-relative `--money`, so a component never branches on surface — it writes `text-money` (the `@utility` in globals.css: mono, tabular, 600 weight, `color: var(--money)`) and gets the correct tone on paper, card, deep, dark and black automatically. `--live-on-dark` binds once, directly, as `--color-live` (the ticker dot has exactly one surface, dark). This is no longer an implementation target — the CSS utilities exist and are ready to consume. **Scope reminder (D13, unchanged): `text-money`/`--money` render a monetary primary value only** — a ticket's price, a valuation result. Never a button, border, success state, occupancy figure, or cap rate; those stay in the normal ink/data palette. `--live-on-dark` is scoped even tighter: the ticker's status dot only, never body text (ref 05 §Ticker; D19).

| Token | Surface | Hex | Use and measured contrast |
|---|---|---|---|
| `--money-positive` | Light tickets/results | `#1F6A4A` | Monetary primary values only. 5.94:1 on Theme G paper · 5.39:1 on surface-deep · 6.52:1 on card white. Re-verify Theme B cool paper when binding. |
| `--money-positive` | Dark surface override | `#58A66E` | Monetary primary values only when a result genuinely sits on dark; approximately 6:1 on both current dark surfaces. |
| `--live-positive` | Dark ticker | `#58A66E` | LIVE status dot only (and a text fallback if forced colors requires it); approximately 6:1 on both current dark surfaces. |

Never use these tokens for buttons, borders, selected controls, decorative rules, generic success messages, or to replace `--accent`. Green means current/live or monetary-positive data in the two expressly approved placements.

On-dark secondary/tertiary text is `color-mix(in srgb, var(--paper) 64%, var(--dark))` and `52%` respectively (7.2:1 and 5.2:1 in both themes). Ref 03's "paper at 40%" measures **3.59:1** and must not be used for text.

Implementation: `site/app/globals.css` binds all of these per theme, and the `.surface-*` scope classes select the right one automatically — components write `text-accent-text` / `text-fg-meta` and are correct on every surface in both themes.

Light mode is the site; dark is a section treatment (hero, process chapter, footer), not a theme toggle.
Gold is scarce: CTAs, one accent word per headline, badges, thin rules. If gold exceeds ~5% of a viewport, it's wrong.

## Typography

| Voice | Font | Fallback | Use |
|---|---|---|---|
| Display | Fraunces (72pt optical, Light–Regular) | Georgia, serif | H1/H2, menu index, stat numerals. Sentence case with *one italic accent word* |
| UI/Body | Inter | Arial, Helvetica, sans-serif | Body, nav, buttons, forms |
| Data | IBM Plex Mono | ui-monospace | Prices, keys, cap rates, dates, micro-labels, ticker |

All self-hosted via `next/font`. No Google Fonts CDN at runtime.
Tracked-caps brand line (`THE HOKUTEN GROUP` set in text): Inter or Arial-stack, uppercase, `letter-spacing: 0.35em`, gold — mirrors the Liberation Sans lockup treatment.
Micro-label device: mono, uppercase, bracketed index — `[ 01 — TRACK RECORD ]`.
Upgrade path: if Canela is ever licensed, it replaces Fraunces at the display voice only; tokens don't change.

## Lockups & usage

Assets live in `The_Hokuten_Group_Brand_Addon_2/` (masters; copy exports into `site/public/brand/`).

**Header — superseded 2026-08-08 (D1, Razim, live review of both theme URLs).** Original rule (2026-08-07): "no KW lockup — Hokuten wordmark/hanko only." **The header now carries the theme-matched KW/Hokuten lockup**: the blue lockup (`Ref/site/logo-blue.PNG`, Fuji + north-star panel art) on Theme B, the gold lockup (`Ref/site/logo-yellow.jpg`, classic KW gold) on Theme G. This kills the 2026-08-07 "no KW lockup in the header / Hokuten-first" P0 outright — remove that gate from any audit checklist still carrying it (ref 07 is owned elsewhere this round; flag it there). `Ref/site/` is production-approved by exception for this reason (masters stay in `Ref/site/`; prepared copies export to `site/public/brand/` and `site/public/awards/`) — the rest of `Ref/` remains source-material-only, never imported, unchanged.
Asset prep: trim to content bounds, knock out the white background (or mount on a deliberate light chip that reads over both nav states). Header render height ~40–48px. Full placement anatomy: [04-page-anatomy.md](04-page-anatomy.md) → Nav.

**Header + Trust + footer sizing corrected — superseded 2026-08-10 (D18, Design Revisit 2).** The D1 "~40–48px" header figure above undersized the mark once the nav grew to accommodate it. Current law, all three placements:
- **Header.** `--nav-h` is 72px desktop / 64px mobile (was 68px/60px under D6). The lockup renders **~52px tall on desktop, ~46–48px on mobile** — up from the 40–48px D1 figure — with an 8–10px safety inset top and bottom inside the taller bar. Header height stays stable across scroll/menu states exactly as D1 required; only the target height itself changed.
- **Trust (`#stats`).** D12 (below) promotes the lockup here to a **larger editorial size** than the header mark — this is the group-identity anchor for the site's proof wall, not a repeated nav element, so it is allowed to read bigger. Exact clamp lives in the built component; the rule is "visibly larger than the header lockup, never smaller."
- **Footer.** One correct theme lockup only — the gold-prepared asset under `[data-theme="gold"]`, the blue-prepared asset under `[data-theme="blue"]` — and still exactly **one** KW-bearing compliance-mark instance sitewide (unchanged law, restated in D18 because the footer is one of the three placements it touches). Do not add a second brand image anywhere to satisfy this line item.

**Names baked into images stay the Sarhan anti-pattern** — a raster lockup satisfies the co-brand requirement, not the brand-legibility one. A real-text `THE HOKUTEN GROUP` tracked-caps brand line sits adjacent to the lockup in the header (visually or, where the composition has no room, as a visually-hidden equivalent for AT/SEO) — this is precisely why the OG cover recipe below already insists THE HOKUTEN GROUP render as real, large lettering rather than living only inside a raster mark. **D18 adds:** at widths where the lockup and nav controls would collide, the adjacent real-text brand line may become visually-hidden — it is never removed from the DOM, only from the visible layout.
Footer: `Stacked_..._Gold_Transparent.png` over `--dark`, small, beside the compliance line. With the theme lockup now also in the header (D1), the footer needs only **ONE** KW-compliance-mark instance total on the page — if a build renders it twice, that is a defect to fix (component-level, tracked in `docs/DESIGN-REVISIT.md` §4.10), not a second intentional placement.
Known-defective asset: `Linear_..._Gold_on_Charcoal.png` — the charcoal COMMERCIAL wordmark vanishes on charcoal. Never use the linear lockup on dark.
OG image (1200×630): rebuild per the cover recipe — black panel, centered stack, thin gold rule, THE HOKUTEN GROUP as the only large lettering; adapt from `Facebook_Cover_1640x624_HOKUTEN` proportions.

## Motif system

North-star / compass-point glyph: the site mark accent; usable as bullet, section stamp, loading indicator.
北天 hanko seal (gold square seal-stamp): SHIPS in Phase 1 at full strength (decision 2026-08-07: "push it like it's final") — favicon, OG corner stamp, footer seal, section stamps where the anatomy calls for them. Team may rework after internal review; do not build it half-way.
Star-grain texture: faint grain + hairline orbital arcs on dark sections only (Aurelian ref). Never on light chrome.

**Franchise-flag marks — superseded 2026-08-08 (D2, Razim, live review), narrowed in scope, not repealed.** Original rule (2026-08-07): "grayscale only, uniform optical size, inside the `#brands` marquee only... never colorized." **That rule now applies everywhere EXCEPT the `#brands` marquee itself** — anywhere else a franchise mark might appear (e.g. incidentally inside a supplied artwork piece, see below), grayscale/never-colorized still governs. Inside `#brands` specifically, the replacement is: real supplied brand chips — 16 Razim-supplied 3D glass squircle renders in `Ref/hotel-brands/`, of which **15 render** (Marriott, Hilton, Hyatt, IHG, Wyndham, Accor, Best Western, Sonesta, Extended Stay America, G6 Hospitality, Omni, Loews, Auberge, Four Seasons, Aloft; the 16th is unidentified and held out — per-chip provenance in `docs/design/LOGO-MANIFEST.md`). **Corrected 2026-08-10:** earlier revisions of this line named Ritz-Carlton as part of the delivered set. No Ritz-Carlton chip was ever delivered — the 16th file is the unidentified amber mark. Naming a flag we do not render is an evidence-gate violation, so the roster is now written out in full rather than sampled — rendered **in full colour**, prepared with sharp (bounding-box crop against the near-white ground, transparent knockout, the chip's own gloss + soft shadow preserved — that IS its dimension, never flatten it to a flat mark), normalized to a uniform square canvas so the marquee row sits optically even. Framing is **unchanged**: "flags we transact across" — never "partners", never "clients", never implying endorsement, never adjacent to the Hokuten lockup. The **nominative-use legal posture is unchanged** by this supersession — only the rendering (colour, dimensionality, size) changed, not the claim being made or its evidentiary basis (ref 06 register). The **counsel flag for public launch is also unchanged**: the marquee ships internal-only until counsel clears it, tracked in `docs/PLACEHOLDERS.md`. Trademark disclaimer microcopy stays byte-exact (ref 06) but renders small: `text-micro`, reduced emphasis, one line with a leading asterisk — not a paragraph block. Full placement + prep spec: [04-page-anatomy.md](04-page-anatomy.md) → `#brands`.

**Chip size raised again, and the "& INDEPENDENTS" tail removed — superseded 2026-08-10 (D9/D11, Design Revisit 2).** D2's own "44–52px desktop / 36px mobile" figure (above, up from a 28px flat-mark size) is now itself superseded: Razim's second-round screenshots showed the row still reading small against the stage-shell's full viewport width. Current target — **~64px optical height on wide desktop, 52–56px on tablet, 42–44px on mobile** — larger again than the D2 figure, same reasoning (dimensional glass-chip renders carry more presence than a flat mark and need the size to prove it). The marquee also drops the `& INDEPENDENTS` string and any `INDEPENDENTS_MARK` node entirely — the row ships only the supplied franchise chips, nothing standing in for an unlicensed catch-all category. The evidence-gated "flags we transact across" framing and the byte-exact trademark disclaimer survive unchanged; only the chip size and the independents tail moved. Full anatomy: [04-page-anatomy.md](04-page-anatomy.md) → `#hero` row 4 / `#brands`.

**ASCII/dither art — superseded 2026-08-08 (D5, corrected same evening by Razim).** Original rule: a build-time-generated charset render (HOKUTEN + 北天/ホクテン + digits + `・.:-=+*#`) with a seam row resolving into THE HOKUTEN GROUP, spec'd in 05-motion.md. **That system retires from the page.** The house image treatment is now a **「北天」 glyph-mosaic**: a typographic halftone / glyph-mosaic reconstruction whose sole rendering primitive is the repeated text unit 「北天」. Depth and tone are carried entirely by glyph **scale, spacing, density, weight, overlap, colour and contrast** — never a second primitive. Source-photo colours are **preserved**, not converted to a mono ramp (the runcycle.com reference look, executed in kanji instead of Latin type).
**This artwork is SUPPLIED by Razim, not generated by this repo.** He produces each piece himself with a controlled img2img prompt and delivers finished image files; the executor's job is intake (rename to a stable kebab name on arrival — masters stay untouched in `Ref/artwork/`), preparation (sharp: AVIF + WebP + JPEG fallback, responsive `sizes`, explicit dimensions), and placement — never generation. The intake manifest is `content/artwork.ts` (placement → asset path + alt + status); until a piece lands, its placement carries `blocked: awaiting-artwork` in `docs/PLACEHOLDERS.md` and renders a designed interim surface — never a stock photo or AI-generated photography as a stand-in. Full placement table, sizing targets and the delivered-batch mapping (first batch: 5 pieces landed 2026-08-08): [04-page-anatomy.md](04-page-anatomy.md) and `docs/DESIGN-REVISIT.md` §3.
**Rule clarification (D5):** the anti-AI-slop ban in ref 07 covers fake **photography**. Razim-approved img2img **stylized glyph art** is not photography and is the house treatment — it does not trip that gate.
**What explicitly retires from the page** (scripts stay in the repo, uninvested — nothing is deleted): the `AsciiCanvas` pointer-shimmer/morph-loop system (`site/components/art/AsciiCanvas.tsx`, `site/scripts/ascii-gen.ts`), and the **seam-row requirement** — "THE HOKUTEN GROUP" no longer has to resolve legibly inside the artwork as a build concern (this also retires the seam/headline-collision engineering in `HeroCoverPanel.tsx`/`HeroPlate.tsx` as a *constraint*, though the disjoint-box layout technique those files used is still good practice for row 2/row 3 separation in the new hero anatomy). If Razim wants a seam row in a future piece, it is a line in his img2img prompt, not a rendering feature this codebase owns.

**Hero art becomes a slideshow, not a single static image — superseded 2026-08-10 (D11, Design Revisit 2).** The rule directly above ("a static optimized image… render as a static image") described a *single* frame; it is now the first frame of an art-directed rotation, not the whole hero. Current law:
- The hero cycles a small editorial set of supplied 「北天」 glyph-mosaic slides (3 recommended, 5 supported maximum — more weakens the cover and the byte budget). Same artwork family, same intake/prep/placement discipline as before; only the count and the transition are new.
- **Slide 1 stays the LCP element** — a real server-rendered `<picture>`/`next/image` with `priority`, decoded before the transition system does anything. It is never a canvas snapshot, never hidden pending hydration. This is the one hard carry-over from the retired single-image rule.
- The transition between slides is a **deterministic CSS mosaic reveal** (a transient grid of ~40 tiles that unmounts once the transition ends — the resting hero is one image layer, not a permanent tile grid), never a second `AsciiCanvas`-style system. Full timing/tile spec: [05-motion.md](05-motion.md) → Hero slideshow.
- Reduced motion / Save-Data: first slide only, no autoplay, no mosaic — the same static-image behavior the pre-D11 rule already described, now scoped to "the reduced-motion state" rather than "always."
- Per-theme artwork variants still work exactly as the Theme B colour-bias paragraph above describes — a slide set may differ by theme, or share pieces across both.

**Menu art may now be a real photograph — superseded 2026-08-10 (D17, Design Revisit 2).** The `#4.3` menu-panel rule elsewhere in this doc ("interim = designed dark surface with `<KanjiAccent>` until the piece lands… never a raw photo") is retired for the *final* state (the "interim while unbuilt" reading stays correct — an unfilled placement still renders a designed surface, never a broken image). Once art lands, the menu's left panel may be **either** a supplied full-color real hotel photograph **or** approved full-color 「北天」 glyph-mosaic artwork — Razim's call per piece, both are now house-legitimate for this one placement. What stays banned, unchanged: stock photography, and a **CSS grayscale filter treatment** of either kind of image (the old interim discipline "never a raw photo" is superseded specifically *because* it would have blocked a legitimate real-photo delivery; it does not relicense stock). The image renders in full source color at every state — no hover/rest desaturation, unlike the closing tickets' deliberate grayscale-at-rest pattern (D13, ref 03).

**`<KanjiAccent>` — new, still ours to build (D5).** The reusable background motif, distinct from the supplied artwork above: huge, outlined/low-opacity **北** / **天** glyphs rendered as **SVG paths** (reuse the hanko glyph geometry — never a `<text>` element, which would pull a CJK webfont and drift per-browser/per-OS). Placement: `absolute`, `aria-hidden="true"`, `pointer-events: none`. Opacity ceiling: **≤8% on dark sections, ≤6% on light** (tokens `--kanji-opacity-dark` / `--kanji-opacity-light`, already bound in `globals.css`). **At most one `<KanjiAccent>` per section.** Use it wherever the anatomy calls for a side accent with no art asset available — the menu overlay's index panel, the calculator, `#bov`, and any section still waiting on a supplied artwork piece. It joins the motif system as a permanent primitive, not an interim device — it ships regardless of how much supplied artwork eventually lands.

Photography: real hotels from the track record, B&W at rest → color on hover/tap (kwc's touch-reveal pattern). No stock.

## Compliance

Footer disclosure, verbatim on every page (until re-papered): use the canonical byte-exact block in [06-content-and-proof.md](06-content-and-proof.md) → Compliance text — never retype it here or anywhere else.
If listings ship under KW license, the KW Commercial mark must be present in the footer.
TCPA/10DLC: SMS-consent language and privacy/sms-terms pages port from kwc with the brand string updated once a Hokuten 10DLC brand is registered — until then keep the registered string exactly as registered.
Gate: the name deploys publicly only after KW / Forward Wilshire papers The Hokuten Group (brand README; track in PROJECT-MEMORY.md open items).
