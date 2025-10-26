import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, Brain, TrendingUp, Activity, Clock, DollarSign } from 'lucide-react';
import AIAnalysisPopup from '@/components/ai/AIAnalysisPopup';

const ChartPopup = ({ isOpen, onClose, symbol, assetData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  if (!isOpen || !assetData) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'technical', label: 'Technical', icon: TrendingUp },
    { id: 'activity', label: 'Activity', icon: Activity }
  ];

  const technicalData = {
    indicators: [
      { name: 'RSI (14)', value: 65.4, signal: 'neutral' },
      { name: 'MACD', value: 0.12, signal: 'bullish' },
      { name: 'Stochastic', value: 78.2, signal: 'overbought' },
      { name: 'Williams %R', value: -25.6, signal: 'bullish' }
    ],
    movingAverages: [
      { period: 'MA(20)', value: assetData.price * 0.98, position: 'above' },
      { period: 'MA(50)', value: assetData.price * 0.95, position: 'above' },
      { period: 'MA(200)', value: assetData.price * 0.90, position: 'above' }
    ]
  };

  const activityData = {
    volume: {
      current: '2.4M',
      average: '1.8M',
      change: '+33%'
    },
    trades: {
      count: 1247,
      avgSize: '$1,923',
      largestTrade: '$45,000'
    },
    orderBook: {
      bidAsk: 0.0012,
      depth: 'High',
      imbalance: 'Neutral'
    }
  };

  const getSignalColor = (signal) => {
    switch (signal) {
      case 'bullish': return 'text-accent-green';
      case 'bearish': return 'text-accent-red';
      case 'overbought': return 'text-accent-orange';
      case 'oversold': return 'text-accent-blue';
      default: return 'text-text-secondary';
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card-bg rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden border border-border-on-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-on-card">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{assetData.flag}</div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">{symbol}</h3>
                  <p className="text-text-secondary">{assetData.name}</p>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-text-primary">${assetData.price}</div>
                  <div className={`text-sm font-medium ${
                    assetData.change >= 0 ? 'text-accent-green' : 'text-accent-red'
                  }`}>
                    {assetData.change >= 0 ? '+' : ''}{assetData.change.toFixed(2)}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAIAnalysis(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-orange/10 text-accent-orange rounded-lg hover:bg-accent-orange/20 transition-colors"
                >
                  <Brain size={16} />
                  AI Analysis
                </button>
                <button
                  onClick={onClose}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

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
            <div className="p-6 max-h-[50vh] overflow-y-auto">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Price Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-primary-bg rounded-lg p-4">
                      <div className="text-sm text-text-secondary">24h High</div>
                      <div className="text-lg font-bold text-text-primary">
                        ${(assetData.price * 1.05).toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-primary-bg rounded-lg p-4">
                      <div className="text-sm text-text-secondary">24h Low</div>
                      <div className="text-lg font-bold text-text-primary">
                        ${(assetData.price * 0.95).toFixed(2)}
                      </div>
                    </div>
                    <div className="bg-primary-bg rounded-lg p-4">
                      <div className="text-sm text-text-secondary">Volume</div>
                      <div className="text-lg font-bold text-text-primary">
                        {assetData.volume}
                      </div>
                    </div>
                    <div className="bg-primary-bg rounded-lg p-4">
                      <div className="text-sm text-text-secondary">Market Cap</div>
                      <div className="text-lg font-bold text-text-primary">
                        $2.4B
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-primary-bg rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-text-primary mb-4">Quick Stats</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Open</span>
                          <span className="text-text-primary font-mono">${(assetData.price * 0.99).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Previous Close</span>
                          <span className="text-text-primary font-mono">${(assetData.price * 0.98).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">52W High</span>
                          <span className="text-text-primary font-mono">${(assetData.price * 1.25).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">52W Low</span>
                          <span className="text-text-primary font-mono">${(assetData.price * 0.75).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Avg Volume</span>
                          <span className="text-text-primary font-mono">1.8M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Beta</span>
                          <span className="text-text-primary font-mono">1.24</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'technical' && (
                <div className="space-y-6">
                  {/* Technical Indicators */}
                  <div className="bg-primary-bg rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-text-primary mb-4">Technical Indicators</h4>
                    <div className="space-y-3">
                      {technicalData.indicators.map((indicator, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-text-secondary">{indicator.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-text-primary font-mono">{indicator.value}</span>
                            <span className={`text-xs px-2 py-1 rounded ${getSignalColor(indicator.signal)} bg-current/10`}>
                              {indicator.signal.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Moving Averages */}
                  <div className="bg-primary-bg rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-text-primary mb-4">Moving Averages</h4>
                    <div className="space-y-3">
                      {technicalData.movingAverages.map((ma, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-text-secondary">{ma.period}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-text-primary font-mono">${ma.value.toFixed(2)}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              ma.position === 'above' ? 'text-accent-green bg-accent-green/10' : 'text-accent-red bg-accent-red/10'
                            }`}>
                              {ma.position.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-6">
                  {/* Volume Analysis */}
                  <div className="bg-primary-bg rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-text-primary mb-4">Volume Analysis</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-text-secondary">Current</div>
                        <div className="text-xl font-bold text-text-primary">{activityData.volume.current}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-text-secondary">Average</div>
                        <div className="text-xl font-bold text-text-primary">{activityData.volume.average}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-text-secondary">Change</div>
                        <div className="text-xl font-bold text-accent-green">{activityData.volume.change}</div>
                      </div>
                    </div>
                  </div>

                  {/* Trading Activity */}
                  <div className="bg-primary-bg rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-text-primary mb-4">Trading Activity</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Total Trades</span>
                        <span className="text-text-primary font-mono">{activityData.trades.count.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Avg Trade Size</span>
                        <span className="text-text-primary font-mono">{activityData.trades.avgSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Largest Trade</span>
                        <span className="text-text-primary font-mono">{activityData.trades.largestTrade}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Book */}
                  <div className="bg-primary-bg rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-text-primary mb-4">Order Book</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Bid-Ask Spread</span>
                        <span className="text-text-primary font-mono">{activityData.orderBook.bidAsk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Market Depth</span>
                        <span className="text-accent-green">{activityData.orderBook.depth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Order Imbalance</span>
                        <span className="text-accent-orange">{activityData.orderBook.imbalance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* AI Analysis Popup */}
      <AIAnalysisPopup
        isOpen={showAIAnalysis}
        onClose={() => setShowAIAnalysis(false)}
        symbol={symbol}
        currentPrice={assetData.price}
      />
    </>
  );
};

export default ChartPopup;
