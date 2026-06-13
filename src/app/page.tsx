import { PrimaryHero } from "@/components/sections/primary-hero";
import { heroSlates, homeCoverSections, site } from "@/content/site";

export default function Home() {
  const { secondary } = site.home;

  return (
    <PrimaryHero
      slates={heroSlates}
      coverSections={homeCoverSections}
      secondary={secondary}
    />
  );
}
