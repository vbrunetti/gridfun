"use client";

import { useEffect, useState } from "react";
import {
  SparkCanvas,
  type SparkBlend,
  type SparkColorMode,
} from "@/components/sections/primary-hero/spark-canvas";
import type { ParticlePreset } from "@/components/sections/primary-hero/particle-presets";
import {
  MOBILE_SPARK_BRIGHTNESS_BOOST,
  MOBILE_SPARK_SIZE_BOOST,
} from "@/components/sections/primary-hero/spark-hero-config";
import { palette } from "@/lib/colors";
import { SECONDARY_SPARK_ACCENTS } from "@/lib/secondary-spark-snapshot";

type SecondarySparkLayerProps = {
  preset: ParticlePreset;
  paused?: boolean;
  colorMode?: SparkColorMode;
  fixedColor?: string;
  className?: string;
};

const STATIC_BLEND: SparkBlend = { from: 0, to: 0, t: 0 };
const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * Full-canvas spark field for home-secondary / secondary-spark playground.
 * No shape silhouette — particles spawn and roam the entire frame.
 * Always normal paint (source-over).
 */
export function SecondarySparkLayer({
  preset,
  paused = false,
  colorMode = "fixed",
  fixedColor = palette.neonLime,
  className = "",
}: SecondarySparkLayerProps) {
  const [mobilePresence, setMobilePresence] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setMobilePresence(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div
      className={["secondary-spark-layer", className].filter(Boolean).join(" ")}
      aria-hidden
    >
      <SparkCanvas
        presets={[preset]}
        blend={STATIC_BLEND}
        directPreset={preset}
        paused={paused}
        unbounded
        shapeScale={1}
        canvasBleed={0.04}
        colorMode={colorMode}
        fixedColor={fixedColor}
        compositeMode="source-over"
        accentPalette={SECONDARY_SPARK_ACCENTS}
        sizeBoost={mobilePresence ? MOBILE_SPARK_SIZE_BOOST : 1}
        brightnessBoost={mobilePresence ? MOBILE_SPARK_BRIGHTNESS_BOOST : 1}
      />
    </div>
  );
}
