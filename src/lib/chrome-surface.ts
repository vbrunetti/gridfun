/** Declares page/section background for right-rail chrome (menu + grid label). */
export type ChromeSurface = "light" | "dark" | "canvas";

export const CHROME_SURFACE_ATTR = "data-chrome-surface";

export function isDarkChromeSurface(surface: ChromeSurface) {
  return surface === "dark";
}

/** Light ink cursor / chrome treatment — includes canvas (lime + ink text). */
export function isLightChromeSurface(
  surface: ChromeSurface | string | null | undefined,
) {
  return surface === "light" || surface === "canvas";
}

export function peekCursorSurface(
  surface: ChromeSurface | string | null | undefined,
): "light" | "dark" {
  return isLightChromeSurface(surface) ? "light" : "dark";
}
