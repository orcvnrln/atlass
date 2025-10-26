import React from 'react';
import { Search, Settings, TrendingUp, TrendingDown } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  asset: string;
  timeframe: '15m' | '1h' | '4h' | '1d';
  onAssetChange: (asset: string) => void;
  onTimeframeChange: (timeframe: '15m' | '1h' | '4h' | '1d') => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  asset,
  timeframe,
  onAssetChange,
  onTimeframeChange,
  onSettingsClick,
}) => {
  const timeframes = [
    { value: '15m', label: '15m' },
    { value: '1h', label: '1h' },
    { value: '4h', label: '4h' },
    { value: '1d', label: '1d' },
  ];

  const popularAssets = [
    'BTC-USD',
    'ETH-USD',
    'EUR-USD',
    'GBP-USD',
    'SPY',
    'QQQ',
    'GLD',
    'TLT',
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left - Logo & Asset Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">Institutional AI Trading</h1>
              <p className="text-sm text-slate-400">Bloomberg-grade terminal</p>
            </div>
          </div>

          {/* Asset Selector */}
          <div className="flex items-center gap-2">
            <select
              value={asset}
              onChange={(e) => onAssetChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              {popularAssets.map((assetOption) => (
                <option key={assetOption} value={assetOption}>
                  {assetOption}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => onTimeframeChange(tf.value as any)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    timeframe === tf.value
                      ? 'bg-slate-700 text-slate-100'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search symbols, news, or analysis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Right - Status & Settings */}
        <div className="flex items-center gap-4">
          {/* Live Status */}
          <div className="flex items-center gap-2 px-3 py-2 bg-green-900/20 border border-green-800 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">LIVE</span>
          </div>

          {/* Market Status */}
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-slate-300">Market Open</span>
          </div>

          {/* Settings */}
          <button
            onClick={onSettingsClick}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Real-time Price Bar */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">BTC Live:</span>
            <span className="font-mono font-bold text-slate-100">$42,150</span>
            <span className="text-green-400">+1.2%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Vol:</span>
            <span className="font-mono text-slate-300">9.2M</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Bid:</span>
            <span className="font-mono text-slate-300">$42,149</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Ask:</span>
            <span className="font-mono text-slate-300">$42,151</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Spread:</span>
            <span className="font-mono text-slate-300">$2</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Imbalance:</span>
            <span className="text-green-400 font-bold">+++</span>
          </div>
        </div>
        <div className="text-slate-400">
          Last update: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Header;
