"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteGrid, SiteGridCell } from "@/components/layout/site-grid";
import { menuNav } from "@/lib/nav";
import { useChrome } from "./chrome-provider";

export function MenuOverlay() {
  const pathname = usePathname();
  const { menuOpen, closeMenu, skeletonVisible, toggleSkeleton } = useChrome();

  if (!menuOpen) {
    return null;
  }

  return (
    <div
      id="site-menu"
      className="theme-dark fixed inset-0 z-[70] lg:pl-[var(--rail-width)]"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div className="flex h-full flex-col border-l border-[var(--section-dark-rule)]">
        <div className="flex flex-1 items-center overflow-y-auto py-12 pt-[var(--chrome-top-offset)] lg:pt-12">
          <SiteGrid className="w-full">
            <SiteGridCell span="main">
              <nav aria-label="Main menu">
                <ul className="space-y-1">
                  {menuNav.map((item) => {
                    const active =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className={`block py-3 text-4xl font-semibold tracking-tight transition-opacity hover:opacity-70 md:text-6xl ${
                            active
                              ? "text-[var(--color-orange)]"
                              : "text-primary"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </SiteGridCell>
          </SiteGrid>
        </div>

        <SiteGrid className="border-t border-[var(--section-dark-rule)] py-4">
          <SiteGridCell span="main">
            <button
              type="button"
              onClick={toggleSkeleton}
              className="text-meta text-tertiary transition-opacity hover:text-secondary"
              aria-pressed={skeletonVisible}
            >
              {skeletonVisible ? "Hide grid" : "Show grid"}
            </button>
          </SiteGridCell>
        </SiteGrid>
      </div>
    </div>
  );
}
