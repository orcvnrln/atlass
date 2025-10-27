import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AllocationHeader from '@/components/allocation/AllocationHeader';
import RiskMetricsDashboard from '@/components/allocation/RiskMetricsDashboard';
import RebalancingCalculator from '@/components/allocation/RebalancingCalculator';
import PerformanceAttribution from '@/components/allocation/PerformanceAttribution';
import DeepDiveSections from '@/components/allocation/DeepDiveSections';
import AIInsights from '@/components/allocation/AIInsights';
import HistoricalAndTax from '@/components/allocation/HistoricalAndTax';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-card-bg rounded-xl border border-border-color p-6"
  >
    <h2 className="text-xl font-bold text-text-primary mb-4">{title}</h2>
    <div>{children}</div>
  </motion.div>
);

const AssetAllocationDetail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-bg text-text-primary p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button and Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Asset Allocation Detail</h1>
            <p className="text-text-secondary mt-1">Institutional-grade portfolio rebalancing and deep analytics.</p>
          </div>
        </div>

        <div className="space-y-6">
          <AllocationHeader />
          <Section title="2. Interactive Rebalancing Calculator">
            <RebalancingCalculator />
          </Section>
          <Section title="3. Risk Metrics Dashboard">
            <RiskMetricsDashboard />
          </Section>
          <Section title="4. Performance Attribution">
            <PerformanceAttribution />
          </Section>
          <Section title="5. Deep Dive Sections">
            <DeepDiveSections />
          </Section>
          <Section title="6. AI-Powered Insights">
            <AIInsights />
          </Section>
          <Section title="7. & 8. Historical Trends & Tax Optimization">
            <HistoricalAndTax />
          </Section>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocationDetail;

