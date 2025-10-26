/**
 * 💡 AI TOOLTIP COMPONENT
 * Interactive tooltip with OHLC data, AI signals, and market insights
 * Follows cursor with smooth animations and professional styling
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CandlestickData } from 'lightweight-charts';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface AISignal {
  id: string;
  type: 'breakout' | 'pullback' | 'liquidity_grab' | 'reversal';
  confidence: number;
  price: number;
  timestamp: number;
  message: string;
  riskReward?: number;
}

interface AITooltipProps {
  position: { x: number; y: number };
  candleData: CandlestickData;
  aiSignals: AISignal[];
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const AITooltip: React.FC<AITooltipProps> = ({
  position,
  candleData,
  aiSignals
}) => {
  // ─── CALCULATE CANDLE METRICS ───
  const change = candleData.close - candleData.open;
  const changePercent = (change / candleData.open) * 100;
  const isBullish = change > 0;
  
  // ─── FORMAT TIMESTAMP ───
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ─── FIND RELEVANT AI SIGNALS ───
  const relevantSignals = aiSignals.filter(signal => 
    Math.abs(signal.timestamp - (candleData.time as number) * 1000) < 300000 // Within 5 minutes
  );

  // ─── AI SENTIMENT ANALYSIS ───
  const getAISentiment = () => {
    if (relevantSignals.length === 0) return null;
    
    const avgConfidence = relevantSignals.reduce((sum, s) => sum + s.confidence, 0) / relevantSignals.length;
    const bullishSignals = relevantSignals.filter(s => s.type === 'breakout').length;
    const bearishSignals = relevantSignals.filter(s => s.type === 'reversal').length;
    
    return {
      sentiment: bullishSignals > bearishSignals ? 'bullish' : bearishSignals > bullishSignals ? 'bearish' : 'neutral',
      confidence: avgConfidence,
      signalCount: relevantSignals.length
    };
  };

  const aiSentiment = getAISentiment();

  // ─── POSITION CALCULATION ───
  const tooltipStyle = {
    left: position.x + 15,
    top: position.y - 10,
    transform: position.x > window.innerWidth - 300 ? 'translateX(-100%)' : 'none'
  };

  // ─── RENDER ───
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="fixed z-50 pointer-events-none"
      style={tooltipStyle}
    >
      <div className="bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl max-w-xs">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-400">
            {formatTime(candleData.time as number)}
          </div>
          {aiSentiment && (
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                aiSentiment.sentiment === 'bullish' ? 'bg-green-500' :
                aiSentiment.sentiment === 'bearish' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <span className="text-xs text-[#00c2ff]">AI</span>
            </div>
          )}
        </div>

        {/* OHLC Data */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Open:</span>
              <span className="text-white">${candleData.open.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">High:</span>
              <span className="text-green-400">${candleData.high.toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Low:</span>
              <span className="text-red-400">${candleData.low.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Close:</span>
              <span className="text-white">${candleData.close.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Change Indicator */}
        <div className="flex items-center justify-between mb-3 p-2 bg-gray-800/50 rounded">
          <span className="text-xs text-gray-400">Change:</span>
          <div className="text-right">
            <div className={`text-sm font-semibold ${isBullish ? 'text-[#00ff9c]' : 'text-[#ff4d4d]'}`}>
              {isBullish ? '+' : ''}${change.toFixed(2)}
            </div>
            <div className={`text-xs ${isBullish ? 'text-[#00ff9c]' : 'text-[#ff4d4d]'}`}>
              {isBullish ? '+' : ''}{changePercent.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        {aiSentiment && (
          <div className="border-t border-gray-700 pt-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
              <span className="text-xs text-[#00c2ff] font-semibold">AI Analysis</span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Sentiment:</span>
                <span className={`capitalize ${
                  aiSentiment.sentiment === 'bullish' ? 'text-green-400' :
                  aiSentiment.sentiment === 'bearish' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {aiSentiment.sentiment}
                </span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Confidence:</span>
                <span className="text-white">{Math.round(aiSentiment.confidence * 100)}%</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Signals:</span>
                <span className="text-[#00c2ff]">{aiSentiment.signalCount}</span>
              </div>
            </div>

            {/* Recent Signals */}
            {relevantSignals.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="text-xs text-gray-400 mb-1">Recent Signals:</div>
                {relevantSignals.slice(0, 2).map((signal) => (
                  <div key={signal.id} className="text-xs text-gray-300 mb-1">
                    <span className="capitalize">{signal.type.replace('_', ' ')}</span>
                    <span className="text-gray-500 ml-1">
                      ({Math.round(signal.confidence * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t border-gray-700 pt-2 mt-2">
          <div className="flex gap-2">
            <button className="flex-1 px-2 py-1 bg-[#00ff9c]/20 text-[#00ff9c] text-xs rounded hover:bg-[#00ff9c]/30 transition-colors">
              Buy
            </button>
            <button className="flex-1 px-2 py-1 bg-[#ff4d4d]/20 text-[#ff4d4d] text-xs rounded hover:bg-[#ff4d4d]/30 transition-colors">
              Sell
            </button>
          </div>
        </div>
      </div>

      {/* Tooltip Arrow */}
      <div 
        className="absolute w-2 h-2 bg-black/90 border-l border-t border-gray-700 transform rotate-45"
        style={{
          left: position.x > window.innerWidth - 300 ? 'calc(100% - 10px)' : '10px',
          top: '10px'
        }}
      />
    </motion.div>
  );
};

export default AITooltip;
