import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaButton } from "@/components/chrome/cta-button";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";
import { dummyProjects } from "@/lib/nav";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return dummyProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = dummyProjects.find((item) => item.slug === slug);
  return { title: project?.title ?? "Project" };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = dummyProjects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const index = dummyProjects.findIndex((item) => item.slug === slug);
  const next = dummyProjects[index + 1];

  return (
    <article>
      <section
        className="theme-light border-b border-[var(--rule-strong)]"
        data-chrome-surface="light"
      >
        <RuledGrid className="py-[var(--grid-row-gap)]">
          <div className="col-span-hero">
            <p className="text-meta">
              Project {project.index} · Placeholder
            </p>
            <h1 className="display-xl mt-4">{project.title}</h1>
            <p className="text-meta mt-2">{project.subtitle}</p>
          </div>
          <div className="col-span-narrow">
            <p className="mt-6 leading-relaxed text-secondary">
              Case study shell. Vertical chapters will stick and cover here —
              media and MDX come in a later phase.
            </p>
            <div className="mt-8">
              <CtaButton href="/work" variant="ghost">
                All work
              </CtaButton>
            </div>
          </div>
        </RuledGrid>
      </section>

      <div className="sticky-cover-stack">
        {["Context", "Process", "Outcome"].map((chapter, chapterIndex) => (
          <section
            key={chapter}
            className={`sticky-cover-panel flex items-center border-b ${
              chapterIndex % 2 === 0
                ? "theme-dark border-[var(--section-dark-rule)]"
                : "theme-light border-[var(--rule-strong)]"
            }`}
            data-chrome-surface={chapterIndex % 2 === 0 ? "dark" : "light"}
          >
            <RuledGrid className="w-full py-20">
              <SiteGridSubgrid className="items-start">
                <div className="grid-span-6 lg:grid-span-5">
                  <p className="text-meta">Chapter 0{chapterIndex + 1}</p>
                  <h2 className="display-lg mt-4">{chapter}</h2>
                  <p className="mt-4 leading-relaxed text-secondary">
                    Lorem placeholder for {chapter.toLowerCase()} writeup. Safe
                    zone padding keeps type readable when cards or grids overlap.
                  </p>
                </div>
                <div
                  className="grid-span-6 aspect-[9/16] border border-[var(--rule-light)] bg-[var(--color-flesh)]/40 lg:col-start-7 lg:grid-span-6"
                  aria-hidden
                />
              </SiteGridSubgrid>
            </RuledGrid>
          </section>
        ))}
      </div>

      {next ? (
        <section
          className="theme-canvas border-t border-[var(--color-paper)]/20 py-12"
          data-chrome-surface="canvas"
        >
          <RuledGrid>
            <SiteGridSubgrid className="items-center">
              <p className="text-meta grid-span-6 lg:grid-span-4">Next project</p>
              <Link
                href={`/work/${next.slug}`}
                className="display-lg grid-span-6 transition-opacity hover:opacity-70 lg:grid-span-8 lg:text-right"
              >
                {next.title} →
              </Link>
            </SiteGridSubgrid>
          </RuledGrid>
        </section>
      ) : null}
    </article>
  );
}
