"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useChrome } from "./chrome-provider";
import { useChromeSurface } from "./chrome-mobile-band";
import { LogoMark } from "./logo-mark";

/**
 * Single fixed logo slot — same coordinates when the menu opens; only variant changes.
 * Desktop: always default on the light left rail (case-studies index uses dark rail).
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

  const darkRail =
    menuOpen ||
    (desktop ? pathname === "/case-studies" : mobileSurface === "dark");

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
