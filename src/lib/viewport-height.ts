/**
 * Sets --app-vh on :root to a stable usable viewport height in px.
 *
 * Uses visualViewport when available; falls back to documentElement.clientHeight.
 * Updates only on orientation change or when the height delta exceeds STABLE_DELTA_PX —
 * this prevents URL-bar nudges from shifting snap geometry mid-scroll.
 */

const STABLE_DELTA_PX = 40;

let currentVh = 0;
let rafId = 0;
let initialized = false;

function measure(): number {
  return window.visualViewport
    ? window.visualViewport.height
    : document.documentElement.clientHeight;
}

function apply(vh: number) {
  document.documentElement.style.setProperty("--app-vh", `${vh}px`);
  currentVh = vh;
}

function update(force = false) {
  const next = measure();
  if (force || Math.abs(next - currentVh) > STABLE_DELTA_PX) {
    apply(next);
  }
}

function scheduleUpdate(force = false) {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    update(force);
  });
}

export function initViewportHeight() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  apply(measure());

  // Force-update on orientation change — geometry has genuinely changed.
  window.addEventListener("orientationchange", () => scheduleUpdate(true), {
    passive: true,
  });

  // visualViewport fires on every URL-bar nudge; we rely on the delta guard.
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => scheduleUpdate(), {
      passive: true,
    } as AddEventListenerOptions);
  } else {
    window.addEventListener("resize", () => scheduleUpdate(), { passive: true });
  }
}
