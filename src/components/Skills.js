// src/components/Skills.js
import React from 'react';

function Skills() {
  const skillCategories = [
    {
      title: "Programming Languages",
      skills: ["Python", "Java", "JavaScript", "PHP"]
    },
    {
      title: "Web Technologies",
      skills: ["HTML", "CSS", "React", "Node.js"]
    },
    {
      title: "Tools & Frameworks",
      skills: ["Git", "Docker", "Django", "Spring Boot"]
    },
    {
      title: "Databases",
      skills: ["MySQL", "PostgreSQL", "MongoDB"]
    }
  ];

  return (
    <section id="skills-section" className="section">
      <h2>Skills</h2>
      <article>
        {skillCategories.map((category, index) => (
          <section key={index}>
            <h4>{category.title}</h4>
            <ul>
              {category.skills.map((skill, skillIndex) => (
                <li key={skillIndex}>{skill}</li>
              ))}
            </ul>
          </section>
        ))}
      </article>
    </section>
  );
}

export default Skills;