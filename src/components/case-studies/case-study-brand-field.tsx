"use client";

import { useState, type CSSProperties } from "react";
import type { CaseStudyBrand } from "@/content/portfolio";

type CaseStudyBrandFieldProps = {
  brand: CaseStudyBrand;
  client: string;
  clientLogo?: string;
  className?: string;
};

/**
 * Bright brand-color ground with a centered transparent logo (gif/png).
 * Falls back to the inline client logo or a lettermark when the asset is missing.
 */
export function CaseStudyBrandField({
  brand,
  client,
  clientLogo,
  className = "",
}: CaseStudyBrandFieldProps) {
  const candidates = [brand.logo, clientLogo].filter(
    (src): src is string => Boolean(src),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const src = activeIndex < candidates.length ? candidates[activeIndex] : null;

  return (
    <div
      className={`cs-index-brand-field ${className}`.trim()}
      style={{ "--cs-brand-field": brand.field } as CSSProperties}
      aria-hidden
    >
      <div className="cs-index-brand-field__glow" />
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- gif transparency + onError fallback
        <img
          src={src}
          alt=""
          className="cs-index-brand-field__logo"
          onError={() => setActiveIndex((index) => index + 1)}
        />
      ) : (
        <span className="cs-index-brand-field__wordmark">{client}</span>
      )}
    </div>
  );
}
