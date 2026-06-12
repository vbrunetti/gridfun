import Link from "next/link";

export function HomeSecondaryArrowCta() {
  return (
    <Link
      href="/case-studies"
      className="home-secondary-arrow-btn"
      aria-label="View case studies"
    >
      <span className="sr-only">Case studies</span>
      <span className="home-secondary-arrow-btn__icon" aria-hidden>
        →
      </span>
    </Link>
  );
}
