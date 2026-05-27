"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chromeTopBandClassName } from "@/components/chrome/chrome-top-band";
import { effectsNav } from "@/lib/nav";

export function EffectsSubnav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Effects experiments"
      className={`${chromeTopBandClassName} border-b border-[var(--rule-strong)] bg-[var(--surface-light)]`}
    >
      <div className="mx-auto flex h-full w-full max-w-[90rem] flex-wrap items-center gap-x-6 gap-y-2 px-[var(--grid-margin)]">
        <Link
          href={effectsNav.href}
          className={`text-meta transition-opacity hover:opacity-70 ${
            pathname === effectsNav.href
              ? "text-primary"
              : "text-tertiary"
          }`}
        >
          {effectsNav.label}
        </Link>
        <span className="hidden text-tertiary sm:inline" aria-hidden>
          /
        </span>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {effectsNav.children.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-sm transition-opacity hover:opacity-70 ${
                    active
                      ? "border-b border-current text-primary"
                      : "text-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
