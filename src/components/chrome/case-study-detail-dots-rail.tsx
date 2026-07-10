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

  const {
    steps,
    activeStep,
    scrollToStep,
    scrollToPanel,
    panelDots,
    vignetteProgress,
    setHoverStep,
  } = state;

  // Two granularities (no radial ring in either):
  //   • Case-study detail (default): one dot per section/vignette — dot 1 = the
  //     title (hero), then one per chapter.
  //   • Craft vignette detail (panelDots): one dot per panel — the single vignette
  //     is expanded so every panel is an equal stop (the hero is the title dot).
  const dots = panelDots
    ? steps.flatMap((step, stepIndex) => {
        if (step.kind === "vignette" && step.panelCount > 1) {
          return Array.from({ length: step.panelCount }, (_, panelIndex) => ({
            id: `${step.id}:${panelIndex}`,
            label: `${step.label} — ${panelIndex + 1}`,
            stepIndex,
            panelIndex: panelIndex as number | null,
          }));
        }
        return [{ id: step.id, label: step.label, stepIndex, panelIndex: null as number | null }];
      })
    : steps.map((step, stepIndex) => ({
        id: step.id,
        label: step.label,
        stepIndex,
        panelIndex: null as number | null,
      }));

  // Active dot index within the (possibly flattened) dot list.
  const activeDot = (() => {
    if (!panelDots) return activeStep;
    let flat = 0;
    for (let s = 0; s < steps.length; s++) {
      const step = steps[s]!;
      const count = step.kind === "vignette" && step.panelCount > 1 ? step.panelCount : 1;
      if (s === activeStep) {
        let panel = 0;
        if (
          step.kind === "vignette" &&
          vignetteProgress &&
          vignetteProgress.vignetteSlug === step.vignetteSlug
        ) {
          panel = Math.min(Math.max(vignetteProgress.panelIndex, 0), count - 1);
        }
        return flat + panel;
      }
      flat += count;
    }
    return 0;
  })();

  const railSteps = dots.map((dot) => ({ id: dot.id, label: dot.label, progress: null }));

  const goToDot = (flatIndex: number) => {
    const dot = dots[flatIndex];
    if (!dot) return;
    if (dot.panelIndex === null) scrollToStep(dot.stepIndex);
    else scrollToPanel(dot.stepIndex, dot.panelIndex);
  };

  return (
    <ChromeDotsRail
      className="chrome-dots-rail--detail"
      steps={railSteps}
      activeStep={activeDot}
      scrollToStep={goToDot}
      ariaLabel={`Case study progress, panel ${activeDot + 1} of ${dots.length}`}
      onMouseEnter={() => document.body.classList.add(CS_DETAIL_NAV_HOVER_CLASS)}
      onMouseLeave={() => {
        document.body.classList.remove(CS_DETAIL_NAV_HOVER_CLASS);
        setHoverStep(null);
      }}
      onDotMouseEnter={(flatIndex) => setHoverStep(dots[flatIndex]?.stepIndex ?? null)}
    />
  );
}
