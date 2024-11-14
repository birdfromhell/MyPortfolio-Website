// src/App.js
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import ThemeSwitcher from './components/ThemeSwitcher';
import AboutMe from './components/AboutMe';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Links from './components/Links';
import './style/style.css';
import './style/mobile.css';

function App() {
  const [activeSection, setActiveSection] = useState('about-me-section');

  const renderSection = () => {
    switch (activeSection) {
      case 'about-me-section':
        return <AboutMe />;
      case 'skills-section':
        return <Skills />;
      case 'projects-section':
        return <Projects />;
      case 'links-section':
        return <Links />;
      default:
        return <AboutMe />;
    }
  };

  return (
    <div className="App">
      <div className="watermark">ABABIL</div>
      <div className="watermark">MUSTAX</div>
      <div className="watermark">ABABIL</div>
      
      <ThemeSwitcher />
      <div id="header-name-ldm">
        <h1 id="name">Ababil Mustax</h1>
        <p id="slogan">Software Engineer</p>
      </div>
      
      <Navigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      
      {renderSection()}
    </div>
  );
}

export default App;