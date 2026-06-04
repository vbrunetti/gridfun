import Link from "next/link";
import type { ReactNode } from "react";

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
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-60"
      >
        {children}
        <span
          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-xs"
          aria-hidden
        >
          →
        </span>
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
