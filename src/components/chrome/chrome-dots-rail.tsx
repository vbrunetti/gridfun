"use client";

import { useEffect, useRef, useState } from "react";
import { ChromeNavDot } from "@/components/chrome/chrome-nav-dot";

export type ChromeDotsRailStep = {
  id: string;
  label: string;
  /** 0–1 radial ring on the active dot when set. */
  progress?: number | null;
};

type ChromeDotsRailProps = {
  steps: ChromeDotsRailStep[];
  activeStep: number;
  scrollToStep: (index: number) => void;
  ariaLabel: string;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onDotMouseEnter?: (index: number) => void;
  /** Chapter title, parked to the left of the hovered/focused dot. Default on. */
  showTooltip?: boolean;
};

type DotTooltip = {
  label: string;
  top: number;
  left: number;
};

/** Scroll within the rail only — never call scrollIntoView (it can move the page). */
export function scrollDotIntoRail(
  nav: HTMLElement,
  dot: HTMLElement,
  pad = 10,
) {
  const horizontal = getComputedStyle(nav).flexDirection === "row";

  if (horizontal) {
    const dotStart = dot.offsetLeft;
    const dotEnd = dotStart + dot.offsetWidth;
    const viewStart = nav.scrollLeft + pad;
    const viewEnd = nav.scrollLeft + nav.clientWidth - pad;

    if (dotStart < viewStart) {
      nav.scrollLeft = dotStart - pad;
    } else if (dotEnd > viewEnd) {
      nav.scrollLeft = dotEnd - nav.clientWidth + pad;
    }
    return;
  }

  const dotTop = dot.offsetTop;
  const dotBottom = dotTop + dot.offsetHeight;
  const viewTop = nav.scrollTop + pad;
  const viewBottom = nav.scrollTop + nav.clientHeight - pad;

  if (dotTop < viewTop) {
    nav.scrollTop = dotTop - pad;
  } else if (dotBottom > viewBottom) {
    nav.scrollTop = dotBottom - nav.clientHeight + pad;
  }
}

export function ChromeDotsRail({
  steps,
  activeStep,
  scrollToStep,
  ariaLabel,
  className = "",
  onMouseEnter,
  onMouseLeave,
  onDotMouseEnter,
  showTooltip = true,
}: ChromeDotsRailProps) {
  const navRef = useRef<HTMLElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [tooltip, setTooltip] = useState<DotTooltip | null>(null);
  const tooltipIndexRef = useRef<number | null>(null);

  const placeTooltip = (index: number) => {
    const el = dotRefs.current[index];
    const label = steps[index]?.label;
    if (!el || !label) return;
    const rect = el.getBoundingClientRect();
    tooltipIndexRef.current = index;
    setTooltip({
      label,
      top: rect.top + rect.height / 2,
      left: rect.left,
    });
  };

  const clearTooltip = () => {
    tooltipIndexRef.current = null;
    setTooltip(null);
  };

  useEffect(() => {
    const nav = navRef.current;
    const dot = dotRefs.current[activeStep];
    if (!nav || !dot) return;

    scrollDotIntoRail(nav, dot);

    const onResize = () => {
      scrollDotIntoRail(nav, dot);
      if (tooltipIndexRef.current !== null) placeTooltip(tooltipIndexRef.current);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [activeStep, steps]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <nav
        ref={navRef}
        className={`chrome-dots-rail chrome-dots-rail--study ${className}`.trim()}
        aria-label={ariaLabel}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => {
          clearTooltip();
          onMouseLeave?.();
        }}
      >
        {steps.map((step, i) => {
          const active = i === activeStep;

          return (
            <button
              key={step.id}
              ref={(node) => {
                dotRefs.current[i] = node;
              }}
              type="button"
              className="chrome-nav-dot-btn"
              aria-current={active ? "step" : undefined}
              aria-label={`Go to ${step.label}`}
              onMouseEnter={() => {
                if (showTooltip) placeTooltip(i);
                onDotMouseEnter?.(i);
              }}
              onFocus={() => {
                if (showTooltip) placeTooltip(i);
              }}
              onBlur={(event) => {
                if (!navRef.current?.contains(event.relatedTarget as Node)) {
                  clearTooltip();
                }
              }}
              onClick={() => scrollToStep(i)}
            >
              <ChromeNavDot
                active={active}
                progress={active ? step.progress : null}
              />
            </button>
          );
        })}
      </nav>
      {showTooltip && tooltip ? (
        <span
          className="chrome-nav-dot-tooltip"
          style={{ top: tooltip.top, left: tooltip.left }}
          aria-hidden
        >
          {tooltip.label}
        </span>
      ) : null}
    </>
  );
}
