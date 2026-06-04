import type { Metadata } from "next";
import { CraftIndex } from "@/components/craft/craft-index";

export const metadata: Metadata = {
  title: "Craft",
};

export default function CraftPage() {
  return (
    <div
      className="craft-route theme-light min-h-[100dvh] w-full min-w-0 overflow-x-clip"
      data-chrome-surface="light"
    >
      <CraftIndex />
    </div>
  );
}
