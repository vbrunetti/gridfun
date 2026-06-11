import { isVignette, type CaseStudy } from "@/content/portfolio";
import type { CaseStudyDetailStep } from "@/components/case-studies/case-study-detail-scroll-context";

/** Ordered right-rail dots: hero · sections · footer. */
export function buildCaseStudyDetailSteps(study: CaseStudy): CaseStudyDetailStep[] {
  const steps: CaseStudyDetailStep[] = [
    { id: "cs-hero", kind: "hero", label: study.name },
  ];

  for (const section of study.sections) {
    if (isVignette(section)) {
      steps.push({
        id: `vignette-${section.slug}`,
        kind: "vignette",
        label: section.name,
        vignetteSlug: section.slug,
      });
    } else {
      steps.push({
        id: `cs-prose-${section.id}`,
        kind: "prose",
        label: section.heading ?? "Prose",
      });
    }
  }

  steps.push({ id: "cs-footer", kind: "footer", label: "Next case study" });
  return steps;
}
