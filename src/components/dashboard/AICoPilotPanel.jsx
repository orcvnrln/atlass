import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { BookOpen, Zap, Newspaper, AlertTriangle } from 'lucide-react';
import { useAIInsights } from '@/hooks/useAI';

const InsightCard = ({ insight }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'News': return <Newspaper size={20} />;
      case 'Technical Alert': return <Zap size={20} />;
      default: return <AlertTriangle size={20} />;
    }
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="bg-primary-bg p-4 rounded-lg border border-border-color"
    >
      <div className="flex items-center space-x-3 mb-2">
        {getIcon()}
        <h4 className="font-bold">{insight.title}</h4>
      </div>
      <p className="text-sm text-text-secondary">{insight.content}</p>
    </motion.div>
  );
};

const AICoPilotPanel = () => {
  const { currentInsight } = useAIInsights();

  const handleMentorMode = () => {
    toast({
      title: "🎓 AI Mentor Lesson",
      description: "Did you know? The Sharpe Ratio is a measure of risk-adjusted return. A higher Sharpe Ratio indicates better performance for a given level of risk.",
    });
  };

  return (
    <motion.div 
        className="bg-card-bg rounded-xl card-padding card-elevation border border-border-color card-click-glow h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-text-primary mb-6">AI Co-Pilot</h2>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Live Insights</h3>
        <AnimatePresence mode="wait">
          <InsightCard key={currentInsight.title} insight={currentInsight} />
        </AnimatePresence>
      </div>
      <div className="border-t border-border-on-card my-6"></div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">AI Mentor Mode</h3>
        <p className="text-sm text-text-secondary mb-4">
          Learn about trading concepts and market analysis from your AI Mentor.
        </p>
        <button
            onClick={handleMentorMode}
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
        >
            <BookOpen className="w-5 h-5" />
            <span>Request a New Lesson</span>
        </button>
      </div>
    </motion.div>
  );
};

export default AICoPilotPanel;
