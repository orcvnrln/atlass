import React, { useState } from 'react';
import { BarChart3, Play, Download, Share, TrendingUp, TrendingDown, Target, Shield, Clock, DollarSign } from 'lucide-react';

interface BacktestResult {
  totalReturn: number;
  annualizedReturn: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  drawdownRecovery: number;
  calmarRatio: number;
  totalTrades: number;
  avgHoldTime: number;
  bestTrade: number;
  worstTrade: number;
  consecutiveWins: number;
  consecutiveLosses: number;
}

interface Trade {
  id: string;
  date: string;
  signal: 'LONG' | 'SHORT';
  entry: number;
  exit: number;
  riskReward: number;
  pnl: number;
  holdTime: number;
}

const BacktestTab: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [parameters, setParameters] = useState({
    asset: 'BTC-USD',
    timeframe: '1h',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    initialCapital: 10000,
    positionSize: 0.1,
    positionSizeType: 'fixed',
    slippage: 0.05,
    commission: 0.05,
  });

  const [results, setResults] = useState<BacktestResult | null>(null);

  // Mock backtest results
  const mockResults: BacktestResult = {
    totalReturn: 18.4,
    annualizedReturn: 74.5,
    winRate: 62.3,
    avgWin: 38.20,
    avgLoss: -15.80,
    profitFactor: 2.42,
    sharpeRatio: 1.75,
    sortinoRatio: 2.31,
    maxDrawdown: -8.2,
    drawdownRecovery: 3.2,
    calmarRatio: 2.24,
    totalTrades: 75,
    avgHoldTime: 2.4,
    bestTrade: 520,
    worstTrade: -380,
    consecutiveWins: 7,
    consecutiveLosses: 3,
  };

  const mockTrades: Trade[] = [
    {
      id: '75',
      date: 'Oct 1',
      signal: 'LONG',
      entry: 27400,
      exit: 28100,
      riskReward: 2.1,
      pnl: 420,
      holdTime: 1.2,
    },
    {
      id: '74',
      date: 'Oct 2',
      signal: 'SHORT',
      entry: 28050,
      exit: 27800,
      riskReward: 1.8,
      pnl: -125,
      holdTime: 0.8,
    },
    {
      id: '73',
      date: 'Oct 3',
      signal: 'LONG',
      entry: 27600,
      exit: 28400,
      riskReward: 3.2,
      pnl: 640,
      holdTime: 2.1,
    },
  ];

  const runBacktest = async () => {
    setIsRunning(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResults(mockResults);
    setIsRunning(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 size={24} className="text-blue-400" />
          Institutional Backtest Engine
        </h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300">
            <Download size={16} />
            Export Report
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300">
            <Share size={16} />
            Share Link
          </button>
        </div>
      </div>

      {/* Input Parameters */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4">Input Parameters</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-400 block mb-1">Asset</label>
            <select
              value={parameters.asset}
              onChange={(e) => setParameters({ ...parameters, asset: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
            >
              <option value="BTC-USD">BTC-USD</option>
              <option value="ETH-USD">ETH-USD</option>
              <option value="EUR-USD">EUR-USD</option>
              <option value="SPY">SPY</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">Timeframe</label>
            <select
              value={parameters.timeframe}
              onChange={(e) => setParameters({ ...parameters, timeframe: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
            >
              <option value="15m">15m</option>
              <option value="1h">1h</option>
              <option value="4h">4h</option>
              <option value="1d">1d</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">Strategy</label>
            <select className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100">
              <option value="ai-signals">AI Signals</option>
              <option value="momentum">Momentum</option>
              <option value="mean-reversion">Mean Reversion</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">Start Date</label>
            <input
              type="date"
              value={parameters.startDate}
              onChange={(e) => setParameters({ ...parameters, startDate: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">End Date</label>
            <input
              type="date"
              value={parameters.endDate}
              onChange={(e) => setParameters({ ...parameters, endDate: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">Initial Capital</label>
            <input
              type="number"
              value={parameters.initialCapital}
              onChange={(e) => setParameters({ ...parameters, initialCapital: Number(e.target.value) })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">Position Size</label>
            <input
              type="number"
              step="0.01"
              value={parameters.positionSize}
              onChange={(e) => setParameters({ ...parameters, positionSize: Number(e.target.value) })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">Slippage (%)</label>
            <input
              type="number"
              step="0.01"
              value={parameters.slippage}
              onChange={(e) => setParameters({ ...parameters, slippage: Number(e.target.value) })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 block mb-1">Commission (%)</label>
            <input
              type="number"
              step="0.01"
              value={parameters.commission}
              onChange={(e) => setParameters({ ...parameters, commission: Number(e.target.value) })}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={runBacktest}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold"
          >
            <Play size={16} />
            {isRunning ? 'Running...' : 'Run Backtest'}
          </button>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300">
            Load Preset
          </button>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300">
            Save Config
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-slate-100 mb-4">Performance Metrics (90 trading days)</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">+{results.totalReturn}%</div>
                <div className="text-sm text-slate-400">Total Return</div>
                <div className="text-xs text-slate-500">${(parameters.initialCapital * results.totalReturn / 100).toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">+{results.annualizedReturn}%</div>
                <div className="text-sm text-slate-400">Annualized Return</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{results.winRate}%</div>
                <div className="text-sm text-slate-400">Win Rate</div>
                <div className="text-xs text-slate-500">47 wins / {results.totalTrades} trades</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{results.profitFactor}</div>
                <div className="text-sm text-slate-400">Profit Factor</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{results.sharpeRatio}</div>
                <div className="text-sm text-slate-400">Sharpe Ratio</div>
                <div className="text-xs text-slate-500">excellent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{results.sortinoRatio}</div>
                <div className="text-sm text-slate-400">Sortino Ratio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{results.maxDrawdown}%</div>
                <div className="text-sm text-slate-400">Max Drawdown</div>
                <div className="text-xs text-slate-500">${(parameters.initialCapital * Math.abs(results.maxDrawdown) / 100).toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{results.calmarRatio}</div>
                <div className="text-sm text-slate-400">Calmar Ratio</div>
              </div>
            </div>
          </div>

          {/* Trade Analysis */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-slate-100 mb-4">Trade Analysis</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-100">{results.totalTrades}</div>
                <div className="text-sm text-slate-400">Total Trades</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{results.avgHoldTime}h</div>
                <div className="text-sm text-slate-400">Avg Hold Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">+${results.bestTrade}</div>
                <div className="text-sm text-slate-400">Best Trade</div>
                <div className="text-xs text-slate-500">+5.2%</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">-${Math.abs(results.worstTrade)}</div>
                <div className="text-sm text-slate-400">Worst Trade</div>
                <div className="text-xs text-slate-500">-3.8%</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{results.consecutiveWins}</div>
                <div className="text-sm text-slate-400">Consecutive Wins</div>
                <div className="text-xs text-slate-500">best streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{results.consecutiveLosses}</div>
                <div className="text-sm text-slate-400">Consecutive Losses</div>
                <div className="text-xs text-slate-500">worst streak</div>
              </div>
            </div>
          </div>

          {/* Trade List */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-slate-100 mb-4">Recent Trades</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="text-left py-2">#</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Signal</th>
                    <th className="text-right py-2">Entry</th>
                    <th className="text-right py-2">Exit</th>
                    <th className="text-right py-2">R:R</th>
                    <th className="text-right py-2">P&L</th>
                    <th className="text-right py-2">Hold</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTrades.map((trade) => (
                    <tr key={trade.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                      <td className="py-2 text-slate-400">{trade.id}</td>
                      <td className="py-2 text-slate-100">{trade.date}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          trade.signal === 'LONG' 
                            ? 'text-emerald-400 bg-emerald-500/10' 
                            : 'text-red-400 bg-red-500/10'
                        }`}>
                          {trade.signal}
                        </span>
                      </td>
                      <td className="py-2 text-right font-mono text-slate-300">{trade.entry.toLocaleString()}</td>
                      <td className="py-2 text-right font-mono text-slate-300">{trade.exit.toLocaleString()}</td>
                      <td className="py-2 text-right font-mono text-slate-300">1:{trade.riskReward}</td>
                      <td className={`py-2 text-right font-mono font-bold ${
                        trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                      </td>
                      <td className="py-2 text-right text-slate-400">{trade.holdTime}h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Equity Curve Placeholder */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-slate-100 mb-4">Equity Curve</h4>
            <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
              <div className="text-center text-slate-400">
                <BarChart3 size={48} className="mx-auto mb-2" />
                <p>Equity curve chart will be displayed here</p>
                <p className="text-sm">Line chart showing daily balance progression</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BacktestTab;
