/**
 * 📊 ORDER BOOK PANEL COMPONENT
 * Real-time order book with depth visualization and heat map colors
 * Professional institutional-style order book display
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  spreadPercent: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const OrderBookPanel: React.FC = () => {
  const [orderBook, setOrderBook] = useState<OrderBookData>({
    bids: [],
    asks: [],
    spread: 0,
    spreadPercent: 0
  });

  const [maxSize, setMaxSize] = useState(0);

  // ─── GENERATE MOCK ORDER BOOK DATA ───
  useEffect(() => {
    const generateOrderBook = () => {
      const basePrice = 45000 + Math.random() * 1000; // Mock BTC price
      const bids: OrderBookEntry[] = [];
      const asks: OrderBookEntry[] = [];

      // Generate bids (below current price)
      let totalBids = 0;
      for (let i = 0; i < 15; i++) {
        const price = basePrice - (i + 1) * (Math.random() * 5 + 1);
        const size = Math.random() * 2 + 0.1;
        totalBids += size;
        bids.push({
          price: Math.round(price * 100) / 100,
          size: Math.round(size * 1000) / 1000,
          total: Math.round(totalBids * 1000) / 1000
        });
      }

      // Generate asks (above current price)
      let totalAsks = 0;
      for (let i = 0; i < 15; i++) {
        const price = basePrice + (i + 1) * (Math.random() * 5 + 1);
        const size = Math.random() * 2 + 0.1;
        totalAsks += size;
        asks.push({
          price: Math.round(price * 100) / 100,
          size: Math.round(size * 1000) / 1000,
          total: Math.round(totalAsks * 1000) / 1000
        });
      }

      const spread = asks[0]?.price - bids[0]?.price || 0;
      const spreadPercent = (spread / basePrice) * 100;

      setOrderBook({
        bids,
        asks: asks.reverse(), // Show highest asks first
        spread: Math.round(spread * 100) / 100,
        spreadPercent: Math.round(spreadPercent * 10000) / 10000
      });

      // Calculate max size for heat map
      const allSizes = [...bids, ...asks].map(entry => entry.size);
      setMaxSize(Math.max(...allSizes));
    };

    generateOrderBook();
    const interval = setInterval(generateOrderBook, 2000);
    return () => clearInterval(interval);
  }, []);

  // ─── HEAT MAP INTENSITY ───
  const getHeatIntensity = (size: number, isBid: boolean) => {
    const intensity = size / maxSize;
    const baseColor = isBid ? '0, 255, 156' : '255, 77, 77'; // Green for bids, red for asks
    return `rgba(${baseColor}, ${intensity * 0.3})`;
  };

  // ─── ORDER BOOK ROW ───
  const OrderBookRow: React.FC<{
    entry: OrderBookEntry;
    isBid: boolean;
    index: number;
  }> = ({ entry, isBid, index }) => (
    <motion.div
      initial={{ opacity: 0, x: isBid ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className="grid grid-cols-3 gap-2 py-1 px-2 text-xs hover:bg-white/5 transition-colors"
      style={{ backgroundColor: getHeatIntensity(entry.size, isBid) }}
    >
      <div className={`text-right ${isBid ? 'text-[#00ff9c]' : 'text-[#ff4d4d]'}`}>
        {entry.price.toLocaleString()}
      </div>
      <div className="text-right text-gray-300">
        {entry.size.toFixed(3)}
      </div>
      <div className="text-right text-gray-400">
        {entry.total.toFixed(3)}
      </div>
    </motion.div>
  );

  // ─── SPREAD INDICATOR ───
  const SpreadIndicator: React.FC = () => (
    <div className="py-2 px-2 bg-gray-800/50 border-y border-gray-700">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400">Spread</span>
        <div className="text-right">
          <div className="text-[#00c2ff]">${orderBook.spread}</div>
          <div className="text-gray-500">({orderBook.spreadPercent.toFixed(4)}%)</div>
        </div>
      </div>
    </div>
  );

  // ─── DEPTH VISUALIZATION ───
  const DepthVisualization: React.FC = () => {
    const bidDepth = orderBook.bids.reduce((sum, bid) => sum + bid.size, 0);
    const askDepth = orderBook.asks.reduce((sum, ask) => sum + ask.size, 0);
    const totalDepth = bidDepth + askDepth;
    
    const bidPercentage = totalDepth > 0 ? (bidDepth / totalDepth) * 100 : 50;
    const askPercentage = totalDepth > 0 ? (askDepth / totalDepth) * 100 : 50;

    return (
      <div className="p-2 border-b border-gray-700">
        <div className="text-xs text-gray-400 mb-2">Market Depth</div>
        <div className="flex h-2 rounded-full overflow-hidden bg-gray-800">
          <motion.div
            className="bg-[#00ff9c]"
            initial={{ width: 0 }}
            animate={{ width: `${bidPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="bg-[#ff4d4d]"
            initial={{ width: 0 }}
            animate={{ width: `${askPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Bids: {bidDepth.toFixed(2)}</span>
          <span>Asks: {askDepth.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  // ─── RENDER ───
  return (
    <div className="w-80 bg-[#0d1117] border-l border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Order Book</h3>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
      </div>

      {/* Depth Visualization */}
      <DepthVisualization />

      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-2 py-2 px-2 text-xs text-gray-400 border-b border-gray-700">
        <div className="text-right">Price</div>
        <div className="text-right">Size</div>
        <div className="text-right">Total</div>
      </div>

      {/* Order Book Content */}
      <div className="flex-1 overflow-hidden">
        {/* Asks (Sell Orders) */}
        <div className="h-1/2 overflow-y-auto">
          {orderBook.asks.map((ask, index) => (
            <OrderBookRow
              key={`ask-${ask.price}`}
              entry={ask}
              isBid={false}
              index={index}
            />
          ))}
        </div>

        {/* Spread */}
        <SpreadIndicator />

        {/* Bids (Buy Orders) */}
        <div className="h-1/2 overflow-y-auto">
          {orderBook.bids.map((bid, index) => (
            <OrderBookRow
              key={`bid-${bid.price}`}
              entry={bid}
              isBid={true}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-2 border-t border-gray-700 bg-gray-900/50">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-gray-400">Best Bid</div>
            <div className="text-[#00ff9c]">${orderBook.bids[0]?.price.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-400">Best Ask</div>
            <div className="text-[#ff4d4d]">${orderBook.asks[orderBook.asks.length - 1]?.price.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBookPanel;
