import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, AlertCircle } from 'lucide-react';
import { Smile, Frown, Meh } from 'lucide-react';
import { mockNews } from '@/data/newsData';
import { useNavigate } from 'react-router-dom';

const SentimentIcon = ({ sentiment }) => {
    switch (sentiment) {
        case 'positive': return <Smile className="w-5 h-5 text-positive" />;
        case 'negative': return <Frown className="w-5 h-5 text-negative" />;
        default: return <Meh className="w-5 h-5 text-text-secondary" />;
    }
};

const ImpactTag = ({ score }) => {
    const getImpactStyle = () => {
        if (score >= 5) return { label: 'High', color: 'bg-red-500/20 text-red-400' };
        if (score >= 3) return { label: 'Medium', color: 'bg-yellow-500/20 text-yellow-500' };
        return { label: 'Low', color: 'bg-white/5 text-text-secondary' };
    };

    const { label, color } = getImpactStyle();

    return (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${color}`}>
            {label} Impact
        </span>
    );
};

const NewsCard = ({ item, onClick }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-card-bg rounded-xl p-4 card-elevation flex flex-col justify-between border border-border-on-card cursor-pointer"
        onClick={onClick}
    >
        <div>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-semibold text-text-on-card-primary leading-tight pr-4">{item.headline}</h3>
                <SentimentIcon sentiment={item.sentiment} />
            </div>
            <p className="text-sm text-text-on-card-secondary mb-3">{item.source} - {item.timestamp}</p>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                {item.symbols.map(s => <span key={s} className="bg-primary-bg text-text-secondary text-xs px-2 py-1 rounded">#{s}</span>)}
            </div>
            <ImpactTag score={item.impactScore} />
        </div>
    </motion.div>
);

const NewsHub = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [sentiment, setSentiment] = useState('All');
    const navigate = useNavigate();

    const filteredNews = useMemo(() => {
        return mockNews.filter(item => {
            const matchesSearch = item.headline.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = category === 'All' || item.category === category;
            const matchesSentiment = sentiment === 'All' || item.sentiment === sentiment;
            return matchesSearch && matchesCategory && matchesSentiment;
        });
    }, [search, category, sentiment]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Helmet>
        <title>News Hub - Blommy</title>
        <meta name="description" content="AI-filtered financial news stream." />
      </Helmet>

      <div className="max-w-full mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-text-primary">News Hub</h1>
                <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live
                </div>
            </div>
          <p className="text-base text-text-secondary mt-1">AI-powered financial news analysis</p>
        </motion.div>
        
        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-card-bg rounded-xl p-3 mb-6 card-elevation flex flex-wrap items-center gap-4 border border-border-on-card">
            <div className="relative flex-grow min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-on-card-secondary" />
                <input type="text" placeholder="Search by keyword..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2 w-full bg-black/20 border border-border-on-card rounded-lg text-text-on-card-primary placeholder-text-on-card-secondary focus:outline-none focus:border-accent text-sm" />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="bg-black/20 border border-border-on-card rounded-lg px-3 py-2 text-text-on-card-primary focus:outline-none focus:border-accent text-sm">
                <option>All</option><option>Forex</option><option>Crypto</option><option>Stocks</option><option>Commodities</option>
            </select>
            <select value={sentiment} onChange={e => setSentiment(e.target.value)} className="bg-black/20 border border-border-on-card rounded-lg px-3 py-2 text-text-on-card-primary focus:outline-none focus:border-accent text-sm">
                <option>All</option><option value="positive">Positive</option><option value="neutral">Neutral</option><option value="negative">Negative</option>
            </select>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNews.map((item) => <NewsCard key={item.id} item={item} onClick={() => navigate(`/news/${item.id}`)} />)}
        </div>

        {filteredNews.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <AlertCircle className="mx-auto w-12 h-12 text-text-secondary mb-4" />
                <h3 className="text-lg font-semibold text-text-primary">No News Found</h3>
                <p className="text-text-secondary">Try adjusting your search or filter criteria.</p>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default NewsHub;