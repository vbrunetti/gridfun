"use client";

import { useEffect, useRef } from "react";
import {
  hexToRgb,
  palette,
  rgbaFromRgb,
  sampleSparkPaletteRgb,
  sparkPalette,
  type Rgb,
} from "@/lib/colors";
import {
  constrainToShape,
  isInsideShape,
  radiusAtAngle,
} from "./particle-shape";
import {
  blendPresets,
  type ParticlePreset,
  type ResolvedParticleParams,
} from "./particle-presets";

export type SparkBlend = {
  from: number;
  to: number;
  /** 0–1 blend between preset indices */
  t: number;
};

export type SparkColorMode = "ink" | "palette" | "cycle" | "fixed";

export type SparkCompositeMode =
  | "lighter"
  | "screen"
  | "multiply"
  | "overlay"
  | "color-dodge"
  | "soft-light"
  | "source-over";

export const SPARK_COMPOSITE_MODES: SparkCompositeMode[] = [
  "lighter",
  "screen",
  "multiply",
  "overlay",
  "color-dodge",
  "soft-light",
  "source-over",
];

type SparkCanvasProps = {
  presets: ParticlePreset[];
  blend: SparkBlend;
  paused?: boolean;
  /** Optional single-preset override (tuner uses blend OR direct preset). */
  directPreset?: ParticlePreset | null;
  showBoundary?: boolean;
  colorMode?: SparkColorMode;
  /** Hex color when colorMode is "fixed". */
  fixedColor?: string;
  compositeMode?: SparkCompositeMode;
  /** Palette revolutions per second when colorMode is "cycle". */
  colorCycleSpeed?: number;
  /** Multiplier for shape boundary size (home hero uses >1 to fill wide viewports). */
  shapeScale?: number;
  /** Extra draw margin as a fraction of frame min dimension (glow extends past the frame). */
  canvasBleed?: number;
};

type SparkParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  age: number;
  maxAge: number;
  /** 0–1 offset into the palette cycle. */
  colorOffset: number;
};

const INK_RGB: Rgb = hexToRgb(palette.ink);

function spawnParticle(
  params: ResolvedParticleParams,
  cx: number,
  cy: number,
): SparkParticle {
  const spread = params.spawnSpread;
  let x = cx;
  let y = cy;
  let attempts = 0;

  while (attempts < 12) {
    const angle = Math.random() * Math.PI * 2;
    const r =
      Math.sqrt(Math.random()) *
      radiusAtAngle(params.shapeProfile, angle) *
      spread;
    x = cx + Math.cos(angle) * r;
    y = cy + Math.sin(angle) * r;
    if (isInsideShape(x, y, cx, cy, params.shapeProfile)) break;
    attempts++;
  }

  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.hypot(dx, dy) || 0.001;
  const nx = dx / dist;
  const ny = dy / dist;
  const tx = -ny;
  const ty = nx;
  const outward = params.outwardBias;
  const rand = 1 - outward;

  const speed = params.speed * (0.4 + Math.random() * 0.6);
  const vx =
    (nx * outward + (Math.random() - 0.5) * rand) * speed * 0.15 +
    tx * params.swirl * speed;
  const vy =
    (ny * outward + (Math.random() - 0.5) * rand) * speed * 0.15 +
    ty * params.swirl * speed;

  const maxAge =
    params.lifespanMin +
    Math.random() * (params.lifespanMax - params.lifespanMin);

  return {
    x,
    y,
    vx,
    vy,
    radius:
      params.particleRadiusMin +
      Math.random() * (params.particleRadiusMax - params.particleRadiusMin),
    age: 0,
    maxAge,
    colorOffset: Math.random(),
  };
}

function resolveParams(
  presets: ParticlePreset[],
  blend: SparkBlend,
  directPreset: ParticlePreset | null | undefined,
  width: number,
  height: number,
  shapeScale = 1,
): ResolvedParticleParams {
  if (directPreset) {
    return blendPresets(directPreset, directPreset, 0, width, height, shapeScale);
  }
  const from = presets[blend.from] ?? presets[0]!;
  const to = presets[blend.to] ?? from;
  return blendPresets(from, to, blend.t, width, height, shapeScale);
}

function lifeAlpha(age: number, maxAge: number) {
  const t = age / maxAge;
  if (t >= 1) return 0;
  const fadeIn = Math.min(t / 0.12, 1);
  const fadeOut = Math.min((1 - t) / 0.2, 1);
  return fadeIn * fadeOut;
}

function chapterColorShift(blend: SparkBlend) {
  const chapterSpan = 1 / Math.max(sparkPalette.length, 1);
  return blend.from * chapterSpan + blend.t * chapterSpan;
}

function resolveParticleRgb(
  colorMode: SparkColorMode,
  colorOffset: number,
  cyclePhase: number,
  fixedRgb: Rgb | null,
): Rgb {
  if (colorMode === "fixed" && fixedRgb) return fixedRgb;
  if (colorMode === "ink") return INK_RGB;
  if (colorMode === "palette") {
    const index =
      Math.floor(colorOffset * sparkPalette.length) % sparkPalette.length;
    return hexToRgb(sparkPalette[index]!);
  }
  return sampleSparkPaletteRgb(cyclePhase + colorOffset);
}

function resolveCompositeMode(
  colorMode: SparkColorMode,
  compositeMode: SparkCompositeMode,
): SparkCompositeMode {
  if (
    colorMode === "ink" &&
    (compositeMode === "lighter" || compositeMode === "screen")
  ) {
    return "source-over";
  }
  return compositeMode;
}

export function SparkCanvas({
  presets,
  blend,
  paused = false,
  directPreset = null,
  showBoundary = false,
  colorMode = "ink",
  fixedColor,
  compositeMode = "lighter",
  colorCycleSpeed = 0.08,
  shapeScale = 1,
  canvasBleed = 0,
}: SparkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<SparkParticle[]>([]);
  const blendRef = useRef(blend);
  const presetsRef = useRef(presets);
  const directRef = useRef(directPreset);
  const pausedRef = useRef(paused);
  const showBoundaryRef = useRef(showBoundary);
  const colorModeRef = useRef(colorMode);
  const fixedRgbRef = useRef<Rgb | null>(
    colorMode === "fixed" && fixedColor ? hexToRgb(fixedColor) : null,
  );
  const compositeModeRef = useRef(compositeMode);
  const colorCycleSpeedRef = useRef(colorCycleSpeed);
  const shapeScaleRef = useRef(shapeScale);
  const canvasBleedRef = useRef(canvasBleed);
  const cycleTimeRef = useRef(0);
  const rafRef = useRef(0);
  const sizeRef = useRef({
    frameWidth: 0,
    frameHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    bleed: 0,
    dpr: 1,
  });
  const lastTimeRef = useRef(0);

  blendRef.current = blend;
  presetsRef.current = presets;
  directRef.current = directPreset;
  pausedRef.current = paused;
  showBoundaryRef.current = showBoundary;
  colorModeRef.current = colorMode;
  fixedRgbRef.current =
    colorMode === "fixed" && fixedColor ? hexToRgb(fixedColor) : null;
  compositeModeRef.current = compositeMode;
  colorCycleSpeedRef.current = colorCycleSpeed;
  shapeScaleRef.current = shapeScale;
  canvasBleedRef.current = canvasBleed;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const frameWidth = parent.clientWidth;
      const frameHeight = parent.clientHeight;
      const bleed = Math.round(
        Math.min(frameWidth, frameHeight) * canvasBleedRef.current,
      );
      const canvasWidth = frameWidth + bleed * 2;
      const canvasHeight = frameHeight + bleed * 2;
      sizeRef.current = {
        frameWidth,
        frameHeight,
        canvasWidth,
        canvasHeight,
        bleed,
        dpr,
      };
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      canvas.style.left = `${-bleed}px`;
      canvas.style.top = `${-bleed}px`;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = [];
      lastTimeRef.current = 0;
      cycleTimeRef.current = 0;
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const step = (now: number) => {
      rafRef.current = requestAnimationFrame(step);
      if (pausedRef.current) return;

      const { frameWidth, frameHeight, canvasWidth, canvasHeight, bleed } =
        sizeRef.current;
      if (frameWidth === 0 || frameHeight === 0) return;

      const prev = lastTimeRef.current || now;
      const dt = Math.min((now - prev) / 1000, 0.05);
      lastTimeRef.current = now;
      cycleTimeRef.current += dt;

      const cx = bleed + frameWidth / 2;
      const cy = bleed + frameHeight / 2;
      const currentBlend = blendRef.current;
      const params = resolveParams(
        presetsRef.current,
        currentBlend,
        directRef.current,
        frameWidth,
        frameHeight,
        shapeScaleRef.current,
      );
      const mode = colorModeRef.current;
      const cyclePhase =
        mode === "cycle"
          ? (((cycleTimeRef.current * colorCycleSpeedRef.current +
              chapterColorShift(currentBlend)) %
              1) +
              1) %
            1
          : 0;

      let particles = particlesRef.current;
      const targetCount = params.count;

      while (particles.length < targetCount) {
        particles.push(spawnParticle(params, cx, cy));
      }
      if (particles.length > targetCount + 40) {
        particles = particles.slice(0, targetCount);
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      if (showBoundaryRef.current) {
        const profile = params.shapeProfile;
        const n = profile.radii.length;
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const theta = (i / n) * Math.PI * 2;
          const r = radiusAtAngle(profile, theta);
          const px = cx + Math.cos(theta) * r;
          const py = cy + Math.sin(theta) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(28, 25, 22, 0.12)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const next: SparkParticle[] = [];

      for (const p of particles) {
        p.age += dt;
        if (p.age >= p.maxAge) {
          next.push(spawnParticle(params, cx, cy));
          continue;
        }

        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.hypot(dx, dy) || 0.001;

        p.vx += (dx / dist) * params.gravity * params.speed;
        p.vy += (dy / dist) * params.gravity * params.speed;

        const tx = -dy / dist;
        const ty = dx / dist;
        p.vx += tx * params.swirl * params.speed;
        p.vy += ty * params.swirl * params.speed;

        p.vx += (Math.random() - 0.5) * params.turbulence;
        p.vy += (Math.random() - 0.5) * params.turbulence;

        p.vx *= params.drag;
        p.vy *= params.drag;
        p.x += p.vx;
        p.y += p.vy;

        const constrained = constrainToShape(
          p.x,
          p.y,
          cx,
          cy,
          params.shapeProfile,
        );
        if (constrained.x !== p.x || constrained.y !== p.y) {
          p.x = constrained.x;
          p.y = constrained.y;
          p.vx *= -0.35;
          p.vy *= -0.35;
          if (p.age > p.maxAge * 0.65) {
            next.push(spawnParticle(params, cx, cy));
            continue;
          }
        }

        next.push(p);
      }

      while (next.length < targetCount) {
        next.push(spawnParticle(params, cx, cy));
      }

      particlesRef.current = next;

      if (params.linkDistance > 0 && params.linkOpacity > 0) {
        const linkRgb =
          mode === "fixed" && fixedRgbRef.current
            ? fixedRgbRef.current
            : mode === "ink"
              ? INK_RGB
              : sampleSparkPaletteRgb(
                  mode === "cycle"
                    ? cyclePhase
                    : next[0]?.colorOffset ?? 0,
                );
        ctx.strokeStyle = rgbaFromRgb(linkRgb, params.linkOpacity);
        ctx.lineWidth = params.linkLineWidth;
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const a = next[i]!;
            const b = next[j]!;
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < params.linkDistance) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalCompositeOperation = resolveCompositeMode(
        mode,
        compositeModeRef.current,
      );
      for (const p of next) {
        const life = lifeAlpha(p.age, p.maxAge);
        const alpha = params.alpha * life;
        if (alpha <= 0.002) continue;
        const rgb = resolveParticleRgb(
          mode,
          p.colorOffset,
          cyclePhase,
          fixedRgbRef.current,
        );
        const glow = p.radius * params.glowScale;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
        grad.addColorStop(0, rgbaFromRgb(rgb, alpha));
        grad.addColorStop(0.45, rgbaFromRgb(rgb, alpha * 0.35));
        grad.addColorStop(1, rgbaFromRgb(rgb, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute"
      aria-hidden
    />
  );
}
