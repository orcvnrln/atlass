import React, { useState } from 'react';
import AssetSearch from './AssetSearch';
import { PlusCircle, X } from 'lucide-react';
import TradingViewChart from './TradingViewChart';

const ChartPanel = ({ initialAsset, onAssetChange }) => {
  const [asset, setAsset] = useState(initialAsset);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectAsset = (selectedAsset) => {
    setAsset(selectedAsset);
    onAssetChange(selectedAsset);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-full bg-background-accent rounded-lg flex flex-col items-stretch justify-center border border-border-color relative overflow-hidden">
      {asset ? (
        <>
            <div className="absolute top-2 left-3 z-10">
                <h3 className="text-sm font-bold text-text-primary bg-card-bg/50 px-2 py-1 rounded">{asset}</h3>
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-2 right-3 z-10 text-xs bg-primary text-white py-1 px-2 rounded-md hover:bg-primary-dark transition-opacity opacity-20 hover:opacity-100"
            >
                Change
            </button>
            <TradingViewChart asset={asset} />
        </>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center justify-center text-text-secondary hover:text-primary transition-colors"
        >
          <PlusCircle size={40} />
          <span className="mt-2 font-semibold">Select Asset</span>
        </button>
      )}

      {isModalOpen && (
        <div className="absolute inset-0 z-10 bg-card-bg/80 backdrop-blur-sm flex items-center justify-center p-4">
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
