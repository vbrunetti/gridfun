import rawSnapshot from "@/content/hero-atmosphere-snapshot.json";
import {
  createDefaultHeroAtmosphereSnapshot,
  normalizeHeroAtmosphereSnapshot,
  type HeroAtmosphereSnapshot,
} from "@/lib/hero-atmosphere-snapshot";

function loadSnapshot(): HeroAtmosphereSnapshot {
  return normalizeHeroAtmosphereSnapshot(rawSnapshot);
}

export const HERO_ATMOSPHERE_SNAPSHOT = loadSnapshot();

export function cloneHeroAtmosphereSnapshot(
  snapshot: HeroAtmosphereSnapshot = HERO_ATMOSPHERE_SNAPSHOT,
): HeroAtmosphereSnapshot {
  return normalizeHeroAtmosphereSnapshot(snapshot);
}
