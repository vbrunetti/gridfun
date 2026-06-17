"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { CraftVignette, ImageRatio, VignetteImage } from "@/content/portfolio";
import { vignetteFrameSrc } from "@/lib/portfolio-assets";
import { parseVimeoId } from "@/lib/vimeo";
import { VimeoPlayer } from "@/components/media/vimeo-embed";
import { STEP_LOCK_MS, SWIPE_THRESHOLD_PX } from "@/components/deck/gestures";

/** Wheel delta magnitude needed before a page turn registers. */
const WHEEL_THRESHOLD = 14;

function ratioDimensions(ratio: ImageRatio): { width: number; height: number } {
  return ratio === "16x9"
    ? { width: 1600, height: 900 }
    : { width: 900, height: 1600 };
}

function ratioAspect(ratio: ImageRatio): "16/9" | "9/16" {
  return ratio === "16x9" ? "16/9" : "9/16";
}

function frameSrc(vignette: CraftVignette, frameIndex: number): string {
  const image = vignette.images[frameIndex];
  return image.src ?? vignetteFrameSrc(image.accent, image.ratio);
}

function isVideoFrame(image: VignetteImage): boolean {
  return Boolean(image.vimeo && parseVimeoId(image.vimeo));
}

/**
 * Paginated vignette gallery.
 *
 * Stage height is viewport-based (CSS). Slides size to their media; the gap sits
 * after each frame boundary. Supports images and Vimeo embeds.
 */
export function VignetteImageScroll({
  vignette,
  layout = "default",
}: {
  vignette: CraftVignette;
  /** Accepted for back-compat; the bottom counter replaces the old header. */
  showHeader?: boolean;
  layout?: "default" | "grid";
}) {
  const total = vignette.images.length;
  const isGrid = layout === "grid";

  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);

  const [index, setIndex] = useState(0);
  const [translate, setTranslate] = useState(0);

  const indexRef = useRef(0);
  const lockRef = useRef(false);
  const pointerStartX = useRef<number | null>(null);
  const pointerMoved = useRef(false);

  // Keep ref in sync during render — useLayoutEffect runs before useEffect.
  indexRef.current = index;

  const updateTranslate = useCallback((activeIndex: number = indexRef.current) => {
    const track = trackRef.current;
    const slide = slideRefs.current[activeIndex];
    if (!track || !slide) return;

    // Active slide left edge locks to column 1 (track origin / stage left).
    setTranslate(-slide.offsetLeft);
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage) return;

    const measure = () => updateTranslate();

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    if (track) observer.observe(track);
    slideRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [updateTranslate, total]);

  useLayoutEffect(() => {
    updateTranslate(index);
  }, [index, updateTranslate]);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      if (clamped === indexRef.current) return;
      lockRef.current = true;
      window.setTimeout(() => {
        lockRef.current = false;
      }, STEP_LOCK_MS);
      setIndex(clamped);
    },
    [total],
  );

  const step = useCallback(
    (direction: number) => {
      if (lockRef.current) return;
      goTo(indexRef.current + direction);
    },
    [goTo],
  );

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      // Accept whichever axis has dominant intent — horizontal trackpad or vertical scroll.
      const dominant =
        Math.abs(event.deltaX) >= Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      if (Math.abs(dominant) < WHEEL_THRESHOLD) return;
      event.preventDefault();
      step(dominant > 0 ? 1 : -1);
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [step]);

  function onKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(total - 1);
    }
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    pointerStartX.current = event.clientX;
    pointerMoved.current = false;
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null) return;
    if (Math.abs(event.clientX - pointerStartX.current) > 6) {
      pointerMoved.current = true;
    }
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null) return;
    const dx = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX) {
      step(dx < 0 ? 1 : -1);
    }
  }

  if (total === 0) return null;

  const activeCaption = vignette.images[index]?.caption?.trim() ?? "";

  const wrapClassName = `vignette-gallery${
    layout === "grid" ? " vignette-gallery--grid" : ""
  }`;

  const stageClassName = `vignette-gallery__stage${
    isGrid ? " vignette-gallery__stage--grid" : ""
  }`;

  return (
    <div className={wrapClassName}>
      <div
        ref={stageRef}
        className={stageClassName}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${vignette.name} — gallery`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointerStartX.current = null;
        }}
      >
        <div
          ref={trackRef}
          className="vignette-gallery__track"
          style={{ transform: `translate3d(${translate}px, 0, 0)` }}
        >
          {vignette.images.map((image, i) => {
            const { width, height } = ratioDimensions(image.ratio);
            const src = frameSrc(vignette, i);
            const active = i === index;
            const alt =
              image.caption?.trim() ||
              `${vignette.name} frame ${String(i + 1).padStart(2, "0")}`;
            const video = isVideoFrame(image);

            return (
              <figure
                key={i}
                ref={(node) => {
                  slideRefs.current[i] = node;
                }}
                className={`vignette-gallery__slide${active ? " is-active" : ""}${
                  video ? " vignette-gallery__slide--video" : ""
                }`}
                aria-hidden={!active}
                onClick={() => {
                  if (!active && !pointerMoved.current && !lockRef.current) {
                    goTo(i);
                  }
                }}
              >
                {video && image.vimeo ? (
                  active ? (
                    <VimeoPlayer
                      videoId={image.vimeo}
                      title={alt}
                      aspectRatio={ratioAspect(image.ratio)}
                      className="vignette-gallery__video"
                    />
                  ) : (
                    <div
                      className="vignette-gallery__video-placeholder"
                      style={{ aspectRatio: ratioAspect(image.ratio) }}
                      aria-hidden
                    >
                      <span className="vignette-gallery__video-icon">▶</span>
                    </div>
                  )
                ) : (
                  <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    draggable={false}
                    priority={i === 0}
                    unoptimized={src.startsWith("data:")}
                    className="vignette-gallery__media"
                    sizes={
                      layout === "grid"
                        ? "(min-width: 1024px) 90rem, 100vw"
                        : "(max-width: 768px) 86vw, 60vw"
                    }
                  />
                )}
              </figure>
            );
          })}
        </div>
      </div>

      {total > 1 ? (
        <div className="vignette-gallery__bar">
          <p className="vignette-gallery__counter text-meta" aria-live="polite">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </p>
          <div className="vignette-gallery__nav">
            <button
              type="button"
              className="vignette-gallery__btn"
              aria-label="Previous frame"
              disabled={index === 0}
              onClick={() => step(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="vignette-gallery__btn"
              aria-label="Next frame"
              disabled={index === total - 1}
              onClick={() => step(1)}
            >
              ›
            </button>
          </div>
        </div>
      ) : null}

      <p
        className={`text-caption vignette-gallery__caption${
          activeCaption ? "" : " is-empty"
        }`}
      >
        {activeCaption || "\u00A0"}
      </p>
    </div>
  );
}
