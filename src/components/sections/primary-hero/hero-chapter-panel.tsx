import { Fragment } from "react";
import { RuledGrid } from "@/components/layout/ruled-grid";
import type { HeroSlate } from "@/content/site";
import { HeroSlateCopy } from "./hero-chapter-copy";

type HeroChapterPanelProps = {
  slate: HeroSlate;
  chapterIndex: number;
  /** Last hero chapter — free scroll into secondary handoff (no snap to chapter top). */
  isHandoffChapter?: boolean;
};

export function HeroChapterPanel({
  slate,
  chapterIndex,
  isHandoffChapter = false,
}: HeroChapterPanelProps) {
  return (
    <section
      id={chapterIndex === 0 ? "home-hero" : undefined}
      data-home-panel={chapterIndex}
      className={`home-scroll-panel hero-chapter-panel chrome-focus-target theme-dark-lift w-full${isHandoffChapter ? " home-scroll-panel--handoff" : ""}`}
      data-chrome-surface="dark"
      aria-label={`Introduction, statement ${chapterIndex + 1}`}
    >
      <RuledGrid className="primary-hero-stage primary-hero-stage--split-scene h-full">
        <div className="primary-hero-copy col-1-to-end lg:grid-span-8">
          <HeroSlateCopy slate={slate} isFirstChapter={chapterIndex === 0} />
        </div>
      </RuledGrid>
    </section>
  );
}

/** Snap anchor at the last hero chapter boundary — stops scroll without blocking handoff motion. */
export function HomeHeroChapterStop() {
  return (
    <div
      className="home-scroll-panel home-hero-chapter-stop"
      aria-hidden
    />
  );
}

/** Scroll runway — full viewport step to slide the fixed secondary into view. */
export function HomeCoverSentinel({ panelIndex }: { panelIndex: number }) {
  return (
    <div
      data-home-panel={panelIndex}
      className="home-scroll-panel home-cover-sentinel"
      aria-hidden
    />
  );
}
