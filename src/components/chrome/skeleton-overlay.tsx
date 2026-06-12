"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useChrome } from "./chrome-provider";

type GridFrame = {
  left: number;
  width: number;
};

/** Match the content box of the first page grid (tracks, not padding box). */
function measureSiteGridFrame(): GridFrame | null {
  const grid =
    document.querySelector("#main-content .primary-hero-stage.site-grid") ??
    document.querySelector("#main-content .site-grid");
  if (!grid) return null;

  const rect = grid.getBoundingClientRect();
  const styles = getComputedStyle(grid);
  const padLeft = Number.parseFloat(styles.paddingLeft) || 0;
  const padRight = Number.parseFloat(styles.paddingRight) || 0;

  return {
    left: rect.left + padLeft,
    width: Math.max(0, rect.width - padLeft - padRight),
  };
}

export function SkeletonOverlay() {
  const { skeletonVisible } = useChrome();
  const [frame, setFrame] = useState<GridFrame | null>(null);
  const rafRef = useRef<number>(0);

  useLayoutEffect(() => {
    if (!skeletonVisible) {
      setFrame(null);
      return;
    }

    const sync = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setFrame(measureSiteGridFrame());
      });
    };

    sync();

    const grid =
      document.querySelector("#main-content .primary-hero-stage.site-grid") ??
      document.querySelector("#main-content .site-grid");
    const observer = grid ? new ResizeObserver(sync) : null;
    if (grid && observer) observer.observe(grid);

    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer?.disconnect();
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync);
    };
  }, [skeletonVisible]);

  if (!skeletonVisible || !frame) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed top-0 bottom-0 z-[60]"
      style={{ left: frame.left, width: frame.width }}
      aria-hidden
    >
      <div className="skeleton-grid h-full min-h-[100dvh]">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className={`skeleton-column ${index >= 6 ? "hidden lg:block" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
