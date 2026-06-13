"use client";

import { useEffect, type RefObject } from "react";

const FOCUS_TARGET_SELECTOR = ".chrome-focus-target, .cs-focus-section";

/** Toggle `.is-focused` on focus-dim targets by id. */
export function useChromeFocusById(
  activeId: string | null | undefined,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const targets = document.querySelectorAll<HTMLElement>(FOCUS_TARGET_SELECTOR);
    targets.forEach((el) => {
      el.classList.toggle("is-focused", Boolean(activeId && el.id === activeId));
    });

    return () => {
      targets.forEach((el) => el.classList.remove("is-focused"));
    };
  }, [activeId, enabled]);
}

/** Toggle `.is-chrome-preview` on a focus target matched by id. */
export function useChromeFocusPreviewById(
  previewId: string | null | undefined,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const targets = document.querySelectorAll<HTMLElement>(FOCUS_TARGET_SELECTOR);
    targets.forEach((el) => {
      el.classList.toggle(
        "is-chrome-preview",
        Boolean(previewId && el.id === previewId),
      );
    });

    return () => {
      targets.forEach((el) => el.classList.remove("is-chrome-preview"));
    };
  }, [previewId, enabled]);
}

/** Toggle `.is-chrome-preview` on a step while dot-nav is hovered. */
export function useChromeFocusPreview(
  rootRef: RefObject<HTMLElement | null>,
  previewStep: number | null,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const root = rootRef.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>("[data-chrome-focus-step]");
    targets.forEach((el) => {
      const step = Number.parseInt(el.dataset.chromeFocusStep ?? "", 10);
      el.classList.toggle(
        "is-chrome-preview",
        previewStep !== null && step === previewStep,
      );
    });

    return () => {
      targets.forEach((el) => el.classList.remove("is-chrome-preview"));
    };
  }, [rootRef, previewStep, enabled]);
}

/** Toggle `.is-focused` on `[data-chrome-focus-step]` descendants of root. */
export function useChromeFocusSteps(
  rootRef: RefObject<HTMLElement | null>,
  activeStep: number,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const root = rootRef.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>("[data-chrome-focus-step]");
    targets.forEach((el) => {
      const step = Number.parseInt(el.dataset.chromeFocusStep ?? "", 10);
      el.classList.toggle("is-focused", step === activeStep);
    });

    return () => {
      targets.forEach((el) => el.classList.remove("is-focused"));
    };
  }, [rootRef, activeStep, enabled]);
}
