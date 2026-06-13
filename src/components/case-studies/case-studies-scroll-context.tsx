"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CaseStudiesScrollState = {
  stepCount: number;
  activeStep: number;
  scrollToStep: (index: number) => void;
  visible: boolean;
  hoverStep: number | null;
  setHoverStep: (step: number | null) => void;
};

type CaseStudiesScrollContextValue = {
  state: CaseStudiesScrollState | null;
  setState: (state: CaseStudiesScrollState | null) => void;
};

const CaseStudiesScrollContext =
  createContext<CaseStudiesScrollContextValue | null>(null);

export function CaseStudiesScrollProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CaseStudiesScrollState | null>(null);
  const value = useMemo(() => ({ state, setState }), [state]);

  return (
    <CaseStudiesScrollContext.Provider value={value}>
      {children}
    </CaseStudiesScrollContext.Provider>
  );
}

export function useCaseStudiesScrollContext() {
  const context = useContext(CaseStudiesScrollContext);
  if (!context) {
    throw new Error(
      "useCaseStudiesScrollContext must be used within CaseStudiesScrollProvider",
    );
  }
  return context;
}

/** Registers step-scroll controls for chrome-layer dots (FloatingChrome). */
export function useCaseStudiesScrollRegister(
  enabled: boolean,
  stepCount: number,
  activeStep: number,
  scrollToStep: (index: number) => void,
  visible: boolean,
  hoverStep: number | null,
  setHoverStep: (step: number | null) => void,
) {
  const { setState } = useCaseStudiesScrollContext();
  const scrollRef = useRef(scrollToStep);
  scrollRef.current = scrollToStep;
  const setHoverRef = useRef(setHoverStep);
  setHoverRef.current = setHoverStep;

  useEffect(() => {
    if (!enabled) {
      setState(null);
      return;
    }

    setState({
      stepCount,
      activeStep,
      scrollToStep: (index) => scrollRef.current(index),
      visible,
      hoverStep,
      setHoverStep: (step) => setHoverRef.current(step),
    });

    return () => setState(null);
  }, [enabled, stepCount, activeStep, visible, hoverStep, setState]);
}
