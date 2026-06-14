"use client";

import type { ReactNode } from "react";
import { RuledGrid } from "@/components/layout/ruled-grid";
import {
  PrimaryHeroSparkLayer,
  type PrimaryHeroSparkLayerProps,
} from "./primary-hero-spark-layer";

type PrimaryHeroSparkStageProps = PrimaryHeroSparkLayerProps & {
  className?: string;
  children?: ReactNode;
};

/** Master-grid spark stage — same RuledGrid shell as the homepage hero pin. */
export function PrimaryHeroSparkStage({
  className = "",
  children,
  ...sparkProps
}: PrimaryHeroSparkStageProps) {
  return (
    <RuledGrid
      className={`primary-hero-stage primary-hero-stage--split-scene h-full ${className}`.trim()}
    >
      {children}
      <PrimaryHeroSparkLayer {...sparkProps} />
    </RuledGrid>
  );
}
