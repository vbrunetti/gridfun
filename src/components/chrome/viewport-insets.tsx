"use client";

import { useEffect } from "react";
import { initViewportHeight } from "@/lib/viewport-height";
import { initChromeInsets } from "@/lib/chrome-insets";

/** Boots the stable viewport height + chrome inset measurement on the client. */
export function ViewportInsets() {
  useEffect(() => {
    initViewportHeight();
    initChromeInsets();
  }, []);

  return null;
}
