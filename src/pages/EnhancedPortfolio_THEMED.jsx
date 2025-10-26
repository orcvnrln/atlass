import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  Bell, 
  BarChart4, 
  Activity, 
  History, 
  AlertTriangle,
  TrendingUp,
  Shield,
  Info
} from 'lucide-react';
import PortfolioPerformanceChart from '@/components/portfolio/PortfolioPerformanceChart';
import AssetAllocationPie from '@/components/portfolio/AssetAllocationPie';
import PositionsTable from '@/components/portfolio/PositionsTable';
import RiskAnalysisPanel from '@/components/portfolio/RiskAnalysisPanel';
import RecommendationsPanel from '@/components/portfolio/EnhancedRecommendationsPanel';
import PortfolioHistory from '@/components/portfolio/PortfolioHistory';
import PortfolioHealthScore from '@/components/portfolio/PortfolioHealthScore_FIXED';
import PositionCoaching from '@/components/portfolio/PositionCoaching';
import AICopilot from '@/components/portfolio/AICopilot';
import CorrelationHeatmap from '@/components/portfolio/CorrelationHeatmap';
import toast from 'react-hot-toast';

// Mock positions data for coaching
const mockPositions = [
  { symbol: 'BTC/USD', pnl: 475, pnlPercent: 2.31 },
  { symbol: 'ETH/USD', pnl: -350, pnlPercent: -3.11 },
  { symbol: 'AAPL', pnl: 365, pnlPercent: 3.28 },
  { symbol: 'EUR/USD', pnl: 60, pnlPercent: 0.11 },
  { symbol: 'GOOGL', pnl: 110, pnlPercent: 0.77 },
];

// Mock correlation data
const mockCorrelationData = {
  labels: ['BTC', 'ETH', 'AAPL', 'MSFT', 'EUR/USD', 'GOLD'],
  matrix: [
    [1.00, 0.85, 0.65, 0.62, -0.15, -0.45],
    [0.85, 1.00, 0.58, 0.56, -0.12, -0.42],
    [0.65, 0.58, 1.00, 0.78, 0.05, -0.22],
    [0.62, 0.56, 0.78, 1.00, 0.08, -0.25],
    [-0.15, -0.12, 0.05, 0.08, 1.00, -0.72],
    [-0.45, -0.42, -0.22, -0.25, -0.72, 1.00]
  ]
};

const EnhancedPortfolio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeRiskTab, setActiveRiskTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'ai-insights', label: 'AI Insights', icon: Activity },
    { id: 'analysis', label: 'Analysis', icon: BarChart4 },
    { id: 'history', label: 'History', icon: History },
  ];
  
  const riskTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'drawdown', label: 'Drawdown' },
    { id: 'correlation', label: 'Correlation' },
  ];
  
  const portfolioMetrics = {
    totalValue: '$127,000',
    beta: '1.24',
    sharpe: '1.84',
    maxDrawdown: '-12.5%',
    valueAtRisk: '$8,450'
  };
  
  return (
    <div className="min-h-screen bg-[#0F0F12] p-6 space-y-6">
      {/* Header with Portfolio Value and Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E1E24] p-5 rounded-xl border border-gray-800 flex-1"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Total Portfolio Value</h2>
            <span className="text-2xl font-bold text-[#8B5CF6]">{portfolioMetrics.totalValue}</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-[#0F0F12]/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-xs text-gray-400">Portfolio Beta</span>
              </div>
              <span className="text-lg font-bold text-white">{portfolioMetrics.beta}</span>
            </div>
            
            <div className="p-3 bg-[#0F0F12]/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-xs text-gray-400">Sharpe Ratio</span>
              </div>
              <span className="text-lg font-bold text-white">{portfolioMetrics.sharpe}</span>
            </div>
            
            <div className="p-3 bg-[#0F0F12]/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-[#EF4444]" />
                <span className="text-xs text-gray-400">Max Drawdown</span>
              </div>
              <span className="text-lg font-bold text-[#EF4444]">{portfolioMetrics.maxDrawdown}</span>
            </div>
            
            <div className="p-3 bg-[#0F0F12]/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-xs text-gray-400">Value at Risk (95%)</span>
              </div>
              <span className="text-lg font-bold text-[#F59E0B]">{portfolioMetrics.valueAtRisk}</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-[#0F0F12]/50 rounded-lg border border-[#8B5CF6]/20">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[#8B5CF6] mt-0.5" />
              <p className="text-xs text-gray-300 leading-relaxed">
                Your portfolio has moderate risk with good risk-adjusted returns. Consider diversifying into bonds to reduce volatility.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Tabs */}
      <div className="bg-[#1E1E24] rounded-xl border border-gray-800 p-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-[#0F0F12] text-gray-400 hover:bg-[#0F0F12]/80'
              }`}
            >
              <tab.icon className="w-4 h-4" />
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
            <div className="bg-[#1E1E24] rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#8B5CF6]/10 rounded-lg">
                      <Shield className="w-5 h-5 text-[#8B5CF6]" />
                    </div>
                    <h2 className="font-bold text-white">Risk Analysis</h2>
                  </div>
                </div>
                
                {/* Risk Tabs */}
                <div className="flex gap-2">
                  {riskTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveRiskTab(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeRiskTab === tab.id
                          ? 'bg-[#8B5CF6] text-white'
                          : 'bg-[#0F0F12] text-gray-400 hover:bg-[#0F0F12]/80'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-4">
                {activeRiskTab === 'overview' && <RiskAnalysisPanel />}
                {activeRiskTab === 'drawdown' && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Drawdown analysis will be available soon</p>
                  </div>
                )}
                {activeRiskTab === 'correlation' && <CorrelationHeatmap data={mockCorrelationData} />}
              </div>
            </div>
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
          
          {/* Correlation Heatmap */}
          <CorrelationHeatmap data={mockCorrelationData} />
          
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
