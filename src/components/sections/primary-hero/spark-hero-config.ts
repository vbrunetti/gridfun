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

/** Chapter 1 base from snapshot; shared tuning, distinct shape per chapter. */
export function presetsForHeroChapters(source: ParticlePreset[]): ParticlePreset[] {
  const base = source[0];
  if (!base) return source;

  const chapterCount = Math.max(source.length, HERO_CHAPTER_SHAPES.length);

  return Array.from({ length: chapterCount }, (_, i) => {
    const shape = HERO_CHAPTER_SHAPES[i] ?? base.shape;
    return {
      ...base,
      label: `Ch ${i + 1} · ${shapeChapterLabel(shape)}`,
      shape,
      count: Math.round(base.count * 1.3),
    };
  });
}

export const HERO_SPARK_SNAPSHOT = loadSnapshot();
export const HERO_SPARK_COLOR = HERO_SPARK_SNAPSHOT.color;
export const HERO_SPARK_PRESETS = presetsForHeroChapters(
  HERO_SPARK_SNAPSHOT.presets,
);
export { HERO_CHAPTER_SHAPES };

/** Fills the hero spark frame — tuned for zone-capped square (cols 7–12). */
export const HERO_SPARK_SHAPE_SCALE = 2.85;
