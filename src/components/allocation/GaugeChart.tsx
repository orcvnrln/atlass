import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value: number;
  target: number;
  label: string;
  color: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value, target, label, color }) => {
  const data = [
    { name: 'value', value: value },
    { name: 'remaining', value: 100 - value },
  ];

  const targetAngle = (target / 100) * 180;

  return (
    <div className="relative w-48 h-24">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={200} height={100}>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#374151" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div
        className="absolute bottom-0 left-1/2 w-0.5 h-4 bg-white transform -translate-x-1/2"
        style={{ transform: `translateX(-50%) rotate(${targetAngle}deg) translateY(-70px)` }}
      />
      <div className="absolute bottom-2 w-full text-center">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="text-lg font-bold text-text-primary">{value.toFixed(1)}%</p>
      </div>
    </div>
  );
};

export default GaugeChart;
