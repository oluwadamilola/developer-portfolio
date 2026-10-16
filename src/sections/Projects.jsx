import ProjectCard from "../components/ProjectCard.jsx";
import projects from "../data/projects.js";

function Projects() {
  return (
    <section
      className="projects-section section-wrap"
      id="projects"
      aria-labelledby="projects-title"
    >
      <div className="projects-heading">
        <div>
          <p className="eyebrow">Selected work</p>
          <h2 id="projects-title">Selected Work</h2>
        </div>
        <p className="projects-intro">
          These project concepts demonstrate an approach to building practical,
          maintainable software. The examples below are placeholders to be
          completed or replaced.
        </p>
      </div>
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
