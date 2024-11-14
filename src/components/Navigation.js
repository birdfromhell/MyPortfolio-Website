// src/components/Navigation.js
import React, { useState } from 'react';

function Navigation({ activeSection, setActiveSection }) {
  const isMobile = window.matchMedia("(max-width: 500px)").matches;

  const handleClick = (section, event) => {
    event.preventDefault();
    setActiveSection(section);
  };

  return (
    <nav id="menu">
      <a
        id="about-me"
        href="#about"
        className={activeSection === 'about-me-section' ? 'active' : ''}
        onClick={(e) => handleClick('about-me-section', e)}
      >
        about me
      </a>
      <a
        id="skills"
        href="#skills"
        className={activeSection === 'skills-section' ? 'active' : ''}
        onClick={(e) => handleClick('skills-section', e)}
      >
        skills
      </a>
      <a
        id="projects"
        href="#projects"
        className={activeSection === 'projects-section' ? 'active' : ''}
        onClick={(e) => handleClick('projects-section', e)}
      >
        projects
      </a>
      <a
        id="links"
        href="#links"
        className={activeSection === 'links-section' ? 'active' : ''}
        onClick={(e) => handleClick('links-section', e)}
      >
        links
      </a>
    </nav>
  );
}

export default Navigation;