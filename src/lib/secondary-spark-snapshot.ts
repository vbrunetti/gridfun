import { palette } from "@/lib/colors";
import type {
  SparkColorMode,
  SparkCompositeMode,
} from "@/components/sections/primary-hero/spark-canvas";
import type { ParticlePreset } from "@/components/sections/primary-hero/particle-presets";

/** Design-system accents for secondary multi-color spawn. */
export const SECONDARY_SPARK_ACCENTS = [
  palette.neonLime,
  palette.hotPink,
  palette.skyBlue,
  palette.mediumBlue,
  palette.royalBlue,
  palette.cruise,
] as const;

export type SecondarySparkColorChoice = "white" | "lime" | "multi";

export type SecondarySparkColor = {
  colorMode: SparkColorMode;
  compositeMode: SparkCompositeMode;
  colorCycleSpeed: number;
  /** Used when colorMode is "fixed". */
  fixedColor: string;
};

export type SecondarySparkSnapshot = {
  version: 1;
  preset: ParticlePreset;
  color: SecondarySparkColor;
  showBoundary?: boolean;
};

export function secondaryColorChoiceFromSnapshot(
  color: SecondarySparkColor,
): SecondarySparkColorChoice {
  if (color.colorMode === "palette") return "multi";
  const hex = color.fixedColor.toUpperCase();
  if (hex === palette.white.toUpperCase() || hex === "#FFF" || hex === "#FFFFFF") {
    return "white";
  }
  return "lime";
}

export function secondaryColorFromChoice(
  choice: SecondarySparkColorChoice,
): SecondarySparkColor {
  if (choice === "white") {
    return {
      colorMode: "fixed",
      compositeMode: "source-over",
      colorCycleSpeed: 0.08,
      fixedColor: palette.white,
    };
  }
  if (choice === "multi") {
    return {
      colorMode: "palette",
      compositeMode: "source-over",
      colorCycleSpeed: 0.08,
      fixedColor: palette.neonLime,
    };
  }
  return {
    colorMode: "fixed",
    compositeMode: "source-over",
    colorCycleSpeed: 0.08,
    fixedColor: palette.neonLime,
  };
}

/** Full-viewport neon field — starting point for secondary background v2. */
export function createDefaultSecondarySparkSnapshot(): SecondarySparkSnapshot {
  return {
    version: 1,
    preset: {
      label: "Secondary · Field",
      shape: "viewport",
      boundaryScale: 1,
      rotationDeg: 0,
      count: 820,
      particleRadiusMin: 0.85,
      particleRadiusMax: 1.35,
      lifespanMin: 0.45,
      lifespanMax: 0.95,
      turbulence: 0.22,
      speed: 3.4,
      drag: 0.92,
      swirl: 0.004,
      gravity: 0.0012,
      outwardBias: 0.72,
      alpha: 0.78,
      glowScale: 1.35,
      linkDistance: 28,
      linkOpacity: 0.22,
      spawnSpread: 0.92,
    },
    color: secondaryColorFromChoice("lime"),
    showBoundary: false,
  };
}

export function isSecondarySparkSnapshot(
  value: unknown,
): value is SecondarySparkSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<SecondarySparkSnapshot>;
  return (
    snapshot.version === 1 &&
    typeof snapshot.preset === "object" &&
    snapshot.preset !== null &&
    typeof snapshot.color === "object" &&
    snapshot.color !== null &&
    typeof snapshot.color.colorMode === "string" &&
    typeof snapshot.color.compositeMode === "string" &&
    typeof snapshot.color.colorCycleSpeed === "number" &&
    typeof snapshot.color.fixedColor === "string"
  );
}

