import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Meh } from 'lucide-react';
import { mockNews } from '@/data/newsData';

const SentimentIcon = ({ sentiment }) => {
    switch (sentiment) {
        case 'positive': return <Smile className="w-5 h-5 text-positive" />;
        case 'negative': return <Frown className="w-5 h-5 text-negative" />;
        default: return <Meh className="w-5 h-5 text-text-secondary" />;
    }
};

const NewsSentimentTab = () => {
  return (
    <div className="space-y-4">
      {mockNews.slice(0, 3).map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="border-b border-border-color pb-3 last:border-b-0"
        >
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-semibold text-white">{item.headline}</h4>
            <SentimentIcon sentiment={item.sentiment} />
          </div>
          <p className="text-xs text-text-secondary mt-1">{item.source} - {item.timestamp}</p>
          <p className="text-sm text-text-secondary mt-2">{item.content.substring(0, 100)}...</p>
        </motion.div>
      ))}
    </div>
  );
};

export default NewsSentimentTab;
