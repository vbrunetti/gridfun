import type { CraftVignette } from "@/content/portfolio";
import {
  clientBrandColorVar,
  isClientBrandColor,
} from "@/lib/client-brand-colors";
import { palette } from "@/lib/colors";

/**
 * Resolved accent colour for a vignette's `color` title treatment — the same
 * value the filmstrip opener panel paints as its ground. Shared so the standalone
 * craft hero renders the identical accent.
 */
export function vignetteTitleColor(vignette: CraftVignette): string {
  return isClientBrandColor(vignette.keyImageAccent)
    ? clientBrandColorVar(vignette.keyImageAccent)
    : palette[vignette.keyImageAccent];
}
