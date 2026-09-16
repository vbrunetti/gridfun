"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useChromeFocusPreview, useChromeFocusSteps } from "@/components/chrome/use-chrome-focus";
import { useCaseStudiesScrollRegister } from "@/components/case-studies/case-studies-scroll-context";
import { usePanelDeck } from "@/components/deck/use-panel-deck";
import type { ChromeSurface } from "@/lib/chrome-surface";

export type CaseStudiesStep = {
  id: string;
  surface: ChromeSurface;
  label: string;
};

type CaseStudiesScrollProps = {
  steps: CaseStudiesStep[];
  children: ReactNode;
};

const MOBILE_QUERY = "(max-width: 1023px)";
const INTRO_STEP_ID = "cs-index-intro";

function useMobileIndexSteps(steps: CaseStudiesStep[]) {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return useMemo(
    () => (mobile ? steps.filter((step) => step.id !== INTRO_STEP_ID) : steps),
    [mobile, steps],
  );
}

/**
 * Native scroll-snap for the case-studies index. usePanelDeck tracks the active
 * panel for dots + chrome surface; mobile skips the desktop-only intro band.
 * The intro band never gets a dot — only study covers do.
 */
export function CaseStudiesScroll({ steps, children }: CaseStudiesScrollProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [hoverStep, setHoverStep] = useState<number | null>(null);
  const [dotsVisible, setDotsVisible] = useState(false);
  const deckSteps = useMobileIndexSteps(steps);
  const introSkipped = deckSteps.length !== steps.length;

  const sections = useMemo(
    () => [
      {
        id: "cs-index",
        axis: "y" as const,
        panels: deckSteps.map((s) => ({
          id: s.id,
          size: "fullscreen" as const,
          surface: s.surface,
        })),
      },
    ],
    [deckSteps],
  );

  const { activeIndex, goTo } = usePanelDeck({
    sections,
    onActiveChange: (id) => {
      const el = document.getElementById(id);
      const surface = (el?.dataset.chromeSurface as ChromeSurface | undefined) ?? "dark";
      document.body.dataset.chromeSurface = surface;
    },
  });

  const introInDeck = deckSteps[0]?.id === INTRO_STEP_ID;
  const introOffset = introInDeck ? 1 : 0;
  const dotSteps = introOffset ? deckSteps.slice(introOffset) : deckSteps;
  const dotsActive = activeIndex < introOffset ? -1 : activeIndex - introOffset;

  const scrollToStep = useCallback(
    (index: number) => {
      goTo(index + introOffset);
    },
    [goTo, introOffset],
  );

  const focusStep = introSkipped ? activeIndex + 1 : activeIndex;
  const previewStep = hoverStep !== null ? hoverStep + 1 : null;

  useCaseStudiesScrollRegister(
    true,
    dotSteps.length,
    dotSteps.map((step) => step.label),
    dotsActive,
    scrollToStep,
    dotsVisible,
    hoverStep,
    setHoverStep,
  );

  useChromeFocusSteps(rootRef, focusStep, deckSteps.length > 1);
  useChromeFocusPreview(rootRef, previewStep, deckSteps.length > 1);

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
