import React, { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const generateTimeseriesData = (length = 30, variance = 100, start = 500) => {
    return Array.from({ length }, (_, i) => ({
        time: new Date(Date.now() - (length - i) * 3600000).toLocaleTimeString([], { hour: '2-digit' }),
        value: start + (Math.random() - 0.5) * variance,
    }));
};

const MiniLineChart = ({ data, title, dataKey, color }) => (
    <div className="bg-gray-700 p-4 rounded-lg flex-1">
        <h4 className="text-white font-bold mb-4">{title}</h4>
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
                <XAxis dataKey="time" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const FundingRateHistoryChart = ({ data }) => (
     <div className="bg-gray-700 p-4 rounded-lg flex-1">
        <h4 className="text-white font-bold mb-4">Funding Rate History</h4>
        <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="green" stopOpacity={0.5}/>
                        <stop offset="100%" stopColor="red" stopOpacity={0.5}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="url(#splitColor)" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

const FundingRateChart = () => {
    const [fundingData, setFundingData] = useState(generateTimeseriesData(24, 0.01, 0.005));
    const [premiumData, setPremiumData] = useState(generateTimeseriesData(24, 200, 100));
    const [borrowData, setBorrowData] = useState(generateTimeseriesData(24, 0.5, 1.5));

    useEffect(() => {
        const interval = setInterval(() => {
            setFundingData(d => [...d.slice(1), { time: new Date().toLocaleTimeString([], { hour: '2-digit' }), value: d[d.length - 1].value + (Math.random() - 0.5) * 0.001 }]);
            setPremiumData(d => [...d.slice(1), { time: new Date().toLocaleTimeString([], { hour: '2-digit' }), value: d[d.length - 1].value + (Math.random() - 0.5) * 20 }]);
            setBorrowData(d => [...d.slice(1), { time: new Date().toLocaleTimeString([], { hour: '2-digit' }), value: d[d.length - 1].value + (Math.random() - 0.5) * 0.05 }]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
             <h3 className="text-white font-bold mb-4">Funding, Rates & Premiums</h3>
            <div className="flex gap-4">
                <FundingRateHistoryChart data={fundingData} />
                <MiniLineChart data={premiumData} title="Premium Index" dataKey="value" color="#82ca9d" />
                <MiniLineChart data={borrowData} title="Margin Borrow Rate" dataKey="value" color="#ffc658" />
            </div>
        </div>
    );
};

export default FundingRateChart;
