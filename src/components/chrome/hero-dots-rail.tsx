"use client";

import { ChromeNavDot } from "@/components/chrome/chrome-nav-dot";
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
          className="chrome-nav-dot-btn"
          aria-current={i === activeIndex ? "step" : undefined}
          aria-label={`Go to slide ${i + 1} of ${slateCount}${
            slate.eyebrow ? `: ${slate.eyebrow}` : ""
          }`}
          onClick={() => scrollToSlate(i)}
        >
          <ChromeNavDot active={i === activeIndex} />
        </button>
      ))}
    </nav>
  );
}
