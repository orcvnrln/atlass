import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb,
  Target,
  Shield,
  X
} from 'lucide-react';

const insightTypes = {
  opportunity: { icon: Lightbulb, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  bullish: { icon: TrendingUp, color: 'text-positive', bg: 'bg-positive/10', border: 'border-positive/20' },
  bearish: { icon: TrendingDown, color: 'text-negative', bg: 'bg-negative/10', border: 'border-negative/20' },
  suggestion: { icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
};

const mockInsights = [
  {
    id: 1,
    type: 'bullish',
    title: 'Strong Buy Signal Detected',
    message: 'EUR/USD showing bullish divergence on 4H timeframe. Smart money accumulating at support level of 1.0850.',
    confidence: 87,
    asset: 'EUR/USD',
    timeframe: '4H',
    priority: 'high',
    action: 'Consider long position',
    targetPrice: '1.0920',
    stopLoss: '1.0830',
    timestamp: Date.now() - 300000, // 5 min ago
  },
  {
    id: 2,
    type: 'warning',
    title: 'High Volatility Expected',
    message: 'FOMC meeting in 2 hours. Expected volatility increase of 40-60%. Consider reducing leverage to 2x or lower.',
    confidence: 92,
    asset: 'USD pairs',
    timeframe: 'Event',
    priority: 'critical',
    action: 'Review risk exposure',
    timestamp: Date.now() - 600000, // 10 min ago
  },
  {
    id: 3,
    type: 'opportunity',
    title: 'Arbitrage Opportunity',
    message: 'BTC/USD price discrepancy detected across exchanges. Binance: $42,150 | Coinbase: $42,280. Potential 0.3% profit.',
    confidence: 78,
    asset: 'BTC/USD',
    timeframe: '1M',
    priority: 'medium',
    action: 'Execute arbitrage',
    timestamp: Date.now() - 120000, // 2 min ago
  },
  {
    id: 4,
    type: 'suggestion',
    title: 'Portfolio Rebalancing Recommended',
    message: 'Your crypto allocation is 15% above target (35% vs 20%). Consider taking profits or diversifying into bonds/commodities.',
    confidence: 85,
    asset: 'Portfolio',
    timeframe: 'Daily',
    priority: 'low',
    action: 'Rebalance allocation',
    timestamp: Date.now() - 1800000, // 30 min ago
  },
  {
    id: 5,
    type: 'bearish',
    title: 'Overbought Conditions',
    message: 'AAPL RSI at 78 on daily chart. Historical data shows 85% probability of pullback within 3-5 days.',
    confidence: 73,
    asset: 'AAPL',
    timeframe: '1D',
    priority: 'medium',
    action: 'Consider profit taking',
    targetPrice: '$175.50',
    timestamp: Date.now() - 900000, // 15 min ago
  },
];

const InsightCard = React.forwardRef(({ insight, onDismiss }, ref) => {
  const config = insightTypes[insight.type];
  const Icon = config.icon;
  
  // Format timestamp
  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  // Priority badge colors
  const priorityColors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      ref={ref}
      className={`relative p-4 rounded-xl border ${config.bg} ${config.border} transition-all hover:shadow-lg hover:border-opacity-40`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${config.bg} ring-1 ring-white/10`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-bold text-sm ${config.color}`}>
                {insight.title}
              </h4>
              {insight.priority && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${priorityColors[insight.priority]}`}>
                  {insight.priority}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-400">
              <span className="font-mono font-semibold">{insight.asset}</span>
              <span>•</span>
              <span>{insight.timeframe}</span>
              <span>•</span>
              <span>{getTimeAgo(insight.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => onDismiss(insight.id)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Dismiss insight"
        >
          <X className="w-4 h-4 text-text-secondary hover:text-text-primary" />
        </button>
      </div>

      {/* Message */}
      <p className="text-xs text-gray-300 leading-relaxed mb-3 pl-[52px] break-words overflow-hidden">
        {insight.message}
      </p>

      {/* Metadata & Actions */}
      <div className="flex items-start md:items-center justify-between pl-[52px] gap-3 flex-wrap">
        <div className="flex items-center gap-4">
          {/* Confidence */}
          <div className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-16 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${config.color.replace('text-', 'bg-')} transition-all`}
                  style={{ width: `${insight.confidence}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-gray-400">
                {insight.confidence}%
              </span>
            </div>
          </div>

          {/* Target/Stop Loss */}
          {(insight.targetPrice || insight.stopLoss) && (
            <div className="flex items-center gap-2 text-[11px]">
              {insight.targetPrice && (
                <span className="text-positive">
                  TP: {insight.targetPrice}
                </span>
              )}
              {insight.stopLoss && (
                <span className="text-negative">
                  SL: {insight.stopLoss}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        {insight.action && (
          <button 
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${config.bg} ${config.color} hover:opacity-80 hover:scale-105 border ${config.border}`}
          >
            {insight.action}
          </button>
        )}
      </div>
    </motion.div>
  );
});

const AIInsightsPanel = () => {
  const [insights, setInsights] = useState(mockInsights);
  const [isExpanded, setIsExpanded] = useState(true);
  const [filterType, setFilterType] = useState('all'); // all, bullish, bearish, warning, opportunity, suggestion

  const handleDismiss = (id) => {
    setInsights(prev => prev.filter(insight => insight.id !== id));
  };

  // Simulate new insights appearing
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add a new insight (10% chance every 10 seconds)
      if (Math.random() < 0.1 && insights.length < 8) {
        const newInsight = {
          ...mockInsights[Math.floor(Math.random() * mockInsights.length)],
          id: Date.now(),
          timestamp: Date.now(),
        };
        setInsights(prev => [newInsight, ...prev]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [insights.length]);

  // Filter insights
  const filteredInsights = filterType === 'all' 
    ? insights 
    : insights.filter(i => i.type === filterType);

  // Count by type
  const countByType = {
    bullish: insights.filter(i => i.type === 'bullish').length,
    bearish: insights.filter(i => i.type === 'bearish').length,
    warning: insights.filter(i => i.type === 'warning').length,
    opportunity: insights.filter(i => i.type === 'opportunity').length,
    suggestion: insights.filter(i => i.type === 'suggestion').length,
  };

  const criticalCount = insights.filter(i => i.priority === 'critical').length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-bg rounded-xl card-elevation border border-border-color overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border-color space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 rounded-lg ring-1 ring-purple-500/20">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                AI Insights
                {criticalCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">
                    {criticalCount} CRITICAL
                  </span>
                )}
              </h3>
              <p className="text-xs text-text-secondary">
                {filteredInsights.length} of {insights.length} insight{insights.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-border-color"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {/* Filter Tabs */}
        {isExpanded && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-white/5 text-text-secondary hover:bg-white/10'
              }`}
            >
              All ({insights.length})
            </button>
            {Object.entries(countByType).map(([type, count]) => {
              const config = insightTypes[type];
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                    filterType === type
                      ? `${config.bg} ${config.color} ${config.border}`
                      : 'bg-white/5 text-text-secondary hover:bg-white/10 border-transparent'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Insights List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 space-y-3 max-h-[500px] lg:max-h-[600px] overflow-y-auto scrollbar-thin"
          >
            <AnimatePresence mode="popLayout">
              {filteredInsights.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 text-text-secondary"
                >
                  <Brain className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-semibold text-gray-300">
                    {insights.length === 0 ? 'No active insights' : `No ${filterType} insights`}
                  </p>
                  <p className="text-xs mt-1">
                    {insights.length === 0 
                      ? 'AI is analyzing market conditions...' 
                      : 'Try selecting a different filter'}
                  </p>
                </motion.div>
              ) : (
                filteredInsights.map(insight => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    onDismiss={handleDismiss}
                  />
                ))
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIInsightsPanel;
