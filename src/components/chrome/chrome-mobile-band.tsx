"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  applyChromeBandSample,
  applyChromeDotsBandSample,
  CHROME_RESAMPLE_EVENT,
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

      // Header (top band + logo) and footer (dot rail) each sample the section
      // they sit over, so they colour-match independently — e.g. a dark chapter
      // under the band while the lime end-card sits under the dots. Works the
      // same on detail and non-detail routes.
      applyChromeBandSample(sampleChromeBand(menuOpen));
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
    window.addEventListener(CHROME_RESAMPLE_EVENT, onScroll);

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
      window.removeEventListener(CHROME_RESAMPLE_EVENT, onScroll);
      mobileMq.removeEventListener("change", sync);
      dotsObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearChromeBandSample();
      clearChromeDotsBandSample();
    };
  }, [menuOpen, pathname]);

  return <div className="chrome-mobile-band" data-chrome-inset="top" aria-hidden />;
}

/** Routes whose mobile chrome starts dark before scroll sync runs. */
function pathnameDarkDefault(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/case-studies" ||
    pathname.startsWith("/case-studies/") ||
    pathname === "/craft" ||
    pathname.startsWith("/craft/")
  );
}

/** Logo variant follows the active chrome surface on mobile. */
export function useChromeSurface(): ChromeSurface {
  const pathname = usePathname();
  const { menuOpen } = useChrome();
  const [surface, setSurface] = useState<ChromeSurface>("light");
  const [synced, setSynced] = useState(false);

  useLayoutEffect(() => {
    const read = (): ChromeSurface => {
      const fromBody = document.body.dataset.chromeSurface as ChromeSurface | undefined;
      if (fromBody) return fromBody;
      if (pathnameDarkDefault(pathname)) return "dark";
      return "light";
    };

    const sync = () => {
      setSurface(read());
      setSynced(true);
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-chrome-surface"],
    });

    return () => observer.disconnect();
  }, [pathname]);

  if (menuOpen) return "dark";
  if (!synced && pathnameDarkDefault(pathname)) return "dark";
  return surface;
}
