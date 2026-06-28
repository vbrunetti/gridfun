"use client";

import { useEffect, useId, useRef, useState } from "react";
import { parseVimeoId, vimeoBackgroundUrl, vimeoEmbedUrl } from "@/lib/vimeo";

export type VimeoPlayerProps = {
  videoId: string;
  title: string;
  /** CSS aspect-ratio value, e.g. "16/9" or "9/16". */
  aspectRatio?: "9/16" | "16/9" | "1/1";
  className?: string;
  /** Borderless background embed — autoplay, loop, muted, no controls. */
  background?: boolean;
  /** Cover layer until playback starts — iframe stays visible underneath for autoplay. */
  poster?: string;
};

type VimeoMessage = {
  event?: string;
  player_id?: string;
  method?: string;
};

function parseVimeoMessage(data: unknown): VimeoMessage | null {
  if (!data) return null;
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as VimeoMessage;
    } catch {
      return null;
    }
  }
  if (typeof data === "object") return data as VimeoMessage;
  return null;
}

function matchesPlayer(message: VimeoMessage, playerId: string): boolean {
  return !message.player_id || message.player_id === playerId;
}

function postToPlayer(
  iframe: HTMLIFrameElement | null,
  payload: Record<string, unknown>,
) {
  iframe?.contentWindow?.postMessage(
    JSON.stringify(payload),
    "https://player.vimeo.com",
  );
}

/** Vimeo's postMessage API only emits `ready` on its own — every other event must
 *  be subscribed to explicitly before it will report. */
const PLAYBACK_EVENTS = ["play", "playing", "timeupdate"] as const;

/** Minimal Vimeo iframe — native controls, metadata chrome stripped via embed params. */
export function VimeoPlayer({
  videoId,
  title,
  aspectRatio = "9/16",
  className = "",
  background = false,
  poster,
}: VimeoPlayerProps) {
  const id = parseVimeoId(videoId);
  const playerId = useId().replace(/:/g, "");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(false);
  }, [id]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://player.vimeo.com") return;

      const message = parseVimeoMessage(event.data);
      if (!message || !matchesPlayer(message, playerId)) return;

      if (message.event === "ready") {
        for (const name of PLAYBACK_EVENTS) {
          postToPlayer(iframeRef.current, {
            method: "addEventListener",
            value: name,
          });
        }
        if (background) postToPlayer(iframeRef.current, { method: "play" });
      }

      if ((PLAYBACK_EVENTS as readonly string[]).includes(message.event ?? "")) {
        setPlaying(true);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [background, playerId]);

  if (!id) return null;

  return (
    <div
      className={`vimeo-player ${className}`.trim()}
      style={{ aspectRatio }}
      aria-hidden={background || undefined}
    >
      <iframe
        ref={iframeRef}
        id={playerId}
        src={
          background
            ? vimeoBackgroundUrl(id, playerId)
            : vimeoEmbedUrl(id)
        }
        title={title}
        className="vimeo-player__iframe"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen={!background}
        tabIndex={background ? -1 : undefined}
      />
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className={`vimeo-player__poster${playing ? " is-playing" : ""}`}
          aria-hidden
        />
      ) : null}
    </div>
  );
}
