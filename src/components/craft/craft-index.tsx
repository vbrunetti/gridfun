"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GhostButton } from "@/components/chrome/cta-button";
import { CraftMasonry } from "@/components/craft/craft-masonry";
import { VignetteKeyImage, craftCardRatio } from "@/components/craft/vignette-media";
import { RuledGrid } from "@/components/layout/ruled-grid";
import {
  allCraftTags,
  craftActiveTagsFromParam,
  getAllVignettes,
  vignetteMatchesActiveTags,
  type VignetteWithStudy,
} from "@/content/portfolio";

function CraftFilterToggle({
  tag,
  active,
  onToggle,
  variant = "compact",
}: {
  tag: string;
  active: boolean;
  onToggle: () => void;
  variant?: "hero" | "compact";
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={`${tag} filter ${active ? "on" : "off"}`}
      onClick={onToggle}
      className={`craft-filter-chip craft-filter-chip--${variant} ${
        active ? "craft-filter-chip--on" : ""
      }`}
    >
      <span className="craft-filter-chip__dot" aria-hidden />
      {tag}
    </button>
  );
}

function CraftFiltersAllToggle({
  activeTags,
  onToggleAll,
  tags,
  variant,
}: {
  activeTags: Set<string>;
  onToggleAll: () => void;
  tags: string[];
  variant: "hero" | "compact";
}) {
  const allOn =
    tags.length > 0 && tags.every((tag) => activeTags.has(tag));

  return (
    <GhostButton
      onClick={onToggleAll}
      icon={allOn ? "x" : "check"}
      chipSize={variant}
      aria-label={allOn ? "Turn all craft tags off" : "Turn all craft tags on"}
    >
      {allOn ? "Turn all off" : "Turn all on"}
    </GhostButton>
  );
}

function CraftFilters({
  activeTags,
  onToggle,
  onToggleAll,
  tags,
  variant,
  className = "",
  visible = true,
}: {
  activeTags: Set<string>;
  onToggle: (tag: string) => void;
  onToggleAll: () => void;
  tags: string[];
  variant: "hero" | "compact";
  className?: string;
  visible?: boolean;
}) {
  if (variant === "compact") {
    return (
      <CraftFiltersPager
        activeTags={activeTags}
        onToggle={onToggle}
        onToggleAll={onToggleAll}
        tags={tags}
        className={className}
        visible={visible}
      />
    );
  }

  return (
    <div
      className={`craft-filters craft-filters--hero ${className}`.trim()}
      role="group"
      aria-label="Filter by craft tag"
    >
      {tags.map((tag) => (
        <CraftFilterToggle
          key={tag}
          tag={tag}
          active={activeTags.has(tag)}
          onToggle={() => onToggle(tag)}
          variant="hero"
        />
      ))}
      <CraftFiltersAllToggle
        activeTags={activeTags}
        onToggleAll={onToggleAll}
        tags={tags}
        variant="hero"
      />
    </div>
  );
}

/** Compact sticky-header filters — paginate when tags overflow the bar. */
function CraftFiltersPager({
  activeTags,
  onToggle,
  onToggleAll,
  tags,
  className = "",
  visible = true,
}: {
  activeTags: Set<string>;
  onToggle: (tag: string) => void;
  onToggleAll: () => void;
  tags: string[];
  className?: string;
  /** Sticky header visibility — remeasure when the bar appears. */
  visible?: boolean;
}) {
  const maskRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  const updateScrollState = useCallback(() => {
    const mask = maskRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const pager = mask?.parentElement;
    if (!mask || !viewport || !track || !pager) return;

    const rootFont =
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
      16;
    const btnSlot = 1.65 * rootFont;
    const gap =
      Number.parseFloat(getComputedStyle(pager).columnGap) ||
      Number.parseFloat(getComputedStyle(pager).gap) ||
      0.35 * rootFont;
    const reserved = btnSlot * 2 + gap * 2;
    const available = Math.max(0, pager.clientWidth - reserved);
    const maxScroll = track.scrollWidth - available;

    setOverflowing(maxScroll > 2);
    setCanPrev(viewport.scrollLeft > 2);
    setCanNext(viewport.scrollLeft < maxScroll - 2);
  }, []);

  useLayoutEffect(() => {
    const mask = maskRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const pager = mask?.parentElement;
    if (!mask || !viewport || !track || !pager) return;

    const measure = () => {
      updateScrollState();
    };

    measure();
    const frame = requestAnimationFrame(measure);

    const observer = new ResizeObserver(measure);
    observer.observe(pager);
    observer.observe(mask);
    observer.observe(track);
    viewport.addEventListener("scroll", measure, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      viewport.removeEventListener("scroll", measure);
    };
  }, [tags, visible, updateScrollState]);

  useLayoutEffect(() => {
    if (!visible) return;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(updateScrollState);
    });
    return () => cancelAnimationFrame(frame);
  }, [visible, tags, updateScrollState]);

  const step = useCallback((direction: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollBy({
      left: direction * viewport.clientWidth * 0.85,
      behavior: "smooth",
    });
  }, []);

  return (
    <div
      className={`craft-filters-pager ${className}`.trim()}
      data-overflow={overflowing ? "true" : "false"}
    >
      <button
        type="button"
        className="craft-filters-pager__btn craft-filters-pager__btn--prev"
        aria-label="Previous tags"
        disabled={!canPrev}
        onClick={() => step(-1)}
      >
        ‹
      </button>

      <div
        ref={maskRef}
        className="craft-filters-pager__mask"
        data-fade-start={canPrev ? "true" : "false"}
        data-fade-end={canNext ? "true" : "false"}
      >
        <div ref={viewportRef} className="craft-filters-pager__viewport">
          <div
            ref={trackRef}
            className="craft-filters--compact craft-filters-pager__track"
            role="group"
            aria-label="Filter by craft tag"
          >
            {tags.map((tag) => (
              <CraftFilterToggle
                key={tag}
                tag={tag}
                active={activeTags.has(tag)}
                onToggle={() => onToggle(tag)}
                variant="compact"
              />
            ))}
          </div>
        </div>
      </div>

      <CraftFiltersAllToggle
        activeTags={activeTags}
        onToggleAll={onToggleAll}
        tags={tags}
        variant="compact"
      />

      <button
        type="button"
        className="craft-filters-pager__btn craft-filters-pager__btn--next"
        aria-label="Next tags"
        disabled={!canNext}
        onClick={() => step(1)}
      >
        ›
      </button>
    </div>
  );
}

function VignetteCard({ entry }: { entry: VignetteWithStudy }) {
  const { vignette, caseStudy } = entry;

  return (
    <Link href={`/craft/${vignette.slug}`} className="craft-card">
      <VignetteKeyImage
        vignette={vignette}
        className="craft-portrait"
        displayRatio={craftCardRatio(vignette.slug)}
      />
      <div className="craft-card-copy">
        <h2 className="craft-card-title">{vignette.name}</h2>
        <p className="text-meta mt-2">{caseStudy.client}</p>
      </div>
    </Link>
  );
}

export function CraftIndex({ initialTag }: { initialTag?: string } = {}) {
  const allVignettes = useMemo(() => getAllVignettes(), []);
  const allTags = useMemo(() => allCraftTags(), []);

  const [activeTags, setActiveTags] = useState<Set<string>>(() =>
    craftActiveTagsFromParam(initialTag),
  );
  const [compactHeader, setCompactHeader] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveTags(craftActiveTagsFromParam(initialTag));
  }, [initialTag]);

  const visibleVignettes = useMemo(
    () =>
      allVignettes.filter(({ vignette }) =>
        vignetteMatchesActiveTags(vignette, activeTags),
      ),
    [allVignettes, activeTags],
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCompactHeader(!entry.isIntersecting),
      { root: null, threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  }

  function toggleAllTags() {
    setActiveTags((prev) => {
      const allOn = allTags.every((tag) => prev.has(tag));
      return allOn ? new Set<string>() : new Set(allTags);
    });
  }

  return (
    <div className="craft-page">
      <header className="craft-hero-header keyline-b">
        <RuledGrid className="craft-hero__grid">
          <div className="craft-hero__meta">
            <p className="text-label-sm text-mono-label craft-hero-meta craft-hero-meta--vignettes">
              {visibleVignettes.length} VIGNETTES
            </p>
            <p className="text-label-sm text-mono-label craft-hero-meta craft-hero-meta--tags">
              {allTags.length} TAGS
            </p>
            <p className="text-label-sm text-mono-label craft-hero-meta craft-hero-meta--date">
              2023–2025
            </p>
          </div>
          <div className="craft-hero__main">
            <div className="craft-hero__main-grid">
              <h1 className="craft-hero__title display-xl">Craft</h1>
              <CraftFilters
                variant="hero"
                tags={allTags}
                activeTags={activeTags}
                onToggle={toggleTag}
                onToggleAll={toggleAllTags}
                className="craft-hero__filters"
              />
            </div>
          </div>
        </RuledGrid>
      </header>

      <div ref={sentinelRef} className="craft-header-sentinel" aria-hidden />

      <header
        className={`craft-sticky-header keyline-b ${
          compactHeader ? "craft-sticky-header--visible" : ""
        }`}
        aria-hidden={!compactHeader}
      >
        <div className="craft-sticky-header__inner">
          <div className="craft-sticky-header__title">
            <p className="display-md">Craft</p>
          </div>
          <div className="craft-sticky-header__filters">
            <CraftFilters
              variant="compact"
              tags={allTags}
              activeTags={activeTags}
              onToggle={toggleTag}
              onToggleAll={toggleAllTags}
              visible={compactHeader}
            />
          </div>
        </div>
      </header>

      {visibleVignettes.length === 0 ? (
        <p className="craft-empty text-secondary">
          Turn on at least one craft tag to show vignettes.
        </p>
      ) : (
        <div className="craft-masonry-wrap">
          <RuledGrid>
            <CraftMasonry>
              {visibleVignettes.map((entry) => (
                <VignetteCard key={entry.vignette.slug} entry={entry} />
              ))}
            </CraftMasonry>
          </RuledGrid>
        </div>
      )}
    </div>
  );
}
