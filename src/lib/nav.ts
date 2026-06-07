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
  { href: "/case-studies", label: "Case Studies" },
  { href: "/craft", label: "Craft" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/effects", label: "Effects" },
  { href: "/test", label: "Test" },
];

export const socialLinks = {
  linkedin: { href: "https://linkedin.com", label: "LinkedIn" },
  github: { href: "https://github.com", label: "GitHub" },
} as const;

export const copyrightLine = `© ${new Date().getFullYear()}`;
