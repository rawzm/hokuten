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
    /** Hero chassis component key — dark cover panel with gold/ivory ASCII */
    heroChassis: "cover-panel",
    /** Which pre-generated ASCII palette set the hero loads */
    artPalette: "gold",
    /** Surface class for the hero section */
    heroSurface: "surface-black",
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
    /** Coronal plate chassis — cool-white plate, hairline frame, reg marks */
    heroChassis: "plate",
    artPalette: "blue",
    heroSurface: "surface-paper",
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
