"use client";

import { useEffect } from "react";
import { ChromeDotsRail } from "@/components/chrome/chrome-dots-rail";
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

  const steps = Array.from({ length: stepCount }, (_, i) => ({
    id: `cs-index-${i}`,
    label: `step ${i + 1} of ${stepCount}`,
  }));

  return (
    <ChromeDotsRail
      steps={steps}
      activeStep={activeStep}
      scrollToStep={scrollToStep}
      ariaLabel={`Case studies progress, step ${activeStep + 1} of ${stepCount}`}
      onMouseEnter={() => document.body.classList.add(CS_INDEX_NAV_HOVER_CLASS)}
      onMouseLeave={() => {
        document.body.classList.remove(CS_INDEX_NAV_HOVER_CLASS);
        setHoverStep(null);
      }}
      onDotMouseEnter={setHoverStep}
    />
  );
}
