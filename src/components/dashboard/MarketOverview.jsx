import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import EconomicCalendar from './EconomicCalendar';
import { Link } from 'react-router-dom';
import { getAssetData } from '@/data/marketData';

const heatmapSymbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'EURJPY', 'BTCUSD', 'SPX500', 'XAUUSD', 'TSLA', 'AAPL'];
const heatmapData = heatmapSymbols.map(getAssetData).filter(Boolean);


const getIntensityColor = (change, theme) => {
    const intensity = Math.min(Math.abs(change) / 3, 1) * 0.8 + 0.2; // from 20% to 100%
    if (theme === 'theme-dark-pro') {
        return change > 0 
            ? `rgba(255, 255, 255, ${intensity * 0.1})` // White with opacity
            : `rgba(156, 163, 175, ${intensity * 0.1})`; // Gray with opacity
    }
    // Fallback for other themes
    return change > 0 
        ? `rgba(22, 199, 132, ${intensity})` // Green with opacity
        : `rgba(234, 57, 67, ${intensity})`; // Red with opacity
};

const MarketOverview = () => {
  const { theme } = useTheme();

  return (
    <div className="bg-card-bg rounded-xl card-padding card-elevation border border-border-on-card">
      <h2 className="text-2xl font-bold text-text-on-card-primary mb-6">Market Heatmap</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {heatmapData.map((item) => (
          <Link to={`/asset/${item.symbol}`} key={item.symbol}>
            <motion.div
              className={`rounded-lg card-padding flex flex-col justify-between border border-border-on-card ${item.change >= 0 ? 'card-hover-glow' : 'card-hover-glow-negative'} card-click-glow h-full`}
              style={{ 
                  minHeight: '100px',
                  backgroundColor: getIntensityColor(item.change, theme) 
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-bold text-text-on-card-primary font-mono text-lg">{item.symbol}</p>
              <p className={`text-xl font-bold font-mono ${item.change >= 0 ? 'positive' : 'negative'}`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
              </p>
              <p className={`text-sm font-mono ${item.percent >= 0 ? 'positive' : 'negative'}`}>
                  ({item.percent.toFixed(2)}%)
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
      <EconomicCalendar />
    </div>
  );
};

export default MarketOverview;