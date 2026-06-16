"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  applyChromeBandSample,
  applyChromeDotsBandSample,
  clearChromeBandSample,
  clearChromeDotsBandSample,
  isMobileChromeBand,
  sampleChromeBand,
  sampleChromeDotsBand,
} from "@/lib/chrome-band-sample";
import type { ChromeSurface } from "@/lib/chrome-surface";
import { useChrome } from "./chrome-provider";

/** Mobile — painted band behind logo + menu, matched to the module below. */
export function ChromeMobileBand() {
  const pathname = usePathname();
  const { menuOpen } = useChrome();
  const rafRef = useRef(0);

  useEffect(() => {
    const sync = () => {
      if (!isMobileChromeBand()) {
        clearChromeBandSample();
        clearChromeDotsBandSample();
        return;
      }
      applyChromeBandSample(sampleChromeBand(menuOpen), {
        includeSurface: !document.querySelector(".cs-detail"),
      });
      const dots = sampleChromeDotsBand(menuOpen);
      if (dots) {
        applyChromeDotsBandSample(dots);
      } else {
        clearChromeDotsBandSample();
      }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        sync();
      });
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const mobileMq = window.matchMedia("(max-width: 1023px)");
    mobileMq.addEventListener("change", sync);

    const dotsObserver = new MutationObserver(onScroll);
    const floatingChrome = document.querySelector(".floating-chrome");
    if (floatingChrome) {
      dotsObserver.observe(floatingChrome, { childList: true, subtree: true });
    }
    const homeScroll = document.querySelector(".home-scroll");
    if (homeScroll) {
      dotsObserver.observe(homeScroll, {
        attributes: true,
        attributeFilter: ["class", "style"],
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mobileMq.removeEventListener("change", sync);
      dotsObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearChromeBandSample();
      clearChromeDotsBandSample();
    };
  }, [menuOpen, pathname]);

  return <div className="chrome-mobile-band" aria-hidden />;
}

/** Logo variant follows the active chrome surface on mobile. */
export function useChromeSurface(): ChromeSurface {
  const pathname = usePathname();
  const { menuOpen } = useChrome();
  const [surface, setSurface] = useState<ChromeSurface>("light");

  useEffect(() => {
    const read = () =>
      (document.body.dataset.chromeSurface as ChromeSurface | undefined) ||
      "light";

    const sync = () => setSurface(read());
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-chrome-surface"],
    });

    return () => observer.disconnect();
  }, [pathname]);

  if (menuOpen) return "dark";
  return surface;
}
