import { Fragment } from "react";
import type { HeroSlate, HomeCoverSection } from "@/content/site";
import { normalizeHeroChapterPresets, HERO_SPARK_PRESETS } from "./spark-hero-config";
import {
  HomeCoverSentinel,
  HomeHeroChapterStop,
  HeroChapterPanel,
} from "./hero-chapter-panel";
import { HomeScroll } from "./home-scroll";
import { HomeSecondaryFixed } from "./home-secondary-fixed";
import { HomeSparkPin } from "./home-spark-pin";

type HomeSecondaryContent = {
  eyebrow: string;
  headline: string;
  subhead: string;
  cta: {
    href: string;
    label: string;
    screenReaderLabel: string;
  };
};

type PrimaryHeroProps = {
  slates: HeroSlate[];
  coverSections?: HomeCoverSection[];
  secondary?: HomeSecondaryContent;
};

export function PrimaryHero({
  slates,
  coverSections = [],
  secondary,
}: PrimaryHeroProps) {
  const slateCount = slates.length;
  const sparkPresets = normalizeHeroChapterPresets(HERO_SPARK_PRESETS, slateCount);

  if (slateCount === 0) return null;

  return (
    <HomeScroll
      slateCount={slateCount}
      coverSections={coverSections}
      hasSecondary={Boolean(secondary)}
    >
      <HomeSparkPin presets={sparkPresets} />

      {slates.map((slate, index) => {
        const isHandoffChapter = Boolean(secondary) && index === slateCount - 1;

        return (
          <Fragment key={slate.id}>
            {isHandoffChapter ? <HomeHeroChapterStop /> : null}
            <HeroChapterPanel
              slate={slate}
              chapterIndex={index}
              isHandoffChapter={isHandoffChapter}
            />
          </Fragment>
        );
      })}

      {secondary ? (
        <>
          <HomeCoverSentinel panelIndex={slateCount} />
          <HomeSecondaryFixed
            eyebrow={secondary.eyebrow}
            headline={secondary.headline}
            subhead={secondary.subhead}
            cta={secondary.cta}
            label={coverSections[0]?.label ?? "Selected work"}
          />
        </>
      ) : null}
    </HomeScroll>
  );
}
