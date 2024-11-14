import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <>
      <div id="header-name-ldm">
        <Link to="/">
          <h1 id="name">Ababil</h1>
        </Link>
        <span id="switch-ldm-logo">
          <div id="switch-container" onClick={() => setIsDarkMode(!isDarkMode)}>
            <img src="/images/moon.svg" alt="" />
          </div>
        </span>
      </div>

      <p id="slogan">Backend Developer</p>

      <header id="menu">
        <p><Link to="/">About Me</Link></p>
        <p><Link to="/skills">Skills</Link></p>
        <p><Link to="/projects">Projects</Link></p>
        <p><Link to="/links">Links</Link></p>
      </header>
    </>
  );
}

export default Header;