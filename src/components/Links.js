// src/components/Links.js
import React from 'react';

function Links() {
  const links = [
    {
      title: "GitHub",
      url: "https://github.com/birdfromhell",
      icon: "fab fa-github"
    },
    {
      title: "LinkedIn",
      url: "#",
      icon: "fab fa-linkedin"
    },
    {
      title: "Email",
      url: "mailto:your.email@example.com",
      icon: "fas fa-envelope"
    },
    {
      title: "Portfolio",
      url: "#",
      icon: "fas fa-globe"
    }
  ];

  return (
    <section id="links-section" className="section">
      <h2>Links</h2>
      <div>
        {links.map((link, index) => (
          <a 
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className={link.icon}></i>
            {link.title}
          </a>
        ))}
      </div>
    </section>
  );
}

export default Links;