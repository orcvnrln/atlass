import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-black');
    
    // Add new theme class
    root.classList.add(`theme-${themeName}`);
    
    // Set CSS variables based on theme
    switch (themeName) {
      case 'light':
        root.style.setProperty('--background', '250 250 249'); // stone-50
        root.style.setProperty('--foreground', '12 10 9'); // stone-950
        root.style.setProperty('--card', '255 255 255'); // white
        root.style.setProperty('--card-foreground', '12 10 9'); // stone-950
        root.style.setProperty('--popover', '255 255 255'); // white
        root.style.setProperty('--popover-foreground', '12 10 9'); // stone-950
        root.style.setProperty('--primary', '12 10 9'); // stone-950
        root.style.setProperty('--primary-foreground', '250 250 249'); // stone-50
        root.style.setProperty('--secondary', '245 245 244'); // stone-100
        root.style.setProperty('--secondary-foreground', '12 10 9'); // stone-950
        root.style.setProperty('--muted', '245 245 244'); // stone-100
        root.style.setProperty('--muted-foreground', '120 113 108'); // stone-500
        root.style.setProperty('--accent', '245 245 244'); // stone-100
        root.style.setProperty('--accent-foreground', '12 10 9'); // stone-950
        root.style.setProperty('--destructive', '239 68 68'); // red-500
        root.style.setProperty('--destructive-foreground', '250 250 249'); // stone-50
        root.style.setProperty('--border', '231 229 228'); // stone-200
        root.style.setProperty('--input', '231 229 228'); // stone-200
        root.style.setProperty('--ring', '12 10 9'); // stone-950
        break;
        
      case 'dark':
        root.style.setProperty('--background', '2 6 23'); // slate-950
        root.style.setProperty('--foreground', '248 250 252'); // slate-50
        root.style.setProperty('--card', '15 23 42'); // slate-900
        root.style.setProperty('--card-foreground', '248 250 252'); // slate-50
        root.style.setProperty('--popover', '15 23 42'); // slate-900
        root.style.setProperty('--popover-foreground', '248 250 252'); // slate-50
        root.style.setProperty('--primary', '59 130 246'); // blue-500
        root.style.setProperty('--primary-foreground', '248 250 252'); // slate-50
        root.style.setProperty('--secondary', '30 41 59'); // slate-800
        root.style.setProperty('--secondary-foreground', '248 250 252'); // slate-50
        root.style.setProperty('--muted', '30 41 59'); // slate-800
        root.style.setProperty('--muted-foreground', '148 163 184'); // slate-400
        root.style.setProperty('--accent', '30 41 59'); // slate-800
        root.style.setProperty('--accent-foreground', '248 250 252'); // slate-50
        root.style.setProperty('--destructive', '239 68 68'); // red-500
        root.style.setProperty('--destructive-foreground', '248 250 252'); // slate-50
        root.style.setProperty('--border', '51 65 85'); // slate-700
        root.style.setProperty('--input', '51 65 85'); // slate-700
        root.style.setProperty('--ring', '59 130 246'); // blue-500
        break;
        
      case 'black':
        root.style.setProperty('--background', '0 0 0'); // black
        root.style.setProperty('--foreground', '255 255 255'); // white
        root.style.setProperty('--card', '23 23 23'); // neutral-900
        root.style.setProperty('--card-foreground', '255 255 255'); // white
        root.style.setProperty('--popover', '23 23 23'); // neutral-900
        root.style.setProperty('--popover-foreground', '255 255 255'); // white
        root.style.setProperty('--primary', '59 130 246'); // blue-500
        root.style.setProperty('--primary-foreground', '255 255 255'); // white
        root.style.setProperty('--secondary', '38 38 38'); // neutral-800
        root.style.setProperty('--secondary-foreground', '255 255 255'); // white
        root.style.setProperty('--muted', '38 38 38'); // neutral-800
        root.style.setProperty('--muted-foreground', '163 163 163'); // neutral-400
        root.style.setProperty('--accent', '38 38 38'); // neutral-800
        root.style.setProperty('--accent-foreground', '255 255 255'); // white
        root.style.setProperty('--destructive', '239 68 68'); // red-500
        root.style.setProperty('--destructive-foreground', '255 255 255'); // white
        root.style.setProperty('--border', '64 64 64'); // neutral-700
        root.style.setProperty('--input', '64 64 64'); // neutral-700
        root.style.setProperty('--ring', '59 130 246'); // blue-500
        break;
        
      default:
        break;
    }
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const value = {
    theme,
    changeTheme,
    themes: [
      { value: 'light', label: 'Light', description: 'Cream colored theme' },
      { value: 'dark', label: 'Dark', description: 'Slate-950 theme' },
      { value: 'black', label: 'Black', description: 'Pure black theme' }
    ]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
