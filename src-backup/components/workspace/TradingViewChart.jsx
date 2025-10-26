import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { createChart } from 'lightweight-charts';

// Function to generate sample financial data
const generateSampleData = (numPoints = 100) => {
  const data = [];
  let price = 100;
  const date = new Date();
  for (let i = 0; i < numPoints; i++) {
    const change = (Math.random() - 0.5) * 5;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    data.push({
      time: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      open,
      high,
      low,
      close,
    });
    price = close;
  }
  return data;
};

const TradingViewChart = ({ asset }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const resizeObserver = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        backgroundColor: '#1A1A1A', // Corresponds to --card-bg in dark-pro theme
        textColor: '#FFFFFF',
      },
      grid: {
        vertLines: { color: '#333333' }, // Corresponds to --border-on-card
        horzLines: { color: '#333333' },
      },
      crosshair: {
        mode: 'normal',
      },
      timeScale: {
        borderColor: '#333333',
      },
    });

    const candlestickSeries = chartRef.current.addCandlestickSeries({
      upColor: '#16C784',
      downColor: '#EA3943',
      borderDownColor: '#EA3943',
      borderUpColor: '#16C784',
      wickDownColor: '#EA3943',
      wickUpColor: '#16C784',
    });

    candlestickSeries.setData(generateSampleData());

    chartRef.current.timeScale().fitContent();

    return () => {
      chartRef.current.remove();
    };
  }, [asset]);

  useLayoutEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    resizeObserver.current = new ResizeObserver(entries => {
      if (entries.length === 0 || !entries[0].target) return;
      const { width, height } = entries[0].contentRect;
      chartRef.current?.applyOptions({ width, height });
    });

    resizeObserver.current.observe(container);

    return () => {
      resizeObserver.current.disconnect();
    };
  }, []);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};

export default TradingViewChart;
