import type { ReactNode } from "react";
import type { HeroSlate } from "@/content/hero-slates";
import { PrimaryHeroScrub } from "./primary-hero-scrub";

type PrimaryHeroProps = {
  slates: HeroSlate[];
  segmentVh?: number;
  /** Extra scroll past last slate; disable when secondary cover is in the track. */
  scrollRelease?: boolean;
  /** Home secondary — rendered in-track so it peeks on every chapter, then covers the hero. */
  secondary?: ReactNode;
};

export function PrimaryHero({
  slates,
  segmentVh = 70,
  scrollRelease = true,
  secondary,
}: PrimaryHeroProps) {
  return (
    <section aria-label="Introduction" className="w-full">
      <PrimaryHeroScrub
        slates={slates}
        segmentVh={segmentVh}
        scrollRelease={scrollRelease}
        secondary={secondary}
      />
    </section>
  );
}
