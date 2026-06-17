"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
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
import {
  getEffectiveBackground,
  isMobileChromeBand,
} from "@/lib/chrome-band-sample";
import { usePanelDeck } from "@/components/deck/use-panel-deck";

const PEEK_DESKTOP_QUERY = "(min-width: 768px)";

type PeekTarget = {
  surface: "light" | "dark";
} & (
  | { type: "section"; sectionId: string }
  | { type: "panel"; sectionId: string; panelIndex: number }
);

function syncChromeSurfaceFromStep(
  steps: CaseStudyDetailStep[],
  stepIndex: number,
) {
  const step = steps[stepIndex];
  const el = step ? document.getElementById(step.id) : null;
  const surface =
    (el?.getAttribute(CHROME_SURFACE_ATTR) as ChromeSurface | null) ?? "dark";
  document.body.dataset.chromeSurface = surface;
  document.body.dataset.chromeDotsSurface = surface;

  if (isMobileChromeBand()) {
    const darkBg =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-ink")
        .trim() || "var(--color-ink)";
    const bg = el ? getEffectiveBackground(el) : darkBg;
    document.documentElement.style.setProperty("--chrome-mobile-band-bg", bg);
    document.documentElement.style.setProperty("--chrome-mobile-dots-bg", bg);
  }
}

/** Dot-nav jumps: vignette filmstrips below the target start reset to panel 1. */
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
 * Snap-scroll container for case-study detail pages.
 * Uses usePanelDeck for active-index tracking — one algorithm, measured chrome inset,
 * no nudge timer.
 */
export function CaseStudyDetailScroll({
  steps,
  children,
}: CaseStudyDetailScrollProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [hoverStep, setHoverStep] = useState<number | null>(null);
  const [peekTarget, setPeekTarget] = useState<PeekTarget | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const sections = [
    {
      id: "cs-detail",
      axis: "y" as const,
      panels: steps.map((step) => ({
        id: step.id,
        size: "fullscreen" as const,
        surface: "dark" as const,
      })),
    },
  ];

  const { activeIndex, goTo } = usePanelDeck({
    sections,
    onActiveChange: (_id, index) => {
      syncChromeSurfaceFromStep(steps, index);
    },
  });

  const scrollToStep = useCallback(
    (index: number) => {
      resetVignettesBelowStep(steps, index);
      goTo(index);
    },
    [steps, goTo],
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
    activeIndex,
    scrollToStep,
    true,
    hoverStep,
    setHoverStep,
  );

  // Snap-scroll pages keep chrome pinned — remove hide/show behavior before paint.
  useLayoutEffect(() => {
    syncChromeSurfaceFromStep(steps, activeIndex);
    document.body.removeAttribute("data-chrome-visibility");
  }, [steps, activeIndex]);

  // Surface ownership: derive from active panel's declared attribute, not imperative poke.
  useEffect(() => {
    syncChromeSurfaceFromStep(steps, activeIndex);

    return () => {
      if (!document.querySelector(".cs-detail")) {
        delete document.body.dataset.chromeSurface;
      }
    };
  }, [activeIndex, steps]);

  useChromeFocusById(steps[activeIndex]?.id, steps.length > 1);
  useChromeFocusPreviewById(
    hoverStep !== null ? steps[hoverStep]?.id : null,
    steps.length > 1,
  );

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
