import type { Metadata } from "next";
import { CtaButton } from "@/components/chrome/cta-button";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";

export const metadata: Metadata = {
  title: "Contact",
};

const contacts = [
  { name: "You", role: "UX Designer", email: "hello@example.com" },
  { name: "Studio", role: "Collaboration", email: "studio@example.com" },
  { name: "Press", role: "Media", email: "press@example.com" },
];

export default function ContactPage() {
  return (
    <div className="theme-light">
      <header className="border-b border-[var(--rule-strong)] bg-[var(--surface-light)]">
        <RuledGrid className="py-12">
          <SiteGridSubgrid className="lg:items-end">
            <h1 className="display-xl grid-span-6 lg:grid-span-5">Contact</h1>
            <div className="grid-span-6 border-[var(--rule-strong)] lg:grid-span-7 lg:border-l lg:pl-8">
              <p className="text-sm leading-relaxed text-secondary">
                123 Grid Street
                <br />
                San Francisco, CA
                <br />
                +1 (000) 000-0000
              </p>
              <div className="mt-6">
                <CtaButton href="mailto:hello@example.com">Email me</CtaButton>
              </div>
            </div>
          </SiteGridSubgrid>
        </RuledGrid>
      </header>

      <RuledGrid>
        {contacts.map((person) => (
          <SiteGridSubgrid
            key={person.email}
            className="border-b border-[var(--rule-strong)] py-6"
          >
            <p className="grid-span-6 font-medium text-primary lg:grid-span-4">
              {person.name}
            </p>
            <p className="text-meta grid-span-6 text-secondary lg:grid-span-4">
              {person.role}
            </p>
            <a
              href={`mailto:${person.email}`}
              className="grid-span-6 text-sm text-secondary underline underline-offset-4 transition-opacity hover:opacity-60 lg:grid-span-4 lg:text-right"
            >
              {person.email}
            </a>
          </SiteGridSubgrid>
        ))}
        <p className="text-meta col-span-content py-10">
          © {new Date().getFullYear()} · Placeholder
        </p>
      </RuledGrid>
    </div>
  );
}
