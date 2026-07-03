import Link from "next/link";
import type { CSSProperties } from "react";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { CaseStudyBrandField } from "@/components/case-studies/case-study-brand-field";
import { CraftTagList } from "@/components/craft/vignette-media";
import { caseStudyTags, type CaseStudy } from "@/content/portfolio";
import {
  clientBrandChromeSurface,
  clientBrandColorVar,
  clientBrandTextOn,
} from "@/lib/client-brand-colors";

export function CaseStudyCoverStack({ studies }: { studies: CaseStudy[] }) {
  return (
    <div className="sticky-cover-stack" aria-label="Case studies">
      {studies.map((study, index) => {
        const tags = caseStudyTags(study);
        const textOn = clientBrandTextOn(study.brand.field);
        const chromeSurface = clientBrandChromeSurface(study.brand.field);

        return (
          <section
            key={study.slug}
            id={`cs-index-${study.slug}`}
            data-cs-step="panel"
            data-chrome-focus-step={index + 1}
            data-brand-text-on={textOn}
            className="chrome-focus-target work-snap-section sticky-cover-panel cs-index-panel theme-dark"
            data-chrome-surface={chromeSurface}
            style={
              {
                "--cs-brand-field": clientBrandColorVar(study.brand.field),
              } as CSSProperties
            }
          >
            <RuledGrid className="cs-index-panel__grid">
              <header className="cs-index-panel__meta">
                <p className="text-label-sm text-mono-label cs-index-panel__client">
                  {study.client}
                </p>
              </header>

              <div className="cs-index-panel__main">
                <div className="cs-index-panel__core">
                  <h2 className="cs-index-panel__title display-lg">
                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="transition-opacity hover:opacity-70"
                    >
                      {study.name}
                    </Link>
                  </h2>
                  <p className="body-lg cs-hero__subhead cs-index-panel__subhead text-secondary">
                    {study.subhead}
                  </p>
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="text-meta cs-index-panel__link border-b border-current pb-0.5 transition-opacity hover:opacity-70"
                  >
                    View case study →
                  </Link>
                </div>

                {tags.length > 0 ? (
                  <footer className="cs-index-panel__foot">
                    <CraftTagList
                      tags={tags}
                      className="cs-index-panel__tags"
                      variant="filter-link"
                    />
                  </footer>
                ) : null}
              </div>

              <CaseStudyBrandField
                brand={study.brand}
                clientLogo={study.clientLogo}
                className="cs-index-panel__field"
              />
            </RuledGrid>
          </section>
        );
      })}
    </div>
  );
}
