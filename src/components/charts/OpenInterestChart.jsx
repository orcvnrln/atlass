import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

const generateOpenInterestData = () => {
    return Array.from({ length: 30 }, (_, i) => {
        return {
            time: new Date(Date.now() - (30 - i) * 1000 * 60).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            longs: 1000 + Math.random() * 500,
            shorts: 1000 + Math.random() * 500,
            volume: Math.random() * 1000,
        };
    });
};

const OpenInterestChart = () => {
    const [data, setData] = useState(generateOpenInterestData());

    useEffect(() => {
        const interval = setInterval(() => {
            setData(prevData => {
                const newData = [...prevData.slice(1)];
                newData.push({
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    longs: newData[newData.length - 1].longs + (Math.random() - 0.5) * 50,
                    shorts: newData[newData.length - 1].shorts + (Math.random() - 0.5) * 50,
                    volume: Math.random() * 1000,
                });
                return newData;
            });
        }, 5000); // Update every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-800 p-4 rounded-lg h-96">
            <h3 className="text-white font-bold mb-4">Historical & Real-time OI with Volume Overlay</h3>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="time" tick={{ fill: '#9CA3AF' }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fill: '#9CA3AF' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fill: '#9CA3AF' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                        labelStyle={{ color: '#F9FAFB' }}
                    />
                    <Legend wrapperStyle={{ color: '#F9FAFB' }}/>
                    <Bar yAxisId="right" dataKey="volume" fill="#82ca9d" name="Volume" />
                    <Line yAxisId="left" type="monotone" dataKey="longs" stroke="#8884d8" name="Longs" dot={false} />
                    <Line yAxisId="left" type="monotone" dataKey="shorts" stroke="#ff7300" name="Shorts" dot={false} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OpenInterestChart;
