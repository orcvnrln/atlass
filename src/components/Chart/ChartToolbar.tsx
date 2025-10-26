/**
 * 🛠️ CHART TOOLBAR COMPONENT
 * Professional trading toolbar with timeframes, indicators, drawing tools, and AI controls
 * MotiveWave-inspired minimal design with institutional functionality
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Zap, 
  Target, 
  Layers,
  Brain,
  Download,
  Share,
  Maximize
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface ChartToolbarProps {
  selectedTimeframe: string;
  activeIndicators: string[];
  onTimeframeChange: (timeframe: string) => void;
  onIndicatorToggle: (indicator: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const ChartToolbar: React.FC<ChartToolbarProps> = ({
  selectedTimeframe,
  activeIndicators,
  onTimeframeChange,
  onIndicatorToggle
}) => {
  const [aiMode, setAiMode] = useState<'auto' | 'manual' | 'off'>('auto');
  const [showDrawingTools, setShowDrawingTools] = useState(false);

  // ─── TIMEFRAMES ───
  const timeframes = [
    { label: '1m', value: '1M' },
    { label: '5m', value: '5M' },
    { label: '15m', value: '15M' },
    { label: '1h', value: '1H' },
    { label: '4h', value: '4H' },
    { label: '1d', value: '1D' },
    { label: '1w', value: '1W' }
  ];

  // ─── INDICATORS ───
  const indicators = [
    { label: 'MA20', name: 'Moving Average 20', color: '#a3e635' },
    { label: 'VWAP', name: 'Volume Weighted Average Price', color: '#f59e0b' },
    { label: 'RSI', name: 'Relative Strength Index', color: '#8b5cf6' },
    { label: 'MACD', name: 'MACD', color: '#06b6d4' },
    { label: 'BB', name: 'Bollinger Bands', color: '#ec4899' },
    { label: 'Volume', name: 'Volume', color: '#334155' }
  ];

  // ─── DRAWING TOOLS ───
  const drawingTools = [
    { label: 'Line', icon: '📏' },
    { label: 'Rectangle', icon: '⬜' },
    { label: 'Fibonacci', icon: '🌀' },
    { label: 'Support/Resistance', icon: '📊' }
  ];

  // ─── TIMEFRAME SELECTOR ───
  const TimeframeSelector: React.FC = () => (
    <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
      {timeframes.map((tf) => (
        <motion.button
          key={tf.value}
          onClick={() => onTimeframeChange(tf.value)}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            selectedTimeframe === tf.value
              ? 'bg-[#00c2ff] text-black font-semibold'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {tf.label}
        </motion.button>
      ))}
    </div>
  );

  // ─── INDICATOR TOGGLES ───
  const IndicatorToggles: React.FC = () => (
    <div className="flex items-center gap-2">
      {indicators.map((indicator) => (
        <motion.button
          key={indicator.label}
          onClick={() => onIndicatorToggle(indicator.label)}
          className={`px-2 py-1 text-xs rounded border transition-colors ${
            activeIndicators.includes(indicator.label)
              ? 'border-current text-white'
              : 'border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
          }`}
          style={{
            borderColor: activeIndicators.includes(indicator.label) ? indicator.color : undefined,
            color: activeIndicators.includes(indicator.label) ? indicator.color : undefined
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={indicator.name}
        >
          {indicator.label}
        </motion.button>
      ))}
    </div>
  );

  // ─── AI CONTROLS ───
  const AIControls: React.FC = () => (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
        {(['auto', 'manual', 'off'] as const).map((mode) => (
          <motion.button
            key={mode}
            onClick={() => setAiMode(mode)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              aiMode === mode
                ? 'bg-[#00c2ff] text-black font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mode === 'auto' && '🤖'}
            {mode === 'manual' && '👤'}
            {mode === 'off' && '⏸️'}
            <span className="ml-1 capitalize">{mode}</span>
          </motion.button>
        ))}
      </div>

      <motion.button
        className="p-2 text-[#00c2ff] hover:bg-gray-800/50 rounded-lg transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="AI Analysis Settings"
      >
        <Brain size={16} />
      </motion.button>
    </div>
  );

  // ─── DRAWING TOOLS ───
  const DrawingTools: React.FC = () => (
    <div className="relative">
      <motion.button
        onClick={() => setShowDrawingTools(!showDrawingTools)}
        className={`p-2 rounded-lg transition-colors ${
          showDrawingTools 
            ? 'bg-[#00c2ff] text-black' 
            : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Drawing Tools"
      >
        <Layers size={16} />
      </motion.button>

      {showDrawingTools && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg p-2 z-50"
        >
          <div className="grid grid-cols-2 gap-1">
            {drawingTools.map((tool) => (
              <button
                key={tool.label}
                className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
              >
                <span>{tool.icon}</span>
                <span>{tool.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );

  // ─── ACTION BUTTONS ───
  const ActionButtons: React.FC = () => (
    <div className="flex items-center gap-2">
      <motion.button
        className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Export Chart"
      >
        <Download size={16} />
      </motion.button>

      <motion.button
        className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Share Chart"
      >
        <Share size={16} />
      </motion.button>

      <motion.button
        className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Fullscreen"
      >
        <Maximize size={16} />
      </motion.button>

      <motion.button
        className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Chart Settings"
      >
        <Settings size={16} />
      </motion.button>
    </div>
  );

  // ─── RENDER ───
  return (
    <div className="bg-[#0d1117] border-b border-gray-800 p-3">
      <div className="flex items-center justify-between">
        {/* Left Section - Timeframes */}
        <div className="flex items-center gap-4">
          <TimeframeSelector />
          <div className="w-px h-6 bg-gray-700" />
          <IndicatorToggles />
        </div>

        {/* Center Section - AI Status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-800/30 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${
              aiMode === 'auto' ? 'bg-[#00c2ff] animate-pulse' :
              aiMode === 'manual' ? 'bg-yellow-500' : 'bg-gray-500'
            }`} />
            <span className="text-xs text-gray-300">
              AI {aiMode === 'auto' ? 'Active' : aiMode === 'manual' ? 'Manual' : 'Disabled'}
            </span>
          </div>
        </div>

        {/* Right Section - Tools & Actions */}
        <div className="flex items-center gap-4">
          <AIControls />
          <div className="w-px h-6 bg-gray-700" />
          <DrawingTools />
          <div className="w-px h-6 bg-gray-700" />
          <ActionButtons />
        </div>
      </div>
    </div>
  );
};

export default ChartToolbar;
