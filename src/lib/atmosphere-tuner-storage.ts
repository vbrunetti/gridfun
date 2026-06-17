import {
  createDefaultHeroAtmosphereSnapshot,
  isHeroAtmosphereSnapshot,
  normalizeHeroAtmosphereSnapshot,
  type HeroAtmosphereSnapshot,
} from "@/lib/hero-atmosphere-snapshot";

const STORAGE_KEY = "gridfun:atmosphere-tuner:v1";

export function readAtmosphereTunerDraft(): HeroAtmosphereSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isHeroAtmosphereSnapshot(parsed) ||
      (parsed && typeof parsed === "object" && (parsed as { version?: number }).version === 1)
      ? normalizeHeroAtmosphereSnapshot(parsed)
      : null;
  } catch {
    return null;
  }
}

export function writeAtmosphereTunerDraft(snapshot: HeroAtmosphereSnapshot) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function clearAtmosphereTunerDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function fallbackAtmosphereSnapshot(): HeroAtmosphereSnapshot {
  return createDefaultHeroAtmosphereSnapshot();
}
