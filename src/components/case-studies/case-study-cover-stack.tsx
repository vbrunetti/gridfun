import Link from "next/link";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { ClientLogo } from "@/components/craft/vignette-media";
import { caseStudies, caseStudyTags } from "@/content/portfolio";

const panelThemes = [
  {
    section: "theme-dark keyline-b keyline-b--dark",
    chromeSurface: "dark" as const,
  },
  {
    section: "theme-light keyline-b",
    chromeSurface: "light" as const,
  },
  {
    section: "theme-canvas keyline-b keyline-b--canvas",
    chromeSurface: "canvas" as const,
  },
] as const;

export function CaseStudyCoverStack() {
  return (
    <div className="sticky-cover-stack" aria-label="Case studies">
      {caseStudies.map((study, index) => {
        const theme = panelThemes[index % panelThemes.length];
        const tags = caseStudyTags(study);

        return (
          <section
            key={study.slug}
            data-cs-step="panel"
            className={`work-snap-section sticky-cover-panel flex min-h-0 items-center ${theme.section}`}
            data-chrome-surface={theme.chromeSurface}
          >
            <RuledGrid className="w-full py-16">
              <div className="col-full cs-cover">
                <div className="cs-cover__head">
                  <p className="text-meta">
                    Case study {String(index + 1).padStart(2, "0")} · {study.date}
                  </p>
                  <h2 className="display-lg mt-4">
                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="transition-opacity hover:opacity-70"
                    >
                      {study.name}
                    </Link>
                  </h2>
                </div>

                <dl className="cs-cover__meta">
                  <div className="cs-cover__meta-row">
                    <dt className="text-meta">Client</dt>
                    <dd className="cs-cover__client">
                      <ClientLogo
                        client={study.client}
                        logoSrc={study.clientLogo}
                      />
                      <span className="cs-cover__client-name">{study.client}</span>
                    </dd>
                  </div>

                  {tags.length > 0 ? (
                    <div className="cs-cover__meta-row">
                      <dt className="text-meta">Craft</dt>
                      <dd>
                        <ul className="craft-tag-list">
                          {tags.map((tag) => (
                            <li key={tag} className="craft-tag-pill">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ) : null}
                </dl>

                <Link
                  href={`/case-studies/${study.slug}`}
                  className="text-meta cs-cover__link border-b border-current pb-0.5 transition-opacity hover:opacity-70"
                >
                  View case study →
                </Link>
              </div>
            </RuledGrid>
          </section>
        );
      })}
    </div>
  );
}
