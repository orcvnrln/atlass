import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import PortfolioHeader from './components/PortfolioHeader';
import AlertBanner from './components/AlertBanner';
import PortfolioMetrics from './components/PortfolioMetrics';
import PerformanceChart from './components/PerformanceChart';
import AssetAllocation from './components/AssetAllocation';
import HoldingsTable from './components/HoldingsTable';
import ConcentrationRisk from './components/ConcentrationRisk';
import AIInsightsPanel from './components/AIInsightsPanel';
import RiskAlerts from './components/RiskAlerts';
import QuickActions from './components/QuickActions';
import NewsFeed from './components/NewsFeed';
import StressTestPanel from './components/StressTestPanel';

const PortfolioAnalysis: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f1419] text-[#f7fafc] font-sans p-4 sm:p-6 lg:p-8">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#0f1419]/80 backdrop-blur-lg -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-6 border-b border-[#2d3748]">
        <PortfolioHeader />
      </div>

      {/* Alert Banner (Conditional) */}
      <div className="mb-6">
        <AlertBanner />
      </div>

      {/* Key Metrics Row */}
      <div className="mb-6">
        <PortfolioMetrics />
      </div>

      {/* Main Content Area: 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (65%) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <PerformanceChart />
          <AssetAllocation />
          <StressTestPanel />
          <HoldingsTable />
          <ConcentrationRisk />
        </div>

        {/* Right Sidebar (35%) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <AIInsightsPanel />
          <RiskAlerts />
          <QuickActions />
          <NewsFeed />
        </div>

      </div>
    </div>
  );
};

export default PortfolioAnalysis;
