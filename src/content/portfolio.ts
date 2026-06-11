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

/**
 * One frame in a vignette's horizontal chapter.
 *
 * A frame is either a *media* frame (image / gif via `src`, or Vimeo via `vimeo`)
 * or a *color-field* frame (`colorField: true`) where type carries the beat and
 * the accent is the ground. Either way it can hold a narrative beat: a `label`
 * (mono-caps kicker, e.g. "The problem") plus `body` prose tied to this frame.
 */
export type VignetteImage = {
  /** Portrait (9×16), landscape (16×9), or square (1×1). */
  ratio: ImageRatio;
  /** Placeholder fill until a real source is provided; also the color-field ground. */
  accent: AccentKey;
  /** Optional real image / gif source (overrides the placeholder fill). */
  src?: string;
  /** Vimeo video ID or full vimeo.com URL — renders a player instead of an image. */
  vimeo?: string;
  /** Render as a type-driven color field instead of media. */
  colorField?: boolean;
  /** Beat kicker (mono caps), e.g. "The problem". */
  label?: string;
  /** Beat narrative — prose married to this frame. */
  body?: string;
  /** Reverse-out ground; omit to let the chapter pick a random-feeling surface. */
  surface?: FrameSurface;
  caption?: string;
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

export type CaseStudy = {
  slug: string;
  name: string;
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
  /** Ordered mix of prose sections and craft vignettes. */
  sections: CaseStudySection[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "cruise-teleops",
    name: "Tele-Operations Terminal",
    subhead:
      "Designing the human side of an autonomous fleet — context gain over a black box.",
    date: "2023",
    client: "Cruise",
    location: "San Francisco, CA",
    role: "Lead product designer",
    tools: "Figma, motion prototyping, operator research",
    sections: [
      {
        type: "prose",
        id: "cruise-intro",
        heading: "The terminal",
        body: "Cruise's remote operators were the humans in the loop of a driverless fleet — the people a stuck robotaxi phoned for help, often with seconds to act. The terminal they worked in was built by human-factors researchers on radar and air-traffic-control tradition: rigorous, safety-first, and almost entirely blind to what the machine already knew.\n\nThe through-line across this work is a single idea — context gain. The AV's AI perceived, classified, and planned constantly; very little of that intelligence reached the operator. Each vignette is one move toward closing that gap: surfacing what the system knew, in a form a human under stress could read in seconds.",
      },
      {
        type: "vignette",
        slug: "semantic-color-shape",
        name: "Semantic Color + Shape Language",
        keyImageRatio: "16x9",
        keyImageAccent: "charcoal",
        tags: ["Visual design", "Data viz", "Human factors"],
        themeLine: "Context gain / semantic legibility / color as meaning",
        status: "Shipped",
        images: [
          {
            ratio: "16x9",
            accent: "charcoal",
            colorField: true,
            label: "The problem",
            body: "Operators viewed the AV scene entirely in orange-on-black. Every object — pedestrian, cyclist, vehicle, immovable obstacle — rendered identically. The convention was legitimate human-factors science (high contrast, eye-safe in the dark, ATC and gauge tradition). But it made every object in the scene visually equivalent.",
          },
          {
            ratio: "16x9",
            accent: "charcoal",
            src: "/portfolio/cruise/before-16x9.jpg",
            label: "Before",
            caption:
              "The legacy scene: a single orange encoding for every object type. Safe for the eyes, silent about meaning.",
          },
          {
            ratio: "1x1",
            accent: "charcoal",
            colorField: true,
            label: "The insight",
            body: "The system was informed by human factors but not by color theory or semantic design. Meanwhile the AV's AI could already classify everything it perceived. That intelligence existed — it just wasn't surfaced. The machine knew. The human didn't.",
          },
          {
            ratio: "1x1",
            accent: "charcoal",
            src: "/portfolio/cruise/solution-1x1.jpg",
            label: "The solution",
            caption:
              "A universal color + shape language: each object class gets a distinct hue and a footprint shape mapped to its radar/lidar return.",
          },
          {
            ratio: "9x16",
            accent: "charcoal",
            src: "/portfolio/cruise/scene-9x16.jpg",
            label: "In scene",
            caption:
              "Pedestrians, cyclists, vehicles, and static objects read at a glance — the semantic meaning of the scene became immediately legible.",
          },
          {
            ratio: "16x9",
            accent: "charcoal",
            colorField: true,
            label: "Outcome",
            body: "Operators gained context about the scene faster and more accurately — the first move in a broader context-gain philosophy that shaped the rest of the terminal.",
          },
        ],
      },
    ],
  },
  {
    slug: "northwind-payments",
    name: "Payments that recover themselves",
    subhead:
      "Rebuilding checkout failure as a recoverable fork — not a dead end.",
    date: "2024",
    client: "Northwind",
    location: "Remote · US & EU",
    role: "Lead product designer",
    tools: "Figma, React, Amplitude",
    clientLogo: "/portfolio/logos/northwind.svg",
    sections: [
      {
        type: "prose",
        id: "northwind-intro",
        heading: "The brief",
        body: "Northwind's checkout leaked revenue at the worst possible moment — the tap to pay. Cards bounced, sessions timed out, and customers were dropped onto a dead end with no way back.\n\nWe rebuilt the final stretch of the funnel as a recoverable flow: every failure became a fork rather than a wall, and the interface learned to hold the customer's place until the payment cleared.",
      },
      {
        type: "vignette",
        slug: "checkout-recovery",
        name: "Checkout recovery flow",
        keyImageRatio: "9x16",
        keyImageAccent: portraitAccents[0],
        tags: ["User research", "Interaction", "Web"],
        images: [
          {
            ratio: "16x9",
            accent: "neonLime",
            caption:
              "The failure state, reframed. Instead of a dead end, a declined card now opens a calm recovery sheet with the next best action pre-selected.",
          },
          { ratio: "9x16", accent: "offWhite", caption: "Retry, switch method, or save for later — three doors, no shame." },
          {
            ratio: "16x9",
            accent: "lightGray",
            vimeo: "1199955340",
            caption:
              "Recovery flow walkthrough — the sheet opens in context while the cart stays visible.",
          },
          {
            ratio: "9x16",
            accent: "charcoal",
            caption:
              "Completed-purchase rate lifted 24% in the first month after launch.",
          },
        ],
      },
      {
        type: "prose",
        id: "northwind-mid",
        heading: "Why a sheet, not a page",
        body: "A full-page error throws away context. A sheet keeps the cart, the total, and the customer's intent visible the entire time — so recovering feels like continuing, not starting over.",
      },
      {
        type: "vignette",
        slug: "express-pay-sheet",
        name: "Express pay sheet",
        keyImageRatio: "16x9",
        keyImageAccent: portraitAccents[1],
        tags: ["Interaction", "Motion", "Mobile"],
        images: [
          { ratio: "9x16", accent: "hotPink", caption: "One-thumb reach: the primary action never leaves the bottom third." },
          { ratio: "16x9", accent: "offWhite" },
          { ratio: "9x16", accent: "skyBlue", caption: "Motion confirms success before the network does — perceived speed beats actual speed." },
        ],
      },
    ],
  },
  {
    slug: "meridian-care",
    name: "Triage at the speed of a shift",
    subhead:
      "A single triage board and a handoff ritual built for the chaos of a ward.",
    date: "2024",
    client: "Meridian Health",
    location: "Boston, MA",
    role: "Product designer",
    tools: "Figma, Miro, React Native",
    clientLogo: "/portfolio/logos/meridian.svg",
    sections: [
      {
        type: "prose",
        id: "meridian-intro",
        heading: "Context",
        body: "Nurses on Meridian's floors were triaging from memory, sticky notes, and three different screens. The cost wasn't just time — it was the cognitive load of holding a whole ward in your head.\n\nWe designed a single triage board that surfaces the right patient at the right moment, and a handoff ritual that survives the chaos of a shift change.",
      },
      {
        type: "vignette",
        slug: "nurse-triage-board",
        name: "Nurse triage board",
        keyImageRatio: "9x16",
        keyImageAccent: portraitAccents[2],
        tags: ["Service design", "User research", "Mobile"],
        images: [
          { ratio: "9x16", accent: "royalBlue", caption: "Priority sorts itself. The board re-ranks patients as vitals and wait times change." },
          { ratio: "16x9", accent: "offWhite", caption: "Color is information, never decoration — every hue maps to an acuity level." },
          { ratio: "9x16", accent: "lightGray" },
        ],
      },
      {
        type: "vignette",
        slug: "shift-handoff",
        name: "Shift handoff",
        keyImageRatio: "16x9",
        keyImageAccent: portraitAccents[3],
        tags: ["Service design", "Accessibility", "Web"],
        images: [
          { ratio: "16x9", accent: "skyBlue", caption: "The handoff is a story, not a spreadsheet — outgoing nurses leave a narrative, not a data dump." },
          { ratio: "9x16", accent: "offWhite" },
          { ratio: "16x9", accent: "charcoal", caption: "Triage time fell by 18 minutes per shift." },
        ],
      },
    ],
  },
  {
    slug: "loft-discovery",
    name: "From browse to bag",
    subhead:
      "Giving discovery a direction — every interaction nudges toward the bag.",
    date: "2023",
    client: "Loft",
    location: "New York, NY",
    role: "Lead product designer",
    tools: "Figma, Principle, Next.js",
    clientLogo: "/portfolio/logos/loft.svg",
    sections: [
      {
        type: "prose",
        id: "loft-intro",
        heading: "The opportunity",
        body: "Loft's customers loved to browse and rarely bought. The discovery surface was beautiful and aimless — endless scroll with no sense of momentum toward a purchase.\n\nWe gave browsing a direction: every interaction nudges quietly toward the bag, without ever feeling like a sales pitch.",
      },
      {
        type: "vignette",
        slug: "discovery-rail",
        name: "Discovery rail",
        keyImageRatio: "16x9",
        keyImageAccent: portraitAccents[5],
        tags: ["Visual design", "Interaction", "Web"],
        images: [
          { ratio: "16x9", accent: "mediumBlue", caption: "Editorial-grade imagery, shopping-grade intent. The rail reads like a magazine and behaves like a store." },
          { ratio: "9x16", accent: "offWhite" },
          { ratio: "16x9", accent: "lightGray", caption: "" },
        ],
      },
      {
        type: "prose",
        id: "loft-mid",
        heading: "Momentum as a metric",
        body: "We stopped optimizing for time-on-site and started optimizing for forward motion — each tap should leave the customer measurably closer to a decision.",
      },
      {
        type: "vignette",
        slug: "bag-and-checkout",
        name: "Bag & checkout",
        keyImageRatio: "9x16",
        keyImageAccent: portraitAccents[6],
        tags: ["Interaction", "Prototyping", "Web"],
        images: [
          { ratio: "9x16", accent: "mediumGray", caption: "The bag is always one gesture away, and always honest about totals." },
          { ratio: "16x9", accent: "offWhite", caption: "Browse-to-bag rate improved 19% on discovery surfaces." },
        ],
      },
    ],
  },
  {
    slug: "atlas-design-system",
    name: "One system, six teams",
    subhead:
      "A design system good enough that adoption felt like relief, not mandate.",
    date: "2025",
    client: "Atlas",
    location: "San Francisco, CA",
    role: "Design systems lead",
    tools: "Figma, Storybook, Style Dictionary",
    clientLogo: "/portfolio/logos/atlas.svg",
    sections: [
      {
        type: "prose",
        id: "atlas-intro",
        heading: "Why now",
        body: "Atlas had six product squads and six subtly different blues. A design system wasn't a luxury — it was the only way to ship coherently at the pace the business demanded.\n\nThe work was equal parts craft and politics: build something good enough that adoption felt like a relief, not a mandate.",
      },
      {
        type: "vignette",
        slug: "token-pipeline",
        name: "Token pipeline",
        keyImageRatio: "16x9",
        keyImageAccent: portraitAccents[0],
        tags: ["Design systems", "Visual design", "Web"],
        images: [
          { ratio: "16x9", accent: "neonLime", caption: "One source of truth, every platform downstream. Tokens flow from design to code automatically." },
          { ratio: "9x16", accent: "offWhite" },
          { ratio: "16x9", accent: "lightGray", caption: "A single token rollout unified brand color across four legacy apps." },
        ],
      },
      {
        type: "vignette",
        slug: "component-docs",
        name: "Living component docs",
        keyImageRatio: "9x16",
        keyImageAccent: portraitAccents[1],
        tags: ["Design systems", "Accessibility", "Web"],
        images: [
          { ratio: "9x16", accent: "hotPink", caption: "Docs that ship with the code, so they can never drift out of date." },
          { ratio: "16x9", accent: "offWhite", caption: "Every component arrives with its accessibility contract written down." },
        ],
      },
      {
        type: "vignette",
        slug: "adoption-dashboard",
        name: "Adoption dashboard",
        keyImageRatio: "16x9",
        keyImageAccent: portraitAccents[2],
        tags: ["Data viz", "Leadership", "Web"],
        images: [
          { ratio: "16x9", accent: "royalBlue", caption: "Adoption made visible. Leaders could see, squad by squad, how much of each surface was on-system." },
          { ratio: "9x16", accent: "offWhite" },
          { ratio: "16x9", accent: "charcoal", caption: "Shipped to all six product squads in 90 days." },
        ],
      },
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

/** Deduped union of every tag used by any vignette (first-seen order). */
export function allCraftTags(): string[] {
  return dedupe(getAllVignettes().flatMap(({ vignette }) => vignette.tags));
}

/** OR-match: a vignette is shown if it has at least one active tag. */
export function vignetteMatchesActiveTags(
  vignette: CraftVignette,
  activeTags: ReadonlySet<string>,
): boolean {
  if (activeTags.size === 0) return false;
  return vignette.tags.some((tag) => activeTags.has(tag));
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
