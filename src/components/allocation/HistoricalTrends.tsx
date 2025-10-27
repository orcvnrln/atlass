import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', Stocks: 40, Crypto: 20, Forex: 30, Commodities: 10 },
  { name: 'Feb', Stocks: 42, Crypto: 25, Forex: 23, Commodities: 10 },
  { name: 'Mar', Stocks: 38, Crypto: 30, Forex: 22, Commodities: 10 },
  { name: 'Apr', Stocks: 45, Crypto: 28, Forex: 17, Commodities: 10 },
  { name: 'May', Stocks: 43, Crypto: 32, Forex: 15, Commodities: 10 },
  { name: 'Jun', Stocks: 40, Crypto: 35, Forex: 15, Commodities: 10 },
];

const HistoricalTrends: React.FC = () => {
  return (
    <div className="bg-card-bg p-6 rounded-lg border border-border-color grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h2 className="text-xl font-bold mb-4">Allocation Drift Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} stackOffset="expand">
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis tickFormatter={(tick) => `${tick * 100}%`} stroke="#888" />
            <Tooltip />
            <Area type="monotone" dataKey="Stocks" stackId="1" stroke="#4C6EF5" fill="#4C6EF5" />
            <Area type="monotone" dataKey="Crypto" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
            <Area type="monotone" dataKey="Forex" stackId="1" stroke="#10B981" fill="#10B981" />
            <Area type="monotone" dataKey="Commodities" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-4 text-sm">
        <h3 className="font-bold text-lg">Insights</h3>
        <p>Crypto allocation increased <span className="text-green-500 font-bold">15%</span> in the last 3 months.</p>
        <p>Stocks decreased <span className="text-red-500 font-bold">8%</span> due to market conditions.</p>
        <p>Last rebalancing was <span className="font-bold">15 days ago</span>.</p>
      </div>
    </div>
  );
};

export default HistoricalTrends;
