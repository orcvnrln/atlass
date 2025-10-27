/**
 * 🚀 ADVANCED AI TRADING CHART
 * Professional TradingView-style chart with AI integration
 * 20+ technical analysis techniques with interactive overlays
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  LineStyle,
} from 'lightweight-charts';
import { useTradingStore } from '../../core/state/store';
import { analyzeMarket, AIAnalysisResult, OrderBlock, FairValueGap, LiquidityPool } from '../../services/aiTradingAnalyzer';
import { Activity, TrendingUp, TrendingDown, Minus, AlertTriangle, Target, Shield } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface ChartMarker {
  type: 'entry' | 'sl' | 'tp1' | 'tp2' | 'tp3';
  price: number;
  color: string;
  label: string;
}

interface TooltipData {
  x: number;
  y: number;
  candle: CandlestickData;
  orderBlocks?: OrderBlock[];
  fvgs?: FairValueGap[];
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const AdvancedAITradingChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  // State
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [showOverlays, setShowOverlays] = useState({
    orderBlocks: true,
    fvgs: true,
    liquidity: true,
    support: true,
    resistance: true,
    markers: true,
  });

  // Store
  const candles = useTradingStore((state) => state.candles);
  const symbol = useTradingStore((state) => state.symbol);
  const timeframe = useTradingStore((state) => state.timeframe);

  // ─── CHART CONFIGURATION ───
  const chartConfig = useMemo(
    () => ({
      layout: {
        background: { color: '#0B0D10' },
        textColor: '#E6EDF3',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#00C896',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#00C896',
        },
        horzLine: {
          color: '#00C896',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#00C896',
        },
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    }),
    []
  );

  const candlestickConfig = useMemo(
    () => ({
      upColor: '#00C896',
      downColor: '#E84545',
      borderUpColor: '#00C896',
      borderDownColor: '#E84545',
      wickUpColor: '#00C896',
      wickDownColor: '#E84545',
    }),
    []
  );

  // ─── INITIALIZE CHART ───
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      ...chartConfig,
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const candlestickSeries = chart.addCandlestickSeries(candlestickConfig);

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Crosshair handler
    chart.subscribeCrosshairMove((param) => {
      if (param.point && param.seriesData.size > 0) {
        const candleData = param.seriesData.get(
          candlestickSeries
        ) as CandlestickData;
        if (candleData) {
          setTooltipData({
            x: param.point.x,
            y: param.point.y,
            candle: candleData,
            orderBlocks: aiAnalysis?.orderBlocks,
            fvgs: aiAnalysis?.fairValueGaps,
          });
        }
      } else {
        setTooltipData(null);
      }
    });

    return () => {
      chart.remove();
    };
  }, [chartConfig, candlestickConfig]);

  // ─── UPDATE CHART DATA ───
  useEffect(() => {
    if (!candlestickSeriesRef.current || candles.length === 0) return;

    const formattedData: CandlestickData[] = candles.map((candle) => ({
      time: (candle.timestamp / 1000) as Time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    candlestickSeriesRef.current.setData(formattedData);
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  // ─── HANDLE RESIZE ───
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ─── AI ANALYSIS ───
  const runAIAnalysis = async () => {
    if (candles.length < 50) {
      alert('Need at least 50 candles for analysis');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate async analysis
    setTimeout(() => {
      const result = analyzeMarket(candles);
      setAiAnalysis(result);
      setIsAnalyzing(false);
      drawOverlays(result);
    }, 1500);
  };

  // ─── DRAW OVERLAYS ───
  const drawOverlays = (analysis: AIAnalysisResult) => {
    if (!chartRef.current) return;

    // Draw Order Blocks
    if (showOverlays.orderBlocks) {
      analysis.orderBlocks.forEach((ob) => {
        const color = ob.type === 'bullish' ? 'rgba(0, 200, 150, 0.15)' : 'rgba(232, 69, 69, 0.15)';
        // In production, use chart markers or custom shapes
        // For now, we'll handle this in the overlay component
      });
    }

    // Draw support/resistance
    if (showOverlays.support) {
      analysis.supportLevels.forEach((level) => {
        const lineSeries = chartRef.current!.addLineSeries({
          color: '#00C896',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
        });
        lineSeries.setData([
          { time: (candles[0].timestamp / 1000) as Time, value: level },
          { time: (candles[candles.length - 1].timestamp / 1000) as Time, value: level },
        ]);
      });
    }

    if (showOverlays.resistance) {
      analysis.resistanceLevels.forEach((level) => {
        const lineSeries = chartRef.current!.addLineSeries({
          color: '#E84545',
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
        });
        lineSeries.setData([
          { time: (candles[0].timestamp / 1000) as Time, value: level },
          { time: (candles[candles.length - 1].timestamp / 1000) as Time, value: level },
        ]);
      });
    }
  };

  // ─── MARKET STRUCTURE BADGE ───
  const renderMarketStructureBadge = () => {
    if (!aiAnalysis) return null;

    const { marketStructure } = aiAnalysis;
    const Icon =
      marketStructure.trend === 'bullish'
        ? TrendingUp
        : marketStructure.trend === 'bearish'
        ? TrendingDown
        : Minus;
    const color =
      marketStructure.trend === 'bullish'
        ? 'text-green-400'
        : marketStructure.trend === 'bearish'
        ? 'text-red-400'
        : 'text-gray-400';

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-3 z-10"
      >
        <Icon className={`w-5 h-5 ${color}`} />
        <div>
          <div className="text-xs text-gray-500">Market Structure</div>
          <div className={`text-sm font-bold ${color} uppercase`}>
            {marketStructure.trend}
          </div>
        </div>
        {marketStructure.bos && (
          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
            BOS
          </span>
        )}
        {marketStructure.choch && (
          <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
            CHoCH
          </span>
        )}
      </motion.div>
    );
  };

  // ─── RENDER TOOLTIP ───
  const renderTooltip = () => {
    if (!tooltipData) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          position: 'absolute',
          left: tooltipData.x + 15,
          top: tooltipData.y - 15,
          pointerEvents: 'none',
          zIndex: 100,
        }}
        className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2 text-xs space-y-1"
      >
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Open:</span>
          <span className="text-gray-200 font-mono">
            {tooltipData.candle.open.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">High:</span>
          <span className="text-green-400 font-mono">
            {tooltipData.candle.high.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Low:</span>
          <span className="text-red-400 font-mono">
            {tooltipData.candle.low.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Close:</span>
          <span className="text-gray-200 font-mono">
            {tooltipData.candle.close.toFixed(2)}
          </span>
        </div>
      </motion.div>
    );
  };

  // ─── RENDER OVERLAY CONTROLS ───
  const renderOverlayControls = () => {
    return (
      <div className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-lg p-3 z-10 space-y-2">
        <div className="text-xs text-gray-500 font-semibold mb-2">Overlays</div>
        {Object.entries(showOverlays).map(([key, value]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={() =>
                setShowOverlays((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
              }
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 checked:bg-blue-600"
            />
            <span className="text-xs text-gray-300 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          </label>
        ))}
      </div>
    );
  };

  // ─── RENDER ───
  return (
    <div className="relative w-full h-full bg-[#0B0D10]">
      {/* Chart Canvas */}
      <div ref={chartContainerRef} className="w-full h-full" />

      {/* Market Structure Badge */}
      {renderMarketStructureBadge()}

      {/* Overlay Controls */}
      {renderOverlayControls()}

      {/* Tooltip */}
      <AnimatePresence>{renderTooltip()}</AnimatePresence>

      {/* AI Analysis Button */}
      <button
        onClick={runAIAnalysis}
        disabled={isAnalyzing || candles.length < 50}
        className={`
          absolute bottom-4 left-4 z-10
          px-4 py-2 rounded-lg font-medium text-sm
          flex items-center gap-2
          transition-all duration-200
          ${
            isAnalyzing
              ? 'bg-gray-700 cursor-wait'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }
          ${candles.length < 50 ? 'opacity-50 cursor-not-allowed' : ''}
          text-white shadow-lg
        `}
      >
        {isAnalyzing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Activity className="w-4 h-4" />
            AI Analysis
          </>
        )}
      </button>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <div className="text-white font-semibold">Analyzing Market</div>
              <div className="text-gray-400 text-sm mt-1">
                Processing 20+ technical indicators...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedAITradingChart;
