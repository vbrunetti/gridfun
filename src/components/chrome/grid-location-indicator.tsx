"use client";

import { usePathname } from "next/navigation";
import { resolveRailPageLabel } from "@/lib/site-location";

/**
 * Vertical page label — rendered in the left rail, centered vertically.
 */
export function GridLocationIndicator() {
  const pathname = usePathname();
  const label = resolveRailPageLabel(pathname);

  return (
    <span
      className="rail-label-vertical pointer-events-none whitespace-nowrap"
      aria-label={`Current page: ${label}`}
    >
      {label}
    </span>
  );
}
