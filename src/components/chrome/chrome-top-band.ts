/**
 * Top row in main content — must match the fixed logo slot height
 * (`--chrome-top-offset`) so the header border lines up with the rail.
 *
 * Use Tailwind utilities here (not a globals.css class) so Tailwind v4
 * does not tree-shake the rule on route-split pages.
 */
export const chromeTopBandClassName =
  "box-border flex h-[var(--chrome-top-offset)] shrink-0 items-center";
