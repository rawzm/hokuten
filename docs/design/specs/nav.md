# Nav — `SiteNav` + `MenuOverlay`

**Section/Route**: Site-wide chrome (sticky top bar + full-screen menu overlay, main landing page). Not a numbered anchor section — chrome, like the footer, carries no `SECTION_IDS` entry of its own.
**Status**: approved (self-authored per the task brief's "define the contract yourself and report it" instruction — no open decision blocks implementation)
**Owner**: `site/components/sections/SiteNav.tsx`, `site/components/nav/MenuOverlay.tsx`
**Governs**: ref 04 "Nav" · ref 03 (surfaces, type ramp, components) · ref 05 (motion, reveals excluded — nav does not reveal) · ref 07 (P0: 44px targets, focus, no KW lockup in header)

## ⚠️ Concurrency note — read before touching either file

At authoring time neither `site/components/hero/HeroCoverPanel.tsx` nor `site/components/brand/Wordmark.tsx` existed (verified at the start of this task: `find site -iname "*hero*" -o -iname "*wordmark*"` returned only the wordmark **SVG assets** under `public/brand/`, no component). Per the task brief this agent **defines the sentinel contract** rather than reading one, and **reports it precisely** here and in `SiteNav.tsx`'s own header comment so the hero agent can implement to it without re-deriving it.

**Update, mid-task**: `components/brand/Wordmark.tsx` landed from a concurrent agent before this file was finished (`git status` partway through this task). `SiteNav.tsx` was updated to import and use it directly (`<Wordmark className="text-data" />` inside the nav's own `<a href="#hero">`) rather than shipping the originally-planned `brand-line` text fallback — the fallback text and `Wordmark`'s own default `variant="text"` render identically (both are `BRAND_LINE` through the `brand-line` utility), so this was a clean swap with no layout change. **`site/components/hero/HeroCoverPanel.tsx` had still not landed** as of this file's last edit — the sentinel contract below remains a definition for the hero agent to implement, not a read-back of an existing one.

## The sentinel contract (SiteNav defines this; the hero chassis implements it)

```
<section id="hero" ... data-nav-sentinel data-surface="dark" | "light">
```

- **Element**: whichever element spans the hero's **full block extent** (the `<section id="hero">` root itself is the simplest correct choice — no extra wrapper needed). Exactly one such element is expected in Phase 1.
- **`data-nav-sentinel`**: boolean marker (presence only) — this is the element `SiteNav` queries for and observes.
- **`data-surface`**: `"dark"` for Theme G's cover-panel chassis (`--black` ground, ivory art/type) · `"light"` for Theme B's plate chassis (`heroSurface: "surface-paper"` in `lib/theme.ts` — the Coronal plate is a **light** hero). Read `themePresentation.heroSurface` (already exists in `lib/theme.ts`) to derive this rather than hand-writing a theme check: `themePresentation.heroSurface === "surface-black" ? "dark" : "light"` is the exact mapping today's two presentation records produce.

**Why the sentinel spans the whole hero, not just its edge**: `SiteNav` observes it with `rootMargin: "-{navHeightPx}px 0px 0px 0px"` (top-trimmed by the live `--nav-h` custom property, read via `getComputedStyle` — never hard-coded) and `threshold: 0`. Trimming the observed root's top edge down by the nav's own height means "intersecting" is true precisely while the area **behind the nav band** (the top `--nav-h` px of the viewport) is still showing hero content, and flips false the instant the nav's own bottom edge passes the hero's bottom edge — not when the hero merely starts leaving the viewport lower down. A thin marker at only the hero's bottom edge cannot produce this signal (it would report "not intersecting" both before the hero is reached at all *and* after it's passed, which are opposite states); the full span is load-bearing, not a convenience.

**Fallback**: if `document.querySelector('[data-nav-sentinel]')` finds nothing (today's interim build, or a future chassis that forgets the attribute), `SiteNav` defaults to the **light** variant permanently and logs a dev-only `console.warn` pointing at this file. Light was chosen over dark as the safe default because ink-on-transparent degrades legibly against most content, while ivory-on-transparent can vanish over an unexpectedly light background — failing toward the more universally legible state.

**Extensibility already built in, not yet wired**: only the hero needs a sentinel today (ref 04 names only "dark variant over hero"); nothing else provides one. If a later phase wants the nav to also react to `#method`/`#mandates`, those sections can carry the same two attributes and nothing in `SiteNav` need change — ***but*** today's implementation queries only the *first* `[data-nav-sentinel]` in the document, so a second one added later would need `SiteNav` revisited to watch all of them, not just one.

## Intent

Wayfinding that reads as trading-desk chrome, not a brochure header: literal section labels, a numbered full-screen index behind the overflow trigger, one gold CTA. Never competes with the hero's signature art — transparent until the visitor commits to scrolling.

## IA

**SiteNav** (sticky bar): Wordmark (left, links to `#hero`) → 5 anchor links from `navLinks` (center, `lg:` and up only) → gold CTA "Request a written BOV" (`sm:` and up) → `MenuOverlay` trigger (always).
**MenuOverlay** (dialog): visually-hidden `DialogTitle` → warm hotel photo panel (left, `lg:` and up only) → 8-item serif numbered index from `menuItems` → footer utilities (phone · email · `PRIVATE ACCESS →`) → built-in `DialogContent` close X (inherited, not re-built).

## Component plan

### `SiteNav.tsx` — entirely `"use client"`

Unlike most sections, the whole file is a client component rather than a server shell with a client island: nav's *entire* purpose here is dynamic (scroll-driven background, hero-driven text variant, IntersectionObserver-driven active link, click-driven focus management), so there is no meaningful server-rendered remainder to push the boundary below. This matches the codebase's existing leaf-client precedent (`Stamp.tsx`, `AsciiCanvas.tsx`, `ConsentModal.tsx`) rather than the "small island inside a big server section" pattern used for actual page sections.

**Structure**:
```
<div data-nav-scroll-sentinel aria-hidden="true" className="absolute left-0 top-0 h-6 w-px pointer-events-none" />
<nav aria-label="Primary" className={surfaceClass + "sticky top-0 z-40 h-[var(--nav-h)] ..."} style={{ backgroundColor: ... }}>
  <div className="container-hk flex h-full items-center justify-between gap-6">
    <a href="#hero" className="brand-line text-data">{BRAND_LINE}</a>          {/* Wordmark fallback, see below */}
    <ul className="hidden lg:flex ...">{navLinks.map(...)}</ul>
    <div className="flex items-center gap-3">
      <Button asChild className="hidden sm:inline-flex"><a href={navCta.href}>{navCta.label}</a></Button>
      <MenuOverlay />
    </div>
  </div>
</nav>
```

**Two independent state axes, never conflated**:
1. `scrolled: boolean` — has the page scrolled past 24px (ref 04: "paper with blur on scroll"). Detected with a **self-owned** sentinel: a `pointer-events-none`, `aria-hidden`, `h-6` (24px) marker absolutely positioned at `top:0` of the page (no positioned ancestor needed — it resolves against the initial containing block, i.e. the true document top), observed with a plain `threshold: 0` IntersectionObserver. `scrolled = !entry.isIntersecting`. This sentinel has nothing to do with the hero and exists purely so "has the page scrolled at all" never touches `window.scrollY`.
2. `surface: "dark" | "light"` — which token set the nav's own text/background should read from. Comes **only** from the hero sentinel contract above; never inferred from `scrolled` or from scroll position.

**Why they never combine into a bad pairing**: both the nav's background *and* its text/icon/CTA colour are driven by the *same* `surface` value, via the *same* mechanism the rest of the codebase already uses for this — the `.surface-dark` / `.surface-paper` scope classes (they rebind `--fg`, `--accent-text`, `--hairline`, `--focus`, `--surface` together). `scrolled` only ever toggles **whether a background paints at all** (`backgroundColor: transparent` vs `color-mix(in srgb, var(--surface) 88%, transparent)`, plus `backdrop-blur-md`/`hairline-b`/`shadow-bar`), never *which* colours it uses. So "scrolled + dark" is a translucent-blurred **dark** bar with ivory text (valid, high-contrast) and "scrolled + light" is the familiar paper-blur bar with ink text — the ivory-text-on-paper-background failure mode this two-axis design was built to avoid never becomes reachable.

**Why background is set via inline `style`, not a Tailwind class**: `.surface-dark`/`.surface-paper` (globals.css §3) are plain, **unlayered** CSS (not wrapped in any `@layer`), and their `background-color: var(--surface)` declaration is unconditional. Per the CSS cascade-layers spec, unlayered rules always beat rules inside *any* `@layer` — and every Tailwind utility class (`bg-transparent`, `bg-[...]`, etc.) is generated inside `@layer utilities`. So no Tailwind background utility, at any specificity or class order, can ever override `.surface-dark`'s own background on the same element — only an inline `style` (which outranks both layered and unlayered class rules) can. Verified against the actual stylesheet structure in `site/app/globals.css`, not assumed.

**Active link** (`navLinks`, 5 items): one IntersectionObserver over `document.getElementById(id)` for each `navLinks` href, `rootMargin` top-trimmed by `--nav-h` (+8px) and bottom-trimmed `-70%` — a thin "active band" just under the bar. When more than one target intersects that band simultaneously, the one earliest in `SECTION_IDS` (imported from `@/content/site`, the canonical DOM order) wins — deterministic, no reliance on DOM query order. Active = `font-semibold` (Inter 600) `text-fg` + `border-b-2 border-accent-text`; inactive = `font-normal text-fg-muted`, transparent border reserved at the same width (no CLS on state change). `aria-current="location"` on the active link (the ARIA spec's own worked example for "current item in a navigation bar").

**Anchor-click focus** (P0, brief-mandated): clicking any internal `#id` link does **not** `preventDefault` — native hash navigation keeps ownership of the scroll (respecting the global `scroll-margin-top` in globals.css) and the URL. After that, a local `focusAnchorTarget(hash)` helper moves DOM focus to `#{id}-heading` (the convention every section already uses — verified against `ClosingsSection`/`ListingsSection`/`StatsSection`/`FaqSection`/`MandatesSection`/`DoorsSection`/`MethodSection`, all of which pair `<section id aria-labelledby="{id}-heading">` with a heading carrying that exact id), falling back to `#{id}` itself if no heading exists yet (today's `Blocked` placeholders for `#calculator`/`#team`). If the target has no `tabindex`, one is added (`-1`) for the duration of the focus and removed on blur — the standard accessible pattern for moving focus to a non-interactive heading without leaving it permanently tab-stoppable.

**Wordmark**: `<a href="#hero"><Wordmark className="text-data" /></a>` — `components/brand/Wordmark.tsx` (named export, Server Component) landed mid-task from a concurrent agent; its default `variant="text"` renders `BRAND_LINE` through the same `brand-line` utility the footer's sign-off line already uses, wrapped in this file's own `<a>` for the link/tap-target/click-focus behaviour Wordmark itself doesn't own. Flagged risk, unchanged by the swap: the full tracked-caps phrase ("THE HOKUTEN GROUP") is wide; at 375px it sits directly beside the 44px menu trigger with little slack. Worth a visual check in the browser — `variant="lockup"` (the theme SVG) is available on the same component if the text treatment proves too wide in practice.

**No KW lockup** (P0, ref 04): neither file imports any `kw-commercial` asset. Grep gate: `grep -rn "kw-commercial\|KW_COMMERCIAL" site/components/sections/SiteNav.tsx site/components/nav/MenuOverlay.tsx` → no hits.

### `MenuOverlay.tsx` — `"use client"`, built on `components/ui/dialog.tsx`

Everything ref 04 asks for that `ui/dialog.tsx` already implements is **not re-implemented here**: focus trap, focus restore to the trigger, `Esc` closes, body scroll lock (Radix `modal` defaults to `true`), `role="dialog"` + labelling, and the open/close motion (`opacity` + `translateY`, `DUR.base`, `EASE.inOut`, reduced-motion-gated) all come from the primitive for free. This file is composition + content, not new dialog mechanics.

- Trigger: circular `size-11` (44px) hairline button, Lucide `Menu` icon, `aria-label="Open menu"`. Same physical element serves as "circular hamburger" on mobile and "desktop overflow trigger" — ref 04 names it twice by *role*, not as two different controls.
- Content: `placement="center"`, `positionerClassName="p-0"`, `className="surface-dark h-full max-h-[100dvh] w-full max-w-none rounded-none p-0 overflow-y-auto"` — full-bleed. `max-w-lg`→`max-w-none` and the `p-6 sm:p-8`→`p-0` overrides are both in `cn()`'s well-known default Tailwind groups (verified safe). `surface-card`→`surface-dark` is a **custom** class pair `tailwind-merge` cannot recognise as conflicting (confirmed: `lib/utils.ts`'s `cn()` calls plain `twMerge()` with no custom group config) — both classes end up present on the element, but `globals.css` §3 declares `.surface-dark` **after** `.surface-card`, so at equal (unlayered, class-selector) specificity `.surface-dark` wins the shared custom properties by source order regardless of which order they appear in the `class` attribute. Verified against the file, not assumed. `rounded-card`→`rounded-none` has the same "both classes may survive the merge" risk with no visible consequence (a 2px corner radius is imperceptible on a full-viewport panel).
- Overlay itself carries `.surface-dark` for both themes (a deliberate consistency call, not derived from `data-nav-sentinel` — the overlay is a distinct full-screen takeover moment, not "still over the hero," and Theme B's own dark tokens are already contrast-proven in `docs/design/CONTRAST.md`). Flagged as a judgement call, same as `MethodSection`'s micro-label-index call and `SiteFooter`'s lockup-chip call — revisit if Razim wants it themed light for Theme B.
- Photo panel: `hidden lg:block lg:w-[38%]`, `PhotoFrame` (default export, per the task brief's own warning) at `aspect="3/4"`, `className="h-full"` so it stretches the full column height of the two-column layout (aspect governs width→height only when height is otherwise unconstrained; an explicit `h-full` is a legal, deliberate override, not a conflict — verified: `PhotoFrame` composes `aspect-[3/4]` and a caller `className` via `cn()`, and `aspect-ratio` and `height` are different CSS properties so there is no utility-group collision to resolve). Photo: `closings.find(c => c.name === "Renaissance Reno Downtown")` from `@/content/closings` — reusing an already-`verified-current` photo + alt string rather than inventing new copy (content law). Any of the six closings photos would satisfy the brief equally; this one was picked for a warm dusk tone that reads well behind dark chrome.
- Numbered index: `menuItems` (8 items) from `@/content/nav`, each row `<DialogClose asChild><a href .../></DialogClose>` — clicking a destination both navigates *and* closes the overlay via Radix's own close semantics. Index numeral + label both `font-display` (Fraunces) per ref 04's "serif index," reusing `text-heading`/`text-display2` tokens (no fifth size invented).
- **Focus conflict, resolved deliberately**: Radix's default `onCloseAutoFocus` returns focus to the trigger on every close — correct for Esc/outside-click/the built-in X, wrong when the close was caused by clicking a destination link (focus should land on the target heading instead, per the same P0 rule `SiteNav` implements). A `pendingFocusRef` set only inside the menu-item click handler lets a custom `onCloseAutoFocus` on `DialogContent` distinguish the two cases: if a navigation is pending, `event.preventDefault()`s Radix's restore and calls the same `focusAnchorTarget` helper instead; otherwise Radix's default (focus-to-trigger) runs untouched. This is a consumer-supplied prop, not an edit to `ui/dialog.tsx` itself — the primitive's own "never override `onCloseAutoFocus` in this file" rule is scoped to that file, not its callers.
- Footer utilities: `menuUtilities.phone`/`.email` as plain `mailto:`/`tel:` links (content/nav.ts's own comment: inside the overlay a plain link is correct, no copy-button here) + `menuUtilities.privateAccess` as an external link (`target="_blank" rel="noopener noreferrer"`, visually-hidden "(opens in a new tab)" suffix — the exact pattern `SiteFooter.tsx`'s `FooterNavLink` already uses) rendered in the mono tracked-caps micro-label voice with a literal `→` (permitted as *type* inside a mono micro-label per the a11y law; wrapped `aria-hidden` since the visually-hidden suffix already carries the same information for assistive tech).
- `focusAnchorTarget` and the click-handler shape are **duplicated** from `SiteNav.tsx` rather than extracted to a shared helper: this agent's remit is exactly these two files plus this spec, and a new file under `lib/` is out of scope per the "write only your assigned files" rule. ~15 lines, documented at both sites.

## States

- **SiteNav**: `(scrolled × surface)` = 4 valid combinations, all described above; no loading/error/empty state (static chrome).
- **MenuOverlay**: closed (default) / open (Radix-driven) / reduced-motion (open/close is instant, fully styled — inherited from `ui/dialog.tsx`, nothing extra needed here).
- Both: no hover-only information (active-link state is not hover-dependent; the overlay trigger's hover colour shift has a focus-visible equivalent via the global focus-ring base rule).

## Motion

- `SiteNav`: `transition-colors duration-base ease-out` (CSS transition, not `motion/react` — no JS reduced-motion gate needed because the global `@media (prefers-reduced-motion: reduce)` block in `globals.css` already forces all transition-durations to `0.01ms`, the same reasoning `Button.tsx` documents for its own colour-only hover transition).
- `MenuOverlay`: open/close motion is entirely `ui/dialog.tsx`'s (`opacity` + `translateY(DIST.page)`, `DUR.base`, `EASE.inOut`, `motionAllowed()`-gated). Nothing in this file animates on its own.

## Accessibility

- `<nav aria-label="Primary">` (bar) and `<nav aria-label="Site menu">` (overlay index) — two `<nav>` landmarks on the page at once, each distinctly labelled, mirroring `SiteFooter.tsx`'s own "Footer navigation" / "Policies" disambiguation pattern.
- Every link/button clears the 44px tap target: nav links get `min-h-11 items-center`; the CTA is a `Button` (already gate-verified); the menu trigger and the built-in dialog close are both `size-11`.
- Visible focus ring: nothing in either file sets `outline-none` — the global base-layer rule (`:focus-visible { outline: 2px solid var(--focus) }`) applies everywhere, and `--focus` resolves per the active surface scope automatically.
- Anchor navigation moves focus to the target heading (SiteNav links, CTA, and every `MenuOverlay` index item) — the P0 rule from the task brief, implemented as described above, not merely "the browser scrolls."
- Decorative elements (`data-nav-scroll-sentinel`, the literal `→` in "Private access") are `aria-hidden`; nothing informational is hidden.
- `DialogTitle` is always rendered (Radix requirement for a labelled dialog) as `visually-hidden` text ("Site menu") — the overlay has no visible title per the design, exactly the pattern `ui/dialog.tsx`'s own header comment prescribes.

## Acceptance criteria

- [ ] At `scrollY = 0` over a Theme G page, nav renders fully transparent with ivory/`--fg`-on-dark text and CTA.
- [ ] At `scrollY = 0` over a Theme B page, nav renders fully transparent with ink/`--fg`-on-light text (never the dark variant) — confirms the sentinel's declared surface, not "am I over the hero," governs the state.
- [ ] Scrolling past 24px adds the paper/dark-tinted blurred background + `hairline-b` + `shadow-bar`, with **no** change in nav height (`--nav-h` constant throughout — zero CLS).
- [ ] Scrolling past the hero's bottom edge (nav's own band now over the next, light section) flips `surface` to light even mid-scroll, without needing to leave and re-enter the viewport.
- [ ] Exactly one of the five `navLinks` is marked active at any scroll position once the page has real section content; none are active before the user has scrolled to any of them.
- [ ] Clicking any nav link, the CTA, the wordmark, or any of the 8 overlay items moves DOM focus to the destination's `{id}-heading` element (verify via a screen reader or by checking `document.activeElement` after the click).
- [ ] `MenuOverlay` traps focus, closes on `Esc`, restores focus to its trigger on `Esc`/outside-click/X, and locks body scroll — all verified by exercising the dialog, not read off `ui/dialog.tsx`'s comments alone.
- [ ] `grep -rn "kw-commercial\|KW_COMMERCIAL" site/components/sections/SiteNav.tsx site/components/nav/MenuOverlay.tsx` → no hits.
- [ ] No hex/`rgb()`/Tailwind default-palette colour class in either file — `grep -nE "text-(gray|slate|zinc|blue)-|#[0-9a-fA-F]{3,6}|rgb\(" site/components/sections/SiteNav.tsx site/components/nav/MenuOverlay.tsx` → no hits (the `color-mix(in srgb, var(--surface) ...)` inline style is a token reference, not a raw colour, and is exempt by construction — it never names a hex).
- [ ] `npx tsc --noEmit --incremental false` from `site/` reports no error in either file.
