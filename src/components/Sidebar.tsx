/**
 * 🎨 SIDEBAR
 * Bloomberg Terminal tərzi navigation sidebar
 */

import React from 'react';
import { useTradingStore } from '../core/state/store';
import { wsManager } from '../core/services/websocket';

export const Sidebar: React.FC = () => {
  const symbol = useTradingStore((state) => state.symbol);
  const currentPrice = useTradingStore((state) => state.currentPrice);
  const positions = useTradingStore((state) => state.positions);
  const orders = useTradingStore((state) => state.orders);

  // Calculate total PnL
  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalPnLPercent = positions.reduce((sum, pos) => sum + pos.pnlPercent, 0) / (positions.length || 1);

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800/50 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">TC</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100">Trading Cockpit</h1>
            <p className="text-xs text-slate-500">Institutional Platform</p>
          </div>
        </div>
      </div>

      {/* Market Info */}
      <div className="p-4 border-b border-slate-800/50">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Symbol</span>
            <span className="text-sm font-mono font-bold text-slate-200">{symbol}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Price</span>
            <span className="text-sm font-mono font-bold text-emerald-400">
              {currentPrice > 0 ? currentPrice.toFixed(2) : '-'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div
              className={`w-2 h-2 rounded-full ${
                wsManager.isConnected() ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />
            <span className="text-xs text-slate-500">
              {wsManager.isConnected() ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="p-4 border-b border-slate-800/50">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Portfolio
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Positions</span>
            <span className="text-sm font-mono font-bold text-slate-200">{positions.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Orders</span>
            <span className="text-sm font-mono font-bold text-slate-200">{orders.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Total PnL</span>
            <span
              className={`text-sm font-mono font-bold ${
                totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {totalPnL >= 0 ? '+' : ''}
              {totalPnL.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">PnL %</span>
            <span
              className={`text-sm font-mono font-bold ${
                totalPnLPercent >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {totalPnLPercent >= 0 ? '+' : ''}
              {totalPnLPercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 flex-1">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors">
            New Position
          </button>
          <button className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors">
            Close All
          </button>
          <button className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors">
            Export Data
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/50">
        <p className="text-xs text-slate-600 text-center">
          © 2025 Trading Cockpit
        </p>
      </div>
    </div>
  );
};

export default Sidebar;

