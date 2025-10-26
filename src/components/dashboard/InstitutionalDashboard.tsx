import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setSelectedTab } from '../../store/slices/uiSlice';
import { setAsset, setTimeframe } from '../../store/slices/chartSlice';
import { Search, Settings, TrendingUp, TrendingDown, Activity, Brain, Shield, BarChart3, Newspaper, Briefcase, Cog } from 'lucide-react';

// Import components (we'll create these next)
import ChartContainer from '../chart/ChartContainer';
import SignalPanel from '../signals/SignalPanel';
import CorrelationMatrix from '../market/CorrelationMatrix';
import TabContainer from '../layout/TabContainer';
import Header from '../layout/Header';

const InstitutionalDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedTab } = useSelector((state: RootState) => state.ui);
  const { asset, timeframe } = useSelector((state: RootState) => state.chart);
  const { current: currentSignal, loading: signalLoading } = useSelector((state: RootState) => state.signal);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Mock data for demonstration
  const mockSignal = {
    id: 'signal-1',
    asset: 'BTC-USD',
    timeframe: '1h' as const,
    signal: 'LONG' as const,
    confidence: 0.87,
    entry: 42150,
    stopLoss: 41500,
    takeProfit: 43200,
    takeProfit2: 43500,
    takeProfit3: 44200,
    rationale: [
      {
        feature: 'Order Book Imbalance',
        value: '+$2.3M BTC buy wall detected',
        interpretation: 'Smart money accumulating at support',
        impact: 0.35,
      },
      {
        feature: 'News Catalyst',
        value: 'ETF inflow approval announced',
        interpretation: 'Reuters | Sentiment: +0.85 | Trust: 92%',
        impact: 0.28,
      },
      {
        feature: 'Volatility Regime Shift',
        value: 'ATR expanded 34% on lower volume',
        interpretation: 'Institutional accumulation pattern',
        impact: 0.19,
      },
    ],
    riskMetrics: {
      expectedSlippage: 0.15,
      recommendedSize: 0.040,
      maxLeverage: 2.0,
      liquidityScore: 9.2,
      smartMoneyScore: 9.2,
      newsSentiment: 0.78,
      volumeStrength: 8.5,
    },
    timestamp: Date.now(),
    status: 'OPEN' as const,
  };

  const tabs = [
    { id: 'chart', label: 'Chart', icon: BarChart3 },
    { id: 'signals', label: 'Signals', icon: TrendingUp },
    { id: 'order-flow', label: 'Order Flow', icon: Activity },
    { id: 'smart-money', label: 'Smart Money', icon: Brain },
    { id: 'risk', label: 'Risk', icon: Shield },
    { id: 'backtest', label: 'Backtest', icon: BarChart3 },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Cog },
  ];

  const handleTabChange = (tabId: string) => {
    dispatch(setSelectedTab(tabId as any));
  };

  const handleAssetChange = (newAsset: string) => {
    dispatch(setAsset(newAsset));
  };

  const handleTimeframeChange = (newTimeframe: '15m' | '1h' | '4h' | '1d') => {
    dispatch(setTimeframe(newTimeframe));
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 flex flex-col">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        asset={asset}
        timeframe={timeframe}
        onAssetChange={handleAssetChange}
        onTimeframeChange={handleTimeframeChange}
        onSettingsClick={() => setShowSettings(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chart Area */}
        <div className="flex-1 flex flex-col">
          {/* Chart Container */}
          <div className="flex-1 bg-slate-900 border border-slate-800 m-4 rounded-lg overflow-hidden">
            <ChartContainer />
          </div>

          {/* Correlation Matrix */}
          <div className="mx-4 mb-4">
            <CorrelationMatrix />
          </div>

          {/* Tab Navigation */}
          <div className="mx-4 mb-4">
            <div className="flex space-x-1 bg-slate-800 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-slate-700 text-slate-100'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mx-4 mb-4">
            <TabContainer activeTab={selectedTab} />
          </div>
        </div>

        {/* Signal Panel */}
        <div className="w-80 bg-slate-900 border-l border-slate-800">
          <SignalPanel signal={currentSignal || mockSignal} loading={signalLoading} />
        </div>
      </div>
    </div>
  );
};

export default InstitutionalDashboard;
