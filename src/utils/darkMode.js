// src/utils/darkMode.js
export const getDarkMode = () => {
    return JSON.parse(localStorage.getItem('darkMode')) || false;
  };
  
  export const setDarkMode = (value) => {
    localStorage.setItem('darkMode', JSON.stringify(value));
  };
  