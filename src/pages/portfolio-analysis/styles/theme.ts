// Professional soft theme for institutional trading platform
// Based on modern fintech design standards

export const softTheme = {
  // Background colors - softer, more professional
  background: {
    primary: '#0f1419',      // Deep navy instead of pure black
    secondary: '#1a1f2e',    // Soft dark blue-gray
    tertiary: '#242938',     // Lighter blue-gray for cards
    elevated: '#2d3748',     // Elevated surfaces
  },
  
  // Text colors - better contrast, easier on eyes
  text: {
    primary: '#f7fafc',      // Soft white
    secondary: '#a0aec0',    // Muted gray-blue
    tertiary: '#718096',     // Lighter gray
    accent: '#4299e1',       // Soft blue
  },
  
  // Accent colors - softer, more sophisticated
  accent: {
    primary: '#4299e1',      // Soft blue (instead of harsh blue)
    secondary: '#48bb78',    // Soft green
    warning: '#ed8936',      // Soft orange
    danger: '#f56565',       // Soft red
    purple: '#9f7aea',       // Soft purple
    teal: '#38b2ac',         // Soft teal
  },
  
  // Border colors - subtle and refined
  border: {
    primary: '#2d3748',      // Soft border
    secondary: '#4a5568',    // Slightly visible
    accent: '#4299e1',       // Accent border
  },
  
  // Gradient definitions for modern look
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
    warning: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
    danger: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
  },
  
  // Shadow definitions for depth
  shadows: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  }
};

// CSS custom properties for the theme
export const themeCSS = `
  :root {
    --bg-primary: ${softTheme.background.primary};
    --bg-secondary: ${softTheme.background.secondary};
    --bg-tertiary: ${softTheme.background.tertiary};
    --bg-elevated: ${softTheme.background.elevated};
    
    --text-primary: ${softTheme.text.primary};
    --text-secondary: ${softTheme.text.secondary};
    --text-tertiary: ${softTheme.text.tertiary};
    --text-accent: ${softTheme.text.accent};
    
    --accent-primary: ${softTheme.accent.primary};
    --accent-secondary: ${softTheme.accent.secondary};
    --accent-warning: ${softTheme.accent.warning};
    --accent-danger: ${softTheme.accent.danger};
    --accent-purple: ${softTheme.accent.purple};
    --accent-teal: ${softTheme.accent.teal};
    
    --border-primary: ${softTheme.border.primary};
    --border-secondary: ${softTheme.border.secondary};
    --border-accent: ${softTheme.border.accent};
  }
`;
