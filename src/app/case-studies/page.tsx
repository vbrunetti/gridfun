import type { Metadata } from "next";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { CaseStudyCoverStack } from "@/components/case-studies/case-study-cover-stack";
import { CaseStudiesScroll } from "@/components/case-studies/case-studies-scroll";

export const metadata: Metadata = {
  title: "Case Studies",
};

export default function CaseStudiesPage() {
  return (
    <div
      className="cs-index-route theme-dark min-h-[100dvh] w-full min-w-0"
      data-chrome-surface="dark"
    >
      <CaseStudiesScroll>
        <section
          id="cs-index-intro"
          data-cs-step="intro"
          data-chrome-focus-step="0"
          className="chrome-focus-target work-snap-section work-snap-section--intro cs-index-intro theme-dark keyline-b keyline-b--dark"
          data-chrome-surface="dark"
        >
          <header className="cs-index-hero-header">
            <RuledGrid className="cs-index-hero__grid">
              <div className="cs-index-hero__meta" aria-hidden="true" />
              <div className="cs-index-hero__main">
                <div className="cs-index-hero__main-grid">
                  <h1 className="cs-index-hero__title display-xl">Case Studies</h1>
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
