# Portfolio.ts Handoff Instructions for Claude Cowork
*Generated from a long working session in Claude Chat. These are the agreed changes to make to portfolio.ts to align the site with the current narrative strategy.*

> **Status (2026-07-05): Implemented.** The Cruise consolidation/reorder and connective tissue below are now live in `portfolio.ts`, with one adjustment — Vignettes 1 & 2 were carried into "Reading the Scene" nearly verbatim (wording + media) rather than rewritten, per Victor's call that they were already working well. See the "SITE SYNC STATUS" section at the top of `vbrunetti-portfolio-vignettes.md` for the current, ongoing status — treat that as the live tracker from here on; this file is now a historical record of the original plan.

---

## CONTEXT

Victor and Claude Chat have spent an extended session:
1. Capturing all portfolio vignettes as a rich markdown document (vbrunetti-portfolio-vignettes.md)
2. Agreeing on a consolidation and reordering strategy for the Cruise chapter
3. Refining copy for specific vignettes
4. Writing connective prose for the Cruise chapter intro

The portfolio.ts file may have drifted from these decisions. The goal of this session is to align portfolio.ts with the agreed narrative strategy below.

---

## CRUISE CHAPTER — CONSOLIDATION & REORDERING

The Cruise chapter currently has 13 vignettes. They should be consolidated into 8-9 and reordered as follows. **Do not delete content — consolidate into the target vignettes listed below.**

### New Cruise vignette order:

**1. Control Ring** (was Vignette 6)
- Lead vignette. Most tactile, most immediately legible. No domain knowledge required.
- Keep as standalone. Do not merge.

**2. Who's Driving? — Control Handoff Visualization** (was Vignette 7)
- Introduces the fundamental question: who controls the vehicle and how do you communicate that?
- Keep as standalone. Do not merge.

**3. Reading the Scene** (consolidate Vignettes 1 + 2 + 3)
- Merge: Semantic Color+Shape Language + Vehicle Intent on Projected Path + Event Timeline/"What Is the Vehicle Dealing With"
- These are all the same thesis: the machine knows things the operator can't see. Surface them.
- The "context gain" throughline lives here explicitly.
- One-click stop point lifting (lifting a stop point) belongs in this vignette — it was previously underplayed as a subordinate clause. It should be the third and climactic beat of the solution section.

**4. AV State Module** (was Vignette 9)
- Keep as standalone. Deepens "reading the scene" but moves from map to vehicle itself.
- "Pictures over words" is the craft thesis here.

**5. Designing the Container** (consolidate Vignettes 5 + 13)
- Merge: Predictable UI Regions (bentable box) + Maneuver Controls UI (floating toolbar + hotkeys)
- These are two expressions of the same idea: where things live on screen as a cognitive tool.
- The operator demographics insight (ex-retail/food service, gaming paradigms) should be the closing beat of this vignette — it reframes everything.

**6. Coordination** (consolidate Vignettes 8 + 10)
- Merge: Workflow Streamlining/Sidebar Card Rail + Telephony Service
- Both are about operators coordinating with other humans, not with the AV.
- Police pullover scenario is the showcase that ties both together.
- The "tele-ops and customer service didn't know each other existed despite being in adjacent rooms" detail should be prominent — it's the most humanly compelling line in the chapter.

**7. The Camera Array That Failed** (was Vignette 4)
- Keep as standalone. Placed deliberately after multiple successes — reads as intellectual honesty, not incompetence.
- Do not merge.

**8. New Maneuver Types** (Vignettes 11 + 12 — Spring-Loaded Splines + Alternate Intents)
- Keep as a pair but give each its own beat within the vignette.
- Drop a Pin has been cut entirely — remove if present.
- Close the chapter. Speculative, visionary, ends on ambition and unfinished work.

---

## COPY CHANGES

### Cruise Chapter Intro
Replace whatever is currently in the Cruise chapter intro with this:

```
Cruise's robotaxis weren't fully autonomous — not in the way the name might suggest. When a vehicle encountered something it couldn't resolve on its own: a double-parked truck, a construction zone, a police officer directing traffic, it would request human assistance. A Remote Operator would connect, assess the situation, and provide an instruction to get the vehicle moving again.

At small scale, this works. At the scale of a commercial robotaxi fleet operating across a city, the math gets complicated quickly. Every stuck vehicle is a clock running — on passenger patience, on operational cost, on road congestion. The business case for autonomous vehicles depends, in part, on how fast that clock can be stopped.

Our target was 20 seconds or less: from the moment a human connected to a stuck vehicle, to the moment that vehicle was moving again. That meant reading the scene, understanding the cause, selecting the right intervention, and executing it — all under significant time pressure.

The work below is about that 20 seconds. Each vignette represents one move toward making the scene faster to read, the decision faster to reach, or the instruction faster to send.
```

### Vignette 2 (Vehicle Intent on Projected Path) — "Reading the Scene" after consolidation
The solution beat for this vignette needs to be rewritten. Replace the current solution copy with:

```
We attacked the problem on three fronts. First, we color-coded the projected path (red/green) to communicate speed deltas and intent — slow, stop, go — so the path itself told a story. Second, we visualized the scene objects the vehicle was actually perceiving and responding to, so operators could see why the vehicle was behaving the way it was. Third — and most importantly for getting stuck vehicles moving again — we made stop points interactive. When a stop point appeared on the path, the operator could lift it with a single click, signaling to the vehicle that it was safe to proceed. A police officer waving the car through a stop sign. A construction worker clearing an obstruction. Whatever the case: one click, car moves.
```

The insight beat should read:
```
Even a coarse signal — stop or go, faster or slower — was dramatically more useful than nothing. And since we had speed deltas and the vehicle's perception of surrounding objects, we could build a scene that told a coherent story. So that if and when the vehicle stopped, the operator already understood why.
```

### Vignette 6 (Control Ring) — update the before-state description
Make sure the before-state includes all four failure modes:
- Plain rectangle with no front/back indicator
- Tiny nondescript spin icon (separate from the vehicle, hovering above)
- No rotation feedback / no visibility of how far you'd rotated
- No kinematic feasibility boundaries shown
- Tiny hit state

And the after-state should include:
- Vehicle with clear front/back directionality
- Generous circular grab-ring for combined drag + rotate in one gesture
- Kinematic feasibility boundaries visualized
- Pre-send validation eliminating infeasible commands
- Reduced operator/AV back-and-forth as the outcome

---

## CONNECTIVE TISSUE MOMENTS TO ADD

Between the intro prose and the first vignette, add a connective tissue beat. This should be a **media moment, not prose** — one of:
- A looping before-state video of the old terminal (operators trying to get car moving, car rejecting instructions)
- A big number card: "Target: 20 seconds or less per stuck vehicle event"
- Operations center photo (workstations, signage, atmosphere)

Between "Reading the Scene" cluster and "AV State Module," add a brief prose bridge:
```
The scene on the map was only part of the picture. The vehicle itself — its doors, its passengers, its proximity to nearby objects — told another story entirely.
```

Between "AV State Module" and "Designing the Container," add a brief prose bridge:
```
Knowing what to show operators was only half the problem. The other half was knowing where to show it — and keeping it there.
```

Between "Coordination" and "The Camera Array That Failed," add a brief prose bridge:
```
Not every idea worked. Some of the most valuable lessons came from the ones that didn't.
```

---

## GOOGLE CHAPTER — NO STRUCTURAL CHANGES YET

The Google chapter vignette order and content is currently fine. Copy refinements TBD in a future session.

One note: the Code Yellow vignette (Contact Center) should have a short setup sentence before it that establishes the power dynamic at Google — something like: *"At Google, the ads team generates the majority of revenue. When they have a problem, the rest of the company listens."* This contextualizes why a code yellow from that team carries CEO-level weight.

---

## PEARSON CHAPTER — NO STRUCTURAL CHANGES YET

Pearson chapter is complete and in good shape. No changes needed in this session.

---

## THINGS NOT TO CHANGE IN THIS SESSION

- McKinsey, Facebook credential entries — leave as-is
- Any vignette copy not explicitly called out above — leave as-is
- Site structure, navigation, layout — out of scope for this session

---

## REFERENCE FILES

The full vignette library with rich write-ups for every vignette lives in:
`vbrunetti-portfolio-vignettes.md`

If Cowork needs the full text of any vignette to inform a copy decision, reference that file.
