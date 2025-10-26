/**
 * Tick-by-Tick Price Feed Component
 * Shows real-time price changes with millisecond precision
 * Features: Trade flow, volume analysis, price impact visualization
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Volume2,
  Zap,
  Filter,
  Pause,
  Play
} from 'lucide-react';

const TickByTickFeed = ({ 
  symbol = 'BTCUSDT',
  currentPrice = 43250.50,
  className = ''
}) => {
  const [ticks, setTicks] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'large', 'buy', 'sell'
  const [showVolume, setShowVolume] = useState(true);
  const ticksRef = useRef([]);
  const containerRef = useRef(null);

  // Generate mock tick data
  useEffect(() => {
    if (isPaused) return;

    const generateTick = () => {
      const now = Date.now();
      const price = currentPrice + (Math.random() - 0.5) * (currentPrice * 0.001);
      const volume = Math.random() * 5 + 0.1;
      const side = Math.random() > 0.5 ? 'buy' : 'sell';
      const isLarge = volume > 3;
      
      const tick = {
        id: now + Math.random(),
        timestamp: now,
        price,
        volume,
        side,
        isLarge,
        priceChange: price - currentPrice,
        priceChangePercent: ((price - currentPrice) / currentPrice) * 100
      };

      setTicks(prevTicks => {
        const newTicks = [tick, ...prevTicks].slice(0, 100); // Keep last 100 ticks
        ticksRef.current = newTicks;
        return newTicks;
      });
    };

    // Generate ticks at random intervals (100-500ms)
    const scheduleNextTick = () => {
      const delay = Math.random() * 400 + 100;
      setTimeout(() => {
        generateTick();
        scheduleNextTick();
      }, delay);
    };

    scheduleNextTick();
  }, [currentPrice, isPaused]);

  // Auto-scroll to top when new ticks arrive
  useEffect(() => {
    if (containerRef.current && !isPaused) {
      containerRef.current.scrollTop = 0;
    }
  }, [ticks, isPaused]);

  // Filter ticks based on selected filter
  const filteredTicks = ticks.filter(tick => {
    switch (filter) {
      case 'large':
        return tick.isLarge;
      case 'buy':
        return tick.side === 'buy';
      case 'sell':
        return tick.side === 'sell';
      default:
        return true;
    }
  });

  // Calculate statistics
  const stats = {
    totalTicks: ticks.length,
    buyTicks: ticks.filter(t => t.side === 'buy').length,
    sellTicks: ticks.filter(t => t.side === 'sell').length,
    largeTicks: ticks.filter(t => t.isLarge).length,
    avgVolume: ticks.length > 0 ? ticks.reduce((sum, t) => sum + t.volume, 0) / ticks.length : 0,
    totalVolume: ticks.reduce((sum, t) => sum + t.volume, 0)
  };

  const formatPrice = (price) => {
    return price.toFixed(symbol.includes('JPY') ? 3 : 2);
  };

  const formatVolume = (volume) => {
    return volume.toFixed(3);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
  };

  const getTickColor = (tick) => {
    if (tick.side === 'buy') {
      return tick.isLarge ? 'text-green-400' : 'text-green-500';
    } else {
      return tick.isLarge ? 'text-red-400' : 'text-red-500';
    }
  };

  const getTickBgColor = (tick) => {
    if (tick.isLarge) {
      return tick.side === 'buy' ? 'bg-green-900/20' : 'bg-red-900/20';
    }
    return 'hover:bg-slate-800/50';
  };

  return (
    <div className={`bg-slate-950 border border-slate-800 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Tick Feed
            </h3>
            <p className="text-sm text-slate-400">{symbol} • Real-time</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Pause/Play */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`p-2 rounded-lg transition-colors ${
                isPaused 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>

            {/* Volume Toggle */}
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`p-2 rounded-lg transition-colors ${
                showVolume 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              title="Toggle Volume"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-800 text-slate-200 text-sm rounded px-2 py-1 border border-slate-700"
            >
              <option value="all">All Trades</option>
              <option value="large">Large Only</option>
              <option value="buy">Buy Only</option>
              <option value="sell">Sell Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="bg-slate-900/30 px-4 py-2 border-b border-slate-800">
        <div className="grid grid-cols-4 gap-4 text-xs">
          <div className="text-center">
            <div className="text-slate-400">Total</div>
            <div className="text-slate-100 font-semibold">{stats.totalTicks}</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Buy/Sell</div>
            <div className="text-slate-100 font-semibold">
              <span className="text-green-500">{stats.buyTicks}</span>
              /
              <span className="text-red-500">{stats.sellTicks}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Large</div>
            <div className="text-yellow-400 font-semibold">{stats.largeTicks}</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Avg Vol</div>
            <div className="text-slate-100 font-semibold">{stats.avgVolume.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Tick List Header */}
      <div className="bg-slate-900/20 px-4 py-2 border-b border-slate-800">
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-400">
          <div className="col-span-3">Time</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Change</div>
          {showVolume && <div className="col-span-2 text-right">Volume</div>}
          <div className={`${showVolume ? 'col-span-2' : 'col-span-4'} text-center`}>Side</div>
          <div className="col-span-1 text-center">Size</div>
        </div>
      </div>

      {/* Tick List */}
      <div 
        ref={containerRef}
        className="h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        {filteredTicks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No ticks match current filter</p>
            </div>
          </div>
        ) : (
          filteredTicks.map((tick) => (
            <div
              key={tick.id}
              className={`grid grid-cols-12 gap-2 px-4 py-1.5 text-xs font-mono transition-colors ${getTickBgColor(tick)}`}
            >
              {/* Time */}
              <div className="col-span-3 text-slate-400">
                {formatTime(tick.timestamp)}
              </div>
              
              {/* Price */}
              <div className={`col-span-2 text-right font-semibold ${getTickColor(tick)}`}>
                {formatPrice(tick.price)}
              </div>
              
              {/* Change */}
              <div className={`col-span-2 text-right ${tick.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {tick.priceChange >= 0 ? '+' : ''}{tick.priceChangePercent.toFixed(3)}%
              </div>
              
              {/* Volume */}
              {showVolume && (
                <div className="col-span-2 text-right text-slate-300">
                  {formatVolume(tick.volume)}
                </div>
              )}
              
              {/* Side */}
              <div className={`${showVolume ? 'col-span-2' : 'col-span-4'} text-center`}>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  tick.side === 'buy' 
                    ? 'bg-green-900/30 text-green-400' 
                    : 'bg-red-900/30 text-red-400'
                }`}>
                  {tick.side.toUpperCase()}
                </span>
              </div>
              
              {/* Size Indicator */}
              <div className="col-span-1 text-center">
                {tick.isLarge && (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mx-auto" title="Large Trade" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-900/30 px-4 py-2 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-slate-400">
              {isPaused ? 'Paused' : 'Live Feed'}
            </span>
          </div>
          <div className="text-slate-400">
            Total Volume: {stats.totalVolume.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TickByTickFeed;
