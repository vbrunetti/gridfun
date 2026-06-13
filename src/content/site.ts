/**
 * Site-wide copy and chrome content.
 *
 * Edit this file for meta, navigation, home, about, and contact.
 * Case studies and craft vignettes live in `portfolio.ts`.
 *
 * NOTE (Victor): a few values are first-draft or best-guess — search for
 * `TODO` to find the spots that need your real details (social URLs, phone,
 * location, and any bio lines you'd word differently).
 */

export type HeroSlate = {
  id: string;
  eyebrow?: string;
  headline: string;
  supporting?: string;
};

/** Cover-flow sections after hero chapters — each gets a scroll slide and rail dot. */
export type HomeCoverSection = {
  id: string;
  label: string;
};

export type NavLink = {
  href: string;
  label: string;
};

export type NavSection = {
  href: string;
  label: string;
  children: NavLink[];
};

export type MenuNavItem = NavLink | NavSection;

export function isNavSection(item: MenuNavItem): item is NavSection {
  return "children" in item;
}

export type ContactPerson = {
  name: string;
  role: string;
  email: string;
};

/** A company proof-point under the "superpower" section. */
export type AboutExample = {
  company: string;
  detail: string;
  /** Optional in-site link, e.g. to a case study. */
  href?: string;
};

export type AboutTestimonial = {
  quote: string;
  author: string;
};

/** One role in the experience timeline. */
export type AboutRole = {
  title: string;
  org: string;
  period: string;
  summary: string;
  achievements: string[];
};

export type AboutEducation = {
  school: string;
  program: string;
  degree: string;
  period: string;
};

export const site = {
  meta: {
    title: "Victor Brunetti",
    titleTemplate: "%s · Victor Brunetti",
    description:
      "Product and UX designer working on the human side of complex systems — design systems, AI-native interfaces, and human-in-the-loop tools. Work from Pearson, Cruise, and Google.",
  },
  nav: {
    menu: [
      { href: "/", label: "Home" },
      { href: "/case-studies", label: "Case Studies" },
      { href: "/craft", label: "Craft" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/effects", label: "Effects" },
      { href: "/design-system", label: "Design System" },
    ] satisfies MenuNavItem[],
    social: {
      linkedin: { href: "https://www.linkedin.com/in/brunetti/", label: "LinkedIn" },
      github: { href: "https://github.com/vbrunetti", label: "GitHub" },
    },
  },
  home: {
    heroSlates: [
      {
        id: "slate-1",
        eyebrow: "Product · UX",
        headline: "Designing the human side of complex systems.",
        supporting:
          "Tele-operations, design systems, and AI-native tools — built around a single idea: context gain.",
      },
      {
        id: "slate-2",
        eyebrow: "Design systems",
        headline: "A design system is infrastructure — as fundamental as electricity.",
        supporting:
          "Nebula at Pearson: tokens, opinionated organisms, and a natural-language prototyping pipeline.",
      },
      {
        id: "slate-3",
        eyebrow: "AI-native",
        headline: "When the conversation is the interface.",
        supporting:
          "A pattern language for embedded, assistive, and generative AI across a product family.",
      },
      {
        id: "slate-4",
        eyebrow: "Human-in-the-loop",
        headline: "Surfacing what the machine already knows.",
        supporting:
          "The Cruise tele-operations terminal — context gain over a black box, with seconds to act.",
      },
      {
        id: "slate-5",
        eyebrow: "Research",
        headline: "Go see for yourself.",
        supporting:
          "The mountain you're pointed at is often a collection of smaller, more solvable hills.",
      },
      {
        id: "slate-6",
        eyebrow: "Work",
        headline: "Cruise, Google, Pearson.",
        supporting:
          "Browse the case studies and craft index, or get in touch.",
      },
    ] satisfies HeroSlate[],
    coverSections: [{ id: "home-secondary", label: "Selected work" }] satisfies HomeCoverSection[],
    secondary: {
      eyebrow: "Selected work",
      headline: "From driverless fleets to AI-native learning.",
      subhead:
        "Three chapters — Cruise, Google, Pearson — each about making a complex system legible to the person using it.",
      cta: {
        href: "/case-studies",
        label: "View case studies",
        screenReaderLabel: "Case studies",
      },
    },
  },
  about: {
    eyebrow: "My story",
    headline: "I'm a manager, maker, craftsman, and multidisciplinary design leader.",
    intro:
      "I create beautifully-designed experiences that delight users — balancing strategy, craft, and team leadership across mission-critical products.",
    superpower: {
      kicker: "My superpower",
      heading: "Principal Designer, Design Manager, and Player-Coach — at the same time.",
      body: "My superpower, and super-value, is that I can balance the roles of Principal Designer, Design Manager, and Player-Coach simultaneously.",
      examples: [
        {
          company: "Cruise",
          detail:
            "Led high-value strategic initiatives like the Terminal redesign while managing and growing a team.",
          href: "/case-studies/cruise-teleops",
        },
        {
          company: "Google",
          detail:
            "Led teams across Core, Ads, and Devices & Services — contributing as both a Design Manager and Staff UX Designer.",
          href: "/case-studies/google",
        },
        {
          company: "Vitals",
          detail:
            "Took a land-and-expand approach with VitalsChoice — securing the full BCBS network as clients before building out a team.",
        },
        {
          company: "McKinsey",
          detail:
            "Balanced expert practitioner and Design Strategist roles across major Telecom and Healthcare initiatives.",
        },
      ] satisfies AboutExample[],
    },
    octopus: {
      kicker: "Octopus-shaped",
      heading: "Being T-shaped is over.",
      body: "Modern UX professionals can't afford to be deep in only one area — executing exceptional work across a wide range of skillsets demands more. I strive to be octopus-shaped: a full-stack approach to leadership and craft, with proficiency across the core digital design and management disciplines.",
    },
    philosophy: {
      kicker: "Management philosophy",
      heading: "How I build high-performing teams.",
      body: "I'm committed to building high-performing teams, and I do it with a specific management approach. On my team you can expect:",
      values: [
        "Immediate & direct feedback",
        "Obligation to dissent",
        "Inspiring followership",
        "Meritocracy",
        "Cross-functional collaboration",
        "Apprenticeship",
        "Consensus building",
        "One-team mentality",
      ],
    },
    testimonials: {
      kicker: "What others say",
      linkedinHref: "https://www.linkedin.com/in/brunetti/",
      items: [
        {
          quote:
            "Victor pushed me to improve my core design craft and created a team environment that allowed myself and other designers to grow tremendously and take on a progressively larger scope of ownership. All along the way, he provided useful insight to guide my design work and approach to collaboration with other teams within Cruise, unblocking key stuck points whenever they arose.",
          author: "Spencer James, Direct Report at Cruise",
        },
        {
          quote:
            "Victor is easily one of the top designers I've had the privilege of working with and learning from across my 10+ years in UX. He has an exceptionally strong attention to detail and love for his craft — uniquely coupled with the passion and talent to develop a compelling story and clear strategy for aligning teams to deliver on a vision.",
          author: "Rob Larson, Direct Report at Google",
        },
        {
          quote:
            "I had the honor of closely working with Victor while at McKinsey. Victor is one of the most talented product and design leaders I have ever met. His ability to be a 'player-coach', engage in business strategy, and his dedication to excellent work — at all costs — stands out.",
          author: "Josh Weiner, Advanced Analytics at McKinsey",
        },
      ] satisfies AboutTestimonial[],
    },
    experience: {
      kicker: "Work experience",
      resumeHref: "https://resume.vbrunetti.com",
      roles: [
        {
          title: "Design Director",
          org: "Pearson",
          period: "2025 – Present",
          summary:
            "Leading the Nebula design systems team at Pearson Higher Education — architecting the company's new AI-first design language across a portfolio of higher-ed products serving millions of learners, and managing a multidisciplinary team of visual designers and UX engineers.",
          achievements: [
            "Pioneering an enterprise Figma-to-Storybook pipeline where the design systems team maintains the source of truth natively in code — closing the gap between design intent and production implementation at scale",
            "Architecting Nebula as a multi-modal design language that extends beyond traditional GUI paradigms to encompass conversation design, voice interfaces, and emerging AI-native interaction patterns",
            "Spearheading the redesign and rollout of Pearson's new flagship Higher Ed platform — the first major application to adopt the Nebula design language",
            "Driving accessibility compliance (WCAG 2.2 AA) and AI-first component patterns as foundational pillars of the system",
          ],
        },
        {
          title: "Sr. UX Design Manager",
          org: "Cruise",
          period: "2023 – 2025",
          summary:
            "Led UX design, strategy, and team management for mission-critical autonomous-vehicle systems across four product areas — On Road Tools, Fleet Support, Developer Velocity & Quality, and Data Enrichment. Managed a team of 7 designers and researchers.",
          achievements: [
            "Spearheaded the redesign of Terminal, the primary remote-instruction platform for AV assistance — improving Average Handle Time by 11% and reducing Time in Remote Assistance by 7% within the first month post-launch",
            "Enhanced commercial-operations efficiency across map health monitoring, safety simulation, and fleet management tools",
            "Provided hands-on design leadership for high-impact initiatives while fostering team growth",
            "Established new standards for remote-operator satisfaction through user-centered design",
          ],
        },
        {
          title: "UX Design Manager",
          org: "Google",
          period: "2018 – 2023",
          summary:
            "Led multiple UX teams across the Devices & Services, Ads, and Core organizations, managing up to 8 designers and driving strategic initiatives with substantial business impact.",
          achievements: [
            "Led Google Retail Store UX strategy, reimagining omnichannel shopping and delivering new point-of-sale applications",
            "Managed the Shopping Ads UX team, contributing to over $500M in annual recurring revenue",
            "Transformed Contact Center Tools through AI integration — increasing customer satisfaction by 12% and agent satisfaction by 23% while holding headcount flat",
            "Facilitated cross-functional collaboration through Design Thinking workshops and Design Sprints",
          ],
        },
        {
          title: "Head of Design",
          org: "Vitals",
          period: "2017 – 2018",
          summary:
            "Established and led the Product Design & Research functions for healthcare cost-transparency products, managing a team of 5 designers and researchers.",
          achievements: [
            "Expanded the customer base to include all Blue Cross Blue Shield networks within the first year",
            "Created the Vitals Design Language System (DLS) for mobile-native and web-responsive surfaces",
            "Led product evolution and new service definition, significantly improving healthcare cost-transparency tools",
          ],
        },
        {
          title: "Executive Experience Design Director",
          org: "McKinsey",
          period: "2015 – 2017",
          summary:
            "Led Experience Design teams across pharmaceutical, healthcare, finance, and telecommunications sectors, managing 3 designers.",
          achievements: [
            "Co-developed the Quantified Experience Design methodology, combining quantitative and qualitative approaches to product design and delivery",
            "Delivered high-impact solutions for Fortune 500 clients — including a 22% increase in patient NPS and 26% more market share for a large pharmaceutical client",
          ],
        },
        {
          title: "Product Designer",
          org: "Facebook",
          period: "2013 – 2014",
          summary:
            "Led design initiatives for high-visibility features reaching hundreds of millions of users daily.",
          achievements: [
            "Designed and launched the Structured Sharing initiative to expand Facebook's knowledge-graph capabilities",
            "Co-founded the NY UX team, establishing a strong design culture in the New York office",
            "Led design for Sports and Crowdsourcing features, driving significant user engagement",
          ],
        },
      ] satisfies AboutRole[],
    },
    education: {
      kicker: "Education",
      school: "New York University",
      program: "Gallatin School of Individualized Study",
      degree: "Bachelor of Arts",
      period: "1998 – 2002",
    },
    signoff: "Utility + Joy = Awesome",
  },
  contact: {
    headline: "Contact",
    address: ["Weehawken, NJ"],
    phone: "+1 (917) 509-0267",
    primaryCta: { href: "mailto:victor.brunetti@gmail.com", label: "Email me" },
    people: [
      { name: "Victor Brunetti", role: "Product & UX Designer", email: "victor.brunetti@gmail.com" },
    ] satisfies ContactPerson[],
    footerNote: "Open to conversations about product design, design systems, and AI-native interfaces.",
  },
} as const;

/** Convenience aliases — pages can import `site` or these directly. */
export const heroSlates = site.home.heroSlates;
export const homeCoverSections = site.home.coverSections;
export const menuNav = site.nav.menu;
export const socialLinks = site.nav.social;
export const siteName = site.meta.title;

export function copyrightLine(): string {
  return `© ${new Date().getFullYear()} Victor Brunetti`;
}