import type { Metadata } from "next";
import { CaseStudyCoverStack } from "@/components/case-studies/case-study-cover-stack";
import { CaseStudiesIndexIntro } from "@/components/case-studies/case-studies-index-intro";
import { CaseStudiesScroll } from "@/components/case-studies/case-studies-scroll";
import { caseStudies } from "@/content/portfolio";
import { clientBrandChromeSurface } from "@/lib/client-brand-colors";

export const metadata: Metadata = {
  title: "Case Studies",
};

export default function CaseStudiesPage() {
  const steps = [
    { id: "cs-index-intro", surface: "dark" as const },
    ...caseStudies.map((study) => ({
      id: `cs-index-${study.slug}`,
      surface: clientBrandChromeSurface(study.brand.field),
    })),
  ];

  return (
    <div
      className="cs-index-route theme-dark min-h-[100dvh] w-full min-w-0"
      data-chrome-surface="dark"
    >
      <h1 className="cs-index-sr-title page-hero-label display-xl">Case Studies</h1>
      <CaseStudiesScroll steps={steps}>
        <CaseStudiesIndexIntro />
        <CaseStudyCoverStack />
      </CaseStudiesScroll>
    </div>
  );
}
