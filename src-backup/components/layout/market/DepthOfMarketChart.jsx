import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const generateDepthData = (count = 20) => {
    const bids = [];
    const asks = [];
    let price = 1.0845;
    let cumSize = 0;
    for (let i = 0; i < count; i++) {
        cumSize += Math.random() * 100;
        bids.push({ price: price.toFixed(4), size: cumSize });
        price -= 0.0001;
    }
    price = 1.0846;
    cumSize = 0;
    for (let i = 0; i < count; i++) {
        cumSize += Math.random() * 100;
        asks.push({ price: price.toFixed(4), size: cumSize });
        price += 0.0001;
    }
    return [...bids.reverse(), ...asks];
};

const DepthOfMarketChart = () => {
    const [data, setData] = useState(generateDepthData());

    useEffect(() => {
        const interval = setInterval(() => setData(generateDepthData()), 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h3 className="text-md font-semibold text-white mt-4 mb-2">Market Depth</h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <XAxis dataKey="price" stroke="#9CA3AF" fontSize={10} interval="preserveStartEnd" />
                        <YAxis stroke="#9CA3AF" fontSize={10} />
                        <Bar dataKey="size">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={parseFloat(entry.price) <= 1.0845 ? '#16C784' : '#EA3943'} opacity={0.4} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DepthOfMarketChart;
