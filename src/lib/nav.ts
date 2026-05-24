export const siteName = "Portfolio";

export type NavLink = {
  href: string;
  label: string;
};

export const menuNav: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const socialLinks = {
  linkedin: { href: "https://linkedin.com", label: "LinkedIn" },
  github: { href: "https://github.com", label: "GitHub" },
} as const;

export const copyrightLine = `© ${new Date().getFullYear()}`;
