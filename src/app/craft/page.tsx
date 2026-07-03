import type { Metadata } from "next";
import { CraftIndex } from "@/components/craft/craft-index";
import { visibleCraftTags, visibleVignettes } from "@/content/portfolio";
import { isUnlocked } from "@/lib/gate";

export const metadata: Metadata = {
  title: "Craft",
};

type PageProps = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function CraftPage({ searchParams }: PageProps) {
  const { tag } = await searchParams;
  const unlocked = await isUnlocked();

  return (
    <div
      className="craft-route theme-light min-h-[100dvh] w-full min-w-0"
      data-chrome-surface="light"
    >
      <CraftIndex
        vignettes={visibleVignettes(unlocked)}
        tags={visibleCraftTags(unlocked)}
        initialTag={tag}
      />
    </div>
  );
}
