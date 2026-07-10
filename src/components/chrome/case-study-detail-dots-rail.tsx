"use client";

import { useEffect, useState } from "react";
import { ChromeDotsRail } from "@/components/chrome/chrome-dots-rail";
import { useCaseStudyDetailScrollContext } from "@/components/case-studies/case-study-detail-scroll-context";

/** Body class — floating-chrome uses pointer-events:none so :hover never hits it. */
export const CS_DETAIL_NAV_HOVER_CLASS = "cs-detail-nav-hover";

export function CaseStudyDetailDotsRail() {
  const { state } = useCaseStudyDetailScrollContext();
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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

  // Two dot models, split by viewport:
  //   • Desktop — vignettes are a horizontal filmstrip pinned under one dot, so
  //     every section/vignette is a single stop. The active vignette's dot carries
  //     a radial ring tracking horizontal panel progress (the pre-mobile model).
  //   • Mobile (panelDots) — vignettes are a vertical scroll-snap stack where each
  //     panel is a real stop, so every panel gets its own dot (no ring).
  const usePanelDots = panelDots && !desktop;

  const dots = usePanelDots
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
    if (!usePanelDots) return activeStep;
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

  const railSteps = dots.map((dot) => {
    // Radial ring — desktop only, on the active vignette's single dot.
    let progress: number | null = null;
    if (desktop && dot.stepIndex === activeStep) {
      const step = steps[dot.stepIndex];
      if (
        step?.kind === "vignette" &&
        vignetteProgress &&
        vignetteProgress.vignetteSlug === step.vignetteSlug
      ) {
        progress =
          (vignetteProgress.panelIndex + 1) / vignetteProgress.panelCount;
      }
    }
    return { id: dot.id, label: dot.label, progress };
  });

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
      ariaLabel={`Case study progress, ${
        usePanelDots ? "panel" : "section"
      } ${activeDot + 1} of ${dots.length}`}
      onMouseEnter={() => document.body.classList.add(CS_DETAIL_NAV_HOVER_CLASS)}
      onMouseLeave={() => {
        document.body.classList.remove(CS_DETAIL_NAV_HOVER_CLASS);
        setHoverStep(null);
      }}
      onDotMouseEnter={(flatIndex) => setHoverStep(dots[flatIndex]?.stepIndex ?? null)}
    />
  );
}
