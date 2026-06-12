import Link from "next/link";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";
import { CaseStudyBrandField } from "@/components/case-studies/case-study-brand-field";
import { CraftTagList } from "@/components/craft/vignette-media";
import {
  caseStudies,
  caseStudyTags,
  caseStudyVignettes,
} from "@/content/portfolio";

export function CaseStudyCoverStack() {
  return (
    <div className="sticky-cover-stack" aria-label="Case studies">
      {caseStudies.map((study, index) => {
        const tags = caseStudyTags(study);
        const vignetteCount = caseStudyVignettes(study).length;
        const indexLabel = String(index + 1).padStart(2, "0");

        return (
          <section
            key={study.slug}
            id={`cs-index-${study.slug}`}
            data-cs-step="panel"
            data-chrome-focus-step={index + 1}
            className="chrome-focus-target work-snap-section sticky-cover-panel cs-index-panel theme-light"
            data-chrome-surface="light"
          >
            <RuledGrid className="cs-index-panel__grid">
              <CaseStudyBrandField
                brand={study.brand}
                client={study.client}
                clientLogo={study.clientLogo}
                className="cs-index-panel__field"
              />

              <SiteGridSubgrid className="cs-index-panel__meta">
                <p className="text-meta craft-hero-meta cs-index-panel__meta-index">
                  {indexLabel}
                </p>
                <p className="text-meta craft-hero-meta cs-index-panel__meta-date">
                  {study.date}
                </p>
                <p className="text-meta craft-hero-meta cs-index-panel__meta-client">
                  {study.client}
                </p>
                <p className="text-meta craft-hero-meta cs-index-panel__meta-vignettes">
                  {vignetteCount} VIGNETTE{vignetteCount === 1 ? "" : "S"}
                </p>
              </SiteGridSubgrid>

              <div className="cs-index-panel__main">
                <div className="cs-index-panel__title-block">
                  <h2 className="cs-index-panel__title display-lg">
                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="transition-opacity hover:opacity-70"
                    >
                      {study.name}
                    </Link>
                  </h2>
                  <p className="cs-hero__subhead cs-index-panel__subhead">
                    {study.subhead}
                  </p>

                  {tags.length > 0 ? (
                    <CraftTagList tags={tags} className="cs-index-panel__tags" />
                  ) : null}

                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="text-meta cs-index-panel__link border-b border-current pb-0.5 transition-opacity hover:opacity-70"
                  >
                    View case study →
                  </Link>
                </div>
              </div>
            </RuledGrid>
          </section>
        );
      })}
    </div>
  );
}
