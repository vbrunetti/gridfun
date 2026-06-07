import Image from "next/image";
import type { CSSProperties } from "react";
import type { CraftVignette, KeyImageRatio } from "@/content/portfolio";
import { palette } from "@/lib/colors";
import {
  vignetteFrameSrc,
  vignetteKeyImageSrc,
} from "@/lib/portfolio-assets";

function ratioValue(ratio: KeyImageRatio): string {
  return ratio === "1x1" ? "1 / 1" : "9 / 16";
}

function resolveKeySrc(vignette: CraftVignette): string {
  return (
    vignette.keyImageSrc ??
    vignetteKeyImageSrc(
      vignette.slug,
      vignette.keyImageAccent,
      vignette.name,
      vignette.keyImageRatio,
    )
  );
}

function resolveFrameSrc(
  vignette: CraftVignette,
  frameIndex: number,
): string {
  const image = vignette.images[frameIndex];
  return (
    image.src ??
    vignetteFrameSrc(
      vignette.slug,
      image.accent,
      vignette.name,
      frameIndex,
      vignette.images.length,
    )
  );
}

/** Vignette key image — square or 9×16 portrait. */
export function VignetteKeyImage({
  vignette,
  className = "",
  priority = false,
}: {
  vignette: CraftVignette;
  className?: string;
  priority?: boolean;
}) {
  const src = resolveKeySrc(vignette);

  return (
    <Image
      src={src}
      alt={vignette.name}
      width={vignette.keyImageRatio === "1x1" ? 900 : 900}
      height={vignette.keyImageRatio === "1x1" ? 900 : 1600}
      priority={priority}
      unoptimized={src.startsWith("data:")}
      className={`vignette-key-image ${className}`.trim()}
      style={{ aspectRatio: ratioValue(vignette.keyImageRatio) } as CSSProperties}
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

/**
 * Horizontal scroller through a vignette's 9×16 images, each with an optional
 * caption. Pure CSS scroll-snap — no JS needed.
 *
 * `layout="grid"` — direct children of RuledGrid; copy aligns to col-span-content.
 */
export function VignetteImageScroll({
  vignette,
  showHeader = true,
  layout = "default",
}: {
  vignette: CraftVignette;
  showHeader?: boolean;
  layout?: "default" | "grid";
}) {
  if (vignette.images.length === 0) return null;

  const total = vignette.images.length;

  const header = showHeader ? (
    <div className="vignette-hscroll-head">
      <p className="text-meta vignette-hscroll-count">
        {String(total).padStart(2, "0")} frames
      </p>
      <p className="text-meta vignette-hscroll-hint" aria-hidden>
        Scroll →
      </p>
    </div>
  ) : null;

  const scroller = (
    <div className="vignette-hscroll-shell">
      <div
        className="vignette-hscroll"
        role="region"
        aria-label={`${vignette.name} — images`}
        tabIndex={0}
      >
        {vignette.images.map((image, index) => {
          const src = resolveFrameSrc(vignette, index);
          const alt =
            image.caption?.trim() ||
            `${vignette.name} frame ${String(index + 1).padStart(2, "0")}`;

          return (
            <figure className="vignette-himage" key={index}>
              <div className="vignette-himage__frame">
                <span className="vignette-himage__index text-meta" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Image
                  src={src}
                  alt={alt}
                  width={900}
                  height={1600}
                  unoptimized={src.startsWith("data:")}
                  className="vignette-himage__media"
                  sizes="(max-width: 768px) 78vw, 380px"
                />
              </div>
              {image.caption ? (
                <figcaption className="vignette-himage__caption">
                  {image.caption}
                </figcaption>
              ) : (
                <figcaption
                  className="vignette-himage__caption vignette-himage__caption--empty"
                  aria-hidden
                />
              )}
            </figure>
          );
        })}
      </div>
    </div>
  );

  if (layout === "grid") {
    return (
      <div className="col-span-content vignette-hscroll-wrap vignette-hscroll-wrap--grid">
        {header}
        {scroller}
      </div>
    );
  }

  return (
    <div className="vignette-hscroll-wrap">
      {header}
      {scroller}
    </div>
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
