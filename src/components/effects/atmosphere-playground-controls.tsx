"use client";

import type {
  HeroAtmosphereSnapshot,
  HeroBlobConfig,
  HeroNoiseBlendMode,
} from "@/lib/hero-atmosphere-snapshot";

type AtmospherePlaygroundControlsProps = {
  snapshot: HeroAtmosphereSnapshot;
  chapterLabels: string[];
  activeChapter: number;
  transitionT: number;
  copied: boolean;
  onSelectChapter: (index: number) => void;
  onTransitionChange: (value: number) => void;
  onNoiseChange: <K extends keyof HeroAtmosphereSnapshot["noise"]>(
    key: K,
    value: HeroAtmosphereSnapshot["noise"][K],
  ) => void;
  onNoiseToneChange: <K extends keyof HeroAtmosphereSnapshot["noise"]["tone"]>(
    key: K,
    value: number,
  ) => void;
  onNoiseBlendChange: <K extends keyof HeroAtmosphereSnapshot["noise"]["blend"]>(
    key: K,
    value: HeroAtmosphereSnapshot["noise"]["blend"][K],
  ) => void;
  onBlobsChange: <K extends keyof HeroBlobConfig>(
    key: K,
    value: HeroBlobConfig[K],
  ) => void;
  onResetAll: () => void;
  onCopySnapshot: () => void;
};

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-xs text-secondary">
      {label} {value.toFixed(step < 0.01 ? 3 : step < 1 ? 2 : 1)}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number.parseFloat(event.target.value))}
        className="mt-1.5 w-full"
      />
    </label>
  );
}

export function AtmospherePlaygroundControls({
  snapshot,
  chapterLabels,
  activeChapter,
  transitionT,
  copied,
  onSelectChapter,
  onTransitionChange,
  onNoiseChange,
  onNoiseToneChange,
  onNoiseBlendChange,
  onBlobsChange,
  onResetAll,
  onCopySnapshot,
}: AtmospherePlaygroundControlsProps) {
  const nextChapter = Math.min(activeChapter + 1, chapterLabels.length - 1);
  const { blobs } = snapshot;

  return (
    <>
      <section className="space-y-3">
        <p className="text-meta">Preview transition</p>
        <select
          value={activeChapter}
          onChange={(event) => onSelectChapter(Number.parseInt(event.target.value, 10))}
          className="spark-playground-chapter-select w-full"
        >
          {chapterLabels.map((label, index) => (
            <option key={label} value={index}>
              Ch {index + 1} · {label}
            </option>
          ))}
        </select>
        <RangeControl
          label={`Ch ${activeChapter + 1} → ${nextChapter + 1}`}
          value={transitionT}
          min={0}
          max={1}
          step={0.01}
          onChange={onTransitionChange}
        />
      </section>

      <section className="keyline-t mt-6 space-y-3 pt-6">
        <p className="text-meta">Noise</p>
        <label className="flex items-center gap-2 text-xs text-secondary">
          <input
            type="checkbox"
            checked={snapshot.noise.enabled}
            onChange={(event) => onNoiseChange("enabled", event.target.checked)}
          />
          Enabled
        </label>
        <RangeControl
          label="Cell frequency"
          value={snapshot.noise.cellFrequency}
          min={0.12}
          max={1.2}
          step={0.02}
          onChange={(value) => onNoiseChange("cellFrequency", value)}
        />
        <RangeControl
          label="Cell octaves"
          value={snapshot.noise.cellOctaves}
          min={1}
          max={5}
          step={1}
          onChange={(value) => onNoiseChange("cellOctaves", Math.round(value))}
        />
        <RangeControl
          label="Density"
          value={snapshot.noise.density}
          min={0.2}
          max={1}
          step={0.02}
          onChange={(value) => onNoiseChange("density", value)}
        />
        <RangeControl
          label="Highlight suppression"
          value={snapshot.noise.tone.highlightSuppression}
          min={1}
          max={4}
          step={0.05}
          onChange={(value) => onNoiseToneChange("highlightSuppression", value)}
        />
        <RangeControl
          label="Shadow bias"
          value={snapshot.noise.tone.shadowBias}
          min={-0.2}
          max={0.1}
          step={0.01}
          onChange={(value) => onNoiseToneChange("shadowBias", value)}
        />
        <RangeControl
          label="Blend opacity"
          value={snapshot.noise.blend.opacity}
          min={0.02}
          max={0.6}
          step={0.01}
          onChange={(value) => onNoiseBlendChange("opacity", value)}
        />
        <label className="block text-xs text-secondary">
          Blend mode
          <select
            value={snapshot.noise.blend.mode}
            onChange={(event) =>
              onNoiseBlendChange("mode", event.target.value as HeroNoiseBlendMode)
            }
            className="spark-playground-chapter-select mt-1.5 w-full"
          >
            <option value="overlay">overlay</option>
            <option value="soft-light">soft-light</option>
            <option value="multiply">multiply</option>
          </select>
        </label>
      </section>

      <section className="keyline-t mt-6 space-y-3 pt-6">
        <p className="text-meta">Blobs</p>
        <label className="flex items-center gap-2 text-xs text-secondary">
          <input
            type="checkbox"
            checked={blobs.enabled}
            onChange={(event) => onBlobsChange("enabled", event.target.checked)}
          />
          Enabled
        </label>
        <RangeControl
          label="Count per chapter"
          value={blobs.countPerChapter}
          min={1}
          max={3}
          step={1}
          onChange={(value) => onBlobsChange("countPerChapter", Math.round(value))}
        />
        <RangeControl
          label="Size"
          value={blobs.size}
          min={0.12}
          max={0.75}
          step={0.01}
          onChange={(value) => onBlobsChange("size", value)}
        />
        <RangeControl
          label="Drift speed"
          value={blobs.driftSpeed}
          min={0.04}
          max={0.5}
          step={0.01}
          onChange={(value) => onBlobsChange("driftSpeed", value)}
        />
        <RangeControl
          label="Wobble"
          value={blobs.wobble}
          min={0.2}
          max={2.5}
          step={0.05}
          onChange={(value) => onBlobsChange("wobble", value)}
        />
        <RangeControl
          label="Randomness"
          value={blobs.randomness}
          min={0}
          max={1}
          step={0.05}
          onChange={(value) => onBlobsChange("randomness", value)}
        />
        <RangeControl
          label="Blur"
          value={blobs.blur}
          min={24}
          max={140}
          step={2}
          onChange={(value) => onBlobsChange("blur", value)}
        />
        <RangeControl
          label="Light strength"
          value={blobs.lightStrength}
          min={0.05}
          max={0.5}
          step={0.01}
          onChange={(value) => onBlobsChange("lightStrength", value)}
        />
        <RangeControl
          label="Dark strength"
          value={blobs.darkStrength}
          min={0.05}
          max={0.5}
          step={0.01}
          onChange={(value) => onBlobsChange("darkStrength", value)}
        />
        <RangeControl
          label="Scroll transition distance"
          value={blobs.transitionDistance}
          min={0.04}
          max={0.3}
          step={0.01}
          onChange={(value) => onBlobsChange("transitionDistance", value)}
        />
      </section>

      <div className="keyline-t mt-6 flex flex-wrap gap-x-4 gap-y-2 pt-6 text-xs">
        <button
          type="button"
          onClick={onResetAll}
          className="border-b border-current text-primary"
        >
          Reset all
        </button>
        <button
          type="button"
          onClick={onCopySnapshot}
          className="border-b border-current text-primary"
        >
          {copied ? "Copied!" : "Copy JSON"}
        </button>
      </div>
    </>
  );
}
