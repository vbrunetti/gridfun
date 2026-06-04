"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { CraftMasonry } from "@/components/craft/craft-masonry";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";
import {
  craftHeaderFilterSkills,
  craftSkillLabels,
  craftSkills,
  craftStoryIndexLabel,
  impactStories,
  storyMatchesActiveSkills,
  type CraftSkill,
  type ImpactStory,
} from "@/content/craft-impact";
import { palette } from "@/lib/colors";
import { craftPortraitRatioForId } from "@/lib/craft-portrait-ratio";

function CraftFilterToggle({
  skill,
  active,
  onToggle,
  variant = "compact",
}: {
  skill: CraftSkill;
  active: boolean;
  onToggle: () => void;
  variant?: "hero" | "compact";
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={`${craftSkillLabels[skill]} filter ${active ? "on" : "off"}`}
      onClick={onToggle}
      className={`craft-filter-chip craft-filter-chip--${variant} ${
        active ? "craft-filter-chip--on" : ""
      }`}
    >
      <span className="craft-filter-chip__dot" aria-hidden />
      {craftSkillLabels[skill]}
    </button>
  );
}

function CraftFilters({
  activeSkills,
  onToggle,
  skills,
  variant,
  className = "",
}: {
  activeSkills: Set<CraftSkill>;
  onToggle: (skill: CraftSkill) => void;
  skills: CraftSkill[];
  variant: "hero" | "compact";
  className?: string;
}) {
  return (
    <div
      className={`craft-filters craft-filters--${variant} ${className}`.trim()}
      role="group"
      aria-label="Filter by skill"
    >
      {skills.map((skill) => (
        <CraftFilterToggle
          key={skill}
          skill={skill}
          active={activeSkills.has(skill)}
          onToggle={() => onToggle(skill)}
          variant={variant}
        />
      ))}
    </div>
  );
}

function ImpactCard({ story }: { story: ImpactStory }) {
  const fill = palette[story.accent];
  const portraitH = craftPortraitRatioForId(story.id);
  const indexLabel = craftStoryIndexLabel(story.id);

  return (
    <article className="craft-card">
      <p className="craft-ghost-index" aria-hidden>
        {indexLabel}
      </p>
      <div
        className="craft-portrait"
        style={
          {
            backgroundColor: fill,
            aspectRatio: `9 / ${portraitH}`,
          } as CSSProperties
        }
        role="img"
        aria-label={`${story.title} — placeholder visual`}
      />
      <div className="craft-card-copy">
        <h2 className="craft-card-title">{story.title}</h2>
        <p className="text-meta mt-2">{story.date}</p>
      </div>
    </article>
  );
}

export function CraftIndex() {
  const [activeSkills, setActiveSkills] = useState<Set<CraftSkill>>(
    () => new Set(craftSkills),
  );
  const [compactHeader, setCompactHeader] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visibleStories = useMemo(
    () =>
      impactStories.filter((story) =>
        storyMatchesActiveSkills(story, activeSkills),
      ),
    [activeSkills],
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

  function toggleSkill(skill: CraftSkill) {
    setActiveSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) {
        next.delete(skill);
      } else {
        next.add(skill);
      }
      return next;
    });
  }

  return (
    <div className="craft-page">
      <header className="craft-hero-header border-b border-[var(--rule-strong)]">
        <RuledGrid className="py-12">
          <SiteGridSubgrid className="lg:items-end">
            <h1 className="display-xl grid-span-6 lg:grid-span-5">Craft.</h1>
            <div className="col-2-to-end lg:col-7-to-end">
              <p className="craft-hero-meta">
                {visibleStories.length} STORIES · {craftSkills.length} SKILLS ·
                2023–2025
              </p>
              <p className="mt-4 text-sm leading-relaxed text-secondary">
                Impact index — filter by skill to explore outcomes.
              </p>
              <CraftFilters
                variant="hero"
                skills={[...craftSkills]}
                activeSkills={activeSkills}
                onToggle={toggleSkill}
                className="mt-6"
              />
            </div>
          </SiteGridSubgrid>
        </RuledGrid>
      </header>

      <div ref={sentinelRef} className="craft-header-sentinel" aria-hidden />

      <header
        className={`craft-sticky-header ${
          compactHeader ? "craft-sticky-header--visible" : ""
        }`}
        aria-hidden={!compactHeader}
      >
        <div className="craft-sticky-header__inner">
          <div className="craft-sticky-header__title">
            <p className="display-lg craft-page-title">Craft.</p>
          </div>
          <CraftFilters
            variant="compact"
            skills={craftHeaderFilterSkills}
            activeSkills={activeSkills}
            onToggle={toggleSkill}
          />
        </div>
      </header>

      {visibleStories.length === 0 ? (
        <p className="craft-empty text-secondary">
          Turn on at least one skill filter to show impact stories.
        </p>
      ) : (
        <CraftMasonry>
          {visibleStories.map((story) => (
            <ImpactCard key={story.id} story={story} />
          ))}
        </CraftMasonry>
      )}
    </div>
  );
}
