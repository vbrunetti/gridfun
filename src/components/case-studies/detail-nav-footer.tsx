import Link from "next/link";
import { CtaButton } from "@/components/chrome/cta-button";
import { SiteGridSubgrid } from "@/components/layout/site-grid";

export type DetailNavLink = {
  href: string;
  label: string;
  kicker: string;
};

type DetailNavFooterProps = {
  previous?: DetailNavLink;
  next?: DetailNavLink;
  fallback?: { href: string; label: string };
};

export function DetailNavFooter({
  previous,
  next,
  fallback,
}: DetailNavFooterProps) {
  const dual = Boolean(previous && next);
  const prevWithFallback = Boolean(previous && !next && fallback);

  return (
    <SiteGridSubgrid className="cs-detail-footer">
      {previous ? (
        <>
          <p
            className={`cs-detail-footer__kicker text-meta cs-detail-footer__kicker--prev`}
          >
            {previous.kicker}
          </p>
          <Link
            href={previous.href}
            className="cs-detail-footer__title display-lg cs-detail-footer__title--prev transition-opacity hover:opacity-70"
          >
            {previous.label}
          </Link>
        </>
      ) : null}

      {next ? (
        <>
          <p
            className={`cs-detail-footer__kicker text-meta${
              dual ? " cs-detail-footer__kicker--next" : " cs-detail-footer__kicker--solo"
            }`}
          >
            {next.kicker}
          </p>
          <Link
            href={next.href}
            className={`cs-detail-footer__title display-lg transition-opacity hover:opacity-70${
              dual ? " cs-detail-footer__title--next" : " cs-detail-footer__title--solo"
            }`}
          >
            {next.label}
          </Link>
        </>
      ) : fallback ? (
        <div
          className={`cs-detail-footer__fallback${
            prevWithFallback ? " cs-detail-footer__fallback--end" : ""
          }`}
        >
          <CtaButton href={fallback.href} variant="ghost">
            {fallback.label}
          </CtaButton>
        </div>
      ) : null}
    </SiteGridSubgrid>
  );
}
