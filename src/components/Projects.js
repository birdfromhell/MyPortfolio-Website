// src/components/Projects.js
import React from 'react';

function Projects() {
  const projects = [
    {
      title: "NotepadCloneWithJava",
      description: "Notepad Desktop App",
      link: "https://github.com/birdfromhell/NotepadCloneWithJava",
      image: "/images/project-image/notepad.png",
      tags: ["Java", "Java Swing"]
    },
    // ... other projects
  ];

  return (
    <section id="projects-section" className="fade-in">
      <div id="projects-wrapper">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-info">
              <h3>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  {project.title}
                </a>
                <br />
                <em> - {project.description} -</em>
              </h3>
              <div className="tags">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <img
              className="project-image"
              src={project.image}
              alt={project.title}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;