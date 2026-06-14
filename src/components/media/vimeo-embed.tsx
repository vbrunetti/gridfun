import { VimeoPlayer, type VimeoPlayerProps } from "@/components/media/vimeo-player";

type VimeoEmbedProps = VimeoPlayerProps;

/** Standalone figure wrapper — for MDX and prose pages. */
export function VimeoEmbed({
  videoId,
  title,
  aspectRatio = "9/16",
  className,
}: VimeoEmbedProps) {
  return (
    <figure className={className}>
      <VimeoPlayer
        videoId={videoId}
        title={title}
        aspectRatio={aspectRatio}
        className="vimeo-embed media-frame-ground relative w-full overflow-hidden"
      />
    </figure>
  );
}

export { VimeoPlayer } from "@/components/media/vimeo-player";
