import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, TrendingUp, TrendingDown, AlertTriangle, Target, BarChart3, Zap, Shield } from 'lucide-react';

const AIAnalysisPopup = ({ isOpen, onClose, symbol, currentPrice }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trend');

  useEffect(() => {
    if (isOpen && symbol) {
      generateAIAnalysis();
    }
  }, [isOpen, symbol]);

  const generateAIAnalysis = async () => {
    setLoading(true);
    
    // Simulate AI analysis generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const analysisData = {
      trend: {
        direction: Math.random() > 0.5 ? 'bullish' : 'bearish',
        strength: Math.random() * 100,
        timeframe: '1D',
        confidence: Math.random() * 40 + 60, // 60-100%
        description: generateTrendDescription(),
        signals: generateTrendSignals()
      },
      supportResistance: {
        support: [
          { level: currentPrice * 0.95, strength: 'strong', touches: 3 },
          { level: currentPrice * 0.92, strength: 'medium', touches: 2 },
          { level: currentPrice * 0.88, strength: 'weak', touches: 1 }
        ],
        resistance: [
          { level: currentPrice * 1.05, strength: 'strong', touches: 4 },
          { level: currentPrice * 1.08, strength: 'medium', touches: 2 },
          { level: currentPrice * 1.12, strength: 'weak', touches: 1 }
        ],
        keyLevel: currentPrice * (Math.random() > 0.5 ? 1.05 : 0.95),
        description: generateSRDescription()
      },
      riskWarnings: generateRiskWarnings(),
      technicalIndicators: {
        rsi: Math.random() * 100,
        macd: Math.random() > 0.5 ? 'bullish' : 'bearish',
        bollinger: Math.random() > 0.5 ? 'oversold' : 'overbought',
        volume: Math.random() > 0.5 ? 'increasing' : 'decreasing'
      },
      priceTargets: {
        shortTerm: {
          target: currentPrice * (1 + (Math.random() - 0.5) * 0.1),
          probability: Math.random() * 40 + 60,
          timeframe: '1-3 days'
        },
        mediumTerm: {
          target: currentPrice * (1 + (Math.random() - 0.5) * 0.2),
          probability: Math.random() * 30 + 50,
          timeframe: '1-2 weeks'
        }
      }
    };

    setAnalysis(analysisData);
    setLoading(false);
  };

  const generateTrendDescription = () => {
    const descriptions = [
      "Strong upward momentum with increasing volume suggests continuation of the bullish trend.",
      "Bearish pressure building with declining volume indicating potential reversal.",
      "Sideways consolidation pattern forming, awaiting breakout direction.",
      "Bullish divergence detected in momentum indicators suggesting upward move.",
      "Bearish flag pattern completed, expecting downward continuation."
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const generateSRDescription = () => {
    const descriptions = [
      "Key resistance at current levels has been tested multiple times.",
      "Strong support zone holding, providing good entry opportunities.",
      "Breaking above resistance could trigger significant upward movement.",
      "Support breakdown would signal further downside potential.",
      "Price approaching critical decision zone between support and resistance."
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const generateTrendSignals = () => {
    return [
      { type: 'Moving Average', signal: 'bullish', description: 'Price above 20 EMA' },
      { type: 'Volume', signal: 'neutral', description: 'Average volume levels' },
      { type: 'Momentum', signal: 'bearish', description: 'RSI showing divergence' }
    ];
  };

  const generateRiskWarnings = () => {
    const warnings = [
      {
        level: 'high',
        type: 'Volatility',
        message: 'High volatility expected due to upcoming economic events',
        impact: 'Price swings of 3-5% possible'
      },
      {
        level: 'medium',
        type: 'Liquidity',
        message: 'Reduced liquidity during current market hours',
        impact: 'Wider spreads and slippage possible'
      },
      {
        level: 'low',
        type: 'Technical',
        message: 'Approaching key technical level',
        impact: 'Increased attention from algorithmic traders'
      }
    ];
    
    return warnings.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const getSignalColor = (signal) => {
    switch (signal) {
      case 'bullish': return 'text-accent-green';
      case 'bearish': return 'text-accent-red';
      default: return 'text-accent-orange';
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-accent-red';
      case 'medium': return 'text-accent-orange';
      default: return 'text-accent-green';
    }
  };

  const tabs = [
    { id: 'trend', label: 'Trend Analysis', icon: TrendingUp },
    { id: 'levels', label: 'Support/Resistance', icon: Target },
    { id: 'risk', label: 'Risk Warnings', icon: AlertTriangle },
    { id: 'targets', label: 'Price Targets', icon: BarChart3 }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card-bg rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-border-on-card"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-on-card">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-orange/10 rounded-lg">
                <Brain size={24} className="text-accent-orange" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">AI Analysis</h3>
                <p className="text-text-secondary">{symbol} • ${currentPrice}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex items-center gap-3">
                <Zap size={24} className="text-accent-orange animate-pulse" />
                <span className="text-text-primary">Analyzing market data...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="flex border-b border-border-on-card">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        activeTab === tab.id
                          ? 'bg-accent-orange/10 text-accent-orange border-b-2 border-accent-orange'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <IconComponent size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {activeTab === 'trend' && (
                  <div className="space-y-6">
                    <div className="bg-primary-bg rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-text-primary mb-3">Trend Direction</h4>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`px-4 py-2 rounded-lg font-medium ${
                          analysis.trend.direction === 'bullish' 
                            ? 'bg-accent-green/10 text-accent-green' 
                            : 'bg-accent-red/10 text-accent-red'
                        }`}>
                          {analysis.trend.direction.toUpperCase()}
                        </div>
                        <div className="text-text-secondary">
                          Confidence: <span className="text-text-primary font-medium">{analysis.trend.confidence.toFixed(0)}%</span>
                        </div>
                      </div>
                      <p className="text-text-secondary">{analysis.trend.description}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-text-primary">Technical Signals</h4>
                      {analysis.trend.signals.map((signal, index) => (
                        <div key={index} className="flex items-center justify-between bg-primary-bg rounded-lg p-3">
                          <div>
                            <span className="font-medium text-text-primary">{signal.type}</span>
                            <p className="text-sm text-text-secondary">{signal.description}</p>
                          </div>
                          <span className={`font-medium ${getSignalColor(signal.signal)}`}>
                            {signal.signal.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'levels' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-text-primary mb-3">Resistance Levels</h4>
                        <div className="space-y-2">
                          {analysis.supportResistance.resistance.map((level, index) => (
                            <div key={index} className="bg-accent-red/5 rounded-lg p-3 border border-accent-red/20">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-text-primary">${level.level.toFixed(2)}</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  level.strength === 'strong' ? 'bg-accent-red/20 text-accent-red' :
                                  level.strength === 'medium' ? 'bg-accent-orange/20 text-accent-orange' :
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {level.strength}
                                </span>
                              </div>
                              <p className="text-xs text-text-secondary mt-1">{level.touches} touches</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-text-primary mb-3">Support Levels</h4>
                        <div className="space-y-2">
                          {analysis.supportResistance.support.map((level, index) => (
                            <div key={index} className="bg-accent-green/5 rounded-lg p-3 border border-accent-green/20">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-text-primary">${level.level.toFixed(2)}</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  level.strength === 'strong' ? 'bg-accent-green/20 text-accent-green' :
                                  level.strength === 'medium' ? 'bg-accent-orange/20 text-accent-orange' :
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {level.strength}
                                </span>
                              </div>
                              <p className="text-xs text-text-secondary mt-1">{level.touches} touches</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary-bg rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-text-primary mb-2">Key Level Analysis</h4>
                      <p className="text-text-secondary">{analysis.supportResistance.description}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'risk' && (
                  <div className="space-y-4">
                    {analysis.riskWarnings.map((warning, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-primary-bg rounded-lg p-4 border-l-4 ${
                          warning.level === 'high' ? 'border-accent-red' :
                          warning.level === 'medium' ? 'border-accent-orange' :
                          'border-accent-green'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            warning.level === 'high' ? 'bg-accent-red/10' :
                            warning.level === 'medium' ? 'bg-accent-orange/10' :
                            'bg-accent-green/10'
                          }`}>
                            {warning.level === 'high' ? <AlertTriangle size={20} className="text-accent-red" /> :
                             warning.level === 'medium' ? <AlertTriangle size={20} className="text-accent-orange" /> :
                             <Shield size={20} className="text-accent-green" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-text-primary">{warning.type}</h4>
                              <span className={`text-xs px-2 py-1 rounded ${getRiskColor(warning.level)} bg-current/10`}>
                                {warning.level.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-text-secondary mb-2">{warning.message}</p>
                            <p className="text-sm text-text-secondary italic">{warning.impact}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'targets' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-primary-bg rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-text-primary mb-3">Short-term Target</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Price Target:</span>
                            <span className="font-mono text-xl font-bold text-text-primary">
                              ${analysis.priceTargets.shortTerm.target.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Probability:</span>
                            <span className="text-accent-green font-medium">
                              {analysis.priceTargets.shortTerm.probability.toFixed(0)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Timeframe:</span>
                            <span className="text-text-primary">{analysis.priceTargets.shortTerm.timeframe}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-primary-bg rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-text-primary mb-3">Medium-term Target</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Price Target:</span>
                            <span className="font-mono text-xl font-bold text-text-primary">
                              ${analysis.priceTargets.mediumTerm.target.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Probability:</span>
                            <span className="text-accent-orange font-medium">
                              {analysis.priceTargets.mediumTerm.probability.toFixed(0)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Timeframe:</span>
                            <span className="text-text-primary">{analysis.priceTargets.mediumTerm.timeframe}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary-bg rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-text-primary mb-3">Technical Indicators Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-text-secondary text-sm">RSI</div>
                          <div className={`font-bold ${
                            analysis.technicalIndicators.rsi > 70 ? 'text-accent-red' :
                            analysis.technicalIndicators.rsi < 30 ? 'text-accent-green' :
                            'text-accent-orange'
                          }`}>
                            {analysis.technicalIndicators.rsi.toFixed(0)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-text-secondary text-sm">MACD</div>
                          <div className={`font-bold ${getSignalColor(analysis.technicalIndicators.macd)}`}>
                            {analysis.technicalIndicators.macd.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-text-secondary text-sm">Bollinger</div>
                          <div className={`font-bold ${
                            analysis.technicalIndicators.bollinger === 'oversold' ? 'text-accent-green' : 'text-accent-red'
                          }`}>
                            {analysis.technicalIndicators.bollinger.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-text-secondary text-sm">Volume</div>
                          <div className={`font-bold ${
                            analysis.technicalIndicators.volume === 'increasing' ? 'text-accent-green' : 'text-accent-red'
                          }`}>
                            {analysis.technicalIndicators.volume.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAnalysisPopup;
