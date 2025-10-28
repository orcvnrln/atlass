/**
 * 🎨 TRADING LAYOUT
 * Bloomberg Terminal tərzi professional layout
 * Grid-based responsive design
 */

import React, { useEffect } from 'react';
import { PlotlyChart } from '../Chart/PlotlyChart';
import { AISuggestions } from '../AI/AISuggestions';
import { OrderPanel } from '../Order/OrderPanel';
import { useTradingStore } from '../../core/state/store';
import { initializeEventBus } from '../../core/events/eventBus';
import { wsManager, fetchHistoricalData } from '../../core/services/websocket';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const TradingLayout: React.FC = () => {
  const symbol = useTradingStore((state) => state.symbol);
  const timeframe = useTradingStore((state) => state.timeframe);
  const setSymbol = useTradingStore((state) => state.setSymbol);
  const setTimeframe = useTradingStore((state) => state.setTimeframe);
  const focusMode = useTradingStore((state) => state.focusMode);
  const toggleFocusMode = useTradingStore((state) => state.toggleFocusMode);

  // ─── INITIALIZATION ───
  useEffect(() => {
    console.log('[TradingLayout] Initializing...');

    // Initialize event bus
    initializeEventBus();

    // Fetch historical data
    fetchHistoricalData(symbol, timeframe);

    // Connect WebSocket
    wsManager.connect(symbol, timeframe);

    return () => {
      wsManager.disconnect();
    };
  }, []);

  // ─── RENDER ───
  return (
    <div className="h-screen w-screen bg-gray-950 text-gray-200 overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TC</span>
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Trading Cockpit
          </h1>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Symbol Selector */}
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="BTCUSDT">BTC/USDT</option>
            <option value="ETHUSDT">ETH/USDT</option>
            <option value="BNBUSDT">BNB/USDT</option>
            <option value="SOLUSDT">SOL/USDT</option>
          </select>

          {/* Timeframe Selector */}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1m">1m</option>
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="1h">1h</option>
            <option value="4h">4h</option>
            <option value="1d">1d</option>
          </select>

          {/* Focus Mode */}
          <button
            onClick={toggleFocusMode}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              focusMode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Focus Mode
          </button>

          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                wsManager.isConnected() ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-xs text-gray-500">
              {wsManager.isConnected() ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="h-[calc(100vh-3.5rem)] flex">
        {/* Left Panel - Order Entry */}
        {!focusMode && (
          <div className="w-80 flex-shrink-0">
            <OrderPanel />
          </div>
        )}

        {/* Center - Chart */}
        <div className="flex-1 bg-gray-900">
          <PlotlyChart />
        </div>

        {/* Right Panel - AI Suggestions */}
        {!focusMode && (
          <div className="w-96 flex-shrink-0">
            <AISuggestions />
          </div>
        )}
      </div>
    </div>
  );
};

