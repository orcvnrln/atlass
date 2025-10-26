import React, { useState } from 'react';
import ChartGrid from '@/components/workspace/ChartGrid';
import LayoutControls from '@/components/workspace/LayoutControls';

const WorkspacePage = () => {
  const [layoutId, setLayoutId] = useState('2x2');
  const [panelAssets, setPanelAssets] = useState({
      a: 'EUR/USD',
      b: 'BTC/USD',
      c: null,
      d: null
  });

  const handleAssetChange = (panelId, asset) => {
    setPanelAssets(prev => ({
        ...prev,
        [panelId]: asset
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Multi-Chart Workspace</h1>
        <p className="text-lg text-text-secondary">
          Customize your layout and analyze multiple assets simultaneously.
        </p>
      </div>
        
        {/* Workspace Controls */}
        <div className="mb-4">
          <LayoutControls onLayoutChange={setLayoutId} activeLayout={layoutId} />
        </div>

        {/* Chart Grid */}
        <div className="flex-grow">
           <ChartGrid 
              layoutId={layoutId} 
              panelAssets={panelAssets} 
              onAssetChange={handleAssetChange} 
           />
        </div>
      </div>
  );
};

export default WorkspacePage;
