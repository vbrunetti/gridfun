import type { HeroSlate } from "@/content/site";

type HeroSlateCopyProps = {
  slate: HeroSlate;
  /** First chapter uses `<h1>` for the page title. */
  isFirstChapter?: boolean;
};

export function HeroSlateCopy({ slate, isFirstChapter = false }: HeroSlateCopyProps) {
  const HeadlineTag = isFirstChapter ? "h1" : "h2";

  return (
    <div className="home-beat">
      {slate.eyebrow ? (
        <p className="home-beat__eyebrow text-meta">{slate.eyebrow}</p>
      ) : null}
      <HeadlineTag className="display-xl home-beat__headline">{slate.headline}</HeadlineTag>
      {slate.supporting ? (
        <p className="home-beat__subhead body-lg text-secondary">{slate.supporting}</p>
      ) : null}
    </div>
  );
}
