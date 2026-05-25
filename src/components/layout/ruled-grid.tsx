import type { ReactNode } from "react";
import { SiteGrid } from "./site-grid";

type RuledGridProps = {
  children: ReactNode;
  className?: string;
};

/** Page content aligned to the master site grid. */
export function RuledGrid({ children, className = "" }: RuledGridProps) {
  return <SiteGrid className={className}>{children}</SiteGrid>;
}
