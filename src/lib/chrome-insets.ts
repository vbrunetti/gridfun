/**
 * Measures chrome elements and writes inset CSS variables to :root.
 *
 *   --chrome-top-inset   height the top nav occupies when pinned (px)
 *   --chrome-dots-inset  height the bottom dot rail occupies on mobile (px)
 *
 * Uses ResizeObserver so values stay accurate across resize / orientation change.
 * Selector contract: elements must carry data-chrome-inset="top" / "dots".
 */

let observer: ResizeObserver | null = null;
let initialized = false;

function applyInset(key: "top" | "dots", px: number) {
  document.documentElement.style.setProperty(`--chrome-${key}-inset`, `${px}px`);
}

function measureAll() {
  const top = document.querySelector<HTMLElement>('[data-chrome-inset="top"]');
  const dots = document.querySelector<HTMLElement>('[data-chrome-inset="dots"]');

  applyInset("top", top ? top.getBoundingClientRect().height : 0);
  applyInset("dots", dots ? dots.getBoundingClientRect().height : 0);
}

export function initChromeInsets() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  measureAll();

  observer = new ResizeObserver(measureAll);

  // Observe existing targets; MutationObserver re-scans if DOM changes.
  function attachToTargets() {
    document
      .querySelectorAll<HTMLElement>("[data-chrome-inset]")
      .forEach((el) => observer!.observe(el));
  }

  attachToTargets();

  const mutObs = new MutationObserver(() => {
    attachToTargets();
    measureAll();
  });
  mutObs.observe(document.body, { childList: true, subtree: true });
}
