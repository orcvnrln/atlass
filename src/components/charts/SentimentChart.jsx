import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock Data Generation
const generateMaxPainData = () => {
    return Array.from({ length: 10 }, (_, i) => ({
        strike: 40000 + i * 1000,
        loss: Math.random() * 1000000,
    })).sort((a,b) => a.strike - b.strike);
};

const generateLongShortRatioData = (length = 30) => {
    return Array.from({ length }, (_, i) => ({
        time: new Date(Date.now() - (length - i) * 3600000).toLocaleTimeString([], { hour: '2-digit' }),
        ratio: 0.8 + Math.random() * 0.4,
    }));
};

const bitcoinDominanceData = [
    { name: 'Bitcoin', value: 45 },
    { name: 'Ethereum', value: 25 },
    { name: 'Altcoins', value: 30 },
];
const COLORS = ['#FFBB28', '#8884d8', '#82ca9d'];

const MaxPainChart = ({ data }) => {
    const maxPainStrike = data.reduce((min, p) => p.loss < min.loss ? p : min, data[0]);
    return (
        <div className="bg-gray-700 p-4 rounded-lg h-80">
            <h4 className="text-white font-bold mb-4">Max Pain (Options)</h4>
            <p className="text-sm text-gray-300 mb-2">Max Pain Strike: <span className="font-bold text-lg text-yellow-400">${maxPainStrike.strike.toLocaleString()}</span></p>
            <ResponsiveContainer width="100%" height="calc(100% - 30px)">
                <BarChart data={data}>
                    <XAxis dataKey="strike" tick={{ fill: '#9CA3AF' }} tickFormatter={(val) => `$${val/1000}k`} />
                    <YAxis tick={{ fill: '#9CA3AF' }} tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937' }} formatter={(val) => `$${val.toLocaleString()}`}/>
                    <Bar dataKey="loss" name="Total Loss">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.strike === maxPainStrike.strike ? '#FFBB28' : '#8884d8'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const LongShortRatioChart = ({ data }) => (
    <div className="bg-gray-700 p-4 rounded-lg h-80">
        <h4 className="text-white font-bold mb-4">Long/Short Ratio</h4>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <XAxis dataKey="time" tick={{ fill: '#9CA3AF' }} />
                <YAxis domain={[0.6, 1.4]} tick={{ fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937' }} />
                <Line type="monotone" dataKey="ratio" stroke="#82ca9d" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const BitcoinDominanceChart = ({ data }) => (
    <div className="bg-gray-700 p-4 rounded-lg h-80 flex flex-col items-center">
        <h4 className="text-white font-bold mb-4">Bitcoin Dominance</h4>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1F2937' }}/>
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
);

const SentimentChart = () => {
    const [maxPainData] = useState(generateMaxPainData());
    const [longShortData, setLongShortData] = useState(generateLongShortRatioData());
    
    useEffect(() => {
        const interval = setInterval(() => {
            setLongShortData(d => [...d.slice(1), {
                time: new Date().toLocaleTimeString([], { hour: '2-digit' }),
                ratio: 0.8 + Math.random() * 0.4
            }]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-bold mb-4">Sentiment Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MaxPainChart data={maxPainData} />
                <LongShortRatioChart data={longShortData} />
                <BitcoinDominanceChart data={bitcoinDominanceData} />
            </div>
        </div>
    );
};

export default SentimentChart;
