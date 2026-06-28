"use client";

import { useEffect, useState } from "react";
import { RuledGrid } from "@/components/layout/ruled-grid";

const DESKTOP_QUERY = "(min-width: 1024px)";

/** Desktop-only title band — not rendered on mobile. */
export function CaseStudiesIndexIntro() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!desktop) return null;

  return (
    <section
      id="cs-index-intro"
      data-cs-step="intro"
      data-chrome-focus-step="0"
      className="chrome-focus-target work-snap-section work-snap-section--intro cs-index-intro theme-dark keyline-b keyline-b--dark"
      data-chrome-surface="dark"
    >
      <header className="cs-index-hero-header">
        <RuledGrid className="cs-index-hero__grid">
          <div className="cs-index-hero__meta" aria-hidden="true" />
          <div className="cs-index-hero__main">
            <div className="cs-index-hero__main-grid">
              <h1 className="cs-index-hero__title display-xl">Case Studies</h1>
            </div>
          </div>
        </RuledGrid>
      </header>
    </section>
  );
}
