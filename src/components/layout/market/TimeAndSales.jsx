import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const generateTrade = () => {
  const price = 1.0845 + (Math.random() - 0.5) * 0.0002;
  return {
    time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
    price: price.toFixed(5),
    size: Math.floor(Math.random() * 500) + 1,
    side: Math.random() > 0.5 ? 'buy' : 'sell',
  };
};

const TimeAndSales = () => {
  const [trades, setTrades] = useState(() => Array.from({ length: 20 }, generateTrade));

  useEffect(() => {
    const interval = setInterval(() => {
      setTrades(prevTrades => [generateTrade(), ...prevTrades.slice(0, 49)]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const Header = () => (
    <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs font-medium text-[#9CA3AF] border-b border-[#374151]">
      <span className="text-left">TIME</span>
      <span className="text-center">PRICE</span>
      <span className="text-right">SIZE</span>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold text-white p-3 border-b border-[#374151]">Time & Sales</h2>
      <Header />
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {trades.map((trade, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`grid grid-cols-3 gap-2 px-3 py-0.5 text-xs monospace ${
              trade.side === 'buy' ? 'positive' : 'negative'
            }`}
          >
            <span className="text-left text-[#9CA3AF]">{trade.time}</span>
            <span className="text-center font-semibold">{trade.price}</span>
            <span className="text-right">{trade.size.toLocaleString()}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimeAndSales;
