import type { Metadata } from "next";
import { CaseStudyCoverStack } from "@/components/case-studies/case-study-cover-stack";
import { CaseStudiesIndexIntro } from "@/components/case-studies/case-studies-index-intro";
import { CaseStudiesScroll } from "@/components/case-studies/case-studies-scroll";
import { visibleCaseStudies } from "@/content/portfolio";
import { isUnlocked } from "@/lib/gate";
import { clientBrandChromeSurface } from "@/lib/client-brand-colors";

export const metadata: Metadata = {
  title: "Case Studies",
};

export default async function CaseStudiesPage() {
  const studies = visibleCaseStudies(await isUnlocked());
  const steps = [
    { id: "cs-index-intro", surface: "dark" as const },
    ...studies.map((study) => ({
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
        <CaseStudyCoverStack studies={studies} />
      </CaseStudiesScroll>
    </div>
  );
}
