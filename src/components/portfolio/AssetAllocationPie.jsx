import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const mockAllocationData = [
  { name: 'Stocks', value: 45000, percentage: 35.4, change: 5.2, color: '#4C6EF5' },
  { name: 'Crypto', value: 38000, percentage: 29.9, change: 12.8, color: '#F59E0B' },
  { name: 'Forex', value: 25000, percentage: 19.7, change: -2.1, color: '#10B981' },
  { name: 'Commodities', value: 12000, percentage: 9.4, change: 3.5, color: '#8B5CF6' },
  { name: 'Bonds', value: 7000, percentage: 5.5, change: 1.2, color: '#6B7280' },
];

const AssetAllocationPie = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const totalValue = mockAllocationData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card-bg border border-border-color rounded-lg p-3 shadow-xl">
          <p className="text-sm font-bold text-text-primary mb-2">{data.name}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-text-secondary">Value:</span>
              <span className="text-sm font-bold text-text-primary">
                ${data.value.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-text-secondary">Allocation:</span>
              <span className="text-sm font-bold text-text-primary">
                {data.percentage}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-text-secondary">Change:</span>
              <span className={`text-sm font-bold ${data.change >= 0 ? 'text-positive' : 'text-negative'}`}>
                {data.change >= 0 ? '+' : ''}{data.change}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percentage < 5) return null; // Don't show label for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card-bg rounded-xl border border-border-color p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-primary mb-1">Asset Allocation</h3>
        <p className="text-xs text-text-secondary">
          Portfolio distribution by asset class
        </p>
      </div>

      {/* Chart */}
      <div className="h-80 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockAllocationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={120}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {mockAllocationData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                  style={{ 
                    filter: activeIndex === index ? 'brightness(1.2)' : 'none',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {mockAllocationData.map((item, index) => (
          <motion.button
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
              activeIndex === index 
                ? 'bg-white/10 ring-1 ring-white/20' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-semibold text-text-primary">{item.name}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-text-primary">
                  ${item.value.toLocaleString()}
                </p>
                <p className="text-xs text-text-secondary">
                  {item.percentage}%
                </p>
              </div>
              
              <div className={`flex items-center gap-1 text-xs font-semibold ${
                item.change >= 0 ? 'text-positive' : 'text-negative'
              }`}>
                {item.change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{item.change >= 0 ? '+' : ''}{item.change}%</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-border-color">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text-secondary">Total Portfolio Value</span>
          <span className="text-lg font-bold text-text-primary">
            ${totalValue.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AssetAllocationPie;
