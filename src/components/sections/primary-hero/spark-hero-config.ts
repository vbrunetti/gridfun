import rawSnapshot from "@/content/spark-hero-snapshot.json";
import {
  createDefaultSparkHeroSnapshot,
  isSparkHeroSnapshot,
  type SparkHeroSnapshot,
} from "@/lib/spark-hero-snapshot";
import type { ParticlePreset } from "./particle-presets";
import { HERO_CHAPTER_SHAPES } from "./particle-shape";

function loadSnapshot(): SparkHeroSnapshot {
  if (isSparkHeroSnapshot(rawSnapshot)) {
    return rawSnapshot;
  }
  return createDefaultSparkHeroSnapshot();
}

function shapeChapterLabel(shape: string) {
  return shape.charAt(0).toUpperCase() + shape.slice(1);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Chapter 1 base from snapshot; shapes vary; intensity ramps toward chapter 6. */
export function presetsForHeroChapters(source: ParticlePreset[]): ParticlePreset[] {
  const base = source[0];
  if (!base) return source;

  const chapterCount = HERO_CHAPTER_SHAPES.length;

  return HERO_CHAPTER_SHAPES.map((shape, i) => {
    const t = chapterCount <= 1 ? 0 : i / (chapterCount - 1);

    return {
      ...base,
      label: `Ch ${i + 1} · ${shapeChapterLabel(shape)}`,
      shape,
      count: Math.round(lerp(base.count, base.count + 360, t)),
      particleRadiusMin: lerp(base.particleRadiusMin, base.particleRadiusMin * 0.75, t),
      particleRadiusMax: lerp(base.particleRadiusMax, base.particleRadiusMax * 0.82, t),
      lifespanMin: lerp(base.lifespanMin, base.lifespanMin * 0.45, t),
      lifespanMax: lerp(base.lifespanMax, base.lifespanMax * 0.5, t),
      turbulence: lerp(base.turbulence, Math.min(1, base.turbulence + 0.35), t),
      speed: lerp(base.speed, base.speed + 2, t),
      drag: lerp(base.drag, Math.max(0.75, base.drag - 0.05), t),
      swirl: lerp(base.swirl, base.swirl + 0.01, t),
      gravity: lerp(base.gravity, Math.max(0.00008, base.gravity * 0.35), t),
      outwardBias: lerp(base.outwardBias, Math.min(0.98, base.outwardBias + 0.2), t),
      alpha: lerp(base.alpha, Math.min(0.85, base.alpha + 0.45), t),
      glowScale: lerp(base.glowScale, base.glowScale * 0.9, t),
      linkDistance: lerp(base.linkDistance, base.linkDistance + 28, t),
      linkOpacity: lerp(base.linkOpacity, Math.min(0.22, base.linkOpacity + 0.12), t),
      spawnSpread: lerp(base.spawnSpread, Math.min(1, base.spawnSpread), t),
    };
  });
}

export const HERO_SPARK_SNAPSHOT = loadSnapshot();
export const HERO_SPARK_COLOR = HERO_SPARK_SNAPSHOT.color;
export const HERO_SPARK_PRESETS = presetsForHeroChapters(
  HERO_SPARK_SNAPSHOT.presets,
);
export { HERO_CHAPTER_SHAPES };

/** Scales particle formation on the home hero — wide viewports need >1. */
export const HERO_SPARK_SHAPE_SCALE = 2.2;
