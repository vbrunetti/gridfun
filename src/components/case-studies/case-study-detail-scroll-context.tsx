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
  visible: boolean;
  vignetteProgress: VignettePanelProgress | null;
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
  visible: boolean,
) {
  const { setState } = useCaseStudyDetailScrollContext();
  const scrollRef = useRef(scrollToStep);
  scrollRef.current = scrollToStep;

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
      visible,
      vignetteProgress: null,
    });

    return () => setState(null);
  }, [enabled, steps, visible, setState]);

  // Active row updates without unregistering the rail.
  useEffect(() => {
    if (!enabled) return;
    setState((prev) =>
      prev && prev.activeStep !== activeStep
        ? { ...prev, activeStep }
        : prev,
    );
  }, [enabled, activeStep, setState]);
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
