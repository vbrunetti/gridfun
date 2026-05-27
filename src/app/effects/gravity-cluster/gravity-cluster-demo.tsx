"use client";

import { useCallback, useMemo, useState } from "react";
import {
  applyBaseToPresets,
  DEFAULT_CHAPTER_COUNT,
  DEFAULT_GRAVITY_BASE,
  DEFAULT_GRAVITY_PRESETS,
  GRAVITY_PARAM_GROUPS,
  GRAVITY_PARAM_META,
  GRAVITY_SHARED_KEYS,
  resolveClusterParams,
  type GravityClusterPreset,
  type ParticleShape,
} from "@/components/effects/gravity-cluster-presets";
import { PARTICLE_SHAPES } from "@/components/sections/primary-hero/particle-shape";
import {
  GravityClusterCanvas,
  type GravityClusterBlend,
} from "@/components/effects/gravity-cluster-canvas";

function clonePresets(presets: GravityClusterPreset[]) {
  return presets.map((p) => ({ ...p }));
}

export function GravityClusterDemo() {
  const [presets, setPresets] = useState(() =>
    clonePresets(DEFAULT_GRAVITY_PRESETS),
  );
  const [chapterProgress, setChapterProgress] = useState(0);
  const [showOutline, setShowOutline] = useState(true);

  const from = Math.floor(chapterProgress);
  const to = Math.min(from + 1, DEFAULT_CHAPTER_COUNT - 1);
  const t = chapterProgress - from;

  const blend: GravityClusterBlend = useMemo(
    () => ({ chapterProgress, from, to, t }),
    [chapterProgress, from, to, t],
  );

  const liveParams = useMemo(() => {
    const a = presets[from] ?? presets[0]!;
    const b = presets[to] ?? a;
    return resolveClusterParams(a, b, from === to ? 0 : t);
  }, [presets, from, to, t]);

  const activeChapter = Math.round(chapterProgress);

  const updatePreset = useCallback(
    (key: keyof GravityClusterPreset, value: number) => {
      setPresets((prev) =>
        prev.map((preset) => {
          if (
            !(GRAVITY_SHARED_KEYS as readonly string[]).includes(key) &&
            key !== "shape"
          ) {
            return preset;
          }
          if (key === "shape") return preset;
          return { ...preset, [key]: Number(value) as never };
        }),
      );
    },
    [],
  );

  const updateShape = (shape: ParticleShape) => {
    setPresets((prev) => {
      const next = clonePresets(prev);
      next[activeChapter] = { ...next[activeChapter]!, shape };
      return next;
    });
  };

  const resetBase = () => {
    setPresets((prev) => applyBaseToPresets(prev, DEFAULT_GRAVITY_BASE));
  };

  return (
    <div className="mx-auto max-w-[90rem] px-[var(--grid-margin)] pb-24">
      <header className="border-b border-[var(--rule-strong)] py-10">
        <p className="text-meta">Effects · Gravity clusters</p>
        <h1 className="display-lg mt-3">Shape-outline grains</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-secondary">
          Grains cling to a shape outline. Circle settings are the shared base
          for every chapter — only the silhouette changes on scroll. Sliders
          update all chapters at once; pick a shape per chapter below.
        </p>
      </header>

      <div className="mt-8 border border-[var(--rule-light)] bg-[var(--color-paper)] p-4">
        <label className="block text-xs text-secondary">
          <span className="flex justify-between gap-4">
            <span>
              Chapter scroll · {activeChapter + 1} of {DEFAULT_CHAPTER_COUNT}{" "}
              <span className="text-tertiary">
                ({liveParams.shape} · {liveParams.particleCount} grains)
              </span>
            </span>
            <span className="tabular-nums">{chapterProgress.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={DEFAULT_CHAPTER_COUNT - 1}
            step={0.005}
            value={chapterProgress}
            onChange={(e) =>
              setChapterProgress(Number.parseFloat(e.target.value))
            }
            className="mt-2 w-full"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((p, i) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setChapterProgress(i)}
              className={`rounded-sm border px-2.5 py-1 text-xs capitalize transition-colors ${
                activeChapter === i
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                  : "border-[var(--rule-light)] text-secondary"
              }`}
            >
              {i + 1} · {p.shape}
            </button>
          ))}
        </div>
        <label className="mt-4 flex items-center gap-2 text-xs text-secondary">
          <input
            type="checkbox"
            checked={showOutline}
            onChange={(e) => setShowOutline(e.target.checked)}
          />
          Show shape outline + hotspot
        </label>
      </div>

      <div className="relative mt-6 min-h-[50dvh] overflow-hidden border border-[var(--rule-light)] bg-[var(--color-paper)]">
        <GravityClusterCanvas
          presets={presets}
          params={liveParams}
          blend={blend}
          showOutline={showOutline}
        />
      </div>

      <div className="mt-10 space-y-8">
        <div className="flex items-center justify-between border border-[var(--rule-light)] p-4">
          <p className="text-meta">Base settings · shared across all chapters</p>
          <button
            type="button"
            onClick={resetBase}
            className="rounded-sm border border-[var(--rule-light)] px-3 py-1.5 text-xs text-secondary hover:border-[var(--rule-strong)]"
          >
            Reset base
          </button>
        </div>

        <div className="border border-[var(--rule-light)] p-4">
          <p className="text-meta">Chapter {activeChapter + 1} shape</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PARTICLE_SHAPES.map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => updateShape(shape)}
                className={`rounded-sm border px-3 py-1.5 text-xs capitalize ${
                  presets[activeChapter]!.shape === shape
                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "border-[var(--rule-light)] text-secondary"
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>

        {GRAVITY_PARAM_GROUPS.map((group) => (
          <section
            key={group.label}
            className="border border-[var(--rule-light)] p-4"
          >
            <p className="text-meta">{group.label}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.keys.map((key) => {
                const meta = GRAVITY_PARAM_META[key];
                const value =
                  GRAVITY_SHARED_KEYS.includes(
                    key as (typeof GRAVITY_SHARED_KEYS)[number],
                  )
                    ? presets[0]![key as (typeof GRAVITY_SHARED_KEYS)[number]]
                    : presets[activeChapter]![key];
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
      </div>

      <section className="mt-12 border border-[var(--rule-light)] p-4">
        <p className="text-meta">Chapter summary</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--rule-light)] text-tertiary">
                <th className="py-2 pr-4">Ch</th>
                <th className="py-2 pr-4">Shape</th>
                <th className="py-2 pr-4">Grains</th>
                <th className="py-2 pr-4">Band</th>
                <th className="py-2">Scale</th>
              </tr>
            </thead>
            <tbody>
              {presets.map((p, i) => (
                <tr
                  key={p.label}
                  className={`border-b border-[var(--rule-light)] ${
                    activeChapter === i ? "bg-[var(--surface-white)]" : ""
                  }`}
                >
                  <td className="py-2 pr-4">{i + 1}</td>
                  <td className="py-2 pr-4 capitalize">{p.shape}</td>
                  <td className="py-2 pr-4 tabular-nums">{p.particleCount}</td>
                  <td className="py-2 pr-4 tabular-nums">{p.outlineThickness}px</td>
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
