import {
  createDefaultSparkHeroSnapshot,
  isSparkHeroSnapshot,
  type SparkHeroSnapshot,
} from "@/lib/spark-hero-snapshot";

const STORAGE_KEY = "gridfun:spark-tuner:v1";

export function readSparkTunerDraft(): SparkHeroSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isSparkHeroSnapshot(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeSparkTunerDraft(snapshot: SparkHeroSnapshot) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function clearSparkTunerDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function snapshotFromTunerState(state: {
  presets: SparkHeroSnapshot["presets"];
  colorMode: SparkHeroSnapshot["color"]["colorMode"];
  compositeMode: SparkHeroSnapshot["color"]["compositeMode"];
  colorCycleSpeed: number;
  showBoundary: boolean;
}): SparkHeroSnapshot {
  return {
    version: 1,
    presets: state.presets.map((preset) => ({ ...preset })),
    color: {
      colorMode: state.colorMode,
      compositeMode: state.compositeMode,
      colorCycleSpeed: state.colorCycleSpeed,
    },
    showBoundary: state.showBoundary,
  };
}

export function fallbackSparkSnapshot(): SparkHeroSnapshot {
  return createDefaultSparkHeroSnapshot();
}
