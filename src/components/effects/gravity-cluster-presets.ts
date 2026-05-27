import {
  blendShapeProfiles,
  buildShapeProfile,
  CHAPTER_SHAPES,
  type ParticleShape,
  PARTICLE_SHAPES,
  type ShapeProfile,
} from "@/components/sections/primary-hero/particle-shape";

export type { ParticleShape };
export { CHAPTER_SHAPES, PARTICLE_SHAPES };

export type GravityClusterPreset = {
  label: string;
  /** Outline shape grains cling to this chapter. */
  shape: ParticleShape;
  /** Shape radius as fraction of min(w,h) / 2 (~0.24 ≈ 48% viewport). */
  boundaryScale: number;
  particleCount: number;
  particleRadiusMin: number;
  particleRadiusMax: number;
  /** Pull toward shape outline. */
  attraction: number;
  /** Thickness of the outline band grains settle in (px). */
  outlineThickness: number;
  /** Velocity damping per frame. */
  drag: number;
  jitter: number;
  repulsion: number;
  alpha: number;
  /** Hotspot travel speed along outline (laps per second). */
  cycleSpeed: number;
  /** Flow along outline tangent at hotspot. */
  swirl: number;
};

/** Shared physics — circle (ch 1) is the base map for every chapter. */
export type GravityClusterBase = Omit<GravityClusterPreset, "label" | "shape">;

export const DEFAULT_GRAVITY_BASE: GravityClusterBase = {
  boundaryScale: 0.22,
  particleCount: 800,
  particleRadiusMin: 0.8,
  particleRadiusMax: 2.2,
  attraction: 0.022,
  outlineThickness: 38,
  drag: 0.978,
  jitter: 0.055,
  repulsion: 1.1,
  alpha: 0.55,
  cycleSpeed: 0.08,
  swirl: 0.04,
};

/** Keys copied from the base map — only shape differs per chapter. */
export const GRAVITY_SHARED_KEYS = [
  "boundaryScale",
  "particleCount",
  "particleRadiusMin",
  "particleRadiusMax",
  "attraction",
  "outlineThickness",
  "drag",
  "jitter",
  "repulsion",
  "alpha",
  "cycleSpeed",
  "swirl",
] as const satisfies readonly (keyof GravityClusterBase)[];

export const DEFAULT_CHAPTER_COUNT = 6;

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function resolveShapeProfile(
  shapeA: ParticleShape,
  shapeB: ParticleShape,
  morphT: number,
  width: number,
  height: number,
  boundaryScale: number,
): ShapeProfile {
  const minDim = Math.min(width, height);
  const R = minDim * boundaryScale;
  const profileA = buildShapeProfile(shapeA, R, 0);
  const profileB = buildShapeProfile(shapeB, R, 0);
  if (shapeA === shapeB || morphT <= 0) return profileA;
  if (morphT >= 1) return profileB;
  return blendShapeProfiles(profileA, profileB, morphT);
}

export function resolveClusterParams(
  preset: GravityClusterPreset,
  nextPreset: GravityClusterPreset,
  t: number,
): GravityClusterPreset {
  const shape = t < 0.5 ? preset.shape : nextPreset.shape;
  return {
    label: preset.label,
    shape,
    boundaryScale: lerp(preset.boundaryScale, nextPreset.boundaryScale, t),
    particleCount: Math.round(
      lerp(preset.particleCount, nextPreset.particleCount, t),
    ),
    particleRadiusMin: lerp(
      preset.particleRadiusMin,
      nextPreset.particleRadiusMin,
      t,
    ),
    particleRadiusMax: lerp(
      preset.particleRadiusMax,
      nextPreset.particleRadiusMax,
      t,
    ),
    attraction: lerp(preset.attraction, nextPreset.attraction, t),
    outlineThickness: lerp(
      preset.outlineThickness,
      nextPreset.outlineThickness,
      t,
    ),
    drag: lerp(preset.drag, nextPreset.drag, t),
    jitter: lerp(preset.jitter, nextPreset.jitter, t),
    repulsion: lerp(preset.repulsion, nextPreset.repulsion, t),
    alpha: lerp(preset.alpha, nextPreset.alpha, t),
    cycleSpeed: lerp(preset.cycleSpeed, nextPreset.cycleSpeed, t),
    swirl: lerp(preset.swirl, nextPreset.swirl, t),
  };
}

export function presetForChapter(
  index: number,
  base: GravityClusterBase = DEFAULT_GRAVITY_BASE,
): GravityClusterPreset {
  const shape = CHAPTER_SHAPES[index % CHAPTER_SHAPES.length]!;
  return {
    label: `Ch ${index + 1} · ${shape}`,
    shape,
    ...base,
  };
}

export function buildChapterPresets(
  chapterCount = DEFAULT_CHAPTER_COUNT,
  base: GravityClusterBase = DEFAULT_GRAVITY_BASE,
): GravityClusterPreset[] {
  return Array.from({ length: chapterCount }, (_, i) => presetForChapter(i, base));
}

export function applyBaseToPresets(
  presets: GravityClusterPreset[],
  base: GravityClusterBase,
): GravityClusterPreset[] {
  return presets.map((preset, i) => ({
    ...preset,
    ...base,
    label: preset.label,
    shape: preset.shape,
  }));
}

export const DEFAULT_GRAVITY_PRESETS = buildChapterPresets();

export const GRAVITY_PARAM_GROUPS: {
  label: string;
  keys: (keyof GravityClusterPreset)[];
}[] = [
  {
    label: "Density",
    keys: ["particleCount", "particleRadiusMin", "particleRadiusMax", "alpha"],
  },
  {
    label: "Outline",
    keys: ["boundaryScale", "outlineThickness", "attraction"],
  },
  {
    label: "Cycle & flow",
    keys: ["cycleSpeed", "swirl"],
  },
  {
    label: "Forces",
    keys: ["repulsion", "jitter", "drag"],
  },
];

export const GRAVITY_PARAM_META: Record<
  keyof GravityClusterPreset,
  { min: number; max: number; step: number; hint?: string }
> = {
  label: { min: 0, max: 0, step: 0 },
  shape: { min: 0, max: 0, step: 0 },
  boundaryScale: { min: 0.12, max: 0.38, step: 0.01, hint: "Shape size" },
  particleCount: { min: 200, max: 4000, step: 50 },
  particleRadiusMin: { min: 0.3, max: 4, step: 0.1 },
  particleRadiusMax: { min: 0.5, max: 6, step: 0.1 },
  attraction: { min: 0.005, max: 0.08, step: 0.001 },
  outlineThickness: { min: 8, max: 80, step: 1, hint: "Band width (px)" },
  drag: { min: 0.85, max: 0.99, step: 0.01 },
  jitter: { min: 0, max: 0.2, step: 0.005 },
  repulsion: { min: 0.2, max: 2, step: 0.05 },
  alpha: { min: 0.2, max: 1, step: 0.02 },
  cycleSpeed: { min: 0.02, max: 0.35, step: 0.01, hint: "Hotspot lap speed" },
  swirl: { min: 0, max: 0.12, step: 0.005, hint: "Tangent flow" },
};
