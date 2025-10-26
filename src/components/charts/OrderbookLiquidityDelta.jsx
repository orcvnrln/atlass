import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const generateDeltaData = () => {
    return Array.from({ length: 30 }, (_, i) => {
        const delta = (Math.random() - 0.5) * 1000;
        return {
            time: new Date(Date.now() - (30 - i) * 1000).toLocaleTimeString(),
            delta: delta,
        };
    });
};

const OrderbookLiquidityDelta = () => {
    const [data, setData] = useState(generateDeltaData());

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prevData => {
                const newData = [...prevData.slice(1)];
                const newDelta = (Math.random() - 0.5) * 1000;
                newData.push({
                    time: new Date().toLocaleTimeString(),
                    delta: newDelta,
                });
                return newData;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-800 p-4 rounded-lg h-80">
            <h3 className="text-white font-bold mb-4">Orderbook Liquidity Delta</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="time" tick={{ fill: '#9CA3AF' }} />
                    <YAxis tick={{ fill: '#9CA3AF' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                        labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Bar dataKey="delta">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.delta >= 0 ? '#22C55E' : '#EF4444'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OrderbookLiquidityDelta;
