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
};

export type CraftVignette = {
  type: "vignette";
  /** Unique across the whole site — powers /craft/[vignette]. */
  slug: string;
  name: string;
  /** Portrait (9×16), landscape (16×9), or square (1×1); default key-image shape. */
  keyImageRatio: ImageRatio;
  /** Placeholder key-image fill until a real source is provided. */
  keyImageAccent: AccentKey;
  keyImageSrc?: string;
  /** Free-form, ~1–3 words each, unlimited. */
  tags: string[];
  /** Thematic line, e.g. "Context gain / semantic legibility / color as meaning". */
  themeLine?: string;
  /** Honest shipping status, e.g. "Never shipped — Figma prototypes exist". */
  status?: string;
  /** Opener panel width in grid columns; omit to use the title-panel default. */
  titlePanelWidth?: PanelWidth;
  images: VignetteImage[];
};

export type ProseSection = {
  type: "prose";
  id: string;
  heading?: string;
  /** A paragraph or two — split on blank lines for multiple paragraphs. */
  body: string;
};

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

/* ── Cruise content helpers (beats + glue prose) ───────────────── */
const cruiseAccent = "charcoal" as const satisfies AccentKey;

function cruiseBeat(
  label: string,
  body: string,
  ratio: ImageRatio = "16x9",
  panelBg?: PanelBg,
): VignetteImage {
  return {
    ratio,
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
    // Stat panels run wider than a text beat so the figure can dominate;
    // full-bleed on mobile. Override per-frame if a figure needs more/less room.
    width: { desktop: 8, mobile: 6 },
    ...(panelBg ? { panelBg } : {}),
  };
}

function cruiseVignette(
  slug: string,
  name: string,
  tags: string[],
  themeLine: string,
  images: VignetteImage[],
  keyImageRatio: ImageRatio = "16x9",
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
  };
}

function cruiseProse(
  id: string,
  heading: string,
  body: string,
): ProseSection {
  return { type: "prose", id, heading, body };
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

function googleProse(id: string, heading: string, body: string): ProseSection {
  return { type: "prose", id, heading, body };
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

function pearsonProse(id: string, heading: string, body: string): ProseSection {
  return { type: "prose", id, heading, body };
}

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
      vimeo: "1205281684",
      opacity: 0.30,
      poster: "/portfolio/cruise/cruise_title_poster.png",
    },
    sections: [
      cruiseProse(
        "cruise-intro",
        "The Terminal",
        "Cruise's remote operators were the humans-in-the-loop of a driverless fleet. When a robotaxi got stuck, or confused, it literally phoned a human for help. These people, Remote Operators, were like call-center agents sitting in a remote location waiting to catch inbound requests. When they did, they needed to act within seconds. The Terminal (the name of the software they used to support the driverless fleet) was built on rigorous, safety-first human factors traditions; designed for humans in control of a machine, not humans working alongside an AI stack. As a result, the Terminal was almost entirely blind to what the machine already knew — and everyone who depended on that knowledge paid the price: operators scrambling to read a scene in seconds, passengers in the back seat wondering when they'd move again, and the LEOs, first responders, and pedestrians on the street trying to figure out whether anyone was even home.\n\nThe through-line across my work at Cruise is a single idea — allow the humans working with the AI stack to quickly gain context, so they can help augment - not override - what the machine could do. The AV's AI perceived, classified, and planned constantly, but very little of that intelligence reached the Remote Operator. Each vignette below represents one move closer towards closing that gap: surfacing what the system knew, in a form a human under stress could read and respond to in seconds.",
      ),
      cruiseVignette(
        "semantic-color-shape",
        "Developing a Semantic Color & Shape Language",
        ["Visual design", "Data visualization", "Human factors"],
        "Context gain / semantic legibility / color as meaning",
        [
          cruiseBeat(
            "The problem",
            "Operators viewed the AV scene entirely in orange-on-black. Every object type — pedestrian, cyclist, vehicle, immovable obstacle — rendered identically. Legitimate human-factors science, but every object in the scene was visually equivalent.",
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
            "1x1",
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
            "Pedestrians, cyclists, vehicles, and static objects read at a glance — the semantic meaning of the scene became immediately legible.",
            "16x9",
            "/portfolio/cruise/cruise_v1_full.jpg",
          ),
          cruiseStat(
            "Outcome",
            "20%",
            "As a result of the improved map work, operators gained context about the scene ~20% faster and more accurately than before.",
            "16x9",
          ),
        ],
      ),
      cruiseProse(
        "cruise-scene-legibility",
        "Making the scene speak",
        "Once you accept that the AV already knows more than it shows, the design problem shifts from \"build a better display\" to \"translate machine perception into human-readable meaning.\" Color and shape were the first vocabulary — but the same question kept resurfacing: what else was the vehicle planning, remembering, or dealing with that never made it to the Terminal?",
      ),
      cruiseVignette(
        "operator-stop-go-control",
        "Insight and Direct Control of Vehicle Intent",
        ["Visual design", "Data visualization", "Interaction design"],
        "Context gain / vehicle intent legibility / minimum viable signal",
        [
          cruiseBeat(
            "The problem",
            `The AV is non-deterministic. A true ML ranker refreshing its decision-making potentially hundreds of times per second. When the vehicle decided what to do, it rendered for the operator as a single-color path spline projecting 50 meters ahead. No speed intent. Unreliable stop point visualizations. Little scene context explaining why the vehicle was behaving the way it was. Operators would watch the vehicle do anything, at any time, for any reason, and when it inexplicably stopped, they had no explanation and no obvious way to get it moving again.`,
          ),
          cruiseMedia(
            "The constraint",
            "We couldn't guarantee decision persistence — no binding route, no guaranteed future intentions, no speed deltas.",
            "1x1",
            {
              vimeo: "1206793002",
              vimeoBackground: true,
              poster: "/portfolio/cruise/Cruise_v2_path_poster.jpg",
            },
          ),
          cruiseBeat(
            "The insight",
            "Even a coarse signal — stop or go, faster or slower — was dramatically more useful than nothing. And since we had speed deltas and the vehicle's perception of surrounding objects, we could build a scene that told a coherent story. So that if and when the vehicle stopped, the operator already understood why.",
            "9x16",
          ),
          cruiseMedia(
            "The solution",
            "We attacked the problem on three fronts. First, we color-coded the projected path (red/green) to communicate speed deltas and intent — slow, stop, go — so the path itself told a story. Second, we visualized the scene objects the vehicle was actually perceiving and responding to, so operators could see why the vehicle was behaving the way it was. Third — and most importantly for getting stuck vehicles moving again — we made stop points interactive. When a stop point appeared on the path, the operator could lift it with a single click, signaling to the vehicle that it was safe to proceed. A police officer waving the car through a stop sign. A construction worker clearing an obstruction. Whatever the case: one click, car moves.",
            "1x1",
            {
              sources: [
                "/portfolio/cruise/Cruise_v2_c1.jpg",
                "/portfolio/cruise/Cruise_v2_c2.jpg",
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
            "Operators went from watching a black box to reading a scene. They understood why the vehicle stopped, and they had a discoverable, single-action control to get it moving again. The terminal stopped being something operators watched and started being something they could act on.",
          ),
        ],
      ),
      cruiseVignette(
        "event-timeline-panel",
        "Event Timeline + \"What Is the Vehicle Dealing With\" Panel",
        ["Information architecture", "Human factors", "Workflow & ops"],
        "Context gain / situational awareness / operator handoff / cold start",
        [
          cruiseBeat(
            "The problem",
            "When operators connected to a vehicle, they were context-blind. They didn't know what had happened in the moments before they took over — what the previous operator had done, what the vehicle had tried autonomously, or why the car was stopped.",
          ),
          cruiseBeat(
            "The cold start",
            "In a safety-critical system, an operator connecting without context could take the wrong action — or waste critical seconds reconstructing a situation that was already well-understood by the previous operator.",
            "1x1",
          ),
          cruiseBeat(
            "Event timeline",
            "A coarse-grained log pulling from vehicle event APIs already exposed but not rendered. Stops, collisions, operator overrides, course changes — a readable history of what the vehicle had been through.",
            "9x16",
          ),
          cruiseMedia(
            "Dealing-with panel",
            "Big icons, color-coded, with timers showing how long each condition had been active. Also surfaced sequential steps to resolve the vehicle's current state.",
            "16x9",
          ),
          cruiseBeat(
            "Outcome",
            "What previously required a verbal debrief between operators — or an educated guess — became a 5-second visual scan. Operators arrived in context, not blind.",
          ),
        ],
      ),
      cruiseProse(
        "cruise-handoff",
        "Arriving in context",
        "Cold start wasn't a UX nicety — it was a safety variable. Every time an operator connected mid-incident, they were reconstructing a story someone else had already read. The timeline and dealing-with panel were attempts to make handoff as fast as reading a headline: what happened, what's active now, what do I do next.",
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
            "Human factors researchers were appalled. Operators in safety-critical environments need spatial muscle memory. Left is left. Right is right. Always. The T-shape was a trusted spatial anchor under stress.",
            "1x1",
          ),
          cruiseBeat(
            "The result",
            "Motion prototypes performed poorly. Scrolling introduced spatial disorientation. The muscle memory disruption was real. The T-shape stayed — awkward for layout, correct for cognition.",
            "9x16",
          ),
          cruiseBeat(
            "What was learned",
            "Elegance is not always correct. A design that looks cleaner can be cognitively more dangerous. Pushing on the T-shape was the right instinct — understanding why it needed to stay was the right outcome.",
          ),
        ],
      ),
      cruiseVignette(
        "predictable-ui-regions",
        "Predictable UI Regions (Bentable Box Model)",
        ["Information architecture", "Human factors"],
        "IA clarity / cognitive load reduction / layout as cognitive aid",
        [
          cruiseBeat(
            "The problem",
            "The previous terminal put the most important thing in the center of the screen. In practice, the center became a wildcard — a maneuver control, an object classification, a collision workflow. Predictable where to look, unpredictable what you'd find.",
          ),
          cruiseBeat(
            "The result",
            "Operators had to read and classify UI elements before they could act. Even if you knew to look in the center, you still spent cognitive cycles figuring out what kind of thing you were looking at.",
            "1x1",
          ),
          cruiseMedia(
            "The solution",
            "A bentable box model — content types in predictable regions. Controls here. Status there. Workflows in a defined place. The centerline intentionally kept clear: no chrome competing with the vehicle, cameras, and map.",
          ),
          cruiseBeat(
            "The principle",
            "Knowing where to look for a certain type of information — before you even read it — is itself a form of speed. Type-based regionalization over importance-based centering.",
            "9x16",
          ),
        ],
      ),
      cruiseProse(
        "cruise-layout",
        "Layout as a cognitive aid",
        "Human-factors tradition gave operators a rigorous center-stage for whatever mattered most in the moment. The problem was that \"what matters most\" changed faster than human attention could re-orient. Regionalizing by content type — and protecting the centerline for the scene itself — was a bet that spatial predictability beats dynamic prominence.",
      ),
      cruiseVignette(
        "av-positioning-control-ring",
        "AV Positioning Control Ring",
        ["Interaction design", "Systems thinking"],
        "Interaction craft / command validation / physics-informed design",
        [
          cruiseBeat(
            "The old design",
            "A plain rectangle with no front/back indication. A tiny spin icon above it — no orientation feedback, no rotation distance, no kinematic feasibility boundaries, poor hit targets, no affordance for drag-to-position.",
          ),
          cruiseMedia(
            "The redesign",
            "Clear front/back directionality, a generous circular grab-ring for drag-and-rotate, kinematic feasibility boundaries visualized, and pre-send validation for infeasible poses.",
            "1x1",
          ),
          cruiseBeat(
            "The deeper insight",
            "Operators sent infeasible commands regularly — not from carelessness, but because the interface gave no way to know what was feasible. Every rejection created a round-trip. The redesign encoded physics upstream.",
            "9x16",
          ),
          cruiseBeat(
            "Outcome",
            "Fewer round trips. Faster operations. Less operator frustration — validation moved from the AV's rejection loop into the interface itself.",
          ),
        ],
      ),
      cruiseVignette(
        "control-handoff-visualization",
        "Control Handoff Visualization",
        ["Motion", "Interaction design", "Workflow & ops"],
        "State legibility / handoff smoothness / animation as communication",
        [
          cruiseBeat(
            "The context",
            "The AV could be autonomous, remotely operated, human-driven, or failed — communicated via AV icon color. Switching control states required a complete stop: safe, but slow and costly in a commercial robotaxi operation.",
          ),
          cruiseBeat(
            "The insight",
            "If we could visualize where the control handoff would happen on the forward path, we could pre-authorize the switch. The vehicle wouldn't need to stop — it could approach the handoff point with authorization already in place.",
            "1x1",
          ),
          cruiseMedia(
            "The solution",
            "Forward path spline as a double line: outer line matches current control state; inner stripe gradients into the incoming entity's color, anchored to a waypoint. Colors intensify as the AV approaches — a visual countdown.",
            "16x9",
          ),
          cruiseBeat(
            "Outcome",
            "Control handoffs could be pre-authorized without stopping the vehicle. The visualization made the transition legible enough that operators trusted it. The car stayed in motion.",
            "9x16",
          ),
        ],
      ),
      cruiseProse(
        "cruise-operations",
        "Keeping the car moving",
        "Stopping is the safe default in a safety-critical stack. But unnecessary stops are expensive, disruptive, and — in a fleet context — contagious. Pre-authorizing control handoffs and visualizing intent on the path were both attempts to preserve safety while recovering operational tempo.",
      ),
      cruiseVignette(
        "workflow-sidebar-rail",
        "Workflow Streamlining + Sidebar Card Rail",
        ["Workflow & ops", "Systems thinking"],
        "Coordination design / workflow consolidation / automation-first",
        [
          cruiseBeat(
            "The before state",
            "Operators juggling tabs, Slack, Google Sheets, and Google Meet. Tele-ops and customer service in adjacent rooms at Phoenix — separated by a wall, not coordinating. Recovery, security, and support all in parallel channels.",
          ),
          cruiseBeat(
            "The principle",
            "Automate first. Whatever still requires human intervention gets condensed and surfaced inside the terminal itself. No tab-switching. Everything the operator needs, in one window, in the right moment.",
            "1x1",
          ),
          cruiseMedia(
            "Sidebar card rail",
            "Workflows requiring human action appeared as cards in a sidebar rail — text, rich media, or interactive controls depending on scenario.",
            "16x9",
          ),
          cruiseBeat(
            "Police pullover",
            "The showcase scenario: passenger notification, exterior voice comms, safety overrides, vehicle movement, and telephony channels — orchestrated into a single guided workflow surfacing the right controls in order.",
            "9x16",
          ),
          cruiseBeat(
            "Outcome",
            "Shipped in a partially-built form before Cruise shut down. The polished vision exists in Figma — the innovation was orchestration, not invention.",
          ),
        ],
      ),
      cruiseVignette(
        "av-state-module",
        "AV State Module",
        ["Visual design", "Interaction design"],
        "Context gain / picture over words / eye-scan reduction",
        [
          cruiseBeat(
            "The old design",
            "Colored pills scattered across four corners. The highest-priority pill would \"zit\" to center while others orbited. Operators scanned four regions to understand what the car was dealing with — words everywhere, no coherent picture.",
          ),
          cruiseMedia(
            "The redesign",
            "A persistent AV State Module — vehicle graphic fixed bottom-left. Doors, lights, passengers, seatbelts, collisions, and lidar footprints rendered on the illustration itself.",
            "1x1",
          ),
          cruiseBeat(
            "Inline controls",
            "The module became a lightweight control surface — lights, horn, exterior audio — without leaving context. Below 15mph, live lidar returns around the module showed proximity without cluttering the main view.",
            "9x16",
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
        "The terminal was never just a driving interface. It was the coordination layer for a small city of teams — recovery, security, customer service, tele-ops — who had been working in parallel tools and parallel rooms. Cards, modules, and rails were all variations on the same mandate: bring the right human into the loop at the right moment, without making them leave the scene.",
      ),
      cruiseVignette(
        "telephony-service",
        "Telephony Service",
        ["Communication design", "Systems thinking"],
        "Org insight / role convergence / communication design",
        [
          cruiseBeat(
            "The hardware constraint",
            "Cruise used Chevy Bolts — stock cars retrofitted in-house, not purpose-built AVs. Unlike Zoox, communication with the outside world had to be creative within production-vehicle limits.",
          ),
          cruiseBeat(
            "The blind spot",
            "Customer service could call passengers. Operators could move the vehicle. The business kept roles siloed — except the real world kept crossing that line. CS spoke with no idea what the operator was doing; operators had no channel to speak.",
            "1x1",
          ),
          cruiseMedia(
            "The solution",
            "Full telephony wired into the terminal — passenger cabin, front interior, exterior speakers, inter-operator channels. First-class feature, not an external tool.",
            "16x9",
          ),
          cruiseBeat(
            "Dual-channel audio",
            "Borrowed from 911 dispatch: left ear for operator-to-operator, right ear for scene audio. The ear told you the source — no visual lookup required.",
            "9x16",
          ),
          cruiseBeat(
            "Outcome",
            "Research and dogfooding confirmed what the org structure denied: the people moving the vehicle needed to speak, and the people speaking needed operational visibility.",
          ),
        ],
      ),
      cruiseProse(
        "cruise-intervention",
        "Three seconds",
        "By the time Cruise was running 500+ autonomous rides daily in San Francisco, human interventions had to complete in three seconds or less: connect, understand the blockage, issue an instruction, get moving. Everything that follows — new maneuver types, a floating toolbar, hotkeys — only makes sense against that clock.",
      ),
      cruiseVignette(
        "springloaded-splines",
        "Spring-Loaded Splines (Speculative)",
        ["Interaction design", "Human factors", "Systems thinking"],
        "Ergonomic evolution of a trusted paradigm / determinism as trust signal",
        [
          cruiseBeat(
            "The trust problem",
            "The old intervention stack assumed safety drivers in seat and engineers in close coordination. At 500+ autonomous rides a day in San Francisco, that model was a liability — interventions had to complete in three seconds. And operators only trusted what was deterministic.",
          ),
          cruiseBeat(
            "What fell short",
            "Pivot (a lane-preference nudge) and Assisted Pathing (breadcrumb control points) were non-deterministic — the car could ignore the input or sit there saying \"executing\" while doing nothing. Operators stopped trusting them, and stopped using them.",
            "1x1",
          ),
          cruiseBeat(
            "What they trusted",
            "Sudo was fully deterministic: drag, drop, and rotate a vehicle icon to the end-state pose, hold go, and the car closed the gap. Basic collision avoidance aside, it just executed. Operators loved it — you said where, it went there.",
            "9x16",
          ),
          cruiseMedia(
            "Spring-loaded splines",
            "An ergonomic evolution of Sudo. Moving the mouse generates a Bezier spline in real time between the vehicle and the cursor, previewing the most efficient feasible path. Kinematically infeasible positions are disallowed by design — the spring-loaded curves resist impossible configurations. For the common case (back up, assert around something, small adjustment) precise pose-and-place was overkill; splines handled short maneuvers faster and with less cognitive load, while preserving the determinism operators trusted.",
            "16x9",
          ),
          cruiseBeat(
            "Artifact status",
            "Never shipped. Cruise shut down before the behaviors-engineering collaboration needed to wire it into the AV stack could be completed. Figma prototypes exist.",
          ),
        ],
        "1x1",
      ),
      cruiseVignette(
        "alternate-intents",
        "Alternate Intents (Speculative)",
        ["AI-native design", "Interaction design", "Systems thinking"],
        "Surfacing latent machine intelligence / human-AI collaboration at the control layer",
        [
          cruiseBeat(
            "The insight",
            "At any moment the AV's planning stack has already solved multiple paths forward — it just picks one and discards the rest. That solved intelligence is invisible to the operator. Alternate Intents surfaces the unchosen, already-computed routes as selectable ghost paths on the map. Click one to preference it.",
          ),
          cruiseMedia(
            "Select, don't instruct",
            "Every other intervention made the operator tell the vehicle what to do — specify a pose, draw a path, define an end state. This inverts the model: the vehicle already did the planning, so the operator just says that one. Nothing to re-solve, so execution is near-immediate — no latency, no re-planning cycle, no waiting.",
            "16x9",
          ),
          cruiseBeat(
            "When the human sees more",
            "Sometimes a person perceives what the sensors can't — a pedestrian waving the car through, a construction worker's gesture, social context the ML ranker has no access to. In those moments the AV's second-best path is the correct one, and the operator can redirect toward a route the vehicle had already validated.",
            "1x1",
          ),
          cruiseBeat(
            "The stability problem",
            "Ghost paths flicker. The AV re-plans constantly, so alternates appear and vanish as the scene changes — you can't reliably click a path that might disappear in half a second. The tool only exposes alternates that hold past a stability threshold, scoped to conditions where stable options are likely.",
            "9x16",
          ),
          cruiseBeat(
            "Artifact status",
            "Never shipped. Cruise shut down before the behaviors-engineering collaboration needed to implement it in the AV stack could be completed. Figma prototypes exist.",
          ),
        ],
      ),
      cruiseVignette(
        "maneuver-controls-ui",
        "Maneuver Controls UI",
        ["Interaction design", "Research", "Human factors"],
        "Consumer patterns in safety-critical context / speed of access",
        [
          cruiseBeat(
            "The constraint",
            "Human factors mandated the upper half of the screen — the threat cone — stay free of UI. The vehicle points up, center screen. Everything else lives in the lower half.",
          ),
          cruiseBeat(
            "The problem",
            "HF built maneuver controls in a fly-out drawer, far bottom-right. Hidden by default. Operators connecting to a stuck vehicle need to read the scene, choose a maneuver, and engage — within three seconds. A drawer could cost a full second.",
            "1x1",
          ),
          cruiseMedia(
            "The solution",
            "Floating toolbar at bottom center, permanently visible, clear iconography with color and shape language. Hotkeys for experienced operators — eyes stay on the scene.",
            "16x9",
          ),
          cruiseBeat(
            "The insight",
            "Cruise's remote operators weren't air traffic controllers — they were regular people from food service and retail, making a little above minimum wage. A floating action toolbar with hotkeys is a video game pattern. Meeting them there was the correct design decision.",
            "9x16",
          ),
          cruiseBeat(
            "Outcome",
            "The three-second target wasn't just a product requirement. It was only achievable if the interface spoke the user's native language.",
          ),
        ],
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
  }
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

/** Case studies visible to this visitor — drops gated studies when locked. */
export function visibleCaseStudies(unlocked: boolean): CaseStudy[] {
  return unlocked ? caseStudies : caseStudies.filter((study) => !study.gated);
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