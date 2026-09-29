import type { Metadata } from "next";
import { CaseStudiesIndexDeck } from "@/components/case-studies/case-studies-index-deck";
import { visibleCaseStudies } from "@/content/portfolio";
import { caseStudyIndexStrip } from "@/content/index-strips";
import { isUnlocked } from "@/lib/gate";

export const metadata: Metadata = {
  title: "Case Studies",
};

export default async function CaseStudiesPage() {
  const studies = visibleCaseStudies(await isUnlocked());
  return <CaseStudiesIndexDeck strips={studies.map(caseStudyIndexStrip)} />;
}
