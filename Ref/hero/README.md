# Hero slide masters — drop crops here

DESIGN-REVISIT-2.md §4.1. One numbered TRIPLET per slide, exactly this naming:

    01-descriptive-name.desktop.jpg
    01-descriptive-name.tablet.jpg
    01-descriptive-name.mobile.jpg

PNG or TIFF masters are fine — keep the same suffix convention.
Do NOT bake type, logos, buttons or gradients into the crop.

| Crop    | Ideal canvas | Minimum  | Display ratio | Composition |
|---------|--------------|----------|---------------|-------------|
| desktop | 3200x800     | 2400x600 | 4:1           | Key subject inside the centre 70% width / 80% height. No essential signage or face in the outer 15%. |
| tablet  | 2048x896     | 1600x700 | 16:7          | RECOMPOSE — do not just centre-crop the desktop file. Protect the vertical subject and skyline. |
| mobile  | 1600x1200    | 1200x900 | 4:3           | Key subject inside the centre 60% width. Assume UI controls occupy a lower corner. |

Then run `npx tsx scripts/hero-prep.ts` from `site/`. The script prefers a complete
triplet and falls back to interim artwork per breakpoint, warning about anything
below spec. Nothing here is ever read at runtime — production reads only
`site/public/hero/`.
