import type { HeroSlate, HomeCoverSection } from "@/content/site";
import { presetsForChapterCount } from "./particle-presets";
import { HERO_SPARK_PRESETS } from "./spark-hero-config";
import { HomeCoverSentinel, HeroChapterPanel } from "./hero-chapter-panel";
import { HomeScroll } from "./home-scroll";
import { HomeSecondaryFixed } from "./home-secondary-fixed";
import { HomeSparkPin } from "./home-spark-pin";

type HomeSecondaryContent = {
  eyebrow: string;
  headline: string;
  subhead: string;
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
  const sparkPresets =
    slateCount === HERO_SPARK_PRESETS.length
      ? HERO_SPARK_PRESETS
      : presetsForChapterCount(Math.max(slateCount, 1));

  if (slateCount === 0) return null;

  return (
    <HomeScroll
      slateCount={slateCount}
      coverSections={coverSections}
      hasSecondary={Boolean(secondary)}
    >
      <HomeSparkPin presets={sparkPresets} />

      {slates.map((slate, index) => (
        <HeroChapterPanel
          key={slate.id}
          slate={slate}
          chapterIndex={index}
          isHandoffChapter={Boolean(secondary) && index === slateCount - 1}
        />
      ))}

      {secondary ? (
        <>
          <HomeCoverSentinel panelIndex={slateCount} />
          <HomeSecondaryFixed
            eyebrow={secondary.eyebrow}
            headline={secondary.headline}
            subhead={secondary.subhead}
            label={coverSections[0]?.label ?? "Selected work"}
          />
        </>
      ) : null}
    </HomeScroll>
  );
}
