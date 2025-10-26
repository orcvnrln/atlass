import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, ChevronDown, Bell } from 'lucide-react';
import PortfolioPerformanceChart from '@/components/portfolio/PortfolioPerformanceChart';
import AssetAllocationPie from '@/components/portfolio/AssetAllocationPie';
import PositionsTable from '@/components/portfolio/PositionsTable';
import RiskAnalysisPanel from '@/components/portfolio/RiskAnalysisPanel';
import RecommendationsPanel from '@/components/portfolio/EnhancedRecommendationsPanel';
import PortfolioHistory from '@/components/portfolio/PortfolioHistory';
import toast from 'react-hot-toast';

const EnhancedPortfolio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'history', label: 'History' },
  ];
  
  return (
    <div className="min-h-screen bg-primary-bg p-6 space-y-6">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-text-primary">Portfolio</h1>
          <p className="text-sm text-text-secondary mt-1">
            Track your investments and analyze performance
          </p>
        </motion.div>
        
        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'bg-white/5 text-text-secondary hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Performance Chart */}
          <PortfolioPerformanceChart />

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Allocation */}
            <AssetAllocationPie />
            
            {/* Risk Analysis */}
            <RiskAnalysisPanel />
          </div>

          {/* Recommendations */}
          <RecommendationsPanel />
          
          {/* Positions Table */}
          <PositionsTable />
        </motion.div>
      )}
      
      {/* Analysis Tab Content */}
      {activeTab === 'analysis' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Full Risk Analysis */}
            <RiskAnalysisPanel />
            
            {/* Asset Allocation */}
            <AssetAllocationPie />
          </div>
          
          {/* Recommendations */}
          <RecommendationsPanel />
        </motion.div>
      )}
      
      {/* History Tab Content */}
      {activeTab === 'history' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Performance History */}
          <PortfolioHistory />
          
          {/* Positions Table */}
          <PositionsTable />
        </motion.div>
      )}
      
      {/* Floating Action Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-accent text-white shadow-lg hover:bg-accent-hover transition-colors z-10"
        onClick={() => toast.success('Portfolio alert settings will be available soon!')}
      >
        <Bell className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default EnhancedPortfolio;
