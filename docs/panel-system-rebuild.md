# Panel & Gesture System — Rebuild Spec

**Status:** Engineering brief for a clean rebuild. Hand this to Claude Code running in the repo.
**Audience:** The implementing agent + Victor.
**Goal:** Replace five ad-hoc scroll/snap engines with one purpose-built panel deck that owns sizing, snapping, active-index, and gesture binding — and that finally works on mobile, including horizontal sections.

---

## 0. How to use this document

Work top-to-bottom. Sections 1–2 are the diagnosis (read once). Sections 3–8 are the target design (the contract you build to). Section 9 is the staged migration with acceptance tests — **do not skip the acceptance tests; they are the definition of done.** Section 10 is the file inventory. Section 11 lists the few decisions still open for Victor — surface those before building the affected part, don't guess.

Throughout, file references use `path:line` from the current codebase so you can find the existing behavior before replacing it.

A non-negotiable for this rebuild: **one mechanism, parameterized — never a new engine per route.** The entire class of bugs below exists because each route grew its own copy.

---

## 1. Design intent (the spec the system must satisfy)

From the product owner, formalized:

1. **Aesthetic:** neo-Swiss-brutalist. Type-as-form, whitespace, strong visible grid, color blocks. The grid is already tokenized (`--grid-columns` 6 mobile / 12 desktop, `globals.css:62,118`). Panels must align to it.
2. **Mobile-first, 9×16 portrait.** Design assets are authored portrait. The panel system must treat mobile as the primary target, not a desktop afterthought.
3. **Narrative sequence.** Many pages are meant to be experienced in order; panels unfold a story (craft vignettes, homepage spark, case studies). Sequence and direction are content decisions and must be declarable per section.
4. **Vertical swipe is the universal input.** The user always swipes vertically to advance. Internally that vertical intent is sometimes bound to vertical motion and sometimes to horizontal motion. **The input gesture stays constant; the visual axis is what changes.**
5. **Panels are the unit of layout.** A panel is one of exactly three size classes:
   - **FULLSCREEN** — full width, full usable height.
   - **BAND** — full width, partial height.
   - **COLUMN** — partial width, full usable height.
   - *(Never partial width AND partial height. This constraint is load-bearing — it makes sizing enumerable. Keep it.)*
6. **Dot menu = visual TOC + jump nav.** A user can break the linear narrative and jump to any panel. The dot rail must reflect the true active panel and drive jumps through the same deck state.
7. **Craft index is non-linear.** It has no narrative spine; it is free browse (masonry). It is explicitly *exempt* from the deck's snapping/sequence rules.
8. **Mobile horizontal sections allow bi-axial swipe.** On desktop, a section advances in one axis only. On mobile, sections whose visual axis is horizontal may be advanced by either a horizontal OR a vertical swipe (gestural ergonomics). All sizing and snapping rules are otherwise identical to desktop.

---

## 2. Audit — what's wrong today

### 2.1 Five parallel engines, zero shared core

| Engine | File | Mechanism | Snap |
|---|---|---|---|
| Home hero | `home-scroll.tsx` | document CSS scroll-snap + JS rAF reader | native, anchor `chromeAnchorY()+8` (`:118`) |
| Case-studies index | `case-studies-scroll.tsx` | document CSS scroll-snap + JS reader | native |
| Case-study detail | `case-study-detail-scroll.tsx` | document CSS scroll-snap + JS reader + **JS "nudge" hack** (`SNAP_NUDGE_THRESHOLD_PX=56`, `:34`) | native, patched |
| Vignette chapter (horizontal) | `vignette-chapter.tsx` | pinned stage + `translateX`, `wheel`→x | JS transform snap (`SNAP_IDLE_MS=90`, `:25`) |
| Craft carousel (horizontal) | `vignette-carousel.tsx` | track `translateX`, own pointer/swipe | JS index step (`STEP_LOCK_MS=480`, `:17`) |

Each reimplements: usable-height math, snap, active-index detection, and chrome-surface syncing. They disagree in detail, which is why behavior is inconsistent across routes. **This is the root cause; everything below is a symptom.**

### 2.2 No single source of truth for usable panel height

`globals.css` mixes `100vh`, `100dvh`, and `100svh` (e.g. `:523,908-909,988-990,3681-3688`). Panel heights are recomputed per section with bespoke arithmetic, e.g. `calc(100dvh - var(--home-cover-peek) - var(--chrome-top-offset))` (`:675,682-697`). There is an explicit surrender comment at `:679`:

> `/* Explicit height — variable alone can resolve to the desktop 80dvh band on some builds */`

That comment is the tell: the agent was fighting cascade/unit resolution instead of owning one value.

### 2.3 `dvh` is the wrong unit for snap targets on mobile

`dvh` tracks the *dynamic* viewport — it grows/shrinks as the mobile URL bar collapses and expands. Every panel sized in `dvh` therefore **resizes mid-scroll**, which moves every downstream snap position. This is the reported "rests a bit off, too far up/down" defect. Snap geometry must be computed against a **stable** height.

### 2.4 The height math contradicts the chrome's own behavior

`ChromeScrollVisibility` (`chrome-scroll-visibility.tsx:17`) **hides the mobile top nav on scroll-down and reveals it on scroll-up.** But snap containers subtract a *fixed* `scroll-padding-top: var(--chrome-top-offset)` (`globals.css:641,937,1054`) and panels subtract a fixed `--chrome-top-offset` from their height. When the nav is hidden, both the panel size and the snap anchor are wrong by exactly the nav height. Note the detail page already opts out of hide/show (`chrome-scroll-visibility.tsx:47`) — that asymmetry is itself a smell and must be made a deliberate, uniform rule (see §6.4).

### 2.5 Horizontal sections have no mobile gesture path

`vignette-chapter.tsx` binds horizontal motion to `wheel` events only, gated on `(min-width: 768px)` (`:23, :381`). On mobile there are no `wheel` events from a touch swipe, and the `!desktop` branch of `applyLayout` (`:325`) collapses the stage to width `""`/translate 0. **So on a phone, the marquee "vertical-swipe → horizontal-scroll" binding does not exist.** This is why directing horizontal-vs-vertical on mobile is blocked — it was never wired for touch, it's not a tuning gap.

### 2.6 Snapping is patched, not controlled

Two snap philosophies coexist: native CSS scroll-snap (vertical engines) and JS transform snap (horizontal engines). Worse, snap strictness flips between breakpoints — `y mandatory` in some blocks, downgraded to `y proximity` in others (`globals.css:775,1043,1107`). The detail page's `nudgeToNearestSnap` timer (`case-study-detail-scroll.tsx:163`) exists purely because native snap doesn't land where the JS reader thinks it should — a patch on a patch, and it only runs ≥768px so mobile never gets even that correction.

### 2.7 Active-index detection uses divergent magic anchors

`+8`, `+4`, `0.88`, `anchorY()+8` appear across engines (`home-scroll.tsx:118,181,188`; `case-study-detail-scroll.tsx:90`). Because the "which panel is active" math differs from where the panel visually rests, the dot rail and chrome color can disagree with the rendered position.

### 2.8 Secondary smells (fix opportunistically)

- `nav.ts` is a deprecated re-export shim (`:1`). Remove after migration.
- `_BK/` backup content files in `src/content/_BK/` — delete.
- `.DS_Store` committed in `src/`, `src/content/` — gitignore + remove.
- `home-scroll.tsx` mutates `document.body.dataset.chromeSurface` from inside a scroll reader (`:121`) — surface ownership should be derived from the active panel's declared surface, not imperatively poked from three different engines.

---

## 3. Target architecture — overview

One primitive, **`PanelDeck`**, plus one hook, **`usePanelDeck`**, plus one height model. Every route composes panels into a deck and declares, per section, an **axis** and a **size class**. The deck owns gesture capture, snapping, active-index, and emits the active panel to the dot rail and chrome.

```
<PanelDeck config>           // owns gesture + snap + active index
  <PanelSection axis="y">    // a run of panels sharing one visual axis
    <Panel size="fullscreen" surface="dark" />
    <Panel size="band" />
  </PanelSection>
  <PanelSection axis="x" mobileBiaxial>   // pinned horizontal stage
    <Panel size="column" /> ...
  </PanelSection>
</PanelDeck>
```

Key inversion vs. today: **panels never compute their own height or snap.** They consume `--panel-h` / `--panel-band-h` and a `data-axis`. The deck is the only thing that reads the viewport.

---

## 4. The height model (build this FIRST — it unblocks everything)

### 4.1 One stable viewport variable, set in JS

Create a single tiny module that owns viewport height. It sets a CSS custom property on `:root` and never lets panels touch the viewport directly.

```ts
// src/lib/viewport-height.ts
// Sets --app-vh = stable usable viewport height in px.
// Uses visualViewport when available; falls back to documentElement.clientHeight.
// Updates on: resize, orientationchange, and visualViewport 'resize' (debounced via rAF).
// IMPORTANT: do NOT update on every URL-bar nudge — only on settled changes
// (orientation, or a delta beyond a threshold, e.g. > 40px) so snap geometry is stable.
```

Rationale: `svh` alone is correct for *size* but you still need a JS-measured number to compute snap-scroll targets precisely, and you need orientation-change re-pinning. One module owning both keeps CSS and JS in agreement. (If you prefer pure CSS for sizing, you may use `svh` for the *visual* height and keep `--app-vh` only for JS snap math — but pick one and document it; the current mix is the bug.)

### 4.2 Measured chrome insets — not guessed

```
--chrome-top-inset    // height the top nav actually occupies WHEN PINNED, measured from the element
--chrome-dots-inset   // height of the dot rail (mobile bottom rail; desktop right rail contributes 0 to height)
```

Measure these from the real DOM nodes on mount + resize (a `ResizeObserver` on the chrome elements), write them as `:root` vars. Do **not** reconstruct them from token arithmetic (`--chrome-pad*2 + --chrome-hit`) — that arithmetic is what drifts.

### 4.3 The derived panel heights (the only heights panels may use)

```css
:root {
  --panel-h:      calc(var(--app-vh) - var(--chrome-top-inset) - var(--chrome-dots-inset));
  --panel-band-h: /* a per-section fraction of --panel-h, e.g. calc(var(--panel-h) * 0.5) */;
}
```

- FULLSCREEN panel `height: var(--panel-h)`.
- BAND panel `height: var(--panel-band-h)` (fraction declared per section, not hard-coded in five places).
- COLUMN panel `height: var(--panel-h)`, width = grid-span (see §5.3).

### 4.4 Chrome-visibility contract on snap routes

Decide once, apply everywhere: **on any snapping deck route, the top nav does NOT hide on scroll.** It stays pinned so `--chrome-top-inset` is constant and snap math is stable. The detail page already does this (`chrome-scroll-visibility.tsx:47`); generalize it to all deck routes. Hide-on-scroll chrome is allowed *only* on non-deck routes (e.g. craft index, §5.5). This single rule eliminates §2.4 entirely.

> If Victor wants the nav to still auto-hide on mobile deck routes for immersion, then `--chrome-top-inset` must become 0 while hidden AND the deck must re-pin the active panel on each visibility toggle. That's more moving parts — flag as **Open Decision D1**.

---

## 5. The PanelDeck primitive

### 5.1 Data model

A deck is configured by an ordered list of panels. Each panel:

```ts
type PanelSize = "fullscreen" | "band" | "column";
type Axis = "y" | "x";

type PanelDef = {
  id: string;              // stable, used for deep-link + dot rail
  size: PanelSize;
  surface: "light" | "dark"; // drives chrome color when this panel is active
  bandFraction?: number;   // for size:"band" only
};

type SectionDef = {
  id: string;
  axis: Axis;              // visual axis for this run of panels
  mobileBiaxial?: boolean; // §6.2 — only meaningful when axis:"x"
  panels: PanelDef[];
};
```

The deck flattens sections → a global ordered panel list for the dot rail, while each `axis:"x"` section is internally a pinned sub-track.

### 5.2 `usePanelDeck` — the single hook

```ts
const deck = usePanelDeck({
  sections: SectionDef[],
  onActiveChange?: (panelId: string, index: number) => void,
});
// returns:
//   activeIndex, activeId
//   goTo(index | id, { smooth })       // used by dot rail + keyboard + deep-link
//   registerSectionEl / registerPanelEl // refs
//   axisOf(index)                        // for chrome / a11y
```

This hook is the *only* place that:
- reads scroll/gesture,
- computes active index (from snap geometry, §5.4 — one algorithm, no magic anchors),
- performs snapping,
- emits active panel to chrome + dots.

### 5.3 Sizing & grid alignment

- FULLSCREEN / BAND: `width: 100%`. BAND height from `--panel-band-h`.
- COLUMN: width is a grid span. Reuse the column-measurement approach already in `vignette-chapter.tsx:325-360` (it measures real grid cell lefts/rights from a ruler and sizes panels to N columns) — that part is *good*; lift it into the deck so all horizontal panels share it. `gridFraction()` (`vignette-chapter.tsx:46`) maps panel kind → column count; keep that mapping table but move it into config.
- All panels snap-align to the grid's left margin and to `--chrome-top-inset` (vertical) — never to raw 0.

### 5.4 Active-index — one algorithm

Replace every per-engine reader with: **active panel = the panel whose snap-start is the greatest snap position ≤ (scrollPos + topInset).** For horizontal sections, same logic on the track's translateX vs. panel offsets (the `indexAtOffset` nearest-offset method in `vignette-chapter.tsx:265` is the right idea — unify it). No `+8`/`+4`/`0.88` fudge; the inset is the measured `--chrome-top-inset`.

### 5.5 Craft index is NOT a deck

`craft-index.tsx` / `craft-masonry.tsx` render free-browse masonry. It must **not** mount `PanelDeck`, must use native document scroll, and is the one route allowed hide-on-scroll chrome. Keep it out of this system entirely; the spec's snapping rules do not apply.

---

## 6. The gesture layer (the part that's genuinely new)

This is where the "vertical swipe is universal, axis varies" intent lives. Build it as one module consumed by `usePanelDeck`.

### 6.1 Vertical sections

Use **native CSS scroll-snap** (`scroll-snap-type: y mandatory`, `scroll-snap-align: start`, `scroll-snap-stop: always`) with `scroll-padding-top: var(--chrome-top-inset)`. Do **not** add a JS "nudge". If native snap lands wrong today it's because the padding was fixed/wrong (§2.4) — fix the inset and the nudge becomes unnecessary. Keep `mandatory` consistent across breakpoints (kill the `proximity` downgrades, §2.6). JS only *reads* position for active-index; it does not drive vertical motion.

### 6.2 Horizontal sections — the pinned-stage contract

A horizontal section is a **pinned, non-scrolling stage** (sticky, height `--panel-h`) with a `translateX` track — this is `vignette-chapter.tsx`'s model and it's the correct one. The gesture contract, which today is implicit and fragile (`entryLockUntilRef`, `atEdge`, `:262,381`), must become explicit:

1. **Enter:** when the stage reaches its pinned position, the deck *captures* the vertical gesture. A brief entry lock (the existing `FOCUS_ENTRY_MS` idea, `:27`) prevents the entry fling from skipping panel 1.
2. **Consume:** while pinned and not at an edge, vertical gesture intent → horizontal `translateX`. `preventDefault` the native scroll only here.
3. **Edge release:** at the first/last panel, *stop consuming* and let native vertical scroll resume, so the narrative continues. This is the single most important behavior to get right — it's what makes "vertical swipe is universal" feel seamless. The `atEdge` check (`:262`) is the seed; make it the formal exit condition with a small release threshold so users don't get stuck.

**Inputs that must all map to "advance one panel" inside a horizontal stage:**
- `wheel` (desktop trackpad/mouse) — both `deltaY` and `deltaX` (currently only one path each engine).
- **`touchstart`/`touchmove`/`touchend` (mobile) — THE MISSING PIECE.** Implement touch from scratch here; `vignette-chapter.tsx` has none. `vignette-carousel.tsx:160-195` has usable pointer-swipe logic to borrow (threshold `SWIPE_THRESHOLD=44`), but it must be unified, not copied.
- `keydown` Arrow/Home/End (keep `vignette-chapter.tsx:233` behavior).
- Pointer drag (desktop click-drag, optional).

### 6.3 Bi-axial on mobile (intent #8) + axis-lock

When `axis:"x"` and `mobileBiaxial` and viewport is mobile: a horizontal *or* vertical swipe both advance the horizontal track. To avoid diagonal-swipe ambiguity with page scroll, implement **axis-lock**: on `touchstart`, record origin; on the first `touchmove` past a small threshold (~8px), decide the dominant axis from `abs(dx)` vs `abs(dy)` and **lock it for the remainder of the gesture**. If locked to the section's consumed direction, `preventDefault` and drive the track; if the section is at an edge, release. This prevents the panel from fighting the page and vice-versa.

### 6.4 Momentum / step-locking

Unify the three different timing constants (`STEP_LOCK_MS=480`, `SNAP_IDLE_MS=90`, `SNAP_NUDGE_MS=100`) into one tuned gesture config. One gesture = one panel advance (the `step-lock` idea from `vignette-carousel.tsx:17` is right). Expose the constants in one place for tuning.

---

## 7. Accessibility, reduced motion, orientation

- **Reduced motion:** when `prefers-reduced-motion: reduce`, the deck degrades to plain native document scroll with no gesture capture and no transform animation (home already half-does this via `home-scroll--static`, `home-scroll.tsx:345`; generalize). Horizontal sections become vertically stacked, scrollable normally.
- **Keyboard:** every panel reachable by Tab/Arrow; dot rail is a real list of buttons with `aria-current` on the active panel. Focus must move with `goTo`.
- **Orientation change / resize:** on settled resize, **re-pin to the current active panel** (recompute `--app-vh`, recompute snap targets, `goTo(activeIndex, {smooth:false})`). This is missing today and is a real mobile bug when rotating.
- **`scroll-snap-stop: always`** on every deck panel so fast flings can't skip narrative beats.

---

## 8. Deep-linking & history (currently absent — flag as Open Decision D2)

The narrative + jump-nav model implies users will want to share/return to a specific panel and use Back. Recommended: each panel `id` maps to a URL hash; `goTo` updates history (replaceState during drag, pushState on settled jump); on load, deck restores to the hash. Decide with Victor whether Back should step panel-by-panel (history-heavy) or only between routes (D2).

---

## 9. Migration plan (strangler, staged) + acceptance tests

Build the new system beside the old, migrate one route at a time, delete the old engine when its route is green. **Do not big-bang.**

**Stage 0 — Height model (§4).** Ship `viewport-height.ts` + measured chrome insets + the `--panel-h`/`--panel-band-h` tokens. Refactor *existing* panels to consume them (mechanical find/replace of the `dvh` math). 
✅ *Accept:* on iOS Safari + Chrome Android, scrolling that collapses the URL bar does **not** shift any snap rest position; panels fill the gap between pinned top nav and dot rail exactly, no sliver, no overlap.

**Stage 1 — `PanelDeck` + `usePanelDeck` (§5) on case-study detail.** It's the richest route (prose + vignette chapters) and already has the most logic to replace. Migrate it first.
✅ *Accept:* every dot maps to a panel; active dot matches the visually-resting panel within 0px of the inset; no `nudgeToNearestSnap` in the codebase; surface color flips correctly per panel.

**Stage 2 — Horizontal gesture layer (§6) incl. mobile touch + bi-axial.** Migrate vignette chapters onto the deck's pinned-stage.
✅ *Accept on a real phone:* (a) a vertical swipe inside a horizontal chapter advances exactly one panel horizontally; (b) at the last panel, the next vertical swipe releases and continues the page vertically — no stuck state; (c) a horizontal swipe also advances; (d) diagonal swipes resolve to one axis (no jitter); (e) one swipe = one panel.

**Stage 3 — Home hero + case-studies index onto the deck.** Retire `home-scroll.tsx` and `case-studies-scroll.tsx` JS readers; keep the spark/visual context wiring but feed it `activeIndex` from the deck.
✅ *Accept:* spark blend + secondary cover handoff still track the active hero panel; dots accurate; chrome surface ownership comes from active panel surface, not imperative `document.body.dataset` pokes.

**Stage 4 — Craft carousel.** Either fold `vignette-carousel.tsx` into the deck as a self-contained `axis:"x"` single-section deck, or keep it standalone but rebuilt on the shared gesture module. (Craft *index* stays out, §5.5.)
✅ *Accept:* same gesture feel as vignette chapters; no duplicated swipe constants.

**Stage 5 — Cleanup.** Delete dead engines, `nav.ts` shim, `_BK/`, `.DS_Store`; collapse the `mandatory`/`proximity` inconsistency; one tuning config for all gesture constants.
✅ *Accept:* `grep -r "100dvh\|100vh\|100svh" src` returns only the height-model module; `grep -rl "scroll-snap-type" src` shows one shared rule, not five.

**Cross-cutting test matrix (run every stage):** iOS Safari + Chrome Android + desktop Chrome/Safari/Firefox; portrait + landscape; reduced-motion on/off; with/without a hardware keyboard.

---

## 10. File inventory

**Replace / retire (logic absorbed into PanelDeck):**
- `components/sections/primary-hero/home-scroll.tsx` (reader → deck)
- `components/case-studies/case-studies-scroll.tsx`
- `components/case-studies/case-study-detail-scroll.tsx` (drop `nudgeToNearestSnap`)
- `components/craft/vignette-chapter.tsx` (keep grid-measure + FrameContent; gesture → deck)
- `components/craft/vignette-carousel.tsx` (gesture → shared module)

**New:**
- `lib/viewport-height.ts` (§4.1)
- `lib/chrome-insets.ts` (§4.2) — or fold into the chrome provider
- `components/deck/panel-deck.tsx`, `components/deck/use-panel-deck.ts`, `components/deck/gestures.ts` (§5–6)
- `lib/deck-config.ts` per-route section/panel definitions (§5.1)

**Keep (good as-is or lightly adapted):**
- `components/layout/site-grid.tsx`, `ruled-grid.tsx`, grid tokens — the grid layer is sound.
- The column-measuring logic in `vignette-chapter.tsx:325-360` — lift, don't rewrite.
- Chrome dot-rail components — repoint to deck `activeIndex`/`goTo`.
- `craft-index.tsx` / `craft-masonry.tsx` — out of scope, non-linear.

**Delete:** `lib/nav.ts`, `src/content/_BK/`, committed `.DS_Store`s.

---

## 11. Decisions (resolved by Victor 2026-06-16)

- **D1 — Mobile top-nav on deck routes: RESOLVED → auto-hide everywhere; inset is fixed clearspace. ✅ IMPLEMENTED 2026-06-16.**
  The top nav must NOT be persistently visible (it adds noise). It auto-hides on scroll on *all* deck routes. Crucially, the reserved top space stays constant whether the nav is shown or hidden, so the layout never shifts and snap geometry stays stable — the nav fades in/out *over* permanent clearspace rather than collapsing it.
  Why it's stable: `.chrome-mobile-band` has a fixed `height: var(--chrome-top-offset)` and hides via `transform: translateY(...)`, which does not change its measured box height, so `--chrome-top-inset` is constant in both states. Panels already subtract that constant inset. **No inset→0, no re-pin needed.**
  **Implemented in two places** (the opt-out was wired twice): removed the `.cs-detail` early-return in `chrome-scroll-visibility.tsx`, AND removed the `document.body.removeAttribute("data-chrome-visibility")` strip in `case-study-detail-scroll.tsx`'s pre-paint `useLayoutEffect` (it was wiping the `hidden` state on every step change). Verified: detail auto-hides on scroll-down, reveals on scroll-up, `--chrome-top-inset` constant at 84px in all states.

- **D2 — History model: RESOLVED → route-level Back only.**
  Back navigates between routes, not panel-by-panel. Panel `id`s still map to a URL hash for sharing/deep-link restore, but traversal uses `replaceState` so Back isn't flooded with per-panel entries. (Builds into Stage 1/3.)

- **D3 — BAND fraction: RESOLVED → per-section author-set. ⏸️ DEFERRED (premature) 2026-06-16.**
  Each section/band panel declares its own fraction (e.g. 40% vs 60%), default 0.5. Data model is ready: `PanelDef.bandFraction` (`deck/types.ts`) and the `--panel-band-fraction` → `--panel-band-h` chain (`globals.css:88-89`). **No code to write yet:** zero `size:"band"` panels are rendered anywhere — both deck routes use only `size:"fullscreen"`, and the deck is still an active-index hook, not a panel renderer. Wire `bandFraction` → inline `--panel-band-fraction` when panels first render through a `<Panel>` (Stage 3+).

- **D4 — Snap strictness: RESOLVED → `mandatory` everywhere. ✅ ALREADY SATISFIED 2026-06-16.**
  The single shared `mandatory` rule is in place (`globals.css:657`). The per-breakpoint `proximity`/`scroll-snap-stop: normal` downgrades the original audit flagged were already removed in the Stage 1 migration. The only remaining `proximity`/`normal` are inside `@media (prefers-reduced-motion: reduce)` blocks (`globals.css:795,799,1057,1110`) — the intentional reduced-motion degrade (§7), which D4 must **not** remove. No change needed.

- **D5 — Vignette panel widths by gridline unit. 🆕 OPEN — design decision, orthogonal to the phased deck work (raised by Victor 2026-06-16).**
  Panel widths for vignette filmstrips should be expressed in **gridlines** (the master grid columns) as the unit of measurement.
  - **Desktop:** varying widths per panel kind are correct (today's behaviour). Current mapping lives in `gridFraction()` in `vignette-chapter.tsx`: title = 4/12 cols, `16x9` = 12/12, `1x1` = 8/12, default (e.g. `9x16`) = 6/12. Keep this *intent* on desktop.
  - **Mobile:** every panel should be **virtually full width AND full height** of the usable panel area — one panel ≈ one screen. Today's code reuses the same 12-based fractions against a 6-col mobile grid (`applyLayout()` rounds `gridFraction(kind) * cols`), so on mobile a title → ~2 cols, `1x1` → ~4 cols, etc. — i.e. scaled-down panels, NOT the desired full-bleed-per-panel.
  - **Where:** `gridFraction()` + the mobile path of `applyLayout()` in `vignette-chapter.tsx` (and the grid-column ruler measurement). Height is already `--app-vh` per `.vchapter`/`.vchapter__pin`; the gap is width.
  - **Intended to be independent** of Stages 1–5. Can land on the current vignette-chapter implementation now, or fold into the deck's `§5.3` sizing later — but the desktop-varying / mobile-full split is the requirement either way. **Not yet started.**

---

## 12. The one-paragraph version (for the PR description)

> The site grew five separate scroll engines that each recompute panel height (in three different viewport units), snap position (native CSS in some, JS transforms in others), and active-panel detection (with divergent magic offsets). The result is off-by-a-bit snapping and the complete absence of touch gestures on horizontal sections. We replace all five with one `PanelDeck` primitive driven by a single stable height model (`--app-vh` + measured chrome insets → `--panel-h`), a unified gesture layer that finally implements mobile touch + bi-axial swipe with axis-lock and an explicit edge-release contract, and one active-index algorithm feeding the dot rail and chrome. Panels declare only an axis and one of three size classes; they never touch the viewport. Migrate route-by-route behind the existing UI, with on-device acceptance tests as the definition of done.

---

## 13. Known issues / QA backlog

Priority scale: **P0** = breaks a shipped route, fix now · **P1** = latent / not currently observed, fix opportunistically · **P2** = polish.

### Open

- **P1 — `width: 100vw` full-bleed keylines overflow when a classic scrollbar is present.**
  The full-bleed keyline rules (`globals.css:347,357` — `.keyline-b::after` / `.keyline-t::before`) are sized `100vw`, which includes the vertical scrollbar gutter. On any viewport with a *classic* (non-overlay) scrollbar, a tall page overflows horizontally by the scrollbar width (~15–27px), which on mobile widens the layout viewport and pushes the fixed chrome (hamburger + dot rail) off-screen.
  - **Why P1, not P0:** not reproducible where it matters today. Mobile Chrome device mode and real phones use *overlay* scrollbars (0 width), so `100vw == screen width`. Desktop shows no horizontal scrollbar in current testing (Victor confirmed 2026-06-16). It only surfaced in the local preview environment (classic scrollbars) on `/about`, where `scrollWidth == innerWidth` and zero real content elements overflowed — i.e. a pure scrollbar-gutter artifact.
  - **Elevate to P0 if:** a horizontal scrollbar/off-screen chrome is observed on any real desktop or mobile browser.
  - **Candidate fix:** scrollbar-safe full-bleed — e.g. `width: 100%` with a negative-margin bleed to the viewport edge, or `calc(100vw - (100vw - 100%))`, instead of raw `100vw`. Must preserve the edge-to-edge bleed past the grid margins (the whole point of these rules).

### Resolved (this QA pass, 2026-06-16) — see git history

- **P0 — Home hero: oversized mobile spark caused horizontal overflow** → pushed fixed chrome off-screen. Fixed by `overflow-x: clip` on `.home-spark-pin`.
- **P0 — Home hero: touch fling skipped all chapters into the secondary.** Fixed by making the handoff chapter a real snap stop (`scroll-snap-align: start; scroll-snap-stop: always`) instead of relying on a 1px anchor; also stabilized `--home-cover-peek` (`dvh` → `calc(var(--app-vh) * 0.2)`).
- **P0 — `/craft`: hero filters `grid-column: 5 / -1`** was only 2 cols on the 6-col mobile grid → chips overflowed. Fixed: full width on mobile, `5/-1` only ≥1024px.

---

## 14. Progress log (as of 2026-06-16)

Where the rebuild stands. Verification this session was via the local preview at 412px with synthetic touch — **mechanics are proven; gesture *feel* still needs real-device confirmation.**

**Stages**
- **Stage 0 — Height model: ✅ shipped.** `lib/viewport-height.ts` (`--app-vh`, URL-bar-stable), `lib/chrome-insets.ts` (measured `--chrome-top-inset`/`--chrome-dots-inset`), `--panel-h`/`--panel-band-h` tokens, booted by `components/chrome/viewport-insets.tsx`.
- **Stage 1 — Deck active-index: ✅ shipped** on case-study detail + case-studies index (`usePanelDeck` owns active-index via the §5.4 algorithm; `nudgeToNearestSnap` gone). Deck is currently an *active-index hook*, not yet a panel renderer.
- **Stage 2 — Horizontal touch gestures: ✅ implemented + verified, ⏳ pending on-device feel tuning.** `vignette-chapter.tsx` consumes `attachHorizontalGestures`. Verified: vertical + horizontal swipe drive the track, edge-release at both ends, `preventDefault` while consuming. Fixed the "one swipe → 2 panels" double-count with a **velocity-based flick** (drag-follow model #2): fast flick = one panel from the start index; slow drag = proportional snap. **Tune `FLICK_VELOCITY_PX_MS` (currently 0.4) on a real device.** Run the §9 Stage 2 acceptance tests (a–e) on-device.
- **Stage 3 (home + cs-index onto the deck, retire `home-scroll.tsx`): ⛔ not started.**
- **Stage 4 (craft carousel onto shared gesture module): ⛔ not started.**
- **Stage 5 (cleanup: delete `lib/nav.ts`, `src/content/_BK/`, committed `.DS_Store`s, dead engines; one gesture-tuning config): ⛔ not started.**

**Decisions:** D1 ✅ implemented · D2 ⏳ (lands with Stage 1/3) · D3 ⏸️ deferred (no band panels yet) · D4 ✅ already satisfied · D5 🆕 open (vignette panel widths, §11).

**Files changed this session (uncommitted):** `lib/viewport-height.ts`, `lib/chrome-insets.ts`, `components/chrome/viewport-insets.tsx`, `components/deck/*`, `app/globals.css`, `components/chrome/chrome-scroll-visibility.tsx`, `components/case-studies/case-study-detail-scroll.tsx`, `components/craft/vignette-chapter.tsx`.

**Immediate next steps:** (1) on-device test Stage 2 + tune flick velocity; (2) D5 mobile panel widths (independent); (3) Stage 3.
