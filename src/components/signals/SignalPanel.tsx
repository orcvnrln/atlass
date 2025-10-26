import React, { useState } from 'react';
import { Signal } from '../../types/trading';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, Target, Shield, Zap, Activity } from 'lucide-react';

interface SignalPanelProps {
  signal: Signal;
  loading: boolean;
}

const SignalPanel: React.FC<SignalPanelProps> = ({ signal, loading }) => {
  const [expandRationale, setExpandRationale] = useState(true);
  const [expandRisk, setExpandRisk] = useState(false);
  const [expandExecution, setExpandExecution] = useState(false);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="text-slate-400">Loading signal...</div>
      </div>
    );
  }

  const signalColor = {
    LONG: 'text-emerald-500',
    SHORT: 'text-red-500',
    NEUTRAL: 'text-gray-500',
  }[signal.signal];

  const signalBgColor = {
    LONG: 'bg-emerald-500/10 border-emerald-500/20',
    SHORT: 'bg-red-500/10 border-red-500/20',
    NEUTRAL: 'bg-gray-500/10 border-gray-500/20',
  }[signal.signal];

  const riskReward = (
    (signal.takeProfit - signal.entry) /
    (signal.entry - signal.stopLoss)
  ).toFixed(2);

  const entryPercent = ((signal.stopLoss / signal.entry - 1) * 100).toFixed(2);
  const tp1Percent = ((signal.takeProfit / signal.entry - 1) * 100).toFixed(2);
  const tp2Percent = signal.takeProfit2 ? ((signal.takeProfit2 / signal.entry - 1) * 100).toFixed(2) : null;
  const tp3Percent = signal.takeProfit3 ? ((signal.takeProfit3 / signal.entry - 1) * 100).toFixed(2) : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-100">{signal.asset}</h3>
          <span className="text-sm text-slate-400">{signal.timeframe} Live</span>
        </div>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${signalBgColor}`}>
          {signal.signal === 'LONG' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className={signalColor}>SIGNAL: {signal.signal}</span>
        </div>
      </div>

      {/* Confidence & Scores */}
      <div className="p-6 border-b border-slate-800">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-400">Confidence</span>
              <span className="font-bold text-lg">{(signal.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${signal.confidence * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap size={14} className="text-emerald-400" />
                <span className="text-xs text-slate-400">Smart Money</span>
              </div>
              <div className="text-emerald-500 font-bold">{signal.riskMetrics.smartMoneyScore}/10 ✓</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Activity size={14} className="text-blue-400" />
                <span className="text-xs text-slate-400">News Sentiment</span>
              </div>
              <div className="text-blue-400 font-bold">+{signal.riskMetrics.newsSentiment.toFixed(2)}</div>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target size={14} className="text-purple-400" />
              <span className="text-xs text-slate-400">Volume Strength</span>
            </div>
            <div className="text-purple-400 font-bold">{signal.riskMetrics.volumeStrength}/10</div>
          </div>
        </div>
      </div>

      {/* Price Levels */}
      <div className="p-6 border-b border-slate-800">
        <h4 className="text-sm font-semibold text-slate-100 mb-4">Price Levels</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Entry</span>
            <span className="font-mono font-bold text-slate-100">${signal.entry.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">SL</span>
            <span className="font-mono text-red-500">
              ${signal.stopLoss.toLocaleString()} ({entryPercent}%)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">TP1</span>
            <span className="font-mono text-emerald-500">
              ${signal.takeProfit.toLocaleString()} (+{tp1Percent}%)
            </span>
          </div>
          {signal.takeProfit2 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">TP2</span>
              <span className="font-mono text-emerald-500">
                ${signal.takeProfit2.toLocaleString()} (+{tp2Percent}%)
              </span>
            </div>
          )}
          {signal.takeProfit3 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">TP3</span>
              <span className="font-mono text-emerald-500">
                ${signal.takeProfit3.toLocaleString()} (+{tp3Percent}%)
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-slate-700">
            <span className="text-sm text-slate-400">R:R</span>
            <span className="font-bold text-lg">1:{riskReward}</span>
          </div>
        </div>
      </div>

      {/* Probability Analysis */}
      <div className="p-6 border-b border-slate-800">
        <h4 className="text-sm font-semibold text-slate-100 mb-4">Probability (Next 24h)</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-center">
            <div className="text-slate-400 text-xs">TP1 Hit</div>
            <div className="text-emerald-400 font-bold">68%</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400 text-xs">TP2 Hit</div>
            <div className="text-emerald-400 font-bold">42%</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400 text-xs">TP3 Hit</div>
            <div className="text-emerald-400 font-bold">18%</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400 text-xs">SL Hit</div>
            <div className="text-red-400 font-bold">12%</div>
          </div>
        </div>
      </div>

      {/* Rationale */}
      <div className="p-6 border-b border-slate-800">
        <button
          onClick={() => setExpandRationale(!expandRationale)}
          className="w-full text-left flex justify-between items-center py-2 hover:bg-slate-800 rounded px-2 -mx-2"
        >
          <span className="font-bold text-sm">Top 3 Reasons</span>
          {expandRationale ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {expandRationale && (
          <div className="space-y-4 mt-4">
            {signal.rationale.map((reason, idx) => (
              <div key={idx} className="border-l-2 border-emerald-500 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">{idx + 1}. {reason.feature}</span>
                  <span className="text-xs text-emerald-400 font-bold">
                    {(reason.impact * 100).toFixed(0)}% impact
                  </span>
                </div>
                <p className="text-sm font-mono text-slate-200 mb-1">{reason.value}</p>
                <p className="text-xs text-slate-500">{reason.interpretation}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Risk Metrics */}
      <div className="p-6 border-b border-slate-800">
        <button
          onClick={() => setExpandRisk(!expandRisk)}
          className="w-full text-left flex justify-between items-center py-2 hover:bg-slate-800 rounded px-2 -mx-2"
        >
          <span className="font-bold text-sm">Risk Metrics</span>
          {expandRisk ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {expandRisk && (
          <div className="space-y-3 mt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Expected Slippage</span>
              <span>{signal.riskMetrics.expectedSlippage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Recommended Size</span>
              <span>{signal.riskMetrics.recommendedSize} BTC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Liquidity Score</span>
              <span className="text-emerald-500">{signal.riskMetrics.liquidityScore}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Max Leverage</span>
              <span>{signal.riskMetrics.maxLeverage}x</span>
            </div>
          </div>
        )}
      </div>

      {/* Execution Metrics */}
      <div className="p-6">
        <button
          onClick={() => setExpandExecution(!expandExecution)}
          className="w-full text-left flex justify-between items-center py-2 hover:bg-slate-800 rounded px-2 -mx-2"
        >
          <span className="font-bold text-sm">Execution Metrics</span>
          {expandExecution ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {expandExecution && (
          <div className="space-y-3 mt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Position Value</span>
              <span>${(signal.riskMetrics.recommendedSize * signal.entry).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Risk per Trade</span>
              <span>${(signal.riskMetrics.recommendedSize * (signal.entry - signal.stopLoss)).toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Expected Slippage Cost</span>
              <span>${(signal.riskMetrics.recommendedSize * signal.entry * signal.riskMetrics.expectedSlippage / 100).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-slate-800">
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <TrendingUp size={16} />
            BUY
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <TrendingDown size={16} />
            SELL
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-sm font-medium">
            Details
          </button>
          <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-sm font-medium">
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignalPanel;
