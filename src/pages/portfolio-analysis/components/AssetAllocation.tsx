import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { assetAllocationData } from '../utils/mockData';
import { Button } from '@/components/ui/Button';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ComparisonBar = ({ asset }: { asset: typeof assetAllocationData[0] }) => {
  const drift = asset.current - asset.target;
  const driftColor = Math.abs(drift) > 5 ? 'bg-red-500' : Math.abs(drift) > 2 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="w-full font-mono text-sm">
      <div className="flex justify-between items-center mb-1">
        <span className="text-text-primary font-semibold">{asset.name}</span>
        <span className={`${drift > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {asset.current.toFixed(1)}% &rarr; Target: {asset.target}% ({drift.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-4 relative overflow-hidden">
        <div className="h-full rounded-l-full" style={{ width: `${asset.target}%`, backgroundColor: asset.color, opacity: 0.3 }}></div>
        <div className={`absolute top-0 left-0 h-full rounded-l-full`} style={{ width: `${asset.current}%`, backgroundColor: asset.color }}></div>
        <div className={`absolute top-0 h-full ${driftColor}`} style={{ left: `${Math.min(asset.current, asset.target)}%`, width: `${Math.abs(drift)}%` }}></div>
      </div>
    </div>
  );
};

const AssetAllocation: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-xl p-4 sm:p-6 hover:border-[#4299e1] transition-all duration-200 cursor-pointer" onClick={() => navigate('/portfolio-analysis/asset-allocation-detail')}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h3 className="text-base font-bold text-[#f7fafc]">Asset Allocation</h3>
          <p className="text-sm text-[#a0aec0]">Portfolio distribution by asset class</p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Button variant="ghost" size="sm" className="text-[#4299e1]" onClick={(e) => {e.stopPropagation(); navigate('/portfolio-analysis/asset-allocation-detail');}}>Set Targets</Button>
          <Button variant="primary" size="sm" onClick={(e) => {e.stopPropagation(); navigate('/portfolio-analysis/asset-allocation-detail');}}>Rebalance Portfolio</Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Donut Chart */}
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assetAllocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="current"
              >
                {assetAllocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-2xl font-bold">Current</p>
          </div>
        </div>

        {/* Right: Comparison Bars */}
        <div className="flex flex-col gap-4">
          {assetAllocationData.map(asset => (
            <ComparisonBar key={asset.name} asset={asset} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-800/50 flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
        <div>
          <p className="text-sm font-bold">Overall Drift: <span className="text-yellow-400">12.3%</span></p>
          <p className="text-xs text-text-secondary">Action needed: Reduce Crypto by $6,250, Increase Stocks by $5,870</p>
        </div>
        <Button variant="secondary" size="sm">Calculate Rebalancing</Button>
      </div>
    </div>
  );
};

export default AssetAllocation;
