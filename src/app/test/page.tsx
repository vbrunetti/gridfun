import Link from "next/link";
import { DesignSystemReference } from "./design-system-reference";

export default function TestPage() {
  return (
    <div className="theme-light py-[var(--grid-row-gap)]" data-chrome-surface="light">
      <section className="keyline-b mx-auto mb-12 max-w-[90rem] px-[var(--grid-margin)] pb-10">
        <p className="text-meta">Hero experiments moved</p>
        <p className="mt-3 text-sm text-secondary">
          Spark particles and mercury orb live under{" "}
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
