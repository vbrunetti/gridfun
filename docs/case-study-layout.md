# Case study detail — layout & interaction rules

Codified patterns from `/case-studies/[slug]`. Use this when building or extending any **narrative page**: long-form project stories, hero + sections + filmstrip chapters, and the reading behaviors that tie them together.

**Source of truth in code**

| Layer | Location |
|-------|----------|
| CSS tokens & classes | `src/app/globals.css` |
| Token metadata (design system page) | `src/lib/design-tokens.ts` |
| Live reference | `/design-system` → §07 Case study |
| Page composition | `src/app/case-studies/[slug]/page.tsx` |
| Scroll + focus + peek | `src/components/case-studies/case-study-detail-scroll.tsx` |
| Vignette filmstrip | `src/components/craft/vignette-chapter.tsx` |
| Dot nav steps | `src/lib/case-study-detail-steps.ts` |

**Last updated:** 2026-06-11

---

## North star

Narrative pages are **grid-literate readers**, not article templates.

- Structure is visible: columns, keylines, and panel widths snap to the **master 12-col grid** (6 on mobile).
- Typography is bold but banded: every panel shares the same **kicker · main · foot** vertical rhythm.
- Motion serves reading: one scroll notch = one **focus target** (section, or vignette panel on desktop).
- Color comes from **panels and surfaces**, not page-wide washes — except intentional theme reversals (hero dark, footer canvas).

---

## Master grid

All narrative regions compose inside `RuledGrid` / `SiteGrid` unless a component explicitly full-bleeds (hero video, vignette filmstrip).

| Token | Mobile | Desktop (lg+) |
|-------|--------|----------------|
| `--grid-columns` | 6 | 12 |
| `--grid-gutter` | `clamp(1rem, 2.5vw, 1.5rem)` | same |
| `--grid-margin` | `1rem` | `clamp(1rem, 4vw, 3rem)` |
| `--grid-margin-inline-end` | `1rem` | `max(margin, chrome inset)` |
| `--grid-max` | none | `90rem` (1440px) |
| `--grid-row-gap` | `clamp(1.5rem, 4vw, 3rem)` | same |

**Breakpoints**

| Name | Width | Role |
|------|-------|------|
| `md` | 768px | Vignette scroll-jack, horizontal filmstrip, trail panel |
| `lg` | 1024px | 12-col grid, desktop chrome (rail), prose column split |

**Composition rules**

1. Prefer `SiteGridSubgrid` for children that must land on **named column tracks** — do not guess alignment with padding alone.
2. Column 1 left edge is the **content anchor**; inset content with `grid-column`, not negative margins.
3. Use `col-span-content` (inset 2 / -2 on lg) for readable prose width inside the grid.
4. Toggle **Show grid** (keyboard `G`) to verify alignment against the skeleton overlay.

---

## Page anatomy

A case study detail page is a vertical stack of **rows**. Each row is a dot-nav step and a scroll-snap target on desktop.

```
┌─────────────────────────────────────────────┐
│  Hero masthead          (.cs-hero)          │  ← kind: hero
├─────────────────────────────────────────────┤
│  Prose block (optional) (.cs-section--prose)  │  ← kind: prose
├─────────────────────────────────────────────┤
│  Vignette chapter       (.vchapter)         │  ← kind: vignette (filmstrip)
│   or simple vignette    (.cs-section--vignette)
├─────────────────────────────────────────────┤
│  … more sections …                          │
├─────────────────────────────────────────────┤
│  Footer / next            (.cs-footer)      │  ← kind: footer (canvas)
└─────────────────────────────────────────────┘
```

**Wrapper:** `CaseStudyDetailScroll` → `article.cs-detail` (scroll controller, peek cursor, snap).

**Row contract** — every major block:

```html
<section
  id="…"
  data-cs-detail-row
  class="cs-focus-section …"
  data-chrome-surface="dark|light"
>
```

| Attribute / class | Purpose |
|-------------------|---------|
| `id` | Dot-nav target + snap anchor |
| `data-cs-detail-row` | Included in scroll/snap registry |
| `cs-focus-section` | Section-level focus dimming (45% idle, 100% focused/hover) |
| `data-chrome-surface` | Right-rail dot color (light vs dark) |
| `keyline-b` | Bottom rule between rows |

---

## Hero masthead (`.cs-hero`)

Full-viewport **dark** opener. Title and subhead are bottom-pinned above the section keyline; facts sit on the **chrome axis** (same vertical band as logo + menu).

### Vertical bands

```
┌─ --chrome-top-offset ─────────────────────┐
│  Facts row (Client · Date · Role · Tools) │
├───────────────────────────────────────────┤
│                                           │
│  Main (grows)                             │
│                                           │
│  Title + subhead (bottom-pinned)          │
├─ --cs-hero-foot ──────────────────────────┤
└ keyline ──────────────────────────────────┘
```

### Fact columns (desktop 12-col)

| Fact | Columns |
|------|---------|
| Client | 1–2 |
| Date | 3–4 |
| Role | 5–8 |
| Tools | 9–12 |

Mobile: 6-col subgrid — client/date on row 1; role and tools stack below.

### Typography

| Element | Class | Notes |
|---------|-------|-------|
| Fact kicker | `.text-meta` | Uppercase meta |
| Title | `.cs-hero__title.display-xl` | Project name |
| Subhead | `.cs-hero__subhead` | One supporting line |

### Optional hero video

- Class: `.cs-hero__video` — full bleed from **left rail** to **browser right edge**
- Default opacity: 30% (`heroVideo` in `portfolio.ts`)
- Sits behind grid content (`z-index: 0`); copy stays at `z-index: 1`

---

## Prose blocks (`.cs-section--prose`)

For editorial copy between vignette chapters.

| Band | Desktop columns | Mobile |
|------|-----------------|--------|
| Heading | 1–4 (`.cs-prose__heading`) | full width, above body |
| Body | 5–12 (`.cs-prose__body`) | full width |

- Vertical padding: `clamp(5rem, 16vh, 11rem)` — more on lg
- Body paragraphs: `.cs-prose__paragraph` — secondary color, `line-height: 1.7`

---

## Vignette chapters (`.vchapter`)

Narrative vignettes with beats or a theme line render as a **horizontal filmstrip** of abutted full-height panels. Simple galleries (no beats) use `.cs-section--vignette` instead — grid layout, not filmstrip.

### Structure

```
.vchapter
  .vchapter__pin          ← sticky, 100svh, scroll-jack container
    .vchapter__ruler      ← hidden 0-height site-grid for JS width measure
    .vchapter__track      ← flex row, translateX per panel
      .vframe--title      ← panel 0 (chapter opener)
      .vframe--*          ← content frames from portfolio.ts
      .vchapter__trail?   ← phantom bleed after last colorful panel
```

- Section height: `calc(var(--frames) * 100svh)` — one viewport per panel in the scroll model
- `--frames` = title panel + image/frame count

### Panel widths (12-col desktop)

Widths are **grid fractions**, measured live from `.vchapter__ruler` — never hard-coded pixels.

| Panel kind | Cols | Class |
|------------|------|-------|
| Chapter title (opener) | 4 / 12 | `.vframe--title` |
| Field beat + portrait 9×16 | 6 / 12 | `.vframe--field.vframe--9x16` |
| Square 1×1 | 8 / 12 | `.vframe--1x1` |
| Landscape 16×9 | 12 / 12 | `.vframe--16x9` |

On mobile (`< md`): panels **stack vertically** — no horizontal scroll-jack.

### Panel anatomy — shared vertical rhythm

Every `.vframe` uses the same three-band grid:

```
┌─ kicker  (--panel-kicker = --chrome-top-offset) ─┐
├─ main    (--panel-main-inset-top)               ─┤
├─ foot    (--panel-foot)                         ─┤
└─────────────────────────────────────────────────┘
```

| Band | Content | Token |
|------|---------|-------|
| Kicker | Date, meta | `--panel-kicker` |
| Main | Title, beat prose, media | `--panel-main-inset-top` |
| Foot | Caption, craft filter chips | `--panel-foot`, `--panel-pad` |

**Keyline rule:** panels butt together with **right + bottom** seam only. No top border (avoids doubled horizontal). Outer left/top edges stay open.

### Panel surfaces

Set via `data-panel-bg` → CSS `--panel-bg`.

| `data-panel-bg` | Token | Use |
|-----------------|-------|-----|
| `default` | `--panel-surface` | Ground |
| `secondary` | `--panel-surface-secondary` | Accent lift (2 media frames per chapter) |
| `tertiary` | `--panel-surface-tertiary` | Accent lift |
| `brand` | `--color-cruise` | Colorful last beat (brand stories) |

### Title panel (panel 0)

| Zone | Content | Typography |
|------|---------|--------------|
| Kicker | Case study date | `.text-meta` |
| Main | Chapter numeral + name | `.vchapter__numeral`, `.vchapter__title` |
| Foot | Craft tags | `.craft-filter-chip--compact` → links to `/craft?tag=` |

### Content panels

| Type | Main | Foot |
|------|------|------|
| Field beat (`.vframe--field`) | `.vframe__beat` prose | — |
| Media | Image / Vimeo | `.vframe__caption` |

### Trail panel (`.vchapter__trail`)

When the **last frame** uses `secondary`, `tertiary`, or `brand` background:

- Render a **phantom sibling** after the last `.vframe` in `.vchapter__track`
- `width: 100vw` — extends color to the viewport right edge
- **Not** counted in scroll steps or dot-nav panel index
- Mirrors panel focus dimming (45% idle, 100% active/hover)

---

## Simple vignette (`.cs-section--vignette`)

Non-narrative gallery layout inside the normal grid — no filmstrip.

- Title + tags in `.cs-vignette__grid`
- `VignetteImageScroll` with `layout="grid"`
- Same `cs-focus-section` row contract as prose

---

## Reading & interaction

Desktop (`md+`) on `.cs-detail`:

| Pattern | Selector | Behavior |
|---------|----------|----------|
| Section focus | `.cs-focus-section` | One section at 100% opacity; siblings 45%. Hover previews idle sections at 100%. |
| Panel focus | `.vframe.is-active` | Inside a vignette: one panel 100%; siblings 45%. Hover peeks idle panels. |
| Scroll snap | `.cs-detail` | One wheel/key step per hero, prose block, **each vignette panel**, or footer. |
| Peek cursor | `.cs-peek-cursor` | 200×200 plus on dimmed sections/panels; click jumps like dot nav. |
| Dot nav hover | `.chrome-hero-dots-rail:hover` | Temporarily lifts dimming on all sections/panels for orientation. |

Mobile: natural document scroll; vignette panels stack; snap and scroll-jack disabled.

**Reduced motion:** collapse to standard scroll; no snap, peek, or panel translate animation.

---

## Right-rail dot navigation

Lives in `FloatingChrome` → `CaseStudyDetailDotsRail`. Uses `.chrome-hero-dots-rail--study` (centered column, scrollable, edge fade).

### Step model

Built by `buildCaseStudyDetailSteps()`:

| Kind | Dot | Radial ring |
|------|-----|-------------|
| `hero` | 1 | No |
| `prose` | 1 per block | No |
| `vignette` | 1 per chapter | **Yes** — `(panelIndex + 1) / panelCount` while chapter is pinned |
| `footer` | 1 | No |

Vignette chapters register panel progress via `useCaseStudyVignetteProgressRegister` in `VignetteChapter`.

### Propagation pattern (home page)

The homepage reuses this model:

- **Dot 1** = hero with N sub-chapters → single dot, radial ring = progress through all sub-chapters
- **Dot 2…** = one dot per cover-flow secondary section (`homeCoverSections` in `src/content/home-sections.ts`)

When adding narrative pages elsewhere, prefer **one dot per major region**, with radial progress only when a region contains **multiple internal scroll steps**.

---

## Footer row

- `theme-canvas` + `data-chrome-surface="light"` — lime field, dark ink
- Next case study link or fallback CTA
- Same `cs-focus-section` + `id="cs-footer"` contract

---

## Typography quick reference

| Role | Class | Context |
|------|-------|---------|
| Hero title | `.cs-hero__title.display-xl` | Masthead |
| Hero subhead | `.cs-hero__subhead` | Masthead |
| Chapter numeral | `.vchapter__numeral` | Title panel |
| Chapter title | `.vchapter__title` | Title panel |
| Beat prose | `.vframe__beat` | Field panel |
| Media caption | `.vframe__caption` | Panel foot |
| Prose heading | `.cs-prose__heading.display-lg` | Prose block |
| Meta / kickers | `.text-meta` | Facts, dates, labels |

Full specimens: `/design-system#case-study`.

---

## Spacing tokens (narrative-specific)

| Token | Role |
|-------|------|
| `--panel-kicker` | Panel kicker band height (= chrome top offset) |
| `--panel-main-inset-top` | Main band top inset — **shared across all panel types** |
| `--panel-foot` | Foot band height |
| `--panel-pad` | Inline padding in kicker / main / foot |
| `--cs-hero-foot` | Hero title block bottom inset above keyline |

---

## Checklist — propagating to a new page

Use when building About, Craft detail, Home sections, or any future narrative route.

### Layout

- [ ] Wrap content in `RuledGrid`; use `SiteGridSubgrid` for multi-column rows
- [ ] Anchor primary copy to **column 1** on desktop unless a spec says otherwise
- [ ] Apply `keyline-b` between major rows
- [ ] Set `data-chrome-surface` on each row for dot/cursor color

### If the page has internal chapters (like vignettes)

- [ ] One **dot per major region**; radial ring only for multi-step regions
- [ ] Register steps in a `build*Steps()` helper; wire through scroll context
- [ ] Use shared panel bands (kicker / main / foot) and width fractions from the table above
- [ ] Measure widths from a hidden `.site-grid` ruler — do not hard-code panel px

### If the page scrolls vertically (like case study detail)

- [ ] Mark rows with `data-cs-detail-row` (or equivalent registry)
- [ ] Apply `cs-focus-section` dimming pattern
- [ ] Desktop: one notch per focus target; respect `prefers-reduced-motion`

### Content

- [ ] Craft tags on title panels → `craft-filter-chip--compact` linking to `/craft?tag=`
- [ ] Surfaces via `data-panel-bg`, not one-off background colors

### Verification

- [ ] Toggle grid overlay — column 1 and panel seams align
- [ ] Dot nav: correct step count, radial ring on multi-panel chapters only
- [ ] Mobile: stacked layout, no trapped scroll
- [ ] Add or update entries in `design-tokens.ts` if new tokens/classes are introduced

---

## Related docs

- [Phase 1 — Chrome](./phase-1-chrome.md) — site shell, rail, global grid tokens
- [/design-system](/design-system) — live token reference (§07 Case study)
