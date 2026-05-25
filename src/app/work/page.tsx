import type { Metadata } from "next";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { CardRail } from "@/components/work/card-rail";

export const metadata: Metadata = {
  title: "Work",
};

export default function WorkPage() {
  return (
    <div className="theme-canvas min-h-[100dvh]">
      <RuledGrid className="py-[var(--grid-row-gap)]">
        <div className="col-span-hero">
          <p className="text-meta">Work</p>
          <h1 className="display-xl mt-4">Project index</h1>
          <p className="mt-4 text-secondary">
            Scroll horizontally. Dummy cards — swap for case studies in a later
            phase.
          </p>
        </div>
      </RuledGrid>
      <CardRail />
    </div>
  );
}
