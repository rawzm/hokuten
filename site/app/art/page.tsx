/**
 * app/art/page.tsx — internal art-direction preview route.
 *
 * DESIGN-REVISIT.md §3.1: "art-direct on the preview page; Razim eyeballs" every
 * prepared 「北天」 asset before it is final. This route is that page. It is a
 * working tool, not a designed marketing surface — layout stays utilitarian,
 * labels stay in the mono micro voice, and nothing here is hardcoded from a
 * content file: everything is read off `public/` at request time so the page
 * tells the truth about whatever has actually landed, including mid-flight
 * (several sibling agents write into these directories concurrently this round).
 *
 * ── Never indexed ──────────────────────────────────────────────────────────
 * `metadata.robots` below is the enforcement; the visible banner is the human
 * one. This route must never be linked from the public site or the sitemap.
 *
 * ── Why it reads the filesystem instead of importing content ────────────────
 * `content/artwork.ts` is being authored by a different agent this same round
 * (DESIGN-REVISIT §3.1's "typed registry mapping placement → asset path").
 * Importing it here would make this page depend on that file's shape landing
 * a particular way before this one can even type-check. Enumerating
 * `public/art` / `public/logos` / `public/awards` / `public/brand` directly
 * with `node:fs` has zero cross-agent dependency and keeps working even if
 * that file's shape changes completely.
 *
 * `public/art/_manifest.json` (written by `scripts/artwork-prep.ts`, when that
 * script has run) IS read, preferentially — the task brief calls this out
 * explicitly, and unlike content/artwork.ts it is a build artifact, not
 * another agent's in-progress source file: reading a data file this page does
 * not own the *shape* of any more than it owns the images themselves, and the
 * artwork-prep script is the authoritative source of placement→file mapping
 * (it is literally what wrote the files). Parsing is defensive throughout: an
 * absent, partial, or malformed manifest degrades to a filename-heuristic
 * fallback (`FALLBACK_SLUG_VARIANT_TO_LABEL`, a hand-kept mirror of that
 * script's own `PLACEMENTS` table) rather than throwing. Every other directory
 * has no manifest at all and is enumerated generically.
 *
 * ── Why `force-dynamic` ──────────────────────────────────────────────────────
 * Without it, Next may statically render this route once (build time) and
 * cache that HTML — exactly wrong for a page whose entire purpose is showing
 * whatever a concurrently-running prep script has written *right now*. Node
 * runtime is pinned explicitly because `sharp` is a native addon; nothing here
 * should ever be allowed to silently attempt the edge runtime.
 *
 * ── Why plain <img> / <picture>, never next/image ────────────────────────────
 * This page's entire job is inspecting the REAL prepared files byte-for-byte —
 * their real crop, real intrinsic size, real encoded weight. `next/image`
 * would re-encode/resize through its own loader, which is exactly the kind of
 * indirection that would make "judging the crop" judge a re-derived image
 * instead of the shipped one. A bare `<picture>` (AVIF source + a universally-
 * supported raster as the `<img>` fallback) mirrors what production actually
 * serves with zero build-time transformation of its own.
 *
 * ── `--brick` reused outside forms ────────────────────────────────────────
 * globals.css scopes `--brick` "form errors only" in its own comment. This
 * page is not a form, but the `_hold-amber-mark` chip and an unresolved
 * "still needed" row are both genuinely blocking states — the same semantic
 * `--brick` already carries — and inventing a second token for the same
 * meaning would be the token-law violation, not reusing this one. Flagged
 * here for whoever next edits ref 01/03 to decide if `--brick` should be
 * renamed to something scope-neutral, or if this page should get its own
 * token; not this agent's file to make that call in.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import { MicroLabel } from "@/components/atoms/MicroLabel";
import { KanjiAccent } from "@/components/art/KanjiAccent";
import { PROPERTY_TYPE_OPTIONS, TIER_OPTIONS } from "@/lib/valuation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Art direction — internal",
  description:
    "Internal art-direction preview of every prepared 「北天」 asset, brand chip, lockup and badge. Not part of the public site.",
  robots: { index: false, follow: false },
};

/* =============================================================================
   1. Filesystem primitives — every read is guarded; a missing/empty directory
   or an unreadable file degrades to an empty result, never a thrown error.
   ============================================================================= */

const SITE_ROOT = process.cwd();
const ART_DIR = path.join(SITE_ROOT, "public", "art");
const LOGOS_DIR = path.join(SITE_ROOT, "public", "logos");
const AWARDS_DIR = path.join(SITE_ROOT, "public", "awards");
const BRAND_DIR = path.join(SITE_ROOT, "public", "brand");
const HOTELS_DIR = path.join(SITE_ROOT, "public", "hotels");
const TEAM_DIR = path.join(SITE_ROOT, "public", "team");

const IMAGE_EXT = /\.(avif|webp|png|jpe?g|svg|gif)$/i;
/** Build-report artifacts, not shippable placement assets — excluded from the
 *  generic per-directory scans and instead surfaced explicitly (§4/§5). */
const META_FILES = new Set(["_contact-sheet.jpg", "_identity-sheet.jpg"]);

function listImageFiles(dir: string): string[] {
  try {
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isFile() &&
          IMAGE_EXT.test(entry.name) &&
          !entry.name.startsWith(".") &&
          !META_FILES.has(entry.name),
      )
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}

function statBytes(absPath: string): number {
  try {
    return fs.statSync(absPath).size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function readIntrinsicSize(
  absPath: string,
): Promise<{ width: number | null; height: number | null; error?: string }> {
  try {
    const meta = await sharp(absPath).metadata();
    return { width: meta.width ?? null, height: meta.height ?? null };
  } catch {
    // Known live case: two legacy SVGs in public/art carry an XML comment with
    // a literal "--", which sharp's libvips-backed SVG parser rejects outright.
    // Surfacing this in the caption doubles as a QA catch, not just a fallback.
    return { width: null, height: null, error: "sharp could not read this file" };
  }
}

/** Generic asset — used for every directory that has no build manifest of its
 *  own (logos, brand, awards, and the art-directory fallback/unclassified path). */
type Asset = {
  filename: string;
  href: string;
  bytes: number;
  width: number | null;
  height: number | null;
  dimError?: string;
};

async function loadAssets(dir: string, publicPrefix: string, filenames?: string[]): Promise<Asset[]> {
  const files = filenames ?? listImageFiles(dir);
  return Promise.all(
    files.map(async (filename) => {
      const abs = path.join(/* turbopackIgnore: true */ dir, filename);
      const { width, height, error } = await readIntrinsicSize(abs);
      return {
        filename,
        href: `${publicPrefix}/${filename}`,
        bytes: statBytes(abs),
        width,
        height,
        dimError: error,
      };
    }),
  );
}

/* =============================================================================
   2. Artwork manifest — scripts/artwork-prep.ts writes public/art/_manifest.json
   as a pure function of its MASTERS/PLACEMENTS config + Ref/artwork masters.
   Shape read directly from that script (2026-08-09) — NOT imported from it, this
   page only knows the JSON shape it emits, so it keeps working if the script's
   internals change as long as the manifest shape doesn't.
   ============================================================================= */

type ManifestFormat = "avif" | "webp" | "jpg";

type ManifestFileEntry = {
  label?: string;
  slug?: string;
  variant?: string;
  width?: number;
  height?: number;
  format?: ManifestFormat;
  path?: string;
  bytes?: number;
  overBudget?: boolean;
};

type ManifestMaster = { slug?: string; file?: string; width?: number; height?: number; subject?: string };
type ManifestBlocked = { label?: string; reason?: string };

type ArtManifest = {
  generatedAt?: string;
  masters?: ManifestMaster[];
  files?: ManifestFileEntry[];
  blocked?: ManifestBlocked[];
};

function loadArtManifest(): ArtManifest | null {
  const manifestPath = path.join(ART_DIR, "_manifest.json");
  if (!fs.existsSync(manifestPath)) return null;
  try {
    const raw = fs.readFileSync(manifestPath, "utf8");
    const data: unknown = JSON.parse(raw);
    if (data && typeof data === "object" && Array.isArray((data as ArtManifest).files)) {
      return data as ArtManifest;
    }
    return null;
  } catch {
    return null;
  }
}

/** `_manifest.json` entries carry a repo-relative path ("public/art/x.avif");
 *  strip the leading "public/" to get the URL a browser can actually fetch. */
function manifestPathToUrl(repoRelativePath: string): string {
  const marker = "public/";
  const idx = repoRelativePath.indexOf(marker);
  const rel = idx >= 0 ? repoRelativePath.slice(idx + marker.length) : repoRelativePath;
  return `/${rel}`;
}

/** Normalized shape both the manifest path and the filename-heuristic fallback
 *  path resolve into, so one rendering component (`ArtFigure`) serves both. */
type ArtFile = {
  label: string;
  slug: string;
  variant: string;
  width: number;
  height: number;
  format: string;
  url: string;
  bytes: number;
  overBudget?: boolean;
};

/** Mirrors `scripts/artwork-prep.ts`'s `PLACEMENTS` table (slug + variant →
 *  label). Hand-kept, not imported — this is the fallback path for when the
 *  manifest itself is missing/unreadable, so it cannot depend on the script
 *  that writes the manifest. Re-sync if that script's PLACEMENTS table changes. */
const FALLBACK_SLUG_VARIANT_TO_LABEL: Record<string, string> = {
  "beachfront-aerial:hero": "hero-theme-g",
  "full-service-sunset:hero": "hero-theme-b",
  "hie-dusk:portrait": "menu-overlay-portrait",
  "hie-dusk:chapter": "method-chapter",
  "beachfront-aerial:card": "listing-placeholder-card",
  "marriott-tower:card": "closings-accent-card",
  "hie-dusk:tile": "tile-limitedService",
  "select-service-dusk:tile": "tile-selectService",
  "historic-urban-dawn:tile": "tile-fullService",
  "resort-pool-loungers:tile": "tile-resortBoutique",
  "historic-urban-dawn:wide": "wide-gateway",
  "grand-resort-arrival:wide": "wide-secondary",
  "marriott-tower:wide": "wide-suburban",
  "select-service-dusk:wide": "wide-tertiary",
  "resort-tower-pool:hero": "spare-hero-resort-tower-pool",
  "resort-tower-pool:tile": "spare-tile-resort-tower-pool",
  "grand-resort-arrival:hero": "spare-hero-grand-resort-arrival",
  "grand-resort-arrival:tile": "spare-tile-grand-resort-arrival",
};

const ART_FILENAME_RE = /^(.+)-(hero|portrait|chapter|card|tile|wide)-(\d+)\.(avif|webp|jpg)$/i;

type ArtBuild = {
  groups: Map<string, ArtFile[]>;
  unclassified: Asset[];
  manifestUsed: boolean;
  manifest: ArtManifest | null;
};

async function buildArtGroups(): Promise<ArtBuild> {
  const manifest = loadArtManifest();
  const allFiles = listImageFiles(ART_DIR); // excludes json/meta already

  if (manifest && manifest.files) {
    const groups = new Map<string, ArtFile[]>();
    const referenced = new Set<string>();
    for (const entry of manifest.files) {
      if (!entry.label || !entry.path || !entry.width || !entry.height) continue;
      referenced.add(path.basename(entry.path));
      const file: ArtFile = {
        label: entry.label,
        slug: entry.slug ?? "unknown",
        variant: entry.variant ?? "unknown",
        width: entry.width,
        height: entry.height,
        format: entry.format ?? "unknown",
        url: manifestPathToUrl(entry.path),
        bytes: entry.bytes ?? 0,
        overBudget: entry.overBudget,
      };
      const list = groups.get(entry.label) ?? [];
      list.push(file);
      groups.set(entry.label, list);
    }
    const strayFilenames = allFiles.filter((f) => !referenced.has(f));
    const unclassified = await loadAssets(ART_DIR, "/art", strayFilenames);
    return { groups, unclassified, manifestUsed: true, manifest };
  }

  // Fallback: manifest absent/unreadable — parse filenames directly.
  const groups = new Map<string, ArtFile[]>();
  const strayFilenames: string[] = [];
  for (const filename of allFiles) {
    const match = ART_FILENAME_RE.exec(filename);
    if (!match) {
      strayFilenames.push(filename);
      continue;
    }
    const [, slug, variant, widthRaw, format] = match;
    const label = FALLBACK_SLUG_VARIANT_TO_LABEL[`${slug}:${variant}`];
    if (!label) {
      strayFilenames.push(filename);
      continue;
    }
    const abs = path.join(ART_DIR, filename);
    const { width, height } = await readIntrinsicSize(abs);
    const file: ArtFile = {
      label,
      slug,
      variant,
      width: width ?? Number(widthRaw),
      height: height ?? 0,
      format,
      url: `/art/${filename}`,
      bytes: statBytes(abs),
    };
    const list = groups.get(label) ?? [];
    list.push(file);
    groups.set(label, list);
  }
  const unclassified = await loadAssets(ART_DIR, "/art", strayFilenames);
  return { groups, unclassified, manifestUsed: false, manifest: null };
}

/** Within one placement's files, pick the best available <picture> sources:
 *  largest AVIF/WebP if present, largest of whatever else as the <img> src
 *  (the prep script only ever emits a JPEG fallback at the largest surviving
 *  width, so this naturally prefers that when it exists). */
function pickRepresentative(files: ArtFile[]): { primary: ArtFile; avif?: ArtFile; webp?: ArtFile } {
  const byWidthDesc = (a: ArtFile, b: ArtFile) => b.width - a.width;
  const avif = [...files].filter((f) => f.format === "avif").sort(byWidthDesc)[0];
  const webp = [...files].filter((f) => f.format === "webp").sort(byWidthDesc)[0];
  const jpg = [...files].filter((f) => f.format === "jpg" || f.format === "jpeg").sort(byWidthDesc)[0];
  const primary = jpg ?? avif ?? webp ?? files[0];
  return { primary, avif, webp };
}

/* =============================================================================
   3. Placement catalogue — the 15 slots the task brief names, plus whatever
   "spare" alternates the prep script generated. Titles/specs/render widths are
   this page's own presentation data (not content law — nothing here is copy
   that ships to a visitor); property-type and market-tier labels are pulled
   from lib/valuation.ts so the five/four names can never drift from the
   calculator's own PropertyType/Tier vocabulary.
   ============================================================================= */

type PlacementMeta = {
  title: string;
  spec: string;
  widthPx: number;
  ground?: "dark";
  aspectClass: string;
};

const PLACEMENT_META: Record<string, PlacementMeta> = {
  "hero-theme-g": {
    title: "Hero band — Theme G (gold)",
    spec: "target ~2:1–21:9, ≥2560px wide ideal · slug beachfront-aerial",
    widthPx: 1400,
    aspectClass: "aspect-[12/5]",
  },
  "hero-theme-b": {
    title: "Hero band — Theme B (blue)",
    spec: "target ~2:1–21:9, ≥2560px wide ideal · slug full-service-sunset (Theme B palette bias)",
    widthPx: 1400,
    aspectClass: "aspect-[12/5]",
  },
  "menu-overlay-portrait": {
    title: "Menu overlay — left art panel",
    spec: "target portrait ~3:4, ≥1200px wide · slug hie-dusk",
    widthPx: 380,
    aspectClass: "aspect-[3/4]",
  },
  "method-chapter": {
    title: "#method chapter art (dark ground)",
    spec: "target ~4:3, ≥1600px · slug hie-dusk",
    widthPx: 560,
    ground: "dark",
    aspectClass: "aspect-[4/3]",
  },
  "listing-placeholder-card": {
    title: "Listing ticket — no-photo header",
    spec: "target ~3:2, ≥1200px · slug beachfront-aerial",
    widthPx: 420,
    aspectClass: "aspect-[3/2]",
  },
  "closings-accent-card": {
    title: "#closings section accent",
    spec: "target flexible, ~3:2 as generated · slug marriott-tower",
    widthPx: 420,
    aspectClass: "aspect-[3/2]",
  },
};

const TILE_SOURCE_NOTE: Record<string, string> = {
  limitedService: "slug hie-dusk",
  selectService: "slug select-service-dusk",
  fullService: "slug historic-urban-dawn",
  resortBoutique: "slug resort-pool-loungers",
  extendedStay: "BLOCKED — no artwork delivered for this property type",
};

for (const option of PROPERTY_TYPE_OPTIONS) {
  PLACEMENT_META[`tile-${option.value}`] = {
    title: `Property-type square — ${option.label}`,
    spec: `target 1:1 square, ≥800×800 · ${TILE_SOURCE_NOTE[option.value] ?? "no source noted"}`,
    widthPx: 220,
    aspectClass: "aspect-square",
  };
}

const WIDE_SOURCE_NOTE: Record<string, string> = {
  gateway: "slug historic-urban-dawn",
  secondary: "slug grand-resort-arrival",
  suburban: "slug marriott-tower",
  tertiary: "slug select-service-dusk",
};

for (const option of TIER_OPTIONS) {
  PLACEMENT_META[`wide-${option.value}`] = {
    title: `Market-tier panel — ${option.label}`,
    spec: `target 5:2 wide panel, ~1600×640 · optional (text-tile fallback is fine) · ${WIDE_SOURCE_NOTE[option.value] ?? "no source noted"}`,
    widthPx: 900,
    aspectClass: "aspect-[5/2]",
  };
}

const PLACEMENT_ORDER: string[] = [
  "hero-theme-g",
  "hero-theme-b",
  "menu-overlay-portrait",
  "method-chapter",
  "listing-placeholder-card",
  "closings-accent-card",
  ...PROPERTY_TYPE_OPTIONS.map((o) => `tile-${o.value}`),
  ...TIER_OPTIONS.map((o) => `wide-${o.value}`),
];

const SPARE_LABELS = [
  "spare-hero-resort-tower-pool",
  "spare-tile-resort-tower-pool",
  "spare-hero-grand-resort-arrival",
  "spare-tile-grand-resort-arrival",
];

function spareMeta(label: string): PlacementMeta {
  const isHero = label.includes("hero");
  return {
    title: label.replace(/^spare-/, "spare — ").replace(/-/g, " "),
    spec: "alternate render, not one of the 15 primary placements",
    widthPx: isHero ? 700 : 220,
    aspectClass: isHero ? "aspect-[12/5]" : "aspect-square",
  };
}

/* =============================================================================
   4. Identity assets — header lockups (D1) + CoStar badges (D3). Filenames are
   read straight off `scripts/identity-prep.ts` (2026-08-09): it always emits a
   PNG + AVIF pair per key, PNG guaranteed. A generic scan still runs
   underneath so an unexpected file is never silently dropped.
   ============================================================================= */

const LOCKUP_KEYS = [
  { key: "gold", label: "Theme G (gold)" },
  { key: "blue", label: "Theme B (blue)" },
] as const;

const BADGE_KEYS = [
  { key: "powerbroker-q3-2025", label: "Power Broker — Q3 2025" },
  { key: "powerbroker-q1-2026", label: "Power Broker — Q1 2026" },
  { key: "powerbroker-q2-2026", label: "Power Broker — Q2 2026" },
  { key: "costar-top-broker-2025", label: "2025 Annual — Top Broker" },
  { key: "costar-top-firm-2025", label: "2025 Annual — Top Firm" },
] as const;

type PictureAsset = {
  key: string;
  label: string;
  avifHref?: string;
  rasterHref?: string;
  width: number | null;
  height: number | null;
  bytes: number;
};

async function findPicturePair(
  dir: string,
  publicPrefix: string,
  key: string,
  rasterExt: "png",
): Promise<{ avifHref?: string; rasterHref?: string; width: number | null; height: number | null; bytes: number }> {
  const avifPath = path.join(/* turbopackIgnore: true */ dir, `${key}.avif`);
  const rasterPath = path.join(/* turbopackIgnore: true */ dir, `${key}.${rasterExt}`);
  const hasAvif = fs.existsSync(avifPath);
  const hasRaster = fs.existsSync(rasterPath);
  if (!hasAvif && !hasRaster) {
    return { width: null, height: null, bytes: 0 };
  }
  const primaryPath = hasRaster ? rasterPath : avifPath;
  const { width, height } = await readIntrinsicSize(primaryPath);
  return {
    avifHref: hasAvif ? `${publicPrefix}/${key}.avif` : undefined,
    rasterHref: hasRaster ? `${publicPrefix}/${key}.${rasterExt}` : undefined,
    width,
    height,
    bytes: statBytes(primaryPath),
  };
}

/* =============================================================================
   5. Still-needed checks — the brief's known gaps, cross-checked live against
   disk so this list self-corrects as other agents deliver, instead of going
   stale the moment it's written.
   ============================================================================= */

type NeedItem = { label: string; resolved: boolean; note: string };

function includesAll(haystack: string, needles: string[]): boolean {
  return needles.every((n) => haystack.includes(n));
}

/* =============================================================================
   6. Presentational primitives
   ============================================================================= */

function SectionHead({ id, index, title, meta }: { id: string; index: string; title: string; meta?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {/* MicroLabel's `as` union has no heading tags (it's an inline eyebrow
          device elsewhere on the site, always paired with a separate <h2>) —
          same technique BrandsSection uses: a real <h2> carries the id/outline,
          MicroLabel (default span) renders inside it for the bracket device. */}
      <h2 id={id}>
        <MicroLabel index={index}>{title}</MicroLabel>
      </h2>
      {meta ? <p className="text-data text-fg-meta max-w-[70ch]">{meta}</p> : null}
    </div>
  );
}

function EmptySlot({ widthPx, aspectClass, reason }: { widthPx: number; aspectClass: string; reason: string }) {
  return (
    <div className="flex flex-col items-start gap-2" style={{ width: widthPx, maxWidth: "100%" }}>
      <div
        className={cn(
          "flex w-full items-center justify-center border border-dashed border-hairline p-6 text-center",
          aspectClass,
        )}
        style={{ width: widthPx, maxWidth: "100%" }}
      >
        <p className="micro-label">NO FILE YET</p>
      </div>
      <p className="text-micro text-fg-meta max-w-[38ch]">{reason}</p>
    </div>
  );
}

function ArtFigure({ files, widthPx, subject }: { files: ArtFile[]; widthPx: number; subject?: string }) {
  const { primary, avif, webp } = pickRepresentative(files);
  const anyOverBudget = files.some((f) => f.overBudget);
  const widths = Array.from(new Set(files.map((f) => f.width))).sort((a, b) => a - b);
  const formats = Array.from(new Set(files.map((f) => f.format)));

  return (
    <figure className="flex flex-col items-start gap-2" style={{ width: widthPx, maxWidth: "100%" }}>
      <picture>
        {avif ? <source type="image/avif" srcSet={avif.url} /> : null}
        {webp ? <source type="image/webp" srcSet={webp.url} /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element -- see file header: this page inspects the real shipped bytes, next/image would re-derive them */}
        <img
          src={primary.url}
          alt={`${subject ?? `${primary.slug} ${primary.variant}`} — prepared 「北天」 artwork crop`}
          width={primary.width || undefined}
          height={primary.height || undefined}
          style={{ width: widthPx, maxWidth: "100%", height: "auto" }}
          className="border border-hairline"
          loading="lazy"
          decoding="async"
        />
      </picture>
      <figcaption className="micro-label max-w-[46ch]">
        {primary.slug}-{primary.variant} · {primary.width}×{primary.height} · {formatBytes(primary.bytes)}
        {widths.length > 1 ? ` · widths ${widths.join(", ")}` : ""}
        {formats.length > 1 ? ` · ${formats.join("/")}` : ""}
        {anyOverBudget ? " · OVER BUDGET on ≥1 variant" : ""}
      </figcaption>
      {subject ? <p className="text-micro text-fg-meta max-w-[46ch]">source: {subject}</p> : null}
    </figure>
  );
}

function PlacementGroup({
  placementId,
  meta,
  files,
  blockedReason,
  masterSubject,
}: {
  placementId: string;
  meta: PlacementMeta;
  files: ArtFile[];
  blockedReason?: string;
  masterSubject?: string;
}) {
  // "dark" placements (method-chapter) get an inset surface-dark box, not an
  // edge-to-edge bleed — bleeding to the viewport edge would need this
  // component to know container-wide's own padding breakpoint, which is a
  // fragile thing for a preview row to duplicate. An inset box still answers
  // the brief's actual requirement (judge the crop against a dark ground).
  const isDark = meta.ground === "dark";
  return (
    <div className="flex flex-col gap-4 border-t border-hairline py-8 first:border-t-0">
      <div className="flex flex-col gap-1">
        <MicroLabel as="p">{meta.title}</MicroLabel>
        <p className="text-micro text-fg-meta">{meta.spec}</p>
      </div>
      <div className={cn("flex flex-wrap items-end gap-8", isDark && "surface-dark border border-hairline p-6")}>
        {files.length > 0 ? (
          <ArtFigure files={files} widthPx={meta.widthPx} subject={masterSubject} />
        ) : (
          <EmptySlot
            widthPx={meta.widthPx}
            aspectClass={meta.aspectClass}
            reason={blockedReason ?? `not yet delivered — ${meta.spec}`}
          />
        )}
      </div>
      <p className="text-micro text-fg-meta">[ {placementId} ]</p>
    </div>
  );
}

function ChipRow({ assets, ground, groundLabel }: { assets: Asset[]; ground: "surface-paper" | "surface-dark"; groundLabel: string }) {
  return (
    <div className={cn(ground, "px-6 py-8 md:px-12")}>
      <p className="micro-label mb-4">{groundLabel}</p>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-6">
        {assets.map((asset) => {
          const flagged = isHoldAmber(asset.filename);
          return (
            <div key={asset.filename} className="flex flex-col items-start gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- see file header */}
              <img
                src={asset.href}
                alt={`${asset.filename} — brand chip`}
                style={{ height: 52, width: "auto" }}
                className={cn("select-none", flagged && "border-2 border-brick")}
                loading="lazy"
                decoding="async"
              />
              <p className="micro-label">
                {asset.filename} · {formatBytes(asset.bytes)}
              </p>
              {flagged ? (
                <p className="text-micro font-mono uppercase tracking-micro text-brick">
                  Unidentified — not shippable
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function isHoldAmber(filename: string): boolean {
  const name = filename.toLowerCase();
  return name.startsWith("_hold") || (name.includes("hold") && name.includes("amber"));
}

function PictureFigure({ asset, cssHeight }: { asset: PictureAsset; cssHeight: number }) {
  if (!asset.avifHref && !asset.rasterHref) {
    return (
      <div className="flex flex-col items-start gap-2">
        <div
          className="flex items-center justify-center border border-dashed border-hairline px-6"
          style={{ height: cssHeight }}
        >
          <p className="micro-label">NOT YET DELIVERED</p>
        </div>
        <p className="micro-label">{asset.label}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <picture>
        {asset.avifHref ? <source type="image/avif" srcSet={asset.avifHref} /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element -- see file header */}
        <img
          src={asset.rasterHref ?? asset.avifHref}
          alt={`${asset.label} — prepared identity asset`}
          style={{ height: cssHeight, width: "auto" }}
          decoding="async"
        />
      </picture>
      <p className="micro-label">
        {asset.label} · {asset.width && asset.height ? `${asset.width}×${asset.height}` : "dims unavailable"} ·{" "}
        {formatBytes(asset.bytes)}
      </p>
    </div>
  );
}

/* =============================================================================
   7. Page
   ============================================================================= */

export default async function ArtDirectionPage() {
  const [artBuild, logoAssets, hotelFiles, teamFiles] = await Promise.all([
    buildArtGroups(),
    loadAssets(LOGOS_DIR, "/logos"),
    Promise.resolve(listImageFiles(HOTELS_DIR)),
    Promise.resolve(listImageFiles(TEAM_DIR)),
  ]);

  const mastersBySlug = new Map((artBuild.manifest?.masters ?? []).map((m) => [m.slug, m]));
  const blockedByLabel = new Map(
    (artBuild.manifest?.blocked ?? [])
      .filter((b): b is { label: string; reason: string } => Boolean(b.label && b.reason))
      .map((b) => [b.label, b.reason]),
  );

  const spareGroups = SPARE_LABELS.map((label) => ({
    label,
    meta: spareMeta(label),
    files: artBuild.groups.get(label) ?? [],
  })).filter((g) => g.files.length > 0);

  const lockups = await Promise.all(
    LOCKUP_KEYS.map(async ({ key, label }) => {
      const found = await findPicturePair(BRAND_DIR, "/brand", `lockup-${key}`, "png");
      return { key, label, ...found } satisfies PictureAsset;
    }),
  );

  const badges = await Promise.all(
    BADGE_KEYS.map(async ({ key, label }) => {
      const found = await findPicturePair(AWARDS_DIR, "/awards", key, "png");
      return { key, label, ...found } satisfies PictureAsset;
    }),
  );

  const contactSheetArt = path.join(ART_DIR, "_contact-sheet.jpg");
  const hasArtContactSheet = fs.existsSync(contactSheetArt);
  const identitySheet = path.join(BRAND_DIR, "_identity-sheet.jpg");
  const hasIdentitySheet = fs.existsSync(identitySheet);

  const totalArtFiles = Array.from(artBuild.groups.values()).reduce((n, list) => n + list.length, 0);
  const filledPlacements = PLACEMENT_ORDER.filter((id) => (artBuild.groups.get(id) ?? []).length > 0).length;

  const holdAmberChip = logoAssets.find((a) => isHoldAmber(a.filename));
  const extendedStayFiles = artBuild.groups.get("tile-extendedStay") ?? [];

  const stillNeeded: NeedItem[] = [
    {
      label: "Extended-stay property square (1:1, ≥800×800)",
      resolved: extendedStayFiles.length > 0,
      note:
        extendedStayFiles.length > 0
          ? `found: ${extendedStayFiles[0].url}`
          : (blockedByLabel.get("tile-extendedStay") ?? "not yet delivered"),
    },
    {
      label: "Brand chip — Radisson",
      resolved: logoAssets.some((a) => a.filename.toLowerCase().includes("radisson")),
      note: logoAssets.some((a) => a.filename.toLowerCase().includes("radisson")) ? "found in public/logos/" : "not yet delivered",
    },
    {
      label: "Brand chip — Choice Hotels",
      resolved: logoAssets.some((a) => a.filename.toLowerCase().includes("choice")),
      note: logoAssets.some((a) => a.filename.toLowerCase().includes("choice")) ? "found in public/logos/" : "not yet delivered",
    },
    {
      label: "A name for the unidentified amber chip",
      resolved: !holdAmberChip,
      note: holdAmberChip
        ? `still present, unnamed: ${holdAmberChip.filename} — see §2 above`
        : logoAssets.length > 0
          ? "no _hold-amber-mark file found — resolved or renamed"
          : "public/logos/ is empty — nothing delivered yet either way",
    },
    {
      label: "Active-listing photo — The Lodge at Split Rock Resort",
      resolved: hotelFiles.some((f) => includesAll(f.toLowerCase(), ["split"])),
      note: hotelFiles.find((f) => includesAll(f.toLowerCase(), ["split"])) ?? "not yet delivered",
    },
    {
      label: "Active-listing photo — Pocono Mountain Hotel and Spa",
      resolved: hotelFiles.some((f) => f.toLowerCase().includes("pocono")),
      note: hotelFiles.find((f) => f.toLowerCase().includes("pocono")) ?? "not yet delivered",
    },
    {
      label: "Active-listing photo — Developer Inn Highway (Kissimmee)",
      resolved: hotelFiles.some((f) => f.toLowerCase().includes("kissimmee") || includesAll(f.toLowerCase(), ["developer", "highway"])),
      note:
        hotelFiles.find((f) => f.toLowerCase().includes("kissimmee") || includesAll(f.toLowerCase(), ["developer", "highway"])) ??
        "not yet delivered",
    },
    {
      label: "Active-listing photo — Developer Inn Downtown Orlando",
      resolved: hotelFiles.some((f) => includesAll(f.toLowerCase(), ["developer", "orlando"]) || includesAll(f.toLowerCase(), ["developer", "downtown"])),
      note:
        hotelFiles.find((f) => includesAll(f.toLowerCase(), ["developer", "orlando"]) || includesAll(f.toLowerCase(), ["developer", "downtown"])) ??
        "not yet delivered",
    },
    {
      label: "Active-listing photo — Baymont by Wyndham Jacksonville Airport",
      resolved: hotelFiles.some((f) => f.toLowerCase().includes("jacksonville")),
      note: hotelFiles.find((f) => f.toLowerCase().includes("jacksonville")) ?? "not yet delivered",
    },
    {
      label: "Portrait — Razim",
      resolved: teamFiles.some((f) => f.toLowerCase().includes("razim")),
      note: teamFiles.find((f) => f.toLowerCase().includes("razim")) ?? "not yet delivered",
    },
    {
      label: "Portrait — William",
      resolved: teamFiles.some((f) => f.toLowerCase().includes("william")),
      note: teamFiles.find((f) => f.toLowerCase().includes("william")) ?? "not yet delivered",
    },
  ];

  return (
    <main id="main" className="surface-paper min-h-full">
      {/* Visible internal-tool banner — the metadata.robots block above is the
          machine-readable half of this same fact. */}
      <div className="surface-dark px-6 py-4 md:px-12">
        <p className="micro-label">
          Internal art-direction tool — never indexed, never linked from the public site. Reads public/
          directly, refreshed on every request.
        </p>
      </div>

      <div className="container-wide flex flex-col gap-3 py-10">
        <h1 className="text-heading font-display font-light">Art direction — internal preview</h1>
        <p className="text-body text-fg-muted max-w-[70ch]">
          Enumerates <code className="font-mono">public/art</code>, <code className="font-mono">public/logos</code>,{" "}
          <code className="font-mono">public/awards</code> and <code className="font-mono">public/brand</code> off
          disk — nothing on this page is hardcoded, so it updates itself as prepared files land.{" "}
          {artBuild.manifestUsed
            ? `Placement source: public/art/_manifest.json (${totalArtFiles} file(s) across ${filledPlacements}/${PLACEMENT_ORDER.length} placements).`
            : "public/art/_manifest.json not found or unreadable — placement inferred from filenames instead."}
        </p>
      </div>

      {/* ── 01 — Artwork, by placement ─────────────────────────────────────── */}
      <section aria-labelledby="art-artwork" className="section-pad-tight border-t border-hairline">
        <div className="container-wide flex flex-col gap-8">
          <SectionHead
            id="art-artwork"
            index="01"
            title="「北天」 artwork, by placement"
            meta={`${listImageFiles(ART_DIR).length} image file(s) present under public/art/. ${
              artBuild.unclassified.length > 0
                ? `${artBuild.unclassified.length} did not match a known placement — see "Unclassified" below.`
                : "Every file present matched a known placement."
            }`}
          />

          {hasArtContactSheet ? (
            <figure className="flex flex-col items-start gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- see file header */}
              <img
                src="/art/_contact-sheet.jpg"
                alt="Auto-generated contact sheet of every distinct artwork slug + variant, labelled"
                style={{ width: 1100, maxWidth: "100%", height: "auto" }}
                className="border border-hairline"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="micro-label">
                _contact-sheet.jpg — auto-generated by scripts/artwork-prep.ts, every distinct slug+variant
              </figcaption>
            </figure>
          ) : null}

          <div className="flex flex-col">
            {PLACEMENT_ORDER.map((placementId) => {
              const meta = PLACEMENT_META[placementId];
              const files = artBuild.groups.get(placementId) ?? [];
              const slug = files[0]?.slug;
              const subject = slug ? mastersBySlug.get(slug)?.subject : undefined;
              return (
                <PlacementGroup
                  key={placementId}
                  placementId={placementId}
                  meta={meta}
                  files={files}
                  blockedReason={blockedByLabel.get(placementId)}
                  masterSubject={subject}
                />
              );
            })}
          </div>

          {spareGroups.length > 0 ? (
            <div className="flex flex-col gap-6 border-t border-dashed border-hairline pt-8">
              <MicroLabel as="p">Alternates / spares generated by the prep script</MicroLabel>
              <div className="flex flex-wrap items-end gap-8">
                {spareGroups.map((g) => {
                  const slug = g.files[0]?.slug;
                  const subject = slug ? mastersBySlug.get(slug)?.subject : undefined;
                  return <ArtFigure key={g.label} files={g.files} widthPx={g.meta.widthPx} subject={subject} />;
                })}
              </div>
            </div>
          ) : null}

          {artBuild.unclassified.length > 0 ? (
            <div className="flex flex-col gap-4 border-t border-dashed border-hairline pt-8">
              <MicroLabel as="p">Unclassified — legacy or unrecognized filename</MicroLabel>
              <p className="text-data text-fg-meta max-w-[70ch]">
                Present under public/art/ but not matched to any of the 15 placements above — most likely a
                retiring AsciiCanvas-pipeline asset (D5, uninvested but not deleted) or a new file whose name
                doesn&apos;t carry a recognizable slug/variant. Nothing here is dropped.
              </p>
              <div className="flex flex-wrap items-end gap-6">
                {artBuild.unclassified.map((asset) => (
                  <figure key={asset.filename} className="flex flex-col items-start gap-2" style={{ width: 260 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- see file header */}
                    <img
                      src={asset.href}
                      alt={`${asset.filename} — unclassified file in public/art`}
                      style={{ width: 260, maxWidth: "100%", height: "auto" }}
                      className="border border-hairline"
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption className="micro-label">
                      {asset.filename} ·{" "}
                      {asset.width && asset.height ? `${asset.width}×${asset.height}` : (asset.dimError ?? "dims unavailable")}{" "}
                      · {formatBytes(asset.bytes)}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── 02 — Brand chip marquee ─────────────────────────────────────────── */}
      <section aria-labelledby="art-chips" className="section-pad-tight border-t border-hairline">
        <div className="container-wide flex flex-col gap-8">
          <SectionHead
            id="art-chips"
            index="02"
            title="Brand chip marquee (16 expected)"
            meta={`${logoAssets.length} of 16 expected chip file(s) found under public/logos/. Shown at their real 52px marquee height, on paper and on dark, so knockout and optical evenness can be judged.`}
          />
        </div>
        {logoAssets.length > 0 ? (
          <>
            <ChipRow assets={logoAssets} ground="surface-paper" groundLabel="On paper ground" />
            <ChipRow assets={logoAssets} ground="surface-dark" groundLabel="On dark ground" />
          </>
        ) : (
          <div className="container-wide py-4">
            <EmptySlot widthPx={480} aspectClass="aspect-[3/1]" reason="public/logos/ is empty — chip prep has not landed yet" />
          </div>
        )}
      </section>

      {/* ── 03 — Header lockups ─────────────────────────────────────────────── */}
      <section aria-labelledby="art-lockups" className="section-pad-tight border-t border-hairline">
        <div className="container-wide flex flex-col gap-8">
          <SectionHead
            id="art-lockups"
            index="03"
            title="Header lockups (D1)"
            meta="Both theme-matched KW COMMERCIAL / THE HOKUTEN GROUP lockups, at their real 44px render height, on paper and on dark."
          />
          <div className="flex flex-col gap-8">
            <div className="surface-paper flex flex-wrap items-end gap-10 border border-hairline p-6">
              <p className="micro-label w-full">On paper ground</p>
              {lockups.map((l) => (
                <PictureFigure key={l.key} asset={l} cssHeight={44} />
              ))}
            </div>
            <div className="surface-dark flex flex-wrap items-end gap-10 p-6">
              <p className="micro-label w-full">On dark ground</p>
              {lockups.map((l) => (
                <PictureFigure key={l.key} asset={l} cssHeight={44} />
              ))}
            </div>
          </div>
          {hasIdentitySheet ? (
            <figure className="flex flex-col items-start gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- see file header */}
              <img
                src="/brand/_identity-sheet.jpg"
                alt="Auto-generated identity contact sheet: lockups on light and dark grounds, CoStar badges"
                style={{ width: 1100, maxWidth: "100%", height: "auto" }}
                className="border border-hairline"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="micro-label">
                _identity-sheet.jpg — auto-generated by scripts/identity-prep.ts
              </figcaption>
            </figure>
          ) : null}
        </div>
      </section>

      {/* ── 04 — CoStar badges ──────────────────────────────────────────────── */}
      <section aria-labelledby="art-badges" className="section-pad-tight border-t border-hairline">
        <div className="container-wide flex flex-col gap-8">
          <SectionHead
            id="art-badges"
            index="04"
            title="CoStar badges (D3)"
            meta="The five CoStar Power Broker / Annual badges, at their real 40px render height."
          />
          <div className="surface-card flex flex-wrap items-end gap-10 border border-hairline p-6">
            {badges.map((b) => (
              <PictureFigure key={b.key} asset={b} cssHeight={40} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 — KanjiAccent motif ──────────────────────────────────────────── */}
      <section aria-labelledby="art-kanji" className="section-pad-tight border-t border-hairline">
        <div className="container-wide flex flex-col gap-8">
          <SectionHead
            id="art-kanji"
            index="05"
            title="<KanjiAccent> motif"
            meta="The reusable 北天 background motif (D5). Opacity is auto-detected from the ambient .surface-* scope — no prop needed to switch it."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="surface-paper relative isolate h-64 overflow-hidden border border-hairline">
              <KanjiAccent />
              <p className="relative z-10 micro-label p-4">On light surface (--kanji-opacity-light)</p>
            </div>
            <div className="surface-dark relative isolate h-64 overflow-hidden border border-hairline">
              <KanjiAccent />
              <p className="relative z-10 micro-label p-4">On dark surface (--kanji-opacity-dark)</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 — Still needed from Razim ────────────────────────────────────── */}
      <section aria-labelledby="art-needed" className="section-pad-tight border-t border-hairline pb-16">
        <div className="container-wide flex flex-col gap-6">
          <SectionHead
            id="art-needed"
            index="06"
            title="Still needed from Razim"
            meta="Cross-checked live against disk on every request — an item flips to DELIVERED the moment the matching file lands, no edit required here."
          />
          <ul className="flex flex-col">
            {stillNeeded.map((item) => (
              <li
                key={item.label}
                className="flex flex-col gap-1 border-t border-hairline py-3 first:border-t-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <span className="text-data">{item.label}</span>
                <span
                  className={cn(
                    "micro-label whitespace-nowrap",
                    item.resolved ? "text-fg-meta" : "text-brick",
                  )}
                >
                  {item.resolved ? "[ DELIVERED ]" : "[ NEEDED ]"} — {item.note}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
