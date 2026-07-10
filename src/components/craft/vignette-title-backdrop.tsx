import Image from "next/image";
import type { CraftVignette } from "@/content/portfolio";

/**
 * Background layers for a vignette's `cover` title treatment — the full-bleed key
 * image plus its darkening scrim, with the authored blur/alpha applied. Returns
 * nothing for `color`/plain openers (the caller paints the accent as a solid
 * ground). Shared by the filmstrip opener panel (VignetteChapter) and the
 * standalone craft hero so both render the treatment identically — positioning is
 * left to the caller's `coverClassName`/`scrimClassName`.
 */
export function VignetteTitleBackdrop({
  vignette,
  coverClassName,
  scrimClassName,
}: {
  vignette: CraftVignette;
  coverClassName: string;
  scrimClassName: string;
}) {
  if (vignette.titleTreatment !== "cover" || !vignette.keyImageSrc) return null;

  return (
    <>
      <Image
        src={vignette.keyImageSrc}
        alt=""
        fill
        priority
        draggable={false}
        className={coverClassName}
        sizes="(max-width: 767px) 92vw, min(100vw, 90rem)"
        style={{
          ...(vignette.titleCoverBlur
            ? {
                filter: `blur(${vignette.titleCoverBlur}px)`,
                // Overfill so the blur doesn't feather transparent edges.
                transform: "scale(1.06)",
              }
            : {}),
          ...(vignette.titleCoverAlpha != null
            ? { opacity: vignette.titleCoverAlpha }
            : {}),
        }}
      />
      <div className={scrimClassName} aria-hidden />
    </>
  );
}
