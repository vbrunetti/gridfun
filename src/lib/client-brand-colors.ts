/**
 * Client brand colors — site-wide tokens for backgrounds, borders, fields, panelBg, etc.
 * Mirrored as CSS vars on :root (globals.css) and in @theme for Tailwind utilities.
 */
export const clientBrandColors = {
  pearson: {
    primary: "#0F0051",
    secondary: "#572CB2",
  },
  google: {
    primary: "#3888FF",
    secondary: "#00AB3D",
    tertiary: "#F62D1B",
    quaternary: "#FFBA00",
  },
  cruise: {
    primary: "#FE4A35",
  },
  mckinsey: {
    primary: "#051C2C",
  },
  facebook: {
    primary: "#3B579D",
  },
} as const;

/** Flat registry — single source for design system, panelBg, and TS lookups. */
export const clientBrandColorEntries = [
  {
    id: "pearson-primary",
    client: "Pearson",
    role: "Primary",
    token: "--color-pearson-primary",
    hex: clientBrandColors.pearson.primary,
    textOn: "paper",
  },
  {
    id: "pearson-secondary",
    client: "Pearson",
    role: "Secondary",
    token: "--color-pearson-secondary",
    hex: clientBrandColors.pearson.secondary,
    textOn: "paper",
  },
  {
    id: "google-primary",
    client: "Google",
    role: "Primary",
    token: "--color-google-primary",
    hex: clientBrandColors.google.primary,
    textOn: "paper",
  },
  {
    id: "google-secondary",
    client: "Google",
    role: "Secondary",
    token: "--color-google-secondary",
    hex: clientBrandColors.google.secondary,
    textOn: "paper",
  },
  {
    id: "google-tertiary",
    client: "Google",
    role: "Tertiary",
    token: "--color-google-tertiary",
    hex: clientBrandColors.google.tertiary,
    textOn: "paper",
  },
  {
    id: "google-quaternary",
    client: "Google",
    role: "Quaternary",
    token: "--color-google-quaternary",
    hex: clientBrandColors.google.quaternary,
    textOn: "ink",
  },
  {
    id: "cruise-primary",
    client: "Cruise",
    role: "Primary",
    token: "--color-cruise-primary",
    hex: clientBrandColors.cruise.primary,
    textOn: "paper",
  },
  {
    id: "mckinsey-primary",
    client: "McKinsey",
    role: "Primary",
    token: "--color-mckinsey-primary",
    hex: clientBrandColors.mckinsey.primary,
    textOn: "paper",
  },
  {
    id: "facebook-primary",
    client: "Facebook",
    role: "Primary",
    token: "--color-facebook-primary",
    hex: clientBrandColors.facebook.primary,
    textOn: "paper",
  },
] as const;

export type ClientBrandColorId = (typeof clientBrandColorEntries)[number]["id"];

/** @deprecated Use `ClientBrandColorId` */
export type ClientBrandPanel = ClientBrandColorId;

const entryById = Object.fromEntries(
  clientBrandColorEntries.map((entry) => [entry.id, entry]),
) as Record<ClientBrandColorId, (typeof clientBrandColorEntries)[number]>;

export const clientBrandColorTokens: Record<ClientBrandColorId, string> =
  Object.fromEntries(
    clientBrandColorEntries.map((entry) => [entry.id, entry.token]),
  ) as Record<ClientBrandColorId, string>;

/** @deprecated Use `clientBrandColorTokens` */
export const clientBrandPanelTokens = clientBrandColorTokens;

/** CSS `var(--color-…)` for inline styles, panelBg, brand fields, etc. */
export function clientBrandColorVar(id: ClientBrandColorId): string {
  return `var(${entryById[id].token})`;
}

/** Legible text color on a brand field background. */
export function clientBrandTextOn(
  id: ClientBrandColorId,
): (typeof clientBrandColorEntries)[number]["textOn"] {
  return entryById[id].textOn;
}

/** Floating chrome surface when a brand field fills the viewport. */
export function clientBrandChromeSurface(
  id: ClientBrandColorId,
): "dark" | "light" {
  return entryById[id].textOn === "paper" ? "dark" : "light";
}

/** @deprecated Use `clientBrandColorVar` */
export const clientBrandPanelVar = clientBrandColorVar;

/** Raw hex — for canvas, SVG, or places that cannot use CSS vars. */
export function clientBrandColorHex(id: ClientBrandColorId): string {
  return entryById[id].hex;
}

export function isClientBrandColor(
  value: string,
): value is ClientBrandColorId {
  return value in entryById;
}

/** @deprecated Use `isClientBrandColor` */
export const isClientBrandPanel = isClientBrandColor;

/** Theme class for a client brand surface, e.g. `.theme-pearson-primary`. */
export function clientBrandSurfaceClass(id: ClientBrandColorId): string {
  return `theme-${id}`;
}

/** Grouped for /design-system swatches. */
export const clientBrandColorGroups = (
  ["Pearson", "Google", "Cruise", "McKinsey", "Facebook"] as const
).map((client) => ({
  client,
  colors: clientBrandColorEntries
    .filter((entry) => entry.client === client)
    .map(({ token, role, hex }) => ({ token, label: role, hex })),
}));
