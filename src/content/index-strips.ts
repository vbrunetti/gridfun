import {
  caseStudyTags,
  type CaseStudy,
  type CraftVignette,
  type MosaicCell,
  type VignetteImage,
} from "@/content/portfolio";
import { clientBrandColorVar } from "@/lib/client-brand-colors";

/**
 * Sample stills per case study for media cells; studies without an entry get the
 * grid placeholder. PLACEHOLDER CONTENT — replace with curated per-study media.
 */
const SAMPLE_MEDIA: Record<string, string[]> = {
  "cruise-teleops": [
    "/portfolio/cruise/cruise_v1_full.jpg",
    "/portfolio/cruise/cruise_v1_c1.jpg",
    "/portfolio/cruise/cruise_v1_c2.jpg",
    "/portfolio/cruise/cruise_v1_c3.jpg",
  ],
};

const FRAME = { ratio: "16x9", accent: "charcoal" } as const;

/**
 * The /case-studies index entry for a case study: a branded cover panel, a run
 * of mosaic panels, and a closing call-to-action panel — one horizontal
 * filmstrip per study, rendered by the shared `VignetteChapter`.
 *
 * Cover and CTA come from the study's own data (client, name, subhead, brand,
 * slug). The mosaic tiles are SAMPLE content modeled on the Cruise strip in
 * /layout-experiments, tinted from the study's brand color — the content is not
 * final. Swap `mosaicFrames` for per-study curated content when it exists.
 */
export function caseStudyIndexStrip(study: CaseStudy): CraftVignette {
  const href = `/case-studies/${study.slug}`;
  const brand = clientBrandColorVar(study.brand.field);
  const tone = {
    deep: `color-mix(in srgb, ${brand} 65%, black)`,
    shade: `color-mix(in srgb, ${brand} 35%, black)`,
    light: `color-mix(in srgb, ${brand} 55%, white)`,
  };
  const photos = SAMPLE_MEDIA[study.slug] ?? [];
  const media = (i: number): MosaicCell =>
    photos.length
      ? { kind: "media", src: photos[i % photos.length] }
      : { kind: "media", accent: "charcoal" };
  const field = (color: string): MosaicCell => ({ kind: "field", color });

  const mosaicFrames: VignetteImage[] = [
    {
      ...FRAME,
      label: "Mosaic — feature",
      mosaicLayout: "feature",
      mosaic: [
        {
          kind: "quote",
          label: "Proof It Worked",
          quote: "[This] gives me information in a much more intuitive way.",
          cite: "Remote Advisor Research Participant",
        },
        media(0),
        field(tone.deep),
      ],
    },
    {
      ...FRAME,
      label: "Mosaic — feature stack",
      mosaicLayout: "feature-stack",
      mosaic: [
        { kind: "stat", label: "Time to first action", stat: "3 sec." },
        media(1),
        field(brand),
        media(2),
      ],
    },
    {
      ...FRAME,
      label: "Mosaic — quad",
      mosaicLayout: "quad",
      mosaic: [
        field(tone.shade),
        media(3),
        {
          kind: "stat",
          label:
            "As a result of the improved context-awareness work, Remote Advisors improved their time to first action (TTFA) by about twenty percent, with greater accuracy than before.",
          stat: "~20%",
        },
        field(tone.light),
      ],
    },
  ];

  return {
    type: "vignette",
    slug: `index-${study.slug}`,
    name: study.name,
    keyImageRatio: "16x9",
    keyImageAccent: "charcoal",
    tags: caseStudyTags(study),
    titleTreatment: "index",
    titlePanelWidth: { desktop: 8, mobile: 6 },
    titleIndex: {
      client: study.client,
      subhead: study.subhead,
      href,
      brand: study.brand,
      railTint: "black",
    },
    images: [
      ...mosaicFrames,
      {
        ratio: "1x1",
        accent: "charcoal",
        label: study.client,
        panelBg: study.brand.field,
        cta: { label: "View case study", href },
      },
    ],
  };
}
