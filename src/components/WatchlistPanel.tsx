'use client';

import { useState } from 'react';

interface WatchlistPanelProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const WatchlistPanel = ({ isOpen, activeTab, onTabChange }: WatchlistPanelProps) => {

  const tabs = [
    'All Stocks',
    'Forex',
    'Indices',
    'Metals',
    'Bonds',
    'Crypto',
    'ETFs'
  ];

  if (!isOpen) return null;

  return (
    <div className="bg-background-secondary border-b border-border-primary animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex space-x-8 border-b border-border-primary">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === tab
                  ? 'border-accent-primary text-accent-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-secondary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select className="bg-background-tertiary border border-border-primary rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary">
              <option>Market Cap</option>
              <option>Large Cap (&gt;$10B)</option>
              <option>Mid Cap ($2B-$10B)</option>
              <option>Small Cap (&lt;$2B)</option>
            </select>
            
            <select className="bg-background-tertiary border border-border-primary rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary">
              <option>Change %</option>
              <option>Gainers (&gt;5%)</option>
              <option>Losers (&lt;-5%)</option>
              <option>Flat (-1% to 1%)</option>
            </select>

            <select className="bg-background-tertiary border border-border-primary rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary">
              <option>AI Rating</option>
              <option>Strong Buy</option>
              <option>Buy</option>
              <option>Hold</option>
              <option>Sell</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Auto-refresh:</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-trading-positive rounded-full animate-pulse mr-2"></div>
              <span className="text-sm text-trading-positive">Live</span>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="text-left py-3 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Symbol</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Price</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Change %</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Volume</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Market Cap</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">P/E</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">EPS Growth</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Div Yield</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Sector</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WatchlistPanel;
