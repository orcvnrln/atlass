import React, { useState } from 'react';
import { Newspaper, TrendingUp, TrendingDown, Clock, ExternalLink, AlertTriangle, Target } from 'lucide-react';

interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  sentiment: number;
  trust: number;
  impactOnPrice: number;
  timeHorizon: string;
  confidence: number;
  category: string;
}

interface NewsTabProps {
  asset: string;
}

const NewsTab: React.FC<NewsTabProps> = ({ asset }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeFilter, setTimeFilter] = useState('24h');

  const newsItems: NewsItem[] = [
    {
      id: '1',
      headline: 'Federal Reserve keeps rates unchanged, signals possible cuts in 2025',
      source: 'Reuters',
      timestamp: '2 hours ago',
      sentiment: 0.78,
      trust: 0.92,
      impactOnPrice: 0.8,
      timeHorizon: '2h',
      confidence: 0.85,
      category: 'Macro',
    },
    {
      id: '2',
      headline: 'Bitcoin ETF inflows hit 3-month high',
      source: 'CoinDesk',
      timestamp: '4 hours ago',
      sentiment: 0.85,
      trust: 0.88,
      impactOnPrice: 1.5,
      timeHorizon: '24h',
      confidence: 0.92,
      category: 'Crypto',
    },
    {
      id: '3',
      headline: 'Crypto Market Volatility Index (CVIX) rises 12%',
      source: 'Bloomberg',
      timestamp: '6 hours ago',
      sentiment: -0.32,
      trust: 0.95,
      impactOnPrice: -0.5,
      timeHorizon: '4h',
      confidence: 0.78,
      category: 'Market',
    },
    {
      id: '4',
      headline: 'Major institutional investor announces $500M crypto allocation',
      source: 'Financial Times',
      timestamp: '8 hours ago',
      sentiment: 0.72,
      trust: 0.90,
      impactOnPrice: 2.1,
      timeHorizon: '48h',
      confidence: 0.88,
      category: 'Institutional',
    },
    {
      id: '5',
      headline: 'Regulatory clarity expected for crypto derivatives trading',
      source: 'Wall Street Journal',
      timestamp: '12 hours ago',
      sentiment: 0.65,
      trust: 0.93,
      impactOnPrice: 1.2,
      timeHorizon: '72h',
      confidence: 0.75,
      category: 'Regulatory',
    },
  ];

  const categories = ['All', 'Macro', 'Crypto', 'Market', 'Institutional', 'Regulatory'];
  const timeFilters = ['1h', '4h', '24h', '7d'];

  const filteredNews = newsItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesCategory;
  });

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.5) return 'text-emerald-400 bg-emerald-500/10';
    if (sentiment >= 0.1) return 'text-green-400 bg-green-500/10';
    if (sentiment >= -0.1) return 'text-slate-400 bg-slate-500/10';
    if (sentiment >= -0.5) return 'text-red-400 bg-red-500/10';
    return 'text-red-500 bg-red-500/10';
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment >= 0.5) return 'STRONGLY POSITIVE';
    if (sentiment >= 0.1) return 'POSITIVE';
    if (sentiment >= -0.1) return 'NEUTRAL';
    if (sentiment >= -0.5) return 'NEGATIVE';
    return 'STRONGLY NEGATIVE';
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 1.5) return 'text-emerald-400';
    if (impact >= 0.5) return 'text-green-400';
    if (impact >= -0.5) return 'text-slate-400';
    if (impact >= -1.5) return 'text-red-400';
    return 'text-red-500';
  };

  const getImpactLabel = (impact: number) => {
    if (impact >= 1.5) return 'HIGH';
    if (impact >= 0.5) return 'MEDIUM';
    if (impact >= -0.5) return 'LOW';
    if (impact >= -1.5) return 'MEDIUM';
    return 'HIGH';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Newspaper size={24} className="text-blue-400" />
          News Impact Analysis - {asset}
        </h3>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Updates</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Category:</span>
          <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-slate-700 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Time:</span>
          <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
            {timeFilters.map((time) => (
              <button
                key={time}
                onClick={() => setTimeFilter(time)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  timeFilter === time
                    ? 'bg-slate-700 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Items */}
      <div className="space-y-4">
        {filteredNews.map((item) => (
          <div key={item.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-slate-100 mb-2 leading-relaxed">
                  {item.headline}
                </h4>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <ExternalLink size={14} />
                    <span>{item.source}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{item.timestamp}</span>
                  </div>
                  <span className="px-2 py-1 bg-slate-700 rounded text-xs">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-1">Sentiment</div>
                <div className={`px-2 py-1 rounded text-xs font-semibold ${getSentimentColor(item.sentiment)}`}>
                  {getSentimentLabel(item.sentiment)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {item.sentiment > 0 ? '+' : ''}{item.sentiment.toFixed(2)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-1">Trust Score</div>
                <div className="text-lg font-bold text-blue-400">
                  {(item.trust * 100).toFixed(0)}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-1">Price Impact</div>
                <div className={`text-lg font-bold ${getImpactColor(item.impactOnPrice)}`}>
                  {item.impactOnPrice > 0 ? '+' : ''}{item.impactOnPrice.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500">
                  {getImpactLabel(item.impactOnPrice)} impact
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-1">Time Horizon</div>
                <div className="text-lg font-bold text-purple-400">
                  {item.timeHorizon}
                </div>
                <div className="text-xs text-slate-500">
                  {(item.confidence * 100).toFixed(0)}% confidence
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-purple-400" />
                <span className="text-sm font-semibold text-slate-200">AI Analysis</span>
              </div>
              <p className="text-sm text-slate-300">
                {item.sentiment > 0 
                  ? `This news is expected to have a ${item.impactOnPrice > 0 ? 'positive' : 'negative'} impact on ${asset} prices. ` +
                    `Historical analysis shows similar news typically moves prices by ${Math.abs(item.impactOnPrice)}% within ${item.timeHorizon}. ` +
                    `Confidence level: ${(item.confidence * 100).toFixed(0)}%.`
                  : `This news may create ${item.impactOnPrice > 0 ? 'upward' : 'downward'} pressure on ${asset}. ` +
                    `Market sentiment analysis indicates ${Math.abs(item.impactOnPrice)}% expected movement within ${item.timeHorizon}. ` +
                    `Risk assessment: ${(item.confidence * 100).toFixed(0)}% confidence.`
                }
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-4">
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white">
                Set Alert
              </button>
              <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm text-slate-300">
                Track Impact
              </button>
              <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm text-slate-300">
                Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Market Sentiment Summary */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-green-400" />
          Market Sentiment Summary (Last 24h)
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">+0.65</div>
            <div className="text-sm text-slate-400">Overall Sentiment</div>
            <div className="text-xs text-slate-500">Positive bias</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">89%</div>
            <div className="text-sm text-slate-400">Trust Score</div>
            <div className="text-xs text-slate-500">High reliability</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">+1.2%</div>
            <div className="text-sm text-slate-400">Expected Impact</div>
            <div className="text-xs text-slate-500">Next 24h</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">5</div>
            <div className="text-sm text-slate-400">High Impact News</div>
            <div className="text-xs text-slate-500">Past 24h</div>
          </div>
        </div>
      </div>

      {/* News Alerts */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-yellow-400" />
          Active News Alerts
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <TrendingUp size={16} className="text-green-400" />
            <div className="flex-1">
              <p className="text-sm text-slate-200">
                <strong>Fed Rate Decision:</strong> Monitoring for potential market impact
              </p>
              <p className="text-xs text-slate-400">Alert set for 2:00 PM EST</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertTriangle size={16} className="text-yellow-400" />
            <div className="flex-1">
              <p className="text-sm text-slate-200">
                <strong>Regulatory News:</strong> Crypto regulation updates expected
              </p>
              <p className="text-xs text-slate-400">Alert set for any regulatory news</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Target size={16} className="text-blue-400" />
            <div className="flex-1">
              <p className="text-sm text-slate-200">
                <strong>Institutional Activity:</strong> Large fund announcements
              </p>
              <p className="text-xs text-slate-400">Alert set for $100M+ allocations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTab;
