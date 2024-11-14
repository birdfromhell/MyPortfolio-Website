// src/components/GoBackButton.js
import React from 'react';

function GoBackButton({ onClick }) {
  return (
    <button 
      id="go-back-button" 
      style={{ display: 'none' }}
      onClick={onClick}
    >
      Go Back
    </button>
  );
}

export default GoBackButton;