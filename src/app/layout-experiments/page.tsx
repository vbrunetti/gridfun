import type { Metadata } from "next";
import { CaseStudyDetail } from "@/components/case-studies/case-study-detail";
import { clientBrandColorVar } from "@/lib/client-brand-colors";
import type {
  CaseStudy,
  CraftVignette,
  MosaicCell,
  ProseSection,
} from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Layout experiments",
};

/**
 * Canonical reference gallery for prose layout variants + vignette panel types.
 * Modeled as a synthetic case study so it runs through the exact same detail
 * deck (`CaseStudyDetail`) the real case studies use — every prose variant is a
 * real prose step, and the panel inventory is a real horizontal filmstrip.
 *
 * This file holds ONLY placeholder content/specimens — no rendering logic. A
 * layout change is made in the shared source (ProseBlock / VignetteChapter /
 * their CSS + types), so it propagates to this gallery AND every case study at
 * once. See AGENTS.md → "Canonical layout references". Throwaway harness:
 * remove this page + its nav line in site.ts once the systems are dialed in.
 */

const CRUISE = "charcoal" as const;

const proseVariants: ProseSection[] = [
  {
    type: "prose",
    id: "x-statement",
    variant: "statement",
    heading: "Statement", // rail label only; the statement variant hides it
    body: "Time wasn't one factor among many. It was the factor: the risk of a recovery event grew exponentially with every second the vehicle stayed stuck.",
  },
  {
    type: "prose",
    id: "x-lede",
    variant: "lede",
    heading: "The design problem, restated",
    body: "Time was the stakes. Context was the mechanism. Once you accept that the AV already knows more than it shows, the design problem shifts from “build a better display” to “translate machine perception into human-readable meaning.”\n\nThat's where the work below begins.",
  },
  {
    type: "prose",
    id: "x-columns",
    variant: "columns",
    heading: "The room around the operator",
    body: "Reading the Scene solved what an operator could see on the map. But an operator was never just a person alone with a screen. Remote Assistant Advisors worked inside a wider ecosystem: Customer Service handling the passenger, Subject-Matter Experts stepping in on the hardest scenes, Supervisors walking the floor.\n\nEach of these people had their own tools and their own partial view of the situation, and often no idea what the others could see. Designing the Terminal meant designing for that whole ecosystem, and it started with something as basic as where things lived on the operator's own screen.\n\nThe center of the screen had become a wildcard — a maneuver control, an object classification, a collision workflow. Predictable where to look, unpredictable what you'd find. Regionalizing by content type turned layout itself into a cognitive aid.",
  },
  {
    type: "prose",
    id: "x-epigraph",
    variant: "epigraph",
    heading: "Epigraph", // rail label only; the epigraph variant hides it
    body: "A vehicle correcting itself imperfectly but visibly in motion read as competent. A vehicle sitting dead still read as broken — an inert two-ton lump of batteries and computers. Progress, not perfection, was the signal that mattered.",
    attribution: "Design thesis — Cruise Terminal, 2023",
  },
  {
    type: "prose",
    id: "x-meta",
    variant: "meta",
    heading: "Before the work",
    body: "Terminal v1 was built for empty streets at night: no traffic to negotiate, no police or emergency vehicles to manage. Signal fidelity was the priority — a reasonable design for a testing program. Then the business needed to scale into real hours and real traffic, and the old model turned out to be solving the wrong problem.",
    meta: [
      { label: "Context", value: "Night-only AV testing" },
      { label: "Constraint", value: "Non-deterministic ML path" },
      { label: "Stakes", value: "Exponential recovery risk" },
      { label: "Window", value: "3 seconds to first action" },
    ],
  },
  {
    type: "prose",
    id: "x-figure",
    variant: "figure",
    heading: "Context gain",
    stat: "~20%",
    body: "As a result of the semantic color and shape work, operators gained context about the scene roughly 20% faster and more accurately than before — the difference between watching a black box and reading a scene.",
  },
  {
    type: "prose",
    id: "x-figure-stack",
    variant: "figure-stack",
    heading: "Figure stack",
    stat: "21 sec.",
    body: "Same figure vocabulary, supporting prose stacked under the number so wide metrics never collide with the copy.",
  },
  {
    type: "prose",
    id: "x-media",
    variant: "media",
    heading: "One encoding for everything",
    body: "Operators viewed the entire AV scene in orange-on-black. Every object type — pedestrian, cyclist, vehicle, immovable obstacle — rendered identically. Legitimate human-factors science, but every object in the scene was visually equivalent, and the machine's own classification never reached the human.",
    media: {
      ratio: "16x9",
      accent: CRUISE,
    },
  },
  {
    type: "prose",
    id: "x-media-band",
    variant: "media-band",
    heading: "The bentable box model",
    body: "",
    media: {
      ratio: "16x9",
      accent: CRUISE,
      caption: "Region map: type-based zones with a protected centerline.",
    },
  },
];

/** One frame of each panel type — rendered as a real horizontal filmstrip.
 *  The title panel is prepended automatically by VignetteChapter. */
const panelInventory: CraftVignette = {
  type: "vignette",
  slug: "panel-inventory",
  name: "Panel Inventory",
  keyImageRatio: "16x9",
  keyImageAccent: "cruise", // vibrant ground for the color-field title treatment
  titleTreatment: "color",
  tags: ["Title", "Beat", "Stat", "Quote", "Thesis", "Media"],
  themeLine: "Every filmstrip panel type in one chapter",
  titlePanelWidth: { desktop: 8, mobile: 6 },
  images: [
    {
      ratio: "16x9",
      accent: CRUISE,
      colorField: true,
      label: "Beat — color field",
      body: "The machine already knew what was there — the human just couldn't see it.",
    },
    {
      ratio: "16x9",
      accent: CRUISE,
      label: "Media — 16×9",
      caption: "Landscape frame: kicker + still + caption.",
      src: "/portfolio/cruise/cruise_v1_full.jpg",
    },
    {
      ratio: "9x16",
      accent: CRUISE,
      label: "Media — 9×16",
      caption: "Portrait frame: same anatomy, tall shape.",
    },
    {
      ratio: "1x1",
      accent: CRUISE,
      label: "Media — carousel",
      caption: "Multi-source: dot rail + hover arrows under the frame.",
      sources: [
        "/portfolio/cruise/cruise_v1_c1.jpg",
        "/portfolio/cruise/cruise_v1_c2.jpg",
        "/portfolio/cruise/cruise_v1_c3.jpg",
      ],
    },
    {
      ratio: "16x9",
      accent: CRUISE,
      label: "Media — video",
      caption: "Vimeo: borderless background loop or player.",
      vimeo: "1205288733",
      vimeoBackground: true,
      poster: "/portfolio/cruise/Cruise_v1_before_poster.png",
    },
    {
      ratio: "16x9",
      accent: CRUISE,
      label: "Stat",
      stat: "~20%",
      body: "Quantified impact: kicker + lede + oversized display-metric figure.",
      width: { desktop: 12, mobile: 6 },
    },
    {
      ratio: "1x1",
      accent: CRUISE,
      label: "Quote",
      quote: "There is a lot more information placed logically in T2.",
      quoteCite: "Advisor · T2 usability study",
      width: { desktop: 8, mobile: 6 },
    },
    {
      ratio: "1x1",
      accent: CRUISE,
      label: "Thesis",
      thesis: "Automate first.",
      body: "Few-word billboard: kicker + display-scale line + optional lede.",
      width: { desktop: 8, mobile: 6 },
    },
  ],
};

/* Experiment fill: a seeded (stable across reloads) random mix of grid
   placeholders, big impact numbers, and flat fields derived from the brand
   color. Every frame gets at least one of each, extras are random. */
const BRAND = clientBrandColorVar("cruise-primary");
const FIELD_TONES = [
  BRAND,
  `color-mix(in srgb, ${BRAND} 65%, black)`,
  `color-mix(in srgb, ${BRAND} 35%, black)`,
  `color-mix(in srgb, ${BRAND} 55%, white)`,
  `color-mix(in srgb, ${BRAND} 14%, black)`,
];
const STATS: { stat: string; label: string }[] = [
  { stat: ">20%", label: "Faster context" },
  { stat: "3 sec.", label: "First action" },
  { stat: "-38%", label: "Recovery events" },
  { stat: "12x", label: "Fleet per advisor" },
  { stat: "94%", label: "Task success" },
  { stat: "2.1M", label: "Rides supported" },
  { stat: "4.6", label: "Advisor CSAT" },
];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260929);
const pick = <T,>(list: readonly T[]): T => list[Math.floor(rand() * list.length)]!;

function mosaicCell(kind: "media" | "stat" | "field"): MosaicCell {
  if (kind === "media") {
    return { kind: "media", accent: pick(["charcoal", "cruise"] as const) };
  }
  if (kind === "stat") return { kind: "stat", ...pick(STATS) };
  return { kind: "field", color: pick(FIELD_TONES) };
}

function randomCells(count: number): MosaicCell[] {
  const kinds: ("media" | "stat" | "field")[] = ["media", "stat", "field"];
  kinds.sort(() => rand() - 0.5);
  while (kinds.length < count) kinds.push(pick(["media", "stat", "field"] as const));
  return kinds.slice(0, count).map(mosaicCell);
}

/** Simulated /case-studies index row: a title panel followed by empty mosaic
 *  frames — geometry only (ratios, widths, cell presets), no content. */
const mosaicGeometry: CraftVignette = {
  type: "vignette",
  slug: "mosaic-geometry",
  name: "Autonomous Vehicle Tele-Operations",
  keyImageRatio: "16x9",
  keyImageAccent: "cruise",
  titleTreatment: "index",
  titleIndex: {
    client: "Cruise",
    subhead: "Designing the human component of an autonomous fleet.",
    href: "/case-studies/cruise-teleops",
    brand: { field: "cruise-primary", logo: "/portfolio/logos/cruise.png" },
    railTint: "black",
  },
  tags: [
    "Visual design",
    "Data visualization",
    "Interaction design",
    "Human factors",
    "Information architecture",
    "Research",
    "Motion",
    "Workflow & ops",
    "Systems thinking",
    "Communication design",
    "AI-native design",
  ],
  themeLine: "Index row: title panel + empty mosaic frames",
  titlePanelWidth: { desktop: 8, mobile: 6 },
  images: [
    {
      ratio: "16x9",
      accent: CRUISE,
      label: "Mosaic — feature",
      mosaic: randomCells(3).map((cell, i) =>
        i === 0
          ? {
              kind: "quote",
              label: "Proof It Worked",
              quote: "[This] gives me information in a much more intuitive way.",
              cite: "Remote Advisor Research Participant",
            }
          : cell,
      ),
      mosaicLayout: "feature",
    },
    {
      ratio: "16x9",
      accent: CRUISE,
      label: "Mosaic — feature-stack",
      mosaic: randomCells(4),
      mosaicLayout: "feature-stack",
    },
    {
      ratio: "16x9",
      accent: CRUISE,
      label: "Mosaic — quad",
      mosaic: randomCells(4).map((cell, i) =>
        i === 2
          ? {
              kind: "stat",
              label:
                "As a result of the improved context-awareness work, Remote Advisors improved their time to first action (TTFA) by about twenty percent, with greater accuracy than before.",
              stat: "~20%",
            }
          : cell,
      ),
      mosaicLayout: "quad",
    },
    {
      ratio: "1x1",
      accent: CRUISE,
      label: "Cruise",
      panelBg: "cruise-primary",
      cta: {
        label: "View case study",
        href: "/case-studies/cruise-teleops",
      },
    },
  ],
};

/** Second chapter — same filmstrip, but a full-bleed cover-image title panel. */
const titleCoverDemo: CraftVignette = {
  type: "vignette",
  slug: "title-cover-demo",
  name: "Reading the Scene",
  keyImageRatio: "16x9",
  keyImageAccent: CRUISE,
  keyImageSrc: "/portfolio/cruise/cruise_v1_full.jpg",
  titleTreatment: "cover",
  titleCoverBlur: 4, // demo — sharpen by lowering/removing
  titleCoverAlpha: 0.7, // demo — screen it back; raise toward 1 for a bolder photo
  tags: ["Visual design", "Data visualization", "Human factors"],
  themeLine: "Cover-image title treatment",
  titlePanelWidth: { desktop: 8, mobile: 6 },
  images: [
    {
      ratio: "16x9",
      accent: CRUISE,
      colorField: true,
      label: "The problem",
      body: "Operators viewed the AV scene entirely in orange-on-black — every object type rendered identically.",
    },
    {
      ratio: "16x9",
      accent: CRUISE,
      label: "In scene",
      caption: "Objects read at a glance once color + shape carried meaning.",
      src: "/portfolio/cruise/cruise_v1_full.jpg",
    },
  ],
};

const experimentsStudy: CaseStudy = {
  slug: "layout-experiments",
  name: "Layout Experiments",
  subhead:
    "Prose layout variants and every vignette panel type, on the real detail scroll engine.",
  date: "2026",
  client: "Internal",
  location: "—",
  role: "Reference",
  tools: "Source of truth",
  brand: { field: "cruise-primary" },
  sections: [...proseVariants, panelInventory, mosaicGeometry, titleCoverDemo],
};

export default function LayoutExperimentsPage() {
  return (
    <CaseStudyDetail
      study={experimentsStudy}
      footerFallback={{ href: "/case-studies", label: "All case studies" }}
    />
  );
}
