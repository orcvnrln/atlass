import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Shuffle, 
  ShieldCheck, 
  PieChart,
  ThumbsUp,
  ThumbsDown,
  Clock,
  ChevronRight
} from 'lucide-react';

// Mock recommendations
const mockRecommendations = [
  {
    id: 1,
    type: 'allocation',
    title: 'Increase Bond Allocation',
    description: 'Add 10% bond exposure to reduce portfolio volatility. Consider Treasury ETFs like TLT or BND.',
    impact: {
      risk: -15, // Risk reduction
      return: -5, // Return reduction
      sharpe: +10, // Sharpe ratio improvement
    },
    confidence: 85,
    timeframe: 'Long Term',
    icon: ShieldCheck,
    iconColor: 'text-blue-400',
    action: 'View Bond ETFs'
  },
  {
    id: 2,
    type: 'rebalance',
    title: 'Tech Sector Overweight',
    description: 'Your portfolio has 42% in Tech, versus 28% benchmark weight. Consider trimming AAPL, MSFT positions.',
    impact: {
      risk: -8,
      return: -3,
      sharpe: +4,
    },
    confidence: 78,
    timeframe: 'Medium Term',
    icon: PieChart,
    iconColor: 'text-purple-400',
    action: 'View Rebalancing Plan'
  },
  {
    id: 3,
    type: 'opportunity',
    title: 'Value Stocks Undervalued',
    description: 'Value stocks are historically cheap relative to growth. Consider adding SCHV or VTV exposure.',
    impact: {
      risk: -2,
      return: +7,
      sharpe: +5,
    },
    confidence: 72,
    timeframe: 'Medium Term',
    icon: TrendingUp,
    iconColor: 'text-positive',
    action: 'View Value ETFs'
  },
  {
    id: 4,
    type: 'risk',
    title: 'Reduce Tesla Position',
    description: 'TSLA comprises 12% of your portfolio, creating concentration risk. Consider trimming to 5% max.',
    impact: {
      risk: -18,
      return: -8,
      sharpe: +12,
    },
    confidence: 89,
    timeframe: 'Immediate',
    icon: ShieldCheck,
    iconColor: 'text-amber-400',
    action: 'View Risk Analysis'
  },
  {
    id: 5,
    type: 'opportunity',
    title: 'International Exposure',
    description: 'Add international stocks for diversification. Consider EFA or VXUS to gain non-US market exposure.',
    impact: {
      risk: -10,
      return: +4,
      sharpe: +8,
    },
    confidence: 81,
    timeframe: 'Long Term',
    icon: Shuffle,
    iconColor: 'text-blue-400',
    action: 'View International ETFs'
  }
];

// Helper functions
const getImpactColor = (value) => {
  if (value > 0) return 'text-positive';
  if (value < 0) return 'text-negative';
  return 'text-text-secondary';
};

const getTimeframeIcon = (timeframe) => {
  switch (timeframe) {
    case 'Immediate':
      return <Clock className="w-3 h-3 text-red-400" />;
    case 'Medium Term':
      return <Clock className="w-3 h-3 text-amber-400" />;
    case 'Long Term':
      return <Clock className="w-3 h-3 text-blue-400" />;
    default:
      return <Clock className="w-3 h-3 text-text-secondary" />;
  }
};

const getImpactIcon = (type, value) => {
  if (type === 'risk') {
    return value < 0 ? 
      <ShieldCheck className="w-3 h-3 text-positive" /> : 
      <ShieldCheck className="w-3 h-3 text-negative" />;
  }
  
  return value > 0 ? 
    <TrendingUp className="w-3 h-3 text-positive" /> : 
    <TrendingDown className="w-3 h-3 text-negative" />;
};

const RecommendationCard = ({ recommendation, onFeedback }) => {
  const { id, type, title, description, impact, confidence, timeframe, icon: Icon, iconColor, action } = recommendation;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-border-color rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border-color">
        <div className={`p-2.5 rounded-lg ${iconColor.replace('text-', 'bg-')}/10 ring-1 ring-white/10`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-text-primary">{title}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            {/* Timeframe */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-medium">
              {getTimeframeIcon(timeframe)}
              <span>{timeframe}</span>
            </div>
            
            {/* Confidence */}
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{confidence}% confidence</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-text-secondary leading-relaxed">
          {description}
        </p>
        
        {/* Impact */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {/* Risk Impact */}
          <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-1 mb-1">
              {getImpactIcon('risk', impact.risk)}
              <span className={`text-xs font-semibold ${getImpactColor(impact.risk === 0 ? 0 : -impact.risk)}`}>
                {impact.risk > 0 ? `+${impact.risk}%` : `${impact.risk}%`}
              </span>
            </div>
            <span className="text-[10px] text-text-secondary">Risk</span>
          </div>
          
          {/* Return Impact */}
          <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-1 mb-1">
              {getImpactIcon('return', impact.return)}
              <span className={`text-xs font-semibold ${getImpactColor(impact.return)}`}>
                {impact.return > 0 ? `+${impact.return}%` : `${impact.return}%`}
              </span>
            </div>
            <span className="text-[10px] text-text-secondary">Return</span>
          </div>
          
          {/* Sharpe Impact */}
          <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-1 mb-1">
              {getImpactIcon('sharpe', impact.sharpe)}
              <span className={`text-xs font-semibold ${getImpactColor(impact.sharpe)}`}>
                {impact.sharpe > 0 ? `+${impact.sharpe}%` : `${impact.sharpe}%`}
              </span>
            </div>
            <span className="text-[10px] text-text-secondary">Sharpe</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-border-color flex items-center justify-between">
          <div className="flex gap-2">
            <button 
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              onClick={() => onFeedback(id, 'like')}
              title="This is helpful"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-text-secondary" />
            </button>
            <button 
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              onClick={() => onFeedback(id, 'dislike')}
              title="Not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-text-secondary" />
            </button>
          </div>
          
          <button className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover transition-colors">
            {action}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const RecommendationsPanel = () => {
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [filter, setFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: 'All', count: recommendations.length },
    { id: 'risk', label: 'Risk', count: recommendations.filter(r => r.type === 'risk').length },
    { id: 'opportunity', label: 'Opportunity', count: recommendations.filter(r => r.type === 'opportunity').length },
    { id: 'allocation', label: 'Allocation', count: recommendations.filter(r => r.type === 'allocation').length },
  ];
  
  const filteredRecommendations = filter === 'all' 
    ? recommendations
    : recommendations.filter(r => r.type === filter);
    
  const handleFeedback = (id, type) => {
    // In real app, send feedback to server
    console.log(`Recommendation ${id} received ${type} feedback`);
    // For demo, remove the recommendation
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card-bg rounded-xl border border-border-color overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border-color">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-bold text-text-primary">AI Recommendations</h2>
          </div>
          
          <span className="text-xs text-text-secondary">
            {recommendations.length} recommendations
          </span>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f.id 
                  ? 'bg-accent text-white' 
                  : 'bg-white/5 text-text-secondary hover:bg-white/10'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin">
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            <Sparkles className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="font-semibold">No {filter !== 'all' ? filter : ''} recommendations</p>
            <p className="text-xs mt-1">We'll generate more personalized suggestions soon</p>
          </div>
        ) : (
          filteredRecommendations.map(recommendation => (
            <RecommendationCard 
              key={recommendation.id} 
              recommendation={recommendation}
              onFeedback={handleFeedback}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default RecommendationsPanel;
