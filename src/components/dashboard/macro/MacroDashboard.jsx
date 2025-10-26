import React from 'react';
import MacroKpiCard from './MacroKpiCard';
import { TrendingUp, TrendingDown, ChevronsRight, Thermometer } from 'lucide-react';

const macroData = [
  {
    title: 'US 10Y Yield',
    value: '4.25%',
    change: '+2bps',
    positive: true,
    icon: <TrendingUp className="text-green-500" />
  },
  {
    title: 'VIX',
    value: '14.5',
    change: '-0.5',
    positive: false,
    icon: <ChevronsRight className="text-red-500" />
  },
  {
    title: 'CPI (YoY)',
    value: '3.2%',
    change: '+0.1%',
    positive: false,
    icon: <Thermometer className="text-red-500" />
  },
  {
    title: 'Fed Funds Rate',
    value: '5.50%',
    change: 'Stable',
    positive: true,
    icon: <TrendingDown className="text-green-500" />
  },
];

const MacroDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-4">Macro Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {macroData.map((item) => (
          <MacroKpiCard
            key={item.title}
            title={item.title}
            value={item.value}
            change={item.change}
            positive={item.positive}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default MacroDashboard;
