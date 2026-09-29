"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useChrome } from "./chrome-provider";
import { useChromeSurface } from "./chrome-mobile-band";
import { LogoMark } from "./logo-mark";

/**
 * Single fixed logo slot — same coordinates when the menu opens; only variant changes.
 * Desktop: default on the light rail; reversed on routes with a dark rail (/about, /contact).
 * Mobile: follows the sampled chrome band over the hero.
 */
export function ChromeLogo() {
  const pathname = usePathname();
  const { menuOpen, closeMenu } = useChrome();
  const mobileSurface = useChromeSurface();
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // A rail tinted for paper type (see setChromeRailTint) needs the reversed mark.
  const [railPaper, setRailPaper] = useState(false);
  useEffect(() => {
    const sync = () => setRailPaper(document.body.dataset.railTint === "paper");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-rail-tint"],
    });
    return () => observer.disconnect();
  }, []);

  const darkRail =
    menuOpen ||
    (desktop
      ? pathname === "/about" || pathname === "/contact" || railPaper
      : mobileSurface === "dark");

  return (
    <div
      className="chrome-mobile-top chrome-mobile-top--logo fixed top-0 left-0 z-[80] box-border flex w-[var(--rail-width)] justify-center p-[var(--chrome-pad)] max-lg:w-auto max-lg:justify-start"
    >
      <LogoMark
        variant={darkRail ? "reversed" : "default"}
        onNavigate={menuOpen ? closeMenu : undefined}
      />
    </div>
  );
}
