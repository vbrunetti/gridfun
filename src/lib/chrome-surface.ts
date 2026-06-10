/** Declares page/section background for right-rail chrome (menu + grid label). */
export type ChromeSurface = "light" | "dark" | "canvas";

export const CHROME_SURFACE_ATTR = "data-chrome-surface";

export function isDarkChromeSurface(surface: ChromeSurface) {
  return surface === "dark";
}
