"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useChromeFocusById, useChromeFocusPreviewById } from "@/components/chrome/use-chrome-focus";
import {
  useCaseStudyDetailScrollRegister,
  type CaseStudyDetailStep,
} from "@/components/case-studies/case-study-detail-scroll-context";
import {
  VCHAPTER_PANEL_EVENT,
  type VchapterPanelEventDetail,
} from "@/components/craft/vignette-chapter";
import {
  CHROME_SURFACE_ATTR,
  type ChromeSurface,
  peekCursorSurface,
} from "@/lib/chrome-surface";

const PEEK_DESKTOP_QUERY = "(min-width: 768px)";
const ANCHOR_DESKTOP_QUERY = "(min-width: 1024px)";
const SNAP_NUDGE_MS = 100;
const SNAP_NUDGE_THRESHOLD_PX = 56;

type PeekTarget = {
  surface: "light" | "dark";
} & (
  | { type: "section"; sectionId: string }
  | { type: "panel"; sectionId: string; panelIndex: number }
);

function chromeAnchorY(): number {
  const desktop = window.matchMedia(ANCHOR_DESKTOP_QUERY).matches;
  if (desktop) return 8;

  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--chrome-top-offset",
  );
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 64;
}

/** Scroll Y where a row's snap-start aligns with the document snap port. */
function rowSnapScrollY(el: HTMLElement): number {
  const marginTop =
    parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const paddingTop =
    parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) ||
    0;
  const docTop = el.getBoundingClientRect().top + window.scrollY;
  return docTop - marginTop - paddingTop;
}

function snapScrollTargets(steps: CaseStudyDetailStep[]): number[] {
  return steps.map((step) => {
    const el = document.getElementById(step.id);
    return el ? rowSnapScrollY(el) : 0;
  });
}

/** Active row from snap positions — matches CSS scroll-snap, not bounding-box overlap. */
function activeStepIndex(steps: CaseStudyDetailStep[]): number {
  const anchor = chromeAnchorY() + 8;
  const anchorAbs = window.scrollY + anchor;
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  if (window.scrollY >= maxScroll - 4) {
    return steps.length - 1;
  }

  const snapYs: number[] = snapScrollTargets(steps);

  for (let i = steps.length - 1; i >= 0; i--) {
    const snapY = snapYs[i]!;
    const nextSnapY = snapYs[i + 1] ?? Number.POSITIVE_INFINITY;
    if (anchorAbs >= snapY && anchorAbs < nextSnapY) return i;
  }

  return 0;
}

/** Dot-nav jumps: vignette filmstrips further down the page start at panel 1. */
function resetVignettesBelowStep(
  steps: CaseStudyDetailStep[],
  targetIndex: number,
) {
  for (let i = targetIndex + 1; i < steps.length; i++) {
    const step = steps[i];
    if (!step || step.kind !== "vignette") continue;

    const section = document.getElementById(step.id);
    if (!section?.classList.contains("vchapter")) continue;

    section.dispatchEvent(
      new CustomEvent<VchapterPanelEventDetail>(VCHAPTER_PANEL_EVENT, {
        detail: { panelIndex: 0, smooth: false },
      }),
    );
  }
}

type CaseStudyDetailScrollProps = {
  steps: CaseStudyDetailStep[];
  children: ReactNode;
};

/**
 * Native scroll-snap (CSS) for row / panel alignment. JS tracks active step
 * for dot nav + chrome focus and handles peek-to-jump. Vignette filmstrips
 * map vertical wheel → horizontal scroll in vignette-chapter.tsx.
 */
export function CaseStudyDetailScroll({
  steps,
  children,
}: CaseStudyDetailScrollProps) {
  const rootRef = useRef<HTMLElement>(null);
  const rafRef = useRef(0);
  const snapTimerRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const [hoverStep, setHoverStep] = useState<number | null>(null);
  const [peekTarget, setPeekTarget] = useState<PeekTarget | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const syncActiveStep = useCallback(() => {
    setActiveStep(activeStepIndex(steps));
  }, [steps]);

  const scrollToStep = useCallback(
    (index: number) => {
      const step = steps[index];
      if (!step) return;

      resetVignettesBelowStep(steps, index);

      const el = document.getElementById(step.id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [steps],
  );

  const scrollToVignettePanel = useCallback(
    (sectionId: string, panelIndex: number) => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      section.dispatchEvent(
        new CustomEvent<VchapterPanelEventDetail>(VCHAPTER_PANEL_EVENT, {
          detail: { panelIndex, smooth: true },
        }),
      );
    },
    [],
  );

  useCaseStudyDetailScrollRegister(
    true,
    steps,
    activeStep,
    scrollToStep,
    true,
    hoverStep,
    setHoverStep,
  );

  useEffect(() => {
    syncActiveStep();

    const nudgeToNearestSnap = () => {
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !window.matchMedia(PEEK_DESKTOP_QUERY).matches
      ) {
        return;
      }

      const targets = snapScrollTargets(steps);
      if (targets.length < 2) return;

      const scrollY = window.scrollY;

      for (let i = 0; i < targets.length - 1; i++) {
        const start = targets[i]!;
        const end = targets[i + 1]!;
        if (scrollY <= start + 4 || scrollY >= end - 4) continue;

        const targetIndex = scrollY < (start + end) / 2 ? i : i + 1;
        const targetY = targets[targetIndex]!;
        const dist = Math.abs(scrollY - targetY);

        if (dist > 4 && dist < SNAP_NUDGE_THRESHOLD_PX) {
          document
            .getElementById(steps[targetIndex]!.id)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        return;
      }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        syncActiveStep();
      });

      window.clearTimeout(snapTimerRef.current);
      snapTimerRef.current = window.setTimeout(
        nudgeToNearestSnap,
        SNAP_NUDGE_MS,
      );
    };

    const onResize = () => syncActiveStep();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.clearTimeout(snapTimerRef.current);
    };
  }, [syncActiveStep, steps]);

  useChromeFocusById(steps[activeStep]?.id, steps.length > 1);
  useChromeFocusPreviewById(
    hoverStep !== null ? steps[hoverStep]?.id : null,
    steps.length > 1,
  );

  // Dot + menu chrome color tracks the active row (not intersection ratios).
  useEffect(() => {
    const step = steps[activeStep];
    const el = step ? document.getElementById(step.id) : null;
    const surface =
      (el?.getAttribute(CHROME_SURFACE_ATTR) as ChromeSurface | null) ?? "dark";
    document.body.dataset.chromeSurface = surface;

    return () => {
      delete document.body.dataset.chromeSurface;
    };
  }, [activeStep, steps]);

  // Dimmed sections + vignette panels: plus cursor, hover preview, click to jump.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const canPeek = () =>
      window.matchMedia(`${PEEK_DESKTOP_QUERY} and (pointer: fine)`).matches;

    const suppressesPeekCursor = (target: EventTarget | null) =>
      (target as HTMLElement | null)?.closest(
        ".floating-chrome, a, button, input, textarea, select, [contenteditable='true']",
      );

    const resolvePeekTarget = (target: EventTarget | null): PeekTarget | null => {
      const el = target as HTMLElement | null;
      if (!el || !root.contains(el)) return null;

      const panel = el.closest<HTMLElement>(".vframe");
      if (panel) {
        const section = panel.closest<HTMLElement>(
          ".cs-focus-section.vchapter.is-focused",
        );
        if (section && !panel.classList.contains("is-active")) {
          const panelIndex = Number.parseInt(
            panel.dataset.vframeIndex ?? "",
            10,
          );
          if (Number.isFinite(panelIndex)) {
            return {
              type: "panel",
              sectionId: section.id,
              panelIndex,
              surface: peekCursorSurface(section.dataset.chromeSurface),
            };
          }
        }
      }

      const section = el.closest<HTMLElement>(".cs-focus-section");
      if (section && !section.classList.contains("is-focused")) {
        return {
          type: "section",
          sectionId: section.id,
          surface: peekCursorSurface(section.dataset.chromeSurface),
        };
      }

      return null;
    };

    const clearPeek = () => {
      setPeekTarget(null);
      root.classList.remove("is-peek-cursor");
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!canPeek()) {
        clearPeek();
        return;
      }

      if (suppressesPeekCursor(event.target)) {
        clearPeek();
        return;
      }

      const target = resolvePeekTarget(event.target);
      if (!target) {
        clearPeek();
        return;
      }

      setPeekTarget(target);
      setCursorPos({ x: event.clientX, y: event.clientY });
      root.classList.add("is-peek-cursor");
    };

    const onClick = (event: MouseEvent) => {
      if (!canPeek()) return;

      const target = resolvePeekTarget(event.target);
      if (!target || suppressesPeekCursor(event.target)) return;

      event.preventDefault();

      if (target.type === "panel") {
        scrollToVignettePanel(target.sectionId, target.panelIndex);
        return;
      }

      const stepIndex = steps.findIndex((step) => step.id === target.sectionId);
      if (stepIndex >= 0) {
        scrollToStep(stepIndex);
      }
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("click", onClick);
      root.classList.remove("is-peek-cursor");
    };
  }, [scrollToStep, scrollToVignettePanel, steps]);

  return (
    <article ref={rootRef} className="cs-detail">
      {children}
      {peekTarget ? (
        <div
          className="cs-peek-cursor"
          data-surface={peekTarget.surface}
          style={{
            transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
          }}
          aria-hidden
        />
      ) : null}
    </article>
  );
}
