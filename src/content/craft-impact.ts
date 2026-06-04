import { palette, portraitAccents } from "@/lib/colors";

/** Skill filters — each story carries one or more. */
export const craftSkills = [
  "ux-research",
  "design-systems",
  "interaction",
  "visual",
  "prototyping",
  "service-design",
  "accessibility",
  "motion",
  "data-viz",
  "leadership",
  "mobile",
  "web",
] as const;

export type CraftSkill = (typeof craftSkills)[number];

/** Subset shown in the sticky header — fits one row beside the title. */
export const craftHeaderFilterSkills: CraftSkill[] = [
  "ux-research",
  "design-systems",
  "interaction",
  "visual",
  "mobile",
  "web",
];

export const craftSkillLabels: Record<CraftSkill, string> = {
  "ux-research": "UX research",
  "design-systems": "Design systems",
  interaction: "Interaction",
  visual: "Visual",
  prototyping: "Prototyping",
  "service-design": "Service design",
  accessibility: "Accessibility",
  motion: "Motion",
  "data-viz": "Data viz",
  leadership: "Leadership",
  mobile: "Mobile",
  web: "Web",
};

export type ImpactStory = {
  id: string;
  title: string;
  /** Display date, e.g. "Mar 2024" */
  date: string;
  skills: CraftSkill[];
  /** Placeholder portrait fill */
  accent: keyof typeof palette;
};

export const impactStories: ImpactStory[] = [
  {
    id: "checkout-recovery",
    title: "Checkout recovery lifted completed purchases 24%",
    date: "Nov 2023",
    skills: ["ux-research", "interaction", "web"],
    accent: portraitAccents[0],
  },
  {
    id: "care-triage",
    title: "Nurse triage time cut by 18 minutes per shift",
    date: "Jan 2024",
    skills: ["ux-research", "service-design", "mobile"],
    accent: portraitAccents[1],
  },
  {
    id: "ds-adoption",
    title: "Design system shipped to 6 product squads in 90 days",
    date: "Mar 2024",
    skills: ["design-systems", "leadership", "web"],
    accent: portraitAccents[2],
  },
  {
    id: "onboarding-activation",
    title: "Day-7 activation up 31% after onboarding rewrite",
    date: "Jun 2023",
    skills: ["interaction", "visual", "mobile"],
    accent: portraitAccents[3],
  },
  {
    id: "wcag-audit",
    title: "WCAG AA pass rate moved from 62% to 98%",
    date: "Sep 2023",
    skills: ["accessibility", "design-systems", "web"],
    accent: portraitAccents[4],
  },
  {
    id: "retail-discovery",
    title: "Browse-to-bag rate improved 19% on discovery surfaces",
    date: "Aug 2024",
    skills: ["ux-research", "visual", "web"],
    accent: portraitAccents[5],
  },
  {
    id: "ops-dashboard",
    title: "Ops leaders adopted a single metrics dashboard in 3 weeks",
    date: "Feb 2024",
    skills: ["data-viz", "interaction", "web"],
    accent: portraitAccents[6],
  },
  {
    id: "proto-lab",
    title: "Prototype lab shortened concept validation from 6 weeks to 10 days",
    date: "May 2023",
    skills: ["prototyping", "leadership", "interaction"],
    accent: portraitAccents[0],
  },
  {
    id: "motion-language",
    title: "Motion language reduced perceived load time on slow networks",
    date: "Jul 2024",
    skills: ["motion", "visual", "mobile"],
    accent: portraitAccents[1],
  },
  {
    id: "claims-journey",
    title: "Claims journey NPS rose 22 points after service blueprinting",
    date: "Oct 2023",
    skills: ["service-design", "ux-research", "web"],
    accent: portraitAccents[2],
  },
  {
    id: "field-app",
    title: "Field technicians completed jobs 14% faster offline-first",
    date: "Apr 2024",
    skills: ["mobile", "prototyping", "accessibility"],
    accent: portraitAccents[3],
  },
  {
    id: "pricing-clarity",
    title: "Pricing comprehension errors dropped 40% in usability tests",
    date: "Dec 2023",
    skills: ["ux-research", "visual", "web"],
    accent: portraitAccents[4],
  },
  {
    id: "token-rollout",
    title: "Token rollout unified brand color across 4 legacy apps",
    date: "Nov 2024",
    skills: ["design-systems", "visual", "web"],
    accent: portraitAccents[5],
  },
  {
    id: "exec-storytelling",
    title: "Executive reviews approved roadmap 2 cycles earlier",
    date: "Mar 2023",
    skills: ["leadership", "data-viz", "prototyping"],
    accent: "charcoal",
  },
  {
    id: "voice-assist",
    title: "Voice assist task success reached 89% on first launch",
    date: "Jun 2024",
    skills: ["interaction", "accessibility", "mobile"],
    accent: portraitAccents[6],
  },
  {
    id: "analytics-explorer",
    title: "Self-serve analytics cut ad-hoc data requests by half",
    date: "Aug 2023",
    skills: ["data-viz", "ux-research", "web"],
    accent: "lightGray",
  },
  {
    id: "loyalty-loop",
    title: "Loyalty loop increased repeat visits 17% in pilot markets",
    date: "Jan 2025",
    skills: ["service-design", "motion", "mobile"],
    accent: portraitAccents[0],
  },
  {
    id: "handoff-kit",
    title: "Engineering handoff defects fell 35% with spec templates",
    date: "Feb 2025",
    skills: ["design-systems", "prototyping", "leadership"],
    accent: "offWhite",
  },
];

export function storyMatchesActiveSkills(
  story: ImpactStory,
  activeSkills: ReadonlySet<CraftSkill>,
) {
  if (activeSkills.size === 0) return false;
  return story.skills.some((skill) => activeSkills.has(skill));
}

/** Stable two-digit index (01…) from master story order — unchanged when filtering. */
export function craftStoryIndexLabel(storyId: string) {
  const i = impactStories.findIndex((s) => s.id === storyId);
  const n = i >= 0 ? i + 1 : 0;
  return String(n).padStart(2, "0");
}
