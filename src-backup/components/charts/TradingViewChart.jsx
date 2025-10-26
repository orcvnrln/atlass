import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Generate mock data for the chart
const generateMockData = () => {
  const data = [];
  let lastClose = 100;
  const numPoints = 100;
  const date = new Date();

  for (let i = numPoints - 1; i >= 0; i--) {
    const newDate = new Date(date.getTime() - i * 24 * 60 * 60 * 1000);
    const open = lastClose;
    const close = open + (Math.random() - 0.48) * 5;
    lastClose = close;
    data.push({
      time: newDate.toLocaleDateString(),
      value: close,
    });
  }
  return data;
};

// Custom Tooltip for better styling
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-2 rounded-md text-sm shadow-lg">
          <p className="label text-gray-400">{`Date: ${label}`}</p>
          <p className="intro text-green-400">{`Price: $${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
};

const TradingViewChart = ({ symbol = 'BTC/USD' }) => {
  const data = useMemo(() => generateMockData(), [symbol]);
  const isPositive = data.length > 1 ? data[data.length - 1].value >= data[0].value : true;
  const strokeColor = isPositive ? '#26A69A' : '#EF5350';
  const gradientColor = isPositive ? 'rgba(38, 166, 154, 0.2)' : 'rgba(239, 83, 80, 0.2)';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={gradientColor} stopOpacity={0.8} />
            <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2E39" />
        <XAxis dataKey="time" stroke="#D9D9D9" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#D9D9D9" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value.toFixed(0)}`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="value" stroke={strokeColor} fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TradingViewChart;
