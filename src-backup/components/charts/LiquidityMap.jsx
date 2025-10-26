import React, { useState, useEffect } from 'react';

const generateLiquidityData = () => {
  const levels = [];
  for (let i = 0; i < 20; i++) {
    levels.push({
      price: 40000 + Math.random() * 10000,
      liquidity: Math.random() * 1000,
      type: Math.random() > 0.5 ? 'bid' : 'ask',
    });
  }
  return levels.sort((a, b) => b.price - a.price);
};

const LiquidityMap = () => {
  const [data, setData] = useState(generateLiquidityData());
  const [currentPrice, setCurrentPrice] = useState(45000);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateLiquidityData());
      setCurrentPrice(p => p + (Math.random() - 0.5) * 100);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const maxLiquidity = Math.max(...data.map(d => d.liquidity));

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-white font-bold mb-4">Liquidity Map / Hyperliquid Map</h3>
      <div className="relative h-96">
        {data.map((level, index) => {
          const top = `${((50000 - level.price) / 10000) * 100}%`;
          const width = `${(level.liquidity / maxLiquidity) * 100}%`;
          const isBid = level.type === 'bid';
          
          return (
            <div
              key={index}
              className={`absolute right-0 flex items-center justify-end pr-2`}
              style={{ 
                top, 
                width,
                height: '20px',
                backgroundColor: isBid ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)',
                borderRight: `2px solid ${isBid ? 'green' : 'red'}`
              }}
            >
                <span className="text-xs text-white">
                    {level.price.toFixed(2)} - {level.liquidity.toFixed(2)}
                </span>
            </div>
          );
        })}
        <div 
            className="absolute w-full border-t-2 border-dashed border-blue-400"
            style={{ top: `${((50000 - currentPrice) / 10000) * 100}%`}}
        >
             <span className="text-blue-400 bg-gray-800 px-2 text-sm">
                Current Price: {currentPrice.toFixed(2)}
            </span>
        </div>
      </div>
    </div>
  );
};

export default LiquidityMap;
