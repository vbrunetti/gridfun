import {
  CHROME_SURFACE_ATTR,
  type ChromeSurface,
} from "@/lib/chrome-surface";

const MOBILE_QUERY = "(max-width: 1023px)";

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
    // Later DOM wins at equal z — matches paint order for siblings.
    const pos = b.compareDocumentPosition(a);
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

/** First content element just below the chrome band (module directly underneath). */
export function sampleBelowChromeBand(): Element | null {
  const bandBottom = chromeTopOffsetPx();
  const x = Math.max(0, Math.round(window.innerWidth / 2));
  const y = Math.min(
    window.innerHeight - 1,
    Math.round(bandBottom + 4),
  );

  return (
    sampleChromeSurfaceAt(x, y) ??
    pickSampleElement(document.elementsFromPoint(x, y))
  );
}

export type ChromeBandSample = {
  background: string;
  surface: ChromeSurface;
};

/** Content directly under the fixed bottom dots strip (viewport floor, not page chrome). */
export function sampleAboveChromeDots(): Element | null {
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
    const hit =
      sampleChromeSurfaceAt(x, y) ??
      pickSampleElement(document.elementsFromPoint(x, y));
    if (hit) return hit;
  }

  return null;
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

  const hit = sampleBelowChromeBand();
  return {
    background: getEffectiveBackground(hit),
    surface: resolveChromeSurface(hit),
  };
}

export function sampleChromeDotsBand(menuOpen: boolean): ChromeBandSample | null {
  if (menuOpen || !isMobileChromeBand()) {
    return null;
  }

  const hit = sampleAboveChromeDots();
  return {
    background: getEffectiveBackground(hit),
    surface: resolveChromeSurface(hit),
  };
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
