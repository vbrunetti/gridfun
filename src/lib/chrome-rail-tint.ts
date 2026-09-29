import {
  clientBrandColorVar,
  clientBrandTextOn,
  type ClientBrandColorId,
} from "@/lib/client-brand-colors";

export type ChromeRailTint = ClientBrandColorId | "black";

/**
 * Tint the fixed left rail while a strip is in view: with a client brand color,
 * or the site's black. The rail keeps ink or paper type per the ground (brand
 * `textOn`; paper on black), so it stays legible — Cruise orange fails contrast
 * with paper type, see client-brand-colors. Pass `null` to return the rail to its
 * original color. Consumed by the `body[data-rail-tint]` rules in globals.css;
 * the value is the type color ("ink" | "paper"), and ChromeLogo reverses on paper.
 */
export function setChromeRailTint(tint: ChromeRailTint | null) {
  if (typeof document === "undefined") return;
  const body = document.body;
  if (!tint) {
    delete body.dataset.railTint;
    body.style.removeProperty("--rail-tint");
    return;
  }
  if (tint === "black") {
    body.dataset.railTint = "paper";
    body.style.setProperty("--rail-tint", "var(--section-dark-bg)");
    return;
  }
  body.dataset.railTint = clientBrandTextOn(tint);
  body.style.setProperty("--rail-tint", clientBrandColorVar(tint));
}
