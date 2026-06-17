"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { AtmospherePlaygroundControls } from "@/components/effects/atmosphere-playground-controls";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";
import {
  cloneHeroAtmosphereSnapshot,
  HERO_ATMOSPHERE_SNAPSHOT,
} from "@/components/sections/primary-hero/atmosphere-hero-config";
import { HeroBlobCanvas } from "@/components/sections/primary-hero/hero-blob-canvas";
import { HeroNoiseCanvas } from "@/components/sections/primary-hero/hero-noise-canvas";
import { HOME_HERO_CHAPTER_COUNT } from "@/components/sections/primary-hero/spark-hero-config";
import type { SparkBlend } from "@/components/sections/primary-hero/spark-canvas";
import { heroSlates } from "@/content/site";
import {
  createDefaultHeroAtmosphereSnapshot,
  normalizeHeroAtmosphereSnapshot,
  type HeroAtmosphereSnapshot,
} from "@/lib/hero-atmosphere-snapshot";
import { writeAtmosphereTunerDraft } from "@/lib/atmosphere-tuner-storage";

export function AtmospherePlayground() {
  const [snapshot, setSnapshot] = useState(() => cloneHeroAtmosphereSnapshot());
  const [activeChapter, setActiveChapter] = useState(0);
  const [transitionT, setTransitionT] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const chapterLabels = useMemo(
    () =>
      heroSlates.map(
        (slate, index) => slate.eyebrow ?? slate.headline ?? `Chapter ${index + 1}`,
      ),
    [],
  );

  const blend: SparkBlend = useMemo(() => {
    const to = Math.min(activeChapter + 1, HOME_HERO_CHAPTER_COUNT - 1);
    return { from: activeChapter, to, t: transitionT };
  }, [activeChapter, transitionT]);

  const updateSnapshot = useCallback(
    (updater: (prev: HeroAtmosphereSnapshot) => HeroAtmosphereSnapshot) => {
      setSnapshot((prev) => {
        const next = normalizeHeroAtmosphereSnapshot(updater(cloneHeroAtmosphereSnapshot(prev)));
        writeAtmosphereTunerDraft(next);
        return next;
      });
    },
    [],
  );

  const reloadHomeConfig = () => {
    setSnapshot(cloneHeroAtmosphereSnapshot(HERO_ATMOSPHERE_SNAPSHOT));
    setActiveChapter(0);
    setTransitionT(0);
  };

  const resetAll = () => {
    setSnapshot(createDefaultHeroAtmosphereSnapshot());
    setActiveChapter(0);
    setTransitionT(0);
  };

  const copySnapshot = async () => {
    const json = JSON.stringify(snapshot, null, 2);
    await navigator.clipboard.writeText(json);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const saveAsHomeConfig = async () => {
    setSaveError(null);
    const payload = normalizeHeroAtmosphereSnapshot(snapshot);

    try {
      const response = await fetch("/api/dev/hero-atmosphere-snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Save failed");
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
              <p className="text-meta">Effects · Home hero</p>
              <h1 className="display-lg mt-3">Atmosphere playground</h1>
              <p className="mt-4 max-w-2xl leading-relaxed text-secondary">
                Tune global noise and blob motion for all {HOME_HERO_CHAPTER_COUNT} homepage
                hero chapters. Loaded from{" "}
                <code className="font-mono text-xs text-primary">
                  src/content/hero-atmosphere-snapshot.json
                </code>
                .
              </p>
              <p className="mt-3 text-sm text-secondary">
                <Link href="/effects" className="border-b border-current text-primary">
                  Spark playground
                </Link>
                {" · "}
                <button
                  type="button"
                  onClick={reloadHomeConfig}
                  className="border-b border-current text-primary"
                >
                  Reload home config
                </button>
              </p>
            </div>
          </SiteGridSubgrid>
        </RuledGrid>
      </header>

      <section className="spark-playground-workspace mt-8">
        <RuledGrid className="spark-playground-band spark-playground-band--dark theme-dark-lift">
          <div className="atmosphere-playground-stage">
            <HeroNoiseCanvas config={snapshot.noise} />
            <HeroBlobCanvas
              blobs={snapshot.blobs}
              chapterCount={HOME_HERO_CHAPTER_COUNT}
              blend={blend}
            />
          </div>

          <SiteGridSubgrid className="spark-playground-band__layout">
            <aside className="spark-playground-rail">
              <AtmospherePlaygroundControls
                snapshot={snapshot}
                chapterLabels={chapterLabels}
                activeChapter={activeChapter}
                transitionT={transitionT}
                copied={copied}
                onSelectChapter={setActiveChapter}
                onTransitionChange={setTransitionT}
                onNoiseChange={(key, value) =>
                  updateSnapshot((prev) => ({
                    ...prev,
                    noise: { ...prev.noise, [key]: value },
                  }))
                }
                onNoiseToneChange={(key, value) =>
                  updateSnapshot((prev) => ({
                    ...prev,
                    noise: {
                      ...prev.noise,
                      tone: { ...prev.noise.tone, [key]: value },
                    },
                  }))
                }
                onNoiseBlendChange={(key, value) =>
                  updateSnapshot((prev) => ({
                    ...prev,
                    noise: {
                      ...prev.noise,
                      blend: { ...prev.noise.blend, [key]: value },
                    },
                  }))
                }
                onBlobsChange={(key, value) =>
                  updateSnapshot((prev) => ({
                    ...prev,
                    blobs: { ...prev.blobs, [key]: value },
                  }))
                }
                onResetAll={resetAll}
                onCopySnapshot={copySnapshot}
              />
            </aside>

            <div className="spark-playground-viz" aria-hidden>
              <p className="spark-playground-viz__caption">
                Ch {activeChapter + 1} → {Math.min(activeChapter + 1, HOME_HERO_CHAPTER_COUNT - 1) + 1}{" "}
                · t {transitionT.toFixed(2)}
              </p>
            </div>
          </SiteGridSubgrid>
        </RuledGrid>

        <RuledGrid className="spark-playground-save-row">
          <SiteGridSubgrid>
            <div className="spark-playground-viz-actions col-full py-4 lg:col-start-7 lg:grid-span-6">
              <button
                type="button"
                onClick={saveAsHomeConfig}
                className="ui-chip ui-chip--active rounded-sm px-4 py-2 text-sm"
              >
                {saved ? "Saved to home!" : "Save as home config"}
              </button>
              {saveError ? (
                <p className="text-error mt-2 text-xs">{saveError}</p>
              ) : null}
            </div>
          </SiteGridSubgrid>
        </RuledGrid>
      </section>
    </div>
  );
}
