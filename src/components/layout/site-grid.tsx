import type { CSSProperties, ReactNode } from "react";

type SiteGridProps = {
  children: ReactNode;
  className?: string;
};

type SiteGridCellProps = {
  children: ReactNode;
  span?: "full" | "main" | "narrow" | "content" | "hero";
  colStart?: number;
  colEnd?: number;
  className?: string;
};

type GridSpecTableProps = {
  headers: string[];
  rows: (string | ReactNode)[][];
  /** Columns per row on the 12-track grid (each cell spans 12 / columns). */
  columns?: 2 | 3 | 4;
  className?: string;
};

type SiteGridSubgridProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Root master grid — only outermost instance per page region.
 * Applies margin, max-width, and column tracks.
 */
export function SiteGrid({ children, className = "" }: SiteGridProps) {
  return <div className={`site-grid ${className}`}>{children}</div>;
}

const SPAN_CLASS: Record<NonNullable<SiteGridCellProps["span"]>, string> = {
  full: "col-full",
  main: "col-main",
  narrow: "col-narrow",
  content: "col-span-content",
  hero: "col-span-hero",
};

export function SiteGridCell({
  children,
  span = "full",
  colStart,
  colEnd,
  className = "",
}: SiteGridCellProps) {
  const presetClass = SPAN_CLASS[span];

  const style: CSSProperties | undefined =
    colStart !== undefined && colEnd !== undefined
      ? { gridColumn: `${colStart} / ${colEnd}` }
      : undefined;

  return (
    <div className={`${style ? "" : presetClass} ${className}`} style={style}>
      {children}
    </div>
  );
}

/**
 * Direct child of SiteGrid / RuledGrid only — inherits master column tracks via subgrid.
 * Use grid-span-N on immediate children; avoid wrapping in non-grid containers.
 */
export function SiteGridSubgrid({ children, className = "" }: SiteGridSubgridProps) {
  return (
    <div className={`site-grid-subgrid ${className}`}>{children}</div>
  );
}

const COL_SPAN_CLASS: Record<2 | 3 | 4, string> = {
  2: "grid-span-6",
  3: "grid-span-4",
  4: "grid-span-3",
};

/** Spec rows aligned to master grid tracks (subgrid rows). */
export function GridSpecTable({
  headers,
  rows,
  columns = 4,
  className = "",
}: GridSpecTableProps) {
  const cellClass = COL_SPAN_CLASS[columns];

  const rowBorder = `border-[var(--rule-light)] ${className}`.trim();

  return (
    <>
      <SiteGridSubgrid
        className={`border border-[var(--rule-light)] bg-[var(--color-flesh)]/30 ${rowBorder}`}
      >
        {headers.map((header) => (
          <div
            key={header}
            className={`${cellClass} text-meta px-2 py-2 font-medium normal-case tracking-normal`}
          >
            {header}
          </div>
        ))}
      </SiteGridSubgrid>
      {rows.map((row, rowIndex) => (
        <SiteGridSubgrid
          key={rowIndex}
          className={`border-x border-b border-[var(--rule-light)] ${rowBorder}`}
        >
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`${cellClass} min-w-0 px-2 py-2 font-mono text-xs text-secondary`}
            >
              {cell}
            </div>
          ))}
        </SiteGridSubgrid>
      ))}
    </>
  );
}
