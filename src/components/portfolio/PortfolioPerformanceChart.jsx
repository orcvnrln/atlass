import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

// Mock data generator
const generatePerformanceData = (days) => {
  const data = [];
  let value = 100000;
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random walk with slight upward bias
    const change = (Math.random() - 0.45) * 2000;
    value += change;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.max(value, 50000),
      benchmark: 100000 + (days - i) * 150, // S&P500 benchmark
    });
  }
  
  return data;
};

const timeRanges = [
  { id: '1D', label: '1D', days: 1 },
  { id: '1W', label: '1W', days: 7 },
  { id: '1M', label: '1M', days: 30 },
  { id: '3M', label: '3M', days: 90 },
  { id: '1Y', label: '1Y', days: 365 },
  { id: 'ALL', label: 'ALL', days: 730 },
];

const PortfolioPerformanceChart = () => {
  const [selectedRange, setSelectedRange] = useState('1M');
  const [showBenchmark, setShowBenchmark] = useState(true);

  const currentRange = timeRanges.find(r => r.id === selectedRange);
  const data = generatePerformanceData(currentRange.days);

  // Calculate stats
  const startValue = data[0]?.value || 0;
  const endValue = data[data.length - 1]?.value || 0;
  const change = endValue - startValue;
  const changePercent = ((change / startValue) * 100).toFixed(2);
  const isPositive = change >= 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card-bg border border-border-color rounded-lg p-3 shadow-xl">
          <p className="text-xs text-text-secondary mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-text-secondary">Portfolio:</span>
              <span className="text-sm font-bold text-text-primary">
                ${payload[0].value.toLocaleString()}
              </span>
            </div>
            {showBenchmark && payload[1] && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-text-secondary">S&P 500:</span>
                <span className="text-sm font-bold text-blue-400">
                  ${payload[1].value.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg rounded-xl border border-border-color p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary mb-1">Portfolio Performance</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-text-primary">
              ${endValue.toLocaleString()}
            </span>
            <span className={`text-sm font-semibold ${isPositive ? 'text-positive' : 'text-negative'}`}>
              {isPositive ? '+' : ''}{change.toLocaleString()} ({isPositive ? '+' : ''}{changePercent}%)
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            {currentRange.label} performance vs S&P 500 benchmark
          </p>
        </div>

        {/* Benchmark Toggle */}
        <button
          onClick={() => setShowBenchmark(!showBenchmark)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            showBenchmark
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : 'bg-white/5 text-text-secondary border-transparent hover:bg-white/10'
          }`}
        >
          {showBenchmark ? 'Hide' : 'Show'} Benchmark
        </button>
      </div>

      {/* Chart */}
      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#16C784" : "#EA3943"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isPositive ? "#16C784" : "#EA3943"} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4C6EF5" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#4C6EF5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF" 
              tick={{ fontSize: 11 }}
              tickLine={false}
            />
            <YAxis 
              stroke="#9CA3AF" 
              tick={{ fontSize: 11 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Benchmark Area */}
            {showBenchmark && (
              <Area 
                type="monotone" 
                dataKey="benchmark" 
                stroke="#4C6EF5" 
                strokeWidth={1.5}
                strokeDasharray="5 5"
                fillOpacity={1} 
                fill="url(#colorBenchmark)" 
              />
            )}
            
            {/* Portfolio Area */}
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? "#16C784" : "#EA3943"} 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-text-secondary" />
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setSelectedRange(range.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedRange === range.id
                  ? 'bg-accent text-white'
                  : 'bg-white/5 text-text-secondary hover:bg-white/10'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioPerformanceChart;
