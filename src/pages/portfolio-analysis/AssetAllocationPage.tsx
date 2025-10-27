import React from 'react';
import AllocationPageHeader from '@/components/allocation/AllocationPageHeader';
import OverviewCards from '@/components/allocation/OverviewCards';
import AllocationCharts from '@/components/allocation/AllocationCharts';
import RebalancingSimulator from '@/components/allocation/RebalancingSimulator';
import ConcentrationRiskAnalysis from '@/components/allocation/ConcentrationRiskAnalysis';
import CorrelationMatrix from '@/components/allocation/CorrelationMatrix';
import HistoricalTrends from '@/components/allocation/HistoricalTrends';
import SmartSuggestions from '@/components/allocation/SmartSuggestions';
import ScenarioBuilder from '@/components/allocation/ScenarioBuilder';
import TaxOptimization from '@/components/allocation/TaxOptimization';

const AssetAllocationPage: React.FC = () => {
  return (
    <div className="p-6 bg-background text-text-primary min-h-screen">
      <AllocationPageHeader />
      <OverviewCards />
      <AllocationCharts />
      <div className="mt-6"><RebalancingSimulator /></div>
      <div className="mt-6"><ConcentrationRiskAnalysis /></div>
      <div className="mt-6"><CorrelationMatrix /></div>
      <div className="mt-6"><HistoricalTrends /></div>
      <div className="mt-6"><SmartSuggestions /></div>
      <div className="mt-6"><ScenarioBuilder /></div>
      <div className="mt-6"><TaxOptimization /></div>
    </div>
  );
};

export default AssetAllocationPage;

