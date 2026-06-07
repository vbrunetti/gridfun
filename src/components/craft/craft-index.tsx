"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CraftMasonry } from "@/components/craft/craft-masonry";
import { VignetteKeyImage } from "@/components/craft/vignette-media";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";
import {
  allCraftTags,
  getAllVignettes,
  vignetteIndexLabel,
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

function CraftFilters({
  activeTags,
  onToggle,
  tags,
  variant,
  className = "",
}: {
  activeTags: Set<string>;
  onToggle: (tag: string) => void;
  tags: string[];
  variant: "hero" | "compact";
  className?: string;
}) {
  return (
    <div
      className={`craft-filters craft-filters--${variant} ${className}`.trim()}
      role="group"
      aria-label="Filter by craft tag"
    >
      {tags.map((tag) => (
        <CraftFilterToggle
          key={tag}
          tag={tag}
          active={activeTags.has(tag)}
          onToggle={() => onToggle(tag)}
          variant={variant}
        />
      ))}
    </div>
  );
}

function VignetteCard({ entry }: { entry: VignetteWithStudy }) {
  const { vignette, caseStudy } = entry;
  const indexLabel = vignetteIndexLabel(vignette.slug);

  return (
    <Link href={`/craft/${vignette.slug}`} className="craft-card">
      <p className="craft-ghost-index" aria-hidden>
        {indexLabel}
      </p>
      <VignetteKeyImage vignette={vignette} className="craft-portrait" />
      <div className="craft-card-copy">
        <h2 className="craft-card-title">{vignette.name}</h2>
        <p className="text-meta mt-2">{caseStudy.client}</p>
      </div>
    </Link>
  );
}

export function CraftIndex() {
  const allVignettes = useMemo(() => getAllVignettes(), []);
  const allTags = useMemo(() => allCraftTags(), []);

  const [activeTags, setActiveTags] = useState<Set<string>>(
    () => new Set(allTags),
  );
  const [compactHeader, setCompactHeader] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="craft-page">
      <header className="craft-hero-header keyline-b">
        <RuledGrid className="py-12">
          <SiteGridSubgrid className="lg:items-end">
            <h1 className="display-xl grid-span-6 lg:grid-span-5">Craft</h1>
            <div className="col-1-to-end lg:col-6-to-end">
              <p className="craft-hero-meta">
                {visibleVignettes.length} VIGNETTES · {allTags.length} TAGS ·
                2023–2025
              </p>
              <CraftFilters
                variant="hero"
                tags={allTags}
                activeTags={activeTags}
                onToggle={toggleTag}
                className="mt-6"
              />
            </div>
          </SiteGridSubgrid>
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
            <p className="display-lg craft-page-title">Craft</p>
          </div>
          <CraftFilters
            variant="compact"
            tags={allTags}
            activeTags={activeTags}
            onToggle={toggleTag}
          />
        </div>
      </header>

      {visibleVignettes.length === 0 ? (
        <p className="craft-empty text-secondary">
          Turn on at least one craft tag to show vignettes.
        </p>
      ) : (
        <CraftMasonry>
          {visibleVignettes.map((entry) => (
            <VignetteCard key={entry.vignette.slug} entry={entry} />
          ))}
        </CraftMasonry>
      )}
    </div>
  );
}
