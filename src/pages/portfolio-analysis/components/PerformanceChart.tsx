import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { historicalPerformance, keyMetrics } from '../utils/mockData';
import { formatCurrency, formatPercentage, formatDate } from '../utils/formatters';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/switch'; // Assuming you have a switch component

const timeframes = ['1D', '1W', '1M', '3M', '6M', 'YTD', '1Y', 'ALL'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-3 text-sm font-mono">
        <p className="font-bold text-text-primary">{formatDate(label)}</p>
        <p className="text-green-400">Portfolio: {formatCurrency(data.portfolioValue)}</p>
        <p className="text-gray-400">Benchmark: {formatCurrency(data.benchmarkValue)}</p>
        <p className="text-blue-400">Alpha: {formatPercentage((data.portfolioValue / data.benchmarkValue - 1) * 100)}</p>
      </div>
    );
  }
  return null;
};

const PerformanceChart: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('ALL');
  const [showBenchmark, setShowBenchmark] = useState(true);

  return (
    <div className="bg-[#16181d] border border-[#1f2937] rounded-xl p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h3 className="text-base font-bold text-text-primary">Portfolio Performance</h3>
          <p className="text-sm text-text-secondary">{formatCurrency(keyMetrics.totalValue)} (+{formatPercentage(keyMetrics.dailyChangePercent)}) vs S&P 500</p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {timeframes.map(tf => (
            <Button 
              key={tf} 
              variant={activeTimeframe === tf ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTimeframe(tf)}
              className="text-xs h-8"
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={historicalPerformance} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tickFormatter={(val) => formatDate(val).split(',')[0]} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis orientation="right" tickFormatter={(val) => formatCurrency(val, true)} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="portfolioValue" stroke="#10b981" strokeWidth={2} fill="url(#portfolioGradient)" name="Portfolio" />
            {showBenchmark && <Area type="monotone" dataKey="benchmarkValue" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" fill="none" name="S&P 500" />}
            <ReferenceLine y={keyMetrics.initialInvestment} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-800/50 text-xs font-mono text-text-secondary">
        <div className="flex items-center gap-1"><span className="font-bold">CAGR:</span><span className="text-green-400">15.2%</span></div>
        <div className="flex items-center gap-1"><span className="font-bold">Total Return:</span><span className="text-green-400">{formatPercentage(keyMetrics.allTimePnlPercent)}</span></div>
        <div className="flex items-center gap-1"><span className="font-bold">Alpha vs SPY:</span><span className="text-blue-400">+4.8%</span></div>
        <div className="flex items-center gap-1"><span className="font-bold">Volatility:</span><span className="text-yellow-400">18.5%</span></div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Switch id="benchmark-toggle" checked={showBenchmark} onCheckedChange={setShowBenchmark} />
          <label htmlFor="benchmark-toggle" className="text-xs">Hide Benchmark</label>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
