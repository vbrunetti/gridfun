"use client";

import { useChrome } from "./chrome-provider";
import { HeroDotsRail } from "./hero-dots-rail";
import { GridLocationIndicator } from "./grid-location-indicator";
import { IconMenuToggle } from "./icons";

export function FloatingChrome() {
  const { menuOpen, toggleMenu } = useChrome();

  return (
    <div
      className={`pointer-events-none fixed top-0 right-0 z-[80] flex h-[100dvh] w-[calc(var(--chrome-hit)+var(--chrome-pad)*2)] flex-col items-center ${
        menuOpen ? "text-[var(--color-paper)]" : "text-[var(--color-ink)]"
      }`}
    >
      {/* Menu trigger — top of column, centered on shared axis */}
      <div className="pointer-events-auto relative z-20 shrink-0 p-[var(--chrome-pad)]">
        <button
          type="button"
          onClick={toggleMenu}
          className="chrome-hit-target shrink-0 cursor-pointer border-0 bg-transparent p-0 transition-opacity hover:opacity-70"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <IconMenuToggle open={menuOpen} />
        </button>
      </div>

      <HeroDotsRail />

      {/* Grid label — .chrome-rail-grid-label positions on shared axis (see globals.css) */}
      <div className="chrome-rail-grid-label">
        <GridLocationIndicator />
      </div>
    </div>
  );
}
