import { CtaButton } from "@/components/chrome/cta-button";
import { RuledGrid } from "@/components/layout/ruled-grid";
import {
  GridSpecTable,
  SiteGridCell,
  SiteGridSubgrid,
} from "@/components/layout/site-grid";
import { palette } from "@/lib/colors";
import { DEMO_COLUMN_COUNT } from "@/lib/grid";
import {
  brandColors,
  fonts,
  gridSpans,
  remSpacingRamp,
  semanticColors,
  spacingTokens,
  surfaces,
  themes,
  typographyRamp,
} from "@/lib/design-tokens";
import { GRID_COLUMNS } from "@/lib/site-location";

const paletteHex: Record<string, string> = {
  "--color-paper": palette.paper,
  "--color-white": palette.white,
  "--color-flesh": palette.flesh,
  "--color-ink": palette.ink,
  "--color-brown": palette.brown,
  "--color-orange": palette.orange,
  "--color-leaf-green": palette.leafGreen,
  "--color-crimson": palette.crimson,
  "--color-electric-blue": palette.electricBlue,
  "--color-flamingo-pink": palette.flamingoPink,
  "--color-golden-yellow": palette.goldenYellow,
};

const NAV = [
  ["#type", "Type"],
  ["#spacing", "Spacing"],
  ["#color", "Color"],
  ["#surfaces", "Surfaces"],
  ["#grid", "Grid"],
  ["#themes", "Themes"],
  ["#components", "Components"],
] as const;

function DsSectionHeader({
  id,
  meta,
  title,
  description,
}: {
  id: string;
  meta: string;
  title: string;
  description?: string;
}) {
  return (
    <SiteGridCell span="content" className="scroll-mt-24">
      <section
        id={id}
        className="border-t border-[var(--rule-light)] pt-[var(--grid-row-gap)]"
      >
        <p className="text-meta">{meta}</p>
        <h2 className="display-lg mt-3">{title}</h2>
        {description ? (
          <p className="mt-4 leading-relaxed text-secondary">{description}</p>
        ) : null}
      </section>
    </SiteGridCell>
  );
}

function TokenSwatch({
  token,
  label,
  hex,
}: {
  token: string;
  label: string;
  hex?: string;
}) {
  return (
    <div className="grid-span-2 min-w-0 text-center">
      <div
        className="h-8 w-full border border-[var(--rule-strong)]"
        style={{ backgroundColor: `var(${token})` }}
        title={hex ?? `var(${token})`}
      />
      <p className="text-meta mt-2 normal-case tracking-normal">{label}</p>
      {hex ? (
        <p className="font-mono text-[0.625rem] text-tertiary">{hex}</p>
      ) : null}
    </div>
  );
}

export function DesignSystemReference() {
  return (
    <RuledGrid>
      <SiteGridCell span="hero">
        <p className="text-meta">Design system</p>
        <h1 className="display-xl mt-4">Token reference &amp; ramps</h1>
        <p className="mt-6 leading-relaxed text-secondary">
          Living inventory of CSS custom properties, utility classes, and layout
          conventions. Source of truth:{" "}
          <code className="font-mono text-xs text-primary">src/app/globals.css</code>
          . Breakpoint for grid/desktop chrome:{" "}
          <strong className="text-primary">1024px (lg)</strong>.
        </p>
      </SiteGridCell>

      <SiteGridSubgrid>
        {NAV.map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="grid-span-2 text-sm text-secondary underline-offset-4 transition-opacity hover:opacity-70"
          >
            {label}
          </a>
        ))}
      </SiteGridSubgrid>

      <DsSectionHeader
        id="type"
        meta="01 · Typography"
        title="Type ramp"
        description="Display and meta styles are defined in globals.css. Body copy uses Geist Sans at default size (16px) unless overridden with Tailwind text-* utilities."
      />

      {typographyRamp.map((style) => (
        <SiteGridSubgrid key={style.className} className="border-b border-[var(--rule-light)] py-6">
          <div className="grid-span-6 min-w-0 lg:grid-span-8">
            <p className="text-meta normal-case tracking-normal">{style.label}</p>
            <p className={style.className.includes("rail") ? "mt-4 h-24" : "mt-3"}>
              <span className={style.className}>
                {style.label === "Rail label" ? "© 2026" : "The quick brown fox jumps."}
              </span>
            </p>
            <p className="text-meta mt-3 normal-case tracking-normal">Class</p>
            <p className="font-mono text-xs text-tertiary">
              .{style.className.split(" ")[0]}
            </p>
          </div>
          <div className="grid-span-3 min-w-0 lg:grid-span-2">
            <p className="text-meta normal-case tracking-normal">Size</p>
            <p className="mt-1 font-mono text-xs text-secondary">{style.size}</p>
          </div>
          <div className="grid-span-3 min-w-0 lg:grid-span-2">
            <p className="text-meta normal-case tracking-normal">Weight</p>
            <p className="mt-1 font-mono text-xs text-secondary">{style.weight}</p>
          </div>
          <div className="grid-span-3 min-w-0 lg:grid-span-2">
            <p className="text-meta normal-case tracking-normal">Line height</p>
            <p className="mt-1 font-mono text-xs text-secondary">{style.lineHeight}</p>
          </div>
          <div className="grid-span-3 min-w-0 lg:grid-span-2">
            <p className="text-meta normal-case tracking-normal">Tracking</p>
            <p className="mt-1 font-mono text-xs text-secondary">{style.letterSpacing}</p>
          </div>
        </SiteGridSubgrid>
      ))}

      <SiteGridCell span="content">
        <p className="text-meta">Text roles (light surface)</p>
      </SiteGridCell>
      <SiteGridSubgrid>
        <p className="grid-span-6 text-primary text-lg">Primary · ink 100%</p>
        <p className="grid-span-6 text-secondary text-lg">Secondary · ink 80%</p>
        <p className="grid-span-6 text-tertiary text-lg">Tertiary · ink 60%</p>
      </SiteGridSubgrid>

      <SiteGridCell span="content" className="theme-dark py-6">
        <p className="text-meta">Text roles (theme-dark)</p>
      </SiteGridCell>
      <SiteGridSubgrid className="theme-dark pb-6">
        <p className="grid-span-6 text-primary text-lg">Primary · paper 100%</p>
        <p className="grid-span-6 text-secondary text-lg">Secondary · paper 80%</p>
        <p className="grid-span-6 text-tertiary text-lg">Tertiary · paper 60%</p>
      </SiteGridSubgrid>

      <SiteGridCell span="content">
        <p className="text-meta">Font families</p>
      </SiteGridCell>
      <GridSpecTable
        headers={["CSS variable", "Usage"]}
        rows={fonts.map((f) => [f.token, f.usage])}
        columns={2}
      />

      <DsSectionHeader
        id="spacing"
        meta="02 · Spacing"
        title="Spacing ramp"
        description="Layout rhythm is driven by CSS variables on the master grid. Tailwind rem values are for in-cell composition only."
      />
      <SiteGridCell span="content">
        <p className="text-meta">Layout tokens</p>
      </SiteGridCell>
      <GridSpecTable
        headers={["Token", "Label", "Mobile", "Desktop (lg+)"]}
        rows={spacingTokens.map((t) => [t.token, t.label, t.mobile, t.desktop])}
      />
      <SiteGridCell span="content">
        <p className="text-meta">Visual · layout tokens</p>
      </SiteGridCell>
      {spacingTokens.slice(0, 5).map((t) => (
        <SiteGridSubgrid key={t.token}>
          <code className="grid-span-4 min-w-0 self-center font-mono text-xs text-tertiary">
            {t.token}
          </code>
          <div
            className="grid-span-2 h-4 self-center bg-[var(--color-orange)]"
            style={{ width: `var(${t.token})` }}
          />
        </SiteGridSubgrid>
      ))}
      <SiteGridCell span="content">
        <p className="text-meta">Tailwind rem scale</p>
      </SiteGridCell>
      <SiteGridSubgrid>
        {remSpacingRamp.map(({ rem, px }) => (
          <div
            key={rem}
            className="grid-span-2 flex min-w-0 items-center gap-2 border border-[var(--rule-light)] p-2"
          >
            <div
              className="shrink-0 bg-[var(--color-leaf-green)]"
              style={{ width: `${rem}rem`, height: `${rem}rem` }}
            />
            <div>
              <p className="font-mono text-xs text-primary">{rem}rem</p>
              <p className="font-mono text-xs text-tertiary">{px}px</p>
            </div>
          </div>
        ))}
      </SiteGridSubgrid>

      <DsSectionHeader
        id="color"
        meta="03 · Color"
        title="Brand & semantic color"
      />
      <SiteGridCell span="content">
        <p className="text-meta">Brand palette</p>
      </SiteGridCell>
      <SiteGridSubgrid>
        {brandColors.map(({ token, label }) => (
          <TokenSwatch
            key={token}
            token={token}
            label={label}
            hex={paletteHex[token]}
          />
        ))}
      </SiteGridSubgrid>
      <SiteGridCell span="content">
        <p className="text-meta">Semantic tokens</p>
      </SiteGridCell>
      <SiteGridSubgrid>
        {semanticColors.map(({ token, label }) => (
          <TokenSwatch key={token} token={token} label={label} />
        ))}
      </SiteGridSubgrid>

      <DsSectionHeader
        id="surfaces"
        meta="04 · Surfaces"
        title="Section surfaces"
        description="Page sections pick a theme class or surface token for background."
      />
      <SiteGridSubgrid>
        {surfaces.map(({ token, className, label }) => (
          <div
            key={token}
            className={`grid-span-6 min-h-[5rem] border border-[var(--rule-light)] p-4 ${className}`}
          >
            <p className="text-meta normal-case tracking-normal">{label}</p>
            <p className="mt-2 font-mono text-xs opacity-80">{token}</p>
            <p className="mt-1 text-sm">Sample text</p>
          </div>
        ))}
      </SiteGridSubgrid>

      <DsSectionHeader
        id="grid"
        meta="05 · Grid"
        title="Master build grid"
        description={`${GRID_COLUMNS.mobile} columns · 2px gutter · 1rem margin on mobile. ${GRID_COLUMNS.desktop} columns · 8px gutter · fluid margin · max 1440px centered on desktop.`}
      />
      <GridSpecTable
        headers={["Class", "Span / behavior"]}
        rows={gridSpans.map((s) => [s.className, String(s.columns)])}
        columns={2}
      />
      <SiteGridCell span="content">
        <p className="text-meta">
          Column demo · {GRID_COLUMNS.mobile} mobile / {GRID_COLUMNS.desktop} desktop
        </p>
      </SiteGridCell>
      <SiteGridSubgrid>
        {Array.from({ length: DEMO_COLUMN_COUNT }).map((_, i) => (
          <div
            key={i}
            className={`grid-span-1 h-9 min-w-0 items-center justify-center border border-[var(--rule-light)] bg-[var(--color-flesh)]/50 font-mono text-[0.5rem] text-tertiary flex ${
              i >= GRID_COLUMNS.mobile ? "hidden lg:flex" : ""
            }`}
          >
            {i + 1}
          </div>
        ))}
      </SiteGridSubgrid>
      <SiteGridCell span="content">
        <p className="text-meta">Rules</p>
      </SiteGridCell>
      <SiteGridSubgrid>
        <div className="grid-span-6 h-px bg-[var(--rule-light)]" />
        <p className="grid-span-6 text-xs text-tertiary">--rule-light</p>
        <div className="grid-span-6 h-px bg-[var(--rule-strong)]" />
        <p className="grid-span-6 text-xs text-tertiary">--rule-strong</p>
      </SiteGridSubgrid>

      <DsSectionHeader
        id="themes"
        meta="06 · Themes"
        title="Theme modifiers"
        description="Apply on a section wrapper to flip text tokens and background."
      />
      <SiteGridSubgrid>
        {themes.map(({ className, label, note }) => (
          <div
            key={className}
            className={`grid-span-6 min-h-[5rem] border border-[var(--rule-light)] p-4 ${className}`}
          >
            <p className="text-meta normal-case tracking-normal">{label}</p>
            <code className="mt-1 block font-mono text-xs opacity-80">.{className}</code>
            <p className="mt-2 text-sm">{note}</p>
            <p className="display-lg mt-4">Heading on {label.toLowerCase()}</p>
          </div>
        ))}
      </SiteGridSubgrid>

      <DsSectionHeader
        id="components"
        meta="07 · Components"
        title="Chrome & patterns"
      />
      <SiteGridCell span="content">
        <p className="text-meta">CTA button</p>
      </SiteGridCell>
      <SiteGridSubgrid className="items-center">
        <div className="grid-span-6 min-w-0">
          <CtaButton href="/contact">Primary CTA</CtaButton>
        </div>
        <div className="grid-span-6 min-w-0">
          <CtaButton href="/work" variant="ghost">
            Ghost link
          </CtaButton>
        </div>
      </SiteGridSubgrid>
      <SiteGridCell span="content">
        <p className="text-meta">Motion</p>
        <p className="mt-2 text-sm text-secondary">
          <code className="font-mono text-xs">prefers-reduced-motion: reduce</code>{" "}
          collapses animation site-wide.
        </p>
      </SiteGridCell>
      <SiteGridCell span="content">
        <p className="text-meta">Z-index stack (chrome)</p>
      </SiteGridCell>
      <GridSpecTable
        headers={["Layer", "Approx. z-index"]}
        rows={[
          ["Logo", "80"],
          ["Menu overlay", "70"],
          ["Skeleton / grid debug", "60"],
          ["Left rail", "50"],
          ["Grid location indicator", "30"],
        ]}
        columns={2}
      />

      <SiteGridCell span="content" className="pb-[var(--grid-row-gap)]">
        <p className="text-meta text-center">
          End of reference · toggle Show grid in menu to verify alignment
        </p>
      </SiteGridCell>
    </RuledGrid>
  );
}
