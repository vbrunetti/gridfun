"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteGrid, SiteGridCell } from "@/components/layout/site-grid";
import { isNavSection, menuNav } from "@/content/site";
import { useChrome } from "./chrome-provider";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MenuOverlay() {
  const pathname = usePathname();
  const { menuOpen, closeMenu } = useChrome();

  if (!menuOpen) {
    return null;
  }

  return (
    <div
      id="site-menu"
      className="theme-dark fixed inset-0 z-[70] lg:pl-[var(--rail-width)]"
      data-chrome-surface="dark"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div className="flex h-full flex-col border-l border-rule-light">
        <div className="flex flex-1 items-center overflow-y-auto py-12 pt-[var(--chrome-top-offset)] lg:pt-12">
          <SiteGrid className="w-full">
            <SiteGridCell span="main">
              <nav aria-label="Main menu">
                <ul className="space-y-1">
                  {menuNav.map((item) => {
                    if (isNavSection(item)) {
                      const sectionActive = isActive(pathname, item.href);

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={closeMenu}
                            aria-current={sectionActive ? "page" : undefined}
                            className={`display-lg block py-3 transition-opacity hover:opacity-70 ${
                              sectionActive ? "text-accent" : "text-primary"
                            }`}
                          >
                            {item.label}
                          </Link>
                          <ul className="mb-2 space-y-0.5 pl-1">
                            {item.children.map((child) => {
                              const childActive = isActive(pathname, child.href);
                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={closeMenu}
                                    aria-current={childActive ? "page" : undefined}
                                    className={`heading-lg block py-2 transition-opacity hover:opacity-70 ${
                                      childActive ? "text-accent" : "text-secondary"
                                    }`}
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    }

                    const active = isActive(pathname, item.href);

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          aria-current={active ? "page" : undefined}
                          className={`display-lg block py-3 transition-opacity hover:opacity-70 ${
                            active ? "text-accent" : "text-primary"
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
      </div>
    </div>
  );
}
