/** Master build grid constants — keep in sync with globals.css */
export const GRID = {
  mobile: { columns: 6, gutter: "2px", margin: "1rem" },
  desktop: { columns: 12, gutter: "8px", margin: "0", maxWidth: "90rem" },
} as const;

/** Swatch spans 2 columns → 3 per row on 6-col, 6 per row on 12-col */
export const SWATCH_COL_SPAN = 2;

/** Demo column markers: 1–6 visible on mobile, 1–12 on desktop */
export const DEMO_COLUMN_COUNT = 12;
