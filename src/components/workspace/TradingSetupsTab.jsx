import React from 'react';
import { ArrowUpRight, ArrowDownRight, Target, Shield, TrendingUp } from 'lucide-react';

const TradingSetupsTab = ({ onSetupClick }) => {
  const setups = [
    {
      id: 1,
      name: 'Trend-Follow Breakout',
      score: 92,
      symbol: 'EUR/USD',
      timeframe: '4H',
      condition: 'Breakout above 20EMA + volume spike > 1.5x avg',
      entry: 1.17429,
      sl: 1.16850,
      tp: 1.18590,
      rrRatio: '1:4.5',
      confidence: 'High'
    },
    {
      id: 2,
      name: 'Mean Reversion Play',
      score: 87,
      symbol: 'EUR/USD',
      timeframe: '1H',
      condition: 'RSI < 30 + price touches lower Bollinger Band',
      entry: 1.17200,
      sl: 1.17050,
      tp: 1.17650,
      rrRatio: '1:3.0',
      confidence: 'Medium'
    },
    {
      id: 3,
      name: 'Momentum Continuation',
      score: 89,
      symbol: 'EUR/USD',
      timeframe: '15M',
      condition: 'Strong bullish candle + MACD crossover + volume confirmation',
      entry: 1.17380,
      sl: 1.17280,
      tp: 1.17680,
      rrRatio: '1:3.0',
      confidence: 'High'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-slate-100">AI-Generated Setups</h4>
        <div className="text-xs text-slate-500">{setups.length} Active Opportunities</div>
      </div>

      {setups.map((setup) => (
        <div
          key={setup.id}
          onClick={() => onSetupClick && onSetupClick(setup)}
          className="bg-slate-900 border border-slate-800/30 rounded-lg p-3 
                     hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 
                     hover:scale-[1.01] transition-all duration-200 cursor-pointer"
        >
          {/* Header: Strategy Name + Score */}
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm font-semibold text-slate-100">{setup.name}</h5>
            <div className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-md">
              <span className="text-xs font-bold text-emerald-400">{setup.score}/100</span>
            </div>
          </div>

          {/* Symbol & Timeframe */}
          <div className="text-xs text-slate-400 mb-2 font-medium">
            {setup.symbol} • {setup.timeframe}
          </div>

          {/* Condition */}
          <div className="text-xs text-slate-500 mb-3 leading-relaxed">
            {setup.condition}
          </div>

          {/* Entry, SL, TP */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Target size={12} className="text-amber-500" />
                <span className="text-slate-500">Entry:</span>
                <span className="text-xs text-slate-600 bg-slate-800/50 px-1 rounded">AI Suggestion</span>
              </div>
              <span className="font-semibold text-amber-500 tabular-nums">{setup.entry.toFixed(5)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <ArrowDownRight size={12} className="text-red-500" />
                <span className="text-slate-500">SL:</span>
                <span className="text-xs text-slate-600 bg-slate-800/50 px-1 rounded">AI Suggestion</span>
              </div>
              <span className="font-semibold text-red-500 tabular-nums">{setup.sl.toFixed(5)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <ArrowUpRight size={12} className="text-emerald-500" />
                <span className="text-slate-500">TP:</span>
                <span className="text-xs text-slate-600 bg-slate-800/50 px-1 rounded">AI Suggestion</span>
              </div>
              <span className="font-semibold text-emerald-500 tabular-nums">{setup.tp.toFixed(5)}</span>
            </div>
          </div>

          {/* R:R Ratio & Confidence */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">R:R Ratio:</span>
              <span className="text-xs font-bold text-blue-400 tabular-nums">{setup.rrRatio}</span>
            </div>
            <div className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
              setup.confidence === 'High' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {setup.confidence}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TradingSetupsTab;

