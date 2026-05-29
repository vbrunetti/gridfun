"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_CHAPTER_PRESETS,
  PARTICLE_SHAPES,
  PRESET_PARAM_GROUPS,
  PRESET_PARAM_META,
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
  SPARK_COMPOSITE_MODES,
  type SparkBlend,
  type SparkColorMode,
  type SparkCompositeMode,
} from "@/components/sections/primary-hero/spark-canvas";
import { sparkPalette } from "@/lib/colors";
import { createDefaultSparkHeroSnapshot } from "@/lib/spark-hero-snapshot";
import {
  readSparkTunerDraft,
  snapshotFromTunerState,
  writeSparkTunerDraft,
} from "@/lib/spark-tuner-storage";

type TunerMode = "chapter" | "morph";

function clonePresets(presets: ParticlePreset[]) {
  return presets.map((p) => ({ ...p }));
}

function applySnapshot(snapshot: typeof HERO_SPARK_SNAPSHOT) {
  return {
    presets: clonePresets(snapshot.presets),
    colorMode: snapshot.color.colorMode,
    compositeMode: snapshot.color.compositeMode,
    colorCycleSpeed: snapshot.color.colorCycleSpeed,
    showBoundary: snapshot.showBoundary ?? true,
  };
}

export function SparkPlayground() {
  const [ready, setReady] = useState(false);
  const [presets, setPresets] = useState(() => clonePresets(HERO_SPARK_PRESETS));
  const [activeChapter, setActiveChapter] = useState(0);
  const [mode, setMode] = useState<TunerMode>("chapter");
  const [morphFrom, setMorphFrom] = useState(0);
  const [morphTo, setMorphTo] = useState(1);
  const [morphT, setMorphT] = useState(0);
  const [shapeScale, setShapeScale] = useState(HERO_SPARK_SHAPE_SCALE);
  const [showBoundary, setShowBoundary] = useState(
    HERO_SPARK_SNAPSHOT.showBoundary ?? true,
  );
  const [colorMode, setColorMode] = useState<SparkColorMode>(
    HERO_SPARK_SNAPSHOT.color.colorMode,
  );
  const [compositeMode, setCompositeMode] = useState<SparkCompositeMode>(
    HERO_SPARK_SNAPSHOT.color.compositeMode,
  );
  const [colorCycleSpeed, setColorCycleSpeed] = useState(
    HERO_SPARK_SNAPSHOT.color.colorCycleSpeed,
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
        presets: presetsForHeroChapters(draft.presets),
      });
      setPresets(next.presets);
      setColorMode(next.colorMode);
      setCompositeMode(next.compositeMode);
      setColorCycleSpeed(next.colorCycleSpeed);
      setShowBoundary(next.showBoundary);
      setDraftSource("draft");
    } else {
      const next = applySnapshot({
        ...HERO_SPARK_SNAPSHOT,
        presets: HERO_SPARK_PRESETS,
      });
      setPresets(next.presets);
      setColorMode(next.colorMode);
      setCompositeMode(next.compositeMode);
      setColorCycleSpeed(next.colorCycleSpeed);
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
        colorMode,
        compositeMode,
        colorCycleSpeed,
        showBoundary,
      }),
    );
  }, [
    ready,
    presets,
    colorMode,
    compositeMode,
    colorCycleSpeed,
    showBoundary,
  ]);

  const blend: SparkBlend = useMemo(() => {
    if (mode === "chapter") {
      return { from: activeChapter, to: activeChapter, t: 0 };
    }
    return { from: morphFrom, to: morphTo, t: morphT };
  }, [mode, activeChapter, morphFrom, morphTo, morphT]);

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
    setMode("chapter");
    setMorphFrom(0);
    setMorphTo(1);
    setMorphT(0);
    setShapeScale(HERO_SPARK_SHAPE_SCALE);
    setColorMode(next.colorMode);
    setCompositeMode(next.compositeMode);
    setColorCycleSpeed(next.colorCycleSpeed);
    setShowBoundary(next.showBoundary);
    setDraftSource("defaults");
  };

  const loadSavedHomeConfig = () => {
    const next = applySnapshot({
      ...HERO_SPARK_SNAPSHOT,
      presets: HERO_SPARK_PRESETS,
    });
    setPresets(next.presets);
    setColorMode(next.colorMode);
    setCompositeMode(next.compositeMode);
    setColorCycleSpeed(next.colorCycleSpeed);
    setShowBoundary(next.showBoundary);
    setShapeScale(HERO_SPARK_SHAPE_SCALE);
    setDraftSource("saved");
  };

  const copySnapshot = async () => {
    const json = JSON.stringify(
      snapshotFromTunerState({
        presets,
        colorMode,
        compositeMode,
        colorCycleSpeed,
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
      presets: presetsForHeroChapters(presets),
      colorMode,
      compositeMode,
      colorCycleSpeed,
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
      <div className="mx-auto max-w-[90rem] px-[var(--grid-margin)] py-24 text-sm text-secondary">
        Loading playground…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[90rem] px-[var(--grid-margin)] pb-24">
      <header className="border-b border-[var(--rule-strong)] py-10">
        <p className="text-meta">Effects · Home hero</p>
        <h1 className="display-lg mt-3">Spark playground</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-secondary">
          Tune the homepage hero spark layer — six scroll chapters, palette and
          blend modes, morph preview, and shape scale. Your session auto-saves in
          this browser. Use{" "}
          <strong className="font-medium text-primary">Save as home config</strong>{" "}
          to write the snapshot used on{" "}
          <Link href="/" className="border-b border-current text-primary">
            the home page
          </Link>
          .
        </p>
        {draftSource === "draft" ? (
          <p className="mt-3 text-sm text-secondary">
            Restored your last browser session. If this isn&apos;t what you
            want, try{" "}
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
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]">
        <div className="relative min-h-[50dvh] overflow-hidden border border-[var(--rule-light)] bg-[var(--surface-white)]">
          <div className="primary-hero-spark-layer">
            <SparkCanvas
              presets={presets}
              blend={blend}
              showBoundary={showBoundary}
              shapeScale={shapeScale}
              colorMode={colorMode}
              compositeMode={compositeMode}
              colorCycleSpeed={colorCycleSpeed}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 border border-dashed border-[var(--rule-light)]" />
          <p className="pointer-events-none absolute bottom-3 left-3 text-xs text-tertiary">
            {mode === "chapter"
              ? activePreset.label
              : `Morph ${morphFrom + 1} → ${morphTo + 1} · ${Math.round(morphT * 100)}%`}
            {" · "}
            scale {shapeScale.toFixed(1)}×
          </p>
        </div>

        <aside className="space-y-6">
          <div className="border border-[var(--rule-light)] p-4">
            <p className="text-meta">Mode</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["chapter", "morph"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-sm border px-3 py-1.5 text-sm capitalize transition-colors ${
                    mode === m
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "border-[var(--rule-light)] text-secondary hover:border-[var(--rule-strong)]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {mode === "chapter" ? (
              <div className="mt-4 flex flex-wrap gap-2">
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
            ) : (
              <div className="mt-4 space-y-3">
                <label className="block text-xs text-secondary">
                  From chapter
                  <select
                    className="mt-1 w-full border border-[var(--rule-light)] bg-transparent px-2 py-1.5 text-sm"
                    value={morphFrom}
                    onChange={(e) =>
                      setMorphFrom(Number.parseInt(e.target.value, 10))
                    }
                  >
                    {presets.map((p, i) => (
                      <option key={p.label} value={i}>
                        {i + 1}. {p.shape}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs text-secondary">
                  To chapter
                  <select
                    className="mt-1 w-full border border-[var(--rule-light)] bg-transparent px-2 py-1.5 text-sm"
                    value={morphTo}
                    onChange={(e) =>
                      setMorphTo(Number.parseInt(e.target.value, 10))
                    }
                  >
                    {presets.map((p, i) => (
                      <option key={p.label} value={i}>
                        {i + 1}. {p.shape}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs text-secondary">
                  Blend {Math.round(morphT * 100)}%
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={morphT}
                    onChange={(e) => setMorphT(Number.parseFloat(e.target.value))}
                    className="mt-1 w-full"
                  />
                </label>
              </div>
            )}

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
            <p className="text-meta">Color</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  ["ink", "Ink"],
                  ["palette", "Palette"],
                  ["cycle", "Cycle"],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setColorMode(mode)}
                  className={`rounded-sm border px-3 py-1.5 text-sm transition-colors ${
                    colorMode === mode
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "border-[var(--rule-light)] text-secondary hover:border-[var(--rule-strong)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {sparkPalette.map((hex) => (
                <span
                  key={hex}
                  className="h-4 w-4 rounded-sm border border-[var(--rule-light)]"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>

            {colorMode === "cycle" ? (
              <label className="mt-4 block text-xs text-secondary">
                Cycle speed {colorCycleSpeed.toFixed(2)} rev/s
                <input
                  type="range"
                  min={0.02}
                  max={0.35}
                  step={0.01}
                  value={colorCycleSpeed}
                  onChange={(e) =>
                    setColorCycleSpeed(Number.parseFloat(e.target.value))
                  }
                  className="mt-1 w-full"
                />
              </label>
            ) : null}

            <p className="text-meta mt-6">Blend mode</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SPARK_COMPOSITE_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCompositeMode(mode)}
                  className={`rounded-sm border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                    compositeMode === mode
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "border-[var(--rule-light)] text-secondary hover:border-[var(--rule-strong)]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

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
        </aside>
      </div>

      {mode === "chapter" ? (
        <div className="mt-10 space-y-8">
          <div className="border border-[var(--rule-light)] p-4">
            <p className="text-meta">Shape</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PARTICLE_SHAPES.map((shape) => (
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
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.keys.map((key) => {
                  const meta = PRESET_PARAM_META[key];
                  const value = activePreset[key];
                  if (typeof value !== "number") return null;
                  return (
                    <label
                      key={key}
                      className="block text-xs text-secondary"
                    >
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
        </div>
      ) : null}

      <section className="mt-12 border border-[var(--rule-light)] p-4">
        <p className="text-meta">Preset reference</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[48rem] text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--rule-light)] text-tertiary">
                <th className="py-2 pr-4">Ch</th>
                <th className="py-2 pr-4">Shape</th>
                <th className="py-2 pr-4">Count</th>
                <th className="py-2 pr-4">Life (s)</th>
                <th className="py-2 pr-4">Speed</th>
                <th className="py-2 pr-4">Turb</th>
                <th className="py-2 pr-4">Alpha</th>
                <th className="py-2">Scale</th>
              </tr>
            </thead>
            <tbody>
              {presets.map((p, i) => (
                <tr
                  key={p.label}
                  className={`border-b border-[var(--rule-light)] ${
                    mode === "chapter" && activeChapter === i
                      ? "bg-[var(--color-paper)]"
                      : ""
                  }`}
                >
                  <td className="py-2 pr-4">{i + 1}</td>
                  <td className="py-2 pr-4 capitalize">{p.shape}</td>
                  <td className="py-2 pr-4 tabular-nums">{p.count}</td>
                  <td className="py-2 pr-4 tabular-nums">
                    {p.lifespanMin}–{p.lifespanMax}
                  </td>
                  <td className="py-2 pr-4 tabular-nums">{p.speed}</td>
                  <td className="py-2 pr-4 tabular-nums">{p.turbulence}</td>
                  <td className="py-2 pr-4 tabular-nums">{p.alpha}</td>
                  <td className="py-2 tabular-nums">{p.boundaryScale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
