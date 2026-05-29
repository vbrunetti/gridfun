/**
 * Portfolio palette — paper / flesh / orange / leaf green / crimson family.
 * Text uses ink or paper at 100% / 80% / 60% (see globals.css).
 */
export const palette = {
  paper: "#F6F0E5",
  white: "#FFFFFF",
  flesh: "#F5DCBF",
  ink: "#1C1916",
  brown: "#574038",
  orange: "#FF662E",
  leafGreen: "#008755",
  crimson: "#A41E34",
  electricBlue: "#2A5BB5",
  flamingoPink: "#D46B7A",
  goldenYellow: "#D9A028",
} as const;

/** Accent colors used for spark / glow particle cycling. */
export const sparkPalette = [
  palette.orange,
  palette.crimson,
  palette.leafGreen,
  palette.electricBlue,
  palette.flamingoPink,
  palette.goldenYellow,
] as const;

export type Rgb = readonly [number, number, number];

export function hexToRgb(hex: string): Rgb {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lerpChannel(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

/** Smoothly sample the spark palette at phase t (0–1, wraps). */
export function sampleSparkPaletteRgb(t: number): Rgb {
  const colors = sparkPalette;
  const n = colors.length;
  const wrapped = ((t % 1) + 1) % 1;
  const scaled = wrapped * n;
  const i = Math.floor(scaled) % n;
  const j = (i + 1) % n;
  const f = scaled - Math.floor(scaled);
  const a = hexToRgb(colors[i]!);
  const b = hexToRgb(colors[j]!);
  return [
    lerpChannel(a[0], b[0], f),
    lerpChannel(a[1], b[1], f),
    lerpChannel(a[2], b[2], f),
  ];
}

export function rgbaFromRgb([r, g, b]: Rgb, alpha: number) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
