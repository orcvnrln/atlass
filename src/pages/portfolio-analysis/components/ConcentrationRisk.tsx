import React, { useState } from 'react';
import { holdings } from '../utils/mockData';
import { Button } from '@/components/ui/Button';

const topHoldings = holdings.slice(0, 5); // Using top 5 for demo

const AssetBar = ({ holding }: { holding: typeof topHoldings[0] }) => {
  const percentage = holding.portfolioPercentage;
  const color = percentage > 25 ? 'bg-red-500' : percentage > 15 ? 'bg-yellow-500' : 'bg-green-500';
  const textColor = percentage > 25 ? 'text-red-400' : percentage > 15 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="w-20 font-semibold text-text-primary text-right">{holding.symbol}</span>
      <div className="flex-grow bg-gray-800 rounded-full h-6">
        <div className={`${color} h-6 rounded-full flex items-center justify-end pr-2`} style={{ width: `${(percentage / 40) * 100}%` }}>
          <span className="text-white font-bold">{percentage.toFixed(1)}%</span>
        </div>
      </div>
      {percentage > 25 && <span className={`${textColor} font-bold`}>🔴 WARNING</span>}
      {percentage > 15 && percentage <= 25 && <span className={`${textColor} font-bold`}>🟡 CAUTION</span>}
    </div>
  );
};

const ConcentrationRisk: React.FC = () => {
  const [activeTab, setActiveTab] = useState('asset');

  return (
    <div className="bg-[#16181d] border border-[#1f2937] rounded-xl p-4 sm:p-6">
      <h3 className="text-base font-bold text-text-primary mb-4">Concentration Risk</h3>
      
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-700 mb-4">
        <Button variant={activeTab === 'asset' ? 'primary' : 'ghost'} size="sm" onClick={() => setActiveTab('asset')}>By Asset</Button>
        <Button variant={activeTab === 'sector' ? 'primary' : 'ghost'} size="sm" onClick={() => setActiveTab('sector')}>By Sector</Button>
        <Button variant={activeTab === 'geo' ? 'primary' : 'ghost'} size="sm" onClick={() => setActiveTab('geo')}>By Geography</Button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'asset' && (
          <div className="flex flex-col gap-3">
            {topHoldings.map(h => <AssetBar key={h.id} holding={h} />)}
            <p className="text-xs text-yellow-400 mt-2">⚠️ Bitcoin exceeds recommended 25% limit. Consider rebalancing.</p>
          </div>
        )}
        {activeTab === 'sector' && <div className="text-center text-text-secondary p-8">Sector Pie Chart Placeholder</div>}
        {activeTab === 'geo' && <div className="text-center text-text-secondary p-8">Geography Heatmap Placeholder</div>}
      </div>
    </div>
  );
};

export default ConcentrationRisk;
