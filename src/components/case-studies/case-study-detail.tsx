import Link from "next/link";
import { RuledGrid } from "@/components/layout/ruled-grid";
import {
  CraftTagList,
  VignetteImageScroll,
} from "@/components/craft/vignette-media";
import { CaseStudyDetailScroll } from "@/components/case-studies/case-study-detail-scroll";
import { DetailNavFooter } from "@/components/case-studies/detail-nav-footer";
import { CaseStudyHeroVideo } from "@/components/case-studies/case-study-hero-video";
import { VignetteChapter } from "@/components/craft/vignette-chapter";
import { ProseBlock } from "@/components/case-studies/prose-block";
import {
  isVignette,
  type CaseStudy,
  type CraftVignette,
} from "@/content/portfolio";
import { buildCaseStudyDetailSteps } from "@/lib/case-study-detail-steps";

/** A vignette is a "chapter" once it carries narrative beats or a theme line. */
function isNarrativeVignette(vignette: CraftVignette): boolean {
  return (
    Boolean(vignette.themeLine) ||
    vignette.images.some((frame) => frame.label || frame.body)
  );
}

export type CaseStudyDetailProps = {
  study: CaseStudy;
  /** Next case study for the footer's forward link; omit for a solo/synthetic deck. */
  next?: { slug: string; name: string };
  /** Footer fallback link when there's no `next`. */
  footerFallback?: { href: string; label: string };
};

/**
 * The scroll-driven case-study reader: hero masthead, an ordered mix of prose
 * blocks and vignette filmstrips, and a nav footer — all wrapped in the shared
 * detail deck. Rendered by `/case-studies/[slug]` and by the layout-experiments
 * harness (a synthetic study), so both exercise the exact same scroll engine.
 */
export function CaseStudyDetail({
  study,
  next,
  footerFallback = { href: "/case-studies", label: "All case studies" },
}: CaseStudyDetailProps) {
  const chapterNumbers = new Map<string, number>();
  let chapterCount = 0;
  for (const section of study.sections) {
    if (isVignette(section) && isNarrativeVignette(section)) {
      chapterCount += 1;
      chapterNumbers.set(section.slug, chapterCount);
    }
  }

  const heroFacts = [
    { key: "client", label: "Client", value: study.client },
    { key: "date", label: "Date", value: study.date },
    { key: "role", label: "Role", value: study.role },
    { key: "tools", label: "Tools", value: study.tools },
  ] as const;

  const detailSteps = buildCaseStudyDetailSteps(study);

  return (
    <CaseStudyDetailScroll steps={detailSteps}>
      <div className="theme-dark" data-chrome-surface="dark">
        <section
          id="cs-hero"
          data-cs-detail-row
          className="cs-focus-section cs-hero keyline-b is-focused"
          data-chrome-surface="dark"
        >
          {study.heroVideo ? <CaseStudyHeroVideo {...study.heroVideo} /> : null}
          <RuledGrid className="cs-hero__grid">
            <div className="cs-hero__facts">
              {heroFacts.map(({ key, label, value }) => (
                <div key={key} className={`cs-hero__fact cs-hero__fact--${key}`}>
                  <p className="cs-hero__fact-kicker text-meta">{label}</p>
                  <p className="body-sm cs-hero__fact-value">{value}</p>
                </div>
              ))}
            </div>

            <div className="cs-hero__main">
              <div className="cs-hero__title-block">
                <div className="cs-hero__title-copy">
                  <h1 className="cs-hero__title display-xl">{study.name}</h1>
                  <p className="body-lg cs-hero__subhead text-secondary">
                    {study.subhead}
                  </p>
                </div>
              </div>
            </div>
          </RuledGrid>
        </section>

        {study.sections.map((section) => {
          if (isVignette(section)) {
            if (isNarrativeVignette(section)) {
              return (
                <VignetteChapter
                  key={section.slug}
                  vignette={section}
                  chapterNumber={chapterNumbers.get(section.slug) ?? 1}
                  controlled
                />
              );
            }
            return (
              <section
                key={section.slug}
                id={`vignette-${section.slug}`}
                data-cs-detail-row
                className="cs-focus-section cs-section cs-section--vignette keyline-b"
                data-chrome-surface="dark"
              >
                <RuledGrid className="cs-vignette__grid">
                  <h2 className="cs-vignette__title display-lg">
                    <Link
                      href={`/craft/${section.slug}`}
                      className="transition-opacity hover:opacity-70"
                    >
                      {section.name}
                    </Link>
                  </h2>
                  <CraftTagList tags={section.tags} className="cs-vignette__tags" />
                  <VignetteImageScroll vignette={section} layout="grid" />
                </RuledGrid>
              </section>
            );
          }

          return (
            <section
              key={section.id}
              id={`cs-prose-${section.id}`}
              data-cs-detail-row
              className={`cs-focus-section cs-section cs-section--prose cs-section--prose-${section.variant ?? "lede"} keyline-b`}
              data-chrome-surface="dark"
            >
              <ProseBlock section={section} />
            </section>
          );
        })}

        <section
          id="cs-footer"
          data-cs-detail-row
          className="cs-focus-section theme-canvas py-12"
          data-chrome-surface="canvas"
        >
          <RuledGrid>
            <DetailNavFooter
              next={
                next
                  ? {
                      href: `/case-studies/${next.slug}`,
                      label: next.name,
                      kicker: "Next case study",
                    }
                  : undefined
              }
              fallback={footerFallback}
            />
          </RuledGrid>
        </section>
      </div>
    </CaseStudyDetailScroll>
  );
}
