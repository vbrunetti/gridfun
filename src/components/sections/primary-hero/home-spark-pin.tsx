"use client";

import { RuledGrid } from "@/components/layout/ruled-grid";
import type { ParticlePreset } from "./particle-presets";
import { useHomeScrollVisual } from "./home-scroll-visual-context";
import { PrimaryHeroSparkLayer } from "./primary-hero-spark-layer";

type HomeSparkPinProps = {
  presets: ParticlePreset[];
};

/** Sticky spark companion — stays in the hero band while chapters scroll. */
export function HomeSparkPin({ presets }: HomeSparkPinProps) {
  const { sparkBlend, sparkPaused } = useHomeScrollVisual();

  return (
    <div className="home-spark-pin" aria-hidden>
      <RuledGrid className="primary-hero-stage primary-hero-stage--split-scene home-spark-pin__stage h-full">
        <PrimaryHeroSparkLayer
          presets={presets}
          blend={sparkBlend}
          paused={sparkPaused}
        />
      </RuledGrid>
    </div>
  );
}
