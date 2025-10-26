/**
 * 📈 INDICATORS PANEL COMPONENT
 * Bottom panel with RSI, Stochastic, MACD, and Volume indicators
 * Synchronized with main chart and professional styling
 */

import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface IndicatorsPanelProps {
  activeIndicators: string[];
  candles: CandleData[];
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

// Calculate RSI
const calculateRSI = (prices: number[], period: number = 14) => {
  if (prices.length < period + 1) return [];
  
  const rsi: number[] = [];
  let gains = 0;
  let losses = 0;

  // Initial calculation
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;
  rsi.push(100 - (100 / (1 + avgGain / avgLoss)));

  // Subsequent calculations
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rsi.push(100 - (100 / (1 + avgGain / avgLoss)));
  }

  return rsi;
};

// Calculate Stochastic
const calculateStochastic = (highs: number[], lows: number[], closes: number[], period: number = 14) => {
  if (highs.length < period) return [];
  
  const stochastic: number[] = [];
  
  for (let i = period - 1; i < highs.length; i++) {
    const highestHigh = Math.max(...highs.slice(i - period + 1, i + 1));
    const lowestLow = Math.min(...lows.slice(i - period + 1, i + 1));
    const currentClose = closes[i];
    
    const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
    stochastic.push(k);
  }
  
  return stochastic;
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const IndicatorsPanel: React.FC<IndicatorsPanelProps> = ({
  activeIndicators,
  candles
}) => {
  const [rsiChart, setRsiChart] = useState<IChartApi | null>(null);
  const [stochChart, setStochChart] = useState<IChartApi | null>(null);
  const [volumeChart, setVolumeChart] = useState<IChartApi | null>(null);

  // ─── CALCULATE INDICATORS ───
  const indicators = useMemo(() => {
    if (candles.length < 20) return { rsi: [], stochastic: [], volume: [] };

    const closes = candles.map(c => c.close);
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const volumes = candles.map(c => c.volume || 0);

    const rsi = calculateRSI(closes);
    const stochastic = calculateStochastic(highs, lows, closes);

    return {
      rsi: rsi.map((value, index) => ({
        time: (candles[index + 14].timestamp / 1000) as any,
        value
      })),
      stochastic: stochastic.map((value, index) => ({
        time: (candles[index + 13].timestamp / 1000) as any,
        value
      })),
      volume: volumes.map((value, index) => ({
        time: (candles[index].timestamp / 1000) as any,
        value,
        color: candles[index].close > candles[index].open ? '#00ff9c' : '#ff4d4d'
      }))
    };
  }, [candles]);

  // ─── RSI INDICATOR ───
  const RSIIndicator: React.FC = () => {
    const chartRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!chartRef.current || !activeIndicators.includes('RSI')) return;

      const chart = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: 120,
        layout: {
          background: { color: '#0d1117' },
          textColor: '#e6edf3',
          fontSize: 10
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
          horzLines: { color: 'rgba(255, 255, 255, 0.05)' }
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          scaleMargins: { top: 0.1, bottom: 0.1 }
        },
        timeScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          visible: false
        }
      });

      const rsiSeries = chart.addLineSeries({
        color: '#a3e635',
        lineWidth: 2
      });

      // Add overbought/oversold lines
      const overboughtSeries = chart.addLineSeries({
        color: 'rgba(255, 77, 77, 0.5)',
        lineWidth: 1,
        lineStyle: 2 // Dashed
      });

      const oversoldSeries = chart.addLineSeries({
        color: 'rgba(0, 255, 156, 0.5)',
        lineWidth: 1,
        lineStyle: 2 // Dashed
      });

      if (indicators.rsi.length > 0) {
        rsiSeries.setData(indicators.rsi);
        
        // Add reference lines
        const overboughtData = indicators.rsi.map(point => ({ ...point, value: 70 }));
        const oversoldData = indicators.rsi.map(point => ({ ...point, value: 30 }));
        
        overboughtSeries.setData(overboughtData);
        oversoldSeries.setData(oversoldData);
      }

      setRsiChart(chart);

      return () => {
        chart.remove();
      };
    }, [activeIndicators, indicators.rsi]);

    if (!activeIndicators.includes('RSI')) return null;

    return (
      <div className="flex-1">
        <div className="flex items-center justify-between p-2 border-b border-gray-800">
          <span className="text-xs text-[#a3e635] font-semibold">RSI (14)</span>
          <span className="text-xs text-gray-400">
            {indicators.rsi.length > 0 ? indicators.rsi[indicators.rsi.length - 1].value.toFixed(2) : '--'}
          </span>
        </div>
        <div ref={chartRef} className="w-full" />
      </div>
    );
  };

  // ─── STOCHASTIC INDICATOR ───
  const StochasticIndicator: React.FC = () => {
    const chartRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!chartRef.current || !activeIndicators.includes('Stochastic')) return;

      const chart = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: 120,
        layout: {
          background: { color: '#0d1117' },
          textColor: '#e6edf3',
          fontSize: 10
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
          horzLines: { color: 'rgba(255, 255, 255, 0.05)' }
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          scaleMargins: { top: 0.1, bottom: 0.1 }
        },
        timeScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          visible: false
        }
      });

      const stochSeries = chart.addLineSeries({
        color: '#f59e0b',
        lineWidth: 2
      });

      if (indicators.stochastic.length > 0) {
        stochSeries.setData(indicators.stochastic);
      }

      setStochChart(chart);

      return () => {
        chart.remove();
      };
    }, [activeIndicators, indicators.stochastic]);

    if (!activeIndicators.includes('Stochastic')) return null;

    return (
      <div className="flex-1">
        <div className="flex items-center justify-between p-2 border-b border-gray-800">
          <span className="text-xs text-[#f59e0b] font-semibold">Stochastic (14)</span>
          <span className="text-xs text-gray-400">
            {indicators.stochastic.length > 0 ? indicators.stochastic[indicators.stochastic.length - 1].value.toFixed(2) : '--'}
          </span>
        </div>
        <div ref={chartRef} className="w-full" />
      </div>
    );
  };

  // ─── VOLUME INDICATOR ───
  const VolumeIndicator: React.FC = () => {
    const chartRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!chartRef.current || !activeIndicators.includes('Volume')) return;

      const chart = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: 120,
        layout: {
          background: { color: '#0d1117' },
          textColor: '#e6edf3',
          fontSize: 10
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
          horzLines: { color: 'rgba(255, 255, 255, 0.05)' }
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          scaleMargins: { top: 0.1, bottom: 0.1 }
        },
        timeScale: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          visible: false
        }
      });

      const volumeSeries = chart.addHistogramSeries({
        color: '#334155',
        priceFormat: {
          type: 'volume'
        }
      });

      if (indicators.volume.length > 0) {
        volumeSeries.setData(indicators.volume);
      }

      setVolumeChart(chart);

      return () => {
        chart.remove();
      };
    }, [activeIndicators, indicators.volume]);

    if (!activeIndicators.includes('Volume')) return null;

    return (
      <div className="flex-1">
        <div className="flex items-center justify-between p-2 border-b border-gray-800">
          <span className="text-xs text-[#334155] font-semibold">Volume</span>
          <span className="text-xs text-gray-400">
            {indicators.volume.length > 0 ? 
              (indicators.volume[indicators.volume.length - 1].value / 1000000).toFixed(2) + 'M' : '--'}
          </span>
        </div>
        <div ref={chartRef} className="w-full" />
      </div>
    );
  };

  // ─── RENDER ───
  const hasActiveIndicators = activeIndicators.some(indicator => 
    ['RSI', 'Stochastic', 'Volume'].includes(indicator)
  );

  if (!hasActiveIndicators) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="border-t border-gray-800 bg-[#0d1117]"
    >
      <div className="flex h-32">
        <RSIIndicator />
        {activeIndicators.includes('RSI') && activeIndicators.includes('Stochastic') && (
          <div className="w-px bg-gray-800" />
        )}
        <StochasticIndicator />
        {(activeIndicators.includes('RSI') || activeIndicators.includes('Stochastic')) && 
         activeIndicators.includes('Volume') && (
          <div className="w-px bg-gray-800" />
        )}
        <VolumeIndicator />
      </div>
    </motion.div>
  );
};

export default IndicatorsPanel;
