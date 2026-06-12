import type { CSSProperties } from "react";
import type { CaseStudyHeroVideo as CaseStudyHeroVideoConfig } from "@/content/portfolio";

type CaseStudyHeroVideoProps = CaseStudyHeroVideoConfig;

export function CaseStudyHeroVideo({
  src,
  opacity = 0.3,
  poster,
}: CaseStudyHeroVideoProps) {
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
      <video autoPlay loop muted playsInline preload="auto" poster={poster}>
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
