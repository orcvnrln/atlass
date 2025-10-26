import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { mockNews } from '@/data/newsData';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Smile, Frown, Meh } from 'lucide-react';

const SentimentIcon = ({ sentiment }) => {
  switch (sentiment) {
    case 'positive': return <Smile className="w-4 h-4 text-green-400" />;
    case 'negative': return <Frown className="w-4 h-4 text-red-400" />;
    default: return <Meh className="w-4 h-4 text-yellow-400" />;
  }
};

const MiniNewsFeed = () => {
  const navigate = useNavigate();
  const recentNews = useMemo(() => mockNews.slice(0, 5), []); // Display top 5 recent news

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-3">
        {recentNews.length > 0 ? (
          recentNews.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ x: 5 }}
              className="bg-primary-bg border border-border-color rounded-lg p-3 cursor-pointer flex items-start gap-2"
              onClick={() => navigate(`/news/${item.id}`)}
            >
              <SentimentIcon sentiment={item.sentiment} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-text-primary leading-tight">{item.headline}</p>
                <p className="text-[10px] text-text-secondary mt-1">{item.source} - {item.timestamp}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-4 text-text-secondary">
            <AlertCircle className="mx-auto w-8 h-8 mb-2" />
            <p className="text-xs">No recent news.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniNewsFeed;
