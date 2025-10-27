import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Bell, Zap } from 'lucide-react';
import GaugeChart from './GaugeChart';

const AllocationHeader: React.FC = () => {
  const allocations = [
    { label: 'Stocks', value: 45.4, target: 40, color: '#4C6EF5' },
    { label: 'Crypto', value: 29.9, target: 30, color: '#F59E0B' },
    { label: 'Forex', value: 19.7, target: 20, color: '#10B981' },
    { label: 'Commodities', value: 5.0, target: 10, color: '#8B5CF6' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Side: Gauge Charts */}
      <div className="lg:col-span-2 bg-card-bg rounded-xl border border-border-color p-6 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
        {allocations.map((alloc, index) => (
          <motion.div
            key={alloc.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <GaugeChart {...alloc} />
          </motion.div>
        ))}
      </div>

      {/* Right Side: Health Score & Actions */}
      <div className="bg-card-bg rounded-xl border border-border-color p-6 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-text-primary mb-2">Portfolio Health</h3>
          <div className="flex items-center gap-2">
            <p className="text-4xl font-bold text-positive">A-</p>
            <p className="text-sm text-text-secondary">Excellent. Minor drift detected.</p>
          </div>
          <p className="text-xs text-text-secondary mt-2">Last rebalanced: 3 weeks ago</p>
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <button className="w-full bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2">
            <Zap size={16} />
            Rebalance Now
          </button>
          <div className="flex gap-2">
            <button className="w-full bg-white/5 text-text-secondary font-bold py-2 px-4 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              <FileText size={16} />
              Export Report
            </button>
            <button className="w-full bg-white/5 text-text-secondary font-bold py-2 px-4 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              <Bell size={16} />
              Set Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationHeader;

