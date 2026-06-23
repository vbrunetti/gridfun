import {
  isVignette,
  type CaseStudy,
  type CraftVignette,
} from "@/content/portfolio";
import type { CaseStudyDetailStep } from "@/components/case-studies/case-study-detail-scroll-context";

/**
 * A vignette is a horizontal "chapter" (filmstrip) once it carries narrative
 * beats or a theme line — otherwise it renders as a single static grid row.
 * Keep this in sync with `isNarrativeVignette` in the detail page.
 */
function isNarrativeVignette(vignette: CraftVignette): boolean {
  return (
    Boolean(vignette.themeLine) ||
    vignette.images.some((frame) => frame.label || frame.body)
  );
}

/** Ordered right-rail dots: hero · sections · footer. */
export function buildCaseStudyDetailSteps(study: CaseStudy): CaseStudyDetailStep[] {
  const steps: CaseStudyDetailStep[] = [
    { id: "cs-hero", kind: "hero", label: study.name, panelCount: 1 },
  ];

  for (const section of study.sections) {
    if (isVignette(section)) {
      // Narrative filmstrips contribute one controlled-deck stop per panel
      // (title panel + one per image, matching VignetteChapter's showTitlePanel
      // default on the detail page). Static-grid vignettes are a single stop.
      const panelCount = isNarrativeVignette(section)
        ? section.images.length + 1
        : 1;
      steps.push({
        id: `vignette-${section.slug}`,
        kind: "vignette",
        label: section.name,
        vignetteSlug: section.slug,
        panelCount,
      });
    } else {
      steps.push({
        id: `cs-prose-${section.id}`,
        kind: "prose",
        label: section.heading ?? "Prose",
        panelCount: 1,
      });
    }
  }

  steps.push({ id: "cs-footer", kind: "footer", label: "Next case study", panelCount: 1 });
  return steps;
}
