/**
 * 📋 WATCHLIST SIDEBAR COMPONENT
 * Professional watchlist with real-time prices, AI signals, and quick chart switching
 * MotiveWave-inspired compact design with institutional functionality
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Star, Plus, Search } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  aiSignal?: 'bullish' | 'bearish' | 'neutral';
  aiConfidence?: number;
  isFavorite: boolean;
}

interface Position {
  symbol: string;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const WatchlistSidebar: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [activeTab, setActiveTab] = useState<'watchlist' | 'positions'>('watchlist');
  const [searchTerm, setSearchTerm] = useState('');

  // ─── INITIALIZE MOCK DATA ───
  useEffect(() => {
    const mockWatchlist: WatchlistItem[] = [
      {
        symbol: 'BTCUSD',
        name: 'Bitcoin',
        price: 45234.56,
        change: 1234.56,
        changePercent: 2.81,
        volume: 1234567890,
        aiSignal: 'bullish',
        aiConfidence: 0.85,
        isFavorite: true
      },
      {
        symbol: 'ETHUSD',
        name: 'Ethereum',
        price: 2845.32,
        change: -45.23,
        changePercent: -1.56,
        volume: 987654321,
        aiSignal: 'bearish',
        aiConfidence: 0.72,
        isFavorite: true
      },
      {
        symbol: 'ADAUSD',
        name: 'Cardano',
        price: 0.4523,
        change: 0.0234,
        changePercent: 5.45,
        volume: 456789123,
        aiSignal: 'bullish',
        aiConfidence: 0.68,
        isFavorite: false
      },
      {
        symbol: 'SOLUSD',
        name: 'Solana',
        price: 98.76,
        change: 3.45,
        changePercent: 3.62,
        volume: 234567890,
        aiSignal: 'neutral',
        aiConfidence: 0.55,
        isFavorite: false
      }
    ];

    const mockPositions: Position[] = [
      {
        symbol: 'BTCUSD',
        side: 'long',
        size: 0.5,
        entryPrice: 44000,
        currentPrice: 45234.56,
        pnl: 617.28,
        pnlPercent: 2.81
      },
      {
        symbol: 'ETHUSD',
        side: 'short',
        size: 2.0,
        entryPrice: 2900,
        currentPrice: 2845.32,
        pnl: 109.36,
        pnlPercent: 1.89
      }
    ];

    setWatchlist(mockWatchlist);
    setPositions(mockPositions);
  }, []);

  // ─── UPDATE PRICES (MOCK) ───
  useEffect(() => {
    const interval = setInterval(() => {
      setWatchlist(prev => prev.map(item => ({
        ...item,
        price: item.price + (Math.random() - 0.5) * item.price * 0.001,
        change: item.change + (Math.random() - 0.5) * 10,
        changePercent: item.changePercent + (Math.random() - 0.5) * 0.5
      })));

      setPositions(prev => prev.map(pos => {
        const newPrice = pos.currentPrice + (Math.random() - 0.5) * pos.currentPrice * 0.001;
        const pnl = pos.side === 'long' 
          ? (newPrice - pos.entryPrice) * pos.size
          : (pos.entryPrice - newPrice) * pos.size;
        const pnlPercent = (pnl / (pos.entryPrice * pos.size)) * 100;
        
        return {
          ...pos,
          currentPrice: newPrice,
          pnl,
          pnlPercent
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ─── FILTER WATCHLIST ───
  const filteredWatchlist = watchlist.filter(item =>
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─── WATCHLIST ITEM ───
  const WatchlistItem: React.FC<{ item: WatchlistItem; index: number }> = ({ item, index }) => {
    const isPositive = item.change > 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="p-3 hover:bg-gray-800/50 cursor-pointer border-b border-gray-800 transition-colors"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWatchlist(prev => prev.map(w => 
                w.symbol === item.symbol ? { ...w, isFavorite: !w.isFavorite } : w
              ))}
              className="text-gray-400 hover:text-yellow-500 transition-colors"
            >
              <Star size={12} fill={item.isFavorite ? 'currentColor' : 'none'} />
            </button>
            <span className="text-sm font-semibold text-white">{item.symbol}</span>
          </div>
          
          {item.aiSignal && (
            <div className={`w-2 h-2 rounded-full ${
              item.aiSignal === 'bullish' ? 'bg-green-500' :
              item.aiSignal === 'bearish' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
          )}
        </div>

        <div className="text-xs text-gray-400 mb-2">{item.name}</div>

        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-white">${item.price.toFixed(2)}</span>
          <div className={`text-xs ${isPositive ? 'text-[#00ff9c]' : 'text-[#ff4d4d]'}`}>
            {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs ${isPositive ? 'text-[#00ff9c]' : 'text-[#ff4d4d]'}`}>
            {isPositive ? '+' : ''}${item.change.toFixed(2)}
          </span>
          {item.aiConfidence && (
            <span className="text-xs text-[#00c2ff]">
              AI: {Math.round(item.aiConfidence * 100)}%
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  // ─── POSITION ITEM ───
  const PositionItem: React.FC<{ position: Position; index: number }> = ({ position, index }) => {
    const isProfit = position.pnl > 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="p-3 hover:bg-gray-800/50 cursor-pointer border-b border-gray-800 transition-colors"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-white">{position.symbol}</span>
          <span className={`text-xs px-2 py-1 rounded ${
            position.side === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {position.side.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Size: {position.size}</span>
          <span className="text-xs text-gray-400">Entry: ${position.entryPrice.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-white">Current: ${position.currentPrice.toFixed(2)}</span>
          <div className={`text-xs ${isProfit ? 'text-[#00ff9c]' : 'text-[#ff4d4d]'}`}>
            {isProfit ? '+' : ''}${position.pnl.toFixed(2)} ({isProfit ? '+' : ''}{position.pnlPercent.toFixed(2)}%)
          </div>
        </div>
      </motion.div>
    );
  };

  // ─── RENDER ───
  return (
    <div className="w-64 bg-[#0d1117] border-r border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Markets</h3>
          <button className="p-1 text-gray-400 hover:text-white transition-colors">
            <Plus size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-800/50 rounded-lg p-1">
          {(['watchlist', 'positions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                activeTab === tab
                  ? 'bg-[#00c2ff] text-black font-semibold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {tab === 'watchlist' ? 'Watchlist' : 'Positions'}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      {activeTab === 'watchlist' && (
        <div className="p-3 border-b border-gray-700">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#00c2ff]"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'watchlist' ? (
            <motion.div
              key="watchlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredWatchlist.map((item, index) => (
                <WatchlistItem key={item.symbol} item={item} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="positions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {positions.map((position, index) => (
                <PositionItem key={position.symbol} position={position} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-gray-700 bg-gray-900/50">
        {activeTab === 'positions' && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Total P&L:</span>
              <span className={`${
                positions.reduce((sum, p) => sum + p.pnl, 0) > 0 ? 'text-[#00ff9c]' : 'text-[#ff4d4d]'
              }`}>
                ${positions.reduce((sum, p) => sum + p.pnl, 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Open Positions:</span>
              <span className="text-white">{positions.length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistSidebar;
