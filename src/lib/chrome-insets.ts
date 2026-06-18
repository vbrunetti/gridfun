/**
 * Measures chrome elements and writes inset CSS variables to :root.
 *
 *   --chrome-top-inset   distance from viewport top to content start (px)
 *   --chrome-dots-inset  distance from dot-rail top to viewport bottom (px)
 *
 * Uses ResizeObserver so values stay accurate across resize / orientation change.
 * Selector contract: elements must carry data-chrome-inset="top" / "dots".
 */

const MOBILE_QUERY = "(max-width: 1023px)";

const CHROME_DOTS_RAIL_SELECTOR =
  ".chrome-dots-rail--detail, .chrome-dots-rail--study, .chrome-hero-dots-rail--study";

let observer: ResizeObserver | null = null;
let initialized = false;

function applyInset(key: "top" | "dots", px: number) {
  document.documentElement.style.setProperty(`--chrome-${key}-inset`, `${px}px`);
}

function viewportHeight(): number {
  return window.visualViewport?.height ?? document.documentElement.clientHeight;
}

function isMobileChrome(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function visibleDotsRail(): HTMLElement | null {
  for (const rail of document.querySelectorAll<HTMLElement>(CHROME_DOTS_RAIL_SELECTOR)) {
    const rect = rail.getBoundingClientRect();
    const style = getComputedStyle(rail);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      rect.width <= 0 ||
      rect.height <= 0
    ) {
      continue;
    }
    return rail;
  }
  return null;
}

/** Bottom edge of the top chrome band — where panel content may begin. */
function measureTopInset(): number {
  const band = document.querySelector<HTMLElement>('[data-chrome-inset="top"]');
  if (!band) return 0;
  return Math.round(band.getBoundingClientRect().bottom);
}

/**
 * Distance from the dot-rail top seam to the viewport bottom.
 * Prefer the live rail so panel height meets the rail border exactly.
 */
function measureDotsInset(): number {
  if (!isMobileChrome()) return 0;

  const vh = viewportHeight();
  const rail = visibleDotsRail();
  if (rail) {
    return Math.max(0, Math.round(vh - rail.getBoundingClientRect().top));
  }

  const sentinel = document.querySelector<HTMLElement>('[data-chrome-inset="dots"]');
  return sentinel ? Math.round(sentinel.getBoundingClientRect().height) : 0;
}

function measureAll() {
  applyInset("top", measureTopInset());
  applyInset("dots", measureDotsInset());
}

export function initChromeInsets() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  measureAll();

  observer = new ResizeObserver(measureAll);

  function attachToTargets() {
    document
      .querySelectorAll<HTMLElement>("[data-chrome-inset]")
      .forEach((el) => observer!.observe(el));
    document
      .querySelectorAll<HTMLElement>(CHROME_DOTS_RAIL_SELECTOR)
      .forEach((el) => observer!.observe(el));
  }

  attachToTargets();

  const mutObs = new MutationObserver(() => {
    attachToTargets();
    measureAll();
  });
  mutObs.observe(document.body, { childList: true, subtree: true });

  const onViewportChange = () => measureAll();
  window.matchMedia(MOBILE_QUERY).addEventListener("change", onViewportChange);
  window.addEventListener("resize", onViewportChange, { passive: true });
  window.visualViewport?.addEventListener("resize", onViewportChange, {
    passive: true,
  });
}
