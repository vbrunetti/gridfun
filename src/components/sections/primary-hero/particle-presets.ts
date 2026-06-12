import {
  blendShapeProfiles,
  buildShapeProfile,
  type ParticleShape,
  PARTICLE_SHAPES,
  type ShapeProfile,
} from "./particle-shape";

export type { ParticleShape };
export { HERO_CHAPTER_SHAPES, PARTICLE_SHAPES, TREFOIL_FAMILY_SHAPES } from "./particle-shape";

export type ParticlePreset = {
  label: string;
  shape: ParticleShape;
  /** Fraction of min(w,h)/2 — 0.25 ≈ shape spans ~50% of viewport. */
  boundaryScale: number;
  /** Shape rotation in degrees. */
  rotationDeg: number;
  count: number;
  particleRadiusMin: number;
  particleRadiusMax: number;
  /** Particle lifetime range in seconds. */
  lifespanMin: number;
  lifespanMax: number;
  turbulence: number;
  speed: number;
  drag: number;
  swirl: number;
  /** Pull toward center — lower = more outward radiation. */
  gravity: number;
  /** Outward velocity bias on spawn (0–1). */
  outwardBias: number;
  /** Peak alpha while alive. */
  alpha: number;
  /** Glow radius multiplier (× particle radius). */
  glowScale: number;
  /** Neighbor link distance — 0 disables links. */
  linkDistance: number;
  linkOpacity: number;
  /** Spawn radius as fraction of shape (0 = center, 1 = full shape). */
  spawnSpread: number;
};

export type ResolvedParticleParams = Omit<
  ParticlePreset,
  "label" | "shape" | "rotationDeg"
> & {
  shapeProfile: ShapeProfile;
  /** Link stroke width in px — scales with viewport min-axis. */
  linkLineWidth: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Viewport min-axis (px) that preset size/density values are authored against. */
export const PRESET_REFERENCE_MIN_DIM = 800;

/** Link stroke width at PRESET_REFERENCE_MIN_DIM. */
export const PRESET_REFERENCE_LINK_LINE_WIDTH = 0.5;

/**
 * Small-viewport tuning — blends pure scaling toward a floor so phones stay
 * visible without the solid-blob look. Tuned for ~150 nodes at 390px width.
 */
const CANVAS_SCALE_FLOOR = 0.76;
const COUNT_FLOOR_BLEND = 0.7;
const LINK_FLOOR_BLEND = 0.42;
/** Smallest dot/link scale on phones — keeps marks visible without going sub-pixel. */
const MIN_SIZE_SCALE = 0.93;

function rawCanvasMinDimScale(width: number, height: number) {
  const minDim = Math.min(width, height);
  if (minDim <= 0) return 1;
  return minDim / PRESET_REFERENCE_MIN_DIM;
}

function blendTowardFloor(raw: number, floor: number, blend: number) {
  const floored = Math.max(raw, floor);
  return raw * (1 - blend) + floored * blend;
}

/** Blended area scale — midpoint between sparse (pure area) and dense (full floor). */
function countAreaScale(width: number, height: number) {
  const raw = rawCanvasMinDimScale(width, height);
  const pure = raw * raw;
  const floored = Math.max(raw, CANVAS_SCALE_FLOOR) ** 2;
  return blendTowardFloor(pure, floored, COUNT_FLOOR_BLEND);
}

/** Link reach — slight floor boost so the mesh reads on small screens. */
function spatialDimScale(width: number, height: number) {
  const raw = rawCanvasMinDimScale(width, height);
  return blendTowardFloor(raw, CANVAS_SCALE_FLOOR, LINK_FLOOR_BLEND);
}

/** Dot/link stroke scale — shrinks slightly on phones, grows on large screens. */
function sizeCanvasMinDimScale(width: number, height: number) {
  const raw = rawCanvasMinDimScale(width, height);
  return Math.max(MIN_SIZE_SCALE, raw);
}

/** Keeps particle density consistent as the shape grows with viewport size. */
export function scaleParticleCount(
  count: number,
  width: number,
  height: number,
): number {
  const scale = countAreaScale(width, height);
  return Math.max(40, Math.min(1200, Math.round(count * scale)));
}

export function blendPresets(
  a: ParticlePreset,
  b: ParticlePreset,
  t: number,
  width: number,
  height: number,
  shapeScale = 1,
): ResolvedParticleParams {
  const minDim = Math.min(width, height);
  const dimScale = spatialDimScale(width, height);
  const sizeScale = sizeCanvasMinDimScale(width, height);
  const baseR = minDim * 0.5 * shapeScale;

  const profileA = buildShapeProfile(
    a.shape,
    baseR * a.boundaryScale,
    (a.rotationDeg * Math.PI) / 180,
  );
  const profileB = buildShapeProfile(
    b.shape,
    baseR * b.boundaryScale,
    (b.rotationDeg * Math.PI) / 180,
  );
  const shapeProfile = blendShapeProfiles(profileA, profileB, t);

  const mt = 1 - t;
  return {
    boundaryScale: lerp(a.boundaryScale, b.boundaryScale, t),
    count: scaleParticleCount(Math.round(lerp(a.count, b.count, t)), width, height),
    particleRadiusMin: lerp(a.particleRadiusMin, b.particleRadiusMin, t) * sizeScale,
    particleRadiusMax: lerp(a.particleRadiusMax, b.particleRadiusMax, t) * sizeScale,
    lifespanMin: lerp(a.lifespanMin, b.lifespanMin, t),
    lifespanMax: lerp(a.lifespanMax, b.lifespanMax, t),
    turbulence: lerp(a.turbulence, b.turbulence, t),
    speed: lerp(a.speed, b.speed, t),
    drag: lerp(a.drag, b.drag, t),
    swirl: lerp(a.swirl, b.swirl, t),
    gravity: lerp(a.gravity, b.gravity, t),
    outwardBias: lerp(a.outwardBias, b.outwardBias, t),
    alpha: lerp(a.alpha, b.alpha, t),
    glowScale: lerp(a.glowScale, b.glowScale, t),
    linkDistance: lerp(a.linkDistance, b.linkDistance, t) * shapeScale * dimScale,
    linkOpacity: lerp(a.linkOpacity, b.linkOpacity, t) * mt + b.linkOpacity * t,
    linkLineWidth: PRESET_REFERENCE_LINK_LINE_WIDTH * sizeScale,
    spawnSpread: lerp(a.spawnSpread, b.spawnSpread, t),
    shapeProfile,
  };
}

export function resolvePreset(
  preset: ParticlePreset,
  width: number,
  height: number,
): ResolvedParticleParams {
  return blendPresets(preset, preset, 0, width, height);
}

/** Starting-point presets — tune in /effects/spark-particles. */
export const DEFAULT_CHAPTER_PRESETS: ParticlePreset[] = [
  {
    label: "Ch 1 · Square",
    shape: "square",
    boundaryScale: 0.24,
    rotationDeg: 0,
    count: 420,
    particleRadiusMin: 0.35,
    particleRadiusMax: 1.1,
    lifespanMin: 0.18,
    lifespanMax: 0.55,
    turbulence: 0.22,
    speed: 2.8,
    drag: 0.88,
    swirl: 0.006,
    gravity: 0.0004,
    outwardBias: 0.75,
    alpha: 0.55,
    glowScale: 1.4,
    linkDistance: 0,
    linkOpacity: 0,
    spawnSpread: 0.35,
  },
  {
    label: "Ch 2 · Circle",
    shape: "circle",
    boundaryScale: 0.25,
    rotationDeg: 0,
    count: 520,
    particleRadiusMin: 0.3,
    particleRadiusMax: 1,
    lifespanMin: 0.15,
    lifespanMax: 0.48,
    turbulence: 0.28,
    speed: 3.2,
    drag: 0.86,
    swirl: 0.012,
    gravity: 0.0003,
    outwardBias: 0.82,
    alpha: 0.62,
    glowScale: 1.3,
    linkDistance: 0,
    linkOpacity: 0,
    spawnSpread: 0.4,
  },
  {
    label: "Ch 3 · Triangle",
    shape: "triangle",
    boundaryScale: 0.25,
    rotationDeg: 0,
    count: 580,
    particleRadiusMin: 0.28,
    particleRadiusMax: 0.95,
    lifespanMin: 0.12,
    lifespanMax: 0.42,
    turbulence: 0.32,
    speed: 3.6,
    drag: 0.85,
    swirl: 0.008,
    gravity: 0.00025,
    outwardBias: 0.88,
    alpha: 0.68,
    glowScale: 1.25,
    linkDistance: 0,
    linkOpacity: 0,
    spawnSpread: 0.45,
  },
  {
    label: "Ch 4 · Diamond",
    shape: "diamond",
    boundaryScale: 0.26,
    rotationDeg: 0,
    count: 640,
    particleRadiusMin: 0.25,
    particleRadiusMax: 0.9,
    lifespanMin: 0.1,
    lifespanMax: 0.38,
    turbulence: 0.36,
    speed: 4,
    drag: 0.84,
    swirl: 0.005,
    gravity: 0.0002,
    outwardBias: 0.9,
    alpha: 0.72,
    glowScale: 1.2,
    linkDistance: 0,
    linkOpacity: 0,
    spawnSpread: 0.5,
  },
  {
    label: "Ch 5 · Pentagram",
    shape: "pentagram",
    boundaryScale: 0.26,
    rotationDeg: 0,
    count: 720,
    particleRadiusMin: 0.22,
    particleRadiusMax: 0.85,
    lifespanMin: 0.08,
    lifespanMax: 0.32,
    turbulence: 0.42,
    speed: 4.4,
    drag: 0.82,
    swirl: 0.004,
    gravity: 0.00015,
    outwardBias: 0.94,
    alpha: 0.78,
    glowScale: 1.15,
    linkDistance: 0,
    linkOpacity: 0,
    spawnSpread: 0.55,
  },
  {
    label: "Ch 6 · Octagon",
    shape: "octagon",
    boundaryScale: 0.27,
    rotationDeg: 0,
    count: 780,
    particleRadiusMin: 0.2,
    particleRadiusMax: 0.8,
    lifespanMin: 0.07,
    lifespanMax: 0.28,
    turbulence: 0.48,
    speed: 4.8,
    drag: 0.8,
    swirl: 0.003,
    gravity: 0.0001,
    outwardBias: 0.96,
    alpha: 0.82,
    glowScale: 1.1,
    linkDistance: 0,
    linkOpacity: 0,
    spawnSpread: 0.6,
  },
];

export function presetsForChapterCount(count: number): ParticlePreset[] {
  if (count <= 0) return [];
  if (count === DEFAULT_CHAPTER_PRESETS.length) {
    return DEFAULT_CHAPTER_PRESETS;
  }
  return Array.from({ length: count }, (_, i) => {
    const base = DEFAULT_CHAPTER_PRESETS[i % DEFAULT_CHAPTER_PRESETS.length]!;
    const intensity = count <= 1 ? 0 : i / (count - 1);
    return {
      ...base,
      label: `Ch ${i + 1} · ${PARTICLE_SHAPES[i % PARTICLE_SHAPES.length]}`,
      shape: PARTICLE_SHAPES[i % PARTICLE_SHAPES.length]!,
      count: Math.round(420 + intensity * 360),
      turbulence: 0.22 + intensity * 0.26,
      speed: 2.8 + intensity * 2,
      alpha: 0.55 + intensity * 0.27,
    };
  });
}

export const PRESET_PARAM_GROUPS: {
  label: string;
  keys: (keyof ParticlePreset)[];
}[] = [
  { label: "Shape", keys: ["boundaryScale", "rotationDeg"] },
  {
    label: "Density & size",
    keys: ["count", "particleRadiusMin", "particleRadiusMax", "spawnSpread"],
  },
  {
    label: "Life & fade",
    keys: ["lifespanMin", "lifespanMax", "alpha", "glowScale"],
  },
  {
    label: "Motion",
    keys: ["turbulence", "speed", "drag", "swirl", "gravity", "outwardBias"],
  },
  { label: "Links", keys: ["linkDistance", "linkOpacity"] },
];

export const PRESET_PARAM_META: Record<
  keyof ParticlePreset,
  { min: number; max: number; step: number; hint?: string }
> = {
  label: { min: 0, max: 0, step: 0 },
  shape: { min: 0, max: 0, step: 0 },
  boundaryScale: { min: 0.12, max: 0.4, step: 0.01, hint: "~0.25 = 50% viewport" },
  rotationDeg: { min: -180, max: 180, step: 1 },
  count: {
    min: 80,
    max: 1200,
    step: 10,
    hint: `density at ${PRESET_REFERENCE_MIN_DIM}px min viewport`,
  },
  particleRadiusMin: {
    min: 0.1,
    max: 4,
    step: 0.05,
    hint: `radius at ${PRESET_REFERENCE_MIN_DIM}px min viewport`,
  },
  particleRadiusMax: {
    min: 0.1,
    max: 6,
    step: 0.05,
    hint: `radius at ${PRESET_REFERENCE_MIN_DIM}px min viewport`,
  },
  lifespanMin: { min: 0.03, max: 2, step: 0.01 },
  lifespanMax: { min: 0.05, max: 3, step: 0.01 },
  turbulence: { min: 0, max: 1, step: 0.01 },
  speed: { min: 0.2, max: 8, step: 0.1 },
  drag: { min: 0.7, max: 0.99, step: 0.01 },
  swirl: { min: 0, max: 0.08, step: 0.001 },
  gravity: { min: 0, max: 0.01, step: 0.0001 },
  outwardBias: { min: 0, max: 1, step: 0.01 },
  alpha: { min: 0.05, max: 1, step: 0.01 },
  glowScale: { min: 0.5, max: 4, step: 0.05 },
  linkDistance: { min: 0, max: 120, step: 1 },
  linkOpacity: { min: 0, max: 0.4, step: 0.01 },
  spawnSpread: { min: 0, max: 1, step: 0.01 },
};
