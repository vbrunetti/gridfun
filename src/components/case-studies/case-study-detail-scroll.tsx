"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useChromeFocusById } from "@/components/chrome/use-chrome-focus";
import {
  useCaseStudyDetailScrollRegister,
  type CaseStudyDetailStep,
} from "@/components/case-studies/case-study-detail-scroll-context";
import {
  VCHAPTER_PANEL_EVENT,
  type VchapterPanelEventDetail,
} from "@/components/craft/vignette-chapter";

const DESKTOP_QUERY = "(min-width: 768px)";

type PeekTarget = {
  surface: "light" | "dark";
} & (
  | { type: "section"; sectionId: string }
  | { type: "panel"; sectionId: string; panelIndex: number }
);

function chromeAnchorY(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--chrome-top-offset",
  );
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 64;
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
  const [activeStep, setActiveStep] = useState(0);
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

  useCaseStudyDetailScrollRegister(true, steps, activeStep, scrollToStep, true);

  useEffect(() => {
    syncActiveStep();

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        syncActiveStep();
      });
    };

    const onResize = () => syncActiveStep();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [syncActiveStep]);

  useChromeFocusById(steps[activeStep]?.id, steps.length > 1);

  // Dimmed sections + vignette panels: plus cursor, hover preview, click to jump.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const canPeek = () =>
      window.matchMedia(`${DESKTOP_QUERY} and (pointer: fine)`).matches;

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
              surface: "dark",
            };
          }
        }
      }

      const section = el.closest<HTMLElement>(".cs-focus-section");
      if (section && !section.classList.contains("is-focused")) {
        return {
          type: "section",
          sectionId: section.id,
          surface: section.dataset.chromeSurface === "light" ? "light" : "dark",
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
