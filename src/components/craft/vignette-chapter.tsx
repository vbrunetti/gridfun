"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CraftVignette, ImageRatio, VignetteImage } from "@/content/portfolio";
import { vignetteFrameSrc } from "@/lib/portfolio-assets";
import { parseVimeoId } from "@/lib/vimeo";
import { VimeoPlayer } from "@/components/media/vimeo-embed";
import { useCaseStudyVignetteProgressRegister } from "@/components/case-studies/case-study-detail-scroll-context";
import { CraftTagList } from "@/components/craft/vignette-media";

/** One wheel notch / key press = one panel; ignore micro-deltas. */
const STEP_LOCK_MS = 640;
/** Below this the chapter stacks vertically (no scroll-jack). */
const DESKTOP_QUERY = "(min-width: 768px)";

type PanelKind = "title" | "field" | ImageRatio;

/** Fraction of the master grid a panel occupies (title 4 · text/portrait 6 ·
 *  square 8 · landscape 12 of 12). Scales to a 6-col grid as 2/3/4/6. */
function gridFraction(kind: PanelKind): number {
  if (kind === "title") return 4 / 12;
  if (kind === "16x9") return 12 / 12;
  if (kind === "1x1") return 8 / 12;
  // field + portrait
  return 6 / 12;
}

function ratioAspect(ratio: ImageRatio): "16/9" | "9/16" | "1/1" {
  if (ratio === "16x9") return "16/9";
  if (ratio === "1x1") return "1/1";
  return "9/16";
}

function ratioAspectNumbers(ratio: ImageRatio): { w: number; h: number } {
  if (ratio === "16x9") return { w: 16, h: 9 };
  if (ratio === "1x1") return { w: 1, h: 1 };
  return { w: 9, h: 16 };
}

function isVideoFrame(frame: VignetteImage): boolean {
  return Boolean(frame.vimeo && parseVimeoId(frame.vimeo));
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type PanelBg = "default" | "secondary" | "tertiary" | "brand";

const CRUISE_VIGNETTE_SLUG = "semantic-color-shape";

/** Deterministic seed — stable “random” picks across refreshes. */
function hashSlug(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Pick two distinct media-frame indices for secondary / tertiary surfaces. */
function pickMediaAccentPanels(
  frames: VignetteImage[],
  seed: string,
): Map<number, "secondary" | "tertiary"> {
  const mediaIndices = frames
    .map((f, i) => (!f.colorField ? i : -1))
    .filter((i) => i >= 0);
  if (mediaIndices.length < 2) return new Map();

  const shuffled = [...mediaIndices];
  let seedNum = hashSlug(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    seedNum = (seedNum * 1103515245 + 12345) & 0x7fffffff;
    const j = seedNum % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }

  return new Map([
    [shuffled[0]!, "secondary"],
    [shuffled[1]!, "tertiary"],
  ]);
}

function panelBgVar(bg: PanelBg): string {
  if (bg === "secondary") return "var(--panel-surface-secondary)";
  if (bg === "tertiary") return "var(--panel-surface-tertiary)";
  if (bg === "brand") return "var(--color-cruise)";
  return "var(--panel-surface)";
}

function FrameContent({
  vignette,
  frame,
  index,
  active,
}: {
  vignette: CraftVignette;
  frame: VignetteImage;
  index: number;
  active: boolean;
}) {
  const aspect = ratioAspect(frame.ratio);

  // Text-only panel — kicker / beat / foot share the panel grid with media + title.
  if (frame.colorField) {
    return (
      <>
        <header className="vframe__kicker">
          {frame.label ? (
            <p className="vframe__kicker-text text-meta">{frame.label}</p>
          ) : null}
        </header>
        <div className="vframe__main vframe__main--field">
          {frame.body ? <p className="vframe__beat">{frame.body}</p> : null}
        </div>
        <footer className="vframe__foot" aria-hidden />
      </>
    );
  }

  const caption = frame.caption?.trim() || frame.body?.trim() || "";
  const title = caption || frame.label || `${vignette.name} — frame ${index + 1}`;
  const { w: arW, h: arH } = ratioAspectNumbers(frame.ratio);
  const mediaBoxStyle = {
    "--media-ar-w": arW,
    "--media-ar-h": arH,
  } as React.CSSProperties;

  return (
    <>
      <header className="vframe__kicker">
        {frame.label ? (
          <p className="vframe__kicker-text text-meta">{frame.label}</p>
        ) : null}
      </header>
      <div className="vframe__main vframe__main--media">
        <div className="vframe__media-box" style={mediaBoxStyle}>
          {isVideoFrame(frame) && frame.vimeo ? (
            active ? (
              <VimeoPlayer
                videoId={frame.vimeo}
                title={title}
                aspectRatio={aspect === "1/1" ? "16/9" : aspect}
                className="vframe__media vframe__media--video"
              />
            ) : (
              <div className="vframe__media vframe__media--placeholder" aria-hidden>
                <span className="vframe__play">▶</span>
              </div>
            )
          ) : (
            (() => {
              const src = frame.src ?? vignetteFrameSrc(frame.accent, frame.ratio);
              return (
                <Image
                  src={src}
                  alt={title}
                  fill
                  draggable={false}
                  priority={index === 0}
                  unoptimized={src.startsWith("data:")}
                  className="vframe__media"
                  sizes="(max-width: 767px) 92vw, min(100vw, 90rem)"
                />
              );
            })()
          )}
        </div>
      </div>
      <footer className="vframe__foot">
        {caption ? <p className="vframe__caption">{caption}</p> : null}
      </footer>
    </>
  );
}

/**
 * A vignette rendered as a horizontal "chapter": a title panel followed by a
 * filmstrip of full-height panels. Panels abut with no gaps and their widths
 * snap to the master grid (title 4 · text/portrait 6 · square 8 · landscape 12
 * columns, measured off a live .site-grid ruler). The in-focus panel anchors
 * to grid line 1; neighbors bleed/peek off the right and the last panel flushes
 * to the right edge. While pinned, each wheel notch / arrow key pages one panel.
 */
export function VignetteChapter({
  vignette,
  chapterNumber,
  date,
}: {
  vignette: CraftVignette;
  chapterNumber: number;
  date?: string;
}) {
  const frames = vignette.images;
  const total = frames.length;
  // Panel 0 is the title card; frames follow.
  const steps = total + 1;
  const isCruisePrototype = vignette.slug === CRUISE_VIGNETTE_SLUG;

  const mediaAccentPanels = useMemo(
    () =>
      isCruisePrototype
        ? pickMediaAccentPanels(frames, vignette.slug)
        : new Map<number, "secondary" | "tertiary">(),
    [frames, isCruisePrototype, vignette.slug],
  );

  const framePanelBgs = useMemo(
    () =>
      frames.map((frame, i) => {
        if (isCruisePrototype && i === total - 1) return "brand" as PanelBg;
        if (!frame.colorField) {
          const accent = mediaAccentPanels.get(i);
          if (accent) return accent;
        }
        return "default" as PanelBg;
      }),
    [frames, isCruisePrototype, mediaAccentPanels, total],
  );

  const panelKinds = useMemo<PanelKind[]>(
    () => ["title", ...frames.map((f) => (f.colorField ? "field" : f.ratio))],
    [frames],
  );

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);

  const [index, setIndex] = useState(0);
  const [translate, setTranslate] = useState(0);
  const [pinned, setPinned] = useState(false);

  const indexRef = useRef(0);
  const insetRef = useRef(0);
  const lockRef = useRef(false);
  const pinnedRef = useRef(false);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const vignetteProgress = useMemo(
    () =>
      pinned
        ? {
            vignetteSlug: vignette.slug,
            panelIndex: index,
            panelCount: steps,
          }
        : null,
    [pinned, vignette.slug, index, steps],
  );

  useCaseStudyVignetteProgressRegister(vignetteProgress);

  // Every in-focus panel anchors to grid line 1. Colorful last panels may add a
  // non-nav trail sibling that fills the viewport to the right of the strip.
  const updateTranslate = useCallback((activeIndex: number) => {
    const panel = panelRefs.current[activeIndex];
    if (!panel) return;
    const inset = insetRef.current;
    setTranslate(Math.min(inset, inset - panel.offsetLeft));
  }, []);

  // Measure the real grid (ruler) and size each panel to N grid columns.
  const applyLayout = useCallback(() => {
    const stage = stageRef.current;
    const ruler = rulerRef.current;
    if (!stage || !ruler) return;

    const desktop = window.matchMedia(DESKTOP_QUERY).matches;
    if (!desktop) {
      panelRefs.current.forEach((node) => {
        if (node) node.style.width = "";
      });
      setTranslate(0);
      return;
    }

    const cols =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--grid-columns",
        ),
        10,
      ) || 12;

    const pinLeft = stage.getBoundingClientRect().left;
    const cells = Array.from(
      ruler.querySelectorAll<HTMLElement>("[data-col]"),
    ).slice(0, cols);
    if (cells.length < cols) return;

    const lefts = cells.map((c) => c.getBoundingClientRect().left - pinLeft);
    const rights = cells.map((c) => c.getBoundingClientRect().right - pinLeft);
    insetRef.current = lefts[0];

    const widthForCols = (n: number) =>
      rights[Math.min(Math.max(n, 1), cols) - 1] - lefts[0];

    panelKinds.forEach((kind, i) => {
      const node = panelRefs.current[i];
      if (!node) return;
      const n = Math.max(1, Math.round(gridFraction(kind) * cols));
      node.style.width = `${widthForCols(n)}px`;
    });

    updateTranslate(indexRef.current);
  }, [panelKinds, updateTranslate]);

  useLayoutEffect(() => {
    updateTranslate(index);
  }, [index, updateTranslate]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    // ResizeObserver fires once on observe — that drives the initial measure.
    const observer = new ResizeObserver(() => applyLayout());
    observer.observe(stage);
    window.addEventListener("resize", applyLayout);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", applyLayout);
    };
  }, [applyLayout]);

  // Derive the active panel from scroll position; intercept wheel/keys for
  // crisp one-notch-per-panel stepping while the chapter is pinned.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    const stepPx = () => window.innerHeight;
    const sectionTop = () =>
      section.getBoundingClientRect().top + window.scrollY;

    const indexFromScroll = () => {
      const raw = Math.round((window.scrollY - sectionTop()) / stepPx());
      return Math.max(0, Math.min(steps - 1, raw));
    };

    const isPinned = () => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 1 && rect.bottom - window.innerHeight >= -1;
    };

    const scrollToPanel = (next: number) => {
      const clamped = Math.max(0, Math.min(steps - 1, next));
      lockRef.current = true;
      setIndex(clamped);
      window.scrollTo({
        top: sectionTop() + clamped * stepPx(),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
      window.setTimeout(
        () => {
          lockRef.current = false;
        },
        prefersReducedMotion() ? 48 : STEP_LOCK_MS,
      );
    };

    const onScroll = () => {
      const pinnedNow = isPinned();
      if (pinnedNow !== pinnedRef.current) {
        pinnedRef.current = pinnedNow;
        setPinned(pinnedNow);
      }
      if (lockRef.current) return;
      const next = indexFromScroll();
      if (next !== indexRef.current) setIndex(next);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!desktop.matches || !isPinned()) return;
      const next =
        event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
      if (next === 0) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) {
        return;
      }
      event.preventDefault();
      if (lockRef.current) return;
      scrollToPanel(indexRef.current + next);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [steps]);

  if (total === 0) return null;

  const lastFrameBg =
    total > 0 ? framePanelBgs[total - 1]! : ("default" as PanelBg);
  const hasColorfulLastPanel = lastFrameBg !== "default";

  return (
    <section
      ref={sectionRef}
      className="cs-focus-section vchapter theme-dark"
      id={`vignette-${vignette.slug}`}
      data-cs-detail-row
      data-chrome-surface="dark"
      style={{ ["--frames" as string]: String(steps) }}
      aria-roledescription="vignette chapter"
      aria-label={vignette.name}
    >
      <div className="vchapter__pin" ref={stageRef}>
        {/* Invisible ruler — mirrors the master grid so panels snap to it. */}
        <div className="vchapter__ruler site-grid" aria-hidden ref={rulerRef}>
          {Array.from({ length: 12 }).map((_, i) => (
            <i key={i} data-col />
          ))}
        </div>

        <div
          ref={trackRef}
          className="vchapter__track"
          style={{ transform: `translate3d(${translate}px, 0, 0)` }}
        >
          <article
            ref={(node) => {
              panelRefs.current[0] = node;
            }}
            className={`vframe vframe--title${index === 0 ? " is-active" : ""}`}
            data-vframe-index={0}
          >
            <header className="vframe__kicker">
              <p className="vframe__kicker-text text-meta">{date ?? "\u00A0"}</p>
            </header>
            <div className="vframe__main vframe__main--title">
              <p className="vchapter__numeral">
                {String(chapterNumber).padStart(2, "0")}
              </p>
              <h2 className="vchapter__title">{vignette.name}</h2>
            </div>
            <footer className="vframe__foot vframe__foot--tags">
              <CraftTagList tags={vignette.tags} className="vchapter__tags" />
            </footer>
          </article>

          {frames.map((frame, i) => {
            const idx = i + 1;
            const panelBg = framePanelBgs[i]!;
            return (
              <article
                key={i}
                ref={(node) => {
                  panelRefs.current[idx] = node;
                }}
                className={`vframe vframe--${frame.ratio}${
                  frame.colorField ? " vframe--field" : ""
                }${idx === index ? " is-active" : ""}`}
                data-vframe-index={idx}
                data-panel-bg={panelBg}
                style={{
                  ["--panel-bg" as string]: panelBgVar(panelBg),
                }}
                aria-hidden={idx !== index}
              >
                <FrameContent
                  vignette={vignette}
                  frame={frame}
                  index={idx}
                  active={idx === index}
                />
              </article>
            );
          })}
          {hasColorfulLastPanel ? (
            <div
              className={`vchapter__trail${
                index === steps - 1 ? " is-active" : ""
              }`}
              aria-hidden
              style={{ background: panelBgVar(lastFrameBg) }}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
