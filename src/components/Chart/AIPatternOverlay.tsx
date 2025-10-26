/**
 * 🤖 AI PATTERN OVERLAY COMPONENT
 * Displays AI-detected patterns and signals on the chart
 * Includes pattern recognition labels and confidence indicators
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IChartApi } from 'lightweight-charts';

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

interface AIPatternOverlayProps {
  signals: AISignal[];
  chartRef: React.RefObject<IChartApi | null>;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const AIPatternOverlay: React.FC<AIPatternOverlayProps> = ({
  signals,
  chartRef
}) => {
  const [visibleSignals, setVisibleSignals] = useState<AISignal[]>([]);

  // ─── UPDATE VISIBLE SIGNALS ───
  useEffect(() => {
    // Filter signals to show only recent ones
    const recentSignals = signals.filter(signal => 
      Date.now() - signal.timestamp < 300000 // Last 5 minutes
    );
    setVisibleSignals(recentSignals);
  }, [signals]);

  // ─── PATTERN TYPE STYLING ───
  const getPatternStyle = (type: AISignal['type']) => {
    switch (type) {
      case 'breakout':
        return {
          color: '#00ff9c',
          bgColor: 'rgba(0, 255, 156, 0.1)',
          borderColor: '#00ff9c',
          icon: '📈'
        };
      case 'pullback':
        return {
          color: '#f59e0b',
          bgColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: '#f59e0b',
          icon: '🔄'
        };
      case 'liquidity_grab':
        return {
          color: '#8b5cf6',
          bgColor: 'rgba(139, 92, 246, 0.1)',
          borderColor: '#8b5cf6',
          icon: '💧'
        };
      case 'reversal':
        return {
          color: '#ef4444',
          bgColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: '#ef4444',
          icon: '🔄'
        };
      default:
        return {
          color: '#00c2ff',
          bgColor: 'rgba(0, 194, 255, 0.1)',
          borderColor: '#00c2ff',
          icon: '🎯'
        };
    }
  };

  // ─── CONFIDENCE INDICATOR ───
  const ConfidenceBar: React.FC<{ confidence: number }> = ({ confidence }) => (
    <div className="flex items-center gap-1 mt-1">
      <span className="text-xs text-gray-400">Confidence:</span>
      <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
          initial={{ width: 0 }}
          animate={{ width: `${confidence * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs text-white">{Math.round(confidence * 100)}%</span>
    </div>
  );

  // ─── PATTERN LABEL ───
  const PatternLabel: React.FC<{ signal: AISignal; index: number }> = ({ signal, index }) => {
    const style = getPatternStyle(signal.type);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.1,
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        className="absolute z-10 pointer-events-none"
        style={{
          top: `${20 + index * 80}px`,
          right: '20px'
        }}
      >
        <div
          className="px-3 py-2 rounded-lg border backdrop-blur-sm shadow-lg"
          style={{
            backgroundColor: style.bgColor,
            borderColor: style.borderColor,
            color: style.color
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{style.icon}</span>
            <span className="font-semibold text-sm capitalize">
              {signal.type.replace('_', ' ')}
            </span>
          </div>
          
          <div className="text-xs text-gray-300 mb-1">
            {signal.message}
          </div>
          
          <ConfidenceBar confidence={signal.confidence} />
          
          {signal.riskReward && (
            <div className="text-xs text-gray-400 mt-1">
              R/R: {signal.riskReward}:1
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-1">
            ${signal.price.toFixed(2)}
          </div>
        </div>
      </motion.div>
    );
  };

  // ─── AI ANALYSIS SUMMARY ───
  const AIAnalysisSummary: React.FC = () => {
    const totalSignals = visibleSignals.length;
    const avgConfidence = totalSignals > 0 
      ? visibleSignals.reduce((sum, s) => sum + s.confidence, 0) / totalSignals 
      : 0;

    if (totalSignals === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="absolute top-4 right-4 z-20"
      >
        <div className="bg-black/80 backdrop-blur-sm border border-[#00c2ff]/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
            <span className="text-[#00c2ff] text-sm font-semibold">AI Analysis</span>
          </div>
          
          <div className="text-xs text-gray-300 space-y-1">
            <div>Active Signals: {totalSignals}</div>
            <div>Avg Confidence: {Math.round(avgConfidence * 100)}%</div>
          </div>
        </div>
      </motion.div>
    );
  };

  // ─── RENDER ───
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* AI Analysis Summary */}
      <AnimatePresence>
        <AIAnalysisSummary />
      </AnimatePresence>

      {/* Pattern Labels */}
      <AnimatePresence mode="popLayout">
        {visibleSignals.map((signal, index) => (
          <PatternLabel
            key={signal.id}
            signal={signal}
            index={index}
          />
        ))}
      </AnimatePresence>

      {/* AI Processing Indicator */}
      <motion.div
        className="absolute bottom-4 left-4 z-10"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
          <span className="text-[#00c2ff] text-xs">AI Scanning...</span>
        </div>
      </motion.div>

      {/* Pattern Recognition Zones */}
      <AnimatePresence>
        {visibleSignals.map((signal) => {
          const style = getPatternStyle(signal.type);
          return (
            <motion.div
              key={`zone-${signal.id}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute border-2 border-dashed rounded-lg"
              style={{
                borderColor: style.borderColor,
                backgroundColor: style.bgColor,
                width: '100px',
                height: '60px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AIPatternOverlay;
