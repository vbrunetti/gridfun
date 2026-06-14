"use client";

import type { ParticlePreset } from "./particle-presets";
import { useHomeScrollVisual } from "./home-scroll-visual-context";
import { PrimaryHeroSparkStage } from "./primary-hero-spark-stage";

type HomeSparkPinProps = {
  presets: ParticlePreset[];
};

/** Sticky spark companion — stays in the hero band while chapters scroll. */
export function HomeSparkPin({ presets }: HomeSparkPinProps) {
  const { sparkBlend, sparkPaused } = useHomeScrollVisual();

  return (
    <div className="home-spark-pin" aria-hidden>
      <PrimaryHeroSparkStage
        className="home-spark-pin__stage"
        presets={presets}
        blend={sparkBlend}
        paused={sparkPaused}
      />
    </div>
  );
}
