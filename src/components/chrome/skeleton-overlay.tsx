"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useChrome } from "./chrome-provider";

type GridSpec = {
  left: number;
  width: number;
  margin: number;
  gutter: number;
  columns: number;
  columnWidth: number;
  baseline: number;
  viewportWidth: number;
  viewportHeight: number;
};

/** Computed body-md line box — the ramp is fluid (clamp + ratio leading),
    so the baseline rhythm only exists as a measured value. */
function measureBaseline(host: Element): number {
  const probe = document.createElement("span");
  probe.className = "body-md";
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  host.appendChild(probe);
  const lineHeight = Number.parseFloat(getComputedStyle(probe).lineHeight) || 0;
  probe.remove();
  return lineHeight;
}

/** Match the content box of the first page grid (tracks, not padding box). */
function measureSiteGridSpec(): GridSpec | null {
  const grid =
    document.querySelector("#main-content .primary-hero-stage.site-grid") ??
    document.querySelector("#main-content .site-grid");
  if (!grid) return null;

  const rect = grid.getBoundingClientRect();
  const styles = getComputedStyle(grid);
  const padLeft = Number.parseFloat(styles.paddingLeft) || 0;
  const padRight = Number.parseFloat(styles.paddingRight) || 0;
  const gutter = Number.parseFloat(styles.columnGap) || 0;
  const columns =
    Number.parseInt(styles.getPropertyValue("--grid-columns"), 10) || 12;

  const width = Math.max(0, rect.width - padLeft - padRight);

  return {
    left: rect.left + padLeft,
    width,
    margin: padLeft,
    gutter,
    columns,
    columnWidth: (width - gutter * (columns - 1)) / columns,
    baseline: measureBaseline(grid),
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  };
}

function formatPx(value: number): string {
  return value % 1 ? value.toFixed(1) : String(value);
}

export function SkeletonOverlay() {
  const { skeletonVisible } = useChrome();
  const [spec, setSpec] = useState<GridSpec | null>(null);
  const rafRef = useRef<number>(0);

  useLayoutEffect(() => {
    if (!skeletonVisible) {
      setSpec(null);
      return;
    }

    const sync = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setSpec(measureSiteGridSpec());
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

  if (!skeletonVisible || !spec) {
    return null;
  }

  const readout = [
    `${spec.columns} col × ${Math.round(spec.columnWidth)}`,
    `gutter ${Math.round(spec.gutter)}`,
    `margin ${Math.round(spec.margin)}`,
    `base ${formatPx(spec.baseline)}`,
    `${spec.viewportWidth} × ${spec.viewportHeight}`,
  ];

  return (
    <div
      className="pointer-events-none fixed top-0 bottom-0 z-[60]"
      style={
        {
          left: spec.left,
          width: spec.width,
          "--skeleton-baseline": `${spec.baseline}px`,
        } as React.CSSProperties
      }
      aria-hidden
    >
      <div className="skeleton-ruler" />
      <div className="skeleton-grid h-full min-h-[100dvh]">
        {Array.from({ length: spec.columns }).map((_, index) => (
          <div
            key={index}
            className="skeleton-column"
            style={{ "--skeleton-i": index } as React.CSSProperties}
          >
            <span className="skeleton-column__num">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
      <div className="skeleton-readout">
        {readout.map((entry, index) => (
          <span key={entry} className="skeleton-readout__entry">
            {index > 0 && (
              <span className="skeleton-readout__sep" aria-hidden>
                ·
              </span>
            )}
            {entry}
          </span>
        ))}
      </div>
    </div>
  );
}
