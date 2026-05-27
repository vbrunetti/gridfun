import Link from "next/link";
import { effectsNav } from "@/lib/nav";

export default function EffectsIndexPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-[var(--grid-margin)] py-12 pb-24">
      <header className="border-b border-[var(--rule-strong)] pb-10">
        <p className="text-meta">Hero background experiments</p>
        <h1 className="display-lg mt-3">{effectsNav.label}</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-secondary">
          Prototype directions for the home hero — tune each in its playground,
          then wire the winner into scroll chapters.
        </p>
      </header>

      <ul className="mt-10 divide-y divide-[var(--rule-light)] border-y border-[var(--rule-light)]">
        {effectsNav.children.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-baseline justify-between gap-4 py-6 transition-opacity hover:opacity-70"
            >
              <span className="text-xl font-medium text-primary group-hover:underline">
                {item.label}
              </span>
              <span className="text-meta text-tertiary">Open →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
