/**
 * 🎯 AI-INTEGRATED CHART PAGE
 * MotiveWave-inspired professional trading interface
 * Complete institutional-grade chart with AI features
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { AIIntegratedChart } from '../components/Chart/AIIntegratedChart';
import { useTradingStore } from '../core/state/store';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA GENERATION
// ─────────────────────────────────────────────────────────────────────────────

const generateMockCandles = (count: number = 200) => {
  const candles = [];
  let basePrice = 45000;
  let timestamp = Date.now() - (count * 60 * 1000); // 1 minute intervals

  for (let i = 0; i < count; i++) {
    const volatility = 0.002; // 0.2% volatility
    const trend = Math.sin(i / 20) * 0.001; // Slight trend
    
    const open = basePrice;
    const change = (Math.random() - 0.5) * volatility + trend;
    const close = open * (1 + change);
    
    const high = Math.max(open, close) * (1 + Math.random() * 0.001);
    const low = Math.min(open, close) * (1 - Math.random() * 0.001);
    
    const volume = Math.random() * 1000000 + 500000;

    candles.push({
      timestamp,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.round(volume)
    });

    basePrice = close;
    timestamp += 60 * 1000; // Next minute
  }

  return candles;
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const AIIntegratedChartPage: React.FC = () => {
  const setCandles = useTradingStore((state) => state.setCandles);
  const setSymbol = useTradingStore((state) => state.setSymbol);
  const setTimeframe = useTradingStore((state) => state.setTimeframe);
  const setIsLoading = useTradingStore((state) => state.setIsLoading);

  // ─── INITIALIZE DATA ───
  useEffect(() => {
    setIsLoading(true);
    setSymbol('BTCUSD');
    setTimeframe('1H');

    // Simulate loading delay
    setTimeout(() => {
      const mockCandles = generateMockCandles(200);
      setCandles(mockCandles);
      setIsLoading(false);
    }, 1000);

    // Real-time updates simulation
    const interval = setInterval(() => {
      const newCandle = generateMockCandles(1)[0];
      newCandle.timestamp = Date.now();
      
      setCandles((prevCandles) => {
        const updated = [...prevCandles];
        updated[updated.length - 1] = newCandle;
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [setCandles, setSymbol, setTimeframe, setIsLoading]);

  // ─── RENDER ───
  return (
    <>
      <Helmet>
        <title>AI-Integrated Professional Chart | Bloomberg Terminal Pro</title>
        <meta name="description" content="MotiveWave-inspired institutional trading platform with AI pattern recognition, risk analysis, and professional charting tools." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="h-screen bg-[#0d1117] overflow-hidden"
      >
        {/* Professional Chart Interface */}
        <AIIntegratedChart />

        {/* Keyboard Shortcuts Overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2"
          >
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span><kbd className="bg-gray-800 px-1 rounded">Space</kbd> Play/Pause</span>
              <span><kbd className="bg-gray-800 px-1 rounded">F</kbd> Fullscreen</span>
              <span><kbd className="bg-gray-800 px-1 rounded">R</kbd> Reset Zoom</span>
              <span><kbd className="bg-gray-800 px-1 rounded">Esc</kbd> Clear Selection</span>
            </div>
          </motion.div>
        </div>

        {/* AI Status Indicator */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="bg-black/80 backdrop-blur-sm border border-[#00c2ff]/30 rounded-lg px-4 py-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
              <span className="text-[#00c2ff] text-sm font-semibold">AI Trading Assistant Active</span>
              <div className="w-px h-4 bg-gray-600 mx-2" />
              <span className="text-gray-400 text-xs">Real-time Pattern Recognition</span>
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics */}
        <div className="absolute top-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg p-3"
          >
            <div className="text-xs text-gray-400 mb-1">Performance</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">FPS:</span>
                <span className="text-[#00ff9c]">60</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Latency:</span>
                <span className="text-[#00ff9c]">12ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Data Points:</span>
                <span className="text-white">200</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Market Status */}
        <div className="absolute bottom-4 right-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.5 }}
            className="bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-semibold">Market Open</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Session:</span>
                <span className="text-white">New York</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Volume:</span>
                <span className="text-white">High</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Volatility:</span>
                <span className="text-yellow-400">Medium</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default AIIntegratedChartPage;
