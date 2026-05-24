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

  useEffect(() => {
    startTransition(() => {
      setSkeletonVisible(localStorage.getItem(SKELETON_KEY) === "1");
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
