import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const currentData = [
  { name: 'Stocks', value: 45000, percentage: 35.4, color: '#4C6EF5' },
  { name: 'Crypto', value: 38000, percentage: 29.9, color: '#F59E0B' },
  { name: 'Forex', value: 25000, percentage: 19.7, color: '#10B981' },
  { name: 'Commodities', value: 12000, percentage: 9.4, color: '#8B5CF6' },
  { name: 'Bonds', value: 7000, percentage: 5.5, color: '#6B7280' },
];

const targetData = [
  { name: 'Stocks', value: 40, color: '#4C6EF5' },
  { name: 'Crypto', value: 25, color: '#F59E0B' },
  { name: 'Forex', value: 20, color: '#10B981' },
  { name: 'Commodities', value: 10, color: '#8B5CF6' },
  { name: 'Bonds', value: 5, color: '#6B7280' },
];

const DonutChart: React.FC<{ data: any[]; title: string; isTarget?: boolean }> = ({ data, title, isTarget }) => (
  <div className="flex-1">
    <h3 className="text-center font-bold mb-2">{title}</h3>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={5}>
          {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const AllocationCharts: React.FC = () => {
  return (
    <div className="bg-card-bg p-6 rounded-lg border border-border-color">
      <div className="flex flex-col md:flex-row gap-6">
        <DonutChart data={currentData} title="Current Allocation" />
        <DonutChart data={targetData} title="Target Allocation" isTarget />
      </div>
      <div className="text-center mt-4">
        <button className="px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm mr-4">
          Rebalancing Actions
        </button>
        <a href="#" className="text-sm text-accent hover:underline">Set Custom Targets</a>
      </div>
    </div>
  );
};

export default AllocationCharts;
