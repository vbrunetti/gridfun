import { RuledGrid } from "@/components/layout/ruled-grid";
import { CaseStudyDetailScroll } from "@/components/case-studies/case-study-detail-scroll";
import type { CaseStudyDetailStep } from "@/components/case-studies/case-study-detail-scroll-context";
import { VignetteChapter } from "@/components/craft/vignette-chapter";
import type { CraftVignette } from "@/content/portfolio";
import { vignetteSectionId } from "@/lib/case-study-detail-steps";

const INTRO_ID = "cs-index-intro";

/**
 * The /case-studies index: an intro band, then one horizontal filmstrip per case
 * study (see `caseStudyIndexStrip`), all on the shared detail deck — the same
 * scroll engine, dot menu, chrome recoloring, and rail tint the detail pages and
 * /layout-experiments use.
 */
export function CaseStudiesIndexDeck({ strips }: { strips: CraftVignette[] }) {
  const steps: CaseStudyDetailStep[] = [
    { id: INTRO_ID, kind: "hero", label: "Case Studies", panelCount: 1 },
    ...strips.map((strip) => ({
      id: vignetteSectionId(strip.slug),
      kind: "vignette" as const,
      label: strip.name,
      vignetteSlug: strip.slug,
      panelCount: strip.images.length + 1,
    })),
  ];

  return (
    <CaseStudyDetailScroll steps={steps}>
      <div className="theme-dark" data-chrome-surface="dark">
        <section
          id={INTRO_ID}
          data-cs-detail-row
          className="cs-focus-section cs-hero keyline-b is-focused"
          data-chrome-surface="dark"
        >
          <RuledGrid className="cs-hero__grid">
            <div className="cs-hero__main">
              <div className="cs-hero__title-block">
                <div className="cs-hero__title-copy">
                  <h1 className="cs-hero__title display-xl">Case Studies</h1>
                </div>
              </div>
            </div>
          </RuledGrid>
        </section>

        {strips.map((strip, i) => (
          <VignetteChapter
            key={strip.slug}
            vignette={strip}
            chapterNumber={i + 1}
            controlled
          />
        ))}
      </div>
    </CaseStudyDetailScroll>
  );
}
