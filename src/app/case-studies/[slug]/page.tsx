import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaButton } from "@/components/chrome/cta-button";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";
import {
  CraftTagList,
  VignetteImageScroll,
} from "@/components/craft/vignette-media";
import { CaseStudyDetailScroll } from "@/components/case-studies/case-study-detail-scroll";
import { VignetteChapter } from "@/components/craft/vignette-chapter";
import {
  caseStudies,
  getCaseStudy,
  isVignette,
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

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  return { title: study?.name ?? "Case study" };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    notFound();
  }

  const index = caseStudies.findIndex((item) => item.slug === slug);
  const next = caseStudies[index + 1];

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
      <div className="theme-dark">
      <section
        id="cs-hero"
        data-cs-detail-row
        className="cs-hero keyline-b"
        data-chrome-surface="dark"
      >
        <RuledGrid className="cs-hero__grid">
          <div className="cs-hero__facts">
            {heroFacts.map(({ key, label, value }) => (
              <div key={key} className={`cs-hero__fact cs-hero__fact--${key}`}>
                <p className="cs-hero__fact-kicker text-meta">{label}</p>
                <p className="cs-hero__fact-value">{value}</p>
              </div>
            ))}
          </div>

          <div className="cs-hero__title-block">
            <h1 className="cs-hero__title display-xl">{study.name}</h1>
            <p className="cs-hero__subhead">{study.subhead}</p>
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
                date={study.date}
              />
            );
          }
          return (
            <section
              key={section.slug}
              id={`vignette-${section.slug}`}
              data-cs-detail-row
              className="cs-section cs-section--vignette keyline-b"
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
                <CraftTagList
                  tags={section.tags}
                  className="cs-vignette__tags"
                />
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
            className="cs-section cs-section--prose keyline-b"
            data-chrome-surface="dark"
          >
            <RuledGrid>
              {section.heading ? (
                <h2 className="cs-prose__heading display-lg">
                  {section.heading}
                </h2>
              ) : null}
              <div className="cs-prose__body">
                {section.body.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="cs-prose__paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            </RuledGrid>
          </section>
        );
      })}

      <section
        id="cs-footer"
        data-cs-detail-row
        className="theme-canvas py-12"
        data-chrome-surface="light"
      >
        <RuledGrid>
          <SiteGridSubgrid className="items-center">
            {next ? (
              <>
                <p className="text-meta grid-span-6 lg:col-start-2 lg:grid-span-4">
                  Next case study
                </p>
                <Link
                  href={`/case-studies/${next.slug}`}
                  className="display-lg grid-span-6 transition-opacity hover:opacity-70 lg:grid-span-8 lg:text-right"
                >
                  {next.name} →
                </Link>
              </>
            ) : (
              <div className="col-span-content">
                <CtaButton href="/case-studies" variant="ghost">
                  All case studies
                </CtaButton>
              </div>
            )}
          </SiteGridSubgrid>
        </RuledGrid>
      </section>
      </div>
    </CaseStudyDetailScroll>
  );
}
