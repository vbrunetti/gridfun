"use client";

import { usePathname } from "next/navigation";
import {
  formatGridColumn,
  resolveSiteLocation,
} from "@/lib/site-location";

/**
 * Vertical grid / page label — render inside the right chrome column (under menu).
 */
export function GridLocationIndicator() {
  const pathname = usePathname();
  const location = resolveSiteLocation(pathname);
  const column = formatGridColumn(location.gridColumn);

  const parts = ["Grid", column, location.pageLabel];
  if (location.subLabel) {
    parts.push(location.subLabel);
  }
  const line = parts.join(" · ");

  return (
    <span
      className="rail-label-vertical pointer-events-none whitespace-nowrap"
      aria-label={`${location.pageLabel}, grid column ${column}${
        location.subLabel ? `, ${location.subLabel}` : ""
      }`}
    >
      {line}
    </span>
  );
}
