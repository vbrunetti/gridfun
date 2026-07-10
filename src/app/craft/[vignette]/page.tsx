import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyDetailScroll } from "@/components/case-studies/case-study-detail-scroll";
import { DetailNavFooter } from "@/components/case-studies/detail-nav-footer";
import { CraftTagList } from "@/components/craft/vignette-media";
import { VignetteChapter } from "@/components/craft/vignette-chapter";
import { VignetteTitleBackdrop } from "@/components/craft/vignette-title-backdrop";
import { RuledGrid } from "@/components/layout/ruled-grid";
import {
  getVignette,
  visibleVignettes,
} from "@/content/portfolio";
import { isUnlocked } from "@/lib/gate";
import { buildCraftDetailSteps } from "@/lib/craft-detail-steps";
import { vignetteTitleColor } from "@/lib/vignette-title";

type PageProps = {
  params: Promise<{ vignette: string }>;
};

export function generateStaticParams() {
  // Gated vignettes are omitted from prerender; they render dynamically and
  // 404 for locked visitors (see the cookie check below).
  return visibleVignettes(false).map(({ vignette }) => ({
    vignette: vignette.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { vignette: slug } = await params;
  const found = getVignette(slug);
  if (!found || (found.caseStudy.gated && !(await isUnlocked()))) {
    return { title: "Vignette" };
  }
  return { title: found.vignette.name };
}

export default async function VignettePage({ params }: PageProps) {
  const { vignette: slug } = await params;
  const found = getVignette(slug);
  const unlocked = await isUnlocked();

  if (!found || (found.caseStudy.gated && !unlocked)) {
    notFound();
  }

  const { vignette, caseStudy } = found;
  const allVignettes = visibleVignettes(unlocked);
  const index = allVignettes.findIndex(({ vignette: v }) => v.slug === slug);
  const previous = index > 0 ? allVignettes[index - 1] : undefined;
  const next = allVignettes[index + 1];
  const chapterNumber = index >= 0 ? index + 1 : 1;
  const detailSteps = buildCraftDetailSteps(vignette);
  const titleColor =
    vignette.titleTreatment === "color"
      ? vignetteTitleColor(vignette)
      : undefined;

  const heroFacts = [
    { key: "client", label: "Client", value: caseStudy.client },
    { key: "date", label: "Date", value: caseStudy.date },
    { key: "role", label: "Role", value: caseStudy.role },
    // Standalone containers (credential-style vignettes) don't get a real
    // case-study page, so skip the "Case study" fact rather than link to a 404.
    ...(caseStudy.standalone
      ? []
      : [
          {
            key: "study",
            label: "Case study",
            value: caseStudy.name,
            href: `/case-studies/${caseStudy.slug}`,
          },
        ]),
  ] as const;

  return (
    <CaseStudyDetailScroll steps={detailSteps} panelDots>
      <div className="theme-dark" data-chrome-surface="dark">
        <section
          id="craft-hero"
          data-cs-detail-row
          className={`cs-focus-section cs-hero keyline-b is-focused${
            vignette.titleTreatment ? ` cs-hero--title-${vignette.titleTreatment}` : ""
          }`}
          data-chrome-surface="dark"
          style={titleColor ? { background: titleColor } : undefined}
        >
          <VignetteTitleBackdrop
            vignette={vignette}
            coverClassName="cs-hero__cover"
            scrimClassName="cs-hero__scrim"
          />
          <RuledGrid className="cs-hero__grid">
            <div className="cs-hero__facts">
              {heroFacts.map((fact) => (
                <div
                  key={fact.key}
                  className={`cs-hero__fact cs-hero__fact--${fact.key}`}
                >
                  <p className="cs-hero__fact-kicker text-meta">{fact.label}</p>
                  {"href" in fact ? (
                    <p className="body-sm cs-hero__fact-value">
                      <Link
                        href={fact.href}
                        className="transition-opacity hover:opacity-70"
                      >
                        {fact.value}
                      </Link>
                    </p>
                  ) : (
                    <p className="body-sm cs-hero__fact-value">{fact.value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="cs-hero__main">
              <div className="cs-hero__title-block">
                <div className="cs-hero__title-copy">
                  <h1 className="cs-hero__title display-xl">{vignette.name}</h1>
                  <CraftTagList
                    tags={vignette.tags}
                    className="cs-hero__subhead"
                    variant="filter-link"
                  />
                </div>
              </div>
            </div>
          </RuledGrid>
        </section>

        <VignetteChapter
          vignette={vignette}
          chapterNumber={chapterNumber}
          showTitlePanel={false}
          controlled
        />

        <section
          id="craft-footer"
          data-cs-detail-row
          className="cs-focus-section theme-canvas py-12"
          data-chrome-surface="canvas"
        >
          <RuledGrid>
            <DetailNavFooter
              previous={
                previous
                  ? {
                      href: `/craft/${previous.vignette.slug}`,
                      label: previous.vignette.name,
                      kicker: "Previous vignette",
                    }
                  : undefined
              }
              next={
                next
                  ? {
                      href: `/craft/${next.vignette.slug}`,
                      label: next.vignette.name,
                      kicker: "Next vignette",
                    }
                  : undefined
              }
              fallback={{ href: "/craft", label: "All craft" }}
            />
          </RuledGrid>
        </section>
      </div>
    </CaseStudyDetailScroll>
  );
}
