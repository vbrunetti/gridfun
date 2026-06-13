import type { CraftVignette } from "@/content/portfolio";
import type { CaseStudyDetailStep } from "@/components/case-studies/case-study-detail-scroll-context";

/** Ordered right-rail dots: hero · vignette filmstrip · footer. */
export function buildCraftDetailSteps(vignette: CraftVignette): CaseStudyDetailStep[] {
  return [
    { id: "craft-hero", kind: "hero", label: vignette.name },
    {
      id: `vignette-${vignette.slug}`,
      kind: "vignette",
      label: vignette.name,
      vignetteSlug: vignette.slug,
    },
    { id: "craft-footer", kind: "footer", label: "Next vignette" },
  ];
}
