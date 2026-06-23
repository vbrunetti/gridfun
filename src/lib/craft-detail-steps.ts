import type { CraftVignette } from "@/content/portfolio";
import type { CaseStudyDetailStep } from "@/components/case-studies/case-study-detail-scroll-context";

/** Ordered right-rail dots: hero · vignette filmstrip · footer. */
export function buildCraftDetailSteps(vignette: CraftVignette): CaseStudyDetailStep[] {
  return [
    { id: "craft-hero", kind: "hero", label: vignette.name, panelCount: 1 },
    {
      id: `vignette-${vignette.slug}`,
      kind: "vignette",
      label: vignette.name,
      vignetteSlug: vignette.slug,
      // Standalone craft detail hides the title panel, so one stop per image.
      panelCount: vignette.images.length,
    },
    { id: "craft-footer", kind: "footer", label: "Next vignette", panelCount: 1 },
  ];
}
