import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Target, Shield, AlertCircle,
  Maximize2, Settings, Eye, EyeOff, Layers, Copy, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdvancedTradingChart = ({ 
  symbol = 'EUR/USD', 
  timeframe = '1H',
  activeSetup = null,
  onSetupClick = () => {}
}) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(1.0850);
  const [showLevels, setShowLevels] = useState(true);
  const [hoveredLevel, setHoveredLevel] = useState(null);

  // Generate mock candlestick data
  useEffect(() => {
    const generateData = () => {
      const data = [];
      let price = 1.0800;
      const now = Date.now();
      
      for (let i = 0; i < 100; i++) {
        const time = now - (100 - i) * 3600000; // 1 hour intervals
        const open = price;
        const change = (Math.random() - 0.48) * 0.0020;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * 0.0010;
        const low = Math.min(open, close) - Math.random() * 0.0010;
        
        data.push({ time, open, high, low, close });
        price = close;
      }
      
      setCurrentPrice(data[data.length - 1].close);
      return data;
    };

    setChartData(generateData());

    // Update current price
    const interval = setInterval(() => {
      setCurrentPrice(prev => prev + (Math.random() - 0.5) * 0.0005);
    }, 2000);

    return () => clearInterval(interval);
  }, [symbol, timeframe]);

  // Trading levels from active setup
  const tradingLevels = activeSetup ? {
    entry: currentPrice,
    stopLoss: currentPrice - 0.0050,
    takeProfit1: currentPrice + 0.0075,
    takeProfit2: currentPrice + 0.0150,
    takeProfit3: currentPrice + 0.0225,
  } : null;

  // Calculate chart dimensions
  const chartHeight = 500;
  const chartWidth = chartRef.current?.offsetWidth || 800;
  const padding = { top: 20, right: 120, bottom: 40, left: 60 };

  // Price to Y coordinate
  const priceToY = (price) => {
    if (!chartData.length) return 0;
    const minPrice = Math.min(...chartData.map(d => d.low));
    const maxPrice = Math.max(...chartData.map(d => d.high));
    const range = maxPrice - minPrice;
    return padding.top + ((maxPrice - price) / range) * (chartHeight - padding.top - padding.bottom);
  };

  // Time to X coordinate
  const timeToX = (time, index) => {
    const availableWidth = chartWidth - padding.left - padding.right;
    return padding.left + (index / (chartData.length - 1)) * availableWidth;
  };

  return (
    <div className="bg-[#0f172a] rounded-xl border border-[#1e293b] overflow-hidden">
      {/* Chart Header */}
      <div className="bg-[#1e293b] px-4 py-3 border-b border-[#334155] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-white font-bold text-lg">{symbol}</h3>
            <p className="text-gray-400 text-sm">{timeframe} • Live</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              {currentPrice.toFixed(4)}
            </span>
            <span className={`text-sm ${currentPrice > 1.0850 ? 'text-green-400' : 'text-red-400'}`}>
              {currentPrice > 1.0850 ? '+' : ''}{((currentPrice - 1.0850) * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={showLevels ? 'default' : 'outline'}
            onClick={() => setShowLevels(!showLevels)}
            className={showLevels ? 'bg-[#3b82f6]' : ''}
          >
            {showLevels ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
            Levels
          </Button>
          <Button size="sm" variant="outline">
            <Layers className="w-4 h-4 mr-2" />
            Indicators
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div ref={chartRef} className="relative bg-[#0a0e1a]" style={{ height: chartHeight }}>
        <svg width="100%" height={chartHeight} className="absolute inset-0">
          {/* Grid Lines */}
          <g className="grid-lines">
            {[0, 1, 2, 3, 4].map(i => {
              const y = padding.top + (i * (chartHeight - padding.top - padding.bottom) / 4);
              return (
                <line
                  key={`grid-h-${i}`}
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}
          </g>

          {/* Candlesticks */}
          <g className="candlesticks">
            {chartData.map((candle, i) => {
              const x = timeToX(candle.time, i);
              const candleWidth = Math.max(2, (chartWidth - padding.left - padding.right) / chartData.length - 2);
              const isGreen = candle.close > candle.open;
              
              return (
                <g key={i}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={priceToY(candle.high)}
                    x2={x}
                    y2={priceToY(candle.low)}
                    stroke={isGreen ? '#10b981' : '#ef4444'}
                    strokeWidth="1"
                  />
                  {/* Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={Math.min(priceToY(candle.open), priceToY(candle.close))}
                    width={candleWidth}
                    height={Math.abs(priceToY(candle.close) - priceToY(candle.open)) || 1}
                    fill={isGreen ? '#10b981' : '#ef4444'}
                    opacity={0.8}
                  />
                </g>
              );
            })}
          </g>

          {/* Trading Levels */}
          {showLevels && tradingLevels && (
            <g className="trading-levels">
              {/* Entry Level */}
              <g
                onMouseEnter={() => setHoveredLevel('entry')}
                onMouseLeave={() => setHoveredLevel(null)}
              >
                <line
                  x1={padding.left}
                  y1={priceToY(tradingLevels.entry)}
                  x2={chartWidth - padding.right}
                  y2={priceToY(tradingLevels.entry)}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                />
                <text
                  x={chartWidth - padding.right + 10}
                  y={priceToY(tradingLevels.entry) + 5}
                  fill="#3b82f6"
                  fontSize="12"
                  fontWeight="bold"
                >
                  ENTRY {tradingLevels.entry.toFixed(4)}
                </text>
              </g>

              {/* Stop Loss */}
              <g
                onMouseEnter={() => setHoveredLevel('sl')}
                onMouseLeave={() => setHoveredLevel(null)}
              >
                <line
                  x1={padding.left}
                  y1={priceToY(tradingLevels.stopLoss)}
                  x2={chartWidth - padding.right}
                  y2={priceToY(tradingLevels.stopLoss)}
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <text
                  x={chartWidth - padding.right + 10}
                  y={priceToY(tradingLevels.stopLoss) + 5}
                  fill="#ef4444"
                  fontSize="12"
                  fontWeight="bold"
                >
                  SL {tradingLevels.stopLoss.toFixed(4)}
                </text>
              </g>

              {/* Take Profit Levels */}
              {[
                { key: 'tp1', price: tradingLevels.takeProfit1, label: 'TP1' },
                { key: 'tp2', price: tradingLevels.takeProfit2, label: 'TP2' },
                { key: 'tp3', price: tradingLevels.takeProfit3, label: 'TP3' }
              ].map(({ key, price, label }) => (
                <g
                  key={key}
                  onMouseEnter={() => setHoveredLevel(key)}
                  onMouseLeave={() => setHoveredLevel(null)}
                >
                  <line
                    x1={padding.left}
                    y1={priceToY(price)}
                    x2={chartWidth - padding.right}
                    y2={priceToY(price)}
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity={hoveredLevel === key ? 1 : 0.6}
                  />
                  <text
                    x={chartWidth - padding.right + 10}
                    y={priceToY(price) + 5}
                    fill="#10b981"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {label} {price.toFixed(4)}
                  </text>
                </g>
              ))}

              {/* Risk/Reward Zone */}
              <rect
                x={padding.left}
                y={priceToY(tradingLevels.takeProfit3)}
                width={chartWidth - padding.left - padding.right}
                height={priceToY(tradingLevels.entry) - priceToY(tradingLevels.takeProfit3)}
                fill="#10b981"
                opacity={0.05}
              />
              <rect
                x={padding.left}
                y={priceToY(tradingLevels.entry)}
                width={chartWidth - padding.left - padding.right}
                height={priceToY(tradingLevels.stopLoss) - priceToY(tradingLevels.entry)}
                fill="#ef4444"
                opacity={0.05}
              />
            </g>
          )}

          {/* Current Price Line */}
          <g className="current-price">
            <line
              x1={padding.left}
              y1={priceToY(currentPrice)}
              x2={chartWidth - padding.right}
              y2={priceToY(currentPrice)}
              stroke="#fbbf24"
              strokeWidth="2"
            />
            <rect
              x={chartWidth - padding.right + 5}
              y={priceToY(currentPrice) - 12}
              width={80}
              height={24}
              fill="#fbbf24"
              rx="4"
            />
            <text
              x={chartWidth - padding.right + 45}
              y={priceToY(currentPrice) + 5}
              fill="#000"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
            >
              {currentPrice.toFixed(4)}
            </text>
          </g>
        </svg>

        {/* Level Info Tooltip */}
        <AnimatePresence>
          {hoveredLevel && tradingLevels && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 left-4 bg-[#1e293b] border border-[#3b82f6] rounded-lg p-3 shadow-xl"
            >
              <div className="text-sm">
                <div className="font-bold text-white mb-1">
                  {hoveredLevel === 'entry' && 'Entry Level'}
                  {hoveredLevel === 'sl' && 'Stop Loss'}
                  {hoveredLevel === 'tp1' && 'Take Profit 1'}
                  {hoveredLevel === 'tp2' && 'Take Profit 2'}
                  {hoveredLevel === 'tp3' && 'Take Profit 3'}
                </div>
                <div className="text-gray-400">
                  {hoveredLevel === 'entry' && `Price: ${tradingLevels.entry.toFixed(4)}`}
                  {hoveredLevel === 'sl' && `Risk: ${((tradingLevels.entry - tradingLevels.stopLoss) * 10000).toFixed(1)} pips`}
                  {hoveredLevel === 'tp1' && `Reward: ${((tradingLevels.takeProfit1 - tradingLevels.entry) * 10000).toFixed(1)} pips (1.5R)`}
                  {hoveredLevel === 'tp2' && `Reward: ${((tradingLevels.takeProfit2 - tradingLevels.entry) * 10000).toFixed(1)} pips (3R)`}
                  {hoveredLevel === 'tp3' && `Reward: ${((tradingLevels.takeProfit3 - tradingLevels.entry) * 10000).toFixed(1)} pips (4.5R)`}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chart Footer - Quick Stats */}
      {activeSetup && (
        <div className="bg-[#1e293b] px-4 py-3 border-t border-[#334155] grid grid-cols-5 gap-4">
          <div>
            <div className="text-xs text-gray-400">Risk</div>
            <div className="text-sm font-bold text-red-400">
              {((tradingLevels.entry - tradingLevels.stopLoss) * 10000).toFixed(1)} pips
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Reward (TP3)</div>
            <div className="text-sm font-bold text-green-400">
              {((tradingLevels.takeProfit3 - tradingLevels.entry) * 10000).toFixed(1)} pips
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">R:R Ratio</div>
            <div className="text-sm font-bold text-[#3b82f6]">
              1:{((tradingLevels.takeProfit3 - tradingLevels.entry) / (tradingLevels.entry - tradingLevels.stopLoss)).toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Setup Score</div>
            <div className="text-sm font-bold text-yellow-400">{activeSetup.score}/100</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Confidence</div>
            <div className="text-sm font-bold text-white">{activeSetup.confidence}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedTradingChart;

