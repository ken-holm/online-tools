import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Load preferences from localStorage or use defaults
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('app-theme');
    return savedTheme ? JSON.parse(savedTheme) : {
      background: 'bg-gradient-to-br from-gray-900 to-gray-800',
      font: 'font-sans', // Inter
      customBackground: null, // For future image support
      alarmSound: 'beep', // Default alarm sound
    };
  });

  useEffect(() => {
    localStorage.setItem('app-theme', JSON.stringify(theme));
  }, [theme]);

  const updateBackground = (bgClass) => {
    setTheme(prev => ({ ...prev, background: bgClass }));
  };

  const updateFont = (fontClass) => {
    setTheme(prev => ({ ...prev, font: fontClass }));
  };

  const updateAlarmSound = (sound) => {
    setTheme(prev => ({ ...prev, alarmSound: sound }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateBackground, updateFont, updateAlarmSound }}>
      {children}
    </ThemeContext.Provider>
  );
};
