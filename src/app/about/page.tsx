import type { Metadata } from "next";
import Link from "next/link";
import { RuledGrid } from "@/components/layout/ruled-grid";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
};

const sectionHeadingClass = "display-sm mt-3";

export default function AboutPage() {
  const { about } = site;
  const { superpower, octopus, philosophy, testimonials, experience, education } = about;

  return (
    <div className="theme-white min-h-[100dvh]" data-chrome-surface="light">
      {/* Hero */}
      <RuledGrid className="py-[var(--grid-row-gap)]">
        <div className="col-span-hero">
          <p className="text-meta">{about.eyebrow}</p>
          <h1 className="display-xl mt-4 max-w-[18ch]">{about.headline}</h1>
        </div>
        <div className="col-span-narrow">
          <p className="body-lg mt-8 text-secondary">{about.intro}</p>
        </div>
      </RuledGrid>

      {/* Superpower */}
      <RuledGrid className="keyline-t py-[var(--grid-row-gap)]">
        <div className="col-span-content">
          <p className="text-meta">{superpower.kicker}</p>
          <h2 className={`${sectionHeadingClass} max-w-[24ch]`}>{superpower.heading}</h2>
          <p className="body-md mt-6 max-w-[60ch] text-secondary">{superpower.body}</p>
          <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {superpower.examples.map((example) => (
              <li key={example.company} className="keyline-t pt-4">
                {example.href ? (
                  <Link
                    href={example.href}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {example.company}
                  </Link>
                ) : (
                  <span className="font-medium text-primary">{example.company}</span>
                )}
                <p className="body-md mt-2 text-secondary">{example.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </RuledGrid>

      {/* Octopus-shaped */}
      <RuledGrid className="keyline-t py-[var(--grid-row-gap)]">
        <div className="col-span-content">
          <p className="text-meta">{octopus.kicker}</p>
          <h2 className={sectionHeadingClass}>{octopus.heading}</h2>
          <p className="body-md mt-6 max-w-[60ch] text-secondary">{octopus.body}</p>
        </div>
      </RuledGrid>

      {/* Management philosophy */}
      <RuledGrid className="keyline-t py-[var(--grid-row-gap)]">
        <div className="col-span-content">
          <p className="text-meta">{philosophy.kicker}</p>
          <h2 className={sectionHeadingClass}>{philosophy.heading}</h2>
          <p className="body-md mt-6 max-w-[60ch] text-secondary">{philosophy.body}</p>
          <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {philosophy.values.map((value) => (
              <li key={value} className="keyline-t body-sm pt-3 font-medium text-primary">
                {value}
              </li>
            ))}
          </ul>
        </div>
      </RuledGrid>

      {/* Testimonials */}
      <RuledGrid className="keyline-t py-[var(--grid-row-gap)]">
        <div className="col-span-content">
          <p className="text-meta">{testimonials.kicker}</p>
          <div className="mt-8 grid gap-x-10 gap-y-10 lg:grid-cols-3">
            {testimonials.items.map((item) => (
              <figure key={item.author} className="keyline-t pt-5">
                <blockquote className="body-md text-secondary">
                  {item.quote}
                </blockquote>
                <figcaption className="body-sm mt-4 font-medium text-primary">
                  {item.author}
                </figcaption>
              </figure>
            ))}
          </div>
          <a
            href={testimonials.linkedinHref}
            target="_blank"
            rel="noreferrer"
            className="text-meta mt-10 inline-block text-secondary underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            More on LinkedIn
          </a>
        </div>
      </RuledGrid>

      {/* Work experience */}
      <RuledGrid className="keyline-t py-[var(--grid-row-gap)]">
        <div className="col-span-content">
          <p className="text-meta">{experience.kicker}</p>
          <div className="mt-8 flex flex-col">
            {experience.roles.map((role) => (
              <article
                key={`${role.org}-${role.period}`}
                className="keyline-t grid gap-x-8 gap-y-4 py-8 lg:grid-cols-12"
              >
                <header className="lg:col-span-4">
                  <h3 className="heading-lg">{role.title}</h3>
                  <p className="body-sm mt-1 text-primary">{role.org}</p>
                  <p className="text-meta mt-2 text-secondary">{role.period}</p>
                </header>
                <div className="lg:col-span-8">
                  <p className="body-md max-w-[60ch] text-secondary">{role.summary}</p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {role.achievements.map((achievement) => (
                      <li
                        key={achievement}
                        className="body-sm max-w-[64ch] pl-4 text-secondary before:-ml-4 before:inline-block before:w-4 before:text-secondary before:content-['—']"
                      >
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          <a
            href={experience.resumeHref}
            target="_blank"
            rel="noreferrer"
            className="text-meta mt-2 inline-block text-secondary underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            View full resume
          </a>
        </div>
      </RuledGrid>

      {/* Education */}
      <RuledGrid className="keyline-t py-[var(--grid-row-gap)]">
        <div className="col-span-content">
          <p className="text-meta">{education.kicker}</p>
          <div className="mt-6 flex flex-col gap-1">
            <h3 className="heading-lg">{education.school}</h3>
            <p className="body-md text-secondary">{education.program}</p>
            <p className="body-md mt-1 text-secondary">
              {education.degree}
              <span className="text-meta ml-3 text-secondary">{education.period}</span>
            </p>
          </div>
        </div>
      </RuledGrid>

      {/* Sign-off */}
      <RuledGrid className="keyline-t py-[var(--grid-row-gap)]">
        <p className="display-xl col-span-content max-w-[16ch]">{about.signoff}</p>
      </RuledGrid>
    </div>
  );
}
