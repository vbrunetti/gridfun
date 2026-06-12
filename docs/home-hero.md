# Home hero — split-scene layout

Codified patterns for the homepage primary hero (`PrimaryHeroScrub`). This is **not** the case study masthead — home uses a **beat block** narrative column beside an independent particle companion.

**Source of truth in code**

| Layer | Location |
|-------|----------|
| CSS tokens & classes | `src/app/globals.css` → `.primary-hero-*` |
| Scroll + chapters | `src/components/sections/primary-hero/primary-hero-scrub.tsx` |
| Beat copy crossfade | `src/components/sections/primary-hero/hero-chapter-copy.tsx` |
| Particle companion | `src/components/sections/primary-hero/primary-hero-spark-layer.tsx` |
| Dot nav steps | `src/components/sections/primary-hero/hero-scrub-context.tsx` |
| Slate content | `src/content/hero-slates.ts` |
| Cover sections | `src/content/home-sections.ts` |

**Related:** [Case study layout](./case-study-layout.md) — vignette filmstrip and `.cs-hero` masthead patterns.

**Last updated:** 2026-06-11

---

## North star

The home hero is a **split scene**: narrative left, sentiment right. Copy and particles are **not** typographically coupled — they share the grid but occupy independent frames.

- **Beat block** — one vertical stack per chapter: eyebrow → headline → supporting line (+ CTAs on chapter 0).
- **Vertically centered** in the narrative column — not top-pinned like case study titles, not bottom-pinned like vignette footers.
- **Particles** — square frame (full spark zone width on desktop; height-capped on mobile), right edge on col 12 (col 6 mobile); positioned via JS/CSS vars.
- **Scroll** — one hero dot with radial progress through 6 sub-chapters; additional dots for `homeCoverSections`.

---

## Stage (`.primary-hero-stage--split-scene`)

Composes inside `RuledGrid` on the sticky hero slide.

| Region | Grid | Notes |
|--------|------|-------|
| Narrative copy | cols 1–8 (lg), full width mobile | `.primary-hero-copy` — beat block vertically centered, `z-index` above spark |
| Spark companion | cols 7–12 (lg), cols 4–6 mobile | `.primary-hero-spark-layer` — 6-col square, right edge on col 12; overlaps narrative cols 7–8 |

---

## Beat block (`.home-beat`)

Shared typography for hero chapters and cover sections (e.g. `#home-secondary`). Hero wraps beats inside `.primary-hero-chapters` crossfade layers.

```
┌─────────────────────────────┐
│  eyebrow (.text-meta)       │
│  headline (.display-xl)     │
│  subhead                    │
│  [CTAs — chapter 0 only]    │
└─────────────────────────────┘
```

| Element | Class | Rules |
|---------|-------|-------|
| Container | `.home-beat` | Flex column, `gap: var(--home-beat-gap)` |
| Eyebrow | `.home-beat__eyebrow` | Chapter/section label — **not** on chrome axis |
| Headline | `.home-beat__headline` | `display-xl`, full column width |
| Subhead | `.home-beat__subhead` | One supporting line, `max-width: 42ch`, secondary color |
| Gap | `--home-beat-gap` | `clamp(0.75rem, 2vh, 1.25rem)` on `.home-hero-cover-flow` |

**Do not** reuse case study `.cs-hero` kicker/main bands or vignette `--panel-main-inset-top` on home.

---

## Narrative column (`.primary-hero-copy`)

- `display: flex; align-items: center` — beat block vertically centered in the column.
- Mobile: `padding-block` clears chrome (`max(--chrome-top-offset, 1rem)` top).
- Desktop: symmetric vertical padding; no chrome-axis kicker row.

Chapter crossfade stacks layers in `.primary-hero-chapters` (grid area overlap + scroll-driven `translateY` / opacity).

---

## Spark companion (`.primary-hero-spark-layer`)

Independent of beat typography.

| Token | Role |
|-------|------|
| `--hero-spark-h` | Spark zone width (desktop); `min(75% stage height, zone)` on mobile |
| `--hero-spark-w` | Square width (matches height) |
| `--hero-spark-left` | Left offset so the frame’s right edge meets col 12 / col 6 |

Sized by `PrimaryHeroSparkLayer` measuring `.primary-hero-stage--split-scene` against the grid.

Optional tertiary adornments (ghost numerals, labels) belong **in the particle zone only** — never in the beat block.

---

## Cover sections (`#home-secondary`, etc.)

Cover panels use the same beat typography and narrative column as the hero:

- `.home-secondary-copy` — cols 1–7 (lg), vertically centered (`align-content: center`)
- `.home-beat` stack inside the copy column
- No particle companion; dark surface (`theme-dark`) is independent of hero layout
- **Fixed panel** spans content width on lg (`left: var(--rail-width)`) so `.site-grid` col 1 lines up with the hero — the panel sits outside `#main-content`’s rail padding wrapper

---

## CTAs (chapter 0)

- Reduced motion: CTAs inline via `afterSubhead` on `HeroChapterCopy`.
- Scroll mode: separate `.hero-chapter-cta-layer` mirrors beat dimensions with invisible duplicate copy + visible `.primary-hero__ctas` so buttons stay aligned while headline scrolls away.

---

## Dot navigation

Steps from `hero-scrub-context`:

1. `{ kind: 'hero', subChapterCount: 6 }` — radial ring = `(rawSlide + 1) / slateCount` while in hero.
2. One dot per `homeCoverSections` entry.

**Not** one dot per hero chapter — hero sub-chapters share a single dot.

---

## Propagation checklist

When changing home hero layout:

- [ ] Beat block stays vertically centered in cols 1–8 (hero spark cols 7–12 may overlap 7–8; copy stays above)
- [ ] Cover sections reuse `.home-beat` typography + `.home-secondary-copy` column
- [ ] Eyebrow remains inside beat, not chrome-axis kicker
- [ ] Spark frame unchanged (col 12 anchor, 6-col zone on desktop)
- [ ] CTA layer still mirrors beat height on chapter 0
- [ ] Dot nav: 1 hero step + N cover sections
- [ ] Skeleton overlay still targets `#main-content .primary-hero-stage.site-grid`
