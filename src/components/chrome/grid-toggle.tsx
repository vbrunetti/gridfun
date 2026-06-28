"use client";

import { useChrome } from "./chrome-provider";

export function GridToggle() {
  const { skeletonVisible, toggleSkeleton } = useChrome();

  return (
    <div className="menu-grid-toggle">
      <span id="menu-grid-toggle-label" className="menu-grid-toggle__label text-meta">
        Show grid
      </span>
      <button
        type="button"
        role="switch"
        className={`menu-grid-toggle__switch${skeletonVisible ? " is-on" : ""}`}
        aria-labelledby="menu-grid-toggle-label"
        aria-checked={skeletonVisible}
        onClick={toggleSkeleton}
      >
        <span className="menu-grid-toggle__thumb" aria-hidden />
      </button>
      <span className="menu-grid-toggle__key text-meta" aria-hidden>
        G
      </span>
    </div>
  );
}
