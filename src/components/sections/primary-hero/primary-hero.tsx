import type { HeroSlate } from "@/content/hero-slates";
import { PrimaryHeroScrub } from "./primary-hero-scrub";

type PrimaryHeroProps = {
  slates: HeroSlate[];
  segmentVh?: number;
  /** Extra scroll past last slate; disable when secondary cover is in the track. */
  scrollRelease?: boolean;
  /** Home secondary cover slide — panel lives in page layout, not inside the track. */
  secondaryCover?: boolean;
};

export function PrimaryHero({
  slates,
  segmentVh = 70,
  scrollRelease = true,
  secondaryCover,
}: PrimaryHeroProps) {
  return (
    <section aria-label="Introduction" className="w-full">
      <PrimaryHeroScrub
        slates={slates}
        segmentVh={segmentVh}
        scrollRelease={scrollRelease}
        secondaryCover={secondaryCover}
      />
    </section>
  );
}
