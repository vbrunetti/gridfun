import { palette, portraitAccents } from "@/lib/colors";

/**
 * Portfolio content model.
 *
 * Hierarchy:
 *   CaseStudy
 *     └─ sections[]  (ordered, freely interleaved)
 *          ├─ ProseSection   — original writing (heading + body)
 *          └─ CraftVignette  — key image + tags + 9×16 images with captions
 *
 * A vignette belongs to exactly one case study. Craft tags are free-form
 * strings; the Craft page filter set is derived from the union of all tags
 * actually used across vignettes.
 *
 * Visuals are placeholder accent fills today — swap `accent` for real image
 * sources when content lands, without changing the shape of this model.
 */

export type AccentKey = keyof typeof palette;

/** Key image is square or portrait; drives the masonry tile shape. */
export type KeyImageRatio = "1x1" | "9x16";

/** One 9×16 image inside a vignette. Caption may be empty → a paragraph. */
export type VignetteImage = {
  /** Placeholder fill until a real image source is provided. */
  accent: AccentKey;
  /** Optional real image source (overrides the placeholder fill). */
  src?: string;
  caption?: string;
};

export type CraftVignette = {
  type: "vignette";
  /** Unique across the whole site — powers /craft/[vignette]. */
  slug: string;
  name: string;
  keyImageRatio: KeyImageRatio;
  /** Placeholder key-image fill until a real source is provided. */
  keyImageAccent: AccentKey;
  keyImageSrc?: string;
  /** Free-form, ~1–3 words each, unlimited. */
  tags: string[];
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
  /** Display date, e.g. "2024" or "Mar 2024". */
  date: string;
  client: string;
  /** Placeholder client logo source; falls back to a wordmark when absent. */
  clientLogo?: string;
  /** Ordered mix of prose sections and craft vignettes. */
  sections: CaseStudySection[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "northwind-payments",
    name: "Payments that recover themselves",
    date: "2024",
    client: "Northwind",
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
            accent: "neonLime",
            caption:
              "The failure state, reframed. Instead of a dead end, a declined card now opens a calm recovery sheet with the next best action pre-selected.",
          },
          { accent: "offWhite", caption: "Retry, switch method, or save for later — three doors, no shame." },
          { accent: "lightGray" },
          {
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
        keyImageRatio: "1x1",
        keyImageAccent: portraitAccents[1],
        tags: ["Interaction", "Motion", "Mobile"],
        images: [
          { accent: "hotPink", caption: "One-thumb reach: the primary action never leaves the bottom third." },
          { accent: "offWhite" },
          { accent: "skyBlue", caption: "Motion confirms success before the network does — perceived speed beats actual speed." },
        ],
      },
    ],
  },
  {
    slug: "meridian-care",
    name: "Triage at the speed of a shift",
    date: "2024",
    client: "Meridian Health",
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
          { accent: "royalBlue", caption: "Priority sorts itself. The board re-ranks patients as vitals and wait times change." },
          { accent: "offWhite", caption: "Color is information, never decoration — every hue maps to an acuity level." },
          { accent: "lightGray" },
        ],
      },
      {
        type: "vignette",
        slug: "shift-handoff",
        name: "Shift handoff",
        keyImageRatio: "1x1",
        keyImageAccent: portraitAccents[3],
        tags: ["Service design", "Accessibility", "Web"],
        images: [
          { accent: "skyBlue", caption: "The handoff is a story, not a spreadsheet — outgoing nurses leave a narrative, not a data dump." },
          { accent: "offWhite" },
          { accent: "charcoal", caption: "Triage time fell by 18 minutes per shift." },
        ],
      },
    ],
  },
  {
    slug: "loft-discovery",
    name: "From browse to bag",
    date: "2023",
    client: "Loft",
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
        keyImageRatio: "9x16",
        keyImageAccent: portraitAccents[5],
        tags: ["Visual design", "Interaction", "Web"],
        images: [
          { accent: "mediumBlue", caption: "Editorial-grade imagery, shopping-grade intent. The rail reads like a magazine and behaves like a store." },
          { accent: "offWhite" },
          { accent: "lightGray", caption: "" },
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
        keyImageRatio: "1x1",
        keyImageAccent: portraitAccents[6],
        tags: ["Interaction", "Prototyping", "Web"],
        images: [
          { accent: "mediumGray", caption: "The bag is always one gesture away, and always honest about totals." },
          { accent: "offWhite", caption: "Browse-to-bag rate improved 19% on discovery surfaces." },
        ],
      },
    ],
  },
  {
    slug: "atlas-design-system",
    name: "One system, six teams",
    date: "2025",
    client: "Atlas",
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
        keyImageRatio: "1x1",
        keyImageAccent: portraitAccents[0],
        tags: ["Design systems", "Visual design", "Web"],
        images: [
          { accent: "neonLime", caption: "One source of truth, every platform downstream. Tokens flow from design to code automatically." },
          { accent: "offWhite" },
          { accent: "lightGray", caption: "A single token rollout unified brand color across four legacy apps." },
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
          { accent: "hotPink", caption: "Docs that ship with the code, so they can never drift out of date." },
          { accent: "offWhite", caption: "Every component arrives with its accessibility contract written down." },
        ],
      },
      {
        type: "vignette",
        slug: "adoption-dashboard",
        name: "Adoption dashboard",
        keyImageRatio: "1x1",
        keyImageAccent: portraitAccents[2],
        tags: ["Data viz", "Leadership", "Web"],
        images: [
          { accent: "royalBlue", caption: "Adoption made visible. Leaders could see, squad by squad, how much of each surface was on-system." },
          { accent: "offWhite" },
          { accent: "charcoal", caption: "Shipped to all six product squads in 90 days." },
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
