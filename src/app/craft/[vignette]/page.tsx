import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyDetailScroll } from "@/components/case-studies/case-study-detail-scroll";
import { CtaButton } from "@/components/chrome/cta-button";
import { VignetteChapter } from "@/components/craft/vignette-chapter";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";
import {
  getAllVignettes,
  getVignette,
  vignetteIndexLabel,
} from "@/content/portfolio";
import { buildCraftDetailSteps } from "@/lib/craft-detail-steps";

type PageProps = {
  params: Promise<{ vignette: string }>;
};

export function generateStaticParams() {
  return getAllVignettes().map(({ vignette }) => ({ vignette: vignette.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { vignette: slug } = await params;
  const found = getVignette(slug);
  return { title: found?.vignette.name ?? "Vignette" };
}

export default async function VignettePage({ params }: PageProps) {
  const { vignette: slug } = await params;
  const found = getVignette(slug);

  if (!found) {
    notFound();
  }

  const { vignette, caseStudy } = found;
  const allVignettes = getAllVignettes();
  const index = allVignettes.findIndex(({ vignette: v }) => v.slug === slug);
  const next = allVignettes[index + 1];
  const chapterNumber = Number.parseInt(vignetteIndexLabel(slug), 10) || 1;
  const detailSteps = buildCraftDetailSteps(vignette);

  const heroFacts = [
    { key: "client", label: "Client", value: caseStudy.client },
    { key: "date", label: "Date", value: caseStudy.date },
    { key: "role", label: "Role", value: caseStudy.role },
    {
      key: "study",
      label: "Case study",
      value: caseStudy.name,
      href: `/case-studies/${caseStudy.slug}`,
    },
  ] as const;

  return (
    <CaseStudyDetailScroll steps={detailSteps}>
      <div className="theme-dark">
        <section
          id="craft-hero"
          data-cs-detail-row
          className="cs-focus-section cs-hero keyline-b is-focused"
          data-chrome-surface="dark"
        >
          <RuledGrid className="cs-hero__grid">
            <div className="cs-hero__facts">
              {heroFacts.map((fact) => (
                <div
                  key={fact.key}
                  className={`cs-hero__fact cs-hero__fact--${fact.key}`}
                >
                  <p className="cs-hero__fact-kicker text-meta">{fact.label}</p>
                  {"href" in fact ? (
                    <p className="body-sm cs-hero__fact-value">
                      <Link
                        href={fact.href}
                        className="transition-opacity hover:opacity-70"
                      >
                        {fact.value}
                      </Link>
                    </p>
                  ) : (
                    <p className="body-sm cs-hero__fact-value">{fact.value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="cs-hero__main">
              <div className="cs-hero__title-block">
                <div className="cs-hero__title-copy">
                  <h1 className="cs-hero__title display-xl">{vignette.name}</h1>
                  {vignette.themeLine ? (
                    <p className="body-lg cs-hero__subhead text-secondary">
                      {vignette.themeLine}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </RuledGrid>
        </section>

        <VignetteChapter
          vignette={vignette}
          chapterNumber={chapterNumber}
          date={caseStudy.date}
          showTitlePanel={false}
        />

        <section
          id="craft-footer"
          data-cs-detail-row
          className="cs-focus-section theme-canvas py-12"
          data-chrome-surface="canvas"
        >
          <RuledGrid>
            <SiteGridSubgrid className="items-center">
              {next ? (
                <>
                  <p className="text-meta grid-span-6 lg:col-start-2 lg:grid-span-4">
                    Next vignette
                  </p>
                  <Link
                    href={`/craft/${next.vignette.slug}`}
                    className="display-lg grid-span-6 transition-opacity hover:opacity-70 lg:grid-span-8 lg:text-right"
                  >
                    {next.vignette.name} →
                  </Link>
                </>
              ) : (
                <div className="col-span-content">
                  <CtaButton href="/craft" variant="ghost">
                    All craft
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
