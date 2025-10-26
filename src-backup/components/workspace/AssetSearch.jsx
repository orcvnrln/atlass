import React, { useState } from 'react';
import { Search } from 'lucide-react';

const assetCategories = {
  Majors: ['EUR/USD', 'USD/JPY', 'GBP/USD', 'USD/CHF', 'AUD/USD', 'USD/CAD', 'NZD/USD'],
  Minors: ['EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'CHF/JPY', 'AUD/JPY', 'CAD/JPY', 'NZD/JPY', 'EUR/AUD', 'GBP/CHF'],
  Exotics: ['USD/SEK', 'USD/NOK', 'USD/ZAR', 'USD/TRY', 'USD/MXN', 'USD/SGD', 'USD/HKD', 'EUR/TRY'],
  Indices: ['SPX500', 'NAS100', 'US30', 'GER40', 'UK100', 'JPN225', 'VIX', 'DXY'],
  Crypto: ['BTC/USD', 'ETH/USD', 'XRP/USD', 'ADA/USD', 'SOL/USD', 'DOGE/USD', 'LTC/USD', 'BNB/USD', 'AVAX/USD'],
  Stocks: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'JPM', 'PFE', 'DIS'],
  Commodities: ['XAU/USD', 'XAG/USD', 'WTI Crude', 'Brent Crude', 'Natural Gas', 'Copper'],
};

const AssetSearch = ({ onSelectAsset }) => {
  const [activeTab, setActiveTab] = useState('Majors');
  const [searchTerm, setSearchTerm] = useState('');

  const allAssets = Object.values(assetCategories).flat();
  const filteredAssets = allAssets.filter(asset => 
    asset.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const assetsToShow = searchTerm ? filteredAssets : assetCategories[activeTab];

  return (
    <div className="w-full max-w-md mx-auto bg-card-bg text-text-on-card-primary rounded-lg p-4 shadow-xl border border-border-color">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-background-accent border border-border-color rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      {!searchTerm && (
        <div className="flex space-x-1 border-b border-border-color mb-2 overflow-x-auto scrollbar-thin pb-2">
          {Object.keys(assetCategories).map(category => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === category ? 'bg-primary text-white' : 'hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="max-h-60 overflow-y-auto scrollbar-thin">
        {assetsToShow.map(asset => (
          <div
            key={asset}
            onClick={() => onSelectAsset(asset)}
            className="p-2.5 rounded-md hover:bg-white/10 cursor-pointer text-sm font-medium"
          >
            {asset}
          </div>
        ))}
         {assetsToShow.length === 0 && (
            <div className="p-4 text-center text-text-secondary">No assets found.</div>
        )}
      </div>
    </div>
  );
};

export default AssetSearch;
