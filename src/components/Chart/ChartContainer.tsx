import React, { useRef, useEffect, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setChartInstance } from '../../store/slices/chartSlice';
import { Candle } from '../../types/trading';

const ChartContainer: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const emaSeriesRef = useRef<{ [key: string]: ISeriesApi<'Line'> }>({});

  const dispatch = useDispatch();
  const { asset, timeframe, candles, indicators, chartInstance } = useSelector((state: RootState) => state.chart);

  // Generate mock data for demonstration
  const generateMockCandles = (count: number): Candle[] => {
    const mockCandles: Candle[] = [];
    let basePrice = 42000;
    const now = Date.now();
    const interval = timeframe === '15m' ? 15 * 60 * 1000 : 
                    timeframe === '1h' ? 60 * 60 * 1000 :
                    timeframe === '4h' ? 4 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    for (let i = count - 1; i >= 0; i--) {
      const timestamp = now - (i * interval);
      const open = basePrice + (Math.random() - 0.5) * 100;
      const high = open + Math.random() * 200;
      const low = open - Math.random() * 200;
      const close = low + Math.random() * (high - low);
      const volume = Math.random() * 1000000;

      // Calculate EMAs
      const ema5 = i === count - 1 ? close : (mockCandles[mockCandles.length - 1]?.ema5 || close) * 0.8 + close * 0.2;
      const ema20 = i === count - 1 ? close : (mockCandles[mockCandles.length - 1]?.ema20 || close) * 0.9 + close * 0.1;
      const ema50 = i === count - 1 ? close : (mockCandles[mockCandles.length - 1]?.ema50 || close) * 0.95 + close * 0.05;

      mockCandles.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume,
        ema5,
        ema20,
        ema50,
      });

      basePrice = close;
    }

    return mockCandles;
  };

  const [mockCandles, setMockCandles] = useState<Candle[]>(() => generateMockCandles(100));

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#0f172a' },
        textColor: '#f1f5f9',
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderVisible: false,
      },
      rightPriceScale: {
        borderVisible: false,
      },
      grid: {
        horzLines: {
          color: '#1e293b',
        },
        vertLines: {
          color: '#1e293b',
        },
      },
      crosshair: {
        mode: 1,
      },
    });

    chartRef.current = chart;
    dispatch(setChartInstance(chart));

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });
    candlestickSeriesRef.current = candlestickSeries;

    // Add volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#6b7280',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    });
    volumeSeriesRef.current = volumeSeries;

    // Add EMA series
    const emaColors = {
      ema5: '#3b82f6',
      ema10: '#8b5cf6',
      ema20: '#f59e0b',
      ema50: '#ef4444',
      ema100: '#10b981',
      ema200: '#6366f1',
    };

    Object.keys(emaColors).forEach((emaKey) => {
      const emaSeries = chart.addLineSeries({
        color: emaColors[emaKey as keyof typeof emaColors],
        lineWidth: 1,
        priceLineVisible: false,
      });
      emaSeriesRef.current[emaKey] = emaSeries;
    });

    // Format data for Lightweight Charts
    const formatCandles = (candles: Candle[]) => {
      return candles.map(candle => ({
        time: Math.floor(candle.timestamp / 1000),
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));
    };

    const formatVolume = (candles: Candle[]) => {
      return candles.map(candle => ({
        time: Math.floor(candle.timestamp / 1000),
        value: candle.volume,
      }));
    };

    const formatEMA = (candles: Candle[], emaKey: keyof Candle) => {
      return candles
        .filter(candle => candle[emaKey] !== undefined)
        .map(candle => ({
          time: Math.floor(candle.timestamp / 1000),
          value: candle[emaKey] as number,
        }));
    };

    // Set data
    candlestickSeries.setData(formatCandles(mockCandles));
    volumeSeries.setData(formatVolume(mockCandles));

    // Set EMA data
    Object.keys(emaSeriesRef.current).forEach((emaKey) => {
      const emaData = formatEMA(mockCandles, emaKey as keyof Candle);
      if (emaData.length > 0) {
        emaSeriesRef.current[emaKey].setData(emaData);
      }
    });

    // Add price lines for signal levels
    const entryPrice = 42150;
    const stopLoss = 41500;
    const takeProfit = 43200;

    candlestickSeries.createPriceLine({
      price: entryPrice,
      color: '#10b981',
      lineStyle: 2, // dashed
      title: `Entry: $${entryPrice.toLocaleString()}`,
      axisLabelVisible: true,
    });

    candlestickSeries.createPriceLine({
      price: stopLoss,
      color: '#ef4444',
      lineStyle: 2,
      title: `SL: $${stopLoss.toLocaleString()}`,
      axisLabelVisible: true,
    });

    candlestickSeries.createPriceLine({
      price: takeProfit,
      color: '#3b82f6',
      lineStyle: 2,
      title: `TP: $${takeProfit.toLocaleString()}`,
      axisLabelVisible: true,
    });

    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [dispatch]);

  // Update EMAs when indicators change
  useEffect(() => {
    if (!candlestickSeriesRef.current || !emaSeriesRef.current) return;

    Object.keys(indicators).forEach((indicatorKey) => {
      if (indicatorKey.startsWith('ema') && indicators[indicatorKey as keyof typeof indicators]) {
        const emaKey = indicatorKey as keyof Candle;
        const emaData = mockCandles
          .filter(candle => candle[emaKey] !== undefined)
          .map(candle => ({
            time: Math.floor(candle.timestamp / 1000),
            value: candle[emaKey] as number,
          }));

        if (emaData.length > 0) {
          emaSeriesRef.current[indicatorKey].setData(emaData);
        }
      }
    });
  }, [indicators, mockCandles]);

  return (
    <div className="h-full flex flex-col">
      {/* Chart Controls */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-slate-100">
            {asset} - {timeframe}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Indicators:</span>
            {Object.entries(indicators).map(([key, enabled]) => (
              <button
                key={key}
                onClick={() => {
                  // This would dispatch toggleIndicator action
                }}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  enabled
                    ? 'bg-slate-700 text-slate-100'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-sm text-slate-300">
            Draw Tools
          </button>
          <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-sm text-slate-300">
            Indicators Menu
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 relative">
        <div ref={chartContainerRef} className="w-full h-full" />
        
        {/* Order Flow Overlay */}
        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-2">Order Flow (Last 60s)</div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-green-400 font-bold">+1.5M</div>
              <div className="text-xs text-slate-500">Buy Pressure</div>
            </div>
            <div className="text-center">
              <div className="text-red-400 font-bold">-0.8M</div>
              <div className="text-xs text-slate-500">Sell Pressure</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold">68%</div>
              <div className="text-xs text-slate-500">Imbalance</div>
            </div>
          </div>
        </div>

        {/* Smart Money Zones Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-2">Smart Money Zones</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500/30 rounded"></div>
              <span className="text-xs text-slate-300">Buy Zone: $41,500-$41,800</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500/30 rounded"></div>
              <span className="text-xs text-slate-300">Sell Zone: $43,500-$44,000</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500/30 rounded"></div>
              <span className="text-xs text-slate-300">Hold Zone: $42,000-$43,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;
