import React, { createContext, useState, useEffect, useContext } from 'react';

interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
  };
  accent: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    purple: string;
  };
  border: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const lightTheme: ThemeColors = {
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    elevated: '#ffffff',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    tertiary: '#94a3b8',
    accent: '#3b82f6',
  },
  accent: {
    primary: '#3b82f6',
    secondary: '#10b981',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
  },
  border: {
    primary: '#e2e8f0',
    secondary: '#cbd5e1',
    accent: '#3b82f6',
  },
};

const darkTheme: ThemeColors = {
  background: {
    primary: '#0f1419',
    secondary: '#1a1f2e',
    tertiary: '#242938',
    elevated: '#2d3748',
  },
  text: {
    primary: '#f7fafc',
    secondary: '#a0aec0',
    tertiary: '#718096',
    accent: '#4299e1',
  },
  accent: {
    primary: '#4299e1',
    secondary: '#48bb78',
    success: '#48bb78',
    warning: '#ed8936',
    danger: '#f56565',
    purple: '#9f7aea',
  },
  border: {
    primary: '#2d3748',
    secondary: '#4a5568',
    accent: '#4299e1',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('atlas-theme');
    return saved ? JSON.parse(saved) : true; // Default to dark
  });

  const toggleTheme = () => {
    setIsDark(prev => {
      const newValue = !prev;
      localStorage.setItem('atlas-theme', JSON.stringify(newValue));
      return newValue;
    });
  };

  const colors = isDark ? darkTheme : lightTheme;

  // Apply CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Background colors
    root.style.setProperty('--bg-primary', colors.background.primary);
    root.style.setProperty('--bg-secondary', colors.background.secondary);
    root.style.setProperty('--bg-tertiary', colors.background.tertiary);
    root.style.setProperty('--bg-elevated', colors.background.elevated);
    
    // Text colors
    root.style.setProperty('--text-primary', colors.text.primary);
    root.style.setProperty('--text-secondary', colors.text.secondary);
    root.style.setProperty('--text-tertiary', colors.text.tertiary);
    root.style.setProperty('--text-accent', colors.text.accent);
    
    // Accent colors
    root.style.setProperty('--accent-primary', colors.accent.primary);
    root.style.setProperty('--accent-secondary', colors.accent.secondary);
    root.style.setProperty('--accent-success', colors.accent.success);
    root.style.setProperty('--accent-warning', colors.accent.warning);
    root.style.setProperty('--accent-danger', colors.accent.danger);
    root.style.setProperty('--accent-purple', colors.accent.purple);
    
    // Border colors
    root.style.setProperty('--border-primary', colors.border.primary);
    root.style.setProperty('--border-secondary', colors.border.secondary);
    root.style.setProperty('--border-accent', colors.border.accent);
  }, [colors]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
