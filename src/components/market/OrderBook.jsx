import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const OrderBook = () => {
  const [orderBook, setOrderBook] = useState({
    bids: [],
    asks: []
  });

  useEffect(() => {
    // Generate mock order book data
    const generateOrderBook = () => {
      const bids = [];
      const asks = [];
      let basePrice = 1.0845;
      
      // Generate bids (buy orders)
      for (let i = 0; i < 10; i++) {
        const price = basePrice - (i * 0.0001);
        const size = Math.random() * 1000000 + 100000;
        bids.push({
          price: price.toFixed(4),
          size: Math.floor(size),
          total: i === 0 ? Math.floor(size) : bids[i-1]?.total + Math.floor(size) || Math.floor(size)
        });
      }
      
      // Generate asks (sell orders)
      for (let i = 0; i < 10; i++) {
        const price = basePrice + ((i + 1) * 0.0001);
        const size = Math.random() * 1000000 + 100000;
        asks.push({
          price: price.toFixed(4),
          size: Math.floor(size),
          total: i === 0 ? Math.floor(size) : asks[i-1]?.total + Math.floor(size) || Math.floor(size)
        });
      }
      
      setOrderBook({ bids, asks });
    };

    generateOrderBook();
    const interval = setInterval(generateOrderBook, 2000);
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
        <h3 className="text-sm font-semibold text-[#1F1F1F]">Order Book</h3>
        <p className="text-xs text-[#666666]">EUR/USD</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-[#E0E0E0] text-xs font-medium text-[#666666]">
            <div>Price</div>
            <div className="text-right">Size</div>
            <div className="text-right">Total</div>
          </div>
          
          {/* Asks (Sell Orders) */}
          <div className="flex-1 overflow-y-auto">
            {orderBook.asks.map((ask, index) => (
              <motion.div
                key={`ask-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="grid grid-cols-3 gap-2 px-4 py-1 text-xs hover:bg-[#F5F5F5] transition-colors"
              >
                <div className="text-[#EA3943] font-mono">{ask.price}</div>
                <div className="text-right text-[#1F1F1F] font-mono">{formatSize(ask.size)}</div>
                <div className="text-right text-[#666666] font-mono">{formatSize(ask.total)}</div>
              </motion.div>
            ))}
          </div>
          
          {/* Spread */}
          <div className="px-4 py-2 bg-[#F5F5F5] border-y border-[#D9D9D9]">
            <div className="text-center text-xs text-[#666666]">
              Spread: {((parseFloat(orderBook.asks[0]?.price || 0) - parseFloat(orderBook.bids[0]?.price || 0)) * 10000).toFixed(1)} pips
            </div>
          </div>
          
          {/* Bids (Buy Orders) */}
          <div className="flex-1 overflow-y-auto">
            {orderBook.bids.map((bid, index) => (
              <motion.div
                key={`bid-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className="grid grid-cols-3 gap-2 px-4 py-1 text-xs hover:bg-[#F5F5F5] transition-colors"
              >
                <div className="text-[#16C784] font-mono">{bid.price}</div>
                <div className="text-right text-[#1F1F1F] font-mono">{formatSize(bid.size)}</div>
                <div className="text-right text-[#666666] font-mono">{formatSize(bid.total)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
