import type { CSSProperties } from "react";
import Image from "next/image";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { VimeoEmbed } from "@/components/media/vimeo-embed";
import { portfolioPlaceholderDataUrl } from "@/lib/portfolio-assets";
import type {
  ImageRatio,
  ProseMedia,
  ProseSection,
} from "@/content/portfolio";

/** CSS aspect-ratio for a frame shape (matches VimeoPlayer's accepted set). */
function ratioValue(ratio: ImageRatio = "16x9"): "9/16" | "16/9" | "1/1" {
  if (ratio === "9x16") return "9/16";
  if (ratio === "1x1") return "1/1";
  return "16/9";
}

function ratioDims(ratio: ImageRatio = "16x9"): { width: number; height: number } {
  if (ratio === "9x16") return { width: 900, height: 1600 };
  if (ratio === "1x1") return { width: 1200, height: 1200 };
  return { width: 1600, height: 900 };
}

/** Split a body string on blank lines into paragraphs (`body-md` by default). */
function Paragraphs({
  body,
  size = "body-md",
}: {
  body: string;
  /** Type-scale class for the paragraphs — e.g. `body-lg` lead, `display-sm` statement. */
  size?: "body-md" | "body-lg" | "display-sm";
}) {
  return (
    <>
      {body.split("\n\n").map((paragraph, i) => (
        <p key={i} className={`${size} cs-prose__paragraph text-secondary`}>
          {paragraph}
        </p>
      ))}
    </>
  );
}

/** Media frame — Vimeo loop, image, or a placeholder accent ground. */
function ProseFigure({
  media,
  className = "",
}: {
  media: ProseMedia;
  className?: string;
}) {
  const ratio = media.ratio ?? "16x9";
  const aspect = ratioValue(ratio);

  let frame;
  if (media.vimeo) {
    frame = (
      <VimeoEmbed
        videoId={media.vimeo}
        title={media.alt ?? media.caption ?? "Case study media"}
        aspectRatio={aspect}
        className="cs-prose__media-frame"
      />
    );
  } else if (media.src) {
    frame = (
      <div className="cs-prose__media-frame">
        <Image
          src={media.src}
          alt={media.alt ?? media.caption ?? ""}
          width={0}
          height={0}
          className="h-auto w-full"
          style={{ width: "100%", height: "auto" }}
          sizes="(max-width: 1023px) 100vw, 60vw"
        />
      </div>
    );
  } else {
    frame = (
      <div
        className="cs-prose__media-frame media-frame-ground"
        style={
          {
            aspectRatio: aspect,
            backgroundImage: `url("${portfolioPlaceholderDataUrl({
              accent: media.accent ?? "cruise",
              ratio,
            })}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          } as CSSProperties
        }
        aria-hidden="true"
      />
    );
  }

  return (
    <figure className={`cs-prose__figure-wrap ${className}`}>
      {frame}
      {media.caption ? (
        <figcaption className="text-caption cs-prose__media-caption text-secondary">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/**
 * One prose section, rendered by variant on the master ruled grid. All variants
 * reuse the site type tokens and stay on the dark case-study chrome surface —
 * only the grid allocation changes. See `ProseVariant` in `content/portfolio.ts`.
 */
export function ProseBlock({ section }: { section: ProseSection }) {
  const variant = section.variant ?? "lede";

  switch (variant) {
    case "statement":
      return (
        <RuledGrid>
          <p className="display-md cs-prose__statement text-balance">
            {section.body}
          </p>
        </RuledGrid>
      );

    case "columns":
      return (
        <RuledGrid>
          {section.heading ? (
            <h2 className="cs-prose__heading cs-prose__heading--wide display-lg">
              {section.heading}
            </h2>
          ) : null}
          <div className="cs-prose__body cs-prose__body--columns">
            <Paragraphs body={section.body} />
          </div>
        </RuledGrid>
      );

    case "epigraph":
      return (
        <RuledGrid>
          <figure className="cs-prose__epigraph">
            <blockquote className="cs-prose__quote display-md text-balance">
              {section.body}
            </blockquote>
            {section.attribution ? (
              <figcaption className="cs-prose__attribution text-label-sm text-mono-label">
                {section.attribution}
              </figcaption>
            ) : null}
          </figure>
        </RuledGrid>
      );

    case "meta":
      return (
        <RuledGrid>
          <div className="cs-prose__meta">
            <dl className="cs-prose__meta-list">
              {(section.meta ?? []).map((row) => (
                <div key={row.label} className="cs-prose__meta-row">
                  <dt className="text-meta cs-prose__meta-label">{row.label}</dt>
                  <dd className="body-sm cs-prose__meta-value">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="cs-prose__body cs-prose__body--meta">
            <Paragraphs body={section.body} size="display-sm" />
          </div>
        </RuledGrid>
      );

    case "figure":
      return (
        <RuledGrid>
          <div className="cs-prose__figure">
            <p className="display-metric cs-prose__figure-value">{section.stat}</p>
          </div>
          <div className="cs-prose__body cs-prose__body--figure">
            <Paragraphs body={section.body} />
          </div>
        </RuledGrid>
      );

    case "media":
      return (
        <RuledGrid>
          <div className="cs-prose__media">
            {section.media ? <ProseFigure media={section.media} /> : null}
          </div>
          <div className="cs-prose__body cs-prose__body--media">
            {section.heading ? (
              <h2 className="cs-prose__heading cs-prose__heading--media display-md">
                {section.heading}
              </h2>
            ) : null}
            <Paragraphs body={section.body} />
          </div>
        </RuledGrid>
      );

    case "media-band":
      return (
        <RuledGrid>
          {section.heading ? (
            <h2 className="cs-prose__heading cs-prose__heading--wide display-lg">
              {section.heading}
            </h2>
          ) : null}
          <div className="cs-prose__mediaband">
            {section.media ? <ProseFigure media={section.media} /> : null}
          </div>
          {section.body ? (
            <div className="cs-prose__body cs-prose__body--band">
              <Paragraphs body={section.body} />
            </div>
          ) : null}
        </RuledGrid>
      );

    default:
      return (
        <RuledGrid>
          {section.heading ? (
            <h2 className="cs-prose__heading display-lg">{section.heading}</h2>
          ) : null}
          <div className="cs-prose__body">
            <Paragraphs body={section.body} />
          </div>
        </RuledGrid>
      );
  }
}
