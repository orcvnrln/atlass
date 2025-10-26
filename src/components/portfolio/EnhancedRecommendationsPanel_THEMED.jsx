import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronRight,
  Calendar,
  BarChart4,
  LineChart,
  Scale,
  DollarSign,
  Info,
  AlertTriangle,
  ChevronDown,
  Twitter,
  Newspaper,
  Activity,
  ArrowRight
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
    action: 'View Bond ETFs',
    explanation: [
      { reason: 'Macro regime "risk-off" signals', source: 'macro' },
      { reason: 'Your portfolio beta (1.24) is higher than optimal', source: 'risk' },
      { reason: 'Bond-equity correlation turning negative', source: 'technical' }
    ]
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
    action: 'View Rebalancing Plan',
    explanation: [
      { reason: 'Tech sector concentration risk', source: 'risk' },
      { reason: 'Sector rotation signals emerging', source: 'technical' },
      { reason: 'Valuation metrics above historical average', source: 'fundamental' }
    ]
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
    iconColor: 'text-green-400',
    action: 'View Value ETFs',
    explanation: [
      { reason: 'Value-Growth spread at 20-year high', source: 'technical' },
      { reason: 'Rising rate environment favors value', source: 'macro' },
      { reason: 'Mean reversion probability 78%', source: 'statistical' }
    ]
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
    action: 'View Risk Analysis',
    explanation: [
      { reason: 'Single stock >10% creates high concentration risk', source: 'risk' },
      { reason: 'EV sector facing increased competition', source: 'news' },
      { reason: 'Volatility 2.5x higher than portfolio average', source: 'statistical' }
    ]
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
    action: 'View International ETFs',
    explanation: [
      { reason: 'US-International correlation at 5-year low', source: 'technical' },
      { reason: 'Valuation gap widening', source: 'fundamental' },
      { reason: 'Currency diversification benefits', source: 'risk' }
    ]
  },
  {
    id: 6,
    type: 'predictive',
    title: 'DXY Index Rising Alert',
    description: 'Növbəti 48 saat ərzində DXY indeksi 102-yə qalxma ehtimalı 78%. Bu, kripto və EUR/USD üçün mənfi təsir yaradacaq.',
    impact: {
      risk: +5,
      return: -3,
      sharpe: -4,
    },
    confidence: 78,
    timeframe: 'Immediate',
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    action: 'View Hedging Options',
    explanation: [
      { reason: 'Fed hawkish comments in recent minutes', source: 'news' },
      { reason: 'Technical breakout on DXY chart', source: 'technical' },
      { reason: 'Negative correlation with your crypto holdings', source: 'statistical' }
    ],
    recommendation: 'Bugün axşam 5% kripto satıb 2-illik US Treasuries almağı tövsiyə edirik.',
    backtest: {
      performance: '+12%',
      period: '3 years',
      winRate: '68%'
    }
  },
  {
    id: 7,
    type: 'benchmark',
    title: 'Custom Benchmark Created',
    description: 'Sizin portfelinizə uyğun xüsusi benchmark yaradıldı: 30% Crypto + 35% Stocks + 20% Forex.',
    impact: {
      risk: 0,
      return: 0,
      sharpe: 0,
    },
    confidence: 95,
    timeframe: 'Long Term',
    icon: BarChart4,
    iconColor: 'text-blue-400',
    action: 'View Benchmark Details',
    explanation: [
      { reason: 'Your unique asset allocation', source: 'portfolio' },
      { reason: 'Peer group analysis (250+ similar portfolios)', source: 'statistical' },
      { reason: 'Current macro regime considerations', source: 'macro' }
    ],
    benchmarkPerformance: {
      yourReturn: '+15.8%',
      benchmarkReturn: '+13.7%',
      alpha: '+2.1%',
      period: '1M'
    }
  },
  {
    id: 8,
    type: 'calendar',
    title: 'CPI Data Release Tomorrow',
    description: 'CPI gözləniləndən yüksək gələrsə, sizin AAPL və EUR/USD mövqeləriniz risk altındadır.',
    impact: {
      risk: +12,
      return: -6,
      sharpe: -8,
    },
    confidence: 82,
    timeframe: 'Immediate',
    icon: Calendar,
    iconColor: 'text-purple-400',
    action: 'View Hedging Strategy',
    explanation: [
      { reason: 'Historical post-CPI volatility analysis', source: 'statistical' },
      { reason: 'Your positions sensitive to inflation data', source: 'portfolio' },
      { reason: 'Analyst expectations above consensus', source: 'news' }
    ],
    calendarEvent: {
      event: 'CPI Data Release',
      date: 'Tomorrow, 8:30 AM EST',
      impact: 'High',
      recommendation: 'Hadisədən əvvəl AAPL mövqeyinin 20%-ni hedc etməyi düşünün (SPY put).'
    }
  },
  {
    id: 9,
    type: 'sentiment',
    title: 'Crypto Fear Level Rising',
    description: 'Kripto bazarında "qorxu" səviyyəsi son 24 saatda 40%-dən 65%-ə yüksəlib. Portfeliniz bu sektor üçün həssasdır.',
    impact: {
      risk: +15,
      return: -8,
      sharpe: -10,
    },
    confidence: 88,
    timeframe: 'Immediate',
    icon: Twitter,
    iconColor: 'text-blue-400',
    action: 'View Sentiment Analysis',
    explanation: [
      { reason: 'Social media sentiment analysis', source: 'sentiment' },
      { reason: 'On-chain metrics deteriorating', source: 'onchain' },
      { reason: 'News flow turning negative', source: 'news' }
    ],
    sentimentData: {
      twitter: '65% negative',
      onchain: '30% decrease in activity',
      news: '72% bearish headlines',
      change: '+25% fear increase in 24h'
    }
  }
];

// Helper functions
const getImpactColor = (value) => {
  if (value > 0) return 'text-green-400';
  if (value < 0) return 'text-red-400';
  return 'text-gray-400';
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
      return <Clock className="w-3 h-3 text-gray-400" />;
  }
};

const getSourceIcon = (source) => {
  switch (source) {
    case 'technical':
      return <LineChart className="w-3 h-3 text-blue-400" />;
    case 'fundamental':
      return <DollarSign className="w-3 h-3 text-green-400" />;
    case 'news':
      return <Newspaper className="w-3 h-3 text-amber-400" />;
    case 'sentiment':
      return <Twitter className="w-3 h-3 text-blue-400" />;
    case 'onchain':
      return <Activity className="w-3 h-3 text-purple-400" />;
    case 'macro':
      return <BarChart4 className="w-3 h-3 text-cyan-400" />;
    case 'risk':
      return <ShieldCheck className="w-3 h-3 text-red-400" />;
    case 'statistical':
      return <BarChart4 className="w-3 h-3 text-indigo-400" />;
    case 'portfolio':
      return <PieChart className="w-3 h-3 text-orange-400" />;
    default:
      return <Info className="w-3 h-3 text-gray-400" />;
  }
};

const RecommendationCard = ({ recommendation, onFeedback }) => {
  const { id, type, title, description, impact, confidence, timeframe, icon: Icon, iconColor, action, explanation } = recommendation;
  const [showExplanation, setShowExplanation] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1E1E24] border border-gray-800 rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800">
        <div className={`p-2.5 rounded-lg bg-[#0F0F12] ring-1 ring-gray-700`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            {/* Timeframe */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0F0F12] text-[10px] font-medium">
              {getTimeframeIcon(timeframe)}
              <span className="text-gray-300">{timeframe}</span>
            </div>
            
            {/* Confidence */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
              <span>{confidence}% confidence</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-300 leading-relaxed">
          {description}
        </p>
        
        {/* Impact */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {/* Risk Impact */}
          <div className="flex flex-col items-center p-2 rounded-lg bg-[#0F0F12]">
            <div className="flex items-center gap-1 mb-1">
              {impact.risk > 0 ? 
                <TrendingUp className="w-3 h-3 text-red-400" /> : 
                <TrendingDown className="w-3 h-3 text-green-400" />
              }
              <span className={`text-xs font-semibold ${getImpactColor(impact.risk === 0 ? 0 : -impact.risk)}`}>
                {impact.risk > 0 ? `+${impact.risk}%` : `${impact.risk}%`}
              </span>
            </div>
            <span className="text-[10px] text-gray-400">Risk</span>
          </div>
          
          {/* Return Impact */}
          <div className="flex flex-col items-center p-2 rounded-lg bg-[#0F0F12]">
            <div className="flex items-center gap-1 mb-1">
              {impact.return > 0 ? 
                <TrendingUp className="w-3 h-3 text-green-400" /> : 
                <TrendingDown className="w-3 h-3 text-red-400" />
              }
              <span className={`text-xs font-semibold ${getImpactColor(impact.return)}`}>
                {impact.return > 0 ? `+${impact.return}%` : `${impact.return}%`}
              </span>
            </div>
            <span className="text-[10px] text-gray-400">Return</span>
          </div>
          
          {/* Sharpe Impact */}
          <div className="flex flex-col items-center p-2 rounded-lg bg-[#0F0F12]">
            <div className="flex items-center gap-1 mb-1">
              {impact.sharpe > 0 ? 
                <TrendingUp className="w-3 h-3 text-green-400" /> : 
                <TrendingDown className="w-3 h-3 text-red-400" />
              }
              <span className={`text-xs font-semibold ${getImpactColor(impact.sharpe)}`}>
                {impact.sharpe > 0 ? `+${impact.sharpe}%` : `${impact.sharpe}%`}
              </span>
            </div>
            <span className="text-[10px] text-gray-400">Sharpe</span>
          </div>
        </div>
        
        {/* Special Content Based on Type */}
        {recommendation.predictive && (
          <div className="mt-4 p-3 rounded-lg bg-[#0F0F12] border border-amber-500/20">
            <p className="text-xs text-amber-400 font-medium">
              {recommendation.recommendation}
            </p>
            <div className="mt-2 flex items-center justify-between text-[10px] text-amber-300">
              <span>Backtest: {recommendation.backtest.performance} over {recommendation.backtest.period}</span>
              <span>Win Rate: {recommendation.backtest.winRate}</span>
            </div>
          </div>
        )}
        
        {recommendation.benchmarkPerformance && (
          <div className="mt-4 p-3 rounded-lg bg-[#0F0F12] border border-blue-500/20">
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-400">Your Return:</span>
              <span className="text-xs font-bold text-green-400">{recommendation.benchmarkPerformance.yourReturn}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-blue-400">Benchmark:</span>
              <span className="text-xs font-bold text-blue-400">{recommendation.benchmarkPerformance.benchmarkReturn}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-blue-400">Alpha:</span>
              <span className="text-xs font-bold text-green-400">{recommendation.benchmarkPerformance.alpha}</span>
            </div>
          </div>
        )}
        
        {recommendation.calendarEvent && (
          <div className="mt-4 p-3 rounded-lg bg-[#0F0F12] border border-[#8B5CF6]/20">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#8B5CF6]">{recommendation.calendarEvent.event}</span>
              <span className="text-xs font-bold text-[#8B5CF6]">{recommendation.calendarEvent.date}</span>
            </div>
            <p className="mt-2 text-xs text-gray-300">
              {recommendation.calendarEvent.recommendation}
            </p>
          </div>
        )}
        
        {recommendation.sentimentData && (
          <div className="mt-4 p-3 rounded-lg bg-[#0F0F12] border border-blue-500/20">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-400">Twitter:</span>
                <span className="text-xs text-red-400">{recommendation.sentimentData.twitter}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-400">On-chain:</span>
                <span className="text-xs text-red-400">{recommendation.sentimentData.onchain}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-400">News:</span>
                <span className="text-xs text-red-400">{recommendation.sentimentData.news}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-400">Change:</span>
                <span className="text-xs text-red-400">{recommendation.sentimentData.change}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Explainable AI */}
        <div className="mt-4">
          <button 
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center justify-between w-full p-2 rounded-lg bg-[#0F0F12] hover:bg-[#0F0F12]/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-300">Why this recommendation?</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showExplanation ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 space-y-1.5"
              >
                {explanation.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg bg-[#0F0F12]"
                  >
                    {getSourceIcon(item.source)}
                    <span className="text-xs text-gray-300">{item.reason}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
          <div className="flex gap-2">
            <button 
              className="p-1.5 rounded-lg bg-[#0F0F12] hover:bg-[#0F0F12]/80 transition-colors"
              onClick={() => onFeedback(id, 'like')}
              title="This is helpful"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button 
              className="p-1.5 rounded-lg bg-[#0F0F12] hover:bg-[#0F0F12]/80 transition-colors"
              onClick={() => onFeedback(id, 'dislike')}
              title="Not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
          
          <button className="flex items-center gap-1.5 text-xs font-medium text-[#8B5CF6] hover:text-[#A78BFA] transition-colors">
            {action}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const EnhancedRecommendationsPanel = () => {
  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [filter, setFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: 'All', count: recommendations.length },
    { id: 'allocation', label: 'Allocation', count: recommendations.filter(r => r.type === 'allocation').length },
    { id: 'opportunity', label: 'Opportunity', count: recommendations.filter(r => r.type === 'opportunity').length },
    { id: 'risk', label: 'Risk', count: recommendations.filter(r => r.type === 'risk').length },
    { id: 'predictive', label: 'Predictive', count: recommendations.filter(r => r.type === 'predictive').length },
    { id: 'calendar', label: 'Calendar', count: recommendations.filter(r => r.type === 'calendar').length },
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
      className="bg-[#1E1E24] rounded-xl border border-gray-800 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#8B5CF6]/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <h2 className="font-bold text-white">AI Recommendations</h2>
          </div>
          
          <span className="text-xs text-gray-400">
            {recommendations.length} recommendations
          </span>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f.id 
                  ? 'bg-[#8B5CF6] text-white' 
                  : 'bg-[#0F0F12] text-gray-400 hover:bg-[#0F0F12]/80'
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
          <div className="text-center py-8 text-gray-400">
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

export default EnhancedRecommendationsPanel;
