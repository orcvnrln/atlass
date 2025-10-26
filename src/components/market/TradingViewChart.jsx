import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

const TradingViewChart = ({ symbol }) => {
  const chartContainerRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#FFFFFF' },
        textColor: '#1F1F1F',
      },
      grid: {
        vertLines: { color: '#F5F5F5' },
        horzLines: { color: '#F5F5F5' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        borderColor: '#D9D9D9',
      },
      rightPriceScale: {
        borderColor: '#D9D9D9',
      },
    });
    
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#16C784',
      downColor: '#EA3943',
      borderDownColor: '#EA3943',
      borderUpColor: '#16C784',
      wickDownColor: '#EA3943',
      wickUpColor: '#16C784',
    });

    // Generate mock data
    const generateData = (numBars) => {
      const data = [];
      let time = new Date();
      time.setHours(0, 0, 0, 0);
      let lastClose = 100;
      
      for (let i = 0; i < numBars; i++) {
        const date = new Date(time.getTime() + i * 24 * 60 * 60 * 1000);
        const open = lastClose + (Math.random() - 0.5);
        const high = open + Math.random() * 2;
        const low = open - Math.random() * 2;
        const close = (high + low) / 2 + (Math.random() - 0.5);
        
        data.push({
          time: date.toISOString().slice(0, 10),
          open,
          high,
          low,
          close,
        });
        
        lastClose = close;
      }
      return data;
    };
    
    const data = generateData(100);
    candleSeries.setData(data);

    chart.timeScale().fitContent();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};

export default TradingViewChart;
