/**
 * Dual-theme resolution (PROJECT-MEMORY decision 2026-08-07).
 *
 * Theme G "Kit Gold"     → production / `main`      (default)
 * Theme B "Hokuten Blue" → branch `theme-blue`      (branch-scoped env var)
 *
 * `theme-blue` carries ZERO code diff from `main`. The only difference is the
 * branch-scoped Vercel env var NEXT_PUBLIC_HOKUTEN_THEME=blue.
 *
 * The value is inlined at build time, so it is safe to read at module scope in
 * both server and client components.
 */

export const THEMES = ["gold", "blue"] as const;
export type HokutenTheme = (typeof THEMES)[number];

export const DEFAULT_THEME: HokutenTheme = "gold";

function isTheme(value: string | undefined): value is HokutenTheme {
  return value === "gold" || value === "blue";
}

/** The active theme for this build. */
export function resolveTheme(): HokutenTheme {
  const raw = process.env.NEXT_PUBLIC_HOKUTEN_THEME?.trim().toLowerCase();
  return isTheme(raw) ? raw : DEFAULT_THEME;
}

export const THEME: HokutenTheme = resolveTheme();
export const IS_BLUE = THEME === "blue";
export const IS_GOLD = THEME === "gold";

/**
 * Per-theme asset + chassis selection. Components pick behaviour from this
 * record rather than branching on the theme string inline — one presentation
 * record per theme (SPR pattern), so adding a theme touches one place.
 */
export const THEME_PRESENTATION = {
  gold: {
    label: "Kit Gold",
    /**
     * @deprecated D5/D6 (Razim, 2026-08-08). Both themes now share ONE hero
     * chassis: a full-bleed supplied 「北天」 glyph-mosaic art band with the
     * headline row below it. The art carries its own colours in both themes;
     * the theme governs only the chrome around it. Kept so nothing that still
     * reads the record breaks mid-round — do not branch on it in new code.
     */
    heroChassis: "cover-panel",
    /** @deprecated with the ASCII canvas — the hero art is a static image now. */
    artPalette: "gold",
    /** Surface the hero's copy rows sit on (the art band is edge-to-edge). */
    heroSurface: "surface-black",

    /**
     * D1 (Razim, 2026-08-08): the theme-matched KW COMMERCIAL / THE HOKUTEN
     * GROUP lockup replaces the text wordmark top-left. Prepared from the
     * masters in Ref/site/ — production-approved by Razim's explicit exception
     * to the "Ref/ never imports to production" rule.
     *
     * Render it with alt="" (decorative) and put a REAL-TEXT brand line beside
     * it. The name must exist as text somewhere: a brand name that lives only
     * inside a raster is the Sarhan anti-pattern and fails the audit — and at a
     * 44px render height the words baked into the lockup are not legible anyway.
     */
    lockup: "/brand/lockup-gold.png",

    /**
     * D26 (Razim, 2026-08-10): the menu overlay shows the lockup CENTRED and
     * LARGE — "big enough the content inside the logo is visible" — and Trust
     * uses it as an editorial identity anchor. `lockup` above is prepared for a
     * 44px nav render (132px tall) and visibly softens past ~150px, so those
     * two placements read this ~640px derivative instead. Same master, same
     * trim; only the output size differs.
     */
    lockupXl: "/brand/lockup-gold-xl.png",

    /** D5: which artwork.ts placement the hero band resolves. */
    heroArtPlacement: "hero.gold",

    /** Theme-specific brand assets under /public/brand/ */
    wordmark: "/brand/hokuten-wordmark-gold.svg",
    hanko: "/brand/hanko-gold.svg",
    hankoMonochromeOnDark: "/brand/hanko-gold.svg",
    favicon: "/brand/favicon-gold.svg",
    ogImage: "/og/og-gold.png",
    /** Coronal registration marks are Theme B light chrome only */
    plateChrome: false,
    themeColor: "#16181B",
  },
  blue: {
    label: "Hokuten Blue",
    /** @deprecated — see the gold entry. One shared hero chassis since D5/D6. */
    heroChassis: "plate",
    /** @deprecated with the ASCII canvas. */
    artPalette: "blue",
    heroSurface: "surface-paper",
    lockup: "/brand/lockup-blue.png",
    /** @see the gold entry — the large derivative for the menu panel and Trust. */
    lockupXl: "/brand/lockup-blue-xl.png",
    heroArtPlacement: "hero.blue",
    wordmark: "/brand/hokuten-wordmark-blue.svg",
    hanko: "/brand/hanko-blue.svg",
    hankoMonochromeOnDark: "/brand/hanko-blue-on-dark.svg",
    favicon: "/brand/favicon-blue.svg",
    ogImage: "/og/og-blue.png",
    plateChrome: true,
    themeColor: "#F7F8F5",
  },
} as const satisfies Record<HokutenTheme, Record<string, unknown>>;

export const themePresentation = THEME_PRESENTATION[THEME];
