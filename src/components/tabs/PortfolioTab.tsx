import React, { useState } from 'react';
import { Briefcase, TrendingUp, TrendingDown, DollarSign, Target, Shield, Activity, Plus, Minus } from 'lucide-react';

const PortfolioTab: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'positions' | 'performance' | 'allocations'>('overview');

  const portfolio = {
    totalValue: 50000,
    totalPnl: 1420,
    totalPnlPercent: 2.84,
    openPositions: 3,
    totalRisk: 2.3,
    cashBalance: 5000,
    positions: [
      {
        asset: 'BTC',
        symbol: 'BTC-USD',
        size: 0.5,
        entry: 41200,
        current: 42150,
        pnl: 475,
        pnlPercent: 2.31,
        value: 21075,
        allocation: 42.15,
      },
      {
        asset: 'ETH',
        symbol: 'ETH-USD',
        size: 5.0,
        entry: 2200,
        current: 2340,
        pnl: 700,
        pnlPercent: 6.36,
        value: 11700,
        allocation: 23.4,
      },
      {
        asset: 'EUR-USD',
        symbol: 'EUR-USD',
        size: 100000,
        entry: 1.0950,
        current: 1.0945,
        pnl: -50,
        pnlPercent: -0.46,
        value: 109450,
        allocation: 21.89,
      },
    ],
    performance: {
      daily: 1.2,
      weekly: 3.8,
      monthly: 8.5,
      yearly: 24.3,
    },
    allocations: {
      crypto: 65.55,
      forex: 21.89,
      stocks: 0,
      bonds: 0,
      cash: 10,
      other: 2.56,
    },
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-blue-400" />
            <span className="text-sm text-slate-400">Total Value</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">
            ${portfolio.totalValue.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-sm text-slate-400">Total P&L</span>
          </div>
          <div className="text-2xl font-bold text-emerald-500">
            +${portfolio.totalPnl.toLocaleString()}
          </div>
          <div className="text-sm text-emerald-400">
            +{portfolio.totalPnlPercent}%
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-purple-400" />
            <span className="text-sm text-slate-400">Open Positions</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{portfolio.openPositions}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-yellow-400" />
            <span className="text-sm text-slate-400">Risk Exposure</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{portfolio.totalRisk}%</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4">Performance Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">+{portfolio.performance.daily}%</div>
            <div className="text-sm text-slate-400">Daily</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">+{portfolio.performance.weekly}%</div>
            <div className="text-sm text-slate-400">Weekly</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">+{portfolio.performance.monthly}%</div>
            <div className="text-sm text-slate-400">Monthly</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">+{portfolio.performance.yearly}%</div>
            <div className="text-sm text-slate-400">Yearly</div>
          </div>
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4">Asset Allocation</h4>
        <div className="space-y-3">
          {Object.entries(portfolio.allocations).map(([asset, percentage]) => (
            <div key={asset} className="flex items-center justify-between">
              <span className="text-slate-300 capitalize">{asset}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-slate-100 font-semibold w-12 text-right">
                  {percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPositions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-100">Open Positions</h4>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
          <Plus size={16} />
          Add Position
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-400 border-b border-slate-700">
            <tr>
              <th className="text-left py-3 px-4">Asset</th>
              <th className="text-right py-3 px-4">Size</th>
              <th className="text-right py-3 px-4">Entry</th>
              <th className="text-right py-3 px-4">Current</th>
              <th className="text-right py-3 px-4">Value</th>
              <th className="text-right py-3 px-4">P&L</th>
              <th className="text-right py-3 px-4">Allocation</th>
              <th className="text-center py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.positions.map((position, index) => (
              <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-semibold text-slate-100">{position.asset}</div>
                    <div className="text-xs text-slate-500">{position.symbol}</div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-300">
                  {position.size}
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-300">
                  ${position.entry.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-300">
                  ${position.current.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-300">
                  ${position.value.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className={`font-bold ${position.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {position.pnl >= 0 ? '+' : ''}${position.pnl.toLocaleString()}
                  </div>
                  <div className={`text-xs ${position.pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent}%
                  </div>
                </td>
                <td className="py-3 px-4 text-right text-slate-300">
                  {position.allocation}%
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1 hover:bg-slate-700 rounded text-slate-400">
                      <Plus size={14} />
                    </button>
                    <button className="p-1 hover:bg-slate-700 rounded text-slate-400">
                      <Minus size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-slate-100">Performance Analysis</h4>
      
      {/* Performance Chart Placeholder */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="text-center text-slate-400">
            <Activity size={48} className="mx-auto mb-2" />
            <p>Performance chart will be displayed here</p>
            <p className="text-sm">Equity curve and drawdown analysis</p>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">1.75</div>
          <div className="text-sm text-slate-400">Sharpe Ratio</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">-8.2%</div>
          <div className="text-sm text-slate-400">Max Drawdown</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">62%</div>
          <div className="text-sm text-slate-400">Win Rate</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">2.42</div>
          <div className="text-sm text-slate-400">Profit Factor</div>
        </div>
      </div>
    </div>
  );

  const renderAllocations = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-slate-100">Portfolio Allocations</h4>
      
      {/* Allocation Chart Placeholder */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="text-center text-slate-400">
            <Target size={48} className="mx-auto mb-2" />
            <p>Allocation pie chart will be displayed here</p>
            <p className="text-sm">Visual breakdown of portfolio composition</p>
          </div>
        </div>
      </div>

      {/* Rebalancing Suggestions */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h5 className="text-lg font-semibold text-slate-100 mb-4">Rebalancing Suggestions</h5>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div>
              <p className="text-sm text-slate-200">High crypto concentration (65.5%)</p>
              <p className="text-xs text-slate-400">Consider diversifying into other asset classes</p>
            </div>
            <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm text-white">
              Rebalance
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div>
              <p className="text-sm text-slate-200">Low stock allocation (0%)</p>
              <p className="text-xs text-slate-400">Consider adding equity exposure for diversification</p>
            </div>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white">
              Add Stocks
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800 rounded-lg p-1 mb-6">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'positions', label: 'Positions' },
          { id: 'performance', label: 'Performance' },
          { id: 'allocations', label: 'Allocations' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab.id
                ? 'bg-slate-700 text-slate-100'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'overview' && renderOverview()}
      {selectedTab === 'positions' && renderPositions()}
      {selectedTab === 'performance' && renderPerformance()}
      {selectedTab === 'allocations' && renderAllocations()}
    </div>
  );
};

export default PortfolioTab;
