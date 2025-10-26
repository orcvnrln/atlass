/**
 * Market Depth Component - Level 2 Order Book
 * Shows bid/ask levels with volume visualization
 * Features: Real-time updates, order flow heatmap, spread calculation
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, Layers } from 'lucide-react';

const MarketDepth = ({ 
  symbol = 'BTCUSDT',
  currentPrice = 43250.50,
  className = ''
}) => {
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [showVolume, setShowVolume] = useState(true);
  const [depthLevels, setDepthLevels] = useState(20);

  // Generate mock order book data
  useEffect(() => {
    const generateOrderBook = () => {
      const bids = [];
      const asks = [];
      
      // Generate bids (below current price)
      for (let i = 0; i < depthLevels; i++) {
        const price = currentPrice - (i + 1) * (currentPrice * 0.0001);
        const volume = Math.random() * 10 + 0.5;
        bids.push({
          price,
          volume,
          total: volume,
          orders: Math.floor(Math.random() * 20) + 1
        });
      }
      
      // Generate asks (above current price)
      for (let i = 0; i < depthLevels; i++) {
        const price = currentPrice + (i + 1) * (currentPrice * 0.0001);
        const volume = Math.random() * 10 + 0.5;
        asks.push({
          price,
          volume,
          total: volume,
          orders: Math.floor(Math.random() * 20) + 1
        });
      }
      
      // Calculate cumulative totals
      let bidTotal = 0;
      bids.forEach(bid => {
        bidTotal += bid.volume;
        bid.total = bidTotal;
      });
      
      let askTotal = 0;
      asks.forEach(ask => {
        askTotal += ask.volume;
        ask.total = askTotal;
      });
      
      return { bids, asks };
    };

    setOrderBook(generateOrderBook());
    setLastUpdate(Date.now());

    // Update every 500ms
    const interval = setInterval(() => {
      setOrderBook(generateOrderBook());
      setLastUpdate(Date.now());
    }, 500);

    return () => clearInterval(interval);
  }, [currentPrice, depthLevels]);

  // Calculate spread
  const spread = useMemo(() => {
    if (orderBook.asks.length === 0 || orderBook.bids.length === 0) return 0;
    const bestAsk = orderBook.asks[0].price;
    const bestBid = orderBook.bids[0].price;
    return bestAsk - bestBid;
  }, [orderBook]);

  const spreadPercent = useMemo(() => {
    return (spread / currentPrice) * 100;
  }, [spread, currentPrice]);

  // Get max volume for scaling
  const maxVolume = useMemo(() => {
    const allVolumes = [...orderBook.bids, ...orderBook.asks].map(item => item.volume);
    return Math.max(...allVolumes, 1);
  }, [orderBook]);

  const formatPrice = (price) => {
    return price.toFixed(symbol.includes('JPY') ? 3 : 2);
  };

  const formatVolume = (volume) => {
    return volume.toFixed(3);
  };

  const getVolumeBarWidth = (volume) => {
    return (volume / maxVolume) * 100;
  };

  return (
    <div className={`bg-slate-950 border border-slate-800 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Market Depth</h3>
            <p className="text-sm text-slate-400">{symbol} • Level 2</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`p-2 rounded-lg transition-colors ${
                showVolume 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              title="Toggle Volume Bars"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <select
              value={depthLevels}
              onChange={(e) => setDepthLevels(Number(e.target.value))}
              className="bg-slate-800 text-slate-200 text-sm rounded px-2 py-1 border border-slate-700"
            >
              <option value={10}>10 Levels</option>
              <option value={20}>20 Levels</option>
              <option value={50}>50 Levels</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spread Info */}
      <div className="bg-slate-900/30 px-4 py-2 border-b border-slate-800">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-slate-400">Spread:</span>
            <span className="text-slate-100 font-mono font-semibold">
              {formatPrice(spread)}
            </span>
            <span className="text-slate-400">
              ({spreadPercent.toFixed(3)}%)
            </span>
          </div>
          <div className="text-slate-400 text-xs">
            Last update: {new Date(lastUpdate).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Order Book */}
      <div className="flex h-96">
        {/* Asks (Sell Orders) */}
        <div className="flex-1 border-r border-slate-800">
          <div className="bg-red-900/20 px-3 py-2 border-b border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-red-400">ASKS (SELL)</span>
              <div className="flex gap-4">
                <span className="text-slate-400">Price</span>
                <span className="text-slate-400">Volume</span>
                <span className="text-slate-400">Total</span>
              </div>
            </div>
          </div>
          <div className="overflow-y-auto h-full">
            {orderBook.asks.slice().reverse().map((ask, index) => (
              <div
                key={index}
                className="relative flex items-center justify-between px-3 py-1 hover:bg-red-900/10 transition-colors"
              >
                {/* Volume Bar */}
                {showVolume && (
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-red-500/10 border-r border-red-500/20"
                    style={{ width: `${getVolumeBarWidth(ask.volume)}%` }}
                  />
                )}
                <div className="relative z-10 flex items-center justify-between w-full text-xs font-mono">
                  <span className="text-red-400 font-semibold">
                    {formatPrice(ask.price)}
                  </span>
                  <div className="flex gap-4">
                    <span className="text-slate-300 w-16 text-right">
                      {formatVolume(ask.volume)}
                    </span>
                    <span className="text-slate-400 w-16 text-right">
                      {formatVolume(ask.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="flex-1">
          <div className="bg-green-900/20 px-3 py-2 border-b border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-green-400">BIDS (BUY)</span>
              <div className="flex gap-4">
                <span className="text-slate-400">Price</span>
                <span className="text-slate-400">Volume</span>
                <span className="text-slate-400">Total</span>
              </div>
            </div>
          </div>
          <div className="overflow-y-auto h-full">
            {orderBook.bids.map((bid, index) => (
              <div
                key={index}
                className="relative flex items-center justify-between px-3 py-1 hover:bg-green-900/10 transition-colors"
              >
                {/* Volume Bar */}
                {showVolume && (
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-green-500/10 border-r border-green-500/20"
                    style={{ width: `${getVolumeBarWidth(bid.volume)}%` }}
                  />
                )}
                <div className="relative z-10 flex items-center justify-between w-full text-xs font-mono">
                  <span className="text-green-400 font-semibold">
                    {formatPrice(bid.price)}
                  </span>
                  <div className="flex gap-4">
                    <span className="text-slate-300 w-16 text-right">
                      {formatVolume(bid.volume)}
                    </span>
                    <span className="text-slate-400 w-16 text-right">
                      {formatVolume(bid.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-slate-900/30 px-4 py-2 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-slate-400">Best Bid:</span>
              <span className="text-green-400 font-mono font-semibold">
                {orderBook.bids.length > 0 ? formatPrice(orderBook.bids[0].price) : '---'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-slate-400">Best Ask:</span>
              <span className="text-red-400 font-mono font-semibold">
                {orderBook.asks.length > 0 ? formatPrice(orderBook.asks[0].price) : '---'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">
              {orderBook.bids.length + orderBook.asks.length} levels
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDepth;
