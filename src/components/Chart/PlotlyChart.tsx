/**
 * 📊 AI-INTEGRATED PROFESSIONAL CHART COMPONENT
 * MotiveWave-inspired institutional trading platform
 * Real-time candlestick chart with AI overlays and professional design
 */

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import Plotly from 'plotly.js-dist-min';
import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore } from '../../core/state/store';
import { AIPatternOverlay } from './AIPatternOverlay';
import { OrderBookPanel } from './OrderBookPanel';
import { IndicatorsPanel } from './IndicatorsPanel';
import { WatchlistSidebar } from './WatchlistSidebar';
import { ChartToolbar } from './ChartToolbar';
import { AITooltip } from './AITooltip';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const PlotlyChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<any>(null);

  // State
  const candles = useTradingStore((state) => state.candles);
  const overlays = useTradingStore((state) => state.overlays);
  const isLoading = useTradingStore((state) => state.isLoading);
  const symbol = useTradingStore((state) => state.symbol);
  const timeframe = useTradingStore((state) => state.timeframe);

  // ─── CHART DATA ───
  const chartData = useMemo(() => {
    if (candles.length === 0) return [];

    const timestamps = candles.map((c) => new Date(c.timestamp));
    const opens = candles.map((c) => c.open);
    const highs = candles.map((c) => c.high);
    const lows = candles.map((c) => c.low);
    const closes = candles.map((c) => c.close);

    return [
      {
        type: 'candlestick',
        x: timestamps,
        open: opens,
        high: highs,
        low: lows,
        close: closes,
        increasing: { line: { color: '#10b981' } },
        decreasing: { line: { color: '#ef4444' } },
        name: symbol,
      },
    ];
  }, [candles, symbol]);

  // ─── CHART LAYOUT ───
  const chartLayout = useMemo(() => {
    return {
      title: {
        text: `${symbol} - ${timeframe}`,
        font: { size: 16, color: '#e5e7eb', family: 'Inter, sans-serif' },
      },
      xaxis: {
        type: 'date',
        gridcolor: '#374151',
        color: '#9ca3af',
        rangeslider: { visible: false },
      },
      yaxis: {
        gridcolor: '#374151',
        color: '#9ca3af',
        side: 'right',
      },
      paper_bgcolor: '#111827',
      plot_bgcolor: '#1f2937',
      font: { family: 'Inter, sans-serif' },
      margin: { l: 50, r: 80, t: 50, b: 50 },
      hovermode: 'x unified',
      shapes: overlays.map((overlay) => overlay.data),
    };
  }, [symbol, timeframe, overlays]);

  // ─── CHART CONFIG ───
  const chartConfig = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
  };

  // ─── INITIAL RENDER ───
  useEffect(() => {
    if (!chartRef.current || candles.length === 0) return;

    Plotly.newPlot(chartRef.current, chartData, chartLayout, chartConfig);
    plotRef.current = chartRef.current;

    return () => {
      if (plotRef.current) {
        Plotly.purge(plotRef.current);
      }
    };
  }, []);

  // ─── UPDATE CHART ───
  useEffect(() => {
    if (!plotRef.current || candles.length === 0) return;

    Plotly.react(plotRef.current, chartData, chartLayout, chartConfig);
  }, [chartData, chartLayout]);

  // ─── RENDER ───
  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-300 text-sm font-medium">Loading chart data...</p>
          </div>
        </div>
      )}

      <div ref={chartRef} className="w-full h-full" />

      {candles.length === 0 && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500 text-sm">No data available</p>
        </div>
      )}
    </div>
  );
};

