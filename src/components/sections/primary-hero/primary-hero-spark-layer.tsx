"use client";

import { useEffect, useRef } from "react";
import { HERO_SPARK_COLOR, HERO_SPARK_SHAPE_SCALE } from "./spark-hero-config";
import {
  SparkCanvas,
  type SparkBlend,
  type SparkColorMode,
  type SparkCompositeMode,
} from "./spark-canvas";
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

export type PrimaryHeroSparkLayerProps = {
  presets: ParticlePreset[];
  blend: SparkBlend;
  paused?: boolean;
  showBoundary?: boolean;
  shapeScale?: number;
  colorMode?: SparkColorMode;
  compositeMode?: SparkCompositeMode;
  colorCycleSpeed?: number;
};

export function PrimaryHeroSparkLayer({
  presets,
  blend,
  paused = false,
  showBoundary = false,
  shapeScale = HERO_SPARK_SHAPE_SCALE,
  colorMode = HERO_SPARK_COLOR.colorMode,
  compositeMode = HERO_SPARK_COLOR.compositeMode,
  colorCycleSpeed = HERO_SPARK_COLOR.colorCycleSpeed,
}: PrimaryHeroSparkLayerProps) {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    const stage = slot.closest<HTMLElement>(".primary-hero-stage--split-scene");
    if (!stage) return;

    /** Column metrics come from the master grid; stage may be a subgrid cell. */
    const metricGrid = stage.closest<HTMLElement>(".site-grid") ?? stage;

    const sync = () => {
      const stageHeight = stage.clientHeight;
      if (stageHeight <= 0) return;

      const desktop = window.matchMedia(DESKTOP_QUERY).matches;
      const columnCount = desktop ? 12 : 6;
      const anchorCol = columnCount;
      const zoneStartCol = desktop
        ? DESKTOP_SPARK_ZONE_START_COL
        : MOBILE_SPARK_ZONE_START_COL;

      const styles = getComputedStyle(metricGrid);
      const paddingStart = Number.parseFloat(styles.paddingLeft) || 0;
      const paddingEnd = Number.parseFloat(styles.paddingRight) || 0;
      const columnGap = Number.parseFloat(styles.columnGap) || 0;

      const zoneLeft = columnLeftEdge(
        metricGrid.clientWidth,
        paddingStart,
        paddingEnd,
        columnGap,
        columnCount,
        zoneStartCol,
      );
      const zoneRight = columnRightEdge(
        metricGrid.clientWidth,
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
      const sparkLeftOnGrid = zoneRight - sparkSize;
      const stageOffset =
        stage === metricGrid
          ? 0
          : stage.getBoundingClientRect().left -
            metricGrid.getBoundingClientRect().left;

      stage.style.setProperty("--hero-spark-h", `${sparkSize}px`);
      stage.style.setProperty("--hero-spark-w", `${sparkSize}px`);
      stage.style.setProperty(
        "--hero-spark-left",
        `${sparkLeftOnGrid - stageOffset}px`,
      );
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
        showBoundary={showBoundary}
        shapeScale={shapeScale}
        colorMode={colorMode}
        compositeMode={compositeMode}
        colorCycleSpeed={colorCycleSpeed}
        canvasBleed={0.14}
      />
    </div>
  );
}
