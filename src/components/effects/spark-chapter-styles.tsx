"use client";

import {
  PARTICLE_SHAPES,
  PRESET_PARAM_GROUPS,
  PRESET_PARAM_META,
  type ParticlePreset,
} from "@/components/sections/primary-hero/particle-presets";

type SparkChapterStylesProps = {
  presets: ParticlePreset[];
  chapterLabels: string[];
  activeChapter: number;
  onSelectChapter: (index: number) => void;
  onUpdatePreset: (
    chapterIndex: number,
    key: keyof ParticlePreset,
    value: string | number,
  ) => void;
  onResetChapter: (chapterIndex: number) => void;
};

export function SparkChapterStyles({
  presets,
  chapterLabels,
  activeChapter,
  onSelectChapter,
  onUpdatePreset,
  onResetChapter,
}: SparkChapterStylesProps) {
  const preset = presets[activeChapter]!;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-meta">Chapter</p>
          <button
            type="button"
            onClick={() => onResetChapter(activeChapter)}
            className="text-xs text-secondary underline-offset-2 hover:text-primary hover:underline"
          >
            Reset
          </button>
        </div>
        <select
          value={activeChapter}
          onChange={(event) =>
            onSelectChapter(Number.parseInt(event.target.value, 10))
          }
          className="spark-playground-chapter-select mt-2 w-full rounded-sm px-3 py-2.5 text-sm"
        >
          {presets.map((chapterPreset, chapterIndex) => (
            <option key={chapterIndex} value={chapterIndex}>
              Ch {chapterIndex + 1} · {chapterLabels[chapterIndex]} ·{" "}
              {chapterPreset.shape}
            </option>
          ))}
        </select>
      </div>

      <div className="keyline-t space-y-4 pt-4">
        <div>
          <p className="text-meta">Shape</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PARTICLE_SHAPES.map((shape) => (
              <button
                key={shape}
                type="button"
                onClick={() => onUpdatePreset(activeChapter, "shape", shape)}
                className={`ui-chip rounded-sm px-2.5 py-1 text-xs capitalize ${
                  preset.shape === shape ? "ui-chip--active" : ""
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>

        {PRESET_PARAM_GROUPS.map((group) => (
          <section key={group.label}>
            <p className="text-meta">{group.label}</p>
            <div className="mt-3 grid gap-3">
              {group.keys.map((key) => {
                const meta = PRESET_PARAM_META[key];
                const value = preset[key];
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
                      onChange={(event) =>
                        onUpdatePreset(
                          activeChapter,
                          key,
                          Number.parseFloat(event.target.value),
                        )
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
    </div>
  );
}
