export type HeroSlate = {
  id: string;
  eyebrow?: string;
  headline: string;
  supporting?: string;
};

export const heroSlates: HeroSlate[] = [
  {
    id: "slate-1",
    eyebrow: "UX · Product",
    headline: "Change is constant. Growth is inevitable.",
    supporting:
      "A portfolio shell built on grid literacy, bold type, and deliberate interaction.",
  },
  {
    id: "slate-2",
    eyebrow: "Systems",
    headline: "Design that scales across teams and surfaces.",
    supporting:
      "From flows to design ops — clarity at every layer of the stack.",
  },
  {
    id: "slate-3",
    eyebrow: "Research",
    headline: "Evidence before pixels.",
    supporting:
      "Interviews, journeys, and prototypes that de-risk the bet.",
  },
  {
    id: "slate-4",
    eyebrow: "Craft",
    headline: "Typography and rhythm as architecture.",
    supporting:
      "Ruled grids, contrast, and restraint — not decoration for its own sake.",
  },
  {
    id: "slate-5",
    eyebrow: "Motion",
    headline: "Scroll as a narrative instrument.",
    supporting:
      "Pinned moments, cover transitions, and intensity that follows intent.",
  },
  {
    id: "slate-6",
    eyebrow: "Work",
    headline: "Case studies coming soon.",
    supporting:
      "Browse the project index or get in touch while content loads in.",
  },
];
