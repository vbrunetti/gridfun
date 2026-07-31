"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { SecondarySparkControls } from "@/components/effects/secondary-spark-controls";
import { SecondarySparkLayer } from "@/components/effects/secondary-spark-layer";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";
import type { ParticlePreset } from "@/components/sections/primary-hero/particle-presets";
import { SECONDARY_SPARK_SNAPSHOT } from "@/components/sections/primary-hero/secondary-spark-config";
import {
  createDefaultSecondarySparkSnapshot,
  secondaryColorChoiceFromSnapshot,
  secondaryColorFromChoice,
  type SecondarySparkColorChoice,
  type SecondarySparkSnapshot,
} from "@/lib/secondary-spark-snapshot";

function clonePreset(preset: ParticlePreset): ParticlePreset {
  return { ...preset };
}

function applySnapshot(snapshot: SecondarySparkSnapshot) {
  return {
    preset: clonePreset(snapshot.preset),
    colorChoice: secondaryColorChoiceFromSnapshot(snapshot.color),
  };
}

/** Full-viewport spark field tuner for home-secondary (v2). */
export function SecondarySparkPlayground() {
  const home = applySnapshot(SECONDARY_SPARK_SNAPSHOT);
  const [preset, setPreset] = useState(() => clonePreset(home.preset));
  const [colorChoice, setColorChoice] = useState<SecondarySparkColorChoice>(
    home.colorChoice,
  );
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const color = secondaryColorFromChoice(colorChoice);

  const buildSnapshot = useCallback((): SecondarySparkSnapshot => {
    return {
      version: 1,
      preset: clonePreset(preset),
      color: secondaryColorFromChoice(colorChoice),
      showBoundary: false,
    };
  }, [preset, colorChoice]);

  const updatePreset = useCallback(
    (key: keyof ParticlePreset, value: string | number) => {
      setPreset((prev) => {
        const next = clonePreset(prev);
        if (key === "shape") {
          next.shape = value as ParticlePreset["shape"];
        } else if (key === "label") {
          next.label = String(value);
        } else if (typeof next[key] === "number") {
          next[key] = Number(value) as never;
        }
        return next;
      });
    },
    [],
  );

  const reset = () => {
    const next = applySnapshot(createDefaultSecondarySparkSnapshot());
    setPreset(next.preset);
    setColorChoice(next.colorChoice);
  };

  const reloadHomeConfig = () => {
    const next = applySnapshot(SECONDARY_SPARK_SNAPSHOT);
    setPreset(next.preset);
    setColorChoice(next.colorChoice);
  };

  const copySnapshot = async () => {
    await navigator.clipboard.writeText(
      JSON.stringify(buildSnapshot(), null, 2),
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const saveAsHomeConfig = async () => {
    setSaveError(null);
    try {
      const response = await fetch("/api/dev/secondary-spark-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildSnapshot()),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Save failed");
      }
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Could not save home config",
      );
    }
  };

  return (
    <div className="pb-24">
      <header className="keyline-b">
        <RuledGrid className="py-10">
          <SiteGridSubgrid>
            <div className="grid-span-6 lg:grid-span-8">
              <p className="text-meta">Effects · Home secondary · v2</p>
              <h1 className="display-lg mt-3">Secondary spark field</h1>
              <p className="mt-4 max-w-2xl leading-relaxed text-secondary">
                Full-viewport spark aesthetic for{" "}
                <code className="font-mono text-xs text-primary">
                  #home-secondary
                </code>
                . Same particle system as the hero spark playground — full-canvas
                field with no shape boundary. Save writes{" "}
                <code className="font-mono text-xs text-primary">
                  secondary-spark-snapshot.json
                </code>{" "}
                and switches the home secondary variant to spark.
              </p>
              <p className="mt-3 text-sm text-secondary">
                <Link
                  href="/effects/hero-atmosphere"
                  className="border-b border-current text-primary"
                >
                  Secondary v1 · Edge aurora
                </Link>
                {" · "}
                <Link href="/effects" className="border-b border-current text-primary">
                  Spark playground
                </Link>
                {" · "}
                <button
                  type="button"
                  onClick={reloadHomeConfig}
                  className="border-b border-current text-primary"
                >
                  Reload saved config
                </button>
                {" · "}
                <Link href="/" className="border-b border-current text-primary">
                  Home
                </Link>
              </p>
            </div>
          </SiteGridSubgrid>
        </RuledGrid>
      </header>

      <section className="secondary-spark-playground-workspace mt-8">
        <RuledGrid className="secondary-spark-playground-band theme-dark">
          <SecondarySparkLayer
            className="secondary-spark-playground-viz"
            preset={preset}
            colorMode={color.colorMode}
            fixedColor={color.fixedColor}
          />

          <SiteGridSubgrid className="secondary-spark-playground-band__layout">
            <aside className="secondary-spark-playground-rail">
              <div className="secondary-spark-playground-save">
                <button
                  type="button"
                  onClick={saveAsHomeConfig}
                  className="secondary-spark-playground-save__btn"
                >
                  {saved ? "Saved — home uses this config" : "Save to home secondary"}
                </button>
                <p className="secondary-spark-playground-save__hint">
                  Writes the JSON and switches{" "}
                  <code className="font-mono">#home-secondary</code> to this spark
                  field.
                </p>
                {saveError ? (
                  <p className="text-error mt-2 text-xs">{saveError}</p>
                ) : null}
              </div>

              <SecondarySparkControls
                preset={preset}
                colorChoice={colorChoice}
                copied={copied}
                onUpdatePreset={updatePreset}
                onColorChoiceChange={setColorChoice}
                onReset={reset}
                onCopySnapshot={copySnapshot}
              />
            </aside>
            <div className="secondary-spark-playground-spacer" aria-hidden />
          </SiteGridSubgrid>
        </RuledGrid>
      </section>
    </div>
  );
}
