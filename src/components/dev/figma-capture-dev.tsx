"use client";

import { useEffect } from "react";

const CAPTURE_SCRIPT_SRC = "https://mcp.figma.com/mcp/html-to-design/capture.js";
const CAPTURE_SCRIPT_ID = "figma-html-to-design-capture";

/** Dev-only — loads Figma html-to-design capture.js + toolbar. */
export function FigmaCaptureDev() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    if (document.getElementById(CAPTURE_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = CAPTURE_SCRIPT_ID;
    script.src = CAPTURE_SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return null;
}
