import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const assetGroups = {
  FX: ['EUR/USD', 'USD/JPY', 'GBP/USD', 'AUD/USD'],
  Crypto: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'XRP/USD'],
  Indices: ['SPX500', 'NAS100', 'UK100', 'JPN225'],
  Stocks: ['AAPL', 'TSLA', 'NVDA', 'AMZN'],
};

// Generate mock correlation data
const generateCorrelationMatrix = (assets) => {
  const matrix = {};
  assets.forEach(asset1 => {
    matrix[asset1] = {};
    assets.forEach(asset2 => {
      if (asset1 === asset2) {
        matrix[asset1][asset2] = 1;
      } else if (matrix[asset2] && matrix[asset2][asset1] !== undefined) {
        matrix[asset1][asset2] = matrix[asset2][asset1];
      }
      else {
        matrix[asset1][asset2] = parseFloat((Math.random() * 2 - 1).toFixed(2));
      }
    });
  });
  return matrix;
};

const getColor = (value) => {
    const intensity = Math.abs(value);
    // Using HSL for better color transitions. Green for positive, Red for negative.
    // Hue: 120 for green, 0 for red.
    const hue = value > 0 ? 120 : 0;
    // Saturation is constant. Lightness adjusts with intensity.
    const lightness = 30 + intensity * 20; // from 30% to 50%
    const alpha = 0.4 + intensity * 0.6; // from 40% to 100%
    return `hsla(${hue}, 70%, ${lightness}%, ${alpha})`;
};


const LiveCorrelationMatrix = () => {
  const [selectedGroups, setSelectedGroups] = useState(['FX', 'Crypto']);

  const toggleGroup = (group) => {
    setSelectedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const { assets, matrix } = useMemo(() => {
    const activeAssets = selectedGroups.flatMap(group => assetGroups[group]);
    return { assets: activeAssets, matrix: generateCorrelationMatrix(activeAssets) };
  }, [selectedGroups]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.keys(assetGroups).map(group => (
          <button
            key={group}
            onClick={() => toggleGroup(group)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              selectedGroups.includes(group) ? 'bg-primary text-white' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Heatmap Table */}
      <div className="flex-grow overflow-auto scrollbar-thin">
        <table className="w-full text-center text-xs border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="p-2 sticky top-0 left-0 z-20 bg-card-bg"></th>
              {assets.map(asset => <th key={asset} className="p-2 font-mono sticky top-0 bg-card-bg z-10 -rotate-45 h-20 whitespace-nowrap">{asset}</th>)}
            </tr>
          </thead>
          <tbody>
            {assets.map(asset1 => (
              <tr key={asset1}>
                <td className="p-2 font-mono font-bold text-left sticky left-0 bg-card-bg z-10 whitespace-nowrap">{asset1}</td>
                {assets.map(asset2 => (
                  <td key={asset2} className="p-0">
                    <motion.div
                      className="w-full h-12 flex items-center justify-center rounded-md"
                      style={{ backgroundColor: getColor(matrix[asset1][asset2]) }}
                      whileHover={{ scale: 1.1, zIndex: 10, outline: '2px solid var(--accent)' }}
                    >
                      <span className="font-mono text-white font-bold mix-blend-hard-light text-sm">
                        {matrix[asset1][asset2].toFixed(2)}
                      </span>
                    </motion.div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveCorrelationMatrix;
