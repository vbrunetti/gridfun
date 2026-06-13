"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { HomeCoverSection } from "@/content/site";
import type { SparkBlend } from "./spark-canvas";
import {
  HomeScrollVisualProvider,
  type HomeScrollVisualState,
} from "./home-scroll-visual-context";
import {
  useHeroScrubRegister,
  useHeroSubChapterProgressRegister,
  type HeroSubChapterProgress,
  type HomeScrollStep,
} from "./hero-scrub-context";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function chromeAnchorY(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--chrome-top-offset",
  );
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 64;
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

type HomeScrollProps = {
  slateCount: number;
  coverSections: HomeCoverSection[];
  hasSecondary: boolean;
  children: ReactNode;
};

/**
 * Document scroll-snap for home hero panels. JS tracks active panel for dots,
 * chrome focus, sticky spark blend, and fixed secondary translate.
 */
export function HomeScroll({
  slateCount,
  coverSections,
  hasSecondary,
  children,
}: HomeScrollProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const [activePanel, setActivePanel] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [subChapterProgress, setSubChapterProgressState] =
    useState<HeroSubChapterProgress | null>(null);
  const [dotsVisible, setDotsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visualState, setVisualState] = useState<HomeScrollVisualState>({
    activeChapter: 0,
    sparkBlend: { from: 0, to: 0, t: 0 },
    sparkPaused: false,
  });

  const scrollSteps = useMemo(
    () => buildHomeScrollSteps(slateCount, coverSections),
    [coverSections, slateCount],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const getPanels = useCallback(() => {
    const root = rootRef.current;
    if (!root) return [];

    return Array.from(
      root.querySelectorAll<HTMLElement>("[data-home-panel]"),
    ).sort(
      (a, b) =>
        Number(a.dataset.homePanel ?? 0) - Number(b.dataset.homePanel ?? 0),
    );
  }, []);

  const syncFromScroll = useCallback(() => {
    const root = rootRef.current;
    const panels = getPanels();
    if (!root || panels.length === 0) return;

    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const anchor = desktop ? 8 : chromeAnchorY() + 8;

    let best = 0;
    for (let i = 0; i < panels.length; i++) {
      if (panels[i]!.getBoundingClientRect().top <= anchor) best = i;
    }

    setActivePanel(best);

    const heroPanelCount = Math.min(slateCount, panels.length);
    const lastHeroIndex = Math.max(heroPanelCount - 1, 0);
    const onHero = best < slateCount;
    const onCover = hasSecondary && best >= slateCount;

    if (onHero) {
      setActiveStep(0);
      setSubChapterProgressState({
        progress: (best + 1) / Math.max(slateCount, 1),
      });
    } else if (onCover) {
      setActiveStep(Math.min(best - slateCount + 1, coverSections.length));
      setSubChapterProgressState(null);
    }

    const heroPanels = panels.slice(0, slateCount);
    let sparkBlend: SparkBlend = { from: 0, to: 0, t: 0 };

    if (heroPanels.length > 0 && slateCount > 0 && best < slateCount) {
      const anchorAbs = window.scrollY + anchor;
      let from = 0;
      let t = 0;

      for (let i = 0; i < heroPanels.length; i++) {
        const panel = heroPanels[i]!;
        const top = panel.offsetTop;
        const height = panel.offsetHeight || 1;
        const nextTop =
          i + 1 < heroPanels.length
            ? heroPanels[i + 1]!.offsetTop
            : top + height;

        if (anchorAbs >= top && anchorAbs < nextTop) {
          from = i;
          t = clamp((anchorAbs - top) / height, 0, 1);
          break;
        }
        if (i === heroPanels.length - 1 && anchorAbs >= top) {
          from = i;
          t = 0;
        }
      }

      const to = Math.min(from + 1, lastHeroIndex);
      sparkBlend =
        from === to || slateCount <= 1
          ? { from, to: from, t: 0 }
          : { from, to, t };
    } else if (slateCount > 0) {
      sparkBlend = { from: lastHeroIndex, to: lastHeroIndex, t: 0 };
    }

    const sparkPin = root.querySelector(".home-spark-pin");
    const sparkInView = sparkPin
      ? sparkPin.getBoundingClientRect().height > 0
      : false;

    setVisualState({
      activeChapter: clamp(best, 0, lastHeroIndex),
      sparkBlend,
      // Keep animating while hero panels are in view; pause only after leaving hero band
      sparkPaused: best >= slateCount || !sparkInView,
    });

    if (hasSecondary) {
      const coverPanel = panels[slateCount];
      const lastHero = panels[lastHeroIndex];
      let translate = "var(--home-peek-translate)";
      let settled = false;
      let covering = false;

      if (coverPanel && lastHero) {
        const anchorAbs = window.scrollY + anchor;
        const transitionStart = lastHero.offsetTop;
        const transitionEnd = coverPanel.offsetTop;

        if (anchorAbs >= transitionStart) {
          const progress = clamp(
            (anchorAbs - transitionStart) /
              Math.max(transitionEnd - transitionStart, 1),
            0,
            1,
          );

          if (progress >= 1) {
            translate = "0px";
            settled = true;
            covering = true;
          } else if (progress > 0) {
            covering = true;
            translate = `calc((1 - ${progress}) * var(--home-peek-translate))`;
          }
        }
      }

      root.style.setProperty("--home-secondary-translate", translate);
      root.classList.toggle("home-secondary-covering", covering);
      root.classList.toggle("home-secondary-settled", settled);
    }
  }, [coverSections.length, getPanels, hasSecondary, slateCount]);

  const scrollToStep = useCallback(
    (index: number) => {
      const step = scrollSteps[index];
      if (!step) return;

      let panelIndex = 0;
      if (step.kind === "hero") {
        panelIndex = 0;
      } else {
        const sectionIdx = coverSections.findIndex((s) => s.id === step.id);
        panelIndex = slateCount + Math.max(sectionIdx, 0);
      }

      const panel = getPanels()[panelIndex];
      panel?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [coverSections, getPanels, scrollSteps, slateCount],
  );

  useHeroScrubRegister(
    !reducedMotion && scrollSteps.length > 1,
    scrollSteps,
    activeStep,
    scrollToStep,
    dotsVisible,
  );

  useHeroSubChapterProgressRegister(subChapterProgress);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setDotsVisible(entry?.isIntersecting ?? false),
      { threshold: 0.05 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    syncFromScroll();

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        syncFromScroll();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("scrollend", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scrollend", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion, syncFromScroll]);

  return (
    <HomeScrollVisualProvider value={visualState}>
      <div
        ref={rootRef}
        className={
          reducedMotion
            ? "home-scroll home-scroll--static"
            : "home-scroll home-hero-cover-flow"
        }
        data-active-panel={activePanel}
      >
        {children}
      </div>
    </HomeScrollVisualProvider>
  );
}
