import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TimeAndSales = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const generateTrade = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        fractionalSecondDigits: 3
      });
      
      const basePrice = 1.0845;
      const price = (basePrice + (Math.random() - 0.5) * 0.001).toFixed(4);
      const size = Math.floor(Math.random() * 10000000) + 100000;
      const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
      
      return {
        time,
        price: parseFloat(price),
        size,
        side
      };
    };

    const addTrade = () => {
      setTrades(prev => {
        const newTrade = generateTrade();
        return [newTrade, ...prev].slice(0, 50); // Keep only last 50 trades
      });
    };

    // Add initial trades
    for (let i = 0; i < 20; i++) {
      addTrade();
    }

    const interval = setInterval(addTrade, Math.random() * 2000 + 500);
    return () => clearInterval(interval);
  }, []);

  const formatSize = (size) => {
    if (size >= 1000000) return `${(size / 1000000).toFixed(1)}M`;
    if (size >= 1000) return `${(size / 1000).toFixed(1)}K`;
    return size.toString();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#D9D9D9]">
        <h3 className="text-sm font-semibold text-[#1F1F1F]">Time & Sales</h3>
        <p className="text-xs text-[#666666]">EUR/USD</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-4 gap-2 px-4 py-2 bg-[#E0E0E0] text-xs font-medium text-[#666666]">
          <div>Time</div>
          <div className="text-right">Price</div>
          <div className="text-right">Size</div>
          <div className="text-center">Side</div>
        </div>
        
        {/* Trades */}
        <div className="flex-1 overflow-y-auto">
          {trades.map((trade, index) => (
            <motion.div
              key={`trade-${index}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`grid grid-cols-4 gap-2 px-4 py-1 text-xs border-l-2 ${
                trade.side === 'BUY' ? 'border-l-[#16C784] bg-[#16C784]/5' : 'border-l-[#EA3943] bg-[#EA3943]/5'
              } hover:bg-[#F5F5F5] transition-colors`}
            >
              <div className="text-[#666666] font-mono text-[10px]">{trade.time}</div>
              <div className="text-right font-mono text-[#1F1F1F] font-semibold">{trade.price.toFixed(4)}</div>
              <div className="text-right text-[#1F1F1F] font-mono">{formatSize(trade.size)}</div>
              <div className={`text-center font-mono font-semibold ${
                trade.side === 'BUY' ? 'text-[#16C784]' : 'text-[#EA3943]'
              }`}>
                {trade.side}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeAndSales;
