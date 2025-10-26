/**
 * 🎨 THEME SWITCHER
 * Professional theme selector for Light, Dark, and Black themes
 * Bloomberg/TradingView style theme switching
 */

import React, { useState } from 'react';
import { Monitor, Sun, Moon } from 'lucide-react';
import { useTheme, THEMES } from '../../context/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, setTheme, themeConfigs } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeIcons = {
    [THEMES.LIGHT]: Sun,
    [THEMES.DARK]: Monitor,
    [THEMES.BLACK]: Moon
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const CurrentIcon = themeIcons[theme] || Monitor;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800/50"
        title="Switch Theme"
      >
        <CurrentIcon className="w-4 h-4" />
        <span className="hidden sm:inline">{themeConfigs[theme]?.name}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Theme Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-200">Choose Theme</h3>
              <p className="text-xs text-slate-500 mt-1">Professional trading interface themes</p>
            </div>
            
            <div className="p-2 space-y-1">
              {Object.entries(THEMES).map(([key, themeValue]) => {
                const config = themeConfigs[themeValue];
                const Icon = themeIcons[themeValue];
                const isActive = theme === themeValue;
                
                return (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(themeValue)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                      isActive 
                        ? 'bg-emerald-600 text-white' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{config.name}</div>
                      <div className={`text-xs ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {config.description}
                      </div>
                    </div>
                    
                    {/* Theme Preview */}
                    <div className="flex gap-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-slate-600"
                        style={{ backgroundColor: config.colors.primary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-slate-600"
                        style={{ backgroundColor: config.colors.secondary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border border-slate-600"
                        style={{ backgroundColor: config.colors.accent }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="p-3 border-t border-slate-800 bg-slate-800/30">
              <p className="text-xs text-slate-500">
                Themes are automatically saved and applied across all modules
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
