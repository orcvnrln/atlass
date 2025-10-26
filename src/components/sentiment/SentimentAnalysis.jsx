import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Shield, AlertTriangle, Target, BarChart3 } from 'lucide-react';

const SentimentAnalysis = () => {
  const [sentimentData, setSentimentData] = useState({});
  const [riskMode, setRiskMode] = useState('risk-on');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    generateSentimentData();
    const interval = setInterval(generateSentimentData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const generateSentimentData = () => {
    // Generate realistic sentiment data
    const vixLevel = Math.random() * 40 + 10; // VIX between 10-50
    const currentRiskMode = vixLevel > 25 ? 'risk-off' : 'risk-on';
    
    const data = {
      riskMode: currentRiskMode,
      vix: vixLevel,
      bonds: {
        sentiment: Math.random() * 100,
        yield10y: 3.5 + (Math.random() - 0.5) * 2,
        yield2y: 3.2 + (Math.random() - 0.5) * 1.5,
        yieldCurve: Math.random() * 2 - 1, // Can be negative (inverted)
        creditSpreads: Math.random() * 200 + 50,
        flowDirection: Math.random() > 0.5 ? 'inflow' : 'outflow',
        flowMagnitude: Math.random() * 100
      },
      stocks: {
        sentiment: Math.random() * 100,
        spx: 4200 + (Math.random() - 0.5) * 400,
        nasdaq: 13000 + (Math.random() - 0.5) * 1000,
        russell2000: 1800 + (Math.random() - 0.5) * 200,
        putCallRatio: Math.random() * 1.5 + 0.5,
        fearGreedIndex: Math.random() * 100,
        sectorRotation: generateSectorData()
      },
      commodities: {
        gold: 1900 + (Math.random() - 0.5) * 200,
        oil: 70 + (Math.random() - 0.5) * 20,
        dxy: 103 + (Math.random() - 0.5) * 5
      }
    };

    setSentimentData(data);
    setRiskMode(currentRiskMode);
    setLastUpdate(new Date());
  };

  const generateSectorData = () => {
    const sectors = [
      'Technology', 'Healthcare', 'Financials', 'Consumer Discretionary',
      'Communication Services', 'Industrials', 'Consumer Staples', 'Energy',
      'Utilities', 'Real Estate', 'Materials'
    ];

    return sectors.map(sector => ({
      name: sector,
      performance: (Math.random() - 0.5) * 6, // -3% to +3%
      sentiment: Math.random() * 100,
      flow: Math.random() > 0.5 ? 'inflow' : 'outflow'
    }));
  };

  const getSentimentColor = (value) => {
    if (value >= 70) return 'text-accent-green';
    if (value >= 30) return 'text-accent-orange';
    return 'text-accent-red';
  };

  const getSentimentBg = (value) => {
    if (value >= 70) return 'bg-accent-green/10';
    if (value >= 30) return 'bg-accent-orange/10';
    return 'bg-accent-red/10';
  };

  const getRiskModeColor = () => {
    return riskMode === 'risk-on' ? 'text-accent-green' : 'text-accent-red';
  };

  const getRiskModeIcon = () => {
    return riskMode === 'risk-on' ? <TrendingUp size={20} /> : <TrendingDown size={20} />;
  };

  if (!sentimentData.bonds) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Market Sentiment Analysis</h2>
          <p className="text-text-secondary">
            Real-time risk-on vs risk-off sentiment across asset classes
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Activity size={16} />
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Risk Mode Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-card-bg rounded-lg p-6 border border-border-on-card ${
          riskMode === 'risk-on' ? 'border-accent-green/30' : 'border-accent-red/30'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${
              riskMode === 'risk-on' ? 'bg-accent-green/20' : 'bg-accent-red/20'
            }`}>
              {getRiskModeIcon()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary">
                Market Mode: <span className={getRiskModeColor()}>{riskMode.toUpperCase()}</span>
              </h3>
              <p className="text-text-secondary">
                {riskMode === 'risk-on' 
                  ? 'Investors are seeking higher yields and taking on more risk'
                  : 'Flight to safety - investors prefer defensive assets'
                }
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-text-secondary">VIX Level</div>
            <div className={`text-2xl font-bold ${
              sentimentData.vix > 30 ? 'text-accent-red' : 
              sentimentData.vix > 20 ? 'text-accent-orange' : 'text-accent-green'
            }`}>
              {sentimentData.vix.toFixed(1)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Asset Class Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bonds Sentiment */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card-bg rounded-lg p-6 border border-border-on-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-accent-blue" />
            <h3 className="text-xl font-semibold text-text-primary">Bonds Sentiment</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Overall Sentiment</span>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentBg(sentimentData.bonds.sentiment)} ${getSentimentColor(sentimentData.bonds.sentiment)}`}>
                {sentimentData.bonds.sentiment.toFixed(0)}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">10Y Yield</span>
                <div className="font-mono text-text-primary">{sentimentData.bonds.yield10y.toFixed(2)}%</div>
              </div>
              <div>
                <span className="text-text-secondary">2Y Yield</span>
                <div className="font-mono text-text-primary">{sentimentData.bonds.yield2y.toFixed(2)}%</div>
              </div>
              <div>
                <span className="text-text-secondary">Yield Curve</span>
                <div className={`font-mono ${sentimentData.bonds.yieldCurve < 0 ? 'text-accent-red' : 'text-accent-green'}`}>
                  {sentimentData.bonds.yieldCurve.toFixed(2)}%
                </div>
              </div>
              <div>
                <span className="text-text-secondary">Credit Spreads</span>
                <div className="font-mono text-text-primary">{sentimentData.bonds.creditSpreads.toFixed(0)}bps</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border-on-card">
              <span className="text-text-secondary">Flow Direction</span>
              <div className={`flex items-center gap-2 ${
                sentimentData.bonds.flowDirection === 'inflow' ? 'text-accent-green' : 'text-accent-red'
              }`}>
                {sentimentData.bonds.flowDirection === 'inflow' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="font-medium">{sentimentData.bonds.flowDirection.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stocks Sentiment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card-bg rounded-lg p-6 border border-border-on-card"
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 size={24} className="text-accent-orange" />
            <h3 className="text-xl font-semibold text-text-primary">Stocks Sentiment</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Overall Sentiment</span>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentBg(sentimentData.stocks.sentiment)} ${getSentimentColor(sentimentData.stocks.sentiment)}`}>
                {sentimentData.stocks.sentiment.toFixed(0)}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">S&P 500</span>
                <div className="font-mono text-text-primary">{sentimentData.stocks.spx.toFixed(0)}</div>
              </div>
              <div>
                <span className="text-text-secondary">NASDAQ</span>
                <div className="font-mono text-text-primary">{sentimentData.stocks.nasdaq.toFixed(0)}</div>
              </div>
              <div>
                <span className="text-text-secondary">Put/Call Ratio</span>
                <div className={`font-mono ${sentimentData.stocks.putCallRatio > 1 ? 'text-accent-red' : 'text-accent-green'}`}>
                  {sentimentData.stocks.putCallRatio.toFixed(2)}
                </div>
              </div>
              <div>
                <span className="text-text-secondary">Fear & Greed</span>
                <div className={`font-mono ${getSentimentColor(sentimentData.stocks.fearGreedIndex)}`}>
                  {sentimentData.stocks.fearGreedIndex.toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sector Rotation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-bg rounded-lg p-6 border border-border-on-card"
      >
        <h3 className="text-xl font-semibold text-text-primary mb-4">Sector Rotation Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sentimentData.stocks.sectorRotation.map((sector, index) => (
            <motion.div
              key={sector.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-primary-bg rounded-lg p-4 border border-border-on-card"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">{sector.name}</span>
                <div className={`flex items-center gap-1 ${
                  sector.flow === 'inflow' ? 'text-accent-green' : 'text-accent-red'
                }`}>
                  {sector.flow === 'inflow' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-lg font-bold ${
                  sector.performance >= 0 ? 'text-accent-green' : 'text-accent-red'
                }`}>
                  {sector.performance >= 0 ? '+' : ''}{sector.performance.toFixed(2)}%
                </span>
                <div className={`text-xs px-2 py-1 rounded ${getSentimentBg(sector.sentiment)} ${getSentimentColor(sector.sentiment)}`}>
                  {sector.sentiment.toFixed(0)}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SentimentAnalysis;
