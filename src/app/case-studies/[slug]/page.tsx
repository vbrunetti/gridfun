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
import {
  caseStudies,
  getCaseStudy,
  isVignette,
} from "@/content/portfolio";

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

  const heroFacts = [
    { key: "client", label: "Client", value: study.client },
    { key: "date", label: "Date", value: study.date },
    { key: "role", label: "Role", value: study.role },
    { key: "tools", label: "Tools", value: study.tools },
  ] as const;

  return (
    <article className="cs-detail">
      <section className="cs-hero theme-light keyline-b" data-chrome-surface="light">
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
          return (
            <section
              key={section.slug}
              className="cs-section cs-section--vignette keyline-b theme-light"
              data-chrome-surface="light"
              id={`vignette-${section.slug}`}
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
            className="cs-section cs-section--prose keyline-b"
            data-chrome-surface="light"
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
    </article>
  );
}
