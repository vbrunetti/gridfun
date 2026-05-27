import Link from "next/link";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";
import { CardRail } from "@/components/work/card-rail";

export default function PlaygroundPage() {
  return (
    <>
      <section className="theme-light border-b border-[var(--rule-strong)]">
        <RuledGrid className="py-[var(--grid-row-gap)]">
          <div className="col-span-hero">
            <p className="text-meta">Playground · Phase 1 demos</p>
            <h1 className="display-xl mt-4">
              Scroll, grid-break, and sticky section experiments.
            </h1>
            <p className="mt-6 leading-relaxed text-secondary">
              Demos moved from the homepage while the Primary Hero ships on /.
              Hero effect prototypes are under{" "}
              <Link
                href="/effects"
                className="border-b border-current text-primary"
              >
                Effects
              </Link>
              .
            </p>
          </div>
        </RuledGrid>

        <div className="relative">
          <RuledGrid>
            <SiteGridSubgrid>
              <div className="grid-span-6 grid-break-over -mt-8 rounded-sm border border-[var(--rule-light)] bg-[var(--surface-light)] p-6 lg:col-start-7 lg:grid-span-6 lg:-mt-16">
                <p className="text-meta">Grid break</p>
                <p className="mt-2 text-sm leading-relaxed text-secondary">
                  This block overlaps the hero band — LVNG-style layer, not a flat
                  horizontal cut.
                </p>
              </div>
            </SiteGridSubgrid>
          </RuledGrid>
          <RuledGrid>
            <div
              className="col-full grid-break-under mt-4 h-48 border-x border-b border-[var(--rule-strong)] bg-[var(--surface-white)] md:h-64"
              style={{
                clipPath:
                  "polygon(0 40%, 33% 20%, 50% 35%, 66% 15%, 100% 30%, 100% 100%, 0 100%)",
              }}
              aria-hidden
            />
          </RuledGrid>
        </div>
      </section>

      <div className="sticky-cover-stack">
        <section className="theme-dark sticky-cover-panel flex items-center border-b border-[var(--section-dark-rule)]">
          <RuledGrid className="w-full py-16">
            <div className="col-span-hero">
              <p className="text-meta">Sticky · Cover</p>
              <h2 className="display-lg mt-4">
                This panel locks, then the next section covers it.
              </h2>
              <p className="mt-4 text-secondary">
                DES-style scroll behavior — placeholder for case study chapters.
              </p>
            </div>
          </RuledGrid>
        </section>

        <section className="theme-light sticky-cover-panel flex items-center border-b border-[var(--rule-strong)]">
          <RuledGrid className="w-full py-16">
            <div className="col-span-hero">
              <p className="text-meta">Reverse-out</p>
              <h2 className="display-lg mt-4">Light section follows dark.</h2>
              <p className="mt-4 text-secondary">
                Color and rules invert at the boundary — black rules on light,
                light rules on dark.
              </p>
            </div>
          </RuledGrid>
        </section>

        <section className="theme-canvas sticky-cover-panel">
          <RuledGrid className="w-full py-16">
            <SiteGridSubgrid className="items-end">
              <div className="grid-span-6 lg:grid-span-8">
                <p className="text-meta">Work preview</p>
                <h2 className="display-lg mt-4">Horizontal card rail</h2>
                <p className="mt-4 text-secondary">
                  9:16 cards — full-screen on mobile, gallery on desktop.
                </p>
              </div>
              <Link
                href="/work"
                className="text-meta grid-span-6 border-b border-current pb-0.5 text-secondary transition-opacity hover:opacity-70 lg:grid-span-4 lg:justify-self-end"
              >
                All projects →
              </Link>
            </SiteGridSubgrid>
          </RuledGrid>
          <CardRail />
        </section>
      </div>
    </>
  );
}
