# Victor Brunetti — Portfolio Vignettes
*Running capture document. Updated as vignettes are added.*

---

## SITE SYNC STATUS — updated 2026-07-06 (re-synced from live portfolio.ts)

This doc is the unabridged capture of every vignette as dictated — it doesn't get rewritten to match the site. `src/content/portfolio.ts` is the edited, consolidated, public-facing version, and it is the single most accurate record of current content, since Victor also edits it directly and via Claude Code, outside of this thread. This section tracks where the two currently stand, re-synced by reading the live file rather than assumed from memory.

**Sync convention:** when a walk conversation produces a new vignette or a firm change to an existing one, it gets (1) added/updated here in full, dictated form, and (2) ported into `portfolio.ts` in the same session. Because Claude Code also edits `portfolio.ts` directly (layout/type work, copy tweaks), this doc should periodically be re-synced *from* the live file, not assumed current from the last session alone. This pass was one of those re-syncs.

**Cruise — thesis locked, chapter restructured, some further edits made outside this thread:**

Current live order in `portfolio.ts`:
1. **Tick Tock** (prose, intro) — rewritten again since last sync, now defines TTFA and TTR by name directly in the prose ("time to first action (TTFA)... time to resolution (TTR), meaning how fast the vehicle was back in autonomous mode with the operator disconnected"). Note: TTR is now defined as *operator disconnects, back to autonomous*, not simply "vehicle moving again" — a real definitional shift worth Victor confirming is intentional. Also flag: the line "signal fidelity didn't matter much if the vehicle was still sitting there ten minutes later" reads oddly against a chapter thesis built on *seconds* mattering — worth a sanity check, may be intentional emphasis, may be a slip.
2. Bridge: "The design problem, restated" — shortened since last sync, now uses a new `variant: "statement"` field on the prose-section type (Claude Code addition, a bigger visual treatment for statement-style bridges).
3. **Reading the Scene** (lead vignette) — locked content mostly intact. Since last sync: the event-timeline beat now has real media (`Cruise_v3_c1` through `c5.jpg`, previously placeholder), the ~20% stat moved from mid-vignette to the closing beat (replacing the old plain-text "Outcome" close), and the vignette now uses a new `titleTreatment: "cover"` option (Claude Code addition) with a real cover image (`Cruise_v1_cover.jpg`).
4. Bridge: "The room around the operator" — unchanged, grounded in the real Users & Ecosystem personas.
5. **Designing the Container** — unchanged, em dashes not yet cleaned (queued, one vignette at a time).
6. **Who's Driving? — Control Handoff Visualization** — unchanged.
7. **AV Positioning Control Ring** — expanded to six beats this session: added "A second mode, built in" and "In practice," covering the breadcrumb/Sudo-solver mode hiding in the same widget (this is where the previously-cut "Drop a Pin" material actually lives, no separate callout needed). "In practice" is a placeholder pending the real testing-footage video from Victor. Position still provisional relative to items 8-10.
8. **AV State Module** — unchanged.
9. **Coordination** — unchanged.
10. **The Camera Array Redesign That Didn't Work** — unchanged, still deliberately placed after a run of wins.
11. **New Maneuver Types (Speculative)** — unchanged. *(Analyzed this session: bundling Control Ring + Spring-Loaded Splines + Alternate Intents into one "three ways to provide direct spatial input" vignette was discussed at length and reads as a strong idea, escalating from full manual control to zero manual control, but has NOT been executed. Still two separate vignettes on the live site.)*

The hero video for this case study also changed since last sync (new Vimeo ID, no poster set currently).

**Open items:**
- Confirm final order of items 7-10.
- Decide: execute the Control Ring / Spring-Loaded Splines / Alternate Intents bundle, or leave as two vignettes.
- Confirm the TTR redefinition and the "ten minutes" line in Tick Tock are intentional.
- Decide whether to fold TTFA/AHT/TiRA into Tick Tock's prose (partially done — TTFA/TTR now named, AHT/TiRA still not mentioned) or save for a stat-card visual.
- Get the real Control Ring testing video (double-parked-vehicle breadcrumb clip) for the "In practice" beat.
- Layout/visual work (stat cards, b-roll, cover treatments) continues with Claude Code; the two new type fields it introduced (`variant` on prose sections, `titleTreatment`/`keyImageSrc`/`titleCoverBlur`/`titleCoverAlpha` on vignettes) are now in the live schema.

**Google — no structural changes.** Code Yellow vignette has its "ads team carries unusual weight" setup line in place. Copy refinements still TBD.

**Pearson — complete, no changes this session.**

**McKinsey, Facebook credential entries — not yet ported to the site.**

---

## CRUISE — Tele-Operations Terminal

### Origin/Setup | Terminal v1 to v2 — Learning What Actually Mattered

**The nighttime era:**
Cruise's autonomous drives originally ran at night — empty streets, no traffic to negotiate, no police officers or emergency vehicles to manage. Terminal v1 was built for that world. The design priority was signal fidelity: get the remote operator's mental model of the scene to match ground truth as closely as possible, record everything. A reasonable design for a testing program operating under low real-world pressure.

**The inflection — scaling exposed the wrong focus:**
When the business needed to scale — real hours, real traffic, real streets, for profitability reasons — the old model was solving the wrong problem. Signal fidelity didn't matter if the vehicle was still sitting there ten seconds later. The actual constraint had changed from "is the operator's picture accurate" to "how fast can this vehicle start moving again."

**The number that reframed everything — VRE risk:**
Cruise's then-CEO, Kyle Vogt, was known for a specific framing: the risk of a Vehicle Recovery Event (VRE — a tow truck dispatched to physically retrieve a failed AV in the field) grew exponentially with every additional second a vehicle sat stuck and not moving. Time wasn't one factor among several in the Terminal's design. It was the factor.

**The counterintuitive insight — movement over optimality:**
Even if the vehicle wasn't moving in the exact optimal direction, simply moving — showing visible progress — was critical. A vehicle correcting itself imperfectly but visibly in motion read as competent and on its way. A vehicle sitting dead still, even for a few extra seconds while an operator built the "perfect" plan, read as broken — an inert two-ton lump of batteries and computers, to the rider inside and to everyone outside on the street. Progress, not perfection, was the signal that mattered.

**The resulting thesis:**
Two numbers governed the whole Terminal redesign: time to first action (how fast an operator could read a scene and issue any instruction at all) and time to resolution (how fast the vehicle was actually moving again). Nearly everything in the vignettes below — context gain, layout, coordination, new maneuver types — is in service of compressing one or both of those numbers. "Context gain" is the mechanism; time was always the stakes.

*(Resolved: comfortable naming Kyle Vogt by name/title on the public site, per Victor.)*

*(Resolved via Victor's old live case study, vbrunetti.com/case-studies/cruise, fetched 2026-07-05: the real metrics are TTFA (Time to First Action, <10s), AHT (Average Handle Time, baseline 24s, target 17s, achieved 21s ≈ 11% reduction), and TiRA (Time in Remote Assistance, baseline 2.47%, target <2%, achieved 2.24% ≈ 7% reduction). The "3 seconds" in New Maneuver Types and the earlier speculative "20 seconds" were both approximations; these three named, numbered metrics are the real ones. Open question: fold these into Tick Tock's prose now, or hold for a dedicated stat-card visual moment.)*

### Reference | Findings from the old live case study (vbrunetti.com/case-studies/cruise)

Fetched 2026-07-05 for context Claude was missing. Real content worth mining for future vignettes/bridges:

**Real metrics (see above):** TTFA <10s, AHT (24s → target 17s → achieved 21s), TiRA (2.47% → target <2% → achieved 2.24%). Note from the old site: TTFA couldn't be fully validated before funding was pulled, since accurate measurement required no AVTO present and ideally a passenger in the vehicle.

**"Users & Their Ecosystem"** — the old site already had a persona section, now the basis for the new "room around the operator" bridge:
- Remote Assistant Advisor (RAA): unstick the AV as fast as possible while minimizing community impact
- Customer Service (CS): serve the passenger before/during/after rides per Cruise SOPs
- Subject-Matter Expert (SME): steps in on especially hard scenes, balancing speed with enterprise risk
- Supervisor: adherence, staffing, fleet-wide response coordination, walks the floor desk to desk
- Customer: wants safe/efficient/delightful transport, engages RAAs during LEO stops and CS for trip issues

**Naming:** the redesigned Terminal was internally called **"T2."** A real quote exists from Jessica Inman, Senior Director of Operations at Cruise: *"You created something we'd talked about for years and made it a reality. 'T2' will mean nothing to folks outside of Cruise, but it was a step change for Cruise, and the industry."* Worth considering as a pull-quote somewhere in the chapter.

**Discrepancy to flag:** an earlier session instructed cutting "Drop a Pin" entirely from New Maneuver Types. The old site shows it was real, designed work with real media (DropPin.jpg, DropPin-n-Stop.jpg), described as letting the Advisor drop a pin anywhere drivable to tell the AV to "go there however it safely can." Flagging in case Victor wants to reconsider now that real assets are known to exist, otherwise leaving cut as previously instructed.

**Also present on the old site, not yet captured anywhere else:** a "current-state ecosystem" friction diagram, five named design principles (Color Theory, Uniform Connectedness, Hick's Law, Iconic Representation, Proximity) each mapped to a specific Terminal flaw, and a "Final Designs" filmstrip naming specific scenarios (Nominal Driving, Pivot Maneuver, Stop Point Lifting, EMV Yielding, LEO Pullover, Collision Response) that could seed future vignettes or media captions.

---

### Vignette 1 | Semantic Color + Shape Language for AV Scene Visualization

**The problem:**
Remote operators viewed the AV scene entirely in orange-on-black. Every object type — pedestrians, cyclists, vehicles, immovable objects — rendered identically. This wasn't accidental; it was guided by human factors researchers drawing on radar and air traffic control tradition (orange on black = high contrast, safe for eyes in dark environments, BMW gauge logic, etc.). The research was legitimate. But it meant all objects in the scene were visually equivalent.

**The insight:**
The system was informed by human factors science but not by color theory or semantic design thinking. Meanwhile, the AV's AI could already classify everything it perceived — it knew a pedestrian from a cyclist from a parked car. That intelligence existed in the system but wasn't being surfaced to the operator. The machine knew. The human didn't.

**The solution:**
Designed a universal color language + improved shape language to represent different radar/lidar footprints by object type. Pedestrians, cyclists, vehicles, static objects — each got a distinct color and shape encoding, making the semantic meaning of the scene immediately legible to operators.

**Outcome:**
Operators could gain context about the scene faster and more accurately. Part of a broader "context gain" design philosophy across the Cruise terminal work.

**Theme:** Context gain / semantic legibility / color as meaning

---

### Vignette 2 | Visualizing Vehicle Intent on the Projected Path

**The problem:**
The AV is non-deterministic — a true ML ranker refreshing its decision-making potentially hundreds of times per second. It could change its mind at any moment, for any reason, without communicating that to the operator. The projected path line showing where the vehicle planned to drive was generic, one color, unspecified. Operators described the experience as a black box: "the vehicle could do anything at any time for any reason." Research confirmed this was actively hurting their ability to intervene effectively.

**The constraint:**
We couldn't guarantee decision persistence — we couldn't show the operator a guaranteed route or a binding set of future intentions. But we could surface something meaningful: planned speed changes and planned stop points.

**The insight:**
If the vehicle was planning to slow down, it was probably planning to stop. If it was planning to accelerate, it was probably planning to move through. Even this coarse signal — stop or go, faster or slower — was dramatically more useful than nothing. We also knew roughly *where* the vehicle intended to stop, even if the exact point wasn't certain (stop zones vs. stop points).

**The solution:**
Color-coded the projected path (red/green) to show planned stops, stop zones, and speed deltas. Simple, readable, actionable. Also added the ability for operators to override stop points — e.g., when a police officer was waving the vehicle through a stop it would otherwise respect.

**Outcome:**
Operators had a legible model of vehicle intent without being overwhelmed by the full complexity of the AV's decision-making process.

**Theme:** Context gain / vehicle intent legibility / minimum viable signal

---

### Vignette 3 | Event Timeline + "What Is the Vehicle Dealing With" Panel

**The problem:**
When operators connected to a vehicle, they were context-blind. They didn't know what had happened in the moments before they took over — what the previous operator had done, what the vehicle had tried autonomously, or why the car was stopped. Sometimes they were the third or fourth operator to touch a situation. They had to parse cameras and maps from scratch every time.

**The cold start problem:**
This wasn't a minor inconvenience. In a safety-critical system, an operator connecting without context could take the wrong action — or waste critical seconds reconstructing a situation that was already well-understood by the previous operator.

**The solution:**
Built two connected pieces of UI:

1. **A coarse-grained event timeline** — a lightweight log pulling from vehicle event APIs that were already exposed but not being rendered. Surfaced key moments: stops, collisions, operator overrides, course changes. Gave the incoming operator a readable history of what the vehicle had been through.

2. **A "What is the vehicle currently dealing with" panel** — big icons, color-coded, with timers showing how long each condition had been active. If the vehicle had been in a collision state for 8 minutes, you could see that at a glance. Also surfaced sequential steps to resolve the vehicle's current state (e.g., clear collision → confirm all clear → return to autonomous mode → send go).

**Outcome:**
What previously required a verbal debrief between operators — or an educated guess — became a 5-second visual scan. Operators arrived in context, not blind.

**Theme:** Context gain / situational awareness / operator handoff / cold start

---

### Vignette 4 | The Camera Array Redesign That Didn't Work

**The inspiration:**
Caught a glimpse of what appeared to be a Waymo tele-operations interface in a promotional video. Their camera array looked like a single, clean horizontal filmstrip that seemed to scroll or shift based on the area of interest. Compared to our T-shaped array — a forward-facing strip on top, a smaller rear-facing strip below, creating an awkward layout that fought with the map area — it looked elegant, responsive, and spatially smart.

**The hypothesis:**
If we replaced the T-shape with a single scrollable filmstrip that could automatically center the area of interest, we could:
- Clean up the overall layout and responsiveness
- Create a better spatial correlation between the map (bird's eye) and the cameras (ground level) — if something important was happening on the right side of the car, the right camera would shift to center

**The pushback:**
Human factors researchers were appalled. Their position — and they were correct — was that operators in safety-critical environments need spatial muscle memory. Left is left. Right is right. Always. The existing system had a hard-won and carefully designed convention: the car always pointed up on the map, and the camera array always reflected that fixed orientation. Operators could find forward, side, and rear cameras without thinking.

**The test:**
Built motion prototypes in Figma. Added visual aids — lines emanating from the car on the map, matched to lines on the camera array. Explored hotkeys for glancing left or right. Tested with operators on non-live simulations.

**The result:**
It performed poorly. The scrolling introduced spatial disorientation. The muscle memory disruption was real and measurable. The T-shape stayed.

**What was learned:**
Elegance is not always correct. A design that looks cleaner can be cognitively more dangerous. The T-shape was awkward for layout reasons but it was a trusted spatial anchor for operators under stress. Pushing on it was the right instinct — understanding *why* it needed to stay was the right outcome.

**Theme:** Craft humility / safety-critical constraints / when HF research beats design intuition

---

### Vignette 5 | Predictable UI Regions (Bentable Box Model)

**The problem:**
The previous version of the terminal was built around a human factors principle: put the most important thing in the center of the screen. In theory, sound. In practice, the "most important thing" could be anything — a maneuver control, an object classification, a workflow dialog for clearing a collision. The center of the screen became a wildcard. Predictable in terms of where to look, but completely unpredictable in terms of what you'd find there.

**The result:**
Operators had to read and classify UI elements before they could act on them. The information hierarchy was scrambled. Even if you knew to look in the center, you still had to spend cognitive cycles figuring out what kind of thing you were looking at.

**The solution:**
Restructured the terminal around a bentable box model — a stable layout where content types lived in predictable regions. Controls here. Status there. Workflows in a defined place. And critically: the centerline was intentionally kept clear. No UI buttons, no panels, no chrome competing with the most important content — which was the vehicle itself, the cameras, and the map.

**The principle:**
Knowing *where to look* for a certain type of information — before you even read it — is itself a form of speed. We were trading the HF team's "importance-based centering" for "type-based regionalization," which gave operators faster cognitive access to the right tool at the right moment.

**Theme:** IA clarity / cognitive load reduction / layout as cognitive aid

---

### Vignette 6 | AV Positioning Control Ring

**The old design:**
A plain rectangle representing the vehicle — no indication of front vs. back. A small, nondescript icon hovering above it that, if you clicked and dragged, would spin the vehicle. Problems:
- No visual indicator of the vehicle's starting orientation
- No feedback on how far you were rotating
- No kinematic feasibility boundaries — you could attempt a pose the car physically couldn't reach in one move given its turn radius or obstacle proximity
- The hit state for the spin icon was tiny and difficult to acquire
- The vehicle rectangle gave no affordance for drag-to-position

**The redesign:**
- Vehicle widget with clear front/back directionality (you knew which end was which)
- A generous circular grab-ring around the vehicle — large, easy to acquire, affording both drag-to-position and rotate in a single interaction
- Kinematic feasibility boundaries visualized — operators could see which poses were reachable from the current position
- Pre-send validation — if a commanded pose was infeasible given kinematic or obstacle constraints, the system flagged it before sending, eliminating an entire class of operator/AV back-and-forth

**The deeper insight:**
Operators were sending infeasible commands regularly, not because they were careless but because the interface gave them no way to know what was feasible. Every infeasible command created a round-trip: operator sends → AV rejects → operator tries again. The redesign encoded real-world physics into the interface and moved that validation upstream. Fewer round trips. Faster operations. Less operator frustration.

**Theme:** Interaction craft / command validation / physics-informed design

---

### Vignette 7 | Control Handoff Visualization

**The context:**
The AV could be in one of several control states: fully autonomous, remotely operated by an operator, human-driven (safety driver in seat), or failed. These states were communicated via the color of the AV icon — a simple, functional color language.

**The problem:**
Switching control states required the vehicle to come to a complete stop. The handoff had to be authorized, the vehicle had to halt, the new control entity had to take over. This was safe but slow — and in a commercial robotaxi operation, unnecessary stops are costly and disruptive.

**The insight:**
If we could visualize *where* the control handoff would happen on the vehicle's forward path, we could pre-authorize that switch. The vehicle wouldn't need to stop — it could approach the handoff point already knowing what was about to happen, with the operator's authorization already in place.

**The solution:**
Designed the forward path spline as a double line:
- The outer, wider line matched the AV's current control state color
- The inner stripe was a gradient that grew from nothing into the full color of the incoming control entity, anchored to a waypoint marker on the path
- As the AV approached the waypoint, the colors intensified and animations triggered — a visual countdown that prepared the operator for what was about to happen

**Outcome:**
Control handoffs could be pre-authorized without stopping the vehicle. The visualization made the transition legible enough that operators trusted it. The car stayed in motion.

**Theme:** State legibility / handoff smoothness / animation as communication / design enabling operational efficiency

---

### Vignette 8 | Workflow Streamlining + Sidebar Card Rail

**The before state:**
Tele-operators were managing vehicle events by juggling tabs, Slack, Google Sheets, and Google Meet simultaneously. Tele-operations and customer service teams were literally in adjacent rooms at the Phoenix operations site — separated by a wall — and were not coordinating. They weren't on a first-name basis. They didn't know they could walk over and talk to each other. Coordination between the two teams simply wasn't happening.

**The scope:**
This vignette is part of a broader 4-hour workflow streamlining initiative that itself birthed multiple sub-initiatives. The coordination problem was one of them. Other operations staff in the loop: vehicle recovery teams, security, customer support, tele-operators.

**The design principle:**
Automate first. If automation can handle it, that's the easy button — remove the human from the loop entirely. Whatever remains and requires human intervention gets condensed and surfaced inside the terminal itself. No tab-switching. No Slack. No Sheets. Everything the operator needs, in one window, in the right moment.

**The solution — sidebar card rail:**
Workflows requiring human action appeared as cards in a sidebar rail within the terminal. Cards could contain text, rich media, or interactive controls depending on the scenario:
- **Vehicle recovery dispatched:** A map showing the recovery team's live position
- **Stowaway concern:** A live stream of the interior cabin camera fed directly into the card
- **Critical actions surfaced inline:** Close doors, fail the vehicle, trigger physical security — all accessible from the card without leaving context

**The showcase scenario — police pullover:**
The police pullover workflow was the most complex and the best demonstration of the system's power. When a vehicle was pulled over, an operator had to manage simultaneously:
- Passenger notification (inform them what's happening and why)
- Exterior voice comms (speak to the officer through the vehicle's external speakers)
- Safety override controls (the AV stops automatically when it detects emergency flashing lights — this needed to be overrideable in the right circumstances)
- Vehicle movement control (potentially allowing the vehicle to pull forward even with the officer still behind it)
- Telephony channel management (operator-to-passenger, operator-to-officer, potentially both)

The insight: none of these things were new. Telephony existed. Vehicle controls existed. Safety overrides existed. The bento box layout existed. The innovation was **orchestrating all of them into a single guided workflow** — a card that walked the operator through the scenario step by step, surfacing exactly the right controls at the right moment, in the right order.

**Artifacts:**
- Full Figma frame-by-frame walkthrough of the police pullover workflow
- Loom video of Victor demoing the flow to the internal team
- Potentially: video capture of the partially-built terminal before Cruise shut down (to be confirmed)

**Shipping status:**
Shipped in a partially-built, janky form before Cruise shut down. The polished vision exists in Figma.

**Theme:** Coordination design / workflow consolidation / automation-first / sum of parts greater than whole

### Vignette 9 | AV State Module

**The old design:**
Vehicle state was communicated via a collection of colored pills scattered across the four corners of the terminal. Following the human factors principle of centering the most important thing, the highest-priority pill would dynamically "zit" to the center of the screen while the others orbited the corners. The result: operators had to visually scan four different screen regions to understand what the car was dealing with. A pickup or drop-off might be indicated in one corner. A rerouting decision in another. A collision somewhere else entirely. Words everywhere, no coherent picture.

**The redesign:**
A persistent AV State Module — a graphic of the vehicle, fixed in the bottom left of the screen — that communicated state visually rather than textually. The vehicle graphic updated in real time to show:
- **Doors:** Open doors rendered open on the vehicle illustration
- **Lights:** Active lights shown on the vehicle
- **Passengers:** Seat indicators showing which seats were occupied, which seat the passenger was in (e.g. right rear), and whether their seatbelt was buckled — with a distinct visual state for unbuckled
- **Collisions:** Impact location shown directly on the vehicle illustration, mapped to where the sensors detected contact
- **Lidar footprints:** When the vehicle was below 15mph, the space around the module showed live lidar returns — so if someone approached or hid behind the vehicle at a stoplight, the operator could see it without switching the main display view

**Inline controls:**
The module also became a lightweight control surface for the vehicle itself — turn lights on/off, honk the horn, open an audio channel to the exterior world and speak to someone outside the car.

**What it solved:**
Three distinct problems collapsed into one module: where to move your eyes for vehicle status (fixed, bottom left — always), how to interpret that status (pictures, not words), and how to act on certain vehicle states (inline controls, no context switching). The lidar-under-15mph layer added a bonus capability the old terminal didn't have at all — proximity awareness during low-speed situations without cluttering the main view.

**Theme:** Context gain / picture over words / eye-scan reduction / peripheral awareness

---

### Vignette 10 | Telephony Service

**The hardware constraint:**
Cruise used Chevy Bolts — production vehicles retrofitted in-house, not custom-built AVs. Unlike competitors like Zoox who could design speaker arrays, exterior lighting, and scrolling marquees into a purpose-built vehicle, Cruise was working with a stock car. Communication with the outside world had to be creative within those constraints.

**The before state — and the organizational blind spot:**
Prior to this work, two separate teams handled communication:
- **Customer service** could call a passenger's phone, stream voice through the rear cabin speakers, and listen via a cabin microphone. They had the human connection.
- **Remote operators** could move the vehicle, manage the planning stack, and control every system. They had the operational control.

The business deliberately kept these roles siloed — customer service people talk to customers, operators move the vehicle. Clean division of responsibility. Except it wasn't working. Customer service was speaking to a passenger with no idea what the operator was doing — was the car moving? Stopping? Clearing a collision? And operators needed to communicate with passengers or outside parties but had no channel to do so.

**The insight:**
Through research, dogfooding, and listening to what was actually happening on the ground, the team arrived at an uncomfortable conclusion: these two roles needed to overlap. The people moving the vehicle needed to be able to speak to passengers and outside parties. The people speaking to passengers needed visibility into vehicle controls and planning. The org had drawn a clean line that the real world kept crossing.

**The solution:**
Wired full telephony into the terminal itself — not as an external tool but as a first-class feature within the operator's existing workspace. Channels covered:
- Passenger cabin (rear)
- Front interior (for a police officer or emergency responder leaning in through a rolled-down window)
- Vehicle exterior speakers (addressing someone outside the car)
- Inter-operator communications (speaking to another remote operator or customer service colleague)

**The dual-channel audio innovation:**
Operators sometimes needed to manage their own inter-team communication while simultaneously monitoring audio from the vehicle scene. The solution borrowed from 911 dispatchers and radio professionals: left ear carried operator-to-operator audio, right ear carried scene audio (interior or exterior). The ear the sound came from told you its source — no visual lookup required.

**Design grounding:**
Victor drew on prior experience designing telephony UX for Google's contact center products — call status clarity, audio energy visualization for active speakers, connection state indicators, how operators physically manage one-ear monitoring. Standard telephony UX principles applied to an entirely non-standard context.

**Theme:** Org insight / role convergence / communication design / domain experience applied to novel problem

---

### Vignette 11 | Spring-Loaded Splines (Speculative)

**The context:**
The existing human intervention control stack was designed for an earlier era of Cruise — safety drivers in seat, deterministic AV planning, engineers and operators in close coordination. By the time Cruise was running 500+ autonomous rides daily on San Francisco streets, the old model was a liability. Human interventions needed to complete in **3 seconds or less**: connect, understand the immediate cause of a blockage, issue an instruction, and get the vehicle moving again.

**The existing maneuver types — and why they fell short:**

**Pivot** — A lane preference instruction, useful for navigating around double-parked vehicles. Fell out of use as the AV got better at handling those autonomously. Operators also distrusted it: the vehicle could simply ignore the input. Non-deterministic, unreliable.

**Assisted Pathing (AP)** — Operator lays breadcrumb control points to define a path spline. Vehicle follows within approximately two car widths. Plagued by failure modes: control points too close together, kinematically infeasible positions, oncoming traffic the vehicle wouldn't assert into. Operators would spend precious seconds laying a path and the car would sit there saying "executing" while doing nothing. Non-deterministic, deeply frustrating.

**Sudo** — Fully deterministic. Operator drags, drops, and rotates a vehicle icon to the desired end-state pose. Vehicle closes the gap at under 3 m/s while the operator holds the go button. Basic collision avoidance only — otherwise it just executes. Operators loved it because it was reliable. You said where, it went there.

**The underlying pattern:** Operators only trusted what was deterministic. The more the vehicle could override human input, the less operators used or trusted that control type.

**Spring-Loaded Splines — the new type:**
An ergonomic evolution of Sudo. Instead of dragging, dropping, and rotating a vehicle icon to define an end state, the operator enters a mode where moving the mouse dynamically generates a Bezier curve spline between the vehicle's current position and the cursor's target location. The car previews the most efficient feasible path in real time. Kinematically infeasible positions are disallowed by design — the "spring-loaded" quality of the bezier curves naturally resists impossible configurations.

The friction to get an end-state command into the system dropped dramatically. For the vast majority of stuck-vehicle scenarios — back up a little, assert around something, make a small adjustment — precise pose-and-place was overkill. Spring-loaded splines handled short-distance maneuvers faster and with less cognitive load while preserving the deterministic trust operators valued in Sudo.

**Artifact status:**
Never shipped. Cruise shut down before the behaviors engineering collaboration required to implement this in the AV stack could be completed. Figma prototypes exist.

**Theme:** Interaction craft / ergonomic evolution of a trusted paradigm / determinism as trust signal / 3-second intervention constraint

---

### Vignette 12 | Alternate Intents (Speculative)

**The insight:**
At any moment, the AV's planning stack has already solved multiple paths forward simultaneously — it just chooses one over the others for its own reasons. Most of that solved intelligence is invisible to the operator. Alternate Intents surfaced those unchosen, already-computed paths as selectable ghost paths on the operator's map view, and allowed the operator to click one to preference it.

**Why this is different from every other maneuver type:**
Every other intervention required the operator to *tell* the vehicle what to do — specify a pose, draw a path, define an end state. Alternate Intents inverted that model. The vehicle had already done the planning work. The operator just needed to say *that one* — selecting from options the AI had already solved rather than generating a new instruction from scratch.

The key operational consequence: the vehicle doesn't need to re-solve a selected path. It's already computed. Execution can be near-immediate. No latency, no re-planning cycle, no waiting.

**When human judgment beats the AI:**
There are real scenarios where a human can perceive something the sensors can't — a hand gesture from a pedestrian, a construction worker waving the car through, a social context the ML ranker doesn't have access to. In those moments, the AV's second-best path might actually be the correct one. Alternate Intents gives the operator a way to act on that perception without overriding the vehicle's planning entirely — instead, redirecting it toward a path it had already validated.

**The design challenge — path stability:**
Paths flicker. The AV continuously re-plans, meaning ghost paths appear and disappear as the scene changes. An operator can't reliably click a path that might vanish in half a second. Controls were needed to only expose paths that met a stability threshold — held long enough to be trustworthy — and to scope the tool to conditions where stable alternates were more likely.

**Artifact status:**
Never shipped. Cruise shut down before the behaviors engineering collaboration required to implement this in the AV stack could be completed. Figma prototypes exist.

**Theme:** Human-AI collaboration / surfacing latent machine intelligence / context gain at the control layer / speculative systems thinking

---

### Vignette 13 | Maneuver Controls UI

**The constraint:**
The human factors team had a sound principle: keep the upper half of the screen — the operator's threat cone — completely free of UI. The vehicle always points up, center screen. Anything on an intercept vector with a moving vehicle appears in the front-left or front-right quadrants. That visual real estate belongs to the scene, not to chrome.

Everything else had to live in the lower half of the screen, where rear and side context matters less for a vehicle in forward motion.

**What the HF team built:**
Maneuver controls tucked into a fly-out drawer, triggered by a small icon in the far bottom-right corner of the screen. Hidden by default. Hard to see. Requiring a click or hover to open, then a secondary selection to choose a maneuver type.

**The problem:**
Operators connecting to a stuck vehicle have no prior situational awareness. They need to read the scene, identify the cause of the blockage, choose the right maneuver type, and engage it — all within the 3-second intervention target. Navigating eyes to the far bottom-right corner, opening a drawer, and fumbling through a menu could easily cost a full second. In this context, that's critical time.

**The solution:**
A floating toolbar anchored at the bottom center of the screen, permanently visible, with maneuver types represented by clear iconography with supporting color and shape language. Maneuver types also bound to keyboard hotkeys — so an experienced operator could trigger a maneuver without moving their eyes from the scene at all.

Yes, the floating bar covered some rear map context. But operators had rear-facing cameras to cover that zone, and vehicles approaching from behind weren't the highest safety threat profile. The tradeoff was defensible.

**The most important insight — and the one that reframes the whole terminal:**
Cruise's remote operators were not trained specialists. They were not air traffic controllers, not engineers, not safety professionals. They were regular people — many coming from food service, retail, or other hourly work — making a little above minimum wage. They played video games. They used iPhones. They came in expecting consumer interaction paradigms, not enterprise mission-critical systems.

A floating action toolbar at the bottom of the screen with hotkey support is a video game pattern. It's a pattern these operators already knew in their hands. Meeting them there — rather than forcing them to learn an enterprise UI mental model they'd never encountered — was the correct design decision. The 3-second target wasn't just a product requirement. It was only achievable if the interface spoke the user's native language.

**Theme:** User reality / consumer patterns in safety-critical context / speed of access / designing for who actually shows up

---

## GOOGLE

### Vignette 14 | Google Store — Clover POS App (Light Entry)

**The scope:**
Full Android app redesign running on Clover Flex handheld devices for Google's physical retail store locations. The app handled the complete retail workflow: inventory lookup, runner requests from back-of-house, SKU scanning, sales processing, promotions, returns, phone trade-ins, and BOPIS (buy online, pick up in store).

**The systems layer:**
The app wasn't just a point-of-sale tool — it was the coordination surface for multiple store roles simultaneously: retail sales associates on the floor, runners in the back, back-of-house operations, and the repair team. Single app, multiple user roles, orchestrated workflows.

**The senior move:**
Rather than designing everything from scratch, partnered with the Google Store web team to identify and repurpose existing design assets — product configuration flows, product detail patterns, cart logic. Where the contexts diverged (mobile native vs. mobile responsive, sales rep vs. general public), modifications were made. Where they didn't, existing solutions were reused. Knowing when to build vs. borrow — and having the cross-team relationships to make borrowing work — is the craft story here.

**Primary artifact:** Full Figma prototype tap-through video demonstrating the complete app flow.

**Theme:** Role orchestration / systems design / knowing when not to redesign

---

### Vignette 15 | Google Shopping Ads — Funnel-Aware Ad Formats

**The strategic insight:**
All shopping ads looked identical — the same rectangular tiles regardless of whether someone was idly browsing or ready to buy. The opportunity: serve a different ad format depending on where the user was in their shopping journey.

**The privacy constraint:**
Google had extensive user signals available — browsing history, cookies, profile data. The team deliberately chose not to use them. Funnel stage would be inferred from the query itself, and nothing else. This was both a privacy-respecting choice and a technical constraint — and it's increasingly relevant in a post-cookie world.

**The three funnel stages — inferred from query linguistics:**

*Browsy* — Exploratory queries with no brand or model specified. ("Show me fall fashion trends for men.") User is upper funnel, open to discovery.

*Researchy* — Comparison queries with a defined category but no committed brand. ("Best washing machines of 2023.") User knows what they want, evaluating options.

*Converty* — Specific queries with brand, model, sometimes location. ("Air Jordan size 10 near me within 3 miles.") User is ready to transact.

**The three ad formats:**

*Browsy* — Image-forward. The visual is the primary element. Additional information (price, fulfillment, merchant) revealed on hover. Designed to invite exploration, not close a sale.

*Researchy* — Tabularized presentation. Image less prominent; specs and product attributes take center stage. Critically: authoritative third-party content — Wirecutter reviews, YouTube videos — interspersed in the carousel to give users a more complete picture. The ad became a research surface, not just a product card.

*Converty* — Inventory and urgency signals dominate. Colorways, sizes, delivery windows, stock availability, pickup proximity. Less about the product image, entirely about the signals that drive an immediate conversion. "Available in your size. Pick up in-store in one hour."

**The political landscape:**
Designing inside Google's whole-page approach — where search results pages are dynamically composed, not templated — created a double bind:
- The **organic search team** worried differentiated ad formats broke whole-page visual cohesion
- The **organic shopping team** worried formats that looked too similar to their results confused users about what was an ad vs. organic content

**Threading the needle:**
Adopted the organic shopping team's existing visual design language for the tiles themselves — same square/portrait proportions, same price/fulfillment/merchant signal patterns. Differentiation came from the carousel container and explicit labeling ("Shopping Ads") rather than from the tile design itself. Users could tell they were looking at ads without the individual tiles needing to scream it.

**Proposed but unshipped:**
Richer hover states with advertiser brand bumpers — short video or logo animation interspersed between product images — to give the paying advertiser (e.g. Foot Locker) brand visibility alongside the product brand (Nike). Also proposed dual logo treatment on the card itself, with mitigation strategies for competing visual identities.

**Theme:** Funnel-stage design / query intelligence / privacy-safe personalization / navigating competing org stakeholders

---

### Vignette 16 | Google Contact Center — Software Telephone Redesign

**The before state:**
A basic phone dialer. Animated GIFs exist showing the original state. Agents had a dial pad, call controls, and little else. Everything else — customer history, prior interactions, knowledge base, notes — lived in separate tabs or systems.

**The redesign vision:**
Transform the software telephone from a dialer into a fully contextualized agent workspace. Everything an agent needs to handle a customer interaction intelligently, surfaced in one place, without tab-switching or hunting.

**Five capability layers added:**

*Customer history* — Prior conversations with other agents or bots surfaced automatically when a call connects. Agents arrive in context, not cold.

*AI-suggested solutions* — Knowledge base articles and recommended fixes surfaced in real time based on the customer's issue as the call progresses. The agent doesn't have to search — relevant solutions come to them.

*Live transcript* — A running text version of the call in real time. Agents could read what the customer was saying when audio quality degraded or attention lapsed. Critical for non-native speakers and noisy environments.

*Bot conversation context* — If the customer had already spoken to an automated bot before reaching the agent, that full conversation was visible. Agents knew what had already been tried and what had failed.

*Omnichannel messaging* — The ability to send the customer text links, knowledge base articles, or resources mid-call without breaking the voice interaction. Phone and messaging simultaneously in one surface.

**The quality layer:**

*SLA timers* — Visual indicators during the call alerting agents if they were approaching or exceeding handle time targets.

*After Session Work (ASW) screen* — A dedicated post-call state with its own timer. When a call ended and the agent entered ASW, they received: confirmation that call logs had been successfully transferred to the CRM, an alert if anything failed so they could add notes manually, and a CSAT histogram showing their quality scores.

*Leaderboard + downtime reflection* — Between calls, agents saw a reflection surface with their quality metrics, CSAT trends, and a leaderboard. Designed to turn idle time into self-coaching time.

*Real-time sentiment tracking (concept, unshipped)* — A keyword-tracking visualization showing call sentiment as a timeline histogram during the live call — so an agent could see the conversation going south in real time and course-correct before losing the customer. Also rolled up to a daily view so agents could understand if they were having a bad day and needed to be especially careful on their next few calls.

**Ship status:**
Shipped in phases. Messaging shipped as a standalone platform. The phone dialer shipped with customer history and KB article suggestions. The grand unified vision — all capabilities in one compact footprint — never fully shipped before Victor moved on.

**Assets:** Animated GIFs of the before-state dialer exist.

**Theme:** Agent empowerment / context surfacing / AI-assisted service / quality as a design problem

---

### Vignette 17 | Google Contact Center — Chat Platform

**Why it was built separately:**
The software telephone was handling a high volume of calls. At that scale, one destabilizing change cascades into a major service problem. The team's design and product philosophy on contact center tools was: don't rock the boat. Stability and maintainability came first. So when the vision called for adding messaging capability, the decision was made to build it as a standalone app rather than bolt it onto the telephone and risk breaking something critical.

**The infrastructure partnership:**
Partnered with the Google Business Messaging team to use their platform as the technical foundation — rather than building a messaging infrastructure from scratch. The design was built on top of a proven layer.

**The design:**
A full-featured chat interface familiar to anyone who's used a modern messaging app:
- Contact list on the left rail
- SLA timers and queue indicators visible throughout
- A chat rail for the active conversation
- Quick Responses (QRs) — pre-written responses mapped to keystrokes or accessible via a quick-pick menu. Common phrases ("Thank you, please allow me 2-3 minutes to look into this") bound to shortcuts so agents didn't have to type them out repeatedly

Multiple prototypes built. Vision designs developed for the full experience.

**Ship status:**
Standalone chat platform shipped and in production. Built in collaboration with another designer.

**The unshipped vision:**
The intended end state was a unified surface — the software telephone that could flip between phone mode and chat mode seamlessly within one application. An agent switching from a voice call to a messaging conversation without changing tools or context. This fusion never happened before Victor left the team, but the vision design for how the two surfaces would integrate exists as a portfolio artifact.

**Theme:** Stability-first product philosophy / omnichannel vision / platform thinking / knowing when not to integrate

---

### Vignette 18 | Google Contact Center — Code Yellow

**The trigger:**
The ads team — Google's most powerful org — escalated complaints about poor call quality in their customer support operations. The complaint reached Sundar Pichai. A code yellow was issued against Victor's contact center tools team. Exit criteria: agents rating call quality at 4.5+ on a 5-point Likert scale, validated by automated quality checks.

**The problem with the problem:**
Victor's team ran their internal telemetry. Automated MOS scores. Call routing analysis. Everything came back fine — a few minor optimizations possible for international routing, but nothing that explained the volume of complaints. When they tested Speakeasy (the software telephone) internally in Google offices, it performed well.

The diagnosis they'd been handed didn't match the evidence.

**Going to the field:**
Rather than optimizing based on bad assumptions, the team went to where the agents actually worked — India, Japan, the Philippines — to conduct ethnographic research and contextual observation. What they found was not a software problem.

**Finding 1: The offices were acoustically terrible**
Google's signature aesthetic — glass, concrete, exposed metal — makes for beautiful, photogenic workspaces. It also makes for acoustically reflective, echo-prone environments with zero sound absorption. Using a decibel meter on-site, the team measured ambient noise levels in the call centers equivalent to standing on the side of a highway. No software fix addresses that.

**Finding 2: The hardware was inadequate**
Agents had outdated headphones. In India specifically, agents were taking the foam ear pads home between shifts for sanitary reasons — leaving colleagues pressing bare plastic against their ears and straining to hear. Again: not a software problem.

**Finding 3: "Bad" meant everything**
When agents or supervisors said "the call was bad" or "Speakeasy sucks," they weren't necessarily describing audio quality. They were using it as a catch-all for bad performance, unhelpful supervisor advice, poor customer interaction, or general frustration. The signal being reported upstream was hopelessly conflated.

**The instrumentation fix:**
To separate real audio quality signal from everything else, the team added a post-call micro-survey to the After Session Work screen — a quick 1-5 rating of actual audio quality on that specific call, appearing immediately after every call ended. They cross-referenced agent ratings with automated MOS testing. When both flagged a call as bad, they had reliable signal. When they diverged, they could investigate why.

This turned agents into precision audio quality instruments and gave the team the disambiguated data they needed.

**The outcome:**
Once environmental, hardware, training, and language issues were stripped away, the software telephone's actual audio quality met or exceeded industry standard. The team exited the code yellow.

**The downstream fixes — broader than software:**
The research findings rippled well beyond the product team:
- **Facilities (REWS):** Updated the playbook for standing up call centers — acoustic paneling, plants, cubicle dividers. The next Google call center would be built differently
- **Hardware/IT:** Upgraded agent headphones to models with non-removable ear pads. Shipped audio splitters so supervisors could plug in and listen alongside agents without pulling them off the call
- **Operational standards:** Standardized practices across Google-owned vs. vendor-operated call centers for reporting and responding to perceived call quality issues
- **Software telephone improvements:** The transcript, bot context, AI-suggested solutions, and real-time CSAT work from Vignette 15 — all of which reduced agent cognitive load and improved customer experience — also addressed the broader perception issues that had been getting conflated with audio quality

**The real insight:**
The ads team was right that something was wrong. They were wrong about what it was. The mountain they pointed at turned out to be a collection of much smaller, more solvable hills — none of which were the software telephone's fault. Getting to that answer required going to see with your own eyes rather than trusting how the problem had been framed from the top.

**Theme:** Research reframing the problem / org-wide systemic impact / CEO-level pressure / diagnosis before solution

---

---

## PEARSON (Current Role)

### Vignette 19 | Nebula Design System + AI-Native Prototyping Kit

**Starting point:**
No design system existed. Victor's stated belief: a design system is infrastructure — as fundamental as electricity. The org's existing model was old-school UX (wireframes) handed off to separate visual designers, with no systematized component library.

**Phase 1 — Conceptual direction and executive buy-in:**
Began with conceptual design work — not coloring in existing wireframes, but making deliberate strategic decisions about visual direction: density, elevation, glass effects, how new brand colors and illustrations (from a recent rebrand) translate into a coherent system. Built a presentation and sold the direction to a C-level executive — demonstrating how the system could flex across business units (not just Higher Ed), stay on-brand, support AI-native interfaces, and visually celebrate student progress. This was the first step in redefining the role itself — from "visual design person who makes things pretty" to running what is effectively a design studio function within Pearson.

**Phase 2 — Q1: Proving the pipeline**
Brought in creative technologists with a deliberately small OKR: get *something* — doesn't matter what — from Figma into Storybook, end to end. The goal was proving the Figma → Storybook → React pipeline could work at all, including navigating significant enterprise permissions and tooling friction. Achieved.

**Phase 3 — Q2: Building it out at scale**
Used Pearson Learning Studio — Pearson's cutting-edge agentic AI learning platform — as the proving ground. Worked through the full component hierarchy: atoms (buttons, dropdowns, combos, list views, steppers, cards) up through molecules to complex organisms with AI-specific components. By end of Q2, desktop coverage reached roughly 80% — by Victor's assessment, more components than Google's Material design system, and roughly 60% the breadth of mature enterprise systems like Ant Design.

**Phase 4 — Shipping as real infrastructure**
The component library shipped as an installable npm package. Engineers consume it via props and arguments — they don't re-engineer components, they implement what's delivered. This was the unlock that moved Nebula from "Figma files" to "actual code living in production."

**Phase 5 — The AI prototyping problem: solving Cursor hallucination**
With a real React component library available, the next question was: could designers prototype using natural language via Cursor, pulling from the actual Nebula package? In practice, no — not without help. Even when pointed at the Nebula npm package, Cursor would largely hallucinate: generating generic "Tailwind slop" rather than mapping the designer's intent to existing Nebula components, because it had no efficient way to search and match the package's actual contents to natural language requests.

**The unlock — two markdown files as guardrails:**
Created two markdown documents that act as rules for Cursor:
1. A **design philosophy markdown** — explicitly encoding Nebula's design theory: density principles, color theory, how modules nest within one another, how elevation works, and the reasoning behind these choices
2. A **component mapping markdown** — an explicit map of available Nebula components, instructing Cursor to check this map first before generating anything new

Together with the React component library, these markdowns became the basis of a custom Cursor skill — a slash command that spins up a new prototype. The output: interfaces that look like they were made by a designer working within the system, not generic AI output.

**The latest iteration (unproven as of this writing):**
Rather than continuing to over-engineer the written design philosophy, the next evolution is to pull "golden master" reference screens via Figma MCP — real or real-ish examples of core interface types (dashboard, e-text, learning canvas, home page) with multiple variations — and use these as pattern-matching training examples for Cursor, rather than relying purely on written theory.

**Team enablement:**
All markdowns and skills are version-controlled on GitHub. Victor runs trainings for the design team — terminal basics, git, Homebrew, Node, Cursor setup, installing the Nebula package, and spinning up a new prototype from scratch.

**The demo:**
When a designer spins up a new prototype, it launches already alive — reactive navigation that adapts to screen size, light/dark mode toggling, a working grid, and sample components already in place — demonstrating that the system is pulling live from the latest Nebula repo, with all the responsiveness and design rationale baked in from the first second.

Victor describes this as 100% demoable — capable of being shown as a sped-up video going from a blank desktop to a fully realized, on-brand application interface in seconds, using nothing but natural language.

**Theme:** Design systems as infrastructure / AI-native design workflows / executive buy-in / cross-quarter systems building / pioneering work in a still-emerging discipline

---

### Vignette 20 | Nebula Design System — Tokens (Craft Series, Part 1)

**Not a blank canvas:**
Two starting points shaped the work before a single token was defined. First, Victor's own background at Google gave him a deep, material-centric mental model for how design systems should be constructed — token theory, atomic composition, the whole stack. Second — and more usefully as a cautionary reference — Pearson already had the abandoned beginnings of a design system: poorly constructed, accessibility was "super wonky," padding and spacing were inconsistent everywhere. It was a half-built thing left to die on the vine. Between Material as an aspirational reference and the broken prior attempt as a "here's what not to do" reference, the starting point was anything but blank.

**Typography — building the baseline grid:**
Started with the typographic baseline grid, the foundation everything else aligns to. Used an open-source type-scale tool to generate a type ramp — large, bold sans-serif for headlines down through to body copy sizes — then iteratively adjusted until the ramp felt right. *(Victor to add: specific scale ratio/tool name)*

The harder, less visible work: running spikes to ensure the baseline grid aligned correctly across small/medium/large variants of buttons, chips, and form fields simultaneously. When multiple component sizes coexist on a screen, their padding and typography need to feel like they belong to the same system — that alignment work happens at the grid level, before any component is drawn.

**Typography — pragmatic font choices:**
Pearson's corporate font is Plus Jakarta Sans — but it doesn't hold up for body copy readability at smaller sizes. Rather than force brand compliance where it would hurt usability, the system uses:
- **Plus Jakarta Sans** — headlines and impact statements (where brand presence matters most)
- **Noto Sans** — body copy (optimized for readability)
- **Roboto Mono** — code snippets (best-practice convention, doesn't need to be "on brand")

The principle: spend the brand's visual equity where it's seen and felt, use proven defaults where the job is just to work.

**Color — extending a narrow brand palette into a full system:**
Pearson's brand palette is narrow — pink and purple tones, "cotton candy" in Victor's words. A functioning design system needs much more: semantic colors (red/green/amber for error/success/warning states), a full primary palette with light-to-dark chroma ramps, and a tertiary palette for data visualization, chips, and badges that need to communicate without relying on brand or semantic meaning.

Process: ran brand colors and semantic color keys through a Figma ramp-generation plugin to produce full chroma ramps — light to dark — for each. Did the same for a tertiary palette built specifically to support data viz and secondary UI elements. Every ramp went through usability and contrast testing to confirm accessibility compliance across the full range.

**Spacing and geometry:**
Spacing and corner-radius tokens built on a base-8 grid — a direct carryover from Material System fluency, chosen because it's a proven, mathematically clean foundation that scales predictably across component sizes.

**What's next in this series:** Motion tokens and more advanced token categories, atoms (starting with a flagship component), and how atoms compose into molecules and organisms.

---

### Vignette 21 | Nebula Design System — Opinionated Organisms: The Learning Loop (Craft Series, Part 2)

**The lesson from failure:**
The previous, abandoned design system hadn't just been poorly constructed — it had been poorly *adopted*. Where teams did use it, they often used it badly: components dropped onto screens with no attention to visual hierarchy, no understanding of how to nest elements into coherent higher-order structures. Victor's framing: it was like dumping a pile of Legos on a table with no instruction manual. People built whatever, and it showed.

**The decision:**
Don't just deliver primitives and hope for the best. Build buttons, form fields, progress indicators, cards, list views, tabs — the standard atomic layer every design system needs — but go further. Set expectations with product teams from the outset that Nebula would also deliver **highly opinionated higher-order organisms**, encoded directly in the React component library, not just documented as patterns to be assembled.

**The flagship organism set: The Learning Loop**
A core pedagogical pattern at Pearson: a student works through a unit — say, a chapter on particle physics — via a repeating loop: an introduction, a set of readings, an assessment, interleaved Socratic questioning, and a progress/celebration moment showing how the student did. This loop repeats throughout a course.

Rather than leave product teams to assemble this experience from individual atoms, Nebula delivers the entire sequence as a family of pre-built, high-quality organisms:
- **The front-door card** — entry point into the learning loop
- **The reading assignment card**
- **The assessment card**
- **The progress/celebration card** — visually rich, using bright brand colors and brand assets to mark achievement
- **The wrap-up card** — closes the loop

Each of these organisms is itself composed of atoms and molecules from the system — but the composition, hierarchy, and visual rhythm are fixed by design, not left to interpretation. Configurable within rails, but the rails are real. The goal: even a team with no visual design expertise produces something that looks and feels considered, because the considered version is what they're given.

**Current rollout status (as of this writing):**
Piloted on Pearson Learning Studio. As of today, the same opinionated system is beginning rollout across two additional product lines — MXL and Pearson Plus. This is the live test of durability: do these highly opinionated organism patterns hold up across different product contexts, or do they need to flex more than anticipated? Open question, actively being answered.

**Portfolio potential:**
The Learning Loop card family is a strong visual artifact — bright, brand-forward, emotionally legible (celebration moments, progress visualization). It also demonstrates composition: each card can be shown broken down into its constituent atoms and molecules, then shown assembled as a finished organism in the Storybook/React library. A genuinely craft-forward story about both visual design and systems architecture at once.

**What's next in this series:** Motion tokens, and a deeper look at a specific atom or molecule's craft decisions.

---

### Vignette 22 | Nebula AI Design Pattern Language (Craft + Strategy Series)

**The foundational challenge:**
Design a navigation and layout schema that could gracefully incorporate AI affordances — at any intensity, of any type — from any page archetype across Pearson's higher-ed learning platforms: dashboards, learning canvases, learning loops, e-texts, assignments, quizzes. Not a one-off AI feature bolted onto pages, but a system every page archetype could plug into.

**The three-tier AI affordance taxonomy:**

*Embedded AI* — Small, contextual, low-commitment. Inline markers within content that signal "AI has something to offer here" — hover or click reveals a small pop-up with a deeper dive, related content, or a personalized study path.

*Assistive AI* — A persistent chat rail, docked to the interface, available for ongoing back-and-forth without taking over the screen.

*Generative AI* — A full conversational surface, the ChatGPT/Gemini-style experience where the interaction *is* the interface.

**The navigation schema — how one placement decision cascaded into a whole architecture:**

The starting insight: a conversation with an AI assistant is *primal* — it matters to the user, in the moment, more than almost anything else on screen. Placing it in a dismissible panel on the right signals the opposite: low priority, easily closed, reminiscent of low-value "agent support" chat widgets bolted onto e-commerce sites.

That single judgment — *chat belongs on the left, treated as primary* — cascaded through the entire layout:
- If chat lives on the left, its launch affordance must also be on the left
- If the launch affordance is on the left, navigation naturally consolidates there too
- Once navigation and AI access share the left rail, there's no reason for an L-shaped frame (top bar + side rail) — everything collapses into a single left rail

**The resulting pattern:** A navigation rail with expanded and collapsed states. When the AI chatbot is active, the rail's navigation collapses into a dropdown menu, and the chatbot occupies that space — borrowing a mobile interaction grammar (a "job done" affordance) to let users persist their AI conversation while still retaining full site navigability via the dropdown.

**The search bet:**
Pearson's platforms currently have no search. If/when search is added, the plan is to place it on the left — an unconventional choice (search typically lives top-right) — because the long-term thesis is that the AI assistant eventually *replaces* the need for search entirely. Short-term unfamiliarity in service of where the product is actually headed.

**Visual language development:**

*Direction:* Bold, vibrant gradient treatment — closer to Gemini's rainbow aesthetic than ChatGPT's reserved palette or Anthropic's quirkier branding. But rather than borrow Gemini's language wholesale, the team rooted the exploration in Pearson's existing brand vocabulary — specifically the wave/ripple motifs already part of the brand toolkit. The synthesis: stars (sparkle = AI, an increasingly universal visual shorthand) combined with wave/ripple patterns (Pearson's existing brand language) — landing on a vibrant gradient that reads as bold and AI-forward while still feeling like *Pearson's* AI, not a borrowed aesthetic.

*Process:* Competitive/analogous survey across Notion, Meta, x.ai, and others to understand the visual value space. Multiple icon and gradient/pattern options developed, narrowed through internal leadership review, then validated with users.

*Naming:* Tested options including "Assistant" and "Tutor." Landed on **AI Assistant** — because Pearson's platforms serve both students and instructors, and "tutor" only makes sense from a student's perspective. One name needed to work across both roles and across the whole product family.

**The AI brand system — how it actually shows up in product:**

- **Generic sparkle icon** — the increasingly-universal "AI" marker. Used for small, simple callouts: "AI-enhanced [assignment/video/etc.]" — sparkle plus an existing icon.
- **Ownable AI Assistant icon/logo** — Pearson-specific, brandable, used consistently across all products as the face of the AI Assistant.
- **Rainbow gradient border/glow** — applied to cards or content to signal "AI lives here" or "this came from the AI Assistant." When the AI Assistant is actively "thinking" during a conversation, the gradient border animates — glowing, swirling, spinning.
- **Small AI chips** — tiny inline indicators (e.g., "Homework ✨") marking AI-enhanced content without taking up significant visual space.

These elements can be used individually or in combination — full lockup, partial, or none — depending on context, giving the system flexibility without losing a consistent "AI lives here" visual grammar across the entire product family.

**Current work in progress — the e-text squiggly underline:**
Early-stage exploration for Pearson's e-text product: where the AI has parsed the textbook content and identified opportunities for deeper engagement, a rainbow squiggly underline marks the relevant text. Hovering or clicking surfaces a modal with personalized content — a guided study path, a video, a deeper dive — tailored to that specific student rather than one-size-fits-all. This is the embedded AI tier in its most granular, content-level form, and it's actively being designed as of this writing.

**Theme:** AI-native design systems / navigation architecture as values statement / brand-rooted visual language / systemic consistency across a product family

---

### Vignette 23 | The Learning Canvas — Page Layout + Card-Based Generative AI

**The page archetype:**
The Learning Loop (Vignette 20) doesn't exist in isolation — it lives on a page paradigm called the Learning Canvas, one of the core page archetypes covered in Victor's full interaction design survey across the site. The Learning Canvas divides into three zones, left to right:

1. **Chapters / table of contents** — the navigational spine, showing where the student is within the broader unit
2. **The content stream** — where the Learning Loop itself lives: introduction, textbook snippets, AI Q&A, generated content, assessments
3. **Score and controls** — a radial progress indicator plus next/previous controls for moving through the loop

**The transition problem:**
The AI Assistant (Vignette 21) lives in a left-side sidebar. But within the Learning Canvas, generative AI content needs to appear in the *center* — the main content stream. You can't have both the sidebar assistant and a center-rail generative experience active simultaneously without it feeling like two different products stitched together. The jump from "sidebar-based AI conversation" to "AI content embedded in your reading" was jarring.

**The solution — and the tradeoff:**
Added a chat input bar at the bottom of the content stream — visually similar to the Gemini or Claude input pattern. But rather than letting AI responses generate an infinite, ever-growing feed (the default pattern for chat interfaces), content is chunked into **cards** — a stack metaphor where each new piece of content, whether from the textbook or AI-generated, is its own discrete card.

**Why cards instead of a feed:**
Student testing revealed that in long, continuously-growing feeds, students lost track of where they were — scrolling back to find earlier content became difficult. Cards solved the wayfinding problem: each piece of content is a bounded, returnable unit. There's also a secondary effect Victor noted — the card-stack metaphor has a tactile, slightly game-like quality that felt appropriate for a college-age audience, a light touch of "gameable" interaction without compromising the educational seriousness of the product.

**The honest, unresolved tension:**
When a student asks the AI Assistant a question within a card, the answer is bound to that specific card. But the *next* card in the stack might be a follow-up generated in response to that question — e.g., a student asks about ribosomes, gets an answer bound to the current card, and the next card in the stack says "since you asked about ribosomes, here's a related textbook passage." 

Victor's honest assessment: from a pure interaction design standpoint, a single continuous feed might be cleaner — the relationship between question, answer, and follow-up content would read more naturally as a conversation. But the card metaphor's wayfinding and tactile benefits came at the cost of this slightly awkward branching structure when AI responses and subsequent generated content interact across card boundaries. This remains a live design tension, not a fully resolved one.

**Portfolio value:**
A working prototype exists showing a user clicking through the Learning Canvas — chapters, card stream, AI interaction, progress tracking. Combined with the Learning Loop's visual richness (Vignette 20) and the AI pattern language (Vignette 21), this gives a complete picture: strategic framework → page archetype → granular interaction-level craft, including the parts that aren't fully solved yet.

**Theme:** Page archetype design / honest craft tension / interaction design as ongoing inquiry, not a finished artifact

---

### Connective Prose | Pearson — The Land and Expand

*This is not a craft vignette — it's connective narrative material, intended to be woven between the Pearson craft vignettes (18-22) to provide leadership and organizational context. Shorter, prose-driven, glue rather than chapter.*

Victor was hired as Visual Design Director — a title he doesn't fully believe in. His view: the distinction between "UX designer" and "visual designer" that exists at most large companies, including Pearson's prior structure (UX does wireframes, hands off to visual design), produces weaker outcomes than a full-stack model where designers own a problem end to end.

He took the role anyway, on the strength of a prior working relationship with his manager — someone he'd worked with before and recognized as a visionary, herself new to Pearson and building a new culture. From day one, Victor's stance was explicit: the title didn't matter. What mattered was building a team of builders — a team that would own the design system outright, own the quality bar, and set the standard for what modern UI and brand expression looks like across Pearson Higher Ed.

Credibility was built incrementally, not claimed. The design system redesign (Vignette 18) was the first proof point — landed and sold in to his manager's manager, a C-level executive. From there, the approach extended to people: visual designers on the team — including some previously considered underperformers — responded to Victor's leadership style and began producing strong work. Creative technologists, previously an undefined role within the org (known loosely as "prototypers"), were given a clear mission and equipped with AI tooling to build the Figma-to-Storybook pipeline (Vignette 18's Q1 proof of concept). By the end of Q2, that pipeline had produced roughly 35-45 components in Storybook — tangible evidence the model works.

The pattern across all of it: land a small proof point, use it to expand scope, use expanded scope to develop people, use developed people to deliver the next proof point. Land and expand — applied to the team's mandate, and to the team's people, simultaneously.

---

---

## McKINSEY

### Credential Entry 1 | Beyond the Pill — MS Drug Digital Ecosystem

**The hypothesis:**
If you give MS patients a digital ecosystem that supports their treatment protocol — tracking symptoms, managing their care team, staying adherent to the drug — you can increase the drug's clinical efficacy. Better digital support = measurably healthier patients. This wasn't a marketing project; it was a product design project with health outcomes as the success metric.

**The research:**
Ethnographic fieldwork with both MS patients and their doctors — understanding the lived reality of disease progression, treatment adherence, family dynamics, and the emotional weight of a relapsing condition. On the provider side: mapping the doctor's full knowledge and social graph — how they learn about new drugs, how they coordinate with nurse practitioners, and how they monitor patients between appointments to catch a relapse before it happens.

**The artifacts:**
Two standout deliverables:
1. **Patient journey books** — physically printed, richly designed narrative books telling individual patients' stories: disease progression, treatment protocol, idiosyncratic family and lifestyle needs. Created to build executive emotional connection with the patient experience, not just the business case.
2. **Provider ecosystem/social graph diagrams** — visually rich maps of a doctor's knowledge network, information sources, patient touchpoints, and the weak/strong links in the system. Where does clinical knowledge flow? Where does it break down? Where could a digital product intervene?

**The output:**
A menu of product ideas, each assessed for likely impact, handed back to the client with the explicit framing: "here are the ideas and our view on impact — committing to them and building them is your business decision to make."

**Artifact picks for portfolio:** Provider ecosystem diagram (strongest visual design artifact). Photo of the patient journey book as a physical object — a spread shot or someone holding it.

**Theme:** Design research as clinical intervention / health outcomes / executive storytelling / ethnography at scale

---

---

### Credential Entry 2 | Sprint — Differentiating a Commodity Utility

**The brief:**
Sprint was hemorrhaging money competing on price as a utility. Cell coverage was worse than competitors. Texts and data were commoditized — "dumb pipe" economics with no margin. McKinsey was brought in to restructure the business; the experience design unit was tasked with a harder question: how do you create a value proposition for a commodity?

**The approach:**
Not marketing. Not a brand refresh (that was the agency of record's lane). Product-level value adds that could genuinely differentiate the service: family data pooling, bundled app partnerships (Spotify), smart data management for gig economy workers, and a device service ecosystem — repair coordination, replacement recommendations, cross-device management — powered by a conversational AI agent. (Pre-Siri, pre-AI agents as a mainstream concept.)

**The artifact:**
Three fully produced video commercials — scripts written, actors hired, filmed and edited. Each commercial told the story of one value proposition as a lived human moment:
- A family sharing a data pool and spinning up a shared Spotify session in the living room
- An Uber driver toggling background app data access on/off during a shift
- A customer breaking a device and having a smart agent coordinate repair or replacement across their known device footprint

**Portfolio use:** Embed the three videos directly. They're the story — minimal prose needed.

**Theme:** Value creation in commodity markets / speculative product design / video as design artifact / pre-AI agent vision work

---

### Credential Entry 3 | QED — Quantified Experience Design (Co-invented)

**What it is:**
A framework co-invented with McKinsey's Advanced Journey Analytics team that infuses quantitative statistical analysis throughout the human-centered design process — not just at the beginning (segmentation) or the end (measurement), but continuously, as a design partner to qualitative thinking.

**How it works:**
First, the framework builds population models to understand customer segments — what matters most to whom, statistically. Designers then do what designers do: qualitative research, ideation, post-its, concept development. But rather than handing finished concepts to the business and hoping they land, those concepts are run back through the population models and scored — not just individually, but as a *basket* of ideas working together.

The output answers a question most design processes can't: if we need a 28% NPS improvement, which combination of ideas gets us there? One breakthrough idea might hit the target alone. A collection of smaller ideas might collectively close the gap. Either way, the client can make a commitment grounded in statistical confidence rather than intuition.

**Why it matters:**
Bridges a persistent gap between design thinking and business decision-making. Design teams produce ideas. Business teams need to know which ones to fund and in what combination. QED gave clients a framework to answer that question rigorously.

**Traction:**
Named, packaged, and sold to multiple McKinsey clients. Refined across engagements until repeatable and accurate.

**Artifact picks for portfolio:** The explanatory video (self-contained). Supporting client examples showing the population models and idea-scoring outputs.

**Theme:** Methodology invention / quantitative + qualitative synthesis / design as a business decision tool / thought leadership

---

---

## FACEBOOK

### Credential Entry | Questions & Answers — "The Quora Killer"

**The context:**
Victor joined Facebook via the acquisition of Hot Studio, where he'd been working. The cultural fit wasn't strong — East Coast team, slim pickings for product alignment, never fully embedded in the West Coast design culture. Stayed roughly 1.5-2 years. The work that's worth showing: a feature he picked up in its infancy, advanced to the conceptual and live-test phase, and that eventually shipped years later in a slightly different form. An Engadget article covers the shipped version.

**The feature:**
Users constantly left Facebook to search Google or Quora for answers to questions they could theoretically get answered by their own social graph. Facebook's Q&A infrastructure was weak. The opportunity: keep users in the ecosystem by making questions and structured answers a native part of the platform.

**The three Cs framework:**
- **Compose** — A classifier that detected question-phrasing as a user typed in the Facebook composer and surfaced a prompt: "Are you asking a question?" Accepting applied structured data tagging to that post within the knowledge graph
- **Contribute** — When friends answered, the input threshold for knowledge graph entity resolution was lowered — structured data answers (a restaurant, a dentist, a location) would snap to entities more readily than a typical comment
- **Consume** — Rendering experiments for the answer set: map view for location queries, mosaic of images, or a structured comment thread (the thread format preserved context around low-quality answers so other users could weigh them appropriately)

**Live test results:**
Ran 1% live tests — lift wasn't sufficient to push to full rollout at the time. Feature was eventually picked up, refined, and shipped by another team years later.

**Artifact picks for portfolio:** Four high-quality mobile screens spanning all three Cs. Link to the Engadget article.

**Theme:** Social graph + knowledge graph intersection / structured data design / feature development at Facebook scale

---

*— More entries to be added —*

**Queued:**
- Vitals (TBD)
