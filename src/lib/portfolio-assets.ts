import { palette } from "@/lib/colors";
import type { AccentKey } from "@/content/portfolio";

export const clientLogos = {
  northwind: "/portfolio/logos/northwind.svg",
  meridian: "/portfolio/logos/meridian.svg",
  loft: "/portfolio/logos/loft.svg",
  atlas: "/portfolio/logos/atlas.svg",
} as const;

export type PortfolioImageRatio = "1x1" | "9x16";

type PlaceholderSpec = {
  accent: AccentKey;
  label: string;
  ratio: PortfolioImageRatio;
  /** Stable seed for layout variation — e.g. vignette slug or frame index. */
  seed: string;
  frame?: number;
  total?: number;
};

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 2 ** 32;
}

function frameLabel(frame?: number, total?: number): string {
  if (frame === undefined) return "";
  const f = String(frame).padStart(2, "0");
  const t = total ? String(total).padStart(2, "0") : "";
  return t ? `${f} / ${t}` : f;
}

/**
 * Inline SVG placeholder — editorial grid + UI mock blocks.
 * Used until real image sources replace accent-only fills in content.
 */
export function portfolioPlaceholderSvg({
  accent,
  label,
  ratio,
  seed,
  frame,
  total,
}: PlaceholderSpec): string {
  const unit = hashSeed(seed);
  const bg = palette[accent];
  const ink = palette.black;
  const paper = palette.white;
  const muted = palette.mediumGray;
  const accentInk = unit > 0.5 ? ink : paper;
  const w = ratio === "1x1" ? 900 : 900;
  const h = ratio === "1x1" ? 900 : 1600;
  const pad = 72;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const cols = ratio === "1x1" ? 6 : 4;
  const rows = ratio === "1x1" ? 6 : 10;
  const colW = innerW / cols;
  const rowH = innerH / rows;
  const blockRow = Math.floor(unit * (rows - 3)) + 1;
  const blockCol = Math.floor(hashSeed(`${seed}-col`) * (cols - 2)) + 1;
  const blockRows = ratio === "1x1" ? 3 : 4;
  const blockCols = ratio === "1x1" ? 4 : 3;
  const index = frameLabel(frame, total);

  const gridLines = Array.from({ length: cols + 1 }, (_, i) => {
    const x = pad + i * colW;
    return `<line x1="${x}" y1="${pad}" x2="${x}" y2="${h - pad}" stroke="${muted}" stroke-opacity="0.35" stroke-width="1"/>`;
  }).join("");

  const rowLines = Array.from({ length: rows + 1 }, (_, i) => {
    const y = pad + i * rowH;
    return `<line x1="${pad}" y1="${y}" x2="${w - pad}" y2="${y}" stroke="${muted}" stroke-opacity="0.35" stroke-width="1"/>`;
  }).join("");

  const bx = pad + (blockCol - 1) * colW;
  const by = pad + (blockRow - 1) * rowH;
  const bw = blockCols * colW - 12;
  const bh = blockRows * rowH - 12;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  ${gridLines}
  ${rowLines}
  <rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="8" fill="${paper}" fill-opacity="0.92" stroke="${ink}" stroke-opacity="0.12" stroke-width="2"/>
  <rect x="${bx + 24}" y="${by + 24}" width="${Math.min(bw * 0.55, 280)}" height="12" rx="2" fill="${ink}" fill-opacity="0.18"/>
  <rect x="${bx + 24}" y="${by + 52}" width="${Math.min(bw * 0.75, 360)}" height="8" rx="2" fill="${ink}" fill-opacity="0.1"/>
  <rect x="${bx + 24}" y="${by + 72}" width="${Math.min(bw * 0.65, 320)}" height="8" rx="2" fill="${ink}" fill-opacity="0.1"/>
  <rect x="${bx + 24}" y="${by + bh - 56}" width="${Math.min(bw * 0.42, 200)}" height="32" rx="16" fill="${palette[accent === "offWhite" || accent === "white" ? "charcoal" : accent]}"/>
  <text x="${pad}" y="${pad - 18}" fill="${accentInk}" fill-opacity="0.72" font-family="ui-sans-serif, system-ui, sans-serif" font-size="22" font-weight="600" letter-spacing="0.08em">${label.toUpperCase()}</text>
  ${index ? `<text x="${w - pad}" y="${h - pad + 36}" text-anchor="end" fill="${accentInk}" fill-opacity="0.55" font-family="ui-monospace, monospace" font-size="20" letter-spacing="0.12em">${index}</text>` : ""}
</svg>`;
}

export function portfolioPlaceholderDataUrl(spec: PlaceholderSpec): string {
  const svg = portfolioPlaceholderSvg(spec);
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function vignetteKeyImageSrc(
  slug: string,
  accent: AccentKey,
  name: string,
  ratio: PortfolioImageRatio,
): string {
  return portfolioPlaceholderDataUrl({
    accent,
    label: name,
    ratio,
    seed: `${slug}-key`,
  });
}

export function vignetteFrameSrc(
  slug: string,
  accent: AccentKey,
  name: string,
  frameIndex: number,
  total: number,
): string {
  return portfolioPlaceholderDataUrl({
    accent,
    label: name,
    ratio: "9x16",
    seed: `${slug}-frame-${frameIndex}`,
    frame: frameIndex + 1,
    total,
  });
}
