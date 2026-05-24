"use client";

import { useChrome } from "./chrome-provider";
import { GridLocationIndicator } from "./grid-location-indicator";
import { IconMenuToggle } from "./icons";

export function FloatingChrome() {
  const { menuOpen, toggleMenu } = useChrome();

  return (
    <div
      className={`fixed top-0 right-0 z-[80] flex h-[100dvh] flex-col items-center ${
        menuOpen ? "text-[var(--color-paper)]" : "text-[var(--color-ink)]"
      }`}
    >
      {/* Menu trigger — top of column, centered on shared axis */}
      <div className="relative z-10 shrink-0 p-[var(--chrome-pad)]">
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

      {/* Grid label — viewport vertical center, same horizontal axis as menu (desktop) */}
      <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
        <GridLocationIndicator />
      </div>
    </div>
  );
}
