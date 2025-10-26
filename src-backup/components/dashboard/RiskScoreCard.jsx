import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Card from './Card';

const RiskScoreCard = ({ value }) => {
    const data = [{ value: value }, { value: 10 - value }];
    const color = value < 4 ? '#16C784' : value < 7 ? '#F59E0B' : '#EA3943';

  return (
    <Card title="Risk Score">
        <div className="w-full h-24 relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" dataKey="value" innerRadius="70%" outerRadius="90%" startAngle={180} endAngle={0}>
                        <Cell fill={color} />
                        <Cell fill="#374151" />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-white">
                {value.toFixed(2)}
            </div>
        </div>
    </Card>
  );
};

export default RiskScoreCard;
