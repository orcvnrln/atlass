import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '@/components/dashboard/Card';
import { motion } from 'framer-motion';

const attributionData = [
  { name: 'BTC Long', contribution: 6200, color: '#16C784' },
  { name: 'EUR/USD Short', contribution: 2500, color: '#16C784' },
  { name: 'SPX500 Index', contribution: 1500, color: '#16C784' },
  { name: 'TSLA Earnings Miss', contribution: -1200, color: '#EA3943' },
  { name: 'GOLD Hedge', contribution: -800, color: '#EA3943' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card-bg p-2 border border-border-color rounded-md">
        <p className="font-bold">{`${payload[0].payload.name}`}</p>
        <p style={{ color: payload[0].payload.color }}>
          {`Contribution: $${payload[0].value.toLocaleString()}`}
        </p>
      </div>
    );
  }
  return null;
};

const AttributionAnalysis = () => {
  return (
    <Card title="Performance Attribution">
      <p className="text-sm text-text-secondary mb-4">
        Analyzes the key drivers of your portfolio's performance.
      </p>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={attributionData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis 
                dataKey="name" 
                type="category" 
                width={120} 
                tickLine={false} 
                axisLine={false} 
                stroke="var(--text-secondary)"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}/>
            <Bar dataKey="contribution" radius={[0, 5, 5, 0]}>
              {attributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center text-xs text-text-secondary">
          <p>💡 AI Insight: Your aggressive position in Bitcoin was the largest contributor to recent gains, accounting for over 60% of the positive performance.</p>
      </div>
    </Card>
  );
};

export default AttributionAnalysis;
