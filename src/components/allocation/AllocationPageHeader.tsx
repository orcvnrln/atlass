import React from 'react';
import { ChevronRight, Download, Bell, Zap } from 'lucide-react';

const AllocationPageHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      {/* Left side */}
      <div>
        <div className="flex items-center text-sm text-text-secondary mb-1">
          <span>Portfolio Analysis</span>
          <ChevronRight size={16} />
          <span className="text-text-primary font-medium">Asset Allocation</span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary">Asset Allocation Analysis</h1>
        <p className="text-text-secondary mt-1">Portfolio distribution and rebalancing tools</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 mt-4 md:mt-0">
        <button className="px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2 text-sm">
          <Zap size={16} />
          Rebalance Portfolio
        </button>
        <button className="px-4 py-2 bg-white/10 text-text-secondary font-semibold rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 text-sm">
          <Download size={16} />
          Export Report
        </button>
        <button className="p-2 bg-white/10 text-text-secondary rounded-lg hover:bg-white/20 transition-colors">
          <Bell size={16} />
        </button>
        <p className="text-xs text-text-secondary ml-2">Last updated: 2 minutes ago</p>
      </div>
    </div>
  );
};

export default AllocationPageHeader;
