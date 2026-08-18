/**
 * og-gen — brand lockup + Open Graph card generator (build-time, never shipped).
 *
 *   run from site/:  npx tsx scripts/og-gen.ts
 *
 * Emits, for BOTH themes, from ONE typesetting pass so the two can never drift:
 *   public/brand/hokuten-wordmark-gold.svg   public/brand/hokuten-wordmark-blue.svg
 *   public/og/og-gold.png                    public/og/og-blue.png   (1200x630)
 *
 * ── Why a glyph table lives in this file ────────────────────────────────────
 * An <text> SVG is not a lockup: it re-renders against whatever font the viewer
 * (or librsvg, or a social crawler) happens to have, and sharp/librsvg has
 * neither Inter nor Cormorant Garamond. So all lettering here is REAL OUTLINES.
 *
 * GLYPHS below is Inter, wght 500 instance, uppercase + space, converted to SVG
 * paths at 1000 upem with the baseline at y=0 and y pointing DOWN (SVG space).
 * Extracted with fontTools from the Inter latin subset next/font already
 * self-hosts for this app. Inter is SIL OFL 1.1 — outline conversion and
 * embedding are expressly permitted.
 *
 * Inter (not Liberation Sans / Arial) because the tracked-caps brand line is
 * set in `--font-sans` everywhere it appears as live text — the `brand-line`
 * utility in globals.css is Inter at weight 500, tracking 0.35em. Outlining
 * Inter makes <Wordmark variant="lockup" /> and <Wordmark variant="text" />
 * the same logotype. Outlining Arial would have made them two. Inter is the
 * same Helvetica-lineage grotesk the kit's Liberation Sans lockup evokes, and
 * ref 01 sanctions it by name: "Inter or Arial-stack, uppercase, 0.35em".
 *
 * The KW Commercial kit rasters are NOT touched by this script. Nothing here
 * recolours a kit asset; these are new vector builds of the HOKUTEN line only.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/* ===========================================================================
   1. Font data — Inter wght 500, 1000 upem, baseline y=0, y DOWN.
   `bb` is the ink bounding box [x0, y0, x1, y1] in the same (y-down) space.
   =========================================================================== */

interface Glyph {
  /** Advance width, font units */
  adv: number;
  /** Outline, absolute SVG path commands (M L H V Q Z) */
  d: string;
  /** Ink bbox [x0, y0, x1, y1], y-down; null for space */
  bb: [number, number, number, number] | null;
}

/** Cap height of the Inter 500 instance, font units. */
const CAP = 727.5;

const GLYPHS: Record<string, Glyph> = {
  "A": { adv: 709, bb: [24.9, -727.5, 684, 0], d: "M24.9 0 283.9 -727.5H420.5L684 0H563.6L421.9 -404.7Q405.4 -454.1 385.7 -520.9Q365.9 -587.8 340 -681.4H362.5Q337.2 -587 317.6 -519.3Q298 -451.7 282.9 -404.7L145.5 0ZM165.2 -191.7V-284.7H543.6V-191.7Z" },
  "B": { adv: 656.7, bb: [80.5, -727.5, 606.1, 0], d: "M80.5 0V-727.5H348.7Q426.1 -727.5 476.9 -702.1Q527.8 -676.6 552.8 -633.4Q577.8 -590.3 577.8 -536.7Q577.8 -491 561 -460Q544.2 -429 516.3 -410.2Q488.4 -391.4 454.8 -382.7V-375.7Q491.2 -373.8 526 -352.3Q560.7 -330.8 583.4 -291.5Q606.1 -252.1 606.1 -196Q606.1 -140.5 579.9 -96Q553.8 -51.6 499.5 -25.8Q445.1 0 360.4 0ZM192.1 -95.6H348.9Q427.5 -95.6 461.4 -125.8Q495.4 -156.1 495.4 -201.4Q495.4 -236.1 478.1 -264.5Q460.7 -293 429 -309.9Q397.3 -326.7 353.5 -326.7H192.1ZM192.1 -412.8H338Q374.7 -412.8 404.3 -426.8Q433.9 -440.9 451.1 -466.7Q468.3 -492.5 468.3 -527.4Q468.3 -572.2 437 -602.2Q405.6 -632.3 340.9 -632.3H192.1Z" },
  "C": { adv: 733.4, bb: [55, -737.3, 683, 9.8], d: "M382.8 9.8Q288.4 9.8 214.2 -35Q140.1 -79.8 97.5 -163.4Q55 -247.1 55 -363.3Q55 -480.1 97.7 -563.8Q140.3 -647.5 214.5 -692.4Q288.7 -737.3 382.8 -737.3Q440.2 -737.3 490.8 -720.8Q541.4 -704.3 581.2 -672.5Q621.1 -640.8 647.3 -595.3Q673.6 -549.9 682.8 -491.9H570.7Q563.8 -527 546.6 -553.6Q529.5 -580.3 504.5 -598.8Q479.4 -617.2 448.7 -626.6Q418 -635.9 383.8 -635.9Q321.3 -635.9 271.9 -604.3Q222.4 -572.7 194 -512Q165.6 -451.2 165.6 -363.3Q165.6 -275.3 194.3 -214.5Q223 -153.8 272.3 -122.7Q321.7 -91.6 383.6 -91.6Q417.8 -91.6 448.5 -101.2Q479.2 -110.7 504.3 -129Q529.4 -147.2 546.6 -174.1Q563.9 -200.9 570.9 -235.6H683Q674.8 -181.6 649.3 -136.9Q623.9 -92.1 584.5 -59.1Q545 -26.1 493.9 -8.2Q442.8 9.8 382.8 9.8Z" },
  "D": { adv: 721.7, bb: [80.5, -727.5, 666.9, 0], d: "M317.1 0H137.1V-97.5H310.9Q393.6 -97.5 448.3 -128.4Q503 -159.3 530.3 -219Q557.5 -278.8 557.5 -364.9Q557.5 -450.3 530.4 -509.4Q503.3 -568.5 450 -599.3Q396.6 -630 317.1 -630H133.4V-727.5H324.2Q431.7 -727.5 508.3 -684Q584.8 -640.5 625.8 -559.2Q666.9 -477.9 666.9 -364.9Q666.9 -251.2 625.7 -169.5Q584.5 -87.7 506.2 -43.9Q428 0 317.1 0ZM192.1 -727.5V0H80.5V-727.5Z" },
  "E": { adv: 603, bb: [80.5, -727.5, 541.7, 0], d: "M80.5 0V-727.5H538.5V-631.6H192.1V-414.9H513.9V-319.7H192.1V-95.9H541.7V0Z" },
  "F": { adv: 589.4, bb: [80.5, -727.5, 533.4, 0], d: "M80.5 0V-727.5H533.4V-631.6H192.1V-397.9H500.5V-302.7H192.1V0Z" },
  "G": { adv: 747.6, bb: [55, -737.3, 689.7, 9.8], d: "M386.2 9.8Q287.5 9.8 213 -35.6Q138.4 -81 96.7 -164.7Q55 -248.4 55 -363.1Q55 -479.6 97.3 -563.4Q139.6 -647.1 213.3 -692.2Q287.1 -737.3 381.2 -737.3Q440.1 -737.3 491.1 -720Q542.1 -702.7 582.3 -670.6Q622.5 -638.5 648.6 -594.5Q674.7 -550.4 683.8 -497.3H569.4Q559.4 -529.5 542.4 -554.9Q525.4 -580.4 501.7 -598.6Q478 -616.8 448.1 -626.4Q418.2 -635.9 382.3 -635.9Q321 -635.9 271.8 -604.6Q222.7 -573.3 194.2 -512.6Q165.6 -451.8 165.6 -363.6Q165.6 -276 194.2 -215.4Q222.8 -154.8 272.7 -123.2Q322.5 -91.6 386.6 -91.6Q445.1 -91.6 489 -115.4Q532.8 -139.2 556.9 -183Q581 -226.8 581 -286.3L610 -281.2H402.7V-373H689.7V-289.6Q689.7 -197.6 650.6 -130.5Q611.4 -63.3 543 -26.8Q474.6 9.8 386.2 9.8Z" },
  "H": { adv: 744.6, bb: [80.5, -727.5, 663.9, 0], d: "M80.5 0V-727.5H192.1V-419.9H552.3V-727.5H663.9V0H552.3V-324H192.1V0Z" },
  "I": { adv: 272.5, bb: [80.5, -727.5, 192.1, 0], d: "M192.1 -727.5V0H80.5V-727.5Z" },
  "J": { adv: 575.2, bb: [43.6, -727.5, 494.8, 9.8], d: "M269.7 9.8Q167.8 9.8 105.7 -47.8Q43.6 -105.3 43.6 -211.5V-251.7H155.1V-210.8Q155.1 -149.2 186.4 -116.9Q217.7 -84.7 269.7 -84.7Q321.3 -84.7 352.5 -116.9Q383.7 -149.2 383.7 -211V-727.5H494.8V-211.7Q494.8 -105.4 433.1 -47.8Q371.4 9.8 269.7 9.8Z" },
  "K": { adv: 687.5, bb: [80.5, -727.5, 660.7, 0], d: "M159.5 -193.5V-304.8Q183.6 -341.1 207.2 -373.4Q230.9 -405.7 256.7 -436.9Q282.5 -468.2 311.9 -501.3L516.1 -727.5H657.9L348.5 -387.1L341.1 -388.9ZM80.5 0V-727.5H192.1V-495.2L190.2 -329L192.1 -274.4V0ZM528.8 0 281.5 -356.1 351.2 -441.4 660.7 0Z" },
  "L": { adv: 565.4, bb: [80.5, -727.5, 521.3, 0], d: "M80.5 0V-727.5H192.1V-95.9H521.3V0Z" },
  "M": { adv: 912.6, bb: [80.5, -727.5, 832.3, 0], d: "M80.5 0V-727.5H244.7L403.4 -310.2Q410.1 -291.7 418.6 -263.2Q427.2 -234.7 436.5 -201.5Q445.8 -168.3 454.2 -136.1Q462.6 -103.9 468.6 -77.9H445.2Q451.7 -102.7 460.1 -134.5Q468.4 -166.3 477.7 -199.7Q487 -233.1 495.7 -262.2Q504.4 -291.3 511.1 -310.2L667.6 -727.5H832.3V0H721.6V-391.4Q721.6 -414.3 722 -445.3Q722.4 -476.4 723.3 -511.3Q724.1 -546.2 725 -582Q725.8 -617.7 726.2 -650.5H734.6Q724.6 -614.6 713.2 -576.9Q701.8 -539.3 690.6 -504.1Q679.5 -468.9 669.6 -439.7Q659.6 -410.5 652.6 -391.4L504.1 0H408.5L257.7 -391.4Q250.7 -410.1 241.1 -438.7Q231.5 -467.3 220.3 -502.1Q209.1 -536.9 197.4 -574.9Q185.8 -612.9 174.1 -650.5H183.8Q184.6 -620.5 185.4 -585.6Q186.3 -550.6 186.9 -515.1Q187.6 -479.6 188.2 -447.5Q188.8 -415.5 188.8 -391.4V0Z" },
  "N": { adv: 756.3, bb: [80.5, -727.5, 675.8, 0], d: "M80.5 0V-727.5H208.9L482.7 -294.5Q496.4 -273.1 513.5 -243.2Q530.6 -213.3 549.7 -176Q568.8 -138.7 587.5 -94.8H573.6Q569.6 -136.3 567.3 -177.1Q565 -217.9 564.1 -253.4Q563.2 -288.9 563.2 -313.6V-727.5H675.8V0H546.7L301.3 -387.3Q281.6 -419.1 262.9 -451.2Q244.1 -483.3 221.4 -525.5Q198.7 -567.6 165.8 -628.4H183.5Q186.2 -574.8 188.5 -528Q190.8 -481.2 192.1 -445.4Q193.5 -409.5 193.5 -388.1V0Z" },
  "O": { adv: 766.6, bb: [55, -737.3, 711.6, 9.8], d: "M383.7 9.8Q289.4 9.8 215.1 -35Q140.7 -79.8 97.9 -163.4Q55 -247.1 55 -363.3Q55 -480.1 97.9 -563.8Q140.7 -647.5 215.1 -692.4Q289.4 -737.3 383.7 -737.3Q478 -737.3 552.1 -692.4Q626.2 -647.5 668.9 -563.8Q711.6 -480.1 711.6 -363.3Q711.6 -247 668.9 -163.3Q626.2 -79.7 552.1 -35Q478 9.8 383.7 9.8ZM383.7 -91.6Q445.8 -91.6 494.9 -122.8Q543.9 -154 572.4 -214.8Q600.9 -275.5 600.9 -363.3Q600.9 -451.9 572.4 -512.7Q543.9 -573.5 494.9 -604.7Q445.8 -635.9 383.7 -635.9Q321.2 -635.9 272 -604.5Q222.7 -573.1 194.2 -512.3Q165.6 -451.5 165.6 -363.3Q165.6 -275.5 194.2 -215Q222.7 -154.4 272 -123Q321.2 -91.6 383.7 -91.6Z" },
  "P": { adv: 641.6, bb: [80.5, -727.5, 593.2, 0], d: "M80.5 0V-727.5H341.1Q425.4 -727.5 481.4 -696.4Q537.4 -665.2 565.3 -611.9Q593.2 -558.6 593.2 -491.3Q593.2 -424 565.2 -370.6Q537.1 -317.1 481 -285.9Q424.9 -254.7 340.3 -254.7H162V-349.1H329.5Q383.1 -349.1 416.4 -367.6Q449.7 -386 465.1 -418.3Q480.5 -450.6 480.5 -491.3Q480.5 -532.3 465.1 -564.1Q449.7 -595.9 416.2 -614.1Q382.7 -632.2 328.7 -632.2H192.1V0Z" },
  "Q": { adv: 768.6, bb: [55, -737.3, 711.6, 65.7], d: "M348.1 -235.1H455L531.5 -135.3L565.2 -92.9L686.5 65.7H575.7L495.2 -39.7L468 -77.2ZM383.7 9.8Q289.4 9.8 215.1 -35Q140.7 -79.8 97.9 -163.4Q55 -247.1 55 -363.3Q55 -480.1 97.9 -563.8Q140.7 -647.5 215.1 -692.4Q289.4 -737.3 383.7 -737.3Q478 -737.3 552.1 -692.4Q626.2 -647.5 668.9 -563.8Q711.6 -480.1 711.6 -363.3Q711.6 -247 668.9 -163.3Q626.2 -79.7 552.1 -35Q478 9.8 383.7 9.8ZM383.7 -91.6Q445.8 -91.6 494.9 -122.8Q543.9 -154 572.4 -214.8Q600.9 -275.5 600.9 -363.3Q600.9 -451.9 572.4 -512.7Q543.9 -573.5 494.9 -604.7Q445.8 -635.9 383.7 -635.9Q321.2 -635.9 272 -604.5Q222.7 -573.1 194.2 -512.3Q165.6 -451.5 165.6 -363.3Q165.6 -275.5 194.2 -215Q222.7 -154.4 272 -123Q321.2 -91.6 383.7 -91.6Z" },
  "R": { adv: 647.9, bb: [80.5, -727.5, 620.8, 0], d: "M80.5 0V-727.5H341.1Q425.4 -727.5 481.4 -698.4Q537.4 -669.3 565.3 -617.6Q593.2 -566 593.2 -498.9Q593.2 -431.6 565.2 -381.1Q537.1 -330.6 481 -302.6Q424.9 -274.7 340.3 -274.7H144.4V-369.9H329.5Q383.1 -369.9 416.2 -385.3Q449.3 -400.7 464.9 -429.6Q480.5 -458.4 480.5 -498.9Q480.5 -540.1 464.9 -569.9Q449.3 -599.6 416 -615.9Q382.7 -632.2 328.7 -632.2H192.1V0ZM494.1 0 317.9 -328.8H441.4L620.8 0Z" },
  "S": { adv: 646, bb: [51.5, -737.3, 594.5, 12], d: "M324.8 12Q243.2 12 183.1 -13.9Q122.9 -39.8 89.1 -87.7Q55.2 -135.7 51.5 -202.2H163.4Q166.9 -162.6 189.2 -136.6Q211.5 -110.7 247 -98Q282.5 -85.3 324.2 -85.3Q370.4 -85.3 406.5 -99.9Q442.6 -114.5 463.4 -141Q484.2 -167.5 484.2 -202.4Q484.2 -234.2 466.1 -254.5Q448 -274.8 416.8 -288.2Q385.7 -301.7 346.4 -312L261.1 -335.2Q171.7 -359.3 121.7 -406.3Q71.7 -453.2 71.7 -527.9Q71.7 -590.8 105.7 -638Q139.7 -685.2 198 -711.3Q256.4 -737.3 329.6 -737.3Q404.4 -737.3 461.2 -711.2Q518 -685 550.5 -639.6Q583 -594.1 584.7 -536H476.1Q470.5 -586.1 429.8 -613.5Q389.1 -640.9 327.2 -640.9Q283.3 -640.9 250.8 -627Q218.2 -613.1 200.5 -589Q182.9 -564.9 182.9 -533.9Q182.9 -499.6 204.1 -478.3Q225.3 -456.9 255.8 -444.6Q286.4 -432.3 314.2 -425L384.5 -406.3Q419.4 -397.6 456.2 -382.6Q493 -367.6 524.4 -343.9Q555.8 -320.3 575.1 -285.3Q594.5 -250.3 594.5 -201.2Q594.5 -139.5 562.7 -91.2Q530.9 -43 470.5 -15.5Q410.2 12 324.8 12Z" },
  "T": { adv: 652.8, bb: [44.2, -727.5, 608.7, 0], d: "M44.2 -631.6V-727.5H608.7V-631.6H382.6V0H271.1V-631.6Z" },
  "U": { adv: 740.2, bb: [80.5, -727.5, 659.6, 11.2], d: "M370.4 11.2Q283 11.2 217.7 -22.4Q152.3 -55.9 116.4 -114.9Q80.5 -173.9 80.5 -250.1V-727.5H192.1V-259.1Q192.1 -210.1 213.8 -172Q235.6 -133.8 275.5 -111.9Q315.4 -90 370.4 -90Q425.4 -90 465.1 -111.9Q504.9 -133.8 526.5 -172Q548 -210.1 548 -259.1V-727.5H659.6V-250.1Q659.6 -173.9 623.6 -114.9Q587.7 -55.9 522.7 -22.4Q457.7 11.2 370.4 11.2Z" },
  "V": { adv: 709, bb: [24.9, -727.5, 684, 0], d: "M288.2 0 24.9 -727.5H145.2L286.5 -322.8Q302.3 -275.8 322.6 -207.9Q342.9 -140 368.4 -47.9H345.7Q371 -142 390.9 -208.9Q410.8 -275.8 425.9 -322.8L563.4 -727.5H684L424.4 0Z" },
  "W": { adv: 1002.9, bb: [24.9, -727.5, 977.9, 0], d: "M222.1 0 24.9 -727.5H142.3L247.2 -310.8Q256.8 -272 265.2 -230.4Q273.6 -188.7 281.6 -146.4Q289.5 -104 296.7 -61.5H280.5Q288.3 -104 296.4 -146.4Q304.5 -188.7 313.5 -230.4Q322.5 -272 332.3 -310.8L440.4 -727.5H562.4L669.7 -310.8Q679.9 -272 688.7 -230.4Q697.5 -188.7 706 -146.4Q714.4 -104 722.3 -61.5H704.8Q712.4 -104 720.3 -146.4Q728.2 -188.7 737.1 -230.4Q745.9 -272 755 -310.8L859.7 -727.5H977.9L779.8 0H651.2L535.7 -431.3Q522.3 -482 511.1 -541.4Q499.9 -600.8 488.3 -672.5H513.6Q501.5 -604 491.5 -545.9Q481.4 -487.7 466.4 -431.3L351.2 0Z" },
  "X": { adv: 700.7, bb: [26.9, -727.5, 674, 0], d: "M26.9 0 316.7 -413.6V-330L45.4 -727.5H174.7L271.2 -584Q294.3 -549.7 309 -524.8Q323.7 -499.9 336 -476.4Q348.3 -453 363.5 -423H339.6Q355.1 -452.6 367.4 -476Q379.7 -499.5 394.9 -524.6Q410 -549.7 433.1 -584L531.4 -727.5H657.7L388.3 -335.3V-416.7L674 0H543.8L425.1 -173.8Q404.8 -204.3 391.2 -225.9Q377.6 -247.6 366.1 -268.5Q354.7 -289.4 340.2 -317.5H361.3Q347.3 -290.6 335.6 -269.6Q323.9 -248.7 310.1 -226.7Q296.3 -204.6 275 -173.8L154.7 0Z" },
  "Y": { adv: 696.3, bb: [24.9, -727.5, 671.2, 0], d: "M293.1 0V-289.8L24.9 -727.5H154.7L291.7 -495.4Q314.3 -457.6 331.7 -422.5Q349.1 -387.4 367.7 -335.4H332.1Q350.4 -388.2 367.9 -423.7Q385.3 -459.2 406.6 -495.4L542 -727.5H671.2L404.5 -289.8V0Z" },
  "Z": { adv: 640.6, bb: [58, -727.5, 582.7, 0], d: "M61 0V-73.3L376.2 -534.9Q399.9 -569.4 427.4 -604.1Q454.9 -638.8 482.6 -672.9L493.2 -636.6Q447 -633.2 400.4 -632.4Q353.7 -631.6 307.5 -631.6H58V-727.5H579.7V-653.4L269.5 -199.6Q244.4 -163.1 215.6 -126.7Q186.8 -90.3 158.1 -54.7L147.5 -90.9Q194.5 -94.4 241.3 -95.1Q288.1 -95.9 335 -95.9H582.7V0Z" },
  " ": { adv: 266.6, bb: null, d: "" },
  "\u00B7": { adv: 303.2, bb: [79.5, -417.3, 223.8, -273.5], d: "M151.7 -273.5Q121.5 -273.5 100.5 -294.5Q79.5 -315.4 79.5 -345.4Q79.5 -375.5 100.5 -396.4Q121.5 -417.3 151.7 -417.3Q181.8 -417.3 202.8 -396.4Q223.8 -375.5 223.8 -345.4Q223.8 -315.4 202.8 -294.5Q181.8 -273.5 151.7 -273.5Z" },
};

/* ===========================================================================
   2. Typesetter — tracked caps to a single outline path
   =========================================================================== */

/** Number of coordinate args each absolute path command consumes. */
const ARITY: Record<string, number> = { M: 2, L: 2, T: 2, Q: 4, S: 4, C: 6, H: 1, V: 1, Z: 0 };
/** Which arg slots inside one command group are X coordinates. */
const X_SLOTS: Record<string, number[]> = {
  M: [0],
  L: [0],
  T: [0],
  Q: [0, 2],
  S: [0, 2],
  C: [0, 2, 4],
  H: [0],
  V: [],
  Z: [],
};

const TOKEN = /([A-Za-z])|(-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)/g;

/** Round to 2dp and drop trailing zeros — keeps the shipped SVG small. */
function num(n: number): string {
  return Number(n.toFixed(2)).toString();
}

/**
 * Shift every X coordinate of an absolute path by `dx`.
 * Handles implicit command repetition (`L10 20 30 40`) and the implicit
 * lineto that follows an `M`. Throws on relative commands — the glyph table
 * is emitted absolute-only, so a lowercase command means corrupt data.
 */
function translatePathX(d: string, dx: number): string {
  const out: string[] = [];
  let cmd = "";
  let slot = 0;
  let buf: number[] = [];

  const flush = () => {
    if (!cmd || buf.length === 0) return;
    const xs = X_SLOTS[cmd];
    if (buf.length !== ARITY[cmd]) {
      throw new Error(`truncated "${cmd}" group: ${buf.length}/${ARITY[cmd]} args`);
    }
    for (const i of xs) buf[i] += dx;
    out.push(buf.map(num).join(" "));
    buf = [];
  };

  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(d)) !== null) {
    if (m[1] !== undefined) {
      const letter = m[1];
      if (letter !== letter.toUpperCase()) {
        throw new Error(`relative path command "${letter}" in glyph data`);
      }
      if (!(letter in ARITY)) throw new Error(`unsupported path command "${letter}"`);
      flush();
      cmd = letter;
      slot = 0;
      out.push(letter);
      if (ARITY[cmd] === 0) cmd = "";
    } else {
      if (!cmd) throw new Error("coordinate before any path command");
      buf.push(parseFloat(m[2]));
      slot += 1;
      if (slot === ARITY[cmd]) {
        flush();
        slot = 0;
        // an implicit repeat after M is a lineto
        if (cmd === "M") cmd = "L";
      }
    }
  }
  flush();
  return out.join(" ").replace(/([A-Z]) /g, "$1");
}

interface Line {
  /** Merged outline, font units, baseline y=0, pen origin x=0, y DOWN */
  d: string;
  /** Total pen advance including inter-letter tracking, minus the trailing gap */
  advance: number;
  /** Ink bounding box in the same space */
  ink: { x0: number; y0: number; x1: number; y1: number };
}

/**
 * Set `text` in tracked caps. `trackingEm` is the CSS letter-spacing value
 * (0.35 == 0.35em); the trailing gap CSS would leave after the last character
 * is dropped so the result is optically centred, not centre-minus-half-a-track.
 */
function typeset(text: string, trackingEm: number): Line {
  const track = trackingEm * 1000;
  const parts: string[] = [];
  let pen = 0;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;

  for (const ch of text.toUpperCase()) {
    const g = GLYPHS[ch];
    if (!g) throw new Error(`no outline for ${JSON.stringify(ch)} — extend GLYPHS`);
    if (g.d) parts.push(translatePathX(g.d, pen));
    if (g.bb) {
      x0 = Math.min(x0, pen + g.bb[0]);
      y0 = Math.min(y0, g.bb[1]);
      x1 = Math.max(x1, pen + g.bb[2]);
      y1 = Math.max(y1, g.bb[3]);
    }
    pen += g.adv + track;
  }

  return {
    d: parts.join(""),
    advance: pen - track,
    ink: { x0, y0, x1, y1 },
  };
}

type Anchor = "middle" | "start";

/**
 * Place a typeset line as a <path>, scaled so its CAP HEIGHT is `cap` px and
 * its baseline sits at `baseline` px. Horizontal placement is anchored on the
 * INK box, not the advance box — sidebearings must not decentre a lockup.
 */
function place(
  line: Line,
  opts: { x: number; baseline: number; cap: number; fill: string; anchor?: Anchor },
): string {
  const s = opts.cap / CAP;
  const anchorU = opts.anchor === "start" ? line.ink.x0 : (line.ink.x0 + line.ink.x1) / 2;
  const tx = opts.x - anchorU * s;
  return (
    `<path fill="${opts.fill}" ` +
    `transform="translate(${num(tx)} ${num(opts.baseline)}) scale(${s.toFixed(6)})" ` +
    `d="${line.d}"/>`
  );
}

/** Rendered ink width of a line at a given cap height, px. */
function inkWidth(line: Line, cap: number): number {
  return (line.ink.x1 - line.ink.x0) * (cap / CAP);
}

/* ===========================================================================
   3. Brand constants
   =========================================================================== */

const BRAND = "THE HOKUTEN GROUP";
const SUB_1 = "HOSPITALITY INVESTMENT SALES";
const SUB_2 = "NATIONWIDE COVERAGE";

/** Brand-line tracking — mirrors --tracking-brand in globals.css. */
const BRAND_TRACK = 0.35;
/** Sub-lines sit tighter so the hierarchy reads at social-feed thumbnail size. */
const SUB_TRACK = 0.26;

/**
 * Literal hex is legal here and ONLY here: these outputs are raster-class
 * assets (a .png cannot carry a CSS variable) and each ships in both a gold
 * and a blue variant, which is exactly the token-law carve-out. Every value
 * below is copied from app/globals.css section 2 — none is invented.
 */
interface ThemeSpec {
  key: "gold" | "blue";
  /** OG panel ground */
  ground: string;
  /** wordmark + accent rule */
  accent: string;
  /** first sub-line: the high-contrast voice on this ground */
  subPrimary: string;
  /** second sub-line: the accent voice */
  subSecondary: string;
  /** plate frame hairline — Theme B chrome only */
  frame: string | null;
  /** Theme G star-grain speck colour — dark sections only */
  grain: string | null;
}

const THEMES: ThemeSpec[] = [
  {
    key: "gold",
    ground: "#000000", // --black, the cover panel
    accent: "#B08D3F", // --accent / --accent-on-dark   6.73:1 on black
    // NOT --paper. This card's ground is #000000, so the high-contrast voice
    // is the DARK-FIELD ink token (--ink-dark-field), which is what every
    // other dark surface on the site uses. --paper (#FBF9F3) is the LIGHT
    // page ground and has no business being ink anywhere.
    subPrimary: "#F5F1E8", // --ink-dark-field             18.63:1 on black
    subSecondary: "#B08D3F",
    frame: null,
    grain: "#F5F1E8", // star-grain, dark sections only
  },
  {
    key: "blue",
    ground: "#F7F8F5", // --paper (Theme B), the Coronal plate
    accent: "#2F4FA3", // --accent / --accent-ink       7.12:1 on paper
    subPrimary: "#1A1C1F", // --ink                        16.5:1 on paper
    subSecondary: "#2F4FA3",
    frame: "#DCDFE8", // --rule (Theme B)
    grain: null, // light chrome never takes texture
  },
];

/* ===========================================================================
   4. Wordmark SVG — the fixed lockup, type as outlines
   =========================================================================== */

/** Intrinsic height of the emitted lockup, px (sets the <img> default size). */
const LOCKUP_INTRINSIC_H = 48;

/**
 * The lockup's ink aspect ratio, duplicated in components/brand/Wordmark.tsx so
 * that component can emit width+height and reserve layout before the SVG loads.
 * If this assertion ever fires, the typesetting changed — update BOTH.
 */
const LOCKUP_ASPECT = 22.093;
/**
 * Cap height as a fraction of the lockup box. Below 1 because O/G/U overshoot
 * the cap line; Wordmark.tsx documents it so `height` can be reasoned about.
 */
const LOCKUP_CAP_RATIO = 0.972;

function wordmarkSvg(theme: ThemeSpec): string {
  const line = typeset(BRAND, BRAND_TRACK);
  const w = line.ink.x1 - line.ink.x0;
  const h = line.ink.y1 - line.ink.y0;
  const aspect = w / h;
  if (Math.abs(aspect - LOCKUP_ASPECT) > 0.005) {
    throw new Error(
      `lockup aspect drifted to ${aspect.toFixed(4)} (was ${LOCKUP_ASPECT}) — ` +
        `update LOCKUP_ASPECT here and WORDMARK_ASPECT in components/brand/Wordmark.tsx`,
    );
  }
  if (Math.abs(CAP / h - LOCKUP_CAP_RATIO) > 0.005) {
    throw new Error(`lockup cap ratio drifted to ${(CAP / h).toFixed(4)}`);
  }
  const iw = Number(((LOCKUP_INTRINSIC_H * w) / h).toFixed(2));
  const d = translatePathX(line.d, -line.ink.x0);

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(w)} ${num(h)}"`,
    ` width="${iw}" height="${LOCKUP_INTRINSIC_H}" fill="${theme.accent}"`,
    ` role="img" aria-label="The Hokuten Group">`,
    `<title>The Hokuten Group</title>`,
    `<desc>The words THE HOKUTEN GROUP set as one line of widely tracked capitals.</desc>`,
    // fill is inherited from the root element, so CSS `fill: currentColor` on an
    // inlined copy overrides it while an <img> still renders the brand colour.
    `<path transform="translate(0 ${num(-line.ink.y0)})" d="${d}"/>`,
    `</svg>`,
    "",
  ].join("\n");
}

/* ===========================================================================
   5. OG card — 1200x630, cover recipe (ref 01 + the kit Facebook cover)
   single centre axis · THE HOKUTEN GROUP the only large lettering ·
   thin accent rule · small tracked sub-lines · hanko as a corner stamp
   =========================================================================== */

const OG_W = 1200;
const OG_H = 630;
const CX = OG_W / 2;

/** Target ink width of the brand line, px (75% of the card). */
const BRAND_W = 900;
const SUB_CAP = 16;
const RULE_H = 1.5;
/** baseline -> top of rule */
const RULE_GAP = 27;
/** bottom of rule -> cap top of sub-line 1 */
const SUB1_GAP = 31;
/** baseline of sub-line 1 -> cap top of sub-line 2 */
const SUB2_GAP = 21;
/** Optical lift: a top-heavy stack centres above the geometric middle. */
const OPTICAL_LIFT = 8;

/** Corner stamp box, px, and its inset from the card edge. */
const HANKO_BOX = 92;
const HANKO_INSET_GOLD = 60;
/** Theme B keeps the stamp inside the plate frame. */
const PLATE_INSET = 40;
const HANKO_INSET_BLUE = PLATE_INSET + 32;

/** Deterministic scatter so re-runs are byte-identical. */
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function starGrain(color: string): string {
  const rnd = lcg(0x48_4b_54_4e); // "HKTN"
  const specks: string[] = [];
  for (let i = 0; i < 110; i += 1) {
    const x = Number((rnd() * OG_W).toFixed(1));
    const y = Number((rnd() * OG_H).toFixed(1));
    const r = rnd() < 0.18 ? 1.4 : 0.9;
    specks.push(`<circle cx="${x}" cy="${y}" r="${r}"/>`);
  }
  return `<g fill="${color}" opacity="0.09">${specks.join("")}</g>`;
}

/** Registration-mark geometry, and the gap the trim line leaves for it. */
const REG_R = 5.5;
const REG_ARM_IN = 8.5;
const REG_ARM_OUT = 15;
const REG_CLEAR = REG_ARM_OUT + 5;

/** Print registration mark: open circle + four detached crosshair arms. */
function regMark(cx: number, cy: number, color: string): string {
  const r = REG_R;
  const armIn = REG_ARM_IN;
  const armOut = REG_ARM_OUT;
  const arms = [
    `M${num(cx - armOut)} ${num(cy)}H${num(cx - armIn)}`,
    `M${num(cx + armIn)} ${num(cy)}H${num(cx + armOut)}`,
    `M${num(cx)} ${num(cy - armOut)}V${num(cy - armIn)}`,
    `M${num(cx)} ${num(cy + armIn)}V${num(cy + armOut)}`,
  ].join("");
  return (
    `<g stroke="${color}" stroke-width="1" fill="none" opacity="0.55">` +
    `<circle cx="${num(cx)}" cy="${num(cy)}" r="${r}"/>` +
    `<path d="${arms}"/>` +
    `</g>`
  );
}

function plateChrome(theme: ThemeSpec): string {
  if (!theme.frame) return "";
  const i = PLATE_INSET + 0.5; // .5 so a 1px stroke lands on the pixel grid
  const x1 = OG_W - PLATE_INSET - 0.5;
  const y1 = OG_H - PLATE_INSET - 0.5;
  // The trim line stops short of each corner; the corner belongs to the
  // registration mark. That break is what makes it read as a press proof
  // rather than a box with dots on it.
  const g = REG_CLEAR;
  const trim = [
    `M${num(i + g)} ${i}H${num(x1 - g)}`,
    `M${num(i + g)} ${y1}H${num(x1 - g)}`,
    `M${i} ${num(i + g)}V${num(y1 - g)}`,
    `M${x1} ${num(i + g)}V${num(y1 - g)}`,
  ].join("");
  return [
    `<path d="${trim}" fill="none" stroke="${theme.frame}" stroke-width="1"/>`,
    regMark(i, i, theme.accent),
    regMark(x1, i, theme.accent),
    regMark(i, y1, theme.accent),
    regMark(x1, y1, theme.accent),
  ].join("");
}

function ogSvg(theme: ThemeSpec): { svg: string; hanko: { left: number; top: number } } {
  const brand = typeset(BRAND, BRAND_TRACK);
  const sub1 = typeset(SUB_1, SUB_TRACK);
  const sub2 = typeset(SUB_2, SUB_TRACK);

  const brandCap = BRAND_W / ((brand.ink.x1 - brand.ink.x0) / CAP);
  const ruleW = inkWidth(brand, brandCap);

  // Stack, measured from the brand baseline (b):
  //   cap top      b - brandCap
  //   rule         b + RULE_GAP .. + RULE_H
  //   sub1 baseline b + RULE_GAP + RULE_H + SUB1_GAP + SUB_CAP
  //   sub2 baseline sub1 + SUB2_GAP + SUB_CAP
  const toSub1 = RULE_GAP + RULE_H + SUB1_GAP + SUB_CAP;
  const toSub2 = toSub1 + SUB2_GAP + SUB_CAP;
  const stackH = brandCap + toSub2;
  const baseline = Math.round((OG_H - stackH) / 2 + brandCap - OPTICAL_LIFT);

  const ruleY = baseline + RULE_GAP;

  const inset = theme.key === "blue" ? HANKO_INSET_BLUE : HANKO_INSET_GOLD;

  const body = [
    `<rect width="${OG_W}" height="${OG_H}" fill="${theme.ground}"/>`,
    theme.grain ? starGrain(theme.grain) : "",
    plateChrome(theme),
    place(brand, { x: CX, baseline, cap: brandCap, fill: theme.accent }),
    `<rect x="${num(CX - ruleW / 2)}" y="${num(ruleY)}" width="${num(ruleW)}"` +
      ` height="${RULE_H}" fill="${theme.accent}"/>`,
    place(sub1, { x: CX, baseline: baseline + toSub1, cap: SUB_CAP, fill: theme.subPrimary }),
    place(sub2, { x: CX, baseline: baseline + toSub2, cap: SUB_CAP, fill: theme.subSecondary }),
  ].join("");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}"` +
    ` viewBox="0 0 ${OG_W} ${OG_H}">${body}</svg>`;

  return {
    svg,
    hanko: { left: OG_W - inset - HANKO_BOX, top: OG_H - inset - HANKO_BOX },
  };
}

/* ===========================================================================
   6. Emit
   =========================================================================== */

function siteDir(): string {
  const cwd = process.cwd();
  const pkg = path.join(cwd, "package.json");
  if (!fs.existsSync(pkg) || !fs.existsSync(path.join(cwd, "app", "globals.css"))) {
    throw new Error(`run this from site/ — cwd is ${cwd}`);
  }
  return cwd;
}

async function main(): Promise<void> {
  const root = siteDir();
  const brandDir = path.join(root, "public", "brand");
  const ogDir = path.join(root, "public", "og");
  fs.mkdirSync(brandDir, { recursive: true });
  fs.mkdirSync(ogDir, { recursive: true });

  const missingHanko: string[] = [];

  for (const theme of THEMES) {
    /* — 1. wordmark lockup — */
    const wmPath = path.join(brandDir, `hokuten-wordmark-${theme.key}.svg`);
    const wm = wordmarkSvg(theme);
    fs.writeFileSync(wmPath, wm, "utf8");
    const wmMeta = await sharp(Buffer.from(wm)).metadata();
    console.log(
      `wordmark  ${path.relative(root, wmPath)}  ${wm.length}B  ` +
        `renders ${wmMeta.width}x${wmMeta.height}`,
    );

    /* — 2. OG card — */
    const { svg, hanko } = ogSvg(theme);
    let img = sharp(Buffer.from(svg));

    const hankoPath = path.join(brandDir, `hanko-${theme.key}.svg`);
    if (fs.existsSync(hankoPath)) {
      const stamp = await sharp(fs.readFileSync(hankoPath), { density: 384 })
        .resize(HANKO_BOX, HANKO_BOX, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
      img = img.composite([{ input: stamp, left: hanko.left, top: hanko.top }]);
      console.log(`  hanko     ${path.basename(hankoPath)} -> ${hanko.left},${hanko.top}`);
    } else {
      missingHanko.push(path.relative(root, hankoPath));
    }

    const outPath = path.join(ogDir, `og-${theme.key}.png`);
    await img.png({ compressionLevel: 9, palette: false }).toFile(outPath);

    const meta = await sharp(outPath).metadata();
    const bytes = fs.statSync(outPath).size;
    console.log(
      `og        ${path.relative(root, outPath)}  ${meta.width}x${meta.height} ` +
        `${meta.channels}ch ${(bytes / 1024).toFixed(1)}KB`,
    );
    if (meta.width !== OG_W || meta.height !== OG_H) {
      throw new Error(`bad OG size for ${theme.key}: ${meta.width}x${meta.height}`);
    }
  }

  if (missingHanko.length > 0) {
    console.warn(
      `\nWARNING — corner stamp omitted, these do not exist yet:\n  ` +
        `${missingHanko.join("\n  ")}\n  ` +
        `Re-run \`npx tsx scripts/og-gen.ts\` once the hanko assets land.`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
