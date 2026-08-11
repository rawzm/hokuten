/**
 * content/menuArt.ts — the menu overlay's art-panel typed manifest.
 *
 * PARKED (D22/D26, Razim, 2026-08-10, docs/DESIGN-REVISIT-3.md D26): "instead
 * [of the Holiday Inn photo] have the brand logo in the middle big enough the
 * content inside the logo is visible." `components/nav/MenuOverlay.tsx` no
 * longer renders anything from this file — its former photo panel is now a
 * centred theme-lockup brand panel (`themePresentation.lockupXl`, see that
 * file's own header). NOTHING in this module is imported anywhere as of this
 * date. It stays in the repo on purpose, unchanged and un-deleted, alongside
 * `site/scripts/menu-prep.ts` and the generated `site/public/menu/` assets
 * (also untouched) — restoring a photo panel later is a one-component swap:
 * point `MenuOverlay.tsx`'s brand-panel block at `getMenuArt`/
 * `getMenuArtSources` below instead of the lockup `<Image>`, nothing here
 * needs to change to support that. Every export below is preserved exactly
 * (no signature changes) so that swap stays trivial whenever Razim wants it.
 *
 * SOURCE OF RECORD (pre-D26 history, still accurate for what's below): docs/
 * DESIGN-REVISIT-2.md §4.2 (crop spec) + D17 (full-bleed menu — full-color
 * real hotel photo OR approved glyph artwork permitted; never stock, never a
 * grayscale/veil filter) + D21 (Ref/ is never a runtime source).
 *
 * GENERATION CONTRACT (site/scripts/menu-prep.ts, run 2026-08-10):
 *   site/public/menu/menu-<breakpoint>-<width>.avif   — every surviving width
 *   site/public/menu/menu-<breakpoint>-<width>.webp   — every surviving width
 *   site/public/menu/menu-<breakpoint>-<width>.jpg    — LARGEST surviving width only
 *   site/public/menu/_manifest.json                   — every generated file's
 *                                                        real bytes/dimensions
 *   site/public/menu/_contact-sheet.jpg                — both breakpoints, labelled
 *
 * Every `widths`/`width`/`height` value below is cross-checked against a real
 * `site/public/menu/_manifest.json` produced by that script run.
 *
 * ── Source: a real approved hotel photograph, not glyph artwork ────────────
 * D17 (2026-08-10) permits a real hotel photograph here for the first time.
 * `site/public/hotels/` holds six real, already-shipped closing photographs.
 * `hie-brooklyn.jpg` (Holiday Inn Express Brooklyn, the closing named in
 * `content/closings.ts`) is the only one usable at this file's own two
 * targets — verified by checking every candidate's real resolution, not
 * assumed from filenames:
 *
 *     file                     size        3:4 ceiling   12:5 ceiling
 *     hie-brooklyn.jpg         3840x2560   1920px        3840px   <- used
 *     carte-san-diego.jpg      1024x767     575px         767px
 *     last-hotel-st-louis.jpg  1024x710     532px         710px
 *     radisson-mcallen.jpg     1280x960     720px         960px
 *     renaissance-reno.jpg     1199x630     472px         630px
 *     rohnert-park.jpg          968x607     455px         607px
 *
 * Every candidate except hie-brooklyn.jpg sits BELOW the §4.2 desktop MINIMUM
 * (1200px) on its 3:4 ceiling — this was a resolution cut, not a taste call.
 * hie-brooklyn.jpg is also the only file large enough to clear the §4.2 IDEAL
 * canvas at both breakpoints outright (1920px >= 1800px ideal desktop width;
 * 3840px >> 2400px ideal mobile width) — the only zero-shortfall asset in
 * either of this round's two prep pipelines (compare `content/heroSlides.ts`,
 * where every interim slide falls short somewhere).
 *
 * Composition, verified against the full-resolution file, not a thumbnail: a
 * tall street elevation, the green Holiday Inn Express sign + canopy roughly
 * centered over full-height glass, doors centered beneath. A plain centre
 * crop keeps the branded entrance in frame at both ratios — see
 * `menu-prep.ts`'s header for the exact vertical/horizontal reasoning,
 * including why the mobile band's centre crop happens to start almost exactly
 * at the sign's top edge rather than clipping it.
 *
 * ── Alt-text law ─────────────────────────────────────────────────────────────
 * `alt` names the depicted hotel — same wording already established in
 * `content/closings.ts` for this same photograph, not retyped independently.
 *
 * ── Full color, no veil ──────────────────────────────────────────────────────
 * Nothing in this pipeline desaturates or darkens the source (D17: "no
 * grayscale filter... never a dark veil"). Any gradient a consuming component
 * adds for control contrast is a CSS overlay at render time, not baked in here.
 */

export type MenuArtBreakpoint = "desktop" | "mobile";
export type MenuArtSourceKind = "ref-menu" | "interim-hotel-photo";

export type MenuArtDerivative = {
  /** Real generated widths, ascending — srcset-ready as-is. */
  widths: number[];
  /** Largest generated width's real intrinsic dimensions (matches the
   *  breakpoint's display ratio exactly — 3:4 desktop / 12:5 mobile). */
  width: number;
  height: number;
  source: MenuArtSourceKind;
  belowSpecMinimum: boolean;
  belowSpecIdeal: boolean;
};

export type MenuArt = {
  /** Names the depicted hotel, per content/closings.ts. */
  alt: string;
  /** True until a real Ref/menu/menu.<breakpoint>.<ext> file replaces this
   *  breakpoint's interim hotel-photo crop. Both breakpoints today. */
  isInterim: boolean;
  note: string;
  breakpoints: Record<MenuArtBreakpoint, MenuArtDerivative>;
};

export const MENU_ART: MenuArt = {
  alt: "The Holiday Inn Express Brooklyn entrance canopy and lobby in Sunset Park, its lit green sign and glass doors facing the street.",
  isInterim: true,
  note:
    "Interim crop from the real, approved closing photograph public/hotels/hie-brooklyn.jpg (Holiday Inn Express Brooklyn, 3840x2560 native) — D17 permits a real hotel photograph here. Both breakpoints clear the §4.2 IDEAL canvas outright (no shortfall). Awaiting a real Ref/menu/menu.desktop + menu.mobile drop only if Razim wants a different/dedicated photograph; this one already meets spec.",
  breakpoints: {
    desktop: {
      widths: [600, 900, 1200, 1800],
      width: 1800,
      height: 2400,
      source: "interim-hotel-photo",
      belowSpecMinimum: false,
      belowSpecIdeal: false,
    },
    mobile: {
      widths: [800, 1200, 1600, 2400],
      width: 2400,
      height: 1000,
      source: "interim-hotel-photo",
      belowSpecMinimum: false,
      belowSpecIdeal: false,
    },
  },
};

/* ---------------------------------------------------------------------------
   Resolver — what a component should actually import.
   --------------------------------------------------------------------------- */

const MENU_DIR = "/menu";

function menuFileStem(breakpoint: MenuArtBreakpoint, width: number): string {
  return `menu-${breakpoint}-${width}`;
}

/** Props shape a component spreads onto `next/image`'s intrinsic mode
 *  (`src`/`alt`/`width`/`height`) for one breakpoint's panel/band. */
export type ResolvedMenuArt = {
  src: string;
  width: number;
  height: number;
  sizes: string;
  alt: string;
};

const MENU_SIZES: Record<MenuArtBreakpoint, string> = {
  // D17 §6.2: desktop art panel is roughly 40% of the overlay width.
  desktop: "(min-width: 1024px) 40vw, 0px",
  // Mobile renders the wide art band at full bleed.
  mobile: "100vw",
};

export function getMenuArt(breakpoint: MenuArtBreakpoint): ResolvedMenuArt {
  const d = MENU_ART.breakpoints[breakpoint];
  return {
    src: `${MENU_DIR}/${menuFileStem(breakpoint, d.width)}.jpg`,
    width: d.width,
    height: d.height,
    sizes: MENU_SIZES[breakpoint],
    alt: MENU_ART.alt,
  };
}

export type MenuArtSources = {
  /** `srcset`-ready string: `"/menu/menu-desktop-600.avif 600w, … 1800w"`. */
  avif: string;
  webp: string;
};

export function getMenuArtSources(breakpoint: MenuArtBreakpoint): MenuArtSources {
  const d = MENU_ART.breakpoints[breakpoint];
  const build = (ext: "avif" | "webp") => d.widths.map((w) => `${MENU_DIR}/${menuFileStem(breakpoint, w)}.${ext} ${w}w`).join(", ");
  return { avif: build("avif"), webp: build("webp") };
}

/** True while any breakpoint still uses the interim hotel-photo fallback
 *  rather than a real Ref/menu/menu.<breakpoint>.<ext> drop. */
export function isMenuArtInterim(): boolean {
  return MENU_ART.isInterim;
}
