import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const CorrelationMatrix: React.FC = () => {
  const correlations = [
    { pair: 'BTC-ETH', value: 0.82, change: 0.05, status: 'normal' },
    { pair: 'BTC-EUR', value: -0.34, change: -0.45, status: 'anomaly' },
    { pair: 'BTC-US10Y', value: -0.67, change: -0.12, status: 'normal' },
    { pair: 'ETH-EUR', value: -0.28, change: 0.03, status: 'normal' },
    { pair: 'EUR-US10Y', value: 0.45, change: 0.08, status: 'normal' },
  ];

  const getCorrelationColor = (value: number) => {
    if (value >= 0.8) return 'text-green-400';
    if (value >= 0.3) return 'text-green-300';
    if (value >= -0.3) return 'text-slate-400';
    if (value >= -0.8) return 'text-red-300';
    return 'text-red-400';
  };

  const getCorrelationBg = (value: number) => {
    if (value >= 0.8) return 'bg-green-500/20';
    if (value >= 0.3) return 'bg-green-500/10';
    if (value >= -0.3) return 'bg-slate-500/10';
    if (value >= -0.8) return 'bg-red-500/10';
    return 'bg-red-500/20';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={12} className="text-green-400" />;
    if (change < 0) return <TrendingDown size={12} className="text-red-400" />;
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">Real-time Correlation Matrix</h3>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {correlations.map((corr, index) => (
          <div
            key={corr.pair}
            className={`p-3 rounded-lg border transition-all hover:scale-105 ${
              corr.status === 'anomaly'
                ? 'border-yellow-500/50 bg-yellow-500/10'
                : 'border-slate-700 bg-slate-800/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">{corr.pair}</span>
              {corr.status === 'anomaly' && (
                <AlertTriangle size={14} className="text-yellow-400" />
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-lg font-bold ${getCorrelationColor(corr.value)}`}>
                {corr.value > 0 ? '+' : ''}{corr.value.toFixed(2)}
              </span>
              {getChangeIcon(corr.change)}
            </div>
            
            <div className="flex items-center gap-1">
              <div className={`w-full h-1 rounded-full ${getCorrelationBg(corr.value)}`}>
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    corr.value >= 0.8 ? 'bg-green-500' :
                    corr.value >= 0.3 ? 'bg-green-400' :
                    corr.value >= -0.3 ? 'bg-slate-500' :
                    corr.value >= -0.8 ? 'bg-red-400' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.abs(corr.value) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="text-xs text-slate-500 mt-1">
              {corr.change > 0 ? '+' : ''}{corr.change.toFixed(2)} vs normal
            </div>
          </div>
        ))}
      </div>

      {/* Anomaly Alert */}
      <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={16} className="text-yellow-400" />
          <span className="text-sm font-semibold text-yellow-400">Anomaly Alert</span>
        </div>
        <p className="text-sm text-yellow-300">
          EUR correlation changed from +0.11 to -0.34 in last 4h
        </p>
        <p className="text-xs text-yellow-400 mt-1">
          → Suggests market regime shift or decoupling opportunity
        </p>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Strong Positive (+0.8 to +1.0)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-slate-500 rounded"></div>
          <span>Neutral (near 0)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Strong Negative (-0.8 to -1.0)</span>
        </div>
      </div>
    </div>
  );
};

export default CorrelationMatrix;
