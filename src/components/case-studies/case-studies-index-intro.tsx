import { RuledGrid } from "@/components/layout/ruled-grid";

/**
 * Desktop-only title band. Rendered server-side and on every client paint so it
 * is present in the initial HTML; CSS hides it on mobile. (Gating its existence
 * behind a JS media-query state inserted it *above* the viewport after
 * hydration, which scroll-anchoring then compensated for by scrolling past it.)
 */
export function CaseStudiesIndexIntro() {
  return (
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
  );
}
