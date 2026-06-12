import Link from "next/link";
import { DesignSystemReference } from "./design-system-reference";

export default function DesignSystemPage() {
  return (
    <div className="theme-light py-[var(--grid-row-gap)]" data-chrome-surface="light">
      <section className="keyline-b mx-auto mb-12 max-w-[90rem] px-[var(--grid-margin)] pb-10">
        <p className="text-meta">Case study patterns documented below</p>
        <p className="mt-3 text-sm text-secondary">
          Vignette filmstrip panels, hero masthead, focus dimming, and scroll
          behavior live in{" "}
          <a href="#case-study" className="border-b border-current text-primary">
            §07 Case study
          </a>
          . Spark particles and mercury orb live under{" "}
          <Link href="/effects" className="border-b border-current text-primary">
            Effects
          </Link>
          .
        </p>
      </section>
      <DesignSystemReference />
    </div>
  );
}
