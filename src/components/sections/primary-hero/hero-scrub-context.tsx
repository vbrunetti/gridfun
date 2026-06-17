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

export type HomeScrollStepKind = "hero" | "section";

export type HomeScrollStep = {
  id: string;
  kind: HomeScrollStepKind;
  label: string;
  /** Hero step only — number of scroll sub-chapters in the radial ring. */
  subChapterCount?: number;
};

/** 0–1 progress through the hero's sub-chapters (feeds the hero dot's radial ring). */
export type HeroSubChapterProgress = {
  progress: number;
};

export type HeroScrubState = {
  steps: HomeScrollStep[];
  activeStep: number;
  scrollToStep: (index: number) => void;
  visible: boolean;
  subChapterProgress: HeroSubChapterProgress | null;
};

type HeroScrubContextValue = {
  state: HeroScrubState | null;
  setState: Dispatch<SetStateAction<HeroScrubState | null>>;
  setSubChapterProgress: Dispatch<SetStateAction<HeroSubChapterProgress | null>>;
};

const HeroScrubContext = createContext<HeroScrubContextValue | null>(null);

export function HeroScrubProvider({ children }: { children: ReactNode }) {
  const [scrollState, setScrollState] = useState<HeroScrubState | null>(null);
  const [subChapterProgress, setSubChapterProgress] =
    useState<HeroSubChapterProgress | null>(null);

  const value = useMemo(
    () => ({
      state: scrollState ? { ...scrollState, subChapterProgress } : null,
      setState: setScrollState,
      setSubChapterProgress,
    }),
    [scrollState, subChapterProgress],
  );

  return (
    <HeroScrubContext.Provider value={value}>{children}</HeroScrubContext.Provider>
  );
}

export function useHeroScrubContext() {
  const context = useContext(HeroScrubContext);
  if (!context) {
    throw new Error("useHeroScrubContext must be used within HeroScrubProvider");
  }
  return context;
}

/** Registers home scroll controls for the right-rail dots (FloatingChrome). */
export function useHeroScrubRegister(
  enabled: boolean,
  steps: HomeScrollStep[],
  activeStep: number,
  scrollToStep: (index: number) => void,
  visible: boolean,
) {
  const { setState } = useHeroScrubContext();
  const scrollRef = useRef(scrollToStep);
  scrollRef.current = scrollToStep;

  const activeRef = useRef(activeStep);
  activeRef.current = activeStep;

  useEffect(() => {
    if (!enabled) {
      setState(null);
      return;
    }

    setState((prev) => ({
      steps,
      activeStep: activeRef.current,
      scrollToStep: (index) => scrollRef.current(index),
      visible,
      subChapterProgress: prev?.subChapterProgress ?? null,
    }));

    return () => setState(null);
  }, [enabled, steps, visible, setState]);

  useEffect(() => {
    if (!enabled) return;
    setState((prev) =>
      prev && prev.activeStep !== activeStep
        ? { ...prev, activeStep }
        : prev,
    );
  }, [enabled, activeStep, setState]);
}

/** Radial ring on the active hero dot while scrolling through sub-chapters. */
export function useHeroSubChapterProgressRegister(
  progress: HeroSubChapterProgress | null,
) {
  const { setSubChapterProgress } = useHeroScrubContext();
  const progressValue = progress?.progress ?? null;

  useEffect(() => {
    setSubChapterProgress((prev) => {
      if (progressValue === null) return prev === null ? prev : null;
      if (prev?.progress === progressValue) return prev;
      return { progress: progressValue };
    });
    return () => setSubChapterProgress(null);
  }, [progressValue, setSubChapterProgress]);
}
