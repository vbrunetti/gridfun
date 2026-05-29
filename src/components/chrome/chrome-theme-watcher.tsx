"use client";

import { useEffect } from "react";

/**
 * Toggles `body.chrome-on-dark` / `body.chrome-on-canvas` when themed sections
 * intersect the right chrome column — flips icon + grid label color only.
 */
export function ChromeThemeWatcher() {
  useEffect(() => {
    const body = document.body;

    const getProbeWidth = () => {
      const chrome = document.querySelector(".floating-chrome");
      return chrome?.getBoundingClientRect().width ?? 84;
    };

    const intersectsChromeColumn = (el: Element, probeWidth: number) => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      const probeLeft = window.innerWidth - probeWidth;
      return (
        rect.right > probeLeft &&
        rect.left < window.innerWidth &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight
      );
    };

    const update = () => {
      const probeWidth = getProbeWidth();
      let onDark = false;
      let onCanvas = false;

      for (const el of document.querySelectorAll<HTMLElement>(".theme-dark")) {
        if (el.closest(".floating-chrome, .lock-screen-left")) continue;
        if (intersectsChromeColumn(el, probeWidth)) {
          onDark = true;
          break;
        }
      }

      if (!onDark) {
        for (const el of document.querySelectorAll<HTMLElement>(".theme-canvas")) {
          if (el.closest(".floating-chrome, .lock-screen-left")) continue;
          if (intersectsChromeColumn(el, probeWidth)) {
            onCanvas = true;
            break;
          }
        }
      }

      body.classList.toggle("chrome-on-dark", onDark);
      body.classList.toggle("chrome-on-canvas", onCanvas);
    };

    update();

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
      body.classList.remove("chrome-on-dark", "chrome-on-canvas");
    };
  }, []);

  return null;
}
