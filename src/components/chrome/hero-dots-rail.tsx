"use client";

import { useHeroScrubContext } from "@/components/sections/primary-hero/hero-scrub-context";

export function HeroDotsRail() {
  const { state } = useHeroScrubContext();

  if (!state?.dotsVisible) {
    return null;
  }

  const { slates, activeIndex, scrollToSlate } = state;
  const slateCount = slates.length;

  return (
    <nav
      className="chrome-hero-dots-rail"
      aria-label={`Hero progress, slide ${activeIndex + 1} of ${slateCount}`}
    >
      {slates.map((slate, i) => (
        <button
          key={slate.id}
          type="button"
          className="primary-hero-dot-btn"
          aria-current={i === activeIndex ? "step" : undefined}
          aria-label={`Go to slide ${i + 1} of ${slateCount}${
            slate.eyebrow ? `: ${slate.eyebrow}` : ""
          }`}
          onClick={() => scrollToSlate(i)}
        >
          <span
            className={
              i === activeIndex
                ? "primary-hero-dot primary-hero-dot-active"
                : "primary-hero-dot"
            }
            aria-hidden
          />
        </button>
      ))}
    </nav>
  );
}
