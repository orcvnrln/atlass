import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ScenarioBuilder: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState<any>(null);

  const onSubmit = (data: any) => {
    // Mock calculation
    setResult({
      newAllocation: [
        { name: 'Stocks', value: 45, color: '#4C6EF5' },
        { name: 'Crypto', value: 35, color: '#F59E0B' }, // Increased
        { name: 'Forex', value: 15, color: '#10B981' },
        { name: 'Commodities', value: 5, color: '#8B5CF6' },
      ],
      diversificationScore: '8.5/10',
      sharpeRatio: '1.95',
    });
  };

  return (
    <div className="bg-card-bg p-6 rounded-lg border border-border-color">
      <h2 className="text-xl font-bold mb-4">Portfolio Scenario Analysis</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="w-full">
          <label className="text-xs">Investment Amount</label>
          <input {...register('amount')} type="number" defaultValue="10000" className="w-full p-2 bg-white/5 rounded-lg mt-1" />
        </div>
        <div className="w-full">
          <label className="text-xs">Asset Class</label>
          <select {...register('assetClass')} className="w-full p-2 bg-white/5 rounded-lg mt-1">
            <option>Crypto</option>
            <option>Stocks</option>
            <option>Bonds</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors h-10">
          Calculate Impact
        </button>
      </form>

      {result && (
        <div className="mt-6 border-t border-border-color pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-2">New Allocation Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={result.newAllocation} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {result.newAllocation.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="font-bold mb-2">Projected Impact</h3>
            <p>Diversification Score: <span className="font-bold text-green-500">{result.diversificationScore}</span></p>
            <p>Sharpe Ratio: <span className="font-bold text-green-500">{result.sharpeRatio}</span></p>
            <p className="mt-2 text-sm text-green-400">This would improve your Sharpe Ratio by 0.15</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioBuilder;
