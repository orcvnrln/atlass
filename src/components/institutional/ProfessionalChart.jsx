/**
 * Professional Trading Chart Component
 * Uses Lightweight Charts for institutional-grade visualization
 * Features: Real-time data, technical indicators, order flow, multi-timeframe
 */

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { 
  TrendingUp, TrendingDown, Activity, BarChart3, Settings, 
  Maximize2, Clock, DollarSign, Volume2, Layers, Target,
  AlertCircle, Eye, EyeOff, RefreshCw
} from 'lucide-react';
import { 
  calculateEMA, calculateRSI, calculateMACD, calculateVWAP, 
  calculateBollingerBands, detectSupportResistance 
} from '@/utils/technicalIndicators';
import { useTradingStore } from '@/core/state/store';

const TIMEFRAMES = [
  { value: '1m', label: '1m', seconds: 60 },
  { value: '5m', label: '5m', seconds: 300 },
  { value: '15m', label: '15m', seconds: 900 },
  { value: '1h', label: '1H', seconds: 3600 },
  { value: '4h', label: '4H', seconds: 14400 },
  { value: '1D', label: '1D', seconds: 86400 }
];

const ProfessionalChart = ({ 
  symbol = 'BTCUSDT',
  initialTimeframe = '15m',
  onTimeframeChange,
  className = ''
}) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const indicatorSeriesRef = useRef({});
  const markersRef = useRef([]);

  const [timeframe, setTimeframe] = useState(initialTimeframe);
  const [activeIndicators, setActiveIndicators] = useState({
    ema20: true,
    ema50: true,
    rsi: false,
    macd: false,
    vwap: true,
    bollinger: false,
    volume: true,
    supportResistance: true
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get data from Zustand store
  const candles = useTradingStore((state) => state.candles);
  const currentPrice = useTradingStore((state) => state.currentPrice);
  const setSymbol = useTradingStore((state) => state.setSymbol);
  const setStoreTimeframe = useTradingStore((state) => state.setTimeframe);

  // Calculate market statistics
  const marketStats = useMemo(() => {
    if (!candles || candles.length === 0) {
      return {
        price: currentPrice,
        change: 0,
        changePercent: 0,
        high24h: 0,
        low24h: 0,
        volume24h: 0,
        spread: 0,
        bid: 0,
        ask: 0
      };
    }

    const latestCandle = candles[candles.length - 1];
    const firstCandle = candles[0];
    const change = latestCandle.close - firstCandle.close;
    const changePercent = (change / firstCandle.close) * 100;
    
    const high24h = Math.max(...candles.map(c => c.high));
    const low24h = Math.min(...candles.map(c => c.low));
    const volume24h = candles.reduce((sum, c) => sum + c.volume, 0);
    
    const spread = latestCandle.close * 0.0001; // Mock 0.01% spread
    const bid = latestCandle.close - spread / 2;
    const ask = latestCandle.close + spread / 2;

    return {
      price: latestCandle.close,
      change,
      changePercent,
      high24h,
      low24h,
      volume24h,
      spread,
      bid,
      ask
    };
  }, [candles, currentPrice]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b', style: 1 },
        horzLines: { color: '#1e293b', style: 1 },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        borderColor: '#334155',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 12,
        barSpacing: 8,
        minBarSpacing: 4,
      },
      rightPriceScale: {
        borderColor: '#334155',
        scaleMargins: {
          top: 0.1,
          bottom: activeIndicators.volume ? 0.3 : 0.1,
        },
        mode: 0, // Normal price scale
      },
      crosshair: {
        mode: 1, // Magnet mode
        vertLine: {
          color: '#475569',
          width: 1,
          style: 2,
          labelBackgroundColor: '#3b82f6',
        },
        horzLine: {
          color: '#475569',
          width: 1,
          style: 2,
          labelBackgroundColor: '#3b82f6',
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartRef.current = chart;

    // Add candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });
    candleSeriesRef.current = candleSeries;

    // Add volume series
    if (activeIndicators.volume) {
      const volumeSeries = chart.addHistogramSeries({
        color: '#3b82f6',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
          top: 0.7,
          bottom: 0,
        },
      });
      volumeSeriesRef.current = volumeSeries;
    }

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Handle fullscreen change
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [activeIndicators.volume]);

  // Update chart data
  useEffect(() => {
    if (!candleSeriesRef.current || !candles || candles.length === 0) return;

    const chartData = candles.map(candle => ({
      time: candle.timestamp / 1000,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    candleSeriesRef.current.setData(chartData);

    // Update volume
    if (volumeSeriesRef.current && activeIndicators.volume) {
      const volumeData = candles.map((candle, index) => ({
        time: candle.timestamp / 1000,
        value: candle.volume,
        color: index > 0 && candle.close >= candles[index - 1].close 
          ? 'rgba(16, 185, 129, 0.5)' 
          : 'rgba(239, 68, 68, 0.5)',
      }));
      volumeSeriesRef.current.setData(volumeData);
    }

    // Add support/resistance markers
    if (activeIndicators.supportResistance && candles.length > 40) {
      const { support, resistance } = detectSupportResistance(candles, 20);
      
      const markers = [
        ...support.slice(-3).map(s => ({
          time: s.timestamp / 1000,
          position: 'belowBar',
          color: '#10b981',
          shape: 'arrowUp',
          text: 'S',
        })),
        ...resistance.slice(-3).map(r => ({
          time: r.timestamp / 1000,
          position: 'aboveBar',
          color: '#ef4444',
          shape: 'arrowDown',
          text: 'R',
        }))
      ];
      
      candleSeriesRef.current.setMarkers(markers);
      markersRef.current = markers;
    }
  }, [candles, activeIndicators.volume, activeIndicators.supportResistance]);

  // Add technical indicators
  useEffect(() => {
    if (!chartRef.current || !candles || candles.length === 0) return;

    // Clear existing indicators
    Object.values(indicatorSeriesRef.current).forEach(series => {
      if (series) {
        try {
          chartRef.current.removeSeries(series);
        } catch (e) {
          // Series might already be removed
        }
      }
    });
    indicatorSeriesRef.current = {};

    const closes = candles.map(c => c.close);
    const timestamps = candles.map(c => c.timestamp / 1000);

    // EMA 20
    if (activeIndicators.ema20 && closes.length >= 20) {
      const ema20Data = calculateEMA(closes, 20);
      const ema20Series = chartRef.current.addLineSeries({
        color: '#f59e0b',
        lineWidth: 2,
        title: 'EMA 20',
        lastValueVisible: true,
        priceLineVisible: false,
      });
      ema20Series.setData(ema20Data.map((value, i) => ({
        time: timestamps[i],
        value,
      })).filter(d => d.value !== null));
      indicatorSeriesRef.current.ema20 = ema20Series;
    }

    // EMA 50
    if (activeIndicators.ema50 && closes.length >= 50) {
      const ema50Data = calculateEMA(closes, 50);
      const ema50Series = chartRef.current.addLineSeries({
        color: '#8b5cf6',
        lineWidth: 2,
        title: 'EMA 50',
        lastValueVisible: true,
        priceLineVisible: false,
      });
      ema50Series.setData(ema50Data.map((value, i) => ({
        time: timestamps[i],
        value,
      })).filter(d => d.value !== null));
      indicatorSeriesRef.current.ema50 = ema50Series;
    }

    // VWAP
    if (activeIndicators.vwap) {
      const vwapData = calculateVWAP(candles);
      const vwapSeries = chartRef.current.addLineSeries({
        color: '#06b6d4',
        lineWidth: 2,
        lineStyle: 2,
        title: 'VWAP',
        lastValueVisible: true,
        priceLineVisible: false,
      });
      vwapSeries.setData(vwapData.map((value, i) => ({
        time: timestamps[i],
        value,
      })).filter(d => d.value !== null));
      indicatorSeriesRef.current.vwap = vwapSeries;
    }

    // Bollinger Bands
    if (activeIndicators.bollinger && closes.length >= 20) {
      const bbData = calculateBollingerBands(closes, 20, 2);
      
      const upperSeries = chartRef.current.addLineSeries({
        color: '#ec4899',
        lineWidth: 1,
        lineStyle: 2,
        title: 'BB Upper',
        lastValueVisible: false,
        priceLineVisible: false,
      });
      upperSeries.setData(bbData.upper.map((value, i) => ({
        time: timestamps[i],
        value,
      })).filter(d => d.value !== null));
      
      const lowerSeries = chartRef.current.addLineSeries({
        color: '#ec4899',
        lineWidth: 1,
        lineStyle: 2,
        title: 'BB Lower',
        lastValueVisible: false,
        priceLineVisible: false,
      });
      lowerSeries.setData(bbData.lower.map((value, i) => ({
        time: timestamps[i],
        value,
      })).filter(d => d.value !== null));
      
      indicatorSeriesRef.current.bbUpper = upperSeries;
      indicatorSeriesRef.current.bbLower = lowerSeries;
    }
  }, [candles, activeIndicators]);

  const handleTimeframeChange = useCallback((newTimeframe) => {
    setIsLoading(true);
    setTimeframe(newTimeframe);
    setStoreTimeframe(newTimeframe);
    if (onTimeframeChange) {
      onTimeframeChange(newTimeframe);
    }
    setTimeout(() => setIsLoading(false), 500);
  }, [onTimeframeChange, setStoreTimeframe]);

  const toggleIndicator = useCallback((indicator) => {
    setActiveIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      chartContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div className={`w-full h-full flex flex-col bg-slate-950 rounded-lg overflow-hidden ${className}`}>
      {/* Top Bar - Market Info & Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-800">
        <div className="flex items-center gap-6">
          {/* Symbol & Price */}
          <div>
            <h2 className="text-xl font-bold text-slate-100">{symbol}</h2>
            <div className="flex items-center gap-2 mt-1">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span className="text-2xl font-mono font-bold text-slate-100">
                {marketStats.price.toFixed(symbol.includes('JPY') ? 3 : 5)}
              </span>
              <span className={`text-sm font-medium flex items-center gap-1 ${marketStats.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {marketStats.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {marketStats.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Market Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-slate-400">24h High</span>
              <span className="text-slate-100 font-mono font-semibold">
                {marketStats.high24h.toFixed(symbol.includes('JPY') ? 3 : 5)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400">24h Low</span>
              <span className="text-slate-100 font-mono font-semibold">
                {marketStats.low24h.toFixed(symbol.includes('JPY') ? 3 : 5)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400">24h Volume</span>
              <span className="text-slate-100 font-mono font-semibold">
                {(marketStats.volume24h / 1000000).toFixed(2)}M
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400">Spread</span>
              <span className="text-slate-100 font-mono font-semibold">
                {(marketStats.spread * 10000).toFixed(1)} pips
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe Selector & Controls */}
        <div className="flex items-center gap-2">
          {/* Timeframe Buttons */}
          <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                onClick={() => handleTimeframeChange(tf.value)}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                  timeframe === tf.value
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Indicator Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors"
            title="Indicators"
          >
            <Layers className="w-5 h-5 text-slate-400" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-5 h-5 text-slate-400" />
          </button>

          {/* Refresh */}
          <button
            onClick={() => window.location.reload()}
            className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Indicators Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 z-50 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-4 w-72">
          <h3 className="text-sm font-semibold text-slate-100 mb-3">Technical Indicators</h3>
          <div className="space-y-2">
            {[
              { key: 'ema20', label: 'EMA 20', color: '#f59e0b' },
              { key: 'ema50', label: 'EMA 50', color: '#8b5cf6' },
              { key: 'vwap', label: 'VWAP', color: '#06b6d4' },
              { key: 'bollinger', label: 'Bollinger Bands', color: '#ec4899' },
              { key: 'volume', label: 'Volume', color: '#3b82f6' },
              { key: 'supportResistance', label: 'Support/Resistance', color: '#10b981' },
            ].map((indicator) => (
              <label
                key={indicator.key}
                className="flex items-center justify-between p-2 hover:bg-slate-800/50 rounded cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: indicator.color }}
                  />
                  <span className="text-sm text-slate-200">{indicator.label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={activeIndicators[indicator.key]}
                  onChange={() => toggleIndicator(indicator.key)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div ref={chartContainerRef} className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 z-10">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="text-sm text-slate-400">Loading {timeframe} data...</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-slate-400">Live</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Bid:</span>
            <span className="text-green-500 font-mono font-semibold">
              {marketStats.bid.toFixed(symbol.includes('JPY') ? 3 : 5)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Ask:</span>
            <span className="text-red-500 font-mono font-semibold">
              {marketStats.ask.toFixed(symbol.includes('JPY') ? 3 : 5)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-4 h-4" />
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalChart;