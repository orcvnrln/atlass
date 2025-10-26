import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const generateOrderBookData = () => {
  const data = { bids: [], asks: [] };
  let price = 1.0845;
  for (let i = 0; i < 15; i++) {
    price -= 0.0001;
    data.bids.push({ price: price.toFixed(5), size: Math.floor(Math.random() * 2000) + 100 });
  }
  price = 1.0846;
  for (let i = 0; i < 15; i++) {
    data.asks.push({ price: price.toFixed(5), size: Math.floor(Math.random() * 2000) + 100 });
    price += 0.0001;
  }
  return data;
};

const OrderBook = () => {
  const [data, setData] = useState(generateOrderBookData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateOrderBookData());
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const maxBidSize = Math.max(...data.bids.map(b => b.size));
  const maxAskSize = Math.max(...data.asks.map(a => a.size));
  const maxOverallSize = Math.max(maxBidSize, maxAskSize);

  const Header = () => (
    <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs font-medium text-[#9CA3AF] border-b border-[#374151]">
      <span className="text-left">SIZE</span>
      <span className="text-center">PRICE</span>
      <span className="text-right">SIZE</span>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold text-white p-3 border-b border-[#374151]">Order Book</h2>
      <Header />
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Asks */}
        <div className="flex flex-col-reverse">
          {data.asks.map((ask, index) => (
            <motion.div
              key={`ask-${ask.price}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-3 gap-2 px-3 py-0.5 text-xs monospace relative hover:bg-white/5"
            >
              <div
                className="absolute top-0 bottom-0 left-0 bg-[#EA3943]/20"
                style={{ width: `${(ask.size / maxOverallSize) * 100}%` }}
              />
              <span className="text-left z-10">-</span>
              <span className="text-center z-10 negative">{ask.price}</span>
              <span className="text-right z-10">{ask.size.toLocaleString()}</span>
            </motion.div>
          ))}
        </div>

        {/* Spread */}
        <div className="px-3 py-1 my-1 text-center text-sm font-bold border-y border-[#374151]">
          1.0845 / 1.0846 (0.1)
        </div>

        {/* Bids */}
        <div>
          {data.bids.map((bid, index) => (
            <motion.div
              key={`bid-${bid.price}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-3 gap-2 px-3 py-0.5 text-xs monospace relative hover:bg-white/5"
            >
              <div
                className="absolute top-0 bottom-0 right-0 bg-[#16C784]/20"
                style={{ width: `${(bid.size / maxOverallSize) * 100}%` }}
              />
              <span className="text-left z-10">{bid.size.toLocaleString()}</span>
              <span className="text-center z-10 positive">{bid.price}</span>
              <span className="text-right z-10">-</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;