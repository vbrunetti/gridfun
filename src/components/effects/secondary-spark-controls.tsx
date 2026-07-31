"use client";

import {
  PRESET_PARAM_GROUPS,
  PRESET_PARAM_META,
  type ParticlePreset,
} from "@/components/sections/primary-hero/particle-presets";
import type { SecondarySparkColorChoice } from "@/lib/secondary-spark-snapshot";

/** Shape / boundary params are unused — secondary field is unbounded. */
const SECONDARY_PARAM_GROUPS = PRESET_PARAM_GROUPS.filter(
  (group) => group.label !== "Shape",
);

type SecondarySparkControlsProps = {
  preset: ParticlePreset;
  colorChoice: SecondarySparkColorChoice;
  copied: boolean;
  onUpdatePreset: (key: keyof ParticlePreset, value: string | number) => void;
  onColorChoiceChange: (value: SecondarySparkColorChoice) => void;
  onReset: () => void;
  onCopySnapshot: () => void;
};

export function SecondarySparkControls({
  preset,
  colorChoice,
  copied,
  onUpdatePreset,
  onColorChoiceChange,
  onReset,
  onCopySnapshot,
}: SecondarySparkControlsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-meta">Preset</p>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-secondary underline-offset-2 hover:text-primary hover:underline"
        >
          Reset
        </button>
      </div>

      <p className="text-[10px] text-tertiary">
        Full-canvas field — no shape boundary. Particles fill the whole secondary
        panel.
      </p>

      {SECONDARY_PARAM_GROUPS.map((group) => (
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
                      onUpdatePreset(key, Number.parseFloat(event.target.value))
                    }
                    className="mt-1.5 w-full"
                  />
                </label>
              );
            })}
          </div>
        </section>
      ))}

      <section className="keyline-t space-y-4 pt-6">
        <p className="text-meta">Color</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(
            [
              { id: "white", label: "White" },
              { id: "lime", label: "Neon lime" },
              { id: "multi", label: "Multi" },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onColorChoiceChange(option.id)}
              className={`ui-chip rounded-sm px-2.5 py-1 text-xs ${
                colorChoice === option.id ? "ui-chip--active" : ""
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-tertiary">
          Multi assigns a random design-system accent at spawn (lime, pink, sky,
          blues, cruise).
        </p>
      </section>

      <div className="keyline-t flex flex-wrap gap-x-4 gap-y-2 pt-6 text-xs">
        <button
          type="button"
          onClick={onCopySnapshot}
          className="border-b border-current text-primary"
        >
          {copied ? "Copied!" : "Copy JSON"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="border-b border-current text-secondary"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
