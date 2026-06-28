import { parseVimeoId, vimeoBackgroundUrl, vimeoEmbedUrl } from "@/lib/vimeo";

export type VimeoPlayerProps = {
  videoId: string;
  title: string;
  /** CSS aspect-ratio value, e.g. "16/9" or "9/16". */
  aspectRatio?: "9/16" | "16/9" | "1/1";
  className?: string;
  /** Borderless background embed — autoplay, loop, muted, no controls. */
  background?: boolean;
};

/** Minimal Vimeo iframe — native controls, metadata chrome stripped via embed params. */
export function VimeoPlayer({
  videoId,
  title,
  aspectRatio = "9/16",
  className = "",
  background = false,
}: VimeoPlayerProps) {
  const id = parseVimeoId(videoId);
  if (!id) return null;

  return (
    <div
      className={`vimeo-player ${className}`.trim()}
      style={{ aspectRatio }}
      aria-hidden={background || undefined}
    >
      <iframe
        src={background ? vimeoBackgroundUrl(id) : vimeoEmbedUrl(id)}
        title={title}
        className="vimeo-player__iframe"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen={!background}
        tabIndex={background ? -1 : undefined}
      />
    </div>
  );
}
