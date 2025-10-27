import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Stocks', contribution: 4000 },
  { name: 'Crypto', contribution: 5000 },
  { name: 'Forex', contribution: -2000 },
  { name: 'Commodities', contribution: 1000 },
  { name: 'Total', contribution: 8000 },
];

const performers = {
  best: { name: 'Crypto', return: '+12.8%' },
  worst: { name: 'Forex', return: '-2.1%' },
};

const returns = [
  { period: '1M', twr: '2.5%' },
  { period: '3M', twr: '7.8%' },
  { period: '6M', twr: '15.2%' },
  { period: 'YTD', twr: '22.1%' },
  { period: '1Y', twr: '30.5%' },
];

const PerformanceAttribution: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Waterfall Chart */}
      <div className="bg-card-bg p-6 rounded-xl">
        <h3 className="text-lg font-bold mb-4">Contribution by Asset Class</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Legend />
            <Bar dataKey="contribution" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performers and Returns */}
      <div className="space-y-6">
        <div className="bg-card-bg p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4">Best/Worst Performers</h3>
          <div className="flex justify-around">
            <div>
              <p className="text-sm text-text-secondary">Best</p>
              <p className="text-xl font-bold text-green-500">{performers.best.name} ({performers.best.return})</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Worst</p>
              <p className="text-xl font-bold text-red-500">{performers.worst.name} ({performers.worst.return})</p>
            </div>
          </div>
        </div>
        <div className="bg-card-bg p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4">Time-Weighted Returns</h3>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Period</th>
                <th className="p-2">TWR</th>
              </tr>
            </thead>
            <tbody>
              {returns.map(r => (
                <tr key={r.period}>
                  <td className="p-2">{r.period}</td>
                  <td className="p-2">{r.twr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAttribution;

