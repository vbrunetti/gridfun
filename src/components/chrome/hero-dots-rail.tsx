"use client";

import { ChromeDotsRail } from "@/components/chrome/chrome-dots-rail";
import { useHeroScrubContext } from "@/components/sections/primary-hero/hero-scrub-context";

export function HeroDotsRail() {
  const { state } = useHeroScrubContext();

  if (!state?.visible || state.steps.length <= 1) {
    return null;
  }

  const { steps, activeStep, scrollToStep, subChapterProgress } = state;

  const railSteps = steps.map((step, i) => {
    const active = i === activeStep;
    let progress: number | null = null;
    if (active && step.kind === "hero" && subChapterProgress) {
      progress = subChapterProgress.progress;
    }
    return { id: step.id, label: step.label, progress };
  });

  return (
    <ChromeDotsRail
      steps={railSteps}
      activeStep={activeStep}
      scrollToStep={scrollToStep}
      ariaLabel={`Home progress, section ${activeStep + 1} of ${steps.length}`}
    />
  );
}
