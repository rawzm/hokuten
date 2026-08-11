# Menu overlay art — drop crops here

DESIGN-REVISIT-2.md §4.2. Two files:

    menu.desktop.jpg
    menu.mobile.jpg

| Crop            | Ideal canvas | Minimum  | Display ratio | Composition |
|-----------------|--------------|----------|---------------|-------------|
| desktop portrait| 1800x2400    | 1200x1600| 3:4           | Full-colour subject centred. Keep essential detail out of the top-left 112x112px close-control zone. |
| mobile band     | 2400x1000    | 1600x667 | 12:5          | Recompose as a wide band. Keep the subject clear of the logo and close safe zones. |

Real approved hotel photography or approved Hokuten glyph artwork only — never
stock, never a grayscale treatment. Then run `npx tsx scripts/menu-prep.ts`
from `site/`. Production reads only `site/public/menu/`.
