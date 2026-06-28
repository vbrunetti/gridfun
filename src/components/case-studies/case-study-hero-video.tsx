import type { CSSProperties } from "react";
import type { CaseStudyHeroVideo as CaseStudyHeroVideoConfig } from "@/content/portfolio";
import { parseVimeoId, vimeoBackgroundUrl } from "@/lib/vimeo";

type CaseStudyHeroVideoProps = CaseStudyHeroVideoConfig;

/**
 * Ambient hero reel behind the case-study title slide — autoplay loop, no controls,
 * full-bleed, dimmed (opacity). Accepts a direct MP4 `src` or a `vimeo` id/URL
 * (rendered as Vimeo's borderless background embed).
 */
export function CaseStudyHeroVideo({
  src,
  vimeo,
  opacity = 0.3,
  poster,
}: CaseStudyHeroVideoProps) {
  const vimeoId = vimeo ? parseVimeoId(vimeo) : null;

  return (
    <div
      className="cs-hero__video"
      aria-hidden
      style={
        {
          "--cs-hero-video-opacity": opacity,
          opacity,
        } as CSSProperties
      }
    >
      {vimeoId ? (
        <>
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              className="cs-hero__video-poster"
              aria-hidden
            />
          ) : null}
          <iframe
            src={vimeoBackgroundUrl(vimeoId)}
            title="Background reel"
            tabIndex={-1}
            aria-hidden
            allow="autoplay; fullscreen; picture-in-picture"
          />
        </>
      ) : src ? (
        <video autoPlay loop muted playsInline preload="auto" poster={poster}>
          <source src={src} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
