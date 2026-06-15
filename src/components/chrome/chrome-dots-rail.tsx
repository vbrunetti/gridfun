"use client";

import { useEffect, useRef } from "react";
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
}: ChromeDotsRailProps) {
  const navRef = useRef<HTMLElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const nav = navRef.current;
    const dot = dotRefs.current[activeStep];
    if (!nav || !dot) return;

    scrollDotIntoRail(nav, dot);

    const onResize = () => scrollDotIntoRail(nav, dot);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [activeStep, steps]);

  return (
    <nav
      ref={navRef}
      className={`chrome-dots-rail chrome-dots-rail--study ${className}`.trim()}
      aria-label={ariaLabel}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
            onMouseEnter={
              onDotMouseEnter ? () => onDotMouseEnter(i) : undefined
            }
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
  );
}
