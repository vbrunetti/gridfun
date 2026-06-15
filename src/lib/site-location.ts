/**
 * Maps routes to a position on the master build grid (viewport-right indicator).
 * Desktop: 12 columns · Mobile: 6 columns (indicator shows desktop column index).
 */
import { isNavSection, menuNav } from "@/content/site";
import { getCaseStudy, getVignette } from "@/content/portfolio";

export type SiteLocation = {
  pageLabel: string;
  /** Column anchor 1–12 (desktop grid) */
  gridColumn: number;
  subLabel?: string;
};

const PAGE_COLUMNS: Record<string, Omit<SiteLocation, "subLabel">> = {
  "/": { pageLabel: "HOME", gridColumn: 1 },
  "/case-studies": { pageLabel: "CASE STUDIES", gridColumn: 4 },
  "/craft": { pageLabel: "CRAFT", gridColumn: 6 },
  "/about": { pageLabel: "ABOUT", gridColumn: 8 },
  "/contact": { pageLabel: "CONTACT", gridColumn: 10 },
  "/effects": { pageLabel: "EFFECTS", gridColumn: 11 },
  "/design-system": { pageLabel: "DESIGN SYSTEM", gridColumn: 12 },
};

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function menuLabelForHref(href: string): string | undefined {
  for (const item of menuNav) {
    if (isNavSection(item)) {
      if (item.href === href) return item.label;
      for (const child of item.children) {
        if (child.href === href) return child.label;
      }
    } else if (item.href === href) {
      return item.label;
    }
  }
  return undefined;
}

/** Longest matching nav section for nested routes (e.g. /effects/foo → Effects). */
function menuLabelForPathPrefix(pathname: string): string | undefined {
  let best: { href: string; label: string } | undefined;

  for (const item of menuNav) {
    const candidates = isNavSection(item)
      ? [item, ...item.children]
      : [item];

    for (const entry of candidates) {
      if (entry.href === "/") continue;
      if (pathname === entry.href || pathname.startsWith(`${entry.href}/`)) {
        if (!best || entry.href.length > best.href.length) {
          best = { href: entry.href, label: entry.label };
        }
      }
    }
  }

  return best?.label;
}

/** Human-readable page title for the left-rail vertical label. */
export function resolveRailPageLabel(pathname: string): string {
  const caseStudyMatch = pathname.match(/^\/case-studies\/([^/]+)\/?$/);
  if (caseStudyMatch) {
    const study = getCaseStudy(caseStudyMatch[1]!);
    if (study) return study.name;
  }

  const vignetteMatch = pathname.match(/^\/craft\/([^/]+)\/?$/);
  if (vignetteMatch) {
    const row = getVignette(vignetteMatch[1]!);
    if (row) return row.vignette.name;
  }

  const effectsMatch = pathname.match(/^\/effects\/([^/]+)/);
  if (effectsMatch) {
    return humanizeSlug(effectsMatch[1]!);
  }

  const exactNav = menuLabelForHref(pathname);
  if (exactNav) return exactNav;

  const prefixNav = menuLabelForPathPrefix(pathname);
  if (prefixNav) return prefixNav;

  return "Site";
}

export function resolveSiteLocation(pathname: string): SiteLocation {
  if (pathname in PAGE_COLUMNS) {
    return PAGE_COLUMNS[pathname];
  }

  if (pathname.startsWith("/effects")) {
    return PAGE_COLUMNS["/effects"];
  }

  if (pathname.startsWith("/design-system")) {
    return PAGE_COLUMNS["/design-system"];
  }

  const caseStudyMatch = pathname.match(/^\/case-studies\/([^/]+)\/?$/);
  if (caseStudyMatch) {
    const base = PAGE_COLUMNS["/case-studies"];
    return {
      pageLabel: base.pageLabel,
      gridColumn: base.gridColumn,
      subLabel: caseStudyMatch[1].slice(0, 8).toUpperCase(),
    };
  }

  if (pathname.startsWith("/case-studies")) {
    return PAGE_COLUMNS["/case-studies"];
  }

  const vignetteMatch = pathname.match(/^\/craft\/([^/]+)\/?$/);
  if (vignetteMatch) {
    const base = PAGE_COLUMNS["/craft"];
    return {
      pageLabel: base.pageLabel,
      gridColumn: base.gridColumn,
      subLabel: vignetteMatch[1].slice(0, 8).toUpperCase(),
    };
  }

  return { pageLabel: "SITE", gridColumn: 12 };
}

export function formatGridColumn(column: number): string {
  return String(Math.min(12, Math.max(1, column))).padStart(2, "0");
}

export const GRID_COLUMNS = { mobile: 6, desktop: 12 } as const;
