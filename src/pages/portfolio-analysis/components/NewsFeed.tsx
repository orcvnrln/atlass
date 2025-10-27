import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const newsItems = [
  {
    headline: 'Bitcoin ETF sees $500M inflow amid Fed rate pause',
    source: 'Bloomberg',
    time: '2h ago',
    relevance: 'Affects BTC (35% of portfolio)',
    impact: 'Positive',
    thumbnail: '/api/placeholder/400/200',
  },
  {
    headline: 'Apple reports Q3 earnings beat expectations',
    source: 'CNBC',
    time: '4h ago',
    relevance: 'AAPL (12% of portfolio)',
    impact: 'Neutral',
    thumbnail: '/api/placeholder/400/201',
  },
  {
    headline: 'US Dollar Index (DXY) hits 3-month high',
    source: 'Reuters',
    time: '6h ago',
    relevance: 'Affects EURUSD, GBPUSD',
    impact: 'Negative',
    thumbnail: '/api/placeholder/400/202',
  },
];

const NewsCard = ({ item }: { item: typeof newsItems[0] }) => {
  const impactColor = {
    Positive: 'text-green-400 bg-green-500/10',
    Neutral: 'text-gray-400 bg-gray-500/10',
    Negative: 'text-red-400 bg-red-500/10',
  }[item.impact];

  return (
    <div className="flex items-start gap-3 py-2 border-b border-gray-800/50 last:border-b-0">
      <img src={item.thumbnail} alt={item.headline} className="w-20 h-14 object-cover rounded-md" />
      <div className="flex-grow">
        <p className="text-sm font-semibold text-text-primary leading-tight hover:text-blue-400 cursor-pointer">{item.headline}</p>
        <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
          <span>{item.source}</span>
          <span>&middot;</span>
          <span>{item.time}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-xs text-blue-400/80">{item.relevance}</p>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${impactColor}`}>
            {item.impact} {item.impact === 'Positive' ? '↗️' : item.impact === 'Negative' ? '↘️' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

const NewsFeed: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-[#16181d] border border-[#1f2937] rounded-xl p-4">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-base font-bold text-text-primary">Portfolio-Relevant News</h3>
        <p className="text-xs text-text-secondary">AI-filtered for your holdings</p>
      </div>

      {/* News List */}
      <div className="flex flex-col max-h-64 overflow-y-auto pr-2">
        {newsItems.map((item, index) => (
          <NewsCard key={index} item={item} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 text-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-sm text-text-secondary hover:text-text-primary w-full"
          onClick={() => navigate('/portfolio-analysis/news')}
        >
          View All News
        </Button>
      </div>
    </div>
  );
};

export default NewsFeed;
