"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { SparkPlaygroundControls } from "@/components/effects/spark-playground-controls";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";
import { PrimaryHeroSparkLayer } from "@/components/sections/primary-hero/primary-hero-spark-layer";
import {
  DEFAULT_CHAPTER_PRESETS,
  type ParticlePreset,
  type ParticleShape,
} from "@/components/sections/primary-hero/particle-presets";
import {
  HERO_SPARK_COLOR,
  HERO_SPARK_SHAPE_SCALE,
  HERO_SPARK_SNAPSHOT,
  HOME_HERO_CHAPTER_COUNT,
  normalizeHeroChapterPresets,
} from "@/components/sections/primary-hero/spark-hero-config";
import { heroSlates } from "@/content/site";
import { createDefaultSparkHeroSnapshot } from "@/lib/spark-hero-snapshot";
import { snapshotFromTunerState } from "@/lib/spark-tuner-storage";
import type { SparkBlend } from "@/components/sections/primary-hero/spark-canvas";

function clonePresets(presets: ParticlePreset[]) {
  return presets.map((preset) => ({ ...preset }));
}

function applySnapshot(snapshot: typeof HERO_SPARK_SNAPSHOT) {
  return {
    presets: normalizeHeroChapterPresets(snapshot.presets),
    showBoundary: snapshot.showBoundary ?? false,
  };
}

function homeSnapshotState() {
  return applySnapshot(HERO_SPARK_SNAPSHOT);
}

function defaultPresetsForChapter(chapterIndex: number) {
  return normalizeHeroChapterPresets(DEFAULT_CHAPTER_PRESETS)[chapterIndex]!;
}

export function SparkPlayground() {
  const homeState = homeSnapshotState();
  const [presets, setPresets] = useState(() => clonePresets(homeState.presets));
  const [activeChapter, setActiveChapter] = useState(0);
  const [shapeScale, setShapeScale] = useState(HERO_SPARK_SHAPE_SCALE);
  const [showBoundary, setShowBoundary] = useState(homeState.showBoundary);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const chapterLabels = useMemo(
    () =>
      heroSlates.map(
        (slate, index) => slate.eyebrow ?? slate.headline ?? `Chapter ${index + 1}`,
      ),
    [],
  );

  const blend: SparkBlend = useMemo(
    () => ({ from: activeChapter, to: activeChapter, t: 0 }),
    [activeChapter],
  );

  const activePreset = presets[activeChapter]!;

  const updatePreset = useCallback(
    (
      chapterIndex: number,
      key: keyof ParticlePreset,
      value: string | number,
    ) => {
      setPresets((prev) => {
        const next = clonePresets(prev);
        const preset = { ...next[chapterIndex]! };

        if (key === "shape") {
          preset.shape = value as ParticleShape;
        } else if (key === "label") {
          preset.label = String(value);
        } else if (typeof preset[key] === "number") {
          preset[key] = Number(value) as never;
        }

        next[chapterIndex] = preset;
        return next;
      });
      setActiveChapter(chapterIndex);
    },
    [],
  );

  const resetChapter = useCallback((chapterIndex: number) => {
    setPresets((prev) => {
      const next = clonePresets(prev);
      next[chapterIndex] = { ...defaultPresetsForChapter(chapterIndex) };
      return next;
    });
    setActiveChapter(chapterIndex);
  }, []);

  const resetAll = () => {
    const defaults = createDefaultSparkHeroSnapshot();
    const next = applySnapshot(defaults);
    setPresets(next.presets);
    setActiveChapter(0);
    setShapeScale(HERO_SPARK_SHAPE_SCALE);
    setShowBoundary(next.showBoundary);
  };

  const reloadHomeConfig = () => {
    const next = homeSnapshotState();
    setPresets(clonePresets(next.presets));
    setShowBoundary(next.showBoundary);
    setShapeScale(HERO_SPARK_SHAPE_SCALE);
    setActiveChapter(0);
  };

  const copySnapshot = async () => {
    const json = JSON.stringify(
      snapshotFromTunerState({
        presets,
        colorMode: HERO_SPARK_COLOR.colorMode,
        compositeMode: HERO_SPARK_COLOR.compositeMode,
        colorCycleSpeed: HERO_SPARK_COLOR.colorCycleSpeed,
        showBoundary,
      }),
      null,
      2,
    );
    await navigator.clipboard.writeText(json);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const saveAsHomeConfig = async () => {
    setSaveError(null);
    const snapshot = snapshotFromTunerState({
      presets: normalizeHeroChapterPresets(presets),
      colorMode: HERO_SPARK_COLOR.colorMode,
      compositeMode: HERO_SPARK_COLOR.compositeMode,
      colorCycleSpeed: HERO_SPARK_COLOR.colorCycleSpeed,
      showBoundary: false,
    });

    try {
      const response = await fetch("/api/dev/spark-hero-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Save failed");
      }
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Could not save home config",
      );
    }
  };

  return (
    <div className="pb-24">
      <header className="keyline-b">
        <RuledGrid className="py-10">
          <SiteGridSubgrid>
            <div className="grid-span-6 lg:grid-span-8">
              <p className="text-meta">Effects · Home hero</p>
              <h1 className="display-lg mt-3">Spark playground</h1>
              <p className="mt-4 max-w-2xl leading-relaxed text-secondary">
                Loaded from{" "}
                <code className="font-mono text-xs text-primary">
                  src/content/spark-hero-snapshot.json
                </code>
                . Tune all {HOME_HERO_CHAPTER_COUNT} homepage hero chapters, then
                use{" "}
                <strong className="font-medium text-primary">
                  Save as home config
                </strong>{" "}
                to write presets to{" "}
                <Link href="/" className="border-b border-current text-primary">
                  the home page
                </Link>
                .
              </p>
              <p className="mt-3 text-sm text-secondary">
                <button
                  type="button"
                  onClick={reloadHomeConfig}
                  className="border-b border-current text-primary"
                >
                  Reload home config
                </button>{" "}
                discards unsaved edits and re-reads the JSON file (restart dev
                server after editing the file by hand).
              </p>
            </div>
          </SiteGridSubgrid>
        </RuledGrid>
      </header>

      <section className="spark-playground-workspace mt-8">
        <RuledGrid className="spark-playground-band primary-hero-stage primary-hero-stage--split-scene">
          <PrimaryHeroSparkLayer
            presets={presets}
            blend={blend}
            showBoundary={showBoundary}
            shapeScale={shapeScale}
            colorMode={HERO_SPARK_COLOR.colorMode}
            compositeMode={HERO_SPARK_COLOR.compositeMode}
            colorCycleSpeed={HERO_SPARK_COLOR.colorCycleSpeed}
          />

          <SiteGridSubgrid className="spark-playground-band__layout">
            <aside className="spark-playground-rail">
              <SparkPlaygroundControls
                presets={presets}
                chapterLabels={chapterLabels}
                activeChapter={activeChapter}
                shapeScale={shapeScale}
                showBoundary={showBoundary}
                copied={copied}
                onSelectChapter={setActiveChapter}
                onUpdatePreset={updatePreset}
                onResetChapter={resetChapter}
                onShapeScaleChange={setShapeScale}
                onShowBoundaryChange={setShowBoundary}
                onResetAll={resetAll}
                onCopySnapshot={copySnapshot}
              />
            </aside>

            <div className="spark-playground-viz" aria-hidden>
              <p className="spark-playground-viz__caption">
                Ch {activeChapter + 1} · {activePreset.label} · scale{" "}
                {shapeScale.toFixed(1)}×
              </p>
            </div>
          </SiteGridSubgrid>
        </RuledGrid>

        <RuledGrid className="spark-playground-save-row">
          <SiteGridSubgrid>
            <div className="spark-playground-viz-actions col-full py-4 lg:col-start-7 lg:grid-span-6">
              <button
                type="button"
                onClick={saveAsHomeConfig}
                className="ui-chip ui-chip--active rounded-sm px-4 py-2 text-sm"
              >
                {saved ? "Saved to home!" : "Save as home config"}
              </button>
              {saveError ? (
                <p className="text-error mt-2 text-xs">
                  {saveError}
                </p>
              ) : null}
            </div>
          </SiteGridSubgrid>
        </RuledGrid>
      </section>
    </div>
  );
}
