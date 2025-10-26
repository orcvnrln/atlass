import React, { useState } from 'react';
import { Plus, X, Copy, Code } from 'lucide-react';

const StrategyBuilderTab = () => {
  const [strategyName, setStrategyName] = useState('');
  const [riskPerTrade, setRiskPerTrade] = useState(1);
  const [activeRules, setActiveRules] = useState([]);

  const availableRules = [
    { id: 'ema', name: 'Price Above EMA', params: 'period=14' },
    { id: 'volume', name: 'Volume Spike', params: 'threshold=1.5x' },
    { id: 'breakout', name: 'Breakout', params: 'level=resistance' },
    { id: 'rsi', name: 'RSI Oversold', params: 'threshold=30' },
    { id: 'macd', name: 'MACD Crossover', params: 'fast=12, slow=26' },
    { id: 'bb', name: 'Bollinger Bands', params: 'period=20, std=2' }
  ];

  const addRule = (rule) => {
    if (!activeRules.find(r => r.id === rule.id)) {
      setActiveRules([...activeRules, rule]);
    }
  };

  const removeRule = (ruleId) => {
    setActiveRules(activeRules.filter(r => r.id !== ruleId));
  };

  const generateCode = () => {
    if (activeRules.length === 0) return '// Add rules to generate strategy code';
    
    let code = `// ${strategyName || 'Custom Strategy'}\n`;
    code += `// Risk per trade: ${riskPerTrade}%\n\n`;
    code += `function checkEntry() {\n`;
    activeRules.forEach(rule => {
      code += `  if (${rule.name.toLowerCase().replace(/\s+/g, '_')}(${rule.params})) {\n`;
    });
    code += `    return true;\n`;
    activeRules.forEach(() => {
      code += `  }\n`;
    });
    code += `  return false;\n}\n`;
    return code;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode());
  };

  return (
    <div className="space-y-3">
      {/* Strategy Name & Risk Input */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500 mb-1.5 block font-medium">
            Strategy Name
          </label>
          <input
            type="text"
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
            placeholder="My Custom Strategy"
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2 text-slate-100 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                       transition-all duration-200"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500 mb-1.5 block font-medium">
            Risk Per Trade (%)
          </label>
          <input
            type="number"
            value={riskPerTrade}
            onChange={(e) => setRiskPerTrade(parseFloat(e.target.value) || 1)}
            step="0.5"
            max="10"
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2 text-slate-100 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                       transition-all duration-200 tabular-nums"
          />
        </div>
      </div>

      {/* Available Rules & Active Rules */}
      <div className="grid grid-cols-2 gap-3">
        {/* Available Rules */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-3">
          <h5 className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-2">
            Available Rules
          </h5>
          <div className="space-y-1.5">
            {availableRules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-2 bg-slate-800/30 rounded-md
                           hover:bg-slate-800/50 transition-all duration-150"
              >
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-200">{rule.name}</div>
                  <div className="text-xs text-slate-500">{rule.params}</div>
                </div>
                <button
                  onClick={() => addRule(rule)}
                  className="p-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded
                             transition-all duration-150"
                >
                  <Plus size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Active Rules */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-3">
          <h5 className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-2">
            Active Rules
          </h5>
          {activeRules.length === 0 ? (
            <div className="text-xs text-slate-600 text-center py-8">
              No rules added yet
            </div>
          ) : (
            <div className="space-y-1.5">
              {activeRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-md"
                >
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-emerald-300">{rule.name}</div>
                    <div className="text-xs text-emerald-500/70">{rule.params}</div>
                  </div>
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="p-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded
                               transition-all duration-150"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Generated Code Preview */}
      <div className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Code size={14} className="text-blue-400" />
            <h5 className="text-xs uppercase tracking-wide text-slate-500 font-medium">
              Generated Code Preview
            </h5>
          </div>
          <button
            onClick={copyCode}
            className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-semibold rounded
                       transition-all duration-150 flex items-center gap-1"
          >
            <Copy size={12} />
            Copy Code
          </button>
        </div>
        <pre className="bg-slate-950/50 border border-slate-800/30 rounded p-3 text-xs text-slate-300 font-mono overflow-x-auto">
          {generateCode()}
        </pre>
      </div>

      {/* Position Size Calculator */}
      {activeRules.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <div className="text-xs text-blue-400 font-semibold mb-1">Auto-Calculated Position Size</div>
          <div className="text-sm text-slate-100 font-bold tabular-nums">
            0.{(riskPerTrade * 10).toFixed(0)} lots
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Based on {riskPerTrade}% risk per trade
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyBuilderTab;

