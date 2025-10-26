import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, TrendingUp, TrendingDown, Clock, Zap, Volume2, VolumeX } from 'lucide-react';
import { mockNews } from '@/data/newsData';

const RealTimeNewsTicker = ({ isVisible = true, onNewsClick }) => {
  const [currentNews, setCurrentNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(5000); // 5 seconds per news item
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    // Initialize with mock news and add timestamps
    const newsWithTimestamps = mockNews.map(article => ({
      ...article,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString() // Random time within last hour
    }));
    
    setCurrentNews(newsWithTimestamps);
    
    // Simulate real-time news updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new news every 30 seconds
        addBreakingNews();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isPlaying || currentNews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % currentNews.length);
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, currentNews.length, speed]);

  const addBreakingNews = () => {
    const breakingNewsTemplates = [
      {
        headline: "BREAKING: Major central bank announces unexpected policy change",
        sentiment: "negative",
        impactScore: 5,
        category: "Forex",
        symbols: ["USD", "EUR"],
        isBreaking: true
      },
      {
        headline: "ALERT: Tech giant reports record quarterly earnings",
        sentiment: "positive",
        impactScore: 4,
        category: "Stocks",
        symbols: ["AAPL", "MSFT"],
        isBreaking: true
      },
      {
        headline: "URGENT: Geopolitical tensions escalate, safe-haven assets surge",
        sentiment: "negative",
        impactScore: 5,
        category: "Commodities",
        symbols: ["GOLD", "USD"],
        isBreaking: true
      },
      {
        headline: "FLASH: Cryptocurrency market sees massive institutional adoption",
        sentiment: "positive",
        impactScore: 4,
        category: "Crypto",
        symbols: ["BTC", "ETH"],
        isBreaking: true
      }
    ];

    const template = breakingNewsTemplates[Math.floor(Math.random() * breakingNewsTemplates.length)];
    const newArticle = {
      id: `breaking_${Date.now()}`,
      headline: template.headline,
      source: "Market Wire",
      timestamp: new Date().toISOString(),
      sentiment: template.sentiment,
      impactScore: template.impactScore,
      category: template.category,
      symbols: template.symbols,
      content: `Breaking news alert: ${template.headline}`,
      isBreaking: true
    };

    setCurrentNews(prev => [newArticle, ...prev]);
    setCurrentIndex(0); // Jump to the breaking news
    
    if (soundEnabled) {
      playNotificationSound();
    }
  };

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
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

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const newsTime = new Date(timestamp);
    const diffMs = now - newsTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return newsTime.toLocaleDateString();
  };

  const currentArticle = currentNews[currentIndex];

  if (!isVisible || !currentArticle) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-16 left-0 right-0 z-30 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-lg"
    >
      <div className="flex items-center justify-between px-4 py-2">
        {/* News Content */}
        <div className="flex-1 flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2">
            <Newspaper size={18} className="text-accent-orange flex-shrink-0" />
            {currentArticle.isBreaking && (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-xs font-bold text-accent-red bg-accent-red/20 px-2 py-1 rounded"
              >
                BREAKING
              </motion.span>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="flex-1 min-w-0"
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1 ${getSentimentColor(currentArticle.sentiment)}`}>
                  {getSentimentIcon(currentArticle.sentiment)}
                </div>
                
                <button
                  onClick={() => onNewsClick && onNewsClick(currentArticle)}
                  className="text-text-primary hover:text-accent-orange transition-colors truncate cursor-pointer"
                >
                  {currentArticle.headline}
                </button>
                
                <div className="flex items-center gap-2 text-xs text-text-secondary flex-shrink-0">
                  <span>{currentArticle.source}</span>
                  <span>•</span>
                  <span>{formatTimestamp(currentArticle.timestamp)}</span>
                  <span className={`px-2 py-1 rounded ${
                    currentArticle.impactScore >= 4 ? 'bg-accent-red/20 text-accent-red' :
                    currentArticle.impactScore >= 3 ? 'bg-accent-orange/20 text-accent-orange' :
                    'bg-accent-green/20 text-accent-green'
                  }`}>
                    Impact: {currentArticle.impactScore}/5
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Progress Indicator */}
          <div className="flex items-center gap-1">
            {currentNews.slice(0, 5).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex % 5 ? 'bg-accent-orange' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Speed Control */}
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-gray-700 text-text-primary text-xs rounded px-2 py-1 border border-gray-600 focus:border-accent-orange focus:outline-none"
          >
            <option value={3000}>Fast</option>
            <option value={5000}>Normal</option>
            <option value={8000}>Slow</option>
          </select>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1 rounded transition-colors ${
              soundEnabled ? 'text-accent-orange' : 'text-text-secondary hover:text-text-primary'
            }`}
            title={soundEnabled ? 'Disable sound alerts' : 'Enable sound alerts'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 text-text-secondary hover:text-text-primary transition-colors"
            title={isPlaying ? 'Pause ticker' : 'Resume ticker'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>

          {/* Manual Navigation */}
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + currentNews.length) % currentNews.length)}
              className="p-1 text-text-secondary hover:text-text-primary transition-colors"
              title="Previous news"
            >
              ◀️
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % currentNews.length)}
              className="p-1 text-text-secondary hover:text-text-primary transition-colors"
              title="Next news"
            >
              ▶️
            </button>
          </div>
        </div>
      </div>

      {/* Breaking News Alert */}
      <AnimatePresence>
        {currentArticle.isBreaking && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-accent-red/10 border-t border-accent-red/30 px-4 py-2"
          >
            <div className="flex items-center gap-2 text-sm">
              <Zap size={14} className="text-accent-red" />
              <span className="text-accent-red font-medium">Breaking News Alert:</span>
              <span className="text-text-primary">Market impact expected - Monitor positions closely</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RealTimeNewsTicker;
