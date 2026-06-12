"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useChromeFocusSteps } from "@/components/chrome/use-chrome-focus";
import { useCaseStudiesScrollRegister } from "@/components/case-studies/case-studies-scroll-context";

const WHEEL_DELTA_MIN = 6;
const SCROLL_LOCK_MS = 720;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scroll offsets for intro (peek) + one full viewport per case study panel. */
function computeStepOffsets(root: HTMLElement): number[] {
  const intro = root.querySelector<HTMLElement>('[data-cs-step="intro"]');
  const panels = root.querySelectorAll<HTMLElement>('[data-cs-step="panel"]');

  if (!intro) return [0];

  const introHeight = intro.offsetHeight;
  const panelHeight = panels[0]?.offsetHeight ?? window.innerHeight;

  const offsets = [0];
  for (let i = 0; i < panels.length; i++) {
    offsets.push(introHeight + i * panelHeight);
  }
  return offsets;
}

function nearestStepIndex(offsets: number[], scrollY: number): number {
  let nearest = 0;
  let minDistance = Infinity;

  for (let i = 0; i < offsets.length; i++) {
    const distance = Math.abs(scrollY - offsets[i]!);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = i;
    }
  }

  return nearest;
}

type CaseStudiesScrollProps = {
  children: ReactNode;
};

/**
 * One wheel / key action = one view. Prevents free scroll from stopping midway
 * between the intro and sticky case study panels.
 */
export function CaseStudiesScroll({ children }: CaseStudiesScrollProps) {
  const rootRef = useRef<HTMLElement>(null);
  const lockRef = useRef(false);
  const stepRef = useRef(0);
  const offsetsRef = useRef<number[]>([0]);
  const [activeStep, setActiveStep] = useState(0);
  const [stepCount, setStepCount] = useState(1);
  const [dotsVisible, setDotsVisible] = useState(false);

  const syncOffsets = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    offsetsRef.current = computeStepOffsets(root);
    setStepCount(offsetsRef.current.length);
    const nearest = nearestStepIndex(offsetsRef.current, window.scrollY);
    stepRef.current = nearest;
    setActiveStep(nearest);
  }, []);

  const scrollToStep = useCallback(
    (index: number, behavior?: ScrollBehavior) => {
      const offsets = offsetsRef.current;
      if (offsets.length === 0) return;

      const next = clamp(index, 0, offsets.length - 1);
      const top = offsets[next]!;
      const currentY = window.scrollY;

      if (next === stepRef.current && Math.abs(currentY - top) < 6) return;

      lockRef.current = true;
      stepRef.current = next;
      setActiveStep(next);

      window.scrollTo({
        top,
        behavior:
          behavior ?? (prefersReducedMotion() ? "auto" : ("smooth" as ScrollBehavior)),
      });

      window.setTimeout(() => {
        lockRef.current = false;
      }, prefersReducedMotion() ? 48 : SCROLL_LOCK_MS);
    },
    [],
  );

  const snapToNearest = useCallback(() => {
    if (lockRef.current) return;

    const offsets = offsetsRef.current;
    const nearest = nearestStepIndex(offsets, window.scrollY);
    const target = offsets[nearest]!;

    if (Math.abs(window.scrollY - target) > 4) {
      scrollToStep(nearest);
    } else {
      stepRef.current = nearest;
      setActiveStep(nearest);
    }
  }, [scrollToStep]);

  useCaseStudiesScrollRegister(
    true,
    stepCount,
    activeStep,
    scrollToStep,
    dotsVisible,
  );

  useChromeFocusSteps(rootRef, activeStep, stepCount > 1);

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
    syncOffsets();

    const onResize = () => syncOffsets();
    window.addEventListener("resize", onResize, { passive: true });
    requestAnimationFrame(snapToNearest);

    return () => window.removeEventListener("resize", onResize);
  }, [syncOffsets, snapToNearest]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onWheel = (event: WheelEvent) => {
      const rect = root.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!inView) return;

      event.preventDefault();

      if (lockRef.current) return;
      if (Math.abs(event.deltaY) < WHEEL_DELTA_MIN) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const current = nearestStepIndex(offsetsRef.current, window.scrollY);
      scrollToStep(current + direction);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "ArrowDown" &&
        event.key !== "ArrowUp" &&
        event.key !== "PageDown" &&
        event.key !== "PageUp" &&
        event.key !== " "
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target?.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      const rect = root.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!inView) return;

      event.preventDefault();

      if (lockRef.current) return;

      const down =
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        (event.key === " " && !event.shiftKey);
      const current = nearestStepIndex(offsetsRef.current, window.scrollY);
      scrollToStep(current + (down ? 1 : -1));
    };

    let idleTimer = 0;
    const onScroll = () => {
      if (lockRef.current) return;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(snapToNearest, 120);
    };

    const onScrollEnd = () => {
      if (!lockRef.current) snapToNearest();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.clearTimeout(idleTimer);
    };
  }, [scrollToStep, snapToNearest]);

  return (
    <article ref={rootRef} className="work-scroll-snap cs-index-scroll">
      {children}
    </article>
  );
}
