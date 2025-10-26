import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react';

const ForexHeatmap = () => {
  const [timeframe, setTimeframe] = useState('1D');
  const [heatmapData, setHeatmapData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'];
  
  const timeframes = [
    { id: '1H', label: '1 Hour' },
    { id: '4H', label: '4 Hours' },
    { id: '1D', label: '1 Day' },
    { id: '1W', label: '1 Week' },
    { id: '1M', label: '1 Month' }
  ];

  useEffect(() => {
    generateHeatmapData();
  }, [timeframe]);

  const generateHeatmapData = () => {
    const data = [];
    
    for (let i = 0; i < currencies.length; i++) {
      for (let j = 0; j < currencies.length; j++) {
        if (i !== j) {
          const baseCurrency = currencies[i];
          const quoteCurrency = currencies[j];
          const pair = `${baseCurrency}${quoteCurrency}`;
          
          // Generate realistic forex data based on timeframe
          const baseStrength = getRandomChange(timeframe);
          const quoteStrength = getRandomChange(timeframe);
          const change = baseStrength - quoteStrength;
          
          data.push({
            pair,
            baseCurrency,
            quoteCurrency,
            change: change,
            strength: Math.abs(change),
            volume: Math.random() * 1000000 + 500000,
            volatility: Math.random() * 2 + 0.5
          });
        }
      }
    }
    
    setHeatmapData(data);
    setLastUpdate(new Date());
  };

  const getRandomChange = (timeframe) => {
    const multipliers = {
      '1H': 0.2,
      '4H': 0.5,
      '1D': 1.0,
      '1W': 2.5,
      '1M': 5.0
    };
    
    return (Math.random() - 0.5) * 4 * multipliers[timeframe];
  };

  const getChangeColor = (change) => {
    const intensity = Math.min(Math.abs(change) / 2, 1);
    
    if (change > 0) {
      return `rgba(34, 197, 94, ${0.2 + intensity * 0.6})`;
    } else {
      return `rgba(239, 68, 68, ${0.2 + intensity * 0.6})`;
    }
  };

  const getTextColor = (change) => {
    const intensity = Math.abs(change);
    if (intensity > 1.5) {
      return change > 0 ? 'text-white' : 'text-white';
    }
    return change > 0 ? 'text-green-800' : 'text-red-800';
  };

  const getCurrencyStrength = (currency) => {
    const currencyPairs = heatmapData.filter(
      item => item.baseCurrency === currency
    );
    
    if (currencyPairs.length === 0) return 0;
    
    const avgChange = currencyPairs.reduce((sum, pair) => sum + pair.change, 0) / currencyPairs.length;
    return avgChange;
  };

  const sortedCurrencies = [...currencies].sort((a, b) => {
    return getCurrencyStrength(b) - getCurrencyStrength(a);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Forex Currency Heatmap</h2>
          <p className="text-text-secondary">
            Real-time currency strength analysis across major pairs
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Activity size={16} />
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <button
            onClick={generateHeatmapData}
            className="p-2 bg-accent-orange/10 text-accent-orange rounded-lg hover:bg-accent-orange/20 transition-colors"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {timeframes.map((tf) => (
          <button
            key={tf.id}
            onClick={() => setTimeframe(tf.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeframe === tf.id
                ? 'bg-accent-orange text-white'
                : 'bg-card-bg text-text-secondary hover:text-text-primary border border-border-on-card'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Currency Strength Ranking */}
      <div className="bg-card-bg rounded-lg p-4 border border-border-on-card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Currency Strength Ranking</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {sortedCurrencies.map((currency, index) => {
            const strength = getCurrencyStrength(currency);
            return (
              <motion.div
                key={currency}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold text-sm mb-2 ${
                  strength > 0 ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'
                }`}>
                  {currency}
                </div>
                <div className="text-xs text-text-secondary">#{index + 1}</div>
                <div className={`text-xs font-medium ${
                  strength > 0 ? 'text-accent-green' : 'text-accent-red'
                }`}>
                  {strength > 0 ? '+' : ''}{strength.toFixed(2)}%
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="bg-card-bg rounded-lg p-4 border border-border-on-card overflow-x-auto">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Currency Pair Performance</h3>
        
        <div className="min-w-[600px]">
          {/* Header Row */}
          <div className="grid grid-cols-9 gap-1 mb-1">
            <div></div>
            {currencies.map((currency) => (
              <div key={currency} className="text-center text-sm font-medium text-text-secondary p-2">
                {currency}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          {currencies.map((baseCurrency) => (
            <div key={baseCurrency} className="grid grid-cols-9 gap-1 mb-1">
              <div className="text-center text-sm font-medium text-text-secondary p-2">
                {baseCurrency}
              </div>
              {currencies.map((quoteCurrency) => {
                if (baseCurrency === quoteCurrency) {
                  return (
                    <div key={quoteCurrency} className="bg-gray-800 rounded p-2 h-12 flex items-center justify-center">
                      <span className="text-xs text-gray-500">—</span>
                    </div>
                  );
                }

                const pairData = heatmapData.find(
                  item => item.baseCurrency === baseCurrency && item.quoteCurrency === quoteCurrency
                );

                if (!pairData) return <div key={quoteCurrency} className="h-12"></div>;

                return (
                  <motion.div
                    key={quoteCurrency}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded p-2 h-12 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: getChangeColor(pairData.change) }}
                    title={`${pairData.pair}: ${pairData.change > 0 ? '+' : ''}${pairData.change.toFixed(2)}%`}
                  >
                    <span className={`text-xs font-bold ${getTextColor(pairData.change)}`}>
                      {pairData.change > 0 ? '+' : ''}{pairData.change.toFixed(2)}%
                    </span>
                    <div className="flex items-center gap-1">
                      {pairData.change > 0 ? (
                        <TrendingUp size={8} className={getTextColor(pairData.change)} />
                      ) : (
                        <TrendingDown size={8} className={getTextColor(pairData.change)} />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-card-bg rounded-lg p-4 border border-border-on-card">
        <h4 className="text-sm font-semibold text-text-primary mb-3">Legend</h4>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent-green/40 rounded"></div>
            <span className="text-text-secondary">Strong Performance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent-red/40 rounded"></div>
            <span className="text-text-secondary">Weak Performance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <span className="text-text-secondary">Same Currency</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForexHeatmap;
