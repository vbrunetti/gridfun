import type { CSSProperties, ReactNode } from "react";

type SiteGridProps = {
  children: ReactNode;
  className?: string;
};

type SiteGridCellProps = {
  children: ReactNode;
  span?: "full" | "main" | "narrow";
  colStart?: number;
  colEnd?: number;
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

export function SiteGridCell({
  children,
  span = "full",
  colStart,
  colEnd,
  className = "",
}: SiteGridCellProps) {
  const presetClass =
    span === "full" ? "col-full" : span === "main" ? "col-main" : "col-narrow";

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
 * Child of SiteGridCell — inherits parent column tracks via subgrid.
 * Use grid-span-N classes on direct children; no extra padding or margins.
 */
export function SiteGridSubgrid({ children, className = "" }: SiteGridSubgridProps) {
  return (
    <div className={`site-grid-subgrid ${className}`}>{children}</div>
  );
}
