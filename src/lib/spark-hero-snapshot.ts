import { DEFAULT_CHAPTER_PRESETS } from "@/components/sections/primary-hero/particle-presets";
import type {
  SparkColorMode,
  SparkCompositeMode,
} from "@/components/sections/primary-hero/spark-canvas";
import type { ParticlePreset } from "@/components/sections/primary-hero/particle-presets";

export type SparkHeroColor = {
  colorMode: SparkColorMode;
  compositeMode: SparkCompositeMode;
  colorCycleSpeed: number;
};

export type SparkHeroSnapshot = {
  version: 1;
  presets: ParticlePreset[];
  color: SparkHeroColor;
  showBoundary?: boolean;
};

export function createDefaultSparkHeroSnapshot(): SparkHeroSnapshot {
  return {
    version: 1,
    presets: DEFAULT_CHAPTER_PRESETS.map((preset) => ({ ...preset })),
    color: {
      colorMode: "cycle",
      compositeMode: "lighter",
      colorCycleSpeed: 0.08,
    },
    showBoundary: false,
  };
}

export function isSparkHeroSnapshot(value: unknown): value is SparkHeroSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<SparkHeroSnapshot>;
  return (
    snapshot.version === 1 &&
    Array.isArray(snapshot.presets) &&
    snapshot.presets.length > 0 &&
    typeof snapshot.color === "object" &&
    snapshot.color !== null &&
    typeof snapshot.color.colorMode === "string" &&
    typeof snapshot.color.compositeMode === "string" &&
    typeof snapshot.color.colorCycleSpeed === "number"
  );
}
