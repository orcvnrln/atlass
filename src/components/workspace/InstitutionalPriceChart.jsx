import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, BarChart3, Shield, MoreHorizontal } from 'lucide-react';
import TradingViewChart from './TradingViewChart';
import TradingSetupsTab from './TradingSetupsTab';
import StrategyBuilderTab from './StrategyBuilderTab';
import RiskControlTab from './RiskControlTab';

const InstitutionalPriceChart = ({ asset }) => {
  const [activeTab, setActiveTab] = useState('setups');
  const [selectedSetup, setSelectedSetup] = useState(null);
  const [showChartMenu, setShowChartMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowChartMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const tabs = [
    { id: 'setups', label: 'Trading Setups', icon: TrendingUp },
    { id: 'strategy', label: 'Strategy Builder', icon: BarChart3 },
    { id: 'risk', label: 'Risk Control', icon: Shield }
  ];

  const handleSetupClick = (setup) => {
    setSelectedSetup(setup);
    console.log('Setup selected:', setup);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'setups':
        return <TradingSetupsTab onSetupClick={handleSetupClick} />;
      case 'strategy':
        return <StrategyBuilderTab />;
      case 'risk':
        return <RiskControlTab />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main Tabs - Clean, No Extra Elements */}
      <div className="flex items-center gap-0.5 mb-3 border-b border-slate-800/50 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-4 py-2.5 text-sm font-semibold uppercase tracking-wide
                transition-all duration-200 rounded-t-lg
                ${activeTab === tab.id
                  ? 'text-blue-400 bg-slate-800/30'
                  : 'text-slate-500 hover:text-slate-300 hover:scale-[1.01] hover:brightness-110 hover:bg-slate-800/20'
                }
              `}
            >
              <Icon size={14} className="inline mr-2" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 shadow-lg shadow-blue-500/50" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left Side: Full Chart - No Extra Elements */}
        <div className="flex-1 relative min-h-0">
          <TradingViewChart tvSymbol={asset?.tvSymbol || 'FX:EURUSD'} interval="60" />

          {/* Chart Menu - 3 Dots in Top Right */}
          <div className="absolute top-4 right-4" ref={menuRef}>
            <div className="relative">
              <button
                onClick={() => setShowChartMenu(!showChartMenu)}
                className="p-2 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-lg hover:bg-slate-800/80 transition-all duration-150"
              >
                <MoreHorizontal size={16} className="text-slate-400" />
              </button>

              {showChartMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-xl z-50">
                  <div className="p-2">
                    <button
                      onClick={() => setShowChartMenu(false)}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 rounded-md transition-all duration-150"
                    >
                      Add Indicator
                    </button>
                    <button
                      onClick={() => setShowChartMenu(false)}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 rounded-md transition-all duration-150"
                    >
                      Show Levels
                    </button>
                    <button
                      onClick={() => setShowChartMenu(false)}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 rounded-md transition-all duration-150"
                    >
                      Chart Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Suggestion Overlays - Positioned absolutely */}
          {selectedSetup && (
            <div className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 shadow-xl">
              <div className="text-xs text-slate-400 mb-2 font-medium">AI Suggestions - {selectedSetup.name}</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-0.5 border-2 border-dashed border-amber-500" />
                  <span className="text-slate-500">Entry (AI):</span>
                  <span className="text-amber-400 font-semibold tabular-nums">{selectedSetup.entry.toFixed(5)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-0.5 bg-red-500" />
                  <span className="text-slate-500">SL (AI):</span>
                  <span className="text-red-400 font-semibold tabular-nums">{selectedSetup.sl.toFixed(5)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-4 h-0.5 bg-emerald-500" />
                  <span className="text-slate-500">TP (AI):</span>
                  <span className="text-emerald-400 font-semibold tabular-nums">{selectedSetup.tp.toFixed(5)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Tab Content Panel */}
        <div className="w-80 bg-slate-900/30 border border-slate-800/50 rounded-lg p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default InstitutionalPriceChart;
