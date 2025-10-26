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
  DollarSign,
  Info,
  AlertTriangle,
  ChevronDown,
  Twitter,
  Newspaper,
  Activity,
  Brain,
  Globe2,
  Radar,
  Lightbulb,
  Goal,
  Layers,
  Zap,
  Heart
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
    iconColor: 'text-positive',
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

const featureHighlights = [
  {
    id: 'health-score',
    label: 'Health Score',
    description: '0-100 dynamic portfolio wellness rating',
    icon: Heart,
    accent: 'from-emerald-400/20 via-emerald-500/10 to-emerald-400/5'
  },
  {
    id: 'position-coaching',
    label: 'Position Coaching',
    description: 'Asset-level insights with confidence and actions',
    icon: Brain,
    accent: 'from-cyan-400/20 via-cyan-500/10 to-cyan-400/5'
  },
  {
    id: 'predictive-rebalancing',
    label: 'Predictive Rebalancing',
    description: '48h forward-looking rebalance playbooks',
    icon: Shuffle,
    accent: 'from-violet-400/20 via-violet-500/10 to-violet-400/5'
  },
  {
    id: 'dynamic-benchmarking',
    label: 'Dynamic Benchmarking',
    description: 'Peer cohort & macro-adjusted benchmarks',
    icon: BarChart4,
    accent: 'from-blue-400/20 via-blue-500/10 to-blue-400/5'
  },
  {
    id: 'ai-copilot',
    label: 'AI Copilot',
    description: 'Proactive alerts & conversational execution',
    icon: Zap,
    accent: 'from-amber-400/20 via-amber-500/10 to-amber-400/5'
  },
  {
    id: 'sentiment-fusion',
    label: 'Sentiment Fusion',
    description: 'Cross-asset signals from news, on-chain, social',
    icon: Radar,
    accent: 'from-rose-400/20 via-rose-500/10 to-rose-400/5'
  },
  {
    id: 'ai-calendar',
    label: 'AI Calendar',
    description: 'Event-linked impact and hedging playbooks',
    icon: Calendar,
    accent: 'from-indigo-400/20 via-indigo-500/10 to-indigo-400/5'
  },
  {
    id: 'learning-loop',
    label: 'Learning Loop',
    description: 'Adaptive preferences & behavioral memory',
    icon: Goal,
    accent: 'from-orange-400/20 via-orange-500/10 to-orange-400/5'
  },
  {
    id: 'explainable-ai',
    label: 'Explainable AI',
    description: 'Transparent rationale for every action',
    icon: Lightbulb,
    accent: 'from-yellow-400/20 via-yellow-500/10 to-yellow-400/5'
  },
  {
    id: 'scenario-planning',
    label: 'Scenario Planning',
    description: 'Stress-test Fed, macro & volatility shocks',
    icon: Layers,
    accent: 'from-slate-400/20 via-slate-500/10 to-slate-400/5'
  }
];

// Helper functions
const getImpactColor = (value) => {
  if (value > 0) return 'text-emerald-400';
  if (value < 0) return 'text-rose-400';
  return 'text-slate-400';
};

const getImpactBg = (value) => {
  if (value > 0) return 'bg-emerald-500/10 border border-emerald-500/30';
  if (value < 0) return 'bg-rose-500/10 border border-rose-500/30';
  return 'bg-slate-500/10 border border-slate-500/20';
};

const getTimeframeIcon = (timeframe) => {
  switch (timeframe) {
    case 'Immediate':
      return <Clock className="w-3 h-3 text-rose-400" />;
    case 'Medium Term':
      return <Clock className="w-3 h-3 text-amber-300" />;
    case 'Long Term':
      return <Clock className="w-3 h-3 text-sky-300" />;
    default:
      return <Clock className="w-3 h-3 text-slate-400" />;
  }
};

const getTypeBadgeStyle = (type) => {
  switch (type) {
    case 'allocation':
      return 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30';
    case 'opportunity':
      return 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30';
    case 'risk':
      return 'bg-rose-500/10 text-rose-300 border border-rose-500/30';
    case 'predictive':
      return 'bg-violet-500/10 text-violet-300 border border-violet-500/30';
    case 'calendar':
      return 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30';
    case 'benchmark':
      return 'bg-blue-500/10 text-blue-300 border border-blue-500/30';
    case 'sentiment':
      return 'bg-amber-500/10 text-amber-300 border border-amber-500/30';
    case 'rebalance':
      return 'bg-teal-500/10 text-teal-300 border border-teal-500/30';
    default:
      return 'bg-slate-500/10 text-slate-300 border border-slate-500/30';
  }
};

const getSourceIcon = (source) => {
  switch (source) {
    case 'technical':
      return <LineChart className="w-3 h-3 text-sky-300" />;
    case 'fundamental':
      return <DollarSign className="w-3 h-3 text-emerald-300" />;
    case 'news':
      return <Newspaper className="w-3 h-3 text-amber-300" />;
    case 'sentiment':
      return <Twitter className="w-3 h-3 text-blue-300" />;
    case 'onchain':
      return <Activity className="w-3 h-3 text-purple-300" />;
    case 'macro':
      return <BarChart4 className="w-3 h-3 text-cyan-300" />;
    case 'risk':
      return <ShieldCheck className="w-3 h-3 text-rose-300" />;
    case 'statistical':
      return <BarChart4 className="w-3 h-3 text-indigo-300" />;
    case 'portfolio':
      return <PieChart className="w-3 h-3 text-orange-300" />;
    default:
      return <Info className="w-3 h-3 text-slate-400" />;
  }
};

const RecommendationCard = ({ recommendation, onFeedback }) => {
  const { id, type, title, description, impact, confidence, timeframe, icon: Icon, action, explanation } = recommendation;
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-800 bg-[#111118] shadow-[0_10px_40px_-20px_rgba(139,92,246,0.45)] overflow-hidden"
    >
      <div className="p-4 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#8B5CF6]/40 via-[#8B5CF6]/10 to-transparent blur-lg"></div>
              <div className="relative p-3 rounded-xl bg-[#1A1A22] border border-[#8B5CF6]/30">
                <Icon className="w-5 h-5 text-[#C7A6FF]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-white/90">{title}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${getTypeBadgeStyle(type)}`}>
                  {type}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  {getTimeframeIcon(timeframe)}
                  {timeframe}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {confidence}% confidence
                </span>
              </div>
            </div>
          </div>
          <button className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C7A6FF] hover:text-white transition-colors">
            {action}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          {description}
        </p>

        {/* Impact grid */}
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
          <div className={`p-3 rounded-xl backdrop-blur-sm ${getImpactBg(impact.risk)} flex flex-col gap-1`}>
            <span className="text-[11px] text-slate-300">Risk Impact</span>
            <span className={`text-sm font-semibold ${getImpactColor(impact.risk)}`}>
              {impact.risk > 0 ? `+${impact.risk}%` : `${impact.risk}%`}
            </span>
          </div>
          <div className={`p-3 rounded-xl backdrop-blur-sm ${getImpactBg(impact.return)} flex flex-col gap-1`}>
            <span className="text-[11px] text-slate-300">Return Delta</span>
            <span className={`text-sm font-semibold ${getImpactColor(impact.return)}`}>
              {impact.return > 0 ? `+${impact.return}%` : `${impact.return}%`}
            </span>
          </div>
          <div className={`p-3 rounded-xl backdrop-blur-sm ${getImpactBg(impact.sharpe)} flex flex-col gap-1`}>
            <span className="text-[11px] text-slate-300">Sharpe Effect</span>
            <span className={`text-sm font-semibold ${getImpactColor(impact.sharpe)}`}>
              {impact.sharpe > 0 ? `+${impact.sharpe}%` : `${impact.sharpe}%`}
            </span>
          </div>
        </div>

        {/* Special sections */}
        {recommendation.type === 'predictive' && recommendation.backtest && (
          <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-xs text-violet-100 space-y-2">
            <p className="font-semibold text-violet-200">Predictive Signal</p>
            <p className="text-violet-100/90">{recommendation.recommendation}</p>
            <div className="flex flex-wrap gap-4 text-[11px] text-violet-200/80">
              <span>Backtest: {recommendation.backtest.performance} over {recommendation.backtest.period}</span>
              <span>Win Rate: {recommendation.backtest.winRate}</span>
            </div>
          </div>
        )}

        {recommendation.benchmarkPerformance && (
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-xs text-blue-100 space-y-2">
            <p className="font-semibold text-blue-200">Benchmark Comparison</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <span className="flex flex-col">
                <span className="text-blue-300/80">Your Return</span>
                <span className="text-emerald-300 font-semibold">{recommendation.benchmarkPerformance.yourReturn}</span>
              </span>
              <span className="flex flex-col">
                <span className="text-blue-300/80">Benchmark</span>
                <span className="text-blue-200 font-semibold">{recommendation.benchmarkPerformance.benchmarkReturn}</span>
              </span>
              <span className="flex flex-col">
                <span className="text-blue-300/80">Alpha</span>
                <span className="text-emerald-300 font-semibold">{recommendation.benchmarkPerformance.alpha}</span>
              </span>
            </div>
          </div>
        )}

        {recommendation.calendarEvent && (
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-xs text-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-indigo-200">{recommendation.calendarEvent.event}</span>
              <span className="text-[11px] text-indigo-300">{recommendation.calendarEvent.date}</span>
            </div>
            <p className="text-indigo-100/80">{recommendation.calendarEvent.recommendation}</p>
          </div>
        )}

        {recommendation.sentimentData && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-100 space-y-2">
            <p className="font-semibold text-amber-200">Sentiment Snapshot</p>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-amber-200/80">
              <span>Twitter: {recommendation.sentimentData.twitter}</span>
              <span>On-chain: {recommendation.sentimentData.onchain}</span>
              <span>News: {recommendation.sentimentData.news}</span>
              <span>Change: {recommendation.sentimentData.change}</span>
            </div>
          </div>
        )}

        {/* Explainable AI */}
        <div className="rounded-xl border border-slate-800 bg-[#0B0B11]">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs text-slate-300"
          >
            <span className="inline-flex items-center gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              Why this recommendation?
            </span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showExplanation ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 space-y-2"
              >
                {explanation.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                    {getSourceIcon(item.source)}
                    <span className="leading-snug">{item.reason}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 text-slate-400">
          <div className="inline-flex items-center gap-2">
            <button
              className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-[#1C1C25] border border-slate-700 hover:border-emerald-400/60 transition-colors"
              onClick={() => onFeedback(id, 'like')}
              title="Helpful"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-[#1C1C25] border border-slate-700 hover:border-rose-400/60 transition-colors"
              onClick={() => onFeedback(id, 'dislike')}
              title="Not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
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
    { id: 'rebalance', label: 'Rebalance', count: recommendations.filter(r => r.type === 'rebalance').length },
    { id: 'risk', label: 'Risk', count: recommendations.filter(r => r.type === 'risk').length },
    { id: 'predictive', label: 'Predictive', count: recommendations.filter(r => r.type === 'predictive').length },
    { id: 'benchmark', label: 'Benchmark', count: recommendations.filter(r => r.type === 'benchmark').length },
    { id: 'calendar', label: 'Calendar', count: recommendations.filter(r => r.type === 'calendar').length },
    { id: 'sentiment', label: 'Sentiment', count: recommendations.filter(r => r.type === 'sentiment').length },
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
      <div className="p-4 border-b border-border-color space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-bold text-text-primary">AI Recommendations</h2>
              <p className="text-xs text-text-secondary">Intelligent, explainable insights powered by your AI stack</p>
            </div>
          </div>

          <span className="text-xs text-text-secondary">
            {recommendations.length} live strategies
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2">
            {featureHighlights.map(feature => (
              <div
                key={feature.id}
                className={`relative p-3 rounded-xl bg-gradient-to-br ${feature.accent} border border-white/5`}
              >
                <div className="flex items-center gap-2">
                  <feature.icon className="w-4 h-4 text-white/80" />
                  <span className="text-[11px] font-semibold text-white/90 uppercase tracking-wide">
                    {feature.label}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-white/70 leading-snug">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
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

export default EnhancedRecommendationsPanel;
