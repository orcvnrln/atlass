import React from 'react';
import Card from '@/components/dashboard/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PeerBenchmarking = ({ data }) => {
    return (
        <Card title="Peer Benchmarking (30-day)" className="col-span-1">
             <p className="text-sm text-text-secondary mb-4">
                Compare your portfolio's performance against market benchmarks and other user groups.
            </p>
            <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value}%`} />
                        <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={12} width={100} />
                        <Tooltip
                            cursor={{ fill: 'rgba(76, 110, 245, 0.1)' }}
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' }}
                            formatter={(value) => [`${value.toFixed(2)}%`, 'Return']}
                        />
                        <Bar dataKey="return">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.name === 'My Portfolio' ? '#4C6EF5' : '#374151'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default PeerBenchmarking;
