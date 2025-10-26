import React from 'react';
import Card from '@/components/dashboard/Card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const DrawdownTracker = ({ data }) => {
    return (
        <Card title="Drawdown Tracker" className="col-span-1">
             <p className="text-sm text-text-secondary mb-4">
                Tracks the largest peak-to-trough declines in your portfolio's history.
            </p>
            <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="drawdownFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EA3943" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#121825" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                        <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value}%`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                            formatter={(value) => [`${value.toFixed(2)}%`, 'Drawdown']}
                        />
                        <Area type="monotone" dataKey="drawdown" stroke="#EA3943" strokeWidth={2} fillOpacity={1} fill="url(#drawdownFill)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 p-2 bg-primary-bg rounded-lg">
                <p className="text-sm text-accent">💡 AI Insight: The max drawdown of -8.45% occurred in April. Consider reviewing risk management for that period.</p>
            </div>
        </Card>
    );
};

export default DrawdownTracker;
