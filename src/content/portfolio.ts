import { palette, portraitAccents } from "@/lib/colors";

/**
 * Portfolio content model.
 *
 * Hierarchy:
 *   CaseStudy
 *     └─ sections[]  (ordered, freely interleaved)
 *          ├─ ProseSection   — original writing (heading + body)
 *          └─ CraftVignette  — key image + tags + images with captions
 *
 * A vignette belongs to exactly one case study. Craft tags are free-form
 * strings; the Craft page filter set is derived from the union of all tags
 * actually used across vignettes.
 *
 * Every gallery frame — image or Vimeo video — is either 9×16 portrait or 16×9
 * landscape. Visuals are placeholder accent fills today — swap `accent`/`src` or
 * add `vimeo` for real media without changing the shape of this model.
 */

export type AccentKey = keyof typeof palette;

/** Every portfolio frame is portrait (9×16), landscape (16×9), or square (1×1). */
export type ImageRatio = "9x16" | "16x9" | "1x1";

/** Back-compat alias — the key image uses the same ratio set. */
export type KeyImageRatio = ImageRatio;

/** Reverse-out ground for a single frame. Defaults to a seeded pseudo-random pick. */
export type FrameSurface = "light" | "dark";

/**
 * One frame in a vignette's horizontal chapter.
 *
 * A frame is either a *media* frame (image / gif via `src`, or Vimeo via `vimeo`)
 * or a *color-field* frame (`colorField: true`) where type carries the beat and
 * the accent is the ground. Either way it can hold a narrative beat: a `label`
 * (mono-caps kicker, e.g. "The problem") plus `body` prose tied to this frame.
 */
export type VignetteImage = {
  /** Portrait (9×16), landscape (16×9), or square (1×1). */
  ratio: ImageRatio;
  /** Placeholder fill until a real source is provided; also the color-field ground. */
  accent: AccentKey;
  /** Optional real image / gif source (overrides the placeholder fill). */
  src?: string;
  /** Vimeo video ID or full vimeo.com URL — renders a player instead of an image. */
  vimeo?: string;
  /** Render as a type-driven color field instead of media. */
  colorField?: boolean;
  /** Beat kicker (mono caps), e.g. "The problem". */
  label?: string;
  /** Beat narrative — prose married to this frame. */
  body?: string;
  /** Reverse-out ground; omit to let the chapter pick a random-feeling surface. */
  surface?: FrameSurface;
  caption?: string;
};

export type CraftVignette = {
  type: "vignette";
  /** Unique across the whole site — powers /craft/[vignette]. */
  slug: string;
  name: string;
  /** Portrait (9×16), landscape (16×9), or square (1×1); default key-image shape. */
  keyImageRatio: ImageRatio;
  /** Placeholder key-image fill until a real source is provided. */
  keyImageAccent: AccentKey;
  keyImageSrc?: string;
  /** Free-form, ~1–3 words each, unlimited. */
  tags: string[];
  /** Thematic line, e.g. "Context gain / semantic legibility / color as meaning". */
  themeLine?: string;
  /** Honest shipping status, e.g. "Never shipped — Figma prototypes exist". */
  status?: string;
  images: VignetteImage[];
};

export type ProseSection = {
  type: "prose";
  id: string;
  heading?: string;
  /** A paragraph or two — split on blank lines for multiple paragraphs. */
  body: string;
};

export type CaseStudySection = ProseSection | CraftVignette;

/** Optional looping MP4 behind the case study hero (Vercel Blob or CDN). */
export type CaseStudyHeroVideo = {
  src: string;
  /** Layer opacity, 0–1. Default 0.3 in the hero component. */
  opacity?: number;
  poster?: string;
};

export type CaseStudy = {
  slug: string;
  name: string;
  /** One-line deck under the hero title. */
  subhead: string;
  /** Display date, e.g. "2024" or "Mar 2024". */
  date: string;
  client: string;
  location: string;
  role: string;
  tools: string;
  /** Placeholder client logo source; falls back to a wordmark when absent. */
  clientLogo?: string;
  /**
   * Optional ambient hero reel — autoplay loop, no controls, full-bleed behind #cs-hero.
   * Upload MP4 to Vercel Blob (public), then e.g.
   * `heroVideo: { src: "https://….public.blob.vercel-storage.com/hero.mp4", opacity: 0.3 }`
   */
  heroVideo?: CaseStudyHeroVideo;
  /** Ordered mix of prose sections and craft vignettes. */
  sections: CaseStudySection[];
};

/* ── Cruise content helpers (beats + glue prose) ───────────────── */
const cruiseAccent = "charcoal" as const satisfies AccentKey;

function cruiseBeat(
  label: string,
  body: string,
  ratio: ImageRatio = "16x9",
): VignetteImage {
  return { ratio, accent: cruiseAccent, colorField: true, label, body };
}

function cruiseMedia(
  label: string,
  caption: string,
  ratio: ImageRatio = "16x9",
  src?: string,
): VignetteImage {
  return { ratio, accent: cruiseAccent, label, caption, ...(src ? { src } : {}) };
}

function cruiseVignette(
  slug: string,
  name: string,
  tags: string[],
  themeLine: string,
  images: VignetteImage[],
  keyImageRatio: ImageRatio = "16x9",
): CraftVignette {
  return {
    type: "vignette",
    slug,
    name,
    keyImageRatio,
    keyImageAccent: cruiseAccent,
    tags,
    themeLine,
    images,
  };
}

function cruiseProse(
  id: string,
  heading: string,
  body: string,
): ProseSection {
  return { type: "prose", id, heading, body };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "cruise-teleops",
    name: "Tele-Operations Terminal",
    subhead:
      "Designing the human side of an autonomous fleet — context gain over a black box.",
    date: "2023",
    client: "Cruise",
    location: "San Francisco, CA",
    role: "Lead product designer",
    tools: "Figma, motion prototyping, operator research",
    sections: [
      cruiseProse(
        "cruise-intro",
        "The terminal",
        "Cruise's remote operators were the humans in the loop of a driverless fleet — the people a stuck robotaxi phoned for help, often with seconds to act. The terminal they worked in was built on radar and air-traffic-control tradition: rigorous, safety-first, and almost entirely blind to what the machine already knew.\n\nThe through-line across this work is a single idea — context gain. The AV's AI perceived, classified, and planned constantly; very little of that intelligence reached the operator. Each vignette is one move toward closing that gap: surfacing what the system knew, in a form a human under stress could read in seconds.",
      ),
      cruiseVignette(
        "semantic-color-shape",
        "Semantic Color + Shape Language",
        ["Visual design", "Data viz", "Human factors"],
        "Context gain / semantic legibility / color as meaning",
        [
          cruiseBeat(
            "The problem",
            "Operators viewed the AV scene entirely in orange-on-black. Every object type — pedestrian, cyclist, vehicle, immovable obstacle — rendered identically. Legitimate human-factors science, but every object in the scene was visually equivalent.",
          ),
          cruiseMedia(
            "Before",
            "The legacy scene: a single orange encoding for every object type. Safe for the eyes, silent about meaning.",
            "16x9",
            "/portfolio/cruise/before-16x9.jpg",
          ),
          cruiseBeat(
            "The insight",
            "The system was informed by human factors but not by color theory or semantic design. Meanwhile the AV's AI could already classify everything it perceived. That intelligence existed — it just wasn't surfaced. The machine knew. The human didn't.",
            "1x1",
          ),
          cruiseMedia(
            "The solution",
            "A universal color + shape language: each object class gets a distinct hue and a footprint shape mapped to its radar/lidar return.",
            "1x1",
            "/portfolio/cruise/solution-1x1.jpg",
          ),
          cruiseMedia(
            "In scene",
            "Pedestrians, cyclists, vehicles, and static objects read at a glance — the semantic meaning of the scene became immediately legible.",
            "9x16",
            "/portfolio/cruise/scene-9x16.jpg",
          ),
          cruiseBeat(
            "Outcome",
            "Operators gained context about the scene faster and more accurately — the first move in a broader context-gain philosophy that shaped the rest of the terminal.",
          ),
        ],
      ),
      cruiseProse(
        "cruise-scene-legibility",
        "Making the scene speak",
        "Once you accept that the AV already knows more than it shows, the design problem shifts from \"build a better display\" to \"translate machine perception into human-readable meaning.\" Color and shape were the first vocabulary — but the same question kept resurfacing: what else was the vehicle planning, remembering, or dealing with that never made it to the glass?",
      ),
      cruiseVignette(
        "vehicle-intent-path",
        "Visualizing Vehicle Intent on the Projected Path",
        ["Data viz", "Human factors", "Interaction design"],
        "Context gain / vehicle intent legibility / minimum viable signal",
        [
          cruiseBeat(
            "The problem",
            "The AV is non-deterministic — a true ML ranker refreshing its decision-making potentially hundreds of times per second. The projected path was generic, one color, unspecified. Operators described it as a black box: the vehicle could do anything at any time for any reason.",
          ),
          cruiseBeat(
            "The constraint",
            "We couldn't guarantee decision persistence — no binding route, no guaranteed future intentions. But we could surface planned speed changes and planned stop points. If the vehicle was planning to slow down, it was probably planning to stop.",
            "1x1",
          ),
          cruiseBeat(
            "The insight",
            "Even this coarse signal — stop or go, faster or slower — was dramatically more useful than nothing. We also knew roughly where the vehicle intended to stop, even if the exact point wasn't certain.",
            "9x16",
          ),
          cruiseMedia(
            "The solution",
            "Color-coded the projected path (red/green) to show planned stops, stop zones, and speed deltas. Also added the ability for operators to override stop points — e.g., when a police officer was waving the vehicle through.",
          ),
          cruiseBeat(
            "Outcome",
            "Operators had a legible model of vehicle intent without being overwhelmed by the full complexity of the AV's decision-making process.",
          ),
        ],
      ),
      cruiseVignette(
        "event-timeline-panel",
        "Event Timeline + \"What Is the Vehicle Dealing With\" Panel",
        ["Information architecture", "Human factors", "Workflow"],
        "Context gain / situational awareness / operator handoff / cold start",
        [
          cruiseBeat(
            "The problem",
            "When operators connected to a vehicle, they were context-blind. They didn't know what had happened in the moments before they took over — what the previous operator had done, what the vehicle had tried autonomously, or why the car was stopped.",
          ),
          cruiseBeat(
            "The cold start",
            "In a safety-critical system, an operator connecting without context could take the wrong action — or waste critical seconds reconstructing a situation that was already well-understood by the previous operator.",
            "1x1",
          ),
          cruiseBeat(
            "Event timeline",
            "A coarse-grained log pulling from vehicle event APIs already exposed but not rendered. Stops, collisions, operator overrides, course changes — a readable history of what the vehicle had been through.",
            "9x16",
          ),
          cruiseMedia(
            "Dealing-with panel",
            "Big icons, color-coded, with timers showing how long each condition had been active. Also surfaced sequential steps to resolve the vehicle's current state.",
            "16x9",
          ),
          cruiseBeat(
            "Outcome",
            "What previously required a verbal debrief between operators — or an educated guess — became a 5-second visual scan. Operators arrived in context, not blind.",
          ),
        ],
      ),
      cruiseProse(
        "cruise-handoff",
        "Arriving in context",
        "Cold start wasn't a UX nicety — it was a safety variable. Every time an operator connected mid-incident, they were reconstructing a story someone else had already read. The timeline and dealing-with panel were attempts to make handoff as fast as reading a headline: what happened, what's active now, what do I do next.",
      ),
      cruiseVignette(
        "camera-array-redesign",
        "The Camera Array Redesign That Didn't Work",
        ["Research", "Human factors", "Motion prototyping"],
        "Craft humility / safety-critical constraints / when HF research beats design intuition",
        [
          cruiseBeat(
            "The inspiration",
            "A glimpse of what appeared to be a Waymo tele-ops interface — a single horizontal filmstrip that shifted based on area of interest. Compared to our T-shaped array, it looked elegant, responsive, and spatially smart.",
          ),
          cruiseMedia(
            "The hypothesis",
            "Replace the T-shape with a scrollable filmstrip that auto-centers the area of interest — cleaner layout, better spatial correlation between map and cameras.",
            "16x9",
          ),
          cruiseBeat(
            "The pushback",
            "Human factors researchers were appalled. Operators in safety-critical environments need spatial muscle memory. Left is left. Right is right. Always. The T-shape was a trusted spatial anchor under stress.",
            "1x1",
          ),
          cruiseBeat(
            "The result",
            "Motion prototypes performed poorly. Scrolling introduced spatial disorientation. The muscle memory disruption was real. The T-shape stayed — awkward for layout, correct for cognition.",
            "9x16",
          ),
          cruiseBeat(
            "What was learned",
            "Elegance is not always correct. A design that looks cleaner can be cognitively more dangerous. Pushing on the T-shape was the right instinct — understanding why it needed to stay was the right outcome.",
          ),
        ],
      ),
      cruiseVignette(
        "predictable-ui-regions",
        "Predictable UI Regions (Bentable Box Model)",
        ["Information architecture", "Layout", "Cognitive load"],
        "IA clarity / cognitive load reduction / layout as cognitive aid",
        [
          cruiseBeat(
            "The problem",
            "The previous terminal put the most important thing in the center of the screen. In practice, the center became a wildcard — a maneuver control, an object classification, a collision workflow. Predictable where to look, unpredictable what you'd find.",
          ),
          cruiseBeat(
            "The result",
            "Operators had to read and classify UI elements before they could act. Even if you knew to look in the center, you still spent cognitive cycles figuring out what kind of thing you were looking at.",
            "1x1",
          ),
          cruiseMedia(
            "The solution",
            "A bentable box model — content types in predictable regions. Controls here. Status there. Workflows in a defined place. The centerline intentionally kept clear: no chrome competing with the vehicle, cameras, and map.",
          ),
          cruiseBeat(
            "The principle",
            "Knowing where to look for a certain type of information — before you even read it — is itself a form of speed. Type-based regionalization over importance-based centering.",
            "9x16",
          ),
        ],
      ),
      cruiseProse(
        "cruise-layout",
        "Layout as a cognitive aid",
        "Human-factors tradition gave operators a rigorous center-stage for whatever mattered most in the moment. The problem was that \"what matters most\" changed faster than human attention could re-orient. Regionalizing by content type — and protecting the centerline for the scene itself — was a bet that spatial predictability beats dynamic prominence.",
      ),
      cruiseVignette(
        "av-positioning-control-ring",
        "AV Positioning Control Ring",
        ["Interaction design", "Command validation", "Physics"],
        "Interaction craft / command validation / physics-informed design",
        [
          cruiseBeat(
            "The old design",
            "A plain rectangle with no front/back indication. A tiny spin icon above it — no orientation feedback, no rotation distance, no kinematic feasibility boundaries, poor hit targets, no affordance for drag-to-position.",
          ),
          cruiseMedia(
            "The redesign",
            "Clear front/back directionality, a generous circular grab-ring for drag-and-rotate, kinematic feasibility boundaries visualized, and pre-send validation for infeasible poses.",
            "1x1",
          ),
          cruiseBeat(
            "The deeper insight",
            "Operators sent infeasible commands regularly — not from carelessness, but because the interface gave no way to know what was feasible. Every rejection created a round-trip. The redesign encoded physics upstream.",
            "9x16",
          ),
          cruiseBeat(
            "Outcome",
            "Fewer round trips. Faster operations. Less operator frustration — validation moved from the AV's rejection loop into the interface itself.",
          ),
        ],
      ),
      cruiseVignette(
        "control-handoff-visualization",
        "Control Handoff Visualization",
        ["State design", "Motion", "Operations"],
        "State legibility / handoff smoothness / animation as communication",
        [
          cruiseBeat(
            "The context",
            "The AV could be autonomous, remotely operated, human-driven, or failed — communicated via AV icon color. Switching control states required a complete stop: safe, but slow and costly in a commercial robotaxi operation.",
          ),
          cruiseBeat(
            "The insight",
            "If we could visualize where the control handoff would happen on the forward path, we could pre-authorize the switch. The vehicle wouldn't need to stop — it could approach the handoff point with authorization already in place.",
            "1x1",
          ),
          cruiseMedia(
            "The solution",
            "Forward path spline as a double line: outer line matches current control state; inner stripe gradients into the incoming entity's color, anchored to a waypoint. Colors intensify as the AV approaches — a visual countdown.",
            "16x9",
          ),
          cruiseBeat(
            "Outcome",
            "Control handoffs could be pre-authorized without stopping the vehicle. The visualization made the transition legible enough that operators trusted it. The car stayed in motion.",
            "9x16",
          ),
        ],
      ),
      cruiseProse(
        "cruise-operations",
        "Keeping the car moving",
        "Stopping is the safe default in a safety-critical stack. But unnecessary stops are expensive, disruptive, and — in a fleet context — contagious. Pre-authorizing control handoffs and visualizing intent on the path were both attempts to preserve safety while recovering operational tempo.",
      ),
      cruiseVignette(
        "workflow-sidebar-rail",
        "Workflow Streamlining + Sidebar Card Rail",
        ["Workflow", "Coordination", "Automation"],
        "Coordination design / workflow consolidation / automation-first",
        [
          cruiseBeat(
            "The before state",
            "Operators juggling tabs, Slack, Google Sheets, and Google Meet. Tele-ops and customer service in adjacent rooms at Phoenix — separated by a wall, not coordinating. Recovery, security, and support all in parallel channels.",
          ),
          cruiseBeat(
            "The principle",
            "Automate first. Whatever still requires human intervention gets condensed and surfaced inside the terminal itself. No tab-switching. Everything the operator needs, in one window, in the right moment.",
            "1x1",
          ),
          cruiseMedia(
            "Sidebar card rail",
            "Workflows requiring human action appeared as cards in a sidebar rail — text, rich media, or interactive controls depending on scenario.",
            "16x9",
          ),
          cruiseBeat(
            "Police pullover",
            "The showcase scenario: passenger notification, exterior voice comms, safety overrides, vehicle movement, and telephony channels — orchestrated into a single guided workflow surfacing the right controls in order.",
            "9x16",
          ),
          cruiseBeat(
            "Outcome",
            "Shipped in a partially-built form before Cruise shut down. The polished vision exists in Figma — the innovation was orchestration, not invention.",
          ),
        ],
      ),
      cruiseVignette(
        "av-state-module",
        "AV State Module",
        ["Visual design", "Status design", "Controls"],
        "Context gain / picture over words / eye-scan reduction",
        [
          cruiseBeat(
            "The old design",
            "Colored pills scattered across four corners. The highest-priority pill would \"zit\" to center while others orbited. Operators scanned four regions to understand what the car was dealing with — words everywhere, no coherent picture.",
          ),
          cruiseMedia(
            "The redesign",
            "A persistent AV State Module — vehicle graphic fixed bottom-left. Doors, lights, passengers, seatbelts, collisions, and lidar footprints rendered on the illustration itself.",
            "1x1",
          ),
          cruiseBeat(
            "Inline controls",
            "The module became a lightweight control surface — lights, horn, exterior audio — without leaving context. Below 15mph, live lidar returns around the module showed proximity without cluttering the main view.",
            "9x16",
          ),
          cruiseBeat(
            "Outcome",
            "Three problems collapsed into one module: where to look (fixed), how to interpret (pictures not words), how to act (inline controls). Eye-scan reduced to a single anchor.",
          ),
        ],
      ),
      cruiseProse(
        "cruise-one-window",
        "One window, many roles",
        "The terminal was never just a driving interface. It was the coordination layer for a small city of teams — recovery, security, customer service, tele-ops — who had been working in parallel tools and parallel rooms. Cards, modules, and rails were all variations on the same mandate: bring the right human into the loop at the right moment, without making them leave the scene.",
      ),
      cruiseVignette(
        "telephony-service",
        "Telephony Service",
        ["Communication design", "Org design", "Audio UX"],
        "Org insight / role convergence / communication design",
        [
          cruiseBeat(
            "The hardware constraint",
            "Cruise used Chevy Bolts — stock cars retrofitted in-house, not purpose-built AVs. Unlike Zoox, communication with the outside world had to be creative within production-vehicle limits.",
          ),
          cruiseBeat(
            "The blind spot",
            "Customer service could call passengers. Operators could move the vehicle. The business kept roles siloed — except the real world kept crossing that line. CS spoke with no idea what the operator was doing; operators had no channel to speak.",
            "1x1",
          ),
          cruiseMedia(
            "The solution",
            "Full telephony wired into the terminal — passenger cabin, front interior, exterior speakers, inter-operator channels. First-class feature, not an external tool.",
            "16x9",
          ),
          cruiseBeat(
            "Dual-channel audio",
            "Borrowed from 911 dispatch: left ear for operator-to-operator, right ear for scene audio. The ear told you the source — no visual lookup required.",
            "9x16",
          ),
          cruiseBeat(
            "Outcome",
            "Research and dogfooding confirmed what the org structure denied: the people moving the vehicle needed to speak, and the people speaking needed operational visibility.",
          ),
        ],
      ),
      cruiseProse(
        "cruise-intervention",
        "Three seconds",
        "By the time Cruise was running 500+ autonomous rides daily in San Francisco, human interventions had to complete in three seconds or less: connect, understand the blockage, issue an instruction, get moving. Everything that follows — new maneuver types, a floating toolbar, hotkeys — only makes sense against that clock.",
      ),
      cruiseVignette(
        "new-maneuver-types",
        "New Maneuver Types (Speculative)",
        ["Human-AI control", "Systems thinking", "Speculative design"],
        "Human-AI control / determinism as trust signal / speculative systems thinking",
        [
          cruiseBeat(
            "The context",
            "The old intervention stack assumed safety drivers in seat and engineers in close coordination. At fleet scale, operators only trusted what was deterministic. Pivot and Assisted Pathing were non-deterministic and fell out of use. Sudo — drag, drop, rotate, hold go — was loved because it just executed.",
          ),
          cruiseBeat(
            "Spring-loaded splines",
            "Ergonomic evolution of Sudo: mouse movement generates a Bezier spline in real time, previewing the most efficient feasible path. Infeasible positions disallowed by design. Lower friction for short-distance maneuvers.",
            "1x1",
          ),
          cruiseMedia(
            "Alternate intents",
            "Ghost paths surfacing the AV's already-computed but unchosen routes. Click to preference — near-immediate execution because the vehicle doesn't need to re-solve.",
            "16x9",
          ),
          cruiseBeat(
            "Drop a pin",
            "Reach a lat/long — any path, operator doesn't specify how. Medium-distance counterpart to splines. Drop-execute-drop-execute sequences could replace Assisted Pathing without its failure modes.",
            "9x16",
          ),
          cruiseBeat(
            "Artifact status",
            "Never shipped. Cruise shut down before behaviors engineering could implement these in the AV stack. Figma prototypes exist.",
          ),
        ],
        "1x1",
      ),
      cruiseVignette(
        "maneuver-controls-ui",
        "Maneuver Controls UI",
        ["Interaction design", "Speed of access", "User research"],
        "Consumer patterns in safety-critical context / speed of access",
        [
          cruiseBeat(
            "The constraint",
            "Human factors mandated the upper half of the screen — the threat cone — stay free of UI. The vehicle points up, center screen. Everything else lives in the lower half.",
          ),
          cruiseBeat(
            "The problem",
            "HF built maneuver controls in a fly-out drawer, far bottom-right. Hidden by default. Operators connecting to a stuck vehicle need to read the scene, choose a maneuver, and engage — within three seconds. A drawer could cost a full second.",
            "1x1",
          ),
          cruiseMedia(
            "The solution",
            "Floating toolbar at bottom center, permanently visible, clear iconography with color and shape language. Hotkeys for experienced operators — eyes stay on the scene.",
            "16x9",
          ),
          cruiseBeat(
            "The insight",
            "Cruise's remote operators weren't air traffic controllers — they were regular people from food service and retail, making a little above minimum wage. A floating action toolbar with hotkeys is a video game pattern. Meeting them there was the correct design decision.",
            "9x16",
          ),
          cruiseBeat(
            "Outcome",
            "The three-second target wasn't just a product requirement. It was only achievable if the interface spoke the user's native language.",
          ),
        ],
      ),
    ],
  },
  {
    slug: "northwind-payments",
    name: "Payments that recover themselves",
    subhead:
      "Rebuilding checkout failure as a recoverable fork — not a dead end.",
    date: "2024",
    client: "Northwind",
    location: "Remote · US & EU",
    role: "Lead product designer",
    tools: "Figma, React, Amplitude",
    clientLogo: "/portfolio/logos/northwind.svg",
    sections: [
      {
        type: "prose",
        id: "northwind-intro",
        heading: "The brief",
        body: "Northwind's checkout leaked revenue at the worst possible moment — the tap to pay. Cards bounced, sessions timed out, and customers were dropped onto a dead end with no way back.\n\nWe rebuilt the final stretch of the funnel as a recoverable flow: every failure became a fork rather than a wall, and the interface learned to hold the customer's place until the payment cleared.",
      },
      {
        type: "vignette",
        slug: "checkout-recovery",
        name: "Checkout recovery flow",
        keyImageRatio: "9x16",
        keyImageAccent: portraitAccents[0],
        tags: ["User research", "Interaction", "Web"],
        images: [
          {
            ratio: "16x9",
            accent: "neonLime",
            caption:
              "The failure state, reframed. Instead of a dead end, a declined card now opens a calm recovery sheet with the next best action pre-selected.",
          },
          { ratio: "9x16", accent: "offWhite", caption: "Retry, switch method, or save for later — three doors, no shame." },
          {
            ratio: "16x9",
            accent: "lightGray",
            vimeo: "1199955340",
            caption:
              "Recovery flow walkthrough — the sheet opens in context while the cart stays visible.",
          },
          {
            ratio: "9x16",
            accent: "charcoal",
            caption:
              "Completed-purchase rate lifted 24% in the first month after launch.",
          },
        ],
      },
      {
        type: "prose",
        id: "northwind-mid",
        heading: "Why a sheet, not a page",
        body: "A full-page error throws away context. A sheet keeps the cart, the total, and the customer's intent visible the entire time — so recovering feels like continuing, not starting over.",
      },
      {
        type: "vignette",
        slug: "express-pay-sheet",
        name: "Express pay sheet",
        keyImageRatio: "16x9",
        keyImageAccent: portraitAccents[1],
        tags: ["Interaction", "Motion", "Mobile"],
        images: [
          { ratio: "9x16", accent: "hotPink", caption: "One-thumb reach: the primary action never leaves the bottom third." },
          { ratio: "16x9", accent: "offWhite" },
          { ratio: "9x16", accent: "skyBlue", caption: "Motion confirms success before the network does — perceived speed beats actual speed." },
        ],
      },
    ],
  },
  {
    slug: "meridian-care",
    name: "Triage at the speed of a shift",
    subhead:
      "A single triage board and a handoff ritual built for the chaos of a ward.",
    date: "2024",
    client: "Meridian Health",
    location: "Boston, MA",
    role: "Product designer",
    tools: "Figma, Miro, React Native",
    clientLogo: "/portfolio/logos/meridian.svg",
    sections: [
      {
        type: "prose",
        id: "meridian-intro",
        heading: "Context",
        body: "Nurses on Meridian's floors were triaging from memory, sticky notes, and three different screens. The cost wasn't just time — it was the cognitive load of holding a whole ward in your head.\n\nWe designed a single triage board that surfaces the right patient at the right moment, and a handoff ritual that survives the chaos of a shift change.",
      },
      {
        type: "vignette",
        slug: "nurse-triage-board",
        name: "Nurse triage board",
        keyImageRatio: "9x16",
        keyImageAccent: portraitAccents[2],
        tags: ["Service design", "User research", "Mobile"],
        images: [
          { ratio: "9x16", accent: "royalBlue", caption: "Priority sorts itself. The board re-ranks patients as vitals and wait times change." },
          { ratio: "16x9", accent: "offWhite", caption: "Color is information, never decoration — every hue maps to an acuity level." },
          { ratio: "9x16", accent: "lightGray" },
        ],
      },
      {
        type: "vignette",
        slug: "shift-handoff",
        name: "Shift handoff",
        keyImageRatio: "16x9",
        keyImageAccent: portraitAccents[3],
        tags: ["Service design", "Accessibility", "Web"],
        images: [
          { ratio: "16x9", accent: "skyBlue", caption: "The handoff is a story, not a spreadsheet — outgoing nurses leave a narrative, not a data dump." },
          { ratio: "9x16", accent: "offWhite" },
          { ratio: "16x9", accent: "charcoal", caption: "Triage time fell by 18 minutes per shift." },
        ],
      },
    ],
  },
  {
    slug: "loft-discovery",
    name: "From browse to bag",
    subhead:
      "Giving discovery a direction — every interaction nudges toward the bag.",
    date: "2023",
    client: "Loft",
    location: "New York, NY",
    role: "Lead product designer",
    tools: "Figma, Principle, Next.js",
    clientLogo: "/portfolio/logos/loft.svg",
    sections: [
      {
        type: "prose",
        id: "loft-intro",
        heading: "The opportunity",
        body: "Loft's customers loved to browse and rarely bought. The discovery surface was beautiful and aimless — endless scroll with no sense of momentum toward a purchase.\n\nWe gave browsing a direction: every interaction nudges quietly toward the bag, without ever feeling like a sales pitch.",
      },
      {
        type: "vignette",
        slug: "discovery-rail",
        name: "Discovery rail",
        keyImageRatio: "16x9",
        keyImageAccent: portraitAccents[5],
        tags: ["Visual design", "Interaction", "Web"],
        images: [
          { ratio: "16x9", accent: "mediumBlue", caption: "Editorial-grade imagery, shopping-grade intent. The rail reads like a magazine and behaves like a store." },
          { ratio: "9x16", accent: "offWhite" },
          { ratio: "16x9", accent: "lightGray", caption: "" },
        ],
      },
      {
        type: "prose",
        id: "loft-mid",
        heading: "Momentum as a metric",
        body: "We stopped optimizing for time-on-site and started optimizing for forward motion — each tap should leave the customer measurably closer to a decision.",
      },
      {
        type: "vignette",
        slug: "bag-and-checkout",
        name: "Bag & checkout",
        keyImageRatio: "9x16",
        keyImageAccent: portraitAccents[6],
        tags: ["Interaction", "Prototyping", "Web"],
        images: [
          { ratio: "9x16", accent: "mediumGray", caption: "The bag is always one gesture away, and always honest about totals." },
          { ratio: "16x9", accent: "offWhite", caption: "Browse-to-bag rate improved 19% on discovery surfaces." },
        ],
      },
    ],
  },
  {
    slug: "atlas-design-system",
    name: "One system, six teams",
    subhead:
      "A design system good enough that adoption felt like relief, not mandate.",
    date: "2025",
    client: "Atlas",
    location: "San Francisco, CA",
    role: "Design systems lead",
    tools: "Figma, Storybook, Style Dictionary",
    clientLogo: "/portfolio/logos/atlas.svg",
    sections: [
      {
        type: "prose",
        id: "atlas-intro",
        heading: "Why now",
        body: "Atlas had six product squads and six subtly different blues. A design system wasn't a luxury — it was the only way to ship coherently at the pace the business demanded.\n\nThe work was equal parts craft and politics: build something good enough that adoption felt like a relief, not a mandate.",
      },
      {
        type: "vignette",
        slug: "token-pipeline",
        name: "Token pipeline",
        keyImageRatio: "16x9",
        keyImageAccent: portraitAccents[0],
        tags: ["Design systems", "Visual design", "Web"],
        images: [
          { ratio: "16x9", accent: "neonLime", caption: "One source of truth, every platform downstream. Tokens flow from design to code automatically." },
          { ratio: "9x16", accent: "offWhite" },
          { ratio: "16x9", accent: "lightGray", caption: "A single token rollout unified brand color across four legacy apps." },
        ],
      },
      {
        type: "vignette",
        slug: "component-docs",
        name: "Living component docs",
        keyImageRatio: "9x16",
        keyImageAccent: portraitAccents[1],
        tags: ["Design systems", "Accessibility", "Web"],
        images: [
          { ratio: "9x16", accent: "hotPink", caption: "Docs that ship with the code, so they can never drift out of date." },
          { ratio: "16x9", accent: "offWhite", caption: "Every component arrives with its accessibility contract written down." },
        ],
      },
      {
        type: "vignette",
        slug: "adoption-dashboard",
        name: "Adoption dashboard",
        keyImageRatio: "16x9",
        keyImageAccent: portraitAccents[2],
        tags: ["Data viz", "Leadership", "Web"],
        images: [
          { ratio: "16x9", accent: "royalBlue", caption: "Adoption made visible. Leaders could see, squad by squad, how much of each surface was on-system." },
          { ratio: "9x16", accent: "offWhite" },
          { ratio: "16x9", accent: "charcoal", caption: "Shipped to all six product squads in 90 days." },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Derived helpers
 * ------------------------------------------------------------------ */

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

export function isVignette(section: CaseStudySection): section is CraftVignette {
  return section.type === "vignette";
}

export function isProse(section: CaseStudySection): section is ProseSection {
  return section.type === "prose";
}

/** A vignette together with the case study it belongs to. */
export type VignetteWithStudy = {
  vignette: CraftVignette;
  caseStudy: CaseStudy;
};

/** All vignettes across all case studies, in authoring order. */
export function getAllVignettes(): VignetteWithStudy[] {
  const out: VignetteWithStudy[] = [];
  for (const caseStudy of caseStudies) {
    for (const section of caseStudy.sections) {
      if (isVignette(section)) {
        out.push({ vignette: section, caseStudy });
      }
    }
  }
  return out;
}

export function getVignette(slug: string): VignetteWithStudy | undefined {
  return getAllVignettes().find(({ vignette }) => vignette.slug === slug);
}

/** Just the vignettes belonging to one case study, in order. */
export function caseStudyVignettes(caseStudy: CaseStudy): CraftVignette[] {
  return caseStudy.sections.filter(isVignette);
}

/** Deduped union of tags used by a case study's vignettes (first-seen order). */
export function caseStudyTags(caseStudy: CaseStudy): string[] {
  return dedupe(caseStudyVignettes(caseStudy).flatMap((v) => v.tags));
}

/** Deduped union of every tag used by any vignette (first-seen order). */
export function allCraftTags(): string[] {
  return dedupe(getAllVignettes().flatMap(({ vignette }) => vignette.tags));
}

/** OR-match: a vignette is shown if it has at least one active tag. */
export function vignetteMatchesActiveTags(
  vignette: CraftVignette,
  activeTags: ReadonlySet<string>,
): boolean {
  if (activeTags.size === 0) return false;
  return vignette.tags.some((tag) => activeTags.has(tag));
}

/** Stable two-digit index (01…) from master vignette order. */
export function vignetteIndexLabel(slug: string): string {
  const all = getAllVignettes();
  const i = all.findIndex(({ vignette }) => vignette.slug === slug);
  const n = i >= 0 ? i + 1 : 0;
  return String(n).padStart(2, "0");
}

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values));
}

/** Display range from earliest to latest case study year, e.g. "2023–2025". */
export function caseStudiesDateRange(): string {
  const years = caseStudies
    .map((study) => study.date.match(/\d{4}/)?.[0])
    .filter((year): year is string => Boolean(year))
    .map((year) => Number.parseInt(year, 10));

  if (years.length === 0) return "";

  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min}–${max}`;
}
