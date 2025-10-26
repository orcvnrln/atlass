import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Play, 
  Download, 
  Upload, 
  Settings, 
  Brain,
  Target,
  Shield,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const StrategyBuilder = () => {
  const [strategy, setStrategy] = useState({
    name: 'Custom Strategy',
    description: '',
    rules: {
      entry: [],
      exit: [],
      filters: []
    },
    riskManagement: {
      stopLoss: 1.5,
      takeProfit: 3.0,
      positionSize: 1.0,
      maxDrawdown: 5.0
    }
  });

  const [activeTab, setActiveTab] = useState('entry');
  const [showBacktest, setShowBacktest] = useState(false);

  const ruleTypes = {
    entry: [
      { id: 'price_above_ema', name: 'Price Above EMA', params: ['period'] },
      { id: 'volume_spike', name: 'Volume Spike', params: ['multiplier'] },
      { id: 'breakout', name: 'Breakout', params: ['period', 'threshold'] },
      { id: 'rsi_oversold', name: 'RSI Oversold', params: ['period', 'level'] }
    ],
    exit: [
      { id: 'take_profit', name: 'Take Profit', params: ['ratio'] },
      { id: 'stop_loss', name: 'Stop Loss', params: ['ratio'] },
      { id: 'trailing_stop', name: 'Trailing Stop', params: ['distance'] },
      { id: 'time_exit', name: 'Time Exit', params: ['hours'] }
    ],
    filters: [
      { id: 'market_hours', name: 'Market Hours', params: ['start', 'end'] },
      { id: 'volatility_filter', name: 'Volatility Filter', params: ['min', 'max'] },
      { id: 'trend_filter', name: 'Trend Filter', params: ['period'] }
    ]
  };

  const addRule = (type, ruleId) => {
    const rule = ruleTypes[type].find(r => r.id === ruleId);
    const newRule = {
      id: Date.now(),
      type: ruleId,
      name: rule.name,
      params: rule.params.reduce((acc, param) => ({ ...acc, [param]: 0 }), {}),
      enabled: true
    };

    setStrategy(prev => ({
      ...prev,
      rules: {
        ...prev.rules,
        [type]: [...prev.rules[type], newRule]
      }
    }));
  };

  const removeRule = (type, ruleId) => {
    setStrategy(prev => ({
      ...prev,
      rules: {
        ...prev.rules,
        [type]: prev.rules[type].filter(rule => rule.id !== ruleId)
      }
    }));
  };

  const updateRuleParam = (type, ruleId, param, value) => {
    setStrategy(prev => ({
      ...prev,
      rules: {
        ...prev.rules,
        [type]: prev.rules[type].map(rule => 
          rule.id === ruleId 
            ? { ...rule, params: { ...rule.params, [param]: value } }
            : rule
        )
      }
    }));
  };

  const generateCode = () => {
    const code = `
// Generated Strategy: ${strategy.name}
class ${strategy.name.replace(/\s+/g, '')}Strategy {
  constructor() {
    this.name = "${strategy.name}";
    this.stopLoss = ${strategy.riskManagement.stopLoss};
    this.takeProfit = ${strategy.riskManagement.takeProfit};
    this.positionSize = ${strategy.riskManagement.positionSize};
  }

  // Entry Rules
  checkEntry(data) {
    ${strategy.rules.entry.map(rule => `
    // ${rule.name}
    if (!this.${rule.type}(data, ${JSON.stringify(rule.params)})) return false;`).join('')}
    return true;
  }

  // Exit Rules
  checkExit(data, position) {
    ${strategy.rules.exit.map(rule => `
    // ${rule.name}
    if (this.${rule.type}(data, position, ${JSON.stringify(rule.params)})) return true;`).join('')}
    return false;
  }
}`;
    
    return code;
  };

  const tabs = [
    { id: 'entry', name: 'Entry Rules', icon: TrendingUp, color: 'text-green-400' },
    { id: 'exit', name: 'Exit Rules', icon: TrendingDown, color: 'text-red-400' },
    { id: 'filters', name: 'Filters', icon: Shield, color: 'text-blue-400' }
  ];

  return (
    <div className="bg-[#0f172a] rounded-lg border border-[#1e293b] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Strategy Builder</h2>
            <p className="text-sm text-gray-400">Drag & drop rules to create custom strategies</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Play className="w-4 h-4 mr-2" />
            Backtest
          </Button>
        </div>
      </div>

      {/* Strategy Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <input
            type="text"
            value={strategy.name}
            onChange={(e) => setStrategy(prev => ({ ...prev, name: e.target.value }))}
            className="w-full bg-[#1e293b] border border-[#374151] rounded-lg px-3 py-2 text-white"
            placeholder="Strategy Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Risk per trade:</span>
          <input
            type="number"
            value={strategy.riskManagement.positionSize}
            onChange={(e) => setStrategy(prev => ({
              ...prev,
              riskManagement: { ...prev.riskManagement, positionSize: parseFloat(e.target.value) }
            }))}
            className="w-20 bg-[#1e293b] border border-[#374151] rounded px-2 py-1 text-white text-sm"
            step="0.1"
          />
          <span className="text-sm text-gray-400">%</span>
        </div>
      </div>

      {/* Rule Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-[#1e293b]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${tab.color}`} />
            {tab.name}
            <span className="bg-[#1e293b] text-xs px-2 py-1 rounded-full">
              {strategy.rules[tab.id].length}
            </span>
          </button>
        ))}
      </div>

      {/* Rules Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Rules */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Available Rules</h3>
          <div className="space-y-2">
            {ruleTypes[activeTab].map((rule) => (
              <motion.div
                key={rule.id}
                whileHover={{ scale: 1.02 }}
                className="bg-[#1e293b] border border-[#374151] rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => addRule(activeTab, rule.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{rule.name}</span>
                  <Plus className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Parameters: {rule.params.join(', ')}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Rules */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Active Rules</h3>
          <div className="space-y-3">
            <AnimatePresence>
              {strategy.rules[activeTab].map((rule) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-[#1e293b] border border-[#374151] rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{rule.name}</span>
                    <button
                      onClick={() => removeRule(activeTab, rule.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {Object.entries(rule.params).map(([param, value]) => (
                      <div key={param} className="flex items-center gap-2">
                        <label className="text-xs text-gray-400 w-16">{param}:</label>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => updateRuleParam(activeTab, rule.id, param, parseFloat(e.target.value))}
                          className="flex-1 bg-[#374151] border border-[#4b5563] rounded px-2 py-1 text-white text-xs"
                          step="0.1"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {strategy.rules[activeTab].length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No {activeTab} rules added yet</p>
                <p className="text-xs">Click on available rules to add them</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generated Code Preview */}
      <div className="mt-6 p-4 bg-[#1e293b] rounded-lg border border-[#374151]">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-white">Generated Code Preview</h4>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Copy Code
          </Button>
        </div>
        <pre className="text-xs text-gray-300 overflow-x-auto">
          {generateCode()}
        </pre>
      </div>
    </div>
  );
};

export default StrategyBuilder;
