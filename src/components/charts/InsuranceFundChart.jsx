import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const generateInsuranceData = () => {
    let value = 1000000;
    return Array.from({ length: 30 }, (_, i) => {
        value += Math.random() * 10000;
        return {
            date: new Date(Date.now() - (30 - i) * 86400000).toLocaleDateString(),
            value: value,
        };
    });
};

const InsuranceFundChart = () => {
    const [data, setData] = useState(generateInsuranceData());

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prevData => {
                const newData = [...prevData.slice(1)];
                const lastValue = newData[newData.length - 1].value;
                newData.push({
                    date: new Date().toLocaleDateString(),
                    value: lastValue + Math.random() * 10000,
                });
                return newData;
            });
        }, 3000); // Update every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-bold mb-4">Insurance Fund History</h3>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <XAxis dataKey="date" tick={{ fill: '#9CA3AF' }} />
                        <YAxis tick={{ fill: '#9CA3AF' }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                            formatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default InsuranceFundChart;
