import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { CraftVignette } from "@/content/portfolio";
import { craftTagFilterHref } from "@/content/portfolio";
import {
  vignetteKeyImageSrc,
  type PortfolioImageRatio,
} from "@/lib/portfolio-assets";

export { VignetteImageScroll } from "@/components/craft/vignette-carousel";

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

/** Vignette key image — portrait, landscape, or square (set by `keyImageRatio`). */
export function VignetteKeyImage({
  vignette,
  className = "",
  priority = false,
}: {
  vignette: CraftVignette;
  className?: string;
  priority?: boolean;
}) {
  const ratio = vignette.keyImageRatio;
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
  variant = "pill",
}: {
  tags: string[];
  className?: string;
  /** filter-link — compact craft filter chips linking to /craft?tag=… */
  variant?: "pill" | "filter-link";
}) {
  if (tags.length === 0) return null;

  if (variant === "filter-link") {
    return (
      <ul className={`craft-tag-list ${className}`.trim()}>
        {tags.map((tag) => (
          <li key={tag}>
            <Link
              href={craftTagFilterHref(tag)}
              className="craft-filter-chip craft-filter-chip--compact craft-filter-chip--on"
            >
              <span className="craft-filter-chip__dot" aria-hidden />
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

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
    >
      {client.slice(0, 1)}
    </span>
  );
}
