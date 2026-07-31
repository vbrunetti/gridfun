"use client";

import { useEffect, useId, useRef } from "react";
import {
  buildEdgeRibbonPath,
  CHROMA_AURORA_BLEED_FRACTION,
  CHROMA_AURORA_BLUR,
  CHROMA_AURORA_OUTSET,
  EDGE_GRADIENTS,
  EDGE_ORDER,
  type EdgeId,
} from "@/lib/chroma-aurora-edge";

type ChromaAuroraCanvasProps = {
  className?: string;
  /** Pauses path animation (use with scroll-handoff opacity timing). */
  paused?: boolean;
};

/** Gradient axes in objectBoundingBox — along the edge, then inward falloff. */
const EDGE_ALONG: Record<EdgeId, { x1: string; y1: string; x2: string; y2: string }> = {
  top: { x1: "0", y1: "0", x2: "1", y2: "0" },
  right: { x1: "0", y1: "0", x2: "0", y2: "1" },
  bottom: { x1: "0", y1: "0", x2: "1", y2: "0" },
  left: { x1: "0", y1: "0", x2: "0", y2: "1" },
};

const EDGE_INWARD: Record<EdgeId, { x1: string; y1: string; x2: string; y2: string }> = {
  top: { x1: "0", y1: "0", x2: "0", y2: "1" },
  right: { x1: "1", y1: "0", x2: "0", y2: "0" },
  bottom: { x1: "0", y1: "1", x2: "0", y2: "0" },
  left: { x1: "0", y1: "0", x2: "1", y2: "0" },
};

/**
 * Chroma aurora rim — one soft waveform ribbon per edge (SVG + blur).
 * Only four path strings update per frame; no canvas redraw.
 */
export function ChromaAuroraCanvas({
  className = "",
  paused = false,
}: ChromaAuroraCanvasProps) {
  const reactId = useId();
  const uid = reactId.replace(/:/g, "");
  const filterId = `chroma-aurora-blur-${uid}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<Partial<Record<EdgeId, SVGPathElement | null>>>({});
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const pausedRef = useRef(paused);
  const reducedMotionRef = useRef(false);
  pausedRef.current = paused;

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      reducedMotionRef.current = motionMq.matches;
    };
    syncMotion();
    motionMq.addEventListener("change", syncMotion);

    const measure = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      sizeRef.current = { w, h };
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    };

    const paint = (time: number) => {
      const { w, h } = sizeRef.current;
      if (w < 2 || h < 2) return;

      const maxDepth = Math.min(w, h) * CHROMA_AURORA_BLEED_FRACTION;
      const samples = Math.min(64, Math.round(36 + Math.max(w, h) / 40));

      for (const edge of EDGE_ORDER) {
        const el = pathRefs.current[edge];
        if (!el) continue;
        el.setAttribute(
          "d",
          buildEdgeRibbonPath(
            edge,
            w,
            h,
            time,
            maxDepth,
            samples,
            CHROMA_AURORA_OUTSET,
          ),
        );
      }
    };

    const frame = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const running =
        document.visibilityState === "visible" &&
        !pausedRef.current &&
        !reducedMotionRef.current;

      if (running) {
        paint((timestamp - startRef.current) / 1000);
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    measure();
    paint(0);
    rafRef.current = requestAnimationFrame(frame);

    const ro = new ResizeObserver(() => {
      measure();
      if (pausedRef.current || reducedMotionRef.current) {
        paint(0);
      } else if (startRef.current) {
        paint((performance.now() - startRef.current) / 1000);
      }
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      motionMq.removeEventListener("change", syncMotion);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={["chroma-aurora-canvas", "theme-dark", className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden
    >
      <svg
        ref={svgRef}
        className="chroma-aurora-canvas__svg"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <filter
            id={filterId}
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation={CHROMA_AURORA_BLUR} />
          </filter>

          {EDGE_ORDER.map((edge) => {
            const [c0, c1, c2] = EDGE_GRADIENTS[edge];
            const alongId = `chroma-aurora-along-${edge}-${uid}`;
            const fadeId = `chroma-aurora-fade-${edge}-${uid}`;
            const fillId = `chroma-aurora-fill-${edge}-${uid}`;
            const along = EDGE_ALONG[edge];
            const inward = EDGE_INWARD[edge];

            return (
              <g key={edge}>
                <linearGradient
                  id={alongId}
                  gradientUnits="objectBoundingBox"
                  {...along}
                >
                  <stop offset="0%" stopColor={c0} />
                  <stop offset="50%" stopColor={c1} />
                  <stop offset="100%" stopColor={c2} />
                </linearGradient>
                <linearGradient
                  id={fadeId}
                  gradientUnits="objectBoundingBox"
                  {...inward}
                >
                  {/* Stay solid through the clipped outer half; soft only toward the crest. */}
                  <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                  <stop offset="55%" stopColor="#fff" stopOpacity="1" />
                  <stop offset="82%" stopColor="#fff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <mask
                  id={fillId}
                  maskUnits="objectBoundingBox"
                  maskContentUnits="objectBoundingBox"
                  x="0"
                  y="0"
                  width="1"
                  height="1"
                >
                  <rect x="0" y="0" width="1" height="1" fill={`url(#${fadeId})`} />
                </mask>
              </g>
            );
          })}
        </defs>

        <g filter={`url(#${filterId})`} opacity="0.95">
          {EDGE_ORDER.map((edge) => {
            const alongId = `chroma-aurora-along-${edge}-${uid}`;
            const fillId = `chroma-aurora-fill-${edge}-${uid}`;
            return (
              <path
                key={edge}
                ref={(el) => {
                  pathRefs.current[edge] = el;
                }}
                fill={`url(#${alongId})`}
                mask={`url(#${fillId})`}
                opacity={0.85}
              />
            );
          })}
        </g>
      </svg>
      <div className="chroma-aurora-canvas__vignette" />
    </div>
  );
}
