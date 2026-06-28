/** Parse a Vimeo video ID from a numeric ID or vimeo.com URL. */
export function parseVimeoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^\d+$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    if (!url.hostname.includes("vimeo.com")) return null;

    const pathMatch = url.pathname.match(/\/(?:video\/)?(\d+)/);
    return pathMatch?.[1] ?? null;
  } catch {
    return null;
  }
}

/** Embed URL with metadata chrome hidden; native playback controls stay on. */
export function vimeoEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    title: "0",
    byline: "0",
    portrait: "0",
    pip: "0",
    dnt: "1",
    autopause: "1",
    playsinline: "1",
  });

  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}

/** Borderless background embed — autoplay, loop, muted, no UI/controls (vibe reel). */
export function vimeoBackgroundUrl(videoId: string): string {
  const params = new URLSearchParams({
    background: "1", // implies autoplay + loop + muted + no controls
    muted: "1",
    autoplay: "1",
    loop: "1",
    autopause: "0",
    dnt: "1",
  });

  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}
