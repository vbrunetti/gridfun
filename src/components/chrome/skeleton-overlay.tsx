"use client";

import { useChrome } from "./chrome-provider";

export function SkeletonOverlay() {
  const { skeletonVisible } = useChrome();

  if (!skeletonVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] lg:pl-[var(--rail-width)]" aria-hidden>
      <div className="skeleton-wrap">
        <div className="skeleton-grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className={`border-r border-[var(--color-ink)]/15 bg-[var(--color-ink)]/[0.03] last:border-r-0 ${
                index >= 6 ? "hidden lg:block" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
