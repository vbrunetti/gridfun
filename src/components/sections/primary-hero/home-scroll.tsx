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
import { getTopInset } from "@/components/deck/use-panel-deck";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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
 * chrome focus, sticky spark blend, and fixed secondary translate on handoff.
 */
export function HomeScroll({
  slateCount,
  coverSections,
  hasSecondary,
  children,
}: HomeScrollProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const syncRef = useRef<() => void>(() => {});
  const secondaryDomRef = useRef({
    covering: false,
    settled: false,
    translate: "",
  });
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

    const anchor = getTopInset();

    let best = 0;
    for (let i = 0; i < panels.length; i++) {
      if (panels[i]!.getBoundingClientRect().top <= anchor) best = i;
    }

    // Surface derives from the active panel's declared attribute.
    const activePanelEl = panels[best];
    if (activePanelEl?.dataset.chromeSurface) {
      document.body.dataset.chromeSurface = activePanelEl.dataset.chromeSurface;
    }

    setActivePanel((prev) => (prev === best ? prev : best));

    const heroPanelCount = Math.min(slateCount, panels.length);
    const lastHeroIndex = Math.max(heroPanelCount - 1, 0);
    const onHero = best < slateCount;
    const onCover = hasSecondary && best >= slateCount;

    let secondarySettled = false;
    let secondaryCovering = false;
    let handoffProgress = 0;

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
          handoffProgress = clamp(
            (anchorAbs - transitionStart) /
              Math.max(transitionEnd - transitionStart, 1),
            0,
            1,
          );

          if (handoffProgress >= 1) {
            translate = "0px";
            settled = true;
            covering = true;
          } else if (handoffProgress > 0) {
            covering = true;
            translate = `calc((1 - ${handoffProgress}) * var(--home-peek-translate))`;
          }
        }
      }

      secondarySettled = settled;
      secondaryCovering = covering;

      const dom = secondaryDomRef.current;
      if (dom.translate !== translate) {
        dom.translate = translate;
        root.style.setProperty("--home-secondary-translate", translate);
      }
      if (dom.covering !== covering) {
        dom.covering = covering;
        root.classList.toggle("home-secondary-covering", covering);
      }
      if (dom.settled !== settled) {
        dom.settled = settled;
        root.classList.toggle("home-secondary-settled", settled);
      }
    }

    const secondaryPanel = root.querySelector<HTMLElement>(".home-secondary-panel");
    const secondaryDominant = secondaryPanel
      ? secondaryPanel.getBoundingClientRect().top <= anchor + 4
      : false;

    const onSecondaryStep =
      secondarySettled ||
      onCover ||
      secondaryDominant ||
      (secondaryCovering && handoffProgress >= 0.88) ||
      root.style.getPropertyValue("--home-secondary-translate").trim() === "0px";

    if (onSecondaryStep) {
      const nextStep = Math.max(
        1,
        Math.min(best - slateCount + 1, coverSections.length),
      );
      setActiveStep((prev) => (prev === nextStep ? prev : nextStep));
      setSubChapterProgressState((prev) => (prev === null ? prev : null));
    } else if (onHero) {
      const nextProgress = (best + 1) / Math.max(slateCount, 1);
      setActiveStep((prev) => (prev === 0 ? prev : 0));
      setSubChapterProgressState((prev) =>
        prev?.progress === nextProgress ? prev : { progress: nextProgress },
      );
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

    const nextVisualState: HomeScrollVisualState = {
      activeChapter: clamp(best, 0, lastHeroIndex),
      sparkBlend,
      // Keep animating while hero panels are in view; pause only after leaving hero band
      sparkPaused: best >= slateCount || !sparkInView,
    };

    setVisualState((prev) => {
      if (
        prev.activeChapter === nextVisualState.activeChapter &&
        prev.sparkPaused === nextVisualState.sparkPaused &&
        prev.sparkBlend.from === nextVisualState.sparkBlend.from &&
        prev.sparkBlend.to === nextVisualState.sparkBlend.to &&
        prev.sparkBlend.t === nextVisualState.sparkBlend.t
      ) {
        return prev;
      }
      return nextVisualState;
    });
  }, [coverSections.length, getPanels, hasSecondary, slateCount]);

  syncRef.current = syncFromScroll;

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

  // Desktop — home owns chrome surface; assert on mount and every scroll sync.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      if (mq.matches) {
        document.body.dataset.chromeSurface = "dark";
      }
    };

    apply();
    mq.addEventListener("change", apply);

    return () => {
      mq.removeEventListener("change", apply);
      if (mq.matches) {
        delete document.body.dataset.chromeSurface;
      }
    };
  }, []);

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

    const runSync = () => syncRef.current();

    runSync();

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        runSync();
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
  }, [reducedMotion]);

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
