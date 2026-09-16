"use client";

import { useEffect, useState } from "react";
import { ChromeDotsRail } from "@/components/chrome/chrome-dots-rail";
import {
  useCaseStudyDetailScrollContext,
  type CaseStudyDetailStep,
} from "@/components/case-studies/case-study-detail-scroll-context";

/** Body class — floating-chrome uses pointer-events:none so :hover never hits it. */
export const CS_DETAIL_NAV_HOVER_CLASS = "cs-detail-nav-hover";

type VignetteDot = {
  id: string;
  label: string;
  stepIndex: number;
  panelIndex: number | null;
};

function vignetteEntries(steps: CaseStudyDetailStep[]) {
  return steps
    .map((step, stepIndex) => ({ step, stepIndex }))
    .filter(({ step }) => step.kind === "vignette");
}

/**
 * Last vignette at or before the focused row. Hero / intro prose (before any
 * chapter) returns -1 so no dot is current; glue and the footer stick to the
 * chapter you just left.
 */
function lastVignetteAtOrBefore(
  entries: ReturnType<typeof vignetteEntries>,
  activeStep: number,
): number {
  let found = -1;
  for (let i = 0; i < entries.length; i++) {
    if (entries[i]!.stepIndex <= activeStep) found = i;
  }
  return found;
}

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

  const steps = state?.steps ?? [];
  const entries = vignetteEntries(steps);

  if (!state?.visible || entries.length === 0) {
    return null;
  }

  const {
    activeStep,
    scrollToStep,
    scrollToPanel,
    panelDots,
    vignetteProgress,
    setHoverStep,
  } = state;

  // Dots are chapters (vignettes) only — hero, glue prose, and the footer stay
  // off the rail. Craft detail (`panelDots`) still expands a single vignette
  // into per-panel dots on mobile, where the filmstrip is a vertical stack.
  const usePanelDots = panelDots && !desktop;

  const dots: VignetteDot[] = usePanelDots
    ? entries.flatMap(({ step, stepIndex }) => {
        if (step.panelCount > 1) {
          return Array.from({ length: step.panelCount }, (_, panelIndex) => ({
            id: `${step.id}:${panelIndex}`,
            label: `${step.label} — ${panelIndex + 1}`,
            stepIndex,
            panelIndex,
          }));
        }
        return [{ id: step.id, label: step.label, stepIndex, panelIndex: null }];
      })
    : entries.map(({ step, stepIndex }) => ({
        id: step.id,
        label: step.label,
        stepIndex,
        panelIndex: null,
      }));

  const chapterIndex = lastVignetteAtOrBefore(entries, activeStep);

  const activeDot = (() => {
    if (chapterIndex < 0) return -1;
    if (!usePanelDots) return chapterIndex;

    const entry = entries[chapterIndex]!;
    const count = Math.max(entry.step.panelCount, 1);
    let start = 0;
    for (let i = 0; i < chapterIndex; i++) {
      const step = entries[i]!.step;
      start += step.panelCount > 1 ? step.panelCount : 1;
    }

    let panel = count - 1;
    if (entry.stepIndex === activeStep) {
      panel = 0;
      if (
        vignetteProgress &&
        vignetteProgress.vignetteSlug === entry.step.vignetteSlug
      ) {
        panel = Math.min(Math.max(vignetteProgress.panelIndex, 0), count - 1);
      }
    }
    return start + panel;
  })();

  const railSteps = dots.map((dot, i) => {
    let progress: number | null = null;
    if (desktop && i === activeDot && chapterIndex >= 0) {
      const entry = entries[chapterIndex]!;
      if (
        entry.stepIndex === activeStep &&
        vignetteProgress &&
        vignetteProgress.vignetteSlug === entry.step.vignetteSlug
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

  const kind = usePanelDots ? "panel" : "vignette";
  const ariaLabel =
    activeDot >= 0
      ? `Case study progress, ${kind} ${activeDot + 1} of ${dots.length}`
      : `Case study progress, ${dots.length} ${kind}${dots.length === 1 ? "" : "s"}`;

  return (
    <ChromeDotsRail
      className="chrome-dots-rail--detail"
      steps={railSteps}
      activeStep={activeDot}
      scrollToStep={goToDot}
      ariaLabel={ariaLabel}
      onMouseEnter={() => document.body.classList.add(CS_DETAIL_NAV_HOVER_CLASS)}
      onMouseLeave={() => {
        document.body.classList.remove(CS_DETAIL_NAV_HOVER_CLASS);
        setHoverStep(null);
      }}
      onDotMouseEnter={(flatIndex) => setHoverStep(dots[flatIndex]?.stepIndex ?? null)}
    />
  );
}
