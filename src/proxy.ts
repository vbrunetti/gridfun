import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy (Next 16's renamed Middleware). Turns a `?p=true` on any page URL into a
 * session-long unlock of gated portfolio content, then strips the param so the
 * address bar stays clean. `?p=false` relocks. The cookie name/param mirror
 * `src/lib/gate.ts` — keep the two in sync.
 */
const UNLOCK_COOKIE = "pf_unlock";
const UNLOCK_PARAM = "p";

export function proxy(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  if (!searchParams.has(UNLOCK_PARAM)) {
    return NextResponse.next();
  }

  const raw = searchParams.get(UNLOCK_PARAM);
  const unlock = raw === "true" || raw === "1";

  // Redirect to the same URL without the unlock param — keeps other params.
  const cleanUrl = request.nextUrl.clone();
  cleanUrl.searchParams.delete(UNLOCK_PARAM);

  const response = NextResponse.redirect(cleanUrl);

  if (unlock) {
    response.cookies.set(UNLOCK_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // No maxAge/expires → session cookie: clears when the browser closes.
    });
  } else {
    response.cookies.delete(UNLOCK_COOKIE);
  }

  return response;
}

// Run on page routes only — skip Next internals, API, and files with extensions.
export const config = {
  matcher: ["/((?!_next/|api/|.*\\.).*)"],
};
