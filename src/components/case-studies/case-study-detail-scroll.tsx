"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  useCaseStudyDetailScrollRegister,
  type CaseStudyDetailStep,
} from "@/components/case-studies/case-study-detail-scroll-context";

const WHEEL_DELTA_MIN = 6;
const SCROLL_LOCK_MS = 640;
const DESKTOP_QUERY = "(min-width: 768px)";

type SnapPoint = {
  offset: number;
  stepId: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function chromeAnchorY(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--chrome-top-offset",
  );
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 64;
}

function nearestSnapIndex(points: SnapPoint[], scrollY: number): number {
  let nearest = 0;
  let minDistance = Infinity;

  for (let i = 0; i < points.length; i++) {
    const distance = Math.abs(scrollY - points[i]!.offset);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = i;
    }
  }

  return nearest;
}

/** Snap targets — one per section, plus one per vignette panel on desktop. */
function computeDetailSnapPoints(steps: CaseStudyDetailStep[]): SnapPoint[] {
  const anchor = chromeAnchorY();
  const stepPx = window.innerHeight;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const desktop = window.matchMedia(DESKTOP_QUERY).matches;
  const points: SnapPoint[] = [];

  for (const step of steps) {
    const el = document.getElementById(step.id);
    if (!el) continue;

    if (desktop && el.classList.contains("vchapter")) {
      const frames = Number.parseInt(
        getComputedStyle(el).getPropertyValue("--frames") || "1",
        10,
      );
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      for (let i = 0; i < frames; i++) {
        points.push({
          offset: Math.min(maxScroll, Math.max(0, sectionTop + i * stepPx)),
          stepId: step.id,
        });
      }
      continue;
    }

    const sectionTop = el.getBoundingClientRect().top + window.scrollY;
    points.push({
      offset: Math.min(maxScroll, Math.max(0, sectionTop - anchor)),
      stepId: step.id,
    });
  }

  return points;
}

/** Last step whose row top has crossed the chrome anchor — 1:1 with the dots. */
function activeStepIndex(steps: CaseStudyDetailStep[]): number {
  const anchor = chromeAnchorY() + 8;
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;
  if (window.scrollY >= maxScroll - 4) {
    return steps.length - 1;
  }

  let best = 0;
  for (let i = 0; i < steps.length; i++) {
    const el = document.getElementById(steps[i]!.id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= anchor) best = i;
  }
  return best;
}

type CaseStudyDetailScrollProps = {
  steps: CaseStudyDetailStep[];
  children: ReactNode;
};

/**
 * Tracks which case-study row is in view, snaps one wheel / key notch per view
 * (including vignette panels on desktop), and exposes step navigation to dots.
 */
export function CaseStudyDetailScroll({
  steps,
  children,
}: CaseStudyDetailScrollProps) {
  const rootRef = useRef<HTMLElement>(null);
  const lockRef = useRef(false);
  const snapRef = useRef(0);
  const snapPointsRef = useRef<SnapPoint[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const syncActiveStep = useCallback(() => {
    setActiveStep(activeStepIndex(steps));
  }, [steps]);

  const syncSnapPoints = useCallback(() => {
    snapPointsRef.current = computeDetailSnapPoints(steps);
    const nearest = nearestSnapIndex(snapPointsRef.current, window.scrollY);
    snapRef.current = nearest;
  }, [steps]);

  const scrollToSnapIndex = useCallback(
    (index: number, behavior?: ScrollBehavior) => {
      const points = snapPointsRef.current;
      if (points.length === 0) return;

      const next = clamp(index, 0, points.length - 1);
      const top = points[next]!.offset;

      if (next === snapRef.current && Math.abs(window.scrollY - top) < 6) {
        return;
      }

      lockRef.current = true;
      snapRef.current = next;

      window.scrollTo({
        top,
        behavior:
          behavior ??
          (prefersReducedMotion() ? "auto" : ("smooth" as ScrollBehavior)),
      });

      window.setTimeout(
        () => {
          lockRef.current = false;
        },
        prefersReducedMotion() ? 48 : SCROLL_LOCK_MS,
      );
    },
    [],
  );

  const scrollToStep = useCallback(
    (index: number, behavior?: ScrollBehavior) => {
      const step = steps[index];
      if (!step) return;

      const snapIndex = snapPointsRef.current.findIndex(
        (point) => point.stepId === step.id,
      );
      if (snapIndex >= 0) {
        scrollToSnapIndex(snapIndex, behavior);
      }
    },
    [steps, scrollToSnapIndex],
  );

  const snapToNearest = useCallback(() => {
    if (lockRef.current) return;

    const points = snapPointsRef.current;
    if (points.length === 0) return;

    const nearest = nearestSnapIndex(points, window.scrollY);
    const target = points[nearest]!.offset;

    if (Math.abs(window.scrollY - target) > 4) {
      scrollToSnapIndex(nearest);
    } else {
      snapRef.current = nearest;
      syncActiveStep();
    }
  }, [scrollToSnapIndex, syncActiveStep]);

  useCaseStudyDetailScrollRegister(true, steps, activeStep, scrollToStep, true);

  useEffect(() => {
    syncSnapPoints();
    syncActiveStep();

    const onResize = () => {
      syncSnapPoints();
      syncActiveStep();
    };

    window.addEventListener("resize", onResize, { passive: true });
    requestAnimationFrame(snapToNearest);

    return () => window.removeEventListener("resize", onResize);
  }, [syncSnapPoints, syncActiveStep, snapToNearest]);

  useEffect(() => {
    const onScroll = () => {
      if (!lockRef.current) {
        snapRef.current = nearestSnapIndex(
          snapPointsRef.current,
          window.scrollY,
        );
      }
      syncActiveStep();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [syncActiveStep]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const inView = () => {
      const rect = root.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    const onWheel = (event: WheelEvent) => {
      if (!window.matchMedia(DESKTOP_QUERY).matches) return;
      if (!inView()) return;

      event.preventDefault();

      if (lockRef.current) return;
      if (Math.abs(event.deltaY) < WHEEL_DELTA_MIN) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const current = nearestSnapIndex(
        snapPointsRef.current,
        window.scrollY,
      );
      scrollToSnapIndex(current + direction);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!window.matchMedia(DESKTOP_QUERY).matches) return;
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

      if (!inView()) return;

      event.preventDefault();

      if (lockRef.current) return;

      const down =
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        (event.key === " " && !event.shiftKey);
      const current = nearestSnapIndex(
        snapPointsRef.current,
        window.scrollY,
      );
      scrollToSnapIndex(current + (down ? 1 : -1));
    };

    let idleTimer = 0;
    const onScrollIdle = () => {
      if (lockRef.current) return;
      if (!window.matchMedia(DESKTOP_QUERY).matches) return;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(snapToNearest, 120);
    };

    const onScrollEnd = () => {
      if (!lockRef.current && window.matchMedia(DESKTOP_QUERY).matches) {
        snapToNearest();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScrollIdle, { passive: true });
    window.addEventListener("scrollend", onScrollEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScrollIdle);
      window.removeEventListener("scrollend", onScrollEnd);
      window.clearTimeout(idleTimer);
    };
  }, [scrollToSnapIndex, snapToNearest]);

  // One in-focus section at a time — vignette chapters dim panels internally.
  useEffect(() => {
    const activeId = steps[activeStep]?.id;
    const sections = document.querySelectorAll<HTMLElement>(".cs-focus-section");

    sections.forEach((el) => {
      el.classList.toggle("is-focused", Boolean(activeId && el.id === activeId));
    });

    return () => {
      sections.forEach((el) => el.classList.remove("is-focused"));
    };
  }, [activeStep, steps]);

  return (
    <article ref={rootRef} className="cs-detail">
      {children}
    </article>
  );
}
