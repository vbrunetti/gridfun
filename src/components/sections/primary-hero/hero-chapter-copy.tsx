import type { ReactNode } from "react";
import type { HeroSlate } from "@/content/site";

type HeroSlateCopyProps = {
  slate: HeroSlate;
  /** First chapter uses `<h1>` for the page title. */
  isFirstChapter?: boolean;
  /** Rendered after the subhead inside the beat stack. */
  afterSubhead?: ReactNode;
};

export function HeroSlateCopy({
  slate,
  isFirstChapter = false,
  afterSubhead,
}: HeroSlateCopyProps) {
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
      {afterSubhead}
    </div>
  );
}
