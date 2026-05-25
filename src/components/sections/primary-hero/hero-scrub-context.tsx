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
import type { HeroSlate } from "@/content/hero-slates";

export type HeroScrubState = {
  slates: HeroSlate[];
  activeIndex: number;
  scrollToSlate: (index: number) => void;
  /** False once scroll leaves hero chapters (e.g. cover section on home). */
  dotsVisible: boolean;
};

type HeroScrubContextValue = {
  state: HeroScrubState | null;
  setState: (state: HeroScrubState | null) => void;
};

const HeroScrubContext = createContext<HeroScrubContextValue | null>(null);

export function HeroScrubProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HeroScrubState | null>(null);
  const value = useMemo(() => ({ state, setState }), [state]);

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

/** Registers hero scrub controls for chrome-layer dots (FloatingChrome). */
export function useHeroScrubRegister(
  enabled: boolean,
  slates: HeroSlate[],
  activeIndex: number,
  scrollToSlate: (index: number) => void,
  dotsVisible: boolean,
) {
  const { setState } = useHeroScrubContext();
  const scrollRef = useRef(scrollToSlate);
  scrollRef.current = scrollToSlate;

  useEffect(() => {
    if (!enabled) {
      setState(null);
      return;
    }

    setState({
      slates,
      activeIndex,
      scrollToSlate: (index) => scrollRef.current(index),
      dotsVisible,
    });

    return () => setState(null);
  }, [enabled, slates, activeIndex, dotsVisible, setState]);
}
