import rawSnapshot from "@/content/spark-hero-snapshot.json";
import { heroSlates } from "@/content/site";
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

/** Homepage hero scroll chapters — kept in sync with `site.home.heroSlates`. */
export const HOME_HERO_CHAPTER_COUNT = heroSlates.length;

/** Ensure one preset per hero chapter, preserving saved values when present. */
export function normalizeHeroChapterPresets(
  source: ParticlePreset[],
  chapterCount = HOME_HERO_CHAPTER_COUNT,
): ParticlePreset[] {
  if (chapterCount <= 0) return [];

  const base = source[0];
  if (!base) return [];

  return Array.from({ length: chapterCount }, (_, i) => {
    const shape = HERO_CHAPTER_SHAPES[i] ?? base.shape;
    const existing = source[i];

    if (existing) {
      return {
        ...existing,
        label: existing.label || `Ch ${i + 1} · ${shapeChapterLabel(shape)}`,
      };
    }

    return {
      ...base,
      label: `Ch ${i + 1} · ${shapeChapterLabel(shape)}`,
      shape,
      count: Math.round(base.count * (i === 0 ? 1 : 1.3)),
    };
  });
}

/** @deprecated Use normalizeHeroChapterPresets — kept for draft recovery call sites. */
export function presetsForHeroChapters(source: ParticlePreset[]): ParticlePreset[] {
  return normalizeHeroChapterPresets(source);
}

export const HERO_SPARK_SNAPSHOT = loadSnapshot();
export const HERO_SPARK_COLOR = HERO_SPARK_SNAPSHOT.color;
export const HERO_SPARK_PRESETS = normalizeHeroChapterPresets(
  HERO_SPARK_SNAPSHOT.presets,
);
export { HERO_CHAPTER_SHAPES };

/** Fills the hero spark frame — tuned for zone-capped square (cols 7–12). */
export const HERO_SPARK_SHAPE_SCALE = 2.85;
