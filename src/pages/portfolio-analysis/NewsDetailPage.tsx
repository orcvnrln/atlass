import React, { useState } from 'react';
import { ArrowLeft, Newspaper, TrendingUp, TrendingDown, Minus, Filter, Search, Clock, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

const NewsDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [selectedImpact, setSelectedImpact] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allNews = [
    {
      id: 1,
      headline: 'Bitcoin ETF sees $500M inflow amid Fed rate pause',
      summary: 'Major institutional investors continue to pour money into Bitcoin ETFs as Federal Reserve signals potential pause in rate hikes. BlackRock\'s IBIT leads with $200M in single-day inflows.',
      source: 'Bloomberg',
      time: '2h ago',
      readTime: '3 min read',
      relevance: 'Affects BTC (35% of portfolio)',
      impact: 'Positive',
      impactScore: 8.5,
      affectedAssets: ['BTC', 'ETH'],
      category: 'Cryptocurrency',
      thumbnail: '/api/placeholder/400/200',
      url: 'https://bloomberg.com/news/bitcoin-etf-inflows',
      tags: ['Bitcoin', 'ETF', 'Federal Reserve', 'Institutional Investment']
    },
    {
      id: 2,
      headline: 'Apple reports Q3 earnings beat expectations',
      summary: 'Apple Inc. reported quarterly earnings of $1.46 per share, beating analyst estimates of $1.39. iPhone sales showed resilience despite global economic headwinds.',
      source: 'CNBC',
      time: '4h ago',
      readTime: '4 min read',
      relevance: 'AAPL (12% of portfolio)',
      impact: 'Neutral',
      impactScore: 6.2,
      affectedAssets: ['AAPL'],
      category: 'Earnings',
      thumbnail: '/api/placeholder/400/201',
      url: 'https://cnbc.com/apple-earnings-q3',
      tags: ['Apple', 'Earnings', 'iPhone', 'Technology']
    },
    {
      id: 3,
      headline: 'US Dollar Index (DXY) hits 3-month high',
      summary: 'The US Dollar strengthened against major currencies as investors seek safe haven assets amid global economic uncertainty. EUR/USD falls to 1.0820.',
      source: 'Reuters',
      time: '6h ago',
      readTime: '2 min read',
      relevance: 'Affects EURUSD, GBPUSD',
      impact: 'Negative',
      impactScore: 7.1,
      affectedAssets: ['EURUSD', 'GBPUSD'],
      category: 'Forex',
      thumbnail: '/api/placeholder/400/202',
      url: 'https://reuters.com/dollar-strength',
      tags: ['US Dollar', 'Forex', 'Safe Haven', 'Currency']
    },
    {
      id: 4,
      headline: 'Tesla announces new Gigafactory in Mexico',
      summary: 'Tesla reveals plans for a new manufacturing facility in Monterrey, Mexico, expected to produce 2 million vehicles annually by 2026. Stock rises 3.2% in after-hours trading.',
      source: 'Wall Street Journal',
      time: '8h ago',
      readTime: '5 min read',
      relevance: 'TSLA (18% of portfolio)',
      impact: 'Positive',
      impactScore: 8.8,
      affectedAssets: ['TSLA'],
      category: 'Corporate News',
      thumbnail: '/api/placeholder/400/203',
      url: 'https://wsj.com/tesla-mexico-factory',
      tags: ['Tesla', 'Manufacturing', 'Mexico', 'Electric Vehicles']
    },
    {
      id: 5,
      headline: 'Gold prices surge on inflation concerns',
      summary: 'Gold futures climb 2.1% to $2,045/oz as investors hedge against persistent inflation. Central bank purchases reach highest level since 2010.',
      source: 'MarketWatch',
      time: '10h ago',
      readTime: '3 min read',
      relevance: 'XAU (14% of portfolio)',
      impact: 'Positive',
      impactScore: 7.8,
      affectedAssets: ['XAU', 'GLD'],
      category: 'Commodities',
      thumbnail: '/api/placeholder/400/204',
      url: 'https://marketwatch.com/gold-surge',
      tags: ['Gold', 'Inflation', 'Commodities', 'Central Banks']
    },
    {
      id: 6,
      headline: 'Google announces AI breakthrough in quantum computing',
      summary: 'Alphabet\'s Google reveals significant progress in quantum error correction, potentially accelerating practical quantum computing applications by 5-10 years.',
      source: 'TechCrunch',
      time: '12h ago',
      readTime: '6 min read',
      relevance: 'GOOGL (5% of portfolio)',
      impact: 'Positive',
      impactScore: 9.2,
      affectedAssets: ['GOOGL', 'MSFT'],
      category: 'Technology',
      thumbnail: '/api/placeholder/400/205',
      url: 'https://techcrunch.com/google-quantum',
      tags: ['Google', 'Quantum Computing', 'AI', 'Technology']
    },
    {
      id: 7,
      headline: 'Oil prices drop on China demand concerns',
      summary: 'Crude oil falls 2.8% as weak Chinese manufacturing data raises concerns about global energy demand. WTI crude trades below $75/barrel.',
      source: 'Financial Times',
      time: '14h ago',
      readTime: '4 min read',
      relevance: 'Energy sector exposure',
      impact: 'Negative',
      impactScore: 6.5,
      affectedAssets: ['XLE', 'USO'],
      category: 'Energy',
      thumbnail: '/api/placeholder/400/206',
      url: 'https://ft.com/oil-prices-china',
      tags: ['Oil', 'China', 'Energy', 'Manufacturing']
    },
    {
      id: 8,
      headline: 'Federal Reserve hints at dovish pivot',
      summary: 'Fed Chair Powell suggests central bank may pause rate hikes if inflation continues to moderate. Markets rally on dovish commentary.',
      source: 'Bloomberg',
      time: '16h ago',
      readTime: '5 min read',
      relevance: 'Portfolio-wide impact',
      impact: 'Positive',
      impactScore: 9.5,
      affectedAssets: ['SPY', 'QQQ', 'BTC'],
      category: 'Monetary Policy',
      thumbnail: '/api/placeholder/400/207',
      url: 'https://bloomberg.com/fed-dovish-pivot',
      tags: ['Federal Reserve', 'Interest Rates', 'Monetary Policy', 'Markets']
    }
  ];

  const impactOptions = ['all', 'Positive', 'Negative', 'Neutral'];
  const assetOptions = ['all', 'BTC', 'AAPL', 'TSLA', 'GOOGL', 'EURUSD', 'XAU'];

  const filteredNews = allNews.filter(article => {
    const impactMatch = selectedImpact === 'all' || article.impact === selectedImpact;
    const assetMatch = selectedAsset === 'all' || article.affectedAssets.includes(selectedAsset);
    const searchMatch = searchQuery === '' || 
      article.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return impactMatch && assetMatch && searchMatch;
  });

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'Positive': return TrendingUp;
      case 'Negative': return TrendingDown;
      case 'Neutral': return Minus;
      default: return Minus;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Positive': return colors.accent.success;
      case 'Negative': return colors.accent.danger;
      case 'Neutral': return colors.text.secondary;
      default: return colors.text.secondary;
    }
  };

  const NewsCard = ({ article }: { article: typeof allNews[0] }) => {
    const ImpactIcon = getImpactIcon(article.impact);
    const impactColor = getImpactColor(article.impact);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border transition-all duration-200 hover:shadow-lg overflow-hidden"
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary
        }}
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <img 
              src={article.thumbnail} 
              alt={article.headline}
              className="w-full h-48 md:h-full object-cover"
            />
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span 
                  className="text-xs px-2 py-1 rounded-full font-semibold"
                  style={{ 
                    backgroundColor: `${impactColor}20`,
                    color: impactColor 
                  }}
                >
                  {article.category}
                </span>
                <div className="flex items-center gap-1">
                  <ImpactIcon size={14} style={{ color: impactColor }} />
                  <span 
                    className="text-xs font-semibold"
                    style={{ color: impactColor }}
                  >
                    {article.impact}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs" style={{ color: colors.text.tertiary }}>
                  {article.source}
                </p>
                <div className="flex items-center gap-2 text-xs" style={{ color: colors.text.tertiary }}>
                  <Clock size={12} />
                  <span>{article.time}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
            
            <h3 
              className="text-xl font-bold mb-3 hover:underline cursor-pointer"
              style={{ color: colors.text.primary }}
            >
              {article.headline}
            </h3>
            
            <p className="mb-4 line-clamp-3" style={{ color: colors.text.secondary }}>
              {article.summary}
            </p>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: colors.text.tertiary }}>
                  Portfolio Impact
                </p>
                <p className="text-sm" style={{ color: colors.accent.primary }}>
                  {article.relevance}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {article.affectedAssets.map((asset, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 rounded font-semibold"
                      style={{ 
                        backgroundColor: colors.background.tertiary,
                        color: colors.text.primary 
                      }}
                    >
                      {asset}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right mr-4">
                  <p className="text-xs" style={{ color: colors.text.tertiary }}>Impact Score</p>
                  <p className="text-lg font-bold" style={{ color: impactColor }}>
                    {article.impactScore}/10
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-2"
                  style={{ color: colors.accent.primary }}
                >
                  <ExternalLink size={14} />
                  Read Full Article
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-4">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${colors.accent.primary}10`,
                    color: colors.accent.primary 
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.background.primary, color: colors.text.primary }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/portfolio-analysis')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <Newspaper className="w-8 h-8" style={{ color: colors.accent.primary }} />
              <div>
                <h1 className="text-3xl font-bold">Portfolio News Center</h1>
                <p style={{ color: colors.text.secondary }}>AI-filtered news relevant to your holdings</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" className="flex items-center gap-2">
            <Filter size={16} />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.text.secondary }} />
          <Input 
            placeholder="Search news by headline, content, or tags..." 
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10"
            style={{ 
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
              color: colors.text.primary
            }}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: colors.text.tertiary }}>Impact:</span>
          {impactOptions.map(impact => (
            <Button
              key={impact}
              variant={selectedImpact === impact ? "primary" : "ghost"}
              size="sm"
              onClick={() => setSelectedImpact(impact)}
            >
              {impact === 'all' ? 'All' : impact}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: colors.text.tertiary }}>Asset:</span>
          {assetOptions.map(asset => (
            <Button
              key={asset}
              variant={selectedAsset === asset ? "primary" : "ghost"}
              size="sm"
              onClick={() => setSelectedAsset(asset)}
            >
              {asset === 'all' ? 'All' : asset}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div 
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.primary}` }}
        >
          <p className="text-3xl font-bold" style={{ color: colors.accent.success }}>
            {allNews.filter(n => n.impact === 'Positive').length}
          </p>
          <p className="text-sm" style={{ color: colors.text.secondary }}>Positive News</p>
        </div>
        <div 
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.primary}` }}
        >
          <p className="text-3xl font-bold" style={{ color: colors.accent.danger }}>
            {allNews.filter(n => n.impact === 'Negative').length}
          </p>
          <p className="text-sm" style={{ color: colors.text.secondary }}>Negative News</p>
        </div>
        <div 
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.primary}` }}
        >
          <p className="text-3xl font-bold" style={{ color: colors.accent.primary }}>
            {Math.round(allNews.reduce((sum, n) => sum + n.impactScore, 0) / allNews.length * 10) / 10}
          </p>
          <p className="text-sm" style={{ color: colors.text.secondary }}>Avg Impact Score</p>
        </div>
        <div 
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: colors.background.secondary, border: `1px solid ${colors.border.primary}` }}
        >
          <p className="text-3xl font-bold" style={{ color: colors.accent.purple }}>
            {new Set(allNews.flatMap(n => n.affectedAssets)).size}
          </p>
          <p className="text-sm" style={{ color: colors.text.secondary }}>Assets Covered</p>
        </div>
      </div>

      {/* News Articles */}
      <div className="space-y-6">
        {filteredNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 mx-auto mb-4" style={{ color: colors.text.secondary }} />
          <h3 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
            No News Found
          </h3>
          <p style={{ color: colors.text.secondary }}>
            No articles match your current search and filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsDetailPage;
