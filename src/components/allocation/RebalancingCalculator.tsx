import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const initialAssets = [
  { name: 'Stocks', current: 45.4, target: 40, color: 'bg-blue-500' },
  { name: 'Crypto', current: 29.9, target: 30, color: 'bg-orange-500' },
  { name: 'Forex', current: 19.7, target: 20, color: 'bg-green-500' },
  { name: 'Commodities', current: 5.0, target: 10, color: 'bg-purple-500' },
];

const RebalancingCalculator: React.FC = () => {
  const [assets, setAssets] = useState(initialAssets);
  const totalPortfolioValue = 127450.32;

  const handleSliderChange = (index: number, value: number) => {
    const newAssets = [...assets];
    newAssets[index].current = value;
    setAssets(newAssets);
  };

  const calculations = useMemo(() => {
    return assets.map(asset => {
      const diff = asset.current - asset.target;
      const amount = (diff / 100) * totalPortfolioValue;
      return { ...asset, diff, amount };
    });
  }, [assets]);

  return (
    <div>
      {calculations.map((asset, index) => (
        <div key={asset.name} className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">{asset.name}</span>
            <span>{asset.current.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={asset.current}
            onChange={(e) => handleSliderChange(index, parseFloat(e.target.value))}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${asset.color}`}
          />
          <div className="flex justify-between text-xs mt-1">
            <span>To {asset.diff > 0 ? 'Sell' : 'Buy'}: ${Math.abs(asset.amount).toFixed(2)}</span>
            <span className={asset.diff > 0 ? 'text-red-500' : 'text-green-500'}>
              {asset.diff.toFixed(1)}% from target
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RebalancingCalculator;

