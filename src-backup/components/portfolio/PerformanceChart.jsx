import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import Card from '@/components/dashboard/Card';

const PerformanceChart = ({ data }) => {
  return (
    <Card title="Performance Over Time" className="col-span-1 md:col-span-2 lg:col-span-2">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="portfolioPerformance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#111827" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${(value / 1000)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                borderColor: '#374151',
                color: '#F9FAFB',
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
            />
            <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#portfolioPerformance)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PerformanceChart;
