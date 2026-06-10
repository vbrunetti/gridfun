import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";
import {
  CraftTagList,
  VignetteImageScroll,
  VignetteKeyImage,
} from "@/components/craft/vignette-media";
import {
  getAllVignettes,
  getVignette,
  isVignette,
} from "@/content/portfolio";

type PageProps = {
  params: Promise<{ vignette: string }>;
};

export function generateStaticParams() {
  return getAllVignettes().map(({ vignette }) => ({ vignette: vignette.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { vignette: slug } = await params;
  const found = getVignette(slug);
  return { title: found?.vignette.name ?? "Vignette" };
}

export default async function VignettePage({ params }: PageProps) {
  const { vignette: slug } = await params;
  const found = getVignette(slug);

  if (!found) {
    notFound();
  }

  const { vignette, caseStudy } = found;
  const siblings = caseStudy.sections.filter(isVignette);

  return (
    <article
      className="vignette-detail theme-light"
      data-chrome-surface="light"
    >
      <section className="keyline-b">
        <RuledGrid className="py-[var(--grid-row-gap)]">
          <div className="col-span-content">
            <p className="text-meta">
              <Link
                href={`/case-studies/${caseStudy.slug}`}
                className="transition-opacity hover:opacity-70"
              >
                {caseStudy.client} · {caseStudy.name}
              </Link>
            </p>
            <h1 className="display-xl mt-4">{vignette.name}</h1>
            <CraftTagList tags={vignette.tags} className="mt-5" />
          </div>
          <div className="col-span-narrow vignette-detail__key">
            <VignetteKeyImage vignette={vignette} priority />
          </div>
        </RuledGrid>
      </section>

      <section className="cs-section cs-section--vignette keyline-b">
        <VignetteImageScroll vignette={vignette} />
      </section>

      <section className="theme-canvas py-12" data-chrome-surface="light">
        <RuledGrid>
          <SiteGridSubgrid className="items-start gap-y-8">
            <div className="grid-span-6 lg:grid-span-5">
              <p className="text-meta">From the case study</p>
              <Link
                href={`/case-studies/${caseStudy.slug}`}
                className="display-md mt-3 inline-block transition-opacity hover:opacity-70"
              >
                {caseStudy.name} →
              </Link>
              <p className="text-meta mt-3">
                {caseStudy.client} · {caseStudy.date}
              </p>
            </div>

            {siblings.length > 1 ? (
              <div className="grid-span-6 lg:col-start-7 lg:grid-span-6">
                <p className="text-meta">More from this case study</p>
                <ul className="vignette-sibling-list mt-3">
                  {siblings
                    .filter((sibling) => sibling.slug !== vignette.slug)
                    .map((sibling) => (
                      <li key={sibling.slug}>
                        <Link
                          href={`/craft/${sibling.slug}`}
                          className="vignette-sibling-link transition-opacity hover:opacity-70"
                        >
                          {sibling.name} →
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}
          </SiteGridSubgrid>
        </RuledGrid>
      </section>
    </article>
  );
}
