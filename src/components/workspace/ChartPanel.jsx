import React, { useState } from 'react';
import AssetSearch from './AssetSearch';
import { PlusCircle, X, ZoomIn, ZoomOut, Move, Printer } from 'lucide-react';
import TradingViewChart from './TradingViewChart';

const ChartPanel = ({ panelId, initialAsset, onAssetChange }) => {
  const [asset, setAsset] = useState(initialAsset);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectAsset = (selectedAsset) => {
    setAsset(selectedAsset);
    onAssetChange(selectedAsset);
    setIsModalOpen(false);
  };

  const chartRef = React.useRef(null);

  return (
    <div className="w-full h-full bg-card-bg rounded-lg flex flex-col items-stretch justify-center border border-border-color relative overflow-hidden group">
      {asset ? (
        <>
            <div className="absolute top-2 left-3 z-10">
                <h3 className="text-sm font-bold text-text-primary bg-card-bg/50 px-2 py-1 rounded">{asset}</h3>
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-2 right-3 z-10 text-xs bg-primary text-white py-1 px-2 rounded-md hover:bg-primary-dark transition-opacity opacity-0 group-hover:opacity-100"
            >
                Change
            </button>
            <div className="absolute top-1/2 right-2 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => chartRef.current?.zoomIn()} className="bg-card-bg p-1.5 rounded text-text-secondary hover:text-white hover:bg-white/10"><ZoomIn size={16}/></button>
                <button onClick={() => chartRef.current?.zoomOut()} className="bg-card-bg p-1.5 rounded text-text-secondary hover:text-white hover:bg-white/10"><ZoomOut size={16}/></button>
                <button onClick={() => chartRef.current?.resetZoom()} className="bg-card-bg p-1.5 rounded text-text-secondary hover:text-white hover:bg-white/10"><Move size={16}/></button>
                <button onClick={() => chartRef.current?.print()} className="bg-card-bg p-1.5 rounded text-text-secondary hover:text-white hover:bg-white/10"><Printer size={16}/></button>
            </div>
            <TradingViewChart asset={asset} chartId={panelId} ref={chartRef} />
        </>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center text-text-secondary hover:text-primary transition-colors group touch-manipulation"
        >
          <PlusCircle size={40} className="group-hover:animate-pulse" />
          <span className="mt-2 font-semibold">Click to select an asset</span>
        </button>
      )}

      {isModalOpen && (
        <div className="absolute inset-0 z-20 bg-card-bg/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className='relative w-full max-w-md'>
                <AssetSearch onSelectAsset={handleSelectAsset} />
                <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="absolute -top-2 -right-2 bg-gray-700 rounded-full p-1 text-white hover:bg-gray-600"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ChartPanel;
