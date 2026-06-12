"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { presetsForChapterCount } from "./particle-presets";
import { HERO_SPARK_COLOR, HERO_SPARK_PRESETS, HERO_SPARK_SHAPE_SCALE } from "./spark-hero-config";
import { SparkCanvas, type SparkBlend } from "./spark-canvas";
import { CtaButton } from "@/components/chrome/cta-button";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";
import type { HomeCoverSection } from "@/content/home-sections";
import type { HeroSlate } from "@/content/hero-slates";
import {
  HeroChapterCopy,
  type ChapterBlend,
} from "./hero-chapter-copy";
import {
  useHeroScrubRegister,
  useHeroSubChapterProgressRegister,
  type HeroSubChapterProgress,
  type HomeScrollStep,
} from "./hero-scrub-context";

type PrimaryHeroScrubProps = {
  slates: HeroSlate[];
  /** Viewport-heights of scroll per slate (snap segment). */
  segmentVh?: number;
  /** Tail spacer after last slate; off when cover sections are in the track. */
  scrollRelease?: boolean;
  /** Cover-flow sections after chapters — each gets a scroll slide and rail dot. */
  coverSections?: HomeCoverSection[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getHomeCoverPeekPx() {
  const rootFont =
    Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--home-cover-peek")
    .trim();
  const match = raw.match(/^([\d.]+)rem$/);
  if (match) return Number.parseFloat(match[1]!) * rootFont;
  if (raw === "0" || raw === "0px") return 0;
  return 4.5 * rootFont;
}

function buildHomeScrollSteps(
  slateCount: number,
  coverSections: HomeCoverSection[],
): HomeScrollStep[] {
  const hero: HomeScrollStep = {
    id: "home-hero",
    kind: "hero",
    label: "Home",
    subChapterCount: slateCount,
  };

  const sections: HomeScrollStep[] = coverSections.map((section) => ({
    id: section.id,
    kind: "section",
    label: section.label,
  }));

  return [hero, ...sections];
}

export function PrimaryHeroScrub({
  slates,
  scrollRelease = true,
  coverSections = [],
}: PrimaryHeroScrubProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [chapterBlend, setChapterBlend] = useState<ChapterBlend>({
    from: 0,
    to: 0,
    t: 0,
  });
  const [subChapterProgress, setSubChapterProgress] =
    useState<HeroSubChapterProgress | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canvasPaused, setCanvasPaused] = useState(false);
  const rafScrollRef = useRef<number>(0);

  const slateCount = slates.length;
  const sectionCount = coverSections.length;
  const hasCoverFlow = sectionCount > 0;

  const scrollSteps = useMemo(
    () => buildHomeScrollSteps(slateCount, coverSections),
    [slateCount, coverSections],
  );

  const sparkPresets = useMemo(() => {
    if (slateCount === HERO_SPARK_PRESETS.length) return HERO_SPARK_PRESETS;
    return presetsForChapterCount(Math.max(slateCount, 1));
  }, [slateCount]);

  const sparkBlend: SparkBlend = useMemo(
    () => ({
      from: chapterBlend.from,
      to: slateCount <= 1 ? chapterBlend.from : chapterBlend.to,
      t:
        slateCount <= 1 ||
        chapterBlend.from === chapterBlend.to
          ? 0
          : chapterBlend.t,
    }),
    [chapterBlend, slateCount],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const updateFromScroll = useCallback(() => {
    const container = containerRef.current;
    const flow = trackRef.current?.closest(
      ".home-hero-cover-flow",
    ) as HTMLElement | null;

    if (!container || reducedMotion) {
      setActiveStep(0);
      setChapterBlend({ from: 0, to: 0, t: 0 });
      setSubChapterProgress(null);
      flow?.style.removeProperty("--home-secondary-translate");
      flow?.classList.remove("home-secondary-covering", "home-secondary-settled");
      return;
    }

    const slideHeight =
      trackRef.current?.clientHeight ?? container.clientHeight;
    if (slideHeight <= 0 || slateCount <= 0) return;

    const scrollTop = container.scrollTop;
    const rawSlide = scrollTop / slideHeight;

    const coverStart = Math.max((slateCount - 1) * slideHeight, 0);
    const coverEnd = (slateCount + sectionCount) * slideHeight;
    const inCoverPhase = hasCoverFlow && scrollTop >= coverStart - 1;
    const coverProgress = inCoverPhase
      ? clamp((scrollTop - coverStart) / slideHeight, 0, sectionCount)
      : 0;
    const coverSettled = scrollTop >= coverEnd - 4;

    const stepIndex =
      rawSlide >= slateCount
        ? 1 + clamp(Math.floor(rawSlide - slateCount), 0, sectionCount - 1)
        : 0;
    setActiveStep(stepIndex);

    const rawChapter = clamp(rawSlide, 0, slateCount - 1);
    const from = clamp(Math.floor(rawChapter), 0, slateCount - 1);
    const to = clamp(from + 1, 0, slateCount - 1);
    const t = slateCount <= 1 ? 0 : rawChapter - from;

    setChapterBlend(
      inCoverPhase || slateCount <= 1
        ? {
            from: slateCount <= 1 ? 0 : slateCount - 1,
            to: slateCount <= 1 ? 0 : slateCount - 1,
            t: 0,
          }
        : { from, to: Math.min(to, slateCount - 1), t },
    );

    if (rawSlide < slateCount && slateCount > 0) {
      setSubChapterProgress({
        progress: clamp((rawSlide + 1) / slateCount, 0, 1),
      });
    } else {
      setSubChapterProgress(null);
    }

    if (hasCoverFlow && flow) {
      const peekPx = getHomeCoverPeekPx();
      const eased = clamp(coverProgress * 1.25, 0, 1);
      const fullyCovered = coverSettled || coverProgress >= 0.85;

      if (inCoverPhase && !fullyCovered) {
        flow.style.setProperty(
          "--home-secondary-translate",
          `calc((1 - ${eased}) * (100dvh - ${peekPx}px))`,
        );
        flow.classList.add("home-secondary-covering");
        flow.classList.remove("home-secondary-settled");
      } else if (fullyCovered) {
        flow.style.setProperty("--home-secondary-translate", "0px");
        flow.classList.add("home-secondary-covering");
        flow.classList.toggle("home-secondary-settled", coverSettled);
      } else {
        flow.style.setProperty(
          "--home-secondary-translate",
          `calc(100dvh - ${peekPx}px)`,
        );
        flow.classList.remove("home-secondary-covering", "home-secondary-settled");
      }
    }
  }, [hasCoverFlow, reducedMotion, scrollSteps, sectionCount, slateCount]);

  useEffect(() => {
    if (reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      if (rafScrollRef.current) return;
      rafScrollRef.current = requestAnimationFrame(() => {
        rafScrollRef.current = 0;
        updateFromScroll();
      });
    };

    updateFromScroll();
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafScrollRef.current) cancelAnimationFrame(rafScrollRef.current);
    };
  }, [reducedMotion, updateFromScroll]);

  const scrollToStep = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container || reducedMotion) return;

      const step = scrollSteps[index];
      if (!step) return;

      let slideIndex = 0;
      if (step.kind === "hero") {
        slideIndex = 0;
      } else {
        const sectionIdx = coverSections.findIndex((s) => s.id === step.id);
        slideIndex = slateCount + Math.max(sectionIdx, 0);
      }

      const slideHeight =
        trackRef.current?.clientHeight ?? container.clientHeight;
      container.scrollTo({
        top: slideIndex * slideHeight,
        behavior: "smooth",
      });
    },
    [coverSections, reducedMotion, scrollSteps, slateCount],
  );

  useHeroScrubRegister(
    !reducedMotion && scrollSteps.length > 1,
    scrollSteps,
    activeStep,
    scrollToStep,
    !reducedMotion,
  );

  useHeroSubChapterProgressRegister(subChapterProgress);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const io = new IntersectionObserver(
      ([entry]) => setCanvasPaused(!entry.isIntersecting),
      { rootMargin: "100px 0px" },
    );
    io.observe(track);
    return () => io.disconnect();
  }, []);

  const slideCount =
    reducedMotion || slateCount <= 1
      ? 0
      : slateCount + sectionCount + (!hasCoverFlow && scrollRelease ? 1 : 0);

  const showChapterCtas =
    !reducedMotion &&
    chapterBlend.from === 0 &&
    chapterBlend.to === 0 &&
    chapterBlend.t === 0;

  return (
    <div
      ref={trackRef}
      className="primary-hero-track theme-light keyline-b w-full"
      data-chrome-surface="light"
    >
      {!reducedMotion && slideCount > 0 ? (
        <div ref={containerRef} className="hero-chapters-container">
          {slates.map((slate) => (
            <div key={slate.id} className="hero-chapter-slide" aria-hidden />
          ))}
          {coverSections.map((section) => (
            <div
              key={section.id}
              className="hero-chapter-slide hero-cover-slide"
              aria-hidden
            />
          ))}
          {!hasCoverFlow && scrollRelease ? (
            <div className="hero-chapter-slide hero-scroll-release-slide" aria-hidden />
          ) : null}
        </div>
      ) : null}

      <div className="primary-hero-sticky">
        <RuledGrid className="primary-hero-stage h-full">
          <SiteGridSubgrid className="primary-hero-stage-row h-full items-center">
            <div className="primary-hero-copy grid-span-6 lg:grid-span-5">
              <HeroChapterCopy
                slates={slates}
                blend={
                  reducedMotion
                    ? { from: 0, to: 0, t: 0 }
                    : chapterBlend
                }
              />

              {reducedMotion ? (
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <CtaButton href="/case-studies">View case studies</CtaButton>
                  <CtaButton href="/about" variant="ghost">
                    About
                  </CtaButton>
                </div>
              ) : null}
            </div>

            <div className="primary-hero-spark-layer grid-span-6 lg:col-start-7 lg:grid-span-6">
              <SparkCanvas
                presets={sparkPresets}
                blend={sparkBlend}
                paused={canvasPaused}
                showBoundary={false}
                shapeScale={HERO_SPARK_SHAPE_SCALE}
                {...HERO_SPARK_COLOR}
              />
            </div>
          </SiteGridSubgrid>
        </RuledGrid>
      </div>

      {showChapterCtas ? (
        <div className="hero-chapter-cta-layer">
          <RuledGrid className="primary-hero-stage h-full">
            <SiteGridSubgrid className="primary-hero-stage-row h-full items-center">
              <div className="primary-hero-copy grid-span-6 lg:grid-span-5">
                <div className="invisible" aria-hidden>
                  <HeroChapterCopy
                    slates={slates}
                    blend={{ from: 0, to: 0, t: 0 }}
                  />
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <CtaButton href="/case-studies">View case studies</CtaButton>
                  <CtaButton href="/about" variant="ghost">
                    About
                  </CtaButton>
                </div>
              </div>
            </SiteGridSubgrid>
          </RuledGrid>
        </div>
      ) : null}
    </div>
  );
}
