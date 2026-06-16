"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useChromeFocusPreview, useChromeFocusSteps } from "@/components/chrome/use-chrome-focus";
import { useCaseStudiesScrollRegister } from "@/components/case-studies/case-studies-scroll-context";

type CaseStudiesScrollProps = {
  children: ReactNode;
};

/**
 * Native scroll-snap (CSS) for step alignment. JS only tracks the active step
 * for dot nav + chrome focus — no wheel / key hijacking.
 */
export function CaseStudiesScroll({ children }: CaseStudiesScrollProps) {
  const rootRef = useRef<HTMLElement>(null);
  const rafRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const [hoverStep, setHoverStep] = useState<number | null>(null);
  const [stepCount, setStepCount] = useState(1);
  const [dotsVisible, setDotsVisible] = useState(false);

  const getSteps = useCallback(() => {
    const root = rootRef.current;
    if (!root) return [];

    return Array.from(
      root.querySelectorAll<HTMLElement>("[data-chrome-focus-step]"),
    ).sort(
      (a, b) =>
        Number(a.dataset.chromeFocusStep ?? 0) -
        Number(b.dataset.chromeFocusStep ?? 0),
    );
  }, []);

  const syncActiveStep = useCallback(() => {
    const steps = getSteps();
    setStepCount(Math.max(steps.length, 1));
    if (steps.length === 0) return;

    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const anchor = desktop ? 8 : 8;

    if (desktop) {
      document.body.dataset.chromeSurface = "dark";
    }

    let best = 0;
    for (let i = 0; i < steps.length; i++) {
      if (steps[i]!.getBoundingClientRect().top <= anchor) best = i;
    }
    setActiveStep(best);
  }, [getSteps]);

  const scrollToStep = useCallback(
    (index: number) => {
      const steps = getSteps();
      const el = steps[index];
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [getSteps],
  );

  useCaseStudiesScrollRegister(
    true,
    stepCount,
    activeStep,
    scrollToStep,
    dotsVisible,
    hoverStep,
    setHoverStep,
  );

  useChromeFocusSteps(rootRef, activeStep, stepCount > 1);
  useChromeFocusPreview(rootRef, hoverStep, stepCount > 1);

  // Desktop — case studies index is dark throughout; assert before IO ratios land.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      if (mq.matches) {
        document.body.dataset.chromeSurface = "dark";
      }
    };

    apply();
    mq.addEventListener("change", apply);

    return () => {
      mq.removeEventListener("change", apply);
      if (mq.matches) {
        delete document.body.dataset.chromeSurface;
      }
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setDotsVisible(entry?.isIntersecting ?? false),
      { threshold: 0.05 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    syncActiveStep();

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        syncActiveStep();
      });
    };

    const onResize = () => syncActiveStep();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [syncActiveStep]);

  return (
    <article ref={rootRef} className="work-scroll-snap cs-index-scroll">
      {children}
    </article>
  );
}
