import type { ReactNode } from "react";
import { ChromeLogo } from "./chrome-logo";
import { ChromeMobileBand } from "./chrome-mobile-band";
import { ChromeScrollVisibility } from "./chrome-scroll-visibility";
import { ChromeThemeWatcher } from "./chrome-theme-watcher";
import { FloatingChrome } from "./floating-chrome";
import { LeftRail } from "./left-rail";
import { MenuOverlay } from "./menu-overlay";
import { SkeletonOverlay } from "./skeleton-overlay";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SkeletonOverlay />
      <LeftRail />
      <MenuOverlay />
      <ChromeLogo />
      <ChromeMobileBand />
      <FloatingChrome />
      <ChromeScrollVisibility />
      <ChromeThemeWatcher />
      <div className="min-h-[100dvh] lg:pl-[var(--rail-width)]">
        <main
          id="main-content"
          className="site-main pt-[var(--chrome-top-offset)] lg:pt-0"
        >
          {children}
        </main>
      </div>
    </>
  );
}
