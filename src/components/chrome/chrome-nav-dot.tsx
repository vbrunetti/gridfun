"use client";

const RING_R = 9;
const RING_C = 2 * Math.PI * RING_R;

type ChromeNavDotProps = {
  active: boolean;
  /** 0–1 panel progress; draws a radial ring when set on the active dot. */
  progress?: number | null;
};

/**
 * Right-rail navigation dot — shared by home hero, case-study index, and detail.
 * Active vignette chapters can show a slim radial progress ring around the dot.
 */
export function ChromeNavDot({ active, progress }: ChromeNavDotProps) {
  const showRing = active && progress != null && progress > 0;
  const dash = showRing ? Math.min(progress, 1) * RING_C : 0;

  return (
    <span className="chrome-nav-dot-wrap" aria-hidden>
      {showRing ? (
        <svg className="chrome-nav-dot-ring" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r={RING_R}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.2"
          />
          <circle
            cx="12"
            cy="12"
            r={RING_R}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${RING_C}`}
            transform="rotate(-90 12 12)"
          />
        </svg>
      ) : null}
      <span
        className={
          active ? "chrome-nav-dot chrome-nav-dot--active" : "chrome-nav-dot"
        }
      />
    </span>
  );
}
