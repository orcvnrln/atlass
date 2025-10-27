import React from 'react';
import { RefreshCw, Download, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

const PortfolioHeader: React.FC = () => {
  const { colors } = useTheme();
  
  return (
    <div className="flex items-center justify-between w-full">
      {/* Left Side */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold" style={{ color: colors.text.primary }}>Portfolio Analysis</h1>
        <p className="text-sm mt-1" style={{ color: colors.text.secondary }}>Comprehensive analytics powered by AI</p>
        <div className="flex items-center text-xs mt-2" style={{ color: colors.text.secondary }}>
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Updated 2 minutes ago
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" className="flex items-center gap-2">
          <RefreshCw size={14} />
          <span>Sync Portfolio</span>
        </Button>
        <Button variant="secondary" size="sm" className="flex items-center gap-2">
          <Download size={14} />
          <span>Export Report</span>
        </Button>
        <Button variant="ghost" size="sm">
          <Settings size={18} />
        </Button>
        <ThemeToggle />
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
          style={{ backgroundColor: colors.accent.primary }}
        >
          <User size={18} />
        </div>
      </div>
    </div>
  );
};

export default PortfolioHeader;
