"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";

function fillCanvasDark(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const styles = getComputedStyle(canvas);
  const bg =
    styles.getPropertyValue("--section-dark-bg").trim() ||
    styles.getPropertyValue("--background").trim() ||
    "#0a0a0a";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function sizeCanvasToContainer(canvas: HTMLCanvasElement, container: HTMLElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { width, height } = container.getBoundingClientRect();
  const w = Math.max(1, Math.round(width * dpr));
  const h = Math.max(1, Math.round(height * dpr));

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  fillCanvasDark(canvas);
}

/** Blank canvas lab for the home-secondary background effect (#home-secondary on /). */
export function AtmospherePlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const sync = () => sizeCanvasToContainer(canvas, container);

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(container);
    window.addEventListener("resize", sync);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <div className="atmosphere-playground-route__page">
      <header className="keyline-b">
        <RuledGrid className="py-10">
          <SiteGridSubgrid>
            <div className="grid-span-6 lg:grid-span-8">
              <p className="text-meta">Effects · Home secondary</p>
              <h1 className="display-lg mt-3">Secondary background lab</h1>
              <p className="mt-4 max-w-2xl leading-relaxed text-secondary">
                Preview canvas for the background behind{" "}
                <code className="font-mono text-xs text-primary">#home-secondary</code>{" "}
                on the home page. Sized to the same band height as production — prompt
                effects here, then wire them into the live panel.
              </p>
              <p className="mt-3 text-sm text-secondary">
                <Link href="/effects" className="border-b border-current text-primary">
                  Spark playground
                </Link>
                {" · "}
                <Link href="/" className="border-b border-current text-primary">
                  Home
                </Link>
              </p>
            </div>
          </SiteGridSubgrid>
        </RuledGrid>
      </header>

      <section className="atmosphere-playground-workspace">
        <div
          ref={containerRef}
          className="atmosphere-playground-canvas theme-dark"
          aria-label="Effect canvas"
        >
          <canvas ref={canvasRef} className="atmosphere-playground-canvas__surface" />
        </div>
      </section>
    </div>
  );
}
