"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_CHAPTER_PRESETS,
  PRESET_PARAM_GROUPS,
  PRESET_PARAM_META,
  TREFOIL_FAMILY_SHAPES,
  type ParticlePreset,
  type ParticleShape,
} from "@/components/sections/primary-hero/particle-presets";
import {
  HERO_SPARK_PRESETS,
  HERO_SPARK_SHAPE_SCALE,
  HERO_SPARK_SNAPSHOT,
  presetsForHeroChapters,
} from "@/components/sections/primary-hero/spark-hero-config";
import {
  SparkCanvas,
  type SparkBlend,
} from "@/components/sections/primary-hero/spark-canvas";
import { createDefaultSparkHeroSnapshot } from "@/lib/spark-hero-snapshot";
import {
  readSparkTunerDraft,
  snapshotFromTunerState,
  writeSparkTunerDraft,
} from "@/lib/spark-tuner-storage";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";

function clonePresets(presets: ParticlePreset[]) {
  return presets.map((p) => ({ ...p }));
}

function applySnapshot(snapshot: typeof HERO_SPARK_SNAPSHOT) {
  return {
    presets: clonePresets(snapshot.presets),
    showBoundary: snapshot.showBoundary ?? true,
  };
}

export function SparkPlayground() {
  const [ready, setReady] = useState(false);
  const [presets, setPresets] = useState(() => clonePresets(HERO_SPARK_PRESETS));
  const [activeChapter, setActiveChapter] = useState(0);
  const [shapeScale, setShapeScale] = useState(HERO_SPARK_SHAPE_SCALE);
  const [showBoundary, setShowBoundary] = useState(
    HERO_SPARK_SNAPSHOT.showBoundary ?? true,
  );
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [draftSource, setDraftSource] = useState<"draft" | "saved" | "defaults">(
    "saved",
  );

  useEffect(() => {
    const draft = readSparkTunerDraft();
    if (draft) {
      const next = applySnapshot({
        ...draft,
        presets: clonePresets(
          draft.presets.length > 0
            ? draft.presets
            : presetsForHeroChapters(HERO_SPARK_SNAPSHOT.presets),
        ),
      });
      setPresets(next.presets);
      setShowBoundary(next.showBoundary);
      setDraftSource("draft");
    } else {
      const next = applySnapshot({
        ...HERO_SPARK_SNAPSHOT,
        presets: HERO_SPARK_PRESETS,
      });
      setPresets(next.presets);
      setShowBoundary(next.showBoundary);
      setShapeScale(HERO_SPARK_SHAPE_SCALE);
      setDraftSource("saved");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeSparkTunerDraft(
      snapshotFromTunerState({
        presets,
        colorMode: "ink",
        compositeMode: "source-over",
        colorCycleSpeed: HERO_SPARK_SNAPSHOT.color.colorCycleSpeed,
        showBoundary,
      }),
    );
  }, [ready, presets, showBoundary]);

  const blend: SparkBlend = useMemo(
    () => ({ from: activeChapter, to: activeChapter, t: 0 }),
    [activeChapter],
  );

  const activePreset = presets[activeChapter]!;

  const updatePreset = useCallback(
    (key: keyof ParticlePreset, value: string | number) => {
      setPresets((prev) => {
        const next = clonePresets(prev);
        const preset = { ...next[activeChapter]! };
        if (key === "shape") {
          preset.shape = value as ParticleShape;
        } else if (key === "label") {
          preset.label = String(value);
        } else if (typeof preset[key] === "number") {
          preset[key] = Number(value) as never;
        }
        next[activeChapter] = preset;
        return next;
      });
    },
    [activeChapter],
  );

  const resetChapter = () => {
    setPresets((prev) => {
      const next = clonePresets(prev);
      next[activeChapter] = {
        ...DEFAULT_CHAPTER_PRESETS[activeChapter]!,
      };
      return next;
    });
  };

  const resetAll = () => {
    const defaults = createDefaultSparkHeroSnapshot();
    const next = applySnapshot({
      ...defaults,
      presets: presetsForHeroChapters(defaults.presets),
    });
    setPresets(next.presets);
    setActiveChapter(0);
    setShapeScale(HERO_SPARK_SHAPE_SCALE);
    setShowBoundary(next.showBoundary);
    setDraftSource("defaults");
  };

  const loadSavedHomeConfig = () => {
    const next = applySnapshot({
      ...HERO_SPARK_SNAPSHOT,
      presets: HERO_SPARK_PRESETS,
    });
    setPresets(next.presets);
    setShowBoundary(next.showBoundary);
    setShapeScale(HERO_SPARK_SHAPE_SCALE);
    setDraftSource("saved");
  };

  const copySnapshot = async () => {
    const json = JSON.stringify(
      snapshotFromTunerState({
        presets,
        colorMode: "ink",
        compositeMode: "source-over",
        colorCycleSpeed: HERO_SPARK_SNAPSHOT.color.colorCycleSpeed,
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
      presets: presetsForHeroChapters([presets[activeChapter]!]),
      colorMode: "ink",
      compositeMode: "source-over",
      colorCycleSpeed: HERO_SPARK_SNAPSHOT.color.colorCycleSpeed,
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
      setDraftSource("saved");
      window.setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Could not save home config",
      );
    }
  };

  if (!ready) {
    return (
      <RuledGrid className="py-24 text-sm text-secondary">
        Loading playground…
      </RuledGrid>
    );
  }

  return (
    <div className="pb-24">
      <header className="border-b border-[var(--rule-strong)]">
        <RuledGrid className="py-10">
          <SiteGridSubgrid>
            <div className="grid-span-6 lg:grid-span-8">
              <p className="text-meta">Effects · Home hero</p>
              <h1 className="display-lg mt-3">Spark playground</h1>
              <p className="mt-4 max-w-2xl leading-relaxed text-secondary">
                Tune the homepage hero spark layer — six scroll chapters, ink
                particles, and shape scale. Your session auto-saves in this
                browser. Use{" "}
                <strong className="font-medium text-primary">
                  Save as home config
                </strong>{" "}
                to write the snapshot used on{" "}
                <Link href="/" className="border-b border-current text-primary">
                  the home page
                </Link>
                .
              </p>
              {draftSource === "draft" ? (
                <p className="mt-3 text-sm text-secondary">
                  Restored your last browser session. If this isn&apos;t what
                  you want, try{" "}
                  <button
                    type="button"
                    onClick={loadSavedHomeConfig}
                    className="border-b border-current text-primary"
                  >
                    load saved home config
                  </button>
                  .
                </p>
              ) : null}
            </div>
          </SiteGridSubgrid>
        </RuledGrid>
      </header>

      <RuledGrid className="mt-8">
        <SiteGridSubgrid className="lg:items-start">
          <div className="grid-span-6 space-y-4 lg:grid-span-8 lg:sticky lg:top-4 lg:self-start">
          <div className="relative min-h-[50dvh] overflow-hidden border border-[var(--rule-light)] bg-[var(--surface-white)]">
            <div className="primary-hero-spark-layer">
              <SparkCanvas
                presets={presets}
                blend={blend}
                showBoundary={showBoundary}
                shapeScale={shapeScale}
                colorMode="ink"
                compositeMode="source-over"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 border border-dashed border-[var(--rule-light)]" />
            <p className="pointer-events-none absolute bottom-3 left-3 text-xs text-tertiary">
              {activePreset.label} · scale {shapeScale.toFixed(1)}×
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveAsHomeConfig}
                className="rounded-sm border border-[var(--color-ink)] bg-[var(--color-ink)] px-3 py-1.5 text-xs text-[var(--color-paper)]"
              >
                {saved ? "Saved to home!" : "Save as home config"}
              </button>
              <button
                type="button"
                onClick={resetChapter}
                className="rounded-sm border border-[var(--rule-light)] px-3 py-1.5 text-xs text-secondary hover:border-[var(--rule-strong)]"
              >
                Reset chapter
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="rounded-sm border border-[var(--rule-light)] px-3 py-1.5 text-xs text-secondary hover:border-[var(--rule-strong)]"
              >
                Reset all
              </button>
              <button
                type="button"
                onClick={copySnapshot}
                className="rounded-sm border border-[var(--rule-light)] px-3 py-1.5 text-xs text-secondary hover:border-[var(--rule-strong)]"
              >
                {copied ? "Copied!" : "Copy snapshot JSON"}
              </button>
            </div>
            {saveError ? (
              <p className="text-xs text-[var(--color-crimson)]">{saveError}</p>
            ) : null}
          </div>
        </div>

        <aside className="grid-span-6 space-y-6 lg:grid-span-4">
          <div className="border border-[var(--rule-light)] p-4">
            <p className="text-meta">Chapter</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((p, i) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setActiveChapter(i)}
                  className={`rounded-sm border px-2.5 py-1 text-xs transition-colors ${
                    activeChapter === i
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "border-[var(--rule-light)] text-secondary"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <label className="mt-4 flex items-center gap-2 text-xs text-secondary">
              <input
                type="checkbox"
                checked={showBoundary}
                onChange={(e) => setShowBoundary(e.target.checked)}
              />
              Show shape boundary
            </label>
          </div>

          <div className="border border-[var(--rule-light)] p-4">
            <p className="text-meta">Home viewport</p>
            <label className="mt-3 block text-xs text-secondary">
              Shape scale {shapeScale.toFixed(2)}× (home uses{" "}
              {HERO_SPARK_SHAPE_SCALE}×)
              <input
                type="range"
                min={0.8}
                max={3.5}
                step={0.05}
                value={shapeScale}
                onChange={(e) =>
                  setShapeScale(Number.parseFloat(e.target.value))
                }
                className="mt-1 w-full"
              />
            </label>
          </div>

          <div className="border border-[var(--rule-light)] p-4">
            <p className="text-meta">Shape</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TREFOIL_FAMILY_SHAPES.map((shape) => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => updatePreset("shape", shape)}
                  className={`rounded-sm border px-3 py-1.5 text-xs capitalize ${
                    activePreset.shape === shape
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "border-[var(--rule-light)] text-secondary"
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>

          {PRESET_PARAM_GROUPS.map((group) => (
            <section
              key={group.label}
              className="border border-[var(--rule-light)] p-4"
            >
              <p className="text-meta">{group.label}</p>
              <div className="mt-4 grid gap-4">
                {group.keys.map((key) => {
                  const meta = PRESET_PARAM_META[key];
                  const value = activePreset[key];
                  if (typeof value !== "number") return null;
                  return (
                    <label key={key} className="block text-xs text-secondary">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="font-mono text-[11px] text-primary">
                          {key}
                        </span>
                        <span className="tabular-nums">{value}</span>
                      </span>
                      {meta.hint ? (
                        <span className="mt-0.5 block text-[10px] text-tertiary">
                          {meta.hint}
                        </span>
                      ) : null}
                      <input
                        type="range"
                        min={meta.min}
                        max={meta.max}
                        step={meta.step}
                        value={value}
                        onChange={(e) =>
                          updatePreset(key, Number.parseFloat(e.target.value))
                        }
                        className="mt-1.5 w-full"
                      />
                    </label>
                  );
                })}
              </div>
            </section>
          ))}

          <section className="border border-[var(--rule-light)] p-4">
            <p className="text-meta">Preset reference</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[28rem] text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--rule-light)] text-tertiary">
                    <th className="py-2 pr-3">Ch</th>
                    <th className="py-2 pr-3">Shape</th>
                    <th className="py-2 pr-3">Count</th>
                    <th className="py-2 pr-3">Life (s)</th>
                    <th className="py-2 pr-3">Speed</th>
                    <th className="py-2 pr-3">Turb</th>
                    <th className="py-2 pr-3">Alpha</th>
                    <th className="py-2">Scale</th>
                  </tr>
                </thead>
                <tbody>
                  {presets.map((p, i) => (
                    <tr
                      key={p.label}
                      className={`border-b border-[var(--rule-light)] ${
                        activeChapter === i ? "bg-[var(--color-paper)]" : ""
                      }`}
                    >
                      <td className="py-2 pr-3">{i + 1}</td>
                      <td className="py-2 pr-3 capitalize">{p.shape}</td>
                      <td className="py-2 pr-3 tabular-nums">{p.count}</td>
                      <td className="py-2 pr-3 tabular-nums">
                        {p.lifespanMin}–{p.lifespanMax}
                      </td>
                      <td className="py-2 pr-3 tabular-nums">{p.speed}</td>
                      <td className="py-2 pr-3 tabular-nums">{p.turbulence}</td>
                      <td className="py-2 pr-3 tabular-nums">{p.alpha}</td>
                      <td className="py-2 tabular-nums">{p.boundaryScale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </aside>
        </SiteGridSubgrid>
      </RuledGrid>
    </div>
  );
}
