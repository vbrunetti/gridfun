"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  parseVimeoId,
  vimeoAmbientUrl,
  vimeoBackgroundUrl,
  vimeoEmbedUrl,
} from "@/lib/vimeo";

export type VimeoPlayerProps = {
  videoId: string;
  title: string;
  /** CSS aspect-ratio value, e.g. "16/9" or "9/16". */
  aspectRatio?: "9/16" | "16/9" | "1/1";
  className?: string;
  /** Borderless background embed — autoplay, loop, muted, no controls. */
  background?: boolean;
  /**
   * Chromeless autoplay loop with a visible mute toggle (for videos with sound).
   * Starts muted for autoplay policy; ignores `background`.
   */
  hasAudio?: boolean;
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

function MuteIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path
          d="M11 5 6 9H2v6h4l5 4V5Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          d="m22 9-6 6M16 9l6 6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 5 6 9H2v6h4l5 4V5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Minimal Vimeo iframe — native controls, metadata chrome stripped via embed params. */
export function VimeoPlayer({
  videoId,
  title,
  aspectRatio = "9/16",
  className = "",
  background = false,
  hasAudio = false,
  poster,
}: VimeoPlayerProps) {
  const id = parseVimeoId(videoId);
  const playerId = useId().replace(/:/g, "");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  const ambient = hasAudio;
  const chromeless = background || ambient;

  useEffect(() => {
    setPlaying(false);
    setMuted(true);
    setReady(false);
  }, [id]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://player.vimeo.com") return;

      const message = parseVimeoMessage(event.data);
      if (!message || !matchesPlayer(message, playerId)) return;

      if (message.event === "ready") {
        setReady(true);
        for (const name of PLAYBACK_EVENTS) {
          postToPlayer(iframeRef.current, {
            method: "addEventListener",
            value: name,
          });
        }
        if (chromeless) postToPlayer(iframeRef.current, { method: "play" });
        if (ambient) {
          postToPlayer(iframeRef.current, { method: "setMuted", value: true });
        }
      }

      if ((PLAYBACK_EVENTS as readonly string[]).includes(message.event ?? "")) {
        setPlaying(true);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [ambient, chromeless, playerId]);

  const toggleMute = () => {
    if (!ready) return;
    const next = !muted;
    setMuted(next);
    postToPlayer(iframeRef.current, { method: "setMuted", value: next });
    if (!next) {
      postToPlayer(iframeRef.current, { method: "setVolume", value: 1 });
      postToPlayer(iframeRef.current, { method: "play" });
    }
  };

  if (!id) return null;

  const src = ambient
    ? vimeoAmbientUrl(id, playerId)
    : background
      ? vimeoBackgroundUrl(id, playerId)
      : vimeoEmbedUrl(id);

  return (
    <div
      className={`vimeo-player ${className}`.trim()}
      style={{ aspectRatio }}
      aria-hidden={background && !ambient ? true : undefined}
    >
      <iframe
        ref={iframeRef}
        id={playerId}
        src={src}
        title={title}
        className="vimeo-player__iframe"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen={!chromeless}
        tabIndex={chromeless ? -1 : undefined}
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
      {ambient ? (
        <button
          type="button"
          className="vimeo-player__mute"
          onClick={toggleMute}
          aria-pressed={!muted}
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          <MuteIcon muted={muted} />
          <span className="vimeo-player__mute-label">
            {muted ? "Unmute" : "Mute"}
          </span>
        </button>
      ) : null}
    </div>
  );
}
