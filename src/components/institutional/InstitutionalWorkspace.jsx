/**
 * Institutional Workspace - Complete Trading Platform
 * Combines all institutional components into a unified interface
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  Brain, 
  Newspaper,
  Settings,
  Maximize2,
  Grid3X3,
  Eye,
  EyeOff
} from 'lucide-react';
import ProfessionalChart from './ProfessionalChart';
import MarketDepth from './MarketDepth';
import OrderPanel from './OrderPanel';
import { useTradingStore } from '@/core/state/store';
import { AdvancedAITradingChart } from '@/components/Chart/AdvancedAITradingChart';
import { AIAnalysisPanel } from '@/components/ai/AIAnalysisPanel';
import { analyzeMarket } from '@/services/aiTradingAnalyzer';

const LAYOUT_MODES = [
  { id: 'standard', label: 'Standard', icon: Grid3X3 },
  { id: 'chart-focus', label: 'Chart Focus', icon: BarChart3 },
  { id: 'trading-focus', label: 'Trading Focus', icon: TrendingUp }
];

const InstitutionalWorkspace = ({ 
  initialSymbol = 'BTCUSDT',
  className = ''
}) => {
  const [layoutMode, setLayoutMode] = useState('standard');
  const [showSidePanels, setShowSidePanels] = useState(true);
  const [activeSymbol, setActiveSymbol] = useState(initialSymbol);
  const [timeframe, setTimeframe] = useState('15m');
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Get data from Zustand store
  const currentPrice = useTradingStore((state) => state.currentPrice);
  const candles = useTradingStore((state) => state.candles);
  const setSymbol = useTradingStore((state) => state.setSymbol);
  const updateStoreTimeframe = useTradingStore((state) => state.setTimeframe);

  // Update store when symbol changes
  useEffect(() => {
    setSymbol(activeSymbol);
  }, [activeSymbol, setSymbol]);

  // Update store when timeframe changes
  useEffect(() => {
    updateStoreTimeframe(timeframe);
  }, [timeframe, updateStoreTimeframe]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  // AI Analysis Function
  const runAIAnalysis = () => {
    if (candles.length < 50) {
      alert('Need at least 50 candles for AI analysis');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeMarket(candles);
      setAiAnalysis(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  const renderLayout = () => {
    switch (layoutMode) {
      case 'chart-focus':
        return (
          <div className="flex h-full">
            {/* Main Chart - Full Width */}
            <div className="flex-1 p-4">
              <ProfessionalChart
                symbol={activeSymbol}
                initialTimeframe={timeframe}
                onTimeframeChange={handleTimeframeChange}
                className="h-full"
              />
            </div>
            
            {/* Collapsible Side Panel */}
            {showSidePanels && (
              <div className="w-80 border-l border-slate-800 bg-slate-950 p-4 space-y-4">
                <OrderPanel
                  symbol={activeSymbol}
                  currentPrice={currentPrice}
                  className="h-96"
                />
                <MarketDepth
                  symbol={activeSymbol}
                  currentPrice={currentPrice}
                  className="flex-1"
                />
              </div>
            )}
          </div>
        );

      case 'trading-focus':
        return (
          <div className="flex h-full">
            {/* Left Panel - Trading Tools */}
            <div className="w-96 border-r border-slate-800 bg-slate-950 p-4 space-y-4">
              <OrderPanel
                symbol={activeSymbol}
                currentPrice={currentPrice}
                className="h-auto"
              />
              <MarketDepth
                symbol={activeSymbol}
                currentPrice={currentPrice}
                className="flex-1"
              />
            </div>
            
            {/* Main Chart */}
            <div className="flex-1 p-4">
              <ProfessionalChart
                symbol={activeSymbol}
                initialTimeframe={timeframe}
                onTimeframeChange={handleTimeframeChange}
                className="h-full"
              />
            </div>
          </div>
        );

      default: // standard
        return (
          <div className="grid grid-cols-12 gap-4 h-full p-4">
            {/* Left Panel - Order Entry */}
            <div className="col-span-3">
              <OrderPanel
                symbol={activeSymbol}
                currentPrice={currentPrice}
                className="h-full"
              />
            </div>
            
            {/* Center - AI Trading Chart */}
            <div className="col-span-6 relative">
              <AdvancedAITradingChart />
            </div>
            
            {/* Right Panel - AI Analysis */}
            <div className="col-span-3">
              {showAIPanel ? (
                <AIAnalysisPanel
                  analysis={aiAnalysis}
                  isAnalyzing={isAnalyzing}
                  onRefresh={runAIAnalysis}
                />
              ) : (
                <MarketDepth
                  symbol={activeSymbol}
                  currentPrice={currentPrice}
                  className="h-full"
                />
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`w-full h-screen bg-slate-950 flex flex-col ${className}`}>
      {/* Top Navigation Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left - Symbol Selector & Status */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-100">
                Institutional Trading Workspace
              </h1>
              <p className="text-sm text-slate-400">
                Professional-grade trading platform
              </p>
            </div>
            
            {/* Symbol Selector */}
            <div className="flex items-center gap-2">
              <select
                value={activeSymbol}
                onChange={(e) => setActiveSymbol(e.target.value)}
                className="bg-slate-800 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <optgroup label="Cryptocurrency">
                  <option value="BTCUSDT">BTC/USDT</option>
                  <option value="ETHUSDT">ETH/USDT</option>
                  <option value="ADAUSDT">ADA/USDT</option>
                  <option value="SOLUSDT">SOL/USDT</option>
                </optgroup>
                <optgroup label="Forex">
                  <option value="EURUSD">EUR/USD</option>
                  <option value="GBPUSD">GBP/USD</option>
                  <option value="USDJPY">USD/JPY</option>
                  <option value="AUDUSD">AUD/USD</option>
                </optgroup>
                <optgroup label="Stocks">
                  <option value="AAPL">Apple Inc.</option>
                  <option value="TSLA">Tesla Inc.</option>
                  <option value="MSFT">Microsoft</option>
                  <option value="GOOGL">Alphabet</option>
                </optgroup>
              </select>
              
              {/* Live Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-2 bg-green-900/20 border border-green-800 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">LIVE</span>
              </div>
            </div>
          </div>

          {/* Right - Layout Controls */}
          <div className="flex items-center gap-2">
            {/* Layout Mode Selector */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
              {LAYOUT_MODES.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setLayoutMode(mode.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      layoutMode === mode.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    }`}
                    title={mode.label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            {/* Toggle AI Panel */}
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title={showAIPanel ? 'Show Market Depth' : 'Show AI Analysis'}
            >
              {showAIPanel ? (
                <BarChart3 className="w-5 h-5 text-slate-400" />
              ) : (
                <Brain className="w-5 h-5 text-blue-400" />
              )}
            </button>

            {/* Toggle Side Panels */}
            <button
              onClick={() => setShowSidePanels(!showSidePanels)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title={showSidePanels ? 'Hide Panels' : 'Show Panels'}
            >
              {showSidePanels ? (
                <EyeOff className="w-5 h-5 text-slate-400" />
              ) : (
                <Eye className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-slate-400" />
            </button>

            {/* Settings */}
            <button
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {renderLayout()}
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-slate-400">WebSocket Connected</span>
            </div>
            <div className="text-slate-400">
              Last Update: {new Date().toLocaleTimeString()}
            </div>
            <div className="text-slate-400">
              Latency: ~50ms
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-slate-400">
              {candles.length} candles loaded
            </div>
            <div className="text-slate-400">
              Mode: {LAYOUT_MODES.find(m => m.id === layoutMode)?.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalWorkspace;
