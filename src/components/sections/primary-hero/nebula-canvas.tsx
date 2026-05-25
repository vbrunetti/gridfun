"use client";

import { useEffect, useRef } from "react";

type NebulaCanvasProps = {
  intensity: number;
  paused?: boolean;
  reducedMotion?: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

const BASE_COUNT = 120;
const MAX_COUNT = 280;

function createParticles(count: number, width: number, height: number): Particle[] {
  const cx = width / 2;
  const cy = height / 2;
  const spread = Math.min(width, height) * 0.42;

  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * spread;
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: 1.2 + Math.random() * 2.8,
    };
  });
}

function drawStaticGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * 0.35;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  grad.addColorStop(0, "rgba(28, 25, 22, 0.22)");
  grad.addColorStop(0.5, "rgba(28, 25, 22, 0.08)");
  grad.addColorStop(1, "rgba(28, 25, 22, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

export function NebulaCanvas({
  intensity,
  paused = false,
  reducedMotion = false,
}: NebulaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const intensityRef = useRef(intensity);
  const pausedRef = useRef(paused);
  const reducedRef = useRef(reducedMotion);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  intensityRef.current = intensity;
  pausedRef.current = paused;
  reducedRef.current = reducedMotion;

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

      const count = Math.round(
        BASE_COUNT + (MAX_COUNT - BASE_COUNT) * intensityRef.current,
      );
      particlesRef.current = createParticles(count, width, height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const step = () => {
      rafRef.current = requestAnimationFrame(step);

      if (pausedRef.current || reducedRef.current) return;

      const { width, height } = sizeRef.current;
      if (width === 0 || height === 0) return;

      const t = intensityRef.current;
      const eased = Math.pow(t, 1.4);
      const cx = width / 2;
      const cy = height / 2;
      const targetCount = Math.round(
        BASE_COUNT + (MAX_COUNT - BASE_COUNT) * eased,
      );

      let particles = particlesRef.current;
      while (particles.length < targetCount) {
        const p = createParticles(1, width, height)[0];
        particles.push(p);
      }
      if (particles.length > targetCount) {
        particles = particles.slice(0, targetCount);
      }
      particlesRef.current = particles;

      const gravity = 0.0008 + eased * 0.0022;
      const swirl = 0.012 + eased * 0.028;
      const speed = 0.6 + eased * 1.8;
      const turbulence = 0.02 + eased * 0.06;
      const maxDist = Math.min(width, height) * 0.48;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      for (const p of particles) {
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.hypot(dx, dy) || 0.001;

        p.vx += (dx / dist) * gravity * speed;
        p.vy += (dy / dist) * gravity * speed;

        const tx = -dy / dist;
        const ty = dx / dist;
        p.vx += tx * swirl * speed;
        p.vy += ty * swirl * speed;

        p.vx += (Math.random() - 0.5) * turbulence;
        p.vy += (Math.random() - 0.5) * turbulence;

        const drag = 0.96 - eased * 0.02;
        p.vx *= drag;
        p.vy *= drag;

        p.x += p.vx;
        p.y += p.vy;

        if (dist < 8) {
          const angle = Math.random() * Math.PI * 2;
          p.x = cx + Math.cos(angle) * (maxDist * 0.35);
          p.y = cy + Math.sin(angle) * (maxDist * 0.35);
          p.vx = (Math.random() - 0.5) * 0.6;
          p.vy = (Math.random() - 0.5) * 0.6;
        } else if (dist > maxDist) {
          const angle = Math.atan2(p.y - cy, p.x - cx);
          p.x = cx + Math.cos(angle) * maxDist * 0.92;
          p.y = cy + Math.sin(angle) * maxDist * 0.92;
          p.vx *= -0.3;
          p.vy *= -0.3;
        }
      }

      const linkDist = 36 + eased * 48;
      if (eased > 0.15) {
        ctx.strokeStyle = `rgba(28, 25, 22, ${0.04 + eased * 0.1})`;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < linkDist) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        const alpha = 0.12 + eased * 0.35;
        const r = p.radius * (1 + eased * 0.8);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        grad.addColorStop(0, `rgba(28, 25, 22, ${alpha})`);
        grad.addColorStop(1, "rgba(28, 25, 22, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    if (reducedMotion) {
      resize();
      drawStaticGradient(ctx, sizeRef.current.width, sizeRef.current.height);
      return () => ro.disconnect();
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!reducedMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { width, height } = sizeRef.current;
    if (width && height) drawStaticGradient(ctx, width, height);
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
