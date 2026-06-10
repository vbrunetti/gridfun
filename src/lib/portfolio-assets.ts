import { palette } from "@/lib/colors";
import type { AccentKey } from "@/content/portfolio";

export const clientLogos = {
  northwind: "/portfolio/logos/northwind.svg",
  meridian: "/portfolio/logos/meridian.svg",
  loft: "/portfolio/logos/loft.svg",
  atlas: "/portfolio/logos/atlas.svg",
} as const;

export type PortfolioImageRatio = "9x16" | "16x9" | "1x1";

type PlaceholderSpec = {
  accent: AccentKey;
  ratio: PortfolioImageRatio;
};

function ratioDimensions(ratio: PortfolioImageRatio): { w: number; h: number } {
  if (ratio === "16x9") return { w: 1600, h: 900 };
  if (ratio === "1x1") return { w: 1200, h: 1200 };
  return { w: 900, h: 1600 };
}

/**
 * Inline SVG placeholder — a flat accent fill with a simple grid overlay.
 * Stands in until real image sources replace accent-only fills in content.
 */
export function portfolioPlaceholderSvg({ accent, ratio }: PlaceholderSpec): string {
  const { w, h } = ratioDimensions(ratio);
  const bg = palette[accent];
  const line = palette.black;
  const cell = 100;
  const cols = Math.round(w / cell);
  const rows = Math.round(h / cell);

  const verticals = Array.from({ length: cols + 1 }, (_, i) => {
    const x = (i * w) / cols;
    return `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${line}" stroke-opacity="0.12" stroke-width="2"/>`;
  }).join("");

  const horizontals = Array.from({ length: rows + 1 }, (_, i) => {
    const y = (i * h) / rows;
    return `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${line}" stroke-opacity="0.12" stroke-width="2"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="placeholder">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  ${verticals}
  ${horizontals}
</svg>`;
}

export function portfolioPlaceholderDataUrl(spec: PlaceholderSpec): string {
  const svg = portfolioPlaceholderSvg(spec);
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function vignetteKeyImageSrc(
  accent: AccentKey,
  ratio: PortfolioImageRatio,
): string {
  return portfolioPlaceholderDataUrl({ accent, ratio });
}

export function vignetteFrameSrc(
  accent: AccentKey,
  ratio: PortfolioImageRatio,
): string {
  return portfolioPlaceholderDataUrl({ accent, ratio });
}
