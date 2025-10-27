import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const CountUpAnimation = ({ value, duration = 1000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    // Parse numeric value
    const numericValue = typeof value === 'string' 
      ? parseFloat(value.replace(/[^0-9.-]/g, '')) 
      : value;
    
    if (isNaN(numericValue)) return;

    const startValue = count;
    const diff = numericValue - startValue;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = startValue + (diff * easeOutQuart);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    setPrevValue(numericValue);
  }, [value]);

  const formatValue = (val) => {
    if (suffix === '%') {
      return val.toFixed(2);
    } else if (prefix === '$') {
      return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return val.toFixed(2);
  };

  return (
    <span className="monospace">
      {prefix}{formatValue(count)}{suffix}
    </span>
  );
};

const RealTimeKPI = ({ title, value, change, changePercent, icon: Icon, isPositive, isRealTime = false }) => {
  const [flashColor, setFlashColor] = useState(null);
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    if (isRealTime && prevValue !== value) {
      // Determine flash color based on change
      const numPrev = typeof prevValue === 'string' ? parseFloat(prevValue.replace(/[^0-9.-]/g, '')) : prevValue;
      const numCurrent = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
      
      if (numCurrent > numPrev) {
        setFlashColor('positive');
      } else if (numCurrent < numPrev) {
        setFlashColor('negative');
      }

      // Clear flash after animation
      setTimeout(() => setFlashColor(null), 500);
      setPrevValue(value);
    }
  }, [value, isRealTime]);

  return (
    <motion.div
      layout
      className={`bg-card-bg rounded-xl p-4 card-elevation border border-border-color transition-all duration-300 ${
        flashColor === 'positive' ? 'ring-2 ring-positive ring-opacity-50' :
        flashColor === 'negative' ? 'ring-2 ring-negative ring-opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        {isRealTime && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-positive animate-pulse"></div>
            <span className="text-xs text-gray-400 font-medium">Live</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">{title}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-text-primary">
            {isRealTime ? (
              <CountUpAnimation value={value} prefix={value.toString().includes('$') ? '$' : ''} />
            ) : (
              value
            )}
          </p>
          {isPositive !== null && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'positive' : 'negative'}`}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{changePercent}</span>
            </motion.div>
          )}
        </div>
        <p className="text-xs text-gray-400">{change}</p>
      </div>
    </motion.div>
  );
};

export default RealTimeKPI;
