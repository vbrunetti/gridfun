/**
 * Maps routes to a position on the master build grid (viewport-right indicator).
 * Desktop: 12 columns · Mobile: 6 columns (indicator shows desktop column index).
 */
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
  "/test": { pageLabel: "TEST", gridColumn: 12 },
};

export function resolveSiteLocation(pathname: string): SiteLocation {
  if (pathname in PAGE_COLUMNS) {
    return PAGE_COLUMNS[pathname];
  }

  if (pathname.startsWith("/effects")) {
    return PAGE_COLUMNS["/effects"];
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
