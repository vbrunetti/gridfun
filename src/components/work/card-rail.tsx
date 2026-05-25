import { dummyProjects } from "@/lib/nav";
import { ProjectCard } from "./project-card";

export function CardRail() {
  return (
    <section aria-label="Project gallery">
      <div className="card-rail">
        {dummyProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
