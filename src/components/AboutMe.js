// src/components/AboutMe.js
import React from 'react';

function AboutMe() {
  return (
    <>
      <section id="about-me-intro-section" className="section">
        <p>
          Hi! I'm a passionate Software Engineer from Indonesia.
          I love working with various technologies and creating innovative solutions.
        </p>
      </section>

      <section id="about-me-section" className="section">
        <h2>About Me</h2>
        <p>
          I am a software engineer with expertise in full-stack development.
          I enjoy building applications using modern technologies and best practices.
          My goal is to create efficient, scalable, and user-friendly solutions.
        </p>
        <a href="https://github.com/birdfromhell" target="_blank" rel="noopener noreferrer">
          View My GitHub Profile
        </a>
      </section>
    </>
  );
}

export default AboutMe;