import Link from "next/link";
import type { DummyProject } from "@/lib/nav";

const accentSurface: Record<DummyProject["accent"], string> = {
  paper: "bg-[var(--surface-light)]",
  white: "bg-[var(--surface-white)]",
  canvas: "theme-canvas",
};

type ProjectCardProps = {
  project: DummyProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group relative flex w-[min(85vw,var(--media-column))] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-[var(--rule-strong)] ${accentSurface[project.accent]} scroll-ml-[var(--grid-margin)]`}
      style={{ aspectRatio: "9 / 16" }}
    >
      <div className="flex items-start justify-between border-b border-[var(--rule-strong)] p-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--rule-strong)] text-xs font-semibold">
          {project.index}
        </span>
        <span className="text-meta opacity-80">Case study</span>
      </div>

      <div className="flex flex-1 flex-col justify-end p-4">
        <div className="mb-auto flex flex-1 items-center justify-center p-6">
          <div
            className="h-24 w-24 rounded-full border-2 border-[var(--accent)] opacity-40"
            aria-hidden
          />
        </div>
        <h2 className="text-xl font-medium tracking-tight text-primary">
          {project.title}
        </h2>
        <p className="text-meta mt-1">{project.subtitle}</p>
      </div>

      <div className="border-t border-[var(--rule-strong)] p-4">
        <span className="text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          View project →
        </span>
      </div>
    </Link>
  );
}
