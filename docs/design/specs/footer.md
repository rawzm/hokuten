# Footer — `SiteFooter`

**Section/Route**: Site-wide chrome (`<footer>` landmark, main landing page). Not a numbered anchor section — `content/site.ts` `SECTION_IDS` documents that the footer shares slot 13 with `#ticker` and carries no anchor of its own.
**Status**: approved
**Owner**: `site/components/sections/SiteFooter.tsx`
**Governs**: ref 04 "Footer" · ref 01 "Lockups & usage" / "Compliance" · ref 05 motion (hanko press-in) · ref 07 P0 (compliance disclosure, KW mark placement)

## Intent

The last thing a visitor reads before the page ends: real wayfinding (three columns), the brand signature (lockup + hanko), the compliance mark and disclosure a CA-licensed brokerage is required to carry on every page, and legal routes. Dark surface, quiet, no CTA — the CTAs already happened in `#bov`/`#doors`.

## IA (content, verbatim from `@/content/site` and `@/content/compliance` — nothing retyped)

1. Brand cluster — stacked lockup (chipped) + hanko seal, press-in reveal (placement ① of three sitewide).
2. Three nav columns — `footerColumns`: Quick Links (5) · For Owners (4, includes mailto) · For Buyers (3, includes the a100 Arms invite external link).
3. KW Commercial compliance mark (chipped) — the only place it renders sitewide.
4. `BROKERAGE_DISCLOSURE` — both sentences verbatim, hard line break between them.
5. Legal links row — `footerLegalLinks` (`/privacy`, `/sms-terms`, `/accessibility`).
6. Tracked-caps brand line (`brand-line` utility, `BRAND_LINE` = "THE HOKUTEN GROUP") + `copyrightLine()`.

## Component plan

- Root: `<footer className="surface-dark">` — the landmark and the surface scope live on the same element (contract: "surface scope class on the root"). No `id`/`aria-labelledby` — the footer is a landmark, not a numbered `<section>`, so it carries no `SectionHeader`/`h2` per ref 04 (the anatomy's footer entry has no micro-label index, unlike every numbered section).
- Inner `<div className="container-hk section-pad">` for the gutter/max-width/vertical-rhythm system — reused, not reinvented. `section-pad` gives top AND bottom rhythm; the ticker reserve (below) stacks additively under that, so total clearance above the fixed ticker is generous, never tight.
- **Ticker clearance (P0, "must sit above the fixed ticker without being covered")**: the `<footer>` root also carries `pb-[var(--ticker-h-mobile)] sm:pb-[var(--ticker-h)]` — an explicit additive reserve on top of `section-pad`'s own bottom padding. Breakpoint choice: `sm` (640px), matching the sitewide mobile/desktop line used elsewhere (e.g. the 2-up card rule). I do not own the Ticker component and could not confirm its own breakpoint; this is documented as an assumption, not a verified cross-component contract.
- Brand cluster: `<StampPressIn placement="footer" size={48} />` beside a chipped stacked-lockup image. Row uses `flex flex-wrap items-center gap-4` so it degrades gracefully at 375px.
- Columns: `<nav aria-label="Footer navigation">` wrapping a `grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-10`. Each column heading uses the existing `MicroLabel` atom (`as="p"`) — reused, not a new heading pattern. Link list items use a local `FooterNavLink` helper that picks `next/link` for root-relative routes, a plain `<a>` for same-page anchors and `mailto:`, and `<a target="_blank" rel="noopener noreferrer">` + a visually-hidden "(opens in a new tab)" suffix for `external` links — the exact pattern `CardShell.tsx` already uses for its own external (Crexi) links, reused for consistency.
- KW Commercial mark: chipped, own row, beside/above the disclosure.
- Disclosure: `<p>` with the two `BROKERAGE_DISCLOSURE` elements joined by a literal `<br />` (contract: hard line break between the two sentences).
- Legal row: `<nav aria-label="Policies">` (mirrors `LegalPage.tsx`'s own `Policies` nav landmark naming for consistency across the codebase) of `footerLegalLinks`, rendered with `next/link` (real routes).
- Sign-off row: `brand-line text-data` (`BRAND_LINE`) + `text-fg-meta` (`copyrightLine()`) — same `brand-line text-data` class combination `LegalPage.tsx`'s `LegalChrome` already uses for the identical string, reused rather than re-derived.

## ⚠️ Finding carried into this spec, not resolved by re-authoring the asset

**`lockup-stacked-gold.png` fails contrast on `--dark` — measured, not assumed.** Pixel-sampled the shipped file (`site/public/brand/lockup-stacked-gold.png`, 2400×1836, true alpha):
- Fill colours: `#B8943D` (kit gold — correct, raster-only per brand rule), pure white `KW` glyphs, and the border + "COMMERCIAL" wordmark rendered in `#1A1C1F` (`--ink`, the LIGHT-section primary-text token, not a dark-safe tone).
- `--ink` (`#1A1C1F`) on `--dark` (`#16181B`) = **1.04:1** — a near-total contrast failure. Placed bare on the dark footer, only the gold block and white "KW" glyphs would remain visible; the enclosing border and the "COMMERCIAL" wordmark would visually vanish. This is the same failure class ref 01 already names as a P0 for the *linear* lockup ("its charcoal COMMERCIAL wordmark vanishes on charcoal") — measurement shows the stacked asset, as currently exported, has the identical defect, just not yet logged.
- ref 01 explicitly names only the *linear* lockup as defective and directs the *stacked* one to sit "over `--dark`" — but PROJECT-MEMORY §3 records that the brand masters exist in white/ivory/charcoal background variants, and this component's own brief already prescribes a light chip for the adjacent KW Commercial mark for exactly this reason ("It keeps its original colours in both themes — give it a light chip so it stays legible on the dark footer"). The most plausible read is that the ivory/white-ground export got linked here rather than a charcoal-safe one.
- **Resolution shipped in this build**: the stacked lockup gets the same `surface-card` chip treatment as the KW Commercial mark (rounded-card, hairline border, white ground) — it is not placed bare on `--dark`. This is a presentation-layer mitigation only; it does not touch the source PNG. **Flagging for Razim / design-director follow-up**: either confirm the chip treatment as the permanent footer presentation, or have a dark-safe re-export produced (ink→paper/gold recolour of the border + "COMMERCIAL" wordmark) so the mark can run bare on `--dark` as ref 01 originally specified.

## States

- Default only — no loading/error/empty state; every string is static content, no client fetch.
- Link hover/focus: `text-fg-muted` → `text-accent-text` (colour only, `duration-fast`/`ease-out`); focus-visible ring from the global base-layer rule (never suppressed here).
- Hanko: static (already-pressed) until its one-time press-in fires per `StampPressIn`'s own contract; reduced-motion / `motionAllowed() === false` render it already pressed, full opacity, no motion — no extra work needed in this file, the atom owns it.

## Motion

Only the hanko's existing `StampPressIn` (scale 1.06→1 + opacity, `DUR.base`, `EASE.out`, fires once). Nothing else in this file animates — link colour transitions are `duration-fast`/`ease-out` per ref 05's hover table, not a "reveal."

## Accessibility

- `<footer>` is the sole landmark on the page rendering `role="contentinfo"` implicitly (top-level, not nested in `<article>`/`<aside>`).
- Two internal `<nav>` landmarks, each with a distinct `aria-label` ("Footer navigation", "Policies") so multiple `<nav>`s on the page stay disambiguated for assistive tech.
- Every link's accessible name is real, visible text that makes sense out of context (column link labels are already full phrases — "Request a written BOV", not "Learn more"); the a100 Arms external link additionally carries a visually-hidden "(opens in a new tab)" suffix.
- Stacked-lockup image: `alt=""` (decorative) — its content ("The Hokuten Group" / "KW Commercial") is already present as real, adjacent text (the brand-line sign-off, the copyright line, and the separately-alt'd KW Commercial mark), so an empty alt avoids double-announcing a duplicate description, matching the reasoning `Stamp.tsx` already documents for the hanko.
- KW Commercial mark: `alt={KW_COMMERCIAL_MARK.alt}` — frozen, byte-exact ("Keller Williams Commercial"), never touched.
- Colour tokens only: `text-fg` / `text-fg-muted` / `text-fg-meta` (no invented opacity).
- Tap targets: every standalone link gets `inline-flex min-h-11 items-center` (44px), mirroring `LegalPage.tsx`'s `TAP_TARGET` constant.

## Acceptance criteria

- [ ] `BROKERAGE_DISCLOSURE` renders both sentences verbatim with a hard line break, sourced only from `@/content/compliance`.
- [ ] KW Commercial mark renders only in this file sitewide (grep gate: `grep -rn "kw-commercial" site/components site/app` → 1 hit outside `LegalPage.tsx`'s reduced stand-in, which is documented as separate, non-shared chrome).
- [ ] Only `lockup-stacked-gold.png` is referenced — never `lockup-linear-gold.svg` — anywhere in this file.
- [ ] `<Stamp` / `<StampPressIn` count sitewide stays ≤ 3 after this file lands (footer is placement ①).
- [ ] No hex/`rgb()`/Tailwind default-palette colour class anywhere in the file — `grep -nE "text-(gray|slate|zinc|blue)-|#[0-9a-fA-F]{3,6}|rgb\("` on this file returns nothing.
- [ ] Footer bottom padding visibly clears a `--ticker-h`/`--ticker-h-mobile`-tall fixed bar at 375px and 1440px.
- [ ] `npx tsc --noEmit --incremental false` from `site/` reports no error in this file.
