import type { ClientBrandColorId } from "@/lib/client-brand-colors";
import { palette, portraitAccents } from "@/lib/colors";

/**
 * Portfolio content model.
 *
 * Hierarchy:
 *   CaseStudy
 *     └─ sections[]  (ordered, freely interleaved)
 *          ├─ ProseSection   — original writing (heading + body)
 *          └─ CraftVignette  — key image + tags + images with captions
 *
 * Site-wide copy (meta, nav, home, about, contact) lives in `site.ts`.
 *
 * A vignette belongs to exactly one case study. Craft tags are free-form
 * strings; the Craft page filter set is derived from the union of all tags
 * actually used across vignettes.
 *
 * Every gallery frame — image or Vimeo video — is either 9×16 portrait or 16×9
 * landscape. Visuals are placeholder accent fills today — swap `accent`/`src` or
 * add `vimeo` for real media without changing the shape of this model.
 */

export type AccentKey = keyof typeof palette;

/** Every portfolio frame is portrait (9×16), landscape (16×9), or square (1×1). */
export type ImageRatio = "9x16" | "16x9" | "1x1";

/** Back-compat alias — the key image uses the same ratio set. */
export type KeyImageRatio = ImageRatio;

/** Reverse-out ground for a single frame. Defaults to a seeded pseudo-random pick. */
export type FrameSurface = "light" | "dark";

/** Filmstrip panel ground — maps to theme tokens in VignetteChapter. */
export type PanelBg =
  | "default"
  | "secondary"
  | "tertiary"
  | ClientBrandColorId
  /** @deprecated Use `cruise-primary` */
  | "brand";

/**
 * Panel width in grid columns. `desktop` counts out of the 12-column desktop grid;
 * `mobile` out of the 6-column mobile grid. Omit on a panel to fall back to the
 * ratio-based default (frames) or the title-panel default (title panel).
 */
export type PanelWidth = { desktop: number; mobile: number };

/**
 * One frame in a vignette's horizontal chapter.
 *
 * A frame is either a *media* frame (image / gif via `src`, or Vimeo via `vimeo`)
 * or a *color-field* frame (`colorField: true`) where type carries the beat and
 * the accent is the ground. Either way it can hold a narrative beat: a `label`
 * (mono-caps kicker, e.g. "The problem") plus `body` prose tied to this frame.
 * Optional `panelBg` sets the filmstrip ground; the trail panel inherits the last frame.
 */
export type VignetteImage = {
  /** Portrait (9×16), landscape (16×9), or square (1×1). */
  ratio: ImageRatio;
  /** Placeholder fill until a real source is provided; also the color-field ground. */
  accent: AccentKey;
  /** Optional real image / gif source (overrides the placeholder fill). */
  src?: string;
  /**
   * Multiple image sources for this frame. One entry behaves like a static
   * image (same as `src`); two or more render a lightweight in-panel carousel
   * (dots + hover arrows). Takes precedence over `src` when non-empty.
   */
  sources?: string[];
  /**
   * Auto-advance delay in milliseconds for a multi-source carousel. Omit to use
   * the default cadence; set to 0 to disable autoplay for this frame. Autoplay
   * pauses on hover/focus and is skipped when the viewer prefers reduced motion.
   */
  autoplayMs?: number;
  /** Vimeo video ID or full vimeo.com URL — renders a player instead of an image. */
  vimeo?: string;
  /** Borderless looping embed (no player chrome) instead of interactive controls. */
  vimeoBackground?: boolean;
  /** Still shown behind Vimeo until the player is ready; also used on inactive panels. */
  poster?: string;
  /** Render as a type-driven color field instead of media. */
  colorField?: boolean;
  /** Beat kicker (mono caps), e.g. "The problem". */
  label?: string;
  /** Beat narrative — prose married to this frame. */
  body?: string;
  /** Reverse-out ground; omit to let the chapter pick a random-feeling surface. */
  surface?: FrameSurface;
  /** Filmstrip panel ground; omit for chapter default. Trail inherits the last frame. */
  panelBg?: PanelBg;
  /** Panel width in grid columns; omit to use the ratio-based default. */
  width?: PanelWidth;
  caption?: string;
  /**
   * Oversized quantified-impact figure (e.g. ">20%"). Presence turns the frame
   * into a *stat panel*: `label` kicker on top, `body` prose as supporting lede,
   * and this figure locked huge to the footer (`.display-metric`). Type-as-graphic.
   */
  stat?: string;
  /**
   * Verbatim pull-quote as a proof point. Presence turns the frame into a
   * *quote panel*: optional `label` kicker on top, this quote set large as the
   * hero, and `quoteCite` locked to the footer as attribution. The pull-quote
   * sibling of the stat panel — evidence in the subject's own words. Pass the
   * quote text *without* surrounding quotation marks; the panel supplies its own.
   */
  quote?: string;
  /** Attribution for a `quote` panel, e.g. "Advisor · T2 usability study". */
  quoteCite?: string;
};

export type CraftVignette = {
  type: "vignette";
  /** Unique across the whole site — powers /craft/[vignette]. */
  slug: string;
  name: string;
  /**
   * Key-image shape — portrait (9×16), landscape (16×9), or square (1×1).
   * Drives the `/craft` index card thumbnail.
   */
  keyImageRatio: ImageRatio;
  /** Placeholder key-image fill until a real source is provided. */
  keyImageAccent: AccentKey;
  /** Key-image / thumbnail source; also the `/craft` card thumbnail. */
  keyImageSrc?: string;
  /** Free-form, ~1–3 words each, unlimited. */
  tags: string[];
  /** Thematic line, e.g. "Context gain / semantic legibility / color as meaning". */
  themeLine?: string;
  /** Honest shipping status, e.g. "Never shipped — Figma prototypes exist". */
  status?: string;
  /** Opener panel width in grid columns; omit to use the title-panel default. */
  titlePanelWidth?: PanelWidth;
  /**
   * Title-panel storytelling treatment (opener). Omit for the plain dark panel.
   * `color` = accent color field + oversized chapter number.
   * `cover` = full-bleed `keyImageSrc` with the number/title/tags overlaid.
   */
  titleTreatment?: "color" | "cover";
  /** `cover` only — Gaussian blur radius (px) on the photo. Omit/0 for a sharp image. */
  titleCoverBlur?: number;
  /** `cover` only — photo opacity, 0–1 (screens it back over black). Omit = fully opaque. */
  titleCoverAlpha?: number;
  images: VignetteImage[];
};

/**
 * How a prose section allocates the master grid. Omit for the default `lede`
 * split. Every variant lives on the same 12-column ruled grid and reuses the
 * site type tokens — the layout changes, the vocabulary doesn't.
 */
export type ProseVariant =
  /** Heading cols 1–4 · body cols 5–12. Connective glue between vignettes. */
  | "lede"
  /** One large single-measure line, no heading rail — a thesis / turning point. */
  | "statement"
  /** Full-width heading · body flowing across two columns — dense backstory. */
  | "columns"
  /** Oversized pull-quote + mono attribution — grounds the story in a real voice. */
  | "epigraph"
  /** Narrow mono-caps fact rail + body — annotated context (who / when / constraint). */
  | "meta"
  /** Oversized `display-metric` figure + supporting prose — land a number. */
  | "figure"
  /** Media beside prose — a visual the copy explains. */
  | "media"
  /** Full-measure media band + a centered caption beneath — a visual explainer. */
  | "media-band";

/** One row in a `meta`-variant context rail. */
export type ProseMetaRow = { label: string; value: string };

/** Figure for the `media` / `media-band` prose variants. */
export type ProseMedia = {
  /** Image / gif source. Use this OR `vimeo`; omit both for a placeholder ground. */
  src?: string;
  /** Vimeo id or URL — rendered as a borderless background loop. */
  vimeo?: string;
  /** Still shown behind Vimeo until the player is ready. */
  poster?: string;
  /** Frame shape for Vimeo embeds and placeholder grounds. Ignored for `src` images. */
  ratio?: ImageRatio;
  caption?: string;
  /** Alt text for image sources; falls back to the caption. */
  alt?: string;
  /** Placeholder ground when no real source is provided. */
  accent?: AccentKey;
};

export type ProseSection = {
  type: "prose";
  id: string;
  /** Layout treatment; omit for the default `lede` split. */
  variant?: ProseVariant;
  heading?: string;
  /** A paragraph or two — split on blank lines for multiple paragraphs. */
  body: string;
  /** `epigraph` — attribution under the quote (e.g. "Kyle Vogt, CEO"). */
  attribution?: string;
  /** `figure` — oversized quantified figure locked huge (e.g. ">20%"). */
  stat?: string;
  /** `meta` — fact rows for the narrow context rail. */
  meta?: ProseMetaRow[];
  /** `media` / `media-band` — the figure the prose is built around. */
  media?: ProseMedia;
};

/** Variant-specific extras a prose helper can forward onto its section. */
export type ProseExtras = Omit<
  ProseSection,
  "type" | "id" | "heading" | "body"
>;

export type CaseStudySection = ProseSection | CraftVignette;

/** Optional looping MP4 behind the case study hero (Vercel Blob or CDN). */
export type CaseStudyHeroVideo = {
  /** Direct MP4 source (e.g. Vercel Blob). Use this OR `vimeo`. */
  src?: string;
  /** Vimeo video id or URL — rendered as a borderless background loop. */
  vimeo?: string;
  /** Layer opacity, 0–1. Default 0.3 in the hero component. */
  opacity?: number;
  poster?: string;
};

/** Bright index-slide field + floating transparent logo (gif preferred). */
export type CaseStudyBrand = {
  /** Client brand color — resolved via `clientBrandColorVar()` in the brand field. */
  field: ClientBrandColorId;
  /** Transparent logo asset — gif or png with alpha. */
  logo?: string;
};

export type CaseStudy = {
  slug: string;
  name: string;
  /**
   * Hidden from the public site until the visitor unlocks gated content for the
   * session (via `?p=true`). Its vignettes inherit the gate. See `src/lib/gate.ts`.
   */
  gated?: boolean;
  /**
   * A content container, not a published case study — its vignettes still
   * surface on /craft, but the study itself is excluded from the case-studies
   * index and its own /case-studies/[slug] page 404s. Use for credential-style
   * work that's one or two vignettes, not a full narrative arc.
   */
  standalone?: boolean;
  /** One-line deck under the hero title. */
  subhead: string;
  /** Display date, e.g. "2024" or "Mar 2024". */
  date: string;
  client: string;
  location: string;
  role: string;
  tools: string;
  /** Placeholder client logo source; falls back to a wordmark when absent. */
  clientLogo?: string;
  /** Index slide — bright field + floating brand logo. */
  brand: CaseStudyBrand;
  /**
   * Optional ambient hero reel — autoplay loop, no controls, full-bleed behind #cs-hero.
   * Upload MP4 to Vercel Blob (public), then e.g.
   * `heroVideo: { src: "https://….public.blob.vercel-storage.com/hero.mp4", opacity: 0.3 }`
   */
  heroVideo?: CaseStudyHeroVideo;
  /** Ordered mix of prose sections and craft vignettes. */
  sections: CaseStudySection[];
};

/**
 * Default vignette opener-panel width — 8 of 12 cols on desktop, full-bleed on
 * mobile. Runs wide (like the stat panel) so the oversized `.display-2xl` chapter
 * title dominates without long words clipping the panel seam.
 */
const TITLE_PANEL_WIDTH = { desktop: 8, mobile: 6 } as const satisfies PanelWidth;

/** Default filmstrip width per aspect ratio — matches `panelColSpan` in vignette-chapter. */
const RATIO_PANEL_WIDTH = {
  "16x9": { desktop: 12, mobile: 6 },
  "1x1": { desktop: 8, mobile: 6 },
  "9x16": { desktop: 6, mobile: 6 },
} as const satisfies Record<ImageRatio, PanelWidth>;

/* ── Cruise content helpers (beats + glue prose) ───────────────── */
const cruiseAccent = "charcoal" as const satisfies AccentKey;

/**
 * A color-field text beat. Always spans the "field" column width and has no
 * media box, so it carries no author-facing aspect ratio — `ratio` is set to a
 * fixed inert value only to satisfy the shared `VignetteImage` shape.
 */
function cruiseBeat(
  label: string,
  body: string,
  panelBg?: PanelBg,
): VignetteImage {
  return {
    ratio: "16x9",
    accent: cruiseAccent,
    colorField: true,
    label,
    body,
    ...(panelBg ? { panelBg } : {}),
  };
}

function cruiseMedia(
  label: string,
  caption: string,
  ratio: ImageRatio = "16x9",
  media?:
    | string
    | Pick<
        VignetteImage,
        "src" | "sources" | "autoplayMs" | "vimeo" | "vimeoBackground" | "poster"
      >,
  panelBg?: PanelBg,
): VignetteImage {
  const mediaFields =
    typeof media === "string" ? { src: media } : (media ?? {});

  return {
    ratio,
    accent: cruiseAccent,
    label,
    caption,
    ...mediaFields,
    ...(panelBg ? { panelBg } : {}),
  };
}

function cruiseStat(
  label: string,
  stat: string,
  body: string,
  ratio: ImageRatio = "16x9",
  panelBg?: PanelBg,
): VignetteImage {
  return {
    ratio,
    accent: cruiseAccent,
    label,
    stat,
    body,
    width: RATIO_PANEL_WIDTH[ratio],
    ...(panelBg ? { panelBg } : {}),
  };
}

/**
 * A pull-quote proof-point panel — the testimonial sibling of `cruiseStat`.
 * `label` is the kicker, `quote` the verbatim hero line (no surrounding quote
 * marks — the panel adds its own), `cite` the footer attribution. Defaults to a
 * square (`1x1`) block, which reads best for a testimonial.
 */
function cruiseQuote(
  label: string,
  quote: string,
  cite?: string,
  ratio: ImageRatio = "1x1",
  panelBg?: PanelBg,
): VignetteImage {
  return {
    ratio,
    accent: cruiseAccent,
    label,
    quote,
    ...(cite ? { quoteCite: cite } : {}),
    width: RATIO_PANEL_WIDTH[ratio],
    ...(panelBg ? { panelBg } : {}),
  };
}

type VignetteTitlePanel = Pick<
  CraftVignette,
  "titleTreatment" | "keyImageSrc" | "titleCoverBlur" | "titleCoverAlpha"
>;

function cruiseVignette(
  slug: string,
  name: string,
  tags: string[],
  themeLine: string,
  images: VignetteImage[],
  keyImageRatio: ImageRatio = "16x9",
  titlePanel?: VignetteTitlePanel,
): CraftVignette {
  return {
    type: "vignette",
    slug,
    name,
    keyImageRatio,
    keyImageAccent: cruiseAccent,
    tags,
    themeLine,
    titlePanelWidth: TITLE_PANEL_WIDTH,
    images,
    ...titlePanel,
  };
}

function cruiseProse(
  id: string,
  heading: string,
  body: string,
  extras?: ProseExtras,
): ProseSection {
  return { type: "prose", id, heading, body, ...extras };
}

/* ── Google content helpers (beats + glue prose) ───────────────── */
const googleAccent = "royalBlue" as const satisfies AccentKey;

function googleBeat(
  label: string,
  body: string,
  ratio: ImageRatio = "16x9",
  panelBg?: PanelBg,
): VignetteImage {
  return {
    ratio,
    accent: googleAccent,
    colorField: true,
    label,
    body,
    ...(panelBg ? { panelBg } : {}),
  };
}

function googleMedia(
  label: string,
  caption: string,
  ratio: ImageRatio = "16x9",
  media?:
    | string
    | Pick<
        VignetteImage,
        "src" | "sources" | "autoplayMs" | "vimeo" | "vimeoBackground" | "poster"
      >,
  panelBg?: PanelBg,
): VignetteImage {
  const mediaFields =
    typeof media === "string" ? { src: media } : (media ?? {});

  return {
    ratio,
    accent: googleAccent,
    label,
    caption,
    ...mediaFields,
    ...(panelBg ? { panelBg } : {}),
  };
}

function googleVignette(
  slug: string,
  name: string,
  tags: string[],
  themeLine: string,
  images: VignetteImage[],
  keyImageRatio: ImageRatio = "16x9",
  status?: string,
): CraftVignette {
  return {
    type: "vignette",
    slug,
    name,
    keyImageRatio,
    keyImageAccent: googleAccent,
    tags,
    themeLine,
    ...(status ? { status } : {}),
    titlePanelWidth: TITLE_PANEL_WIDTH,
    images,
  };
}

function googleProse(
  id: string,
  heading: string,
  body: string,
  extras?: ProseExtras,
): ProseSection {
  return { type: "prose", id, heading, body, ...extras };
}

/* ── Pearson content helpers (beats + glue prose) ──────────────── */
const pearsonAccent = "hotPink" as const satisfies AccentKey;

function pearsonBeat(
  label: string,
  body: string,
  ratio: ImageRatio = "16x9",
  panelBg?: PanelBg,
): VignetteImage {
  return {
    ratio,
    accent: pearsonAccent,
    colorField: true,
    label,
    body,
    ...(panelBg ? { panelBg } : {}),
  };
}

function pearsonMedia(
  label: string,
  caption: string,
  ratio: ImageRatio = "16x9",
  media?:
    | string
    | Pick<
        VignetteImage,
        "src" | "sources" | "autoplayMs" | "vimeo" | "vimeoBackground" | "poster"
      >,
  panelBg?: PanelBg,
): VignetteImage {
  const mediaFields =
    typeof media === "string" ? { src: media } : (media ?? {});

  return {
    ratio,
    accent: pearsonAccent,
    label,
    caption,
    ...mediaFields,
    ...(panelBg ? { panelBg } : {}),
  };
}

function pearsonVignette(
  slug: string,
  name: string,
  tags: string[],
  themeLine: string,
  images: VignetteImage[],
  keyImageRatio: ImageRatio = "16x9",
  status?: string,
): CraftVignette {
  return {
    type: "vignette",
    slug,
    name,
    keyImageRatio,
    keyImageAccent: pearsonAccent,
    tags,
    themeLine,
    ...(status ? { status } : {}),
    titlePanelWidth: TITLE_PANEL_WIDTH,
    images,
  };
}

function pearsonProse(
  id: string,
  heading: string,
  body: string,
  extras?: ProseExtras,
): ProseSection {
  return { type: "prose", id, heading, body, ...extras };
}

/* ── McKinsey content helpers (beats + glue prose) ─────────────── */
const mckinseyAccent = "mediumBlue" as const satisfies AccentKey;

function mckinseyBeat(
  label: string,
  body: string,
  ratio: ImageRatio = "16x9",
  panelBg?: PanelBg,
): VignetteImage {
  return {
    ratio,
    accent: mckinseyAccent,
    colorField: true,
    label,
    body,
    ...(panelBg ? { panelBg } : {}),
  };
}

function mckinseyMedia(
  label: string,
  caption: string,
  ratio: ImageRatio = "16x9",
  media?:
    | string
    | Pick<
        VignetteImage,
        "src" | "sources" | "autoplayMs" | "vimeo" | "vimeoBackground" | "poster"
      >,
  panelBg?: PanelBg,
): VignetteImage {
  const mediaFields =
    typeof media === "string" ? { src: media } : (media ?? {});

  return {
    ratio,
    accent: mckinseyAccent,
    label,
    caption,
    ...mediaFields,
    ...(panelBg ? { panelBg } : {}),
  };
}

function mckinseyStat(
  label: string,
  stat: string,
  body: string,
  ratio: ImageRatio = "16x9",
  panelBg?: PanelBg,
): VignetteImage {
  return {
    ratio,
    accent: mckinseyAccent,
    label,
    stat,
    body,
    width: RATIO_PANEL_WIDTH[ratio],
    ...(panelBg ? { panelBg } : {}),
  };
}

function mckinseyVignette(
  slug: string,
  name: string,
  tags: string[],
  themeLine: string,
  images: VignetteImage[],
  keyImageRatio: ImageRatio = "16x9",
  status?: string,
): CraftVignette {
  return {
    type: "vignette",
    slug,
    name,
    keyImageRatio,
    keyImageAccent: mckinseyAccent,
    tags,
    themeLine,
    ...(status ? { status } : {}),
    titlePanelWidth: TITLE_PANEL_WIDTH,
    images,
  };
}

// Note: no mckinseyProse — this is a standalone vignette container, no
// connective narrative between entries.

/* ── Facebook content helpers (beats + glue prose) ──────────────── */
const facebookAccent = "neonLime" as const satisfies AccentKey;

function facebookBeat(
  label: string,
  body: string,
  ratio: ImageRatio = "16x9",
  panelBg?: PanelBg,
): VignetteImage {
  return {
    ratio,
    accent: facebookAccent,
    colorField: true,
    label,
    body,
    ...(panelBg ? { panelBg } : {}),
  };
}

function facebookMedia(
  label: string,
  caption: string,
  ratio: ImageRatio = "16x9",
  media?:
    | string
    | Pick<
        VignetteImage,
        "src" | "sources" | "autoplayMs" | "vimeo" | "vimeoBackground" | "poster"
      >,
  panelBg?: PanelBg,
): VignetteImage {
  const mediaFields =
    typeof media === "string" ? { src: media } : (media ?? {});

  return {
    ratio,
    accent: facebookAccent,
    label,
    caption,
    ...mediaFields,
    ...(panelBg ? { panelBg } : {}),
  };
}

function facebookVignette(
  slug: string,
  name: string,
  tags: string[],
  themeLine: string,
  images: VignetteImage[],
  keyImageRatio: ImageRatio = "16x9",
  status?: string,
): CraftVignette {
  return {
    type: "vignette",
    slug,
    name,
    keyImageRatio,
    keyImageAccent: facebookAccent,
    tags,
    themeLine,
    ...(status ? { status } : {}),
    titlePanelWidth: TITLE_PANEL_WIDTH,
    images,
  };
}

// Note: no facebookProse — this is a standalone vignette container, no
// connective narrative between entries.

export const caseStudies: CaseStudy[] = [
  {
    slug: "pearson",
    gated: true,
    name: "The Nebula Design System",
    subhead:
      "Building an AI-native design system from tokens to a natural-language prototyping pipeline.",
    date: "2025–present",
    client: "Pearson",
    brand: {
      field: "pearson-primary",
      logo: "/portfolio/logos/pearson.gif",
    },
    location: "Remote",
    role: "Visual Design Director",
    tools: "Figma, Storybook, React, Cursor, Figma MCP",
    clientLogo: "/portfolio/logos/pearson.svg",
    sections: [
      pearsonProse(
        "pearson-intro",
        "The land and expand",
        "I was hired as Visual Design Director — a title I don't fully believe in. The split most large companies draw between \"UX designer\" and \"visual designer\" (UX does wireframes, hands off to visual) produces weaker outcomes than a full-stack model where designers own a problem end to end. I took the role anyway, on the strength of a manager I'd worked with before and recognized as a visionary, herself new to Pearson and building a new culture.\n\nFrom day one the stance was explicit: the title didn't matter; building a team of builders did — a team that would own the design system outright, own the quality bar, and set the standard for modern UI across Pearson Higher Ed. Credibility was built incrementally, not claimed. Land a small proof point, use it to expand scope, use scope to develop people, use developed people to deliver the next proof point. Land and expand — applied to the mandate and the team at once.",
      ),
      pearsonVignette(
        "nebula-design-system",
        "Nebula — Design System + AI-Native Prototyping Kit",
        ["Design systems", "AI-native design", "Leadership"],
        "Design systems as infrastructure / AI-native design workflows / executive buy-in",
        [
          pearsonBeat(
            "Starting point",
            "No design system existed. My belief: a design system is infrastructure — as fundamental as electricity. The org ran old-school UX (wireframes) handed to separate visual designers, with no systematized component library.",
          ),
          pearsonBeat(
            "Conceptual direction + buy-in",
            "Began with conceptual work — not coloring in wireframes, but deciding visual direction: density, elevation, glass, how a recent rebrand's colors and illustrations become a coherent system. Built a presentation and sold the direction to a C-level executive — redefining the role from \"makes things pretty\" to running a studio function.",
            "1x1",
          ),
          pearsonMedia(
            "Proving the pipeline",
            "Q1: brought in creative technologists with a deliberately small OKR — get something, anything, from Figma into Storybook end to end, navigating real enterprise permissions friction. Q2: built it out at scale on Pearson Learning Studio — atoms through complex AI organisms, reaching ~80% desktop coverage.",
            "16x9",
          ),
          pearsonBeat(
            "Shipping as real infrastructure",
            "The component library shipped as an installable npm package. Engineers consume it via props — they don't re-engineer components, they implement what's delivered. That was the unlock moving Nebula from \"Figma files\" to code living in production.",
            "9x16",
          ),
          pearsonBeat(
            "Solving Cursor hallucination",
            "Could designers prototype in natural language via Cursor, pulling from the real Nebula package? Not without help — even pointed at the package, Cursor generated generic \"Tailwind slop\" rather than mapping intent to existing components, with no efficient way to search the package.",
            "1x1",
          ),
          pearsonMedia(
            "The unlock — two markdowns as guardrails",
            "A design-philosophy markdown encoding Nebula's theory (density, color, nesting, elevation) and a component-mapping markdown telling Cursor to check the map before generating. Together with the React library, these became a custom Cursor skill — a slash command that spins up a new, on-system prototype, alive from the first second.",
            "16x9",
          ),
          pearsonBeat(
            "The demo",
            "A new prototype launches already reactive — adaptive navigation, light/dark toggle, a working grid, sample components — pulling live from the latest Nebula repo. 100% demoable: blank desktop to a fully realized, on-brand interface in seconds, using nothing but natural language.",
          ),
        ],
        "16x9",
      ),
      pearsonVignette(
        "nebula-tokens",
        "Nebula — Tokens (Craft Series, Part 1)",
        ["Design systems", "Visual design"],
        "Token theory / typographic baseline grids / extending a narrow brand into a full system",
        [
          pearsonBeat(
            "Not a blank canvas",
            "Two starting points shaped the work. My Google background gave a material-centric model for token theory and atomic composition. And Pearson already had an abandoned, poorly-constructed design system — wonky accessibility, inconsistent spacing — a useful \"here's what not to do\" reference.",
          ),
          pearsonBeat(
            "Building the baseline grid",
            "Started with the typographic baseline grid — the foundation everything aligns to. Generated a type ramp with an open-source type-scale tool, then ran spikes to ensure the grid aligned across small/medium/large variants of buttons, chips, and form fields simultaneously.",
            "1x1",
          ),
          pearsonBeat(
            "Pragmatic font choices",
            "Plus Jakarta Sans (the corporate font) doesn't hold up for body copy at small sizes. So: Plus Jakarta Sans for headlines and impact, Noto Sans for body readability, Roboto Mono for code. Spend the brand's visual equity where it's felt; use proven defaults where the job is just to work.",
            "9x16",
          ),
          pearsonMedia(
            "Color — narrow brand into a full system",
            "Pearson's palette is narrow — pink and purple, \"cotton candy.\" A system needs more: semantic colors (error/success/warning), full primary chroma ramps, and a tertiary palette for data visualization and chips. Ran brand and semantic keys through a Figma ramp generator; every ramp passed contrast and usability testing.",
            "16x9",
          ),
          pearsonBeat(
            "Spacing and geometry",
            "Spacing and corner-radius tokens on a base-8 grid — a carryover from Material fluency, chosen because it's mathematically clean and scales predictably across component sizes.",
          ),
        ],
        "16x9",
      ),
      pearsonVignette(
        "learning-loop-organisms",
        "Nebula — Opinionated Organisms: The Learning Loop (Part 2)",
        ["Design systems", "Visual design", "Strategy"],
        "Opinionated organisms / composition over primitives / adoption by design",
        [
          pearsonBeat(
            "The lesson from failure",
            "The abandoned system hadn't just been poorly built — it had been poorly adopted. Where teams used it, they used it badly: components dropped on screens with no hierarchy, no sense of how to nest into coherent structures. Like dumping Legos on a table with no instruction manual.",
          ),
          pearsonBeat(
            "The decision",
            "Don't just deliver primitives and hope. Build the standard atomic layer — buttons, fields, progress, cards, lists, tabs — but go further: deliver highly opinionated higher-order organisms, encoded directly in the React library, not just documented as patterns.",
            "1x1",
          ),
          pearsonMedia(
            "The Learning Loop",
            "A core Pearson pedagogical pattern: a student works through a unit via a repeating loop — intro, readings, assessment, interleaved Socratic questioning, and a progress/celebration moment. Nebula delivers the whole sequence as a family of pre-built organisms: front-door, reading, assessment, progress/celebration, and wrap-up cards.",
            "16x9",
          ),
          pearsonBeat(
            "Configurable within rails",
            "Each organism is composed of system atoms and molecules, but composition, hierarchy, and visual rhythm are fixed by design — configurable within rails, but the rails are real. Even a team with no visual-design expertise produces something considered, because the considered version is what they're given.",
            "9x16",
          ),
          pearsonBeat(
            "Rollout status",
            "Piloted on Pearson Learning Studio; now beginning rollout across two more product lines — MXL and Pearson+. The live test of durability: do these opinionated patterns hold across contexts, or need to flex more than anticipated? Actively being answered.",
          ),
        ],
        "16x9",
        "Piloted on Learning Studio; rolling out to MXL and Pearson+.",
      ),
      pearsonProse(
        "pearson-system-to-ai",
        "From system to AI surface",
        "Tokens and organisms made Pearson's interfaces coherent. The next question was harder: how does AI live inside them — not as a feature bolted onto a page, but as a pattern every page archetype can plug into, at any intensity?",
      ),
      pearsonVignette(
        "ai-pattern-language",
        "Nebula — AI Design Pattern Language",
        ["AI-native design", "Information architecture", "Visual design"],
        "AI-native design systems / navigation architecture as values statement / brand-rooted visual language",
        [
          pearsonBeat(
            "The foundational challenge",
            "Design a navigation and layout schema that could gracefully incorporate AI affordances — at any intensity, of any type — from any page archetype across Pearson's higher-ed platforms: dashboards, learning canvases, e-texts, assignments, quizzes. A system every page could plug into.",
          ),
          pearsonBeat(
            "Three-tier AI taxonomy",
            "Embedded — small, contextual inline markers; hover or click for a deeper dive. Assistive — a persistent docked chat rail for ongoing back-and-forth. Generative — a full conversational surface where the interaction is the interface.",
            "1x1",
          ),
          pearsonMedia(
            "One placement, a whole architecture",
            "A conversation with an AI assistant is primal — it matters to the user, in the moment, more than almost anything on screen. Putting it in a dismissible right panel signals the opposite. The judgment that chat belongs on the left, treated as primary, cascaded: launch affordance left, navigation consolidates left, the L-shaped frame collapses into a single left rail.",
            "16x9",
          ),
          pearsonBeat(
            "The resulting pattern",
            "A navigation rail with expanded and collapsed states. When the chatbot is active, navigation collapses into a dropdown and the chatbot takes the space — borrowing a mobile \"job done\" grammar so users persist their AI conversation while keeping full navigability.",
            "9x16",
          ),
          pearsonBeat(
            "Brand-rooted visual language",
            "Bolder than ChatGPT, more owned than borrowing Gemini wholesale. Synthesized stars (sparkle = AI) with Pearson's existing wave/ripple motifs into a vibrant gradient that reads AI-forward but still feels like Pearson's AI. Named \"AI Assistant\" — one name that works for both students and instructors.",
            "1x1",
          ),
          pearsonBeat(
            "The AI brand system",
            "A generic sparkle for simple callouts; an ownable AI Assistant logo across products; a rainbow gradient border that animates while the assistant is \"thinking\"; and small AI chips for inline enhancements. Used individually or combined — flexible, but a consistent \"AI lives here\" grammar across the family.",
          ),
        ],
        "16x9",
        "E-text squiggly-underline embedded tier in active design.",
      ),
      pearsonVignette(
        "learning-canvas",
        "The Learning Canvas — Page Layout + Card-Based Generative AI",
        ["AI-native design", "Interaction design", "Information architecture"],
        "Page archetype design / honest craft tension / interaction design as ongoing inquiry",
        [
          pearsonBeat(
            "The page archetype",
            "The Learning Loop doesn't exist in isolation — it lives on the Learning Canvas, a core page archetype. Three zones, left to right: chapters/table of contents (the navigational spine), the content stream (where the loop lives), and score and controls (a radial progress indicator plus next/previous).",
          ),
          pearsonBeat(
            "The transition problem",
            "The AI Assistant lives in a left sidebar. But on the Learning Canvas, generative AI content needs to appear in the center content stream. Running both at once felt like two products stitched together; jumping from sidebar conversation to embedded content was jarring.",
            "1x1",
          ),
          pearsonMedia(
            "The solution — and the tradeoff",
            "Added a chat input bar at the bottom of the content stream, like Gemini or Claude. But instead of an infinite growing feed, content is chunked into cards — a stack metaphor where each piece, textbook or AI-generated, is its own discrete card.",
            "16x9",
          ),
          pearsonBeat(
            "Why cards, not a feed",
            "Student testing showed that in long feeds, students lost track of where they were — scrolling back to find earlier content was hard. Cards solved wayfinding: each piece is a bounded, returnable unit. A secondary effect: the card stack felt tactile and lightly game-like, fitting for a college-age audience.",
            "9x16",
          ),
          pearsonBeat(
            "The honest, unresolved tension",
            "When a student asks the AI a question within a card, the answer is bound to that card — but the next card might be a follow-up to that question. A single continuous feed might read more naturally as a conversation; cards' wayfinding and tactile benefits came at the cost of a slightly awkward branching structure. A live design tension, not a solved one.",
          ),
        ],
        "16x9",
      ),
    ],
  },
  {
    slug: "cruise-teleops",
    name: "Autonomous Vehicle Tele-Operations",
    subhead:
      "Designing the human component of an autonomous fleet.",
    date: "2023-2025",
    client: "Cruise",
    brand: {
      field: "cruise-primary",
      logo: "/portfolio/logos/cruise.png",
    },
    location: "San Francisco, CA",
    role: "Sr. UX Design Manager",
    tools: "Figma, Storybook",
    heroVideo: {
      vimeo: "1207227235",
      opacity: 0.30,
    },
    sections: [
      cruiseProse(
        "cruise-intro",
        "Tick Tock",
        `Cruise's Terminal wasn't built for 500 driverless rides per day. It was built for driving at night, when the streets were empty, and there was no traffic to negotiate, and no police officers or emergency vehicles to manage. Terminal v1 was built to answer a core question, "can we get the remote Remote Advisor's's mental model of the scene to match ground truth?" Signal fidelity was the priority, which was reasonable for a fledgling program. Then the business needed to scale into real hours and real traffic on real streets, and the old model turned out to be solving the wrong problem. Signal fidelity didn't matter much if the vehicle was still sitting there ten minutes later. Our CEO, Kyle Vogt, put it this way: the risk of a Vehicle Recovery Event (a tow truck being sent to retrieve a failed AV in the field) grew exponentially with every second the vehicle stayed stuck. Time wasn't one factor among many; it was the factor.\n\nThe counterintuitive part was that the exact right trajectory mattered less than simply moving. A vehicle correcting itself as it gained forward motion read as competent, like it was working and on its way. A vehicle sitting dead still read as broken, like an inert two-ton lump of batteries and computers, to the rider inside and to everyone outside. Progress, not perfection, was the signal that mattered.\n\nThat reframing is the actual thesis behind everything below. Two numbers governed the redesign: time to first action (TTFA), meaning how fast an Remote Advisor could read a scene and issue any instruction at all, and time to resolution (TTR), meaning how fast the vehicle was back in autonomous mode with the Remote Advisor disconnected. Each vignette below is in service of one goal: get the car moving, now.`,
      ),
      cruiseProse(
        "cruise-context-shift",
        "The design problem, restated",
        "Once you accepted that the AV already knew more than it was showing Remote Advisorss, the design problem became about translating machine perception into human-readable meaning.",
        { variant: "statement" },
      ),
      cruiseVignette(
        "reading-the-scene",
        "Reading the Scene",
        ["Visual design", "Data visualization", "Interaction design", "Human factors", "Information architecture"],
        "Context gain / semantic legibility / vehicle intent / Remote Advisor handoff",
        [
          cruiseBeat(
            "The problem",
            "Remote Advisorss viewed the AV scene entirely in orange-on-black. Every object type, pedestrian, cyclist, vehicle, immovable obstacle, rendered identically. Legitimate human-factors science, but every object in the scene was visually equivalent.",
          ),
          cruiseMedia(
            "Before",
            "The legacy scene: a single orange encoding for every object type. Safe for the eyes, silent about meaning.",
            "1x1",
            {
              vimeo: "1205288733",
              vimeoBackground: true,
              poster: "/portfolio/cruise/Cruise_v1_before_poster.png",
            },
          ),
          cruiseBeat(
            "The insight",
            "The legacy system was informed by human factors but not by semantic color theory. Meanwhile, the AV's AI could already classify nearly everything it perceived, it just wasn't surfaced. The machine knew what was there, but the human didn't.",
          ),
          cruiseMedia(
            "The solution",
            "A semantic color + shape language applied to the tilemap where each object class received a distinct hue and a footprint shape mapped to its radar/lidar return.",
            "1x1",
            {
              sources: [
                "/portfolio/cruise/cruise_v1_c1.jpg",
                "/portfolio/cruise/cruise_v1_c2.jpg",
                "/portfolio/cruise/cruise_v1_c3.jpg",
                "/portfolio/cruise/cruise_v1_c4.jpg",
                "/portfolio/cruise/cruise_v1_c5.jpg",
                "/portfolio/cruise/cruise_v1_c6.jpg",
              ],
            },
          ),
          cruiseMedia(
            "In scene",
            "Pedestrians, cyclists, vehicles, and static objects read at a glance. The semantic meaning of the scene became immediately legible.",
            "16x9",
            "/portfolio/cruise/cruise_v1_full.jpg",
          ),
          cruiseBeat(
            "The next layer",
            "Color and shape solved what an object was. The next question was what the vehicle intended to do about it, a harder signal to surface. The AV is non-deterministic. A true ML ranker refreshing its decision-making potentially hundreds of times per second. When the vehicle decided what to do, it rendered for the Remote Advisor as a single-color path spline projecting 50 meters ahead. No speed intent. Unreliable stop point visualizations. Little scene context explaining why the vehicle was behaving the way it was.\n\nRemote Advisorss would watch the vehicle do anything, at any time, for any reason, and when it inexplicably stopped, they had no explanation and no obvious way to get it moving again.",
          ),
          cruiseMedia(
            "The constraint",
            "We couldn't guarantee decision persistence: no binding route, no guaranteed future intentions, no speed deltas.",
            "1x1",
            {
              vimeo: "1206793002",
              vimeoBackground: true,
              poster: "/portfolio/cruise/Cruise_v2_path_poster.jpg",
            },
          ),
          cruiseBeat(
            "The insight",
            "Even a coarse signal, stop or go, faster or slower, was dramatically more useful than nothing. And since we had speed deltas and the vehicle's perception of surrounding objects, we could build a scene that told a coherent story. So that if and when the vehicle stopped, the Remote Advisor already understood why.",
          ),
          cruiseMedia(
            "The solution",
            "We attacked the problem on three fronts. First, we color-coded the projected path (red/green) to communicate speed deltas and intent: slow, stop, go, so the path itself told a story. Second, we visualized the scene objects the vehicle was actually perceiving and responding to, so Remote Advisorss could see why the vehicle was behaving the way it was. Third, and most importantly for getting stuck vehicles moving again, we made stop points interactive. When a stop point appeared on the path, the Remote Advisor could lift it with a single click, signaling to the vehicle that it was safe to proceed. A police officer waving the car through a stop sign. A construction worker clearing an obstruction. Whatever the case: one click, car moves.",
            "1x1",
            {
              sources: [
                "/portfolio/cruise/Cruise_v2_c2.jpg",
                "/portfolio/cruise/Cruise_v2_c1.jpg",
                "/portfolio/cruise/Cruise_v2_c3.jpg",
                "/portfolio/cruise/Cruise_v2_c4.jpg",
                "/portfolio/cruise/Cruise_v2_c5.jpg",
                "/portfolio/cruise/Cruise_v2_c6.jpg",
                "/portfolio/cruise/Cruise_v2_c7.jpg",
              ],
            },
          ),
          cruiseBeat(
            "Outcome",
            "Remote Advisorss went from watching a black box to reading a scene. They understood why the vehicle stopped, and they had a discoverable, single-action control to get it moving again. The terminal became something Remote Advisorss could act on.",
          ),
          cruiseBeat(
            "One more gap",
            "Object classification and vehicle intent solved for what was happening on the map at the time, but Remote Advisorss gaining context after freshly connecting to an AV were starting from zero, context-blind to what had happened moments before they connected. There was so much context lost: what the previous Remote Advisor had done, what the vehicle had tried autonomously, why the car was stopped at all, etc.\n\nIn a safety-critical system, that cold start could mean the wrong action, or critical seconds spent by Remote Advisorss reconstructing a scene the vehicle already understood.",
          ),
          cruiseMedia(
            "The solution",
            "A coarse-grained event timeline, pulling from vehicle event APIs already exposed but never rendered, gave incoming Remote Advisorss a readable history: stops, collisions, overrides, course changes. Paired with a \"what is the vehicle dealing with\" panel: big icons, color-coded, with timers showing how long each condition had been active, plus the sequential steps to resolve it.",
            "1x1",
            {
              sources: [
                "/portfolio/cruise/Cruise_v3_c1.jpg",
                "/portfolio/cruise/Cruise_v3_c2.jpg",
                "/portfolio/cruise/Cruise_v3_c3.jpg",
                "/portfolio/cruise/Cruise_v3_c4.jpg",
                "/portfolio/cruise/Cruise_v3_c5.jpg",
              ],
            },
          ),
          cruiseStat(
            "Outcome",
            "~20%",
            "As a result of the improved context-awareness work, Remote Advisorss improved their time to first action (TTFA) by about twenty percent, with greater accuracy than before.",
            "1x1",
          ),
        ],
        "1x1",
        {
          titleTreatment: "cover",
          keyImageSrc: "/portfolio/cruise/Cruise_v1_cover.jpg",
          titleCoverBlur: 0,
          titleCoverAlpha: 0.7,
        },
      ),
      cruiseProse(
        "cruise-ecosystem",
        "The world around the Remote Advisor",
        "The Remote Advisor was never just a person alone with a screen. Remote Assistant Advisors worked inside a wider ecosystem: Customer Service handling the passenger, Subject-Matter Experts stepping in on the hardest scenes, Supervisors walking the floor, and the customer themselves, often just trying to understand why their ride had stopped. Each of these people had their own tools and their own partial view of the situation, and often no idea what the others could see. Designing the Terminal meant designing for that whole ecosystem, and it started with something as basic as where things lived on the Remote Advisor's's own screen.",
        { variant: "media-band", media: { src: "/portfolio/cruise/Cruise Current State 2.png"} },
      ),
      cruiseVignette(
        "designing-the-container",
        "Designing the Container",
        ["Information architecture", "Human factors", "Interaction design", "Research"],
        "Layout as cognitive aid / consumer patterns in a safety-critical context / designing for who actually shows up",
        [
          cruiseBeat(
            "The problem",
            "The previous terminal grew organically over time. As requirements changed from those of a fledgeling AV start-up, to needing to support 500+ rides per day in SF, new features were added with the idea that the most important ones would occupy as close to the centerline of the Remote Assistant's field of view as possible. This is solid human factor's thinking, but very bad information architecture design.\n\nThe net result was a completely wildcard screen where functionality an Advisor needed could be anywhere, with the main organizing principle not being UX axioms like Proximity and Uniform Connectedness, but usefulness during severe moments. Predictable where to look, unpredictable what you'd find there.",
          ),
          cruiseMedia(
            "Before",
            "Remote Advisorss had to read and classify UI elements before they could act. Even if you knew to look in the center, you still spent cognitive cycles figuring out what kind of thing you were looking at.",
            "16x9",
            {
              sources: [
                "/portfolio/cruise/Cruise Bento Before.png",
              ],
            },
          ),
          cruiseMedia(
            "The solution",
            "A bento-box-style model where content types are grouped in predictable regions. Controls here. Status there. Workflows in a defined place. The centerline intentionally kept clear: no chrome competing with the vehicle, cameras, and map.",
            "16x9",
            {
              sources: [
                "/portfolio/cruise/Cruise_v4_c2.jpg",
                "/portfolio/cruise/Cruise_v4_c3.jpg",
                "/portfolio/cruise/Cruise_v4_c4.jpg",
                "/portfolio/cruise/Cruise_v4_c6.jpg",
                "/portfolio/cruise/Cruise_v4_c7.jpg",
                "/portfolio/cruise/Cruise_v4_c1.jpg",
                "/portfolio/cruise/Cruise_v4_c5.jpg",
              ],
            },
          ),
          cruiseQuote(
            "Proof It Worked",
            "[This] gives me information in a much more intuitive way.",
            "Remote Advisor Research Participant",
          ),
          cruiseBeat(
            "The principle",
            "Knowing where to look for a certain type of information — before you even read it — is itself a form of speed. Type-based regionalization over importance-based centering.",
          ),
          cruiseBeat(
            "The same idea, applied to controls",
            "Regions solved where information lived on screen, however controls were the other half of the same problem. Human factors had a sound rule here though, one that we were wise to retain: keep the upper half of the screen (the Remote Advisor's's threat cone) completely free of UI. In the Terminal, the vehicle points up in the center of the screen. This is the vehicles' forward path. To prevent object occlusion, everything else had to live in the lower half.",
          ),
          cruiseMedia(
            "The problem",
            "The Terminal was built with maneuver controls housed in a fly-out drawer at the far bottom-right. These were hidden by default. Remote Advisorss connecting to a stuck vehicle need to read the scene, choose a maneuver, and engage — within three seconds. A drawer could cost a full second.",
            "1x1",
            { sources: [
              "/portfolio/cruise/Cruise_maneuver_fly-out.jpg"
            ] },
          ),
          cruiseMedia(
            "The solution",
            "A floating toolbar at bottom center, permanently visible, with clear iconography and a color/shape language. With hotkeys for experienced Remote Advisors, all eyes could remain on the scene.",
            "1x1",
            { sources: [
              "/portfolio/cruise/Cruise_v5_c1.jpg",
              "/portfolio/cruise/Cruise_v5_c2.jpg",
            ] },
          ),
          cruiseQuote(
            "Proof It Worked",
            "Clear and easier to use...",
            "Remote Advisor Research Participant",
          ),
          cruiseBeat(
            "A critical insight",
            "Cruise's remote Advisorss weren't trained specialists. They weren't air traffic controllers, engineers, or safety professionals. They were regular people, they played video games, they used iPhones, etc. A floating action toolbar at the bottom of the screen with hotkey support is a video game pattern, and one these Advisorss already knew. Meeting them there was the correct decision and helped us achieve our 3 seconds TTFA.",
          ),
          cruiseQuote(
            "Proof It Worked",
            "There is a lot more information placed logically in T2.",
            "Remote Advisor Research Participant",
          ),
        ],
        "16x9",
        {
          titleTreatment: "cover",
          keyImageSrc: "/portfolio/cruise/Cruise_v2_cover.jpg",
          titleCoverBlur: 0,
          titleCoverAlpha: 0.7,
        },
      ),
      cruiseVignette(
        "control-handoff-visualization",
        "Who's Driving This Anyway?",
        ["Motion", "Interaction design", "Workflow & ops"],
        "State legibility / handoff smoothness / animation as communication",
        [
          cruiseBeat(
            "The context",
            "It's important to realize that humans never remotely drove a Cruise AV. Remote assistance consisted of simply providing suggestions and instructions to the AV. Whether or not the AV followed them depended upon its interal planning stack.\n\nThe AV had 3 main states: Fully Autonomous, Remotely Assisted, and Manual. The former two were the only modes the AV could proceed autonomously.\n\nWhat mode the AV was in dictated the kinds of instructions Remote Assistants could provide it, how likely the AV was to follow those instructions without deviation, and whether or not the AV needed to come to a complete stop to switch modes. So communicating the AV's state to the Remote Operator, along with the tools available to them to instruct the AV, was critical.",
          ),
          cruiseMedia(
            "State Visualization",
            "The AV could only be in one of the following states: Fully Autonomous, Remotely Assisted, and Manual. We needed to visualize this so Remote Operators could understand the AV's capabilities and limitations.",
            "1x1",
            {
              sources: [
                "/portfolio/cruise/Cruise_v6_c1.jpg",
              ],
            },
          ),
          cruiseBeat(
            "The insight",
            "If we could visualize where the control handoff would happen on the forward path, we could implicitly pre-authorize the switch, and the vehicle wouldn't need to stop. The AV could approach the handoff point with authorization already in place and keep its forward motion, saving precious seconds and not further disrupt traffic.",
          ),
          cruiseMedia(
            "[...]",
            "[...]",
            "1x1",
            {
              sources: [
                "/portfolio/cruise/Cruise_v7_c1.jpg",
                "/portfolio/cruise/Cruise_v7_c2.jpg",
                "/portfolio/cruise/Cruise_v7_c3.jpg",
                "/portfolio/cruise/Cruise_v7_c4.jpg",
                "/portfolio/cruise/Cruise_v7_c5.jpg",
              ],
            },
          ),
          cruiseMedia(
            "Live Prototype",
            "Here you can see the AV approaching the handoff point and the Remote Operator implicitly authorizing the switch to autonomous mode.",
            "1x1",
            {
              vimeo: "1209263346",
              vimeoBackground: true,
              poster: "/portfolio/cruise/ap-to-autonomous.jpg",
            },
          ),
        ],
        "1x1",
        {
          titleTreatment: "cover",
          keyImageSrc: "/portfolio/cruise/Cruise_v3_cover.jpg",
          titleCoverBlur: 0,
          titleCoverAlpha: 0.4,
        },
      ),
      cruiseVignette(
        "av-state-module",
        "AV State Module",
        ["Visual design", "Interaction design"],
        "Context gain / picture over words / eye-scan reduction",
        [
          cruiseBeat(
            "The old design",
            "Colored pills scattered across four corners. The highest-priority pill would \"zit\" to center while others orbited. Remote Advisorss scanned four regions to understand what the car was dealing with — words everywhere, no coherent picture.",
          ),
          cruiseMedia(
            "The redesign",
            "A persistent AV State Module — vehicle graphic fixed bottom-left. Doors, lights, passengers, seatbelts, collisions, and lidar footprints rendered on the illustration itself.",
            "1x1",
          ),
          cruiseBeat(
            "Inline controls",
            "The module became a lightweight control surface — lights, horn, exterior audio — without leaving context. Below 15mph, live lidar returns around the module showed proximity without cluttering the main view.",
          ),
          cruiseBeat(
            "Outcome",
            "Three problems collapsed into one module: where to look (fixed), how to interpret (pictures not words), how to act (inline controls). Eye-scan reduced to a single anchor.",
          ),
        ],
      ),
      cruiseProse(
        "cruise-one-window",
        "One window, many roles",
        "The terminal was never just a driving interface. It was the coordination layer for a small city of teams — recovery, security, customer service, tele-ops — who had been working in parallel tools and parallel rooms. Everything below is a variation on the same mandate: bring the right human into the loop at the right moment, without making the Remote Advisor leave the scene.",
      ),
      cruiseVignette(
        "coordination",
        "Coordination",
        ["Workflow & ops", "Systems thinking", "Communication design"],
        "Coordination design / role convergence / automation-first / orchestration over invention",
        [
          cruiseBeat(
            "The before state",
            "Remote Advisorss juggling tabs, Slack, Google Sheets, and Google Meet. Tele-ops and customer service in adjacent rooms at Phoenix — separated by a wall, not coordinating. They weren't even on a first-name basis. Recovery, security, and support all in parallel channels.",
          ),
          cruiseBeat(
            "Two teams, one blind spot",
            "Cruise used Chevy Bolts, stock cars retrofitted in-house, not purpose-built AVs. Communication with the outside world had to be creative within those limits. Worse, the org had split communication itself: customer service could call passengers, but had no idea what the Remote Advisor was doing, moving, stopping, clearing a collision. Remote Advisorss could move the vehicle and manage every system, but had no channel to speak to a passenger or an officer outside the car. The business kept these roles cleanly siloed. The real world kept crossing that line.",
          ),
          cruiseBeat(
            "The principle",
            "Automate first. Whatever still requires human intervention gets condensed and surfaced inside the terminal itself. No tab-switching. Everything the Remote Advisor needs, in one window, in the right moment.",
          ),
          cruiseMedia(
            "Sidebar card rail",
            "Workflows requiring human action appeared as cards in a sidebar rail, text, rich media, or interactive controls depending on scenario. A recovery dispatch showed up as a live map of the recovery team's position. A stowaway concern showed up as a live stream from the interior cabin camera, fed straight into the card. Critical actions, close the doors, fail the vehicle, trigger physical security, sat one tap away without ever leaving the card.",
            "16x9",
          ),
          cruiseMedia(
            "Telephony, wired in",
            "Full telephony wired into the terminal, passenger cabin, front interior, exterior speakers, inter-Advisor channels. First-class feature, not an external tool.",
            "9x16",
          ),
          cruiseBeat(
            "Dual-channel audio",
            "Borrowed from 911 dispatch: left ear for Advisor-to-Advisor, right ear for scene audio. The ear told you the source, no visual lookup required.",
          ),
          cruiseBeat(
            "Design grounding",
            "The telephony craft here wasn't invented from scratch. It drew on earlier work designing call-status clarity and audio-energy visualization for Google's contact center products, plus the physical reality of an operator running one ear on a colleague and one ear on the scene. Standard telephony UX principles, applied to a car.",
          ),
          cruiseBeat(
            "Police pullover",
            "The showcase scenario, tying both threads together: passenger notification, exterior voice comms, safety overrides, vehicle movement, and telephony channels, orchestrated into a single guided workflow inside the sidebar rail, surfacing the right controls in order.",
          ),
          cruiseBeat(
            "Outcome",
            "Research and dogfooding confirmed what the org structure denied: the people moving the vehicle needed to speak, and the people speaking needed operational visibility. The sidebar rail and telephony service were two answers to the same question, how do you bring the right human into the loop without making the Remote Advisor leave the scene. Shipped in a partially-built form before Cruise shut down; the polished vision exists in Figma. The innovation here was never invention. It was orchestration.",
          ),
        ],
      ),
      cruiseProse(
        "cruise-camera-bridge",
        "Not every idea worked",
        "Not every idea worked. Some of the most valuable lessons came from the ones that didn't.",
      ),
      cruiseVignette(
        "camera-array-redesign",
        "The Camera Array Redesign That Didn't Work",
        ["Research", "Human factors", "Motion"],
        "Craft humility / safety-critical constraints / when HF research beats design intuition",
        [
          cruiseBeat(
            "The inspiration",
            "A glimpse of what appeared to be a Waymo tele-ops interface — a single horizontal filmstrip that shifted based on area of interest. Compared to our T-shaped array, it looked elegant, responsive, and spatially smart.",
          ),
          cruiseMedia(
            "The hypothesis",
            "Replace the T-shape with a scrollable filmstrip that auto-centers the area of interest — cleaner layout, better spatial correlation between map and cameras.",
            "16x9",
          ),
          cruiseBeat(
            "The pushback",
            "Human factors researchers were appalled. Remote Advisorss in safety-critical environments need spatial muscle memory. Left is left. Right is right. Always. The T-shape was a trusted spatial anchor under stress.",
          ),
          cruiseBeat(
            "The result",
            "Motion prototypes performed poorly. Scrolling introduced spatial disorientation. The muscle memory disruption was real. The T-shape stayed — awkward for layout, correct for cognition.",
          ),
          cruiseBeat(
            "What was learned",
            "Elegance is not always correct. A design that looks cleaner can be cognitively more dangerous. Pushing on the T-shape was the right instinct — understanding why it needed to stay was the right outcome.",
          ),
        ],
      ),
      cruiseProse(
        "cruise-intervention",
        "Three seconds",
        "By the time Cruise was running 500+ autonomous rides daily in San Francisco, human interventions had to complete in three seconds or less: connect, understand the blockage, issue an instruction, get moving. Everything below, what shipped and what didn't, only makes sense against that clock.",
      ),
      cruiseVignette(
        "taking-the-wheel",
        "Taking the Wheel",
        ["Interaction design", "Systems thinking", "Human factors", "AI-native design"],
        "Three ways to move the vehicle / determinism as trust signal / from full manual control to trusting the machine",
        [
          cruiseBeat(
            "The trust problem",
            "The old intervention stack assumed safety drivers in seat and engineers in close coordination. At 500+ autonomous rides a day in San Francisco, that model was a liability, interventions had to complete in three seconds. And Remote Advisorss only trusted what was deterministic.",
          ),
          cruiseBeat(
            "What fell short",
            "Pivot (a lane-preference nudge) and Assisted Pathing (breadcrumb control points) were non-deterministic. The car could ignore the input or sit there saying \"executing\" while doing nothing. Remote Advisorss stopped trusting them, and stopped using them.",
          ),
          cruiseBeat(
            "What they trusted",
            "Sudo was fully deterministic: drag, drop, and rotate a vehicle icon to the end-state pose, hold go, and the car closed the gap. Basic collision avoidance aside, it just executed. Remote Advisorss loved it: you said where, it went there. That trust wasn't automatic, it was earned through iteration.",
          ),
          cruiseBeat(
            "The old design",
            "The earliest version was a plain rectangle with no front/back indication. A tiny spin icon above it, with no orientation feedback, no rotation distance, no kinematic feasibility boundaries, poor hit targets, and no affordance for drag-to-position.",
          ),
          cruiseMedia(
            "The redesign",
            "Clear front/back directionality, a generous circular grab-ring for drag-and-rotate, kinematic feasibility boundaries visualized, and pre-send validation for infeasible poses.",
            "16x9",
          ),
          cruiseBeat(
            "The deeper insight",
            "Remote Advisorss sent infeasible commands regularly, not from carelessness, but because the interface gave no way to know what was feasible. Every rejection created a round-trip. The redesign encoded physics upstream.",
          ),
          cruiseBeat(
            "A second mode, built in",
            "The ring wasn't the only way to use it. Leave it disengaged and simply move the mouse across the map instead, and a breadcrumb trail followed the cursor, with the vehicle loosely tracing it. To a user's eye, that looked almost identical to Assisted Pathing, a point dropped on the map. The difference was invisible and total: Assisted Pathing ran on the autonomy stack's own path solver, which is exactly what made it feel like a black box Remote Advisorss never fully trusted. This breadcrumb mode ran on Sudo's spatial solver instead, the same deterministic engine behind the ring itself. Same gesture from the user's side, a different brain underneath, and that's what earned the trust Assisted Pathing never did.",
          ),
          cruiseMedia(
            "In practice",
            "A real Remote Advisor using the breadcrumb mode to navigate around a double-parked vehicle, without ever touching the ring.",
            "16x9",
          ),
          cruiseBeat(
            "Outcome",
            "Fewer round trips and faster operations for precise moves, plus a looser, quicker option for everything else. One widget, two grains of control: exact when the situation called for it, approximate when it didn't, both of them trusted because both finally ran on a solver Remote Advisorss could rely on.",
          ),
          cruiseMedia(
            "Spring-loaded splines",
            "An ergonomic evolution of Sudo. Moving the mouse generates a Bezier spline in real time between the vehicle and the cursor, previewing the most efficient feasible path. Kinematically infeasible positions are disallowed by design, since the spring-loaded curves resist impossible configurations. For the common case (back up, assert around something, small adjustment) precise pose-and-place was overkill; splines handled short maneuvers faster and with less cognitive load, while preserving the determinism Remote Advisorss trusted.",
            "16x9",
          ),
          cruiseBeat(
            "A different kind of new",
            "Spring-loaded splines made a trusted paradigm faster. Alternate Intents asked a different question: what if the Remote Advisor didn't have to instruct the vehicle at all? At any moment the AV's planning stack has already solved multiple paths forward, it just picks one and discards the rest. That solved intelligence is invisible to the Remote Advisor. Alternate Intents surfaces the unchosen, already-computed routes as selectable ghost paths on the map. Click one to preference it.",
          ),
          cruiseMedia(
            "Select, don't instruct",
            "Every other intervention made the Remote Advisor tell the vehicle what to do: specify a pose, draw a path, define an end state. This inverts the model: the vehicle already did the planning, so the Remote Advisor just says that one. Nothing to re-solve, so execution is near-immediate, with no latency, no re-planning cycle, no waiting.",
            "16x9",
          ),
          cruiseBeat(
            "When the human sees more",
            "Sometimes a person perceives what the sensors can't, a pedestrian waving the car through, a construction worker's gesture, social context the ML ranker has no access to. In those moments the AV's second-best path is the correct one, and the Remote Advisor can redirect toward a route the vehicle had already validated.",
          ),
          cruiseBeat(
            "The stability problem",
            "Ghost paths flicker. The AV re-plans constantly, so alternates appear and vanish as the scene changes, and you can't reliably click a path that might disappear in half a second. The tool only exposes alternates that hold past a stability threshold, scoped to conditions where stable options are likely.",
          ),
          cruiseBeat(
            "Artifact status",
            "Neither shipped. Cruise shut down before the behaviors-engineering collaboration needed to wire either into the AV stack could be completed. Figma prototypes exist for both, spring-loaded splines and Alternate Intents were the last ideas on the table when the lights went out, two ideas for what the ring might have become next.",
          ),
        ],
        "1x1",
      ),
    ],
  },
  {
    slug: "google",
    name: "Store, Search, and Support",
    subhead:
      "Enterprise surfaces across three teams — the retail floor, the search page, and the contact center.",
    date: "2020–2023",
    client: "Google",
    brand: {
      field: "google-primary",
      logo: "/portfolio/logos/google.gif",
    },
    location: "Mountain View, CA",
    role: "Senior product designer",
    tools: "Figma, prototyping, contextual research",
    clientLogo: "/portfolio/logos/google.svg",
    sections: [
      googleProse(
        "google-intro",
        "Three teams, one question",
        "After the single, custom-built world of an autonomous vehicle, Google was the opposite kind of problem: enterprise products at planetary scale, spread across three teams that barely touched each other — the physical retail Store, Shopping Ads on the search page, and the Contact Center tools support agents lean on.\n\nWhat connected them wasn't a product area. It was a habit: find the information a system already has, and surface it to the person who needs it — a runner on the store floor, a shopper mid-decision, an agent on a hard call.",
      ),
      googleVignette(
        "google-store-clover-pos",
        "Google Store — Clover POS App",
        ["Systems thinking", "Mobile"],
        "Role orchestration / systems design / knowing when not to redesign",
        [
          googleBeat(
            "The scope",
            "A full Android app redesign running on Clover Flex handhelds for Google's physical retail stores. The app carried the entire retail workflow: inventory lookup, runner requests from back-of-house, SKU scanning, sales, promotions, returns, phone trade-ins, and BOPIS.",
          ),
          googleBeat(
            "The systems layer",
            "It wasn't just a point-of-sale tool — it was the coordination surface for several store roles at once: sales associates on the floor, runners in the back, back-of-house operations, and the repair team. One app, multiple roles, orchestrated workflows.",
            "1x1",
          ),
          googleMedia(
            "The senior move",
            "Rather than design everything from scratch, partnered with the Google Store web team to repurpose existing assets — product configuration flows, PDP patterns, cart logic. Where contexts diverged (native vs. responsive, sales rep vs. public), modified; where they didn't, reused. Knowing when to build vs. borrow — and having the relationships to make borrowing work.",
            "16x9",
          ),
          googleMedia(
            "Walkthrough",
            "Full Figma prototype tap-through demonstrating the complete app flow across roles.",
            "9x16",
          ),
        ],
      ),
      googleProse(
        "google-store-to-ads",
        "From the floor to the feed",
        "The Store app was about orchestrating people around a transaction in a physical room. Shopping Ads was the same instinct pointed at the opposite environment: millions of anonymous shoppers, no staff, no room — just a query and the few seconds before attention moves on.",
      ),
      googleVignette(
        "funnel-aware-ad-formats",
        "Google Shopping Ads — Funnel-Aware Ad Formats",
        ["Strategy", "Data visualization", "Web"],
        "Funnel-stage design / query intelligence / privacy-safe personalization",
        [
          googleBeat(
            "The insight",
            "Every shopping ad looked identical — the same rectangular tile whether someone was idly browsing or ready to buy. The opportunity: serve a different ad format depending on where the user was in their shopping journey.",
          ),
          googleBeat(
            "The privacy constraint",
            "Google had extensive user signals — browsing history, cookies, profile. The team deliberately chose not to use them. Funnel stage would be inferred from the query itself and nothing else. Both a privacy-respecting choice and a technical one — increasingly relevant in a post-cookie world.",
            "1x1",
          ),
          googleBeat(
            "Three stages from the query",
            "Browsy — exploratory, no brand or model (\"fall fashion trends for men\"). Researchy — comparison with a category but no committed brand (\"best washing machines of 2023\"). Converty — specific brand, model, sometimes location (\"Air Jordan size 10 near me\").",
            "9x16",
          ),
          googleMedia(
            "Three formats",
            "Browsy: image-forward, details on hover. Researchy: tabular, specs forward, with authoritative third-party content (Wirecutter, YouTube) interspersed — a research surface, not just a product card. Converty: inventory and urgency — colorways, sizes, delivery windows, pickup proximity.",
            "16x9",
          ),
          googleBeat(
            "The political landscape",
            "Google's whole-page approach created a double bind: the organic search team worried differentiated formats broke page cohesion, while the organic shopping team worried formats too similar to theirs confused ad vs. organic.",
            "1x1",
          ),
          googleBeat(
            "Threading the needle",
            "Adopted the organic shopping team's visual language for the tiles themselves — same proportions, same signal patterns. Differentiation came from the carousel container and explicit \"Shopping Ads\" labeling, not from making each tile scream. Users could tell they were looking at ads without the tiles needing to.",
          ),
        ],
        "16x9",
        "Richer advertiser-brand hover bumpers proposed but unshipped.",
      ),
      googleProse(
        "google-ads-to-cc",
        "After the click, the call",
        "Shopping Ads ends at the buy. The Contact Center begins where buying breaks — the support call, the agent, the customer who needs a human. Three projects here, one belief: an agent is only as good as the context they're handed.",
      ),
      googleVignette(
        "software-telephone-redesign",
        "Google Contact Center — Software Telephone",
        ["AI-native design", "Communication design", "Web"],
        "Agent empowerment / context surfacing / AI-assisted service",
        [
          googleMedia(
            "The before state",
            "A basic phone dialer. A dial pad, call controls, and little else — customer history, prior interactions, knowledge base, and notes all lived in separate tabs and systems. (Animated GIFs of the original dialer exist.)",
          ),
          googleBeat(
            "The vision",
            "Transform the software telephone from a dialer into a fully contextualized agent workspace — everything needed to handle a customer intelligently, in one place, without tab-switching or hunting.",
            "1x1",
          ),
          googleBeat(
            "Five capability layers",
            "Customer history surfaced on connect. AI-suggested KB solutions in real time. A live transcript for noisy environments and non-native speakers. Bot-conversation context, so agents knew what had already been tried. Omnichannel messaging — send links and articles mid-call without breaking voice.",
            "9x16",
          ),
          googleBeat(
            "The quality layer",
            "SLA timers during the call. An After Session Work screen with CRM-transfer confirmation and a CSAT histogram. A between-calls leaderboard and reflection surface. And a concept — real-time sentiment tracking — letting an agent see a call going south and course-correct before losing the customer.",
            "1x1",
          ),
          googleBeat(
            "Outcome",
            "Shipped in phases: messaging as a standalone platform, the dialer with customer history and KB suggestions. The grand unified vision — every capability in one compact footprint — never fully shipped before I moved on.",
          ),
        ],
        "16x9",
        "Shipped in phases; the fully unified workspace never shipped.",
      ),
      googleVignette(
        "contact-center-chat-platform",
        "Google Contact Center — Chat Platform",
        ["Systems thinking", "Communication design", "Web"],
        "Stability-first product philosophy / omnichannel vision / platform thinking",
        [
          googleBeat(
            "Why it was built separately",
            "The software telephone handled a high volume of calls. At that scale, one destabilizing change cascades into a service problem. The philosophy was: don't rock the boat. So messaging was built as a standalone app rather than bolted onto the phone and risking something critical.",
          ),
          googleBeat(
            "The infrastructure partnership",
            "Partnered with the Google Business Messaging team to use their platform as the technical foundation, rather than building messaging infrastructure from scratch. The design sat on a proven layer.",
            "1x1",
          ),
          googleMedia(
            "The design",
            "A full-featured chat interface: contact list on the left rail, SLA timers and queue indicators throughout, an active-conversation rail, and Quick Responses — common phrases bound to keystrokes so agents didn't retype them.",
            "16x9",
          ),
          googleBeat(
            "The unshipped vision",
            "The intended end state: a unified surface — one app that flips between phone mode and chat mode seamlessly, an agent moving from a voice call to a chat without changing tools. That fusion never happened before I left, but the integration vision design exists.",
            "9x16",
          ),
          googleBeat(
            "Outcome",
            "The standalone chat platform shipped and went into production, built in collaboration with another designer.",
          ),
        ],
        "16x9",
        "Standalone chat shipped; unified phone-and-chat surface unbuilt.",
      ),
      googleProse(
        "google-code-yellow-setup",
        "When the most powerful team complains",
        "Inside Google, the ads org carries unusual weight — and when its support quality slipped, the complaint didn't stay local. It climbed to the CEO. What landed on the Contact Center team as a code yellow was, on inspection, a diagnosis that didn't match the evidence.",
      ),
      googleVignette(
        "contact-center-code-yellow",
        "Google Contact Center — Code Yellow",
        ["Research", "Service design", "Leadership"],
        "Research reframing the problem / org-wide systemic impact / diagnosis before solution",
        [
          googleBeat(
            "The trigger",
            "The ads team escalated complaints about poor call quality in their support operations. The complaint reached Sundar Pichai. A code yellow was issued against the contact center tools team. Exit criteria: agents rating call quality 4.5+ on a 5-point scale, validated by automated checks.",
          ),
          googleBeat(
            "The problem with the problem",
            "Internal telemetry came back fine. Automated MOS scores, routing analysis — a few minor international-routing optimizations, but nothing explaining the volume of complaints. Tested internally, the software telephone performed well. The handed-down diagnosis didn't match the evidence.",
            "1x1",
          ),
          googleMedia(
            "Going to the field",
            "Rather than optimize against bad assumptions, the team went where agents actually worked — India, Japan, the Philippines — for ethnographic research and contextual observation. What they found was not a software problem.",
            "16x9",
          ),
          googleBeat(
            "What the field showed",
            "The offices were acoustically brutal — glass and concrete measuring, on a decibel meter, like the side of a highway. Headphones were outdated; in India, agents took foam ear pads home for hygiene, leaving colleagues pressing bare plastic to their ears. And \"the call was bad\" was a catch-all for supervisors, customers, and frustration — not audio.",
            "9x16",
          ),
          googleBeat(
            "The instrumentation fix",
            "To separate real audio signal from everything else, the team added a post-call micro-survey to the After Session Work screen — a quick 1–5 rating of that specific call's audio, cross-referenced with automated MOS testing. When both flagged a call, the signal was reliable. Agents became precision instruments.",
            "1x1",
          ),
          googleBeat(
            "The outcome",
            "Once environmental, hardware, training, and language issues were stripped away, the telephone's actual audio met or exceeded industry standard, and the team exited the code yellow. The findings rippled outward: facilities rewrote the call-center playbook (acoustic paneling, dividers), IT upgraded headsets and shipped supervisor audio splitters, and operational standards were unified across owned and vendor sites. The ads team was right that something was wrong — and wrong about what it was.",
          ),
        ],
        "16x9",
      ),
    ],
  },
  {
    slug: "mckinsey",
    standalone: true,
    name: "McKinsey & Co. — Experience Design",
    subhead:
      "Three engagements in finding, filming, and quantifying value where none seemed to exist.",
    date: "2015–2017",
    client: "McKinsey & Co.",
    location: "New York, NY",
    role: "Executive Experience Design Director",
    tools: "Sketch, Illustrator, InVision, Keynote",
    brand: {
      field: "mckinsey-primary",
    },
    sections: [
      mckinseyVignette(
        "beyond-the-pill",
        "Beyond the Pill — MS Drug Digital Ecosystem",
        ["Design research", "Health outcomes", "Executive storytelling"],
        "Design research as clinical intervention / ethnography at scale / executive storytelling",
        [
          mckinseyBeat(
            "The hypothesis",
            "Give MS patients a digital ecosystem that supports their treatment protocol, tracking symptoms, managing their care team, staying adherent to the drug, and the drug's clinical efficacy improves. Not a marketing project. A product design project with health outcomes as the success metric.",
          ),
          mckinseyBeat(
            "The research",
            "Ethnographic fieldwork with patients and their doctors: disease progression, treatment adherence, family dynamics, the emotional weight of a relapsing condition. On the provider side, mapping a doctor's full knowledge and social graph, how they learn about new drugs, coordinate with nurse practitioners, and monitor patients between appointments to catch a relapse before it happens.",
            "1x1",
          ),
          mckinseyMedia(
            "Patient journey books",
            "Physically printed, richly designed narrative books telling individual patients' stories, disease progression, treatment protocol, family and lifestyle needs. Built to give executives an emotional connection to the patient experience, not just the business case.",
            "9x16",
          ),
          mckinseyMedia(
            "Provider ecosystem map",
            "A visual map of a doctor's knowledge network: information sources, patient touchpoints, and where clinical knowledge flowed or broke down. Used to find where a digital product could actually intervene.",
            "16x9",
          ),
          mckinseyBeat(
            "Outcome",
            "A menu of product ideas, each scored for likely impact, handed back with an honest frame: here is what we found and what we think it's worth, committing to it is your call.",
          ),
        ],
      ),
      mckinseyVignette(
        "sprint-commodity-utility",
        "Sprint — Differentiating a Commodity Utility",
        ["Strategy", "Video", "Speculative design"],
        "Value creation in commodity markets / speculative product design / video as design artifact",
        [
          mckinseyBeat(
            "The brief",
            "Sprint was hemorrhaging money competing on price as a utility. Cell coverage lagged competitors. Texts and data were commoditized, dumb-pipe economics with no margin. McKinsey was brought in to restructure the business. The harder question handed to the experience design team: how do you build a value proposition for a commodity?",
          ),
          mckinseyBeat(
            "The approach",
            "Not marketing, not a brand refresh, that was the agency of record's lane. Product-level value adds that could genuinely differentiate the service: family data pooling, a bundled Spotify partnership, smart data management for gig economy workers, and a device service ecosystem, repair coordination, replacement recommendations, cross-device management, run by a conversational AI agent. This was before Siri, before AI agents were a mainstream idea.",
            "1x1",
          ),
          mckinseyMedia(
            "Three commercials",
            "Three fully produced video commercials, scripts written, actors hired, filmed and edited. A family sharing a data pool and starting a shared Spotify session in the living room. An Uber driver toggling background app data on and off mid-shift. A customer breaking a device and a smart agent coordinating repair or replacement across their whole device footprint.",
            "16x9",
          ),
          mckinseyBeat(
            "Outcome",
            "The videos carried the pitch on their own: three lived-in human moments standing in for a value proposition Sprint couldn't otherwise put into words.",
          ),
        ],
      ),
      mckinseyVignette(
        "qed-quantified-experience-design",
        "QED — Quantified Experience Design",
        ["Methodology", "Data + design", "Strategy"],
        "Methodology invention / quantitative and qualitative synthesis / design as a business decision tool",
        [
          mckinseyBeat(
            "What it is",
            "A framework co-invented with McKinsey's Advanced Journey Analytics team that runs statistical analysis alongside human-centered design, not just at the start as segmentation or the end as measurement, but continuously, as a design partner to qualitative thinking.",
          ),
          mckinseyBeat(
            "How it works",
            "Population models identify what matters most to which customer segments, statistically. Designers do the usual work: research, ideation, concept development. Instead of handing finished concepts to the business and hoping they land, those concepts get run back through the population models and scored, not one at a time, but as a basket of ideas working together.",
            "1x1",
          ),
          mckinseyBeat(
            "The output",
            "An answer to a question most design processes can't give: if the target is a 28 percent NPS improvement, which combination of ideas gets there? One breakthrough idea might do it alone. A handful of smaller ideas might close the gap collectively. Either way, the client commits with statistical confidence instead of intuition.",
            "9x16",
          ),
          mckinseyStat(
            "Outcome",
            "22%",
            "Applied on a Fortune 500 pharmaceutical engagement: a 22 percent increase in patient NPS while the client captured 26 percent more market share. Named, packaged, and sold into engagements across McKinsey's practice from there.",
          ),
        ],
      ),
    ],
  },
  {
    slug: "facebook",
    standalone: true,
    name: "Facebook — Questions & Answers",
    subhead:
      "Where a social graph and a knowledge graph collide: keeping questions, and their answers, inside Facebook.",
    date: "2013–2014",
    client: "Facebook",
    location: "New York, NY",
    role: "Product Designer",
    tools: "Photoshop, Illustrator, OmniGraffle",
    brand: {
      field: "facebook-primary",
    },
    sections: [
      facebookVignette(
        "questions-and-answers",
        "Questions & Answers — The Quora Killer",
        ["Social graph", "Structured data", "Platform-scale design"],
        "Social graph and knowledge graph intersection / structured data design / feature development at platform scale",
        [
          facebookBeat(
            "The context",
            "Joined Facebook via the acquisition of Hot Studio. Co-founded the New York UX team, building design culture in an office that wasn't yet fully embedded in the West Coast product culture.",
          ),
          facebookBeat(
            "The problem",
            "Users constantly left Facebook to search Google or Quora for answers their own social graph could have given them. Facebook's Q&A infrastructure was weak. The opportunity: keep users in the ecosystem by making questions and structured answers a native part of the platform.",
            "1x1",
          ),
          facebookBeat(
            "Compose",
            "A classifier detected question phrasing as a user typed in the Facebook composer and surfaced a prompt: are you asking a question? Accepting it tagged the post with structured data in the knowledge graph.",
          ),
          facebookBeat(
            "Contribute",
            "When friends answered, the bar for knowledge graph entity resolution dropped. Structured answers, a restaurant, a dentist, a location, snapped to real entities more readily than an ordinary comment.",
            "9x16",
          ),
          facebookMedia(
            "Consume",
            "Rendering experiments for the answer set: a map view for location questions, a mosaic of images, or a structured comment thread. The thread format kept context around lower-quality answers so other users could weigh them.",
            "16x9",
          ),
          facebookBeat(
            "Outcome",
            "Ran at 1 percent live; the lift wasn't enough to clear the bar for a full rollout at the time. Another team picked up the idea, refined it, and shipped a version of it years later.",
          ),
        ],
      ),
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Derived helpers
 * ------------------------------------------------------------------ */

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

export function isVignette(section: CaseStudySection): section is CraftVignette {
  return section.type === "vignette";
}

export function isProse(section: CaseStudySection): section is ProseSection {
  return section.type === "prose";
}

/** A vignette together with the case study it belongs to. */
export type VignetteWithStudy = {
  vignette: CraftVignette;
  caseStudy: CaseStudy;
};

/** All vignettes across all case studies, in authoring order. */
export function getAllVignettes(): VignetteWithStudy[] {
  const out: VignetteWithStudy[] = [];
  for (const caseStudy of caseStudies) {
    for (const section of caseStudy.sections) {
      if (isVignette(section)) {
        out.push({ vignette: section, caseStudy });
      }
    }
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Gated content — hidden from the public site until unlocked for the
 * session via `?p=true`. The cookie read happens in `src/lib/gate.ts`;
 * these helpers just take the resolved `unlocked` flag so they stay
 * usable from any runtime. See AGENTS.md backlog + gate.ts.
 * ------------------------------------------------------------------ */

/**
 * Case studies visible to this visitor — drops gated studies when locked, and
 * always drops standalone containers (they never get an index card).
 */
export function visibleCaseStudies(unlocked: boolean): CaseStudy[] {
  return caseStudies.filter(
    (study) => !study.standalone && (unlocked || !study.gated),
  );
}

/** Vignettes visible to this visitor — drops gated studies' vignettes when locked. */
export function visibleVignettes(unlocked: boolean): VignetteWithStudy[] {
  return getAllVignettes().filter(
    ({ caseStudy }) => unlocked || !caseStudy.gated,
  );
}

/** Deduped union of tags across the vignettes this visitor can see. */
export function visibleCraftTags(unlocked: boolean): string[] {
  return dedupe(visibleVignettes(unlocked).flatMap(({ vignette }) => vignette.tags));
}

/** True once a case study exists but is gated away from this visitor. */
export function isGatedAway(
  study: CaseStudy | undefined,
  unlocked: boolean,
): boolean {
  return Boolean(study?.gated) && !unlocked;
}

export function getVignette(slug: string): VignetteWithStudy | undefined {
  return getAllVignettes().find(({ vignette }) => vignette.slug === slug);
}

/** Just the vignettes belonging to one case study, in order. */
export function caseStudyVignettes(caseStudy: CaseStudy): CraftVignette[] {
  return caseStudy.sections.filter(isVignette);
}

/** Deduped union of tags used by a case study's vignettes (first-seen order). */
export function caseStudyTags(caseStudy: CaseStudy): string[] {
  return dedupe(caseStudyVignettes(caseStudy).flatMap((v) => v.tags));
}

/** Craft index URL with a single tag pre-selected. */
export function craftTagFilterHref(tag: string): string {
  return `/craft?tag=${encodeURIComponent(tag)}`;
}

/** Stable two-digit index (01…) from master vignette order. */
export function vignetteIndexLabel(slug: string): string {
  const all = getAllVignettes();
  const i = all.findIndex(({ vignette }) => vignette.slug === slug);
  const n = i >= 0 ? i + 1 : 0;
  return String(n).padStart(2, "0");
}

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values));
}

/** Display range from earliest to latest case study year, e.g. "2023–2025". */
export function caseStudiesDateRange(): string {
  const years = caseStudies
    .map((study) => study.date.match(/\d{4}/)?.[0])
    .filter((year): year is string => Boolean(year))
    .map((year) => Number.parseInt(year, 10));

  if (years.length === 0) return "";

  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min}–${max}`;
}