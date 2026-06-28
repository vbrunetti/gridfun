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
import type { CraftVignette, ImageRatio, PanelBg, VignetteImage } from "@/content/portfolio";
import {
  clientBrandColorVar,
  isClientBrandColor,
} from "@/lib/client-brand-colors";
import { vignetteFrameSrc } from "@/lib/portfolio-assets";
import { parseVimeoId } from "@/lib/vimeo";
import { VimeoPlayer } from "@/components/media/vimeo-embed";
import { useCaseStudyVignetteProgressRegister } from "@/components/case-studies/case-study-detail-scroll-context";
import { CraftTagList } from "@/components/craft/vignette-media";
import { attachHorizontalGestures } from "@/components/deck/gestures";
/** Grid-width panel layout — lg+ only; mobile uses CSS widths + pin padding. */
const GRID_LAYOUT_QUERY = "(min-width: 1024px)";
/** Horizontal filmstrip gestures — active on all viewports. */
const HORIZONTAL_TRACK_QUERY = "all";

export const VCHAPTER_PANEL_EVENT = "vchapter:panel";

export type VchapterPanelEventDetail = {
  panelIndex: number;
  smooth?: boolean;
};


type PanelKind = "title" | "field" | ImageRatio;

/** Column span on the master grid — mobile uses the 6-col track explicitly. */
function panelColSpan(kind: PanelKind, cols: number): number {
  if (cols <= 6) {
    if (kind === "title") return 4;
    return 6;
  }
  if (kind === "title") return 4;
  if (kind === "16x9") return 12;
  if (kind === "1x1") return 8;
  return 6;
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

function panelBgVar(bg: PanelBg, colorway: "dark" | "white" = "dark"): string {
  if (bg === "brand" || isClientBrandColor(bg)) {
    return clientBrandColorVar(bg === "brand" ? "cruise-primary" : bg);
  }

  if (colorway === "white") {
    if (bg === "secondary") return "var(--panel-surface-secondary)";
    if (bg === "tertiary") return "var(--panel-surface-tertiary)";
    return "var(--panel-surface)";
  }

  if (bg === "secondary") return "var(--panel-surface-secondary)";
  if (bg === "tertiary") return "var(--panel-surface-tertiary)";
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

  if (frame.colorField) {
    return (
      <>
        <header className="vframe__kicker">
          {frame.label ? (
            <p className="vframe__kicker-text text-meta">{frame.label}</p>
          ) : null}
        </header>
        <div className="vframe__main vframe__main--field">
          {frame.body ? <p className="display-sm vframe__beat">{frame.body}</p> : null}
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
                aspectRatio={aspect}
                background={frame.vimeoBackground}
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
        {caption ? <p className="text-caption vframe__caption text-secondary">{caption}</p> : null}
      </footer>
    </>
  );
}

/**
 * Horizontal filmstrip chapter — translateX track on a pinned row.
 * Vertical wheel maps 1:1 to horizontal drag; nearest panel snaps on idle.
 */
export function VignetteChapter({
  vignette,
  chapterNumber,
  date,
  showTitlePanel = true,
  colorway = "dark",
  controlled = false,
}: {
  vignette: CraftVignette;
  chapterNumber: number;
  date?: string;
  /** Opener panel (numeral + title + tags). Off when the page hero already covers it. */
  showTitlePanel?: boolean;
  /** Surface theme for the filmstrip — white on standalone craft detail. */
  colorway?: "dark" | "white";
  /**
   * When true, an external deck controller owns wheel/keyboard input at the desktop
   * breakpoint (case-study detail). This component then only moves on panel-jump
   * events; it keeps its own gestures on mobile and on standalone craft detail.
   */
  controlled?: boolean;
}) {
  const frames = vignette.images;
  const total = frames.length;
  const titlePanelOffset = showTitlePanel ? 1 : 0;
  const steps = total + titlePanelOffset;

  const framePanelBgs = useMemo(
    () => frames.map((frame) => frame.panelBg ?? "default"),
    [frames],
  );

  const panelKinds = useMemo<PanelKind[]>(
    () =>
      showTitlePanel
        ? ["title", ...frames.map((f) => (f.colorField ? "field" : f.ratio))]
        : frames.map((f) => (f.colorField ? "field" : f.ratio)),
    [frames, showTitlePanel],
  );

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);

  const [index, setIndex] = useState(0);
  const [translate, setTranslate] = useState(0);
  const [chapterActive, setChapterActive] = useState(false);

  const indexRef = useRef(0);
  const insetRef = useRef(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const vignetteProgress = useMemo(
    () =>
      chapterActive
        ? {
            vignetteSlug: vignette.slug,
            panelIndex: index,
            panelCount: steps,
          }
        : null,
    [chapterActive, vignette.slug, index, steps],
  );

  useCaseStudyVignetteProgressRegister(vignetteProgress);

  const panelOffsets = useCallback(() => {
    return panelRefs.current
      .filter((node): node is HTMLElement => Boolean(node))
      .map((panel) => panel.offsetLeft);
  }, []);

  const maxOffset = useCallback(() => {
    const offsets = panelOffsets();
    return offsets[offsets.length - 1] ?? 0;
  }, [panelOffsets]);

  const indexAtOffset = useCallback(
    (offset: number) => {
      const offsets = panelOffsets();
      if (offsets.length === 0) return 0;

      let best = 0;
      let minDistance = Infinity;
      offsets.forEach((snap, i) => {
        const distance = Math.abs(offset - snap);
        if (distance < minDistance) {
          minDistance = distance;
          best = i;
        }
      });
      return best;
    },
    [panelOffsets],
  );

  const setTrackTransition = useCallback((animate: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = animate && !prefersReducedMotion()
      ? "transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1)"
      : "none";
  }, []);

  const applyOffset = useCallback(
    (nextOffset: number, animate: boolean) => {
      const max = maxOffset();
      const clamped = Math.max(0, Math.min(max, nextOffset));
      offsetRef.current = clamped;
      setTrackTransition(animate);
      setTranslate(insetRef.current - clamped);

      const nextIndex = indexAtOffset(clamped);
      if (nextIndex !== indexRef.current) {
        indexRef.current = nextIndex;
        setIndex(nextIndex);
      }
    },
    [indexAtOffset, maxOffset, setTrackTransition],
  );

  const goToPanel = useCallback(
    (next: number, animate: boolean) => {
      const clamped = Math.max(0, Math.min(steps - 1, next));
      const panel = panelRefs.current[clamped];
      if (!panel) return;
      applyOffset(panel.offsetLeft, animate);
    },
    [applyOffset, steps],
  );

  const applyLayout = useCallback(() => {
    const stage = stageRef.current;
    const ruler = rulerRef.current;
    if (!stage || !ruler) return;

    const useGridLayout = window.matchMedia(GRID_LAYOUT_QUERY).matches;
    if (!useGridLayout) {
      panelRefs.current.forEach((node) => {
        if (node) node.style.width = "";
      });
      insetRef.current = 0;
      offsetRef.current = 0;
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
    // Track inset = grid column 0's left offset from the pin edge (= --grid-margin).
    // Panels start at grid col 1; --panel-pad then insets text from the panel edge.
    insetRef.current = lefts[0] ?? 0;

    const widthForCols = (n: number) =>
      rights[Math.min(Math.max(n, 1), cols) - 1]! - lefts[0]!;

    panelKinds.forEach((kind, i) => {
      const node = panelRefs.current[i];
      if (!node) return;
      const n = Math.max(1, Math.min(cols, panelColSpan(kind, cols)));
      node.style.width = `${widthForCols(n)}px`;
    });

    applyOffset(offsetRef.current, false);
  }, [applyOffset, panelKinds]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new ResizeObserver(() => applyLayout());
    observer.observe(stage);
    window.addEventListener("resize", applyLayout);
    applyLayout();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", applyLayout);
    };
  }, [applyLayout]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const desktop = window.matchMedia(HORIZONTAL_TRACK_QUERY);

    // Sync chapterActive from focused class; gestures module owns entry lock.
    const syncFocused = () => {
      setChapterActive(section.classList.contains("is-focused"));
    };
    const focusObserver = new MutationObserver(syncFocused);
    focusObserver.observe(section, { attributes: true, attributeFilter: ["class"] });
    syncFocused();

    const controlMq = window.matchMedia(GRID_LAYOUT_QUERY);
    let scrollPinActive = false;
    let detachGestures: (() => void) | null = null;
    let rafId = 0;

    const onPanelJump = (event: Event) => {
      // In scroll-pin mode the native scroll position owns the track, so ignore
      // imperative jumps (the deck scrolls to the panel instead).
      if (scrollPinActive) return;
      const detail = (event as CustomEvent<VchapterPanelEventDetail>).detail;
      if (!detail || !Number.isFinite(detail.panelIndex)) return;
      goToPanel(detail.panelIndex, detail.smooth ?? true);
    };
    section.addEventListener(VCHAPTER_PANEL_EVENT, onPanelJump);

    // Scroll-driven horizontal pin (controlled + desktop). The section is tall and
    // the filmstrip pin sticks; native vertical scroll progress maps 1:1 to the
    // track's translateX, interpolating between panel snap offsets. CSS snap-stops
    // (one per panel) make the browser snap one panel per flick — no wheel hijack.
    const applyFromScroll = () => {
      const pin = stageRef.current;
      if (!pin) return;
      const travel = section.offsetHeight - pin.offsetHeight;
      if (travel <= 0) {
        applyOffset(0, false);
        return;
      }
      const scrolled = Math.min(
        Math.max(-section.getBoundingClientRect().top, 0),
        travel,
      );
      const frac = (scrolled / travel) * Math.max(steps - 1, 0);
      const offsets = panelOffsets();
      const i0 = Math.floor(frac);
      const i1 = Math.min(i0 + 1, offsets.length - 1);
      const a = offsets[i0] ?? 0;
      const b = offsets[i1] ?? a;
      applyOffset(a + (b - a) * (frac - i0), false);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        applyFromScroll();
      });
    };

    // Gesture layer (mobile, or standalone non-pinned): vertical/horizontal swipe
    // drives the track. mobileBiaxial lets a vertical swipe advance it on touch.
    const attachGestures = () =>
      attachHorizontalGestures(section, {
        getOffset: () => offsetRef.current,
        getMaxOffset: maxOffset,
        applyDelta: (delta) => {
          if (!desktop.matches) return;
          applyOffset(offsetRef.current + delta, false);
        },
        step: (dir) => {
          if (!desktop.matches) return;
          goToPanel(indexRef.current + dir, true);
        },
        getIndex: () => indexRef.current,
        goToIndex: (i) => {
          if (!desktop.matches) return;
          goToPanel(i, true);
        },
        snapToNearest: () => {
          if (!desktop.matches) return;
          const offsets = panelOffsets();
          const idx = indexAtOffset(offsetRef.current);
          applyOffset(offsets[idx] ?? 0, true);
        },
        isFocused: () => section.classList.contains("is-focused"),
        mobileBiaxial: true,
      });

    const evaluateInput = () => {
      const wantPin = controlled && controlMq.matches;
      if (wantPin === scrollPinActive) {
        if (!wantPin && !detachGestures) detachGestures = attachGestures();
        return;
      }
      scrollPinActive = wantPin;
      if (wantPin) {
        if (detachGestures) {
          detachGestures();
          detachGestures = null;
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        applyFromScroll();
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (!detachGestures) detachGestures = attachGestures();
      }
    };

    evaluateInput();
    controlMq.addEventListener("change", evaluateInput);

    return () => {
      focusObserver.disconnect();
      section.removeEventListener(VCHAPTER_PANEL_EVENT, onPanelJump);
      controlMq.removeEventListener("change", evaluateInput);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (detachGestures) detachGestures();
    };
  }, [applyOffset, controlled, goToPanel, indexAtOffset, maxOffset, panelOffsets, steps]);

  if (total === 0) return null;

  const lastFrameBg =
    total > 0 ? framePanelBgs[total - 1]! : ("default" as PanelBg);

  const themeClass = colorway === "white" ? "theme-white" : "theme-dark";
  const chromeSurface = colorway === "white" ? "light" : "dark";

  return (
    <section
      ref={sectionRef}
      className={`cs-focus-section vchapter ${themeClass}`}
      id={`vignette-${vignette.slug}`}
      data-cs-detail-row
      data-scroll-pin={controlled ? "" : undefined}
      data-chrome-surface={chromeSurface}
      data-colorway={colorway}
      aria-roledescription="vignette chapter"
      aria-label={vignette.name}
    >
      <div className="vchapter__pin" ref={stageRef}>
        <div className="vchapter__ruler site-grid" aria-hidden ref={rulerRef}>
          {Array.from({ length: 12 }).map((_, i) => (
            <i key={i} data-col />
          ))}
        </div>

        <div
          ref={trackRef}
          className="vchapter__track"
          style={{ transform: `translate3d(${translate}px, 0, 0)` }}
          aria-label={`${vignette.name} panels`}
        >
          {showTitlePanel ? (
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
              <p className="display-numeral vchapter__numeral">
                {String(chapterNumber).padStart(2, "0")}
              </p>
            </div>
            <footer className="vframe__foot vframe__foot--title">
              <div className="vframe__title-block">
                <h2 className="display-md vchapter__title">{vignette.name}</h2>
                <CraftTagList
                  tags={vignette.tags}
                  className="vchapter__tags"
                  variant="filter-link"
                />
              </div>
            </footer>
          </article>
          ) : null}

          {frames.map((frame, i) => {
            const idx = i + titlePanelOffset;
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
                  ["--panel-bg" as string]: panelBgVar(panelBg, colorway),
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
          <div
            className={`vchapter__trail${
              index === steps - 1 ? " is-active" : ""
            }`}
            aria-hidden
            data-panel-bg={lastFrameBg}
            style={{ background: panelBgVar(lastFrameBg, colorway) }}
          />
        </div>
      </div>
      {controlled ? (
        <div className="vchapter__stops" aria-hidden>
          {Array.from({ length: steps }).map((_, i) => (
            <div key={i} className="vchapter__stop" />
          ))}
        </div>
      ) : null}
    </section>
  );
}
