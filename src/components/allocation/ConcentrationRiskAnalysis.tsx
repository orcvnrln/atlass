import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const TABS = ['By Asset Class', 'By Individual Asset', 'By Sector', 'By Geography'];

const assetClassData = [
  { name: 'Stocks', value: 35.4, color: '#4C6EF5' },
  { name: 'Crypto', value: 29.9, color: '#F59E0B' },
  { name: 'Forex', value: 19.7, color: '#10B981' },
  { name: 'Commodities', value: 9.4, color: '#8B5CF6' },
  { name: 'Bonds', value: 5.5, color: '#6B7280' },
];

const individualAssetData = [
    { rank: 1, asset: 'BTC', value: '$45,000', weight: '35.4%', risk: 'High', correlation: 0.85 },
    { rank: 2, asset: 'AAPL', value: '$15,000', weight: '11.8%', risk: 'Medium', correlation: 0.65 },
];

const sectorData = [
    { name: 'Technology', value: 12, color: '#3B82F6' },
    { name: 'Healthcare', value: 8, color: '#10B981' },
];

const geoData = [
    { name: 'US', value: 45 },
    { name: 'Europe', value: 25 },
    { name: 'Asia', value: 20 },
];

const ConcentrationRiskAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const renderContent = () => {
    switch (activeTab) {
      case 'By Asset Class':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={assetClassData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={80} stroke="#888" />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'By Individual Asset':
        return (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-color"><th className="text-left p-2">Rank</th><th className="text-left">Asset</th><th>Value</th><th>% of Portfolio</th><th>Risk</th><th>Correlation</th></tr></thead>
            <tbody>
              {individualAssetData.map(d => (
                <tr key={d.rank}><td className="p-2">{d.rank}</td><td>{d.asset}</td><td>{d.value}</td><td>{d.weight}</td><td>{d.risk}</td><td>{d.correlation}</td></tr>
              ))}
            </tbody>
          </table>
        );
      case 'By Sector':
        return (
            <ResponsiveContainer width="100%" height={200}>
                <PieChart><Pie data={sectorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>{sectorData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
        );
      case 'By Geography':
        return (
            <div>{geoData.map(d => <div key={d.name}>{d.name}: {d.value}%</div>)}</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card-bg p-6 rounded-lg border border-border-color">
      <h2 className="text-xl font-bold mb-4">Concentration Risk Analysis</h2>
      <div className="flex border-b border-border-color mb-4">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? 'border-b-2 border-accent text-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}>
            {tab}
          </button>
        ))}
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default ConcentrationRiskAnalysis;
