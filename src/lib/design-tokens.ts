/** Reference metadata for /test design system page — mirrors globals.css */

export const brandColors = [
  { token: "--color-paper", label: "Paper" },
  { token: "--color-white", label: "White" },
  { token: "--color-flesh", label: "Flesh" },
  { token: "--color-ink", label: "Ink" },
  { token: "--color-brown", label: "Brown" },
  { token: "--color-orange", label: "Orange" },
  { token: "--color-leaf-green", label: "Leaf green" },
  { token: "--color-crimson", label: "Crimson" },
  { token: "--color-electric-blue", label: "Electric blue" },
  { token: "--color-flamingo-pink", label: "Flamingo pink" },
  { token: "--color-golden-yellow", label: "Golden yellow" },
] as const;

export const semanticColors = [
  { token: "--background", label: "Background" },
  { token: "--foreground", label: "Foreground" },
  { token: "--text-primary", label: "Text primary" },
  { token: "--text-secondary", label: "Text secondary (80%)" },
  { token: "--text-tertiary", label: "Text tertiary (60%)" },
  { token: "--accent", label: "Accent" },
  { token: "--accent-secondary", label: "Accent secondary" },
  { token: "--rule-light", label: "Rule light" },
  { token: "--rule-strong", label: "Rule strong" },
  { token: "--surface-white", label: "Surface white" },
] as const;

export const surfaces = [
  { token: "--surface-light", className: "theme-light", label: "Light (paper)" },
  { token: "--surface-white", className: "theme-white", label: "White" },
  { token: "--canvas-blue", className: "theme-canvas", label: "Canvas (electric blue)" },
  { token: "--section-dark-bg", className: "theme-dark", label: "Dark (ink)" },
] as const;

export const typographyRamp = [
  {
    className: "display-xl",
    label: "Display XL",
    size: "clamp(2.5rem, 6vw, 4.75rem)",
    weight: "700",
    lineHeight: "1.02",
    letterSpacing: "-0.035em",
  },
  {
    className: "display-lg",
    label: "Display LG",
    size: "clamp(1.75rem, 4vw, 3.25rem)",
    weight: "700",
    lineHeight: "1.08",
    letterSpacing: "-0.03em",
  },
  {
    className: "text-lg font-normal",
    label: "Body LG",
    size: "1.125rem (Tailwind text-lg)",
    weight: "400",
    lineHeight: "inherit",
    letterSpacing: "normal",
  },
  {
    className: "text-sm",
    label: "Body SM",
    size: "0.875rem",
    weight: "400",
    lineHeight: "inherit",
    letterSpacing: "normal",
  },
  {
    className: "text-meta",
    label: "Meta",
    size: "0.6875rem (11px)",
    weight: "500",
    lineHeight: "inherit",
    letterSpacing: "0.16em · uppercase",
  },
  {
    className: "rail-label-vertical",
    label: "Rail label",
    size: "0.625rem (10px)",
    weight: "600",
    lineHeight: "inherit",
    letterSpacing: "0.14em · uppercase · vertical-rl",
  },
] as const;

export const spacingTokens = [
  {
    token: "--grid-row-gap",
    label: "Grid row gap",
    mobile: "clamp(1.5rem, 4vw, 3rem)",
    desktop: "same",
  },
  {
    token: "--grid-gutter",
    label: "Grid column gutter",
    mobile: "2px",
    desktop: "8px (lg+)",
  },
  {
    token: "--grid-margin",
    label: "Grid side margin",
    mobile: "1rem",
    desktop: "clamp(1rem, 4vw, 3rem)",
  },
  {
    token: "--grid-max",
    label: "Grid max width",
    mobile: "none",
    desktop: "90rem (1440px)",
  },
  { token: "--rail-width", label: "Left rail", mobile: "5.5rem", desktop: "5.5rem" },
  { token: "--chrome-hit", label: "Chrome hit target", mobile: "2.75rem", desktop: "2.75rem" },
  { token: "--chrome-pad", label: "Chrome padding", mobile: "1.25rem", desktop: "1.25rem" },
  {
    token: "--chrome-top-offset",
    label: "Chrome top offset (mobile)",
    mobile: "pad×2 + hit",
    desktop: "0 (rail layout)",
  },
  { token: "--media-column", label: "Media / card width cap", mobile: "min(100%, 22rem)", desktop: "same" },
] as const;

export const remSpacingRamp = [
  { rem: "0.25", px: 4 },
  { rem: "0.5", px: 8 },
  { rem: "0.75", px: 12 },
  { rem: "1", px: 16 },
  { rem: "1.25", px: 20 },
  { rem: "1.5", px: 24 },
  { rem: "2", px: 32 },
  { rem: "2.5", px: 40 },
  { rem: "3", px: 48 },
  { rem: "4", px: 64 },
  { rem: "6", px: 96 },
  { rem: "12", px: 192 },
] as const;

export const gridSpans = [
  { className: "grid-span-1", columns: 1 },
  { className: "grid-span-2", columns: 2 },
  { className: "grid-span-6", columns: 6 },
  { className: "col-span-content", columns: "full (inset on lg)" },
  { className: "col-span-hero", columns: "2–10 on lg" },
  { className: "col-span-narrow", columns: "2–8 on lg" },
] as const;

export const themes = [
  { className: "theme-light", label: "Light", note: "Paper bg · ink text" },
  { className: "theme-dark", label: "Dark", note: "Ink bg · paper text · menu overlay" },
  { className: "theme-canvas", label: "Canvas", note: "Electric blue bg · paper text" },
  { className: "theme-white", label: "White", note: "Pure white bg · ink text" },
] as const;

export const fonts = [
  { token: "--font-geist-sans", usage: "Body & UI (Geist Sans)" },
  { token: "--font-geist-mono", usage: "Monospace (Geist Mono)" },
] as const;
