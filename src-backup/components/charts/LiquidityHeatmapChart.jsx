import React, { useState, useEffect } from 'react';
import HeatmapChart from '@/components/charts/HeatmapChart';
import { getOrderBookData, getCurrentPrice } from '@/data/orderBookData.js';

const LiquidityHeatmapChart = () => {
    const [orderBookData, setOrderBookData] = useState([]);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [chartType, setChartType] = useState('heatmap'); // 'heatmap' or 'profile'

    useEffect(() => {
        const data = getOrderBookData();
        const price = getCurrentPrice();
        setOrderBookData(data);
        setCurrentPrice(price);

        const interval = setInterval(() => {
            setOrderBookData(getOrderBookData());
            setCurrentPrice(getCurrentPrice());
        }, 2000); // Refresh every 2s
        return () => clearInterval(interval);
    }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg h-full">
        <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-bold text-white">Liquidity History / Heatmap</h3>
            <div className="flex items-center bg-gray-900 p-1 rounded-md">
                <button onClick={() => setChartType('heatmap')} className={`px-3 py-1 text-sm rounded ${chartType === 'heatmap' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>Heatmap</button>
                <button onClick={() => setChartType('profile')} className={`px-3 py-1 text-sm rounded ${chartType === 'profile' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>Volume Profile</button>
            </div>
        </div>
        <div className="w-full h-[calc(100%-40px)]">
            <HeatmapChart data={orderBookData} chartType={chartType} currentPrice={currentPrice} />
        </div>
    </div>
  );
};

export default LiquidityHeatmapChart;
