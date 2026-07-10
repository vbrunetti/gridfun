"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  computeActiveIndex,
  getTopInset,
} from "@/components/deck/use-panel-deck";
import type { CaseStudyDetailStep } from "@/components/case-studies/case-study-detail-scroll-context";

/** Desktop breakpoint where vignettes become scroll-driven pins with per-panel snaps. */
const DECK_DESKTOP_QUERY = "(min-width: 1024px)";

/** One position in the flattened deck: a row, optionally a panel within it. */
type DeckStop = { stepIndex: number; panelIndex: number | null };

function buildStops(steps: CaseStudyDetailStep[]): DeckStop[] {
  const stops: DeckStop[] = [];
  steps.forEach((step, stepIndex) => {
    if (step.kind === "vignette" && step.panelCount > 1) {
      for (let p = 0; p < step.panelCount; p++) {
        stops.push({ stepIndex, panelIndex: p });
      }
    } else {
      stops.push({ stepIndex, panelIndex: null });
    }
  });
  return stops;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export type CaseStudyDeckOptions = {
  steps: CaseStudyDetailStep[];
  onActiveChange?: (stepIndex: number) => void;
};

export type CaseStudyDeckReturn = {
  /** Active row index (drives dot rail, focus, chrome surface). */
  activeIndex: number;
  /** Scroll to a row's first stop — used by dot-rail clicks. */
  goToStep: (stepIndex: number) => void;
  /** Scroll to a specific panel within a vignette row — used by peek clicks. */
  goToPanel: (stepIndex: number, panelIndex: number) => void;
};

/**
 * Case-study detail navigation. Scrolling itself is fully native: vignettes are tall
 * pinned sections with per-panel CSS snap-stops (see VignetteChapter + globals.css),
 * so the browser handles trackpad/inertia/snapping and the page can never rest
 * between panels. This hook only (a) tracks the active row for the dot rail / focus /
 * chrome surface, and (b) maps keyboard + dot-rail + peek navigation to a scroll
 * position. No wheel interception.
 */
export function useCaseStudyDeck({
  steps,
  onActiveChange,
}: CaseStudyDeckOptions): CaseStudyDeckReturn {
  const [activeIndex, setActiveIndex] = useState(0);

  const stepIds = steps.map((s) => s.id);
  const stepsKey = stepIds.join(",");

  const stopsRef = useRef<DeckStop[]>([]);
  stopsRef.current = buildStops(steps);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const onChangeRef = useRef(onActiveChange);
  onChangeRef.current = onActiveChange;
  const rafRef = useRef(0);

  const setActiveStep = useCallback((stepIndex: number) => {
    setActiveIndex((prev) => {
      if (prev === stepIndex) return prev;
      onChangeRef.current?.(stepIndex);
      return stepIndex;
    });
  }, []);

  /** Document scroll-Y that lands flush on a given stop. */
  const stopSnapY = useCallback((stop: DeckStop): number => {
    const step = stepsRef.current[stop.stepIndex];
    const el = step ? document.getElementById(step.id) : null;
    if (!el) return 0;
    const top = el.getBoundingClientRect().top + window.scrollY - getTopInset();
    if (stop.panelIndex === null || step!.panelCount <= 1) return top;
    // Mobile: panels are a variable-height vertical stack — snap to the real panel
    // element's top (offsetHeight/panelCount would be wrong now that heights vary).
    if (!window.matchMedia(DECK_DESKTOP_QUERY).matches) {
      const panelEl = el.querySelector<HTMLElement>(
        `.vframe[data-vframe-index="${stop.panelIndex}"]`,
      );
      if (panelEl) {
        return panelEl.getBoundingClientRect().top + window.scrollY - getTopInset();
      }
    }
    // Desktop scroll-pin vignette: one viewport of scroll per panel.
    const perPanel = el.offsetHeight / step!.panelCount;
    return top + stop.panelIndex * perPanel;
  }, []);

  const firstStopOfStep = useCallback((stepIndex: number) => {
    const found = stopsRef.current.findIndex((s) => s.stepIndex === stepIndex);
    return found < 0 ? 0 : found;
  }, []);

  /** Stop nearest the current scroll position. */
  const nearestStop = useCallback(() => {
    const stops = stopsRef.current;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < stops.length; i++) {
      const dist = Math.abs(stopSnapY(stops[i]!) - window.scrollY);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  }, [stopSnapY]);

  const goToStop = useCallback(
    (targetIndex: number) => {
      const stops = stopsRef.current;
      const target = stops[clamp(targetIndex, 0, stops.length - 1)];
      if (!target) return;
      window.scrollTo({ top: stopSnapY(target), behavior: "smooth" });
    },
    [stopSnapY],
  );

  const goToStep = useCallback(
    (stepIndex: number) => goToStop(firstStopOfStep(stepIndex)),
    [firstStopOfStep, goToStop],
  );

  const goToPanel = useCallback(
    (stepIndex: number, panelIndex: number) =>
      goToStop(firstStopOfStep(stepIndex) + panelIndex),
    [firstStopOfStep, goToStop],
  );

  const syncActive = useCallback(() => {
    if (stepIds.length === 0) return;
    setActiveStep(computeActiveIndex(stepIds, getTopInset()));
  }, [stepsKey, setActiveStep]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    syncActive();

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        syncActive();
      });
    };

    // Keyboard navigation steps one stop relative to the current scroll position —
    // desktop only (where vignettes are pinned with per-panel stops). On mobile,
    // native scrolling handles the keys.
    const deckMq = window.matchMedia(DECK_DESKTOP_QUERY);
    const onKeyDown = (e: KeyboardEvent) => {
      if (!deckMq.matches) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) {
        return;
      }
      const last = stopsRef.current.length - 1;
      const stepRelative = (dir: 1 | -1) =>
        goToStop(clamp(nearestStop() + dir, 0, last));

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          stepRelative(1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          stepRelative(-1);
          break;
        case " ":
          e.preventDefault();
          stepRelative(e.shiftKey ? -1 : 1);
          break;
        case "Home":
          e.preventDefault();
          goToStop(0);
          break;
        case "End":
          e.preventDefault();
          goToStop(last);
          break;
        default:
          break;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("keydown", onKeyDown);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stepsKey, syncActive, goToStop, nearestStop]);

  return { activeIndex, goToStep, goToPanel };
}
