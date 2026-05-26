"use client";

import { useEffect } from "react";

/**
 * Toggles `body.chrome-on-dark` whenever any visible `.theme-dark` element
 * intersects the floating chrome's region (top-right of viewport). Used so the
 * hamburger + grid label flip to their light variant for legibility on any
 * dark surface — including the home secondary cover as it scrolls up into the
 * chrome area. Detection uses `getBoundingClientRect()`, which is unaffected
 * by `pointer-events: none` on the probed elements.
 */
export function ChromeThemeWatcher() {
  useEffect(() => {
    const body = document.body;
    const PROBE_W = 96;
    const PROBE_H = 64;

    const intersectsChromeProbe = (el: Element) => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;
      const right = window.innerWidth;
      const probeLeft = right - PROBE_W;
      return (
        rect.right > probeLeft &&
        rect.left < right &&
        rect.top < PROBE_H &&
        rect.bottom > 0
      );
    };

    const update = () => {
      const darkEls = document.querySelectorAll<HTMLElement>(".theme-dark");
      let onDark = false;
      for (const el of darkEls) {
        if (el.closest(".floating-chrome, .lock-screen-left")) continue;
        if (intersectsChromeProbe(el)) {
          onDark = true;
          break;
        }
      }
      body.classList.toggle("chrome-on-dark", onDark);
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
      body.classList.remove("chrome-on-dark");
    };
  }, []);

  return null;
}
