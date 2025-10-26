import React, { useState, useMemo } from 'react';

// --- Configuration & Mock Data ---
const assetGroups = {
  FX: ['EUR/USD', 'USD/JPY', 'GBP/USD', 'AUD/USD', 'USD/CAD', 'NZD/USD', 'USD/CHF', 'EUR/GBP'],
  Crypto: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'XRP/USD', 'ADA/USD', 'DOGE/USD', 'AVAX/USD', 'LTC/USD'],
  Indices: ['SPX500', 'NAS100', 'US30', 'UK100', 'JPN225', 'GER40', 'VIX', 'DXY'],
  Stocks: ['AAPL', 'TSLA', 'NVDA', 'AMZN', 'GOOGL', 'MSFT', 'META', 'JPM'],
};

const generateCorrelationMatrix = (assets) => {
  const matrix = Array(assets.length).fill(null).map(() => Array(assets.length).fill(0));
  for (let i = 0; i < assets.length; i++) {
    for (let j = i; j < assets.length; j++) {
      if (i === j) {
        matrix[i][j] = 1.0;
      } else {
        const value = parseFloat((Math.random() * 2 - 1).toFixed(2));
        matrix[i][j] = value;
        matrix[j][i] = value;
      }
    }
  }
  return matrix;
};

// --- Sub-components (Self-contained) ---

const Tabs = ({ activeTab, setActiveTab }) => (
    <div className="mb-6 flex items-center justify-center space-x-2 rounded-lg bg-card-bg p-1">
        {Object.keys(assetGroups).map((group) => (
            <button
                key={group}
                onClick={() => setActiveTab(group)}
                className={`w-full rounded-md px-4 py-2 text-sm font-semibold transition-colors focus:outline-none ${
                    activeTab === group
                        ? 'bg-accent text-white shadow-md'
                        : 'text-text-secondary hover:bg-primary-bg'
                }`}
            >
                {group}
            </button>
        ))}
    </div>
);

const CorrelationMatrix = ({ assets, matrix }) => (
    <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${assets.length}, 1fr)` }}>
        {/* Top Header Placeholder */}
        <div />
        {/* Top Header */}
        {assets.map((asset) => (
            <div key={asset} className="flex h-12 items-center justify-center">
                 <span className="text-xs text-gray-500 font-mono">{asset}</span>
            </div>
        ))}
        {/* Matrix Rows */}
        {assets.map((asset, rowIndex) => (
            <React.Fragment key={asset}>
                {/* Side Header */}
                <div className="flex w-24 items-center justify-end pr-2 text-xs text-gray-500 font-mono">{asset}</div>
                {/* Cells */}
                {matrix[rowIndex].map((value, colIndex) => {
                    const absValue = Math.abs(value);
                    let bgColor = 'bg-gray-800';
                    if (absValue > 0.7) bgColor = value > 0 ? 'bg-green-600' : 'bg-red-600';
                    else if (absValue > 0.4) bgColor = value > 0 ? 'bg-green-800' : 'bg-red-800';
                    else if (absValue > 0.1) bgColor = value > 0 ? 'bg-green-900' : 'bg-red-900';

                    return (
                        <div key={`${rowIndex}-${colIndex}`} className="group relative flex h-12 items-center justify-center">
                            <div className={`h-full w-full rounded-md ${bgColor} transition-colors`}>
                                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white opacity-80">
                                    {value.toFixed(2)}
                                </div>
                            </div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 transform rounded-md bg-gray-900 px-3 py-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 border border-gray-700 shadow-lg">
                                {assets[rowIndex]} vs {assets[colIndex]}: <span className="font-bold">{value.toFixed(2)}</span>
                                <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
                            </div>
                        </div>
                    );
                })}
            </React.Fragment>
        ))}
    </div>
);

// --- Main Page Component ---

const CorrelationDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('FX');

  const { assets, matrix } = useMemo(() => {
    const activeAssets = assetGroups[activeTab];
    return { assets: activeAssets, matrix: generateCorrelationMatrix(activeAssets) };
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-primary-bg p-4 sm:p-6 lg:p-8 text-text-primary">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary">Live Correlation Matrix</h1>
          <p className="mt-2 text-base text-text-secondary">Uncover hidden market relationships with our AI-powered heatmap.</p>
        </div>

        {/* Tabs */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Matrix */}
        <div className="overflow-x-auto rounded-lg bg-card-bg p-4">
            <CorrelationMatrix assets={assets} matrix={matrix} />
        </div>
      </div>
    </div>
  );
};

export default CorrelationDashboardPage;
