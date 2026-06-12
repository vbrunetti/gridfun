import type { HomeCoverSection } from "@/content/home-sections";
import type { HeroSlate } from "@/content/hero-slates";
import { PrimaryHeroScrub } from "./primary-hero-scrub";

type PrimaryHeroProps = {
  slates: HeroSlate[];
  segmentVh?: number;
  /** Extra scroll past last slate; disable when cover sections are in the track. */
  scrollRelease?: boolean;
  /** Cover-flow sections after chapters — each gets a scroll slide and rail dot. */
  coverSections?: HomeCoverSection[];
};

export function PrimaryHero({
  slates,
  segmentVh = 70,
  scrollRelease = true,
  coverSections,
}: PrimaryHeroProps) {
  return (
    <section aria-label="Introduction" className="w-full">
      <PrimaryHeroScrub
        slates={slates}
        segmentVh={segmentVh}
        scrollRelease={scrollRelease}
        coverSections={coverSections}
      />
    </section>
  );
}
