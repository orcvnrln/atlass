import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Shield,
  Clock,
  Activity,
  Zap,
  Brain,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AIPerformanceDashboard = () => {
  const [timeframe, setTimeframe] = useState('24h');
  const [performance, setPerformance] = useState({
    totalTrades: 156,
    winRate: 78.5,
    profitLoss: 12450.75,
    sharpeRatio: 1.85,
    maxDrawdown: -8.2,
    avgTradeDuration: '2.5h',
    activePositions: 8,
    riskAdjustedReturn: 12.3
  });

  // Mock performance data
  const performanceData = [
    { time: '00:00', pnl: 1200, trades: 5 },
    { time: '04:00', pnl: 2100, trades: 8 },
    { time: '08:00', pnl: 1800, trades: 12 },
    { time: '12:00', pnl: 3200, trades: 15 },
    { time: '16:00', pnl: 2800, trades: 18 },
    { time: '20:00', pnl: 3500, trades: 22 },
    { time: '24:00', pnl: 4200, trades: 25 }
  ];

  const tradeDistribution = [
    { name: 'Winning Trades', value: 78.5, color: '#10B981' },
    { name: 'Losing Trades', value: 21.5, color: '#EF4444' }
  ];

  const strategyPerformance = [
    { strategy: 'Momentum Breakout', trades: 45, winRate: 82, pnl: 5200 },
    { strategy: 'Mean Reversion', trades: 38, winRate: 74, pnl: 3100 },
    { strategy: 'Scalping', trades: 42, winRate: 76, pnl: 2800 },
    { strategy: 'Swing Trading', trades: 31, winRate: 81, pnl: 1350 }
  ];

  const riskMetrics = [
    { metric: 'VaR (95%)', value: '$2,450', status: 'good' },
    { metric: 'Max Drawdown', value: '8.2%', status: 'warning' },
    { metric: 'Sharpe Ratio', value: '1.85', status: 'excellent' },
    { metric: 'Sortino Ratio', value: '2.1', status: 'excellent' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'danger': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'danger': return <XCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 border border-[#3b82f6]/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3b82f6]/20 rounded-lg">
            <BarChart3 className="w-6 h-6 text-[#3b82f6]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Performance Dashboard</h2>
            <p className="text-sm text-gray-400">Comprehensive trading performance analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-[#0f172a] border border-[#3b82f6]/50 rounded-md px-3 py-1 text-white text-sm focus:outline-none focus:border-[#3b82f6]"
          >
            <option value="1h">1 Hour</option>
            <option value="24h">24 Hours</option>
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-xs text-gray-400">Total P&L</span>
          </div>
          <div className="text-2xl font-bold text-green-400">${performance.profitLoss.toLocaleString()}</div>
          <div className="text-xs text-gray-500">+12.3% this period</div>
        </div>

        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-gray-400">Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{performance.winRate}%</div>
          <div className="text-xs text-gray-500">{performance.totalTrades} total trades</div>
        </div>

        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-gray-400">Sharpe Ratio</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{performance.sharpeRatio}</div>
          <div className="text-xs text-gray-500">Risk-adjusted return</div>
        </div>

        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-orange-400" />
            <span className="text-xs text-gray-400">Active Positions</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">{performance.activePositions}</div>
          <div className="text-xs text-gray-500">Currently open</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* P&L Chart */}
        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
          <h3 className="text-lg font-semibold text-white mb-4">P&L Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="pnl" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Trade Distribution */}
        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
          <h3 className="text-lg font-semibold text-white mb-4">Trade Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={tradeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {tradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {tradeDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-400">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategy Performance */}
      <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a] mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Strategy Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#374151]">
                <th className="text-left py-2 text-gray-400">Strategy</th>
                <th className="text-right py-2 text-gray-400">Trades</th>
                <th className="text-right py-2 text-gray-400">Win Rate</th>
                <th className="text-right py-2 text-gray-400">P&L</th>
                <th className="text-right py-2 text-gray-400">Performance</th>
              </tr>
            </thead>
            <tbody>
              {strategyPerformance.map((strategy, index) => (
                <tr key={index} className="border-b border-[#374151]/50">
                  <td className="py-3 text-white font-medium">{strategy.strategy}</td>
                  <td className="py-3 text-right text-gray-300">{strategy.trades}</td>
                  <td className="py-3 text-right text-blue-400 font-semibold">{strategy.winRate}%</td>
                  <td className="py-3 text-right text-green-400 font-semibold">${strategy.pnl.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {strategy.winRate > 80 ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : strategy.winRate > 70 ? (
                        <Activity className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`text-xs ${
                        strategy.winRate > 80 ? 'text-green-400' : 
                        strategy.winRate > 70 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {strategy.winRate > 80 ? 'Excellent' : 
                         strategy.winRate > 70 ? 'Good' : 'Needs Review'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {riskMetrics.map((metric, index) => (
          <div key={index} className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{metric.metric}</span>
              <div className={`flex items-center gap-1 ${getStatusColor(metric.status)}`}>
                {getStatusIcon(metric.status)}
              </div>
            </div>
            <div className="text-xl font-bold text-white">{metric.value}</div>
            <div className="text-xs text-gray-500">
              {metric.status === 'excellent' ? 'Outstanding performance' :
               metric.status === 'good' ? 'Good performance' :
               metric.status === 'warning' ? 'Monitor closely' : 'Requires attention'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIPerformanceDashboard;
