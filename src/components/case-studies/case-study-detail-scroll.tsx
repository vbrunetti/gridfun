"use client";

import {
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
  CHROME_SURFACE_ATTR,
  type ChromeSurface,
} from "@/lib/chrome-surface";
import { isMobileChromeBand } from "@/lib/chrome-band-sample";
import { useCaseStudyDeck } from "@/components/case-studies/use-case-study-deck";

type JumpTarget =
  | { type: "section"; sectionId: string }
  | { type: "panel"; sectionId: string; panelIndex: number };

function syncChromeSurfaceFromStep(
  steps: CaseStudyDetailStep[],
  stepIndex: number,
) {
  // Mobile: the top band + logo and the bottom dot rail each sample the section
  // they sit over (ChromeMobileBand), so they colour-match independently. Setting
  // a single active-step surface here would fight that on every scroll frame.
  if (isMobileChromeBand()) return;

  const step = steps[stepIndex];
  const el = step ? document.getElementById(step.id) : null;
  let surface =
    (el?.getAttribute(CHROME_SURFACE_ATTR) as ChromeSurface | null) ?? "dark";

  // The closing "next case study / next vignette" row is short: it fills only the
  // bottom of the viewport, so the right-hand chrome (menu + dots) sits over the
  // row ABOVE it, not over the footer's own ground (canvas lime, ink type). Take
  // the surface of that row, or the chrome would go ink on a dark page.
  if (step?.kind === "footer" && el && el.offsetHeight < window.innerHeight * 0.5) {
    const above = steps[stepIndex - 1];
    const aboveEl = above ? document.getElementById(above.id) : null;
    surface =
      (aboveEl?.getAttribute(CHROME_SURFACE_ATTR) as ChromeSurface | null) ??
      surface;
  }

  document.body.dataset.chromeSurface = surface;
  document.body.dataset.chromeDotsSurface = surface;
}

type CaseStudyDetailScrollProps = {
  steps: CaseStudyDetailStep[];
  children: ReactNode;
  /**
   * Dot granularity. Omit (case-study detail) for one dot per vignette;
   * set for a single-vignette craft detail to get one dot per panel on mobile.
   */
  panelDots?: boolean;
};

/**
 * Snap-scroll container for case-study detail pages.
 * Uses usePanelDeck for active-index tracking — one algorithm, measured chrome inset,
 * no nudge timer.
 */
export function CaseStudyDetailScroll({
  steps,
  children,
  panelDots = false,
}: CaseStudyDetailScrollProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [hoverStep, setHoverStep] = useState<number | null>(null);

  const { activeIndex, goToStep, goToPanel } = useCaseStudyDeck({
    steps,
    onActiveChange: (index) => {
      syncChromeSurfaceFromStep(steps, index);
    },
  });

  useCaseStudyDetailScrollRegister(
    true,
    steps,
    activeIndex,
    goToStep,
    goToPanel,
    true,
    hoverStep,
    setHoverStep,
    panelDots,
  );

  // Pre-paint surface sync — avoids a flash of the wrong chrome color on step change.
  useLayoutEffect(() => {
    syncChromeSurfaceFromStep(steps, activeIndex);
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

  // Dimmed sections + idle vignette panels: click/tap jumps to them (like the dot
  // nav). The pointer is the only cursor style on the deck — jumpable areas just
  // get `cursor: pointer` in CSS; there is no custom follower.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const isInteractive = (target: EventTarget | null) =>
      (target as HTMLElement | null)?.closest(
        ".floating-chrome, a, button, input, textarea, select, [contenteditable='true']",
      );

    const resolveJumpTarget = (target: EventTarget | null): JumpTarget | null => {
      const el = target as HTMLElement | null;
      if (!el || !root.contains(el)) return null;

      // Index strips (data-index-strip) are links end to end — a click anywhere
      // opens the case study, so don't intercept it as a jump.
      if (el.closest("[data-index-strip]")) return null;

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
            return { type: "panel", sectionId: section.id, panelIndex };
          }
        }
      }

      const section = el.closest<HTMLElement>(".cs-focus-section");
      if (section && !section.classList.contains("is-focused")) {
        return { type: "section", sectionId: section.id };
      }

      return null;
    };

    // Works for ALL pointer types: on touch, tapping the peeked next panel is the
    // expected way to advance it into view.
    const onClick = (event: MouseEvent) => {
      const target = resolveJumpTarget(event.target);
      if (!target || isInteractive(event.target)) return;

      event.preventDefault();

      const stepIndex = steps.findIndex((step) => step.id === target.sectionId);
      if (stepIndex < 0) return;

      if (target.type === "panel") {
        goToPanel(stepIndex, target.panelIndex);
        return;
      }

      goToStep(stepIndex);
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [goToStep, goToPanel, steps]);

  return (
    <article ref={rootRef} className="cs-detail">
      {children}
    </article>
  );
}
