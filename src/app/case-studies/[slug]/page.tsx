import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaButton } from "@/components/chrome/cta-button";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";
import {
  ClientLogo,
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

  return (
    <article className="cs-detail">
      <section className="theme-light keyline-b" data-chrome-surface="light">
        <RuledGrid className="py-[var(--grid-row-gap)]">
          <div className="col-span-content">
            <p className="text-meta">
              Case study {String(index + 1).padStart(2, "0")} · {study.date}
            </p>
            <h1 className="display-xl mt-4">{study.name}</h1>
            <div className="cs-detail__client mt-4">
              <ClientLogo client={study.client} logoSrc={study.clientLogo} />
              <span className="text-meta">{study.client}</span>
            </div>
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
              <RuledGrid className="py-[var(--grid-row-gap)]">
                <div className="col-span-content cs-vignette-head">
                  <p className="text-meta">Vignette</p>
                  <h2 className="display-lg mt-3">
                    <Link
                      href={`/craft/${section.slug}`}
                      className="transition-opacity hover:opacity-70"
                    >
                      {section.name}
                    </Link>
                  </h2>
                  <CraftTagList tags={section.tags} className="mt-4" />
                </div>
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
            <RuledGrid className="py-[var(--grid-row-gap)]">
              <div className="col-span-content cs-prose">
                {section.heading ? (
                  <h2 className="display-md cs-prose__heading">
                    {section.heading}
                  </h2>
                ) : null}
                {section.body.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="cs-prose__body">
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
        data-chrome-surface="canvas"
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
