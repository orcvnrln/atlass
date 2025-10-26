import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const RiskPortfolioOverlay = () => {
    const handleEmergencyStop = () => {
        console.log('Emergency stop triggered');
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800/50">
                <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-md">
                    <TrendingUp size={14} className="text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-bold text-slate-100 tracking-wide">
                    Performance Snapshot & Risk Controls
                </h3>
            </div>

            <div className="flex-1 flex flex-col gap-3">
                {/* Performance Metrics - Compact Grid */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-2.5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">P&L</p>
                        <p className="text-lg font-bold text-emerald-400 tabular-nums">+$58,420</p>
                    </div>
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-2.5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">Win Rate</p>
                        <p className="text-lg font-bold text-slate-100 tabular-nums">76%</p>
                    </div>
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-2.5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">Sharpe</p>
                        <p className="text-lg font-bold text-blue-400 tabular-nums">1.86</p>
                    </div>
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-2.5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-medium">Max DD</p>
                        <p className="text-lg font-bold text-red-400 tabular-nums">-8.45%</p>
                    </div>
                </div>

                {/* Risk Utilization Bar */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs uppercase tracking-wide text-slate-500 font-medium">Risk Utilization</span>
                        <span className="text-xs font-bold text-amber-400 tabular-nums">65.2%</span>
                    </div>
                    <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
                            style={{ width: '65.2%' }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-slate-600 mt-1 font-medium tabular-nums">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Emergency Stop Button */}
                <button
                    onClick={handleEmergencyStop}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30
                               border border-red-500/50 hover:border-red-500 text-red-400 hover:text-red-300
                               rounded-lg font-semibold text-sm transition-all duration-200
                               hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30
                               flex items-center justify-center gap-2"
                >
                    <AlertTriangle size={16} strokeWidth={2.5} />
                    Emergency Stop
                </button>

                {/* Seasonal Chart & Technical Gauge - Compact */}
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-2.5">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-2">Seasonal Trend</p>
                    <div className="flex items-center gap-2 text-xs">
                        <div className="flex-1 h-12 bg-slate-900/50 rounded border border-slate-700/30 flex items-end justify-around px-1 pb-1">
                            {[0.6, 0.8, 0.5, 0.9, 0.7, 0.4].map((val, i) => (
                                <div
                                    key={i}
                                    className="w-2 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                                    style={{ height: `${val * 100}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-2.5">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-2">Technical Gauge</p>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 flex items-center gap-1">
                            <div className="flex-1 h-1.5 bg-red-500/30 rounded-l" />
                            <div className="flex-1 h-1.5 bg-slate-600/30" />
                            <div className="flex-1 h-1.5 bg-emerald-500 rounded-r" />
                        </div>
                    </div>
                    <div className="flex justify-between text-xs mt-1.5">
                        <span className="text-red-400 font-medium">Sell</span>
                        <span className="text-slate-500 font-medium">Neutral</span>
                        <span className="text-emerald-400 font-medium">Buy</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskPortfolioOverlay;
