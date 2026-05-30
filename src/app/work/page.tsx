import type { Metadata } from "next";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { ProjectCoverStack } from "@/components/work/project-cover-stack";

export const metadata: Metadata = {
  title: "Work",
};

export default function WorkPage() {
  return (
    <article className="work-scroll-snap">
      <section
        className="work-snap-section theme-light flex items-center border-b border-[var(--rule-strong)]"
        data-chrome-surface="light"
      >
        <RuledGrid className="w-full py-[var(--grid-row-gap)]">
          <div className="col-full">
            <p className="text-meta">Work</p>
            <h1 className="display-xl mt-4">Project index</h1>
            <p className="mt-4 text-secondary">
              Six dummy projects — each panel sticks, then the next covers it.
            </p>
          </div>
        </RuledGrid>
      </section>
      <ProjectCoverStack />
    </article>
  );
}
