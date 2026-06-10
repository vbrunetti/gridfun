"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { copyrightLine, socialLinks } from "@/lib/nav";
import { IconGitHub, IconLinkedIn } from "./icons";
import { GridLocationIndicator } from "./grid-location-indicator";
import { useChrome } from "./chrome-provider";

function SocialIconButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="chrome-hit-target transition-opacity hover:opacity-60"
      aria-label={label}
    >
      {children}
    </Link>
  );
}

export function LeftRail() {
  const { menuOpen } = useChrome();

  return (
    <aside
      className="lock-screen-left relative border-r border-[var(--rule-strong)] bg-[var(--color-paper)]"
      aria-label="Site chrome"
    >
      {/* Spacer matches ChromeLogo fixed slot; darkens behind logo when menu is open */}
      <div
        className={`hidden shrink-0 py-[var(--chrome-pad)] lg:block ${
          menuOpen ? "bg-[var(--color-ink)]" : "bg-[var(--color-paper)]"
        }`}
        style={{
          minHeight: "calc(var(--chrome-hit) + var(--chrome-pad) * 2)",
        }}
        aria-hidden
      />

      {/* Grid / page location — vertically centered on the rail */}
      <div className="pointer-events-none absolute top-1/2 right-0 left-0 flex -translate-y-1/2 justify-center">
        <GridLocationIndicator />
      </div>

      <div className="absolute right-0 bottom-0 left-0 flex flex-col items-center gap-0 pb-[var(--chrome-pad)]">
        <p className="rail-label-vertical">{copyrightLine}</p>

        <SocialIconButton
          href={socialLinks.linkedin.href}
          label={socialLinks.linkedin.label}
        >
          <IconLinkedIn className="h-5 w-5" />
        </SocialIconButton>

        <SocialIconButton
          href={socialLinks.github.href}
          label={socialLinks.github.label}
        >
          <IconGitHub className="h-5 w-5" />
        </SocialIconButton>
      </div>
    </aside>
  );
}
