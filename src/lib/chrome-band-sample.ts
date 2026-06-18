import {
  CHROME_SURFACE_ATTR,
  type ChromeSurface,
} from "@/lib/chrome-surface";

const MOBILE_QUERY = "(max-width: 1023px)";

/** Dispatched on window to ask the mobile chrome band/rail to re-sample (e.g. when
 *  a horizontal filmstrip advances and fires no scroll event). */
export const CHROME_RESAMPLE_EVENT = "chrome:resample";

const SAMPLE_IGNORE =
  ".chrome-mobile-band, .chrome-mobile-top, .floating-chrome, #site-menu, .skeleton-wrap, .chrome-dots-rail, .chrome-hero-dots-rail";

export function isMobileChromeBand() {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_QUERY).matches;
}

function chromeTopOffsetPx() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--chrome-top-offset",
  );
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 84;
}

function isTransparentColor(color: string) {
  return (
    color === "transparent" ||
    color === "rgba(0, 0, 0, 0)" ||
    /rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*0\s*\)/.test(color)
  );
}

/** Walk ancestors for the first painted background. */
export function getEffectiveBackground(el: Element | null): string {
  let node: Element | null = el;

  while (node && node !== document.documentElement) {
    const bg = getComputedStyle(node).backgroundColor;
    if (bg && !isTransparentColor(bg)) return bg;
    node = node.parentElement;
  }

  const bodyBg = getComputedStyle(document.body).backgroundColor;
  if (bodyBg && !isTransparentColor(bodyBg)) return bodyBg;

  return getComputedStyle(document.documentElement).getPropertyValue(
    "--background",
  ).trim() || "var(--color-paper)";
}

export function resolveChromeSurface(el: Element | null): ChromeSurface {
  const tagged = el?.closest(`[${CHROME_SURFACE_ATTR}]`);
  const value = tagged?.getAttribute(CHROME_SURFACE_ATTR);
  if (value === "dark" || value === "light" || value === "canvas") {
    return value;
  }
  return "light";
}

function isElementVisible(el: Element) {
  const style = getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  const opacity = Number.parseFloat(style.opacity);
  if (Number.isFinite(opacity) && opacity === 0) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function elementZIndex(el: Element) {
  const raw = getComputedStyle(el).zIndex;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Hit-test tagged chrome regions by geometry (pointer-events:none panels are skipped by elementsFromPoint). */
export function sampleChromeSurfaceAt(x: number, y: number): Element | null {
  const tagged = [...document.querySelectorAll(`[${CHROME_SURFACE_ATTR}]`)].filter(
    (el): el is HTMLElement => {
      if (el.closest(SAMPLE_IGNORE)) return false;
      if (!isElementVisible(el)) return false;
      const rect = el.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    },
  );

  if (tagged.length === 0) return null;

  tagged.sort((a, b) => {
    const z = elementZIndex(b) - elementZIndex(a);
    if (z !== 0) return z;
    const pos = b.compareDocumentPosition(a);
    // Most specific region wins at equal z: a nested section beats a page-spanning
    // theme wrapper that also contains the point (checked before sibling order,
    // since CONTAINS/CONTAINED_BY arrive bundled with PRECEDING/FOLLOWING).
    if (pos & Node.DOCUMENT_POSITION_CONTAINS) return 1; // a is ancestor of b → b first
    if (pos & Node.DOCUMENT_POSITION_CONTAINED_BY) return -1; // a is nested in b → a first
    // Siblings: later DOM wins (paint order).
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return 1;
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return -1;
    return 0;
  });

  for (const el of tagged) {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && !isTransparentColor(bg)) return el;
  }

  return tagged[0] ?? null;
}

function pickSampleElement(stack: Element[]): Element | null {
  for (const el of stack) {
    if (!(el instanceof Element) || el.closest(SAMPLE_IGNORE)) continue;

    const tagged = el.closest(`[${CHROME_SURFACE_ATTR}]`);
    if (tagged instanceof Element) {
      const bg = getComputedStyle(tagged).backgroundColor;
      if (bg && !isTransparentColor(bg)) return tagged;
    }

    const bg = getComputedStyle(el).backgroundColor;
    if (bg && !isTransparentColor(bg)) return el;
  }

  for (const el of stack) {
    if (el instanceof Element && !el.closest(SAMPLE_IGNORE)) {
      return el.closest(`[${CHROME_SURFACE_ATTR}]`) ?? el;
    }
  }

  return null;
}

/**
 * A probe resolves two things at a point:
 *  - `tagged`  — nearest declared [data-chrome-surface] region → contrast (light/dark).
 *  - `painted` — the actual painted element at that pixel → the colour to match.
 * These differ when the colour lives on a descendant (e.g. an index brand field
 * inside a section whose own/ancestor background is the dark route), which is why
 * matching the painted pixel — not the tagged ancestor's walked-up bg — is what
 * makes the band/rail always match what they sit on.
 */
type ChromeProbe = { tagged: Element | null; painted: Element | null };

/**
 * Topmost element actually painting a non-transparent background at the point —
 * the colour the chrome visually sits on. Unlike pickSampleElement, this does NOT
 * prefer a tagged ancestor: a colorful panel (e.g. a brand-bg vframe) must win over
 * its section even when that section carries a theme background (theme-dark, etc.).
 */
function topmostPaintedAt(x: number, y: number): Element | null {
  for (const el of document.elementsFromPoint(x, y)) {
    if (!(el instanceof Element) || el.closest(SAMPLE_IGNORE)) continue;
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && !isTransparentColor(bg)) return el;
  }
  return null;
}

function probeChromeAt(x: number, y: number): ChromeProbe {
  return {
    tagged: sampleChromeSurfaceAt(x, y),
    painted:
      topmostPaintedAt(x, y) ?? pickSampleElement(document.elementsFromPoint(x, y)),
  };
}

/** Module directly below the chrome band. */
export function sampleBelowChromeBand(): ChromeProbe {
  const bandBottom = chromeTopOffsetPx();
  const x = Math.max(0, Math.round(window.innerWidth / 2));
  const y = Math.min(window.innerHeight - 1, Math.round(bandBottom + 4));
  return probeChromeAt(x, y);
}

export type ChromeBandSample = {
  background: string;
  surface: ChromeSurface;
};

/** Content directly under the fixed bottom dots strip (viewport floor, not page chrome). */
export function sampleAboveChromeDots(): ChromeProbe {
  const rail = document.querySelector<HTMLElement>(
    ".chrome-dots-rail--study, .chrome-dots-rail--detail",
  );
  const railHeight =
    rail && rail.getBoundingClientRect().height > 0
      ? rail.getBoundingClientRect().height
      : (() => {
          const raw = getComputedStyle(document.documentElement).getPropertyValue(
            "--chrome-mobile-dots-height",
          );
          const parsed = Number.parseFloat(raw);
          return Number.isFinite(parsed) ? parsed : 64;
        })();

  const y = Math.max(0, Math.round(window.innerHeight - railHeight - 4));
  const width = window.innerWidth;
  const xs = [
    Math.round(width * 0.2),
    Math.round(width * 0.5),
    Math.round(width * 0.8),
  ];

  for (const x of xs) {
    const probe = probeChromeAt(x, y);
    if (probe.painted || probe.tagged) return probe;
  }

  return { tagged: null, painted: null };
}

function stableChromeBackground(surface: ChromeSurface): string {
  const root = document.documentElement;
  const token = (name: string, fallback: string) =>
    getComputedStyle(root).getPropertyValue(name).trim() || fallback;

  if (surface === "dark") return token("--color-ink", "#000000");
  if (surface === "canvas") return token("--canvas-blue", token("--background", "#efefef"));
  return token("--background", "#efefef");
}

/** Mobile h-scroll vignettes — stable chrome from declared surface, not panel colour. */
function mobileVchapterChromeSample(probe: ChromeProbe): ChromeBandSample | null {
  if (!isMobileChromeBand()) return null;

  const region =
    probe.tagged?.closest(".vchapter") ??
    probe.painted?.closest(".vchapter") ??
    document.querySelector(".vchapter.is-focused");

  if (!region) return null;

  const surface = resolveChromeSurface(region);
  return {
    background: stableChromeBackground(surface),
    surface,
  };
}

/** bg follows the painted pixel, contrast follows the declared region. */
function sampleFromProbe(probe: ChromeProbe): ChromeBandSample {
  const vignette = mobileVchapterChromeSample(probe);
  if (vignette) return vignette;

  return {
    background: getEffectiveBackground(probe.painted ?? probe.tagged),
    surface: resolveChromeSurface(probe.tagged ?? probe.painted),
  };
}

export function sampleChromeBand(menuOpen: boolean): ChromeBandSample {
  if (menuOpen) {
    const dark = getComputedStyle(document.documentElement).getPropertyValue(
      "--section-dark-bg",
    ).trim();
    return {
      background: dark || "var(--color-black)",
      surface: "dark",
    };
  }

  return sampleFromProbe(sampleBelowChromeBand());
}

export function sampleChromeDotsBand(menuOpen: boolean): ChromeBandSample | null {
  if (menuOpen || !isMobileChromeBand()) {
    return null;
  }

  return sampleFromProbe(sampleAboveChromeDots());
}

export function applyChromeBandSample(
  sample: ChromeBandSample,
  options?: { includeSurface?: boolean },
) {
  document.documentElement.style.setProperty(
    "--chrome-mobile-band-bg",
    sample.background,
  );
  if (options?.includeSurface !== false) {
    document.body.dataset.chromeSurface = sample.surface;
  }
}

export function applyChromeDotsBandSample(sample: ChromeBandSample) {
  document.documentElement.style.setProperty(
    "--chrome-mobile-dots-bg",
    sample.background,
  );
  document.body.dataset.chromeDotsSurface = sample.surface;
}

export function clearChromeBandSample() {
  document.documentElement.style.removeProperty("--chrome-mobile-band-bg");
  if (!document.querySelector(".cs-detail")) {
    delete document.body.dataset.chromeSurface;
  }
}

export function clearChromeDotsBandSample() {
  document.documentElement.style.removeProperty("--chrome-mobile-dots-bg");
  if (!document.querySelector(".cs-detail")) {
    delete document.body.dataset.chromeDotsSurface;
  }
}
