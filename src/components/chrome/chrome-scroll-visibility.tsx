"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useChrome } from "./chrome-provider";

const MOBILE_QUERY = "(max-width: 1023px)";
/** Below this scroll position chrome always stays visible. */
const SCROLL_PIN_Y = 56;
/** Minimum scroll delta (px) before toggling visibility. */
const SCROLL_DELTA = 4;

/**
 * Mobile only — hides fixed logo + menu on scroll down, reveals on scroll up.
 * Desktop is unaffected.
 */
export function ChromeScrollVisibility() {
  const pathname = usePathname();
  const { menuOpen } = useChrome();
  const lastYRef = useRef(0);
  const visibleRef = useRef(true);
  const rafRef = useRef(0);

  useEffect(() => {
    const mobileMq = window.matchMedia(MOBILE_QUERY);
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    function setVisible(visible: boolean) {
      if (visibleRef.current === visible) return;
      visibleRef.current = visible;
      document.body.setAttribute(
        "data-chrome-visibility",
        visible ? "visible" : "hidden",
      );
    }

    function sync() {
      const mobile = mobileMq.matches;

      if (!mobile) {
        document.body.removeAttribute("data-chrome-visibility");
        visibleRef.current = true;
        return;
      }

      // D1: auto-hide is uniform across ALL deck routes — no detail-page opt-out.
      // The top inset is fixed clearspace (the band hides via transform, keeping
      // its measured height constant), so snap geometry never shifts when the nav
      // hides; scrolling up reveals it, so the menu stays reachable.

      if (reducedMq.matches || menuOpen) {
        setVisible(true);
        return;
      }

      const y = window.scrollY;
      const delta = y - lastYRef.current;

      if (y <= SCROLL_PIN_Y) {
        setVisible(true);
      } else if (delta > SCROLL_DELTA) {
        setVisible(false);
      } else if (delta < -SCROLL_DELTA) {
        setVisible(true);
      }

      lastYRef.current = y;
    }

    function onScroll() {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        sync();
      });
    }

    function onLayoutChange() {
      lastYRef.current = window.scrollY;
      sync();
    }

    lastYRef.current = window.scrollY;
    if (mobileMq.matches) {
      document.body.setAttribute("data-chrome-visibility", "visible");
      visibleRef.current = true;
    }
    sync();

    window.addEventListener("scroll", onScroll, { passive: true });
    mobileMq.addEventListener("change", onLayoutChange);
    reducedMq.addEventListener("change", onLayoutChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      mobileMq.removeEventListener("change", onLayoutChange);
      reducedMq.removeEventListener("change", onLayoutChange);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.removeAttribute("data-chrome-visibility");
    };
  }, [menuOpen, pathname]);

  return null;
}
