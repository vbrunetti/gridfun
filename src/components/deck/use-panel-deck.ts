"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SectionDef } from "./types";

export type PanelDeckOptions = {
  sections: SectionDef[];
  onActiveChange?: (panelId: string, index: number) => void;
};

export type PanelDeckReturn = {
  activeIndex: number;
  activeId: string;
  goTo: (indexOrId: number | string, opts?: { smooth?: boolean }) => void;
};

/** Reads --chrome-top-inset from :root (set by chrome-insets.ts), falls back to scroll-padding-top. */
export function getTopInset(): number {
  const fromVar = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--chrome-top-inset"),
  );
  if (Number.isFinite(fromVar) && fromVar > 0) return fromVar;

  const fromPadding = parseFloat(
    getComputedStyle(document.documentElement).scrollPaddingTop,
  );
  return Number.isFinite(fromPadding) ? fromPadding : 0;
}

/**
 * Snap-start scroll position for a panel element.
 * Matches the CSS scroll-snap trigger: docTop - scrollMarginTop.
 */
function panelSnapY(el: HTMLElement): number {
  const marginTop = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  return el.getBoundingClientRect().top + window.scrollY - marginTop;
}

/**
 * Unified active-index algorithm (spec §5.4):
 * Active = panel whose snap-start is the greatest position ≤ (scrollY + topInset).
 */
function computeActiveIndex(panelIds: string[], topInset: number): number {
  const anchorAbs = window.scrollY + topInset;
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  if (window.scrollY >= maxScroll - 4) return panelIds.length - 1;

  let active = 0;
  for (let i = panelIds.length - 1; i >= 0; i--) {
    const el = document.getElementById(panelIds[i]!);
    if (!el) continue;
    if (panelSnapY(el) <= anchorAbs) {
      active = i;
      break;
    }
  }
  return active;
}

/**
 * Core deck hook — tracks active panel index for vertical native-scroll decks.
 * Horizontal gesture layer (Stage 2) will extend this via section axis detection.
 */
export function usePanelDeck({
  sections,
  onActiveChange,
}: PanelDeckOptions): PanelDeckReturn {
  // Flatten sections → ordered panel ID list for the dot rail.
  const panelIds = sections.flatMap((s) => s.panels.map((p) => p.id));

  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef(0);
  const onChangeRef = useRef(onActiveChange);
  onChangeRef.current = onActiveChange;

  const syncActive = useCallback(() => {
    if (panelIds.length === 0) return;
    const topInset = getTopInset();
    const next = computeActiveIndex(panelIds, topInset);
    setActiveIndex((prev) => {
      if (prev === next) return prev;
      onChangeRef.current?.(panelIds[next] ?? "", next);
      return next;
    });
  }, [panelIds.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    syncActive();

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        syncActive();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncActive, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", syncActive);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [syncActive]);

  const goTo = useCallback(
    (indexOrId: number | string, opts: { smooth?: boolean } = {}) => {
      const index =
        typeof indexOrId === "number"
          ? indexOrId
          : panelIds.indexOf(indexOrId);
      if (index < 0 || index >= panelIds.length) return;

      const el = document.getElementById(panelIds[index]!);
      el?.scrollIntoView({
        behavior: opts.smooth === false ? "instant" : "smooth",
        block: "start",
      });
    },
    [panelIds.join(",")], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    activeIndex,
    activeId: panelIds[activeIndex] ?? "",
    goTo,
  };
}
