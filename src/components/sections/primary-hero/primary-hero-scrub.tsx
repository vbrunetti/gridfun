"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  GravityClusterCanvas,
  type GravityClusterBlend,
} from "@/components/effects/gravity-cluster-canvas";
import {
  buildChapterPresets,
  resolveClusterParams,
} from "@/components/effects/gravity-cluster-presets";
import { CtaButton } from "@/components/chrome/cta-button";
import { RuledGrid } from "@/components/layout/ruled-grid";
import type { HeroSlate } from "@/content/hero-slates";
import {
  HeroChapterCopy,
  type ChapterBlend,
} from "./hero-chapter-copy";
import { useHeroScrubRegister } from "./hero-scrub-context";

type PrimaryHeroScrubProps = {
  slates: HeroSlate[];
  /** Viewport-heights of scroll per slate (snap segment). */
  segmentVh?: number;
  /** Tail spacer after last slate; off when secondary cover is in the track. */
  scrollRelease?: boolean;
  /** Home secondary cover slide — panel is a sibling in .home-hero-cover-flow. */
  secondaryCover?: boolean;
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

export function PrimaryHeroScrub({
  slates,
  scrollRelease = true,
  secondaryCover,
}: PrimaryHeroScrubProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [chapterBlend, setChapterBlend] = useState<ChapterBlend>({
    from: 0,
    to: 0,
    t: 0,
  });
  const [chapterProgress, setChapterProgress] = useState(0);
  const [dotsVisible, setDotsVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canvasPaused, setCanvasPaused] = useState(false);
  const rafScrollRef = useRef<number>(0);

  const slateCount = slates.length;

  const gravityPresets = useMemo(
    () => buildChapterPresets(Math.max(slateCount, 1)),
    [slateCount],
  );

  const gravityBlend: GravityClusterBlend = useMemo(
    () => ({
      chapterProgress,
      from: chapterBlend.from,
      to: slateCount <= 1 ? chapterBlend.from : chapterBlend.to,
      t:
        slateCount <= 1 ||
        chapterBlend.from === chapterBlend.to
          ? 0
          : chapterBlend.t,
    }),
    [chapterBlend, chapterProgress, slateCount],
  );

  const gravityLiveParams = useMemo(() => {
    const safeFrom = clamp(chapterBlend.from, 0, gravityPresets.length - 1);
    const safeTo = clamp(gravityBlend.to, 0, gravityPresets.length - 1);
    const stepT =
      gravityPresets.length <= 1 || safeFrom === safeTo ? 0 : gravityBlend.t;
    const a = gravityPresets[safeFrom] ?? gravityPresets[0]!;
    const b = gravityPresets[safeTo] ?? a;
    return resolveClusterParams(a, b, stepT);
  }, [gravityBlend, gravityPresets]);

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
      setActiveIndex(0);
      setChapterProgress(0);
      setChapterBlend({ from: 0, to: 0, t: 0 });
      setDotsVisible(false);
      flow?.style.removeProperty("--home-secondary-translate");
      flow?.classList.remove("home-secondary-covering", "home-secondary-settled");
      return;
    }

    const slideHeight =
      trackRef.current?.clientHeight ?? container.clientHeight;
    if (slideHeight <= 0 || slateCount <= 0) return;

    const scrollTop = container.scrollTop;
    const chapterSlideCount = slateCount;

    const chapterScrollMax = Math.max((chapterSlideCount - 1) * slideHeight, 0);
    const coverStart = Math.max((chapterSlideCount - 1) * slideHeight, 0);
    const coverEnd = chapterSlideCount * slideHeight;
    const rawChapter = clamp(scrollTop / slideHeight, 0, chapterSlideCount - 1);
    const from = clamp(Math.floor(rawChapter), 0, slateCount - 1);
    const to = clamp(from + 1, 0, slateCount - 1);
    const t = slateCount <= 1 ? 0 : rawChapter - from;

    const inCoverPhase =
      secondaryCover && scrollTop >= coverStart - 1;
    const coverProgress = inCoverPhase
      ? clamp((scrollTop - coverStart) / slideHeight, 0, 1)
      : 0;
    const coverSettled = scrollTop >= coverEnd - 4;

    setActiveIndex(
      inCoverPhase
        ? slateCount - 1
        : clamp(Math.round(rawChapter), 0, slateCount - 1),
    );
    setChapterProgress(inCoverPhase ? slateCount - 1 : rawChapter);
    setChapterBlend(
      inCoverPhase || slateCount <= 1
        ? {
            from: slateCount <= 1 ? 0 : slateCount - 1,
            to: slateCount <= 1 ? 0 : slateCount - 1,
            t: 0,
          }
        : { from, to: Math.min(to, slateCount - 1), t },
    );

    setDotsVisible(!coverSettled && scrollTop <= chapterScrollMax + 24);

    if (secondaryCover && flow) {
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
  }, [reducedMotion, secondaryCover, slateCount]);

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

  const scrollToSlate = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container || reducedMotion) return;

      const clamped = clamp(index, 0, slateCount - 1);
      const slideHeight =
        trackRef.current?.clientHeight ?? container.clientHeight;
      container.scrollTo({
        top: clamped * slideHeight,
        behavior: "smooth",
      });
    },
    [reducedMotion, slateCount],
  );

  useHeroScrubRegister(
    !reducedMotion && slateCount > 1 && Boolean(secondaryCover),
    slates,
    activeIndex,
    scrollToSlate,
    dotsVisible,
  );

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
      : slateCount + (secondaryCover ? 1 : scrollRelease ? 1 : 0);

  return (
    <div
      ref={trackRef}
      className="primary-hero-track theme-light w-full border-b border-[var(--rule-strong)]"
    >
      {!reducedMotion && slideCount > 0 ? (
        <div ref={containerRef} className="hero-chapters-container">
          {slates.map((slate) => (
            <div key={slate.id} className="hero-chapter-slide" aria-hidden />
          ))}
          {secondaryCover ? (
            <div className="hero-chapter-slide hero-cover-slide" aria-hidden />
          ) : null}
          {!secondaryCover && scrollRelease ? (
            <div className="hero-chapter-slide hero-scroll-release-slide" aria-hidden />
          ) : null}
        </div>
      ) : null}

      <div className="primary-hero-sticky relative w-full overflow-hidden">
        <GravityClusterCanvas
          presets={gravityPresets}
          params={gravityLiveParams}
          blend={gravityBlend}
          paused={canvasPaused}
          showOutline={false}
        />

        <div className="primary-hero-copy">
          <RuledGrid className="w-full">
            <div className="col-span-hero">
              <HeroChapterCopy
                slates={slates}
                blend={
                  reducedMotion
                    ? { from: activeIndex, to: activeIndex, t: 0 }
                    : chapterBlend
                }
              />

              {reducedMotion ? (
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <CtaButton href="/work">View work</CtaButton>
                  <CtaButton href="/about" variant="ghost">
                    About
                  </CtaButton>
                </div>
              ) : null}
            </div>
          </RuledGrid>
        </div>
      </div>

      {activeIndex === 0 && !reducedMotion ? (
        <div className="hero-chapter-cta-layer">
          <RuledGrid className="w-full">
            <div className="col-span-hero">
              <div className="invisible" aria-hidden>
                <HeroChapterCopy
                  slates={slates}
                  blend={{ from: 0, to: 0, t: 0 }}
                />
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <CtaButton href="/work">View work</CtaButton>
                <CtaButton href="/about" variant="ghost">
                  About
                </CtaButton>
              </div>
            </div>
          </RuledGrid>
        </div>
      ) : null}
    </div>
  );
}
