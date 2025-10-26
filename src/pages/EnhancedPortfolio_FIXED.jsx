import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, ChevronDown, Bell } from 'lucide-react';
import PortfolioPerformanceChart from '@/components/portfolio/PortfolioPerformanceChart';
import AssetAllocationPie from '@/components/portfolio/AssetAllocationPie';
import PositionsTable from '@/components/portfolio/PositionsTable';
import RiskAnalysisPanel from '@/components/portfolio/RiskAnalysisPanel';
import RecommendationsPanel from '@/components/portfolio/RecommendationsPanel';
import PortfolioHistory from '@/components/portfolio/PortfolioHistory';
import PortfolioHealthScore from '@/components/portfolio/PortfolioHealthScore';
import PositionCoaching from '@/components/portfolio/PositionCoaching';
import AICopilot from '@/components/portfolio/AICopilot';
import toast from 'react-hot-toast';

// Mock positions data for coaching
const mockPositions = [
  { symbol: 'BTC/USD', pnl: 475, pnlPercent: 2.31 },
  { symbol: 'ETH/USD', pnl: -350, pnlPercent: -3.11 },
  { symbol: 'AAPL', pnl: 365, pnlPercent: 3.28 },
  { symbol: 'EUR/USD', pnl: 60, pnlPercent: 0.11 },
  { symbol: 'GOOGL', pnl: 110, pnlPercent: 0.77 },
];

const EnhancedPortfolio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'ai-insights', label: 'AI Insights' },
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
            AI-powered portfolio management və analiz
          </p>
        </motion.div>
        
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
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
          {/* AI Health Score - Prominent */}
          <PortfolioHealthScore />
          
          {/* Performance Chart */}
          <PortfolioPerformanceChart />

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Allocation */}
            <AssetAllocationPie />
            
            {/* Risk Analysis */}
            <RiskAnalysisPanel />
          </div>

          {/* Positions Table */}
          <PositionsTable />
        </motion.div>
      )}
      
      {/* AI Insights Tab Content */}
      {activeTab === 'ai-insights' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Health Score */}
          <PortfolioHealthScore />
          
          {/* Position-Level Coaching */}
          <PositionCoaching positions={mockPositions} />
          
          {/* AI Recommendations */}
          <RecommendationsPanel />
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
      
      {/* AI Copilot - Always visible */}
      <AICopilot />
    </div>
  );
};

export default EnhancedPortfolio;
