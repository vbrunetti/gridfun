import "server-only";
import { cookies } from "next/headers";

/**
 * Session gate for hidden portfolio content (currently the Pearson case study
 * and its craft vignettes; see `gated` in `src/content/portfolio.ts`).
 *
 * A visitor unlocks gated content by loading any URL with `?p=true`. The
 * `src/proxy.ts` proxy sees the param, sets the session cookie below, and
 * redirects to the clean URL. The cookie has no expiry, so it lives for the
 * whole browsing session and clears when the browser closes. `?p=false`
 * relocks. These string literals are mirrored in `src/proxy.ts` — keep in sync.
 */
export const UNLOCK_COOKIE = "pf_unlock";
export const UNLOCK_PARAM = "p";

/** Server-side: has this visitor unlocked gated content for the session? */
export async function isUnlocked(): Promise<boolean> {
  const store = await cookies();
  return store.get(UNLOCK_COOKIE)?.value === "1";
}
