import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Filter, Download, Search } from 'lucide-react';

interface SignalHistory {
  id: string;
  date: string;
  time: string;
  asset: string;
  signal: 'LONG' | 'SHORT' | 'NEUTRAL';
  confidence: number;
  entry: number;
  status: 'Open' | 'Closed';
  pnl: number;
  pnlPercent: number;
  holdTime?: string;
}

const SignalsHistoryTab: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Confidence');
  const [searchQuery, setSearchQuery] = useState('');

  const signals: SignalHistory[] = [
    {
      id: '1',
      date: '2025-01-13',
      time: '21:15:42',
      asset: 'BTC-USD',
      signal: 'LONG',
      confidence: 87,
      entry: 42150,
      status: 'Open',
      pnl: 320,
      pnlPercent: 1.9,
      holdTime: '2h',
    },
    {
      id: '2',
      date: '2025-01-13',
      time: '18:45:00',
      asset: 'EUR-USD',
      signal: 'SHORT',
      confidence: 72,
      entry: 1.0945,
      status: 'Closed',
      pnl: -42,
      pnlPercent: -0.4,
      holdTime: '1.5h',
    },
    {
      id: '3',
      date: '2025-01-13',
      time: '15:30:22',
      asset: 'SPY',
      signal: 'LONG',
      confidence: 81,
      entry: 445.20,
      status: 'Closed',
      pnl: 892,
      pnlPercent: 2.0,
      holdTime: '3.2h',
    },
    {
      id: '4',
      date: '2025-01-13',
      time: '12:15:18',
      asset: 'ETH-USD',
      signal: 'LONG',
      confidence: 79,
      entry: 2340,
      status: 'Closed',
      pnl: 156,
      pnlPercent: 1.2,
      holdTime: '2.8h',
    },
    {
      id: '5',
      date: '2025-01-13',
      time: '09:30:45',
      asset: 'GBP-USD',
      signal: 'SHORT',
      confidence: 68,
      entry: 1.2640,
      status: 'Closed',
      pnl: -78,
      pnlPercent: -0.6,
      holdTime: '1.2h',
    },
  ];

  const filteredSignals = signals.filter(signal => {
    const matchesFilter = filter === 'All' || signal.status === filter;
    const matchesSearch = signal.asset.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedSignals = [...filteredSignals].sort((a, b) => {
    switch (sortBy) {
      case 'Confidence':
        return b.confidence - a.confidence;
      case 'P&L':
        return b.pnl - a.pnl;
      case 'Date':
        return new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime();
      default:
        return 0;
    }
  });

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'LONG': return 'text-emerald-400 bg-emerald-500/10';
      case 'SHORT': return 'text-red-400 bg-red-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-blue-400 bg-blue-500/10';
      case 'Closed': return 'text-slate-400 bg-slate-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-xl font-bold text-slate-100">Recent Signals (Last 50)</h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100"
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100"
          >
            <option value="Confidence">Confidence</option>
            <option value="P&L">P&L</option>
            <option value="Date">Date</option>
          </select>
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Signals Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="text-left py-3 px-4">Date/Time</th>
                <th className="text-left py-3 px-4">Asset</th>
                <th className="text-left py-3 px-4">Signal</th>
                <th className="text-right py-3 px-4">Conf</th>
                <th className="text-right py-3 px-4">Entry</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">P&L</th>
                <th className="text-right py-3 px-4">Hold Time</th>
              </tr>
            </thead>
            <tbody>
              {sortedSignals.map((signal) => (
                <tr key={signal.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="py-3 px-4">
                    <div className="text-slate-100">{signal.date}</div>
                    <div className="text-xs text-slate-500">{signal.time}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-100">{signal.asset}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getSignalColor(signal.signal)}`}>
                      {signal.signal}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold text-slate-100">{signal.confidence}%</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300">
                    {signal.asset.includes('USD') && !signal.asset.includes('/') 
                      ? `$${signal.entry.toLocaleString()}`
                      : signal.entry.toFixed(4)
                    }
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(signal.status)}`}>
                      {signal.status}
                    </span>
                    {signal.status === 'Open' && signal.holdTime && (
                      <div className="text-xs text-slate-500 mt-1">({signal.holdTime})</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className={`font-bold ${signal.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {signal.pnl >= 0 ? '+' : ''}${signal.pnl.toLocaleString()}
                    </div>
                    <div className={`text-xs ${signal.pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ({signal.pnlPercent >= 0 ? '+' : ''}{signal.pnlPercent}%)
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400">
                    {signal.holdTime || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-slate-900 px-4 py-3 border-t border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-slate-400">
            <div>Showing {sortedSignals.length} of {signals.length} signals</div>
            <div className="flex items-center gap-4">
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
              <div className="flex items-center gap-2">
                <span>Page 1 of 1</span>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">62%</div>
          <div className="text-sm text-slate-400">Win Rate</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">1.75</div>
          <div className="text-sm text-slate-400">Sharpe Ratio</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">2.4h</div>
          <div className="text-sm text-slate-400">Avg Hold Time</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">2.42</div>
          <div className="text-sm text-slate-400">Profit Factor</div>
        </div>
      </div>
    </div>
  );
};

export default SignalsHistoryTab;
