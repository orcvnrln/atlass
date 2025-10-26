import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import OrderBookRow from './OrderBookRow';


const generateOrderBookData = (count = 15) => {
  const data = { bids: [], asks: [] };
  let price = 1.0845;
  const now = new Date();

  for (let i = 0; i < count; i++) {
    price -= 0.0001;
    data.bids.push({ price: price.toFixed(5), size: Math.floor(Math.random() * 200) + 10, timestamp: now.getTime() });
  }
  price = 1.0846;
  for (let i = 0; i < count; i++) {
    data.asks.push({ price: price.toFixed(5), size: Math.floor(Math.random() * 200) + 10, timestamp: now.getTime() });
    price += 0.0001;
  }
  return data;
};

const OrderBookPanel = () => {
  const [data, setData] = useState(generateOrderBookData());
  const [isVisible, setIsVisible] = useState(true);


  useEffect(() => {
    const interval = setInterval(() => {
        const newData = generateOrderBookData();
        const now = new Date().getTime();
        const isValid = newData.bids.every(d => d.timestamp <= now) && newData.asks.every(d => d.timestamp <= now);
        if(isValid) {
            setData(newData)
        } else {
            console.error("Future-dated data detected in order book.", { data: newData, now});
        }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const maxTotal = useMemo(() => {
    const allSizes = [...data.bids.map(b => b.size), ...data.asks.map(a => a.size)];
    return Math.max(...allSizes);
  }, [data]);


  return (
    <div className="bg-card-bg p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-semibold text-white">Order Book</h3>
          <button onClick={() => setIsVisible(!isVisible)} className="text-text-secondary hover:text-white">
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {isVisible && (
            <div>
                {/* Headers */}
                <div className="flex justify-between text-text-secondary text-xs px-1 mb-1">
                    <span>Price (USD)</span>
                    <span>Size</span>
                </div>
                {/* Asks */}
                <div>
                    {data.asks.slice(0, 7).reverse().map((ask) => (
                        <OrderBookRow 
                            key={ask.price}
                            price={ask.price}
                            size={ask.size}
                            type="ask"
                            maxTotal={maxTotal}
                        />
                    ))}
                </div>
                {/* Spread */}
                <div className="py-1 my-1 border-t border-b border-border-color text-center">
                    <span className="text-lg font-bold text-text-primary">1.08455</span>
                </div>
                {/* Bids */}
                <div>
                    {data.bids.slice(0, 7).map((bid) => (
                        <OrderBookRow 
                            key={bid.price}
                            price={bid.price}
                            size={bid.size}
                            type="bid"
                            maxTotal={maxTotal}
                        />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

export default OrderBookPanel;
