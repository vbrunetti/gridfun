/**
 * Portfolio palette — neutral ramp + neon accents.
 * Text uses ink or paper at 100% / 80% / 60% (see globals.css).
 */
export const palette = {
  white: "#FFFFFF",
  offWhite: "#EFEFEF",
  lightGray: "#D4D4D4",
  mediumGray: "#A8A8A8",
  charcoal: "#333333",
  black: "#000000",
  neonLime: "#D8FF00",
  hotPink: "#FF2875",
  skyBlue: "#5BC4FF",
  mediumBlue: "#2962FF",
  royalBlue: "#0033FF",
  cruise: "#FE4A35",
  /** @deprecated Use offWhite — kept for existing token names */
  paper: "#EFEFEF",
  /** @deprecated Use lightGray */
  flesh: "#D4D4D4",
  /** @deprecated Use black */
  ink: "#000000",
  /** @deprecated Use charcoal */
  brown: "#333333",
  /** @deprecated Use neonLime */
  orange: "#D8FF00",
  /** @deprecated Use neonLime */
  leafGreen: "#D8FF00",
  /** @deprecated Use hotPink */
  crimson: "#FF2875",
  /** @deprecated Use mediumBlue */
  electricBlue: "#2962FF",
  /** @deprecated Use hotPink */
  flamingoPink: "#FF2875",
  /** @deprecated Use neonLime */
  goldenYellow: "#D8FF00",
} as const;

export {
  clientBrandColorEntries,
  clientBrandColorGroups,
  clientBrandColorHex,
  clientBrandColorVar,
  clientBrandColors,
  type ClientBrandColorId,
} from "@/lib/client-brand-colors";

/** Craft / impact portrait fills — rotate neons; grays for quieter tiles. */
export const portraitAccents = [
  "neonLime",
  "hotPink",
  "royalBlue",
  "skyBlue",
  "mediumBlue",
  "charcoal",
  "mediumGray",
] as const satisfies readonly (keyof typeof palette)[];

/** Accent colors used for spark / glow particle cycling. */
export const sparkPalette = [
  palette.neonLime,
  palette.hotPink,
  palette.skyBlue,
  palette.mediumBlue,
  palette.royalBlue,
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
