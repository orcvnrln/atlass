import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Default to 'dark' theme, but check localStorage for user preference
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'theme-dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Remove old theme classes
        root.classList.remove('theme-light', 'theme-dark', 'theme-dark-pro');
        
        // Add current theme class
        root.classList.add(theme);
        
        // Save theme to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
