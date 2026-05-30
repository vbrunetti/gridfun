import { RuledGrid } from "@/components/layout/ruled-grid";
import { PrimaryHero } from "@/components/sections/primary-hero";
import { heroSlates } from "@/content/hero-slates";

export default function Home() {
  return (
    <div className="home-hero-cover-flow">
      <PrimaryHero slates={heroSlates} scrollRelease={false} secondaryCover />
      <section
        className="theme-dark home-secondary-panel flex items-center border-b border-[var(--section-dark-rule)]"
        data-chrome-surface="dark"
      >
        <RuledGrid className="w-full py-16">
          <div className="col-span-content">
            <p className="text-meta">Home secondary</p>
            <h2 className="display-lg mt-4 max-w-2xl">
              Scrolls over the hero — hero stays pinned underneath.
            </h2>
            <p className="mt-4 max-w-lg text-secondary">
              DES-style cover transition. Placeholder for the next band of
              content.
            </p>
          </div>
        </RuledGrid>
      </section>
    </div>
  );
}
