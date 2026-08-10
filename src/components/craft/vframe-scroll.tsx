"use client";

import { useEffect, useRef, type ReactNode } from "react";

type VframeScrollProps = {
  className?: string;
  children: ReactNode;
};

/**
 * In-panel scroll band with directional soft-edge fades.
 * Fades sit outside the scrolling element (so content can't slide past them) and
 * only appear when there's more content in that direction.
 */
export function VframeScroll({ className, children }: VframeScrollProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const scroller = scrollRef.current;
    if (!shell || !scroller) return;

    const sync = () => {
      const { scrollTop, scrollHeight, clientHeight } = scroller;
      const eps = 2;
      shell.toggleAttribute("data-overflow-top", scrollTop > eps);
      shell.toggleAttribute(
        "data-overflow-bottom",
        scrollTop + clientHeight < scrollHeight - eps,
      );
    };

    const ro = new ResizeObserver(sync);
    const observeTree = () => {
      ro.observe(scroller);
      for (const child of scroller.children) ro.observe(child);
      sync();
    };

    observeTree();
    scroller.addEventListener("scroll", sync, { passive: true });

    const mo = new MutationObserver(observeTree);
    mo.observe(scroller, { childList: true, subtree: true });

    return () => {
      scroller.removeEventListener("scroll", sync);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div ref={shellRef} className="vframe__scroll-shell">
      <div
        ref={scrollRef}
        className={className ? `vframe__scroll ${className}` : "vframe__scroll"}
      >
        {children}
      </div>
      <div className="vframe__scroll-fade vframe__scroll-fade--top" aria-hidden />
      <div
        className="vframe__scroll-fade vframe__scroll-fade--bottom"
        aria-hidden
      />
    </div>
  );
}
