import type { Metadata } from "next";
import { CtaButton } from "@/components/chrome/cta-button";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { SiteGridSubgrid } from "@/components/layout/site-grid";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  const { contact } = site;

  return (
    <div className="theme-light" data-chrome-surface="light">
      <header className="keyline-b bg-[var(--surface-light)]">
        <RuledGrid className="py-12">
          <SiteGridSubgrid className="lg:items-end">
            <h1 className="display-xl grid-span-6 lg:grid-span-5">{contact.headline}</h1>
            <div className="grid-span-6 border-[var(--rule-strong)] lg:grid-span-7 lg:border-l lg:pl-8">
              <p className="text-sm leading-relaxed text-secondary">
                {contact.address.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
                {contact.phone}
              </p>
              <div className="mt-6">
                <CtaButton href={contact.primaryCta.href}>{contact.primaryCta.label}</CtaButton>
              </div>
            </div>
          </SiteGridSubgrid>
        </RuledGrid>
      </header>

      <RuledGrid>
        {contact.people.map((person) => (
          <SiteGridSubgrid key={person.email} className="keyline-b py-6">
            <p className="grid-span-6 font-medium text-primary lg:grid-span-4">{person.name}</p>
            <p className="text-meta grid-span-6 text-secondary lg:grid-span-4">{person.role}</p>
            <a
              href={`mailto:${person.email}`}
              className="grid-span-6 text-sm text-secondary underline underline-offset-4 transition-opacity hover:opacity-60 lg:grid-span-4 lg:text-right"
            >
              {person.email}
            </a>
          </SiteGridSubgrid>
        ))}
        <p className="text-meta col-span-content py-10">
          © {new Date().getFullYear()} · {contact.footerNote}
        </p>
      </RuledGrid>
    </div>
  );
}
