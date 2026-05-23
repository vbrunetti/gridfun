import type { ReactNode } from "react";

type GridProps = {
  children: ReactNode;
  className?: string;
};

type GridCellProps = {
  children: ReactNode;
  /** 1–12 column span at the md breakpoint and up. Full width on small screens. */
  span?: number;
  className?: string;
};

export function Grid({ children, className = "" }: GridProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--content-max)] px-[var(--grid-margin)] ${className}`}
    >
      <div className="grid grid-cols-12 gap-x-[var(--grid-gutter)] gap-y-[var(--grid-row-gap)]">
        {children}
      </div>
    </div>
  );
}

export function GridCell({ children, span = 12, className = "" }: GridCellProps) {
  const spanClass =
    span === 12
      ? "col-span-12"
      : span === 8
        ? "col-span-12 md:col-span-8"
        : span === 6
          ? "col-span-12 md:col-span-6"
          : span === 4
            ? "col-span-12 md:col-span-4"
            : "col-span-12";

  return <div className={`${spanClass} ${className}`}>{children}</div>;
}
