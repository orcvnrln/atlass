import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';

// Helper function to generate mock history data
const generateHistoryData = (startValue, months, trend = 'up', volatility = 'medium') => {
  const data = [];
  let value = startValue;
  
  // Volatility factors
  const volatilityFactor = {
    low: 0.02,
    medium: 0.05,
    high: 0.1
  }[volatility];
  
  // Trend factors
  const trendFactor = {
    up: 0.015,
    neutral: 0,
    down: -0.008
  }[trend];
  
  // Generate each month's data
  for (let i = 0; i <= months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (months - i));
    
    // Random change with trend bias
    const change = (Math.random() - 0.5) * 2 * volatilityFactor + trendFactor;
    value *= (1 + change);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      value: Math.max(value, 0),
    });
  }
  
  return data;
};

// Generate 2 years of history
const historyData = generateHistoryData(100000, 24, 'up', 'medium');

// Generate milestone events
const milestones = [
  { 
    date: new Date(new Date().setMonth(new Date().getMonth() - 18)), 
    event: 'Added Tesla Position',
    impact: '+12.3%',
    type: 'trade'
  },
  { 
    date: new Date(new Date().setMonth(new Date().getMonth() - 15)), 
    event: 'Rebalanced Portfolio',
    impact: '+4.7%',
    type: 'rebalance'
  },
  { 
    date: new Date(new Date().setMonth(new Date().getMonth() - 10)), 
    event: 'Reduced Tech Exposure',
    impact: '-1.8%',
    type: 'rebalance'
  },
  { 
    date: new Date(new Date().setMonth(new Date().getMonth() - 6)), 
    event: 'Added Bond Allocation',
    impact: '+3.2%',
    type: 'allocation'
  },
  { 
    date: new Date(new Date().setMonth(new Date().getMonth() - 2)), 
    event: 'Dividend Reinvestment',
    impact: '+0.8%',
    type: 'dividend'
  },
];

// Sort milestones by date
milestones.sort((a, b) => b.date - a.date);

const PortfolioHistory = () => {
  const [activeTab, setActiveTab] = useState('chart');
  
  // Calculate portfolio metrics
  const startValue = historyData[0]?.value || 0;
  const currentValue = historyData[historyData.length - 1]?.value || 0;
  const totalChange = currentValue - startValue;
  const totalChangePercent = (totalChange / startValue) * 100;
  
  const tabs = [
    { id: 'chart', label: 'History Chart' },
    { id: 'milestones', label: 'Key Milestones' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-card-bg rounded-xl border border-border-color overflow-hidden"
    >
      {/* Header with tabs */}
      <div className="border-b border-border-color">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="font-bold text-text-primary">Portfolio History</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-text-secondary">2 year performance:</span>
                <span className={`text-xs font-semibold ${totalChange >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {totalChange >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent text-white'
                    : 'bg-white/5 text-text-secondary hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {activeTab === 'chart' && (
          <div className="space-y-4">
            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={totalChange >= 0 ? "#16C784" : "#EA3943"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={totalChange >= 0 ? "#16C784" : "#EA3943"} stopOpacity={0}/>
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
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      borderColor: '#374151',
                      borderRadius: '0.375rem',
                      color: '#F9FAFB',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={totalChange >= 0 ? "#16C784" : "#EA3943"} 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Year selection */}
            <div className="flex items-center justify-center gap-4">
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-accent text-white">
                2 Years
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-text-secondary hover:bg-white/10">
                1 Year
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-text-secondary hover:bg-white/10">
                6 Months
              </button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-text-secondary hover:bg-white/10">
                3 Months
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'milestones' && (
          <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-thin">
            {milestones.map((milestone, index) => {
              const isPositive = parseFloat(milestone.impact) >= 0;
              
              return (
                <div 
                  key={index} 
                  className="relative pl-6 pb-6 border-l border-border-color"
                >
                  {/* Milestone dot */}
                  <div className="absolute left-0 top-0 w-3 h-3 bg-accent rounded-full -translate-x-1.5 z-10" />
                  
                  {/* Content */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-sm text-text-primary">
                        {milestone.event}
                      </h4>
                      <span className={`text-xs font-semibold ${isPositive ? 'text-positive' : 'text-negative'}`}>
                        {milestone.impact}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">
                        {milestone.date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                      
                      <span className="text-xs text-accent">
                        {milestone.type.charAt(0).toUpperCase() + milestone.type.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PortfolioHistory;
