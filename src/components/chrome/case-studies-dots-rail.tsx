"use client";

import { useEffect } from "react";
import { ChromeNavDot } from "@/components/chrome/chrome-nav-dot";
import { useCaseStudiesScrollContext } from "@/components/case-studies/case-studies-scroll-context";

/** Body class — floating-chrome uses pointer-events:none so :hover never hits it. */
export const CS_INDEX_NAV_HOVER_CLASS = "cs-index-nav-hover";

export function CaseStudiesDotsRail() {
  const { state } = useCaseStudiesScrollContext();

  useEffect(() => {
    return () => document.body.classList.remove(CS_INDEX_NAV_HOVER_CLASS);
  }, []);

  if (!state?.visible || state.stepCount <= 1) {
    return null;
  }

  const { stepCount, activeStep, scrollToStep, setHoverStep } = state;

  return (
    <nav
      className="chrome-hero-dots-rail chrome-hero-dots-rail--study"
      aria-label={`Case studies progress, step ${activeStep + 1} of ${stepCount}`}
      onMouseEnter={() => document.body.classList.add(CS_INDEX_NAV_HOVER_CLASS)}
      onMouseLeave={() => {
        document.body.classList.remove(CS_INDEX_NAV_HOVER_CLASS);
        setHoverStep(null);
      }}
    >
      {Array.from({ length: stepCount }, (_, i) => (
        <button
          key={i}
          type="button"
          className="chrome-nav-dot-btn"
          aria-current={i === activeStep ? "step" : undefined}
          aria-label={`Go to step ${i + 1} of ${stepCount}`}
          onMouseEnter={() => setHoverStep(i)}
          onClick={() => scrollToStep(i)}
        >
          <ChromeNavDot active={i === activeStep} />
        </button>
      ))}
    </nav>
  );
}
