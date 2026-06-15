"use client";

import { useEffect } from "react";
import { ChromeDotsRail } from "@/components/chrome/chrome-dots-rail";
import { useCaseStudyDetailScrollContext } from "@/components/case-studies/case-study-detail-scroll-context";

/** Body class — floating-chrome uses pointer-events:none so :hover never hits it. */
export const CS_DETAIL_NAV_HOVER_CLASS = "cs-detail-nav-hover";

export function CaseStudyDetailDotsRail() {
  const { state } = useCaseStudyDetailScrollContext();

  useEffect(() => {
    return () => document.body.classList.remove(CS_DETAIL_NAV_HOVER_CLASS);
  }, []);

  if (!state?.visible || state.steps.length <= 1) {
    return null;
  }

  const { steps, activeStep, scrollToStep, vignetteProgress, setHoverStep } =
    state;

  const railSteps = steps.map((step, i) => {
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
    return { id: step.id, label: step.label, progress };
  });

  return (
    <ChromeDotsRail
      className="chrome-dots-rail--detail"
      steps={railSteps}
      activeStep={activeStep}
      scrollToStep={scrollToStep}
      ariaLabel={`Case study progress, section ${activeStep + 1} of ${steps.length}`}
      onMouseEnter={() => document.body.classList.add(CS_DETAIL_NAV_HOVER_CLASS)}
      onMouseLeave={() => {
        document.body.classList.remove(CS_DETAIL_NAV_HOVER_CLASS);
        setHoverStep(null);
      }}
      onDotMouseEnter={setHoverStep}
    />
  );
}
