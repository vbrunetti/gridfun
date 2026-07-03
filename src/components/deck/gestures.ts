/**
 * Shared horizontal-gesture module (spec §6).
 *
 * Handles wheel, touch, and keyboard inputs for a pinned translateX track.
 * The caller (VignetteChapter, future PanelDeck) passes callbacks; this module
 * owns all the edge-detection, axis-lock, entry-lock, and snap-idle logic.
 *
 * Gesture contract (§6.2):
 *   Enter  — when the stage is focused (pinned), capture vertical gesture intent.
 *   Consume — while not at an edge, map vertical intent → horizontal translateX.
 *   Release — at first/last panel, stop consuming; native vertical scroll resumes.
 */

// ── Tuning constants (one place, per spec §6.4) ────────────────────────────

/** One discrete gesture (button, key, flick) advances exactly one panel. */
export const STEP_LOCK_MS = 480;
/** px before a touch move commits to an axis. */
export const AXIS_LOCK_THRESHOLD_PX = 8;
/** px travel on touchend that counts as a directional swipe (≥ = step one panel). */
export const SWIPE_THRESHOLD_PX = 44;
/**
 * px/ms above which a touch release is a FLICK (advance exactly one panel from the
 * index the gesture STARTED on) rather than a deliberate drag (snap to nearest).
 * This is what keeps "one swipe = one panel" while still letting a slow drag move
 * proportionally. Tune on-device.
 */
export const FLICK_VELOCITY_PX_MS = 0.4;
/** Minimum travel for a flick (filters out taps). */
export const FLICK_MIN_TRAVEL_PX = 8;
/** ms to snap-to-nearest after wheel input goes idle. */
export const SNAP_IDLE_MS = 90;
/** ms to ignore new input after the stage enters focus (prevents entry fling). */
export const FOCUS_ENTRY_MS = 100;

// ───────────────────────────────────────────────────────────────────────────

export type HGestureCallbacks = {
  /** Current horizontal offset (px into the track, ≥ 0). */
  getOffset(): number;
  /** Maximum valid offset. */
  getMaxOffset(): number;
  /** Apply raw delta to the current offset (no snap). */
  applyDelta(delta: number): void;
  /** Advance/retreat by exactly one panel. */
  step(dir: 1 | -1): void;
  /** Current resting panel index (nearest panel to the offset). */
  getIndex(): number;
  /** Go to an absolute panel index (animated). */
  goToIndex(index: number): void;
  /** Snap the track to the nearest panel snap point. */
  snapToNearest(): void;
  /** Is this section currently the active/pinned panel in the vertical deck? */
  isFocused(): boolean;
  /**
   * When true (mobile, axis:"x", mobileBiaxial), both vertical and horizontal
   * swipes drive the horizontal track (§6.3).
   */
  mobileBiaxial?: boolean;
  /**
   * Optional inner vertical scroller for the active panel (e.g. a media panel
   * whose caption overflows). When it can still scroll in the gesture direction
   * the module yields — it neither consumes nor preventDefaults — so the panel
   * body scrolls natively first; the track only advances once the inner scroll
   * is at its edge.
   */
  getActiveScroller?(): HTMLElement | null;
};

/** Can `el` still scroll in the direction of `delta` (positive = forward/down)? */
function scrollerCanConsume(el: HTMLElement | null, delta: number): boolean {
  if (!el) return false;
  const max = el.scrollHeight - el.clientHeight;
  if (max <= 1) return false;
  if (delta > 0) return el.scrollTop < max - 1;
  if (delta < 0) return el.scrollTop > 1;
  return false;
}

function normaliseWheelDeltaY(e: WheelEvent): number {
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) return e.deltaY * 16;
  if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) return e.deltaY * 48;
  return e.deltaY;
}

function atEdge(
  delta: number,
  getOffset: () => number,
  getMaxOffset: () => number,
): boolean {
  const offset = getOffset();
  const max = getMaxOffset();
  if (delta < 0 && offset <= 0) return true;
  if (delta > 0 && offset >= max - 1) return true;
  return false;
}

/**
 * Attaches gesture listeners to `document` (same model as the existing wheel
 * handler). Returns a cleanup function — call it in the component's unmount.
 *
 * @param section  The pinned section element (used for focus-state checks).
 * @param cbs      Callbacks into the track's imperative model.
 */
export function attachHorizontalGestures(
  section: HTMLElement,
  cbs: HGestureCallbacks,
): () => void {
  const {
    getOffset,
    getMaxOffset,
    applyDelta,
    step,
    getIndex,
    goToIndex,
    snapToNearest,
    isFocused,
    mobileBiaxial = false,
    getActiveScroller,
  } = cbs;

  let snapTimer = 0;
  let entryLockUntil = 0;

  // Set / refresh the entry lock when focus is acquired.
  const focusObserver = new MutationObserver(() => {
    const nowFocused = section.classList.contains("is-focused");
    if (nowFocused) {
      entryLockUntil = performance.now() + FOCUS_ENTRY_MS;
    }
  });
  focusObserver.observe(section, { attributes: true, attributeFilter: ["class"] });

  const scheduleSnap = () => {
    clearTimeout(snapTimer);
    snapTimer = window.setTimeout(snapToNearest, SNAP_IDLE_MS);
  };

  // ── Wheel ───────────────────────────────────────────────────────────────

  const onWheel = (e: WheelEvent) => {
    if (!isFocused()) return;

    // Accept both vertical and horizontal wheel input.
    const rawDeltaY = normaliseWheelDeltaY(e);
    const rawDeltaX = e.deltaX ?? 0;
    const delta = Math.abs(rawDeltaY) >= Math.abs(rawDeltaX) ? rawDeltaY : rawDeltaX;

    if (Math.abs(delta) < 0.5) return;
    // Yield to the active panel's inner scroller until it reaches its edge, so a
    // long caption scrolls within the panel before the track advances.
    if (scrollerCanConsume(getActiveScroller?.() ?? null, delta)) return;
    if (atEdge(delta, getOffset, getMaxOffset)) return;

    e.preventDefault();
    if (performance.now() < entryLockUntil) return;

    applyDelta(delta);
    scheduleSnap();
  };

  // ── Touch ───────────────────────────────────────────────────────────────

  type AxisLock = "h" | "v" | "released" | null;

  let touchOriginX = 0;
  let touchOriginY = 0;
  let touchOffsetAtStart = 0;
  let touchStartIndex = 0;
  let touchStartTime = 0;
  let axisLock: AxisLock = null;
  let lastTouchX = 0;
  let lastTouchY = 0;

  const onTouchStart = (e: TouchEvent) => {
    if (!isFocused()) return;
    const t = e.touches[0];
    if (!t) return;
    touchOriginX = t.clientX;
    touchOriginY = t.clientY;
    lastTouchX = t.clientX;
    lastTouchY = t.clientY;
    touchOffsetAtStart = getOffset();
    touchStartIndex = getIndex(); // index BEFORE the drag — a flick advances one from here
    touchStartTime = performance.now();
    axisLock = null;
    clearTimeout(snapTimer);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isFocused() || axisLock === "released") return;
    const t = e.touches[0];
    if (!t) return;

    const dx = t.clientX - touchOriginX;
    const dy = t.clientY - touchOriginY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Commit axis once past lock threshold.
    if (axisLock === null) {
      if (dist < AXIS_LOCK_THRESHOLD_PX) return;
      axisLock = Math.abs(dx) >= Math.abs(dy) ? "h" : "v";
    }

    // Decide whether this axis drives our track.
    const drives = axisLock === "h" || (axisLock === "v" && mobileBiaxial);
    if (!drives) {
      axisLock = "released";
      return;
    }

    // Raw delta from the last touchmove (incremental, not cumulative).
    const ddx = lastTouchX - t.clientX; // positive = swipe left = advance
    const ddy = lastTouchY - t.clientY; // positive = swipe up = advance

    // The gesture direction: horizontal swipe uses ddx, vertical uses ddy.
    const delta = axisLock === "h" ? ddx : ddy;

    // Vertical swipe over a scrollable panel body scrolls the body natively until
    // it reaches its edge; only then does the swipe drive the track.
    if (
      axisLock === "v" &&
      scrollerCanConsume(getActiveScroller?.() ?? null, delta)
    ) {
      axisLock = "released";
      return;
    }

    if (atEdge(delta, getOffset, getMaxOffset)) {
      axisLock = "released";
      return;
    }

    e.preventDefault();
    if (performance.now() < entryLockUntil) {
      lastTouchX = t.clientX;
      lastTouchY = t.clientY;
      return;
    }

    applyDelta(delta);
    lastTouchX = t.clientX;
    lastTouchY = t.clientY;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!isFocused() || axisLock === "released" || axisLock === null) return;

    const t = e.changedTouches[0];
    if (!t) return;

    const dx = t.clientX - touchOriginX;
    const dy = t.clientY - touchOriginY;
    const travelAlongAxis = axisLock === "h" ? -dx : -dy; // positive = advance

    const duration = Math.max(performance.now() - touchStartTime, 1);
    const velocity = Math.abs(travelAlongAxis) / duration;

    // Flick (fast release): advance exactly ONE panel from where the gesture began.
    // The free-drag already moved the offset/index; without anchoring to the start
    // index, the flick's +1 would stack on the drag and skip a panel ("one swipe →
    // two panels"). Slow/deliberate drags fall through to snap-to-nearest, so they
    // still land proportionally where the finger let go.
    if (
      velocity >= FLICK_VELOCITY_PX_MS &&
      Math.abs(travelAlongAxis) >= FLICK_MIN_TRAVEL_PX
    ) {
      goToIndex(touchStartIndex + (travelAlongAxis > 0 ? 1 : -1));
      axisLock = null;
      return;
    }

    snapToNearest();
    axisLock = null;
  };

  // ── Keyboard ────────────────────────────────────────────────────────────

  const onKeyDown = (e: KeyboardEvent) => {
    if (!isFocused()) return;
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (dir === 0) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
    e.preventDefault();
    step(dir);
  };

  // ── Attach ──────────────────────────────────────────────────────────────

  document.addEventListener("wheel", onWheel, { passive: false, capture: true });
  document.addEventListener("touchstart", onTouchStart, { passive: true });
  // passive: false so we can preventDefault on consuming moves.
  document.addEventListener("touchmove", onTouchMove, {
    passive: false,
    capture: true,
  } as AddEventListenerOptions);
  document.addEventListener("touchend", onTouchEnd, { passive: true });
  document.addEventListener("touchcancel", onTouchEnd, { passive: true });
  window.addEventListener("keydown", onKeyDown);

  return () => {
    focusObserver.disconnect();
    clearTimeout(snapTimer);
    document.removeEventListener("wheel", onWheel, { capture: true });
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("touchmove", onTouchMove, {
      capture: true,
    } as EventListenerOptions);
    document.removeEventListener("touchend", onTouchEnd);
    document.removeEventListener("touchcancel", onTouchEnd);
    window.removeEventListener("keydown", onKeyDown);
  };
}
