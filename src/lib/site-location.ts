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
  "/work": { pageLabel: "WORK", gridColumn: 4 },
  "/about": { pageLabel: "ABOUT", gridColumn: 8 },
  "/contact": { pageLabel: "CONTACT", gridColumn: 10 },
  "/test": { pageLabel: "TEST", gridColumn: 12 },
};

const WORK_SUBPAGES: Record<string, { subLabel: string; gridColumn: number }> = {
  "project-01": { subLabel: "01", gridColumn: 5 },
  "project-02": { subLabel: "02", gridColumn: 6 },
  "project-03": { subLabel: "03", gridColumn: 7 },
  "project-04": { subLabel: "04", gridColumn: 8 },
  "project-05": { subLabel: "05", gridColumn: 9 },
  "project-06": { subLabel: "06", gridColumn: 10 },
};

export function resolveSiteLocation(pathname: string): SiteLocation {
  if (pathname in PAGE_COLUMNS) {
    return PAGE_COLUMNS[pathname];
  }

  const workMatch = pathname.match(/^\/work\/([^/]+)\/?$/);
  if (workMatch) {
    const slug = workMatch[1];
    const sub = WORK_SUBPAGES[slug];
    const base = PAGE_COLUMNS["/work"];

    if (sub) {
      return {
        pageLabel: base.pageLabel,
        gridColumn: sub.gridColumn,
        subLabel: sub.subLabel,
      };
    }

    return {
      pageLabel: base.pageLabel,
      gridColumn: base.gridColumn,
      subLabel: slug.slice(0, 8).toUpperCase(),
    };
  }

  if (pathname.startsWith("/work")) {
    return PAGE_COLUMNS["/work"];
  }

  return { pageLabel: "SITE", gridColumn: 12 };
}

export function formatGridColumn(column: number): string {
  return String(Math.min(12, Math.max(1, column))).padStart(2, "0");
}

export const GRID_COLUMNS = { mobile: 6, desktop: 12 } as const;
