"use client";

/**
 * components/nav/AnchorLink.tsx — the shared in-page anchor + focus-move
 * handler (DESIGN-REVISIT.md §4.1: "route the hero CTAs through the shared
 * anchor-focus handler ... nav already moves focus, hero doesn't").
 *
 * ── What I found in SiteNav.tsx (read first, per the task brief) ─────────
 * SiteNav.tsx already implements the focus-move half of this job as
 * `focusAnchorTarget()` (module-scope, ~18 lines): look up `#{id}-heading`,
 * fall back to `#{id}`, give it a temporary `tabindex="-1"` if it doesn't
 * already have one, `.focus({ preventScroll: true })`, and strip the
 * temporary tabindex on blur. That function is lifted VERBATIM below — same
 * lookup order, same temporary-tabindex cleanup, same `preventScroll: true`.
 * `MenuOverlay.tsx` carries a SECOND, byte-identical copy (its own header
 * comment says so explicitly: "duplicated from SiteNav.tsx ... a new file
 * under lib/ is out of scope"). This file is that shared home. SiteNav.tsx
 * currently does NOT preventDefault — it lets the browser's native hash
 * navigation own the scroll (which already gets reduced motion correctly for
 * free, from globals.css's `@media (prefers-reduced-motion: reduce) { html {
 * scroll-behavior: auto; } }`) and only layers the focus-move on top via a
 * plain onClick.
 *
 * `AnchorLink` below is a superset of that: it still degrades to that exact
 * native behaviour with JS off (real `<a href="#id">`, nothing else), but
 * WITH JS it takes over the scroll itself so the same reduced-motion signal
 * that already gates every other animated thing on this site
 * (`motionAllowed()` + `useReducedMotion()`, `lib/motion.ts`) also gates this
 * scroll explicitly, rather than relying only on the separate CSS media
 * query. This was an explicit requirement of this task ("respect
 * prefers-reduced-motion ... use motionAllowed()/useReducedMotion() rather
 * than adding a third mechanism"), so the click behaviour is intentionally
 * NOT byte-identical to SiteNav's own onClick — only `focusAnchorTarget()`
 * itself is lifted verbatim, as instructed. `history.pushState` after a
 * successful JS-driven scroll keeps the URL fragment in sync with what
 * native hash navigation would have done (deep-linking / back-button
 * parity), without re-triggering a second jump the way setting
 * `location.hash` directly would.
 *
 * ── Should SiteNav.tsx (and MenuOverlay.tsx) import this now? Yes. ────────
 * I did not make that edit — SiteNav.tsx is explicitly owned by the nav agent
 * in the next workflow ("DO NOT edit SiteNav"), and MenuOverlay.tsx is not in
 * this assignment either. Both currently hold their own copy of
 * `focusAnchorTarget` (SiteNav's is also re-exported at its file's bottom "so
 * a caller can reuse the exact focus-management contract"). Once this file
 * ships, both call sites can replace their local copy with
 * `import { focusAnchorTarget } from "@/components/nav/AnchorLink"` and
 * delete the duplicate; whether SiteNav's own nav `<a>` elements move to
 * `<AnchorLink>` too (they already work without it) is the nav agent's call.
 *
 * ── Why "use client" ───────────────────────────────────────────────────
 * `useReducedMotion()` and the click handler both need the DOM. The
 * server-rendered HTML is still a plain, fully-functional `<a href="#id">`
 * (React hydrates an onClick onto existing markup, it does not rewrite it),
 * so this degrades correctly with JS disabled or not-yet-hydrated. This file
 * itself imports nothing but a hook and a tiny pure helper — no `cn()` /
 * tailwind-merge pulled in here, since this sits on the hero's critical path
 * (D7) and every caller already fully controls `className` via plain
 * pass-through, with no default classes of this component's own to merge
 * against.
 */

import { forwardRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

import { motionAllowed } from "@/lib/motion";

export type AnchorLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children"> & {
  /** In-page target. Enforced at the type level: this component is for
   *  same-page anchors only, never an external link or a route href. */
  href: `#${string}`;
  children: ReactNode;
};

/**
 * Lifted verbatim from `components/sections/SiteNav.tsx`'s `focusAnchorTarget`
 * — see this file's header for what "verbatim" means here. Exported so
 * SiteNav.tsx / MenuOverlay.tsx can drop their own copies in favour of this
 * one whenever their owning agents choose to.
 */
export function focusAnchorTarget(hash: string): void {
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
 * The hero-CTA / any-in-page-link primitive. Renders one real `<a>` — no
 * wrapping element, so it composes cleanly wherever a plain anchor is
 * expected (including as `Button`'s `asChild` target, since the ref forwards
 * to the underlying DOM node).
 */
export const AnchorLink = forwardRef<HTMLAnchorElement, AnchorLinkProps>(function AnchorLink(
  { href, children, onClick, ...rest },
  ref,
) {
  const prefersReduced = useReducedMotion();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const id = href.slice(1);
    const target = document.getElementById(id);
    // No matching element (e.g. an interim placeholder section not yet
    // built): fall through to native hash navigation rather than doing
    // nothing silently.
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: motionAllowed(prefersReduced) ? "smooth" : "auto",
      block: "start",
    });
    focusAnchorTarget(href);

    if (window.location.hash !== href) {
      window.history.pushState(null, "", href);
    }
  }

  return (
    <a ref={ref} href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
});
