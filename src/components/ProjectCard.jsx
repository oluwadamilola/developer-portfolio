import { useState } from "react";

function ProjectLink({ href, label, projectTitle }) {
  return (
    <a
      className="project-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} for ${projectTitle} (opens in a new tab)`}
    >
      {label}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function ProjectCard({ project }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = project.image && !imageFailed;
  const links = [
    project.repositoryUrl && {
      href: project.repositoryUrl,
      label: "GitHub repository",
    },
    project.liveDemoUrl && {
      href: project.liveDemoUrl,
      label: "Live demo",
    },
  ].filter(Boolean);

  return (
    <article className="project-card">
      {hasImage && (
        <div className="project-media">
          <img
            className="project-image"
            src={project.image}
            alt={project.imageAlt || `${project.title} project preview`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        </div>
      )}

      <div className="project-card-content">
        <h3>{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <ul className="project-tags" aria-label={`${project.title} technologies`}>
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
        {links.length > 0 && (
          <div
            className="project-links"
            role="group"
            aria-label={`${project.title} links`}
          >
            {links.map((link) => (
              <ProjectLink
                key={link.label}
                href={link.href}
                label={link.label}
                projectTitle={project.title}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default ProjectCard;
