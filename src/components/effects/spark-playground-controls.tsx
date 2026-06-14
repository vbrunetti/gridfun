"use client";

import { SparkChapterStyles } from "@/components/effects/spark-chapter-styles";
import type { ParticlePreset } from "@/components/sections/primary-hero/particle-presets";
import { HERO_SPARK_SHAPE_SCALE } from "@/components/sections/primary-hero/spark-hero-config";

type SparkPlaygroundControlsProps = {
  presets: ParticlePreset[];
  chapterLabels: string[];
  activeChapter: number;
  shapeScale: number;
  showBoundary: boolean;
  copied: boolean;
  onSelectChapter: (index: number) => void;
  onUpdatePreset: (
    chapterIndex: number,
    key: keyof ParticlePreset,
    value: string | number,
  ) => void;
  onResetChapter: (chapterIndex: number) => void;
  onShapeScaleChange: (value: number) => void;
  onShowBoundaryChange: (value: boolean) => void;
  onResetAll: () => void;
  onCopySnapshot: () => void;
};

export function SparkPlaygroundControls({
  presets,
  chapterLabels,
  activeChapter,
  shapeScale,
  showBoundary,
  copied,
  onSelectChapter,
  onUpdatePreset,
  onResetChapter,
  onShapeScaleChange,
  onShowBoundaryChange,
  onResetAll,
  onCopySnapshot,
}: SparkPlaygroundControlsProps) {
  return (
    <>
      <SparkChapterStyles
        presets={presets}
        chapterLabels={chapterLabels}
        activeChapter={activeChapter}
        onSelectChapter={onSelectChapter}
        onUpdatePreset={onUpdatePreset}
        onResetChapter={onResetChapter}
      />

      <section className="keyline-t mt-6 space-y-4 pt-6">
        <p className="text-meta">Preview</p>
        <label className="flex items-center gap-2 text-xs text-secondary">
          <input
            type="checkbox"
            checked={showBoundary}
            onChange={(event) => onShowBoundaryChange(event.target.checked)}
          />
          Show shape boundary
        </label>
        <label className="block text-xs text-secondary">
          Shape scale {shapeScale.toFixed(2)}× (home {HERO_SPARK_SHAPE_SCALE}×)
          <input
            type="range"
            min={0.8}
            max={3.5}
            step={0.05}
            value={shapeScale}
            onChange={(event) =>
              onShapeScaleChange(Number.parseFloat(event.target.value))
            }
            className="mt-1.5 w-full"
          />
        </label>
      </section>

      <div className="keyline-t mt-6 flex flex-wrap gap-x-4 gap-y-2 pt-6 text-xs">
        <button
          type="button"
          onClick={onResetAll}
          className="text-secondary underline-offset-2 hover:text-primary hover:underline"
        >
          Reset all
        </button>
        <button
          type="button"
          onClick={onCopySnapshot}
          className="text-secondary underline-offset-2 hover:text-primary hover:underline"
        >
          {copied ? "Copied JSON" : "Copy snapshot JSON"}
        </button>
      </div>
    </>
  );
}
