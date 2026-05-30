import Link from "next/link";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { dummyProjects } from "@/lib/nav";

const panelThemes = [
  {
    section: "theme-dark border-[var(--section-dark-rule)]",
    chromeSurface: "dark" as const,
    placeholder: "border-[var(--section-dark-rule)] bg-[var(--color-flesh)]/10",
  },
  {
    section: "theme-light border-[var(--rule-strong)]",
    chromeSurface: "light" as const,
    placeholder: "border-[var(--rule-light)] bg-[var(--color-flesh)]/40",
  },
  {
    section: "theme-canvas border-[var(--color-paper)]/20",
    chromeSurface: "canvas" as const,
    placeholder: "border-[var(--color-paper)]/25 bg-[var(--color-paper)]/10",
  },
] as const;

export function ProjectCoverStack() {
  return (
    <div className="sticky-cover-stack" aria-label="Projects">
      {dummyProjects.map((project, index) => {
        const theme = panelThemes[index % panelThemes.length];

        return (
          <section
            key={project.slug}
            className={`work-snap-section sticky-cover-panel flex min-h-0 items-center border-b ${theme.section}`}
            data-chrome-surface={theme.chromeSurface}
          >
            <RuledGrid className="flex h-full min-h-0 w-full flex-col py-16">
              <div className="col-full shrink-0">
                <p className="text-meta">Project {project.index}</p>
                <h2 className="display-lg mt-4">
                  <Link
                    href={`/work/${project.slug}`}
                    className="transition-opacity hover:opacity-70"
                  >
                    {project.title}
                  </Link>
                </h2>
                <p className="text-meta mt-2">{project.subtitle}</p>
                <p className="mt-4 line-clamp-3 leading-relaxed text-secondary">
                  Placeholder cover panel — scroll locks this section until the
                  next project slides over it.
                </p>
                <Link
                  href={`/work/${project.slug}`}
                  className="text-meta mt-6 inline-block border-b border-current pb-0.5 transition-opacity hover:opacity-70"
                >
                  View case study →
                </Link>
              </div>
              <div
                className={`col-full mt-8 min-h-0 flex-1 border ${theme.placeholder}`}
                aria-hidden
              />
            </RuledGrid>
          </section>
        );
      })}
    </div>
  );
}
