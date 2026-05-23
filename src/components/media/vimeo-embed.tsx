type VimeoEmbedProps = {
  videoId: string;
  title: string;
  /** Portrait 9:16 by default — matches mobile-first case study video. */
  aspectRatio?: "9/16" | "16/9" | "1/1";
  className?: string;
};

function buildEmbedUrl(videoId: string) {
  const params = new URLSearchParams({
    title: "0",
    byline: "0",
    portrait: "0",
    dnt: "1",
  });

  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}

export function VimeoEmbed({
  videoId,
  title,
  aspectRatio = "9/16",
  className,
}: VimeoEmbedProps) {
  return (
    <figure className={className}>
      <div
        className="relative w-full overflow-hidden bg-neutral-100"
        style={{ aspectRatio }}
      >
        <iframe
          src={buildEmbedUrl(videoId)}
          title={title}
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
        />
      </div>
    </figure>
  );
}
