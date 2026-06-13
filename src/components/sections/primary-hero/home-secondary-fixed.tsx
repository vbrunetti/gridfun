import { RuledGrid } from "@/components/layout/ruled-grid";
import { HomeSecondaryArrowCta } from "@/components/sections/home-secondary-arrow-cta";
import { HeroSlateCopy } from "./hero-chapter-copy";

type HomeSecondaryFixedProps = {
  eyebrow: string;
  headline: string;
  subhead: string;
  label?: string;
};

/** Fixed secondary panel — peeks during hero chapters, full viewport when settled. */
export function HomeSecondaryFixed({
  eyebrow,
  headline,
  subhead,
  label = "Selected work",
}: HomeSecondaryFixedProps) {
  return (
    <section
      id="home-secondary"
      className="home-secondary-panel chrome-focus-target theme-dark keyline-b keyline-b--dark keyline-b--viewport"
      data-chrome-surface="dark"
      aria-label={label}
    >
      <RuledGrid className="home-secondary-stage w-full h-full">
        <div className="home-secondary-copy">
          <HeroSlateCopy
            slate={{
              id: "home-secondary",
              eyebrow,
              headline,
              supporting: subhead,
            }}
          />
        </div>
        <div className="home-secondary-cta">
          <HomeSecondaryArrowCta />
        </div>
      </RuledGrid>
    </section>
  );
}
