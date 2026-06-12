import Link from "next/link";
import type { ReactNode } from "react";

type GhostIcon = "arrow" | "check" | "x";

const ghostIconGlyph: Record<GhostIcon, string> = {
  arrow: "→",
  check: "✓",
  x: "×",
};

function GhostCtaIcon({ icon }: { icon: GhostIcon }) {
  return (
    <span
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-xs leading-none"
      aria-hidden
    >
      {ghostIconGlyph[icon]}
    </span>
  );
}

const ghostCtaClassName =
  "inline-flex items-center gap-2 rounded-full border border-current px-4 py-2 text-sm font-medium text-primary transition-[opacity,border-color] hover:border-[var(--text-primary)] hover:opacity-60";

const ghostButtonBaseClassName =
  "inline-flex items-center shrink-0 cursor-pointer rounded-full border bg-transparent";

type GhostButtonProps = {
  children: ReactNode;
  onClick: () => void;
  icon?: GhostIcon;
  /** Match /craft filter chip scale — uses `.craft-filter-all-btn` in globals.css. */
  chipSize?: "hero" | "compact";
  className?: string;
  "aria-label"?: string;
};

/** Ghost CTA as a `<button>` — same look as `CtaButton variant="ghost"`. */
export function GhostButton({
  children,
  onClick,
  icon = "arrow",
  chipSize,
  className = "",
  "aria-label": ariaLabel,
}: GhostButtonProps) {
  const visualClass = chipSize
    ? `craft-filter-all-btn craft-filter-all-btn--${chipSize}`
    : ghostCtaClassName;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${ghostButtonBaseClassName} ${visualClass} ${className}`.trim()}
    >
      {children}
      <GhostCtaIcon icon={icon} />
    </button>
  );
}

type CtaButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
};

export function CtaButton({
  href,
  children,
  variant = "primary",
}: CtaButtonProps) {
  if (variant === "ghost") {
    return (
      <Link href={href} className={ghostCtaClassName}>
        {children}
        <GhostCtaIcon icon="arrow" />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-opacity hover:opacity-90"
    >
      {children}
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-ink)]/12 text-xs text-[var(--color-ink)]"
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}
