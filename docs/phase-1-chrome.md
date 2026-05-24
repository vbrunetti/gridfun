# Phase 1 — Chrome

Design direction for the portfolio shell: navigation, grid, interaction patterns, and visual system. Content (case studies, real media) comes later.

**Stack:** Next.js · Vercel · Vimeo  
**Status:** Chrome-only rebuild (v2) — rail, 16-col grid, menu  
**Last updated:** 2025-05-23

---

## North star

A UX portfolio that feels **architectural and grid-literate**. Structure is visible. Typography is bold but disciplined. Motion is intentional.

- **Work** is browsed as **vertical 9:16 cards** on a horizontal rail (IKONY).
- The **site** uses **ruled grids**, **sticky/cover scroll**, and **section color reversals** (DES, LVNG, Salt, Duling).
- An optional **skeleton overlay** shows the underlying grid — a designer-forward affordance (DES).

---

## Scope

### In Phase 1

| Area | Deliverable |
|------|-------------|
| Visual system | Color, type, spacing, grid tokens |
| Site chrome | Left rail, top bar, footer |
| Navigation | Routes, menu overlay, active states |
| Interaction | Menu, skeleton toggle, reduced-motion fallbacks |
| Placeholder pages | Dummy copy and numbered project cards |
| Work shell | Horizontal card scroller (no real case studies) |

### Out of Phase 1

- Real case study copy and assets
- MDX content wiring
- Gallery / lightbox
- CMS
- Dark mode (optional hook only — see [Open decisions](#open-decisions))

---

## Design references

Five sites were reviewed for chrome and interaction — not for content or illustration style.

### 1. IKONY

- **URL:** [ikony.tv](https://ikony.tv/#/chapter1) · [Awwwards](https://www.awwwards.com/sites/ikony)
- **Take**
  - Palette: electric blue canvas, warm gray cards, black ink, red-orange accent
  - Horizontal scroll of **9:16 portrait cards**; mobile ≈ one card full-screen; desktop = multi-card gallery
  - Left rail locked (logo vertical, About, language, social); menu top-right in circle
  - Ambient background (blueprint) visible between cards
  - Chapter index with circled numbers; “next” in accent ring
- **Skip**
  - Documentary/chapter UI literally copied; SPA complexity not required day one

### 2. Salt Architecture

- **URL:** [saltarchitecture.nz](https://www.saltarchitecture.nz/) · [Awwwards](https://www.awwwards.com/sites/salt-architecture)
- **Take**
  - Asymmetric **color-block** landing; confidence in **empty grid cells**
  - Vertical scroll; images sparse in loose grid; huge captions vs tiny sans meta
  - Chrome **locks then scrolls away** (vertical labels on seam: Architecture, Interiors)
  - Menu as small top-right pill; accent pops (orange square) used sparingly
  - Serif display for section words + sans utility (optional for About later)
- **Skip**
  - Dense masonry; making every cell “do something”

### 3. Duling Hall

- **URL:** [dulinghall.com](https://dulinghall.com/) · [Awwwards](https://www.awwwards.com/sites/duling-hall)
- **Take**
  - **Visible black grid rules** defining modules
  - Persistent **left sidebar**: logo, vertical MENU / BACK
  - Full-screen **menu overlay** with nested links under a parent item
  - **Concentric arch** line graphics as abstract motif (not illustration)
  - CTA hierarchy: primary pill + circle arrow; secondary text + arrow
- **Skip**
  - Folk-art aesthetic, MCM doodles, halftone panels
  - **Ultra-extended** or **ultra-condensed** display sans (reads 1990s)
  - Busy stacked graphic panels

### 4. LVNG

- **URL:** [Awwwards — LVNG](https://www.awwwards.com/sites/lvng-the-future-of-home-living)
- **Take**
  - **Light gray vertical rules** full viewport height; header aligns to same columns
  - **Grid-breaking:** staggered hero image top edge; white block overlaps photo (z-index)
  - Segmented top bar: section link · language · MENU · theme toggle
  - Monochrome palette (`#ffffff`, `#1e1e1c`); neutral geometric sans
- **Skip**
  - Product CTAs, Lottie-heavy hero (defer to later polish)

### 5. Design Education Series (DES)

- **URL:** [des.obys.agency](https://des.obys.agency/) · [Awwwards](https://www.awwwards.com/sites/design-education-series-r)
- **Take**
  - **Bold type** at extreme scale contrast; **playful loader** typography
  - Visible grid; **Skeleton Mode** — semi-transparent column overlay toggle
  - Scroll: sections **stick**, next section **covers** previous
  - **Color reverse-out:** light sections (black on off-white) vs dark sections (white on black)
  - Yellow accent for CTAs on dark; ruled tables (Works, FAQ)
- **Skip**
  - 3D stone objects, course/pricing content model

---

## Anti-patterns (do not use)

| Avoid | Reason |
|-------|--------|
| Folk-art / venue illustration | Wrong tone for UX portfolio (Duling) |
| Extended or condensed display sans | Dated; hard to read (Duling) |
| Filling every grid cell | Kills Salt-style confidence |
| Multiple accent colors per viewport | Use one pop (IKONY / DES) |
| Horizontal + vertical scroll fighting same page | Assign axis per route (see IA) |

---

## Design tokens (draft)

### Color

| Token | Value / role |
|-------|----------------|
| `--canvas-blue` | IKONY electric blue — Work, hero fields |
| `--surface-gray` | Warm light gray — cards, panels |
| `--ink` | Near black — text, rules on light |
| `--accent` | Red-orange (primary) — active states, CTAs, rings |
| `--accent-alt` | DES yellow — optional second CTA on dark sections only |
| `--rule-light` | Light gray — default column lines (LVNG) |
| `--rule-strong` | Black — menu, contact, structural pages (Duling) |
| `--surface-sage` | Salt — About / calm sections (optional) |
| `--surface-green` | Salt forest — block fields (optional) |
| `--surface-blue-muted` | Salt dusty blue — block fields (optional) |

### Typography

- **Family:** Neutral grotesque (Geist or similar) for Phase 1; evaluate display serif for About later (Salt).
- **Scale:** Large display for nav moments and hero; small caps/meta for captions, indices, `(Scroll)`.
- **Rules:** Normal letterforms only — weight and size create hierarchy, not width distortion.

### Grid

| Token | Role |
|-------|------|
| `--grid-columns` | 12 (internal); may present as 5 on marketing pages |
| `--grid-margin` | `clamp(1rem, 4vw, 3rem)` |
| `--grid-gutter` | `clamp(0.75rem, 2vw, 1.25rem)` |
| `--grid-row-gap` | `clamp(1.5rem, 4vw, 3rem)` |
| `--content-max` | ~72rem |
| `--media-column` | `min(100%, 26rem)` — 9:16 card width cap |

### Card (Work)

- Aspect ratio **9:16**
- Rounded corners, thin border
- Internal **safe zone** for type so partial cards on desktop don’t clip copy

---

## Layout principles

1. **One master column grid** — chrome and content share it.
2. **Visible rules** — light by default; stronger on menu / contact.
3. **Grid-breaking is intentional** — overlap media, staggered edges, z-index (LVNG, IKONY); not on every element.
4. **Whitespace is content** — empty cells and bands are valid (Salt).
5. **Skeleton overlay** — optional toggle; semi-transparent columns; `localStorage` persistence.

---

## Chrome components

| Component | Behavior | Primary refs |
|-----------|----------|--------------|
| **Left rail** | Logo, vertical MENU/BACK, About link, social placeholders | IKONY, Duling |
| **Top bar** | Logo or wordmark, ruled segments, MENU trigger, skeleton toggle, theme hook (optional) | LVNG, DES |
| **Menu overlay** | Full viewport, dark field, large links (normal width), nested children | Duling, DES |
| **Footer** | Ruled strip or DES-style large link stack | DES |
| **Card rail** | Horizontal scroll-snap, 1-up mobile / multi-up desktop | IKONY |
| **CTA primary** | Pill + circle arrow | Duling |
| **CTA secondary** | Text + arrow | Duling |
| **Arch motif** | SVG concentric semicircles — abstract only, optional per route | Duling (refined) |
| **Ambient background** | Blueprint / line art behind card gaps — optional | IKONY |

### Menu typography

- Large on dark overlay — **not** ultra-extended track (reject Duling menu style).
- Generous line-height; optional bullet prefix (`●`) per DES.

---

## Information architecture (draft)

| Route | Experience |
|-------|------------|
| `/` | Home — DES hero + ruled bands; Salt color-block or LVNG overlap demo; loader |
| `/work` | Horizontal **9:16 card rail**; dummy projects `01`–`06` |
| `/work/[slug]` | Case study shell — vertical scroll, stick/cover sections (placeholder) |
| `/about` | Calm ruled page; Salt whitespace; optional serif |
| `/contact` | Duling-style ruled grid; staff/contact table placeholder |

**Axis rule:** Horizontal scroll on `/work` only. Vertical stick/cover on home and case study — not both on the same viewport without clear intent.

---

## Motion & interaction

### Tier A — first build

- Menu open/close with focus trap
- Skeleton overlay toggle
- `prefers-reduced-motion`: disable non-essential transitions
- Active route styles

### Tier B

- Playful **loader** (DES) → reveal shell
- Horizontal **scroll-snap** on Work card rail

### Tier C

- **Sticky + cover** section scroll (DES) on Home or case study template
- Section **theme flip** light ↔ dark at boundaries

### Tier D

- Ambient background layer (IKONY)
- Hover polish on cards (LVNG / Awwwards DES notes)

---

## Accessibility

- Horizontal Work rail: keyboard scroll or chapter list as jump links
- Menu: focus trap, Escape to close, visible focus rings
- Skeleton overlay: toggle labeled; does not block pointer events to essential chrome (or pauses when menu open)
- Video embeds: titles, reduced autoplay

---

## Implementation order

When implementation starts:

1. Tokens + grid CSS + skeleton overlay component
2. Shell: left rail + top bar + footer
3. Menu overlay + placeholder routes
4. Home: ruled hero + one grid-break demo
5. Work: horizontal card scroller with dummy cards
6. Loader (Tier B)
7. Stick/cover scroll prototype (Tier C)

---

## Open decisions

Record choices here as they’re made.

| Question | Options | Decision |
|----------|---------|----------|
| Menu overlay style | Duling big type on dark vs IKONY minimal circle | **TBD** — lean Duling/DES, normal width |
| Grid rule weight | Light everywhere vs light + heavy on menu/contact | **TBD** — lean light global, heavy on menu/contact |
| Palette on About | IKONY bold vs Salt muted | **TBD** — lean Salt calm on About |
| Display serif on About | Yes / no | **TBD** — default sans-only Phase 1 |
| Dark mode in Phase 1 | Yes / hook only / no | **TBD** — hook only or defer |
| Loader in first slice | Yes / defer | **Yes** — session-based, skip with Enter |
| Accent | Red-orange only vs yellow on dark sections | **TBD** — one accent per viewport |

---

## Reference matrix

| Pattern | IKONY | Salt | Duling | LVNG | DES |
|---------|:-----:|:----:|:------:|:----:|:---:|
| Visible grid | gaps | blocks | black rules | light rules | + skeleton |
| Grid break | cards/bg | — | panels | overlap | — |
| Horizontal browse | ● | — | — | — | — |
| Vertical stick/cover | — | partial | — | — | ● |
| Left rail | ● | labels | ● | logo | — |
| Top bar segments | — | — | — | ● | ● |
| Bold sans type | ● | serif mix | reject | ● | ● |
| Color reverse sections | — | bands | — | — | ● |
| Accent pop | ● | ● | ● | — | ● |

---

## Changelog

| Date | Change |
|------|--------|
| 2025-05-23 | Initial doc from five reference reviews |
| 2025-05-23 | Phase 1 v1 implemented in codebase |
| 2025-05-23 | v2: stripped to chrome only; 16-col grid; desktop-only rail; brand palette |
