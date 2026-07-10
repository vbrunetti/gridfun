import type { Metadata } from "next";
import { CaseStudyDetail } from "@/components/case-studies/case-study-detail";
import type {
  CaseStudy,
  CraftVignette,
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
  tags: ["Title", "Beat", "Stat", "Quote", "Media"],
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
  sections: [...proseVariants, panelInventory, titleCoverDemo],
};

export default function LayoutExperimentsPage() {
  return (
    <CaseStudyDetail
      study={experimentsStudy}
      footerFallback={{ href: "/case-studies", label: "All case studies" }}
    />
  );
}
