import { RuledGrid } from "@/components/layout/ruled-grid";
import { CtaButton } from "@/components/chrome/cta-button";
import { HeroSlateCopy } from "./hero-chapter-copy";

type HomeSecondaryFixedProps = {
  eyebrow: string;
  headline: string;
  subhead: string;
  cta: {
    href: string;
    label: string;
  };
  label?: string;
};

/** Fixed secondary panel — peeks during hero chapters, full viewport when settled. */
export function HomeSecondaryFixed({
  eyebrow,
  headline,
  subhead,
  cta,
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
        <div className="home-secondary-copy col-1-to-end lg:grid-span-8">
          <HeroSlateCopy
            slate={{
              id: "home-secondary",
              eyebrow,
              headline,
              supporting: subhead,
            }}
            afterSubhead={
              <div className="home-secondary-cta">
                <CtaButton href={cta.href}>{cta.label}</CtaButton>
              </div>
            }
          />
        </div>
      </RuledGrid>
    </section>
  );
}
