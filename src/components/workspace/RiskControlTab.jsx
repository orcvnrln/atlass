import React, { useState } from 'react';
import { AlertTriangle, Shield, TrendingUp, Activity } from 'lucide-react';

const RiskControlTab = () => {
  const [maxRisk, setMaxRisk] = useState(2);
  const [positionSizeLimit, setPositionSizeLimit] = useState(5);
  const [stopLossBuffer, setStopLossBuffer] = useState(0.5);
  const [marginAlert, setMarginAlert] = useState(true);

  const totalExposure = 125430.50;
  const accountBalance = 500000;
  const exposurePercent = ((totalExposure / accountBalance) * 100).toFixed(2);

  const handleEmergencyStop = () => {
    console.log('Emergency stop triggered - closing all positions');
  };

  return (
    <div className="space-y-3">
      {/* Risk Parameters */}
      <div className="grid grid-cols-2 gap-3">
        {/* Max Risk per Trade */}
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500 mb-1.5 block font-medium">
            Max Risk Per Trade (%)
          </label>
          <input
            type="number"
            value={maxRisk}
            onChange={(e) => setMaxRisk(parseFloat(e.target.value) || 1)}
            step="0.5"
            max="10"
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2.5 text-slate-100 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                       transition-all duration-200 tabular-nums font-semibold"
          />
        </div>

        {/* Total Exposure (Read-only) */}
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500 mb-1.5 block font-medium">
            Total Exposure ($)
          </label>
          <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded-md px-3 py-2.5 text-slate-100 text-sm font-semibold tabular-nums">
            ${totalExposure.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Position Size Limit Slider */}
      <div>
        <label className="text-xs uppercase tracking-wide text-slate-500 mb-1.5 block font-medium">
          Position Size Limit: <span className="text-slate-100 font-bold">{positionSizeLimit} Lots</span>
        </label>
        <div className="relative">
          <input
            type="range"
            min="1"
            max="20"
            value={positionSizeLimit}
            onChange={(e) => setPositionSizeLimit(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-700/50 rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-4
                       [&::-webkit-slider-thumb]:h-4
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-gradient-to-r
                       [&::-webkit-slider-thumb]:from-blue-400
                       [&::-webkit-slider-thumb]:to-blue-500
                       [&::-webkit-slider-thumb]:shadow-lg
                       [&::-webkit-slider-thumb]:shadow-blue-500/50
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:transition-all
                       [&::-webkit-slider-thumb]:hover:scale-110"
            style={{
              background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${(positionSizeLimit / 20) * 100}%, rgb(51 65 85 / 0.5) ${(positionSizeLimit / 20) * 100}%, rgb(51 65 85 / 0.5) 100%)`
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-600 mt-1.5 font-medium tabular-nums">
          <span>1</span>
          <span>5</span>
          <span>10</span>
          <span>20</span>
        </div>
      </div>

      {/* Stop-Loss Buffer */}
      <div>
        <label className="text-xs uppercase tracking-wide text-slate-500 mb-1.5 block font-medium">
          Stop-Loss Buffer (%)
        </label>
        <input
          type="number"
          value={stopLossBuffer}
          onChange={(e) => setStopLossBuffer(parseFloat(e.target.value) || 0.5)}
          step="0.1"
          max="5"
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2.5 text-slate-100 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                     transition-all duration-200 tabular-nums font-semibold"
        />
      </div>

      {/* Margin Utilization Alert Toggle */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
        <button
          onClick={() => setMarginAlert(!marginAlert)}
          className="w-full flex items-center justify-between group"
        >
          <div className="flex items-center gap-2">
            <Shield size={14} className={marginAlert ? 'text-blue-400' : 'text-slate-500'} />
            <span className="text-xs font-semibold text-slate-300">Margin Utilization Alert</span>
          </div>
          <div className={`w-10 h-5 rounded-full transition-all duration-200 ${marginAlert ? 'bg-blue-500' : 'bg-slate-700'}`}>
            <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-all duration-200 ${marginAlert ? 'ml-5' : 'ml-0.5'}`} />
          </div>
        </button>
      </div>

      {/* Risk Metrics Display */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-3">
        <h5 className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-3">
          Current Risk Metrics
        </h5>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-md p-2">
            <div className="text-xs text-slate-500 mb-1">P/L</div>
            <div className="text-sm font-bold text-emerald-400 tabular-nums">+$12,450</div>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-md p-2">
            <div className="text-xs text-slate-500 mb-1">Win Rate</div>
            <div className="text-sm font-bold text-slate-100 tabular-nums">76%</div>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-md p-2">
            <div className="text-xs text-slate-500 mb-1">Sharpe</div>
            <div className="text-sm font-bold text-blue-400 tabular-nums">1.86</div>
          </div>
        </div>
      </div>

      {/* Exposure Bar */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wide text-slate-500 font-medium">Capital Exposure</span>
          <span className="text-xs font-bold text-amber-400 tabular-nums">{exposurePercent}%</span>
        </div>
        <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
            style={{ width: `${exposurePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-600 mt-1.5 font-medium">
          <span>Safe</span>
          <span>Moderate</span>
          <span>High</span>
        </div>
      </div>

      {/* Emergency Stop Button */}
      <button
        onClick={handleEmergencyStop}
        className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 
                   hover:from-red-600 hover:to-red-700
                   text-white rounded-lg font-bold text-sm 
                   shadow-lg shadow-red-500/30 hover:shadow-red-500/50
                   transition-all duration-200 hover:scale-[1.02]
                   flex items-center justify-center gap-2"
      >
        <AlertTriangle size={16} strokeWidth={2.5} />
        Emergency Stop All Positions
      </button>

      {/* Warning Message */}
      {exposurePercent > 30 && (
        <div className="flex items-center gap-2 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <Activity size={14} className="text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-500 font-medium">
            High exposure detected. Consider reducing position sizes.
          </p>
        </div>
      )}
    </div>
  );
};

export default RiskControlTab;

