export type ParticleShape =
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "spiral"
  | "pentagram"
  | "octagon"
  | "ring"
  | "cross";

/** Default hero chapter sequence — maximally distinct silhouettes. */
export const CHAPTER_SHAPES: ParticleShape[] = [
  "circle",
  "triangle",
  "diamond",
  "pentagram",
  "ring",
  "cross",
];

/** All shapes available in the tuner. */
export const PARTICLE_SHAPES: ParticleShape[] = [
  ...CHAPTER_SHAPES,
  "square",
  "spiral",
  "octagon",
];

const SHAPE_SAMPLES = 128;

function modPi(angle: number, period: number) {
  const a = ((angle % period) + period) % period;
  return a - period / 2;
}

/** Radius at angle θ for a regular n-gon inscribed in radius R. */
function regularPolygonRadius(
  theta: number,
  R: number,
  sides: number,
  rotation: number,
) {
  const sector = (Math.PI * 2) / sides;
  const local = modPi(theta - rotation, sector);
  const cos = Math.cos(local);
  return cos > 0.001 ? R / cos : R * 8;
}

/** Five-point star boundary (outer radius R). */
function pentagramRadius(theta: number, R: number, rotation: number) {
  const points = 5;
  const step = Math.PI / points;
  const inner = R * 0.42;
  const t = theta - rotation;
  const sector = modPi(t, step * 2);
  const half = step;
  const outer = R / Math.cos(sector);
  const innerAt =
    inner / Math.cos(sector + (sector > 0 ? -half : half));
  const phase = ((t / step) % 2) * 0.5;
  return phase < 0.5 ? outer : innerAt;
}

/** Plus / cross — distance to axis-aligned cross silhouette. */
function crossRadiusAtAngle(theta: number, R: number, rotation: number) {
  const t = theta - rotation;
  const c = Math.abs(Math.cos(t));
  const s = Math.abs(Math.sin(t));
  const arm = 0.34;
  if (c >= s) {
    return R / (c + arm * s);
  }
  return R / (s + arm * c);
}

function fillCrossPoints(
  localPoints: Float32Array,
  radii: Float32Array,
  R: number,
) {
  const arm = R * 0.34;
  const len = R * 0.92;
  const corners: [number, number][] = [
    [arm, -len],
    [arm, -arm],
    [len, -arm],
    [len, arm],
    [arm, arm],
    [arm, len],
    [-arm, len],
    [-arm, arm],
    [-len, arm],
    [-len, -arm],
    [-arm, -arm],
    [-arm, -len],
  ];
  const n = radii.length;
  const perim = corners.length;
  for (let i = 0; i < n; i++) {
    const u = i / n;
    const f = u * perim;
    const idx = Math.floor(f) % perim;
    const next = (idx + 1) % perim;
    const frac = f - Math.floor(f);
    const [x0, y0] = corners[idx]!;
    const [x1, y1] = corners[next]!;
    const x = x0 + (x1 - x0) * frac;
    const y = y0 + (y1 - y0) * frac;
    localPoints[i * 2] = x;
    localPoints[i * 2 + 1] = y;
    radii[i] = Math.hypot(x, y);
  }
}

export function shapeRadiusAtAngle(
  shape: ParticleShape,
  theta: number,
  R: number,
  rotation = 0,
): number {
  switch (shape) {
    case "circle":
      return R;
    case "square":
      return regularPolygonRadius(theta, R, 4, rotation);
    case "triangle":
      return regularPolygonRadius(theta, R, 3, rotation - Math.PI / 2);
    case "diamond":
      return regularPolygonRadius(theta, R, 4, rotation + Math.PI / 4);
    case "spiral":
      return R * 0.98;
    case "ring":
      return R;
    case "cross":
      return crossRadiusAtAngle(theta, R, rotation);
    case "pentagram":
      return pentagramRadius(theta, R, rotation - Math.PI / 2);
    case "octagon":
      return regularPolygonRadius(theta, R, 8, rotation);
    default:
      return R;
  }
}

export type ShapeProfile = {
  radii: Float32Array;
  rotation: number;
  /** Outline samples in local coords (origin = shape center). */
  localPoints: Float32Array;
  sampleCount: number;
  closed: boolean;
  /** Ring inner radius as fraction of outer (ring shape only). */
  ringInnerRatio?: number;
};

function fillPolarPoints(
  localPoints: Float32Array,
  radii: Float32Array,
  R: number,
  rotation: number,
  radiusFn: (theta: number) => number,
) {
  const n = radii.length;
  for (let i = 0; i < n; i++) {
    const theta = (i / n) * Math.PI * 2 + rotation;
    const r = radiusFn(theta);
    radii[i] = r;
    localPoints[i * 2] = Math.cos(theta) * r;
    localPoints[i * 2 + 1] = Math.sin(theta) * r;
  }
}

function fillSpiralPoints(
  localPoints: Float32Array,
  radii: Float32Array,
  R: number,
  rotation: number,
) {
  const n = radii.length;
  const turns = 2.65;
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    const theta = u * turns * Math.PI * 2 + rotation;
    const r = R * (0.12 + 0.88 * Math.pow(u, 0.82));
    localPoints[i * 2] = Math.cos(theta) * r;
    localPoints[i * 2 + 1] = Math.sin(theta) * r;
  }
  for (let i = 0; i < n; i++) {
    const theta = (i / n) * Math.PI * 2;
    radii[i] = shapeRadiusAtAngle("spiral", theta, R, rotation);
  }
}

export function buildShapeProfile(
  shape: ParticleShape,
  R: number,
  rotation = 0,
): ShapeProfile {
  const radii = new Float32Array(SHAPE_SAMPLES);
  const localPoints = new Float32Array(SHAPE_SAMPLES * 2);
  const closed = shape !== "spiral";

  if (shape === "spiral") {
    fillSpiralPoints(localPoints, radii, R, rotation);
  } else if (shape === "cross") {
    fillCrossPoints(localPoints, radii, R);
  } else {
    fillPolarPoints(localPoints, radii, R, rotation, (theta) =>
      shapeRadiusAtAngle(shape, theta, R, rotation),
    );
  }

  const profile: ShapeProfile = {
    radii,
    rotation,
    localPoints,
    sampleCount: SHAPE_SAMPLES,
    closed,
  };

  if (shape === "ring") {
    profile.ringInnerRatio = 0.58;
  }

  return profile;
}

export function blendShapeProfiles(
  a: ShapeProfile,
  b: ShapeProfile,
  t: number,
): ShapeProfile {
  const radii = new Float32Array(SHAPE_SAMPLES);
  const localPoints = new Float32Array(SHAPE_SAMPLES * 2);
  const mt = 1 - t;
  for (let i = 0; i < SHAPE_SAMPLES; i++) {
    radii[i] = a.radii[i]! * mt + b.radii[i]! * t;
    localPoints[i * 2] = a.localPoints[i * 2]! * mt + b.localPoints[i * 2]! * t;
    localPoints[i * 2 + 1] =
      a.localPoints[i * 2 + 1]! * mt + b.localPoints[i * 2 + 1]! * t;
  }
  return {
    radii,
    rotation: a.rotation * mt + b.rotation * t,
    localPoints,
    sampleCount: SHAPE_SAMPLES,
    closed: t < 0.5 ? a.closed : b.closed,
    ringInnerRatio:
      a.ringInnerRatio !== undefined && b.ringInnerRatio !== undefined
        ? a.ringInnerRatio * mt + b.ringInnerRatio * t
        : t < 0.5
          ? a.ringInnerRatio
          : b.ringInnerRatio,
  };
}

export function radiusAtAngle(profile: ShapeProfile, theta: number): number {
  const n = profile.radii.length;
  const u = (((theta - profile.rotation) / (Math.PI * 2)) % 1 + 1) % 1;
  const f = u * n;
  const i = Math.floor(f) % n;
  const j = (i + 1) % n;
  const frac = f - Math.floor(f);
  const ri = profile.radii[i]!;
  const rj = profile.radii[j]!;
  return ri + (rj - ri) * frac;
}

export function isInsideShape(
  x: number,
  y: number,
  cx: number,
  cy: number,
  profile: ShapeProfile,
): boolean {
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.001) return true;
  const theta = Math.atan2(dy, dx);
  return dist <= radiusAtAngle(profile, theta) * 0.98;
}

export function constrainToShape(
  x: number,
  y: number,
  cx: number,
  cy: number,
  profile: ShapeProfile,
): { x: number; y: number; nx: number; ny: number } {
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.hypot(dx, dy) || 0.001;
  const theta = Math.atan2(dy, dx);
  const limit = radiusAtAngle(profile, theta) * 0.96;
  if (dist <= limit) {
    return { x, y, nx: dx / dist, ny: dy / dist };
  }
  const scale = limit / dist;
  return {
    x: cx + dx * scale,
    y: cy + dy * scale,
    nx: dx / dist,
    ny: dy / dist,
  };
}

/** Point on shape perimeter at normalized arc length u ∈ [0, 1). */
export function pointOnProfile(
  profile: ShapeProfile,
  u: number,
  cx: number,
  cy: number,
): { x: number; y: number; theta: number } {
  if (profile.ringInnerRatio !== undefined) {
    const outerR = maxProfileRadius(profile);
    const innerR = outerR * profile.ringInnerRatio;
    return pointOnRingProfile(outerR, innerR, u, cx, cy);
  }

  const n = profile.sampleCount;
  const span = profile.closed ? n : n - 1;
  const f = ((u % 1) + 1) % 1 * span;
  const i = Math.min(Math.floor(f), span - 1);
  const j = profile.closed ? (i + 1) % n : Math.min(i + 1, n - 1);
  const frac = f - Math.floor(f);
  const x0 = profile.localPoints[i * 2]!;
  const y0 = profile.localPoints[i * 2 + 1]!;
  const x1 = profile.localPoints[j * 2]!;
  const y1 = profile.localPoints[j * 2 + 1]!;
  const lx = x0 + (x1 - x0) * frac;
  const ly = y0 + (y1 - y0) * frac;
  return {
    x: cx + lx,
    y: cy + ly,
    theta: Math.atan2(ly, lx),
  };
}

export function perimeterDistance(
  uA: number,
  uB: number,
  closed = true,
) {
  if (!closed) return Math.abs(uA - uB);
  let d = Math.abs(uA - uB);
  if (d > 0.5) d = 1 - d;
  return d;
}

function distToSegment(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  const abx = bx - ax;
  const aby = by - ay;
  const lenSq = abx * abx + aby * aby || 0.001;
  let t = ((px - ax) * abx + (py - ay) * aby) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + abx * t;
  const cy = ay + aby * t;
  return {
    x: cx,
    y: cy,
    dist: Math.hypot(px - cx, py - cy),
    u: t,
    segIndex: 0,
  };
}

function ringUFromOuter(theta: number) {
  return ((((theta / (Math.PI * 2)) % 1) + 1) % 1) * 0.5;
}

function ringUFromInner(theta: number) {
  return 0.5 + ((((theta - Math.PI) / (Math.PI * 2)) % 1 + 1) % 1) * 0.5;
}

function ringThetaFromU(u: number, outer: boolean) {
  const uNorm = ((u % 1) + 1) % 1;
  if (outer) {
    return (uNorm / 0.5) * Math.PI * 2;
  }
  return Math.PI + ((uNorm - 0.5) / 0.5) * Math.PI * 2;
}

export function pointOnRingProfile(
  outerR: number,
  innerR: number,
  u: number,
  cx: number,
  cy: number,
): { x: number; y: number; theta: number } {
  const uNorm = ((u % 1) + 1) % 1;
  const onOuter = uNorm < 0.5;
  const theta = ringThetaFromU(uNorm, onOuter);
  const r = onOuter ? outerR : innerR;
  return {
    x: cx + Math.cos(theta) * r,
    y: cy + Math.sin(theta) * r,
    theta,
  };
}

function nearestOnRing(
  px: number,
  py: number,
  outerR: number,
  innerR: number,
) {
  const dist = Math.hypot(px, py) || 0.001;
  const theta = Math.atan2(py, px);

  const outerX = Math.cos(theta) * outerR;
  const outerY = Math.sin(theta) * outerR;
  const innerX = Math.cos(theta) * innerR;
  const innerY = Math.sin(theta) * innerR;

  const dOuter = Math.hypot(px - outerX, py - outerY);
  const dInner = Math.hypot(px - innerX, py - innerY);
  const useOuter = dOuter <= dInner;

  const x = useOuter ? outerX : innerX;
  const y = useOuter ? outerY : innerY;
  const dx = x - px;
  const dy = y - py;
  const d = Math.hypot(dx, dy) || 0.001;

  return {
    x,
    y,
    nx: dx / d,
    ny: dy / d,
    dist: d,
    u: useOuter ? ringUFromOuter(theta) : ringUFromInner(theta),
  };
}

/** Closest point on the shape outline (samples perimeter). */
export function nearestPointOnProfile(
  profile: ShapeProfile,
  x: number,
  y: number,
  cx: number,
  cy: number,
): {
  x: number;
  y: number;
  nx: number;
  ny: number;
  dist: number;
  u: number;
} {
  const px = x - cx;
  const py = y - cy;

  if (profile.ringInnerRatio !== undefined) {
    const outerR = maxProfileRadius(profile);
    const innerR = outerR * profile.ringInnerRatio;
    const hit = nearestOnRing(px, py, outerR, innerR);
    return {
      x: cx + hit.x,
      y: cy + hit.y,
      nx: hit.nx,
      ny: hit.ny,
      dist: hit.dist,
      u: hit.u,
    };
  }

  const n = profile.sampleCount;
  let bestDist = Infinity;
  let bestX = cx;
  let bestY = cy;
  let bestU = 0;

  const segCount = profile.closed ? n : n - 1;
  for (let i = 0; i < segCount; i++) {
    const j = profile.closed ? (i + 1) % n : i + 1;
    const ax = profile.localPoints[i * 2]!;
    const ay = profile.localPoints[i * 2 + 1]!;
    const bx = profile.localPoints[j * 2]!;
    const by = profile.localPoints[j * 2 + 1]!;
    const hit = distToSegment(px, py, ax, ay, bx, by);
    if (hit.dist < bestDist) {
      bestDist = hit.dist;
      bestX = cx + hit.x;
      bestY = cy + hit.y;
      const span = profile.closed ? n : n - 1;
      bestU = (i + hit.u) / span;
    }
  }

  const dx = bestX - x;
  const dy = bestY - y;
  const dist = Math.hypot(dx, dy) || 0.001;
  return {
    x: bestX,
    y: bestY,
    nx: dx / dist,
    ny: dy / dist,
    dist,
    u: bestU,
  };
}

/** Tangent direction at arc parameter u. */
export function tangentOnProfile(
  profile: ShapeProfile,
  u: number,
  cx: number,
  cy: number,
): { tx: number; ty: number } {
  if (profile.ringInnerRatio !== undefined) {
    const outerR = maxProfileRadius(profile);
    const innerR = outerR * profile.ringInnerRatio;
    const du = 0.002;
    const a = pointOnRingProfile(outerR, innerR, u - du, cx, cy);
    const b = pointOnRingProfile(outerR, innerR, u + du, cx, cy);
    const tx = b.x - a.x;
    const ty = b.y - a.y;
    const len = Math.hypot(tx, ty) || 0.001;
    return { tx: tx / len, ty: ty / len };
  }

  const span = profile.closed ? profile.sampleCount : profile.sampleCount - 1;
  const du = 1 / span / 32;
  const a = pointOnProfile(profile, u - du, cx, cy);
  const b = pointOnProfile(profile, u + du, cx, cy);
  const tx = b.x - a.x;
  const ty = b.y - a.y;
  const len = Math.hypot(tx, ty) || 0.001;
  return { tx: tx / len, ty: ty / len };
}

export function maxProfileRadius(profile: ShapeProfile): number {
  let max = 0;
  for (let i = 0; i < profile.sampleCount; i++) {
    const x = profile.localPoints[i * 2]!;
    const y = profile.localPoints[i * 2 + 1]!;
    max = Math.max(max, Math.hypot(x, y));
  }
  return max;
}
