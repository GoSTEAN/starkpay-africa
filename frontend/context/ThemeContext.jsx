// "use client";

// import { createContext, useContext, useEffect, useState } from 'react';

// const ThemeContext = createContext();

// const colorSchemes = {
//   light: {
//     background: '#e2e0e0',
//     text: '#111827',
//     primary: '#8F6DF5',
//     secondary: '#e5e7eb',
//     gradient: 'linear-gradient(253.67deg, rgba(243, 244, 246, 0.1) 18.27%, rgba(255, 255, 255, 0.1) 91.93%)'
//   },
//   dark: {
//     background: '#212324',
//     text: '#f3f4f6',
//     primary: '#8F6DF5',
//     secondary: '#515151',
//     gradient: 'linear-gradient(253.67deg, rgba(143, 109, 245, 0.1) 18.27%, rgba(33, 35, 36, 0.1) 91.93%)'
//   }
// };

// export function ThemeProvider({ children }) {
//   const [theme, setTheme] = useState('light');

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme') || 'light';
//     setTheme(savedTheme);
//     applyTheme(savedTheme);
//   }, []);

//   const applyTheme = (themeName) => {
//     const colors = colorSchemes[themeName];
//     Object.entries(colors).forEach(([key, value]) => {
//       document.documentElement.style.setProperty(`--${key}-color`, value);
//     });
//     document.documentElement.setAttribute('data-theme', themeName);
//   };

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//     applyTheme(newTheme);
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme, colors: colorSchemes[theme] }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   return useContext(ThemeContext);
// }