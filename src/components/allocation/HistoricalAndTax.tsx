import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const historyData = [
  { name: 'Jan', stocks: 40, crypto: 20, forex: 30, commodities: 10 },
  { name: 'Feb', stocks: 42, crypto: 25, forex: 23, commodities: 10 },
  { name: 'Mar', stocks: 38, crypto: 30, forex: 22, commodities: 10 },
  { name: 'Apr', stocks: 45, crypto: 28, forex: 17, commodities: 10 },
];

const taxData = [
  { position: 'AAPL', gainLoss: 5000, type: 'Unrealized Gain' },
  { position: 'GOOGL', gainLoss: -2000, type: 'Tax Loss Harvest' },
  { position: 'TSLA', gainLoss: 1000, type: 'Unrealized Gain' },
];

const HistoricalAndTax: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Historical Allocation Trends */}
      <div className="bg-card-bg p-6 rounded-xl">
        <h3 className="text-lg font-bold mb-4">Historical Allocation Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="stocks" stroke="#4C6EF5" />
            <Line type="monotone" dataKey="crypto" stroke="#F59E0B" />
            <Line type="monotone" dataKey="forex" stroke="#10B981" />
            <Line type="monotone" dataKey="commodities" stroke="#8B5CF6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tax Optimization Panel */}
      <div className="bg-card-bg p-6 rounded-xl">
        <h3 className="text-lg font-bold mb-4">Tax Optimization Panel</h3>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">Position</th>
              <th className="p-2">Gain/Loss</th>
              <th className="p-2">Opportunity</th>
            </tr>
          </thead>
          <tbody>
            {taxData.map(t => (
              <tr key={t.position}>
                <td className="p-2">{t.position}</td>
                <td className={`p-2 ${t.gainLoss > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${t.gainLoss.toLocaleString()}
                </td>
                <td className="p-2">{t.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoricalAndTax;

