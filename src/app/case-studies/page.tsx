import type { Metadata } from "next";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { CaseStudyCoverStack } from "@/components/case-studies/case-study-cover-stack";
import { CaseStudiesScroll } from "@/components/case-studies/case-studies-scroll";
import { caseStudiesDateRange } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Case Studies",
};

export default function CaseStudiesPage() {
  const dateRange = caseStudiesDateRange();

  return (
    <CaseStudiesScroll>
      <section
        data-cs-step="intro"
        className="work-snap-section work-snap-section--intro theme-light keyline-b flex items-end"
        data-chrome-surface="light"
      >
        <RuledGrid className="w-full pb-[var(--grid-row-gap)]">
          <div className="col-full">
            {dateRange ? <p className="text-meta">{dateRange}</p> : null}
            <h1 className={`display-xl ${dateRange ? "mt-4" : ""}`}>
              Case Studies
            </h1>
          </div>
        </RuledGrid>
      </section>
      <CaseStudyCoverStack />
    </CaseStudiesScroll>
  );
}
