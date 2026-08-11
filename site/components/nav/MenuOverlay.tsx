"use client";

/**
 * components/nav/MenuOverlay.tsx — the full-screen numbered menu overlay
 * (mobile hamburger + desktop overflow trigger).
 *
 * SOURCE OF RECORD (this rewrite): docs/DESIGN-REVISIT-2.md D17 + §6.2 ("Menu
 * overlay"), superseded on the points below by docs/DESIGN-REVISIT-3.md D26
 * (Razim, 2026-08-10, written review against a live render — see that
 * section's header quote). D17 fixed the art-panel-overlaps-index P0 but
 * shipped two new defects Razim called out from screenshots: a normal-case
 * scrollbar, and a visible inset/gap where generic dialog geometry leaked
 * through. Both are root-caused and fixed here, not just re-skinned; both
 * fixes below are still load-bearing and unchanged by D26.
 *
 * ── DEFECT 1 — the gap: a `sm:` padding leak in the class-merge, not a CSS
 *    bug ─────────────────────────────────────────────────────────────────
 * ui/dialog.tsx's positioner carries `"items-center justify-center p-4
 * sm:p-6"` and its panel carries `"... p-6 sm:p-8 ..."`. The previous build
 * overrode each with a bare `"p-0"`. `cn()` is plain `tailwind-merge`
 * (verified in lib/utils.ts — no custom group config), and tailwind-merge's
 * conflict key is (variant-chain + class-group), not class-group alone: a
 * bare `p-0` (empty variant chain) only cancels a bare `p-6`/`p-4` (same
 * empty chain). It does NOT cancel `sm:p-8`/`sm:p-6` — those live under a
 * DIFFERENT chain (`"sm:"`) that nothing in a bare override touches. So at
 * every viewport ≥640px, the base classes' own `sm:` padding kept rendering
 * — 24px around the positioner and 32px around the panel — exactly the
 * "generic dialog geometry leaks through" gap Razim's screenshot showed.
 * THE FIX below: every override that targets a class dialog.tsx sets under a
 * variant also supplies that SAME variant explicitly (`"p-0 sm:p-0"`,
 * `"items-stretch justify-stretch"` in place of centering so there is no
 * percentage/centering math to round at a fractional zoom either). `hairline`
 * (border) and `shadow-overlay` are dialog.tsx's own custom, non-tailwind-
 * merge-aware utility classes — merge conflict detection can't touch them, so
 * `border-0!`/`shadow-none!` use Tailwind v4's trailing-`!important` suffix
 * (verified against node_modules/tailwindcss's candidate parser, which reads
 * a trailing `!` off any class) to win regardless of stylesheet source order.
 * This is also why the D26 close button below (a CHILD of this same panel)
 * gets its own literal `hairline` border rather than inheriting one — the
 * panel's own border is force-zeroed by that same `border-0!`.
 *
 * ── DEFECT 2 — the scrollbar: nine rows in one column, fixed ───────────────
 * The pre-D17 build listed all nine numbered destinations (plus the
 * unnumbered lead item) in a single vertical column at a large serif size —
 * that alone was taller than most desktop viewports. Per D17 the destinations
 * run in TWO COLUMNS on desktop (01–05, then 06–09; a CSS Grid in
 * `grid-auto-flow: column` with 5 explicit rows does the 01-05/06-09 split
 * for free from the array's existing order — no reordering of content/nav.ts
 * needed), which roughly halves the index's vertical demand. Combined with an
 * explicit row budget on the nav panel (`grid-rows-[auto_1fr_auto]` —
 * deterministic, not a `justify-between` guess) this fits inside 100dvh at
 * every mandated acceptance viewport without scrolling. The dialog panel
 * keeps `overflow-y-auto` as the documented EXCEPTIONAL fallback (short-
 * height / landscape-mobile / 200% zoom): every wrapper between the panel and
 * its content uses `min-h-full` (grows if content genuinely needs more, never
 * a hard `h-full` that would clip), so a real system-style scrollbar — never
 * a clip — is what happens if a normal layout's assumptions break.
 *
 * ── D26 (Razim, 2026-08-10) — the photo panel is gone; lockup centred +
 *    large; close floats top-right ─────────────────────────────────────────
 * Razim's exact words: "the menu bar has this big holiday inn phot in the
 * left side. instead have the brand logo in the middle big enough the
 * content inside the logo is visible. and remove the current logo placement
 * in top right and have the close button in top right not in the middle."
 * Three changes from that, all in this file:
 *   1. The left/top panel (previously a `PhotoFrame` rendering
 *      `public/hotels/hie-brooklyn.jpg`, cropped via `object-position` to two
 *      different boxes — see the now-removed "content gap, reported" section
 *      this replaces) is now a quiet BRAND PANEL: the theme-matched lockup,
 *      centred on both axes, using the new `lockupXl` derivative
 *      (`site/lib/theme.ts` → `themePresentation.lockupXl`, ~640px tall,
 *      prepared by `scripts/identity-prep.ts` from the same master/trim the
 *      132px-tall `lockup` header asset uses — "[s]ame master, same trim;
 *      only the output size differs," per that script's own D26 comment,
 *      which is also where the aspect ratios `BRAND_LOCKUP_XL_ASPECT` below
 *      restates come from). Renders ≈300px tall on desktop (`lg:h-[300px]`,
 *      inside D26's mandated 260–320px band) and a compact ≈56–80px band on
 *      mobile (Task 3: "same asset, smaller render") — both comfortably past
 *      the ~150px point past which the 132px `lockup` derivative visibly
 *      softens (identity-prep.ts's own note).
 *   2. `menuArt.ts` / `menu-prep.ts` / `public/menu/` are UNUSED as of this
 *      change — see that file's own header for the parked note. The stale
 *      flag this section used to carry ("content/artwork.ts:208 ... when
 *      menuArt.ts lands, swap this block for its resolver") is now moot:
 *      there is no photo block left to swap it into. If Razim wants a photo
 *      panel back later, that flag's original intent (wire up menuArt.ts's
 *      `getMenuArt`/`getMenuArtSources`) is still the right pointer — see
 *      menuArt.ts's header for the one-component-swap note.
 *   3. The close control (Task 2 below) no longer lives inside the nav
 *      panel's own grid at all — it floats above BOTH panels via `absolute`,
 *      pinned to the overlay's actual top-right corner regardless of which
 *      panel happens to be under it at a given breakpoint.
 *
 * ── Layout, in one picture (updated for D26) ──────────────────────────────
 * Outer grid: mobile stacks `[brand panel] / [nav panel]` (`grid-rows-[auto_
 * 1fr]` — the brand panel is a fixed-height row, the nav panel takes the
 * rest); desktop (`lg:`) goes side by side, `grid-cols-[2fr_3fr]` (~40/60),
 * one row. Non-overlapping grid children by construction (both panels are
 * plain grid cells, nothing absolutely positioned competes with either one's
 * own box — the D26 close button positions relative to the PANEL ELEMENT
 * (the `m.div` DialogContent renders, which fills the full-bleed `fixed
 * inset-0` positioner edge-to-edge per Defect 1), not relative to either grid
 * cell, so it sits ABOVE the seam between them rather than being claimed by
 * whichever column happens to occupy that corner). The nav panel itself is
 * one more grid (`grid-rows-[auto_1fr_auto]`): a now-EMPTY spacer row (D26 —
 * previously held close · lockup, both relocated; kept only so the index
 * below still starts clear of the floating close button's footprint rather
 * than creeping up under it), the index row (lead link + the two-column
 * 01–09 grid, vertically centered in whatever space is left), utilities row
 * (phone · email · PRIVATE ACCESS →, `hairline-t`). Utilities cannot overlap
 * the index — they are a different grid row, not an absolutely-positioned
 * bottom bar riding over it.
 *
 * ── D26 close button — floats above both panels, self-scoped for contrast ──
 * Positioned `absolute` (not `fixed`) inside the panel `m.div`, which is
 * itself `relative` and fills the viewport 1:1 (Defect 1) — so `top-*
 * right-*` here already mean the literal screen corner without needing
 * `position: fixed`. `fixed` would in fact be misleading to reach for: the
 * SAME `m.div` carries Framer Motion's animated `y` transform for the open/
 * close slide (ui/dialog.tsx `panelMotion`), and a `transform` on an
 * ancestor establishes its own containing block for `position: fixed`
 * descendants — so a `fixed` button here would silently behave exactly like
 * `absolute`-relative-to-panel anyway, mid-animation. `absolute` says
 * outright what actually happens.
 * The button carries its OWN `surface-card` scope rather than inheriting
 * from its DOM parent (the panel's `surface-dark` class, from Defect 1's
 * className list): it visually sits over the light `surface-paper` brand
 * band on mobile (row 1) and the dark nav panel on desktop (right column) —
 * two different ambient grounds, one shared DOM parent. Plain `text-fg-muted`
 * would resolve pale-on-dark everywhere (inheriting `surface-dark`'s custom
 * properties by DOM position, which does not track paint position) and go
 * low-contrast the instant it paints over the light band. `surface-card`
 * gives the button its own opaque light ground + dark-ink glyph + hairline
 * border, so it reads correctly against both surfaces because it now paints
 * its own background rather than depending on whatever is behind it.
 *
 * ── Renumbered index (content/nav.ts, not owned by this file) ─────────────
 * `menuItems` is one unnumbered lead row ("The Group" → `#hero`, deliberately
 * uncounted — see that file's own header) followed by the canonical `01`–`09`
 * sequence every section's own micro-label already uses. `[leadItem,
 * ...numberedItems] = menuItems` relies on that exact shape (lead item first,
 * nine numbered items after) — if content/nav.ts's owner ever reorders it,
 * this destructure needs a matching edit; reported, not fixed here (out of
 * this file's remit).
 *
 * ── Built on ui/dialog.tsx — most of the P0 list here is inherited, not new ──
 * Focus trap, focus restore to the trigger, Esc-closes, body scroll lock
 * (Radix `modal` defaults true), `role="dialog"` + labelling, and the open/
 * close motion (opacity + translateY, DUR.base, EASE.inOut, reduced-motion-
 * gated) all come from the primitive for free — untouched by this rewrite.
 *
 * ── The focus conflict this file resolves deliberately — PRESERVED ────────
 * Radix's default `onCloseAutoFocus` returns focus to the trigger on every
 * close — correct for Esc / outside-click / the close X, WRONG when the close
 * was caused by clicking a destination link, where focus should land on the
 * target section's heading instead. `pendingFocusRef` is set only inside the
 * menu-item click handler, so the custom `onCloseAutoFocus` below can tell
 * the two cases apart: if a navigation is pending, it `preventDefault()`s
 * Radix's restore and moves focus itself via `focusAnchorTarget`; otherwise
 * Radix's default (focus-to-trigger) runs untouched. This mechanism is
 * unchanged from the pre-rewrite file, and unchanged by D26 (the close button
 * moved on screen; it is still the same Radix `DialogClose`, so Radix's
 * default focus-to-trigger behaviour on close-via-X is untouched).
 * `focusAnchorTarget` itself comes from `components/nav/AnchorLink.tsx`
 * (that file's own header explicitly invites both call sites to drop their
 * local copy in its favour) instead of a second hand-duplicated copy —
 * behaviourally byte-identical to the function it replaces.
 *
 * ── DialogTitle stays present-but-visually-hidden — PRESERVED ─────────────
 * Radix requires a labelled dialog; the design has no visible title.
 *
 * ── D7 (JS budget) — resolved at the SiteNav call site, not in this file ──
 * SiteNav.tsx imports this component via `next/dynamic` with the default
 * `ssr: true` so the trigger button still renders server-side and stays
 * keyboard reachable before the overlay chunk loads. Export shape (`{
 * MenuOverlay }`, named export, optional `className` on the trigger) is
 * unchanged so that call site keeps working untouched.
 */

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { KanjiAccent } from "@/components/art/KanjiAccent";
import { Wordmark } from "@/components/brand/Wordmark";
import { focusAnchorTarget } from "@/components/nav/AnchorLink";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { menuItems, menuUtilities } from "@/content/nav";
import { THEME, themePresentation, type HokutenTheme } from "@/lib/theme";

const TAP_TARGET = "inline-flex min-h-11 items-center";

/** Lead item ("The Group" → #hero, unnumbered) + the nine numbered
 *  destinations, in that order — see file header re: content/nav.ts's shape. */
const [leadItem, ...numberedItems] = menuItems;

/**
 * Same trimmed-master aspect Wordmark.tsx's own (private, unexported)
 * `BRAND_LOCKUP_ASPECT` documents (gold 669×501, blue 971×811 —
 * DESIGN-REVISIT.md §4.1), restated here because that constant isn't
 * exported and this file's remit doesn't extend to editing Wordmark.tsx.
 * `scripts/identity-prep.ts`'s own D26 comment on the `lockupXl` derivative:
 * "[s]ame master, same trim; only the output size differs" — so this ratio
 * is exact for `lockupXl`, not an approximation carried over from a
 * different asset.
 */
const BRAND_LOCKUP_XL_ASPECT: Record<HokutenTheme, number> = {
  gold: 669 / 501,
  blue: 971 / 811,
};

/** `lockupXl`'s true intrinsic height (D26: "~640px tall"). Also the
 *  `<Image>` intrinsic reference height passed below — the desktop/largest
 *  figure, matching the CLS + source-quality-headroom convention
 *  Wordmark.tsx documents for its own "brand" variant. Width is derived per
 *  theme below, never forced — see `BRAND_LOCKUP_XL_ASPECT`. */
const BRAND_LOCKUP_XL_HEIGHT = 640;
const BRAND_LOCKUP_XL_WIDTH = Math.round(BRAND_LOCKUP_XL_HEIGHT * BRAND_LOCKUP_XL_ASPECT[THEME]);

export function MenuOverlay({ className }: { className?: string }) {
  /** Set only when a menu item was the reason the dialog is closing. */
  const pendingFocusRef = useRef<string | null>(null);

  function handleItemClick(event: MouseEvent<HTMLAnchorElement>) {
    const href = event.currentTarget.getAttribute("href");
    if (href) pendingFocusRef.current = href;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className={cn(
            "hairline grid size-11 shrink-0 place-items-center rounded-pill text-fg",
            "transition-colors duration-fast ease-out hover:border-accent-text hover:text-accent-text",
            className,
          )}
        >
          <Menu className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </DialogTrigger>

      <DialogContent
        placement="center"
        // Defeats the positioner's own `items-center justify-center p-4
        // sm:p-6` at every variant it uses (see file header, Defect 1) —
        // `items-stretch justify-stretch` also removes any centering
        // arithmetic that could round unevenly at a fractional device-pixel
        // zoom, on top of the explicit zero padding.
        positionerClassName="items-stretch justify-stretch p-0 sm:p-0"
        // Defeats the panel's own `max-w-lg rounded-card p-6 sm:p-8 hairline
        // shadow-overlay max-h-[calc(100dvh-2rem)]` — see file header, Defect
        // 1. `border-0!`/`shadow-none!` use Tailwind v4's trailing-important
        // suffix because `hairline`/`shadow-overlay` are this codebase's own
        // custom utility classes, invisible to tailwind-merge's conflict
        // detection, so ordinary same-group overriding can't be trusted to
        // win against them. `relative` (kept, not overridden) is what makes
        // the D26 close button's `absolute` positioning below resolve to
        // this panel's own box — which fills the viewport edge-to-edge.
        className={cn(
          "surface-dark relative h-full w-full max-w-none overflow-y-auto",
          "rounded-none! border-0! p-0 shadow-none! sm:p-0",
        )}
        showClose={false}
        onCloseAutoFocus={(event) => {
          if (pendingFocusRef.current) {
            event.preventDefault();
            const hash = pendingFocusRef.current;
            pendingFocusRef.current = null;
            focusAnchorTarget(hash);
          }
        }}
      >
        {/* No visible title in the design — Radix still requires one for a
            labelled dialog. */}
        <DialogTitle className="visually-hidden">Site menu</DialogTitle>

        {/* D26 close control — see file header "D26 close button" section
            for the `absolute`-vs-`fixed` and `surface-card`-scoping
            reasoning. Unchanged: 44px target, Radix DialogClose semantics,
            accessible name. */}
        <DialogClose
          aria-label="Close menu"
          className={cn(
            "surface-card hairline text-fg-muted absolute right-4 top-4 z-10",
            "grid size-11 place-items-center rounded-pill",
            "transition-colors duration-fast ease-out hover:border-accent-text hover:text-accent-text",
            "sm:right-6 sm:top-6 lg:right-8 lg:top-8",
          )}
        >
          <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </DialogClose>

        {/* Mobile: stacked rows, [brand panel] / [nav panel] (brand panel is
            a fixed-height auto row; nav panel takes the rest). Desktop (lg:):
            side by side, ~40/60. `min-h-full` (never a hard `h-full`) on this
            wrapper is what lets a genuinely tall render grow past 100dvh
            instead of clipping — the panel above is the one place that then
            scrolls (see file header, Defect 2). */}
        <div className="grid min-h-full grid-rows-[auto_1fr] lg:grid-rows-1 lg:grid-cols-[2fr_3fr]">
          {/* ── Brand panel — D26: replaces the previous hie-brooklyn.jpg
              photo entirely (see file header). `surface-paper`, not
              `surface-dark`: the lockup raster ships on a flat white/near-
              white ground by design (identity-prep.ts PART 1: "background is
              NOT knocked out to transparency"), so a light surface is the
              only one that ground blends into rather than reading as a
              stray white box against a dark chapter. `lg:h-auto` lets this
              panel stretch to the full column height once the desktop
              `lg:grid-rows-1` single row takes over; the mark itself renders
              ≈300px tall there (inside D26's mandated 260–320px band).
              Mobile gets a compact band per Task 3 ("same asset, smaller
              render"). One <KanjiAccent> (ref 01 motif system, "at most one
              per section") — `opacityMode="light"` is required, not the
              "auto" default: "auto" reads ANY `.surface-dark`/`.surface-
              black` ancestor class, a false positive here since this panel's
              own DOM parent (the DialogContent panel above) carries
              `surface-dark` even though this specific box is a light
              surface — exactly the nested-surface exception KanjiAccent's
              own header names. */}
          <div className="surface-paper relative isolate flex h-28 items-center justify-center overflow-hidden sm:h-36 lg:h-auto">
            <KanjiAccent placement="left" opacityMode="light" />
            <Image
              src={themePresentation.lockupXl}
              alt=""
              width={BRAND_LOCKUP_XL_WIDTH}
              height={BRAND_LOCKUP_XL_HEIGHT}
              className="h-14 w-auto sm:h-20 lg:h-[300px]"
            />
            {/* Real-text brand line (ref 07 P0). The baked "KW COMMERCIAL /
                THE HOKUTEN GROUP" lettering being legible at this size does
                NOT substitute for it — a brand name that lives only inside a
                raster is the documented Sarhan anti-pattern. D26 explicitly
                sanctions visually-hidden for this placement: the mark itself
                is the intended visible brand moment here. */}
            <Wordmark className="visually-hidden" />
          </div>

          {/* ── Navigation panel — one more explicit grid: spacer / index /
              utilities. Deterministic vertical budgeting, never a
              `justify-between` guess. */}
          <div className="surface-dark relative isolate grid grid-rows-[auto_1fr_auto]">
            {/* One <KanjiAccent> per surface (ref 01 motif system) — the
                brand panel opposite has its own; this is the nav panel's. */}
            <KanjiAccent placement="right" />

            {/* Spacer row — D26: previously held close (left) + the small
                44px-render `lockup` (right); both relocated (close → the
                overlay's own top-right corner above; lockup → the brand
                panel, large). Kept empty, same padding as before, purely so
                the index row below still starts clear of the floating close
                button's footprint instead of creeping up under it. */}
            <div aria-hidden="true" className="px-6 pt-6 sm:px-10 sm:pt-8 lg:px-12 lg:pt-8" />

            {/* Index row: lead item, then the nine numbered destinations —
                one column on mobile, two columns (01–05, 06–09) from lg: up
                via `grid-auto-flow: column` over 5 explicit rows. Vertically
                centered in whatever this row's `1fr` track leaves over. */}
            <div className="flex flex-col justify-center overflow-hidden px-6 py-4 sm:px-10 lg:px-12">
              <nav aria-label="Site menu">
                <DialogClose asChild>
                  <a
                    href={leadItem.href}
                    onClick={handleItemClick}
                    className={cn(
                      TAP_TARGET,
                      "micro-label mb-4 text-fg-muted sm:mb-6",
                      "transition-colors duration-fast ease-out hover:text-accent-text",
                    )}
                  >
                    {leadItem.label}
                  </a>
                </DialogClose>

                <ol className="grid grid-cols-1 gap-y-1 sm:gap-y-2 lg:grid-cols-2 lg:grid-rows-5 lg:grid-flow-col lg:gap-x-14 lg:gap-y-1">
                  {numberedItems.map((item) => (
                    <li key={item.href}>
                      <DialogClose asChild>
                        <a
                          href={item.href}
                          onClick={handleItemClick}
                          className="group flex min-h-12 items-baseline gap-5 py-2 sm:gap-6 lg:gap-8 lg:py-3"
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "w-8 shrink-0 font-mono text-data tabular text-fg-meta sm:w-10",
                              "transition-colors duration-fast ease-out",
                              "group-hover:text-accent-text group-focus-visible:text-accent-text",
                            )}
                          >
                            {item.index}
                          </span>
                          <span
                            className={cn(
                              "font-display text-heading font-light text-fg sm:text-display2",
                              "underline decoration-transparent underline-offset-8",
                              "transition-colors duration-fast ease-out",
                              "group-hover:text-accent-text group-hover:decoration-accent-text",
                              "group-focus-visible:text-accent-text group-focus-visible:decoration-accent-text",
                            )}
                          >
                            {item.label}
                          </span>
                        </a>
                      </DialogClose>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {/* Utilities row: phone · email · PRIVATE ACCESS →. A different
                grid row from the index above — cannot overlap it. */}
            <div className="hairline-t flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-8 lg:px-12">
              <div className="flex flex-col gap-2 font-mono text-data text-fg-muted sm:flex-row sm:gap-6">
                <a href={menuUtilities.phone.href} className={cn(TAP_TARGET, "hover:text-fg")}>
                  {menuUtilities.phone.label}
                </a>
                <a href={menuUtilities.email.href} className={cn(TAP_TARGET, "hover:text-fg")}>
                  {menuUtilities.email.label}
                </a>
              </div>

              <a
                href={menuUtilities.privateAccess.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  TAP_TARGET,
                  "gap-2 font-mono text-micro uppercase tracking-micro text-fg-muted",
                  "transition-colors duration-fast ease-out hover:text-accent-text",
                )}
              >
                {menuUtilities.privateAccess.label}
                <span aria-hidden="true">→</span>
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
