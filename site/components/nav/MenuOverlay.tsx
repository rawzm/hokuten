"use client";

/**
 * components/nav/MenuOverlay.tsx — the full-screen numbered menu overlay
 * (mobile hamburger + desktop overflow trigger, ref 04 "Nav").
 * Spec of record: docs/design/specs/nav.md, superseded on every point below by
 * docs/DESIGN-REVISIT.md §4.3 ("Stone anatomy" rebuild, 2026-08-08/09) — that
 * brief is quoted throughout this file. Governed by hokuten-design-director
 * ref 04 (Nav → Menu), ref 03 (surfaces, imagery), ref 07 (P0: focus trap,
 * Esc, body scroll lock, 44px close target).
 *
 * ── P0 BUG DIAGNOSIS (this file was broken — Razim's screenshot showed the
 *    photo panel overlapping the index) — ROOT CAUSE, not just a rewrite ──
 * The old left-column art render was:
 *   <PhotoFrame aspect="3/4" sizes="…" className="h-full" tapReveal={false} />
 * `aspect="3/4"` is REQUIRED by PhotoFrame's fill-mode type and applies a CSS
 * `aspect-ratio: 3/4` to PhotoFrame's own wrapper div. `className="h-full"`
 * applies `height: 100%` to that SAME div. That div sat inside a flex ROW
 * (`lg:flex-row lg:items-stretch`) as an `lg:w-[38%]` column; per the Flexbox
 * spec, a `height: auto` cross-size flex item under `align-items: stretch`
 * gets a DEFINITE used height that PROPAGATES to descendants for percentage
 * resolution — so `h-full` on the inner div resolved to a real, definite
 * pixel value. WIDTH, meanwhile, was never given an explicit value — a plain
 * block box's `width: auto` is the "auto" dimension the CSS Sizing spec
 * checks when applying `aspect-ratio`. With height definite and width auto,
 * the browser computed width = height × (3/4) INSTEAD of respecting the 38%
 * column, so the panel rendered far wider than its column and visually
 * overran the index. This is the documented "aspect-ratio fights an
 * explicitly-stretched height" interaction, not a layout mistake anywhere
 * else in the tree.
 * THE FIX: switch the art panel to PhotoFrame's INTRINSIC mode (real
 * `width`/`height` from the artwork manifest, no `aspect` prop at all) — in
 * that mode PhotoFrame never applies an `aspect-ratio` CSS property to its
 * wrapper in the first place, so `className="h-full w-full"` has nothing to
 * fight. The `<Image>` itself is forced to fill+crop via
 * `imageClassName="h-full w-full object-cover"`, which only ever touches
 * width/height (never a competing `aspect-ratio`). See the art panel render
 * below.
 *
 * ── Rebuild: Stone anatomy (Ref/6a4376f2caf5c096658693.jpg) ──────────────
 * Full-bleed two-panel overlay, no `container-hk` (the reference's art panel
 * and dark panel both run edge-to-edge — a centred, padded container was
 * itself part of why the old build read cramped). Close X is a single
 * top-left control (bg-ink/30 chip so it stays legible over a photo),
 * layered above BOTH panels — NOT `ui/dialog.tsx`'s own built-in top-right X
 * (suppressed via `showClose={false}`; the built-in one is still exactly
 * right for every OTHER dialog on the site, this file just needs a different
 * position for this one surface). Left ~38% is the art panel (real 「北天」
 * artwork once delivered, a designed dark interim otherwise — see next
 * section). Right panel is `.surface-dark`, carrying the serif index with
 * small mono numbers in a left gutter column and generous vertical rhythm;
 * utilities (phone · email · PRIVATE ACCESS) are pinned to the bottom row.
 * Mobile: single dark panel, the art collapses to a fixed-height top band
 * (`h-40 sm:h-56`) rather than disappearing — the OLD build used
 * `hidden … lg:block`, which is why it never appeared on phones at all; that
 * is also fixed here.
 *
 * ── Artwork wiring — content/artwork.ts exists, so its resolver is the
 *    right wiring (not a designed interim) ───────────────────────────────
 * `getArt("menu.panel")` resolves to the manifest's `hie-dusk` portrait crop
 * (3:4, Holiday Inn Express entrance at dusk) if-and-only-if that entry's
 * `status` is `"delivered"`. CONTENT GAP, verified at authoring time
 * (2026-08-09): the manifest entry IS `status: "delivered"`, but
 * `site/public/art/` contains no `hie-dusk-*` files yet (only
 * `beachfront-aerial-hero-*` exists — a different placement, mid-flight from
 * a concurrent agent). This component cannot `fs.existsSync` from the client
 * and has no authority to second-guess the manifest's own status field — the
 * whole point of the resolver pattern (artwork.ts's own header: "a delivered
 * file is a data edit here, never a refactor") is that this file trusts it
 * blindly. Wired here exactly as the manifest says; if the raster files land
 * before this status flips, `next/image` will 404 in the interim. Reported
 * to the content/art-generation owner — not something this file's code
 * should paper over with a filesystem check it cannot perform. `<KanjiAccent
 * />` runs on the interim art panel OR behind the index, never both (D5
 * "one per surface") — gated on the same `menuArt` resolution below.
 *
 * ── Renumbered index (content/nav.ts) ─────────────────────────────────────
 * `menuItems` now follows the sitewide canonical section order (the same
 * numbers each section's own `SectionHeader index=` prop already uses —
 * 01 closings … 09 bov) instead of the old, conflicting standalone 01-08 —
 * see content/nav.ts's header for the full mapping.
 *
 * ── Built on ui/dialog.tsx — most of the P0 list here is inherited, not new ──
 * Focus trap, focus restore to the trigger, Esc-closes, body scroll lock
 * (Radix `modal` defaults true), `role="dialog"` + labelling, and the open/
 * close motion (opacity + translateY, DUR.base, EASE.inOut, reduced-motion-
 * gated) all come from the primitive for free. This file is composition and
 * content, not new dialog mechanics.
 *
 * ── The focus conflict this file resolves deliberately ──────────────────
 * Radix's default `onCloseAutoFocus` returns focus to the trigger on every
 * close — correct for Esc / outside-click / the close X, WRONG when the
 * close was caused by clicking a destination link, where focus should land
 * on the target section's heading instead (the same P0 rule SiteNav.tsx
 * implements for its own links). `pendingFocusRef` is set only inside the
 * menu-item click handler, so a custom `onCloseAutoFocus` on `DialogContent`
 * can tell the two cases apart: if a navigation is pending, it
 * `preventDefault()`s Radix's restore and moves focus itself; otherwise
 * Radix's default (focus-to-trigger) runs untouched. This is a prop supplied
 * BY a consumer, not an edit to ui/dialog.tsx itself — that file's own "never
 * override onCloseAutoFocus in this file" rule is scoped to the primitive,
 * not its callers. PRESERVED VERBATIM from the pre-rebuild file — this
 * mechanism is unrelated to the P0 layout bug and was never touched.
 *
 * ── `focusAnchorTarget` / `handleItemClick` are duplicated from SiteNav.tsx ──
 * Not extracted to a shared helper: this agent's remit is exactly
 * content/nav.ts, this file, and the spec — a new file under lib/ is out of
 * scope ("write only your assigned files"). ~15 lines, documented at both
 * sites; SiteNav.tsx re-exports its copy in case a future owner wants to
 * consolidate.
 *
 * ── The full-screen override, and the two classes that "double-apply" ────
 * `max-w-lg`→`max-w-none` and `p-6 sm:p-8`→`p-0` are both in cn()'s (plain
 * tailwind-merge, no custom group config — verified in lib/utils.ts) default
 * known groups, so the override in `className` below (passed last) wins
 * cleanly. `surface-card`→`surface-dark` is a CUSTOM class pair tailwind-
 * merge cannot recognise as conflicting, so both classes survive onto the
 * element — but globals.css §3 declares `.surface-dark` AFTER `.surface-card`,
 * so at equal (unlayered, class-selector) specificity `.surface-dark` wins
 * the shared custom properties by source order regardless of class-attribute
 * order. `rounded-card`→`rounded-none` has the same "both may survive"
 * shape with no visible consequence (2px rounding is imperceptible on a
 * full-viewport panel). PRESERVED VERBATIM — the className list this
 * paragraph describes is unchanged by the rebuild.
 *
 * ── D7 (JS budget) — resolved at the SiteNav call site, not in this file ──
 * SiteNav.tsx (owned by a concurrent agent, not this one) now imports this
 * component via `next/dynamic(() => import("@/components/nav/MenuOverlay")
 * .then((mod) => mod.MenuOverlay))` with the DEFAULT `ssr: true` — verified
 * in SiteNav.tsx's own header comment, which explains exactly why `ssr:
 * false` would have been wrong (it would drop the trigger from the
 * server-rendered HTML entirely). With `ssr: true`, Next still renders this
 * component's real markup — trigger button + closed dialog — into the
 * initial HTML (identical to what the old static import produced), while
 * its JS still code-splits into a separate chunk fetched on the client. That
 * is exactly what the D7 brief for this file asked for: "the TRIGGER BUTTON
 * must render server-side and stay keyboard reachable even before the
 * overlay chunk loads." Confirmed compatible because this file kept its
 * export shape unchanged (one named `MenuOverlay`, trigger + dialog content
 * together, optional `className` prop) — no restructuring was needed or
 * attempted here.
 *
 * ── DialogTitle stays present-but-visually-hidden ────────────────────────
 * Radix requires a labelled dialog; the design has no visible title.
 * PRESERVED VERBATIM.
 */

import { useRef, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import PhotoFrame from "@/components/atoms/PhotoFrame";
import { KanjiAccent } from "@/components/art/KanjiAccent";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getArt } from "@/content/artwork";
import { menuItems, menuUtilities } from "@/content/nav";

const TAP_TARGET = "inline-flex min-h-11 items-center";

/**
 * Duplicated from SiteNav.tsx — see that file for the full reasoning. Moves
 * DOM focus to a section's heading after native hash navigation has already
 * scrolled to it.
 */
function focusAnchorTarget(hash: string): void {
  const id = hash.replace(/^#/, "");
  if (!id) return;
  const target = document.getElementById(`${id}-heading`) ?? document.getElementById(id);
  if (!target) return;

  const hadTabIndex = target.hasAttribute("tabindex");
  if (!hadTabIndex) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });

  if (!hadTabIndex) {
    const clear = () => {
      target.removeAttribute("tabindex");
      target.removeEventListener("blur", clear);
    };
    target.addEventListener("blur", clear);
  }
}

export function MenuOverlay({ className }: { className?: string }) {
  /** Set only when a menu item was the reason the dialog is closing. */
  const pendingFocusRef = useRef<string | null>(null);

  function handleItemClick(event: MouseEvent<HTMLAnchorElement>) {
    const href = event.currentTarget.getAttribute("href");
    if (href) pendingFocusRef.current = href;
  }

  // Resolved once per render; null exactly when the manifest still marks
  // `menu.panel` as `blocked: awaiting-artwork` (see file header re: the
  // current "delivered but no raster files on disk" content gap, which this
  // still renders as if delivered — that is the correct, intentional
  // behaviour per the resolver contract).
  const menuArt = getArt("menu.panel");

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
        positionerClassName="p-0"
        className="surface-dark h-full max-h-[100dvh] w-full max-w-none overflow-y-auto rounded-none p-0"
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
            labelled dialog (ui/dialog.tsx's own header comment prescribes
            exactly this pattern). */}
        <DialogTitle className="visually-hidden">Site menu</DialogTitle>

        <div className="relative flex min-h-full flex-col lg:flex-row lg:items-stretch">
          {/* Close X — single top-left control per the Stone reference,
              layered above both panels. `bg-ink/30` gives it a legible chip
              over a busy photo (same color-mix-backed opacity utility
              ui/dialog.tsx's own scrim already relies on). Replaces, rather
              than duplicates, ui/dialog.tsx's built-in top-right close
              (suppressed above via `showClose={false}`). */}
          <DialogClose
            aria-label="Close menu"
            className={cn(
              "absolute left-4 top-4 z-20 grid size-11 place-items-center rounded-pill",
              "bg-ink/30 text-fg transition-colors duration-fast ease-out",
              "hover:bg-ink/50 hover:text-accent-text",
              "lg:left-6 lg:top-6",
            )}
          >
            <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
          </DialogClose>

          {/* Art panel — left ~1/3 desktop (38%, matching the manifest's own
              `38vw` sizes attribute exactly), a fixed-height top band on
              mobile rather than hidden. `shrink-0` stops flexbox from
              compressing it below its intended size on a short viewport;
              overflow-hidden clips whatever the fill-cover crop or the
              interim KanjiAccent bleeds past the edge. */}
          <div className="relative h-40 w-full shrink-0 overflow-hidden sm:h-56 lg:h-auto lg:w-[38%]">
            {menuArt ? (
              <PhotoFrame
                src={menuArt.src}
                alt={menuArt.alt}
                width={menuArt.width}
                height={menuArt.height}
                sizes={menuArt.sizes}
                className="h-full w-full"
                imageClassName="h-full w-full object-cover"
                tapReveal={false}
              />
            ) : (
              // Designed interim — never an empty box. `star-grain` +
              // `<KanjiAccent>` is the same documented interim pattern
              // MethodSection.tsx already ships for its own dark-ground art
              // slot (matched here for a consistent sitewide "no art yet"
              // language, not invented fresh).
              <div className="surface-black star-grain flex h-full w-full items-center justify-center overflow-hidden">
                <KanjiAccent placement="left" />
                <span className="visually-hidden">
                  Decorative background 北天 kanji motif — no informational content. Artwork for
                  this panel has not been supplied yet.
                </span>
              </div>
            )}
          </div>

          {/* Index + utilities panel. `.surface-dark` is explicit here (not
              just inherited from the DialogContent root) so the theme's
              indigo/near-black reads correctly regardless of what the art
              panel renders beside it. */}
          <div className="surface-dark relative flex flex-1 flex-col justify-between px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-16">
            {/* One <KanjiAccent> per surface (D5): only rendered here when
                the art panel is showing a REAL photo (and therefore carries
                no accent of its own) — see file header. Rendered first, so
                it paints behind the index by DOM order alone. */}
            {menuArt ? <KanjiAccent placement="right" /> : null}

            <nav aria-label="Site menu" className="relative flex flex-1 items-center py-6">
              <ol className="flex w-full flex-col gap-1 sm:gap-2">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <DialogClose asChild>
                      <a
                        href={item.href}
                        onClick={handleItemClick}
                        className="group flex min-h-14 items-baseline gap-5 py-3 sm:gap-8 sm:py-4"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "w-8 shrink-0 font-mono text-data tabular text-fg-meta sm:w-12",
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

            <div className="relative mt-10 flex flex-col gap-6 hairline-t pt-8 sm:flex-row sm:items-center sm:justify-between">
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
