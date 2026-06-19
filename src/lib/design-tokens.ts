/** Reference metadata for /design-system page — mirrors globals.css */

import {
  clientBrandColorEntries,
  clientBrandSurfaceClass,
} from "@/lib/client-brand-colors";

export { clientBrandColorGroups } from "@/lib/client-brand-colors";

export type SurfaceSpec = {
  token: string;
  className: string;
  label: string;
  textOn: "ink" | "paper";
  group: "structural" | "brand";
  note?: string;
};

const structuralSurfaces = [
  {
    token: "--surface-light",
    className: "theme-light",
    label: "Light (paper)",
    textOn: "ink",
    group: "structural",
    note: "Default page ground",
  },
  {
    token: "--surface-light-dim",
    className: "theme-light-dim",
    label: "Light dim",
    textOn: "ink",
    group: "structural",
    note: "Slightly darker than paper",
  },
  {
    token: "--surface-white",
    className: "theme-white",
    label: "White",
    textOn: "ink",
    group: "structural",
  },
  {
    token: "--canvas-blue",
    className: "theme-canvas",
    label: "Canvas (neon lime)",
    textOn: "ink",
    group: "structural",
  },
  {
    token: "--section-dark-bg",
    className: "theme-dark",
    label: "Dark (black)",
    textOn: "paper",
    group: "structural",
  },
  {
    token: "--section-dark-lift",
    className: "theme-dark-lift",
    label: "Dark lift",
    textOn: "paper",
    group: "structural",
    note: "Slightly lighter than black",
  },
] as const satisfies readonly SurfaceSpec[];

const brandSurfaces = clientBrandColorEntries.map((entry) => ({
  token: entry.token,
  className: clientBrandSurfaceClass(entry.id),
  label: `${entry.client} ${entry.role.toLowerCase()}`,
  textOn: entry.textOn,
  group: "brand" as const,
})) satisfies readonly SurfaceSpec[];

export const surfaces: readonly SurfaceSpec[] = [
  ...structuralSurfaces,
  ...brandSurfaces,
];

export const surfaceGroups = [
  { id: "structural", label: "Structural" },
  { id: "brand", label: "Client brand" },
] as const;

export const brandColors = [
  { token: "--color-white", label: "White" },
  { token: "--color-off-white", label: "Off white" },
  { token: "--color-light-gray", label: "Light gray" },
  { token: "--color-medium-gray", label: "Medium gray" },
  { token: "--color-charcoal", label: "Charcoal" },
  { token: "--color-black", label: "Black" },
  { token: "--color-neon-lime", label: "Neon lime" },
] as const;

export const semanticColors = [
  { token: "--background", label: "Background" },
  { token: "--foreground", label: "Foreground" },
  { token: "--text-primary", label: "Text primary" },
  { token: "--text-secondary", label: "Text secondary (80%)" },
  { token: "--text-tertiary", label: "Text tertiary (60%)" },
  { token: "--accent", label: "Accent" },
  { token: "--accent-foreground", label: "Accent foreground (on lime)" },
  { token: "--rule-light", label: "Rule light" },
  { token: "--rule-strong", label: "Rule strong" },
  { token: "--surface-white", label: "Surface white" },
  { token: "--surface-light-dim", label: "Surface light dim" },
  { token: "--section-dark-lift", label: "Section dark lift" },
] as const;

export type TypographyRampEntry = {
  className: string;
  label: string;
  size: string;
  weight: string;
  lineHeight: string;
  letterSpacing: string;
  sample?: string;
  /** Container for cqi-based sizes (e.g. craft-card). */
  wrapperClass?: string;
  scope?: string;
  fontFamily?: string;
};

/** Core reading hierarchy — Display XL is the ceiling (4.75rem). */
export const typographyRamp: readonly TypographyRampEntry[] = [
  {
    className: "display-xl",
    label: "Display XL",
    size: "var(--type-display-xl) · clamp(2.5rem, 6vw, 4.75rem)",
    weight: "700",
    lineHeight: "1.02",
    letterSpacing: "-0.035em",
    sample: "Case Studies",
    scope: "Page titles · hero headlines · case study names",
  },
  {
    className: "display-lg",
    label: "Display LG",
    size: "var(--type-display-lg) · clamp(1.75rem, 4vw, 3.25rem)",
    weight: "700",
    lineHeight: "1.08",
    letterSpacing: "-0.03em",
    sample: "Semantic Color + Shape Language",
    scope: "Section titles · prose headings · menu primary links",
  },
  {
    className: "display-md",
    label: "Display MD",
    size: "var(--type-display-md) · clamp(1.375rem, 2.8vw, 2.65rem)",
    weight: "700",
    lineHeight: "1.12",
    letterSpacing: "-0.025em",
    sample: "Craft",
    scope: "Sticky page titles · vignette chapter titles · related links",
  },
  {
    className: "display-sm",
    label: "Display SM",
    size: "var(--type-display-sm) · clamp(1.125rem, 2vw, 1.75rem)",
    weight: "700",
    lineHeight: "1.15",
    letterSpacing: "-0.02em",
    sample: "Octopus-shaped leadership",
    scope: "About section headings · menu nested links",
  },
  {
    className: "heading-lg",
    label: "Heading LG",
    size: "var(--type-heading-lg) · clamp(1.25rem, 2vw, 1.5rem)",
    weight: "600",
    lineHeight: "1.25",
    letterSpacing: "-0.015em",
    sample: "Senior Design Manager",
    scope: "Role titles · contact names · card subheads",
  },
  {
    className: "heading-md",
    label: "Heading MD",
    size: "var(--type-heading-md) · clamp(1.0625rem, 1.5vw, 1.25rem)",
    weight: "600",
    lineHeight: "1.3",
    letterSpacing: "-0.01em",
    sample: "Checkout recovery lifted completed purchases 24%",
    scope: "Craft masonry card titles",
  },
  {
    className: "body-lg",
    label: "Body LG",
    size: "var(--type-body-lg) · clamp(1.0625rem, 1.5vw, 1.25rem)",
    weight: "400",
    lineHeight: "1.55",
    letterSpacing: "normal",
    sample:
      "Designing the human side of an autonomous fleet — context gain over a black box.",
    scope: "Lead paragraphs · hero subheads · about intro",
  },
  {
    className: "body-md",
    label: "Body MD",
    size: "var(--type-body-md) · clamp(1rem, 1.4vw, 1.125rem)",
    weight: "400",
    lineHeight: "1.7",
    letterSpacing: "normal",
    sample: "The quick brown fox jumps over the lazy dog.",
    scope: "Default prose · case study body copy · blockquotes",
  },
  {
    className: "body-sm",
    label: "Body SM",
    size: "var(--type-body-sm) · clamp(0.875rem, 1.2vw, 1rem)",
    weight: "400",
    lineHeight: "1.45",
    letterSpacing: "normal",
    sample: "123 Main St · San Francisco, CA",
    scope: "Contact details · hero fact values · supporting lists",
  },
  {
    className: "text-caption",
    label: "Caption",
    size: "var(--type-caption) · 0.9375rem (15px)",
    weight: "400",
    lineHeight: "1.45",
    letterSpacing: "normal",
    sample: "Pedestrians, cyclists, vehicles, and static objects read at a glance.",
    scope: "Media captions · gallery footnotes",
  },
  {
    className: "text-meta",
    label: "Label",
    size: "var(--type-label) · 0.6875rem (11px)",
    weight: "500",
    lineHeight: "1.4",
    letterSpacing: "0.16em · uppercase",
    sample: "01 · Typography",
    scope: "Eyebrows · kickers · panel labels · filter chips (hero)",
  },
  {
    className: "text-label-sm text-mono-label",
    label: "Label SM (mono)",
    size: "var(--type-label-sm) · 0.625rem (10px)",
    weight: "500",
    lineHeight: "1.4",
    letterSpacing: "0.14em · uppercase",
    fontFamily: "Geist Mono",
    sample: "18 STORIES · 12 SKILLS · 2023–2025",
    scope: "Craft hero stats · case study index meta · rail label",
  },
  {
    className: "text-label-xs",
    label: "Label XS",
    size: "var(--type-label-xs) · 0.5625rem (9px)",
    weight: "500",
    lineHeight: "1.35",
    letterSpacing: "0.05em · uppercase",
    sample: "DESIGN SYSTEMS",
    scope: "Compact filter chips · sticky header filters",
  },
  {
    className: "rail-label-vertical",
    label: "Rail label",
    size: "var(--type-label-sm) · 0.625rem (10px)",
    weight: "600",
    lineHeight: "1.4",
    letterSpacing: "0.14em · uppercase · vertical-rl",
    sample: "CASE STUDIES",
    scope: "Left rail · current page label",
  },
] as const;

/** Ornamental scale — outside the Display XL reading ceiling. */
export const ornamentalTypography: readonly TypographyRampEntry[] = [
  {
    className: "display-ghost",
    label: "Display Ghost",
    size: "var(--type-ghost) · clamp(4.5rem, 62cqi, 15rem)",
    weight: "700",
    lineHeight: "0.82",
    letterSpacing: "-0.07em",
    sample: "01",
    wrapperClass: "craft-card",
    scope: "/craft masonry ghost index",
  },
  {
    className: "display-numeral",
    label: "Display Numeral",
    size: "var(--type-numeral) · clamp(3.5rem, 9vw, 7.5rem)",
    weight: "700",
    lineHeight: "0.86",
    letterSpacing: "-0.04em",
    sample: "01",
    scope: "Vignette chapter opener numeral",
  },
  {
    className: "display-sm",
    label: "Vignette beat",
    size: "var(--type-display-sm)",
    weight: "700",
    lineHeight: "1.15",
    letterSpacing: "-0.02em",
    sample: "Operators gained context about the scene faster and more accurately.",
    scope: "Vignette field panel prose beat",
  },
] as const;

export const caseStudyTypography = ornamentalTypography.filter(
  (entry) => entry.label !== "Display Ghost",
);

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
    mobile: "clamp(1rem, 2.5vw, 1.5rem)",
    desktop: "same",
  },
  {
    token: "--grid-margin",
    label: "Grid side margin",
    mobile: "1.5rem",
    desktop: "clamp(1rem, 4vw, 3rem)",
  },
  {
    token: "--grid-margin-inline-end",
    label: "Grid end margin",
    mobile: "1rem (menu floats over grid)",
    desktop: "max(margin, chrome inset)",
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
  {
    token: "--panel-kicker",
    label: "Vignette panel kicker band",
    mobile: "var(--chrome-top-offset)",
    desktop: "same",
  },
  {
    token: "--panel-main-inset-top",
    label: "Vignette panel main inset",
    mobile: "clamp(1.25rem, 3vh, 2rem)",
    desktop: "same",
  },
  {
    token: "--panel-foot",
    label: "Vignette panel foot band",
    mobile: "clamp(5.25rem, 14vh, 8.5rem)",
    desktop: "same",
  },
  {
    token: "--panel-pad",
    label: "Vignette panel inline pad",
    mobile: "var(--grid-margin) — vframes fill full pin width; bands get breathing room from colored edge",
    desktop: "var(--grid-margin) — JS track flush with pin left; panel-pad aligns text to grid baseline",
  },
  {
    token: "--cs-hero-foot",
    label: "Case study hero foot inset",
    mobile: "clamp(2rem, 5vh, 3.5rem)",
    desktop: "same",
  },
] as const;

export const vignettePanelWidths = [
  { kind: "Title (chapter opener)", cols: "4 / 12", className: ".vframe--title" },
  { kind: "Field beat · portrait 9×16", cols: "6 / 12", className: ".vframe--field · .vframe--9x16" },
  { kind: "Square 1×1", cols: "8 / 12", className: ".vframe--1x1" },
  { kind: "Landscape 16×9", cols: "12 / 12", className: ".vframe--16x9" },
] as const;

export const vignetteClientBrandPanels = clientBrandColorEntries.map(
  ({ id, token, client, role, hex }) => ({
    id,
    token,
    label: `${client} ${role.toLowerCase()}`,
    hex,
  }),
);

export const vignettePanelSurfaces = [
  { id: "default", token: "--panel-surface", label: "Default ground" },
  { id: "secondary", token: "--panel-surface-secondary", label: "Secondary lift" },
  { id: "tertiary", token: "--panel-surface-tertiary", label: "Tertiary lift" },
  ...vignetteClientBrandPanels,
] as const;

export const caseStudyDetailPatterns = [
  {
    pattern: "Section focus",
    className: ".cs-focus-section",
    behavior: "One section at full opacity; others dim to 45%. Hover previews at 100%.",
  },
  {
    pattern: "Panel focus",
    className: ".vframe.is-active",
    behavior: "Inside a vignette chapter, one panel at 100%; siblings at 45%. Hover peeks idle panels.",
  },
  {
    pattern: "Trail panel",
    className: ".vchapter__trail",
    behavior:
      "Phantom sibling after the last colorful panel — fills viewport to the right, mirrors last-panel dimming. Not in scroll or dot nav.",
  },
  {
    pattern: "Scroll snap",
    className: ".cs-detail",
    behavior:
      "Desktop: one wheel/key step per hero, prose block, vignette panel, or footer. Mobile: natural scroll.",
  },
  {
    pattern: "Peek cursor",
    className: ".cs-peek-cursor",
    behavior: "200×200 plus on dimmed sections/panels; click jumps like dot nav.",
  },
  {
    pattern: "Optional hero reel",
    className: ".cs-hero__video",
    behavior:
      "Optional heroVideo on a case study — looping MP4 at 30% opacity, rail to browser edge (see portfolio.ts).",
  },
] as const;

export const caseStudyHeroFacts = [
  { key: "Client", cols: "1–2" },
  { key: "Date", cols: "3–4" },
  { key: "Role", cols: "5–8" },
  { key: "Tools", cols: "9–12" },
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

export const themes = surfaces.map(({ className, label, textOn, note }) => ({
  className,
  label,
  note: note
    ? `${note} · ${textOn} text`
    : `${textOn === "ink" ? "Ink" : "Paper"} text`,
}));

export const fonts = [
  { token: "--font-geist-sans", usage: "Body & UI (Geist Sans)" },
  { token: "--font-geist-mono", usage: "Monospace (Geist Mono)" },
] as const;

/** Where each ramp step is used across the site. */
export const typographyUsageMap = [
  { role: "Page title", className: "display-xl", routes: "Home hero · /about · /contact · /craft · /case-studies · CS detail hero" },
  { role: "Section title", className: "display-lg", routes: "CS prose/vignette headings · DS sections · menu primary" },
  { role: "Compact page title", className: "display-md", routes: "/craft sticky header · vignette chapter title" },
  { role: "Subsection title", className: "display-sm", routes: "/about sections · menu nested links" },
  { role: "Lead / subhead", className: "body-lg", routes: "Hero subheads · CS hero subhead · about intro" },
  { role: "Body copy", className: "body-md", routes: "Prose paragraphs · testimonials · experience summaries" },
  { role: "Small body", className: "body-sm", routes: "Contact address · hero facts · achievement lists" },
  { role: "Caption", className: "text-caption", routes: "Vignette media captions · gallery footnotes" },
  { role: "Label / kicker", className: "text-meta", routes: "Eyebrows · panel kickers · section kickers" },
  { role: "Mono label", className: "text-label-sm text-mono-label", routes: "Craft hero stats · CS index client line" },
] as const;
