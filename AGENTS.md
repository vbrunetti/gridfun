<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Canonical layout references — one source, changes propagate

`/layout-experiments` (`src/app/layout-experiments/page.tsx`) is the **living reference gallery** for the two reusable layout systems on this site: **prose layout variants** and **vignette panel types**. It is modeled as a synthetic case study and rendered through the exact same components the real case studies use, so the reference can never drift from production.

**The rule: a layout change is made once, in the shared source, and shows up everywhere — the reference *and* every case study — automatically.** Never fork, copy, or re-implement these renderers to make a one-off tweak.

Canonical sources (edit these; do not duplicate):
- **Prose variants** — type: `ProseVariant`/`ProseSection` in `src/content/portfolio.ts` · renderer: `ProseBlock` (`src/components/case-studies/prose-block.tsx`) · styles: `.cs-prose__*` / `.cs-section--prose-*` in `globals.css`.
- **Vignette panels** — renderer: `VignetteChapter` + `FrameContent` (`src/components/craft/vignette-chapter.tsx`) · panel authoring helpers (`cruiseBeat`/`cruiseMedia`/`cruiseStat` etc.) in `src/content/portfolio.ts` · styles: `.vframe*` / `.vchapter*` in `globals.css`.
- **The detail deck** that hosts both — `CaseStudyDetail` (`src/components/case-studies/case-study-detail.tsx`), shared by `/case-studies/[slug]` and `/layout-experiments`.

When you **add** a variant or panel type: extend the shared source above, then add one specimen to the synthetic study in `/layout-experiments` so the gallery stays complete. The layout-experiments page holds only placeholder *content/specimens* — no rendering logic lives there. (Throwaway harness: remove the page + its nav line once the systems are dialed in.)

# Project backlog

Prioritized work for this site. **Read before starting feature work**; update when items land or priorities shift. P0 = do next · P1 = soon · P2 = opportunistic.

## P0
- **Complete ONE vignette's real content, end-to-end.** Replace placeholder copy/media for a single vignette and confirm we like it; once verified, the *rest* of the content work drops to P1. Source: `src/content/portfolio.ts`; placeholder assets via `src/lib/portfolio-assets.ts`. — *Production-ready content instead of placeholders; proves the content model.*
- **About & Contact pages — design pass.** Content is OK but the design is well below the rest of the site; bring them up to bar (apply design judgment). — *Completes the overall picture of the site.*
- **Mobile vignette swipe hint.** A visual affordance (directional arrows / a peek of the next panel / one-time coach mark) signaling that a vignette filmstrip is swipeable on touch. Nothing signals it today. — *Discoverability on mobile.*

## P1
- **Native scroll-snap on mobile vignettes.** Replace the JS flick/gesture model on mobile (`attachHorizontalGestures` in `src/components/craft/vignette-chapter.tsx` + `src/components/deck/gestures.ts`) with the native scroll-snap pin used on desktop. Mobile flick works today and recovers easily, so not urgent. — *Robust, consistent touch behavior; removes tuning-fragile code.*
- **Grid on/off toggle in the overlay nav.** Surface the grid-overlay toggle (currently only the `G` key) as a control in the mobile overlay nav. — *Mobile users can't press `G`.*
- **Unify home + `/case-studies` index onto the shared deck** (retire `home-scroll.tsx`). — *One scroll engine; less drift and duplicated bugs.*
- **Turn the case-studies index into a unified "Work" page with rich per-item filmstrips.** Right now each entry on `/case-studies` is one static panel (title, subhead, flat brand-color field — see `CaseStudyCoverStack`). Replace that per-entry visual with a real horizontal filmstrip, reusing the exact panel vocabulary already built for case-study vignettes: title/cover treatment, a color-block + logo panel, video via the existing `heroVideo` / `CaseStudyHeroVideo` pattern, image carousels via a `sources` array (2+ images auto-carousel, no new code needed), and stat/thesis panels for impact numbers. This is the same vertical-outer/horizontal-inner nesting `VignetteChapter` already does inside case-study detail pages (see `CaseStudyDetail`) — just pointed at the index instead of confined to detail pages. Keep title/subhead/tags/"View case study →" as static page furniture around the filmstrip rather than inside it — `VignetteChapter`'s trailing element is decorative only, not a link, so don't try to bake a CTA panel into the chapter mechanic itself. One unified page, not a split "deep" vs. "shallow" destination: every entry gets the same rich filmstrip treatment, but only entries with a real case study behind them get the closing link to `/case-studies/[slug]` — lighter one-off pieces just end without one. Needs a new, lighter content shape in `portfolio.ts` for these curated index filmstrips (distinct from the full `CaseStudy.sections` model — these are hand-picked highlight reels for skimming, not a rehash of a vignette's internal beats). The page H1 and nav label should also change from "Case Studies" to something like "Work" or "Selected Work" once entries with no click-through exist alongside deep dives. Overlaps with the item above — worth sequencing together. — *Recruiters don't have much time; one skimmable, at-a-glance destination for the whole body of work beats making them choose between a "case studies" page and something else.*
- **Craft carousel onto the shared gesture module** (`src/components/craft/vignette-carousel.tsx`). — *One gesture code path to maintain.*
- **Delete dead code:** `src/lib/nav.ts`, `src/content/_BK/`, committed `.DS_Store`s, any retired scroll engines. — *Smaller, clearer codebase.*
- **Remaining content** (after the first vignette is verified): real copy/media for all other vignettes & case studies, real logo art (logo-mark placeholders), and `src/content/site.ts` social URLs / phone (`TODO`). — *Production content.*

## P2
- **Scrollbar-safe full-bleed keylines.** The `width: 100vw` keyline rules (`globals.css` — `.keyline-b::after` / `.keyline-t::before`) overflow when a *classic* (non-overlay) scrollbar is present; not observed on real devices yet. — *Prevents a horizontal-overflow / off-screen-chrome edge case.*

## Closed / decided (kept for traceability)
- **Mobile full-bleed vignette panels** — already effectively the case on mobile (resolved via the merged `mobile-vignette-snap-and-padding` work). No explicit mobile full-width rule exists, so revisit only if a non-media panel ever looks narrow on a phone.
- **One dot per vignette panel** — rejected; keep the per-section dot with radial panel progress.
- **Per-section band-fraction panels** — killed; mobile full-height plus existing desktop fractional heights cover it, and no band panels exist.

## Recently shipped
- **Native scroll-driven vignette pin** with per-panel CSS scroll-snap (`scroll-snap-stop: always`) on desktop case-study + craft detail — one flick = one panel, no JS wheel hijack. See `src/components/case-studies/use-case-study-deck.ts`, the scroll-pin path in `vignette-chapter.tsx`, and the `[data-scroll-pin]` rules in `globals.css`.
