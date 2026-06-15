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
  caseStudyDetailPatterns,
  caseStudyHeroFacts,
  caseStudyTypography,
  clientBrandColorGroups,
  fonts,
  gridSpans,
  ornamentalTypography,
  remSpacingRamp,
  semanticColors,
  spacingTokens,
  surfaceGroups,
  surfaces,
  themes,
  typographyRamp,
  typographyUsageMap,
  vignettePanelSurfaces,
  vignettePanelWidths,
  type TypographyRampEntry,
  type SurfaceSpec,
} from "@/lib/design-tokens";
import { GRID_COLUMNS } from "@/lib/site-location";

const paletteHex: Record<string, string> = {
  "--color-white": palette.white,
  "--color-off-white": palette.offWhite,
  "--color-light-gray": palette.lightGray,
  "--color-medium-gray": palette.mediumGray,
  "--color-charcoal": palette.charcoal,
  "--color-black": palette.black,
  "--color-neon-lime": palette.neonLime,
};

const NAV = [
  ["#type", "Type"],
  ["#spacing", "Spacing"],
  ["#color", "Color"],
  ["#surfaces", "Surfaces"],
  ["#grid", "Grid"],
  ["#themes", "Themes"],
  ["#case-study", "Case study"],
  ["#components", "Components"],
] as const;

const coreTypography = typographyRamp;

function SurfaceSpecimen({ surface }: { surface: SurfaceSpec }) {
  return (
    <div
      className={`grid-span-6 min-h-[8.5rem] border border-[var(--rule-light)] p-4 lg:grid-span-4 ${surface.className}`}
    >
      <p className="text-meta normal-case tracking-normal">{surface.label}</p>
      <code className="mt-1 block font-mono text-xs text-tertiary">
        .{surface.className}
      </code>
      <p className="mt-0.5 font-mono text-xs text-tertiary">{surface.token}</p>
      <p className="mt-3 text-sm text-primary">Primary · {surface.textOn} text</p>
      <p className="text-sm text-secondary">Secondary text</p>
      <p className="text-xs text-tertiary">Tertiary text</p>
    </div>
  );
}

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
    <SiteGridCell span="full" className="scroll-mt-24">
      <section
        id={id}
        className="keyline-t keyline-b--light pt-[var(--grid-row-gap)]"
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

function TypeSpecimenRow({
  style,
  surfaceClass = "",
}: {
  style: TypographyRampEntry;
  surfaceClass?: string;
}) {
  const sample =
    style.sample ??
    (style.label === "Rail label"
      ? "© 2026"
      : "The quick brown fox jumps over the lazy dog.");

  const specimen = <span className={style.className}>{sample}</span>;
  const isRail = style.className.includes("rail-label");
  const isFilterChip = style.className.includes("craft-filter-chip");

  return (
    <SiteGridSubgrid
      className={`keyline-b keyline-b--light py-6 ${surfaceClass}`.trim()}
    >
      <div className="grid-span-6 min-w-0 lg:grid-span-8">
        <p className="text-meta normal-case tracking-normal">{style.label}</p>
        {style.scope ? (
          <p className="text-meta mt-1 normal-case tracking-normal text-tertiary">
            {style.scope}
          </p>
        ) : null}
        <div className={isRail ? "mt-4 flex h-24 items-start" : "mt-3 min-w-0"}>
          {style.wrapperClass ? (
            <div className={`${style.wrapperClass} w-full max-w-[14rem]`}>
              {specimen}
            </div>
          ) : isFilterChip ? (
            <span className={style.className}>
              <span className="craft-filter-chip__dot" aria-hidden />
              {sample}
            </span>
          ) : (
            specimen
          )}
        </div>
        <p className="text-meta mt-3 normal-case tracking-normal">Class</p>
        <p className="font-mono text-xs text-tertiary">
          {style.className.split(/\s+/).map((c) => `.${c}`).join(" ")}
        </p>
        {style.fontFamily ? (
          <>
            <p className="text-meta mt-2 normal-case tracking-normal">Font</p>
            <p className="font-mono text-xs text-secondary">{style.fontFamily}</p>
          </>
        ) : null}
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
        <p className="mt-1 font-mono text-xs text-secondary">
          {style.letterSpacing}
        </p>
      </div>
    </SiteGridSubgrid>
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
      <SiteGridCell span="full">
        <p className="text-meta">Design system</p>
        <h1 className="display-xl mt-4">Token reference &amp; ramps</h1>
        <p className="mt-6 leading-relaxed text-secondary">
          Living inventory of CSS custom properties, utility classes, and layout
          conventions — including the case study detail page, vignette filmstrip
          panels, and reading behaviors added for{" "}
          <code className="font-mono text-xs text-primary">/case-studies/[slug]</code>
          . Source of truth:{" "}
          <code className="font-mono text-xs text-primary">src/app/globals.css</code>
          . Breakpoint for grid/desktop chrome:{" "}
          <strong className="text-primary">1024px (lg)</strong>; vignette
          scroll-jack: <strong className="text-primary">768px (md)</strong>.
        </p>
      </SiteGridCell>

      <SiteGridSubgrid>
        {NAV.map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="body-sm grid-span-2 text-secondary underline-offset-4 transition-opacity hover:opacity-70"
          >
            {label}
          </a>
        ))}
      </SiteGridSubgrid>

      <DsSectionHeader
        id="type"
        meta="01 · Typography"
        title="Type ramp"
        description="Unified type ramp from Display XL (4.75rem ceiling) through label sizes. All routes use these classes — no route-specific type overrides. Default body is Geist Sans; roles use .text-primary / .text-secondary / .text-tertiary."
      />

      {coreTypography.map((style) => (
        <TypeSpecimenRow key={`${style.label}-${style.className}`} style={style} />
      ))}

      <SiteGridCell span="content">
        <p className="text-meta">Usage map</p>
      </SiteGridCell>
      <GridSpecTable
        headers={["Role", "Class", "Routes"]}
        rows={typographyUsageMap.map((row) => [row.role, `.${row.className}`, row.routes])}
        columns={3}
      />

      <SiteGridCell span="content">
        <p className="text-meta">Ornamental scale</p>
        <p className="body-sm mt-2 text-secondary">
          Ghost indices and chapter numerals sit outside the reading hierarchy ceiling.
        </p>
      </SiteGridCell>

      {ornamentalTypography.map((style) => (
        <TypeSpecimenRow key={`ornament-${style.label}`} style={style} />
      ))}

      <SiteGridCell span="content">
        <p className="body-sm text-secondary">
          Craft card titles use <code className="font-mono text-label-xs">.craft-card-title</code> — a
          container-query wrapper around <code className="font-mono text-label-xs">.heading-md</code>.
        </p>
      </SiteGridCell>

      <SiteGridCell span="content">
        <p className="text-meta">Text roles (light surface)</p>
      </SiteGridCell>
      <SiteGridSubgrid>
        <p className="body-lg grid-span-6 text-primary">Primary · ink 100%</p>
        <p className="body-lg grid-span-6 text-secondary">Secondary · ink 80%</p>
        <p className="body-lg grid-span-6 text-tertiary">Tertiary · ink 60%</p>
      </SiteGridSubgrid>

      <SiteGridCell span="content" className="theme-dark py-6">
        <p className="text-meta">Text roles (theme-dark)</p>
      </SiteGridCell>
      <SiteGridSubgrid className="theme-dark pb-6">
        <p className="body-lg grid-span-6 text-primary">Primary · paper 100%</p>
        <p className="body-lg grid-span-6 text-secondary">Secondary · paper 80%</p>
        <p className="body-lg grid-span-6 text-tertiary">Tertiary · paper 60%</p>
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
            className="grid-span-2 h-4 self-center bg-[var(--color-neon-lime)]"
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
              className="shrink-0 bg-[var(--color-sky-blue)]"
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
        <p className="text-meta">Client brand colors</p>
        <p className="mt-2 text-sm text-secondary">
          Site-wide tokens — CSS vars, Tailwind utilities, inline styles, vignette{" "}
          <code className="font-mono text-xs">panelBg</code>, case-study brand fields.
          E.g. <code className="font-mono text-xs">var(--color-cruise-primary)</code>,{" "}
          <code className="font-mono text-xs">bg-google-tertiary</code>,{" "}
          <code className="font-mono text-xs">clientBrandColorVar(&quot;cruise-primary&quot;)</code>.
        </p>
      </SiteGridCell>
      {clientBrandColorGroups.map(({ client, colors }) => (
        <SiteGridSubgrid key={client}>
          <SiteGridCell span="content">
            <p className="text-meta">{client}</p>
          </SiteGridCell>
          {colors.map(({ token, label, hex }) => (
            <TokenSwatch key={token} token={token} label={label} hex={hex} />
          ))}
        </SiteGridSubgrid>
      ))}

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
        description="Apply a theme class on any section wrapper. Text tokens flip automatically — ink on light grounds, paper on dark/saturated grounds. Google quaternary uses ink on yellow."
      />
      {surfaceGroups.map(({ id, label }) => (
        <SiteGridSubgrid key={id}>
          <SiteGridCell span="content">
            <p className="text-meta">{label}</p>
          </SiteGridCell>
          {surfaces
            .filter((surface) => surface.group === id)
            .map((surface) => (
              <SurfaceSpecimen key={surface.className} surface={surface} />
            ))}
        </SiteGridSubgrid>
      ))}

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
        id="case-study"
        meta="07 · Case study detail"
        title="Vignette chapters & reading"
        description="Narrative vignettes on case study detail pages are horizontal filmstrips of abutted panels (.vframe). Each chapter opens with a title panel, then content frames from portfolio.ts. Desktop pins the strip and pages one panel per scroll notch; mobile stacks panels vertically."
      />

      <SiteGridCell span="content">
        <p className="text-meta">Page regions</p>
      </SiteGridCell>
      <GridSpecTable
        headers={["Region", "Root class", "Notes"]}
        rows={[
          [".cs-detail", "article", "Scroll controller + peek cursor"],
          ["Hero masthead", ".cs-hero", "Facts on chrome axis · title/subhead bottom-pinned"],
          ["Prose block", ".cs-section--prose", "Heading cols 1–4 · body cols 5–12 on lg"],
          ["Vignette chapter", ".vchapter", "Sticky pin · height = panel count × 100svh"],
          ["Simple vignette", ".cs-section--vignette", "Non-narrative gallery layout"],
        ]}
        columns={2}
      />

      <SiteGridCell span="content">
        <p className="text-meta">Hero fact columns (desktop)</p>
      </SiteGridCell>
      <GridSpecTable
        headers={["Fact", "Grid cols"]}
        rows={caseStudyHeroFacts.map((f) => [f.key, f.cols])}
        columns={2}
      />

      <SiteGridCell span="content">
        <p className="text-meta">Panel anatomy — shared vertical rhythm</p>
        <p className="mt-2 text-sm text-secondary">
          Every panel uses the same three-band grid: kicker (chrome height) · main
          (content) · foot (caption or tags). Interior inset aligns across title,
          media, and field panels via{" "}
          <code className="font-mono text-xs">--panel-main-inset-top</code>.
        </p>
      </SiteGridCell>
      <SiteGridSubgrid className="theme-dark">
        <div className="grid-span-6 grid min-h-[14rem] grid-rows-[var(--chrome-top-offset,4.5rem)_1fr_var(--panel-foot,6rem)] border border-[var(--rule-light)] lg:grid-span-4">
          <div className="flex items-center border-b border-[var(--rule-light)] px-4 text-meta normal-case tracking-normal">
            Kicker · .vframe__kicker
          </div>
          <div className="flex items-start px-4 pt-4 body-sm">Main · .vframe__main</div>
          <div className="text-caption flex items-end border-t border-[var(--rule-light)] px-4 pb-4 text-secondary">
            Foot · .vframe__foot
          </div>
        </div>
        <div className="grid-span-6 text-sm text-secondary lg:grid-span-8">
          <p>
            Panels butt together with a single right + bottom keyline seam. The
            outer left and top edges stay open. Widths snap to master grid
            columns via JS measurement of{" "}
            <code className="font-mono text-xs">.vchapter__ruler</code>.
          </p>
        </div>
      </SiteGridSubgrid>

      <SiteGridCell span="content">
        <p className="text-meta">Panel widths (12-col desktop)</p>
      </SiteGridCell>
      <GridSpecTable
        headers={["Panel kind", "Cols", "Class"]}
        rows={vignettePanelWidths.map((p) => [p.kind, p.cols, p.className])}
        columns={3}
      />

      <SiteGridCell span="content" className="theme-dark py-6">
        <p className="text-meta">Panel surfaces</p>
        <p className="mt-2 text-sm text-secondary">
          Set <code className="font-mono text-xs">panelBg</code> in{" "}
          <code className="font-mono text-xs">portfolio.ts</code>, or use any client brand
          token elsewhere via CSS var / Tailwind. Trail inherits the last frame.
        </p>
      </SiteGridCell>
      <SiteGridSubgrid className="theme-dark pb-6">
        {vignettePanelSurfaces.map((surface) => (
          <div
            key={surface.id}
            className="grid-span-6 min-h-[5rem] border border-[var(--rule-light)] p-4 lg:grid-span-3"
            style={{ background: `var(${surface.token})` }}
          >
            <p className="text-meta normal-case tracking-normal">{surface.label}</p>
            <p className="mt-2 font-mono text-xs text-tertiary">{surface.token}</p>
            <p className="mt-1 font-mono text-xs text-tertiary">
              panelBg=&quot;{surface.id}&quot;
            </p>
          </div>
        ))}
      </SiteGridSubgrid>

      <SiteGridCell span="content">
        <p className="text-meta">Reading &amp; interaction patterns</p>
      </SiteGridCell>
      <GridSpecTable
        headers={["Pattern", "Selector", "Behavior"]}
        rows={caseStudyDetailPatterns.map((p) => [
          p.pattern,
          p.className,
          p.behavior,
        ])}
        columns={3}
      />

      <SiteGridCell span="content" className="theme-dark pt-6">
        <p className="text-meta">Case study &amp; vignette typography</p>
      </SiteGridCell>

      {caseStudyTypography.map((style) => (
        <TypeSpecimenRow
          key={`cs-${style.label}`}
          style={style}
          surfaceClass="theme-dark"
        />
      ))}

      <DsSectionHeader
        id="components"
        meta="08 · Components"
        title="Chrome & patterns"
      />
      <SiteGridCell span="content">
        <p className="text-meta">CTA button</p>
        <p className="mt-2 text-sm text-secondary">
          Primary uses <code className="font-mono text-xs">--accent</code> fill with{" "}
          <code className="font-mono text-xs">--accent-foreground</code> (ink) — not
          parent <code className="font-mono text-xs">--text-primary</code>.
        </p>
      </SiteGridCell>
      <SiteGridSubgrid className="items-stretch">
        <div className="theme-light grid-span-6 min-w-0 border border-[var(--rule-light)] p-4">
          <p className="text-meta mb-4">Primary · on light</p>
          <CtaButton href="/contact">Primary CTA</CtaButton>
        </div>
        <div className="theme-dark grid-span-6 min-w-0 border border-[var(--rule-light)] p-4">
          <p className="text-meta mb-4">Primary · on dark</p>
          <CtaButton href="/contact">Primary CTA</CtaButton>
        </div>
        <div className="theme-light grid-span-6 min-w-0 border border-[var(--rule-light)] p-4">
          <p className="text-meta mb-4">Ghost · on light</p>
          <CtaButton href="/case-studies" variant="ghost">
            Ghost link
          </CtaButton>
        </div>
        <div className="theme-dark grid-span-6 min-w-0 border border-[var(--rule-light)] p-4">
          <p className="text-meta mb-4">Ghost · on dark</p>
          <CtaButton href="/case-studies" variant="ghost">
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
