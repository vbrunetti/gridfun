"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useChromeFocusPreview, useChromeFocusSteps } from "@/components/chrome/use-chrome-focus";
import { useCaseStudiesScrollRegister } from "@/components/case-studies/case-studies-scroll-context";
import { usePanelDeck } from "@/components/deck/use-panel-deck";
import type { ChromeSurface } from "@/lib/chrome-surface";

export type CaseStudiesStep = {
  id: string;
  surface: ChromeSurface;
};

type CaseStudiesScrollProps = {
  steps: CaseStudiesStep[];
  children: ReactNode;
};

/**
 * Native scroll-snap (CSS) for step alignment on the case-studies index.
 * usePanelDeck owns active-index detection; dots + chrome surface derive from
 * the active panel's declared surface, not imperative dataset pokes.
 */
export function CaseStudiesScroll({ steps, children }: CaseStudiesScrollProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [hoverStep, setHoverStep] = useState<number | null>(null);
  const [dotsVisible, setDotsVisible] = useState(false);

  const sections = [
    {
      id: "cs-index",
      axis: "y" as const,
      panels: steps.map((s) => ({
        id: s.id,
        size: "fullscreen" as const,
        surface: s.surface,
      })),
    },
  ];

  const { activeIndex, goTo } = usePanelDeck({
    sections,
    onActiveChange: (id) => {
      const el = document.getElementById(id);
      const surface = (el?.dataset.chromeSurface as ChromeSurface | undefined) ?? "dark";
      document.body.dataset.chromeSurface = surface;
    },
  });

  const scrollToStep = useCallback(
    (index: number) => {
      goTo(index);
    },
    [goTo],
  );

  useCaseStudiesScrollRegister(
    true,
    steps.length,
    activeIndex,
    scrollToStep,
    dotsVisible,
    hoverStep,
    setHoverStep,
  );

  useChromeFocusSteps(rootRef, activeIndex, steps.length > 1);
  useChromeFocusPreview(rootRef, hoverStep, steps.length > 1);

  // Desktop — case studies index is dark; set before IntersectionObserver fires.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      if (mq.matches) document.body.dataset.chromeSurface = "dark";
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      if (mq.matches) delete document.body.dataset.chromeSurface;
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

  return (
    <article ref={rootRef} className="work-scroll-snap cs-index-scroll">
      {children}
    </article>
  );
}
