import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Target, AlertTriangle, Zap } from 'lucide-react';

const EventImpactAnalysis = ({ event, isOpen, onClose }) => {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && event) {
      generateImpactAnalysis();
    }
  }, [isOpen, event]);

  const generateImpactAnalysis = async () => {
    setLoading(true);
    
    // Simulate API call for impact analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const analysis = {
      primaryCurrency: event.currency,
      affectedPairs: generateAffectedPairs(event.currency),
      volatilityForecast: event.volatilityForecast || Math.random() * 100,
      priceTargets: generatePriceTargets(event),
      riskFactors: generateRiskFactors(event),
      tradingStrategy: generateTradingStrategy(event),
      historicalImpact: generateHistoricalData(event),
      marketSentiment: generateMarketSentiment(event)
    };
    
    setImpactData(analysis);
    setLoading(false);
  };

  const generateAffectedPairs = (currency) => {
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD'];
    const pairs = [];
    
    majorCurrencies.forEach(other => {
      if (other !== currency) {
        pairs.push({
          pair: `${currency}${other}`,
          expectedMove: (Math.random() - 0.5) * 2, // -1% to +1%
          probability: Math.random() * 40 + 60 // 60-100%
        });
      }
    });
    
    return pairs.slice(0, 4); // Top 4 most affected pairs
  };

  const generatePriceTargets = (event) => {
    const baseMove = event.impact * 0.3; // Higher impact = bigger moves
    return {
      bullish: {
        target1: `+${(baseMove * 0.5).toFixed(1)}%`,
        target2: `+${(baseMove * 1.0).toFixed(1)}%`,
        target3: `+${(baseMove * 1.5).toFixed(1)}%`,
        probability: Math.random() * 30 + 40
      },
      bearish: {
        target1: `-${(baseMove * 0.5).toFixed(1)}%`,
        target2: `-${(baseMove * 1.0).toFixed(1)}%`,
        target3: `-${(baseMove * 1.5).toFixed(1)}%`,
        probability: Math.random() * 30 + 40
      }
    };
  };

  const generateRiskFactors = (event) => {
    const factors = [
      {
        factor: 'High Volatility Expected',
        level: 'high',
        description: 'Significant price swings likely during and after the event'
      },
      {
        factor: 'Liquidity Concerns',
        level: event.impact >= 3 ? 'medium' : 'low',
        description: 'Reduced liquidity may cause wider spreads'
      },
      {
        factor: 'Algorithmic Trading',
        level: 'medium',
        description: 'Automated systems may amplify price movements'
      }
    ];
    
    return factors.slice(0, Math.floor(Math.random() * 2) + 2);
  };

  const generateTradingStrategy = (event) => {
    const strategies = [
      {
        type: 'Breakout Strategy',
        description: 'Wait for price to break key levels with volume confirmation',
        riskLevel: 'Medium',
        timeframe: '15m-1h'
      },
      {
        type: 'News Fade',
        description: 'Trade against initial reaction if it appears overdone',
        riskLevel: 'High',
        timeframe: '5m-30m'
      },
      {
        type: 'Range Trading',
        description: 'Trade within established support/resistance levels',
        riskLevel: 'Low',
        timeframe: '1h-4h'
      }
    ];
    
    return strategies[Math.floor(Math.random() * strategies.length)];
  };

  const generateHistoricalData = (event) => {
    return {
      averageMove: `${(Math.random() * 2 + 0.5).toFixed(1)}%`,
      maxMove: `${(Math.random() * 4 + 2).toFixed(1)}%`,
      accuracy: `${Math.floor(Math.random() * 20 + 70)}%`,
      lastThreeResults: [
        { date: '2024-01-15', move: '+1.2%', outcome: 'bullish' },
        { date: '2023-12-15', move: '-0.8%', outcome: 'bearish' },
        { date: '2023-11-15', move: '+2.1%', outcome: 'bullish' }
      ]
    };
  };

  const generateMarketSentiment = (event) => {
    const sentiment = Math.random();
    return {
      overall: sentiment > 0.6 ? 'bullish' : sentiment < 0.4 ? 'bearish' : 'neutral',
      confidence: Math.floor(Math.random() * 30 + 60),
      factors: [
        'Technical indicators suggest continuation',
        'Market positioning favors upside',
        'Economic fundamentals remain strong'
      ].slice(0, Math.floor(Math.random() * 2) + 1)
    };
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-accent-red';
      case 'medium': return 'text-accent-orange';
      default: return 'text-accent-green';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return 'text-accent-green';
      case 'bearish': return 'text-accent-red';
      default: return 'text-accent-orange';
    }
  };

  if (!isOpen) return null;

  return (
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
        <div className="p-6 border-b border-border-on-card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-text-primary">{event.event}</h3>
              <p className="text-text-secondary">{event.currency} • {event.date} {event.time}</p>
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="flex items-center gap-3">
              <Zap size={24} className="text-accent-orange animate-pulse" />
              <span className="text-text-primary">Analyzing market impact...</span>
            </div>
          </div>
        ) : (
          <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
            {/* Volatility Forecast */}
            <div className="bg-primary-bg rounded-lg p-4">
              <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                <BarChart3 size={20} />
                Volatility Forecast
              </h4>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-accent-orange">
                  {impactData.volatilityForecast.toFixed(0)}%
                </div>
                <div className="text-text-secondary">
                  Expected price movement range
                </div>
              </div>
            </div>

            {/* Affected Currency Pairs */}
            <div className="bg-primary-bg rounded-lg p-4">
              <h4 className="text-lg font-semibold text-text-primary mb-3">Most Affected Pairs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {impactData.affectedPairs.map((pair, index) => (
                  <div key={index} className="flex items-center justify-between bg-card-bg rounded p-3">
                    <span className="font-mono text-text-primary">{pair.pair}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${pair.expectedMove >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                        {pair.expectedMove >= 0 ? '+' : ''}{pair.expectedMove.toFixed(1)}%
                      </span>
                      <span className="text-xs text-text-secondary">
                        {pair.probability.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Targets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-accent-green/5 rounded-lg p-4 border border-accent-green/20">
                <h4 className="text-lg font-semibold text-accent-green mb-3 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Bullish Scenario
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Target 1:</span>
                    <span className="text-accent-green font-mono">{impactData.priceTargets.bullish.target1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Target 2:</span>
                    <span className="text-accent-green font-mono">{impactData.priceTargets.bullish.target2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Target 3:</span>
                    <span className="text-accent-green font-mono">{impactData.priceTargets.bullish.target3}</span>
                  </div>
                  <div className="pt-2 border-t border-accent-green/20">
                    <span className="text-xs text-text-secondary">
                      Probability: {impactData.priceTargets.bullish.probability.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-accent-red/5 rounded-lg p-4 border border-accent-red/20">
                <h4 className="text-lg font-semibold text-accent-red mb-3 flex items-center gap-2">
                  <TrendingDown size={20} />
                  Bearish Scenario
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Target 1:</span>
                    <span className="text-accent-red font-mono">{impactData.priceTargets.bearish.target1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Target 2:</span>
                    <span className="text-accent-red font-mono">{impactData.priceTargets.bearish.target2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Target 3:</span>
                    <span className="text-accent-red font-mono">{impactData.priceTargets.bearish.target3}</span>
                  </div>
                  <div className="pt-2 border-t border-accent-red/20">
                    <span className="text-xs text-text-secondary">
                      Probability: {impactData.priceTargets.bearish.probability.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="bg-primary-bg rounded-lg p-4">
              <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                <AlertTriangle size={20} />
                Risk Factors
              </h4>
              <div className="space-y-3">
                {impactData.riskFactors.map((risk, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      risk.level === 'high' ? 'bg-accent-red' :
                      risk.level === 'medium' ? 'bg-accent-orange' : 'bg-accent-green'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary">{risk.factor}</span>
                        <span className={`text-xs px-2 py-1 rounded ${getRiskColor(risk.level)} bg-current/10`}>
                          {risk.level.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">{risk.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Strategy */}
            <div className="bg-primary-bg rounded-lg p-4">
              <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Target size={20} />
                Recommended Strategy
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-primary">{impactData.tradingStrategy.type}</span>
                  <span className={`text-xs px-2 py-1 rounded ${getRiskColor(impactData.tradingStrategy.riskLevel.toLowerCase())} bg-current/10`}>
                    {impactData.tradingStrategy.riskLevel} Risk
                  </span>
                </div>
                <p className="text-text-secondary">{impactData.tradingStrategy.description}</p>
                <div className="text-sm text-text-secondary">
                  <strong>Timeframe:</strong> {impactData.tradingStrategy.timeframe}
                </div>
              </div>
            </div>

            {/* Market Sentiment */}
            <div className="bg-primary-bg rounded-lg p-4">
              <h4 className="text-lg font-semibold text-text-primary mb-3">Market Sentiment</h4>
              <div className="flex items-center gap-4 mb-3">
                <span className={`text-lg font-bold ${getSentimentColor(impactData.marketSentiment.overall)}`}>
                  {impactData.marketSentiment.overall.toUpperCase()}
                </span>
                <span className="text-text-secondary">
                  Confidence: {impactData.marketSentiment.confidence}%
                </span>
              </div>
              <div className="space-y-1">
                {impactData.marketSentiment.factors.map((factor, index) => (
                  <div key={index} className="text-sm text-text-secondary">
                    • {factor}
                  </div>
                ))}
              </div>
            </div>

            {/* Historical Performance */}
            <div className="bg-primary-bg rounded-lg p-4">
              <h4 className="text-lg font-semibold text-text-primary mb-3">Historical Impact</h4>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-text-secondary">Average Move</div>
                  <div className="text-lg font-bold text-text-primary">{impactData.historicalData.averageMove}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-text-secondary">Max Move</div>
                  <div className="text-lg font-bold text-text-primary">{impactData.historicalData.maxMove}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-text-secondary">Accuracy</div>
                  <div className="text-lg font-bold text-text-primary">{impactData.historicalData.accuracy}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium text-text-primary">Last 3 Events:</h5>
                {impactData.historicalData.lastThreeResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">{result.date}</span>
                    <span className={`font-mono ${result.outcome === 'bullish' ? 'text-accent-green' : 'text-accent-red'}`}>
                      {result.move}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EventImpactAnalysis;
