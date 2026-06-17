"use client";

import { useEffect, useState } from "react";
import type { HeroAtmosphereSnapshot } from "@/lib/hero-atmosphere-snapshot";
import { useHomeScrollVisual } from "./home-scroll-visual-context";
import { HeroBlobCanvas } from "./hero-blob-canvas";
import { HeroNoiseCanvas } from "./hero-noise-canvas";

type HomeAtmospherePinProps = {
  snapshot: HeroAtmosphereSnapshot;
  chapterCount: number;
};

/**
 * Sticky atmosphere behind spark — noise + per-chapter seeded blobs.
 * Desktop only; omitted when prefers-reduced-motion.
 */
export function HomeAtmospherePin({ snapshot, chapterCount }: HomeAtmospherePinProps) {
  const { sparkBlend, sparkPaused } = useHomeScrollVisual();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const desktopMq = window.matchMedia("(min-width: 1024px)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      setEnabled(desktopMq.matches && !motionMq.matches);
    };

    apply();
    desktopMq.addEventListener("change", apply);
    motionMq.addEventListener("change", apply);
    return () => {
      desktopMq.removeEventListener("change", apply);
      motionMq.removeEventListener("change", apply);
    };
  }, []);

  if (!enabled) return null;
  if (!snapshot.noise.enabled && !snapshot.blobs.enabled) return null;

  return (
    <div className="home-atmosphere-pin" aria-hidden>
      <HeroNoiseCanvas config={snapshot.noise} />
      <HeroBlobCanvas
        blobs={snapshot.blobs}
        chapterCount={chapterCount}
        blend={sparkBlend}
        paused={sparkPaused}
      />
    </div>
  );
}
