"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_CHAPTER_PRESETS,
  PARTICLE_SHAPES,
  PRESET_PARAM_GROUPS,
  PRESET_PARAM_META,
  type ParticlePreset,
  type ParticleShape,
} from "@/components/sections/primary-hero/particle-presets";
import {
  SparkCanvas,
  type SparkBlend,
} from "@/components/sections/primary-hero/spark-canvas";

type TunerMode = "chapter" | "morph";

function clonePresets(presets: ParticlePreset[]) {
  return presets.map((p) => ({ ...p }));
}

export function ParticleTuner() {
  const [presets, setPresets] = useState(() =>
    clonePresets(DEFAULT_CHAPTER_PRESETS),
  );
  const [activeChapter, setActiveChapter] = useState(0);
  const [mode, setMode] = useState<TunerMode>("chapter");
  const [morphFrom, setMorphFrom] = useState(0);
  const [morphTo, setMorphTo] = useState(1);
  const [morphT, setMorphT] = useState(0);
  const [showBoundary, setShowBoundary] = useState(true);
  const [copied, setCopied] = useState(false);

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
    setPresets(clonePresets(DEFAULT_CHAPTER_PRESETS));
    setActiveChapter(0);
    setMorphFrom(0);
    setMorphTo(1);
    setMorphT(0);
  };

  const copyPresets = async () => {
    const json = JSON.stringify(presets, null, 2);
    await navigator.clipboard.writeText(json);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-[90rem] px-[var(--grid-margin)] pb-24">
      <header className="border-b border-[var(--rule-strong)] py-10">
        <p className="text-meta">Effects · Direction A</p>
        <h1 className="display-lg mt-3">Hero spark presets</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-secondary">
          Tune each chapter&apos;s feel before wiring into the scroll hero. Preview
          at ~50% viewport in the canvas below. Morph mode blends adjacent
          chapters the same way scroll crossfade will.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]">
        <div className="relative min-h-[50dvh] overflow-hidden border border-[var(--rule-light)] bg-[var(--surface-white)]">
          <SparkCanvas
            presets={presets}
            blend={blend}
            showBoundary={showBoundary}
          />
          <div className="pointer-events-none absolute inset-0 border border-dashed border-[var(--rule-light)]" />
          <p className="pointer-events-none absolute bottom-3 left-3 text-xs text-tertiary">
            {mode === "chapter"
              ? activePreset.label
              : `Morph ${morphFrom + 1} → ${morphTo + 1} · ${Math.round(morphT * 100)}%`}
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

          <div className="flex flex-wrap gap-2">
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
              onClick={copyPresets}
              className="rounded-sm border border-[var(--rule-light)] px-3 py-1.5 text-xs text-secondary hover:border-[var(--rule-strong)]"
            >
              {copied ? "Copied!" : "Copy JSON"}
            </button>
          </div>
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
