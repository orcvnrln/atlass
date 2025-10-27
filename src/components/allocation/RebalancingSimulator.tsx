import React from 'react';
import { usePortfolioStore } from '@/store/portfolioStore';

const RebalancingSimulator: React.FC = () => {
  const { assets, totalValue, setTarget, resetTargets } = usePortfolioStore();

  return (
    <div className="bg-card-bg p-6 rounded-lg border border-border-color">
      <h2 className="text-xl font-bold mb-2">Portfolio Rebalancing Simulator</h2>
      <p className="text-sm text-text-secondary mb-6">Drag sliders to adjust target allocation</p>

      <div className="space-y-6">
        {assets.map((asset) => {
          const diff = asset.current - asset.target;
          const amount = (diff / 100) * totalValue;

          return (
            <div key={asset.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">{asset.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{asset.current.toFixed(1)}%</span>
                  <span className="text-xs text-text-secondary">→</span>
                  <span className="font-bold text-lg text-accent">{asset.target.toFixed(1)}%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={asset.target}
                onChange={(e) => setTarget(asset.name, parseFloat(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-700`}
                style={{ accentColor: asset.color.replace('bg-', '') }}
              />
              <div className="flex justify-between text-xs mt-1">
                <span className={amount > 0 ? 'text-red-500' : 'text-green-500'}>
                  {amount > 0 ? 'Sell' : 'Buy'} ${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="font-bold">{diff.toFixed(1)}% from current</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t border-border-color pt-6 text-sm">
        <div className="flex justify-between mb-2">
          <span>Total Rebalancing Cost Estimate:</span>
          <span className="font-bold">$2,340</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Transaction Fees:</span>
          <span className="font-bold">$47</span>
        </div>
        <div className="flex justify-between">
          <span>Tax Implications:</span>
          <span className="font-bold text-green-500">$0 (Tax-Advantaged Account)</span>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button className="flex-1 px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors">
          Execute Rebalancing
        </button>
        <button className="flex-1 px-4 py-2 bg-white/10 text-text-secondary font-semibold rounded-lg hover:bg-white/20 transition-colors">
          Save as Draft
        </button>
        <button onClick={resetTargets} className="text-xs text-accent hover:underline">Reset</button>
      </div>
    </div>
  );
};

export default RebalancingSimulator;
