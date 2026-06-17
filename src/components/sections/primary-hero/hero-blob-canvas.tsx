"use client";

import { useEffect, useMemo, useRef } from "react";
import type { SparkBlend } from "./spark-canvas";
import type { HeroAtmosphereSnapshot, HeroBlobConfig, HeroSeededBlob } from "@/lib/hero-atmosphere-snapshot";
import {
  buildAllChapterBlobs,
  chapterAtmosphereWeight,
  chapterTransitionOffsetY,
} from "@/lib/hero-atmosphere-snapshot";

type HeroBlobCanvasProps = {
  blobs: HeroBlobConfig;
  chapterCount: number;
  blend: SparkBlend;
  paused?: boolean;
};

function drawBlob(
  ctx: CanvasRenderingContext2D,
  blob: HeroSeededBlob,
  config: HeroBlobConfig,
  width: number,
  height: number,
  weight: number,
  offsetY: number,
  time: number,
) {
  if (weight <= 0.001) return;

  const wobbleScale = config.wobble * (0.035 + config.randomness * 0.05);
  const driftScale = config.randomness * 0.045;

  const wobbleX =
    Math.sin(time * config.driftSpeed * 0.85 + blob.wobblePhase) * wobbleScale * width;
  const wobbleY =
    Math.cos(time * config.driftSpeed * 0.65 + blob.phase) * wobbleScale * height;
  const driftX =
    Math.cos(blob.driftAngle + time * config.driftSpeed * 0.22) * driftScale * width;
  const driftY =
    Math.sin(blob.driftAngle + time * config.driftSpeed * 0.18) * driftScale * height;

  const cx = blob.x * width + wobbleX + driftX;
  const cy = blob.y * height + wobbleY + driftY + offsetY;
  const radius = blob.size * width * 0.5;

  const isLight = blob.tone === "light";
  const strength = (isLight ? config.lightStrength : config.darkStrength) * weight;
  const inner = isLight ? `rgba(239, 239, 239, ${strength})` : `rgba(0, 0, 0, ${strength})`;
  const mid = isLight
    ? `rgba(239, 239, 239, ${strength * 0.45})`
    : `rgba(0, 0, 0, ${strength * 0.5})`;

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.42, mid);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(
    cx,
    cy,
    radius * 1.05,
    radius * 0.92,
    blob.phase * 0.2,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

export function HeroBlobCanvas({
  blobs,
  chapterCount,
  blend,
  paused = false,
}: HeroBlobCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const pausedRef = useRef(paused);
  const blendRef = useRef(blend);
  const blobsRef = useRef(blobs);
  const chapterLayoutsRef = useRef<HeroSeededBlob[][]>([]);

  pausedRef.current = paused;
  blendRef.current = blend;
  blobsRef.current = blobs;

  const chapterLayouts = useMemo(
    () => buildAllChapterBlobs(chapterCount, blobs),
    [blobs, chapterCount],
  );

  chapterLayoutsRef.current = chapterLayouts;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !blobs.enabled) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let start = performance.now();

    const frame = (now: number) => {
      rafRef.current = requestAnimationFrame(frame);

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width <= 0 || height <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const config = blobsRef.current;
      ctx.filter = `blur(${config.blur}px)`;

      const time = (now - start) * 0.001;
      const currentBlend = blendRef.current;
      const layouts = chapterLayoutsRef.current;

      layouts.forEach((chapterBlobs, chapterIndex) => {
        const weight = chapterAtmosphereWeight(chapterIndex, currentBlend);
        if (weight <= 0.001) return;

        const offsetY = chapterTransitionOffsetY(
          chapterIndex,
          currentBlend,
          height,
          config.transitionDistance,
        );

        chapterBlobs.forEach((blob) => {
          drawBlob(ctx, blob, config, width, height, weight, offsetY, pausedRef.current ? 0 : time);
        });
      });

      ctx.filter = "none";
    };

    rafRef.current = requestAnimationFrame(frame);

    const observer = new ResizeObserver(() => {
      start = performance.now();
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [blobs.enabled]);

  if (!blobs.enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="home-atmosphere-pin__blobs"
      aria-hidden
    />
  );
}
