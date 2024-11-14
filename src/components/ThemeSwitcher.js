// src/components/ThemeSwitcher.js
import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

function ThemeSwitcher() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const getIconSrc = () => {
    if (isDarkMode) {
      return isHovered ? "/images/sun-filled.svg" : "/images/sun.svg";
    }
    return isHovered ? "/images/moon-full.svg" : "/images/moon.svg";
  };

  return (
    <div id="switch-container">
      <img
        src={getIconSrc()}
        alt="theme switcher"
        onClick={toggleTheme}
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
      />
    </div>
  );
}

export default ThemeSwitcher;