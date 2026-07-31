"use client";

import Link from "next/link";
import { useState } from "react";
import { ChromaAuroraCanvas } from "@/components/effects/chroma-aurora-canvas";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";

/** Secondary background v1 — soft neon edge ribbons (chroma aurora). */
export function AtmospherePlayground() {
  const [activated, setActivated] = useState(false);
  const [activateError, setActivateError] = useState<string | null>(null);

  const useOnHome = async () => {
    setActivateError(null);
    try {
      const response = await fetch("/api/dev/secondary-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant: "aurora" }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Save failed");
      }
      setActivated(true);
      window.setTimeout(() => setActivated(false), 2500);
    } catch (error) {
      setActivateError(
        error instanceof Error ? error.message : "Could not switch home variant",
      );
    }
  };

  return (
    <div className="pb-24">
      <header className="atmosphere-playground-header keyline-b">
        <RuledGrid className="py-10">
          <SiteGridSubgrid>
            <div className="grid-span-6 lg:grid-span-8">
              <p className="text-meta">Effects · Home secondary · v1</p>
              <h1 className="display-lg mt-3">Secondary edge aurora</h1>
              <p className="mt-4 max-w-2xl leading-relaxed text-secondary">
                Saved approach for{" "}
                <code className="font-mono text-xs text-primary">
                  #home-secondary
                </code>
                : soft neon-lime waveform ribbons along each edge. Kept as v1
                while the full-viewport spark field is explored as v2.
              </p>
              <p className="mt-3 text-sm text-secondary">
                <Link
                  href="/effects/secondary-spark"
                  className="border-b border-current text-primary"
                >
                  Secondary v2 · Spark field
                </Link>
                {" · "}
                <Link href="/effects" className="border-b border-current text-primary">
                  Spark playground
                </Link>
                {" · "}
                <Link href="/" className="border-b border-current text-primary">
                  Home
                </Link>
              </p>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={useOnHome}
                  className="ui-chip ui-chip--active rounded-sm px-4 py-2 text-sm"
                >
                  {activated ? "Home uses v1" : "Use v1 on home"}
                </button>
                {activateError ? (
                  <p className="text-error mt-2 text-xs">{activateError}</p>
                ) : null}
              </div>
            </div>
          </SiteGridSubgrid>
        </RuledGrid>
      </header>

      <section className="atmosphere-playground-workspace" aria-label="Effect preview">
        <div className="atmosphere-playground-band theme-dark">
          <ChromaAuroraCanvas className="atmosphere-playground-canvas" />
        </div>
      </section>
    </div>
  );
}
