import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';

const ThemeContext = createContext();

// Professional trading platform themes
export const THEMES = {
    LIGHT: 'theme-light',
    DARK: 'theme-dark',
    BLACK: 'theme-black'
};

export const THEME_CONFIGS = {
    [THEMES.LIGHT]: {
        name: 'Light',
        description: 'Cream-colored professional theme',
        colors: {
            primary: '#f8fafc',
            secondary: '#f1f5f9',
            accent: '#059669',
            text: '#1e293b',
            textSecondary: '#64748b',
            border: '#e2e8f0'
        }
    },
    [THEMES.DARK]: {
        name: 'Dark',
        description: 'Slate-950 professional theme',
        colors: {
            primary: '#020617',
            secondary: '#0f172a',
            accent: '#10b981',
            text: '#f1f5f9',
            textSecondary: '#94a3b8',
            border: '#334155'
        }
    },
    [THEMES.BLACK]: {
        name: 'Black',
        description: 'Pure black professional theme',
        colors: {
            primary: '#000000',
            secondary: '#111111',
            accent: '#00ff88',
            text: '#ffffff',
            textSecondary: '#888888',
            border: '#333333'
        }
    }
};

export const ThemeProvider = ({ children }) => {
    // Default to 'dark' theme, but check localStorage for user preference
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('trading-theme') || THEMES.DARK;
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove old theme classes
        Object.values(THEMES).forEach(themeClass => {
            root.classList.remove(themeClass);
        });

        // Add current theme class
        root.classList.add(theme);

        // Apply CSS custom properties for the current theme
        const config = THEME_CONFIGS[theme];
        if (config) {
            Object.entries(config.colors).forEach(([key, value]) => {
                root.style.setProperty(`--color-${key}`, value);
            });
        }

        // Save theme to localStorage
        localStorage.setItem('trading-theme', theme);
    }, [theme]);

    const switchTheme = (newTheme) => {
        if (Object.values(THEMES).includes(newTheme)) {
            setTheme(newTheme);
        }
    };

    const getThemeConfig = () => THEME_CONFIGS[theme];

    const value = useMemo(() => ({
        theme,
        setTheme: switchTheme,
        getThemeConfig,
        availableThemes: THEMES,
        themeConfigs: THEME_CONFIGS
    }), [theme]);

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
