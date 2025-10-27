import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const sparklineData = [
  { v: 120000 }, { v: 122000 }, { v: 121000 }, { v: 125000 }, { v: 124000 }, { v: 127450 },
];

const OverviewCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Card A: Total Portfolio Value */}
      <div className="bg-card-bg p-4 rounded-lg border border-border-color">
        <p className="text-sm text-text-secondary">Total Portfolio Value</p>
        <p className="text-2xl font-bold my-1">$127,450.32</p>
        <div className="flex items-center text-sm text-green-500">
          <TrendingUp size={16} className="mr-1" />
          <span>+$2,340.50 (1.87%)</span>
        </div>
        <div className="h-16 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Card B: Number of Assets */}
      <div className="bg-card-bg p-4 rounded-lg border border-border-color">
        <p className="text-sm text-text-secondary">Number of Assets</p>
        <p className="text-2xl font-bold my-1">23</p>
        <p className="text-xs text-text-secondary">8 stocks, 5 crypto, 7 forex, 3 commodities</p>
        <p className="text-sm mt-4">Diversification Score: <span className="font-bold text-lg">8.2/10</span></p>
      </div>

      {/* Card C: Largest Position */}
      <div className="bg-card-bg p-4 rounded-lg border border-border-color">
        <p className="text-sm text-text-secondary">Largest Position</p>
        <p className="text-2xl font-bold my-1">BTC (Bitcoin)</p>
        <p className="text-sm">Value: $45,000</p>
        <p className="text-sm">% of portfolio: 35.4%</p>
        <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full border border-red-500/30">
          <AlertTriangle size={14} />
          High concentration risk
        </div>
      </div>

      {/* Card D: Rebalancing Status */}
      <div className="bg-card-bg p-4 rounded-lg border border-border-color">
        <p className="text-sm text-text-secondary">Rebalancing Status</p>
        <p className="text-2xl font-bold my-1 text-red-500">Needs Rebalancing</p>
        <p className="text-sm">Drift from target: 12.3%</p>
        <p className="text-xs text-text-secondary mt-4">Last rebalanced: 15 days ago</p>
      </div>
    </div>
  );
};

export default OverviewCards;
