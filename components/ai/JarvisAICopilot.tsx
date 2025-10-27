import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

// Define theme-related types
interface ThemeColors {
  accent?: string;
  background?: string;
  text?: string;
}

interface Theme {
  colors?: ThemeColors;
}

// Default theme values
const defaultTheme: Theme = {
  colors: {
    accent: '#3B82F6', // Default blue accent
    background: '#FFFFFF',
    text: '#1F2937'
  }
};

const JarvisAICopilot: React.FC = () => {
  const theme = useContext(ThemeContext);

  // Safe theme access with fallbacks
  const accentColor = theme?.colors?.accent || defaultTheme.colors?.accent;
  const backgroundColor = theme?.colors?.background || defaultTheme.colors?.background;
  const textColor = theme?.colors?.text || defaultTheme.colors?.text;

  if (!theme) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Loading theme...</p>
      </div>
    );
  }

  return (
    <div 
      className="container mx-auto p-4"
      style={{ backgroundColor: backgroundColor }}
    >
      <h1 
        className="text-2xl font-bold mb-4"
        style={{ color: textColor }}
      >
        Jarvis AI Copilot
      </h1>
      <div 
        className="rounded-lg shadow p-6"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderLeft: `4px solid ${accentColor}`
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: accentColor }}
            />
            <p className="text-gray-800">AI Assistant Interface</p>
          </div>

          {/* Add your main content here */}
          <p className="text-gray-600">
            Secure and intelligent AI assistance at your service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JarvisAICopilot;
