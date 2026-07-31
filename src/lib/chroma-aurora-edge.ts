import { sparkPalette } from "@/lib/colors";

export type EdgeId = "top" | "right" | "bottom" | "left";

/** Harmonic layers — stacked sines give irregular multi-peak undulation. */
type WaveLayer = {
  /** Cycles along the edge (peaks ≈ this count). */
  freq: number;
  /** Relative amplitude 0–1. */
  amp: number;
  /** Radians/sec phase drift. */
  speed: number;
  /** Fixed phase offset. */
  phase: number;
};

type EdgeWaveConfig = {
  layers: WaveLayer[];
  /** Extra slow envelope so peaks breathe unevenly. */
  envelopeFreq: number;
  envelopeSpeed: number;
  envelopePhase: number;
};

/** Distinct profiles per edge so the four sides don't move in lockstep. */
export const EDGE_WAVE_CONFIGS: Record<EdgeId, EdgeWaveConfig> = {
  top: {
    layers: [
      { freq: 4.2, amp: 0.62, speed: 1.85, phase: 0.2 },
      { freq: 7.4, amp: 0.38, speed: 2.6, phase: 1.4 },
      { freq: 11.2, amp: 0.22, speed: -2.1, phase: 2.8 },
    ],
    envelopeFreq: 2.1,
    envelopeSpeed: 1.15,
    envelopePhase: 0.5,
  },
  right: {
    layers: [
      { freq: 3.6, amp: 0.58, speed: -1.65, phase: 1.1 },
      { freq: 8.0, amp: 0.4, speed: 2.35, phase: 0.3 },
      { freq: 12.5, amp: 0.24, speed: 2.9, phase: 2.1 },
    ],
    envelopeFreq: 2.4,
    envelopeSpeed: 1.35,
    envelopePhase: 1.7,
  },
  bottom: {
    layers: [
      { freq: 4.8, amp: 0.6, speed: 2.05, phase: 2.4 },
      { freq: 6.8, amp: 0.36, speed: -2.45, phase: 0.8 },
      { freq: 10.6, amp: 0.24, speed: 1.75, phase: 3.5 },
    ],
    envelopeFreq: 1.9,
    envelopeSpeed: -1.2,
    envelopePhase: 2.9,
  },
  left: {
    layers: [
      { freq: 3.3, amp: 0.56, speed: 2.2, phase: 0.6 },
      { freq: 6.5, amp: 0.42, speed: -1.9, phase: 2.2 },
      { freq: 11.8, amp: 0.24, speed: 2.75, phase: 1.3 },
    ],
    envelopeFreq: 2.6,
    envelopeSpeed: 1.05,
    envelopePhase: 0.1,
  },
};

/** All ribbons use neon lime only. */
export const EDGE_COLORS: Record<EdgeId, string> = {
  top: sparkPalette[0]!,
  right: sparkPalette[0]!,
  bottom: sparkPalette[0]!,
  left: sparkPalette[0]!,
};

/** Solid neon lime along each ribbon (inward fade still softens the crest). */
export const EDGE_GRADIENTS: Record<
  EdgeId,
  readonly [string, string, string]
> = {
  top: [sparkPalette[0]!, sparkPalette[0]!, sparkPalette[0]!],
  right: [sparkPalette[0]!, sparkPalette[0]!, sparkPalette[0]!],
  bottom: [sparkPalette[0]!, sparkPalette[0]!, sparkPalette[0]!],
  left: [sparkPalette[0]!, sparkPalette[0]!, sparkPalette[0]!],
};

export const EDGE_ORDER: EdgeId[] = ["top", "right", "bottom", "left"];

/** Soft blur radius for the ribbon group filter. */
export const CHROMA_AURORA_BLUR = 22;

/** Inward depth at parametric position u ∈ [0, 1] along the edge. */
export function edgeWaveDepth(
  edge: EdgeId,
  u: number,
  time: number,
  maxDepth: number,
): number {
  const cfg = EDGE_WAVE_CONFIGS[edge];
  let sum = 0;
  let weight = 0;

  for (const layer of cfg.layers) {
    const s = Math.sin(Math.PI * 2 * (layer.freq * u) + time * layer.speed + layer.phase);
    // Remap −1…1 → 0…1 so the ribbon always sits against the outer edge.
    sum += layer.amp * (0.5 + 0.5 * s);
    weight += layer.amp;
  }

  const base = weight > 0 ? sum / weight : 0.5;
  const env =
    0.45 +
    0.55 *
      (0.5 +
        0.5 *
          Math.sin(
            Math.PI * 2 * cfg.envelopeFreq * u +
              time * cfg.envelopeSpeed +
              cfg.envelopePhase,
          ));

  // Thin troughs + deep peaks for extreme undulation.
  return maxDepth * (0.06 + base * env * 0.94);
}

/**
 * Closed ribbon path: outer edge (optionally past the clip) → inward wavy return.
 * `outset` pushes the outer edge beyond the viewport so Gaussian blur is clipped
 * underneath — the visible rim stays full color instead of fading to black.
 */
export function buildEdgeRibbonPath(
  edge: EdgeId,
  width: number,
  height: number,
  time: number,
  maxDepth: number,
  samples = 48,
  outset = 0,
): string {
  const n = Math.max(8, samples);
  const parts: string[] = [];
  const pad = Math.max(0, outset);

  if (edge === "top") {
    parts.push(`M ${(-pad).toFixed(1)} ${(-pad).toFixed(1)}`);
    parts.push(`L ${(width + pad).toFixed(1)} ${(-pad).toFixed(1)}`);
    for (let i = n; i >= 0; i--) {
      const u = i / n;
      const x = u * width;
      const y = edgeWaveDepth(edge, u, time, maxDepth);
      parts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    parts.push("Z");
  } else if (edge === "bottom") {
    parts.push(`M ${(-pad).toFixed(1)} ${(height + pad).toFixed(1)}`);
    parts.push(`L ${(width + pad).toFixed(1)} ${(height + pad).toFixed(1)}`);
    for (let i = n; i >= 0; i--) {
      const u = i / n;
      const x = u * width;
      const y = height - edgeWaveDepth(edge, u, time, maxDepth);
      parts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    parts.push("Z");
  } else if (edge === "left") {
    parts.push(`M ${(-pad).toFixed(1)} ${(-pad).toFixed(1)}`);
    parts.push(`L ${(-pad).toFixed(1)} ${(height + pad).toFixed(1)}`);
    for (let i = n; i >= 0; i--) {
      const u = i / n;
      const y = u * height;
      const x = edgeWaveDepth(edge, u, time, maxDepth);
      parts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    parts.push("Z");
  } else {
    parts.push(`M ${(width + pad).toFixed(1)} ${(-pad).toFixed(1)}`);
    parts.push(`L ${(width + pad).toFixed(1)} ${(height + pad).toFixed(1)}`);
    for (let i = n; i >= 0; i--) {
      const u = i / n;
      const y = u * height;
      const x = width - edgeWaveDepth(edge, u, time, maxDepth);
      parts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    parts.push("Z");
  }

  return parts.join(" ");
}

/** Bleed depth as a fraction of the short side — just a thin peek at the rim. */
export const CHROMA_AURORA_BLEED_FRACTION = 0.045;

/**
 * How far past the clip edge to extend each ribbon before blur.
 * ~2.5× blur radius so the clipped rim sits in the solid core of the glow.
 */
export const CHROMA_AURORA_OUTSET = CHROMA_AURORA_BLUR * 2.5;
