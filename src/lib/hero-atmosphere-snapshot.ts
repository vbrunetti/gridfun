import type { SparkBlend } from "@/components/sections/primary-hero/spark-canvas";
import { HOME_HERO_CHAPTER_COUNT } from "@/components/sections/primary-hero/spark-hero-config";

export type HeroNoiseBlendMode = "overlay" | "soft-light" | "multiply";

export type HeroNoiseConfig = {
  enabled: boolean;
  /** Lower = larger, chunkier cells. */
  cellFrequency: number;
  cellOctaves: number;
  density: number;
  tone: {
    amplitude: number;
    highlightSuppression: number;
    shadowBias: number;
  };
  blend: {
    baseTone: string;
    opacity: number;
    mode: HeroNoiseBlendMode;
  };
};

export type HeroBlobTone = "light" | "dark";

/** Runtime blob layout — positions are seeded per chapter, not saved in config. */
export type HeroSeededBlob = {
  tone: HeroBlobTone;
  x: number;
  y: number;
  size: number;
  driftAngle: number;
  phase: number;
  wobblePhase: number;
};

export type HeroBlobConfig = {
  enabled: boolean;
  /** Blobs per hero chapter (layout seeded from chapter index). */
  countPerChapter: number;
  /** Size as a fraction of viewport width. */
  size: number;
  driftSpeed: number;
  wobble: number;
  randomness: number;
  blur: number;
  lightStrength: number;
  darkStrength: number;
  transitionDistance: number;
};

export type HeroAtmosphereSnapshot = {
  version: 2;
  noise: HeroNoiseConfig;
  blobs: HeroBlobConfig;
};

type LegacyHeroAtmosphereSnapshot = {
  version: 1;
  noise: HeroNoiseConfig;
  blobGlobals?: {
    enabled: boolean;
    blur: number;
    lightStrength: number;
    darkStrength: number;
    transitionDistance: number;
  };
  chapters?: Array<{
    blobs: Array<{
      size?: number;
      driftSpeed?: number;
      wobble?: number;
    }>;
  }>;
};

function seeded(index: number, salt: number): number {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function createDefaultHeroBlobConfig(): HeroBlobConfig {
  return {
    enabled: true,
    countPerChapter: 2,
    size: 0.38,
    driftSpeed: 0.22,
    wobble: 1.1,
    randomness: 0.75,
    blur: 88,
    lightStrength: 0.22,
    darkStrength: 0.28,
    transitionDistance: 0.14,
  };
}

export function createDefaultHeroAtmosphereSnapshot(): HeroAtmosphereSnapshot {
  return {
    version: 2,
    noise: {
      enabled: true,
      cellFrequency: 0.36,
      cellOctaves: 3,
      density: 0.88,
      tone: {
        amplitude: 0.82,
        highlightSuppression: 2.55,
        shadowBias: -0.09,
      },
      blend: {
        baseTone: "#949494",
        opacity: 0.24,
        mode: "overlay",
      },
    },
    blobs: createDefaultHeroBlobConfig(),
  };
}

function migrateLegacySnapshot(
  legacy: LegacyHeroAtmosphereSnapshot,
): HeroAtmosphereSnapshot {
  const defaults = createDefaultHeroBlobConfig();
  const globals = legacy.blobGlobals;
  const sample = legacy.chapters?.[0]?.blobs?.[0];

  return {
    version: 2,
    noise: legacy.noise,
    blobs: {
      enabled: globals?.enabled ?? defaults.enabled,
      countPerChapter: defaults.countPerChapter,
      size: sample?.size ?? defaults.size,
      driftSpeed: sample?.driftSpeed ?? defaults.driftSpeed,
      wobble: sample?.wobble ?? defaults.wobble,
      randomness: defaults.randomness,
      blur: globals?.blur ?? defaults.blur,
      lightStrength: globals?.lightStrength ?? defaults.lightStrength,
      darkStrength: globals?.darkStrength ?? defaults.darkStrength,
      transitionDistance: globals?.transitionDistance ?? defaults.transitionDistance,
    },
  };
}

export function isHeroAtmosphereSnapshot(
  value: unknown,
): value is HeroAtmosphereSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<HeroAtmosphereSnapshot>;
  return (
    snapshot.version === 2 &&
    typeof snapshot.noise === "object" &&
    snapshot.noise !== null &&
    typeof snapshot.blobs === "object" &&
    snapshot.blobs !== null
  );
}

export function normalizeHeroAtmosphereSnapshot(
  value: unknown,
): HeroAtmosphereSnapshot {
  if (isHeroAtmosphereSnapshot(value)) {
    return {
      version: 2,
      noise: { ...value.noise, tone: { ...value.noise.tone }, blend: { ...value.noise.blend } },
      blobs: { ...value.blobs },
    };
  }

  const legacy = value as LegacyHeroAtmosphereSnapshot;
  if (legacy?.version === 1 && legacy.noise) {
    return migrateLegacySnapshot(legacy);
  }

  return createDefaultHeroAtmosphereSnapshot();
}

export function buildSeededChapterBlobs(
  chapterIndex: number,
  config: HeroBlobConfig,
): HeroSeededBlob[] {
  const count = Math.max(1, Math.min(3, Math.round(config.countPerChapter)));

  return Array.from({ length: count }, (_, blobIndex) => {
    const base = chapterIndex * 10 + blobIndex;
    const sizeJitter = 0.82 + seeded(base, 4) * 0.36;

    return {
      tone: seeded(base, 1) > 0.5 ? "light" : "dark",
      x: 0.06 + seeded(base, 2) * 0.44,
      y: 0.12 + seeded(base, 3) * 0.58,
      size: config.size * sizeJitter,
      driftAngle: seeded(base, 6) * Math.PI * 2,
      phase: base * 1.7,
      wobblePhase: base * 2.3,
    };
  });
}

export function buildAllChapterBlobs(
  chapterCount: number,
  config: HeroBlobConfig,
): HeroSeededBlob[][] {
  return Array.from({ length: chapterCount }, (_, chapterIndex) =>
    buildSeededChapterBlobs(chapterIndex, config),
  );
}

export function defaultHeroChapterCount(): number {
  return HOME_HERO_CHAPTER_COUNT;
}

export function chapterAtmosphereWeight(
  chapterIndex: number,
  blend: SparkBlend,
): number {
  if (blend.from === blend.to) {
    return chapterIndex === blend.from ? 1 : 0;
  }
  if (chapterIndex === blend.from) return 1 - blend.t;
  if (chapterIndex === blend.to) return blend.t;
  return 0;
}

export function chapterTransitionOffsetY(
  chapterIndex: number,
  blend: SparkBlend,
  bandHeight: number,
  distanceRatio: number,
): number {
  if (blend.from === blend.to) return 0;
  const distance = bandHeight * distanceRatio;
  if (chapterIndex === blend.from) return -blend.t * distance;
  if (chapterIndex === blend.to) return (1 - blend.t) * distance;
  return 0;
}
