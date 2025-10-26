import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const generateOrderBookData = (count = 15) => {
  const data = { bids: [], asks: [] };
  let price = 1.0845;
  for (let i = 0; i < count; i++) {
    price -= 0.0001;
    data.bids.push({ price: price.toFixed(5), size: Math.floor(Math.random() * 200) + 10 });
  }
  price = 1.0846;
  for (let i = 0; i < count; i++) {
    data.asks.push({ price: price.toFixed(5), size: Math.floor(Math.random() * 200) + 10 });
    price += 0.0001;
  }
  return data;
};

const OrderBookPanel = () => {
  const [data, setData] = useState(generateOrderBookData());

  useEffect(() => {
    const interval = setInterval(() => setData(generateOrderBookData()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
        <h3 className="text-md font-semibold text-white mb-2">Order Book</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
            {/* Asks */}
            <div>
                <div className="flex justify-between text-text-secondary px-2 py-1 border-b border-border-color">
                    <span>Price (USD)</span>
                    <span>Size (Lots)</span>
                </div>
                {data.asks.slice(0).reverse().map((ask) => (
                    <div key={ask.price} className="flex justify-between p-1 rounded hover:bg-negative/20">
                        <span className="text-negative">{ask.price}</span>
                        <span className="font-mono">{ask.size}K</span>
                    </div>
                ))}
            </div>
            {/* Bids */}
            <div>
                 <div className="flex justify-between text-text-secondary px-2 py-1 border-b border-border-color">
                    <span>Price (USD)</span>
                    <span>Size (Lots)</span>
                </div>
                {data.bids.map((bid) => (
                    <div key={bid.price} className="flex justify-between p-1 rounded hover:bg-positive/20">
                        <span className="text-positive">{bid.price}</span>
                        <span className="font-mono">{bid.size}K</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default OrderBookPanel;
