/**
 * TickerBar — the persistent bottom rate bar (ref 04 section 13, "Footer +
 * persistent `#ticker` (fixed bottom)"; ref 04 mobile rules, "ticker remains but
 * thinner (32px)"). Ported from index.html:1253-1263 + :294-311 via
 * docs/port/05-forms-and-ticker.md §D.2/§D.4.
 *
 * Server Component. It owns geometry, surface and print behaviour; the rail and
 * the one fetch live in `TickerClient`.
 *
 * ─── WHERE THIS MOUNTS ──────────────────────────────────────────────────────
 * Last element inside `<body>` in `app/layout.tsx` — after the footer, OUTSIDE
 * `app/template.tsx`. Not negotiable, and the reason is written down in
 * template.tsx's own header: while a route transition runs, the template holds a
 * transform, and a transformed ancestor becomes the containing block for every
 * `position: fixed` descendant. Mounted inside it, this bar would detach from
 * the viewport for 300ms on each navigation.
 *
 * ─── HEIGHT IS RESERVED, NOT ASSUMED ────────────────────────────────────────
 * A fixed element occupies no space, so something has to hold the clearance the
 * source held with `body { padding-bottom: 40px }` (index.html:73). This
 * component ships that clearance itself, as a flow spacer built from the SAME
 * class string as the bar — so the two cannot drift, and nothing else needs to
 * know the token. DO NOT ALSO add a bottom padding to `body` or `<main>`; that
 * would double the gap.
 *
 * `box-content` is doing real work: it makes `--ticker-h` the CONTENT box, so
 * the iOS safe-area padding stacks below the bar rather than eating into it.
 * `app/layout.tsx` sets `viewportFit: "cover"`, so without that padding the
 * rates would sit under the home indicator on a notched iPhone.
 *
 * Both heights are static tokens, known at first paint, identical on server and
 * client: the CLS contribution is exactly 0 (ref 05 gate: CLS < 0.02).
 *
 * ─── SURFACE ────────────────────────────────────────────────────────────────
 * `.surface-dark` rebinds `--fg-meta` / `--accent-text` for a dark ground, so
 * the labels and rates inside are correct in Theme G and Theme B without either
 * naming a colour. `shadow-bar` is the token minted for exactly this element
 * (ref 03: shadows only on floating chrome — menu overlay, modal, sticky
 * ticker); it carries its own top hairline, which is why there is no border
 * here to throw the height maths off.
 */

import { TickerClient } from "@/components/ticker/TickerClient";
import { cn } from "@/lib/utils";

/**
 * The one geometry string, used twice. 32px on mobile / 44px from `sm`, exactly
 * `--ticker-h-mobile` and `--ticker-h` in globals.css, plus the safe-area inset.
 */
const BAR_BOX =
  "box-content h-[var(--ticker-h-mobile)] pb-[env(safe-area-inset-bottom)] sm:h-[var(--ticker-h)]";

export function TickerBar() {
  return (
    <>
      {/* Flow spacer: the bar's clearance. Empty by design. */}
      <div aria-hidden="true" data-print-hide className={BAR_BOX} />

      {/* `ticker-bar` is not styling — globals.css's @media print block hides
          the bar by that class name. Keep it. */}
      <div
        id="ticker"
        className={cn(
          "ticker-bar surface-dark fixed inset-x-0 bottom-0 z-40",
          // Centres the rail in the content box; the safe-area padding sits
          // below it, filled with the bar's own surface.
          "flex items-center overflow-hidden",
          "shadow-bar",
          BAR_BOX,
        )}
      >
        <TickerClient />
      </div>
    </>
  );
}
