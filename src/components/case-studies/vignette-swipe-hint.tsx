"use client";

import { useCaseStudyDetailScrollContext } from "@/components/case-studies/case-study-detail-scroll-context";

/**
 * Mobile-only looping arrow that cues the next swipe. It points RIGHT while there are
 * more panels to swipe through inside the active vignette, and DOWN otherwise (to the
 * next section). The `key` is the current panel/section, so the element remounts on
 * each change and replays its CSS lifecycle: fade in, hold, fade out — cueing on
 * arrival, then clearing. Hidden on the last step and on desktop (CSS). Decorative.
 */
export function VignetteSwipeHint() {
  const { state } = useCaseStudyDetailScrollContext();
  if (!state) return null;

  const { steps, activeStep, vignetteProgress } = state;
  const step = steps[activeStep];
  if (!step) return null;

  const moreVignettePanels =
    step.kind === "vignette" &&
    vignetteProgress != null &&
    vignetteProgress.panelIndex < vignetteProgress.panelCount - 1;
  const hasNextSection = activeStep < steps.length - 1;

  const axis = moreVignettePanels ? "right" : hasNextSection ? "down" : null;
  if (!axis) return null;

  const panelIndex = vignetteProgress?.panelIndex ?? -1;

  return (
    <div
      key={`${activeStep}:${panelIndex}`}
      className={`swipe-hint swipe-hint--${axis}`}
      aria-hidden="true"
    >
      <svg
        className="swipe-hint__chevron"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
