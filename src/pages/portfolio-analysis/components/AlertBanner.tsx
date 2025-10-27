import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const AlertBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  // In a real app, this would be driven by portfolio state
  const needsRebalancing = true; 

  if (!isVisible || !needsRebalancing) {
    return null;
  }

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <AlertTriangle className="w-5 h-5 mr-3 text-yellow-400" />
        <p className="text-sm font-medium">
          <span className="font-bold">Portfolio needs rebalancing.</span> Drift from target: 12.3%. Bitcoin exposure exceeds 35%.
        </p>
        <Button variant="ghost" className="text-yellow-200 hover:text-yellow-100 h-auto p-0 ml-4 text-sm font-bold underline hover:no-underline">
          Review Now
        </Button>
      </div>
      <button onClick={() => setIsVisible(false)} className="p-1 rounded-md hover:bg-yellow-500/20">
        <X size={16} />
      </button>
    </div>
  );
};

export default AlertBanner;
