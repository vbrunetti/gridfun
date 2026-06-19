"use client";

import { useEffect, useState } from "react";

export function ScrollHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 1800);

    const hide = () => setVisible(false);

    window.addEventListener("scroll", hide, { passive: true, once: true });
    window.addEventListener("touchstart", hide, { passive: true, once: true });
    window.addEventListener("pointerdown", hide, { passive: true, once: true });

    const autoHide = setTimeout(() => setVisible(false), 7000);

    return () => {
      clearTimeout(show);
      clearTimeout(autoHide);
      window.removeEventListener("scroll", hide);
      window.removeEventListener("touchstart", hide);
      window.removeEventListener("pointerdown", hide);
    };
  }, []);

  return (
    <div
      className={`scroll-hint${visible ? " scroll-hint--visible" : ""}`}
      aria-hidden
    >
      <svg
        className="scroll-hint__arrow"
        width="10"
        height="18"
        viewBox="0 0 10 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="5" y1="0" x2="5" y2="13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <polyline points="1.5,10 5,14.5 8.5,10" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="scroll-hint__label">scroll</span>
    </div>
  );
}
