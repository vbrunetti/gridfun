"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

/** Default auto-advance cadence when a frame doesn't specify `autoplayMs`. */
const DEFAULT_AUTOPLAY_MS = 4000;

/**
 * Lightweight, near-chrome-less carousel that lives *inside* one vignette frame's
 * media box. Index-driven crossfade — no nested scroller/swipe, so it never
 * fights the filmstrip's own horizontal gesture (JS on mobile, native snap on
 * desktop). Affordances: dots (always, tappable), edge arrows (hover, desktop),
 * tap-to-advance, and ←/→ when focused. On touch the arrows hide and the dots +
 * tap carry it.
 */
export function VignettePanelCarousel({
  sources,
  alt,
  priority = false,
  active = true,
  autoplayMs,
  sizes = "(max-width: 767px) 92vw, min(100vw, 90rem)",
}: {
  sources: string[];
  alt: string;
  priority?: boolean;
  /** Only autoplay while this frame is the in-view panel. */
  active?: boolean;
  /** Auto-advance delay; defaults to DEFAULT_AUTOPLAY_MS. 0 (or less) disables. */
  autoplayMs?: number;
  sizes?: string;
}) {
  const total = sources.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const go = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Auto-advance. Keyed on `index`, so a manual nav also resets the timer.
  const delay = autoplayMs ?? DEFAULT_AUTOPLAY_MS;
  useEffect(() => {
    if (total < 2 || !active || paused || reduceMotion || delay <= 0) return;
    const id = window.setTimeout(() => go(index + 1), delay);
    return () => window.clearTimeout(id);
  }, [index, total, active, paused, reduceMotion, delay, go]);

  // Pause while the viewer is hovering or has keyboard focus inside the carousel.
  const onBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    }
  };

  return (
    <div
      className="vframe__carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label={alt}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={onBlur}
    >
      {sources.map((src, i) => {
        const active = i === index;
        return (
          <Image
            key={i}
            src={src}
            alt={active ? alt : ""}
            aria-hidden={!active}
            fill
            draggable={false}
            priority={priority && i === 0}
            unoptimized={src.startsWith("data:")}
            sizes={sizes}
            className={`vframe__media vframe__carousel-slide${
              active ? " is-active" : ""
            }`}
          />
        );
      })}

      {/*
        Tap anywhere = advance. A real drag travels past the click threshold, so
        onClick never fires and the gesture bubbles to the filmstrip instead —
        giving tap-to-advance and swipe-the-strip from the same surface. Not a
        focus stop; keyboard uses the arrow keys + the controls below.
      */}
      <div
        className="vframe__carousel-advance"
        aria-hidden
        onClick={() => go(index + 1)}
      />

      <button
        type="button"
        className="vframe__carousel-arrow vframe__carousel-arrow--prev"
        aria-label="Previous image"
        onClick={() => go(index - 1)}
      >
        ‹
      </button>
      <button
        type="button"
        className="vframe__carousel-arrow vframe__carousel-arrow--next"
        aria-label="Next image"
        onClick={() => go(index + 1)}
      >
        ›
      </button>

      <div className="vframe__carousel-dots" aria-label="Choose image">
        {sources.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Image ${i + 1} of ${total}`}
            aria-current={i === index}
            className={`vframe__carousel-dot${i === index ? " is-active" : ""}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}
