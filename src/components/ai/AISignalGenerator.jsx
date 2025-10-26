import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  BarChart3,
  Activity,
  Zap,
  Shield,
  DollarSign
} from 'lucide-react';

const AISignalGenerator = ({ asset }) => {
  const [signals, setSignals] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketSentiment, setMarketSentiment] = useState('neutral');
  const [confidence, setConfidence] = useState(0);

  // Mock signal generation
  useEffect(() => {
    const generateSignals = () => {
      setIsAnalyzing(true);
      
      setTimeout(() => {
        const newSignals = [
          {
            id: Date.now(),
            symbol: asset?.symbol || 'EUR/USD',
            action: Math.random() > 0.5 ? 'BUY' : 'SELL',
            confidence: Math.floor(Math.random() * 40) + 60,
            price: (1.08 + Math.random() * 0.01).toFixed(4),
            target: (1.08 + Math.random() * 0.02).toFixed(4),
            stopLoss: (1.08 - Math.random() * 0.01).toFixed(4),
            reason: 'AI detected strong momentum with RSI divergence',
            timeframe: '4H',
            risk: Math.random() > 0.3 ? 'LOW' : 'MEDIUM',
            timestamp: new Date(),
            indicators: ['RSI', 'MACD', 'Bollinger Bands'],
            marketCondition: 'Trending'
          }
        ];
        
        setSignals(prev => [...newSignals, ...prev.slice(0, 4)]);
        setMarketSentiment(Math.random() > 0.5 ? 'bullish' : 'bearish');
        setConfidence(Math.floor(Math.random() * 30) + 70);
        setIsAnalyzing(false);
      }, 2000);
    };

    const interval = setInterval(generateSignals, 10000);
    generateSignals(); // Initial signal

    return () => clearInterval(interval);
  }, [asset]);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="w-4 h-4" />;
      case 'bearish': return <TrendingDown className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'LOW': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HIGH': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 border border-[#3b82f6]/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#3b82f6]/20 rounded-lg">
            <Brain className="w-6 h-6 text-[#3b82f6]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Signal Generator</h2>
            <p className="text-sm text-gray-400">Real-time market analysis & trading signals</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-yellow-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
              <span className="text-sm">Analyzing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Market Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Market Sentiment</span>
            <div className={`flex items-center gap-1 ${getSentimentColor(marketSentiment)}`}>
              {getSentimentIcon(marketSentiment)}
              <span className="text-sm font-medium capitalize">{marketSentiment}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Based on AI analysis of price action, volume, and market structure
          </div>
        </div>

        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">AI Confidence</span>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">{confidence}%</span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-400 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Active Signals</span>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">{signals.length}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Currently monitoring market conditions
          </div>
        </div>
      </div>

      {/* Latest Signals */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#3b82f6]" />
          Latest AI Signals
        </h3>
        
        {signals.length > 0 ? (
          <div className="space-y-3">
            {signals.slice(0, 3).map((signal, index) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0f172a] rounded-lg p-4 border border-[#23324a] hover:border-[#3b82f6]/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      signal.action === 'BUY' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      {signal.action === 'BUY' ? 
                        <TrendingUp className="w-5 h-5 text-green-400" /> : 
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      }
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{signal.symbol}</div>
                      <div className="text-sm text-gray-400">{signal.reason}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">{signal.timestamp.toLocaleTimeString()}</div>
                    <div className="text-xs text-gray-500">{signal.timeframe}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Entry Price</div>
                    <div className="font-mono text-white">{signal.price}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Target</div>
                    <div className="font-mono text-green-400">{signal.target}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Stop Loss</div>
                    <div className="font-mono text-red-400">{signal.stopLoss}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Risk Level</div>
                    <div className={`font-semibold ${getRiskColor(signal.risk)}`}>{signal.risk}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-400">{signal.confidence}% confidence</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">{signal.marketCondition}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {signal.indicators.map((indicator, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-[#3b82f6]/20 text-[#3b82f6] text-xs rounded"
                      >
                        {indicator}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0f172a] rounded-lg p-8 text-center border border-[#23324a]">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">No signals available. AI is analyzing market conditions...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISignalGenerator;
