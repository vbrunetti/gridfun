"use client";

import { usePathname } from "next/navigation";
import { useChrome } from "./chrome-provider";
import { LogoMark } from "./logo-mark";

/**
 * Single fixed logo slot — same coordinates when the menu opens; only variant changes.
 * Desktop: centered in the left rail column. Mobile: top-left with chrome padding.
 */
export function ChromeLogo() {
  const pathname = usePathname();
  const { menuOpen, closeMenu } = useChrome();
  const darkRail = pathname === "/case-studies" || menuOpen;

  return (
    <div
      className="fixed top-0 left-0 z-[80] box-border flex w-[var(--rail-width)] justify-center p-[var(--chrome-pad)] max-lg:w-auto max-lg:justify-start"
    >
      <LogoMark
        variant={darkRail ? "reversed" : "default"}
        onNavigate={menuOpen ? closeMenu : undefined}
      />
    </div>
  );
}
