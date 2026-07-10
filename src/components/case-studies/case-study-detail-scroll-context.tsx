"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type CaseStudyDetailStepKind = "hero" | "prose" | "vignette" | "footer";

export type CaseStudyDetailStep = {
  id: string;
  kind: CaseStudyDetailStepKind;
  label: string;
  vignetteSlug?: string;
  /**
   * Number of horizontal stops this row contributes to the controlled deck.
   * Narrative vignettes = title panel + one per image; everything else = 1.
   */
  panelCount: number;
};

export type VignettePanelProgress = {
  vignetteSlug: string;
  panelIndex: number;
  panelCount: number;
};

export type CaseStudyDetailScrollState = {
  steps: CaseStudyDetailStep[];
  activeStep: number;
  scrollToStep: (index: number) => void;
  /** Scroll to a specific panel within a vignette row (per-panel dot nav). */
  scrollToPanel: (stepIndex: number, panelIndex: number) => void;
  /**
   * Dot granularity. false (default, case-study detail) = one dot per section/
   * vignette. true (single-vignette craft detail) = one dot per panel.
   */
  panelDots: boolean;
  visible: boolean;
  vignetteProgress: VignettePanelProgress | null;
  hoverStep: number | null;
  setHoverStep: (step: number | null) => void;
};

type CaseStudyDetailScrollContextValue = {
  state: CaseStudyDetailScrollState | null;
  setState: Dispatch<SetStateAction<CaseStudyDetailScrollState | null>>;
  setVignetteProgress: (progress: VignettePanelProgress | null) => void;
};

const CaseStudyDetailScrollContext =
  createContext<CaseStudyDetailScrollContextValue | null>(null);

export function CaseStudyDetailScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [scrollState, setScrollState] =
    useState<CaseStudyDetailScrollState | null>(null);
  const [vignetteProgress, setVignetteProgress] =
    useState<VignettePanelProgress | null>(null);

  const value = useMemo(
    () => ({
      state: scrollState
        ? { ...scrollState, vignetteProgress }
        : null,
      setState: setScrollState,
      setVignetteProgress,
    }),
    [scrollState, vignetteProgress],
  );

  return (
    <CaseStudyDetailScrollContext.Provider value={value}>
      {children}
    </CaseStudyDetailScrollContext.Provider>
  );
}

export function useCaseStudyDetailScrollContext() {
  const context = useContext(CaseStudyDetailScrollContext);
  if (!context) {
    throw new Error(
      "useCaseStudyDetailScrollContext must be used within CaseStudyDetailScrollProvider",
    );
  }
  return context;
}

/** Registers row-scroll controls for the right-rail dots (FloatingChrome). */
export function useCaseStudyDetailScrollRegister(
  enabled: boolean,
  steps: CaseStudyDetailStep[],
  activeStep: number,
  scrollToStep: (index: number) => void,
  scrollToPanel: (stepIndex: number, panelIndex: number) => void,
  visible: boolean,
  hoverStep: number | null,
  setHoverStep: (step: number | null) => void,
  panelDots = false,
) {
  const { setState } = useCaseStudyDetailScrollContext();
  const scrollRef = useRef(scrollToStep);
  scrollRef.current = scrollToStep;
  const scrollPanelRef = useRef(scrollToPanel);
  scrollPanelRef.current = scrollToPanel;
  const setHoverRef = useRef(setHoverStep);
  setHoverRef.current = setHoverStep;

  const activeRef = useRef(activeStep);
  activeRef.current = activeStep;

  // Mount / unmount + step list changes — avoid tearing down on every scroll tick.
  useEffect(() => {
    if (!enabled) {
      setState(null);
      return;
    }

    setState({
      steps,
      activeStep: activeRef.current,
      scrollToStep: (index) => scrollRef.current(index),
      scrollToPanel: (stepIndex, panelIndex) =>
        scrollPanelRef.current(stepIndex, panelIndex),
      panelDots,
      visible,
      vignetteProgress: null,
      hoverStep: null,
      setHoverStep: (step) => setHoverRef.current(step),
    });

    return () => setState(null);
  }, [enabled, steps, visible, panelDots, setState]);

  // Active row + hover preview — update without unregistering the rail.
  useEffect(() => {
    if (!enabled) return;
    setState((prev) => {
      if (!prev) return prev;
      if (prev.activeStep === activeStep && prev.hoverStep === hoverStep) {
        return prev;
      }
      return { ...prev, activeStep, hoverStep };
    });
  }, [enabled, activeStep, hoverStep, setState]);
}

/** Registers in-vignette panel progress for the active dot's radial ring. */
export function useCaseStudyVignetteProgressRegister(
  progress: VignettePanelProgress | null,
) {
  const { setVignetteProgress } = useCaseStudyDetailScrollContext();

  useEffect(() => {
    setVignetteProgress(progress);
    return () => setVignetteProgress(null);
  }, [progress, setVignetteProgress]);
}
