export const siteName = "Portfolio";

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

export const menuNav: MenuNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/effects", label: "Effects" },
  { href: "/playground", label: "Playground" },
  { href: "/test", label: "Test" },
];

export type DummyProject = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  accent: "paper" | "white" | "canvas";
};

export const dummyProjects: DummyProject[] = [
  {
    slug: "project-01",
    index: "01",
    title: "Payments flow",
    subtitle: "Mobile · Fintech",
    accent: "paper",
  },
  {
    slug: "project-02",
    index: "02",
    title: "Care dashboard",
    subtitle: "Web · Health",
    accent: "white",
  },
  {
    slug: "project-03",
    index: "03",
    title: "Retail discovery",
    subtitle: "App · Commerce",
    accent: "canvas",
  },
  {
    slug: "project-04",
    index: "04",
    title: "Onboarding system",
    subtitle: "Cross-platform",
    accent: "paper",
  },
  {
    slug: "project-05",
    index: "05",
    title: "Design ops kit",
    subtitle: "Internal tools",
    accent: "white",
  },
  {
    slug: "project-06",
    index: "06",
    title: "Archive study",
    subtitle: "Exploration",
    accent: "canvas",
  },
];

export const socialLinks = {
  linkedin: { href: "https://linkedin.com", label: "LinkedIn" },
  github: { href: "https://github.com", label: "GitHub" },
} as const;

export const copyrightLine = `© ${new Date().getFullYear()}`;
