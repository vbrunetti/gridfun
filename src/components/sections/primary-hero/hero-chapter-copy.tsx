import type { HeroSlate } from "@/content/hero-slates";

export type ChapterBlend = {
  from: number;
  to: number;
  /** 0–1 blend from → to within the current chapter pair */
  t: number;
};

type HeroChapterCopyProps = {
  slates: HeroSlate[];
  blend: ChapterBlend;
  /** Pixels to travel during crossfade (scroll-driven, not CSS transition) */
  shiftPx?: number;
};

function SlateBlock({ slate }: { slate: HeroSlate }) {
  return (
    <>
      {slate.eyebrow ? <p className="text-meta">{slate.eyebrow}</p> : null}
      <p className="display-xl mt-4 max-w-3xl">{slate.headline}</p>
      {slate.supporting ? (
        <p className="mt-6 max-w-lg leading-relaxed text-secondary">
          {slate.supporting}
        </p>
      ) : null}
    </>
  );
}

function getHeroChapterShiftPx() {
  if (typeof document === "undefined") return 72;
  const rootFont =
    Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--hero-chapter-shift")
    .trim();
  const match = raw.match(/^([\d.]+)rem$/);
  if (match) return Number.parseFloat(match[1]!) * rootFont;
  return 72;
}

export function HeroChapterCopy({
  slates,
  blend,
  shiftPx = getHeroChapterShiftPx(),
}: HeroChapterCopyProps) {
  const fromSlate = slates[blend.from] ?? slates[0]!;
  const toSlate = slates[blend.to] ?? fromSlate;
  const crossfading = blend.from !== blend.to && blend.t > 0;
  const forward = blend.to > blend.from;
  const fadeT = blend.t;

  const outgoingY = forward ? -fadeT * shiftPx : fadeT * shiftPx;
  const incomingY = forward ? (1 - fadeT) * shiftPx : -(1 - fadeT) * shiftPx;

  const announced =
    crossfading && fadeT >= 0.5 ? toSlate.headline : fromSlate.headline;

  return (
    <>
      <h1 className="sr-only">{announced}</h1>
      <div className="primary-hero-chapters">
        <div
          className="primary-hero-chapter-layer"
          style={{
            opacity: crossfading ? 1 - fadeT : 1,
            transform: crossfading ? `translateY(${outgoingY}px)` : undefined,
            zIndex: fadeT < 0.5 ? 2 : 1,
          }}
        >
          <SlateBlock slate={fromSlate} />
        </div>
        {crossfading ? (
          <div
            className="primary-hero-chapter-layer"
            style={{
              opacity: fadeT,
              transform: `translateY(${incomingY}px)`,
              zIndex: fadeT >= 0.5 ? 2 : 1,
            }}
          >
            <SlateBlock slate={toSlate} />
          </div>
        ) : null}
      </div>
    </>
  );
}
