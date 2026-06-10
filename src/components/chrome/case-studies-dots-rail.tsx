"use client";

import { useCaseStudiesScrollContext } from "@/components/case-studies/case-studies-scroll-context";

export function CaseStudiesDotsRail() {
  const { state } = useCaseStudiesScrollContext();

  if (!state?.visible || state.stepCount <= 1) {
    return null;
  }

  const { stepCount, activeStep, scrollToStep } = state;

  return (
    <nav
      className="chrome-hero-dots-rail"
      aria-label={`Case studies progress, step ${activeStep + 1} of ${stepCount}`}
    >
      {Array.from({ length: stepCount }, (_, i) => (
        <button
          key={i}
          type="button"
          className="primary-hero-dot-btn"
          aria-current={i === activeStep ? "step" : undefined}
          aria-label={`Go to step ${i + 1} of ${stepCount}`}
          onClick={() => scrollToStep(i)}
        >
          <span
            className={
              i === activeStep
                ? "primary-hero-dot primary-hero-dot-active"
                : "primary-hero-dot"
            }
            aria-hidden
          />
        </button>
      ))}
    </nav>
  );
}
