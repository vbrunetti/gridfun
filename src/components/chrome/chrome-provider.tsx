"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

type ChromeContextValue = {
  menuOpen: boolean;
  skeletonVisible: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  toggleSkeleton: () => void;
};

const ChromeContext = createContext<ChromeContextValue | null>(null);

const SKELETON_KEY = "gridfun-skeleton";

export function ChromeProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [skeletonVisible, setSkeletonVisible] = useState(false);
  const pathname = usePathname();

  /* /about ships with the overlay on (route default, not written to the
     stored preference); everywhere else follows the persisted toggle. */
  useEffect(() => {
    startTransition(() => {
      setSkeletonVisible(
        pathname === "/about" || localStorage.getItem(SKELETON_KEY) === "1",
      );
    });
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  const toggleSkeleton = useCallback(() => {
    setSkeletonVisible((visible) => {
      const next = !visible;
      localStorage.setItem(SKELETON_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "g" && event.key !== "G") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (
        target?.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      event.preventDefault();
      toggleSkeleton();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSkeleton]);

  const value = useMemo(
    () => ({
      menuOpen,
      skeletonVisible,
      openMenu,
      closeMenu,
      toggleMenu,
      toggleSkeleton,
    }),
    [
      menuOpen,
      skeletonVisible,
      openMenu,
      closeMenu,
      toggleMenu,
      toggleSkeleton,
    ],
  );

  return (
    <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>
  );
}

export function useChrome() {
  const context = useContext(ChromeContext);
  if (!context) {
    throw new Error("useChrome must be used within ChromeProvider");
  }
  return context;
}
