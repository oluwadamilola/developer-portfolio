import { useState } from "react";

function ProjectLink({ href, label, projectTitle }) {
  if (!href) {
    return (
      <span className="project-link project-link-unavailable">
        {label}
        <span className="project-link-status">Not added</span>
      </span>
    );
  }

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

  return (
    <article className="project-card">
      <div className="project-media">
        {hasImage ? (
          <img
            className="project-image"
            src={project.image}
            alt={project.imageAlt || `${project.title} project preview`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="project-image-placeholder" aria-hidden="true">
            <span className="preview-window">
              <span className="preview-window-bar">
                <i />
                <i />
                <i />
              </span>
              <span className="preview-window-content">
                <span />
                <span />
                <span />
              </span>
            </span>
            <span className="preview-caption">Preview to be added</span>
          </div>
        )}
        <span className="project-status">{project.status}</span>
      </div>

      <div className="project-card-content">
        <h3>{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <ul className="project-tags" aria-label={`${project.title} technologies`}>
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
        <div
          className="project-links"
          role="group"
          aria-label={`${project.title} links`}
        >
          <ProjectLink
            href={project.repositoryUrl}
            label="GitHub"
            projectTitle={project.title}
          />
          <ProjectLink
            href={project.liveDemoUrl}
            label="Live demo"
            projectTitle={project.title}
          />
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
