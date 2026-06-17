import type { HeroNoiseConfig } from "@/lib/hero-atmosphere-snapshot";

function hashCell(cx: number, cy: number, salt: number): number {
  const x = Math.sin(cx * 127.1 + cy * 311.7 + salt * 17.13) * 43758.5453;
  return x - Math.floor(x);
}

function applyToneCurve(value: number, tone: HeroNoiseConfig["tone"]): number {
  const biased = Math.max(
    0,
    Math.min(1, tone.amplitude * value ** tone.highlightSuppression + tone.shadowBias),
  );
  return biased;
}

function cellSizeForFrequency(cellFrequency: number): number {
  return Math.max(2, Math.round(10 / Math.max(cellFrequency, 0.05)));
}

export function buildNoisePatternCanvas(
  config: HeroNoiseConfig,
  tileSize = 192,
): HTMLCanvasElement | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = tileSize;
  canvas.height = tileSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const cell = cellSizeForFrequency(config.cellFrequency);
  const imageData = ctx.createImageData(tileSize, tileSize);
  const { data } = imageData;
  const base = parseInt(config.blend.baseTone.replace("#", ""), 16);
  const br = (base >> 16) & 255;
  const bg = (base >> 8) & 255;
  const bb = base & 255;
  const opacity = config.blend.opacity;

  for (let y = 0; y < tileSize; y++) {
    for (let x = 0; x < tileSize; x++) {
      const cx = Math.floor(x / cell);
      const cy = Math.floor(y / cell);
      let sample = hashCell(cx, cy, config.density * 100);

      for (let octave = 1; octave < config.cellOctaves; octave++) {
        const scale = 2 ** octave;
        sample +=
          hashCell(Math.floor(x / (cell / scale)), Math.floor(y / (cell / scale)), octave) *
          (0.5 / octave);
      }
      sample /= 1.35;

      const toned = applyToneCurve(sample, config.tone);
      const idx = (y * tileSize + x) * 4;
      data[idx] = br;
      data[idx + 1] = bg;
      data[idx + 2] = bb;
      data[idx + 3] = Math.round(toned * opacity * 255);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function noisePatternKey(config: HeroNoiseConfig): string {
  return JSON.stringify(config);
}
