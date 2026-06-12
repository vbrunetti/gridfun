import { RuledGrid } from "@/components/layout/ruled-grid";
import { HomeSecondaryArrowCta } from "@/components/sections/home-secondary-arrow-cta";
import { PrimaryHero } from "@/components/sections/primary-hero";
import { homeCoverSections } from "@/content/home-sections";
import { heroSlates } from "@/content/hero-slates";

export default function Home() {
  return (
    <div className="home-hero-cover-flow">
      <PrimaryHero
        slates={heroSlates}
        scrollRelease={false}
        coverSections={homeCoverSections}
      />
      <section
        id="home-secondary"
        className="chrome-focus-target theme-dark home-secondary-panel keyline-b keyline-b--dark keyline-b--viewport"
        data-chrome-surface="dark"
      >
        <RuledGrid className="home-secondary-stage w-full">
          <div className="home-secondary-copy">
            <div className="home-beat">
              <p className="home-beat__eyebrow text-meta">Home secondary</p>
              <h2 className="display-xl home-beat__headline">
                Scrolls over the hero — hero stays pinned underneath.
              </h2>
              <p className="home-beat__subhead">
                DES-style cover transition. Placeholder for the next band of
                content.
              </p>
            </div>
          </div>
          <div className="home-secondary-cta">
            <HomeSecondaryArrowCta />
          </div>
        </RuledGrid>
      </section>
    </div>
  );
}
