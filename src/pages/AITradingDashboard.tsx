/**
 * 🚀 AI TRADING DASHBOARD
 * Complete TradingView-style platform with AI integration
 * Main dashboard page combining chart and AI analysis
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Layers,
  Settings,
  TrendingUp,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { AdvancedAITradingChart } from '../components/Chart/AdvancedAITradingChart';
import { AIAnalysisPanel } from '../components/ai/AIAnalysisPanel';
import { useTradingStore } from '../core/state/store';
import { analyzeMarket } from '../services/aiTradingAnalyzer';
import { AIAnalysisResult } from '../services/aiTradingAnalyzer';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface DrawingTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  active: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const AITradingDashboard: React.FC = () => {
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [drawingTools, setDrawingTools] = useState<DrawingTool[]>([
    { id: 'trendline', name: 'Trend Line', icon: '📈', active: false },
    { id: 'fibonacci', name: 'Fibonacci', icon: '🔢', active: false },
    { id: 'rectangle', name: 'Rectangle', icon: '▢', active: false },
    { id: 'horizontal', name: 'Horizontal Line', icon: '─', active: false },
  ]);

  // Store
  const symbol = useTradingStore((state) => state.symbol);
  const timeframe = useTradingStore((state) => state.timeframe);
  const candles = useTradingStore((state) => state.candles);
  const setSymbol = useTradingStore((state) => state.setSymbol);
  const setTimeframe = useTradingStore((state) => state.setTimeframe);

  // ─── RUN AI ANALYSIS ───
  const runAIAnalysis = () => {
    if (candles.length < 50) {
      alert('Need at least 50 candles for analysis');
      return;
    }

    setIsAnalyzing(true);

    // Simulate async analysis
    setTimeout(() => {
      const result = analyzeMarket(candles);
      setAiAnalysis(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  // ─── TOGGLE DRAWING TOOL ───
  const toggleDrawingTool = (toolId: string) => {
    setDrawingTools(
      drawingTools.map((tool) =>
        tool.id === toolId
          ? { ...tool, active: !tool.active }
          : { ...tool, active: false }
      )
    );
  };

  // ─── RENDER HEADER ───
  const renderHeader = () => {
    return (
      <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              ATLAS AI Trader
            </h1>
            <p className="text-xs text-gray-500">Professional Trading Platform</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Symbol Selector */}
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-750 transition-colors"
          >
            <option value="BTCUSDT">BTC/USDT</option>
            <option value="ETHUSDT">ETH/USDT</option>
            <option value="BNBUSDT">BNB/USDT</option>
            <option value="SOLUSDT">SOL/USDT</option>
            <option value="EURUSD">EUR/USD</option>
            <option value="GBPUSD">GBP/USD</option>
            <option value="XAUUSD">GOLD</option>
          </select>

          {/* Timeframe Buttons */}
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            {['1m', '5m', '15m', '1h', '4h', '1d', '1w'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-400 font-medium">Live</span>
          </div>

          {/* AI Status */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/50 rounded-lg">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">
              AI {isAnalyzing ? 'Analyzing...' : 'Online'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ─── RENDER SIDEBAR ───
  const renderSidebar = () => {
    if (!showSidebar) return null;

    return (
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            Tools & Layers
          </h3>
        </div>

        {/* Drawing Tools */}
        <div className="p-4">
          <div className="text-xs text-gray-500 font-semibold mb-3">
            Drawing Tools
          </div>
          <div className="space-y-2">
            {drawingTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => toggleDrawingTool(tool.id)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${
                  tool.active
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{tool.icon}</span>
                <span>{tool.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 font-semibold mb-3">
            Indicators
          </div>
          <div className="space-y-2">
            {[
              'Moving Averages',
              'RSI',
              'MACD',
              'Bollinger Bands',
              'Volume Profile',
              'VWAP',
            ].map((indicator) => (
              <label
                key={indicator}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-700 bg-gray-800 checked:bg-blue-600 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">
                  {indicator}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Overlays */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 font-semibold mb-3">
            AI Overlays
          </div>
          <div className="space-y-2">
            {[
              'Order Blocks',
              'Fair Value Gaps',
              'Liquidity Pools',
              'Support/Resistance',
              'BOS/CHoCH Markers',
            ].map((overlay) => (
              <label
                key={overlay}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-700 bg-gray-800 checked:bg-purple-600 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">
                  {overlay}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sessions */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 font-semibold mb-3">
            Trading Sessions
          </div>
          <div className="space-y-2">
            {[
              { name: 'London', color: 'bg-yellow-500' },
              { name: 'New York', color: 'bg-blue-500' },
              { name: 'Asia', color: 'bg-red-500' },
            ].map((session) => (
              <label
                key={session.name}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-700 bg-gray-800 checked:bg-green-600 focus:ring-0 focus:ring-offset-0"
                />
                <div className={`w-2 h-2 rounded-full ${session.color}`} />
                <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">
                  {session.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Settings */}
        <div className="p-4 border-t border-gray-800">
          <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </motion.div>
    );
  };

  // ─── RENDER BOTTOM TOOLBAR ───
  const renderBottomToolbar = () => {
    return (
      <div className="h-12 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-6">
        {/* Left: Session Info */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>Current Session: <span className="text-blue-400 font-medium">NY</span></span>
          <span className="text-gray-700">|</span>
          <span>Spread: <span className="text-white font-mono">0.2</span></span>
          <span className="text-gray-700">|</span>
          <span>Latency: <span className="text-green-400 font-mono">12ms</span></span>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium rounded transition-colors">
            Export PNG
          </button>
          <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium rounded transition-colors">
            Export CSV
          </button>
          <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium rounded transition-colors flex items-center gap-2">
            <BarChart3 className="w-3 h-3" />
            Reports
          </button>
        </div>
      </div>
    );
  };

  // ─── RENDER ───
  return (
    <div className="h-screen w-screen bg-[#0B0D10] flex flex-col overflow-hidden">
      {/* Header */}
      {renderHeader()}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute top-20 left-2 z-50 p-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors"
        >
          {showSidebar ? (
            <X className="w-4 h-4 text-gray-400" />
          ) : (
            <Menu className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* Left Sidebar */}
        {renderSidebar()}

        {/* Main Chart Area */}
        <div className="flex-1 flex">
          {/* Chart */}
          <div className="flex-1 relative">
            <AdvancedAITradingChart />
          </div>

          {/* Right Panel - AI Analysis */}
          <AIAnalysisPanel
            analysis={aiAnalysis}
            isAnalyzing={isAnalyzing}
            onRefresh={runAIAnalysis}
          />
        </div>
      </div>

      {/* Bottom Toolbar */}
      {renderBottomToolbar()}
    </div>
  );
};

export default AITradingDashboard;
