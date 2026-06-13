"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  CHROME_SURFACE_ATTR,
  type ChromeSurface,
} from "@/lib/chrome-surface";

const IGNORE = ".floating-chrome, .lock-screen-left, #site-menu, .skeleton-wrap";

/**
 * Watches tagged `[data-chrome-surface]` regions and sets body chrome color
 * from whichever surface fills the viewport (scroll-snap / sticky aware).
 */
export function ChromeThemeWatcher() {
  const pathname = usePathname();

  useEffect(() => {
    const body = document.body;
    const ratios = new Map<Element, number>();

    const apply = () => {
      if (document.querySelector(".cs-detail")) {
        return;
      }

      const surfaces = [
        ...document.querySelectorAll<Element>(`[${CHROME_SURFACE_ATTR}]`),
      ].filter((el) => !el.closest(IGNORE));

      let best: Element | null = null;
      let bestRatio = 0;
      let bestIndex = -1;

      for (let i = 0; i < surfaces.length; i++) {
        const ratio = ratios.get(surfaces[i]) ?? 0;
        if (
          ratio > bestRatio ||
          (ratio > 0 && ratio === bestRatio && i > bestIndex)
        ) {
          bestRatio = ratio;
          best = surfaces[i];
          bestIndex = i;
        }
      }

      const surface =
        (best?.getAttribute(CHROME_SURFACE_ATTR) as ChromeSurface | null) ??
        "light";
      body.dataset.chromeSurface = surface;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.intersectionRatio);
        }
        apply();
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    const observeAll = () => {
      observer.disconnect();
      ratios.clear();
      for (const el of document.querySelectorAll<Element>(
        `[${CHROME_SURFACE_ATTR}]`,
      )) {
        if (!el.closest(IGNORE)) {
          observer.observe(el);
        }
      }
      apply();
    };

    observeAll();

    return () => {
      observer.disconnect();
      delete body.dataset.chromeSurface;
    };
  }, [pathname]);

  return null;
}
