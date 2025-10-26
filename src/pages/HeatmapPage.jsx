import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Activity, Globe } from 'lucide-react';
import LiquidityHeatmap from '@/components/heatmap/LiquidityHeatmap';
import ForexHeatmap from '@/components/heatmap/ForexHeatmap';
import SentimentAnalysis from '@/components/sentiment/SentimentAnalysis';

const HeatmapPage = () => {
  const [activeTab, setActiveTab] = useState('forex');

  const tabs = [
    { id: 'forex', label: 'Forex Heatmap', icon: Globe },
    { id: 'sentiment', label: 'Sentiment Analysis', icon: TrendingUp },
    { id: 'liquidity', label: 'Liquidity Map', icon: BarChart3 }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Helmet>
        <title>Market Heatmaps - Blommy</title>
        <meta name="description" content="Comprehensive market analysis with forex heatmaps, sentiment indicators, and liquidity visualization." />
      </Helmet>

      <div className="max-w-full mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity size={32} className="text-accent-orange" />
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Market Heatmaps</h1>
              <p className="text-text-secondary">Real-time market analysis and sentiment indicators</p>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-primary-bg p-1 rounded-lg">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-accent-orange text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'forex' && <ForexHeatmap />}
          {activeTab === 'sentiment' && <SentimentAnalysis />}
          {activeTab === 'liquidity' && <LiquidityHeatmap />}
        </motion.div>
      </div>
    </div>
  );
};

export default HeatmapPage;
