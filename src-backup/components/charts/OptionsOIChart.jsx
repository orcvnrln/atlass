import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock Data Generation
const generateOptionsData = () => {
    const expiries = ['2024-10-25', '2024-11-29', '2024-12-27', '2025-03-28'];
    const strikes = Array.from({ length: 10 }, (_, i) => 40000 + i * 1000);
    
    const byExpiry = expiries.map(exp => ({
        expiry: exp,
        calls: Math.random() * 10000,
        puts: Math.random() * 10000,
    }));

    const byStrike = strikes.map(strike => ({
        strike: strike,
        calls: Math.random() * 5000,
        puts: Math.random() * 5000,
    }));

    const totalCalls = byExpiry.reduce((acc, curr) => acc + curr.calls, 0);
    const totalPuts = byExpiry.reduce((acc, curr) => acc + curr.puts, 0);

    return { byExpiry, byStrike, ratio: totalPuts / totalCalls };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const OIByExpiry = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
            <XAxis dataKey="expiry" tick={{ fill: '#9CA3AF' }} />
            <YAxis tick={{ fill: '#9CA3AF' }}/>
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            <Legend />
            <Bar dataKey="calls" stackId="a" fill="#22C55E" name="Calls" />
            <Bar dataKey="puts" stackId="a" fill="#EF4444" name="Puts" />
        </BarChart>
    </ResponsiveContainer>
);

const OIByStrike = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
            <XAxis dataKey="strike" tick={{ fill: '#9CA3AF' }} />
            <YAxis tick={{ fill: '#9CA3AF' }}/>
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
            <Legend />
            <Bar dataKey="calls" fill="#22C55E" name="Calls" />
            <Bar dataKey="puts" fill="#EF4444" name="Puts" />
        </BarChart>
    </ResponsiveContainer>
);

const OIRatio = ({ ratio }) => (
    <div className="flex flex-col items-center justify-center h-full">
        <h4 className="text-lg text-white mb-2">Put/Call Ratio</h4>
        <div className={`text-5xl font-bold ${ratio > 0.7 ? 'text-red-500' : 'text-green-500'}`}>
            {ratio.toFixed(2)}
        </div>
        <p className="text-sm text-gray-400 mt-2">
            {ratio > 0.7 ? 'Bearish Sentiment' : 'Bullish Sentiment'}
        </p>
    </div>
);

const OptionsOIChart = () => {
    const [activeTab, setActiveTab] = useState('expiry');
    const [data] = useState(generateOptionsData());

    const renderChart = () => {
        switch (activeTab) {
            case 'expiry':
                return <OIByExpiry data={data.byExpiry} />;
            case 'strike':
                return <OIByStrike data={data.byStrike} />;
            case 'ratio':
                return <OIRatio ratio={data.ratio} />;
            default:
                return null;
        }
    };
    
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-bold mb-4">Options Open Interest</h3>
            <div className="flex mb-4 border-b border-gray-700">
                <button onClick={() => setActiveTab('expiry')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'expiry' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>By Expiry</button>
                <button onClick={() => setActiveTab('strike')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'strike' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>By Strike</button>
                <button onClick={() => setActiveTab('ratio')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'ratio' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}>P/C Ratio</button>
            </div>
            <div>
                {renderChart()}
            </div>
        </div>
    );
};

export default OptionsOIChart;
