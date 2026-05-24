import {
  SiteGrid,
  SiteGridCell,
  SiteGridSubgrid,
} from "@/components/layout/site-grid";
import { DEMO_COLUMN_COUNT } from "@/lib/grid";
import { GRID_COLUMNS } from "@/lib/site-location";
import { palette } from "@/lib/colors";

const swatches = Object.entries(palette) as [keyof typeof palette, string][];

export default function Home() {
  return (
    <div className="theme-light py-[var(--grid-row-gap)]">
      <SiteGrid>
        <SiteGridCell span="full">
          <p className="text-meta">Phase 1 · Chrome</p>
          <h1 className="display-xl mt-4 max-w-3xl">
            Logo left, menu right, rail on desktop.
          </h1>
          <p className="mt-6 max-w-lg leading-relaxed text-secondary">
            Master grid: {GRID_COLUMNS.mobile} columns on mobile,{" "}
            {GRID_COLUMNS.desktop} on desktop (max 1440px). Toggle{" "}
            <strong className="text-primary">Show grid</strong> in the menu to
            verify alignment.
          </p>
          <div className="mt-10 space-y-2 border-t border-[var(--rule-light)] pt-6">
            <p className="text-primary text-lg">Primary · ink 100%</p>
            <p className="text-secondary text-lg">Secondary · ink 80%</p>
            <p className="text-tertiary text-lg">Tertiary · ink 60%</p>
          </div>
        </SiteGridCell>

        <SiteGridCell span="full" className="mt-8">
          <p className="text-meta mb-4">Palette</p>
        </SiteGridCell>

        <SiteGridSubgrid>
          {swatches.map(([name, hex]) => (
            <div key={name} className="grid-span-2 text-center">
              <div
                className="swatch w-full"
                style={{ backgroundColor: hex }}
                title={hex}
              />
              <p className="text-meta mt-2 normal-case tracking-normal">
                {name.replace(/([A-Z])/g, " $1").trim()}
              </p>
            </div>
          ))}
        </SiteGridSubgrid>

        <SiteGridCell span="full" className="mt-12">
          <p className="text-meta mb-2">
            Master grid · {GRID_COLUMNS.mobile} col mobile /{" "}
            {GRID_COLUMNS.desktop} col desktop
          </p>
        </SiteGridCell>

        <SiteGridSubgrid>
          {Array.from({ length: DEMO_COLUMN_COUNT }).map((_, i) => (
            <div
              key={i}
              className={`grid-span-1 aspect-[2/3] border border-[var(--rule-light)] bg-[var(--color-flesh)]/50 text-center text-[0.5rem] leading-[2rem] text-tertiary ${
                i >= GRID_COLUMNS.mobile ? "demo-col-hidden-mobile" : ""
              }`}
            >
              {i + 1}
            </div>
          ))}
        </SiteGridSubgrid>
      </SiteGrid>
    </div>
  );
}
