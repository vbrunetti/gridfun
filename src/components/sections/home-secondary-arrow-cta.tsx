import Link from "next/link";
import { site } from "@/content/site";

export function HomeSecondaryArrowCta() {
  const { cta } = site.home.secondary;

  return (
    <Link href={cta.href} className="home-secondary-arrow-btn" aria-label={cta.label}>
      <span className="sr-only">{cta.screenReaderLabel}</span>
      <span className="home-secondary-arrow-btn__icon" aria-hidden>
        →
      </span>
    </Link>
  );
}
