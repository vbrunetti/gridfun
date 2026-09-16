import type { CraftVignette } from "@/content/portfolio";
import type { CaseStudyDetailStep } from "@/components/case-studies/case-study-detail-scroll-context";
import { vignetteSectionId } from "@/lib/case-study-detail-steps";

/** Ordered detail-deck steps: hero · vignette filmstrip · footer. Rail dots are vignettes only. */
export function buildCraftDetailSteps(vignette: CraftVignette): CaseStudyDetailStep[] {
  return [
    { id: "craft-hero", kind: "hero", label: vignette.name, panelCount: 1 },
    {
      id: vignetteSectionId(vignette.slug),
      kind: "vignette",
      label: vignette.name,
      vignetteSlug: vignette.slug,
      // Standalone craft detail hides the title panel, so one stop per image.
      panelCount: vignette.images.length,
    },
    { id: "craft-footer", kind: "footer", label: "Next vignette", panelCount: 1 },
  ];
}
