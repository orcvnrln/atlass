import React, { useState, useEffect } from 'react';
import HeatmapChart from '@/components/charts/HeatmapChart';
import { getOrderBookData, getCurrentPrice } from '@/data/orderBookData.js';

const OrderBook = ({ data, currentPrice }) => {
    const asks = data.filter(d => d.price > currentPrice).slice(0, 10).reverse();
    const bids = data.filter(d => d.price <= currentPrice).reverse().slice(0, 10);

  return (
    <div className="bg-card-bg p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-2">Order Book</h3>
      <div className="text-red-400">
        {asks.map(ask => (
            <div key={ask.price} className="flex justify-between text-sm">
                <span>{ask.price.toFixed(5)}</span>
                <span>{ask.ask.toFixed(2)}</span>
            </div>
        ))}
      </div>
      <div className="text-xl font-bold my-2 text-center py-2 border-y border-border-color">{currentPrice.toFixed(5)}</div>
      <div className="text-green-400">
        {bids.map(bid => (
            <div key={bid.price} className="flex justify-between text-sm">
                <span>{bid.price.toFixed(5)}</span>
                <span>{bid.bid.toFixed(2)}</span>
            </div>
        ))}
      </div>
    </div>
  );
};

const LiquidityHeatmap = () => {
    const [orderBookData, setOrderBookData] = useState([]);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [chartType, setChartType] = useState('heatmap'); // 'heatmap' or 'profile'

    useEffect(() => {
        const interval = setInterval(() => {
            setOrderBookData(getOrderBookData());
            setCurrentPrice(getCurrentPrice());
        }, 500); // Refresh every 500ms
        return () => clearInterval(interval);
    }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-text-primary mb-6">Live Liquidity Heatmap</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{minHeight: '600px'}}>
        <OrderBook data={orderBookData} currentPrice={currentPrice} />
        
        <div className="bg-card-bg p-4 rounded-lg col-span-1 lg:col-span-3">
            <div className="flex items-center gap-4 mb-4">
                <h3 className="text-lg font-bold">Liquidity Vision</h3>
                <div className="flex items-center bg-primary-bg p-1 rounded-md">
                    <button onClick={() => setChartType('heatmap')} className={`px-3 py-1 text-sm rounded ${chartType === 'heatmap' ? 'bg-accent text-white' : 'text-text-secondary'}`}>Heatmap</button>
                    <button onClick={() => setChartType('profile')} className={`px-3 py-1 text-sm rounded ${chartType === 'profile' ? 'bg-accent text-white' : 'text-text-secondary'}`}>Volume Profile</button>
                </div>
            </div>
            <div className="w-full h-[540px]">
                <HeatmapChart data={orderBookData} chartType={chartType} currentPrice={currentPrice} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityHeatmap;
