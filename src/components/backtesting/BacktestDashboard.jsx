import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import {
  Play, Pause, RotateCcw, Download, Settings, TrendingUp, TrendingDown,
  DollarSign, Percent, Activity, AlertTriangle, CheckCircle, XCircle,
  BarChart3, PieChart, Target, Shield, Zap, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const BacktestDashboard = ({ backtestResults, onRunBacktest, onExport }) => {
  const [selectedMetric, setSelectedMetric] = useState('equity');
  const [timeframe, setTimeframe] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!backtestResults) {
    return (
      <div className="bg-[#1e293b] rounded-xl p-8 border border-[#3b82f6]/30 text-center">
        <BarChart3 className="w-16 h-16 text-[#3b82f6] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Backtest Results</h3>
        <p className="text-gray-400 mb-6">Run a backtest to see performance analytics</p>
        <Button onClick={onRunBacktest} className="bg-[#3b82f6] hover:bg-[#2563eb]">
          <Play className="w-4 h-4 mr-2" />
          Run Backtest
        </Button>
      </div>
    );
  }

  const { metrics, equity, trades } = backtestResults;

  // Prepare equity curve data
  const equityData = equity.map((value, index) => ({
    index,
    equity: value,
    drawdown: ((Math.max(...equity.slice(0, index + 1)) - value) / Math.max(...equity.slice(0, index + 1))) * 100
  }));

  // Prepare trade distribution data
  const tradeDistribution = trades.reduce((acc, trade) => {
    const pnlBucket = Math.floor(trade.pnlPercent / 5) * 5;
    acc[pnlBucket] = (acc[pnlBucket] || 0) + 1;
    return acc;
  }, {});

  const distributionData = Object.entries(tradeDistribution)
    .map(([bucket, count]) => ({
      bucket: `${bucket}%`,
      count,
      bucketValue: parseFloat(bucket)
    }))
    .sort((a, b) => a.bucketValue - b.bucketValue);

  // Monthly returns
  const monthlyReturns = calculateMonthlyReturns(trades);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Backtest Performance Analytics</h2>
            <p className="text-gray-400">Comprehensive strategy performance analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onRunBacktest}
              className="bg-[#3b82f6] hover:bg-[#2563eb]"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Re-run
            </Button>
            <Button
              onClick={onExport}
              variant="outline"
              className="border-[#3b82f6]/50 text-white hover:bg-[#3b82f6]/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={DollarSign}
          label="Total P&L"
          value={`$${metrics.totalPnl?.toFixed(2) || 0}`}
          change={metrics.totalReturn}
          positive={metrics.totalPnl > 0}
        />
        <MetricCard
          icon={Percent}
          label="Win Rate"
          value={`${metrics.winRate?.toFixed(1) || 0}%`}
          subtitle={`${metrics.winningTrades}/${metrics.totalTrades} trades`}
          positive={metrics.winRate > 50}
        />
        <MetricCard
          icon={Activity}
          label="Sharpe Ratio"
          value={metrics.sharpeRatio?.toFixed(2) || 0}
          subtitle="Risk-adjusted return"
          positive={metrics.sharpeRatio > 1}
        />
        <MetricCard
          icon={TrendingDown}
          label="Max Drawdown"
          value={`${metrics.maxDrawdown?.percent?.toFixed(2) || 0}%`}
          subtitle="Peak to trough"
          positive={false}
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <SmallMetricCard
          label="Profit Factor"
          value={metrics.profitFactor?.toFixed(2) || 0}
          icon={Target}
        />
        <SmallMetricCard
          label="Avg Win"
          value={`$${metrics.avgWin?.toFixed(2) || 0}`}
          icon={TrendingUp}
        />
        <SmallMetricCard
          label="Avg Loss"
          value={`$${metrics.avgLoss?.toFixed(2) || 0}`}
          icon={TrendingDown}
        />
        <SmallMetricCard
          label="Expectancy"
          value={`$${metrics.expectancy?.toFixed(2) || 0}`}
          icon={Zap}
        />
        <SmallMetricCard
          label="Calmar Ratio"
          value={metrics.calmarRatio?.toFixed(2) || 0}
          icon={Shield}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equity Curve */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
          <h3 className="text-lg font-semibold text-white mb-4">Equity Curve</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={equityData}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Area
                type="monotone"
                dataKey="equity"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#equityGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Drawdown Chart */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
          <h3 className="text-lg font-semibold text-white mb-4">Drawdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={equityData}>
              <defs>
                <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="index" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Area
                type="monotone"
                dataKey="drawdown"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#drawdownGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Trade Distribution */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
          <h3 className="text-lg font-semibold text-white mb-4">Trade P&L Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="bucket" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {distributionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.bucketValue >= 0 ? '#10b981' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Returns */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Returns</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyReturns}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="return" radius={[4, 4, 0, 0]}>
                {monthlyReturns.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.return >= 0 ? '#10b981' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trade List */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-[#3b82f6]/30">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#3b82f6]/30">
                <th className="text-left text-gray-400 font-medium py-3 px-4">Entry</th>
                <th className="text-left text-gray-400 font-medium py-3 px-4">Exit</th>
                <th className="text-left text-gray-400 font-medium py-3 px-4">Side</th>
                <th className="text-right text-gray-400 font-medium py-3 px-4">P&L</th>
                <th className="text-right text-gray-400 font-medium py-3 px-4">P&L %</th>
                <th className="text-right text-gray-400 font-medium py-3 px-4">Duration</th>
              </tr>
            </thead>
            <tbody>
              {trades.slice(-10).reverse().map((trade, index) => (
                <tr key={index} className="border-b border-[#3b82f6]/10 hover:bg-[#3b82f6]/5">
                  <td className="py-3 px-4 text-white">${trade.entryPrice?.toFixed(2)}</td>
                  <td className="py-3 px-4 text-white">${trade.exitPrice?.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trade.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trade.side?.toUpperCase()}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ${trade.pnl?.toFixed(2)}
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    trade.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.pnlPercent?.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-right text-gray-400">
                    {formatDuration(trade.duration)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const MetricCard = ({ icon: Icon, label, value, change, subtitle, positive }) => (
  <div className="bg-[#0f172a] rounded-lg p-4 border border-[#3b82f6]/30">
    <div className="flex items-center justify-between mb-2">
      <Icon className={`w-5 h-5 ${positive ? 'text-green-400' : 'text-red-400'}`} />
      {change !== undefined && (
        <span className={`text-sm font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {positive ? '+' : ''}{change?.toFixed(2)}%
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-gray-400">{subtitle || label}</div>
  </div>
);

const SmallMetricCard = ({ label, value, icon: Icon }) => (
  <div className="bg-[#0f172a] rounded-lg p-3 border border-[#3b82f6]/20">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4 text-[#3b82f6]" />
      <span className="text-xs text-gray-400">{label}</span>
    </div>
    <div className="text-lg font-bold text-white">{value}</div>
  </div>
);

// Helper Functions
const calculateMonthlyReturns = (trades) => {
  const monthlyData = {};
  
  trades.forEach(trade => {
    const date = new Date(trade.exitTime);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { pnl: 0, trades: 0 };
    }
    
    monthlyData[monthKey].pnl += trade.pnl;
    monthlyData[monthKey].trades += 1;
  });

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      return: data.pnl,
      trades: data.trades
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

const formatDuration = (ms) => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export default BacktestDashboard;

