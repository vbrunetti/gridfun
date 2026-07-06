import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyDetail } from "@/components/case-studies/case-study-detail";
import {
  getCaseStudy,
  isGatedAway,
  visibleCaseStudies,
} from "@/content/portfolio";
import { isUnlocked } from "@/lib/gate";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  // Gated studies are omitted from prerender; they render dynamically and
  // 404 for locked visitors (see the cookie check below).
  return visibleCaseStudies(false).map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study || isGatedAway(study, await isUnlocked())) {
    return { title: "Case study" };
  }
  return { title: study.name };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  const unlocked = await isUnlocked();

  if (!study || isGatedAway(study, unlocked)) {
    notFound();
  }

  const studies = visibleCaseStudies(unlocked);
  const index = studies.findIndex((item) => item.slug === slug);
  const next = studies[index + 1];

  return (
    <CaseStudyDetail
      study={study}
      next={next ? { slug: next.slug, name: next.name } : undefined}
    />
  );
}
