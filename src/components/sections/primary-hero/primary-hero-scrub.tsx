"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { CtaButton } from "@/components/chrome/cta-button";
import { RuledGrid } from "@/components/layout/ruled-grid";
import type { HeroSlate } from "@/content/hero-slates";
import { useHeroScrubRegister } from "./hero-scrub-context";
import { NebulaCanvas } from "./nebula-canvas";

type PrimaryHeroScrubProps = {
  slates: HeroSlate[];
  /** Viewport-heights of scroll per slate (snap segment). */
  segmentVh?: number;
  /** Tail spacer after last slate; off when secondary cover is in the track. */
  scrollRelease?: boolean;
  /** Home secondary panel — in-track peek on all chapters, then scrolls over hero. */
  secondary?: ReactNode;
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
  segmentVh = 70,
  scrollRelease = true,
  secondary,
}: PrimaryHeroScrubProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const snappingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCovering, setIsCovering] = useState(false);
  const [isCoverSettled, setIsCoverSettled] = useState(false);
  const [dotsVisible, setDotsVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canvasPaused, setCanvasPaused] = useState(false);
  const rafScrollRef = useRef<number>(0);

  const slateCount = slates.length;
  const activeSlate = slates[activeIndex] ?? slates[0];

  const getTrackMetrics = useCallback(() => {
    const track = trackRef.current;
    if (!track) return null;

    const rect = track.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const trackHeight = track.offsetHeight;
    const viewport = window.innerHeight;
    const scrollable = Math.max(trackHeight - viewport, 0);

    return { trackTop, trackHeight, scrollable, trackBottom: trackTop + trackHeight };
  }, []);

  /** Hero chapters only — excludes secondary/cover so peek stays fixed until last chapter. */
  const getChapterMetrics = useCallback(() => {
    const track = trackRef.current;
    if (!track) return null;

    const rect = track.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const viewport = window.innerHeight;
    const peekPx = getHomeCoverPeekPx();
    const heroFlow = viewport - peekPx;
    const segmentPx = (segmentVh / 100) * viewport;
    const chapterLength = heroFlow + Math.max(0, slateCount - 1) * segmentPx;
    const scrollable = Math.max(chapterLength - viewport, 0);

    return {
      trackTop,
      chapterLength,
      scrollable,
      chapterEnd: trackTop + chapterLength,
      trackBottom: trackTop + track.offsetHeight,
    };
  }, [segmentVh, slateCount]);

  const getScrubMetrics = useCallback(() => {
    if (secondary) return getChapterMetrics();
    return getTrackMetrics();
  }, [getChapterMetrics, getTrackMetrics, secondary]);

  const getSnapOffsets = useCallback(() => {
    const metrics = getScrubMetrics();
    if (!metrics) return [];
    if (slateCount <= 1) return [metrics.trackTop];

    const { trackTop, scrollable } = metrics;
    return slates.map(
      (_, i) => trackTop + (i / (slateCount - 1)) * scrollable,
    );
  }, [getScrubMetrics, slateCount, slates]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const updateProgress = useCallback(() => {
    const metrics = getScrubMetrics();
    if (!metrics || reducedMotion) {
      setActiveIndex(0);
      return;
    }

    const { trackTop, scrollable } = metrics;
    if (scrollable <= 0) {
      setActiveIndex(0);
      return;
    }

    const raw = clamp((window.scrollY - trackTop) / scrollable, 0, 1);
    const index =
      slateCount <= 1 ? 0 : Math.round(raw * (slateCount - 1));
    setActiveIndex(clamp(index, 0, slateCount - 1));
  }, [getScrubMetrics, reducedMotion, slateCount]);

  const updateCoverPhase = useCallback(() => {
    if (!secondary || reducedMotion) {
      setIsCovering(false);
      return;
    }

    const chapter = getChapterMetrics();
    if (!chapter) {
      setIsCovering(false);
      return;
    }

    const offsets = getSnapOffsets();
    const lastOffset = offsets[offsets.length - 1];
    if (lastOffset === undefined) {
      setIsCovering(false);
      return;
    }

    const scrollY = window.scrollY;
    const raw = clamp((scrollY - chapter.trackTop) / chapter.scrollable, 0, 1);
    const index =
      slateCount <= 1 ? 0 : Math.round(raw * (slateCount - 1));
    const onLastChapter = index === slateCount - 1;

    setIsCovering(onLastChapter && scrollY > lastOffset + 16);
  }, [getChapterMetrics, getSnapOffsets, reducedMotion, secondary, slateCount]);

  /** End of cover scroll — secondary flush to viewport top (matches track layout). */
  const getMaxHomeScroll = useCallback(() => {
    const metrics = getTrackMetrics();
    if (!metrics) return null;
    return metrics.trackBottom - window.innerHeight;
  }, [getTrackMetrics]);

  const clampHomeScroll = useCallback(() => {
    if (!secondary || reducedMotion || snappingRef.current) return;

    const maxY = getMaxHomeScroll();
    if (maxY === null) return;

    if (window.scrollY > maxY + 1) {
      window.scrollTo({ top: maxY, behavior: "auto" });
    }
  }, [getMaxHomeScroll, reducedMotion, secondary]);

  const updateCoverSettled = useCallback(() => {
    if (!secondary || reducedMotion) {
      setIsCoverSettled(false);
      return;
    }

    const maxY = getMaxHomeScroll();
    if (maxY === null) {
      setIsCoverSettled(false);
      return;
    }

    setIsCoverSettled(window.scrollY >= maxY - 4);
  }, [getMaxHomeScroll, reducedMotion, secondary]);

  /** Drive fixed secondary top: peek band → flush viewport top over cover runway. */
  const updateSecondaryTop = useCallback(() => {
    const flow = trackRef.current?.closest(
      ".home-hero-cover-flow",
    ) as HTMLElement | null;
    if (!flow || !secondary || reducedMotion) {
      flow?.style.removeProperty("--home-secondary-top");
      return;
    }

    const chapter = getChapterMetrics();
    const track = getTrackMetrics();
    if (!chapter || !track) return;

    const viewport = window.innerHeight;
    const peekPx = getHomeCoverPeekPx();
    const scrollY = window.scrollY;
    const offsets = getSnapOffsets();
    const lastOffset = offsets[offsets.length - 1];
    if (lastOffset === undefined) return;

    const coverStart = lastOffset + 16;
    const coverEnd = track.trackBottom - viewport;
    const peekTop = viewport - peekPx;

    let topPx = peekTop;
    if (scrollY >= coverEnd - 2) {
      topPx = 0;
    } else if (scrollY > coverStart) {
      const runway = Math.max(coverEnd - coverStart, 1);
      const t = clamp((scrollY - coverStart) / runway, 0, 1);
      topPx = peekTop * (1 - t);
    }

    flow.style.setProperty("--home-secondary-top", `${topPx}px`);
  }, [getChapterMetrics, getSnapOffsets, getTrackMetrics, reducedMotion, secondary]);

  const isPastChapterScroll = useCallback(
    (scrollY: number) => {
      const chapter = getChapterMetrics();
      if (!chapter) return false;
      const offsets = getSnapOffsets();
      const lastOffset = offsets[offsets.length - 1];
      if (lastOffset === undefined) return false;
      const viewport = window.innerHeight;
      const exitThreshold = (segmentVh / 100) * viewport * 0.35;
      return scrollY > lastOffset + exitThreshold;
    },
    [getChapterMetrics, getSnapOffsets, segmentVh],
  );

  const updateDotsVisibility = useCallback(() => {
    if (reducedMotion) {
      setDotsVisible(false);
      return;
    }

    const metrics = getTrackMetrics();
    if (!metrics) {
      setDotsVisible(false);
      return;
    }

    const { trackTop, trackBottom } = metrics;
    const scrollY = window.scrollY;
    const viewport = window.innerHeight;

    if (scrollY + viewport > trackBottom + 8 || scrollY < trackTop - 8) {
      setDotsVisible(false);
      return;
    }

    const offsets = getSnapOffsets();
    const lastChapterOffset = offsets[offsets.length - 1];
    if (lastChapterOffset !== undefined && scrollY > lastChapterOffset + 24) {
      setDotsVisible(false);
      return;
    }

    setDotsVisible(true);
  }, [getSnapOffsets, getTrackMetrics, reducedMotion, secondary]);

  const snapToNearestSlate = useCallback(() => {
    if (reducedMotion || snappingRef.current) return;

    const metrics = getTrackMetrics();
    if (!metrics) return;

    const { trackTop, trackBottom } = metrics;
    const scrollY = window.scrollY;
    const viewport = window.innerHeight;

    // Past the hero track — do not pull back into a slate
    if (scrollY + viewport > trackBottom - 24) return;
    if (scrollY < trackTop - 24) return;

    if (secondary && isPastChapterScroll(scrollY)) return;

    const offsets = getSnapOffsets();
    if (offsets.length === 0) return;

    let nearest = 0;
    let minDist = Infinity;
    for (let i = 0; i < offsets.length; i++) {
      const dist = Math.abs(scrollY - offsets[i]!);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    }

    const targetY = offsets[nearest]!;
    if (minDist < 8) return;

    snappingRef.current = true;
    window.scrollTo({ top: targetY, behavior: "smooth" });
    window.setTimeout(() => {
      snappingRef.current = false;
    }, 400);
  }, [
    getSnapOffsets,
    getTrackMetrics,
    isPastChapterScroll,
    reducedMotion,
    secondary,
  ]);

  const scrollToSlate = useCallback(
    (index: number) => {
      const clamped = clamp(index, 0, slateCount - 1);
      setActiveIndex(clamped);

      if (reducedMotion) return;

      const offsets = getSnapOffsets();
      const targetY = offsets[clamped];
      if (targetY === undefined) return;

      if (secondary) {
        setIsCovering(false);
        setIsCoverSettled(false);
      }

      snappingRef.current = true;

      const releaseSnapLock = () => {
        snappingRef.current = false;
        setActiveIndex(clamped);
      };

      const onScrollEnd = () => {
        window.removeEventListener("scrollend", onScrollEnd);
        window.clearTimeout(fallbackId);
        releaseSnapLock();
      };
      window.addEventListener("scrollend", onScrollEnd);

      const fallbackId = window.setTimeout(() => {
        window.removeEventListener("scrollend", onScrollEnd);
        releaseSnapLock();
      }, 1200);

      window.scrollTo({ top: targetY, behavior: "smooth" });
    },
    [getSnapOffsets, reducedMotion, secondary, slateCount],
  );

  useHeroScrubRegister(
    !reducedMotion && slateCount > 1 && Boolean(secondary),
    slates,
    activeIndex,
    scrollToSlate,
    dotsVisible,
  );

  useEffect(() => {
    if (reducedMotion) return;

    const onScroll = () => {
      if (rafScrollRef.current) return;
      rafScrollRef.current = requestAnimationFrame(() => {
        rafScrollRef.current = 0;
        updateProgress();
        updateCoverPhase();
        updateCoverSettled();
        updateSecondaryTop();
        clampHomeScroll();
        updateDotsVisibility();
      });
    };

    updateProgress();
    updateCoverPhase();
    updateCoverSettled();
    updateSecondaryTop();
    clampHomeScroll();
    updateDotsVisibility();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const onScrollEnd = () => snapToNearestSlate();
    window.addEventListener("scrollend", onScrollEnd);

    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const onScrollIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(onScrollEnd, 120);
    };
    window.addEventListener("scroll", onScrollIdle, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("scroll", onScrollIdle);
      clearTimeout(idleTimer);
      if (rafScrollRef.current) cancelAnimationFrame(rafScrollRef.current);
    };
  }, [
    reducedMotion,
    snapToNearestSlate,
    clampHomeScroll,
    updateCoverPhase,
    updateCoverSettled,
    updateSecondaryTop,
    updateDotsVisibility,
    updateProgress,
  ]);

  useEffect(() => {
    const flow = trackRef.current?.closest(".home-hero-cover-flow");
    if (!flow) return;
    flow.classList.toggle("home-secondary-covering", isCovering);
    flow.classList.toggle("home-secondary-settled", isCoverSettled);
    return () => {
      flow.classList.remove("home-secondary-covering");
      flow.classList.remove("home-secondary-settled");
    };
  }, [isCovering, isCoverSettled]);

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

  const easedIntensity = reducedMotion
    ? 0.35
    : slateCount <= 1
      ? 0
      : Math.pow(activeIndex / (slateCount - 1), 1.4);

  return (
    <div
      ref={trackRef}
      className="primary-hero-track theme-light w-full border-b border-[var(--rule-strong)]"
      style={{ "--hero-segment-vh": segmentVh } as CSSProperties}
    >
      <div className="primary-hero-sticky relative w-full overflow-hidden">
        <NebulaCanvas
          intensity={easedIntensity}
          paused={canvasPaused}
          reducedMotion={reducedMotion}
        />

        <div className="primary-hero-copy">
          <RuledGrid className="w-full">
            <div className="col-span-hero">
              <h1 className="sr-only">{activeSlate.headline}</h1>
              <div aria-live="polite" aria-atomic="true">
                {activeSlate.eyebrow ? (
                  <p className="text-meta">{activeSlate.eyebrow}</p>
                ) : null}
                <p className="display-xl mt-4 max-w-3xl" aria-hidden>
                  {activeSlate.headline}
                </p>
                {activeSlate.supporting ? (
                  <p className="mt-6 max-w-lg leading-relaxed text-secondary">
                    {activeSlate.supporting}
                  </p>
                ) : null}
              </div>

              {activeIndex === 0 || reducedMotion ? (
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <CtaButton href="/work">View work</CtaButton>
                  <CtaButton href="/about" variant="ghost">
                    About
                  </CtaButton>
                </div>
              ) : null}

              {!reducedMotion ? (
                <p className="text-meta mt-12">(Scroll)</p>
              ) : null}
            </div>
          </RuledGrid>
        </div>
      </div>

      {!reducedMotion && slateCount > 1
        ? slates.slice(1).map((slate, segmentIndex) => (
            <div
              key={`scroll-${slate.id}`}
              ref={(element) => {
                segmentRefs.current[segmentIndex] = element;
              }}
              className="primary-hero-scroll-segment"
              aria-hidden
            />
          ))
        : null}

      {secondary ? (
        <div className="home-cover-stage" aria-hidden={reducedMotion}>
          <div className="home-secondary-slot">{secondary}</div>
        </div>
      ) : null}

      {!reducedMotion && scrollRelease && !secondary ? (
        <div className="primary-hero-scroll-release" aria-hidden />
      ) : null}
    </div>
  );
}
