"use client";

/**
 * components/nav/MenuOverlay.tsx — the full-screen numbered menu overlay
 * (mobile hamburger + desktop overflow trigger, ref 04 "Nav").
 * Spec of record: docs/design/specs/nav.md. Governed by hokuten-design-
 * director ref 04 ("Nav" → Menu), ref 03 (surfaces, imagery), ref 07 (P0:
 * focus trap, Esc, body scroll lock, 44px close target).
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
 * close — correct for Esc / outside-click / the built-in X, WRONG when the
 * close was caused by clicking a destination link, where focus should land
 * on the target section's heading instead (the same P0 rule SiteNav.tsx
 * implements for its own links). `pendingFocusRef` is set only inside the
 * menu-item click handler, so a custom `onCloseAutoFocus` on `DialogContent`
 * can tell the two cases apart: if a navigation is pending, it
 * `preventDefault()`s Radix's restore and moves focus itself; otherwise
 * Radix's default (focus-to-trigger) runs untouched. This is a prop supplied
 * BY a consumer, not an edit to ui/dialog.tsx itself — that file's own "never
 * override onCloseAutoFocus in this file" rule is scoped to the primitive,
 * not its callers.
 *
 * ── `focusAnchorTarget` / `handleItemClick` are duplicated from SiteNav.tsx ──
 * Not extracted to a shared helper: this agent's remit is exactly
 * SiteNav.tsx, this file, and the spec — a new file under lib/ is out of
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
 * full-viewport panel).
 */

import { useRef, type MouseEvent } from "react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import PhotoFrame from "@/components/atoms/PhotoFrame";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { closings } from "@/content/closings";
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

/**
 * The warm hotel photo panel. Reuses an already-`verified-current` photo +
 * alt string from the track record rather than inventing new copy (content
 * law) — any of the six closings photos would satisfy the brief equally;
 * this one was picked for a warm dusk tone that reads well behind dark
 * chrome. Falls back to the first closing if the name ever changes upstream,
 * so a content edit degrades instead of throwing.
 */
const OVERLAY_PHOTO =
  closings.find((closing) => closing.name === "Renaissance Reno Downtown") ?? closings[0];

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
        positionerClassName="p-0"
        className="surface-dark h-full max-h-[100dvh] w-full max-w-none overflow-y-auto rounded-none p-0"
        closeLabel="Close menu"
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

        <div className="container-hk flex min-h-full flex-col py-16 lg:flex-row lg:items-stretch lg:gap-16 lg:py-20">
          {/* Warm hotel photo panel — collapses away below `lg` (ref 04). */}
          <div className="hidden shrink-0 lg:block lg:w-[38%]">
            <PhotoFrame
              src={OVERLAY_PHOTO.photo}
              alt={OVERLAY_PHOTO.photoAlt}
              aspect="3/4"
              sizes="(min-width: 1024px) 38vw, 0px"
              className="h-full"
              tapReveal={false}
            />
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <nav aria-label="Site menu">
              <ol className="flex flex-col">
                {menuItems.map((item) => (
                  <li key={item.href} className="hairline-b">
                    <DialogClose asChild>
                      <a
                        href={item.href}
                        onClick={handleItemClick}
                        className="group flex min-h-16 items-baseline gap-6 py-4 transition-colors duration-fast ease-out"
                      >
                        <span
                          aria-hidden="true"
                          className="w-8 font-display text-body tabular text-fg-meta"
                        >
                          {item.index}
                        </span>
                        <span className="font-display text-heading font-light text-fg transition-colors duration-fast ease-out group-hover:text-accent-text md:text-display2">
                          {item.label}
                        </span>
                      </a>
                    </DialogClose>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-12 flex flex-col gap-6 hairline-t pt-8 sm:flex-row sm:items-center sm:justify-between">
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
