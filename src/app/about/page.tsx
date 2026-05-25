import type { Metadata } from "next";
import { RuledGrid } from "@/components/layout/ruled-grid";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="theme-white min-h-[100dvh]">
      <RuledGrid className="py-[var(--grid-row-gap)]">
        <div className="col-span-hero">
          <p className="text-meta">About</p>
          <h1 className="display-xl mt-4">White section — high contrast.</h1>
        </div>
        <div className="col-span-narrow">
          <p className="mt-8 leading-relaxed text-secondary">
            Placeholder bio. This page uses the white surface and generous
            whitespace — content comes later.
          </p>
        </div>
        <div className="col-span-content mt-24 min-h-[40vh]" aria-hidden />
      </RuledGrid>
    </div>
  );
}
