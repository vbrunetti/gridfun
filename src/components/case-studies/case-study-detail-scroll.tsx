"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  useCaseStudyDetailScrollRegister,
  type CaseStudyDetailStep,
} from "@/components/case-studies/case-study-detail-scroll-context";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function chromeAnchorY(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--chrome-top-offset",
  );
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 64;
}

/** Last step whose row top has crossed the chrome anchor — 1:1 with the dots. */
function activeStepIndex(steps: CaseStudyDetailStep[]): number {
  const anchor = chromeAnchorY() + 8;
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;
  if (window.scrollY >= maxScroll - 4) {
    return steps.length - 1;
  }

  let best = 0;
  for (let i = 0; i < steps.length; i++) {
    const el = document.getElementById(steps[i]!.id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= anchor) best = i;
  }
  return best;
}

type CaseStudyDetailScrollProps = {
  steps: CaseStudyDetailStep[];
  children: ReactNode;
};

/**
 * Tracks which case-study row is in view and exposes step navigation to the
 * right-rail dots (hero, prose, vignette, footer).
 */
export function CaseStudyDetailScroll({
  steps,
  children,
}: CaseStudyDetailScrollProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const syncActiveStep = useCallback(() => {
    setActiveStep(activeStepIndex(steps));
  }, [steps]);

  const scrollToStep = useCallback(
    (index: number) => {
      const step = steps[index];
      if (!step) return;
      const el = document.getElementById(step.id);
      if (!el) return;
      el.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    },
    [steps],
  );

  useCaseStudyDetailScrollRegister(true, steps, activeStep, scrollToStep, true);

  useEffect(() => {
    syncActiveStep();
    const onScroll = () => syncActiveStep();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [syncActiveStep]);

  return (
    <article ref={rootRef} className="cs-detail">
      {children}
    </article>
  );
}
