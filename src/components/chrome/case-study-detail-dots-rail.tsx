"use client";

import { useEffect, useRef } from "react";
import { ChromeNavDot } from "@/components/chrome/chrome-nav-dot";
import { useCaseStudyDetailScrollContext } from "@/components/case-studies/case-study-detail-scroll-context";

/** Scroll within the rail only — never call scrollIntoView (it can move the page). */
function scrollDotIntoNav(nav: HTMLElement, dot: HTMLElement, pad = 10) {
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

export function CaseStudyDetailDotsRail() {
  const { state } = useCaseStudyDetailScrollContext();
  const navRef = useRef<HTMLElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!state) return;
    const nav = navRef.current;
    const dot = dotRefs.current[state.activeStep];
    if (!nav || !dot) return;
    scrollDotIntoNav(nav, dot);
  }, [state?.activeStep, state]);

  if (!state?.visible || state.steps.length <= 1) {
    return null;
  }

  const { steps, activeStep, scrollToStep, vignetteProgress } = state;

  return (
    <nav
      ref={navRef}
      className="chrome-hero-dots-rail chrome-hero-dots-rail--study"
      aria-label={`Case study progress, section ${activeStep + 1} of ${steps.length}`}
    >
      {steps.map((step, i) => {
        const active = i === activeStep;
        let progress: number | null = null;
        if (
          active &&
          step.kind === "vignette" &&
          vignetteProgress &&
          vignetteProgress.vignetteSlug === step.vignetteSlug
        ) {
          progress =
            (vignetteProgress.panelIndex + 1) / vignetteProgress.panelCount;
        }

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
            onClick={() => scrollToStep(i)}
          >
            <ChromeNavDot active={active} progress={progress} />
          </button>
        );
      })}
    </nav>
  );
}
