"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { CaseStudyBrand } from "@/content/portfolio";
import { clientBrandColorVar } from "@/lib/client-brand-colors";

type CaseStudyBrandFieldProps = {
  brand: CaseStudyBrand;
  clientLogo?: string;
  className?: string;
};

function BrandLogoPlaceholder() {
  return (
    <svg
      className="cs-index-brand-field__placeholder"
      viewBox="0 0 100 100"
      aria-hidden
    >
      <circle cx="50" cy="50" r="50" fill="white" fillOpacity="0.5" />
    </svg>
  );
}

/** Bright brand-color ground with a centered transparent logo (gif/png). */
export function CaseStudyBrandField({
  brand,
  clientLogo,
  className = "",
}: CaseStudyBrandFieldProps) {
  const candidates = [brand.logo, clientLogo].filter(
    (src): src is string => Boolean(src),
  );
  const [tryIndex, setTryIndex] = useState(0);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const trySrc = tryIndex < candidates.length ? candidates[tryIndex]! : null;

  useEffect(() => {
    setTryIndex(0);
    setLoadedSrc(null);
  }, [brand.logo, clientLogo]);

  useEffect(() => {
    if (!trySrc) {
      setLoadedSrc(null);
      return;
    }

    let cancelled = false;
    const probe = new Image();

    probe.onload = () => {
      if (!cancelled) setLoadedSrc(trySrc);
    };
    probe.onerror = () => {
      if (!cancelled) setTryIndex((index) => index + 1);
    };
    probe.src = trySrc;

    return () => {
      cancelled = true;
    };
  }, [trySrc]);

  return (
    <div
      className={`cs-index-brand-field ${className}`.trim()}
      style={{ "--cs-brand-field": clientBrandColorVar(brand.field) } as CSSProperties}
      aria-hidden
    >
      {loadedSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- gif transparency
        <img
          src={loadedSrc}
          alt=""
          className="cs-index-brand-field__logo"
        />
      ) : (
        <BrandLogoPlaceholder />
      )}
    </div>
  );
}
