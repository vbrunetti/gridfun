"use client";

import { useEffect, useRef } from "react";
import {
  maxProfileRadius,
  nearestPointOnProfile,
  perimeterDistance,
  pointOnProfile,
  pointOnRingProfile,
  tangentOnProfile,
  type ShapeProfile,
} from "@/components/sections/primary-hero/particle-shape";
import {
  resolveShapeProfile,
  type GravityClusterPreset,
} from "./gravity-cluster-presets";

export type GravityClusterBlend = {
  chapterProgress: number;
  from: number;
  to: number;
  t: number;
};

type GravityClusterCanvasProps = {
  presets: GravityClusterPreset[];
  params: GravityClusterPreset;
  blend: GravityClusterBlend;
  paused?: boolean;
  showOutline?: boolean;
  className?: string;
};

type Grain = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  shade: number;
  mass: number;
  drag: number;
  maxSpeed: number;
  cycleOffset: number;
  pullBias: number;
  swirlBias: number;
  jitterScale: number;
  wanderPhase: number;
  wanderRate: number;
  flowBias: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

const INK = { r: 28, g: 25, b: 22 };
const INK_HI = { r: 58, g: 54, b: 50 };

function spawnGrainOnOutline(
  profile: ShapeProfile,
  cx: number,
  cy: number,
  params: GravityClusterPreset,
  thickness: number,
): Grain {
  const u = Math.random();
  const p = pointOnProfile(profile, u, cx, cy);
  const angle = Math.random() * Math.PI * 2;
  const offset = (Math.random() - 0.5) * thickness;
  const x = p.x + Math.cos(angle) * offset;
  const y = p.y + Math.sin(angle) * offset;
  const speed = rand(0.15, 2.8);
  const heading = Math.random() * Math.PI * 2;

  return {
    x,
    y,
    vx: Math.cos(heading) * speed,
    vy: Math.sin(heading) * speed,
    radius:
      params.particleRadiusMin +
      Math.random() * (params.particleRadiusMax - params.particleRadiusMin),
    shade: 0.65 + Math.random() * 0.35,
    mass: rand(0.45, 1.85),
    drag: rand(0.91, 0.992),
    maxSpeed: rand(0.6, 3.8),
    cycleOffset: rand(-0.22, 0.22),
    pullBias: rand(0.35, 1.65),
    swirlBias: Math.random() < 0.35 ? rand(-1.2, -0.25) : rand(0.25, 1.2),
    jitterScale: rand(0.3, 1.8),
    wanderPhase: Math.random() * Math.PI * 2,
    wanderRate: rand(0.012, 0.055),
    flowBias: rand(0.5, 1.6),
  };
}

function drawGrain(ctx: CanvasRenderingContext2D, g: Grain, alpha: number) {
  const r = g.radius;
  const hx = g.x - r * 0.35;
  const hy = g.y - r * 0.35;
  const grad = ctx.createRadialGradient(hx, hy, 0, g.x, g.y, r);
  const a = alpha * g.shade;

  grad.addColorStop(0, `rgba(${INK_HI.r}, ${INK_HI.g}, ${INK_HI.b}, ${a * 0.95})`);
  grad.addColorStop(0.45, `rgba(${INK.r}, ${INK.g}, ${INK.b}, ${a * 0.88})`);
  grad.addColorStop(1, `rgba(${INK.r}, ${INK.g}, ${INK.b}, ${a * 0.45})`);

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(g.x, g.y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawOutline(
  ctx: CanvasRenderingContext2D,
  profile: ShapeProfile,
  cx: number,
  cy: number,
  hotspotU: number,
) {
  if (profile.ringInnerRatio !== undefined) {
    const outerR = maxProfileRadius(profile);
    const innerR = outerR * profile.ringInnerRatio;
    const steps = 72;

    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const p = pointOnRingProfile(outerR, innerR, (i / steps) * 0.5, cx, cy);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = "rgba(28, 25, 22, 0.16)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 7]);
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const p = pointOnRingProfile(
        outerR,
        innerR,
        0.5 + (i / steps) * 0.5,
        cx,
        cy,
      );
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(28, 25, 22, 0.14)";
    ctx.stroke();

    const hot = pointOnRingProfile(outerR, innerR, hotspotU, cx, cy);
    ctx.fillStyle = "rgba(28, 25, 22, 0.22)";
    ctx.beginPath();
    ctx.arc(hot.x, hot.y, 5, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  const n = profile.sampleCount;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const p = pointOnProfile(profile, i / (n - 1 || 1), cx, cy);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  if (profile.closed) ctx.closePath();
  ctx.strokeStyle = "rgba(28, 25, 22, 0.16)";
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 7]);
  ctx.stroke();
  ctx.setLineDash([]);

  const hot = pointOnProfile(profile, hotspotU, cx, cy);
  ctx.fillStyle = "rgba(28, 25, 22, 0.22)";
  ctx.beginPath();
  ctx.arc(hot.x, hot.y, 5, 0, Math.PI * 2);
  ctx.fill();
}

export function GravityClusterCanvas({
  presets,
  params,
  blend,
  paused = false,
  showOutline = false,
  className,
}: GravityClusterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const presetsRef = useRef(presets);
  const paramsRef = useRef(params);
  const blendRef = useRef(blend);
  const pausedRef = useRef(paused);
  const showOutlineRef = useRef(showOutline);
  const grainsRef = useRef<Grain[]>([]);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
  const timeRef = useRef(0);
  const rafRef = useRef(0);

  presetsRef.current = presets;
  paramsRef.current = params;
  blendRef.current = blend;
  pausedRef.current = paused;
  showOutlineRef.current = showOutline;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      sizeRef.current = { width, height, dpr };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cfg = paramsRef.current;
      const b = blendRef.current;
      const fromPreset = presetsRef.current[b.from] ?? presetsRef.current[0]!;
      const toPreset = presetsRef.current[b.to] ?? fromPreset;
      const profile = resolveShapeProfile(
        fromPreset.shape,
        toPreset.shape,
        b.from === b.to ? 0 : b.t,
        width,
        height,
        cfg.boundaryScale,
      );
      const cx = width / 2;
      const cy = height / 2;
      grainsRef.current = Array.from({ length: cfg.particleCount }, () =>
        spawnGrainOnOutline(profile, cx, cy, cfg, cfg.outlineThickness),
      );
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const step = () => {
      rafRef.current = requestAnimationFrame(step);
      if (pausedRef.current) return;

      const { width, height } = sizeRef.current;
      if (width === 0 || height === 0) return;

      const cfg = paramsRef.current;
      const b = blendRef.current;
      const fromPreset = presetsRef.current[b.from] ?? presetsRef.current[0]!;
      const toPreset = presetsRef.current[b.to] ?? fromPreset;
      const morphT = b.from === b.to ? 0 : b.t;
      const profile = resolveShapeProfile(
        fromPreset.shape,
        toPreset.shape,
        morphT,
        width,
        height,
        cfg.boundaryScale,
      );

      const t = timeRef.current;
      timeRef.current += 0.016;
      const hotspotU =
        (((t * cfg.cycleSpeed + b.chapterProgress * 0.04) % 1) + 1) % 1;

      let grains = grainsRef.current;
      const targetCount = cfg.particleCount;
      const cx = width / 2;
      const cy = height / 2;
      const maxR = maxProfileRadius(profile);

      while (grains.length < targetCount) {
        grains.push(
          spawnGrainOnOutline(profile, cx, cy, cfg, cfg.outlineThickness),
        );
      }
      if (grains.length > targetCount) {
        grains = grains.slice(0, targetCount);
      }

      for (const g of grains) {
        let fx = 0;
        let fy = 0;

        const nearest = nearestPointOnProfile(profile, g.x, g.y, cx, cy);
        const grainHotspot =
          (((hotspotU + g.cycleOffset) % 1) + 1) % 1;
        const isRing = profile.ringInnerRatio !== undefined;
        const along = perimeterDistance(
          nearest.u,
          grainHotspot,
          profile.closed,
        );
        const waveFalloff = isRing ? 12 : 28;
        const wave = Math.exp(-along * along * waveFalloff);

        const bandHalf = cfg.outlineThickness * 0.5;
        const gap = nearest.dist - bandHalf * 0.15;
        const bandPull =
          (cfg.attraction * g.pullBias * (0.35 + wave * 0.65)) /
          (Math.abs(gap) * 0.06 + 8 + g.mass * 4);

        fx += nearest.nx * bandPull;
        fy += nearest.ny * bandPull;

        if (Math.abs(gap) > bandHalf) {
          const edgePull = cfg.attraction * g.pullBias * 0.5;
          fx += nearest.nx * edgePull * Math.sign(gap);
          fy += nearest.ny * edgePull * Math.sign(gap);
        }

        const hot = pointOnProfile(profile, grainHotspot, cx, cy);
        const toHotX = hot.x - g.x;
        const toHotY = hot.y - g.y;
        const toHotLen = Math.hypot(toHotX, toHotY) || 0.001;
        const hotPullScale = isRing ? 0.28 : 0.45;
        const hotPull =
          (cfg.attraction * wave * g.pullBias * g.flowBias * hotPullScale) /
          (toHotLen * 0.08 + 10);
        fx += (toHotX / toHotLen) * hotPull;
        fy += (toHotY / toHotLen) * hotPull;

        const tangent = tangentOnProfile(profile, nearest.u, cx, cy);
        const flow =
          (cfg.swirl * (0.25 + wave * 0.75) * g.swirlBias) /
          (1 + g.mass * 0.5);
        fx += tangent.tx * flow;
        fy += tangent.ty * flow;

        const outerLimit = maxR + cfg.outlineThickness * 0.65;
        const dx = g.x - cx;
        const dy = g.y - cy;
        const radialDist = Math.hypot(dx, dy);
        if (nearest.dist > cfg.outlineThickness * 0.85 || radialDist > outerLimit) {
          const pullBack = cfg.attraction * g.pullBias * 0.35;
          fx += nearest.nx * pullBack;
          fy += nearest.ny * pullBack;
        }

        g.wanderPhase += g.wanderRate;
        const wander =
          cfg.jitter * g.jitterScale * (0.6 + Math.sin(g.wanderPhase * 1.7) * 0.4);
        fx +=
          Math.sin(g.wanderPhase) * wander +
          (Math.random() - 0.5) * cfg.jitter * g.jitterScale * 0.35;
        fy +=
          Math.cos(g.wanderPhase * 1.31) * wander +
          (Math.random() - 0.5) * cfg.jitter * g.jitterScale * 0.35;

        g.vx += fx / g.mass;
        g.vy += fy / g.mass;

        const particleDrag = cfg.drag * g.drag + (1 - cfg.drag) * 0.15;
        g.vx *= particleDrag;
        g.vy *= particleDrag;

        const speed = Math.hypot(g.vx, g.vy);
        if (speed > g.maxSpeed) {
          g.vx = (g.vx / speed) * g.maxSpeed;
          g.vy = (g.vy / speed) * g.maxSpeed;
        }

        g.x += g.vx;
        g.y += g.vy;
      }

      grainsRef.current = grains;

      ctx.clearRect(0, 0, width, height);

      if (showOutlineRef.current) {
        drawOutline(ctx, profile, cx, cy, hotspotU);
      }

      const sorted = [...grains].sort((a, b) => a.radius - b.radius);
      for (const g of sorted) {
        drawGrain(ctx, g, cfg.alpha);
      }
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
      className={className ?? "pointer-events-none absolute inset-0 h-full w-full"}
      aria-hidden
    />
  );
}
