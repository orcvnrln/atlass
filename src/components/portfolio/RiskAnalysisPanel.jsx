import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  TrendingDown, 
  AlertTriangle, 
  BarChart, 
  Scale, 
  Shuffle,
  HelpCircle
} from 'lucide-react';

// Risk metrics mock data
const riskMetrics = {
  beta: { value: 1.24, benchmark: "S&P 500", description: "Measures portfolio volatility relative to the market" },
  sharpeRatio: { value: 1.84, benchmark: 1.0, description: "Measures risk-adjusted returns" },
  maxDrawdown: { value: -12.5, period: "Last 12 months", description: "Largest peak-to-trough decline" },
  valueAtRisk: { value: 8450, confidence: 95, description: "Maximum potential loss at 95% confidence" },
  volatility: { value: 18.2, benchmark: 14.5, description: "Annualized standard deviation of returns" },
  sortino: { value: 2.15, benchmark: 1.5, description: "Measures risk-adjusted returns for downside risk" },
  correlations: {
    spy: 0.85, // S&P 500
    qqq: 0.92, // Nasdaq
    iwm: 0.76, // Russell 2000
    gold: -0.12, // Gold
    bonds: -0.35, // Bonds
  }
};

// Helper function to get color based on value
const getValueColor = (value, type) => {
  if (type === 'sharpeRatio' || type === 'sortino') {
    if (value > 2.0) return 'text-positive';
    if (value > 1.0) return 'text-blue-400';
    return 'text-amber-400';
  }
  
  if (type === 'beta') {
    if (value < 0.8) return 'text-blue-400';
    if (value < 1.2) return 'text-text-primary';
    return 'text-amber-400';
  }
  
  if (type === 'maxDrawdown') {
    if (value > -10) return 'text-blue-400';
    if (value > -20) return 'text-amber-400';
    return 'text-negative';
  }
  
  if (type === 'volatility') {
    if (value < 15) return 'text-blue-400';
    if (value < 25) return 'text-amber-400';
    return 'text-negative';
  }
  
  return 'text-text-primary';
};

const RiskAnalysisPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showTooltip, setShowTooltip] = useState(null);
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'drawdown', label: 'Drawdown', icon: TrendingDown },
    { id: 'correlation', label: 'Correlation', icon: Shuffle },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card-bg rounded-xl border border-border-color overflow-hidden"
    >
      {/* Header with Tabs */}
      <div className="border-b border-border-color">
        <div className="flex items-center gap-2 p-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent text-white'
                    : 'bg-white/5 text-text-secondary hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-text-primary">Risk Analysis</h3>
            
            {/* Risk Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Beta */}
              <div className="p-4 rounded-lg bg-white/5 border border-border-color relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-bold text-text-primary">Beta</h4>
                  </div>
                  
                  <button 
                    className="p-1 rounded-full hover:bg-white/10"
                    onMouseEnter={() => setShowTooltip('beta')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-text-secondary" />
                  </button>
                  
                  {showTooltip === 'beta' && (
                    <div className="absolute top-0 right-0 mt-8 w-64 p-3 rounded-md bg-card-bg border border-border-color shadow-xl z-10 text-xs text-text-secondary">
                      {riskMetrics.beta.description}
                      <div className="mt-1.5">
                        <span className="text-blue-400">{'<'}1.0</span>: Less volatile than benchmark<br />
                        <span className="text-amber-400">{'>'}1.0</span>: More volatile than benchmark
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className={`text-xl font-bold ${getValueColor(riskMetrics.beta.value, 'beta')}`}>
                    {riskMetrics.beta.value}
                  </span>
                  <span className="text-xs text-text-secondary">
                    vs. {riskMetrics.beta.benchmark}
                  </span>
                </div>
                
                {/* Beta Indicator */}
                <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${Math.min(riskMetrics.beta.value * 50, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-text-secondary">
                  <span>0.5</span>
                  <span>1.0</span>
                  <span>1.5</span>
                  <span>2.0</span>
                </div>
              </div>
              
              {/* Sharpe Ratio */}
              <div className="p-4 rounded-lg bg-white/5 border border-border-color relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-green-400" />
                    <h4 className="text-sm font-bold text-text-primary">Sharpe Ratio</h4>
                  </div>
                  
                  <button 
                    className="p-1 rounded-full hover:bg-white/10"
                    onMouseEnter={() => setShowTooltip('sharpe')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-text-secondary" />
                  </button>
                  
                  {showTooltip === 'sharpe' && (
                    <div className="absolute top-0 right-0 mt-8 w-64 p-3 rounded-md bg-card-bg border border-border-color shadow-xl z-10 text-xs text-text-secondary">
                      {riskMetrics.sharpeRatio.description}
                      <div className="mt-1.5">
                        <span className="text-negative">{'<'}1.0</span>: Poor risk-adjusted return<br />
                        <span className="text-amber-400">1.0-2.0</span>: Good<br />
                        <span className="text-positive">{'>'}2.0</span>: Excellent
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className={`text-xl font-bold ${getValueColor(riskMetrics.sharpeRatio.value, 'sharpeRatio')}`}>
                    {riskMetrics.sharpeRatio.value}
                  </span>
                  <span className="text-xs text-text-secondary">
                    vs. {riskMetrics.sharpeRatio.benchmark} benchmark
                  </span>
                </div>
                
                {/* Sharpe Rating */}
                <div className="mt-3 flex">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div 
                      key={rating}
                      className={`h-1.5 w-full mx-0.5 rounded-sm ${
                        rating <= Math.round(riskMetrics.sharpeRatio.value)
                          ? 'bg-positive'
                          : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-text-secondary">
                  <span>Poor</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
              
              {/* Max Drawdown */}
              <div className="p-4 rounded-lg bg-white/5 border border-border-color relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-negative" />
                    <h4 className="text-sm font-bold text-text-primary">Max Drawdown</h4>
                  </div>
                  
                  <button 
                    className="p-1 rounded-full hover:bg-white/10"
                    onMouseEnter={() => setShowTooltip('drawdown')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-text-secondary" />
                  </button>
                  
                  {showTooltip === 'drawdown' && (
                    <div className="absolute top-0 right-0 mt-8 w-64 p-3 rounded-md bg-card-bg border border-border-color shadow-xl z-10 text-xs text-text-secondary">
                      {riskMetrics.maxDrawdown.description}
                      <div className="mt-1.5">
                        Shows the worst peak-to-trough decline during {riskMetrics.maxDrawdown.period}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className={`text-xl font-bold ${getValueColor(riskMetrics.maxDrawdown.value, 'maxDrawdown')}`}>
                    {riskMetrics.maxDrawdown.value}%
                  </span>
                  <span className="text-xs text-text-secondary">
                    {riskMetrics.maxDrawdown.period}
                  </span>
                </div>
                
                {/* Drawdown Severity */}
                <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-negative transition-all"
                    style={{ width: `${Math.min(Math.abs(riskMetrics.maxDrawdown.value) / 30 * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-text-secondary">
                  <span>0%</span>
                  <span>-10%</span>
                  <span>-20%</span>
                  <span>-30%</span>
                </div>
              </div>
              
              {/* Value at Risk */}
              <div className="p-4 rounded-lg bg-white/5 border border-border-color relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-text-primary">Value at Risk (VaR)</h4>
                  </div>
                  
                  <button 
                    className="p-1 rounded-full hover:bg-white/10"
                    onMouseEnter={() => setShowTooltip('var')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-text-secondary" />
                  </button>
                  
                  {showTooltip === 'var' && (
                    <div className="absolute top-0 right-0 mt-8 w-64 p-3 rounded-md bg-card-bg border border-border-color shadow-xl z-10 text-xs text-text-secondary">
                      {riskMetrics.valueAtRisk.description}
                      <div className="mt-1.5">
                        Represents the maximum expected loss at {riskMetrics.valueAtRisk.confidence}% confidence level over 1 day
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-text-primary">
                    ${riskMetrics.valueAtRisk.value.toLocaleString()}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {riskMetrics.valueAtRisk.confidence}% confidence
                  </span>
                </div>
                
                {/* VaR as % of Portfolio */}
                <div className="mt-3 text-xs text-text-secondary">
                  <span>Represents ~6.6% of portfolio</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 mt-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-semibold text-sm text-blue-400 mb-2">
                Risk Assessment
              </h4>
              <p className="text-xs text-blue-300 leading-relaxed">
                Your portfolio has higher than average volatility (Beta: 1.24) but delivers strong
                risk-adjusted returns (Sharpe: 1.84). Consider adding low-correlation assets like bonds 
                or gold to reduce maximum drawdown, which is currently higher than recommended at -12.5%.
              </p>
            </div>
          </div>
        )}
        
        {activeTab === 'drawdown' && (
          <div className="text-center py-6 text-text-secondary">
            <TrendingDown className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p>Drawdown analysis will be available in the next update.</p>
          </div>
        )}
        
        {activeTab === 'correlation' && (
          <div className="text-center py-6 text-text-secondary">
            <Shuffle className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p>Correlation matrix will be available in the next update.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RiskAnalysisPanel;
