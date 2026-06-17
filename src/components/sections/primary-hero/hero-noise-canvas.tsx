"use client";

import { useEffect, useRef } from "react";
import type { HeroNoiseConfig } from "@/lib/hero-atmosphere-snapshot";
import {
  buildNoisePatternCanvas,
  noisePatternKey,
} from "./hero-atmosphere-render";

type HeroNoiseCanvasProps = {
  config: HeroNoiseConfig;
};

export function HeroNoiseCanvas({ config }: HeroNoiseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const patternRef = useRef<CanvasPattern | null>(null);
  const patternKeyRef = useRef("");

  useEffect(() => {
    if (!config.enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const key = noisePatternKey(config);
    if (key !== patternKeyRef.current) {
      const patternCanvas = buildNoisePatternCanvas(config);
      if (!patternCanvas) return;
      patternRef.current = ctx.createPattern(patternCanvas, "repeat");
      patternKeyRef.current = key;
    }

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width <= 0 || height <= 0) return;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      if (!patternRef.current) return;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = patternRef.current;
      ctx.fillRect(0, 0, width, height);
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [config]);

  if (!config.enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="home-atmosphere-pin__noise"
      style={{ mixBlendMode: config.blend.mode }}
      aria-hidden
    />
  );
}
