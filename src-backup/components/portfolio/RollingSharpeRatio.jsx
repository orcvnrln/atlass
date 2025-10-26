import React from 'react';
import Card from '@/components/dashboard/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const RollingSharpeRatio = ({ data }) => {
    return (
        <Card title="Rolling Sharpe Ratio (90-day)" className="col-span-1">
             <p className="text-sm text-text-secondary mb-4">
                Measures risk-adjusted return over time to evaluate performance consistency.
            </p>
            <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                            formatter={(value) => [value.toFixed(2), 'Sharpe Ratio']}
                        />
                        <Line type="monotone" dataKey="ratio" stroke="#4C6EF5" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default RollingSharpeRatio;
