import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Zap } from 'lucide-react';

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    const themes = [
        { id: 'theme-light', icon: Sun, label: 'Light Mode' },
        { id: 'theme-dark', icon: Moon, label: 'Institutional Dark' },
        { id: 'theme-dark-pro', icon: Zap, label: 'Terminal Pro' }
    ];

    const cycleTheme = () => {
        const currentIndex = themes.findIndex(t => t.id === theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex].id);
    };
    
    const currentTheme = themes.find(t => t.id === theme) || themes[1];

    return (
        <button 
            onClick={cycleTheme} 
            className="flex items-center justify-center p-2 rounded-lg transition-colors duration-200 text-text-secondary hover:bg-primary-bg hover:text-text-primary"
            title={`Switch Theme (Current: ${currentTheme.label})`}
        >
            <currentTheme.icon size={18} />
        </button>
    );
};

export default ThemeSwitcher;
