import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Shield, 
  BarChart3 
} from 'lucide-react';

const kpiData = [
  {
    title: 'Portfolio Value',
    value: '$127,450.32',
    change: '+2,340.50',
    changePercent: '+1.87%',
    icon: DollarSign,
    positive: true
  },
  {
    title: 'Daily P&L',
    value: '+$1,245.67',
    change: 'vs yesterday',
    changePercent: '+0.98%',
    icon: TrendingUp,
    positive: true
  },
  {
    title: 'Win Rate',
    value: '73.2%',
    change: 'Last 30 trades',
    changePercent: '+2.1%',
    icon: Target,
    positive: true
  },
  {
    title: 'Risk Score',
    value: 'Medium',
    change: 'Portfolio risk',
    changePercent: 'Stable',
    icon: Shield,
    positive: null
  },
  {
    title: 'Sharpe Ratio',
    value: '1.84',
    change: 'Risk-adjusted',
    changePercent: '+0.12',
    icon: BarChart3,
    positive: true
  }
];

const KPICards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        
        return (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-[#161B22] rounded-xl p-4 card-elevation"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-[#4C6EF5]/10 rounded-lg">
                <Icon className="w-5 h-5 text-[#4C6EF5]" />
              </div>
              {kpi.positive !== null && (
                <span className={`text-xs font-medium ${kpi.positive ? 'positive' : 'negative'}`}>
                  {kpi.changePercent}
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xs font-medium text-[#9CA3AF]">{kpi.title}</h3>
              <p className="text-xl font-bold text-white monospace">{kpi.value}</p>
              <p className="text-xs text-[#9CA3AF]">{kpi.change}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default KPICards;
