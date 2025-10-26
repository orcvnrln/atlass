/**
 * 🎯 AI-INTEGRATED PROFESSIONAL CHART COMPONENT
 * MotiveWave-inspired institutional trading platform
 * Complete layout with AI features, order book, indicators, and professional styling
 */

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';
import { useTradingStore } from '../../core/state/store';
import { AIPatternOverlay } from './AIPatternOverlay';
import { OrderBookPanel } from './OrderBookPanel';
import { IndicatorsPanel } from './IndicatorsPanel';
import { WatchlistSidebar } from './WatchlistSidebar';
import { ChartToolbar } from './ChartToolbar';
import { AITooltip } from './AITooltip';
import { AIRiskMarker } from './AIRiskMarker';
import { cn } from '../../lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & INTERFACES
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

interface ChartState {
  crosshairPosition: { x: number; y: number } | null;
  hoveredCandle: CandlestickData | null;
  aiSignals: AISignal[];
  selectedTimeframe: string;
  activeIndicators: string[];
  aiSentiment: 'bullish' | 'bearish' | 'neutral';
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const AIIntegratedChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  
  // State
  const [chartState, setChartState] = useState<ChartState>({
    crosshairPosition: null,
    hoveredCandle: null,
    aiSignals: [],
    selectedTimeframe: '1H',
    activeIndicators: ['MA20', 'VWAP', 'Volume'],
    aiSentiment: 'neutral'
  });

  // Store state
  const candles = useTradingStore((state) => state.candles);
  const symbol = useTradingStore((state) => state.symbol);
  const isLoading = useTradingStore((state) => state.isLoading);

  // ─── CHART CONFIGURATION ───
  const chartConfig = useMemo(() => ({
    layout: {
      background: { color: '#0d1117' },
      textColor: '#e6edf3',
      fontSize: 11,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    },
    grid: {
      vertLines: { color: 'rgba(255, 255, 255, 0.08)' },
      horzLines: { color: 'rgba(255, 255, 255, 0.08)' }
    },
    crosshair: {
      mode: 1, // Normal crosshair
      vertLine: {
        color: 'rgba(0, 194, 255, 0.8)',
        width: 1,
        style: 0,
        labelBackgroundColor: '#00c2ff'
      },
      horzLine: {
        color: 'rgba(0, 194, 255, 0.8)',
        width: 1,
        style: 0,
        labelBackgroundColor: '#00c2ff'
      }
    },
    timeScale: {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      timeVisible: true,
      secondsVisible: false
    },
    rightPriceScale: {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      scaleMargins: { top: 0.1, bottom: 0.1 }
    },
    handleScroll: {
      mouseWheel: true,
      pressedMouseMove: true,
      horzTouchDrag: true,
      vertTouchDrag: true
    },
    handleScale: {
      axisPressedMouseMove: true,
      mouseWheel: true,
      pinch: true
    }
  }), []);

  // ─── CANDLESTICK SERIES CONFIG ───
  const candlestickConfig = useMemo(() => ({
    upColor: '#00ff9c',
    downColor: '#ff4d4d',
    borderUpColor: '#00ff9c',
    borderDownColor: '#ff4d4d',
    wickUpColor: '#00ff9c',
    wickDownColor: '#ff4d4d'
  }), []);

  // ─── INITIALIZE CHART ───
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      ...chartConfig,
      width: chartContainerRef.current.clientWidth,
      height: 600
    });

    const candlestickSeries = chart.addCandlestickSeries(candlestickConfig);
    
    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Add crosshair move handler
    chart.subscribeCrosshairMove((param) => {
      if (param.point) {
        setChartState(prev => ({
          ...prev,
          crosshairPosition: { x: param.point!.x, y: param.point!.y }
        }));

        const hoveredData = param.seriesData.get(candlestickSeries) as CandlestickData;
        if (hoveredData) {
          setChartState(prev => ({
            ...prev,
            hoveredCandle: hoveredData
          }));
        }
      } else {
        setChartState(prev => ({
          ...prev,
          crosshairPosition: null,
          hoveredCandle: null
        }));
      }
    });

    // Cleanup
    return () => {
      chart.remove();
    };
  }, [chartConfig, candlestickConfig]);

  // ─── UPDATE CHART DATA ───
  useEffect(() => {
    if (!candlestickSeriesRef.current || candles.length === 0) return;

    const formattedData: CandlestickData[] = candles.map(candle => ({
      time: (candle.timestamp / 1000) as Time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close
    }));

    candlestickSeriesRef.current.setData(formattedData);
  }, [candles]);

  // ─── HANDLE RESIZE ───
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: 600
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ─── AI SIGNAL GENERATION (MOCK) ───
  useEffect(() => {
    const generateAISignals = () => {
      if (candles.length < 10) return;

      const latestCandle = candles[candles.length - 1];
      const signals: AISignal[] = [];

      // Mock AI pattern detection
      if (Math.random() > 0.95) {
        signals.push({
          id: `signal_${Date.now()}`,
          type: 'breakout',
          confidence: 0.85,
          price: latestCandle.close,
          timestamp: latestCandle.timestamp,
          message: 'AI detected potential breakout pattern',
          riskReward: 2.5
        });
      }

      if (signals.length > 0) {
        setChartState(prev => ({
          ...prev,
          aiSignals: [...prev.aiSignals.slice(-5), ...signals] // Keep last 5 signals
        }));
      }
    };

    const interval = setInterval(generateAISignals, 5000);
    return () => clearInterval(interval);
  }, [candles]);

  // ─── AI SENTIMENT CALCULATION ───
  const aiSentimentGlow = useMemo(() => {
    const sentiment = chartState.aiSentiment;
    return sentiment === 'bullish' 
      ? 'rgba(0, 255, 156, 0.05)' 
      : sentiment === 'bearish' 
      ? 'rgba(255, 77, 77, 0.05)' 
      : 'rgba(0, 194, 255, 0.02)';
  }, [chartState.aiSentiment]);

  // ─── RENDER ───
  return (
    <div className="h-screen bg-[#0d1117] text-white flex overflow-hidden">
      {/* AI Sentiment Background Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: aiSentimentGlow }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Left Sidebar - Watchlist */}
      <WatchlistSidebar />

      {/* Main Chart Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <ChartToolbar 
          selectedTimeframe={chartState.selectedTimeframe}
          activeIndicators={chartState.activeIndicators}
          onTimeframeChange={(tf) => setChartState(prev => ({ ...prev, selectedTimeframe: tf }))}
          onIndicatorToggle={(indicator) => {
            setChartState(prev => ({
              ...prev,
              activeIndicators: prev.activeIndicators.includes(indicator)
                ? prev.activeIndicators.filter(i => i !== indicator)
                : [...prev.activeIndicators, indicator]
            }));
          }}
        />

        {/* Chart Container */}
        <div className="flex-1 flex">
          {/* Main Chart */}
          <div className="flex-1 relative">
            <div 
              ref={chartContainerRef}
              className="w-full h-full relative"
            />
            
            {/* AI Pattern Overlays */}
            <AIPatternOverlay 
              signals={chartState.aiSignals}
              chartRef={chartRef}
            />

            {/* AI Risk Markers */}
            <AIRiskMarker 
              signals={chartState.aiSignals}
              chartRef={chartRef}
            />

            {/* AI Tooltip */}
            <AnimatePresence>
              {chartState.crosshairPosition && chartState.hoveredCandle && (
                <AITooltip
                  position={chartState.crosshairPosition}
                  candleData={chartState.hoveredCandle}
                  aiSignals={chartState.aiSignals}
                />
              )}
            </AnimatePresence>

            {/* Loading Overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center"
                >
                  <div className="text-[#00c2ff] text-lg">Loading chart data...</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel - Order Book */}
          <OrderBookPanel />
        </div>

        {/* Bottom Panel - Indicators */}
        <IndicatorsPanel 
          activeIndicators={chartState.activeIndicators}
          candles={candles}
        />
      </div>
    </div>
  );
};

export default AIIntegratedChart;
