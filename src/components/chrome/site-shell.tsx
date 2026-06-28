import type { ReactNode } from "react";
import { ChromeLogo } from "./chrome-logo";
import { ChromeMobileBand } from "./chrome-mobile-band";
import { ChromeThemeWatcher } from "./chrome-theme-watcher";
import { FloatingChrome } from "./floating-chrome";
import { LeftRail } from "./left-rail";
import { MenuOverlay } from "./menu-overlay";
import { SkeletonOverlay } from "./skeleton-overlay";
import { ViewportInsets } from "./viewport-insets";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SkeletonOverlay />
      <LeftRail />
      <MenuOverlay />
      <ChromeLogo />
      <ChromeMobileBand />
      <FloatingChrome />
      {/* Sentinel measured by chrome-insets.ts to set --chrome-dots-inset */}
      <div className="chrome-dots-inset-sentinel" data-chrome-inset="dots" aria-hidden />
      <ChromeThemeWatcher />
      <ViewportInsets />
      <div className="min-h-[var(--app-vh)] lg:pl-[var(--rail-width)]">
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
