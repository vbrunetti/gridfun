"use client";

import Link from "next/link";
import { SparkCanvas } from "./spark-canvas";
import { HERO_SPARK_COLOR, HERO_SPARK_PRESETS, HERO_SPARK_SHAPE_SCALE } from "./spark-hero-config";

type SparkHeroPreviewProps = {
  /** Chapter blend for the preview canvas. Defaults to chapter 1. */
  blend?: { from: number; to: number; t: number };
};

export function SparkHeroPreview({
  blend = { from: 0, to: 0, t: 0 },
}: SparkHeroPreviewProps) {
  return (
    <div className="mx-auto max-w-[90rem] px-[var(--grid-margin)] pb-24">
      <header className="border-b border-[var(--rule-strong)] py-10">
        <p className="text-meta">Effects · Home hero</p>
        <h1 className="display-lg mt-3">Spark particles</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-secondary">
          Saved configuration for the homepage hero — palette cycle at{" "}
          {HERO_SPARK_COLOR.colorCycleSpeed} rev/s with{" "}
          <span className="font-mono text-[11px] text-primary">
            {HERO_SPARK_COLOR.compositeMode}
          </span>{" "}
          blend. Scroll chapters on the home page morph shapes using these
          presets.
        </p>
        <p className="mt-3 text-sm text-secondary">
          <Link
            href="/effects/spark-particles"
            className="border-b border-current text-primary"
          >
            Open tuner
          </Link>
          {" · "}
          <Link href="/" className="border-b border-current text-primary">
            View on home
          </Link>
        </p>
      </header>

      <div className="relative mt-8 min-h-[100dvh] overflow-hidden border border-[var(--rule-light)] bg-[var(--surface-white)]">
        <div className="primary-hero-spark-layer">
          <SparkCanvas
            presets={HERO_SPARK_PRESETS}
            blend={blend}
            showBoundary={false}
            shapeScale={HERO_SPARK_SHAPE_SCALE}
            {...HERO_SPARK_COLOR}
          />
        </div>
        <p className="pointer-events-none absolute bottom-3 left-3 text-xs text-tertiary">
          Ch {blend.from + 1}
          {blend.from !== blend.to
            ? ` → ${blend.to + 1} · ${Math.round(blend.t * 100)}%`
            : ""}
        </p>
      </div>
    </div>
  );
}
