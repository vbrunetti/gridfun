"use client";

import { useEffect, useRef } from "react";
import { HERO_SPARK_COLOR, HERO_SPARK_SHAPE_SCALE } from "./spark-hero-config";
import { SparkCanvas, type SparkBlend } from "./spark-canvas";
import type { ParticlePreset } from "./particle-presets";

const DESKTOP_QUERY = "(min-width: 1024px)";
/** Mobile — cap square frame by stage height when the zone is taller than wide. */
const MOBILE_SPARK_HEIGHT_RATIO = 0.75;
/** Spark zone width on desktop (cols 7–12 = half the 12-col grid). */
const DESKTOP_SPARK_ZONE_COLS = 6;
const DESKTOP_SPARK_ZONE_START_COL = 12 - DESKTOP_SPARK_ZONE_COLS + 1;
const MOBILE_SPARK_ZONE_START_COL = 4;

function columnMetrics(
  gridWidth: number,
  paddingStart: number,
  paddingEnd: number,
  columnGap: number,
  columnCount: number,
) {
  const inner = gridWidth - paddingStart - paddingEnd;
  const colWidth = (inner - columnGap * (columnCount - 1)) / columnCount;
  return { colWidth, colStep: colWidth + columnGap };
}

/** Left edge of column `col` (1-indexed) inside a CSS grid content box. */
function columnLeftEdge(
  gridWidth: number,
  paddingStart: number,
  paddingEnd: number,
  columnGap: number,
  columnCount: number,
  col: number,
): number {
  const { colStep } = columnMetrics(
    gridWidth,
    paddingStart,
    paddingEnd,
    columnGap,
    columnCount,
  );
  return paddingStart + (col - 1) * colStep;
}

/** Right edge of column `col` (1-indexed) inside a CSS grid content box. */
function columnRightEdge(
  gridWidth: number,
  paddingStart: number,
  paddingEnd: number,
  columnGap: number,
  columnCount: number,
  col: number,
): number {
  const { colWidth, colStep } = columnMetrics(
    gridWidth,
    paddingStart,
    paddingEnd,
    columnGap,
    columnCount,
  );
  return paddingStart + col * colWidth + (col - 1) * columnGap;
}

type PrimaryHeroSparkLayerProps = {
  presets: ParticlePreset[];
  blend: SparkBlend;
  paused?: boolean;
};

export function PrimaryHeroSparkLayer({
  presets,
  blend,
  paused = false,
}: PrimaryHeroSparkLayerProps) {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    const stage = slot.closest<HTMLElement>(".primary-hero-stage--split-scene");
    if (!stage) return;

    const sync = () => {
      const stageHeight = stage.clientHeight;
      if (stageHeight <= 0) return;

      const desktop = window.matchMedia(DESKTOP_QUERY).matches;
      const columnCount = desktop ? 12 : 6;
      const anchorCol = columnCount;
      const zoneStartCol = desktop
        ? DESKTOP_SPARK_ZONE_START_COL
        : MOBILE_SPARK_ZONE_START_COL;

      const styles = getComputedStyle(stage);
      const paddingStart = Number.parseFloat(styles.paddingLeft) || 0;
      const paddingEnd = Number.parseFloat(styles.paddingRight) || 0;
      const columnGap = Number.parseFloat(styles.columnGap) || 0;

      const zoneLeft = columnLeftEdge(
        stage.clientWidth,
        paddingStart,
        paddingEnd,
        columnGap,
        columnCount,
        zoneStartCol,
      );
      const zoneRight = columnRightEdge(
        stage.clientWidth,
        paddingStart,
        paddingEnd,
        columnGap,
        columnCount,
        anchorCol,
      );
      const zoneWidth = Math.max(0, zoneRight - zoneLeft);

      const sparkSize = desktop
        ? zoneWidth
        : Math.min(stageHeight * MOBILE_SPARK_HEIGHT_RATIO, zoneWidth);
      const sparkLeft = zoneRight - sparkSize;

      stage.style.setProperty("--hero-spark-h", `${sparkSize}px`);
      stage.style.setProperty("--hero-spark-w", `${sparkSize}px`);
      stage.style.setProperty("--hero-spark-left", `${sparkLeft}px`);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(stage);
    window.addEventListener("resize", sync, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
      stage.style.removeProperty("--hero-spark-h");
      stage.style.removeProperty("--hero-spark-w");
      stage.style.removeProperty("--hero-spark-left");
    };
  }, []);

  return (
    <div ref={slotRef} className="primary-hero-spark-layer" aria-hidden>
      <SparkCanvas
        presets={presets}
        blend={blend}
        paused={paused}
        showBoundary={false}
        shapeScale={HERO_SPARK_SHAPE_SCALE}
        {...HERO_SPARK_COLOR}
      />
    </div>
  );
}
