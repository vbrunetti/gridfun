"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SparkBlend } from "./spark-canvas";

export type HomeScrollVisualState = {
  activeChapter: number;
  sparkBlend: SparkBlend;
  sparkPaused: boolean;
  secondaryCovering: boolean;
  secondarySettled: boolean;
};

const defaultState: HomeScrollVisualState = {
  activeChapter: 0,
  sparkBlend: { from: 0, to: 0, t: 0 },
  sparkPaused: false,
  secondaryCovering: false,
  secondarySettled: false,
};

const HomeScrollVisualContext = createContext<HomeScrollVisualState>(defaultState);

export function HomeScrollVisualProvider({
  value,
  children,
}: {
  value: HomeScrollVisualState;
  children: ReactNode;
}) {
  return (
    <HomeScrollVisualContext.Provider value={value}>
      {children}
    </HomeScrollVisualContext.Provider>
  );
}

export function useHomeScrollVisual() {
  return useContext(HomeScrollVisualContext);
}
