"use client";

/**
 * PhotoFrame — the one and only `next/image` wrapper on the site.
 * Governed by hokuten-design-director ref 03 (Imagery), ref 05 (Hovers),
 * ref 07 (P0: CLS < 0.02, no hover-only information).
 *
 * Why this is a client component: the touch `tapped` toggle needs a DOM event
 * handler (kwc parity). The module carries no motion/library weight — it is
 * react + next/image + cn, and `next/image` is already a client module, so the
 * marginal client-bundle cost is a few hundred bytes for every photo on the site.
 *
 * ── CLS contract ───────────────────────────────────────────────────────────
 * Space is ALWAYS reserved before the bytes land. TypeScript enforces it: you
 * either pass `aspect` + `sizes` (fill mode, the card default) or `width` +
 * `height` (intrinsic mode). There is no third option, so a grid can never
 * reflow when an image decodes.
 *
 * ── The grayscale→colour reveal is DECORATION, never information ────────────
 * `photo-reveal` (globals.css) is grayscale at rest and colour on hover, but the
 * hover rule is scoped to `(hover: hover) and (pointer: fine)`. Nothing is ever
 * communicated by the colour state — not availability, not status, not
 * selection. Touch users who never trigger `tapped` lose zero information.
 * That is what keeps this compliant with the P0 "no hover-only information"
 * gate; if you are ever tempted to encode meaning in the reveal, don't.
 *
 * ── Alt text ───────────────────────────────────────────────────────────────
 * `alt` is required and must describe the HOTEL, not the treatment.
 *   yes: "Renaissance Reno Downtown, exterior at dusk"
 *   no:  "black and white photo of a hotel", "grayscale card image"
 * Pass `alt=""` only when the photo is purely decorative AND the same
 * information already exists as adjacent text.
 */

import Image from "next/image";
import { useCallback, useState, type MouseEvent } from "react";

import { cn } from "@/lib/utils";

/** Ratios the grids are allowed to use. A new ratio gets registered here first. */
export type PhotoAspect = "3/2" | "4/3" | "16/9" | "1/1" | "4/5" | "3/4";

/**
 * Literal class strings so Tailwind's source scan can see them. Never build
 * these by interpolation — the utility would not be generated.
 */
const ASPECT_CLASS: Record<PhotoAspect, string> = {
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-[16/9]",
  "1/1": "aspect-square",
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
};

type PhotoFrameCommon = {
  src: string;
  /** REQUIRED. Describes the hotel, never the treatment. See file header. */
  alt: string;
  /** Classes for the frame (the box that reserves the space). */
  className?: string;
  /** Classes for the image itself — e.g. `object-top` for a portrait crop. */
  imageClassName?: string;
  /**
   * LCP image only — one per route. Mapped to `next/image`'s `preload`
   * (`priority` is deprecated in Next 16.3) plus `fetchpriority="high"`.
   */
  priority?: boolean;
  /** false keeps the photo in colour at rest (logo strips, print-first art). */
  reveal?: boolean;
  /**
   * false disables the touch toggle. Set it when the photo sits inside a link
   * or button, where a tap already means "navigate" and the toggle would be
   * unreachable anyway.
   */
  tapReveal?: boolean;
};

/** Fill mode: the frame reserves the box, the image covers it. Cards use this. */
type PhotoFrameFill = PhotoFrameCommon & {
  aspect: PhotoAspect;
  /** Required in fill mode — an unsized responsive image is a perf failure. */
  sizes: string;
  width?: never;
  height?: never;
};

/** Intrinsic mode: real pixel dimensions carry the ratio. Portraits, logos. */
type PhotoFrameIntrinsic = PhotoFrameCommon & {
  width: number;
  height: number;
  aspect?: PhotoAspect;
  sizes?: string;
};

export type PhotoFrameProps = PhotoFrameFill | PhotoFrameIntrinsic;

/** Alt strings that describe the treatment instead of the subject. Dev-only. */
const TREATMENT_ALT =
  /(black[\s-]?and[\s-]?white|b\s?&\s?w|gray?scale|grey?scale|photo of|image of|picture of|placeholder)/i;

export default function PhotoFrame(props: PhotoFrameProps) {
  const {
    src,
    alt,
    className,
    imageClassName,
    priority = false,
    reveal = true,
    tapReveal = true,
  } = props;

  const { aspect, sizes } = props;
  const isFill = props.width === undefined;

  const [tapped, setTapped] = useState(false);

  /**
   * kwc touch-reveal parity: on no-hover devices a tap toggles colour. Gated at
   * event time (not render time) so there is no matchMedia read during SSR and
   * no hydration mismatch. Real controls inside the frame keep their click.
   */
  const handleTap = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!window.matchMedia("(hover: none)").matches) return;
      if ((event.target as HTMLElement).closest("a, button")) return;
      setTapped((current) => !current);
    },
    [],
  );

  if (process.env.NODE_ENV !== "production" && alt && TREATMENT_ALT.test(alt)) {
    console.warn(
      `[PhotoFrame] alt describes the treatment, not the hotel: "${alt}" — name the property.`,
    );
  }

  const interactive = reveal && tapReveal;

  const imageClasses = cn(
    "rounded-none object-cover",
    isFill || aspect ? "h-full w-full" : "h-auto w-full",
    reveal && "photo-reveal",
    tapped && "tapped",
    imageClassName,
  );

  return (
    <div
      className={cn(
        // rounded-none: art has no radius (ref 03). overflow-hidden clips the
        // 1.02 hover scale so it can never nudge a neighbour.
        "relative overflow-hidden rounded-none bg-surface",
        aspect && ASPECT_CLASS[aspect],
        className,
      )}
      onClick={interactive ? handleTap : undefined}
    >
      {isFill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={priority}
          fetchPriority={priority ? "high" : undefined}
          draggable={false}
          className={imageClasses}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={props.width}
          height={props.height}
          sizes={sizes}
          preload={priority}
          fetchPriority={priority ? "high" : undefined}
          draggable={false}
          className={imageClasses}
        />
      )}
    </div>
  );
}
