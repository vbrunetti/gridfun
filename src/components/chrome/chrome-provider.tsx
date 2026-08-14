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
  labNavVisible: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  toggleSkeleton: () => void;
  toggleLabNav: () => void;
};

const ChromeContext = createContext<ChromeContextValue | null>(null);

const SKELETON_KEY = "gridfun-skeleton";
const LAB_NAV_KEY = "gridfun-lab-nav";

function isTypingTarget(target: EventTarget | null) {
  return Boolean(
    (target as HTMLElement | null)?.closest(
      "input, textarea, select, [contenteditable='true']",
    ),
  );
}

export function ChromeProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [skeletonVisible, setSkeletonVisible] = useState(false);
  const [labNavVisible, setLabNavVisible] = useState(false);
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
    startTransition(() => {
      setLabNavVisible(localStorage.getItem(LAB_NAV_KEY) === "1");
    });
  }, []);

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

  const toggleLabNav = useCallback(() => {
    setLabNavVisible((visible) => {
      const next = !visible;
      localStorage.setItem(LAB_NAV_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      if (event.key === "g" || event.key === "G") {
        event.preventDefault();
        toggleSkeleton();
        return;
      }

      if (event.key === "x" || event.key === "X") {
        event.preventDefault();
        toggleLabNav();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSkeleton, toggleLabNav]);

  const value = useMemo(
    () => ({
      menuOpen,
      skeletonVisible,
      labNavVisible,
      openMenu,
      closeMenu,
      toggleMenu,
      toggleSkeleton,
      toggleLabNav,
    }),
    [
      menuOpen,
      skeletonVisible,
      labNavVisible,
      openMenu,
      closeMenu,
      toggleMenu,
      toggleSkeleton,
      toggleLabNav,
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
