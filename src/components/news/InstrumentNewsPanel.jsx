import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, TrendingUp, TrendingDown, Clock, ExternalLink, Zap, Filter, Search } from 'lucide-react';
import { mockNews } from '@/data/newsData';

const InstrumentNewsPanel = ({ symbol, isOpen, onClose }) => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [aiSummary, setAiSummary] = useState(null);

  useEffect(() => {
    if (isOpen && symbol) {
      fetchInstrumentNews();
      generateAISummary();
    }
  }, [isOpen, symbol]);

  useEffect(() => {
    filterNews();
  }, [news, filter, searchTerm]);

  const fetchInstrumentNews = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Filter news relevant to the instrument
    const relevantNews = mockNews.filter(article => 
      article.symbols.includes(symbol) || 
      article.symbols.includes(symbol.substring(0, 3)) ||
      article.symbols.includes(symbol.substring(3, 6)) ||
      article.headline.toLowerCase().includes(symbol.toLowerCase())
    );

    // Add some additional mock news specific to the instrument
    const additionalNews = generateInstrumentSpecificNews(symbol);
    
    setNews([...relevantNews, ...additionalNews]);
    setLoading(false);
  };

  const generateInstrumentSpecificNews = (symbol) => {
    const templates = [
      {
        headline: `${symbol} breaks key technical resistance level`,
        sentiment: 'positive',
        impactScore: 4,
        category: getAssetCategory(symbol),
        content: `Technical analysis shows ${symbol} has successfully broken above a significant resistance level, potentially signaling further upward momentum.`
      },
      {
        headline: `Institutional flows show increased interest in ${symbol}`,
        sentiment: 'positive',
        impactScore: 3,
        category: getAssetCategory(symbol),
        content: `Recent institutional trading data indicates growing interest in ${symbol}, with significant inflows recorded over the past week.`
      },
      {
        headline: `${symbol} volatility expected ahead of key economic data`,
        sentiment: 'neutral',
        impactScore: 3,
        category: getAssetCategory(symbol),
        content: `Market analysts anticipate increased volatility in ${symbol} as traders position ahead of upcoming economic announcements.`
      }
    ];

    return templates.map((template, index) => ({
      id: `${symbol}_${index}`,
      headline: template.headline,
      source: 'Market Intelligence',
      timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`,
      sentiment: template.sentiment,
      impactScore: template.impactScore,
      category: template.category,
      symbols: [symbol],
      content: template.content,
      aiSummary: generateAINewsSummary(template.content)
    }));
  };

  const generateAISummary = async () => {
    if (news.length === 0) return;
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const summary = {
      overallSentiment: calculateOverallSentiment(news),
      keyThemes: extractKeyThemes(news),
      marketImpact: assessMarketImpact(news),
      summary: generateTextSummary(news, symbol)
    };
    
    setAiSummary(summary);
  };

  const generateAINewsSummary = (content) => {
    const summaries = [
      "Bullish technical breakout signals potential upward momentum",
      "Institutional interest driving increased trading volume",
      "Market positioning ahead of key economic events",
      "Technical analysis suggests continued trend strength",
      "Fundamental factors supporting current price action"
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  };

  const getAssetCategory = (symbol) => {
    if (symbol.includes('USD') || symbol.includes('EUR') || symbol.includes('GBP')) return 'Forex';
    if (symbol.includes('BTC') || symbol.includes('ETH')) return 'Crypto';
    return 'Stocks';
  };

  const calculateOverallSentiment = (newsArray) => {
    const sentimentScores = newsArray.map(article => {
      switch (article.sentiment) {
        case 'positive': return 1;
        case 'negative': return -1;
        default: return 0;
      }
    });
    
    const avgSentiment = sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length;
    
    if (avgSentiment > 0.3) return 'bullish';
    if (avgSentiment < -0.3) return 'bearish';
    return 'neutral';
  };

  const extractKeyThemes = (newsArray) => {
    const themes = ['Technical Analysis', 'Institutional Flow', 'Economic Data', 'Market Volatility', 'Regulatory News'];
    return themes.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const assessMarketImpact = (newsArray) => {
    const avgImpact = newsArray.reduce((sum, article) => sum + article.impactScore, 0) / newsArray.length;
    
    if (avgImpact >= 4) return 'high';
    if (avgImpact >= 3) return 'medium';
    return 'low';
  };

  const generateTextSummary = (newsArray, symbol) => {
    const summaries = [
      `Recent news flow for ${symbol} shows mixed sentiment with focus on technical developments and institutional activity.`,
      `${symbol} is experiencing increased attention due to key technical levels and upcoming economic events.`,
      `Market sentiment around ${symbol} remains cautiously optimistic with several positive catalysts identified.`,
      `News analysis suggests ${symbol} is at a critical juncture with potential for significant price movement.`
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  };

  const filterNews = () => {
    let filtered = news;
    
    if (filter !== 'all') {
      filtered = filtered.filter(article => article.sentiment === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredNews(filtered);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-accent-green';
      case 'negative': return 'text-accent-red';
      default: return 'text-accent-orange';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp size={14} />;
      case 'negative': return <TrendingDown size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getImpactColor = (score) => {
    if (score >= 4) return 'text-accent-red';
    if (score >= 3) return 'text-accent-orange';
    return 'text-accent-green';
  };

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
          initial={{ scale: 0.9, opacity: 0, x: 300 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 0.9, opacity: 0, x: 300 }}
          className="bg-card-bg rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-border-on-card"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-on-card">
            <div className="flex items-center gap-3">
              <Newspaper size={24} className="text-accent-orange" />
              <div>
                <h3 className="text-xl font-bold text-text-primary">News Feed</h3>
                <p className="text-text-secondary">{symbol} • Latest Updates</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              ×
            </button>
          </div>

          {/* AI Summary */}
          {aiSummary && (
            <div className="p-6 border-b border-border-on-card bg-gradient-to-r from-accent-orange/5 to-accent-blue/5">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={20} className="text-accent-orange" />
                <h4 className="text-lg font-semibold text-text-primary">AI News Summary</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm text-text-secondary">Overall Sentiment</div>
                  <div className={`text-lg font-bold ${getSentimentColor(aiSummary.overallSentiment)}`}>
                    {aiSummary.overallSentiment.toUpperCase()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-text-secondary">Market Impact</div>
                  <div className={`text-lg font-bold ${getImpactColor(4)}`}>
                    {aiSummary.marketImpact.toUpperCase()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-text-secondary">Key Themes</div>
                  <div className="text-sm text-text-primary">
                    {aiSummary.keyThemes.slice(0, 2).join(', ')}
                  </div>
                </div>
              </div>
              
              <p className="text-text-secondary italic">{aiSummary.summary}</p>
            </div>
          )}

          {/* Filters */}
          <div className="p-4 border-b border-border-on-card">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-text-secondary" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-primary-bg border border-border-on-card rounded px-3 py-1 text-text-primary focus:border-accent-orange focus:outline-none"
                >
                  <option value="all">All News</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>
              
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-1 bg-primary-bg border border-border-on-card rounded text-text-primary focus:border-accent-orange focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* News List */}
          <div className="max-h-[50vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="flex items-center gap-3">
                  <Zap size={24} className="text-accent-orange animate-pulse" />
                  <span className="text-text-primary">Loading news...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredNews.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 hover:bg-primary-bg/50 transition-colors border-b border-border-on-card/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        article.sentiment === 'positive' ? 'bg-accent-green/10' :
                        article.sentiment === 'negative' ? 'bg-accent-red/10' :
                        'bg-accent-orange/10'
                      }`}>
                        {getSentimentIcon(article.sentiment)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-text-primary font-medium leading-tight pr-4">
                            {article.headline}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-text-secondary whitespace-nowrap">
                            <span>{article.timestamp}</span>
                            <span className={`px-2 py-1 rounded ${getImpactColor(article.impactScore)} bg-current/10`}>
                              Impact: {article.impactScore}/5
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm text-text-secondary">{article.source}</span>
                          <span className="text-xs px-2 py-1 bg-accent-blue/10 text-accent-blue rounded">
                            {article.category}
                          </span>
                        </div>
                        
                        {article.aiSummary && (
                          <div className="bg-accent-orange/5 rounded-lg p-3 mb-2">
                            <div className="flex items-center gap-2 mb-1">
                              <Zap size={12} className="text-accent-orange" />
                              <span className="text-xs font-medium text-accent-orange">AI Summary</span>
                            </div>
                            <p className="text-sm text-text-secondary">{article.aiSummary}</p>
                          </div>
                        )}
                        
                        <p className="text-sm text-text-secondary mb-2" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {article.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {article.symbols.map((sym, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-primary-bg rounded font-mono">
                                {sym}
                              </span>
                            ))}
                          </div>
                          
                          <button className="flex items-center gap-1 text-xs text-accent-orange hover:text-accent-orange/80 transition-colors">
                            <ExternalLink size={12} />
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {filteredNews.length === 0 && !loading && (
                  <div className="text-center py-12 text-text-secondary">
                    No news found for the current filters
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstrumentNewsPanel;
