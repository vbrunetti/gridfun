"use client";

import { ChromaAuroraCanvas } from "@/components/effects/chroma-aurora-canvas";
import { SecondarySparkLayer } from "@/components/effects/secondary-spark-layer";
import {
  SECONDARY_BACKGROUND_VARIANT,
  SECONDARY_SPARK_COLOR,
  SECONDARY_SPARK_PRESET,
} from "./secondary-spark-config";
import { useHomeScrollVisual } from "./home-scroll-visual-context";

/**
 * Home-secondary background — aurora rim (v1) or full-canvas spark field (v2).
 * Variant comes from `src/content/secondary-background.json`.
 */
export function HomeSecondaryAurora() {
  const { secondaryCovering, secondarySettled } = useHomeScrollVisual();
  // Run once the panel starts covering so the field is alive as it fades in.
  const paused = !(secondaryCovering || secondarySettled);

  if (SECONDARY_BACKGROUND_VARIANT === "spark") {
    return (
      <SecondarySparkLayer
        className="home-secondary-aurora"
        preset={SECONDARY_SPARK_PRESET}
        paused={paused}
        colorMode={SECONDARY_SPARK_COLOR.colorMode}
        fixedColor={SECONDARY_SPARK_COLOR.fixedColor}
      />
    );
  }

  return (
    <ChromaAuroraCanvas className="home-secondary-aurora" paused={paused} />
  );
}
