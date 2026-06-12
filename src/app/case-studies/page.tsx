import type { Metadata } from "next";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { CaseStudyCoverStack } from "@/components/case-studies/case-study-cover-stack";
import { CaseStudiesScroll } from "@/components/case-studies/case-studies-scroll";
import {
  caseStudies,
  caseStudiesDateRange,
  getAllVignettes,
} from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Case Studies",
};

export default function CaseStudiesPage() {
  const dateRange = caseStudiesDateRange();
  const vignetteCount = getAllVignettes().length;
  const studyCount = caseStudies.length;

  return (
    <div
      className="cs-index-route theme-light min-h-[100dvh] w-full min-w-0"
      data-chrome-surface="light"
    >
      <CaseStudiesScroll>
        <section
          id="cs-index-intro"
          data-cs-step="intro"
          data-chrome-focus-step="0"
          className="chrome-focus-target work-snap-section work-snap-section--intro cs-index-intro keyline-b"
          data-chrome-surface="light"
        >
          <header className="cs-index-hero-header">
            <RuledGrid className="cs-index-hero__grid">
              <div className="cs-index-hero__meta">
                <p className="text-meta craft-hero-meta cs-index-hero-meta--count">
                  {studyCount} CASE STUD{studyCount === 1 ? "Y" : "IES"}
                </p>
                <p className="text-meta craft-hero-meta cs-index-hero-meta--vignettes">
                  {vignetteCount} VIGNETTE{vignetteCount === 1 ? "" : "S"}
                </p>
                {dateRange ? (
                  <p className="text-meta craft-hero-meta cs-index-hero-meta--date">
                    {dateRange}
                  </p>
                ) : null}
              </div>
              <div className="cs-index-hero__main">
                <div className="cs-index-hero__main-grid">
                  <h1 className="cs-index-hero__title display-xl">Case Studies</h1>
                  <p className="cs-hero__subhead cs-index-hero__deck">
                    Long-form project stories — each one a stack of craft vignettes
                    on a single through-line.
                  </p>
                </div>
              </div>
            </RuledGrid>
          </header>
        </section>
        <CaseStudyCoverStack />
      </CaseStudiesScroll>
    </div>
  );
}
