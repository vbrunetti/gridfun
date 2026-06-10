import Image from "next/image";
import type { CSSProperties } from "react";
import type { CraftVignette, ImageRatio } from "@/content/portfolio";
import { palette } from "@/lib/colors";
import {
  vignetteKeyImageSrc,
  type PortfolioImageRatio,
} from "@/lib/portfolio-assets";

export { VignetteImageScroll } from "@/components/craft/vignette-carousel";

/** Craft index cards — square, landscape, or portrait (stable per slug). */
export type CraftCardRatio = PortfolioImageRatio;

const CRAFT_CARD_RATIOS: CraftCardRatio[] = ["1x1", "16x9", "9x16"];

export function craftCardRatio(slug: string): CraftCardRatio {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return CRAFT_CARD_RATIOS[hash % CRAFT_CARD_RATIOS.length];
}

function ratioValue(ratio: PortfolioImageRatio): string {
  if (ratio === "16x9") return "16 / 9";
  if (ratio === "1x1") return "1 / 1";
  return "9 / 16";
}

function ratioDimensions(
  ratio: PortfolioImageRatio,
): { width: number; height: number } {
  if (ratio === "16x9") return { width: 1600, height: 900 };
  if (ratio === "1x1") return { width: 1200, height: 1200 };
  return { width: 900, height: 1600 };
}

function resolveKeySrc(vignette: CraftVignette, ratio: PortfolioImageRatio): string {
  if (vignette.keyImageSrc) return vignette.keyImageSrc;
  return vignetteKeyImageSrc(vignette.keyImageAccent, ratio);
}

/** Vignette key image — portrait, landscape, or square. */
export function VignetteKeyImage({
  vignette,
  className = "",
  priority = false,
  displayRatio,
}: {
  vignette: CraftVignette;
  className?: string;
  priority?: boolean;
  /** Override aspect ratio for presentation (craft index masonry). */
  displayRatio?: PortfolioImageRatio;
}) {
  const ratio = displayRatio ?? vignette.keyImageRatio;
  const src = resolveKeySrc(vignette, ratio);
  const { width, height } = ratioDimensions(ratio);

  return (
    <Image
      src={src}
      alt={vignette.name}
      width={width}
      height={height}
      priority={priority}
      unoptimized={src.startsWith("data:")}
      className={`vignette-key-image ${className}`.trim()}
      style={{ aspectRatio: ratioValue(ratio) } as CSSProperties}
      sizes="(max-width: 768px) 100vw, min(420px, 40vw)"
    />
  );
}

export function CraftTagList({
  tags,
  className = "",
}: {
  tags: string[];
  className?: string;
}) {
  if (tags.length === 0) return null;
  return (
    <ul className={`craft-tag-list ${className}`.trim()}>
      {tags.map((tag) => (
        <li key={tag} className="craft-tag-pill">
          {tag}
        </li>
      ))}
    </ul>
  );
}

/** Client logo with wordmark fallback. */
export function ClientLogo({
  client,
  logoSrc,
  className = "",
}: {
  client: string;
  logoSrc?: string;
  className?: string;
}) {
  if (logoSrc) {
    return (
      <Image
        src={logoSrc}
        alt={`${client} logo`}
        width={160}
        height={32}
        className={`client-logo ${className}`.trim()}
      />
    );
  }

  return (
    <span
      className={`client-logo client-logo--wordmark ${className}`.trim()}
      aria-hidden
      style={{ backgroundColor: palette.charcoal }}
    >
      {client.slice(0, 1)}
    </span>
  );
}
